# Features — complete inventory

This is the feature inventory for Designer Kid (a UI/UX learning and career platform: React single-page app on
GitHub Pages, with Supabase for content, admin sign-in, reviews, media and anonymous analytics). Every row
records the real status of a feature, what it depends on across frontend, backend, database and external
integrations, and anything that stops it working today. Learner features and admin features are listed
separately. A verified content inventory is at the end. This file replaces the earlier short feature list
(written during the build). All of that list's information is kept here in the table rows.

Last verified: 30 Sep 2026 (docs v2.0)

> **v2.1 update:** per-page tab titles, crash recovery screen, SEO/social previews, sitemap, working deep links,
> Blog added to the menu automatically when posts exist, spam limits on reviews (after migration 004).

## Status legend

| Status | Meaning |
|---|---|
| **Complete** | Works end to end in production as designed |
| **Partially complete** | Works, but part of it is missing, not configured, or limited |
| **Prototype** | Works in a basic form, not production-grade |
| **Broken** | Code exists, but it fails in production today (the reason is given) |
| **Deprecated** | Code is present but no longer linked or intended for use |
| **Planned** | Requested or recommended, not built |
| **Unknown** | Cannot be verified from the repository |

Evidence labels used in Notes: **Confirmed** (seen in code or verified at hand-off), **Inferred** (reasoned
from code), **Unknown**.

Column meaning: *Frontend* = main React files. *Backend* = the `DataStore` call used (`src/data/types.ts`),
implemented by `supabaseStore.ts` (production) or `localStore.ts` (browser-only mode). *Database* = Supabase
table, RPC or storage used. *Integration* = external service.

## Production context that affects statuses (verified at hand-off)

- The base `supabase/schema.sql` has been run on the live project `zcxnlelzhkwbvittgcuj`.
  **`supabase/migrations/002_user_management.sql` and `003_open_learning.sql` have NOT been run.**
  - Without 003, the only INSERT policy on `reviews` is `"reviews: signed-in users write own"`, which requires
    `auth.uid() is not null` (`supabase/schema.sql` lines 192–194). Anonymous visitors cannot sign in, so
    **their reviews are rejected**.
  - Without 002, `profiles.blocked` does not exist (HTTP 400). There are no `"profiles: admin updates"` or
    `admins` management policies either, so suspending users and making or removing admins fails.
  - 003's review policy refers to `profiles.blocked`, so 003 must run **after** 002 (Inferred from SQL).
- The published content document dates from before the `promos`, `blog` and `reviews` sections existed.
  `withDefaults()` (`src/state/content.tsx` lines 25–34) fills these in from the bundled seed at runtime. The
  published `navigation` array therefore has **no Blog item**. Migration 003, or a Publish after using
  Admin → Blog → "Add Blog to the menu", adds it.
- No 1:1 booking URL is configured (the seed `mentor.bookingUrl` is empty, and the owner has not set one).

---

## 1. Learner features (no account needed)

