"use client";

import { AnimatePresence, cubicBezier, motion } from "framer-motion";
import type { ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { Scene, Tap, ease } from "./ui";
import { useClock } from "./Stage";

// The plan being built: the engine streams each stage to the setup screen, the areas of the plan
// pop in with their task counts, and the plane lands at RDU. Ziad is the invented student from the
// case study's screenshot: 35 tasks across 9 areas.

const NAME = "Ziad";
const STEPS = ["Reading your answers", "Picking the tasks that apply to you", "Scheduling around your dates", "Printing your boarding pass"];

// Each step runs, then is done; the next starts as the last one finishes.
const RUN = [700, 2000, 4900, 5800];
const DONE = [1500, 4600, 5500, 6700];
const CHIPS_AT = 2350;
const CHIP_GAP = 240;
const LANDED = DONE[3] + 350;
const BOARD = LANDED + 2300;
const DURATION = BOARD + 1000;

/** What the line under the title says, and from when: the running stage, or what the last one found. */
const STATUS: [number, string][] = [
  [0, "Warming up the engines"],
  [RUN[0], STEPS[0]],
  [DONE[0], "F-1 · University of North Carolina at Chapel Hill"],
  [RUN[1], STEPS[1]],
  [DONE[1], "35 tasks apply to you"],
  [RUN[2], STEPS[2]],
  [RUN[3], STEPS[3]],
  [LANDED, "35 tasks across 9 areas, in the right order."],
];

const AREAS = [
  { name: "Immigration", count: 7, color: "#2f5f8f", icon: <path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1zM5 22h14" /> },
  { name: "IDs", count: 2, color: "#7a4e8c", icon: <><path d="M13 19a4 4 0 0 0-8 0M16 10h2M16 14h2" /><circle cx="9" cy="12" r="3" /><rect x="2" y="5" width="20" height="14" rx="2" /></> },
  { name: "Banking", count: 3, color: "#3c7a4a", icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 14h2" /></> },
  { name: "Housing", count: 4, color: "#b5553a", icon: <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
  { name: "Campus", count: 4, color: "#4e86b8", icon: <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0zM22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5" /> },
  { name: "Work", count: 5, color: "#2f7d78", icon: <><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect x="2" y="6" width="20" height="14" rx="2" /></> },
  { name: "Health", count: 2, color: "#b8434b", icon: <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /> },
  { name: "Tech", count: 2, color: "#5b6068", icon: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></> },
  { name: "Taxes", count: 6, color: "#9a7428", icon: <path d="M12 17V7M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z" /> },
];

/** A category mark in passport ink: a double ring in the area's color around its icon. */
function IconTile({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      className="grid size-8 shrink-0 place-items-center rounded-full"
      style={{ color, background: `color-mix(in oklab, ${color} 13%, #fffbf4)`, boxShadow: `inset 0 0 0 1.5px ${color}, inset 0 0 0 3.5px #fffbf4, inset 0 0 0 4.5px color-mix(in oklab, ${color} 45%, transparent)` }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </span>
  );
}

// The arc over the painting. While the plan builds, the plane swings back and forth along it;
// when it's done, it lands at RDU.
const P0 = [20, 150];
const P1 = [200, -30];
const P2 = [380, 150];
const ARC = "M 20 150 Q 200 -30 380 150";
const LUT = (() => {
  const pts: { x: number; y: number; s: number }[] = [];
  let s = 0;
  for (let i = 0; i <= 120; i++) {
    const u = i / 120;
    const x = (1 - u) ** 2 * P0[0] + 2 * (1 - u) * u * P1[0] + u * u * P2[0];
    const y = (1 - u) ** 2 * P0[1] + 2 * (1 - u) * u * P1[1] + u * u * P2[1];
    if (i) s += Math.hypot(x - pts[i - 1].x, y - pts[i - 1].y);
    pts.push({ x, y, s });
  }
  return pts.map((p) => ({ ...p, s: p.s / s }));
})();
function along(v: number) {
  const at = Math.max(0.002, Math.min(0.998, v));
  const i = Math.max(1, LUT.findIndex((p) => p.s >= at));
  const a = LUT[i - 1];
  const b = LUT[i];
  const k = (at - a.s) / (b.s - a.s || 1);
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
}
const sway = cubicBezier(0.42, 0, 0.58, 1);
const land = cubicBezier(...ease);
function swinging(t: number) {
  // 0.05 to 0.85 and back, 2.6 s each way, as on the real screen.
  const k = (t / 2600) % 2;
  return 0.05 + 0.8 * sway(k <= 1 ? k : 2 - k);
}
const flight = (t: number) => (t < LANDED ? swinging(t) : swinging(LANDED) + (1 - swinging(LANDED)) * land(Math.min(1, (t - LANDED) / 900)));

const PLANE = "M8 0C8-.9 7-1.4 6-1.4H-1L-5-8H-7L-4.5-1.4-8-1.3-10-4H-11.5L-10.5 0-11.5 4H-10L-8 1.3-4.5 1.4-7 8H-5L-1 1.4H6C7 1.4 8 .9 8 0Z";

function FlightArc() {
  const { t } = useClock();
  const p = along(flight(t));
  return (
    <svg viewBox="0 0 400 170" className="mt-6 w-full overflow-visible" aria-hidden>
      <path d={ARC} fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" opacity="0.7" />
      <circle cx="20" cy="150" r="6" fill="#ffffff" />
      <circle cx="380" cy="150" r="6" fill="none" stroke="#ffffff" strokeWidth="3" />
      <text x="380" y="124" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">
        RDU
      </text>
      <g transform={`translate(${p.x} ${p.y}) rotate(${p.angle})`}>
        <circle r="20" fill="var(--r-surface)" style={{ filter: "drop-shadow(0 6px 14px rgb(0 0 0 / 0.15))" }} />
        <path transform="translate(2 0) scale(1.4)" d={PLANE} fill="var(--r-ink)" />
      </g>
    </svg>
  );
}

const Check = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function Step({ label, run, done }: { label: string; run: number; done: number }) {
  const { t } = useClock();
  const state = t >= done ? "done" : t >= run ? "running" : "waiting";
  return (
    <li className="flex items-center gap-3 text-[15px]" style={{ opacity: state === "waiting" ? 0.4 : 1, transition: "opacity 300ms" }}>
      <span className="relative grid size-5 shrink-0 place-items-center">
        {state === "done" ? (
          <motion.span className="grid size-5 place-items-center rounded-full text-white" style={{ background: "var(--r-success)" }} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 520, damping: 22 }}>
            <Check />
          </motion.span>
        ) : (
          <span
            className="size-5 rounded-full border-2"
            style={
              state === "running"
                ? { borderColor: "var(--r-leaf)", borderTopColor: "transparent", transform: `rotate(${((t - run) / 1000) * 360}deg)` }
                : { borderColor: "rgb(142 150 166 / 0.5)" }
            }
          />
        )}
      </span>
      <span>{label}</span>
    </li>
  );
}

/** The status line: the old text lifts away, then the new one rises in. Driven by the clock, so it keeps up however fast the stages go. */
function Status() {
  const { t } = useClock();
  const i = STATUS.findLastIndex(([at]) => t >= at);
  const since = t - STATUS[i][0];
  const leaving = i > 0 && since < 160;
  const k = leaving ? since / 160 : i === 0 ? 1 : Math.min(1, (since - 160) / 260);
  const text = leaving ? STATUS[i - 1][1] : STATUS[i][1];
  return (
    <p
      className="mt-2 h-6 w-full text-[16px]"
      style={{ color: "rgb(255 255 255 / 0.85)", textShadow: "0 1px 8px rgb(0 0 0 / 0.35)", opacity: leaving ? 1 - k : land(k), transform: `translateY(${leaving ? -6 * k : 6 * (1 - land(k))}px)` }}
    >
      {text}
    </p>
  );
}

function PlanBuild() {
  const { t } = useClock();
  const landed = t >= LANDED;
  const shown = AREAS.filter((_, i) => t >= CHIPS_AT + i * CHIP_GAP);
  const pressed = t >= BOARD && t < BOARD + 200;

  return (
    <Scene className="relative h-full overflow-hidden">
      {/* The painting, darkened at the top so the white type reads */}
      <div className="absolute inset-0" style={{ backgroundImage: "url(/projects/reloco/cs/hero-painting.webp)", backgroundSize: "cover", backgroundPosition: "30% 50%" }} />
      {/* This painting is brighter than the app's own, so its veil runs a little deeper. */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(10 20 40 / 0.6), rgb(10 20 40 / 0.18) 45%, transparent 62%)" }} />

      <div className="relative flex h-full flex-col px-3 pt-5 pb-3">
        <span className={`${relocoDisplay.className} self-start px-2 pt-1 text-[34px] leading-none text-white`} style={{ textShadow: "0 1px 12px rgb(0 0 0 / 0.45)" }}>
          reloco
        </span>

        <div className="flex flex-1 flex-col items-center text-center">
          <FlightArc />

          <div className="relative mt-4 h-[42px] w-full">
            <AnimatePresence initial={false}>
              <motion.h1
                key={landed ? "done" : "building"}
                className={`${relocoDisplay.className} absolute inset-x-0 text-[42px] leading-none tracking-[-0.015em] text-white`}
                style={{ textShadow: "0 1px 10px rgb(0 0 0 / 0.35)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease }}
              >
                {landed ? `Cleared for takeoff, ${NAME}.` : "Building your plan…"}
              </motion.h1>
            </AnimatePresence>
          </div>

          <Status />

          <div className="mt-auto w-full rounded-[28px] p-4" style={{ background: "rgb(255 251 244 / 0.95)", boxShadow: "0 22px 50px -14px rgb(19 41 75 / 0.35), 0 0 0 1px rgb(19 41 75 / 0.06)" }}>
            <ul className="flex min-h-[40px] flex-wrap justify-center gap-1.5">
              {shown.map((a) => (
                <motion.li
                  key={a.name}
                  layout
                  className="flex items-center gap-1.5 rounded-full py-1 pr-3 pl-1"
                  style={{ background: "var(--r-canvas)" }}
                  initial={{ opacity: 0, scale: 0.6, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                >
                  <IconTile color={a.color}>{a.icon}</IconTile>
                  <span className="text-[14px] font-semibold">{a.name}</span>
                  <span className="text-[13px] tabular-nums" style={{ color: "var(--r-ink-2)" }}>
                    {a.count}
                  </span>
                </motion.li>
              ))}
            </ul>

            <ol className="mx-auto mt-4 w-full max-w-[320px] space-y-2 text-left">
              {STEPS.map((label, i) => (
                <Step key={label} label={label} run={RUN[i]} done={DONE[i]} />
              ))}
            </ol>

            {/* Board arrives once the plan is saved, growing the sheet upward as on the real screen. */}
            {landed && (
              <motion.div className="w-full overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: 68, opacity: 1 }} transition={{ duration: 0.45, ease }}>
                <motion.div
                  className="relative mt-4 flex h-[52px] items-center justify-between rounded-full pr-1.5 pl-6 text-[16px] font-semibold"
                  style={{ background: "var(--r-primary)", color: "var(--r-on-primary)" }}
                  animate={{ scale: pressed ? 0.97 : 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <Tap at={BOARD} x="62%" y="50%" />
                  Board
                  <span className="grid size-10 place-items-center rounded-full" style={{ background: "var(--r-leaf)", color: "#13294b" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Scene>
  );
}

export const scene = { Scene: PlanBuild, duration: DURATION };
