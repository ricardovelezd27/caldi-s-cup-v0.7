# Caldi's Cup

> Coffee got complicated, Caldi brings it back to clarity.

---

## Table of Contents

1. [Project Status](#project-status)
2. [System Architecture](#system-architecture)
3. [Application Flows](#application-flows)
4. [Component Diagrams](#component-diagrams)
5. [Database Schema](#database-schema)
6. [Design System](#design-system)
7. [Security Summary](#security-summary)
8. [Development](#development)
9. [Documentation](#documentation)

---

## Project Status

**Architecture:** Modular Monolith (React + Vite + Tailwind CSS + TypeScript + Lovable Cloud)  
**Phase:** Learning Module Phase 6 Complete (Lesson Exercise UI Polish)  
**Model:** B2B2C Platform (Consumers + Roasters + Admins)

### Feature Completion

| Feature | Status | Phase |
|---------|--------|-------|
| Landing Page | ✅ Complete | 1 |
| Design System | ✅ Complete | 1 |
| Marketplace Browse | ✅ Complete | 2A |
| Product Page | ✅ Complete | 2A |
| Roaster Storefront | ✅ Complete | 2A |
| Shopping Cart | ✅ Complete | 2A |
| Error Handling | ✅ Complete | 4 |
| Authentication | ✅ Complete | 5 |
| User Profiles | ✅ Complete | 5 |
| Role Management | ✅ Complete | 5 |
| Coffee Quiz | ✅ Complete | 6 |
| AI Scanner | ✅ Complete | 6 |
| Dashboard | ✅ Complete | 6 |
| Unified Coffee Catalog | ✅ Complete | 6 |
| Auto Roaster Creation | ✅ Complete | 6 |
| Marketplace DB Integration | ✅ Complete | 6 |
| Recipes (CRUD) | ✅ Complete | 7 |
| User Coffee Ratings | ✅ Complete | 7 |
| Feedback System | ✅ Complete | 7 |
| i18n (EN/ES) | ✅ Complete | 7 |
| Manual Coffee Add | ✅ Complete | 7 |
| Scan Error Reports | ✅ Complete | 7 |
| Multi-Image Scanner | ✅ Complete | 7+ |
| Coffee Profile Gallery | ✅ Complete | 7+ |
| Learning Module Schema | ✅ Complete | L1 |
| Learning UI Components | ✅ Complete | L2 |
| Exercise Templates (12 types) | ✅ Complete | L3 |
| Gamification Integration | ✅ Complete | L4 |
| MVP Content (Brewing Science S1) | ✅ Complete | L5 |
| Track Navigation (TrackPathView) | ✅ Complete | L5 |
| Lesson Exercise UI Polish | ✅ Complete | L6 |
| Exercise Error Reporting | ✅ Complete | L6 |

---

## System Architecture

### High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CALDI'S CUP PLATFORM                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      PRESENTATION LAYER                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │  Pages   │ │  Layout  │ │ Features │ │   UI     │            │   │
│  │  │ (Routes) │ │(Header/  │ │ Modules  │ │Components│            │   │
│  │  │          │ │ Footer)  │ │          │ │ (shadcn) │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│  ┌─────────────────────────────────▼───────────────────────────────┐   │
│  │                       STATE MANAGEMENT                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │   Auth   │ │   Cart   │ │  React   │ │  Local   │            │   │
│  │  │ Context  │ │ Context  │ │  Query   │ │ Storage  │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│  ┌─────────────────────────────────▼───────────────────────────────┐   │
│  │                       SERVICE LAYER                              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │  Coffee  │ │ Scanner  │ │Marketplace│ │  Error   │            │   │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Logger   │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                          LOVABLE CLOUD (Backend)                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         EDGE FUNCTIONS                            │  │
│  │  ┌─────────────────┐                                              │  │
│  │  │   scan-coffee   │ ──→ Lovable AI Gateway (Gemini 2.5 Flash)   │  │
│  │  └─────────────────┘                                              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                          DATABASE                                 │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │  │
│  │  │ coffees │ │ profiles│ │ roasters│ │ recipes │ │brew_logs│    │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │  │
│  │  │ coffee_ │ │ user_   │ │dashboard│ │user_cof │ │scan_err │    │  │
│  │  │ scans   │ │ roles   │ │_widgets │ │_ratings │ │_reports │    │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │  │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────────────────────────────┐    │  │
│  │  │feedback │ │user_cof │ │  LEARNING MODULE (13 tables)    │    │  │
│  │  │         │ │_inv/fav │ │  learning_tracks/sections/units │    │  │
│  │  └─────────┘ └─────────┘ │  learning_lessons/exercises     │    │  │
│  │                           │  learning_user_progress/streaks │    │  │
│  │                           │  learning_leagues/achievements  │    │  │
│  │                           └──────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         STORAGE                                   │  │
│  │  ┌─────────────────┐                                              │  │
│  │  │  coffee-scans   │  (Scanned coffee bag images)                │  │
│  │  └─────────────────┘                                              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Modular Monolith Justification

The architecture is a **Modular Monolith** as mandated by V03 guidelines:

- **Centralized data management** - Single source of truth (coffees table)
- **Integrated functionality** - Components work seamlessly
- **Robustness against changes** - Easier refactoring than microservices
- **Simplicity for MVP** - Reduced operational overhead

---

## Application Flows

### 1. User Registration & Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     USER REGISTRATION SEQUENCE                          │
└─────────────────────────────────────────────────────────────────────────┘

 ┌──────┐          ┌──────────┐         ┌──────────┐         ┌──────────┐
 │ User │          │ Auth Page│         │ Supabase │         │ Database │
 └──┬───┘          └────┬─────┘         └────┬─────┘         └────┬─────┘
    │                   │                    │                    │
    │ 1. Click Sign Up  │                    │                    │
    │ ─────────────────>│                    │                    │
    │                   │                    │                    │
    │                   │ 2. signUp(email,   │                    │
    │                   │    password)       │                    │
    │                   │ ──────────────────>│                    │
    │                   │                    │                    │
    │                   │                    │ 3. Create auth.user│
    │                   │                    │ ──────────────────>│
    │                   │                    │                    │
    │                   │                    │ 4. Trigger:        │
    │                   │                    │    on_auth_user_   │
    │                   │                    │    created         │
    │                   │                    │ ──────────────────>│
    │                   │                    │                    │
    │                   │                    │ 5. INSERT profile  │
    │                   │                    │    + user_roles    │
    │                   │                    │<──────────────────│
    │                   │                    │                    │
    │                   │ 6. Session token   │                    │
    │                   │<───────────────────│                    │
    │                   │                    │                    │
    │ 7. Redirect to    │                    │                    │
    │    /quiz          │                    │                    │
    │<──────────────────│                    │                    │
    │                   │                    │                    │
```

### 2. Coffee Quiz Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        QUIZ ACTIVITY DIAGRAM                            │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────┐
                              │  START  │
                              └────┬────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │  Show Quiz Hook │
                         │  (Intro Screen) │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  Start Quiz     │
                         │  (5 Scenarios)  │
                         └────────┬────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
     ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
     │  Scenario 1:   │  │  Scenario 2:   │  │  Scenario 3:   │
     │  Coffee Shop   │  │  Morning       │  │  Gift Choice   │
     │  Choice        │  │  Routine       │  │                │
     └───────┬────────┘  └───────┬────────┘  └───────┬────────┘
             │                   │                   │
             └───────────────────┼───────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
     ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
     │  Scenario 4:   │  │  Scenario 5:   │  │  Calculate     │
     │  Weekend       │  │  Describe      │  │  Tribe Score   │
     │  Activity      │  │  Ideal Cup     │  │                │
     └───────┬────────┘  └───────┬────────┘  └───────┬────────┘
             │                   │                   │
             └───────────────────┴───────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Determine Winner      │
                    │  (Highest Tribe Score) │
                    └───────────┬────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼                                   ▼
     ┌─────────────────┐               ┌─────────────────┐
     │  Authenticated? │──── Yes ──────│  Save to        │
     │                 │               │  Profile DB     │
     └────────┬────────┘               └────────┬────────┘
              │ No                              │
              ▼                                 │
     ┌─────────────────┐                       │
     │  Save to        │                       │
     │  localStorage   │                       │
     └────────┬────────┘                       │
              │                                │
              └────────────────┬───────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Show Tribe Reveal │
                    │   (Results Page)    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Redirect to        │
                    │  Dashboard          │
                    └──────────┬──────────┘
                               │
                               ▼
                          ┌─────────┐
                          │   END   │
                          └─────────┘
```

### 3. Coffee Scanner Flow (Multi-Image)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                 MULTI-IMAGE SCANNER SEQUENCE DIAGRAM                     │
└─────────────────────────────────────────────────────────────────────────┘

 ┌──────┐    ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
 │ User │    │ Scanner │    │  Edge    │    │ Gemini   │    │ Database │
 │      │    │   Page  │    │ Function │    │ AI       │    │          │
 └──┬───┘    └────┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
    │             │              │               │               │
    │ 1. Add 1-4  │              │               │               │
    │    photos   │              │               │               │
    │ ───────────>│              │               │               │
    │             │              │               │               │
    │ 2. Click    │              │               │               │
    │   "Scan Now"│              │               │               │
    │ ───────────>│              │               │               │
    │             │              │               │               │
    │             │ 3. Stitch    │               │               │
    │             │    images    │               │               │
    │             │    (canvas)  │               │               │
    │             │              │               │               │
    │             │ 4. Compress  │               │               │
    │             │    composite │               │               │
    │             │    (max 800KB)               │               │
    │             │              │               │               │
    │             │ 5. POST      │               │               │
    │             │    /scan-    │               │               │
    │             │    coffee    │               │               │
    │             │ ────────────>│               │               │
    │             │              │               │               │
    │             │              │ 6. Upload to  │               │
    │             │              │    Storage    │               │
    │             │              │ ─────────────────────────────>│
    │             │              │               │               │
    │             │              │ 7. Analyze    │               │
    │             │              │    composite  │               │
    │             │              │ ─────────────>│               │
    │             │              │               │               │
    │             │              │ 8. Structured │               │
    │             │              │    JSON       │               │
    │             │              │<─────────────│               │
    │             │              │               │               │
    │             │              │ 9. Find/Create│               │
    │             │              │    Roaster    │               │
    │             │              │ ─────────────────────────────>│
    │             │              │               │               │
    │             │              │ 10. INSERT    │               │
    │             │              │     coffees   │               │
    │             │              │ ─────────────────────────────>│
    │             │              │               │               │
    │             │              │ 11. INSERT    │               │
    │             │              │     coffee_   │               │
    │             │              │     scans     │               │
    │             │              │ ─────────────────────────────>│
    │             │              │               │               │
    │             │ 12. Scan     │               │               │
    │             │     Result   │               │               │
    │             │<────────────│               │               │
    │             │              │               │               │
    │ 13. Display │              │               │               │
    │     Coffee  │              │               │               │
    │     Profile │              │               │               │
    │     + Gallery              │               │               │
    │<────────────│              │               │               │
    │             │              │               │               │
```

### Multi-Image Stitching Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   CLIENT-SIDE IMAGE STITCHING                           │
└─────────────────────────────────────────────────────────────────────────┘

  1 image:   Pass-through (no stitching)
  2 images:  ┌─────┬─────┐   2×1 horizontal grid
             │  1  │  2  │
             └─────┴─────┘
  3 images:  ┌─────┬─────┐   2×2 grid (blank cell)
             │  1  │  2  │
             ├─────┼─────┤
             │  3  │     │
             └─────┴─────┘
  4 images:  ┌─────┬─────┐   2×2 grid
             │  1  │  2  │
             ├─────┼─────┤
             │  3  │  4  │
             └─────┴─────┘

  - Each cell: 960×960px max
  - Output: JPEG compressed to ≤1.5MB
  - Credit cost: Always 1 AI call per scan
```

### 4. Marketplace Browse Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   MARKETPLACE DATA FLOW                                 │
└─────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │   User visits   │
                         │   /marketplace  │
                         └────────┬────────┘
                                  │
                                  ▼
              ┌───────────────────┴───────────────────┐
              │                                       │
              ▼                                       ▼
     ┌─────────────────┐                    ┌─────────────────┐
     │  Fetch from     │                    │  Load Mock      │
     │  coffees table  │                    │  Products       │
     │  (all records)  │                    │  (3 items)      │
     └────────┬────────┘                    └────────┬────────┘
              │                                       │
              ▼                                       ▼
     ┌─────────────────┐                    ┌─────────────────┐
     │  Transform to   │                    │  Already in     │
     │  Product format │                    │  Product format │
     └────────┬────────┘                    └────────┬────────┘
              │                                       │
              └───────────────┬───────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Merge & De-   │
                    │   duplicate     │
                    │   by ID         │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Apply Filters  │
                    │  - Search       │
                    │  - Origin       │
                    │  - Roast        │
                    │  - Roaster      │
                    │  - Price Range  │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Apply Sort    │
                    │   - Best Match  │
                    │   - Price       │
                    │   - Newest      │
                    │   - Rating      │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Paginate      │
                    │   Results       │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Render Product │
                    │  Grid           │
                    └─────────────────┘
```

### 5. Add to Cart Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      CART INTERACTION SEQUENCE                          │
└─────────────────────────────────────────────────────────────────────────┘

 ┌──────┐    ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
 │ User │    │ Product │    │   Cart   │    │  Rate    │    │ Storage  │
 │      │    │  Page   │    │ Context  │    │ Limiter  │    │          │
 └──┬───┘    └────┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
    │             │              │               │               │
    │ 1. Click    │              │               │               │
    │    Add to   │              │               │               │
    │    Cart     │              │               │               │
    │ ───────────>│              │               │               │
    │             │              │               │               │
    │             │ 2. Dispatch  │               │               │
    │             │    ADD_ITEM  │               │               │
    │             │ ────────────>│               │               │
    │             │              │               │               │
    │             │              │ 3. Check      │               │
    │             │              │    rate limit │               │
    │             │              │ ─────────────>│               │
    │             │              │               │               │
    │             │              │ 4. Allowed?   │               │
    │             │              │<─────────────│               │
    │             │              │               │               │
    │             │              │──┐ 5. Validate│               │
    │             │              │  │    with Zod│               │
    │             │              │<─┘            │               │
    │             │              │               │               │
    │             │              │──┐ 6. Update  │               │
    │             │              │  │    state   │               │
    │             │              │  │    (optimistic)            │
    │             │              │<─┘            │               │
    │             │              │               │               │
    │             │              │ 7. Persist    │               │
    │             │              │    to storage │               │
    │             │              │ ─────────────────────────────>│
    │             │              │               │               │
    │             │ 8. UI Update │               │               │
    │             │    (cart     │               │               │
    │             │    badge)    │               │               │
    │             │<────────────│               │               │
    │             │              │               │               │
    │ 9. Toast    │              │               │               │
    │    "Added"  │              │               │               │
    │<────────────│              │               │               │
    │             │              │               │               │
```

---

## Component Diagrams

### Feature Module Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       FEATURE MODULES                                   │
└─────────────────────────────────────────────────────────────────────────┘

src/features/
├── coffee/                          # Unified Coffee Domain
│   ├── components/
│   │   ├── CoffeeProfile.tsx        # Full coffee display
│   │   ├── CoffeeActions.tsx        # Favorite/Inventory/Scan actions
│   │   ├── CoffeeAttributes.tsx     # Roast, origin, processing
│   │   ├── CoffeeFlavorNotes.tsx    # Flavor badges
│   │   └── CoffeeJargonBuster.tsx   # Term explanations
│   ├── hooks/
│   │   ├── useCoffee.ts             # Fetch single coffee
│   │   ├── useFavorites.ts          # User favorites CRUD
│   │   └── useInventory.ts          # User inventory CRUD
│   ├── services/
│   │   └── coffeeService.ts         # Database operations
│   └── types/
│       └── coffee.ts                # Coffee, CoffeeScanMeta types
│
├── scanner/                         # AI Scanner Feature
│   ├── components/
│   │   ├── ScanUploader.tsx         # Image upload/capture
│   │   ├── ScanProgress.tsx         # Multi-step progress
│   │   └── ScanResults.tsx          # Display scanned coffee
│   ├── hooks/
│   │   └── useCoffeeScanner.ts      # Scanner state machine
│   └── types/
│       └── scanner.ts               # ScannedCoffee type
│
├── marketplace/                     # Marketplace Feature
│   ├── components/
│   │   ├── ProductCard.tsx          # Product listing card
│   │   ├── ProductGrid.tsx          # Grid layout
│   │   ├── FilterPanel.tsx          # Filter controls
│   │   └── SortDropdown.tsx         # Sort options
│   ├── hooks/
│   │   ├── useMarketplaceProducts.ts # Data fetching + filtering
│   │   └── useRoasterStorefront.ts  # Roaster page data
│   └── data/
│       └── mockProducts.ts          # Fallback mock data (3 items)
│
├── quiz/                            # Coffee Quiz Feature
│   ├── components/
│   │   ├── ScenarioScreen.tsx       # Quiz question display
│   │   ├── VisualCard.tsx           # Selectable option card
│   │   └── TribeReveal.tsx          # Results animation
│   ├── hooks/
│   │   └── useQuizState.ts          # Quiz state management
│   └── data/
│       ├── scenarios.ts             # 5 quiz scenarios
│       └── tribes.ts                # 4 tribe definitions
│
├── dashboard/                       # User Dashboard
│   ├── components/
│   │   ├── DashboardSidebar.tsx     # Navigation sidebar
│   │   └── WidgetGrid.tsx           # Widget layout
│   ├── widgets/
│   │   ├── WelcomeHeroWidget.tsx    # Personalized greeting
│   │   ├── CoffeeTribeWidget.tsx    # Tribe display
│   │   ├── RecentScansWidget.tsx    # Scan history
│   │   └── FavoritesWidget.tsx      # Favorite coffees
│   └── hooks/
│       └── useDashboardData.ts      # Dashboard data fetching
│
└── cart/                            # Shopping Cart
    ├── components/
    │   ├── CartItemRow.tsx          # Line item display
    │   ├── CartPreview.tsx          # Header preview
    │   └── OrderSummary.tsx         # Totals calculation
    └── CartPage.tsx                 # Full cart page

├── recipes/                         # Brew Recipes
│   ├── components/
│   │   ├── RecipeCard.tsx           # Recipe listing card
│   │   ├── RecipeGrid.tsx           # Grid layout
│   │   ├── RecipeForm.tsx           # Create/edit form
│   │   └── RecipeDetail.tsx         # Full recipe view
│   ├── services/
│   │   └── recipeService.ts         # Database CRUD
│   └── types/
│       └── recipe.ts                # Recipe types

├── feedback/                        # User Feedback
│   ├── components/
│   │   ├── FeedbackDialog.tsx       # Feedback modal
│   │   ├── FeedbackTrigger.tsx      # CTA button
│   │   └── StarRating.tsx           # Rating stars
│   └── hooks/
│       └── useUsageSummary.ts       # Collect usage context

├── profile/                         # User Profile
│   ├── components/
│   │   ├── ProfileHero.tsx          # Avatar + cover
│   │   ├── TribeSection.tsx         # Coffee tribe display
│   │   ├── FavoritesTable.tsx       # Favorite coffees
│   │   ├── InventoryTable.tsx       # Coffee inventory
│   │   ├── ProfileInfoForm.tsx      # Edit profile
│   │   ├── ChangePasswordForm.tsx   # Password update
│   │   └── RetakeQuizSection.tsx    # Retake quiz CTA
│   └── ProfilePage.tsx              # Full profile page
│
└── learning/                        # Duolingo-Style Learning Module
    ├── components/
    │   ├── exercises/               # 12 exercise types
    │   │   ├── base/                # ExerciseWrapper, CheckButton, Feedback
    │   │   ├── knowledge/           # MultipleChoice, TrueFalse, FillInBlank...
    │   │   └── applied/             # Calculation, Prediction, Troubleshooting...
    │   ├── gamification/            # Streaks, XP, Hearts, Leagues, Achievements
    │   ├── lesson/                  # LessonScreen, LessonComplete, LessonProgress
    │   ├── mascot/                  # MascotCharacter, MascotDialogue, Reaction
    │   └── track/                   # TrackCard, TrackGrid, TrackPathView
    ├── hooks/                       # useLesson, useStreak, useXP, useHearts...
    ├── services/                    # learningService, progressService, xpService
    ├── pages/                       # LearnPage, TrackPage, LessonPage
    ├── data/                        # Mascot dialogues, daily goals
    └── types/                       # LearningTrack, LearningLesson, etc.
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION CLASS DIAGRAM                        │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                            AuthContext                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ - user: User | null                                                     │
│ - session: Session | null                                               │
│ - profile: Profile | null                                               │
│ - loading: boolean                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│ + signIn(email, password): Promise<void>                                │
│ + signUp(email, password, displayName?): Promise<void>                  │
│ + signOut(): Promise<void>                                              │
│ + refreshProfile(): Promise<void>                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ uses
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             Profile                                     │
├─────────────────────────────────────────────────────────────────────────┤
│ + id: string                                                            │
│ + display_name: string | null                                           │
│ + avatar_url: string | null                                             │
│ + coffee_tribe: CoffeeTribe | null                                      │
│ + is_onboarded: boolean                                                 │
│ + brewing_level: BrewingLevel                                           │
│ + weekly_goal_target: number                                            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           Role System                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐              │
│   │    USER     │     │   ROASTER   │     │    ADMIN    │              │
│   ├─────────────┤     ├─────────────┤     ├─────────────┤              │
│   │ - Browse    │     │ - All USER  │     │ - All ROASTER│             │
│   │ - Scan      │     │ - Manage own│     │ - Verify     │              │
│   │ - Favorites │     │   coffees   │     │   coffees    │              │
│   │ - Cart      │     │ - Manage    │     │ - Manage     │              │
│   │ - Dashboard │     │   roaster   │     │   roasters   │              │
│   │             │     │   profile   │     │ - Full DB    │              │
│   │             │     │             │     │   access     │              │
│   └─────────────┘     └─────────────┘     └─────────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DATABASE ENTITY RELATIONSHIPS                        │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   auth.users    │       │    profiles     │       │   user_roles    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────┤ id (PK, FK)     │       │ id (PK)         │
│ email           │       │ display_name    │       │ user_id (FK)────┼──┐
│ created_at      │       │ avatar_url      │       │ role (enum)     │  │
└─────────────────┘       │ coffee_tribe    │       └─────────────────┘  │
                          │ is_onboarded    │                            │
                          │ brewing_level   │                            │
                          │ weekly_goal     │                            │
                          └─────────────────┘                            │
                                                                         │
┌────────────────────────────────────────────────────────────────────────┘
│
│   ┌─────────────────┐       ┌─────────────────┐
│   │    roasters     │       │    coffees      │
│   ├─────────────────┤       ├─────────────────┤
└──►│ user_id (FK)    │       │ id (PK)         │
    │ id (PK)         │◄──────┤ roaster_id (FK) │
    │ business_name   │       │ name            │
    │ slug            │       │ brand           │
    │ description     │       │ origin_country  │
    │ logo_url        │       │ roast_level     │
    │ banner_url      │       │ flavor_notes[]  │
    │ location_city   │       │ acidity_score   │
    │ location_country│       │ body_score      │
    │ website         │       │ sweetness_score │
    │ certifications[]│       │ is_verified     │
    │ is_verified     │       │ source (enum)   │
    └─────────────────┘       │ created_by (FK)─┼──► auth.users
                              │ image_url       │
                              │ jargon_explan.  │
                              └────────┬────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  coffee_scans   │       │user_coffee_fav  │       │user_coffee_inv  │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ user_id (FK)    │       │ user_id (FK)    │
│ coffee_id (FK)──┼───────┤ coffee_id (FK)──┤───────┤ coffee_id (FK)──┤
│ image_url       │       │ added_at        │       │ quantity_grams  │
│ tribe_match_    │       └─────────────────┘       │ purchase_date   │
│   score         │                                 │ opened_date     │
│ match_reasons[] │                                 │ notes           │
│ ai_confidence   │                                 └─────────────────┘
│ scanned_at      │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│    recipes      │       │   brew_logs     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)────┼──►    │ user_id (FK)────┼──► auth.users
│ coffee_id (FK)──┼──►    │ coffee_name     │
│ name            │       │ brew_method     │
│ brew_method     │       │ brewed_at       │
│ grind_size      │       │ rating          │
│ ratio           │       │ notes           │
│ water_temp      │       └─────────────────┘
│ brew_time       │
│ steps[]         │
│ is_public       │
└─────────────────┘
```

### Unified Coffee Table

The `coffees` table is the **single source of truth** for all coffee data:

| Source | Description |
|--------|-------------|
| `scan` | User-scanned coffees (AI-generated data) |
| `admin` | Admin-verified coffees |
| `roaster` | Roaster-uploaded products |
| `import` | Bulk-imported catalog |

---

## Design System

### Color Hierarchy (60/30/10 Rule)

| Usage | Color | Hex |
|-------|-------|-----|
| 60% Background | Foam White | `#FDFCF7` |
| 30% Accent | Clarity Teal | `#4db6ac` |
| 10% CTAs | Energy Yellow | `#F1C30F` |
| Text/Borders | Bean Black | `#2C4450` |
| Warnings | Warm Orange | `#E67E22` |
| Errors | Chaos Red | `#E74C3C` |

### Typography

- **Headings:** `Bangers` (cursive), letter-spacing 0.05em
- **Body:** `Inter` (sans-serif), weights 400/500/700

### Visual Style

- 4px solid borders with 4px floating sticker shadow
- Border radius: 0.5rem (8px)
- Bold, playful aesthetic with retro-futuristic influences

---

## Security Summary

| Boundary | Status | Implementation |
|----------|--------|----------------|
| Authentication | ✅ | Supabase Auth with JWT |
| Authorization | ✅ | RBAC (user/roaster/admin) |
| Row Level Security | ✅ | All tables protected |
| Input Validation | ✅ | Zod schemas |
| XSS Prevention | ✅ | AI output sanitization |
| Rate Limiting | ✅ | Token bucket algorithm |
| Error Boundaries | ✅ | Global crash protection |

---

## Development

### Prerequisites

- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm))

### Quick Start

```sh
npm install
npm run dev
```

### Technologies

- **Vite** - Build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Zod** - Schema validation
- **React Query** - Data fetching

---

## Documentation

| Document | Description |
|----------|-------------|
| `README.md` | Project overview, architecture, flows |
| `CHANGELOG.md` | Version history |
| `BACKLOG.md` | Feature backlog and roadmap |
| `docs/AI_logic.md` | AI scanner implementation details |
| `docs/ERROR_HANDLING.md` | Error handling architecture |
| `docs/BACKEND_OPTIONS.md` | Backend technology comparison |

### Internationalization (i18n)

The app supports **English** and **Spanish** with full bilingual coverage:

- **Auto-detection**: Language defaults to browser locale (`navigator.language`)
- **Dictionary files**: `src/i18n/en.ts` and `src/i18n/es.ts` (~460+ keys each)
- **Context**: `LanguageContext` provides `t()` translation helper and `setLanguage()`
- **Coverage**: All user-facing pages including Learning Module gamification
- **Dynamic data**: Tribe names, quiz scenarios, scanner tips, and gamification strings translated
- **Selector**: Language toggle in UserMenu (desktop) and burger menu (mobile)

### Learning Module

Duolingo-style coffee education system with gamification:

- **Content hierarchy**: Tracks → Sections → Units → Lessons → Exercises
- **12 exercise types**: Multiple choice, true/false, fill-in-blank, matching pairs, calculation, prediction, sequencing, categorization, image identification, troubleshooting, recipe building, comparison
- **Gamification**: Streaks, XP with bonuses (perfect/speed/streak), hearts (lives), 7-tier leagues, milestone achievements
- **MVP content**: Brewing Science track, Section 1 (Extraction Fundamentals) — 4 units, 12 lessons, 72 exercises
- **Anonymous-first**: Guests can try lessons before signing up; progress migrates on auth
- **Mascots**: Caldi ☕ and The Goat 🐐 provide contextual dialogue and reactions

---

*Last Updated: 2026-02-26*