| Feature | Status | Frontend | Backend | Database | Integration | Notes |
|---|---|---|---|---|---|---|
| Landing page | Complete | `src/pages/Landing.tsx` (shown at `/` until a level is chosen, and always at `/welcome`) | `loadPublished` | `site_content` (published) | — | Sections: hero, three learning paths, features, statistics (hidden while empty), testimonials (hidden while empty), reviews, 1:1 panel, latest blog posts, FAQ, final CTA. The active offer shows through `PromoLayer`. Seed content has 0 stats and 0 testimonials, so both are hidden (Confirmed) |
| Onboarding (level choice) | Complete | `src/pages/Onboarding.tsx` (`/start`) | `track('level_selected')` | `events` (anonymous insert) | — | "Where are you in your design journey?" with 3 animated level cards (arrow-key navigation) and an optional name. It saves `level`/`name` to localStorage and then goes to `/` |
| Learner dashboard | Complete | `src/pages/Dashboard.tsx` (`Home` at `/` once a level is chosen) | — | — | — | Greeting, **Continue learning**, progress (overall, lessons, modules, projects, streak, achievements), roadmap strip, up next (3), one challenge, Career Centre progress, important announcements, 1:1 panel, **From the blog** |
| Browser-saved progress | Complete | `src/state/learner.tsx` (localStorage key `dk.learner.guest`) | — | — | — | Completed lessons and challenges, career checklists, bookmarks, notes, active days (streak), last lesson, challenge work, notifications seen. By design it is per browser (Confirmed) |
| Progress backup / restore | Complete | `src/pages/Account.tsx` `ProfilePage` | — | — | — | Downloads `{app:'designer-kid', version:1, state}` JSON. Restoring **merges** the file with current progress (`mergeLearner`). Invalid files are rejected with a toast |
| Learn roadmap | Complete | `src/pages/Learn.tsx` (`/learn`, `/learn/:levelId`) | — | — | — | `/learn` redirects to the learner's level. Courses and modules are shown in order |
| All content always open (no locks) | Complete | `src/lib/progress.ts` `moduleLock()` (line 57) always returns `locked: false` | — | — | — | When `Level.sequential` is true, the learner sees a gentle "suggested after …" hint (Beginner has `sequential: true` in the seed) |
| Module page + module PDF workbook | Complete | `src/pages/Learn.tsx` `ModulePage` (`/learn/:levelId/:moduleId`) | — | — | — | "Download module PDF" link goes to `/print/module/...` |
| Lesson page | Complete | `src/pages/Lesson.tsx` (`/lesson/:lessonId`), `src/components/Blocks.tsx` | `track('lesson_completed')` | `events` | YouTube-nocookie / Vimeo embeds for video blocks | Cover illustration. Sections Learn → Example → Practice → Challenge. 15 block types, quizzes, Q&A, do/don't, downloads, bookmark, private notes, mark complete → next lesson. Unknown IDs show "Lesson not found" |
| Interactive widgets | Complete | `src/components/widgets.tsx` | — | — | — | 7 widgets: contrast checker, spacing scale, type scale, visual hierarchy, Auto Layout, grid playground, button states (`WIDGET_NAMES`, line 414). Used 15 times in seed lessons |
| Lesson covers / illustrations | Complete | `src/components/illustrationLibrary.tsx`, `src/lib/covers.ts` | — | — | — | 28 themed illustrations (`ILLUSTRATION_NAMES`). Covers are chosen automatically unless the admin picks one |
| Bookmarks | Complete | `src/components/BookmarkButton.tsx`, `src/pages/Progress.tsx` | — | — | — | Kinds: lesson, challenge, resource, guide (`BookmarkKind`) |
| Private notes per lesson | Complete | `src/pages/Lesson.tsx`, `src/pages/Progress.tsx` | — | — | — | Stored only in the browser |
| My Progress | Complete | `src/pages/Progress.tsx` (`/progress`) | — | — | — | Overview, 12-week activity, module progress, achievements, bookmarks, notes |
| Achievements | Complete | `src/lib/progress.ts` `achievementUnlocked()` | — | — | — | 15 achievements in the seed. They are **not editable in the admin** (no admin page writes `achievements`; Confirmed by grep) |
| Level switching | Complete | `src/components/LevelSwitcher.tsx` (Profile, Dashboard) | `track('level_selected')` | `events` | — | Every switch is logged as a new "start" in analytics (Inferred: this inflates "learners started") |
| Search palette (⌘K / Ctrl+K / "/") | Complete | `src/components/Search.tsx`, shortcuts in `src/components/AppShell.tsx` lines 99–105 | — | — | — | Searches lessons, modules, challenges, resources, career guides and articles. A bug where Enter re-opened the palette was fixed during the build |
| Search page | Complete | `src/pages/Account.tsx` `SearchPage` (`/search?q=&level=&cat=`) | — | — | — | Level and category filters |
| Challenges list + brief | Complete | `src/pages/Challenges.tsx` (`/challenges`, `/challenges/:id`) | — | — | — | 21 briefs (7 categories × 3 levels). Filters by level, category and status. "Challenge not found" for unknown IDs |
| Challenge self-review + submit (browser) | Complete | `src/pages/Challenges.tsx`, `learner.completeChallenge` | `track('challenge_submitted')` | `events` | — | Link and/or notes plus a self-review checklist. Submitting with unticked items asks for confirmation. The work is saved **only in the browser**, and an anonymous event is logged |
| Challenge submissions sent to admin | **Deprecated** (for learners) | `learner.tsx` line 161 | `submitChallenge` | `submissions` (insert needs `auth.uid()`) | — | Only a **signed-in** user's submission goes to the `submissions` table. Learners have no accounts, so the admin "Challenge submissions" tab stays empty (in practice only an admin testing while signed in could create rows) |
| Career Centre | Complete | `src/pages/Career.tsx` (`/career`, `/career/:section`) | — | — | — | Sections: Resume, LinkedIn, Portfolio, Job Search, Interviews, Networking. Guides for each level, checklists (saved in the browser), bullet builder, headline builder, case-study template, interview Q&A (44 questions), guide PDFs |
| Resources | Complete | `src/pages/Resources.tsx` (`/resources`) | — | — | Links to external sites | 28 curated links, filtered by level and type |
| Blog index + article | Complete | `src/pages/Blog.tsx` (`/blog`, `/blog/:slug`) | — | — | Web Share API or clipboard fallback | 12 articles, featured post, tags, search, share, PDF. In production the articles come from the seed via `withDefaults` (the published document has no `blog`) |
| Blog menu item (production) | **Partially complete** | `AppShell.tsx` renders `content.navigation` | — | `site_content.published.navigation` | — | The live published navigation has **no `/blog` item**. The blog is reachable from the landing page, dashboard and direct URL only. Fixed by migration 003, or by Admin → Blog → "Add Blog to the menu" → Publish |
| Notifications (bell) | Complete | `src/components/Notifications.tsx` | — | — | — | Derived on the client: announcements, lessons added in the last 30 days (`addedAt`), new challenges, course completion. Each type can be switched on or off by the admin. "Seen" is stored in the browser |
| Offers (banner / pop-up) | Complete | `src/components/Promo.tsx` `PromoLayer` (mounted in `App.tsx`) | — | published `promos` | — | Shows the first active bar and the first active pop-up. The pop-up appears after 1.2 s. Supports a schedule (start/end date), audience (everyone / new / returning), pages (all / home) and remembering dismissal (`dk.promo.<id>.v<version>`). Hidden on `/admin`, `/print` and `/account`. The seed offer is **off** |
| Reviews — read | Complete | `src/pages/Reviews.tsx` (`/reviews`), `ReviewsSection` on landing | `listReviews()` | `reviews` (public reads `approved`) | — | Featured reviews first |
| Reviews — write (anonymous) | **Broken** on production | `src/pages/Reviews.tsx` lines 115–133 | `submitReview(review, null, …)` | `reviews` INSERT with `user_id = null` | — | Rejected by RLS until **migration 003** runs (see production context). Works in browser-only mode. Client checks: name, rating, ≥20 characters, consent. The database requires 10–1200 characters, and the trigger forces `pending` while approval is required |
| 1:1 Connect panel | **Partially complete** | `src/components/MentorLink.tsx` `MentorSection` (landing, dashboard, reviews) | `track('booking_clicked')` | `events` | External booking tool (Calendly / Cal.com / Topmate …) | **No booking URL is configured.** The panel falls back to a `mailto:` button if a footer email is set, otherwise shows the badge **"Booking opens soon"**. The seed footer email is empty, so production currently shows "Booking opens soon" (Inferred from seed + hand-off facts). Sidebar and bottom-nav 1:1 links are hidden until a URL exists |
| Download PDF | **Partially complete** (by design) | `src/pages/Print.tsx` (`/print/lesson/:id`, `/print/module/:level/:module`, `/print/guide/:id`, `/print/blog/:id`) | — | — | Browser print dialog | No PDF library. The page opens the browser print dialog automatically ("Save as PDF"). Output depends on the browser |
| PDF / PPT inside lessons | **Partially complete** | `src/components/Blocks.tsx` `FileBlock` lines 43–60 | — | storage `media` | Microsoft Office Online viewer | PDFs embed inline. **PPT preview only works for public `https://` URLs** (via `view.officeapps.live.com`). Browser-only mode uses `data:` URLs, so no PPT preview. PPT files are never converted into editable slides |
| Profile & settings | Complete | `src/pages/Account.tsx` `ProfilePage` (`/profile`) | — | — | — | Name, switch level, appearance (site default / light / dark / system), backup/restore, reset progress |
| Dark mode / appearance | Complete | `src/state/ui.tsx` (`dk.colorMode`), `src/lib/theme.ts` | — | — | Google Fonts (loaded on demand) | The admin sets the default. The learner can override it |
| Responsive layout + mobile bottom nav | Complete | `src/components/AppShell.tsx`, `src/styles/global.css` | — | — | — | Checked by the e2e suites (mobile and tablet) |
| Accessibility basics | Complete (not formally audited) | Throughout | — | — | — | Skip links, ARIA roles on tabs and radiogroups, reduced motion respected, contrast checks in the Theme and Levels editors. No external audit is on record |
| 404 / not found | Complete | `src/pages/Account.tsx` `NotFound` (catch-all route), `scripts/postbuild.mjs` copies `404.html` | — | — | GitHub Pages | Deep links return HTTP 404 but still serve the app (expected on GitHub Pages) |
| Seed fallback when the backend is unreachable | Complete | `src/state/content.tsx` lines 61–66 | `loadPublished` | — | — | If loading fails, the bundled seed is shown and a warning is logged to the console |
| Preview mode (`?preview=1`) | Complete | `src/state/content.tsx` lines 36–84 | — | — | — | Shows the admin draft from localStorage `dk.preview.content` and updates live through `storage` events. It only works in the **same browser** as the admin editor |
| Learner accounts / sign-up | **Deprecated** | `AccountPage` has `tab` hard-coded to `'signin'` (`src/pages/Account.tsx` line 166). `auth.signUp`, `supabaseStore.signUp` remain | `signUp`, `loadLearner`/`saveLearner` | `profiles.state` | Supabase Auth | UI removed in commit `b0c7c24`. Supabase sign-ups may still be enabled at project level (**Unknown**: check Authentication → Sign In / Providers) |
| Account-synced progress | **Deprecated** | `src/state/learner.tsx` lines 57–89 | `loadLearner`/`saveLearner` | `profiles.state` | — | Runs only for a signed-in user, which in practice means an admin browsing the student site |
| Learner password reset | **Deprecated** (learners); used by admins | `/account?forgot=1`, `/reset-password` | `requestPasswordReset`, `updatePassword` | Supabase Auth | Supabase email | See the admin section |
| Motion Studio | **Prototype** (dev only) | `vite.config.ts` (plugin only for `vite serve`, off with `MOTION_STUDIO=off`) | — | — | `motion-studio` 2.1.0 | Excluded from production by `scripts/postbuild.mjs`. Verified: the panel loads in dev. Timing-edit preview **not verified**. Agent edits need a Motion Studio subscription and `@anthropic-ai/claude-agent-sdk` (not installed) |
| Certificates, cross-device sync, email notifications | Planned | — | — | — | — | Listed in `docs/NEXT_STEPS.md`. Not built |
| i18n / other languages | Planned (not started) | — | — | — | — | Hard-coded British English. `<html lang="en">` |

