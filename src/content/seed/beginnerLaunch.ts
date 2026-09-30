import type { Course } from '../types'

const ADDED = '2026-09-01'

export const beginnerLaunch: Course = {
  id: 'b-launch',
  title: 'Build & Launch',
  description:
    "Turn what you've learned into four real projects, shape them into honest case studies, and take your first confident steps towards a junior design role.",
  published: true,
  modules: [
    // ───────────────────────────────────────────────────────────── Projects
    {
      id: 'b-m5-projects',
      title: 'Projects',
      stage: 'Projects',
      summary:
        'Four guided projects that take you from a blank Figma file to finished, portfolio-ready screens.',
      outcome:
        'You will have four complete projects — onboarding, a mobile app, a responsive landing page and a dashboard — each with a clear problem and documented decisions.',
      kind: 'project',
      published: true,
      lessons: [
        {
          id: 'b5-login-onboarding',
          title: 'Project: Login & onboarding experience',
          summary:
            'Design sign-up, login and a short onboarding flow for a meal-planning app that gets new users to value quickly.',
          minutes: 120,
          difficulty: 'Medium',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "**The brief:** *Plateful* is a new meal-planning app. People download it after seeing a friend use it, but many never get past the sign-up screen. Your job is to design the sign-up, login and first-run onboarding so that a new user reaches their first weekly meal plan in under two minutes.\n\nOnboarding is the first real conversation a product has with someone. Every extra field, confusing screen or forced step is a moment where they can quietly give up.",
            },
            {
              type: 'text',
              body:
                "**Who you're designing for:** busy people — parents, shift workers, students — who want to stop asking 'what's for dinner?' every night. They are usually on their phone, often distracted, and will not read long explanations. Their problem is not 'I need an account'; it is 'I want a plan for this week without thinking too hard'.",
            },
            {
              type: 'list',
              items: [
                'Sign-up with email and password, plus at least one social sign-in option (e.g. Apple or Google).',
                'Login screen with a clear “Forgot password?” route.',
                "3–4 onboarding screens that collect only what's needed to build a first plan (e.g. household size, dietary needs, cooking time).",
                'A way to skip onboarding and still reach the app.',
                'Error states: wrong password, email already in use, weak password.',
                'A final “your first plan is ready” screen that shows value immediately.',
              ],
            },
            {
              type: 'callout',
              tone: 'why',
              title: 'Why ask less?',
              body:
                "Each question you ask up front costs the user effort before they've seen any benefit. Ask only what changes the first plan; everything else (like favourite cuisines) can be collected later, once they trust the app.",
            },
            {
              type: 'checklist',
              title: 'A good result includes',
              items: [
                'Every screen has one clear primary action.',
                'Form fields have visible labels (not just placeholder text).',
                'Error messages explain what went wrong and how to fix it.',
                'A progress indicator on onboarding so users know how many steps remain.',
                'A skip option that does not punish the user.',
                'Consistent spacing, type and button styles across all screens.',
              ],
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Rewriting a sign-up error',
              body:
                'Error messages are part of the design. A good one says what happened and what to do next, in plain words, right next to the field that caused it.',
              before: "Red banner at the top: 'Error 409: invalid request'",
              after:
                "Under the email field: 'This email already has an account. Log in instead?' with 'Log in' as a link",
            },
          ],
          practice: {
            task:
              'Design the full Plateful sign-up, login and onboarding flow as mobile screens in Figma (390 × 844 frames work well).',
            steps: [
              'Milestone 1 — Map the flow on paper: app opens → sign up or log in → onboarding questions → first plan. Mark where errors and the skip option happen.',
              'Milestone 2 — Wireframe every screen in greyscale, focusing on order and content rather than colour.',
              'Milestone 3 — Design the high-fidelity screens, including the three error states and the empty/loading state for the first plan.',
              'Milestone 4 — Connect the screens into a clickable prototype and test it with one friend; note where they hesitate.',
              'Milestone 5 — Fix the biggest issue you saw and write three sentences on what you changed and why.',
            ],
            deliverable:
              'A Figma file with a linked prototype of 8–12 screens plus a short note explaining your key decisions.',
          },
          challenge: {
            task:
              "Stretch goal: design a 'returning user' flow — someone who signed up weeks ago, forgot their password and hasn't opened the app since.",
            successCriteria: [
              'Password reset works end to end, including the email and the new-password screen.',
              'The welcome-back screen reminds them of their last plan rather than restarting onboarding.',
              'All copy is friendly and blame-free.',
              'The flow uses the same components as your main project.',
            ],
          },
        },
        {
          id: 'b5-mobile-app',
          title: 'Project: Habit tracker mobile app',
          summary:
            'Design the core screens of a simple habit tracker that helps people build small daily routines without feeling guilty.',
          minutes: 180,
          difficulty: 'Medium',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "**The brief:** *Tiny Steps* is a habit tracker for people who have tried habit apps before and given up. Design the core experience: creating a habit, checking it off each day, and seeing progress over a week.\n\nMany habit apps lean heavily on streaks. Streaks can motivate, but losing a 40-day streak because of one busy day often makes people delete the app. Your design should encourage consistency without shame.",
            },
            {
              type: 'text',
              body:
                "**Who you're designing for:** someone who wants to drink more water, read ten pages a day or stretch each morning. They open the app for a few seconds at a time, usually one-handed. The key moment is the daily check-in — it must take one tap.",
            },
            {
              type: 'list',
              items: [
                "Today screen: the day's habits, each checkable with a single tap.",
                'Create-habit flow: name, how often (daily or chosen days), optional reminder time.',
                'Habit detail screen: a simple week or month view of progress.',
                'Empty state for a brand-new user with no habits yet.',
                'A gentle way to handle a missed day (no alarming red crosses).',
                'Bottom navigation with no more than 4 destinations.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              title: 'Design for the thumb',
              body:
                'Put the most frequent action — checking off a habit — within easy reach at the bottom half of the screen, and make tap targets at least 44 × 44 points. Apple and Google both recommend generous touch targets for this reason.',
            },
            {
              type: 'checklist',
              title: 'A good result includes',
              items: [
                'Checking off a habit takes one tap and gives clear visual feedback.',
                'The empty state tells a new user exactly what to do first.',
                'Progress is shown kindly — missed days are neutral, not punishing.',
                'Text and icons meet contrast guidelines.',
                'Components (habit card, buttons, inputs) are reused, not redrawn on each screen.',
              ],
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Reframing a missed day',
              body:
                "How you show failure shapes how people feel about the product. A small wording and visual change can keep someone coming back instead of giving up.",
              before: "Red cross on the calendar and the message 'Streak lost! 0 days'",
              after:
                "Grey dot for the missed day and the message 'You've done this 5 of the last 7 days — nice work'",
            },
          ],
          practice: {
            task: 'Design the Tiny Steps core screens in Figma as a mobile app, using a small set of reusable components.',
            steps: [
              'Milestone 1 — Write a one-paragraph persona and list the three things they do most often in the app.',
              'Milestone 2 — Sketch the Today, Create habit, Habit detail and empty-state screens on paper.',
              'Milestone 3 — Build a habit card component with checked and unchecked variants, then design all screens in high fidelity.',
              'Milestone 4 — Prototype the flow: empty state → create first habit → check it off → view progress.',
              'Milestone 5 — Ask one person to add a habit and check it off without help; record what confused them and fix it.',
            ],
            deliverable:
              'A Figma file with at least 6 screens, a habit card component with variants, and a clickable prototype of the main flow.',
          },
          challenge: {
            task:
              'Stretch goal: design a home-screen widget (iOS or Android) that lets people check off a habit without opening the app.',
            successCriteria: [
              'The widget works at a small size and shows no more than 3 habits.',
              'Checked and unchecked states are clearly different without relying on colour alone.',
              'It uses the same visual style as the app.',
              'You explain in two sentences why a widget helps this user.',
            ],
          },
        },
        {
          id: 'b5-responsive-landing',
          title: 'Project: Responsive landing page',
          summary:
            'Design a landing page for a local bike-repair service that works beautifully on mobile, tablet and desktop.',
          minutes: 150,
          difficulty: 'Medium',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "**The brief:** *Spoke & Chain* is a small bike-repair shop that now offers collection and delivery. They need a landing page that explains the service and gets people to book a repair. Most visitors arrive from a phone after searching 'bike repair near me'.\n\nA landing page has one job. Every section should either build trust or move the visitor towards that single action: **Book a repair**.",
            },
            {
              type: 'text',
              body:
                "**Who you're designing for:** commuters whose bike has broken and who need it fixed quickly, and casual riders who want a service before summer. They want to know three things fast: what you fix, how much it roughly costs, and how soon they can have their bike back.",
            },
            {
              type: 'list',
              items: [
                'Hero section with a clear headline, one-line explanation and a “Book a repair” button.',
                'How it works: 3 simple steps (book, we collect, we return).',
                'Services and starting prices.',
                'Trust section: opening hours, area covered, and a placeholder for real customer reviews (do not invent quotes).',
                'FAQ and a footer with contact details.',
                'Three layouts: mobile (~390px), tablet (~768px) and desktop (~1440px).',
              ],
            },
            {
              type: 'interactive',
              widget: 'grid-playground',
              caption: 'Try switching column counts to see how a 4-column mobile grid relates to a 12-column desktop grid.',
            },
            {
              type: 'checklist',
              title: 'A good result includes',
              items: [
                'The main button is visible without scrolling on mobile.',
                'Content order makes sense when columns stack on small screens.',
                'Layouts sit on a consistent grid at each breakpoint.',
                'Type scales down sensibly — headlines don’t wrap into five lines on mobile.',
                'Placeholder content is clearly marked, not presented as real reviews.',
              ],
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Sharpening the hero headline',
              body:
                'A vague headline makes visitors work out what you do. A specific one answers their question in a single glance.',
              before: "Headline: 'Your cycling journey starts here'",
              after:
                "Headline: 'Bike repairs, collected from your door' with subtext 'Most repairs back with you in 48 hours'",
            },
          ],
          practice: {
            task: 'Design the Spoke & Chain landing page at mobile, tablet and desktop widths in Figma.',
            steps: [
              'Milestone 1 — Write the page content first in a doc: headline, sections and button labels.',
              'Milestone 2 — Set up layout grids for each breakpoint (e.g. 4, 8 and 12 columns).',
              'Milestone 3 — Design the mobile version first, then expand to tablet and desktop.',
              'Milestone 4 — Use Auto Layout for sections so they resize cleanly between widths.',
              'Milestone 5 — Compare all three side by side and fix anything that feels inconsistent.',
            ],
            deliverable:
              'Three Figma frames (mobile, tablet, desktop) of the full landing page, built on visible layout grids.',
          },
          challenge: {
            task:
              'Stretch goal: design the booking form that opens from the “Book a repair” button, on both mobile and desktop.',
            successCriteria: [
              'The form asks for no more than 6 pieces of information.',
              'Date and time selection is easy on a phone.',
              'There is a clear confirmation screen that says what happens next.',
              'Error states are designed for at least two fields.',
            ],
          },
        },
        {
          id: 'b5-dashboard',
          title: 'Project: Dashboard',
          summary:
            'Design a simple dashboard that helps a small café owner see how the week is going at a glance.',
          minutes: 180,
          difficulty: 'Hard',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "**The brief:** *Corner Café* uses a simple ordering system. The owner wants a dashboard to check each morning: how yesterday went, what's selling, and whether any stock is running low. Design the main dashboard screen for desktop.\n\nDashboards are tempting to overfill. The hard part is not adding charts — it is deciding what the owner actually needs to *decide* each morning, and showing that first.",
            },
            {
              type: 'text',
              body:
                "**Who you're designing for:** a café owner who is not a data expert. They have about five minutes with a coffee before opening. Their questions are practical: 'Was yesterday good or bad?', 'What should I order more of?', 'Is anything about to run out?'",
            },
            {
              type: 'list',
              items: [
                'A row of 3–4 key numbers (e.g. sales yesterday, number of orders, average order value), each compared with the same day last week.',
                'A simple chart of sales across the past 7 days.',
                'A list of top-selling items.',
                'A low-stock alert area.',
                'Side or top navigation to other sections (Orders, Menu, Settings).',
                'Realistic but clearly made-up sample data — label it as sample data.',
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'Numbers need context',
              body:
                "'£842' on its own means little. '£842, up from £790 last Tuesday' tells the owner something. Always ask: compared with what?",
            },
            {
              type: 'checklist',
              title: 'A good result includes',
              items: [
                'The most important information is top-left, where people start reading.',
                'Charts have clear labels and only as much detail as needed.',
                'Colour is used for meaning (e.g. alerts), not decoration.',
                'Up/down changes are shown with icons or words as well as colour.',
                'A consistent card component and spacing system across the page.',
              ],
            },
          ],
          example: [
            {
              type: 'example',
              title: 'From data dump to decision',
              body:
                'A good dashboard turns raw data into something the user can act on today.',
              before: 'A table of 40 menu items with daily sales numbers for each',
              after:
                "A 'Running low' card: 'Oat milk — about 1 day left. Reorder?' with a button to open the supplier list",
            },
          ],
          practice: {
            task: 'Design the Corner Café desktop dashboard (1440px wide) in Figma, plus one empty state.',
            steps: [
              "Milestone 1 — List the owner's top three morning questions and match each to one part of the dashboard.",
              'Milestone 2 — Wireframe the layout in greyscale on a 12-column grid.',
              'Milestone 3 — Create a stat card component and a chart card, then build the high-fidelity dashboard.',
              "Milestone 4 — Design an empty state for a café's first day, when there is no data yet.",
              'Milestone 5 — Show it to someone for 10 seconds, then ask what they remember; adjust the hierarchy if they missed the key numbers.',
            ],
            deliverable:
              'A Figma file with the full dashboard, an empty state, and reusable stat and chart card components.',
          },
          challenge: {
            task: 'Stretch goal: design a mobile version of the dashboard for when the owner checks it on the bus.',
            successCriteria: [
              'Only the most important information appears first — not all desktop content squeezed in.',
              'The chart is readable at mobile width.',
              'Low-stock alerts are reachable in one tap.',
              'You explain what you removed or moved, and why.',
            ],
          },
        },
      ],
    },

    // ──────────────────────────────────────────────────────────── Portfolio
    {
      id: 'b-m6-portfolio',
      title: 'Portfolio',
      stage: 'Portfolio',
      summary:
        'Learn how to turn your projects into clear, honest case studies that show how you think, not just what you made.',
      outcome:
        'You will be able to write a beginner case study that walks a reader through the problem, your process, your decisions and your final design.',
      kind: 'lessons',
      published: true,
      lessons: [
        {
          id: 'b6-what-is-case-study',
          title: 'What is a case study?',
          summary: 'A case study is the story of how you solved a design problem — and it matters more than pretty screens.',
          minutes: 10,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "A **case study** is a short story about one project: what the problem was, what you did, why you did it, and what happened. It's the main thing in a design portfolio.\n\nMany beginners fill their portfolio with finished screens and nothing else. The problem is that anyone can copy a nice-looking screen. What a hiring manager really wants to know is *how you think* — and only a case study shows that.",
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'The problem — who it was for and what was going wrong.',
                'Your role and constraints — solo project? time limit? self-initiated?',
                'Process — research, sketches, wireframes, testing.',
                'Key decisions — the important choices and why you made them.',
                'Final design — the result, shown clearly.',
                'Reflection — what you learned and what you would do next.',
              ],
            },
            {
              type: 'callout',
              tone: 'why',
              title: 'Why reviewers read them this way',
              body:
                "Reviewers often have many portfolios to look through, so they skim first. A clear structure with headings lets them find the problem, your decisions and the outcome quickly — and then read more closely if it's interesting.",
            },
            {
              type: 'quiz',
              question: 'What is the main purpose of a case study?',
              options: [
                'To show as many screens as possible',
                'To show how you think and make decisions',
                'To prove you know every Figma feature',
                'To make the project look bigger than it was',
              ],
              answer: 1,
              explanation:
                'Screens show the output; a case study shows the thinking behind it, which is what employers are trying to judge.',
            },
          ],
          example: [
            {
              type: 'example',
              title: 'An honest opening',
              body: 'Your first lines should set the scene clearly and truthfully — including that it was a learning project.',
              before: "'Plateful — a revolutionary app that transformed meal planning.'",
              after:
                "'Plateful is a self-initiated project. I redesigned sign-up and onboarding for a meal-planning app so new users could reach their first plan faster.'",
            },
          ],
          practice: {
            task: 'Pick one project from the Projects module and outline its case study using the six-part structure.',
            steps: [
              'Create a doc with the six headings from this lesson.',
              'Under each heading, write 1–3 bullet points from memory.',
              'Note any gaps — for example, missing sketches or no testing notes.',
              'Mark which screenshots you will need for each section.',
            ],
            deliverable: 'A one-page case study outline with bullet points under all six headings.',
          },
          challenge: {
            task: 'Find two published designer case studies you admire and compare their structure to yours.',
            successCriteria: [
              'You note which of the six parts each one includes or skips.',
              'You list one thing each does well that you could adopt.',
              'You update your outline with at least one improvement.',
            ],
          },
        },
        {
          id: 'b6-documenting-decisions',
          title: 'Documenting design decisions',
          summary: 'Capture the why behind your choices while you work, so your case study writes itself later.',
          minutes: 12,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "A **design decision** is any moment where you chose one option over another: a bottom nav instead of a hamburger menu, three onboarding steps instead of five, a grey dot instead of a red cross.\n\nIf you wait until the project is finished to write your case study, you'll forget most of these. The fix is simple: keep a small decision log as you go.",
            },
            {
              type: 'list',
              items: [
                '**What** did I decide?',
                '**Why** — what problem, user need or constraint led to it?',
                '**What else** did I consider, and why not that?',
                '**How** will I know if it worked?',
              ],
            },
            {
              type: 'doDont',
              do: [
                'Link each decision to a user need or a finding.',
                'Mention the alternatives you rejected.',
                "Write it the same day, in plain words.",
              ],
              dont: [
                "Justify choices with 'it looks cleaner' alone.",
                'Invent reasons after the fact.',
                'Log every tiny pixel change — focus on meaningful choices.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              body:
                "A Figma page called 'Decisions' or a simple doc works fine. Screenshot the options side by side next to each entry — those images become ready-made visuals for your case study.",
            },
          ],
          example: [
            {
              type: 'example',
              title: 'A decision log entry',
              body: 'Notice how the improved version gives a reason and an alternative, so a reader can follow your thinking.',
              before: "'Changed nav to bottom tabs.'",
              after:
                "'Moved from a hamburger menu to bottom tabs because users check habits one-handed. Considered a floating button but it hid the list. Will check: can a tester find Progress without help?'",
            },
          ],
          practice: {
            task: 'Write a decision log for one of your projects with at least four entries.',
            steps: [
              'Open your project and find four places where you chose between options.',
              'For each, answer the four questions: what, why, what else, how to check.',
              'Add a screenshot of the options next to each entry.',
              'Highlight the one decision you think matters most.',
            ],
            deliverable: 'A decision log with four entries, each with reasoning and a visual.',
          },
          challenge: {
            task: 'Turn your most important decision into a short case-study section of around 120 words.',
            successCriteria: [
              'It states the problem before the solution.',
              'It shows at least one rejected alternative.',
              'It includes a before/after or option A/B visual.',
              'A friend can explain your reasoning back to you after reading it.',
            ],
          },
        },
        {
          id: 'b6-showing-process',
          title: 'Showing your process',
          summary: 'Show the messy middle — sketches, wrong turns and changes — without overwhelming the reader.',
          minutes: 12,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "Your process is the path from problem to solution. Showing it proves the final design didn't appear by luck.\n\nBut process isn't a diary. A common beginner mistake is the 'process wall' — a long chart of Empathise → Define → Ideate → Prototype → Test with no real content in each step. That tells the reader you know a diagram, not that you can design.",
            },
            {
              type: 'callout',
              tone: 'why',
              title: 'Curate, don’t collect',
              body:
                "Only include process work that moved the project forward. A rough sketch that led to a better idea is valuable. Ten near-identical wireframes are not. Every image should answer: 'what did I learn here?'",
            },
            {
              type: 'doDont',
              do: [
                'Show real artefacts: photos of sketches, early wireframes, sticky notes.',
                'Add a one-line caption to each explaining what it taught you.',
                'Include a wrong turn and what made you change direction.',
              ],
              dont: [
                'Use a generic process diagram as a substitute for real work.',
                "Show every artboard you made 'to look busy'.",
                'Hide mistakes — honest changes show good judgement.',
              ],
            },
            {
              type: 'checklist',
              title: 'Process section checklist',
              items: [
                '3–6 carefully chosen images.',
                'Each image has a caption with a lesson or decision.',
                'The steps are in the order they really happened.',
                'At least one moment where you changed your mind.',
              ],
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Captioning a sketch',
              body: 'A caption turns a picture into evidence of thinking.',
              before: "Caption: 'Early sketches'",
              after:
                "Caption: 'Early sketches — I tried a calendar-first layout, but it buried today's habits, so I switched to a list-first view.'",
            },
          ],
          practice: {
            task: 'Build the process section for one of your case studies.',
            steps: [
              'Gather every sketch, wireframe and draft from the project into one Figma page.',
              'Choose the 3–6 that best show how your thinking changed.',
              'Write a one-sentence caption for each.',
              'Arrange them in the order they happened.',
            ],
            deliverable: 'A process section with 3–6 captioned images in real chronological order.',
          },
          challenge: {
            task: 'Show a before-and-after of one screen across three versions, explaining each change.',
            successCriteria: [
              'Three versions of the same screen appear side by side.',
              'Each change is explained in one or two sentences.',
              'The explanations refer to user needs or feedback, not only taste.',
            ],
          },
        },
        {
          id: 'b6-presenting-research',
          title: 'Presenting research',
          summary: 'Share what you learned from users in a way that is honest, short and clearly shapes your design.',
          minutes: 14,
          difficulty: 'Medium',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "Research in a case study isn't about volume. It's about showing that you listened to real people and that what you heard changed your design.\n\nAs a beginner, your research might be small: five short interviews with friends, a quick survey, or looking at how competitors handle the same problem. That's fine — just describe it honestly.",
            },
            {
              type: 'list',
              items: [
                '**Method:** what you did and with whom (e.g. 5 interviews with people who cook at home).',
                '**Key findings:** 2–4 insights, written as clear statements.',
                '**Evidence:** a real, short quote or observation for each finding.',
                '**Impact:** how each finding changed the design.',
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'Never inflate research',
              body:
                "Don't write '80% of users struggle' if you spoke to five people. Say 'four of the five people I spoke to…'. Small, honest numbers build trust; made-up percentages destroy it the moment an interviewer asks a follow-up.",
            },
            {
              type: 'quiz',
              question: 'You interviewed 5 people and 3 skipped breakfast. How should you present it?',
              options: [
                '60% of people skip breakfast',
                'Most people skip breakfast',
                'Three of the five people I interviewed skipped breakfast',
                'Research proves breakfast is unpopular',
              ],
              answer: 2,
              explanation:
                'Stating the real numbers and sample is honest and lets the reader judge how much weight to give it.',
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Turning a finding into a design move',
              body: 'A finding is most useful when it clearly connects to something you changed.',
              before: "'Users said onboarding was long.'",
              after:
                "'Four of five testers paused at the cuisine-preference screen (\"I don't know yet\"). I moved it after the first plan, which cut onboarding to three steps.'",
            },
          ],
          practice: {
            task: 'Write the research section for one case study, based on research you actually did.',
            steps: [
              'Write one sentence describing your method and sample honestly.',
              'Pick 2–4 findings and write each as a clear statement.',
              'Add one real quote or observation to support each finding.',
              'For every finding, write how it changed the design.',
            ],
            deliverable: 'A research section with method, 2–4 findings, evidence and design impact.',
          },
          challenge: {
            task: "If you haven't done any research yet, run three 15-minute interviews for one project and add the results.",
            successCriteria: [
              'You wrote 5–6 open questions before the interviews.',
              'You took notes of what people said, not what you hoped they would say.',
              'At least one finding surprised you or changed a design.',
              'You present the sample size honestly.',
            ],
          },
        },
        {
          id: 'b6-presenting-wireframes',
          title: 'Presenting wireframes',
          summary: 'Use wireframes to show structure and thinking before visual polish — and explain what they solved.',
          minutes: 10,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "Wireframes show the skeleton of a screen: layout, content order and flow, without colour or styling. In a case study they prove you worked out the structure before making things pretty.\n\nThe mistake is dropping in a grid of grey boxes with no explanation. The reader can't tell what problem those boxes solved.",
            },
            {
              type: 'doDont',
              do: [
                'Show a user flow alongside wireframes so the reader sees how screens connect.',
                'Annotate key areas with short notes (e.g. "Primary action in thumb zone").',
                'Show one wireframe next to its final design to highlight what changed.',
              ],
              dont: [
                'Show dozens of wireframes at thumbnail size.',
                'Leave wireframes unlabelled.',
                'Polish wireframes so much they look like final UI.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              body:
                "Clean up your wireframes before exporting: consistent grey tones, readable labels, and a simple title for each screen. 'Rough' should mean low-fidelity, not messy.",
            },
          ],
          example: [
            {
              type: 'example',
              title: 'An annotated wireframe',
              body: 'Two or three notes are enough to make a wireframe meaningful.',
              before: "Four grey wireframes with the caption 'Wireframes'",
              after:
                "The dashboard wireframe with three numbered notes: '1. Key numbers first — the owner's main question', '2. Chart shows the week, not the year', '3. Alerts sit where the eye lands last'",
            },
          ],
          practice: {
            task: 'Prepare the wireframe section for one of your case studies.',
            steps: [
              'Pick the 2–4 most important wireframes.',
              'Add 2–3 numbered annotations to each.',
              'Include the user flow they belong to.',
              'Place one wireframe next to its final version.',
            ],
            deliverable: 'A wireframe section with annotated wireframes, a flow and one wireframe-to-final comparison.',
          },
          challenge: {
            task: 'Create a single annotated overview image that shows the full flow of one project in wireframes.',
            successCriteria: [
              'All key screens are connected with arrows in the right order.',
              'The image is readable on a laptop screen without zooming.',
              'Annotations explain decisions, not just describe what is visible.',
            ],
          },
        },
        {
          id: 'b6-presenting-final-ui',
          title: 'Presenting final UI',
          summary: 'Present your finished screens so they look professional and are easy to understand at a glance.',
          minutes: 12,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "Your final UI is the payoff of the case study. Presented well, it tells the reader you care about detail. Presented badly — tiny, cropped, or buried in heavy device mockups — it hides your work.\n\nThink of it like a gallery: fewer pieces, well lit, with a label on each.",
            },
            {
              type: 'list',
              items: [
                'Lead with a **hero image**: 2–3 key screens that sum up the project.',
                'Then show screens **in flow order** with a short caption explaining each.',
                'Zoom in on **details** that show care: an error state, a component, an empty state.',
                'Add a **clickable prototype link** if you have one.',
              ],
            },
            {
              type: 'doDont',
              do: [
                'Keep screens large enough to read the text.',
                'Use a simple, neutral background.',
                'Include states beyond the happy path (errors, empty, loading).',
              ],
              dont: [
                'Tilt screens at dramatic angles that make text unreadable.',
                'Use heavy mockups that distract from your design.',
                'Show only the one nicest screen.',
              ],
            },
            {
              type: 'callout',
              tone: 'why',
              title: 'Why states matter',
              body:
                "Anyone can design the perfect-data screen. Showing an error or empty state proves you thought about what happens when things go wrong — which is most of real product design.",
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Captioning final screens',
              body: 'A short caption connects the screen back to the problem you set out to solve.',
              before: "Caption: 'Home screen'",
              after:
                "Caption: 'Today screen — each habit checks off in one tap, reachable with a thumb, so the daily check-in takes seconds.'",
            },
          ],
          practice: {
            task: 'Build the final UI section for one case study.',
            steps: [
              'Create a hero image with 2–3 key screens on a plain background.',
              'Export the main flow screens at a readable size.',
              'Write a one-line caption for each screen linking it to the problem.',
              'Add at least one non-happy-path state.',
            ],
            deliverable: 'A final UI section with a hero image, captioned flow and at least one edge-case state.',
          },
          challenge: {
            task: 'Record a 60-second screen video of your prototype and add it to your case study.',
            successCriteria: [
              'The video follows one clear user task from start to finish.',
              'It is under 60 seconds and has no dead time.',
              'A viewer understands the flow without sound.',
            ],
          },
        },
        {
          id: 'b6-explaining-iterations',
          title: 'Explaining iterations',
          summary: 'Show how your design improved through feedback and testing — and what you would do next.',
          minutes: 12,
          difficulty: 'Medium',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "An **iteration** is a new version of a design made after learning something — from testing, feedback or your own review. Showing iterations tells the reader you don't treat your first idea as your best one.\n\nThis is also where you can be honest about the limits of a learning project. Saying 'I only tested with three people, next I would…' shows maturity, not weakness.",
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'What the earlier version looked like.',
                'What you learned (and from where — a test, feedback, a review).',
                'What you changed.',
                'What you would test or improve next.',
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'Don’t invent outcomes',
              body:
                "A concept project has no real metrics — and that's okay. Don't claim 'conversion increased by 30%'. Instead, describe what you observed: 'In the second round, all three testers completed sign-up without help.'",
            },
            {
              type: 'quiz',
              question: 'Which is the most honest way to end a concept project case study?',
              options: [
                "'The redesign increased sign-ups by 40%.'",
                "'This design is perfect and needs no changes.'",
                "'Testers finished faster in round two. Next I'd test with people who've never used a meal planner.'",
                "'Users loved it.'",
              ],
              answer: 2,
              explanation:
                'It reports what really happened and shows you know what to learn next, without claiming results you cannot prove.',
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Describing an iteration',
              body: 'Pair each change with the evidence that prompted it.',
              before: "'Version 2: improved design.'",
              after:
                "'In version 1, two of three testers missed the Skip link. In version 2 I made it a visible text button under the main action; in the retest, all three found it.'",
            },
          ],
          practice: {
            task: 'Write the iterations and reflection section for one case study.',
            steps: [
              'Find one screen that changed meaningfully between versions.',
              'Put the versions side by side.',
              'Write what you learned, what you changed, and what happened after.',
              'Finish with 2–3 honest next steps.',
            ],
            deliverable: 'An iterations section with a side-by-side comparison and a short reflection with next steps.',
          },
          challenge: {
            task: 'Assemble your full case study from all the sections in this module and ask someone to review it.',
            successCriteria: [
              'It includes problem, process, research, wireframes, final UI and iterations.',
              'A reviewer can summarise the problem and your key decision in one minute.',
              'No claims are exaggerated or made up.',
              'You made at least one change based on their feedback.',
            ],
          },
        },
      ],
    },

    // ─────────────────────────────────────────────────────── Career Starter
    {
      id: 'b-m7-career',
      title: 'Career Starter',
      stage: 'Career',
      summary:
        'Practical first steps into the job market: a portfolio site, a solid LinkedIn profile, applications, networking and interviews.',
      outcome:
        'You will be able to present yourself honestly and clearly online, apply for junior roles with tailored applications, and prepare for your first design interview.',
      kind: 'lessons',
      published: true,
      lessons: [
        {
          id: 'b7-portfolio-site',
          title: 'Creating your first portfolio site',
          summary: 'Put your case studies online in a simple, fast site that a busy reviewer can navigate in seconds.',
          minutes: 20,
          difficulty: 'Medium',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "Your portfolio site is where your case studies live. It doesn't need to be clever — it needs to be **clear, fast and easy to navigate**.\n\nYou can use a no-code website builder, a portfolio platform, or even a well-organised PDF to start. The tool matters much less than the content. Pick something you can publish this week, not something you'll spend three months building.",
            },
            {
              type: 'list',
              items: [
                '**Home:** your name, one line about what you do, and your 2–3 best projects.',
                '**Case study pages:** one page per project.',
                '**About:** a short, human bio and what kind of role you are looking for.',
                '**Contact:** email and LinkedIn — easy to find on every page.',
              ],
            },
            {
              type: 'doDont',
              do: [
                'Show 2–3 strong projects rather than 8 weak ones.',
                'Check every page on your phone.',
                'Label concept or learning projects honestly.',
              ],
              dont: [
                'Hide your work behind animations or splash screens.',
                'Add skill bars like "Figma 90%" — they mean nothing to reviewers.',
                'Leave broken links or placeholder text.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              body:
                "Before you share it, ask a friend to find your best project and your email address. If either takes more than a few seconds, simplify.",
            },
          ],
          example: [
            {
              type: 'example',
              title: 'A clear home page intro',
              body: 'Your first line should tell visitors who you are and what to look at.',
              before: "'Hi! I'm a creative soul who loves pixels and coffee ✨'",
              after:
                "'Hi, I'm [Name] — a junior UI/UX designer focused on clear, accessible mobile apps. Here are three projects I'm proud of.'",
            },
          ],
          practice: {
            task: 'Publish a first version of your portfolio site with at least two case studies.',
            steps: [
              'Choose a tool you can publish with quickly.',
              'Write your home page intro and a short About section.',
              'Add two case studies using the structure from the Portfolio module.',
              'Check it on mobile and fix anything broken or hard to read.',
            ],
            deliverable: 'A live portfolio link with a home page, two case studies, an About section and contact details.',
          },
          challenge: {
            task: 'Run a quick usability test of your own portfolio with two people.',
            successCriteria: [
              'Each person finds a case study and your contact details without help.',
              'You note where they hesitated.',
              'You make at least two improvements based on what you saw.',
            ],
          },
        },
        {
          id: 'b7-linkedin-profile',
          title: 'Creating your LinkedIn profile',
          summary: 'Set up a complete, honest LinkedIn profile that shows you are serious about design, even without job titles.',
          minutes: 15,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "Recruiters and hiring managers often look at LinkedIn before they look at anything else. A complete profile doesn't guarantee interviews, but an empty one can make you easy to overlook.\n\nYou don't need design job titles to have a good profile. You need clarity about what you're learning, what you've made, and what you're looking for.",
            },
            {
              type: 'checklist',
              title: 'Profile basics',
              items: [
                'A clear, friendly photo where your face is visible.',
                'A simple banner (even a plain colour with your name and focus works).',
                'Headline and About section (covered in the next lessons).',
                'Experience: include current or past jobs — transferable skills count.',
                "Projects or Featured: link your case studies.",
                'Education and courses you have actually completed.',
                'Location and "Open to work" settings that match what you want.',
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'Honesty first',
              body:
                "Don't list 'UX Designer at [Your Name] Design Studio' if it's just you doing practice projects. Call it what it is — for example, 'Self-directed UI/UX projects'. Interviewers ask about everything on your profile.",
            },
            {
              type: 'text',
              body:
                "Your previous work matters. If you were a teacher, retail assistant or support agent, you've already practised explaining things clearly, understanding people's needs and handling problems. Describe those skills in plain words in your experience entries.",
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Describing a non-design role',
              body: 'Show transferable skills without pretending the job was a design job.',
              before: "'Customer Service Advisor — answered calls.'",
              after:
                "'Customer Service Advisor — handled [number] customer queries a day and noticed repeated confusion about the returns form; suggested wording changes to my team lead.'",
            },
          ],
          practice: {
            task: 'Complete every section of your LinkedIn profile using the checklist.',
            steps: [
              'Update your photo and banner.',
              'Rewrite each past role to highlight one transferable skill.',
              'Add your design courses and any certificates you have actually earned.',
              'Set your job preferences to match the roles you want.',
            ],
            deliverable: 'A complete LinkedIn profile with every checklist item done.',
          },
          challenge: {
            task: "Ask a friend to look at your profile for 30 seconds, then tell you what you do and what you're looking for.",
            successCriteria: [
              'They describe your focus correctly.',
              'They can find at least one of your projects.',
              'You fix anything they misunderstood.',
            ],
          },
        },
        {
          id: 'b7-linkedin-headline',
          title: 'Writing your LinkedIn headline',
          summary: 'Write a short, specific headline that says what you do and what you care about — without hype.',
          minutes: 10,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "Your headline appears everywhere: search results, comments, connection requests. It's often the only thing someone reads before deciding whether to click.\n\nA strong beginner headline is **specific and honest**. It says what you do, what you focus on, and optionally something that makes you memorable, like a previous background.",
            },
            {
              type: 'list',
              items: [
                "Junior UI/UX Designer | Designing clear mobile experiences | Ex-[previous field]",
                "Aspiring Product Designer | Focused on accessible, simple interfaces | Portfolio in Featured",
                "UI/UX Designer (career changer from [field]) | Onboarding & forms | Open to junior roles",
              ],
            },
            {
              type: 'doDont',
              do: [
                'Use the job title you are aiming for (e.g. "Junior UI/UX Designer").',
                'Add a focus area or background.',
                'Keep it readable — two or three short parts.',
              ],
              dont: [
                'Use hype words like "Guru", "Ninja" or "Visionary".',
                'List ten tools separated by pipes.',
                'Claim seniority you don\'t have.',
              ],
            },
            {
              type: 'callout',
              tone: 'why',
              title: 'Why the job title matters',
              body:
                "Recruiters search for role titles. If your headline only says 'Learner' or 'Creative', you are harder to find for the roles you want.",
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Headline makeover',
              body: 'The improved version is searchable, specific and honest.',
              before: "'Passionate creative | Design enthusiast | Dreamer | Coffee lover'",
              after: "'Junior UI/UX Designer | Clear, accessible mobile apps | Former [previous role]'",
            },
          ],
          practice: {
            task: 'Write three headline options using the templates and pick the best one.',
            steps: [
              'Fill in each template with your own details.',
              'Remove any word that is vague or exaggerated.',
              'Read each one aloud — does it sound like you?',
              'Update your LinkedIn with your favourite.',
            ],
            deliverable: 'Your new LinkedIn headline, live on your profile.',
          },
          challenge: {
            task: 'Look at the headlines of five junior designers who were recently hired and note what patterns they share.',
            successCriteria: [
              'You list at least two common patterns.',
              'You note one thing you would avoid.',
              'You refine your headline based on what you learned.',
            ],
          },
        },
        {
          id: 'b7-linkedin-about',
          title: 'Writing your LinkedIn About section',
          summary: 'Tell a short, honest story about who you are, how you got into design and what you are looking for.',
          minutes: 15,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "The About section is your chance to sound like a person, not a list of keywords. Write in the first person, keep it short, and make it easy to skim.\n\nMost readers will only see the first two or three lines before clicking 'see more', so put the most important information first.",
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**Hook:** who you are and what you do, in one line.',
                '**Story:** how you got into design and what drew you to it.',
                '**What you do:** the kind of work you enjoy and your focus areas.',
                '**Proof:** point to 1–2 projects in your Featured section.',
                "**Ask:** what you're looking for and how to reach you.",
              ],
            },
            {
              type: 'example',
              title: 'Template',
              body:
                "I'm a junior UI/UX designer who loves making everyday apps easier to use.\n\nI spent [X years] working as a [previous role], where I [one thing you noticed about people or problems]. That's what led me to design.\n\nSince then I've completed [course/programme] and designed projects like [project 1] and [project 2] — you'll find them in my Featured section.\n\nI'm looking for junior UI/UX or product design roles in [location/remote]. I'd love to hear from you at [email].",
            },
            {
              type: 'callout',
              tone: 'tip',
              body:
                "Use plain words. 'I help people finish tasks faster' is clearer than 'I leverage human-centred methodologies to drive synergy'.",
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Rewriting the opening line',
              body: 'The first line should be specific enough that the reader knows whether to keep reading.',
              before: "'Hello! Welcome to my profile. I am a very hard-working and passionate person.'",
              after:
                "'I'm a junior UI/UX designer and former nurse, focused on making health and booking apps calmer and easier to use.'",
            },
          ],
          practice: {
            task: 'Write your About section using the five-part structure.',
            steps: [
              'Draft each of the five parts in one or two sentences.',
              'Cut it to under 200 words.',
              'Check that the first two lines work on their own.',
              'Publish it on your profile.',
            ],
            deliverable: 'A live About section of under 200 words following the five-part structure.',
          },
          challenge: {
            task: 'Write a second version aimed at a specific type of company (e.g. health tech or e-commerce) and compare.',
            successCriteria: [
              'The second version mentions why that industry interests you.',
              'Both versions stay honest about your experience.',
              'You choose one and explain why in a sentence.',
            ],
          },
        },
        {
          id: 'b7-linkedin-featured',
          title: 'Using the LinkedIn Featured section',
          summary: 'Pin your best work to the top of your profile so visitors see proof of your skills straight away.',
          minutes: 8,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "The **Featured** section sits near the top of your profile and lets you pin links, posts and media. For a beginner, it's the fastest way to turn 'I'm learning design' into 'here is my design work'.\n\nKeep it focused: two or three items is plenty.",
            },
            {
              type: 'list',
              items: [
                'Your portfolio home page.',
                'Your strongest case study, linked directly.',
                'A post where you shared a project and explained one decision.',
              ],
            },
            {
              type: 'doDont',
              do: [
                'Give each item a clear title (e.g. "Case study: Habit tracker app").',
                'Use a clean cover image of the project.',
                'Put your best item first.',
              ],
              dont: [
                'Feature certificates alone — they show learning, not skill.',
                'Pin old or unrelated posts.',
                'Link to files that need special permission to open.',
              ],
            },
            {
              type: 'callout',
              tone: 'why',
              title: 'Why it works',
              body:
                "A visitor who sees real work in the first few seconds has a reason to keep exploring. Without it, they have to take your word for it.",
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Titling a Featured item',
              body: 'Titles should tell visitors what they will get when they click.',
              before: "Featured title: 'My Work'",
              after: "Featured title: 'Case study — Redesigning sign-up for a meal-planning app'",
            },
          ],
          practice: {
            task: 'Set up your Featured section with 2–3 strong items.',
            steps: [
              'Choose your best case study and your portfolio home page.',
              'Create a clean cover image for each.',
              'Write clear, specific titles.',
              'Check every link opens without needing a login.',
            ],
            deliverable: 'A Featured section with 2–3 clearly titled items linking to your work.',
          },
          challenge: {
            task: 'Write and post a short LinkedIn post about one design decision from a project, then feature it.',
            successCriteria: [
              'The post explains one problem and one decision in under 150 words.',
              'It includes one clear image.',
              'It makes no exaggerated claims about impact.',
            ],
          },
        },
        {
          id: 'b7-searching-junior-roles',
          title: 'Searching for junior roles',
          summary: 'Find the right job titles, read job ads realistically and build a simple system to track your search.',
          minutes: 15,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "Junior design roles go by many names. Searching for just one title means missing openings. Try a range, and read the description rather than the title alone.\n\nJob hunting for a first role can take a while, and that's normal. A simple, steady system is more sustainable than applying to everything in one stressful week.",
            },
            {
              type: 'list',
              items: [
                'Junior UI/UX Designer, Junior Product Designer, UX Designer (Entry Level)',
                'Graduate Designer, Associate Designer, Design Apprentice',
                'UI Designer, Visual Designer, Digital Designer',
                'Design internships — especially paid ones',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              title: 'Read requirements realistically',
              body:
                "Job ads often list a wish list, not a strict checklist. If you match most of the core skills and can show relevant work, it's usually reasonable to apply. Be cautious of 'junior' roles asking for many years of experience — they may not really be junior.",
            },
            {
              type: 'checklist',
              title: 'Simple job tracker columns',
              items: [
                'Company and role',
                'Link to the job ad',
                'Date applied',
                'Status (applied, interview, rejected, offer)',
                'Contact person, if any',
                'Follow-up date',
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              body:
                "Watch out for unpaid 'test projects' that look like real client work, or roles that ask you to pay a fee. A legitimate employer won't charge you to apply.",
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Widening a search',
              body: 'Small changes to how you search can reveal many more relevant roles.',
              before: "Searching only 'UX Designer' in one city",
              after:
                "Searching 'Junior Product Designer', 'Associate Designer' and 'UI Designer', in your city and remote, with saved alerts for each",
            },
          ],
          practice: {
            task: 'Set up your job search system and find five roles worth applying for.',
            steps: [
              'Create a tracker spreadsheet with the columns above.',
              'Set up job alerts for at least three different titles.',
              'Find five roles and add them to your tracker.',
              'For each, highlight the skills you already have.',
            ],
            deliverable: 'A job tracker with five relevant roles and your matching skills noted.',
          },
          challenge: {
            task: 'Pick one company you would love to work for and research how their design team works.',
            successCriteria: [
              "You find their product and try it yourself.",
              'You note two things you like and one thing you would improve.',
              'You find at least one designer who works there.',
            ],
          },
        },
        {
          id: 'b7-job-applications',
          title: 'Writing job applications',
          summary: 'Tailor each application to the role so it is clear why you, specifically, are a good fit.',
          minutes: 20,
          difficulty: 'Medium',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "A tailored application beats a generic one sent to fifty companies. Tailoring doesn't mean rewriting everything — it means changing the parts that matter: the opening, the project you highlight, and the skills you emphasise.\n\nYour application usually includes a CV (résumé), a portfolio link and sometimes a cover letter or short message.",
            },
            {
              type: 'list',
              items: [
                '**CV:** one page, simple layout, portfolio link at the top.',
                '**Projects:** describe what you did and why, not just the tools.',
                '**Skills:** list those you can demonstrate in your portfolio.',
                '**Cover letter:** short — 3 short paragraphs is enough.',
              ],
            },
            {
              type: 'example',
              title: 'Cover letter template',
              body:
                "Hi [Hiring manager's name],\n\nI'm applying for the [Role] at [Company]. I've been using [their product] and I especially like how [specific thing they do well].\n\nI'm a junior UI/UX designer with a background in [previous field]. In my [project name] case study, I [one relevant thing you did, e.g. simplified a sign-up flow from five steps to three based on testing]. I think that experience fits your need for [something from the job ad].\n\nYou can see my work at [portfolio link]. I'd welcome the chance to talk.\n\nThanks,\n[Your name]",
            },
            {
              type: 'doDont',
              do: [
                'Mention something real about the company or product.',
                'Link to the case study most relevant to the role.',
                'Proofread — typos in a design application stand out.',
              ],
              dont: [
                "Claim results you can't back up.",
                'Copy the same letter for every company.',
                'Rate your own skills with stars or percentages.',
              ],
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Writing a project line on your CV',
              body: 'Focus on the problem and your action, and be honest that it was a concept.',
              before: "'Habit app — Figma, prototyping, UX.'",
              after:
                "'Tiny Steps (concept project) — designed a habit tracker for people who quit habit apps; tested with 4 people and redesigned missed-day feedback to feel less punishing.'",
            },
          ],
          practice: {
            task: 'Write a tailored application for one real job from your tracker.',
            steps: [
              'Highlight the 3–4 most important requirements in the job ad.',
              'Adjust your CV so those skills appear clearly.',
              'Write a short cover letter using the template.',
              'Choose the most relevant case study to link.',
            ],
            deliverable: 'A tailored CV and cover letter ready to send for one specific role.',
          },
          challenge: {
            task: 'Tailor applications for two very different companies (e.g. a bank and a start-up) and compare them.',
            successCriteria: [
              'Each letter mentions something specific about that company.',
              'Each links to a different, relevant case study where possible.',
              'Both remain honest about your experience level.',
            ],
          },
        },
        {
          id: 'b7-messaging-recruiters',
          title: 'Messaging recruiters',
          summary: 'Send short, respectful messages to recruiters that are easy to read and easy to reply to.',
          minutes: 10,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "Recruiters receive a lot of messages. The ones that get replies are **short, specific and polite**, and they make it easy for the recruiter to help.\n\nThere are two main types: in-house recruiters (who hire for one company) and agency recruiters (who hire for many clients). Both are worth contacting, but tailor your message to each.",
            },
            {
              type: 'example',
              title: 'Message template — about a specific role',
              body:
                "Hi [Name], I've just applied for the [Role] at [Company]. I'm a junior UI/UX designer with a background in [field], and my [project] case study focuses on [relevant area]. Portfolio: [link]. Happy to share anything else that helps — thanks for your time.",
            },
            {
              type: 'example',
              title: 'Message template — general introduction',
              body:
                "Hi [Name], I noticed you recruit for design roles in [area/industry]. I'm looking for my first junior UI/UX role, [location/remote]. My portfolio is here: [link]. If anything suitable comes up, I'd be grateful to hear about it.",
            },
            {
              type: 'doDont',
              do: [
                'Keep it under about 80 words.',
                'Include your portfolio link.',
                'Follow up once, politely, after a week or so.',
              ],
              dont: [
                "Send just 'Hi' and wait for a reply.",
                'Paste your whole CV into the message.',
                'Message the same person repeatedly or get frustrated if they do not reply.',
              ],
            },
          ],
          example: [
            {
              type: 'example',
              title: 'Tightening a message',
              body: 'The better version gets to the point and gives the recruiter something to act on.',
              before:
                "'Hello sir/madam, I am looking for a job in design, any job is okay, please help me, I am very passionate…'",
              after:
                "'Hi [Name], I've applied for the Junior Product Designer role at [Company]. My portfolio is at [link] — the onboarding case study is most relevant. Thanks for your time.'",
            },
          ],
          practice: {
            task: 'Write and send two recruiter messages: one about a specific role, one general.',
            steps: [
              'Find one in-house and one agency recruiter who hire designers.',
              'Personalise a template for each.',
              'Check each is under 80 words and includes your portfolio link.',
              'Log both in your job tracker with a follow-up date.',
            ],
            deliverable: 'Two sent messages logged in your tracker with follow-up dates.',
          },
          challenge: {
            task: 'Write a polite follow-up message for a recruiter who has not replied after a week.',
            successCriteria: [
              'It is under 50 words.',
              'It adds something new (e.g. a new case study) rather than just repeating.',
              'It is friendly and does not pressure them.',
            ],
          },
        },
        {
          id: 'b7-networking',
          title: 'Networking as a beginner',
          summary: 'Build genuine relationships with other designers by being curious, helpful and consistent.',
          minutes: 12,
          difficulty: 'Easy',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "Networking can sound intimidating, but it's really just getting to know people in your field. You don't need to be an expert — curiosity and kindness go a long way.\n\nThe goal isn't to ask everyone for a job. It's to learn, get feedback, and let people know you exist. Opportunities sometimes come from this, but there are no guarantees, so focus on relationships you'd value anyway.",
            },
            {
              type: 'list',
              items: [
                'Join a design community (online groups, local meetups, events).',
                'Comment thoughtfully on designers’ posts — add a view, not just "Great post!".',
                'Share your own work-in-progress and what you learned.',
                'Ask for a short portfolio review or a 15-minute chat about someone’s role.',
                'Help others: share a useful resource or give feedback to fellow learners.',
              ],
            },
            {
              type: 'example',
              title: 'Template — asking for a short chat',
              body:
                "Hi [Name], I enjoyed your post about [topic] — especially [specific point]. I'm a junior designer learning about [area]. Would you be open to a 15-minute chat sometime in the next few weeks? I'd love to hear how you [specific question]. Totally understand if you're busy.",
            },
            {
              type: 'callout',
              tone: 'tip',
              body:
                "After a chat, send a short thank-you and mention one thing you'll try. If you later act on their advice, tell them — people remember that. For structured feedback, you can also book a 1:1 with Harikrishna.",
            },
          ],
          example: [
            {
              type: 'example',
              title: 'A meaningful comment',
              body: 'Thoughtful comments get noticed and start conversations.',
              before: "Comment: 'Nice!'",
              after:
                "Comment: 'Love the choice to show missed days in grey rather than red — did you test how people felt about it?'",
            },
          ],
          practice: {
            task: 'Take three small networking actions this week.',
            steps: [
              'Join one design community and introduce yourself.',
              'Leave three thoughtful comments on designers’ posts.',
              'Send one request for a 15-minute chat using the template.',
              'Note any replies in your tracker.',
            ],
            deliverable: 'One community joined, three meaningful comments, and one chat request sent.',
          },
          challenge: {
            task: 'Give helpful, specific feedback on another beginner’s portfolio or project.',
            successCriteria: [
              'You mention two things that work well and why.',
              'You suggest one concrete improvement.',
              'Your tone is kind and constructive.',
            ],
          },
        },
        {
          id: 'b7-first-interview',
          title: 'Preparing for your first design interview',
          summary: 'Prepare to talk through your work, answer common questions and ask good ones of your own.',
          minutes: 25,
          difficulty: 'Medium',
          published: true,
          addedAt: ADDED,
          learn: [
            {
              type: 'text',
              body:
                "Design interviews often include a conversation about you, a **portfolio walkthrough** where you present a project, and sometimes a short design exercise. Formats vary by company, so it's fine to ask the recruiter what to expect.\n\nFor juniors, interviewers usually aren't looking for perfection. They want to see how you think, how you take feedback, and whether you're honest about what you know.",
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'Context — the problem and who it was for (30 seconds).',
                'Your process — research and key findings.',
                'Two or three key decisions and why you made them.',
                'Final design and what you tested.',
                'What you learned and what you would do next.',
              ],
            },
            {
              type: 'list',
              items: [
                '"Tell me about yourself." — 60–90 seconds: background, why design, what you are looking for.',
                '"Walk me through a project." — use the structure above; aim for about 10 minutes.',
                '"What would you do differently?" — be honest and specific.',
                '"How do you handle feedback?" — give a real example from a project or past job.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              title: "It's okay to say 'I don't know'",
              body:
                "If you don't know an answer, say so and explain how you'd find out. 'I haven't used that yet, but I'd start by…' is far better than bluffing.",
            },
            {
              type: 'checklist',
              title: 'Interview prep checklist',
              items: [
                'Practise your project walkthrough out loud, timed.',
                'Prepare three questions to ask them (e.g. how design works with engineering).',
                'Try the company’s product and note one thing you like.',
                'Test your camera, microphone and screen sharing for video calls.',
                'Have your portfolio open and ready in a tab.',
              ],
            },
          ],
          example: [
            {
              type: 'example',
              title: "Answering 'Tell me about yourself'",
              body: 'Keep it short and relevant, and end with why you are in the room.',
              before: "'Well, I was born in… then at school I liked art… then I did lots of jobs…'",
              after:
                "'I spent [X years] as a [previous role], where I kept noticing how confusing [thing] was for people. That got me into UX. I've since designed [project], which I'd love to show you, and I'm looking for a junior role where I can learn from a team.'",
            },
          ],
          practice: {
            task: 'Run a full mock interview with a friend or mentor.',
            steps: [
              'Write your 60–90 second introduction and practise it aloud.',
              'Rehearse a 10-minute walkthrough of one case study, timed.',
              'Ask your friend to use the common questions above.',
              'Note two things to improve and practise again.',
            ],
            deliverable: 'A recorded or noted mock interview with two clear improvements identified.',
          },
          challenge: {
            task: 'Practise a 30-minute whiteboard-style exercise, e.g. "Design a way for a library to lend umbrellas".',
            successCriteria: [
              'You ask clarifying questions before designing.',
              'You sketch a simple flow and at least two key screens.',
              'You explain your reasoning out loud as you go.',
              'You finish with what you would test next.',
            ],
          },
        },
      ],
    },
  ],
}
