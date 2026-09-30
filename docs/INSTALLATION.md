# Installation — setting up Designer Kid on a clean machine

This guide takes a new developer (or AI coding agent) from a machine with nothing installed to a running local copy of
Designer Kid, a connected Supabase database, a working admin login and a production build. Designer Kid is a static
single-page app (Vite + React + TypeScript) that talks directly from the browser to Supabase; there is no application
server to install. It can also run in **browser-only mode** (no Supabase at all), which is the quickest way to see it working.

> **Status legend** — **Confirmed**: seen in code/config or verified at hand-off. **Inferred**: reasoned from code (reason given).
> **Unknown**: cannot be verified from the repository — the text says what to check.

Last verified: 30 Sep 2026 (docs v2.0)

Related: [ENVIRONMENT.md](ENVIRONMENT.md) · [DEPLOYMENT.md](DEPLOYMENT.md) · [MIGRATION.md](MIGRATION.md) ·
[TROUBLESHOOTING.md](TROUBLESHOOTING.md) · [OPERATIONS.md](OPERATIONS.md) · [TESTING.md](TESTING.md)

---

## 1. Required software

| Software | Version | Why | Status |
|---|---|---|---|
| **Node.js** | **≥ 22.22.0** (Node 24 LTS recommended; hand-off machine used v24.11.1) | Runs Vite, TypeScript, the build and postbuild scripts | **Confirmed** — see engines table below |
| **npm** | Bundled with Node (hand-off machine: 11.6.2). `package-lock.json` is lockfileVersion 3 → npm ≥ 7; use the npm that ships with Node 22.22+/24 | Installs exact dependency tree with `npm ci` | **Confirmed** |
| **git** | Any recent version | Clone, commit, push (push to `main` deploys) | **Confirmed** (repo remote `origin` → `github.com/rajuvegesana98/designer-kid`) |
| **GitHub CLI `gh`** | Optional | Checking deploy runs (`gh run list`), switching accounts | **Confirmed** used in `docs/OPERATIONS.md`; not required by the build |
| **Google Chrome** | Optional — only for browser tests | `tools/e2e/*.mjs` launch Playwright with `channel: 'chrome'` (your installed Chrome, not a downloaded Chromium) | **Confirmed** (`tools/e2e/e2e.mjs:8`, `live.mjs:2`) |
| A code editor | Any | — | — |

### Why Node ≥ 22.22.0 (verified `engines` fields)

Checked in `node_modules/*/package.json` and `package-lock.json` on 30 Sep 2026:

| Package (installed version) | `engines.node` |
|---|---|
| `react-router` 8.4.0 | `>=22.22.0` ← **strictest** |
| `motion-studio` 2.1.0 (dev only) | `>=22.13.0` (its README also says "Node.js 22.13 or later") |
| `@cursor/sdk` (transitive, via motion-studio) | `>=22.13` |
| `@supabase/supabase-js` 2.117.2 (+ auth-js, postgrest-js, …) | `>=22.0.0` |
| `vite` 8.3.1, `rolldown` 1.2.11, `@vitejs/plugin-react` 6.1.1, `oxlint` 1.86.0 | `^20.19.0 \|\| >=22.12.0` |
| `typescript` 6.0.3 | `>=14.17` |

npm does not enforce `engines` by default (it prints `EBADENGINE` warnings), so an older Node may install but then
fail at `vite`/`motion-studio` start-up or build time. Use **Node 22.22+ or Node 24 LTS**.

Install options:

| OS | Suggested install |
|---|---|
| macOS | `brew install node@24 git gh` or the installer from nodejs.org; or `nvm install 24` |
| Windows | Installer from nodejs.org (LTS 24), Git for Windows, `winget install GitHub.cli`; or `nvm-windows` |
| Linux | `nvm install 24` (recommended) or your distro's NodeSource packages; `git`, `gh` from the package manager |

Check:

```bash
node -v    # must print v22.22.0 or newer (v24.x recommended)
npm -v
git --version
gh --version        # optional
```

---

