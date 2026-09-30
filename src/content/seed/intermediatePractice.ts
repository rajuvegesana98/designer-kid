import type { Course, Module } from '../types'

const ADDED = '2026-09-01'

/* -------------------------------------------------------------------------- */
/* Module 6 — End-to-End Product Design (one continuous project)              */
/* -------------------------------------------------------------------------- */

const productWorkflow: Module = {
  id: 'i-m6-product-workflow',
  title: 'End-to-End Product Design',
  stage: 'Workflow',
  summary:
    "Take one realistic project — redesigning appointment rescheduling for a clinic booking product — from a vague request to a shipped, iterated flow.",
  outcome:
    'You will be able to run, document and defend a complete product design process, producing artefacts you can reuse in a portfolio case study.',
  kind: 'project',
  published: true,
  lessons: [
    {
      id: 'i6-problem',
      title: 'Problem: reframing the request',
      summary: "Turn a stakeholder's solution request into a problem statement the whole team can test and agree on.",
      minutes: 15,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "**The project brief for this whole module:** Northfield Health (a fictional network of physiotherapy and GP clinics) has a web and mobile booking product. Patients can book and cancel, but there is no way to *change* an appointment. The head of operations sends you a one-line request: 'Can we add a reschedule button?'\n\nEvery lesson in this module advances this same project, so keep your notes and files in one place — by the end you will have the raw material for a full case study.",
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why not just add the button?',
          body:
            "A request like this is a solution wearing a problem's clothes. If you design the button without understanding what is going wrong, you might ship something that looks finished but leaves the real pain untouched — for example, patients still phoning reception because they don't trust the app to keep their slot.",
        },
        {
          type: 'text',
          body:
            "Start by asking what prompted the request. In this scenario, the operations lead explains that reception teams say a lot of their phone time goes on moving appointments, and clinicians complain about late gaps in their diaries that nobody fills.\n\nThat gives you two affected groups (patients and clinic staff) and a business concern (lost clinical time). Notice that none of this is quantified yet — that is a job for research, not something to guess.",
        },
        {
          type: 'list',
          items: [
            '**Who** is struggling? Patients who need to move an appointment; reception staff who handle the calls.',
            '**What** is the struggle? Changing a booking means cancelling and rebooking, or phoning.',
            '**When** does it happen? Often close to the appointment, when plans change.',
            '**Why** does it matter to the business? Staff time, unfilled late cancellations, patient frustration.',
            '**How will we know** it is better? Signals you agree on now and measure later.',
          ],
        },
        {
          type: 'quiz',
          question: 'Which is the strongest problem statement for this project?',
          options: [
            'Add a reschedule button to the appointment screen.',
            'Patients who need to change an appointment cannot do so in the app, so they cancel and rebook or phone reception, costing staff time and leaving late gaps in clinicians’ diaries.',
            'Our booking app has poor UX and needs a redesign.',
            'Rescheduling is broken and users hate it.',
          ],
          answer: 1,
          explanation:
            'It names who is affected, what they do today, and why it matters — without prescribing the solution. The others are either a solution, too vague, or an unsupported claim.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Reframing the brief',
          body:
            'The reframed statement keeps the stakeholder’s intent but opens up the solution space, so options like smart reminders or a waitlist can be considered alongside a button.',
          before: "Brief: 'Add a reschedule button to the app.'",
          after:
            "Brief: 'Help patients change an appointment without phoning, while making freed-up slots available to others quickly.'",
        },
      ],
      practice: {
        task: 'Write a problem statement and a list of open questions for the Northfield Health rescheduling project.',
        steps: [
          'Create a project doc titled “Northfield rescheduling — working notes”; you will keep adding to it all module.',
          'Write the problem statement using the who / what / when / why structure above.',
          'List at least five assumptions hidden in the original request (e.g. “patients know the app exists”).',
          'Mark each assumption as “known”, “believed” or “unknown”.',
        ],
        deliverable: 'A one-page problem statement with a labelled list of assumptions.',
      },
      challenge: {
        task: 'Draft a project brief you could send to the operations lead to align on the problem before any design work starts.',
        successCriteria: [
          'It restates the request and explains, politely, why you are reframing it.',
          'It names the users, the business concern and at least three open questions.',
          'It proposes how success could be observed without inventing target numbers.',
          'It fits on one page and could be read in under three minutes.',
        ],
      },
    },
    {
      id: 'i6-research',
      title: 'Research: what really happens today',
      summary: 'Plan a lean research mix that tests your riskiest assumptions about rescheduling, then synthesise findings.',
      minutes: 20,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "You already know how to run an interview; the intermediate skill is choosing the *right mix* of methods for the questions you actually have. For Northfield, your unknowns are: how often rescheduling happens, why patients phone instead of using the app, and what reception does that the app doesn't.\n\nMatch each question to a method rather than defaulting to interviews for everything.",
        },
        {
          type: 'list',
          items: [
            '**Existing data:** ask the product team for cancellation and rebooking events, and ask support whether call reasons are logged. This tells you *how much*.',
            '**Patient interviews:** a handful of recent reschedulers, recruited through the clinics. This tells you *why*.',
            '**Reception shadowing:** sit with staff for a morning. This reveals the hidden rules they apply — like keeping a patient with the same physiotherapist.',
            '**Policy review:** read the cancellation policy and any fee rules. This surfaces constraints early.',
          ],
        },
        {
          type: 'doDont',
          do: [
            'Ask about the last real time they changed an appointment.',
            'Probe feelings at key moments: “What worried you at that point?”',
            'Note what reception staff check before offering a new slot.',
          ],
          dont: [
            'Ask “Would you use a reschedule button?” — people predict their behaviour poorly.',
            'Show designs in discovery interviews; it anchors the conversation.',
            'Treat one vivid anecdote as a pattern.',
          ],
        },
        {
          type: 'text',
          body:
            "**Scenario findings to carry forward** (these are the story for this module, not real-world data):\n\n1. Several patients didn't realise they could cancel in the app at all.\n2. Patients who knew hesitated to cancel first because they feared losing their slot and not getting another soon.\n3. The late-cancellation fee rule was unclear, so people phoned to ask.\n4. Reception routinely kept patients with the same clinician — continuity matters for physiotherapy treatment plans.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body:
            'Synthesise into insights, not quotes. “Patients fear losing their slot, so they avoid cancelling first” is an insight that shapes design. “P3 said it was annoying” is raw data.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Rewriting an interview question',
          body: 'Past behaviour gives you evidence; hypothetical questions give you polite guesses.',
          before: "'Would it be useful if you could reschedule in the app?'",
          after: "'Tell me about the last time you needed to change a clinic appointment. What did you do first?'",
        },
      ],
      practice: {
        task: 'Write a research plan for the Northfield project that maps each open question to a method.',
        steps: [
          'Copy your “unknown” assumptions from the previous lesson into a table.',
          'For each, choose a method and explain why it suits that question.',
          'Write a six-question interview guide focused on past behaviour.',
          'Draft an affinity map of the four scenario findings with one insight statement each.',
        ],
        deliverable: 'A research plan table, an interview guide and four written insight statements.',
      },
      challenge: {
        task: 'Run two real interviews with friends or colleagues about the last time they rescheduled any appointment (dentist, hairdresser, GP) and compare with the scenario findings.',
        successCriteria: [
          'Questions focus on a specific past event, not opinions.',
          'You note at least one finding that contradicts or extends the scenario.',
          'You separate observations from your interpretations.',
          'You write down what you would research next and why.',
        ],
      },
    },
    {
      id: 'i6-strategy',
      title: 'Strategy: choosing what to solve first',
      summary: 'Turn insights into principles, a scoped first release and success signals the team signs up to.',
      minutes: 18,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Research gave you more problems than one release can fix. Strategy is deciding which ones matter most, what you will deliberately *not* do yet, and how you'll know it worked.\n\nFor Northfield, the insight with the most leverage is fear of losing a slot. If the new flow lets patients pick a new time *before* giving up the old one, you remove the reason to phone.",
        },
        {
          type: 'list',
          items: [
            '**Principle 1:** Never make a patient risk their existing slot — the old appointment is released only when the new one is confirmed.',
            '**Principle 2:** Be clear about fees before commitment, not after.',
            '**Principle 3:** Default to continuity — show the same clinician first, and let patients widen the search.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Check feasibility before you fall in love',
          body:
            "Principle 1 depends on the booking system supporting an atomic swap (confirm new and release old in one step). Ask engineering early. If the backend can't do it, your strategy changes — perhaps a short hold on the new slot instead.",
        },
        {
          type: 'text',
          body:
            "**Scope for the first release:** change time for single, one-to-one appointments; same or different clinician at the same clinic; clear fee messaging.\n\n**Deliberately out of scope:** group classes, appointments needing a new referral, and an automated waitlist to fill freed slots. Writing these down protects the team from scope creep and gives you a roadmap for later.",
        },
        {
          type: 'checklist',
          title: 'Success signals to agree now',
          items: [
            'Share of appointment changes completed in-app, compared with a baseline measured before launch.',
            'Reschedule-related calls to reception, if call reasons can be logged.',
            'How quickly freed slots are rebooked.',
            'Qualitative: patients can explain what happened to their old appointment.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Scope statement',
          body: 'A good scope statement says what is in, what is out, and why — so trade-offs are visible rather than silent.',
          before: "'Build rescheduling for all appointment types.'",
          after:
            "'Release 1: one-to-one appointments at the same clinic, with fee clarity. Group sessions and referral-dependent appointments follow once we see how Release 1 performs.'",
        },
      ],
      practice: {
        task: 'Write a one-page strategy for Release 1 of the Northfield rescheduling flow.',
        steps: [
          'List the insights from research and rate each on user pain and business value.',
          'Write two to four design principles that follow from the top insights.',
          'Write an in-scope and out-of-scope list with one reason per item.',
          'Define success signals and note where each baseline would come from.',
        ],
        deliverable: 'A one-page strategy doc with principles, scope and success signals.',
      },
      challenge: {
        task: 'Engineering tells you an atomic swap is not possible for six months. Rewrite your strategy for that constraint.',
        successCriteria: [
          'You propose a realistic alternative (e.g. a timed hold) and explain its risks.',
          'Principles are updated rather than silently broken.',
          'You name what patients will experience differently.',
          'You flag which success signal becomes harder to hit and why.',
        ],
      },
    },
    {
      id: 'i6-ux',
      title: 'UX: flows, entry points and edge cases',
      summary: 'Map where rescheduling starts, the happy path, and the edge cases that decide whether patients trust it.',
      minutes: 22,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Start with **entry points**, not screens. Patients decide to reschedule in different moments: opening the appointment in the app, tapping a link in a reminder text, or reading a confirmation email. If the flow is only reachable from one place, many people will still phone.\n\nThen map the happy path as a wireflow — low-fidelity frames connected by arrows — so you can reason about the sequence before styling anything.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Appointment details → “Change time”.',
            'Fee notice, only if inside the late-change window.',
            'Pick a new time: same clinician first, option to see others at the clinic.',
            'Review: old and new appointment side by side.',
            'Confirm: new slot booked and old one released in one step.',
            'Success: clear statement of what changed, calendar update offered.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body:
            'The review step exists because of a research insight: patients were unsure what happened to their old slot. Showing “from” and “to” together answers that question before they commit.',
        },
        {
          type: 'checklist',
          title: 'Edge cases to design, not defer',
          items: [
            'The chosen slot is taken by someone else while the patient is deciding.',
            'Their clinician has no availability in the next few weeks.',
            'The change falls inside the late-change fee window.',
            'The appointment type cannot be rescheduled in Release 1 (e.g. group class) — explain and offer a route.',
            'The patient loses connection mid-confirmation — what state are they in?',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'From two risky steps to one safe swap',
          body: 'The redesigned flow removes the moment where a patient holds no appointment at all.',
          before: 'Flow: Cancel appointment → confirm cancellation → search for a new slot → book (patient has no booking in between).',
          after: 'Flow: Change time → choose new slot → review old vs new → confirm swap (patient always holds a booking).',
        },
      ],
      practice: {
        task: 'Create a wireflow for the Northfield rescheduling happy path and the two riskiest edge cases.',
        steps: [
          'List every entry point and decide which ones Release 1 supports.',
          'Sketch the happy path as greyscale frames in Figma or on paper, connected with arrows.',
          'Add branches for “slot taken during flow” and “inside fee window”.',
          'Annotate each frame with the question the patient is asking at that moment.',
        ],
        deliverable: 'A wireflow covering the happy path plus two edge-case branches, with annotations.',
      },
      challenge: {
        task: 'Design the reminder-text entry point so a patient can move their appointment starting from an SMS link.',
        successCriteria: [
          'You handle a patient who is not logged in on that device.',
          'The link lands on the right appointment, not a generic home screen.',
          'You consider what happens if the link is opened after the appointment has passed.',
          'The flow rejoins the main wireflow rather than duplicating it.',
        ],
      },
    },
    {
      id: 'i6-ui',
      title: 'UI: making the flow feel safe',
      summary: 'Apply visual design to the rescheduling flow so hierarchy, language and states build trust at each step.',
      minutes: 22,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "You know the fundamentals of hierarchy and spacing; here the question is *which* visual decisions carry the strategy. For Northfield, the UI has one emotional job: make patients feel their appointment is safe throughout.\n\nThat means the current appointment stays visible while choosing a new time, the fee message is impossible to miss when it applies (and absent when it doesn't), and the primary button says exactly what will happen.",
        },
        {
          type: 'list',
          items: [
            '**Time picker:** a row of day chips, then a grid of time slots. Mark availability with text and shape, not colour alone.',
            '**Pinned current appointment:** a compact card at the top reading “Currently: Tue 10:00 with Priya”.',
            '**Review step:** a clear from → to comparison with the changed fields emphasised.',
            '**Primary action:** a specific label such as “Move to Thu 14:30”, not “Confirm”.',
          ],
        },
        {
          type: 'doDont',
          do: [
            'Reuse design system components and document any new one (e.g. slot grid) for the system team.',
            'Design loading, disabled and error states for the confirm button.',
            'Keep touch targets comfortable for slot buttons on small phones.',
          ],
          dont: [
            'Hide the fee in small grey text under the button.',
            'Use red for unavailable slots with no other cue.',
            'Show a generic success toast that disappears before patients read it.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body:
            'Write the microcopy alongside the layout, not after. The label “Move to Thu 14:30” may need a wider button than “Confirm” — better to know now than in handoff.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Confirmation screen copy',
          body: 'Directly answers the research worry: what happened to my old appointment?',
          before: "'Success! Your booking has been updated.'",
          after:
            "'You're booked for Thursday 14:30 with Priya. Your Tuesday 10:00 appointment has been cancelled. [Add to calendar]'",
        },
      ],
      practice: {
        task: 'Take your wireflow to high fidelity for the time-picker, review and confirmation screens.',
        steps: [
          'Build the slot grid with Auto Layout so it reflows between phone widths.',
          'Create the confirm button as a component with default, loading, disabled and error variants.',
          'Write final microcopy for every heading, label and message on the three screens.',
          'Check contrast of availability states and add a non-colour cue.',
        ],
        deliverable: 'Three high-fidelity mobile screens with component variants and final copy.',
      },
      challenge: {
        task: 'Design the fee-window variant of the review screen so the fee is clear without feeling punitive.',
        successCriteria: [
          'The fee amount and reason are visible before the confirm button.',
          'The patient has a clear alternative (keep original appointment).',
          'The tone is factual and respectful, with no guilt-inducing copy.',
          'The screen still passes your contrast and target-size checks.',
        ],
      },
    },
    {
      id: 'i6-prototype',
      title: 'Prototype: fidelity for the question',
      summary: 'Build a prototype that answers specific testing questions, including realistic states, not just a clickable happy path.',
      minutes: 18,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "A prototype is a question-answering tool. Before connecting frames, write down what you need to learn. For Northfield: *Do patients find “Change time”? Do they understand their old slot is safe? Do they notice the option to see other clinicians? What do they do when a slot gets taken?*\n\nEach question implies what the prototype must include. If you want to test the slot-taken moment, the prototype has to simulate it — a happy-path click-through can't answer that.",
        },
        {
          type: 'list',
          items: [
            '**Realistic content:** plausible clinician names, real-looking dates and times, a believable appointment history. Lorem ipsum makes people comment on the placeholder.',
            '**Interactive state:** use variables and conditional logic in Figma prototyping (or duplicate frames) so a chosen slot carries through to the review screen.',
            '**Right device:** test the mobile flow on a phone, not a desktop browser.',
            '**Starting point:** begin on the appointment list, not on the reschedule screen, so discoverability is tested.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          body:
            'A prototype is not a spec. Engineers still need annotated states, edge cases and rules (e.g. how long a slot is shown as available). Keep prototype shortcuts out of the handoff file or label them clearly.',
        },
        {
          type: 'checklist',
          title: 'Before you test',
          items: [
            'Every testing question maps to something the prototype can show.',
            'The slot-taken edge case can be triggered.',
            'Dead-end hotspots are removed or lead to a “not in this prototype” frame.',
            'You have run through it yourself on the target device.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Scoping a prototype',
          body: 'The second scope is smaller in screens but richer in the moments that matter.',
          before: 'Prototype every screen of the booking app so testers can explore freely.',
          after:
            'Prototype the appointment list, change-time flow, fee variant and slot-taken error — the four moments tied to our testing questions.',
        },
      ],
      practice: {
        task: 'Build a mobile prototype of the Northfield rescheduling flow tied to written testing questions.',
        steps: [
          'Write three to five testing questions at the top of your prototype page.',
          'Wire the flow starting from the appointment list.',
          'Make the chosen slot carry through to review and confirmation.',
          'Add a route that triggers the “slot just taken” state.',
        ],
        deliverable: 'A shareable prototype link plus the list of questions it is designed to answer.',
      },
      challenge: {
        task: 'Add a second path where the patient widens the search to other clinicians and compare its clarity with the default path.',
        successCriteria: [
          'The clinician change is clearly signalled on the review screen.',
          'The prototype does not require extra explanation from you to use.',
          'You note one hypothesis this path will test.',
          'Frame names and flows are organised so a teammate could maintain it.',
        ],
      },
    },
    {
      id: 'i6-testing',
      title: 'Testing: evaluating with patients and staff',
      summary: 'Run a moderated usability round with realistic scenarios and rate findings by severity rather than volume.',
      minutes: 22,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Plan small, focused rounds. A widely used rule of thumb in qualitative usability testing is that around five participants per round reveal most major problems — then fix and test again, rather than testing many people once.\n\nFor Northfield, recruit recent patients across ages and comfort with technology, and include one or two reception staff: they will spot rule violations patients can't see, such as moving someone away from their treating physiotherapist.",
        },
        {
          type: 'list',
          items: [
            '**Task 1:** “Your Tuesday physio clashes with a work meeting. Move it to later that week.”',
            '**Task 2:** “Priya has nothing free this week. See if anyone else can see you.”',
            '**Task 3:** “You need to move tomorrow’s appointment.” (triggers the fee variant)',
            '**Follow-up:** “Where is your Tuesday appointment now?”',
          ],
        },
        {
          type: 'doDont',
          do: [
            'Write tasks as situations with a goal, not instructions.',
            'Stay quiet and ask “What are you expecting here?” when they hesitate.',
            'Record where people succeed as well as where they struggle.',
          ],
          dont: [
            'Use the words on the button in the task (“Tap Change time”).',
            'Explain the design when someone is stuck — note it instead.',
            'Count comments as findings; count observed behaviour.',
          ],
        },
        {
          type: 'text',
          body:
            "**Scenario results to carry forward:** most participants found “Change time” from the appointment screen; several missed the option to see other clinicians because it sat below the fold; and a couple still weren't sure whether their old appointment had been cancelled after confirming.\n\nRate each finding by **severity** (does it stop the task, cause an error, or just slow people down?) and by how many participants hit it.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Writing a neutral task',
          body: 'The improved task gives motivation and context without revealing the interface.',
          before: "'Click the reschedule button and choose a new time.'",
          after: "'Your Tuesday physio clashes with a work meeting. Sort it out so you can still go this week.'",
        },
      ],
      practice: {
        task: 'Write and run a usability test plan for your Northfield prototype with at least three people.',
        steps: [
          'Write three scenario tasks and one comprehension follow-up question.',
          'Run sessions on a phone, recording notes in a shared template.',
          'Log each issue with what happened, how many hit it, and a severity rating.',
          'Summarise the top three findings in plain language.',
        ],
        deliverable: 'A test plan, a findings log with severity ratings, and a short summary.',
      },
      challenge: {
        task: 'Present your findings to an imagined operations lead in a five-minute readout that leads to decisions.',
        successCriteria: [
          'Findings are ordered by severity, not by the order you observed them.',
          'Each finding includes evidence (what you saw) and a recommended action.',
          'You are honest about the small sample and what it can and cannot tell you.',
          'The readout ends with a clear ask or decision.',
        ],
      },
    },
    {
      id: 'i6-iteration',
      title: 'Iteration: acting on evidence and shipping',
      summary: 'Prioritise fixes, ship with measurement in place, and close the loop so the work keeps improving after launch.',
      minutes: 20,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Iteration is not “fix everything testers said”. Take your severity-rated log and decide what must change before launch, what can ship with monitoring, and what goes to the backlog.\n\nFor Northfield: the uncertainty about the old appointment is high severity — it undermines the core principle — so the confirmation copy and review layout change before launch. The hidden “other clinicians” option moves higher on the screen and is retested quickly with two or three people.",
        },
        {
          type: 'callout',
          tone: 'why',
          body:
            'Retesting the fixes matters. A fix is a new design, and new designs can introduce new problems. A quick, small round is far cheaper than finding out after launch.',
        },
        {
          type: 'list',
          items: [
            '**Staged rollout:** release to one or two clinics first so reception can report issues directly.',
            '**Measurement ready on day one:** events for starting, abandoning and completing a change, compared with the baseline you captured earlier.',
            '**Qualitative channel:** a short prompt after confirmation, plus a weekly check-in with reception.',
            '**Decision log:** what you changed, why, and what evidence prompted it.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Be careful with attribution',
          body:
            "If call volumes drop after launch but the clinics also changed their reminder texts that month, you can't credit the redesign alone. Note concurrent changes so your later case study stays honest.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A decision log entry',
          body: 'Short, dated entries become the backbone of your case study and protect decisions from being relitigated.',
          before: "'Moved clinician option up.'",
          after:
            "'Moved “See other clinicians” above the slot grid. Why: most test participants missed it below the fold in round 1. Retested with three people; all found it. Watch after launch: share of changes that switch clinician.'",
        },
      ],
      practice: {
        task: 'Turn your test findings into an iteration plan and launch checklist for the Northfield flow.',
        steps: [
          'Sort findings into “fix before launch”, “monitor after launch” and “backlog”.',
          'Redesign the screens affected by your top two findings.',
          'Write a measurement plan naming each event and its baseline source.',
          'Start a decision log with at least four dated entries covering the whole project.',
        ],
        deliverable: 'Updated screens, a launch measurement plan and a decision log.',
      },
      challenge: {
        task: 'Write a one-page project retrospective you could later turn into a portfolio case study.',
        successCriteria: [
          'It covers the problem, your role, key decisions and what you would do differently.',
          'Outcomes are described honestly, including what is not yet known.',
          'It references artefacts from each stage of the module.',
          'It names collaborators’ contributions separately from your own.',
        ],
      },
    },
  ],
}

