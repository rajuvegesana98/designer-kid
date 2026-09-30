# User flows

The flows below are the ones that actually exist in the code today, for learners (anonymous visitors, no
accounts) and for the admin. Each flow is a `text` diagram followed by the files that implement it and any
production caveats. Flows that depend on pending database migrations or missing configuration are marked. Routes
are relative to the site base (`/designer-kid/` on GitHub Pages; `BrowserRouter basename` in `src/App.tsx`).

Last verified: 30 Sep 2026 (docs v2.0)

Status legend: **Works** · **Works with caveat** · **Broken on production** (reason given) ·
**Deprecated** (code present, not reachable from the UI).

---

## 1. First-time visitor → dashboard — Works

```text
Visitor opens /
   │  ContentProvider loads site_content.published (Supabase), fills missing sections from the seed
   │  (withDefaults), removes unpublished items (studentView)
   ▼
Home (src/pages/Dashboard.tsx): no level in localStorage dk.learner.guest → <Landing/>
   │  PromoLayer may show an offer bar, or a pop-up after 1.2 s (see flow 10)
   │  CTA "Start learning" / hero "Find my starting point" (seed label) / a level card (/start?level=…)
   ▼
/start  Onboarding: "Where are you in your design journey?"
   │  pick Beginner / Intermediate / Expert (click or arrow keys) + optional name
   │  finish() → learner.setLevel() → events.insert('level_selected', <levelId>)  (anonymous)
   ▼
/  Home now finds a level → <AppShell><Dashboard/></AppShell>
   Welcome, Continue learning, progress, roadmap strip, up next, challenge, career, 1:1 panel, blog
```

Files: `src/pages/Landing.tsx`, `src/pages/Onboarding.tsx`, `src/pages/Dashboard.tsx`, `src/state/learner.tsx`.
`/welcome` always shows the landing page, even for returning learners.

## 2. Returning learner — Works (same browser only)

```text
Opens /  ──► localStorage dk.learner.guest has a level ──► Dashboard
                │
                ├─ "Continue learning" → lastLesson, or nextLesson(level, state)
                ├─ streak from activeDays, achievements from achievementUnlocked()
                └─ Different device or cleared browser data?
                      → no progress (starts as a first-time visitor)
                      → fix: Profile → Restore from backup (flow 12)
```

## 3. Lesson learning loop — Works

```text
/lesson/:lessonId  (LessonPage)
   │  visitLesson() → lastLesson + today's date added to activeDays
   │  Cover → 1·Learn → 2·Example → 3·Practice (steps checklist) → 4·Challenge (success criteria)
   │  optional: bookmark ☆, private note, quiz, widget, Download PDF (flow 11)
   ▼
"Mark as complete"
   │  completeLesson() → completedLessons[id] = now → events.insert('lesson_completed', <title>)
   │  toast "Lesson complete" or "Module complete: <module>"
   ▼
"Next lesson: <title>" → /lesson/<next id in level order>   (end of level → back to roadmap/dashboard)
```

`module_completed` exists as an event type but is **never tracked** (no call site; Confirmed by grep).

## 4. Search — Works

```text
Anywhere inside AppShell:
   ⌘K / Ctrl+K  (toggle)   or   "/" (when focus is not in an input)   or   search button
   ▼
SearchPalette: type → buildIndex(content) → lessons, modules, challenges, resources, career guides, articles
   ▼  Enter / click
navigate(result)  (external resources open in a new tab)

/search?q=…&level=…&cat=…  → full-page search with level + category filters
```

Files: `src/components/Search.tsx`, `src/components/AppShell.tsx` lines 99–105, `SearchPage` in
`src/pages/Account.tsx`.

## 5. Discovery — Works (Blog menu item missing on production)

