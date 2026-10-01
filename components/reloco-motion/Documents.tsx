"use client";

import { motion } from "framer-motion";
import { Fragment, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { relocoDisplay } from "@/lib/relocoFonts";
import { useClock } from "./Stage";
import { At, Scene, Tap, ease } from "./ui";

// Adding a passport to Documents: Upload, the opt-in to let AI read it, the reading, every
// detail laid out for the student to check, Confirm and save, then the passport on file with
// its number masked. The passport is Mei's specimen from Reloco's test documents (stamped
// SPECIMEN, every value invented), the same one in the case study's screenshot.

const UPLOAD = 900;
const CONSENT = UPLOAD + 1150;
const CHOOSE = CONSENT + 850;
const READING = CHOOSE + 250;
const REVIEW = READING + 1500;
const CONFIRM = REVIEW + 2400;
const SAVED = CONFIRM + 400;
const EXPAND = SAVED + 1250;
const FACTS = EXPAND + 450;
export const DOCUMENTS_MS = FACTS + 3300;

// The passport's fields, as the review form lists them, read from the specimen.
const READ = [
  { label: "Surname", value: "LIN" },
  { label: "Given names", value: "MEI" },
  { label: "Date of birth", value: "03/14/2008", date: true },
  { label: "Place of birth", value: "" },
  { label: "Sex", value: "F" },
  { label: "Issuing country", value: "CHN" },
  { label: "Passport number", value: "EK4829301", locked: true },
  { label: "Issued", value: "06/02/2024", date: true },
  { label: "Expires", value: "06/01/2034", date: true },
];

const danger = "#b42318"; // the app's --danger, not in the stage palette
const line = "1px solid var(--r-line)";

const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
/** The page's scroll: down to bring the whole form into view, back up once it's saved, then down with the opened passport so its details and the rows below stay in view. */
function scrollAt(t: number) {
  const seg = (a: number, b: number, from: number, to: number) => from + (to - from) * easeInOut(Math.min(1, Math.max(0, (t - a) / (b - a))));
  if (t < SAVED) return seg(REVIEW + 500, REVIEW + 1700, 0, 132);
  if (t < EXPAND) return seg(SAVED + 150, SAVED + 950, 132, 0);
  return seg(EXPAND + 350, EXPAND + 1550, 0, 114);
}

const Svg = ({ size, stroke = 2, children }: { size: number; stroke?: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);
const FileUp = () => (
  <Svg size={16}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4M12 12v6M15 15l-3-3-3 3" />
  </Svg>
);
const Check = ({ size = 16, stroke = 2 }: { size?: number; stroke?: number }) => (
  <Svg size={size} stroke={stroke}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);
const Lock = ({ size = 12 }: { size?: number }) => (
  <Svg size={size}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);
const Chevron = ({ up }: { up?: boolean }) => (
  <span className="shrink-0" style={{ color: "var(--r-ink-3)", transform: up ? "rotate(180deg)" : "none", transition: "transform 300ms" }}>
    <Svg size={20}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  </span>
);

/** Opens to its content's height and follows it as the content changes, then closes when `open` goes false. */
function Grow({ open, children }: { open: boolean; children: ReactNode }) {
  const { reduced } = useClock();
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  useLayoutEffect(() => {
    const el = inner.current!;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <motion.div className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: open ? h : 0, opacity: open ? 1 : 0 }} transition={reduced ? { duration: 0 } : { duration: 0.5, ease }}>
      <div ref={inner}>{children}</div>
    </motion.div>
  );
}

const Pill = ({ tone, children }: { tone: "urgent" | "done" | "soon"; children: ReactNode }) => {
  const look = { urgent: ["var(--r-urgent-soft)", "var(--r-urgent-ink)"], done: ["var(--r-leaf-soft)", "var(--r-leaf-ink)"], soon: ["var(--r-gold-soft)", "var(--r-gold-ink)"] }[tone];
  return (
    <span className="rounded-full px-2 py-0.5 text-[12px] font-semibold" style={{ background: look[0], color: look[1] }}>
      {children}
    </span>
  );
};

function Row({ label, status, line: sub, last }: { label: string; status: ReactNode; line: string; last?: boolean }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: last ? "none" : line }}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-semibold">{label}</p>
          {status}
        </div>
        <p className="mt-0.5 truncate text-[13px]" style={{ color: "var(--r-ink-2)" }}>
          {sub}
        </p>
      </div>
      <Chevron />
    </li>
  );
}

