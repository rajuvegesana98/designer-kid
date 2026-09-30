# Future roadmap (recommendations)

> **Everything in this document is a recommendation. None of it exists in the product today.** For what
> exists, see [FEATURES.md](FEATURES.md). For the problems these phases address, see
> [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md).

This roadmap proposes six phases, from stabilising the current live site to advanced features. Each phase is
grounded in the current architecture: a static React SPA on GitHub Pages; one `SiteContent` JSON document in
Supabase with a draft/publish RPC; anonymous learners whose progress is in browser localStorage; admin-only
Supabase Auth. Each item names the gap it addresses and the code it would touch. Phases are ordered by risk and
dependency. Effort estimates are rough and **Inferred** (for one developer familiar with React + Supabase).

Last verified: 30 Sep 2026 (docs v2.0)

Status legend: every item below is **Planned (recommendation)**.

```text
Phase 1 Stabilise ──► Phase 2 Quality & CI ──► Phase 3 Content platform ──► Phase 4 Learner value
                                                          │
                                                          └──► Phase 5 Growth & business ──► Phase 6 Advanced
```

---

## Phase 1 — Stabilisation (days; mostly configuration, no code)

Goal: every feature that is already built works in production.

| # | Action | Addresses | Touches |
|---|---|---|---|
| 1.1 | Run `002_user_management.sql`, then `003_open_learning.sql` in the Supabase SQL editor. Verify with REST (`profiles?select=blocked` → 200), an anonymous test review, and the Blog item in the menu | Broken anonymous reviews, suspend/admin management, missing Blog menu | Supabase only |
| 1.2 | Configure Supabase Auth Site URL + Redirect URLs. Add custom SMTP. Test admin forgot-password end to end | Admin lock-out risk (Unknown config) | Supabase dashboard |
| 1.3 | Disable public sign-ups in Supabase Auth | Stray accounts / MAU | Supabase dashboard |
| 1.4 | Admin: set the 1:1 booking URL + photo, logo/favicon, footer email/social. Then **Publish once** (this also writes the `blog`, `promos` and `reviews` sections into the published document, so learners stop loading the seed chunk) | "Booking opens soon", seed chunk on every visit | Admin UI |
| 1.5 | Create a second admin account (owner backup) | Single point of failure | Supabase + Users page (after 1.1) |
| 1.6 | Uptime check (hits the site + a Supabase REST read daily), or Supabase Pro | Free-plan pause after ~1 week idle | External monitor |
| 1.7 | Fix misleading copy (sign-up hints, "won't see 1:1" message, empty states) | Debt #21 | `Settings.tsx`, `admin/pages/Dashboard.tsx`, `Users.tsx` |

Exit criteria: a learner can submit a review and the admin sees it in Pending; a password-reset email arrives
and works; the 1:1 button opens the booking tool; the Blog is in the live menu.

## Phase 2 — Quality, safety and CI (1–2 weeks)

Goal: changes can ship without breaking live users.

| # | Action | Addresses |
|---|---|---|
| 2.1 | CI `test` job: Playwright with bundled Chromium running `tools/e2e/e2e*.mjs` against a browser-only dev server. Block deploy on failure | Debt #8 |
| 2.2 | Vitest unit tests for `lib/progress.ts`, `lib/content.ts` (`studentView`), `promoIsActive`, `diffSections`, `withDefaults`, `mergeLearner` | Debt #16 |
| 2.3 | `DataStore` contract tests against both stores, plus a local Supabase (`supabase start`) in CI to test RLS, triggers and migrations | Debt #12, the class of bug in Phase 1.1 |
| 2.4 | Adopt the Supabase CLI migrations workflow (`supabase/migrations/*` + `db push`), with a migrations table so drift is detectable | Debt #1 |
| 2.5 | Fix the 70 oxlint warnings, then run lint with `--deny-warnings` in CI | Debt #15 |
| 2.6 | Content schema migrations: `schemaVersion` step functions applied on load and before publish (replacing top-level-only `withDefaults`) | Debt #11 |
| 2.7 | Optimistic concurrency on draft save (revision check → "someone else edited, reload?") | Debt #9 (conflicts) |
| 2.8 | Error monitoring (e.g. Sentry) + surface "showing offline content" to admins | Debt #25 |
| 2.9 | Remove or feature-flag dormant learner-account code | Debt #4 |

## Phase 3 — Content platform and admin productivity (2–4 weeks)

Goal: the admin scales past one editor and a few hundred lessons.

