"use client";

import { motion } from "framer-motion";
import { At, Card, CheckRow, DateField, Heading, Scene, TaskBar, typedFor } from "./ui";
import { useClock } from "./Stage";

// The trip check, in action: a winter break typed in, then each document checked against the
// dates. The data is Aisha's, the invented junior in the case study (specimens/aisha and
// specimens/cpt in Reloco): her travel signature from Nov 20, 2025 runs out before she's back;
// her passport and visa are fine.

const LEAVE = "12/15/2026";
const BACK = "01/10/2027";
const T = { leave: 900, back: 900 + typedFor(LEAVE) + 700 };
const RESULTS = T.back + typedFor(BACK) + 800;
const TAP = RESULTS + 3000;
export const TRIP_CHECK_MS = TAP + 1300;

export function TripCheck() {
  const { t } = useClock();
  return (
    <Scene className="h-full px-4 pt-9">
      <Heading
        right={
          t >= RESULTS + 900 && (
            <motion.span className="text-[13px] font-semibold" style={{ color: "var(--r-urgent-ink)" }} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              1 to sort first
            </motion.span>
          )
        }
      >
        Check a trip
      </Heading>

      <Card className="mt-2.5 px-4 py-4">
        <p className="text-[14px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
          Planning to leave the US? Check your documents against your dates before you book. Nothing you enter is saved.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <DateField label="Leave the US" value={LEAVE} at={T.leave} />
          <DateField label="Back in the US" value={BACK} at={T.back} />
          <DateField className="col-span-2" label="Newest travel signature, from your I-20 in Documents" value="11/20/2025" />
        </div>
      </Card>

      <At at={RESULTS} from={{ opacity: 0, y: 18 }}>
        <Card className="mt-2.5 overflow-hidden">
          <CheckRow first at={RESULTS} ok={false} title="Travel signature" text="It expires on Nov 20, 2026, before you’re back. Request a new one from ISSS before you go." action="Open" tapAt={TAP} />
          <CheckRow at={RESULTS + 380} ok={true} title="Passport" text="Valid until Mar 14, 2031, after you’re back." />
          <CheckRow at={RESULTS + 760} ok={true} title="Visa" text="Valid until Jul 1, 2029, after you’re back." />
        </Card>
      </At>

      <At at={RESULTS + 1300} from={{ opacity: 0 }}>
        <p className="mt-3 px-1 text-[12px] leading-snug" style={{ color: "var(--r-ink-3)" }}>
          These checks use the dates in your Documents. For anything about your status, ask ISSS.
        </p>
      </At>

      <TaskBar />
    </Scene>
  );
}
