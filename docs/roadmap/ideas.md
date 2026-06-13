# GanitQuest — Product Improvement Roadmap

> A strategic plan to scale this gamified math learning platform into an unbeatable product.

---

## Current Stack Snapshot

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 8, TailwindCSS 4, Framer Motion, Phaser 4 |
| State | Zustand |
| Auth | JWT + Google OAuth |
| Backend | Express, MySQL |
| Chapters | Surface Area & Volume, Coordinate Geometry, Trigonometry (90 levels) |

---

## 1. Content Engine — More Chapters, More Depth

**Goal:** Cover the full Class 10 CBSE/ICSE math syllabus, then expand to Class 9, 11, 12.

### New Chapters to Add
- **Algebra** — Linear equations, quadratics, polynomials (use Phaser to visualize graphs)
- **Statistics & Probability** — Bar charts, histograms, pie charts, mean/median/mode with interactive data manipulation
- **Circles** — Tangent/secant visualization, arc length, sector area with draggable arcs
- **Constructions** — Step-by-step geometric constructions with virtual compass/ruler tools
- **Real Numbers** — Number line visualization, HCF/LCM with factor trees
- **Arithmetic Progressions** — Animated sequence builders, sum visualizations

### Libraries
- **`mafs`** — React components for interactive math visualizations (graphs, coordinate planes, function plots). Lightweight alternative for 2D math that doesn't need full Phaser.
- **`mathjs`** — Expression parser & evaluator for dynamic formula validation.
- **`KaTeX`** or **`react-katex`** — Beautiful LaTeX math rendering for formulas in ConceptBook and hints.

---

## 2. Adaptive Difficulty & AI Tutor

**Goal:** Personalize difficulty per student. No two users should have the same experience.

### Features
- **Adaptive engine** — Track time-per-level, error rate, hint usage. Auto-adjust difficulty (e.g., skip easy levels, add bonus challenges).
- **AI Hint System** — Instead of static hints, generate contextual step-by-step guidance. Use OpenAI/Gemini API for natural language math explanations.
- **Mistake Pattern Analysis** — Detect common mistakes (e.g., always confusing sin/cos) and serve targeted practice levels.
- **Spaced Repetition** — Bring back previously failed concepts at optimal intervals.

### Libraries
- **`openai`** or **`@google/generative-ai`** — AI-powered hint generation and explanation.
- **`supermemo`** — Spaced repetition scheduling algorithm (SM-2).

---

## 3. Multiplayer & Social Competition

**Goal:** Make math social. Students learn better when competing with peers.

### Features
- **Live 1v1 Math Duels** — Two students solve the same level simultaneously. First correct answer wins bonus XP.
- **Classroom Leaderboards** — Teachers create class codes. Students compete within their class.
- **Weekly Tournaments** — Timed challenges with limited attempts, ranked globally.
- **Friend System** — Add friends, see their progress, challenge them.
- **Team Quests** — Groups of 3-4 solve a sequence of levels cooperatively.

### Libraries
- **`socket.io-client`** + **`socket.io`** (server) — Real-time WebSocket for live duels and multiplayer sync.
- **`@tanstack/react-query`** — Server state management for leaderboards, profiles, social feeds.
- **`pusher-js`** — Alternative managed real-time service (simpler than self-hosted WebSocket).

---

## 4. Gamification 2.0 — Beyond Stars & XP

**Goal:** Create addictive progression loops that keep students coming back daily.

### Features
- **Daily Streak System** — Login streaks with escalating rewards (Day 1: 10 XP, Day 7: 100 XP + badge).
- **Achievement Badges** — "Speed Demon" (solve in <10s), "Perfect World" (all 3-star in a world), "Marathon" (30 levels in one session).
- **Avatar & Cosmetics Shop** — Spend earned coins on character skins, Phaser canvas themes, particle effects.
- **Season Pass / Battle Pass** — Monthly themed challenges with exclusive rewards.
- **Boss Battles** — End-of-chapter multi-step problems that combine all concepts from the chapter.
- **Power-ups** — "50/50" (eliminate wrong choices), "Time Freeze", "Double XP" — earned or purchased.

### Libraries
- **`canvas-confetti`** — Celebration effects on achievements (lightweight, no Phaser needed).
- **`react-hot-toast`** or **`sonner`** — Beautiful toast notifications for achievements, streaks, level-ups.
- **`@headlessui/react`** — Accessible modals/dialogs for shop, profile, settings.

