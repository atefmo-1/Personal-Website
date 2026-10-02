"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { At, Card, CheckRow, DateField, Heading, Scene, Tap, TaskBar, ease, typedFor } from "./ui";
import { useClock } from "./Stage";

// The visa interview check, in action. The data is Ziad's, the invented freshman in the case
// study (Cairo, program starts Jan 7, 2027), with one typo planted in his SEVIS fee receipt: its
// SEVIS ID differs from his I-20. He enters his interview date, the papers are checked against
// each other, and after the interview he picks "More processing (221(g))". Rules and wording from
// Reloco's visa-interview card (src/components/task/visa-interview-card.tsx); the 221(g) rows are
// shortened to fit the phone.

const INTERVIEW = "09/03/2026";
const T = {
  start: 600,
  window: 1100,
  date: 2000,
  fee: 0,
  scroll1: 0,
  papers: 0,
  flag: 0,
  ds160: 0,
  scroll2: 0,
  bring: 0,
  scroll3: 0,
  tap: 0,
  outcome: 0,
};
T.fee = T.date + typedFor(INTERVIEW) + 450;
T.scroll1 = T.fee + 1800;
T.papers = T.scroll1 + 500;
T.flag = T.papers + 3 * 380 + 650;
T.ds160 = T.flag + 1100;
T.scroll2 = T.ds160 + 2000;
T.bring = T.scroll2 + 300;
T.scroll3 = T.bring + 1700;
T.tap = T.scroll3 + 1300;
T.outcome = T.tap + 250;
export const VISA_CHECK_MS = T.outcome + 5200;

// Where the page has scrolled to at each beat (px up), so the step in play sits near the top.
const SCROLL = [0, 440, 860, 1170];

function StepLabel({ n, children }: { n: number; children: ReactNode }) {
  return (
    <p className="mt-4 mb-2 flex items-center gap-2 px-1 text-[15px] font-semibold" style={{ color: "var(--r-ink)" }}>
      <span className="grid size-5 place-items-center rounded-full text-[11px]" style={{ background: "var(--r-ink)", color: "var(--r-canvas)" }}>
        {n}
      </span>
      {children}
    </p>
  );
}

function InfoRow({ title, text, at }: { title: string; text: string; at: number }) {
  return (
    <At at={at} from={{ opacity: 0, y: 8 }}>
      <div className="px-4 py-3" style={{ borderTop: "1px solid var(--r-line)" }}>
        <p className="text-[14px]" style={{ color: "var(--r-ink-2)" }}>
          {title}
        </p>
        <p className="text-[15px] leading-snug">{text}</p>
      </div>
    </At>
  );
}

const OUTCOMES = ["Approved", "More processing (221(g))", "Refused (214(b))"];

function Outcome() {
  const { t } = useClock();
  const picked = t >= T.tap + 120;
  return (
    <div className="mt-2.5 flex flex-wrap gap-2">
      {OUTCOMES.map((label, i) => {
        const on = i === 1 && picked;
        return (
          <motion.span
            key={label}
            className="relative flex h-9 items-center rounded-full px-4 text-[14px] font-semibold"
            style={{ background: on ? "var(--r-ink)" : "var(--r-fill)", color: on ? "var(--r-canvas)" : "var(--r-ink)", transition: "background 200ms, color 200ms" }}
            animate={{ scale: i === 1 && t >= T.tap && t < T.tap + 200 ? 0.94 : 1 }}
            transition={{ duration: 0.15 }}
          >
            {i === 1 && <Tap at={T.tap} x="50%" y="50%" />}
            {label}
          </motion.span>
        );
      })}
    </div>
  );
}

