# Designer Kid — Architecture

Designer Kid is a static React single-page app served from GitHub Pages. It has no server of its own. All reads and writes go through one `DataStore` interface (`src/data/types.ts`), which has two implementations:
- `supabaseStore`: uses `@supabase/supabase-js` to call Supabase REST, Auth, Storage and RPC endpoints directly from the browser. Security is enforced by Postgres Row Level Security and `security definer` SQL functions.
- `localStore`: keeps everything in the browser's `localStorage`. It is used when no Supabase keys are built in.

All site content is **one JSON document** (`SiteContent`, `src/content/types.ts`). The app stores up to two of these documents (`published` and `draft`) plus a version history. Learners have no accounts; their progress stays in their own browser. This document describes the end-to-end structure and every main data flow. Every statement was checked against the code at the paths cited.

> **Status legend** — **Confirmed**: seen in code/config. **Inferred**: reasoned from code (reason given). **Unknown**: cannot be verified from the repository (what to check is given). **Deprecated/unused**: code present but not reachable from the UI. **Planned**: not built.
> "Verified at hand-off" means the lead engineer confirmed the runtime fact on 30 Sep 2026.

**Last verified: 30 Sep 2026 (docs v2.0)**

See also: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for the file tree, route table and stack.

---

## 1. End-to-end diagram

```text
 ┌──────────────┐  HTTPS (static files)   ┌──────────────────────────────────────────────┐
 │ Learner /    │ ───────────────────────►│ GitHub Pages  /designer-kid/                  │
 │ Admin browser│                         │ index.html, 404.html (copy), assets/*.js/css  │
 └──────┬───────┘                         └──────────────────────────────────────────────┘
        │ runs
        ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────┐
 │ React SPA (src/main.tsx → src/App.tsx, BrowserRouter basename=/designer-kid)         │
 │                                                                                      │
 │  Pages & components            src/pages/*, src/components/*   (learner UI)          │
 │  Admin studio (lazy chunk)     src/admin/*                      (only on /admin/*)   │
 │        │ useContent / useAuth / useLearner / useAdmin / useToast / useColorMode      │
 │        ▼                                                                             │
 │  React contexts                src/state/content.tsx   ContentProvider               │
 │                                src/state/ui.tsx        ThemeProvider, ToastProvider  │
 │                                src/state/auth.tsx      AuthProvider                  │
 │                                src/state/learner.tsx   LearnerProvider               │
 │                                src/admin/state.tsx     AdminProvider (admin only)    │
 │        │ pure helpers: src/lib/content.ts (studentView), progress.ts, theme.ts …     │
 │        ▼                                                                             │
 │  DataStore interface           src/data/types.ts                                     │
 │  `store` singleton             src/data/index.ts  (chosen once at module load)       │
 │        │                                   │                                         │
 │        ▼ VITE_SUPABASE_URL + _ANON_KEY set ▼ otherwise                               │
 │  supabaseStore.ts                     localStore.ts                                  │
 │  (supabase-js client,                 (window.localStorage, dk.* keys,               │
 │   implicit auth flow)                  demo admin "Open admin for this browser")     │
 └───────┬──────────────────────────────────────────────────────────────────────────────┘
         │ HTTPS + publishable key (+ user JWT when signed in)
         ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────┐
 │ Supabase project (ref zcxnlelzhkwbvittgcuj — verified at hand-off)                   │
 │  Auth  /auth/v1      email + password, password recovery emails                      │
 │  REST  /rest/v1      tables: site_content, content_history, profiles, admins,        │
 │                      events, submissions, reviews   (all with RLS)                   │
 │  RPC   /rest/v1/rpc  is_admin(), publish_content(content, note)                      │
 │  Triggers            on_auth_user_created → handle_new_user; reviews_defaults;       │
 │                      profiles_protect (migration 002)                                │
 │  Storage /storage/v1 bucket "media" (public read, admin insert/update/delete)         │
 └──────────────────────────────────────────────────────────────────────────────────────┘
         ▲
         └── results flow back up: store → context state → re-render of pages/components (UI)
```

