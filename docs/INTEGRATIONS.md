# Integrations — Designer Kid

This page lists every external service the Designer Kid code actually talks to or embeds, why it is used, where it is wired
in, what credentials it needs, what data flows to it, and what happens when it fails. The product is a static React SPA on
GitHub Pages backed by Supabase; everything else is a browser-side embed or link. There is **no** payment, analytics SaaS,
email-sending code, AI API, maps or third-party CDN in the application code.

Last verified: 30 Sep 2026 (docs v2.0)

**Status legend.** **Confirmed** = seen in code/config or verified at hand-off · **Inferred** = reasoned from code ·
**Unknown** = not verifiable from the repository (what to check is stated) · **Not configured** = code exists but no value is
set · **Dev-only** = never shipped to production.

---

## 1. Summary

| Service | Purpose | Status |
|---|---|---|
| Supabase Auth | Admin sign-in, password reset | **Active** (Confirmed) |
| Supabase Postgres via PostgREST + RPC | Content, reviews, events, profiles | **Active**; migrations 002/003 pending |
| Supabase Storage | Uploaded images, PDFs, slides | **Active** |
| GitHub (repo, Actions, Pages) | Source, CI build, static hosting | **Active** |
| Google Fonts | Web fonts | **Active** |
| Microsoft Office Online viewer | In-page preview of PowerPoint files | **Active when an admin uses a slides "embed" file block** |
| YouTube (nocookie) / Vimeo player | Video blocks | **Active when content contains video blocks** |
| External booking tool (Calendly, Cal.com, Topmate…) | 1:1 sessions | **Not configured** (no booking URL yet) |
| `mailto:` fallback | 1:1 request by email | **Not configured** (seed footer email is empty) — Inferred inactive |
| Motion Studio (motion.dev) | Animation tooling | **Dev-only** |

---

## 2. Supabase

| Aspect | Details |
|---|---|
| Why | Only backend: authentication, database, file storage, one RPC. Replaces a custom server. |
| Where | `src/data/index.ts` (selects store), `src/data/supabaseStore.ts` (all calls), `supabase/schema.sql` + `supabase/migrations/*.sql` (schema/policies), `src/state/auth.tsx` |
| SDK | `@supabase/supabase-js` `^2.117.2` (`package.json`) |
| Project | `zcxnlelzhkwbvittgcuj` → `https://zcxnlelzhkwbvittgcuj.supabase.co` (verified at hand-off). Older project `ywbiyutmrwmjnbllyzxd` is no longer used. |
| Credentials | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (the **publishable** key, browser-safe). Local: `.env.local` (git-ignored via `*.local`); CI: GitHub Actions repository **variables** of the same names. Template: `.env.example`. The secret/service-role key and database password are **not** used by the app and must never be added. |
| Endpoints (Inferred-from-supabase-js-conventions) | `/rest/v1/<table>` (profiles, site_content, content_history, events, submissions, reviews, admins), `/rest/v1/rpc/is_admin`, `/rest/v1/rpc/publish_content`, `/storage/v1/object/…` (bucket `media`), `/storage/v1/object/public/media/…`, `/auth/v1/signup`, `/auth/v1/token`, `/auth/v1/logout`, `/auth/v1/recover`, `/auth/v1/user`. Full table in `docs/API.md`. |
| Auth settings used by code | `flowType: 'implicit'`, `persistSession: true`, `detectSessionInUrl: true`; reset links redirect to `<site>/reset-password`; sign-up redirect to `<site>/` |
| Data sent | Admin: email/password, full site JSON (draft/publish), uploaded files, moderation actions. Visitors (anon): `events` rows (event type, short detail e.g. lesson title, `user_name 'Guest'`), reviews (name, optional role, rating, text) — reviews need migration 003. **No learner progress** is sent for anonymous learners. |
| Data received | Published `SiteContent` JSON, approved reviews, public media files; admins additionally draft, history, events, profiles, submissions. |
| Failure behaviour | Content load failure → bundled seed content is shown (`src/state/content.tsx` lines 61–66) and a console warning. `track` failures are ignored. Other failures surface as toast messages with the Supabase error text. If the build variables are missing, the app silently runs in **browser-only mode** (`src/data/index.ts`). Free-plan projects are **paused after 1 week of inactivity** (confirmed from supabase.com at hand-off) → site falls back to seed content, admin cannot sign in until the project is resumed in the dashboard. |
| Limits | Free plan: 50k MAU, 500 MB DB, 1 GB storage, 5 GB egress; built-in auth email ≈ 2 emails/hour (confirmed at hand-off). |
| Setup | Create project → SQL Editor: run `supabase/schema.sql` → sign in once → insert your user into `public.admins` → set the two env vars (local + GitHub variables) → push to `main`. See `docs/OPERATIONS.md`. |
| Unknown | Auth URL configuration (Site URL / redirect allow-list), whether email sign-ups are disabled, custom SMTP, password policy, bucket file-size/MIME limits, backup settings — check in the Supabase dashboard. |

