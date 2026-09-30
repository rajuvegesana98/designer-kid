# Environment — variables, build settings and client storage

Every environment variable that the Designer Kid code, build config, scripts, tests and GitHub Actions workflow actually
read, found by searching for `import.meta.env` and `process.env` in `src/`, `vite.config.ts`, `scripts/`, `tools/e2e/`
and `.github/`, plus the Motion Studio (dev-only) variables read by the `motion-studio` package itself. It also lists the
browser `localStorage` keys the app writes, because learner progress and browser-only data live there and do not move
with the code.

> **Status legend** — **Confirmed**: seen in code/config or verified at hand-off. **Inferred**: reasoned from code (reason given).
> **Unknown**: cannot be verified from the repository — the text says what to check.
>
> Values are never written here. Look them up in `.env.local` (git-ignored), GitHub → Settings → Secrets and variables →
> Actions → Variables, or the Supabase dashboard.

Last verified: 30 Sep 2026 (docs v2.0)

---

## 1. Summary

| Name | Required? | Read by | Kind | Embedded in public JS? |
|---|---|---|---|---|
| `VITE_SUPABASE_URL` | Optional (without it → browser-only mode). Required for the real site | `src/data/index.ts:5` | Client-side, fixed at build time | **Yes** |
| `VITE_SUPABASE_ANON_KEY` | Optional (as above) | `src/data/index.ts:6` | Client-side, fixed at build time | **Yes** |
| `BASE_PATH` | Optional (default `/`); set by CI | `vite.config.ts:10` | Build-time (Node) | Indirectly (becomes `import.meta.env.BASE_URL`) |
| `MOTION_STUDIO` | Optional; only value that matters is `off` | `vite.config.ts:11` | Dev server (Node) | No |
| `MOTION_STUDIO_AGENT_PROVIDER` | Optional | `motion-studio` package (dev server) | Dev only (Node) | No |
| `MOTION_STUDIO_AGENT_MODEL`, `MOTION_STUDIO_HOME`, `MOTION_STUDIO_LOCAL`, `MOTION_SITE_URL` | Optional, not used by this project | `motion-studio` package internals | Dev only | No |
| `BASE` | Optional | `tools/e2e/e2e*.mjs:3-4` | Test runner (Node) | No |
| `import.meta.env.BASE_URL` | Automatic (Vite built-in) | `src/App.tsx:90`, `src/admin/state.tsx:174`, `src/admin/pages/Theme.tsx:77`, `src/data/supabaseStore.ts:34` | Client-side | Yes (it is just the base path) |

Nothing else is read. There are no server-side secrets because there is no server.

---

## 2. Application variables

### `VITE_SUPABASE_URL`

| | |
|---|---|
| Purpose | Supabase project URL, `https://<project-ref>.supabase.co` |
| Where used | `src/data/index.ts:5`; if both Supabase variables are set, `src/data/index.ts:9` creates `createSupabaseStore(url, anonKey)`, otherwise `createLocalStore()` (browser-only mode) |
| Set in | `.env.local` for dev; GitHub Actions **variable** `VITE_SUPABASE_URL` for deploys (`deploy.yml`, Build step `env:`) |
| Where to obtain | Supabase dashboard → project → Project Settings → API / "Connect" |
| Regenerate on migration? | No — same value unless you move to a new Supabase project. Live project ref: `zcxnlelzhkwbvittgcuj` (the older `ywbiyutmrwmjnbllyzxd` is unused) |
| Trick | `VITE_SUPABASE_URL= npm run dev` (empty) forces browser-only mode even when `.env.local` is filled in: shell env beats `.env` files in Vite (used by `docs/TESTING.md`) |

### `VITE_SUPABASE_ANON_KEY`

| | |
|---|---|
| Purpose | Supabase **publishable** key (`sb_publishable_…`, the successor of the "anon" key). Security comes from Row Level Security in `supabase/schema.sql` |
| Where used | `src/data/index.ts:6` → `createClient(url, anonKey, { auth: { flowType: 'implicit', persistSession: true, detectSessionInUrl: true } })` (`src/data/supabaseStore.ts:33`) |
| Set in | `.env.local`; GitHub Actions **variable** `VITE_SUPABASE_ANON_KEY` |
| Where to obtain | Supabase → Project Settings → API keys → *Publishable key* |
| Regenerate? | Not required when moving computers. Rotate only if you create new API keys in Supabase — then update `.env.local` **and** the GitHub variable, and redeploy (the old value is baked into the deployed bundle) |
| **Never** | Use the *secret* / `service_role` key here or in GitHub variables — it would be published in the JS bundle and bypass RLS |

