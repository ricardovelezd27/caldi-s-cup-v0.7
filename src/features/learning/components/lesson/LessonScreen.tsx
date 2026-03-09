import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLesson } from "../../hooks/useLesson";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { useAnonymousProgress } from "../../hooks/useAnonymousProgress";
import { useHearts } from "../../hooks/useHearts";
import { useStreak } from "../../hooks/useStreak";
import { useDailyGoal } from "../../hooks/useDailyGoal";
import { useAchievements } from "../../hooks/useAchievements";
import { calculateLessonXP } from "../../services/xpService";
import { updateStreakViaRPC, addXPToDaily } from "../../services/streakService";
import { addWeeklyXP } from "../../services/leagueService";
import { upsertLessonProgress, getLessonProgress } from "../../services/progressService";
import { PageLayout } from "@/components/layout";
import { LessonIntro } from "./LessonIntro";
import { LessonProgress } from "./LessonProgress";
import { LessonComplete } from "./LessonComplete";
import { ExerciseRenderer } from "./ExerciseRenderer";
import { BottomActionBar } from "../exercises/base/BottomActionBar";
import { SignupPrompt } from "../gamification/SignupPrompt";
import { HeartsEmptyModal } from "../gamification/HeartsEmptyModal";
import { AchievementUnlock } from "../gamification/AchievementUnlock";
import { Skeleton } from "@/components/ui/skeleton";
import type { XPCalculation } from "../../services/xpService";
import type { LearningAchievement } from "../../types";

interface LessonScreenProps {
  lessonId: string;
  trackId: string;
  trackRoute: string;
  onExit: () => void;
  onComplete: () => void;
}

export function LessonScreen({ lessonId, trackId, trackRoute, onExit, onComplete }: LessonScreenProps) {
  const { user, refreshProfile } = useAuth();
  const { t, language } = useLanguage();
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

  const handleSubmitAnswer = useCallback(
    (answer: any, isCorrect: boolean) => {
      lesson.submitAnswer(isCorrect, answer);
      if (!isCorrect && user) {
        loseHeart().then(() => {
          if (hearts <= 1) setShowHeartsEmpty(true);
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
      const existingProgress = await getLessonProgress(user.id, lessonId);
      const isReviewAttempt = !!existingProgress?.isCompleted;
      setIsReview(isReviewAttempt);

      const fullBaseXp = lesson.lesson?.xpReward ?? 10;
      const baseXpReward = isReviewAttempt ? REVIEW_XP_BASE : fullBaseXp;
      const currentStreak = streak?.currentStreak ?? 0;
      const today = new Date().toISOString().split("T")[0];
      const isFirstToday = streak?.lastActivityDate !== today;

      const xpCalc = calculateLessonXP(
        baseXpReward,
        lesson.score.correct,
        lesson.score.total,
        lesson.timeSpent,
        currentStreak,
        isFirstToday,
      );
      setXpResult(xpCalc);

      const [streakResult] = await Promise.all([
        updateStreakViaRPC(user.id, xpCalc.totalXP),
        addXPToDaily(user.id, xpCalc.totalXP),
        addWeeklyXP(user.id, xpCalc.totalXP).catch(() => {}),
      ]);

      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("total_xp")
        .eq("id", user.id)
        .single();
      const newTotalXp = ((currentProfile as any)?.total_xp ?? 0) + xpCalc.totalXP;
      await supabase.from("profiles").update({ total_xp: newTotalXp }).eq("id", user.id);

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
      refreshProfile();
    }
  }, [user, lesson, lessonId, streak, anonymousProgress, onComplete, addDailyXP, checkAndUnlockAchievements]);

  // --- Back link component ---
  const BackLink = () => (
    <Link
      to={trackRoute}
      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-inter text-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      {t("learn.backToTrack")}
    </Link>
  );

  // --- LOADING ---
  if (lesson.state === "loading") {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <BackLink />
          <div className="mt-6 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </PageLayout>
    );
  }

  // --- INTRO ---
  if (lesson.state === "intro") {
    const lessonData = lesson.lesson;
    const lessonName = lessonData ? (language === "es" ? lessonData.nameEs : lessonData.name) : undefined;
    const introText = lessonData ? (language === "es" ? lessonData.introTextEs : lessonData.introText) : undefined;

    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <BackLink />
          <LessonIntro
            lessonName={lessonName}
            introText={introText}
            estimatedMinutes={lessonData?.estimatedMinutes}
            xpReward={lessonData?.xpReward}
            onStart={lesson.startLesson}
          />
        </div>
      </PageLayout>
    );
  }

  // --- EXERCISE + FEEDBACK (immersive) ---
  if ((lesson.state === "exercise" || lesson.state === "feedback") && lesson.currentExercise) {
    const isFeedback = lesson.state === "feedback";
    const feedbackQd = lesson.currentExercise?.questionData as any;
    const explanation = feedbackQd?.explanation;
    const mascot = (lesson.currentExercise?.mascot as "caldi" | "goat") ?? "caldi";

    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <LessonProgress
          current={lesson.currentIndex + 1}
          total={lesson.exercises.length}
          onExit={onExit}
          hearts={user ? hearts : undefined}
          maxHearts={user ? maxHearts : undefined}
        />
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
          <ExerciseRenderer
            key={lesson.currentExercise.id}
            exercise={lesson.currentExercise}
            onAnswer={handleSubmitAnswer}
            disabled={(!hasHearts && !!user) || isFeedback}
          />
        </div>
        {isFeedback && (
          <BottomActionBar
            state={lesson.lastAnswerCorrect ? "correct" : "incorrect"}
            onClick={lesson.nextExercise}
            explanation={explanation}
            mascot={mascot}
          />
        )}
        <HeartsEmptyModal
          open={showHeartsEmpty}
          onOpenChange={setShowHeartsEmpty}
          timeUntilNextHeart={null}
        />
      </div>
    );
  }

  // --- COMPLETE ---
  if (lesson.state === "complete") {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <BackLink />
          <LessonComplete
            correct={lesson.score.correct}
            total={lesson.score.total}
            xpEarned={xpResult?.totalXP ?? lesson.lesson?.xpReward ?? 10}
            xpBreakdown={xpResult ?? undefined}
            timeSpent={lesson.timeSpent}
            onBackToTrack={handleLessonDone}
            isProcessing={isProcessingComplete}
            isReview={isReview}
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
                  if (remaining.length === 0) onComplete();
                }
              }}
            />
          )}
        </div>
      </PageLayout>
    );
  }

  // Fallback
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <BackLink />
        <LessonIntro onStart={lesson.startLesson} />
      </div>
    </PageLayout>
  );
}
