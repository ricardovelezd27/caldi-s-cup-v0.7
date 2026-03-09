/**
 * Global Streak Service — manages streaks and daily goals.
 * Also re-exports learning-specific streak helpers for backward compat.
 */

import { supabase } from "@/integrations/supabase/client";
import type { LearningUserStreak, LearningUserDailyGoal } from "@/features/learning/types";

// ── Row mappers ──

function toStreak(row: any): LearningUserStreak {
  return {
    id: row.id,
    userId: row.user_id,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    lastActivityDate: row.last_activity_date,
    streakStartDate: row.streak_start_date,
    streakFreezesAvailable: row.streak_freezes_available,
    streakFreezeUsedToday: row.streak_freeze_used_today,
    totalDaysActive: row.total_days_active,
    totalXp: row.total_xp,
    totalLessonsCompleted: row.total_lessons_completed,
    hearts: row.hearts ?? 5,
    maxHearts: row.max_hearts ?? 5,
    heartsLastRefilledAt: row.hearts_last_refilled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDailyGoal(row: any): LearningUserDailyGoal {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    goalXp: row.goal_xp,
    earnedXp: row.earned_xp,
    isAchieved: row.is_achieved,
  };
}

// ── Existing learning streak helpers ──

export async function getUserStreak(userId: string): Promise<LearningUserStreak | null> {
  const { data, error } = await supabase
    .from("learning_user_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ? toStreak(data) : null;
}

export async function initializeStreak(userId: string): Promise<LearningUserStreak> {
  const { data, error } = await supabase
    .from("learning_user_streaks")
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return toStreak(data);
}

export async function updateStreakViaRPC(
  userId: string,
  xpEarned: number,
): Promise<{ action: string; currentStreak: number; longestStreak: number; totalXp: number; totalLessonsCompleted: number }> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase.rpc("update_streak_and_xp", {
    p_user_id: userId,
    p_date: today,
    p_xp_earned: xpEarned,
  });

  if (error) throw error;
  const result = data as any;
  return {
    action: result.action,
    currentStreak: result.current_streak,
    longestStreak: result.longest_streak,
    totalXp: result.total_xp,
    totalLessonsCompleted: result.total_lessons_completed,
  };
}

export async function getDailyGoal(
  userId: string,
): Promise<LearningUserDailyGoal | null> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("learning_user_daily_goals")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  if (error) throw error;
  return data ? toDailyGoal(data) : null;
}

export async function addXPToDaily(userId: string, xp: number): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  let goal = await getDailyGoal(userId);

  if (!goal) {
    const { error } = await supabase
      .from("learning_user_daily_goals")
      .insert({ user_id: userId, date: today, earned_xp: xp, is_achieved: xp >= 10 });
    if (error) throw error;
    return;
  }

  const newEarned = goal.earnedXp + xp;
  const { error } = await supabase
    .from("learning_user_daily_goals")
    .update({ earned_xp: newEarned, is_achieved: newEarned >= goal.goalXp })
    .eq("id", goal.id);

  if (error) throw error;
}

// ── Global streak update for any action ──

export async function updateStreakOnAction(userId: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  // Check if user already has an XP log today
  const { data: todayLogs, error: logError } = await supabase
    .from("user_xp_logs")
    .select("id")
    .eq("user_id", userId)
    .gte("created_at", `${today}T00:00:00Z`)
    .limit(2);

  if (logError) throw logError;

  // If this is NOT the first action today (>1 log already), skip streak update
  if (todayLogs && todayLogs.length > 1) return;

  // First action of the day → update profiles.current_streak
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak")
    .eq("id", userId)
    .single();

  const newStreak = ((profile as any)?.current_streak ?? 0) + 1;
  const { error } = await supabase
    .from("profiles")
    .update({ current_streak: newStreak })
    .eq("id", userId);

  if (error) throw error;
}
