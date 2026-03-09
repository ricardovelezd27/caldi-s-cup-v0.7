# Changelog

All notable changes to Caldi's Cup are documented here.

---

## [2.1.0] - 2026-03-09 - Lesson Exercise UI Polish (Phase L6)

### Added
- **Centered Feedback Modal**: Replaced bottom action bar with a `Dialog`-based `FeedbackModal` showing correct/incorrect status, mascot dialogues, and explanations
- **Exercise Error Reporting**: New `exercise_error_reports` table and `ReportExerciseErrorDialog` component — users can flag mistakes directly from the feedback modal
- **Persistent Layout During Exercises**: Exercises now wrapped in `PageLayout` so header/footer remain visible throughout lessons

### Fixed
- **Hearts System Bug**: `loseHeart` now upserts a `learning_user_streaks` row on first wrong answer instead of silently failing when no row exists
- **Hearts Refill Interval**: Changed from 4 hours to 24 hours (daily replenishment)
- **Lesson Results Screen**: Removed duplicate back navigation; ensured "Back to Track" button properly navigates after XP processing
- **BottomActionBar Positioning**: Changed from `fixed` to `sticky` so it sits above the footer instead of overlapping it

### Changed
- `LessonScreen.tsx`: Refactored exercise/feedback rendering to use `FeedbackModal` and `PageLayout`
- `useHearts.ts`: Upsert logic on first heart loss, 24h refill interval
- i18n dictionaries: Added ~10 keys for report error UI (EN/ES)

---

## [2.0.0] - 2026-02-26 - Learning Module Complete (Phases L1-L5)

### Added
- **Learning Module Database** (Phase L1):
  - 13 tables: tracks, sections, units, lessons, exercises, user progress, streaks, leagues, achievements, daily goals, exercise history, user league, user achievements
  - RLS policies for public content reads and user-scoped progress writes
  - `update_streak_and_xp` RPC function for atomic streak/XP updates

- **Learning UI Components** (Phase L2):
  - `LearnPage` with track grid, `TrackPage` with section/unit path view
  - `LessonPage` with state machine (`useLesson`) managing intro → exercises → completion
  - Mascot system: Caldi ☕ and The Goat 🐐 with context-aware dialogues and reactions
  - Anonymous-first flow: guests can try lessons, prompted to sign up after 3

- **12 Exercise Templates** (Phase L3):
  - Knowledge: MultipleChoice, TrueFalse, FillInBlank, MatchingPairs, Sequencing, ImageIdentification, Categorization
  - Applied: Calculation, Prediction, Troubleshooting, RecipeBuilding, Comparison
  - Base components: ExerciseWrapper, CheckButton, ExerciseFeedback, ExerciseOption

- **Gamification Integration** (Phase L4):
  - Hearts system: deduct on wrong answers, show HeartsEmptyModal at 0, auto-refill every 4h
  - XP calculation with bonuses: base + perfect lesson + speed + streak length + first-of-day
  - Streak tracking via RPC, daily goal progress, weekly league XP
  - Achievement unlock checks on lesson completion
  - LessonComplete shows XP breakdown and achievement modals
  - HeartsDisplay added to lesson progress header
  - Exercise history recorded per attempt for future spaced repetition
  - ~55 gamification i18n keys added (EN/ES)

- **MVP Content Population** (Phase L5):
  - Brewing Science → Section 1: Extraction Fundamentals (SQL seed)
  - 4 units: Alchemy of the Bean, Extraction Timeline, Under vs Over, The Balanced Cup
  - 12 lessons, 72 exercises across all 12 types
  - Full bilingual question_data JSONB (EN/ES)

- **Track Navigation Fix** (Phase L5):
  - `useTrackPath` hook fetches units/lessons with batch queries (N+1 prevention)
  - `TrackPathView` renders vertical lesson path with status indicators
  - Lesson statuses: completed (green ✓), available (teal pulse), locked (gray 🔒)

### Changed
- `learningService.ts`: Added `getUnitsBySectionIds`, `getLessonsByUnitIds`, `getLessonById`
- `useLesson` hook: Now fetches lesson metadata and records exercise history
- `LessonScreen`: Fully wired to gamification services on completion
- `LessonProgress`: Now includes HeartsDisplay component
- i18n dictionaries expanded to ~460+ keys each

