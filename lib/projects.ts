import {
  siClaude,
  siNextdotjs,
  siPuppeteer,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVitest,
  siZod,
} from "simple-icons";
import type { Skill } from "./skills";

// Project pages show product thinking, design, engineering and shipping, in balance. Every
// feature says what it does, why it matters and how I built it. Metrics live only in the Metrics
// section, each with a definition and a source. No em dashes, no invented numbers.
// Reloco's content follows /Users/atefmo/reloco/RELOCO_CASE_STUDY_BRIEF.md (v2).

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  kind: "phone" | "desktop";
};

export type Persona = {
  name: string;
  archetype: string;
  basedOn: string;
  summary: string;
  tags: string[];
};

export type Feature = {
  id: string;
  title: string;
  shots: Shot[];
  what: string;
  why?: string;
  how?: string;
};

export type CaseStudy = {
  oneLiner: string;
  metaLine: string[];
  cta: { label: string; url: string };
  hero: Shot;
  numbers: { value: string; label: string }[];
  glance: { label: string; text: string }[];
  freshmen: { paragraphs: string[]; shots: Shot[] };
  v0: {
    intro: string;
    insights: { insight: string; quote: string; who: string; today: string }[];
    personas: [Persona, Persona];
    concept: {
      summary: string;
      stages: { name: string; doing: string; level: number }[];
      flow: { steps: string[]; decision: string; yes: string[]; no: string[] };
    };
  };
  features: Feature[];
  alsoInV1: {
    title: string;
    text: string;
    icon: "wallet" | "calendar" | "share" | "stamp" | "guest" | "lock";
    shot?: Shot;
  }[];
  decisions: { decision: string; rejected: string; why: string }[];
  story: { title: string; paragraphs: string[]; shots: Shot[] };
  engineering: {
    highlights: string[];
    ai: { built: string; next: string; cost: string };
    stack: { label: string; items: Skill[] }[];
  };
  design: { title: string; text: string }[];
  metrics: {
    note: string;
    rows: { metric: string; definition: string; why: string; source: string }[];
  };
  timeline: {
    phase: string;
    status: "Completed" | "In progress" | "Planned";
    date?: string;
    text: string;
  }[];
  tryIt: { text: string; button: string; url: string };
};

export type Project = {
  // URL segment for the project page: /projects/<slug>
  slug: string;
  name: string;
  status: string;
  blurb: string;
  tags: string[];
  live?: { label: string; url: string };
  // Card image, shown on the left of the Projects card.
  image: string;
  caseStudy?: CaseStudy;
};

const dir = "/projects/reloco/cs/";
const phone = (
  file: string,
  width: number,
  height: number,
  alt: string,
  caption: string,
): Shot => ({
  src: `${dir}${file}.webp`,
  width,
  height,
  alt,
  caption,
  kind: "phone",
});
const desktop = (
  file: string,
  width: number,
  height: number,
  alt: string,
  caption: string,
): Shot => ({
  ...phone(file, width, height, alt, caption),
  kind: "desktop",
});

// Shots used in more than one place.
const arrivalToday = phone(
  "33-landing-today-arrival-mode-phone",
  900,
  1948,
  "Mei's Today screen two days before landing: a boarding pass from Shanghai to RDU and the landing-day checklist",
  "Two days out: arrival mode takes over.",
);

