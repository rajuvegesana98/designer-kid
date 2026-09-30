import type { Course, Module } from '../types'

const ADDED = '2026-09-01'

/* ------------------------------------------------------------------ */
/* Module 1 — Product Thinking                                         */
/* ------------------------------------------------------------------ */

const productThinking: Module = {
  id: 'i-m1-product-thinking',
  title: 'Product Thinking',
  stage: 'Product',
  summary: "Move from designing screens to shaping outcomes: goals, metrics, framing and what to build next.",
  outcome: "You'll be able to connect every design decision to a user need, a business goal and a measurable signal.",
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'i1-product-goals',
      title: 'Product goals',
      summary: "Turn a vague product ambition into a goal that a design team can actually steer by.",
      minutes: 12,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "A product goal describes the change the product should create over a period of time, not the features it will ship. 'Launch a new invoicing flow' is a deliverable. 'Freelancers get paid without chasing clients' is a goal, and it leaves room for the team to discover the best way to get there.\n\nGood product goals sit between company strategy and day-to-day design work. They are specific enough to rule options out, but open enough that design can propose something nobody has thought of yet.",
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why designers should care',
          body: "Without a clear goal, design reviews collapse into taste debates. With one, you can ask 'does this move us towards the goal?' and settle most arguments in minutes.",
        },
        {
          type: 'list',
          items: [
            "**Outcome, not output** — describes a change in behaviour or experience, not a feature.",
            "**Bounded in time** — a quarter or half-year, so you can tell whether it worked.",
            "**Observable** — you can name at least one signal that would show progress.",
            "**Owned** — one team can meaningfully influence it.",
          ],
        },
        {
          type: 'doDont',
          do: [
            "Phrase goals from the customer's point of view where you can.",
            "Keep to one to three goals per team per cycle.",
            "Revisit goals when you learn something that changes the picture.",
          ],
          dont: [
            "Disguise a roadmap item as a goal ('Ship dark mode').",
            "Write goals so broad every idea qualifies ('Delight users').",
            "Set goals no single team can influence.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'B2B expense tool',
          body: "A spend-management SaaS wants finance teams to close the month faster. The design team reframed a feature request into a goal it could explore with several solutions: smarter receipt matching, earlier reminders, and a reconciliation view.",
          before: "Goal: Build bulk receipt upload.",
          after: "Goal: Finance admins can reconcile a month of card spend in one sitting, without chasing employees for receipts.",
        },
      ],
      practice: {
        task: "Rewrite three feature-shaped roadmap items from a product you know into outcome-shaped product goals.",
        steps: [
          "Pick a product you use at work or daily (a banking app, a project tool, a delivery app).",
          "List three features it has recently shipped or announced.",
          "For each, ask 'what change was this meant to create, and for whom?'",
          "Rewrite each as an outcome goal using the four qualities above.",
          "Note one signal per goal that would show progress.",
        ],
        deliverable: "A short doc with three before/after goal pairs and one progress signal each.",
      },
      challenge: {
        task: "Draft a one-page goal brief for a team you are on (or an imagined one), including goal, owner, time frame, signals and explicit non-goals.",
        successCriteria: [
          "The goal describes an outcome, not a feature.",
          "At least two non-goals are listed to show what the team will not pursue.",
          "Each signal could realistically be observed within the time frame.",
          "A colleague could use the brief to reject at least one current idea.",
        ],
      },
    },
    {
      id: 'i1-business-goals',
      title: 'Business goals',
      summary: "Understand how revenue, cost and risk goals shape design decisions, and how to design for them honestly.",
      minutes: 13,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Every product exists inside a business model. Most business goals fall into a few families: **grow revenue** (acquire, convert, expand, retain), **reduce cost** (fewer support tickets, less manual operations work), and **manage risk** (compliance, fraud, security, reputation).\n\nDesigners who can name which family a request belongs to earn a seat in prioritisation conversations. 'This redesign reduces payment-failure tickets' lands very differently from 'this looks cleaner'.",
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Business goals are not the enemy of good UX. In healthy products, the business wins when users succeed. Your job is to find the version of the solution where both happen, and to flag clearly when they do not.",
        },
        {
          type: 'list',
          items: [
            "**Acquisition** — sign-up and onboarding flows, marketing pages, referral loops.",
            "**Activation and conversion** — trial-to-paid, first transaction, checkout completion.",
            "**Expansion** — seat growth, plan upgrades, add-ons in B2B SaaS.",
            "**Retention** — habit loops, reliability, fewer reasons to leave.",
            "**Cost to serve** — self-serve fixes, clearer errors, fewer manual reviews.",
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Watch for dark patterns',
          body: "Hidden cancellation, pre-ticked add-ons and confirm-shaming can lift a short-term number while eroding trust, and in many markets they create regulatory risk. Name the trade-off in the room rather than quietly shipping it.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Subscription cancellation in a fintech app',
          body: "A budgeting app wanted to reduce churn. The first proposal buried cancellation three levels deep. The designer reframed the goal as 'retain users who would benefit from staying' and proposed a pause option and a downgrade path, while keeping cancel easy to find.",
          before: "Cancel hidden under Settings > Account > Billing > Manage > More options.",
          after: "Cancel visible in Billing, with 'Pause for 3 months' and 'Switch to free plan' offered alongside it.",
        },
      ],
      practice: {
        task: "Map the business goals behind three screens of a product you use.",
        steps: [
          "Screenshot three screens: one onboarding, one core task, one billing or settings.",
          "For each, label which business goal family it mainly serves.",
          "Note the user goal on the same screen.",
          "Mark where the two are aligned and where they pull against each other.",
        ],
        deliverable: "An annotated board of three screens with business and user goals labelled.",
      },
      challenge: {
        task: "Redesign one flow where a business goal currently works against users, so both goals are served.",
        successCriteria: [
          "The original tension is stated in one sentence.",
          "The redesign keeps the user's primary task easy and honest.",
          "The business goal is still plausibly supported, with the reasoning written down.",
          "No dark pattern is introduced.",
        ],
      },
    },
    {
      id: 'i1-user-goals',
      title: 'User goals',
      summary: "Separate what users ask for from what they are trying to achieve, and design for the real goal.",
      minutes: 12,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Users describe solutions; they rarely describe goals. An account manager who asks for 'an export to Excel button' usually wants to **prove the value of the account to their boss** before a renewal meeting. Export is one way to do that; a shareable summary might be a better one.\n\nA useful model is to separate goals into layers: the **task** (export this table), the **job** (prepare for the renewal meeting), and the **motivation** (look competent and keep the client).",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            "Ask what happens right before and right after the request.",
            "Ask what they do today, with the workaround they already use.",
            "Ask what 'done' looks like to them, in their words.",
            "Look for the emotional stake: fear, pressure, status, time.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Workarounds are the best evidence of real goals. A spreadsheet maintained alongside your product is a map of what the product fails to do.",
        },
        {
          type: 'quiz',
          question: "A marketplace seller asks for 'more filters on the orders page'. What is the most useful next question?",
          options: [
            "Which filters do you want?",
            "What are you trying to find when you open the orders page?",
            "Would you pay for advanced filters?",
            "Do you prefer dropdowns or chips?",
          ],
          answer: 1,
          explanation: "It moves from the requested solution to the underlying goal. The seller might be hunting for late shipments, which a 'needs attention' view could solve better than filters.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Internal support tool',
          body: "Support agents asked for a bigger search box. Shadowing revealed that their real goal was to find the customer's last failed payment within seconds while the customer was on the phone. The team added a customer timeline that surfaced recent failures at the top.",
          before: "Request logged: 'Make search bigger.'",
          after: "Goal captured: 'While on a call, see why this customer's last payment failed in under a glance.'",
        },
      ],
      practice: {
        task: "Take three feature requests (from a backlog, app-store reviews or forum posts) and dig down to the underlying goals.",
        steps: [
          "Collect three real feature requests.",
          "For each, write the task, the job and the motivation.",
          "Identify any workaround users mention.",
          "Suggest one alternative solution per goal that differs from the request.",
        ],
        deliverable: "A three-row table: request, task, job, motivation, alternative solution.",
      },
      challenge: {
        task: "Run two short conversations with users of any tool and write user goal statements from what you hear.",
        successCriteria: [
          "Each goal statement is in the user's language, not product language.",
          "At least one goal differs from what the user first asked for.",
          "Each statement includes the context in which the goal arises.",
        ],
      },
    },
    {
      id: 'i1-product-metrics',
      title: 'Product metrics',
      summary: "Choose metrics that reflect real user value, pair them with guardrails, and avoid vanity numbers.",
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Metrics are how a team knows whether design changes worked. The trap is measuring what is easy rather than what matters. Page views, total sign-ups and time on page often rise while the product gets worse.\n\nA practical structure is a **primary metric** tied to the goal, a few **input metrics** the team can move directly, and **guardrail metrics** that must not get worse.",
        },
        {
          type: 'list',
          items: [
            "**Primary** — e.g. percentage of new workspaces that invite a teammate in week one.",
            "**Inputs** — invite-screen reach, invite completion rate, time to first invite.",
            "**Guardrails** — support tickets, unsubscribe rate, task error rate.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Any metric that becomes a target gets gamed, sometimes by the design itself. Guardrails keep you honest: if invites go up but spam complaints also rise, you have not succeeded.",
        },
        {
          type: 'doDont',
          do: [
            "Prefer rates and ratios to raw totals.",
            "Define the metric precisely (who counts, over what window).",
            "Pair quantitative signals with qualitative evidence.",
          ],
          dont: [
            "Treat 'time on page' as good by default; confusion also increases it.",
            "Pick metrics after launch to make results look good.",
            "Report a number without its baseline.",
          ],
        },
        {
          type: 'text',
          body: "Frameworks such as Google's HEART (Happiness, Engagement, Adoption, Retention, Task success) help you brainstorm candidates, but the decision is always which few signals best reflect *this* goal.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Food delivery reorder feature',
          body: "A delivery app added a 'reorder' shortcut. Measuring clicks on the shortcut would always look positive. The team instead tracked repeat-order completion time and checked a guardrail on order-accuracy complaints.",
          before: "Success metric: Reorder button clicks.",
          after: "Success metric: Median time from app open to confirmed repeat order, with order-issue reports as a guardrail.",
        },
      ],
      practice: {
        task: "Build a metric set for one product goal from the earlier lesson.",
        steps: [
          "Write the goal at the top of a page.",
          "Choose one primary metric and define it precisely.",
          "List two or three input metrics design can influence.",
          "Add two guardrails and explain what harm each protects against.",
        ],
        deliverable: "A one-page metric definition with primary, inputs and guardrails.",
      },
      challenge: {
        task: "Critique the metrics of a real case study or product announcement and propose a better set.",
        successCriteria: [
          "At least one vanity metric is identified with a clear reason.",
          "The proposed primary metric links directly to user value.",
          "Guardrails are included.",
          "No invented numbers are used; only definitions and reasoning.",
        ],
      },
    },
    {
      id: 'i1-problem-framing',
      title: 'Problem framing',
      summary: "Write problem statements that focus a team, expose assumptions and leave room for good solutions.",
      minutes: 14,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "How a problem is framed decides which solutions a team will consider. 'Users cannot find the export button' leads to moving a button. 'Account managers struggle to show value before renewals' opens up reports, dashboards, automated summaries and more.\n\nA strong frame names **who** is affected, **what** they are trying to do, **what gets in the way**, and **why it matters** to them and to the business.",
        },
        {
          type: 'example',
          title: 'A reusable template',
          body: "[User] needs a way to [goal] because [reason/context]. Today, [obstacle], which leads to [consequence]. We will know we've improved this when [signal].",
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Reframe on purpose',
          body: "Write three versions of the same problem: one narrow, one broad, one from a different stakeholder's point of view. Choosing between them is a strategic conversation worth having explicitly.",
        },
        {
          type: 'checklist',
          title: 'Frame health check',
          items: [
            "No solution is baked into the statement.",
            "The affected user is specific, not 'users'.",
            "Evidence is referenced, or the frame is labelled as an assumption.",
            "The consequence explains why it's worth solving now.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'HR platform onboarding',
          body: "An HR SaaS team was asked to 'redesign the onboarding checklist'. Reframing around new starters' managers uncovered that the real friction was equipment and access requests landing too late.",
          before: "Problem: The onboarding checklist looks outdated.",
          after: "Problem: Line managers at mid-sized companies need new starters to have laptops and system access on day one, but requests are raised too late, so new hires lose their first days waiting.",
        },
      ],
      practice: {
        task: "Take a design brief you've received (or a sample one) and produce three alternative problem frames.",
        steps: [
          "Copy the original brief wording.",
          "Highlight any solution language in it.",
          "Write a narrow, a broad and a different-stakeholder frame using the template.",
          "Pick one and justify it in two sentences.",
        ],
        deliverable: "A doc with the original brief, three reframes and your chosen frame with rationale.",
      },
      challenge: {
        task: "Facilitate a 20-minute framing exercise with a colleague or friend on a shared problem and agree a single frame.",
        successCriteria: [
          "At least three candidate frames were generated.",
          "The final frame passes every item on the health check.",
          "Assumptions to validate are listed separately.",
        ],
      },
    },
    {
      id: 'i1-opportunity-mapping',
      title: 'Opportunity mapping',
      summary: "Use an opportunity solution tree to connect an outcome to user needs and multiple candidate solutions.",
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Teams often jump from a goal straight to one solution. Opportunity mapping inserts a layer in between: the **opportunities** — unmet needs, pain points and desires — that, if addressed, would move the outcome.\n\nTeresa Torres popularised this as the *opportunity solution tree*: outcome at the top, opportunities beneath, solutions under each opportunity, and experiments under each solution.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            "Place the desired outcome at the root.",
            "Add opportunities drawn from research, phrased as user needs ('I'm not sure which plan fits my team').",
            "Break big opportunities into smaller, more solvable ones.",
            "Generate at least three solutions for the opportunity you target.",
            "Plan small tests for the riskiest assumptions behind each solution.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Comparing several solutions against the same opportunity dramatically reduces the risk of falling in love with your first idea. It also makes the reasoning visible to stakeholders.",
        },
        {
          type: 'doDont',
          do: [
            "Ground opportunities in research evidence.",
            "Keep opportunities in the user's voice.",
            "Prune branches you deliberately choose not to pursue.",
          ],
          dont: [
            "List features as opportunities.",
            "Map everything at once; focus on one branch at a time.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Marketplace seller activation',
          body: "Outcome: more new sellers publish their first listing within a week. Opportunities from interviews included 'I don't know what price to set' and 'Taking good photos feels hard'. Under pricing, solutions included comparable-sales hints, a price range suggestion and a 'list now, adjust later' reassurance.",
          before: "Plan: Build an AI listing assistant.",
          after: "Plan: Test three lightweight solutions against the pricing-uncertainty opportunity first, because interviews showed it blocked most first listings.",
        },
      ],
      practice: {
        task: "Build an opportunity solution tree for one product goal.",
        steps: [
          "Put the outcome at the top of a FigJam or Miro board.",
          "Add six to ten opportunities from reviews, interviews or support tickets.",
          "Group them and pick one target opportunity.",
          "Generate three solutions and one assumption test each.",
        ],
        deliverable: "A tree with outcome, grouped opportunities, three solutions and assumption tests.",
      },
      challenge: {
        task: "Present your tree to a peer as if they were a product manager and defend why you chose the target opportunity.",
        successCriteria: [
          "Every opportunity is phrased as a user need.",
          "The target choice references evidence, not preference.",
          "Solutions differ meaningfully, not three versions of one idea.",
          "Each test is small enough to run within a week.",
        ],
      },
    },
    {
      id: 'i1-prioritisation',
      title: 'Prioritisation',
      summary: "Use lightweight frameworks to decide what to design first, and make the trade-offs explicit.",
      minutes: 14,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Prioritisation is where design influence is won or lost. Designers who only react to a prioritised backlog end up polishing decisions they could have shaped.\n\nFrameworks help structure the conversation, but none gives the answer. **RICE** (Reach, Impact, Confidence, Effort) is good for comparing many items. **Value vs effort** matrices are quick for workshops. **Kano** helps separate basic expectations from delighters.",
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'False precision',
          body: "A RICE score of 43.2 versus 41.7 is not a meaningful difference. Use scores to spark discussion about assumptions, especially Confidence, not to end it.",
        },
        {
          type: 'list',
          items: [
            "Be explicit about what you are optimising for this cycle.",
            "Surface the cost of delay: what gets worse if we wait?",
            "Include design and research effort, not just engineering.",
            "Record what was deprioritised and why, so it can be revisited.",
          ],
        },
        {
          type: 'quiz',
          question: "Two items have similar value. One is low effort but low confidence; the other is higher effort but well evidenced. What is a sensible move?",
          options: [
            "Always pick the lower-effort item.",
            "Run a quick test to raise confidence on the low-effort item before committing.",
            "Build both at once.",
            "Pick whichever the most senior stakeholder prefers.",
          ],
          answer: 1,
          explanation: "Cheap tests that raise confidence are often the highest-leverage work. They turn a guess into evidence before the team commits.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Internal tooling backlog',
          body: "An operations team had 30 requests for its admin tool. The designer ran a value vs effort session with ops leads, then used cost of delay to break ties. Bulk refund handling rose to the top because every week of delay meant hours of manual work.",
          before: "Backlog sorted by who shouted loudest.",
          after: "Backlog grouped into 'now, next, later' with a one-line rationale per item.",
        },
      ],
      practice: {
        task: "Prioritise ten design requests using two different frameworks and compare the results.",
        steps: [
          "Write ten plausible requests for a product you know.",
          "Score them with RICE, noting your confidence honestly.",
          "Plot them on a value vs effort matrix.",
          "Compare where the two methods disagree and explain why.",
        ],
        deliverable: "A table of RICE scores, a 2×2 matrix and a short note on disagreements.",
      },
      challenge: {
        task: "Write a one-page prioritisation proposal for the next cycle that a PM and engineering lead could approve.",
        successCriteria: [
          "The optimisation goal for the cycle is stated up front.",
          "Top three items have rationale tied to that goal.",
          "Deprioritised items are listed with reasons.",
          "Risks and confidence levels are acknowledged.",
        ],
      },
    },
    {
      id: 'i1-product-discovery',
      title: 'Product discovery',
      summary: "Run continuous discovery so the team learns what to build before committing to delivery.",
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Discovery is the work of reducing uncertainty before building. Delivery is the work of building well. Mature teams run both at once: while engineers ship this sprint's work, the product trio (PM, designer, engineering lead) is testing what should come next.\n\nMarty Cagan frames the risks discovery must address as **value** (will they want it?), **usability** (can they use it?), **feasibility** (can we build it?) and **viability** (does it work for the business?).",
        },
        {
          type: 'list',
          items: [
            "**Weekly customer touchpoints** — short, regular conversations beat quarterly research projects.",
            "**Assumption mapping** — list what must be true and test the riskiest first.",
            "**Cheap prototypes** — clickable flows, fake-door tests, concierge versions.",
            "**Shared learning** — the whole trio hears from customers, not just the designer.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Most product ideas don't work as first imagined. Discovery lets you find that out in days with a prototype rather than months with production code.",
        },
        {
          type: 'doDont',
          do: [
            "Timebox discovery to a decision.",
            "Share raw evidence alongside conclusions.",
            "Kill ideas openly and celebrate the saved effort.",
          ],
          dont: [
            "Treat discovery as a phase that ends before delivery.",
            "Use prototypes only to persuade rather than to learn.",
            "Run fake-door tests without being honest with users afterwards.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Fintech savings goals',
          body: "A neobank considered building shared savings pots. Before any engineering, the trio ran five interviews, then a clickable prototype test. Users loved the idea but were anxious about who could withdraw money. That feasibility and trust question reshaped the feature around approval rules.",
          before: "Plan: Build shared pots in Q3, then test after launch.",
          after: "Plan: Two weeks of discovery to test value and trust assumptions, then commit to a scoped build.",
        },
      ],
      practice: {
        task: "Create an assumption map for a feature idea and design one test for the riskiest assumption.",
        steps: [
          "Write the feature idea in one sentence.",
          "List at least eight assumptions across value, usability, feasibility and viability.",
          "Plot them by importance and evidence.",
          "Design a test for the most important, least evidenced assumption.",
        ],
        deliverable: "An assumption map plus a one-paragraph test plan.",
      },
      challenge: {
        task: "Plan a two-week discovery sprint for a real or imagined B2B feature, including touchpoints, prototypes and a decision point.",
        successCriteria: [
          "All four risk types are covered.",
          "At least three customer touchpoints are scheduled.",
          "The sprint ends in a clear go, pivot or stop decision.",
          "Roles for PM, design and engineering are named.",
        ],
      },
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Module 2 — UX Research                                              */
/* ------------------------------------------------------------------ */

const research: Module = {
  id: 'i-m2-research',
  title: 'UX Research',
  stage: 'Research',
  summary: "Plan, run and synthesise research that changes decisions, not research that sits in a folder.",
  outcome: "You'll be able to choose the right method, run it rigorously and turn findings into insights a team acts on.",
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'i2-research-planning',
      title: 'Research planning',
      summary: "Start every study from the decision it must inform, then choose method, participants and scope.",
      minutes: 14,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Research without a decision attached rarely changes anything. Before choosing a method, write down **what the team will decide** once the study is done, and what they'd do differently depending on the answer.\n\nFrom there, research questions follow — the things you need to learn — and only then the method. Picking 'let's do interviews' first is like choosing a chart type before looking at the data.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            "**Decision** — what will this research inform?",
            "**Research questions** — three to five things you need to learn.",
            "**Method** — the cheapest method that answers them credibly.",
            "**Participants** — who, how many, how recruited, what screener.",
            "**Timeline and outputs** — when findings land relative to the decision.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Attitudinal vs behavioural',
          body: "Interviews and surveys tell you what people say. Usability tests and analytics show what people do. Many questions need both, so pair methods where the stakes justify it.",
        },
        {
          type: 'doDont',
          do: [
            "Align on the plan with your PM and engineering lead before recruiting.",
            "Recruit people who match the decision's audience, not whoever is convenient.",
            "State what's out of scope.",
          ],
          dont: [
            "Research questions that can't change the roadmap.",
            "Test only with colleagues for a product aimed at external customers.",
            "Deliver findings after the decision has already been made.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Payroll SaaS pricing page',
          body: "A payroll platform planned to redesign its pricing page. The designer reframed the study around a decision: whether to show per-employee pricing publicly. The plan paired eight interviews with small-business owners and a review of sales-call notes.",
          before: "Research goal: Learn what users think of the pricing page.",
          after: "Decision: Should we publish per-employee pricing? Research questions: How do owners estimate cost today? What makes them contact sales vs sign up?",
        },
      ],
      practice: {
        task: "Write a one-page research plan for a design decision on your current or a sample project.",
        steps: [
          "Name the decision and its deadline.",
          "Write three to five research questions.",
          "Choose a method and justify it in two sentences.",
          "Define participant criteria and a short screener.",
          "Set out the timeline and output format.",
        ],
        deliverable: "A one-page research plan ready to share with a PM.",
      },
      challenge: {
        task: "Write two alternative plans for the same decision — one lean (one week) and one thorough (four weeks) — and recommend one.",
        successCriteria: [
          "Both plans answer the same research questions.",
          "The trade-offs in confidence and time are explicit.",
          "The recommendation references the decision's risk and deadline.",
        ],
      },
    },
    {
      id: 'i2-interview-planning',
      title: 'Interview planning',
      summary: "Write discussion guides that surface real past behaviour instead of opinions and hypotheticals.",
      minutes: 15,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "An interview guide is not a questionnaire. It's a loose structure that keeps you on track while leaving room to follow what matters. The best guides focus on **specific past experiences**, because people are unreliable at predicting their own future behaviour.\n\n'Would you use a feature that...' produces polite yeses. 'Tell me about the last time you had to...' produces stories, details and workarounds.",
        },
        {
          type: 'list',
          items: [
            "**Warm-up** — role, context, a typical week.",
            "**Story prompts** — 'Walk me through the last time you...'",
            "**Probes** — 'What happened next?', 'Why was that?', 'How did you feel?'",
            "**Artefacts** — ask to see the spreadsheet, the email, the tool.",
            "**Wrap-up** — 'Is there anything I should have asked?'",
          ],
        },
        {
          type: 'doDont',
          do: [
            "Ask open, neutral questions.",
            "Let silences run; people fill them with detail.",
            "Plan for 45 minutes, write for 30.",
          ],
          dont: [
            "Ask leading questions ('Wasn't that frustrating?').",
            "Pitch your idea mid-interview.",
            "Ask two questions in one sentence.",
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Consent and data',
          body: "Always get explicit consent to record, explain how notes will be stored and who will see them, and never capture more personal or financial data than you need.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Accounts payable interviews',
          body: "A team researching invoice approvals replaced future-facing questions with past-behaviour prompts. Participants showed their inbox rules and approval spreadsheets, revealing that approvers were often on the move and approving from mobile email.",
          before: "Question: Would you like to approve invoices in our app?",
          after: "Question: Tell me about the last invoice you approved. Where were you, and what did you need to check first?",
        },
      ],
      practice: {
        task: "Write a 30-minute discussion guide for the research plan from the previous lesson.",
        steps: [
          "Draft a warm-up of two or three questions.",
          "Write four story prompts anchored in past behaviour.",
          "Add probes under each prompt.",
          "Remove any leading or double-barrelled questions.",
          "Pilot it with a colleague and time it.",
        ],
        deliverable: "A discussion guide plus notes on changes after the pilot.",
      },
      challenge: {
        task: "Run one real interview using your guide and review the recording or notes for your own interviewing mistakes.",
        successCriteria: [
          "At least one specific past story was captured in detail.",
          "You identified two moments where you led or interrupted.",
          "The guide was revised based on the session.",
        ],
      },
    },
    {
      id: 'i2-qualitative-research',
      title: 'Qualitative research',
      summary: "Choose between interviews, contextual inquiry and diary studies, and know what each can and can't claim.",
      minutes: 14,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Qualitative research explains **why** and **how**. It is strong at revealing mental models, motivations and context, and weak at telling you **how many**. Five interviews can reveal a serious problem; they can't tell you what share of your customers have it.\n\nPick the method by how close to real behaviour you need to get.",
        },
        {
          type: 'list',
          items: [
            "**In-depth interviews** — flexible and fast; relies on memory.",
            "**Contextual inquiry** — observe people in their real environment; great for internal tools and operations work.",
            "**Diary studies** — capture behaviour over days or weeks; good for habits and infrequent tasks like monthly reporting.",
            "**Field visits or shadowing** — rich, but time-consuming to arrange.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Enterprise users often can't describe their work accurately because it's second nature. Watching them in context surfaces the sticky notes, second monitors and copy-paste rituals interviews miss.",
        },
        {
          type: 'quiz',
          question: "You need to understand how warehouse staff use a scanning app during a shift. Which method fits best?",
          options: [
            "An online survey",
            "Contextual inquiry on the warehouse floor",
            "A/B testing two layouts",
            "A card sort",
          ],
          answer: 1,
          explanation: "The environment — noise, gloves, time pressure — shapes how the app is used. Only observing in context reveals that.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Claims handling tool',
          body: "An insurer's claims team said the case tool 'works fine'. Two afternoons of shadowing showed handlers keeping a separate notepad of claim numbers because the tool lost context between tabs. That became the top design priority.",
          before: "Finding from interviews: No major issues reported.",
          after: "Finding from observation: Handlers maintain manual lists to recover context after switching claims.",
        },
      ],
      practice: {
        task: "Observe someone completing a routine digital task for 20 minutes and take structured notes.",
        steps: [
          "Pick a routine task (expense filing, meal ordering, rota planning).",
          "Ask permission to observe and to ask questions afterwards.",
          "Note actions, tools, workarounds and pauses.",
          "Ask two follow-up questions about the moments that surprised you.",
        ],
        deliverable: "A page of observation notes with three highlighted workarounds.",
      },
      challenge: {
        task: "Design a five-day diary study for a behaviour that happens irregularly, including prompts and a participant brief.",
        successCriteria: [
          "Prompts are short enough to answer in under three minutes.",
          "Entries are triggered by the behaviour, not just by time.",
          "The brief explains consent and data handling clearly.",
        ],
      },
    },
    {
      id: 'i2-quantitative-research-basics',
      title: 'Quantitative research basics',
      summary: "Read analytics, surveys and experiments critically, and know when a number is trustworthy.",
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Quantitative methods tell you **what** and **how much**: where people drop off in a funnel, how common an attitude is, whether variant B outperforms A. You don't need to be a statistician, but you do need to spot weak numbers.\n\nThe three most common sources for designers are **product analytics** (funnels, retention, event data), **surveys** and **experiments** (A/B tests).",
        },
        {
          type: 'list',
          items: [
            "**Sample size** — small samples swing wildly; be cautious with early results.",
            "**Segments** — an average can hide opposite behaviour in two groups (new vs returning users).",
            "**Instrumentation** — check that events fire when you think they do.",
            "**Correlation vs causation** — users who use feature X retaining better doesn't mean X causes retention.",
            "**Survey bias** — leading wording, self-selection and ordering all shape answers.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Use analytics to find **where** a problem is and qualitative methods to understand **why**. A funnel shows 'drop-off on step 3'; a usability test shows it's because the tax ID field rejects valid formats.",
        },
        {
          type: 'doDont',
          do: [
            "Agree the success metric before an A/B test starts.",
            "Ask a data colleague to sanity-check your reading.",
            "Report ranges and caveats, not just headline numbers.",
          ],
          dont: [
            "Stop a test the moment it looks positive.",
            "Compare numbers across differently defined events.",
            "Use five-point scales without labelling each point.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Marketplace checkout funnel',
          body: "A marketplace saw lower checkout completion on mobile. Segmenting by payment method showed the drop was concentrated in one wallet option. Session recordings and a quick test confirmed a redirect that failed on certain browsers.",
          before: "Conclusion: Mobile users convert worse, so simplify the mobile checkout.",
          after: "Conclusion: One wallet's redirect fails on some mobile browsers; fix the integration before redesigning anything.",
        },
      ],
      practice: {
        task: "Audit a survey you or your company has sent (or a public one) for bias and fix it.",
        steps: [
          "Collect the survey questions.",
          "Mark leading, double-barrelled or ambiguous questions.",
          "Check scales are balanced and labelled.",
          "Rewrite the weakest five questions.",
        ],
        deliverable: "A before/after table of five survey questions with reasons.",
      },
      challenge: {
        task: "Write an A/B test brief for a design change, including hypothesis, metrics and a stopping rule agreed with a data partner.",
        successCriteria: [
          "The hypothesis names the change, the expected effect and why.",
          "A primary metric and at least one guardrail are defined.",
          "The stopping rule is set before launch.",
          "Segments to check are listed.",
        ],
      },
    },
    {
      id: 'i2-competitive-analysis',
      title: 'Competitive analysis',
      summary: "Analyse competitors for strategy and patterns, not to copy screens.",
      minutes: 13,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Weak competitive analysis is a folder of screenshots. Strong competitive analysis answers a question: *How do others solve this problem, what do their choices reveal about their strategy, and where is the space for us?*\n\nInclude direct competitors, indirect ones (a spreadsheet is a competitor to most B2B tools) and analogous products from other industries that solve a similar interaction problem.",
        },
        {
          type: 'list',
          items: [
            "**Scope** — pick one job or flow, such as onboarding a team or disputing a payment.",
            "**Criteria** — decide dimensions up front: steps, defaults, pricing visibility, trust signals.",
            "**Walkthroughs** — do the task yourself and record friction, not just final screens.",
            "**Synthesis** — patterns, gaps and deliberate trade-offs.",
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          body: "A competitor's pattern may exist for reasons you can't see: legal constraints, a different business model, or an experiment that failed. Treat it as a hypothesis, not proof.",
        },
        {
          type: 'doDont',
          do: [
            "Look at analogous industries for fresh patterns.",
            "Note what competitors deliberately *don't* do.",
            "Refresh the analysis periodically; products change.",
          ],
          dont: [
            "Copy a flow because a big company uses it.",
            "Compare features in a tick-box grid with no context.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Team invitation flows',
          body: "A project-management startup compared how five collaboration tools handle inviting teammates. The analysis revealed two strategies: invite-first (grow seats early) and value-first (let a solo user succeed, then prompt). The team chose value-first because their buyers tested tools alone before rolling out.",
          before: "Deliverable: 40 screenshots of competitor invite screens.",
          after: "Deliverable: A two-page comparison of invite strategies, trade-offs and a recommendation for our buyers.",
        },
      ],
      practice: {
        task: "Run a focused competitive walkthrough of one flow across three products.",
        steps: [
          "Choose a flow (e.g. adding a payee in three banking apps).",
          "Define five comparison criteria.",
          "Complete the flow in each product, noting friction.",
          "Summarise patterns and gaps in a table.",
        ],
        deliverable: "A comparison table and three takeaways.",
      },
      challenge: {
        task: "Add one analogous product from a different industry and show how its pattern could solve your problem.",
        successCriteria: [
          "The analogy is explained, not just shown.",
          "The adapted pattern fits your users' constraints.",
          "Risks of adopting it are noted.",
        ],
      },
    },
    {
      id: 'i2-running-usability-tests',
      title: 'Running usability tests',
      summary: "Write realistic tasks, moderate without leading, and capture findings you can act on.",
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Usability testing is the most direct way to see whether a design works. The craft is in the **tasks** and the **moderation**.\n\nTasks should be realistic scenarios with a goal, not instructions. 'Click Reports, then Export' tests whether people can follow directions. 'Your manager wants last quarter's refunds by region — get that to her' tests your product.",
        },
        {
          type: 'list',
          items: [
            "**Moderated** — you can probe and adapt; best for complex or early designs.",
            "**Unmoderated** — faster and cheaper at scale; tasks must be crystal clear.",
            "**Think-aloud** — ask participants to narrate; prompt gently if they go quiet.",
            "**Severity** — rate issues by frequency, impact and persistence.",
          ],
        },
        {
          type: 'doDont',
          do: [
            "Avoid words in tasks that match UI labels.",
            "Answer questions with questions ('What would you expect?').",
            "Invite engineers and PMs to observe live.",
          ],
          dont: [
            "Rescue participants too quickly.",
            "Explain the design before the task.",
            "Count 'liked it' as success.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Five to eight participants per distinct user group usually surfaces the major issues in a flow. Test, fix, then test again rather than running one large study.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Bulk user import for an admin console',
          body: "An identity product tested a CSV import flow with IT admins. A task that avoided UI wording revealed that admins expected to map columns themselves and didn't trust automatic mapping without a preview.",
          before: "Task: Use the Import Users button to upload the CSV.",
          after: "Task: Your company just hired 40 contractors, listed in this spreadsheet. Give them access before Monday.",
        },
      ],
      practice: {
        task: "Run a three-person usability test on a prototype or live product.",
        steps: [
          "Write three scenario-based tasks without UI words.",
          "Set up a note-taking grid: task, observation, quote, severity.",
          "Run 20-minute sessions with think-aloud.",
          "Rate every issue for severity.",
        ],
        deliverable: "A findings grid with severity ratings and top three issues.",
      },
      challenge: {
        task: "Redesign the worst issue you found and test the fix with two new participants.",
        successCriteria: [
          "The fix addresses the root cause, not the symptom.",
          "Both new participants completed the task without help, or new issues are documented.",
          "The before/after comparison is written up in under a page.",
        ],
      },
    },
    {
      id: 'i2-research-synthesis',
      title: 'Research synthesis',
      summary: "Turn raw notes into themes using affinity mapping, tagging and a clear evidence trail.",
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Synthesis is where research value is created or lost. The goal is to move from **observations** (what people said and did) to **themes** (patterns across people) without losing the link back to evidence.\n\nDo synthesis soon after sessions while memory is fresh, and involve at least one other person to challenge your interpretations.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            "Break notes into atomic observations: one fact or quote per note.",
            "Tag each with participant and session.",
            "Cluster bottom-up; name clusters only after they form.",
            "Write each theme as a sentence, not a label ('Approvers check invoices on mobile between meetings', not 'Mobile').",
            "Count how many participants support each theme and note counter-evidence.",
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Confirmation bias',
          body: "It's easy to cluster notes around the idea you already believed. Deliberately look for observations that contradict your favourite theme and give them their own cluster.",
        },
        {
          type: 'checklist',
          title: 'Synthesis quality check',
          items: [
            "Every theme links to specific observations.",
            "Themes are supported by more than one participant, or flagged as single-source.",
            "Contradictions are recorded, not discarded.",
            "Someone who didn't attend sessions can follow the logic.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Merchant onboarding for a payments provider',
          body: "After ten interviews with small merchants, the team clustered more than 200 notes. A top-down 'pricing' label had hidden two distinct themes: confusion about fees on refunds and anxiety about when payouts arrive.",
          before: "Theme: Pricing.",
          after: "Themes: 'Merchants can't predict fees on refunds' (7 of 10) and 'Merchants plan cash flow around payout timing they don't trust' (6 of 10).",
        },
      ],
      practice: {
        task: "Synthesise notes from your usability test or interviews using affinity mapping.",
        steps: [
          "Split notes into atomic observations on a whiteboard tool.",
          "Cluster silently for 15 minutes.",
          "Name clusters as sentences.",
          "Record supporting counts and counter-evidence.",
        ],
        deliverable: "An affinity board with three to six sentence-style themes.",
      },
      challenge: {
        task: "Pair with someone who wasn't in the sessions and have them challenge each theme until it holds up.",
        successCriteria: [
          "At least one theme was split, merged or dropped.",
          "Every remaining theme has a clear evidence trail.",
          "Single-source themes are labelled as such.",
        ],
      },
    },
    {
      id: 'i2-insight-generation',
      title: 'Insight generation',
      summary: "Turn themes into insights with implications, and share them in ways that change decisions.",
      minutes: 14,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "A theme describes a pattern. An **insight** explains why the pattern exists and what it means for the product. 'Users export data to spreadsheets' is a theme. 'Finance leads export because they don't trust the dashboard totals to match the ledger, so they recheck everything by hand' is an insight: it has a cause and points at a design direction.\n\nA useful shape: **observation → reason → implication**.",
        },
        {
          type: 'example',
          title: 'Insight template',
          body: "We saw [pattern]. This happens because [underlying reason]. This means [implication for the product], so we should consider [direction or question].",
        },
        {
          type: 'list',
          items: [
            "Lead readouts with the three insights that affect the next decision.",
            "Pair each insight with a short quote or clip as evidence.",
            "Turn implications into 'How might we...' questions for ideation.",
            "Store insights in a searchable repository so they outlive the project.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Stakeholders rarely read 40-page reports. Short, evidence-backed insights connected to a current decision are what actually move roadmaps.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Procurement platform readout',
          body: "A procurement tool's research readout was reshaped from a chronological report into three insights, each with a clip and a 'How might we' question. The PM used one of them directly to reprioritise the approval workflow.",
          before: "Finding: Users find approvals confusing.",
          after: "Insight: Requesters resubmit purchase requests because they can't see who is blocking approval, so they chase by email. How might we make approval status visible without extra notifications?",
        },
      ],
      practice: {
        task: "Convert three themes from your synthesis into full insights.",
        steps: [
          "Pick your three strongest themes.",
          "For each, write the underlying reason, drawing on evidence.",
          "Add an implication and a 'How might we' question.",
          "Choose one supporting quote per insight.",
        ],
        deliverable: "Three insight cards ready for a readout.",
      },
      challenge: {
        task: "Deliver a 10-minute research readout to a peer group and gather what decisions it prompts.",
        successCriteria: [
          "The readout opens with the decision it informs.",
          "Each insight has evidence and an implication.",
          "At least one concrete next action is agreed.",
          "The deck or doc is under ten slides or two pages.",
        ],
      },
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Module 3 — Information Architecture                                 */
/* ------------------------------------------------------------------ */

