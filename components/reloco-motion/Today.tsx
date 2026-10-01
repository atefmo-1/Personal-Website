"use client";

import { cubicBezier, motion } from "framer-motion";
import type { ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { Heading, Scene, Tap, ease } from "./ui";
import { useClock } from "./Stage";

// Today, one step at a time: Mei marks her on-campus job found, and the payroll forms it was
// holding back become her one next step. The week's dots, the pass and the miles catch up, and
// a fingertip starts the new task. Mei is the invented student from the case study's screenshot
// (day 53, 2 of 3 this week, 20 of 43 done, 2,430 miles); the step before is one task back.

const DONE_TAP = 1700;
const SWAP = DONE_TAP + 260;
const TALLY = SWAP + 150;
const START_TAP = SWAP + 3900;
const DURATION = START_TAP + 1300;

const countUp = cubicBezier(...ease);
const fmt = new Intl.NumberFormat("en-US");

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
const CHECK = <path d="M20 6 9 17l-5-5" />;
const ARROW = <path d="M5 12h14M12 5l7 7-7 7" />;

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

// Two round notches where the stub tears off, as on the real pass.
const NOTCH = "radial-gradient(circle 11px at X calc(100% - 57px), transparent 10.5px, #000 11px)";
const TICKET = {
  WebkitMaskImage: `${NOTCH.replace("X", "0")}, ${NOTCH.replace("X", "100%")}`,
  WebkitMaskComposite: "source-in",
  maskImage: `${NOTCH.replace("X", "0")}, ${NOTCH.replace("X", "100%")}`,
  maskComposite: "intersect",
} as const;

const eyebrow = "text-[10px] font-semibold uppercase tracking-[0.08em]";

/** The bottom of Mei's boarding pass: where she is, and the miles she's earned. */
function PassStub() {
  const { t } = useClock();
  const k = countUp(Math.max(0, Math.min(1, (t - TALLY) / 900)));
  const miles = Math.round(2280 + 150 * k);
  return (
    <section className="relative overflow-hidden rounded-[20px]" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)", ...TICKET }}>
      {/* The pass's top half sits above the fold; only its tint reaches the stats. */}
      <div className="flex h-[226px] flex-col justify-end px-5 pb-5" style={{ background: "linear-gradient(180deg, var(--r-leaf-soft), transparent 85%)" }}>
        <dl className="grid grid-cols-3 gap-3">
          {[
            { label: "Day", before: "53", after: "53" },
            { label: "Done", before: "19/43", after: "20/43" },
            { label: "Progress", before: "44%", after: "47%" },
          ].map((s) => (
            <div key={s.label}>
              <dt className={eyebrow} style={{ color: "var(--r-ink-2)" }}>
                {s.label}
              </dt>
              <dd className="mt-0.5 text-[17px] font-semibold tabular-nums">
                <Roll before={s.before} after={s.after} at={TALLY + 100} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mx-5 border-t-2 border-dashed" style={{ borderColor: "var(--r-line)" }} />
      <div className="flex h-14 items-center justify-between gap-4 px-5">
        <div className="flex items-baseline gap-1.5">
          <motion.span style={{ color: "var(--r-gold)" }} animate={t >= TALLY && t < TALLY + 900 ? { scale: [1, 1.35, 1], rotate: [0, 30, 0] } : { scale: 1 }} transition={{ duration: 0.8 }}>
            ✦
          </motion.span>
          <span className={`${relocoDisplay.className} text-[22px] tabular-nums`} style={{ color: "var(--r-gold-ink)" }}>
            {fmt.format(miles)}
          </span>
          <span className="text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
            miles
          </span>
        </div>
        <span className="text-[12px] font-medium whitespace-nowrap tabular-nums" style={{ color: "var(--r-ink-2)" }}>
          1/9 stamps
        </span>
      </div>
    </section>
  );
}

/** This week's goal as a row of dots, with the week streak. */
function WeekStrip() {
  const { t } = useClock();
  const done = t >= TALLY + 200 ? 2 : 1;
  return (
    <div className="flex items-center gap-4 rounded-[20px] px-4 py-3" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium" style={{ color: "var(--r-ink-2)" }}>
          This week
        </p>
        <p className="text-[15px] font-semibold">
          <Roll before="1 of 3 tasks" after="2 of 3 tasks" at={TALLY + 200} />
        </p>
      </div>
      <span className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="relative size-3 rounded-full" style={{ background: "var(--r-fill)", boxShadow: "inset 0 0 0 1px var(--r-line)" }}>
            {i < done && (
              <motion.span className="absolute inset-0 rounded-full" style={{ background: "var(--r-leaf)" }} initial={i === 1 ? { scale: 0 } : false} animate={{ scale: [null, 1.4, 1] }} transition={{ type: "tween", duration: 0.45, ease }} />
            )}
          </span>
        ))}
      </span>
      <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-semibold tabular-nums" style={{ background: "var(--r-gold-soft)", color: "var(--r-gold-ink)" }}>
        {icon(<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />, 16)}1 week
      </span>
    </div>
  );
}

