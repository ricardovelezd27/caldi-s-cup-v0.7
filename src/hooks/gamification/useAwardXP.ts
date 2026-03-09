import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { awardXP } from "@/services/gamification/xpService";
import { updateStreakOnAction } from "@/services/gamification/streakService";

/**
 * Unified hook for awarding XP + updating streak + showing visual feedback.
 * Fire-and-forget: never blocks the caller's UX flow.
 */
export function useAwardXP() {
  const { user } = useAuth();
  const [pendingXP, setPendingXP] = useState(0);

  const rewardAction = useCallback(
    async (actionType: string, xpAmount: number, label?: string) => {
      if (!user) return;
      try {
        await awardXP(user.id, actionType, xpAmount);
        await updateStreakOnAction(user.id);
        setPendingXP(xpAmount);
        toast.success(`☕ +${xpAmount} XP — ${label || actionType}!`);
        setTimeout(() => setPendingXP(0), 2000);
      } catch (err) {
        console.error("[Gamification] Failed to award XP:", err);
      }
    },
    [user],
  );

  return { rewardAction, pendingXP };
}
