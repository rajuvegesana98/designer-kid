# Technical debt register

This register lists the known technical debt and risks in Designer Kid as of hand-off. Every item was verified
against the code, configuration or tooling output (commands and file references are given). Each item states the
problem, why it matters, its impact, a suggested fix, and a priority. The items are recommendations for future
work. Nothing here has been changed in the code.

Last verified: 30 Sep 2026 (docs v2.0)

Priority legend: **P0** = fix now (production feature broken or data/security risk) · **P1** = next sprint ·
**P2** = planned improvement · **P3** = nice to have.

## Summary

| # | Item | Priority |
|---|---|---|
| 1 | Pending migrations 002/003 on the live database | P0 |
| 2 | Supabase Auth URL / SMTP configuration unverified | P0 |
| 3 | Missing live configuration (booking URL, photo, logo, footer email) | P1 |
| 4 | Dormant learner-account, sign-up and submission code | P1 |
| 5 | Supabase sign-ups possibly still enabled | P1 |
| 6 | Analytics: event cap, anonymous counts, empty funnels | P1 |
| 7 | `events` and `reviews` accept unlimited anonymous inserts | P1 |
| 8 | No automated tests in CI | P1 |
| 9 | Single JSON content document: size, last-write-wins | P1 |
| 10 | Whole-draft `structuredClone` + JSON diff on every edit | P2 |
| 11 | `withDefaults` backfills top-level sections only | P2 |
| 12 | `localStore` vs `supabaseStore` behaviour drift | P2 |
| 13 | `content_history` grows without limit | P2 |
| 14 | Bundle size (main + seed chunks ≈ 246 KB + 243 KB gzip) | P2 |
| 15 | Lint: 70 warnings (React Compiler rules) | P2 |
| 16 | No unit tests | P2 |
| 17 | Image picker uploads are not resized | P2 |
| 18 | Preview only works in the same browser | P3 |
| 19 | Inline styles vs CSS design system (775 `style={{`) | P3 |
| 20 | No i18n | P3 |
| 21 | Outdated / inconsistent UI copy | P3 |
| 22 | Achievements not editable; `module_completed` never tracked | P3 |
| 23 | SPA SEO / deep-link 404 status | P3 |
| 24 | Secrets hygiene in docs | P3 |
| 25 | No error monitoring | P2 |

---

### 1. Pending database migrations 002 and 003 — **P0**

- **Problem:** `supabase/migrations/002_user_management.sql` and `003_open_learning.sql` have not been run on
  the live project (verified at hand-off: `profiles.blocked` → HTTP 400; the published navigation has no `/blog`).
- **Why it matters:** anonymous review INSERTs hit the base policy `"reviews: signed-in users write own"`
  (`auth.uid() is not null`, `supabase/schema.sql` lines 192–194), so every learner review is rejected. Suspend
  and make/remove-admin fail, admin edits to other users' profiles silently update 0 rows, and suspended-account
  checks never trigger.
- **Impact:** the Reviews feature is broken for its intended users. The admin Users page is misleading.
- **Suggested solution:** in the Supabase SQL editor, run 002 **then** 003 (003's policy references
  `profiles.blocked`). Verify: `GET /rest/v1/profiles?select=blocked&limit=1` returns 200, submit a test review
  anonymously, and check that the menu shows Blog. Then add a migration-tracking table or adopt the Supabase CLI
  (`supabase/migrations` + `supabase db push`) so drift is visible.

### 2. Supabase Auth URL configuration and SMTP unverified — **P0**

- **Problem:** `requestPasswordReset` redirects to `<origin><base>reset-password`
  (`src/data/supabaseStore.ts` line 100). Whether this URL is in Supabase → Authentication → URL Configuration,
  and whether custom SMTP is set, is **Unknown**. The built-in sender allows about 2 emails/hour.
