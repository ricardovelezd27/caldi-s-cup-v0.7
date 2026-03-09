

# Plan: Display User Rank in Dashboard, Profile, and Leaderboard

## 1. Dashboard Hero (`src/features/dashboard/widgets/WelcomeHeroWidget.tsx`)

Import `useUserRank` and `Progress` component. Below the welcome greeting and tribe tagline, add:
- A rank badge: `currentRank.icon` + `currentRank.name` styled with the rank's `colorClass`, using a small inline `Badge` component
- A `<Progress>` bar showing `progressToNext`
- A subtitle: "{xpNeeded} XP to {nextRank.name}" (or "Max Rank Achieved!" if Coffee Master)

## 2. Profile Hero (`src/features/profile/components/ProfileHero.tsx`)

Below the tribe tagline (line ~209), add a rank display row (visible when not editing):
- Show `currentRank.icon` + `currentRank.name` with the rank's `colorClass`
- A compact progress bar + "{totalXP} XP" label
- Import `useUserRank` from `@/features/gamification`

## 3. Leaderboard (`src/features/learning/components/gamification/LeagueLeaderboard.tsx`)

Replace the generic `👤` avatar emoji (line 65) with a rank-aware icon:
- Import `BARISTA_RANKS` from `@/features/gamification`
- For each leaderboard entry, derive the rank icon from `entry.weeklyXp` (or total XP if available). Since leaderboard entries only have `weeklyXp`, we'll use `BARISTA_RANKS` to find the matching rank based on that value and display its icon instead of `👤`
- For the current user (`isMe`), use `useUserRank()` to show their actual rank icon

## Files Modified

| File | Change |
|------|--------|
| `src/features/dashboard/widgets/WelcomeHeroWidget.tsx` | Add rank badge + progress bar |
| `src/features/profile/components/ProfileHero.tsx` | Add rank display below tribe info |
| `src/features/learning/components/gamification/LeagueLeaderboard.tsx` | Replace `👤` with rank icons |

No new files. No database changes.

