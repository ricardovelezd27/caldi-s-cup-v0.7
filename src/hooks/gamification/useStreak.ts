import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { getUserStreak, getDailyGoal } from "@/services/gamification/streakService";
import type { LearningUserStreak, LearningUserDailyGoal } from "@/features/learning/types";

const MILESTONES = [7, 30, 100, 365];

export function useStreak() {
  const { user } = useAuth();

  const streakQuery = useQuery({
    queryKey: ["learning-streak", user?.id],
    queryFn: () => getUserStreak(user!.id),
    enabled: !!user,
  });

  const goalQuery = useQuery({
    queryKey: ["learning-daily-goal", user?.id],
    queryFn: () => getDailyGoal(user!.id),
    enabled: !!user,
  });

  const streak = streakQuery.data ?? null;
  const today = new Date().toISOString().split("T")[0];
  const isStreakAtRisk = !!streak && streak.lastActivityDate !== today;
  const nextMilestone = streak
    ? MILESTONES.find((m) => m > streak.currentStreak) ?? null
    : null;

  return {
    streak,
    dailyGoal: goalQuery.data ?? null,
    isLoading: streakQuery.isLoading,
    isStreakAtRisk,
    nextMilestone,
  };
}