- **Why it matters:** the admin is the only account. A failed reset email could lock the owner out.
- **Impact:** admin recovery path.
- **Suggested solution:** set the Site URL `https://rajuvegesana98.github.io/designer-kid/` and Redirect URLs
  (`…/designer-kid/**`, `http://localhost:5180/**`, per `docs/OPERATIONS.md`). Configure SMTP (e.g. Resend).
  Test "Forgot password?" end to end. Consider adding a second admin.

### 3. Missing live configuration — **P1**

- **Problem:** the seed has `mentor.bookingUrl`, `mentor.photo`, `footer.email`, `brand.logoUrl` and
  `brand.faviconUrl` all empty. The owner has not set them (verified at hand-off for the booking URL).
- **Why it matters:** 1:1 is the core conversion path, and it shows "Booking opens soon".
- **Suggested solution:** Admin → 1:1 Connect, Theme, Website → Footer → Publish. No code change needed.

### 4. Dormant learner-account, sign-up and submission code — **P1**

- **Problem:** after `b0c7c24`, learner accounts are gone from the UI, but the code remains:
  `AccountPage` keeps a `'signup'` branch behind `const tab = 'signin'` (`src/pages/Account.tsx` line 166).
  `AuthCtx.signUp` and `DataStore.signUp`/`loadLearner`/`saveLearner`/`submitChallenge`/`listSubmissions` remain.
  `learner.tsx` lines 57–89 sync progress to `profiles.state` for any signed-in user. The Users page has a
  "Challenge submissions" tab and learner filters. The Dashboard labels `signup` events.
- **Why it matters:** dead paths confuse maintainers and AI agents, add bundle weight, and make the admin UI
  suggest features that cannot work (for example, "Signed-in students' challenge submissions appear here").
  An admin browsing the student site has their own progress synced into `profiles.state` (side effect).
- **Impact:** maintenance cost, misleading UI.
- **Suggested solution:** decide explicitly. Either **delete** the account paths (auth → admin-only, remove the
  submissions tab, simplify Users into "Admins"), or move them behind a feature flag
  (`content.features.accounts`) with tests. Update AGENTS.md accordingly.

### 5. Supabase public sign-ups possibly enabled — **P1**

- **Problem:** whether "Allow new users to sign up" is on is **Unknown**. `handle_new_user()` creates a
  `profiles` row and a `signup` event for any new auth user.
- **Why it matters:** anyone could create accounts through the Supabase API with the public key (they could not
  become admin, but they would use MAU quota and could spam `profiles`).
- **Suggested solution:** disable public sign-ups in Supabase Auth settings (`docs/NEXT_STEPS.md` item 4) and
  create admins manually.

### 6. Analytics limits — **P1**

- **Problem:** `useAnalytics()` loads only `listEvents(1000)` (`src/admin/pages/Dashboard.tsx` line 21), and
  all stats, including "all time", are computed from those rows in the browser. "Learners started" counts
  `level_selected` events, so level switches count again. The module funnel and top lessons/challenges read
  `profiles.state`, which is empty without accounts. `completionRate`/`coursesDone` are hard-coded to 0.
  `module_completed` is never tracked.
- **Why it matters:** once there are more than 1000 events, totals plateau and the numbers mislead the owner.
- **Impact:** decision-making on content.
- **Suggested solution:** move aggregation into SQL (views or RPCs such as `count(*) group by type, date`,
  admin-only). Track an anonymous `visitor_id` (random UUID in localStorage) to estimate unique learners. Track
  `lesson_completed` with the lesson ID (not only the title). Remove the dead funnel or feed it from events.

### 7. Unbounded anonymous inserts into `events` (and `reviews` after 003) — **P1**

- **Problem:** the policy `"events: anyone inserts own"` allows any client with the public key to insert
  unlimited rows (`detail` ≤ 300 characters). After 003, `reviews` also accepts anonymous inserts (moderated,
  but stored). There is no rate limiting, captcha or retention.
