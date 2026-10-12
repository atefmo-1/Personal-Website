"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useClock } from "./Stage";
import { AppHeader, Scene, TabBar, Tap, ease } from "./ui";
import { CAT, I, Icon, IconTile, Painting, TaskRow, display, glide, span, tight, type Category, type Row } from "./Yearly";

// Landing day on Today: it's "Pre-flight · Landing day", and on a phone the boarding pass has
// already folded to the strip (day 1, the chapter's tasks done). Reloco asks "Did you make it to
// Chapel Hill?", and "Yes, I landed" clears the travel tasks. The two still open (the ride from
// RDU and packing her entry documents) close as not needed, so Pre-flight is done, Next up moves
// on to life on the ground, and Today turns to Touchdown. Mei is the case study's invented
// student; Today shows no miles, and the weekly goal is gone from it.

const T = {
  down: 2700,
  tap: 5000,
  saved: 5750,
  up: 7500,
  reveal: 7900,
};
export const LANDING_MS = 10600;
// How far the page scrolls to bring the question and Next up in, like the case study's screenshot.
const DOWN = 330;

/* The strip on Today once the landing day comes (components/today/pass-strip.tsx): on a phone the
   boarding pass folds to it, the day and the chapter's tasks done, with that count as a bar. */

function PassStrip({ landed }: { landed: boolean }) {
  // Pre-flight's count on landing day; once she's landed, Touchdown's, just begun.
  const chapter = landed ? { done: 0, total: 9 } : { done: 9, total: 11 };
  return (
    <section className="relative rounded-[20px] px-4 pt-3 pb-3.5" style={{ background: "var(--r-surface)" }}>
      <dl className="grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <dt className="text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
            Day
          </dt>
          <dd className="mt-0.5 text-[16px] font-semibold tabular-nums">1</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
            This chapter
          </dt>
          <dd className="mt-0.5 text-[16px] font-semibold tabular-nums">
            <Swap k={landed ? "after" : "before"}>{`${chapter.done} of ${chapter.total} done`}</Swap>
          </dd>
        </div>
      </dl>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--r-fill)" }}>
        <div className="h-full rounded-full" style={{ width: `${(chapter.done / chapter.total) * 100}%`, background: "var(--r-leaf)", transition: "width 600ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
      </div>
    </section>
  );
}

/** Text that trades places with its next value: the old one lifts away, the new one rises in. */
function Swap({ k, children }: { k: string; children: ReactNode }) {
  return (
    <span className="relative inline-grid overflow-visible">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span key={k} className="inline-block" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }}>
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* The landing question (components/today/landing-check.tsx). */

function LandingCheck() {
  const { t } = useClock();
  const pressed = t >= T.tap && t < T.tap + 200;
  const saving = t >= T.tap + 280;
  return (
    <section className="mt-6 rounded-[20px] px-5 py-5" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
      <p className="text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
        Planned landing · Sep 30
      </p>
      <h2 className={`${display} mt-1 text-[28px] leading-[1.05]`} style={tight}>
        Did you make it to Chapel Hill?
      </h2>
      <p className="mt-1.5 text-[15px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
        We’ll clear the travel tasks and switch Reloco to life on the ground.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <motion.span
          className="relative inline-flex h-11 items-center justify-center rounded-full px-5 text-[15px] font-semibold whitespace-nowrap"
          style={{ background: saving ? "var(--r-fill)" : "var(--r-primary)", color: saving ? "var(--r-ink-2)" : "var(--r-on-primary)" }}
          animate={{ scale: pressed ? 0.97 : 1 }}
          transition={{ duration: 0.12 }}
        >
          <Tap at={T.tap} x="50%" y="50%" />
          {saving ? "Saving…" : "Yes, I landed"}
        </motion.span>
        <span className="inline-flex h-11 items-center justify-center rounded-full px-5 text-[15px] font-semibold whitespace-nowrap" style={{ background: "var(--r-surface)", boxShadow: "inset 0 0 0 1px var(--r-line)", opacity: saving ? 0.5 : 1 }}>
          On a different day
        </span>
        <span className="inline-flex h-11 items-center px-3 text-[15px] font-semibold" style={{ color: "var(--r-leaf-ink)" }}>
          Not yet, my trip moved
        </span>
      </div>
    </section>
  );
}

/* Next up (components/today/focus-card.tsx). */

interface Focus {
  slug: string;
  title: string;
  category: Category;
  due: string;
  urgent: boolean;
  minutes: string;
  steps: number;
}
const RIDE: Focus = { slug: "airport-ride", title: "Plan your ride from RDU to Chapel Hill", category: "housing", due: "Overdue · was due Sep 28", urgent: true, minutes: "~15 min", steps: 2 };
const PHONE: Focus = { slug: "phone-plan", title: "Get a US phone number", category: "technology", due: "Due in 3 days", urgent: false, minutes: "~30 min", steps: 3 };

/** The one thing to do next (components/today/focus-card.tsx): no miles on Today. */
function FocusCard({ task }: { task: Focus }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.article
        key={task.slug}
        className="relative overflow-hidden rounded-[20px] p-4"
        style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: -40, scale: 0.96, transition: { duration: 0.22 } }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="flex items-center justify-between gap-3">
          <IconTile category={task.category} />
          <span
            className="inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[12px] font-semibold whitespace-nowrap"
            style={task.urgent ? { background: "var(--r-urgent-soft)", color: "var(--r-urgent-ink)" } : { background: "var(--r-leaf-soft)", color: "var(--r-leaf-ink)" }}
          >
            {task.urgent && <span className="size-1.5 rounded-full" style={{ background: "var(--r-urgent)" }} />}
            {task.due}
          </span>
        </div>
        <h3 className={`${display} mt-3 text-[24px] leading-[1.08]`} style={{ ...tight, textWrap: "balance" }}>
          {task.title}
        </h3>
        <div className="mt-3 flex items-center gap-3 text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
          <span>{CAT[task.category].short}</span>
          <span className="flex items-center gap-1">
            <Icon node={I.clock} size={14} /> {task.minutes}
          </span>
          <span className="ml-auto tabular-nums">0 of {task.steps} steps</span>
        </div>
        <div className="mt-2 h-1 rounded-full" style={{ background: "var(--r-fill)" }} />
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex h-[52px] shrink-0 items-center gap-1.5 rounded-full px-4 text-[16px] font-semibold whitespace-nowrap" style={{ background: "var(--r-surface)", boxShadow: "inset 0 0 0 1px var(--r-line)" }}>
            <span style={{ color: "var(--r-success-ink)" }}>
              <Icon node={I.check} size={16} stroke={2.8} />
            </span>
            Already done
          </span>
          <span className="flex h-[52px] min-w-0 flex-1 items-center justify-between gap-3 rounded-full pr-1.5 pl-6 text-[16px] font-semibold" style={{ background: "var(--r-primary)", color: "var(--r-on-primary)" }}>
            Start
            <span className="grid size-10 shrink-0 place-items-center rounded-full" style={{ background: "var(--r-leaf)", color: "#13294b" }}>
              <Icon node={I.arrowRight} size={20} stroke={2.4} />
            </span>
          </span>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className={`${display} mb-2.5 px-1 text-[26px] leading-none`} style={tight}>
      {children}
    </h2>
  );
}

