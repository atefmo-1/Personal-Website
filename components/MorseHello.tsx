"use client";

import { useEffect, useRef, useState } from "react";

// "SAY HELLO" in Morse code, keyed out letter by letter the first time it scrolls into view, at
// real Morse timing (a dash is three dots long). Click to send it again.
const CODE: Record<string, string> = { S: "...", A: ".-", Y: "-.--", H: "....", E: ".", L: ".-..", O: "---" };
const TEXT = "SAY HELLO";
const UNIT = 90; // ms per dot

const DOT = 7;
const DASH = 22;
const GAP = 6;
const LETTER_GAP = 18;
const WORD_GAP = 34;

// Lay out the symbols and work out when each one is keyed.
function build() {
  let x = 0;
  let t = 0;
  const symbols: { x: number; w: number; dash: boolean; at: number; letter: number }[] = [];
  const letters: { ch: string; x: number; w: number; at: number }[] = [];
  TEXT.split("").forEach((ch, li) => {
    if (ch === " ") {
      x += WORD_GAP - LETTER_GAP;
      t += UNIT * 4;
      return;
    }
    const start = x;
    const at = t;
    CODE[ch].split("").forEach((s, i) => {
      const dash = s === "-";
      if (i) x += GAP;
      symbols.push({ x, w: dash ? DASH : DOT, dash, at: t, letter: li });
      x += dash ? DASH : DOT;
      t += UNIT * (dash ? 3 : 1) + UNIT;
    });
    letters.push({ ch, x: start, w: x - start, at });
    x += LETTER_GAP;
    t += UNIT * 2;
  });
  return { symbols, letters, width: x - LETTER_GAP, total: t };
}

const { symbols, letters, width, total } = build();

export function MorseHello({ className = "" }: { className?: string }) {
  const [t, setT] = useState<number>(-1); // ms into the message; -1 before it starts
  const ref = useRef<HTMLButtonElement>(null);
  const raf = useRef(0);

  function play() {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return setT(total);
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const tick = (now: number) => {
      const e = now - t0;
      setT(e);
      if (e < total) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      play();
      io.disconnect();
    }, { threshold: 0.6 });
    io.observe(ref.current!);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={play}
      title="Click to send it again"
      aria-label="“Say hello” in Morse code. Click to send it again."
      className={`group block text-left print:hidden ${className}`}
    >
      <svg viewBox={`-2 -2 ${width + 4} 40`} className="block h-10 w-auto max-w-full text-fg sm:h-12" aria-hidden>
        {symbols.map((s, i) => {
          const on = t >= s.at;
          return s.dash ? (
            <rect key={i} x={s.x} y={6} width={s.w} height={DOT} rx={DOT / 2} fill="currentColor" opacity={on ? 1 : 0.15} className="transition-opacity duration-150" />
          ) : (
            <circle key={i} cx={s.x + DOT / 2} cy={6 + DOT / 2} r={DOT / 2} fill="currentColor" opacity={on ? 1 : 0.15} className="transition-opacity duration-150" />
          );
        })}
        {letters.map((l) => (
          <text key={l.x} x={l.x + l.w / 2} y={34} textAnchor="middle" className="fill-current font-mono text-[10px]" opacity={t >= l.at ? 0.8 : 0.2}>
            {l.ch}
          </text>
        ))}
      </svg>
      <span className="label mt-2 block">Fig. 2 · “Say hello”, in Morse code · ↻ send again</span>
    </button>
  );
}
