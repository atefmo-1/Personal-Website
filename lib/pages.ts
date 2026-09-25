// The site's pages, in nav order.
// `short` is the label used on phones, where the full titles don't fit in one row.
export const pages = [
  { href: "/", title: "Home" },
  { href: "/about", title: "About" },
  { href: "/experience", title: "Work & Experience", short: "Work" },
  { href: "/projects", title: "Projects" },
  { href: "/contact", title: "Contact" },
] as const;

export type PageHref = (typeof pages)[number]["href"];
