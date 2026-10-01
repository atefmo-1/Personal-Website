"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { useClock } from "./Stage";
import { At, Scene, Tap, ease } from "./ui";

// A task, done step by step: the page opens on "Pack your entry documents", scrolls to its steps,
// and a fingertip ticks them in order. Each tick unlocks the next step (dashed until then), the
// counter goes up and the bar counts down until it turns into Complete.

const STEPS: { text: string; link?: string }[] = [
  { text: "Check that page 1 of your I-20 is signed by you and your DSO.", link: "ISSS: Pre-arrival steps" },
  { text: "Print your SEVIS I-901 fee receipt.", link: "SEVIS I-901 fee (FMJfee.com)" },
  { text: "Print your admission letter and proof of funding." },
  { text: "Put everything in one folder in your carry-on." },
];
const MILES = 80;

const SCROLL = 1500;
// Ticks a little over a second apart: long enough to see the counter and the bar answer.
const TICKS = [2700, 3800, 4900, 6000];
const COMPLETE = TICKS[3] + 250;
export const TASK_STEPS_MS = COMPLETE + 2700;

// The immigration category's ink, for its badge (not in the stage palette).
const CAT = "#2f5f8f";

function Icon({ size = 16, stroke = 2, children }: { size?: number; stroke?: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

/** The painted header, as on every task page. */
function Header() {
  const { t, duration } = useClock();
  // A slow push-in on the painting over the whole loop.
  const zoom = 1.08 - 0.08 * Math.min(1, t / duration);
  return (
    <At at={0} from={{ opacity: 0, scale: 0.97 }}>
      <header className="relative overflow-hidden rounded-[28px] px-4 pt-3 pb-5 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ transform: `scale(${zoom})` }}>
            <Image src="/projects/reloco/motion/cat-immigration.webp" alt="" fill sizes="400px" className="object-cover" priority />
          </div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgb(10 20 40 / 0.7), transparent 60%)" }} />
        </div>
        <div className="relative">
          <span className="inline-flex h-10 items-center gap-0.5 rounded-full bg-white/15 pr-3.5 pl-2 text-[14px] font-semibold ring-1 ring-white/25 backdrop-blur-md">
            <Icon size={20}>
              <path d="m15 18-6-6 6-6" />
            </Icon>
            Today
          </span>
          <At at={250} from={{ opacity: 0, y: 10 }}>
            <div className="mt-16 flex items-center gap-2">
              <span
                className="grid size-8 place-items-center rounded-full ring-2 ring-white/30"
                style={{ color: CAT, background: `color-mix(in oklab, ${CAT} 13%, var(--r-surface))`, boxShadow: `inset 0 0 0 1.5px ${CAT}, inset 0 0 0 3.5px var(--r-surface), inset 0 0 0 4.5px color-mix(in oklab, ${CAT} 45%, transparent)` }}
              >
                <Icon size={15}>
                  <path d="M5 22h14" />
                  <path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z" />
                  <path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3c-1.66 0-3 1-3 3s1 2 1 3.5V13" />
                </Icon>
              </span>
              <span className="text-[13px] font-medium text-white/90 drop-shadow-[0_1px_6px_rgb(0_0_0/0.5)]">Immigration · Pre-flight</span>
            </div>
            <h1 className={`${relocoDisplay.className} mt-2 text-[36px] leading-[1.02] drop-shadow-[0_1px_10px_rgb(0_0_0/0.35)]`}>Pack your entry documents in your carry-on</h1>
          </At>
          <At at={450} from={{ opacity: 0, y: 8 }}>
            <div className="mt-4 flex flex-wrap gap-1.5 text-[12px] font-semibold">
              <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-md">Due tomorrow</span>
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-md">
                <Icon size={14}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </Icon>
                ~20 min
              </span>
              <span className="rounded-full px-2.5 py-1 text-[#2b1d00]" style={{ background: "var(--r-gold)" }}>
                ✦ +{MILES}
              </span>
            </div>
          </At>
        </div>
      </header>
    </At>
  );
}

/** One step: its tick box, its text, and the source link when it has one. */
function StepRow({ i, done }: { i: number; done: number }) {
  const { t } = useClock();
  const s = STEPS[i];
  const checked = t >= TICKS[i];
  // Steps go in order: only the one after the last tick is open, the rest wait (dashed).
  const locked = !checked && i > done;
  const upNext = i === done && i > 0 && !checked;
  return (
    <li className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: i < STEPS.length - 1 ? "1px solid var(--r-line)" : "none" }}>
      <span className="relative mt-0.5 shrink-0">
        <Tap at={TICKS[i]} x="50%" y="50%" />
        <motion.span
          className="grid size-[26px] place-items-center rounded-full border-2"
          style={{
            background: checked ? "var(--r-success)" : "transparent",
            borderColor: checked ? "var(--r-success)" : locked ? "rgb(142 150 166 / 0.4)" : "rgb(142 150 166 / 0.75)",
            borderStyle: locked ? "dashed" : "solid",
            transition: "background 200ms, border-color 200ms",
          }}
          initial={false}
          animate={checked ? { scale: [1, 1.18, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
            <motion.path
              d="M3.5 8.5 6.5 11.5 12.5 5"
              fill="none"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
              transition={{ duration: 0.25, delay: checked ? 0.05 : 0 }}
            />
          </svg>
        </motion.span>
      </span>
      <div className="min-w-0 flex-1">
        <span
          className="block text-[16px] leading-[1.45]"
          style={{
            color: checked ? "var(--r-ink-3)" : "var(--r-ink)",
            textDecorationLine: "line-through",
            textDecorationColor: checked ? "rgb(142 150 166 / 0.6)" : "transparent",
            transition: "color 300ms, text-decoration-color 300ms",
          }}
        >
          {s.text}
        </span>
        <AnimatePresence initial={false}>
          {upNext && (
            <motion.span
              key="next"
              className="block overflow-hidden text-[12px] font-medium"
              style={{ color: "var(--r-leaf-ink)" }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
            >
              <span className="block pt-1">Up next</span>
            </motion.span>
          )}
        </AnimatePresence>
        {s.link && (
          <span className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full py-1 pr-3 pl-2.5 text-[13px] font-semibold" style={{ background: "var(--r-leaf-soft)", color: "var(--r-leaf-ink)" }}>
            <Icon size={14}>
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </Icon>
            <span className="truncate">{s.link}</span>
          </span>
        )}
      </div>
    </li>
  );
}

/** The bar over the page (drawn like ui's TaskBar): counts the steps left, then lights up as Complete. */
function Bar({ done }: { done: number }) {
  const left = STEPS.length - done;
  const allDone = left === 0;
  const label = allDone ? "complete" : `${left}`;
  return (
    <div className="absolute right-4 bottom-5 left-4 z-20 flex items-center gap-2 rounded-full p-1.5" style={{ background: "var(--r-surface)", boxShadow: "0 10px 30px -12px rgb(19 41 75 / 0.35)" }}>
      <motion.div
        className="flex h-12 flex-1 items-center justify-between overflow-hidden rounded-full pr-1.5 pl-5 text-[16px] font-semibold"
        style={{ background: allDone ? "var(--r-primary)" : "#8f96a5", color: "var(--r-on-primary)", transition: "background 350ms" }}
        initial={false}
        animate={allDone ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="relative h-6 flex-1">
          <AnimatePresence initial={false}>
            <motion.span key={label} className="absolute inset-0 whitespace-nowrap" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.32, ease }}>
              {allDone ? (
                <>
                  Complete <span style={{ color: "var(--r-gold)" }}>✦ +{MILES}</span>
                </>
              ) : (
                `${left} ${left === 1 ? "step" : "steps"} to go`
              )}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="grid size-9 place-items-center rounded-full" style={{ background: allDone ? "var(--r-leaf)" : "rgb(255 255 255 / 0.25)", color: allDone ? "#13294b" : "white", transition: "background 350ms, color 350ms" }}>
          <Icon size={20} stroke={2.8}>
            <path d="M20 6 9 17l-5-5" />
          </Icon>
        </span>
      </motion.div>
      <span className="px-3 text-[16px] font-semibold" style={{ color: "var(--r-ink)" }}>
        Skip
      </span>
    </div>
  );
}

function TaskSteps() {
  const { t } = useClock();
  const done = TICKS.filter((x) => t >= x).length;
  return (
    <Scene className="relative h-full">
      {/* The page scrolls once, from the header to the steps, as you would. */}
      <motion.div className="px-3" initial={false} animate={{ y: t >= SCROLL ? -150 : 0 }} transition={{ duration: 0.95, ease }}>
        <div className="flex h-14 items-end px-2 pb-1">
          <span className={`${relocoDisplay.className} text-[30px] leading-none`} style={{ color: "var(--r-ink)" }}>
            reloco
          </span>
        </div>
        <div className="mt-3">
          <Header />
        </div>

        <At at={600}>
          <p className="mt-4 px-1 text-[16px] leading-[1.5]" style={{ color: "var(--r-ink-2)" }}>
            At the border an officer can ask for your passport, visa, signed I-20 and proof of funding.{" "}
            <span className="font-semibold" style={{ color: "var(--r-ink)" }}>
              More
            </span>
          </p>
        </At>

        <At at={750} from={{ opacity: 0, y: 16 }}>
          <section className="mt-6">
            <div className="mb-2.5 flex items-baseline justify-between px-1">
              <h2 className={`${relocoDisplay.className} text-[26px] leading-none`}>Steps</h2>
              <span className="relative inline-flex overflow-hidden text-[13px] font-semibold tabular-nums" style={{ color: "var(--r-ink-2)" }}>
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span key={done} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.3, ease }}>
                    {done}
                  </motion.span>
                </AnimatePresence>
                &nbsp;of {STEPS.length}
              </span>
            </div>
            <ol className="overflow-hidden rounded-[20px]" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
              {STEPS.map((_, i) => (
                <StepRow key={i} i={i} done={done} />
              ))}
            </ol>
          </section>
        </At>
      </motion.div>

      <Bar done={done} />
    </Scene>
  );
}

export const scene = { Scene: TaskSteps, duration: TASK_STEPS_MS };