/** A button that dips when the fingertip lands on it. */
function Press({ at, className, style, children }: { at: number; className: string; style: CSSProperties; children: ReactNode }) {
  const { t } = useClock();
  return (
    <motion.span className={`relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap ${className}`} style={style} animate={{ scale: t >= at && t < at + 200 ? 0.95 : 1 }} transition={{ duration: 0.15 }}>
      <Tap at={at} x="50%" y="50%" />
      {children}
    </motion.span>
  );
}

const panel = { background: "var(--r-fill)" };

/** "Saved privately", the opt-in to let AI read it, then Choose. */
function Choose() {
  const { t } = useClock();
  const allowed = t >= CONSENT;
  return (
    <div className="mx-4 mb-4 rounded-[16px] px-4 py-4 text-[14px] leading-snug" style={panel}>
      <p style={{ color: "var(--r-ink-2)" }}>Saved privately. Only you can see it, and you can delete it anytime.</p>
      <div className="mt-2 flex items-start gap-2.5">
        <span className="relative mt-0.5 grid size-4 shrink-0 place-items-center rounded-[4px]" style={{ background: allowed ? "var(--r-leaf)" : "var(--r-surface)", boxShadow: allowed ? "none" : "inset 0 0 0 1.5px var(--r-ink-3)", color: "white", transition: "background 150ms" }}>
          <Tap at={CONSENT} x="50%" y="50%" />
          {allowed && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 26 }}>
              <Check size={12} stroke={3.5} />
            </motion.span>
          )}
        </span>
        <span>Let AI check it’s the right document and read the details for me to confirm. The file is sent once to Anthropic’s API, and isn’t used to train models.</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Press at={CHOOSE} className="h-10 px-4 text-[14px]" style={{ background: "var(--r-leaf)", color: "#13294b" }}>
          <FileUp /> Choose a photo or PDF
        </Press>
        <span className="inline-flex h-10 items-center px-4 text-[14px] font-semibold" style={{ color: "var(--r-ink-2)" }}>
          Cancel
        </span>
      </div>
    </div>
  );
}

function Reading() {
  const { t } = useClock();
  return (
    <div className="mx-4 mb-4 flex items-center gap-3 rounded-[16px] px-4 py-4 text-[14px]" style={panel}>
      <span style={{ color: "var(--r-leaf-ink)", opacity: 0.55 + 0.45 * Math.cos(((t - READING) / 1000) * Math.PI * 2) ** 2 }}>
        <Svg size={20}>
          <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
          <path d="M20 2v4M22 4h-4" />
          <circle cx="4" cy="20" r="2" />
        </Svg>
      </span>
      Checking it and reading the details…
    </div>
  );
}

const Calendar = () => (
  <Svg size={16}>
    <path d="M8 2v4M16 2v4M3 10h18" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
  </Svg>
);

