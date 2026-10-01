"use client";

import { motion } from "framer-motion";
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

/** The bar that sits over every task page: steps left, then Skip. */
export function TaskBar({ label = "3 steps to go" }: { label?: string }) {
  return (
    <div className="absolute right-4 bottom-5 left-4 flex items-center gap-2 rounded-full p-1.5" style={{ background: "var(--r-surface)", boxShadow: "0 10px 30px -12px rgb(19 41 75 / 0.35)" }}>
      <div className="flex h-12 flex-1 items-center justify-between rounded-full pr-1.5 pl-5 text-[16px] font-semibold text-white" style={{ background: "#8f96a5" }}>
        {label}
        <span className="grid size-9 place-items-center rounded-full bg-white/25 text-white">
          <Check />
        </span>
      </div>
      <span className="px-3 text-[16px] font-semibold" style={{ color: "var(--r-ink)" }}>
        Skip
      </span>
    </div>
  );
}
