"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useClock } from "./Stage";
import { At, Card, Heading, Scene, Tap, TaskBar, Verdict, ease } from "./ui";

// The SSA visit plan, in action: Reloco checks what has to be ready first, Mei types her job's
// start date and SSA's 30-day rule answers with the first day she can apply, then the rest of
// the plan unfolds: start online, then book the Durham office.

const ROWS = [550, 950, 1350, 1750];
const START = "11/16/2026";
const TAP = 2650;
const TYPE = TAP + 150;
const SPEED = 75;
const RESOLVE = TYPE + START.length * SPEED + 450;
const PLAN = RESOLVE + 1100;
export const SSA_VISIT_MS = PLAN + 4000;

function Icon({ size = 16, children }: { size?: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

function Step({ n, title, first }: { n: number; title: string; first?: boolean }) {
  return (
    <h3 className={`${first ? "mt-3" : "mt-4"} mb-2 flex items-center gap-2 px-1 text-[16px] font-semibold`}>
      <span className="grid size-[22px] place-items-center rounded-full text-[12px] tabular-nums" style={{ background: "var(--r-ink)", color: "var(--r-canvas)" }}>
        {n}
      </span>
      {title}
    </h3>
  );
}

/** A readiness check: its verdict, the text, and Open when it links to the task that fixes it. */
function Ready({ i, ok, text, open }: { i: number; ok: boolean; text: string; open?: boolean }) {
  return (
    <At at={ROWS[i]} from={{ opacity: 0, y: 8 }}>
      <div className="flex items-center gap-3.5 px-4 py-3.5" style={{ borderTop: i === 0 ? "none" : "1px solid var(--r-line)" }}>
        <Verdict ok={ok} at={ROWS[i] + 220} />
        <p className="min-w-0 flex-1 text-[16px] leading-snug">{text}</p>
        {open && (
          <span className="shrink-0 rounded-full px-4 py-2 text-[15px] font-semibold" style={{ background: "var(--r-fill)", color: "var(--r-leaf-ink)" }}>
            Open
          </span>
        )}
      </div>
    </At>
  );
}

/** The job's start date: typed into a date field, then checked against SSA's 30-day rule. */
function JobStart() {
  const { t } = useClock();
  const n = t < TYPE ? 0 : Math.min(START.length, Math.floor((t - TYPE) / SPEED) + 1);
  const focused = t >= TAP && t < RESOLVE - 200;
  const resolved = t >= RESOLVE;
  return (
    <At at={ROWS[3]} from={{ opacity: 0, y: 8 }}>
      <div className="px-4 py-3.5" style={{ borderTop: "1px solid var(--r-line)" }}>
        <div className="flex items-center gap-3">
          {/* Remounts when the date is in, so the new verdict pops like the others. */}
          <Verdict key={resolved ? "date" : "ask"} ok={resolved ? false : null} at={resolved ? RESOLVE : ROWS[3] + 220} />
          <p className="min-w-0 flex-1 text-[16px] leading-tight font-semibold">When does your job start?</p>
          <span className="relative flex h-10 shrink-0 items-center gap-2 rounded-[10px] px-3 text-[15px] font-medium tabular-nums" style={{ background: "var(--r-fill)", boxShadow: focused ? "0 0 0 2px var(--r-leaf)" : "none", transition: "box-shadow 200ms" }}>
            <Tap at={TAP} x="40%" y="50%" />
            {/* A date field fills in place: what's typed, then the rest of the mm/dd/yyyy mask. */}
            <span>
              {START.slice(0, n)}
              <span style={{ color: "var(--r-ink-3)" }}>{"mm/dd/yyyy".slice(n)}</span>
            </span>
            <Icon size={17}>
              <path d="M8 2v4M16 2v4M3 10h18" />
              <rect x="3" y="4" width="18" height="18" rx="2" />
            </Icon>
          </span>
        </div>
        {resolved && (
          <motion.p className="mt-1.5 pl-[52px] text-[14px] leading-snug" style={{ color: "var(--r-urgent-ink)" }} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease, delay: 0.15 }}>
            That’s more than 30 days away. SSA can’t take it until Oct 17.
          </motion.p>
        )}
      </div>
    </At>
  );
}

function SsaVisit() {
  const { t } = useClock();
  return (
    <Scene className="relative h-full">
      {/* Once the checks are in, the page scrolls on to the rest of the plan. */}
      <motion.div className="px-4 pt-9" initial={false} animate={{ y: t >= PLAN ? -176 : 0 }} transition={{ duration: 1, ease }}>
        <Heading
          right={
            t >= RESOLVE + 350 && (
              <motion.span className="text-[13px] font-semibold" style={{ color: "var(--r-ink-2)" }} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                Not yet
              </motion.span>
            )
          }
        >
          Your SSA visit
        </Heading>

        <At at={250} from={{ opacity: 0, y: 8 }}>
          <Step first n={1} title="Make sure you’re ready" />
        </At>
        <At at={350} from={{ opacity: 0, y: 14 }}>
          <Card className="min-h-[330px] overflow-hidden">
            <Ready i={0} ok={false} text="You need your on-campus job offer first." open />
            <Ready i={1} ok={false} text="Check in with ISSS first. SSA checks your record with DHS." open />
            <Ready i={2} ok={true} text="Your passport, I-20 and I-94 are in Documents. Bring the originals." />
            <JobStart />
          </Card>
        </At>

        <At at={PLAN - 150} from={{ opacity: 0, y: 24 }}>
          <Step n={2} title="Start your application online" />
          <Card className="px-4 py-4">
            <p className="text-[16px] leading-snug">Then you have 45 days to visit an office with your originals.</p>
            <span className="mt-3 flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold" style={{ background: "var(--r-primary)", color: "var(--r-on-primary)" }}>
              Start at ssa.gov
              <Icon>
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </Icon>
            </span>
            <p className="mt-3 text-[14px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
              Can’t start online? Fill in{" "}
              <span className="font-semibold" style={{ color: "var(--r-leaf-ink)" }}>
                Form SS-5
              </span>{" "}
              and bring it instead.
            </p>
          </Card>
        </At>

        <At at={PLAN + 350} from={{ opacity: 0, y: 24 }}>
          <Step n={3} title="Book your visit" />
          <Card className="px-4 py-4">
            <p className="text-[16px] leading-snug">SSA may let you book a time online once you’ve started. If not, call before you go: some offices need an appointment.</p>
            <div className="mt-3 flex items-center gap-3 rounded-[12px] px-3 py-2.5" style={{ background: "var(--r-fill)" }}>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold whitespace-nowrap">Durham SSA office</p>
                <p className="text-[13px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
                  3511 Shannon Road, Suite 200, Durham
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)", color: "var(--r-leaf-ink)" }}>
                <Icon size={14}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </Icon>
                1-888-759-3908
              </span>
            </div>
          </Card>
        </At>
      </motion.div>

      <TaskBar label="6 steps to go" />
    </Scene>
  );
}

export const scene = { Scene: SsaVisit, duration: SSA_VISIT_MS };
