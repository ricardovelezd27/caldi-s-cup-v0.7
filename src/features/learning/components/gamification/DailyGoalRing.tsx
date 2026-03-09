import { cn } from "@/lib/utils";
import { Target } from "lucide-react";

interface DailyGoalRingProps {
  earnedXp: number;
  goalXp: number;
  size?: "sm" | "md";
  className?: string;
}

export function DailyGoalRing({ earnedXp, goalXp, size = "md", className }: DailyGoalRingProps) {
  const achieved = goalXp > 0 && earnedXp >= goalXp;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-border bg-card shadow-[2px_2px_0px_0px_hsl(var(--border))]",
        className,
      )}
    >
      <Target
        className={cn(
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          achieved ? "text-primary" : "text-secondary",
        )}
      />
      <span
        className={cn(
          "font-bangers tracking-wide text-foreground",
          size === "sm" ? "text-sm" : "text-lg",
        )}
      >
        {earnedXp}/{goalXp}
      </span>
    </div>
  );
}
