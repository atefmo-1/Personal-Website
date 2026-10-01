"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { createElement, useId, type CSSProperties, type ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { useClock } from "./Stage";
import { Scene, Tap } from "./ui";

// Every year, on schedule: Journey for a sophomore, scrolling down the class years. The same
// yearly tasks come back as dated copies in each year's chapter (winter travel signature, tax
// forms, CPT for the summer, full-time enrollment, a summer move), and each copy's year rolls
// on as its chapter opens. Rows, dates and miles are what the app builds for an invented
// student who started in Aug 2024 and graduates May 13, 2028, seen on Oct 1, 2025.
//
// The Journey and Today pieces below are shared with the Landing and Opt scenes.

/* ───────────── Shared pieces of Reloco's interface ───────────── */

/** 0 to 1 as the clock moves from `a` to `a + d`, eased. */
export const span = (t: number, a: number, d: number) => Math.min(1, Math.max(0, (t - a) / d));
export const outQuint = (p: number) => 1 - (1 - p) ** 5;
export const inOutCubic = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);

/** A value that glides between keyframes [time, value] on the clock. */
export function glide(t: number, keys: [number, number][], dur = 900, curve = inOutCubic) {
  let v = keys[0][1];
  for (const [at, to] of keys.slice(1)) {
    if (t <= at) break;
    v += (to - v) * curve(span(t, at, dur));
  }
  return v;
}

/** The app's display face: one weight, never synthesized bold, set a touch tight. */
export const display = relocoDisplay.className;
export const tight: CSSProperties = { letterSpacing: "-0.015em", fontSynthesis: "none" };

