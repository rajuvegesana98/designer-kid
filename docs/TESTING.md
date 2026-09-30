# Testing

## Static checks
```bash
npx tsc --noEmit -p tsconfig.app.json     # must be clean
npm run build                             # typecheck + build + "no Motion Studio in dist" + 404.html
npx oxlint src                            # optional (React Compiler hints are warnings)
```

## Browser tests (Playwright + your installed Chrome)
The end-to-end scripts in [`tools/e2e/`](../tools/e2e) drive real user and admin journeys in headless Chrome.

```bash
# 1. start a test server in browser-only mode (no Supabase writes, no emails), without Motion Studio
MOTION_STUDIO=off VITE_SUPABASE_URL= npx vite --port 5181 --strictPort &
# 2. install the runner once (outside the app's dependencies)
cd tools/e2e && npm install playwright-core
# 3. run the suites
node e2e.mjs      # core student + admin journeys (14 checks)
node e2e2.mjs     # no-locks, covers, PDFs, interview Q&A, reviews, slide editor (10)
node e2e3.mjs     # blog, offers (bar + pop-up), theme preset + logo, new article (5)
node e2e4.mjs     # landing 1:1 + blog strip, dashboard, reset page, admin user tools (5)
node live2.mjs    # smoke test against the LIVE site (read-only)
```
Scripts use `channel: 'chrome'` (your installed Google Chrome). Screenshots of failures are written next to
the scripts (`shots*/`). All 34 checks passed at hand-off with no console errors.

## What's covered
Onboarding, dashboard, lesson completion, notes, bookmarks, search palette (incl. Enter re-open regression),
roadmap without locks, challenge submission, career tools, dark mode, mobile/tablet layouts, PDF views,
module workbook, interview Q&A, reviews (write → approve → feature → homepage), slide editor (inline edit,
insert, undo, PDF upload, preview), offers (pop-up dismissal memory, banner), theme presets + logo, blog
article publish, admin user management, reset-password page.
