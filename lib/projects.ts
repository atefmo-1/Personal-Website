import {
  siClaude,
  siGoogle,
  siNextdotjs,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVitest,
  siZod,
} from "simple-icons";
import type { Skill } from "./skills";

// Every project page is written for a recruiter skimming for two things: product judgment and
// engineering depth. So each case study answers, in order:
//   what it is and where to try it (tagline, links, cover, meta, numbers)
//   why it matters (problem) and what users said (research: quote, finding, what I built because of it)
//   how I worked, start to finish (process)
//   what it does, with real screens (features, screens, gallery)
//   the calls I made and why (decisions.product, decisions.engineering), and where AI fits
//   what it's built with (stack) and what's next
// Keep every number and quote checkable against the project's code, data or interview notes.
// Optional sections (framing, research, personas, journey, gallery, ai) are skipped on the page
// when a project leaves them out.
type Titled = { title: string; text: string };
type Shot = { src: string; alt: string; caption: string; width: number; height: number };

export type Persona = {
  name: string;
  archetype: string;
  basedOn: string;
  summary: string;
  tags: string[];
  goals: string[];
  frustrations: string[];
};

export type CaseStudy = {
  tagline: string;
  links: { label: string; url: string }[];
  cover: { src: string; alt: string; width: number; height: number };
  meta: { label: string; value: string }[];
  numbers: { value: string; label: string }[];
  problem: string[];
  // The design question and user story that framed the work.
  framing?: { hmw: string; story: string };
  research?: {
    intro: string;
    insights: { title: string; quote: string; who: string; finding: string; response: string }[];
  };
  personas?: {
    intro: string;
    people: [Persona, Persona];
    // Where each persona sits between two poles, 0 (left) to 1 (right): [first, second].
    spectrum: { left: string; right: string; values: [number, number] }[];
    takeaway: string;
  };
  journey?: {
    intro: string;
    // Each stage's feeling, 0 (low) to 1 (high), drives the emotional curve.
    stages: { name: string; doing: string; thinking: string; feeling: string; level: number }[];
    quote: string;
    flow: { title: string; steps: string[]; decision: string; yes: string[]; no: string[] };
    principles: Titled[];
  };
  process: Titled[];
  features: Titled[];
  // Phone screens shown side by side.
  screens: Shot[];
  // More screens, as square images.
  gallery?: Shot[];
  decisions: { product: Titled[]; engineering: Titled[] };
  ai?: { intro: string; built: Titled[]; next: Titled[] };
  stack: { label: string; items: Skill[] }[];
  next: string[];
};

