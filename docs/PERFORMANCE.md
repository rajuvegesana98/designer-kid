# Designer Kid — Performance

This document records measured bundle sizes, what each chunk contains, how fonts, images and content load, the main runtime costs in the learner app and the admin, Supabase call patterns, and a prioritised list of improvements. All sizes were measured on 30 Sep 2026 by running `npm run build` (Vite 8.3.1 / rolldown) locally and `gzip -c <file> | wc -c`, plus a second sourcemap build written to a scratch folder to attribute bytes to packages. Timings were taken in Node 24 on an Apple M2 and only indicate relative cost. No Lighthouse/Web Vitals run was made, so field metrics (LCP, INP, CLS) are **Unknown**. The main findings: the learner app ships about 247 KB gzip of JS before any content, and in production it very likely also downloads a 244 KB gzip seed chunk on every visit because the published document lacks newer sections.

**Status legend:** **Confirmed** = measured or seen in code · **Inferred** = reasoned from code (reason given) · **Unknown** = not measured (says how to check) · **Planned** = not built.

Last verified: 30 Sep 2026 (docs v2.0)

---

## 1. Build output (measured)

Command: `npm run build` → `tsc -b && vite build && node scripts/postbuild.mjs`. Build time reported by Vite: 488 ms. Vite warns that chunks exceed 500 kB. `postbuild.mjs` confirmed "No Motion Studio code in production build (6 files checked)" and copied `index.html` → `404.html`.

| File | Raw bytes | gzip (`gzip -c`) | Vite-reported gzip | Loaded when |
|---|---|---|---|---|
| `dist/assets/index-<hash>.js` (main) | 860,949 | 247,288 | 249.40 kB | Every page |
| `dist/assets/seed-<hash>.js` | 736,345 | 243,584 | 245.16 kB | Lazily, see §3 |
| `dist/assets/AdminApp-<hash>.js` | 184,473 | 48,118 | 48.31 kB | `/admin/*` only (`React.lazy` in `src/App.tsx`) |
| `dist/assets/index-<hash>.css` | 44,590 | 9,444 | 9.44 kB | Every page |
| `dist/index.html` / `dist/404.html` | 1,794 each | — | 0.88 kB | Entry / deep links |
| `dist/favicon.svg` | 494 | — | — | Every page |

Hashes change with `BASE_PATH`; the live site (built with `/designer-kid/`) served `index-Cj5TT1jh.js` on 30 Sep 2026. The local build used base `/`. There are **no image, font or media files** in `dist/` — fonts come from Google Fonts and all media from Supabase Storage.

## 2. What is in each chunk (sourcemap attribution, minified bytes)

**Main chunk (861 KB raw):**

| Share | Source |
|---|---|
| 202.5 KB (24.1%) | `react-dom` |
| ~209 KB (≈24%) | Supabase: `auth-js` 97.1, `realtime-js` 30.0, `phoenix` 25.1, `storage-js` 22.0, `postgrest-js` 16.0, `supabase-js` 10.4, `iceberg-js` 5.2, `functions-js` 2.8 |
| ~125 KB (≈15%) | Motion: `motion-dom` 91.7, `framer-motion` 31.6, `motion-utils` 1.8 |
| 107.7 KB (12.8%) | `src/pages/*` (largest: Account 13.6, Career 13.2, Lesson 10.9, Challenges 10.1, Dashboard 9.6) |
| 89.8 KB (10.7%) | `src/components/*` (largest: `illustrationLibrary.tsx` 30.6, `widgets.tsx` 12.7, `Blocks.tsx` 8.8, `AppShell.tsx` 7.4, `ui.tsx` 7.3) |
| 37.7 KB | `react-router` |
| 25.8 KB | `lucide-react` (curated named imports in `src/lib/icons.tsx` plus per-file imports — tree-shaken) |
| ~38 KB | `src/lib`, `src/state`, `src/data`, React, scheduler |