**Store selection (Confirmed, `src/data/index.ts:9`):** `store = url && anonKey ? createSupabaseStore(url, anonKey) : createLocalStore()`. The values are inlined at build time by Vite, so a given build is permanently in one mode. The CI build sets both variables from GitHub repository variables (`.github/workflows/deploy.yml`). The admin UI shows a "Browser-only mode" banner when `store.mode === 'local'` (`src/admin/AdminApp.tsx:202`, `src/components/AppShell.tsx:130`).

---

## 2. Content flow (what learners see)

```text
ContentProvider.reload()                                   src/state/content.tsx:54
  │
  ├─ store.loadPublished()
  │     supabase: select data from site_content where id='published'   (RLS: anyone may read 'published')
  │     local:    localStorage["dk.content.published"]
  │
  ├─ withDefaults(doc)                                     src/state/content.tsx:25
  │     for each top-level key in [brand, theme, home, navigation, footer, mentor, reviews,
  │       notifications, levels, challenges, resources, careerGuides, announcements,
  │       achievements, promos, blog] that is === undefined → copy it from the seed
  │     (seed loaded lazily: import('../content/seed') + structuredClone)
  │
  ├─ null (never published) → loadSeed()
  ├─ exception (e.g. Supabase unreachable/paused) → console.error + loadSeed()   ← bundled fallback
  │
  └─ context value = { raw, content: studentView(raw), isPreview, reload }
        studentView()                                       src/lib/content.ts:13
          levels: only enabled; courses/modules/lessons: only published;
                  modules with 0 lessons and courses with 0 modules are dropped
          challenges/resources/careerGuides/announcements/blog: only published
          promos: only enabled; navigation: only visible
```

- **Backfill granularity (Confirmed):** `withDefaults` works on top-level keys only. A field added *inside* an existing section, such as a new property in `reviews`, is **not** backfilled. Components must handle it being missing (AGENTS.md: "give it a default"). Several readers defend themselves anyway, for example `content.blog ?? []` and `content.promos ?? []`.
- **Production effect (verified at hand-off):** the live published document predates `promos`, `blog` and the `reviews` settings, so all three come from the seed at runtime until the admin publishes again.
- Pages read `useContent().content` (the filtered view). The admin reads `raw` and its own draft.

## 3. Preview flow (draft seen as a learner)

```text
Admin edits → AdminProvider.schedule(next)                    src/admin/state.tsx:111
                 └─ after 250 ms: localStorage["dk.preview.content"] = JSON(draft)   (writePreview)
Admin clicks Preview → openPreview(path='/')                   src/admin/state.tsx:172
                 └─ writePreview(draft); window.open(`${base}${path}?preview=1`, 'dk-preview')
Preview tab:  ContentProvider sees ?preview (read once at mount: isPreviewUrl())
                 └─ raw = withDefaults(readPreview() ?? loadPublished()) ?? seed
                 └─ window 'storage' event with key dk.preview.content → setRaw(withDefaults(next))
                    (storage events fire only in *other* tabs of the same origin → live updates)
AppShell shows the "Preview" banner; PromoLayer ignores dismissals while previewing.
```

- The preview is **same browser, same origin only**. The draft travels through `localStorage` and is never sent anywhere. **Confirmed.**
- `?preview` is read only once, when `ContentProvider` mounts. Navigating inside the preview tab keeps preview mode because the provider stays mounted. **Inferred** from `useState(isPreviewUrl)` in `src/state/content.tsx:52`.
- If the preview write fails (storage full), the preview falls back to published content (`writePreview` catch). **Confirmed.**

## 4. Admin draft → autosave → publish → versions

