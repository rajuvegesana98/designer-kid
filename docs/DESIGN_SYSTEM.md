# Designer Kid — Design System

This document describes the design system as it is actually implemented in code: tokens (colour, type, radius, shadow, spacing), how the admin-editable theme is applied at runtime, layout primitives, the "design-tool canvas" motifs, the component catalogue (with the file each lives in), interaction states, every animation, and every responsive breakpoint. It is based only on reading `src/styles/global.css` (1,118 lines, the single stylesheet), `src/lib/theme.ts`, `src/content/seed/index.ts`, `src/state/ui.tsx`, `index.html` and the components under `src/components/`, `src/admin/` and `src/pages/`. There is no CSS framework, CSS-in-JS library or Storybook; styling is plain global CSS classes plus inline `style` for per-instance custom properties.

**Status legend:** **Confirmed** = seen in code/config · **Inferred** = reasoned from code (reason given) · **Unknown** = cannot be verified from code · **Deprecated/unused** = present but not referenced · **Planned** = not built.

Last verified: 30 Sep 2026 (docs v2.0)

---

## 1. Architecture of the styling layer

```text
index.html  ── pre-paint script sets <html data-mode> and (dark only) 5 inline colour vars
   │
src/styles/global.css  ── :root default tokens (= seed light theme) + derived tokens + all component classes
   │
src/state/ui.tsx  ThemeProvider
   │   themeVars(content.theme, resolvedMode)  (src/lib/theme.ts)
   │   └─ root.style.setProperty('--c-primary', …) etc. on <html>
   │   ensureFonts([heading, body])  → injects Google Fonts <link> on demand
   │   MotionConfig reducedMotion="user"
   ▼
Components use classes (.btn, .card, …) + inline custom properties (--c-level, --level-color, --tile, --gap)
```

- **Confirmed:** one global stylesheet imported in `src/main.tsx` (`import './styles/global.css'`).
- **Confirmed:** colour/type/radius/shadow tokens come from the published `theme` object (admin → Theme page, `src/admin/pages/Theme.tsx`). Everything else derives from them via `color-mix(in oklab, …)`.

---

## 2. Typography

### 2.1 Font families

| Token | Default (`global.css` :root and seed theme) | Fallback |
|---|---|---|
| `--font-heading` | `'Bricolage Grotesque'` | `system-ui, sans-serif` |
| `--font-body` | `'Instrument Sans'` | `system-ui, sans-serif` |
| monospace (`code`, `.mono`) | `ui-monospace, 'SF Mono', Menlo, monospace` | — (not themeable) |

**FONT_OPTIONS** (`src/lib/theme.ts`) — the 14 fonts the admin can pick for heading or body:

1. Bricolage Grotesque 2. Instrument Sans 3. Inter 4. DM Sans 5. Manrope 6. Plus Jakarta Sans 7. Space Grotesk 8. Sora 9. Outfit 10. Figtree 11. Lexend 12. Work Sans 13. IBM Plex Sans 14. Fraunces

Loading (**Confirmed**):
- `index.html` statically loads Bricolage Grotesque (`opsz 12..96`, weights 500/600/700/800) and Instrument Sans (400/500/600/700) with `display=swap`.
- `ensureFonts()` (`src/lib/theme.ts`) injects another Google Fonts stylesheet for the chosen heading/body fonts at weights 400;500;600;700;800. Its `loadedFonts` set starts empty, so the default fonts are requested a second time on first theme application (see PERFORMANCE.md).

### 2.2 Weights, base size, line height

| Token | Default | Admin range / source |
|---|---|---|
| `--fs-base` (on `html { font-size }`) | 16px | NumberField 14–20px (`Theme.tsx`) |
| `--fw-heading` | 700 | theme `fonts.headingWeight` |
| `--fw-body` | 400 | theme `fonts.bodyWeight` |
| `--lh` (body line-height) | 1.6 | NumberField 1.2–2 step 0.05 |

Hard-coded weights used by classes: 500, 550 (`.nav-link`), 600 (buttons, labels, badges, tabs), 700 (table headers, nav labels, stat values), 800 (`.brand-name`). **Inferred:** weight 550 is not a loaded static weight; the browser will round/synthesise it (Instrument Sans is requested at discrete 400/500/600/700).

### 2.3 Heading scale (`global.css`)

