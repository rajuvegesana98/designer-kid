import type { Course, Module } from '../types'

/**
 * Expert level seed content — for experienced senior designers.
 * Focus: strategy, systems, organisational dynamics, influence and decision quality.
 */

const ADDED = '2026-09-01'

// ---------------------------------------------------------------------------
// Module 1 — Product Strategy
// ---------------------------------------------------------------------------

const moduleStrategy: Module = {
  id: 'e-m1-strategy',
  title: 'Product Strategy',
  stage: 'Strategy',
  summary: 'Move from shaping screens to shaping bets: strategy, discovery, measurement and decisions under uncertainty.',
  outcome: 'You will be able to frame, defend and revise product bets with the rigour leadership expects from a senior designer.',
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'e1-product-strategy',
      title: 'Product strategy: a set of choices, not a roadmap',
      summary: 'Separate strategy from plans and goals, and learn to spot the difference in your own organisation.',
      minutes: 18,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Most documents labelled "product strategy" are actually one of three other things: a **goal** ("grow enterprise revenue"), a **plan** (a roadmap of features), or a **vision** (an aspirational picture of the future). None of these tells a team what to say no to.\n\nA strategy is a coherent set of choices about *where to play* and *how to win*, grounded in a diagnosis of what is really going on. Richard Rumelt\'s framing is useful here: a diagnosis, a guiding policy, and coherent actions. If a document has no diagnosis, it is a wish list.',
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why designers must engage here',
          body: 'Design decisions quietly encode strategy — who the product is optimised for, which job gets the prime real estate, what is made effortless and what is made possible-but-hidden. If the strategy is vague, designers end up making strategic choices by default, one component at a time, without anyone noticing.',
        },
        {
          type: 'list',
          items: [
            '**Diagnosis:** what is the critical challenge? ("Mid-market customers churn in month three because setup requires an admin they do not have.")',
            '**Guiding policy:** the approach that addresses it. ("We will make the product self-serve for a single operator before we add team features.")',
            '**Coherent actions:** the moves that follow — and the moves that are now explicitly off the table.',
            '**Tradeoffs stated out loud:** who we are deliberately *not* serving well this year.',
          ],
        },
        {
          type: 'quiz',
          question: 'Which statement is closest to a genuine strategy?',
          options: [
            'Become the most loved invoicing tool in Europe.',
            'Ship multi-currency, approvals and a mobile app by Q3.',
            'Win freelancers first by making the first invoice take under a minute, and defer team workflows until retention is proven.',
            'Increase NPS and reduce churn across all segments.',
          ],
          answer: 2,
          explanation: 'Only the third option makes a choice (freelancers first), names how to win (speed to first invoice), and states what is deferred. The others are a vision, a plan and a goal.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Reframing a feature roadmap as a strategy',
          body: 'A B2B scheduling product had a roadmap of twelve features requested by sales. The lead designer rewrote the opening of the planning doc around a diagnosis: deals were lost not for missing features but because trials never reached a first booked meeting. The roadmap shrank to four items, all serving time-to-first-booking.',
          before: 'Q3 strategy: calendar sync v2, custom branding, reporting, SSO, round-robin, …',
          after: 'Diagnosis: trials stall before the first booking. Policy: optimise the first 15 minutes for solo users. Deferred: SSO and reporting until activation improves.',
        },
      ],
      practice: {
        task: 'Take your current product\'s stated strategy (or roadmap) and test whether it is actually a strategy.',
        steps: [
          'Find the written artefact your team treats as "the strategy".',
          'Highlight any sentence that is a diagnosis, a guiding policy, or a coherent action.',
          'List three things the document implies you should say no to — if you cannot, note that.',
          'Rewrite the first paragraph as diagnosis → policy → actions in under 120 words.',
        ],
        deliverable: 'A one-page annotated critique plus your 120-word rewrite.',
      },
      challenge: {
        task: 'Share your rewrite with your PM or design manager and ask them to argue against the diagnosis.',
        successCriteria: [
          'The diagnosis names a specific obstacle, not a goal.',
          'At least one explicit tradeoff (a segment or feature deprioritised) is stated.',
          'You captured the strongest counter-argument and how you would test it.',
        ],
      },
    },
    {
      id: 'e1-business-strategy',
      title: 'Business strategy for designers',
      summary: 'Understand how your company makes money so your design arguments land in the language of the business.',
      minutes: 16,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Senior designers are often told they need "a seat at the table". The seat is usually earned by being able to reason about the business model as fluently as about the interface.\n\nYou do not need to be a finance expert. You need to understand the handful of levers that matter for *your* model: acquisition cost and channel, activation, retention, expansion, margin, and — in marketplaces — liquidity on both sides.',
        },
        {
          type: 'list',
          items: [
            '**Subscription SaaS:** retention and expansion usually dominate; a design that reduces churn compounds over time.',
            '**Transactional / e-commerce:** conversion, basket size and repeat purchase; returns and support costs quietly eat margin.',
            '**Marketplace:** supply quality and demand match; a great buyer experience fails if sellers leave.',
            '**Ads-funded:** attention and inventory; this creates real tension with user wellbeing that designers must name.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Do not become a revenue mouthpiece',
          body: 'Speaking the business language is a means to advocate better for users, not a replacement for it. The most valuable move is showing where user value and business value align — and being honest when they do not.',
        },
        {
          type: 'doDont',
          do: [
            'Tie a proposal to the lever it moves ("this reduces setup-related support tickets").',
            'Ask finance or sales ops how the model actually works — they are usually happy to explain.',
            'Acknowledge costs: engineering time, support load, opportunity cost.',
          ],
          dont: [
            'Invent revenue projections to make a design sound important.',
            'Assume more engagement is always good for the business.',
            'Ignore unit economics when proposing generous free tiers or flows.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Same design, different argument',
          body: 'A designer proposed simplifying a food-delivery app\'s order-tracking screen. The first pitch was about clarity. The second pitch connected it to "where is my order?" contacts, which the operations team already tracked as a cost driver. Same design; the second version got prioritised because it named a lever someone already owned.',
          before: '"This screen is cluttered and confusing for users."',
          after: '"Unclear ETAs drive a large share of support contacts. This redesign targets that directly; we can measure contact rate per order."',
        },
      ],
      practice: {
        task: 'Map your product\'s business model on one page.',
        steps: [
          'Write how the company makes money in one sentence.',
          'List the three to five levers that most affect that model.',
          'For each lever, name the team or person who owns it and the metric they watch.',
          'Mark which levers your current design work actually touches.',
        ],
        deliverable: 'A one-page business-model map annotated with your team\'s influence.',
      },
      challenge: {
        task: 'Book 30 minutes with someone in finance, sales ops or growth and validate your map.',
        successCriteria: [
          'At least one assumption on your map was corrected or refined.',
          'You can name the lever your next project should move and who owns it.',
          'You identified one place where user and business value conflict.',
        ],
      },
    },
    {
      id: 'e1-continuous-discovery',
      title: 'Continuous product discovery',
      summary: 'Build a weekly habit of customer contact so decisions stop depending on big, infrequent research projects.',
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Project-based research has a structural flaw: by the time findings arrive, the decisions they should inform have often been made. Continuous discovery — popularised by Teresa Torres — treats customer contact as a weekly habit of the *product trio* (PM, designer, engineer), not a phase.\n\nThe point is not volume of interviews. It is shortening the loop between an assumption and evidence about it.',
        },
        {
          type: 'list',
          items: [
            '**Automate recruiting** — an in-product prompt or a standing panel, so scheduling is not the bottleneck.',
            '**Interview about past behaviour** ("tell me about the last time you…"), not opinions about the future.',
            '**Synthesise into snapshots** — one page per interview, shared with the trio.',
            '**Test assumptions, not whole ideas** — small, fast tests on the riskiest belief.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'The senior designer\'s role',
          body: 'Your job is less to run every interview and more to design the system: protect the cadence, coach teammates to interview well, and make sure evidence actually reaches decisions. A habit that only survives while you personally push it is not yet a system.',
        },
        {
          type: 'doDont',
          do: [
            'Include engineers in interviews — they spot feasibility and edge cases early.',
            'Keep a visible log of assumptions and what evidence changed.',
          ],
          dont: [
            'Treat discovery as validation theatre for decisions already made.',
            'Let "we talk to customers weekly" replace deeper generative research when it is needed.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'From quarterly study to weekly loop',
          body: 'A SaaS analytics team ran one large research study per quarter. A senior designer set up an in-app recruit link targeting users who had created a dashboard in the past week, and booked two 30-minute slots every Tuesday. Within a month, the trio had overturned an assumption that users wanted more chart types — the real struggle was sharing dashboards with non-users.',
        },
      ],
      practice: {
        task: 'Design a continuous discovery cadence for your team that can survive a busy quarter.',
        steps: [
          'Choose a recruiting mechanism that needs no manual effort per interview.',
          'Define the interview slot, who attends, and the snapshot template.',
          'List your team\'s top five current assumptions.',
          'Decide where evidence will be visible (a shared board, a doc) and who reviews it.',
        ],
        deliverable: 'A one-page discovery operating plan your trio could adopt next week.',
      },
      challenge: {
        task: 'Run the cadence for three consecutive weeks and review what changed.',
        successCriteria: [
          'At least six interviews completed with snapshots written.',
          'At least one assumption was explicitly revised based on evidence.',
          'An engineer or PM attended at least half the sessions.',
        ],
      },
    },
    {
      id: 'e1-opportunity-solution-trees',
      title: 'Opportunity solution trees',
      summary: 'Structure the space between an outcome and solutions so teams compare options instead of defending favourites.',
      minutes: 17,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'An opportunity solution tree (OST) has four layers: a **desired outcome** at the top, **opportunities** (customer needs, pain points, desires) beneath it, **solutions** under each opportunity, and **assumption tests** under each solution.\n\nIts real value is political as much as analytical. It makes visible that a favoured feature is just one of several ways to address one of several opportunities — which defuses "my idea vs your idea" debates.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Start with one measurable product outcome the team can influence (not a business outcome like revenue).',
            'Map opportunities from research, phrased from the customer\'s perspective.',
            'Break large opportunities into smaller, more solvable ones.',
            'Choose a target opportunity deliberately — and write down why.',
            'Generate at least three solutions for it before committing to any.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Common failure modes',
          body: 'Opportunities written as solutions in disguise ("users need a dashboard"); trees built once for a workshop and never updated; and outcomes that are really outputs ("launch feature X"). A tree that never changes is decoration.',
        },
        {
          type: 'quiz',
          question: 'Which is the best-formed opportunity?',
          options: [
            'Add bulk editing to the orders table.',
            'Increase weekly active users by 10%.',
            'I lose track of which orders I have already updated when handling many at once.',
            'Improve the orders page UX.',
          ],
          answer: 2,
          explanation: 'It is a customer need in their words, specific enough to generate multiple solutions (bulk edit is only one), and not an outcome or a feature.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Defusing a feature fight',
          body: 'Sales wanted a Slack integration; support wanted better email notifications. The designer built a tree under the outcome "reduce time-to-respond on customer tickets". Both ideas sat under the same opportunity ("I miss new tickets when I am not in the app"), alongside a cheaper third option — mobile push. The debate moved from whose idea wins to which test is cheapest.',
        },
      ],
      practice: {
        task: 'Build an opportunity solution tree for one of your team\'s current outcomes.',
        steps: [
          'Write the outcome and confirm the team can directly influence it.',
          'Add eight to twelve opportunities drawn from real research notes.',
          'Group and nest them; pick one target opportunity and justify it.',
          'Generate three distinct solutions and one assumption test for each.',
        ],
        deliverable: 'A tree in FigJam or similar, with a written rationale for the target opportunity.',
      },
      challenge: {
        task: 'Use the tree to facilitate a prioritisation conversation where stakeholders currently disagree.',
        successCriteria: [
          'Each stakeholder\'s preferred idea appears on the tree.',
          'The group agreed on the next assumption to test, not the next feature to build.',
          'The tree was updated after the session with new evidence or opportunities.',
        ],
      },
    },
    {
      id: 'e1-metrics-design',
      title: 'Product metrics & measurement design',
      summary: 'Design measurement as carefully as interfaces: meaningful signals, guardrails and honest interpretation.',
      minutes: 20,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Metrics shape behaviour. Choose the wrong one and a team will optimise it faithfully in the wrong direction — Goodhart\'s law in practice. Senior designers should help design the measurement, not just receive a target.\n\nA useful structure: one **primary metric** that reflects user value, a few **input metrics** the team can move week to week, and **guardrail metrics** that must not get worse.',
        },
        {
          type: 'list',
          items: [
            '**Value-aligned:** the metric rises when users genuinely succeed (e.g. "invoices paid", not "invoices viewed").',
            '**Sensitive:** it moves within a timeframe the team can learn from.',
            '**Hard to game:** consider how someone could inflate it without helping anyone.',
            '**Paired with qualitative signal:** numbers show *what*, research shows *why*.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Frameworks as prompts, not answers',
          body: 'Google\'s HEART (Happiness, Engagement, Adoption, Retention, Task success) with its Goals–Signals–Metrics process is a good prompt for design-led measurement. Use it to widen the conversation, then pick the few metrics that actually matter.',
        },
        {
          type: 'doDont',
          do: [
            'Define metrics before launch, including what result would change your mind.',
            'Add guardrails like support contacts, error rates or unsubscribes.',
            'Segment results — averages hide the users you are failing.',
          ],
          dont: [
            'Use time-on-page as success for a task users want to finish quickly.',
            'Report only the metrics that went up.',
            'Treat a dashboard as a substitute for a decision.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Choosing a primary metric for search',
          body: 'An internal-tools team measured search success by "searches per user". It rose after a redesign — because people were refining failed queries more often. The designer proposed "sessions where a search led to opening a result within 30 seconds", with "repeated searches per session" as a guardrail.',
          before: 'Primary metric: searches per user (up = good).',
          after: 'Primary: successful search sessions. Guardrail: repeated queries per session. Qual: weekly review of zero-result queries.',
        },
      ],
      practice: {
        task: 'Write a measurement plan for a feature you are designing now.',
        steps: [
          'State the user outcome the feature should create.',
          'Pick one primary metric, two or three input metrics and two guardrails.',
          'For each, write how it could be gamed or misread.',
          'Define in advance what result would make you roll back or rethink.',
        ],
        deliverable: 'A one-page measurement plan attached to your design spec.',
      },
      challenge: {
        task: 'Review your team\'s current top-line metric and propose an improvement if it is misaligned.',
        successCriteria: [
          'You identified at least one way the current metric can rise while users fare worse.',
          'Your proposal includes guardrails and a qualitative signal.',
          'You discussed it with the metric\'s owner and recorded their response.',
        ],
      },
    },
    {
      id: 'e1-prioritisation-limits',
      title: 'Prioritisation frameworks and their limits',
      summary: 'Use RICE, Kano and friends as thinking tools — and recognise when they create false precision.',
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Frameworks such as RICE (Reach, Impact, Confidence, Effort), MoSCoW, Kano and cost-of-delay each help with part of the problem. None of them makes the decision for you, and all of them can be used to launder a decision already made.\n\nThe senior skill is knowing which framework fits the question — and noticing when a spreadsheet score is standing in for judgement.',
        },
        {
          type: 'list',
          items: [
            '**RICE:** good for comparing many similar-sized items; weak when "Impact" and "Confidence" are guesses dressed as numbers.',
            '**Kano:** good for understanding which features are basic expectations vs delighters; says little about sequencing.',
            '**Cost of delay:** good when timing matters (regulation, seasonality); requires honest reasoning about urgency.',
            '**MoSCoW:** useful for scoping a fixed release; tends to inflate "Must".',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'False precision',
          body: 'A score of 42.7 vs 39.1 implies a certainty nobody has. When inputs are estimates, treat differences within a wide band as ties and decide those on strategy, sequencing or learning value instead.',
        },
        {
          type: 'quiz',
          question: 'Your RICE scores put a small UI polish item above a strategic bet. What is the most senior response?',
          options: [
            'Follow the scores — that is why we use a framework.',
            'Adjust the numbers until the strategic bet wins.',
            'Name that RICE undervalues learning and strategic fit here, and decide the bet explicitly on those grounds.',
            'Abandon prioritisation frameworks altogether.',
          ],
          answer: 2,
          explanation: 'Frameworks encode assumptions. Stating openly why you are overriding one keeps the decision honest and auditable, rather than gaming inputs or hiding behind the score.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'When the framework was the wrong question',
          body: 'A banking app team spent weeks RICE-scoring forty backlog items. The design lead pointed out that half the items served a segment the strategy had deprioritised. Filtering by strategy first cut the list to twelve; scoring then took an afternoon.',
        },
      ],
      practice: {
        task: 'Audit how your team currently prioritises.',
        steps: [
          'Pick the last three prioritisation decisions your team made.',
          'For each, write the stated reason and the real reason (as best you can tell).',
          'Identify which framework, if any, would have fitted the question better.',
          'Draft a short guide: which method for which kind of decision.',
        ],
        deliverable: 'A half-page prioritisation guide for your team.',
      },
      challenge: {
        task: 'Facilitate the next prioritisation session using a strategy filter before any scoring.',
        successCriteria: [
          'Items were filtered against strategy before being scored.',
          'Near-ties were resolved with an explicit, written rationale.',
          'At least one participant said the process was clearer than before.',
        ],
      },
    },
    {
      id: 'e1-experimentation',
      title: 'Experimentation beyond the A/B test',
      summary: 'Choose the right test for the risk, avoid common analysis traps, and know when not to test at all.',
      minutes: 18,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'A/B tests are excellent at answering narrow questions with enough traffic. They are poor at telling you whether you are building the right thing, and they cannot rescue a vague hypothesis.\n\nMatch the method to the riskiest assumption: desirability (will anyone want this?), usability (can they use it?), feasibility (can we build it?) and viability (does it work for the business?).',
        },
        {
          type: 'list',
          items: [
            '**Fake-door / painted-door tests:** measure intent cheaply — but be honest with users who click.',
            '**Concierge or Wizard-of-Oz:** deliver the value manually before building automation.',
            '**Prototype tests:** usability and comprehension, with small samples.',
            '**Controlled experiments:** measure causal impact on behaviour at scale.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Traps that fool experienced teams',
          body: 'Peeking at results and stopping early when they look good; testing many variants and reporting the winner without correction; novelty effects that fade; and running tests too small to detect the effect you care about. Partner with a data scientist on design and analysis — it is a craft of its own.',
        },
        {
          type: 'doDont',
          do: [
            'Write the hypothesis and decision rule before launching.',
            'Decide what you will do if the result is flat.',
          ],
          dont: [
            'A/B test ethical questions or accessibility fixes — just do the right thing.',
            'Test when traffic is too low to learn anything in a reasonable time.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A better hypothesis',
          body: 'A checkout team wanted to "test a new checkout". The designer reframed it into a falsifiable hypothesis with a decision rule, which also revealed the test needed four weeks of traffic, not one.',
          before: '"Let\'s A/B test the new checkout and see if it does better."',
          after: '"We believe showing delivery cost on the basket page will reduce abandonment at payment for first-time buyers. We will ship if completion rises without an increase in support contacts."',
        },
      ],
      practice: {
        task: 'Design an experiment plan for your riskiest current assumption.',
        steps: [
          'Classify the assumption: desirability, usability, feasibility or viability.',
          'Choose the cheapest method that could genuinely falsify it.',
          'Write the hypothesis, metric and decision rule.',
          'Review the plan with an engineer or data partner for flaws.',
        ],
        deliverable: 'A one-page experiment brief with hypothesis and decision rule.',
      },
      challenge: {
        task: 'Run the experiment and write up the result — including if it was inconclusive.',
        successCriteria: [
          'The decision rule was set before results were seen.',
          'The write-up states what the team will do next and why.',
          'Limitations of the method are named honestly.',
        ],
      },
    },
    {
      id: 'e1-decisions-under-uncertainty',
      title: 'Decision making under uncertainty',
      summary: 'Judge decisions by their process, not their outcome, and match speed to reversibility.',
      minutes: 16,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Good decisions sometimes lead to bad outcomes, and bad decisions sometimes get lucky. Annie Duke calls judging a decision purely by its result "resulting". Senior designers improve decision *quality*: the information gathered, the options considered, and the reasoning recorded.\n\nA second useful lens is reversibility. Amazon describes "two-way door" decisions (cheap to undo) and "one-way door" decisions (costly to reverse). Most interface decisions are two-way doors and should be made quickly; data models, pricing and brand promises often are not.',
        },
        {
          type: 'checklist',
          title: 'A lightweight decision record',
          items: [
            'The decision and who made it',
            'Options considered, including "do nothing"',
            'Key assumptions and the evidence for each',
            'What would make us revisit this decision',
            'Is this a one-way or two-way door?',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why write it down',
          body: 'Decision records protect teams from hindsight bias, let new joiners understand why things are the way they are, and make it safe to change course when the revisit trigger fires — because the change was anticipated rather than an admission of failure.',
        },
        {
          type: 'doDont',
          do: [
            'Disagree and commit once a decision is made with good process.',
            'Timebox research to the cost of being wrong.',
          ],
          dont: [
            'Seek certainty on two-way-door decisions.',
            'Rewrite history in retrospectives based on the outcome alone.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Speeding up by classifying doors',
          body: 'A design team spent three weeks debating navigation labels for an internal tool. The lead reframed: labels are a two-way door — ship the best candidate behind a flag and review usage after two weeks. The same team then slowed down on a permissions data model, a genuine one-way door, and involved engineering architects early.',
        },
      ],
      practice: {
        task: 'Write decision records for two decisions your team faces now.',
        steps: [
          'Choose one likely two-way door and one likely one-way door.',
          'Fill in the decision record checklist for each.',
          'Set a revisit trigger — a date or a signal.',
          'Share them in your team\'s usual channel for comment.',
        ],
        deliverable: 'Two short decision records in your team\'s documentation space.',
      },
      challenge: {
        task: 'Introduce decision records as a team habit for a month.',
        successCriteria: [
          'At least four decisions were recorded by people other than you.',
          'At least one decision was revisited because its trigger fired.',
          'The team agreed whether to continue the habit, based on a short retro.',
        ],
      },
    },
  ],
}