```text
AdminApp gate (ready? user? isAdmin?)                        src/admin/AdminApp.tsx:48
  └─ AdminProvider mount                                      src/admin/state.tsx:73
       published = withDefaults(store.loadPublished()) ?? seed   (neverPublished = true if none)
       draft     = withDefaults(store.loadDraft().content) ?? structuredClone(published)
       on error: draft = structuredClone(useContent().raw)

Editing:  useAdmin().update(recipe)  → structuredClone(prev) → recipe(next) → setDraft → schedule(next)
          text fields in src/admin/fields.tsx commit through useCommitted() (350 ms debounce,
          commit via a ref to the latest callback)
schedule: saveState='unsaved'; after 1200 ms → persist(): store.saveDraft(draft)
             supabase: upsert site_content {id:'draft', data, updated_at}   (RLS: admin only, id must be 'draft')
             local:    localStorage["dk.content.draft"] = {content, updatedAt}
          success → saveState='saved', savedAt; failure → saveState='error' (PublishBar shows "Draft not saved" + Retry)
          beforeunload warns while there are unsaved edits (dirty ref)

Change detection: diffSections(published, draft) compares JSON of each SECTION_LABELS key
          → "N unpublished" badge; Publish button disabled when nothing changed
          (first-ever publish shows "Initial publish of starter content")

Publish (PublishBar modal, optional note; default note = changed section labels):
          admin.publish(note) → clear autosave timer → store.publish(draft, note)
             supabase: rpc('publish_content', {content, note})      supabase/schema.sql:77
                 security definer, raises 'Only admins can publish' unless is_admin();
                 upsert site_content 'published' AND 'draft' = content;
                 insert content_history (data, note, author = caller's auth email);
                 insert events ('content_published', note, auth.uid(), 'Admin')
                 → all in one function call (one transaction)
             local: versions.unshift(...) ; write dk.content.published ;
                    keep up to 5 versions, dropping older ones until they fit in storage
          → setPublished(clone), saveState='saved', ContentProvider.reload() (admin's own tab updates)

Discard: draft = clone(published) → autosaved like any edit
Versions (Publishing page): store.listVersions() (supabase: latest 30 from content_history, RLS admin-only)
          Restore → store.loadVersion(id) → replaceDraft(content) → autosave; still needs Publish
Backup:   Download draft as JSON / Import JSON (checks schemaVersion === 1 and levels[]) → replaceDraft
```

Learners' open tabs do **not** receive pushed updates. They see new content the next time the page loads. There is no realtime subscription (`supabase.channel` is never used). **Confirmed** by grep.

## 5. Authentication flow (admin-only)

```text
supabase client: createClient(url, key, { auth: { flowType: 'implicit', persistSession: true,
                                                   detectSessionInUrl: true } })   src/data/supabaseStore.ts:33
AuthProvider mount                                                                 src/state/auth.tsx:39
  recovering = /type=recovery/.test(location.hash)        (implicit-flow recovery links carry tokens in the hash)
  store.currentUser()  → auth.getSession() → toAppUser(user)
  store.onAuthChange(cb) → auth.onAuthStateChange((event, session) =>
                             setTimeout(0, () => toAppUser(session.user).then(u => cb(u, event))))
                             (deferred to avoid the supabase-js auth-lock deadlock — comment in code)
     event === 'PASSWORD_RECOVERY' → recovering = true
  toAppUser(user): rpc('is_admin') + select * from profiles where id = user.id
     → { id, email, name, isAdmin, blocked: Boolean(profile.blocked) }
  accept(u): if u.blocked → suspended = true, store.signOut(), user = null
```

| Step | Where | Behaviour |
|---|---|---|
| Sign in | `/admin` (`AdminLogin`) or `/account` (`AccountPage`) | `signInWithPassword`. A blocked user is signed straight out with "This account has been suspended…". `AccountPage` redirects to `?next=` (default `/admin`) once `user` is set. |
| Admin check | `AdminApp` | `!user.isAdmin` → `NotAdmin` page, which shows the SQL to insert the user into `public.admins`. Admin rights live only in the `admins` table (`is_admin()`), never in the profile. |
| Forgot password | `/account?forgot=1` → `requestPasswordReset(email)` | `auth.resetPasswordForEmail(email, { redirectTo: origin + BASE_URL + 'reset-password' })` |
| Recovery link opened | Any page | supabase-js reads the hash (`detectSessionInUrl`) and signs the user in, then `PASSWORD_RECOVERY` sets `recovering`. `RecoveryRedirect` (`src/App.tsx:25`) navigates to `/reset-password` if Supabase landed the user elsewhere. |
| Set new password | `ResetPasswordPage` | Shows the form when `user && (recovering \|\| 2.5 s passed)`. Calls `auth.updateUser({ password })`, then `recovering = false`, toast, navigate `/`. Otherwise shows "link has expired". |
| Change password while signed in | Admin → Settings → "Your admin account" | `updatePassword`, or "Email me a reset link" (`src/admin/pages/Settings.tsx`, `AdminAccount`) |
| Sign out | Admin top bar / menu, Profile page | `auth.signOut()` |
| Local mode | `localStore` | `signIn`/`signUp`/reset throw friendly errors. `enterDemoAdmin()` sets `dk.demoAdmin = true` and returns a fixed demo admin user. |