/** Every field the AI read, filling in one after another, for the student to check. */
function Review() {
  const { t } = useClock();
  return (
    <div className="mx-4 mb-4 rounded-[16px] px-4 py-4" style={panel}>
      <p className="text-[15px] font-semibold">Check every detail</p>
      <p className="mt-0.5 text-[13px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
        Read by AI from your upload. Fix anything that’s wrong; nothing is saved until you confirm.
      </p>
      <div className="mt-3 grid gap-2.5">
        {READ.map((f, i) => {
          const filled = t >= REVIEW + 300 + i * 120;
          return (
            <div key={f.label} className="rounded-[12px] px-3 pt-2 pb-1.5" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
              <span className="flex h-4 items-center gap-1 text-[12px] font-medium" style={{ color: "var(--r-ink-2)" }}>
                {f.label}
                {f.locked && <Lock />}
              </span>
              <span className="flex h-7 items-center justify-between text-[15px] font-medium">
                <motion.span initial={false} animate={{ opacity: filled ? 1 : 0, x: filled ? 0 : -6 }} transition={{ duration: 0.35, ease }}>
                  {f.value}
                </motion.span>
                {f.date && <Calendar />}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Press at={CONFIRM} className="h-10 px-4 text-[14px]" style={{ background: "var(--r-leaf)", color: "#13294b" }}>
          <Check /> Confirm and save
        </Press>
        <span className="inline-flex h-10 items-center px-4 text-[14px] font-semibold" style={{ color: "var(--r-ink-2)" }}>
          Later
        </span>
      </div>
    </div>
  );
}

/** Mei's specimen passport, redrawn from Reloco's test file (1200 x 800). */
function Specimen() {
  const label = (x: number, y: number, k: string, v: string) => (
    <g key={k}>
      <text x={x} y={y} fontSize="13" fill="#555">
        {k}
      </text>
      <text x={x} y={y + 27} fontSize="24" fontWeight="700" fill="#111">
        {v}
      </text>
    </g>
  );
  const left: [string, string][] = [
    ["TYPE", "P"],
    ["SURNAME", "LIN"],
    ["GIVEN NAMES", "MEI"],
    ["NATIONALITY", "CHINA"],
    ["DATE OF BIRTH", "14 MAR 2008"],
  ];
  const right: [string, string][] = [
    ["ISSUING COUNTRY", "CHN"],
    ["PASSPORT NO.", "EK4829301"],
    ["SEX", "F"],
    ["DATE OF ISSUE", "02 JUN 2024"],
    ["DATE OF EXPIRY", "01 JUN 2034"],
  ];
  return (
    <svg viewBox="0 0 1200 800" className="block w-full" style={{ fontFamily: "Helvetica, Arial, sans-serif" }} aria-hidden>
      <defs>
        <linearGradient id="specimen-paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3efe7" />
          <stop offset="1" stopColor="#e3e9f1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#specimen-paper)" />
      <text x="52" y="70" fontSize="29" fontWeight="700" fill="#111">
        PASSPORT
      </text>
      <text x="1148" y="61" fontSize="17" fontWeight="700" fill="#333" textAnchor="end">
        SPECIMEN · NOT A REAL DOCUMENT
      </text>
      <rect x="52" y="104" width="230" height="290" rx="10" fill="#cfd7e1" />
      <text x="167" y="254" fontSize="16" fontWeight="700" fill="#6b7280" textAnchor="middle">
        PHOTO
      </text>
      {left.map(([k, v], i) => label(322, 116 + i * 59, k, v))}
      {right.map(([k, v], i) => label(755, 116 + i * 59, k, v))}
      <g fontFamily="'Courier New', monospace" fontSize="25" fontWeight="700" fill="#222">
        <text x="52" y="441" textLength="806">
          P&lt;CHNLIN&lt;&lt;MEI&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </text>
        <text x="52" y="470" textLength="790">
          EK48293013CHN0803146F3406018&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
        </text>
      </g>
      <text x="600" y="470" fontSize="170" fontWeight="800" fill="rgb(200 60 60 / 0.22)" textAnchor="middle" transform="rotate(-26 600 430)">
        SPECIMEN
      </text>
    </svg>
  );
}

/** The confirmed passport, opened: the file, then the details, the number shown only as its last four. */
function OnFile() {
  const { t } = useClock();
  // What the Vault lists once it's confirmed: every field it holds (place of birth was blank), dates
  // written out, and the number as stored, masked to its last four.
  const facts = [
    { label: "Surname", value: "LIN" },
    { label: "Given names", value: "MEI" },
    { label: "Date of birth", value: "Mar 14, 2008" },
    { label: "Sex", value: "F" },
    { label: "Issuing country", value: "CHN" },
    { label: "Passport number", value: "9301", masked: true },
    { label: "Issued", value: "Jun 2, 2024" },
    { label: "Expires", value: "Jun 1, 2034" },
  ];  return (
    <div className="px-4 pb-4">
      <motion.div className="overflow-hidden rounded-[14px]" style={{ background: "var(--r-fill)", boxShadow: "0 0 0 1px var(--r-line)" }} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }}>
        <Specimen />
      </motion.div>
      <div className="mt-1.5 flex items-center justify-between gap-2 text-[12px]" style={{ color: "var(--r-ink-3)" }}>
        <span>Only you can see this. Views are logged.</span>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "var(--r-leaf-ink)" }}>
          <Svg size={16}>
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
          </Svg>
          Full size
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[14px]">
        {facts.map((f, i) => {
          const at = FACTS + i * 90;
          const on = t >= at;
          return (
            <Fragment key={f.label}>
              <motion.dt style={{ color: "var(--r-ink-2)" }} initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.4 }}>
                {f.label}
              </motion.dt>
              <motion.dd className="flex items-center gap-1 font-medium" initial={false} animate={{ opacity: on ? 1 : 0, x: on ? 0 : -6 }} transition={{ duration: 0.4, ease }}>
                {f.masked ? (
                  <>
                    <motion.span style={{ color: "var(--r-ink-3)" }} initial={false} animate={{ scale: t >= at + 250 ? 1 : 0 }} transition={{ type: "spring", stiffness: 520, damping: 22 }}>
                      <Lock />
                    </motion.span>
                    <span>
                      {[0, 1, 2, 3].map((d) => (
                        <motion.span key={d} className="inline-block" initial={false} animate={{ opacity: t >= at + 400 + d * 90 ? 1 : 0, y: t >= at + 400 + d * 90 ? 0 : -5 }} transition={{ type: "spring", stiffness: 500, damping: 24 }}>
                          •
                        </motion.span>
                      ))}{" "}
                      {f.value}
                    </span>
                  </>
                ) : (
                  f.value
                )}
              </motion.dd>
            </Fragment>
          );
        })}
      </dl>
      <At at={FACTS + 800} from={{ opacity: 0 }}>
        <p className="mt-3 text-[12px]" style={{ color: "var(--r-ink-3)" }}>
          passport.png · added Sep 12, 2026
        </p>
        <div className="mt-3 flex gap-2">
          <span className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-[13px] font-semibold" style={{ background: "var(--r-surface)", boxShadow: "inset 0 0 0 1px var(--r-line)" }}>
            <Svg size={16}>
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5" />
            </Svg>
            Replace
          </span>
          <span className="inline-flex h-9 items-center gap-2 px-3 text-[13px] font-semibold" style={{ color: danger }}>
            <Svg size={16}>
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
            </Svg>
            Delete
          </span>
        </div>
      </At>
    </div>
  );
}

