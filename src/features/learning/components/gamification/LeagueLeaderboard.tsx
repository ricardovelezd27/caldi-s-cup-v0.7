import { useLanguage } from "@/contexts/language";
import { useLeague } from "../../hooks/useLeague";
import { useAuth } from "@/contexts/auth";
import { cn } from "@/lib/utils";
import { BARISTA_RANKS, useUserRank } from "@/features/gamification";

export function LeagueLeaderboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { league, leaderboard, daysRemaining, isLoading } = useLeague();
  const { currentRank } = useUserRank();

  const getRankIcon = (xp: number) => {
    let icon = BARISTA_RANKS[0].icon;
    for (let i = BARISTA_RANKS.length - 1; i >= 0; i--) {
      if (xp >= BARISTA_RANKS[i].minXP) { icon = BARISTA_RANKS[i].icon; break; }
    }
    return icon;
  };

  if (isLoading) {
    return <p className="text-center text-muted-foreground font-inter py-8">{t("common.loading")}</p>;
  }

  if (!league || leaderboard.length === 0) {
    return (
      <p className="text-center text-muted-foreground font-inter py-8">
        {t("learn.leaderboard.comingSoon")}
      </p>
    );
  }

  const promoteN = league.promoteTopN;
  const demoteN = league.demoteBottomN;
  const total = leaderboard.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">{league.icon}</span>
          <h2 className="font-bangers text-2xl text-foreground tracking-wide">{league.name}</h2>
        </div>
        <p className="text-sm font-inter text-muted-foreground">
          {daysRemaining} {t("learn.leaderboard.comingSoon").includes("días") ? "días" : "days left"}
        </p>
      </div>

      {/* Leaderboard list */}
      <div className="border-4 border-border rounded-lg bg-card shadow-[4px_4px_0px_0px_hsl(var(--border))] overflow-hidden">
        {leaderboard.map((entry) => {
          const isMe = entry.userId === user?.id;
          const inPromo = entry.rank <= promoteN;
          const inDemote = demoteN > 0 && entry.rank > total - demoteN;

          return (
            <div
              key={entry.userId}
              className={cn(
                "flex items-center gap-3 px-4 py-3 border-b border-border/30 last:border-b-0 font-inter",
                isMe && "bg-secondary/20 border-l-4 border-l-secondary",
                inPromo && !isMe && "bg-primary/5",
                inDemote && !isMe && "bg-destructive/5",
              )}
            >
              <span
                className={cn(
                  "w-8 text-center font-bold text-sm",
                  entry.rank <= 3 ? "text-primary" : "text-muted-foreground",
                )}
              >
                #{entry.rank}
              </span>
              <span className="text-xl">👤</span>
              <span className="flex-1 text-sm text-foreground truncate">
                {isMe ? "You" : `User ${entry.rank}`}
              </span>
              <span className="font-bold text-sm text-foreground">{entry.weeklyXp} XP</span>
            </div>
          );
        })}
      </div>

      {/* Zone labels */}
      <div className="flex justify-between text-xs font-inter text-muted-foreground px-2">
        {promoteN > 0 && <span className="text-primary">↑ Top {promoteN} promote</span>}
        {demoteN > 0 && <span className="text-destructive">↓ Bottom {demoteN} demote</span>}
      </div>
    </div>
  );
}
