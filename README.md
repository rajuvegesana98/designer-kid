# Designer Kid

**Learn. Design. Build. Grow.** A UI/UX learning and career platform with three learner levels (Beginner, Intermediate and Expert). It includes a Career Centre, design challenges, a 1:1 booking link and an admin studio for managing everything.

- **Stack:** Vite, React 19, TypeScript, Motion, React Router and lucide icons
- **Data:** Supabase (free tier) for accounts, progress, content, analytics and media. Without Supabase the app runs in *browser-only mode*.
- **Hosting:** GitHub Pages through GitHub Actions (free)

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173 with the Motion Studio panel
MOTION_STUDIO=off npm run dev   # same, without Motion Studio
npm run build        # production build and checks
```

Node 22.13 or newer is required, because Motion Studio needs it.

## Connect Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste [`supabase/schema.sql`](supabase/schema.sql) and click **Run**. This creates the tables, row-level security policies and the `media` storage bucket.
3. Under **Project Settings → API**, copy the **Project URL** and the **publishable key** (`sb_publishable_…`) into `.env.local`:
   ```
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_...
   ```
   The publishable key is safe in the browser. **Never** put the secret or `service_role` key in this app.
4. Under **Authentication → URL Configuration**, set **Site URL** to your live site, e.g. `https://<user>.github.io/designer-kid/`, and add `http://localhost:5173` to the redirect URLs.
5. Sign up on the site with your own email, then make yourself admin in the SQL editor:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
   ```
6. Open `/admin`. On your first **Publish**, the bundled starter content is saved to Supabase.

## Deploy to GitHub Pages (free plan)

1. Push this folder to a GitHub repository. On the free plan, Pages requires a **public** repository.
2. Go to **Settings → Pages → Source** and choose **GitHub Actions**.
3. Go to **Settings → Secrets and variables → Actions → Variables** and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Push to `main`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the site and deploys it using GitHub's official Pages actions.

Deep links work because the build copies `index.html` to `404.html`.

## How content works

All student-facing content is one document, `SiteContent` ([`src/content/types.ts`](src/content/types.ts)):

```
Level → Course → Module → Lesson (Learn → Example → Practice → Challenge)
Challenges · Resources · Career guides · Announcements · Achievements
Brand · Theme · Homepage · Navigation · Footer · 1:1 mentor settings
```

- The starter content lives in [`src/content/seed/`](src/content/seed). It's loaded only when nothing has been published yet.
- The admin panel edits a **draft**. The draft autosaves, **Preview** opens the student site with the draft applied and updates live, and **Publish** makes it live and stores a version. **Publishing → Restore** loads any older version back into the draft.
- Individual lessons, modules, courses, challenges, resources, guides and announcements each have a **Published** toggle for unpublishing.

## Architecture

```
src/
  content/       types + starter content
  data/          DataStore interface; supabaseStore.ts and localStore.ts implementations
  state/         React contexts: content (+ preview), auth, learner progress, theme & toasts
  lib/           progress rules, content queries, theme engine, safe markdown, icons
  components/    app shell, lesson blocks, interactive widgets, search, notifications, UI kit
  pages/         student pages
  admin/         admin studio (lazy-loaded; students never download it)
supabase/schema.sql
```

To use a different backend, implement `DataStore` in `src/data/` and switch it in `src/data/index.ts`.

## Editing content like slides

In **Admin → Courses**, open any lesson; career guides work the same way under **Content library → Career guides**. You'll see a PowerPoint-style editor:

- **Slide rail (left):** every block is a slide. Click to select it, drag to reorder, or use ⌥↑/⌥↓. ⌘D duplicates a slide, Delete removes it, and ⌘Z / ⇧⌘Z undo and redo.
- **Canvas (centre):** exactly what students see. Click any text to edit it in place.
- **Format panel (right):** every option for the selected slide, including the cover illustration, the 28 themed illustrations, and uploading PDF or PowerPoint files.
- **Ribbon:** insert text, callouts, do/don't, Q&A, quizzes, illustrations, images, PDF/PPT, video and widgets, then preview or open the PDF.

Uploaded PDFs preview inside the lesson. PowerPoint files preview once Supabase is connected, because the preview needs a public link; students can always download the original file. Uploaded decks are shown and downloadable, **not** converted into editable slides.

**Downloads for students:** every lesson, module and career guide has **Download PDF**. It opens a print-ready version with the same illustrations; choose "Save as PDF" in the print dialog.

All content is always open: nothing is locked. **Levels → Suggest an order** only shows a gentle hint.

## Reviews

Learners write reviews at `/reviews`. With Supabase connected they must be signed in. Moderate them in **Admin → Reviews**: approve, hide, feature on the homepage, reply or delete. Moderation takes effect immediately. When "Approve before showing" is on, the database itself keeps new reviews pending, so browsers can't bypass it. Re-run `supabase/schema.sql` to add the reviews table.

## 1:1 sessions

Students book through your own scheduling tool, such as Calendly, Cal.com or Topmate. Paste its link under **Admin → 1:1 Connect**. Until a link is set, every "Connect 1:1" button stays hidden. Session length, availability, approvals and rescheduling are managed in that tool. Designer Kid records booking-page clicks for analytics.

## Motion Studio

`motion-studio` is installed as a dev dependency and wired into `vite.config.ts`. It is active only in `npm run dev`, and `scripts/postbuild.mjs` fails the build if any Studio code reaches `dist/`. Inspecting and editing on the timeline is free. Agent edits and saving to source need a Motion Studio subscription. To use Claude as the agent provider, run `npm i -D @anthropic-ai/claude-agent-sdk` and keep `MOTION_STUDIO_AGENT_PROVIDER=claude` in `.env.local`.

## Accessibility & motion

- Semantic landmarks, a skip link, visible focus rings and focus-trapped dialogs
- Radio or tab keyboard patterns for choices, and labelled form fields
- Touch targets of at least 44px on touch devices
- Colours checked to WCAG AA contrast. The theme editor shows live contrast checks.
- All Motion animations follow the OS *reduce motion* setting (`MotionConfig reducedMotion="user"`), and CSS transitions are disabled too.
