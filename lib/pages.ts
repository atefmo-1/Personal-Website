// The site's pages, in nav order.
// `short` is the label used on phones, where the full titles don't fit in one row.
// Projects is hidden until Reloco is ready. Flip this to true to bring back the tab and its pages.
export const showProjects = true;

const allPages = [
  { href: "/", title: "Home" },
  { href: "/experience", title: "Work & Experience", short: "Work" },
  { href: "/projects", title: "Projects" },
  { href: "/about", title: "About" },
  { href: "/contact", title: "Contact" },
] as const;

export const pages = allPages.filter((p) => showProjects || p.href !== "/projects");

export type PageHref = (typeof allPages)[number]["href"];
