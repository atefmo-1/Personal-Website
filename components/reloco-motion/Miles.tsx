"use client";

import { motion } from "framer-motion";
import { useMemo, type ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { H, W, useClock } from "./Stage";
import { ICONS, Icon, TaskHeader, art, span } from "./Sources";
import { Scene, Tap } from "./ui";

// Miles for a task: the last step of "Get a US phone number" is ticked, the bar lights up as
// "Complete", and a tap brings the app's reward card: a check, "Nice work.", the miles counting
// up, and the week's goal. Copy and layout follow the app's celebration (components/game).

const outQuart = (p: number) => 1 - (1 - p) ** 4;

// canvas-confetti, redrawn on the scene's clock so every loop (and the still frame) is the same.
// Same physics as the library: speed decays 10% a tick, gravity pulls 3px a tick, flakes flutter
// and fade out over their life. Same palette as the app: Carolina blue, gold, navy, white.
const COLORS = ["#4b9cd3", "#e6b04a", "#13294b", "#ffffff"];
type Burst = { at: number; count: number; angle?: number; spread: number; velocity: number; x: number; y: number; ticks: number; scalar: number; seed: number };

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Confetti({ bursts }: { bursts: Burst[] }) {
  const { t } = useClock();
  const flakes = useMemo(
    () =>
      bursts.flatMap((b) => {
        const r = rng(b.seed);
        return Array.from({ length: b.count }, () => {
          const angle = -((b.angle ?? 90) * Math.PI) / 180 + ((b.spread / 2 - r() * b.spread) * Math.PI) / 180;
          return {
            b,
            angle,
            v: b.velocity * 0.5 + r() * b.velocity,
            color: COLORS[Math.floor(r() * COLORS.length)],
            round: r() < 0.5,
            wobble: r() * 10,
            wobbleSpeed: Math.min(0.11, r() * 0.1 + 0.05),
            tilt: r() * Math.PI,
            life: b.ticks * (0.85 + r() * 0.15),
          };
        });
      }),
    [bursts],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[80] overflow-hidden">
      {flakes.map((f, i) => {
        const n = (t - f.b.at) / (1000 / 60);
        if (n < 0 || n > f.life) return null;
        const travel = (f.v * (1 - 0.9 ** n)) / 0.1;
        const x = f.b.x * W + Math.cos(f.angle) * travel;
        const y = f.b.y * H + Math.sin(f.angle) * travel + 3 * n;
        const wobble = f.wobble + f.wobbleSpeed * n;
        const size = (f.round ? 8 : 10) * f.b.scalar;
        return (
          <span
            key={i}
            className="absolute top-0 left-0"
            style={{
              width: size,
              height: f.round ? size * 0.75 : size * 0.6,
              borderRadius: f.round ? "50%" : 1,
              background: f.color,
              opacity: Math.min(1, 1.4 * (1 - n / f.life)),
              boxShadow: f.color === "#ffffff" ? "0 0 0 0.5px rgb(19 41 75 / 0.12)" : undefined,
              transform: `translate(${x + 6 * f.b.scalar * Math.cos(wobble)}px, ${y + 6 * f.b.scalar * Math.sin(wobble)}px) rotate(${f.tilt + 0.1 * n}rad) scaleY(${0.25 + 0.75 * Math.abs(Math.sin(wobble * 1.7))})`,
            }}
          />
        );
      })}
    </div>
  );
}

/** The app's reward card over a blurred page, from `at`. `top` is the check or the stamp. */
export function Reward({ at, top, title, miles, total, extra, thudAt, exitAt }: { at: number; top: ReactNode; title: ReactNode; miles: number; total: string; extra?: ReactNode; /** A stamp lands: the card gives a little. */ thudAt?: number; /** Tapped away: the card and the blur go. */ exitAt?: number }) {
  const { t } = useClock();
  if (t < at) return null;
  const count = Math.round(miles * outQuart(span(t, at + 250, at + 1250)));
  const counted = t >= at + 1250;
  const leaving = exitAt !== undefined && t >= exitAt;
  const thud = thudAt === undefined ? 0 : 4 * Math.sin(Math.PI * span(t, thudAt, thudAt + 240));
  return (
    <motion.div className="absolute inset-0 z-[70] grid place-items-center px-6" style={{ background: "rgb(244 238 227 / 0.7)", backdropFilter: "blur(12px)" }} initial={{ opacity: 0 }} animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: leaving ? 0.35 : 0.25 }}>
      <motion.div
        className="flex w-full max-w-[320px] flex-col items-center rounded-[20px] px-6 pt-8 pb-6 text-center"
        style={{ background: "var(--r-surface)", boxShadow: "0 22px 50px -14px rgb(19 41 75 / 0.35), 0 0 0 1px rgb(19 41 75 / 0.06)", position: "relative", top: thud }}
        initial={{ scale: 0.9, y: 16 }}
        animate={{ scale: leaving ? 0.96 : 1, y: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        {top}
        {title}
        <p className="mt-2 flex items-baseline gap-1.5" style={{ color: "var(--r-gold-ink)" }}>
          {/* The sparkle turns once as the count lands. */}
          <motion.span aria-hidden className="inline-block" animate={counted ? { rotate: [0, 90], scale: [1, 1.5, 1] } : {}} transition={{ duration: 0.5, ease: "easeOut" }}>
            ✦
          </motion.span>
          <span className={`${relocoDisplay.className} text-[34px] tabular-nums`}>+{count}</span>
          <span className="text-[15px] font-semibold">miles</span>
        </p>
        <p className="mt-1 text-[13px]" style={{ color: "var(--r-ink-2)" }}>
          {total} miles total
        </p>
        {extra}
        <p className="mt-5 text-[12px]" style={{ color: "var(--r-ink-3)" }}>
          Tap anywhere to continue
        </p>
      </motion.div>
    </motion.div>
  );
}

const TICK = 1100;
const READY = TICK + 380;
const COMPLETE = READY + 1300;
const OPEN = COMPLETE + 220;
const GOAL = OPEN + 1500;
export const MILES_MS = GOAL + 2700;

const STEPS = ["Check that your phone is unlocked and supports eSIM.", "Compare prepaid plans. They don't need a credit check or an SSN.", "Activate an eSIM before you fly, or buy a SIM when you land."];

/** A step's checkbox: ticked ones are filled, and one ticked at `at` pops as the check draws. */
export function StepCheck({ at }: { at?: number }) {
  const { t } = useClock();
  const checked = at === undefined || t >= at;
  return (
    <motion.span
      className="mt-0.5 grid size-[26px] shrink-0 place-items-center rounded-full"
      style={{ background: checked ? "var(--r-success)" : "transparent", boxShadow: checked ? "none" : "inset 0 0 0 2px rgb(142 150 166 / 0.6)", transition: "background 150ms" }}
      animate={at !== undefined && checked ? { scale: [1, 1.18, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <svg viewBox="0 0 16 16" width={14} height={14} aria-hidden>
        <motion.path d="M3.5 8.5 6.5 11.5 12.5 5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }} transition={{ duration: 0.22 }} />
      </svg>
    </motion.span>
  );
}

/** The task page's bar: steps left until every step is ticked, then "Complete" and its miles. */
export function CompleteBar({ ready, miles, left, tapAt }: { ready: boolean; miles: number; left: string; tapAt: number }) {
  const { t } = useClock();
  const pressed = t >= tapAt && t < tapAt + 200;
  return (
    <div className="absolute right-4 bottom-5 left-4 flex items-center gap-2 rounded-full p-1.5" style={{ background: "var(--r-surface)", boxShadow: "0 10px 30px -12px rgb(19 41 75 / 0.35)" }}>
      <motion.div
        className="relative flex h-12 flex-1 items-center justify-between rounded-full pr-1.5 pl-5 text-[16px] font-semibold text-white"
        style={{ background: ready ? "var(--r-primary)" : "#8f96a5", transition: "background 300ms" }}
        animate={{ scale: pressed ? 0.97 : ready ? [1, 1.03, 1] : 1 }}
        transition={{ duration: pressed ? 0.15 : 0.5 }}
      >
        <Tap at={tapAt} x="58%" y="50%" />
        {ready ? (
          <span>
            Complete <span style={{ color: "var(--r-gold)" }}>✦ +{miles}</span>
          </span>
        ) : (
          left
        )}
        <span className="grid size-9 place-items-center rounded-full" style={{ background: ready ? "var(--r-leaf)" : "rgb(255 255 255 / 0.25)", color: ready ? "var(--r-ink)" : "white", transition: "background 300ms" }}>
          <Icon node={ICONS.check} size={20} stroke={2.8} />
        </span>
      </motion.div>
      <span className="px-3 text-[16px] font-semibold" style={{ color: "var(--r-ink)" }}>
        Skip
      </span>
    </div>
  );
}

const BURST: Burst[] = [{ at: OPEN + 120, count: 36, spread: 58, velocity: 28, x: 0.5, y: 0.5, ticks: 160, scalar: 0.8, seed: 7 }];

function Miles() {
  const { t } = useClock();
  const ticked = t >= TICK;
  return (
    <Scene className="relative h-full overflow-hidden">
      <div className="px-3 pt-3">
        <TaskHeader painting={art("cat-technology")} icon={ICONS.smartphone} ink="#5b6068" label="Tech · Pre-flight" title="Get a US phone number" chips={[{ text: "Due Oct 3" }, { text: "~30 min", clock: true }]} miles={60} />
        <p className="mt-4 px-1 text-[16px] leading-[1.5]" style={{ color: "var(--r-ink-2)" }}>
          Banks, your school and two-step logins all want a US number, and you’ll want working data at the airport to reach your ride.
        </p>
        <section className="mt-6">
          <div className="mb-2.5 flex items-baseline justify-between px-1">
            <h2 className={`${relocoDisplay.className} text-[26px] leading-none`}>Steps</h2>
            <span className="text-[13px] font-semibold tabular-nums" style={{ color: "var(--r-ink-2)" }}>
              {ticked ? 3 : 2} of 3
            </span>
          </div>
          <div className="overflow-hidden rounded-[20px]" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
            {STEPS.map((s, i) => {
              const done = i < 2 || ticked;
              return (
                <div key={s} className="relative flex items-start gap-3 px-4 py-3" style={{ borderTop: i ? "1px solid var(--r-line)" : "none" }}>
                  {i === 2 && <Tap at={TICK} x={29} y={27} />}
                  <StepCheck at={i === 2 ? TICK : undefined} />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[15px] leading-[1.45]" style={{ color: done ? "var(--r-ink-3)" : "var(--r-ink)", textDecorationLine: done ? "line-through" : "none", textDecorationColor: "rgb(142 150 166 / 0.5)", transition: "color 250ms" }}>
                      {s}
                    </span>
                    {i === 2 && (
                      // Folds away rather than vanishing, so the page below eases up.
                      <motion.span className="block overflow-hidden text-[12px] font-medium" style={{ color: "var(--r-leaf-ink)" }} initial={false} animate={ticked ? { height: 0, opacity: 0, marginTop: 0 } : { height: 18, opacity: 1, marginTop: 4 }} transition={{ duration: 0.3 }}>
                        Up next
                      </motion.span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-2.5 flex items-baseline justify-between gap-3 px-1">
            <h2 className={`${relocoDisplay.className} text-[26px] leading-none`}>Bring</h2>
            <span className="text-[13px] font-semibold" style={{ color: "var(--r-leaf-ink)" }}>
              All on file
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-[20px] px-4 py-3" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
            <span className="grid size-7 shrink-0 place-items-center rounded-full" style={{ background: "var(--r-leaf)", color: "var(--r-ink)" }}>
              <Icon node={ICONS.check} size={16} stroke={3} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] leading-tight font-semibold">Passport</p>
              <p className="mt-0.5 text-[13px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
                On file · expires Jun 1, 2034
              </p>
            </div>
          </div>
        </section>
      </div>

      <CompleteBar ready={t >= READY} miles={60} left="1 step to go" tapAt={COMPLETE} />

      <MilesReward />
    </Scene>
  );
}

function MilesReward() {
  const { t } = useClock();
  return (
    <>
      <Reward
        at={OPEN}
        top={
          <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden>
            <motion.circle cx="32" cy="32" r="30" fill="var(--r-success)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 18 }} style={{ originX: "50%", originY: "50%" }} />
            <motion.path d="M19 33.5 28 42 45 24" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }} />
          </svg>
        }
        title={<p className={`${relocoDisplay.className} mt-4 text-[26px] leading-tight`}>Nice work.</p>}
        miles={60}
        total="60"
        extra={
          // Holds its line from the start, so the card doesn't grow when it shows.
          <motion.p className="mt-4 text-[13px] font-medium" style={{ color: "var(--r-ink-2)" }} initial={{ opacity: 0, y: 6 }} animate={t >= GOAL ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }} transition={{ duration: 0.45 }}>
            2 more this week for your goal
          </motion.p>
        }
      />
      <Confetti bursts={BURST} />
    </>
  );
}

export const scene = { Scene: Miles, duration: MILES_MS };
