# Troubleshooting

Known problems for Designer Kid, each as **Problem / Possible cause / Solution**. Every entry comes from the code, config or
hand-off facts: where a cause is reasoned rather than observed it is marked **Inferred**. Supabase error texts are
passed through to the UI unchanged by `fail()` in `src/data/supabaseStore.ts:28`, so the exact message you see usually
names the cause.

> **Status legend** — **Confirmed**: seen in code/config or verified at hand-off. **Inferred**: reasoned from code (reason given).
> **Unknown**: cannot be verified from the repository — the text says what to check.

Last verified: 30 Sep 2026 (docs v2.0)

Related: [INSTALLATION.md](INSTALLATION.md) · [ENVIRONMENT.md](ENVIRONMENT.md) · [DEPLOYMENT.md](DEPLOYMENT.md) · [MIGRATION.md](MIGRATION.md)

A useful first move for any "the live site shows the wrong content" problem: open DevTools → Console. If live content
cannot load, the app logs the error and the warning *"Showing bundled content because the live content could not be
loaded"* and renders the bundled seed instead (`src/state/content.tsx:59-67,89`) — so a broken backend looks like **old
content**, not a blank page.

---

## Install and build

### Node too old

| | |
|---|---|
| Problem | `npm ci` prints `EBADENGINE` warnings; `npm run dev` or `npm run build` crashes (syntax/API errors from Vite, rolldown or motion-studio) |
| Possible cause | Node below the strictest requirement: `react-router` 8.4.0 needs `>=22.22.0`; `motion-studio` `>=22.13.0`; `@supabase/supabase-js` `>=22.0.0`; `vite` `^20.19.0 \|\| >=22.12.0` (**Confirmed** from installed `package.json` files) |
| Solution | Install Node 24 LTS (or ≥ 22.22.0), `rm -rf node_modules && npm ci`. The CI workflow uses `node-version: 22` (latest 22.x) |

### `npm ci` refuses to run

| | |
|---|---|
| Problem | `npm ci` fails with "package.json and package-lock.json … are not in sync" |
| Possible cause | Someone edited `package.json` without updating the lockfile |
| Solution | `npm install`, commit the updated `package-lock.json`. CI (`deploy.yml`) will fail the same way until it is fixed |

### Build fails: "Motion Studio code found in production build"

| | |
|---|---|
| Problem | `npm run build` ends with `✗ Motion Studio code found in production build:` and a file list |
| Possible cause | Studio code (strings `motion-studio`, `motionStudio`, `__MOTION_STUDIO`) was imported from app code in `src/` — the plugin itself is only added for `vite serve` (`vite.config.ts:11`) |
| Solution | Remove the import from `src/`; Motion Studio must stay a dev-server plugin only. Do not weaken `scripts/postbuild.mjs` |

### Build fails in postbuild with ENOENT on `dist/`

| | |
|---|---|
| Problem | `vite build` succeeds but `node scripts/postbuild.mjs` throws `ENOENT … /dist/` |
| Possible cause | **Inferred**: the script uses `new URL('../dist/', import.meta.url).pathname`, which percent-encodes spaces (`My Projects` → `My%20Projects`) and yields `/C:/…` on Windows |
| Solution | Move the project to a path without spaces; on Windows use WSL2. (A code fix would be `fileURLToPath` — only if the owner asks for code changes) |

### Type errors stop the build

| | |
|---|---|
| Problem | `npm run build` stops before `vite build` |
| Possible cause | `tsc -b` runs first (`package.json` "build"); `tsconfig.app.json` has `noUnusedLocals`/`noUnusedParameters` |
| Solution | `npx tsc --noEmit -p tsconfig.app.json`, fix every error, rebuild |

### Case-insensitive filename trap

| | |
|---|---|
| Problem | Imports resolve on the Mac but break on Linux/CI, or a file seems to "overwrite" another |
| Possible cause | `src/components/Illustrations.tsx` (level/hero art) and `src/components/illustrationLibrary.tsx` (topic illustrations) are different files. macOS/Windows file systems are case-insensitive (this repo has `core.ignorecase=true`), Linux (the CI runner) is case-sensitive |
| Solution | Never create `illustrations.tsx`; match import casing exactly. To rename only by case use `git mv Old.tsx tmp.tsx && git mv tmp.tsx old.tsx` |

---

## Local development

### Motion Studio panel covering the page

| | |
|---|---|
| Problem | In `npm run dev`, a Motion Studio panel/overlay sits over the student pages or interferes with clicks/screenshots |
| Possible cause | `motionStudio()` is active for `vite serve` unless `MOTION_STUDIO=off` (`vite.config.ts:11`); it is excluded from `/admin` paths (`excludePaths: [/^\/admin/]`) |
| Solution | `MOTION_STUDIO=off npm run dev` (PowerShell: `$env:MOTION_STUDIO='off'; npm run dev`). Putting it in `.env.local` does **not** work — the config reads `process.env` only |

### I want to test without touching the live database