---

## [1.1.0] - 2026-02-20 - Multi-Image Scanner & Coffee Profile Gallery

### Added
- **Multi-Image Scanner**:
  - Users can add up to 4 photos of different sides of a coffee bag before scanning
  - Thumbnail grid with add/remove controls and explicit "Scan Now" button
  - Client-side canvas stitching composites 1-4 images into a single grid (2×1 or 2×2)
  - Zero additional AI credit cost: always 1 AI call per scan regardless of photo count

- **Coffee Profile Image Gallery**:
  - Amazon-style gallery with large main image + horizontal scrollable thumbnail row
  - Clicking a thumbnail swaps it into the main display
  - Individual photos passed via route state (not persisted to DB)

- **Color-Coded Flavor Notes**:
  - AI-generated flavor notes displayed in yellow (primary)
  - User-submitted flavor notes displayed in teal (secondary)

- **Edge Function Prompt Update**:
  - AI instructed to analyze all visible panels in composite grid as one product

- **i18n Keys**: Added ~6 new scanner keys (EN/ES) for multi-image controls

### Changed
- Scanner no longer auto-triggers on first image; user controls when to scan
- Coffee profile layout reorganized: coffee info on right, roaster info on left (desktop)

---

## [1.0.0] - 2026-02-20 - Full i18n Coverage (EN/ES)

### Added
- **Internationalization (i18n)**:
  - Full bilingual support: English and Spanish
  - ~400 translation keys per language across all user-facing pages
  - Auto-detection from browser locale (`navigator.language`)
  - Language toggle in UserMenu (desktop) and burger menu (mobile)
  
- **Translated Pages**:
  - Auth (Login/Signup forms, error messages)
  - Quiz (Onboarding slides, scenarios, tribe reveal, results)
  - Scanner (Uploader, progress steps, tips, manual add form)
  - Coffee Profile (Attributes, flavor notes, actions, jargon buster, match score)
  - Profile (Tribe section, password form, favorites/inventory tables, retake quiz)
  - Shared (Feedback CTA, navigation)

- **Dynamic Data Translation**:
  - Tribe names, titles, descriptions resolved via i18n keys instead of static data
  - Quiz scenarios and options translated per language
  - Scanner tips (generic + tribe-specific) translated

### Changed
- `LanguageContext` initializes from `navigator.language`
- Language selector moved from header to UserMenu/burger menu
- Logo restored to far-left position with scroll animation

---

## [0.9.0] - 2026-02-02 - Unified Coffee Catalog & Marketplace Integration

### Added
- **Unified Coffee Catalog**:
  - Single `coffees` table as source of truth for all coffee data
  - `source` enum: scan, admin, roaster, import
  - `is_verified` flag for admin-approved products
  
- **Auto Roaster Creation**:
  - Edge function creates roaster profiles on new brand detection
  - Searches existing roasters by brand/slug before creating
  - Links coffees to roasters via `roaster_id`
  
- **Marketplace Database Integration**:
  - `useMarketplaceProducts` hook fetches from coffees table
  - Merges database coffees with mock products
  - Roasters filter populated from database
  - `coffeeToProduct` transformation utility

- **Documentation Updates**:
  - README.md with UML diagrams and flow charts
  - Component diagrams for feature modules
  - Entity relationship diagram for database
  - Sequence diagrams for key flows

### Changed
- Marketplace now displays all coffees (verified + scanned)
- Product page resolves roaster from database
- Mock products reduced to 3 items (prod-1, prod-2, prod-3)

### Removed
- `scanned_coffees` table (replaced by unified `coffees` table)
- Legacy `user_favorites` table (replaced by `user_coffee_favorites`)

---

## [0.8.0] - AI Coffee Scanner & Profiler