// ---------------------------------------------------------------------------
// Module 2 — Advanced UX
// ---------------------------------------------------------------------------

const moduleAdvancedUx: Module = {
  id: 'e-m2-advanced-ux',
  title: 'Advanced UX',
  stage: 'Advanced UX',
  summary: 'Tackle the hard problems: enterprise workflows, multiple roles, permissions, scale, ethics and whole services.',
  outcome: 'You will be able to design coherent experiences for complex, multi-actor systems and set research strategy for them.',
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'e2-enterprise-workflows',
      title: 'Designing complex enterprise workflows',
      summary: 'Design for expert users, long-running tasks and messy real processes rather than idealised happy paths.',
      minutes: 20,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Enterprise workflows differ from consumer flows in ways that invalidate many default instincts. Users are often experts who repeat the same task hundreds of times a week; tasks span days and multiple people; and the "real" process includes workarounds, spreadsheets and exceptions that never appear in the requirements.\n\nDesigning well here starts with mapping the work as it is actually done — including the bits outside your product.',
        },
        {
          type: 'list',
          items: [
            '**Efficiency over discoverability** for frequent tasks: keyboard shortcuts, bulk actions, dense tables, saved views.',
            '**Resumability:** drafts, clear status, and "where was I?" cues for work that spans sessions.',
            '**Exceptions are the job:** the 5% of cases that break the flow often consume most of users\' time.',
            '**Handoffs:** make ownership and next action explicit whenever work moves between people.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'The buyer is not the user',
          body: 'Enterprise software is bought by people who rarely use it daily. Demos reward visual polish and feature breadth; daily users need speed and reliability. Senior designers must represent both without letting the demo win by default.',
        },
        {
          type: 'doDont',
          do: [
            'Shadow users doing real work, including their spreadsheets and email.',
            'Design the exception and error paths first-class, not as afterthoughts.',
            'Offer progressive density: simple defaults, power features close at hand.',
          ],
          dont: [
            'Simplify away information experts rely on to make judgements.',
            'Force wizards on users who do the task fifty times a day.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Invoice approvals in a finance platform',
          body: 'The spec described a linear approve/reject flow. Shadowing revealed approvers spent most of their time chasing missing purchase orders by email. The redesign added a "needs information" state with a request routed to the submitter and an audit trail — the flow became non-linear, and the queue stopped stalling.',
          before: 'States: Submitted → Approved / Rejected.',
          after: 'States: Submitted → Needs information ↔ Resubmitted → Approved / Rejected, with owner and due date shown on every item.',
        },
      ],
      practice: {
        task: 'Map one enterprise workflow as it is actually performed.',
        steps: [
          'Observe or interview two users performing the workflow end to end.',
          'Map every step, including tools outside your product.',
          'Mark handoffs, waiting states and exceptions.',
          'Identify the top three sources of delay or rework.',
        ],
        deliverable: 'A swimlane map of the as-is workflow with pain points annotated.',
      },
      challenge: {
        task: 'Propose a to-be workflow that removes the biggest source of rework.',
        successCriteria: [
          'Exceptions and error states are designed, not just listed.',
          'Ownership is explicit at every handoff.',
          'Power-user efficiency is preserved or improved.',
          'A user who does the task daily reviewed the proposal.',
        ],
      },
    },
    {
      id: 'e2-multi-role-products',
      title: 'Designing multi-role products',
      summary: 'Serve several user types in one product without building several confusing products stuck together.',
      minutes: 17,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Marketplaces, healthcare systems, HR platforms and learning tools all serve several roles: buyer and seller, clinician and patient, manager and employee, teacher and student. Each role has different goals, vocabulary and frequency of use.\n\nThe core decision is how much the experience should diverge per role. Too little, and every role wades through irrelevant features. Too much, and you maintain several products, break shared mental models, and make role-switching painful.',
        },
        {
          type: 'list',
          items: [
            '**Shared core, role lenses:** one object model (e.g. an order) seen through role-specific views.',
            '**Separate surfaces:** distinct apps when contexts differ sharply (a courier app vs a restaurant dashboard).',
            '**Role switching:** many people hold multiple roles; make the current context unmistakable.',
            '**Cross-role visibility:** show each role enough of the other\'s state to coordinate ("the seller has shipped").',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Start with the object model',
          body: 'Before designing screens, list the core objects and, for each role, what they can see, do and care about. Divergence in screens should follow real divergence in that matrix, not org-chart boundaries between teams.',
        },
        {
          type: 'quiz',
          question: 'A user is both a team manager and an individual contributor in an HR tool. What matters most?',
          options: [
            'Hide manager features until they log in again.',
            'Make it unambiguous which hat they are wearing and let them switch easily.',
            'Merge both roles\' navigation into one long menu.',
            'Force them to create two accounts.',
          ],
          answer: 1,
          explanation: 'Dual-role users are common. Clear context and easy switching prevent mistakes such as approving your own request or missing your team\'s tasks.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Food delivery: three roles, one order',
          body: 'Customer, restaurant and courier all interact with the same order. Designing the order\'s status model once, then deciding what each role sees at each state, prevented contradictions like the customer seeing "on its way" while the restaurant still showed "preparing".',
        },
      ],
      practice: {
        task: 'Build a role–object matrix for a multi-role product you know.',
        steps: [
          'List every role, including admin and support roles.',
          'List the core objects.',
          'For each cell, note see / do / care about.',
          'Highlight where roles need visibility into each other\'s actions.',
        ],
        deliverable: 'A role–object matrix with coordination points highlighted.',
      },
      challenge: {
        task: 'Use the matrix to propose where the product should share UI and where it should diverge.',
        successCriteria: [
          'Each divergence is justified by the matrix, not by team structure.',
          'Role switching is addressed for multi-role users.',
          'At least one cross-role inconsistency in the current product is identified.',
        ],
      },
    },
    {
      id: 'e2-permission-systems',
      title: 'Designing permission systems',
      summary: 'Make access control understandable, safe and administrable — one of the hardest problems in B2B design.',
      minutes: 20,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Permissions sit where security, data architecture and UX collide. Mistakes are costly in both directions: too restrictive, and people cannot work and invent risky workarounds; too loose, and data leaks.\n\nDesigners should be in the room when the permission *model* is chosen — role-based (RBAC), attribute-based, resource-level sharing, or a hybrid — because the model determines what the interface can ever explain.',
        },
        {
          type: 'list',
          items: [
            '**Explain the effect, not the rule:** "Priya can edit this project and invite others" beats a grid of checkboxes.',
            '**Show why access is denied** and how to request it — dead ends create support tickets.',
            '**Make inheritance visible:** where does this permission come from (workspace, team, direct share)?',
            '**Preview as another user** so admins can verify what someone will actually see.',
            '**Audit trail:** who changed access, when.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Custom roles are a trap and a necessity',
          body: 'Large customers will ask for fully custom roles. They offer flexibility but create combinations nobody can reason about. Sensible predefined roles plus a small number of well-explained overrides often serve most organisations better — validate with real admins before committing.',
        },
        {
          type: 'doDont',
          do: [
            'Default to least privilege for new members, with an easy way to grant more.',
            'Use plain-language role names with a one-line description.',
          ],
          dont: [
            'Silently hide features without telling users they exist behind a permission.',
            'Let the UI and the backend permission model drift apart.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'From checkbox grid to explained roles',
          body: 'A project tool exposed forty permission checkboxes per user. Admins over-granted to avoid complaints. The redesign introduced four named roles with descriptions, showed inherited access with its source, and added "view as" for admins.',
          before: 'Access denied.',
          after: 'You can view this project but not edit it. Access comes from the Marketing team. [Request edit access from Alex]',
        },
      ],
      practice: {
        task: 'Audit the permission experience in a product you work on or use.',
        steps: [
          'List the permission model type and every role or setting.',
          'Try three tasks as a restricted user and note every dead end.',
          'Check whether inheritance and access sources are visible.',
          'Interview or survey one admin about their biggest access headache.',
        ],
        deliverable: 'A permission UX audit with prioritised issues.',
      },
      challenge: {
        task: 'Design the access-denied, request-access and admin-review flow end to end.',
        successCriteria: [
          'Denied states explain why and offer a next step.',
          'Admins can see where access comes from before changing it.',
          'The flow was checked with an engineer against the real permission model.',
        ],
      },
    },
    {
      id: 'e2-ia-at-scale',
      title: 'Information architecture at scale',
      summary: 'Keep large products navigable as teams, features and content multiply faster than anyone can govern.',
      minutes: 18,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'At scale, information architecture problems are rarely caused by bad initial design. They come from growth: every team adds its feature to the navigation, naming drifts, and the structure starts to mirror the org chart (Conway\'s law) rather than users\' mental models.\n\nFixing IA at scale is therefore as much about **governance** as structure.',
        },
        {
          type: 'list',
          items: [
            '**Model the domain:** agree on core objects and their relationships before arranging navigation.',
            '**Controlled vocabulary:** one name per concept, owned and documented.',
            '**Navigation rules:** criteria for what earns a top-level slot.',
            '**Multiple access paths:** navigation, search, and contextual links — no single path carries everything.',
            '**Validate with card sorting and tree testing** before and after restructuring.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why the org chart leaks into IA',
          body: 'Teams own areas and want visibility for their work. Without explicit criteria, navigation becomes a negotiation between teams. A published set of rules turns those negotiations into principled decisions.',
        },
        {
          type: 'doDont',
          do: [
            'Tree-test proposed structures with real tasks before shipping.',
            'Plan migrations: redirects, "moved" hints, and communications for power users.',
          ],
          dont: [
            'Rename widely used concepts without measuring the cost to existing users.',
            'Add a top-level item because a team asked loudly.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A SaaS admin area with three names for one thing',
          body: 'A platform used "workspace", "organisation" and "account" interchangeably, because three teams built settings independently. A design lead ran a vocabulary audit, got agreement on definitions, and introduced a rule: new top-level navigation items need a design-review sign-off against written criteria.',
          before: 'Settings → Account → Workspace settings → Organisation billing',
          after: 'Settings → Organisation (billing, members) · Workspace (projects, integrations)',
        },
      ],
      practice: {
        task: 'Run an IA health check on a large product.',
        steps: [
          'Inventory top-level and second-level navigation.',
          'List every term used for the same concept.',
          'Map which team owns each area and note org-chart mirroring.',
          'Write three rules that would have prevented the worst problems.',
        ],
        deliverable: 'An IA health report with a vocabulary list and proposed navigation rules.',
      },
      challenge: {
        task: 'Tree-test the current and a proposed structure with at least five tasks.',
        successCriteria: [
          'Tasks are based on real user goals, not navigation labels.',
          'Results are compared per task, not only overall.',
          'A migration plan for existing users is included.',
        ],
      },
    },
    {
      id: 'e2-behavioural-patterns',
      title: 'Behavioural patterns: ethical use and dark patterns to avoid',
      summary: 'Apply behavioural insight responsibly and hold the line when pressure pushes towards manipulation.',
      minutes: 18,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Defaults, social proof, friction, framing and commitment all change behaviour. That power is neutral; its use is not. The test is simple to state and hard to apply: *does this help people do what they would want to do on reflection, or does it exploit a bias to act against their interests?*\n\nSenior designers are often the last line of defence, because the request usually arrives framed as a growth experiment.',
        },
        {
          type: 'doDont',
          do: [
            'Use defaults that protect users (privacy-preserving, sensible notification levels).',
            'Add friction to risky, irreversible actions (deleting data, sending money).',
            'Make cancellation as easy as sign-up.',
          ],
          dont: [
            'Confirmshaming ("No thanks, I don\'t like saving money").',
            'Pre-ticked consent or hidden opt-outs.',
            'Fake urgency or scarcity ("Only 2 left!" when untrue).',
            'Roach motels — easy in, deliberately hard out.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'This is also a legal matter',
          body: 'Regulators in the UK, EU and US have increasingly targeted manipulative design, particularly around consent, subscriptions and cancellation. Involve legal early — but do not wait for a law to tell you something is wrong.',
        },
        {
          type: 'text',
          body: 'When pushed, argue on multiple fronts: user harm, trust and brand risk, regulatory exposure, and the long-term metrics (refunds, chargebacks, churn, support load) that short-term conversion hides. Offer an ethical alternative that addresses the underlying goal.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Retention without a roach motel',
          body: 'A subscription app wanted a five-step cancellation flow. The designer proposed a one-page flow with a genuine pause option and a reason picker, plus a guardrail on refund requests. The team got useful churn reasons and a legitimate save path without trapping anyone.',
          before: 'Cancel → Are you sure? → Special offer → Call us to cancel.',
          after: 'Cancel → Optional reason + "Pause for 1–3 months instead" → Cancelled, with confirmation email.',
        },
      ],
      practice: {
        task: 'Audit a flow in your product for manipulative patterns.',
        steps: [
          'Choose a flow with commercial pressure: sign-up, upgrade, consent or cancellation.',
          'Walk through it and note every nudge, default and friction point.',
          'Classify each as helpful, neutral or manipulative, with reasoning.',
          'Propose alternatives for anything manipulative.',
        ],
        deliverable: 'An annotated flow audit with ethical alternatives.',
      },
      challenge: {
        task: 'Draft a short set of team principles for persuasive design.',
        successCriteria: [
          'Principles are specific enough to settle a real disagreement.',
          'They reference long-term metrics as well as ethics.',
          'At least one PM and one engineer reviewed them.',
        ],
      },
    },
    {
      id: 'e2-research-strategy',
      title: 'Research strategy',
      summary: 'Decide what to learn, when and how across a product area — not just how to run a single study.',
      minutes: 17,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Running good studies is an intermediate skill. Deciding which questions matter most, sequencing research against decisions, and building durable knowledge across teams is a senior one.\n\nA research strategy links the organisation\'s biggest decisions to the evidence needed for them, and balances generative work (what problems exist?) with evaluative work (does this solution work?).',
        },
        {
          type: 'list',
          items: [
            '**Start from decisions:** what will leadership decide in the next two quarters, and what would change their mind?',
            '**Mix methods:** triangulate qualitative insight with analytics, support data and market signals.',
            '**Right-size rigour:** a two-way-door decision does not need a six-week study.',
            '**Build a knowledge base:** atomic, searchable insights beat reports nobody rereads.',
            '**Democratise carefully:** enable others to run evaluative research, with templates and review.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Research debt',
          body: 'Like tech debt, research debt accumulates when teams build on untested assumptions. Keep a visible list of foundational assumptions nobody has validated — it is a powerful prioritisation tool.',
        },
        {
          type: 'doDont',
          do: [
            'Publish a research roadmap alongside the product roadmap.',
            'Share raw evidence (clips, quotes) not just conclusions.',
          ],
          dont: [
            'Only do research that is easy to recruit for.',
            'Let every team rediscover the same insights independently.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A research plan tied to decisions',
          body: 'A fintech\'s leadership planned to decide whether to enter small-business lending. The design lead scheduled generative interviews with business owners before that decision, not usability tests after it — and flagged that the existing panel skewed towards consumer customers, so recruitment had to change.',
        },
      ],
      practice: {
        task: 'Draft a two-quarter research strategy for your product area.',
        steps: [
          'List the five biggest upcoming decisions.',
          'For each, write the key unknown and the evidence that would resolve it.',
          'Choose methods and timing so evidence arrives before decisions.',
          'List known research debt.',
        ],
        deliverable: 'A one-page research roadmap aligned to decisions.',
      },
      challenge: {
        task: 'Present the roadmap to your PM and design manager and secure time for the top item.',
        successCriteria: [
          'Each study maps to a named decision and date.',
          'At least one generative study is included.',
          'The top item has agreed time and recruiting in place.',
        ],
      },
    },
    {
      id: 'e2-service-design',
      title: 'Service design',
      summary: 'Design the whole service — front stage, back stage and support processes — not only the screens.',
      minutes: 18,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Many digital experiences fail for reasons invisible in the interface: a refund that requires a manual process, a support team without context, a courier with no way to report a problem. Service design treats all of these as part of what the customer experiences.\n\nThe core tool is the **service blueprint**: customer actions, front-stage interactions, back-stage actions, and support processes, separated by lines of interaction and visibility.',
        },
        {
          type: 'list',
          items: [
            '**Customer actions:** what the person does, across channels.',
            '**Front stage:** what they see — app, email, a staff member.',
            '**Back stage:** what staff and systems do that the customer does not see.',
            '**Support processes:** the systems and policies that enable it all.',
            '**Evidence and fail points:** where things break or trust is lost.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why seniors need this lens',
          body: 'The highest-leverage fixes are often back stage: a policy change or an internal tool can do more than any UI polish. Service design gives you a credible way to influence teams outside product, like operations and support.',
        },
        {
          type: 'doDont',
          do: [
            'Blueprint with staff who deliver the service, not just about them.',
            'Include offline and human channels.',
          ],
          dont: [
            'Treat the blueprint as a one-off workshop artefact.',
            'Assume a UI change can compensate for a broken back-stage process.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Bank account opening',
          body: 'Drop-off was blamed on a long form. Blueprinting revealed that applications flagged for manual identity review waited days with no communication, and staff lacked a tool to request documents. The fix combined proactive status emails with an internal document-request tool — back-stage work the form redesign would never have reached.',
        },
      ],
      practice: {
        task: 'Create a service blueprint for one end-to-end journey.',
        steps: [
          'Pick a journey with at least one human touchpoint (support, delivery, review).',
          'Interview one person who works back stage.',
          'Map all five layers and mark fail points.',
          'Identify one back-stage change that would improve the front-stage experience.',
        ],
        deliverable: 'A service blueprint with fail points and a back-stage recommendation.',
      },
      challenge: {
        task: 'Pitch the back-stage change to the team that owns it.',
        successCriteria: [
          'The pitch uses evidence from the blueprint and staff interviews.',
          'Cost and effort for the owning team are acknowledged.',
          'You agreed a next step or a clear reason why not.',
        ],
      },
    },
  ],
}

