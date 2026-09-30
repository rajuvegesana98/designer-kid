import type { CareerGuide } from '../types'

/**
 * Career Centre: LinkedIn profile do's & don'ts and step-by-step resume
 * creation guides, one per level. These complement the positioning-focused
 * guides in library.ts (cg-linkedin-*, cg-resume-*).
 */
export const profileGuides: CareerGuide[] = [
  /* ------------------------ LinkedIn do's & don'ts: B ------------------------ */
  {
    id: 'cg-linkedin-dodont-b',
    section: 'linkedin',
    level: 'beginner',
    title: "LinkedIn profile do's and don'ts for new designers",
    summary: 'A section-by-section list of what to do and what to avoid so your profile says “UI/UX designer” at a glance.',
    minutes: 20,
    cover: 'linkedin',
    blocks: [
      { type: 'illustration', name: 'linkedin', caption: 'Every section of your profile has one job. Get each one right and the whole profile works.' },
      {
        type: 'text',
        body: "People decide whether to keep reading your profile in a few seconds. They see your photo, headline and the top of your About section first, so small mistakes there cost you the most.\n\nUse this guide as a checklist next to your own profile. Work through one area at a time, fix what you find, then move on. You do not need to be perfect — you need to be **clear, honest and easy to contact**.",
      },

      { type: 'heading', text: 'Photo and banner' },
      {
        type: 'doDont',
        do: [
          'Use a recent head-and-shoulders photo in natural light, face filling most of the frame',
          'Keep the background plain or softly blurred so your face stands out',
          'Make a simple banner in Figma with one short line about your focus',
          'Check how the banner looks on mobile, where your photo covers part of it',
        ],
        dont: [
          'Use a group photo, sunglasses selfie or an old graduation picture',
          'Leave the default grey banner — it is free space to show your craft',
          'Fill the banner with tiny text, logos or a collage of screens',
          'Use an illustration or avatar instead of your face (people want to recognise you at an event)',
        ],
      },

      { type: 'heading', text: 'Headline' },
      {
        type: 'doDont',
        do: [
          'Say the role you are aiming for, using words recruiters search for (UI Designer, UX Designer, Product Designer)',
          'Add one focus area, such as mobile apps, accessibility or e-commerce',
          'Mention two or three core skills or tools you can genuinely demonstrate',
        ],
        dont: [
          'Lead with “Aspiring”, “Seeking opportunities” or “Open to work” — the Open to Work setting already does that',
          'Stack vague adjectives like “passionate”, “creative”, “visionary”',
          'Claim a title you have not held, such as “Senior UX Consultant”',
        ],
      },
      {
        type: 'example',
        title: 'Before and after: headline',
        body: 'The improved headline tells a recruiter what you do, what you focus on and what you can use — without pretending to more experience than you have.',
        before: 'Aspiring UX designer looking for opportunities',
        after: 'Junior UI/UX Designer | Accessible mobile apps | Figma, research, prototyping',
      },

      { type: 'heading', text: 'About' },
      {
        type: 'doDont',
        do: [
          'Write in first person, in three short paragraphs: who you are, what you care about in design, what you are looking for',
          'Mention your background if you are switching careers and what it taught you about users',
          'Put your portfolio link in the first few lines, before the “see more” cut-off',
          'End with a simple call to action: “I’d love to hear from teams working on…”',
        ],
        dont: [
          'Paste your resume in paragraph form',
          'Write in the third person (“Priya is a dedicated designer…”)',
          'Open with a quote or a dictionary definition of UX',
          'Leave it empty — it is the one place your personality comes through',
        ],
      },
      {
        type: 'example',
        title: 'Before and after: About opening',
        body: 'The stronger opening is specific and human, and it gives the reader a reason to click your portfolio.',
        before: 'I am a hard-working and passionate individual who loves design and is eager to learn new things.',
        after: 'I’m a junior UI/UX designer who spent four years in hospitality, watching guests struggle with booking systems. I now design mobile flows that are simple and accessible. See my case studies: yourname.design',
      },

      { type: 'heading', text: 'Experience' },
      {
        type: 'doDont',
        do: [
          'Keep non-design jobs and add one line about what transfers (customer insight, communication, problem-solving)',
          'Add freelance or volunteer design work as a real entry, labelled honestly',
          'Match job titles and dates to your resume exactly',
        ],
        dont: [
          'Delete every non-design job — gaps raise more questions than a café job does',
          'Call a course project “freelance” or a practice brief “client work”',
          'Copy the job description of the role instead of what you did',
        ],
      },

      { type: 'heading', text: 'Featured' },
      {
        type: 'doDont',
        do: [
          'Pin your portfolio homepage first',
          'Add your single strongest case study as a direct link',
          'Include one thoughtful post if you have written one',
        ],
        dont: [
          'Pin certificates from short courses — they belong in Licences & certifications',
          'Feature more than three or four items; the first two do most of the work',
          'Link to a portfolio that is still “under construction”',
        ],
      },

      { type: 'heading', text: 'Skills and recommendations' },
      {
        type: 'doDont',
        do: [
          'Pin your three most relevant skills to the top (e.g. User Interface Design, Prototyping, Usability Testing)',
          'Only list skills you could talk about with an example',
          'Ask a course mentor, teammate or manager for a short, specific recommendation',
          'Suggest what they could mention: “Could you say something about how I ran our team’s usability tests?”',
        ],
        dont: [
          'Add fifty skills, including every tool you have opened once',
          'Swap recommendations with strangers or write your own for someone to paste',
          'Chase endorsements — they carry very little weight on their own',
        ],
      },

      { type: 'heading', text: 'Activity and posting' },
      {
        type: 'doDont',
        do: [
          'Share what you are learning in plain language — a lesson from a test, a before/after with reasoning',
          'Leave thoughtful comments on designers’ posts; comments are a low-pressure way to be seen',
          'Post occasionally and consistently rather than in bursts',
        ],
        dont: [
          'Mock a real company’s design without understanding its constraints',
          'Reshare generic motivational quotes',
          'Post only “Please hire me” updates — show your thinking instead',
        ],
      },

      { type: 'heading', text: 'Open to Work and recruiter settings' },
      {
        type: 'doDont',
        do: [
          'Set precise job titles (UI Designer, UX Designer, Product Designer) and real locations or “Remote”',
          'Choose whether the green frame is public or visible to recruiters only, based on your situation',
          'Keep your location and contact settings up to date',
        ],
        dont: [
          'Add every design-adjacent title “just in case” — it muddies your search results',
          'Turn on the public frame while employed if you do not want your employer to see it',
          'Forget to turn it off once you accept a role',
        ],
      },

      {
        type: 'qa',
        title: 'LinkedIn questions learners ask',
        items: [
          {
            question: 'Should I write “Aspiring UX Designer” until I get a job?',
            answer: 'No. “Aspiring” tells recruiters you do not see yourself as a designer yet. If you have done real projects, call yourself a Junior UI/UX Designer or UI/UX Designer and let your portfolio show your level honestly.',
            tip: 'If you are still early in learning, “UI/UX Designer in training” is honest and still searchable.',
          },
          {
            question: 'Do I need to post to get noticed?',
            answer: 'No. A complete, clear profile matters far more. Posting helps people remember you, but it is optional. Commenting thoughtfully on others’ posts is a gentler way to start.',
          },
          {
            question: 'Should I use the green Open to Work frame?',
            answer: 'It depends on you. Some people find it helps recruiters spot them; others prefer the recruiters-only setting. Neither guarantees messages. The job titles and locations you choose matter more than the frame.',
          },
          {
            question: 'How do I connect with designers I do not know?',
            answer: 'Send a short personal note saying why you want to connect — a post you enjoyed or a shared interest. Do not ask for a job or a referral in the first message.',
            tip: 'Aim for people one or two years ahead of you; they remember what the jump felt like.',
          },
          {
            question: 'Can I list my bootcamp or course projects?',
            answer: 'Yes. Add them under Projects or Featured and label them clearly as course or self-initiated projects. Honesty here builds trust; nobody expects a beginner to have client work.',
          },
          {
            question: 'My profile is in a different language from the jobs I want. What should I do?',
            answer: 'Write your profile in the language of the roles you are applying for. LinkedIn also lets you add a secondary-language version of your profile if you work across markets.',
          },
        ],
      },
      {
        type: 'checklist',
        title: 'Profile review checklist',
        items: [
          'Recent, clear photo and a simple banner',
          'Headline names a real role, a focus and core skills — no “aspiring”',
          'About section in first person with portfolio link near the top',
          'Non-design experience shows what transfers',
          'Featured pins my portfolio and best case study',
          'Top three skills are relevant and honest',
          'Open to Work titles and locations are precise',
        ],
      },
    ],
    checklist: [
      'Photo and banner reviewed against the do’s and don’ts',
      'Headline rewritten without “aspiring” or vague adjectives',
      'About section opens with who I am and links my portfolio',
      'Experience entries show transferable skills',
      'Featured section pins my portfolio and best case study',
      'Requested one specific recommendation',
      'Open to Work settings checked',
    ],
    published: true,
  },

  /* ------------------------ LinkedIn do's & don'ts: I ------------------------ */
  {
    id: 'cg-linkedin-dodont-i',
    section: 'linkedin',
    level: 'intermediate',
    title: "LinkedIn do's and don'ts for mid-level product designers",
    summary: 'Audit your profile so it signals a clear specialism, real product impact and the kind of role you want next.',
    minutes: 20,
    cover: 'linkedin',
    blocks: [
      { type: 'illustration', name: 'linkedin' },
      {
        type: 'text',
        body: "At mid-level, most profiles fail in the same way: they list tools and job titles, but do not say what kind of problems the designer is good at. Hiring managers are trying to answer “is this the right person for *our* product?”, not “can this person design?”.\n\nWork through each area below. The aim is **consistency with your resume** and a clear, honest specialism.",
      },

      { type: 'heading', text: 'Photo and banner' },
      {
        type: 'doDont',
        do: [
          'Refresh your photo if it is more than a few years old',
          'Use the banner to state your specialism or a principle you work by',
          'Keep the banner design quiet and well aligned — it is a small sample of your craft',
        ],
        dont: [
          'Put confidential product screens from your employer in the banner',
          'Use a busy mock-up collage that is unreadable at mobile size',
          'Leave a banner that describes the career you had three years ago',
        ],
      },

      { type: 'heading', text: 'Headline' },
      {
        type: 'doDont',
        do: [
          'Combine role, domain and type of problem: “Product Designer | B2B SaaS | Complex workflows”',
          'Use the title the market uses for the role you want, if it honestly matches your work',
          'Keep it scannable — three short parts, separated by bars',
        ],
        dont: [
          'List tools only (“Figma | Sketch | Miro | Jira”) — tools are assumed at this level',
          'Use internal job titles nobody searches for (“Experience Craftsperson II”)',
          'Try to cover every specialism at once',
        ],
      },
      {
        type: 'example',
        title: 'Before and after: headline',
        body: 'The improved version gives a hiring manager enough to picture where you fit.',
        before: 'Product Designer at Acme | Figma | UI | UX | Research',
        after: 'Product Designer at Acme | Data-heavy B2B tools | Design systems and research-led decisions',
      },

      { type: 'heading', text: 'About' },
      {
        type: 'doDont',
        do: [
          'Open with the problems you solve and for whom',
          'Describe how you work with PMs and engineers — collaboration is what mid-level roles hire for',
          'Mention one or two outcomes you can stand behind, attributed honestly',
          'Say what you want next so the right people reach out',
        ],
        dont: [
          'Re-explain what UX is',
          'Quote metrics you cannot explain or that are confidential',
          'Write a list of adjectives about your personality',
        ],
      },
      {
        type: 'example',
        title: 'Before and after: About opening',
        body: 'The stronger version shows specialism, collaboration and an honest outcome in three sentences.',
        before: 'Creative product designer with 4 years of experience in UI and UX. Passionate about user-centred design.',
        after: 'I design internal tools for operations teams — the complex, data-heavy screens people use all day. At Acme I work in a squad with a PM and five engineers, and I led the research that reshaped our order-management workflow. I’m most useful where messy processes need to become clear, reliable software.',
      },

      { type: 'heading', text: 'Experience' },
      {
        type: 'doDont',
        do: [
          'Add a one-line scope for each role: team, product, users',
          'Write two or three outcome-focused bullets that mirror your resume',
          'Link case studies to the role they came from, where you have permission',
        ],
        dont: [
          'Leave current role description blank',
          'Copy-paste every bullet from your resume — LinkedIn rewards brevity',
          'Claim sole credit for squad outcomes',
        ],
      },

      { type: 'heading', text: 'Featured' },
      {
        type: 'doDont',
        do: [
          'Feature one deep case study that matches the roles you want',
          'Add a post or article that shows how you reason about trade-offs',
          'Include a talk, workshop or internal write-up you are allowed to share publicly',
        ],
        dont: [
          'Feature your old beginner course project now that you have real work',
          'Link to NDA-protected work without permission',
          'Let Featured go stale for years',
        ],
      },

      { type: 'heading', text: 'Skills and recommendations' },
      {
        type: 'doDont',
        do: [
          'Pin skills that describe your specialism (Interaction Design, Design Systems, UX Research)',
          'Ask a PM and an engineer for recommendations — cross-functional voices carry weight',
          'Give them a prompt: a specific project and what you would like them to speak to',
          'Write genuine recommendations for others; it is good practice and good will',
        ],
        dont: [
          'Keep beginner skills pinned at the top',
          'Accept a generic “great to work with” recommendation when a specific one is possible',
          'Ask someone who barely worked with you',
        ],
      },

      { type: 'heading', text: 'Activity and posting' },
      {
        type: 'doDont',
        do: [
          'Share a real trade-off and how you decided, abstracted from confidential detail',
          'Write about process improvements: critiques, handoff, research ops',
          'Engage with people in the domain you want to move into',
        ],
        dont: [
          'Share internal screens, metrics or roadmaps without permission',
          'Post hot takes about other companies’ products to chase engagement',
          'Disappear for a year, then post only when job hunting',
        ],
      },

      { type: 'heading', text: 'Open to Work and recruiter settings' },
      {
        type: 'doDont',
        do: [
          'Use the recruiters-only option if you are currently employed and discretion matters',
          'Choose job titles at the level you are targeting, if your evidence supports it',
          'Specify domains and work arrangements you genuinely want',
        ],
        dont: [
          'Rely on the setting alone — reach out to hiring managers too',
          'List titles two levels above your experience',
          'Assume recruiters-only is completely private; no setting can guarantee that',
        ],
      },

      {
        type: 'qa',
        title: 'LinkedIn questions learners ask',
        items: [
          {
            question: 'Should my LinkedIn be identical to my resume?',
            answer: 'Consistent, not identical. Titles, dates and employers must match. LinkedIn can be shorter per role and more personal in the About section, while your resume is tailored to each application.',
          },
          {
            question: 'Is it fine to call myself a Product Designer if my title was UX Designer?',
            answer: 'Titles vary a lot between companies. In your headline you can use the market term that describes your work, but keep your official job title accurate in the Experience section.',
            tip: 'If asked, explain the difference plainly: “My title was UX Designer; the work was end-to-end product design.”',
          },
          {
            question: 'How do I show impact when my work is under NDA?',
            answer: 'Describe the problem type, your role and the kind of outcome without naming confidential details. “Redesigned a claims workflow used by internal teams; reduced the steps agents needed to resolve common cases” is honest and safe.',
          },
          {
            question: 'Do I need to specialise?',
            answer: 'You need a clear centre of gravity so people know when to think of you. That can be a domain (fintech, health) or a problem type (complex workflows, growth, systems). You can still do other work.',
          },
          {
            question: 'How often should I post?',
            answer: 'Whatever you can sustain. A thoughtful post every few weeks is plenty. Quality and relevance matter more than frequency.',
          },
          {
            question: 'Should I message hiring managers directly?',
            answer: 'Yes, briefly and specifically: why that team, one relevant piece of work, and a link. Respect their time and do not follow up repeatedly.',
          },
        ],
      },
      {
        type: 'checklist',
        title: 'Mid-level profile audit',
        items: [
          'Headline combines role, domain and problem type',
          'About section describes the problems I solve and how I collaborate',
          'Each role has a scope line and honest outcomes',
          'Featured shows current, relevant work',
          'Recommendations from at least one PM or engineer',
          'Open to Work titles match the level my evidence supports',
        ],
      },
    ],
    checklist: [
      'Headline rewritten around a specialism',
      'About section shows problems, collaboration and an honest outcome',
      'Experience entries have scope lines and match my resume',
      'Featured refreshed with a current case study and a piece of writing',
      'Asked a PM or engineer for a specific recommendation',
      'Recruiter settings reviewed for discretion and level',
    ],
    published: true,
  },

  /* ------------------------ LinkedIn do's & don'ts: E ------------------------ */
  {
    id: 'cg-linkedin-dodont-e',
    section: 'linkedin',
    level: 'expert',
    title: "LinkedIn do's and don'ts for senior designers and leaders",
    summary: 'Position yourself for senior and leadership roles through clear scope, credible thought leadership and visibility to hiring managers.',
    minutes: 25,
    cover: 'linkedin',
    blocks: [
      { type: 'illustration', name: 'linkedin' },
      {
        type: 'text',
        body: "Senior roles are rarely filled from a keyword search alone. They come through referrals, hiring managers who already know your name and recruiters briefed on a specific kind of leader. Your profile has two audiences: **people deciding whether to hire you** and **designers deciding whether to work for you**.\n\nThis guide covers what to do and avoid in each area, with an emphasis on positioning, thought leadership and recommendations that carry weight.",
      },

      { type: 'heading', text: 'Senior positioning: headline and banner' },
      {
        type: 'doDont',
        do: [
          'Name your level and remit: Staff Designer, Design Lead, Head of Design',
          'State the kind of organisation or problem you are best at (scaling teams, platform products, regulated domains)',
          'Use the banner for a principle you actually lead by, or leave it quiet and professional',
        ],
        dont: [
          'Use grand self-descriptions (“Design visionary”, “Thought leader”) — let others say it',
          'Stack every title you have held',
          'Position for management if you want to stay an IC, or the reverse',
        ],
      },
      {
        type: 'example',
        title: 'Before and after: senior headline',
        body: 'The improved version tells a hiring manager your level, your remit and the kind of organisation you help.',
        before: 'Design Leader | Visionary | Speaker | Mentor | UX Evangelist',
        after: 'Head of Design at Acme | Building design teams in B2B SaaS | Design systems, research practice, product strategy',
      },

      { type: 'heading', text: 'About: your leadership narrative' },
      {
        type: 'doDont',
        do: [
          'Open with what you believe about design’s role and the organisations you help',
          'Give scope honestly: team size, products, partners you worked with',
          'Describe one or two changes you led and how they played out',
          'Say what you are open to — advisory, leadership roles, speaking — if relevant',
        ],
        dont: [
          'List every project from a fifteen-year career',
          'Claim sole credit for outcomes delivered by teams',
          'Share details of reorganisations, disputes or confidential strategy',
        ],
      },

      { type: 'heading', text: 'Experience: scope over output' },
      {
        type: 'doDont',
        do: [
          'Lead each role with remit: team, reporting line, products, stakeholders',
          'Show progression — promotions, expanding remit, new functions you built',
          'Keep bullets about influence: practices introduced, hires made, decisions shaped',
        ],
        dont: [
          'Fill leadership roles with screen-level design details',
          'Inflate team sizes or titles — senior panels often know people who can check',
          'Leave early-career roles at full length; one line each is enough',
        ],
      },

      { type: 'heading', text: 'Featured and thought leadership' },
      {
        type: 'doDont',
        do: [
          'Feature talks, long-form writing or podcasts where you explain how you lead',
          'Write about topics you know deeply: critique culture, hiring, design operations, working with product leadership',
          'Share lessons from things that did not go to plan — it builds credibility',
          'Credit your team’s craft work publicly and specifically',
        ],
        dont: [
          'Chase reach with generic motivational posts or engagement bait',
          'Post opinions on every industry news item',
          'Publish frameworks you have not actually used',
          'Share team members’ work without their agreement',
        ],
      },
      {
        type: 'example',
        title: 'Before and after: a leadership post opener',
        body: 'The stronger opener is specific, honest and useful to peers.',
        before: 'Great design leaders empower their teams. Agree? Comment below!',
        after: 'Last year we changed how design critique works across four squads. The first version failed — people stopped bringing early work. Here is what we changed and what we would do differently.',
      },

      { type: 'heading', text: 'Recommendations that carry weight' },
      {
        type: 'doDont',
        do: [
          'Ask for recommendations across directions: a peer leader, a product or engineering partner, someone you managed',
          'Suggest a specific focus — how you handled a reorganisation, grew a designer, changed a process',
          'Write thoughtful recommendations for people who worked for you',
        ],
        dont: [
          'Collect only recommendations from junior designers you mentored briefly',
          'Keep recommendations from a decade ago at the top',
          'Ask for recommendations in bulk while job hunting — it shows',
        ],
      },

      { type: 'heading', text: 'Hiring-manager and recruiter visibility' },
      {
        type: 'doDont',
        do: [
          'Stay in touch with peers and former managers before you need a move',
          'Let a small number of trusted recruiters and peers know privately what you are looking for',
          'Keep the recruiters-only signal precise: level, remit and the organisations you want',
          'Make your contact details easy to find for direct approaches',
        ],
        dont: [
          'Use the public Open to Work frame while leading a team, unless you have deliberately decided to',
          'Reply to every recruiter message with a CV — ask about scope and remit first',
          'Rely on applications alone; senior roles often move through networks',
        ],
      },

      {
        type: 'qa',
        title: 'LinkedIn questions learners ask',
        items: [
          {
            question: 'Do I need to become a content creator to be seen as a leader?',
            answer: 'No. A handful of thoughtful, specific posts a year and considered comments on peers’ posts build more credibility than frequent content. Many respected leaders post rarely.',
          },
          {
            question: 'How do I talk about team results without over-claiming?',
            answer: 'Use accurate language: “my team”, “in partnership with”, “I set the direction for”. Describe the lever you pulled — hiring, process, strategy — and the change that followed.',
            tip: 'If a panel member phoned your former PM partner, would they recognise your description? That is the test.',
          },
          {
            question: 'Should my profile target IC or management roles?',
            answer: 'Pick one primary direction for your headline and About section. You can mention openness to the other, but a split profile makes it harder for recruiters to place you.',
          },
          {
            question: 'Is it risky to post about failures?',
            answer: 'Not if you focus on what you learned and avoid blaming people or sharing confidential details. Reflective honesty is one of the strongest signals of seniority.',
          },
          {
            question: 'How do I get visible to hiring managers for senior roles?',
            answer: 'Mostly through people who already know your work: former colleagues, peers you have helped and communities you contribute to. Your profile then confirms what they have heard.',
          },
          {
            question: 'Should I list advisory or mentoring work?',
            answer: 'Yes, if it is real and ongoing. Keep it brief and specific about what you do, and do not let it overshadow your main role.',
          },
        ],
      },
      {
        type: 'checklist',
        title: 'Senior profile audit',
        items: [
          'Headline states level, remit and the organisations I help',
          'About section tells a leadership narrative with honest scope',
          'Roles show progression and influence, not screen-level output',
          'Featured holds writing or talks that show how I lead',
          'Recommendations come from peers, partners and people I managed',
          'Recruiter signals are precise and discreet',
        ],
      },
    ],
    checklist: [
      'Chose a primary direction: IC or management',
      'Headline and About rewritten for senior positioning',
      'Experience entries lead with remit and progression',
      'Featured includes one piece of leadership writing or a talk',
      'Requested recommendations from a peer and a cross-functional partner',
      'Told two trusted contacts privately what I am looking for',
    ],
    published: true,
  },

  /* -------------------------- Resume creation: B -------------------------- */
  {
    id: 'cg-resume-build-b',
    section: 'resume',
    level: 'beginner',
    title: 'Build your first design resume, step by step',
    summary: 'Eight practical steps from a blank page to a clear, honest, one-page resume you can tailor for each application.',
    minutes: 30,
    cover: 'resume',
    blocks: [
      { type: 'illustration', name: 'resume', caption: 'Build it once properly, then tailor it in minutes.' },
      {
        type: 'text',
        body: "This guide walks you through building your resume from scratch, one step at a time. Keep a document open and do each step as you read. By the end you will have a base version you can adapt for every application.",
      },

      { type: 'heading', text: 'Step 1 — Pick one target role' },
      {
        type: 'text',
        body: "A resume written for “any design job” convinces nobody. Choose one role title to aim for — UI Designer, UX Designer or Product Designer — and collect three or four real job adverts for it. Highlight the skills and words that appear repeatedly. These shape everything that follows.",
      },
      {
        type: 'doDont',
        do: [
          'Pick the title that best matches your projects and interests',
          'Save a few real adverts and note repeated requirements',
          'Accept that you will make small variants later',
        ],
        dont: [
          'Try to cover UI, UX, graphic design and front-end in one document',
          'Target senior roles because the salary looks better',
          'Skip this step — it is what makes the other steps easy',
        ],
      },

      { type: 'heading', text: 'Step 2 — Structure' },
      {
        type: 'text',
        body: "Use a simple, single-column layout in this order: name and links, summary, skills, projects, experience, education. For beginners, **projects usually go above experience** because they are your strongest evidence. Recruitment software and people both read top to bottom, so put the most relevant things first.",
      },
      {
        type: 'doDont',
        do: [
          'Put your name, email, portfolio link and LinkedIn URL at the top',
          'Use clear section headings (Summary, Skills, Projects, Experience, Education)',
          'Keep to one page',
        ],
        dont: [
          'Use two or three columns, text boxes or tables for layout',
          'Add your full address, date of birth or marital status',
          'Put key information in headers or footers, which some systems skip',
        ],
      },

      { type: 'heading', text: 'Step 3 — Summary' },
      {
        type: 'text',
        body: "Two or three lines: the role you want, your focus, and what you bring. If you are switching careers, mention the useful background — it is an asset, not something to hide.",
      },
      {
        type: 'example',
        title: 'Before and after: summary',
        body: 'The improved version is specific, honest and connects past experience to design.',
        before: 'Highly motivated and passionate designer seeking a challenging role where I can grow my skills.',
        after: 'Junior UI/UX designer focused on mobile apps. Three years in customer support taught me to spot where people get stuck; I now turn that into clear, tested flows in Figma.',
      },

      { type: 'heading', text: 'Step 4 — Skills' },
      {
        type: 'text',
        body: "Group skills so they are easy to scan: **Design**, **Research**, **Tools**. Only include what you could demonstrate or discuss with an example from your projects.",
      },
      {
        type: 'example',
        title: 'Grouped skills',
        body: 'Grouping shows you understand the discipline, not just the software.',
        before: 'Figma, Photoshop, Illustrator, Canva, HTML, CSS, JavaScript, React, Python, Miro, Notion, Trello, Jira, Excel…',
        after: 'Design: wireframing, prototyping, visual design, accessibility basics · Research: interviews, usability testing · Tools: Figma, FigJam',
      },

      { type: 'heading', text: 'Step 5 — Experience and projects bullets' },
      {
        type: 'text',
        body: "Write two or three bullets per project or role using: **action verb + what you did + why or for whom + honest result**. If you have no numbers, describe what you observed, what changed or what you learned. That is still an outcome.",
      },
      {
        type: 'example',
        title: 'Before and after: project bullet with no metrics',
        body: 'You do not need numbers. You need specifics you can explain.',
        before: 'Increased user satisfaction by 60% with a new booking app design.',
        after: 'Designed a class-booking flow for a local gym concept; tested it with 5 members, found that nobody noticed the waitlist option, and moved it into the main booking step.',
      },
      {
        type: 'example',
        title: 'Before and after: non-design job',
        body: 'Show the transferable skill honestly.',
        before: 'Waiter — took orders and served food.',
        after: 'Waiter — noticed guests regularly misread the allergen section of the menu; suggested a clearer layout that the manager adopted for the next print run.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Never fake experience, metrics or keywords',
        body: "Do not invent percentages, call course briefs “client work”, or paste hidden keywords in white text. Interviewers ask “how did you measure that?” and recruiters recognise keyword stuffing. One fabricated detail can undo an otherwise strong application — honest, specific writing is more convincing anyway.",
      },

      { type: 'heading', text: 'Step 6 — Education and extras' },
      {
        type: 'text',
        body: "List degrees, bootcamps and substantial courses with dates and one line on what you covered. Self-taught is valid: describe what you studied and point to the projects that prove it. Add extras — hackathons, volunteering, design challenges — only if they support the role.",
      },
      {
        type: 'doDont',
        do: [
          'Write “Self-directed UI/UX study, 2025 — research, interaction design, usability testing through three projects”',
          'Include volunteering where you designed something real',
          'Keep extras to one or two relevant lines',
        ],
        dont: [
          'List every short online video course as a certification',
          'Include school grades if you have a degree or relevant course',
          'Add hobbies unless they genuinely connect to the role',
        ],
      },

      { type: 'heading', text: 'Step 7 — Format and export' },
      {
        type: 'text',
        body: "Clean formatting is a quiet demonstration of your design skill. Use one readable font, a clear type hierarchy, consistent dates and generous spacing. Export as a PDF with selectable text, and name the file clearly.",
      },
      {
        type: 'doDont',
        do: [
          'Use one font family, 10–12 pt for body text',
          'Align dates consistently on one side',
          'Export to PDF and check the text can be selected and copied',
          'Name the file “Firstname-Lastname-UI-UX-Designer.pdf”',
        ],
        dont: [
          'Export a flattened image from Figma — text cannot be read by software',
          'Use skill bars, star ratings or icons for contact details',
          'Send “resume_final_v3_NEW.pdf”',
        ],
      },

      { type: 'heading', text: 'Step 8 — Tailor for each application' },
      {
        type: 'text',
        body: "Save your base version, then for each application spend ten minutes adjusting: the summary’s focus, the order of projects and the wording of skills, using the advert’s language **where it truthfully matches** your experience.",
      },
      {
        type: 'example',
        title: 'Tailoring the summary',
        body: 'Same person, same truth — different emphasis for a different advert.',
        before: 'Junior UI/UX designer focused on mobile apps.',
        after: 'Junior UI/UX designer focused on accessible e-commerce journeys, with a checkout redesign case study tested with real shoppers.',
      },

      {
        type: 'qa',
        title: 'Resume questions answered',
        items: [
          {
            question: 'One page or two?',
            answer: 'One page for beginners. It forces you to choose your strongest evidence, and reviewers skim anyway. Your portfolio holds the detail.',
          },
          {
            question: 'Should I include a photo?',
            answer: 'In the UK, US and many other markets, no — it is not expected and can introduce bias. Some countries do expect one, so check local norms for where you are applying.',
          },
          {
            question: 'What is an ATS and how do I get past it?',
            answer: 'An applicant tracking system stores and helps filter applications. Help it read your resume with a single column, standard headings, real text (not images) and the accurate terms from the advert. There is no trick beyond clarity and relevance.',
            tip: 'Paste your PDF’s text into a plain text editor. If it comes out jumbled, software may struggle too.',
          },
          {
            question: 'I have no professional design experience. What goes in Experience?',
            answer: 'Your previous jobs, framed around transferable skills, plus projects above them. Course projects, self-initiated redesigns and volunteer work all count if labelled honestly.',
          },
          {
            question: 'How do I explain a career gap or career switch?',
            answer: 'Briefly and honestly. A line such as “2024–2025: Career break; studied UI/UX design and completed three projects” is enough. Your summary can frame the switch as a strength.',
          },
          {
            question: 'How do I list bootcamp or self-taught projects?',
            answer: 'Under a Projects heading, with a clear label: “Course project”, “Self-initiated” or “Volunteer”. Give each a one-line problem, what you did and what you found, plus a link to the case study.',
          },
          {
            question: 'Should I use a fancy designed template?',
            answer: 'A clean layout shows design skill better than decoration. Heavily graphic templates often break when software reads them and distract from your content.',
          },
        ],
      },
      {
        type: 'checklist',
        title: 'Before you send it',
        items: [
          'Written for one clear target role',
          'Portfolio and LinkedIn links at the top and clickable',
          'Summary is specific and honest',
          'Skills are grouped and demonstrable',
          'Every bullet describes real work and an honest result',
          'Single-column PDF with selectable text',
          'Proofread, ideally by someone else',
        ],
      },
    ],
    checklist: [
      'Chose one target role and saved three adverts',
      'Built a single-column structure with links at the top',
      'Wrote a specific two-line summary',
      'Grouped skills into Design, Research and Tools',
      'Rewrote project bullets without invented metrics',
      'Exported a clean, correctly named PDF',
      'Tailored a copy for one real application',
    ],
    published: true,
  },

  /* -------------------------- Resume creation: I -------------------------- */
  {
    id: 'cg-resume-build-i',
    section: 'resume',
    level: 'intermediate',
    title: 'Rebuild your resume for your next product design role',
    summary: 'A step-by-step rebuild focused on scope, impact, tailoring and a portfolio link strategy that earns the click.',
    minutes: 25,
    cover: 'resume',
    blocks: [
      { type: 'illustration', name: 'resume' },
      {
        type: 'text',
        body: "Most mid-level resumes grow by accident: new roles get added on top of an old junior version. This guide rebuilds yours deliberately, so it reads as the resume of someone ready for a bigger role. It assumes you already know the basics of structure and formatting.",
      },

      { type: 'heading', text: 'Step 1 — Pick one target role' },
      {
        type: 'text',
        body: "Define the next role precisely: level, domain and type of product. “Senior Product Designer, B2B SaaS, workflow-heavy tools” is a target; “a better design job” is not. Read several adverts at that level and note what they expect beyond craft — ownership, cross-functional leadership, research, systems.",
      },
      {
        type: 'doDont',
        do: [
          'Target the level your evidence supports, or one step above with clear proof',
          'Note what separates the target level from your current one',
          'Decide which one or two strengths you will lead with',
        ],
        dont: [
          'Write one resume for both mid and lead roles',
          'Ignore domain — relevant domain experience is often a deciding factor',
        ],
      },

      { type: 'heading', text: 'Step 2 — Structure' },
      {
        type: 'text',
        body: "Experience now leads, projects move down or disappear. Keep one page if you can; two pages is acceptable with substantial experience. Give each role a **scope line** before the bullets so the reader understands the context.",
      },
      {
        type: 'example',
        title: 'Before and after: role scope line',
        body: 'Scope makes every bullet underneath easier to judge.',
        before: 'Product Designer, Northwind (2022–present)',
        after: 'Product Designer, Northwind (2022–present) — one of two designers on the logistics platform; partnered with a PM and six engineers on tools used by warehouse teams.',
      },

      { type: 'heading', text: 'Step 3 — Summary' },
      {
        type: 'text',
        body: "Your summary should position you: specialism, the problems you are best at and how you work. Recruiters use it to decide which pile you go in.",
      },
      {
        type: 'example',
        title: 'Before and after: positioned summary',
        body: 'The stronger version states a specialism and a working style, not adjectives.',
        before: 'Product designer with 4 years of experience in UI/UX, user research and prototyping.',
        after: 'Product designer specialising in complex operational tools. I lead discovery with PMs, test early with real users and work closely with engineers to ship reliable, accessible interfaces.',
      },

      { type: 'heading', text: 'Step 4 — Skills' },
      {
        type: 'text',
        body: "At this level, skills are capabilities, not tools. Lead with things like discovery, interaction design, design systems, facilitation, accessibility. Keep tools to one short line.",
      },
      {
        type: 'doDont',
        do: [
          'List capabilities the target role asks for and you can prove',
          'Include collaboration skills: workshop facilitation, stakeholder alignment',
          'Keep tools brief',
        ],
        dont: [
          'Keep your beginner skill list unchanged',
          'List every tool you have used in five years',
        ],
      },

      { type: 'heading', text: 'Step 5 — Experience and projects bullets' },
      {
        type: 'text',
        body: "Each bullet should show **problem → your contribution → outcome**, with scope. Where you have real metrics you can explain, use them and attribute them honestly. Where you do not, describe qualitative outcomes: what changed for users, the team or the product.",
      },
      {
        type: 'example',
        title: 'Before and after: impact without invented numbers',
        body: 'The improved bullet shows the problem, the decision and an outcome you observed — no fabricated percentage.',
        before: 'Improved efficiency of the returns dashboard by 45%.',
        after: 'Led research with warehouse staff on the returns dashboard; found they kept a paper list alongside it because filters reset. Redesigned filtering and saved views, and in follow-up sessions staff stopped using the paper list.',
      },
      {
        type: 'example',
        title: 'Before and after: honest attribution',
        body: 'Shared outcomes are still worth including — just say they were shared.',
        before: 'Increased sign-ups by 20% with new onboarding.',
        after: 'Designed the new onboarding flow with the growth squad; the team’s release was followed by higher sign-up completion, which the PM tracked over the next quarter.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'No inflated metrics, titles or keyword stuffing',
        body: "At mid-level, interviewers dig into every claim. Only quote numbers you can explain (source, timeframe, your contribution). Keep your official job titles accurate. Use the advert’s terms only where they are true — pasting lists of keywords reads as padding to a human reviewer.",
      },

      { type: 'heading', text: 'Step 6 — Education and extras' },
      {
        type: 'text',
        body: "Education shrinks to a line or two. Extras that now matter: talks, mentoring, writing, contributions to a design system or community. Keep only what supports your positioning.",
      },
      {
        type: 'doDont',
        do: [
          'Add mentoring or internal workshops you ran',
          'Mention talks or articles with links',
        ],
        dont: [
          'Keep every certificate from your early learning',
          'Let extras push experience onto a second page',
        ],
      },

      { type: 'heading', text: 'Step 7 — Format and export, plus your portfolio link strategy' },
      {
        type: 'text',
        body: "Keep the format clean and single-column, exported as a text-based PDF. Then think about **where your links go**. A reviewer who likes a bullet should be one click from the matching case study.",
      },
      {
        type: 'doDont',
        do: [
          'Put your portfolio URL at the top, short and readable',
          'Link relevant roles or bullets directly to the matching case study',
          'Make sure password-protected case studies have the password in your application',
          'Check every link on mobile before sending',
        ],
        dont: [
          'Link only to a homepage and hope they find the right project',
          'Send a portfolio whose top case study does not match the role',
          'Use shortened links that look like spam',
        ],
      },

      { type: 'heading', text: 'Step 8 — Tailor for each application' },
      {
        type: 'text',
        body: "Tailoring at this level is about emphasis: reorder bullets so the most relevant come first, adjust the summary to the domain, and choose which case study you link. It should take fifteen minutes, not a rewrite.",
      },
      {
        type: 'example',
        title: 'Reordering for the advert',
        body: 'For a design systems role, move systems work to the top of the relevant role — same facts, different emphasis.',
        before: '1) Redesigned returns dashboard · 2) Ran onboarding research · 3) Contributed components to the design system',
        after: '1) Contributed and documented components in the design system used by three squads · 2) Redesigned returns dashboard · 3) Ran onboarding research',
      },

      {
        type: 'qa',
        title: 'Resume questions answered',
        items: [
          {
            question: 'One page or two?',
            answer: 'One if you can; two is fine with several relevant roles. What matters is that the first half-page makes the case on its own.',
          },
          {
            question: 'How do I show impact when I have no access to data?',
            answer: 'Describe observed outcomes: what users stopped doing, what support tickets changed, what the team adopted. Qualitative outcomes, honestly described, are credible.',
            tip: 'Start keeping a “wins log” now: date, what changed, how you know. Future you will thank you.',
          },
          {
            question: 'Do ATS systems reject resumes automatically?',
            answer: 'It varies by company and setup, and nobody outside can know exactly. Make it easy for any system and any person: standard headings, real text and accurate terms from the advert.',
          },
          {
            question: 'Should I include a photo?',
            answer: 'Follow local norms. In the UK and US it is generally not expected and best left off.',
          },
          {
            question: 'How do I handle a short role or a redundancy?',
            answer: 'List it honestly with dates. Redundancies are common and not a reflection of your work. You can add a short note, such as “role ended in company-wide restructure”, if it helps.',
          },
          {
            question: 'Do I still include side projects?',
            answer: 'Only if they show something your job does not — a new domain, a skill you want to be hired for. Otherwise, let your professional work carry the resume.',
          },
          {
            question: 'Should the resume and LinkedIn match?',
            answer: 'Titles, employers and dates must match exactly. Wording can differ — the resume is tailored, LinkedIn is broader.',
          },
        ],
      },
      {
        type: 'checklist',
        title: 'Mid-level resume review',
        items: [
          'Targets one level and domain',
          'Summary states a specialism',
          'Each role has a scope line',
          'Bullets show problem, contribution and honest outcome',
          'Every metric is explainable and attributed',
          'Links go straight to relevant case studies',
          'Tailored emphasis for this application',
        ],
      },
    ],
    checklist: [
      'Defined my target level, domain and product type',
      'Added scope lines to every role',
      'Rewrote the summary around a specialism',
      'Rewrote bullets as problem, contribution and honest outcome',
      'Linked bullets or roles to matching case studies',
      'Started a wins log for future updates',
      'Tailored one version for a real advert',
    ],
    published: true,
  },

  /* -------------------------- Resume creation: E -------------------------- */
  {
    id: 'cg-resume-build-e',
    section: 'resume',
    level: 'expert',
    title: 'Build a senior or leadership resume, step by step',
    summary: 'Construct a resume that shows leadership scope, organisational impact and an executive-ready summary, without over-claiming.',
    minutes: 25,
    cover: 'resume',
    blocks: [
      { type: 'illustration', name: 'resume' },
      {
        type: 'text',
        body: "Senior resumes are read by recruiters, heads of product, CTOs and sometimes founders or executives — often in that order. Each reader is asking a slightly different question, but all want to know: **what scope have you held, and what changed because you were there?** These steps build a resume that answers that quickly and credibly.",
      },

      { type: 'heading', text: 'Step 1 — Pick one target role' },
      {
        type: 'text',
        body: "Decide between the IC track (Staff, Principal) and the management track (Design Lead, Manager, Head of, Director). The same career reads very differently in each. Then define the organisational context: company stage, size of design team, reporting line.",
      },
      {
        type: 'doDont',
        do: [
          'Write separate IC and management versions if you are open to both',
          'Match the target to the organisation’s stage — building a team from scratch differs from running a mature one',
          'Research who the role reports to; it tells you what the resume must speak to',
        ],
        dont: [
          'Blend both tracks into one ambiguous document',
          'Target a title jump you cannot yet support with evidence',
        ],
      },

      { type: 'heading', text: 'Step 2 — Structure' },
      {
        type: 'text',
        body: "Two pages is normal. Page one must stand alone: executive summary, a few selected highlights and your most recent roles. Earlier roles shrink to one line each. Projects and tool lists largely disappear.",
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Name, title, links (portfolio or leadership deck, LinkedIn)',
          'Executive summary (3–4 lines)',
          'Selected highlights (3–4 bullets across your career)',
          'Experience, most recent first, each with a remit line',
          'Earlier career (one line per role)',
          'Talks, writing, advisory, education',
        ],
      },

      { type: 'heading', text: 'Step 3 — Summary for executive readers' },
      {
        type: 'text',
        body: "Write the summary for a busy executive: the type of leader you are, the scale you have worked at and the kind of change you create. Avoid design jargon; speak to business and organisational outcomes in plain language.",
      },
      {
        type: 'example',
        title: 'Before and after: executive summary',
        body: 'The improved version tells a CPO or CEO what problems you solve for an organisation.',
        before: 'Experienced, passionate design leader with 14 years in UX, UI, research and design thinking. Strong communicator and team player.',
        after: 'Design leader who builds and scales product design teams in B2B SaaS. Most recently grew a team from 3 to 11 designers and introduced the research practice and design system the product organisation now plans around. Known for making design a trusted partner in roadmap decisions.',
      },

      { type: 'heading', text: 'Step 4 — Skills' },
      {
        type: 'text',
        body: "Replace a skills list with **areas of leadership**: team building, design strategy, design operations, cross-functional partnership, research practice. Tools are assumed and can be omitted.",
      },
      {
        type: 'doDont',
        do: [
          'Name leadership capabilities you can back with an example',
          'Tailor the areas to the role — a Head of Design role may emphasise hiring and operations',
        ],
        dont: [
          'List Figma, FigJam and prototyping tools',
          'Use buzzwords (“synergy”, “disruptive”) instead of concrete capabilities',
        ],
      },

      { type: 'heading', text: 'Step 5 — Experience: leadership scope and organisational impact' },
      {
        type: 'text',
        body: "Open every role with a **remit line**: team size, reporting line, products, key partners. Bullets then show the levers you pulled — strategy, people, practice, process — and what changed in the organisation. Numbers you can explain are welcome; where you have none, describe the organisational change you observed.",
      },
      {
        type: 'example',
        title: 'Before and after: remit line',
        body: 'Scope first, so every bullet is read at the right altitude.',
        before: 'Head of Design, Brightpay (2021–present)',
        after: 'Head of Design, Brightpay (2021–present) — reporting to the CPO; leading 11 designers and 2 researchers across payments, onboarding and internal tools.',
      },
      {
        type: 'example',
        title: 'Before and after: organisational impact without invented numbers',
        body: 'The stronger version shows the lever, the change and honest attribution.',
        before: 'Transformed the design culture and increased team productivity by 300%.',
        after: 'Introduced a weekly cross-squad critique and a shared design review stage with engineering leads; within two quarters squads were reusing each other’s patterns and late-stage design rework came up far less in retrospectives.',
      },
      {
        type: 'example',
        title: 'Before and after: people leadership',
        body: 'Growing people is senior impact — describe it specifically.',
        before: 'Managed and mentored the design team.',
        after: 'Hired 6 designers and set up a career framework with HR; two designers were promoted to senior within the framework’s first cycle.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Over-claiming is costly at this level',
        body: "Senior panels often include people who know your former colleagues. Never inflate team sizes, titles or outcomes, and do not claim company-wide results as design’s alone. Avoid keyword lists aimed at software — executives read these resumes, and padding lowers trust. Choose claims you can discuss for thirty minutes under scrutiny.",
      },

      { type: 'heading', text: 'Step 6 — Education and extras' },
      {
        type: 'text',
        body: "Keep education to one line. Extras now signal influence: conference talks, published writing, advisory roles, board or community positions, open-source or industry contributions. Include what is real, recent and relevant.",
      },
      {
        type: 'doDont',
        do: [
          'Link one or two talks or articles that show how you lead',
          'List advisory or non-executive roles with a brief description',
        ],
        dont: [
          'List every meetup you attended',
          'Include old certifications that no longer reflect your level',
        ],
      },

      { type: 'heading', text: 'Step 7 — Format and export' },
      {
        type: 'text',
        body: "Understated and precise. A clear type hierarchy, consistent dates and generous white space signal the same judgement you would bring to a product. Export a text-based PDF. If you have a leadership portfolio or short deck, link it at the top.",
      },
      {
        type: 'doDont',
        do: [
          'Keep page one self-sufficient',
          'Use the same visual standards you would expect from your team',
          'Link a leadership portfolio that covers team, practice and strategy — not just screens',
        ],
        dont: [
          'Use a heavily designed template that competes with the content',
          'Attach a twenty-page portfolio PDF unasked',
        ],
      },

      { type: 'heading', text: 'Step 8 — Tailor for each application' },
      {
        type: 'text',
        body: "Tailor to the organisation’s moment. A scale-up hiring its first Head of Design needs to see team building from scratch; a mature company needs to see you raise quality and align many teams. Adjust the summary, the selected highlights and the order of bullets accordingly.",
      },
      {
        type: 'example',
        title: 'Tailoring the highlights',
        body: 'Same career, different emphasis for a company at a different stage.',
        before: 'Highlights for a mature enterprise: consolidated three design systems into one; set design quality standards across 9 squads.',
        after: 'Highlights for a scale-up’s first design leader: hired the first design team; set up critique, research and hand-off practices from scratch; partnered with the CPO on the product vision.',
      },

      {
        type: 'qa',
        title: 'Resume questions answered',
        items: [
          {
            question: 'One page or two?',
            answer: 'Two is normal for senior and leadership roles. Page one must work on its own, because many readers stop there.',
          },
          {
            question: 'How much should I show hands-on craft?',
            answer: 'Enough to show you still have judgement and taste — a line per role, or a highlight. For IC tracks, much more; for Head of or Director roles, emphasise people, practice and strategy.',
          },
          {
            question: 'What do executives look for in a design leader’s resume?',
            answer: 'Evidence that you can partner with product and engineering leadership, build a healthy team, and connect design decisions to business priorities. Plain language helps them see it.',
          },
          {
            question: 'Should I include a photo?',
            answer: 'Follow local norms; in the UK and US, leave it off.',
          },
          {
            question: 'Do senior resumes still go through ATS?',
            answer: 'Often, yes, even when a recruiter introduced you. Keep the same basics: single column, standard headings, real text.',
          },
          {
            question: 'How do I show impact from a role that ended badly or a team that was cut?',
            answer: 'Describe what you built and what you learned, factually and without blame. Restructures are common; how you describe them says a lot about you as a leader.',
            tip: 'Prepare a calm, two-sentence explanation for interviews and keep the resume neutral.',
          },
          {
            question: 'How do I present a career switch from IC to management (or back)?',
            answer: 'Make the direction explicit in your summary and choose highlights that support it. Moving back to IC is a legitimate choice; frame it around the work you want to do.',
          },
        ],
      },
      {
        type: 'checklist',
        title: 'Senior resume review',
        items: [
          'Clear track: IC or management',
          'Executive summary in plain language',
          'Selected highlights on page one',
          'Every role opens with a remit line',
          'Bullets show levers pulled and organisational change',
          'Outcomes attributed accurately; nothing inflated',
          'Tailored to the organisation’s stage',
        ],
      },
    ],
    checklist: [
      'Chose a track and target organisation stage',
      'Wrote an executive summary for non-design readers',
      'Added remit lines to every senior role',
      'Rewrote bullets around leadership levers and organisational change',
      'Checked every claim could survive a reference call',
      'Linked a leadership portfolio or talk',
      'Tailored highlights for one real role',
    ],
    published: true,
  },
]