---

## 5. Teacher & Parent Dashboard

**Goal:** B2B/B2C growth. Schools adopt the platform when teachers have visibility.

### Features
- **Teacher Dashboard** — Create classes, assign chapters, track per-student progress heatmaps.
- **Parent Reports** — Weekly email/PDF reports: "Your child solved 15 levels this week, struggles with trigonometry ratios."
- **Custom Assignments** — Teachers can create custom level sequences from the level pool.
- **Analytics** — Time spent per topic, accuracy trends, improvement velocity charts.

### Libraries
- **`recharts`** or **`@nivo/core`** — Beautiful, responsive charts for dashboards (accuracy trends, progress heatmaps).
- **`react-pdf`** or **`@react-pdf/renderer`** — Generate downloadable PDF progress reports.
- **`resend`** or **`nodemailer`** — Automated email reports to parents.

---

## 6. Mobile App (PWA → Native)

**Goal:** 70%+ of Indian students access content on mobile. Mobile-first is non-negotiable.

### Phased Approach
1. **Phase 1 (Now):** PWA with `vite-plugin-pwa` — installable from browser, offline support, push notifications.
2. **Phase 2:** React Native wrapper with **`capacitor`** or **`expo`** — native app stores.
3. **Phase 3:** Full React Native rewrite with **`expo-gl`** for Phaser rendering on native.

### Libraries
- **`vite-plugin-pwa`** + **`workbox`** — Service workers, offline caching, install prompt.
- **`@capacitorjs/core`** — Wrap existing web app into native iOS/Android shell.
- **`web-push`** — Push notifications for streaks, challenges, reminders.

---

## 7. Content Creation Platform (CMS)

**Goal:** Scale content without deploying code. Let educators create levels from a dashboard.

### Features
- **Level Builder UI** — Drag-and-drop interface to create levels: pick shape, set target value, write question, configure Phaser scene.
- **Question Bank** — Community-contributed questions with moderation.
- **Curriculum Mapping** — Tag levels to CBSE/ICSE/State board syllabus, chapter, and topic.
- **A/B Testing** — Test different question phrasings or hint styles, measure completion rates.

### Libraries
- **`@tiptap/react`** — Rich text editor for question/concept authoring.
- **`dnd-kit`** or **`@hello-pangea/dnd`** — Drag-and-drop UI for level builder.
- **`zod`** — Schema validation for level configs (type-safe level creation).

---

## 8. Performance & Infrastructure

**Goal:** Handle 100K+ concurrent users without breaking a sweat.

### Improvements
- **Database** — Migrate from raw MySQL queries to **Prisma ORM** with connection pooling.
- **Caching** — Redis for leaderboard rankings, session data, level configs.
- **CDN** — Serve Phaser assets, level JSON, images from Cloudflare/CloudFront.
- **Auth upgrade** — Replace custom JWT with **`better-auth`** or **`lucia`** — handles sessions, OAuth, magic links, 2FA.
- **State persistence** — Persist Zustand store to `localStorage` or backend with **`zustand/middleware`** persist.
- **Error tracking** — **`@sentry/react`** for crash reporting and performance monitoring.
- **Testing** — **`vitest`** + **`@testing-library/react`** + **`playwright`** for unit, component, and E2E tests.

### Libraries
- **`prisma`** — Type-safe ORM, migrations, database introspection.
- **`ioredis`** — Redis client for leaderboards and caching.
- **`better-auth`** — Modern auth library (sessions, OAuth, magic links, rate limiting).
- **`@sentry/react`** — Error monitoring and performance tracing.
- **`vitest`** — Fast unit testing aligned with Vite.
- **`playwright`** — Cross-browser E2E testing.

---

## 9. Monetization Strategy

### Models
- **Freemium** — First 2 worlds per chapter free. Unlock remaining worlds via subscription.
- **School Licensing** — Per-seat annual license for teacher dashboard + full content.
- **In-App Purchases** — Cosmetics, power-ups, bonus level packs (non-pay-to-win).
- **Sponsored Challenges** — EdTech brands sponsor weekly tournaments (brand visibility + prizes).

### Libraries
- **`razorpay`** — Indian payment gateway (UPI, cards, netbanking).
- **`stripe`** — International payments and subscription management.
- **`zustand/middleware`** persist — Track purchase state client-side.