- **Suspension (migration 002):** `profiles.blocked` can be changed only by admins (`protect_profile` trigger). Suspended users cannot insert reviews or submissions (RLS). On production, 002 has not run (verified at hand-off). `select('*')` then simply has no `blocked` column, so `blocked` is `false`, and the admin "Suspend" action fails with a database error. **Inferred** from code and hand-off facts.
- **Sign-up (Deprecated/unused):** `signUp` is implemented, with `emailRedirectTo` set to the site URL, but it is unreachable in the UI (`src/pages/Account.tsx:166` hard-codes `tab = 'signin'`). The `handle_new_user` trigger would still create a `profiles` row and a `signup` event for any user created in the Supabase dashboard.
- Supabase Auth URL configuration (Site URL, allowed redirect URLs) and SMTP: **Unknown**. Reset links work only if `https://rajuvegesana98.github.io/designer-kid/reset-password` is allowed in Supabase → Authentication → URL Configuration.

## 6. Learner progress flow

```text
LearnerProvider                                             src/state/learner.tsx
  initial state = { ...emptyLearner(), ...JSON(localStorage["dk.learner.guest"]) }
  every state change → writeGuest(state)   (errors ignored: progress stays in memory)
  actions: setLevel, setName, completeLesson/uncompleteLesson, visitLesson, toggleBookmark,
           setNote, toggleCareerCheck, saveChallengeWork, completeChallenge,
           markNotificationsSeen, resetProgress, importState
           (lesson visits/completions, career checks, challenge completion add today to activeDays → streak)

Remote sync — ONLY when a user is signed in and store.mode === 'supabase':
  on user change: store.loadLearner(user.id)  (select state from profiles)
                  → mergeLearner(local, remote) or {...local, name: local.name || user.name}
                  → store.saveLearner(user.id, merged)
  on state change: debounced 800 ms store.saveLearner  (update profiles set state, level, name, last_active_at)
  errors → console.error only
```

- Because only admins sign in, remote sync in practice copies **the admin's own browser progress** into that admin's `profiles.state` row. Anonymous learners never touch the database for progress. **Confirmed** (the condition at `learner.tsx:59` skips sync only for no user, or for an admin in local mode).
- **Backup/restore (Profile page, `src/pages/Account.tsx:62-95`):** "Download my progress" saves `{ app: 'designer-kid', version: 1, state }` as JSON. "Restore" checks `app` and `state.completedLessons`, then `importState()` merges the file with the current state using `mergeLearner`.
- `mergeLearner` (`src/lib/progress.ts:139`) takes the union of completions, checks and bookmarks, keeps the newer entry per note and per challenge-work item, and the union of active days.
- Modules are never locked. `Level.sequential` only produces a "suggested after …" hint (`moduleLock`, `src/lib/progress.ts:57`).

## 7. Analytics events flow

```text
store.track(type, detail, user|null)
  supabase: insert into events {type, detail, user_id, user_name ('Guest' if none)}
            RLS "events: anyone inserts own": user_id null or = auth.uid(), and type <> 'content_published'
            NOTE: the returned error is not checked → failures are silent by design ("Analytics must never break…")
  local:    unshift into localStorage["dk.events"], keep 200
```

| Event type | Emitted by |
|---|---|
| `level_selected` | `LearnerProvider.setLevel` (onboarding, level switcher) |
| `lesson_completed` | `LearnerProvider.completeLesson` (detail = lesson title) |
| `challenge_submitted` | `LearnerProvider.completeChallenge` (every mode) |
| `booking_clicked` | `MentorLink` click (`src/components/MentorLink.tsx:27`) |
| `content_published` | Only the `publish_content` SQL function (clients are blocked by RLS) |
| `signup` | Only the `handle_new_user` trigger on `auth.users` insert |
| `module_completed` | **Deprecated/unused**: in the type and CHECK constraint and labelled in the admin dashboard, but never emitted |

