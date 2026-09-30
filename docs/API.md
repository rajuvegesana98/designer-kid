# API — Designer Kid

Designer Kid has **no custom backend API**. There is no server code, no serverless/edge function and no `/api` route in the
repository (Confirmed: the only runtime code is the Vite/React SPA in `src/`; `supabase/` contains SQL only; hosting is static
GitHub Pages). All data access goes from the browser straight to **Supabase** (PostgREST, RPC, Storage, Auth) using the
publishable (anon) key, and **Row Level Security is the only authorisation layer**. Inside the app, every component talks to one
object, `store`, which implements the `DataStore` interface (`src/data/types.ts`). `src/data/index.ts` picks the implementation:
`createSupabaseStore` when both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set at build time, otherwise
`createLocalStore` (browser-only, `localStorage`). This document is the reference for that interface.

Last verified: 30 Sep 2026 (docs v2.0)

**Status legend.** **Confirmed** = literally in code · **Inferred** = reasoned from code · **Inferred-from-supabase-js-conventions** =
the HTTP path/method that supabase-js v2 generates for the call shown (the code never writes the URL itself) · **Unknown** =
not verifiable from the repository · **Pending** = depends on SQL migrations 002/003, which are **not yet applied on production**
(see `docs/DATABASE.md` §1).

---

## 1. What is *not* an API

| Thing | Why it is not an API |
|---|---|
| Client-side routes (`/`, `/learn`, `/learn/:levelId`, `/learn/:levelId/:moduleId`, `/lesson/:lessonId`, `/challenges`, `/challenges/:challengeId`, `/career`, `/career/:section`, `/resources`, `/progress`, `/profile`, `/search`, `/reviews`, `/blog`, `/blog/:slug`, `/welcome`, `/start`, `/account`, `/reset-password`, `/print/…`, `/admin/*`) | React Router pages (`src/App.tsx`). GitHub Pages serves the same `index.html`/`404.html` for all of them (`scripts/postbuild.mjs`); they return HTML, not data. |
| `?preview` query string | Makes the SPA read draft content from this browser's `localStorage['dk.preview.content']` (`src/state/content.tsx`). Nothing is fetched from a server. |
| Admin "Download draft as JSON" / learner backup download | Generated in the browser (Blob download); no endpoint. |

---

## 2. Transport and authentication (supabase-js)

| Item | Value |
|---|---|
| Client | `createClient(url, anonKey, { auth: { flowType: 'implicit', persistSession: true, detectSessionInUrl: true } })` — `src/data/supabaseStore.ts` line 33 (Confirmed) |
| Base URL | `VITE_SUPABASE_URL` (production: `https://zcxnlelzhkwbvittgcuj.supabase.co`, verified at hand-off) |
| Headers on every request | `apikey: <publishable key>` and `Authorization: Bearer <user access token or the publishable key when signed out>` (Inferred-from-supabase-js-conventions) |
| Roles | Signed out → Postgres role `anon`; signed in → `authenticated` with `auth.uid()` = user id. "Admin" = row in `public.admins`, checked by `is_admin()` inside policies. |
| Session storage | supabase-js default: `localStorage` key `sb-<project-ref>-auth-token` (Inferred-from-supabase-js-conventions) |
| Error handling | Helper `fail(error)` throws `new Error(error.message)` — the raw PostgREST/Storage/Auth message is shown to the user in a toast (Confirmed, lines 27–29) |

Paths below are relative to the base URL. `…` = standard PostgREST query parameters.

---

## 3. `DataStore` methods — Supabase implementation

### 3.1 Auth

