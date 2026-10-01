"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { useClock } from "./Stage";
import { At, Card, Scene, Tap, TaskBar, ease } from "./ui";

// The bank chooser on the "Open a bank account" task: five banks side by side, the rows that
// decide it for a student without an SSN marked "For you", a swipe through the options (the
// table scrolls sideways on a phone), then Details on Chase opens its full terms below.
// Every value is Reloco's own shortlist (src/lib/choices/data.ts), in the order it shows them.

const LABEL = 92; // px, the row labels on a phone
const COL = 129; // px, what the app's column math gives on a 390px screen: two columns and a peek
const END = LABEL + COL * 5 - 366; // px, scrolled to the last column

type Tone = "good" | "unclear";
type Cell = [short: string, tone?: Tone];

const ROWS = [
  { key: "noSsn", label: "Open without an SSN", forYou: true },
  { key: "branch", label: "Near campus", forYou: true },
  { key: "monthlyFee", label: "Monthly fee" },
  { key: "feeWaiver", label: "How to avoid the fee" },
] as const;

const BANKS: { name: string; cells: Record<(typeof ROWS)[number]["key"], Cell> }[] = [
  { name: "Chase Secure Banking", cells: { noSsn: ["Yes, at a branch", "good"], branch: ["Franklin St branch", "good"], monthlyFee: ["$4.95"], feeWaiver: ["Free if you’re 17 to 24"] } },
  { name: "Truist One Checking (student)", cells: { noSsn: ["Yes, at a branch", "good"], branch: ["Rosemary St branch", "good"], monthlyFee: ["$12"], feeWaiver: ["Free for students or under 25"] } },
  { name: "PNC Simple Checking", cells: { noSsn: ["Yes, in person", "good"], branch: ["Willow Dr, Carrboro"], monthlyFee: ["$5"], feeWaiver: ["Free under 25 or with direct deposit"] } },
  { name: "Bank of America Advantage SafeBalance", cells: { noSsn: ["Yes, by appointment", "good"], branch: ["ATM on Franklin St"], monthlyFee: ["$4.95"], feeWaiver: ["Free under 25 or with $500+ daily"] } },
  { name: "Wells Fargo Clear Access Banking", cells: { noSsn: ["Unclear: ask at the branch", "unclear"], branch: ["Franklin St branch", "good"], monthlyFee: ["$5"], feeWaiver: ["Free if you’re 13 to 24"] } },
];

// Chase in full, as its Details panel lists it.
const CHASE = [
  { label: "Open without an SSN", value: "Yes, at a branch: international students bring a photo ID like a passport and a second ID like a student ID or I-20" },
  { label: "Near campus", value: "A full branch at 133 W Franklin St" },
  { label: "Monthly fee", value: "$4.95" },
  { label: "How to avoid the fee", value: "Free if you’re 17 to 24, or with $250+ in electronic deposits a month" },
  { label: "Opening deposit", value: "None" },
  { label: "Zelle", value: "Yes" },
  { label: "International wires", value: "$15 to receive. Can’t send wires from this account" },
];

// The table fills in column by column, then a beat for the "For you" rows to register.
const FILL = 450;
const cellAt = (col: number, row: number) => FILL + 260 + col * 230 + row * 120;
const FOR_YOU = cellAt(1, 3) + 350;
const SWIPE = [FOR_YOU + 1100, FOR_YOU + 2500, FOR_YOU + 3900];
const DETAILS = SWIPE[2] + 1300;
const SCROLL = DETAILS + 350;
export const COMPARE_BANKS_MS = SCROLL + 4200;

const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const easeOut = (p: number) => 1 - (1 - p) ** 4;

/** A value on the scene's clock: starts at `from`, then eases to each [start, end, to] in turn. */
function track(t: number, from: number, keys: [number, number, number][], curve = easeInOut) {
  let v = from;
  for (const [a, b, to] of keys) {
    if (t <= a) return v;
    if (t < b) return v + (to - v) * curve((t - a) / (b - a));
    v = to;
  }
  return v;
}