Reading: `useAnalytics()` (`src/admin/pages/Dashboard.tsx:16`) loads `listLearners()`, `listEvents(1000)` and `listSubmissions()` in parallel. RLS allows only admins to select `events`. `computeStats` derives learner counts from anonymous events because learners have no accounts.

**Challenge submissions:** with Supabase and a signed-in user, `completeChallenge` inserts into `submissions` (link and notes) and then tracks the event. For anonymous learners only the `challenge_submitted` event, with the challenge title, is recorded. The link and notes stay in the learner's browser. **Confirmed** (`src/state/learner.tsx:159-173`).

## 8. Reviews flow

```text
Public:  useApprovedReviews → store.listReviews(false)          (supabase: status='approved', featured first, newest first)
Submit:  review form (pages/Reviews.tsx) validates name, rating, ≥20 chars, consent
         → store.submitReview({name, role, rating, text}, user|null, autoApprove = !content.reviews.requireApproval)
            supabase: insert reviews {user_id, name, role, rating, text}
                      BEFORE INSERT trigger review_defaults(): featured=false, reply=null,
                      status = published doc reviews.requireApproval (default true) ? 'pending' : 'approved'
                      (the client only *predicts* the status to show "pending" vs "live")
            local:    stored in localStorage["dk.reviews"] with the status decided in the browser
Admin:   ReviewsAdmin → listReviews(true), updateReview(status/featured/reply), deleteReview   (RLS: admin only)
```

- **Production gap (verified at hand-off):** migration 003 (the `"reviews: anyone submits"` policy) has not been run. The live insert policy is still the base one, which requires `auth.uid() is not null`, so anonymous visitors get an RLS error, shown in the form's error line. Run `supabase/migrations/003_open_learning.sql`, or the tail of `schema.sql`, to fix this.
- The trigger reads `requireApproval` from the **stored** published document. The published document predates the `reviews` section, so `coalesce(..., true)` applies and new reviews are `pending`. **Inferred** from `supabase/schema.sql:180` and the hand-off facts.

## 9. File upload flow

| Entry point | Folder | Pre-processing | Limit |
|---|---|---|---|
| Admin → Media page (`src/admin/pages/Media.tsx`) | Chosen: `documents`, `general`, `thumbnails`, `illustrations`, `profiles`, `courses`, `brand` | `optimise()`: PNG/JPEG/WebP larger than 2000 px or ≥ 600 KB are redrawn on a canvas at max 2000 px and encoded as WebP at 0.85. The result is used only if it is smaller. | Rejects files > 50 MB (`MAX_BYTES * 10`) |
| `ImageField` / `MediaPicker` (`src/admin/fields.tsx:148`) | Caller's `folder` (default `general`) | None | None in code |
| `DocUploadButton` / `useDocUpload` (`src/admin/uploads.tsx`) | `documents` | None; accepts PDF, PPT/PPTX, Key, ODP, DOC/DOCX | 50 MB |

```text
store.uploadMedia(file, folder)
  supabase: path = `${folder}/${Date.now()}-${safeName(file.name)}`   (safeName: lowercase, [^a-z0-9.-_] → '-')
            storage.from('media').upload(path, file, { contentType, cacheControl: '31536000' })
            → MediaItem { id: path, url: getPublicUrl(path), folder, … }
            RLS on storage.objects: insert/update/delete only if is_admin(); public read
  local:    ≤ 1.5 MB, stored as a data: URL inside localStorage["dk.media"]
store.replaceMedia(item, file): same path, upsert, cacheControl '60', URL gets ?v=<timestamp> cache-buster
store.listMedia(): lists the 7 known folders (500 each), newest first — files in other folders are not listed
store.deleteMedia(item): storage remove([path])
```

The Media page warns before deleting a file that is still used. It checks whether the URL appears anywhere in `JSON.stringify(draft) + JSON.stringify(published)` (`usageOf`). The uploaded URL is then stored inside the content document, for example `FileAsset.url` or `image` fields, and goes live only on Publish. A bucket-level file-size limit is **Unknown**: the bucket is created without `file_size_limit`, so the Supabase project default applies. Check Storage settings.

## 10. PDF / print flow