// ---------------------------------------------------------------------------
// Module 3 — Design Systems at Scale
// ---------------------------------------------------------------------------

const moduleDesignSystems: Module = {
  id: 'e-m3-design-systems',
  title: 'Design Systems at Scale',
  stage: 'Systems',
  summary: 'Run a design system as a product: architecture, governance, contribution, adoption, versioning and measurement.',
  outcome: 'You will be able to lead or shape an enterprise design system that teams choose to use rather than tolerate.',
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'e3-enterprise-design-systems',
      title: 'Enterprise design systems: a product, not a library',
      summary: 'Treat the system as an internal product with users, a roadmap and a service model — or watch it decay.',
      minutes: 16,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'A component library is an artefact. A design system is a product whose users are designers and engineers, and whose value is measured in how much faster and more consistently they ship.\n\nMost systems fail not because the components are bad but because the operating model is missing: nobody owns the roadmap, support is ad hoc, and product teams quietly fork components to meet deadlines.',
        },
        {
          type: 'list',
          items: [
            '**Team model:** centralised (a dedicated team), federated (contributors across teams) or hybrid. Each has costs — centralised teams become bottlenecks; federated ones struggle with coherence.',
            '**Scope:** foundations, components, patterns, content guidelines, and accessibility — decide explicitly what is in and out.',
            '**Service model:** office hours, a support channel, response expectations and a public roadmap.',
            '**Multi-brand / multi-platform:** decide early whether themes, platforms or products share a core.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why the product framing matters',
          body: 'Framing the system as a product gives you tools you already know: user research with its consumers, prioritisation against their needs, and outcome metrics. It also makes funding conversations easier because leaders understand products.',
        },
        {
          type: 'doDont',
          do: [
            'Interview consuming teams about friction before building more components.',
            'Publish what the system will not cover.',
          ],
          dont: [
            'Build components speculatively before a real product needs them.',
            'Measure success by component count.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'From library to product',
          body: 'A retailer\'s system had 90 components and low adoption. The new lead interviewed eight product teams and found the blocker was not missing components but unclear guidance and slow responses to bugs. The first quarter\'s roadmap focused on a support rotation, usage docs and fixing the ten most-used components.',
        },
      ],
      practice: {
        task: 'Write a one-page product brief for your design system.',
        steps: [
          'Name the system\'s users and their top three jobs.',
          'Describe the team model and its known weaknesses.',
          'Define scope — in and out.',
          'State two outcome metrics that are not component counts.',
        ],
        deliverable: 'A design-system product brief.',
      },
      challenge: {
        task: 'Run five short interviews with consuming designers and engineers and revise the brief.',
        successCriteria: [
          'Engineers and designers are both represented.',
          'At least one priority changed based on interviews.',
          'The revised brief was shared with system stakeholders.',
        ],
      },
    },
    {
      id: 'e3-token-architecture',
      title: 'Design token architecture',
      summary: 'Structure tokens in tiers so themes, brands and modes scale without rewriting every component.',
      minutes: 20,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Design tokens store design decisions — colour, spacing, type, radius, motion — as named values shared across design tools and code. In Figma these are typically represented with Variables and modes; in code they feed CSS custom properties or platform equivalents.\n\nThe architectural question is how many layers of indirection you need. The common pattern has three tiers.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Primitive (global) tokens:** raw values with no meaning — `blue-600`, `space-4`.',
            '**Semantic (alias) tokens:** intent — `color-text-primary`, `color-bg-danger`. Themes and dark mode swap values here.',
            '**Component tokens (optional):** `button-primary-bg`. Useful for fine-grained theming, costly to maintain.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Over-engineering is the common failure',
          body: 'Component-level tokens for every property can produce thousands of tokens nobody understands. Add a tier only when a real theming need requires it. Naming is the hardest part — agree a naming grammar (category–property–variant–state) before you scale.',
        },
        {
          type: 'doDont',
          do: [
            'Have components consume semantic tokens, never primitives directly.',
            'Automate the pipeline from source of truth to platforms.',
            'Document each semantic token\'s intended use.',
          ],
          dont: [
            'Name semantic tokens after their value (`color-blue-button`).',
            'Let design and code token sets drift apart.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Adding dark mode without touching components',
          body: 'Because a SaaS product\'s components used semantic tokens, dark mode was implemented by adding a second mode to the semantic layer. The one area that broke was a chart library that referenced primitives directly — a useful lesson that was then enforced with linting.',
          before: 'Card background: #FFFFFF (hard-coded)',
          after: 'Card background: color-surface-raised → light: neutral-0 / dark: neutral-900',
        },
      ],
      practice: {
        task: 'Audit and redesign a token structure.',
        steps: [
          'Export or list your current tokens (or colours and spacing if no tokens exist).',
          'Classify each as primitive, semantic or component.',
          'Find components referencing primitives directly.',
          'Propose a naming grammar and a two- or three-tier structure.',
        ],
        deliverable: 'A token architecture proposal with naming grammar and migration notes.',
      },
      challenge: {
        task: 'Prove the architecture by adding a second theme or mode to a small set of components.',
        successCriteria: [
          'No component definitions were changed to support the new mode.',
          'Semantic tokens pass contrast checks in both modes.',
          'An engineer validated the pipeline to code.',
        ],
      },
    },
    {
      id: 'e3-governance',
      title: 'Design system governance',
      summary: 'Decide who decides — and make that process fast enough that teams do not route around it.',
      minutes: 17,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Governance answers: who can change the system, how decisions are made, and what happens when a product team needs something the system does not have. Too little governance, and the system fragments. Too much, and teams detach because waiting is more expensive than forking.\n\nGood governance is designed like any flow: clear entry points, predictable timing and visible status.',
        },
        {
          type: 'list',
          items: [
            '**Decision rights:** who approves new components, breaking changes and new tokens.',
            '**Intake:** a single place to request, report and propose.',
            '**Triage criteria:** is this a bug, a one-off, a pattern for the system, or an intentional exception?',
            '**Exception path:** a sanctioned way to diverge temporarily, with a record and a review date.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Make the exception path legitimate',
          body: 'Teams will diverge under deadline pressure regardless. A documented exception — "we are detaching this card for launch; review in six weeks" — gives you visibility and a chance to learn. Unmanaged forks give you neither.',
        },
        {
          type: 'quiz',
          question: 'A product team needs a variant the system lacks, and launches in a week. What is the healthiest response?',
          options: [
            'Block the launch until the system team builds it.',
            'Let them build it locally with a logged exception and review whether it belongs in the system after launch.',
            'Tell them to use the closest existing component even if it does not fit.',
            'Add the variant to the system immediately without review.',
          ],
          answer: 1,
          explanation: 'Blocking pushes teams away; unreviewed additions erode quality. A logged exception keeps delivery moving and feeds evidence into the system\'s roadmap.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Fixing a two-month queue',
          body: 'An insurer\'s design council met monthly, so proposals waited up to eight weeks. The system lead replaced it with async review in a shared doc, a 5-working-day response expectation for triage, and a monthly session only for breaking changes.',
        },
      ],
      practice: {
        task: 'Map your current (formal or informal) governance process.',
        steps: [
          'Trace what happened to the last three requests to the system.',
          'Note decision-makers and time taken at each step.',
          'Identify where teams bypassed the process and why.',
          'Draft decision rights and triage criteria.',
        ],
        deliverable: 'A governance map with proposed decision rights and an exception path.',
      },
      challenge: {
        task: 'Pilot the exception path with one product team for a release cycle.',
        successCriteria: [
          'Exceptions were logged with a review date.',
          'At least one exception was reviewed and resolved (adopted, merged or retired).',
          'The product team rated the process as workable.',
        ],
      },
    },
    {
      id: 'e3-contribution-models',
      title: 'Contribution models',
      summary: 'Let product teams contribute to the system without lowering quality or overloading the core team.',
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Contribution spreads the load and builds ownership, but only if the process is lighter than building locally. Most contribution programmes fail because contributing is harder than forking, and nobody is rewarded for doing it.\n\nThink of contribution in sizes: fixes, small enhancements, new variants, and new components or patterns. Each needs a different level of process.',
        },
        {
          type: 'list',
          items: [
            '**Fixes and docs:** open to anyone, reviewed quickly.',
            '**Enhancements and variants:** proposal plus pairing with a system maintainer.',
            '**New components:** evidence of need across multiple products, design and code review, accessibility review, documentation.',
            '**Recognition:** contributions visible in release notes and in performance conversations.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why recognition is structural',
          body: 'Product teams are measured on product outcomes. Unless managers treat system contributions as valued work, contributing will always lose to shipping. Negotiating that recognition with design and engineering leadership is part of the system lead\'s job.',
        },
        {
          type: 'doDont',
          do: [
            'Provide a contribution checklist and definition of done.',
            'Pair new contributors with a maintainer.',
          ],
          dont: [
            'Require a committee for a typo fix.',
            'Accept one-product components into the core without evidence of wider need.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A date-range picker contributed by a product team',
          body: 'A reporting team built a date-range picker. Instead of rejecting it as non-standard, the system team paired with them to generalise it, add keyboard support and document it. Two other teams adopted it within a quarter, and the contributing designer presented it at the design all-hands.',
        },
      ],
      practice: {
        task: 'Design a tiered contribution process.',
        steps: [
          'Define contribution sizes for your system.',
          'Write the process and definition of done for each size.',
          'Estimate how long each path would take end to end.',
          'Compare that time with building locally.',
        ],
        deliverable: 'A contribution guide with tiered processes and a definition of done.',
      },
      challenge: {
        task: 'Shepherd one real contribution from a product team through your process.',
        successCriteria: [
          'The contribution met the definition of done including accessibility.',
          'The contributor was credited publicly.',
          'You recorded friction points and updated the guide.',
        ],
      },
    },
    {
      id: 'e3-driving-adoption',
      title: 'Driving design system adoption',
      summary: 'Adoption is earned through usefulness, migration support and relationships — not mandates.',
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Mandates can create compliance, but they rarely create adoption. Teams adopt a system when it makes their work faster, when migration is cheap, and when they trust it will be maintained.\n\nTreat adoption like a go-to-market plan: segment your consuming teams, understand their barriers, and target the teams whose adoption influences others.',
        },
        {
          type: 'list',
          items: [
            '**Reduce switching cost:** codemods, migration guides and paired migration sessions.',
            '**Win early adopters:** a visible success with a respected team persuades more than any memo.',
            '**Embed:** a system designer or engineer temporarily joining a product team.',
            '**Remove blockers:** the missing component, the performance bug, the framework version mismatch.',
            '**Timing:** align migrations with redesigns or rewrites teams already plan.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Adoption is not the same as coverage',
          body: 'A team can import the system and still override most of its styles. Look at how components are used, not just whether they are imported.',
        },
        {
          type: 'doDont',
          do: [
            'Ask non-adopting teams what would change their mind.',
            'Celebrate migrations publicly with the team\'s own words.',
          ],
          dont: [
            'Shame teams for low adoption in leadership reviews.',
            'Launch breaking changes during a team\'s critical delivery period.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Adoption through embedding',
          body: 'A mobile team refused to adopt the system because its components lacked the performance they needed. The system team embedded an engineer for three sprints to fix list virtualisation. The mobile team adopted, and their lead became the system\'s strongest advocate in engineering forums.',
        },
      ],
      practice: {
        task: 'Build an adoption plan for your system.',
        steps: [
          'List consuming teams and their current adoption level.',
          'Interview two low-adoption teams about barriers.',
          'Identify one influential team to target first.',
          'Choose the interventions that address their specific barriers.',
        ],
        deliverable: 'A one-page adoption plan with target teams and interventions.',
      },
      challenge: {
        task: 'Execute the plan with the first target team.',
        successCriteria: [
          'The team\'s specific barrier was addressed.',
          'Usage was measured before and after, not just imports.',
          'The team shared their experience with others.',
        ],
      },
    },
    {
      id: 'e3-versioning-deprecation',
      title: 'Versioning and deprecation',
      summary: 'Change the system safely: semantic versioning, migration paths and humane deprecation.',
      minutes: 15,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'A system that never changes becomes obsolete; one that changes carelessly loses trust. Versioning communicates the risk of each change; deprecation retires things without stranding the teams that depend on them.\n\nMost code-side systems use semantic versioning: **major** for breaking changes, **minor** for new backwards-compatible features, **patch** for fixes. The design side needs an equivalent discipline — Figma library updates can break files just as surely as code.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Announce the deprecation with the reason and the replacement.',
            'Mark it in design and code (warnings, labels, docs banners).',
            'Provide a migration guide and, where possible, automation.',
            'Give a realistic timeline and track remaining usage.',
            'Remove only after usage is near zero or owners have agreed.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Batch breaking changes',
          body: 'Frequent small breaking changes exhaust teams. Batching them into planned major releases with clear notes lets teams schedule migration work like any other.',
        },
        {
          type: 'doDont',
          do: [
            'Keep a changelog written for humans, not just commit messages.',
            'Keep design and code versions in sync or clearly mapped.',
          ],
          dont: [
            'Change component behaviour in a patch release.',
            'Delete components without checking who still uses them.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Retiring a legacy modal',
          body: 'Two modal components coexisted for a year. The system team shipped a codemod, added console warnings, published usage per team monthly, and offered paired sessions. Removal happened in the next major release when usage had dropped to two internal tools, whose owners agreed a date.',
          before: 'Changelog: "Removed LegacyModal."',
          after: 'Changelog: "LegacyModal removed in v5. Replace with Dialog — see migration guide; codemod available. Contact #design-system for help."',
        },
      ],
      practice: {
        task: 'Write a deprecation plan for a component in your system (or a hypothetical one).',
        steps: [
          'State the reason and the replacement.',
          'List every place it is used, in design and code.',
          'Draft the announcement and changelog entry.',
          'Set milestones for warnings, migration support and removal.',
        ],
        deliverable: 'A deprecation plan with announcement copy and timeline.',
      },
      challenge: {
        task: 'Define a versioning policy covering both Figma libraries and code packages.',
        successCriteria: [
          'Each change type maps to a version level with examples.',
          'Design and code release cadence is aligned or mapped.',
          'The policy was reviewed by at least one consuming team.',
        ],
      },
    },
    {
      id: 'e3-system-metrics',
      title: 'Design system metrics',
      summary: 'Measure the system\'s real value honestly — beyond component counts and vanity adoption numbers.',
      minutes: 16,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Leaders fund what they can see. Design systems struggle because their value — time saved, consistency, accessibility — is diffuse. The temptation is to invent a headline number ("the system saves X hours per year"). Resist unless you have genuinely measured it; one discredited number can undermine the whole programme.\n\nBuild a small, honest set of signals instead.',
        },
        {
          type: 'list',
          items: [
            '**Adoption depth:** share of UI built from system components, and detach or override rates.',
            '**Health:** open bugs, time to triage, accessibility issues in system components.',
            '**Consumer satisfaction:** a short periodic survey of designers and engineers.',
            '**Outcome signals:** consistency defects found in QA, time to build common screens — measured, not estimated.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Correlation traps',
          body: 'Teams that adopt the system may already be better resourced or more mature. Be careful claiming the system caused faster delivery without comparing like with like.',
        },
        {
          type: 'doDont',
          do: [
            'Report trends over time rather than one-off figures.',
            'Pair numbers with stories from consuming teams.',
          ],
          dont: [
            'Publish time-saved estimates you cannot defend.',
            'Count components shipped as a success metric.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A quarterly system report',
          body: 'A system team replaced a slide claiming large annual savings with a one-page report: detach rate trend in Figma, component coverage in the three main products, median bug triage time, and quotes from a survey. Leadership found it more credible and approved a second engineer.',
        },
      ],
      practice: {
        task: 'Design a design-system scorecard.',
        steps: [
          'Choose four to six metrics across adoption, health, satisfaction and outcomes.',
          'For each, define the data source and how often it is collected.',
          'Note how each metric could mislead.',
          'Mock up a one-page report.',
        ],
        deliverable: 'A scorecard definition and a mock quarterly report.',
      },
      challenge: {
        task: 'Collect a real baseline for at least three metrics.',
        successCriteria: [
          'Numbers come from real data, not estimates.',
          'Limitations are stated on the report.',
          'The report was shared with a design or engineering leader.',
        ],
      },
    },
    {
      id: 'e3-cross-functional-collaboration',
      title: 'Cross-functional collaboration for systems',
      summary: 'Build the system with engineering, content, accessibility and brand as co-owners, not reviewers.',
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'A design system that lives only in Figma is a style guide. The value appears when design, code, content and accessibility agree — which requires those disciplines to shape decisions together.\n\nThe most common rift is between design and engineering: designers ship library updates engineers never implement, or engineers build components that diverge from design. Shared ownership closes it.',
        },
        {
          type: 'list',
          items: [
            '**Joint definition:** design and engineering spec components together, including API (props) and states.',
            '**Shared naming:** Figma properties and code props use the same names where possible.',
            '**Content design:** guidelines for labels, errors and empty states live in the system.',
            '**Accessibility:** built in and tested at component level, with guidance on correct composition.',
            '**Brand and marketing:** agree the boundary between product system and marketing expression.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'API design is design',
          body: 'How a component is configured — its props and variants — shapes how teams use it. Designing the Figma component properties and the code API together prevents drift and makes Dev Mode handoff far smoother.',
        },
        {
          type: 'doDont',
          do: [
            'Hold joint design–engineering reviews for new components.',
            'Treat engineers\' feedback on complexity as design input.',
          ],
          dont: [
            'Publish design updates without a matching code plan.',
            'Leave content and accessibility as a final review gate.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Aligning a button component',
          body: 'The Figma button had variants called "Primary / Secondary / Ghost", while code used `variant="solid | outline | text"`. Handoff errors were common. A joint session produced one naming scheme, applied to both, and a checklist for future components.',
          before: 'Figma: Type = Ghost · Code: variant="text"',
          after: 'Figma: Variant = tertiary · Code: variant="tertiary"',
        },
      ],
      practice: {
        task: 'Run a design–code alignment audit on five core components.',
        steps: [
          'Compare Figma properties with code props for each.',
          'List mismatches in naming, states and behaviour.',
          'Check content guidance and accessibility notes exist.',
          'Agree fixes with an engineer.',
        ],
        deliverable: 'An alignment audit with agreed fixes.',
      },
      challenge: {
        task: 'Co-design one new component with an engineer and a content designer from the start.',
        successCriteria: [
          'The API and Figma properties were defined together.',
          'Content and accessibility guidance ship with the component.',
          'All three disciplines signed off before release.',
        ],
      },
    },
  ],
}

