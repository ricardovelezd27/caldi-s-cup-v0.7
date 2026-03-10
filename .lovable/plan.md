

# Plan: Hearts System Overhaul — Full 24h Refill, Lesson Termination, Modal Redesign

## Step 1: Fix Replenishment Logic (`useHearts.ts`)

**Current behavior**: Hearts refill one-by-one every 24h based on elapsed time math.

**New behavior**: All 5 hearts refill simultaneously, exactly 24 hours after the first heart was lost. The `hearts_last_refilled_at` column is repurposed as "first heart lost at" timestamp.

Changes:
- Keep `REFILL_INTERVAL_MS = 24h`
- Add a `useState(Date.now())` that ticks every second via `useEffect` to drive reactive countdown
- In `computed` memo: if `raw.hearts < raw.max_hearts` and 24h has elapsed since `hearts_last_refilled_at`, treat hearts as fully refilled (max). Otherwise use `raw.hearts` as-is
- Compute `timeUntilRefill` in ms (or null if hearts are full)
- In `loseHeartMutation`: only set `hearts_last_refilled_at` to now when going from max→below-max (first loss). Subsequent losses don't update the timestamp
- Export `timeUntilRefill` (ms) instead of the old `timeUntilNextHeart`

## Step 2: Add Timer to `HeartsDisplay.tsx`

- Add optional `timeUntilRefill?: number | null` prop
- When present and hearts < max, render a small formatted `HH:MM:SS` countdown below/beside the hearts row
- Format helper inline: hours:minutes:seconds

## Step 3: Pass Timer Through `LessonProgress.tsx`

- Add `timeUntilRefill?: number | null` prop, pass it down to `HeartsDisplay`

## Step 4: Enforce Lesson Termination (`LessonScreen.tsx`)

- Destructure `timeUntilRefill` from `useHearts()`
- Pass `timeUntilRefill` to `LessonProgress` and `HeartsEmptyModal`
- In the FeedbackModal's `onContinue`: wrap `lesson.nextExercise` — if `hearts === 0 && user`, show `HeartsEmptyModal` instead of advancing
- The `ExerciseRenderer` is already `disabled` when `!hasHearts && !!user`, keeping that

## Step 5: Redesign `HeartsEmptyModal.tsx`

- Make non-dismissible: `onOpenChange` does nothing, prevent `onPointerDownOutside` and `onEscapeKeyDown`, hide the X close button
- Show live countdown: "All 5 hearts will replenish in HH:MM:SS"
- Three buttons using `useNavigate()`:
  1. **"Go to Learn Home"** — primary styled button → `/learn`
  2. **"Go to Profile"** — outline button → `/profile`
  3. **"Purchase Hearts"** — disabled button with "Coming Soon" badge, shows toast via `sonner`

## Files Changed

| File | Change |
|------|--------|
| `useHearts.ts` | Full refill logic, reactive tick, export `timeUntilRefill` |
| `HeartsDisplay.tsx` | Accept + render countdown timer |
| `LessonProgress.tsx` | Pass `timeUntilRefill` to `HeartsDisplay` |
| `LessonScreen.tsx` | Block continue at 0 hearts, pass timer props |
| `HeartsEmptyModal.tsx` | Non-dismissible, 3 buttons, live countdown |

