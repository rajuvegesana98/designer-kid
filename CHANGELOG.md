# Changelog

All notable changes to Designer Kid. Dates are from the git history (all on 30 Sep 2026, local time).
Format loosely follows [Keep a Changelog](https://keepachangelog.com/). Versions below are documentation
milestones; `package.json` reports `2.1.0` from v2.1.

## [2.1.0] — 2026-09-30
### Added
- Per-route `index.html` pages (255) so deep links return HTTP 200 on GitHub Pages; `robots.txt`, `sitemap.xml`
  (252 URLs), canonical + Open Graph + Twitter tags and `public/og-image.png` (needs `SITE_URL`, set by the workflow).
- Per-page browser tab titles (`src/lib/usePageTitle.ts`).
- `ErrorBoundary` with a recovery screen.
- `supabase/migrations/004_hardening.sql` (also appended to `schema.sql`): events/reviews rate limits, events type and
  name restrictions, draft-only content writes with no deletes. **Must be run in Supabase after 002 and 003.**
### Changed
- `withDefaults` uses `src/content/defaults.ts` + the blog chunks instead of importing the whole seed on every visit.
- Blog menu item is added automatically when blog posts exist and the menu has no `/blog` link.
- Media picker uploads are resized/converted to WebP like the Media library (shared `optimise()` in `admin/uploads.tsx`).
### Fixed
- Keyboard focus moves to the main content after navigation.
- Warning colour meets WCAG AA contrast (`#8f5600`).
- Removed invalid `aria-controls` from tabs; default fonts no longer requested twice.

## [2.0.0-docs] — 2026-09-30
### Added
- Full audit / hand-over documentation set in `docs/` (overview, architecture, installation, environment,
  database, API, integrations, design system, features, user flows, admin, deployment, security, performance,
  SEO & accessibility, troubleshooting, development history, technical debt, roadmap, migration, master spec).
- Documented `.env.example`.

## 356c611 — Password show/hide & admin account settings
### Added
- `PasswordInput` with show/hide toggle on every password field (admin sign-in, `/account`, reset and change forms).
- Admin → Settings → "Your admin account": change password, or email a reset link.

## 70c7738 — Documentation & tests
### Added
- `AGENTS.md`, `CLAUDE.md`, `docs/` (brief, session history, features, admin guide, operations, testing, next steps).
- Browser test suites in `tools/e2e/`.

## b0c7c24 — Open learning (no learner accounts)
### Changed
- Learners no longer sign up or sign in; progress stays in the browser with download/restore backup (Profile).
- `/account` is now admin sign-in + password reset; "Forgot password?" on the admin login.
- Admin stats use anonymous activity events.
### Added
- Migration `supabase/migrations/003_open_learning.sql` (anonymous reviews; Blog menu item).
### Fixed
- Modals/sheets portal to `<body>` (Publish dialog was clipped inside the admin top bar).
- Browser-only mode keeps as many published versions as fit in localStorage.

## 48c3019 — Accounts, password reset, user management, blog posts
### Added
- (Later removed from the learner UI in b0c7c24) learner sign-up/sign-in prompts.
- Password reset flow (`/reset-password`), change password, suspended accounts.
- Admin → Users: edit name/level, suspend/restore, reset progress, send reset email, grant/remove admin.
- 1:1 panel always visible on landing and dashboard; blog strip on landing and dashboard; 7 design articles.
- Migration `supabase/migrations/002_user_management.sql`.

## 85c8d3d — Offers, blog, theme presets
### Added
- Offers & banners (bar / pop-up, schedule, audience, pages, dismissal memory).
- Blog (slide-editor articles, tags, featured, search, share, PDF) with 5 starter articles.
- Theme quick presets (6) and live logo/favicon preview.

## 0ec840f — Initial platform
### Added
- Vite + React + TypeScript app: learner site (landing, onboarding, dashboard, roadmap, lessons, challenges,
  Career Centre, resources, progress, search, notifications), admin studio, Supabase data layer with
  browser-only fallback, 182 lessons of seed content, Supabase schema, GitHub Pages workflow, Motion Studio (dev).
- Also in this first commit (built before git was initialised): PowerPoint-style slide editor, reviews with
  moderation, PDF/PPT uploads, print/PDF pages, 28 themed illustrations, interview Q&A / LinkedIn / resume
  guides, and "all content open" (no locked modules).