```text
"PDF" links:  lesson (/print/lesson/:id), module (/print/module/:levelId/:moduleId),
              career guide (/print/guide/:id), blog (/print/blog/:postId); admin editors link the same paths
PrintShell (src/pages/Print.tsx:20)
  - applies the LIGHT theme variables inline (themeVars(theme,'light')), data-mode="light"
  - <PrintMode.Provider value={true}> → Blocks render print-friendly variants
       (e.g. quizzes show the answer, embedded files are not iframed — src/components/Blocks.tsx)
  - document.fonts.ready → 350 ms → window.print()   (skipped with ?auto=0)
  - toolbar tells the user to choose "Save as PDF"; @media print rules in src/styles/global.css:1003
```

PDFs come from the browser's print dialog. There is no PDF library and no server rendering. **Confirmed.** Print routes sit outside `AppShell`, and `PromoLayer` hides itself on `/print`.

## 11. Search

- `buildIndex(content)` (`src/components/Search.tsx:33`) indexes modules, lessons, challenges, resources (external links), career guides and blog articles from the **filtered** `content`. `searchIndex` requires every term to appear in the title or plain-text description. Its score is +3 per term in the title, +2 if the title starts with the term, and +1 otherwise. Results can be filtered by level (`all` items always match) and by category.
- UI: `SearchPalette`, a modal opened from `AppShell` with ⌘/Ctrl + K or "/" when the focus is not in a text field. It supports arrow keys and Enter, and "see all" goes to `/search?q=&level=`. `SearchPage` (`/search`) uses `q`, `level` and `cat` URL parameters.
- Search is fully client-side. No backend call. **Confirmed.**

## 12. Notifications (computed client-side)

`buildNotifications(content, learnerState)` (`src/components/Notifications.tsx:26`) is a pure function. It is controlled by the `content.notifications` switches and builds up to 20 notes:
- Announcements for the learner's level or `all`, split by `kind` (career vs other).
- Lessons in the learner's level with `addedAt` in the last 30 days that are not yet completed. `collapse()` groups these per module.
- Challenges added in the last 30 days for the learner's level.
- "You completed <course>" for fully completed courses.

The unread count compares note dates with `state.notificationsSeenAt`. Opening the bell calls `markNotificationsSeen()`. Nothing is sent or stored on a server, and there is no email or push. **Confirmed.**

## 13. Offers / promos layer

`PromoLayer` (`src/components/Promo.tsx:93`) is mounted once above the routes.
- It is hidden on `/admin`, `/print` and `/account`.
- Candidate offers: `content.promos` (already filtered to `enabled` by `studentView`) that pass `promoIsActive`, which checks:
  - `startsAt` ≤ today ≤ `endsAt`, comparing ISO dates in UTC;
  - `pages === 'home'` only on `/` and `/welcome`;
  - audience `new` (no level chosen) or `returning` (level chosen).
- The first active `bar` promo renders as an animated bar above the page. The first active `popup` promo opens a `Modal` after 1.2 s.
- Dismissal: a `dismissible` offer is stored as `localStorage["dk.promo.<id>.v<version>"] = '1'`. Bumping `version` in the admin shows it again. A non-dismissible offer is hidden only for the current session state.
- In preview mode, dismissals are ignored so the admin always sees the offer.

## 14. Error-handling patterns

| Pattern | Where | Behaviour |
|---|---|---|
| Store errors become `Error(message)` | `fail()` in `src/data/supabaseStore.ts:27` | Every Supabase call except `track` (and the secondary `admins`/`profiles` reads in `listLearners`/`toAppUser`) throws on `error` |
| try/catch + toast | Admin pages, uploads, publish, restore, review moderation | `toast(err.message, 'error')` (7 s) or an inline `role="alert"` message in forms |
| Content fallback | `ContentProvider` | Any load error → seed content plus `console.warn('Showing bundled content…')`, so a paused Supabase project still shows the bundled course (though not newer published edits) |
| Admin draft fallback | `AdminProvider` | Load error → draft = current `raw` content |
| Autosave failure | `AdminProvider.persist` | `saveState = 'error'` → PublishBar shows "Draft not saved" + Retry |
| Fire-and-forget | `track`, learner remote saves | `.catch(() => {})` / `console.error`; never blocks the UI |
| Storage quota | `localStore.write`, `writeGuest`, `writePreview`, promo dismissals | localStore throws a friendly "ran out of local storage space" error. The others ignore the failure. |
| Missing items | Lesson/module/guide/blog/challenge pages | `EmptyState` "… not found" |
| React error boundary | — | **None** (grep finds no `ErrorBoundary`/`componentDidCatch`). A render exception blanks the app. |