// ---------------------------------------------------------------------------
// Module 4 — Leadership
// ---------------------------------------------------------------------------

const moduleLeadership: Module = {
  id: 'e-m4-leadership',
  title: 'Leadership',
  stage: 'Leadership',
  summary: 'Lead through critique, mentoring, reviews and relationships — with or without formal authority.',
  outcome: 'You will be able to raise the quality of a team\'s work and decisions through influence, facilitation and clear communication.',
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'e4-running-critique',
      title: 'Running design critique',
      summary: 'Facilitate critiques that improve the work and build a culture of candour instead of performance.',
      minutes: 16,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Critique is a structured conversation about whether a design meets its objectives. It is not a presentation, not approval, and not a vote on taste. When critiques go wrong it is usually a facilitation failure: unclear goals, the loudest voice dominating, or feedback that is really preference.\n\nAs a senior designer, you often set the tone. How you give and receive feedback teaches the room what is safe.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Frame:** the presenter states the problem, constraints, stage of work and the specific feedback they want.',
            '**Clarify:** questions to understand, not to judge.',
            '**Critique:** feedback tied to objectives — "given the goal of X, I think Y may hinder it because Z".',
            '**Close:** the presenter summarises what they heard and what they will do next.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Protect the presenter\'s agency',
          body: 'The presenter owns the design and decides what to act on. Critique informs; it does not assign. Making this explicit lowers defensiveness and raises honesty.',
        },
        {
          type: 'doDont',
          do: [
            'Ask quieter participants directly, or collect written feedback first.',
            'Name the stage — early concepts need different feedback than final polish.',
            'Model receiving feedback with curiosity when your own work is critiqued.',
          ],
          dont: [
            'Let a senior stakeholder\'s opinion end the discussion.',
            'Solve the problem for the presenter in the room.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Reframing preference into critique',
          body: 'In a critique of an onboarding flow, a participant said they disliked the illustrations. The facilitator asked how the illustrations related to the goal. The feedback became actionable.',
          before: '"I don\'t like the illustrations."',
          after: '"The goal is to get people to connect their bank quickly. The large illustrations push the connect button below the fold on smaller phones, which may slow that down."',
        },
      ],
      practice: {
        task: 'Facilitate one critique session using the frame–clarify–critique–close structure.',
        steps: [
          'Share a presenter template in advance (problem, constraints, stage, feedback wanted).',
          'Timebox each phase and state the rules at the start.',
          'Capture feedback in a shared doc as it happens.',
          'Ask the presenter to close with their next steps.',
        ],
        deliverable: 'Session notes plus a short reflection on what worked.',
      },
      challenge: {
        task: 'Run critiques for a month and gather anonymous feedback on psychological safety.',
        successCriteria: [
          'At least three different people presented.',
          'Quieter participants contributed in most sessions.',
          'Feedback shows participants find critiques useful, and you adjusted based on it.',
        ],
      },
    },
    {
      id: 'e4-mentoring',
      title: 'Mentoring designers',
      summary: 'Help others grow by diagnosing what they need — teaching, coaching or sponsorship — and not creating dependence.',
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Good mentoring starts with diagnosis. The same question — "how do I get better at stakeholder management?" — may need direct teaching for one designer, reflective coaching for another, and simply a chance to lead a meeting for a third.\n\nA helpful distinction: **teaching** transfers knowledge, **coaching** helps someone find their own answer, **sponsoring** uses your influence to create opportunities for them.',
        },
        {
          type: 'list',
          items: [
            '**Agree goals** — what does the mentee want to be able to do in six months?',
            '**Ask before advising** — "what have you tried? what options do you see?"',
            '**Give specific feedback** on observed behaviour, not personality.',
            '**Create stretch** — assign or advocate for work slightly beyond their current level.',
            '**Close the loop** — revisit goals and celebrate progress.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'The rescue reflex',
          body: 'Experienced designers often fix the mentee\'s design in the session. It feels helpful and produces a better artefact today, but it teaches the mentee to bring problems rather than solutions. Hold back unless the stakes are genuinely high.',
        },
        {
          type: 'doDont',
          do: [
            'Share your own mistakes and what you learned.',
            'Match your style to what they need right now.',
          ],
          dont: [
            'Clone yourself — their path may differ from yours.',
            'Let sessions drift into status updates.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Coaching instead of fixing',
          body: 'A mid-level designer brought a dashboard layout they were stuck on. Instead of redrawing it, the mentor asked: "What should a user notice first? What\'s competing with it?" The designer identified the issue themselves and applied the same reasoning to the next two screens without help.',
        },
      ],
      practice: {
        task: 'Set up a structured mentoring relationship.',
        steps: [
          'Agree two or three growth goals with your mentee in writing.',
          'Decide cadence and format (fortnightly, 45 minutes).',
          'In each session, note whether you taught, coached or sponsored.',
          'Review goals after six weeks.',
        ],
        deliverable: 'A mentoring plan with goals and a six-week review note.',
      },
      challenge: {
        task: 'Sponsor your mentee for a visible opportunity aligned with their goals.',
        successCriteria: [
          'The opportunity matched a stated goal.',
          'You prepared them without doing the work for them.',
          'You debriefed afterwards and recorded their reflections.',
        ],
      },
    },
    {
      id: 'e4-design-reviews',
      title: 'Design reviews and quality bars',
      summary: 'Run reviews that uphold a clear quality bar without becoming a bottleneck or an approval theatre.',
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Critique improves work in progress; a design review is a checkpoint against a standard before work moves forward. Confusing the two produces either toothless reviews or critiques that feel like exams.\n\nA review needs an explicit **quality bar** — otherwise it becomes a test of what the most senior person happens to like that day.',
        },
        {
          type: 'checklist',
          title: 'A sample quality bar',
          items: [
            'Solves the stated problem and supports the target metric',
            'Covers empty, loading, error and edge states',
            'Meets accessibility requirements (contrast, focus order, labels)',
            'Uses the design system or logs an exception',
            'Content reviewed for clarity and tone',
            'Engineering has reviewed feasibility',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why an explicit bar matters',
          body: 'An explicit bar makes reviews faster, fairer and teachable. Designers can self-check before review, and disagreements shift from taste to whether a criterion is met.',
        },
        {
          type: 'doDont',
          do: [
            'Distinguish blocking issues from suggestions.',
            'Scale review depth to risk — not every change needs the same review.',
          ],
          dont: [
            'Make yourself the single approver for everything.',
            'Introduce new criteria at review time without warning.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Tiered reviews',
          body: 'A design org introduced three tiers: self-review against the checklist for small changes, peer review for new flows, and lead review for high-risk or cross-product work. Review waits dropped and the lead\'s time went to the decisions that needed it.',
          before: 'Review feedback: "Not quite there yet."',
          after: 'Review feedback: "Blocking: no error state for failed payment. Suggestion: consider shortening the heading."',
        },
      ],
      practice: {
        task: 'Draft a quality bar and review tiers for your team.',
        steps: [
          'List the issues most often caught late (in QA or after launch).',
          'Turn them into checkable criteria.',
          'Define two or three review tiers by risk.',
          'Test the checklist on a recent project.',
        ],
        deliverable: 'A quality bar checklist and review-tier guide.',
      },
      challenge: {
        task: 'Pilot the quality bar with your team for a full project cycle.',
        successCriteria: [
          'Designers self-checked before reviews.',
          'Review feedback separated blocking issues from suggestions.',
          'You revised the bar based on the pilot.',
        ],
      },
    },
    {
      id: 'e4-stakeholder-management',
      title: 'Stakeholder management',
      summary: 'Map influence, understand incentives and build trust before you need it.',
      minutes: 17,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Stakeholder management sounds manipulative; done well, it is simply taking other people\'s goals seriously. Every stakeholder has incentives, pressures and fears that shape how they respond to your work. Understanding them lets you design proposals that can succeed.\n\nThe core insight: influence is built in the quiet weeks, not in the meeting where you need a decision.',
        },
        {
          type: 'list',
          items: [
            '**Map:** who has power over the decision, who is affected, who informally sways others.',
            '**Understand incentives:** what is each stakeholder measured on? What would make them look good or bad?',
            '**Pre-wire:** share significant proposals one-to-one before group meetings.',
            '**Tailor communication:** some want data, some want the customer story, some want the risk.',
            '**Keep promises small and kept:** reliability compounds into trust.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'No surprises',
          body: 'Senior stakeholders rarely object to bad news; they object to being surprised by it in public. Pre-wiring turns potential opponents into informed participants.',
        },
        {
          type: 'doDont',
          do: [
            'Ask stakeholders what success looks like for them.',
            'Invite critics early — their objections improve the proposal.',
          ],
          dont: [
            'Treat stakeholders as obstacles to route around.',
            'Only contact them when you need something.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Pre-wiring a navigation change',
          body: 'A designer planned to propose removing a legacy reporting section. A one-to-one with the head of customer success revealed three large accounts depended on it. The proposal changed to a phased migration with account outreach, and the head of CS presented alongside the designer.',
        },
      ],
      practice: {
        task: 'Map the stakeholders for your current project.',
        steps: [
          'List everyone who can influence or is affected by the outcome.',
          'Place them on a power/interest grid.',
          'For the top five, note their incentives and likely concerns.',
          'Plan one relationship-building conversation this week.',
        ],
        deliverable: 'A stakeholder map with incentives and an engagement plan.',
      },
      challenge: {
        task: 'Pre-wire your next significant proposal with every key stakeholder before the group meeting.',
        successCriteria: [
          'Each key stakeholder saw the proposal before the meeting.',
          'The proposal changed in response to at least one concern.',
          'No stakeholder was surprised in the meeting.',
        ],
      },
    },
    {
      id: 'e4-working-with-pms',
      title: 'Working with product managers',
      summary: 'Build a genuine partnership with your PM, including when your views on scope and priorities diverge.',
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'The PM–designer relationship is the most consequential working relationship for most product designers. When it works, the pair shares ownership of the problem. When it does not, design becomes a service function executing tickets.\n\nRole boundaries vary by company, so make them explicit rather than assuming. A useful default: the PM is accountable for *why* and *what* in terms of outcomes; the designer is accountable for the quality of the experience; both co-own problem framing.',
        },
        {
          type: 'list',
          items: [
            '**Agree working norms early:** how you make decisions, how you disagree, what each wants from the other.',
            '**Share context generously:** research, constraints, stakeholder pressures.',
            '**Disagree privately, align publicly** — then escalate together if needed.',
            '**Understand their pressures:** roadmap commitments, sales requests, leadership asks.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why seniors partner on scope',
          body: 'Scope decisions are experience decisions. A senior designer who helps find the smallest valuable version — rather than defending the ideal design — becomes a trusted partner in planning, not someone brought in after scope is fixed.',
        },
        {
          type: 'quiz',
          question: 'Your PM wants to cut the error-recovery flow to hit a deadline. What is the strongest response?',
          options: [
            'Refuse — error states are non-negotiable.',
            'Agree silently and add it to the backlog.',
            'Explain the likely user and support impact, propose a minimal recovery path, and agree together what is cut.',
            'Escalate to your design manager immediately.',
          ],
          answer: 2,
          explanation: 'It keeps the partnership intact, makes the tradeoff visible, and offers a smaller solution rather than an all-or-nothing position.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A working-agreement conversation',
          body: 'A designer and a new PM spent 45 minutes agreeing how they would work: the designer would join roadmap planning, the PM would join research sessions, and disagreements would be raised within a day. Three months later, both cited that conversation as why they could move fast.',
        },
      ],
      practice: {
        task: 'Write a working agreement with your PM.',
        steps: [
          'List what you each need from the other.',
          'Agree how decisions and disagreements will be handled.',
          'Define which rituals each attends.',
          'Set a date to review it.',
        ],
        deliverable: 'A shared working agreement.',
      },
      challenge: {
        task: 'Co-lead scoping for the next feature with your PM.',
        successCriteria: [
          'You proposed at least two scope options with experience tradeoffs.',
          'The final scope was agreed jointly and documented.',
          'You reviewed the working agreement afterwards.',
        ],
      },
    },
    {
      id: 'e4-working-with-engineers',
      title: 'Working with engineers',
      summary: 'Collaborate from discovery to delivery so build quality matches design intent and engineers shape better solutions.',
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'The biggest gains in design–engineering collaboration come from involving engineers earlier, not from better handoff files. Engineers see constraints and possibilities designers miss, and they build better when they understand the reasoning.\n\nSenior designers treat handoff as a continuous conversation, not a moment.',
        },
        {
          type: 'list',
          items: [
            '**Early involvement:** engineers in discovery and concept reviews.',
            '**Explain intent:** what must be exact, what is flexible, and why.',
            '**Design with the system and the stack:** know what is expensive to build.',
            '**Be present during build:** answer questions fast, pair on tricky interactions.',
            '**Review builds, not just designs:** QA in real environments and on real devices.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Specify behaviour, not only pixels',
          body: 'The most common gaps are behavioural: loading, errors, long content, truncation, responsiveness and focus. Annotating those saves more rework than perfect redlines.',
        },
        {
          type: 'doDont',
          do: [
            'Ask "what would make this simpler to build?" and mean it.',
            'Credit engineers for ideas that improved the design.',
          ],
          dont: [
            'Throw finished designs over the wall.',
            'Dismiss technical constraints as a lack of effort.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'An engineer improves the design',
          body: 'A designer planned a complex real-time filter for a logistics dashboard. In an early review, an engineer noted the API could return pre-computed segments cheaply. The design switched to segment tabs — faster to build and faster for users.',
          before: 'Handoff note: "See Figma."',
          after: 'Handoff note: "Exact: hierarchy, spacing tokens, states. Flexible: animation timing. Long names truncate with tooltip. Error: inline retry."',
        },
      ],
      practice: {
        task: 'Improve collaboration on your next feature.',
        steps: [
          'Invite an engineer to a concept review before designs are detailed.',
          'Annotate behaviour and flexibility in your spec.',
          'Schedule a build review on a real device.',
          'Record issues found and their causes.',
        ],
        deliverable: 'An annotated spec and a build-review log.',
      },
      challenge: {
        task: 'Run a short retro with your engineers on design–engineering collaboration.',
        successCriteria: [
          'Engineers named at least two concrete improvements.',
          'You committed to changes and followed through.',
          'The next feature had fewer late design changes.',
        ],
      },
    },
    {
      id: 'e4-presenting-to-leadership',
      title: 'Presenting to leadership',
      summary: 'Lead with the decision, frame tradeoffs clearly and handle challenge without losing the room.',
      minutes: 16,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Executives have limited time, broad context and a need to decide. Presentations that walk through process chronologically ("first we did research…") lose them. Lead with the answer.\n\nA reliable structure: **the decision or ask**, **why it matters** (tied to business and user outcomes), **the options and tradeoffs**, **your recommendation**, **the risks** and **what you need**.',
        },
        {
          type: 'list',
          items: [
            'Open with the ask in one sentence.',
            'Show only the design detail needed to understand the decision.',
            'Present genuine options — including "do nothing" — with honest tradeoffs.',
            'Have evidence ready in an appendix rather than in the main flow.',
            'Pre-wire key attendees (see Stakeholder management).',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Handling challenge',
          body: 'When challenged, acknowledge the concern, answer briefly with evidence, and if you do not know, say so and commit to follow up. Defensiveness costs more credibility than an honest "I don\'t know yet".',
        },
        {
          type: 'doDont',
          do: [
            'Rehearse the first two minutes until they are crisp.',
            'Name what you need: a decision, resources, or alignment.',
          ],
          dont: [
            'Hide the recommendation until the last slide.',
            'Oversell certainty or use invented numbers.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Reordering a pitch',
          body: 'A lead designer\'s 20-slide deck on a checkout redesign walked through research, personas and flows before the ask. The revised deck opened with: "We recommend a phased checkout rebuild; we need two engineers for a quarter. Here\'s why." The meeting reached a decision in fifteen minutes.',
          before: 'Slide 1: "Our research process"',
          after: 'Slide 1: "Recommendation: phased checkout rebuild. Ask: two engineers for Q1. Decision needed today."',
        },
      ],
      practice: {
        task: 'Restructure a recent or upcoming presentation for a leadership audience.',
        steps: [
          'Write the ask in one sentence.',
          'Reduce the main flow to five to seven slides.',
          'Add options with tradeoffs and your recommendation.',
          'Prepare answers to the three toughest likely questions.',
        ],
        deliverable: 'A leadership-ready deck and a question-prep sheet.',
      },
      challenge: {
        task: 'Present to a senior leader and ask for feedback on clarity afterwards.',
        successCriteria: [
          'The ask was stated in the first two minutes.',
          'A decision or clear next step was reached.',
          'You recorded and acted on the leader\'s feedback.',
        ],
      },
    },
    {
      id: 'e4-conflicting-feedback',
      title: 'Handling conflicting feedback',
      summary: 'Resolve contradictory input from stakeholders by returning to goals, evidence and clear decision rights.',
      minutes: 14,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Sales wants more features on the pricing page; marketing wants it simpler; legal wants more disclaimers. Conflicting feedback is normal. The mistake is trying to satisfy everyone, which produces a compromise nobody wanted.\n\nConflicting feedback usually signals one of three things: unclear goals, missing evidence, or unclear decision rights.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Understand the underlying concern** behind each piece of feedback.',
            '**Return to the agreed goal** — which option serves it best?',
            '**Find evidence** — research, data or a quick test can settle factual disagreements.',
            '**Clarify who decides** — use a framework such as RACI or DACI if needed.',
            '**Document the decision** and the reasoning so it does not reopen.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Do not become the referee of opinions',
          body: 'If you arbitrate between stakeholders on taste, you spend your credibility on every decision. Moving the conversation to goals and evidence makes the decision less about you.',
        },
        {
          type: 'doDont',
          do: [
            'Bring conflicting parties together rather than relaying messages.',
            'Make the tradeoff explicit: "If we optimise for X, we accept Y."',
          ],
          dont: [
            'Merge contradictory requests into one cluttered design.',
            'Quietly pick a side without telling the other party.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Pricing page standoff',
          body: 'Sales and marketing disagreed on a pricing page. The designer convened both, confirmed the goal was self-serve sign-ups for small teams, and proposed a comparison table hidden behind "Compare plans". Sales\' underlying concern — enterprise buyers needing detail — was met by a separate enterprise page.',
        },
      ],
      practice: {
        task: 'Resolve a live case of conflicting feedback.',
        steps: [
          'List each piece of feedback and the concern behind it.',
          'Map each to the project goal.',
          'Identify what evidence or decision right is missing.',
          'Propose a resolution path.',
        ],
        deliverable: 'A feedback-resolution note shared with the stakeholders.',
      },
      challenge: {
        task: 'Facilitate a joint session that reaches a documented decision.',
        successCriteria: [
          'Each party felt their concern was understood.',
          'The decision referenced the goal or evidence.',
          'A decision owner was named and the outcome recorded.',
        ],
      },
    },
    {
      id: 'e4-managing-design-teams',
      title: 'Managing design teams',
      summary: 'Shift from doing the work to building the conditions in which others do their best work.',
      minutes: 18,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'The move into management is a change of job, not a promotion within the same one. Your output becomes your team\'s output. Success looks like clarity of goals, healthy people, strong hiring, and fewer decisions needing you.\n\nThe core responsibilities: setting direction, staffing and structuring the team, developing people, managing performance, and representing design across the organisation.',
        },
        {
          type: 'list',
          items: [
            '**Regular 1:1s** owned by the report, focused on them rather than status.',
            '**Clear expectations** — a career framework and specific feedback against it.',
            '**Staffing decisions:** embedded in product teams, centralised, or a hybrid — each shapes culture and quality.',
            '**Performance issues addressed early,** kindly and directly.',
            '**Shielding and connecting:** filter noise, but do not hide organisational reality.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'The player-coach trap',
          body: 'New managers often keep designing because it is familiar and visible. Doing some hands-on work can keep you credible, but when your team is waiting on your reviews, decisions or support, your design work has become the bottleneck.',
        },
        {
          type: 'doDont',
          do: [
            'Give feedback often and early — no surprises in reviews.',
            'Delegate outcomes, not tasks.',
          ],
          dont: [
            'Take credit for the team\'s work in leadership forums.',
            'Avoid difficult conversations until they become crises.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Delegating an outcome',
          body: 'A new design manager kept redesigning parts of her team\'s work late in the process. She switched to agreeing the outcome and constraints up front, then reviewing against them. The team\'s confidence grew and her calendar freed for hiring.',
          before: '"Can you move this button and change these colours?"',
          after: '"The goal is fewer failed first payments. You own the solution; let\'s review against the quality bar on Thursday."',
        },
      ],
      practice: {
        task: 'Audit how you spend your time as a lead or manager (or aspiring one).',
        steps: [
          'Log your time for one week by category: doing, reviewing, people, strategy, meetings.',
          'Identify where you are a bottleneck.',
          'Choose one area to delegate as an outcome.',
          'Set up or improve 1:1s with a report or mentee.',
        ],
        deliverable: 'A time audit and a delegation plan.',
      },
      challenge: {
        task: 'Delegate one meaningful outcome and support the person through it.',
        successCriteria: [
          'The outcome and constraints were agreed in writing.',
          'You resisted redoing the work.',
          'You debriefed and gave specific feedback afterwards.',
        ],
      },
    },
  ],
}