/* -------------------------------------------------------------------------- */
/* Module 7 — Portfolio                                                       */
/* -------------------------------------------------------------------------- */

const portfolio: Module = {
  id: 'i-m7-portfolio',
  title: 'Portfolio',
  stage: 'Portfolio',
  summary: 'Turn real project work into case studies that show how you think, what you decided and what honestly changed.',
  outcome:
    'You will be able to write and restructure case studies that hiring teams can skim in minutes and trust in detail.',
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'i7-stronger-case-studies',
      title: 'Writing stronger case studies',
      summary: 'Structure a case study around your decisions and their consequences instead of a generic process template.',
      minutes: 16,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Most intermediate portfolios fail in the same way: they walk through *empathise, define, ideate, prototype, test* with a sticky-note photo for each. Reviewers have seen that template many times, and it hides the one thing they are looking for — **your judgement**.\n\nA strong case study is organised around the problem and the decisions you made, with process shown only where it explains a decision.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Summary up top:** problem, your role, team, timeframe and outcome in a few lines.',
            '**Context and constraints:** what made this hard (technical limits, policy, deadlines).',
            '**Key insight:** the finding that changed direction.',
            '**Two or three decisions:** each with options, reasoning and result.',
            '**Outcome:** what shipped and what changed, stated honestly.',
            '**Reflection:** what you would do differently and what you learnt.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body:
            'Reviewers often skim first and read deeply only if the summary earns it. A clear opening lets a busy hiring manager decide quickly that you are worth a closer look.',
        },
        {
          type: 'doDont',
          do: [
            'State your role precisely: “I led design; worked with a PM and two engineers.”',
            'Show messy middle work when it explains a decision.',
            'Cut sections that don’t support your story.',
          ],
          dont: [
            'Include every artefact you produced.',
            'Use “we” throughout so your contribution is invisible.',
            'Open with a long paragraph about the company’s history.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Opening paragraph',
          body: 'The rewrite gives a reviewer the whole story in the first few lines.',
          before:
            "'For this project I followed the design thinking process. First I empathised with users, then I defined the problem, then I ideated…'",
          after:
            "'Patients at a clinic network were phoning reception to move appointments because the app could only cancel. As the sole designer, working with a PM and two engineers over eight weeks, I designed an in-app flow that lets patients swap to a new time without losing their original slot.'",
        },
      ],
      practice: {
        task: 'Outline a case study for your strongest project (or the Northfield project) using the six-part structure.',
        steps: [
          'Write a summary of no more than four sentences.',
          'List the constraints that genuinely shaped the work.',
          'Pick the two or three decisions that best show your judgement.',
          'Choose one artefact per decision that proves it; drop the rest.',
        ],
        deliverable: 'A case study outline with summary, decisions and chosen artefacts.',
      },
      challenge: {
        task: 'Ask someone outside design to read only your summary for thirty seconds, then explain the project back to you.',
        successCriteria: [
          'They can state the problem and your role correctly.',
          'They can name what changed as a result.',
          'You revise the summary based on anything they got wrong.',
          'The final summary contains no jargon they had to ask about.',
        ],
      },
    },
    {
      id: 'i7-storytelling',
      title: 'Storytelling in case studies',
      summary: 'Use tension, stakes and turning points so a reader follows your case study like a story, not a report.',
      minutes: 14,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Stories hold attention because something is at stake and something changes. Your case study already has these ingredients; you just need to put them in order.\n\n**Tension** is the gap between how things are and how they should be. **Stakes** are why it matters to users and the business. **Turning points** are moments where you learnt something that changed direction. **Resolution** is what you shipped and what happened.",
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Headings as story beats',
          body:
            'Replace generic headings like “Research” and “Wireframes” with the finding or decision that section delivers. A reader skimming only headings should still get the story.',
        },
        {
          type: 'list',
          items: [
            '**Show a turning point honestly:** “Our first concept assumed patients cared most about speed. Interviews showed they cared most about not losing their slot.”',
            '**Keep one protagonist problem:** side quests (a logo refresh you also did) dilute the narrative.',
            '**Pace visuals:** one strong image per beat, with a caption that says what to notice.',
            '**Include friction:** disagreements and constraints make the story credible.',
          ],
        },
        {
          type: 'quiz',
          question: 'Which heading works best as a story beat?',
          options: ['User research', 'Phase 2', 'Patients avoided cancelling because they feared losing their slot', 'Insights and learnings'],
          answer: 2,
          explanation:
            'It tells the reader what was learnt and sets up the next decision. The other headings describe activities or containers, not story.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Section headings',
          body: 'Same content, reordered around what the reader needs to know next.',
          before: "'Overview · Research · Personas · Wireframes · UI · Conclusion'",
          after:
            "'Patients phoned to move appointments · They feared losing their slot · Designing a swap, not a cancel · Making fees clear before commitment · What changed after launch'",
        },
      ],
      practice: {
        task: 'Rewrite the headings and image captions of one case study as story beats.',
        steps: [
          'List current headings and write the one-sentence point of each section.',
          'Turn each point into a heading of no more than twelve words.',
          'Identify the single turning point and make sure it has its own section.',
          'Rewrite every caption to say what the reader should notice.',
        ],
        deliverable: 'A revised heading list and captions that tell the story when skimmed.',
      },
      challenge: {
        task: 'Tell your case study aloud in ninety seconds, then compare it with the written version.',
        successCriteria: [
          'The spoken version has a clear beginning tension and resolution.',
          'You identify anything you said aloud that is missing in writing.',
          'You remove any written section you skipped naturally when speaking.',
          'The turning point is obvious in both versions.',
        ],
      },
    },
    {
      id: 'i7-impact-honestly',
      title: 'Showing impact honestly',
      summary: 'Describe outcomes truthfully with the evidence you actually have, including when there are no numbers.',
      minutes: 18,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Hiring teams want to see impact, and that pressure tempts people to inflate. Don't. Experienced interviewers will ask how a number was measured, over what period, and what else changed at the same time. An invented or stretched figure falls apart under those questions and damages your credibility for everything else.\n\nHonest impact is about matching your claim to your evidence.",
        },
        {
          type: 'list',
          items: [
            '**Measured outcomes:** quote only what was actually measured, with the timeframe and the comparison (baseline, control group or previous version).',
            '**Qualitative evidence:** usability results (“all five participants completed the task in round 2, compared with two in round 1”), stakeholder feedback shared with permission.',
            '**Delivery outcomes:** what shipped, who adopted it, components added to the design system.',
            '**No data yet:** say so, and describe what you would measure and why.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Lines not to cross',
          body:
            'Never invent numbers, present projections as results, round small effects up, or claim a team’s outcome as yours alone. If a result was under NDA, describe it only in terms you are permitted to share.',
        },
        {
          type: 'quiz',
          question: 'Which outcome statement is the most honest and still useful?',
          options: [
            'Increased bookings by 200%.',
            'Massively improved the user experience.',
            'After launch, the team saw fewer reschedule calls in the first month; a reminder-text change shipped at the same time, so we treat this as a positive signal rather than proof.',
            'Users loved it.',
          ],
          answer: 2,
          explanation:
            'It states what was observed, the timeframe and a confounding factor. Unsupported percentages and vague praise are exactly what interviewers probe.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'When you have no numbers',
          body: 'Absence of metrics is common — especially for agency, early-stage or unshipped work. Say so plainly and show your thinking instead.',
          before: "'This redesign significantly improved engagement.'",
          after:
            "'The project was paused before launch, so there is no usage data. In testing, participants completed the change flow without help, compared with repeated confusion on the old cancel-and-rebook route. If it shipped, I'd track in-app completion against reschedule calls.'",
        },
      ],
      practice: {
        task: 'Audit every impact claim in one of your case studies against the evidence you actually hold.',
        steps: [
          'Highlight every claim of outcome, improvement or success.',
          'Next to each, write the source of evidence and its timeframe.',
          'Rewrite or delete any claim without a source.',
          'Add a line naming anything that might also have influenced the result.',
        ],
        deliverable: 'A revised outcomes section in which every claim is traceable to evidence.',
      },
      challenge: {
        task: 'Ask a peer to play a sceptical interviewer and question each of your outcome claims for five minutes.',
        successCriteria: [
          'You can say how each figure was measured and over what period.',
          'You acknowledge at least one limitation without being prompted.',
          'No claim needs to be walked back during the conversation.',
          'You update the written case study with anything you had to clarify.',
        ],
      },
    },
    {
      id: 'i7-presenting-tradeoffs',
      title: 'Presenting tradeoffs',
      summary: 'Show what you gave up and why, so reviewers see judgement rather than a single inevitable answer.',
      minutes: 14,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Every real design decision costs something: time, flexibility, consistency, a stakeholder's preference. Case studies that present only the chosen option make the work look either easy or unexamined.\n\nPresenting tradeoffs well signals seniority. It tells a hiring manager you can hold several options in mind, weigh them against criteria, and commit.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Options:** two or three genuinely viable approaches (not one good option plus two straw men).',
            '**Criteria:** what mattered — user risk, build effort, policy, consistency.',
            '**Choice:** which option won and the deciding criterion.',
            '**Cost:** what you knowingly gave up.',
            '**Revisit trigger:** what evidence would make you choose differently.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body:
            'A compact comparison table works well here: options as columns, criteria as rows, short notes in each cell. Follow it with two sentences on the decision so the table doesn’t have to speak for itself.',
        },
        {
          type: 'doDont',
          do: [
            'Name constraints you didn’t control, like engineering capacity.',
            'Admit when a tradeoff was imposed rather than chosen.',
          ],
          dont: [
            'Invent alternatives after the fact to look thorough.',
            'Frame every tradeoff as a win with no downside.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Slot hold vs atomic swap',
          body: 'From the Northfield project: the tradeoff is explicit, and so is the cost.',
          before: "'We decided to hold the new slot for five minutes.'",
          after:
            "'We considered an atomic swap (safest for patients, needed backend work the team couldn't schedule) and a five-minute hold (buildable now, but slots could briefly look unavailable to others). We chose the hold to ship this quarter, accepting some blocked availability, and agreed to revisit the swap if patients reported losing holds.'",
        },
      ],
      practice: {
        task: 'Write up one significant tradeoff from a project using the five-part structure.',
        steps: [
          'Identify a decision where you seriously considered at least two options.',
          'List the criteria and note how each option scored.',
          'Write the choice, the cost and the revisit trigger.',
          'Turn it into a short table plus a two-sentence summary.',
        ],
        deliverable: 'A tradeoff section ready to paste into a case study.',
      },
      challenge: {
        task: 'Find a tradeoff that went against your recommendation and write it up professionally.',
        successCriteria: [
          'You represent the other side’s reasoning fairly.',
          'You explain what you did to reduce the downside.',
          'There is no blame or sarcasm in the writing.',
          'You state what you learnt about influencing decisions.',
        ],
      },
    },
    {
      id: 'i7-explaining-decisions',
      title: 'Explaining design decisions',
      summary: 'Connect each design choice to evidence or principles so reviewers can follow your reasoning, not just your output.',
      minutes: 14,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "A screenshot shows *what* you designed. Reviewers are hiring for *why*. The gap between junior and intermediate case studies is often just this: whether each visual is accompanied by reasoning.\n\nA useful pattern is **context → decision → because → result**. Keep it short; a decision explanation rarely needs more than three sentences.",
        },
        {
          type: 'list',
          items: [
            '**Research evidence:** “Test participants missed the option below the fold, so…”',
            '**Principle:** “Our principle was never to put an existing booking at risk, so…”',
            '**Constraint:** “The API couldn’t return other clinicians’ availability in one call, so…”',
            '**Convention:** “We followed the platform’s standard date-picker pattern because patients already know it.”',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body:
            'Explaining the type of reason matters. “Because users said so” and “because engineering could only build this” are both valid, but they invite different follow-up questions — and interviewers will ask them.',
        },
        {
          type: 'checklist',
          title: 'Decision explanation check',
          items: [
            'The reason is specific to this project, not a generic best practice.',
            'It is clear whether “I” or “we” made the call.',
            'Collaborators who shaped the decision are credited.',
            'The result or open question is stated.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Captioning a screen',
          body: 'The rewrite turns a description into a decision.',
          before: "'The review screen shows the old and new appointment.'",
          after:
            "'Patients in research were unsure whether their original slot was safe, so I placed the old and new appointments side by side before confirming. In round 2 testing, nobody asked what had happened to their old booking.'",
        },
      ],
      practice: {
        task: 'Rewrite the captions for every major screen in one case study using context → decision → because → result.',
        steps: [
          'List each screen or artefact in the case study.',
          'Write the decision it represents in one sentence.',
          'Add the type of reason (evidence, principle, constraint, convention).',
          'Add the result, or say it is unknown.',
        ],
        deliverable: 'Rewritten captions for every major visual in the case study.',
      },
      challenge: {
        task: 'Pick your most “obvious” decision and explain why it wasn’t obvious — what else you could have done.',
        successCriteria: [
          'You identify at least one credible alternative.',
          'Your explanation stays under 80 words.',
          'The reasoning would survive a “why not X?” question.',
          'You credit anyone who influenced the call.',
        ],
      },
    },
    {
      id: 'i7-improve-weak-case-study',
      title: 'Improving a weak case study',
      summary: 'Diagnose the common weaknesses in a real-looking case study and rewrite it section by section.',
      minutes: 20,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "This lesson pulls the module together. Rather than starting fresh, you will take an existing weak case study and improve it — which is what you will actually do with your own portfolio.\n\nWork in two passes: **diagnose** first (without editing), then **rewrite** section by section. Editing while diagnosing tends to produce polished sentences on top of a broken structure.",
        },
        {
          type: 'checklist',
          title: 'Diagnosis checklist',
          items: [
            'Can a reader tell the problem and your role within the first screen?',
            'Is the structure a process template rather than a story?',
            'Are there decisions with reasoning, or only deliverables?',
            'Are impact claims backed by evidence?',
            'Are tradeoffs and constraints visible?',
            'Is there a reflection that shows learning?',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body:
            'Cutting is usually the biggest improvement. Most weak case studies are too long because they include every step. Aim to remove more than you add.',
        },
        {
          type: 'text',
          body:
            "When rewriting, keep the facts fixed. You are allowed to reorganise, clarify and cut — not to add achievements that didn't happen. If a section is weak because the evidence is thin, the honest fix is to say what you learnt and what you'd measure, not to embellish.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Rewrite: opening and role',
          body: 'The weak version hides the problem and the designer’s contribution. The rewrite states both immediately.',
          before:
            "'Northfield Health is a leading healthcare provider. We wanted to improve the booking experience. We did lots of research and made personas and wireframes, then designed a beautiful new UI that users loved.'",
          after:
            "'Patients at Northfield Health's clinics could cancel in the app but not change an appointment, so many phoned reception instead. I was the product designer, working with a PM and two engineers. I led research, flow and UI design for an in-app rescheduling flow.'",
        },
        {
          type: 'example',
          title: 'Rewrite: outcome and reflection',
          body: 'The rewrite replaces an unverifiable claim with real evidence and an honest limitation.',
          before: "'The result was a 60% increase in user satisfaction and the client was extremely happy.'",
          after:
            "'In two rounds of testing, participants completed the flow without help after we redesigned the review step. The flow launched at two pilot clinics; I left before usage data was available, so I can't report outcomes. Next time I'd agree the baseline measurement before design starts.'",
        },
      ],
      practice: {
        task: 'Diagnose and rewrite your own weakest case study, or the Northfield retrospective from the previous module.',
        steps: [
          'Run the diagnosis checklist and note every failing item without editing.',
          'Restructure the headings as story beats.',
          'Rewrite the opening, one decision section and the outcome section.',
          'Cut at least a quarter of the original length.',
        ],
        deliverable: 'A side-by-side document showing the original and the rewritten case study.',
      },
      challenge: {
        task: 'Get the rewritten case study reviewed by a designer more senior than you and act on their feedback.',
        successCriteria: [
          'You ask specific questions rather than “what do you think?”.',
          'You log each piece of feedback and decide to act, defer or decline.',
          'You make at least two changes as a result.',
          'All facts and outcomes remain accurate after edits.',
        ],
      },
    },
  ],
}