## 2. Required accounts and services

| Account / service | Needed for | Required? |
|---|---|---|
| **GitHub** account with access to `rajuvegesana98/designer-kid` | Source code, GitHub Actions build, GitHub Pages hosting | Yes for deploying; cloning a public repo needs no account (repo is public — verified at hand-off) |
| **Supabase** account + project | Published content, admin authentication, reviews, analytics events, media storage | Yes for the real site; **not** needed for browser-only mode |
| Email (Supabase built-in, ≈2 emails/hour) or custom SMTP | Admin password-reset emails | Only for password resets. Custom SMTP configuration: **Unknown** (check Supabase → Authentication → SMTP) |
| External booking tool (Calendly/Cal.com/Topmate) | 1:1 booking link set in Admin → 1:1 Connect | Optional; none configured at hand-off |

No other services are used: there is no server, no paid API, no analytics vendor. Fonts are loaded from Google Fonts
(`index.html:11-13`).

## 3. Credentials you will need

| Credential | Where it goes | Where to get it | Secret? |
|---|---|---|---|
| Supabase **Project URL** | `VITE_SUPABASE_URL` in `.env.local` and GitHub Actions variable | Supabase dashboard → Project Settings → API (or "Connect") | No |
| Supabase **publishable (anon) key** (`sb_publishable_…`) | `VITE_SUPABASE_ANON_KEY` in `.env.local` and GitHub Actions variable | Same place — the *publishable* key only | Browser-safe (it ends up in the public JS bundle). **Never** use the secret / `service_role` key |
| Admin login (email + password) | Typed into `/admin` | Created in Supabase → Authentication → Users | Yes — keep private |
| GitHub login / `gh` token | `git push`, `gh` | GitHub | Yes |
| Supabase database password | Only for `pg_dump` backups (see MIGRATION.md) | Supabase → Project Settings → Database | Yes; not used by the app |

See [ENVIRONMENT.md](ENVIRONMENT.md) for every variable.

---

## 4. Get the code

```bash
# Option A — clone (recommended)
git clone https://github.com/rajuvegesana98/designer-kid.git
cd designer-kid

# Option B — copy a folder from another machine
#   Copy everything EXCEPT node_modules/ and dist/ (both are regenerated and are git-ignored).
#   .env.local is git-ignored too — copy it separately and privately, or recreate it (step 6).
```

**Avoid spaces in the folder path.** `scripts/postbuild.mjs` builds its path with `new URL('../dist/', import.meta.url).pathname`,
which percent-encodes spaces (`/Users/a b/…` → `/Users/a%20b/…`), so `npm run build` would fail to find `dist/`.
(**Inferred** — reproduced the encoding with Node on 30 Sep 2026; not run end-to-end in a spaced path.) The same
`.pathname` pattern returns `/C:/…` on Windows, so **Windows builds are Unknown/untested** — use WSL2 if the postbuild step fails.

## 5. Install dependencies

```bash
npm ci          # exact versions from package-lock.json (preferred; what GitHub Actions runs)
# or
npm install     # if you intend to change dependencies
```

`npm ci` installs `motion-studio` as a dev dependency. It is only active in `npm run dev` (see §10).

## 6. Environment setup

```bash
cp .env.example .env.local        # Windows (cmd): copy .env.example .env.local
```

Edit `.env.local`:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | the publishable key |
| `MOTION_STUDIO_AGENT_PROVIDER` | `claude` (optional, dev-only Motion Studio setting) |

Leave both `VITE_SUPABASE_*` empty (or delete them) to run in **browser-only mode**: `src/data/index.ts:9` picks
`createLocalStore()` whenever either value is missing.

Do **not** put `BASE_PATH` or `MOTION_STUDIO` in `.env.local` — `vite.config.ts` reads them from `process.env` and does not
call `loadEnv`, so values in `.env*` files are ignored for those two (**Inferred** from `vite.config.ts:10-11` and Vite's
config-loading order). Set them on the command line instead.

## 7. Database setup (Supabase)

Skip this section for browser-only mode.