**AdminApp chunk (184 KB raw):** `src/admin/pages/*` 113 KB, `src/admin/*` 52 KB (SlideEditor 20.2, Courses 15.8, Dashboard 14.4, Users 12.5, AdminApp 11.7, Theme 11.0, Library 10.6, fields 8.6), plus small lucide/framer pieces. Learners never download it (**Confirmed**: only dynamic import in `App.tsx`).

**Seed chunk (736 KB raw):** 100% `src/content/seed/*` — all bundled lessons, guides, blog posts and defaults. Serialised as JSON it is 756,094 bytes (244,239 gzip): `levels` 516 KB (182 lessons), `careerGuides` 141 KB (27), `blog` 50 KB (12 posts), `challenges` 32 KB (21), everything else <10 KB each (measured by importing the built chunk in Node).

Largest single assets: the main JS and the seed chunk (~245 KB gzip each).

## 3. Load sequence for a learner (from code)

```text
index.html
 ├─ <link rel="stylesheet"> Google Fonts (render-blocking, 2 families) ─► font files (gstatic)
 ├─ inline colour-mode script
 ├─ main JS (247 KB gz) + CSS (9 KB gz)
 ▼
ContentProvider  (src/state/content.tsx) — shows FullPageLoader until content is ready
 ├─ store.loadPublished()  → Supabase REST: site_content?id=eq.published (whole site JSON)
 ├─ withDefaults(): if any of 16 top-level sections is missing → import('../content/seed') (244 KB gz)
 │                  and structuredClone(seedContent)
 └─ on error / no backend → loadSeed()
ThemeProvider → ensureFonts([heading, body]) → second Google Fonts stylesheet
AuthProvider → Supabase auth session check
```

- **Inferred (high confidence):** the live published document was created before the `promos`, `blog` and `reviews` sections existed (hand-off fact), so `withDefaults()` finds missing keys on **every** production visit and downloads the seed chunk. Real first-load JS on production is therefore ≈491 KB gzip (main + seed) before the first content render. Republishing from the admin (which saves all sections) should remove this.
- **Inferred:** the published `site_content` payload is similar in size to the seed JSON (≈700 KB uncompressed, since it holds the same 182 lessons and 27 guides without blog/promos). Transfer size and whether Supabase compresses it: **Unknown** — check in DevTools Network on the live site.
- The published content is not cached by the app between visits (no localStorage/service-worker cache for `site_content`). **Confirmed** by reading `content.tsx`.
- No service worker / PWA manifest (**Confirmed**: nothing in `public/` or `index.html`).

## 4. Fonts

- `index.html` loads Bricolage Grotesque (opsz 12..96, 500–800) + Instrument Sans (400–700) via a normal `<link rel="stylesheet">` with `display=swap`, after `preconnect` to both Google hosts. The stylesheet is **render-blocking** (**Confirmed**). Measured: the CSS response contains 20 `@font-face` rules (subsets × families).
- `ensureFonts()` (`src/lib/theme.ts`) keeps an in-memory `loadedFonts` set that starts empty, so on first theme application it injects a second stylesheet for the same two families at weights 400;500;600;700;800 (**Confirmed** from code; the URL returns 200). Extra request and possibly extra font files for weights not in the static link.
- If the admin selects any of the other 12 `FONT_OPTIONS`, those load only after React starts, causing a visible font swap (**Inferred**).

## 5. Images and media

