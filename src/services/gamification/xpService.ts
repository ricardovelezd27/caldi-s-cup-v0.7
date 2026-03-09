/**
 * Global XP Service — Pure calculations + DB persistence.
 * Source of truth: docs/GAMIFICATION_STANDARD.md
 */

import { supabase } from "@/integrations/supabase/client";

// ── Pure XP calculation (no side effects, fully testable) ──

export interface XPBonuses {
  perfect: number;
  speed: number;
  streak: number;
  firstOfDay: number;
}

export interface XPCalculation {
  baseXP: number;
  bonuses: XPBonuses;
  totalXP: number;
}

export function calculateLessonXP(
  lessonXpReward: number,
  correctCount: number,
  totalCount: number,
  timeSpentSeconds: number,
  currentStreak: number,
  isFirstLessonToday: boolean,
): XPCalculation {
  const baseXP = lessonXpReward;

  const bonuses: XPBonuses = {
    perfect: totalCount > 0 && correctCount === totalCount ? 5 : 0,
    speed: timeSpentSeconds < 120 ? 3 : 0,
    streak: Math.floor(currentStreak / 10) * 2,
    firstOfDay: isFirstLessonToday ? 5 : 0,
  };

  const totalXP =
    baseXP + bonuses.perfect + bonuses.speed + bonuses.streak + bonuses.firstOfDay;

  return { baseXP, bonuses, totalXP };
}

// ── Global XP award (persists to user_xp_logs + increments profiles.total_xp) ──

export async function awardXP(
  userId: string,
  actionType: string,
  xpAmount: number,
): Promise<void> {
  // 1. Insert audit log
  const { error: logError } = await supabase
    .from("user_xp_logs")
    .insert({ user_id: userId, action_type: actionType, xp_amount: xpAmount });
  if (logError) throw logError;

  // 2. Increment total_xp on profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", userId)
    .single();
  const currentXp = (profile as any)?.total_xp ?? 0;
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ total_xp: currentXp + xpAmount })
    .eq("id", userId);
  if (profileError) throw profileError;
}
