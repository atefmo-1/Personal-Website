"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { useClock } from "./Stage";

// Pieces of Reloco's interface, redrawn for the motion graphics: each one appears, types or
// pops at a moment on the scene's clock, so a scene is a list of times.

export const ease = [0.22, 1, 0.36, 1] as const;
const pop = { type: "spring", stiffness: 520, damping: 30 } as const;

/** Mounts its children once the clock reaches `at`, animating in from `from`. */
type From = { opacity?: number; x?: number; y?: number; scale?: number };

export function At({ at, from = { opacity: 0, y: 12 }, className, style, children }: { at: number; from?: From; className?: string; style?: CSSProperties; children: ReactNode }) {
  const { t } = useClock();
  if (t < at) return null;
  return (
    <motion.div className={className} style={style} initial={from} animate={{ opacity: 1, y: 0, x: 0, scale: 1 }} transition={{ duration: 0.5, ease }}>
      {children}
    </motion.div>
  );
}

/** The whole scene fades at the end of the loop, so the restart isn't a hard cut. */
export function Scene({ children, className }: { children: ReactNode; className?: string }) {
  const { t, duration, reduced } = useClock();
  const ending = !reduced && t > duration - 450;
  return (
    <motion.div className={className} animate={{ opacity: ending ? 0 : 1 }} transition={{ duration: 0.4 }}>
      {children}
    </motion.div>
  );
}

export function Heading({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-1">
      <h2 className={`${relocoDisplay.className} text-[26px] leading-none`} style={{ color: "var(--r-ink)" }}>
        {children}
      </h2>
      {right}
    </div>
  );
}

