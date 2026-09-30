import type { Course, Module } from '../types'

/** Shared lesson metadata for this course. */
const L = { published: true, addedAt: '2026-09-01' } as const

/* ------------------------------------------------------------------ */
/* Module 1 — UI/UX Fundamentals                                       */
/* ------------------------------------------------------------------ */

const m1Fundamentals: Module = {
  id: 'b-m1-fundamentals',
  title: 'UI/UX Fundamentals',
  stage: 'Foundation',
  summary: "The core ideas and vocabulary every designer uses: what UI, UX and product design are, how designers think, and the visual basics.",
  outcome: "You'll be able to explain what designers do, follow a design process, and judge a screen's hierarchy, layout, type, colour and accessibility.",
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'b1-what-is-ui',
      title: 'What is UI?',
      summary: "UI is everything you see and touch on a screen — the buttons, text, colours and layout that let people use a product.",
      minutes: 8,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**UI** stands for **user interface**. It is the part of a product people actually see and interact with: buttons, icons, text, input fields, menus, colours, images and the way they are arranged on a screen.\n\nIf you open a food delivery app, the UI is the search bar at the top, the restaurant cards, the price labels and the big 'Add to basket' button. It is the surface between a person and the system underneath.",
        },
        {
          type: 'list',
          items: [
            "**Visual elements** — colour, typography, icons, imagery.",
            "**Interactive elements** — buttons, links, toggles, sliders, forms.",
            "**Layout** — where things sit on the screen and how they are grouped.",
            "**States** — how elements look when hovered, pressed, disabled, loading or in error.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          title: 'Why UI matters',
          body: "People judge a product within seconds by how it looks and feels. A clear UI tells users what they can do and what will happen next. A confusing UI makes even a useful product feel broken.",
        },
        {
          type: 'quiz',
          question: 'Which of these is part of the UI?',
          options: [
            'The database that stores orders',
            "The colour and label of the 'Pay now' button",
            'The company pricing strategy',
            'The server that sends notifications',
          ],
          answer: 1,
          explanation: "The button is something the user sees and presses, so it is UI. The others happen behind the scenes or are business decisions.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A banking app balance screen',
          body: "Two versions of the same screen show the same data. The difference is entirely in the UI: size, grouping and labelling.",
          before: "Balance shown in small grey text next to five equally sized buttons with icons but no labels.",
          after: "Balance shown large at the top, with three clearly labelled buttons underneath: 'Send', 'Request', 'Top up'.",
        },
      ],
      practice: {
        task: "Take a screenshot of the home screen of an app you use every day and label its UI elements.",
        steps: [
          "Take a screenshot and open it in any tool (Figma, Keynote, or print it).",
          "Circle every interactive element — anything you can tap or type into.",
          "Mark the visual elements: headings, icons, images, colours.",
          "Write one sentence about which element your eye goes to first and why.",
        ],
        deliverable: "An annotated screenshot with at least eight UI elements labelled.",
      },
      challenge: {
        task: "Compare the home screens of two competing apps (for example two food delivery apps) and describe how their UIs differ.",
        successCriteria: [
          "Lists at least three concrete UI differences (layout, colour, type, buttons).",
          "Says which one makes the main action easier to find, with a reason.",
          "Uses correct UI vocabulary from this lesson.",
        ],
      },
    },
    {
      id: 'b1-what-is-ux',
      title: 'What is UX?',
      summary: "UX is the whole experience a person has while trying to get something done with your product — not just the screens.",
      minutes: 9,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**UX** stands for **user experience**. It describes how it *feels* to use a product from start to finish: is it easy, fast, clear and trustworthy, or confusing and frustrating?\n\nUX includes things you cannot see on one screen: how many steps it takes to book a train ticket, whether error messages help you recover, whether the confirmation email arrives, and whether you trust the app with your card details.",
        },
        {
          type: 'list',
          items: [
            "**Useful** — does it solve a real problem?",
            "**Usable** — can people complete the task without help?",
            "**Findable** — can people locate what they need?",
            "**Accessible** — can people with different abilities use it?",
            "**Trustworthy** — do people feel safe using it?",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "A product can look beautiful and still have terrible UX. If a checkout asks you to create an account before you can pay, many people simply leave. UX work finds and removes those moments of friction.",
        },
        {
          type: 'doDont',
          do: [
            "Think about the full task, from first visit to finished goal.",
            "Ask real users what they are trying to achieve.",
            "Consider what happens when things go wrong.",
          ],
          dont: [
            "Assume UX only means 'making screens'.",
            "Design for yourself and assume everyone thinks like you.",
            "Ignore the steps that happen outside the app, like emails or deliveries.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Guest checkout on an online shop',
          body: "The UI can be identical, but the experience changes completely depending on the flow.",
          before: "User must create an account, confirm their email, then return to their basket to pay.",
          after: "User can pay as a guest and is offered 'Save your details for next time' after the order is confirmed.",
        },
      ],
      practice: {
        task: "Map your experience of a recent task you completed with an app, like ordering food or booking a taxi.",
        steps: [
          "Write down every step you took, from opening the app to finishing.",
          "Next to each step, note how you felt: easy, neutral or annoying.",
          "Circle the most frustrating moment.",
          "Write one idea that would remove that frustration.",
        ],
        deliverable: "A step-by-step list of the task with feelings marked and one improvement idea.",
      },
      challenge: {
        task: "Find a product with a great UI but a poor experience (or the other way round) and explain the gap.",
        successCriteria: [
          "Names the product and the specific task.",
          "Separates what is a UI issue from what is a UX issue.",
          "Suggests one change that would improve the experience, not just the looks.",
        ],
      },
    },
    {
      id: 'b1-ui-vs-ux',
      title: 'UI vs UX',
      summary: "UI is how it looks and responds; UX is how well it works for the person. You need both, and they overlap constantly.",
      minutes: 8,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A simple way to remember the difference: **UX decides what should happen and in what order; UI decides how it looks and feels on screen.**\n\nImagine a door. UX asks: does this door need to exist, where should it be, and which way should it open? UI asks: what shape is the handle, what colour is the door, is the 'Push' sign easy to read?",
        },
        {
          type: 'doDont',
          do: [
            "UX: work out the steps in a sign-up flow.",
            "UX: decide which information a user needs first.",
            "UI: choose the button style and colour.",
            "UI: set type sizes so headings stand out.",
          ],
          dont: [
            "Treat them as rival jobs — they are two sides of one product.",
            "Polish the UI before you know the flow works.",
            "Believe good UX can survive an unreadable UI.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "In real teams the line is blurry. A button label ('Continue' vs 'Pay £24.50') is both a UX decision (clarity) and a UI decision (length, placement). Don't worry about drawing a perfect line — worry about the user.",
        },
        {
          type: 'quiz',
          question: "A designer removes two unnecessary steps from a password reset flow. Is that mostly UI or UX work?",
          options: ['Mostly UI', 'Mostly UX', 'Neither', 'Only branding'],
          answer: 1,
          explanation: "Changing the steps and flow is about how the task works for the person, which is UX. The screens may look the same.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Same problem, two fixes',
          body: "Users keep missing the 'Apply discount code' option on a checkout. A UX fix moves the field to the step where people expect it. A UI fix makes the link more visible. The best result often needs both.",
          before: "Small grey link 'Have a code?' hidden below the payment button.",
          after: "Clearly labelled 'Discount code' field shown in the order summary, above the total.",
        },
      ],
      practice: {
        task: "Sort a list of design decisions into UI, UX or both.",
        steps: [
          "Write down ten decisions from an app you use (e.g. 'the search bar is at the top', 'the logo is purple').",
          "Label each one UI, UX or Both.",
          "For every 'Both', write one sentence explaining why.",
        ],
        deliverable: "A table of ten decisions, each tagged UI, UX or Both with a short reason.",
      },
      challenge: {
        task: "Pick one annoying screen and propose one UX fix and one UI fix for the same problem.",
        successCriteria: [
          "The problem is described from the user's point of view.",
          "The UX fix changes the flow, content or structure.",
          "The UI fix changes the visual presentation.",
          "Explains which fix would help more and why.",
        ],
      },
    },
    {
      id: 'b1-what-is-product-design',
      title: 'What is Product Design?',
      summary: "Product design combines UX, UI and business thinking to shape a product that solves real problems and works for the company.",
      minutes: 9,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Product design** is the work of deciding what a digital product should do, for whom, and how it should work and look — while keeping the business goals and technical limits in mind.\n\nA product designer doesn't just ask 'what should this screen look like?' but 'should we build this at all, and how will we know it worked?'",
        },
        {
          type: 'list',
          items: [
            "**Users** — what problem do people have, and how painful is it?",
            "**Business** — how does solving it help the company (sign-ups, retention, fewer support calls)?",
            "**Technology** — what can the engineers realistically build and maintain?",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Most products fail not because they look bad, but because they solve the wrong problem. Product design keeps the team focused on outcomes (did people's lives get easier?) rather than output (did we ship screens?).",
        },
        {
          type: 'text',
          body: "Product designers work closely with **product managers** (who own priorities) and **engineers** (who build). Being able to explain your decisions in plain language to both is part of the job.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A food delivery app wants more repeat orders',
          body: "A UI-only answer would be 'make the menu prettier'. A product design answer starts by learning why people don't reorder, then designs a solution that serves both users and the business.",
          before: "Redesign the restaurant page with new colours and bigger photos.",
          after: "Interview customers, discover they struggle to find past orders, and add a 'Reorder' shortcut on the home screen.",
        },
      ],
      practice: {
        task: "Pick a feature you use in an app and describe it from all three angles: user, business and technology.",
        steps: [
          "Choose a feature (e.g. 'Save for later' in a shopping app).",
          "Write what problem it solves for the user.",
          "Write how it might help the business.",
          "Guess one technical challenge it might involve.",
        ],
        deliverable: "A short note with three paragraphs: user, business, technology.",
      },
      challenge: {
        task: "Propose a small new feature for an app you use and justify it like a product designer.",
        successCriteria: [
          "States the user problem clearly without describing the solution first.",
          "Explains a plausible business benefit without inventing numbers.",
          "Describes how you would check whether it worked.",
        ],
      },
    },
    {
      id: 'b1-designer-roles',
      title: 'Product Designer vs UI Designer vs UX Designer',
      summary: "Job titles overlap a lot. Learn what each role usually focuses on so you can read job adverts and choose your path.",
      minutes: 9,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Companies use design job titles differently, so always read the responsibilities, not just the title. That said, there are common patterns.",
        },
        {
          type: 'list',
          items: [
            "**UX Designer** — focuses on research, flows, information architecture, wireframes and usability testing. Asks 'does this work for people?'",
            "**UI Designer** — focuses on visual design: layout, typography, colour, components, polish and consistency. Asks 'is this clear, consistent and attractive?'",
            "**Product Designer** — covers both, plus product thinking: defining problems, working with product managers, measuring outcomes. Common title in tech companies and start-ups.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Reading job adverts',
          body: "If an advert lists 'user interviews, journey maps, usability testing', it leans UX. If it lists 'design systems, high-fidelity mock-ups, visual polish', it leans UI. If it mentions 'metrics, roadmap, working with PMs', it's product design.",
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Knowing the differences helps you focus your learning and shape a portfolio that matches the roles you want, instead of trying to be everything at once.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Three designers, one feature',
          body: "A banking app is adding savings goals. The UX designer interviews customers about how they save. The UI designer designs the goal cards, progress bars and colours. The product designer does a bit of both and also defines what success looks like with the product manager.",
        },
      ],
      practice: {
        task: "Read three real design job adverts and classify them.",
        steps: [
          "Search a job board for 'UX designer', 'UI designer' and 'product designer'.",
          "Pick one advert of each.",
          "Highlight the responsibilities and sort them into UX, UI and product.",
          "Note which skills appear in all three.",
        ],
        deliverable: "A short comparison listing each advert's main focus and the shared skills.",
      },
      challenge: {
        task: "Write a one-paragraph statement of which role you are aiming for first and the three skills you'll build next.",
        successCriteria: [
          "Names a specific role and a reason based on your interests.",
          "Lists three concrete skills linked to that role.",
          "Is honest about your current level — no exaggerated claims.",
        ],
      },
    },
    {
      id: 'b1-design-thinking',
      title: 'Design thinking',
      summary: "Design thinking is a way of solving problems by understanding people first, then exploring and testing ideas quickly.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Design thinking** is a problem-solving approach that starts with people rather than with technology or opinions. It is often described in five modes: **Empathise, Define, Ideate, Prototype, Test**.\n\nThese are not strict steps. You loop back whenever you learn something new — a failed test may send you back to defining the problem.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            "**Empathise** — learn about users by watching and listening.",
            "**Define** — write down the real problem you are solving.",
            "**Ideate** — generate many possible solutions before choosing.",
            "**Prototype** — make quick, cheap versions of the best ideas.",
            "**Test** — put them in front of real people and learn.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Teams often jump straight to building the first idea someone has. Design thinking slows the start down a little so you don't waste weeks building the wrong thing.",
        },
        {
          type: 'doDont',
          do: ["Generate lots of ideas before judging them.", "Test rough ideas early.", "Treat surprises as useful information."],
          dont: ["Fall in love with your first idea.", "Wait until everything is perfect to test.", "Skip empathy because 'we already know our users'."],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A gym app with low class bookings',
          body: "Instead of redesigning the booking screen straight away, the team talks to members and learns they don't know which classes suit beginners. They prototype a 'Good for beginners' tag, test it with five members, and refine it.",
          before: "Assumption: the booking button is too small.",
          after: "Insight: members don't know which class to pick, so the team adds beginner-friendly labels.",
        },
      ],
      practice: {
        task: "Run a mini design-thinking loop on a small everyday problem, like finding your keys in the morning.",
        steps: [
          "Empathise: ask one person how they deal with this problem.",
          "Define: write the problem in one sentence.",
          "Ideate: sketch at least six possible solutions in ten minutes.",
          "Prototype and test: make a paper version of one idea and ask for feedback.",
        ],
        deliverable: "A single page showing your problem statement, sketches and feedback notes.",
      },
      challenge: {
        task: "Apply the five modes to a problem in a digital product you use and document what you learned at each stage.",
        successCriteria: [
          "Each of the five modes has at least one concrete output.",
          "Shows at least one moment where you looped back.",
          "The final idea is linked to something a real person said.",
        ],
      },
    },
    {
      id: 'b1-user-centred-design',
      title: 'User-centred design',
      summary: "User-centred design means involving real users throughout the process so decisions are based on evidence, not guesses.",
      minutes: 9,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**User-centred design (UCD)** is the principle of designing *with* and *for* the people who will use a product, at every stage. It is described in the international standard ISO 9241-210.\n\nThe key idea: you are not your user. Your habits, skills and devices are probably different from theirs.",
        },
        {
          type: 'list',
          items: [
            "Understand who the users are and the context they're in (on a busy train? using one hand?).",
            "Base requirements on what users need, not only on what stakeholders want.",
            "Involve users in evaluating designs, early and often.",
            "Iterate — improve the design based on what you learn.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Designers and teams know their product too well. Things that feel obvious to you ('just swipe left!') may be invisible to a first-time user. Involving users catches this before launch, when it's cheap to fix.",
        },
        {
          type: 'callout',
          tone: 'warning',
          body: "User-centred doesn't mean doing whatever users ask for. People are great at describing problems and poor at designing solutions. Listen for the need behind the request.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A parking app used in the rain',
          body: "Designers tested the app at their desks and it worked well. Watching drivers use it in a car park revealed they had wet hands, poor signal and wanted to finish in seconds. The team enlarged tap targets and let people save their car's number plate.",
          before: "Small buttons and a long form that asks for the number plate every time.",
          after: "Large buttons, saved vehicle details and a one-tap 'Park here again' option.",
        },
      ],
      practice: {
        task: "Observe someone using an app for a task you know well and note what surprises you.",
        steps: [
          "Ask a friend or family member to do a simple task (e.g. send money, book a table).",
          "Watch without helping or explaining.",
          "Write down every hesitation, wrong tap or comment.",
          "List three things you would never have guessed on your own.",
        ],
        deliverable: "A short observation note with at least three surprises.",
      },
      challenge: {
        task: "Describe the context of use for an app of your choice: who uses it, where, when and with what constraints.",
        successCriteria: [
          "Describes at least two different types of user.",
          "Includes physical context (device, location, distractions).",
          "Names one design decision that should change because of this context.",
        ],
      },
    },
    {
      id: 'b1-design-process',
      title: 'The design process',
      summary: "A typical design process moves from understanding the problem to shipping and learning, and it loops rather than running in a straight line.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Every company has its own version, but most design processes follow a similar shape. A popular model is the **Double Diamond**: first you *widen* your understanding of the problem, then *narrow* it to a clear definition; then you *widen* again to explore solutions, and *narrow* to the one you ship.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            "**Discover** — research users, the market and the current product.",
            "**Define** — agree the problem and what success looks like.",
            "**Develop** — explore ideas through sketches, wireframes and prototypes.",
            "**Deliver** — test, refine, hand off to engineers and launch.",
            "**Learn** — measure and gather feedback, then start again.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "A process gives you a map. When you feel stuck or a stakeholder asks 'why haven't you designed screens yet?', you can explain where you are and what you need before moving on.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Real projects rarely follow the diagram perfectly. Small fixes may skip straight to Develop; big bets may spend weeks in Discover. Match the effort to the size of the risk.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Redesigning a library booking system',
          body: "Discover: talk to students and librarians. Define: 'Students can't tell which study rooms are free right now.' Develop: sketch a live availability map, test with paper. Deliver: hand over final designs. Learn: check whether students still ask librarians about free rooms.",
        },
      ],
      practice: {
        task: "Plan the design process for a small project, such as a recipe-saving app.",
        steps: [
          "Write one activity you would do in each of the five stages.",
          "Estimate how long each stage might take for a two-week project.",
          "Mark which stage you think is most often skipped and why.",
        ],
        deliverable: "A simple five-column plan showing activities and rough timings.",
      },
      challenge: {
        task: "Find a case study from a design team online and map its steps onto the Double Diamond.",
        successCriteria: [
          "Identifies activities from at least four stages.",
          "Notes where the team looped back.",
          "Points out one stage that was missing or thin and suggests what could have been done.",
        ],
      },
    },
    {
      id: 'b1-visual-hierarchy',
      title: 'Visual hierarchy',
      summary: "Visual hierarchy guides the eye to the most important thing first, using size, weight, colour, position and space.",
      minutes: 12,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Visual hierarchy** is the order in which people notice things on a screen. Good hierarchy means the most important element is seen first, the next most important second, and so on.\n\nPeople scan rather than read. If everything looks equally important, nothing stands out and users have to work harder to find what they need.",
        },
        {
          type: 'list',
          items: [
            "**Size** — bigger things are noticed first.",
            "**Weight** — bold text stands out from regular text.",
            "**Colour and contrast** — a strong colour on a calm background draws attention.",
            "**Position** — the top and left (in left-to-right languages) are usually read first.",
            "**Space** — an element surrounded by white space feels more important.",
          ],
        },
        { type: 'interactive', widget: 'visual-hierarchy', caption: 'Change size, weight and colour to see how the reading order of a card changes.' },
        {
          type: 'callout',
          tone: 'tip',
          title: 'The squint test',
          body: "Squint at your design (or blur it). The shapes that are still visible are what people will notice first. If that isn't your main message or action, adjust the hierarchy.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A product page in an online shop',
          body: "When the name, price and buy button all compete, shoppers hesitate. A clear hierarchy answers their questions in order: what is it, how much is it, how do I buy it?",
          before: "Product name, price, delivery info and 'Add to basket' all in the same 16px regular text and the same grey.",
          after: "Name large and bold, price clearly visible below, one high-contrast 'Add to basket' button, delivery details smaller and lighter.",
        },
      ],
      practice: {
        task: "Redesign a plain event card so the hierarchy is obvious.",
        steps: [
          "Write the content: event name, date, location, price and a 'Get tickets' button.",
          "Decide the order of importance and number each item 1–5.",
          "Use size and weight to show that order, starting with the event name.",
          "Give the button a distinct colour and blur the design to check it.",
        ],
        deliverable: "One event card where a stranger can say what's most important within three seconds.",
      },
      challenge: {
        task: "Find a cluttered screen in a real app and redesign it using only hierarchy — no new content.",
        successCriteria: [
          "The main action is the most noticeable element.",
          "Uses at least three hierarchy tools (size, weight, colour, position, space).",
          "Passes the squint test.",
          "Includes a note explaining the reading order you intended.",
        ],
      },
    },
    {
      id: 'b1-layout',
      title: 'Layout',
      summary: "Layout is how you arrange elements on a screen so content is easy to scan, grouped logically and consistent across pages.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Layout** is the structure of a screen: where content sits, how it's grouped, and how people's eyes move through it. A good layout makes a screen feel calm and predictable.\n\nMost screens are built from a few repeated patterns: a header, a main content area, sometimes a sidebar, and a footer or bottom navigation on mobile.",
        },
        {
          type: 'list',
          items: [
            "**Grouping (proximity)** — related items sit close together; unrelated items sit further apart.",
            "**Reading patterns** — text-heavy pages are often scanned in an F-shape; simple landing pages in a Z-shape.",
            "**Consistency** — similar pages use similar structures, so users don't have to relearn them.",
            "**Priority** — the most important content gets the most prominent area.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "When layout is consistent, users build a mental map. They know the back button is top-left and the main action is at the bottom. Break that pattern and people get lost, even if each screen looks good on its own.",
        },
        {
          type: 'doDont',
          do: ["Group related content into clear sections.", "Keep a consistent structure across similar screens.", "Put the primary action where people expect it."],
          dont: ["Scatter related information across the page.", "Change the navigation position between screens.", "Fill every gap — empty space is part of the layout."],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A recipe page',
          body: "Cooks glance at the screen with messy hands. The layout should let them find ingredients and the current step instantly.",
          before: "Long intro story, ads, ingredients and steps mixed together in one column.",
          after: "Title and photo at the top, ingredients in one clear block, numbered steps in another, with the story moved below.",
        },
      ],
      practice: {
        task: "Sketch three different layouts for a simple profile screen.",
        steps: [
          "List the content: photo, name, bio, stats, 'Edit profile' button, recent posts.",
          "Sketch three different arrangements on paper, each in five minutes.",
          "Circle the groups in each sketch.",
          "Pick the best one and write why.",
        ],
        deliverable: "Three layout sketches with groups marked and a short note on your chosen version.",
      },
      challenge: {
        task: "Design the layout for a mobile and a desktop version of the same news article page.",
        successCriteria: [
          "Both versions keep the same priority of content.",
          "Related content is grouped by proximity.",
          "The desktop version uses the extra width purposefully, not just stretched.",
        ],
      },
    },
    {
      id: 'b1-spacing',
      title: 'Spacing',
      summary: "Spacing is the empty space between and around elements. Used well, it groups content and makes screens feel clear and calm.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Spacing** (often called white space or negative space) is the gap between things. It is not wasted space — it tells people which items belong together and gives the eye room to rest.\n\nThere are two main kinds: **padding** (space inside an element, like inside a button) and **margin or gap** (space between elements).",
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Use a spacing scale',
          body: "Instead of picking random numbers (13px here, 17px there), use a fixed set of values such as 4, 8, 12, 16, 24, 32, 48. Many teams use multiples of 4 or 8. This keeps screens consistent and speeds up decisions.",
        },
        { type: 'interactive', widget: 'spacing-scale', caption: 'Try different spacing values and see how grouping and readability change.' },
        {
          type: 'doDont',
          do: [
            "Use smaller gaps inside a group and larger gaps between groups.",
            "Pick values from one spacing scale.",
            "Give text blocks enough breathing room.",
          ],
          dont: [
            "Use the same gap everywhere — it hides the grouping.",
            "Squeeze content to fit more above the fold.",
            "Eyeball spacing differently on every screen.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A settings list',
          body: "In a settings screen, each label should clearly belong to its toggle, and each section should feel separate.",
          before: "Every row and every section separated by the same 12px gap, so sections blur together.",
          after: "8px between a label and its helper text, 16px between rows, 32px between sections with a section heading.",
        },
      ],
      practice: {
        task: "Fix the spacing of a cramped sign-in form using an 8-point scale.",
        steps: [
          "Create a form with a title, two fields, a 'Forgot password?' link and a button.",
          "Set 8px between each label and its field.",
          "Set 16–24px between field groups.",
          "Set 32px between the title and the form, and check nothing uses an off-scale value.",
        ],
        deliverable: "A sign-in form where every spacing value comes from your scale.",
      },
      challenge: {
        task: "Take a busy screenshot (e.g. a product listing) and redesign it by changing spacing only.",
        successCriteria: [
          "Groups are clearer without adding lines or boxes.",
          "All spacing values come from a documented scale.",
          "A before/after comparison shows the improvement.",
        ],
      },
    },
    {
      id: 'b1-alignment',
      title: 'Alignment',
      summary: "Alignment lines elements up along shared edges so a screen feels organised and is quicker to scan.",
      minutes: 8,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Alignment** means placing elements so their edges or centres line up. Our eyes naturally notice invisible lines, so aligned content looks tidy and intentional, while slightly misaligned content looks careless — even when people can't say why.",
        },
        {
          type: 'list',
          items: [
            "**Left alignment** — the default for most text and forms in left-to-right languages; it creates a strong edge to scan down.",
            "**Centre alignment** — works for short content like a hero heading or an empty state, but is hard to read for long text.",
            "**Right alignment** — useful for numbers in tables so digits line up.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "A consistent left edge lets people scan a form or list in one straight line. Mixed alignments make the eye jump around and slow people down.",
        },
        {
          type: 'doDont',
          do: ["Pick one main alignment edge per section.", "Right-align numbers in tables.", "Align icons with the first line of text they sit beside."],
          dont: ["Centre long paragraphs.", "Mix left, centre and right in the same card.", "Leave elements 1–2px off — it looks like a mistake."],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A checkout form',
          body: "Checkout forms are long, so alignment has a big impact on how fast people can move through them.",
          before: "Labels centred, fields of different widths, button right-aligned.",
          after: "Labels and fields share one left edge, fields are the same width, and the button spans the form width.",
        },
      ],
      practice: {
        task: "Audit the alignment of an app screen by drawing its alignment lines.",
        steps: [
          "Screenshot a screen from any app.",
          "Draw vertical lines along every left edge you can find.",
          "Count how many different edges there are.",
          "Redraw the layout using as few edges as possible.",
        ],
        deliverable: "An annotated screenshot and a simplified version with fewer alignment edges.",
      },
      challenge: {
        task: "Design a payment receipt screen with at least eight pieces of information that all align cleanly.",
        successCriteria: [
          "Uses no more than two or three alignment edges.",
          "Amounts are right-aligned so they are easy to compare.",
          "Nothing is off by a pixel or two.",
        ],
      },
    },
    {
      id: 'b1-typography-basics',
      title: 'Typography basics',
      summary: "Learn the essentials of type on screen: typefaces, size, weight, line height and line length, so text is easy to read.",
      minutes: 12,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Most of what users see on a screen is text, so **typography** — how text is styled and arranged — has a huge effect on usability.\n\nA **typeface** is the design (e.g. Inter, Roboto); a **font** is a specific version of it (Inter Bold 16px). Beginners should start with one well-made, readable sans-serif typeface and create contrast with size and weight.",
        },
        {
          type: 'list',
          items: [
            "**Size** — body text on screens is commonly 16px; smaller text is harder to read on mobile.",
            "**Weight** — use Regular for body text and Semibold or Bold for headings and emphasis.",
            "**Line height** — around 1.4–1.6× the font size for body text gives lines room to breathe.",
            "**Line length** — roughly 45–75 characters per line is comfortable to read.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Readable type means people understand your content faster and make fewer mistakes. Tiny, light grey text may look elegant in a mock-up but is hard to read in sunlight or for people with low vision.",
        },
        {
          type: 'doDont',
          do: ["Use one typeface family to begin with.", "Create hierarchy with size and weight.", "Keep body text at a readable size."],
          dont: ["Mix three or four typefaces on one screen.", "Use all caps for long text.", "Stretch lines of text across a wide desktop screen."],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A news article on mobile',
          body: "Articles are read for minutes at a time, so small typographic choices add up.",
          before: "13px light grey text, tight 1.1 line height, headline only slightly bigger than body.",
          after: "16px dark text, 1.5 line height, headline clearly larger and bold, subheadings to break up sections.",
        },
      ],
      practice: {
        task: "Style a short article in Figma or any editor using only one typeface.",
        steps: [
          "Paste a headline, a subheading and three paragraphs.",
          "Set body text to 16px with about 1.5 line height.",
          "Make the headline noticeably bigger and bolder than the subheading.",
          "Limit the text width so lines are roughly 60–70 characters.",
        ],
        deliverable: "A styled article that is comfortable to read on a phone-sized frame.",
      },
      challenge: {
        task: "Find a hard-to-read web page and restyle a section of it, explaining each typographic change.",
        successCriteria: [
          "Addresses size, weight, line height and line length.",
          "Uses one typeface or at most two.",
          "Each change is justified in one sentence.",
        ],
      },
    },
    {
      id: 'b1-colour-basics',
      title: 'Colour basics',
      summary: "Colour sets mood, shows meaning and draws attention. Learn how to use a small palette with purpose rather than decoration.",
      minutes: 11,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Colour in UI has three main jobs: **identity** (it feels like the brand), **meaning** (red for errors, green for success) and **attention** (the main button stands out).\n\nA useful beginner model is **hue** (the colour itself, e.g. blue), **saturation** (how vivid it is) and **lightness** (how light or dark it is).",
        },
        {
          type: 'list',
          items: [
            "**Neutrals** — greys for text, backgrounds and borders; they make up most of a UI.",
            "**Primary colour** — your brand or action colour, used sparingly for key actions and highlights.",
            "**Semantic colours** — success, warning, error and information.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Start with fewer colours',
          body: "A common guideline is the 60-30-10 idea: mostly neutral, some secondary, a little accent. If everything is colourful, the important things stop standing out.",
        },
        {
          type: 'callout',
          tone: 'warning',
          body: "Never use colour as the only way to show meaning. Around one in twelve men has some form of colour vision deficiency, so pair colour with text or icons — e.g. a red border *and* an error message.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A task management app',
          body: "Colour should help people spot what needs attention, not decorate every element.",
          before: "Every project in a different bright colour, the primary button the same blue as the links and tags.",
          after: "Neutral interface, one blue reserved for primary actions, red only for overdue tasks with an 'Overdue' label.",
        },
      ],
      practice: {
        task: "Create a small UI palette for a fictional coffee shop app.",
        steps: [
          "Choose one primary colour that fits the brand.",
          "Pick four or five neutrals from near-white to near-black.",
          "Add semantic colours for success, warning and error.",
          "Apply the palette to one screen and check the primary colour is used only for key actions.",
        ],
        deliverable: "A palette of around ten swatches and one screen that uses it.",
      },
      challenge: {
        task: "Redesign a colourful, noisy screen using mostly neutrals and one accent colour.",
        successCriteria: [
          "Most of the screen uses neutrals.",
          "The accent colour highlights the most important action.",
          "Any meaning shown by colour is also shown by text or an icon.",
        ],
      },
    },
    {
      id: 'b1-contrast',
      title: 'Contrast',
      summary: "Contrast is the difference between elements, especially text and its background, and it decides whether people can read your UI.",
      minutes: 11,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Contrast** is how different two things look from each other. In UI it creates hierarchy (a bold heading contrasts with body text) and, most importantly, it makes text readable.\n\nColour contrast is measured as a **contrast ratio** from 1:1 (no difference) to 21:1 (black on white). The Web Content Accessibility Guidelines (WCAG) set minimums.",
        },
        {
          type: 'list',
          items: [
            "**4.5:1** — minimum for normal body text (WCAG AA).",
            "**3:1** — minimum for large text (roughly 24px regular or 18.66px bold and above).",
            "**3:1** — minimum for important UI parts like input borders and icons.",
          ],
        },
        { type: 'interactive', widget: 'contrast-checker', caption: 'Pick a text and background colour and see whether they pass WCAG.' },
        {
          type: 'callout',
          tone: 'why',
          body: "Low contrast affects everyone: people with low vision, older users, and anyone reading on a phone outside on a sunny day. Light grey placeholder text is one of the most common failures.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A sign-up form',
          body: "Placeholder and helper text are often made very light to look subtle, which makes them hard to read.",
          before: "Light grey (#BBBBBB) helper text on white — roughly 1.9:1, fails.",
          after: "Mid-dark grey (#595959) helper text on white — about 7:1, passes AA for body text.",
        },
        { type: 'link', url: 'https://www.w3.org/WAI/WCAG22/quickref/', title: 'WCAG 2.2 Quick Reference', description: 'The official list of accessibility success criteria, including contrast.' },
      ],
      practice: {
        task: "Check the contrast of every text colour in a design you've made.",
        steps: [
          "List every text and background colour combination on your screen.",
          "Check each one with the contrast checker.",
          "Mark which pass 4.5:1 (body) or 3:1 (large text).",
          "Adjust the failing colours until they pass.",
        ],
        deliverable: "A table of colour pairs with their ratios, all passing.",
      },
      challenge: {
        task: "Create a button in your brand colour that passes contrast for its label, in both a default and a disabled-looking style.",
        successCriteria: [
          "The default button label passes 4.5:1.",
          "The button stands out from the page background by at least 3:1.",
          "The disabled style is clearly different but is not the only clue that it's unavailable.",
        ],
      },
    },
    {
      id: 'b1-accessibility-basics',
      title: 'Accessibility basics',
      summary: "Accessibility means designing so people with different abilities can use your product. It's a core design responsibility, not an extra.",
      minutes: 12,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Accessibility** (often written *a11y*) is about making products usable by as many people as possible, including people who are blind or have low vision, are deaf, have motor impairments, or have cognitive differences.\n\nMany limitations are temporary or situational too: a broken arm, a crying baby in one arm, bright sunlight or a noisy train.",
        },
        {
          type: 'list',
          items: [
            "**Perceivable** — people can see or hear the content (contrast, text alternatives for images, captions).",
            "**Operable** — people can use it with a keyboard, a switch or voice, not just a mouse.",
            "**Understandable** — language is clear and behaviour is predictable.",
            "**Robust** — it works with assistive tools like screen readers.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Accessibility is about people's right to use everyday services like banking, shopping and healthcare. In many countries it's also a legal requirement. And accessible design is usually clearer design for everyone.",
        },
        {
          type: 'checklist',
          title: 'Beginner accessibility checklist',
          items: [
            "Text meets contrast minimums.",
            "Tap targets are large enough (at least 24×24px, ideally around 44×44px).",
            "Every form field has a visible label, not just a placeholder.",
            "Colour is never the only way to show meaning.",
            "Images that carry meaning have a text description planned.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A login form',
          body: "Small changes make the same form usable by far more people.",
          before: "Placeholder-only fields, a tiny 'x' to clear input, and errors shown only as a red border.",
          after: "Visible labels above fields, a large clear button, and errors shown with an icon and text like 'Enter your email address'.",
        },
      ],
      practice: {
        task: "Run the beginner checklist on one screen from an app you use.",
        steps: [
          "Pick a screen with a form or several buttons.",
          "Go through each item in the checklist.",
          "Note every failure with a screenshot.",
          "Suggest a fix for each one.",
        ],
        deliverable: "A short accessibility audit with at least three findings and fixes.",
      },
      challenge: {
        task: "Try to complete a task on a website using only your keyboard (Tab, Shift+Tab, Enter, Space) and write up what happened.",
        successCriteria: [
          "Describes where you got stuck or lost track of focus.",
          "Notes whether the focus indicator was visible.",
          "Suggests at least two design changes that would help.",
        ],
      },
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Module 2 — Figma Fundamentals                                       */
/* ------------------------------------------------------------------ */

const m2Figma: Module = {
  id: 'b-m2-figma',
  title: 'Figma Fundamentals',
  stage: 'Figma',
  summary: "Hands-on Figma skills, from your first frame to components, Auto Layout, Variables, prototypes and handing off in Dev Mode.",
  outcome: "You'll be able to build tidy, reusable, responsive screens in Figma and turn them into a clickable prototype ready for developers.",
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'b2-frames',
      title: 'Frames',
      summary: "Frames are the containers for your screens and sections in Figma. Almost everything you design lives inside one.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **frame** is a container in Figma. At the top level it usually represents a screen (e.g. an iPhone-sized frame); inside a screen, smaller frames group things like a header, a card or a button.\n\nPress **F** (or choose the Frame tool) and either drag to draw one or pick a preset size from the right-hand panel, such as a phone or desktop size.",
        },
        {
          type: 'list',
          items: [
            "Frames can have their own fill, stroke, corner radius and effects.",
            "Frames can **clip content** — anything outside their edges is hidden.",
            "Frames can be nested: a card frame inside a screen frame.",
            "Frames unlock Auto Layout, constraints and layout grids — shapes and groups do not.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Using frames rather than loose shapes or groups keeps files organised and makes designs responsive later. Developers also think in containers, so frame-based designs translate more naturally into code.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Frames vs groups: a group simply wraps layers and resizes with them. A frame is a real container with its own size and properties. When in doubt, use a frame.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Structuring a mobile home screen',
          body: "A well-built screen is a phone-sized frame containing smaller frames for the header, content and bottom navigation.",
          before: "One screen with 40 loose rectangles and text layers sitting directly on the canvas.",
          after: "A 'Home' frame containing 'Header', 'Content' and 'Bottom nav' frames, each holding its own layers.",
        },
      ],
      practice: {
        task: "Create a mobile screen in Figma built from nested frames.",
        steps: [
          "Press F and choose a phone preset from the right-hand panel; rename the frame 'Home'.",
          "Inside it, draw a frame across the top and name it 'Header'; give it a background colour.",
          "Draw a second frame for 'Content' and a third along the bottom for 'Bottom nav'.",
          "Add a text layer inside 'Header' and move it outside the frame edge to see clipping in action.",
        ],
        deliverable: "A named phone frame containing three named child frames.",
      },
      challenge: {
        task: "Build a desktop and a mobile frame for the same landing page, each structured into section frames.",
        successCriteria: [
          "Every top-level frame is named clearly (e.g. 'Landing – Desktop').",
          "Each screen contains at least three named section frames.",
          "No important layers sit loose on the canvas outside a frame.",
        ],
      },
    },
    {
      id: 'b2-layers',
      title: 'Layers',
      summary: "The Layers panel shows everything in your file and how it's nested. Clean layers make designs easy to edit and hand off.",
      minutes: 9,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Every object in Figma — frames, shapes, text, images — is a **layer**, listed in the **Layers panel** on the left. Layers higher in the list sit on top of layers below them.\n\nNesting is shown with indentation: a text layer inside a 'Card' frame appears underneath and indented from it.",
        },
        {
          type: 'list',
          items: [
            "**Rename** a layer by double-clicking its name.",
            "**Reorder** by dragging in the panel to change what sits on top.",
            "**Hide** or **lock** layers with the eye and lock icons when you hover.",
            "**Select inside** a frame by double-clicking on the canvas, or hold Cmd/Ctrl while clicking for a deep select.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Names like 'Rectangle 47' and 'Frame 212' make files painful for teammates and developers. Clear layer names ('Price', 'Add to basket button') make your intent obvious and speed up hand-off.",
        },
        {
          type: 'doDont',
          do: ["Name frames and important layers by what they are.", "Keep nesting logical: page › screen › section › element.", "Delete hidden layers you no longer need."],
          dont: ["Leave default names on everything.", "Stack loads of hidden 'old versions' inside screens.", "Use deep nesting with no purpose."],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A product card in the Layers panel',
          body: "The same card can be a mystery or self-explanatory depending on its layers.",
          before: "Frame 12 › Rectangle 3, Rectangle 4, Text, Text, Text, Group 9",
          after: "Product card › Image, Details (Name, Price, Rating), Add button",
        },
      ],
      practice: {
        task: "Clean up the layers of a screen you've built.",
        steps: [
          "Open your 'Home' frame from the previous lesson and expand every layer.",
          "Rename each frame and key layer with a descriptive name.",
          "Drag layers so their order matches what should appear on top.",
          "Delete or merge any empty groups and hidden leftovers.",
        ],
        deliverable: "A screen where every layer has a meaningful name and sensible nesting.",
      },
      challenge: {
        task: "Download a free community UI file, pick one messy screen and restructure its layers without changing the visual result.",
        successCriteria: [
          "The screen looks identical before and after.",
          "Every visible layer has a descriptive name.",
          "Nesting reflects the visual sections of the screen.",
        ],
      },
    },
    {
      id: 'b2-shapes',
      title: 'Shapes',
      summary: "Rectangles, ellipses, lines and the pen tool are the building blocks for icons, dividers, avatars and backgrounds.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Figma's shape tools include **Rectangle (R)**, **Ellipse (O)**, **Line (L)**, polygon and star, plus the **Pen (P)** for custom paths. Hold **Shift** while drawing to keep perfect squares, circles and straight lines.\n\nEvery shape has a **fill**, an optional **stroke** (outline), a **corner radius** and **effects** such as drop shadows.",
        },
        {
          type: 'list',
          items: [
            "**Rectangles** — backgrounds, dividers, image placeholders.",
            "**Ellipses** — avatars, status dots, radio buttons.",
            "**Boolean operations** — combine shapes with union, subtract, intersect or exclude to make simple icons.",
            "**Corner radius** — set per corner in the design panel for tabs and chips.",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "For cards and buttons, prefer a frame with a fill and radius over a rectangle behind content. The frame can hold the content and use Auto Layout; a loose rectangle can't.",
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Knowing shapes well lets you quickly make placeholders and simple icons so you can focus on layout and flow instead of hunting for assets.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Building an avatar with a status dot',
          body: "A 40×40 circle holds the profile picture, and a 10×10 green circle with a 2px white stroke sits at the bottom-right to show 'online'. The white stroke separates the dot from any photo behind it.",
        },
      ],
      practice: {
        task: "Create three small UI pieces using only shapes.",
        steps: [
          "Draw a 40×40 circle with Shift held, then a smaller status dot with a white stroke; position it bottom-right.",
          "Draw a full-width 1px line as a divider and set it to a light grey.",
          "Use two rectangles and a boolean Subtract to make a simple 'card with notch' shape.",
          "Name each result clearly in the Layers panel.",
        ],
        deliverable: "An avatar with status, a divider and a custom boolean shape.",
      },
      challenge: {
        task: "Create a set of four simple icons (home, search, heart, profile) on a 24×24 frame using shapes and booleans.",
        successCriteria: [
          "All icons sit in identical 24×24 frames.",
          "Stroke weights are consistent across the set.",
          "Each icon is recognisable at its actual size.",
        ],
      },
    },
    {
      id: 'b2-text',
      title: 'Text',
      summary: "Learn how Figma text layers work — sizing modes, line height, letter spacing — so your type behaves like real UI text.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Press **T** and click to create a text layer. In the design panel you can set typeface, weight, size, line height, letter spacing and alignment.\n\nText layers have **resizing modes**: *auto width* (grows sideways as you type), *auto height* (fixed width, grows downwards — best for paragraphs) and *fixed size*.",
        },
        {
          type: 'list',
          items: [
            "Use **auto width** for short labels like button text.",
            "Use **auto height** for paragraphs so text wraps inside a set width.",
            "Avoid **fixed size** for real content — text can overflow or get cut off.",
            "Set a **line height** explicitly (e.g. 24px for 16px text) rather than relying on 'Auto'.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Real content changes length — translations, long names, bigger font settings. Choosing the right resizing mode means your design survives real text instead of breaking the moment a product name is longer than 'Lorem ipsum'.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Design with realistic content. Write actual button labels and headlines instead of placeholder text; you'll spot layout problems much earlier.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A product title that breaks',
          body: "A fixed-size text box looks fine with 'Trainers' but not with a real product name.",
          before: "Fixed-size text box 200×24 — 'Men's Lightweight Waterproof Running Trainers' gets cut off.",
          after: "Auto height text at 200px wide — the title wraps to two lines and the card grows to fit.",
        },
      ],
      practice: {
        task: "Build a small text block for a blog card in Figma.",
        steps: [
          "Create a heading layer (auto width) and set it to 20px Semibold with 28px line height.",
          "Create a paragraph layer, switch it to auto height and set its width to 320px; use 16px with 24px line height.",
          "Add a small 'Read more' label at 14px.",
          "Paste in a much longer paragraph and confirm it wraps correctly.",
        ],
        deliverable: "A blog card text block that handles long content without overflowing.",
      },
      challenge: {
        task: "Create a notification card and test it with short, long and translated-length text.",
        successCriteria: [
          "Uses appropriate resizing modes for each text layer.",
          "Nothing is clipped or overlapping in any version.",
          "Line heights are set explicitly and consistently.",
        ],
      },
    },
    {
      id: 'b2-images',
      title: 'Images',
      summary: "Place, crop and scale images in Figma using image fills, so photos behave predictably inside cards and avatars.",
      minutes: 9,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "In Figma, images are usually **fills** on a shape or frame rather than separate objects. You can drag an image onto the canvas, use **Place image** (Cmd/Ctrl + Shift + K), or drop an image onto an existing rectangle to fill it.\n\nIn the fill settings you choose how the image fits: **Fill** (covers the shape, cropping edges), **Fit** (shows the whole image), **Crop** (you choose the area) or **Tile**.",
        },
        {
          type: 'list',
          items: [
            "Use **Fill** for thumbnails and avatars so every card looks consistent.",
            "Use **Crop** when you need a specific part of the photo, like a face.",
            "Keep consistent aspect ratios (e.g. 16:9 for article images, 1:1 for avatars).",
            "Compress very large images so files stay fast.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "In the real product, images will come in every size and shape. Using fills with fixed aspect ratios shows developers how images should be cropped and prevents layouts from jumping around.",
        },
        {
          type: 'callout',
          tone: 'warning',
          body: "Only use images you have the right to use. For practice, use free-to-use photo libraries and check their licence, or use plain placeholders.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A restaurant list',
          body: "Restaurant photos arrive in portrait, landscape and square formats.",
          before: "Each photo placed at its original size, so card heights vary and the list looks messy.",
          after: "Each card has a 16:9 frame with the photo as a Fill image, so every card lines up.",
        },
      ],
      practice: {
        task: "Build a row of three image cards with consistent cropping.",
        steps: [
          "Draw three 240×135 rectangles (16:9).",
          "Drag a different photo onto each one to set it as the fill.",
          "Set each to Fill, then switch one to Crop and adjust the visible area.",
          "Create a 48×48 circle and fill it with a portrait photo for an avatar.",
        ],
        deliverable: "Three uniformly cropped image cards and one circular avatar.",
      },
      challenge: {
        task: "Design a photo gallery grid that looks tidy even with images of very different shapes.",
        successCriteria: [
          "All thumbnails share a consistent aspect ratio.",
          "Important subjects (faces, dishes) are not cropped awkwardly.",
          "The grid still looks balanced with at least one very tall and one very wide image.",
        ],
      },
    },
    {
      id: 'b2-components',
      title: 'Components',
      summary: "Components let you create an element once and reuse it everywhere, so a change in one place updates every copy.",
      minutes: 12,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **component** is a reusable design element, like a button or a card. The original is the **main component**; every copy is an **instance**. When you edit the main component, all instances update.\n\nSelect a layer or frame and use **Create component** (Cmd/Ctrl + Alt + K) to turn it into a main component. You can then copy it or drag it from the Assets panel.",
        },
        {
          type: 'list',
          items: [
            "Instances can **override** some properties — text, fills, swapping an icon — without breaking the link.",
            "**Detaching** an instance cuts the link to the main component; do it rarely.",
            "Keep main components together on a dedicated page (e.g. 'Components').",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Without components, changing the corner radius of your buttons means editing every button on every screen by hand. With components, it's one change. Components also mirror how developers build reusable UI.",
        },
        {
          type: 'doDont',
          do: ["Turn anything you use more than twice into a component.", "Name components clearly (e.g. 'Button / Primary').", "Use overrides for content changes."],
          dont: ["Detach instances to make small tweaks.", "Scatter main components across random screens.", "Build one giant component for a whole screen."],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Updating a button everywhere',
          body: "Your product manager asks for all buttons to have a larger radius. With a button component used on 20 screens, you change the main component once and every screen updates instantly.",
          before: "20 separate button drawings, each edited by hand.",
          after: "One 'Button' main component and 20 instances that update automatically.",
        },
      ],
      practice: {
        task: "Create a button component and use it on several screens.",
        steps: [
          "Build a button: a frame with a fill, 8px radius and a text label.",
          "Select it and press Cmd/Ctrl + Alt + K to create a component; name it 'Button'.",
          "Place three instances on different frames and change the label text in each.",
          "Change the fill colour on the main component and watch all instances update.",
        ],
        deliverable: "A button main component and three instances with different labels.",
      },
      challenge: {
        task: "Build a small component set for a mobile app: button, input field, list item and top bar.",
        successCriteria: [
          "All four live on a 'Components' page and are named clearly.",
          "A mock screen uses only instances, not detached copies.",
          "Changing a main component visibly updates the mock screen.",
        ],
      },
    },
    {
      id: 'b2-auto-layout',
      title: 'Auto Layout',
      summary: "Auto Layout makes frames arrange their contents automatically, so buttons grow with their labels and lists stack neatly.",
      minutes: 14,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Auto Layout** turns a frame into a smart container that arranges its children in a row or column, with set **gap** between items and **padding** around them. Add it with **Shift + A**.\n\nWhen content changes — a longer label, an extra list item — the frame adjusts automatically. It works much like flexbox in CSS, which is why developers love it.",
        },
        {
          type: 'list',
          items: [
            "**Direction** — horizontal (row) or vertical (column).",
            "**Gap** — the space between children.",
            "**Padding** — the space between the frame edge and its children.",
            "**Resizing** — each item can *Hug contents*, *Fill container* or be *Fixed* width/height.",
            "**Alignment** — where children sit inside the frame (top-left, centre, etc.).",
          ],
        },
        { type: 'interactive', widget: 'auto-layout', caption: 'Change direction, gap, padding and alignment to see how Auto Layout arranges items.' },
        {
          type: 'callout',
          tone: 'why',
          body: "Without Auto Layout, every text change means nudging boxes around by hand. With it, your designs stay tidy and consistent, and they describe spacing in a way developers can copy exactly.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A button that fits any label',
          body: "Auto Layout with 16px horizontal and 12px vertical padding, set to Hug contents, means the button grows when the label changes.",
          before: "'Continue' fits, but 'Continue to payment' spills outside the button background.",
          after: "The button frame hugs its label with consistent padding, whatever the text.",
        },
      ],
      practice: {
        task: "Build a button and a vertical list with Auto Layout.",
        steps: [
          "Create a text label, select it and press Shift + A; set padding to 12px vertical and 16px horizontal, add a fill and radius.",
          "Change the label to something much longer and check the button grows.",
          "Create three list rows (icon + text), wrap them in a vertical Auto Layout frame with an 8px gap.",
          "Duplicate a row inside the list and see the frame grow automatically.",
        ],
        deliverable: "A self-sizing button and a vertical list that grows as rows are added.",
      },
      challenge: {
        task: "Build a complete settings card with nested Auto Layout: a title, three rows with a label and toggle, and a footer button.",
        successCriteria: [
          "Every level uses Auto Layout — no manually positioned layers.",
          "Labels use Fill container so toggles stay aligned on the right.",
          "Changing the card width keeps everything aligned.",
          "All gap and padding values come from a spacing scale.",
        ],
      },
    },
    {
      id: 'b2-constraints',
      title: 'Constraints',
      summary: "Constraints tell layers how to behave when their parent frame is resized — pinned left, stretched, centred or scaled.",
      minutes: 10,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Constraints** define how a layer moves or stretches when its parent frame changes size. You set them in the design panel for any layer inside a frame that does *not* use Auto Layout.\n\nHorizontal options include **Left**, **Right**, **Left & right** (stretch), **Center** and **Scale**. Vertical options are the same with Top and Bottom.",
        },
        {
          type: 'list',
          items: [
            "A **back arrow** in a header: Left + Top — it stays in the corner.",
            "A **header bar**: Left & right + Top — it stretches across.",
            "A **floating action button**: Right + Bottom — it hugs the bottom-right corner.",
            "A **centred logo**: Center — it stays in the middle.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Your design will be seen on many screen sizes. Constraints let you test that in Figma by simply resizing the frame, rather than redrawing each size.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Auto Layout and constraints work together: use Auto Layout inside components and sections, and constraints (or Auto Layout's own resizing) for how those sections sit within a screen.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A top bar from phone to tablet',
          body: "When a phone frame is widened to tablet size, a top bar with default constraints breaks.",
          before: "All layers set to Left + Top: the bar doesn't stretch and the profile icon stays mid-screen.",
          after: "Bar set to Left & right, title to Center, profile icon to Right: the layout adapts cleanly.",
        },
      ],
      practice: {
        task: "Make a header that adapts when you resize its screen frame.",
        steps: [
          "Create a phone frame; inside it add a full-width bar, a back icon, a centred title and a profile icon.",
          "Set the bar to Left & right + Top, the back icon to Left, the title to Center and the profile icon to Right.",
          "Drag the frame's edge to make it wider and narrower.",
          "Fix any layer that doesn't behave as expected.",
        ],
        deliverable: "A header that looks correct at phone and tablet widths.",
      },
      challenge: {
        task: "Build a screen with a header, content area and floating action button that works from 360px to 1024px wide.",
        successCriteria: [
          "The header stretches and its icons stay pinned to the correct sides.",
          "The floating button stays bottom-right at every width.",
          "Content doesn't overlap or leave odd gaps when resized.",
        ],
      },
    },
    {
      id: 'b2-variants',
      title: 'Variants',
      summary: "Variants group related versions of a component — like primary/secondary or default/hover — into one tidy, switchable set.",
      minutes: 13,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Variants** let you combine several versions of a component into a single **component set**. Each variant is described by **properties**, for example `Type = Primary | Secondary` and `State = Default | Hover | Disabled`.\n\nWhen you place an instance, you switch between variants using dropdowns in the design panel instead of hunting for separate components.",
        },
        {
          type: 'list',
          items: [
            "Select a component and add a variant from the design panel, or select several components and combine them as variants.",
            "Rename properties and values so they read naturally (Size = Small, Medium, Large).",
            "Components can also have **component properties** such as boolean (show icon?), text (label) and instance swap (which icon?).",
          ],
        },
        { type: 'interactive', widget: 'button-states', caption: 'Explore the typical states a button needs — each could be a variant.' },
        {
          type: 'callout',
          tone: 'why',
          body: "Variants mirror how developers write components with props. A well-organised set makes it obvious which versions exist, prevents one-off inventions, and makes designs quicker to build.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A button component set',
          body: "Instead of twelve separate button components, one set covers every combination through properties.",
          before: "Components named 'Button blue', 'Button blue hover', 'Button grey', 'Button grey small disabled'…",
          after: "One 'Button' set with properties Type (Primary, Secondary), Size (Small, Medium) and State (Default, Hover, Disabled).",
        },
      ],
      practice: {
        task: "Turn your button component into a variant set.",
        steps: [
          "Open your 'Button' component and add a variant; rename the property to 'Type' with values Primary and Secondary.",
          "Add a 'State' property with Default, Hover and Disabled, and style each combination.",
          "Place an instance on a screen and switch between variants in the design panel.",
          "Add a boolean property to show or hide a leading icon.",
        ],
        deliverable: "A button component set with at least six variants and an icon toggle.",
      },
      challenge: {
        task: "Build an input field component set covering all the states a real form needs.",
        successCriteria: [
          "Includes Default, Focused, Filled, Error and Disabled states.",
          "Error state includes a message, not just a red border.",
          "Property names and values are clear and consistent.",
          "Built with Auto Layout so it resizes cleanly.",
        ],
      },
    },
    {
      id: 'b2-styles',
      title: 'Styles',
      summary: "Styles save reusable colours, text settings, effects and grids, so your whole file uses the same design decisions.",
      minutes: 11,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Styles** are saved design settings you can apply to any layer. Figma supports **colour (paint) styles**, **text styles**, **effect styles** (like shadows) and **grid styles**.\n\nCreate one from a layer's properties in the design panel, give it a clear name, and apply it everywhere. Change the style later, and every layer using it updates.",
        },
        {
          type: 'list',
          items: [
            "Name with slashes to create groups: `Text/Heading/Large`, `Colour/Primary/500`.",
            "Name by purpose where possible: `Text/Body`, not `Inter 16`.",
            "Keep the number of styles small — a handful of text styles is usually enough to start.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Styles stop 'nearly the same' values creeping in — three slightly different blues, five body text sizes. They create consistency and make rebrands or dark mode far less painful.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Styles and Variables overlap. Beginners can start with styles for text and effects; Variables (next lesson) are especially useful for colours, spacing and themes.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Fixing inconsistent text',
          body: "An audit of a file finds body text at 15px, 16px and 17px in different places. Creating one `Text/Body` style and applying it everywhere fixes the inconsistency in minutes.",
          before: "Body text set by hand on every layer, in three slightly different sizes.",
          after: "Every paragraph uses the `Text/Body` style: 16px, 24px line height, Regular.",
        },
      ],
      practice: {
        task: "Create a basic set of text and colour styles and apply them to a screen.",
        steps: [
          "Create text styles: Heading/Large, Heading/Small, Body, Caption.",
          "Create colour styles: Primary, Text/Default, Text/Subtle, Background, Border.",
          "Apply them to every layer on one screen — no manual values left.",
          "Edit the Primary colour style and confirm the screen updates.",
        ],
        deliverable: "A screen styled entirely with named text and colour styles.",
      },
      challenge: {
        task: "Audit a design you made earlier and replace all hard-coded values with styles.",
        successCriteria: [
          "No text layer uses unstyled settings.",
          "No fill uses a colour outside your style list.",
          "The style list contains no near-duplicates.",
        ],
      },
    },
    {
      id: 'b2-variables',
      title: 'Variables',
      summary: "Variables store reusable values like colours and spacing, and support modes — perfect for light and dark themes.",
      minutes: 13,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Variables** store single values you can reuse: **colour**, **number**, **string** (text) and **boolean** (true/false). You manage them in the **local variables** panel, grouped into **collections**.\n\nVariables can have **modes**. A colour variable called `surface` could be white in Light mode and near-black in Dark mode. Switch a frame's mode and every layer using that variable changes.",
        },
        {
          type: 'list',
          items: [
            "**Colour variables** — brand colours and themeable colours like `text/primary`.",
            "**Number variables** — spacing (`space/16`), corner radius, sizes; you can apply them to Auto Layout gaps and padding.",
            "**Aliasing** — one variable can point to another, e.g. `button/background` → `blue/600`.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Variables are how designers and developers share the same 'design tokens'. They make theming, dark mode and multi-brand work practical, and they match how values are stored in code.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Start with two layers of naming: *primitive* values (`blue/600`) and *semantic* values that describe purpose (`action/primary`). Designers should mostly apply the semantic ones.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Adding dark mode to a card',
          body: "A card uses `surface`, `text/primary` and `border` variables. The team adds a Dark mode to the collection with darker values and switches the frame's mode — no layers are redrawn.",
          before: "Duplicating every screen and recolouring it by hand for dark mode.",
          after: "One set of screens, with a Light/Dark mode switch driven by variables.",
        },
      ],
      practice: {
        task: "Create colour and spacing variables with Light and Dark modes.",
        steps: [
          "Open the local variables panel and create a collection called 'Theme'.",
          "Add colour variables `surface`, `text/primary`, `text/subtle`, `border`, and a second mode called Dark.",
          "Create number variables `space/8`, `space/16`, `space/24` and apply them to an Auto Layout card's padding and gap.",
          "Apply the colour variables to the card, then switch the frame to Dark mode.",
        ],
        deliverable: "A card that switches correctly between light and dark using variables.",
      },
      challenge: {
        task: "Set up primitive and semantic colour variables and use them to theme a small three-screen flow in light and dark.",
        successCriteria: [
          "Primitive variables hold raw colours; semantic variables alias them.",
          "Screens use semantic variables only.",
          "Both modes pass text contrast checks.",
        ],
      },
    },
    {
      id: 'b2-prototyping',
      title: 'Prototyping',
      summary: "Link frames with interactions to create clickable prototypes you can test with real people before anything is built.",
      minutes: 13,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "In Figma's **Prototype** tab, you connect layers to frames to simulate a real product. Each connection has a **trigger** (e.g. On click, On drag, While hovering, After delay), an **action** (e.g. Navigate to, Open overlay, Back, Scroll to) and an **animation** (Instant, Dissolve, Move in, Smart animate).\n\nPress the Play (Present) button to try it, or share a link so others can test it on their own device.",
        },
        {
          type: 'list',
          items: [
            "Set a **flow starting point** so testers begin on the right screen.",
            "Use **overlays** for modals, menus and bottom sheets.",
            "Use **Smart animate** to animate layers with matching names between frames.",
            "Components can have **interactive states** — for example, a button that shows its hover variant.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "A prototype lets people *use* your idea instead of imagining it. You'll discover confusing steps in minutes, long before engineers spend time building the wrong thing.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Prototype the key path only — the 'happy path' plus one or two important errors. Linking every single button wastes time and rarely helps the test.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A booking flow prototype',
          body: "A hair salon app prototype connects: Service list → Choose time → Confirm details → Success. The 'Choose time' screen opens a date picker as an overlay, and the back arrow uses the Back action.",
        },
      ],
      practice: {
        task: "Build a clickable prototype for a three-screen sign-up flow.",
        steps: [
          "Design three frames: Welcome, Enter details, Account created.",
          "In the Prototype tab, connect the Welcome button to 'Enter details' with On click → Navigate to.",
          "Connect 'Create account' to the success screen and add a back arrow with the Back action.",
          "Set a flow starting point and present the prototype to test it.",
        ],
        deliverable: "A shareable prototype link that walks through the sign-up flow.",
      },
      challenge: {
        task: "Prototype a food ordering flow including a modal and a validation error.",
        successCriteria: [
          "Uses at least one overlay (e.g. item options).",
          "Includes an error path, such as an unavailable delivery address.",
          "Someone who hasn't seen it can complete the flow unaided.",
        ],
      },
    },
    {
      id: 'b2-libraries',
      title: 'Libraries',
      summary: "Publish components, styles and variables as a library so every file in your team uses the same up-to-date building blocks.",
      minutes: 10,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **library** is a Figma file whose components, styles and variables are **published** so other files can use them. Teams usually keep their design system in one library file and turn it on in their product files.\n\nWhen the library owner publishes changes, files that use it receive an **update notification** and can review and accept the changes.",
        },
        {
          type: 'list',
          items: [
            "Publish from the library file via the Assets panel.",
            "Enable a library in another file from the Assets panel's library settings.",
            "Write a short description when publishing so teammates know what changed.",
            "Publishing team libraries requires a paid plan; on a free plan you can still practise by keeping components in one file.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Without a shared library, each designer keeps their own copy of the button, and they drift apart. A library is the single source of truth that keeps a whole product consistent.",
        },
        {
          type: 'callout',
          tone: 'warning',
          body: "Be careful with changes to published components. Renaming or removing a property can affect every file that uses it. Communicate changes before publishing.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Two product squads, one button',
          body: "The payments squad and the onboarding squad both use the team library. When the design system designer increases the button's minimum height for accessibility and publishes, both squads accept the update — and their screens stay consistent.",
        },
      ],
      practice: {
        task: "Set up a mini library file and use it in a separate project file.",
        steps: [
          "Create a file called 'My Design System' and move your button, input and styles into it.",
          "Write a short description for each component.",
          "Publish it if your plan allows; otherwise copy the components page into your project file as a simulation.",
          "Build a screen in another file using only those library components.",
        ],
        deliverable: "A library file and a separate screen built from its components.",
      },
      challenge: {
        task: "Make a change to a library component, publish it with a clear change note, and update a consuming file.",
        successCriteria: [
          "The change note explains what changed and why.",
          "The consuming file shows the update applied.",
          "No instances were detached in the process.",
        ],
      },
    },
    {
      id: 'b2-dev-mode-basics',
      title: 'Dev Mode basics',
      summary: "Dev Mode is Figma's view for developers. Learn what it shows so you can prepare designs that are easy to build.",
      minutes: 11,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Dev Mode** is a separate mode in Figma designed for developers. It lets them inspect layers, see measurements and spacing, read values such as colours and type, view component properties and variables, copy code snippets, and export assets.\n\nDesigners can mark sections as **Ready for dev**, so developers know which designs are final. Access to Dev Mode depends on your Figma plan and seat.",
        },
        {
          type: 'list',
          items: [
            "Developers see **variable and style names**, not just raw values — so using them matters.",
            "**Auto Layout** shows up as clear gap and padding values, similar to CSS flexbox.",
            "**Annotations** and measurements let you add notes about behaviour.",
            "**Component properties** show which variant or state is used.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Hand-off is where many designs lose quality. If your file uses components, styles, variables and Auto Layout, Dev Mode shows developers exactly what you meant. If it's full of loose shapes and magic numbers, they have to guess.",
        },
        {
          type: 'checklist',
          title: 'Before marking a design Ready for dev',
          items: [
            "Layers are named and nested sensibly.",
            "Colours, text and spacing use styles or variables.",
            "Layouts use Auto Layout where possible.",
            "Empty, loading and error states are included.",
            "Behaviour that isn't visible (animations, validation rules) is annotated.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A card inspected in Dev Mode',
          body: "The same card looks identical in design view but very different to a developer inspecting it.",
          before: "Developer sees a rectangle and text layers with positions like x: 17, y: 43 and colour #3A7AFE.",
          after: "Developer sees an Auto Layout frame with 16px padding, a 12px gap, `color/action/primary` and a `Card` component instance.",
        },
        { type: 'link', url: 'https://help.figma.com', title: 'Figma Help Centre', description: "Figma's official documentation, including guides to Dev Mode." },
      ],
      practice: {
        task: "Prepare one screen for hand-off and review it the way a developer would.",
        steps: [
          "Pick a screen you built in this module and run through the checklist above.",
          "Fix any unnamed layers, hard-coded values or manual layouts.",
          "Add annotations for any behaviour (e.g. 'Button disabled until all fields valid').",
          "Open Dev Mode (or the Inspect view on your plan), click through elements and note anything unclear.",
        ],
        deliverable: "A hand-off-ready screen with annotations and a short list of fixes you made.",
      },
      challenge: {
        task: "Ask a developer friend (or a peer) to review your screen in Dev Mode and list every question they have.",
        successCriteria: [
          "You collected at least three questions or points of confusion.",
          "Each one led to a change or annotation in the file.",
          "The final file answers those questions without you being present.",
        ],
      },
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Module 3 — UX Process                                               */
/* ------------------------------------------------------------------ */

const m3Ux: Module = {
  id: 'b-m3-ux',
  title: 'UX Process',
  stage: 'UX',
  summary: "The practical UX toolkit: framing problems, understanding users, structuring content and flows, and testing ideas before they're built.",
  outcome: "You'll be able to take a vague problem, research it with real people, design a flow and test it — and explain every step.",
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'b3-problem-statements',
      title: 'Problem statements',
      summary: "A good problem statement describes who is struggling, with what, and why it matters — without jumping to a solution.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **problem statement** is a short, clear description of the problem your team is solving. It keeps everyone focused and stops people arguing about solutions before agreeing on the problem.\n\nA simple template: **[User] needs a way to [do something] because [insight]. We'll know we've succeeded when [observable change].**",
        },
        {
          type: 'doDont',
          do: [
            "Name a specific user group.",
            "Describe a need, not a feature.",
            "Include the 'because' — the insight from research.",
            "Say how you'd recognise success.",
          ],
          dont: [
            "Write the solution in disguise ('Users need a chatbot').",
            "Say 'users' when you mean everyone and no one.",
            "Make it so broad it can't be solved ('Improve the app').",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "If a team hasn't agreed the problem, every design review turns into a debate of personal opinions. A shared problem statement gives you something to test ideas against: 'Does this help solve *that*?'",
        },
        {
          type: 'quiz',
          question: 'Which is the strongest problem statement?',
          options: [
            'We need to add a dark mode.',
            'Improve the user experience of our app.',
            "First-time renters need a way to understand the total monthly cost of a flat because hidden fees make them distrust listings.",
            'Users want more features.',
          ],
          answer: 2,
          explanation: "It names a specific user, a need and an insight, and doesn't prescribe a solution.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A fitness app',
          body: "The first version jumps to a solution. The improved version leaves room for many ideas.",
          before: "'We need push notifications to make people work out more.'",
          after: "'Busy parents who want to exercise need a way to fit short workouts into unpredictable days, because they skip sessions when plans change. Success: they complete more of the workouts they plan.'",
        },
      ],
      practice: {
        task: "Rewrite three solution-first requests as proper problem statements.",
        steps: [
          "Use these requests: 'Add a search filter', 'Make the logo bigger', 'Add a chatbot'.",
          "For each, guess who might be asking for it and why.",
          "Rewrite each using the template.",
          "Note what you'd need to research to check your 'because'.",
        ],
        deliverable: "Three problem statements with a note on what needs validating.",
      },
      challenge: {
        task: "Write a problem statement for a real frustration you've observed in an everyday app, backed by at least two conversations.",
        successCriteria: [
          "Uses a specific user group.",
          "The 'because' comes from what people actually said.",
          "Contains no solution.",
          "Includes an observable success signal without invented numbers.",
        ],
      },
    },
    {
      id: 'b3-personas',
      title: 'Personas',
      summary: "Personas summarise research about user groups into memorable profiles, helping teams design for real needs rather than themselves.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **persona** is a short profile of a fictional person who represents a group of real users. It captures their **goals**, **frustrations**, **behaviours** and **context** — the things that affect design decisions.\n\nA good persona is built from research. A persona made up in a meeting is just a guess with a stock photo.",
        },
        {
          type: 'list',
          items: [
            "**Goals** — what they're trying to achieve.",
            "**Frustrations** — what gets in their way today.",
            "**Behaviours** — how they currently solve the problem, which tools they use.",
            "**Context** — when, where and on what device.",
            "A **quote** from research that captures their mindset.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Personas turn abstract 'users' into someone the team can picture. Asking 'Would Priya, the night-shift nurse checking her rota on a break, understand this?' leads to better decisions than 'Will users like this?'",
        },
        {
          type: 'callout',
          tone: 'warning',
          body: "Details like age, hobbies and favourite brands usually don't change design decisions and can lead to stereotypes. Keep what's relevant to the problem.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A persona for a bill-splitting app',
          body: "The weak version is decorative; the strong one guides decisions.",
          before: "'Sam, 28, likes yoga and coffee, uses an iPhone, lives in Manchester.'",
          after: "'Sam organises group dinners and usually pays upfront. Goal: get paid back without awkward reminders. Frustration: chasing friends across three different apps. Quote: \"I hate being the one who has to ask.\"'",
        },
      ],
      practice: {
        task: "Create a research-based persona from interview notes (use a friend or two as your interviewees).",
        steps: [
          "Ask two or three people about how they plan meals for the week.",
          "Group common goals and frustrations.",
          "Write a one-page persona with goals, frustrations, behaviours, context and a real quote.",
          "Remove any detail that wouldn't affect a design decision.",
        ],
        deliverable: "A one-page persona grounded in real conversations.",
      },
      challenge: {
        task: "Create two contrasting personas for the same product and show how one design decision would differ for each.",
        successCriteria: [
          "Each persona is based on different needs, not different demographics.",
          "Both include a real quote.",
          "One concrete design decision is explained for each persona.",
        ],
      },
    },
    {
      id: 'b3-user-research',
      title: 'User research',
      summary: "User research is how you learn what people actually need and do. Learn the main methods and when to use each.",
      minutes: 12,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**User research** is the practice of learning about users through evidence rather than assumptions. Methods fall into two broad groups:\n\n**Qualitative** research (interviews, observation, usability tests) tells you *why* people do things. **Quantitative** research (surveys, analytics) tells you *how many* or *how often*.",
        },
        {
          type: 'list',
          items: [
            "**Interviews** — understand motivations and experiences.",
            "**Observation / contextual inquiry** — watch people in their real environment.",
            "**Surveys** — collect answers from many people; best for simple, well-defined questions.",
            "**Analytics** — see what people actually do in a live product.",
            "**Usability testing** — see where people struggle with a design.",
            "**Desk research** — review existing reports, support tickets, reviews and competitors.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "What people say and what they do are often different. Combining methods — for example, analytics to spot where people drop off and interviews to learn why — gives you a much more reliable picture.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Start with a research question, not a method. 'Why do people abandon their basket at the delivery step?' tells you which method fits.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'An online grocery shop',
          body: "Analytics show many people leave at the delivery slot page. Five short interviews reveal why: slots for the next two days are always full, and people don't realise later dates exist. The design fix shows the next available slot upfront.",
        },
      ],
      practice: {
        task: "Write a mini research plan for a question about an app you use.",
        steps: [
          "Write one clear research question.",
          "Choose two methods and explain why each fits.",
          "Describe who you'd talk to and how you'd find them.",
          "List what you'd do with the findings.",
        ],
        deliverable: "A half-page research plan.",
      },
      challenge: {
        task: "Do desk research on a product by reading 30 app store reviews and grouping the complaints.",
        successCriteria: [
          "Reviews are grouped into clear themes.",
          "Each theme has at least two supporting quotes.",
          "You note what the reviews can't tell you and which method would fill the gap.",
        ],
      },
    },
    {
      id: 'b3-user-interviews',
      title: 'User interviews',
      summary: "Run interviews that reveal real behaviour and needs by asking open, neutral questions about past experiences.",
      minutes: 13,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **user interview** is a one-to-one conversation to understand someone's experiences, needs and behaviour. It usually lasts 30–60 minutes and follows a loose script called a **discussion guide**.\n\nThe golden rule: ask about **what people have actually done**, not what they think they might do in future.",
        },
        {
          type: 'doDont',
          do: [
            "Ask open questions: 'Tell me about the last time you…'",
            "Follow up with 'Why?' and 'Can you give me an example?'",
            "Stay quiet and let pauses happen.",
            "Get consent before recording.",
          ],
          dont: [
            "Ask leading questions: 'Don't you think this is confusing?'",
            "Ask about the future: 'Would you use this feature?'",
            "Pitch your idea during the interview.",
            "Ask two questions at once.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "People are generally polite and bad at predicting their own behaviour. If you ask 'Would you use this?', most will say yes. Asking about real past behaviour gives you evidence you can trust.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            "Introduction and consent.",
            "Warm-up questions about their context.",
            "Main questions about recent, specific experiences.",
            "Wrap-up: 'Is there anything I should have asked?'",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Researching a travel booking app',
          body: "Rewording one question turns a vague opinion into a useful story.",
          before: "'Would you like a feature that compares hotel prices?'",
          after: "'Tell me about the last hotel you booked. How did you decide it was a good price?'",
        },
      ],
      practice: {
        task: "Write a discussion guide and run one 20-minute interview.",
        steps: [
          "Pick a topic, e.g. 'how people manage their subscriptions'.",
          "Write eight open questions following the four-part structure.",
          "Interview one person, asking permission to take notes or record.",
          "Afterwards, highlight the three most surprising things they said.",
        ],
        deliverable: "A discussion guide and interview notes with three highlighted insights.",
      },
      challenge: {
        task: "Run three interviews on the same topic and compare what you learned.",
        successCriteria: [
          "No leading or future-focused questions in your guide.",
          "At least one pattern appears across all three interviews.",
          "You note one thing you'd change about your interviewing technique.",
        ],
      },
    },
    {
      id: 'b3-affinity-mapping',
      title: 'Affinity mapping',
      summary: "Affinity mapping turns a pile of research notes into clear themes by grouping similar observations together.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "After research you'll have lots of notes. **Affinity mapping** (also called affinity diagramming) helps you make sense of them. Write each observation on its own sticky note — physical or in a tool like FigJam — then group notes that feel related and name each group.\n\nThe themes that emerge become your **insights**.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            "Write one observation or quote per note.",
            "Spread all notes out without sorting.",
            "Move similar notes together, in silence at first if working as a team.",
            "Name each cluster with a short statement, e.g. 'People don't trust delivery estimates'.",
            "Look for the biggest or most painful clusters.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Affinity mapping lets patterns appear from the data instead of from your assumptions. Doing it together also gets the whole team to agree on what the research actually said.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Name clusters as insights ('Parents plan meals around what's already in the fridge'), not topics ('Fridge'). Insight names are much more useful for design.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'From notes to insight',
          body: "Notes from interviews about a car-sharing app include: 'Never know if the car will be clean', 'Took photos of scratches in case', 'Worried I'd be blamed for damage'. Grouped together, they form one insight.",
          before: "Cluster label: 'Damage'",
          after: "Cluster label: 'Users fear being blamed for damage they didn't cause'",
        },
      ],
      practice: {
        task: "Create an affinity map from your interview notes.",
        steps: [
          "Write each observation from your interviews on a separate sticky note.",
          "Group them into clusters on a wall or FigJam board.",
          "Name each cluster as an insight statement.",
          "Pick the top three insights and explain why they matter.",
        ],
        deliverable: "A photo or screenshot of your map with three prioritised insights.",
      },
      challenge: {
        task: "Run an affinity mapping session with at least one other person and compare how you'd each have grouped the notes.",
        successCriteria: [
          "At least 30 notes are grouped.",
          "Every cluster has an insight-style name.",
          "You record one disagreement and how you resolved it.",
        ],
      },
    },
    {
      id: 'b3-user-journeys',
      title: 'User journeys',
      summary: "A journey map shows a person's experience over time — their steps, thoughts and feelings — to reveal where things go wrong.",
      minutes: 11,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **user journey map** tells the story of someone trying to achieve a goal, step by step, often across several channels (website, app, email, phone, in person).\n\nFor each stage you capture what the person **does**, **thinks** and **feels**, plus the **pain points** and **opportunities**.",
        },
        {
          type: 'list',
          items: [
            "**Persona and goal** — who, and what they want.",
            "**Stages** — e.g. Discover → Compare → Book → Prepare → Travel.",
            "**Actions** — what they do at each stage.",
            "**Emotions** — often drawn as a line going up and down.",
            "**Opportunities** — ideas for improving the low points.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Screens are only part of the experience. A journey map shows that the worst moment might be a confusing email or a long wait on the phone — problems you'd miss if you only looked at the app.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Don't confuse journeys with user flows (a later lesson). Journeys are about the whole experience and emotions; flows are about the specific screens and decisions inside a product.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Renewing a passport online',
          body: "The online form itself is fine, but the journey map shows the emotional low point is afterwards: people don't know if their application arrived and anxiously call the helpline. The opportunity is clear status updates by email.",
        },
      ],
      practice: {
        task: "Map your own journey of a recent experience, like moving house or ordering a birthday gift online.",
        steps: [
          "Define the persona (you) and the goal.",
          "Split the experience into four to six stages.",
          "For each stage, note actions, thoughts and a feeling score from negative to positive.",
          "Mark the lowest points and write one opportunity for each.",
        ],
        deliverable: "A journey map with stages, an emotion line and opportunities.",
      },
      challenge: {
        task: "Create a journey map for someone else, based on an interview, for a service that spans app and real life (e.g. food delivery).",
        successCriteria: [
          "Includes at least one touchpoint outside the app.",
          "Emotions are based on what the person said, not guesses.",
          "Opportunities are specific enough to design.",
        ],
      },
    },
    {
      id: 'b3-information-architecture',
      title: 'Information architecture',
      summary: "Information architecture organises and labels content so people can find what they need and understand where they are.",
      minutes: 12,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Information architecture (IA)** is the structure behind a product: how content is grouped, what it's called and how it connects. It's like the floor plan and signage of a building.\n\nThe usual output is a **sitemap** — a diagram showing the main sections and pages and how they nest.",
        },
        {
          type: 'list',
          items: [
            "**Organisation** — how content is grouped (by task, topic, audience…).",
            "**Labelling** — the words used for menus and links.",
            "**Navigation** — how people move between sections.",
            "**Search** — how people find things directly.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Companies often organise websites the way they're organised internally ('Departments', 'Divisions'). Users don't think that way. Good IA uses the user's mental model and language, so they find things without thinking.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "**Card sorting** is a simple research method for IA: give people cards with content items and ask them to group and name them. It shows how users naturally organise things.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A council website',
          body: "Residents couldn't find how to report a missed bin collection.",
          before: "Menu: 'Environmental Services', 'Corporate', 'Directorates'.",
          after: "Menu based on tasks: 'Bins and recycling', 'Council Tax', 'Parking', 'Report a problem'.",
        },
      ],
      practice: {
        task: "Create a sitemap for a small restaurant website.",
        steps: [
          "List every piece of content the site needs (menu, booking, allergens, opening times, events…).",
          "Write each on a card and ask a friend to group and name them.",
          "Compare their groups with yours.",
          "Draw a sitemap using the clearest labels.",
        ],
        deliverable: "A sitemap diagram and notes from your card sort.",
      },
      challenge: {
        task: "Critique the navigation of a real website that you find confusing and propose a new IA.",
        successCriteria: [
          "Identifies at least three labelling or grouping problems.",
          "The new sitemap uses user language rather than internal terms.",
          "You test it by asking two people where they'd find three specific things.",
        ],
      },
    },
    {
      id: 'b3-user-flows',
      title: 'User flows',
      summary: "A user flow maps the screens, decisions and actions a person takes to complete one task inside your product.",
      minutes: 11,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **user flow** is a diagram of the path someone takes through a product to complete a task, such as 'reset my password' or 'add a new payee'. It shows **screens**, **actions** and **decision points** (for example, 'Is the email registered?').\n\nCommon shapes: rectangles for screens, diamonds for decisions and arrows for movement.",
        },
        {
          type: 'list',
          items: [
            "Start with a clear **entry point** (e.g. 'Taps Forgot password').",
            "End with a clear **outcome** (e.g. 'Signed in').",
            "Include the **unhappy paths**: wrong code, expired link, no internet.",
            "Keep one task per flow.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Flows reveal the number of steps and all the edge cases before you design screens. It's much cheaper to remove a step from a diagram than from a finished product.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Count the steps in your happy path. If it's long, ask of each step: can we remove it, merge it or do it later?",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Adding a new payee in a banking app',
          body: "Mapping the flow shows the team forgot what happens when the account name doesn't match the name the user entered.",
          before: "Flow: Enter details → Confirm → Done.",
          after: "Flow: Enter details → Check name → [Match? Yes → Confirm → Done] [No → Show warning → Edit details or Continue anyway].",
        },
      ],
      practice: {
        task: "Draw a user flow for resetting a password, including unhappy paths.",
        steps: [
          "Write the entry point and the successful end state.",
          "Add every screen and action in between.",
          "Add decision diamonds for unregistered email, expired link and weak password.",
          "Check each path ends somewhere sensible.",
        ],
        deliverable: "A complete password reset flow diagram with at least three decision points.",
      },
      challenge: {
        task: "Map the real flow for cancelling a subscription in an app you use, then design a simpler one.",
        successCriteria: [
          "The current flow is mapped accurately, including every step.",
          "The new flow has fewer steps or less friction.",
          "Unhappy paths are still covered in the new flow.",
        ],
      },
    },
    {
      id: 'b3-wireframes',
      title: 'Wireframes',
      summary: "Wireframes are simple, low-detail layouts that focus on structure and content before colours and polish.",
      minutes: 11,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **wireframe** is a simplified sketch of a screen. It shows **what goes where** — headings, content blocks, buttons, images — using greys, boxes and plain text.\n\n**Low-fidelity** wireframes are quick sketches on paper or whiteboard. **Mid-fidelity** wireframes are neater digital versions with real content and consistent spacing, but still no brand styling.",
        },
        {
          type: 'doDont',
          do: [
            "Use real or realistic content, not lorem ipsum.",
            "Explore several layouts quickly.",
            "Label anything that isn't obvious (e.g. 'Carousel of offers').",
          ],
          dont: [
            "Add colours, photos and fonts too early.",
            "Spend hours polishing a first idea.",
            "Show wireframes without explaining that they're rough.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Wireframes keep conversations about structure and content. When a design looks finished, people comment on colours and fonts instead of whether the page answers the user's questions.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Try 'crazy eights': fold a sheet of paper into eight panels and sketch eight different versions of a screen in eight minutes. Quantity first, quality later.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A job listing page',
          body: "The wireframe focuses on what candidates need to decide whether to apply.",
          before: "A polished mock-up with brand colours that nobody has checked for content order.",
          after: "A grey wireframe showing: job title, salary range, location, key responsibilities, then 'Apply' — agreed with the team before visual design.",
        },
      ],
      practice: {
        task: "Wireframe a product detail page for an online plant shop.",
        steps: [
          "Do a crazy-eights sketch session for the page.",
          "Pick the strongest idea and redraw it more neatly.",
          "Recreate it in Figma using only greys, text and simple boxes.",
          "Use realistic content: plant name, price, care level, light needs, 'Add to basket'.",
        ],
        deliverable: "Eight quick sketches and one mid-fidelity wireframe.",
      },
      challenge: {
        task: "Wireframe a three-screen flow from the user flow you drew earlier and annotate key behaviours.",
        successCriteria: [
          "Screens match the steps in your flow.",
          "No colour or decorative styling is used.",
          "Annotations explain interactions and error states.",
        ],
      },
    },
    {
      id: 'b3-prototypes',
      title: 'Prototypes',
      summary: "Prototypes let people try a design before it's built. Choose the right fidelity for the question you want answered.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **prototype** is a working model of a design that people can interact with. It can be anything from paper screens you swap by hand to a high-fidelity Figma prototype that feels like the real app.\n\nThe key question is: **what do I need to learn?** Pick the cheapest prototype that answers it.",
        },
        {
          type: 'list',
          items: [
            "**Paper prototypes** — test the flow and content very early; minutes to make.",
            "**Clickable wireframes** — test navigation and structure.",
            "**High-fidelity prototypes** — test visual clarity, micro-interactions and details, or show stakeholders the final experience.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Prototypes turn opinions into evidence. Instead of debating whether users will find the filter, you watch five people try.",
        },
        {
          type: 'callout',
          tone: 'warning',
          body: "Polished prototypes can make people hesitant to criticise ('it looks finished'). When testing early ideas, rough is often better — people give more honest feedback.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Testing a new navigation',
          body: "A team wants to know if a bottom tab bar or a side menu works better for their pharmacy app. They build two clickable wireframe prototypes in an afternoon and ask people to find 'repeat prescriptions' in each — no visual design needed.",
        },
      ],
      practice: {
        task: "Make a paper prototype and test it with one person.",
        steps: [
          "Sketch four screens of a simple task (e.g. booking a haircut) on separate cards.",
          "Ask someone to 'tap' with their finger while you swap cards.",
          "Note where they hesitate or tap something you didn't expect.",
          "Revise the sketches based on what you saw.",
        ],
        deliverable: "Paper screens, test notes and a revised version.",
      },
      challenge: {
        task: "Build the same flow as a paper prototype and a Figma prototype, test both, and compare the feedback.",
        successCriteria: [
          "Both prototypes cover the same task.",
          "Each is tested with at least one person.",
          "You describe how the type of feedback differed between them.",
        ],
      },
    },
    {
      id: 'b3-usability-testing',
      title: 'Usability testing',
      summary: "Watch real people try to complete tasks with your design to find where they get stuck — then fix it.",
      minutes: 13,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "In a **usability test**, you give someone a realistic task ('You want to send £20 to a friend — show me how you'd do it') and watch them try, using a prototype or live product. You're testing the design, not the person.\n\nTesting with around five people is often enough to spot the most common problems in a flow; then fix them and test again.",
        },
        {
          type: 'list',
          ordered: true,
          items: [
            "Write 3–5 realistic tasks with a clear goal.",
            "Recruit people who match your users.",
            "Ask them to think aloud as they go.",
            "Observe without helping; note where they hesitate, err or give up.",
            "Summarise issues and rate how serious each one is.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Teams are too close to their product to see its problems. Watching even one person struggle with something you thought was obvious is one of the fastest ways to improve a design.",
        },
        {
          type: 'doDont',
          do: ["Use scenarios, not instructions.", "Stay neutral: 'What would you do next?'", "Record issues with evidence (quotes, timestamps)."],
          dont: ["Use words that appear on the button ('Click Transfer').", "Explain the design when they're stuck.", "Argue with participants' feedback."],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Writing a good task',
          body: "Task wording can accidentally give away the answer.",
          before: "'Click on Account Settings and change your notification preferences.'",
          after: "'You're getting too many emails from the app. Show me how you'd sort that out.'",
        },
        { type: 'link', url: 'https://www.nngroup.com/articles/ten-usability-heuristics/', title: "Nielsen Norman Group: 10 Usability Heuristics", description: 'A classic checklist that helps you describe the usability issues you observe.' },
      ],
      practice: {
        task: "Run a usability test of your prototype with three people.",
        steps: [
          "Write three scenario-based tasks.",
          "Run each session for about 15 minutes, asking people to think aloud.",
          "Note every problem with a short quote or observation.",
          "Rate each issue as minor, moderate or severe.",
        ],
        deliverable: "A test report listing issues, evidence and severity.",
      },
      challenge: {
        task: "Test an existing app's key task with five people and present your top three findings with recommendations.",
        successCriteria: [
          "Tasks are neutral and scenario-based.",
          "Each finding is backed by what you observed across participants.",
          "Recommendations are specific and linked to each finding.",
        ],
      },
    },
    {
      id: 'b3-iteration',
      title: 'Iteration',
      summary: "Design improves through cycles of making, testing and refining. Learn how to iterate with purpose, not just endlessly tweak.",
      minutes: 9,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Iteration** means improving a design in repeated cycles: design → test → learn → change → test again. Each round should be driven by evidence, such as what you saw in a usability test.\n\nIteration continues after launch too: feedback, support tickets and analytics feed the next round.",
        },
        {
          type: 'list',
          items: [
            "**Prioritise** — fix severe problems that block tasks before minor polish.",
            "**Change one idea at a time** where possible, so you learn what worked.",
            "**Keep versions** — label them (v1, v2) and note what changed and why.",
            "**Know when to stop** — when people complete the task comfortably, move on.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Nobody gets a design right first time — not even experienced designers. Teams that iterate quickly learn faster and waste less effort than teams that try to perfect a design in secret.",
        },
        {
          type: 'callout',
          tone: 'warning',
          body: "Iteration isn't changing things because a stakeholder feels differently today. Tie each change to a finding or a goal, and write it down.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A sign-up screen over three rounds',
          body: "Round 1: people missed the password rules and got errors. Round 2: rules shown upfront — errors dropped, but people didn't understand 'Workspace URL'. Round 3: that field was moved after sign-up with a plain explanation. Each change was based on test evidence.",
        },
      ],
      practice: {
        task: "Take the issues from your usability test and create version 2 of your design.",
        steps: [
          "Sort the issues by severity.",
          "Fix the top three issues in a new version of your design.",
          "Write a change log: issue → change → why.",
          "Retest with one or two new people.",
        ],
        deliverable: "Version 2 of your design and a short change log.",
      },
      challenge: {
        task: "Run three full iteration cycles on a small flow and document how it evolved.",
        successCriteria: [
          "Each cycle includes testing with at least one person.",
          "Every change links back to a specific finding.",
          "The final summary explains what you would still improve and why you stopped.",
        ],
      },
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Module 4 — UI Design                                                */
/* ------------------------------------------------------------------ */