All `h1–h4`: `font-family: var(--font-heading)`, `font-weight: var(--fw-heading)`, `line-height: 1.15`, `letter-spacing: -0.02em`, `margin: 0`, `text-wrap: balance`.

| Element | font-size | letter-spacing |
|---|---|---|
| `h1` | `clamp(2rem, 1.4rem + 2.6vw, 3.25rem)` (32 → 52px at 16px base) | -0.02em |
| `h2` | `clamp(1.45rem, 1.2rem + 1vw, 2rem)` (≈23 → 32px) | -0.02em |
| `h3` | `1.2rem` | -0.01em |
| `h4` | `1rem` | 0 |
| `PageHeader` h1 (`ui.tsx`, inline) | `clamp(1.8rem, 1.3rem + 1.8vw, 2.6rem)` | inherited |
| `.section-head h2` | 1.35rem | |
| `.lesson-section-title` | 1.5rem | |
| `.prose h3` | 1.3rem | |

`p` uses `text-wrap: pretty`. Links use `--c-primary-text` with `text-underline-offset: 3px`.

### 2.4 Text helpers

| Class | Style |
|---|---|
| `.eyebrow` | 0.8rem, 600, `letter-spacing: 0.06em`, uppercase, `--c-text-2` |
| `.lead` | 1.125rem, `--c-text-2`, line-height 1.55 |
| `.muted` | `--c-text-2` |
| `.subtle` | `--c-text-3`, 0.875rem |
| `.small` | 0.875rem |
| `.mono` | monospace 0.85em |
| `.prose` | `max-width: var(--reading-max)` (720px), 1.05rem, block spacing `--space-5` |
| `.clamp-2` | 2-line clamp |
| `.stat-value` | heading font, 1.9rem, 700, -0.02em |

---

## 3. Colour

### 3.1 Theme colours (seed defaults, `src/content/seed/index.ts`)

| Theme key | CSS var | Light | Dark |
|---|---|---|---|
| primary | `--c-primary` | `#4F3FF0` | `#9D94FF` |
| secondary | `--c-secondary` | `#E8590C` | `#FF9E6B` |
| accent | `--c-accent` | `#0E9F6E` | `#3DD6A3` |
| background | `--c-bg` | `#F5F4EF` | `#0D0E13` |
| surface | `--c-surface` | `#FFFFFF` | `#171820` |
| text | `--c-text` | `#16171D` | `#F1F1F4` |
| (computed) | `--c-on-primary` | `onColor(primary)` | `onColor(primary)` |

Theme `mode` default: `'system'`. Other theme defaults: `radius { base: 12, button: 12, card: 20 }`, `shadow: 'soft'`, `border: 'subtle'`.

**`--c-on-primary`** (`onColor()` in `src/lib/theme.ts`, **Confirmed**): computes WCAG contrast of the primary colour against `#ffffff` and `#0d0e13` and picks whichever is higher. The same `contrastRatio()`/`luminance()` helpers power the admin contrast checks and the Contrast Checker widget.

### 3.2 Derived tokens (`global.css` :root)

| Token | Definition |
|---|---|
| `--c-text-2` | `color-mix(in oklab, var(--c-text) 72%, var(--c-bg))` |
| `--c-text-3` | `color-mix(in oklab, var(--c-text) 60%, var(--c-bg))` |
| `--c-line` | text 11% on transparent |
| `--c-line-strong` | text 22% on transparent |
| `--c-surface-2` | text 4% into surface |
| `--c-surface-3` | text 8% into surface |
| `--c-glass` | surface 78% on transparent (72% in dark) |
| `--c-primary-soft` | primary 12% into surface |
| `--c-primary-line` | primary 35% on transparent |
| `--c-primary-text` | primary 88% into text |
| `--c-secondary-soft` / `--c-accent-soft` | 13% into surface |
| `--c-success` | `var(--c-accent)` |
| `--c-danger` | `#d12f45` (dark: `#ff6b7f`) |
| `--c-danger-soft` | danger 11% into surface |
| `--c-warning` | `#b76e00` (dark: `#ffc04d`) |
| `--c-warning-soft` | `#f59f00` 16% into surface |
| `--c-focus` | `var(--c-primary)` |
| `--c-level` | `var(--c-primary)` (overridden per page with the level colour) |
| `--c-level-text` | level 80% into text |