- **Media library upload** (`src/admin/pages/Media.tsx` `optimise()`): PNG/JPEG/WebP larger than 2000px on either side **or** ≥600,000 bytes are drawn to a canvas scaled to fit 2000px and re-encoded as WebP quality 0.85; the result is kept only if smaller. Uploads go to Supabase Storage with `cacheControl: '31536000'`. Files over 50 MB are rejected.
- **Other upload paths** — `ImageField` in `src/admin/fields.tsx` and document uploads in `src/admin/uploads.tsx` — call `store.uploadMedia()` directly **without** `optimise()` (**Confirmed**), so images uploaded from a field (e.g. cover, logo, mentor photo) are stored as-is.
- Rendering: content images `loading="lazy" decoding="async"`; blog covers `loading="lazy"`; landing hero image and testimonial photos are not lazy; no `srcset`/`sizes`/width-height attributes (**Confirmed**), so CLS from images is possible (**Inferred**).
- Illustrations are inline SVG React components (no network requests; they cost JS instead — 30.6 KB minified for `illustrationLibrary.tsx`).
- Iframes (PDF, Office viewer, YouTube-nocookie, Vimeo) use `loading="lazy"`.

## 6. Rendering and runtime costs

### Learner app
| Area | Behaviour | File |
|---|---|---|
| Route transitions | `motion.main` is keyed by `location.pathname`, so the whole page subtree remounts on every navigation (intentional for the fade) | `AppShell.tsx` |
| Home vs other routes | `/` renders `<AppShell>` inside `Dashboard`, other routes use the layout-route `AppShell`; moving between `/` and other pages remounts the shell, including `SearchPalette` (**Inferred** from `App.tsx` route structure) | `App.tsx`, `Dashboard.tsx` |
| Search index | `SearchPalette` is always mounted and builds `buildIndex(content)` in `useMemo` on mount; each query runs `plain()` (markdown strip) over every item's description on every keystroke | `Search.tsx` |
| `studentView(raw)` | recomputed whenever raw content changes | `content.tsx` |
| Scroll spy | IntersectionObserver for lesson sections | `Lesson.tsx` |

### Admin
| Area | Behaviour | Measured cost (Node, M2, seed-sized content) |
|---|---|---|
| Every committed edit | `update()` does `structuredClone(prev)` of the **entire** draft (≈756 KB JSON-equivalent). Text inputs debounce commits by 350 ms (`useCommitted` in `fields.tsx`) | structuredClone ≈1.7 ms |
| Change tracking | `diffSections()` runs `JSON.stringify` on each of 16 sections for draft **and** published on every draft change (inside `useMemo`) | ≈2.5 ms |
| Preview | `writePreview()` stringifies the full draft to localStorage 250 ms after each change; the preview tab re-parses it on `storage` events | JSON.stringify ≈1.2 ms (+ localStorage write, Unknown) |
| Autosave | full draft upserted to Supabase 1.2 s after the last change | network, Unknown |
| Media page | `JSON.stringify(draft) + JSON.stringify(published)` on **every render** to detect usage | ≈2.5 ms per render |
| Slide editor rail | every block of the lesson is rendered twice (thumbnail at `scale(0.24)` + canvas); thumbnails are `inert`, with interactive widgets replaced by a static callout via `PrintMode` | `SlideEditor.tsx` |
| Slide editor keys | global `keydown` listener re-registered on every render (effect without dependency array) | `SlideEditor.tsx` |

Mobile/low-end CPUs are typically several times slower than an M2, so admin edits may reach tens of milliseconds (**Inferred**, not measured).

## 7. Animation performance

- `backdrop-filter: blur()` is used on the sticky topbar, sidebar, fixed bottom nav, lesson step bar, onboarding continue bar and HeroVisual cards (`.glass`, `global.css`). Blur on large fixed/sticky layers is GPU-expensive on low-end mobiles during scroll (**Inferred**).
- `HeroVisual` (Landing) runs three **infinite** 5 s drift animations on glass (blurred) cards; the selected onboarding `LevelIllustration` runs infinite 3.2 s loops. Both stop under reduced motion.
- Motion animations are mostly transform/opacity (compositor-friendly). Exceptions: `Promo` bar animates `height: auto`; `widgets.tsx` uses `layout` animations on many elements; toasts use `layout`.
- `Reveal` uses one IntersectionObserver per wrapped element (`whileInView`, `once: true`).
- `.canvas-bg` uses `background-attachment: fixed`, which can force full repaints on scroll in some mobile browsers (**Inferred**).

