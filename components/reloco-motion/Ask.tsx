"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { H, useClock } from "./Stage";
import { At, Scene, Tap, Typed, ease, typedFor } from "./ui";

// Ask Reloco, answering a question about work hours: typed and sent, the check it runs, the
// answer written out, then the saved answer marked "Confirm with ISSS" with its sources. The
// answer is the one in the case study's screenshot, word for word.

const QUESTION = "Can I work 30 hours a week at my campus job?";
const ANSWER = [
  "No, not right now. Classes are in session (fall semester runs through early December), and F-1 students can only work up to 20 hours a week on campus while classes are in session. Full-time hours (21+) are only allowed during official university breaks and summer.",
  'Also double check that your job actually counts as "on campus": it generally only qualifies if UNC itself pays you. Places like UNC Hospitals, the Carolina Inn, The Daily Tar Heel, or most Franklin Street businesses don\'t count as on-campus employment even if they\'re near campus.',
  "If you want to work more hours, it would be a status issue to just go over 20 hours during the semester, so please check with ISSS first before making any changes to your work schedule. They can tell you if there's any exception that applies to your situation.",
];
const SOURCES = ["ISSS: On-campus employment", "UNC International Student and Scholar Services"];
const STARTERS = ["How many hours can I work on campus?", "What do I need before I travel home?", "When can I apply for OPT?"];

const TYPE = 1100;
const SPEED = 42;
const SEND = TYPE + typedFor(QUESTION, SPEED) + 500;
const THINK = SEND + 450;
const CHECK = SEND + 1050;
const STREAM = SEND + 2500;
const STREAM_MS = 2900;
const DONE = STREAM + STREAM_MS + 250;
export const ASK_MS = DONE + 3000;

const TEXT = ANSWER.join("\n\n");

/** The answer as written so far: whole words only, the way the stream arrives. */
function written(t: number) {
  if (t >= STREAM + STREAM_MS) return TEXT;
  const n = Math.floor((TEXT.length * Math.max(0, t - STREAM)) / STREAM_MS);
  const cut = TEXT.lastIndexOf(" ", n);
  return TEXT.slice(0, Math.max(0, cut));
}

const Svg = ({ size, stroke = 2, children }: { size: number; stroke?: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);
const Sparkles = ({ size }: { size: number }) => (
  <Svg size={size}>
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
    <path d="M20 2v4M22 4h-4" />
    <circle cx="4" cy="20" r="2" />
  </Svg>
);
const Avatar = () => (
  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full" style={{ background: "var(--r-leaf-soft)", color: "var(--r-leaf-ink)" }}>
    <Sparkles size={14} />
  </span>
);

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="space-y-2.5 text-[15px] leading-relaxed">
      {text.split(/\n{2,}/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

/** What it's doing before it writes: dots, then the tool's own status line. */
function Status() {
  const { t } = useClock();
  const label = t >= CHECK ? "Checking your work eligibility" : "Thinking";
  return (
    <At at={THINK} from={{ opacity: 0, y: 8 }}>
      <div className="flex items-center gap-2.5">
        <Avatar />
        <span className="flex items-center gap-2 rounded-[18px] px-4 py-3" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
          <span className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 rounded-full" style={{ background: "var(--r-ink-3)", transform: `translateY(${-3 * Math.max(0, Math.sin(((t - i * 140) / 600) * Math.PI * 2))}px)` }} />
            ))}
          </span>
          <motion.span key={label} className="text-[13px]" style={{ color: "var(--r-ink-2)" }} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease }}>
            {label}
          </motion.span>
        </span>
      </div>
    </At>
  );
}

function Reply() {
  const { t } = useClock();
  const done = t >= DONE;
  return (
    <div className="flex gap-2.5">
      <Avatar />
      <div className="min-w-0 flex-1">
        {/* The saved answer carries its label: it opens room above the reply, then pops in. */}
        {done && (
          <motion.div className="overflow-hidden" initial={{ height: 0 }} animate={{ height: "auto" }} transition={{ duration: 0.35, ease }}>
            <motion.p
              className="mb-2 inline-flex origin-left items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
              style={{ background: "var(--r-gold-soft)", color: "var(--r-gold-ink)" }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 480, damping: 24, delay: 0.15 }}
            >
              <Svg size={14}>
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="M12 8v4M12 16h.01" />
              </Svg>
              Confirm with ISSS
            </motion.p>
          </motion.div>
        )}
        <div className="rounded-[20px] rounded-tl-[6px] px-4 py-3" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
          <Paragraphs text={written(t)} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 px-1">
          {SOURCES.map((s, i) => (
            <At key={s} at={DONE + 450 + i * 170} from={{ opacity: 0, y: 6, scale: 0.94 }}>
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium" style={{ background: "var(--r-fill)", color: "var(--r-ink-2)" }}>
                {s}
                <Svg size={12}>
                  <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </Svg>
              </span>
            </At>
          ))}
        </div>
      </div>
    </div>
  );
}

