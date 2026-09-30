# Database — Designer Kid

Designer Kid stores its data in **Supabase Postgres**. There is no ORM, no server code and no migration tool: the browser talks
to Postgres through the `@supabase/supabase-js` query builder (PostgREST), and every authorisation decision is made by
**Row Level Security (RLS)** policies and a few `security definer` functions defined in `supabase/schema.sql`. The whole
course catalogue, site settings and theme live in **one JSON document** (`site_content.data`); relational tables hold only
admins, profiles, version history, analytics events, challenge submissions and reviews. Uploaded files live in the Supabase
Storage bucket `media`. When Supabase is not configured, the app falls back to a browser-only store (`localStorage`) with the
same interface (see `docs/API.md`).

Last verified: 30 Sep 2026 (docs v2.0)

> **v2.1 update:** migration `004_hardening.sql` adds `client_hash` (text, indexed) to `events` and `reviews`, the
> functions `client_hash()`, `events_guard()` and `reviews_rate_limit()` with `before insert` triggers, and replaces the
> `site_content` admin write policy with draft-only insert/update policies (no delete). Run order: 002 → 003 → 004.

**Status legend.** **Confirmed** = seen in code/SQL or verified at hand-off · **Inferred** = reasoned from code (reason given) ·
**Unknown** = cannot be verified from the repository (what to check is stated) · **Pending** = in the repository but not yet
applied to the live database.

---

## 1. Where the schema lives

| File | What it contains | Applied on production (project `zcxnlelzhkwbvittgcuj`)? |
|---|---|---|
| `supabase/schema.sql` lines 1–200 | Base schema: `admins`, `profiles`, `site_content`, `content_history`, `events`, `submissions`, `reviews`, bucket `media`, functions `is_admin`, `handle_new_user`, `publish_content`, `review_defaults`, their triggers and policies | **Confirmed applied** (verified at hand-off: REST checks returned 200 for every table; anonymous `publish_content` rejected with "Only admins can publish") |
| `supabase/schema.sql` lines 202–248 = `supabase/migrations/002_user_management.sql` | `profiles.blocked`, `protect_profile` trigger, admin policies on `profiles` and `admins`, "not suspended" checks on `reviews`/`submissions` inserts | **Pending — NOT applied** (verified at hand-off: selecting `profiles.blocked` returns HTTP 400) |
| `supabase/schema.sql` lines 250–268 = `supabase/migrations/003_open_learning.sql` | Anonymous review inserts (`reviews: anyone submits`), adds a "Blog" item to `navigation` in both content documents | **Pending — NOT applied** (verified at hand-off: published navigation has no `/blog` item) |

`schema.sql` is the cumulative "everything" script; the files in `supabase/migrations/` are the same statements split out so an
existing project can be upgraded. There is **no `001_*.sql`**: the base part of `schema.sql` plays that role. Every statement is
written to be idempotent (`create table if not exists`, `drop policy if exists` + `create policy`, `create or replace function`,
`add column if not exists`, `on conflict do nothing`).

### Consequences of the pending migrations (Confirmed from the SQL + hand-off checks)

| Feature | Needs | Behaviour on production today |
|---|---|---|
| Anonymous "Write a review" (`src/pages/Reviews.tsx`) | 003 | Insert rejected by RLS (base policy requires `auth.uid() is not null`) — visitor sees the Postgres RLS error message |
| Admin → Users: suspend / unsuspend | 002 | `update profiles set blocked = …` fails (column does not exist) |
| Admin → Users: list admins / make admin / remove admin | 002 | Base schema has RLS on `admins` but **no policies**, so admins cannot read or write the table through the API: `listLearners` sees no admin flags; `setAdmin` fails |
| Admin edits another user's name/level/progress | 002 | Base schema only allows `profiles: update own`; admin updates of other rows affect 0 rows or fail |
| "Blog" in the site menu | 003 (or add it in Admin → Navigation and publish) | Menu lacks Blog in published content |

---

## 2. Relationship overview