const m4Ui: Module = {
  id: 'b-m4-ui',
  title: 'UI Design',
  stage: 'UI',
  summary: "Turn the visual basics into real interface skills: type and colour systems, grids, core components, states, responsive layouts and accessible UI.",
  outcome: "You'll be able to design consistent, responsive, accessible screens using systems and patterns that developers can build.",
  kind: 'lessons',
  published: true,
  lessons: [
    {
      id: 'b4-type-scales-pairing',
      title: 'Type scales & pairing',
      summary: "Build a type scale from a ratio, define named text roles, and pair typefaces only when it genuinely adds something.",
      minutes: 13,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "In module 1 you learned to make text readable. Now you'll make it **systematic**. A **type scale** is a fixed set of sizes generated from a base size and a ratio. For example, a base of 16px and a ratio of 1.25 gives roughly 16, 20, 25, 31, 39.\n\nSmaller ratios (1.125–1.2) suit dense apps and dashboards; larger ratios (1.25–1.333) suit marketing pages and editorial layouts with dramatic headlines.",
        },
        { type: 'interactive', widget: 'type-scale', caption: 'Change the base size and ratio to generate a type scale and compare it at different sizes.' },
        {
          type: 'list',
          items: [
            "Name sizes by **role**, not number: Display, H1, H2, H3, Body, Body small, Caption, Label.",
            "Give each role a line height and weight; tighter line heights for large headings, looser for body.",
            "Round sizes to whole pixels, and keep the total number of roles small (six to eight).",
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Pairing typefaces',
          body: "A second typeface should add contrast of *character*, not just be different. Common safe pairs: a serif for headings with a sans-serif for body (editorial feel), or one versatile sans-serif family using weight for contrast. Avoid pairing two very similar sans-serifs — it just looks like a mistake.",
        },
        {
          type: 'callout',
          tone: 'why',
          body: "A scale removes guesswork. Instead of asking 'is this 18 or 19px?', you choose a role. Screens become consistent, and developers can map roles directly to code.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A SaaS dashboard vs a travel blog',
          body: "The same scale doesn't suit every product. A dashboard needs compact, many-level hierarchy; a blog needs expressive headlines.",
          before: "The dashboard uses a 1.5 ratio: headings are huge and push data below the fold.",
          after: "The dashboard uses 1.2 with a single sans-serif; the blog uses 1.333 with a serif headline font and sans-serif body.",
        },
      ],
      practice: {
        task: "Create a type scale for a recipe app and set it up as text styles in Figma.",
        steps: [
          "Choose a base size (16px) and a ratio; generate six sizes.",
          "Assign roles: Display, H1, H2, Body, Body small, Caption.",
          "Set line height and weight for each and create text styles.",
          "Design one recipe screen using only those styles.",
        ],
        deliverable: "A documented type scale and a recipe screen that uses only its styles.",
      },
      challenge: {
        task: "Design the same article header with two different typeface pairings and justify which fits the brand better.",
        successCriteria: [
          "Both versions use the same type scale.",
          "Pairings have clear contrast in character.",
          "Your justification refers to the product's audience and tone.",
        ],
      },
    },
    {
      id: 'b4-colour-systems',
      title: 'Colour systems',
      summary: "Go from a few brand colours to a full system: tonal ramps, semantic roles and tokens that work in light and dark.",
      minutes: 14,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **colour system** organises colours so designers use them consistently. It usually has two layers:\n\n**Palettes (ramps)** — each hue in steps from light to dark, often numbered 50–900 (e.g. `blue-100` to `blue-900`). **Semantic roles** — names that describe purpose, like `background`, `text/subtle`, `action/primary`, `feedback/error`, which point at palette values.",
        },
        {
          type: 'list',
          items: [
            "Build a **neutral ramp** first — most of your UI is greys.",
            "Build ramps for primary and semantic colours (success, warning, error, info).",
            "Check contrast for common pairings, e.g. text on background, white text on the primary button.",
            "Map semantic roles to different ramp steps for dark mode rather than simply inverting colours.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Without semantic roles, designers pick 'a blue' and the product ends up with twelve blues. With roles, the question becomes 'what is this colour for?', which keeps meaning consistent and makes theming possible.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Look at how Material Design and Apple's guidelines describe colour roles for ideas — but build ramps that suit your own brand.",
        },
        { type: 'link', url: 'https://m3.material.io', title: 'Material Design 3', description: "Google's design system, including a detailed approach to colour roles." },
      ],
      example: [
        {
          type: 'example',
          title: 'A banking app error message',
          body: "Semantic names make intent obvious and survive theme changes.",
          before: "Error text coloured `#D93025` directly, which is unreadable on the dark theme background.",
          after: "Error text uses `feedback/error/text`, which maps to `red-700` in light mode and `red-300` in dark mode, both passing contrast.",
        },
      ],
      practice: {
        task: "Build a small colour system for a fitness app.",
        steps: [
          "Create a neutral ramp of 8–10 steps and a primary ramp of 8–10 steps.",
          "Add short ramps for success, warning and error.",
          "Define about ten semantic roles and map each to a ramp step.",
          "Apply only semantic roles to a screen, and check text contrast.",
        ],
        deliverable: "Colour ramps, a semantic role table and one screen using the roles.",
      },
      challenge: {
        task: "Add a dark theme to your colour system by remapping semantic roles, then apply it to the same screen.",
        successCriteria: [
          "No new colours are drawn directly on the screen — only roles.",
          "Both themes pass contrast for body text.",
          "Primary actions remain the most noticeable element in both themes.",
        ],
      },
    },
    {
      id: 'b4-grids',
      title: 'Grids',
      summary: "Column grids give layouts structure and rhythm. Learn columns, gutters and margins, and how they change across screen sizes.",
      minutes: 12,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **layout grid** divides the screen into **columns** separated by **gutters**, with **margins** on each side. Content spans a whole number of columns, which keeps edges aligned across sections and screens.\n\nCommon starting points: **4 columns** on mobile, **8** on tablet and **12** on desktop. Twelve is popular because it divides neatly into halves, thirds, quarters and sixths.",
        },
        { type: 'interactive', widget: 'grid-playground', caption: 'Adjust columns, gutters and margins and see how content blocks snap to the grid.' },
        {
          type: 'list',
          items: [
            "**Columns** — flexible widths that stretch with the screen.",
            "**Gutters** — fixed gaps between columns (often 16–24px).",
            "**Margins** — space between the grid and the screen edge.",
            "**Max width** — on very wide screens, cap the content width so lines don't get too long.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Grids make many small alignment decisions for you and keep complex pages coherent. They also match how front-end layouts are built, which makes responsive behaviour easier to agree on.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "In Figma, add a layout grid to a frame and save it as a style. Grids are a guide, not a cage — full-bleed images and small details can break out on purpose.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A product listing page',
          body: "On a 12-column desktop grid, filters span 3 columns and products span 9, showing three products per row (3 columns each). On a 4-column mobile grid, filters move into a sheet and each product spans 2 columns.",
          before: "Product cards with slightly different widths and a sidebar that doesn't line up with the header.",
          after: "Everything snaps to a 12-column grid with 24px gutters, and edges line up from header to footer.",
        },
      ],
      practice: {
        task: "Set up mobile and desktop grids in Figma and lay out a landing page on them.",
        steps: [
          "Create a 1440px desktop frame with a 12-column grid, 24px gutters and a max content width.",
          "Create a 390px mobile frame with a 4-column grid and 16px margins.",
          "Lay out a hero, a three-feature row and a footer on each.",
          "Check every block starts and ends on a column edge.",
        ],
        deliverable: "Two frames with grids and a landing page aligned to them.",
      },
      challenge: {
        task: "Design a news homepage on a 12-column grid that uses at least three different column spans.",
        successCriteria: [
          "Every element aligns to the grid, apart from deliberate full-bleed elements.",
          "Uses at least three spans (e.g. 8/4, 6/6, 4/4/4).",
          "Includes a tablet version on an 8-column grid.",
        ],
      },
    },
    {
      id: 'b4-spacing-systems',
      title: 'Spacing systems',
      summary: "Turn a spacing scale into a system: named tokens, rules for inside vs between, and consistent density across the product.",
      minutes: 11,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "In module 1 you learned to use a spacing scale. A **spacing system** goes further: it gives each value a **name** (a token like `space-4` or `space-md`) and **rules** for when to use it, so different designers make the same choices.\n\nMost systems use a base unit of 4 or 8 and a scale such as 4, 8, 12, 16, 24, 32, 48, 64.",
        },
        { type: 'interactive', widget: 'spacing-scale', caption: 'Compare a 4-point and 8-point scale and see how each affects density.' },
        {
          type: 'list',
          items: [
            "**Inside components** (padding): small values, e.g. 8–16.",
            "**Between related items**: small to medium, e.g. 8–16.",
            "**Between groups or sections**: larger values, e.g. 24–64.",
            "**Density**: data-heavy tools may use a compact set; consumer apps often feel roomier.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "A system turns spacing from taste into a shared language. Developers can use the same tokens in code, and reviews can focus on 'this should be a section gap' instead of pixel arguments.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Use Figma number variables for your spacing tokens and apply them to Auto Layout gaps and padding, so the file and the code share the same names.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Two designers, one settings page',
          body: "Without a system, one designer uses 20px between sections and another 28px. With rules — 'section gap = space-8 (32px), row gap = space-4 (16px)' — both pages look like the same product.",
        },
      ],
      practice: {
        task: "Document a spacing system and apply it to two different screens.",
        steps: [
          "Define 6–8 spacing tokens with names and pixel values.",
          "Write three usage rules (inside components, between items, between sections).",
          "Create them as number variables in Figma.",
          "Apply them to a profile screen and a settings screen.",
        ],
        deliverable: "A spacing token table with rules and two screens that follow it.",
      },
      challenge: {
        task: "Create a 'comfortable' and a 'compact' density version of a data list using the same token set.",
        successCriteria: [
          "Both versions use only tokens from your system.",
          "The compact version is clearly denser but still readable.",
          "You explain when each density should be used.",
        ],
      },
    },
    {
      id: 'b4-components',
      title: 'Components',
      summary: "Think in components: identify reusable UI patterns, define their anatomy and states, and build a small, consistent kit.",
      minutes: 12,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "In the Figma module you learned *how* to build components. This lesson is about *which* components to design and how to define them well.\n\nA UI component is a reusable piece of interface with a clear job — a button, a chip, a toast, a tab bar. Each has an **anatomy** (its parts), **variants** (types and sizes), **states** (default, hover, focus, disabled…) and **usage guidelines**.",
        },
        {
          type: 'list',
          items: [
            "**Anatomy** — e.g. a chip has a container, label, optional leading icon and optional remove icon.",
            "**Variants** — e.g. filter chip vs input chip.",
            "**States** — including keyboard focus and disabled.",
            "**Content rules** — label length, capitalisation, truncation.",
            "**When not to use it** — as important as when to use it.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Components are promises. When the same component always looks and behaves the same way, users learn it once and trust it everywhere. Consistency also makes design and development faster.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Before creating a new component, check whether an existing one can do the job with a variant. Too many near-identical components is a common source of mess.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Auditing an app for components',
          body: "Screenshots of a delivery app reveal seven slightly different card styles. The team defines one card component with three variants: restaurant, dish and promotion.",
          before: "Seven one-off card designs with different radii, shadows and padding.",
          after: "One Card component with three documented variants and shared spacing, radius and elevation.",
        },
      ],
      practice: {
        task: "Run a component audit of an app you use.",
        steps: [
          "Take screenshots of eight to ten screens.",
          "Cut out every repeated UI element and group similar ones.",
          "Name each group as a component and count its variations.",
          "Pick one and write its anatomy, variants and states.",
        ],
        deliverable: "An audit board of grouped elements and one component spec.",
      },
      challenge: {
        task: "Design and document a 'toast' notification component for success, error and info messages.",
        successCriteria: [
          "Anatomy, variants and states are documented.",
          "Content rules cover message length and actions.",
          "Includes guidance on when to use a toast versus an inline message.",
        ],
      },
    },
    {
      id: 'b4-buttons',
      title: 'Buttons',
      summary: "Design buttons with clear hierarchy, helpful labels, every state and comfortable tap targets.",
      minutes: 11,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Buttons trigger actions, so they need to be obvious, clearly labelled and ranked by importance. Most systems have a **primary** button (the main action), a **secondary** button (alternatives), a **tertiary / text** button (low-emphasis actions) and a **destructive** style (delete, cancel subscription).",
        },
        { type: 'interactive', widget: 'button-states', caption: 'Step through default, hover, pressed, focus, disabled and loading states.' },
        {
          type: 'doDont',
          do: [
            "Use one primary button per view or section.",
            "Write labels as verb + object: 'Save changes', 'Book table'.",
            "Show a visible keyboard focus state.",
            "Make tap targets comfortable (around 44×44px or larger on touch screens).",
          ],
          dont: [
            "Use vague labels like 'OK', 'Submit' or 'Click here'.",
            "Put two equally strong buttons side by side.",
            "Rely on disabled buttons without explaining why they're disabled.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Buttons are where users commit. A clear label reduces anxiety ('Pay £32.40' tells people exactly what will happen), and clear hierarchy stops people accidentally choosing the wrong option.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Deleting a project',
          body: "Confirmation dialogs often make the dangerous action and the safe action look identical.",
          before: "Dialog 'Are you sure?' with two identical blue buttons: 'Yes' and 'No'.",
          after: "Dialog 'Delete Website Redesign?' with a red 'Delete project' button and a secondary 'Keep project' button.",
        },
      ],
      practice: {
        task: "Design a complete button set in Figma.",
        steps: [
          "Create primary, secondary, tertiary and destructive styles.",
          "Add states: default, hover, pressed, focus, disabled, loading.",
          "Check label contrast for every state.",
          "Place them in a checkout screen with correct hierarchy.",
        ],
        deliverable: "A button component set with all states and one screen using it.",
      },
      challenge: {
        task: "Rewrite the button labels in a real app's key flow and redesign the hierarchy of one screen.",
        successCriteria: [
          "Every label says what will happen.",
          "Each screen has only one primary action.",
          "Destructive actions are visually distinct and labelled specifically.",
        ],
      },
    },
    {
      id: 'b4-forms',
      title: 'Forms',
      summary: "Design forms that are quick to complete: fewer fields, clear labels, helpful input types and kind error messages.",
      minutes: 14,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Forms are where users give you information — signing up, checking out, applying. Every extra field is effort, so the first question is always: **do we need this?**\n\nA good form has visible labels, one column, logical grouping, sensible input types and messages that help people fix problems.",
        },
        {
          type: 'doDont',
          do: [
            "Put labels above fields and keep them visible while typing.",
            "Use one column so people move straight down.",
            "Mark optional fields as '(optional)' rather than starring every required one.",
            "Use the right keyboard/input type (email, number, date).",
          ],
          dont: [
            "Use placeholder text instead of labels — it disappears when typing.",
            "Split phone numbers or dates into many tiny boxes without good reason.",
            "Show errors only after the whole form is submitted, far from the field.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Forms are often the last step before value — a purchase, an account, an application. Friction here directly causes people to give up, and confusing errors make them feel stupid.",
        },
        {
          type: 'list',
          items: [
            "**Error messages** say what went wrong and how to fix it: 'Enter a date in the past', not 'Invalid input'.",
            "Show errors next to the field, with an icon and text — not just a red border.",
            "Keep what people typed when there's an error.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A delivery address form',
          body: "Small decisions make a big difference to a checkout.",
          before: "Two columns, placeholder-only labels, 'Address line 3' required, error 'Field invalid' at the top of the page.",
          after: "One column, visible labels, postcode lookup with manual entry option, optional fields marked, error 'Enter a UK postcode, like SW1A 1AA' under the field.",
        },
      ],
      practice: {
        task: "Redesign a sign-up form for a gym membership.",
        steps: [
          "List every field the current form might ask for, and remove any that aren't needed now.",
          "Group the remaining fields (About you, Membership, Payment).",
          "Design it in one column with visible labels and helper text where needed.",
          "Design error states for three fields with specific messages.",
        ],
        deliverable: "A redesigned form with default and error states.",
      },
      challenge: {
        task: "Design a multi-step checkout form with a progress indicator and a review step.",
        successCriteria: [
          "Each step has a clear purpose and a specific button label.",
          "People can go back without losing data.",
          "Error messages are specific and placed next to fields.",
          "Fields use appropriate input types.",
        ],
      },
    },
    {
      id: 'b4-cards',
      title: 'Cards',
      summary: "Cards group related content into a scannable, tappable unit. Learn when to use them and how to keep them consistent.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **card** is a container that groups information about a single thing — a product, an article, a restaurant, a booking. Cards usually contain an image or icon, a title, a few key details and an action.\n\nThey work well in feeds and grids where people browse and compare many similar items.",
        },
        {
          type: 'list',
          items: [
            "**Consistent structure** — every card shows the same information in the same place.",
            "**Clear click target** — either the whole card is tappable, or specific buttons are; avoid confusing mixtures.",
            "**Hierarchy inside** — title first, key detail (e.g. price) second, metadata smaller.",
            "**Subtle separation** — a border, background or light shadow, not all three.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Cards make it easy to scan and compare. But if everything becomes a card — including single pieces of text — the screen gets boxy and heavy. Use them for collections of similar items.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Design cards with worst-case content: long titles, missing images, zero reviews. Real data is messy.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Holiday rental cards',
          body: "Guests compare location, price and rating quickly, so every card must show them in the same order.",
          before: "Some cards show price at the top, some at the bottom; rating is missing on new listings, leaving a gap.",
          after: "Image, location, title, then price and rating in fixed positions; new listings show a 'New' label instead of an empty rating.",
        },
      ],
      practice: {
        task: "Design a card component for a course listing and stress-test it.",
        steps: [
          "Design the card with image, title, instructor, length and a 'View course' action.",
          "Build it with Auto Layout.",
          "Create versions with a very long title, no image and no ratings.",
          "Adjust the design until every version still looks tidy.",
        ],
        deliverable: "A card component with three stress-test versions.",
      },
      challenge: {
        task: "Design a grid of mixed cards (article, video, event) that still feels consistent.",
        successCriteria: [
          "Shared elements (title, metadata) sit in the same positions.",
          "Each type is distinguishable at a glance.",
          "The grid aligns cleanly to your layout grid.",
        ],
      },
    },
    {
      id: 'b4-navigation',
      title: 'Navigation',
      summary: "Choose and design navigation patterns — tab bars, top bars, sidebars — that help people know where they are and where they can go.",
      minutes: 12,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Navigation answers three questions for users: **Where am I? Where can I go? How do I get back?** The right pattern depends on the number of destinations and the device.",
        },
        {
          type: 'list',
          items: [
            "**Bottom tab bar (mobile)** — 3–5 top-level destinations, always visible, easy to reach with a thumb.",
            "**Top app bar** — screen title, back button and a few actions.",
            "**Side navigation (desktop)** — many sections, common in SaaS tools and dashboards.",
            "**Top navigation (web)** — a handful of sections on marketing sites.",
            "**Breadcrumbs** — show the path in deep hierarchies like online shops.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Hidden navigation (like a hamburger menu) is often used less, because people can't see what's there. Visible navigation makes the product's main areas obvious and easy to switch between.",
        },
        {
          type: 'doDont',
          do: ["Show the current location clearly (active state).", "Use short, familiar labels with icons.", "Keep navigation in the same place on every screen."],
          dont: ["Put more than five items in a mobile tab bar.", "Use icons without labels for main navigation.", "Change navigation order between screens."],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A fitness app',
          body: "Moving key areas out of a hidden menu makes them discoverable.",
          before: "Hamburger menu containing Home, Workouts, Progress, Community, Settings, Help, Shop.",
          after: "Bottom tab bar with Home, Workouts, Progress, Profile; Settings, Help and Shop live inside Profile.",
        },
        { type: 'link', url: 'https://developer.apple.com/design/human-interface-guidelines', title: 'Apple Human Interface Guidelines', description: "Apple's guidance on tab bars, navigation bars and more." },
      ],
      practice: {
        task: "Design the navigation for a mobile banking app.",
        steps: [
          "List all the destinations the app needs.",
          "Choose four or five for the bottom tab bar and group the rest.",
          "Design the tab bar with icons, labels and a clear active state.",
          "Design a top bar for a detail screen with back navigation.",
        ],
        deliverable: "A tab bar, a detail-screen top bar and a navigation map.",
      },
      challenge: {
        task: "Design desktop navigation for the same banking product and explain how it maps to mobile.",
        successCriteria: [
          "Uses a pattern suited to desktop (e.g. side navigation).",
          "Top-level destinations match the mobile version.",
          "Current location is always obvious.",
        ],
      },
    },
    {
      id: 'b4-tables',
      title: 'Tables',
      summary: "Design data tables people can scan, compare and act on — with sensible alignment, density and row actions.",
      minutes: 12,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Tables** are the best way to show many items with the same attributes — orders, invoices, users, transactions — where people need to compare and scan.\n\nGood tables are quiet: minimal borders, clear headers and alignment that helps the eye.",
        },
        {
          type: 'list',
          items: [
            "**Left-align text**, **right-align numbers** so digits line up, and use tabular (fixed-width) numerals if your font supports them.",
            "Keep headers short and clear, and make sortable columns obvious.",
            "Use subtle row dividers or zebra striping — not heavy grid lines.",
            "Put row actions at the end, or in an overflow menu.",
            "Support bulk selection with checkboxes when people act on many rows.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "In business tools, people spend hours in tables. Small improvements to scanning, like aligned numbers or a frozen header, save real time and prevent costly mistakes.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "On mobile, wide tables rarely work. Consider turning each row into a card, or showing only key columns with a tap to see details.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'An invoices table',
          body: "Accountants compare amounts and spot overdue invoices.",
          before: "Every cell centred, amounts in mixed formats, heavy black borders, status shown only by row colour.",
          after: "Text left-aligned, amounts right-aligned in one currency format, light dividers, status as a labelled badge ('Overdue').",
        },
      ],
      practice: {
        task: "Design an orders table for an online shop's admin panel.",
        steps: [
          "Choose columns: order number, customer, date, status, total, actions.",
          "Apply correct alignment and a consistent date and currency format.",
          "Add status badges with text, a sortable date column and a row action menu.",
          "Design selected, hover and empty versions.",
        ],
        deliverable: "An orders table with alignment, states and actions.",
      },
      challenge: {
        task: "Design the same orders table for mobile and explain what you removed or changed.",
        successCriteria: [
          "Key information is still visible without horizontal scrolling.",
          "Users can still reach each order's details and actions.",
          "Your explanation justifies every column you hid.",
        ],
      },
    },
    {
      id: 'b4-dashboards',
      title: 'Dashboards',
      summary: "Dashboards should answer the user's key questions at a glance. Learn to prioritise information, not just display it.",
      minutes: 13,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "A **dashboard** gives an overview of important information so people can understand what's happening and decide what to do. The trap is showing everything simply because the data exists.\n\nStart by asking: **who uses this, what decisions do they make, and what do they need to know first?**",
        },
        {
          type: 'list',
          items: [
            "**Top** — the few numbers that matter most, with context (compared to last week, against a target).",
            "**Middle** — trends and breakdowns in simple charts.",
            "**Bottom** — detailed lists or tables for action.",
            "Choose chart types for the question: line for change over time, bar for comparing categories.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "A number without context is hard to act on. '£4,210 in sales today' means little; '£4,210 today, lower than the usual Tuesday' prompts a decision. Good dashboards turn data into understanding.",
        },
        {
          type: 'callout',
          tone: 'warning',
          body: "When designing with sample data, make it clearly realistic but fictional. Never present made-up numbers as real results in case studies or portfolios.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A café owner’s dashboard',
          body: "The owner checks it each morning to plan staffing and stock.",
          before: "Twelve charts of equal size including page views, social followers and server uptime.",
          after: "Top: today's bookings and yesterday's sales vs a typical day. Middle: sales by hour. Bottom: low-stock items with a 'Reorder' action.",
        },
      ],
      practice: {
        task: "Design a one-screen dashboard for a small online shop owner.",
        steps: [
          "Write the three questions the owner asks every morning.",
          "Pick the metrics and charts that answer each question.",
          "Lay them out top to bottom by importance on a 12-column grid.",
          "Add context to each key number (comparison or target).",
        ],
        deliverable: "A dashboard screen with annotated questions it answers.",
      },
      challenge: {
        task: "Redesign a cluttered dashboard (find one online or make one) by removing at least half its widgets.",
        successCriteria: [
          "Each remaining widget answers a stated user question.",
          "Chart types suit the data being shown.",
          "Key numbers include comparison or context.",
          "The layout follows a clear top-to-bottom priority.",
        ],
      },
    },
    {
      id: 'b4-empty-states',
      title: 'Empty states',
      summary: "Empty states appear when there's nothing to show yet. Use them to explain, guide and help people take the next step.",
      minutes: 9,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "An **empty state** is what a screen looks like when there's no content: a new user's empty inbox, a search with no results, a cleared to-do list. Designers often forget them because mock-ups are always full of perfect data.",
        },
        {
          type: 'list',
          items: [
            "**First use** — explain what will appear here and how to get started.",
            "**No results** — say nothing matched and suggest what to try (check spelling, remove filters).",
            "**User cleared** — confirm success ('All caught up').",
            "**No permission** — explain why and who can help.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "A blank screen makes people wonder if something is broken. A helpful empty state turns a dead end into a starting point — often the first real impression of a feature.",
        },
        {
          type: 'checklist',
          title: 'A good empty state has',
          items: [
            "A short headline that says what's happening.",
            "One sentence explaining why or what will appear.",
            "A clear primary action where one makes sense.",
            "An optional simple illustration or icon — never at the expense of clarity.",
          ],
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A project management tool',
          body: "The same empty board can confuse or onboard.",
          before: "A blank grey area with the text 'No data'.",
          after: "'No tasks yet — Tasks you create or are assigned will appear here.' with a 'Create a task' button.",
        },
      ],
      practice: {
        task: "Design four empty states for a notes app.",
        steps: [
          "Design a first-use state for a brand-new user.",
          "Design a 'no search results' state with suggestions.",
          "Design an 'all notes archived' state.",
          "Check each has a headline, explanation and appropriate action.",
        ],
        deliverable: "Four empty state screens.",
      },
      challenge: {
        task: "Find three empty states in real apps, critique them and redesign the weakest one.",
        successCriteria: [
          "Critique names the type of empty state for each.",
          "The redesign has a clear next step.",
          "Copy is specific and friendly, not generic.",
        ],
      },
    },
    {
      id: 'b4-loading-states',
      title: 'Loading states',
      summary: "Loading states show that something is happening. Choose between spinners, skeletons and progress bars to keep people informed.",
      minutes: 10,
      difficulty: 'Easy',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Whenever an app fetches data or processes an action, there's a wait. A **loading state** reassures people that the app is working and sets expectations about how long it will take.",
        },
        {
          type: 'list',
          items: [
            "**Spinner** — short, unknown waits, often for a single action.",
            "**Skeleton screen** — grey placeholder shapes that match the layout while content loads; feels faster and avoids layout jumps.",
            "**Progress bar** — longer tasks where progress can be measured, like uploads.",
            "**Button loading** — replace the label with a spinner (or 'Saving…') and prevent double-taps.",
            "**Optimistic UI** — show the result immediately (e.g. a 'like') and handle failure if it happens.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Without feedback, people tap again, refresh or leave — which can cause duplicate payments or lost data. The right loading state makes waits feel shorter and prevents errors.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "For long processes, tell people what's happening in plain words ('Checking your documents…') and whether they can leave the screen.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'Paying for a food order',
          body: "The pay button is the riskiest moment for a double tap.",
          before: "Tapping 'Pay' shows nothing for three seconds; users tap again and worry about being charged twice.",
          after: "The button immediately shows a spinner with 'Processing payment…', is disabled until complete, then moves to the confirmation screen.",
        },
      ],
      practice: {
        task: "Design loading states for a social feed.",
        steps: [
          "Design a skeleton version of the feed that matches the real layout.",
          "Design a 'Post' button loading state.",
          "Design an image upload progress state.",
          "Note which state appears in which situation.",
        ],
        deliverable: "Three loading states with notes on when each is used.",
      },
      challenge: {
        task: "Design the full sequence for a long task (e.g. uploading a video) from start to success, including a slow connection.",
        successCriteria: [
          "Shows progress and tells people whether they can leave the screen.",
          "Includes a state for an unusually slow upload.",
          "Ends with a clear success or next step.",
        ],
      },
    },
    {
      id: 'b4-error-states',
      title: 'Error states',
      summary: "Errors will happen. Design messages and states that explain what went wrong and help people recover without blame.",
      minutes: 11,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Error states** appear when something goes wrong: a failed payment, no internet connection, a server problem or invalid input. Great products don't avoid all errors — they help people recover quickly.\n\nA good error message answers: **What happened? Why (if useful)? What can I do now?**",
        },
        {
          type: 'doDont',
          do: [
            "Use plain language: 'We couldn't connect. Check your internet and try again.'",
            "Offer a way forward: 'Try again', 'Use another card'.",
            "Keep the user's data so they don't start over.",
            "Place the error close to where the problem is.",
          ],
          dont: [
            "Show technical codes alone ('Error 500').",
            "Blame the user ('You entered it wrong').",
            "Use jokes for serious errors like failed payments.",
            "Rely on colour alone to signal the error.",
          ],
        },
        {
          type: 'list',
          items: [
            "**Inline errors** — for form fields.",
            "**Banners** — for problems affecting the whole page (e.g. offline).",
            "**Full-screen errors** — when the page can't load at all.",
            "**Toasts** — brief failures of background actions, with a retry option.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "Errors are high-stress moments, especially involving money or personal data. A calm, clear message maintains trust; a vague one sends people to customer support — or to a competitor.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A declined card at checkout',
          body: "The message should help the customer finish their purchase.",
          before: "'Transaction failed. Error code 05.'",
          after: "'Your bank declined this payment. Try another card or contact your bank. Your basket is saved.' with 'Use another card' as the primary button.",
        },
      ],
      practice: {
        task: "Design error states for a food delivery checkout.",
        steps: [
          "Design an inline error for an invalid postcode.",
          "Design a banner for when the restaurant closes during checkout.",
          "Design a payment declined state.",
          "Design an offline state that keeps the basket intact.",
        ],
        deliverable: "Four error states with clear recovery actions.",
      },
      challenge: {
        task: "Collect five real error messages from apps you use and rewrite them.",
        successCriteria: [
          "Each rewrite says what happened and what to do next.",
          "No technical jargon or blame.",
          "Tone suits the seriousness of the situation.",
        ],
      },
    },
    {
      id: 'b4-responsive-design',
      title: 'Responsive design',
      summary: "Design layouts that adapt to any screen size using breakpoints, flexible grids and content priority.",
      minutes: 13,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "**Responsive design** means a layout adapts to the size of the screen, from small phones to large monitors. Instead of designing a few fixed pictures, you define how content **reflows** as space changes.\n\n**Breakpoints** are the widths where the layout changes significantly — for example, from a single column on mobile to two columns on tablet and a sidebar layout on desktop.",
        },
        {
          type: 'list',
          items: [
            "**Stack** — side-by-side items become vertical on narrow screens.",
            "**Reveal / hide** — secondary content moves into menus or tabs on mobile.",
            "**Resize** — images and columns scale within limits (min and max widths).",
            "**Reposition** — navigation moves from a sidebar to a bottom bar.",
          ],
        },
        {
          type: 'callout',
          tone: 'why',
          body: "People switch between devices constantly — browsing on a phone, buying on a laptop. If the experience breaks on one of them, you lose them. Responsive thinking also makes developers' work clearer.",
        },
        {
          type: 'callout',
          tone: 'tip',
          body: "Many teams design mobile first: it forces you to decide what matters most. Then use extra space on bigger screens purposefully rather than just stretching everything.",
        },
      ],
      example: [
        {
          type: 'example',
          title: 'A product page across devices',
          body: "Content priority stays the same; the arrangement changes.",
          before: "Desktop layout squeezed onto mobile: tiny images, two cramped columns, 'Add to basket' below the fold.",
          after: "Mobile: image carousel, name, price, sticky 'Add to basket'. Desktop: images left, details and button right, reviews below.",
        },
      ],
      practice: {
        task: "Design a blog homepage at three breakpoints in Figma.",
        steps: [
          "Create frames at about 390px, 768px and 1440px with matching grids.",
          "Design the mobile version first with clear content priority.",
          "Adapt it for tablet and desktop, noting what stacks, moves or appears.",
          "Use Auto Layout and constraints so resizing frames behaves sensibly.",
        ],
        deliverable: "Three versions of the homepage with notes on what changes at each breakpoint.",
      },
      challenge: {
        task: "Take a desktop-only screen from a real SaaS tool and design its mobile version.",
        successCriteria: [
          "The main task is still possible on mobile.",
          "Content priority is explicitly decided, not just squeezed.",
          "Tap targets and text sizes are suitable for touch.",
        ],
      },
    },
    {
      id: 'b4-accessible-ui',
      title: 'Accessible UI',
      summary: "Put accessibility into practice: focus states, touch targets, text resizing, screen reader annotations and motion.",
      minutes: 14,
      difficulty: 'Medium',
      ...L,
      learn: [
        {
          type: 'text',
          body: "Module 1 covered the principles. Now you'll apply them to real UI decisions that designers own — and annotate what developers need to know.\n\nMany accessibility issues come from things that don't appear in a static mock-up: keyboard focus, reading order, what a screen reader announces and how the layout behaves when text is enlarged.",
        },
        {
          type: 'checklist',
          title: 'Practical accessible UI checklist',
          items: [
            "Every interactive element has a clearly visible **focus state** that meets 3:1 contrast.",
            "**Touch targets** are at least 24×24px (WCAG 2.2 minimum), ideally around 44×44px.",
            "Layouts still work when text is enlarged to 200% — nothing is cut off or overlapping.",
            "**Reading and focus order** follow the visual order; annotate it for complex layouts.",
            "Icon-only buttons have an **accessible name** annotated (e.g. 'Close dialog').",
            "Headings are marked as headings (H1, H2…) in annotations for screen readers.",
            "Animations can be reduced, and nothing flashes more than three times a second.",
          ],
        },
        { type: 'interactive', widget: 'contrast-checker', caption: 'Check your focus ring and UI borders against their backgrounds (aim for at least 3:1).' },
        {
          type: 'callout',
          tone: 'why',
          body: "Developers can't guess your intent. If you don't specify focus order, labels for icons, or heading levels, they are often missed — and people using keyboards or screen readers are shut out.",
        },
        { type: 'link', url: 'https://www.w3.org/WAI/WCAG22/quickref/', title: 'WCAG 2.2 Quick Reference', description: 'Look up specific criteria like target size and focus appearance.' },
      ],
      example: [
        {
          type: 'example',
          title: 'A modal dialog',
          body: "Dialogs are a common accessibility failure point.",
          before: "An 'x' icon with no label, no visible focus, and focus stays on the page behind the dialog.",
          after: "Annotated: focus moves to the dialog title when it opens, stays within the dialog, the close button is named 'Close', Esc closes it, and focus returns to the button that opened it.",
        },
      ],
      practice: {
        task: "Create an accessibility annotation layer for one of your screens.",
        steps: [
          "Pick a screen with a form and several buttons.",
          "Add numbered markers showing the focus order.",
          "Label heading levels and give every icon-only button an accessible name.",
          "Design visible focus states and a version with text at 200%.",
        ],
        deliverable: "An annotated screen with focus order, names, headings and a 200% text version.",
      },
      challenge: {
        task: "Audit a component set you've built against the practical checklist and fix every failure.",
        successCriteria: [
          "Every component has a visible focus state meeting 3:1.",
          "All touch targets meet at least the 24×24px minimum.",
          "Icon-only elements have documented accessible names.",
          "You list each fix you made and which checklist item it addresses.",
        ],
      },
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Course                                                              */
/* ------------------------------------------------------------------ */

export const beginnerFoundations: Course = {
  id: 'b-foundations',
  title: 'UI/UX Foundations',
  description: "A hands-on beginner course that takes you from what UI and UX mean to designing, prototyping and testing accessible screens in Figma.",
  published: true,
  modules: [m1Fundamentals, m2Figma, m3Ux, m4Ui],
}