Hard-coded colours outside tokens: star rating `#B7791F` (`.stars .on`, `.star-input button.on`); promo tone `dark` `#15161c`; overlay scrim `#05060a` at 45%; dark-mode pathline/roadmap text `#0d0e13`; `.check` tick `#fff`; `.btn-danger` text `#fff`.

### 3.3 Level colours (seed)

| Level | Colour | Icon | Sequential |
|---|---|---|---|
| Beginner | `#0B7A55` | Sprout | yes |
| Intermediate | `#5B4BFF` | Rocket | no |
| Expert | `#C2410C` | Crown | no |

Level colour is applied by setting `--c-level` inline on the page container (`Dashboard.tsx`, `Learn.tsx`, `Lesson.tsx`) or `--level-color` on `.badge-level`, and `--c-primary` on onboarding cards (`Onboarding.tsx`). It feeds progress bars, rings, roadmap nodes, pathline and lesson section numbers. Dark mode override: `:root[data-mode='dark'] .pathline-step.current, … .roadmap-step.done .roadmap-node` switch to near-black text on a lightened level colour.

### 3.4 Runtime theming (how it works)

1. **Pre-paint** (`index.html` inline script, **Confirmed**): reads `localStorage['dk.colorMode']`; if dark (explicit or `system` + OS dark) sets `<html data-mode="dark">` and inline `--c-bg/--c-surface/--c-text/--c-primary/--c-on-primary` using the **seed** dark values (hard-coded). Light uses the `:root` CSS defaults (= seed light values). **Inferred:** if the admin changes the published palette, first paint still shows seed colours until React applies the real theme.
2. **ThemeProvider** (`src/state/ui.tsx`): resolved mode = user pref (`dk.colorMode`) → else theme `mode` → `system` uses `prefers-color-scheme` (live listener). Writes `data-mode` on `<html>` and every entry of `themeVars(theme, mode)` with `style.setProperty`.
3. **`themeVars()`** (`src/lib/theme.ts`) outputs: the 7 colour vars, `--font-heading`, `--font-body`, `--fs-base`, `--fw-heading`, `--fw-body`, `--lh`, `--r-base`, `--r-button`, `--r-card`, `--border-w` (`none` 0px / `subtle` 1px / `strong` 1.5px) and, **in light mode only**, `--shadow-1`/`--shadow-2` from the SHADOWS preset. In dark mode ThemeProvider removes the inline shadows so the CSS dark shadows apply. **Inferred:** the `shadow` preset (including `none`) therefore has no effect in dark mode.
4. **Derived-token re-declaration:** custom properties that use `var()` resolve where they are declared, so `global.css` re-declares all derived tokens on `[style*='--c-'], .theme-scope`. Any element with an inline `--c-*` variable (level pages, theme preview, print shell) gets correctly recomputed `--c-text-2`, `--c-primary-soft`, etc. `.theme-scope` is **Deprecated/unused** (no component uses the class).
5. **Scoped modes:** `[data-mode='dark']` (not only `:root`) sets dark shadows/danger/warning, so the Theme editor preview (`Theme.tsx`, `data-mode={mode}` + `themeVars` inline) and print shell (`Print.tsx`, forced `data-mode="light"`) render independently of the page mode.
6. Brand: ThemeProvider also sets `document.title` and swaps the favicon `href` when `brand.faviconUrl` is set.

---

## 4. Shape, depth and borders

| Token | Default | Notes |
|---|---|---|
| `--r-base` | 12px | inputs, tabs, list rows |
| `--r-button` | 12px | `.btn`, skip link |
| `--r-card` | 20px | cards, dialogs (+4px), callouts, widgets |
| pills | 999px | badges, chips, progress, search trigger |
| `--border-w` | 1px | `.card`, `.btn`, `.chip`, inputs |
| `--shadow-1` | light default `0 1px 2px rgb(20 20 40/.06), 0 4px 16px rgb(20 20 40/.05)` | resting |
| `--shadow-2` | `0 2px 6px …/.08, 0 16px 40px …/.1` | hover/overlays |
| dark `--shadow-1/2` | `rgb(0 0 0 / .4 / .25)` and `(.45 / .4)` | CSS only |

Shadow presets in `theme.ts`: `none` (`none` / `0 0 0 1px var(--c-line)`), `soft`, `medium`, `strong`.

Z-index scale (from `global.css`): lesson steps 10 · topbar 40 · bottom nav 50 · popover 60 · overlay/dialog 100 · toasts 200 · skip link 1000.

