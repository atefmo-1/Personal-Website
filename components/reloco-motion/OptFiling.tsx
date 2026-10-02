"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { At, Card, CheckRow, DateField, Heading, Scene, TaskBar, ease, typedFor } from "./ui";
import { useClock } from "./Stage";

// The OPT application check, in action. The data is Aisha's, the invented junior in the case
// study, now graduating: her I-20 says the program ends May 13, 2028, she has 3 months of
// full-time CPT, and it's Mar 1, 2028. ISSS issued her OPT I-20 on Feb 20, so USCIS must receive
// her application by Mar 21 (30 days later), well before the 60-day limit after graduation.
// Wording and rules as in Reloco's opt-filing card.

const ISSUED = "02/20/2028";
const T = {
  end: 700,
  issued: 1700,
  window: 1700 + typedFor(ISSUED) + 600,
  scroll: 0,
  cpt: 0,
  year: 0,
  docs: 0,
};
T.scroll = T.window + 2200;
T.cpt = T.scroll + 500;
T.year = T.cpt + 450;
T.docs = T.year + 900;
export const OPT_FILING_MS = T.docs + 1600 + 3200;

const SCROLL = 330; // px the page moves up to reach the eligibility checks

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

export function OptFiling() {
  const { t, reduced } = useClock();
  const y = reduced || t >= T.scroll ? -SCROLL : 0;
  return (
    <Scene className="h-full overflow-hidden">
      <motion.div className="px-4 pt-9" animate={{ y }} transition={{ duration: 1.1, ease }}>
        <Heading
          right={
            t >= T.window + 300 && (
              <motion.span className="text-[13px] font-semibold" style={{ color: "var(--r-leaf-ink)" }} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                21 days left
              </motion.span>
            )
          }
        >
          Your OPT application
        </Heading>

        <StepLabel n={1}>When USCIS must receive it</StepLabel>
        <Card className="overflow-hidden">
          <CheckRow first at={T.end} ok title="Your program ends" text="May 13, 2028, from your I-20 in Documents" />
          <At at={T.end + 450} from={{ opacity: 0, y: 8 }}>
            <div className="px-4 py-3.5" style={{ borderTop: "1px solid var(--r-line)" }}>
              <DateField label="When did ISSS issue your OPT I-20?" value={ISSUED} at={T.issued} />
            </div>
          </At>
          <At at={T.window} from={{ opacity: 0, y: 10 }}>
            <div className="px-4 py-3.5" style={{ background: "var(--r-leaf-soft)" }}>
              <p className="text-[16px] leading-snug font-semibold">USCIS can receive it from Feb 20, 2028 to Mar 21, 2028.</p>
              <p className="mt-1 text-[13px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
                21 days left, counting today. USCIS goes by the day it receives it, not the day you mail it. The last day is 30 days after your OPT I-20.
              </p>
            </div>
          </At>
        </Card>

        {/* Each step arrives with its card, so nothing waits empty on screen. */}
        <At at={T.cpt - 200} from={{ opacity: 0, y: 12 }}>
          <StepLabel n={2}>Make sure you’re eligible</StepLabel>
          <Card className="overflow-hidden">
            <CheckRow first at={T.cpt} ok title="CPT" text="3 of 12 months of full-time CPT used." />
            <CheckRow at={T.year} ok title="A full academic year in F-1 status" text="Your program started more than a year before it ends." />
          </Card>
        </At>

        <At at={T.docs - 200} from={{ opacity: 0, y: 12 }}>
        <StepLabel n={3}>What to send</StepLabel>
        <Card className="overflow-hidden">
          <CheckRow first at={T.docs} ok title="Passport" text="In Documents." />
          <CheckRow at={T.docs + 350} ok title="I-94" text="In Documents." />
          <CheckRow at={T.docs + 700} ok title="Your OPT I-20, signed on page 1" text="In Documents. Use the new one with your OPT recommendation." />
          <At at={T.docs + 1100} from={{ opacity: 0, y: 8 }}>
            <div className="px-4 py-3" style={{ borderTop: "1px solid var(--r-line)" }}>
              <p className="text-[14px]" style={{ color: "var(--r-ink-2)" }}>
                Fee
              </p>
              <p className="text-[16px] leading-snug">$470 online or $520 on paper, with no biometrics fee.</p>
            </div>
          </At>
        </Card>
        </At>
      </motion.div>
      <TaskBar label="5 steps to go" />
    </Scene>
  );
}

export const scene = { Scene: OptFiling, duration: OPT_FILING_MS };