| | |
|---|---|
| Problem | Dev server writes drafts/events to the real Supabase project |
| Possible cause | `.env.local` contains the live URL + key, so `src/data/index.ts` chooses the Supabase store |
| Solution | `VITE_SUPABASE_URL= npm run dev` → browser-only mode; admin via "Open admin for this browser" |

### Sign-in says "Accounts need Supabase…"

| | |
|---|---|
| Problem | Admin sign-in shows "Accounts need Supabase. Until it is connected, use 'Open admin for this browser'." |
| Possible cause | Browser-only mode: one or both `VITE_SUPABASE_*` values are empty (`src/data/localStore.ts:81-83`) — including on a deployed site whose GitHub variables are missing |
| Solution | Fill `.env.local` and restart `npm run dev` (Vite reads env files only at start-up); for the live site, set the GitHub Actions variables and re-run the workflow |

### "This browser ran out of local storage space…"

| | |
|---|---|
| Problem | In browser-only mode, saving/publishing/uploading fails with that message, or older versions disappear |
| Possible cause | Everything (content, draft, up to 5 versions, media as data URLs) lives in `localStorage` (~5 MB per origin). Media must be < 1.5 MB each ("In browser-only mode files must be under 1.5 MB.") (`src/data/localStore.ts:33-34,57-63,113-125,236`) |
| Solution | Delete media or clear `dk.content.versions`/`dk.media` in DevTools → Application → Local Storage; better, connect Supabase |

### Preview not updating

| | |
|---|---|
| Problem | Admin → Preview draft shows old content, or edits don't appear in the preview tab |
| Possible cause | The draft is passed to the preview through `localStorage` key `dk.preview.content` and the `storage` event (`src/admin/state.tsx:53-59,172-177`, `src/state/content.tsx:73-85`). It only works in the **same browser and origin**; opening the `?preview=1` URL in another browser/profile/device shows published content. Private windows with blocked storage also fail silently |
| Solution | Use "Preview draft" from the admin in the same browser; wait ~0.25 s after typing; reload the preview tab |

### Deep links 404 in `vite preview` but not in dev

| | |
|---|---|
| Problem | Blank page / 404s on `npm run preview` |
| Possible cause | Built with one `BASE_PATH`, previewed with another (both read from `vite.config.ts`) |
| Solution | Use the same value for both, e.g. `BASE_PATH=/designer-kid/ npm run build && BASE_PATH=/designer-kid/ npm run preview` → `http://localhost:4173/designer-kid/` |

---

## Deployed site (GitHub Pages)

### Blank page after deploy

| | |
|---|---|
| Problem | White page; console shows 404 for `/assets/index-*.js` or router renders nothing |
| Possible cause | Wrong `BASE_PATH`: a build with `/` served from `/designer-kid/` (or vice versa). `vite.config.ts:10` + router `basename` (`src/App.tsx:90`) |
| Solution | Let the workflow set it (`${{ steps.pages.outputs.base_path }}/`); for manual builds use `BASE_PATH=/designer-kid/`. After adding/removing a custom domain, re-run the workflow |

### Deep link returns HTTP 404