```text
auth.users  (managed by Supabase Auth)
   │ id
   ├──1:1──► public.admins.user_id        (PK + FK, ON DELETE CASCADE)   — who is an admin
   ├──1:1──► public.profiles.id           (PK + FK, ON DELETE CASCADE)   — created by trigger on sign-up
   ├──1:N──► public.events.user_id        (FK, ON DELETE SET NULL, nullable)
   ├──1:N──► public.submissions.user_id   (FK, ON DELETE CASCADE, NOT NULL)
   └──1:N──► public.reviews.user_id       (FK, ON DELETE SET NULL, nullable)

public.site_content   rows: 'draft' | 'published'   (no FKs; data = SiteContent JSON)
public.content_history  append-only copies of every published SiteContent (no FKs; author = email text)

storage.buckets 'media' (public) ──► storage.objects (bucket_id = 'media', path "<folder>/<timestamp>-<name>")
      URLs of objects are pasted into SiteContent JSON (no FK — deleting a file leaves a broken link)

Trigger wiring
  auth.users        AFTER INSERT  → handle_new_user()  → insert profiles + events('signup')
  public.reviews    BEFORE INSERT → review_defaults()  → force status/featured/reply
  public.profiles   BEFORE UPDATE → protect_profile()  → non-admins cannot change "blocked"   [002, pending]
RPC
  publish_content(content, note) → upsert site_content 'published' + 'draft', insert content_history, insert events
```

