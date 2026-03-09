import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

// ── Generic row types (raw DB shape) ──

export interface AdminTrackRow {
  id: string;
  track_id: string;
  name: string;
  name_es: string;
  description: string;
  description_es: string;
  icon: string;
  color_hex: string;
  sort_order: number;
  is_active: boolean;
  is_bonus: boolean;
}

export interface AdminSectionRow {
  id: string;
  track_id: string;
  name: string;
  name_es: string;
  description: string;
  description_es: string;
  learning_goal: string;
  learning_goal_es: string;
  level: string;
  sort_order: number;
  is_active: boolean;
}

export interface AdminUnitRow {
  id: string;
  section_id: string;
  name: string;
  name_es: string;
  description: string;
  description_es: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  estimated_minutes: number;
  lesson_count: number;
}

export interface AdminLessonRow {
  id: string;
  unit_id: string;
  name: string;
  name_es: string;
  intro_text: string;
  intro_text_es: string;
  sort_order: number;
  is_active: boolean;
  estimated_minutes: number;
  xp_reward: number;
  exercise_count: number;
}

export interface AdminExerciseRow {
  id: string;
  lesson_id: string;
  exercise_type: string;
  sort_order: number;
  is_active: boolean;
  question_data: Json;
  difficulty_score: number;
  concept_tags: string[];
  mascot: string;
  mascot_mood: string;
  image_url: string | null;
  audio_url: string | null;
}

// ── Queries (no is_active filter) ──

export async function getAdminTracks(): Promise<AdminTrackRow[]> {
  const { data, error } = await supabase
    .from("learning_tracks")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getAdminSections(trackId: string): Promise<AdminSectionRow[]> {
  const { data, error } = await supabase
    .from("learning_sections")
    .select("*")
    .eq("track_id", trackId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getAdminUnits(sectionId: string): Promise<AdminUnitRow[]> {
  const { data, error } = await supabase
    .from("learning_units")
    .select("*")
    .eq("section_id", sectionId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getAdminUnitsBySectionIds(sectionIds: string[]): Promise<AdminUnitRow[]> {
  if (!sectionIds.length) return [];
  const { data, error } = await supabase
    .from("learning_units")
    .select("*")
    .in("section_id", sectionIds)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getAdminLessons(unitId: string): Promise<AdminLessonRow[]> {
  const { data, error } = await supabase
    .from("learning_lessons")
    .select("*")
    .eq("unit_id", unitId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getAdminExercises(lessonId: string): Promise<AdminExerciseRow[]> {
  const { data, error } = await supabase
    .from("learning_exercises")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

// ── Single-entity fetchers ──

export async function getAdminTrackById(trackId: string): Promise<AdminTrackRow | null> {
  const { data, error } = await supabase
    .from("learning_tracks")
    .select("*")
    .eq("id", trackId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdminUnitById(unitId: string): Promise<AdminUnitRow | null> {
  const { data, error } = await supabase
    .from("learning_units")
    .select("*")
    .eq("id", unitId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdminLessonById(lessonId: string): Promise<AdminLessonRow | null> {
  const { data, error } = await supabase
    .from("learning_lessons")
    .select("*")
    .eq("id", lessonId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ── Deletion ──

export async function deleteEntity(
  table: "learning_tracks" | "learning_sections" | "learning_units" | "learning_lessons" | "learning_exercises",
  id: string,
) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

// ── Mutations ──

export async function toggleActive(
  table: "learning_tracks" | "learning_sections" | "learning_units" | "learning_lessons" | "learning_exercises",
  id: string,
  isActive: boolean,
) {
  const { error } = await supabase
    .from(table)
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) throw error;
}

export async function updateExercise(
  id: string,
  updates: {
    question_data?: Json;
    mascot?: string;
    mascot_mood?: string;
    difficulty_score?: number;
    is_active?: boolean;
    concept_tags?: string[];
  },
) {
  const { error } = await supabase
    .from("learning_exercises")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function upsertUnit(unit: {
  id?: string;
  section_id: string;
  name: string;
  name_es: string;
  description: string;
  description_es: string;
  icon: string;
  sort_order: number;
  estimated_minutes: number;
  lesson_count: number;
  is_active: boolean;
}) {
  const { data, error } = await supabase
    .from("learning_units")
    .upsert(unit)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function upsertLesson(lesson: {
  id?: string;
  unit_id: string;
  name: string;
  name_es: string;
  intro_text: string;
  intro_text_es: string;
  sort_order: number;
  estimated_minutes: number;
  xp_reward: number;
  exercise_count: number;
  is_active: boolean;
}) {
  const { data, error } = await supabase
    .from("learning_lessons")
    .upsert(lesson)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function upsertExercise(exercise: {
  id?: string;
  lesson_id: string;
  exercise_type: string;
  sort_order: number;
  is_active: boolean;
  question_data: Json;
  difficulty_score: number;
  concept_tags: string[];
  mascot: string;
  mascot_mood: string;
}) {
  const { error } = await supabase
    .from("learning_exercises")
    .upsert(exercise as any);
  if (error) throw error;
}