// Lucide icons (the app's set), as data so the site needn't depend on lucide.
type Node = [string, Record<string, string | number>][];
export const I = {
  stamp: [["path", { d: "M5 22h14" }], ["path", { d: "M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z" }], ["path", { d: "M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3c-1.69 0-3 1-3 3s1 2 1 3.5V13" }]],
  receipt: [["path", { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }], ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }], ["path", { d: "M12 17.5v-11" }]],
  briefcase: [["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }], ["rect", { width: 20, height: 14, x: 2, y: 6, rx: 2 }]],
  house: [["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }], ["path", { d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }]],
  cap: [["path", { d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" }], ["path", { d: "M22 10v6" }], ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5" }]],
  phone: [["rect", { width: 14, height: 20, x: 5, y: 2, rx: 2, ry: 2 }], ["path", { d: "M12 18h.01" }]],
  heart: [["path", { d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" }], ["path", { d: "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" }]],
  arrowRight: [["path", { d: "M5 12h14" }], ["path", { d: "m12 5 7 7-7 7" }]],
  check: [["path", { d: "M20 6 9 17l-5-5" }]],
  minus: [["path", { d: "M5 12h14" }]],
  chevronDown: [["path", { d: "m6 9 6 6 6-6" }]],
  clock: [["circle", { cx: 12, cy: 12, r: 10 }], ["path", { d: "M12 6v6l4 2" }]],
  flame: [["path", { d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" }]],
  sparkles: [["path", { d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" }], ["path", { d: "M20 2v4" }], ["path", { d: "M22 4h-4" }], ["circle", { cx: 4, cy: 20, r: 2 }]],
  map: [["path", { d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" }], ["path", { d: "M15 5.764v15" }], ["path", { d: "M9 3.236v15" }]],
  folderLock: [["rect", { width: 8, height: 5, x: 14, y: 17, rx: 1 }], ["path", { d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5" }], ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2" }]],
  user: [["path", { d: "M18 20a6 6 0 0 0-12 0" }], ["circle", { cx: 12, cy: 10, r: 4 }], ["circle", { cx: 12, cy: 12, r: 10 }]],
  plus: [["path", { d: "M5 12h14" }], ["path", { d: "M12 5v14" }]],
  trash: [["path", { d: "M10 11v6" }], ["path", { d: "M14 11v6" }], ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }], ["path", { d: "M3 6h18" }], ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]],
  // Stamp glyphs, one per chapter.
  bookOpen: [["path", { d: "M12 7v14" }], ["path", { d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" }]],
  award: [["path", { d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" }], ["circle", { cx: 12, cy: 8, r: 6 }]],
  rocket: [["path", { d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" }], ["path", { d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" }], ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" }], ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" }]],
} satisfies Record<string, Node>;

export function Icon({ node, size = 16, stroke = 2, className, style }: { node: Node; size?: number; stroke?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className} style={{ flexShrink: 0, ...style }}>
      {node.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}

/** The lock on a waiting task. `open` lifts the shackle, for the moment a task unlocks. */
export function LockIcon({ open = 0, size = 12 }: { open?: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" style={{ transform: `translateY(${-3 * open}px)`, transition: "transform 250ms" }} />
    </svg>
  );
}

// Category marks in passport ink, as in the app's IconTile (light theme values).
export type Category = "immigration" | "taxes" | "employment" | "campus" | "housing" | "technology" | "health";
export const CAT: Record<Category, { ink: string; icon: Node; short: string }> = {
  immigration: { ink: "#2f5f8f", icon: I.stamp, short: "Immigration" },
  taxes: { ink: "#9a7428", icon: I.receipt, short: "Taxes" },
  employment: { ink: "#2f7d78", icon: I.briefcase, short: "Work" },
  campus: { ink: "#4e86b8", icon: I.cap, short: "Campus" },
  housing: { ink: "#b5553a", icon: I.house, short: "Housing" },
  technology: { ink: "#5b6068", icon: I.phone, short: "Tech" },
  health: { ink: "#b8434b", icon: I.heart, short: "Health" },
};

export function IconTile({ category, faded = false }: { category: Category; faded?: boolean }) {
  const { ink, icon } = CAT[category];
  return (
    <span
      className="relative inline-grid size-8 shrink-0 place-items-center rounded-full"
      style={{
        color: ink,
        background: `color-mix(in oklab, ${ink} 13%, var(--r-surface))`,
        boxShadow: `inset 0 0 0 1.5px ${ink}, inset 0 0 0 3.5px var(--r-surface), inset 0 0 0 4.5px color-mix(in oklab, ${ink} 45%, transparent)`,
        opacity: faded ? 0.45 : 1,
        filter: faded ? "saturate(0.5)" : "none",
        transition: "opacity 300ms, filter 300ms",
      }}
    >
      <Icon node={icon} size={15} />
    </span>
  );
}

const pop = { type: "spring", stiffness: 520, damping: 26 } as const;

export interface Row {
  title: ReactNode;
  category: Category;
  due: string;
  tone?: "urgent" | "soon" | "later";
  miles: number;
  done?: boolean;
  skipped?: boolean;
  /** 1 while waiting on an earlier task; eases to 0 as it unlocks. */
  locked?: number;
}

/** One row in an inset list, as the app's TaskRow: icon, title, due, chevron. */
export function TaskRow({ row, last = false, style }: { row: Row; last?: boolean; style?: CSSProperties }) {
  const { title, category, due, tone = "later", miles, done, skipped, locked = 0 } = row;
  const dueColor = tone === "urgent" ? "var(--r-urgent-ink)" : tone === "soon" ? "var(--r-leaf-ink)" : "var(--r-ink-2)";
  return (
    <div className="flex min-h-[58px] items-center gap-3 px-3.5" style={style}>
      <span className="relative shrink-0">
        <IconTile category={category} faded={done} />
        <AnimatePresence>
          {done && (
            <motion.span
              className="absolute -right-1 -bottom-1 grid size-[18px] place-items-center rounded-full text-white"
              style={{ background: skipped ? "var(--r-ink-3)" : "var(--r-success)", boxShadow: "0 0 0 2px var(--r-surface)" }}
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={pop}
            >
              <Icon node={skipped ? I.minus : I.check} size={12} stroke={3.2} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="flex min-w-0 flex-1 flex-col py-2.5" style={{ borderBottom: last ? "none" : "1px solid var(--r-line)" }}>
        <span
          className="truncate text-[15px] leading-tight font-semibold"
          style={{ color: done ? "var(--r-ink-2)" : "var(--r-ink)", textDecorationLine: done ? "line-through" : "none", textDecorationColor: "var(--r-ink-3)" }}
        >
          {title}
        </span>
        <span className="mt-0.5 flex items-center text-[13px] whitespace-nowrap" style={{ color: done ? "var(--r-ink-2)" : dueColor, fontWeight: tone === "urgent" ? 600 : tone === "soon" ? 500 : 400 }}>
          {!done && locked > 0 && (
            <span className="inline-flex items-center overflow-hidden font-semibold" style={{ color: "var(--r-ink-2)", maxWidth: 80 * Math.min(1, locked * 1.6), opacity: locked }}>
              <LockIcon open={1 - Math.min(1, locked * 1.6)} />
              <span className="ml-0.5">Locked ·&nbsp;</span>
            </span>
          )}
          {done ? (skipped ? "Not needed" : "Done") : due}
          {!done && <span style={{ color: "var(--r-ink-3)" }}>&nbsp;· +{miles} mi</span>}
        </span>
      </span>
      <span style={{ color: "var(--r-ink-3)" }}>
        <Icon node={I.arrowRight} size={16} />
      </span>
    </div>
  );
}

/** A painting from the app's series, filling its (relative) parent, with the app's veils. */
export function Painting({ name, position = "50% 50%", veil, scale = 1, opacity = 1 }: { name: string; position?: string; veil?: "top" | "left" | "full" | "bottom"; scale?: number; opacity?: number }) {
  const veils = {
    top: "linear-gradient(180deg, rgb(10 20 40 / 0.55), transparent 55%)",
    bottom: "linear-gradient(0deg, rgb(10 20 40 / 0.7), transparent 60%)",
    left: "linear-gradient(90deg, rgb(10 20 40 / 0.6), transparent 75%)",
    full: "rgb(10 20 40 / 0.35)",
  };
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity }} aria-hidden>
      <div className="absolute inset-0" style={{ transform: `scale(${scale})` }}>
        <Image src={`/projects/reloco/motion/${name}.webp`} alt="" fill sizes="400px" className="object-cover" style={{ objectPosition: position }} priority />
      </div>
      {veil && <div className="absolute inset-0" style={{ background: veils[veil] }} />}
    </div>
  );
}

// One stamp glyph per chapter, Pre-flight to After graduation (the app's Stamp).
const PLANE: Node = [["path", { d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" }]];
const GLYPHS: Node[] = [PLANE, PLANE, I.cap, I.house, I.receipt, I.bookOpen, I.briefcase, I.award, I.rocket];
const STAMP_INK = ["#2b6495", "#b5553a", "#3c7a4a", "#7a4e8c", "#9a7428"];

/** A chapter's passport stamp: inked when earned, a dashed outline until then. */
export function Stamp({ index, name, earned, size = 58 }: { index: number; name: string; earned: boolean; size?: number }) {
  const id = useId().replace(/:/g, "");
  const color = earned ? STAMP_INK[index % 5] : "var(--r-ink-3)";
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ color, opacity: earned ? 1 : 0.45, flexShrink: 0 }} aria-hidden>
      <defs>
        <path id={`${id}a`} d="M 15 50 A 35 35 0 0 1 85 50" />
        <path id={`${id}b`} d="M 9 50 A 41 41 0 0 0 91 50" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={earned ? undefined : "4 4"} />
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {earned && <circle cx="50" cy="50" r="46" fill="currentColor" opacity="0.07" />}
      <text fontSize="8.5" fontWeight="700" letterSpacing="1.6" fill="currentColor" style={{ textTransform: "uppercase" }}>
        <textPath href={`#${id}a`} startOffset="50%" textAnchor="middle">
          {name}
        </textPath>
      </text>
      <text fontSize="7" fontWeight="600" letterSpacing="1.4" fill="currentColor" opacity="0.85">
        <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle">
          CHAPEL HILL
        </textPath>
      </text>
      <g transform="translate(39 35)">
        <Icon node={GLYPHS[index]} size={22} />
      </g>
      <text x="50" y="71" fontSize="8.5" fontWeight="800" textAnchor="middle" fill="currentColor">
        {`Nº ${index + 1}`}
      </text>
    </svg>
  );
}

export interface ChapterProps {
  index: number;
  name: string;
  art: string;
  done: number;
  total: number;
  current?: boolean;
  /** 0 closed, 1 open: the clock drives it, so a scene can open a chapter mid-loop. */
  open: number;
  /** Height of the rows when open. */
  bodyHeight: number;
  children?: ReactNode;
  /** When a fingertip opens it. */
  tapAt?: number;
}

/** A Journey chapter: its painting and stamp, a progress bar, and its rows when open. */
export function Chapter({ index, name, art, done, total, current, open, bodyHeight, children, tapAt }: ChapterProps) {
  const complete = done === total;
  return (
    <section className="relative overflow-hidden rounded-[20px]" style={{ background: "var(--r-surface)", boxShadow: current ? "0 0 0 2px var(--r-leaf), var(--r-shadow)" : "var(--r-shadow)" }}>
      <div className="relative flex min-h-[112px] w-full items-center gap-3 overflow-hidden px-4 py-4 text-left text-white">
        <Painting name={art} position="50% 45%" veil="left" />
        <span className="relative grid size-[64px] shrink-0 place-items-center rounded-full" style={{ background: "rgb(255 251 244 / 0.9)" }}>
          <Stamp index={index} name={name} earned={complete} />
        </span>
        <span className="relative min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className={`${display} text-[28px] leading-none`} style={tight}>
              {name}
            </span>
            {current && <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: "var(--r-leaf)" }}>NOW</span>}
          </span>
          <span className="mt-2 flex items-center gap-2.5">
            <span className="h-1.5 w-20 overflow-hidden rounded-full" style={{ background: "rgb(255 255 255 / 0.25)" }}>
              <span className="block h-full rounded-full bg-white" style={{ width: `${(done / total) * 100}%`, transition: "width 500ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
            </span>
            <span className="text-[12px] font-semibold tabular-nums" style={{ color: "rgb(255 255 255 / 0.85)" }}>
              {complete ? "Stamped ✓" : `${done}/${total}`}
            </span>
          </span>
        </span>
        <span className="relative" style={{ color: "rgb(255 255 255 / 0.8)", transform: `rotate(${180 * open}deg)` }}>
          <Icon node={I.chevronDown} size={20} />
        </span>
        {tapAt !== undefined && <Tap at={tapAt} x="58%" y="50%" />}
      </div>
      {bodyHeight > 0 && (
        <div className="overflow-hidden" style={{ height: (bodyHeight + 1) * open, opacity: Math.min(1, open * 1.5) }}>
          <div style={{ borderTop: "1px solid var(--r-line)" }}>{children}</div>
        </div>
      )}
    </section>
  );
}

/** The floating pill of tabs on phones. */
export function TabBar({ active }: { active: "Today" | "Journey" }) {
  const tabs = [
    { label: "Today", icon: I.sparkles },
    { label: "Journey", icon: I.map },
    { label: "Documents", icon: I.folderLock },
    { label: "Profile", icon: I.user },
  ];
  return (
    <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center px-4">
      <div className="flex h-[60px] items-center gap-1 rounded-full p-1.5" style={{ background: "rgb(20 22 27 / 0.94)", boxShadow: "0 12px 40px -8px rgb(0 0 0 / 0.45), inset 0 0 0 1px rgb(255 255 255 / 0.1)" }}>
        {tabs.map((tab) => {
          const on = tab.label === active;
          return (
            <span
              key={tab.label}
              className="flex h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3.5 text-[14px] font-semibold"
              style={{ background: on ? "#fff" : "transparent", color: on ? "#14161b" : "rgb(255 255 255 / 0.6)" }}
            >
              <Icon node={tab.icon} size={20} stroke={2.2} />
              {on && tab.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── The yearly scene ───────────── */

/**
 * A year in a task title. When `from` is given, the token starts at last year's value and
 * rolls on to this year's at `at`; a soft highlight marks it as the copy's date.
 */
function Year({ from, to, at }: { from?: string; to: string; at: number }) {
  const { t } = useClock();
  const roll = from ? outQuint(span(t, at, 650)) : 1;
  const mark = span(t, at - 150, 350);
  return (
    <span
      className="relative inline-block overflow-hidden rounded-[6px] align-top tabular-nums"
      style={{ height: "1.25em", margin: "0 -3px", padding: "0 3px", background: `rgb(225 238 248 / ${mark})`, color: mark > 0.5 ? "var(--r-leaf-ink)" : undefined, transition: "color 200ms" }}
    >
      {from ? (
        <span className="block" style={{ transform: `translateY(${-50 * roll}%)` }}>
          <span className="block">{from}</span>
          <span className="block">{to}</span>
        </span>
      ) : (
        to
      )}
    </span>
  );
}

type Repeat = { category: Category; due: string; miles: number; title: (y: ReactNode) => ReactNode; years: string[] };

// The five tasks that repeat each year, with their copies' years: Sophomore, Junior, Senior,
// After graduation (lib/library/tasks.ts). A task stops once its years run out.
const REPEATS: Repeat[] = [
  { category: "immigration", due: "Opens Nov 1", miles: 60, title: (y) => <>Going home for winter {y}? Get a travel signature first</>, years: ["2025", "2026", "2027"] },
  { category: "taxes", due: "Opens Feb 1", miles: 120, title: (y) => <>File your {y} tax forms</>, years: ["2025", "2026", "2027", "2028"] },
  { category: "employment", due: "Opens Mar 1", miles: 200, title: (y) => <>Summer {y} internship? Get CPT approved first</>, years: ["2026", "2027"] },
  { category: "campus", due: "Opens Mar 20", miles: 60, title: (y) => <>Register full time for {y}</>, years: ["2026–27", "2027–28"] },
  { category: "housing", due: "Opens May 1", miles: 40, title: (y) => <>Moving in summer {y}? Report your new address within 10 days</>, years: ["2026", "2027"] },
];

const ROW = 61.25;
const GAP = 10;

/** Rows for one class year: the yearly copies roll their year on from the year before. */
function yearRows(year: number, rollAt: number): Row[] {
  return REPEATS.filter((r) => r.years[year]).map((r, i) => ({
    category: r.category,
    due: r.due,
    miles: r.miles,
    title: r.title(<Year from={year > 0 ? r.years[year - 1] : undefined} to={r.years[year]} at={rollAt + i * 110} />),
  }));
}

// Senior year and After graduation also hold the OPT track; their yearly copies sit in among it.
function seniorRows(rollAt: number): Row[] {
  const [winter, tax] = yearRows(2, rollAt);
  return [
    { category: "employment", title: "Decide what’s next after graduation", due: "Opens Aug 17", miles: 120 },
    { category: "employment", title: "Check your degree qualifies for STEM OPT", due: "Opens Aug 17", miles: 100 },
    winter,
    { category: "employment", title: "Request your OPT I-20 from ISSS", due: "Opens Jan 24", miles: 150, locked: 1 },
    tax,
    { category: "employment", title: "File Form I-765 for OPT with USCIS", due: "Opens Feb 13", miles: 250, locked: 1 },
  ];
}
function afterRows(rollAt: number): Row[] {
  const [tax] = yearRows(3, rollAt);
  return [
    { category: "employment", title: "On OPT: report your job and watch the unemployment limit", due: "Opens May 13", miles: 150, locked: 1 },
    tax,
    { category: "employment", title: "Apply for the 24-month STEM OPT extension", due: "Opens Feb 12", miles: 250, locked: 1 },
    { category: "employment", title: "On STEM OPT: check in every 6 months", due: "Opens May 13", miles: 150, locked: 1 },
  ];
}

/** Rows that rise in one after another as their chapter opens. */
function Rows({ rows, at }: { rows: Row[]; at: number }) {
  const { t } = useClock();
  return (
    <>
      {rows.map((row, i) => {
        const p = outQuint(span(t, at + i * 70, 500));
        return <TaskRow key={i} row={row} last={i === rows.length - 1} style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)` }} />;
      })}
    </>
  );
}

// The beats: Sophomore is open (it's now), then Junior, Senior and After graduation open in
// turn, each a tap, a glide down, and the years rolling on.
const T = { soph: 200, junior: 2300, senior: 4700, after: 7100, end: 10400 };
const OPEN = 450;

function Yearly() {
  const { t } = useClock();
  const open = (at: number) => inOutCubic(span(t, at, OPEN));
  const jOpen = open(T.junior);
  const sOpen = open(T.senior);
  const aOpen = open(T.after);

  // The camera: Sophomore up top, then each newly opened year brought fully into view
  // with the end of the year before still showing above it.
  const camera = glide(
    t,
    [
      [0, 0],
      [T.junior + 150, 200],
      [T.senior + 150, 680],
      [T.after + 150, 940],
    ],
    1000,
  );

  return (
    <Scene className="relative h-full overflow-hidden">
      <div className="absolute inset-x-0 top-0 px-3" style={{ transform: `translateY(${-camera}px)` }}>
        {/* The end of freshman year, already stamped, just above the fold. */}
        <div className="relative" style={{ marginTop: -70 }}>
          <Chapter index={4} name="First spring" art="tax-season" done={5} total={5} open={0} bodyHeight={0} />
        </div>
        <h2 className={`${display} px-1 pt-5 pb-1 text-[24px] leading-none`} style={{ ...tight, color: "var(--r-ink-2)" }}>
          The rest of your degree
        </h2>
        <div className="flex flex-col" style={{ gap: GAP }}>
          <Chapter index={5} name="Sophomore year" art="cat-campus" done={0} total={5} current open={1} bodyHeight={5 * ROW}>
            <Rows rows={yearRows(0, T.soph + 500)} at={T.soph} />
          </Chapter>
          <Chapter index={6} name="Junior year" art="study" done={0} total={5} open={jOpen} bodyHeight={5 * ROW} tapAt={T.junior}>
            <Rows rows={yearRows(1, T.junior + 700)} at={T.junior + 120} />
          </Chapter>
          <Chapter index={7} name="Senior year" art="certificate" done={0} total={6} open={sOpen} bodyHeight={6 * ROW} tapAt={T.senior}>
            <Rows rows={seniorRows(T.senior + 700)} at={T.senior + 120} />
          </Chapter>
          <Chapter index={8} name="After graduation" art="cat-employment" done={0} total={4} open={aOpen} bodyHeight={4 * ROW} tapAt={T.after}>
            <Rows rows={afterRows(T.after + 700)} at={T.after + 120} />
          </Chapter>
        </div>
      </div>
      <TabBar active="Journey" />
    </Scene>
  );
}

export const scene = { Scene: Yearly, duration: T.end };
