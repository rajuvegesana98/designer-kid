# Session history — how Designer Kid was built (30 Sep 2026)

A chronological record of the single build session, including decisions, problems found and how they were
fixed. Useful for anyone (human or AI) picking the project up later.

## Phase 1 — Setup & decisions
- Created `designer-kid/` next to other projects in `~/Downloads/MST`. Scaffolded **Vite + React + TypeScript**
  with npm (Node 24.11 on the machine; Motion Studio needs ≥ 22.13).
- Installed `motion` 13.4.6 (≥ 13.3.0 required), `react-router`, `lucide-react`, `@supabase/supabase-js`,
  and `motion-studio` 2.1.0 as a dev dependency (Vite plugin per motion.dev/docs/studio).
- Owner chose **GitHub free plan** hosting and **Supabase free tier**; 1:1 = external booking link.
- Recommended GitHub Marketplace tooling: only GitHub's official Pages actions (`configure-pages`,
  `upload-pages-artifact`, `deploy-pages`) — a Git-based CMS was unnecessary because Supabase gives instant
  publishing with one login.

## Phase 2 — Architecture & content
- Designed one typed **`SiteContent`** document (Level → Course → Module → Lesson + collections) so the admin
  edits everything without code changes (brief §41).
- Built a **`DataStore`** interface with two implementations: Supabase and browser-only (localStorage) — the
  app works with no backend and switches automatically when env vars exist.
- **Content authored by parallel sub-agents** against a shared brief (British English, honest, no fake stats):
  Beginner 79 lessons (incl. 4 projects), Intermediate 62, Expert 41 = **182 lessons**; 21 challenges,
  28 resources, 18 career guides, 15 achievements.
- Design system: "Figma canvas" identity — dotted canvas background, **selection-frame motif** with corner
  handles and layer labels, Bricolage Grotesque + Instrument Sans, CSS-variable tokens for runtime theming.
- Contrast checked numerically; level colours darkened to pass WCAG AA.

## Phase 3 — Student app & admin studio
- Student: landing, onboarding (level cards), dashboard ("Continue learning"), roadmap, module and lesson pages
  (Learn → Example → Practice → Challenge), 7 interactive widgets (contrast checker, spacing scale, type scale,
  visual hierarchy, Auto Layout, grid, button states), challenges with submission + self-review, Career Centre
  with bullet/headline builders and case-study template, resources, progress/achievements/bookmarks/notes,
  search (⌘K), notifications, dark mode, mobile bottom nav.
- Admin: dashboard & analytics, courses tree with drag-and-drop, lesson editor, levels, challenges, content
  library (resources, career guides, announcements, notifications), website (home/nav/footer), theme editor
  with live preview + contrast checks, media library, users, 1:1 settings, publishing history/restore, backup.
- **Draft → Preview → Publish**: draft autosaves; Preview opens the real site with `?preview=1` and updates
  live via `localStorage` events; Publish stores a version.
- Supabase `schema.sql` with RLS: admins table + `is_admin()`, profiles, site_content (draft/published),
  content_history, `publish_content()` RPC, events, submissions, media bucket.
- GitHub Pages workflow; `scripts/postbuild.mjs` fails the build if Motion Studio code leaks and copies
  `404.html` for deep links. Verified: Studio loads in dev and shows an animation in its timeline; absent in
  production.

### Bugs found by automated browser testing (Playwright + local Chrome) and fixed
- Search palette re-opened after pressing Enter (focus returned to the trigger button) → `preventDefault`.
- Challenge submission sent stale data → pass link/notes directly.
- Debounced admin fields could overwrite sibling edits → commit through a ref to the latest callback.
- Drag-reorder broke because drafts are cloned on every edit → stable string keys, commit on drag end.
- Derived colour tokens didn't update in scoped overrides → re-declare them on `[style*='--c-']`.
- Admin course tree too cramped → flattened tree + "focus mode" for the slide editor.

## Phase 4 — Owner requests round 2
- **No locking**: `moduleLock` never locks; "Suggest an order" shows a gentle hint.
- **PowerPoint-style slide editor** (`admin/SlideEditor.tsx`): thumbnail rail, click-to-edit canvas, format
  panel, ribbon (insert 15 block types, arrange, undo/redo, preview, PDF), keyboard shortcuts.
- **PDF/PPT uploads** (attachments + inline embed), **Download PDF** for lessons, modules (workbooks), guides.
- **28 themed illustrations** (`components/illustrationLibrary.tsx`) + automatic lesson covers (`lib/covers.ts`).
- New career content: interview Q&A (44 questions across 3 levels), LinkedIn do's & don'ts, resume creation
  guides (6 guides).
- **Reviews** about Harikrishna with admin moderation (approve/hide/feature/reply/delete); DB trigger enforces
  approval.
- Near-miss: macOS case-insensitivity — an agent almost wrote `illustrations.tsx` over `Illustrations.tsx`;
  redirected to `illustrationLibrary.tsx`.

## Phase 5 — Going live
- GitHub CLI signed in via device code (Safari); repo **rajuvegesana98/designer-kid** created (public), Pages
  enabled with build type "workflow", repository variables `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` set.
- Supabase: first project `ywbiyutmrwmjnbllyzxd` was set up, then the owner created **`zcxnlelzhkwbvittgcuj`**
  (current). Schema run by the owner in the SQL editor; verified via REST (tables, RLS, publish blocked for
  anonymous users). Owner made `rajuvegesana98@gmail.com` admin and published → 182 lessons + 27 guides in DB.

## Phase 6 — Owner requests round 3
- **Offers & banners** (bar or pop-up, schedule, audience, pages, dismissal memory, live preview).
- **Blog** (slide-editor articles, tags, featured, search, share, PDF) with 5 + 7 = **12 articles**.
- **Theme presets** (6) and live logo/favicon preview.
- Accounts + password reset + admin user management were built, then **learner accounts were removed at the
  owner's request** (open learning, browser storage). Kept: admin sign-in, admin password reset, progress
  backup/restore for learners, anonymous reviews.
- Found & fixed: **Publish dialog clipped inside the admin top bar** (`backdrop-filter` creates a containing
  block) → Modal/Sheet now portal to `<body>`; browser-only mode ran out of localStorage with many versions →
  keep as many as fit.

## Final state (end of session)
- Commits: see `git log` (4+ commits on `main`), all deployed.
- Test suites (tools/e2e): 34 checks across 4 suites passing, no console errors.
- **Pending owner actions**: run `supabase/migrations/002_user_management.sql` and `003_open_learning.sql` in
  the Supabase SQL editor (adds suspend column/admin policies and anonymous reviews + Blog menu item);
  set the 1:1 booking link, photo, logo, footer email in Admin and Publish.
