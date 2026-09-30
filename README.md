# Designer Kid

**Learn. Design. Build. Grow.** A UI/UX learning & career platform with three levels (Beginner, Intermediate,
Expert), 182 lessons, challenges, a Career Centre, a blog, reviews, 1:1 booking, and an admin studio where
every piece of content is edited like slides and published with Draft → Preview → Publish.

- **Live:** https://rajuvegesana98.github.io/designer-kid/ · **Admin:** `/admin`
- **Learners need no account** — progress saves in their browser (with backup/restore).
- **Stack:** Vite · React 19 · TypeScript · Motion · React Router · Supabase (free tier) · GitHub Pages

> AI agents and developers: read **[AGENTS.md](AGENTS.md)** first, then **[docs/](docs/README.md)**.

## Quick start
```bash
npm install
cp .env.example .env.local        # fill in the Supabase URL + publishable key (or leave empty for browser-only mode)
npm run dev                       # http://localhost:5173 (with Motion Studio)
npm run build                     # production build + checks
```
Node 22.13+ required.

## Documentation
| | |
|---|---|
| [AGENTS.md](AGENTS.md) | Architecture, rules, how to change things safely, gotchas |
| [docs/FEATURES.md](docs/FEATURES.md) | Everything learners and admins can do |
| [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) | How the owner edits, previews and publishes |
| [docs/OPERATIONS.md](docs/OPERATIONS.md) | Hosting, Supabase, keys, migrations, costs, deploying |
| [docs/ORIGINAL_BRIEF.md](docs/ORIGINAL_BRIEF.md) | Full original brief + follow-up requests + decisions |
| [docs/SESSION_HISTORY.md](docs/SESSION_HISTORY.md) | What happened during the build, in order |
| [docs/TESTING.md](docs/TESTING.md) | Typecheck, build and browser test suites |
| [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md) | Pending actions, limitations, ideas |

## Project layout
```
src/content/      content types + starter content (182 lessons, guides, blog, challenges…)
src/data/         DataStore interface → Supabase or browser-only implementation
src/state/        content (+live preview), admin auth, learner progress, theme & toasts
src/lib/          progress rules, content queries, theme engine, covers, markdown, icons
src/components/   app shell, lesson blocks, widgets, illustrations, search, offers, UI kit
src/pages/        learner pages (landing, dashboard, learn, lesson, career, blog, reviews, print…)
src/admin/        admin studio (lazy chunk): slide editor, pages, draft/publish state
supabase/         schema.sql + migrations/
tools/e2e/        Playwright browser test suites
.github/workflows deploy to GitHub Pages
```