// "Also this week": the two tasks after Next up, before and after landing. Today shows no miles.
const WEEK_BEFORE: (Row & { slug: string })[] = [
  { slug: "pack", title: "Pack your entry documents in your carry-on", category: "immigration", due: "Overdue since yesterday", tone: "urgent", miles: 0 },
  { slug: "phone", title: "Get a US phone number", category: "technology", due: "Due in 3 days", tone: "soon", miles: 0 },
];
const WEEK_AFTER: (Row & { slug: string })[] = [
  { slug: "immunization", title: "Submit your immunization records", category: "health", due: "Due in 5 days", tone: "soon", miles: 0 },
  { slug: "i94", title: "Download your I-94 and check it", category: "immigration", due: "Due in 5 days", tone: "soon", miles: 0 },
];

function Landing() {
  const { t } = useClock();
  const landed = t >= T.saved;
  const camera = glide(
    t,
    [
      [0, 0],
      [T.down, DOWN],
      [T.up, 0],
    ],
    1000,
  );
  // Today's painting is the current chapter's: Pre-flight's night before the flight, then
  // Touchdown's once the student has landed. It turns over as it scrolls back into view.
  const turned = span(t, T.reveal - 200, 1200);
  const drift = 1.06 - 0.06 * span(t, 0, LANDING_MS);
  const week = landed ? WEEK_AFTER : WEEK_BEFORE;
  // The top of the page (pill and strip) is out of view when she lands; it turns over as it scrolls back in.
  const revealed = t >= T.reveal;

  return (
    <Scene className="relative h-full overflow-hidden">
      <div className="absolute inset-x-0 top-0" style={{ transform: `translateY(${-camera}px)` }}>
        <AppHeader />
        <div className="px-3 pt-3">
          <section className="relative overflow-hidden rounded-[28px] px-3 pt-5 pb-3">
            <Painting name="preflight" position="50% 35%" veil="top" scale={drift} />
            <Painting name="touchdown" position="50% 35%" veil="top" scale={drift} opacity={turned} />
            <div className="relative px-2 pb-6 text-white">
              <h1 className={`${display} text-[40px] leading-[1.02]`} style={{ ...tight, filter: "drop-shadow(0 1px 10px rgb(0 0 0 / 0.35))" }}>
                Good morning, Mei
              </h1>
              <p className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[15px] font-medium" style={{ background: "rgb(0 0 0 / 0.4)", backdropFilter: "blur(4px)" }}>
                <Swap k={revealed ? "after" : "before"}>{revealed ? "Touchdown · Day 1 in Chapel Hill" : "Pre-flight · Landing day"}</Swap>
              </p>
            </div>
            <PassStrip landed={revealed} />
          </section>

          <div className="relative mt-6 flex items-center gap-3 overflow-hidden rounded-[20px] px-4 py-4 text-white">
            <Painting name="arrival-hall" veil="full" />
            <span className="relative min-w-0 flex-1">
              <span className="block text-[12px] font-medium" style={{ color: "rgb(255 255 255 / 0.8)" }}>
                Arrival mode
              </span>
              <span className={`${display} block text-[24px] leading-tight`} style={tight}>
                Your landing-day checklist
              </span>
            </span>
            <span className="relative grid size-10 shrink-0 place-items-center rounded-full" style={{ background: "var(--r-leaf)", color: "#13294b" }}>
              <Icon node={I.arrowRight} size={20} stroke={2.4} />
            </span>
          </div>

          {/* Once she's landed the question has done its job and folds away. */}
          <motion.div className="overflow-hidden" initial={false} animate={{ height: landed ? 0 : "auto", opacity: landed ? 0 : 1 }} transition={{ duration: 0.55, ease }}>
            <LandingCheck />
          </motion.div>

          <section className="mt-6">
            <SectionTitle>Next up</SectionTitle>
            <FocusCard task={landed ? PHONE : RIDE} />
          </section>

          <section className="mt-6">
            <SectionTitle>Also this week</SectionTitle>
            <div className="overflow-hidden rounded-[20px]" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
              <AnimatePresence initial={false} mode="popLayout">
                {week.map((row, i) => (
                  <motion.div key={row.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease }}>
                    <TaskRow row={row} last={i === week.length - 1} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
      <TabBar active="Today" />
    </Scene>
  );
}

export const scene = { Scene: Landing, duration: LANDING_MS };
