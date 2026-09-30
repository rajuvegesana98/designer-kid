# Operations — hosting, database, accounts, costs

## Where things live
| Thing | Value |
|---|---|
| Live site | https://rajuvegesana98.github.io/designer-kid/ |
| Admin | https://rajuvegesana98.github.io/designer-kid/admin |
| Code | https://github.com/rajuvegesana98/designer-kid (branch `main`) |
| Deploy | GitHub Actions → Pages (`.github/workflows/deploy.yml`) on every push to `main` |
| Supabase project | `zcxnlelzhkwbvittgcuj` → https://zcxnlelzhkwbvittgcuj.supabase.co |
| Supabase dashboard | https://supabase.com/dashboard/project/zcxnlelzhkwbvittgcuj |
| Publishable key | `<publishable key — see .env.local or Supabase → Project Settings → API Keys>` (browser-safe; already public in the built JS) |
| Admin account | the owner's email (see Supabase → Authentication → Users; row in `public.admins`) |
| GitHub account | rajuvegesana98 |
| Older, unused Supabase project | `ywbiyutmrwmjnbllyzxd` (fully set up earlier; can be deleted) |

Never put a Supabase **secret / service_role** key in this app or in GitHub variables.

## Environment variables
`.env.local` (not committed — copy from `.env.example`):
```
VITE_SUPABASE_URL=https://zcxnlelzhkwbvittgcuj.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable key — see .env.local or Supabase → Project Settings → API Keys>
MOTION_STUDIO_AGENT_PROVIDER=claude
```
GitHub → Settings → Secrets and variables → Actions → **Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
The workflow sets `BASE_PATH=/designer-kid/` automatically.

## Supabase setup (fresh project)
1. SQL Editor → run `supabase/schema.sql` (idempotent; includes migrations 002, 003 and 004 at the end).
2. Authentication → URL Configuration: Site URL `https://rajuvegesana98.github.io/designer-kid/`;
   Redirect URLs `https://rajuvegesana98.github.io/designer-kid/**` and `http://localhost:5173/**` (Vite default dev port; add any other port you use).
3. Create the admin login (Authentication → Users → Add user, or sign in on `/account` if sign-up is
   enabled), then: `insert into public.admins (user_id) select id from auth.users where email = '…';`
4. Open `/admin` → Publish once (stores the starter content in the database).
5. Optional: Authentication → Sign In / Providers → disable "Allow new users to sign up" (learners don't need
   accounts; admins can be added from the dashboard).

### Migrations
| File | Purpose | Status at hand-off |
|---|---|---|
| `schema.sql` (base) | tables, RLS, publish RPC, storage, reviews | ✅ run |
| `migrations/002_user_management.sql` | `profiles.blocked`, admin profile updates, admin list management, suspended users can't post | ⏳ owner to run |
| `migrations/003_open_learning.sql` | anyone can submit a review (still moderated); adds Blog to the published menu | ⏳ owner to run |
| `migrations/004_hardening.sql` | rate limits for events/reviews, no event impersonation, draft-only content writes, no deletes | ⏳ owner to run (after 003) |

Check from a terminal (anonymous key):
```bash
K=<publishable key>; U=https://zcxnlelzhkwbvittgcuj.supabase.co
curl -s "$U/rest/v1/profiles?select=blocked&limit=1" -H "apikey: $K" -H "Authorization: Bearer $K"   # 200 once 002 ran
```

## Database tables
| Table | Purpose | Access |
|---|---|---|
| `admins` | who is an admin | admins read/manage (can't remove self) |
| `profiles` | one row per auth user (name, email, level, `state` JSON, blocked) | own row / admins |
| `site_content` | `draft` and `published` JSON documents | public reads published; admins write draft |
| `content_history` | versions created by `publish_content()` | admins |
| `events` | anonymous analytics (level_selected, lesson_completed, challenge_submitted, booking_clicked, …) | anyone inserts; admins read |
| `submissions` | challenge submissions from signed-in users | own / admins |
| `reviews` | reviews; trigger forces `pending` when approval is required | public reads approved; anyone inserts (after 003); admins moderate |
| storage `media` bucket | images, PDFs, slides | public read; admins write |

## Costs (checked 30 Sep 2026 on supabase.com/pricing)
| Service | Free tier | Paid |
|---|---|---|
| GitHub Pages | free for public repos | — |
| Supabase | 50,000 monthly active users, 500 MB database, 1 GB file storage, 5 GB egress, 2 projects; **paused after 1 week of inactivity**; built-in auth email ≈ **2 emails/hour** | Pro from **$25/month** (100k MAU, 8 GB DB, 100 GB storage, 250 GB egress, no pausing, daily backups) |
| Email (only needed for admin password resets now) | Resend free tier via Supabase custom SMTP | — |
| Domain (optional) | — | ~$10–15/year; GitHub Pages supports custom domains free |

Because learners have no accounts, Supabase usage is tiny: public reads of one content document, anonymous
events, reviews and media. The free tier is enough until uploads approach 1 GB or you need no-pausing.

## Deploying code changes
```bash
npm run build                    # must pass (typecheck + postbuild checks)
git add -A && git commit -m "…"
gh auth switch -h github.com -u rajuvegesana98   # if another GitHub account is active
git push origin main             # Actions builds and deploys in ~1–2 minutes
gh run list --repo rajuvegesana98/designer-kid --limit 1
```
Content changes need **no deploy** — publish them in the admin.

## Motion Studio (dev only)
Installed as `motion-studio` dev dependency, wired in `vite.config.ts` (`motionStudio()` only for `vite serve`,
skip with `MOTION_STUDIO=off`). Inspect/edit is free; saving to source/agent edits need a Motion Studio
subscription and `npm i -D @anthropic-ai/claude-agent-sdk` for the Claude provider. `scripts/postbuild.mjs`
fails any build that contains Studio code.