1. Create a Supabase project (supabase.com → New project). Note the project ref and region.
2. Open **SQL Editor → New query**, paste the whole of `supabase/schema.sql`, **Run**.
   - The file is idempotent ("Safe to re-run", `schema.sql:3`).
   - It **already contains migrations 002 and 003 appended at the end**: section "User management (also in
     migrations/002_user_management.sql)" from line 202 and "Open learning (also in migrations/003_open_learning.sql)"
     from line 250. **Confirmed** by `diff`: the 002 body matches `schema.sql` lines 204–249 (one blank line differs) and
     the 003 body matches lines 252–268 exactly. On a fresh project you therefore do **not** need to run the files in
     `supabase/migrations/` separately.
   - It creates: tables `admins`, `profiles`, `site_content`, `content_history`, `events`, `submissions`, `reviews`;
     functions `is_admin`, `handle_new_user` (+ trigger on `auth.users`), `publish_content`, `review_defaults`,
     `protect_profile`; RLS policies; the public storage bucket **`media`** with admin-only write policies.
3. **Authentication → URL Configuration** (**Unknown** what is set on the live project — check it):
   - Site URL: the live site, e.g. `https://rajuvegesana98.github.io/designer-kid/`
   - Redirect URLs: `https://rajuvegesana98.github.io/designer-kid/**` and your local dev URL, e.g. `http://localhost:5173/**`
   - Why: password-reset emails redirect to `window.location.origin + BASE_URL + 'reset-password'`
     (`src/data/supabaseStore.ts:34,100`). If that URL is not allowed, Supabase sends users to the Site URL instead.
4. Optional: Authentication → Sign In / Providers → turn off "Allow new users to sign up" (learners have no accounts;
   sign-up is not linked in the UI).

> Existing live project (`zcxnlelzhkwbvittgcuj`): the base schema has been run, but migrations **002 and 003 have NOT**
> (verified at hand-off). Run `supabase/migrations/002_user_management.sql` then `003_open_learning.sql` there
> (or simply re-run the whole `schema.sql`, which is idempotent).

## 8. Make an admin

Run the schema **before** creating the user so the `handle_new_user` trigger creates the matching `profiles` row.

