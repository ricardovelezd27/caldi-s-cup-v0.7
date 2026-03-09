import { supabase } from "@/integrations/supabase/client";
import type { LearningUserProgress, LearningUserExerciseHistory } from "../types";

function toProgress(row: any): LearningUserProgress {
  return {
    id: row.id,
    userId: row.user_id,
    lessonId: row.lesson_id,
    isCompleted: row.is_completed,
    completedAt: row.completed_at,
    scorePercent: row.score_percent,
    exercisesCorrect: row.exercises_correct,
    exercisesTotal: row.exercises_total,
    timeSpentSeconds: row.time_spent_seconds,
    xpEarned: row.xp_earned,
    attemptCount: row.attempt_count,
    bestScorePercent: row.best_score_percent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserProgress(userId: string): Promise<LearningUserProgress[]> {
  const { data, error } = await supabase
    .from("learning_user_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return (data ?? []).map(toProgress);
}

export async function getLessonProgress(
  userId: string,
  lessonId: string,
): Promise<LearningUserProgress | null> {
  const { data, error } = await supabase
    .from("learning_user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) throw error;
  return data ? toProgress(data) : null;
}

export async function upsertLessonProgress(progress: {
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  scorePercent: number;
  exercisesCorrect: number;
  exercisesTotal: number;
  timeSpentSeconds: number;
  xpEarned: number;
}): Promise<LearningUserProgress> {
  // Check for existing record to handle attempt_count and best_score
  const existing = await getLessonProgress(progress.userId, progress.lessonId);

  if (existing) {
    // Re-completion / review: increment attempt, keep best score, always refresh updated_at
    const { data, error } = await supabase
      .from("learning_user_progress")
      .update({
        is_completed: progress.isCompleted,
        completed_at: progress.isCompleted ? new Date().toISOString() : existing.completedAt,
        score_percent: progress.scorePercent,
        exercises_correct: progress.exercisesCorrect,
        exercises_total: progress.exercisesTotal,
        time_spent_seconds: progress.timeSpentSeconds,
        xp_earned: existing.xpEarned + progress.xpEarned,
        attempt_count: existing.attemptCount + 1,
        best_score_percent: Math.max(existing.bestScorePercent, progress.scorePercent),
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return toProgress(data);
  }

  // First-time completion
  const { data, error } = await supabase
    .from("learning_user_progress")
    .insert({
      user_id: progress.userId,
      lesson_id: progress.lessonId,
      is_completed: progress.isCompleted,
      completed_at: progress.isCompleted ? new Date().toISOString() : null,
      score_percent: progress.scorePercent,
      exercises_correct: progress.exercisesCorrect,
      exercises_total: progress.exercisesTotal,
      time_spent_seconds: progress.timeSpentSeconds,
      xp_earned: progress.xpEarned,
      best_score_percent: progress.scorePercent,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return toProgress(data);
}

export async function recordExerciseHistory(history: {
  userId: string;
  exerciseId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  userAnswer: any;
  wasReview?: boolean;
  lessonAttemptId?: string;
}): Promise<void> {
  const { error } = await supabase.from("learning_user_exercise_history").insert({
    user_id: history.userId,
    exercise_id: history.exerciseId,
    is_correct: history.isCorrect,
    time_spent_seconds: history.timeSpentSeconds,
    user_answer: history.userAnswer,
    was_review: history.wasReview ?? false,
    lesson_attempt_id: history.lessonAttemptId ?? null,
  });

  if (error) throw error;
}
