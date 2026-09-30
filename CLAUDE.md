# CLAUDE.md

Read [AGENTS.md](AGENTS.md) — it is the single source of truth for how this project is built and how to change it safely. Documentation index: [docs/README.md](docs/README.md) (full v2 audit: [docs/MASTER_SPECIFICATION.md](docs/MASTER_SPECIFICATION.md)).

## Hand-over notes (state as of 30 Sep 2026, v2.1.0, commit 09405c5)

- **Owner:** Harikrishna (brand) · GitHub `rajuvegesana98` · Supabase admin `rajuvegesana98@gmail.com`.
  Wants a free-hosted, admin-editable learning & career platform.
- **Deploy:** push to `main` → GitHub Actions → https://rajuvegesana98.github.io/designer-kid/. Always `npm run build` before pushing.
- **Node ≥ 22.22 required** (react-router engines).
- **`.env.local` is not in git.** Needs `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (publishable key only — never the service_role key) and `MOTION_STUDIO_AGENT_PROVIDER`. Values: Supabase dashboard → project `zcxnlelzhkwbvittgcuj` → Settings → API, or ask the owner.
- **No service key is available to agents.** The owner runs SQL themselves in the Supabase SQL editor — give them the SQL to paste, don't try to run it.

## Pending owner actions (not yet done as of 30 Sep 2026)

1. Run migrations 002 + 003 + 004 in the Supabase SQL editor (combined file `RUN_IN_SUPABASE_002_003_004.sql` from the V2.1 hand-off zip).
2. Disable public sign-ups in Supabase Auth.
3. Set Supabase Auth URL configuration (Site URL / redirect URLs → the GitHub Pages URL).
4. In Admin: set the 1:1 booking link, logo and footer.

Check with the owner whether these are done before relying on them.

## Gotchas

- Product rules in AGENTS.md (no learner accounts, content never locked, Draft → Preview → Publish, external booking link, honest content, British English) were decided by the owner — don't reverse them without asking.
- Filesystems may be case-insensitive (macOS/Windows): never create `src/components/illustrations.tsx` — `Illustrations.tsx` already exists.
- The owner prefers Safari. For automated browser checks, headless `playwright-core` with an installed Chrome worked better than the Chrome extension; run the dev server with `MOTION_STUDIO=off`.
