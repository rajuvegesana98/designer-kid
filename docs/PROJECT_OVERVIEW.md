# Designer Kid — Project Overview

Designer Kid is a single-page web application (React 19 + TypeScript, built with Vite) that teaches UI/UX design across three levels (Beginner, Intermediate, Expert). It also includes a Career Centre, design challenges, a blog, public reviews, a 1:1 booking link and an admin studio. In the studio the owner edits all site content as one JSON document and publishes it with a Draft → Preview → Publish workflow. The app has no server of its own. It is hosted as static files on GitHub Pages, and it talks directly from the browser to Supabase (Auth, Postgres with Row Level Security, Storage, RPC). When no Supabase keys are configured it uses a browser-only `localStorage` fallback. This document gives the name, purpose, status, full file tree, entry points, start-up flow, route table, languages, technology stack and build/deployment summary. The request and data flows are in [ARCHITECTURE.md](ARCHITECTURE.md).

> **Status legend** — **Confirmed**: seen in code/config. **Inferred**: reasoned from code (reason given). **Unknown**: cannot be verified from the repository (what to check is given). **Deprecated/unused**: code present but not reachable from the UI. **Planned**: not built.
> "Verified at hand-off" means the lead engineer confirmed the runtime fact on 30 Sep 2026 (see the audit brief).

**Last verified: 30 Sep 2026 (docs v2.0)**

---

## 1. Identity and purpose

| Item | Value | Status |
|---|---|---|
| Project name | `designer-kid` (`package.json` → `"name"`), product name "Designer Kid" | Confirmed |
| Tagline | "Learn. Design. Build. Grow." (`index.html` `<title>`, `src/content/seed/index.ts` → `brand.tagline`) | Confirmed |
| Package version | `0.0.0`, `"private": true`, `"type": "module"` (`package.json`) | Confirmed |
| Repository | github.com/rajuvegesana98/designer-kid, branch `main`, 6 commits (first commit 30 Sep 2026 14:00 +0530; latest `356c611` 30 Sep 2026 15:39 +0530) | Confirmed (`git log`) |
| Live site | https://rajuvegesana98.github.io/designer-kid/ (admin at `/designer-kid/admin`) | Confirmed (verified at hand-off) |
| Backend | Supabase project ref `zcxnlelzhkwbvittgcuj` (an older project `ywbiyutmrwmjnbllyzxd` is no longer used) | Confirmed (verified at hand-off) |

### Product purpose
- **For learners:** a free, open UI/UX curriculum. The starter content has 182 lessons in 6 courses and 3 levels, 21 challenges, 28 resources, 27 career guides, 12 blog posts and 15 achievements. Lessons contain interactive widgets, practice tasks and challenges. Lessons, modules, career guides and blog posts can be printed or saved as PDF. Progress tracking includes streaks, bookmarks, notes and achievements. (Counts: **Confirmed** by loading the built seed chunk and summing `levels[].courses[].modules[].lessons[]`. Per course: Beginner 58 + 21, Intermediate 40 + 22, Expert 23 + 18.)
- **For the owner (business):** one place to publish and maintain course content, a blog, offers/banners (promos) and a mentor profile with an external 1:1 booking link (Calendly/Cal.com/Topmate style, `SiteContent.mentor.bookingUrl`). It also collects moderated public reviews and shows anonymous activity analytics. **Confirmed** (`src/content/types.ts`, `src/admin/*`).
- **Product decisions (owner, verified at hand-off):**
  - Learners have **no accounts**. Their progress lives in `localStorage` key `dk.learner.guest`, and they can download and restore a backup.
  - All content is always open. `moduleLock()` in `src/lib/progress.ts` always returns `locked: false`.
  - 1:1 sessions use an external booking link. None is configured yet, so `MentorSection` shows "Booking opens soon" (`src/components/MentorLink.tsx:67`).
  - Only admins sign in.

## 2. Current status (docs v2.0, 30 Sep 2026)