## 8. Supabase calls

| Call | Where | Volume |
|---|---|---|
| `site_content` published (full JSON) | every visit (`ContentProvider`) | 1 request, whole site |
| `site_content` draft + published | admin load (`AdminProvider`) | 2 requests, whole site each |
| `listMedia()` | admin Media page and image picker (`fields.tsx`) | **7 parallel Storage `list` calls** (documents, general, thumbnails, illustrations, profiles, courses, brand), up to 500 objects each |
| `listEvents(1000)` | admin Dashboard | up to 1,000 event rows, with `listLearners()` and `listSubmissions()` in parallel |
| `listVersions()` | admin history | `limit(30)` |
| `saveDraft` | admin autosave (1.2 s debounce) | full draft per save |
| `track()` | e.g. booking link click | 1 insert |

`@supabase/realtime-js` + `phoenix` (≈55 KB minified) are bundled although no realtime channel is used (**Inferred**: no `.channel(` / `subscribe` found in `src/data`).

## 9. Mobile concerns (summary)

1. ≈247 KB gzip JS to parse before anything renders, plus the seed chunk in production (≈491 KB total, §3).
2. Full-screen spinner until the Supabase content fetch completes — no skeleton, no cached content.
3. Render-blocking Google Fonts CSS + duplicate font stylesheet.
4. Blur-heavy sticky/fixed layers and fixed-attachment dot grid during scroll.
5. No image `srcset`; field-uploaded images are not optimised.

## 10. Practical improvements (prioritised)

| # | Change | Expected effect | Effort |
|---|---|---|---|
| 1 | **Republish content once from the admin** so the published document contains `promos`, `blog`, `reviews` | Stops the 244 KB gzip seed download on every production visit (§3) | Minutes |
| 2 | Cache the last published content in localStorage (stale-while-revalidate) and render immediately | Removes the spinner on repeat visits | Small |
| 3 | Seed `loadedFonts` with the fonts already in `index.html` (or skip `ensureFonts` when they match); load fonts with `rel="preload"`/`media="print" onload` pattern or self-host | Removes duplicate request; fonts stop blocking render | Small |
| 4 | Split pages with `React.lazy` per route (Career, Account, Print, Blog, Challenges, Progress) and move `illustrationLibrary`/`widgets` into lazy chunks | Main chunk shrinks by a large part of the 198 KB app code | Medium |
| 5 | Lazy-load Supabase auth/storage only where needed (learners only need the REST read); or use `postgrest-js` directly for the public read | Up to ≈200 KB minified less on first load | Medium |
| 6 | Split content storage: store lessons/guides/blog as separate rows or files and fetch per page instead of the whole site JSON | Much smaller first payload | Large |
| 7 | Apply `optimise()` in `ImageField` uploads too; add `width`/`height` (or `aspect-ratio`) to content images | Smaller images, less CLS | Small |
| 8 | Admin: replace full `structuredClone` + stringify diffs with structural sharing (immer-style) and per-section dirty flags; memoise Media usage JSON | Faster edits on slow devices | Medium |
| 9 | Reduce `backdrop-filter` on mobile (`@media (max-width: 720px)` solid glass) and drop `background-attachment: fixed` on touch devices | Smoother scrolling | Small |
| 10 | Precompute search index text (`plain()` once) | Cheaper keystrokes | Small |
| 11 | Run Lighthouse / WebPageTest on the live site and record LCP/INP/CLS | Replace **Unknown** field metrics with data | Small |

## Unknowns

- Real LCP / INP / CLS / TTI on mobile and desktop (no Lighthouse run).
- Transfer size and compression of the live `site_content` response (not fetched for this document).
- Supabase response latency and Storage/CDN cache behaviour for media.
- Font file bytes actually downloaded per visit.
