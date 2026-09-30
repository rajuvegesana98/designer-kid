# Designer Kid — SEO & Accessibility

This document records the current search-engine and accessibility state of Designer Kid as verified from `index.html`, `public/`, `scripts/postbuild.mjs`, `src/state/ui.tsx`, `src/pages/*`, `src/components/*`, `src/admin/*` and `src/styles/global.css`, plus four read-only HTTP status checks against the live GitHub Pages site. The app is a client-side-rendered React SPA with almost no SEO infrastructure: one static title and description, no social/OG tags, no canonical, no robots.txt or sitemap, and every deep link is served with HTTP 404. Accessibility is considerably stronger (focus-visible styles, skip links, focus-trapped dialogs, ARIA tabs/radiogroups/combobox, reduced-motion support, 44px touch targets), with a list of specific gaps at the end of section 2.

**Status legend:** **Confirmed** = seen in code/config or measured · **Inferred** = reasoned from code (reason given) · **Unknown** = not verifiable here (says what to check) · **Deprecated/unused** · **Planned** = not built.

Last verified: 30 Sep 2026 (docs v2.0)

---

## 1. SEO

### 1.1 Current state

| Item | State | Evidence |
|---|---|---|
| `<html lang>` | `en` | `index.html` — Confirmed |
| Static `<title>` | `Designer Kid — Learn. Design. Build. Grow.` | `index.html` — Confirmed |
| Runtime title | `document.title = "${brand.name} — ${brand.tagline}"` whenever `content.brand` changes | `src/state/ui.tsx` ThemeProvider — Confirmed |
| Per-page titles | **Only print pages**: `PrintShell` sets `"${title} — ${brand.name}"` | `src/pages/Print.tsx` — Confirmed. No lesson, module, blog post, guide or challenge page sets its own title |
| Meta description | One static description ("Designer Kid — learn UI/UX design, build real projects…") | `index.html` — Confirmed; never updated at runtime |
| `theme-color` | `#F5F4EF` (light) / `#0D0E13` (dark) via `media` | `index.html` — Confirmed; static, does not follow the admin theme |
| Favicon | `/favicon.svg` (Vite rewrites to base path; live HTML has `/designer-kid/favicon.svg`) | `public/favicon.svg`, live HTML — Confirmed. Replaced at runtime by `brand.faviconUrl` if set |
| Open Graph / Twitter tags | **None** | grep for `og:` / `twitter:` in `index.html`, `src`, `public` — Confirmed absent |
| Canonical link | **None** | Confirmed absent |
| `robots.txt` | **None** in `public/` (only `favicon.svg`); live URL returns **404** | Confirmed (curl) |
| `sitemap.xml` | **None**; live URL returns **404** | Confirmed (curl) |
| Structured data (JSON-LD) | **None** | grep `application/ld+json` — Confirmed absent |
| `noscript` | "Designer Kid needs JavaScript to run." | `index.html` |
| Rendering | Client-side only (Vite SPA, `BrowserRouter` with `basename` = `BASE_URL`) | `src/App.tsx` |
| Deep links | `scripts/postbuild.mjs` copies `index.html` → `404.html`; GitHub Pages serves it for unknown paths **with HTTP status 404** | Confirmed: `GET /designer-kid/learn` → 404, `GET /designer-kid/` → 200 (curl, 30 Sep 2026) |
| In-app 404 | `NotFound` component (`src/pages/Account.tsx`) — "Page not found" empty state inside the app shell, catch-all route `*` | Confirmed. Returns 404 status only because every deep link does |
| Admin/print/preview indexing controls | No `noindex` on `/admin`, `/print/*`, `?preview=1` | Confirmed absent |

### 1.2 SPA / CSR implications

- **Inferred:** crawlers that do not execute JavaScript see only the static title, description and an empty `<div id="root">`; all lesson, blog and career content (seed + Supabase `site_content`) is rendered client-side after the main JS (≈247 KB gzip) and the Supabase content fetch.
- **Inferred:** because deep links (e.g. `/blog/<slug>`, `/lesson/<id>`) return HTTP 404 from GitHub Pages, search engines are likely to treat them as missing pages even though the SPA renders them for users. Only the site root returns 200.
- **Inferred:** every page shares one title and description, so any indexed pages would appear as duplicates in results; social shares show no preview image or page-specific text.
- **Inferred (title quirk):** on a direct load of a `/print/...` URL, `PrintShell`'s effect runs before the parent `ThemeProvider`'s effect (React runs child effects first), so the brand title is likely to overwrite the print title; after client-side navigation away from a print page, the print title is not reset.

### 1.3 Missing SEO items (to build)