- **Why it matters:** the free plan has a 500 MB DB. Spam could fill it or pollute analytics. The table grows
  forever even without abuse.
- **Suggested solution:** add a retention job (`pg_cron`: delete events older than N months, or roll them up
  into a daily aggregate table). Rate-limit through an Edge Function or a `check` on per-IP insert frequency.
  Add a honeypot field or hCaptcha (supported by Supabase) to the review form.

### 8. No automated tests in CI — **P1**

- **Problem:** `.github/workflows/deploy.yml` runs only `npm ci` and `npm run build` (typecheck + build +
  postbuild guard). The Playwright suites in `tools/e2e/*.mjs` (34 checks) are run **manually** against a local
  dev server on port 5181, need a local Chrome (`channel: 'chrome'`), and install `playwright-core` separately.
  Lint is not run in CI.
- **Why it matters:** regressions (for example, the search palette or dialog clipping bugs found during the
  build) can ship unnoticed on any push to `main`.
- **Suggested solution:** add a `test` job before `deploy`. Install Playwright with its bundled Chromium
  (`npx playwright install --with-deps chromium`), start `MOTION_STUDIO=off VITE_SUPABASE_URL= npx vite
  --port 5181` in the background, run e2e–e2e4, and upload screenshots on failure. Run `npx oxlint src` with
  `--deny-warnings` once the warnings are fixed. Consider PR-based deploys instead of direct pushes.

### 9. Single JSON content document — **P1**

- **Problem:** all content (~756 KB JSON, ~244 KB gzipped for the seed) lives in one `site_content` row. Every
  autosave upserts the whole document (`saveDraft`). Every publish copies it three times (published, draft,
  history). Every visitor downloads the whole published document on each page load (`loadPublished`). There
  is no locking, so two admins or tabs overwrite each other (last autosave wins, silently).
- **Why it matters:** size grows with every lesson, article and embedded `data:` URL. Load time, egress (5 GB
  free) and conflict risk grow with it. There is no per-item history.
- **Impact:** performance and data loss with more than one editor.
- **Suggested solution:** short term: add optimistic concurrency (store `updated_at`/a revision number and
  reject a save if the stored row is newer, then prompt to reload). Cache the published document via a
  CDN-friendly URL (e.g. publish a static JSON to Storage). Longer term: split into tables or per-section
  documents (levels, blog, settings) so learners load only what a page needs, and edits touch small rows.

### 10. Whole-draft `structuredClone` and JSON diffs on every edit — **P2**

- **Problem:** `useAdmin().update()` clones the entire draft on every keystroke-commit
  (`src/admin/state.tsx` line 146; measured ≈ 1.8 ms per clone of the seed on the build machine). The
  `useMemo` then runs `diffSections()`, which `JSON.stringify`s 16 sections of both documents. The preview
  writes the whole draft to localStorage after 250 ms. The Media page stringifies draft + published on each
  render (`Media.tsx` line 60).
- **Why it matters:** fine at the current size, but it scales with content and runs on low-end laptops. A large
  draft could exceed the localStorage quota (preview silently stops updating).
- **Suggested solution:** use structural sharing (Immer `produce`) so unchanged subtrees keep their identity, and
  diff by reference. Throttle the preview writes. Compute media usage with `useMemo`.

### 11. `withDefaults` backfills only top-level sections — **P2**

- **Problem:** `withDefaults()` (`src/state/content.tsx` lines 25–34) only fills **missing top-level keys**. New
  nested fields (for example, a new property on `theme.fonts`, `mentor`, `Level` or `Lesson`) are **not**
  backfilled in older published documents. They arrive as `undefined`, and components must defend against that.
- **Why it matters:** the published live document already predates three sections. Future schema additions are
  likely to cause runtime errors or blank UI.
- **Suggested solution:** introduce `schemaVersion` migrations (`migrate(content): SiteContent` step functions,
  run on load and before publish), or a deep-merge with defaults for settings objects. Add a unit test that loads
  an old fixture.

