# AGENTS.md — guide for AI coding agents (Claude, Cursor, Codex…) and developers

Read this first. It tells you how Designer Kid is built, what must not break, and how to change it safely.
Deeper docs live in [`docs/`](docs) — start with [`docs/README.md`](docs/README.md).

## What this is

**Designer Kid** ("Learn. Design. Build. Grow.") — a UI/UX learning & career platform with three levels
(Beginner / Intermediate / Expert), a Career Centre, challenges, a blog, reviews, a 1:1 booking link and a
full **admin studio** where the owner (Harikrishna) edits every piece of content with Draft → Preview → Publish.

- Live: https://rajuvegesana98.github.io/designer-kid/  ·  Admin: `/admin`
- Repo: https://github.com/rajuvegesana98/designer-kid (push to `main` → GitHub Actions deploys to Pages)
- Backend: Supabase project `zcxnlelzhkwbvittgcuj` (content, admin auth, reviews, media, analytics events)

## Product rules (decided with the owner — don't reverse without asking)

1. **Learners have no accounts.** Progress, notes, bookmarks, checklists live in the learner's browser
   (`localStorage` key `dk.learner.guest`) with a download/restore backup on the Profile page.
   Only admins sign in (Supabase Auth). Sign-up code still exists in the data layer but is not linked in the UI.
2. **All content is always open.** No locked modules. `Level.sequential` only shows a "suggested after…" hint.
3. **Nothing an admin edits is live until Publish.** Admin edits a *draft* document; Publish writes it to
   `site_content.published` and stores a version in `content_history`.
4. **1:1 sessions use an external booking link** (Calendly/Cal.com/Topmate) set in Admin → 1:1 Connect.
5. **Honest content**: no fake statistics, testimonials or job/salary promises. British English.
6. Accessibility: WCAG AA contrast, keyboard access, visible focus, reduced-motion respected.

## Stack

Vite 8 · React 19 · TypeScript 6 · React Router 8 (BrowserRouter with `basename`) · Motion 13 (`motion/react`)
· lucide-react · @supabase/supabase-js 2 · plain CSS design system (`src/styles/global.css`, CSS variables).
Dev only: `motion-studio` (Vite plugin; never in production — `scripts/postbuild.mjs` enforces it).

## Commands

```bash
npm install
npm run dev                         # http://localhost:5173 (+ Motion Studio panel)
MOTION_STUDIO=off npm run dev       # without Motion Studio (use for automated browser tests)
VITE_SUPABASE_URL= npm run dev      # force browser-only mode (no Supabase) for safe testing
npx tsc --noEmit -p tsconfig.app.json   # typecheck (must be clean)
npm run build                       # tsc + vite build + postbuild checks (no Studio in dist, 404.html copy)
```

## Architecture in one screen

```
SiteContent (one JSON document, typed in src/content/types.ts)
  brand · theme · home · navigation · footer · mentor · reviews(settings) · notifications
  levels[] → courses[] → modules[] → lessons[] (learn/example blocks, practice, challenge, cover, attachments)
  challenges[] · resources[] · careerGuides[] · announcements[] · achievements[] · promos[] · blog[]

Data layer: src/data/types.ts → DataStore interface
  supabaseStore.ts  (used when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set)
  localStore.ts     (browser-only fallback: everything in localStorage)

State: src/state/content.tsx (published or ?preview=1 draft, withDefaults backfill)
       src/state/auth.tsx (admin auth, password reset) · learner.tsx (browser progress) · ui.tsx (theme, toasts)
Student UI: src/pages/* + src/components/*
Admin UI:   src/admin/* (lazy-loaded chunk). admin/state.tsx = draft, autosave, preview, publish, versions.
Seed content: src/content/seed/* (used when nothing is published yet, and to backfill missing sections)
```

## How to change things safely

- **Add a field to content**: extend the type in `src/content/types.ts`, give it a default in
  `src/content/seed/index.ts`, and if it's a new *top-level* section also add its key to the list in
  `withDefaults()` (`src/state/content.tsx`) and a label in `SECTION_LABELS` (`src/admin/state.tsx`) so
  the publish diff notices it. Old published documents get the default automatically.
- **Add a lesson block type**: add it to the `Block` union, render it in `components/Blocks.tsx`
  (`BlockView`, and handle `PrintMode`), add `emptyBlock` + `blockSummary` + `BlockForm` cases in
  `admin/BlocksEditor.tsx`, add an `INSERT` entry (and optional inline `CanvasBlock` case) in `admin/SlideEditor.tsx`.
- **Admin edits** always go through `useAdmin().update(recipe)` (structuredClone + mutate). Text inputs use the
  debounced fields in `admin/fields.tsx` (they commit via a ref to the latest callback — keep that pattern).
- **Dialogs** must use `Modal`/`Sheet` from `components/ui.tsx` (portalled to `<body>`; parents with
  `backdrop-filter` would otherwise clip them — this bug happened once).
- **Supabase schema** changes: add an idempotent file in `supabase/migrations/` *and* append it to
  `supabase/schema.sql`. The owner runs SQL manually in the Supabase SQL editor (no CLI/service key here).
- **Never** put the Supabase secret/service_role key in this app. Only the publishable key.
- **macOS is case-insensitive**: `Illustrations.tsx` (level/hero art) and `illustrationLibrary.tsx` (28 topic
  illustrations) are different files — never create `illustrations.tsx`.
- After changes: typecheck, `npm run build`, run the browser tests in `tools/e2e` (see docs/TESTING.md),
  commit, `git push` → Actions deploys (~1–2 min). Content changes need **no** deploy — admin publishes them.

## Gotchas

- `scripts/postbuild.mjs` writes an `index.html` copy per known route (from the seed files) so deep links return 200;
  routes added later in the admin fall back to `404.html` (HTTP 404 but the app still renders). With `SITE_URL` set
  (the deploy workflow sets it) it also adds OG/canonical tags, `robots.txt` and `sitemap.xml`.
- Page titles: call `usePageTitle(title)` (`src/lib/usePageTitle.ts`) in a page; the theme provider only sets the
  default title when no page owns it.
- Small content defaults (reviews settings, notifications, promos) live in `src/content/defaults.ts` so
  `withDefaults` doesn't import the big seed. Keep new small sections there.
- The app is wrapped in `components/ErrorBoundary.tsx` (recovery screen instead of a blank page).
- Supabase free projects pause after ~1 week without traffic; built-in auth email is limited to ~2/hour
  (only matters for admin password resets now).
- Browser-only mode keeps only as many published versions as fit in ~5 MB of localStorage.
- `gh` on the owner's Mac may have two GitHub accounts; pushes must use **rajuvegesana98**
  (`gh auth switch -h github.com -u rajuvegesana98`).
