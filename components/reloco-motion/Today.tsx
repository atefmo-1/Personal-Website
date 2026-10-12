"use client";

import { cubicBezier, motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { AppHeader, GLYPH, Glyph, Heading, Scene, TabBar, Tap, ease } from "./ui";
import { useClock } from "./Stage";

// Today, one step at a time: Mei marks her on-campus job "Already done", and the payroll forms it
// was holding back become her one next step. The chapter count on her strip catches up, and a
// fingertip starts the new task. Today keeps one measure of progress (the chapter's tasks done);
// miles, stamps and the weekly goal live elsewhere now. Mei is the case study's invented freshman,
// on day 53 in Chapel Hill (Settling in); the step before is one task back.

const DONE_TAP = 1700;
const SWAP = DONE_TAP + 260;
const TALLY = SWAP + 150;
const START_TAP = SWAP + 3900;
const DURATION = START_TAP + 1300;

const fill = cubicBezier(...ease);

// Lucide's icons, drawn in place.
const icon = (children: ReactNode, size = 15, width = 2) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);
const WORK = (
  <>
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <rect x="2" y="6" width="20" height="14" rx="2" />
  </>
);
const TAXES = (
  <path d="M12 17V7M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z" />
);
const BANKING = (
  <>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20M6 14h2" />
  </>
);
const IDS = (
  <>
    <path d="M13 19a4 4 0 0 0-8 0M16 10h2M16 14h2" />
    <circle cx="9" cy="12" r="3" />
    <rect x="2" y="5" width="20" height="14" rx="2" />
  </>
);

/** A category mark in passport ink: a double ring in the area's color around its icon. */
function IconTile({ color, glyph }: { color: string; glyph: ReactNode }) {
  return (
    <span
      className="grid size-8 shrink-0 place-items-center rounded-full"
      style={{ color, background: `color-mix(in oklab, ${color} 13%, #fffbf4)`, boxShadow: `inset 0 0 0 1.5px ${color}, inset 0 0 0 3.5px #fffbf4, inset 0 0 0 4.5px color-mix(in oklab, ${color} 45%, transparent)` }}
    >
      {icon(glyph)}
    </span>
  );
}

