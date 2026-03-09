import { ImportUnitSchema, type ValidationResult, type ImportUnit } from "../types/adminTypes";

export function validateUnitJson(raw: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { valid: false, errors: ["Invalid JSON syntax"], warnings: [] };
  }

  const result = ImportUnitSchema.safeParse(parsed);
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`,
      ),
      warnings: [],
    };
  }

  const unit = result.data;

  // Business-rule warnings (non-blocking)
  for (const [li, lesson] of unit.lessons.entries()) {
    for (const [ei, ex] of lesson.exercises.entries()) {
      if (ex.type === "calculation") {
        warnings.push(`Lesson ${li + 1}, Exercise ${ei + 1}: "calculation" type is deprecated and will be ignored`);
      }
    }
    if (lesson.exercises.length < 5) {
      warnings.push(`Lesson ${li + 1} "${lesson.name}" has only ${lesson.exercises.length} exercises (recommended ≥ 5)`);
    }

    const types = new Set(lesson.exercises.map((e) => e.type));
    if (types.size < 3) {
      warnings.push(`Lesson ${li + 1} uses only ${types.size} exercise type(s) (recommended ≥ 3)`);
    }

    const avgDiff = lesson.exercises.reduce((s, e) => s + e.difficulty, 0) / lesson.exercises.length;
    if (li === 0 && avgDiff > 50) {
      warnings.push(`First lesson avg difficulty is ${avgDiff.toFixed(0)} (>50 may be too hard for intro)`);
    }
  }

  return { valid: true, errors: [], warnings, data: unit };
}
