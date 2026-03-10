

# Plan: Unite Dashboard + Profile into One Page

## Overview

Merge the dashboard's widget system directly into the profile page, eliminating the separate `/dashboard` route. The profile page becomes the single authenticated home — hero at top, stats below, then the full widget grid (add/remove/edit widgets), followed by account settings and footer.

## Layout Schema

```text
┌─────────────────────────────────────────────────┐
│              ProfileHero                         │
│  (Cover + Avatar + Name + Email + Rank Bar)      │
├─────────────────────────────────────────────────┤
│  📊 Your Stats                                   │
│  [Streak] [Goal] [XP] [Favs] [Inventory]         │
│  (grid-cols-2 md:grid-cols-5)                    │
├─────────────────────────────────────────────────┤
│  ☕ My Dashboard                                  │
│  [+ Add Widget] [⚙ Edit]        [Scan Coffee]   │
│  ┌─────────────────────────────────────────┐     │
│  │ Widget Grid (from WidgetGrid component) │     │
│  │ (2-3 col grid, add/remove/reorder)      │     │
│  └─────────────────────────────────────────┘     │
├─────────────────────────────────────────────────┤
│  📦 Collections                                  │
│  [FavoritesTable] [InventoryTable]               │
├─────────────────────────────────────────────────┤
│  ⚙️ Account & Settings                          │
│  [Edit Profile] [Retake Quiz]                    │
├─────────────────────────────────────────────────┤
│  FeedbackCTA                                     │
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

## Changes

### 1. `ProfilePage.tsx` — Embed WidgetGrid

- Import `WidgetGrid` from `@/features/dashboard/components`
- Add a new "☕ My Dashboard" section between Stats and Collections
- Render `<WidgetGrid />` directly inside that section
- Remove the standalone `TribeSection` (it already exists as a dashboard widget `coffee_tribe`)
- Keep stats row, collections, account settings, and feedback sections as-is

### 2. `App.tsx` — Redirect `/dashboard` to `/profile`

- Change the `/dashboard` route from rendering `DashboardPage` to a `<Navigate to="/profile" replace />`
- This preserves any existing links/bookmarks while unifying to one page
- Keep the `DashboardPage` component file for now (no deletion needed)

### 3. `DashboardSidebar` — Remove from profile

- The sidebar was part of the dashboard layout — it won't be embedded in the profile page
- The profile page uses `PageLayout` (header + footer), not the sidebar layout
- Sidebar navigation links (Profile, Scanner, etc.) are already in the main Header nav

### 4. `constants/app.ts` — No route changes needed

- Keep `ROUTES.dashboard` pointing to `/dashboard` for backward compatibility (redirect handles it)

### 5. `WidgetGrid.tsx` — Minor: Remove `welcome_hero` special handling (optional)

- The WelcomeHero widget duplicates what ProfileHero already shows (name, tribe, rank)
- Either: filter it out when rendered on profile page, or let users remove it via the Edit UI
- Recommend: no code change needed — users can simply remove it from their widget set

## Files Modified

| File | Change |
|------|--------|
| `ProfilePage.tsx` | Add WidgetGrid section, remove standalone TribeSection |
| `App.tsx` | Redirect `/dashboard` → `/profile` |