| Method | Supabase call (Confirmed) | HTTP (Inferred-from-supabase-js-conventions) | Auth / RLS | Request → response mapping | Errors |
|---|---|---|---|---|---|
| `currentUser()` | `sb.auth.getSession()` then `toAppUser(user)` | none if the stored token is fresh; otherwise `POST /auth/v1/token?grant_type=refresh_token` | — | `null` or `AppUser` | none thrown |
| `toAppUser` (internal, used by all auth methods) | `sb.rpc('is_admin')`; `sb.from('profiles').select('*').eq('id', user.id).maybeSingle()` | `POST /rest/v1/rpc/is_admin`; `GET /rest/v1/profiles?select=*&id=eq.<uid>` | own profile readable (`profiles: read own or admin`) | `AppUser { id, email, name = profile.name ‖ user_metadata.name ‖ email local part ‖ 'Learner', isAdmin, blocked = profile.blocked }` | errors ignored (treated as non-admin) |
| `onAuthChange(cb)` | `sb.auth.onAuthStateChange(...)`; callback deferred with `setTimeout` to avoid the auth-lock deadlock | no request of its own | — | `cb(AppUser|null, event)`; `PASSWORD_RECOVERY` event switches the UI to "set new password" (`src/state/auth.tsx`) | — |
| `signUp(name, email, password)` | `sb.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: siteUrl() } })` | `POST /auth/v1/signup?redirect_to=<site>` | public | `{ needsConfirmation: true }` if no session, else `{ user }` | Auth error message |
| — note | **Deprecated/unused in UI**: the Account page hard-codes `tab = 'signin'` (`src/pages/Account.tsx` ~line 166), so no sign-up form is reachable. Supabase may still accept sign-ups — see `docs/SECURITY.md`. | | | | |
| `signIn(email, password)` | `sb.auth.signInWithPassword({ email, password })` | `POST /auth/v1/token?grant_type=password` | public | `AppUser`; `AuthProvider` signs a `blocked` user straight out | Auth error message (e.g. invalid credentials) |
| `signOut()` | `sb.auth.signOut()` | `POST /auth/v1/logout` | signed in | clears local session | not thrown |
| `requestPasswordReset(email)` | `sb.auth.resetPasswordForEmail(email, { redirectTo: <site>reset-password })` | `POST /auth/v1/recover?redirect_to=…` | public | email sent by Supabase Auth | Auth error (e.g. email rate limit) |
| `updatePassword(password)` | `sb.auth.updateUser({ password })` | `PUT /auth/v1/user` | signed in (or recovery session from the link's URL hash) | — | Auth error |
| `enterDemoAdmin?` | not implemented in Supabase mode | — | — | — | — |

`siteUrl()` = `window.location.origin + import.meta.env.BASE_URL` (e.g. `https://rajuvegesana98.github.io/designer-kid/`).

### 3.2 Content

| Method | Supabase call (Confirmed) | HTTP (Inferred-from-supabase-js-conventions) | Who is allowed (RLS) | Response mapping | Errors |
|---|---|---|---|---|---|
| `loadPublished()` | `from('site_content').select('data').eq('id','published').maybeSingle()` | `GET /rest/v1/site_content?select=data&id=eq.published` | anyone | `SiteContent` or `null` (client then uses bundled seed) | thrown; `ContentProvider` catches and shows the seed |
| `loadDraft()` | `from('site_content').select('data, updated_at').eq('id','draft').maybeSingle()` | `GET /rest/v1/site_content?select=data,updated_at&id=eq.draft` | admin only (others get `null`) | `{ content, updatedAt }` or `null` | thrown |
| `saveDraft(content)` | `from('site_content').upsert({ id: 'draft', data: content, updated_at })` | `POST /rest/v1/site_content` with `Prefer: resolution=merge-duplicates` | admin; WITH CHECK forces `id = 'draft'` | returns the ISO time it sent | thrown (admin UI shows "error" save state) |
| `publish(content, note)` | `rpc('publish_content', { content, note })` | `POST /rest/v1/rpc/publish_content` body `{ "content": {…}, "note": "…" }` | function raises `Only admins can publish` for non-admins | `void` | thrown |
| `listVersions()` | `from('content_history').select('id, note, created_at, author').order('created_at', desc).limit(30)` | `GET /rest/v1/content_history?select=id,note,created_at,author&order=created_at.desc&limit=30` | admin | `ContentVersion { id: String(id), note, createdAt, author }` | thrown |
| `loadVersion(id)` | `from('content_history').select('data').eq('id', id).single()` | `GET /rest/v1/content_history?select=data&id=eq.<id>` (single-object Accept header) | admin | `SiteContent` | thrown; "That version no longer exists." |

### 3.3 Learner progress

| Method | Supabase call (Confirmed) | HTTP (Inferred) | Who is allowed | Mapping | Errors |
|---|---|---|---|---|---|
| `loadLearner(userId)` | `from('profiles').select('state').eq('id', userId).maybeSingle()` | `GET /rest/v1/profiles?select=state&id=eq.<uid>` | own row or admin | `LearnerState` or `null` if `{}` | thrown (caller logs) |
| `saveLearner(userId, state)` | `from('profiles').update({ state, level, name (if set), last_active_at: now }).eq('id', userId)` | `PATCH /rest/v1/profiles?id=eq.<uid>` | own row (not blocked, after 002) | — | thrown (caller logs) |

Only called when someone is signed in (`src/state/learner.tsx`). Anonymous learners never hit Supabase for progress. **Inferred**:
on production that means only an admin who browses the site while signed in.

### 3.4 Activity and submissions

| Method | Supabase call (Confirmed) | HTTP (Inferred) | Who is allowed | Mapping | Errors |
|---|---|---|---|---|---|
| `track(type, detail, user?)` | `from('events').insert({ type, detail, user_id: user?.id ?? null, user_name: user?.name ?? 'Guest' })` | `POST /rest/v1/events` | **anyone** (anon with `user_id` null); `content_published` rejected | — | **not checked** — the returned `error` is ignored ("Analytics must never break the learning experience"); callers also `.catch(() => {})` |
| `submitChallenge(user, challengeId, link, notes)` | `from('submissions').insert({ user_id, user_name, challenge_id, link, notes })` | `POST /rest/v1/submissions` | signed-in user for own id (and not blocked, 002) | — | thrown |

Call sites of `track`: `level_selected`, `lesson_completed`, `challenge_submitted` (`src/state/learner.tsx`), `booking_clicked`
(`src/components/MentorLink.tsx`).

### 3.5 Admin — users and analytics

| Method | Supabase call (Confirmed) | HTTP (Inferred) | Who is allowed | Mapping | Errors |
|---|---|---|---|---|---|
| `listLearners()` | `from('profiles').select('*').order('created_at', desc)` then `from('admins').select('user_id')` | `GET /rest/v1/profiles?select=*&order=created_at.desc`; `GET /rest/v1/admins?select=user_id` | admin (profiles); admins list needs **002** (Pending) — until then it returns no rows, so `isAdmin` is always false | `LearnerRow { id, name, email, level, state, createdAt, lastActiveAt, blocked, isAdmin }` | profiles error thrown; admins error ignored |
| `updateLearnerProfile(id, { name?, level?, blocked? })` | if name/level: `select('state').eq('id', id).single()` and merge; then `from('profiles').update(row).eq('id', id)` | `GET` then `PATCH /rest/v1/profiles?id=eq.<id>` | admin updating others needs **002**; `blocked` column needs **002** | — | thrown (on production today: unknown-column / RLS errors) |
| `resetLearnerProgress(id)` | `select('state')…single()` then `update({ state: {…cleared, lastLesson: null, updatedAt} })` | `GET` + `PATCH /rest/v1/profiles?id=eq.<id>` | admin for others needs **002** | — | update error thrown |
| `setAdmin(id, admin)` | `from('admins').insert({ user_id: id })` or `.delete().eq('user_id', id)` | `POST /rest/v1/admins` or `DELETE /rest/v1/admins?user_id=eq.<id>` | **002** (Pending); cannot remove yourself | — | thrown |
| `listEvents(limit)` | `from('events').select('*').order('created_at', desc).limit(limit)` | `GET /rest/v1/events?select=*&order=created_at.desc&limit=<n>` | admin | `ActivityEvent { id, type, detail, userName (default 'Guest'), createdAt }` | thrown |
| `listSubmissions()` | `from('submissions').select('*').order('created_at', desc)` | `GET /rest/v1/submissions?select=*&order=created_at.desc` | admin (or own rows) | `Submission { id, userId, userName, challengeId, link, notes, createdAt }` | thrown |

### 3.6 Reviews

| Method | Supabase call (Confirmed) | HTTP (Inferred) | Who is allowed | Mapping | Errors |
|---|---|---|---|---|---|
| `listReviews(all?)` | `from('reviews').select('*').order('featured', desc).order('created_at', desc)` + `.eq('status','approved')` unless `all` | `GET /rest/v1/reviews?select=*&order=featured.desc,created_at.desc[&status=eq.approved]` | anyone sees approved; admin sees all | `toReview()` → `Review { id: String, userId, name, role, rating (default 5), text, status, featured, reply ('' if null), createdAt }` | thrown (public page catches → empty list) |
| `submitReview(review, user, autoApprove)` | `from('reviews').insert({ user_id: user?.id ?? null, name, role, rating, text })` — **no** status/featured/reply sent | `POST /rest/v1/reviews` | base schema: signed-in only; anonymous needs **003** (Pending) | returns a local `Review` with `id: ''` and the status the trigger *should* apply (`autoApprove ? 'approved' : 'pending'`) — the row is not read back | thrown (on production today anonymous visitors get the RLS violation message) |
| `updateReview(id, patch)` | `from('reviews').update(patch).eq('id', id)` with `status` / `featured` / `reply` | `PATCH /rest/v1/reviews?id=eq.<id>` | admin | — | thrown |
| `deleteReview(id)` | `from('reviews').delete().eq('id', id)` | `DELETE /rest/v1/reviews?id=eq.<id>` | admin | — | thrown |

### 3.7 Media (Supabase Storage, bucket `media`)

| Method | Supabase call (Confirmed) | HTTP (Inferred) | Who is allowed | Mapping | Errors |
|---|---|---|---|---|---|
| `listMedia()` | for each folder in `documents, general, thumbnails, illustrations, profiles, courses, brand`: `storage.from('media').list(folder, { limit: 500, sortBy: created_at desc })` | `POST /storage/v1/object/list/media` body `{ prefix, limit, offset, sortBy }` (×7) | anyone (public-read policy) | `MediaItem { id: path, name, url: getPublicUrl(path), size: metadata.size, mimeType: metadata.mimetype, folder, createdAt }`, merged and sorted newest first | per-folder errors ignored (empty list); files outside these folders are not listed |
| `uploadMedia(file, folder)` | `storage.from('media').upload(path, file, { contentType: file.type, cacheControl: '31536000' })`, `path = <folder>/<Date.now()>-<safeName>` | `POST /storage/v1/object/media/<path>` | admin | `MediaItem` built locally | thrown (e.g. RLS, size limit) |
| `replaceMedia(item, file)` | `storage.from('media').update(item.id, file, { contentType, cacheControl: '60', upsert: true })` | `PUT /storage/v1/object/media/<path>` | admin | same path; URL gets `?v=<timestamp>` | thrown |
| `deleteMedia(item)` | `storage.from('media').remove([item.id])` | `DELETE /storage/v1/object/media` body `{ prefixes: [path] }` | admin | — | thrown |
| public file URL | `getPublicUrl(path)` (no request) | `GET /storage/v1/object/public/media/<path>` when a browser loads it | anyone | — | — |

Client-side upload limits (not enforced by the server): 50 MB (`src/admin/uploads.tsx`, `src/admin/pages/Media.tsx`); images
(png/jpeg/webp) larger than 2000 px or 600 KB are re-encoded to WebP in the browser (`optimise`, `Media.tsx` lines 29–43).

---

## 4. `DataStore` — browser-only implementation (`src/data/localStore.ts`)

Used when the Supabase variables are missing at build time (local development, demos). Nothing leaves the browser; nothing is
shared between devices.

| Method(s) | Behaviour |
|---|---|
| `currentUser`, `enterDemoAdmin`, `signOut` | "Open admin for this browser" sets `dk.demoAdmin = true` and returns a fixed demo admin (`id 'demo-admin'`, `isAdmin: true`). `signOut` removes the flag. No password. |
| `signUp`, `signIn`, `requestPasswordReset`, `updatePassword` | Throw "… needs Supabase …" errors. |
| `setAdmin` | Throws "Managing admins needs Supabase to be connected." |
| `loadPublished` / `loadDraft` / `saveDraft` | `dk.content.published`, `dk.content.draft` (`{ content, updatedAt }`). |
| `publish` | Writes `dk.content.published` and prepends a version to `dk.content.versions`, keeping up to 5 and fewer if the ~5 MB quota is exceeded (history never blocks publishing). |
| `listVersions` / `loadVersion` | From `dk.content.versions`. |
| `loadLearner` / `saveLearner` | `dk.learner.<id>`. |
| `track` | Prepends to `dk.events` (max 200); `userName` defaults to "Guest (this browser)". |
| `submitChallenge` | Prepends to `dk.submissions`. |
| `listLearners` | Only the guest in this browser (`dk.learner.guest`), if any. |
| `updateLearnerProfile` / `resetLearnerProgress` | Edit `dk.learner.<id>` (ignores `blocked`). |
| `listEvents` / `listSubmissions` | Read the local lists. |
| `listReviews` / `submitReview` / `updateReview` / `deleteReview` | `dk.reviews`; status chosen by `autoApprove` in the browser. |
| `listMedia` / `uploadMedia` / `replaceMedia` / `deleteMedia` | Files stored as **data URLs** in `dk.media`; max **1.5 MB** per file. |
| Storage full | `write()` throws "This browser ran out of local storage space…". |

Other browser keys used by the app in both modes: `dk.learner.guest` (learner progress), `dk.colorMode`, `dk.preview.content`,
`dk.promo.*` (dismissed offers).

---

## 5. Adding a new data operation (guidance)

1. Add the method to `DataStore` in `src/data/types.ts`.
2. Implement it in **both** `supabaseStore.ts` and `localStore.ts`.
3. If it needs new tables/policies, write an idempotent `supabase/migrations/00N_*.sql`, append it to `schema.sql`, and run it in
   the Supabase SQL editor (see `docs/DATABASE.md` §7.1). Authorisation must be expressed as RLS or a `security definer`
   function that checks `is_admin()`; there is no server to put checks in.
