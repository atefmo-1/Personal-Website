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

// Every project page is written for a recruiter skimming for product judgment and engineering
// depth. Each case study answers, in order:
//   what it is and where to try it (tagline, glance, links, cover, meta, numbers)
//   why it matters (problem, framing)
//   where it started (v0: research, personas, journey)
//   how it works today (today), what it does with real screens (features, screens, gallery)
//   the calls I made (decisions), where AI fits (ai), what it's built with (stack)
//   where it's been and where it's going (timeline)
// Voice: first person, short sentences, specific. No em dashes. Keep every number and quote
// checkable against the project's code, data or interview notes.
// Optional sections are skipped on the page when a project leaves them out.
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
  // One-line summary under the hero, shown as separate segments.
  glance?: string[];
  links: { label: string; url: string }[];
  cover: { src: string; alt: string; width: number; height: number };
  meta: { label: string; value: string }[];
  numbers: { value: string; label: string }[];
  problem: string[];
  // The design question and user story that framed the work.
  framing?: { hmw: string; story: string };
  // Where the product started: research that shaped the first concept.
  v0?: {
    intro: string;
    insights: { title: string; quote: string; who: string; finding: string; response: string }[];
    personas: {
      intro: string;
      people: [Persona, Persona];
      // Where each persona sits between two poles, 0 (left) to 1 (right): [first, second].
      spectrum: { left: string; right: string; values: [number, number] }[];
      takeaway: string;
    };
    journey: {
      intro: string;
      // Each stage's feeling, 0 (low) to 1 (high), drives the emotional curve.
      stages: { name: string; doing: string; thinking: string; feeling: string; level: number }[];
      quote: string;
      flow: { title: string; steps: string[]; decision: string; yes: string[]; no: string[] };
      note: string;
    };
  };
  // The product as it ships: the main flow, with branches, and the principles behind it.
  today?: { intro: string; steps: { text: string; branch?: string }[]; principles: Titled[] };
  features: Titled[];
  // Phone screens shown side by side.
  screens: Shot[];
  // More screens, as square images.
  gallery?: Shot[];
  decisions: { product: Titled[]; engineering: Titled[] };
  ai?: { intro: string; built: Titled[]; next: Titled[] };
  stack: { label: string; items: Skill[] }[];
  // Oldest first. Leave `date` out until it's known; the page hides a missing date.
  timeline: { phase: string; status: "Completed" | "In progress" | "Planned"; date?: string; text: string }[];
  closing?: string;
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
      "A gamified roadmap that guides F-1 international students at UNC from their first flight to their first job. I researched, designed, built and shipped it on my own.",
    tags: ["Product design", "Full-stack", "Next.js", "Supabase", "EdTech"],
    live: { label: "reloco.app", url: "https://reloco.app" },
    image: "/projects/reloco/card.webp",
    // Sources: /Users/atefmo/reloco/RELOCO_PROJECT_BRIEF.md, the app's README and code (44 tasks and
    // 34 official links in src/lib/library/tasks.ts, 101 Vitest tests, repeating tasks under
    // "Every year", "After [task]" in components/today/focus-card.tsx), the interviews doc
    // "Atef - 3 interviews" and the Figma persona and journey files. Quotes are verbatim from the
    // two real interviews (Giang, Nana); interview 3 there is simulated, so it isn't used.
    // Screens: /Users/atefmo/reloco/portfolio-screenshots, plus demo-mode screens on Reloco's paintings.
    caseStudy: {
      tagline: "A gamified roadmap that takes F-1 students at UNC from their first flight to their first job.",
      glance: [
        "Research: 2 student interviews, 2 personas",
        "Build: solo, full stack, live at reloco.app",
        "44 sourced tasks, 101 tests",
      ],
      links: [{ label: "Try it at reloco.app", url: "https://reloco.app" }],
      cover: {
        src: "/projects/reloco/landing.webp",
        alt: "Reloco's landing page: a painting of UNC's Old Well at sunset with the headline From your first flight to your first job",
        width: 2000,
        height: 1157,
      },
      meta: [
        { label: "Role", value: "Solo: research, product, design, engineering" },
        { label: "Status", value: "Live at reloco.app" },
        { label: "Platform", value: "Mobile-first web app, light and dark" },
        { label: "For", value: "F-1 undergrads at UNC-Chapel Hill" },
      ],
      numbers: [
        { value: "44", label: "tasks in a researched rules library" },
        { value: "34", label: "official sources linked, from ISSS to the IRS" },
        { value: "9", label: "chapters, from Pre-flight to After graduation" },
        { value: "101", label: "automated tests on the roadmap engine" },
      ],
      problem: [
        "F-1 students manage dozens of rules over four years: SEVIS, the I-94, travel signatures, CPT, OPT, STEM OPT, Form 8843. The answers sit on separate UNC, IRS, USCIS and CBP pages. Miss one deadline and your status is at risk.",
        "I'm an international student at UNC. Every student I interviewed said the same thing: the information exists, but getting it in the right order depends on who you know.",
      ],
      framing: {
        hmw: "How might we help international students find trusted information about immigration, banking, healthcare and daily life, in one place and in the right order?",
        story: "As an international student, I want to find all information in one place, so that I save time.",
      },
      v0: {
        intro:
          "Reloco started with student interviews. I asked international students at UNC about their first weeks in the US: the SSN, banking and credit, taxes, work rules. These findings shaped the first concept.",
        insights: [
          {
            title: "Order is the hard part",
            quote: "I first had to find a job on campus.",
            who: "Junior from Vietnam, on getting an SSN",
            finding:
              "Her SSN took a campus job, then a letter from the employer, then a bus to the Social Security office in Durham. Nobody gave her the sequence.",
            response: "Tasks know their dependencies. A task that needs another first says \"After\" that task and links to it.",
          },
          {
            title: "It's out there, but scattered",
            quote: "It's all out there, but it's, like, all fragmented.",
            who: "Junior from London",
            finding:
              "She pieced it together by trial and error from ISSS pages, government sites and chatbots. The chatbots were often wrong. The sources they cited were right.",
            response: "Every step links to its official source: UNC ISSS, the IRS, USCIS or the SSA.",
          },
          {
            title: "Know-how travels by word of mouth",
            quote: "The people before me passed the knowledge to me.",
            who: "Junior from Vietnam",
            finding:
              "SSN steps, credit cards and driving tips came from upperclassmen and one patient banker. Students without that network were on their own.",
            response: "About 10 questions build the plan an upperclassman would give you, starting before the flight.",
          },
          {
            title: "Deadlines hide years ahead",
            quote: "You should be meeting with them like eight to twelve months in advance.",
            who: "Junior from London, on CPT approval",
            finding: "Internship work authorization needs the advisor involved months early. Most students learn that too late.",
            response: "The roadmap runs by class year through After graduation, and CPT comes back every spring.",
          },
        ],
        personas: {
          intro: "I turned the interviews into two personas. They sit at opposite ends of most scales, so a design had to work for both.",
          people: [
            {
              name: "Connected Khoa",
              archetype: "The community learner",
              basedOn: "Built from the interview with a junior from Vietnam",
              summary:
                "Learned US systems from upperclassmen and WhatsApp groups. Goes in person instead of searching online, and passes what he learns to newer students.",
              tags: ["Peer-dependent", "Guided by others", "Low frustration"],
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
            },
            {
              name: "Independent Amara",
              archetype: "The self-driven researcher",
              basedOn: "Built from the interview with a junior from London",
              summary:
                "Built her own plan from DHS pages, ISSS documents and AI chatbots, then checked each answer against the source. Knows the CPT and OPT rules in detail, and still double-checks everything.",
              tags: ["Proactive", "Self-reliant", "High frustration"],
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
            "Neither had a trusted path in the right order. Khoa needed the guidance his network gave him, without depending on luck. Amara needed sources she could check, without the hours of research.",
        },
        journey: {
          intro:
            "I mapped Amara's first week with the v0 concept. She tries to get her first credit card and learns she needs an SSN first.",
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
              doing: "Signs up and answers a few questions about her situation",
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
            title: "v0 concept: the first task flow",
            steps: ["Land on Reloco", "Sign up with Google", "Onboarding", "Roadmap generated", "Open a task"],
            decision: "Has an unfinished prerequisite?",
            yes: ["Locked: complete SSN first", "Do the SSN task", "Return, now unlocked"],
            no: ["Read the guide", "Mark complete", "Celebrate", "Next task suggested"],
          },
          note:
            "The v0 concept used phases, a Build credit task and a lock screen. The product has changed since. The next section shows how it works today.",
        },
      },
      today: {
        intro: "Guest mode comes first. You get a full roadmap before any sign-up.",
        steps: [
          { text: "Land on reloco.app and tap Get started" },
          { text: "Continue with Google, or try it without an account" },
          {
            text: "Answer about 10 questions: where you are (still at home, just arrived or already studying), home country, arrival, start and graduation dates, housing, funding, whether you have an SSN or bank account, and plans like an internship, a STEM major or driving",
          },
          { text: "Get a roadmap across 9 chapters, from Pre-flight to After graduation, organized by class year" },
          { text: "Today shows one next task", branch: "Current students start with their past tasks already checked off" },
          {
            text: "Work through the steps, each linked to its official source",
            branch: "If the task depends on another, the card says \"After\" that task and links to it",
          },
          { text: "Mark it complete, earn miles and fill a stamp" },
          { text: "The next task appears" },
        ],
        principles: [
          {
            title: "Hick's Law",
            text: "More choices slow people down. Today shows one next task instead of the whole list.",
          },
          {
            title: "Tesler's Law",
            text: "Immigration rules stay complex. The engine carries that complexity in dependencies and dates, so the student doesn't have to.",
          },
        ],
      },
      features: [
        {
          title: "One next task",
          text: "Today shows the one thing to do now. If it depends on another task, the card says so and links to it.",
        },
        {
          title: "Every step has a source",
          text: "Steps come with a time estimate, what to bring, and a link to the exact page at UNC ISSS, the IRS, USCIS or the SSA.",
        },
        {
          title: "The whole degree, by class year",
          text: "Nine chapters from Pre-flight to After graduation. Yearly tasks come back on schedule: full-time enrollment, summer address, the winter travel signature, tax forms, and CPT each spring.",
        },
        {
          title: "Calendar and sharing",
          text: "One tap adds the roadmap to Google, Apple or Outlook, and the calendar updates on its own when the roadmap changes. A read-only link lets family or a sponsor follow along.",
        },
        {
          title: "Rule changes",
          text: "Reloco tracks rule changes and says what still applies, like the 2026 DHS duration-of-status rule and its court pause.",
        },
        {
          title: "Miles and stamps",
          text: "Tasks earn miles, chapters fill passport stamps, and finishing earns a certificate. Change a date and the roadmap reschedules.",
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
            text: "v1 serves F-1 undergrads at UNC. In compliance, precision is the product, so I picked one school and got every office and deadline right.",
          },
          {
            title: "Guest mode first",
            text: "Students get a full roadmap before any sign-up. Google sign-in is optional and carries their progress over.",
          },
          {
            title: "Weekly streaks, not daily",
            text: "Visa and tax work comes in bursts. A daily streak would punish students with nothing due, so streaks are weekly and quiet weeks don't break them.",
          },
          {
            title: "Rules decide, AI assists",
            text: "Every date and task comes from a rule with a cited source. AI can explain, but it can't add, remove or move a task.",
          },
        ],
        engineering: [
          {
            title: "A deterministic roadmap engine",
            text: "A pure function turns a profile into a scheduled, dependency-ordered roadmap. 101 Vitest tests check invariants across student profiles, like never opening a task before its prerequisites. Modeling dependencies exposed a cycle: the campus job task required an SSN, but the SSN needs a job offer. I fixed the order in the library.",
          },
          {
            title: "Two stores, one interface",
            text: "Guests run on a cookie store with no database. When they sign in, the same Store interface moves their progress into Supabase Postgres.",
          },
          {
            title: "Privacy in the schema",
            text: "Row-level security on every table. The document scanner's output schema only has date fields, images are never stored, and students can delete everything.",
          },
          {
            title: "A calendar that stays current",
            text: "A live iCal feed for Google, Apple and Outlook that changes when the roadmap does. Email reminders run on a daily cron with one-click unsubscribe. They're built and ready to switch on.",
          },
        ],
      },
      ai: {
        intro:
          "In a high-stakes space, AI should explain and assist, never decide. The rules engine owns every date and task. AI works around it.",
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
      timeline: [
        {
          phase: "v0",
          status: "Completed",
          // TODO(Atef): add the month, e.g. "March 2026" (the interview recordings are dated March 13 to 14, 2026).
          text: "Research and concept: student interviews, personas, a journey map and the first task flow.",
        },
        {
          phase: "v1",
          status: "Completed",
          date: "September 2026",
          text: "Live at reloco.app. The rules engine with 44 sourced tasks across the whole degree, organized by class year. Guest mode, Google sign-in, calendar sync, share links, arrival mode and rule-change notices.",
        },
        {
          phase: "v1.1",
          status: "In progress",
          text: "AI that explains, never decides: Ask Reloco, which answers only from sourced tasks and UNC ISSS pages with a citation, and \"What does this mean?\" for emails from ISSS, the IRS or a landlord. The document scanner goes live.",
        },
        {
          phase: "v2",
          status: "Planned",
          text: "An OPT unemployment day counter, a travel check before trips home, and a pilot with UNC ISSS.",
        },
        {
          phase: "Later",
          status: "Planned",
          text: "More schools on top of the school-pack layer, which keeps each school's offices and deadlines separate from the core engine.",
        },
      ],
      closing: "The number I'm watching: how many students finish Pre-flight before they land.",
    },
  },
];

export const projectsIntro = "Things I build when nobody's assigning homework 🛠️";