```text
AppShell nav (content.navigation, visible items only)
  ├─ Learn      /learn → redirect /learn/<your level> → roadmap (courses → modules)
  │               └─ /learn/:level/:module → lessons list, "Download module PDF"
  ├─ Challenges /challenges (flow 6)
  ├─ Career     /career (flow 7)
  ├─ Resources  /resources → filter by level/type → external link
  ├─ My Progress /progress → overview, 12-week activity, modules, achievements, bookmarks, notes
  ├─ Blog       /blog → featured + tag/search → /blog/:slug → Share / PDF
  │               ⚠ production: no Blog item in the published menu until migration 003 runs or the admin
  │                 adds it and publishes; still reachable via landing "Latest from the blog",
  │                 dashboard "From the blog", or the URL
  └─ Reviews    /reviews (flow 8)
Always shown (not from navigation): 1:1 Connect (only when a booking URL exists), Profile
```

## 6. Challenge — Works (work saved in the browser only)

```text
/challenges → filter level/category/status → /challenges/:id
   │  read brief, context, requirements, constraints, expected outcome
   │  work: paste a link (must be http/https) and/or notes → saveChallengeWork() (browser)
   │  self-review checklist ticks → saved in challengeWork[id].checks
   ▼
"Submit challenge"
   ├─ unticked checklist items? → confirm "Submit before finishing your review?" → Submit anyway
   ▼
completeChallenge():
   ├─ anonymous (always, for learners): events.insert('challenge_submitted', <title>)
   │                                   + completedChallenges[id], submittedAt (browser)
   └─ signed-in user in Supabase mode (in practice only an admin): submissions.insert(...)  [Deprecated path]
   ▼
"Submitted on <date>" — can update the link/notes and resubmit
```

The admin **cannot see learners' challenge work**: only an anonymous count in Dashboard/Analytics.

## 7. Career Centre tools — Works

```text
/career → section cards with checklist progress
   ▼
/career/:section  (resume | linkedin | portfolio | job-search | interviews | networking)
   │  guides for your level (slide-style blocks, Q&A), checklist ticks → careerChecks (browser)
   │  per guide: bookmark, PDF (/print/guide/:id)
   ├─ Resume: bullet builder (verb + what + result) → copy to clipboard
   ├─ LinkedIn: headline builder → copy
   ├─ Portfolio: case-study template (Problem → Research → … ) → copy
   └─ Interviews: Q&A (44 questions across 3 levels)
unknown :section → redirect /career
```

## 8. Reviews — Broken on production for anonymous visitors (until migration 003)

```text
/reviews (or the landing Reviews section)
   │  listReviews() → approved only (RLS "reviews: public reads approved"), featured first
   ▼
"Write a review": stars, name, role (optional), text ≥ 20 characters, consent box
   ▼
store.submitReview(review, user=null, autoApprove = !requireApproval)
   │  Supabase: reviews.insert({user_id: null, …})
   │     ├─ BEFORE INSERT trigger review_defaults(): status = 'pending' if published
   │     │   reviews.requireApproval is true or missing; featured=false; reply=null
   │     └─ RLS INSERT policy:
   │          • production now: "signed-in users write own" (auth.uid() is not null) → ✗ REJECTED
   │          • after 003:      "anyone submits" (user_id null or own, not blocked)  → ✓
   ▼
UI "Thank you… it will appear once approved"   (or an error message when rejected)
   ▼
Admin → Reviews → Pending → Approve (immediate, no Publish) → optional Feature / Reply
   ▼
Visible on /reviews and, if "Show on homepage" is on, on the landing page
```

Browser-only mode: reviews are stored in `dk.reviews` in that browser, so moderation works only there.

## 9. 1:1 Connect — Works with caveat (no booking URL configured)

```text
MentorSection (landing #mentor, dashboard, reviews page) — shown when mentor.enabled
   │
   ├─ bookingUrl is http(s)://…  → mentor.ctaLabel ("Request a 1:1 session" in seed) <a target=_blank>
   │        └─ click → events.insert('booking_clicked')  → external tool (Calendly/Cal.com/Topmate…)
   ├─ no URL, footer email set   → mailto:<footer email>?subject=1:1 session request
   └─ no URL, no footer email    → badge "Booking opens soon"      ◄── production today (seed values)
Sidebar / bottom-nav "1:1 Connect" links render only when a valid booking URL exists.
```

Note: Admin Dashboard says "Students won't see 'Connect 1:1' until you add it". That is true for the nav
links, but the MentorSection panel still shows (with the fallback). Inferred wording inconsistency.

## 10. Offers (banner / pop-up) — Works (no offer enabled in seed)

