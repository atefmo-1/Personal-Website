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
// Reloco's content follows /Users/atefmo/reloco/RELOCO_CASE_STUDY_BRIEF.md (v2) and
// RELOCO_CASE_STUDY_UPDATE_V3.md and _V4.md (accounts required: Google sign-in, no guest mode).

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
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
  // One extra line under the three labels.
  note?: string;
  // A row of phones under the block.
  more?: Shot[];
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
    icon:
      | "wallet"
      | "calendar"
      | "share"
      | "stamp"
      | "google"
      | "lock"
      | "notNeeded"
      | "notes"
      | "reschedule";
  }[];
  // Text-only cards, with screenshots in a row of their own.
  alsoShots: Shot[];
  decisions: { decision: string; rejected: string; why: string }[];
  decisionsShot: Shot;
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
      cta: { label: "Open reloco.app", url: "https://reloco.app" },
      // A painting from the app (public/art/campus-golden.jpg), with the name set over it.
      hero: {
        src: `${dir}hero-painting.webp`,
        width: 1680,
        height: 944,
        alt: "Oil painting of UNC's Old Well and campus at golden hour, with a plane crossing the sky",
        caption: "The F-1 roadmap for UNC students",
      },
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
            phone(
              "37-onboarding-done-already-phone",
              900,
              1948,
              "Last onboarding question: Done any of these already? Pre-flight tasks such as booking a flight and signing a lease, each with a tick box",
              "Freshmen who've already done some prep tick it off",
            ),
          ],
          what: "About 10 questions: still at home, just arrived or already studying; country; arrival, start and graduation dates; housing; funding; SSN and bank; plans. A boarding pass fills in as you answer.",
          why: "A freshman two days from landing and a junior planning CPT need different roadmaps. The stage question comes first so nobody sees tasks that don't apply.",
          how: "Dates are validated against realistic ranges per stage. For current students, past first-year tasks are checked off automatically.",
          note: "The last question lists the Pre-flight tasks grouped by chapter, so a freshman who has already booked a flight or signed a lease starts with those checked off.",
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
            phone(
              "44-task-do-first-phone",
              900,
              1948,
              "Open a US bank account task with a Do first link: Download your I-94 and check it",
              "A task that needs another first says so",
            ),
          ],
          what: 'A boarding pass, one focus task and at most two more this week. If a task depends on another, the card says "After [task]" and links to it.',
          why: "Hick's Law. One clear action beats a list of 40.",
          how: "A planner ranks tasks by due date and dependencies. Skipping a task cascades to the tasks that depend on it, and reopening it restores them.",
        },
        {
          id: "task",
          title: "Inside a task",
          shots: [
            phone(
              "40a-task-steps-phone",
              900,
              1948,
              "Pack your entry documents in your carry-on: four steps, two ticked, with links to ISSS pre-arrival steps and the SEVIS I-901 fee site",
              "Steps, each with its own source link. 2 of 4 done.",
            ),
            phone(
              "40b-task-bring-sources-phone",
              900,
              1948,
              "The same task further down: a Bring list, Add due date to Google Calendar, official sources, and a Mark complete +80 bar",
              "What to bring, add to calendar, official sources, and Mark complete +80 miles.",
            ),
          ],
          what: 'Each task breaks into short steps with a tick box. Where a step needs an official page, the link sits right on that step, like "ISSS: Pre-arrival steps" and "SEVIS I-901 fee (FMJfee.com)". Below the steps: Bring (the documents to have in hand, linked to the wallet), Add due date to Google Calendar, the official sources the task is built from, and a "Guidance, not legal advice. Status questions → ISSS" line. A fixed bar holds Mark complete +80 miles and Skip. A task that needs another first shows it at the top, like "Do first: Download your I-94 and check it".',
          why: 'A task like "Pack your entry documents" is really four small actions. Breaking it down makes a stressful job doable in 20 minutes, and putting the source on the step means nobody has to hunt for it.',
          how: "Steps, sources, what to bring, time estimates and miles are typed fields in the task library, so every task renders the same way. Ticked steps are saved per student. Skipping a task also skips the tasks that only exist because of it (the requires cascade), and reopening it brings them back.",
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
            phone(
              "43-landing-check-phone",
              900,
              1948,
              "Landing-day card: Did you make it to Chapel Hill? with Yes, I landed, On a different day, and Not yet, my trip moved",
              "On landing day, Reloco asks",
            ),
          ],
          what: 'Two days before landing, Today switches to a landing-day checklist: documents to keep in hand at the border, the ride from RDU, the first 72 hours, and what to do if something goes wrong. On landing day it asks "Did you make it?" before clearing the travel tasks.',
          why: "The border is the highest-stakes moment of a freshman's first year, and flights move. Reloco asks instead of assuming.",
          note: 'Answering "Yes" clears the travel-only tasks and switches the roadmap to life on the ground. "On a different day" fixes the date and reschedules everything.',
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
          more: [
            phone(
              "41-reward-miles-phone",
              900,
              1948,
              "Task complete: Nice work, plus 60 miles, and 2 more this week for your goal",
              "Every task earns miles and counts toward the weekly goal",
            ),
            phone(
              "42-reward-stamp-phone",
              900,
              1948,
              "Chapter complete: Pre-flight stamped, plus 50 miles",
              "Finishing a chapter earns its stamp",
            ),
          ],
        },
      ],
      alsoInV1: [
        {
          icon: "wallet",
          title: "Wallet, dates only",
          text: "Passport, visa, I-20 and I-94 dates plan the roadmap. No copies, no ID numbers.",
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
        },
        {
          icon: "stamp",
          title: "Miles, stamps and a certificate",
          text: "Miles, stamps, weekly streaks and a first-year certificate.",
        },
        {
          icon: "google",
          title: "Google sign-in",
          text: "One tap, no password, and the roadmap follows you to any device.",
        },
        {
          icon: "lock",
          title: "Privacy",
          text: "Row-level security, and delete everything anytime.",
        },
        {
          icon: "notNeeded",
          title: "Not needed",
          text: 'Optional tasks whose date passes, like a summer internship or a trip home, close as "Not needed" instead of sitting overdue.',
        },
        {
          icon: "notes",
          title: "Personal notes (AI)",
          text: "Where enabled, a short note tailored to the student sits on the task. It can't add, move or remove tasks.",
        },
        {
          icon: "reschedule",
          title: "Change a date, everything moves",
          text: "Editing arrival, start or graduation dates in Profile reschedules the whole roadmap and keeps progress.",
        },
      ],
      alsoShots: [
        phone(
          "16-wallet-ready-phone",
          900,
          1948,
          "Wallet with nine of nine documents ready and their key dates",
          "Wallet: dates only, 9 of 9 ready",
        ),
        phone(
          "23-family-share-phone",
          900,
          1948,
          "Read-only share page showing a student's first-year certificate and stamps",
          "Share page: read-only progress for family",
        ),
        phone(
          "22-certificate-phone",
          900,
          1948,
          "First-year certificate listing tasks, miles and the finish date",
          "The first-year certificate",
        ),
      ],
      decisions: [
        {
          decision: "Freshmen first, one school",
          rejected: "All students everywhere",
          why: "Precision is the product in compliance, and freshmen have the most at stake.",
        },
        {
          decision: "Accounts from day one, with Google sign-in",
          rejected: "A guest mode that stores the roadmap in one browser",
          why: "A roadmap is a four-year record. It has to survive a new phone, sync to a calendar and be there at OPT time. One tap with Google, no password to create.",
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
      decisionsShot: phone(
        "36-sign-in-phone",
        900,
        1948,
        "Sign-in screen over a painting of the Old Well: Let's build your roadmap, with one Continue with Google button",
        "Sign-in: one Google button, no password",
      ),
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
          "One Store interface: Postgres in production, a cookie store for local development and visual QA.",
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
            metric: "Sign-in drop-off",
            definition:
              "Visitors who reach the sign-in screen but don't continue",
            why: "Tests whether requiring an account costs too many students",
            source: "Sign-in page visits vs new accounts",
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
        text: "Sign in with Google and build a roadmap as a freshman landing next month. It takes about two minutes.",
        button: "Open reloco.app",
        url: "https://reloco.app",
      },
    },
  },
];

export const projectsIntro =
  "Things I build when nobody's assigning homework 🛠️";