**`VITE_*` values are public.** Vite inlines every `import.meta.env.VITE_*` value into the built JavaScript in `dist/assets/`,
which anyone can download from GitHub Pages. That is acceptable for the URL and publishable key and for nothing else.
They are stored as GitHub Actions *variables* (not secrets) for that reason (`deploy.yml` header comment).

### `BASE_PATH`

| | |
|---|---|
| Purpose | Public base path of the site. `vite.config.ts:10`: `base: process.env.BASE_PATH ?? '/'` |
| Effect | Becomes `import.meta.env.BASE_URL`, used for the router `basename` (`src/App.tsx:90`), the preview window URL (`src/admin/state.tsx:174`), the default favicon (`src/admin/pages/Theme.tsx:77`) and Supabase email redirect URLs (`src/data/supabaseStore.ts:34`) |
| Set by CI | `deploy.yml`: `BASE_PATH: ${{ steps.pages.outputs.base_path }}/` → `/designer-kid/` on `github.io`; `/` if a custom domain is configured |
| Local use | Leave unset for `npm run dev`. Set on the command line to mimic Pages: `BASE_PATH=/designer-kid/ npm run build && BASE_PATH=/designer-kid/ npm run preview` |
| Must include | Leading and trailing slash |
| Not read from `.env.local` | `vite.config.ts` reads `process.env` directly and never calls `loadEnv`, so a `BASE_PATH=` line in `.env.local` has no effect (**Inferred**; `.env.example` shows it commented out with "set automatically by the deploy workflow") |

### `MOTION_STUDIO`

| | |
|---|---|
| Purpose | `MOTION_STUDIO=off` disables the Motion Studio Vite plugin. `vite.config.ts:11`: plugin added only when `command === 'serve' && process.env.MOTION_STUDIO !== 'off'` |
| When to use | Automated browser tests, or if the panel gets in the way |
| Scope | Dev server only. Shell/command line only (not read from `.env.local`, same reason as `BASE_PATH`) |
| Production | Irrelevant: `vite build` never adds the plugin, and `scripts/postbuild.mjs` fails the build if Studio code is found |

---

## 3. Motion Studio variables (dev only)

Read by the `motion-studio` 2.1.0 package, not by project code. The package looks in `process.env` first and then in
`.env.local` / `.env` in the project root and its parent (`resolveAgentEnv`, `node_modules/motion-studio/dist/index.mjs:23301`).

| Name | In this project | Purpose |
|---|---|---|
| `MOTION_STUDIO_AGENT_PROVIDER` | Set in `.env.local` and `.env.example` (value `claude`) | Which AI agent provider Motion Studio uses for agent edits. Agent/save-to-source features need a Motion Studio subscription and, for Claude, `npm i -D @anthropic-ai/claude-agent-sdk` (not installed — `node_modules/@anthropic-ai` absent) per `docs/OPERATIONS.md` |
| `MOTION_STUDIO_AGENT_MODEL` | Not set | Optional model override |
| `MOTION_STUDIO_HOME` | Not set | Where Studio keeps its local data (default `~/.motion-studio`) |
| `MOTION_STUDIO_LOCAL`, `MOTION_SITE_URL` | Not set | Package-internal (points Studio at a local/alternate motion.dev site). Do not set |

Motion Studio licence/login state lives on the developer's machine (`~/.motion-studio`, **Inferred** from the default above)
and is **not** part of the repo.

## 4. Test variables

| Name | Where | Default | Purpose |
|---|---|---|---|
| `BASE` | `tools/e2e/e2e.mjs:3`, `e2e2.mjs:4`, `e2e3.mjs:4`, `e2e4.mjs:3` | `http://localhost:5181` | URL of the dev server under test |
| — | `tools/e2e/live.mjs:8`, `live2.mjs:6` | hard-coded `https://rajuvegesana98.github.io/designer-kid` | Live smoke tests; edit the file if the URL changes |

## 5. GitHub Actions configuration

