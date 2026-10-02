"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { At, Card, CheckRow, Heading, Scene, TaskBar, Tap, Verdict, ease } from "./ui";
import { useClock } from "./Stage";

// The DMV visit plan, in action. The data is Mei's, the invented freshman in the case study:
// checked in with ISSS, her passport, visa, I-94 and I-20 in Documents, no SSN yet, and a lease
// on file. She'll drive her own car, so the card tells her what insurance to bring, then the
// page moves on to booking and the nearest office. Wording as in Reloco's dmv-visit card.

const T = { checkin: 600, identity: 1000, ssn: 1400, address: 1800, car: 2700, tap: 3900, scroll: 6400, book: 6900, office: 7400 };
export const DMV_VISIT_MS = T.office + 1200 + 3000;
const SCROLL = 360;

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

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);

export function DmvVisit() {
  const { t, reduced } = useClock();
  const picked = reduced || t >= T.tap;
  const y = reduced || t >= T.scroll ? -SCROLL : 0;
  return (
    <Scene className="h-full overflow-hidden">
      <motion.div className="px-4 pt-9" animate={{ y }} transition={{ duration: 1.1, ease }}>
        <Heading
          right={
            picked && (
              <motion.span className="text-[13px] font-semibold" style={{ color: "var(--r-leaf-ink)" }} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                Ready to go
              </motion.span>
            )
          }
        >
          Your DMV visit
        </Heading>

        <StepLabel n={1}>Make sure you’re ready</StepLabel>
        <Card className="overflow-hidden">
          <CheckRow first at={T.checkin} ok title="ISSS check-in" text="You’ve checked in with ISSS." />
          <CheckRow at={T.identity} ok title="Passport, visa, I-94, I-20" text="In Documents. Bring the originals." />
          <CheckRow at={T.ssn} ok title="Social Security number" text="You don’t need one. Your license will be marked “Not for Federal Purposes”, not a REAL ID." />
          <CheckRow at={T.address} ok title="Proof of NC address" text="Your lease in Documents. Bring a printed copy." />
          <At at={T.car} from={{ opacity: 0, y: 8 }}>
            <div className="px-4 py-3.5" style={{ borderTop: "1px solid var(--r-line)" }}>
              <div className="flex items-center gap-3.5">
                <Verdict ok={picked ? true : null} at={picked ? T.tap + 150 : 0} />
                <p className="text-[16px] leading-snug font-semibold">Will you drive a car you own?</p>
              </div>
              <div className="mt-2.5 flex gap-2 pl-[54px]">
                <span className="relative rounded-full px-4 py-2 text-[15px] font-semibold transition-colors duration-200" style={picked ? { background: "var(--r-primary)", color: "var(--r-on-primary)" } : { background: "var(--r-fill)" }}>
                  <Tap at={T.tap} x="50%" y="50%" />
                  Yes, my own
                </span>
                <span className="rounded-full px-4 py-2 text-[15px] font-semibold" style={{ background: "var(--r-fill)" }}>
                  No car
                </span>
              </div>
              {picked && (
                <motion.p className="mt-2 pl-[54px] text-[13px] leading-snug" style={{ color: "var(--r-ink-2)" }} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                  Bring proof of NC liability insurance with your name on it: a DL-123 form from your insurer (good for 30 days after it’s issued), or your policy or insurance card.
                </motion.p>
              )}
            </div>
          </At>
        </Card>

        {/* Step 2 arrives with its card, so nothing waits empty on screen. */}
        <At at={T.book} from={{ opacity: 0, y: 10 }}>
          <StepLabel n={2}>Book a time, or walk in</StepLabel>
          <Card className="px-4 py-4">
            <p className="text-[15px] leading-snug">Appointments open up to 7 days ahead. Every office also takes walk-ins all day, until it’s full.</p>
            <div className="mt-3 flex h-11 items-center justify-center rounded-full text-[15px] font-semibold" style={{ background: "var(--r-primary)", color: "var(--r-on-primary)" }}>
              Book on Skip the Line ↗
            </div>
            <At at={T.office} from={{ opacity: 0, y: 8 }}>
              <div className="mt-3 flex items-center gap-3 rounded-[12px] px-3 py-2.5" style={{ background: "var(--r-fill)" }}>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold">Carrboro Plaza driver license office</p>
                  <p className="text-[13px]" style={{ color: "var(--r-ink-2)" }}>
                    100 NC Highway 54, Carrboro · Mon to Fri, 8 to 5
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold" style={{ background: "var(--r-surface)", color: "var(--r-leaf-ink)" }}>
                  <PhoneIcon /> (919) 357-9060
                </span>
              </div>
            </At>
          </Card>
        </At>
      </motion.div>
      <TaskBar label="3 steps to go" />
    </Scene>
  );
}

export const scene = { Scene: DmvVisit, duration: DMV_VISIT_MS };
