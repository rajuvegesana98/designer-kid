# Deployment — build, hosting, database and rollback

How Designer Kid gets from a developer's machine to the live site. The app is a static single-page application built by
Vite and hosted on **GitHub Pages**; every push to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes
`dist/`. All dynamic data (published content, admin login, reviews, events, media) lives in **Supabase** and is reached
directly from the browser. Database changes are applied by hand in the Supabase SQL editor. Most content changes need no
deploy at all — the admin publishes them.

> **Status legend** — **Confirmed**: seen in code/config or verified at hand-off. **Inferred**: reasoned from code (reason given).
> **Unknown**: cannot be verified from the repository — the text says what to check.

Last verified: 30 Sep 2026 (docs v2.0)

---

## 1. Architecture

```text
 Developer machine                        GitHub                                   Visitors' browsers
 ─────────────────                        ──────                                   ──────────────────
 src/ + .env.local                        repo rajuvegesana98/designer-kid (public)
   │  npm run dev (Vite, :5173)             │
   │  npm run build (optional check)        │ push to main / manual "Run workflow"
   └── git push origin main ──────────────▶ GitHub Actions: deploy.yml
                                              job build  (ubuntu-latest, Node 22)
                                                npm ci → configure-pages → npm run build
                                                (BASE_PATH=/designer-kid/, VITE_SUPABASE_* from repo variables)
                                                upload-pages-artifact (dist/)
                                              job deploy
                                                deploy-pages ──────────▶ GitHub Pages (HTTPS)
                                                                          https://rajuvegesana98.github.io/designer-kid/
                                                                          static: index.html, 404.html, assets/*, favicon.svg
                                                                                   │
                                                                                   │ browser JS (supabase-js, publishable key)
                                                                                   ▼
                                                                         Supabase project zcxnlelzhkwbvittgcuj
                                                                           Postgres + RLS: site_content, content_history,
                                                                             admins, profiles, events, submissions, reviews
                                                                           Auth: admin email/password, reset emails
                                                                           Storage: public bucket "media"
                                                                                   ▲
 Supabase dashboard → SQL Editor ─ schema.sql / migrations (manual) ───────────────┘
 Admin (/admin in browser) ─ Publish → publish_content() RPC ──────────────────────┘
```

**Confirmed**: hosting, URL, workflow, variables and project ref were verified at hand-off; the rest is from
`deploy.yml`, `vite.config.ts`, `scripts/postbuild.mjs` and `src/data/`.

## 2. The workflow, step by step (`.github/workflows/deploy.yml`)

| Setting | Value |
|---|---|
| Triggers | `push` to `main`; `workflow_dispatch` (manual "Run workflow" button) |
| Permissions | `contents: read`, `pages: write`, `id-token: write` |
| Concurrency | group `pages`, `cancel-in-progress: true` (a newer push cancels an in-flight run) |

**Job `build`** (`runs-on: ubuntu-latest`):

| # | Step | What it does |
|---|---|---|
| 1 | `actions/checkout@v4` | Checks out the pushed commit |
| 2 | `actions/setup-node@v4` (`node-version: 22`, `cache: npm`) | Latest Node 22.x, npm cache keyed on `package-lock.json` |
| 3 | `npm ci` | Clean install from the lockfile |
| 4 | `actions/configure-pages@v5` (id `pages`) | Reads Pages settings; outputs `base_path` (`/designer-kid` on github.io, empty with a custom domain) |
| 5 | **Build**: `npm run build` with env `BASE_PATH=${{ steps.pages.outputs.base_path }}/`, `VITE_SUPABASE_URL=${{ vars.VITE_SUPABASE_URL }}`, `VITE_SUPABASE_ANON_KEY=${{ vars.VITE_SUPABASE_ANON_KEY }}` | `tsc -b && vite build && node scripts/postbuild.mjs` |
| 6 | `actions/upload-pages-artifact@v3` (`path: dist`) | Packages `dist/` as the Pages artifact |

**Job `deploy`** (`needs: build`, environment `github-pages`, URL from `steps.deployment.outputs.page_url`):

| # | Step | What it does |
|---|---|---|
| 1 | `actions/deploy-pages@v4` (id `deployment`) | Publishes the artifact to GitHub Pages |