## 5. Spacing and layout tokens

| Token | Value |
|---|---|
| `--space-1 … --space-8` | 4, 8, 12, 16, 24, 32, 48, 64px |
| `--sidebar-w` | 256px (88px at 721–1100px) |
| `--topbar-h` | 64px |
| `--bottomnav-h` | 68px |
| `--content-max` | 1180px |
| `--reading-max` | 720px |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |

### Layout primitives

| Class | Behaviour |
|---|---|
| `.stack` | flex column, `gap: var(--gap, 16px)` |
| `.row` | flex row, centred, wraps, `gap: var(--gap, 12px)` |
| `.row-between` | space-between, wraps |
| `.grow` | `flex: 1; min-width: 0` |
| `.grid` + `.grid-2/3/4` | auto-fit/fill with min 320 / 260 / 200px (`min(100%, …)`) |
| `.page` | full width, max 1180px, padding 32/24/64px; ≤640px: 24/16px and bottom = 48px + bottom-nav height |
| `.page-narrow` | max 880px |
| `.section` / `.section-head` | 48px top margin (32px ≤640px) / title row |
| `.lesson-layout` | `1fr 300px` (aside) |
| `.admin-split` | `340px 1fr`; `.admin-split.focus` hides the aside |
| `.theme-split` | `1fr 420px` with sticky preview |
| `.reviews-layout` | `1fr 380px` |
| `.mentor-panel-grid` | `auto 1fr` |
| `.hide-sm` / `.show-sm` | hide ≤640px / hide ≥641px |

`--gap` is passed inline (`style={{ '--gap': '10px' }}`) throughout.

---

## 6. Signature motifs

- **Canvas dot grid** — `.canvas-bg`: `radial-gradient` 1px dots at 9% text colour, 22×22px, `background-attachment: fixed`. Used on the app shell and admin login screens; the slide editor stage reuses the same pattern. Illustrations embed a 12px SVG dot `pattern`.
- **Selection frame** — `.frame`: 1.5px primary outline offset 6px, four 9×9 corner handles (`::before/::after` on `.frame` and on a child `.frame-handles`), and a `.frame-label` "layer name" tag above the top-left corner (primary background, on-primary text). Used on the selected onboarding level card ("Selected"), dashboard hero card, hero visual card ("Lesson · Auto Layout"), challenges and a widget.
- **Brand mark** (`src/components/Brand.tsx`) — dashed square with a primary handle (top-left) and secondary handle (bottom-right) and an "A" stroke; mirrored in `public/favicon.svg`. Replaced by an uploaded logo when `brand.logoUrl` is set.
- **Glass** — `.glass`: `--c-glass` + `backdrop-filter: blur(14px) saturate(1.4)`; used on topbar, bottom nav, lesson step bar, onboarding continue bar, hero cards. Sidebar uses `blur(12px)`.
- **Tinted** — `.tinted`: two radial gradients (level colour top-left, secondary bottom-right) over surface.

---

## 7. Component catalogue

