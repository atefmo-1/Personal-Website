"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useClock } from "./Stage";
import { Heading, Scene, Tap, TaskBar, Typed, ease, typedFor } from "./ui";
import { Chapter, I, Icon, TabBar, TaskRow, display, inOutCubic, outQuint, span, tight, type Row } from "./Yearly";

// OPT, in order: on Journey a senior's OPT tasks unlock one by one (decide what's next, request
// the OPT I-20, file the I-765), down to "On OPT: report your job". That task's tool counts
// unemployment days against the 90-day limit: the days tick by from the OPT start date on her
// card, until she adds the job she started and the clock stops. The student is invented (she
// graduates May 13, 2028); the rows and dates are what the app builds for her, and the count is
// the app's own arithmetic (lib/opt-clock.ts): May 20 to Jun 11 is 23 days, 67 left.

const A = { decide: 1000, request: 1900, file: 2800, unlock: 350, tapRow: 3750 };
const B = 4150; // the task page slides in
const P = { tickFrom: B + 700, tickTo: B + 2500, type: B + 2900, add: B + 2900 + typedFor("06/12/2028") + 500 };
export const OPT_MS = P.add + 2700;

const ROW = 61.25;

/** 1 while a task waits on the one before; eases to 0 as that one is done. */
const lock = (t: number, unlockAt: number) => 1 - inOutCubic(span(t, unlockAt, 450));