export function VisaCheck() {
  const { t, reduced } = useClock();
  const stage = reduced ? 3 : t >= T.scroll3 ? 3 : t >= T.scroll2 ? 2 : t >= T.scroll1 ? 1 : 0;
  return (
    <Scene className="h-full overflow-hidden">
      <motion.div className="px-4 pt-9" initial={false} animate={{ y: -SCROLL[stage] }} transition={{ duration: 1.1, ease }}>
        <Heading
          right={
            t >= T.flag && (
              <motion.span className="text-[13px] font-semibold" style={{ color: "var(--r-urgent-ink)" }} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                Needs a look
              </motion.span>
            )
          }
        >
          Your visa interview
        </Heading>

        <StepLabel n={1}>When you can go</StepLabel>
        <Card className="overflow-hidden">
          <CheckRow first at={T.start} ok title="Your program starts" text="Jan 7, 2027, from your I-20 in Documents" />
          <At at={T.window} from={{ opacity: 0, y: 8 }}>
            <div className="px-4 py-3.5" style={{ borderTop: "1px solid var(--r-line)", background: "var(--r-leaf-soft)" }}>
              <p className="text-[16px] leading-snug font-semibold">The embassy can issue your visa from Jan 7, 2026. You can enter the US from Dec 8, 2026.</p>
              <p className="mt-1 text-[13px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
                That’s 365 and 30 days before your program starts.
              </p>
            </div>
          </At>
          <At at={T.date - 400} from={{ opacity: 0, y: 8 }}>
            <div className="px-4 py-3.5" style={{ borderTop: "1px solid var(--r-line)" }}>
              <DateField label="When is your interview?" value={INTERVIEW} at={T.date} />
              <At at={T.fee} from={{ opacity: 0, y: 6 }}>
                <p className="mt-2 px-1 text-[14px] leading-snug" style={{ color: "var(--r-leaf-ink)" }}>
                  Your SEVIS fee, paid Aug 20, 2026, has time to be verified.
                </p>
              </At>
            </div>
          </At>
        </Card>

        <At at={T.papers - 300} from={{ opacity: 0, y: 12 }}>
          <StepLabel n={2}>Make sure your papers agree</StepLabel>
          <Card className="overflow-hidden">
            <CheckRow first at={T.papers} ok title="Passport" text="Valid until Feb 9, 2032, past the end of your program." />
            <CheckRow at={T.papers + 380} ok title="Name on your I-20" text="Matches your passport" />
            <CheckRow at={T.papers + 760} ok title="Date of birth on your I-20" text="Matches your passport" />
            <div className="relative">
              {t >= T.flag && <motion.span aria-hidden className="absolute inset-0" style={{ background: "var(--r-gold-soft)" }} initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 1.4, ease: "easeOut" }} />}
              <div className="relative">
                <CheckRow at={T.flag - 220} ok={false} title="SEVIS fee" text="The receipt’s SEVIS ID differs from your I-20. Compare them yourself, and ask ISSS if it really differs." />
              </div>
            </div>
            <CheckRow at={T.ds160} ok title="DS-160" text="Your name, date of birth and passport number match your passport." />
          </Card>
        </At>

        <At at={T.bring - 200} from={{ opacity: 0, y: 12 }}>
          <StepLabel n={3}>What to bring</StepLabel>
          <Card className="overflow-hidden">
            <CheckRow first at={T.bring} ok title="Passport" text="In Documents." />
            <CheckRow at={T.bring + 250} ok title="I-20" text="In Documents." />
            <CheckRow at={T.bring + 500} ok title="DS-160 confirmation page" text="In Documents." />
          </Card>
        </At>

        <At at={T.scroll3 - 200} from={{ opacity: 0, y: 12 }}>
          <StepLabel n={4}>After your interview</StepLabel>
          <Card className="overflow-hidden">
            <div className="px-4 py-3.5">
              <p className="text-[15px] leading-tight font-semibold">How did it go?</p>
              <Outcome />
            </div>
            <InfoRow at={T.outcome} title="What it means" text="The officer didn’t have everything needed to decide yet. It isn’t a final refusal." />
            <InfoRow at={T.outcome + 350} title="What to do" text="Send exactly what the letter asks for, within one year of the 221(g) decision." />
            <InfoRow at={T.outcome + 700} title="How long" text="It varies by case. Don’t buy a ticket until you have your visa." />
          </Card>
        </At>
      </motion.div>
      <TaskBar label="4 steps to go" />
    </Scene>
  );
}

export const scene = { Scene: VisaCheck, duration: VISA_CHECK_MS };