export type Project = {
  // URL segment for the project page: /projects/<slug>
  slug: string;
  name: string;
  status: string;
  blurb: string;
  tags: string[];
  // Live product, shown as its own link on the card.
  live?: { label: string; url: string };
  // Card image, shown beside the text. Transparent images blend best with the card.
  image: string;
  // Projects with a case study get their own page, and their card links to it.
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "reloco",
    name: "Reloco",
    status: "Live",
    blurb:
      "A gamified roadmap that guides F-1 international students at UNC from their first flight to their first job. I researched, designed, built and shipped it end to end.",
    tags: ["Product design", "Full-stack", "Next.js", "Supabase", "EdTech"],
    live: { label: "reloco.app", url: "https://reloco.app" },
    image: "/projects/reloco/card.webp",
    // Sources: /Users/atefmo/reloco/RELOCO_PROJECT_BRIEF.md, the app's README and code (44 tasks and
    // 34 official links in src/lib/library/tasks.ts, 101 Vitest tests), and the interviews doc
    // "Atef - 3 interviews" in Google Drive. Quotes are verbatim from the two real interviews
    // (Giang, Nana); interview 3 there is simulated, so it isn't quoted. Interviewees are described, not named.
    // Screens: /Users/atefmo/reloco/portfolio-screenshots, plus demo-mode screens on Reloco's paintings.
    caseStudy: {
      tagline: "A gamified roadmap that takes F-1 students at UNC from their first flight to their first job.",
      links: [{ label: "Try it at reloco.app", url: "https://reloco.app" }],
      cover: {
        src: "/projects/reloco/landing.webp",
        alt: "Reloco's landing page: a painting of UNC's Old Well at sunset with the headline From your first flight to your first job",
        width: 2000,
        height: 1157,
      },
      meta: [
        { label: "Role", value: "Solo: research, product, UX, visual design, engineering" },
        { label: "Status", value: "Live at reloco.app" },
        { label: "Platform", value: "Mobile-first web app, light and dark" },
        { label: "For", value: "F-1 undergrads at UNC-Chapel Hill" },
      ],
      numbers: [
        { value: "44", label: "tasks in a researched rules library" },
        { value: "34", label: "official sources linked, from ISSS to the IRS" },
        { value: "9", label: "chapters, from pre-flight to STEM OPT" },
        { value: "101", label: "automated tests on the roadmap engine" },
      ],
      problem: [
        "F-1 students juggle dozens of visa, tax, travel and work rules over four years: SEVIS, I-94, travel signatures, CPT, OPT, STEM OPT, Form 8843. The answers are spread across UNC, IRS, USCIS and CBP pages, and missing one deadline can put a student's status at risk.",
        "As an international student at UNC myself, I heard the same story in every interview: the information exists, but finding it, in the right order, depends on who you happen to know.",
      ],
      framing: {
        hmw: "How might we help international students find trusted information about immigration, banking, healthcare and daily life, all in one place and in the right order?",
        story: "As an international student, I want to find all information in one place, so that I save time.",
      },
      research: {
        intro:
          "Before writing any code, I interviewed international students at UNC about their first weeks in the US: getting an SSN, banking and credit, taxes, and work rules. Four patterns came up, and each one became a product decision.",
        insights: [
          {
            title: "Order is the hard part",
            quote: "I first had to find a job on campus.",
            who: "Junior from Vietnam, on getting an SSN",
            finding:
              "An SSN meant finding a campus job, getting a letter, then a bus to the Social Security office in Durham. Nobody hands you the sequence.",
            response: "Tasks are dependency-ordered, so the SSN task starts with the job it depends on.",
          },
          {
            title: "It's out there, but scattered",
            quote: "It's all out there, but it's, like, all fragmented.",
            who: "Junior from London",
            finding:
              "Students piece things together by trial and error, across ISSS pages, government sites and chatbots. The chatbots were often wrong; the sources they cited were right.",
            response: "Every step links to its official page, and AI can explain but never decide.",
          },
          {
            title: "Know-how travels by word of mouth",
            quote: "The people before me passed the knowledge to me.",
            who: "Junior from Vietnam",
            finding:
              "SSN steps, credit cards and driving tips came from upperclassmen or one patient banker. Students without that network were on their own.",
            response: "Reloco turns that upperclassman advice into a plan anyone can follow, starting before the flight.",
          },
          {
            title: "The deadlines hide years ahead",
            quote: "You should be meeting with them like eight to twelve months in advance.",
            who: "Junior from London, on CPT approval",
            finding: "Internship work authorization needs the advisor looped in months early, and most students learn that too late.",
            response: "The roadmap spans the whole degree, so CPT and OPT show up years early, not the week they're due.",
          },
        ],
      },
      // From "Persona Posters" and "User stories, user journeys, user flows" in Figma. Personas are
      // built from the two real interviews; the simulated third persona is left out.
      personas: {
        intro:
          "I turned the interviews into two personas. They sit at opposite ends of almost every scale, which made them a useful test: a design has to work for both.",
        people: [
          {
            name: "Connected Khoa",
            archetype: "The community learner",
            basedOn: "Built from the interview with a junior from Vietnam",
            summary:
              "Learned most of what he knows about US systems from upperclassmen and WhatsApp groups. Goes in person instead of researching online, and passes what he learns down to newer students.",
            tags: ["Peer-dependent", "Guided by others", "Low frustration"],
            goals: [
              "Handle each system as it comes up, without stress",
              "Build credit gradually",
              "Help younger international students settle in",
            ],
            frustrations: [
              "Doesn't know what he doesn't know until it's urgent",
              "Depends on who happens to be around to help",
              "Stuck when nobody he knows has done it before",
            ],
          },
          {
            name: "Independent Amara",
            archetype: "The self-driven researcher",
            basedOn: "Built from the interview with a junior from London",
            summary:
              "Built her own roadmap from DHS pages, ISSS documents and AI chatbots, then checked every answer against the source. Understands CPT and OPT better than most advisors.",
            tags: ["Proactive", "Self-reliant", "High frustration"],
            goals: [
              "Master every system before it catches her off guard",
              "Land a top employer willing to sponsor her visa",
              "Create the central guide she wished she had",
            ],
            frustrations: [
              "Information is fragmented across dozens of sources",
              "Advisors are slow and miss the nuance of her situation",
              "Chatbots give partly wrong answers she has to verify",
            ],
          },
        ],
        spectrum: [
          { left: "Reactive", right: "Proactive", values: [0.28, 0.87] },
          { left: "Peer-dependent", right: "Self-reliant", values: [0.17, 0.75] },
          { left: "Official sources", right: "Informal sources", values: [0.8, 0.29] },
          { left: "Trial and error", right: "Guided by others", values: [0.8, 0.16] },
          { left: "Low frustration", right: "High frustration", values: [0.26, 0.83] },
        ],
        takeaway:
          "Two very different students, one missing piece: a trusted path through the system, in the right order. Khoa needs the guidance his network gave him without depending on luck. Amara needs sources she can verify without the hours of research.",
      },
      journey: {
        intro:
          "Before designing screens, I mapped Amara's first week with the product. She tries to apply for her first credit card and learns she needs an SSN first. This early map shaped the dependency system that ships today.",
        stages: [
          {
            name: "Discovery",
            doing: "Finds Reloco through a peer tip in a WhatsApp group",
            thinking: "There has to be a better way to figure all of this out.",
            feeling: "Overwhelmed",
            level: 0.08,
          },
          {
            name: "Onboarding",
            doing: "Signs up with Google and answers a few questions about her situation",
            thinking: "Finally! Something that asks me what visa I'm on.",
            feeling: "Relieved",
            level: 0.45,
          },
          {
            name: "Roadmap",
            doing: "Sees her tasks by phase and taps Build Credit",
            thinking: "Everything in one place, in order.",
            feeling: "Excited",
            level: 0.56,
          },
          {
            name: "Blocked task",
            doing: "Sees a lock: complete your SSN first, with a link to that task",
            thinking: "Why can't I start this? Oh, I need my SSN first. That makes sense.",
            feeling: "Briefly frustrated",
            level: 0.3,
          },
          {
            name: "SSN first",
            doing: "Follows the guide and document checklist to the SSA office",
            thinking: "The guide is clear. I know exactly what to bring.",
            feeling: "Confident",
            level: 0.72,
          },
          {
            name: "Credit card",
            doing: "Returns to the unlocked task, goes to the bank, gets approved",
            thinking: "I didn't have to figure this out alone.",
            feeling: "Accomplished",
            level: 0.94,
          },
        ],
        quote:
          "The moment a user sees ‘complete SSN first’ instead of hitting a dead end with no explanation is the moment Reloco earns trust.",
        flow: {
          title: "Task flow: a first task, with a dependency block",
          steps: ["Land on Reloco", "Sign up with Google", "Onboarding", "Roadmap generated", "Open a task"],
          decision: "Has an unfinished prerequisite?",
          yes: ["Blocked: complete SSN first", "Do the SSN task", "Return, now unlocked"],
          no: ["Read the guide", "Mark complete", "Celebrate", "Next task suggested"],
        },
        principles: [
          {
            title: "Hick's Law",
            text: "More choices mean slower decisions, so Today shows one clear next step instead of the whole list.",
          },
          {
            title: "Tesler's Law",
            text: "The complexity of immigration doesn't disappear. The system absorbs it through dependencies and dates, so the student doesn't have to.",
          },
        ],
      },
      process: [
        {
          title: "Listen",
          text: "Interviewed international students about their first weeks in the US: SSN, banking, credit, taxes and work rules.",
        },
        {
          title: "Define",
          text: "Synthesized the interviews into four insights, two personas, a journey map and a task flow, around one problem: the information exists, but it's fragmented and out of order.",
        },
        {
          title: "Map the rules",
          text: "Researched F-1 requirements across ISSS, IRS, USCIS, CBP and SSA, then modeled them as 44 tasks with conditions, time windows, dependencies and sources.",
        },
        {
          title: "Scope a wedge",
          text: "Started with F-1 undergrads at UNC only, so every deadline, office and link could be exact instead of generic.",
        },
        {
          title: "Design the loop",
          text: "One next move on Today, chapters and passport stamps for momentum, and a painted visual identity that feels like Chapel Hill.",
        },
        {
          title: "Build and ship",
          text: "Full stack on Next.js and Supabase, 101 tests on the roadmap engine, live on Vercel.",
        },
      ],
      features: [
        {
          title: "One next move, not a wall of forms",
          text: "Ten quick questions build a dated plan for the whole degree. Today shows one focus task and at most two more for the week.",
        },
        {
          title: "Every step, backed by its source",
          text: "Each task breaks into tickable steps with a time estimate, what to bring, and a link to the exact UNC, IRS or USCIS page.",
        },
        {
          title: "The whole degree, in chapters",
          text: "Nine chapters run from pre-flight to STEM OPT. When rules shift, like the 2026 DHS duration-of-status rule and its court pause, Reloco flags it and says what still applies.",
        },
        {
          title: "A passport that fills up",
          text: "Tasks earn miles, chapters earn stamps, weekly streaks keep momentum, and finishing earns a certificate. Change a date and the whole roadmap reflows.",
        },
        {
          title: "Dates, not documents",
          text: "The wallet keeps only key dates from a passport, visa, I-20 and I-94, and the roadmap plans around them. No copies, no ID numbers.",
        },
        {
          title: "Arrival mode",
          text: "From two days before landing to three days after, Today turns into a landing-day checklist for the border and the first hours on the ground.",
        },
      ],
      screens: [
        {
          src: "/projects/reloco/today-phone.webp",
          alt: "Reloco's Today screen for a junior: a boarding pass from Pune to RDU at 64% progress, and the next task, get a travel signature before going home for winter",
          caption: "Today: one next move and a boarding pass",
          width: 780,
          height: 1688,
        },
        {
          src: "/projects/reloco/journey-phone.webp",
          alt: "Reloco's Journey screen: a rules update about the DHS duration of status rule, above stamped chapters for Pre-flight, Touchdown and First month",
          caption: "Journey: the whole degree in chapters",
          width: 780,
          height: 1688,
        },
        {
          src: "/projects/reloco/passport-phone.webp",
          alt: "Reloco's passport page with six of nine chapter stamps collected and a certificate ready",
          caption: "Passport: a stamp for every chapter",
          width: 780,
          height: 1120,
        },
      ],
      gallery: [
        {
          src: "/projects/reloco/task.webp",
          alt: "A Reloco task page with three steps, each linking to Campus Health's official pages",
          caption: "A task: steps, time and official sources",
          width: 1200,
          height: 1200,
        },
        {
          src: "/projects/reloco/wallet.webp",
          alt: "Reloco's document wallet explaining that it never keeps copies of documents",
          caption: "Wallet: dates, not documents",
          width: 1200,
          height: 1200,
        },
        {
          src: "/projects/reloco/arrival.webp",
          alt: "Reloco's arrival mode: a checklist of documents to keep in hand at the border",
          caption: "Arrival mode: the landing-day checklist",
          width: 1200,
          height: 1200,
        },
      ],
      decisions: {
        product: [
          {
            title: "Narrow on purpose",
            text: "Version one serves F-1 undergrads at UNC. In a compliance-heavy space the value is precision, and a narrow wedge let every deadline and office be right.",
          },
          {
            title: "Weekly streaks, not daily",
            text: "Visa and tax work comes in bursts, so daily streaks would punish students for having nothing due. Streaks are weekly, and quiet weeks don't break them.",
          },
          {
            title: "Value before sign-up",
            text: "Guest mode builds a full roadmap with no account. Signing in with Google carries the progress over, so nobody hits a login wall before seeing the product work.",
          },
          {
            title: "Rules decide, AI assists",
            text: "The schedule comes from rules with cited sources. AI can explain and personalize, but it never adds, removes or reschedules a task.",
          },
        ],
        engineering: [
          {
            title: "A deterministic roadmap engine",
            text: "A pure function turns a student's profile into a filtered, scheduled, dependency-ordered roadmap. Tests check invariants across several student profiles, like never opening a task before its dependencies. Modeling dependencies even exposed a cycle (the campus job needed an SSN, and the SSN needs a job offer), now fixed in the library.",
          },
          {
            title: "Two stores, one interface",
            text: "One Store interface with Supabase and cookie-backed implementations. Guests run with no database at all, and their progress is imported into Postgres when they sign in.",
          },
          {
            title: "Privacy in the schema",
            text: "Row-level security on every table and a private storage bucket. The document scanner's output schema only has date fields, images are never stored, and students can delete everything at any time.",
          },
          {
            title: "Built to fit into a student's week",
            text: "A live calendar feed for Google, Apple and Outlook that updates as the roadmap changes, revocable read-only share links for family or sponsors, and email reminders built with a daily cron job and one-click unsubscribe, ready to switch on.",
          },
        ],
      },
      ai: {
        intro:
          "In a high-stakes space, AI should explain and assist, never decide. The rules engine owns every date and task; AI works around it.",
        built: [
          {
            title: "Personal notes",
            text: "An optional Claude pass writes a short note for each task based on the student's situation. It can't add, remove or reschedule anything.",
          },
          {
            title: "Document scanner",
            text: "A photo of a passport, visa, I-20 or I-94 becomes key dates in the wallet. The output schema only allows date fields, and images are never stored.",
          },
        ],
        next: [
          {
            title: "Ask Reloco",
            text: "Answers F-1 questions using only Reloco's sourced tasks and UNC ISSS pages, cites its source, and says \"ask ISSS\" when it isn't sure.",
          },
          {
            title: "\"What does this mean?\"",
            text: "Paste an email from ISSS, the IRS or a landlord and get a plain-English explanation linked to the right task.",
          },
          {
            title: "Cost by design",
            text: "A small, fast model, per-student daily limits and a hard monthly spending cap.",
          },
        ],
      },
      stack: [
        {
          label: "Frontend",
          items: [
            { name: "Next.js 16 (App Router)", icon: siNextdotjs },
            { name: "React 19", icon: siReact },
            { name: "TypeScript", icon: siTypescript },
            { name: "Tailwind CSS v4", icon: siTailwindcss },
            { name: "Motion" },
          ],
        },
        {
          label: "Backend",
          items: [
            { name: "Supabase Postgres + RLS", icon: siSupabase },
            { name: "Google sign-in", icon: siGoogle },
            { name: "Zod", icon: siZod },
            { name: "Claude API", icon: siClaude },
          ],
        },
        {
          label: "Ship",
          items: [
            { name: "Vitest, 101 tests", icon: siVitest },
            { name: "Vercel", icon: siVercel },
            { name: "iCal feeds" },
          ],
        },
      ],
      next: [
        "Next up: the AI features above, an OPT unemployment day counter, a travel copilot that checks your documents before a trip home, and a pilot with UNC ISSS. Then more schools on top of the school-pack layer, which already keeps UNC's offices and deadlines separate from the core engine. The number I'm watching: how many students finish Pre-flight before they land.",
      ],
    },
  },
];

export const projectsIntro = "Things I build when nobody's assigning homework 🛠️";
