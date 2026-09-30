# Admin panel — complete documentation

This document describes the Designer Kid admin studio at `/admin`: how to sign in, how the navigation is
organised, and what each page does. For every page it covers where the data is stored, what takes effect
immediately and what needs **Publish** or a **code deploy**, which permissions apply, and what is missing. It
also covers the draft/publish model, preview, version history, backup/import, and the differences in
browser-only mode. It includes and extends the owner-facing [ADMIN_GUIDE.md](ADMIN_GUIDE.md), which is kept as
a short task guide.

Last verified: 30 Sep 2026 (docs v2.0)

Evidence labels: **Confirmed** (seen in code or verified at hand-off) · **Inferred** (reasoned from code) ·
**Unknown** (cannot be verified from the repository — what to check is stated).

---

## 1. Where admin data lives (the key concept)

```text
                           ┌──────────────────── Supabase (project zcxnlelzhkwbvittgcuj) ─────────────────────┐
Admin edits content  ──►   │ site_content  id='draft'      ← autosave (upsert, admins only)                   │
(Courses, Blog, …)         │ site_content  id='published'  ← rpc publish_content() only (security definer)    │
                           │ content_history               ← one full copy per publish (admins read)          │
                           │ events                        ← anonymous analytics + 'content_published'        │
Direct (no draft) ──────►  │ reviews                       ← moderation updates/deletes (admins)              │
                           │ storage bucket 'media'        ← uploads/replace/delete (admins write, public read)│
                           │ profiles, admins              ← Users page (needs migration 002 for most actions)│
                           │ auth.users                    ← sign-in, password change/reset (Supabase Auth)   │
                           └───────────────────────────────────────────────────────────────────────────────────┘
Learners read: site_content.published (+ seed backfill), approved reviews, public media URLs.
```

| Change type | Takes effect | How |
|---|---|---|
| Content in the `SiteContent` document (courses, lessons, blog, challenges, resources, career guides, announcements, notification settings, levels, website, theme, brand, offers, 1:1 settings, review *settings*) | **After Publish** | Draft autosave → Publish |
| Review moderation (approve, hide, feature, reply, delete) | **Immediately** | Direct `reviews` table update |
| Media upload / replace / delete | **Immediately** (replace keeps the same URL, so live pages change at once) | Supabase Storage |
| User actions (name, level, suspend, admin, reset progress, send reset email) | **Immediately** (where RLS allows) | `profiles`, `admins`, Supabase Auth |
| Admin password change | **Immediately** | Supabase Auth |
| New block types, new pages, new admin fields, achievements, email/booking integrations, DB schema | **Code deploy** (push to `main` → GitHub Actions) and/or SQL in the Supabase SQL editor | Developer |

Permissions: all admin writes rely on Row Level Security (RLS) and `public.is_admin()`
(`supabase/schema.sql` lines 13–16). This function checks that `auth.uid()` is in `public.admins`. The admin UI
itself is only a convenience: `AdminApp` shows the studio when `user.isAdmin` (from `rpc('is_admin')`), but the
database is what enforces access.

---

## 2. Signing in

| Step | Detail |
|---|---|
| URL | `https://rajuvegesana98.github.io/designer-kid/admin` |
| Supabase mode | Email + password (`AdminLogin`, `src/admin/AdminApp.tsx` lines 257–304). The password field has a show/hide toggle (`PasswordInput`, `src/components/ui.tsx`) |
| Who can sign in | Any Supabase Auth user can authenticate. Only users in `public.admins` see the studio. Others see "This account isn't an admin" plus the SQL `insert into public.admins …` |
| Current admins | One (the owner/admin email). Verified at hand-off |
| Forgot password | "Forgot password?" → `/account?forgot=1` → email link → `/reset-password` (see [USER_FLOWS.md](USER_FLOWS.md) §15). Requires Supabase Auth **Site URL / Redirect URLs** to include the site (**Unknown** whether set). The built-in email sender allows about 2 emails/hour |
| Suspended accounts | Signed out on sign-in with a message. Needs `profiles.blocked` (**migration 002 not run** → never triggers) |
| Browser-only mode | No Supabase env vars → "Open admin for this browser" button (demo admin stored in `dk.demoAdmin`) |
| Session | Supabase JS persists the session in browser storage (`persistSession: true`, implicit flow). Sign out is the top-bar icon, or the "Sign out" item in the mobile menu |