interface Focus {
  area: string;
  color: string;
  glyph: ReactNode;
  due: string;
  urgent?: boolean;
  title: string;
  minutes: string;
  miles: number;
  steps: number;
  stepsDone: number;
}

const JOB: Focus = { area: "Work", color: "#2f7d78", glyph: WORK, due: "Due in 2 days", urgent: false, title: "Find an on-campus job", minutes: "~2 hr", miles: 150, steps: 5, stepsDone: 4 };
const I9: Focus = { area: "Taxes", color: "#9a7428", glyph: TAXES, due: "Due in 3 days", title: "Complete your I-9 and W-4 for payroll", minutes: "~30 min", miles: 100, steps: 4, stepsDone: 0 };

/** The one thing to do next: title, three facts, Done and Start. */
function FocusCard({ task, doneAt, startAt }: { task: Focus; doneAt?: number; startAt?: number }) {
  const { t } = useClock();
  const ticked = doneAt !== undefined && t >= doneAt;
  const donePressed = ticked && t < doneAt! + 200;
  const startPressed = startAt !== undefined && t >= startAt && t < startAt + 220;
  return (
    <article className="relative rounded-[20px] p-4" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <IconTile color={task.color} glyph={task.glyph} />
          <span className="text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
            {task.area}
          </span>
        </span>
        <span
          className="inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[12px] font-semibold whitespace-nowrap"
          style={task.urgent ? { background: "var(--r-urgent-soft)", color: "var(--r-urgent-ink)" } : { background: "var(--r-leaf-soft)", color: "var(--r-leaf-ink)" }}
        >
          {task.urgent && <span className="size-1.5 rounded-full" style={{ background: "var(--r-urgent)" }} />}
          {task.due}
        </span>
      </div>

      <h3 className={`${relocoDisplay.className} mt-3 text-[24px] leading-[1.08] tracking-[-0.015em]`}>{task.title}</h3>

      <div className="mt-3 flex items-center gap-3 text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
        <span className="flex items-center gap-1">
          {icon(
            <>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </>,
            14,
          )}
          {task.minutes}
        </span>
        <span style={{ color: "var(--r-gold-ink)" }}>✦ +{task.miles}</span>
        <span className="ml-auto tabular-nums">
          {ticked ? task.steps : task.stepsDone}/{task.steps} steps
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full" style={{ background: "var(--r-fill)" }}>
        <motion.div className="h-full rounded-full" style={{ background: "var(--r-leaf)" }} initial={false} animate={{ width: `${((ticked ? task.steps : task.stepsDone) / task.steps) * 100}%` }} transition={{ duration: 0.3, ease }} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        {/* Done sits on the left so Start's arrow points on, not at it. */}
        <motion.span
          className="relative grid size-[52px] shrink-0 place-items-center rounded-full"
          style={{ background: ticked ? "var(--r-success)" : "var(--r-fill)", color: ticked ? "#ffffff" : "var(--r-ink)", transition: "background 150ms, color 150ms" }}
          animate={{ scale: donePressed ? 0.9 : 1 }}
          transition={{ duration: 0.15 }}
        >
          {doneAt !== undefined && <Tap at={doneAt} x="50%" y="50%" />}
          {icon(CHECK, 24, 2.6)}
        </motion.span>
        <motion.span
          className="relative flex h-[52px] flex-1 items-center justify-between rounded-full pr-1.5 pl-6 text-[16px] font-semibold"
          style={{ background: "var(--r-primary)", color: "var(--r-on-primary)" }}
          animate={{ scale: startPressed ? 0.97 : 1 }}
          transition={{ duration: 0.15 }}
        >
          {startAt !== undefined && <Tap at={startAt} x="40%" y="50%" />}
          {task.stepsDone > 0 ? "Keep going" : "Start"}
          <span className="grid size-10 place-items-center rounded-full" style={{ background: "var(--r-leaf)", color: "#13294b" }}>
            {icon(ARROW, 20, 2.4)}
          </span>
        </motion.span>
      </div>
    </article>
  );
}