### Added
- **AI Coffee Scanner**: Upload/scan coffee bag images for AI-powered analysis
- **Lovable AI Integration**: Uses Gemini 2.5 Flash for image analysis via edge function
- **coffee_scans table**: Tracks scan history with references to coffees
- **coffee-scans storage bucket**: Secure image storage for scans
- **Scanner UI Components**: ScanUploader, ScanProgress, ScanResults
- **Tribe Match Scoring**: Personalized preference assessment based on user's coffee tribe
- **Jargon Buster**: Expandable explanations for coffee terminology
- **Dashboard FAB**: Floating action button to access scanner from dashboard
- **Scanner in sidebar**: Added to dashboard navigation

### Security
- RLS policies on coffee_scans (users can only view/insert/delete own scans)
- Storage policies for coffee-scans bucket
- Input validation for image uploads (type, size limits)
- AI output sanitization (XSS prevention)

---

## [0.7.0] - 2025-12-17 - Personalized User Dashboard

### Added
- **Database Schema**:
  - `brewing_level` enum type (beginner, intermediate, expert)
  - `weekly_goal_target` and `brewing_level` columns on `profiles`
  - `brew_logs` table for tracking coffee brews (with RLS)
  - `user_coffee_favorites` table for favorite coffees (with RLS)
  - Indexes for user-specific queries

- **Dashboard Feature** (`src/features/dashboard/`):
  - `DashboardPage.tsx` - main protected dashboard with sidebar layout
  - `useDashboardData` hook - fetches profile, brews, favorites, weekly count

- **Dashboard Components**:
  - `DashboardSidebar.tsx` - collapsible navigation sidebar
  - `WelcomeHeroWidget.tsx` - personalized greeting with tribe info
  - `CoffeeTribeWidget.tsx` - displays Coffee Tribe with emoji and description
  - `RecentBrewsCard.tsx` - table of recent brew logs
  - `FavoriteCoffeeCard.tsx` - highlighted favorite coffee
  - `WeeklyGoalCard.tsx` - circular progress for weekly brew goal
  - `BrewingLevelCard.tsx` - linear progress for brewing level

### Changed
- `AuthContext` Profile type includes `weekly_goal_target` and `brewing_level`
- `UserMenu` now links to Dashboard (instead of Profile)
- Added `/dashboard` route

### Security
- RLS policies on `brew_logs` and `user_coffee_favorites` tables
- Route protection redirects unauthenticated users to `/auth`

---

## [0.6.0] - 2025-12-17 - Coffee Personality Quiz

### Added
- **Database Schema**:
  - `coffee_tribe` enum type (fox, owl, hummingbird, bee)
  - `coffee_tribe`, `is_onboarded`, `onboarded_at` columns on `profiles`
  - Index for tribe lookups

- **Quiz Feature** (`src/features/quiz/`):
  - Complete visual card picker with 5 lifestyle scenarios
  - 4 Coffee Tribe archetypes: Fox (Tastemaker), Owl (Optimizer), Hummingbird (Explorer), Bee (Loyalist)
  - `QuizPage.tsx` - main quiz flow with hook intro and scenario screens
  - `ResultsPage.tsx` - tribe reveal with personalized recommendations

- **Quiz Components**:
  - `QuizHook.tsx` - intro screen with headline and CTA
  - `ScenarioScreen.tsx` - 2x2 visual card grid
  - `VisualCard.tsx` - selectable card with icon and tribe styling
  - `QuizProgress.tsx` - step indicator with progress bar
  - `QuizNavigation.tsx` - skip/next controls
  - `ResultsPreview.tsx` - running scores during quiz
  - `TribeReveal.tsx` - animated tribe reveal component

- **State Management**:
  - `useQuizState` hook with localStorage persistence
  - Score calculation and tie-breaker logic
  - Guest flow (localStorage) and authenticated flow (profile save)

### Changed
- Index page CTAs now link to `/quiz`
- `AuthContext` Profile type includes tribe fields
- Added `/quiz` and `/results` routes

---

## [0.5.0] - 2025-12-16 - Authentication Foundation

### Added
- **Lovable Cloud Integration** (Phase 5A):
  - Supabase backend infrastructure enabled
  - Auto-generated client at `src/integrations/supabase/client.ts`
  - Environment variables configured

