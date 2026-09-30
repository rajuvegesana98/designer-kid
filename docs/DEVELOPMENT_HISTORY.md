# Development history

This is an evidence-based history of how Designer Kid was built. It draws on the git history (all 6 commits on
`main`, with dates, messages and changed areas), on `docs/SESSION_HISTORY.md` (labelled *documented during the
session*, because it was written by the AI agent during the build rather than reconstructed afterwards), and on
the files in the repository. It records architectural changes, features added and removed (notably learner
accounts), bug fixes, database changes and dependencies. It ends with a section on the AI (Claude) development
context, which separates what can be proven from the project files from what existed only in the conversation.

Last verified: 30 Sep 2026 (docs v2.0)

Evidence labels: **Confirmed** (git/code) · **Documented during the session** (`docs/SESSION_HISTORY.md`,
`docs/ORIGINAL_BRIEF.md`) · **Inferred** (reasoned, with the reason given) · **Unknown**.

---

## 1. Timeline at a glance

```text
2026-09-30 (all times IST, +0530)
~11:17   project scaffolded (file mtimes of tsconfig*.json, .gitignore, .oxlintrc.json)      Inferred
~11:50   index.html, public/, src/ tree, vite.config.ts last touched before first commit       Inferred
14:00:17 0ec840f  Designer Kid learning & career platform         (initial import, 85 files, 32,846 lines)
14:55:58 85c8d3d  Offers & banners, blog, theme presets, brand preview       (18 files, +1377/−7)
15:12:01 48c3019  Accounts, password reset, user management, 1:1 on landing, more blog posts (17 files, +1248/−69)
15:30:05 b0c7c24  Open learning: no learner accounts, browser-saved progress (15 files, +155/−136)
15:35:28 70c7738  Docs: AGENTS.md, full documentation set, browser test suites (19 files, +1196/−99)
15:39:12 356c611  Password show/hide toggle; admin change password + email reset link (5 files, +63/−10)
```

