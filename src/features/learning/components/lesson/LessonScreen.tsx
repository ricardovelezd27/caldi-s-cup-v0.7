import { useState, useCallback } from "react";
import { useLesson } from "../../hooks/useLesson";
import { useAuth } from "@/contexts/auth";
import { useAnonymousProgress } from "../../hooks/useAnonymousProgress";
import { useHearts } from "../../hooks/useHearts";
import { useStreak } from "../../hooks/useStreak";
import { useDailyGoal } from "../../hooks/useDailyGoal";
import { useAchievements } from "../../hooks/useAchievements";
import { calculateLessonXP } from "../../services/xpService";
import { updateStreakViaRPC, addXPToDaily } from "../../services/streakService";
import { addWeeklyXP } from "../../services/leagueService";
import { upsertLessonProgress, getLessonProgress } from "../../services/progressService";
import { LessonIntro } from "./LessonIntro";
import { LessonProgress } from "./LessonProgress";
import { LessonComplete } from "./LessonComplete";
import { ExerciseRenderer } from "./ExerciseRenderer";
import { ExerciseFeedback } from "../exercises/base/ExerciseFeedback";
import { SignupPrompt } from "../gamification/SignupPrompt";
import { HeartsEmptyModal } from "../gamification/HeartsEmptyModal";
import { AchievementUnlock } from "../gamification/AchievementUnlock";
import { Skeleton } from "@/components/ui/skeleton";
import type { XPCalculation } from "../../services/xpService";
import type { LearningAchievement } from "../../types";

interface LessonScreenProps {
  lessonId: string;
  trackId: string;
  onExit: () => void;
  onComplete: () => void;
}

