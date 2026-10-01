"use client";

import { AnimatePresence, cubicBezier, motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { useClock } from "./Stage";
import { Scene, ease } from "./ui";
import { CAT, I, Icon, IconTile, Painting, TabBar, TaskRow, display, glide, span, tight, type Category, type Row } from "./Yearly";

// Landing day on Today: Mei's plane reaches RDU on her boarding pass, Reloco asks "Did you make
// it to Chapel Hill?", and "Yes, I landed" clears the travel tasks. The two still open (the
// ride from RDU and packing her entry documents) close as not needed, so Pre-flight earns its
// stamp, Next up moves on to life on the ground, and Today turns to Touchdown. Mei is the case
// study's invented student; the numbers are what the app works out for her plan (44 tasks).

const T = {
  fly: 300,
  down: 2700,
  tap: 5000,
  saved: 5750,
  up: 7500,
  reveal: 7900,
};
export const LANDING_MS = 10600;
// How far the page scrolls to bring the question in, like the case study's screenshot.
const DOWN = 470;

/* The boarding pass, as the app draws it (components/game/boarding-pass.tsx). */

const notch = (x: string) => `radial-gradient(circle 11px at ${x} calc(100% - 57px), transparent 10.5px, #000 11px)`;
const TICKET: CSSProperties = {
  WebkitMaskImage: `${notch("0")}, ${notch("100%")}`,
  WebkitMaskComposite: "source-in",
  maskImage: `${notch("0")}, ${notch("100%")}`,
  maskComposite: "intersect",
};

// The flight path "M 8 52 Q 180 -16 352 52", measured once so the plane moves at an even pace.
const bez = (s: number) => [(1 - s) ** 2 * 8 + 2 * (1 - s) * s * 180 + s ** 2 * 352, (1 - s) ** 2 * 52 + 2 * (1 - s) * s * -16 + s ** 2 * 52];
const LUT = (() => {
  const pts = Array.from({ length: 121 }, (_, i) => bez(i / 120));
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { len, total: len[len.length - 1] };
})();
function along(v: number) {
  const target = v * LUT.total;
  let i = LUT.len.findIndex((l) => l >= target);
  if (i <= 0) i = 1;
  const s = (i - 1 + (target - LUT.len[i - 1]) / (LUT.len[i] - LUT.len[i - 1] || 1)) / 120;
  const [x, y] = bez(Math.min(0.999, Math.max(0.001, s)));
  const [x2, y2] = bez(Math.min(1, s + 0.004));
  return { x, y, angle: (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI };
}
// The app's own flight curve: 1.6s, a soft start and a long glide in.
const flightCurve = cubicBezier(0.45, 0, 0.2, 1);

function BoardingPass({ landed }: { landed: boolean }) {
  const { t } = useClock();
  const p = flightCurve(span(t, T.fly, 1600));
  const plane = along(p);
  const arrived = t >= T.fly + 1600;
  const eyebrow = "text-[10px] font-semibold uppercase tracking-[0.08em]";
  const stats = [
    { label: "Day", value: "1" },
    { label: "Done", value: landed ? "11/44" : "9/44" },
    { label: "Progress", value: landed ? "25%" : "20%" },
  ];
  return (
    <section className="relative overflow-hidden rounded-[20px]" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)", ...TICKET }}>
      <div className="px-5 pt-4 pb-5" style={{ background: "linear-gradient(180deg, var(--r-leaf-soft), transparent 85%)" }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--r-ink-2)" }}>
            Boarding pass
          </span>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums" style={{ background: "rgb(255 251 244 / 0.7)", color: "var(--r-leaf-ink)", boxShadow: "inset 0 0 0 1px var(--r-line)" }}>
            F-1 · UNC
          </span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className={eyebrow} style={{ color: "var(--r-ink-2)" }}>
              From
            </p>
            <p className={`${display} truncate text-[22px] leading-tight`} style={tight}>
              Shanghai
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className={eyebrow} style={{ color: "var(--r-ink-2)" }}>
              To · Chapel Hill
            </p>
            <p className={`${display} text-[30px] leading-none`} style={tight}>
              RDU
            </p>
          </div>
        </div>
        <svg viewBox="0 0 360 60" className="mt-1 h-auto w-full overflow-visible" aria-hidden>
          <path d="M 8 52 Q 180 -16 352 52" fill="none" stroke="var(--r-ink-3)" strokeWidth="1.6" strokeDasharray="1 5" strokeLinecap="round" opacity="0.7" />
          <path d="M 8 52 Q 180 -16 352 52" fill="none" stroke="var(--r-leaf)" strokeWidth="2.6" strokeLinecap="round" strokeDasharray={`${p * LUT.total} ${LUT.total}`} />
          <circle cx="8" cy="52" r="3.5" fill="var(--r-leaf)" />
          <circle cx="352" cy="52" r="3.5" fill={arrived ? "var(--r-leaf)" : "none"} stroke="var(--r-leaf)" strokeWidth="2" />
          {/* Touchdown: one soft ring from the airport as the plane arrives. */}
          {arrived && (
            <motion.circle cx="352" cy="52" fill="none" stroke="var(--r-leaf)" strokeWidth="1.5" initial={{ r: 4, opacity: 0.8 }} animate={{ r: 22, opacity: 0 }} transition={{ duration: 1.1, ease: "easeOut" }} />
          )}
          <g transform={`translate(${plane.x} ${plane.y}) rotate(${plane.angle})`}>
            <circle r="12" fill="var(--r-surface)" stroke="var(--r-line)" />
            <path transform="translate(1.6 0) scale(0.9)" d="M8 0C8-.9 7-1.4 6-1.4H-1L-5-8H-7L-4.5-1.4-8-1.3-10-4H-11.5L-10.5 0-11.5 4H-10L-8 1.3-4.5 1.4-7 8H-5L-1 1.4H6C7 1.4 8 .9 8 0Z" fill="var(--r-primary)" />
          </g>
        </svg>
        <dl className="mt-3 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className={eyebrow} style={{ color: "var(--r-ink-2)" }}>
                {s.label}
              </dt>
              <dd className="mt-0.5 text-[17px] font-semibold tabular-nums">
                <Swap k={s.value}>{s.value}</Swap>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mx-5" style={{ borderTop: "2px dashed var(--r-line)" }} />
      <div className="flex h-14 items-center justify-between gap-4 px-5">
        <div className="flex items-baseline gap-1.5">
          <span style={{ color: "var(--r-gold)" }}>✦</span>
          <span className={`${display} text-[22px] tabular-nums`} style={{ ...tight, color: "var(--r-gold-ink)" }}>
            1,230
          </span>
          <span className="text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
            miles
          </span>
        </div>
        <span className="text-[12px] font-medium whitespace-nowrap tabular-nums" style={{ color: "var(--r-ink-2)" }}>
          <Swap k={landed ? "1" : "0"} pop>
            {landed ? 1 : 0}
          </Swap>
          /9 stamps
        </span>
      </div>
    </section>
  );
}

/** Text that trades places with its next value: the old one lifts away, the new one rises in. */
function Swap({ k, children, pop = false }: { k: string; children: ReactNode; pop?: boolean }) {
  return (
    <span className="relative inline-grid overflow-visible">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={k}
          className="inline-block"
          initial={{ opacity: 0, y: 8, scale: pop ? 1.6 : 1 }}
          animate={{ opacity: 1, y: 0, scale: 1, color: pop ? ["var(--r-leaf-ink)", "var(--r-leaf-ink)", "var(--r-ink-2)"] : undefined }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: pop ? 0.9 : 0.4, ease }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* The landing question (components/today/landing-check.tsx). */

/** A fingertip for the Carolina-blue button, where ui's blue Tap would vanish: the same ring in navy. */
function NavyTap({ at }: { at: number }) {
  const { t } = useClock();
  if (t < at - 120 || t > at + 700) return null;
  return (
    <motion.span
      className="pointer-events-none absolute top-1/2 left-1/2 z-10 -mt-5 -ml-5 size-10 rounded-full"
      style={{ background: "var(--r-primary)" }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 0.3, 0], scale: [0.5, 1, 1.6] }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    />
  );
}

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
          style={{ background: "var(--r-leaf)", color: "#13294b", opacity: saving ? 0.5 : 1 }}
          animate={{ scale: pressed ? 0.97 : 1 }}
          transition={{ duration: 0.12 }}
        >
          <NavyTap at={T.tap} />
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
  miles: number;
  steps: number;
}
const RIDE: Focus = { slug: "airport-ride", title: "Plan your ride from RDU to Chapel Hill", category: "housing", due: "Overdue · was due Sep 28", urgent: true, minutes: "~15 min", miles: 50, steps: 2 };
const PHONE: Focus = { slug: "phone-plan", title: "Get a US phone number", category: "technology", due: "Due in 3 days", urgent: false, minutes: "~30 min", miles: 60, steps: 3 };

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
          <span className="flex items-center gap-2">
            <IconTile category={task.category} />
            <span className="text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
              {CAT[task.category].short}
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
        <h3 className={`${display} mt-3 text-[24px] leading-[1.08]`} style={tight}>
          {task.title}
        </h3>
        <div className="mt-3 flex items-center gap-3 text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }}>
          <span className="flex items-center gap-1">
            <Icon node={I.clock} size={14} /> {task.minutes}
          </span>
          <span style={{ color: "var(--r-gold-ink)" }}>✦ +{task.miles}</span>
          <span className="ml-auto tabular-nums">0/{task.steps} steps</span>
        </div>
        <div className="mt-2 h-1 rounded-full" style={{ background: "var(--r-fill)" }} />
        <div className="mt-4 flex items-center gap-2">
          <span className="grid size-[52px] shrink-0 place-items-center rounded-full" style={{ background: "var(--r-fill)" }}>
            <Icon node={I.check} size={24} stroke={2.6} />
          </span>
          <span className="flex h-[52px] flex-1 items-center justify-between gap-3 rounded-full pr-1.5 pl-6 text-[16px] font-semibold" style={{ background: "var(--r-primary)", color: "var(--r-on-primary)" }}>
            Start
            <span className="grid size-10 place-items-center rounded-full" style={{ background: "var(--r-leaf)", color: "#13294b" }}>
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

// "This week": the two tasks after Next up, before and after landing.
const WEEK_BEFORE: (Row & { slug: string })[] = [
  { slug: "pack", title: "Pack your entry documents in your carry-on", category: "immigration", due: "Overdue since yesterday", tone: "urgent", miles: 80 },
  { slug: "phone", title: "Get a US phone number", category: "technology", due: "Due in 3 days", tone: "soon", miles: 60 },
];
const WEEK_AFTER: (Row & { slug: string })[] = [
  { slug: "immunization", title: "Submit your immunization records", category: "health", due: "Due in 5 days", tone: "soon", miles: 120 },
  { slug: "i94", title: "Download your I-94 and check it", category: "immigration", due: "Due in 5 days", tone: "soon", miles: 60 },
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

  return (
    <Scene className="relative h-full overflow-hidden">
      <div className="absolute inset-x-0 top-0" style={{ transform: `translateY(${-camera}px)` }}>
        <header className="flex h-14 items-center px-5">
          <span className={`${display} text-[28px] leading-none`} style={tight}>
            reloco
          </span>
        </header>
        <div className="px-3 pt-3">
          <section className="relative overflow-hidden rounded-[28px] px-3 pt-5 pb-3">
            <Painting name="preflight" position="50% 35%" veil="top" scale={drift} />
            <Painting name="touchdown" position="50% 35%" veil="top" scale={drift} opacity={turned} />
            <div className="relative px-2 pb-28 text-white">
              <p className="text-[13px] font-medium" style={{ color: "rgb(255 255 255 / 0.8)" }}>
                <Swap k={t >= T.reveal ? "after" : "before"}>{t >= T.reveal ? "Touchdown · Day 1 in Chapel Hill" : "Pre-flight · Landing day"}</Swap>
              </p>
              <h1 className={`${display} mt-0.5 text-[40px] leading-[1.02]`} style={{ ...tight, textShadow: "0 1px 10px rgb(0 0 0 / 0.35)" }}>
                Good morning, Mei
              </h1>
            </div>
            <BoardingPass landed={landed} />
          </section>

          <div className="relative mt-6 flex items-center gap-3 overflow-hidden rounded-[22px] px-4 py-4 text-white">
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

          <div className="mt-4 flex items-center gap-4 rounded-[20px] px-4 py-3" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium" style={{ color: "var(--r-ink-2)" }}>
                This week
              </p>
              <p className="text-[15px] font-semibold">0 of 3 tasks</p>
            </div>
            <span className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-3 rounded-full" style={{ background: "var(--r-fill)", boxShadow: "inset 0 0 0 1px var(--r-line)" }} />
              ))}
            </span>
            <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-semibold tabular-nums" style={{ background: "var(--r-fill)", color: "var(--r-ink-2)" }}>
              <Icon node={I.flame} size={16} /> 0 weeks
            </span>
          </div>

          <section className="mt-6">
            <SectionTitle>Next up</SectionTitle>
            <FocusCard task={landed ? PHONE : RIDE} />
          </section>

          <section className="mt-6">
            <SectionTitle>This week</SectionTitle>
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
