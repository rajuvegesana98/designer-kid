# Migration — moving Designer Kid to a new computer, backup and recovery

A step-by-step checklist for continuing work on Designer Kid from a different computer, a feature-verification checklist,
a portability report ("can this project be moved and run?"), a backup and disaster-recovery plan, and an analysis of what
a one-command setup would need. The short answer: **yes** — the project is a plain Node/Vite repository plus a hosted
Supabase project and GitHub Pages; nothing is tied to the original Mac except its `.env.local`, its logins and the data
in its browsers.

> **Status legend** — **Confirmed**: seen in code/config or verified at hand-off. **Inferred**: reasoned from code (reason given).
> **Unknown**: cannot be verified from the repository — the text says what to check.

Last verified: 30 Sep 2026 (docs v2.0)

Related: [INSTALLATION.md](INSTALLATION.md) (full detail per step) · [ENVIRONMENT.md](ENVIRONMENT.md) ·
[DEPLOYMENT.md](DEPLOYMENT.md) · [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## Part A — New computer checklist

Commands are for macOS/Linux shells; Windows notes are given where they differ.

### STEP 1 — Install the tools

```bash
# macOS (Homebrew)
brew install node@24 git gh
# Linux / macOS alternative
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash   # then open a new shell
nvm install 24 && nvm use 24
# Windows: install Node 24 LTS from nodejs.org, Git for Windows, and `winget install GitHub.cli`
```

Install **Google Chrome** if you will run the browser tests.

### STEP 2 — Check versions

```bash
node -v   # ≥ v22.22.0 (react-router 8.4.0 requires it; motion-studio needs ≥ 22.13.0)
npm -v
git --version
```

### STEP 3 — Sign in to GitHub

```bash
gh auth login                    # choose GitHub.com, HTTPS, log in as the repo owner account
gh auth status                   # the active account must be the one with push rights (rajuvegesana98)
```

### STEP 4 — Get the code

```bash
git clone https://github.com/rajuvegesana98/designer-kid.git
cd designer-kid
git log --oneline -3             # latest at hand-off: 356c611 "Password show/hide toggle; …"
```

Copying the folder instead? Exclude `node_modules/` and `dist/`. Use a path **without spaces** (the postbuild script
breaks on them — see TROUBLESHOOTING.md).

### STEP 5 — Install dependencies

```bash
npm ci
```

### STEP 6 — Recreate `.env.local`

```bash
cp .env.example .env.local       # Windows cmd: copy .env.example .env.local
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (publishable key) from Supabase → project
`zcxnlelzhkwbvittgcuj` → Project Settings → API, or copy the old machine's `.env.local` over a private channel.
Keep `MOTION_STUDIO_AGENT_PROVIDER=claude` if you use Motion Studio.

### STEP 7 — Check the Supabase project is awake and reachable

Supabase dashboard → project → if it shows **Paused**, click **Restore** (free projects pause after ~1 week of inactivity).

```bash
U=https://zcxnlelzhkwbvittgcuj.supabase.co; K=<publishable key>
curl -s -o /dev/null -w "%{http_code}\n" "$U/rest/v1/site_content?select=id" -H "apikey: $K"            # expect 200
curl -s -o /dev/null -w "%{http_code}\n" "$U/rest/v1/profiles?select=blocked&limit=1" -H "apikey: $K"   # 200 once 002 has run
```

### STEP 8 — Apply outstanding database migrations (one-time, if not yet done)

At hand-off 002 and 003 had **not** been run on the live project. Supabase → SQL Editor → paste and run
`supabase/migrations/002_user_management.sql`, then `003_open_learning.sql`, then `004_hardening.sql`. (Alternatively run all of
`supabase/schema.sql` — idempotent.) Re-run the second `curl` in STEP 7 → 200.

### STEP 9 — Run the app

```bash
npm run dev                                   # http://localhost:5173 (Motion Studio panel in dev)
# or, safe sandbox that never writes to Supabase:
MOTION_STUDIO=off VITE_SUPABASE_URL= npm run dev
```

If you use a local port for password-reset testing, add `http://localhost:<port>/**` to Supabase → Authentication →
URL Configuration → Redirect URLs.

### STEP 10 — Sign in as admin

Open `http://localhost:5173/admin`, sign in with the owner/admin account. Forgot the password? Use "Forgot password?"
(email limited to ~2/hour on built-in email) or Supabase → Authentication → Users → the user → send recovery / set password.

### STEP 11 — Build and run the tests

```bash
npx tsc --noEmit -p tsconfig.app.json
npm run build                                               # both ✓ lines from postbuild
MOTION_STUDIO=off VITE_SUPABASE_URL= npx vite --port 5181 --strictPort &
cd tools/e2e && npm install && node e2e.mjs && node e2e2.mjs && node e2e3.mjs && node e2e4.mjs && node live2.mjs
cd ../..; kill %1                                           # stop the test server
```

### STEP 12 — Prove you can deploy

```bash
git commit --allow-empty -m "Verify deploy from new machine"   # only if you actually want a deploy
git push origin main
gh run list --repo rajuvegesana98/designer-kid --limit 1       # status: completed / success
```

Open https://rajuvegesana98.github.io/designer-kid/ and hard-refresh.

---

## Part B — Verify every major feature

Tick each on the dev server (Supabase mode) and on the live site after deploy.

| # | Area | Check | Expected |
|---|---|---|---|
| 1 | Home / landing | `/` and `/welcome` load | Hero, levels, 1:1 section ("Booking opens soon" until a link is set), blog strip |
| 2 | Onboarding | `/start` → pick a level | Dashboard shows chosen level |
| 3 | Learn | `/learn` → level → module → lesson | All content open (no locks); lesson blocks render |
| 4 | Progress | Mark a lesson complete, reload | Still complete (`dk.learner.guest`) |
| 5 | Notes & bookmarks | Add a note and a bookmark | Visible on Profile/Progress |
| 6 | Search | Search palette and `/search` | Results; Enter opens the item |
| 7 | Challenges | `/challenges/:id` | Brief and submission area render |
| 8 | Career Centre | `/career`, a guide | Checklists save |
| 9 | Resources | `/resources` | List renders |
| 10 | Blog | `/blog`, a post | Renders; menu shows "Blog" once 003 ran or after a Publish that includes it |
| 11 | Reviews | `/reviews` → submit a review | Accepted (after 003); appears after admin approval if approval is required |
| 12 | Print/PDF | `/print/lesson/:id` | Printable view |
| 13 | Progress backup | `/profile` → download backup, then "Restore from backup" | JSON downloads; restore brings progress back |
| 14 | Dark mode | Toggle | Persists (`dk.colorMode`) |
| 15 | Offers | Banner/pop-up (if enabled) | Dismissal remembered (`dk.promo.*`) |
| 16 | Deep link | Open `/designer-kid/lesson/<id>` directly on live | Page renders (HTTP 404 status is expected) |
| 17 | Admin login | `/admin` | Dashboard (not "This account isn't an admin") |
| 18 | Admin edit + preview | Edit a lesson → Preview draft | Preview tab shows the change (same browser) |
| 19 | Publish | Admin → Publishing → Publish | New version in history; public site shows change |
| 20 | Restore | Publishing → Restore an older version → Publish | Content rolls back |
| 21 | Backup JSON | Publishing → Backup → Download draft as JSON | `designer-kid-content-YYYY-MM-DD.json` |
| 22 | Media | Admin → Media → upload an image | Appears with a public URL (bucket `media`) |
| 23 | Reviews admin | Approve / feature / reply | Changes visible on `/reviews` and homepage |
| 24 | Users | Admin → Users, suspend/restore, make admin | Works only after 002 |
| 25 | Analytics | Admin → Analytics | Events list (e.g. `content_published`) |
| 26 | Theme | Admin → Theme preset/logo → Publish | Site colours/logo change |
| 27 | Admin account | Settings → change password; "Email me a reset link" | Password updated; email arrives (rate-limited) |
| 28 | Reset page | Follow the reset link | Opens `<site>/reset-password` on the right domain |
| 29 | Build guard | `npm run build` | `✓ No Motion Studio code…` and `✓ Copied index.html → 404.html` |

---

## Part C — Portability report

**Can this project be moved to another computer and run? — YES.** (**Confirmed** by structure: a standard npm project with a
lockfile, no machine-specific paths in code, no local database, no local server; hosted services are reached over HTTPS.)
Conditions: Node ≥ 22.22.0, the Supabase URL + publishable key, and access to the GitHub and Supabase accounts for
deploying and administering. Caveats: a project path without spaces, and Windows is untested for `npm run build` (see below).

| Question | Answer |
|---|---|
| What can be copied | The git repository (all source, `supabase/*.sql`, `docs/`, `tools/e2e/*.mjs`, `.github/workflows/deploy.yml`, `package.json`, `package-lock.json`, `.env.example`). Optionally `.env.local` (privately) |
| What should NOT be copied | `node_modules/` (platform-specific native binaries: rolldown, oxlint, lightningcss, fsevents), `dist/` (build output), `tools/e2e/shots*/` (test screenshots) |
| What must be installed | Node ≥ 22.22.0 + npm, git; optional `gh`, Google Chrome (tests), `playwright-core` in `tools/e2e` |
| Credentials needed | Supabase URL + publishable key (for `.env.local`); GitHub login (push/deploy); Supabase dashboard login (SQL, auth, backups); admin email + password (app admin). Optional: Supabase DB password (pg_dump), Motion Studio login |
| External services | GitHub (repo, Actions, Pages), Supabase (Postgres, Auth, Storage), Google Fonts (CDN). Optional: booking tool, SMTP provider |
| Database required? | **No** to run locally (browser-only mode works with no DB). **Yes** for the real site, shared content, admin login, reviews, media. The DB is hosted — nothing to move for a new *computer* |
| Critical files | `package.json`, `package-lock.json`, `vite.config.ts`, `scripts/postbuild.mjs`, `.github/workflows/deploy.yml`, `supabase/schema.sql` (+ `migrations/`), `src/data/index.ts`, `src/data/supabaseStore.ts`, `src/content/seed/*`, `.env.local` (recreate) |
| Cannot be transferred | Learners' progress in their own browsers (`dk.learner.guest` etc. — they must use the in-app backup/restore); browser-only-mode data on the old machine (`dk.*` keys at `localhost`); admin sessions; the GitHub and Supabase **accounts** themselves (they are logins, not files); Motion Studio subscription/login; `gh` tokens; the old machine's Chrome profile |
| Must be regenerated | `node_modules/` (`npm ci`), `dist/` (`npm run build`), `.env.local` (from Supabase), `gh auth login`, Supabase redirect URL for any new local port |
| Machine-specific traps | Path with spaces or Windows drive letters breaks `scripts/postbuild.mjs` (`new URL(...).pathname`) — **Inferred**, use WSL2 on Windows if the build fails; case-insensitive filesystems (macOS/Windows) vs case-sensitive Linux — `Illustrations.tsx` and `illustrationLibrary.tsx` must never gain a sibling `illustrations.tsx`; `VAR=value cmd` syntax is POSIX-only |

---

## Part D — Backup & recovery

### What to back up

| Asset | Where it lives | How to back up | How often |
|---|---|---|---|
| Source code & history | GitHub `rajuvegesana98/designer-kid` | It is already off-machine. Extra copy: `git clone --mirror https://github.com/rajuvegesana98/designer-kid.git` (or `git bundle create designer-kid.bundle --all`) | After major changes |
| Published content + draft | Supabase `public.site_content` (and `content_history`) | (1) Admin → Publishing → Backup → **Download draft as JSON** (after a Publish the draft = published). (2) SQL Editor: `select data from site_content where id='published';` → export | After each significant publish |
| Whole database (all tables incl. `admins`, `profiles`, `events`, `submissions`, `reviews`, `content_history`, `auth.users`) | Supabase Postgres | Free plan: `pg_dump` / `supabase db dump` using the connection string from Supabase → Connect (needs the DB password). Pro plan: daily automatic backups in dashboard → Database → Backups. Current plan: **Unknown** (assumed free) | Weekly, and before running SQL |
| Media files | Supabase Storage bucket `media` (folders `documents`, `general`, `thumbnails`, `illustrations`, `profiles`, `courses`, `brand` — `src/data/supabaseStore.ts:254`) | **Not included in database dumps.** Download via dashboard → Storage → media, or a script using the Storage API / S3-compatible access | After uploads |
| Environment config | `.env.local`, GitHub Actions variables | Keep the variable *names* (ENVIRONMENT.md) and store values in a password manager | On change |
| Supabase settings | Dashboard (Auth URL config, SMTP, sign-up toggle, API keys) | Screenshot / written note — not exportable from the repo. Current values: **Unknown** | On change |
| GitHub settings | Settings → Pages (source = GitHub Actions), Variables, Environments | Written note (this doc + ENVIRONMENT.md) | On change |
| DNS | None today | If a domain is added: export zone / note records | On change |
| Learner progress | Each learner's browser | Learners download their own backup (`/profile`) | Learner's responsibility |

Example dump (run on any machine with PostgreSQL client tools; connection string from Supabase → Connect; never commit it):

```bash
pg_dump "postgresql://postgres.<ref>:<DB-PASSWORD>@<pooler-host>:5432/postgres" \
  --schema=public --no-owner --no-privileges -f designer-kid-public-$(date +%F).sql
```

(`auth` schema/users are best recreated rather than restored; **Inferred** — only one admin exists.)

### Disaster-recovery procedure

| Scenario | Recovery |
|---|---|
| Laptop lost | Part A on a new machine. Nothing is lost except `.env.local` (recreate) and local browser data |
| Bad code deploy | `git revert <sha> && git push`, or re-run an earlier successful Actions run (DEPLOYMENT.md §9) |
| Bad content publish | Admin → Publishing → Restore a version → Publish; or Import a JSON backup → Publish |
| Supabase project paused | Dashboard → Restore project; wait a few minutes; the site then loads live content again (it shows bundled seed content meanwhile) |
| Supabase project deleted / unrecoverable | 1. Create a new project. 2. SQL Editor → run `supabase/schema.sql`. 3. Restore data: `psql` your `pg_dump` file, or at minimum import content: create the admin (INSTALLATION.md §8), sign in, Publishing → Import JSON → Publish. 4. Re-upload media to bucket `media` with the **same paths** (content stores full public URLs that include the project ref, so URLs must be rewritten — search/replace the old `https://<old-ref>.supabase.co/storage/...` prefix in the JSON before importing; **Inferred** from `getPublicUrl` in `supabaseStore.ts`). 5. Set Auth URL configuration. 6. Update `.env.local` and GitHub variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. 7. Re-run the deploy workflow. 8. Verify with Part B |
| GitHub repo lost | Push a mirror/bundle to a new repo; Settings → Pages → Source: GitHub Actions; add the two Variables; push to `main`. The site URL changes if the owner/repo name changes → update Supabase Auth URLs, `tools/e2e/live*.mjs`, docs |
| GitHub account lost | Same as above under another account (URL changes) |
| Admin locked out | Supabase → Authentication → Users → reset password; or add another admin with the `insert into public.admins …` SQL |

---

## Part E — One-command / automated setup analysis

**No setup script exists, and none is created here.** A script (`scripts/setup.sh` or `npm run setup`) could automate the
local half; the hosted half needs dashboard access or extra credentials.

| Task | Automatable? | What the script would need |
|---|---|---|
| Check Node ≥ 22.22.0 | Yes | `node -e` version compare; could add `"engines": {"node": ">=22.22.0"}` + `.nvmrc` (neither exists today) |
| Install deps | Yes | `npm ci` |
| Create `.env.local` | Partly | Prompt for URL + publishable key, or read from a password manager CLI |
| Verify Supabase reachable / schema applied | Yes | `curl` the REST endpoints (STEP 7) |
| Run `schema.sql` / migrations | Only with extra credentials | Supabase CLI (`supabase link` + `supabase db push`, requires adopting `supabase/migrations` naming + an access token) or `psql` with the DB password. Today it is deliberately manual (no service key in the repo) |
| Create admin user | Only with the secret key or dashboard | Supabase Admin API needs the service_role key — must never be stored in this repo |
| Supabase Auth URL settings | Only via Management API + access token | — |
| GitHub Pages + variables | Yes with `gh` | `gh variable set VITE_SUPABASE_URL …`, `gh api` for Pages source |
| Test runner setup | Yes | `cd tools/e2e && npm install` (requires Chrome installed) |
| Start dev | Yes | `npm run dev` |

Conclusion: a realistic one-command setup is **`npm ci && cp .env.example .env.local && <fill 2 values> && npm run dev`**;
database, auth and GitHub configuration remain one-time manual steps documented above.