/** How far the table has scrolled sideways: a flick to the 3rd and 4th banks, on to the last, then back. */
const scrollAt = (t: number) =>
  track(
    t,
    0,
    [
      [SWIPE[0], SWIPE[0] + 650, COL * 2],
      [SWIPE[1], SWIPE[1] + 650, END],
      [SWIPE[2], SWIPE[2] + 750, 0],
    ],
    easeOut,
  );

/** A fingertip that drags across, for a swipe. Place inside a relative parent. */
function Swipe({ at, from, to, y, ms = 420 }: { at: number; from: number; to: number; y: number; ms?: number }) {
  const { t } = useClock();
  if (t < at - 160 || t > at + ms + 320) return null;
  const p = Math.min(1, Math.max(0, (t - at) / ms));
  const fade = t < at ? (t - at + 160) / 160 : t > at + ms ? 1 - (t - at - ms) / 320 : 1;
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-30 size-9 rounded-full"
      style={{ left: from + (to - from) * easeInOut(p), top: y, transform: `translate(-50%, -50%) scale(${t < at ? 0.8 : 1 - 0.12 * p})`, background: "var(--r-leaf)", opacity: 0.45 * fade }}
    />
  );
}

const Svg = ({ size = 14, stroke = 2, className, style, children }: { size?: number; stroke?: number; className?: string; style?: CSSProperties; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden>
    {children}
  </svg>
);

/** Fades in at `at` but keeps its room from the start, so the table never reflows. */
function Reveal({ at, children, className }: { at: number; children: ReactNode; className?: string }) {
  const { t } = useClock();
  const on = t >= at;
  return (
    <motion.span className={className} initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 6 }} transition={{ duration: 0.45, ease }}>
      {children}
    </motion.span>
  );
}

