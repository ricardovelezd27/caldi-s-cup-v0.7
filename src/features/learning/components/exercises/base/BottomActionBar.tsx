import { useLanguage } from "@/contexts/language";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { MascotReaction } from "../../mascot/MascotReaction";
import { getRandomDialogue } from "../../../data/mascotDialogues";

type BarState = "disabled" | "ready" | "correct" | "incorrect";

interface BottomActionBarProps {
  state: BarState;
  onClick: () => void;
  explanation?: string;
  mascot?: "caldi" | "goat";
}

export function BottomActionBar({ state, onClick, explanation, mascot = "caldi" }: BottomActionBarProps) {
  const { t } = useLanguage();
  const isFeedback = state === "correct" || state === "incorrect";
  const dialogue = isFeedback ? getRandomDialogue(mascot, state === "correct" ? "correct" : "incorrect") : undefined;

  const label = isFeedback
    ? state === "correct"
      ? t("learn.exercise.continue")
      : t("learn.exercise.gotIt") ?? "Got it"
    : t("learn.exercise.check");

  return (
    <div
      className={cn(
        "sticky bottom-0 z-40 transition-all duration-300",
        state === "correct" && "bg-[hsl(142_76%_90%)] border-t-2 border-[hsl(142_71%_45%)]",
        state === "incorrect" && "bg-accent/10 border-t-2 border-accent",
        !isFeedback && "bg-background/95 backdrop-blur-sm border-t border-border/20",
      )}
    >
      <div className="max-w-2xl mx-auto px-4 py-4">
        {isFeedback && (
          <div className="mb-3 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start gap-3 mb-2">
              {state === "correct" ? (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(142_71%_45%)] flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bangers text-lg text-foreground">
                  {state === "correct" ? t("learn.exercise.correct") : t("learn.exercise.incorrect")}
                </p>
                {dialogue && (
                  <p className="text-sm font-inter text-muted-foreground mt-0.5 italic">"{dialogue}"</p>
                )}
              </div>
            </div>
            {explanation && (
              <p className="text-sm font-inter text-foreground/80 pl-11">{explanation}</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onClick}
          disabled={state === "disabled"}
          className={cn(
            "w-full h-14 rounded-xl border-2 font-bangers text-lg tracking-wide uppercase transition-all duration-200",
            state === "disabled" && "bg-muted text-muted-foreground cursor-not-allowed opacity-60 border-border/40",
            state === "ready" && "bg-primary text-primary-foreground border-primary hover:brightness-105 active:scale-[0.98]",
            state === "correct" && "bg-[hsl(142_71%_45%)] text-white border-[hsl(142_71%_45%)] hover:brightness-105 active:scale-[0.98]",
            state === "incorrect" && "bg-accent text-accent-foreground border-accent hover:brightness-105 active:scale-[0.98]",
          )}
          style={state !== "disabled" ? { boxShadow: "0 4px 0 0 hsl(var(--border) / 0.3)" } : undefined}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