| Component | Classes / API | File |
|---|---|---|
| Button | `.btn` + `.btn-primary`, `.btn-ghost`, `.btn-soft`, `.btn-danger`; sizes `.btn-sm` (36px), default (44px), `.btn-lg` (52px); `.btn-icon` (square 44/36), `.btn-block` | `global.css` |
| Badge | `.badge` + `-primary`, `-success`, `-warning`, `-danger`, `-level` (`--level-color`); `LevelBadge` | `global.css`, `ui.tsx` |
| Chip | `.chip` inside `.chip-group`; selected via `aria-pressed/selected/checked="true"` (inverted text/bg) | `global.css` |
| Card | `.card`, `.card-flat`, `.card-tight`, `.card-link` (hover border + shadow-2), `.tinted`, `.glass` | `global.css` |
| Form field | `.field` > `label`, `.hint`, `.error`; `.input`, `.select` (CSS chevron), `.textarea`; `aria-invalid` red border | `global.css`; admin wrappers `TextField`, `TextArea`, `NumberField`, `ColorField`, `SelectField`, `ImageField` in `src/admin/fields.tsx` |
| Checkbox | `CheckItem` → `.check` / `.box` (custom 22px box, strike-through text when checked) | `ui.tsx` |
| Switch | `Switch` → `.switch` / `.track` (`role="switch"` on the input) | `ui.tsx` (admin variant in `fields.tsx`) |
| PasswordInput | `.password-field` + `.password-toggle` (44×40px, `aria-pressed`, "Show/Hide password") | `ui.tsx` |
| Tabs | `Tabs` → `.tabs`/`.tab` with animated `.tab-pill` (`layoutId`) | `ui.tsx` |
| Modal / ConfirmDialog | `.overlay` > `.dialog` (`.dialog-wide`, `.overlay-center`); portalled to `<body>`; focus trap, Esc, click-outside | `ui.tsx` |
| Sheet (bottom sheet) | `.sheet-overlay` > `.sheet` + `.sheet-grip`; portalled | `ui.tsx` |
| Popover | `.popover` (notifications) | `Notifications.tsx` |
| Toasts | `.toasts` > `.toast` / `.toast-error`; max 3; auto-dismiss 3.8s (7s errors) | `src/state/ui.tsx` |
| Progress bar | `ProgressBar` → `.progress` (`.progress-thin`), gradient level→secondary | `ui.tsx` |
| Progress ring | `ProgressRing` → `.ring` SVG | `ui.tsx` |
| Empty state | `EmptyState` → `.empty` (dashed border) + `.empty-icon` | `ui.tsx` |
| Spinner / loader | `Spinner` (`.spinner`, `role="status"`), `FullPageLoader` | `ui.tsx` |
| Page header | `PageHeader` | `ui.tsx` |
| Reveal | scroll-in wrapper | `ui.tsx` |
| Callouts | `.callout`, `.callout-tip`, `.callout-warning`; `why` = default | `Blocks.tsx` |
| Do / Don't | `.dodont` `.do` / `.dont` (4px coloured top border) | `Blocks.tsx` |
| Compare (before/after) | `.compare .before/.after .tag` | `Blocks.tsx` (example block) |
| Quiz | `.quiz-option` (`.correct`/`.wrong`), `.quiz-letter` | `Blocks.tsx` |
| Q&A | `<details class="qa-item">`, `.qa-q`, `.qa-a`, `.qa-tip`, rotating `.faq-chevron` | `Blocks.tsx` |
| File card / embed | `FileCard` (`.file-card`), PDF iframe, Office viewer embed for public PPT | `Blocks.tsx` |
| Content blocks | `BlockView` / `Blocks`: text, heading, callout, list, doDont, checklist, example, quiz, interactive, illustration, qa, file, image, video (YouTube-nocookie/Vimeo), link | `Blocks.tsx` |
| Interactive widgets | `.widget` / `.widget-stage` / `.widget-controls`: contrast-checker, spacing-scale, type-scale, visual-hierarchy, auto-layout, grid-playground, button-states | `widgets.tsx` |
| Topic illustrations | 28 inline SVG scenes 320×180 (`ILLUSTRATION_NAMES`), theme-coloured via CSS vars | `illustrationLibrary.tsx` |
| Level illustrations, hero visual | `LevelIllustration`, `HeroVisual` | `Illustrations.tsx` |
| Promo bar / popup | `.promo-bar`, `.promo-close`; popup = `Modal` + `PromoCard`; tones primary/secondary/accent/dark | `Promo.tsx` |
| Mentor | `MentorLink` (external booking link), `MentorSection` (`.mentor-panel`, "Booking opens soon" badge fallback) | `MentorLink.tsx` |
| Search palette | dialog + combobox + listbox, `.result-item`, `LevelFilter` chips | `Search.tsx` |
| Notifications | bell button + `.icon-dot` + `.popover` | `Notifications.tsx` |
| Bookmark button | `BookmarkButton` | `BookmarkButton.tsx` |
| Level switcher | modal radiogroup | `LevelSwitcher.tsx` |
| Blog cards | `.blog-card`, `.blog-card-featured`, `.blog-cover-img` (16:9), `.blog-hero` | `src/pages/Blog.tsx` |
| Roadmap / pathline | `.roadmap-step` (`.done/.current/.locked`), `.roadmap-node`; `.pathline-step` | `Learn.tsx`, `Dashboard.tsx` |
| Lesson step bar | `.lesson-steps` (sticky glass pill) + `.lesson-step` | `Lesson.tsx` |
| Reviews | `.stars`, `.star-input` (44px buttons), `.review-card`, `.review-reply` | `Reviews.tsx` |
| Tables | `.table-wrap` > `.table` | admin pages |
| Banners | `.banner-preview`, `.banner-demo` | `AppShell.tsx`, `AdminApp.tsx` |
| Print | `.print-doc`, `.print-toolbar`, `.print-cover`, `.print-section`, `@media print` rules | `src/pages/Print.tsx` |
| Slide editor | `.slide-editor` (container), `.slide-ribbon` / `.ribbon-group` / `.ribbon-btn`, `.slide-rail` / `.slide-item` / `.slide-thumb` (content rendered at `scale(0.24)`), `.slide-stage` (dot grid), `.slide-canvas`, `.slide-panel`, `.inline-editable` / `.inline-editor` | `src/admin/SlideEditor.tsx` |
| Admin lists | `.sortable`, `.sortable-row`, `.drag-handle`, `.tree-item`, `.illus-grid`, `.preset-grid`, `.favicon-tab`, `.guide-picker` | `src/admin/*` |
| App shell | `.shell` grid, `.sidebar`, `.brand`, `.nav` / `.nav-link` / animated `.nav-pill`, `.topbar` (glass, sticky), `.search-trigger` + `kbd`, `.avatar`, `.bottomnav`, More `Sheet`, `SiteFooter` | `AppShell.tsx` |
| Admin shell | same classes + `.admin-shell`, `.admin-menu-btn` (≤720px) and admin menu `Sheet` | `src/admin/AdminApp.tsx` |

