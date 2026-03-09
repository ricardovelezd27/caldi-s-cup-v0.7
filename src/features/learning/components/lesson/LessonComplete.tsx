import { useLanguage } from "@/contexts/language";
import { MascotCharacter } from "../mascot/MascotCharacter";
import { XPCounter } from "../gamification/XPCounter";
import { XPGainAnimation } from "../gamification/XPGainAnimation";
import { Button } from "@/components/ui/button";
import type { XPCalculation } from "../../services/xpService";

interface LessonCompleteProps {
  correct: number;
  total: number;
  xpEarned: number;
  xpBreakdown?: XPCalculation;
  timeSpent: number;
  onNext?: () => void;
  onBackToTrack: () => void;
  isProcessing?: boolean;
  isReview?: boolean;
}

export function LessonComplete({
  correct,
  total,
  xpEarned,
  xpBreakdown,
  timeSpent,
  onNext,
  onBackToTrack,
  isProcessing,
  isReview,
}: LessonCompleteProps) {
  const { t } = useLanguage();
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Confetti-like emoji rain */}
      <div className="relative mb-4">
        <span className="absolute -top-4 -left-6 text-2xl animate-bounce">☕</span>
        <span className="absolute -top-2 left-8 text-xl animate-bounce delay-100">🎉</span>
        <span className="absolute -top-4 right-0 text-2xl animate-bounce delay-200">⭐</span>
        <MascotCharacter mascot="caldi" mood="celebrating" size="lg" />
      </div>

      <h2 className="font-bangers text-3xl text-foreground tracking-wide mb-2">
        {t("learn.lessonComplete")}
      </h2>
      <p className="text-muted-foreground font-inter mb-4">{t("learn.greatJob")}</p>

      <div className="relative mb-2">
        <XPCounter xp={xpEarned} className="mb-2" />
        <XPGainAnimation amount={xpEarned} />
      </div>

      {/* XP Breakdown */}
      {xpBreakdown && (
        <div className="bg-card border-4 border-border rounded-lg p-3 mb-4 text-sm font-inter text-left w-full max-w-xs shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("gamification.baseXP")}</span>
            <span className="font-bold text-foreground">+{xpBreakdown.baseXP}</span>
          </div>
          {xpBreakdown.bonuses.perfect > 0 && (
            <div className="flex justify-between text-green-600">
              <span>💯 {t("gamification.perfectBonus")}</span>
              <span className="font-bold">+{xpBreakdown.bonuses.perfect}</span>
            </div>
          )}
          {xpBreakdown.bonuses.speed > 0 && (
            <div className="flex justify-between text-blue-600">
              <span>⚡ {t("gamification.speedBonus")}</span>
              <span className="font-bold">+{xpBreakdown.bonuses.speed}</span>
            </div>
          )}
          {xpBreakdown.bonuses.streak > 0 && (
            <div className="flex justify-between text-orange-600">
              <span>🔥 {t("gamification.streakBonus")}</span>
              <span className="font-bold">+{xpBreakdown.bonuses.streak}</span>
            </div>
          )}
          {xpBreakdown.bonuses.firstOfDay > 0 && (
            <div className="flex justify-between text-purple-600">
              <span>🌅 {t("gamification.firstOfDayBonus")}</span>
              <span className="font-bold">+{xpBreakdown.bonuses.firstOfDay}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-6 mb-8 text-sm font-inter text-muted-foreground">
        <div>
          <span className="font-bold text-foreground">{percent}%</span> {t("learn.score")}
        </div>
        <div>
          <span className="font-bold text-foreground">
            {correct}/{total}
          </span>{" "}
          {t("learn.exercise.correct")}
        </div>
        <div>
          <span className="font-bold text-foreground">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>{" "}
          {t("learn.timeSpent")}
        </div>
      </div>

      <div className="flex gap-3">
        {onNext && (
          <Button onClick={onNext} className="font-bangers tracking-wide">
            {t("learn.nextLesson")}
          </Button>
        )}
        <Button
          onClick={onBackToTrack}
          variant="outline"
          className="font-bangers tracking-wide"
          disabled={isProcessing}
        >
          {isProcessing ? t("common.loading") : t("learn.backToTrack")}
        </Button>
      </div>
    </div>
  );
}