/** A value that rolls up to its new self at `at`. */
function Roll({ before, after, at, className }: { before: string; after: string; at: number; className?: string }) {
  const { t } = useClock();
  const now = t >= at;
  if (before === after) return <span className={className}>{after}</span>;
  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className ?? ""}`}>
      <motion.span key={now ? "after" : "before"} className="block" initial={now ? { y: "70%", opacity: 0 } : false} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease }}>
        {now ? after : before}
      </motion.span>
    </span>
  );
}

// The chapter's count, before and after the job is done.
const CHAPTER = { done: 6, total: 14 };

/** The pass, folded to one paper strip for phones once she's landed: the day, the chapter's tasks done, and that count as a bar. */
function PassStrip() {
  const { t } = useClock();
  const k = fill(Math.max(0, Math.min(1, (t - TALLY) / 700)));
  const pct = ((CHAPTER.done + k) / CHAPTER.total) * 100;
  return (
    <section className="relative rounded-[20px] px-4 pt-3 pb-3.5" style={{ background: "var(--r-surface)" }}>
      <dl className="grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <dt className="text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
            Day
          </dt>
          <dd className="mt-0.5 text-[16px] font-semibold tabular-nums">53</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
            This chapter
          </dt>
          <dd className="mt-0.5 text-[16px] font-semibold tabular-nums">
            <Roll before={`${CHAPTER.done} of ${CHAPTER.total} done`} after={`${CHAPTER.done + 1} of ${CHAPTER.total} done`} at={TALLY} />
          </dd>
        </div>
      </dl>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--r-fill)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--r-leaf)" }} />
      </div>
    </section>
  );
}

interface Focus {
  area: string;
  color: string;
  glyph: ReactNode;
  due: string;
  title: string;
  minutes: string;
  steps: number;
  stepsDone: number;
}

// A work task, then a tax one; neither shows miles on Today.
const JOB: Focus = { area: "Work", color: "#2f7d78", glyph: WORK, due: "Due in 2 days", title: "Find an on-campus job", minutes: "~2 hr", steps: 5, stepsDone: 4 };
const I9: Focus = { area: "Taxes", color: "#9a7428", glyph: TAXES, due: "Due in 3 days", title: "Complete your I-9 and W-4 for payroll", minutes: "~30 min", steps: 4, stepsDone: 0 };

/** The one thing to do next: mark, due, title, three facts and a bar, then "Already done" and Start. */
function FocusCard({ task, doneAt, startAt }: { task: Focus; doneAt?: number; startAt?: number }) {
  const { t } = useClock();
  const saving = doneAt !== undefined && t >= doneAt;
  const donePressed = saving && t < doneAt! + 200;
  const startPressed = startAt !== undefined && t >= startAt && t < startAt + 220;
  return (
    <article className="relative rounded-[20px] p-4" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
      <div className="flex items-center justify-between gap-3">
        <IconTile color={task.color} glyph={task.glyph} />
        <span className="inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-semibold whitespace-nowrap" style={{ background: "var(--r-leaf-soft)", color: "var(--r-leaf-ink)" }}>
          {task.due}
        </span>
      </div>

      <h3 className={`${relocoDisplay.className} mt-3 text-[24px] leading-[1.08] tracking-[-0.015em]`} style={{ textWrap: "balance" } as CSSProperties}>
        {task.title}
      </h3>

      <div className="mt-3 flex items-center gap-3 text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
        <span>{task.area}</span>
        <span className="flex items-center gap-1">
          <Glyph node={GLYPH.clock} size={14} />
          {task.minutes}
        </span>
        <span className="ml-auto tabular-nums">
          {task.stepsDone} of {task.steps} steps
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full" style={{ background: "var(--r-fill)" }}>
        <div className="h-full rounded-full" style={{ width: `${(task.stepsDone / task.steps) * 100}%`, background: "var(--r-leaf)" }} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        {/* Start leads; "Already done" is the quieter pill beside it, for work finished outside Reloco. */}
        <motion.span
          className="relative inline-flex h-[52px] shrink-0 items-center justify-center gap-1.5 rounded-full px-4 text-[16px] font-semibold whitespace-nowrap"
          style={{ background: donePressed ? "var(--r-surface-2)" : "var(--r-surface)", color: "var(--r-ink)", boxShadow: "inset 0 0 0 1px var(--r-line)" }}
          animate={{ scale: donePressed ? 0.97 : 1 }}
          transition={{ duration: 0.15 }}
        >
          {doneAt !== undefined && <Tap at={doneAt} x="50%" y="50%" />}
          <span style={{ color: "var(--r-success-ink)" }}>
            <Glyph node={GLYPH.check} size={16} stroke={2.8} />
          </span>
          {saving ? "Saving…" : "Already done"}
        </motion.span>
        <motion.span
          className="relative flex h-[52px] min-w-0 flex-1 items-center justify-between gap-3 rounded-full pr-1.5 pl-6 text-[16px] font-semibold"
          style={{ background: "var(--r-primary)", color: "var(--r-on-primary)" }}
          animate={{ scale: startPressed ? 0.97 : 1 }}
          transition={{ duration: 0.15 }}
        >
          {startAt !== undefined && <Tap at={startAt} x="40%" y="50%" />}
          {task.stepsDone > 0 ? "Keep going" : "Start"}
          <span className="grid size-10 shrink-0 place-items-center rounded-full" style={{ background: "var(--r-leaf)", color: "#13294b" }}>
            <Glyph node={GLYPH.arrowRight} size={20} stroke={2.4} />
          </span>
        </motion.span>
      </div>
    </article>
  );
}

const TAG = "inline-flex h-5 items-center gap-1 rounded-full px-2 text-[12px] font-semibold";

/** One row of a Today list: mark, title, tags and due, chevron. No miles on Today. */
function Row({ color, glyph, title, due, soon, locked, optional, last }: { color: string; glyph: ReactNode; title: string; due: string; soon?: boolean; locked?: boolean; optional?: boolean; last?: boolean }) {
  return (
    <div className="flex min-h-[58px] items-center gap-3 px-3.5">
      <IconTile color={color} glyph={glyph} />
      <span className="flex min-w-0 flex-1 flex-col py-2.5" style={{ borderBottom: last ? "none" : "1px solid var(--r-line)" }}>
        <span className="line-clamp-2 text-[15px] leading-snug font-semibold">{title}</span>
        <span className="mt-1 flex items-center gap-x-2 text-[13px]">
          {locked && (
            <span className={TAG} style={{ background: "var(--r-fill)", color: "var(--r-ink-2)" }}>
              <Glyph node={GLYPH.lock} size={12} /> Locked
            </span>
          )}
          {optional && (
            <span className={TAG} style={{ background: "var(--r-fill)", color: "var(--r-ink-2)" }}>
              Optional
            </span>
          )}
          <span style={{ color: soon ? "var(--r-leaf-ink)" : "var(--r-ink-2)", fontWeight: soon ? 500 : 400 }}>{due}</span>
        </span>
      </span>
      <span style={{ color: "var(--r-ink-3)" }}>
        <Glyph node={GLYPH.chevronRight} size={20} />
      </span>
    </div>
  );
}

/** A list row that folds away at `out` or unfolds at `in`. */
function Fold({ in: inAt, out, children }: { in?: number; out?: number; children: ReactNode }) {
  const { t } = useClock();
  if (inAt !== undefined && t < inAt) return null;
  const gone = out !== undefined && t >= out;
  return (
    <motion.div className="overflow-hidden" initial={inAt !== undefined ? { height: 0, opacity: 0 } : false} animate={gone ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }} transition={{ duration: 0.4, ease }}>
      {children}
    </motion.div>
  );
}

function Today() {
  const { t } = useClock();
  const swapped = t >= SWAP;
  return (
    <Scene className="relative h-full overflow-hidden">
      <AppHeader />
      <div className="px-3 pt-3">
        {/* The chapter's sky: the greeting, where she is, and the strip. */}
        <section className="relative overflow-hidden rounded-[28px] px-3 pt-5 pb-3">
          <div className="absolute inset-0" style={{ backgroundImage: "url(/projects/reloco/cs/hero-painting.webp)", backgroundSize: "cover", backgroundPosition: "18% 60%" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(10 20 40 / 0.55), transparent 55%)" }} />
          <div className="relative px-2 pb-6 text-white">
            <h1 className={`${relocoDisplay.className} text-[40px] leading-[1.02] tracking-[-0.015em]`} style={{ filter: "drop-shadow(0 1px 10px rgb(0 0 0 / 0.35))" }}>
              Good afternoon, Mei
            </h1>
            <p className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[15px] font-medium" style={{ background: "rgb(0 0 0 / 0.4)", backdropFilter: "blur(4px)" }}>
              Settling in · Day 53 in Chapel Hill
            </p>
          </div>
          <PassStrip />
        </section>

        <div className="mt-6">
          <div className="mb-2.5">
            <Heading>Next up</Heading>
          </div>
          <div className="relative">
            {/* The finished task leaves to the left as the next one rises into its place. */}
            {!swapped || t < SWAP + 260 ? (
              <motion.div
                className={swapped ? "absolute inset-x-0 top-0 z-10" : ""}
                animate={swapped ? { opacity: 0, x: -40, scale: 0.96 } : { opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.22 }}
              >
                <FocusCard task={JOB} doneAt={DONE_TAP} />
              </motion.div>
            ) : null}
            {swapped && (
              <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.12 }}>
                <FocusCard task={I9} startAt={START_TAP} />
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2.5">
            <Heading>Also this week</Heading>
          </div>
          <div className="overflow-hidden rounded-[20px]" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
            {/* One row folds away as the other unfolds, so the list keeps its height. */}
            <Fold out={SWAP + 100}>
              <Row color="#9a7428" glyph={TAXES} title={I9.title} due="Due in 3 days" soon locked />
            </Fold>
            <Row color="#3c7a4a" glyph={BANKING} title="Get your first credit card" due="by Oct 22" optional />
            <Fold in={SWAP + 100}>
              <Row color="#7a4e8c" glyph={IDS} title="Get your driver’s license" due="Due Oct 22" last />
            </Fold>
          </div>
        </div>
      </div>

      <TabBar active="Today" />
    </Scene>
  );
}

export const scene = { Scene: Today, duration: DURATION };