---

## 8. States

| State | Implementation |
|---|---|
| Hover | `.btn` → `--c-surface-2`; primary → 88% primary + text; ghost → surface-3; `.card-link` → primary-line border + shadow-2; chips/quiz/preset → primary border; inputs → darker border; nav-link → surface-3 |
| Active/pressed | `.btn:active { transform: scale(0.97) }`; Motion `whileTap` on selected buttons (see §9) |
| Focus | global `:focus-visible { outline: 2.5px solid var(--c-focus); outline-offset: 2px; border-radius: 6px }`; inputs use border + 3px primary ring on `:focus` (outline removed); hidden checkbox/switch inputs show the ring on `.box`/`.track` |
| Selected | `aria-selected/pressed/checked="true"` on chips; `.tab[aria-selected]`; `.nav-link.active` + pill; `.slide-item[aria-current='true']`; `.tree-item.active` |
| Disabled | `.btn:disabled, [aria-disabled='true']` opacity .5 + not-allowed; `.ribbon-btn:disabled` opacity .4 |
| Invalid / error | `.input[aria-invalid='true']` red border; `.field .error` text; `.toast-error`; `role="alert"` paragraphs on auth/review/challenge forms |
| Loading | `Spinner` (`.spinner` 0.8s rotation), `FullPageLoader` while content loads, "Uploading…" / "Saving" button labels. `.skeleton` shimmer class exists but is **Deprecated/unused** (no component uses it) |
| Empty | `EmptyState` (used in Progress, Blog, Lesson, Learn, Challenges, Resources, Reviews, Account/NotFound, admin) |
| Done/locked | roadmap `.done/.current/.locked`, `.check input:checked ~ .check-text` strikethrough, achievements at 0.72 opacity |

---

## 9. Animations & interactions

**Library (Confirmed):** `motion` 13.4.6 (`motion/react`, which re-exports `framer-motion` 13.4.6). `motion-studio` 2.1.0 is a devDependency used only by the dev server (`vite.config.ts`, excluded from `/admin`) and checked out of production by `scripts/postbuild.mjs`.

**Global config (Confirmed, `src/state/ui.tsx`):** `<MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 420, damping: 36 }}>` — every Motion animation without its own `transition` uses that spring; with OS "reduce motion", Motion disables transform/layout animations (opacity still fades — library behaviour).

### 9.1 Motion animations

