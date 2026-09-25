// Draws placeholder app screens for the Reloco case study: three phone mockups plus a wide cover.
// Swap them for real screenshots whenever you have them (same file names, or update lib/projects.ts).
// Usage: node scripts/reloco-mockups.mjs public/projects/reloco
import { mkdirSync, writeFileSync } from "node:fs";
import { facets, svg } from "./art-lib.mjs";

const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });

const C = {
  phone: "#0E1116",
  screen: "#F7F4EE",
  ink: "#1B2430",
  muted: "#7A8594",
  line: "#E4DED3",
  slate: "#2F4760",
  slateSoft: "#DCE3EA",
  sand: "#E8DECF",
};
const FONT = "Inter, -apple-system, 'Segoe UI', Roboto, sans-serif";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const text = (x, y, s, { size = 13, weight = 400, fill = C.ink, anchor = "start", spacing = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${spacing ? ` letter-spacing="${spacing}"` : ""}>${esc(s)}</text>`;
const rect = (x, y, w, h, fill, rx = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const check = (cx, cy, done) =>
  done
    ? `<circle cx="${cx}" cy="${cy}" r="10" fill="${C.slate}"/><path d="M${cx - 4.5} ${cy} l3 3 l6 -6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<circle cx="${cx}" cy="${cy}" r="9.5" fill="none" stroke="${C.muted}" stroke-width="1.5"/>`;
const sparkle = (cx, cy, r, fill) =>
  `<path d="M${cx} ${cy - r} Q${cx + r * 0.18} ${cy - r * 0.18} ${cx + r} ${cy} Q${cx + r * 0.18} ${cy + r * 0.18} ${cx} ${cy + r} Q${cx - r * 0.18} ${cy + r * 0.18} ${cx - r} ${cy} Q${cx - r * 0.18} ${cy - r * 0.18} ${cx} ${cy - r}Z" fill="${fill}"/>`;

// Phone drawn at the origin, 300 x 680. Screen content uses x from 32 to 268.
const X = 32, W = 236;
function phone(content, active) {
  const tabs = [0, 1, 2, 3].map((i) => {
    const cx = 62 + i * 59;
    return i === active
      ? rect(cx - 14, 616, 28, 6, C.slate, 3)
      : rect(cx - 5, 616, 10, 6, C.line, 3);
  });
  return (
    rect(0, 0, 300, 680, C.phone, 46) +
    rect(12, 12, 276, 656, C.screen, 35) +
    rect(110, 22, 80, 24, C.phone, 12) +
    text(44, 42, "9:41", { size: 13, weight: 600 }) +
    rect(236, 32, 22, 11, "none", 3, `stroke="${C.ink}" stroke-width="1.4"`) + rect(238.5, 34.5, 14, 6, C.ink, 1.5) +
    text(X, 84, "RELOCO", { size: 11, weight: 700, fill: C.muted, spacing: 1.6 }) +
    content +
    rect(12, 596, 276, 1, C.line) +
    tabs.join("") +
    rect(115, 650, 70, 5, C.ink, 2.5)
  );
}

// 1. AI recommendations: what to do next.
const nextUp = () => {
  const tasks = [
    ["Check your I-94 record", true],
    ["Get a US phone number", true],
    ["Set up health insurance", true],
    ["Get your campus ID", false],
    ["Apply for an SSN", false],
  ];
  return phone(
    text(X, 116, "Your first 30 days", { size: 22, weight: 700 }) +
      text(X, 140, "3 of 8 done", { size: 12.5, fill: C.muted }) +
      rect(X, 152, W, 7, C.line, 3.5) + rect(X, 152, W * (3 / 8), 7, C.slate, 3.5) +
      rect(X, 178, W, 116, C.slate, 18) +
      sparkle(X + 22, 202, 7, C.sand) +
      text(X + 36, 206, "RECOMMENDED NEXT", { size: 10.5, weight: 700, fill: C.sand, spacing: 1.2 }) +
      text(X + 16, 238, "Open a bank account", { size: 17, weight: 700, fill: "#fff" }) +
      text(X + 16, 260, "Bring your passport and I-20.", { size: 12.5, fill: "#C9D3DE" }) +
      text(X + 16, 279, "About 30 minutes", { size: 12.5, fill: "#C9D3DE" }) +
      tasks
        .map(([t, done], i) => {
          const y = 330 + i * 50;
          return check(X + 10, y, done) +
            text(X + 32, y + 4.5, t, { size: 14, weight: done ? 400 : 600, fill: done ? C.muted : C.ink }) +
            (i < tasks.length - 1 ? rect(X + 32, y + 25, W - 32, 1, C.line) : "");
        })
        .join(""),
    0,
  );
};

// 2. Document management: everything in one place, with what needs attention.
const documents = () => {
  const docs = [
    ["Passport", "Expires Mar 2031", ""],
    ["F-1 visa", "Expires Aug 2027", ""],
    ["I-20", "Signature needed", "Soon"],
    ["I-94", "Saved Aug 14", ""],
    ["Health insurance", "Saved Aug 20", ""],
  ];
  return phone(
    text(X, 116, "Documents", { size: 22, weight: 700 }) +
      text(X, 140, "5 saved, 1 needs attention", { size: 12.5, fill: C.muted }) +
      docs
        .map(([name, sub, badge], i) => {
          const y = 162 + i * 72;
          return rect(X, y, W, 62, "#fff", 14, `stroke="${C.line}"`) +
            rect(X + 12, y + 13, 36, 36, badge ? C.sand : C.slateSoft, 10) +
            `<path d="M${X + 23} ${y + 21} h10 l6 6 v14 h-16 z" fill="none" stroke="${C.slate}" stroke-width="1.6" stroke-linejoin="round"/>` +
            text(X + 60, y + 28, name, { size: 14.5, weight: 600 }) +
            text(X + 60, y + 46, sub, { size: 12, fill: badge ? C.slate : C.muted, weight: badge ? 600 : 400 }) +
            (badge ? rect(X + W - 50, y + 20, 40, 22, C.slate, 11) + text(X + W - 30, y + 35.5, badge, { size: 11, weight: 700, fill: "#fff", anchor: "middle" }) : "");
        })
        .join("") +
      rect(X, 532, W, 44, "none", 22, `stroke="${C.slate}" stroke-width="1.5" stroke-dasharray="5 5"`) +
      text(150, 559, "+ Add a document", { size: 13.5, weight: 600, fill: C.slate, anchor: "middle" }),
    1,
  );
};

// 3. Budget planning: a monthly budget in a new currency.
const budget = () => {
  const cats = [
    ["Rent", 950, 950],
    ["Groceries", 180, 320],
    ["Transport", 40, 90],
    ["Phone", 35, 35],
    ["Fun", 60, 150],
  ];
  return phone(
    text(X, 116, "September", { size: 22, weight: 700 }) +
      text(X, 140, "Monthly budget", { size: 12.5, fill: C.muted }) +
      text(X, 190, "$1,240", { size: 36, weight: 700 }) +
      text(X + 128, 190, "left this month", { size: 12.5, fill: C.muted }) +
      cats
        .map(([name, spent, limit], i) => {
          const y = 226 + i * 54;
          return text(X, y + 12, name, { size: 14, weight: 600 }) +
            text(X + W, y + 12, `$${spent} / $${limit}`, { size: 12.5, fill: C.muted, anchor: "end" }) +
            rect(X, y + 22, W, 8, C.line, 4) + rect(X, y + 22, W * (spent / limit), 8, spent === limit ? C.ink : C.slate, 4);
        })
        .join("") +
      rect(X, 504, W, 76, C.sand, 16) +
      sparkle(X + 20, 526, 6.5, C.slate) +
      text(X + 34, 530, "Tip", { size: 12.5, weight: 700, fill: C.slate }) +
      text(X + 16, 551, "Textbooks are cheaper used. Check", { size: 12.5, fill: C.ink }) +
      text(X + 16, 568, "the campus book exchange first.", { size: 12.5, fill: C.ink }),
    2,
  );
};

const shadow = `<defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity=".35"/></filter></defs>`;
const place = (content, x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})" filter="url(#s)">${content}</g>`;

// Feature images: 800 x 800, one phone centered on the faceted Reloco background.
const shots = { "next-up": nextUp, documents, budget };
Object.entries(shots).forEach(([name, draw], i) => {
  writeFileSync(`${OUT}/${name}.svg`, svg(shadow + facets(61 + i, "#1F2B38", "#6E86A0", 800, 800) + place(draw(), 250, 60), 800, 800));
  console.log(`wrote ${name}.svg`);
});

// Cover: 1600 x 900, all three phones.
writeFileSync(
  `${OUT}/cover.svg`,
  svg(
    shadow + facets(11, "#1F2B38", "#6E86A0", 1600, 900) +
      place(documents(), 330, 170, 0.92) + place(budget(), 1000, 170, 0.92) + place(nextUp(), 650, 90, 1),
    1600,
    900,
  ),
);
console.log("wrote cover.svg");

// Card image for /projects: the three phones on a transparent background, so the card itself
// can use the site's colors in either theme.
writeFileSync(
  `${OUT}/phones.svg`,
  svg(shadow + place(documents(), 90, 110, 0.82) + place(budget(), 830, 110, 0.82) + place(nextUp(), 450, 40, 0.95), 1200, 800),
);
console.log("wrote phones.svg");
