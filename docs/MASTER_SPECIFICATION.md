# MASTER PROJECT SPECIFICATION — Designer Kid

The complete technical identity of the project in one place, plus the **final audit report** and the
**START HERE** reading order. Every item links to the detailed document that proves it.

Last verified: 30 Sep 2026 (docs v2.0) · Evidence labels: **Confirmed** (code/config or verified at hand-off),
**Inferred**, **Unknown**.

---

## START HERE — reading order

| # | Read | Why |
|---|---|---|
| 1 | [MASTER_SPECIFICATION.md](MASTER_SPECIFICATION.md) (this file) | Whole project on one page + what's broken + what to do first |
| 2 | [../AGENTS.md](../AGENTS.md) | Rules and safe-change recipes for developers and AI agents |
| 3 | [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | File tree, routes, stack, versions, startup and build |
| 4 | [ARCHITECTURE.md](ARCHITECTURE.md) | How data, auth, preview, publish, uploads and PDFs flow |
| 5 | [INSTALLATION.md](INSTALLATION.md) → [ENVIRONMENT.md](ENVIRONMENT.md) | Get it running on a clean machine |
| 6 | [DATABASE.md](DATABASE.md) → [API.md](API.md) → [INTEGRATIONS.md](INTEGRATIONS.md) | Data model, data API surface, external services |
| 7 | [FEATURES.md](FEATURES.md) → [USER_FLOWS.md](USER_FLOWS.md) → [ADMIN.md](ADMIN.md) | What exists and its real status |
| 8 | [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) → [SEO_ACCESSIBILITY.md](SEO_ACCESSIBILITY.md) → [PERFORMANCE.md](PERFORMANCE.md) | UI, animation, responsive, a11y, speed |
| 9 | [DEPLOYMENT.md](DEPLOYMENT.md) → [MIGRATION.md](MIGRATION.md) → [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Ship it, move it, fix it |
| 10 | [SECURITY.md](SECURITY.md) → [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) → [FUTURE_ROADMAP.md](FUTURE_ROADMAP.md) | Risks, debt, plan |
| 11 | [DEVELOPMENT_HISTORY.md](DEVELOPMENT_HISTORY.md) · [ORIGINAL_BRIEF.md](ORIGINAL_BRIEF.md) · [SESSION_HISTORY.md](SESSION_HISTORY.md) · [../CHANGELOG.md](../CHANGELOG.md) | Why things are the way they are |

Also kept from docs v1: [ADMIN_GUIDE.md](ADMIN_GUIDE.md) (owner quick guide), [OPERATIONS.md](OPERATIONS.md),
[TESTING.md](TESTING.md), [NEXT_STEPS.md](NEXT_STEPS.md).

---

## Specification

```text
PROJECT NAME:     Designer Kid ("Learn. Design. Build. Grow.")
PURPOSE:          UI/UX learning & career platform for Beginner / Intermediate / Expert designers, owned and
                  curated by Harikrishna; learners study for free without accounts, the owner edits all content
                  in an admin studio.
CURRENT VERSION:  package.json 0.0.0 (never bumped) · git HEAD on main (6+ commits, 30 Sep 2026) · docs v2.0
STATUS:           Live in production; core learning experience complete; migrations 002/003 pending on the
                  live database (anonymous reviews + some admin user controls fail until applied).

FRONTEND:         React 19.2 SPA, TypeScript 6, Vite 8, React Router 8 (BrowserRouter + basename),
                  Motion 13 (motion/react), lucide-react icons, plain CSS design system with CSS variables
                  (src/styles/global.css), React Context for state. No UI kit, no form library.
BACKEND:          None of its own. Supabase as backend-as-a-service (Postgres + Row Level Security,
                  PostgREST, RPC, Auth, Storage) accessed directly from the browser with supabase-js 2.
DATABASE:         Supabase Postgres, 7 tables (admins, profiles, site_content, content_history, events,
                  submissions, reviews) + storage bucket "media"; functions is_admin, publish_content,
                  handle_new_user, review_defaults, protect_profile (002). See DATABASE.md.
ORM:              None (supabase-js query builder).
LANGUAGES:        TypeScript/TSX (app), CSS, SQL (Supabase), HTML (index.html), JavaScript .mjs
                  (postbuild + tests), JSON, YAML (GitHub Actions), Markdown (docs).
PACKAGE MANAGER:  npm (package-lock.json).
BUILD TOOL:       Vite 8 (tsc -b && vite build && node scripts/postbuild.mjs).
HOSTING:          GitHub Pages via GitHub Actions (.github/workflows/deploy.yml), repo
                  rajuvegesana98/designer-kid (public), base path /designer-kid/.
DOMAIN:           None — https://rajuvegesana98.github.io/designer-kid/ (HTTPS by GitHub).
AUTHENTICATION:   Admin-only, Supabase Auth email + password (implicit flow), password reset by email
                  (/reset-password), change password in Admin → Settings, show/hide password toggle.
                  Learners: none (browser localStorage). Sign-up code dormant.
AUTHORIZATION:    Postgres RLS + public.admins table + is_admin(); publish only via publish_content() RPC.
STORAGE:          Supabase Storage bucket "media" (public read, admin write); learner data in the browser.
THIRD-PARTY:      Supabase, GitHub (repo/Actions/Pages), Google Fonts, Office Online viewer (PPT embeds),
                  YouTube-nocookie / Vimeo embeds, external booking link (not configured), mailto fallback,
                  Motion Studio (dev only). No payments, email service, analytics SaaS, AI APIs or maps.

ENVIRONMENT VARIABLES:
  VITE_SUPABASE_URL        optional (browser-only mode without it) · build-time, public
  VITE_SUPABASE_ANON_KEY   optional · Supabase publishable key · build-time, public
  BASE_PATH                build-time · set by the deploy workflow
  MOTION_STUDIO            dev only · "off" disables the Studio plugin
  MOTION_STUDIO_AGENT_PROVIDER dev only · Motion Studio agent provider
  (GitHub Actions variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)          → ENVIRONMENT.md

KEY FEATURES:     Onboarding by level · personalised dashboard · 182 lessons (Learn → Example → Practice →
                  Challenge) · 7 interactive widgets · 28 illustrations · all content open · 21 challenges ·
                  Career Centre (27 guides incl. 44 interview Q&As, resume/LinkedIn builders) · 12-article
                  blog · 28 resources · reviews · 1:1 booking panel · offers (bar/pop-up) · notes, bookmarks,
                  streaks, 15 achievements · search · notifications · PDF downloads · dark mode · responsive ·
                  progress backup/restore.                                        → FEATURES.md
ADMIN FEATURES:   Draft → Preview → Publish with versions/restore · PowerPoint-style slide editor ·
                  courses/modules/lessons · blog · challenges · resources/guides/announcements · levels ·
                  media (images, PDF, PPT) · reviews moderation · offers & banners · website (home/nav/footer)
                  · theme editor + presets · analytics · users/admins · 1:1 settings · JSON backup ·
                  admin password change.                                          → ADMIN.md
USER FLOWS:       first visit → level → dashboard → lesson loop; search; challenges; career; blog; reviews;
                  1:1; offers; PDF; backup/restore; admin sign-in/reset; edit → preview → publish. → USER_FLOWS.md
API:              No custom endpoints. DataStore interface → Supabase REST/RPC/Auth/Storage or localStorage.
                                                                                  → API.md
DATABASE:         see DATABASE.md (schema, RLS, triggers, JSON document shapes, migrations 002/003 pending).
DESIGN SYSTEM:    Bricolage Grotesque + Instrument Sans (14 selectable fonts), runtime CSS-variable theme
                  (light/dark), "Figma canvas" dot grid + selection-frame motif, token radii/shadows/borders,
                  component catalogue.                                            → DESIGN_SYSTEM.md
ANIMATIONS:       Motion (page fade, modal/sheet/toast, layoutId pills, reveal-on-scroll, progress,
                  hover/tap), CSS transitions; MotionConfig reducedMotion="user" + CSS reduced-motion rule.
SECURITY:         RLS everywhere, admin table, server-checked publish; risks: anonymous event/review inserts
                  without rate limiting, possible open sign-ups, admin session in localStorage, no CSP,
                  public bucket.                                                   → SECURITY.md
DEPLOYMENT:       push main → Actions (npm ci, build with BASE_PATH + VITE_* vars) → Pages; DB changes by
                  hand in the Supabase SQL editor; content by admin Publish (no deploy). → DEPLOYMENT.md
KNOWN ISSUES:     migrations 002/003 not applied; seed chunk loads on every visit until one republish;
                  no booking link; Blog missing from live menu; deep links return HTTP 404 (served by
                  404.html); SEO minimal; analytics approximate; image picker doesn't resize.
TECHNICAL DEBT:   25 items (P0: migrations, Auth URL/SMTP) → TECHNICAL_DEBT.md
FUTURE SCOPE:     6-phase roadmap (recommendations)                               → FUTURE_ROADMAP.md
```

---

## Current state

| | Items |
|---|---|
| **Working (Confirmed)** | Learner site end to end (onboarding, dashboard, lessons, widgets, challenges, Career Centre, blog, resources, progress, search, notifications, PDFs, dark mode, responsive); admin sign-in, forgot/reset link page, show/hide password; content editing + preview + publish + versions; offers; theme; media; reviews moderation (for reviews that exist); 34 browser checks passing; live smoke test passing |
| **Partially working** | 1:1 (panel shows "Booking opens soon" — no link set) · Blog (works, but not in the live menu) · analytics (anonymous, capped at latest 1000 events) · PPT preview (needs public URL) · PDF (browser print dialog) · Motion Studio (loads in dev; timing edit not verified) |
| **Broken on production** | Anonymous reviews rejected (needs 003) · suspend / make-admin / edit-other-profile (needs 002) |
| **Missing** | Custom domain, SEO tags/sitemap/robots, CI tests, error monitoring, rate limiting, achievements editor, cross-device learner sync, UI/UX Pro Max review |
| **Unknown** | Supabase Auth Site URL/redirects, SMTP, whether sign-ups are enabled, password policy, backups on the plan, real-user performance metrics |

---

# FINAL AUDIT REPORT

## Documentation coverage
| Area | Coverage |
|---|---|
| Inventory, stack, versions, routes, languages | Fully documented |
| Architecture & data flows | Fully documented |
| Installation, environment, migration, portability, backup | Fully documented (platform settings Unknown) |
| Database, API surface, integrations | Fully documented (live migration state verified; Auth settings Unknown) |
| Features, user flows, admin | Fully documented with honest statuses |
| Design system, animation, responsive | Fully documented |
| Security, performance, SEO/accessibility | Partially documented — static analysis + measured bundles; no penetration test, Lighthouse or screen-reader run |
| Development history & AI context | Fully documented from git + in-repo docs; conversation-only details marked Unavailable |
| Deployment & troubleshooting | Fully documented |

## What another developer needs immediately
1. Access to the GitHub repo `rajuvegesana98/designer-kid` (or the hand-off zip / git bundle).
2. Node ≥ 22.22 and npm; then `npm ci` and `npm run dev` (works in browser-only mode with no credentials).
3. For production work: the Supabase project URL + publishable key, and admin credentials from the owner.

## What credentials they need
- Supabase publishable key (browser-safe) — for `.env.local` and GitHub variables.
- Supabase dashboard access (owner invites them) — for SQL, Auth settings, Storage, backups.
- GitHub push access (collaborator on the repo).
- An admin login for `/admin` (owner adds them to `public.admins`).
- Never needed in the app: the Supabase service_role/secret key.

## What services they need access to
Supabase project `zcxnlelzhkwbvittgcuj` · GitHub (repo, Actions, Pages settings) · optionally a domain registrar
and an SMTP provider (e.g. Resend) if those are added.

## What files are critical
`src/content/types.ts` (content contract) · `src/data/*` (data layer) · `src/state/content.tsx`
(`withDefaults`) · `src/admin/state.tsx` (draft/publish) · `supabase/schema.sql` + `supabase/migrations/*` ·
`.github/workflows/deploy.yml` · `vite.config.ts` · `scripts/postbuild.mjs` · `src/content/seed/*` ·
`package-lock.json` · `AGENTS.md` + `docs/`.

## What could break during migration
- Wrong Node version (react-router needs ≥ 22.22).
- Missing/wrong `VITE_SUPABASE_*` → site silently shows bundled seed content instead of published content.
- `BASE_PATH` mismatch → blank page on GitHub Pages.
- Moving to a new Supabase project → media URLs inside content point at the old project; admins table empty.
- Project path containing spaces or Windows paths → `scripts/postbuild.mjs` may fail (Inferred).
- Learners' progress cannot migrate (it lives in their browsers).

## What should be fixed first
1. Run `002_user_management.sql`, then `003_open_learning.sql`, in the Supabase SQL editor.
2. Verify Supabase Auth → URL Configuration (Site URL + redirects) and consider custom SMTP.
3. Disable public sign-ups in Supabase Auth (learners don't use accounts).
4. In Admin: set the booking link, add Blog to the menu, then **Publish once** (also stops the seed chunk
   loading on every visit).
5. Add rate limiting / abuse protection for anonymous `events` and `reviews` inserts.

## What should never be deleted
The `site_content` rows (`published`, `draft`) · `content_history` · `public.admins` · the `media` bucket ·
`supabase/schema.sql` + migrations · `src/content/types.ts` · `src/content/seed/*` · `.github/workflows/deploy.yml`
· `scripts/postbuild.mjs` · `package-lock.json` · `AGENTS.md` and `docs/`.

## What needs backup
Git repo (GitHub + bundle) · Supabase database (Admin → Publishing → Download JSON, plus pg_dump / Supabase
backups) · Storage bucket files · GitHub Actions variables and Pages settings · Supabase Auth settings · DNS if a
domain is added. Learners should use Profile → Download my progress.

## What needs monitoring
GitHub Actions deploy results · Supabase project pause state (free tier pauses after ~1 week idle) · storage use
vs 1 GB free limit · database size vs 500 MB · `events` and `reviews` volume (spam) · `content_history` growth ·
pending reviews queue · auth email limits.

## What should be built next
See [FUTURE_ROADMAP.md](FUTURE_ROADMAP.md): stabilisation (migrations, auth settings, rate limiting, error
boundary, CI tests) → product completion (booking link, achievements editor, cross-device progress code) →
UX/SEO (meta/OG tags, sitemap, per-page titles, a11y gaps) → performance (split Supabase realtime, seed
loading, fonts) → scale (content document split, history retention) → advanced (certificates, email
notifications, custom domain).

## Cross-check note
Every document in this set was written from the repository files and hand-off verifications on 30 Sep 2026.
Statements that could not be verified are marked **Unknown**; the Supabase and GitHub dashboard settings are
the main unverifiable areas. No secret values are included; the Supabase publishable key and the owner's email
were removed from the v1 docs (they remain in git history — the key is browser-safe by design).
