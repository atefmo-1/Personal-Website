import { siSamsung } from "simple-icons";

// Logos for the Education rows. Imported only by server components (components/RoleRows.tsx),
// so the simple-icons package never reaches the browser bundle.
//
// PNGs: official files from each school's site (UNC cropped to the Old Well, ALA's shield mark),
// drawn as masks so they take the text color. Samsung: the wordmark from Simple Icons
// (CC0), cropped to the letters' measured bounds.
//
// All drawn in the site's text color, so they match each other and both themes.
export type Logo =
  | { kind: "mask"; src: string; aspect: number }
  | { kind: "svg"; path: string; viewBox: string; aspect: number };

export const logos = {
  unc: { kind: "mask", src: "/logos/unc-well.png", aspect: 96 / 138 },
  ala: { kind: "mask", src: "/logos/ala-shield.png", aspect: 256 / 251 },
  samsung: {
    kind: "svg",
    path: siSamsung.path,
    viewBox: "0 10.166 24 3.668",
    aspect: 24 / 3.668,
  },
} satisfies Record<string, Logo>;

export type LogoKey = keyof typeof logos;