---

## 3. GitHub (repository, Actions, Pages)

| Aspect | Details |
|---|---|
| Why | Source control, CI build, free static hosting |
| Repo | `github.com/rajuvegesana98/designer-kid` (public; `git remote -v`) |
| Site | `https://rajuvegesana98.github.io/designer-kid/` (no custom domain; verified at hand-off) |
| Workflow | `.github/workflows/deploy.yml` — on push to `main` and manual `workflow_dispatch` |
| Official actions used | `actions/checkout@v4`, `actions/setup-node@v4` (Node 22, npm cache), `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4` — all first-party GitHub actions, pinned to major-version tags (not commit SHAs) |
| Workflow permissions | `contents: read`, `pages: write`, `id-token: write`; `concurrency: pages` (cancel in progress); deploy job uses environment `github-pages` |
| Credentials | Repository **variables** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (not secrets — they end up in the public JS bundle anyway). No GitHub secrets are referenced. `BASE_PATH` comes from `configure-pages` output. |
| Build | `npm ci` → `npm run build` = `tsc -b && vite build && node scripts/postbuild.mjs` (postbuild fails the build if Motion Studio code leaked, and copies `index.html` → `404.html` for SPA deep links) |
| Failure behaviour | Failed build → previous deployment stays live. |
| Status | Active; recent runs succeeded (verified at hand-off). |

---

## 4. Google Fonts

| Aspect | Details |
|---|---|
| Why | Brand typography (default Bricolage Grotesque + Instrument Sans; admin can pick others) |
| Where | `index.html` lines 11–13: `preconnect` to `fonts.googleapis.com` / `fonts.gstatic.com` and a stylesheet for the two default families. `src/lib/theme.ts` `ensureFonts()` (lines 93–102) appends `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=…:wght@400;500;600;700;800&display=swap">` for any theme font not yet loaded; called from `ThemeProvider` (`src/state/ui.tsx` line 52). Selectable fonts: `FONT_OPTIONS` (14 families). |
| Endpoints | `https://fonts.googleapis.com/css2`, font files from `https://fonts.gstatic.com` |
| Credentials | None |
| Data sent | Standard HTTP request data (visitor IP, user agent, referrer per browser policy) to Google. **Inferred** privacy note: may be relevant for GDPR-style notices; self-hosting fonts would remove it. |
| Failure behaviour | `display=swap` + CSS fallback `system-ui, sans-serif` → text still renders. |
| Status | Active |

---

## 5. Microsoft Office Online viewer

| Aspect | Details |
|---|---|
| Why | Preview uploaded PowerPoint/Keynote/ODP decks inside a lesson |
| Where | `src/components/Blocks.tsx` lines 43–65 (`FileBlock`) |
| Endpoint | `https://view.officeapps.live.com/op/embed.aspx?src=<encodeURIComponent(file URL)>` in an `<iframe>` |
| When | Block `type: 'file'`, `display: 'embed'`, file detected as slides (`isSlides`) **and** its URL is public `http(s)` (i.e. Supabase Storage, not a browser-only data URL). PDFs are embedded directly (`<iframe src={file.url}>`), not via Microsoft. |
| Credentials | None |
| Data sent | The public file URL; Microsoft's servers fetch the file from Supabase Storage. The file must therefore be publicly reachable (bucket `media` is public). |
| Failure behaviour | Iframe shows Microsoft's error; the download card (`FileCard`) is always shown underneath. |
| Status | Active when content uses it. **Unknown** whether any published lesson currently has a slides embed. |

---

## 6. YouTube (privacy-enhanced) and Vimeo embeds