## 15. State management summary

| Context | Provider | Holds | Persistence |
|---|---|---|---|
| Content | `ContentProvider` (`src/state/content.tsx`) | `raw`, `content` (studentView), `isPreview`, `reload` | Supabase `site_content`/localStorage; preview in `dk.preview.content` |
| Colour mode | `ThemeProvider` (`src/state/ui.tsx`) | `pref`, `resolved`, `setPref` | `localStorage["dk.colorMode"]` (also read by `index.html` before paint) |
| Toasts | `ToastProvider` (`src/state/ui.tsx`) | Up to 3 toasts | Memory |
| Auth | `AuthProvider` (`src/state/auth.tsx`) | `user`, `ready`, `mode`, `recovering`, `suspended`, auth actions | supabase-js session (its own localStorage key); local: `dk.demoAdmin` |
| Learner | `LearnerProvider` (`src/state/learner.tsx`) | `LearnerState` + actions, `synced` | `localStorage["dk.learner.guest"]`; `profiles.state` only when signed in |
| Admin | `AdminProvider` (`src/admin/state.tsx`) | `draft`, `published`, `changedSections`, `saveState`, actions | Supabase `site_content` 'draft' / `dk.content.draft` |
| Print | `PrintMode` (`src/components/Blocks.tsx:10`) | Boolean | — |

Page-level state uses `useState`, and filters and tabs often live in URL search parameters (`useSearchParams`, for example the Library/Users tabs and the search page). There is no global store library.

**`localStorage` keys (Confirmed):**
- `dk.colorMode`
- `dk.learner.guest`
- `dk.preview.content`
- `dk.promo.<id>.v<n>`
- Local mode only: `dk.content.published`, `dk.content.draft`, `dk.content.versions`, `dk.demoAdmin`, `dk.events`, `dk.submissions`, `dk.media`, `dk.reviews`, `dk.learner.<id>`

## 16. Code-splitting and bundle

| Chunk (last local build, `dist/assets/`) | Size | Loaded when |
|---|---|---|
| `index-*.js` | ≈ 861 KB | Always (app shell, learner pages, supabase-js, motion, router) |
| `seed-*.js` | ≈ 736 KB | Only via `import('../content/seed')`: never published, a missing section needs backfill, a load error, or admin start-up when nothing is published |
| `AdminApp-*.js` | ≈ 184 KB | Only when a `/admin/*` route renders (`lazy()` in `src/App.tsx:33`) |
| `index-*.css` | ≈ 45 KB | Always |

Sizes are uncompressed bytes from `ls -la dist/assets` on 30 Sep 2026. **Inferred:** on production the seed chunk **is** downloaded on every visit, because the published document lacks `promos`/`blog`/`reviews` and `withDefaults` must load the seed to fill them. This stops once the admin publishes again, because the draft already contains every section.

---

## 17. Key modules