| # | Action | Notes |
|---|---|---|
| 3.1 | Split the single `SiteContent` row into per-section rows (settings, each level, blog, library), keeping draft/published pairs and a publish RPC that swaps them atomically | Debt #9. Learners then load less data. Edits write less data |
| 3.2 | Serve the published content as a static, cacheable JSON (written to Storage on publish) | Faster first load, less DB egress |
| 3.3 | Structural sharing (Immer) in `useAdmin().update` + reference-based diff | Debt #10 |
| 3.4 | Shareable server-side preview for admins (read `site_content` draft instead of localStorage) | Debt #18 |
| 3.5 | Per-item revision history and "restore this lesson only" | Today only whole-site restore exists |
| 3.6 | Scheduled publishing (publish at a time; scheduled blog posts) | Needs `pg_cron` or an Edge Function |
| 3.7 | Achievements editor. Media metadata (alt text, rename, move). Resize in `MediaPicker` | Debt #17, #22 |
| 3.8 | History retention (`content_history` pruning) and `events` retention/roll-ups | Debt #7, #13 |
| 3.9 | Admin roles (editor vs owner) through an `admins.role` column + RLS | Only one role exists |

## Phase 4 — Learner value without mandatory accounts (3–6 weeks)

Goal: keep "no account needed" (an owner decision) while fixing its biggest gaps.

| # | Action | Notes |
|---|---|---|
| 4.1 | **Optional cross-device sync** without passwords: a sync code or magic link that stores the `LearnerState` blob under a random key (anonymous table with row-level secret) | `docs/NEXT_STEPS.md` idea. Reuses `mergeLearner` and backup/restore |
| 4.2 | Level completion **certificates** (print view like `/print/*`, shareable on LinkedIn) | `docs/NEXT_STEPS.md` |
| 4.3 | Challenge feedback path: optional "send my submission to the mentor" (email + link) that does not require an account | Replaces the deprecated `submissions` path |
| 4.4 | More widgets (colour-blindness simulator, tap-target checker) and more illustrated examples | `docs/NEXT_STEPS.md`; `components/widgets.tsx` |
| 4.5 | Offline-friendly PWA (cache the published content and lessons) | Static SPA suits this |
| 4.6 | Accessibility audit (external or axe-core in CI) | No formal audit on record |

## Phase 5 — Growth and business (ongoing)

| # | Action | Notes |
|---|---|---|
| 5.1 | Custom domain on GitHub Pages (update `BASE_PATH`, Supabase Auth URLs) | `docs/NEXT_STEPS.md` |
| 5.2 | SEO: prerender blog/lesson routes, per-page meta/Open Graph, `sitemap.xml`; or move to a host with SPA rewrites | Debt #23 |
| 5.3 | Privacy-friendly analytics with unique visitors, funnels from events, offer click-through; SQL aggregation views | Debt #6 |
| 5.4 | Owner notifications: new review / booking click → email (Supabase database webhook → email service) | `docs/NEXT_STEPS.md` |
| 5.5 | Paid 1:1 or packages through the booking tool's payments (Calendly/Cal.com/Topmate), linked from offers | Keeps the "external link" architecture |
| 5.6 | Anti-spam for reviews (hCaptcha / honeypot, rate limits) | Debt #7 |
| 5.7 | i18n if targeting non-English markets | Debt #20 |

## Phase 6 — Advanced features (exploratory)

| # | Idea | Architectural notes |
|---|---|---|
| 6.1 | PPT/PDF → editable slides import | Needs a server-side conversion service (not possible on static hosting alone) |
| 6.2 | AI-assisted feedback on challenge submissions or portfolio text | There is **no AI integration today**. It would need a server-side proxy (Supabase Edge Function) so no API key reaches the browser, plus moderation and cost controls |
| 6.3 | AI-assisted authoring in the admin slide editor (draft a lesson from an outline) | Same Edge Function pattern. Keep human review and the honest-content rule |
| 6.4 | Cohorts / community (discussion per lesson) | Would reintroduce accounts. Revisit the owner's no-accounts decision first |
| 6.5 | Learning paths across levels / custom tracks | Extend the `Level` model or add a `paths[]` section |
| 6.6 | Motion Studio-driven animation tuning | Dev-only. Would need a subscription and `@anthropic-ai/claude-agent-sdk` for agent edits (per `docs/OPERATIONS.md`) |

---

## Dependencies between phases

- Phase 2.3/2.4 should come before any new schema work in Phases 3–6.
- Phase 3.1 (content split) is a prerequisite for per-item history (3.5) and scheduling (3.6) at scale.
- Anything that adds accounts (4.1 variants, 6.4) must be agreed with the owner, because "learners have no
  accounts" is a product rule in `AGENTS.md`.
