"use client";

import { cubicBezier, motion } from "framer-motion";
import type { ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { Scene, Tap, Typed, typedFor } from "./ui";
import { useClock } from "./Stage";

// Onboarding, answered: a name, where you are, where you fly from and when you land. Each answer
// lands on the boarding pass above as it's typed, and the plane moves on a step, as in the real
// wizard. Mei is the invented freshman from the case study (specimens/mei in Reloco: Shanghai, lands Sep 30).

const NAME = "Mei";
const CITY = "Shanghai";
const DATE = "09/30/2026";
const STEPS = 11;

const T = {
  nameTap: 800,
  name: 950,
  next1: 950 + typedFor(NAME, 110) + 750,
  home: 0,
  country: 0,
  cityTap: 0,
  city: 0,
  next3: 0,
  dateTap: 0,
  date: 0,
};
// An auto-advance question moves on 260 ms after the tap; the old question takes 150 ms to leave.
T.home = T.next1 + 150 + 1500;
T.country = T.home + 260 + 150 + 750;
T.cityTap = T.country + 600;
T.city = T.cityTap + 120;
T.next3 = T.city + typedFor(CITY, 130) + 650;
T.dateTap = T.next3 + 150 + 650;
T.date = T.dateTap + 120;
const LANDED = T.date + typedFor(DATE);
const DURATION = LANDED + 2300;

/** When the wizard moves to each step (index 0 is step 1). */
const STEP_AT = [0, T.next1, T.home + 260, T.next3];
/** When each question is on screen. */
const SHOWN = [
  [0, T.next1],
  [T.next1 + 150, T.home + 260],
  [T.home + 260 + 150, T.next3],
  [T.next3 + 150, Infinity],
] as const;

// The pass's flight path, walked by length so the plane and its trail agree.
const P0 = [8, 52];
const P1 = [180, -16];
const P2 = [352, 52];
const PATH = "M 8 52 Q 180 -16 352 52";
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
  const at = Math.max(0.001, Math.min(0.999, v));
  const i = Math.max(1, LUT.findIndex((p) => p.s >= at));
  const a = LUT[i - 1];
  const b = LUT[i];
  const k = (at - a.s) / (b.s - a.s || 1);
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
}

// The real pass flies 1.6 s after a 0.3 s pause, on this curve.
const fly = cubicBezier(0.45, 0, 0.2, 1);
function flight(t: number) {
  let v = 1 / (STEPS + 1);
  STEP_AT.forEach((at, i) => {
    if (i === 0) return;
    const from = i / (STEPS + 1);
    const to = (i + 1) / (STEPS + 1);
    const k = Math.max(0, Math.min(1, (t - at - 300) / 1600));
    if (t >= at) v = from + (to - from) * fly(k);
  });
  return v;
}

const PLANE = "M8 0C8-.9 7-1.4 6-1.4H-1L-5-8H-7L-4.5-1.4-8-1.3-10-4H-11.5L-10.5 0-11.5 4H-10L-8 1.3-4.5 1.4-7 8H-5L-1 1.4H6C7 1.4 8 .9 8 0Z";

const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.08em]";