| Item | Type | Value / source | Used in |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Repository **variable** (`vars.`) | Supabase project URL — set (verified at hand-off) | `deploy.yml` Build step |
| `VITE_SUPABASE_ANON_KEY` | Repository **variable** | Publishable key — set (verified at hand-off) | `deploy.yml` Build step |
| `BASE_PATH` | Computed | `steps.pages.outputs.base_path` from `actions/configure-pages@v5`, plus `/` | `deploy.yml` Build step |
| Node version | Workflow | `actions/setup-node@v4` with `node-version: 22` (latest 22.x; must resolve to ≥ 22.22.0 for `react-router` — **Inferred** it does) | `deploy.yml` |
| Pages source | Repo setting | Settings → Pages → Source: **GitHub Actions** (build type "workflow", verified at hand-off) | — |
| Secrets | — | **None** are used by the workflow | — |

If the GitHub variables are missing, the build still succeeds but produces a **browser-only** site (every visitor gets their
own local copy, admin = "Open admin for this browser"). **Inferred** from `src/data/index.ts:9`.

## 6. Files

| File | Committed? | Contents |
|---|---|---|
| `.env.example` | Yes | Template: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` placeholders, commented `BASE_PATH`, `MOTION_STUDIO_AGENT_PROVIDER` |
| `.env.local` | **No** (`.gitignore` pattern `*.local`) | Hand-off machine: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `MOTION_STUDIO_AGENT_PROVIDER` (names verified; values not reproduced) |
| `.env`, `.env.production` | Do not exist | — |

---

## 7. Client storage (browser `localStorage`)

These keys live in each visitor's browser, per origin (`https://rajuvegesana98.github.io` for the live site;
`http://localhost:<port>` for dev — a different port is a different origin). They are **not** in the database, **not**
in git, and **cannot be migrated** server-side. Learners move their progress with the backup on the Profile page (`/profile`, `ProfilePage` in `src/pages/Account.tsx`)
(download `designer-kid-progress-YYYY-MM-DD.json`, `src/pages/Account.tsx:70`; restore via `src/state/learner.tsx:43`).

### Used in every mode

| Key | Defined | Contents |
|---|---|---|
| `dk.learner.guest` | `src/state/learner.tsx:7` | Learner's progress: level, completed lessons/challenges, notes, bookmarks, career checklists, active days, challenge work |
| `dk.colorMode` | `src/state/ui.tsx:10` | Light/dark preference (removed when "system") |
| `dk.promo.<promoId>.v<version>` | `src/components/Promo.tsx:11` | `'1'` when a visitor dismissed that offer/banner version |
| `dk.preview.content` | `src/state/content.tsx:6` (written by `src/admin/state.tsx:55`) | Admin's current draft for the `?preview=1` tab (same browser only) |

### Browser-only mode only (`src/data/localStore.ts:20-30`)

| Key | Contents |
|---|---|
| `dk.content.published` | Published site content |
| `dk.content.draft` | Admin draft |
| `dk.content.versions` | Up to 5 published versions (`MAX_VERSIONS`, fewer if storage is full) |
| `dk.demoAdmin` | `true` after "Open admin for this browser" |
| `dk.events` | Analytics events |
| `dk.submissions` | Challenge submissions |
| `dk.media` | Uploaded media as data URLs (each file < 1.5 MB, `MAX_MEDIA_BYTES`) |
| `dk.reviews` | Reviews |
| `dk.learner.<id>` | Per-user learner state (store API; the UI uses `dk.learner.guest`) |

### Set by the Supabase client (Supabase mode)

`persistSession: true` (`src/data/supabaseStore.ts:33`) makes supabase-js keep the admin session in `localStorage`,
by default under a key of the form `sb-<project-ref>-auth-token` (**Inferred** from the library default; no custom
`storageKey` is set). Changing Supabase project therefore signs the admin out.

## 8. What to regenerate when moving

| Item | Action |
|---|---|
| `.env.local` | Recreate from `.env.example` + Supabase dashboard (or copy privately) |
| GitHub variables | Nothing, unless the repo or Supabase project changes |
| Supabase keys | Nothing, unless deliberately rotated |
| `node_modules/`, `dist/` | Regenerate with `npm ci` / `npm run build` |
| Motion Studio login | Sign in again on the new machine (**Inferred**) |
| `gh` / git credentials | `gh auth login` on the new machine |