1. Per-route `document.title` and meta description (lesson, module, blog post, career guide, challenge, blog index).
2. Open Graph + Twitter card tags (at least a default `og:image`, `og:title`, `og:description`, `og:url`).
3. `<link rel="canonical">` pointing at `https://rajuvegesana98.github.io/designer-kid/…` (or a future custom domain).
4. `public/robots.txt` (allow public pages, disallow `/admin`, `/print/`, `/account`, `/reset-password`) and a `sitemap.xml` generated at build time from seed/published content.
5. JSON-LD: `Organization`/`WebSite` on the home page, `Article`/`BlogPosting` for blog posts, `Course` for levels (optional).
6. A route that returns HTTP 200 for deep links: either pre-rendering (static HTML per route at build time) or hosting that supports SPA rewrites. GitHub Pages cannot do rewrites.
7. `noindex` on admin, print and preview views.
8. Update `theme-color` at runtime from the published theme (currently static).

---

## 2. Accessibility

### 2.1 Structure and landmarks

| Item | Implementation | File |
|---|---|---|
| Skip link | "Skip to content" `.skip-link` (hidden above viewport, slides in on focus) → `#main` | `AppShell.tsx`, `Landing.tsx`; admin → `#admin-main` in `AdminApp.tsx` |
| `<main>` | `motion.main id="main" tabIndex={-1}` in AppShell; standalone `<main id="main">` on Landing, Onboarding, Account/Reset pages; `<main class="print-doc">` on print; `<main id="admin-main">` in admin | as listed |
| Navigation | `<aside class="sidebar" aria-label="Main">` containing `<nav aria-label="Primary">`; mobile `<nav class="bottomnav" aria-label="Primary">`; More sheet `<nav aria-label="More">`; footer `<nav aria-label="Footer">`; lesson `<nav aria-label="Breadcrumb">` and `<nav aria-label="Lesson sections">`; admin `aria-label="Admin navigation"` | `AppShell.tsx`, `Lesson.tsx`, `AdminApp.tsx` |
| Header/footer | `<header class="topbar">`, `<footer>` (`SiteFooter`) | `AppShell.tsx` |
| Headings | Each page renders one `h1` (via `PageHeader` or directly); lesson sections are `<section aria-labelledby>` with `h2`; block headings are `h3`/`h4`; dialogs title with `h2` | `src/pages/*`, `ui.tsx`, `Blocks.tsx` |
| Lesson | `<article aria-labelledby="lesson-title">`; step links use `aria-current` | `Lesson.tsx` |
| Language | `lang="en"` | `index.html` |

**Note (Inferred):** there are two `<nav aria-label="Primary">` in the DOM (sidebar and bottom nav); CSS hides one at each breakpoint (`display: none`), so assistive tech sees one at a time.

### 2.2 Focus

- Global `:focus-visible` outline: 2.5px solid `--c-focus` (primary), offset 2px (`global.css`).
- Inputs: `:focus` border + 3px 22% primary ring (outline removed but replaced).
- Custom checkbox/switch: the visually hidden input forwards `:focus-visible` to `.box` / `.track`.
- `.card-link:focus-visible` gets a card-radius outline.
- On route change AppShell only calls `window.scrollTo({ top: 0 })`; **focus is not moved** to `#main` and there is no route announcement (see gaps).

### 2.3 Keyboard support

| Feature | Keys | File |
|---|---|---|
| Tabs | Roving `tabIndex`; ←/→ move and activate, focus follows | `ui.tsx` `Tabs` |
| Onboarding level cards (`role="radiogroup"` / `role="radio"`) | ←/→/↑/↓ move + select, Space/Enter select, Enter on selected = continue | `src/pages/Onboarding.tsx` |
| Search palette | ⌘/Ctrl+K toggle, `/` open (ignored while typing), ↑/↓ move active option (`aria-activedescendant`), Enter open, Esc close; focus returns to previous element | `AppShell.tsx`, `Search.tsx` |
| Modal / Sheet / ConfirmDialog | Focus moves to `[data-autofocus]` or first focusable; Tab/Shift+Tab trapped; Esc closes; body scroll locked; focus restored on close. ConfirmDialog autofocuses **Cancel** | `ui.tsx` `useFocusTrap` |
| Notifications popover | Esc and outside click close | `Notifications.tsx` |
| Q&A / FAQ | Native `<details>/<summary>` | `Blocks.tsx`, Landing |
| Slide editor | ⌘/Ctrl+Z undo, ⌘/Ctrl+Shift+Z or ⌘/Ctrl+Y redo, ⌘/Ctrl+D duplicate (not while typing); with focus in the rail: ↑/↓ select previous/next slide, Alt+↑/↓ reorder, Delete/Backspace remove block; slide thumbnails are `role="button" tabIndex=0` with Enter/Space; inline text editors: Enter commits (single-line), Esc cancels | `src/admin/SlideEditor.tsx` |
| Admin sortable lists | Drag handle is `aria-hidden tabIndex=-1`; keyboard users use "Move up"/"Move down" buttons | `src/admin/fields.tsx` |

