

# Plan: Export Track to JSON + Import Override Mode

## 1. Export Track to JSON

### Service layer (`adminLearningService.ts`)
Add `exportTrackFull(trackId)` that fetches the entire hierarchy in 4 sequential queries:
1. Track by ID
2. Sections by track_id
3. Units by section_ids (batch)
4. Lessons by unit_ids (batch)
5. Exercises by lesson_ids (batch)

Returns a nested JSON object: `{ track, sections: [{ ...section, units: [{ ...unit, lessons: [{ ...lesson, exercises: [...] }] }] }] }`.

### UI (`TrackDetailPage.tsx`)
Add a "Export Track JSON" button (Download icon) next to the track heading. On click, calls `exportTrackFull`, serializes to JSON, creates a Blob, and triggers a download via a temporary `<a>` element. Filename: `track-{track.name slugified}.json`.

## 2. Import Override Switch

### UI (`ImportUnitModal.tsx`)
- Add `overrideMode` boolean state (default false)
- Render a `Switch` + `Label` ("Override existing content") in the paste step, below the textarea
- Add a warning `Alert` when override is on: "This will delete all existing lessons and exercises in the target unit before importing."
- Pass `overrideMode` to the publish logic

### Override publish logic (inside `ImportUnitModal.handlePublish`)
When `overrideMode` is true and the upserted unit already existed (has an ID matching an existing unit):
1. After upserting the unit, fetch existing lessons for that unit via `getAdminLessons(unitId)`
2. For each existing lesson, delete all its exercises via batch delete: `deleteExercisesByLessonId(lessonId)`
3. Then delete all existing lessons via `deleteEntity("learning_lessons", lessonId)`
4. Then insert the new lessons and exercises as normal

### Service layer (`adminLearningService.ts`)
Add one helper:
```typescript
export async function deleteExercisesByLessonId(lessonId: string) {
  const { error } = await supabase
    .from("learning_exercises")
    .delete()
    .eq("lesson_id", lessonId);
  if (error) throw error;
}

export async function deleteLessonsByUnitId(unitId: string) {
  const { error } = await supabase
    .from("learning_lessons")
    .delete()
    .eq("unit_id", unitId);
  if (error) throw error;
}
```

Since exercises have a FK to lessons, we need to delete exercises first, then lessons. Alternatively if the FK has `ON DELETE CASCADE`, deleting lessons will cascade. Let me check -- the DB schema doesn't show cascade on FKs explicitly, so the safe approach is to delete exercises first, then lessons.

## Files modified

| File | Action |
|------|--------|
| `adminLearningService.ts` | Add `exportTrackFull`, `deleteExercisesByLessonId`, `deleteLessonsByUnitId` |
| `TrackDetailPage.tsx` | Add Export button + download logic |
| `ImportUnitModal.tsx` | Add Override switch + cascade-delete-before-insert logic |

No database changes needed.