---

## 10. Internationalization & Accessibility

**Goal:** Serve students across India and beyond.

### Features
- **Multi-language** — Hindi, Marathi, Tamil, Telugu, Bengali, + English. Concepts and questions translated.
- **Voice narration** — Read questions aloud for younger students or accessibility.
- **Keyboard navigation** — Full keyboard support for all game interactions.
- **Screen reader** — ARIA labels on all interactive elements.
- **Color blind modes** — Alternative color palettes for Phaser shapes.

### Libraries
- **`react-i18next`** + **`i18next`** — Industry-standard i18n with JSON translation files.
- **`@vime/react`** or Web Speech API — Text-to-speech for question narration.
- **`react-aria`** — Accessibility primitives from Adobe.

---

## Priority Matrix

| Priority | Feature | Impact | Effort |
|----------|---------|--------|--------|
| P0 | PWA + Offline | Very High | Low |
| P0 | State persistence (Zustand persist) | High | Very Low |
| P0 | KaTeX formula rendering | High | Low |
| P1 | More chapters (Algebra, Statistics) | Very High | Medium |
| P1 | Daily streaks + achievements | High | Medium |
| P1 | Teacher dashboard (basic) | Very High | Medium |
| P1 | Prisma ORM migration | High | Medium |
| P2 | AI hint system | Very High | Medium |
| P2 | Multiplayer duels | Very High | High |
| P2 | Razorpay integration | High | Medium |
| P2 | Leaderboards | High | Medium |
| P3 | Level builder CMS | High | High |
| P3 | React Native app | High | High |
| P3 | Multi-language support | Medium | High |
| P3 | Voice narration | Medium | Medium |

---

## Quick Wins (Implement This Week)

1. **`zustand/middleware` persist** — 0 new deps, just add `persist()` wrapper to stores. Progress survives page refresh.
2. **`react-katex`** — Render formulas beautifully in ConceptBook instead of plain text.
3. **`canvas-confetti`** — Burst confetti on level completion (2 lines of code).
4. **`sonner`** — Toast notifications for XP earned, streak updates, achievements.
5. **`vite-plugin-pwa`** — Make the app installable on mobile with offline support.

---

## Competitive Moat Summary

| What makes this unbeatable | Why competitors can't copy easily |
|---------------------------|----------------------------------|
| **Phaser-powered interactive visuals** | Most EdTech uses static images or videos. Real-time shape manipulation is rare. |
| **Curriculum-aligned gamification** | Not just games — mapped to CBSE/ICSE syllabus chapter-by-chapter. |
| **Adaptive difficulty** | AI-driven personalization creates unique paths per student. |
| **Teacher ecosystem** | B2B lock-in via teacher dashboards and school licensing. |
| **Multiplayer social** | Math becomes competitive and social — network effects. |
| **Offline PWA** | Works in low-connectivity areas (rural India). |
| **Content velocity** | Level builder lets educators scale content without engineers. |

---

---

## Frontend vs Backend — Responsibility Split

### FRONTEND (React + Phaser + Zustand)

> Everything the user **sees, touches, and interacts with** lives here.

#### Game & Visualization
- Phaser canvas rendering (shapes, grids, triangles, drag interactions)
- Scene management (LevelScene, CoordinateScene, TrigonometryScene)
- Real-time shape scaling/animation based on user input
- Touch/drag input handling for mobile
- HUD overlays (accuracy bar, live target/current values)
- Canvas resize handling for responsive mobile layout

#### UI & UX
- All screens (Home, Chapters, LevelGrid, GameContainer, ResultScreen)
- ConceptBook overlay with formula breakdowns and step-by-step guides
- ConceptPanel with input fields, hints, submit buttons
- Animations & transitions (Framer Motion)
- Toast notifications for achievements/streaks (sonner)
- Confetti celebrations (canvas-confetti)
- Responsive design (Tailwind breakpoints for mobile/tablet/desktop)
- Dark mode / theme switching
- Accessibility (ARIA labels, keyboard navigation, color blind modes)

#### Client-Side State (Zustand)
- Current level ID, input values, live calculated values
- UI state (modals open, concept book visible, result screen shown)
- Cached level data & specs (loaded from JSON)
- Temporary game session state (stars earned, XP gained this session)
- PWA install prompt state