| Area | Status |
|---|---|
| Code | Typecheck clean: `npx tsc --noEmit -p tsconfig.app.json` exited 0 on 30 Sep 2026. `npx oxlint` reports **0 errors and 71 warnings**: 45 `only-export-components`, 10 `set-state-in-effect`, 7 `refs`, 3 `purity`, 3 `preserve-manual-memoization`, 2 `static-components`, 1 `no-unused-expressions`. |
| Deployment | GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`. Recent runs succeeded (verified at hand-off). |
| Database | The base part of `supabase/schema.sql` has been run on the live project. `supabase/migrations/002_user_management.sql` and `003_open_learning.sql` have **not** been run (verified at hand-off). Result: anonymous review submissions are rejected by RLS, and admin suspend/admin-management actions fail until they are run. |
| Content | Published once (30 Sep 2026 09:15 UTC; 182 lessons, 27 career guides). The published document predates the `promos`, `blog` and `reviews` sections. The client fills them in from the seed (`withDefaults`, `src/state/content.tsx:25`). Verified at hand-off. |
| Tests | Playwright scripts in `tools/e2e/*.mjs`. At hand-off, 34 checks across `e2e.mjs`–`e2e4.mjs` passed and the live smoke tests passed (verified at hand-off). There is no unit-test framework in `package.json`. **Confirmed.** |
| Latest change | Password show/hide toggle (`PasswordInput`, `src/components/ui.tsx:375`). "Your admin account" section (change password + email reset link) in `src/admin/pages/Settings.tsx` (`AdminAccount`). Confirmed (commit `356c611`). |

---

## 3. Project tree

The tree lists every tracked file (`git ls-files`: 111 files) plus the untracked/generated items present on disk (`.env.local`, `node_modules/`, `dist/`). Line counts come from `wc -l`.

```text
designer-kid/
├── .env.example                 Template env file: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, (commented) BASE_PATH, MOTION_STUDIO_AGENT_PROVIDER
├── .env.local                   NOT committed (*.local in .gitignore). Real values for VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, MOTION_STUDIO_AGENT_PROVIDER
├── .gitignore                   Ignores node_modules, dist, dist-ssr, *.local, logs, editor folders
├── .oxlintrc.json               oxlint config: plugins react/typescript/oxc; rules-of-hooks = error, only-export-components = warn
├── .github/
│   └── workflows/
│       └── deploy.yml           CI/CD: on push to main (or manual) → npm ci → npm run build (BASE_PATH + VITE_* vars) → upload dist → deploy to GitHub Pages
├── AGENTS.md                    Guide for AI agents/developers: product rules, stack, commands, "how to change things safely", gotchas
├── CLAUDE.md                    Pointer to AGENTS.md and docs/README.md
├── README.md                    Quick start, links to docs, short project layout
├── index.html                   HTML entry: meta tags, Google Fonts, inline pre-paint colour-mode script (localStorage dk.colorMode), <div id="root">, loads /src/main.tsx
├── package.json                 Scripts (dev/build/lint/preview) and dependencies
├── package-lock.json            npm lockfile (lockfileVersion 3); pins the installed versions listed in §8
├── tsconfig.json                Solution file: references tsconfig.app.json and tsconfig.node.json
├── tsconfig.app.json            TS config for src/ (ES2023, DOM, bundler resolution, noEmit, react-jsx, strict unused checks)
├── tsconfig.node.json           TS config for vite.config.ts (Node types, nodenext)
├── vite.config.ts               Vite config: base = $BASE_PATH or "/", React plugin, Motion Studio plugin only in `serve` (dev) unless MOTION_STUDIO=off, excluded from /admin
├── public/
│   └── favicon.svg              Default favicon (copied as-is to dist/)
├── scripts/
│   └── postbuild.mjs            After vite build: fail if Motion Studio code is found in dist; copy dist/index.html → dist/404.html (SPA deep links on Pages)
├── supabase/
│   ├── schema.sql               Full idempotent schema: tables admins, profiles, site_content, content_history, events, submissions, reviews; functions is_admin, handle_new_user, publish_content, review_defaults, protect_profile; RLS policies; storage bucket "media"; includes 002 + 003 at the end
│   └── migrations/
│       ├── 002_user_management.sql   profiles.blocked column, admin update policy, protect_profile trigger, admins-table policies, suspended users can't post
│       └── 003_open_learning.sql     "reviews: anyone submits" policy (anonymous reviews); adds Blog item to published/draft navigation
├── tools/
│   └── e2e/                     Browser tests (Playwright via playwright-core; not part of the app build)
│       ├── .gitignore           Ignores screenshots (shots*/), node_modules, PDFs, sample files
│       ├── package.json         Separate package "designer-kid-e2e" with playwright-core ^1.55.0
│       ├── e2e.mjs              Learner + admin journey suite against a local dev server (BASE default http://localhost:5181)
│       ├── e2e2.mjs             Second browser suite (more flows)
│       ├── e2e3.mjs             Third browser suite
│       ├── e2e4.mjs             Fourth browser suite
│       ├── live.mjs             Smoke test against the live GitHub Pages site
│       └── live2.mjs            Second live smoke test
├── docs/                        Documentation (this file, ARCHITECTURE.md, and earlier docs listed in docs/README.md)
│   ├── README.md                Documentation index
│   ├── ORIGINAL_BRIEF.md        Original requirements and follow-up requests
│   ├── SESSION_HISTORY.md       Build history in order
│   ├── FEATURES.md              Feature list for learners and admins
│   ├── ADMIN_GUIDE.md           Owner's guide to editing/publishing
│   ├── OPERATIONS.md            Hosting, Supabase, keys, migrations, costs
│   ├── TESTING.md               Typecheck, build, browser tests
│   └── NEXT_STEPS.md            Open items and ideas
├── dist/                        NOT committed. Last local build output: index.html, 404.html, favicon.svg, assets/ (index-*.js ≈ 861 KB, seed-*.js ≈ 736 KB, AdminApp-*.js ≈ 184 KB, index-*.css ≈ 45 KB)
├── node_modules/                NOT committed. Installed dependencies
└── src/
    ├── main.tsx                 React entry: createRoot(#root) → <StrictMode><App/>; imports styles/global.css
    ├── App.tsx                  BrowserRouter (basename from BASE_URL), provider stack, RecoveryRedirect, PromoLayer, all learner routes, lazy /admin/* route
    ├── styles/
    │   └── global.css           Whole design system (1,118 lines): CSS variables (:root light, [data-mode=dark]), layout, components, reduced-motion and @media print rules
    ├── content/
    │   ├── types.ts             Content model: SiteContent and Level/Course/Module/Lesson, Block union (15 block types), Challenge, Resource, CareerGuide, Announcement, Achievement, Theme, NavItem, Promo, BlogPost, WidgetName, IllustrationName
    │   └── seed/                Bundled starter content (loaded lazily as its own chunk)
    │       ├── index.ts         Assembles seedContent: brand, theme, home, navigation (8 items), footer, mentor, reviews settings, notifications settings, 3 levels, library items, 1 announcement, 1 promo, blog
    │       ├── beginnerFoundations.ts  Course b-foundations "UI/UX Foundations" — 4 modules, 58 lessons
    │       ├── beginnerLaunch.ts       Course b-launch "Build & Launch" — 3 modules, 21 lessons
    │       ├── intermediateCraft.ts    Course i-product-craft "Product Design Craft" — 5 modules, 40 lessons
    │       ├── intermediatePractice.ts Course i-practice-career "Practice, Portfolio & Career" — 3 modules, 22 lessons
    │       ├── expert.ts               Courses e-strategy-systems "Strategy & Systems" (3 modules, 23 lessons) and e-leadership-growth "Leadership & Career Growth" (2 modules, 18 lessons)
    │       ├── library.ts              21 challenges, 28 resources, 18 career guides, 15 achievements
    │       ├── careerProfiles.ts       6 career guides: LinkedIn do's/don'ts and resume-building, per level
    │       ├── careerInterviews.ts     3 career guides: interview question banks, one per level
    │       ├── blog.ts                 5 blog posts (blogPosts)
    │       └── blogDesign.ts           7 blog posts (designPosts)
    ├── data/                    Data-access layer (the only code that talks to storage/backend)
    │   ├── types.ts             DataStore interface + LearnerState, AppUser, LearnerRow, ContentVersion, EventType, ActivityEvent, Submission, MediaItem, Review types
    │   ├── index.ts             Picks the store: Supabase if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set, else localStore; exports `store`
    │   ├── supabaseStore.ts     DataStore over @supabase/supabase-js (Auth implicit flow, tables, RPC is_admin/publish_content, Storage bucket "media")
    │   └── localStore.ts        Browser-only DataStore: everything in localStorage (dk.* keys), demo admin, 5 versions max, 1.5 MB media limit
    ├── state/                   React context providers
    │   ├── content.tsx          ContentProvider: loads published / preview / seed content, withDefaults backfill, studentView filter, live preview via storage events
    │   ├── auth.tsx             AuthProvider: current user, sign in/out, password reset/recovery state, suspended-account handling, demo admin (local mode)
    │   ├── learner.tsx          LearnerProvider: learner progress in localStorage (dk.learner.guest), remote sync only when signed in, analytics events
    │   └── ui.tsx               ThemeProvider (applies theme CSS variables, colour mode, MotionConfig reducedMotion="user") and ToastProvider/useToast
    ├── lib/                     Pure helpers
    │   ├── content.ts           studentView(), level/lesson/module lookups, inScope, guidesFor, CAREER_SECTIONS
    │   ├── progress.ts          emptyLearner, progress %, moduleLock (never locks), nextLesson, streak/longestStreak, achievements, mergeLearner
    │   ├── theme.ts             FONT_OPTIONS, contrast maths, themeVars() → CSS variables, ensureFonts() (loads Google Fonts on demand)
    │   ├── covers.ts            coverFor(): picks a cover illustration from a lesson's title/module
    │   ├── markdown.tsx         Tiny safe markdown subset (**bold**, *italic*, `code`, [link](url), paragraphs) → React nodes; plain()
    │   └── icons.tsx            Curated lucide-react icon map (ICONS, ICON_NAMES) and <Icon name>
    ├── components/              Shared learner-facing UI
    │   ├── AppShell.tsx         Learner layout: sidebar/topbar nav from content.navigation, mobile nav, search (⌘/Ctrl+K and "/"), preview/demo banners, notifications, footer
    │   ├── Blocks.tsx           Renders lesson blocks (BlockView/Blocks), FileCard, PrintMode context
    │   ├── BookmarkButton.tsx   Toggle bookmark for lesson/challenge/resource/guide
    │   ├── Brand.tsx            BrandMark (uploaded logo or default "DK" mark) and Brand link
    │   ├── Illustrations.tsx    Level illustrations and HeroVisual (not the same file as illustrationLibrary.tsx)
    │   ├── illustrationLibrary.tsx  28 named topic illustrations (inline SVG) + labels, <Illustration name>
    │   ├── LevelSwitcher.tsx    Modal to switch the learner's level
    │   ├── MentorLink.tsx       useMentor, MentorLink (opens booking URL, tracks booking_clicked), MentorSection ("Booking opens soon" fallback)
    │   ├── Notifications.tsx    Client-side notifications (announcements, new lessons/challenges, course completion) + bell popover
    │   ├── Promo.tsx            Offers/banners: promoIsActive, PromoBar, PromoCard, PromoLayer (bar or pop-up, dismiss in localStorage)
    │   ├── Search.tsx           buildIndex/searchIndex (client-side full-text over content), SearchPalette modal, LevelFilter, ResultRow
    │   ├── ui.tsx               UI kit: ProgressBar/Ring, Modal, Sheet, ConfirmDialog, Tabs, EmptyState, Switch, Reveal, PageHeader, Spinner, FullPageLoader, PasswordInput, formatters
    │   └── widgets.tsx          7 interactive lesson widgets (contrast checker, spacing scale, type scale, visual hierarchy, auto layout, grid playground, button states)
    ├── pages/                   Learner pages (routes in §5)
    │   ├── Landing.tsx          Marketing landing page (hero, features, levels, mentor, reviews, blog, FAQ)
    │   ├── Onboarding.tsx       "Where are you in your design journey?" — choose level and name, then go to /
    │   ├── Dashboard.tsx        Home (Landing if no level, else AppShell + Dashboard: next lesson, progress, streak, achievements, career, mentor, latest posts)
    │   ├── Learn.tsx            LearnIndex (learning paths), LevelRoadmap, ModulePage (with module PDF link)
    │   ├── Lesson.tsx           Lesson page: Learn / Example / Practice / Challenge sections, notes panel, complete/uncomplete, PDF link
    │   ├── Challenges.tsx       ChallengesPage (filters) and ChallengePage (checklist, link + notes, submit)
    │   ├── Career.tsx           CareerCentre and CareerSectionPage (guides, checklists, builders, PDF links)
    │   ├── Resources.tsx        Filterable resource list
    │   ├── Progress.tsx         My Progress: stats, achievements, bookmarks, notes
    │   ├── Blog.tsx             BlogIndex, BlogPostPage, BlogCard, LatestPosts, sortPosts
    │   ├── Reviews.tsx          ReviewsPage, ReviewsSection, review form (submitReview), Stars, ReviewCard
    │   ├── Account.tsx          ProfilePage (name, level, colour mode, progress backup/restore, reset), AccountPage (admin sign-in/forgot password), ResetPasswordPage, SearchPage, NotFound, PasswordFields
    │   └── Print.tsx            Printable views (PrintLesson/Module/Guide/Blog) inside PrintMode; auto-opens the print dialog
    └── admin/                   Admin studio (separate lazy-loaded chunk)
        ├── AdminApp.tsx         Admin gate (login / not-admin / studio), admin routes, sidebar nav, PublishBar (status, preview, publish modal, discard)
        ├── state.tsx            AdminProvider: draft load, autosave (1.2 s), live preview write (250 ms), publish, discard, versions; tree helpers (lvl/course/mod/lesson, newId, slugify, moveItem); SECTION_LABELS/diffSections
        ├── fields.tsx           Debounced form fields (Text/TextArea/Number/Select/Color/Toggle/Lines), MediaPicker, ImageField, SortableList, FormSection
        ├── BlocksEditor.tsx     Block list editor: emptyBlock, BlockForm per block type, add/reorder/remove
        ├── SlideEditor.tsx      PowerPoint-style editor for lessons, guides and blog posts: slide rail, in-place editing on the real rendering, format panel, undo history
        ├── IllustrationPicker.tsx  Visual gallery for choosing an illustration
        ├── uploads.tsx          useDocUpload / DocUploadButton: PDF/PPT/Keynote/Word uploads (≤ 50 MB) to the "documents" media folder
        └── pages/
            ├── Dashboard.tsx    AdminDashboard (to-dos, stats) and AnalyticsPage; useAnalytics loads learners, 1000 events, submissions
            ├── Courses.tsx      Course/module/lesson tree editor with SlideEditor; newLesson()
            ├── Challenges.tsx   Challenge editor
            ├── Blog.tsx         Blog post editor
            ├── Library.tsx      Content library tabs: Resources, Career guides, Announcements & notification settings
            ├── Levels.tsx       Level identity, roadmap, enabled/sequential
            ├── Media.tsx        Media library: folders, upload (with optimise()), replace, delete, usage check
            ├── Users.tsx        Learners list/CSV export, submissions, edit name/level, reset progress, suspend, grant/remove admin, send reset email
            ├── Connect.tsx      1:1 Connect: booking link, mentor profile, booking-click activity
            ├── Reviews.tsx      Review moderation (approve/hide/feature/reply/delete) and reviews settings
            ├── Offers.tsx       Offers & banners (promos) editor; newPromo()
            ├── Website.tsx      Homepage hero/features/stats/testimonials/FAQ, navigation, footer; generic Repeater
            ├── Theme.tsx        Brand (name, logo, favicon), quick theme presets, light/dark colours, fonts, contrast checks
            └── Settings.tsx     PublishingPage (draft status, version history + restore, JSON backup/import) and SettingsPage (Your admin account, data connection, content summary)
```

**Note (Confirmed):** macOS file systems are case-insensitive. `src/components/Illustrations.tsx` and `src/components/illustrationLibrary.tsx` are different files. Never create `illustrations.tsx` (AGENTS.md warns about this too).

---

## 4. Entry points and application start-up

### 4.1 Entry chain (Confirmed)

```text
index.html
  ├─ inline <script>: reads localStorage "dk.colorMode", sets <html data-mode> and a few dark CSS vars before first paint
  ├─ Google Fonts stylesheet (Bricolage Grotesque, Instrument Sans)
  └─ <script type="module" src="/src/main.tsx">
        src/main.tsx
          ├─ import './styles/global.css'
          └─ createRoot(#root).render(<StrictMode><App/></StrictMode>)
                src/App.tsx → default export App
```

### 4.2 Provider stack and start-up flow (`src/App.tsx`)

```text
<BrowserRouter basename = import.meta.env.BASE_URL without trailing "/">      ("/designer-kid" on Pages, "" locally)
  <ContentProvider fallback={<FullPageLoader/>}>                              src/state/content.tsx
     1. isPreview = URL has ?preview
     2. if preview:  raw = withDefaults(localStorage["dk.preview.content"] ?? store.loadPublished()) ?? loadSeed()
        else:        raw = withDefaults(store.loadPublished()) ?? loadSeed()
        on any error: console.error, raw = loadSeed()          (bundled content instead of a blank page)
     3. provides { content: studentView(raw), raw, isPreview, reload }
     4. preview only: listens for "storage" events on dk.preview.content → live updates
    <Themed>
      <ThemeProvider content>             src/state/ui.tsx: colour mode (dk.colorMode | theme.mode | system), writes themeVars() CSS vars
                                          to <html>, ensureFonts(), document.title + favicon from brand, <MotionConfig reducedMotion="user">
        <ToastProvider>                   toast stack (max 3; 3.8 s, errors 7 s)
          <AuthProvider>                  src/state/auth.tsx: store.currentUser() + store.onAuthChange(); recovering / suspended flags
            <LearnerProvider>             src/state/learner.tsx: state from localStorage dk.learner.guest; syncs to profiles.state only if a user is signed in
              <RecoveryRedirect/>         if recovering and path ≠ /reset-password → <Navigate to="/reset-password">
              <PromoLayer/>               offer bar / pop-up (hidden on /admin, /print, /account)
              <Routes> … </Routes>        see §5
```

**Behaviour to know about (Confirmed):**
- Until content has loaded, only `FullPageLoader` renders. Everything below `ContentProvider` needs content.
- The seed (`src/content/seed/index.ts`) is loaded only through a dynamic `import('../content/seed')` (`loadSeed`). Vite emits it as a separate chunk (`dist/assets/seed-*.js`). It is fetched only when nothing is published, when a section is missing (backfill), when an error occurs, or when the admin needs it.
- `/admin/*` is `lazy(() => import('./admin/AdminApp'))` inside `<Suspense fallback={<FullPageLoader/>}>`, so learners never download the admin chunk.

---

## 5. Route table

### 5.1 Learner routes (`src/App.tsx`)

| Path | Component (file) | Layout | Purpose |
|---|---|---|---|
| `/welcome` | `Landing` (`pages/Landing.tsx`) | Standalone | Marketing landing page, always reachable |
| `/start` | `Onboarding` (`pages/Onboarding.tsx`) | Standalone | Choose level (and name), then navigate to `/` |
| `/account` | `AccountPage` (`pages/Account.tsx`) | Standalone | **Admin** sign-in and "forgot password" (`?forgot=1`); redirects to `?next=` (default `/admin`) once signed in |
| `/reset-password` | `ResetPasswordPage` (`pages/Account.tsx`) | Standalone | Set a new password after opening a recovery link |
| `/print/lesson/:lessonId` | `PrintLesson` (`pages/Print.tsx`) | Print | Printable lesson (Save as PDF) |
| `/print/module/:levelId/:moduleId` | `PrintModule` | Print | Module workbook (cover + all lessons) |
| `/print/guide/:guideId` | `PrintGuide` | Print | Printable career guide |
| `/print/blog/:postId` | `PrintBlog` | Print | Printable blog article |
| `/admin/*` | `AdminApp` (lazy, `admin/AdminApp.tsx`) | Admin | Admin studio (see §5.2) |
| `/` | `Home` (`pages/Dashboard.tsx`) | Own `AppShell` when a level is chosen | Shows `Landing` if the learner has no valid level, otherwise the Dashboard |
| `/learn` | `LearnIndex` (`pages/Learn.tsx`) | `AppShell` | All learning paths/levels |
| `/learn/:levelId` | `LevelRoadmap` | `AppShell` | Roadmap for one level |
| `/learn/:levelId/:moduleId` | `ModulePage` | `AppShell` | Module overview and lesson list |
| `/lesson/:lessonId` | `LessonPage` (`pages/Lesson.tsx`) | `AppShell` | Lesson (Learn / Example / Practice / Challenge), notes, completion |
| `/challenges` | `ChallengesPage` (`pages/Challenges.tsx`) | `AppShell` | Challenge list with filters |
| `/challenges/:challengeId` | `ChallengePage` | `AppShell` | Challenge brief, checklist, submission |
| `/career` | `CareerCentre` (`pages/Career.tsx`) | `AppShell` | Career Centre overview |
| `/career/:section` | `CareerSectionPage` | `AppShell` | One section: `resume`, `linkedin`, `portfolio`, `job-search`, `interviews`, `networking` |
| `/resources` | `ResourcesPage` (`pages/Resources.tsx`) | `AppShell` | Resource library |
| `/progress` | `ProgressPage` (`pages/Progress.tsx`) | `AppShell` | Progress, achievements, bookmarks, notes |
| `/profile` | `ProfilePage` (`pages/Account.tsx`) | `AppShell` | Name, level, colour mode, backup/restore, reset progress |
| `/search` | `SearchPage` (`pages/Account.tsx`) | `AppShell` | Full search page (`?q=&level=&cat=`) |
| `/reviews` | `ReviewsPage` (`pages/Reviews.tsx`) | `AppShell` | Public reviews and review form |
| `/blog` | `BlogIndex` (`pages/Blog.tsx`) | `AppShell` | Blog list |
| `/blog/:slug` | `BlogPostPage` | `AppShell` | Blog article |
| `*` | `NotFound` (`pages/Account.tsx`) | `AppShell` | "Page not found" |

Query parameters used app-wide: `?preview=1` (draft preview, read once at load by `ContentProvider`) and `?auto=0` on print pages (do not open the print dialog automatically; `Print.tsx:28`). **Confirmed.**

### 5.2 Admin routes (`src/admin/AdminApp.tsx`, nested under `/admin/*`)

`AdminApp` first applies a gate:
1. `!ready` → `FullPageLoader`.
2. No user → `AdminLogin`. In local mode this is a "Open admin for this browser" button. With Supabase it is an email/password form.
3. User is not an admin → `NotAdmin`, which shows the SQL to insert into `public.admins`.
4. Otherwise → `AdminProvider` + `AdminLayout`.

| Path | Component (file) | Nav group | Purpose |
|---|---|---|---|
| `/admin` (index) | `AdminDashboard` (`pages/Dashboard.tsx`) | Overview | To-dos (unpublished changes, missing booking link, pending reviews, local mode) and headline stats |
| `/admin/analytics` | `AnalyticsPage` (`pages/Dashboard.tsx`) | Overview | Activity analytics from `events`, learners, submissions |
| `/admin/courses` | `CoursesPage` (`pages/Courses.tsx`) | Content | Courses → modules → lessons editor (SlideEditor) |
| `/admin/challenges` | `ChallengesAdmin` (`pages/Challenges.tsx`) | Content | Challenge editor |
| `/admin/blog` | `BlogAdmin` (`pages/Blog.tsx`) | Content | Blog editor |
| `/admin/content` | `LibraryPage` (`pages/Library.tsx`) | Content | Resources, career guides, announcements & notification settings |
| `/admin/levels` | `LevelsPage` (`pages/Levels.tsx`) | Content | Level settings and roadmap |
| `/admin/media` | `MediaPage` (`pages/Media.tsx`) | Content | Media library |
| `/admin/users` | `UsersPage` (`pages/Users.tsx`) | People | Learners/accounts and submissions |
| `/admin/connect` | `ConnectAdmin` (`pages/Connect.tsx`) | People | 1:1 booking link and mentor profile |
| `/admin/reviews` | `ReviewsAdmin` (`pages/Reviews.tsx`) | People | Review moderation and settings |
| `/admin/offers` | `OffersPage` (`pages/Offers.tsx`) | Site | Offers & banners |
| `/admin/website` | `WebsitePage` (`pages/Website.tsx`) | Site | Homepage, navigation, footer |
| `/admin/theme` | `ThemePage` (`pages/Theme.tsx`) | Site | Brand, colours, fonts, presets |
| `/admin/publishing` | `PublishingPage` (`pages/Settings.tsx`) | Site | Draft status, version history/restore, JSON backup/import |
| `/admin/settings` | `SettingsPage` (`pages/Settings.tsx`) | Site | Admin account (password), data connection, content summary |
| `/admin/*` (other) | `<Navigate to="/admin" replace>` | — | Unknown admin paths go to the dashboard |

**Deprecated/unused:** learner sign-up. `signUp` exists in `DataStore`, `supabaseStore`, `AuthProvider` and `AccountPage`, but `AccountPage` hard-codes `const tab = 'signin'` (`pages/Account.tsx:166`), so the sign-up form is unreachable from the UI.

---

## 6. Build process

| Script (`package.json`) | Command | What it does |
|---|---|---|
| `npm run dev` | `vite` | Dev server (default port 5173 per AGENTS.md; Vite default). Adds the Motion Studio plugin unless `MOTION_STUDIO=off` (`vite.config.ts`) |
| `npm run build` | `tsc -b && vite build && node scripts/postbuild.mjs` | 1) Type-checks both TS projects (`tsconfig.json` references; `noEmit`). 2) Bundles into `dist/` with `base = $BASE_PATH ?? '/'`. 3) Runs the post-build checks below |
| `npm run lint` | `oxlint` | Lints with `.oxlintrc.json` |
| `npm run preview` | `vite preview` | Serves `dist/` locally |

`scripts/postbuild.mjs` (**Confirmed**):
1. Walks `dist/`. If any `.js`, `.html` or `.css` file contains `motion-studio`, `motionStudio` or `__MOTION_STUDIO` (case-insensitive), it prints the files and exits with code 1, which fails the build.
2. Copies `dist/index.html` to `dist/404.html`. GitHub Pages serves `404.html` for unknown paths, so deep links such as `/designer-kid/lesson/x` load the SPA (they return HTTP 404 status but render the app).

Build-time environment variables, read through `import.meta.env` in `src/data/index.ts`: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. If either is missing, the build runs in browser-only (`localStore`) mode. `BASE_PATH` is read in `vite.config.ts`. `MOTION_STUDIO` (dev only) is also read in `vite.config.ts`. `MOTION_STUDIO_AGENT_PROVIDER` appears in `.env.example`; it is not referenced in `src/`, and presumably the `motion-studio` dev plugin reads it (**Inferred**).

Node version: README says "Node 22.13+ required". CI uses Node 22 (`deploy.yml`). The machine used at hand-off runs Node v24.11.1. There is no `engines` field in `package.json`. **Confirmed.**

## 7. Deployment structure (summary)

```text
git push origin main
   └─ GitHub Actions ".github/workflows/deploy.yml" (also workflow_dispatch)
        job build (ubuntu-latest):
           actions/checkout@v4 → actions/setup-node@v4 (Node 22, npm cache) → npm ci
           actions/configure-pages@v5 (id: pages)
           npm run build   env: BASE_PATH=${{ steps.pages.outputs.base_path }}/  ("/designer-kid/")
                                VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY  ← repository *variables* (vars.*)
           actions/upload-pages-artifact@v3 (path: dist)
        job deploy: actions/deploy-pages@v4 → environment github-pages
   └─ https://rajuvegesana98.github.io/designer-kid/   (static files only; no server code)
             │  browser → HTTPS → Supabase project (REST /rest/v1, Auth /auth/v1, Storage /storage/v1, RPC)
```

- Workflow permissions: `contents: read`, `pages: write`, `id-token: write`. Concurrency group `pages` with `cancel-in-progress: true`. **Confirmed.**
- Content changes need **no deploy**. Publishing writes to Supabase `site_content`, and every visitor loads it at runtime. **Confirmed** (`src/state/content.tsx`, `publish_content` in `supabase/schema.sql`).
- Database schema changes are applied **manually** in the Supabase SQL editor. There is no Supabase CLI config or migration runner in the repo. **Confirmed** (no `supabase/config.toml`; AGENTS.md).
- Custom domain: none configured (verified at hand-off). Supabase Auth Site URL/redirect URLs and SMTP settings: **Unknown**. Check Supabase dashboard → Authentication → URL Configuration / SMTP.

---

## 8. Languages and file types

Counts from `git ls-files | sed 's/.*\.//' | sort | uniq -c` (111 tracked files):

| Language / format | Tracked files | Where used | Importance | Key files |
|---|---|---|---|---|
| TypeScript + JSX (`.tsx`) | 55 | All React components, pages, providers, admin | Core | `src/App.tsx`, `src/state/*.tsx`, `src/admin/*` |
| TypeScript (`.ts`) | 21 | Content model, seed content, data layer, helpers, Vite config | Core | `src/content/types.ts`, `src/data/*.ts`, `src/lib/*.ts`, `vite.config.ts` |
| CSS (`.css`) | 1 | Entire design system (CSS custom properties, light/dark, print, reduced motion) | Core | `src/styles/global.css` |
| SQL (`.sql`) | 3 | Supabase schema, RLS, functions, triggers, migrations | Core (backend) | `supabase/schema.sql`, `supabase/migrations/*.sql` |
| HTML (`.html`) | 1 | SPA host page | Core | `index.html` |
| JavaScript ES modules (`.mjs`) | 7 | Post-build check; Playwright browser tests | Build / QA | `scripts/postbuild.mjs`, `tools/e2e/*.mjs` |
| JSON (`.json`) | 7 | npm manifests/lock, TS configs, lint config | Config | `package.json`, `package-lock.json`, `tsconfig*.json`, `.oxlintrc.json`, `tools/e2e/package.json` |
| YAML (`.yml`) | 1 | CI/CD workflow | Deploy | `.github/workflows/deploy.yml` |
| Markdown (`.md`) | 11 | Documentation (this file and ARCHITECTURE.md are new in v2.0 and not yet counted) | Docs | `AGENTS.md`, `README.md`, `docs/*.md` |
| SVG (`.svg`) | 1 | Favicon | Asset | `public/favicon.svg` (illustrations are inline JSX SVG in `illustrationLibrary.tsx`) |
| dotfiles | 3 | `.gitignore` ×2, `.env.example` | Config | — |

Shell appears only as command snippets inside Markdown (for example AGENTS.md, README.md). There are no `.sh` files. **Confirmed.**

---

## 9. Technology stack

### 9.1 Declared vs installed versions

"Declared" comes from `package.json`. "Installed" comes from `npm ls --depth=0` on 30 Sep 2026 and matches `package-lock.json`.

| Package | Role | Declared | Installed |
|---|---|---|---|
| `react` | UI library | ^19.2.8 | 19.3.0 |
| `react-dom` | DOM renderer | ^19.2.8 | 19.3.0 |
| `react-router` | Client routing (`BrowserRouter`, `Routes`, `lazy` admin route) | ^8.4.0 | 8.4.0 |
| `motion` | Animation (`motion/react`: `motion.*`, `AnimatePresence`, `MotionConfig`) | ^13.4.6 | 13.4.6 |
| `lucide-react` | Icons | ^1.49.0 | 1.49.0 |
| `@supabase/supabase-js` | Supabase client (Auth, PostgREST, Storage, RPC) | ^2.117.2 | 2.117.2 |
| `vite` (dev) | Dev server and bundler | ^8.3.0 | 8.3.1 |
| `@vitejs/plugin-react` (dev) | React plugin for Vite | ^6.1.1 | 6.1.1 |
| `typescript` (dev) | Type checking (`tsc -b`) | ~6.0.2 | 6.0.3 |
| `oxlint` (dev) | Linter | ^1.81.0 | 1.86.0 |
| `motion-studio` (dev) | Dev-only animation inspector Vite plugin; blocked from production by `postbuild.mjs` | ^2.1.0 | 2.1.0 |
| `@types/react`, `@types/react-dom`, `@types/node` (dev) | Type definitions | ^19.2.18, ^19.2.7, ^24.13.3 | 19.3.0, 19.3.0, 24.19.0 |
| `playwright-core` (separate `tools/e2e/package.json`) | Browser tests | ^1.55.0 | Unknown (not installed in `tools/e2e/`; run `npm install` there) |

### 9.2 Stack by layer

| Layer | Technology | Evidence | Status |
|---|---|---|---|
| Frontend framework | React 19 SPA, `StrictMode`, function components and hooks | `src/main.tsx` | Confirmed |
| Routing | React Router 8, `BrowserRouter` with `basename` from `import.meta.env.BASE_URL` | `src/App.tsx:90` | Confirmed |
| State management | React Context only: `ContentProvider`, `ThemeProvider`/mode, `ToastProvider`, `AuthProvider`, `LearnerProvider`, `AdminProvider`, `PrintMode`. No Redux/Zustand/React Query | `src/state/*`, `src/admin/state.tsx`, `package.json` | Confirmed |
| Styling | Plain CSS with CSS custom properties in one file. The theme is applied at runtime by writing CSS variables on `<html>` (`themeVars`). Web fonts come from Google Fonts (`index.html` and `ensureFonts`). No Tailwind/CSS-in-JS/UI kit | `src/styles/global.css`, `src/lib/theme.ts` | Confirmed |
| Animation | `motion` (`motion/react`), with the OS reduced-motion preference respected via `MotionConfig reducedMotion="user"` | `src/state/ui.tsx:74` | Confirmed |
| Icons | `lucide-react` (curated map for content-referenced icons) | `src/lib/icons.tsx` | Confirmed |
| Forms / UI libraries | None. Forms are hand-written (`src/admin/fields.tsx`, `src/components/ui.tsx`) | `package.json` has no form/UI deps | Confirmed |
| Markdown | Custom tiny parser (no library) | `src/lib/markdown.tsx` | Confirmed |
| Backend | **No own server.** Supabase BaaS: Auth (email/password, implicit flow), Postgres with RLS (7 tables), security-definer SQL functions (`is_admin`, `publish_content`, triggers), Storage bucket `media` (public read, admin write) | `src/data/supabaseStore.ts`, `supabase/schema.sql` | Confirmed |
| Offline/demo backend | `localStorage` implementation of the same interface | `src/data/localStore.ts` | Confirmed |
| Build | npm, Vite 8, TypeScript 6 (`tsc -b`, type-check only), oxlint, custom post-build script | `package.json`, `scripts/postbuild.mjs` | Confirmed |
| Testing | Playwright scripts (`playwright-core`, system Chrome channel) in `tools/e2e`; no unit tests | `tools/e2e/*.mjs` | Confirmed |
| Hosting / CI | GitHub Actions → GitHub Pages (static) | `.github/workflows/deploy.yml` | Confirmed |

---

## 10. Unknowns (things to check)

| Item | How to check |
|---|---|
| Supabase Auth Site URL / redirect URL allow-list (needed for `/reset-password` links) and custom SMTP | Supabase dashboard → Authentication → URL Configuration, and Authentication → Emails/SMTP |
| Installed `playwright-core` version for `tools/e2e` | `cd tools/e2e && npm ls` |
| Where `MOTION_STUDIO_AGENT_PROVIDER` is consumed | Read the `motion-studio` package docs/source in `node_modules/motion-studio` |
| Whether migrations 002/003 have been run since hand-off | Supabase SQL editor: `select column_name from information_schema.columns where table_name='profiles' and column_name='blocked';` and check `pg_policies` for `reviews: anyone submits` |