---

## 3. Layout and navigation

```text
┌ Sidebar ─────────────────┐ ┌ Top bar ─────────────────────────────────────────────────────────┐
│ Admin · Designer Kid     │ │ ☰ <page title>   "Draft saved 2m ago" [N unpublished] [Preview]   │
│ OVERVIEW                 │ │                  [Publish] [☾/☀] [Sign out]                       │
│   Dashboard  Analytics   │ └───────────────────────────────────────────────────────────────────┘
│ CONTENT                  │  Browser-only banner (local mode only)
│   Courses  Challenges    │
│   Blog  Content library  │  <page>
│   Levels  Media          │
│ PEOPLE                   │
│   Users  1:1 Connect     │
│   Reviews                │
│ SITE                     │
│   Offers & banners       │
│   Website  Theme         │
│   Publishing  Settings   │
│ ← View student site      │
└──────────────────────────┘
```

Defined in `NAV` (`src/admin/AdminApp.tsx` lines 29–46). Routes are `/admin`, `/admin/analytics`,
`/admin/courses`, `/admin/challenges`, `/admin/blog`, `/admin/content`, `/admin/levels`, `/admin/media`,
`/admin/users`, `/admin/connect`, `/admin/reviews`, `/admin/offers`, `/admin/website`, `/admin/theme`,
`/admin/publishing`, `/admin/settings`. Unknown `/admin/*` paths redirect to `/admin`. On mobile the sidebar is
a sheet opened by ☰. The admin bundle is a separate lazy chunk (`AdminApp-*.js`, ≈ 184 KB raw / 48 KB gzip),
so learners never download it.

---

## 4. The publish model

```text
edit ──► useAdmin().update(recipe)
          │ structuredClone(whole draft) → recipe mutates the clone → setDraft(clone)
          ├──(250 ms)──► localStorage 'dk.preview.content'  ──► ?preview=1 tabs update live
          └──(1200 ms)─► store.saveDraft() → site_content 'draft' upsert → "Draft saved …"
                         (error → "Draft not saved" + Retry)
top bar: changedSections = diffSections(published, draft)  (JSON compare of 16 sections)
Publish ─► dialog (changed sections, "major change" warning for Levels & courses / Theme / Navigation,
           optional version note; default note = the changed section names)
        ─► rpc publish_content(content, note):
             published := content; draft := content; content_history += (content, note, author email);
             events += content_published
        ─► students get it on their next page load (no deploy)
Discard draft ─► draft := copy of published (confirm dialog)
```

- **Preview** (`openPreview(path)`) opens `<path>?preview=1` in a window named `dk-preview`. The student site
  then reads the draft from `localStorage` and follows `storage` events. **It only works in the same browser
  profile as the editor.** You cannot send a preview link to someone else.
- **Unsaved-edit protection**: a `beforeunload` prompt appears while the draft is dirty.
- **First publish**: if nothing has been published yet, the publish bar offers "Initial publish of starter
  content" (seed).
- **Section labels** (what "changed sections" can show): Brand, Theme, Homepage, Navigation, Footer, 1:1 Connect,
  Reviews settings, Notification settings, Levels & courses, Challenges, Resources, Career guides,
  Announcements, Achievements, Offers & banners, Blog (`SECTION_LABELS`, `src/admin/state.tsx` lines 28–45).
- **Unpublished items**: each course, module, lesson, challenge, resource, guide, announcement and blog post
  has its own `published` flag, and levels have `enabled`. `studentView()` (`src/lib/content.ts`) removes
  anything not published even after a site Publish. So "Mark as published" on an item **and** a site Publish
  are both needed.
- **Concurrency**: there is no locking. Two admins (or two tabs) editing at once overwrite each other's draft
  (the last autosave wins). Publish sends the whole document (Inferred from `saveDraft`/`publish`).

## 5. Version history, backup and import