/** One row of the week's list: mark, title, due and miles, arrow. */
function Row({ color, glyph, title, due, soon, miles, locked, last }: { color: string; glyph: ReactNode; title: string; due: string; soon?: boolean; miles: number; locked?: boolean; last?: boolean }) {
  return (
    <div className="flex min-h-[58px] items-center gap-3 px-3.5">
      <IconTile color={color} glyph={glyph} />
      <span className="flex min-w-0 flex-1 flex-col py-2.5" style={{ borderBottom: last ? "none" : "1px solid var(--r-line)" }}>
        <span className="truncate text-[15px] leading-tight font-semibold">{title}</span>
        <span className="mt-0.5 text-[13px]" style={{ color: soon ? "var(--r-leaf-ink)" : "var(--r-ink-2)", fontWeight: soon ? 500 : 400 }}>
          {locked && (
            <span className="font-semibold" style={{ color: "var(--r-ink-2)" }}>
              <span className="mr-0.5 inline-block translate-y-[1px]">
                {icon(
                  <>
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </>,
                  12,
                )}
              </span>
              Locked ·{" "}
            </span>
          )}
          {due}
          <span style={{ color: "var(--r-ink-3)" }}> · +{miles} mi</span>
        </span>
      </span>
      <span style={{ color: "var(--r-ink-3)" }}>{icon(ARROW, 16)}</span>
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

const STAMP = "M8 0C8-.9 7-1.4 6-1.4H-1L-5-8H-7L-4.5-1.4-8-1.3-10-4H-11.5L-10.5 0-11.5 4H-10L-8 1.3-4.5 1.4-7 8H-5L-1 1.4H6C7 1.4 8 .9 8 0Z";

/** The tops of the chapter paintings, the current one ringed in Carolina blue. */
function Rail() {
  const crops = ["8% 30%", "45% 10%", "92% 60%"];
  return (
    <div className="flex gap-2.5 px-3 pt-2">
      {crops.map((pos, i) => (
        <div
          key={pos}
          className="relative aspect-[4/5] w-[132px] shrink-0 overflow-hidden rounded-[18px] p-2.5"
          style={{
            backgroundImage: "url(/projects/reloco/cs/hero-painting.webp)",
            backgroundSize: "auto 260%",
            backgroundPosition: pos,
            boxShadow: i === 1 ? "0 0 0 2px var(--r-canvas), 0 0 0 4.5px var(--r-leaf)" : undefined,
          }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgb(10 20 40 / 0.7), transparent 60%)" }} />
          <div className="relative flex items-start justify-between">
            <span className="text-[10px] tabular-nums" style={{ color: "rgb(255 255 255 / 0.8)" }}>
              Nº {i + 1}
            </span>
            {i === 0 && (
              <span className="grid size-9 place-items-center rounded-full" style={{ background: "rgb(255 251 244 / 0.92)", color: "#2b6495" }}>
                <svg viewBox="0 0 100 100" width="33" height="33" aria-hidden>
                  <circle cx="50" cy="50" r="46" fill="currentColor" opacity="0.07" />
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <path transform="translate(50 46) rotate(-45) scale(1.5)" d={STAMP} fill="currentColor" />
                </svg>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The floating tab bar, on Today. */
function TabBar() {
  const tab = (glyph: ReactNode) => <span className="grid h-12 min-w-12 place-items-center px-3.5" style={{ color: "rgb(255 255 255 / 0.6)" }}>{icon(glyph, 20, 2.2)}</span>;
  return (
    <div className="absolute inset-x-0 bottom-3 flex justify-center px-4">
      <div className="flex h-[60px] items-center gap-1 rounded-full p-1.5" style={{ background: "rgb(20 22 27 / 0.92)", boxShadow: "0 12px 40px -8px rgb(0 0 0 / 0.45), 0 0 0 1px rgb(255 255 255 / 0.1)" }}>
        <span className="flex h-12 items-center gap-2 rounded-full bg-white px-3.5 text-[14px] font-semibold" style={{ color: "#14161b" }}>
          {icon(
            <>
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594zM20 2v4M22 4h-4" />
              <circle cx="4" cy="20" r="2" />
            </>,
            20,
            2.2,
          )}
          Today
        </span>
        {tab(<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0zM15 5.764v15M9 3.236v15" />)}
        {tab(
          <>
            <rect x="14" y="17" width="8" height="5" rx="1" />
            <path d="M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5M20 17v-2a2 2 0 1 0-4 0v2" />
          </>,
        )}
        {tab(
          <>
            <path d="M17.925 20.056a6 6 0 0 0-11.851.001" />
            <circle cx="12" cy="11" r="4" />
            <circle cx="12" cy="12" r="10" />
          </>,
        )}
      </div>
    </div>
  );
}

function Today() {
  const { t } = useClock();
  const swapped = t >= SWAP;
  return (
    <Scene className="relative h-full overflow-hidden">
      {/* Scrolled as in the screenshot: the foot of the pass on its painting, then the week. */}
      <section className="absolute inset-x-3 flex flex-col justify-end overflow-hidden rounded-[28px] px-3 pb-3" style={{ top: -260, height: 399 }}>
        <div className="absolute inset-0" style={{ backgroundImage: "url(/projects/reloco/cs/hero-painting.webp)", backgroundSize: "cover", backgroundPosition: "18% 100%" }} />
        <div className="relative">
          <PassStub />
        </div>
      </section>

      <div className="absolute inset-x-0 px-3" style={{ top: 163 }}>
        <WeekStrip />

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
            <Heading>This week</Heading>
          </div>
          <div className="overflow-hidden rounded-[20px]" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
            {/* One row folds away as the other unfolds, so the list keeps its height. */}
            <Fold out={SWAP + 100}>
              <Row color="#9a7428" glyph={TAXES} title={I9.title} due="Due in 3 days" soon miles={100} locked />
            </Fold>
            <Row color="#3c7a4a" glyph={BANKING} title="Get your first credit card" due="Due Oct 22" miles={200} />
            <Fold in={SWAP + 100}>
              <Row color="#7a4e8c" glyph={IDS} title="Get your driver's license" due="Due Oct 22" miles={200} last />
            </Fold>
          </div>
        </div>

        <div className="mt-6">
          <Heading
            right={
              <span className="text-[14px] font-semibold" style={{ color: "var(--r-leaf-ink)" }}>
                All →
              </span>
            }
          >
            Stamps
          </Heading>
        </div>
        <div className="-mx-3 mt-0.5">
          <Rail />
        </div>
      </div>

      <TabBar />
    </Scene>
  );
}

export const scene = { Scene: Today, duration: DURATION };