#### Client-Side Validation
- Input format validation (is it a number? within range?)
- Live answer matching (compare user input vs `spec.correctAnswer` with tolerance)
- Formula calculation (`spec.calculateValue(input)`)
- Star rating calculation based on accuracy

#### Routing & Navigation
- React Router for all page transitions
- Protected route guards (check auth token)
- Deep linking to specific levels (`/chapter/:id/level/:id`)

#### Offline & PWA
- Service worker registration (vite-plugin-pwa)
- Offline level data caching
- Install prompt UI
- Background sync queue (submit scores when back online)

#### i18n
- Language detection and switching UI
- Translation string rendering (react-i18next)
- RTL layout support if needed

---

### BACKEND (Express + MySQL + Redis)

> Everything involving **data persistence, security, business logic, and multi-user coordination** lives here.

#### Authentication & Authorization
- User registration (email/password + hashing with bcrypt)
- Google OAuth token verification
- JWT token generation & refresh
- Password reset flow (token generation, email sending, token validation)
- Session management & token expiry
- Rate limiting on auth endpoints
- Role-based access (student, teacher, admin, parent)

#### User Progress & Data Persistence
- Save completed levels per user (level ID, stars earned, time taken, attempts)
- Save/load XP, total stars, current level, unlocked levels
- Track per-level analytics (time spent, error count, hints used)
- Streak tracking (daily login timestamps, streak count)
- Achievement/badge unlock records
- Sync Zustand state to backend on level completion

#### Level & Content Management
- Serve level data and specs via API (instead of bundled JSON for scalability)
- Level builder CMS backend (CRUD for levels, validation with Zod)
- Question bank storage and moderation queue
- Curriculum mapping metadata (board, class, chapter, topic tags)
- A/B test variant assignment and result tracking

#### Leaderboards & Rankings
- Global, chapter-level, and classroom leaderboards
- Redis sorted sets for real-time ranking
- Weekly/monthly leaderboard reset logic
- Anti-cheat validation (verify score server-side before recording)

#### Multiplayer & Real-time
- WebSocket server (socket.io) for live 1v1 duels
- Match-making queue (pair students of similar skill)
- Real-time game state sync during duels
- Tournament bracket management
- Team quest coordination

#### Teacher & Parent Dashboard
- Class creation and student enrollment (invite codes)
- Aggregate analytics per class (avg accuracy, completion rate, struggling topics)
- Per-student progress reports (API endpoints)
- PDF report generation (server-side rendering)
- Email report scheduling (cron jobs with nodemailer/resend)
- Assignment creation (select levels, set due dates)

#### AI & Adaptive Engine
- Store user interaction logs (inputs, timestamps, errors)
- Run adaptive difficulty algorithm (analyze patterns, adjust level recommendations)
- Proxy AI API calls (OpenAI/Gemini) for hint generation — **never expose API keys to frontend**
- Cache AI responses to avoid redundant API calls
- Spaced repetition scheduler (compute next review dates)

#### Payments & Subscriptions
- Razorpay/Stripe webhook handlers (payment verification)
- Subscription state management (plan type, expiry, renewal)
- Receipt generation
- Freemium gate logic (which levels are free vs premium)
- School license management (seat count, expiry)

#### Infrastructure & Security
- Input sanitization & SQL injection prevention (Prisma parameterized queries)
- CORS configuration
- API rate limiting (express-rate-limit)
- File upload handling (avatars, teacher materials)
- Error logging & monitoring (Sentry server-side)
- Database migrations (Prisma migrate)
- Redis cache invalidation
- CDN origin configuration for static assets
- Health check & uptime monitoring endpoints

#### Push Notifications
- Web push subscription storage
- Notification scheduling (streak reminders, tournament starts)
- Push payload construction and delivery (web-push library)

---

### The Golden Rule

| Category | Frontend | Backend |
|----------|----------|---------|
| **Rendering** | Always frontend | Never backend |
| **Input validation** | Quick client-side check | Authoritative server-side re-validation |
| **Answer checking** | Live visual feedback (HUD) | Final score recording (anti-cheat) |
| **User data** | Cached in Zustand for speed | Source of truth in MySQL |
| **API keys** | Never exposed | Always server-side |
| **Leaderboards** | Display only | Compute & store |
| **Payments** | Redirect to gateway UI | Verify webhook, update DB |
| **AI hints** | Display response | Proxy API call, cache result |
| **Real-time** | socket.io-client (connect) | socket.io server (orchestrate) |
| **Offline** | Service worker cache | Sync queue processing |
| **i18n strings** | Render translated text | Serve translation JSON files |
| **Analytics** | Fire events | Store, aggregate, report |