export function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-[20px] ${className}`} style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)", ...style }}>
      {children}
    </div>
  );
}

/** Text that types itself from `at`, one character every `speed` ms. */
export function Typed({ text, at, speed = 70, placeholder = "" }: { text: string; at: number; speed?: number; placeholder?: string }) {
  const { t } = useClock();
  const n = t < at ? 0 : Math.min(text.length, Math.floor((t - at) / speed) + 1);
  if (n === 0) return <span style={{ color: "var(--r-ink-3)" }}>{placeholder}</span>;
  const typing = n < text.length;
  return (
    <span>
      {text.slice(0, n)}
      {typing && <motion.span aria-hidden className="ml-px inline-block h-[1.1em] w-[2px] translate-y-[0.2em]" style={{ background: "var(--r-ink)" }} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />}
    </span>
  );
}

/** How long `Typed` takes for `text`. */
export const typedFor = (text: string, speed = 70) => text.length * speed;

/** A fingertip: a soft ring that lands at `at` and fades. Place inside a relative parent. */
export function Tap({ at, x, y }: { at: number; x: number | string; y: number | string }) {
  const { t } = useClock();
  if (t < at - 120 || t > at + 700) return null;
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute z-10 size-9 rounded-full"
      // Centered with margins, not a translate: Motion's scale replaces any transform class.
      style={{ left: x, top: y, marginLeft: -18, marginTop: -18, background: "var(--r-leaf)" }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 0.45, 0], scale: [0.5, 1, 1.5] }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    />
  );
}

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 2v4M16 2v4M3 10h18" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
  </svg>
);

/** A date field as Reloco draws it: the label, then the value or a placeholder. Types from `at` when given. */
export function DateField({ label, value, at, className = "" }: { label: string; value: string; at?: number; className?: string }) {
  const { t } = useClock();
  const typingUntil = at === undefined ? -1 : at + typedFor(value);
  const focused = at !== undefined && t >= at - 150 && t < typingUntil + 350;
  return (
    <div className={`relative rounded-[14px] px-3.5 py-3 ${className}`} style={{ background: "var(--r-fill)", boxShadow: focused ? "0 0 0 2px var(--r-leaf)" : "none", transition: "box-shadow 200ms" }}>
      {at !== undefined && <Tap at={at - 150} x={64} y="62%" />}
      <p className="text-[13px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
        {label}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2 text-[20px] leading-tight" style={{ color: "var(--r-ink)" }}>
        <span className="min-w-0">{at === undefined ? value : <Typed text={value} at={at} placeholder="mm/dd/yyyy" />}</span>
        <span className="shrink-0" style={{ color: "var(--r-ink)" }}>
          <CalendarIcon />
        </span>
      </div>
    </div>
  );
}

const Check = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
const Alert = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3.5 2.5 20h19L12 3.5Z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
);
const Help = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01" />
  </svg>
);

/** A check's verdict: the icon pops in a beat after the row. */
export function Verdict({ ok, at }: { ok: boolean | null; at: number }) {
  const { t } = useClock();
  const look = ok === true ? { bg: "var(--r-leaf)", fg: "var(--r-ink)", Icon: Check } : ok === false ? { bg: "var(--r-gold-soft)", fg: "var(--r-gold-ink)", Icon: Alert } : { bg: "var(--r-fill)", fg: "var(--r-ink-2)", Icon: Help };
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full" style={{ background: look.bg, color: look.fg }}>
      {t >= at && (
        <motion.span className="grid place-items-center" initial={{ scale: 0, rotate: ok === true ? -30 : 0 }} animate={{ scale: 1, rotate: 0 }} transition={pop}>
          <look.Icon />
        </motion.span>
      )}
    </span>
  );
}

/** One row of a check list, as on Reloco's task tools. */
export function CheckRow({ ok, title, text, action, at, first, tapAt }: { ok: boolean | null; title: string; text: string; action?: string; at: number; first?: boolean; /** When a fingertip presses the action. */ tapAt?: number }) {
  const { t } = useClock();
  const pressed = tapAt !== undefined && t >= tapAt && t < tapAt + 220;
  return (
    <At at={at} from={{ opacity: 0, y: 8 }}>
      <div className="flex items-center gap-3.5 px-4 py-3.5" style={{ borderTop: first ? "none" : "1px solid var(--r-line)" }}>
        <Verdict ok={ok} at={at + 220} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
            {title}
          </p>
          <p className="text-[16px] leading-snug" style={{ color: "var(--r-ink)" }}>
            {text}
          </p>
        </div>
        {action && (
          <motion.span className="relative shrink-0 rounded-full px-4 py-2 text-[15px] font-semibold" style={{ background: pressed ? "var(--r-surface-2)" : "var(--r-fill)", color: "var(--r-leaf-ink)" }} animate={{ scale: pressed ? 0.92 : 1 }} transition={{ duration: 0.15 }}>
            {tapAt !== undefined && <Tap at={tapAt} x="50%" y="50%" />}
            {action}
          </motion.span>
        )}
      </div>
    </At>
  );
}

/* ───────────── The app's chrome ───────────── */

// Lucide icons (the app's set, lucide-react 1.48), copied as data so the site needn't depend on it.
type Node = [string, Record<string, string>][];
export const GLYPH = {
  sparkles: [["path", { d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" }], ["path", { d: "M20 2v4" }], ["path", { d: "M22 4h-4" }], ["circle", { cx: "4", cy: "20", r: "2" }]],
  map: [["path", { d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" }], ["path", { d: "M15 5.764v15" }], ["path", { d: "M9 3.236v15" }]],
  folderLock: [["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1" }], ["path", { d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5" }], ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2" }]],
  newspaper: [["path", { d: "M15 18h-5" }], ["path", { d: "M18 14h-8" }], ["path", { d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" }], ["rect", { width: "8", height: "4", x: "10", y: "6", rx: "1" }]],
  user: [["path", { d: "M17.925 20.056a6 6 0 0 0-11.851.001" }], ["circle", { cx: "12", cy: "11", r: "4" }], ["circle", { cx: "12", cy: "12", r: "10" }]],
  lifeBuoy: [["circle", { cx: "12", cy: "12", r: "10" }], ["path", { d: "m4.93 4.93 4.24 4.24" }], ["path", { d: "m14.83 9.17 4.24-4.24" }], ["path", { d: "m14.83 14.83 4.24 4.24" }], ["path", { d: "m9.17 14.83-4.24 4.24" }], ["circle", { cx: "12", cy: "12", r: "4" }]],
  arrowDown: [["path", { d: "M12 5v14" }], ["path", { d: "m19 12-7 7-7-7" }]],
  arrowRight: [["path", { d: "M5 12h14" }], ["path", { d: "m12 5 7 7-7 7" }]],
  check: [["path", { d: "M20 6 9 17l-5-5" }]],
  chevronRight: [["path", { d: "m9 18 6-6-6-6" }]],
  chevronDown: [["path", { d: "m6 9 6 6 6-6" }]],
  lock: [["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }], ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }]],
  clock: [["circle", { cx: "12", cy: "12", r: "10" }], ["path", { d: "M12 6v6l4 2" }]],
  search: [["path", { d: "m21 21-4.34-4.34" }], ["circle", { cx: "11", cy: "11", r: "8" }]],
  wrench: [["path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" }]],
  undo: [["path", { d: "M9 14 4 9l5-5" }], ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" }]],
  x: [["path", { d: "M18 6 6 18" }], ["path", { d: "m6 6 12 12" }]],
} satisfies Record<string, Node>;

export function Glyph({ node, size = 16, stroke = 2, style }: { node: Node; size?: number; stroke?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0, ...style }}>
      {node.map(([tag, attrs], i) => {
        const Tag = tag as "path";
        return <Tag key={i} {...attrs} />;
      })}
    </svg>
  );
}

/** The gold miles star, as the app draws it: Lucide's Sparkle, filled, sized to the text around it. */
export function MilesStar({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden style={{ display: "inline-block", width: "0.85em", height: "0.85em", verticalAlign: "-0.08em", flexShrink: 0, fill: "currentColor", stroke: "currentColor", strokeWidth: 2, strokeLinejoin: "round", ...style }}>
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
    </svg>
  );
}

/** The phone header on every app screen: the "reloco" wordmark, and Help in a quiet pill. */
export function AppHeader({ className = "" }: { className?: string }) {
  return (
    <header className={`flex h-14 items-center justify-between px-5 ${className}`}>
      <span className={`${relocoDisplay.className} text-[28px] leading-none`} style={{ color: "var(--r-ink)", letterSpacing: "-0.015em" }}>
        reloco
      </span>
      <span className="-mr-1 inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold" style={{ color: "var(--r-ink-2)", boxShadow: "inset 0 0 0 1px var(--r-line)" }}>
        <Glyph node={GLYPH.lifeBuoy} size={16} /> Help
      </span>
    </header>
  );
}

export type Tab = "Today" | "Journey" | "Docs" | "Updates" | "Profile";
const TABS: { label: Tab; icon: Node }[] = [
  { label: "Today", icon: GLYPH.sparkles },
  { label: "Journey", icon: GLYPH.map },
  { label: "Docs", icon: GLYPH.folderLock },
  { label: "Updates", icon: GLYPH.newspaper },
  { label: "Profile", icon: GLYPH.user },
];

/** The floating tab bar on phones: Night Navy glass, every label shown, the active tab a white pill (none on a page that isn't a tab). */
export function TabBar({ active }: { active?: Tab }) {
  return (
    <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center px-4">
      <ul
        className="flex h-[64px] w-full items-center gap-0.5 rounded-full p-1.5"
        style={{ background: "rgb(11 19 34 / 0.92)", boxShadow: "0 12px 40px -8px rgb(0 0 0 / 0.45), 0 0 0 1px rgb(255 255 255 / 0.1)", backdropFilter: "blur(24px)" }}
      >
        {TABS.map((tab) => {
          const on = tab.label === active;
          return (
            <li
              key={tab.label}
              className="flex h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full"
              style={{ background: on ? "#ffffff" : "transparent", color: on ? "#0b1322" : "rgb(255 255 255 / 0.65)" }}
            >
              <Glyph node={tab.icon} size={20} stroke={2.2} />
              <span className="max-w-full truncate px-0.5 text-[12px] leading-none font-semibold">{tab.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The bar that floats over every task page. Until every step is ticked it says which step is next
 * ("Next: step 2 of 4", an arrow-down disc), then it turns into "Mark done" (with its miles on an
 * everyday task) and a check disc. Beside it, "Skip", or "Doesn't apply" on a task that only
 * applies sometimes (a trip, a move). Status-critical tasks pass no miles.
 */
export function TaskBar({ next = 1, of = 3, ready = false, miles, optional = false, tapAt }: { next?: number; of?: number; ready?: boolean; miles?: number; optional?: boolean; /** When a fingertip presses Mark done. */ tapAt?: number }) {
  const { t } = useClock();
  const pressed = tapAt !== undefined && t >= tapAt && t < tapAt + 200;
  const label = ready ? "done" : `next-${next}`;
  return (
    <div className="absolute inset-x-3 bottom-3 z-20 flex items-center gap-1.5 rounded-full p-1.5" style={{ background: "rgb(255 251 244 / 0.85)", boxShadow: "var(--r-shadow-float), inset 0 0 0 1px var(--r-line)", backdropFilter: "blur(24px)" }}>
      <motion.div
        className="relative flex h-[52px] min-w-0 flex-1 items-center justify-between overflow-hidden rounded-full pr-1.5 pl-6 text-[16px] font-semibold"
        style={{
          background: ready ? "var(--r-primary)" : "var(--r-surface)",
          color: ready ? "var(--r-on-primary)" : "var(--r-ink)",
          boxShadow: ready ? "none" : "inset 0 0 0 1px var(--r-line)",
          transition: "background 300ms, color 300ms, box-shadow 300ms",
        }}
        initial={false}
        animate={{ scale: pressed ? 0.97 : ready ? [1, 1.03, 1] : 1 }}
        transition={{ duration: pressed ? 0.15 : 0.5 }}
      >
        {tapAt !== undefined && <Tap at={tapAt} x="50%" y="50%" />}
        <span className="relative h-6 min-w-0 flex-1">
          <AnimatePresence initial={false}>
            <motion.span key={label} className="absolute inset-0 whitespace-nowrap" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.32, ease }}>
              {ready ? (
                <>
                  Mark done{" "}
                  {miles !== undefined && (
                    <span style={{ color: "var(--r-on-primary-accent)" }}>
                      <MilesStar /> +{miles}
                    </span>
                  )}
                </>
              ) : (
                `Next: step ${next} of ${of}`
              )}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="grid size-10 shrink-0 place-items-center rounded-full" style={{ background: ready ? "var(--r-leaf)" : "var(--r-fill)", color: ready ? "#13294b" : "var(--r-ink)", transition: "background 300ms, color 300ms" }}>
          {ready ? <Glyph node={GLYPH.check} size={20} stroke={2.8} /> : <Glyph node={GLYPH.arrowDown} size={20} stroke={2.4} />}
        </span>
      </motion.div>
      <span className="flex h-[52px] shrink-0 items-center px-4 text-[14px] font-semibold" style={{ color: "var(--r-ink-2)" }}>
        {optional ? "Doesn’t apply" : "Skip"}
      </span>
    </div>
  );
}
