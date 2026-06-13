# 📁 GanitQuest — Industry-Standard Folder Structure

> A comprehensive restructuring proposal for the GanitQuest monorepo.  
> Goal: **Scalability · Code Reusability · Team Collaboration · Testability**

---

## Table of Contents

- [Current Structure (As-Is)](#current-structure-as-is)
- [Problems with Current Structure](#problems-with-current-structure)
- [Proposed Industry-Standard Structure](#proposed-industry-standard-structure)
- [Detailed File Mapping](#detailed-file-mapping)
- [Code Reusability Strategy](#code-reusability-strategy)
- [Shared Package (`packages/shared`)](#shared-package-packagesshared)
- [Migration Checklist](#migration-checklist)

---

## Current Structure (As-Is)

```
gamified_math/
├── .env
├── .git/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── README.md
├── .gitignore
├── IDEAS.md
├── PRODUCT_ANALYSIS.md
├── README.md
├── add_board_lines.cjs          ← ⚠️ Script at root (no clear purpose)
├── refactor.cjs                 ← ⚠️ Script at root
├── dist/
├── docs/
│   ├── MOBILE_IMPLEMENTATION_SUMMARY.md
│   ├── MOBILE_INTERACTIVITY_GUIDE.md
│   ├── PHASE_2_IMPLEMENTATION.md
│   ├── PHASE_2_TESTING_GUIDE.md
│   ├── SCENE_QUESTION_ALIGNMENT.md
│   ├── business_logic.md
│   ├── frontend_architecture_deep_dive.md
│   ├── launch_marketing_monetization.md
│   ├── react_native_conversion.md
│   └── technical_documentation.md
├── index.html
├── package.json                 ← Frontend package (includes mysql2, typeorm — backend deps!)
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── scratch/
├── server/                      ← Separate backend with its own package.json
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── schema.sql
│   ├── tsconfig.json
│   └── src/
│       ├── data-source.ts
│       ├── index.ts
│       ├── entities/
│       │   ├── Subscription.ts
│       │   ├── User.ts
│       │   └── UserProgress.ts
│       ├── middleware/
│       │   ├── auth.ts
│       │   └── validate.ts
│       ├── migrations/
│       │   └── 1700000000000-InitialMigration.ts
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── leaderboard.ts
│       │   ├── progress.ts
│       │   └── subscription.ts
│       ├── seeds/
│       │   ├── UserSeeder.ts
│       │   └── run-seeds.ts
│       └── validations/
│           ├── authSchemas.ts
│           ├── progressSchemas.ts
│           └── subscriptionSchemas.ts
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/                 ← ⚠️ Flat mix of UI + screens + features
│   │   ├── ConceptBook.tsx
│   │   ├── GameContainer.tsx
│   │   ├── Header.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── ResultScreen.tsx
│   │   ├── auth/
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ResetPasswordScreen.tsx
│   │   ├── chapter/
│   │   │   ├── ChapterGrid.tsx
│   │   │   └── LevelGrid.tsx
│   │   ├── concept-panel/
│   │   │   ├── BoardExamNotebook.tsx
│   │   │   ├── ConceptPanel.tsx
│   │   │   ├── ConceptPanelHeader.tsx
│   │   │   └── FormulaDisplayBox.tsx
│   │   ├── learn/
│   │   │   ├── Paywall.tsx
│   │   │   └── animations/
│   │   │       ├── CoordinateGrid.tsx
│   │   │       ├── DistanceVisualizer.tsx
│   │   │       └── PointPlotter.tsx
│   │   └── screens/               ← ⚠️ Page-level components buried inside components/
│   │       ├── ChapterIntroScreen.tsx
│   │       ├── ChapterScreen.tsx
│   │       ├── GradeScreen.tsx
│   │       ├── HomeScreen.tsx
│   │       ├── LeaderboardScreen.tsx
│   │       ├── LearnScreen.tsx
│   │       └── LevelGridScreen.tsx
│   ├── data/
│   │   ├── chapterVideos.md
│   │   ├── engine/                 ← Empty
│   │   ├── levelSpecs.ts
│   │   ├── levels/
│   │   │   ├── applicationsTrigLevels.json
│   │   │   ├── areasCircleLevels.json
│   │   │   ├── arithmeticProgressionLevels.json
│   │   │   ├── circleLevels.json
│   │   │   ├── coordinateGeometryLevels.json
│   │   │   ├── probabilityLevels.json
│   │   │   ├── statisticsLevels.json
│   │   │   ├── surfaceAreaVolumeLevels.json
│   │   │   ├── trianglesLevels.json
│   │   │   └── trigonometryLevels.json
│   │   ├── levels.ts
│   │   └── specs/
│   │       ├── applicationsTrigSpecs.ts
│   │       ├── areasCircleSpecs.ts
│   │       ├── arithmeticProgressionSpecs.ts
│   │       ├── circleSpecs.ts
│   │       ├── circleSpecsGujarati.ts
│   │       ├── coordinateGeometrySpecs.ts
│   │       ├── probabilitySpecs.ts
│   │       ├── statisticsSpecs.ts
│   │       ├── surfaceAreaVolumeSpecs.ts
│   │       ├── trianglesSpecs.ts
│   │       └── trigonometrySpecs.ts
│   ├── game/
│   │   ├── EventBus.ts
│   │   ├── PhaserGame.tsx
│   │   ├── SoundManager.ts
│   │   ├── TouchHandler.ts
│   │   ├── config.ts
│   │   ├── entities/               ← Empty
│   │   ├── managers/               ← Empty
│   │   ├── mechanics/
│   │   │   ├── algebra/            ← Empty
│   │   │   ├── circles/            ← Empty
│   │   │   ├── coordinate/         ← Empty
│   │   │   ├── geometry/           ← Empty
│   │   │   ├── mensuration/        ← Empty
│   │   │   ├── prob/               ← Empty
│   │   │   ├── shared/             ← Empty
│   │   │   ├── stats/              ← Empty
│   │   │   └── trig/               ← Empty
│   │   └── scenes/
│   │       ├── APScene.ts          (21 KB)
│   │       ├── ApplicationsTrigScene.ts (13 KB)
│   │       ├── AreasCircleScene.ts (20 KB)
│   │       ├── BootScene.ts
│   │       ├── CircleScene.ts      (56 KB!) ← ⚠️ Massive file
│   │       ├── CoordinateScene.ts  (31 KB)
│   │       ├── LevelScene.ts       (61 KB!) ← ⚠️ God class
│   │       ├── ProbabilityScene.ts (29 KB)
│   │       ├── StatisticsScene.ts  (20 KB)
│   │       ├── TriangleScene.ts    (41 KB)
│   │       └── TrigonometryScene.ts (46 KB)
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en/
│   │       └── gu/
│   └── store/
│       ├── authStore.ts
│       ├── gameStore.ts
│       └── subscriptionStore.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Problems with Current Structure

### 🔴 Critical Issues

| # | Issue | Impact |
|---|-------|--------|
| 1 | **Backend deps in frontend `package.json`** (`mysql2`, `typeorm`) | Bloats client bundle, security risk |
| 2 | **God-class scene files** (`LevelScene.ts` 61KB, `CircleScene.ts` 56KB) | Unmaintainable, untestable, no reuse |
| 3 | **No shared types/constants** between client & server | Duplicated validation logic (Zod on both sides) |
| 4 | **Pages mixed inside `components/`** | Unclear separation of pages vs. reusable UI |
| 5 | **ProtectedRoute defined inside `App.tsx`** | Not reusable, bloats routing file |
| 6 | **No custom hooks directory** | Business logic trapped in components |
| 7 | **No services/API layer** | `axios` calls sprinkled across stores & components |
| 8 | **Loose scripts at root** (`add_board_lines.cjs`, `refactor.cjs`) | No organized tooling |
| 9 | **Empty placeholder directories** (`entities/`, `managers/`, `mechanics/*`) | Dead code / abandoned scaffolding |
| 10 | **No testing infrastructure** at all — no test files, no test config | Zero test coverage |

### 🟡 Moderate Issues

| # | Issue | Impact |
|---|-------|--------|
| 11 | No `types/` directory for shared interfaces | Types scattered across files |
| 12 | No `constants/` file — magic strings everywhere | Harder to refactor routes, level IDs |
| 13 | `data/specs/` files are 30-60 KB each | Should be lazy-loaded JSON, not bundled TS |
| 14 | Missing barrel exports (`index.ts`) | Long import paths |
| 15 | No monorepo tooling (turborepo/nx) | Separate `npm install` for client & server |

---

## Proposed Industry-Standard Structure

```
gamified_math/
│
├── .github/
│   └── workflows/
│       ├── ci.yml                      # Lint + test + build
│       └── deploy.yml                  # Staging/prod deploy
│
├── .husky/                             # Git hooks (pre-commit lint, etc.)
│   └── pre-commit
│
├── docs/                               # Product & tech documentation
│   ├── architecture/
│   │   ├── system-overview.md
│   │   └── frontend-architecture.md
│   ├── api/
│   │   └── api-reference.md
│   ├── guides/
│   │   ├── mobile-implementation.md
│   │   ├── mobile-interactivity.md
│   │   └── react-native-conversion.md
│   ├── business/
│   │   ├── business-logic.md
│   │   ├── product-analysis.md
│   │   └── launch-marketing.md
│   └── roadmap/
│       ├── ideas.md
│       ├── phase-2-implementation.md
│       └── phase-2-testing.md
│
├── packages/                           # ✅ MONOREPO: Shared code
│   └── shared/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts                # Barrel export
│           ├── types/                  # 🔁 Shared interfaces (client + server)
│           │   ├── user.types.ts
│           │   ├── game.types.ts
│           │   ├── progress.types.ts
│           │   ├── subscription.types.ts
│           │   └── api.types.ts        # Request/Response shapes
│           ├── constants/              # 🔁 Shared constants
│           │   ├── chapters.ts         # Chapter IDs, names, configs
│           │   ├── levels.ts           # Level ID patterns, counts
│           │   ├── routes.ts           # API route strings
│           │   └── game.ts             # XP values, star thresholds
│           ├── validations/            # 🔁 Shared Zod schemas
│           │   ├── auth.schema.ts
│           │   ├── progress.schema.ts
│           │   └── subscription.schema.ts
│           └── utils/                  # 🔁 Shared utility functions
│               ├── levelId.utils.ts    # Level ID generators/parsers
│               ├── math.utils.ts       # Common math helpers
│               └── format.utils.ts     # Formatting helpers
│
├── apps/
│   │
│   ├── web/                            # ✅ FRONTEND (React + Vite + Phaser)
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.node.json
│   │   ├── vite.config.ts
│   │   ├── eslint.config.js
│   │   ├── .env.example
│   │   │
│   │   ├── public/
│   │   │   ├── favicon.svg
│   │   │   ├── icons.svg
│   │   │   └── locales/               # i18n JSON files (loaded at runtime)
│   │   │       ├── en/
│   │   │       │   └── translation.json
│   │   │       └── gu/
│   │   │           └── translation.json
│   │   │
│   │   └── src/
│   │       ├── main.tsx                # React entry point
│   │       ├── App.tsx                 # Root component (providers only)
│   │       │
│   │       ├── app/                    # App-level configuration
│   │       │   ├── routes.tsx          # Route definitions (centralized)
│   │       │   ├── providers.tsx       # All providers wrapped
│   │       │   └── i18n.ts            # i18n config
│   │       │
│   │       ├── assets/                 # Static assets bundled by Vite
│   │       │   └── images/
│   │       │       └── hero.png
│   │       │
│   │       ├── components/             # ✅ REUSABLE UI components only
│   │       │   ├── ui/                 # Atomic / base UI
│   │       │   │   ├── Button/
│   │       │   │   │   ├── Button.tsx
│   │       │   │   │   ├── Button.test.tsx
│   │       │   │   │   └── index.ts
│   │       │   │   ├── Card/
│   │       │   │   ├── Modal/
│   │       │   │   ├── Input/
│   │       │   │   ├── Badge/
│   │       │   │   └── Loader/
│   │       │   │
│   │       │   ├── layout/             # Layout components
│   │       │   │   ├── Header/
│   │       │   │   │   ├── Header.tsx
│   │       │   │   │   └── index.ts
│   │       │   │   ├── Footer/
│   │       │   │   ├── Sidebar/
│   │       │   │   └── PageLayout/
│   │       │   │
│   │       │   └── common/             # Shared composite components
│   │       │       ├── LanguageSwitcher/
│   │       │       ├── ProtectedRoute/
│   │       │       ├── ErrorBoundary/
│   │       │       └── SEOHead/
│   │       │
│   │       ├── features/               # ✅ FEATURE-based modules
│   │       │   │
│   │       │   ├── auth/               # 🔐 Authentication feature
│   │       │   │   ├── components/
│   │       │   │   │   ├── LoginForm.tsx
│   │       │   │   │   ├── RegisterForm.tsx
│   │       │   │   │   ├── ForgotPasswordForm.tsx
│   │       │   │   │   └── SocialLoginButton.tsx
│   │       │   │   ├── hooks/
│   │       │   │   │   ├── useAuth.ts
│   │       │   │   │   └── useAuthForm.ts
│   │       │   │   ├── pages/
│   │       │   │   │   ├── LoginPage.tsx
│   │       │   │   │   ├── RegisterPage.tsx
│   │       │   │   │   ├── ForgotPasswordPage.tsx
│   │       │   │   │   └── ResetPasswordPage.tsx
│   │       │   │   ├── services/
│   │       │   │   │   └── auth.service.ts
│   │       │   │   └── index.ts        # Barrel export
│   │       │   │
│   │       │   ├── chapters/           # 📚 Chapter selection feature
│   │       │   │   ├── components/
│   │       │   │   │   ├── ChapterCard.tsx
│   │       │   │   │   ├── ChapterGrid.tsx
│   │       │   │   │   ├── ChapterIntro.tsx
│   │       │   │   │   └── LevelGrid.tsx
│   │       │   │   ├── hooks/
│   │       │   │   │   └── useChapters.ts
│   │       │   │   ├── pages/
│   │       │   │   │   ├── ChapterListPage.tsx
│   │       │   │   │   ├── ChapterIntroPage.tsx
│   │       │   │   │   └── LevelGridPage.tsx
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── game/               # 🎮 Game engine feature
│   │       │   │   ├── components/
│   │       │   │   │   ├── GameContainer.tsx
│   │       │   │   │   ├── PhaserGame.tsx
│   │       │   │   │   ├── ResultScreen.tsx
│   │       │   │   │   └── ConceptBook.tsx
│   │       │   │   ├── engine/
│   │       │   │   │   ├── config.ts
│   │       │   │   │   ├── EventBus.ts
│   │       │   │   │   ├── SoundManager.ts
│   │       │   │   │   └── TouchHandler.ts
│   │       │   │   ├── scenes/
│   │       │   │   │   ├── base/
│   │       │   │   │   │   ├── BaseScene.ts       # ✅ Abstract base (shared logic)
│   │       │   │   │   │   ├── QuestionMixin.ts   # ✅ Q&A logic extracted
│   │       │   │   │   │   ├── UIMixin.ts         # ✅ UI helpers extracted
│   │       │   │   │   │   └── ScoreMixin.ts      # ✅ Scoring extracted
│   │       │   │   │   ├── BootScene.ts
│   │       │   │   │   ├── APScene.ts
│   │       │   │   │   ├── CircleScene.ts
│   │       │   │   │   ├── CoordinateScene.ts
│   │       │   │   │   ├── LevelScene.ts
│   │       │   │   │   ├── ProbabilityScene.ts
│   │       │   │   │   ├── StatisticsScene.ts
│   │       │   │   │   ├── TriangleScene.ts
│   │       │   │   │   ├── TrigonometryScene.ts
│   │       │   │   │   └── ApplicationsTrigScene.ts
│   │       │   │   ├── mechanics/
│   │       │   │   │   ├── shared/
│   │       │   │   │   │   ├── DragMechanic.ts
│   │       │   │   │   │   ├── MCQMechanic.ts
│   │       │   │   │   │   ├── SliderMechanic.ts
│   │       │   │   │   │   └── DrawingMechanic.ts
│   │       │   │   │   └── topic/
│   │       │   │   │       ├── algebra/
│   │       │   │   │       ├── geometry/
│   │       │   │   │       └── trig/
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── learn/              # 📖 Learn / concept panels
│   │       │   │   ├── components/
│   │       │   │   │   ├── ConceptPanel.tsx
│   │       │   │   │   ├── ConceptPanelHeader.tsx
│   │       │   │   │   ├── FormulaDisplayBox.tsx
│   │       │   │   │   ├── BoardExamNotebook.tsx
│   │       │   │   │   └── Paywall.tsx
│   │       │   │   ├── animations/
│   │       │   │   │   ├── CoordinateGrid.tsx
│   │       │   │   │   ├── DistanceVisualizer.tsx
│   │       │   │   │   └── PointPlotter.tsx
│   │       │   │   ├── pages/
│   │       │   │   │   └── LearnPage.tsx
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── leaderboard/        # 🏆 Leaderboard feature
│   │       │   │   ├── components/
│   │       │   │   │   └── LeaderboardTable.tsx
│   │       │   │   ├── hooks/
│   │       │   │   │   └── useLeaderboard.ts
│   │       │   │   ├── pages/
│   │       │   │   │   └── LeaderboardPage.tsx
│   │       │   │   ├── services/
│   │       │   │   │   └── leaderboard.service.ts
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── subscription/       # 💳 Subscription/paywall
│   │       │   │   ├── hooks/
│   │       │   │   │   └── useSubscription.ts
│   │       │   │   ├── services/
│   │       │   │   │   └── subscription.service.ts
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   └── home/               # 🏠 Home / grade selection
│   │       │       ├── pages/
│   │       │       │   ├── HomePage.tsx
│   │       │       │   └── GradeSelectionPage.tsx
│   │       │       └── index.ts
│   │       │
│   │       ├── hooks/                  # ✅ App-wide custom hooks
│   │       │   ├── useMediaQuery.ts
│   │       │   ├── useDebounce.ts
│   │       │   ├── useLocalStorage.ts
│   │       │   └── useOnlineStatus.ts
│   │       │
│   │       ├── services/               # ✅ API client layer
│   │       │   ├── api.client.ts       # Axios instance + interceptors
│   │       │   └── api.config.ts       # Base URL, timeouts
│   │       │
│   │       ├── store/                  # ✅ Global state (Zustand)
│   │       │   ├── auth.store.ts
│   │       │   ├── game.store.ts
│   │       │   └── subscription.store.ts
│   │       │
│   │       ├── data/                   # ✅ Static game content
│   │       │   ├── levels/             # Level JSON definitions
│   │       │   │   ├── applicationsTrig.levels.json
│   │       │   │   ├── areasCircle.levels.json
│   │       │   │   ├── arithmeticProgression.levels.json
│   │       │   │   ├── circle.levels.json
│   │       │   │   ├── coordinateGeometry.levels.json
│   │       │   │   ├── probability.levels.json
│   │       │   │   ├── statistics.levels.json
│   │       │   │   ├── surfaceAreaVolume.levels.json
│   │       │   │   ├── triangles.levels.json
│   │       │   │   └── trigonometry.levels.json
│   │       │   ├── specs/              # Question specs per chapter
│   │       │   │   └── ...             # (Same files, but lazy-loaded)
│   │       │   ├── levels.registry.ts  # Central level registry
│   │       │   └── levelSpecs.ts
│   │       │
│   │       ├── styles/                 # ✅ Global styles
│   │       │   ├── index.css           # Tailwind + base
│   │       │   ├── variables.css       # CSS custom properties
│   │       │   └── animations.css      # Reusable keyframes
│   │       │
│   │       └── lib/                    # ✅ Third-party wrappers
│   │           ├── axios.ts            # Pre-configured Axios
│   │           ├── i18n.ts             # i18n init
│   │           └── sentry.ts           # Error tracking (future)
│   │
│   └── server/                         # ✅ BACKEND (Express + TypeORM)
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env.example
│       ├── nodemon.json
│       │
│       └── src/
│           ├── index.ts                # Server entry
│           ├── app.ts                  # Express app setup (separated from listen)
│           │
│           ├── config/                 # ✅ Configuration
│           │   ├── database.ts         # TypeORM data-source
│           │   ├── env.ts              # Validated env variables
│           │   └── swagger.ts          # Swagger config
│           │
│           ├── modules/                # ✅ Feature modules
│           │   ├── auth/
│           │   │   ├── auth.controller.ts
│           │   │   ├── auth.service.ts
│           │   │   ├── auth.routes.ts
│           │   │   └── auth.test.ts
│           │   ├── progress/
│           │   │   ├── progress.controller.ts
│           │   │   ├── progress.service.ts
│           │   │   ├── progress.routes.ts
│           │   │   └── progress.test.ts
│           │   ├── leaderboard/
│           │   │   ├── leaderboard.controller.ts
│           │   │   ├── leaderboard.service.ts
│           │   │   ├── leaderboard.routes.ts
│           │   │   └── leaderboard.test.ts
│           │   └── subscription/
│           │       ├── subscription.controller.ts
│           │       ├── subscription.service.ts
│           │       ├── subscription.routes.ts
│           │       └── subscription.test.ts
│           │
│           ├── entities/               # TypeORM entities
│           │   ├── User.entity.ts
│           │   ├── Subscription.entity.ts
│           │   └── UserProgress.entity.ts
│           │
│           ├── middleware/             # Express middleware
│           │   ├── auth.middleware.ts
│           │   ├── validate.middleware.ts
│           │   ├── errorHandler.middleware.ts
│           │   └── rateLimiter.middleware.ts
│           │
│           ├── migrations/
│           │   └── 1700000000000-InitialMigration.ts
│           │
│           └── seeds/
│               ├── UserSeeder.ts
│               └── run-seeds.ts
│
├── scripts/                            # ✅ Tooling scripts (organized)
│   ├── add-board-lines.cjs
│   └── refactor.cjs
│
├── .env.example                        # Root-level env template
├── .gitignore
├── .prettierrc                         # Shared formatting
├── .eslintrc.js                        # Root ESLint config
├── package.json                        # ✅ Workspace root (pnpm/npm workspaces)
├── pnpm-workspace.yaml                 # Or npm workspaces in package.json
├── turbo.json                          # Turborepo config (optional)
├── tsconfig.base.json                  # Shared TS config
└── README.md
```

---

## Detailed File Mapping

### Where Each Current File Moves

| Current Location | → New Location | Notes |
|---|---|---|
| `src/components/screens/HomeScreen.tsx` | `src/features/home/pages/HomePage.tsx` | Page = feature-owned |
| `src/components/screens/GradeScreen.tsx` | `src/features/home/pages/GradeSelectionPage.tsx` | Part of home feature |
| `src/components/screens/ChapterScreen.tsx` | `src/features/chapters/pages/ChapterListPage.tsx` | Feature module |
| `src/components/screens/ChapterIntroScreen.tsx` | `src/features/chapters/pages/ChapterIntroPage.tsx` | Feature module |
| `src/components/screens/LevelGridScreen.tsx` | `src/features/chapters/pages/LevelGridPage.tsx` | Feature module |
| `src/components/screens/LearnScreen.tsx` | `src/features/learn/pages/LearnPage.tsx` | Feature module |
| `src/components/screens/LeaderboardScreen.tsx` | `src/features/leaderboard/pages/LeaderboardPage.tsx` | Feature module |
| `src/components/auth/*.tsx` | `src/features/auth/pages/*.tsx` | Auth feature |
| `src/components/Header.tsx` | `src/components/layout/Header/Header.tsx` | Layout component |
| `src/components/LanguageSwitcher.tsx` | `src/components/common/LanguageSwitcher/` | Common component |
| `src/components/GameContainer.tsx` | `src/features/game/components/GameContainer.tsx` | Game feature |
| `src/components/ResultScreen.tsx` | `src/features/game/components/ResultScreen.tsx` | Game feature |
| `src/components/ConceptBook.tsx` | `src/features/game/components/ConceptBook.tsx` | Game feature |
| `src/components/concept-panel/*` | `src/features/learn/components/*` | Learn feature |
| `src/components/learn/*` | `src/features/learn/components/*` | Learn feature |
| `src/game/*` | `src/features/game/engine/*` + `scenes/*` | Game feature |
| `src/store/*.ts` | `src/store/*.store.ts` | Renamed for clarity |
| `src/i18n/` | `src/app/i18n.ts` + `public/locales/` | Config in app, data in public |
| `server/src/routes/auth.ts` | `server/src/modules/auth/auth.routes.ts` | Modular |
| `server/src/validations/*` | `packages/shared/src/validations/*` | Shared! |
| `add_board_lines.cjs` | `scripts/add-board-lines.cjs` | Organized |
| `refactor.cjs` | `scripts/refactor.cjs` | Organized |
| `IDEAS.md` | `docs/roadmap/ideas.md` | Documentation |
| `PRODUCT_ANALYSIS.md` | `docs/business/product-analysis.md` | Documentation |

---

## Code Reusability Strategy

### 1. 🏗️ Base Scene Class (Biggest Win)

Your scene files have massive duplication. Extract a `BaseScene` with shared logic:

```typescript
// src/features/game/scenes/base/BaseScene.ts
export abstract class BaseScene extends Phaser.Scene {
  // ✅ Shared across ALL 11 scenes
  protected score: number = 0;
  protected currentQuestion: number = 0;
  protected totalQuestions: number;
  protected timer: Phaser.Time.TimerEvent;

  // Common UI creation
  protected createScoreDisplay(): void { /* ... */ }
  protected createQuestionText(text: string): void { /* ... */ }
  protected createProgressBar(): void { /* ... */ }
  protected showFeedback(correct: boolean): void { /* ... */ }
  protected handleAnswer(isCorrect: boolean): void { /* ... */ }
  protected completeLevel(): void { /* ... */ }

  // Abstract methods each scene implements
  abstract setupVisuals(): void;
  abstract loadQuestion(index: number): void;
}
```

**Impact**: Could reduce each scene file by **40-60%** (estimated ~150KB total savings).

---

### 2. 🔌 Centralized API Client

```typescript
// src/services/api.client.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

// Auto-attach token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
```

**Impact**: Remove duplicate `axios` imports & `Authorization` header logic from every store.

---

### 3. 📦 Shared Validation Schemas

```typescript
// packages/shared/src/validations/auth.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2),
  grade: z.number().int().min(1).max(12),
});

// Used by BOTH client & server — single source of truth!
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

**Impact**: Eliminate validation drift between client & server.

---

### 4. 🎯 Reusable Feature Hooks

```typescript
// src/features/auth/hooks/useAuth.ts
export function useAuth() {
  const { token, user, setToken, logout } = useAuthStore();
  const navigate = useNavigate();

  const login = async (credentials: LoginInput) => {
    const { data } = await authService.login(credentials);
    setToken(data.token);
    navigate('/home');
  };

  const isAuthenticated = !!token;

  return { login, logout, user, isAuthenticated };
}
```

**Impact**: Auth logic reusable across any component without directly touching stores.

---

### 5. 🧩 UI Component Library

```
components/ui/
├── Button/
│   ├── Button.tsx          # Component
│   ├── Button.test.tsx     # Unit test
│   └── index.ts            # Barrel export
```

Each UI component should be:
- **Self-contained**: Own styles, own tests
- **Variant-driven**: Use props like `variant="primary"`, `size="lg"`
- **Composable**: Small primitives that combine into complex UI

---

### 6. 📊 Level ID Utilities (Shared Package)

```typescript
// packages/shared/src/utils/levelId.utils.ts
export const CHAPTER_PREFIXES = {
  surfaceAreaVolume: 'lvl',
  coordinateGeometry: 'lvl-cg',
  trigonometry: 'lvl-trig',
  applicationsTrig: 'lvl-apptrig',
  arithmeticProgression: 'lvl-ap',
  probability: 'lvl-prob',
  triangles: 'lvl-tri',
  circles: 'lvl-circle',
} as const;

export function generateLevelIds(
  prefix: string,
  count: number = 30
): string[] {
  return Array.from({ length: count }, (_, i) =>
    `${prefix}-${(i + 1).toString().padStart(2, '0')}`
  );
}

export function generateAllLevelIds(): string[] {
  return Object.values(CHAPTER_PREFIXES).flatMap(
    (prefix) => generateLevelIds(prefix)
  );
}
```

**Impact**: Replace the 20-line `generateAllLevels()` in `gameStore.ts` and make it available to both client & server.

---

## Shared Package (`packages/shared`)

### Why a Shared Package?

| What | Client uses it for | Server uses it for |
|------|------|------|
| `auth.schema.ts` | Form validation | Request validation middleware |
| `game.types.ts` | Store typings, scene typings | Progress API response types |
| `levelId.utils.ts` | Generating unlock lists | Validating progress syncs |
| `routes.ts` | API client URLs | Route registration |
| `constants/chapters.ts` | Chapter display data | Seed scripts |

### Setup (npm workspaces)

```jsonc
// Root package.json
{
  "name": "ganitquest",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  }
}
```

---

## Migration Checklist

> Recommended order to restructure without breaking the app:

### Phase 1: Foundation (Non-Breaking)
- [ ] Create `packages/shared/` with types, constants, and validations
- [ ] Set up npm/pnpm workspaces
- [ ] Move root scripts to `scripts/`
- [ ] Reorganize `docs/` into subfolders
- [ ] Remove backend deps (`mysql2`, `typeorm`) from frontend `package.json`
- [ ] Add `.prettierrc`, `.editorconfig`

### Phase 2: Frontend Restructure
- [ ] Create `src/components/ui/`, `src/components/layout/`, `src/components/common/`
- [ ] Extract `ProtectedRoute` from `App.tsx` → `src/components/common/ProtectedRoute/`
- [ ] Create `src/app/routes.tsx` and centralize route config
- [ ] Create `src/services/api.client.ts`
- [ ] Create `src/features/` directory with all feature modules
- [ ] Move screens from `components/screens/` → `features/*/pages/`
- [ ] Move feature-specific components into their feature folders
- [ ] Add barrel exports (`index.ts`) to every feature

### Phase 3: Game Engine Refactor (Biggest Impact)
- [ ] Create `BaseScene` abstract class
- [ ] Extract `QuestionMixin`, `UIMixin`, `ScoreMixin`
- [ ] Refactor `LevelScene.ts` (61KB) — break into composition
- [ ] Refactor `CircleScene.ts` (56KB) — extract drawing utilities
- [ ] Populate `mechanics/shared/` with reusable mechanics
- [ ] Add scene unit tests using Phaser test utilities

### Phase 4: Backend Modularization
- [ ] Restructure `server/src/routes/` → `server/src/modules/`
- [ ] Add `controller + service` pattern per module
- [ ] Import validations from `@ganitquest/shared`
- [ ] Create `config/` folder (env, database, swagger)
- [ ] Separate `app.ts` from `index.ts` for testability

### Phase 5: Quality & DX
- [ ] Add Vitest/Jest configuration
- [ ] Add Husky + lint-staged for pre-commit hooks
- [ ] Set up path aliases (`@/`, `@shared/`)
- [ ] Add CI pipeline for `lint → test → build`
- [ ] Add `deploy.yml` workflow

---

> **Bottom Line**: The biggest ROI comes from **Phase 3** (BaseScene extraction) and **Phase 1** (shared package). Together, they eliminate the most duplicated code and set up the foundation for everything else.
