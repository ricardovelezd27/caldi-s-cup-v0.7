

# Plan: Profile Page — Back on Brand + Widget Structure

## Problem Summary

1. **Stat cards are off-brand**: Missing the signature 4px solid border + 4px floating shadow. Using generic `border border-border` instead of the brand `border-[4px] border-border` + `boxShadow: "4px 4px 0px 0px hsl(var(--border))"`. Section headings missing `font-bangers tracking-wide`.
2. **TribeSection is too small**: Needs to span full width below both stat sections and include a subtitle line (like "Your coffee personality").
3. **Page structure needs widget-style sections**: Should follow dashboard pattern — Hero → Stats → Widgets (Tribe, FavoritesTable, InventoryTable as widget-style cards) → Account/Feedback/Footer.

## Changes

### 1. `ProfileStatCard.tsx` — Apply brand styling

- Change container from `rounded-lg border border-border` to `rounded-md border-[4px] border-border` with inline `style={{ boxShadow: "4px 4px 0px 0px hsl(var(--border))" }}`
- This instantly fixes all 5 stat cards (Streak, Goal, XP, Favorites, Inventory)

### 2. `ProfilePage.tsx` — Restructure to widget layout

Current: 12-col grid (Learning Hub 7 + Coffee Hub 5) → tables → account

New structure:
```text
ProfileHero
─────────────────────────────────
Stats Row (all 5 cards in one row)
  grid-cols-2 md:grid-cols-5
  [Streak] [Goal] [XP] [Favs] [Inventory]
─────────────────────────────────
Widgets Section (full-width, dashboard-style cards)
  grid-cols-1 md:grid-cols-2 (or 3)
  [TribeSection - full width]
  [FavoritesTable card] [InventoryTable card]
─────────────────────────────────
Account & Settings
FeedbackCTA
```

- Remove the split 7/5 column layout for stats — put all 5 in a single row matching the reference screenshot (Learning Hub label spans first 3, Coffee Hub label spans last 2)
- Section headings use `font-bangers text-xl md:text-2xl tracking-wide`
- TribeSection moves to full-width below stats
- FavoritesTable and InventoryTable wrapped in brand-styled cards (4px border + shadow)

### 3. `TribeSection.tsx` — Better space usage + subtitle

- Add a subtitle line: tribe `title` rendered more prominently
- When tribe exists, make the card span full width with the description text having more room
- Match the `CoffeeTribeWidget` dashboard style: emoji in a circle, tribe values as tags, description text

### 4. Section headings — Brand typography

- All section `<h2>` elements get `font-bangers tracking-wide` class to match dashboard headings shown in reference images

## Files Modified

| File | Change |
|------|--------|
| `ProfileStatCard.tsx` | Brand border + shadow styling |
| `ProfilePage.tsx` | Restructure: single stats row → widgets section → account |
| `TribeSection.tsx` | Full-width, subtitle, better space usage |