### 12. `localStore` vs `supabaseStore` feature drift — **P2**

- **Problem:** the two implementations behave differently. Local: at most 5 versions, 1.5 MB media, 200 events,
  no passwords/admin management, demo admin without a password, reviews auto-status computed in the client,
  `updateLearnerProfile` ignores `blocked`, and `replaceMedia` changes the item's name/date. Supabase: the review
  status comes from a trigger, and `submitReview` returns a synthetic object with an empty `id`.
- **Why it matters:** the e2e suites run only in browser-only mode (`VITE_SUPABASE_URL=`), so Supabase-specific
  paths (RLS, triggers, migrations) are **untested**. That is how the review-insert failure went unnoticed.
- **Suggested solution:** add a contract test suite for `DataStore` run against both implementations, including
  a local Supabase (`supabase start`) in CI. Document the intentional differences in `data/types.ts`.

### 13. `content_history` grows without limit — **P2**

- **Problem:** every publish inserts a full copy (≈ 0.75 MB raw; Postgres TOAST compresses it). There is no
  pruning, and the UI shows only the latest 30.
- **Suggested solution:** keep the last N versions plus monthly snapshots (`pg_cron`), or store diffs.

### 14. Bundle size — **P2**

- **Problem:** measured from `dist/assets` (build of 30 Sep, `gzip -9`): `index-*.js` 861 KB raw / **246 KB
  gzip**; `seed-*.js` 736 KB / **243 KB gzip** (lazy, but loaded whenever `withDefaults` has to backfill — which
  it does on production today because the published document lacks sections); `AdminApp-*.js` 184 KB / 48 KB;
  CSS 45 KB / 9 KB. (`docs/NEXT_STEPS.md` quoted about 190 KB for the main bundle. That figure was measured
  differently or on an earlier build.)
- **Why it matters:** mobile learners on slow networks. The seed chunk loads for every visitor until a full
  Publish writes all sections.
- **Suggested solution:** Publish once from the admin (so `withDefaults` no longer needs the seed). Route-level
  `lazy()` for Lesson/Career/Blog/Print/widgets/illustration library. Lazy-load `@supabase/supabase-js` auth
  parts. Measure with `vite build --mode analyze` / rollup visualiser.

### 15. Lint warnings — **P2**

- **Problem:** `npx oxlint src` reports **70 warnings, 0 errors** (run 30 Sep 2026): `react(only-export-components)`
  45, `react(set-state-in-effect)` 10, `react(refs)` 7, `react(purity)` 3,
  `react(preserve-manual-memoization)` 3, `react(static-components)` 2. Most are in `src/admin/state.tsx` (11)
  and `src/state/content.tsx` (5). Several are React Compiler diagnostics: refs read during render
  (`SlideEditor.tsx` 335, 392), `Date.now()` in render (`admin/pages/Dashboard.tsx` 215), setState in effects.
  `tsc --noEmit -p tsconfig.app.json` is clean.
- **Why it matters:** these patterns break memoisation or fast refresh, and can cause stale UI if the React
  Compiler is adopted.
- **Suggested solution:** split mixed component/helper files (for example, move `useAnalytics`/`computeStats`
  out of `Dashboard.tsx`, move helpers out of `state.tsx`). Derive state instead of setting it in effects. Then
  enforce lint in CI.

### 16. No unit tests — **P2**

- **Problem:** there is no test runner in `package.json`. Pure logic (`lib/progress.ts` streaks,
  `achievementUnlocked`, `mergeLearner`, `nextLesson`; `lib/content.ts` `studentView`; `promoIsActive`;
  `diffSections`; `withDefaults`; slug/ID helpers) is untested.
- **Suggested solution:** add Vitest (native to Vite) with focused tests for these functions, and a fixture of
  the current live document.

### 17. Image picker uploads are not resized — **P2**

