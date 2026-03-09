import type { Json } from "@/integrations/supabase/types";

// ── Enum Union Types ──

export type LearningTrackId = 'history_culture' | 'bean_knowledge' | 'brewing_science' | 'sustainability';
export type LearningLevel = 'beginner' | 'foundation' | 'intermediate' | 'advanced' | 'expert';
export type ExerciseType =
  | 'multiple_choice' | 'fill_in_blank' | 'true_false'
  | 'matching_pairs' | 'sequencing' | 'image_identification'
  | 'categorization' | 'troubleshooting' | 'recipe_building'
  | 'prediction' | 'comparison';

export type CoffeeTribe = 'fox' | 'owl' | 'hummingbird' | 'bee';

// ── Content Tables ──

export interface LearningTrack {
  id: string;
  trackId: LearningTrackId;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  icon: string;
  colorHex: string;
  sortOrder: number;
  isActive: boolean;
  isBonus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LearningSection {
  id: string;
  trackId: string;
  level: LearningLevel;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  learningGoal: string;
  learningGoalEs: string;
  sortOrder: number;
  isActive: boolean;
  requiresSectionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LearningUnit {
  id: string;
  sectionId: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  tribeAffinity: CoffeeTribe | null;
  estimatedMinutes: number;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningLesson {
  id: string;
  unitId: string;
  name: string;
  nameEs: string;
  introText: string;
  introTextEs: string;
  sortOrder: number;
  isActive: boolean;
  estimatedMinutes: number;
  xpReward: number;
  exerciseCount: number;
  featuredCoffeeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LearningExercise {
  id: string;
  lessonId: string;
  exerciseType: ExerciseType;
  sortOrder: number;
  isActive: boolean;
  questionData: Json;
  imageUrl: string | null;
  audioUrl: string | null;
  difficultyScore: number;
  conceptTags: string[];
  mascot: string;
  mascotMood: string;
  createdAt: string;
  updatedAt: string;
}

// ── User Progress ──

export interface LearningUserProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt: string | null;
  scorePercent: number;
  exercisesCorrect: number;
  exercisesTotal: number;
  timeSpentSeconds: number;
  xpEarned: number;
  attemptCount: number;
  bestScorePercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningUserExerciseHistory {
  id: string;
  userId: string;
  exerciseId: string;
  attemptedAt: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  userAnswer: Json | null;
  wasReview: boolean;
  lessonAttemptId: string | null;
}

// ── Gamification ──

export interface LearningUserStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  streakStartDate: string | null;
  streakFreezesAvailable: number;
  streakFreezeUsedToday: boolean;
  totalDaysActive: number;
  totalXp: number;
  totalLessonsCompleted: number;
  hearts: number;
  maxHearts: number;
  heartsLastRefilledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LearningLeague {
  id: string;
  name: string;
  nameEs: string;
  tier: number;
  icon: string;
  colorHex: string;
  promoteTopN: number;
  demoteBottomN: number;
  createdAt: string;
}

export interface LearningUserLeague {
  id: string;
  userId: string;
  leagueId: string;
  weekStartDate: string;
  weeklyXp: number;
  previousLeagueId: string | null;
  promotedAt: string | null;
  demotedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LearningAchievement {
  id: string;
  code: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  icon: string;
  xpReward: number;
  category: string;
  conditionType: string;
  conditionValue: number;
  conditionTrack: LearningTrackId | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface LearningUserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: string;
}

export interface LearningUserDailyGoal {
  id: string;
  userId: string;
  date: string;
  goalXp: number;
  earnedXp: number;
  isAchieved: boolean;
}