```text
PromoLayer on every route except /admin, /print, /account
   │  active = enabled ∧ within startsAt..endsAt ∧ page rule (all | home) ∧ audience
   │           (new = no level chosen, returning = level chosen) ∧ not dismissed (dk.promo.<id>.v<version>)
   ├─ first active "bar" → slim strip at the top → CTA (internal Link or external tab) / ✕ dismiss
   └─ first active "popup" → Modal after 1.2 s → CTA / "No thanks" / close
         dismissible=true  → remembered in localStorage (until the admin edits the offer → version bump)
         dismissible=false → hidden for this page session only
Preview mode (?preview=1) ignores dismissals.
```

## 11. PDF download — Works (browser print dialog)

```text
Lesson "Download PDF" → /print/lesson/:id
Module "Download module PDF" → /print/module/:level/:module
Career guide "PDF" → /print/guide/:id        Blog "PDF" → /print/blog/:id
   ▼
Print page renders print-optimised blocks (PrintMode) → waits for fonts → window.print() after 350 ms
   ▼
User picks "Save as PDF" in the browser dialog
(`?auto=0` suppresses auto-print; "Download PDF" button re-opens the dialog)
Unknown id → "Lesson / Module / Guide / Article not found"
```

## 12. Progress backup / restore — Works

```text
/profile → "Download my progress" → designer-kid-progress-YYYY-MM-DD.json  {app, version:1, state}
/profile → "Restore from backup" → choose file
   ├─ app !== 'designer-kid' or missing state.completedLessons → toast error
   └─ valid → importState() → mergeLearner(file, current) → toast "Progress restored and merged"
```

## 13. Switching level — Works

```text
Dashboard or Profile → "Switch level" → LevelSwitcher sheet → choose level
   → learner.setLevel() → events.insert('level_selected')  (counts as a new "start" in admin analytics)
   → dashboard/roadmap re-render for the new level; completed lessons are kept (keyed by lesson id)
```

## 14. Admin sign-in — Works

```text
/admin → AdminApp
   ├─ auth not ready → loader
   ├─ Supabase mode, no session → AdminLogin: email + password (show/hide) → signIn()
   │        ├─ wrong credentials → Supabase error shown
   │        ├─ profile.blocked → signed out + "This account has been suspended…" (needs migration 002)
   │        └─ ok → toAppUser(): rpc('is_admin') + profiles row
   ├─ Browser-only mode → "Open admin for this browser" (demo admin, localStorage dk.demoAdmin)
   ├─ signed in but not in public.admins → "This account isn't an admin" + SQL snippet + reload
   └─ admin → AdminProvider loads published + draft (withDefaults) → AdminLayout (sidebar, PublishBar)
```

## 15. Admin forgot / reset password — Works with caveat (Supabase Auth URL/SMTP config Unknown)

```text
AdminLogin "Forgot password?" → /account?forgot=1 (AccountPage, forgot form)
   │  email → requestPasswordReset(email)
   │      → supabase.auth.resetPasswordForEmail(email, { redirectTo: <origin><base>reset-password })
   │  UI: "If an account exists… a reset link is on its way" (same message whether or not it exists)
   ▼
Email (Supabase built-in sender ≈ 2 emails/hour unless custom SMTP) → link with #…type=recovery
   ▼
App loads → AuthProvider: recovering = true (hash) / PASSWORD_RECOVERY event
   → RecoveryRedirect sends any route to /reset-password
   ▼
/reset-password: "Checking your reset link…" (waits up to 2.5 s for the session)
   ├─ session present → new password ×2 (≥ 8 chars) → updatePassword() → toast → navigate('/')
   └─ no session after 2.5 s → "This reset link has expired or was already used" → /account
```

The redirect URL must be allowed in Supabase → Authentication → URL Configuration (**Unknown** whether set).
Implicit flow (`flowType: 'implicit'`, `src/data/supabaseStore.ts` line 33) lets the link work on another device.

## 16. Admin change password — Works (Supabase mode)

```text
/admin/settings → "Your admin account"
   ├─ New password + confirm (≥ 8, must match) → updatePassword() → toast "Password updated"
   └─ "Email me a reset link" → requestPasswordReset(<signed-in email>) → flow 15 from the email step
```

