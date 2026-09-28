import {
  siClaude,
  siGoogle,
  siNextdotjs,
  siReact,
  siResend,
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
//   what it is and where to try it (tagline, links, meta, numbers)
//   why it matters (problem) and how I worked (approach)
//   what it does, shown with real screens (features)
//   the calls I made and why (decisions.product, decisions.engineering)
//   what it's built with (stack) and what's next
// Keep every number checkable against the project's code or data.
export type CaseStudy = {
  tagline: string;
  links: { label: string; url: string }[];
  cover: { src: string; alt: string; width: number; height: number };
  meta: { label: string; value: string }[];
  numbers: { value: string; label: string }[];
  problem: string[];
  process: { title: string; text: string }[];
  features: { title: string; text: string; image: string; alt: string }[];
  decisions: {
    product: { title: string; text: string }[];
    engineering: { title: string; text: string }[];
  };
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
      "A gamified roadmap that guides F-1 international students at UNC from their first flight to their first job. I designed, researched, built and shipped it end to end.",
    tags: ["Product design", "Full-stack", "Next.js", "Supabase", "EdTech"],
    live: { label: "reloco.app", url: "https://reloco.app" },
    image: "/projects/reloco/card.webp",
    // Sources: /Users/atefmo/reloco/RELOCO_PROJECT_BRIEF.md, the app's README, and its code
    // (44 tasks and 34 official links in src/lib/library/tasks.ts, 101 Vitest tests, 7 migrations).
    // Screens: the live landing page, and the app in its local demo mode with a sample student.
    caseStudy: {
      tagline: "A gamified roadmap that takes F-1 students at UNC from their first flight to their first job.",
      links: [{ label: "Try it at reloco.app", url: "https://reloco.app" }],
      cover: {
        src: "/projects/reloco/cover.webp",
        alt: "Reloco's landing page: a painting of UNC's Old Well at sunset with the headline From your first flight to your first job",
        width: 2000,
        height: 1157,
      },
      meta: [
        { label: "Role", value: "Solo: product, research, UX, visual design, engineering" },
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
        "As an international student at UNC, I've seen what students get today: a stack of PDFs and a full inbox. What they need is the next right step, in the right order, with the official source behind it.",
      ],
      process: [
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
          text: "Full stack on Next.js and Supabase, 101 tests on the roadmap engine, live on Vercel with a daily reminder job.",
        },
      ],
      features: [
        {
          title: "One next move, not a wall of forms",
          text: "Ten quick questions build a dated plan for the whole degree. Today shows a boarding pass counting down to landing, one focus task, and at most two more for the week.",
          image: "/projects/reloco/today.webp",
          alt: "Reloco's Today screen: a boarding pass to RDU showing 98 days to go, and the next task, submit your immunization records",
        },
        {
          title: "Every step, backed by its source",
          text: "Each task breaks into tickable steps with a time estimate, what to bring, and a link to the exact UNC, IRS or USCIS page.",
          image: "/projects/reloco/task.webp",
          alt: "A Reloco task page with three steps, each linking to Campus Health's official pages",
        },
        {
          title: "The whole degree, in chapters",
          text: "Nine chapters run from pre-flight to STEM OPT. When rules shift, like the 2026 DHS duration-of-status rule and its court pause, Reloco flags it and says what still applies.",
          image: "/projects/reloco/journey.webp",
          alt: "Reloco's Journey screen with a rules update about the DHS duration of status rule, above the Pre-flight chapter's tasks",
        },
        {
          title: "A passport that fills up",
          text: "Tasks earn miles, chapters earn stamps, weekly streaks keep momentum, and finishing earns a certificate. Change a date and the whole roadmap reflows.",
          image: "/projects/reloco/profile.webp",
          alt: "Reloco's profile screen: a passport page with nine chapter stamps, and editable trip dates",
        },
        {
          title: "Dates, not documents",
          text: "The document wallet keeps only the key dates from a passport, visa, I-20 and I-94, and the roadmap plans around them. No copies, no ID numbers.",
          image: "/projects/reloco/wallet.webp",
          alt: "Reloco's document wallet explaining that it never keeps copies of documents, with a list to add passport and visa dates",
        },
        {
          title: "Arrival mode",
          text: "From two days before landing to three days after, Today turns into a landing-day checklist: what to keep in hand at the border and what to do first on the ground.",
          image: "/projects/reloco/arrival.webp",
          alt: "Reloco's arrival mode: a checklist of documents to keep in hand at the border",
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
            text: "The schedule comes from rules with cited sources. An optional Claude pass writes short personal notes but can never add, remove or reschedule a task.",
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
            text: "A live calendar feed for Google, Apple and Outlook that updates as the roadmap changes, revocable read-only share links for family or sponsors, and daily email reminders from a Vercel cron job with one-click unsubscribe.",
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
            { name: "Resend", icon: siResend },
          ],
        },
        {
          label: "Ship",
          items: [
            { name: "Vitest, 101 tests", icon: siVitest },
            { name: "Vercel + cron", icon: siVercel },
            { name: "iCal feeds" },
          ],
        },
      ],
      next: [
        "Next up: agents that watch official pages and flag when a rule or deadline changes, and more schools on top of the school-pack layer, which already keeps UNC's offices and deadlines separate from the core engine. The number I'm watching: how many students finish Pre-flight before they land.",
      ],
    },
  },
];

export const projectsIntro = "Things I build when nobody's assigning homework 🛠️";