| Where | Element | Trigger | Animation | Timing |
|---|---|---|---|---|
| `AppShell.tsx` | `motion.main` keyed by pathname | every route change | opacity 0→1, y 8→0 | 0.28s, ease-out cubic `[0.22,1,0.36,1]` |
| `AppShell.tsx` / `AdminApp.tsx` | `.nav-pill` `layoutId="nav-pill"` / `"admin-pill"` | active nav change | shared-layout slide between links | global spring |
| `AppShell.tsx` ModeToggle | icon span keyed by mode | mode toggle | rotate -40°→0, fade in | global spring |
| `ui.tsx` Tabs | `.tab-pill` `layoutId={id}-pill` | tab change | pill slides | global spring |
| `ui.tsx` ProgressBar | span | mount / value change | `scaleX` 0→pct | 0.8s ease-out cubic |
| `ui.tsx` ProgressRing | circle | mount / value change | `strokeDashoffset` full→value | 1s ease-out cubic |
| `ui.tsx` Modal | overlay / dialog (AnimatePresence) | open/close | overlay fade 0.18s; dialog opacity+y 16+scale .98 → 1; exit y 8, 0.12s | spring for enter |
| `ui.tsx` Sheet | sheet | open/close | y 100%→0 | spring 380/38 |
| `ui.tsx` Reveal | wrapper | scrolls into view (`once`, margin -40px) | opacity 0→1, y 18→0; staggered `delay` props | 0.5s ease-out cubic; **skipped entirely** when `useReducedMotion()` |
| `src/state/ui.tsx` toasts | `motion.div layout` in AnimatePresence | push/dismiss | y 16 + scale .96 → 1; exit 0.15s | spring |
| `Search.tsx` | overlay / dialog | open/close | fade 0.15s; dialog y -12, scale .98 → 1 | |
| `Notifications.tsx` | popover | open/close | opacity, y -6, scale .98 | 0.15s |
| `Promo.tsx` | promo bar | appear/dismiss | height 0→auto + fade | spring |
| `Promo.tsx` | popup | 1,200ms after landing | Modal animation | |
| `BookmarkButton.tsx` | button | tap | `whileTap scale 0.9` | |
| `LevelSwitcher.tsx` | option buttons | tap | `whileTap scale 0.98` | |
| `Onboarding.tsx` | level cards | mount; hover; tap | stagger 0.08s×i, y 20→0, 0.45s; `whileHover y -4`; `whileTap scale .99` | |
| `Onboarding.tsx` | continue bar | level chosen | y 16 fade in/out (AnimatePresence); button `layout` + `whileTap .97` | |
| `Illustrations.tsx` LevelIllustration | SVG groups | selected card (`active`) | infinite float y ±2–9px / scale 1.08, staggered | 3.2s easeInOut, `repeat: Infinity`; disabled with reduced motion |
| `Illustrations.tsx` HeroVisual | 3 glass cards | always (Landing) | infinite drift y 0→-8→0, delays 0/0.8/1.6s | 5s easeInOut, infinite; disabled with reduced motion |
| `Lesson.tsx` | completion card | mark complete | AnimatePresence `mode="wait"` swap; tick icon spring scale .4→1, rotate -20→0 (stiffness 500, damping 18); button `whileTap .95` | |
| `Blocks.tsx` Quiz | feedback | answer picked | opacity, y 6→0 | spring |
| `Dashboard.tsx` | hero card | mount | y 12 fade | spring |
| `Landing.tsx` | hero copy | mount | y 16 fade | 0.6s ease-out cubic |
| `Progress.tsx` | achievement cards | mount | y 10, stagger 0.03s×i | |
| `Reviews.tsx` | thank-you card | submit | scale .98 fade | |
| `widgets.tsx` | many `motion.* layout` elements | control changes (spacing, type scale, hierarchy, auto layout, grid) | layout animation of size/position | global spring |
| `Reveal` users | Dashboard, Learn, Blog, Landing, Resources, Challenges, Career, Reviews | scroll | as above | |

### 9.2 CSS animations and transitions

| Rule | Detail |
|---|---|
| `@keyframes spin` | `.spinner` 0.8s linear infinite; also button-states widget loader |
| `@keyframes shimmer` | `.skeleton` 1.4s (class unused) |
| Transitions | `.btn` (bg/border .15s, shadow .2s, transform .12s); `.card-link` (border .2s, shadow/transform .25s ease-out); `.chip`, inputs, `.check`, `.quiz-option`, `.nav-link` (.15s); `.switch` knob `transform .2s ease-out`; `.faq-chevron` rotate 180° .2s; `.lesson-step` .2s; `.inline-editable` outline .15s; `.skip-link` top .15s |

**Reduced motion (Confirmed, `global.css`):** `@media (prefers-reduced-motion: reduce)` sets every `animation-duration`/`transition-duration` to 0.01ms, iteration count 1 and `scroll-behavior: auto`. Combined with `MotionConfig reducedMotion="user"` and explicit `useReducedMotion()` checks in `Reveal`, `LevelIllustration` and `HeroVisual`.