Typical duration: ~1–2 minutes (`docs/OPERATIONS.md`). Recent runs succeeded (verified at hand-off).

## 3. Build and "start" commands

| Purpose | Command | Notes |
|---|---|---|
| Build | `npm run build` | `tsc -b` (typecheck) → `vite build` → `scripts/postbuild.mjs` |
| Build like Pages | `BASE_PATH=/designer-kid/ npm run build` | Set the Supabase vars in `.env.local` or the shell |
| Local production preview | `npm run preview` (`vite preview`, port 4173) | Use the same `BASE_PATH` you built with |
| Start in production | **None** | Static site: GitHub Pages serves `dist/`. No Node process, no server, no container |

`scripts/postbuild.mjs` does two things (**Confirmed**):

1. Scans every `.js/.html/.css` in `dist/` for `motion-studio|motionStudio|__MOTION_STUDIO`; exits 1 if found, so a build
   can never ship the dev-only Motion Studio panel.
2. Copies `dist/index.html` → `dist/404.html`.

## 4. BASE_PATH handling

- `vite.config.ts:10` sets Vite `base` from `process.env.BASE_PATH` (default `/`).
- Asset URLs in `index.html` and the bundle are prefixed with it at build time.
- `import.meta.env.BASE_URL` is used as the React Router `basename` (`src/App.tsx:90`), for preview links
  (`src/admin/state.tsx:174`) and for Supabase auth redirect URLs (`src/data/supabaseStore.ts:34`).
- On `github.io` project pages the site lives under `/designer-kid/`; the workflow sets that automatically.
  With a custom domain, `configure-pages` returns an empty base path, so `BASE_PATH` becomes `/` (workflow comment
  "Serve from /<repo>/ on github.io, or / on a custom domain").
- A build with the wrong base path loads a blank page (JS/CSS 404) — see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## 5. SPA fallback (`404.html`)

GitHub Pages has no rewrite rules. A deep link such as `/designer-kid/lesson/abc` has no file, so Pages returns its
`404.html` — which is a copy of `index.html` — with **HTTP status 404**. The app boots and the router renders the right
page. This is expected (`AGENTS.md` "Gotchas"). Side-effects: crawlers and monitoring tools see 404 for deep links.

## 6. SSL / HTTPS

GitHub Pages serves `*.github.io` over HTTPS automatically with GitHub's certificate. Nothing is configured in this repo.
For a custom domain, tick **Enforce HTTPS** in Settings → Pages once the certificate is issued. Supabase endpoints are HTTPS.

## 7. Domain

**No custom domain is configured** (verified at hand-off). To add one:

1. Buy a domain (~$10–15/year, `docs/OPERATIONS.md`).
2. GitHub → repo → Settings → Pages → **Custom domain** → enter it → Save. (With a workflow deployment no `CNAME` file is
   needed in `dist/`.)
3. At the DNS provider, per GitHub's Pages documentation (check the current values there):
   - subdomain (e.g. `www` or `learn`): `CNAME` → `rajuvegesana98.github.io`
   - apex domain: `A` records to GitHub Pages' published IPs (and optionally `AAAA`).
4. Wait for DNS + certificate, then tick **Enforce HTTPS**.
5. **Re-run the deploy workflow** so `BASE_PATH` becomes `/` (it is computed at build time).
6. Supabase → Authentication → URL Configuration: change Site URL and add `https://<domain>/**` to Redirect URLs.
7. Update the hard-coded live URL in `tools/e2e/live.mjs` / `live2.mjs` and in the docs.
8. Consider verifying the domain in GitHub account settings (protects against takeover).

## 8. Logs

| What | Where |
|---|---|
| Build/deploy logs | GitHub → repo → **Actions** → "Deploy to GitHub Pages" → a run → `build` / `deploy` jobs. CLI: `gh run list --repo rajuvegesana98/designer-kid --limit 5`, `gh run view <id> --log` |
| Pages status | GitHub → Settings → Pages; Environments → `github-pages` (deployment history) |
| Runtime errors (visitors) | Browser DevTools console only — no error-reporting service is integrated. Content load failures are logged and the app falls back to bundled seed content (`src/state/content.tsx:62-66,89`) |
| Database / API / Auth | Supabase dashboard → **Logs** (API/PostgREST, Postgres, Auth, Storage) and **Reports** |
| Admin activity | Admin → Analytics (reads `public.events`, including `content_published` events written by `publish_content`) |
| Content versions | Admin → Publishing → Version history (`public.content_history`, last 30 shown) |

