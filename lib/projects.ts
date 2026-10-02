import {
  siClaude,
  siFigma,
  siGithub,
  siNextdotjs,
  siPuppeteer,
  siReact,
  siSentry,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVitest,
  siZod,
} from "simple-icons";
import type { Skill } from "./skills";
import type { MotionId } from "@/components/reloco-motion";

// Project pages show product thinking, design, engineering and shipping, in balance. Every
// feature says what it does, why it matters and how I built it. Metrics live only in the Metrics
// section, each with a definition and a source. No em dashes, no invented numbers.
// Reloco's content follows /Users/atefmo/reloco/RELOCO_CASE_STUDY_UPDATE_V5.md (v5 rebuild), updated
// for v2 (Ask Reloco and Documents, September 2026), v2.1 (task tools and comparisons, October
// 2026) and v2.3 (the visa interview check, a second security review, Sentry and tester feedback). Every number is checked against Reloco's code and eval runs. "Pages" means unique URLs listed
// as a task's sources across the task library. Reloco is an app, never "a roadmap"; the student's schedule is "their plan".

export type ImageShot = { src: string; alt: string; caption: string; width: number; height: number; motion?: undefined };
// A phone screenshot, or one of the motion graphics (components/reloco-motion) drawn at the same size.
export type Shot = ImageShot | { motion: MotionId; alt: string; caption: string; src?: undefined; width?: undefined; height?: undefined };

export type Persona = {
  name: string;
  initials: string;
  archetype: string;
  background: string;
  quote: string;
  how: string;
  goals: string[];
  frustrations: string[];
  // 0 = left pole, 1 = right pole, one value per trait scale.
  traits: number[];
  gives: string;
};

export type Feature = {
  id: string;
  title: string;
  shots: Shot[];
  what: string | string[];
  why?: string;
  how?: string;
};

// Engineering layer: a label and purpose on the left, plain-text parts on the right. Text in
// `backticks` renders in monospace. The Engine layer draws its pipeline as pills instead.
export type Layer = {
  name: string;
  purpose: string;
  parts?: string[];
  pipeline?: string[];
  aside?: string;
};

