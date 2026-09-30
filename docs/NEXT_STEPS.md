# Open items, limitations and next steps

## Owner actions pending at hand-off
1. Run `supabase/migrations/002_user_management.sql` then `003_open_learning.sql` in the Supabase SQL editor
   (project `zcxnlelzhkwbvittgcuj`). Until 003 runs, anonymous visitors' reviews are rejected by the database
   and the Blog isn't in the published menu (Admin → Blog also offers a one-click "Add Blog to the menu").
2. Admin → 1:1 Connect: add the booking link and photo. Theme: logo/favicon. Website → Footer: email/LinkedIn.
   Then **Publish**.
3. Supabase → Authentication → URL Configuration (Site URL + redirect URLs) — needed for admin password resets.
4. Optional: disable public sign-ups in Supabase (learners don't need accounts).

## Known limitations
- Learner progress is per browser (by design). Clearing site data loses it unless the learner downloaded a backup.
- Admin analytics are anonymous event counts (starts, lesson completions), not unique people.
- Challenge submissions from learners stay in their browser (no accounts) — the admin "Submissions" tab only
  shows submissions from signed-in accounts.
- Uploaded PowerPoint files are attached/embedded, not converted into editable slides.
- "Download PDF" uses the browser's print dialog (choose "Save as PDF").
- Supabase free projects pause after ~1 week without traffic (first visit wakes it; or upgrade to Pro).
- The main JS bundle is ~190 KB gzipped (seed content is a separate lazy chunk); could be split further.
- Dormant code: learner sign-up and the Submissions/Users account features remain in the codebase (useful if
  accounts are ever re-enabled) but aren't linked in the learner UI.

## Good next improvements
- Custom domain (e.g. designerkid.in) on GitHub Pages.
- Optional sync code (e.g. "magic link" or share code) to move browser progress between devices without accounts.
- Certificates (PDF) when a learner completes a level — shareable on LinkedIn.
- Email notifications to the owner for new reviews/bookings (Supabase database webhook → email service).
- Install the UI/UX Pro Max skill (`/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill`,
  `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill`) and run a design review.
- More widgets (e.g. colour-blindness simulator, tap-target checker) and more illustrated examples in lessons.