function Passport() {
  const { t } = useClock();
  const saved = t >= SAVED;
  const step = t < READING ? <Choose /> : t < REVIEW ? <Reading /> : <Review />;
  return (
    <li className="relative" style={{ borderBottom: line }}>
      <div className="relative flex items-center gap-3 px-4 py-3.5">
        {saved && <Tap at={EXPAND} x="40%" y="50%" />}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-semibold">Passport</p>
            {saved ? (
              <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 480, damping: 22 }}>
                <Pill tone="done">On file</Pill>
              </motion.span>
            ) : (
              <Pill tone="urgent">Missing</Pill>
            )}
          </div>
          {saved && (
            <motion.p className="mt-0.5 truncate text-[13px]" style={{ color: "var(--r-ink-2)" }} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease, delay: 0.15 }}>
              Expires Jun 1, 2034
            </motion.p>
          )}
        </div>
        {saved ? (
          <Chevron up={t >= EXPAND} />
        ) : (
          <Press at={UPLOAD} className="h-9 shrink-0 px-3 text-[13px]" style={{ background: "var(--r-surface)", boxShadow: "inset 0 0 0 1px var(--r-line)" }}>
            <FileUp /> Upload
          </Press>
        )}
      </div>
      {t >= UPLOAD + 150 && t < SAVED + 700 && <Grow open={!saved}>{step}</Grow>}
      {t >= EXPAND + 100 && (
        <Grow open>
          <OnFile />
        </Grow>
      )}
    </li>
  );
}

function Documents() {
  const { t } = useClock();
  return (
    <Scene className="h-full overflow-hidden">
      <div className="px-3 pt-9" style={{ transform: `translateY(${-scrollAt(t)}px)` }}>
        <div className="mb-2.5 flex items-baseline justify-between px-1">
          <h2 className={`${relocoDisplay.className} text-[26px] leading-none`}>Required</h2>
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: "var(--r-ink-2)" }}>
            <motion.span key={t >= SAVED ? 2 : 1} className="inline-block" initial={{ y: t >= SAVED ? -8 : 0, opacity: t >= SAVED ? 0 : 1 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35, ease }}>
              {t >= SAVED ? 2 : 1}
            </motion.span>{" "}
            of 3 on file
          </span>
        </div>
        <p className="mb-3 px-1 text-[14px] leading-snug" style={{ color: "var(--r-ink-2)" }}>
          Reloco asks for each one once you have it. Your plan uses the real dates on them.
        </p>
        <At at={150} from={{ opacity: 0, y: 14 }}>
          <ul className="overflow-hidden rounded-[20px]" style={{ background: "var(--r-surface)", boxShadow: "var(--r-shadow)" }}>
            <Passport />
            <Row label="F-1 visa" status={<Pill tone="done">On file</Pill>} line="Expires Aug 17, 2031" />
            <Row label="I-20" status={<Pill tone="soon">Needs review</Pill>} line="Uploaded, not checked yet" last />
          </ul>
        </At>
      </div>
    </Scene>
  );
}

export const scene = { Scene: Documents, duration: DOCUMENTS_MS };