function CellView({ cell, at }: { cell: Cell; at: number }) {
  const { t } = useClock();
  const [short, tone] = cell;
  return (
    <span className="flex gap-1.5 text-[14px] leading-snug" style={{ color: "var(--r-ink)" }}>
      {tone && (
        <motion.span className="mt-[3px] shrink-0" initial={false} animate={{ scale: t >= at + 160 ? 1 : 0, rotate: t >= at + 160 ? 0 : -30 }} transition={{ type: "spring", stiffness: 520, damping: 26 }}>
          {tone === "good" ? (
            <Svg stroke={3} style={{ color: "var(--r-leaf-ink)" }}>
              <path d="M20 6 9 17l-5-5" />
            </Svg>
          ) : (
            <Svg style={{ color: "var(--r-ink-3)" }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
            </Svg>
          )}
        </motion.span>
      )}
      <Reveal at={at}>{short}</Reveal>
    </span>
  );
}

const line = "1px solid var(--r-line)";
const stuck = { position: "sticky", left: 0, background: "var(--r-surface)", boxShadow: "1px 0 0 var(--r-line)" } as const;
const chosen = "rgb(225 238 248 / 0.6)"; // the app's bg-brand-soft/60

function Table() {
  const { t } = useClock();
  const scroller = useRef<HTMLDivElement>(null);
  const x = scrollAt(t);
  useLayoutEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = x;
  });
  const open = t >= DETAILS;

  return (
    <div className="relative">
      <div ref={scroller} className="overflow-hidden">
        <table className="table-fixed border-separate text-left" style={{ width: LABEL + COL * BANKS.length, borderSpacing: 0 }}>
          <thead>
            <tr>
              <th className="z-20" style={{ ...stuck, width: LABEL, minWidth: LABEL }} />
              {BANKS.map((b, c) => (
                <th key={b.name} className="p-0 align-bottom" style={{ width: COL, minWidth: COL, borderBottom: `2px solid ${open && c === 0 ? "var(--r-leaf)" : "transparent"}`, background: open && c === 0 ? "var(--r-leaf-soft)" : "transparent", transition: "background 300ms, border-color 300ms" }}>
                  <Reveal at={FILL + 120 + c * 230} className="block px-3 pt-3 pb-2">
                    <span className="line-clamp-3 text-[14px] leading-tight font-semibold" style={{ color: "var(--r-ink)" }}>
                      {b.name}
                    </span>
                  </Reveal>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.key}>
                <th scope="row" className="z-10 px-3 py-2.5 align-top text-[12px] leading-snug font-medium" style={{ ...stuck, borderTop: line, color: "var(--r-ink-2)" }}>
                  {r.label}
                  {"forYou" in r && (
                    <motion.span className="mt-0.5 block origin-left text-[11px] font-semibold" style={{ color: "var(--r-leaf-ink)" }} initial={false} animate={{ opacity: t >= FOR_YOU + i * 140 ? 1 : 0, scale: t >= FOR_YOU + i * 140 ? 1 : 0.6 }} transition={{ type: "spring", stiffness: 420, damping: 24 }}>
                      For you
                    </motion.span>
                  )}
                </th>
                {BANKS.map((b, c) => (
                  <td key={b.name} className="px-3 py-2.5 align-top" style={{ borderTop: line, background: open && c === 0 ? chosen : "transparent", transition: "background 300ms" }}>
                    <CellView cell={b.cells[r.key]} at={cellAt(c, i)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th className="z-10" style={{ ...stuck, borderTop: line }} />
              {BANKS.map((b, c) => {
                const on = open && c === 0;
                return (
                  <td key={b.name} className="px-2 py-2" style={{ borderTop: line, background: on ? chosen : "transparent", transition: "background 300ms" }}>
                    <Reveal at={cellAt(c, 3) + 200} className="block">
                      <motion.span
                        className="relative flex h-8 w-full items-center justify-center gap-1 rounded-full text-[13px] font-semibold"
                        style={on ? { background: "var(--r-primary)", color: "var(--r-on-primary)" } : { background: "var(--r-surface)", color: "var(--r-ink)", boxShadow: "inset 0 0 0 1px var(--r-line)" }}
                        animate={{ scale: c === 0 && t >= DETAILS - 60 && t < DETAILS + 160 ? 0.94 : 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        {c === 0 && <Tap at={DETAILS - 60} x="50%" y="50%" />}
                        {on ? (
                          <>
                            Shown below
                            <Svg>
                              <path d="M12 5v14M19 12l-7 7-7-7" />
                            </Svg>
                          </>
                        ) : (
                          "Details"
                        )}
                      </motion.span>
                    </Reveal>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
      <Swipe at={SWIPE[0]} from={300} to={150} y={250} />
      <Swipe at={SWIPE[1]} from={310} to={190} y={250} ms={380} />
      <Swipe at={SWIPE[2]} from={130} to={320} y={250} ms={480} />
    </div>
  );
}

const ArrowUpRight = () => (
  <Svg size={12}>
    <path d="M7 7h10v10M7 17 17 7" />
  </Svg>
);

/** Chase's full terms, below the table, each one linked to the page it was read from. */
function Details() {
  return (
    <motion.div className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.6, ease }}>
      <Card className="mt-2.5 overflow-hidden">
        <div className="relative px-4 pt-3.5">
          <span className="absolute top-2.5 right-2.5 grid size-8 place-items-center" style={{ color: "var(--r-ink-2)" }}>
            <Svg size={16}>
              <path d="M18 6 6 18M6 6l12 12" />
            </Svg>
          </span>
          <p className="text-[12px] font-semibold" style={{ color: "var(--r-leaf-ink)" }}>
            Details
          </p>
          <h3 className="pr-8 text-[17px] leading-tight font-semibold">Chase Secure Banking</h3>
          <p className="mt-1 text-[14px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
            The only full branch on Franklin Street.
          </p>
        </div>
        <dl className="mt-2.5">
          {CHASE.map((f, i) => (
            <At key={f.label} at={DETAILS + 250 + i * 110} from={{ opacity: 0, y: 8 }}>
              <div className="px-4 py-2.5" style={{ borderTop: line }}>
                <dt className="text-[12px] font-medium" style={{ color: "var(--r-ink-2)" }}>
                  {f.label}
                </dt>
                <dd className="mt-0.5 text-[14px] leading-snug">
                  {f.value}
                  <span className="ml-1.5 inline-flex items-center gap-0.5 text-[12px] font-semibold whitespace-nowrap" style={{ color: "var(--r-leaf-ink)" }}>
                    Source <ArrowUpRight />
                  </span>
                </dd>
              </div>
            </At>
          ))}
        </dl>
        <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderTop: line }}>
          <p className="text-[12px] leading-snug" style={{ color: "var(--r-ink-3)" }}>
            Checked Oct 1, 2026 on their site. Not sponsored.
          </p>
          <span className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-semibold" style={{ background: "var(--r-surface)", boxShadow: "inset 0 0 0 1px var(--r-line)" }}>
            Their site <ArrowUpRight />
          </span>
        </div>
      </Card>
    </motion.div>
  );
}

function Chevrons() {
  const { t } = useClock();
  const x = scrollAt(t);
  const button = (enabled: boolean, d: string) => (
    <span className="grid size-9 place-items-center rounded-full" style={{ background: "var(--r-surface)", boxShadow: "inset 0 0 0 1px var(--r-line)", opacity: enabled ? 1 : 0.35, transition: "opacity 250ms" }}>
      <Svg size={16}>
        <path d={d} />
      </Svg>
    </span>
  );
  return (
    <div className="flex shrink-0 gap-1.5">
      {button(x > 4, "m15 18-6-6 6-6")}
      {button(x < END - 4, "m9 18 6-6-6-6")}
    </div>
  );
}

const FileText = () => (
  <Svg size={14}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
  </Svg>
);

function CompareBanks() {
  const { t } = useClock();
  // The page follows the panel down, like the app's scroll into view, stopping where the table and the panel's first terms share the screen.
  const y = track(t, 0, [[SCROLL, SCROLL + 1100, 100]]);
  return (
    <Scene className="h-full overflow-hidden">
      <div className="px-3 pt-9" style={{ transform: `translateY(${-y}px)` }}>
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <h2 className={`${relocoDisplay.className} text-[26px] leading-none`}>Compare banks</h2>
            <p className="mt-1.5 text-[13px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
              5 checked on their own sites on Oct 1, 2026. None pay Reloco.
            </p>
          </div>
          <Chevrons />
        </div>

        <At at={FILL} from={{ opacity: 0, y: 14 }}>
          <Card className="mt-2.5 overflow-hidden">
            <Table />
            <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-[13px] leading-snug" style={{ borderTop: line }}>
              <span className="font-semibold">Show all rows (2 more)</span>
              <span className="inline-flex items-center gap-1 font-semibold" style={{ color: "var(--r-leaf-ink)" }}>
                <Svg>
                  <path d="M5 12h14M12 5v14" />
                </Svg>
                Add one you found
              </span>
            </div>
          </Card>
        </At>

        {t >= DETAILS + 120 && <Details />}

        <At at={FOR_YOU} from={{ opacity: 0 }}>
          <p className="mt-3 px-1 text-[12px] leading-snug" style={{ color: "var(--r-ink-3)" }}>
            No SSN yet? You can add it to the account once you have one. Fees change, so confirm on their site before you choose. This isn’t financial advice.
          </p>

          <h2 className={`${relocoDisplay.className} mt-8 mb-2.5 px-1 text-[26px] leading-none`}>Bring</h2>
          <Card className="overflow-hidden">
            {["Passport", "I-20"].map((d, i) => (
              <div key={d} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: i ? line : "none" }}>
                <span className="grid size-7 shrink-0 place-items-center rounded-full" style={{ background: "var(--r-fill)", color: "var(--r-ink-2)" }}>
                  <FileText />
                </span>
                <div>
                  <p className="text-[15px] leading-tight font-semibold">{d}</p>
                  <p className="mt-0.5 text-[13px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
                    Not stored in Reloco. Have your own copy ready.
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </At>
      </div>
      <TaskBar label="5 steps to go" />
    </Scene>
  );
}

export const scene = { Scene: CompareBanks, duration: COMPARE_BANKS_MS };
