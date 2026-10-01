"use client";

import { motion } from "framer-motion";
import { useId, type CSSProperties } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { useClock } from "./Stage";
import { CompleteBar, Confetti, Reward, StepCheck } from "./Miles";
import { ICONS, Icon, TaskHeader, art, outCubic, span } from "./Sources";
import { Tap } from "./ui";

// A stamp for a chapter: Mei finishes "Plan your ride from RDU to Chapel Hill", the last task of
// Pre-flight, and the chapter's stamp comes down on the reward card with the miles. A tap closes
// it, then a cut to her Profile, where the passport shows the stamp, the first of nine. Mei is the
// case study's invented student (lands Sep 30, 2026; program starts Oct 12, 2026, her specimen).
// The stamp is the app's (components/game/stamp.tsx), redrawn.

const STAMP_INK = ["#2b6495", "#b5553a", "#3c7a4a", "#7a4e8c", "#9a7428"];
const TILT = -8; // the app tilts each earned stamp; Pre-flight's is -8 degrees
const CHAPTERS = ["Pre-flight", "Touchdown", "First month", "Settling in", "First spring", "Sophomore year", "Junior year", "Senior year", "After graduation"];

type IconNode = [string, Record<string, string>][];
// One glyph per chapter, as in the app (Lucide, copied as data).
const GLYPHS: IconNode[] = [
  [["path", { d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" }]],
  [["path", { d: "M2 22h20" }], ["path", { d: "M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z" }]],
  [["path", { d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" }], ["path", { d: "M22 10v6" }], ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5" }]],
  [["path", { d: "M10 12h4" }], ["path", { d: "M10 8h4" }], ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3" }], ["path", { d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" }], ["path", { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" }]],
  [["path", { d: "M12 17V7" }], ["path", { d: "M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" }], ["path", { d: "M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z" }]],
  [["path", { d: "M12 5v16" }], ["path", { d: "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" }]],
  [["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }], ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2" }]],
  [["path", { d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" }], ["circle", { cx: "12", cy: "8", r: "6" }]],
  [["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" }], ["path", { d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" }], ["path", { d: "M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" }], ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" }]],
];
const NAV: IconNode[] = [
  [["path", { d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" }], ["path", { d: "M20 2v4" }], ["path", { d: "M22 4h-4" }], ["circle", { cx: "4", cy: "20", r: "2" }]],
  [["path", { d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" }], ["path", { d: "M15 5.764v15" }], ["path", { d: "M9 3.236v15" }]],
  [["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1" }], ["path", { d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5" }], ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2" }]],
];
const PROFILE_ICON: IconNode = [["path", { d: "M17.925 20.056a6 6 0 0 0-11.851.001" }], ["circle", { cx: "12", cy: "11", r: "4" }], ["circle", { cx: "12", cy: "12", r: "10" }]];

/** A chapter's passport stamp: inked in its color when earned, a dashed outline until then. */
function ChapterStamp({ index, earned, size, wet = 0, style }: { index: number; earned: boolean; size: number; /** 1 = just pressed: the ink sits darker, then dries. */ wet?: number; style?: CSSProperties }) {
  const id = useId();
  const color = earned ? STAMP_INK[index % 5] : "var(--r-ink-3)";
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden style={{ color, flexShrink: 0, opacity: earned ? 1 : 0.45, transform: earned ? `rotate(${TILT}deg)` : undefined, overflow: "visible", ...style }}>
      <defs>
        <path id={`${id}-arc`} d="M 15 50 A 35 35 0 0 1 85 50" />
        <path id={`${id}-arc-b`} d="M 9 50 A 41 41 0 0 0 91 50" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={earned ? undefined : "4 4"} />
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {earned && <circle cx="50" cy="50" r="46" fill="currentColor" opacity={0.07 + 0.16 * wet} />}
      <text fontSize="8.5" fontWeight="700" letterSpacing="1.6" fill="currentColor">
        <textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle">
          {CHAPTERS[index].toUpperCase()}
        </textPath>
      </text>
      <text fontSize="7" fontWeight="600" letterSpacing="1.4" fill="currentColor" opacity="0.85">
        <textPath href={`#${id}-arc-b`} startOffset="50%" textAnchor="middle">
          CHAPEL HILL
        </textPath>
      </text>
      <svg x="39" y="35" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {GLYPHS[index].map(([tag, attrs], i) => {
          const Tag = tag as "path";
          return <Tag key={i} {...attrs} />;
        })}
      </svg>
      <text x="50" y="71" fontSize="8.5" fontWeight="800" textAnchor="middle" fill="currentColor">
        {`Nº ${index + 1}`}
      </text>
    </svg>
  );
}

/** A ring of ink that spreads from a stamp as it lands. */
function InkRing({ at, size }: { at: number; size: number }) {
  const { t } = useClock();
  const p = span(t, at, at + 650);
  if (p <= 0 || p >= 1) return null;
  return <span aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 rounded-full" style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, boxShadow: `0 0 0 ${3 - 2 * p}px ${STAMP_INK[0]}`, opacity: 0.45 * (1 - p), transform: `scale(${1 + 0.32 * outCubic(p)})` }} />;
}

const TAP = 800;
const OPEN = TAP + 220;
const PRESS = OPEN + 150; // the stamp starts down
const IMPACT = PRESS + 260; // and meets the paper
const DISMISS = OPEN + 3900;
const PROFILE = DISMISS + 450; // the cut to the Profile screen
export const STAMP_MS = PROFILE + 2700;

const CARD_STAMP = 148;
const SLOT = 56;

/** The stamp coming down: falls from big and turned, stops hard on the paper, gives a little. */
function slam(t: number) {
  const fall = span(t, PRESS, IMPACT);
  const f = fall * fall; // speeds up as it falls
  const settle = span(t, IMPACT, IMPACT + 220);
  const give = 0.035 * Math.sin(Math.PI * settle);
  return {
    scale: 2.2 - 1.2 * f - give,
    rotate: -16 * (1 - f),
    opacity: Math.min(1, fall * 2.5),
    // Lifted, it casts a soft shadow; pressed, none.
    shadow: 1 - f,
  };
}

function CardStamp() {
  const { t } = useClock();
  const s = slam(t);
  const wet = 1 - span(t, IMPACT, IMPACT + 1400);
  return (
    <div className="relative" style={{ width: CARD_STAMP, height: CARD_STAMP }}>
      <InkRing at={IMPACT} size={CARD_STAMP * 0.92} />
      <div style={{ transform: `scale(${s.scale}) rotate(${s.rotate}deg)`, opacity: s.opacity, filter: `drop-shadow(0 ${14 * s.shadow}px ${18 * s.shadow}px rgb(19 41 75 / ${0.25 * s.shadow}))` }}>
        <ChapterStamp index={0} earned size={CARD_STAMP} wet={wet} />
      </div>
    </div>
  );
}

const STEPS = [
  { text: "Pick a GoTriangle bus, a taxi or a rideshare, and save the pickup instructions offline.", link: "RDU: Ground transportation" },
  { text: "Send your arrival time and first address to someone who’ll check in on you." },
];

function TaskPage() {
  return (
    <div className="px-3 pt-3">
      <TaskHeader painting={art("cat-housing")} icon={ICONS.house} ink="#b5553a" label="Housing · Pre-flight" title="Plan your ride from RDU to Chapel Hill" chips={[{ text: "Due Sep 28" }, { text: "~15 min", clock: true }]} miles={50} />
      <p className="mt-4 px-1 text-[16px] leading-[1.5]" style={{ color: "var(--r-ink-2)" }}>
        Raleigh-Durham (RDU) is about 30 minutes from Chapel Hill by car.{" "}
        <span className="font-semibold" style={{ color: "var(--r-ink)" }}>
          More
        </span>
      </p>
      <section className="mt-6">
        <div className="mb-2.5 flex items-baseline justify-between px-1">
          <h2 className={`${relocoDisplay.className} text-[26px] leading-none`}>Steps</h2>
          <span className="text-[13px] font-semibold" style={{ color: "var(--r-ink-2)" }}>
            2 of 2
          </span>
        </div>
        <div className="overflow-hidden rounded-[20px]" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
          {STEPS.map((s, i) => (
            <div key={s.text} className="flex items-start gap-3 px-4 py-3" style={{ borderTop: i ? "1px solid var(--r-line)" : "none" }}>
              <StepCheck />
              <div className="min-w-0 flex-1">
                <span className="block text-[15px] leading-[1.45] line-through" style={{ color: "var(--r-ink-3)", textDecorationColor: "rgb(142 150 166 / 0.5)" }}>
                  {s.text}
                </span>
                {s.link && (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-2.5 text-[13px] font-semibold" style={{ background: "var(--r-leaf-soft)", color: "var(--r-leaf-ink)" }}>
                    <Icon node={ICONS.arrowUpRight} size={14} />
                    {s.link}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const TRIP = [
  { label: "Land at RDU", value: "09/30/2026", date: true },
  { label: "Program starts", value: "10/12/2026", date: true },
  { label: "Graduating", value: "05/10/2030", date: true },
  { label: "Passport country", value: "China", select: true },
  { label: "Flying from", value: "Shanghai" },
  { label: "Name", value: "Mei" },
];

const CalendarGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 2v4M16 2v4M3 10h18" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
  </svg>
);

function ProfilePage() {
  const { t } = useClock();
  // The passport as it now stands; the fresh stamp's ink settles once, nothing moves between screens.
  const wet = 0.6 * (1 - outCubic(span(t, PROFILE + 200, PROFILE + 1400)));
  return (
    <div className="px-3 pt-3">
      <section className="relative overflow-hidden rounded-[28px] p-4 text-white">
        <div className="absolute inset-0 bg-cover" style={{ backgroundImage: `url(${art("passport")})`, backgroundPosition: "50% 40%" }} />
        <div className="absolute inset-0" style={{ background: "rgb(10 20 40 / 0.35)" }} />
        <div className="relative flex items-center gap-4">
          <span className={`${relocoDisplay.className} grid size-16 place-items-center rounded-full text-[36px]`} style={{ background: "#fffbf4", color: "#13294b" }}>
            M
          </span>
          <div className="min-w-0">
            <h1 className={`${relocoDisplay.className} text-[40px] leading-none`}>Mei</h1>
            <p className="mt-1 text-[14px]" style={{ color: "rgb(255 255 255 / 0.85)" }}>
              F-1 · UNC-Chapel Hill
            </p>
          </div>
        </div>
        <div className="relative mt-5 rounded-[20px] p-4" style={{ background: "rgb(255 251 244 / 0.95)", color: "var(--r-ink)" }}>
          <div className="flex items-baseline justify-between">
            <p className={`${relocoDisplay.className} text-[24px] leading-none`}>Passport</p>
            <p className="text-[13px] font-semibold tabular-nums">
              <span style={{ color: "#7e5600" }}>✦ 590 mi</span>
              <span style={{ color: "#8e96a6" }}> · </span>
              <span>1/9 stamps</span>
            </p>
          </div>
          <ul className="mt-3 grid grid-cols-5 gap-x-1 gap-y-3">
            {CHAPTERS.map((name, i) => (
              <li key={name} className="flex flex-col items-center gap-1">
                <ChapterStamp index={i} earned={i === 0} size={SLOT} wet={i === 0 ? wet : 0} />
                <span className="text-center text-[10px] leading-tight font-medium" style={{ color: "#52607a" }}>
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-9">
        <h2 className={`${relocoDisplay.className} px-1 text-[30px] leading-none`}>Your trip</h2>
        <p className="mt-1.5 px-1 text-[14px]" style={{ color: "var(--r-ink-2)" }}>
          Change a date and your whole plan moves with it.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {TRIP.map((f) => (
            <div key={f.label} className="rounded-[16px] px-4 pt-2.5 pb-2" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
              <p className="text-[12px] font-medium" style={{ color: "var(--r-ink-2)" }}>
                {f.label}
              </p>
              <p className="flex items-center justify-between py-1 text-[17px] font-medium">
                {f.value}
                {f.date && <CalendarGlyph />}
                {f.select && <Icon node={[["path", { d: "m6 9 6 6 6-6" }]]} size={18} />}
              </p>
            </div>
          ))}
        </div>
      </section>

      <nav className="absolute right-0 bottom-3 left-0 flex justify-center px-4">
        <ul className="flex h-[60px] items-center gap-1 rounded-full p-1.5" style={{ background: "rgb(20 22 27 / 0.92)", boxShadow: "0 12px 40px -8px rgb(0 0 0 / 0.45), inset 0 0 0 1px rgb(255 255 255 / 0.1)" }}>
          {NAV.map((node, i) => (
            <li key={i} className="flex h-12 min-w-12 items-center justify-center px-3.5" style={{ color: "rgb(255 255 255 / 0.6)" }}>
              <Icon node={node} size={20} stroke={2.2} />
            </li>
          ))}
          <li className="flex h-12 items-center gap-2 rounded-full bg-white px-3.5 text-[14px] font-semibold" style={{ color: "#14161b" }}>
            <Icon node={PROFILE_ICON} size={20} stroke={2.2} /> Profile
          </li>
        </ul>
      </nav>
    </div>
  );
}

const BURSTS = [
  { at: OPEN + 380, count: 90, spread: 80, velocity: 42, x: 0.5, y: 0.45, ticks: 260, scalar: 1, seed: 11 },
  { at: OPEN + 530, count: 50, angle: 60, spread: 60, velocity: 45, x: 0, y: 0.7, ticks: 260, scalar: 1, seed: 23 },
  { at: OPEN + 630, count: 50, angle: 120, spread: 60, velocity: 45, x: 1, y: 0.7, ticks: 260, scalar: 1, seed: 37 },
];

function StampScene() {
  const { t, duration, reduced } = useClock();
  // A clean cut: the card closes and the task page goes, then the Profile comes up on its own.
  const taskOut = span(t, DISMISS, DISMISS + 140);
  const profileIn = outCubic(span(t, PROFILE, PROFILE + 450));
  const ending = !reduced && t > duration - 450;
  return (
    <motion.div className="relative h-full overflow-hidden" animate={{ opacity: ending ? 0 : 1 }} transition={{ duration: 0.4 }}>
      <div className="absolute inset-0" style={{ opacity: 1 - taskOut }}>
        <TaskPage />
        <CompleteBar ready miles={50} left="" tapAt={TAP} />
      </div>
      <div className="absolute inset-0" style={{ opacity: profileIn, transform: `translateY(${10 * (1 - profileIn)}px)` }}>
        <ProfilePage />
      </div>

      <Reward
        at={OPEN}
        thudAt={IMPACT}
        exitAt={DISMISS}
        top={<CardStamp />}
        title={
          <>
            <p className="mt-5 text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: "var(--r-ink-2)" }}>
              Chapter complete
            </p>
            <p className={`${relocoDisplay.className} mt-1 text-[28px] leading-tight`}>Pre-flight, stamped.</p>
          </>
        }
        miles={50}
        total="590"
      />
      <Confetti bursts={BURSTS} />
      <div className="absolute inset-0 z-[75]" style={{ pointerEvents: "none" }}>
        <Tap at={DISMISS} x={236} y={588} />
      </div>
    </motion.div>
  );
}

export const scene = { Scene: StampScene, duration: STAMP_MS };
