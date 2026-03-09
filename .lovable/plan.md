

# Plan: User Ranks and Titles (Gamification Phase 2)

## 1. Create Rank Configuration (`src/features/gamification/config/ranks.ts`)

Define an ordered array of rank objects:

| Rank | Min XP | Icon | Color Class |
|------|--------|------|-------------|
| Novice | 0 | 📄 | text-slate-400 |
| Green Apron | 100 | 🎽 | text-emerald-500 |
| Bronze Tamper | 500 | 🤎 | text-amber-700 |
| Silver Pitcher | 1500 | 🤍 | text-slate-300 |
| Gold Portafilter | 3000 | 💛 | text-yellow-500 |
| Coffee Master | 5000 | 🖤 | text-stone-900 |

Each object: `{ id, name, minXP, icon, colorClass }`. TypeScript interface exported for reuse.

## 2. Create Rank Hook (`src/features/gamification/hooks/useUserRank.ts`)

Reads `profile.total_xp` from `useAuth()` and returns:
- **currentRank**: highest rank where `total_xp >= minXP`
- **nextRank**: next rank in the array, or `null` if Coffee Master
- **progressToNext**: `((totalXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100`, clamped 0–100
- **xpNeeded**: `nextRank.minXP - totalXP`, or `0` if maxed

Pure calculation — no database calls needed since `total_xp` is already on the profile.

## 3. Index Barrel (`src/features/gamification/index.ts`)

Export both the config and hook for clean imports.

## Files

| File | Action |
|------|--------|
| `src/features/gamification/config/ranks.ts` | **Create** |
| `src/features/gamification/hooks/useUserRank.ts` | **Create** |
| `src/features/gamification/index.ts` | **Create** |

No database changes required.