### 2.4 ARIA usage (representative, from grep)

- Dialogs: `role="dialog" aria-modal="true"` + `aria-labelledby` (Modal) / `aria-label` (Sheet, Search).
- Tabs: `role="tablist"` + `aria-label`, `role="tab"`, `aria-selected`, `aria-controls="${id}-panel"`; panels `role="tabpanel"` in Website, Library, Courses (lesson edit), Users, Account (auth form), Progress.
- Search: input `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`; results `role="listbox"` / `role="option"` + `aria-selected`.
- Radiogroups: `LevelFilter`, blog tag filter, appearance chooser (Account), Onboarding, LevelSwitcher, widget `Choice` controls (`role="radio"` + `aria-checked`).
- Toggle buttons: `aria-pressed` on BookmarkButton, PasswordInput toggle, quiz options, widget chips, block editor preview/edit toggles.
- Live regions: toast container `role="status" aria-live="polite"`; quiz feedback, contrast checker and button-states captions `aria-live="polite"`; preview/demo banners `role="status"`; `Spinner` `role="status"` + `aria-label`.
- Progress: `ProgressBar` `role="progressbar"` with `aria-valuenow/min/max` + label; `ProgressRing` `role="img"` with "label: N%".
- Icon-only buttons have `aria-label` (close, dismiss, mode switch, notifications with unread count, admin, profile, move/delete). Decorative lucide icons pass `aria-hidden`; the `Icon` helper sets `aria-hidden="true"` by default.
- External links append `<span class="sr-only">(opens in a new tab)</span>` in `MentorLink` and link blocks.
- Slide thumbnails are `aria-hidden` + `inert`.

### 2.5 Colour and contrast

- **Approach:** tokens are derived from 6 admin colours with `color-mix`; `--c-on-primary` is computed by contrast (`onColor()`, `src/lib/theme.ts`).
- **Admin checks (Confirmed):** Theme page (`src/admin/pages/Theme.tsx`) shows live pass/fail badges for text on background (≥4.5), text on surface (≥4.5), button text on primary (≥4.5) and primary on surface (≥3), per light/dark. Levels page (`Levels.tsx`) computes level colour contrast against white. Checks warn; they do not block publishing (**Inferred** — they are display-only components).
- **Measured default ratios** (WCAG formula from `theme.ts`, computed 30 Sep 2026):

| Pair | Ratio |
|---|---|
| Text `#16171D` on bg `#F5F4EF` | 16.24 |
| Primary `#4F3FF0` on white | 6.36 |
| Dark text `#F1F1F4` on dark surface `#171820` | 15.68 |
| Dark primary `#9D94FF` on dark surface | 6.83 |
| Beginner `#0B7A55` / Intermediate `#5B4BFF` / Expert `#C2410C` on white | 5.34 / 5.39 / 5.18 |
| Level colours on dark surface `#171820` | 3.31 / 3.28 / 3.41 (level colour is mixed with text for text use; dark pathline/roadmap override exists) |
| Secondary `#E8590C` on white | 3.58 |
| Accent `#0E9F6E` on white (and white tick on accent in `.check`) | 3.39 |
| Warning `#b76e00` on white | 4.00 (badge-warning text sits on a slightly tinted background, so ≤4.0) |
| Danger `#d12f45` on white | 5.00 |
| Star `#B7791F` on white | 3.64 (non-text icon) |

**Not measured:** the `color-mix` derived tokens (`--c-text-2`, `--c-text-3`) — **Unknown** exact ratios; check in a browser with DevTools contrast picker (`--c-text-3` = 60% text into background is the likeliest to be close to 4.5:1 at small sizes).

### 2.6 Images and illustrations

- Image block (`BlocksEditor.tsx`): "Alt text" is a `required` TextField with hint "Describe what the image shows for screen-reader users." — shows an inline "Alt text is required." error; **Inferred:** it does not block saving or publishing (no validation found in publish flow).
- `Illustration` (`illustrationLibrary.tsx`): `title=""` → `aria-hidden`; otherwise `role="img"` + `aria-label` (caption or built-in label). Promo popup illustrations are decorative.
- `LevelIllustration` and `HeroVisual` are `aria-hidden`.
- Decorative images use `alt=""`: uploaded logo (brand link has `aria-label`), blog covers, landing hero image, testimonial photos, promo image, media grid thumbnails. Mentor photo uses `alt={mentor.name}`.

