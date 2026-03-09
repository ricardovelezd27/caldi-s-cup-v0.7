

# Plan: LinkedIn-Style Desktop Profile with Cover

## What Changes

Remove the current 2-column desktop layout and make `ProfileHero` render on all screen sizes with responsive adaptations, creating a unified LinkedIn-style profile page.

## Layout (LinkedIn-style)

```text
┌─────────────────────────────────────────────┐
│           COVER IMAGE (250px tall)          │
│                              [Edit Cover]   │
├─────────────────────────────────────────────┤
│  ┌──────┐                                   │
│  │Avatar│  Name            [Edit ✏️]        │
│  │(120px)│  email@example.com               │
│  └──────┘  Rank Bar | 🔥 Streak | 🎯 Goal  │
├─────────────────────────────────────────────┤
│  Tribe Card  │  Profile Form  │ Password    │
│              │                │ Retake Quiz  │
├─────────────────────────────────────────────┤
│     Favorites Table    │   Inventory Table   │
├─────────────────────────────────────────────┤
│              Feedback CTA                    │
└─────────────────────────────────────────────┘
```

## File Changes

### 1. `ProfileHero.tsx`
- Remove `md:hidden` — render on all viewports
- Desktop: cover height `h-[200px] md:h-[250px]`, constrain content to `max-w-5xl mx-auto`
- Desktop avatar: larger (w-32 h-32), positioned overlapping cover with negative margin
- Name/email/rank/badges laid out horizontally on desktop, stacked on mobile
- Edit cover button repositioned for desktop (bottom-right of cover)

### 2. `ProfilePage.tsx`
- Remove the `isMobile` conditional — always render `<ProfileHero />`
- Remove the desktop-only left sidebar (avatar, rank, streak, tribe)
- Remove the `<h1>` title (hero replaces it)
- Below hero: single-column content area with tribe card, profile form, password, retake quiz
- On desktop, tribe + form can sit side-by-side in a 2-col grid
- Collections grid stays as-is (2-col on desktop)
- Remove `useStreak`/`useDailyGoal` imports from ProfilePage (hero handles them)

### 3. `ProfileAvatar.tsx`
- No changes needed — already supports `circle` variant with configurable size

