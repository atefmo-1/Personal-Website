"use client";

import { motion } from "framer-motion";
import { createElement, type CSSProperties, type ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { useClock } from "./Stage";
import { Card, Scene, Tap, TaskBar, ease } from "./ui";

// Sourced and current: Ziad's task "Book a flight inside your entry window". The 30-day rule is
// marked, then the page scrolls to the step that links ISSS, the calendar button and the
// official sources. Only what the task page shows; strings and sources are the app's own
// (lib/library/tasks.ts, components/task/task-view.tsx).

/** 0 to 1 as the clock moves from `a` to `b`. */
export const span = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
export const outCubic = (p: number) => 1 - (1 - p) ** 3;
export const inOutCubic = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);

// Lucide icons, copied as data so the site needn't depend on lucide.
type IconNode = [string, Record<string, string>][];
export const ICONS = {
  chevronLeft: [["path", { d: "m15 18-6-6 6-6" }]],
  clock: [["circle", { cx: "12", cy: "12", r: "10" }], ["path", { d: "M12 6v6l4 2" }]],
  arrowUpRight: [["path", { d: "M7 7h10v10" }], ["path", { d: "M7 17 17 7" }]],
  calendarPlus: [["path", { d: "M16 18h6" }], ["path", { d: "M16 2v3" }], ["path", { d: "M19 15v6" }], ["path", { d: "M21 11.5V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8.3" }], ["path", { d: "M3 9h18" }], ["path", { d: "M8 2v3" }]],
  check: [["path", { d: "M20 6 9 17l-5-5" }]],
  stamp: [["path", { d: "M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13" }], ["path", { d: "M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z" }], ["path", { d: "M5 22h14" }]],
  smartphone: [["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2" }], ["path", { d: "M12 18h.01" }]],
  house: [["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }], ["path", { d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }]],
} satisfies Record<string, IconNode>;

export function Icon({ node, size = 16, stroke = 2, style }: { node: IconNode; size?: number; stroke?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0, ...style }}>
      {node.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}

/** Paintings from the app's series, copied to the site at a small size. */
export const art = (name: string) => `/projects/reloco/motion/${name}.webp`;

/** A task page's painted header, as in the app's task view. */
export function TaskHeader({ painting, icon, ink, label, title, chips, miles }: { painting: string; icon: IconNode; ink: string; label: string; title: string; chips: { text: string; clock?: boolean }[]; miles: number }) {
  const { t, duration } = useClock();
  // A slow push-in keeps the painting alive without asking for attention.
  const zoom = 1.08 - 0.08 * outCubic(span(t, 0, duration));
  const glass: CSSProperties = { background: "rgb(255 255 255 / 0.2)", backdropFilter: "blur(12px)" };
  return (
    <header className="relative overflow-hidden rounded-[28px] px-4 pt-3 pb-5 text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${painting})`, transform: `scale(${zoom})` }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgb(10 20 40 / 0.7), transparent 60%)" }} />
      <div className="relative">
        <span className="inline-flex h-10 items-center gap-0.5 rounded-full pr-3.5 pl-2 text-[14px] font-semibold" style={{ background: "rgb(255 255 255 / 0.15)", boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.25)", backdropFilter: "blur(12px)" }}>
          <Icon node={ICONS.chevronLeft} size={20} /> Today
        </span>
        <div className="mt-16 flex items-center gap-2">
          <span
            className="inline-grid size-8 shrink-0 place-items-center rounded-full"
            style={{ color: ink, background: `color-mix(in oklab, ${ink} 13%, #fffbf4)`, boxShadow: `inset 0 0 0 1.5px ${ink}, inset 0 0 0 3.5px #fffbf4, inset 0 0 0 4.5px color-mix(in oklab, ${ink} 45%, transparent), 0 0 0 2px rgb(255 255 255 / 0.3)` }}
          >
            <Icon node={icon} size={15} />
          </span>
          <span className="text-[13px] font-medium" style={{ color: "rgb(255 255 255 / 0.9)", filter: "drop-shadow(0 1px 6px rgb(0 0 0 / 0.5))" }}>
            {label}
          </span>
        </div>
        <h1 className={`${relocoDisplay.className} mt-2 text-[36px] leading-[1.02]`} style={{ textWrap: "balance", filter: "drop-shadow(0 1px 10px rgb(0 0 0 / 0.35))" } as CSSProperties}>
          {title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-1.5 text-[12px] font-semibold">
          {chips.map((c) => (
            <span key={c.text} className="flex items-center gap-1 rounded-full px-2.5 py-1" style={glass}>
              {c.clock && <Icon node={ICONS.clock} size={14} />}
              {c.text}
            </span>
          ))}
          <span className="rounded-full px-2.5 py-1" style={{ background: "var(--r-gold)", color: "#2b1d00" }}>
            ✦ +{miles}
          </span>
        </div>
      </div>
    </header>
  );
}

/** A step's empty checkbox, as in the app's step list. */
export const StepBox = () => <span className="mt-0.5 block size-[26px] shrink-0 rounded-full" style={{ boxShadow: "inset 0 0 0 2px rgb(142 150 166 / 0.6)" }} />;

const START = 400;
const MARK = 1250;
const SCROLL = [3000, 4100] as const;
const CHIP = 4300;
const CAL = 5100;
const SOURCES = 5650;
export const SOURCES_MS = SOURCES + 2700;

// How far the page scrolls: the header goes, and the rule stays at the top with its source below.
const SCROLL_BY = 300;

/** Like `At`, but holds its place from the start, so nothing below jumps when it appears. */
export function Hold({ at, y = 12, className, children }: { at: number; y?: number; className?: string; children: ReactNode }) {
  const { t } = useClock();
  const shown = t >= at;
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }} transition={{ duration: 0.5, ease }}>
      {children}
    </motion.div>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  const { t } = useClock();
  const p = outCubic(span(t, MARK, MARK + 750));
  // One background across the wrapped lines, so the marker sweeps line by line.
  return (
    <span
      style={{
        color: p > 0.3 ? "var(--r-ink)" : undefined,
        transition: "color 300ms",
        backgroundImage: "linear-gradient(var(--r-leaf-soft), var(--r-leaf-soft))",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${p * 100}% 100%`,
        borderRadius: 4,
        padding: "1px 0",
      }}
    >
      {children}
    </span>
  );
}

const STEPS = [
  "Find the program start date and the earliest admission date on your I-20.",
  "Book a flight that lands at RDU no more than 30 days before it, ideally a few days before orientation.",
  "Can’t make the start date? Tell ISSS before you travel; they may need to update your I-20.",
];

const SOURCE_LIST = [
  { label: "UNC International Student and Scholar Services", host: "isss.unc.edu" },
  { label: "Study in the States: the Form I-20", host: "studyinthestates.dhs.gov" },
];

function SourceChip() {
  const { t } = useClock();
  const ping = t >= CHIP && t < CHIP + 1100;
  return (
    <span className="relative mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full py-1 pr-3 pl-2.5 text-[13px] font-semibold" style={{ background: "var(--r-leaf-soft)", color: "var(--r-leaf-ink)" }}>
      {/* A ring goes out once as the link scrolls in: every rule points at its source. */}
      {ping && (
        <motion.span aria-hidden className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 0 2px var(--r-leaf)" }} initial={{ opacity: 0.9, scale: 1 }} animate={{ opacity: 0, scale: 1.12 }} transition={{ duration: 1, ease: "easeOut" }} />
      )}
      <Icon node={ICONS.arrowUpRight} size={14} />
      <span className="truncate">UNC International Student and Scholar Services</span>
    </span>
  );
}

/** A source row's link mark: pops in once its row has landed. */
function SourceArrow({ at }: { at: number }) {
  const { t } = useClock();
  const shown = t >= at;
  return (
    <motion.span className="grid size-8 shrink-0 place-items-center rounded-full" style={{ background: "var(--r-leaf-soft)", color: "var(--r-leaf-ink)" }} initial={{ scale: 0.4, opacity: 0 }} animate={shown ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }} transition={{ type: "spring", stiffness: 520, damping: 22 }}>
      <motion.span className="grid place-items-center" initial={{ x: -4, y: 4 }} animate={shown ? { x: 0, y: 0 } : { x: -4, y: 4 }} transition={{ duration: 0.4, delay: 0.08, ease }}>
        <Icon node={ICONS.arrowUpRight} size={16} />
      </motion.span>
    </motion.span>
  );
}

function Sources() {
  const { t } = useClock();
  const scrolled = SCROLL_BY * inOutCubic(span(t, SCROLL[0], SCROLL[1]));
  const pressed = t >= CAL && t < CAL + 200;
  return (
    <Scene className="relative h-full overflow-hidden">
      <div className="px-3 pt-3" style={{ transform: `translateY(${-scrolled}px)` }}>
        <TaskHeader
          painting={art("cat-immigration")}
          icon={ICONS.stamp}
          ink="#2f5f8f"
          label="Immigration · Pre-flight"
          title="Book a flight inside your entry window"
          chips={[{ text: "Opens Oct 20" }, { text: "~45 min", clock: true }]}
          miles={120}
        />

        <Hold at={START} y={10}>
          <p className="mt-4 px-1 text-[16px] leading-[1.5]" style={{ color: "var(--r-ink-2)" }}>
            As a new F-1 student you can enter the US no earlier than <Highlight>30 days before the program start date on your I-20</Highlight>.
          </p>
        </Hold>

        <section className="mt-6">
          <div className="mb-2.5 flex items-baseline justify-between px-1">
            <h2 className={`${relocoDisplay.className} text-[26px] leading-none`}>Steps</h2>
            <span className="text-[13px] font-semibold" style={{ color: "var(--r-ink-2)" }}>
              0 of 3
            </span>
          </div>
          <Card className="overflow-hidden">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-start gap-3 px-4 py-3" style={{ borderTop: i ? "1px solid var(--r-line)" : "none" }}>
                <StepBox />
                <div className="min-w-0 flex-1">
                  <span className="block text-[15px] leading-[1.45]">{s}</span>
                  {i === 2 && <SourceChip />}
                </div>
              </div>
            ))}
          </Card>
        </section>

        <motion.span className="relative mt-5 inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-semibold" style={{ background: pressed ? "var(--r-surface-2)" : "var(--r-surface)", boxShadow: "var(--r-shadow)" }} animate={{ scale: pressed ? 0.95 : 1 }} transition={{ duration: 0.15 }}>
          <Tap at={CAL} x="50%" y="50%" />
          <Icon node={ICONS.calendarPlus} size={16} /> Add due date to Google Calendar
        </motion.span>

        <section className="mt-7">
          <h2 className={`${relocoDisplay.className} px-1 text-[26px] leading-none`}>Official sources</h2>
          <div className="mt-3 grid gap-2">
            {SOURCE_LIST.map((s, i) => (
              <Hold key={s.host} at={SOURCES + i * 320} y={16}>
                <div className="flex items-center gap-3 rounded-[16px] px-4 py-3" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] leading-snug font-semibold">{s.label}</span>
                    <span className="block text-[12px]" style={{ color: "var(--r-ink-2)" }}>
                      {s.host}
                    </span>
                  </span>
                  <SourceArrow at={SOURCES + i * 320 + 260} />
                </div>
              </Hold>
            ))}
          </div>
        </section>

        <p className="mt-5 px-1 pb-28 text-[12px]" style={{ color: "var(--r-ink-3)" }}>
          Guidance, not legal advice. Status questions → ISSS.
        </p>
      </div>

      <TaskBar />
    </Scene>
  );
}

export const scene = { Scene: Sources, duration: SOURCES_MS };