**No 3D / parallax (Confirmed by grep):** no `perspective`, `rotateX/Y`, `preserve-3d`, `useScroll`, `useTransform` or parallax code in `src/`. The only rotation is the 2D mode-toggle icon, chevrons and the lesson-complete tick.

**Other interactions:** `⌘/Ctrl+K` and `/` open search (`AppShell.tsx`); `window.scrollTo({top:0})` on route change; notification popover closes on outside click/Esc; promo popup delay 1.2s; slide editor keyboard shortcuts (see SEO_ACCESSIBILITY.md §2.5); drag handles in admin sortable lists (`touch-action: none`).

---

## 10. Responsive behaviour

### 10.1 Breakpoints in `global.css`

| Query | What changes |
|---|---|
| `max-width: 1100px and min-width: 721px` | **Tablet icon rail**: `--sidebar-w: 88px`; brand text, nav labels, sidebar extras (level card, mentor card) and `.nav-sub` hidden; nav links become 72px-wide stacked icon + 0.72rem label (admin 0.68rem) |
| `max-width: 720px` | **Mobile**: single-column shell, sidebar hidden, topbar shows brand mark only, search trigger becomes a 44px round icon (text and ⌘K hidden), fixed glass **bottom nav** (5 columns, height 68px + `safe-area-inset-bottom`, active indicator bar), toasts full-width above bottom nav, admin shows `.admin-menu-btn` (opens admin Sheet) |
| `max-width: 640px` | `.page` tighter padding + bottom padding for bottom nav; `.section` 32px; `.hide-sm` hidden; lesson step bar radius 16px and tighter steps; lesson "Mark complete" button full-width and wrapping; `.qa-a` left padding 16px; lesson cover full width; `.mentor-panel-grid` single column |
| `min-width: 641px` | `.show-sm` hidden |
| `max-width: 1100px` | `.lesson-layout` single column and `.lesson-aside` hidden (641–1100px shows `.show-sm` lesson content inline); `.theme-split` single column with preview moved above (`order: -1`, not sticky) |
| `max-width: 1000px` | `.admin-split` and `.reviews-layout` single column (review aside no longer sticky) |
| `max-width: 760px` | featured blog card stacks |
| `pointer: coarse` | `.btn-sm` → 44px min height, `.btn-icon.btn-sm` 44px wide, `.chip` 44px, `.promo-close` 44×44 |
| `prefers-reduced-motion: reduce` | see §9 |
| `print` | A4, 16mm/14mm margins, white background, hides toolbar/toasts/skip link, no dot grid, avoids breaks inside cards/callouts/figures, one lesson per page |
| `@container (max-width: 1020px)` on `.slide-editor` | slide body 170px rail + canvas; format panel moves below full-width |
| `@container (max-width: 640px)` | rail becomes a horizontal scroller of 130px thumbnails, section labels hidden, stage/canvas padding reduced |

Desktop defaults (>1100px): 256px sticky sidebar + sticky 64px glass topbar; slide editor three columns `200px | 1fr | 320px`.

### 10.2 Mobile-specific UI

- **Bottom nav** (`AppShell.tsx`): up to four of `home, learn, challenges, career` from `content.navigation` + a **More** button (`aria-haspopup="dialog"`) that opens a bottom `Sheet` with the remaining nav items, 1:1 link (if a booking URL is set), Profile, Switch level and Admin (admins only).
- Safe areas: `viewport-fit=cover` in `index.html`; bottom nav, sheet and onboarding continue bar use `env(safe-area-inset-bottom)`.
- `100dvh` for shell/sidebar/loader heights.
- `Courses.tsx` scrolls the editor into view when `window.innerWidth < 1000`.

### 10.3 Images and media

- Global `img { max-width: 100%; display: block }`.
- Content image blocks: `loading="lazy" decoding="async"`, rounded, bordered (`Blocks.tsx`). Blog covers `loading="lazy"`, `aspect-ratio: 16/9; object-fit: cover`.
- Illustrations are inline SVG with `viewBox` and `width="100%"` (scale fluidly). Video/PDF embeds use `aspect-ratio` containers and `loading="lazy"` iframes.
- No `srcset`/`sizes` or `<picture>` anywhere (**Confirmed** by grep).

### 10.4 Fluid typography

Only `h1`, `h2` and `PageHeader` h1 use `clamp()` with `vw`; everything else is rem-based and scales with the admin base size.