- Branch: `main` only. Remote: `github.com/rajuvegesana98/designer-kid` (Confirmed, `git remote -v`).
- Author on every commit: "Raju" (the owner's git identity; email not reproduced here).
- **All 6 commits** carry the trailer `Co-Authored-By: Claude Opus 5.5 (1M context)` (Confirmed, see §8).
- Everything happened in **one day and one session** (Confirmed by dates; *documented during the session*).
  The ~2.7 hours of work before the first commit (11:17 → 14:00) are not in git history. The session history
  describes it as Phases 1–5 (Inferred from file modification times plus SESSION_HISTORY).
- Uncommitted at the time of writing: `.env.example` modified and `CHANGELOG.md` untracked (Confirmed with
  `git status`; these are being produced by the parallel documentation effort, not by application work).

---

## 2. Commit-by-commit

### 2.1 `0ec840f` — 2026-09-30 14:00:17 — "Designer Kid learning & career platform"

Message body: "Vite + React + TypeScript app with three learner levels, slide-style admin editor, Supabase data
layer, reviews, PDF downloads and GitHub Pages deploy."

| Area | Files (lines added) |
|---|---|
| Tooling / config | `package.json` (30), `package-lock.json` (2376), `vite.config.ts` (12), `tsconfig*.json`, `.oxlintrc.json`, `.gitignore`, `.env.example`, `index.html`, `public/favicon.svg` |
| CI / deploy | `.github/workflows/deploy.yml` (56), `scripts/postbuild.mjs` (25) |
| App shell & state | `src/App.tsx`, `src/main.tsx`, `src/state/{auth,content,learner,ui}.tsx` |
| Data layer | `src/data/{index,types,localStore,supabaseStore}.ts` (the `DataStore` interface with 2 implementations) |
| Learner pages | `src/pages/*` (Landing, Onboarding, Dashboard, Learn, Lesson, Challenges, Career, Resources, Reviews, Progress, Print, Account) |
| Components | `AppShell`, `Blocks`, `widgets` (7 widgets), `Search`, `Notifications`, `MentorLink`, `LevelSwitcher`, `illustrationLibrary` (910 lines, 28 illustrations), `Illustrations`, `ui`, … |
| Admin | `src/admin/AdminApp.tsx`, `state.tsx`, `SlideEditor.tsx` (717), `BlocksEditor.tsx`, `fields.tsx`, `uploads.tsx`, `IllustrationPicker.tsx`, `pages/{Dashboard,Courses,Challenges,Library,Levels,Media,Users,Connect,Reviews,Website,Theme,Settings}.tsx` |
| Content seed | `beginnerFoundations.ts` (3637), `beginnerLaunch.ts` (1619), `intermediateCraft.ts` (2803), `intermediatePractice.ts` (1661), `expert.ts` (2901), `library.ts` (2042), `careerProfiles.ts` (1265), `careerInterviews.ts` (476), `index.ts` (175), `types.ts` (323) |
| Styles | `src/styles/global.css` (1085) |
| Database | `supabase/schema.sql` (200): `admins`, `is_admin()`, `profiles` (+`state` JSON), `handle_new_user()` trigger, `site_content` (draft/published), `content_history`, `publish_content()` RPC, `events`, `submissions`, storage bucket `media` + policies, `reviews` + `review_defaults()` trigger + policies |

Notes:
- This commit already contained **optional learner accounts**: `/account` had Sign in / Create account tabs
  (`mode=signup`), the AppShell had a "Sign in" link, and `learner.tsx` merged browser progress into
  `profiles.state` for signed-in users (Confirmed with `git show 0ec840f:src/pages/Account.tsx`).
- No blog and no offers yet (`seed/index.ts` at this commit has no `blog`/`promos`; Confirmed).
- *Documented during the session*: Phases 1–5 (setup, architecture, sub-agent content authoring, student app,
  admin studio, PowerPoint-style editor, PDF/PPT uploads, reviews, GitHub + Supabase go-live) all happened
  before this first commit.

### 2.2 `85c8d3d` — 14:55:58 — "Add offers & banners, blog, theme presets and brand preview"

| Area | Files |
|---|---|
| New admin pages | `src/admin/pages/Blog.tsx` (187), `src/admin/pages/Offers.tsx` (179); `Theme.tsx` +92 (presets, brand preview) |
| Learner | `src/pages/Blog.tsx` (169), `src/components/Promo.tsx` (149), `src/pages/Print.tsx` +26 (blog print), `Search.tsx` (articles), `AppShell.tsx` |
| Content model | `src/content/types.ts` +43 (`Promo`, `BlogPost`), `seed/index.ts` +23, `seed/blog.ts` (456; 5 articles) |
| Other | `src/lib/content.ts` (`studentView` filters blog/promos), `src/state/content.tsx` (withDefaults keys), `admin/state.tsx` (section labels), `global.css` +27 |

The message also lists "Reviews, PDF/PPT uploads, illustrations, interview/LinkedIn/resume guides". Those files
were already in `0ec840f` (for example, `reviews` appears 13 times in that commit's `schema.sql`). The message
summarises the work of the whole round rather than this diff (Inferred).

### 2.3 `48c3019` — 15:12:01 — "Accounts, password reset, user management, 1:1 on landing, more blog posts"

Message bullets (Confirmed): sign-up / sign-in prompts on landing and dashboard; forgot + reset password; change
password in profile; suspended accounts are signed out; admin users: edit name/level, suspend/restore, reset
progress, send reset email, grant/remove admin; 1:1 Connect panel always visible on landing and dashboard (with
a fallback before a booking link exists); blog strip on landing and dashboard; 7 new design articles; migration 002.

| Area | Files |
|---|---|
| Auth | `src/state/auth.tsx` +42 (`recovering`, `suspended`, `requestPasswordReset`, `updatePassword`), `src/App.tsx` (`/reset-password`, `RecoveryRedirect`) |
| Data | `supabaseStore.ts` +51 (reset, update password, `updateLearnerProfile`, `setAdmin`, `blocked`), `localStore.ts` +21, `types.ts` |
| Learner UI | `Account.tsx` +132 (forgot/reset/change password), `Landing.tsx`, `Dashboard.tsx`, `Blog.tsx` (`LatestPosts`), `MentorLink.tsx` (`MentorSection` fallback) |
| Admin | `Users.tsx` +112 (manage dialog), `Dashboard.tsx` |
| Content | `seed/blogDesign.ts` (672; 7 articles → 12 total) |
| Database | `supabase/migrations/002_user_management.sql` (48) and the same SQL appended to `schema.sql` |

### 2.4 `b0c7c24` — 15:30:05 — "Open learning: no learner accounts, browser-saved progress"

Message bullets (Confirmed): remove learner sign-up/sign-in, so progress lives in the browser with backup/restore;
`/account` becomes admin sign-in + password reset, with a forgot-password link on the admin login; anyone can
write a review (still approved by the admin); admin stats based on anonymous activity events; dialogs portal to
`<body>` (fixes the Publish dialog being clipped inside the admin top bar); browser-only mode keeps as many
versions as fit in storage; migration 003.

| Area | Files |
|---|---|
| Learner UI | `Account.tsx` (tab hard-coded to `'signin'`; progress backup/restore in Profile), `Landing.tsx`, `Dashboard.tsx`, `Challenges.tsx`, `Reviews.tsx`, `AppShell.tsx` (Sign-in link removed) |
| State / data | `learner.tsx` (`importState`), `localStore.ts` (version fallback loop), `supabaseStore.ts` (`submitReview` with `user_id` null) |
| Admin | `Dashboard.tsx` (`computeStats` from events), `Users.tsx` (copy), `AdminApp.tsx` (Forgot password link) |
| UI kit | `components/ui.tsx` (Modal/Sheet portalled with `createPortal`) |
| Database | `supabase/migrations/003_open_learning.sql` (22) + appended to `schema.sql` |

### 2.5 `70c7738` — 15:35:28 — "Docs: AGENTS.md, full documentation set, browser test suites"

Added `AGENTS.md` (92), `CLAUDE.md` (3; points to AGENTS.md), and rewrote `README.md`. Added `docs/`
(`ADMIN_GUIDE`, `FEATURES`, `NEXT_STEPS`, `OPERATIONS`, `ORIGINAL_BRIEF`, `README`, `SESSION_HISTORY`,
`TESTING`), plus `tools/e2e/` (`e2e.mjs` 190, `e2e2.mjs` 158, `e2e3.mjs` 115, `e2e4.mjs` 51, `live.mjs`,
`live2.mjs`, `package.json` with `playwright-core ^1.55.0`, `.gitignore`). No application code changed.

### 2.6 `356c611` — 15:39:12 — "Password show/hide toggle; admin change password + email reset link in Settings"

`src/components/ui.tsx` +23 (`PasswordInput`), `src/admin/pages/Settings.tsx` +32 (`AdminAccount`: change
password, "Email me a reset link"), `src/admin/AdminApp.tsx` (uses `PasswordInput`), `src/pages/Account.tsx`
(uses `PasswordInput`), `src/styles/global.css` +4.

---

## 3. Major architectural decisions and changes

| # | Decision / change | When | Evidence |
|---|---|---|---|
| 1 | Vite + React + TypeScript SPA, hosted on GitHub Pages (static) with `BrowserRouter` + `404.html` copy | Before `0ec840f` | `vite.config.ts`, `scripts/postbuild.mjs`, `deploy.yml` |
| 2 | **One typed `SiteContent` JSON document** holds all editable content (Level → Course → Module → Lesson + collections) | Before `0ec840f` | `src/content/types.ts`. *Documented*: "so the admin edits everything without code changes (brief §41)" |
| 3 | **`DataStore` abstraction** with Supabase and browser-only (localStorage) implementations, chosen by env vars | Before `0ec840f` | `src/data/index.ts` |
| 4 | **Draft → Preview → Publish** with a security-definer `publish_content()` RPC and `content_history` | Before `0ec840f` | `src/admin/state.tsx`, `schema.sql` |
| 5 | Admin rights in a separate `admins` table + `is_admin()` so users cannot grant themselves admin | Before `0ec840f` | `schema.sql` lines 5–16 |
| 6 | Seed content lazy-loaded as its own chunk; admin lazy-loaded | Before `0ec840f` | `loadSeed()` dynamic import; `lazy(() => import('./admin/AdminApp'))` |
| 7 | `withDefaults()` backfills missing top-level sections from the seed so old published documents keep working | Extended in `85c8d3d` | `src/state/content.tsx` |
| 8 | No module locking (owner request): `moduleLock` never locks | Before `0ec840f` (*documented* Phase 4) | `src/lib/progress.ts` line 57 |
| 9 | 1:1 = external booking link instead of a request workflow | Owner decision (*documented*) | `MentorLink.tsx`, `ORIGINAL_BRIEF.md` "Decisions" |
| 10 | Learner accounts expanded (`48c3019`) then **removed from the UI** (`b0c7c24`): open learning, browser progress | 15:12 → 15:30 | Commits; code kept (dormant) |
| 11 | Modal/Sheet rendered through a portal to `<body>` | `b0c7c24` | `components/ui.tsx` |
| 12 | Motion Studio dev-only with a build guard | Before `0ec840f` | `vite.config.ts`, `postbuild.mjs` |

## 4. Features added and removed

```text
0ec840f  + levels/courses/lessons (182), challenges (21), resources (28), career guides (27), achievements (15)
         + 7 widgets, 28 illustrations, search, notifications, progress, bookmarks, notes, PDF print views
         + admin studio (12 pages), slide editor, media, versions, backup
         + reviews (+ DB trigger), 1:1 link, optional learner accounts (sign in / sign up / sync)
85c8d3d  + offers & banners, blog (5 articles), theme presets, brand preview
48c3019  + password reset & change, suspend, admin user management, 1:1 panel fallback, 7 articles (12 total)
         + sign-up prompts on landing/dashboard
b0c7c24  − learner sign-up/sign-in UI, sign-up prompts, "Sign in" link           (code kept: DEPRECATED)
         + progress backup/restore, anonymous reviews, event-based admin stats
356c611  + PasswordInput show/hide, admin "Your admin account" in Settings
```

## 5. Bug fixes recorded

From `docs/SESSION_HISTORY.md` (*documented during the session*), found by automated browser testing
(Playwright + local Chrome) unless stated otherwise:

| Bug | Fix | Where it lives now |
|---|---|---|
| Search palette re-opened after Enter (focus returned to the trigger) | `preventDefault` | `src/components/Search.tsx` |
| Challenge submission sent stale data | Pass link/notes directly | `learner.completeChallenge(id, title, link, notes)` |
| Debounced admin fields overwrote sibling edits | Commit through a ref to the latest callback | `src/admin/fields.tsx` |
| Drag-reorder broke because drafts are cloned on every edit | Stable string keys, commit on drag end | `SortableList` in `fields.tsx` (`keys` prop) |
| Derived colour tokens did not update in scoped overrides | Re-declare on `[style*='--c-']` | `src/styles/global.css` |
| Admin course tree too cramped | Flattened tree + "focus mode" | `Courses.tsx` |
| macOS case-insensitivity near-miss (`illustrations.tsx` vs `Illustrations.tsx`) | Used `illustrationLibrary.tsx` | `AGENTS.md` gotcha |
| Publish dialog clipped inside the admin top bar (`backdrop-filter` creates a containing block) | Modal/Sheet portal to `<body>` | Commit `b0c7c24` (Confirmed) |
| Browser-only mode ran out of localStorage with many versions | Keep as many versions as fit | Commit `b0c7c24`, `localStore.publish` (Confirmed) |

## 6. Database history

| Step | Commit | Objects | Live status (verified at hand-off) |
|---|---|---|---|
| Base schema | `0ec840f` | `admins`, `is_admin()`, `profiles`, `handle_new_user()` + `on_auth_user_created`, `site_content`, `content_history`, `publish_content()`, `events`, `submissions`, bucket `media` + 4 storage policies, `reviews`, `review_defaults()` + `reviews_defaults` trigger, RLS on all tables | **Run** on `zcxnlelzhkwbvittgcuj` |
| Migration 002 `user_management` | `48c3019` | `profiles.blocked`, policies "profiles: update own" (not blocked) / "profiles: admin updates", `protect_profile()` trigger, `admins` select/insert/delete policies, blocked users cannot post reviews/submissions | **Not run** |
| Migration 003 `open_learning` | `b0c7c24` | "reviews: anyone submits" (replaces signed-in-only), Blog item added to `navigation` in the draft and published documents | **Not run**. Depends on 002 (references `profiles.blocked`) |

`schema.sql` is cumulative (base + 002 + 003 appended) and idempotent. A fresh project runs only
`schema.sql`. The live project needs 002, then 003. An earlier Supabase project (`ywbiyutmrwmjnbllyzxd`) was
set up and then abandoned (*documented*; verified at hand-off). Content was published once, at
2026-09-30 09:15 UTC (182 lessons, 27 guides; verified at hand-off). That is before the blog/offers/reviews
settings sections existed in the published document.

## 7. Dependencies

`package.json` changed **only in the initial commit** (Confirmed: `git log -p -- package.json`). So the
dependency set has been the same at every stage.

| Package | Declared | Installed (`npm ls`, 30 Sep 2026) | Role |
|---|---|---|---|
| react / react-dom | ^19.2.8 | 19.3.0 | UI |
| react-router | ^8.4.0 | 8.4.0 | Routing |
| motion | ^13.4.6 | 13.4.6 | Animation (`motion/react`) |
| lucide-react | ^1.49.0 | 1.49.0 | Icons |
| @supabase/supabase-js | ^2.117.2 | 2.117.2 | Backend client |
| vite (dev) | ^8.3.0 | 8.3.1 | Build/dev server |
| @vitejs/plugin-react (dev) | ^6.1.1 | 6.1.1 | React plugin |
| typescript (dev) | ~6.0.2 | 6.0.3 | Types |
| oxlint (dev) | ^1.81.0 | 1.86.0 | Lint |
| motion-studio (dev) | ^2.1.0 | 2.1.0 | Dev-only animation inspector |
| @types/* (dev) | — | node 24.19.0, react 19.3.0, react-dom 19.3.0 | Types |
| playwright-core (tools/e2e, separate) | ^1.55.0 | not installed in the repo root | Browser tests |

Runtime: Node 24.11 on the build machine (*documented*). CI uses Node 22 (`deploy.yml`).

---

## 8. CLAUDE / AI DEVELOPMENT CONTEXT

### 8.1 Evidence available in the project

| Evidence | What it shows | Location |
|---|---|---|
| `Co-Authored-By: Claude Opus 5.5 (1M context)` trailer | Present on **6 of 6** commits (Confirmed: `git log --format=%B \| grep -c Co-Authored-By` → 6) | git history |
| `CLAUDE.md` | 3-line file pointing Claude Code to `AGENTS.md` | repo root |
| `AGENTS.md` | "Guide for AI coding agents (Claude, Cursor, Codex…) and developers": product rules, stack, architecture, how to change things safely, gotchas | repo root |
| AI-written documentation | `docs/SESSION_HISTORY.md`, `ORIGINAL_BRIEF.md`, `FEATURES.md` (v1), `ADMIN_GUIDE.md`, `OPERATIONS.md`, `TESTING.md`, `NEXT_STEPS.md`, all added in `70c7738` under the Claude co-author trailer. SESSION_HISTORY describes itself as "useful for anyone (human or AI) picking the project up later" | `docs/` |
| Content written by AI sub-agents | "Content authored by parallel sub-agents against a shared brief (British English, honest, no fake stats)" covering 182 lessons, 21 challenges, 28 resources, 18 career guides, 15 achievements. Later rounds added 6 LinkedIn/resume guides + 3 interview Q&A guides (→ 27) and 12 blog articles. A sub-agent nearly overwrote `Illustrations.tsx` (*documented during the session*) | `docs/SESSION_HISTORY.md` Phases 2 and 4 |
| Automated browser testing by the agent | Playwright scripts driving local Chrome, 34 checks across 4 suites + 2 live smoke tests | `tools/e2e/`, `docs/TESTING.md` |
| Motion Studio AI agent provider | Env var **`MOTION_STUDIO_AGENT_PROVIDER=claude`** in the committed `.env.example`. Agent edits need a Motion Studio subscription and `@anthropic-ai/claude-agent-sdk`, which is **not installed** (`node_modules/@anthropic-ai` absent) | `.env.example`, `docs/OPERATIONS.md` |
| Skills / plugins mentioned | "UI/UX Pro Max" skill requested in the brief but **not installed** (needs `/plugin` commands by the owner) | `docs/ORIGINAL_BRIEF.md`, `docs/NEXT_STEPS.md` |
| Original brief and follow-ups | 45 numbered requirements + 11 chronological follow-up requests, reproduced by the agent | `docs/ORIGINAL_BRIEF.md` |

### 8.2 MCP / AI API integrations in the application

**None.** Confirmed by searching `src/`, `supabase/`, `scripts/`, `package.json`, `vite.config.ts`,
`index.html`, `.github/` and `tools/e2e/` for `anthropic|openai|claude|mcp|gpt|gemini|llm` (the only matches were
unrelated substrings such as `scrollMarginTop`). The shipped app makes no calls to any AI model. The
only AI-related runtime hook is the dev-only Motion Studio provider variable above, which is not used in
production builds.

### 8.3 Information unavailable (existed only in the Claude conversation history)

These cannot be recovered from the repository. The session history summarises some of them, but not
verbatim:

- The full prompt/response transcript, including the exact wording of each owner request (ORIGINAL_BRIEF is a
  reconstruction), and any intermediate designs, plans or rejected alternatives.
- The shared brief given to the content-writing sub-agents, their individual outputs, and any edits made
  when merging them.
- Tool-call logs: the Playwright run outputs, screenshots (`tools/e2e/shots*/` are git-ignored), contrast
  calculations, and the Supabase REST verification calls.
- Work between ~11:17 and the first commit at 14:00 (no intermediate commits). The order of changes within that
  window is known only from SESSION_HISTORY.
- How the GitHub CLI device-code login, repository creation, Pages settings and Actions variables were set up
  (only the outcomes are recorded).
- Supabase dashboard actions by the owner (running the SQL, creating the admin user, Auth URL configuration and
  SMTP, which are **Unknown**).
- Model settings, token usage, costs and any sub-agent configuration.