- **Database Schema** (Phase 5B):
  - `profiles` table with RLS (view/update own profile)
  - `user_roles` table with `app_role` enum (user, roaster, admin)
  - `has_role()` security definer function
  - `handle_new_user()` trigger - auto-creates profile and assigns default role
  - `update_updated_at_column()` trigger for timestamp management

- **Authentication UI** (Phase 5C):
  - `Auth.tsx` page with login/signup tabs
  - `LoginForm.tsx` with email/password validation
  - `SignupForm.tsx` with optional display name
  - `AuthCard.tsx` branded wrapper
  - Zod schemas in `auth.schema.ts`

- **Auth Context & Integration** (Phase 5D):
  - `AuthProvider` with session management
  - `useAuth` hook (user, session, profile, signIn, signUp, signOut)
  - `UserMenu` dropdown component
  - Header integration with auth state

### Security
- Roles stored in separate `user_roles` table
- RLS policies on all tables
- Security definer function prevents privilege escalation
- Zod validation on all auth inputs

---

## [0.4.0] - 2025-12-16 - Error Handling & Production Resilience

### Added
- **Error Boundaries** (Phase 4A):
  - `ErrorBoundary` component - global React error catcher
  - `ErrorFallback` component - user-friendly error UI with recovery options

- **Error Logging Service** (Phase 4B):
  - `errorLogger` service with structured logging
  - Log levels: debug, info, warn, error, fatal
  - In-memory buffer (50 entries) for debugging
  - Ready for external service integration

- **Network Resilience** (Phase 4C):
  - `retryWithBackoff` utility - exponential backoff with jitter
  - `useNetworkStatus` hook - monitor connectivity
  - `OfflineIndicator` component - banner when offline

- **Storage Fallbacks** (Phase 4D):
  - `storageFactory` with automatic fallbacks
  - User notification when storage is degraded
  - Safe JSON parse/stringify utilities

- **Rate Limiting** (Phase 4E):
  - Token bucket rate limiter
  - Cart-specific rate limiter singleton
  - 10 ops burst, 2/sec refill rate

---

## [0.3.0] - 2025-12-16 - Backend-Agnostic Integration Prep

### Added
- **Backend-Agnostic Architecture**:
  - `ExtendedCartState` type replacing Shopify-specific naming
  - `CartItemOperations` for per-item loading/error states
  - `lineId` field in `CartItem` for external backend sync

- **Optimistic Updates**:
  - `useOptimisticCart` hook with debounced updates
  - Automatic rollback on failure
  - Per-item loading states

- **Service Factory Pattern**:
  - `createCartService()` supports local/shopify/supabase backends
  - `getDefaultDataSource()` and `isBackendAvailable()` helpers

- **Backend Options Documentation**:
  - `docs/BACKEND_OPTIONS.md` with Shopify vs Supabase comparison

---

## [0.2.0] - 2025-12-15 - Marketplace Browse & Navigation

### Added
- **Marketplace Browse Page** (`/marketplace`):
  - Product grid with responsive layout
  - Filter panel (search, origin, roast level, grind, price range)
  - Sort dropdown (best match, price, newest, rating)
  - Pagination controls
  - Skeleton loaders

- **Navigation System**:
  - Desktop navigation links in header
  - Mobile hamburger menu with Sheet slide-out

- **New Components**:
  - `ProductCard`, `ProductCardSkeleton`
  - `SortDropdown`, `FilterPanel`
  - `ProductGrid`, `MarketplacePagination`

- **Utilities**:
  - `useDebouncedValue` hook
  - Filter/sort/paginate utilities

---

## [0.1.0] - 2025-12-12 - Foundation & Code Cleanup

### Added
- Landing page with Hero, Problem, and Solution sections
- Brand design system with 60/30/10 color hierarchy
- Reusable components: `CaldiCard`, `SectionHeading`, `Container`
- Layout components: `PageLayout`, `Header`, `Footer`
- TypeScript types for coffee domain entities
- Hero section with Modern Caldi mascot

### Changed
- Centralized CTA text in `APP_CONFIG`
- Updated favicon to custom brand icon

### Removed
- Unused character assets
- Dead code and unused imports

---

*Last Updated: 2026-02-26*
