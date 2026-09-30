import type { CareerGuide } from '../types'

/**
 * Interview question banks — one per level. Model answers are honest
 * templates: replace every [placeholder] with your own real experience.
 */

const howToUse = `These are **model answers written as templates**, not scripts to memorise. Each one shows a structure that works — usually context, what you did, what happened and what you learned — with [placeholders] for your own real details.

Read the question, draft your own answer in a doc, then practise saying it out loud until it sounds like you talking rather than you reciting. Read the tip under each answer: it tells you what the interviewer is really listening for.`

export const interviewGuides: CareerGuide[] = [
  // ---------------------------------------------------------------------------
  // Beginner
  // ---------------------------------------------------------------------------
  {
    id: 'cg-interview-qa-b',
    section: 'interviews',
    level: 'beginner',
    title: 'Interview questions & answers (Beginner)',
    summary: 'Fifteen common junior design interview questions with honest model answers you can adapt to your own story.',
    minutes: 25,
    cover: 'interview',
    published: true,
    blocks: [
      { type: 'illustration', name: 'interview' },
      { type: 'text', body: howToUse },
      {
        type: 'qa',
        title: 'About you & motivation',
        items: [
          {
            question: 'Tell me about yourself.',
            answer: `Keep it to about a minute and follow past, present, future. "I spent [number] years working as [previous role/study], where I kept noticing [a problem you saw users or customers struggle with]. That curiosity led me to [bootcamp / course / self-teaching] in UI/UX, where I completed [number] projects — the one I am proudest of is [project], where I [key thing you did, e.g. tested a checkout flow with five people and redesigned it]. Right now I am looking for a junior role where I can learn from experienced designers and work on real products, and [company] appeals because [specific, genuine reason]."`,
            tip: 'They are listening for a clear thread from your past to design, not your life story. The most common mistake is talking for five minutes and never mentioning design work.',
          },
          {
            question: 'Why did you move into UI/UX design?',
            answer: `Anchor it in a real moment rather than a general love of design. "In my role as [previous job], I [specific experience — e.g. handled customer complaints about a confusing booking form]. I realised that many of those problems were design problems, and I wanted to be the person who fixes them rather than the person who explains them. I started with [first step — free course, redesigning an app for fun], then committed to [bootcamp/structured learning]. What keeps me here is [honest reason — e.g. that you can test an idea with real people and see it improve]."`,
            tip: 'A specific origin story is far more convincing than "I have always been creative". Your previous career is an asset — show what it taught you about people.',
          },
          {
            question: 'Why do you want to work here?',
            answer: `Show you have done homework and connect it to what you want to learn. "I have used [product] for [how long / in what context] and noticed [something specific you like, or a thoughtful detail in the design]. I also read [blog post / talk / job description detail] about how your team [works — e.g. tests with users every sprint]. As a junior designer, I want to be somewhere that [research is part of the process / designers work closely with engineers], and that seems true here. I would also like to understand [a genuine question about the product or team]."`,
            tip: 'Generic praise ("you are a great company") signals no preparation. One specific observation about their product beats three compliments.',
          },
          {
            question: 'What is your biggest weakness as a designer?',
            answer: `Pick a real, relevant weakness and show what you are doing about it. "Because I am [self-taught / new to the field], I have less experience with [real gap — e.g. working with developers on a live product, or visual design polish]. On my projects I [example of the gap showing up — e.g. handed over designs without thinking about loading or error states]. Since then I have [concrete action — added edge-state screens to my checklist, paired with a developer friend on a small build]. It is still an area I am growing in, which is one reason I want a team where I can get regular feedback."`,
            tip: 'Interviewers want self-awareness plus action. Avoid fake weaknesses like "I am a perfectionist" — they read as evasive.',
          },
        ],
      },
      {
        type: 'qa',
        title: 'Process & portfolio walkthrough',
        items: [
          {
            question: 'Walk me through a project in your portfolio.',
            answer: `Use a simple arc and keep it to five to seven minutes. "This was [project], a [self-initiated / bootcamp / volunteer] project for [who it was for]. The problem was [one sentence — e.g. people abandoning a recipe app at sign-up]. I was [solo / one of three designers] and my part was [your role]. I started by [research — e.g. five short interviews], which showed [key insight]. That led me to [main design decision], and I tested it with [number] people. [What changed after testing]. If I did it again, I would [honest improvement]."`,
            tip: 'They are checking whether you can explain why you made decisions, not just show screens. Be clear about what you did yourself versus what the team did.',
          },
          {
            question: 'Your projects are mostly concept or bootcamp work. How do you know your designs would work?',
            answer: `Be honest about the limits, then show the evidence you do have. "You are right that [project] was not shipped, so I cannot claim real-world results. What I did do was [evidence — e.g. usability-test the prototype with six people, and three of them failed to find the delivery option in the first version]. I changed [specific thing] and in the second round [what you observed]. I know that is a small sample and not the same as live usage, which is exactly why I am keen to work on a real product and learn how teams measure success."`,
            tip: 'Admitting what you do not know builds trust. Over-claiming impact on a concept project is one of the quickest ways to lose credibility.',
          },
          {
            question: 'How do you start a new design project?',
            answer: `Show a process, but explain that it bends to the situation. "First I make sure I understand the problem: who it is for, what they are trying to do and what the business needs. I would ask [questions — who uses it now, what is not working, what constraints exist]. Then I look for evidence — [talking to users, reviewing support tickets, looking at how similar products solve it]. After that I sketch several options quickly before going into Figma, so I do not fall for my first idea. On [project] this meant [short real example]."`,
            tip: 'They want to hear that you understand before you draw. Jumping straight to "I open Figma and start designing" is the classic junior mistake.',
          },
          {
            question: 'Tell me about a time a user test changed your design.',
            answer: `Use situation, action, result, learning. "On [project], I designed [feature — e.g. a filter panel for a job-search app] and assumed [your assumption]. When I tested it with [number] people, [what happened — e.g. most of them did not notice the filters were hidden behind an icon]. I [change you made — moved filters into a visible row with labels] and retested; [what you saw the second time]. The lesson for me was [learning — e.g. that icons alone rarely communicate as well as I expect]."`,
            tip: 'This checks whether you value evidence over your own opinion. A story where you were wrong and changed course is stronger than one where testing "confirmed" everything.',
          },
        ],
      },
      {
        type: 'qa',
        title: 'Design craft',
        items: [
          {
            question: 'How do you make sure your designs are accessible?',
            answer: `Show practical habits, not just the word "WCAG". "I build a few checks into every project. I check colour contrast for text and key UI elements with a contrast checker, I never rely on colour alone to show meaning — for example errors get an icon and a message, not just red — and I keep tap targets comfortably large on mobile. I write clear labels rather than placeholder-only inputs. On [project] I [real example — e.g. found my grey helper text failed contrast and darkened it]. I am still learning areas like screen reader behaviour, and I would want to work with developers on that."`,
            tip: 'Specific habits beat reciting guidelines. It is fine to say where your knowledge stops, as long as you show you take it seriously.',
          },
          {
            question: 'How do you decide on a visual hierarchy for a screen?',
            answer: `Start from the user's goal, then explain the tools. "I first ask what the one most important thing on the screen is — on a [banking app home screen], it is probably [the balance and a main action]. Then I use size, weight, colour and spacing to make that stand out, and group related items so the page scans easily. I often do a squint test or blur the screen to check what stands out. On [project], my first version had [problem — e.g. three buttons competing], so I [change — made one primary and the others secondary]."`,
            tip: 'They want to hear reasoning from user priority, not personal taste. "I made it look clean" tells them nothing.',
          },
          {
            question: 'How do you use Figma in your workflow?',
            answer: `Describe how you work, not a list of features. "I use frames with Auto Layout so my layouts resize properly, and I build reusable components with variants for things like buttons and inputs, so changes stay consistent. I keep styles or variables for colours and text. For [project], I [real example — built a small component set before designing screens]. For testing, I link screens into a clickable prototype. I am comfortable with [what you know well] and still getting better at [honest gap, e.g. organising files for handover]."`,
            tip: 'Tool questions are really about working tidily with others. Mention how your file would be easy for a developer or teammate to pick up.',
          },
        ],
      },
      {
        type: 'qa',
        title: 'Collaboration & scenarios',
        items: [
          {
            question: 'Tell me about a time you received critical feedback.',
            answer: `STAR, with a clear change. "During [bootcamp critique / mentor session / group project], [who] told me that [feedback — e.g. my case study jumped to final screens without explaining the problem]. My first reaction was [honest — a bit defensive], but I asked [clarifying question] to understand it. I then [action — rewrote the opening around the problem and research]. The result was [outcome — the next reviewer understood the project in half the time, or the case study felt clearer]. Now I [lasting habit]."`,
            tip: 'They are checking whether you are easy to give feedback to. Show that you asked questions and changed something.',
          },
          {
            question: 'How would you work with a developer who says your design is too hard to build?',
            answer: `Show curiosity, not defensiveness. "I would first ask what specifically is hard — is it [the animation, a custom component, data we do not have]? Then I would explain what the design is trying to achieve for the user, so we are solving the same problem. Often there is a simpler version that keeps most of the value, and developers usually know options I do not. In [group project / past role], [real example if you have one]. I would rather ship something good that works than hold out for something perfect that never ships."`,
            tip: 'They want to hear partnership and trade-offs. Saying "I would insist on my design" is a red flag.',
          },
          {
            question: 'What would you do if you had no idea how to solve a design problem?',
            answer: `Show a calm, practical approach. "First I would break it down and write down what I do know and what I am unsure about. Then I would look at how [similar products] handle it, check any research or data the team has, and sketch a few rough options. I would also ask a more experienced designer early, rather than struggling alone for days — I would bring my options so it is a focused question. For example, on [project] I [real example of getting unstuck]."`,
            tip: 'For juniors, knowing when to ask for help is a strength. They are listening for resourcefulness, not having every answer.',
          },
          {
            question: 'Do you have any questions for us?',
            answer: `Always have three ready, and ask ones you genuinely want answered. For example: "How are junior designers supported here — is there regular critique or a mentor?" "What does a typical project look like for this role, from brief to release?" "How do designers work with research and engineering day to day?" "What would success look like for me in the first few months?" If they have already answered one, say so and ask a follow-up instead: "You mentioned [thing] — could you tell me more about [detail]?"`,
            tip: 'Having no questions reads as low interest. Questions about learning and team practice show you are thinking about doing the job well.',
          },
        ],
      },
      {
        type: 'doDont',
        do: [
          'Say "I do not know, but here is how I would find out" when you are unsure',
          'Be clear about what you did versus what your team or course did',
          'Pause to think before answering — a few seconds of silence is fine',
          'Bring one project you can talk about in depth, including what you would change',
        ],
        dont: [
          'Claim results or metrics your concept project never had',
          'Memorise answers word for word — it sounds rehearsed and falls apart on follow-ups',
          'Criticise your bootcamp, past employer or classmates',
          'Give a salary figure before you understand the role; say you would like to learn more about the responsibilities first',
        ],
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'Why honest answers win',
        body: 'Interviewers for junior roles are not expecting years of shipped work. They are looking for someone who thinks clearly, learns quickly and tells the truth about their work. A modest, well-explained project beats an exaggerated one every time, because follow-up questions quickly reveal what really happened.',
      },
      {
        type: 'checklist',
        title: 'Night-before checklist',
        items: [
          'Portfolio open in the browser tab you will share, with notifications turned off',
          'Your one-minute "tell me about yourself" said out loud at least once',
          'Three questions for them written down',
          'Interview time, time zone, link and interviewer names confirmed',
          'Camera, microphone and internet tested (or journey planned if in person)',
          'Water, a notepad and a pen ready',
          'An early night — being rested helps more than last-minute cramming',
        ],
      },
    ],
    checklist: [
      'Written my own version of the top 5 answers using the templates',
      'Practised answers out loud for the top 5 questions',
      'Prepared a 5–7 minute walkthrough of my strongest project',
      'Can explain what I would do differently on each portfolio project',
      'Prepared three questions to ask the interviewer',
      'Done one mock interview with a friend or mentor',
    ],
  },

  // ---------------------------------------------------------------------------
  // Intermediate
  // ---------------------------------------------------------------------------
  {
    id: 'cg-interview-qa-i',
    section: 'interviews',
    level: 'intermediate',
    title: 'Interview questions & answers (Intermediate)',
    summary: 'Fourteen mid-level product design questions on trade-offs, measuring impact honestly and handling stakeholder pushback, with adaptable model answers.',
    minutes: 30,
    cover: 'interview',
    published: true,
    blocks: [
      { type: 'illustration', name: 'interview' },
      { type: 'text', body: howToUse },
      {
        type: 'qa',
        title: 'About you & motivation',
        items: [
          {
            question: 'Tell me about yourself and where you are in your career.',
            answer: `Frame yourself around the kind of problems you solve. "I am a product designer with [number] years of experience, mostly in [domain — e.g. B2B SaaS, fintech]. At [current company] I own [area — e.g. onboarding and billing] and work in a squad with [PM, engineers, researcher]. The work I am proudest of is [project], where [one-line outcome, stated honestly]. I am now looking for [what you want next — more ownership of a product area, stronger research culture], which is why this role stood out: [specific reason]."`,
            tip: 'They want a clear professional identity and a reason for the move. Avoid listing every job; focus on scope and what you want next.',
          },
          {
            question: 'Why are you leaving your current role?',
            answer: `Stay positive and forward-looking. "I have learned a lot at [company], especially [real skill — e.g. working closely with engineering on a design system]. The product is now [stage — e.g. mostly in maintenance], and I want to [growth goal — work on earlier-stage problems, do more discovery, own a larger area]. This role offers [specific match]. I am not in a rush to leave, so I am being selective about where I go next."`,
            tip: 'Anything that sounds like complaining about your manager or company is a warning sign. Talk about what you are moving towards.',
          },
          {
            question: 'What kind of design problems do you find most interesting?',
            answer: `Be specific and show self-knowledge. "I am drawn to [type of problem — e.g. complex workflows where people repeat a task many times a day, like internal tools or dashboards]. I enjoy [what — untangling messy flows, finding where time is lost]. On [project], I [example — shadowed support agents and simplified a five-step refund process]. I find visual polish satisfying too, but my strongest contribution is usually [your strength]."`,
            tip: 'This helps them judge fit with their product. A vague "all kinds of problems" misses a chance to show what you are genuinely good at.',
          },
        ],
      },
      {
        type: 'qa',
        title: 'Process & portfolio deep-dive',
        items: [
          {
            question: 'Walk me through a project where you had to make a significant trade-off.',
            answer: `Name the trade-off early and explain your reasoning. "On [project], we had to choose between [option A — e.g. a guided multi-step setup] and [option B — a single long form]. A gave [benefit] but cost [cost — e.g. two extra sprints]; B was quicker but [risk]. I [how you decided — mapped which steps users actually needed on day one, reviewed support data, discussed with the PM and tech lead]. We chose [option], with [mitigation — e.g. deferring advanced settings]. Looking back, [honest reflection on whether it was right]."`,
            tip: 'Mid-level designers are hired for judgement. They want to see you weighed user value, effort and risk — not that you got everything you wanted.',
          },
          {
            question: 'How did you measure the success of that project?',
            answer: `Be precise and honest about attribution. "Before we started, we agreed on [metric — e.g. setup completion rate] because it reflected [user goal]. After release, [what you observed, e.g. completion rose over the next [period]], though [honest caveat — a marketing campaign ran at the same time, so we cannot attribute all of it to the redesign]. We also [qualitative evidence — fewer support tickets on the topic, follow-up interviews]. If I could not get numbers: "I did not have access to analytics, so I relied on [usability test results, feedback]; next time I would set up measurement before launch."`,
            tip: 'They are testing integrity as much as impact. Vague or inflated numbers invite hard follow-ups — a caveated, real result is stronger.',
          },
          {
            question: 'What would you do differently on this project?',
            answer: `Show real reflection, not a humble-brag. "Two things. First, I would [process change — e.g. involve engineering at the sketching stage; we found a technical constraint late and had to rework [part]]. Second, I would [research change — test with existing customers rather than only new sign-ups, because [why]]. Both are now part of how I work: [evidence — e.g. I now run a short feasibility review before high-fidelity design]."`,
            tip: 'An answer of "nothing" or "given more time, more polish" signals limited reflection. Name concrete changes and show you have already applied the lesson.',
          },
          {
            question: 'How do you decide which research method to use?',
            answer: `Link method to the question and constraints. "I start with what we need to learn and how confident we need to be. If we do not understand the problem, I lean towards [interviews, contextual enquiry]. If we have a design and want to know whether people can use it, [usability testing]. If we need to know how common something is, [analytics or a survey]. Then I balance it against time and access. On [project], we had [constraint], so I [choice] and was clear with the team that [limitation]."`,
            tip: 'They want to see you match methods to questions, rather than running the same ritual every time. Acknowledging limits shows maturity.',
          },
        ],
      },
      {
        type: 'qa',
        title: 'Design craft',
        items: [
          {
            question: 'Critique a product you use regularly.',
            answer: `Use a structure: context, strengths, problems, suggestion. "Take [app — e.g. a food delivery app]. The main user goal is [goal — reorder quickly]. It does [strength — e.g. surface recent orders on the home screen] well. One problem is [issue — fees only appear at the final step, which risks surprising people at checkout]. I suspect the business reason is [plausible reason], so I would explore [suggestion — an estimated total earlier] and test whether it [expected effect] without assuming it would help. I would want data on [what] before recommending it."`,
            tip: 'Interviewers listen for balance and business awareness. Pure criticism, or ignoring why a product might be built that way, weakens the answer.',
          },
          {
            question: 'How do you work with or contribute to a design system?',
            answer: `Show both use and contribution. "I use the system by default, because consistency helps users and speeds up the team. When a component does not fit, I first check whether I can meet the need with existing parts. If not, I [process — raise it with the system owners, show the use case, propose a variant]. At [company], I [example — proposed an inline validation pattern that three squads then adopted] after [how you built the case]. I also try to document decisions so the next designer does not have to rediscover them."`,
            tip: 'They want someone who respects shared standards but can evolve them through proper channels. "I detach components when needed" without context is a warning sign.',
          },
          {
            question: 'How do you handle edge cases and error states?',
            answer: `Show a systematic habit. "I list states for each screen early — empty, loading, error, partial data, long content, no permissions — and design them alongside the happy path, not after. I often ask engineers which failures are realistic. On [project — e.g. a payments screen], we designed [example — clear recovery for a declined card that kept the user's details]. I also check content extremes, like very long names or translated text, because those break layouts in production."`,
            tip: 'This separates people who have shipped from people who have only designed happy paths. Concrete examples matter more than the list.',
          },
        ],
      },
      {
        type: 'qa',
        title: 'Collaboration & scenarios',
        items: [
          {
            question: 'Tell me about a time a stakeholder pushed back on your design.',
            answer: `STAR, showing you listened and used evidence. "On [project], [stakeholder — e.g. the head of sales] wanted [request — a large promotional banner on the dashboard]. I was concerned it would [impact on users]. I asked what outcome they needed — [underlying goal]. I proposed [alternative] and suggested we [test it / run it for a set period and review]. The result was [outcome — honest, including if you only partly got your way]. What I learned was [lesson — understanding the goal behind the request]."`,
            tip: 'They are checking that you can disagree productively. Stories where the stakeholder is portrayed as foolish reflect badly on you.',
          },
          {
            question: 'How do you prioritise when you have more requests than time?',
            answer: `Show a clear, shared method. "I make the work visible first — list requests with the problem each solves. Then I work with my PM to weigh [user impact, business value, effort, urgency]. I am explicit about what we are not doing and why, so stakeholders hear it from us early. For instance, at [company] [example — I proposed a lighter version of one request so we could fit a higher-impact fix]. I would rather do fewer things well than spread thin."`,
            tip: 'They want to see you prioritise with product partners, not alone. Saying yes to everything is a common mid-level trap.',
          },
          {
            question: 'Describe a time a project did not go well.',
            answer: `Own your part without over-dramatising. "On [project], [what went wrong — we launched a new navigation and support contacts increased]. Looking back, my part was [honest contribution — I tested with internal staff rather than customers]. We [recovery — ran quick customer tests, found [issue], shipped a fix in [timeframe]]. Since then I [lasting change]. The experience made me [reflection]."`,
            tip: 'Everyone has failures; they are listening for ownership and learning. Blaming others or choosing a trivial "failure" both weaken the answer.',
          },
          {
            question: 'What are your salary expectations?',
            answer: `Answer with principles rather than a number you have not researched. "I would like to understand the full scope of the role first — level, responsibilities and the overall package. I am researching typical ranges for [role] at [level] in [location/remote] and would expect something fair for that. Could you share the budgeted range for this role?" If they insist, give a range you have researched from reliable sources and can justify by scope, not a single number, and remember benefits, learning budget and flexibility count too.`,
            tip: 'Recruiters are checking you are in the same range, not trying to trap you. Being calm, researched and clear is what matters.',
          },
        ],
      },
      {
        type: 'doDont',
        do: [
          'State the trade-off and your reasoning, not just the final design',
          'Separate what you did from what the team did, using "I" and "we" accurately',
          'Caveat metrics honestly — mention other factors that may have influenced them',
          'Ask clarifying questions before answering scenario questions',
        ],
        dont: [
          'Present team results as yours alone',
          'Invent or round up numbers to sound impressive',
          'Answer "what would you do differently?" with "nothing"',
          'Speak negatively about colleagues or stakeholders',
        ],
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'Why interviewers dig into trade-offs',
        body: 'At mid-level, you are expected to own work without constant direction. The only way an interviewer can judge that is by hearing how you made decisions under real constraints. Clear reasoning about a compromise tells them more than a polished final screen.',
      },
      {
        type: 'checklist',
        title: 'Night-before checklist',
        items: [
          'Two case studies ready, each with the key trade-off and how success was measured',
          'Honest caveats prepared for any numbers you will mention',
          'One stakeholder pushback story and one failure story rehearsed',
          'Researched salary range and your principles for discussing it',
          'Three questions ready about design maturity and how the team works',
          'Tech checked, link confirmed, portfolio tabs open',
        ],
      },
    ],
    checklist: [
      'Practised answers out loud for the top 5 questions',
      'Prepared a trade-off story and a failure story using STAR',
      'Checked every metric I mention is accurate and caveated',
      'Rehearsed a product critique of an app I use',
      'Researched a salary range and how I will discuss it',
      'Done a mock interview with a peer or mentor',
    ],
  },

  // ---------------------------------------------------------------------------
  // Expert
  // ---------------------------------------------------------------------------
  {
    id: 'cg-interview-qa-e',
    section: 'interviews',
    level: 'expert',
    title: 'Interview questions & answers (Expert)',
    summary: 'Fifteen senior, lead and staff design interview questions on influence, strategy and building teams, with structured model answers.',
    minutes: 35,
    cover: 'interview',
    published: true,
    blocks: [
      { type: 'illustration', name: 'interview' },
      { type: 'text', body: howToUse },
      {
        type: 'qa',
        title: 'Leadership & influence',
        items: [
          {
            question: 'Tell me about your leadership experience and what you want next.',
            answer: `Clarify your track and scope. "For the last [number] years I have been [role — e.g. a lead designer / staff designer] at [company], responsible for [scope — e.g. a team of four across two product areas, or cross-cutting quality on the platform]. My biggest contribution was [initiative], which [outcome and how it changed how the organisation works]. I am [choosing the management / individual contributor path] because [honest reason], and I am looking for [what next — e.g. an organisation that is investing in design maturity]."`,
            tip: 'At this level, they are checking that your track (manager or IC) matches the role. Being clear about which you want avoids a mismatch for both sides.',
          },
          {
            question: 'Describe a time you influenced a decision without formal authority.',
            answer: `Show how you built the case, not just the outcome. "At [company], [decision in play — e.g. leadership planned to add a paid tier by restricting existing features]. I believed [risk to users/business]. I [actions — gathered evidence from support and research, modelled the impact on key user journeys with finance, found an ally in [role]]. I proposed [alternative] and framed it around [their goal]. The outcome was [honest result — e.g. a phased approach]. What I learned about influence was [insight — e.g. to engage early before positions harden]."`,
            tip: 'They want to hear stakeholder mapping, evidence and framing in the business\'s terms. Winning through persistence alone is not the story they are looking for.',
          },
          {
            question: 'How do you raise the quality bar across teams you do not manage?',
            answer: `Talk about systems, not heroics. "I focus on making good work easier rather than policing it. At [company], I [mechanisms — e.g. set up a weekly cross-team critique, defined a shared definition of 'ready for build', worked with the design system team on [pattern]]. I also [show by example — pair with designers on tricky problems]. We tracked [honest signal — e.g. fewer design-related issues found in QA, feedback from engineering leads]. The hardest part was [challenge] and I addressed it by [action]."`,
            tip: 'Senior candidates are judged on leverage. Listing the work you personally polished misses the point of the question.',
          },
          {
            question: 'Tell me about a conflict with a senior leader and how you handled it.',
            answer: `Show maturity and respect. "[Leader — e.g. the CPO] and I disagreed on [issue — e.g. cutting research from a major launch to hit a date]. I asked for time to understand their constraints — [what you learned, e.g. a contractual commitment]. I then proposed [compromise — lightweight testing in parallel with build, with agreed criteria to delay if we found severe issues]. We [outcome]. The relationship was [how it ended up], and I learned [lesson — e.g. to bring options, not objections]."`,
            tip: 'They are testing whether you can disagree upwards without damaging trust. Framing it as you versus them is a warning sign.',
          },
          {
            question: 'How would you structure a design team as the company grows?',
            answer: `Show that structure follows strategy, and name the trade-offs. "It depends on the stage and how the product is organised. With [small team size], I would keep designers close to product squads so they own outcomes, with shared critique to keep quality consistent. As we grow, I would consider [options — e.g. a design system or platform role, dedicated research, design operations] when the pain justifies it — for example [signal, such as inconsistent components slowing delivery]. At [company], I [example of a structure change you led or proposed] and the trade-off was [e.g. embedded designers moved faster but felt isolated, so we added a weekly guild]."`,
            tip: 'They want to hear that there is no single right model and that you can reason about trade-offs. Copying a structure from a large tech company without context is a common mistake.',
          },
        ],
      },
      {
        type: 'qa',
        title: 'Strategy & ambiguity',
        items: [
          {
            question: 'How do you connect design work to business strategy?',
            answer: `Show fluency in both languages. "I start by understanding the company's priorities for [period] and how the product makes money. Then I look for where user problems and business goals overlap. At [company], the goal was [e.g. improve retention for small business customers]; research showed [insight]. I proposed [initiative] and framed it as [business outcome], with [how you'd measure it]. I was careful to present [assumptions] openly, so leadership could weigh the risk themselves."`,
            tip: 'They listen for commercial awareness without abandoning users. Talking only about "delight" or only about revenue both fall short.',
          },
          {
            question: 'Tell me about a time you worked on a problem with no clear brief.',
            answer: `Show how you created clarity. "At [company], we were asked to [vague goal — e.g. 'fix the enterprise experience']. I [first steps — interviewed stakeholders to find where they disagreed, reviewed customer data and churn reasons, ran [research]]. I then wrote a short problem framing with [number] opportunity areas, proposed criteria for choosing between them, and ran a session with [leaders] to agree. We chose [focus] and deliberately parked [others]. The outcome was [honest result]."`,
            tip: 'Handling ambiguity is a core senior expectation. They want to see you define the problem and get agreement, not wait for someone to hand you a brief.',
          },
          {
            question: 'How would you approach your first 90 days in this role?',
            answer: `Listen first, then act visibly. "In the first month, I would [learn — meet each designer and key partners, review current work, use the product and read research]. In the second, [diagnose — identify the biggest gaps in process, quality or team health, and share my observations to test them]. By the third, [act — agree two or three priorities with my manager and start one visible improvement, such as [example]]. I would avoid big changes before I understood why things are the way they are."`,
            tip: 'The common mistake is arriving with a plan from your last company. They want curiosity, humility and a bias to action once you understand the context.',
          },
          {
            question: 'Tell me about something you decided not to do.',
            answer: `Show strategic focus. "At [company], there was pressure to [opportunity — e.g. build a mobile app alongside the web product]. I looked at [evidence — how customers actually used the product, what research told us, the team's capacity] and concluded [reason — most use happened at a desk and the web experience still had serious gaps]. I recommended we [alternative — make the web product responsive and fix [gap] first], with [a trigger for revisiting the decision]. [Honest outcome]. Saying no was harder than building, so I [how you brought people along]."`,
            tip: 'Senior people are valued for what they stop as much as what they start. They listen for evidence, clear criteria and how you handled disappointment.',
          },
          {
            question: 'Present a case study to our panel.',
            answer: `Structure it for mixed audiences. "[1] Context: the business situation and why this mattered — [one slide]. [2] My role and team — [who did what]. [3] The problem and key insight — [evidence]. [4] Key decisions and trade-offs, including what we chose not to do — [two or three]. [5] Outcome — [honest results and caveats]. [6] What I would do differently and what it taught me about [leadership / strategy]." Aim for roughly half the time presenting and half discussion, and rehearse to time.`,
            tip: 'Panels judge storytelling, judgement and how you handle challenge. Leaving no time for questions, or getting defensive under probing, costs more than a weak slide.',
          },
        ],
      },
      {
        type: 'qa',
        title: 'Hiring, mentoring & critique',
        items: [
          {
            question: 'How do you hire designers?',
            answer: `Show a fair, structured approach. "I start by defining what the role needs now — [skills and level] — and write criteria before looking at candidates. I use a consistent process: [steps — e.g. portfolio review against criteria, a conversation about a real project, a collaborative exercise rather than unpaid spec work]. I involve [partners — PM, engineer] and hold a debrief where we discuss evidence, not gut feel. I have learned to watch for [bias — e.g. favouring people with similar backgrounds or polished visuals over strong thinking]."`,
            tip: 'They want to hear structure and awareness of bias. "I just know a good designer when I see one" is a red flag.',
          },
          {
            question: 'How do you help a struggling designer on your team?',
            answer: `Show care and clarity together. "First I try to understand the cause — [skills, unclear expectations, workload, something outside work]. I would have a direct, private conversation, share specific examples and agree clear expectations. At [company], [example — a designer struggled to present work; we agreed goals, I paired with them on two reviews and gave focused feedback]. [Outcome]. If things do not improve despite support, I would follow a fair process with HR, being honest with the person throughout."`,
            tip: 'They listen for both empathy and willingness to have hard conversations. Avoiding the issue or jumping straight to performance management both concern interviewers.',
          },
          {
            question: 'How do you run a good design critique?',
            answer: `Show a repeatable structure. "I set a clear purpose — the presenter says what stage the work is at and what feedback they need. Feedback is tied to goals: 'this may not work for [user] because [reason]' rather than 'I don't like it'. I make sure quieter people get space, often by collecting written comments first. The presenter decides what to act on. At [company], I [change you made — e.g. introduced a 'questions before opinions' round], which [honest effect]."`,
            tip: 'Critique culture is a strong signal of team health. They want to hear psychological safety and focus on goals, not taste.',
          },
          {
            question: 'How do you give difficult feedback to a senior peer?',
            answer: `Show directness with respect. "I do it privately and soon, and I focus on the impact rather than the person. For example, at [company], [peer — e.g. another lead] regularly [behaviour — changed agreed designs late without telling the squad]. I said: 'When [behaviour] happened on [project], [impact — the team lost a sprint of work]. Can we talk about how to avoid that?' Then I listened, because [what you learned — they were getting late requests from their director]. We agreed [change]. I would escalate only if a direct conversation had not worked."`,
            tip: 'They want to know you will address problems among leaders rather than avoiding them or going over people\'s heads. Specific, impact-focused wording matters.',
          },
          {
            question: 'What questions do you have for us?',
            answer: `Use this to assess the role as seriously as they assess you. For example: "Where does design sit in the organisation, and who does this role report to?" "How are product decisions made, and how does design influence the roadmap?" "What would you need this person to have achieved in the first year?" "What is the biggest challenge facing the design team right now?" "Is there headcount planned, and how is design budget decided?"`,
            tip: 'At senior levels, sharp questions show strategic thinking and help you avoid a role with mismatched expectations.',
          },
        ],
      },
      {
        type: 'doDont',
        do: [
          'Talk about systems and leverage, not only personal craft',
          'Be clear about your track — management or individual contributor',
          'Discuss scope, reporting line and expectations as well as compensation',
          'Welcome challenge from the panel and think out loud',
        ],
        dont: [
          'Claim sole credit for organisational outcomes',
          'Arrive with a fixed plan from your last company',
          'Dismiss business constraints as "not design\'s problem"',
          'Let a presentation overrun and squeeze out discussion time',
        ],
      },
      {
        type: 'callout',
        tone: 'why',
        title: 'Why senior interviews feel different',
        body: 'Senior hires shape how other people work, so interviewers are asking whether you will make the whole organisation better, not just whether you are a strong designer. Every answer should show judgement, influence and how you multiply the work of others.',
      },
      {
        type: 'checklist',
        title: 'Night-before checklist',
        items: [
          'Panel presentation rehearsed to time, with space for discussion',
          'Names and roles of each panel member noted',
          'Three leadership stories ready: influence, conflict, developing someone',
          'Questions ready about reporting line, design maturity and first-year expectations',
          'Clear principles for compensation and scope conversations',
          'Tech, slides and backup copy checked',
        ],
      },
    ],
    checklist: [
      'Practised answers out loud for the top 5 questions',
      'Prepared a panel case study presentation and rehearsed it to time',
      'Prepared influence, conflict and mentoring stories with honest outcomes',
      'Drafted a 90-day approach for the role',
      'Prepared questions to assess design maturity and expectations',
      'Clarified my compensation and scope principles',
    ],
  },
]