1. Supabase → **Authentication → Users → Add user** → enter the owner/admin email and a password, tick *Auto Confirm User*.
2. SQL Editor:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = '<owner/admin email>';
   ```

   The same statement is printed by the app on the "This account isn't an admin" screen (`src/admin/AdminApp.tsx:311-313`)
   and in `schema.sql:152-155`.
3. Check: `select * from public.admins;` returns one row.

## 9. Seeding — how starter content gets into the database

There is **no database seed script** (no `seed.sql`, no npm script). **Confirmed.**

- The full starter curriculum is bundled in the app at `src/content/seed/` (`index.ts` exports `seedContent`, plus
  `beginnerFoundations.ts`, `intermediateCraft.ts`, `expert.ts`, `careerProfiles.ts`, `blog.ts`, …).
- When `site_content` has no `published` row, the public site renders the bundled seed
  (`src/state/content.tsx:60`: `withDefaults(await store.loadPublished()) ?? loadSeed()`).
- In the admin, a never-published database shows the pending change "Initial publish of starter content"
  (`src/admin/state.tsx:135`). Pressing **Publish** calls the `publish_content` RPC (`schema.sql:77-92`), which writes
  the `published` and `draft` rows, a `content_history` version and a `content_published` event. That first admin
  Publish *is* the seed step.
- Sections missing from an older published document are back-filled from the seed at runtime (`withDefaults`,
  `src/state/content.tsx:25-34`) — they are only written to the DB on the next Publish.

## 10. Start the development server

```bash
npm run dev                              # Vite dev server, default http://localhost:5173 (+ Motion Studio panel)
MOTION_STUDIO=off npm run dev            # without Motion Studio
VITE_SUPABASE_URL= npm run dev           # force browser-only mode even if .env.local is filled in
MOTION_STUDIO=off VITE_SUPABASE_URL= npx vite --port 5181 --strictPort   # what the browser tests expect
```

No port is set in `vite.config.ts`, so Vite's default (5173) applies; `docs/OPERATIONS.md` mentions `5180`, which was
chosen on the command line during the build (**Inferred**).

Windows equivalents of `VAR=value cmd`:

```powershell
# PowerShell
$env:MOTION_STUDIO = 'off'; $env:VITE_SUPABASE_URL = ''; npm run dev
```
```bat
:: cmd.exe
set MOTION_STUDIO=off&& npm run dev
```

Browser-only admin: open `/admin` and click **Open admin for this browser** (`src/admin/AdminApp.tsx:283`); no password.

## 11. Verification checklist

| # | Check | Expected |
|---|---|---|
| 1 | `node -v` | ≥ v22.22.0 |
| 2 | `npm ci` | completes; no `EBADENGINE` warnings |
| 3 | `npx tsc --noEmit -p tsconfig.app.json` | no output (clean) |
| 4 | `npm run dev`, open `http://localhost:5173/` | Home page with levels; no red errors in the browser console |
| 5 | Admin → Settings → "Data connection" | "Connected" (Supabase) or "Browser-only mode" as intended |
| 6 | `/admin` sign-in with the admin account | Admin dashboard (not "This account isn't an admin") |
| 7 | Admin → Publishing | Version list loads; first time shows "Initial publish of starter content" |
| 8 | Publish once (Supabase mode) | Toast/success; public site reloads with the published content |
| 9 | Complete a lesson as a learner | Progress persists after reload (`localStorage` key `dk.learner.guest`) |
| 10 | `npm run build` | Ends with `✓ No Motion Studio code in production build` and `✓ Copied index.html → 404.html` |
| 11 | Browser tests (optional) | See [TESTING.md](TESTING.md): 34 checks pass |

Quick REST check (anonymous key; replace placeholders):

```bash
U=https://<project-ref>.supabase.co; K=<publishable key>
curl -s -o /dev/null -w "%{http_code}\n" "$U/rest/v1/site_content?select=id" -H "apikey: $K"          # 200 = schema run
curl -s -o /dev/null -w "%{http_code}\n" "$U/rest/v1/profiles?select=blocked&limit=1" -H "apikey: $K" # 200 = 002 run, 400 = not run
```

## 12. Production build

```bash
npm run build
# = tsc -b && vite build && node scripts/postbuild.mjs     (package.json)
```

- `tsc -b` type-checks (fails the build on type errors).
- `vite build` writes `dist/`. `base` comes from `BASE_PATH` (`vite.config.ts:10`), default `/`.
- `scripts/postbuild.mjs` fails if any `motion-studio`/`motionStudio`/`__MOTION_STUDIO` string is found in `dist/`
  `.js/.html/.css`, then copies `dist/index.html` → `dist/404.html` for GitHub Pages deep links.
- `VITE_SUPABASE_*` values present at build time are **embedded in the JS bundle**.

For a GitHub Pages-style build locally:

```bash
BASE_PATH=/designer-kid/ npm run build
```

## 13. Run the production build locally

```bash
npm run preview                          # "vite preview" (script exists in package.json) — default http://localhost:4173/
BASE_PATH=/designer-kid/ npm run preview # if you built with that BASE_PATH → open http://localhost:4173/designer-kid/
```

`vite preview` reads `vite.config.ts` again, so use the **same `BASE_PATH` for build and preview**; a mismatch gives a
blank page with 404s for `/assets/*.js` (**Inferred** from `vite.config.ts:10` + `src/App.tsx:90`). `vite preview` only
serves the already-built files in `dist/`, which the postbuild check guarantees contain no Motion Studio code (Vite calls the
config function with `command: 'serve'` for preview too, so the plugin object may be created; add `MOTION_STUDIO=off` if in
doubt — **Inferred**, not tested).

The production site itself has no server start command: it is static files served by GitHub Pages (see [DEPLOYMENT.md](DEPLOYMENT.md)).
