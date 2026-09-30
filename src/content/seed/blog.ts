import type { BlogPost } from '../types'

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-portfolio-mistakes-that-hide-good-work',
    slug: 'portfolio-mistakes-that-hide-good-work',
    title: '6 portfolio mistakes that hide good work (and how to fix them)',
    excerpt:
      "Most junior portfolios don't lack good work — they bury it. Here are six common mistakes that make reviewers scroll past, and practical fixes for each.",
    cover: 'portfolio',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-09-22',
    tags: ['Portfolio', 'Career'],
    minutes: 8,
    featured: true,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "I review a lot of junior portfolios. The frustrating pattern isn't weak work — it's decent work hidden behind choices that make it hard to see.\n\nA hiring manager usually skims first and reads properly only if something catches their attention. Your job is to make the good parts findable in that first skim. Here are the six mistakes I see most, in roughly the order they cost people.",
      },
      { type: 'heading', text: '1. Opening with process instead of the problem' },
      {
        type: 'text',
        body: "Many case studies start with a double-diamond diagram, then a list of methods: interviews, affinity mapping, personas, wireframes. The reader still has no idea what you were trying to solve.\n\nOpen with the problem in plain language: who was struggling, with what, and why it mattered. Methods only make sense once the reader knows what they were for.",
      },
      {
        type: 'example',
        title: 'Rewriting a case study opening',
        body: 'Same project, same work. The second version tells the reader in one line why they should keep reading.',
        before:
          'Overview: I followed the Design Thinking process — Empathise, Define, Ideate, Prototype, Test — to redesign a food delivery app.',
        after:
          "People ordering for a group kept abandoning the basket because splitting items between friends wasn't possible. I redesigned group ordering so each person could add and pay for their own items.",
      },
      { type: 'heading', text: '2. Showing every screen at the same size' },
      {
        type: 'text',
        body: "A grid of 30 identical phone mockups says 'I made a lot of screens'. It doesn't say which decision was hard or interesting. Pick the two or three screens where the real thinking happened and show them large, with a sentence explaining the decision. Everything else can be a smaller supporting strip — or cut.",
      },
      { type: 'heading', text: '3. Hiding the messy middle' },
      {
        type: 'text',
        body: "Juniors often remove rejected ideas because they feel like failures. They're the opposite: rejected options are the best evidence you can make decisions. Show one early direction, what you learned (from a test, a constraint, or feedback), and why you changed course.",
      },
      {
        type: 'illustration',
        name: 'portfolio',
        caption: 'Lead with the problem, highlight the key decisions, and let supporting screens stay in the background.',
      },
      { type: 'heading', text: '4, 5 and 6: the quick fixes' },
      {
        type: 'doDont',
        do: [
          'Put your two strongest projects first — reviewers rarely reach the fourth.',
          'Say clearly what *you* did on team projects ("I owned the checkout flow; a teammate ran the interviews").',
          'Make the portfolio load quickly on a phone, and link directly to case studies rather than a PDF download.',
        ],
        dont: [
          'Include every project you have ever done to look busy.',
          "Write 'we' throughout so the reader can't tell what your contribution was.",
          'Lock case studies behind a password without telling people how to get it.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: "Don't invent outcomes",
        body: "If your project wasn't shipped, don't claim it 'increased conversion by 30%'. Interviewers ask follow-up questions, and made-up numbers fall apart quickly. Honest outcomes — what you learned in testing, what you'd measure if it launched — are far more credible.",
      },
      {
        type: 'checklist',
        title: 'Before you share your portfolio link',
        items: [
          'Each case study opens with the problem in one or two sentences.',
          'My role is stated explicitly on every team project.',
          'I show at least one rejected idea and why I moved on.',
          'Key screens are large and annotated; filler screens are cut.',
          'It loads and reads well on a phone.',
          'Someone outside design has skimmed it and could explain what I did.',
        ],
      },
      {
        type: 'text',
        body: "None of these fixes need new projects. Pick the case study you're proudest of and apply them this week — it's usually a few evenings' work. If you'd like a second pair of eyes, you can book a 1:1 with Harikrishna for a portfolio review.",
      },
    ],
  },
  {
    id: 'blog-auto-layout-mental-model',
    slug: 'auto-layout-mental-model',
    title: 'Auto Layout in 10 minutes: the mental model that makes it click',
    excerpt:
      "Auto Layout feels confusing until you stop thinking about placing things and start thinking about boxes that stack. Here's the mental model that makes it click.",
    cover: 'spacing',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-09-08',
    tags: ['Figma', 'Beginner'],
    minutes: 7,
    featured: false,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "Most people learn Figma by dragging things around the canvas. Auto Layout asks you to stop doing that, which is why it feels awkward at first.\n\nThe shift is this: **you don't position items — you describe rules, and Figma positions them for you.** Once that clicks, the settings make sense.",
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'Why bother?',
        body: "Real interfaces change. A button label gets translated into German and doubles in length; a card gains an extra line of text. With Auto Layout, the container adapts. Without it, you're nudging pixels on every screen by hand.",
      },
      { type: 'heading', text: 'The model: a box that stacks its children' },
      {
        type: 'text',
        body: "An Auto Layout frame is a box with four decisions:\n\n**Direction** — do children stack vertically or horizontally?\n\n**Gap** — how much space sits between each child?\n\n**Padding** — how much space sits between the children and the edge of the box?\n\n**Alignment** — where do the children sit inside the box?\n\nThat's it. Every complex layout is just boxes inside boxes, each answering those four questions.",
      },
      {
        type: 'illustration',
        name: 'spacing',
        caption: 'Gap is the space between children; padding is the space between children and the frame edge.',
      },
      { type: 'heading', text: 'Resizing: hug, fill or fixed' },
      {
        type: 'list',
        items: [
          '**Hug contents** — the box shrinks or grows to fit what is inside. Good for buttons and tags.',
          '**Fill container** — the item stretches to take the available space in its parent. Good for inputs in a form, or a text column beside an icon.',
          '**Fixed** — the size stays exactly what you set. Use sparingly, for things like avatars or icons.',
        ],
      },
      {
        type: 'example',
        title: 'A button that survives a longer label',
        body: 'Build the button as a horizontal Auto Layout frame containing an icon and a text layer, with padding and a gap, set to hug contents.',
        before:
          'A rectangle with a text layer placed on top. Change "Save" to "Save and continue" and the text spills outside the rectangle.',
        after:
          'An Auto Layout frame (horizontal, 16px horizontal padding, 8px gap, hug). Change the label and the button widens to fit, keeping its padding.',
      },
      {
        type: 'interactive',
        widget: 'auto-layout',
        caption: 'Try changing direction, gap and padding to see how the children respond.',
      },
      {
        type: 'doDont',
        do: [
          'Build from the inside out: make the smallest pieces (button, list item) first, then nest them.',
          'Use gap for spacing between siblings instead of invisible spacer rectangles.',
          'Name your frames ("Card / Body", "Row / Actions") so nesting stays readable.',
        ],
        dont: [
          'Wrap an entire screen in one frame and hope for the best.',
          'Mix absolute positioning and Auto Layout without a clear reason.',
          'Set everything to fixed width — you lose most of the benefit.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'When it misbehaves',
        body: "If a layout does something odd, select the parent frame and read its four decisions out loud: direction, gap, padding, alignment. Then check each child's resizing. The culprit is nearly always a child set to fixed or hug when it should be fill.",
      },
      {
        type: 'checklist',
        title: 'Practise this in 10 minutes',
        items: [
          'Build a button that hugs its label.',
          'Build a list row: icon, text that fills, and a chevron on the right.',
          'Stack three rows in a vertical frame with a consistent gap.',
          'Change one label to something much longer and check nothing breaks.',
        ],
      },
    ],
  },
  {
    id: 'blog-honest-resume-bullets-without-metrics',
    slug: 'honest-resume-bullets-without-metrics',
    title: "Writing honest resume bullets when you don't have metrics",
    excerpt:
      "Most junior designers don't have launch metrics — and that's fine. Here's how to write resume bullets that show real impact without inventing numbers.",
    cover: 'resume',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-08-25',
    tags: ['Resume', 'Career'],
    minutes: 6,
    featured: false,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "Resume advice often says 'quantify everything'. For a junior designer, that can be unhelpful: course projects don't launch, and in many first jobs you never see the analytics.\n\nThe temptation is to make numbers up. Please don't. Reviewers can often tell, and one follow-up question in an interview is enough to expose it. The good news is that numbers aren't the only way to show impact.",
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'What a bullet actually needs to show',
        body: 'A strong bullet answers three questions: what did you do, why did it matter, and what changed as a result? A number is one way to show what changed — but evidence, scope and decisions work too.',
      },
      { type: 'heading', text: 'Honest alternatives to metrics' },
      {
        type: 'list',
        items: [
          '**Scope** — how big or complex was it? ("Redesigned the 5-step onboarding flow for a banking app concept.")',
          '**Evidence** — what did testing or feedback reveal? ("Usability testing with 5 participants showed the new flow removed the step where most got stuck.")',
          '**Decisions** — what trade-off did you make and why? ("Chose a single-page form over a wizard after testing showed people wanted to review all details at once.")',
          '**Adoption** — who used or built on your work? ("Components were adopted by the other two designers on the project.")',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Real small numbers are fine',
        body: "'Tested with 5 participants' or 'designed 12 components' are real numbers you can defend. Small and true beats big and invented every time.",
      },
      {
        type: 'illustration',
        name: 'resume',
        caption: 'Action, context and outcome — the outcome can be evidence or a decision, not only a percentage.',
      },
      {
        type: 'example',
        title: 'From vague to specific — without inventing anything',
        body: 'The rewrite adds the problem, the action and honest evidence of what changed.',
        before: 'Designed a new checkout for an e-commerce app, improving user experience.',
        after:
          'Redesigned the guest checkout for a course project after interviews showed forced account creation was the main frustration; in testing, all 5 participants completed purchase without help.',
      },
      {
        type: 'example',
        title: 'Handling a team project honestly',
        body: 'Name your own part clearly. It reads as more confident, not less.',
        before: 'Led the redesign of a food delivery app, increasing orders by 25%.',
        after:
          'Owned the search and filters experience in a 3-person redesign of a food delivery app; ran 4 guerrilla tests that led us to move dietary filters above the fold.',
      },
      {
        type: 'doDont',
        do: [
          'Start with a strong verb that describes your action (redesigned, tested, simplified).',
          'Mention the constraint or problem that made the work necessary.',
          'Label concept or course work honestly — reviewers respect it.',
        ],
        dont: [
          'Invent percentages or revenue figures.',
          "Use 'led' when you contributed as one of several people.",
          "Fill bullets with tools ('Used Figma, Miro, Notion') instead of outcomes.",
        ],
      },
      {
        type: 'checklist',
        title: 'Check every bullet',
        items: [
          'Could I explain this bullet for two minutes in an interview?',
          'Is every number something I could show evidence for?',
          'Is it clear what I did personally?',
          'Does it say why the work mattered, not only what I made?',
        ],
      },
    ],
  },
  {
    id: 'blog-what-junior-design-interviews-test',
    slug: 'what-junior-design-interviews-test',
    title: 'What junior design interviews actually test',
    excerpt:
      "Junior design interviews aren't testing whether you know every tool. They're testing how you think, how you communicate and whether you're good to work with.",
    cover: 'interview',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-08-18',
    tags: ['Interviews', 'Career'],
    minutes: 8,
    featured: false,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "Juniors often prepare for design interviews as if they were exams: memorising frameworks, revising Figma shortcuts, learning every heuristic by name.\n\nInterviewers for junior roles usually aren't expecting a finished designer. They're trying to predict what you'll be like to work with in six months. That changes what you should prepare.",
      },
      { type: 'heading', text: 'The four things being assessed' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**How you frame problems** — do you ask who the user is and what they need before jumping to screens?',
          '**How you explain decisions** — can you say *why* you chose something, not only what you made?',
          '**How you handle feedback** — do you get defensive, or curious?',
          '**Craft fundamentals** — hierarchy, spacing, consistency and accessibility basics, not advanced polish.',
        ],
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'Why thinking beats polish',
        body: 'Visual polish improves quickly with a good team and regular critique. Problem framing and communication take longer to teach, so interviewers look for signs of them early.',
      },
      {
        type: 'illustration',
        name: 'interview',
        caption: 'Interviewers listen for your reasoning as much as they look at your screens.',
      },
      {
        type: 'qa',
        title: 'Common questions and what they are really asking',
        items: [
          {
            question: 'Walk me through a project you are proud of.',
            answer:
              'They want the problem, your role, one or two key decisions and what you learned. Keep it to about five minutes and let them ask for detail.',
            tip: 'Practise out loud with a timer. Most people run long on process and short on decisions.',
          },
          {
            question: 'Tell me about a time you received difficult feedback.',
            answer:
              'They are checking how you respond to critique. Describe the feedback, how you felt honestly, what you changed and what the result was.',
            tip: 'Pick a real example where the feedback improved the work — not one where you proved the critic wrong.',
          },
          {
            question: 'How would you improve this app?',
            answer:
              'Start by asking who it is for and what they are trying to do. Pick one flow, name a specific problem, and suggest a change with a reason.',
            tip: 'Choosing one small, well-reasoned improvement beats a list of ten surface-level ones.',
          },
          {
            question: 'Do you have any questions for us?',
            answer:
              'They want to see genuine interest. Ask about how design works day to day: critique, how designers work with engineers, what a first project might look like.',
          },
        ],
      },
      {
        type: 'example',
        title: 'Answering "why did you choose this?"',
        body: 'Linking a decision to a user need or constraint shows reasoning, not just taste.',
        before: 'I used a bottom sheet because it looks cleaner and is quite modern.',
        after:
          'I used a bottom sheet because people filter while scrolling results on their phone, and the sheet keeps the list visible so they can see the effect of each filter.',
      },
      {
        type: 'doDont',
        do: [
          'Think out loud during whiteboard or app critique exercises.',
          "Say 'I don't know, but here's how I'd find out' when it's true.",
          'Bring one or two questions that show you researched the product.',
        ],
        dont: [
          'Recite a framework step by step without applying it.',
          'Criticise a product without acknowledging its likely constraints.',
          'Pretend to have experience you do not have.',
        ],
      },
      {
        type: 'checklist',
        title: 'The week before your interview',
        items: [
          'Rehearse one case study walkthrough in under five minutes.',
          'Prepare two honest stories: a feedback moment and a mistake you learned from.',
          "Use the company's product and note one thing you'd explore improving, with a reason.",
          'Write down three questions to ask them.',
        ],
      },
    ],
  },
  {
    id: 'blog-design-systems-start-small',
    slug: 'design-systems-start-small',
    title: 'Your first design system should be boring',
    excerpt:
      "Ambitious first design systems tend to stall. Start with the few decisions your team repeats every day, make them reliable, and let the system grow from real use.",
    cover: 'design-system',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-08-04',
    tags: ['Design systems', 'Intermediate'],
    minutes: 7,
    featured: false,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "When designers start their first design system, they often aim for something like the public systems they admire: dozens of components, full documentation, a brand-new token architecture.\n\nThose public systems were built over years by dedicated teams. A small team trying to match them in a quarter usually ends up with a half-finished library nobody trusts. A boring system that covers the basics well is far more useful.",
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'What a design system is actually for',
        body: "Its job is to stop your team re-making the same decisions. If designers still debate button padding every sprint, the system isn't doing its job — however many components it has.",
      },
      { type: 'heading', text: 'Start with an inventory, not a library' },
      {
        type: 'text',
        body: "Screenshot the live product and group what you find: every button style, every grey, every text size. In most products you'll find several near-identical versions of the same thing.\n\nThat inventory tells you where inconsistency actually costs time — and gives you a clear, uncontroversial starting point.",
      },
      {
        type: 'illustration',
        name: 'design-system',
        caption: 'Foundations first, then the handful of components your product uses on nearly every screen.',
      },
      { type: 'heading', text: 'A sensible first scope' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Colour and type tokens** — a small, named palette and type scale that replace the ad hoc values.',
          '**Spacing scale** — a handful of values (for example 4, 8, 12, 16, 24, 32) that everyone uses.',
          '**Core components** — button, text input, checkbox, select, and whatever card or list row appears on most screens.',
          '**Short usage notes** — one or two sentences per component on when to use it, not a manual.',
        ],
      },
      {
        type: 'example',
        title: 'Scoping down a SaaS dashboard system',
        body: 'The second plan ships something the team can use within weeks and learns from real adoption.',
        before:
          'Phase 1: 40 components, dark mode, data visualisation library, motion guidelines and a documentation site.',
        after:
          'Phase 1: tokens for colour, type and spacing; button, input, select, table row and empty state; a single Figma page of usage notes. Review in six weeks based on what designers and engineers actually used.',
      },
      {
        type: 'doDont',
        do: [
          'Agree names with engineers so tokens match in Figma and code.',
          'Build components with Auto Layout and variants that match real states (default, hover, disabled, error).',
          'Add a component only when it has appeared in at least a couple of real designs.',
        ],
        dont: [
          'Design components for hypothetical future features.',
          'Launch without telling engineers or checking what already exists in code.',
          'Treat the first version as final — expect to rename and restructure.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'The silent failure',
        body: "The most common way a young system fails isn't bad design — it's being ignored. If people detach components or copy old screens instead, ask them why. Their answer is your roadmap.",
      },
      {
        type: 'checklist',
        title: 'Your first-version checklist',
        items: [
          'I have an inventory of existing styles and components.',
          'Colour, type and spacing tokens are named and agreed with engineering.',
          'Five to eight core components cover most screens.',
          'Each component shows its real states.',
          'There is a date to review adoption and decide what comes next.',
        ],
      },
    ],
  },
]