| | |
|---|---|
| Problem | Monitoring/curl shows `404` for `/designer-kid/lesson/…`, yet the page works in a browser |
| Possible cause | Expected: Pages has no rewrites and serves `404.html` (a copy of `index.html` made by `scripts/postbuild.mjs`) with status 404 |
| Solution | Nothing to fix. If `404.html` is missing (postbuild didn't run), deep links show GitHub's 404 page — rebuild with `npm run build` |

### Changes not visible after push

| | |
|---|---|
| Problem | Code pushed, site unchanged |
| Possible cause | Workflow failed or was cancelled by a newer push (`concurrency: cancel-in-progress`); browser cache |
| Solution | `gh run list --repo rajuvegesana98/designer-kid --limit 3`, open the run log; hard-refresh. Content edits need an admin **Publish**, not a push |

### Push rejected with 403

| | |
|---|---|
| Problem | `git push` → `Permission to rajuvegesana98/designer-kid.git denied to <other-user>` (403) |
| Possible cause | `gh`/credential helper has a different GitHub account active (the owner's Mac has two — `AGENTS.md`) |
| Solution | `gh auth status`; `gh auth switch -h github.com -u rajuvegesana98`; `gh auth setup-git`; push again |

---

## Supabase

### Live site shows old/starter content; admin can't sign in (project paused)

| | |
|---|---|
| Problem | Site loads but shows bundled seed content; console has network errors to `*.supabase.co`; admin sign-in fails |
| Possible cause | Free Supabase projects pause after ~1 week of inactivity (confirmed on supabase.com at hand-off) |
| Solution | Supabase dashboard → project → **Restore project**. Consider the Pro plan (no pausing) or regular traffic |

### "Invalid API key"

| | |
|---|---|
| Problem | Admin sign-in or any request fails with "Invalid API key"; public site falls back to seed content |
| Possible cause | `VITE_SUPABASE_ANON_KEY` belongs to another project (e.g. the old `ywbiyutmrwmjnbllyzxd`), was rotated/revoked, or URL and key don't match |
| Solution | Copy URL **and** publishable key from the same project (`zcxnlelzhkwbvittgcuj`) into `.env.local` and the GitHub variables; restart dev / re-run the workflow |

### `PGRST205` — "Could not find the table 'public.…' in the schema cache"

| | |
|---|---|
| Problem | Admin actions fail with PGRST205; public site shows seed content |
| Possible cause | `supabase/schema.sql` has not been run on this project (new project, or wrong project in `.env.local`) |
| Solution | SQL Editor → run `supabase/schema.sql`. If you just ran it, wait a few seconds for the PostgREST schema cache or run `notify pgrst, 'reload schema';` |

### Reviews rejected

| | |
|---|---|
| Problem | Submitting a review on `/reviews` fails with "new row violates row-level security policy for table \"reviews\"" |
| Possible cause | Migration 003 not run: the base policy `reviews: signed-in users write own` requires a signed-in user, and learners have no accounts. **Confirmed** at hand-off on production |
| Solution | Run `supabase/migrations/003_open_learning.sql` (creates `reviews: anyone submits`). Status (pending/approved) is still set by the `review_defaults` trigger |

### Suspend / admin management fails

| | |
|---|---|
| Problem | Admin → Users → Suspend / Restore account fails (e.g. "column … blocked … does not exist"); managing the admin list fails |
| Possible cause | Migration 002 not run (`profiles.blocked` → HTTP 400 at hand-off) |
| Solution | Run `supabase/migrations/002_user_management.sql` |

### Blog missing from the live menu

| | |
|---|---|
| Problem | `/blog` works but no "Blog" item in the navigation |
| Possible cause | The published document predates the Blog nav item; 003 adds it, and `withDefaults` only fills *missing top-level sections*, not items inside `navigation` |
| Solution | Run 003, or add the item in Admin → Website → navigation and Publish |

### "This account isn't an admin"

| | |
|---|---|
| Problem | Signing in at `/admin` shows "This account isn't an admin" |
| Possible cause | The auth user exists but has no row in `public.admins` (`src/admin/AdminApp.tsx:306-323`); or you are signed in to a different project |
| Solution | SQL Editor: `insert into public.admins (user_id) select id from auth.users where email = '<owner/admin email>';` then "I've done it — reload" |

### Password reset link opens the wrong URL

| | |
|---|---|
| Problem | The reset email opens `localhost:3000`, the old project's site, or the home page instead of `/reset-password` |
| Possible cause | The app requests `redirectTo = origin + BASE_URL + 'reset-password'` (`src/data/supabaseStore.ts:34,99-100`); if that URL is not in Supabase's allowed Redirect URLs, Supabase falls back to the **Site URL**. Live settings: **Unknown** |
| Solution | Supabase → Authentication → URL Configuration: Site URL `https://rajuvegesana98.github.io/designer-kid/`; Redirect URLs `https://rajuvegesana98.github.io/designer-kid/**` and `http://localhost:<port>/**`. Request a new link (old links expire) |

### Emails not arriving

| | |
|---|---|
| Problem | "Reset link sent" but nothing arrives, or "email rate limit exceeded" |
| Possible cause | Supabase built-in email allows ≈2 emails/hour and is meant for testing; spam filtering |
| Solution | Wait an hour / check spam; set a password directly in Supabase → Authentication → Users; configure custom SMTP (e.g. Resend) in Authentication → SMTP for reliable delivery |

### Admin signed out after changing projects

| | |
|---|---|
| Problem | After switching `VITE_SUPABASE_URL`, the admin is logged out |
| Possible cause | The session is stored per project in `localStorage` by supabase-js (**Inferred**, default `sb-<ref>-auth-token`) |
| Solution | Sign in again; make sure the admin user and `admins` row exist in the new project |

### Media upload fails

| | |
|---|---|
| Problem | Upload in Admin → Media fails with an RLS/"Bucket not found" error |
| Possible cause | `schema.sql` storage section not run (bucket `media` + admin write policies, `schema.sql:134-150`) or user not an admin |
| Solution | Re-run `schema.sql`; confirm the `admins` row |

---

## Browser tests (`tools/e2e`)

| Problem | Possible cause | Solution |
|---|---|---|
| `Chromium distribution 'chrome' is not found` | Scripts launch `chromium.launch({ channel: 'chrome' })` — they need Google Chrome installed; `playwright-core` does not download browsers | Install Google Chrome |
| `Cannot find package 'playwright-core'` | Test runner deps are separate (`tools/e2e/package.json`) and git-ignored | `cd tools/e2e && npm install` |
| Tests hit the wrong server / connection refused | Scripts default to `http://localhost:5181` (`BASE` env overrides) | Start `MOTION_STUDIO=off VITE_SUPABASE_URL= npx vite --port 5181 --strictPort` first |
| Tests write to production | Test server started with Supabase configured | Always start the test server with `VITE_SUPABASE_URL=` |
| `live.mjs` / `live2.mjs` fail after a domain change | Live URL is hard-coded (`live.mjs:8`, `live2.mjs:6`) | Update the constant |
