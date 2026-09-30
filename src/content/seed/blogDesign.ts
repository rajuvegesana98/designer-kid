import type { BlogPost } from '../types'

export const designPosts: BlogPost[] = [
  {
    id: 'blog-visual-hierarchy-in-5-decisions',
    slug: 'visual-hierarchy-in-5-decisions',
    title: 'Visual hierarchy in five decisions',
    excerpt:
      "Visual hierarchy isn't a talent — it's five decisions you make on purpose: what matters most, size, weight, colour and space. Here's how to make each one.",
    cover: 'visual-hierarchy',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-07-28',
    tags: ['UI design', 'Beginner'],
    minutes: 7,
    featured: false,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "When a screen feels 'busy' or 'flat', the problem is almost always hierarchy. Everything is shouting at the same volume, so nothing gets heard.\n\nGood hierarchy tells people where to look first, second and third without them noticing they're being guided. The encouraging part is that it isn't an instinct you either have or don't. It's a small set of decisions, and you can make them deliberately.",
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'Why it matters',
        body: "People don't read interfaces — they scan them, looking for the thing they came to do. If the most important element isn't the most noticeable one, they either miss it or spend effort hunting for it. Hierarchy is how you respect their attention.",
      },
      { type: 'heading', text: 'Decision 1: rank the content before you style it' },
      {
        type: 'text',
        body: "Before touching fonts or colours, write down what is on the screen and number it by importance. On a banking app's home screen, that might be: 1. current balance, 2. recent transactions, 3. 'Send money', 4. account settings.\n\nThis step feels too simple to bother with, but it's where most hierarchy problems start. If you haven't decided what matters most, no amount of styling will make it obvious.",
      },
      { type: 'heading', text: 'Decisions 2 to 5: the tools you rank with' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Size** — bigger things are seen first. Reserve your largest text for your number-one item, not for every heading.',
          '**Weight** — bold draws the eye even at the same size. Use it to lift a label or a price, not whole paragraphs.',
          '**Colour and contrast** — a saturated or high-contrast element stands out against muted surroundings. Keep your brand colour for the primary action so it keeps its pull.',
          '**Space and position** — generous space around an element isolates it and makes it feel important. Things at the top and left (in left-to-right languages) are usually seen earlier.',
        ],
      },
      {
        type: 'interactive',
        widget: 'visual-hierarchy',
        caption: 'Adjust size, weight and colour to see how quickly the focal point changes.',
      },
      {
        type: 'example',
        title: 'A food delivery order confirmation',
        body: 'The customer has one question after paying: when will my food arrive? The redesign ranks the content around that question.',
        before:
          "Order number, restaurant name, item list, delivery address and estimated time all set in 16px regular text, with a large bold 'Thank you!' heading at the top.",
        after:
          "'Arriving in about 25 minutes' as the largest, boldest line; restaurant and a 'Track order' button beneath it; item list and address in smaller, lighter text further down. 'Thank you' moves to a short line of supporting text.",
      },
      {
        type: 'illustration',
        name: 'visual-hierarchy',
        caption: 'One clear focal point, a supporting layer, and quieter detail — three levels are usually enough.',
      },
      {
        type: 'doDont',
        do: [
          'Pick one focal point per screen and make it unmistakable.',
          'Use two or three levels of emphasis, not seven.',
          'Combine tools sparingly — size plus weight is often enough.',
        ],
        dont: [
          'Make every heading bold, coloured and large at once.',
          'Use your brand colour for decoration as well as the main button.',
          "Fill every gap — empty space is part of the hierarchy, not wasted room.",
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'The squint test',
        body: "Step back from your screen and squint (or blur a screenshot). The shapes that still stand out are what people will notice first. If that isn't your number-one item, adjust before you polish anything else.",
      },
      {
        type: 'checklist',
        title: 'Before you move on from a screen',
        items: [
          'I have written down the content in order of importance.',
          'The most important item is the most noticeable one when blurred.',
          'I use no more than three clear levels of emphasis.',
          'The brand colour is reserved for the primary action or key state.',
          'Secondary details are quieter, not missing.',
        ],
      },
    ],
  },
  {
    id: 'blog-colour-palettes-that-pass-contrast',
    slug: 'colour-palettes-that-pass-contrast',
    title: 'Building a colour palette that passes contrast',
    excerpt:
      'Most palettes fail accessibility because contrast is checked last. Build it in from the start with tonal scales, clear pairings and the WCAG thresholds that matter.',
    cover: 'colour',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-07-21',
    tags: ['Colour', 'Accessibility'],
    minutes: 8,
    featured: false,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "A familiar story: a team picks a lovely brand teal, builds fifty screens, then an accessibility review finds that white text on the teal buttons is hard to read. Now every screen needs revisiting.\n\nThe fix isn't to check harder at the end. It's to build contrast into the palette itself, so the safe combinations are the obvious ones to reach for.",
      },
      { type: 'heading', text: 'The numbers you actually need' },
      {
        type: 'list',
        items: [
          '**4.5:1** — minimum contrast for normal body text against its background (WCAG 2.2, level AA).',
          '**3:1** — minimum for large text: roughly 24px regular, or about 18.5px bold and above.',
          '**3:1** — minimum for meaningful non-text elements such as input borders, focus rings and icons that carry information.',
        ],
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'Why these thresholds exist',
        body: "Contrast isn't only about people with low vision. Someone checking their bank balance on a phone in bright sunlight, or with a cracked screen, or on a cheap laptop panel, benefits too. The thresholds are a floor that keeps text readable in ordinary, imperfect conditions.",
      },
      { type: 'heading', text: 'Build tonal scales, not single colours' },
      {
        type: 'text',
        body: "Instead of one 'brand blue', create a scale of about ten steps from very light to very dark — for example `blue-50` to `blue-900`. Do the same for your neutrals and for status colours (success, warning, error).\n\nThen check contrast *between steps* once and write down the results. You'll typically find that the darker steps pass on white and the lightest steps pass behind dark text. Those checked pairings become your rules, so nobody has to guess later.",
      },
      {
        type: 'interactive',
        widget: 'contrast-checker',
        caption: 'Try your brand colour against white and against your darkest neutral. Which text size does each pairing support?',
      },
      {
        type: 'example',
        title: 'A SaaS primary button',
        body: 'The brand colour stays recognisable; the team just chooses a darker step of the same hue for anything that carries text.',
        before:
          'White 14px label on a mid-tone brand teal. The pairing is below 4.5:1, so the label is hard to read, especially on low-quality screens.',
        after:
          "White 14px label on the teal-700 step, checked above 4.5:1. The lighter teal is kept for large illustrations and backgrounds where it doesn't carry small text.",
      },
      {
        type: 'illustration',
        name: 'colour',
        caption: 'A tonal scale lets you keep one hue while choosing the step that passes for each job.',
      },
      {
        type: 'doDont',
        do: [
          'Document tested pairings, e.g. "text-on-primary: white on primary-700".',
          'Check focus rings and input borders against the surface they sit on (3:1).',
          'Pair colour with a second cue — an icon or text — for errors and status.',
        ],
        dont: [
          'Rely on red versus green alone to show success and failure.',
          'Use light grey placeholder text as the only label for an input.',
          'Assume a colour that passes in light mode also passes in dark mode.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Passing is the minimum, not the goal',
        body: 'A pairing at exactly 4.5:1 is compliant, but long passages of small text often read more comfortably with more contrast. Treat the threshold as the line you never cross, then use judgement above it.',
      },
      {
        type: 'checklist',
        title: 'Palette contrast checklist',
        items: [
          'Every colour has a light-to-dark tonal scale.',
          'Body text pairings are checked at 4.5:1 or above.',
          'Borders, icons and focus states are checked at 3:1 or above.',
          'Status colours are paired with an icon or label.',
          'Dark-mode pairings are checked separately.',
          'Approved pairings are written down where the team can find them.',
        ],
      },
    ],
  },
  {
    id: 'blog-type-scales-without-guesswork',
    slug: 'type-scales-without-guesswork',
    title: 'Type scales without guesswork',
    excerpt:
      'Stop picking font sizes one by one. A type scale gives you a small, consistent set of sizes — here is how to choose a ratio, name the steps and use them well.',
    cover: 'typography',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-07-07',
    tags: ['Typography', 'UI design'],
    minutes: 7,
    featured: false,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "Open an older design file and count the font sizes. It's common to find 13, 14, 15, 16, 17, 18 and 22 all in use — each chosen on the day because it 'looked right'.\n\nThe result is text that feels slightly inconsistent in ways people can't name, and developers who have to ask which size to use every time. A type scale replaces those one-off choices with a short, deliberate list.",
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'Why a scale helps',
        body: 'Sizes that relate to each other by a consistent ratio feel harmonious, and the gaps between them are large enough to be noticeable. Fewer sizes also means faster decisions, easier handover and a codebase that matches the design.',
      },
      { type: 'heading', text: 'Step 1: fix your base size' },
      {
        type: 'text',
        body: "Start with body text, because that's what people read most. For most web and app interfaces, 16px is a sensible default: it's readable on phones and matches the browser default. Dense data tools sometimes use 14px for tables, but keep long-form reading at 16px or above.",
      },
      { type: 'heading', text: 'Step 2: choose a ratio' },
      {
        type: 'text',
        body: "Multiply the base by a ratio to get each step up, and divide to get steps down. A smaller ratio such as **1.2** gives gentle steps that suit dense product UI like a SaaS settings page. A larger ratio such as **1.333** or **1.5** gives dramatic jumps that suit marketing pages and editorial layouts.\n\nWith a 16px base and a 1.25 ratio you get roughly 16, 20, 25, 31 and 39. Round to whole pixels — nobody benefits from 31.25px.",
      },
      {
        type: 'interactive',
        widget: 'type-scale',
        caption: 'Change the base size and ratio to compare a compact product scale with an expressive marketing one.',
      },
      {
        type: 'example',
        title: 'Naming sizes by role, not by number',
        body: 'Names describe what a size is for, which makes it clear when to use it and easier to adjust later without renaming everything.',
        before: 'Text styles called "16", "20", "24-bold" and "Header copy final".',
        after: 'Text styles called body, body-small, title-small, title, headline and display — each with a fixed size, weight and line height.',
      },
      {
        type: 'illustration',
        name: 'typography',
        caption: 'A handful of sizes, each tied to a role, covers almost every screen.',
      },
      {
        type: 'doDont',
        do: [
          'Pair each size with a line height — looser for body text, tighter for large headings.',
          'Limit yourself to around five to seven sizes for a product UI.',
          'Check the largest sizes on a small phone screen before committing.',
        ],
        dont: [
          'Introduce a new size to fix one awkward layout — change the layout instead.',
          'Use size alone for hierarchy when weight or colour would do.',
          'Set body text in light weights at small sizes; it quickly becomes hard to read.',
        ],
      },
      {
        type: 'qa',
        title: 'Common questions',
        items: [
          {
            question: 'Do I need different scales for mobile and desktop?',
            answer:
              'Often the body size stays the same and only the largest display sizes shrink on small screens. Many teams keep one scale and define a reduced version of the top two or three steps for mobile.',
          },
          {
            question: 'Which ratio is correct?',
            answer:
              'There is no correct ratio. Pick one that suits the density of your product, try it on real screens, and adjust once. Consistency matters more than the exact number.',
            tip: 'Test with real content — a long product name or a German translation will expose problems a placeholder will not.',
          },
        ],
      },
      {
        type: 'checklist',
        title: 'Type scale checklist',
        items: [
          'Body text is at least 16px for reading-heavy screens.',
          'Every size comes from the scale — no one-off values.',
          'Each text style has a role-based name, size, weight and line height.',
          'Large headings have been checked on a narrow phone.',
          'Developers have the same names in code.',
        ],
      },
    ],
  },
  {
    id: 'blog-microcopy-that-helps',
    slug: 'microcopy-that-helps',
    title: 'Microcopy that actually helps: buttons, errors and empty states',
    excerpt:
      "The smallest words in your interface do the most work. Practical patterns for button labels, error messages and empty states that tell people what's happening and what to do.",
    cover: 'wireframe',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-06-30',
    tags: ['UX writing', 'UX'],
    minutes: 8,
    featured: false,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "Microcopy is the short text inside an interface: button labels, error messages, hints, empty screens. It's often written last, by whoever happens to be in the file, and it shows.\n\nYet these words are exactly where people make decisions and get stuck. A clear label can prevent a support ticket; a vague error can end a checkout. This article covers three places where better words make an immediate difference.",
      },
      { type: 'heading', text: 'Buttons: say what will happen' },
      {
        type: 'text',
        body: "A button label should describe the result of pressing it. Generic verbs like 'Submit', 'OK' or 'Continue' make people read the surrounding content to work out what they're agreeing to.\n\nA useful test: could someone understand the button if it were the only thing they read on the screen? 'Pay £24.50' passes. 'Confirm' doesn't.",
      },
      {
        type: 'example',
        title: 'A destructive confirmation dialog',
        body: 'Specific labels let people act confidently and reduce the chance of deleting the wrong thing.',
        before: "Title: 'Are you sure?' Buttons: 'Cancel' and 'OK'.",
        after: "Title: 'Delete the \"Q3 budget\" project?' Body: 'Its 12 files will be removed for everyone.' Buttons: 'Keep project' and 'Delete project'.",
      },
      { type: 'heading', text: 'Errors: what happened and how to fix it' },
      {
        type: 'text',
        body: "A good error message answers two questions in plain language: what went wrong, and what can I do now? It sits next to the thing that needs fixing, and it never blames the person.\n\nAvoid technical codes as the main message. 'Error 402' means nothing to someone trying to order dinner; 'Your card was declined. Try another card or contact your bank.' gives them a next step.",
      },
      {
        type: 'doDont',
        do: [
          "Be specific: 'Enter a UK postcode, like SW1A 1AA'.",
          'Place the message beside the field it refers to.',
          'Keep what the person already typed so they can correct it.',
        ],
        dont: [
          "Use 'Invalid input' or 'Something went wrong' on its own.",
          "Blame the user: 'You entered a wrong date'.",
          'Show errors while someone is still typing their first attempt.',
        ],
      },
      { type: 'heading', text: 'Empty states: a starting point, not a dead end' },
      {
        type: 'text',
        body: "An empty state appears when there's nothing to show yet: a new account, no search results, a cleared inbox. Too often it's just the words 'No data'.\n\nA helpful empty state explains why the space is empty and offers the next action. In a SaaS invoicing tool, a new user's invoice list might say 'No invoices yet. Create your first invoice to see it here' with a 'Create invoice' button.",
      },
      {
        type: 'illustration',
        name: 'wireframe',
        caption: 'Write real words into your wireframes early — placeholder text hides the hardest decisions.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Design with real copy',
        body: "Lorem ipsum hides problems. A button that reads 'Button' will always fit; 'Add to basket and continue' might not. Draft real microcopy in your wireframes, even if it changes later.",
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Be careful with jokes',
        body: "A playful tone can work on a success screen, but it grates when someone's payment has just failed or their data didn't save. Match the tone to the person's likely mood in that moment.",
      },
      {
        type: 'checklist',
        title: 'Microcopy review checklist',
        items: [
          'Every button label describes its result.',
          'Error messages say what happened and what to do next.',
          'Errors appear next to the relevant field and keep the input.',
          'Empty states explain why and offer a next action.',
          'The same thing is called the same name everywhere.',
          'The tone suits the moment, especially for failures.',
        ],
      },
    ],
  },
  {
    id: 'blog-designing-forms-people-finish',
    slug: 'designing-forms-people-finish',
    title: 'Designing forms people actually finish',
    excerpt:
      'Forms are where sign-ups, checkouts and applications succeed or stall. Here is how to cut fields, label clearly, validate kindly and design for thumbs.',
    cover: 'mobile',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-06-23',
    tags: ['Forms', 'UX'],
    minutes: 9,
    featured: false,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "Almost every product's most important moment is a form: creating an account, checking out, applying for a loan, booking a table. Nobody wants to fill in a form — they want what's on the other side of it.\n\nThat's the mindset to design with. Every field, rule and screen is a small cost you're asking someone to pay. Your job is to keep that cost as low as possible and make it feel fair.",
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'Why forms deserve extra care',
        body: "Forms usually sit right before value is delivered. When someone abandons a checkout or a sign-up, the business loses that moment and the person leaves frustrated. Small improvements here tend to matter more than polish elsewhere.",
      },
      { type: 'heading', text: 'Ask for less' },
      {
        type: 'text',
        body: "For every field, ask: what happens if we don't collect this now? Often the honest answer is 'nothing'. A food delivery sign-up doesn't need a date of birth before the first order; a newsletter doesn't need a phone number.\n\nWhere you can, derive information instead of asking for it. A postcode lookup can fill in most of an address; a card number reveals the card type, so you don't need a separate dropdown.",
      },
      { type: 'heading', text: 'Label and lay out for clarity' },
      {
        type: 'list',
        items: [
          '**Visible labels above fields** — placeholder text disappears as soon as someone types, leaving them to remember what the field was for.',
          '**One column** — a single column gives a clear path from top to bottom; side-by-side fields are easy to skip.',
          "**Mark the exception** — if most fields are required, label the optional ones '(optional)' rather than scattering asterisks.",
          '**Group related fields** — delivery address, then payment, with a clear heading for each.',
        ],
      },
      {
        type: 'example',
        title: 'A checkout address section',
        body: 'The improved version asks for less, keeps labels visible and helps people type.',
        before:
          "Two-column layout with placeholders only: 'First name', 'Last name', 'Address line 1', 'Address line 2', 'City', 'County', 'Postcode', 'Country' dropdown listing every country alphabetically.",
        after:
          "One column with visible labels: 'Full name', then 'Postcode' with a 'Find address' lookup and a 'Enter address manually' link. Country defaults to the most likely option and can be changed.",
      },
      {
        type: 'illustration',
        name: 'mobile',
        caption: 'On a phone, one column, large touch targets and the right keyboard make a form feel shorter.',
      },
      { type: 'heading', text: 'Design for thumbs and keyboards' },
      {
        type: 'doDont',
        do: [
          'Set input types so phones show the right keyboard — numeric for card numbers, email for email.',
          'Support autofill for names, addresses and payment details.',
          'Validate a field when someone leaves it, not on every keystroke.',
          'Keep the primary button reachable and clearly labelled, e.g. "Pay £32.00".',
        ],
        dont: [
          'Split a phone number or sort code across several boxes that fight autofill.',
          'Clear the whole form when one field has an error.',
          'Disable the submit button without explaining what is missing.',
          'Block pasting into password or confirmation fields.',
        ],
      },
      {
        type: 'interactive',
        widget: 'button-states',
        caption: 'Check your submit button has clear default, hover, focus, loading and disabled states.',
      },
      {
        type: 'qa',
        title: 'Questions I often get',
        items: [
          {
            question: 'Is a multi-step form better than one long page?',
            answer:
              'It depends on the content. Steps help when sections are distinct (delivery, then payment) and you show progress. For five short fields, a single page is simpler.',
          },
          {
            question: 'Should I use inline validation?',
            answer:
              'Yes, but time it well. Checking a field after someone leaves it is helpful; flagging an email as invalid after the first character feels like being told off.',
          },
        ],
      },
      {
        type: 'checklist',
        title: 'Form review checklist',
        items: [
          'Every field has a reason to exist right now.',
          'Labels are visible above fields, not only placeholders.',
          'The layout is one column with clear groups.',
          'Mobile keyboards and autofill work for each field.',
          'Errors are specific, placed beside the field and keep input.',
          'The submit button says what will happen.',
        ],
      },
    ],
  },
  {
    id: 'blog-dashboard-design-start-with-questions',
    slug: 'dashboard-design-start-with-questions',
    title: 'Dashboard design: start with the questions, not the charts',
    excerpt:
      "Most dashboards fail because they show what data exists, not what people need to decide. Start from the questions your users ask, then choose the charts.",
    cover: 'dashboard',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-06-16',
    tags: ['Dashboards', 'Intermediate'],
    minutes: 9,
    featured: false,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "The typical dashboard brief is 'show all the key metrics'. The typical result is a wall of tiles and charts that looks impressive in a review and gets ignored within a month.\n\nThe problem is the starting point. When you start from available data, you design a catalogue. When you start from the questions people need answered, you design a tool.",
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'Why questions first',
        body: 'A dashboard exists to support decisions. If you know the decision, you know which number matters, what it should be compared against, and how quickly someone needs to notice a change. Without the question, every metric looks equally important.',
      },
      { type: 'heading', text: 'Step 1: collect real questions' },
      {
        type: 'text',
        body: "Talk to the people who will use it and ask what they check, how often, and what they do next. For a restaurant owner using a food delivery partner portal, the questions might be: 'Are orders up or down compared with last week?', 'Which dishes are selling out?' and 'Are we getting slower at preparing orders at peak times?'\n\nWrite each question down verbatim. Then note the action it leads to — if a question doesn't lead to any action, it probably belongs in a report, not on the dashboard.",
      },
      { type: 'heading', text: 'Step 2: rank and lay out by question' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Put the question checked most often, or with the most urgent consequence, at the top left.',
          'Give each important number a comparison — against last week, a target or a normal range. A number on its own rarely tells you whether to act.',
          'Group related questions together so the layout reads like a short story.',
          'Move detail and rarely used breakdowns behind a click.',
        ],
      },
      {
        type: 'example',
        title: 'A SaaS subscription dashboard',
        body: "The finance lead's key question is 'Are we keeping the customers we win?'. The redesign answers that first.",
        before:
          'Twelve equally sized tiles: total users, page views, sessions, sign-ups, revenue, churn, NPS, tickets and more, followed by six line charts with default colours and no targets.',
        after:
          'A top row with three numbers — monthly recurring revenue, new customers and cancelled customers — each compared with last month. Beneath, one chart of cancellations by plan, with the rest available on a detail page.',
      },
      {
        type: 'illustration',
        name: 'dashboard',
        caption: 'Lead with the numbers that answer the most frequent question, each with a comparison.',
      },
      { type: 'heading', text: 'Step 3: then choose the chart' },
      {
        type: 'doDont',
        do: [
          'Use a line chart for change over time and a bar chart for comparing categories.',
          'Use a plain number with a comparison when one value answers the question.',
          'Label axes and units, and show the time period clearly.',
          'Use colour to highlight what needs attention, not to decorate every series.',
        ],
        dont: [
          'Use a pie chart with eight slices that people cannot compare.',
          'Show a number without saying whether higher is good or bad.',
          'Add a chart because the data exists rather than because someone asked.',
        ],
      },
      {
        type: 'interactive',
        widget: 'grid-playground',
        caption: 'Try laying out a top row of key numbers and a wider chart area on a 12-column grid.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Design for the awkward data',
        body: 'Mock-ups usually use tidy numbers. Check your layout with zero values, very large numbers, missing data and a brand-new account with no history. Those are the states people actually see on day one.',
      },
      {
        type: 'checklist',
        title: 'Dashboard checklist',
        items: [
          'Each section maps to a real question from a real user.',
          'Each question leads to an action someone can take.',
          'Key numbers have a comparison and a clear direction of good.',
          'Chart types match the question (trend, comparison, part of whole).',
          'Empty, loading and error states are designed.',
        ],
      },
    ],
  },
  {
    id: 'blog-usability-test-in-an-afternoon',
    slug: 'usability-test-in-an-afternoon',
    title: 'Run a useful usability test in an afternoon',
    excerpt:
      "You don't need a lab or a big budget to learn from users. A practical plan for running a small usability test in an afternoon, from tasks to findings.",
    cover: 'usability-test',
    coverImage: '',
    author: 'Harikrishna',
    date: '2026-06-02',
    tags: ['Research', 'UX'],
    minutes: 8,
    featured: false,
    published: true,
    blocks: [
      {
        type: 'text',
        body: "Usability testing sounds formal, so many designers put it off until 'there's time'. There rarely is.\n\nThe good news is that a small, informal test is still valuable. Watching a handful of people try to use your design will reveal the biggest problems — the ones you can no longer see because you know the design too well. You can plan, run and summarise one in an afternoon.",
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'Why watch rather than ask',
        body: "People are poor at predicting their own behaviour. Ask 'Would you use this?' and most will politely say yes. Watch them try to complete a task, and you'll see exactly where they hesitate, misread or give up.",
      },
      { type: 'heading', text: 'Before: write tasks, not questions' },
      {
        type: 'text',
        body: "Pick the two or three most important things people must be able to do, and write each as a realistic scenario. Don't mention the names of buttons or menus, or you'll be testing whether people can follow instructions rather than whether the design makes sense.",
      },
      {
        type: 'example',
        title: 'Writing a task for a banking app',
        body: 'The improved task gives a goal and context without pointing at the interface.',
        before: "Click 'Payments', then 'New payee', and add a new payee.",
        after:
          'Your friend paid for your concert ticket last night. You owe them £45. Using this app, pay them back. Their details are on this card.',
      },
      { type: 'heading', text: 'The afternoon plan' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Recruit** — find four or five people who roughly match your users. Colleagues outside the project, friends of friends or existing customers can all work, as long as they are not designers on the team.',
          '**Prepare** — a clickable prototype, your tasks printed or in a doc, and a way to take notes or record (with permission).',
          '**Run** — about 20–30 minutes each. Introduce the session, explain you are testing the design not them, and ask them to think aloud.',
          '**Debrief** — straight after the last session, list every problem you saw and how many people hit it.',
        ],
      },
      {
        type: 'illustration',
        name: 'usability-test',
        caption: 'One facilitator, one participant, one note-taker if you can — and a prototype that covers the tasks.',
      },
      {
        type: 'doDont',
        do: [
          "Say 'There are no wrong answers — we're testing the design, not you'.",
          "Ask neutral follow-ups: 'What are you looking for?' or 'What did you expect to happen?'",
          'Stay quiet when they struggle — the struggle is the finding.',
          'Note what people do, not just what they say.',
        ],
        dont: [
          "Explain the design or rescue them the moment they hesitate.",
          "Ask leading questions like 'Was that easy?'",
          'Test with people who helped design it.',
          'Treat one participant\'s opinion about colours as a finding.',
        ],
      },
      {
        type: 'qa',
        title: 'Common worries',
        items: [
          {
            question: 'Is five people really enough?',
            answer:
              "For finding the most obvious usability problems in one flow, a small group is usually enough to see repeated issues. It won't tell you what percentage of all users will struggle — that needs a different kind of study. Test small, fix, and test again.",
          },
          {
            question: 'What if the prototype is unfinished?',
            answer:
              'That is fine as long as it covers the tasks. Rough prototypes often make people more willing to be honest, because it is clearly still changing.',
            tip: 'Check every tap path in the prototype yourself before the first session — a broken link wastes the participant\'s time.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Report findings, not opinions',
        body: "Write each finding as an observation plus its impact: '3 of 5 participants looked for the payee option under Account, not Payments, and two gave up.' Then suggest a change. This keeps the conversation about evidence rather than taste.",
      },
      {
        type: 'checklist',
        title: 'Usability test checklist',
        items: [
          'Two or three realistic tasks, written without interface words.',
          'Four or five participants who are not on the design team.',
          'A prototype that supports every task path.',
          'Consent to record or take notes.',
          'A debrief listing each problem and how many people hit it.',
          'Agreed changes and a plan to test again.',
        ],
      },
    ],
  },
]