const informationArchitecture: Module = {
  id: 'i-m3-ia',
  title: 'Information Architecture',
  stage: 'IA',
  summary: "Structure large products so people can find, understand and act on what matters to them.",
  outcome: "You'll be able to design navigation, taxonomies, search and permissions that scale with a growing product.",
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'i3-complex-navigation',
      title: 'Complex navigation',
      summary: "Design navigation for products with many areas, roles and objects without burying key tasks.",
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Navigation in a mature B2B product often grows by accretion: each team adds its area to the sidebar until it becomes a list of 25 items nobody fully understands. The fix isn't a prettier sidebar; it's a clear **navigation model**.\n\nMost complex products combine several layers: **global** navigation (areas of the product), **local** navigation (within an area), **contextual** navigation (related objects), and **utility** navigation (settings, help, account).",
        },
        {
          type: 'list',
          items: [
            "**Object-based** — organise around core nouns: Customers, Invoices, Products. Scales well in SaaS.",
            "**Task-based** — organise around verbs: Pay, Request, Approve. Good for narrow, repeated workflows.",
            "**Role-based** — different home or navigation per role. Powerful, but expensive to maintain and confusing for multi-role users.",
            "**Hub-and-spoke** — a home that routes to focused sub-flows; common in mobile banking.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "The navigation model is a promise about how the product is organised. When it's consistent, users can predict where new features live; when it's not, every release adds confusion.",
        },
        {
          type: 'doDont',
          do: [
            "Test navigation with tree testing before visual design.",
            "Keep top-level labels to distinct, recognisable nouns.",
            "Plan where the next three features will live.",
          ],
          dont: [
            "Mirror the company's org chart in the menu.",
            "Use vague labels like 'Tools', 'Manage' or 'Hub'.",
            "Add a new top-level item for every launch.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Logistics platform sidebar',
          body: "A freight platform's sidebar had grown to 22 items named after internal teams. The redesign reorganised it around core objects — Shipments, Carriers, Invoices, Reports — and moved team-specific tools into contextual actions inside each object.",
          before: "Sidebar: Ops Tools, Finance Hub, Carrier Mgmt, Dispatch Beta, Reports v2, ...",
          after: "Sidebar: Shipments, Carriers, Invoices, Reports, with Settings and Help in the utility area.",
        },
      ],
      practice: {
        task: "Audit the navigation of a complex product you use and propose a clearer model.",
        steps: [
          "List every top-level and second-level item.",
          "Classify each as object, task, role or utility.",
          "Identify overlaps and vague labels.",
          "Propose a new model with no more than seven top-level items.",
        ],
        deliverable: "A before/after navigation tree with rationale.",
      },
      challenge: {
        task: "Run a tree test of your proposed navigation with five people and revise it.",
        successCriteria: [
          "At least five realistic find-it tasks were used.",
          "Success and first-click results are recorded per task.",
          "Revisions address the weakest-performing tasks.",
        ],
      },
    },
    {
      id: 'i3-taxonomy',
      title: 'Taxonomy',
      summary: "Build classification schemes and controlled vocabularies that stay consistent as content grows.",
      minutes: 14,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "A taxonomy is the system of categories and labels used to classify things: products in a marketplace, tickets in a helpdesk, documents in a knowledge base. Good taxonomies are invisible — users simply find what they expect. Poor ones cause duplicate categories, orphaned items and search that never works.\n\nThere are two broad shapes. **Hierarchical** taxonomies nest categories (Electronics > Audio > Headphones). **Faceted** taxonomies describe items along independent dimensions (brand, price, connectivity) that can be combined.",
        },
        {
          type: 'list',
          items: [
            "**Mutually exclusive** — an item should have one obvious home in a hierarchy.",
            "**Collectively exhaustive** — every item has somewhere to go, without a bloated 'Other'.",
            "**User language** — labels match how customers describe things, validated with card sorts and search logs.",
            "**Controlled vocabulary** — preferred terms plus synonyms ('sofa' vs 'couch').",
            "**Ownership** — someone decides when categories are added or merged.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Search logs are a free source of user vocabulary. The terms people type are often different from the labels your team invented.",
        },
        {
          type: 'quiz',
          question: "A second-hand marketplace keeps getting listings in both 'Home' and 'Furniture'. What is the best first step?",
          options: [
            "Add a third category called 'Home & Furniture'.",
            "Define clear scope for each category and move overlapping items into a facet.",
            "Let sellers choose both.",
            "Remove categories and rely on search.",
          ],
          answer: 1,
          explanation: "Overlap usually means the scope of categories is undefined. Clarify boundaries and move cross-cutting attributes (like 'room') into facets.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Helpdesk ticket categories',
          body: "A SaaS support team's ticket categories had grown to 60 free-typed values. Consolidating into eight categories with facets for product area and severity made routing and reporting reliable.",
          before: "Categories: Billing, billing issue, Invoices, Payment problem, Refunds?, Other...",
          after: "Category: Billing. Facets: Topic (invoice, refund, payment method), Severity, Product area.",
        },
      ],
      practice: {
        task: "Design a small taxonomy for 40 real items (e.g. apps on your phone or articles in a help centre).",
        steps: [
          "List the 40 items.",
          "Run an open card sort with two or three people.",
          "Draft a hierarchy and a set of facets.",
          "Write a scope note for each top-level category.",
        ],
        deliverable: "A taxonomy diagram with scope notes and facets.",
      },
      challenge: {
        task: "Write governance rules for your taxonomy: who can add terms, how synonyms are handled and when categories are reviewed.",
        successCriteria: [
          "An owner and review cadence are defined.",
          "There is a process for proposing new categories.",
          "Synonyms are mapped to preferred terms.",
        ],
      },
    },
    {
      id: 'i3-content-hierarchy',
      title: 'Content hierarchy',
      summary: "Order information inside dense pages so the most decision-relevant content surfaces first.",
      minutes: 13,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "In complex products, the hard part of hierarchy isn't visual weight; it's deciding **what information belongs at which level**. A customer record in a CRM might hold hundreds of fields. Which ten does an account manager need at a glance, which belong one click away, and which are rarely needed at all?\n\nThink in layers: **summary** (status and key facts), **detail** (the full picture, often in tabs or sections) and **deep reference** (history, logs, metadata).",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            "List every piece of information on the page.",
            "For each primary role, mark what they need to decide or act.",
            "Rank by frequency of use and consequence of missing it.",
            "Assign each item to summary, detail or reference.",
            "Validate with real users and real data, including long values and empty fields.",
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Tabs hide things',
          body: "Content in a second tab is effectively invisible to many users. Never put something critical — a failed payment, a compliance flag — behind a tab without a signal on the summary layer.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Loan application review screen',
          body: "Underwriters at a lender scrolled through 12 sections to find risk flags. The redesign added a summary header with decision status, outstanding checks and flagged risks, and moved raw bureau data into a reference panel.",
          before: "Page order: Applicant details, address history, employment, ... risk flags at the bottom.",
          after: "Summary: Status, amount, outstanding checks, risk flags. Detail sections below, bureau data in a collapsible reference panel.",
        },
      ],
      practice: {
        task: "Restructure a dense detail page (a CRM contact, an order, a user profile in an admin tool).",
        steps: [
          "Inventory every field on the page.",
          "Define the top two roles using it and their key decisions.",
          "Sort fields into summary, detail and reference.",
          "Wireframe the new structure.",
        ],
        deliverable: "A field inventory and a mid-fidelity wireframe of the restructured page.",
      },
      challenge: {
        task: "Design the same page for two roles with different priorities without creating two separate pages.",
        successCriteria: [
          "Both roles find their critical information in the summary layer.",
          "The approach avoids duplicating the page.",
          "Edge cases (empty and very long values) are shown.",
        ],
      },
    },
    {
      id: 'i3-search',
      title: 'Search',
      summary: "Design search experiences that handle scoping, typos, zero results and ranking expectations.",
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Search is often the primary navigation for experienced users in large products. It is also where IA problems become visible: inconsistent naming, missing synonyms and unclear scope all show up as 'search is broken'.\n\nDesigners own much of the search experience even if engineers own the ranking: the input, suggestions, scope, results layout, empty states and refinement.",
        },
        {
          type: 'list',
          items: [
            "**Scope** — is search global, or within the current object? Make it visible.",
            "**Autocomplete** — suggest objects and recent searches, not just strings.",
            "**Tolerance** — handle typos, plurals, synonyms and IDs (invoice numbers, emails).",
            "**Result anatomy** — show enough to choose: type, key attribute, status, matched term highlighted.",
            "**Zero results** — offer corrections, broaden scope, or suggest filters to remove.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Ask your team for the top queries and the top zero-result queries. They're a direct view into your users' vocabulary and your IA gaps.",
        },
        {
          type: 'doDont',
          do: [
            "Group mixed results by object type in B2B tools.",
            "Support keyboard shortcuts for power users.",
            "Preserve the query when users go back.",
          ],
          dont: [
            "Show a blank page for zero results.",
            "Hide which scope is being searched.",
            "Require exact matches for IDs with formatting differences.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Admin console global search',
          body: "Support agents in a payments company searched for customers by email, card fingerprint or transaction ID. The redesigned search detected the query type and grouped results by Customers, Payments and Disputes, each with status chips.",
          before: "Results: A flat list of 50 mixed items with no type labels.",
          after: "Results: 'Looks like a transaction ID' — Payments (1), Customers (1), with the matching payment first.",
        },
      ],
      practice: {
        task: "Design the search experience for a B2B product you know, covering five states.",
        steps: [
          "Design the empty input with recent searches.",
          "Design autocomplete with typed suggestions.",
          "Design grouped results with clear anatomy.",
          "Design zero results and an error state.",
        ],
        deliverable: "Five annotated search-state screens.",
      },
      challenge: {
        task: "Add scoped search inside an object (e.g. within a project) and make the scope switch obvious.",
        successCriteria: [
          "Users can always see what is being searched.",
          "Switching between local and global scope takes one action.",
          "The query is preserved when the scope changes.",
        ],
      },
    },
    {
      id: 'i3-filters',
      title: 'Filters',
      summary: "Design filtering for large datasets: facets, applied-state visibility, saved views and performance.",
      minutes: 14,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Filters let people narrow large sets — orders, candidates, transactions, listings — to what they need. They look simple and are one of the most common sources of confusion in data-heavy products.\n\nThe key decisions are **which facets to expose**, **how filters combine** (AND within a field is usually OR — 'Status: Paid or Refunded'), **when results update** (instantly vs on 'Apply'), and **how applied state is shown**.",
        },
        {
          type: 'list',
          items: [
            "**Visible applied state** — show chips for active filters with individual remove and 'Clear all'.",
            "**Counts** — show result counts per option where performance allows.",
            "**Batch vs live** — apply instantly on desktop when fast; batch on mobile or when queries are slow.",
            "**Saved views** — let power users save and share filter combinations.",
            "**URL state** — filters in the URL make views shareable and survive refresh.",
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          body: "Hidden, forgotten filters are a classic cause of 'my data is missing' support tickets. If filters persist between sessions, make that extremely obvious.",
        },
        {
          type: 'doDont',
          do: [
            "Order facets by how often they're used.",
            "Offer relative dates ('Last 30 days') as well as custom ranges.",
          ],
          dont: [
            "Let filters combine into zero results with no explanation.",
            "Reset filters silently when users navigate away and back.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Recruiting platform candidate list',
          body: "Recruiters lost track of which filters were active across 12 facets. The redesign added a chip bar above results, saved views like 'My open roles — screening stage', and filters encoded in the URL for sharing with hiring managers.",
          before: "Filters inside a collapsed panel; no sign they're active once closed.",
          after: "Chip bar: 'Stage: Screening ×', 'Location: Remote ×', 'Clear all' — with 'Save view' next to it.",
        },
      ],
      practice: {
        task: "Design a filtering system for a transactions list in a finance tool.",
        steps: [
          "Choose five to seven facets and justify each.",
          "Decide combination logic and when results update.",
          "Design applied-state chips and 'Clear all'.",
          "Design the zero-results state caused by filters.",
        ],
        deliverable: "Annotated screens covering default, filtered and zero-result states.",
      },
      challenge: {
        task: "Add saved and shared views, including how a shared view behaves for someone with fewer permissions.",
        successCriteria: [
          "Saving a view takes no more than two actions.",
          "Shared views are clearly attributed.",
          "Permission differences are handled without errors or silent data gaps.",
        ],
      },
    },
    {
      id: 'i3-permissions',
      title: 'Permissions',
      summary: "Design roles, access and permission states so users understand what they can do and why.",
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Permissions are information architecture: they decide what each person can see and do. They're usually designed late, by engineers, and it shows — greyed-out buttons with no explanation, pages that silently show less data, and admin screens with 80 checkboxes.\n\nMost B2B products use **role-based access control** (roles like Admin, Editor, Viewer), sometimes with **resource-level** permissions (access to specific projects or accounts).",
        },
        {
          type: 'list',
          items: [
            "**Hide vs disable** — hide actions users will never have; disable with an explanation when they could get access.",
            "**Explain** — 'Only workspace admins can export. Ask Priya (Admin) for access.'",
            "**Request access** — offer a path instead of a dead end.",
            "**Admin clarity** — describe roles in plain terms of what people can do.",
            "**Preview** — let admins see the product as a given role.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Unclear permissions create support load, security risk and mistrust. Admins over-grant access when they can't understand roles, which is exactly what security teams don't want.",
        },
        {
          type: 'quiz',
          question: "A Viewer opens an invoice that has an 'Approve' action. What's usually the best treatment?",
          options: [
            "Hide the button entirely and say nothing.",
            "Show the button disabled with a tooltip explaining who can approve and how to request access.",
            "Let them click and show a generic error.",
            "Show the button and let them approve anyway.",
          ],
          answer: 1,
          explanation: "Viewers in finance workflows often need to know approval is possible and who to ask. An explained, disabled state avoids dead ends and generic errors.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Team settings in a design-collaboration SaaS',
          body: "A permissions screen listed 40 technical capabilities in a matrix. The redesign introduced four named roles with plain-language summaries and a 'Custom' option for advanced admins.",
          before: "Role editor: 40 checkboxes like 'workspace.files.write'.",
          after: "Roles: Owner, Admin, Member, Guest — each with a sentence like 'Can edit files in projects they're added to; can't manage billing'.",
        },
      ],
      practice: {
        task: "Design the role model and permission states for a small B2B tool (e.g. a shared expense tracker for teams).",
        steps: [
          "Define three or four roles with plain-language descriptions.",
          "Create a capability matrix for five key actions.",
          "Decide hide vs disable for each action per role.",
          "Design one disabled state with explanation and request-access path.",
        ],
        deliverable: "A role matrix and two annotated permission-state screens.",
      },
      challenge: {
        task: "Design the admin experience for inviting a user and assigning them resource-level access to specific projects.",
        successCriteria: [
          "Admins can see effective access before confirming.",
          "Role descriptions are understandable without documentation.",
          "The invitee's first screen explains what they can do.",
          "Removing access is as easy as granting it.",
        ],
      },
    },
    {
      id: 'i3-enterprise-ux',
      title: 'Enterprise UX',
      summary: "Design for enterprise realities: buyers vs users, configuration, legacy data, and expert workflows.",
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Enterprise products are bought by one group and used by another. The CFO signs the contract; accounts-payable clerks live in the tool eight hours a day. Designing well means serving both, and recognising that expert daily users value **speed, density and predictability** over first-impression polish.\n\nEnterprise work also brings constraints consumer designers rarely meet: single sign-on, audit logs, data residency, heavy configuration, and integration with systems that are decades old.",
        },
        {
          type: 'list',
          items: [
            "**Efficiency** — keyboard shortcuts, bulk actions, dense layouts with density settings.",
            "**Configurability** — custom fields, workflows and views, with sensible defaults.",
            "**Auditability** — who changed what, when; clear history on records.",
            "**Change management** — big UI changes disrupt trained teams; ship with opt-in periods and guidance.",
            "**Admin as a user** — setup and configuration experiences deserve real design attention.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Access to enterprise users is harder, so build relationships through customer success teams and customer advisory boards. A few deep relationships are worth more than a large, shallow panel.",
        },
        {
          type: 'doDont',
          do: [
            "Design for the 50th use, not just the first.",
            "Respect muscle memory when redesigning.",
            "Test with realistic data volumes.",
          ],
          dont: [
            "Strip density out in the name of minimalism.",
            "Assume every customer has the same configuration.",
            "Ship a redesign to all accounts on the same day without notice.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Procurement approval queue',
          body: "A procurement suite's approvers handled dozens of requests per day. The team added keyboard navigation, bulk approve with a confirmation summary, and a compact density option, then rolled it out behind an opt-in toggle for a month.",
          before: "Approvers opened each request, scrolled, clicked Approve, returned to the list.",
          after: "Approvers review in a split view, approve with a shortcut, and bulk-approve low-risk items with a summary check.",
        },
      ],
      practice: {
        task: "Redesign one high-frequency task in an enterprise tool for expert efficiency.",
        steps: [
          "Choose a task done many times a day (triaging tickets, approving expenses).",
          "Map the current steps and clicks.",
          "Introduce bulk actions, shortcuts or split views where they fit.",
          "Plan how you would roll it out without disrupting trained users.",
        ],
        deliverable: "A before/after flow with a short rollout plan.",
      },
      challenge: {
        task: "Design the first-time admin setup for an enterprise tool that requires SSO, user provisioning and custom fields.",
        successCriteria: [
          "Setup can be paused and resumed.",
          "Each step explains why it's needed and who typically does it.",
          "Admins can invite a colleague (e.g. IT) to complete a step.",
          "Progress and remaining steps are always visible.",
        ],
      },
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Module 4 — Advanced UI                                              */
/* ------------------------------------------------------------------ */

const advancedUi: Module = {
  id: 'i-m4-advanced-ui',
  title: 'Advanced UI',
  stage: 'Advanced UI',
  summary: "Design the hard screens: responsive systems, dashboards, tables, long forms, workflows and failure states.",
  outcome: "You'll be able to design data-heavy, multi-step interfaces that stay usable, resilient and accessible at scale.",
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'i4-responsive-systems',
      title: 'Responsive systems',
      summary: "Design layouts as rules that adapt across breakpoints, not as separate fixed screens.",
      minutes: 15,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Designing three static frames — mobile, tablet, desktop — leaves engineers to guess everything in between. A responsive **system** defines rules: how columns, spacing, type and components behave as space changes.\n\nThink about behaviour per component: does it **reflow** (cards wrap), **reveal** (more columns appear), **transform** (tabs become a dropdown, a table becomes stacked cards), or **hide** (secondary metadata disappears)?",
        },
        {
          type: 'interactive',
          widget: 'grid-playground',
          caption: "Change the column count and gutter to see how a layout grid adapts across widths.",
        },
        {
          type: 'list',
          items: [
            "**Breakpoints from content** — set them where the layout breaks, not at device sizes.",
            "**Fluid within ranges** — components stretch between breakpoints with min and max widths.",
            "**Container-aware components** — a card should adapt to its container, not only the viewport.",
            "**Priority** — decide what disappears first when space runs out.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "In Figma, Auto Layout with min/max widths and wrap lets you test component behaviour by resizing frames. Annotate what happens at each breakpoint rather than drawing every size.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Analytics card grid',
          body: "A SaaS reporting page defined a rule: KPI cards have a 240px minimum width and wrap; the chart panel spans full width below 900px; the filter sidebar becomes a sheet on small screens. Engineers built one flexible layout instead of three fixed ones.",
          before: "Handoff: Three static frames at 375, 768 and 1440px.",
          after: "Handoff: One layout with annotated rules for reflow, transform and hide at two content-driven breakpoints.",
        },
      ],
      practice: {
        task: "Turn a fixed desktop screen into a responsive specification.",
        steps: [
          "Pick a dashboard or listing page.",
          "Label each component: reflow, reveal, transform or hide.",
          "Rebuild it with Auto Layout, using min/max widths.",
          "Find the widths where it breaks and set breakpoints there.",
        ],
        deliverable: "A resizable Figma frame plus a short list of responsive rules.",
      },
      challenge: {
        task: "Design a responsive pattern for a wide data table that must remain usable on a phone.",
        successCriteria: [
          "The primary column and key actions stay visible on small screens.",
          "The transformation rule is documented.",
          "No horizontal page scroll outside the table area.",
        ],
      },
    },
    {
      id: 'i4-complex-dashboards',
      title: 'Complex dashboards',
      summary: "Design dashboards around decisions, with clear hierarchy, comparisons and drill-down paths.",
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Most dashboards fail because they answer 'what data do we have?' instead of 'what does this person need to decide?'. A good dashboard is built backwards from questions like *Are we on track this month?* or *Which accounts need attention today?*\n\nDistinguish **operational** dashboards (monitor now, act fast — a support queue, fraud alerts) from **analytical** ones (explore trends, understand why — revenue by cohort).",
        },
        {
          type: 'list',
          items: [
            "**Top-left is prime space** — put the most decision-relevant metric there.",
            "**Context for every number** — comparison to target, previous period or benchmark.",
            "**Right chart for the question** — trends as lines, comparisons as bars, parts of a whole sparingly.",
            "**Drill-down** — every summary number should lead to its underlying records.",
            "**Freshness** — show when data was last updated.",
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          body: "A number without context is decoration. '£48,200 revenue' means nothing; 'Revenue £48,200, 6% below target with 9 days left' supports a decision.",
        },
        {
          type: 'doDont',
          do: [
            "Limit the first view to what fits a single decision.",
            "Use colour to signal status, consistently and sparingly.",
            "Design loading, partial and error states for every widget.",
          ],
          dont: [
            "Use gauges and 3D charts for simple comparisons.",
            "Let every stakeholder add a widget.",
            "Rely on colour alone to show good vs bad.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Customer success dashboard',
          body: "A CS team's dashboard showed 14 charts of usage data. Interviews showed managers opened it to answer one question each morning: which accounts are at risk before renewal? The redesign led with an at-risk list, sorted by renewal date, with reasons and a link to each account.",
          before: "14 equally sized charts: logins, seats, API calls, NPS, tickets...",
          after: "Top: 'At-risk renewals (next 60 days)' list with risk reasons. Below: trend charts for context.",
        },
      ],
      practice: {
        task: "Design an operational dashboard for a marketplace operations manager.",
        steps: [
          "Write the three questions they need answered each morning.",
          "Choose metrics and context (targets, comparisons) for each.",
          "Sketch the layout with prime space for the top question.",
          "Define drill-down destinations for each widget.",
        ],
        deliverable: "A wireframe dashboard annotated with the question each widget answers.",
      },
      challenge: {
        task: "Design the same dashboard's loading, stale-data and partial-failure states.",
        successCriteria: [
          "Each widget fails independently without breaking the page.",
          "Stale data is clearly flagged with a timestamp.",
          "Users can retry or understand what to do next.",
        ],
      },
    },
    {
      id: 'i4-data-tables',
      title: 'Data tables',
      summary: "Design tables for scanning, comparing and acting on records at scale.",
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Tables are the workhorse of B2B products. Users scan them, sort them, compare rows and act on selections. Small decisions — alignment, density, truncation — add up to hours saved or lost every week.\n\nStart from the tasks: are people **looking up** one record, **comparing** records, **monitoring** statuses, or **acting** in bulk?",
        },
        {
          type: 'list',
          items: [
            "**Alignment** — text left, numbers right (with tabular figures), and headers aligned to their content.",
            "**Primary column** — the identifying column (name, ID) is sticky on horizontal scroll.",
            "**Density** — offer comfortable and compact modes for heavy users.",
            "**Truncation** — truncate with a tooltip or expand; never truncate IDs or amounts.",
            "**Row actions** — keep the most common action visible; move the rest into an overflow menu.",
            "**Bulk actions** — appear on selection, stating how many rows are affected.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Test tables with realistic data: long company names, missing values, negative amounts, 10,000 rows. Lorem ipsum tables hide almost every real problem.",
        },
        {
          type: 'quiz',
          question: "Where should currency amounts be aligned in a table column?",
          options: [
            "Left, like text",
            "Centred",
            "Right, with consistent decimal places",
            "It doesn't matter",
          ],
          answer: 2,
          explanation: "Right alignment with consistent decimals and tabular figures lets people compare magnitudes at a glance.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Payouts table in a marketplace admin',
          body: "An ops team reconciled seller payouts in a table where amounts were left-aligned and statuses were colour-only dots. The redesign right-aligned amounts, added text labels to statuses and a sticky seller column, and introduced 'Retry failed payouts' as a bulk action.",
          before: "Status: green or red dot. Amounts: left-aligned, mixed decimals.",
          after: "Status: 'Paid' / 'Failed — bank rejected' chips. Amounts: right-aligned, two decimals, tabular figures.",
        },
      ],
      practice: {
        task: "Redesign a data table from a tool you use with realistic data.",
        steps: [
          "Gather 20 realistic rows, including edge cases.",
          "Fix alignment, truncation and status labelling.",
          "Add sticky primary column and a bulk-action bar.",
          "Create comfortable and compact density versions.",
        ],
        deliverable: "A before/after table in Figma with annotations.",
      },
      challenge: {
        task: "Design inline editing for the table, including validation, saving and conflict states.",
        successCriteria: [
          "It's clear which cells are editable.",
          "Validation errors appear at the cell with a fix hint.",
          "Save success and failure are communicated without a full-page reload.",
          "Keyboard users can edit and move between cells.",
        ],
      },
    },
    {
      id: 'i4-complex-forms',
      title: 'Complex forms',
      summary: "Structure long, conditional forms so people can complete them accurately and without anxiety.",
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Complex forms — insurance quotes, business onboarding (KYB), grant applications, product configuration — combine many fields, conditional logic and high stakes. The goal is not fewer fields at any cost; it's **the right questions, in the right order, with the right help**.\n\nStart by auditing every field: who needs it, why, and whether it can be derived, defaulted or asked later.",
        },
        {
          type: 'list',
          items: [
            "**Group logically** — sections that match how people think (Business, Owners, Bank details).",
            "**Progressive disclosure** — reveal conditional fields only when relevant.",
            "**Explain the why** — especially for sensitive data like tax IDs or ownership.",
            "**Smart defaults and lookups** — company registry lookup, address search.",
            "**Save and resume** — long forms need drafts, especially when documents must be fetched.",
            "**Review step** — show answers before a consequential submission.",
          ],
        },
        {
          type: 'doDont',
          do: [
            "Validate inline after a field is completed, not on every keystroke.",
            "Accept flexible formats (spaces in sort codes, dashes in phone numbers).",
            "Mark optional fields rather than every required one when most are required.",
          ],
          dont: [
            "Split fields users think of as one value without reason.",
            "Clear the form after a server error.",
            "Use placeholder text as the only label.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "In regulated flows, every abandoned form is a lost customer and every wrong answer is a manual review. Form design directly affects operational cost.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Business account onboarding',
          body: "A business bank's onboarding asked for company details manually, then asked again for directors. A registry lookup pre-filled company and director information, leaving users to confirm rather than type.",
          before: "Fields: Company name, number, registered address, incorporation date, director 1 name, DOB, ... all manual.",
          after: "Step 1: 'Find your company' search. Step 2: 'Check these details' with pre-filled data and edit links.",
        },
      ],
      practice: {
        task: "Audit and restructure a long form (a tax form, a job application, an insurance quote).",
        steps: [
          "List every field with its purpose.",
          "Mark fields that could be removed, derived, defaulted or deferred.",
          "Regroup into sections and define conditional logic.",
          "Wireframe the new form including a review step.",
        ],
        deliverable: "A field audit table and restructured wireframes.",
      },
      challenge: {
        task: "Design save-and-resume for your form, including how users return on a different device.",
        successCriteria: [
          "Users know their progress is saved.",
          "Returning users land where they left off.",
          "Sensitive data handling on resume is considered.",
        ],
      },
    },
    {
      id: 'i4-multi-step-workflows',
      title: 'Multi-step workflows',
      summary: "Design workflows that span steps, sessions and people — with clear status, handoffs and recovery.",
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "A multi-step workflow isn't just a long form. It often spans **days** and **people**: a purchase request is raised, approved by a manager, reviewed by finance and fulfilled by procurement. Each person sees a different slice.\n\nDesign the workflow as a **state model** first — draft, submitted, in review, changes requested, approved, rejected, cancelled — then design the screens for each role at each state.",
        },
        {
          type: 'list',
          items: [
            "**Status visibility** — everyone can see where an item is and who holds it.",
            "**Clear handoffs** — notifications say what's needed, from whom, by when.",
            "**Reversibility** — define which steps can be undone and by whom.",
            "**Exceptions** — design for rejections, rework loops, delegation and absence.",
            "**History** — an activity timeline explains how the item reached its state.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Draw the state diagram with engineering before designing screens. It aligns everyone on edge cases, and the diagram becomes a checklist for your designs.",
        },
        {
          type: 'doDont',
          do: [
            "Show a stepper only for linear, single-session flows.",
            "Tell each person exactly what action is theirs.",
          ],
          dont: [
            "Design only the happy path.",
            "Use statuses with overlapping meanings ('Pending', 'Waiting', 'In progress').",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Vendor onboarding in a procurement tool',
          body: "Vendor onboarding involved a requester, legal, finance and the vendor. Items stalled because nobody knew who was blocking. The redesign added a status header — 'Waiting on: Finance (bank details check), 2 days' — and an activity timeline.",
          before: "Status: Pending.",
          after: "Status: 'In review — waiting on Finance to verify bank details (since Tuesday). You'll be notified when it's approved.'",
        },
      ],
      practice: {
        task: "Map and design a multi-person approval workflow.",
        steps: [
          "Choose a workflow (expense approval, content publishing, contract review).",
          "Draw the state diagram including rejections and cancellations.",
          "List what each role sees and can do in each state.",
          "Design the item detail header for three different states.",
        ],
        deliverable: "A state diagram, role matrix and three status-header designs.",
      },
      challenge: {
        task: "Design delegation: what happens when an approver is on holiday and an item is urgent.",
        successCriteria: [
          "The requester can see the delay and its reason.",
          "Approvers can set a delegate in advance.",
          "The audit history records who actually approved.",
        ],
      },
    },
    {
      id: 'i4-error-handling',
      title: 'Error handling',
      summary: "Design errors that prevent, explain and recover — across validation, system and connectivity failures.",
      minutes: 14,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Errors are where trust is won or lost, especially in money-moving products. A useful approach is to design in three layers: **prevent** errors, **explain** the ones that happen, and **recover** gracefully.\n\nDifferent error types need different treatment: **validation** errors (user input), **business-rule** errors (insufficient funds, limit reached), **system** errors (server failure) and **connectivity** errors (offline, timeout).",
        },
        {
          type: 'list',
          items: [
            "**Say what happened** in plain language, without blame.",
            "**Say what to do next** — a specific action, not 'try again later' when you know more.",
            "**Preserve work** — never lose input because of a failure.",
            "**Place it near the cause** — inline for fields, banner for page-level, toast only for low-stakes events.",
            "**Be honest about uncertainty** — 'We couldn't confirm whether your payment went through. Don't retry yet — check Activity in a minute.'",
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Ambiguous states in payments',
          body: "A timeout during a transfer is not a failure — it's unknown. Encouraging a retry can cause a duplicate payment. Design explicitly for 'pending/unknown' states.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Card payment decline',
          body: "A checkout showed 'Error 402' for every decline. The team mapped decline reasons into user-facing categories and gave specific next steps while keeping sensitive reasons (like fraud suspicion) appropriately general.",
          before: "Something went wrong (Error 402).",
          after: "Your bank declined this payment. Try another card, or contact your bank — they may need to approve online payments.",
        },
      ],
      practice: {
        task: "Write an error inventory for one flow and design each message.",
        steps: [
          "Choose a flow (money transfer, file upload, booking).",
          "List errors across all four types.",
          "Decide prevention tactics for the top three.",
          "Write message, placement and recovery action for each.",
        ],
        deliverable: "An error inventory table with copy and placement.",
      },
      challenge: {
        task: "Design the 'unknown outcome' state for a payment timeout, from the moment of timeout to resolution.",
        successCriteria: [
          "Users are discouraged from duplicate retries.",
          "The state resolves automatically when the outcome is known.",
          "Users have a clear place to check status.",
          "Copy is calm and specific.",
        ],
      },
    },
    {
      id: 'i4-empty-states-at-scale',
      title: 'Empty states at scale',
      summary: "Design a system of empty states for first use, no results, cleared work and missing permissions.",
      minutes: 12,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "In a large product, empty states appear in hundreds of places, and ad-hoc designs quickly become inconsistent. Treat them as a **system** with defined types, each with its own purpose and content pattern.",
        },
        {
          type: 'list',
          items: [
            "**First use** — nothing created yet. Explain value and offer the primary action or a template.",
            "**No results** — search or filters returned nothing. Show what's applied and how to broaden.",
            "**Cleared** — the user finished everything (inbox zero). Acknowledge and step back.",
            "**No permission** — content exists but isn't visible. Explain and offer access requests.",
            "**Error or unavailable** — data failed to load. Explain and offer retry.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Confusing an error with genuinely empty data is dangerous. 'No transactions' when the API actually failed can make a finance user believe money is missing.",
        },
        {
          type: 'doDont',
          do: [
            "Build one empty-state component with variants per type.",
            "Write copy guidelines for each type.",
            "Make first-use states role-aware (admins vs members).",
          ],
          dont: [
            "Use the same illustration and copy everywhere.",
            "Show a first-use onboarding message to someone who filtered their way to zero.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Project tool task list',
          body: "A project-management SaaS used one generic 'Nothing here yet' state across the product. Defining five types with a shared component fixed confusing moments, such as members being told to 'create your first project' when they simply lacked access.",
          before: "Nothing here yet. Create your first project!",
          after: "You don't have access to projects in this workspace yet. Ask an admin (Sam or Lee) to add you.",
        },
      ],
      practice: {
        task: "Inventory empty states in a product and classify them.",
        steps: [
          "Find at least eight empty states in one product.",
          "Classify each by type.",
          "Flag any that are misleading or inconsistent.",
          "Draft copy guidelines for each type.",
        ],
        deliverable: "An inventory board with classifications and guidelines.",
      },
      challenge: {
        task: "Design an empty-state component with variants for all five types, ready for a design system.",
        successCriteria: [
          "Each variant has distinct copy guidance and actions.",
          "Error and empty variants are visually distinguishable.",
          "The component works in small panels as well as full pages.",
        ],
      },
    },
    {
      id: 'i4-accessibility-in-complex-ui',
      title: 'Accessibility in complex UI',
      summary: "Make tables, dashboards, dialogs and dynamic updates work for keyboard and screen-reader users.",
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Accessibility basics — contrast, labels, alt text — are table stakes. Complex UI adds harder problems: **focus management** in dialogs and drawers, **keyboard navigation** in grids, **announcing dynamic changes** like filter results or toast messages, and **making charts understandable** without sight.\n\nMany of these are design decisions, not just implementation details. If the design doesn't specify focus order or what gets announced, engineers have to guess.",
        },
        {
          type: 'list',
          items: [
            "**Focus order** — annotate where focus goes when a dialog opens, closes, or a row is deleted.",
            "**Keyboard patterns** — define shortcuts and arrow-key behaviour in grids and menus.",
            "**Live updates** — specify what's announced ('24 results') and when.",
            "**Charts** — provide a data table or text summary alongside visualisations.",
            "**Status without colour** — pair colour with text or icons.",
            "**Target size** — keep dense UIs usable; WCAG 2.2 sets a minimum target size criterion.",
          ],
        },
        {
          type: 'interactive',
          widget: 'contrast-checker',
          caption: "Check status chip colours in your dashboard — muted tints often fail contrast in dense UI.",
        },
        {
          type: 'link',
          url: 'https://www.w3.org/WAI/WCAG22/quickref/',
          title: 'WCAG 2.2 quick reference',
          description: "Filterable list of success criteria and techniques.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Delete row in a data table',
          body: "When a user deleted a row in an admin table, focus jumped to the top of the page, so keyboard users lost their place. The design spec was updated: after deletion, focus moves to the next row, and a live region announces 'Invoice INV-204 deleted. Undo available.'",
          before: "Spec: Row disappears. (Focus behaviour unspecified.)",
          after: "Spec: Focus moves to next row (or previous if last); announce deletion; undo button in toast is reachable by keyboard.",
        },
      ],
      practice: {
        task: "Annotate a complex screen with accessibility specifications.",
        steps: [
          "Pick a dashboard or table screen you've designed.",
          "Annotate tab order and landmark regions.",
          "Specify focus behaviour for one dialog and one destructive action.",
          "Define announcements for two dynamic updates.",
        ],
        deliverable: "An annotated screen with an accessibility layer.",
      },
      challenge: {
        task: "Navigate a complex product you use with keyboard only (and a screen reader if you can) and write up the top issues with fixes.",
        successCriteria: [
          "At least five issues are documented with location and impact.",
          "Each issue has a specific design fix.",
          "Relevant WCAG criteria are referenced where you're confident of them.",
        ],
      },
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Module 5 — Design Systems                                           */
/* ------------------------------------------------------------------ */