## 17. Admin edit → preview → publish — Works

```text
Any content page (Courses, Blog, Challenges, Library, Levels, Website, Theme, Offers, 1:1, Review settings)
   │  edit → useAdmin().update(recipe): structuredClone(draft) → recipe mutates → setDraft
   │     ├─ 250 ms → localStorage dk.preview.content = draft      (live preview feed)
   │     └─ 1200 ms → store.saveDraft(draft) → site_content.upsert({id:'draft'})  ("Draft saved …")
   │  top bar: "N unpublished" (diffSections: JSON compare of 16 top-level sections)
   ▼
Preview → window.open(<path>?preview=1, 'dk-preview') → same-browser tab shows the draft and updates live
   ▼
Publish → dialog: changed sections, major-change warning (levels/theme/navigation), optional note
   │  → rpc('publish_content', {content: draft, note})   (security definer; admin only)
   │       published := draft; draft := draft; content_history += version; events += content_published
   │  → reload() → students see the change on their next page load
   └─ "Discard draft" → confirm → draft := published copy
Leaving with unsaved edits → browser "unsaved changes" prompt (beforeunload)
```

## 18. Version restore — Works

```text
/admin/publishing → Version history (latest 30; first = "Live")
   → Restore → confirm → loadVersion(id) → replaceDraft(version) → toast
   → Preview → Publish (nothing changes for students until Publish)
Backup: "Download draft as JSON" / "Import JSON" (schemaVersion 1 check + section diff) → draft
```

## 19. Error and edge cases

| Case | What happens | Where |
|---|---|---|
| Lesson not found | "Lesson not found" + "Back to Learn". Also for unpublished lessons, because `studentView` removes them | `src/pages/Lesson.tsx` line 98 |
| Challenge / article / level / module not found | Specific empty state with a link back | `Challenges.tsx` 144, `Blog.tsx` 98, `Learn.tsx` 208 |
| Unknown route | `NotFound` "Page not found" + Go home | `src/pages/Account.tsx` line 410 |
| Deep link on GitHub Pages | HTTP 404 status, but `404.html` (a copy of `index.html`) boots the SPA | `scripts/postbuild.mjs` |
| Supabase unreachable / error | `console.error`, then the bundled seed is shown (the site stays usable, with no admin edits) | `src/state/content.tsx` lines 61–66 |
| Supabase project paused (free tier, ~1 week idle) | Inferred: requests fail or time out → seed fallback until the project is woken | Hand-off facts + above |
| Nothing ever published | Seed shown. Admin publish bar shows "Initial publish of starter content" | `src/admin/state.tsx` line 135 |
| Suspended account signs in | Signed straight out + "This account has been suspended…" (**needs migration 002**) | `src/state/auth.tsx` |
| Expired / used reset link | After 2.5 s: "This reset link has expired or was already used" → Request a new link | `ResetPasswordPage` |
| Browser storage full (learner) | Progress keeps working in memory for this session, but is not saved | `writeGuest()` in `src/state/learner.tsx` |
| Browser storage full (browser-only admin) | "This browser ran out of local storage space…" error. Publish keeps as many of the 5 versions as fit. Media is limited to 1.5 MB per file | `src/data/localStore.ts` |
| Admin draft save fails | Top bar "Draft not saved" + Retry | `AdminApp.tsx` `PublishBar` |
| Review rejected by the database | Error text under the form (production today, until 003) | `src/pages/Reviews.tsx` |
| Analytics event insert fails | Silently ignored (`.catch(() => {})`) | `learner.tsx`, `MentorLink.tsx` |
| Reviews switched off | "Reviews are switched off" | `src/pages/Reviews.tsx` line 182 |

## 20. Deprecated flows (code present, not reachable)

```text
Learner sign-up:   AccountPage has tab = 'signin' hard-coded → the 'signup' branch never renders
                   (auth.signUp → supabase.auth.signUp → handle_new_user → profiles row + 'signup' event)
Account sync:      signed-in user → loadLearner/saveLearner (profiles.state), merged with the browser state
Submissions:       signed-in user → submissions table → Admin → Users → Challenge submissions tab
```