function Composer() {
  const { t } = useClock();
  const typing = t >= TYPE && t < SEND;
  const ready = t >= TYPE + SPEED && t < SEND + 100;
  const pressed = t >= SEND && t < SEND + 200;
  return (
    <div className="absolute right-3 bottom-4 left-3">
      <div className="rounded-[22px] p-2" style={{ background: "var(--r-surface)", boxShadow: `${typing ? "0 0 0 2px var(--r-leaf), " : ""}0 22px 50px -14px rgb(19 41 75 / 0.35), 0 0 0 1px var(--r-line)`, transition: "box-shadow 200ms" }}>
        <div className="relative min-h-11 px-2.5 pt-2.5 pb-1 text-[15px] leading-snug">
          <Tap at={TYPE - 150} x={70} y="60%" />
          {t < SEND ? <Typed text={QUESTION} at={TYPE} speed={SPEED} placeholder="Ask anything" /> : <span style={{ color: "var(--r-ink-3)" }}>Ask anything</span>}
        </div>
        <div className="relative flex items-center gap-0.5" style={{ color: "var(--r-ink-2)" }}>
          {/* Outside the send button, which dims as soon as it's pressed. */}
          <Tap at={SEND} x="calc(100% - 18px)" y="50%" />
          <span className="grid size-9 place-items-center">
            <Svg size={18}>
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </Svg>
          </span>
          <span className="grid size-9 place-items-center">
            <Svg size={18}>
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </Svg>
          </span>
          <motion.span
            className="relative ml-auto grid size-9 place-items-center rounded-full"
            style={{ background: "var(--r-primary)", color: "var(--r-on-primary)" }}
            animate={{ opacity: ready ? 1 : 0.25, scale: pressed ? 0.88 : 1 }}
            transition={{ duration: 0.18 }}
          >
            <Svg size={18} stroke={2.4}>
              <path d="m5 12 7-7 7 7M12 19V5" />
            </Svg>
          </motion.span>
        </div>
      </div>
      <p className="mt-1.5 px-2 text-center text-[11px]" style={{ color: "var(--r-ink-3)" }}>
        Guidance, not legal advice. ISSS has the final word.
      </p>
    </div>
  );
}

function Ask() {
  const { t, reduced } = useClock();
  const sent = t >= SEND + 150;
  // The page follows the conversation down as the answer grows, keeping its end above the composer.
  const content = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const el = content.current!;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const y = Math.min(0, H - height);

  return (
    <Scene className="relative h-full overflow-hidden">
      <motion.div ref={content} className="px-3 pb-[136px]" animate={{ y }} transition={reduced ? { duration: 0 } : { duration: 0.7, ease }}>
        <p className={`${relocoDisplay.className} px-2 pt-3 text-[28px] leading-none`}>reloco</p>

        <header className="mt-9 flex items-center gap-3 px-1 pb-2">
          <span className="grid size-11 shrink-0 place-items-center rounded-full" style={{ background: "var(--r-leaf-soft)", color: "var(--r-leaf-ink)" }}>
            <Sparkles size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className={`${relocoDisplay.className} text-[32px] leading-tight`}>Ask Reloco</h1>
            <p className="text-[12px]" style={{ color: "var(--r-ink-2)" }}>
              Checks official sites
            </p>
          </div>
          {sent && (
            <motion.span className="rounded-full px-2.5 py-1.5 text-[12px] font-semibold" style={{ color: "var(--r-ink-2)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              Clear
            </motion.span>
          )}
        </header>

        <div className="space-y-5 py-5">
          {!sent ? (
            <motion.div className="px-1 pt-2" animate={{ opacity: t >= SEND ? 0 : 1 }} transition={{ duration: 0.15 }}>
              <p className={`${relocoDisplay.className} text-[26px] leading-tight`}>Hi Aisha. What can I help with?</p>
              <p className="mt-1.5 text-[14px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
                Ask about visas, work, taxes, travel or campus, or paste an email you got.
              </p>
              <div className="mt-4 flex flex-col items-start gap-2">
                {STARTERS.map((s, i) => (
                  <At key={s} at={200 + i * 110} from={{ opacity: 0, y: 8 }}>
                    <span className="block rounded-full px-4 py-2.5 text-[14px] font-medium" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow), inset 0 0 0 1px var(--r-line)" }}>
                      {s}
                    </span>
                  </At>
                ))}
                <At at={530} from={{ opacity: 0, y: 8 }}>
                  <span className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold" style={{ color: "var(--r-leaf-ink)" }}>
                    <Svg size={16}>
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </Svg>
                    Explain an email or letter
                  </span>
                </At>
              </div>
            </motion.div>
          ) : (
            <>
              <At at={SEND + 150} from={{ opacity: 0, y: 40, scale: 0.96 }} className="flex origin-bottom-right justify-end">
                <div className="max-w-[85%] rounded-[20px] rounded-br-[6px] px-4 py-2.5 text-[15px] leading-snug" style={{ background: "var(--r-primary)", color: "var(--r-on-primary)" }}>
                  {QUESTION}
                </div>
              </At>
              {t < STREAM ? <Status /> : <Reply />}
            </>
          )}
        </div>
      </motion.div>

      <Composer />
    </Scene>
  );
}

export const scene = { Scene: Ask, duration: ASK_MS };