const designSystems: Module = {
  id: 'i-m5-design-systems',
  title: 'Design Systems',
  stage: 'Systems',
  summary: "Build and run a design system: tokens, components, documentation, governance and handoff.",
  outcome: "You'll be able to contribute to or set up a design system that teams actually adopt and trust.",
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'i5-tokens',
      title: 'Tokens',
      summary: "Structure design tokens in tiers so brand, theme and component decisions stay flexible and consistent.",
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Design tokens are named design decisions — colours, spacing, radii, type, shadows — stored in a format both design tools and code can use. Their power comes from **tiers**, which separate raw values from meaning.\n\n**Primitive** (or global) tokens hold raw values: `blue-600 = #2563EB`. **Semantic** tokens describe purpose: `color-action-primary = blue-600`. **Component** tokens (optional) scope decisions: `button-primary-bg = color-action-primary`.",
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Semantic tokens let you change a theme, support dark mode or rebrand by remapping a layer, without touching hundreds of components. Components that reference primitives directly lock you in.",
        },
        {
          type: 'doDont',
          do: [
            "Have components reference semantic tokens.",
            "Name by purpose: `text-subtle`, `border-danger`, `surface-raised`.",
            "Keep the primitive palette small and deliberate.",
          ],
          dont: [
            "Name semantic tokens after values (`text-grey-500`).",
            "Create a component token for every property by default.",
            "Let teams bypass tokens with hard-coded hex values.",
          ],
        },
        {
          type: 'interactive',
          widget: 'spacing-scale',
          caption: "Explore how a spacing scale becomes a set of primitive tokens that semantic spacing can reference.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Adding dark mode to a fintech dashboard',
          body: "A fintech dashboard's components referenced primitive colours directly, so dark mode meant editing every component. After introducing a semantic layer, dark mode became a second mapping of the same semantic tokens.",
          before: "Card background: `gray-50`. Text: `gray-900`.",
          after: "Card background: `surface-default` (gray-50 in light, gray-900 in dark). Text: `text-default`.",
        },
      ],
      practice: {
        task: "Define a two-tier colour token set for a small product.",
        steps: [
          "Create a primitive palette (neutrals, brand, and status colours).",
          "Define 15–20 semantic tokens for text, surfaces, borders and actions.",
          "Map semantic tokens to primitives for light mode.",
          "Create the dark-mode mapping for the same semantic tokens.",
        ],
        deliverable: "A token table with primitive, semantic, light and dark values.",
      },
      challenge: {
        task: "Apply your tokens to three components and prove a rebrand by changing only primitives.",
        successCriteria: [
          "Components reference only semantic tokens.",
          "A brand colour change updates all three components correctly.",
          "Contrast still meets requirements after the change.",
        ],
      },
    },
    {
      id: 'i5-variables',
      title: 'Variables',
      summary: "Use Figma Variables and modes to implement tokens, themes and density in your design files.",
      minutes: 14,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Tokens are the concept; **Variables** are how Figma stores them. Variables can hold colours, numbers, strings and booleans, and can reference other variables — which is exactly how you implement primitive and semantic tiers.\n\n**Collections** group related variables, and **modes** let one collection hold different values for different contexts: light and dark, brand A and brand B, comfortable and compact density.",
        },
        {
          type: 'list',
          items: [
            "**Primitives collection** — raw values, often hidden from publishing so designers pick semantic ones.",
            "**Semantic collection** — aliases to primitives, with modes for themes.",
            "**Scoping** — restrict where a variable can be applied (e.g. spacing only for gaps and padding).",
            "**Number variables** — spacing, radii and sizes, usable in Auto Layout.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Mirror your code's token names in Figma variable names. When they match, handoff conversations shrink to 'use `space-4`' rather than 'about 16px'.",
        },
        {
          type: 'link',
          url: 'https://help.figma.com',
          title: 'Figma Help Center',
          description: "Search for 'variables' and 'modes' for the current official guidance.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Density modes for an internal tool',
          body: "An operations tool served both new staff and expert users. The team created a spacing collection with Comfortable and Compact modes. Designers could switch a whole frame's density and check that tables stayed legible.",
          before: "Two separate sets of table components for two densities.",
          after: "One table component whose padding uses spacing variables, switched by mode.",
        },
      ],
      practice: {
        task: "Implement your token table from the previous lesson as Figma Variables.",
        steps: [
          "Create a primitives collection and a semantic collection.",
          "Alias semantic variables to primitives.",
          "Add light and dark modes to the semantic collection.",
          "Apply variables to a sample card and switch modes.",
        ],
        deliverable: "A Figma file with two collections and a card that switches theme cleanly.",
      },
      challenge: {
        task: "Add a density mode for spacing and apply it to a data table component.",
        successCriteria: [
          "Spacing uses number variables, not hard-coded values.",
          "Switching mode updates the whole table.",
          "Variable scopes prevent misuse (e.g. colour variables in spacing).",
        ],
      },
    },
    {
      id: 'i5-components',
      title: 'Components',
      summary: "Design system components with clear APIs, composition and flexibility that doesn't collapse into chaos.",
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "A system component is a product in its own right, with users (designers and engineers) and an **API** — the properties they can set. Good component APIs are small, predictable and match the coded component.\n\nThe central trade-off is **flexibility vs consistency**. Too rigid and teams detach components to get work done. Too flexible and every screen looks different.",
        },
        {
          type: 'list',
          items: [
            "**Composition over configuration** — build a Card from slots (header, body, footer) rather than 30 boolean properties.",
            "**Properties that match code** — boolean, text, instance swap, variant — named like the props engineers use.",
            "**Built-in states** — hover, focus, disabled, loading, error defined in the component, not by each designer.",
            "**Real content resilience** — test with long labels, translations and missing data.",
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Detach rate is a signal',
          body: "When designers frequently detach a component, the component is failing a real need. Investigate what they changed rather than policing it.",
        },
        {
          type: 'interactive',
          widget: 'button-states',
          caption: "Review the full state set a button component must define before it's system-ready.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Modal component in a B2B platform',
          body: "A modal component grew to 18 boolean properties as teams requested options. Rebuilding it with header, body and footer slots, plus a size variant, cut the property count while covering more use cases.",
          before: "Modal props: hasIcon, hasSubtitle, hasSecondaryButton, hasTertiaryButton, hasCheckbox, isWide...",
          after: "Modal props: size (sm, md, lg), header slot, body slot, footer slot with action-group instance.",
        },
      ],
      practice: {
        task: "Build a card component with a clear, slot-based API.",
        steps: [
          "Collect five card uses from a product.",
          "Identify the shared structure and differing parts.",
          "Build the component with slots and a small set of properties.",
          "Test it by recreating all five uses without detaching.",
        ],
        deliverable: "A Figma card component and the five recreated uses.",
      },
      challenge: {
        task: "Write the component's API spec so an engineer could build the coded version to match.",
        successCriteria: [
          "Every property is named, typed and described.",
          "States and accessibility behaviour are defined.",
          "Usage boundaries (when not to use it) are stated.",
        ],
      },
    },
    {
      id: 'i5-variants',
      title: 'Variants',
      summary: "Model variants and properties so component sets stay manageable as they grow.",
      minutes: 13,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Variants group related versions of a component in one set, organised by properties like `size`, `type` and `state`. Poorly modelled, a button can explode into hundreds of combinations that nobody can maintain.\n\nThe skill is choosing **which differences deserve a variant property** and which should be handled by other property types (boolean for showing an icon, instance swap for which icon, text for the label).",
        },
        {
          type: 'list',
          items: [
            "**Variant property** — changes structure or style significantly (type: primary/secondary/ghost).",
            "**Boolean** — toggles an optional element (show leading icon).",
            "**Instance swap** — chooses which nested component (which icon).",
            "**Text** — editable content (label).",
          ],
        },
        {
          type: 'quiz',
          question: "A button has 3 types, 3 sizes, 5 states and an optional icon on the left or right. Which modelling is most maintainable?",
          options: [
            "One variant property per combination, e.g. 'Primary-Large-Hover-IconLeft'.",
            "Variant properties for type, size and state; booleans for left and right icon; instance swap for the icon.",
            "Separate components for every size.",
            "One component with no variants, styled manually each time.",
          ],
          answer: 1,
          explanation: "Variant properties handle the real visual differences, while booleans and instance swap avoid multiplying the set by every icon combination.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Consider whether interaction states belong in the design component at all. Many teams keep hover and pressed in documentation specs and only include states designers actually need to show in mockups, like disabled and loading.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Badge component cleanup',
          body: "A status badge set had 96 variants because every colour and icon pairing was drawn separately. Remodelling into a `status` variant property plus an optional-icon boolean reduced it to a handful of variants with identical coverage.",
          before: "96 variants: Badge/Success/Icon/Small, Badge/Success/NoIcon/Small, ...",
          after: "Properties: status (neutral, info, success, warning, danger), size (sm, md), showIcon (boolean).",
        },
      ],
      practice: {
        task: "Remodel an over-grown component set.",
        steps: [
          "Pick a component with many variants (from your file or a community kit).",
          "List every property that differs across variants.",
          "Assign each to variant, boolean, instance swap or text.",
          "Rebuild the set and count variants before and after.",
        ],
        deliverable: "The rebuilt component set with a before/after variant count.",
      },
      challenge: {
        task: "Model an input field component covering sizes, states, validation, prefix/suffix and helper text.",
        successCriteria: [
          "No property combination is duplicated.",
          "Every realistic field in a form can be built without detaching.",
          "Property names match a plausible coded component API.",
        ],
      },
    },
    {
      id: 'i5-naming',
      title: 'Naming',
      summary: "Create naming conventions for tokens, components and properties that scale and match code.",
      minutes: 12,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Naming is the interface of a design system. Names determine whether people can find things, predict what exists and talk to engineers without translation. Inconsistent names ('Btn', 'Button/Main', 'CTA') create duplicates and distrust.\n\nA naming convention is a **grammar**: a consistent order of parts that everyone can predict.",
        },
        {
          type: 'list',
          items: [
            "**Tokens** — category, property, concept, variant, state: `color-text-danger`, `color-bg-action-hover`.",
            "**Components** — the noun people use, matching code: `Button`, `TextField`, `Select`.",
            "**Properties** — lowercase and code-aligned: `size`, `variant`, `isDisabled` or `disabled` (pick one style).",
            "**Values** — ordered consistently: `sm, md, lg` everywhere, not `small` in one place and `S` in another.",
          ],
        },
        {
          type: 'doDont',
          do: [
            "Agree conventions with engineering and write them down.",
            "Name by purpose, not appearance ('danger', not 'red').",
            "Keep a glossary of terms and their meanings.",
          ],
          dont: [
            "Use abbreviations only some people understand.",
            "Encode temporary context ('New', 'v2', 'Final').",
            "Rename widely used items without a migration plan.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "When design and code share names, handoff becomes a lookup instead of a negotiation, and automated token pipelines become possible.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Aligning names with a React library',
          body: "A marketplace's Figma library called a component 'Dropdown Menu v2 (new)', while engineers had `Select` and `Menu` as separate components. Renaming and splitting the Figma component to match removed a recurring source of wrong implementations.",
          before: "Figma: Dropdown Menu v2 (new) — used for both selecting values and triggering actions.",
          after: "Figma: Select (choose a value) and Menu (trigger actions), matching code names and props.",
        },
      ],
      practice: {
        task: "Audit naming in a design library and propose a convention.",
        steps: [
          "List 20 component and token names from a library.",
          "Mark inconsistencies in order, case and vocabulary.",
          "Write a naming grammar for tokens and components.",
          "Rename the 20 items using the grammar.",
        ],
        deliverable: "A naming convention doc with before/after examples.",
      },
      challenge: {
        task: "Plan a rename of a widely used component, including communication and migration.",
        successCriteria: [
          "Affected files and teams are identified.",
          "There's a deprecation period, not an overnight change.",
          "Design and code renames are coordinated.",
        ],
      },
    },
    {
      id: 'i5-documentation',
      title: 'Documentation',
      summary: "Write component documentation people actually read: usage, behaviour, content and accessibility.",
      minutes: 14,
      difficulty: 'Medium',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Documentation is how a design system scales beyond the people who built it. The best docs answer the questions people actually have in the moment: *Should I use this? Which variant? What happens on error? What do I write in it?*\n\nWrite for two audiences at once — designers choosing and composing, engineers implementing and testing — and keep each page scannable.",
        },
        {
          type: 'checklist',
          title: 'A useful component page',
          items: [
            "One-sentence purpose and when **not** to use it (with the alternative).",
            "Anatomy with labelled parts.",
            "Variants and when to use each.",
            "Behaviour: states, interactions, responsive rules.",
            "Content guidance: label length, tone, examples.",
            "Accessibility: keyboard, focus, announcements.",
            "Do/don't examples from real product screens.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Put guidance where people work. Short descriptions on components in the Figma library, and links from code props to the doc page, get far more use than a standalone site alone.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Toast documentation',
          body: "Teams were using toasts for critical errors that disappeared before users could read them. Adding a 'when not to use' section — 'Don't use for errors that need action; use an inline alert or banner' — plus timing and accessibility rules reduced misuse in reviews.",
          before: "Toast: Shows a temporary message. Variants: success, error, info.",
          after: "Toast: Confirms low-stakes, completed actions. Don't use for errors requiring action — use Alert. Stays visible while focused or hovered; announced politely to screen readers.",
        },
      ],
      practice: {
        task: "Write a complete documentation page for one component.",
        steps: [
          "Pick a component you know well.",
          "Write purpose and when-not-to-use first.",
          "Add anatomy, variants and behaviour.",
          "Add content, accessibility and do/don't guidance.",
        ],
        deliverable: "A one-page component doc following the checklist.",
      },
      challenge: {
        task: "Test your documentation: ask a designer and an engineer to use it for a task, and revise.",
        successCriteria: [
          "Both completed the task without asking you questions, or gaps were recorded.",
          "At least two improvements were made from feedback.",
          "The page remains scannable in under two minutes.",
        ],
      },
    },
    {
      id: 'i5-governance',
      title: 'Governance',
      summary: "Decide who owns the system, how decisions are made, and how change is released without breaking products.",
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "Governance is the operating model of a design system: who decides, how changes are proposed and reviewed, how releases are versioned and communicated, and how deprecated parts are removed. Without it, systems either stagnate or fragment.\n\nCommon models include a **centralised** team that owns everything, a **federated** model where product designers across teams contribute under shared rules, and **hybrids** of both.",
        },
        {
          type: 'list',
          items: [
            "**Decision rights** — who approves new components, token changes and breaking changes.",
            "**Intake** — a clear way to request or propose changes.",
            "**Versioning** — semantic versioning and changelogs for design and code libraries.",
            "**Deprecation** — announce, provide migration paths, then remove.",
            "**Health signals** — adoption, detach rates, open requests, time to resolve.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Governance isn't bureaucracy for its own sake. Product teams trust a system when changes are predictable and they have a voice. That trust is what drives adoption.",
        },
        {
          type: 'doDont',
          do: [
            "Publish release notes that explain impact, not just changes.",
            "Hold regular open office hours.",
            "Allow documented, time-limited exceptions.",
          ],
          dont: [
            "Ship breaking changes without warning.",
            "Treat every product request as a system request.",
            "Measure success by component count.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Breaking change to a Button',
          body: "A system team needed to change button heights to meet touch-target guidance. They announced it two releases ahead, provided a migration guide and a Figma library branch to preview, and tracked which product files were still on the old version.",
          before: "Library update published on a Friday with the note 'Updated buttons'.",
          after: "Release notes: what changed, why, who is affected, how to migrate, and the date the old version is removed.",
        },
      ],
      practice: {
        task: "Draft a lightweight governance charter for a design system.",
        steps: [
          "Choose a team model and justify it for the organisation size.",
          "Define decision rights for three types of change.",
          "Describe the intake process and review cadence.",
          "Define versioning and deprecation rules.",
        ],
        deliverable: "A one to two page governance charter.",
      },
      challenge: {
        task: "Design a system health dashboard showing signals that would tell you governance is working or failing.",
        successCriteria: [
          "Signals relate to adoption and trust, not output volume.",
          "Each signal has a clear definition and data source.",
          "At least one signal triggers a specific action when it worsens.",
        ],
      },
    },
    {
      id: 'i5-contribution-models',
      title: 'Contribution models',
      summary: "Set up contribution paths so product teams can improve the system without chaos.",
      minutes: 13,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "No central team can anticipate every need. Contribution models let product designers and engineers feed improvements back, turning the system from a service into a shared asset.\n\nContributions come in sizes: **fixes** (a bug, a typo in docs), **enhancements** (a new property on an existing component), and **new patterns** (a component that doesn't exist yet). Each deserves a different process.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            "**Propose** — describe the need, the use cases and evidence from more than one team.",
            "**Review fit** — is it generic enough for the system, or should it stay local?",
            "**Design and build** — with a system team partner, following conventions.",
            "**Document** — usage, behaviour and accessibility before release.",
            "**Release and credit** — ship through normal versioning and credit contributors publicly.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Local first, then promote',
          body: "Encourage teams to build a pattern locally and use it in production. If other teams adopt it, promote it to the system. This proves real demand before investing in a generic version.",
        },
        {
          type: 'doDont',
          do: [
            "Provide templates for proposals.",
            "Make small fixes easy and fast to merge.",
          ],
          dont: [
            "Accept one-off components into the core library.",
            "Let contributions sit unreviewed for weeks.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Date range picker contribution',
          body: "The analytics team built a date range picker with relative presets. The billing and reporting teams later needed the same. The system team paired with the original designer to generalise it, add accessibility specs and publish it, crediting the analytics team in release notes.",
          before: "Three teams built three different date range pickers.",
          after: "One contributed component, promoted after proven use, with the original team credited.",
        },
      ],
      practice: {
        task: "Write a contribution proposal for a component or pattern your product needs.",
        steps: [
          "Describe the problem and current workarounds.",
          "Gather use cases from at least two product areas.",
          "Sketch the component and its API.",
          "State whether it should be local or system-level, and why.",
        ],
        deliverable: "A contribution proposal using a clear template.",
      },
      challenge: {
        task: "Design the full contribution process for your organisation as a flow diagram with roles and timelines.",
        successCriteria: [
          "Fixes, enhancements and new patterns have different paths.",
          "Every step has an owner and expected response time.",
          "Contributors receive visible credit.",
        ],
      },
    },
    {
      id: 'i5-design-to-development-handoff',
      title: 'Design-to-development handoff',
      summary: "Make handoff a continuous collaboration with specs that engineers can build from without guessing.",
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: "'Handoff' suggests a single moment when design is thrown over the wall. In strong teams it's a **continuous collaboration**: engineers join early reviews, designers stay involved through build, and the final spec simply records decisions already discussed.\n\nTools like Figma's Dev Mode help engineers inspect values, but they can't show what isn't designed: edge cases, behaviour and intent.",
        },
        {
          type: 'checklist',
          title: 'Ready-for-build spec',
          items: [
            "Uses system components and tokens; any new ones are flagged.",
            "All states covered: empty, loading, error, partial, permission-restricted.",
            "Responsive rules annotated, not just multiple frames.",
            "Interaction and motion described (what triggers what).",
            "Content: real copy, max lengths, truncation rules.",
            "Accessibility: focus order, labels, announcements.",
            "Open questions listed with owners.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Every unanswered question in a spec becomes a guess in code, and guesses add up to a product that doesn't match the design — or a stream of late changes that frustrates everyone.",
        },
        {
          type: 'doDont',
          do: [
            "Walk engineers through the flow live, then share the file.",
            "Mark frames clearly as ready, in progress or exploration.",
            "Review the built product against the design before release.",
          ],
          dont: [
            "Leave old explorations next to final designs without labels.",
            "Change designs after build starts without telling anyone.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Bulk invoice export in a finance SaaS',
          body: "The first handoff for a bulk export feature showed only the happy path. The engineer asked about large exports, failures and permissions mid-sprint. The next project used the checklist, and the spec included async progress, email delivery, failure recovery and admin-only access states from the start.",
          before: "Handoff: Two frames — select invoices, download starts.",
          after: "Handoff: Flow with selection, async progress, 'We'll email you when it's ready' for large exports, failure retry, and viewer-permission state.",
        },
      ],
      practice: {
        task: "Prepare a ready-for-build spec for a feature you've designed.",
        steps: [
          "Organise the file into ready, in-progress and archive sections.",
          "Add missing states from the checklist.",
          "Annotate behaviour, responsive rules and accessibility.",
          "List open questions with owners.",
        ],
        deliverable: "A Figma page that passes every item on the checklist.",
      },
      challenge: {
        task: "Run a design QA pass on a built feature and file clear, prioritised issues.",
        successCriteria: [
          "Each issue has a screenshot, expected vs actual, and severity.",
          "Issues distinguish bugs from design changes.",
          "The list is agreed with the engineer, not just sent.",
          "You note one process change to prevent the most common issue.",
        ],
      },
    },
  ],
}

export const intermediateCraft: Course = {
  id: 'i-product-craft',
  title: 'Product Design Craft',
  description: "Level up from screens to products: product thinking, research, information architecture, complex UI and design systems.",
  published: true,
  modules: [productThinking, research, informationArchitecture, advancedUi, designSystems],
}
