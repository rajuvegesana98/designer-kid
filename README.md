# Designer Kid

**Learn. Design. Build. Grow.** — a UI/UX learning & career platform for Beginner, Intermediate and Expert
designers, with a full admin studio for the owner.

- **Live:** https://rajuvegesana98.github.io/designer-kid/ · **Admin:** `/admin`
- **Status:** live in production (docs v2.0, 30 Sep 2026). See [docs/MASTER_SPECIFICATION.md](docs/MASTER_SPECIFICATION.md) for what works, what's pending and what to fix first.

> **New developer or AI agent? START HERE:** [docs/MASTER_SPECIFICATION.md](docs/MASTER_SPECIFICATION.md) → [AGENTS.md](AGENTS.md) → [docs/README.md](docs/README.md).

## Overview
Learners pick a level and study for free — **no account needed** (progress, notes and bookmarks save in the
browser, with download/restore). The owner edits every piece of content in `/admin` with a PowerPoint-style
slide editor and publishes with **Draft → Preview → Publish**. Content, admin sign-in, reviews, media and
anonymous analytics live in **Supabase**; the site is a static React app on **GitHub Pages**.

## Features
- 182 lessons across 3 levels (Learn → Example → Practice → Challenge), 7 interactive widgets, 28 illustrations
- 21 design challenges · Career Centre with 27 guides (interview Q&A, resume, LinkedIn, portfolio…) and tools
- Blog (12 articles) · 28 resources · reviews · 1:1 booking panel · offers (banner / pop-up)
- Progress, streaks, achievements, bookmarks, notes, search (⌘K), notifications, PDF downloads, dark mode
- Admin: slide editor, courses, blog, challenges, library, levels, media (images/PDF/PPT), reviews, offers,
  website, theme (presets, logo, favicon), analytics, users, publishing history, backup, password settings

Full inventory with statuses: [docs/FEATURES.md](docs/FEATURES.md).

## Technology stack
React 19 · TypeScript 6 · Vite 8 · React Router 8 · Motion 13 · lucide-react · plain CSS design system ·
@supabase/supabase-js 2 (Postgres + RLS, Auth, Storage, RPC) · GitHub Actions + Pages · dev: motion-studio,
oxlint. Details and versions: [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md).

## Requirements
- **Node.js ≥ 22.22** (react-router 8.4 engines) and npm; git
- Optional for production: a Supabase project and a GitHub repository with Pages

## Installation
```bash
git clone https://github.com/rajuvegesana98/designer-kid.git
cd designer-kid
npm ci
```
Clean-machine guide: [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Environment setup
```bash
cp .env.example .env.local
# VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (publishable key) — leave empty for browser-only mode
```
All variables: [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md). Never use the Supabase secret/service_role key.

## Development
```bash
npm run dev                          # http://localhost:5173 (with Motion Studio panel)
MOTION_STUDIO=off npm run dev        # without Motion Studio
VITE_SUPABASE_URL= npm run dev       # force browser-only mode
npx tsc --noEmit -p tsconfig.app.json
```

## Database setup
Supabase SQL editor → run `supabase/schema.sql` (idempotent; already includes migrations 002 and 003).
Make an admin: `insert into public.admins (user_id) select id from auth.users where email = '<your email>';`
Then open `/admin` and **Publish** once. Details: [docs/DATABASE.md](docs/DATABASE.md).

## Build
```bash
npm run build      # tsc -b && vite build && node scripts/postbuild.mjs (no Motion Studio in dist, 404.html)
npm run preview    # serve dist locally
```

## Deployment
Push to `main` → `.github/workflows/deploy.yml` builds (with `BASE_PATH` and the `VITE_SUPABASE_*` repository
variables) and deploys to GitHub Pages. Content changes need no deploy — publish them in `/admin`.
See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Troubleshooting
Blank page (BASE_PATH), deep links returning 404 (expected on Pages), "Invalid API key", tables not found,
reviews rejected (migration 003), paused Supabase project, wrong GitHub account on push, and more:
[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

## Project structure
```text
src/content/     content types + seed content        src/admin/       admin studio (lazy chunk)
src/data/        DataStore → Supabase / localStorage  src/pages/       learner pages
src/state/       content, auth, learner, theme        src/components/  UI kit, blocks, widgets, shell
src/lib/         progress, content, theme, covers     supabase/        schema + migrations
tools/e2e/       browser tests                        docs/            documentation
```
Full annotated tree: [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md).

## Important configuration
`vite.config.ts` (base path, Motion Studio dev plugin) · `scripts/postbuild.mjs` · `.github/workflows/deploy.yml`
· `supabase/schema.sql` · `src/content/types.ts` (content contract) · `src/data/index.ts` (backend switch).

## Known limitations
Learner progress is per browser · migrations 002/003 pending on production · no booking link configured yet ·
minimal SEO tags · analytics are anonymous counts · PPT files are attached, not converted to slides.
See [docs/MASTER_SPECIFICATION.md](docs/MASTER_SPECIFICATION.md#current-state) and [docs/TECHNICAL_DEBT.md](docs/TECHNICAL_DEBT.md).

## Future development
Recommendations in [docs/FUTURE_ROADMAP.md](docs/FUTURE_ROADMAP.md). History: [CHANGELOG.md](CHANGELOG.md),
[docs/DEVELOPMENT_HISTORY.md](docs/DEVELOPMENT_HISTORY.md).
