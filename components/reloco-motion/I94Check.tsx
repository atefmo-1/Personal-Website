"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { useClock } from "./Stage";
import { At, Card, Heading, Scene, Tap, TaskBar, Verdict, ease } from "./ui";

// The I-94 check, in action: Mei's I-94 compared with her passport point by point. Four points
// match; the date of birth doesn't, so the check says "Needs a look", and one tap drafts the
// email to ISSS (Reloco's own template, filled with her first name and what differs).

const POINTS: { title: string; text: string; ok: boolean }[] = [
  { title: "Class of admission", text: "Reads F1, as it should", ok: true },
  { title: "Admit until", text: "Reads “D/S”, as it should", ok: true },
  { title: "Name", text: "Matches your passport", ok: true },
  { title: "Date of birth", text: "Different from your passport", ok: false },
  { title: "Passport number", text: "Matches your passport", ok: true },
];
// The mismatch gets a longer beat before it lands, and a longer one after.
const ROWS = [500, 900, 1300, 1850, 2650];
const FLAG = ROWS[3] + 650;
const NOTE = ROWS[4] + 600;
const BUTTON = NOTE + 350;
const TAP = BUTTON + 1500;
const OPEN = TAP + 180;
export const I94_CHECK_MS = OPEN + 4300;

// i94CorrectionEmail in Reloco (src/lib/email-drafts.ts), for firstName "Mei", visa "F-1" and
// a date of birth that differs.
const SUBJECT = "Question about my I-94 record";
const BODY = [
  "Hello,",
  "",
  "I’m Mei [last name], an F-1 student. I downloaded my most recent I-94 and it has a different date of birth from my passport.",
  "",
  "Could you tell me whether it needs correcting, and what I should do? I’ve attached my I-94, my passport photo page and my I-20.",
  "",
  "Thank you,",
  "Mei [last name]",
  "SEVIS ID: [from your I-20]",
];

function Icon({ size = 16, children }: { size?: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}
const Mail = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </Icon>
);

/** One point of the comparison. The mismatch lands with a brief gold wash, so the eye goes there. */
function Point({ i }: { i: number }) {
  const { t } = useClock();
  const p = POINTS[i];
  const at = ROWS[i];
  const verdictAt = at + (p.ok ? 220 : 380);
  return (
    <At at={at} from={{ opacity: 0, y: 8 }}>
      <div className="relative flex items-center gap-3.5 px-4 py-3.5" style={{ borderTop: i === 0 ? "none" : "1px solid var(--r-line)" }}>
        {!p.ok && t >= verdictAt && <motion.span aria-hidden className="absolute inset-0" style={{ background: "var(--r-gold-soft)" }} initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 1.4, ease: "easeOut" }} />}
        <span className="relative">
          <Verdict ok={p.ok} at={verdictAt} />
        </span>
        <div className="relative min-w-0 flex-1">
          <p className="text-[14px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
            {p.title}
          </p>
          <p className="text-[16px] leading-snug" style={{ color: "var(--r-ink)" }}>
            {p.text}
          </p>
        </div>
      </div>
    </At>
  );
}

/** Fades in at `at` but takes its space from the start, so the draft's height is known when it opens. */
function Reveal({ at, className, style, children }: { at: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const { t } = useClock();
  const on = t >= at;
  return (
    <motion.div className={className} style={style} initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 5 }} transition={{ duration: 0.4, ease }}>
      {children}
    </motion.div>
  );
}