/* -------------------------------------------------------------------------- */
/* Module 8 — Career                                                          */
/* -------------------------------------------------------------------------- */

const career: Module = {
  id: 'i-m8-career',
  title: 'Career',
  stage: 'Career',
  summary: 'Prepare for the product design hiring process, from your resume and LinkedIn to interviews and negotiation.',
  outcome:
    'You will be able to present yourself truthfully and confidently at every stage of a design hiring process.',
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'i8-resume-optimisation',
      title: 'Resume optimisation',
      summary: 'Rewrite your resume so each line shows scope, contribution and truthful outcomes for the roles you want.',
      minutes: 16,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "A design resume has one job: get someone to open your portfolio. Recruiters often skim quickly, so each line must carry weight.\n\nThe common intermediate mistake is listing responsibilities (“Responsible for designing features”) rather than contributions. Responsibilities describe the job; contributions describe *you*.",
        },
        {
          type: 'list',
          items: [
            '**Bullet pattern:** action + what + for whom or where + outcome or evidence.',
            '**Tailor:** reorder bullets so the most relevant experience for each role comes first.',
            '**Simple layout:** standard headings, real text (not images of text), one column — easier for people and for applicant tracking systems to read.',
            '**Portfolio link:** near the top, working, and pointing to the case studies that match the role.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Truth is the strategy',
          body:
            'Do not inflate titles, invent metrics or claim sole credit for team work. Every line is interview material, and you will be asked about it. A modest, specific bullet you can defend beats an impressive one you can’t.',
        },
        {
          type: 'doDont',
          do: [
            'Use outcomes you can evidence, or describe what shipped.',
            'Name tools only when relevant to the role.',
            'Keep it to one or two pages.',
          ],
          dont: [
            'Use skill bars or ratings (“Figma 90%”).',
            'Write in paragraphs recruiters must dig through.',
            'List every tool you have ever opened.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Rewriting a bullet',
          body: 'The rewrite is specific and verifiable, and it survives follow-up questions.',
          before: "'Responsible for UX of booking app. Improved conversion by 45%.' (no source for the figure)",
          after:
            "'Designed an in-app rescheduling flow for a clinic booking product, from research to launch at two pilot clinics; replaced a cancel-and-rebook route that patients found risky in testing.'",
        },
      ],
      practice: {
        task: 'Rewrite your five most important resume bullets using the bullet pattern.',
        steps: [
          'Paste your current bullets into a document.',
          'For each, underline the action, the what, the where and the evidence.',
          'Rewrite any bullet missing a part, or cut it.',
          'Check every claim against evidence you could show an interviewer.',
        ],
        deliverable: 'Five rewritten bullets, each defensible in an interview.',
      },
      challenge: {
        task: 'Tailor your resume for two different job descriptions and compare the versions.',
        successCriteria: [
          'The order of bullets changes to match each role’s priorities.',
          'No new claims appear that aren’t true.',
          'Each version links to the most relevant case study.',
          'Both versions read cleanly as plain text.',
        ],
      },
    },
    {
      id: 'i8-linkedin-optimisation',
      title: 'LinkedIn optimisation',
      summary: 'Make your LinkedIn profile a consistent, searchable signpost to your portfolio and the roles you want.',
      minutes: 12,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Recruiters search LinkedIn by role titles and skills, then glance at your headline, photo and summary before deciding whether to message you. Your profile doesn't need to be clever; it needs to be clear, consistent with your resume, and point to your work.",
        },
        {
          type: 'list',
          items: [
            '**Headline:** role you want + focus area + something specific (domain or strength).',
            '**About:** three short paragraphs — what you do, the kind of problems you like, what you’re looking for — plus a portfolio link.',
            '**Featured:** pin two or three case studies or a portfolio link.',
            '**Experience:** match titles and dates to your resume; use short outcome-focused bullets.',
            '**Job preferences:** LinkedIn lets you signal you’re open to work, including options that limit visibility — check the current settings before choosing.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body:
            'Posting about your work is optional but helpful: a short breakdown of a design decision shows your thinking. Only share what you are permitted to under any NDA, and never post client work without consent.',
        },
        {
          type: 'doDont',
          do: ['Use the role title recruiters actually search for (e.g. “Product Designer”).', 'Keep the tone human and specific.'],
          dont: ['Stack buzzwords (“Visionary | Ninja | Guru”).', 'Let your LinkedIn and resume disagree on titles or dates.'],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Headline',
          body: 'The rewrite is searchable, specific and honest about level.',
          before: "'Creative thinker | Passionate about design | Looking for opportunities'",
          after: "'Product Designer · Healthcare & booking flows · Research-led UX and UI'",
        },
      ],
      practice: {
        task: 'Update your LinkedIn headline, About section and Featured items.',
        steps: [
          'Collect three or four job titles you’re targeting and pick the most common term.',
          'Write a headline using role + focus + specific strength.',
          'Draft a three-paragraph About section ending with your portfolio link.',
          'Pin your two strongest case studies to Featured.',
        ],
        deliverable: 'An updated profile consistent with your resume.',
      },
      challenge: {
        task: 'Write and publish a short post explaining one design decision from a project you can share.',
        successCriteria: [
          'It explains the context, decision and reasoning in under 200 words.',
          'It respects confidentiality and credits collaborators.',
          'It includes one visual with a caption.',
          'It avoids exaggerated claims.',
        ],
      },
    },
    {
      id: 'i8-portfolio-review',
      title: 'Getting a useful portfolio review',
      summary: 'Ask for reviews in a way that gets specific, actionable feedback — and decide what to do with it.',
      minutes: 12,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "“Can you look at my portfolio?” usually gets polite, vague encouragement. Reviewers give better feedback when they know the context: what role you're targeting, which case study to focus on, and what you're unsure about.\n\nGood reviewers include designers a level or two above your target role, hiring managers, and design mentors. If you'd like a structured review, you can book a 1:1 with Harikrishna.",
        },
        {
          type: 'checklist',
          title: 'A strong review request includes',
          items: [
            'The role and type of company you’re targeting.',
            'One or two case studies to focus on, with links.',
            'Two or three specific questions.',
            'A realistic time ask (for example, fifteen minutes).',
            'Thanks and an easy way to say no.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body:
            'Specific questions respect the reviewer’s time and make it easier to say yes. They also make feedback comparable across reviewers, so you can spot patterns.',
        },
        {
          type: 'text',
          body:
            "When feedback arrives, don't defend — ask clarifying questions and take notes. Afterwards, triage each point: **act** (several reviewers agree, or it’s clearly right), **test** (plausible, try it), or **decline** (conflicts with your goals; that's allowed). Close the loop by thanking the reviewer and sharing what you changed.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Review request message',
          body: 'The rewrite gives context, a focus and a small ask.',
          before: "'Hi, could you review my portfolio and tell me what you think?'",
          after:
            "'Hi Sam — I'm applying for mid-level product design roles at healthtech companies. Could you spend 15 minutes on my rescheduling case study? I'm unsure whether the outcome section is convincing and whether the tradeoffs come through. Completely fine if you're too busy.'",
        },
      ],
      practice: {
        task: 'Request reviews from two people and triage the feedback you receive.',
        steps: [
          'Write your targeted request using the checklist.',
          'Send it to two reviewers at different experience levels.',
          'Log every point of feedback in a table.',
          'Mark each as act, test or decline with a reason.',
        ],
        deliverable: 'A feedback log with a triage decision for each point.',
      },
      challenge: {
        task: 'Run a “silent review”: watch someone look through your portfolio without explanation and note what they do.',
        successCriteria: [
          'You say nothing while they browse.',
          'You record where they slowed down, skipped or got confused.',
          'You compare their behaviour with what they say afterwards.',
          'You make at least one structural change as a result.',
        ],
      },
    },
    {
      id: 'i8-recruiter-communication',
      title: 'Recruiter communication',
      summary: 'Communicate clearly and professionally with in-house and agency recruiters from first message to decision.',
      minutes: 12,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Recruiters are partners in the process, not gatekeepers to outsmart. **In-house recruiters** work for the company hiring; **agency recruiters** represent several clients. Both want a good match, but agency recruiters may put you forward for several roles, so be clear about where your details can be sent.\n\nReply promptly, even if the answer is no. Recruiters remember candidates who were pleasant to work with.",
        },
        {
          type: 'list',
          items: [
            'What is the team working on, and where would this role focus?',
            'What level is the role, and who would I report to?',
            'What are the interview stages, and is there a portfolio presentation or take-home?',
            'What is the working pattern (remote, hybrid, on-site)?',
            'What is the salary range for the role?',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body:
            'Keep a simple tracker: company, role, recruiter, stage, next step and date. It stops you mixing up processes and lets you follow up on time.',
        },
        {
          type: 'doDont',
          do: [
            'Follow up politely if you haven’t heard back after the agreed time.',
            'Ask an agency recruiter to confirm before sending your details anywhere.',
            'Decline clearly and warmly when a role isn’t right.',
          ],
          dont: [
            'Ghost a recruiter mid-process.',
            'Exaggerate competing offers to create urgency.',
            'Share confidential details from other interview processes.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Declining without closing the door',
          body: 'Brief, honest and keeps the relationship.',
          before: "(no reply)",
          after:
            "'Thanks for thinking of me, Alex. I'm focusing on product roles in healthcare right now, so this one isn't the right fit, but I'd be glad to hear about similar roles in future.'",
        },
      ],
      practice: {
        task: 'Set up a job-search tracker and draft three reusable message templates.',
        steps: [
          'Create a tracker with columns for company, role, contact, stage, next step and date.',
          'Draft a reply expressing interest and asking your key questions.',
          'Draft a polite follow-up message.',
          'Draft a warm decline.',
        ],
        deliverable: 'A tracker and three message templates you can adapt.',
      },
      challenge: {
        task: 'Role-play a first recruiter call with a friend and practise summarising yourself in sixty seconds.',
        successCriteria: [
          'Your summary covers current role, strengths and what you’re looking for.',
          'You ask at least three questions from the list.',
          'You handle a salary expectations question without being caught off guard.',
          'You agree clear next steps before ending.',
        ],
      },
    },
    {
      id: 'i8-interview-preparation',
      title: 'Interview preparation',
      summary: 'Prepare stories, a portfolio presentation and questions so you can perform consistently across an interview loop.',
      minutes: 18,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Design interview loops vary, but often include a recruiter screen, a hiring manager conversation, a portfolio presentation, a design exercise (app critique, whiteboard or take-home), and interviews with product managers or engineers. Ask the recruiter what yours involves — it's a normal question.\n\nPreparation is about reducing surprises so your thinking, not your nerves, is what the panel sees.",
        },
        {
          type: 'list',
          items: [
            '**Story bank:** six to eight short stories covering conflict, a mistake, influencing without authority, a hard tradeoff, working with engineers, and handling ambiguous requirements.',
            '**Story structure:** situation, what you did, what happened, what you learnt — keep each to about two minutes.',
            '**Portfolio presentation:** usually one or two case studies, rehearsed to fit the time given with space for questions.',
            '**Company research:** use their product, note strengths and questions, understand their users and business model.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body:
            'Panels often compare notes on the same competencies. Having a prepared story for each lets you give concrete answers instead of generalities like “I’m a good communicator”.',
        },
        {
          type: 'checklist',
          title: 'Day-before checklist',
          items: [
            'Presentation rehearsed aloud with a timer.',
            'Links and files open without login problems; screen-share tested.',
            'Three thoughtful questions ready for each interviewer.',
            'Story bank reviewed; each story is true and specific.',
            'Notes on the company’s product and recent changes.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Answering a behavioural question',
          body: 'The rewrite uses a real situation with a specific action and outcome.',
          before: "'Tell me about a disagreement.' → 'I usually try to find common ground with everyone.'",
          after:
            "'Our PM wanted to ship rescheduling without the review step to save time. I shared clips from testing where patients were unsure about their old booking, and proposed a simpler review screen that took less build time. We shipped it, and I learnt to bring evidence rather than opinions to those conversations.'",
        },
      ],
      practice: {
        task: 'Build your story bank and rehearse one portfolio presentation.',
        steps: [
          'Write six stories in bullet form using situation, action, result, learning.',
          'Map each story to the competencies it demonstrates.',
          'Rehearse a case study presentation aloud to a timer.',
          'Write three questions to ask each type of interviewer.',
        ],
        deliverable: 'A story bank document and a timed presentation outline.',
      },
      challenge: {
        task: 'Run a mock interview with a peer who asks unexpected follow-up questions.',
        successCriteria: [
          'You answer with a specific story at least four times.',
          'You stay within time on the portfolio presentation.',
          'You say “I don’t know” honestly when appropriate and explain how you’d find out.',
          'You collect written feedback and note two improvements.',
        ],
      },
    },
    {
      id: 'i8-take-home-exercises',
      title: 'Take-home design exercises',
      summary: 'Approach take-home exercises with clear assumptions, focused scope and visible reasoning within a fair time box.',
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Take-homes test how you frame a fuzzy problem, make decisions with limited information and communicate them. They are not a test of how many polished screens you can produce.\n\nBefore starting, check it is reasonable: a stated time expectation, a clear deadline, and a brief that is hypothetical rather than the company's live roadmap. If it looks like unpaid production work, it's fair to ask about scope or compensation, or to decline.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Clarify:** send a few questions early; if no answers come, document your assumptions.',
            '**Frame:** restate the problem, user and success criteria in your own words.',
            '**Scope:** pick the most important flow and go deep, rather than touching everything lightly.',
            '**Design:** show key screens, not every screen; include at least one edge case.',
            '**Explain:** assumptions, decisions, tradeoffs, and what you would do with more time or real research.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          body:
            'Respect the time box. Spending far longer than asked can create a misleading impression of what you’d deliver under normal conditions, and it isn’t fair to you. If you went over, say so.',
        },
        {
          type: 'doDont',
          do: ['State assumptions openly.', 'Lead with a one-page summary.', 'Show rough work that explains a decision.'],
          dont: [
            'Invent user research findings to justify decisions.',
            'Hide scope cuts — explain them.',
            'Submit only final UI with no reasoning.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Stating assumptions',
          body: 'The rewrite is honest about what’s assumed and why it’s reasonable.',
          before: "'Users want to reschedule quickly.'",
          after:
            "'Assumption (no research available): most reschedules happen within a few days of the appointment, so I prioritised showing the next available slots first. I'd validate this with booking data before building.'",
        },
      ],
      practice: {
        task: 'Complete a three-hour take-home: design a way for patients to join a waitlist for earlier appointments at a clinic.',
        steps: [
          'Spend fifteen minutes writing clarifying questions and assumptions.',
          'Write a short problem framing with success criteria.',
          'Design the core flow plus one edge case.',
          'Write a one-page summary of decisions, tradeoffs and next steps.',
        ],
        deliverable: 'A time-boxed submission with a summary page and key screens.',
      },
      challenge: {
        task: 'Present your take-home to a peer in fifteen minutes as if in a follow-up interview.',
        successCriteria: [
          'You start with the problem framing, not the UI.',
          'You defend at least one tradeoff under questioning.',
          'You name what you’d research first with more time.',
          'You finish within the time limit.',
        ],
      },
    },
    {
      id: 'i8-product-design-interviews',
      title: 'Whiteboard challenges and app critiques',
      summary: 'Use a clear structure for live design exercises so interviewers can follow your thinking in real time.',
      minutes: 20,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Live exercises assess how you think under ambiguity and how you collaborate. Interviewers are usually more interested in your questions and reasoning than in the final sketch. **Think aloud** — silence leaves them guessing.\n\nThere are two common formats: a **whiteboard challenge** (design something from a prompt) and an **app critique** (evaluate an existing product).",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Whiteboard — clarify:** who is the user, what is the goal, what platform, any constraints?',
            '**Scope:** pick one user and one key scenario, and say why.',
            '**Flow:** outline the steps before sketching screens.',
            '**Sketch:** key screens only; label decisions as you go.',
            '**Evaluate:** name risks, edge cases and how you’d measure success.',
          ],
        },
        {
          type: 'text',
          body:
            "**For an app critique**, start with context: who the app is for and what the business likely needs from it. Then choose one core task and walk through it. Name strengths first, then issues — using recognised principles such as usability heuristics — and prioritise them by user impact. Finish with one or two improvements you'd make and how you'd validate them.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body:
            'Treat the interviewer as a collaborator. Asking “Would you like me to go deeper here or move on?” shows awareness of time and makes the session feel like real teamwork.',
        },
        {
          type: 'link',
          url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
          title: '10 Usability Heuristics for User Interface Design',
          description: 'Nielsen Norman Group — a shared vocabulary for app critiques.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Opening a whiteboard challenge',
          body: 'The rewrite spends the first minutes framing the problem instead of drawing.',
          before: "Prompt: 'Design a parking app.' → Candidate immediately draws a map screen.",
          after:
            "Prompt: 'Design a parking app.' → 'Before I sketch: is this for drivers finding spaces or operators managing them? City centre or airports? I'll assume commuters in a city centre who need to pay quickly — tell me if you'd prefer another focus.'",
        },
      ],
      practice: {
        task: 'Run one whiteboard challenge and one app critique on yourself, recorded, in thirty minutes each.',
        steps: [
          'Whiteboard prompt: “Design a way for gym members to book classes.” Follow the five steps aloud.',
          'Critique: pick a food delivery app and evaluate the reorder flow using heuristics.',
          'Watch both recordings and note silent gaps or skipped steps.',
          'Write down three phrases you’ll use to structure future sessions.',
        ],
        deliverable: 'Two recordings plus self-review notes.',
      },
      challenge: {
        task: 'Do a live whiteboard challenge with a peer who plays an interviewer and changes a constraint halfway through.',
        successCriteria: [
          'You ask clarifying questions before sketching.',
          'You adapt to the new constraint and explain the impact.',
          'You end with success measures and risks.',
          'Your peer can summarise your reasoning afterwards.',
        ],
      },
    },
    {
      id: 'i8-salary-negotiation',
      title: 'Salary negotiation fundamentals',
      summary: 'Apply the core principles of negotiating an offer respectfully, based on research rather than guesswork.',
      minutes: 14,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body:
            "Negotiation is a normal part of hiring, and doing it professionally rarely harms an offer. The goal is a fair agreement you'll be happy with, not winning.\n\nThis lesson covers principles only. Pay varies widely by location, company, level and market conditions, so any number you use must come from your own current research.",
        },
        {
          type: 'list',
          items: [
            '**Research ranges:** published salary ranges in job adverts (required in some places), reputable salary surveys, and conversations with peers you trust.',
            '**Know total compensation:** base salary, bonus, equity, pension, leave, learning budget, flexibility and working pattern.',
            '**Understand the role first:** where possible, discuss numbers once you know the level and scope.',
            '**Know your walk-away point** before any conversation.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Stay honest',
          body:
            'Never invent a competing offer or misstate your current pay. Rules about salary-history questions differ between countries and regions, so check what applies where you live — you can often decline to share it politely.',
        },
        {
          type: 'doDont',
          do: [
            'Thank them for the offer and ask for it in writing.',
            'Ask for time to consider — a few days is a common request.',
            'Anchor on the value of the role and your research, not personal needs.',
            'Consider non-salary levers if base pay is fixed.',
          ],
          dont: [
            'Accept or reject on the spot under pressure.',
            'Issue ultimatums you don’t mean.',
            'Negotiate after accepting.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Responding to an offer',
          body: 'Warm, specific, grounded in research and leaves room to agree.',
          before: "'That's lower than I wanted. Can you do better?'",
          after:
            "'Thank you — I'm excited about the role. Based on my research for this level and location, and the scope we discussed, I was expecting a base salary towards the upper part of the range. Is there flexibility there, or in the learning budget?'",
        },
      ],
      practice: {
        task: 'Prepare a negotiation plan for a role you are targeting.',
        steps: [
          'Gather ranges from at least three reliable sources and note where each came from.',
          'List the parts of total compensation that matter most to you, in order.',
          'Write your target, your acceptable range and your walk-away point.',
          'Draft your response to an offer using the example’s structure.',
        ],
        deliverable: 'A one-page negotiation plan with sourced research and a scripted response.',
      },
      challenge: {
        task: 'Role-play an offer conversation with a friend playing a recruiter who says the base salary is fixed.',
        successCriteria: [
          'You stay calm and appreciative throughout.',
          'You pivot to at least one non-salary lever.',
          'You make no claims you couldn’t back up.',
          'You end with clear next steps and a timeline.',
        ],
      },
    },
  ],
}

export const intermediatePractice: Course = {
  id: 'i-practice-career',
  title: 'Practice, Portfolio & Career',
  description:
    'Run a complete product design project, turn real work into honest case studies, and prepare confidently for every stage of the hiring process.',
  published: true,
  modules: [productWorkflow, portfolio, career],
}