| Aspect | Details |
|---|---|
| Why | Video lesson blocks |
| Where | `src/components/Blocks.tsx` lines 258–269 and `toEmbed()` lines 284–290 |
| Endpoints | `https://www.youtube-nocookie.com/embed/<id>` for `youtube.com/watch?v=` or `youtu.be/` URLs; `https://player.vimeo.com/video/<id>` for `vimeo.com/<digits>` URLs |
| Iframe attributes | `loading="lazy"`, `allow="accelerometer; encrypted-media; picture-in-picture"`, `allowFullScreen`; no `sandbox` |
| Other URLs | Rendered as an external "Watch: …" link (`target=_blank rel=noreferrer`) |
| Credentials | None |
| Data sent | Normal embed traffic to Google/Vimeo when the lesson is viewed |
| Failure behaviour | Provider error inside the iframe; page unaffected |
| Status | Active when content contains video blocks (**Unknown** how many published lessons do) |

---

## 7. External booking tool (1:1 sessions)

| Aspect | Details |
|---|---|
| Why | Owner decision: 1:1 mentoring is booked in an external tool (Calendly, Cal.com, Topmate…) rather than built in |
| Where | `src/components/MentorLink.tsx`; admin field in `src/admin/pages/Connect.tsx` (placeholder `https://calendly.com/your-name/30min`); data in `SiteContent.mentor.bookingUrl` |
| Rule | Link is shown only when `mentor.enabled` and `bookingUrl` matches `^https?://`; opens in a new tab; logs a `booking_clicked` event |
| Credentials | None (plain link) |
| Data sent | None from the app; the visitor leaves for the booking site |
| Status | **Not configured** — seed `bookingUrl: ''` (`src/content/seed/index.ts` line 142); at hand-off `MentorSection` shows "Booking opens soon" |
| Fallback | If no booking URL but `footer.email` is set → `mailto:<email>?subject=1:1 session request` button. Seed `footer.email` is `''` (line 135) — **Inferred** not set in production because the "Booking opens soon" badge is shown. |

---

## 8. Motion Studio (motion.dev) — development only

| Aspect | Details |
|---|---|
| Why | Visual animation inspection/editing during development |
| Where | `vite.config.ts` (plugin added only for `vite serve` and when `MOTION_STUDIO !== 'off'`; excludes `/admin` paths); dev dependency `motion-studio ^2.1.0`; `.env.example` has `MOTION_STUDIO_AGENT_PROVIDER` |
| Production | Excluded; `scripts/postbuild.mjs` fails the build if any `motion-studio`/`motionStudio`/`__MOTION_STUDIO` string appears in `dist` |
| Credentials | None in repo. **Unknown** whether the tool calls external services in dev (depends on the agent provider setting) |
| Status | Dev-only; verified working in dev at hand-off (timing-edit preview not verified) |

The runtime animation library `motion` (`^13.4.6`) is a bundled npm package, not an external service.

---

## 9. Things that look like integrations but are not

| Item | Why it is not an integration |
|---|---|
| External resource links in content (e.g. nngroup.com, webaim.org, help.figma.com, material.io, lawsofux.com, adplist.org in `src/content/seed/*`) | Plain `<a target="_blank" rel="noreferrer">` links; no API, no data exchange |
| Footer/social links, promo CTA URLs | Admin-authored plain links |
| Learner progress backup/restore | Local JSON file download/upload in the browser |
| Lucide icons, React, React Router | Bundled npm packages |

---

## 10. Services NOT present (Confirmed by searching `src/`, `index.html`, `package.json`)

| Category | Finding |
|---|---|
| Payments (Stripe, Razorpay, PayPal…) | None |
| Analytics SaaS (Google Analytics, Plausible, PostHog, Mixpanel…) | None — analytics are the app's own `events` table |
| Error monitoring (Sentry etc.) | None |
| Email sending / SMTP config in code | None. Only Supabase Auth's built-in emails (sign-up confirm, password reset). Custom SMTP (e.g. Resend) is **Unknown** / suggested in `docs/OPERATIONS.md` |
| AI/LLM APIs | None in the app (Motion Studio's dev-only agent setting aside) |
| Maps | None |
| CDN beyond GitHub Pages | None (Google Fonts aside); Supabase Storage serves media |
| Server/edge functions | None |
| Captcha / bot protection | None |