export const projects: Project[] = [
  {
    slug: "reloco",
    name: "Reloco",
    status: "Live",
    blurb:
      "A step-by-step roadmap for F-1 students at UNC, built first for freshmen landing in the US for the first time. I researched, designed, built and shipped it on my own.",
    tags: ["Product design", "Full-stack", "Next.js", "Supabase", "EdTech"],
    live: { label: "reloco.app", url: "https://reloco.app" },
    image: "/projects/reloco/card-painting.webp",
    caseStudy: {
      oneLiner:
        "A step-by-step roadmap for F-1 students at UNC, built first for freshmen landing in the US for the first time.",
      metaLine: [
        "Solo project",
        "Research, product, design, engineering",
        "Live at reloco.app",
        "2026",
      ],
      cta: { label: "Try it, no account needed", url: "https://reloco.app" },
      hero: desktop(
        "00-hero-landing-desktop",
        2000,
        1250,
        "Reloco's landing page: an oil painting of UNC's Old Well at sunset, with a button to build a roadmap",
        "reloco.app",
      ),
      numbers: [
        { value: "44", label: "sourced tasks" },
        { value: "34", label: "official sources" },
        { value: "9", label: "chapters" },
        { value: "103", label: "tests" },
      ],
      glance: [
        {
          label: "Problem",
          text: "F-1 rules span UNC ISSS, the IRS, USCIS, CBP and the SSA. The order lives in word of mouth, and one missed step can put a student's status at risk.",
        },
        {
          label: "Solution",
          text: "About 10 questions build a dated roadmap for the whole degree, one next step at a time, each backed by its official source.",
        },
        {
          label: "Role",
          text: "Solo. User interviews, product strategy, UX and visual design, full-stack engineering, launch.",
        },
        {
          label: "Stack",
          text: "Next.js 16, React 19, TypeScript, Tailwind v4, Supabase (Postgres, RLS, Google OAuth), Zod, Vitest, Claude API, Vercel.",
        },
        { label: "Status", text: "v1 live at reloco.app, September 2026." },
      ],
      freshmen: {
        paragraphs: [
          "A freshman's first year is the heaviest. For a sample freshman, 22 of 35 tasks fall in year one, and 16 of them land before the flight or in the first week: the I-901 fee, the entry window, the I-94, ISSS check-in, an SSN, a bank account, a phone plan.",
          "Upperclassmen have done it once. Freshmen haven't, and they have no one to ask yet. So v1 is designed around the first year and carries students through graduation and OPT.",
        ],
        shots: [
          phone(
            "30-freshman-onboarding-stage-phone",
            900,
            1948,
            "Onboarding question for Ziad: where are you right now? Still at home, just arrived, or already studying at UNC",
            "Where are you right now? The first answer shapes everything.",
          ),
          phone(
            "31-freshman-today-countdown-phone",
            900,
            1948,
            "Ziad's Today screen 97 days before landing: a boarding pass from Cairo to RDU and one next task, activate your Onyen",
            "Months out: a countdown and one next step.",
          ),
          arrivalToday,
        ],
      },
      v0: {
        intro:
          "Reloco started with interviews with international students at UNC. Four findings shaped v1.",
        // Quotes are verbatim from the two real interviews ("Atef - 3 interviews"); the third,
        // simulated interview is not used. Interviewees are described, not named.
        insights: [
          {
            insight: "Order is the hard part",
            quote: "I first had to find a job on campus.",
            who: "Junior from Vietnam, on getting an SSN",
            today:
              'Tasks know their dependencies. A card that needs another task first says "After" that task and links to it.',
          },
          {
            insight: "The information is scattered",
            quote: "It's all out there, but it's, like, all fragmented.",
            who: "Junior from London",
            today:
              "Every step links to its official source at UNC ISSS, the IRS, USCIS, CBP or the SSA.",
          },
          {
            insight: "Know-how travels by word of mouth",
            quote: "The people before me passed the knowledge to me.",
            who: "Junior from Vietnam",
            today:
              "About 10 questions build the plan an upperclassman would give you, starting before the flight.",
          },
          {
            insight: "Deadlines hide years ahead",
            quote:
              "You should be meeting with them like eight to twelve months in advance.",
            who: "Junior from London, on CPT approval",
            today:
              "The roadmap runs by class year through After graduation, and CPT comes back every spring.",
          },
        ],
        personas: [
          {
            name: "Connected Khoa",
            archetype: "The community learner",
            basedOn: "From the interview with a junior from Vietnam",
            summary:
              "Learns US systems from upperclassmen and WhatsApp groups, and goes in person instead of searching online.",
            tags: ["Peer-dependent", "Guided by others"],
          },
          {
            name: "Independent Amara",
            archetype: "The self-driven researcher",
            basedOn: "From the interview with a junior from London",
            summary:
              "Builds her own plan from DHS and ISSS pages, and checks every chatbot answer against the source.",
            tags: ["Self-reliant", "High frustration"],
          },
        ],
        concept: {
          summary:
            "The v0 concept organized tasks by phase, used a Build credit task and blocked tasks behind a lock screen. None of these ship today.",
          stages: [
            {
              name: "Discovery",
              doing: "Finds Reloco through a peer tip in a WhatsApp group",
              level: 0.08,
            },
            {
              name: "Onboarding",
              doing: "Signs up and answers a few questions",
              level: 0.45,
            },
            {
              name: "Roadmap",
              doing: "Sees tasks by phase and taps Build credit",
              level: 0.56,
            },
            {
              name: "Blocked task",
              doing: "Hits a lock: complete your SSN first",
              level: 0.3,
            },
            {
              name: "SSN first",
              doing: "Follows the guide to the SSA office",
              level: 0.72,
            },
            {
              name: "Credit card",
              doing: "Returns to the unlocked task and applies",
              level: 0.94,
            },
          ],
          flow: {
            steps: [
              "Land on Reloco",
              "Sign up with Google",
              "Onboarding",
              "Roadmap generated",
              "Open a task",
            ],
            decision: "Has an unfinished prerequisite?",
            yes: [
              "Locked: complete SSN first",
              "Do the SSN task",
              "Return, now unlocked",
            ],
            no: ["Read the guide", "Mark complete", "Next task suggested"],
          },
        },
      },
      features: [
        {
          id: "onboarding",
          title: "Onboarding that reads your situation",
          shots: [
            phone(
              "05-onboarding-stage-phone",
              900,
              1948,
              "Aisha's onboarding: where are you right now? Still at home, just arrived, or already studying at UNC, with a boarding pass above",
              "The stage comes first",
            ),
            phone(
              "06-onboarding-plans-phone",
              900,
              1948,
              "Onboarding question about plans, with an off-campus internship and a STEM major selected",
              "Plans decide which tasks apply",
            ),
          ],
          what: "About 10 questions: still at home, just arrived or already studying; country; arrival, start and graduation dates; housing; funding; SSN and bank; plans. A boarding pass fills in as you answer.",
          why: "A freshman two days from landing and a junior planning CPT need different roadmaps. The stage question comes first so nobody sees tasks that don't apply.",
          how: "Dates are validated against realistic ranges per stage. For current students, past first-year tasks are checked off automatically.",
        },
        {
          id: "engine",
          title: "A roadmap engine, not a checklist",
          shots: [
            phone(
              "04-onboarding-built-phone",
              900,
              1948,
              "Ziad's roadmap built: Cleared for takeoff, 35 tasks across 9 areas such as immigration, banking and housing",
              "The plan, grouped by area",
            ),
          ],
          what: "A dated plan grouped by area. Tasks appear only when they apply: the campus job only if you'll work, STEM OPT only for STEM majors, a driver's license only if you'll drive.",
          why: "A generic checklist buries what matters to you.",
          how: 'A pure, deterministic function from profile to roadmap. It filters by conditions, schedules from the student\'s dates and orders by dependency. Tests check invariants, like "never opens a task before its prerequisites". Modeling dependencies caught a real cycle: the campus job needed an SSN, but the SSN needs a job offer.',
        },
        {
          id: "today",
          title: "Today: one next step",
          shots: [
            phone(
              "07-today-junior-phone",
              900,
              1948,
              "Aisha's Today as a junior: day 780 in Chapel Hill, 63% progress, and one next task, a travel signature before winter break",
              "A junior's Today",
            ),
            desktop(
              "24-today-desktop",
              2000,
              1250,
              "Mei's Today on desktop two days before landing, in arrival mode",
              "Arrival mode on desktop",
            ),
          ],
          what: 'A boarding pass, one focus task and at most two more this week. If a task depends on another, the card says "After [task]" and links to it.',
          why: "Hick's Law. One clear action beats a list of 40.",
          how: "A planner ranks tasks by due date and dependencies. Skipping a task cascades to the tasks that depend on it, and reopening it restores them.",
        },
        {
          id: "arrival",
          title: "Arrival mode",
          shots: [
            { ...arrivalToday, caption: "Today switches to arrival mode" },
            phone(
              "34-arrival-checklist-phone",
              900,
              1948,
              "Arrival mode two days out: documents to keep in hand at the border, each with a Mark ready button",
              "At the border: keep these in hand",
            ),
          ],
          what: 'Two days before landing, Today switches to a landing-day checklist: documents to keep in hand at the border, the ride from RDU, the first 72 hours, and what to do if something goes wrong. On landing day it asks "Did you make it?" before clearing the travel tasks.',
          why: "The border is the highest-stakes moment of a freshman's first year, and flights move. Reloco asks instead of assuming.",
        },
        {
          id: "sources",
          title: "Every step sourced",
          shots: [
            phone(
              "09-task-steps-sources-phone",
              900,
              1948,
              "Task page for downloading the I-94: three steps, the first linked to CBP",
              "Steps with official links",
            ),
            phone(
              "10-task-rule-30-days-phone",
              900,
              1948,
              "Ziad's task Book a flight inside your entry window: you can enter the US no earlier than 30 days before your I-20 start date",
              "The 30-day entry rule, sourced to UNC ISSS",
            ),
          ],
          what: "Tickable steps, a time estimate, what to bring, and the exact official page. Example: you can enter the US no earlier than 30 days before your I-20 start date.",
          why: "Students told me chatbots were often wrong, but the sources they cited were right. Reloco leads with the source.",
          how: "A typed library of 44 tasks and 34 official sources. Rule changes get a notice, like the 2026 DHS duration-of-status rule and its court pause.",
        },
        {
          id: "degree",
          title: "The whole degree",
          shots: [
            phone(
              "18-journey-whole-degree-phone",
              900,
              1948,
              "Journey screen listing chapters from Settling in and First spring through Sophomore, Junior and Senior year and After graduation",
              "Nine chapters, arrival to OPT",
            ),
            phone(
              "20-passport-phone",
              900,
              1948,
              "Aisha's profile: a passport with six of nine chapter stamps and her trip dates",
              "A stamp for each chapter",
            ),
          ],
          what: "9 chapters. Five cover the first year (Pre-flight, Touchdown, First month, Settling in, First spring), then Sophomore, Junior and Senior years, and After graduation. Yearly tasks repeat: enrollment, summer address, travel signature, taxes, CPT. Chapters earn passport stamps.",
          why: "The costly mistakes in later years (CPT timing, the OPT filing window) show up years early.",
          how: "Class year is computed from the start and graduation dates. Repeating tasks expand into one instance per year.",
        },
      ],
      alsoInV1: [
        {
          icon: "wallet",
          title: "Wallet, dates only",
          text: "Passport, visa, I-20 and I-94 dates plan the roadmap. No copies, no ID numbers.",
          shot: phone(
            "16-wallet-ready-phone",
            900,
            1948,
            "Wallet with nine of nine documents ready and their key dates",
            "Wallet",
          ),
        },
        {
          icon: "calendar",
          title: "Calendar sync",
          text: "One tap for Google, Apple or Outlook. It updates as the roadmap changes.",
        },
        {
          icon: "share",
          title: "Family share page",
          text: "Read-only progress for a parent or sponsor.",
          shot: phone(
            "23-family-share-phone",
            900,
            1948,
            "Read-only share page showing a student's first-year certificate and stamps",
            "Share page",
          ),
        },
        {
          icon: "stamp",
          title: "Miles, stamps and a certificate",
          text: "Miles, stamps, weekly streaks and a first-year certificate.",
          shot: phone(
            "22-certificate-phone",
            900,
            1948,
            "First-year certificate listing tasks, miles and the finish date",
            "Certificate",
          ),
        },
        {
          icon: "guest",
          title: "Try first",
          text: "The full product works without an account. Google sign-in carries progress over.",
        },
        {
          icon: "lock",
          title: "Privacy",
          text: "Row-level security, and delete everything anytime.",
        },
      ],
      decisions: [
        {
          decision: "Freshmen first, one school",
          rejected: "All students everywhere",
          why: "Precision is the product in compliance, and freshmen have the most at stake.",
        },
        {
          decision: "Guest mode first",
          rejected: "A sign-up wall",
          why: "Students see the value before committing.",
        },
        {
          decision: "Weekly streaks",
          rejected: "Daily streaks",
          why: "Visa work comes in bursts.",
        },
        {
          decision: "Rules decide, AI assists",
          rejected: "An AI-generated plan",
          why: "Deadlines must be deterministic and cited.",
        },
        {
          decision: "Ask whether they landed",
          rejected: "Assuming the flight date",
          why: "Flights move.",
        },
        {
          decision: "Hid email reminders until sending is live",
          rejected: "A setting that does nothing",
          why: "A control that does nothing breaks trust.",
        },
      ],
      story: {
        title: "Catching a day-one problem",
        paragraphs: [
          "I built a screenshot crawler that walks the app as different students. Running it as Mei, a freshman landing in two days, showed a problem: her first screen said three tasks were overdue, because their dates had passed before she signed up.",
          'Red "Overdue" on day one tells a new student they\'re already failing. Now Reloco records the day a student joins. Anything due before that says "From before you joined · done?" and ranks after this week\'s real deadlines. Her Today now leads with the ride from RDU, packing her entry documents and a US phone number.',
        ],
        shots: [
          phone(
            "35-catch-up-journey-phone",
            900,
            1948,
            "Journey screen where Pre-flight tasks due before the student joined read From before you joined, done?",
            "Before she joined: a question, not an alarm",
          ),
          { ...arrivalToday, caption: "Her Today leads with what's next" },
        ],
      },
      engineering: {
        highlights: [
          "A deterministic engine with 103 Vitest tests on invariants.",
          "One Store interface, two implementations, with guest progress imported on sign-in.",
          "Row-level security on every table. Zod validation on every server action.",
          "An RFC 5545 calendar feed behind a revocable token.",
          "Revocable share links read through a narrow database function.",
          "Visual QA: a Puppeteer crawler I wrote walks onboarding as scripted personas (a freshman months out, a freshman landing in two days, a junior) and captures every screen on phone and desktop.",
        ],
        ai: {
          built:
            "Personal task notes that can't change the schedule, and a document scanner that returns dates only.",
          next: 'Ask Reloco (answers only from sourced tasks, with citations) and "What does this mean?" for official emails.',
          cost: "A small model, per-student limits and a hard monthly cap.",
        },
        stack: [
          {
            label: "Frontend",
            items: [
              { name: "Next.js 16", icon: siNextdotjs },
              { name: "React 19", icon: siReact },
              { name: "TypeScript", icon: siTypescript },
              { name: "Tailwind v4", icon: siTailwindcss },
              { name: "Motion" },
            ],
          },
          {
            label: "Backend",
            items: [
              { name: "Supabase Postgres + RLS", icon: siSupabase },
              { name: "Google OAuth" },
              { name: "Zod", icon: siZod },
              { name: "Claude API", icon: siClaude },
            ],
          },
          {
            label: "Quality and ship",
            items: [
              { name: "Vitest", icon: siVitest },
              { name: "Puppeteer", icon: siPuppeteer },
              { name: "Vercel", icon: siVercel },
            ],
          },
        ],
      },
      design: [
        {
          title: "One next step (Hick's Law)",
          text: "Today shows 1 focus task and at most 2 more.",
        },
        {
          title: "The system carries the complexity (Tesler's Law)",
          text: "Dependencies and dates live in the engine, not in the student's head.",
        },
        {
          title: "Calm urgency",
          text: "Red only for real overdue deadlines. Due-soon is blue, and missed-before-joining is a question, not an alarm.",
        },
        {
          title: "Progressive disclosure",
          text: "Chapters collapse, and each task opens to steps, then sources.",
        },
        {
          title: "Mobile-first, both themes, accessible",
          text: "Built at 375px first, light and dark, with visible focus and reduced motion.",
        },
      ],
      metrics: {
        note: "Baselines come from the first tester cohort.",
        rows: [
          {
            metric: "On-time rate (north star)",
            definition:
              "Completed tasks finished by their due date ÷ all completed tasks",
            why: "The core promise: no missed deadlines",
            source: "Completion date vs due date, Postgres",
          },
          {
            metric: "Pre-arrival readiness",
            definition:
              "Share of a freshman's Pre-flight tasks done before landing day",
            why: "Freshmen are the focus, and the border is the highest-stakes moment",
            source: "Task status vs arrival date",
          },
          {
            metric: "Activation",
            definition: "Visitors who finish onboarding and get a roadmap",
            why: "Tests whether onboarding is short and clear enough",
            source: "Roadmaps created vs visits",
          },
          {
            metric: "Guest-to-account",
            definition: "Guests who continue with Google",
            why: "Tests whether the product earns trust before asking for it",
            source: "Accounts with imported guest progress",
          },
          {
            metric: "Week-4 retention",
            definition: "Students who complete a task in week 4",
            why: "A degree lasts years, so habit matters",
            source: "Completions by week",
          },
          {
            metric: '"Not needed" rate by task',
            definition: "How often each task is marked not needed",
            why: "Content quality: shown to the wrong students",
            source: "Task statuses",
          },
        ],
      },
      timeline: [
        {
          phase: "v0",
          status: "Completed",
          date: "[Month Year]",
          text: "Interviews, personas, journey map, first concept.",
        },
        {
          phase: "v1",
          status: "Completed",
          date: "September 2026",
          text: "Live at reloco.app with everything above.",
        },
        {
          phase: "v1.1",
          status: "In progress",
          text: 'Ask Reloco, "What does this mean?" for official emails, and the document scanner going live.',
        },
        {
          phase: "v2",
          status: "Planned",
          text: "An OPT unemployment day counter, a travel check before trips home, and a pilot with UNC ISSS.",
        },
        {
          phase: "Later",
          status: "Planned",
          text: "More schools on the school-pack layer.",
        },
      ],
      tryIt: {
        text: "Try Reloco as a freshman landing next month. It takes about two minutes and needs no account.",
        button: "Open reloco.app",
        url: "https://reloco.app",
      },
    },
  },
];

export const projectsIntro =
  "Things I build when nobody's assigning homework 🛠️";
