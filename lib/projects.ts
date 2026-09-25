// Spaces before emojis are non-breaking (U+00A0); see the note in lib/site.ts.
export type CaseStudy = {
  tagline: string;
  cover: { src: string; alt: string };
  meta: { label: string; value: string }[];
  problem: string[];
  process: { title: string; text: string }[];
  features: { title: string; text: string; image: string; alt: string }[];
  next: string[];
};

export type Project = {
  // URL segment for the project page: /projects/<slug>
  slug: string;
  name: string;
  status: string;
  blurb: string;
  tags: string[];
  // Card image, shown beside the text. Transparent images blend best with the card.
  image: string;
  // Projects with a case study get their own page, and their card links to it.
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "reloco",
    name: "Reloco",
    status: "Prototype",
    blurb:
      "A settling-in app for international students: next steps, documents, and budget in one place. Tested with 20+ students.",
    tags: ["Next.js", "Supabase", "AI recs"],
    image: "/projects/reloco/phones.svg",
    // Facts come from the resume. The screens are placeholder mockups (scripts/reloco-mockups.mjs);
    // swap in real screenshots when you have them. `next` is placeholder copy.
    caseStudy: {
      tagline:
        "A settling-in app for international students.",
      cover: {
        src: "/projects/reloco/cover.svg",
        alt: "Three Reloco screens: a document list, a first-30-days checklist, and a monthly budget",
      },
      meta: [
        { label: "Status", value: "Prototype" },
        { label: "My role", value: "Research, product, prototype" },
        { label: "Built with", value: "Next.js, Supabase, AI" },
        { label: "Tested with", value: "20+ international students" },
      ],
      problem: [
        "Moving to the US as a student means paperwork, a bank account, a phone plan, and a budget in a new currency. The info exists, but it's scattered everywhere.",
      ],
      process: [
        { title: "Listen", text: "User research with international students." },
        { title: "Scope", text: "Requirements for three core features." },
        { title: "Build", text: "A working prototype in Next.js and Supabase." },
        { title: "Test", text: "Tested with 20+ international students." },
      ],
      features: [
        {
          title: "A plan, not a pile",
          text: "AI suggests your next most useful step.",
          image: "/projects/reloco/next-up.svg",
          alt: "Reloco screen showing a first-30-days checklist with a recommended next step: open a bank account",
        },
        {
          title: "Every document in one place",
          text: "Passport, visa, I-20, and the rest, with a heads-up when something needs attention.",
          image: "/projects/reloco/documents.svg",
          alt: "Reloco documents screen listing a passport, visa, I-20, I-94, and health insurance card",
        },
        {
          title: "A budget that speaks student",
          text: "A monthly budget built for student life in a new country.",
          image: "/projects/reloco/budget.svg",
          alt: "Reloco budget screen showing money left this month and spending by category",
        },
      ],
      // DRAFT: placeholder plan.
      next: ["Folding in test feedback, then piloting with incoming students."],
    },
  },
];

export const projectsIntro = "Things I build when nobody's assigning homework 🛠️";
