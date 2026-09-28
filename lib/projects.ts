import {
  siClaude,
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

// Project pages show PM, design and engineering depth through what the product actually does.
// Every feature says what it does, why it matters and how I built it. Metrics live only in the
// Metrics section, each with a definition and a source. No em dashes, no invented numbers.
// Reloco's content follows /Users/atefmo/reloco/RELOCO_CASE_STUDY_BRIEF.md.

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  kind: "phone" | "desktop";
};

export type Persona = { name: string; archetype: string; basedOn: string; summary: string; tags: string[] };

export type Feature = { id: string; title: string; shots: Shot[]; what: string; why?: string; how?: string };

export type CaseStudy = {
  oneLiner: string;
  metaLine: string[];
  cta: { label: string; url: string };
  hero: Shot;
  numbers: { value: string; label: string }[];
  overview: { problem: string; built: string };
  v0: {
    intro: string;
    insights: { insight: string; quote: string; who: string; today: string }[];
    personas: [Persona, Persona];
    concept: {
      summary: string;
      stages: { name: string; doing: string; feeling: string; level: number }[];
      flow: { steps: string[]; decision: string; yes: string[]; no: string[] };
    };
  };
  features: Feature[];
  landingStrip?: { caption: string; shots: Shot[] };
  decisions: { decision: string; rejected: string; why: string }[];
  engineering: {
    bullets: string[];
    stack: Skill[];
    ai: { built: string[]; next: string[]; cost: string };
  };
  metrics: { note: string; rows: { metric: string; definition: string; why: string; source: string }[] };
  timeline: { phase: string; status: "Completed" | "In progress" | "Planned"; date?: string; text: string }[];
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
const phone = (file: string, width: number, height: number, alt: string, caption: string): Shot => ({
  src: `${dir}${file}.webp`,
  width,
  height,
  alt,
  caption,
  kind: "phone",
});
const desktop = (file: string, width: number, height: number, alt: string, caption: string): Shot => ({
  ...phone(file, width, height, alt, caption),
  kind: "desktop",
});

export const projects: Project[] = [
  {
    slug: "reloco",
    name: "Reloco",
    status: "Live",
    blurb:
      "An F-1 roadmap for UNC undergrads that covers every year, from arrival to OPT. I researched, designed, built and shipped it on my own.",
    tags: ["Product design", "Full-stack", "Next.js", "Supabase", "EdTech"],
    live: { label: "reloco.app", url: "https://reloco.app" },
    image: "/projects/reloco/card-painting.webp",
    caseStudy: {
      oneLiner: "An F-1 roadmap for UNC undergrads that covers every year, from arrival to OPT.",
      metaLine: ["Solo", "Research, product, design, engineering", "Live at reloco.app", "2026"],
      cta: { label: "Try reloco.app", url: "https://reloco.app" },
      hero: desktop(
        "00-hero-landing-desktop",
        2000,
        1250,
        "Reloco's landing page: an oil painting of UNC's Old Well at sunset, with a button to build a roadmap",
        "reloco.app",
      ),
      numbers: [
        { value: "44", label: "tasks in a researched rules library" },
        { value: "34", label: "official sources linked" },
        { value: "9", label: "chapters across the degree" },
        { value: "101", label: "automated tests on the engine" },
      ],
      overview: {
        problem:
          "F-1 rules span four years and five agencies (UNC ISSS, IRS, USCIS, CBP, SSA), on separate pages, and one missed deadline can put a student's status at risk. I'm an international student at UNC, and the students I interviewed learned the order from whoever they happened to know.",
        built:
          "A rules engine that turns about 10 answers into a dated roadmap for the whole degree, with every step linked to its official source. It's live at reloco.app, with guest mode, Google sign-in and calendar sync.",
      },
      v0: {
        intro: "Reloco started with student interviews. These findings shaped the first concept; the product has changed since.",
        // Quotes are verbatim from the two real interviews ("Atef - 3 interviews"); the third,
        // simulated interview is not used. Interviewees are described, not named.
        insights: [
          {
            insight: "Order is the hard part",
            quote: "I first had to find a job on campus.",
            who: "Junior from Vietnam, on getting an SSN",
            today: "Tasks know their dependencies. A card that needs another task first says \"After\" that task and links to it.",
          },
          {
            insight: "The information is scattered",
            quote: "It's all out there, but it's, like, all fragmented.",
            who: "Junior from London",
            today: "Every step links to its official source at UNC ISSS, the IRS, USCIS, CBP or the SSA.",
          },
          {
            insight: "Know-how travels by word of mouth",
            quote: "The people before me passed the knowledge to me.",
            who: "Junior from Vietnam",
            today: "About 10 questions build the plan an upperclassman would give you.",
          },
          {
            insight: "Deadlines hide years ahead",
            quote: "You should be meeting with them like eight to twelve months in advance.",
            who: "Junior from London, on CPT approval",
            today: "The roadmap runs by class year through After graduation, and CPT comes back every spring.",
          },
        ],
        personas: [
          {
            name: "Connected Khoa",
            archetype: "The community learner",
            basedOn: "From the interview with a junior from Vietnam",
            summary: "Learns US systems from upperclassmen and WhatsApp groups, and goes in person instead of searching online.",
            tags: ["Peer-dependent", "Guided by others"],
          },
          {
            name: "Independent Amara",
            archetype: "The self-driven researcher",
            basedOn: "From the interview with a junior from London",
            summary: "Builds her own plan from DHS and ISSS pages, and checks every chatbot answer against the source.",
            tags: ["Self-reliant", "High frustration"],
          },
        ],
        concept: {
          summary:
            "The v0 concept organized tasks by phase, used a \"Build credit\" task and blocked tasks behind a lock screen. None of these ship today.",
          stages: [
            { name: "Discovery", doing: "Finds Reloco through a peer tip in a WhatsApp group", feeling: "Overwhelmed", level: 0.08 },
            { name: "Onboarding", doing: "Signs up and answers a few questions", feeling: "Relieved", level: 0.45 },
            { name: "Roadmap", doing: "Sees tasks by phase and taps Build credit", feeling: "Excited", level: 0.56 },
            { name: "Blocked task", doing: "Hits a lock: complete your SSN first", feeling: "Frustrated", level: 0.3 },
            { name: "SSN first", doing: "Follows the guide to the SSA office", feeling: "Confident", level: 0.72 },
            { name: "Credit card", doing: "Returns to the unlocked task and applies", feeling: "Accomplished", level: 0.94 },
          ],
          flow: {
            steps: ["Land on Reloco", "Sign up with Google", "Onboarding", "Roadmap generated", "Open a task"],
            decision: "Has an unfinished prerequisite?",
            yes: ["Locked: complete SSN first", "Do the SSN task", "Return, now unlocked"],
            no: ["Read the guide", "Mark complete", "Next task suggested"],
          },
        },
      },
      features: [
        {
          id: "onboarding",
          title: "Onboarding that reads your situation",
          shots: [
            phone("05-onboarding-stage-phone", 900, 1296, "Onboarding question: where are you right now? Still at home, just arrived, or already studying at UNC, with a boarding pass above", "Stage first: home, just arrived, or already studying"),
            phone("06-onboarding-plans-phone", 900, 1948, "Onboarding question about plans, with an off-campus internship and a STEM major selected", "Plans decide which tasks apply"),
          ],
          what:
            "About 10 questions: still at home, just arrived, or already studying; home country; arrival, program start and graduation dates; housing; funding; SSN and bank account; plans (on-campus job, internship, STEM major, driving). A boarding pass fills in as you answer.",
          why: "A sophomore and a new arrival need different roadmaps. Asking for the stage first means nobody wades through tasks that don't apply.",
          how: "Dates are validated against realistic ranges for each stage. Current students' past tasks are checked off automatically, and past optional ones are marked \"Not needed\".",
        },
        {
          id: "engine",
          title: "A personalized roadmap engine",
          shots: [phone("04-onboarding-built-phone", 900, 1449, "Roadmap built screen: tasks counted by area, such as immigration, banking, housing and taxes, with a checklist of build steps", "The plan, grouped by area")],
          what: "Builds the dated plan, grouped by area: immigration, banking, housing, work, taxes and more.",
          why: "Tasks show up only when they apply. The campus job appears only if you plan to work, STEM OPT only for STEM majors, a driver's license only if you'll drive.",
          how: "A pure, deterministic function from profile to roadmap. It filters by conditions, schedules from the student's dates and orders by dependency. 101 Vitest tests check invariants, like \"never opens a task before its prerequisites\". Modeling dependencies exposed a real cycle: the campus job needed an SSN, but the SSN needs a job offer. I fixed the order in the library.",
        },
        {
          id: "today",
          title: "Today: one next move",
          shots: [
            phone("07-today-junior-phone", 900, 1948, "Today screen for a junior: boarding pass at 64% progress and one next task, a travel signature before winter break", "A junior's Today screen"),
            desktop("24-today-desktop", 1544, 1692, "Today screen on desktop: boarding pass, the next task and this week's tasks", "Today on desktop"),
          ],
          what: "A boarding pass with progress, one focus task, and at most two more this week. If the task depends on another, the card says \"After [task]\" and links to it.",
          why: "Hick's Law. Fewer choices, faster action. The full list lives in Journey.",
          how: "A planner picks the focus task by due date and dependencies. Skipping a task cascades to the tasks that depend on it, and reopening it restores them.",
        },
        {
          id: "sources",
          title: "Every step sourced",
          shots: [
            phone("09-task-steps-sources-phone", 900, 1766, "Task page for activating the Onyen: four steps, each with a link to a UNC ITS page", "Steps with official links"),
            phone("10-task-rule-30-days-phone", 900, 1550, "Task page explaining you can enter the US no earlier than 30 days before your program start date", "The 30-day entry rule, sourced to UNC ISSS"),
          ],
          what:
            "Each task has tickable steps, a time estimate, what to bring, and a link to the exact official page. Example: \"You can enter the US no earlier than 30 days before the program start date on your I-20\", linked to UNC ISSS.",
          why: "Students told me chatbots were often wrong, but the sources they cited were right. Reloco leads with the source.",
          how: "A typed library of 44 tasks and 34 official sources, with a \"guidance, not legal advice\" line on every task.",
        },
        {
          id: "degree",
          title: "The whole degree, by class year",
          shots: [
            phone("18-journey-whole-degree-phone", 900, 1575, "Journey screen listing chapters from Settling in and First spring through Sophomore, Junior and Senior year and After graduation", "Nine chapters, arrival to OPT"),
            phone("19-journey-junior-phone", 900, 1948, "Journey screen for a junior with six stamped chapters", "A junior's Journey"),
          ],
          what:
            "9 chapters: Pre-flight, Touchdown, First month, Settling in, First spring, then Sophomore, Junior and Senior years, and After graduation. Yearly tasks come back: full-time enrollment, summer address, the winter travel signature, tax forms, and CPT each spring.",
          why: "The expensive mistakes come in later years. CPT needs the advisor months early, and OPT has a filing window. Reloco surfaces them early.",
          how: "Class year is computed from the program start and graduation dates, and the last year is always Senior. Repeating tasks expand into one instance per year, and skipping one year doesn't skip the others.",
        },
        {
          id: "rules",
          title: "Rule-change notices",
          shots: [phone("17-journey-rule-update-phone", 900, 1587, "Rules update card about the DHS duration of status rule and its court pause", "A rules update in Journey")],
          what: "Tells students what changed and what still applies. Example: the 2026 DHS duration-of-status rule, published July 17 and paused by a court on Sept 14.",
          why: "In compliance, being current is the product. Stale advice is worse than none.",
        },
        {
          id: "arrival",
          title: "Arrival mode",
          shots: [
            phone("26-today-arrival-mode-phone", 900, 1626, "Today screen switched to the landing-day checklist two days before arrival", "Today switches to arrival mode"),
            phone("13-arrival-border-phone", 900, 1783, "Arrival mode: the documents to keep in hand at the border", "At the border"),
            phone("14-arrival-first-72h-phone", 900, 1608, "Arrival mode: getting to Chapel Hill, the first 72 hours, and what to do if something goes wrong", "The first 72 hours"),
          ],
          what:
            "Around landing day, Today switches to a landing-day checklist: documents to keep in hand at the border, the ride from RDU, the first 72 hours, and what to do if something goes wrong. On the day, it asks \"Did you make it?\" before clearing the travel tasks.",
          why: "Flights move. Reloco asks instead of assuming.",
        },
        {
          id: "wallet",
          title: "Wallet: dates, not documents",
          shots: [
            phone("15-wallet-empty-phone", 900, 1579, "Empty document wallet, with a note that Reloco never keeps copies of documents", "Nothing stored yet"),
            phone("16-wallet-ready-phone", 900, 1594, "Wallet with nine of nine documents ready and their key dates", "All documents ready"),
            desktop("25-wallet-desktop", 1542, 1688, "Document wallet on desktop", "The wallet on desktop"),
          ],
          what: "Stores only the key dates from a passport, visa, I-20 and I-94, and the roadmap plans around them (for example, a heads-up when a passport needs renewing).",
          why: "The most useful data is also the least sensitive. No copies, no ID numbers.",
          how: "Validation ranges for each document. The AI scanner (built, launching in v1.1) returns date fields only and never stores the image.",
        },
        {
          id: "progress",
          title: "Progress that motivates",
          shots: [
            phone("11-reward-miles-phone", 900, 1460, "Task complete: plus 50 miles", "Miles for each task"),
            phone("12-reward-stamp-phone", 900, 1599, "Chapter complete: Pre-flight stamped, plus 80 miles", "A stamp for each chapter"),
            phone("20-passport-phone", 780, 1120, "Passport page with six of nine chapter stamps", "The passport"),
            phone("22-certificate-phone", 900, 1948, "First-year certificate listing tasks, miles and the finish date", "The first-year certificate"),
          ],
          what: "Miles for each task, a passport stamp for each chapter, weekly streaks, and a first-year certificate.",
          why: "Streaks are weekly, not daily. Visa work comes in bursts, and a quiet week shouldn't break a streak.",
        },
        {
          id: "calendar",
          title: "Calendar sync",
          shots: [phone("08-today-calendar-prompt-phone", 900, 1785, "Today screen with a prompt to put deadlines in Google, Apple or Outlook calendar", "The calendar prompt on Today")],
          what: "One tap adds every deadline to Google, Apple or Outlook, with a reminder the day before, and it updates as the roadmap changes. Suggested on Today, managed in Profile.",
          why: "Students live in their calendar, not in one more app.",
          how: "An RFC 5545 iCal feed behind a private, revocable token.",
        },
        {
          id: "share",
          title: "Share with family",
          shots: [phone("23-family-share-phone", 900, 1948, "Read-only share page showing a student's first-year certificate and stamps", "What a parent or sponsor sees")],
          what: "A read-only page for a parent or sponsor showing progress, stamps and the certificate, never documents.",
          how: "Accounts get a live, revocable link read through a narrow database function. Guests get an encrypted snapshot link.",
        },
        {
          id: "guest",
          title: "Try first, sign in later",
          shots: [phone("21-profile-your-trip-phone", 900, 1578, "Profile screen with passport stamps and editable trip dates under Your trip", "Your trip: change a date, the roadmap reschedules")],
          what: "The full product works without an account. Continue with Google and the progress moves into the account. Change any date in \"Your trip\" and the whole roadmap reschedules.",
          how: "One Store interface with a cookie implementation and a Supabase Postgres implementation, plus an import on sign-in.",
        },
      ],
      landingStrip: {
        caption: "The landing page speaks to every year, not just arrival.",
        shots: [
          desktop("01-landing-every-year-desktop", 2000, 1262, "Landing page section: wherever you are in your degree, with cards for each stage", "Every year"),
          desktop("02-landing-chapters-desktop", 2000, 926, "Landing page section: your whole degree, chapter by chapter", "Chapter by chapter"),
          desktop("03-landing-sourced-desktop", 2000, 670, "Landing page section: every step, sourced", "Every step sourced"),
        ],
      },
      decisions: [
        { decision: "Narrow wedge: F-1 undergrads at UNC only", rejected: "All schools", why: "In compliance, precision is the product." },
        { decision: "Guest mode first", rejected: "A sign-up wall", why: "Students see value before committing." },
        { decision: "Weekly streaks", rejected: "Daily streaks", why: "Visa work comes in bursts." },
        { decision: "Rules decide, AI assists", rejected: "An AI-generated plan", why: "Deadlines need to be deterministic and cited." },
        { decision: "Hide email reminders until sending is live", rejected: "Showing a setting that does nothing", why: "A control that does nothing breaks trust." },
        { decision: "Ask whether the student has landed", rejected: "Assuming the flight date", why: "Flights move." },
      ],
      engineering: {
        bullets: [
          "Row-level security on every table.",
          "Zod validation on every server action.",
          "Google OAuth.",
          "\"Delete everything\" for accounts.",
          "101 Vitest tests on the engine.",
          "Deployed on Vercel.",
          "Email reminders built on a daily cron with one-click unsubscribe, ready to switch on.",
        ],
        stack: [
          { name: "Next.js 16", icon: siNextdotjs },
          { name: "React 19", icon: siReact },
          { name: "TypeScript", icon: siTypescript },
          { name: "Tailwind v4", icon: siTailwindcss },
          { name: "Motion" },
          { name: "Supabase", icon: siSupabase },
          { name: "Zod", icon: siZod },
          { name: "Vitest", icon: siVitest },
          { name: "Claude API", icon: siClaude },
          { name: "Vercel", icon: siVercel },
        ],
        ai: {
          built: ["Personal task notes. They can't change the schedule.", "The document scanner. It returns date fields only."],
          next: [
            "Ask Reloco: answers only from sourced tasks and UNC ISSS pages, with a citation.",
            "\"What does this mean?\" for emails from ISSS, the IRS or a landlord.",
          ],
          cost: "A small model, per-student daily limits, and a hard monthly cap.",
        },
      },
      metrics: {
        note: "Baselines come from the first tester cohort.",
        rows: [
          {
            metric: "On-time rate (north star)",
            definition: "Completed tasks finished by their due date ÷ all completed tasks",
            why: "Measures the core promise: no missed deadlines",
            source: "Task completion date vs due date, Postgres",
          },
          {
            metric: "Activation",
            definition: "Visitors who finish onboarding and get a roadmap",
            why: "Tests whether onboarding is short and clear enough",
            source: "Roadmaps created vs landing visits",
          },
          {
            metric: "Guest-to-account",
            definition: "Guests who continue with Google",
            why: "Tests whether the product earns trust before asking for it",
            source: "Accounts with imported guest progress",
          },
          {
            metric: "Week-4 retention",
            definition: "Students who complete a task in their 4th week",
            why: "A degree lasts years, so habit matters",
            source: "Task completions by week",
          },
          {
            metric: "Calendar connection",
            definition: "Students who add the calendar feed",
            why: "Reminders outside the app protect deadlines",
            source: "Accounts with a calendar feed",
          },
          {
            metric: "\"Not needed\" rate by task",
            definition: "How often each task is marked not needed",
            why: "A content-quality signal: a high rate means it's shown to the wrong students",
            source: "Task statuses",
          },
        ],
      },
      timeline: [
        { phase: "v0", status: "Completed", date: "[Month Year]", text: "Interviews, personas, journey map, first concept." },
        { phase: "v1", status: "Completed", date: "September 2026", text: "Live at reloco.app with everything in The product today." },
        { phase: "v1.1", status: "In progress", text: "Ask Reloco, \"What does this mean?\", and the document scanner going live." },
        { phase: "v2", status: "Planned", text: "An OPT unemployment day counter, a travel check before trips home, and a pilot with UNC ISSS." },
        {
          phase: "Later",
          status: "Planned",
          text: "More schools on the school-pack layer, which keeps each school's offices and deadlines separate from the core engine.",
        },
      ],
    },
  },
];

export const projectsIntro = "Things I build when nobody's assigning homework 🛠️";
