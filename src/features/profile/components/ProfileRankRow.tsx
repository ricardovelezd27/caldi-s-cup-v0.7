import { useUserRank } from "@/features/gamification";
import { Progress } from "@/components/ui/progress";

/** Compact rank + XP progress bar with next rank target — reusable across profile */
export function ProfileRankRow() {
  const { currentRank, nextRank, progressToNext, totalXP } = useUserRank();

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <span className={`text-base ${currentRank.colorClass}`}>{currentRank.icon}</span>
      <span className={`text-xs font-semibold ${currentRank.colorClass}`}>{currentRank.name}</span>
      <Progress value={progressToNext} className="h-1.5 flex-1 max-w-[100px]" />
      {nextRank && (
        <span className={`text-base opacity-50 ${nextRank.colorClass}`}>{nextRank.icon}</span>
      )}
      <span className="text-xs text-muted-foreground">{totalXP} XP</span>
    </div>
  );
}