| Function | Where | Behaviour |
|---|---|---|
| Version history | Publishing page | Lists the latest **30** versions (`listVersions` `.limit(30)`), each with note, date and author email. The first is marked "Live". Older versions stay in `content_history` but are not listed (Inferred) |
| Restore | Publishing → Restore | Loads that version **into the draft** (`replaceDraft`). Preview, then Publish, to make it live |
| Download backup | Publishing → "Download draft as JSON" | `designer-kid-content-YYYY-MM-DD.json` (the whole draft, ≈ 0.75 MB for seed-sized content) |
| Import backup | Publishing → "Import JSON" | Accepts only `schemaVersion === 1` with a `levels` array. Shows which sections differ, then replaces the draft. Publish to go live |
| Retention | Supabase | No automatic pruning. Every publish stores a full copy (Confirmed: no delete policy or job) |

---

## 6. Page reference

Each section follows the same order: **Controls** · **Stored in** · **Takes effect** · **Permissions** ·
**Missing / limitations**.

### 6.1 Dashboard (`/admin`) — `src/admin/pages/Dashboard.tsx`

- **Controls:** read-only overview. "Needs attention" items: unpublished changes (with section names), pending
  reviews count (→ Reviews), missing 1:1 booking link (→ 1:1 Connect), browser-only warning. Stat cards:
  learners started (count of `level_selected` events), starts per level, lessons completed (last 7 days and all
  time), challenge submissions (count of `challenge_submitted` events → Users?tab=submissions), 1:1 booking
  clicks (30 days). Also the 10 most recent events and a content summary (courses and lessons per level,
  challenges, resources, career guides).
