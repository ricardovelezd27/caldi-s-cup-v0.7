

# Plan: Rank-Up Celebration Overlay

## Overview
Detect when a user's rank changes and display a full-screen celebratory overlay with mascot, rank icon, and animated effects. No framer-motion available — we'll use CSS animations (existing `animate-fade-in`, `animate-scale-in`, keyframes for bounce/pulse).

## 1. Create `RankUpCelebration` Component
**File**: `src/features/gamification/components/RankUpCelebration.tsx`

Full-screen fixed overlay (`z-[100]`) with:
- Radial gradient background with subtle animated glow (CSS keyframe)
- Floating emoji confetti (☕ ⭐ 🎉) using staggered CSS bounce animations (matching LessonComplete style)
- `caldi-celebrating.png` mascot at large size
- "RANK UP!" heading (`font-bangers`, large) + "You are now a {rankName}!" subtitle
- Rank icon scaled up (`text-7xl`) with the rank's `colorClass`
- "Continue" `<Button>` that calls `onDismiss`

## 2. Create Rank Change Detection Hook
**File**: `src/features/gamification/hooks/useRankUpDetection.ts`

- Uses `getStorage()` from the existing `storageFactory` to persist `caldi_last_rank_id`
- Compares `currentRank.id` from `useUserRank()` against stored value
- On mismatch (and stored value exists — skip first load for new users): sets `rankUpTo` state to the new rank
- Exposes `{ rankUpTo, dismissRankUp }` where dismiss updates storage and clears state
- Storage key: `caldi_last_rank_id`

## 3. Add Global Provider in App
**File**: `src/features/gamification/components/RankUpProvider.tsx`

A thin wrapper component that:
- Calls `useRankUpDetection()`
- Renders `<RankUpCelebration>` conditionally when `rankUpTo` is set
- Rendered once in `App.tsx` inside `<AuthProvider>`, after `<Sonner />`

## 4. Wire into App.tsx
Add `<RankUpProvider />` inside `<AuthProvider>` block.

## 5. Update Barrel Exports
Update `src/features/gamification/index.ts` with new exports.

## Files

| File | Action |
|------|--------|
| `src/features/gamification/components/RankUpCelebration.tsx` | **Create** |
| `src/features/gamification/hooks/useRankUpDetection.ts` | **Create** |
| `src/features/gamification/components/RankUpProvider.tsx` | **Create** |
| `src/App.tsx` | Add `<RankUpProvider />` |
| `src/features/gamification/index.ts` | Add exports |

No database changes.

