import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/language";
import type { ScanProgress as ScanProgressType } from "../types/scanner";

interface ScanProgressProps { progress: ScanProgressType; }

export function ScanProgress({ progress }: ScanProgressProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const { t } = useLanguage();

  const steps = [
    { key: "uploading", label: t('scanner.uploading') },
    { key: "analyzing", label: t('scanner.analyzing') },
    { key: "enriching", label: t('scanner.enriching') },
    { key: "complete", label: t('scanner.complete') },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === progress.status);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (progress.status === "analyzing" || progress.status === "enriching") { interval = setInterval(() => { setElapsedTime((prev) => prev + 1); }, 1000); } else { setElapsedTime(0); }
    return () => { if (interval) clearInterval(interval); };
  }, [progress.status]);

  const isError = progress.status === "error";

  const getProgressMessage = () => {
    switch (progress.status) {
      case "uploading": return t('scanner.progressUploading');
      case "analyzing": return t('scanner.progressAnalyzing');
      case "enriching": return t('scanner.progressEnriching');
      case "complete": return t('scanner.progressComplete');
      default: return progress.message;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Progress value={progress.progress} className="h-3 border-2 border-border" />
      </div>
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStepIndex > index;
          const isCurrent = currentStepIndex === index;
          return (
            <div key={step.key} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${isError && isCurrent ? "border-destructive bg-destructive/10" : isCompleted ? "border-secondary bg-secondary text-secondary-foreground" : isCurrent ? "border-primary bg-primary/10" : "border-border bg-muted"}`}>
                {isError && isCurrent ? <AlertCircle className="w-5 h-5 text-destructive" /> : isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isCurrent ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>}
              </div>
              <span className={`text-xs font-medium ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
            </div>
          );
        })}
      </div>
      {!isError && progress.status !== "complete" && progress.status !== "idle" && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-2 text-primary"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm font-medium animate-pulse">{getProgressMessage()}</span></div>
          {(progress.status === "analyzing" || progress.status === "enriching") && (
            <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-3.5 h-3.5" /><span className="text-xs font-medium">{t('scanner.timeElapsed')}: {elapsedTime}s</span></div>
          )}
        </div>
      )}
    </div>
  );
}
