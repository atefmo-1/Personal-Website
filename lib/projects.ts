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
// Reloco's content follows /Users/atefmo/reloco/RELOCO_CASE_STUDY_UPDATE_V5.md (v5 rebuild):
// Reloco is an app, never "a roadmap"; the student's schedule is "their plan".

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
  what: string | string[];
  why?: string;
  how?: string;
};

export type Layer = {
  name: string;
  note?: string;
  parts: { title: string; text?: string }[];
};

export type CaseStudy = {
  // Browser tab title; the layout adds " | Atef Mohamed".
  metaTitle?: string;
  oneLiner: string;
  metaLine: string[];
  cta: { label: string; url: string };
  hero: Shot;
  numbers: { value: string; label: string }[];
  glance: { label: string; text: string }[];
  audience: {
    intro: string;
    groups: { title: string; text: string; shots: Shot[] }[];
  };
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
  productIntro: string;
  features: Feature[];
  progress: { title: string; text: string; shots: Shot[] };
  design: {
    intro: string;
    principles: { title: string; text: string }[];
    iterations: { title: string; text: string; shots?: Shot[] }[];
  };
  engineering: {
    layers: Layer[];
    pipeline: string[];
    quality: string[];
    ai: { built: string; next: string; cost: string };
    stack: { label: string; items: Skill[] }[];
  };
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
// Every screenshot is a 1170x2532 phone capture, converted to 900x1948.
const phone = (file: string, alt: string, caption: string): Shot => ({
  src: `${dir}${file}.webp`,
  width: 900,
  height: 1948,
  alt,
  caption,
});

const arrivalToday = phone(
  "33-landing-today-arrival-mode-phone",
  "Mei's Today screen two days before landing: a boarding pass from Shanghai to RDU and the landing-day checklist",
  "Two days out: arrival mode",
);

const ONE_LINER =
  "A web app, on any phone or computer, that knows every task an international student at UNC will face, from visas and taxes to a bank account, an SSN and a first credit card. It puts them in order around their dates and walks them through each one with the right source: from the first flight, through every CPT and tax season, to OPT.";

export const projects: Project[] = [
  {
    slug: "reloco",
    name: "Reloco",
    status: "Live",
    blurb:
      "A web app that walks F-1 students at UNC through everything the US asks of them: visas, taxes, banking, IDs, housing and health, from the first flight through CPT and tax season to OPT. I researched, designed, built and shipped it on my own.",
    tags: ["Product design", "Full-stack", "Next.js", "Supabase", "EdTech"],
    live: { label: "reloco.app", url: "https://reloco.app" },
    image: "/projects/reloco/card-painting.webp",
    caseStudy: {
      metaTitle: "Reloco: an F-1 co-pilot app for international students",
      oneLiner: ONE_LINER,
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
        caption: "Your co-pilot for life on an F-1 visa.",
      },
      numbers: [
        { value: "44", label: "sourced tasks" },
        { value: "34", label: "trusted sources" },
        { value: "9", label: "chapters" },
        { value: "103", label: "tests" },
      ],
      glance: [
        {
          label: "Problem",
          text: "A new F-1 student has to handle immigration rules, taxes, an SSN, a US bank account and credit, housing, health insurance and IDs, each explained on a different site. The order lives in word of mouth, and one missed step can put a student's status at risk.",
        },
        {
          label: "Solution",
          text: "About 10 questions and Reloco knows which tasks apply, when each is due and what has to come first. Then it guides the student through them, one at a time, for the whole degree.",
        },
        {
          label: "Scope",
          text: "F-1 undergrads at UNC only, so every office, deadline and link is exact. Schools are a data layer, so the next one is a content change, not a rebuild.",
        },
        {
          label: "Role",
          text: "Solo. User interviews, product strategy, UX and visual design, full-stack engineering, launch.",
        },
        { label: "Status", text: "v1 live at reloco.app, September 2026." },
      ],
      audience: {
        intro:
          "An F-1 degree has three very different stretches. Reloco changes what it shows as a student moves through them.",
        groups: [
          {
            title: "Arriving: new students",
            text: "The heaviest stretch. For a sample freshman, 16 tasks land before the flight or in the first week: the I-901 fee, the entry window, the I-94, ISSS check-in, an SSN, a bank account, a phone plan, a lease and health insurance. Reloco counts down to landing, then switches to arrival mode.",
            shots: [
              phone(
                "31-freshman-today-countdown-phone",
                "Ziad's Today screen 97 days before landing: a boarding pass from Cairo to RDU and one next task",
                "Months out: a countdown and one next step",
              ),
              arrivalToday,
            ],
          },
          {
            title: "Studying: sophomore to senior",
            text: "The work comes in yearly cycles: a travel signature before winter break, taxes every February, CPT before a summer internship, full-time enrollment each fall. Reloco brings each one back on schedule, every year. Current students who join mid-degree start with everything behind them already checked off.",
            shots: [
              phone(
                "07-today-junior-phone",
                "Aisha's Today as a junior: day 780 in Chapel Hill, 63% progress, and one next task, a travel signature before winter break",
                "A junior's Today: the winter travel signature",
              ),
              phone(
                "50-cpt-summer-phone",
                "Task: Summer 2027 internship? Get CPT approved first. Four steps, the first linked to the ISSS Portal",
                "CPT for a summer 2027 internship",
              ),
            ],
          },
          {
            title: "Graduating: OPT and STEM OPT",
            text: "The highest-stakes filing of the degree has a strict window. Reloco times it from the graduation date: decide, request the OPT I-20, file the I-765 inside the window, then report the job and watch the unemployment limit. STEM majors get the 24-month extension on the same track.",
            shots: [
              phone(
                "52-opt-request-phone",
                "Task: Request your OPT I-20 from ISSS, with Do first: Decide what's next after graduation",
                "Request the OPT I-20. 'Do first' keeps the order.",
              ),
              phone(
                "53-stem-opt-phone",
                "Task: Apply for the 24-month STEM OPT extension, with two Do first prerequisites",
                "The STEM OPT extension, with its prerequisites",
              ),
            ],
          },
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
              'Tasks know their dependencies. A task that needs another first says "Do first" and links to it.',
          },
          {
            insight: "The information is scattered",
            quote: "It's all out there, but it's, like, all fragmented.",
            who: "Junior from London",
            today:
              "Every step links to its source: a UNC office, a federal or state agency, or a consumer-protection guide.",
          },
          {
            insight: "Know-how travels by word of mouth",
            quote: "The people before me passed the knowledge to me.",
            who: "Junior from Vietnam",
            today:
              "Reloco gives every student the plan an upperclassman would, starting before the flight.",
          },
          {
            insight: "Deadlines hide years ahead",
            quote:
              "You should be meeting with them like eight to twelve months in advance.",
            who: "Junior from London, on CPT approval",
            today:
              "The plan runs by class year through After graduation, and CPT comes back every spring.",
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
              doing: "Answers a few questions",
              level: 0.45,
            },
            {
              name: "Plan",
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
              "Onboarding",
              "Plan generated",
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
      productIntro:
        "One job: get a student through the US system without missing a step.",
      features: [
        {
          id: "onboarding",
          title: "Onboarding that reads your situation",
          shots: [
            phone(
              "05-onboarding-stage-phone",
              "Onboarding question: where are you right now? Still at home, just arrived, or already studying at UNC, with a boarding pass above",
              "Where are you right now? The first answer shapes everything",
            ),
            phone(
              "06-onboarding-plans-phone",
              "Onboarding question about plans, with an off-campus internship and a STEM major selected",
              "Plans decide which tasks apply",
            ),
          ],
          what: "About 10 questions: the stage (still at home, just arrived, already studying), country, arrival, start and graduation dates, housing, funding, SSN and bank, and plans (campus job, internship, STEM major, driving). A boarding pass fills in as you answer.",
          why: "A freshman two days from landing and a junior planning CPT need completely different plans. New students can tick off prep they've already done; current students start with year one behind them.",
          how: "Date ranges are validated per stage, and answers are validated on the server with Zod.",
        },
        {
          id: "engine",
          title: "A rules engine that knows what applies to you",
          shots: [
            phone(
              "04-onboarding-built-phone",
              "Ziad's plan built: Cleared for takeoff, 35 tasks across 9 areas such as immigration, banking and housing",
              "The plan, grouped by area",
            ),
            phone(
              "18-journey-whole-degree-phone",
              "Journey screen listing chapters from Settling in and First spring through Sophomore, Junior and Senior year and After graduation",
              "The rest of the degree, by class year",
            ),
          ],
          what: "Nine areas: immigration, taxes, work, banking, IDs, housing, health, campus and tech. A personal, dated plan. Tasks appear only when they apply: the campus job only if you'll work, STEM OPT only for STEM majors, a driver's license only if you'll drive. Change a date in Profile and the whole plan reschedules, keeping progress.",
          why: "A generic checklist buries what matters to you.",
          how: "A pure, deterministic pipeline, detailed in Engineering. Modeling dependencies caught a real cycle: the campus job needed an SSN, but the SSN needs a job offer.",
        },
        {
          id: "today",
          title: "Today: one next step",
          shots: [
            phone(
              "44-task-do-first-phone",
              "Open a US bank account task with a Do first link: Download your I-94 and check it",
              "A task that needs another first says so",
            ),
          ],
          what: "One focus task and at most two more this week. Blocked tasks say what comes first.",
          why: "Hick's Law. One clear action beats a list of 40.",
          how: "A planner ranks by urgency and dependencies. Skipping cascades to the tasks that depend on it, and reopening restores them.",
        },
        {
          id: "task",
          title: "Inside a task",
          shots: [
            phone(
              "40a-task-steps-phone",
              "Pack your entry documents in your carry-on: four steps, two ticked, with links to ISSS pre-arrival steps and the SEVIS I-901 fee site",
              "Steps, each with its own source. 2 of 4 done.",
            ),
            phone(
              "40b-task-bring-sources-phone",
              "The same task further down: a Bring list, Add due date to Google Calendar, sources, and a Mark complete bar",
              "What to bring, calendar, sources, Mark complete",
            ),
          ],
          what: "A few short steps with tick boxes, and the source link on the step that needs it. Then what to bring (linked to the wallet), add to calendar, the sources (UNC offices, federal and state agencies, and consumer-protection guides), and a fixed Mark complete / Skip bar.",
          why: '"Pack your entry documents" is really four small actions. Broken down, it\'s 20 minutes, not a worry.',
          how: "Steps, sources, documents, time and miles are typed fields in the task library, so every task renders the same way.",
        },
        {
          id: "arrival",
          title: "Arrival mode (new students)",
          shots: [
            phone(
              "34-arrival-checklist-phone",
              "Arrival mode two days out: documents to keep in hand at the border, each with a Mark ready button",
              "At the border: keep these in hand",
            ),
            phone(
              "43-landing-check-phone",
              "Landing-day card: Did you make it to Chapel Hill? with Yes, I landed, On a different day, and Not yet, my trip moved",
              "On landing day, Reloco asks",
            ),
          ],
          what: 'Two days before landing, Today becomes a landing-day checklist: the border, the ride from RDU, the first 72 hours, and what to do if something goes wrong. On the day it asks "Did you make it?"',
          why: 'The border is the highest-stakes moment of year one, and flights move. "Yes" clears the travel tasks; "On a different day" fixes the date and reschedules everything.',
        },
        {
          id: "yearly",
          title: "Every year, on schedule (current students)",
          shots: [
            phone(
              "54-travel-signature-phone",
              "Task: Going home for winter 2026? Get a travel signature first, linked to ISSS travel and re-entry",
              "Going home for winter? Travel signature first",
            ),
            phone(
              "51-tax-forms-phone",
              "Task: File your 2026 tax forms, Form 8843 plus a 1040-NR if you had US income",
              "Tax season, every February",
            ),
          ],
          what: 'Yearly tasks come back as dated copies: winter travel signature, tax forms (Form 8843, and a 1040-NR if there was US income), CPT for each summer, summer address and full-time enrollment. Optional ones, like a trip home or a summer move, close as "Not needed" if their date passes untouched, instead of sitting overdue. Tax tasks add treaty notes for the student\'s passport country.',
          why: "Upperclassmen don't need onboarding; they need the recurring deadlines they forget.",
          how: "A task can declare the years it repeats; the engine creates one copy per year (like tax-forms-2027) and places each in the right class-year chapter.",
        },
        {
          id: "opt",
          title: "OPT and STEM OPT (graduating students)",
          shots: [
            phone(
              "55-journey-after-graduation-phone",
              "Journey: Senior year and After graduation, with tax forms, the STEM OPT extension and OPT reporting tasks",
              "Senior year and After graduation",
            ),
          ],
          what: "Decide what's next, request the OPT I-20 from ISSS, file the I-765 inside the window, report the job and watch the unemployment limit, then the STEM extension for eligible majors.",
          why: "The OPT filing window is strict, and missing it can cost the job offer. Reloco surfaces it years early and in order.",
          how: "OPT tasks are anchored to the graduation date, with requires chains so each step unlocks the next.",
        },
        {
          id: "sources",
          title: "Sourced, current, and yours to share",
          shots: [
            phone(
              "10-task-rule-30-days-phone",
              "Ziad's task Book a flight inside your entry window: you can enter the US no earlier than 30 days before your I-20 start date",
              "The 30-day entry rule, sourced to UNC ISSS",
            ),
            phone(
              "16-wallet-ready-phone",
              "Wallet with nine of nine documents ready and their key dates",
              "Wallet: dates, not documents",
            ),
          ],
          what: [
            "44 tasks built from 34 trusted sources: official pages for rules, and guides like the CFPB's for banking and credit.",
            "Sources: UNC offices (ISSS, Campus Health, Housing, One Card, Career Services), federal agencies (the IRS, USCIS, SSA, DHS, CBP, the State Department), North Carolina (the DMV and Department of Revenue), and consumer guides from the CFPB and FTC.",
            "Rule changes get a notice that says what still applies (the 2026 DHS duration-of-status rule and its court pause).",
            "The wallet keeps only document dates (passport, visa, I-20, I-94), which drive reminders like passport renewal.",
            "Deadlines sync to Google, Apple or Outlook.",
            "A read-only share page lets family follow along.",
          ],
          why: "In compliance, being current and precise is the product. Students told me chatbots were often wrong but their sources were right.",
        },
      ],
      progress: {
        title: "Progress that motivates",
        text: "Tasks earn miles, chapters earn stamps, and streaks are weekly, not daily, because visa work comes in bursts.",
        shots: [
          phone(
            "41-reward-miles-phone",
            "Task complete: Nice work, plus 60 miles, and 2 more this week for your goal",
            "Miles for every task",
          ),
          phone(
            "42-reward-stamp-phone",
            "Chapter complete: Pre-flight stamped, plus 50 miles",
            "A stamp for every chapter",
          ),
          phone(
            "20-passport-phone",
            "Aisha's profile: a passport with six of nine chapter stamps and her trip dates",
            "The passport",
          ),
          phone(
            "22-certificate-phone",
            "First-year certificate listing tasks, miles and the finish date",
            "The first-year certificate",
          ),
        ],
      },
      design: {
        intro:
          "I design in loops: interview, build, walk the app as real students, change what doesn't hold up. The walkthroughs use scripted personas: a freshman months out, a freshman landing in two days, a junior, a student landing today.",
        principles: [
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
            title: "Mobile-first, works everywhere",
            text: "Built at 375px first, then scaled up for laptops, in light and dark, with visible focus and reduced motion.",
          },
        ],
        iterations: [
          {
            title: "Late joiners saw failure on day one.",
            text: 'A freshman signing up two days before landing saw three red "Overdue" tasks. Now Reloco records the day a student joins, and anything due before that asks "From before you joined · done?" and ranks after this week\'s real deadlines.',
            shots: [
              phone(
                "35-catch-up-journey-phone",
                "Journey screen where Pre-flight tasks due before the student joined read From before you joined, done?",
                "After: tasks from before joining ask, not alarm",
              ),
              { ...arrivalToday, caption: "Her Today leads with what's next" },
            ],
          },
          {
            title: "Copy assumed everyone was arriving.",
            text: '"Let\'s get you to Chapel Hill" and a "Certificate of Arrival" read wrong for a junior. Now the copy follows the stage: "You\'re all set", "First year complete".',
          },
          {
            title: "Seniors couldn't enter their real dates.",
            text: "The wallet only accepted I-20 and I-94 dates from the last two years. It now matches the six-year range current students need.",
          },
          {
            title: "A setting that did nothing.",
            text: "Email reminders showed a toggle before sending was live. It stays hidden until it works.",
          },
          {
            title: "A plan that lived in one browser.",
            text: "The app first let students try it without an account. A four-year record has to survive a new phone and sync to a calendar, so Reloco now starts with an account.",
          },
        ],
      },
      engineering: {
        layers: [
          {
            name: "Content",
            parts: [
              {
                title: "Task library",
                text: "44 typed tasks. Each declares conditions, date anchors (arrival, program start, tax year, fixed date), dependencies and hard requirements, repeat years, and whether it's optional, travel-only or a later-year task, plus steps, documents and sources.",
              },
              {
                title: "School pack",
                text: "UNC's offices, links and airport, kept separate from the engine.",
              },
              {
                title: "Country data",
                text: "Tax treaties and passport-validity rules.",
              },
            ],
          },
          {
            name: "Engine",
            note: "Pure and deterministic. Streams each stage to the setup screen as NDJSON progress events.",
            parts: [
              { title: "Profile" },
              { title: "Filter by conditions" },
              { title: "Resolve date anchors" },
              { title: "Expand repeating tasks" },
              { title: "Order by dependencies" },
              { title: "Place in chapters by class year" },
              {
                title: "AI notes (optional)",
                text: "Can only write notes, never add, move or remove tasks.",
              },
            ],
          },
          {
            name: "Runtime rules",
            parts: [
              {
                title: "Not needed",
                text: "Closes optional tasks whose date passed.",
              },
              {
                title: "Catch-up",
                text: "Marks tasks due before the join date.",
              },
              { title: "Cascades", text: "Applies skip and reopen cascades." },
              {
                title: "Resync by slug",
                text: "Progress survives library updates.",
              },
            ],
          },
          {
            name: "Data",
            parts: [
              {
                title: "Store interface → Supabase Postgres",
                text: "Row-level security on every table, 7 migrations, and security-definer functions that serve the share page and calendar feed by revocable token.",
              },
              {
                title: "Google OAuth",
                text: "Session refreshed in the request proxy.",
              },
              {
                title: "Cookie store",
                text: "Runs the app with no database, for local development and visual QA.",
              },
            ],
          },
          {
            name: "Surfaces",
            parts: [
              { title: "Today" },
              { title: "Journey" },
              { title: "Task pages" },
              { title: "Wallet" },
              { title: "RFC 5545 calendar feed" },
              { title: "Family share page" },
              {
                title: "Email reminders",
                text: "Built, off until sending is live.",
              },
            ],
          },
        ],
        pipeline: [
          "Answers are validated with Zod.",
          "44 tasks are filtered to the ones that apply (35 for a sample freshman, 46 for a sample junior).",
          "Anchors become real dates.",
          "Yearly tasks become one copy per year.",
          "Tasks are ordered by dependencies.",
          "Tasks are grouped into 9 chapters.",
          "The plan is saved, and each step streams to the screen.",
        ],
        quality: [
          "103 Vitest tests on engine invariants (never opens a task before its prerequisites, windows never invert).",
          "A Puppeteer crawler I wrote walks onboarding as scripted personas and captures every screen.",
          "Deployed on Vercel.",
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
              {
                name: "Next.js 16 (App Router, server actions)",
                icon: siNextdotjs,
              },
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
            metric: "OPT filed in window",
            definition:
              'Graduating students who complete "File your I-765" before its window closes',
            why: "The highest-stakes deadline for upperclassmen",
            source: "Task completion vs window end",
          },
          {
            metric: "Activation",
            definition: "Visitors who finish onboarding and get a plan",
            why: "Tests whether onboarding is short and clear enough",
            source: "Plans created vs visits",
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
        text: "Set it up as a freshman landing next month or a junior planning a summer internship. It takes about two minutes.",
        button: "Open reloco.app",
        url: "https://reloco.app",
      },
    },
  },
];

export const projectsIntro =
  "Things I build when nobody's assigning homework 🛠️";