// ---------------------------------------------------------------------------
// Module 5 — Career Growth
// ---------------------------------------------------------------------------

const moduleCareer: Module = {
  id: 'e-m5-career-growth',
  title: 'Career Growth',
  stage: 'Career',
  summary: 'Understand senior, lead and staff expectations, choose your path, and build a reputation honestly.',
  outcome: 'You will be able to plan your next career step with a clear view of what the role demands and evidence you can show.',
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'e5-senior-expectations',
      title: 'What is expected of a Senior Designer',
      summary: 'Senior means owning ambiguous problems end to end, not just producing excellent screens.',
      minutes: 14,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Titles vary between companies, so read your organisation\'s career framework first. Across most frameworks, though, the step to Senior is a step in **scope and autonomy**: from executing well-defined problems to framing and owning ambiguous ones.\n\nA senior designer is someone a team can hand a messy problem and trust to come back with a well-reasoned direction, without needing close oversight.',
        },
        {
          type: 'list',
          items: [
            '**Problem framing:** shaping the brief, not just responding to it.',
            '**End-to-end ownership:** from discovery through build quality and measurement.',
            '**Sound judgement on tradeoffs,** explained in terms of users and business.',
            '**Influence within the team:** PM and engineering seek your view early.',
            '**Raising others:** giving useful critique and informal mentoring.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why craft alone is not enough',
          body: 'Many strong craftspeople stall at mid-level because their work is excellent but reactive. Promotion committees look for evidence that you changed what was built, not only how it looked.',
        },
        {
          type: 'quiz',
          question: 'Which is the strongest evidence of senior-level impact?',
          options: [
            'Designed 40 screens for a release.',
            'Became the fastest Figma user on the team.',
            'Reframed a feature request after research, leading the team to a simpler solution that shipped sooner and met its goal.',
            'Attended every stakeholder meeting.',
          ],
          answer: 2,
          explanation: 'It shows problem framing, influence and outcome ownership — the core differences between mid-level and senior work.',
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Rewriting a self-review',
          body: 'A designer\'s self-review listed outputs. Rewritten around scope and judgement, it matched the senior criteria in their framework.',
          before: '"Designed the new settings pages and the notification centre."',
          after: '"Identified that notification complaints came from lack of control, reframed the project around preferences, and partnered with engineering to ship a smaller first version. Support tickets on notifications fell over the following quarter."',
        },
      ],
      practice: {
        task: 'Assess yourself against your company\'s senior criteria (or a public framework).',
        steps: [
          'Collect the relevant framework or write down common senior expectations.',
          'For each criterion, note one piece of evidence from the past six months.',
          'Mark criteria with weak or no evidence.',
          'Choose one gap to target next quarter.',
        ],
        deliverable: 'A self-assessment with evidence and one development goal.',
      },
      challenge: {
        task: 'Review the assessment with your manager and agree a concrete opportunity to close the gap.',
        successCriteria: [
          'Your manager agreed or corrected your self-assessment.',
          'A specific project or responsibility was identified.',
          'You set a date to review progress.',
        ],
      },
    },
    {
      id: 'e5-lead-expectations',
      title: 'What is expected of a Lead Designer',
      summary: 'Lead roles add responsibility for the direction and quality of a product area and the people in it.',
      minutes: 14,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: '"Lead" means very different things across companies: sometimes a senior IC leading a product area, sometimes a first-line manager. Clarify which before accepting or pursuing the title.\n\nIn most interpretations, a Lead is accountable for the coherence and quality of design across a product area or several teams, and for helping other designers do strong work.',
        },
        {
          type: 'list',
          items: [
            '**Area-level vision:** a design direction that spans features and teams.',
            '**Coherence:** consistent patterns and quality across multiple designers\' work.',
            '**Facilitation:** running critiques, reviews and cross-team alignment.',
            '**Partnership with product and engineering leads** on roadmap and priorities.',
            '**Developing others:** mentoring, and often input into hiring and performance.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Responsibility without authority',
          body: 'Leads are often accountable for quality across designers they do not manage. Influence through clarity — shared principles, quality bars, and consistent facilitation — works better than personal approval.',
        },
        {
          type: 'doDont',
          do: [
            'Write down the design direction for your area so others can use it without you.',
            'Spend meaningful time on other designers\' work, not only your own.',
          ],
          dont: [
            'Take the most interesting projects for yourself.',
            'Become the only person who can approve design decisions.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'From strong senior to lead',
          body: 'A senior designer noticed three teams designing inconsistent filtering patterns in the same product. She proposed and facilitated a shared pattern, documented it, and reviewed its adoption. That cross-team work, not her own features, became the evidence for her lead promotion.',
        },
      ],
      practice: {
        task: 'Identify a cross-team problem in your area you could lead.',
        steps: [
          'List inconsistencies or gaps that span more than one team.',
          'Pick the one with the clearest user impact.',
          'Draft a short proposal including who would be involved.',
          'Discuss it with your manager.',
        ],
        deliverable: 'A one-page cross-team proposal.',
      },
      challenge: {
        task: 'Lead the initiative to a documented outcome.',
        successCriteria: [
          'Designers from at least two teams contributed.',
          'The outcome was documented for reuse.',
          'Adoption was checked a few weeks later.',
        ],
      },
    },
    {
      id: 'e5-staff-expectations',
      title: 'What is expected of a Staff Designer',
      summary: 'Staff-level ICs shape strategy and multiply the impact of many teams through technical and organisational depth.',
      minutes: 16,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Staff and principal designer roles exist in companies with an explicit IC track. The common thread is **organisation-level impact** without people management: solving problems that span products, setting direction that many teams follow, and raising the design bar across the organisation.\n\nStaff work is often less visible and slower to show results. It demands comfort with ambiguity and influence without formal authority.',
        },
        {
          type: 'list',
          items: [
            '**Archetypes** (loosely borrowed from staff-engineer thinking): the area expert, the architect of cross-product systems, the solver parachuted into hard problems, and the right hand to a design leader.',
            '**Strategic input:** shaping roadmaps and bets at director level.',
            '**Systems thinking:** platforms, design systems, IA and service-level problems.',
            '**Multiplying others:** frameworks, principles, and mentoring senior designers.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why staff roles are scarce',
          body: 'Organisations create staff roles only when there are problems that need that scope. Being excellent is necessary but not sufficient — you also need a real, significant problem and a sponsor who recognises the work.',
        },
        {
          type: 'doDont',
          do: [
            'Find the problems leaders worry about that no single team owns.',
            'Write things down — staff influence often travels through documents.',
          ],
          dont: [
            'Mistake being the best designer on a team for staff-level scope.',
            'Work invisibly and assume impact will be noticed.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A staff-level problem',
          body: 'A company\'s products each built their own onboarding, and cross-sell was suffering. A staff designer mapped the full customer lifecycle across products, proposed a shared account and onboarding model, and worked with three product leads over two quarters to align roadmaps. No single team could have owned that work.',
        },
      ],
      practice: {
        task: 'Identify potential staff-level problems in your organisation.',
        steps: [
          'Ask two senior leaders what cross-cutting problems worry them.',
          'List problems that no single team owns.',
          'For each, note which archetype would fit it.',
          'Assess honestly which you could credibly take on.',
        ],
        deliverable: 'A shortlist of staff-level problems with a self-assessment.',
      },
      challenge: {
        task: 'Write a short strategy document on one of those problems and seek a sponsor.',
        successCriteria: [
          'The document diagnoses the problem and proposes a direction.',
          'Feedback came from at least one director-level leader.',
          'You identified a sponsor or a clear reason the timing is wrong.',
        ],
      },
    },
    {
      id: 'e5-ic-vs-manager',
      title: 'Paths into design leadership: IC vs manager',
      summary: 'Choose between the IC and management tracks based on the work you want, not the title you want.',
      minutes: 15,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Many designers move into management because it looks like the only path upwards. In organisations with a real IC track, it is not. The two paths are different jobs with different daily work, satisfactions and frustrations.\n\nThe better question is: *what work energises you on a typical Tuesday?*',
        },
        {
          type: 'list',
          items: [
            '**Manager:** hiring, 1:1s, performance, team structure, advocacy, budget. Satisfaction comes from others\' growth and team outcomes. Less hands-on design.',
            '**Senior IC (Staff, Principal):** hardest problems, systems, direction, deep craft. Satisfaction comes from solving and shaping. Influence without formal authority.',
            '**Both** require leadership, communication and strategic thinking.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Try before you switch',
          body: 'Test management by mentoring, leading a hiring loop, or covering for a manager on leave. Test the staff path by leading a cross-team initiative. Many people also move between tracks over a career — it is not a one-way door.',
        },
        {
          type: 'doDont',
          do: [
            'Talk to people in both roles about their actual week.',
            'Check whether your company\'s IC track is real — are there staff designers today?',
          ],
          dont: [
            'Become a manager primarily for status or pay.',
            'Assume you must manage to be taken seriously.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Choosing on evidence',
          body: 'A lead designer ran two hiring loops and mentored two juniors for six months while also leading a design-system initiative. She noticed she looked forward to the system work and dreaded performance conversations — and chose the staff path with her manager\'s support.',
        },
      ],
      practice: {
        task: 'Run a personal experiment to inform your path choice.',
        steps: [
          'List activities typical of each path.',
          'Choose one experiment for each you can do in the next quarter.',
          'Keep a short weekly energy log.',
          'Interview one manager and one senior IC.',
        ],
        deliverable: 'An experiment plan and energy log.',
      },
      challenge: {
        task: 'Write a reflection on which path fits you now and discuss it with your manager.',
        successCriteria: [
          'The reflection cites evidence from your experiments.',
          'You identified what your organisation offers on each path.',
          'You agreed a next step with your manager.',
        ],
      },
    },
    {
      id: 'e5-senior-portfolio',
      title: 'Portfolio storytelling for senior roles',
      summary: 'Show judgement, influence and outcomes honestly — senior portfolios are about decisions, not deliverables.',
      minutes: 17,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Hiring managers for senior roles are not asking "can this person design screens?" They are asking "how does this person think, decide and influence?" A portfolio of polished final screens rarely answers that.\n\nFewer, deeper case studies work better: two or three that show how you navigated ambiguity, made tradeoffs and moved an organisation.',
        },
        {
          type: 'list',
          items: [
            '**Context and stakes:** the business and user problem, and why it was hard.',
            '**Your role:** what you personally did vs the team. Be precise.',
            '**Key decisions and tradeoffs:** options considered, why you chose one, what you gave up.',
            '**Influence:** how you brought stakeholders along or changed direction.',
            '**Outcome and reflection:** what happened, measured honestly, and what you would do differently.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Honesty is a senior signal',
          body: 'Inflated metrics and vague "we" statements are easy for experienced interviewers to probe. If you do not have a measured result, say what you observed and why you believe it mattered. Including a project that did not go to plan — with genuine reflection — often impresses more than a flawless story.',
        },
        {
          type: 'doDont',
          do: [
            'Lead each case study with a short summary a busy reader can scan.',
            'Respect confidentiality — abstract or anonymise where needed.',
          ],
          dont: [
            'Claim credit for team outcomes you only contributed to.',
            'Pad the portfolio with many shallow projects.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Rewriting a case-study opening',
          body: 'The rewrite states role, stakes and the decision up front, and makes an honest claim.',
          before: '"I redesigned the onboarding experience, which improved conversion massively."',
          after: '"As lead designer on a four-person team, I argued to cut onboarding from seven steps to three, deferring profile setup. We tested it against the old flow; activation improved and support queries about setup dropped. Deferring profile setup later caused data-quality issues — here\'s how we addressed them."',
        },
      ],
      practice: {
        task: 'Rewrite one case study for a senior audience.',
        steps: [
          'Write a five-sentence summary: context, role, decision, outcome, reflection.',
          'Add a section on the key tradeoff and alternatives considered.',
          'Check every claim for accuracy and "I" vs "we".',
          'Cut any screens that do not support the story.',
        ],
        deliverable: 'A revised senior-level case study.',
      },
      challenge: {
        task: 'Get the case study reviewed by a design leader who hires senior designers.',
        successCriteria: [
          'The reviewer could state your key decision after a two-minute read.',
          'Claims are specific and defensible.',
          'You revised based on their feedback.',
        ],
      },
    },
    {
      id: 'e5-interviewing-designers',
      title: 'Interviewing experienced designers',
      summary: 'Run fair, structured interviews that assess judgement and collaboration, not presentation polish.',
      minutes: 17,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'As you become senior you will interview others, and your decisions shape the team for years. Unstructured interviews are prone to bias — we favour people who remind us of ourselves or who present confidently.\n\nStructured interviewing helps: define what you are assessing, ask consistent questions, and score against criteria before discussing with other interviewers.',
        },
        {
          type: 'list',
          items: [
            '**Define competencies** for the role before the loop (e.g. problem framing, craft, collaboration, communication).',
            '**Portfolio deep dives:** probe decisions — "what else did you consider? what would you change?"',
            '**Behavioural questions** about real past situations, with follow-ups.',
            '**Collaborative exercises** that mirror real work rather than unpaid spec work.',
            '**Independent scoring** before the debrief to avoid anchoring.',
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why candidate experience matters',
          body: 'Every candidate forms a view of your company. Being prepared, respectful of their time, clear about the process and honest about the role builds your reputation even when you say no.',
        },
        {
          type: 'doDont',
          do: [
            'Ask the same core questions of every candidate for a role.',
            'Write evidence-based notes, not impressions.',
            'Separate "different from us" from "not good enough".',
          ],
          dont: [
            'Set lengthy unpaid take-home projects on real product problems.',
            'Rely on "culture fit" as an unexplained reason to reject.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A better probing question',
          body: 'Follow-ups that probe decisions reveal far more about seniority than broad prompts.',
          before: '"Walk me through your process."',
          after: '"In this project, what was the hardest tradeoff you made? Who disagreed, and how did you resolve it? What would you do differently now?"',
        },
      ],
      practice: {
        task: 'Design an interview plan for a senior designer role.',
        steps: [
          'List four to five competencies with what "strong" looks like.',
          'Write questions and follow-ups for each.',
          'Create a scoring rubric.',
          'Plan how interviewers will score independently before the debrief.',
        ],
        deliverable: 'An interview kit with competencies, questions and rubric.',
      },
      challenge: {
        task: 'Use the kit in a real or mock interview and calibrate with another interviewer.',
        successCriteria: [
          'Both interviewers scored independently first.',
          'Differences in scoring were discussed with evidence.',
          'You refined at least one question or rubric level.',
        ],
      },
    },
    {
      id: 'e5-mentoring-leverage',
      title: 'Mentoring as career leverage',
      summary: 'Mentoring grows your own judgement, network and leadership evidence — when done generously, not transactionally.',
      minutes: 13,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'The Leadership module covered how to mentor well. This lesson is about why it matters for *your* career — and how to make that benefit visible without making mentoring self-serving.\n\nExplaining your reasoning to someone else forces you to articulate tacit knowledge, which sharpens your judgement. Mentoring also builds evidence of leadership for promotion, and relationships that last across companies.',
        },
        {
          type: 'list',
          items: [
            '**Evidence of leadership:** mentees\' growth is a signal most frameworks value at senior levels and above.',
            '**Clearer thinking:** teaching exposes gaps in your own understanding.',
            '**Network:** today\'s mentees become tomorrow\'s peers and hiring managers.',
            '**Being mentored too:** seek mentors and peer circles for yourself — reciprocity keeps you learning.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Keep it generous',
          body: 'Mentoring chosen purely for promotion shows. Focus on the mentee\'s goals; the benefits to you follow. When documenting it for reviews, describe their growth honestly and with their permission.',
        },
        {
          type: 'doDont',
          do: [
            'Keep notes on what you learned from mentoring conversations.',
            'Mention mentoring in reviews with specific, consented examples.',
          ],
          dont: [
            'Claim credit for a mentee\'s achievements.',
            'Take on more mentees than you can serve well.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Honest documentation in a review',
          body: 'A senior designer described mentoring in her promotion case by focusing on the mentee\'s growth and her own role accurately.',
          before: '"I made Sam a much better designer."',
          after: '"I mentored Sam fortnightly for six months on facilitation. Sam now runs our team\'s critiques; I observed three and gave feedback."',
        },
      ],
      practice: {
        task: 'Plan your mentoring footprint for the next six months.',
        steps: [
          'Decide how many people you can mentor well.',
          'Find one mentee inside and, optionally, one outside your company.',
          'Identify a mentor or peer circle for yourself.',
          'Set up a private log of what you learn.',
        ],
        deliverable: 'A six-month mentoring plan including your own mentor.',
      },
      challenge: {
        task: 'After three months, write a short reflection on how mentoring changed your own practice.',
        successCriteria: [
          'You named at least two things you now understand better.',
          'Your mentee confirmed the relationship is useful to them.',
          'You identified one way to improve as a mentor.',
        ],
      },
    },
    {
      id: 'e5-personal-brand',
      title: 'Personal brand for senior designers',
      summary: 'Build a reputation grounded in real work and a clear point of view, inside and outside your company.',
      minutes: 13,
      difficulty: 'Hard',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: '"Personal brand" can sound like self-promotion. For senior designers, it is better understood as **reputation**: what people say about you when you are not in the room, and what you are known for.\n\nInternal reputation often matters more than external. The people deciding your promotion and next role are colleagues who have seen your work.',
        },
        {
          type: 'list',
          items: [
            '**Choose a focus:** two or three areas you want to be known for (e.g. complex B2B workflows, design systems, research-led strategy).',
            '**Show the work:** share learnings internally — talks, write-ups, demos.',
            '**Be consistent:** your LinkedIn, portfolio and conversations tell the same story.',
            '**Be generous:** helping others is the most durable reputation-builder.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Specific beats broad',
          body: '"Designer passionate about great experiences" is forgettable. "Designer who makes complex financial workflows understandable" is memorable and useful to people deciding who to hire or involve.',
        },
        {
          type: 'doDont',
          do: [
            'Write a one-line positioning statement and test it with peers.',
            'Share learnings from real projects, respecting confidentiality.',
          ],
          dont: [
            'Post content unrelated to your real expertise to chase engagement.',
            'Overstate your role or results publicly.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A sharper positioning line',
          body: 'A LinkedIn headline rewritten to say what the designer actually does and for whom.',
          before: 'Senior Product Designer | UX Enthusiast | Creative Thinker',
          after: 'Senior Product Designer — making complex B2B finance workflows clear and fast',
        },
      ],
      practice: {
        task: 'Define and test your professional positioning.',
        steps: [
          'Ask three colleagues what they would come to you for.',
          'Draft a one-line positioning statement.',
          'Compare it with your LinkedIn and portfolio.',
          'Plan one internal share (talk, write-up) aligned with it.',
        ],
        deliverable: 'A positioning statement and an updated profile.',
      },
      challenge: {
        task: 'Deliver the internal share and gather feedback.',
        successCriteria: [
          'The share drew on a real project.',
          'At least one colleague followed up with a question or request.',
          'Your profiles now tell a consistent story.',
        ],
      },
    },
    {
      id: 'e5-thought-leadership',
      title: 'Thought leadership',
      summary: 'Contribute original, useful thinking to the field — through writing, talking and teaching — without the hype.',
      minutes: 15,
      difficulty: 'Advanced',
      published: true,
      addedAt: ADDED,
      learn: [
        {
          type: 'text',
          body: 'Thought leadership is contributing ideas that others find useful enough to adopt. It is not posting frequently, and it is not repackaging common advice. The bar is: *would an experienced peer learn something from this?*\n\nThe best source material is your own practice — a problem you solved, a framework you refined, a mistake you learned from.',
        },
        {
          type: 'list',
          items: [
            '**Start internally:** a talk at your company or a write-up tests whether an idea holds up.',
            '**Write:** articles or long-form posts force clarity.',
            '**Speak:** meetups first, then conferences — a clear, specific talk beats a broad one.',
            '**Teach:** workshops and mentoring communities.',
            '**Engage with critique:** respond to disagreement thoughtfully; it improves the idea.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Confidentiality and credibility',
          body: 'Check your employer\'s policy before sharing work publicly and anonymise sensitive details. Never invent results or anecdotes to make a point — experienced audiences notice, and credibility is hard to rebuild.',
        },
        {
          type: 'doDont',
          do: [
            'Share specific, practical insight with honest caveats.',
            'Credit the people and sources whose ideas you build on.',
          ],
          dont: [
            'Chase trends you have no real experience with.',
            'Present opinion as settled fact.',
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'From generic to specific',
          body: 'A talk proposal rewritten to offer something only this speaker could share.',
          before: 'Talk title: "Why design systems matter"',
          after: 'Talk title: "What we learned retiring 30 components: deprecation without breaking trust"',
        },
      ],
      practice: {
        task: 'Draft a piece of thought leadership from your own practice.',
        steps: [
          'List three problems you have solved that peers struggle with.',
          'Pick one and outline the insight in five bullet points.',
          'Check confidentiality and anonymise as needed.',
          'Write an 800-word draft or a 10-minute talk outline.',
        ],
        deliverable: 'A draft article or talk outline.',
      },
      challenge: {
        task: 'Publish or present the piece and engage with the response.',
        successCriteria: [
          'The piece shares a specific, original insight from real work.',
          'It was reviewed for confidentiality before publishing.',
          'You responded thoughtfully to at least one question or critique.',
        ],
      },
    },
  ],
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export const expertStrategy: Course = {
  id: 'e-strategy-systems',
  title: 'Strategy & Systems',
  description:
    'Senior-level product strategy, complex UX and design systems at scale — for designers who shape what gets built, not just how it looks.',
  published: true,
  modules: [moduleStrategy, moduleAdvancedUx, moduleDesignSystems],
}

export const expertLeadership: Course = {
  id: 'e-leadership-growth',
  title: 'Leadership & Career Growth',
  description:
    'Lead through influence, raise the bar for your team, and plan your path through senior, lead, staff and management roles.',
  published: true,
  modules: [moduleLeadership, moduleCareer],
}
