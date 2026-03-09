import { useLanguage } from "@/contexts/language";
import { cn } from "@/lib/utils";
import { Check, X, Flag } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getRandomDialogue } from "../../data/mascotDialogues";
import { useState } from "react";
import { ReportExerciseErrorDialog } from "./ReportExerciseErrorDialog";

interface FeedbackModalProps {
  open: boolean;
  isCorrect: boolean;
  explanation?: string;
  mascot?: "caldi" | "goat";
  exerciseId: string;
  lessonId: string;
  onContinue: () => void;
}

export function FeedbackModal({
  open,
  isCorrect,
  explanation,
  mascot = "caldi",
  exerciseId,
  lessonId,
  onContinue,
}: FeedbackModalProps) {
  const { t } = useLanguage();
  const [showReport, setShowReport] = useState(false);
  const dialogue = getRandomDialogue(mascot, isCorrect ? "correct" : "incorrect");

  const label = isCorrect
    ? t("learn.exercise.continue")
    : t("learn.exercise.gotIt") ?? "Got it";

  return (
    <>
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent
          className={cn(
            "sm:max-w-md border-2 rounded-xl p-0 overflow-hidden gap-0",
            isCorrect
              ? "border-[hsl(142_71%_45%)]"
              : "border-accent",
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">
            {isCorrect ? t("learn.exercise.correct") : t("learn.exercise.incorrect")}
          </DialogTitle>

          {/* Header band */}
          <div
            className={cn(
              "flex items-center gap-3 px-6 pt-6 pb-4",
              isCorrect ? "bg-[hsl(142_76%_90%)]" : "bg-accent/10",
            )}
          >
            {isCorrect ? (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(142_71%_45%)] flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            ) : (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </div>
            )}
            <p className="font-bangers text-2xl text-foreground tracking-wide">
              {isCorrect ? t("learn.exercise.correct") : t("learn.exercise.incorrect")}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-4 space-y-3">
            {dialogue && (
              <p className="text-sm font-inter text-muted-foreground italic">
                "{dialogue}"
              </p>
            )}
            {explanation && (
              <div className="bg-muted/50 rounded-lg p-3 border border-border/30">
                <p className="text-xs font-bangers text-muted-foreground uppercase tracking-wider mb-1">
                  {t("learn.exercise.explanation")}
                </p>
                <p className="text-sm font-inter text-foreground/90">{explanation}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 space-y-3">
            <button
              type="button"
              onClick={onContinue}
              className={cn(
                "w-full h-14 rounded-xl border-2 font-bangers text-lg tracking-wide uppercase transition-all duration-200 hover:brightness-105 active:scale-[0.98]",
                isCorrect
                  ? "bg-[hsl(142_71%_45%)] text-white border-[hsl(142_71%_45%)]"
                  : "bg-accent text-accent-foreground border-accent",
              )}
              style={{ boxShadow: "0 4px 0 0 hsl(var(--border) / 0.3)" }}
            >
              {label}
            </button>

            <button
              type="button"
              onClick={() => setShowReport(true)}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-inter text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              <Flag className="w-3 h-3" />
              {t("learn.exercise.reportError") ?? "Report an error"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ReportExerciseErrorDialog
        open={showReport}
        onOpenChange={setShowReport}
        exerciseId={exerciseId}
        lessonId={lessonId}
      />
    </>
  );
}