## 9. Rollback

### Code (a bad deploy)

Option A — revert and push (preferred, keeps history):

```bash
git log --oneline -5
git revert <bad-commit-sha>          # creates a new commit
git push origin main                 # Actions rebuilds and redeploys (~1–2 min)
```

Option B — redeploy an earlier good run: GitHub → Actions → pick the last good "Deploy to GitHub Pages" run →
**Re-run all jobs**. (**Inferred**: re-running checks out that run's commit; the site then serves old code until the next
push to `main` deploys again. The build uses the *current* repository variables.)

Option C — `workflow_dispatch` on a branch/tag is **not** equivalent: the Pages environment may restrict which branches can
deploy (**Unknown** — check Settings → Environments → `github-pages` → deployment branch rules).

### Content (a bad publish)

Admin → **Publishing** → Version history → **Restore** on a good version → it loads into the *draft* → Preview → **Publish**.
(`src/admin/pages/Settings.tsx:38-77`.) No deploy needed. Admin → Publishing → Backup → "Import JSON" works the same way
with a downloaded backup file.

### Database schema

No automatic down-migrations exist. Every SQL file is written to be idempotent; to undo a policy/column you must write
and run the reverse SQL by hand. Take a backup first (see [MIGRATION.md](MIGRATION.md) §Backup).

## 10. Database deployment

- **Manual only.** There is no Supabase CLI config, no `supabase/config.toml`, no migrations runner and no service key in
  the repo (**Confirmed**). The owner pastes SQL into Supabase → SQL Editor → Run.
- Fresh project: run all of `supabase/schema.sql` (it already contains 002 and 003 at the end).
- Existing live project: run `supabase/migrations/002_user_management.sql` then `003_open_learning.sql`
  (both **not yet run** at hand-off), or re-run `schema.sql`.
- Convention (`AGENTS.md`): a new schema change = new idempotent file in `supabase/migrations/` **and** append it to `schema.sql`.
- Order vs code: deploy SQL **before** pushing code that depends on it (**Inferred**: e.g. Admin → Users → "Suspend
  account" writes `profiles.blocked`, a column that only exists after 002 has run; anonymous reviews need 003's policy).

## 11. What needs a deploy vs just an admin Publish

| Change | How it goes live |
|---|---|
| Lessons, courses, levels, challenges, resources, career guides, blog posts, announcements, achievements | Admin edit → **Publish** (no deploy) |
| Brand name, logo, favicon, colours, fonts, theme presets | Admin → Theme → **Publish** |
| Homepage, navigation, footer, 1:1 booking link, mentor profile, offers/banners, review settings | Admin → **Publish** |
| Media (images, PDFs) | Admin → Media upload (instant, Supabase Storage); referenced content still needs Publish |
| Review moderation (approve/feature/reply), learner/admin management | Instant (database writes) |
| React components, layouts, styles in `src/styles/`, new block types, new content *fields* | Code change → `git push` → deploy |
| Starter content in `src/content/seed/` | Deploy — and it only affects the live site for sections missing from the published document (via `withDefaults`); existing published content is **not** overwritten |
| `index.html` (fonts, meta), `public/favicon.svg` | Deploy |
| Supabase URL/key | Change GitHub variables → re-run the workflow |
| Tables, RLS policies, functions | Manual SQL in Supabase (no deploy), plus a deploy if code changes too |
| Supabase Auth settings (URLs, SMTP, sign-up toggle) | Supabase dashboard only |

## 12. Pre-deploy checklist

```bash
npx tsc --noEmit -p tsconfig.app.json
npm run build                         # must end with both ✓ lines from postbuild
# optional: browser tests (docs/TESTING.md)
git add -A && git commit -m "…"
gh auth status                        # push must use the account that owns the repo (rajuvegesana98)
git push origin main
gh run watch --repo rajuvegesana98/designer-kid     # or: gh run list --limit 1
node tools/e2e/live2.mjs              # optional live smoke test (needs playwright-core in tools/e2e)
```
