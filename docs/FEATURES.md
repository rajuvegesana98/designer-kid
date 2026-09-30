# Features

## For learners (no account needed)
| Area | What it does | Where |
|---|---|---|
| Landing | Hero, three learning paths, features, reviews, **1:1 Connect panel**, latest blog posts, FAQ, active offer | `/` (first visit), `/welcome` |
| Onboarding | "Where are you in your design journey?" — 3 animated level cards, optional name | `/start` |
| Dashboard | Welcome, **Continue learning** card, progress (overall, lessons, modules, projects, streak, achievements), roadmap strip, up next, a challenge, Career Centre progress, 1:1 panel, **From the blog** | `/` after onboarding |
| Learn | Level roadmap (courses → modules), everything open, suggested-order hints, module PDF workbooks | `/learn/:level`, `/learn/:level/:module` |
| Lesson | Cover illustration, Learn → Example → Practice → Challenge, interactive widgets, quizzes, Q&A, do/don't, downloads, **Download PDF**, bookmark, private notes, mark complete → next | `/lesson/:id` |
| Challenges | 21 briefs (7 categories × 3 levels), filters, submission (link + notes), self-review checklist | `/challenges` |
| Career Centre | Resume, LinkedIn, Portfolio, Job Search, Interviews, Networking; level-specific guides, checklists, bullet builder, headline builder, case-study template, interview Q&A | `/career`, `/career/:section` |
| Blog | 12 articles, featured post, tags, search, share, PDF | `/blog`, `/blog/:slug` |
| Resources | 28 curated links filtered by level/type | `/resources` |
| Reviews | Read approved reviews, write one (anyone; admin approves) | `/reviews` |
| My Progress | Overview, 12-week activity, module progress, achievements, bookmarks, notes | `/progress` |
| Profile | Name, level switch, appearance (light/dark/system), **download/restore progress backup**, reset | `/profile` |
| Search | ⌘K / Ctrl+K / "/" palette across lessons, modules, challenges, resources, guides, articles | anywhere |
| Notifications | Announcements, new lessons/challenges, course completion (admin-configurable) | bell icon |
| Offers | Banner or pop-up shown on landing (scheduled, targeted, dismissible) | global |
| PDF | Print-ready versions of lessons, module workbooks, guides and articles | `/print/...` |

## For the admin (`/admin`)
| Page | Capabilities |
|---|---|
| Dashboard | Attention items (unpublished changes, missing booking link, pending reviews), activity stats, recent activity, content summary |
| Analytics | Lessons completed per day (chart/table), learners by level, module funnel, top lessons/challenges |
| Courses | Level tabs, course/module tree (drag to reorder), module editor, **slide editor for lessons** (inline editing, 15 block types, undo/redo, attachments, covers, preview, PDF), publish/unpublish, duplicate, move, delete |
| Blog | Article list (search/filter), slide editor, cover photo/illustration, slug, author, date, tags, featured, publish |
| Challenges | Create/edit/delete, level, category, difficulty, time, requirements, constraints, checklist |
| Content library | Resources (drag order), career guides (slide editor), announcements + notification settings |
| Levels | Enable/disable, rename, headline, description, icon, colour (contrast check), recommended path, suggest-order |
| Media | Upload images/PDF/PPT (auto-resize images), folders, preview, metadata, in-use status, replace, delete |
| Users | Accounts list (admins/staff), search/filter/CSV, edit name/level, suspend, reset progress, send password reset, grant/remove admin |
| 1:1 Connect | Booking URL (Calendly/Cal.com/Topmate), button label, mentor name/role/bio/photo/topics, booking click log |
| Reviews | Pending/Approved/Hidden queues, approve, hide, feature, reply, delete; settings (allow, approval, show on home, texts) |
| Offers & banners | Create/duplicate/delete offers, bar or pop-up, colour, image/illustration, CTA, schedule, audience, pages, remember-dismissal, live preview |
| Website | Homepage (hero, CTAs, image, features, stats, testimonials, FAQ), navigation (order/rename/hide/add), footer |
| Theme | Brand name/tagline/logo/favicon with preview, 6 quick themes, light & dark colours with contrast checks, fonts (14), sizes, weights, radii, shadows, borders, default mode, live preview |
| Publishing | Changed sections, version history + restore, JSON backup download/import |
| Settings | Connection status, where-to-change-what map |

Publishing model: every admin edit autosaves to a **draft**; **Preview** shows the draft on the real site
(live-updating); **Publish** makes it live for everyone and stores a version you can restore.

## Content included
- 182 lessons (Beginner 79 · Intermediate 62 · Expert 41), each Learn/Example/Practice/Challenge
- 21 challenges · 28 resources · 27 career guides (incl. interview Q&A, LinkedIn do's & don'ts, resume creation)
- 12 blog articles · 15 achievements · 28 themed illustrations · 7 interactive widgets