---

## 2. Admin features (`/admin`, lazy-loaded chunk)

Admin access requires a Supabase Auth user whose id is in `public.admins` (`is_admin()`). In browser-only mode
a button "Open admin for this browser" grants a demo admin instead (`localStore.enterDemoAdmin`).
See [ADMIN.md](ADMIN.md) for page-by-page detail.

| Feature | Status | Frontend | Backend | Database | Integration | Notes |
|---|---|---|---|---|---|---|
| Admin sign-in | Complete | `src/admin/AdminApp.tsx` `AdminLogin` | `signIn` | Supabase Auth + `rpc('is_admin')` | Supabase Auth | One admin exists (owner/admin email). Non-admins see "This account isn't an admin" with the SQL to grant access. The password field has a show/hide toggle (`PasswordInput`, latest commit) |
| Admin forgot / reset password | **Partially complete** | `/account?forgot=1` → email → `/reset-password` (`src/pages/Account.tsx`) | `requestPasswordReset` (`redirectTo = <site>/reset-password`), `updatePassword` | Supabase Auth | Supabase email (built-in ≈ 2 emails/hour) | Code is complete. Whether it works depends on the Supabase Auth **Site URL / Redirect URLs** and SMTP (**Unknown**) |
| Admin change password | Complete | `src/admin/pages/Settings.tsx` `AdminAccount` | `updatePassword`; "Email me a reset link" | Supabase Auth | — | Supabase mode only. Minimum 8 characters, must be entered twice |
| Suspended-account handling | **Broken** on production (depends on 002) | `src/state/auth.tsx` `accept()` | `toAppUser` reads `profiles.blocked` | `profiles.blocked` | — | Without 002, `blocked` is undefined, so nobody is ever treated as suspended |
| Dashboard (attention items + stats) | Complete | `src/admin/pages/Dashboard.tsx` `AdminDashboard` | `listLearners`, `listEvents(1000)`, `listSubmissions`, `listReviews(true)` | `events`, `profiles`, `submissions`, `reviews` | — | Unpublished changes, pending reviews, missing booking link, browser-only warning. Stats come from anonymous events |
| Analytics | **Partially complete** (anonymous) | `AnalyticsPage` (same file) | `listEvents(1000)` | `events` | — | Lessons completed per day (30 days, chart/table), starts by level, module funnel and top lessons/challenges. The funnel and top lists read `profiles.state`, which is **empty without accounts**. Counts are **events, not unique people**, and only the **latest 1000 events** are read |
| Courses (tree + module editor + slide editor) | Complete | `src/admin/pages/Courses.tsx`, `src/admin/SlideEditor.tsx`, `src/admin/BlocksEditor.tsx` | draft autosave | `site_content` (draft) | — | Level tabs. Course add/delete/reorder (arrows). Module add/delete/drag-reorder/publish. Lesson add/duplicate/move/delete/publish. PowerPoint-style slide editor (15 block types, undo/redo, attachments, covers, preview, PDF). "Focus mode" hides the tree |
| Blog admin | Complete | `src/admin/pages/Blog.tsx` | draft | `site_content` (draft) | — | List (search/filter), slide editor, cover photo or illustration, unique slug check, author, date, reading time, tags, featured, mark published, "Add Blog to the menu" |
| Challenges admin | Complete | `src/admin/pages/Challenges.tsx` | draft | `site_content` (draft) | — | Create/edit/delete. Level, category, difficulty, time, brief, context, requirements, constraints, expected outcome, checklist, published |
| Content library | Complete | `src/admin/pages/Library.tsx` | draft | `site_content` (draft) | — | Resources (drag order), career guides (slide editor, section, level, checklist), announcements, notification settings |
| Levels | Complete | `src/admin/pages/Levels.tsx` | draft | `site_content` (draft) | — | Enable/disable, rename, headline, description, icon, colour (with contrast check), recommended path, "Suggest an order" |
| Media library | Complete | `src/admin/pages/Media.tsx`, `src/admin/uploads.tsx` | `listMedia`/`uploadMedia`/`replaceMedia`/`deleteMedia` | storage bucket `media` (public read, admin write) | Supabase Storage | Images are resized in the browser (max 2000 px, WebP). 7 folders. Up to 50 MB per file (1.5 MB in browser-only mode). Shows whether each file is in use. Replace keeps the same URL. **Changes take effect immediately** (not part of the draft). Lists at most 500 files per folder |
| Users — list (admins/staff) | **Partially complete** | `src/admin/pages/Users.tsx` | `listLearners` | `profiles`, `admins` | — | Search, filter, CSV export. Learners have no accounts, so the list only shows auth users (in practice the admin) |
| Users — edit name / level, reset progress | **Partially complete** / likely no-op on production | same | `updateLearnerProfile`, `resetLearnerProgress` | `profiles` UPDATE | — | Without 002 there is no admin UPDATE policy on `profiles`. Updating another user's row matches 0 rows **without an error** (Inferred from RLS semantics). Editing your own row works |
| Users — suspend / restore | **Broken** on production | same | `updateLearnerProfile({blocked})` | `profiles.blocked` | — | The column is missing until 002 runs (HTTP 400) |
| Users — make / remove admin | **Broken** on production | same | `setAdmin` | `admins` INSERT/DELETE | — | There are no insert/delete policies on `admins` until 002. Cannot remove yourself (by policy and UI) |
| Users — send password reset | Partially complete | same | `requestPasswordReset(email)` | Supabase Auth | Supabase email | Subject to email limits and URL config (**Unknown**) |
| Users — challenge submissions tab | **Deprecated** | same (`?tab=submissions`) | `listSubmissions` | `submissions` | — | Always empty for learners (no accounts) |
| 1:1 Connect settings | Complete (setting) / not configured | `src/admin/pages/Connect.tsx` | draft + `listEvents` | `site_content` (draft), `events` | External booking tool | Show/hide, booking URL (validated `https://`), button label, mentor name/role/bio/photo/topics, click log (last 15). **No URL set yet** |
| 1:1 request workflow (pending/confirmed/…) | Planned → replaced | — | — | — | — | Replaced by an external booking link (owner decision; `docs/ORIGINAL_BRIEF.md`) |
| Reviews moderation | Complete | `src/admin/pages/Reviews.tsx` | `listReviews(true)`, `updateReview`, `deleteReview` | `reviews` (admin update/delete) | — | Pending / Approved / Hidden / All. Approve, hide, feature, reply, delete. **Takes effect immediately.** Review settings (allow, approval, show on home, title, prompt) are part of the draft and need Publish |
| Offers & banners | Complete | `src/admin/pages/Offers.tsx` | draft | `site_content` (draft) | — | Create, duplicate, delete. Bar or pop-up, colour, image or illustration, CTA, schedule, audience, pages, remember-dismissal, live preview. Editing content bumps `version` so offers people dismissed show again |
| Website (home / navigation / footer) | Complete | `src/admin/pages/Website.tsx` | draft | `site_content` (draft) | — | Hero, CTAs, hero image, features, stats, testimonials, FAQ. Navigation: order, rename, hide, add. Footer links, social links, copyright, contact email |
| Theme | Complete | `src/admin/pages/Theme.tsx`, `src/lib/theme.ts` | draft | `site_content` (draft) | Google Fonts | Brand name, tagline, logo and favicon with preview. 6 quick themes. Light and dark colours with contrast checks. 14 fonts. Sizes, weights, radii, shadows, borders, default mode. Live preview |
| Publishing (draft → preview → publish) | Complete | `src/admin/state.tsx`, `AdminApp.tsx` `PublishBar` | `saveDraft`, `publish` | `site_content`, `rpc('publish_content')`, `content_history` | — | Autosaves 1.2 s after the last edit. Preview updates live 250 ms after an edit. Publish writes published, draft and history in one transaction. "Discard draft" is available |
| Version history + restore | Complete | `src/admin/pages/Settings.tsx` `PublishingPage` | `listVersions` (latest 30), `loadVersion` | `content_history` | — | Restore loads a version **into the draft**. Publish is needed to go live. Browser-only mode keeps at most 5 versions (fewer if storage is full) |
| Backup / import (content JSON) | Complete | `PublishingPage` `BackupSection` | — | — | — | Download the draft as JSON. Import checks `schemaVersion === 1` and `levels` and shows a diff before replacing the draft |
| Settings (account, connection, map) | Complete | `src/admin/pages/Settings.tsx` `SettingsPage` | — | — | — | Your admin account (change password, email reset link), connection status, "where to change what", content summary |
| Browser-only (demo) admin | Complete (dev/demo) | `localStore.ts`, `AdminLogin` | localStorage | — | — | Everything lives in this browser (`dk.content.*`, `dk.media`, `dk.reviews`, …) under a ~5 MB limit. There is a banner warning |
| Achievements editor | Planned (not built) | — | — | — | — | Achievements are only in the seed and the content document |
| Admin audit log / roles | Planned (not built) | — | — | — | — | Only `content_published` events record who published (`content_history.author` = the admin's email) |

---

## 3. Content inventory (bundled seed, verified 30 Sep 2026)

Counted by loading `src/content/seed/index.ts` through Vite's SSR loader and counting the objects (not by
grep). These are the **seed** counts. The live published document was published once with the same lesson and
guide counts (182 lessons, 27 guides — verified at hand-off). Admin edits made after that are not counted here.