function Journey() {
  const { t } = useClock();
  const done = (at: number) => t >= at;
  const senior: Row[] = [
    { category: "employment", title: "Decide what’s next after graduation", due: "Due Dec 15", miles: 120, done: done(A.decide) },
    { category: "employment", title: "Check your degree qualifies for STEM OPT", due: "Due Dec 15", miles: 100 },
    { category: "immigration", title: "Going home for winter 2027? Get a travel signature first", due: "Opens Nov 1", miles: 60 },
    { category: "employment", title: "Request your OPT I-20 from ISSS", due: "Opens Jan 24", miles: 150, locked: lock(t, A.decide + A.unlock), done: done(A.request) },
    { category: "taxes", title: "File your 2027 tax forms", due: "Opens Feb 1", miles: 120 },
    { category: "employment", title: "File Form I-765 for OPT with USCIS", due: "Opens Feb 13", miles: 250, locked: lock(t, A.request + A.unlock), done: done(A.file) },
  ];
  const after: Row[] = [
    { category: "employment", title: "On OPT: report your job and watch the unemployment limit", due: "Opens May 13", miles: 150, locked: lock(t, A.file + A.unlock) },
    { category: "taxes", title: "File your 2028 tax forms", due: "Opens Feb 1", miles: 120 },
    { category: "employment", title: "Apply for the 24-month STEM OPT extension", due: "Opens Feb 12", miles: 250, locked: 1 },
    { category: "employment", title: "On STEM OPT: check in every 6 months", due: "Opens May 13", miles: 150, locked: 1 },
  ];
  const seniorDone = [A.decide, A.request, A.file].filter(done).length;
  // The row that just changed glows for a moment, so the eye follows the chain down.
  const glow = (at: number) => t >= at && t < at + 800;
  const rows = (list: Row[], at: number, glowAt: (number | null)[], tapRow?: number) =>
    list.map((row, i) => {
      const p = outQuint(span(t, at + i * 60, 500));
      const g = glowAt[i];
      const pressed = tapRow === i && t >= A.tapRow && t < A.tapRow + 250;
      return (
        <div key={i} className="relative" style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)`, background: pressed ? "var(--r-fill)" : g !== null && g !== undefined && glow(g) ? "rgb(225 238 248 / 0.7)" : "transparent", transition: "background 400ms" }}>
          <TaskRow row={row} last={i === list.length - 1} />
          {tapRow === i && <Tap at={A.tapRow} x="45%" y="50%" />}
        </div>
      );
    });

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "var(--r-canvas)" }}>
      <div className="flex flex-col gap-2.5 px-3">
        {/* Junior year, stamped, just above the fold. */}
        <div style={{ marginTop: -80 }}>
          <Chapter index={6} name="Junior year" art="study" done={5} total={5} open={0} bodyHeight={0} />
        </div>
        <Chapter index={7} name="Senior year" art="certificate" done={seniorDone} total={6} current open={1} bodyHeight={6 * ROW}>
          {rows(senior, 100, [A.decide, null, null, A.request, null, A.file])}
        </Chapter>
        <Chapter index={8} name="After graduation" art="cat-employment" done={0} total={4} open={1} bodyHeight={4 * ROW}>
          {rows(after, 400, [A.file + A.unlock], 0)}
        </Chapter>
      </div>
      <TabBar active="Journey" />
    </div>
  );
}

/* The unemployment clock (components/task/opt-clock-card.tsx). */

function Field({ label, children, focused = false, tapAt }: { label: string; children: ReactNode; focused?: boolean; tapAt?: number }) {
  return (
    <div className="relative block rounded-[12px] px-3 pt-2 pb-1.5" style={{ background: "var(--r-fill)", boxShadow: focused ? "0 0 0 2px var(--r-leaf)" : "none", transition: "box-shadow 200ms" }}>
      {tapAt !== undefined && <Tap at={tapAt} x={60} y="62%" />}
      <span className="block text-[12px] font-medium" style={{ color: "var(--r-ink-2)" }}>
        {label}
      </span>
      <span className="flex items-center justify-between py-1 text-[15px] font-medium tabular-nums">
        {children}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </span>
    </div>
  );
}

const empty = <span style={{ color: "var(--r-ink-3)" }}>mm/dd/yyyy</span>;

function OptClock() {
  const { t } = useClock();
  const added = t >= P.add;
  // Days pass from the OPT start date (May 20, 2028) to the day before her job starts.
  const used = Math.round(1 + 22 * inOutCubic(span(t, P.tickFrom, P.tickTo - P.tickFrom)));
  const left = 90 - used;
  const typing = t >= P.type - 150 && t < P.add;
  const pressed = t >= P.add && t < P.add + 200;

  return (
    <div className="h-full px-4 pt-9">
      <Heading>Your unemployment days</Heading>
      <div className="mt-2.5 rounded-[20px] px-4 py-4" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
        <p className="flex items-baseline gap-2">
          <span className={`${display} text-[40px] leading-none tabular-nums`} style={tight}>
            {used}
          </span>
          <span className="text-[15px]" style={{ color: "var(--r-ink-2)" }}>
            of 90 days used
          </span>
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "var(--r-fill)" }}>
          <div className="h-full rounded-full" style={{ width: `${(used / 90) * 100}%`, background: "var(--r-leaf)" }} />
        </div>
        <div className="relative mt-2.5 min-h-[40px] text-[14px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.p key={added ? "working" : "counting"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4, ease }}>
              {added ? (
                "You’re working, so the clock is stopped. 67 days left."
              ) : (
                `${left} days left. If you stay unemployed, you reach the limit on Aug 17, 2028.`
              )}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-4 grid gap-2.5">
          <Field label="OPT start date (on your first OPT card)">05/20/2028</Field>
          <label className="flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[14px]" style={{ background: "var(--r-fill)" }}>
            <span className="size-4 shrink-0 rounded-[4px]" style={{ background: "#fff", boxShadow: "inset 0 0 0 1px var(--r-ink-3)" }} />
            On the STEM extension (150 days in total)
          </label>
        </div>

        <p className="mt-4 text-[13px] font-semibold">Your jobs</p>
        <p className="text-[12px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
          Jobs of at least 20 hours a week, related to your degree. Days in them don’t count.
        </p>
        <motion.div className="overflow-hidden" initial={false} animate={{ height: added ? "auto" : 0 }} transition={{ duration: 0.4, ease }}>
          <div className="mt-2 flex items-center gap-2 rounded-[12px] px-3 py-2 text-[14px]" style={{ background: "var(--r-fill)" }}>
            <span className="flex-1 tabular-nums">Jun 12, 2028 to now</span>
            <span className="p-1.5" style={{ color: "var(--r-ink-3)" }}>
              <Icon node={I.trash} size={16} />
            </span>
          </div>
        </motion.div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Field label="Started" focused={typing} tapAt={P.type - 150}>
            {added ? empty : <Typed text="06/12/2028" at={P.type} placeholder="mm/dd/yyyy" />}
          </Field>
          <Field label="Ended (empty if still there)">{empty}</Field>
          <motion.span
            className="relative col-span-2 inline-flex h-9 items-center justify-center gap-2 rounded-full px-4 text-[14px] font-semibold"
            style={{ background: pressed ? "var(--r-surface-2)" : "var(--r-surface)", boxShadow: "inset 0 0 0 1px var(--r-line)" }}
            animate={{ scale: pressed ? 0.97 : 1 }}
            transition={{ duration: 0.12 }}
          >
            <Tap at={P.add} x="50%" y="50%" />
            <Icon node={I.plus} size={16} /> Add job
          </motion.span>
        </div>
        {added && (
          <motion.p className="mt-2 text-[13px]" style={{ color: "var(--r-leaf-ink)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.3 }}>
            Saved
          </motion.p>
        )}
      </div>
      <p className="mt-3 px-1 text-[12px] leading-snug" style={{ color: "var(--r-ink-3)" }}>
        Reloco counts the calendar days since your OPT start date that aren’t covered by a job you entered. It’s a guide: ISSS and SEVP keep the official count.
      </p>
      <TaskBar />
    </div>
  );
}

function Opt() {
  const { t } = useClock();
  // A push, as when a row opens its task: the new page slides over, Journey eases back.
  const push = inOutCubic(span(t, B, 550));
  return (
    <Scene className="relative h-full overflow-hidden">
      <div className="absolute inset-0" style={{ transform: `translateX(${-90 * push}px)`, filter: `brightness(${1 - 0.25 * push})` }}>
        {push < 1 && <Journey />}
      </div>
      {push > 0 && (
        <div className="absolute inset-0" style={{ transform: `translateX(${(1 - push) * 100}%)`, background: "var(--r-canvas)", boxShadow: "-12px 0 30px -12px rgb(19 41 75 / 0.3)" }}>
          <OptClock />
        </div>
      )}
    </Scene>
  );
}

export const scene = { Scene: Opt, duration: OPT_MS };