export function LessonScreen({ lessonId, trackId, onExit, onComplete }: LessonScreenProps) {
  const { user } = useAuth();
  const lesson = useLesson(lessonId);
  const anonymousProgress = useAnonymousProgress();
  const { hearts, maxHearts, hasHearts, loseHeart, isLoading: heartsLoading } = useHearts();
  const { streak } = useStreak();
  const { addXP: addDailyXP } = useDailyGoal();
  const { checkAndUnlock: checkAndUnlockAchievements } = useAchievements();

  const [showSignup, setShowSignup] = useState(false);
  const [showHeartsEmpty, setShowHeartsEmpty] = useState(false);
  const [xpResult, setXpResult] = useState<XPCalculation | null>(null);
  const [newAchievements, setNewAchievements] = useState<LearningAchievement[]>([]);
  const [showAchievement, setShowAchievement] = useState<LearningAchievement | null>(null);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [isReview, setIsReview] = useState(false);

  // Handle wrong answer: deduct heart for authenticated users
  const handleSubmitAnswer = useCallback(
    (answer: any, isCorrect: boolean) => {
      lesson.submitAnswer(isCorrect, answer);

      if (!isCorrect && user) {
        loseHeart().then(() => {
          // Check if hearts depleted (use current - 1 since mutation is async)
          if (hearts <= 1) {
            setShowHeartsEmpty(true);
          }
        });
      }
    },
    [lesson, user, loseHeart, hearts],
  );

  const REVIEW_XP_BASE = 5;

  const handleLessonDone = useCallback(async () => {
    if (!user) {
      anonymousProgress.completeLesson(lessonId, 10);
      if (anonymousProgress.shouldShowSignupPrompt || anonymousProgress.shouldForceSignup) {
        setShowSignup(true);
        return;
      }
      onComplete();
      return;
    }

    setIsProcessingComplete(true);
    try {
      // Check if this is a review (lesson already completed)
      const existingProgress = await getLessonProgress(user.id, lessonId);
      const isReviewAttempt = !!existingProgress?.isCompleted;
      setIsReview(isReviewAttempt);

      const fullBaseXp = lesson.lesson?.xpReward ?? 10;
      const baseXpReward = isReviewAttempt ? REVIEW_XP_BASE : fullBaseXp;
      const currentStreak = streak?.currentStreak ?? 0;
      const today = new Date().toISOString().split("T")[0];
      const isFirstToday = streak?.lastActivityDate !== today;

      // 1. Calculate XP (reduced base for reviews)
      const xpCalc = calculateLessonXP(
        baseXpReward,
        lesson.score.correct,
        lesson.score.total,
        lesson.timeSpent,
        currentStreak,
        isFirstToday,
      );
      setXpResult(xpCalc);

      // 2-4. Update streak + daily goal + league (parallel)
      const [streakResult] = await Promise.all([
        updateStreakViaRPC(user.id, xpCalc.totalXP),
        addXPToDaily(user.id, xpCalc.totalXP),
        addWeeklyXP(user.id, xpCalc.totalXP).catch(() => {}), // Non-critical
      ]);

      // 5. Save lesson progress
      const scorePercent =
        lesson.score.total > 0
          ? Math.round((lesson.score.correct / lesson.score.total) * 100)
          : 0;

      await upsertLessonProgress({
        userId: user.id,
        lessonId,
        isCompleted: true,
        scorePercent,
        exercisesCorrect: lesson.score.correct,
        exercisesTotal: lesson.score.total,
        timeSpentSeconds: lesson.timeSpent,
        xpEarned: xpCalc.totalXP,
      });

      // 6. Check achievements
      const unlocked = await checkAndUnlockAchievements({
        currentStreak: streakResult.currentStreak,
        totalLessonsCompleted: streakResult.totalLessonsCompleted,
      } as any);
      if (unlocked.length > 0) {
        setNewAchievements(unlocked);
        setShowAchievement(unlocked[0]);
      }
    } catch (err) {
      console.error("Gamification update failed:", err);
    } finally {
      setIsProcessingComplete(false);
    }
  }, [
    user,
    lesson,
    lessonId,
    streak,
    anonymousProgress,
    onComplete,
    addDailyXP,
    checkAndUnlockAchievements,
  ]);

  if (lesson.state === "loading") {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (lesson.state === "intro") {
    return <LessonIntro onStart={lesson.startLesson} />;
  }

  if (lesson.state === "exercise" && lesson.currentExercise) {
    return (
      <div className="flex flex-col min-h-screen">
        <LessonProgress
          current={lesson.currentIndex + 1}
          total={lesson.exercises.length}
          onExit={onExit}
          hearts={user ? hearts : undefined}
          maxHearts={user ? maxHearts : undefined}
        />
        <ExerciseRenderer
          key={lesson.currentExercise.id}
          exercise={lesson.currentExercise}
          onAnswer={handleSubmitAnswer}
          disabled={!hasHearts && !!user}
        />
        <HeartsEmptyModal
          open={showHeartsEmpty}
          onOpenChange={setShowHeartsEmpty}
          timeUntilNextHeart={null}
        />
      </div>
    );
  }

  if (lesson.state === "feedback") {
    const feedbackExercise = lesson.currentExercise;
    const feedbackQd = feedbackExercise?.questionData as any;
    const explanation = feedbackQd?.explanation;
    const mascot = (feedbackExercise?.mascot as "caldi" | "goat") ?? "caldi";
    return (
      <div className="flex flex-col min-h-screen">
        <LessonProgress
          current={lesson.currentIndex + 1}
          total={lesson.exercises.length}
          onExit={onExit}
          hearts={user ? hearts : undefined}
          maxHearts={user ? maxHearts : undefined}
        />
        <div className="flex-1 flex items-end">
          <ExerciseFeedback
            isCorrect={lesson.lastAnswerCorrect ?? false}
            explanation={explanation}
            mascot={mascot}
            onContinue={lesson.nextExercise}
          />
        </div>
      </div>
    );
  }

  if (lesson.state === "complete") {
    return (
      <>
        <LessonComplete
          correct={lesson.score.correct}
          total={lesson.score.total}
          xpEarned={xpResult?.totalXP ?? lesson.lesson?.xpReward ?? 10}
          xpBreakdown={xpResult ?? undefined}
          timeSpent={lesson.timeSpent}
          onBackToTrack={handleLessonDone}
          isProcessing={isProcessingComplete}
        />
        <SignupPrompt
          open={showSignup}
          onOpenChange={setShowSignup}
          onMaybeLater={() => {
            anonymousProgress.dismissSignupPrompt();
            setShowSignup(false);
            onComplete();
          }}
          forceful={anonymousProgress.shouldForceSignup}
        />
        {showAchievement && (
          <AchievementUnlock
            achievement={showAchievement}
            open={!!showAchievement}
            onOpenChange={(open) => {
              if (!open) {
                const remaining = newAchievements.filter((a) => a.id !== showAchievement.id);
                setShowAchievement(remaining[0] ?? null);
                if (remaining.length === 0) {
                  onComplete();
                }
              }
            }}
          />
        )}
      </>
    );
  }

  return <LessonIntro onStart={lesson.startLesson} />;
}