/** Reloco's email draft: a button until it's tapped, then the email, ready to copy or open. */
function EmailDraft() {
  const { t } = useClock();
  const open = t >= OPEN;
  const pressed = t >= TAP && t < OPEN;
  return (
    <motion.div
      className="relative mt-2.5 overflow-hidden rounded-[14px]"
      style={{ background: pressed ? "var(--r-leaf-soft)" : "var(--r-fill)", transition: "background 150ms" }}
      initial={false}
      animate={{ height: open ? "auto" : 48, scale: pressed ? 0.98 : 1 }}
      transition={{ height: { duration: 0.6, ease }, scale: { duration: 0.15 } }}
    >
      {!open ? (
        <div className="relative flex h-12 items-center gap-2 px-3.5 text-[15px] font-semibold" style={{ color: "var(--r-leaf-ink)" }}>
          <Tap at={TAP} x={150} y="50%" />
          <Mail />
          Draft the email to ISSS about it
        </div>
      ) : (
        <div className="px-3.5 py-3">
          <Reveal at={OPEN + 80}>
            <p className="text-[12px] font-medium" style={{ color: "var(--r-ink-2)" }}>
              Subject
            </p>
            <p className="text-[15px] font-semibold">{SUBJECT}</p>
          </Reveal>
          <Reveal at={OPEN + 200} className="mt-2 rounded-[10px] px-3 py-2 text-[14px] leading-snug" style={{ background: "var(--r-surface)" }}>
            {BODY.map((line, i) => (
              <Reveal key={i} at={OPEN + 280 + i * 55}>
                <p>{line || "\u00a0"}</p>
              </Reveal>
            ))}
          </Reveal>
          <Reveal at={OPEN + 900}>
            <p className="mt-1.5 text-[12px]" style={{ color: "var(--r-ink-3)" }}>
              Check it and fill in anything in [brackets] before you send it.
            </p>
            <div className="mt-2 flex gap-2">
              <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
                <Icon size={14}>
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </Icon>
                Copy
              </span>
              <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)", color: "var(--r-leaf-ink)" }}>
                <Mail size={14} />
                Open in email
              </span>
            </div>
          </Reveal>
        </div>
      )}
    </motion.div>
  );
}

function I94Check() {
  const { t } = useClock();
  return (
    <Scene className="relative h-full">
      {/* When the email opens, the page scrolls with it so the whole draft is in view. */}
      <motion.div className="px-4 pt-9" initial={false} animate={{ y: t >= OPEN + 100 ? -228 : 0 }} transition={{ duration: 0.9, ease }}>
        <Heading
          right={
            t >= FLAG && (
              <motion.span className="text-[13px] font-semibold" style={{ color: "var(--r-urgent-ink)" }} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                Needs a look
              </motion.span>
            )
          }
        >
          Your I-94 check
        </Heading>

        <At at={250} from={{ opacity: 0, y: 14 }}>
          <Card className="mt-2.5 min-h-[345px] overflow-hidden">
            {POINTS.map((_, i) => (
              <Point key={i} i={i} />
            ))}
          </Card>
        </At>

        <At at={NOTE} from={{ opacity: 0 }}>
          <p className="mt-3 px-1 text-[14px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
            Compare it yourself on a fresh download from the CBP site first: Reloco reads documents with AI, and AI can misread. If it really differs, it needs correcting.{" "}
            <span className="font-semibold" style={{ color: "var(--r-leaf-ink)" }}>
              Get your I-94 corrected
            </span>
          </p>
        </At>

        <At at={BUTTON} from={{ opacity: 0, y: 8 }}>
          <EmailDraft />
        </At>

        <At at={BUTTON + 250} from={{ opacity: 0, y: 10 }}>
          <h2 className={`${relocoDisplay.className} mt-6 px-1 text-[26px] leading-none`}>Bring</h2>
          <Card className="mt-2.5 flex items-center gap-3 px-4 py-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full" style={{ background: "var(--r-fill)", color: "var(--r-ink-3)" }}>
              <Icon size={18}>
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8M16 13H8M16 17H8" />
              </Icon>
            </span>
            <div>
              <p className="text-[16px] leading-tight font-semibold">Passport</p>
              <p className="mt-0.5 text-[14px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
                Have your own copy ready.
              </p>
            </div>
          </Card>
        </At>
      </motion.div>

      <TaskBar />
    </Scene>
  );
}

export const scene = { Scene: I94Check, duration: I94_CHECK_MS };
