// Picks a logo color per theme: the brand's own color when it's visible enough on that
// theme's background, otherwise the site's text color (so black logos like Next.js or Vercel
// don't vanish in dark mode, and very light ones don't vanish in light mode).

const BG = { light: "#F6F5F2", dark: "#0B0B0C" }; // keep in sync with --bg in app/globals.css
const MIN_CONTRAST = 2; // logos are large, simple shapes; 2:1 keeps them clearly visible

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export type ThemeColors = { light: string; dark: string };

export function brandColors(hex: string): ThemeColors {
  const c = hex.startsWith("#") ? hex : `#${hex}`;
  return {
    light: contrast(c, BG.light) >= MIN_CONTRAST ? c : "currentColor",
    dark: contrast(c, BG.dark) >= MIN_CONTRAST ? c : "currentColor",
  };
}

// Style props for an element with the `brand` class (see app/globals.css).
export function brandStyle(colors: ThemeColors) {
  return { "--brand-light": colors.light, "--brand-dark": colors.dark } as React.CSSProperties;
}