| Module | Responsibility | Key exports |
|---|---|---|
| `src/App.tsx` | Router, provider stack, route table, lazy admin | `default App` |
| `src/content/types.ts` | The whole content model | `SiteContent`, `Level`, `Course`, `Module`, `Lesson`, `Block`, `Challenge`, `Resource`, `CareerGuide`, `Promo`, `BlogPost`, `Theme`, `WidgetName`, `IllustrationName` |
| `src/content/seed/index.ts` | Bundled starter content | `seedContent` |
| `src/data/types.ts` | Storage contract and data shapes | `DataStore`, `LearnerState`, `AppUser`, `Review`, `MediaItem`, `EventType`, `ContentVersion` |
| `src/data/index.ts` | Chooses the implementation | `store` |
| `src/data/supabaseStore.ts` | Supabase implementation (Auth, tables, RPC, Storage) | `createSupabaseStore` |
| `src/data/localStore.ts` | Browser-only implementation | `createLocalStore` |
| `src/state/content.tsx` | Load/backfill/filter content; preview | `ContentProvider`, `useContent`, `withDefaults`, `loadSeed`, `PREVIEW_KEY`, `isPreviewUrl` |
| `src/state/auth.tsx` | Session, admin flag, recovery, suspension | `AuthProvider`, `useAuth` |
| `src/state/learner.tsx` | Learner progress and actions | `LearnerProvider`, `useLearner` |
| `src/state/ui.tsx` | Theme application, colour mode, toasts | `ThemeProvider`, `useColorMode`, `ToastProvider`, `useToast` |
| `src/lib/content.ts` | Student filtering and lookups | `studentView`, `findLesson`, `findModule`, `levelLessons`, `levelModules`, `guidesFor`, `CAREER_SECTIONS` |
| `src/lib/progress.ts` | Progress maths | `emptyLearner`, `levelProgress`, `moduleProgress`, `moduleLock`, `nextLesson`, `streak`, `achievementUnlocked`, `mergeLearner` |
| `src/lib/theme.ts` | Theme → CSS variables, contrast, fonts | `themeVars`, `contrastRatio`, `onColor`, `ensureFonts`, `FONT_OPTIONS` |
| `src/lib/markdown.tsx` | Safe inline markdown | `Markdown`, `inline`, `plain` |
| `src/components/AppShell.tsx` | Learner layout, nav, search shortcut, banners | `AppShell`, `SiteFooter` |
| `src/components/Blocks.tsx` | Lesson block renderer, print mode | `Blocks`, `BlockView`, `FileCard`, `PrintMode` |
| `src/components/Search.tsx` | Client-side search | `buildIndex`, `searchIndex`, `SearchPalette`, `ResultRow`, `LevelFilter` |
| `src/components/Notifications.tsx` | Computed notifications | `buildNotifications`, `NotificationsButton` |
| `src/components/Promo.tsx` | Offers layer | `PromoLayer`, `promoIsActive`, `PromoBar`, `PromoCard` |
| `src/components/MentorLink.tsx` | 1:1 booking link | `useMentor`, `MentorLink`, `MentorSection` |
| `src/components/ui.tsx` | UI kit | `Modal`, `Sheet`, `ConfirmDialog`, `Tabs`, `PasswordInput`, `FullPageLoader`, `timeAgo`, … |
| `src/pages/Print.tsx` | Printable documents | `PrintLesson`, `PrintModule`, `PrintGuide`, `PrintBlog` |
| `src/admin/AdminApp.tsx` | Admin gate, routes, layout, publish bar | `default AdminApp` |
| `src/admin/state.tsx` | Draft/autosave/preview/publish/versions | `AdminProvider`, `useAdmin`, `diffSections`, `newId`, `slugify`, `moveItem`, `lvl`/`course`/`mod`/`lesson` |
| `src/admin/fields.tsx` | Debounced admin form controls, media picker | `TextField`, `TextArea`, `ImageField`, `MediaPicker`, `SortableList`, `FormSection`, … |
| `src/admin/SlideEditor.tsx` | Slide-style editor with undo/redo | `SlideEditor`, `EditableText`, `EditableSteps` |
| `src/admin/BlocksEditor.tsx` | Per-block forms | `BlocksEditor`, `BlockForm`, `emptyBlock` |
| `src/admin/uploads.tsx` | Document uploads | `useDocUpload`, `DocUploadButton`, `DOC_ACCEPT` |
| `supabase/schema.sql` | Tables, RLS, functions, triggers, bucket | `is_admin()`, `publish_content()`, `handle_new_user()`, `review_defaults()`, `protect_profile()` |
| `scripts/postbuild.mjs` | Build guard and SPA fallback | — |

## 18. Unknowns

| Item | How to check |
|---|---|
| Supabase Auth Site URL / redirect allow-list and SMTP (affect password-reset links and email limits) | Supabase dashboard → Authentication → URL Configuration / Emails |
| Storage bucket `media` size limit and allowed MIME types | Supabase dashboard → Storage → media → settings |
| Whether migrations 002/003 have been run after hand-off | Query `information_schema.columns` for `profiles.blocked`, and `pg_policies` for `reviews: anyone submits` |