/** A value on the pass that rises in when it first fills. */
function PassValue({ value, empty, className }: { value: string; empty: boolean; className: string }) {
  return (
    <motion.span key={empty ? "empty" : "filled"} className={`block ${className}`} initial={empty ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      {value}
    </motion.span>
  );
}

/** The boarding pass at the top of every question, without its miles stub. */
function Pass({ from, passenger, lands, progress }: { from: string; passenger: string; lands: string; progress: number }) {
  const p = along(progress);
  return (
    <section className="overflow-hidden rounded-[20px]" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
      <div className="px-5 pt-4 pb-5" style={{ background: "linear-gradient(180deg, var(--r-leaf-soft), transparent 85%)" }}>
        <div className="flex items-center justify-between">
          <span className={eyebrow} style={{ color: "var(--r-ink-2)" }}>
            Boarding pass
          </span>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums" style={{ background: "rgb(255 251 244 / 0.7)", color: "var(--r-leaf-ink)", boxShadow: "inset 0 0 0 1px var(--r-line)" }}>
            F-1 · UNC
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className={eyebrow} style={{ color: "var(--r-ink-2)", fontSize: 10 }}>
              From
            </p>
            <PassValue value={from} empty={from === "Home"} className={`${relocoDisplay.className} truncate text-[22px] leading-tight tracking-[-0.015em]`} />
          </div>
          <div className="shrink-0 text-right">
            <p className={eyebrow} style={{ color: "var(--r-ink-2)", fontSize: 10 }}>
              To · Chapel Hill
            </p>
            <p className={`${relocoDisplay.className} text-[30px] leading-none tracking-[-0.015em]`}>RDU</p>
          </div>
        </div>

        <svg viewBox="0 0 360 60" className="mt-1 h-auto w-full overflow-visible" aria-hidden>
          <path d={PATH} fill="none" stroke="var(--r-ink-3)" strokeWidth="1.6" strokeDasharray="1 5" strokeLinecap="round" opacity="0.7" />
          <path d={PATH} pathLength={1} fill="none" stroke="var(--r-leaf)" strokeWidth="2.6" strokeLinecap="round" strokeDasharray={`${progress} 1`} />
          <circle cx="8" cy="52" r="3.5" fill="var(--r-leaf)" />
          <circle cx="352" cy="52" r="3.5" fill="none" stroke="var(--r-leaf)" strokeWidth="2" />
          <g transform={`translate(${p.x} ${p.y}) rotate(${p.angle})`}>
            <circle r="12" fill="var(--r-surface)" stroke="var(--r-line)" />
            <path transform="translate(1.6 0) scale(0.9)" d={PLANE} fill="var(--r-ink)" />
          </g>
        </svg>

        <dl className="mt-3 grid grid-cols-3 gap-3">
          {[
            { label: "Passenger", value: passenger },
            { label: "Lands", value: lands },
            { label: "Class", value: "Bachelor’s" },
          ].map((s) => (
            <div key={s.label}>
              <dt className={eyebrow} style={{ color: "var(--r-ink-2)", fontSize: 10 }}>
                {s.label}
              </dt>
              <dd className="mt-0.5 text-[17px] font-semibold tabular-nums">
                <PassValue value={s.value} empty={s.value === "–"} className="" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** One question: slides in from the right, out to the left, like the wizard's steps. */
function Question({ index, title, lead, children }: { index: number; title: ReactNode; lead: string; children: ReactNode }) {
  const { t } = useClock();
  const [from, to] = SHOWN[index];
  if (t < from || t > to + 150) return null;
  const leaving = t >= to;
  return (
    <motion.div
      className="absolute inset-x-0 top-0"
      initial={index === 0 ? false : { opacity: 0, x: 40 }}
      animate={leaving ? { opacity: 0, x: -40 } : { opacity: 1, x: 0 }}
      transition={leaving ? { duration: 0.15 } : { type: "spring", stiffness: 380, damping: 34 }}
    >
      <h1 className={`${relocoDisplay.className} mt-5 text-[34px] leading-[1.04] tracking-[-0.015em]`} style={{ textWrap: "balance" }}>
        {title}
      </h1>
      <p className="mt-2 text-[15px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
        {lead}
      </p>
      <div className="relative mt-6">{children}</div>
    </motion.div>
  );
}

/** The wizard's text field, focused (Carolina ring) while it's being typed into. */
function Field({ at, tapAt, value, placeholder, speed, children }: { at: number; tapAt: number; value: string; placeholder: string; speed: number; children?: ReactNode }) {
  const { t } = useClock();
  const focused = t >= tapAt && t < at + typedFor(value, speed) + 500;
  return (
    <div className="relative flex h-[58px] items-center justify-between rounded-[16px] px-4 text-[19px] font-medium" style={{ background: "var(--r-surface)", boxShadow: `var(--r-shadow), 0 0 0 2px ${focused ? "var(--r-leaf)" : "transparent"}`, transition: "box-shadow 200ms" }}>
      <Tap at={tapAt} x={70} y="50%" />
      <Typed text={value} at={at} speed={speed} placeholder={placeholder} />
      {children}
    </div>
  );
}

const Chevron = ({ d }: { d: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const CheckMark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const Calendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 2v4M16 2v4M3 10h18" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
  </svg>
);

/** The three answers to "Where are you right now?", with "Still at home" picked at `T.home`. */
function Stages() {
  const { t } = useClock();
  const options = [
    { label: "Still at home", hint: "Getting ready to fly to UNC", emoji: "🧳" },
    { label: "Just arrived", hint: "In my first year at UNC", emoji: "📍" },
    { label: "Already studying at UNC", hint: "Second year or later: CPT, OPT, taxes", emoji: "🎓" },
  ];
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((o, i) => {
        const on = i === 0 && t >= T.home;
        const pressed = i === 0 && t >= T.home && t < T.home + 180;
        return (
          <motion.div
            key={o.label}
            className="relative flex min-h-[58px] items-center gap-3 rounded-[16px] px-3 py-2.5"
            style={{ background: "var(--r-surface)", boxShadow: `var(--r-shadow), 0 0 0 2px ${on ? "var(--r-leaf)" : "transparent"}`, transition: "box-shadow 160ms" }}
            animate={{ scale: pressed ? 0.98 : 1 }}
            transition={{ duration: 0.15 }}
          >
            {i === 0 && <Tap at={T.home} x="62%" y="50%" />}
            <span className="grid size-10 shrink-0 place-items-center rounded-full text-[20px]" style={{ background: "var(--r-fill)" }}>
              {o.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] leading-tight font-semibold">{o.label}</span>
              <span className="mt-0.5 block text-[13px]" style={{ color: "var(--r-ink-2)" }}>
                {o.hint}
              </span>
            </span>
            <span className="grid size-6 shrink-0 place-items-center rounded-full border-2" style={{ borderColor: on ? "var(--r-leaf)" : "rgb(142 150 166 / 0.5)", background: on ? "var(--r-leaf)" : "transparent", color: "var(--r-ink)", transition: "all 160ms" }}>
              {on && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 520, damping: 26 }}>
                  <CheckMark />
                </motion.span>
              )}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/** The pinned button under a typed question; pressed by a fingertip at `tapAt`. */
function Continue({ ready, tapAt, skip }: { ready: boolean; tapAt?: number; skip?: boolean }) {
  const { t } = useClock();
  const pressed = tapAt !== undefined && t >= tapAt && t < tapAt + 200;
  return (
    <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
      <motion.div
        className="relative flex h-[52px] items-center justify-center rounded-full text-[16px] font-semibold"
        style={{ background: "var(--r-primary)", color: "var(--r-on-primary)" }}
        animate={{ opacity: ready ? 1 : 0.5, scale: pressed ? 0.97 : 1 }}
        transition={{ duration: 0.18 }}
      >
        {tapAt !== undefined && <Tap at={tapAt} x="50%" y="50%" />}
        Continue
      </motion.div>
      {skip && (
        <span className="grid h-11 place-items-center text-[15px] font-medium" style={{ color: "var(--r-ink-2)" }}>
          Skip
        </span>
      )}
    </div>
  );
}

function Onboarding() {
  const { t } = useClock();
  const step = STEP_AT.filter((at) => t >= at).length;
  const typedName = NAME.slice(0, t < T.name ? 0 : Math.min(NAME.length, Math.floor((t - T.name) / 110) + 1));
  const typedCity = CITY.slice(0, t < T.city ? 0 : Math.min(CITY.length, Math.floor((t - T.city) / 130) + 1));
  const q = SHOWN.findIndex(([from, to]) => t >= from && t <= to + 150);
  const country = t >= T.country + 120;

  return (
    <Scene className="relative h-full">
      {/* Back, progress, step count */}
      <div className="flex h-14 items-center gap-3 px-4">
        <span className="grid size-10 place-items-center" style={{ color: "var(--r-leaf-ink)", opacity: step > 1 ? 1 : 0, transition: "opacity 200ms" }}>
          <Chevron d="m15 18-6-6 6-6" />
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "var(--r-fill)" }}>
          <motion.div className="h-full rounded-full" style={{ background: "var(--r-leaf)" }} initial={false} animate={{ width: `${(step / STEPS) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
        </div>
        <span className="w-10 text-right text-[13px] font-medium tabular-nums" style={{ color: "var(--r-ink-2)" }}>
          {step}/{STEPS}
        </span>
      </div>

      <div className="px-4 pt-3">
        <Pass from={typedCity || "Home"} passenger={typedName || "–"} lands={t >= LANDED ? "Sep 30" : "–"} progress={flight(t)} />

        <div className="relative">
          <Question index={0} title="Hi! What should we call you?" lead="For F-1 undergrads at UNC-Chapel Hill. A minute, tops.">
            <Field at={T.name} tapAt={T.nameTap} value={NAME} placeholder="First name" speed={110} />
          </Question>
          <Question index={1} title={`Nice to meet you, ${NAME}. Where are you right now?`} lead="So we know what’s already behind you.">
            <Stages />
          </Question>
          <Question index={2} title="Where are you flying from?" lead="Your passport country tailors tax and passport tips. The city goes on your boarding pass.">
            <div className="space-y-3">
              <div className="relative flex h-[58px] items-center justify-between rounded-[16px] px-4 text-[19px] font-medium" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
                <Tap at={T.country} x={70} y="50%" />
                <span style={{ color: country ? "var(--r-ink)" : "var(--r-ink-3)" }}>{country ? "China" : "Passport country"}</span>
                <span style={{ color: "var(--r-ink-2)" }}>
                  <Chevron d="m6 9 6 6 6-6" />
                </span>
              </div>
              <Field at={T.city} tapAt={T.cityTap} value={CITY} placeholder="City, e.g. Bengaluru" speed={130} />
            </div>
          </Question>
          <Question index={3} title="When do you land at RDU?" lead="A best guess is fine.">
            <Field at={T.date} tapAt={T.dateTap} value={DATE} placeholder="mm/dd/yyyy" speed={70}>
              <Calendar />
            </Field>
          </Question>
        </div>
      </div>

      {q === 0 && <Continue ready={t >= T.name} tapAt={T.next1} />}
      {q === 2 && <Continue ready skip tapAt={T.next3} />}
      {q === 3 && <Continue ready={t >= LANDED} />}
    </Scene>
  );
}

export const scene = { Scene: Onboarding, duration: DURATION };