---

### Current Gaps to Fix

| What's wrong now | Where it should live | Fix |
|------------------|---------------------|-----|
| Stars/XP only in Zustand (lost on refresh) | Backend + Zustand persist | Save to DB on level complete, persist store locally |
| Answer validation only on frontend | Backend re-validates | POST `/api/levels/:id/submit` — server checks answer |
| Level data bundled as JSON in frontend | Backend serves via API | GET `/api/levels` + cache with react-query |
| No anti-cheat | Backend | Server calculates score, not client |
| Auth bypassed with guest token | Backend enforces | Remove guest bypass, require real auth |
| No progress sync | Backend | POST `/api/progress` after each level |

---

---

## Phaser.js Visual Engine — Current State & Improvement Roadmap

> Phaser is your **unfair advantage**. Most EdTech apps show static images or pre-recorded videos. You render math **live, interactive, and responsive**.

### What We Currently Render Through Phaser

#### 1. LevelScene — Surface Area & Volume
**Shapes drawn:** Cube, Cuboid, Cylinder, Cone, Sphere, Hemisphere, Frustum
- **Static wireframe** outlines with `Graphics.strokeRect()`, `strokeTriangle()`, `strokeCircle()`
- **Dynamic scaling** via `shapeScale` tween (0.4 to 1.6) based on user input
- **Color feedback** — blue → green when correct, red when too large
- **Dimension labels** — width, height, radius text overlays with `Graphics.lineBetween()` arrows
- **What it does well:** Students see the shape grow/shrink in real time as they type values
- **What's missing:** No 3D perspective, no surface area overlay (only volume scaling), no cross-section slicing animation

#### 2. CoordinateScene — Coordinate Geometry
**Interactive elements:** Cartesian grid, draggable points, projection lines
- **Cartesian grid** — X/Y axes with numbered tick marks (spacing = min(width, height) / 24)
- **Draggable points** — Amber circles with halos that snap to grid coordinates
- **Projection lines** — Dashed lines from point to X and Y axes
- **Laser connections** — Green glowing lines between connected points (distance, midpoint, section)
- **What it does well:** Students drag a point and see live coordinate updates
- **What's missing:** No animated construction steps (e.g., "first plot X, then Y"), no distance formula visual derivation, no area-under-curve shading

#### 3. TrigonometryScene — 5 Visual Modes
**Mode 1: Angle Foundations** — Protractor-like arc with draggable angle beam (0-90 degrees)
- Reference arc, target angle dashed line, sweeping sector fill, neon laser beam
- Magnetic snapping to benchmark angles (0, 30, 45, 60, 90)

**Mode 2: Trigonometric Ratios** — Right triangle with draggable top vertex
- Adjacent/opposite/hypotenuse side highlighting with neon colors
- Right-angle square marker, theta arc, side length labels

**Mode 3: Identity Lab** — Unit circle with sine/cosine projections
- Unit circle grid, radial vector line, vertical (sin) and horizontal (cos) projections
- Live `sin²θ + cos²θ = 1` calculation display

**Mode 4: Complementary Angles** — Dual-angle mirror visualization
- Primary angle beam + complementary mirror beam (90° - θ)
- Bridge connector between both peaks

**Mode 5: Heights & Distances** — Real-world triangle scenarios
- Mountain silhouette or tower silhouette backgrounds
- Angle of elevation arc, ground range, height dashed markers

**What's missing across all modes:** No sound effects on snap, no step-by-step animated proof derivations, no comparison mode (old vs new angle side-by-side)

---

### Big Vision: From "Hints" to "Animated Explanations"

> Right now, the **ConceptBook** gives text-based hints. The Phaser canvas shows the "answer state."
>
> The leap: **Use Phaser to animate the *learning process*, not just the final answer.**

#### What This Means

Instead of:
```
Hint: "Use the formula V = (4/3)πr³ for a sphere."
```

We do this in Phaser:
1. **Show a 2D circle** being revolved 360° around its diameter → morphs into a 3D sphere wireframe
2. **Draw radius `r`** and highlight it
3. **Animate the formula components** — show `r³` as a cube, then `(4/3)` as 1.33 cubes, then multiply by `π`
4. **Volume fill animation** — liquid fills the sphere from bottom to top at the calculated volume rate
5. **Cross-section sweep** — slice the sphere horizontally to show why the formula works

