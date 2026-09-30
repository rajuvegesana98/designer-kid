# Changelog

All notable changes to Designer Kid. Dates are from the git history (all on 30 Sep 2026, local time).
Format loosely follows [Keep a Changelog](https://keepachangelog.com/). Versions below are documentation
milestones; `package.json` still reports `0.0.0` (never bumped).

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