### 2.7 Forms

- Labels: `.field > label[htmlFor]` pattern with `useId()` in `TextField`, `TextArea`, widgets' `Range`, onboarding name input, account forms; colour pickers have `aria-label`.
- Hints: `.hint` spans; the Challenges submission link field uses `aria-describedby` for hint + error (`src/pages/Challenges.tsx`), PasswordInput on Account also receives `aria-describedby`.
- Errors: `role="alert"` on Account sign-in/reset errors, suspended notice, review form error, challenge link error, admin login error, Connect page booking-URL error. Admin `TextField`/`ColorField` errors are plain `.error` spans **not** linked with `aria-describedby` and not `role="alert"`.
- `aria-invalid` set on admin TextField/ColorField when invalid.
- Required marker `*` is `aria-hidden`; the input has the native `required` attribute.
- PasswordInput: toggle is a real `<button type="button">` with `aria-label` "Show/Hide password" and `aria-pressed`.

### 2.8 Touch targets and motion

- Default `.btn`, `.input` 44px; `.btn-lg` 52px; `.quiz-option` 48px; `.star-input` buttons 44×44; `.password-toggle` 44×40.
- `@media (pointer: coarse)`: `.btn-sm` → 44px, small icon buttons 44px wide, chips 44px, promo close 44×44.
- Not enlarged on touch: `.tab` (38px), `.nav-link` (42px), `.lesson-step` (38px), `.slide-x` remove buttons (28px, admin), `.promo-bar-cta` (32px).
- Reduced motion: CSS global rule + `MotionConfig reducedMotion="user"` + `useReducedMotion()` in `Reveal`, `LevelIllustration`, `HeroVisual` (details in DESIGN_SYSTEM.md §9). Infinite animations stop under reduced motion.

### 2.9 Accessibility gaps found

| # | Gap | Evidence | Severity (judgement) |
|---|---|---|---|
| 1 | Focus is not moved to `<main>` (and nothing is announced) on client-side route change; keyboard/screen-reader users stay on the clicked link | `AppShell.tsx` only calls `scrollTo` | High |
| 2 | Page titles never change per route, so screen-reader users get no page-change cue from the title | §1.1 | Medium |
| 3 | `Tabs` sets `aria-controls="${id}-panel"` but tabs `daily` (admin Dashboard), `cmode` (Theme), `levels` (Levels) and `lvl` (Courses) have no element with that id | grep of `role="tabpanel"` | Low |
| 4 | Chip radiogroups (`LevelFilter`, blog tag filter, appearance, LevelSwitcher, widget `Choice`) have no arrow-key navigation; every radio is a separate Tab stop | `Search.tsx`, `Blog.tsx`, `LevelSwitcher.tsx`, `widgets.tsx` | Low |
| 5 | Notifications popover is not a dialog/menu: no focus move into it and no focus return | `Notifications.tsx` | Medium |
| 6 | `useFocusTrap(open, onClose)` re-runs whenever `onClose` identity changes; most callers pass inline arrow functions, so a parent re-render while a dialog is open would restore then re-focus the first element (**Inferred** from effect dependencies) | `ui.tsx` | Medium |
| 7 | Toast errors use the polite status region (not assertive) and auto-dismiss after 7s | `src/state/ui.tsx` | Low |
| 8 | Admin field errors not programmatically associated (`aria-describedby`) or announced | `src/admin/fields.tsx` | Low (admin only) |
| 9 | Image alt text is "required" visually but not enforced on publish (**Inferred**) | `BlocksEditor.tsx` | Medium |
| 10 | Warning colour `#b76e00` text (badge-warning, "Booking opens soon") ≈4.0:1 on white/tinted, below 4.5:1 for small text | measured §2.5 | Low |
| 11 | Some interactive targets below 44px on touch (tabs, nav links, lesson steps, promo CTA, slide editor remove buttons) | §2.8 | Low |
| 12 | Slide thumbnails are `div role="button"`; selection state uses `aria-current` rather than `aria-selected`/listbox semantics | `SlideEditor.tsx` | Low (admin only) |
| 13 | Search results list is not announced as a count (no live "N results") | `Search.tsx` | Low |
| 14 | `.nav-link` weight 550 and `.subtle`/`--c-text-3` small text contrast not measured | §2.5 | Unknown |

**Not audited (Unknown):** real screen-reader behaviour (VoiceOver/NVDA), zoom to 200%/400% reflow, Windows High Contrast / forced-colors mode (no `forced-colors` media query exists), and automated axe/Lighthouse scores — none were run for this document. Suggested check: run Lighthouse and axe DevTools against the live site and `/admin` locally.
