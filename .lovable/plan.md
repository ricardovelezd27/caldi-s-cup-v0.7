

# Plan: Desktop Track Page Redesign + Lesson Intro/Complete Overhaul

## Part 1: Track Page — Fill the Desktop Space

**Problem**: Content is constrained to `max-w-2xl` (672px) leaving huge empty margins on desktop.

### TrackPage.tsx
- Widen container from `max-w-2xl` to `max-w-5xl` on desktop
- Add a 2-column layout on desktop: left column = track path content (~60%), right column = sticky sidebar with mascot illustration + track stats card
- Sidebar shows `ilustration_Duo_and_Goat_NoBG_1.png` mascot duo + a stats card (lessons completed, total XP available, estimated time remaining)
- Mobile stays single-column (sidebar hidden on mobile)

### TrackPathView.tsx
- On desktop, render sections in a wider layout with more breathing room
- Unit cards get a subtle card background (`bg-card border-2 border-border rounded-xl p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))]`) on desktop instead of bare list items
- Lesson nodes get slightly more padding and hover effects on desktop

### Layout structure on desktop:
```text
┌──────────────────────────────────────────────────────┐
│  ← Back to Track                                     │
│  🧪 BREWING SCIENCE          [Progress Bar 33%]      │
├────────────────────────────┬─────────────────────────┤
│                            │                         │
│  BEGINNER                  │  ┌───────────────────┐  │
│  EXTRACTION FUNDAMENTALS   │  │  [Caldi & Goat]   │  │
│  🎯 Goal description       │  │   illustration    │  │
│                            │  │                   │  │
│  ┌─────────────────────┐   │  └───────────────────┘  │
│  │ The Alchemy of Bean │   │                         │
│  │  ✓ Solubility       │   │  ┌───────────────────┐  │
│  │  ✓ TDS & Strength   │   │  │ Track Stats       │  │
│  │  ✓ Brewing Chart    │   │  │ 9 lessons · 36min │  │
│  └─────────────────────┘   │  │ 150 XP available  │  │
│                            │  └───────────────────┘  │
│  ┌─────────────────────┐   │                         │
│  │ Extraction Timeline │   │                         │
│  │  ...                │   │                         │
│  └─────────────────────┘   │                         │
└────────────────────────────┴─────────────────────────┘
```

## Part 2: Lesson Intro — Premium Treatment

**Problem**: The intro screen ignores the page layout (no header/footer, no back button). It looks disconnected.

### LessonPage.tsx
- Wrap `LessonScreen` in `PageLayout` so header and footer are always visible
- Add a back link at the top (← Back to Track) before lesson content

### LessonIntro (inside LessonScreen.tsx)
- Keep the intro within the `PageLayout` flow (not a full-screen takeover)
- Add lesson name display from `lesson.name` (currently not passed)
- Constrain to `max-w-2xl mx-auto` with proper padding
- Keep the mascot, dialogue bubble, time/XP pills, and Start button as-is (they already look good per screenshot)

### LessonComplete
- Also render inside `PageLayout` flow (header/footer visible)
- Add a back navigation option

### LessonScreen.tsx
- Pass `lesson.name` and `lesson.introText` to `LessonIntro`
- The exercise state already has `min-h-[100dvh]` — keep that for immersive exercise flow, but intro and complete states render within the normal page layout
- Restructure: intro and complete states DON'T use `min-h-[100dvh]` (they live inside PageLayout). Only the exercise state goes immersive.

## Files Changed

| File | Action |
|------|--------|
| `TrackPage.tsx` | Edit — widen to `max-w-5xl`, add 2-col desktop layout with sidebar |
| `TrackPathView.tsx` | Edit — unit cards with backgrounds on desktop |
| `LessonPage.tsx` | Edit — wrap in `PageLayout`, add back link |
| `LessonScreen.tsx` | Edit — pass lesson metadata to intro, restructure layout states |
| `LessonIntro.tsx` | Edit — add back button prop, lesson name |