- **Problem:** only the Media page runs `optimise()` (downscale to 2000 px WebP). `MediaPicker` (used by every
  `ImageField`: logo, hero, mentor photo, blog cover, offer image) uploads the original file
  (`src/admin/fields.tsx` line 159).
- **Why it matters:** multi-MB photos slow pages and use the 1 GB storage / 5 GB egress quota.
- **Suggested solution:** share `optimise()` from a common module and call it in `MediaPicker.upload`.

### 18. Preview only works in the same browser — **P3**

- **Problem:** preview reads `localStorage['dk.preview.content']` (`src/state/content.tsx`), so a preview link
  cannot be shared or opened on a phone.
- **Suggested solution:** for signed-in admins, preview could load `site_content` id `draft` from Supabase
  (RLS already allows admins to read it).

### 19. Inline styles vs CSS design system — **P3**

- **Problem:** 775 `style={{ … }}` occurrences across `src/` duplicate spacing, sizes and colours that also exist
  as CSS classes or tokens in `src/styles/global.css` (1118 lines).
- **Why it matters:** theme changes and consistency. Several inline hex colours (e.g. `#B7791F` star,
  `#15161c` dark tone) bypass theme tokens.
- **Suggested solution:** extract repeated inline patterns into utility classes or components, and lint for
  hex literals in TSX.

### 20. No internationalisation — **P3**

- **Problem:** all UI strings are hard-coded British English in components. `<html lang="en">`. Dates use a
  mix of `toLocaleDateString(undefined, …)` and ISO strings.
- **Suggested solution:** if other languages are wanted, extract strings (e.g. `i18next` or a small dictionary)
  and add a `locale` to `SiteContent`.

### 21. Outdated or inconsistent UI copy — **P3**

- **Problem:** Admin Settings browser-only steps say "Sign up on the site, then make your account an admin"
  (`Settings.tsx` ~line 172), but sign-up is removed. The Admin Dashboard says "Students won't see 'Connect
  1:1' until you add it", yet `MentorSection` still shows with a fallback. Users empty state: "Learners
  appear here after they create an account". The analytics empty state mentions "as learners sign up".
- **Suggested solution:** update the copy as part of item 4.

### 22. Achievements not editable; unused event type — **P3**

- **Problem:** there is no admin UI for `achievements` (15 in the seed). The `module_completed` event type is
  defined (and allowed by the DB check) but never emitted.
- **Suggested solution:** add a simple achievements editor (rule type + threshold) or document them as code-owned.
  Emit `module_completed` from `completeLesson` when a module finishes.

### 23. SPA SEO and deep-link status codes — **P3**

- **Problem:** GitHub Pages serves deep links through `404.html` with HTTP 404. There is one static `<title>`/meta
  for all pages, and no sitemap or per-article Open Graph tags.
- **Why it matters:** blog articles are hard to index and share with previews.
- **Suggested solution:** prerender public routes (blog, lessons) at build time, or host on a platform with SPA
  rewrites (Cloudflare Pages / Netlify) and generate `sitemap.xml`.

### 24. Secrets hygiene in the docs — **P3**

- **Problem:** `docs/OPERATIONS.md` contains the literal publishable key value and the admin email. The
  publishable key is browser-safe and already in the built JS, but copying it into docs makes rotation harder.
- **Suggested solution:** refer to variables by name only (as the v2.0 docs do) and keep values in `.env.local`
  / GitHub variables.

### 25. No error monitoring — **P2**

- **Problem:** runtime errors only reach `console.error`. The content load fallback silently shows the seed, and
  analytics failures are swallowed (`.catch(() => {})`).
- **Why it matters:** if Supabase pauses (free plan, ~1 week idle) or the published document fails to load, the
  owner will not know. Learners see older seed content.
- **Suggested solution:** add a lightweight error reporter (e.g. Sentry free tier), and an uptime ping that also
  keeps the Supabase project awake, or upgrade to Pro.