| Item | Count | Breakdown |
|---|---|---|
| Levels | 3 | Beginner (`sequential: true`), Intermediate, Expert — all enabled |
| Courses | 6 | 2 per level |
| Modules | 20 | Beginner 7 · Intermediate 8 · Expert 5 (2 are project modules) |
| **Lessons** | **182** | Beginner **79** (incl. 4 project lessons) · Intermediate **62** (incl. 8 project lessons) · Expert **41**. All published |
| Challenges | 21 | 7 per level. 3 per category: UI, UX, Figma, UX research, Design system, Product thinking, Portfolio |
| Resources | 28 | Article 14, Book 8, Tool 3, Template 1, Course 1, Community 1. Levels: all 6, beginner 8, intermediate 11, expert 3 |
| Career guides | 27 | 9 per level. Resume 6, LinkedIn 6, Interviews 6, Portfolio 3, Job search 3, Networking 3 |
| Interview Q&A | 44 questions | In the 3 "Interview questions & answers" guides |
| Blog articles | 12 | All published, 1 featured. Dated 2 Jun – 22 Sep 2026 (`blog.ts` 5 + `blogDesign.ts` 7) |
| Achievements | 15 | Not editable in admin |
| Announcements | 1 | "Welcome to Designer Kid" |
| Offers (promos) | 1 | "Free portfolio review week" pop-up, **disabled** |
| Navigation items (seed) | 8 | Home, Learn, Challenges, Career, Resources, My Progress, Blog, Reviews (the live published nav lacks Blog) |
| Homepage | — | 6 features, 0 stats, 0 testimonials, 5 FAQs |
| Footer | — | 4 links, 0 social links, contact email **empty** |
| Mentor (1:1) | — | Enabled, name set, **booking URL empty, photo empty**, 9 topics |
| Themed illustrations | 28 | `ILLUSTRATION_NAMES` |
| Interactive widgets | 7 | `WIDGET_NAMES` |
| Lesson block types | 15 | text, heading, callout, list, doDont, checklist, example, qa, quiz, illustration, image, file, video, interactive, link (`SlideEditor.tsx` `INSERT`) |
| Blocks used in seed lessons (learn + example) | 927 | callout 212, text 197, example 190, list 164, doDont 92, checklist 25, quiz 23, interactive 15, link 9 |
| Theme presets / fonts | 6 / 14 | `Theme.tsx` `PRESETS`, `lib/theme.ts` `FONT_OPTIONS` |
| Content document size | ≈ 756 KB JSON (≈ 244 KB gzipped) | Whole seed `SiteContent` serialised |

Seed files: `beginnerFoundations.ts`, `beginnerLaunch.ts`, `intermediateCraft.ts`, `intermediatePractice.ts`,
`expert.ts`, `library.ts` (challenges, resources, achievements), `careerProfiles.ts`, `careerInterviews.ts`,
`blog.ts`, `blogDesign.ts`, assembled in `index.ts`. Per `docs/SESSION_HISTORY.md`, the lessons were written by
parallel AI sub-agents working from a shared brief (documented during the session).

## 4. Publishing model (summary)

Every admin content edit autosaves to a **draft** (`site_content` row `draft`). **Preview** opens the real site
with `?preview=1` in the same browser, and it updates live. **Publish** calls `publish_content()`. That writes
the `published` row and the `draft` row, adds a `content_history` version and logs a `content_published` event.
**Exceptions that take effect immediately (no Publish):** review moderation, media uploads/replacements/deletes,
user management actions, and admin password changes. **Code changes** (new block types, new pages, schema) need
a git push to `main` → GitHub Actions deploy. Details are in [ADMIN.md](ADMIN.md).
