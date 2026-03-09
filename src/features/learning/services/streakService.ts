// Re-export from global gamification services for backward compatibility
export {
  getUserStreak,
  initializeStreak,
  updateStreakViaRPC,
  getDailyGoal,
  addXPToDaily,
  updateStreakOnAction,
} from "@/services/gamification/streakService";