No table has secondary indexes: the repository contains **no `create index` statements** (Confirmed). The only indexes are the
implicit unique B-tree indexes behind each primary key (and Supabase's own indexes on `auth`/`storage` schemas). Foreign-key
columns (`events.user_id`, `submissions.user_id`, `reviews.user_id`) are not indexed — acceptable at the current data volume.

---

## 3. Tables

Column notation: **Req** = `not null`; **Opt** = nullable.

### 3.1 `public.admins` — who may administer the site

Purpose: admin rights live in their own table "so learners can never grant them to themselves by editing their profile"
(`schema.sql` lines 5–7).

| Column | Type | Req/Opt | Default | Constraints / FK |
|---|---|---|---|---|
| `user_id` | `uuid` | Req (PK) | — | **PK**; FK → `auth.users(id)` `on delete cascade` |

- Indexes: PK only.
- RLS: **enabled**.
- Policies (base schema): **none** → nobody can select/insert/delete through the API; only `is_admin()` (security definer) and the SQL editor can see it.
- Policies added by **002 (pending)**:

| Policy | Operation | Rule |
|---|---|---|
| `admins: admin reads` | SELECT | `is_admin()` |
| `admins: admin adds` | INSERT | check `is_admin()` |
| `admins: admin removes others` | DELETE | `is_admin() and user_id <> auth.uid()` (an admin cannot remove themselves) |

- No UPDATE policy (rows are only inserted/deleted).
- Business rule: the **first** admin must be created in the SQL editor:
  `insert into public.admins (user_id) select id from auth.users where email = '<owner/admin email>';` (`schema.sql` line 155; the same snippet is shown by `NotAdmin` in `src/admin/AdminApp.tsx`).
- Live state: one admin row (owner/admin email) — verified at hand-off.

### 3.2 `public.profiles` — one row per auth user (learner progress as JSON)

| Column | Type | Req/Opt | Default | Constraints / FK |
|---|---|---|---|---|
| `id` | `uuid` | Req (PK) | — | **PK**; FK → `auth.users(id)` `on delete cascade` |
| `name` | `text` | Opt | — | — |
| `email` | `text` | Opt | — | copied from `auth.users.email` by trigger; not kept in sync afterwards |
| `level` | `text` | Opt | — | `check (level in ('beginner','intermediate','expert'))` |
| `state` | `jsonb` | Req | `'{}'::jsonb` | shape = `LearnerState` (§5.2) |
| `created_at` | `timestamptz` | Req | `now()` | — |
| `last_active_at` | `timestamptz` | Req | `now()` | set by the client in `saveLearner` |
| `blocked` | `boolean` | Req | `false` | **added by 002 — pending on production** |

- Indexes: PK only.
- RLS: **enabled**.

| Policy | Operation | Rule | Source |
|---|---|---|---|
| `profiles: read own or admin` | SELECT | `id = auth.uid() or is_admin()` | base |
| `profiles: update own` | UPDATE | base: using/check `id = auth.uid()`. **002 replaces it** with using `id = auth.uid() and not blocked`, check `id = auth.uid()` | base / 002 |
| `profiles: admin updates` | UPDATE | using/check `is_admin()` | 002 (pending) |
| (none) | INSERT | no policy → only the `handle_new_user` trigger (security definer) creates rows | base |
| (none) | DELETE | no policy → rows are removed only when the `auth.users` row is deleted (cascade) | base |

- Triggers: `profiles_protect` BEFORE UPDATE → `protect_profile()` (002, pending).
- Business rules:
  - Rows are created automatically when someone signs up (see `handle_new_user`).
  - Owner decision (hand-off): **learners have no accounts**; progress lives in the browser. On production the only rows expected are admins' own profiles. **Inferred** (`src/state/learner.tsx` lines 58–89): when an admin is signed in on the live site, their browser's guest progress is merged into and saved to their own `profiles.state`.
  - A user can edit every column of their own row except (after 002) `blocked` — including `email` and `created_at`. **Confirmed** (policy has no column restriction; trigger only protects `blocked`).

### 3.3 `public.site_content` — the draft and the live site document

| Column | Type | Req/Opt | Default | Constraints |
|---|---|---|---|---|
| `id` | `text` | Req (PK) | — | **PK**; `check (id in ('draft','published'))` → table can hold at most two rows |
| `data` | `jsonb` | Req | — | shape = `SiteContent` (§5.1) |
| `updated_at` | `timestamptz` | Req | `now()` | client sets it on draft save; `publish_content` sets `now()` |

- Indexes: PK only. RLS: **enabled**.

| Policy | Operation | Rule |
|---|---|---|
| `content: public reads published` | SELECT | `id = 'published' or is_admin()` — anyone (anon key) can read the live document; only admins can read the draft |
| `content: admin writes draft` | ALL (SELECT/INSERT/UPDATE/DELETE) | using `is_admin()`, with check `is_admin() and id = 'draft'` |

- Business rules:
  - Admins can insert/update **only the draft row** directly (`saveDraft` upserts `id='draft'`). The published row is written **only** by `publish_content()` (security definer).
  - **Confirmed nuance:** the `for all` policy's USING clause is `is_admin()` only, so an admin *could* `DELETE` the `published` row through the API (DELETE has no WITH CHECK). The app never does this. If it happens, visitors fall back to the bundled seed content (`src/state/content.tsx`).
  - The published document on production predates the `promos`, `blog` and `reviews` sections; the client fills missing top-level keys from the seed (`withDefaults`, `src/state/content.tsx` lines 25–34) — verified at hand-off.

### 3.4 `public.content_history` — every published version

| Column | Type | Req/Opt | Default | Constraints |
|---|---|---|---|---|
| `id` | `bigint` | Req (PK) | `generated always as identity` | **PK** |
| `data` | `jsonb` | Req | — | full `SiteContent` copy |
| `note` | `text` | Opt | — | publish note typed by the admin |
| `author` | `text` | Opt | — | email of the publishing user (looked up from `auth.users` inside `publish_content`) |
| `created_at` | `timestamptz` | Req | `now()` | — |

- Indexes: PK only. RLS: **enabled**.

| Policy | Operation | Rule |
|---|---|---|
| `history: admin reads` | SELECT | `is_admin()` |
| (none) | INSERT/UPDATE/DELETE | no policy → written only by `publish_content()`; never updated or deleted via the API |

- Business rules: append-only; the admin "Versions" screen lists the latest 30 (`listVersions`) and can load any one back into the draft (`loadVersion`).
- **Inferred risk:** each row is a full copy of the site (182 lessons, 27 guides), and nothing prunes it, so it grows with every publish against the free-plan 500 MB database limit. Prune manually in the SQL editor if needed (e.g. keep the newest N rows).

### 3.5 `public.events` — activity feed / admin analytics

| Column | Type | Req/Opt | Default | Constraints / FK |
|---|---|---|---|---|
| `id` | `bigint` | Req (PK) | identity | **PK** |
| `type` | `text` | Req | — | `check (type in ('signup','level_selected','lesson_completed','module_completed','challenge_submitted','booking_clicked','content_published'))` |
| `detail` | `text` | Opt | — | `check (char_length(detail) <= 300)` |
| `user_id` | `uuid` | Opt | — | FK → `auth.users(id)` `on delete set null` |
| `user_name` | `text` | Opt | — | `check (char_length(user_name) <= 120)` |
| `created_at` | `timestamptz` | Req | `now()` | — |

- Indexes: PK only. RLS: **enabled**.

| Policy | Operation | Rule |
|---|---|---|
| `events: anyone inserts own` | INSERT | check `(user_id is null or user_id = auth.uid()) and type <> 'content_published'` — **anonymous inserts allowed** |
| `events: admin reads` | SELECT | `is_admin()` |
| (none) | UPDATE/DELETE | not possible via the API |

- Writers: the browser (`track()` in `src/state/learner.tsx`, `src/components/MentorLink.tsx`), `handle_new_user` (`signup`), `publish_content` (`content_published`, the only way to create that type).
- `user_name` is free text supplied by the client (`'Guest'` for anonymous visitors) — it is not verified (see `docs/SECURITY.md`).
- `module_completed` is allowed by the check constraint; **Inferred** unused — no call site passes it (`grep store.track` finds `level_selected`, `lesson_completed`, `challenge_submitted`, `booking_clicked`).

### 3.6 `public.submissions` — challenge submissions

| Column | Type | Req/Opt | Default | Constraints / FK |
|---|---|---|---|---|
| `id` | `bigint` | Req (PK) | identity | **PK** |
| `user_id` | `uuid` | Req | — | FK → `auth.users(id)` `on delete cascade` |
| `user_name` | `text` | Opt | — | — |
| `challenge_id` | `text` | Req | — | refers to `SiteContent.challenges[].id` (no FK — JSON) |
| `link` | `text` | Opt | — | `check (char_length(link) <= 500)` |
| `notes` | `text` | Opt | — | `check (char_length(notes) <= 4000)` |
| `created_at` | `timestamptz` | Req | `now()` | — |

- Indexes: PK only. RLS: **enabled**.

| Policy | Operation | Rule | Source |
|---|---|---|---|
| `submissions: insert own` | INSERT | base: `user_id = auth.uid()`; 002 adds `and not exists (blocked profile)` | base / 002 |
| `submissions: read own or admin` | SELECT | `user_id = auth.uid() or is_admin()` | base |
| (none) | UPDATE/DELETE | not possible via the API | — |

- Business rule: only signed-in users can submit. Since learners have no accounts, **Inferred** that the table is effectively unused on production: `completeChallenge` (`src/state/learner.tsx` lines 159–173) calls `submitChallenge` only when someone is signed in; anonymous learners just record a `challenge_submitted` event and keep their work in localStorage.

### 3.7 `public.reviews` — reviews about the mentor

| Column | Type | Req/Opt | Default | Constraints / FK |
|---|---|---|---|---|
| `id` | `bigint` | Req (PK) | identity | **PK** |
| `user_id` | `uuid` | Opt | — | FK → `auth.users(id)` `on delete set null` |
| `name` | `text` | Req | — | `check (char_length(name) between 1 and 80)` |
| `role` | `text` | Opt | — | `check (char_length(role) <= 80)` |
| `rating` | `smallint` | Req | — | `check (rating between 1 and 5)` |
| `text` | `text` | Req | — | `check (char_length(text) between 10 and 1200)` (UI requires ≥ 20) |
| `status` | `text` | Req | `'pending'` | `check (status in ('pending','approved','hidden'))` — **forced by trigger on insert** |
| `featured` | `boolean` | Req | `false` | forced to `false` on insert |
| `reply` | `text` | Opt | — | `check (char_length(reply) <= 1200)`; forced to `null` on insert |
| `created_at` | `timestamptz` | Req | `now()` | — |

- Indexes: PK only. RLS: **enabled**.
- Trigger: `reviews_defaults` BEFORE INSERT → `review_defaults()`.

| Policy | Operation | Rule | Source |
|---|---|---|---|
| `reviews: public reads approved` | SELECT | `status = 'approved' or user_id = auth.uid() or is_admin()` | base |
| `reviews: signed-in users write own` | INSERT | base: `auth.uid() is not null and user_id = auth.uid()`; 002 adds "not blocked"; **003 drops it** | base / 002 / 003 |
| `reviews: anyone submits` | INSERT | `(user_id is null or user_id = auth.uid()) and not exists (blocked profile of auth.uid())` — **anonymous inserts** | 003 (pending) |
| `reviews: admin updates` | UPDATE | using `is_admin()` (no WITH CHECK) | base |
| `reviews: admin deletes` | DELETE | using `is_admin()` | base |

- Business rules: the browser never chooses `status`; the trigger reads `site_content['published'].data.reviews.requireApproval` (defaults to `true` if missing) and sets `pending` or `approved`. Admins moderate (approve/hide/feature/reply/delete) in Admin → Reviews.

---

## 4. Functions and triggers

All functions are `language plpgsql` or `sql`, `security definer`, with `set search_path = public` (Confirmed).

| Function | Returns | Called by | What it does |
|---|---|---|---|
| `public.is_admin()` | `boolean` (`stable`, SQL) | RLS policies; client `sb.rpc('is_admin')` in `toAppUser` | `exists (select 1 from public.admins where user_id = auth.uid())`. Security definer so it can read `admins` despite RLS. |
| `public.handle_new_user()` | `trigger` | `on_auth_user_created` AFTER INSERT ON `auth.users` FOR EACH ROW | Inserts `profiles(id, email, name)` with `name = raw_user_meta_data->>'name'` or the email's local part (`on conflict (id) do nothing`); inserts an `events` row `('signup','Created an account', id, name-or-email)`. |
| `public.publish_content(content jsonb, note text)` | `void` | client `sb.rpc('publish_content', { content, note })` | Raises `'Only admins can publish'` unless `is_admin()`. Then in one transaction: upsert `site_content('published')`, upsert `site_content('draft')` with the same data, insert `content_history(data, note, author=email of auth.uid())`, insert `events('content_published', coalesce(nullif(note,''),'Published changes'), auth.uid(), 'Admin')`. |
| `public.review_defaults()` | `trigger` | `reviews_defaults` BEFORE INSERT ON `reviews` | Sets `featured := false`, `reply := null`, `status := 'pending'` if published `reviews.requireApproval` is true or missing, else `'approved'`. |
| `public.protect_profile()` | `trigger` | `profiles_protect` BEFORE UPDATE ON `profiles` (**002, pending**) | If the caller is not an admin, `new.blocked := old.blocked` (silently ignores attempts to change suspension). |

Note: the `on_auth_user_created` trigger is created after `events` exists because `handle_new_user` writes to it (`schema.sql` line 111).

---

## 5. JSON documents

### 5.1 `site_content.data` — `SiteContent` (`src/content/types.ts`)

One document describes everything a visitor sees. Top-level keys (all required in the type; `withDefaults` backfills any missing
ones from the seed):

| Key | Type | Summary |
|---|---|---|
| `schemaVersion` | `1` | Import validation checks `schemaVersion === 1` and `levels` is an array (`src/admin/pages/Settings.tsx` line 98) |
| `brand` | `{ name, tagline, logoUrl, faviconUrl }` | Site identity; `ThemeProvider` sets `document.title` and favicon |
| `theme` | `Theme` | `mode` (light/dark/system), `light`/`dark` colour sets, `fonts` (heading, body, baseSize, weights, lineHeight), `radius`, `shadow`, `border` |
| `home` | object | Hero copy/image, `features[]`, `stats[]`, `testimonials[]`, `faq[]` |
| `navigation` | `NavItem[]` | `{ id, label, path, visible }` |
| `footer` | `{ links[], social[], copyright, email }` | `email` is also the 1:1 mailto fallback |
| `mentor` | `{ name, role, bio, photo, bookingUrl, ctaLabel, topics[], enabled }` | 1:1 booking panel |
| `reviews` | `{ enabled, requireApproval, showOnHome, title, prompt }` | `requireApproval` is read by the `review_defaults` trigger |
| `notifications` | 5 booleans | newLesson, newChallenge, courseCompletion, announcements, careerUpdates |
| `levels` | `Level[]` | The course hierarchy (below) |
| `challenges` | `Challenge[]` | Flat, tagged by `level`, `category`, `difficulty`; has `requirements`, `constraints`, `checklist`, `published` |
| `resources` | `Resource[]` | `{ id, level (or 'all'), type, title, description, url, published }` |
| `careerGuides` | `CareerGuide[]` | `section` (resume/linkedin/portfolio/interviews/job-search/networking), `blocks[]`, `checklist[]`, `attachments[]` |
| `announcements` | `Announcement[]` | `levels[]`, `kind`, `important`, `published` |
| `achievements` | `Achievement[]` | `rule` = lessons/module/challenges/projects/streak/career-section |
| `promos` | `Promo[]` | Bar/popup offers with date window, audience, `version` |
| `blog` | `BlogPost[]` | `slug`, `blocks[]`, `tags[]`, `featured`, `published` |

Course hierarchy:

```text
SiteContent.levels[]            Level { id: 'beginner'|'intermediate'|'expert', name, headline, description,
  │                                     recommendedPath[], icon, color, enabled, sequential }
  └─ courses[]                  Course { id, title, description, published }
       └─ modules[]             Module { id, title, stage, summary, outcome, kind: 'lessons'|'project', published }
            └─ lessons[]        Lesson { id, title, summary, minutes, difficulty, published, cover?, attachments?[], addedAt?,
                 │                       practice { task, steps[], deliverable }, challenge { task, successCriteria[] } }
                 ├─ learn[]     Block[]
                 └─ example[]   Block[]
```

`Block` union (`src/content/types.ts` lines 68–83; rendered by `src/components/Blocks.tsx`):

| `type` | Fields |
|---|---|
| `text` | `body` (markdown subset) |
| `heading` | `text` |
| `callout` | `tone: 'tip'|'why'|'warning'`, `title?`, `body` |
| `list` | `ordered?`, `items[]` |
| `doDont` | `do[]`, `dont[]` |
| `checklist` | `title?`, `items[]` |
| `example` | `title`, `body`, `before?`, `after?` |
| `quiz` | `question`, `options[]`, `answer` (index), `explanation` |
| `interactive` | `widget` (contrast-checker, spacing-scale, type-scale, visual-hierarchy, auto-layout, grid-playground, button-states), `caption?` |
| `image` | `url`, `alt`, `caption?` |
| `video` | `url`, `title` (YouTube/Vimeo embedded; other URLs become a link) |
| `link` | `url`, `title`, `description?` |
| `illustration` | `name` (one of 28 built-in illustrations), `caption?` |
| `qa` | `title?`, `items[] { question, answer, tip? }` |
| `file` | `file: FileAsset { url, name, mimeType, size? }`, `title?`, `display: 'embed'|'download'` |

`published: false` items are filtered out for visitors by `studentView` (`src/lib/content.ts`, via `src/state/content.tsx`).

### 5.2 `profiles.state` — `LearnerState` (`src/data/types.ts` lines 14–29)

| Field | Type | Meaning |
|---|---|---|
| `name` | `string` | Display name |
| `level` | `LevelId | null` | Chosen level |
| `completedLessons` | `Record<lessonId, ISO date>` | |
| `completedChallenges` | `Record<challengeId, ISO date>` | |
| `careerChecks` | `Record<"guideId:itemIndex", boolean>` | Career checklist ticks |
| `bookmarks` | `{ kind: 'lesson'|'challenge'|'resource'|'guide', id, at }[]` | |
| `notes` | `Record<lessonId, { text, updatedAt }>` | |
| `activeDays` | `string[]` (YYYY-MM-DD) | Drives the streak |
| `lastLesson?` | `{ id, at }` | "Continue" target |
| `challengeWork` | `Record<challengeId, { link, notes, checks: boolean[], submittedAt?, updatedAt }>` | Draft/submitted challenge work |
| `notificationsSeenAt?` | ISO date | |
| `updatedAt` | ISO date | |

The same shape is stored in the browser under `localStorage['dk.learner.guest']` — for anonymous learners that is the **only** copy
(plus the backup file they can download).

---

## 6. Storage bucket `media`

| Item | Value (Confirmed, `schema.sql` lines 134–150) |
|---|---|
| Bucket | `id = name = 'media'`, `public = true` (objects are served from the public URL without auth) |
| Size / MIME limits on bucket | None set in SQL → Supabase project defaults apply (**Unknown** exact value on this project; check Storage → Settings) |
| Folder convention | `documents`, `general`, `thumbnails`, `illustrations`, `profiles`, `courses`, `brand` (`src/data/supabaseStore.ts` line 254) |
| Object path | `<folder>/<Date.now()>-<lowercased name with non [a-z0-9._-] replaced by '-'>` |
| Cache-Control | `31536000` on upload; `60` on replace (same path, URL gets `?v=<timestamp>`) |

| Policy on `storage.objects` | Operation | Rule |
|---|---|---|
| `media: public read` | SELECT | `bucket_id = 'media'` (also lets anyone **list** the bucket through the Storage API) |
| `media: admin insert` | INSERT | `bucket_id = 'media' and is_admin()` |
| `media: admin update` | UPDATE | `bucket_id = 'media' and is_admin()` |
| `media: admin delete` | DELETE | `bucket_id = 'media' and is_admin()` |

---

## 7. Processes

### 7.1 Migration process (manual)

There is no migration runner, no Supabase CLI config and no CI step that touches the database (Confirmed: no `supabase/config.toml`,
no DB step in `.github/workflows/deploy.yml`).

1. Supabase dashboard → project `zcxnlelzhkwbvittgcuj` → **SQL Editor** → New query.
2. Paste the file and **Run**. For production today: run `supabase/migrations/002_user_management.sql`, then `003_open_learning.sql`
   (002 first: 003's policy references `profiles.blocked`, which 002 creates).
   Alternatively re-run the whole `supabase/schema.sql` — it is idempotent and ends in the same state.
3. Verify: `select blocked from public.profiles limit 1;` succeeds; Admin → Users shows admin badges; an anonymous review can be submitted; published `navigation` contains `/blog`.
4. Note: 003's `update public.site_content …` edits the stored JSON directly and does **not** create a `content_history` row.

New schema changes should follow the same pattern: add an idempotent `supabase/migrations/00N_*.sql` **and** append the same
statements to `schema.sql` so a fresh project needs one script.

### 7.2 Seed process

- There is **no SQL seed**. The starter content is TypeScript in `src/content/seed/*.ts` (`seedContent` from `src/content/seed/index.ts`), bundled into the app as a lazy chunk (`loadSeed()` in `src/state/content.tsx`).
- Fresh project: visitors see the bundled seed while `site_content` is empty. The admin signs in → the editor starts from the seed ("Initial publish of starter content", `src/admin/state.tsx` lines 73–83) → **Publish** writes the first `published` row, `draft` row and `content_history` row.
- Production was first published at 2026-09-30 09:15 UTC (verified at hand-off).

### 7.3 Reset process (Inferred from code — no script exists)

| Goal | How |
|---|---|
| Undo recent content edits | Admin → Versions → load an older version into the draft → Publish |
| Discard the draft only | In SQL editor: `delete from public.site_content where id = 'draft';` (editor restarts from published) |
| Back to starter content | `delete from public.site_content;` → site shows bundled seed → admin publishes again. History is kept. |
| Clear analytics / reviews / submissions | `truncate public.events;` etc. in SQL editor (irreversible) |
| Browser-only mode / a learner's browser | Clear `localStorage` keys starting with `dk.` (see `docs/API.md` §4) |

### 7.4 Backups

| Option | Status |
|---|---|
| Supabase automatic backups on the Free plan | **Unknown** — not verifiable from the repository. Check Dashboard → Database → Backups. (`docs/OPERATIONS.md` lists daily backups as a Pro-plan feature.) |
| Admin JSON export | **Confirmed**: Admin → Publishing (`/admin/publishing`) → "Download draft as JSON" (`src/admin/pages/Settings.tsx` lines 87–107) — downloads the **draft** `SiteContent`; import loads a file into the draft. Covers content only, not reviews/events/users/media files. |
| `content_history` | Every publish is kept in the database (same failure domain as the database itself). |
| Full logical backup | `pg_dump` against the project's Postgres connection string (Dashboard → Connect; needs the **database password**, never stored in this repo), e.g. `pg_dump "<connection string>" --schema=public --no-owner > backup.sql`. Media files are not in `pg_dump`; download them from Storage separately. |
| Learner progress | Only in each learner's browser + their downloaded backup file; the operator cannot back it up. |