- **Stored in:** reads `events` (latest 1000), `profiles`, `submissions`, `reviews`. Content counts come from the draft.
- **Takes effect:** n/a (read-only).
- **Permissions:** `events`, `profiles` (others' rows), `submissions` and `reviews` (non-approved) are readable
  by admins only via RLS.
- **Missing:** counts are events, not people. "Completion rate" and "courses done" are hard-coded to 0 in
  `computeStats` (lines 45–46) and not shown. The event list says "joined Designer Kid" for `signup`, which no
  longer happens. There is no date-range picker.

### 6.2 Analytics (`/admin/analytics`) — same file

- **Controls:** lessons completed per day (30 days, bar chart ↔ table), "Learners by level" (starts), "Where
  learners get to" module funnel, most completed lessons, most attempted challenges, 4 summary stats.
- **Stored in:** `events` (latest 1000) and `profiles.state`.
- **Takes effect:** n/a.
- **Permissions:** admin read via RLS.
- **Missing / limitations:** the funnel and top lists read `profiles.state`, which is **empty for anonymous
  learners**. They are effectively unused in production. Anonymous only. Capped at the latest 1000 events, so
  all-time numbers stop growing once there are more than 1000 events. No unique-visitor metric, no page views, no export.

### 6.3 Courses (`/admin/courses`) — `src/admin/pages/Courses.tsx`, `SlideEditor.tsx`, `BlocksEditor.tsx`

- **Controls:**
  - Level tabs → course tree. The selection is kept in the URL (`?level=&course=&module=&lesson=`).
  - **Course**: add ("+ Course"), title, description, published toggle, move up/down (arrows), delete (with
    counts of what is removed).
  - **Module editor**: title, roadmap label (≤ 18 characters), summary, outcome, type (Lessons / Projects —
    counts towards "projects completed"), published, lessons list with drag or arrow reorder, add lesson,
    delete lesson or module, Preview (`/learn/:level/:module`).
  - **Lesson editor** — *Slides* tab (PowerPoint-style `SlideEditor`): thumbnail rail, click-to-edit canvas,
    format panel, ribbon (insert 15 block types: text, heading, callout, list, do/don't, checklist, example,
    Q&A, quiz, illustration, image, PDF/PPT file, video, interactive widget, link; duplicate, delete, move,
    undo/redo, preview, PDF). Title slide: cover illustration picker ("Auto" uses `coverFor()`) and
    attachments (upload PDF/PPT ≤ 50 MB). Extra slides: 3 · Practice (task, steps, deliverable) and
    4 · Challenge (task, success criteria). Shortcuts: ⌘/Ctrl+Z undo, ⌘/Ctrl+Y or ⇧⌘Z redo,
    ⌘/Ctrl+D duplicate, ↑/↓ change slide, ⌥↑/↓ reorder, Delete/Backspace remove a block.
    *Details* tab: title, summary, estimated minutes, difficulty, move to another module (any level), ID.
    Buttons: Preview lesson, Mark as published / Unpublish, Duplicate (as a draft copy), Delete.
  - "Focus mode": when a lesson is open the tree is hidden ("Show course tree" toggles it).
- **Stored in:** draft `levels[].courses[].modules[].lessons[]`. Uploaded attachments go to storage
  `media/documents/`.
- **Takes effect:** after Publish (plus each item's own `published` flag). Uploaded files are stored at once,
  but only become referenced by live content after Publish.
- **Permissions:** draft write = `is_admin()` (policy "content: admin writes draft"). Storage insert = admin.
- **Missing:** no course duplicate or move-to-level. Courses reorder by arrows only (not drag). PPT files are
  embedded, not converted into editable slides. No per-lesson revision history (only whole-site versions). No
  scheduled publishing.

### 6.4 Blog (`/admin/blog`) — `src/admin/pages/Blog.tsx`

- **Controls:** article list (search, All / Published / Drafts), New article, SlideEditor body, "Card & tags"
  slide (excerpt), cover illustration or cover photo, web address (slug is slugified and must be unique),
  author, date, reading time, tags (one per line), Featured, Mark as published / Unpublish, Delete, Preview,
  PDF. A callout with **"Add 'Blog' to the menu"** appears when navigation has no `/blog` item.
- **Stored in:** draft `blog[]` (+ `navigation` for the menu fix).
- **Takes effect:** after Publish. **Production note:** the published document has no `blog` section yet. The
  12 seed articles show through `withDefaults`. The first Publish writes them into the database.
- **Permissions:** as Courses.
- **Missing:** no scheduled posts (future-dated posts still show once published — Inferred: the date is only
  used for sorting), no RSS/sitemap, no SEO meta tags per post (single-page app, one `index.html`), no
  comments.

### 6.5 Challenges (`/admin/challenges`) — `src/admin/pages/Challenges.tsx`

- **Controls:** list with search and level filter, New challenge, published toggle, delete. Brief: title,
  level, category (7), difficulty, estimated minutes, brief, user & problem context. Scope: requirements,
  constraints, expected outcome, self-review checklist. `addedAt` is set on creation (drives "new challenge"
  notifications).
- **Stored in:** draft `challenges[]`.
- **Takes effect:** after Publish.
- **Missing:** no way to see learners' submitted work (learners have no accounts; see Users). No reorder.

### 6.6 Content library (`/admin/content`) — `src/admin/pages/Library.tsx`

Tabs are kept in `?tab=`:

| Tab | Controls | Stored in |
|---|---|---|
| Resources | Add, drag reorder, delete. Title, URL, description, type (Article/Tool/Template/Video/Book/Community/Course), level (all or one), published | draft `resources[]` |
| Career guides | Choose a section (6). Guide list, add, delete, published. SlideEditor body, checklist slide, level, reading time | draft `careerGuides[]` |
| Announcements & notifications | Notification settings (new lessons, new challenges, course completion, announcements, career updates). Announcements: title, message, date, type (announcement / career update), levels, important (pinned on dashboard), published | draft `notifications`, `announcements[]` |

- **Takes effect:** after Publish. **Missing:** notifications only appear inside the app (bell). There are no
  email or push notifications, and "1:1 request" notifications from the brief were not built (1:1 is an external link).

### 6.7 Levels (`/admin/levels`) — `src/admin/pages/Levels.tsx`

- **Controls:** per level: Enabled, name, card headline, description, icon, colour (shows contrast with white;
  warns below 4.5:1), recommended learning path (lines), "Suggest an order" (`sequential`: shows a hint only,
  never locks), plus an onboarding-card preview.
- **Stored in:** draft `levels[]` (the same objects that hold courses).
- **Takes effect:** after Publish. The publish dialog flags "Levels & courses" as a major change.
- **Missing:** you cannot add or delete levels. Level IDs are fixed to `beginner | intermediate | expert` by the
  `LevelId` type and the `profiles.level` check constraint.

### 6.8 Media (`/admin/media`) — `src/admin/pages/Media.tsx`, `src/admin/uploads.tsx`

- **Controls:** choose a folder (PDFs & slides, General, Thumbnails, Illustrations, Profile images, Course
  media, Brand). Upload several images, PDFs or slides. Images (PNG/JPEG/WebP) larger than 2000 px or 600 KB
  are downscaled to WebP in the browser. Filter by folder. Each card shows dimensions, size, date and
  "In use / Not used" (a text search of the draft and published JSON). Copy URL, Replace (same path, so
  every page using it updates), Delete (warns if the file is in use).
- **Stored in:** Supabase Storage bucket `media` at `<folder>/<timestamp>-<safe-name>`. Browser-only mode:
  `data:` URLs in `dk.media`.
- **Takes effect:** **immediately**. Deleting an in-use file breaks live pages straight away.
- **Permissions:** public read, admin insert/update/delete (`storage.objects` policies).
- **Limits:** 50 MB per file (UI check). Supabase free plan: 1 GB storage total. Browser-only mode: 1.5 MB per
  file and about 5 MB in total.
- **Missing:** no metadata editing (alt text, rename, move between folders). Listing is capped at 500 files per
  folder. Images uploaded through the image picker (`MediaPicker` in `src/admin/fields.tsx`) are **not**
  resized. Only the Media page resizes. The "in use" check is a plain string search.

### 6.9 Users (`/admin/users`) — `src/admin/pages/Users.tsx`

- **Controls:** tabs Learners / Challenge submissions (`?tab=`). Learners: search by name or email, filters
  (level; activity: active 7 days / inactive / suspended / admins), sort, CSV export, per-user dialog (stats,
  module progress, rename, change level, send password reset, reset progress, suspend/restore, make/remove
  admin — hidden for yourself).
- **Stored in:** `profiles` (+ `admins`, Supabase Auth for reset emails).
- **Takes effect:** immediately.
- **Permissions / production status:**

| Action | Needs | Production today |
|---|---|---|
| List users | "profiles: read own or admin" (base schema) + `admins` select | Profiles list works. `admins` select has no policy until 002, so the "Admin" badges will be missing (Inferred) |
| Rename / change level / reset progress of **another** user | "profiles: admin updates" (002) | Silently updates 0 rows (Inferred from RLS; no error returned) |
| Suspend / restore | `profiles.blocked` column (002) | **Fails (HTTP 400)** |
| Make / remove admin | `admins` insert/delete policies (002) | **Fails (RLS)** |
| Send password reset | Supabase Auth email | Works if Auth URL/SMTP is configured (**Unknown**) |
| Challenge submissions tab | `submissions` rows from signed-in users | Always empty for learners (**Deprecated**) |

- **Missing:** learners are anonymous, so this page only lists auth users (in practice the admin). There is no
  invite flow. New admins must be created in Supabase → Authentication → Add user and then made admin here
  (after 002) or by SQL. Accounts cannot be deleted here (Supabase dashboard only).

### 6.10 1:1 Connect (`/admin/connect`) — `src/admin/pages/Connect.tsx`

- **Controls:** "Show 1:1 Connect to students", booking page URL (must start with `https://`, "Test link"),
  button label, mentor name, role, short bio, photo (image picker → `media/profiles/`), session topics. Booking
  activity (last 15 `booking_clicked` events).
- **Stored in:** draft `mentor`. Clicks come from `events`.
- **Takes effect:** after Publish.
- **Current state:** **no booking URL and no photo set.** Learners see "Booking opens soon" (or a `mailto:` if a
  footer email is set in Website → Footer).
- **Missing:** confirmed bookings live only in the external tool. There is no request queue or status workflow
  (replaced by the owner's decision) and no booking notification to the owner.

### 6.11 Reviews (`/admin/reviews`) — `src/admin/pages/Reviews.tsx`

- **Controls:** summary (average rating of approved reviews, live count, waiting count). Filters: Pending /
  Approved / Hidden / All. For each review: Approve, Hide (also unfeatures), Feature/Unfeature (approved only),
  public reply (Save reply), Delete (confirm). Settings: allow reviews, approve before showing, show on
  homepage, section title, prompt. "Preview reviews page".
- **Stored in:** moderation → `reviews` table (direct). Settings → draft `reviews`.
- **Takes effect:** moderation **immediately**. Settings after Publish. The DB trigger `review_defaults()` reads
  `requireApproval` from the **published** document, so a changed approval setting only applies to new reviews
  after Publish.
- **Permissions:** admin update/delete policies (base schema). Public insert needs **migration 003**; until
  then anonymous submissions are rejected (so the Pending queue will stay empty).
- **Missing:** no email alert for new reviews. No spam protection beyond moderation (no captcha or rate limit).

### 6.12 Offers & banners (`/admin/offers`) — `src/admin/pages/Offers.tsx`

- **Controls:** New offer, list with status (Off / Scheduled / Running / Ended), on/off toggle, Duplicate,
  Delete, live preview. Content: format (banner bar / pop-up), title (≤ 80 characters), message, button label and
  link (internal path or https), colour tone (primary/secondary/accent/dark), pop-up image or illustration.
  Schedule & audience: start and end dates, who (everyone / new visitors / returning learners), where (every page
  / homepage only), "Remember when closed". A warning appears when more than one offer is running (visitors see
  only the first bar and the first pop-up).
- **Stored in:** draft `promos[]`. Content edits increase `version` so earlier dismissals reset.
- **Takes effect:** after Publish. Dates are compared as UTC `YYYY-MM-DD` strings in the visitor's browser
  (Inferred from `toISOString().slice(0,10)`).
- **Missing:** no click or impression analytics for offers, and no A/B testing.

### 6.13 Website (`/admin/website`) — `src/admin/pages/Website.tsx`

- **Controls:** tabs *Homepage* (hero eyebrow, title, description, primary/secondary CTA labels, hero image;
  feature sections; statistics — "only real numbers", hidden while empty; testimonials — "only real quotes with
  permission", hidden while empty; FAQ), *Navigation* (order, rename, hide, add; https links open a new tab;
  1:1 Connect and Profile are fixed, not editable here), *Footer* (links, social links, copyright, contact
  email). "Preview homepage".
- **Stored in:** draft `home`, `navigation`, `footer`.
- **Takes effect:** after Publish (Navigation is flagged as a major change).
- **Production note:** the published navigation lacks **Blog**. The footer contact email is empty in the seed,
  and it is also the 1:1 `mailto:` fallback.
- **Missing:** no custom pages, no per-page SEO/meta, no CTA link targets (the CTA labels are editable, the
  destinations are fixed in code).

### 6.14 Theme (`/admin/theme`) — `src/admin/pages/Theme.tsx`, `src/lib/theme.ts`

- **Controls:** Brand (name, tagline, logo, favicon, with a live brand and browser-tab preview), 6 quick themes
  (Designer Kid, Ocean, Forest, Sunset, Mono, Grape), colours for Light and Dark with contrast rows (text on
  background/surface ≥ 4.5, button text on primary ≥ 4.5, links ≥ 3), typography (14 Google fonts, base size
  14–20 px, line height, heading/body weight), shape & depth (base/button/card radius, shadows, borders),
  default colour mode (learners can override), reset to defaults, live preview.
- **Stored in:** draft `brand`, `theme`.
- **Takes effect:** after Publish (flagged as a major change). Fonts load from Google Fonts on demand.
- **Missing:** no custom CSS, no custom font upload. Colours apply through CSS variables, but the many inline
  styles in components (775 `style={{` occurrences) do not all follow tokens (Inferred risk).

### 6.15 Publishing (`/admin/publishing`) — `src/admin/pages/Settings.tsx` `PublishingPage`

See §4 and §5. Shows the current draft status (changed sections), Preview draft, version history with Restore,
and backup download/import.

### 6.16 Settings (`/admin/settings`) — `src/admin/pages/Settings.tsx` `SettingsPage`

- **Controls:** **Your admin account** (Supabase mode only): change password (twice, ≥ 8 characters, show/hide),
  "Email me a reset link". **Data connection**: Connected (Supabase) or browser-only setup steps. **Where to
  change things** map. **Content summary** (schema version, number of levels, challenges, resources, career
  guides and achievements).
- **Stored in:** Supabase Auth (password). Everything else is read-only.
- **Takes effect:** password immediately.
- **Missing:** no email change, no MFA, no session list. The browser-only setup text says "Sign up on the site",
  but sign-up is no longer in the UI. Admin users must be created in the Supabase dashboard (Inferred outdated
  text, lines 170–173).

---

## 7. Browser-only mode (no Supabase env vars)

Chosen automatically when `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing (`src/data/index.ts`).

| Area | Supabase mode | Browser-only mode (`src/data/localStore.ts`) |
|---|---|---|
| Sign-in | Email/password, `public.admins` | "Open admin for this browser" (no password) |
| Draft / published | `site_content` rows | `dk.content.draft` / `dk.content.published` in this browser |
| Versions | `content_history` (unbounded; UI lists 30) | `dk.content.versions`, **max 5**, fewer if storage is full |
| Media | Storage bucket, ≤ 50 MB per file | `data:` URLs in `dk.media`, ≤ 1.5 MB per file, ~5 MB total. PPT preview impossible (not a public URL) |
| Reviews | `reviews` table + trigger | `dk.reviews` (only this browser's reviews) |
| Analytics | `events` table | `dk.events` (last 200) |
| Users | `profiles` | Only this browser's guest learner |
| Make admin / password / reset | Supported | Throws "needs Supabase" errors |
| Visible to others | Yes, after Publish | **No** — only this browser |

Use it for local development and automated tests (`VITE_SUPABASE_URL= npm run dev`, see
[TESTING.md](TESTING.md)).

---

## 8. Common tasks (from ADMIN_GUIDE.md, verified)

| I want to… | Go to |
|---|---|
| Edit a lesson like PowerPoint | Courses → level → module → lesson → **Slides**. Click text to edit, use the ribbon to insert, drag thumbnails to reorder, ⌘Z to undo |
| Add a lesson / module / course | Courses → "+ Course"; course page "Add module"; module page "Add lesson" |
| Attach a PDF or slide deck | Slide editor → title slide attachments → Upload PDF or PPT, or insert a **PDF / PPT** block to embed it |
| Change a lesson's picture | Slide editor → title slide → pick an illustration (or "Auto") |
| Write a blog article | Blog → New article → edit slides → Mark as published → **Publish** |
| Show an offer | Offers & banners → New offer → Banner or Pop-up → switch on → **Publish** |
| Change logo, favicon, colours, fonts | Theme (try a quick theme, then fine-tune) → **Publish** |
| Change homepage text, FAQ, menu, footer | Website → **Publish** |
| Add Blog to the live menu | Blog → "Add 'Blog' to the menu" → **Publish** (or run migration 003) |
| Set the 1:1 booking link | 1:1 Connect → paste the Calendly / Cal.com / Topmate link → **Publish** |
| Approve reviews | Reviews → Pending → Approve (immediate) → Feature to show on the homepage |
| Add an announcement | Content library → Announcements & notifications → **Publish** |
| Rename or recolour a level | Levels → **Publish** |
| Upload images / PDFs | Media (images are resized automatically) |
| Give someone admin access | Supabase → Authentication → Add user. Then Users → open them → Make admin (**after migration 002**), or SQL `insert into public.admins …` |
| Undo a bad publish | Publishing → Version history → Restore → **Publish** |
| Back up everything | Publishing → Download draft as JSON |
| Change your password | Settings → Your admin account |

Good habits (from ADMIN_GUIDE.md): preview on a phone before big changes (theme, navigation, levels). Keep offers
short and give them end dates. Publish only real statistics and permitted testimonials. Remind learners to use
Profile → Download my progress, because progress lives in their browser.

## 9. Known gaps summary

1. Run migrations **002 then 003** in the Supabase SQL editor. Until then: no anonymous reviews, no Blog menu
   item, and no suspend/admin management.
2. Configure the 1:1 booking URL, mentor photo, logo/favicon and footer email, then Publish.
3. Supabase Auth URL configuration and SMTP are **Unknown**. Check them before relying on password-reset emails.
4. No multi-admin conflict handling, no audit log beyond `content_history.author`, and no achievements editor.
5. Analytics are anonymous, capped at the latest 1000 events, and the funnel/top lists are empty without accounts.
