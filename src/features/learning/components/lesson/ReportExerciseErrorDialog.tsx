import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ReportExerciseErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseId: string;
  lessonId: string;
}

export function ReportExerciseErrorDialog({
  open,
  onOpenChange,
  exerciseId,
  lessonId,
}: ReportExerciseErrorDialogProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !description.trim()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("exercise_error_reports" as any).insert({
        user_id: user.id,
        exercise_id: exerciseId,
        lesson_id: lessonId,
        description: description.trim(),
      });
      if (error) throw error;
      toast.success(t("learn.exercise.reportSuccess") ?? "Thanks for reporting!");
      setDescription("");
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to submit exercise error report:", err);
      toast.error(t("learn.exercise.reportFailed") ?? "Could not submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-bangers text-xl">
            {t("learn.exercise.reportErrorTitle") ?? "Report an Error"}
          </DialogTitle>
          <DialogDescription className="font-inter text-sm">
            {t("learn.exercise.reportErrorDesc") ?? "Found a mistake? Let us know what's wrong."}
          </DialogDescription>
        </DialogHeader>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("learn.exercise.reportPlaceholder") ?? "Describe the error..."}
          className="w-full min-h-[100px] rounded-lg border-2 border-border bg-background p-3 text-sm font-inter resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          maxLength={500}
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 rounded-xl border-2 border-border font-bangers text-sm uppercase tracking-wide text-foreground hover:bg-muted transition-colors"
          >
            {t("learn.exercise.cancel") ?? "Cancel"}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!description.trim() || isSubmitting}
            className="flex-1 h-11 rounded-xl border-2 border-primary bg-primary text-primary-foreground font-bangers text-sm uppercase tracking-wide hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ boxShadow: "0 3px 0 0 hsl(var(--border) / 0.3)" }}
          >
            {isSubmitting
              ? "..."
              : t("learn.exercise.reportSubmit") ?? "Submit"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
