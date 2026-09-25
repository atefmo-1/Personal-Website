// Spaces before emojis are non-breaking (U+00A0); see the note in lib/site.ts.
export type Experience = {
  company: string;
  url: string;
  // One line on what the company does, from its own site.
  what: string;
  role: string;
  // Optional: what I worked on there, shown under the role.
  focus?: string;
  dates: string;
  location: string;
};

// Most recent first. Add a new role by adding an object to the top of this array.
export const experience: Experience[] = [
  {
    company: "Well",
    url: "https://www.well.co/",
    what: "Personalized health engagement for employers",
    role: "Product Manager Intern",
    focus: "AI Enablement & Automation",
    dates: "Summer 2026",
    location: "Chapel Hill, NC",
  },
  {
    company: "Ethos",
    url: "https://www.ethossystems.com/",
    what: "Readiness analytics for the U.S. military, pharma, and pro sports",
    role: "Product & Analytics Intern",
    focus: "Analytics",
    dates: "Summer 2025",
    location: "SF Bay Area, CA",
  },
  {
    company: "Center on Technology Policy",
    url: "https://techpolicy.unc.edu/",
    what: "UNC research center shaping public policy for a better internet",
    role: "Research Assistant",
    focus: "Design & Data Visualization Lead",
    dates: "Jul–Oct 2024",
    location: "Chapel Hill, NC",
  },
  {
    company: "MNIPL",
    url: "https://www.mnipl.org/",
    what: "Minnesota Interfaith Power & Light, a climate nonprofit",
    role: "Product Development Intern",
    dates: "Summer 2024",
    location: "Minneapolis, MN",
  },
];

// The work-focused bio at the top of the Work & Experience page.
export const workBio = [
  "Product is my home base, but I like working close to the data and the code. So far that's meant health tech 🩺, readiness analytics 📊, tech policy research 🏛️, and a climate nonprofit 🌱",
];