#### Animated Explanation Examples by Chapter

| Topic | Current (Static Hint) | Future (Phaser Animated Explanation) |
|-------|------------------------|-------------------------------------|
| **Sphere Volume** | "Use V = (4/3)πr³" | Revolve a semicircle → sphere morph. Show radius cubed. Multiply by 4/3 and π visually. |
| **Distance Formula** | "d = √((x₂−x₁)² + (y₂−y₁)²)" | Draw two points. Animate right triangle construction. Pythagoras proof → distance formula derivation. |
| **sin(90°−θ) = cosθ** | "Complementary angles identity" | Draw θ and (90°−θ) on unit circle. Show projection swap animation. Prove visually. |
| **Midpoint Formula** | "M = ((x₁+x₂)/2, (y₁+y₂)/2)" | Animate point A sliding halfway to B. Show X and Y coordinates averaging separately. |
| **Surface Area of Cylinder** | "SA = 2πr² + 2πrh" | Unroll cylinder → rectangle. Show two circles + rectangle area sum. |
| **Cone Volume = (1/3) Cylinder** | "V = (1/3)πr²h" | Fill cone, pour into cylinder. Repeat 3 times. Visual proof. |
| **Trigonometric Ratios** | "sin = opposite/hypotenuse" | Interactive triangle. Drag angle → watch opposite/hypotenuse ratio change live on a graph. |
| **Section Formula (Internal)** | "P divides AB in ratio m:n" | Animate point P sliding along AB. Show AP/PB = m/n dynamically. |

---

### Phaser Improvement Roadmap

#### Immediate Fixes (This Sprint)
- **Sound design** — Snap sounds on angle snapping, success chime on correct answer, error buzz on wrong
- **Particle effects** — Sparkles on star earning, smoke on wrong answer, glow pulse on perfect match
- **Smooth camera transitions** — Pan/zoom to focus area when level loads
- **Loading state** — Animated "Constructing your level..." instead of blank canvas

#### Short Term (Next 2 Sprints)
- **3D perspective shapes** — Use `Graphics` with faux 3D (isometric projection) for cube/cuboid/cylinder
- **Surface area mode toggle** — Button to switch between "Volume view" and "Surface Area view" (show net unfold)
- **Step-by-step animation player** — Play/Pause/Rewind buttons for animated derivations
- **Comparison mode** — Split screen: "Your answer" vs "Correct answer" side-by-side with animated transition
- **Color blind accessibility** — Pattern fills (stripes, dots) + color for shape differentiation

#### Medium Term (Next Quarter)
- **Animated Concept Explanations** — Dedicated "Learn" button in each level that plays a 20-30 second Phaser animation explaining the concept before the student attempts the level
- **Interactive proof builder** — Students drag-and-drop steps to build a geometric proof, Phaser validates each step visually
- **History scrubber** — Timeline showing all previous student attempts on the same canvas with ghost overlays
- **Multi-shape comparison** — "Which has more volume: sphere of radius 3 or cylinder of radius 2 height 5?" — Both shapes animate simultaneously

#### Long Term (Ambitious)
- **3D Phaser** — Integrate `Phaser 3D` or `Three.js` overlay for true 3D shape manipulation (rotate cube with touch)
- **AI-generated visuals** — Given a new math problem, auto-generate the Phaser scene layout (e.g., "Draw a ladder against a wall at 60°" → auto-render triangle + ladder + angle arc)
- **Student-created scenes** — Sandbox mode where students build their own visualizations and share with class

---

### Why This Is Unbeatable

| Competitor Approach | Your Phaser Approach |
|--------------------|---------------------|
| Static textbook diagrams | Live, interactive, manipulable shapes |
| Pre-recorded 5-minute video explanations | 20-second focused animated derivation, skippable, replayable |
| "Read the formula, now solve" | "Watch the formula come alive, now you understand why, now solve" |
| One-size-fits-all explanation | Adaptive — show derivation if student fails twice, skip if they succeed |
| Passive consumption | Active manipulation — drag, rotate, scale, slice |

> **The thesis:** When a student *sees* the sphere form from a revolving circle, they don't memorize `V = (4/3)πr³` — they *understand* it.

---

*Last updated: May 2026*