export type CaseStudy = {
  // Browser tab title; the layout adds " | Atef Mohamed".
  metaTitle?: string;
  oneLiner: string;
  metaLine: string[];
  cta: { label: string; url: string };
  hero: ImageShot;
  glance: { label: string; text: string }[];
  audience: {
    intro: string;
    groups: { title: string; text: string; shots: Shot[] }[];
  };
  v0: {
    intro: string;
    insights: { insight: string; quote: string; who: string; today: string }[];
    personas: [Persona, Persona];
    traitScales: { left: string; right: string }[];
    concept: {
      summary: string;
      stages: {
        name: string;
        doing: string;
        feeling: string;
        level: number;
        turningPoint?: string;
      }[];
      flow: { steps: string[]; decision: string; yes: string[]; no: string[] };
    };
  };
  // v0 to v1: what changed and why.
  shifts: { intro: string; rows: { v0: string; v1: string; why: string }[] };
  productIntro: string;
  features: Feature[];
  progress: { title: string; text: string; shots: Shot[] };
  design: {
    intro: string;
    principles: { title: string; text: string }[];
  };
  engineering: {
    layers: Layer[];
    pipeline: string[];
    // Text with **bold** numbers.
    quality: string;
    stack: { label: string; items: Skill[] }[];
  };
  metrics: {
    note: string;
    groups: {
      title: string;
      intro: string;
      rows: {
        metric: string;
        northStar?: boolean;
        definition: string;
        why: string;
        source: string;
      }[];
    }[];
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
// Every screenshot is a 1170x2532 phone capture, converted to 900x1948. Each feature leads with a
// motion graphic of it in action (components/reloco-motion), drawn at the same phone size.
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
  "A web app that gives international students at UNC one calm plan for everything the US asks of them, from visas and taxes to a phone number, a bank account and a driver's license, in the right order around their dates. An AI assistant answers questions about their own situation, and an encrypted vault keeps their documents ready and checked.";

export const projects: Project[] = [
  {
    slug: "reloco",
    name: "Reloco",
    status: "Live",
    blurb:
      "A web app that gives F-1 students at UNC one calm plan for everything, from visas and taxes to a bank account and a driver's license, with an AI assistant that knows their situation and an encrypted vault for their documents. I researched, designed, built and shipped it on my own.",
    tags: ["Product design", "Full-stack", "Applied AI", "Next.js", "Supabase"],
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
      glance: [
        {
          label: "Problem",
          text: "A new F-1 student has to handle immigration rules, taxes, an SSN, a US bank account and credit, housing, health insurance and IDs, each explained on a different site, on top of classes in a new country. The order lives in word of mouth, and one missed step can put a student's status at risk.",
        },
        {
          label: "Solution",
          text: "About 10 questions and Reloco knows which tasks apply, when each is due and what has to come first, then guides the student through them one at a time for the whole degree. It picks from **49** tasks across **9** areas, linked to **64** official and trusted pages. Tools inside the tasks check the student's own papers and compare options, **Ask Reloco** answers questions about their situation, and **Documents** keeps their papers encrypted and checked.",
        },
        {
          label: "Scope",
          text: "F-1 undergrads at UNC only, so every office, deadline and link is exact. Schools are a data layer, so the next one is a content change, not a rebuild.",
        },
        {
          label: "Role",
          text: "Solo: user interviews, product strategy, UX and visual design, full-stack and AI engineering, security, launch.",
        },
        { label: "Status", text: "v2.3 live at reloco.app, October 2026: the plan, task tools, Ask Reloco and Documents, with the first testers starting." },
      ],
      audience: {
        intro:
          "An F-1 degree has three very different stretches. Reloco changes what it shows as a student moves through them.",
        groups: [
          {
            title: "Arriving: new students",
            text: "The heaviest stretch. For a sample freshman, **13** of their **43** tasks are due before the flight or in the first week, from the I-901 fee and the entry window to the I-94 and ISSS check-in. Reloco counts down to landing, then switches to arrival mode.",
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
            text: "The highest-stakes filing of the degree has a strict window. Reloco times it from the graduation date: decide, request the OPT I-20, file the I-765 inside the window, then report the job while Reloco counts unemployment days against the limit. STEM majors get the 24-month extension on the same track.",
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
              'Tasks know their dependencies. A task that needs another first is locked, with a "Finish this first" link to it.',
          },
          {
            insight: "The information is scattered",
            quote: "It's all out there, but it's, like, all fragmented.",
            who: "Junior from London",
            today:
              "Every rule links to its source: a UNC office, a federal or state agency, or a consumer-protection guide.",
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
            initials: "K",
            archetype: "The community learner",
            background: "Junior at UNC, from Vietnam.",
            quote: "The people before me passed the knowledge to me.",
            how: "Learns US systems from upperclassmen and WhatsApp groups, and goes in person instead of searching online.",
            goals: [
              "Handle each system as it comes up, without stress",
              "Build credit gradually",
              "Help younger international students settle in",
            ],
            frustrations: [
              "Doesn't know what he doesn't know until it's urgent",
              "Depends on who happens to be around",
              "Stuck when nobody he knows has done it before",
            ],
            traits: [0.22, 0.18, 0.25, 0.2, 0.22],
            gives:
              "The guidance his network gave him, without depending on luck.",
          },
          {
            name: "Independent Amara",
            initials: "A",
            archetype: "The self-driven researcher",
            background: "Junior at UNC, from London.",
            quote: "It's all out there, but it's, like, all fragmented.",
            how: "Builds her own plan from DHS and ISSS pages, and checks every chatbot answer against the source.",
            goals: [
              "Master every system before it catches her off guard",
              "Land an employer willing to sponsor her visa",
              "Create the guide she wished she had",
            ],
            frustrations: [
              "Information is spread across dozens of sources",
              "Advisors are slow and miss the details of her case",
              "Chatbots give partly wrong answers she has to verify",
            ],
            traits: [0.85, 0.8, 0.8, 0.82, 0.85],
            gives: "Sources she can check, without the hours of research, and an assistant that cites them.",
          },
        ],
        traitScales: [
          { left: "Reactive", right: "Proactive" },
          { left: "Peer-dependent", right: "Self-reliant" },
          { left: "Informal", right: "Official sources" },
          { left: "Guided", right: "Trial and error" },
          { left: "Low frustration", right: "High frustration" },
        ],
        concept: {
          summary:
            "The v0 concept organized tasks by phase, used a Build credit task and blocked tasks behind a lock screen. None of these ship today.",
          stages: [
            {
              name: "Discovery",
              doing: "Finds Reloco through a peer tip in a WhatsApp group",
              feeling: "Overwhelmed",
              level: 0.04,
            },
            {
              name: "Onboarding",
              doing: "Answers a few questions",
              feeling: "Relieved",
              level: 0.45,
            },
            {
              name: "Plan",
              doing: "Sees tasks by phase and taps Build credit",
              feeling: "Excited",
              level: 0.66,
            },
            {
              name: "Blocked task",
              doing: "Hits a lock: complete your SSN first",
              feeling: "Briefly frustrated",
              level: 0.42,
              turningPoint:
                "The moment that shaped dependencies: a clear 'do this first' instead of a dead end.",
            },
            {
              name: "SSN first",
              doing: "Follows the guide to the SSA office",
              feeling: "Confident",
              level: 0.8,
            },
            {
              name: "Credit card",
              doing: "Returns to the unlocked task and applies",
              feeling: "Accomplished",
              level: 0.97,
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
      shifts: {
        intro:
          "Building it and walking it as real students changed most of the v0 concept. Five shifts:",
        rows: [
          {
            v0: "Tasks grouped by phase",
            v1: "9 chapters: five for year one, then class years through OPT",
            why: "Students think in semesters and years, and the costly deadlines (CPT, OPT) come later",
          },
          {
            v0: "A lock screen on blocked tasks",
            v1: '"Do first" and "After" links; tasks stay open to read',
            why: "A lock stops a student cold. A pointer tells them what to do next",
          },
          {
            v0: "A few onboarding questions",
            v1: "The stage comes first: still at home, just arrived, or already studying",
            why: "A freshman and a junior need different plans from the first screen",
          },
          {
            v0: "One first-week journey",
            v1: "Every year, repeating tasks, and arrival mode for the landing window",
            why: "Freshmen need the most help, but upperclassmen still miss yearly deadlines",
          },
          {
            v0: "Overdue in red for everything past due",
            v1: '"From before you joined · done?" for anything due before sign-up',
            why: "A late joiner shouldn't start the app already failing",
          },
        ],
      },
      productIntro:
        "One job: take the stress out of the US system, so a student always knows what's next and never misses a step.",
      features: [
        {
          id: "onboarding",
          title: "Onboarding that reads your situation",
          shots: [
            { motion: "onboarding", alt: "Animation of onboarding: Mei types her name, says she's still at home, then her city and landing date, and each answer fills in the boarding pass above as the plane moves a step closer to RDU", caption: "A boarding pass that fills in as you answer" },
            phone(
              "06-onboarding-plans-phone",
              "Onboarding question about plans, with an off-campus internship and a STEM major selected",
              "Plans decide which tasks apply",
            ),
            phone(
              "37-onboarding-done-already-phone",
              "Last onboarding question: Done any of these already? Pre-flight tasks such as booking a flight and signing a lease, each with a tick box",
              "New students tick off prep they've already done",
            ),
          ],
          what: "About 10 questions: the stage (still at home, just arrived, already studying), country, arrival, start and graduation dates, housing, funding, SSN and bank, and plans (campus job, internship, STEM major, driving). A boarding pass fills in as you answer. With an account, students can upload their I-20, passport and I-94 during signup, and the dates fill themselves in, marked to check.",
          why: "A freshman two days from landing and a junior planning CPT need completely different plans. New students can tick off prep they've already done; current students start with year one behind them. The copy follows the stage too, so a junior never reads 'get ready to fly'.",
          how: "Date ranges are validated per stage, and answers are validated on the server with Zod.",
        },
        {
          id: "engine",
          title: "A rules engine that knows what applies to you",
          shots: [
            { motion: "plan-build", alt: "Animation of Ziad's plan being built: four stages tick off one by one while the nine areas pop in with their task counts, then the plane lands at RDU and the screen reads Cleared for takeoff, 35 tasks across 9 areas", caption: "The plan, built stage by stage" },
            phone(
              "18-journey-whole-degree-phone",
              "Journey screen listing chapters from Settling in and First spring through Sophomore, Junior and Senior year and After graduation",
              "The rest of the degree, by class year",
            ),
          ],
          what: "Nine areas: immigration, taxes, work, banking, IDs, housing, health, campus and tech. A personal, dated plan. Tasks appear only when they apply: the campus job only if you'll work, STEM OPT only for STEM majors, a driver's license only if you'll drive. Change a date in Profile and the whole plan reschedules, keeping progress.",
          why: "A generic checklist buries what matters to you.",
          how: "A pure, deterministic pipeline, detailed in Engineering. Modeling dependencies caught a real cycle: the campus job needed an SSN, but the SSN needs a job offer. An optional AI step (Claude) writes short notes on the tasks where the student's situation changes something. It can't add, move or remove anything, so every date stays deterministic and sourced.",
        },
        {
          id: "today",
          title: "Today: one next step",
          shots: [
            { motion: "today", alt: "Animation of Mei's Today: she marks her on-campus job found, the payroll forms that were waiting on it become her one next step, the week moves to 2 of 3 tasks, her miles count up, and she taps Start", caption: "Finish one step, and the next one is ready" },
            phone(
              "64-task-locked-phone",
              "Mei's task Check in with ISSS, marked Locked, with a Finish this first card linking to Download your I-94 and check it",
              "Locked until the task before it is done",
            ),
          ],
          what: 'One focus task and at most two more this week. A task waiting on another is locked: a "Finish this first" card links to what comes first, and its steps and Complete button stay locked until then.',
          why: "Hick's Law. One clear action beats a list of 40. Calm urgency: red means a real missed deadline. Anything due before a student joined asks 'done?' instead, so a late joiner doesn't start the app already failing.",
          how: "A planner ranks by urgency and dependencies. The order is enforced on the server too: completing a task checks its prerequisites, and steps can only be ticked in order. Skipping cascades to the tasks that depend on it, and reopening restores them.",
        },
        {
          id: "task",
          title: "Inside a task",
          shots: [
            { motion: "task-steps", alt: "Animation of the task Pack your entry documents in your carry-on: its four steps are ticked one by one in order, each unlocking the next, the counter climbs to 4 of 4 and the bar turns into Complete, plus 80 miles", caption: "Steps ticked in order, then Complete" },
            phone(
              "65-task-locked-steps-phone",
              "Check in with ISSS further down: three steps with their ISSS links, a locked Mark complete button, and a Bring list with the I-20 waiting for a check and the I-94 not added",
              "Steps, sources, and what to bring from Documents",
            ),
          ],
          what: "A few short steps with tick boxes, and the source link on the step that needs it. Then what to bring, checked against the student's Documents (on file, needs a check, or missing with an Upload button), add to calendar, the sources, and a fixed Mark complete / Skip bar.",
          why: '"Pack your entry documents" is really four small actions. Broken down, it\'s 20 minutes, not a worry.',
          how: "Steps, sources, documents, time and miles are typed fields in the task library, so every task renders the same way.",
        },
        {
          id: "tools",
          title: "Tools that do the hard part",
          shots: [
            { motion: "i94-check", alt: "Animation of Mei's I-94 check: class of admission, admit until and name match, the date of birth is flagged as different from her passport, the passport number matches, then Draft the email to ISSS about it opens the drafted email, ready to copy", caption: "A mismatch caught, and the email to ISSS drafted" },
            {
              motion: "visa-check",
              alt: "Animation of Ziad's visa interview check: his program start comes from his I-20, Reloco says the embassy can issue his visa from Jan 7, 2026 and he can enter from Dec 8, 2026, he types an interview date of Sep 3, 2026 and his SEVIS fee has time to be verified, then his papers are compared: the passport, name and date of birth match, the SEVIS fee receipt's SEVIS ID differs from his I-20, and the DS-160 matches. After the interview he picks More processing (221(g)) and sees what it means, what to do and how long it takes",
              caption: "Papers checked before the interview, and a plan after it",
            },
            { motion: "ssa-visit", alt: "Animation of the SSA visit plan: the readiness checks resolve, a job start of November 16 is entered and SSA's 30-day rule says she can't apply until October 17, then the plan unfolds to starting online at ssa.gov and booking the Durham office", caption: "An SSA visit planned around what's ready" },
            {
              motion: "dmv-visit",
              alt: "Animation of Mei's DMV visit plan: her check-in, passport, visa, I-94 and I-20, no-SSN status and lease all check out, she says she'll drive her own car and gets the insurance she needs to bring, then booking and the Carrboro office appear",
              caption: "A first license, planned around what's ready",
            },
          ],
          what: [
            "Get your F-1 visa: the passport, I-20, SEVIS fee receipt and DS-160 confirmation page are checked against each other, the interview date against the SEVIS fee and the earliest day the embassy can issue the visa, and after the interview a 221(g) or 214(b) result says what it means, what to do and how it affects the start date, with the email to ISSS drafted.",
            "Download your I-94: Reloco compares it with the passport, point by point, and drafts the email to ISSS if something differs.",
            "Apply for an SSN: an SSA visit plan, from what has to be ready (the job offer, the ISSS check-in, the documents) to the Durham office and its number.",
            "Before a trip home: the travel signature, passport and visa are checked against the dates of the trip.",
            "Getting a driver's license: a DMV visit plan, from the documents in Documents (no SSN needed) and proof of address to insurance, the nearest office and the tests.",
            "Also: a lease explained in plain words, the major checked against the DHS STEM list, CPT months counted from an offer letter, immunizations checked against UNC's rules, an OPT unemployment counter, help deciding whether to enroll in or waive student health insurance, and a dated task when a student reports a move.",
          ],
          why: "Steps say what to do. The hard part is knowing whether your own papers are right: a wrong date of birth on an I-94 or a visa that lapses over winter break can stop a student at the border. Each tool runs that check with the student's own documents and dates.",
          how: "The checks are plain code, not AI: date math (down to the 3 business days ICE says a SEVIS fee payment needs to be verified before the interview, skipping federal holidays), the STEM list, CPT months, the J-1 insurance minimums. AI only reads documents, and readers that explain an upload (a lease, an insurance policy, an offer) quote the exact words they relied on. A file picked just for that is read once and never stored. Each reader has its own eval: the insurance reader passed 49 of 49 checks on invented policies.",
        },
        {
          id: "compare",
          title: "Compare before you choose",
          shots: [
            { motion: "compare-banks", alt: "Animation of the bank comparison: five banks fill in side by side with checkmarks, the rows that matter without an SSN are marked For you, a swipe moves through the banks, and Details on Chase opens its full terms with sources", caption: "Five banks side by side, sorted for a student without an SSN" },
            phone(
              "74-compare-bank-details-phone",
              "Chase Secure Banking's details below the table: each fact with a Source link to Chase's own page",
              "Details on request, each fact sourced",
            ),
          ],
          what: [
            "A bank, a first credit card, a phone plan and a way to get money from home, compared side by side on the task where the student needs them.",
            "Rows are ordered for the student: without an SSN, opening without one and being near campus come first. Short answers show at a glance, and Details opens the full terms, each linked to the provider's own page.",
            "Money transfers are filtered by home country. Most services can't send from China, Egypt, Ghana, Vietnam or Nigeria, so those students see a bank wire and a note saying why.",
            "Found another option? Paste its terms or add a screenshot, and it joins the table with the exact words each value came from.",
          ],
          why: "Comparison sites are often paid per sign-up, and few say what works without an SSN. Here every fact links to the provider's own page with the date I checked it, options whose key facts I couldn't confirm are left out, and nobody pays to be listed.",
          how: "The first version stacked one card per bank, which made comparing hard. Walking it, I rebuilt it as a real table: rows that matter first, rows that are the same for every option folded into one line, and details only when asked for. Tests fail on any fact without a source or any link to a review or affiliate site. Reading an added option uses structured outputs, and on invented fee sheets it passed 31 of 31 checks with nothing invented.",
        },
        {
          id: "ask",
          title: "Ask Reloco: an assistant that knows your plan",
          shots: [
            { motion: "ask", alt: "Animation of Ask Reloco: Can I work 30 hours a week at my campus job? is typed and sent, Reloco checks her work eligibility, streams an answer explaining the 20-hour limit while classes are in session, marks it Confirm with ISSS and links its ISSS sources", caption: "A work question, checked against where she is" },
            phone(
              "61-ask-sources-phone",
              "The rest of the answer, with its two sources: ISSS on-campus employment and UNC International Student and Scholar Services",
              "Every answer shows what it relied on",
            ),
            phone(
              "62-ask-email-phone",
              "Ask Reloco explaining a pasted CPT approval email, with the print-and-sign deadline highlighted and a Mark done suggestion for the CPT task",
              "A pasted email becomes a deadline and a one-tap update",
            ),
          ],
          what: [
            "Ask anything, paste an email or attach a letter. Answers come from the student's own plan, dates and documents, and cite the task, checked fact or official page they rely on.",
            'Work, travel and OPT questions run a check against where the student is: their stage, dates, finished tasks and CPT so far. Anything that affects their status is marked "Confirm with ISSS".',
            "When a message changes the plan, like a CPT approval, it offers a one-tap update. Nothing changes until the student taps.",
          ],
          why: "Students told me chatbots sounded sure and were partly wrong. Here, code checks every answer before the student sees it, and the assistant can't change the plan on its own.",
          how: "Claude Sonnet 5 in a streaming tool-use loop I wrote, with 9 tools of my own (the plan, a task, their documents, work, travel, OPT, STEM and unemployment checks, and one for deadlines and suggestions) plus web search limited to 17 official domains. Citations are validated on the server: only a task in their plan, one of 53 checked facts, or a page the search actually returned counts. The screens show a real answer for a sample junior.",
        },
        {
          id: "documents",
          title: "Documents: an encrypted vault that checks what you upload",
          shots: [
            { motion: "documents", alt: "Animation of adding a specimen passport to Documents: the student opts in to an AI read, checks every detail it read, confirms, and the passport is filed with its number masked to the last four digits", caption: "A specimen passport: read, confirmed and masked" },
          ],
          what: [
            "13 kinds of documents, from the passport, visa, I-20 and DS-160 confirmation page to a lease and a job offer.",
            "With the student's OK, AI reads the key details for them to confirm, and the plan uses the real dates. It checks the upload is the right document first: a lease uploaded as a passport is refused before it's stored.",
            "Tasks that need documents show what's on file, what needs a check and what's missing.",
          ],
          why: "A passport and an I-20 are the most sensitive things a student owns, so trust had to be designed in from the first version, not added later.",
          how: "Names and numbers are encrypted in the app with AES-256-GCM before they reach the database, with separate keys for sensitive and high-risk fields, and each value is bound to its student and field. Files live in a private bucket, served only through Reloco and typed by their real bytes, never their name. Every upload, AI read, view and delete goes into a log students can read but not edit. On invented specimen documents, the reader got 196 of 196 fields right and passed 76 of 76 upload checks, accepting each document in its own slot and refusing it in the wrong one, and code checks official number formats so a misread number is flagged, not saved.",
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
            { motion: "landing", alt: "Animation of landing day: a plane flies from Shanghai to RDU on Mei's boarding pass, Reloco asks Did you make it to Chapel Hill?, a tap on Yes, I landed clears the travel task from Next up, and Today turns to Touchdown, Day 1 in Chapel Hill", caption: "On landing day, one tap clears the travel tasks" },
          ],
          what: 'Two days before landing, Today becomes a landing-day checklist: the border, the ride from RDU, the first 72 hours, and what to do if something goes wrong. On the day it asks "Did you make it?"',
          why: 'The border is the highest-stakes moment of year one, and flights move. "Yes" clears the travel tasks; "On a different day" fixes the date and reschedules everything.',
        },
        {
          id: "yearly",
          title: "Every year, on schedule (current students)",
          shots: [
            { motion: "yearly", alt: "Animation of Journey scrolling through the class years: Sophomore, Junior, Senior and After graduation open in turn, and the same yearly tasks (winter travel signature, tax forms, summer CPT, full-time registration, summer move) reappear in each chapter with that year's date", caption: "The same deadlines, back every year with new dates" },
            phone(
              "51-tax-forms-phone",
              "Task: File your 2026 tax forms, Form 8843 plus a 1040-NR if you had US income",
              "Tax season, every February",
            ),
            {
              motion: "trip-check",
              alt: "Animation of the trip check: a winter break from December 15 to January 10 is typed in, then each document is checked. The travel signature expires before she's back; the passport and visa are fine",
              caption: "A trip home, checked before booking",
            },
          ],
          what: 'Yearly tasks come back as dated copies: winter travel signature, tax forms (Form 8843, and a 1040-NR if there was US income), CPT for each summer, summer address and full-time enrollment. Optional ones, like a trip home or a summer move, close as "Not needed" if their date passes untouched, instead of sitting overdue. Tax tasks add treaty notes for the student\'s passport country. When a student reports a move, a dated task covers the 10-day address rule and everything else that needs the new address.',
          why: "Upperclassmen don't need onboarding; they need the recurring deadlines they forget.",
          how: "A task can declare the years it repeats, or one copy per event; the engine creates a dated copy for each (like `tax-forms-2027`, or one per reported move) and places it in the right chapter.",
        },
        {
          id: "opt",
          title: "OPT and STEM OPT (graduating students)",
          shots: [
            { motion: "opt-filing", alt: "Animation of Aisha's OPT application check: her program end comes from her I-20, she enters the date ISSS issued her OPT I-20, and Reloco shows USCIS can receive it from Feb 20 to Mar 21, 2028, with 21 days left, then her CPT and academic year check out and her documents are in place", caption: "Her own filing window, worked out" },
            { motion: "opt", alt: "Animation of the OPT track: on Journey the OPT tasks unlock and complete in order down to reporting the job, whose tool counts unemployment days to 23 of 90 until a job starting Jun 12, 2028 is added and the clock stops with 67 days left", caption: "OPT in order, then a clock for unemployment days" },
          ],
          what: "Decide what's next, request the OPT I-20 from ISSS, file the I-765 inside the window, report the job and count unemployment days against the limit (90, or 150 on the STEM extension), then the STEM extension, with the major checked against the DHS STEM list. Before that, Reloco counts full-time CPT months, from the student or their I-20, and warns well before 12, the point where OPT is lost. When it's time to file, it works out the student's own window: USCIS must receive the application within 30 days of the OPT I-20 and no later than 60 days after graduation, so Reloco shows the real last day, the eligibility checks and what to send.",
          why: "The OPT filing window is strict, and missing it can cost the job offer. Reloco surfaces it years early and in order.",
          how: "OPT tasks are anchored to the graduation date, with `requires` chains so each step unlocks the next. The filing window is plain date math, tested at its edges. While I was building it, a DHS rule that would cut the 60 days to 30 was paused by a court, and the government's regulations site already showed the new text. The check follows what USCIS says it applies today, says so on the card, and switches with one setting if the rule takes effect.",
        },
        {
          id: "sources",
          title: "Sourced, current, and yours to share",
          shots: [
            { motion: "sources", alt: "Animation of Ziad's task Book a flight inside your entry window: the rule that you can enter no earlier than 30 days before the program start date on your I-20 is highlighted, a step links UNC ISSS, Add due date to Google Calendar is tapped, and the official sources appear", caption: "The 30-day rule, sourced to UNC ISSS" },
            phone(
              "23-family-share-phone",
              "Read-only share page showing a student's first-year certificate and stamps",
              "A read-only page for family",
            ),
          ],
          what: [
            "Tasks link 64 pages on 29 sites: official pages for every rule, and guides like the CFPB's for banking and credit.",
            "Sources: UNC offices (ISSS, Campus Health, Housing, One Card, Career Services), federal agencies (the IRS, USCIS, SSA, DHS, CBP, the State Department, USPS), North Carolina (the DMV and the Departments of Revenue and Insurance), local utilities (Duke Energy, OWASA), and consumer guides from the CFPB, FTC and FCC.",
            "Rule changes get a notice that says what still applies (the 2026 DHS duration-of-status rule and its court pause).",
            "The dates in Documents (passport, visa, I-20, I-94) drive the plan, like the reminder to renew a passport.",
            "Deadlines sync to Google, Apple or Outlook.",
            "A read-only share page lets family follow along.",
          ],
          why: "In compliance, being current and precise is the product. Students told me chatbots were often wrong but their sources were right.",
        },
      ],
      progress: {
        title: "Progress that motivates",
        text: "Tasks earn miles, chapters earn stamps, and streaks are weekly, not daily, because visa work comes in bursts. A certificate marks the first year, and another marks graduation.",
        shots: [
          { motion: "miles", alt: "Animation of completing a task: the last step of Get a US phone number is ticked, Complete is tapped, and a card says Nice work as confetti falls and the miles count up to 60", caption: "Miles for every task" },
          { motion: "stamp", alt: "Animation of finishing a chapter: the Pre-flight stamp comes down on the reward card with confetti and plus 50 miles, then the card closes and Mei's passport shows the Pre-flight stamp, 1 of 9", caption: "A stamp for every chapter" },
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
          phone(
            "66-certificate-graduation-phone",
            "Graduation certificate for the class of 2028 with eight chapter stamps, 71 tasks and 22,400 miles",
            "And one at graduation",
          ),
        ],
      },
      design: {
        intro:
          "I design in loops: interview, build, walk the app as real students, change what doesn't hold up. The walkthroughs use scripted personas: a freshman months out, a freshman landing in two days, a junior, a student landing today. The AI gets the same loop, with evals in place of walkthroughs.",
        principles: [
          {
            title: "One next step (Hick's Law)",
            text: "Today shows one focus task and at most two more.",
          },
          {
            title: "The system carries the complexity (Tesler's Law)",
            text: "Dependencies and dates live in the engine, not in the student's head.",
          },
          {
            title: "Calm urgency",
            text: "Red only for real overdue deadlines; due-soon is blue; missed-before-joining is a question.",
          },
          {
            title: "Progressive disclosure",
            text: "Chapters collapse, each task opens to steps, then sources, and comparisons show the rows that matter first, with details on request.",
          },
          {
            title: "AI you can check",
            text: "Every answer shows what it relied on, code validates each citation, and the assistant suggests changes instead of making them.",
          },
          {
            title: "Private by design",
            text: "Encryption, an access log and opt-in AI reads were in the first version of Documents, not added later.",
          },
          {
            title: "Mobile-first, works everywhere",
            text: "Built at 375px first, then scaled up for laptops, in light and dark, with visible focus and reduced motion.",
          },
        ],
      },
      engineering: {
        layers: [
          {
            name: "Content",
            purpose: "What Reloco knows",
            parts: [
              "Task library: 49 typed tasks. Each declares conditions, date anchors (arrival, program start, tax year, fixed date), dependencies and hard `requires`, repeat years or per-event copies, and whether it's optional, travel-only or a later-year task, plus steps, documents and sources.",
              "School pack: UNC's offices, links and airport, kept separate from the engine.",
              "Country data: tax treaties and passport-validity rules.",
              "53 checked facts for the assistant, each with its source and the date I checked it. Calendar facts expire on their own.",
            ],
          },
          {
            name: "Engine",
            purpose:
              "Pure and deterministic. Streams each stage to the setup screen as NDJSON.",
            pipeline: [
              "Profile",
              "Filter",
              "Resolve dates",
              "Expand yearly",
              "Order by dependencies",
              "Chapters",
            ],
            aside: "AI notes",
          },
          {
            name: "Runtime rules",
            purpose: "Keep a plan honest over time",
            parts: [
              "Not needed: closes optional tasks whose date passed.",
              "Catch-up: marks tasks due before the join date.",
              "Skip and reopen cascades.",
              "Resync by `slug`, so progress survives library updates.",
            ],
          },
          {
            name: "AI",
            purpose: "Grounded, checked, affordable",
            parts: [
              "Ask Reloco: a streaming tool-use loop on Claude Sonnet 5, with prompt caching on the fixed instructions.",
              "Citations, reply types and plan suggestions are validated in code before anything reaches the student.",
              "Document reading and checking with structured outputs, plus format checks for official numbers.",
              "Readers for leases, insurance policies, offer letters and options a student found: structured outputs with quotes, checked word for word in their evals. A file picked just for one of them is read once and never stored.",
              "One model everywhere, chosen by evals: moving document reading from Haiku to Sonnet 5 took it from 98.9% to 100% of fields on specimens, and moving the scanner and notes off Opus cut their cost.",
              "Daily caps per student on every AI feature (40 questions, 30 document checks, 10 comparisons), counted in a log students can't edit.",
            ],
          },
          {
            name: "Data",
            purpose: "One Store interface",
            parts: [
              "Supabase Postgres with row-level security on every table and 13 migrations, including checks that every link between rows stays inside one account.",
              "Facts that tools need (check results, reported moves, OPT jobs) live in one validated JSON field, so most new features ship without a migration.",
              "Security-definer functions serve the share page and calendar feed by revocable token.",
              "Google OAuth, with the session refreshed in the request proxy.",
              "A cookie store runs the app with no database, for local development and visual QA.",
            ],
          },
          {
            name: "Surfaces",
            purpose: "What students use",
            parts: [
              "Today",
              "Journey",
              "Task pages",
              "Ask Reloco",
              "Documents",
              "RFC 5545 calendar feed",
              "Family share page",
              "Email reminders (built, off until sending is live)",
            ],
          },
          {
            name: "Security",
            purpose: "Built to hold passports",
            parts: [
              "A Content Security Policy with a fresh nonce on every request, so injected scripts can't run.",
              "Uploads typed by their real bytes: a page renamed passport.jpg is refused, and files only open in the browser if they're a real image or PDF.",
              "Sign-in cookies unreadable by page scripts, and sign-in only returns to known addresses.",
              "A full security review before launch: no cross-account access, no open redirects, and 0 known vulnerabilities in dependencies.",
              "A second review after launch, by six reviewers working in parallel. It led to encrypting immunization results and pasted messages, a database cap on uploads, and deleting documents added during signup along with the account.",
              "Error reports through Sentry, sent via Reloco's own address so the page's security policy stays strict. Form contents, cookies, IP addresses, anything sent to Claude and share-link tokens are stripped first, checked on real reports.",
            ],
          },
        ],
        pipeline: [
          "Answers are validated with Zod.",
          "49 tasks are filtered to the ones that apply (43 for a sample freshman, 48 for a sample junior).",
          "Anchors become real dates.",
          "Yearly tasks become one copy per year.",
          "Tasks are ordered by dependencies.",
          "Tasks are grouped into 9 chapters.",
          "Claude adds short notes where the student's profile changes how to do a task. It can't change dates or which tasks exist, and if it fails, the plan is complete without it.",
          "The plan is saved, and each step streams to the screen.",
        ],
        quality:
          "**308** tests guard the engine's invariants, like never opening a task before its prerequisites. The AI has its own evals: **85** Ask Reloco cases across **5** student personas, where every safety case (referrals, scams, prompt injection) must pass and the gate is 90%. The latest full run passed **85/85** with **0** safety failures, at about **1¢** a question. Document reading scored **196/196** fields and passed **76/76** upload checks, the insurance reader passed **49/49** checks and the comparison reader **31/31**. A crawler walks the app as scripted students and captures every screen, the database has grown through **13** migrations, each with row-level security (the newest access rules tested against a real Postgres), and Sentry reports production errors with personal data stripped.",
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
              { name: "Tailwind CSS v4", icon: siTailwindcss },
              { name: "Motion" },
            ],
          },
          {
            label: "Backend and data",
            items: [
              {
                name: "Supabase (Postgres, row-level security, Storage, Google OAuth)",
                icon: siSupabase,
              },
              { name: "Zod", icon: siZod },
              { name: "Node crypto (AES-256-GCM)" },
            ],
          },
          {
            label: "AI",
            items: [
              { name: "Claude API: Sonnet 5 (tool use, web search, structured outputs, prompt caching)", icon: siClaude },
              { name: "Custom eval suites" },
            ],
          },
          {
            label: "Quality and delivery",
            items: [
              { name: "Vitest", icon: siVitest },
              { name: "Puppeteer", icon: siPuppeteer },
              { name: "Sentry", icon: siSentry },
              { name: "Vercel", icon: siVercel },
              { name: "GitHub", icon: siGithub },
            ],
          },
          {
            label: "Tools",
            items: [
              { name: "Figma", icon: siFigma },
              { name: "Claude Code", icon: siClaude },
            ],
          },
        ],
      },
      metrics: {
        note: "Baselines come from the first tester cohort. AI numbers come from the eval suites, run before every prompt or model change.",
        groups: [
          {
            title: "Now: is it working?",
            intro:
              "Signals that move within weeks, so I can act on them during the first tester cohort.",
            rows: [
              {
                metric: "Activation",
                definition: "Visitors who finish onboarding and get a plan",
                why: "Tests whether onboarding is short and clear enough",
                source: "Plans created vs visits",
              },
              {
                metric: "First task in week one",
                definition:
                  "New students who complete at least one task within 7 days",
                why: "Shows the plan turns into action, not just a list",
                source: "Completion dates",
              },
              {
                metric: "Week-4 retention",
                definition: "Students who complete a task in their fourth week",
                why: "A degree lasts years, so habit has to form early",
                source: "Completions by week",
              },
              {
                metric: "Calendar connection",
                definition: "Students who add their deadlines to a calendar",
                why: "Reminders outside the app protect deadlines",
                source: "Accounts with a calendar feed",
              },
              {
                metric: '"Not needed" rate by task',
                definition: "How often each task is marked not needed",
                why: "Content quality: a high rate means a task is shown to the wrong students",
                source: "Task statuses",
              },
              {
                metric: "Ask Reloco use",
                definition: "Students who ask at least one question in their first month",
                why: "Shows whether answers tied to the plan are worth coming back for",
                source: "AI usage log",
              },
              {
                metric: "Task tools used",
                definition: "Students who run a check or a comparison on a task that offers one",
                why: "Shows whether the tools save real work or get skipped",
                source: "Tool use per task",
              },
              {
                metric: "Documents saved",
                definition: "Students who save at least one document",
                why: "Trust: people only store a passport somewhere they believe is safe",
                source: "Documents per account",
              },
            ],
          },
          {
            title: "AI: is it right, safe and affordable?",
            intro:
              "Measured on every change, before students see it.",
            rows: [
              {
                metric: "Eval pass rate",
                definition: "Share of the 85 Ask Reloco cases answered correctly",
                why: "Catches a worse answer before it ships",
                source: "Ask eval suite",
              },
              {
                metric: "Safety failures",
                definition: "Cases where it should refer to ISSS, decline, or flag a scam and doesn't",
                why: "The one number that has to stay at zero",
                source: "Safety cases in the Ask eval",
              },
              {
                metric: "Document reading accuracy",
                definition: "Fields read correctly on specimen documents, and wrong documents refused",
                why: "A wrong date on a passport moves a whole plan",
                source: "Document eval suite",
              },
              {
                metric: "Cost per question",
                definition: "Model cost per answered question",
                why: "AI has to stay affordable at student scale",
                source: "Token usage per run",
              },
            ],
          },
          {
            title: "Over time: is it changing outcomes?",
            intro:
              "The reason Reloco exists. These take a semester or more to show up.",
            rows: [
              {
                metric: "On-time rate",
                northStar: true,
                definition:
                  "Completed tasks finished by their due date ÷ all completed tasks",
                why: "The core promise: no missed deadlines",
                source: "Completion date vs due date",
              },
              {
                metric: "Pre-arrival readiness",
                definition:
                  "Share of a freshman's Pre-flight tasks done before landing day",
                why: "The border is the highest-stakes moment of year one",
                source: "Task status vs arrival date",
              },
              {
                metric: "Return each semester",
                definition:
                  "Students active again at the start of each new semester",
                why: "Yearly tasks only help if students come back for them",
                source: "Activity by semester",
              },
              {
                metric: "OPT filed in window",
                definition:
                  'Graduating students who complete "File your I-765" before its window closes',
                why: "The highest-stakes deadline of the degree",
                source: "Task completion vs window end",
              },
            ],
          },
        ],
      },
      timeline: [
        {
          phase: "v0",
          status: "Completed",
          text: "Interviews, personas, journey map, first concept.",
        },
        {
          phase: "v1",
          status: "Completed",
          date: "September 2026",
          text: "Live at reloco.app: the plan, tasks, arrival mode, progress, sharing and calendar sync.",
        },
        {
          phase: "v2",
          status: "Completed",
          date: "September 2026",
          text: "Ask Reloco and Documents, after a security review and eval suites. Live at reloco.app.",
        },
        {
          phase: "v2.1",
          status: "Completed",
          date: "October 2026",
          text: "Task tools (the I-94, trip, STEM, CPT and immunization checks, the SSA visit plan, a lease explainer, the OPT unemployment counter and a health insurance helper), side-by-side comparisons, document upload at signup, and reporting a move. Live at reloco.app.",
        },
        {
          phase: "v2.2",
          status: "Completed",
          date: "October 2026",
          text: "An OPT application check (the student's own I-765 filing window, eligibility and what to send, with a STEM version) and a DMV visit plan for a first North Carolina driver's license. Live at reloco.app.",
        },
        {
          phase: "v2.3",
          status: "Completed",
          date: "October 2026",
          text: "A visa interview check (the passport, I-20, SEVIS fee receipt and DS-160 checked against each other, the interview timing, and what to do after a 221(g) or 214(b)), a second security review, error monitoring that strips personal data, and an in-app feedback form for the first testers. Live at reloco.app.",
        },
        {
          phase: "v3",
          status: "Planned",
          text: "A pilot with UNC ISSS.",
        },
        {
          phase: "Later",
          status: "Planned",
          text: "More schools on the school-pack layer.",
        },
      ],
      tryIt: {
        text: "Set it up as a freshman landing next month or a junior planning a summer internship, then ask it something. It takes about two minutes.",
        button: "Open reloco.app",
        url: "https://reloco.app",
      },
    },
  },
];

export const projectsIntro =
  "Things I build when nobody's assigning homework 🛠️";
