

# Plan: Lesson Exercise UI — 4 Improvements

## 1. Keep Header & Footer During Exercises

**Problem**: Exercise state uses a bare `min-h-[100dvh]` div without `PageLayout`, losing the global header/footer.

**Fix in `LessonScreen.tsx`**: Wrap the exercise+feedback render block in `<PageLayout>` instead of a bare div. The `LessonProgress` bar and exercise content remain inside, but the page now has consistent chrome.

## 2. Feedback as a Centered Modal (Not Bottom Bar)

**Problem**: The `BottomActionBar` feedback section is too small and easy to miss at the bottom of the screen.

**Fix**: Replace the `BottomActionBar` with a `Dialog`-based feedback modal that appears centered on screen after an answer is submitted. The modal contains:
- Correct/incorrect icon + title (Bangers font)
- Mascot dialogue quote
- Explanation text (if available)
- A "Report Error" button (subtle, secondary — see point 4)
- A full-width "Continue" / "Got it" action button (green for correct, accent for incorrect)

**New file**: `src/features/learning/components/lesson/FeedbackModal.tsx`

The `BottomActionBar` component remains available but is no longer used in `LessonScreen.tsx`.

## 3. Fix Hearts Bug — Ensure Row Exists Before Decrementing

**Root cause**: `useHearts.loseHeart` silently returns when `raw` is null (no `learning_user_streaks` row for the user). The row is only created later during lesson completion via `updateStreakViaRPC`. So during the lesson, hearts never decrement.

**Fix in `useHearts.ts`**:
- In `loseHeartMutation`, if `raw` is null, **upsert** a new row with `hearts: 4` (max - 1) instead of returning early
- This ensures the first wrong answer creates the row and immediately deducts a heart
- Also use `computed.hearts` (which accounts for refills) instead of `raw.hearts` for the decrement calculation to avoid stale data

**Refill change**: Per user request, change refill interval from 4 hours to **24 hours** (daily replenishment). Update `REFILL_INTERVAL_MS` to `24 * 60 * 60 * 1000`.

## 4. "Report Error" Button on Exercise Feedback

**Problem**: No way for users to report mistakes in lesson content.

**Fix**: Add a "Report Error" button inside the new `FeedbackModal`. It opens a dialog (similar to `ReportScanErrorDialog`) where the user can describe the issue. The report is stored in a new or existing table.

Since `scan_error_reports` is coffee-specific, create a lightweight **`ReportExerciseErrorDialog`** component (`src/features/learning/components/lesson/ReportExerciseErrorDialog.tsx`) that:
- Accepts `exerciseId` and `lessonId`
- Stores reports in a new `exercise_error_reports` table (migration needed)
- Styled as a subtle text button ("Report an error") below the Continue button in the modal

**DB migration**: Create `exercise_error_reports` table with columns: `id`, `user_id`, `exercise_id`, `lesson_id`, `description`, `created_at`. RLS: authenticated users can insert their own rows.

## Files Changed

| File | Action |
|------|--------|
| `src/features/learning/components/lesson/FeedbackModal.tsx` | **Create** — centered dialog for correct/incorrect feedback |
| `src/features/learning/components/lesson/ReportExerciseErrorDialog.tsx` | **Create** — report error dialog for exercises |
| `src/features/learning/components/lesson/LessonScreen.tsx` | **Edit** — wrap exercises in PageLayout, use FeedbackModal instead of BottomActionBar |
| `src/features/learning/hooks/useHearts.ts` | **Edit** — fix null-row bug (upsert on first loss), change refill to 24h |
| `src/i18n/en.ts` + `es.ts` | **Edit** — add translation keys for report error and feedback modal |
| **DB migration** | **Create** `exercise_error_reports` table with RLS |

