"use client";

import { useEffect, useRef, useState } from "react";
import { RedrawButton } from "./Art";

// A deterministic finite automaton for the regular expression ATE+F: A, then T, then one or
// more E's, then F. It reads a word one letter at a time; the lit state shows where it is, and
// a letter with no arrow sends it to the dead state (rejected). "Try another word" feeds it the
// next one. Reduced-motion readers see each result straight away.
const WORDS = ["ATEF", "ATEEEF", "AFTER", "FATE", "ATE"];
const STEP = 650; // ms per letter

// q0 -A-> q1 -T-> q2 -E-> q3 (-E-> q3) -F-> q4 (accept)
const NEXT: Record<number, Record<string, number>> = { 0: { A: 1 }, 1: { T: 2 }, 2: { E: 3 }, 3: { E: 3, F: 4 }, 4: {} };
const ACCEPT = 4;

function run(word: string) {
  // The state after each letter; -1 is the dead state
  const states = [0];
  let s = 0;
  for (const ch of word) {
    s = s === -1 ? -1 : NEXT[s][ch] ?? -1;
    states.push(s);
  }
  return states;
}

const W = 420;
const H = 150;
const X = (i: number) => 34 + i * 88;
const Y = 54;
const R = 15;

export function Automaton({ caption, className = "" }: { caption: string; className?: string }) {
  const [wi, setWi] = useState(0);
  const [step, setStep] = useState(0); // letters read so far
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const word = WORDS[wi];
  const states = run(word);
  const done = step >= word.length;
  const state = states[Math.min(step, word.length)];
  const accepted = done && state === ACCEPT;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setSeen(true);
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return setStep(word.length);
    if (step >= word.length) return;
    const t = setTimeout(() => setStep(step + 1), step === 0 ? 500 : STEP);
    return () => clearTimeout(t);
  }, [seen, step, word]);

  const next = () => {
    setWi((wi + 1) % WORDS.length);
    setStep(0);
  };

  const arrow = (from: number, to: number, label: string) => (
    <g key={`${from}-${to}`}>
      <line x1={X(from) + R} y1={Y} x2={X(to) - R - 4} y2={Y} stroke="currentColor" strokeWidth={1.1} markerEnd="url(#dfa-arrow)" />
      <text x={(X(from) + X(to)) / 2} y={Y - 8} textAnchor="middle" className="fill-current font-mono text-[11px]">
        {label}
      </text>
    </g>
  );

  return (
    <figure ref={ref} className={`print:hidden ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full text-fg" role="img" aria-label={`A finite automaton for the pattern ATE+F reading the word ${word}. ${done ? (accepted ? "Accepted." : "Rejected.") : ""}`}>
        <defs>
          <marker id="dfa-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="currentColor" />
          </marker>
        </defs>
        {/* Start arrow */}
        <line x1={2} y1={Y} x2={X(0) - R - 4} y2={Y} stroke="currentColor" strokeWidth={1.1} markerEnd="url(#dfa-arrow)" />
        {arrow(0, 1, "A")}
        {arrow(1, 2, "T")}
        {arrow(2, 3, "E")}
        {arrow(3, 4, "F")}
        {/* Self-loop on q3 for the extra E's */}
        <path d={`M${X(3) - 8} ${Y - R + 2} C${X(3) - 18} ${Y - 46} ${X(3) + 18} ${Y - 46} ${X(3) + 8} ${Y - R + 2}`} fill="none" stroke="currentColor" strokeWidth={1.1} markerEnd="url(#dfa-arrow)" />
        <text x={X(3)} y={Y - 40} textAnchor="middle" className="fill-current font-mono text-[11px]">
          E
        </text>
        {[0, 1, 2, 3, 4].map((i) => {
          const on = seen && state === i;
          return (
            <g key={i}>
              <circle cx={X(i)} cy={Y} r={R} fill={on ? "currentColor" : "rgb(var(--bg))"} stroke="currentColor" strokeWidth={1.3} className="transition-colors duration-200" />
              {i === ACCEPT && <circle cx={X(i)} cy={Y} r={R - 4} fill="none" stroke={on ? "rgb(var(--bg))" : "currentColor"} strokeWidth={1.1} />}
              <text x={X(i)} y={Y + 4} textAnchor="middle" className="font-mono text-[10px]" fill={on ? "rgb(var(--bg))" : "currentColor"}>
                q{i}
              </text>
            </g>
          );
        })}
        {/* The input tape */}
        {word.split("").map((ch, i) => {
          const x = 34 + i * 26;
          const read = seen && i < step;
          const current = seen && i === step - 1;
          return (
            <g key={i}>
              <rect x={x} y={104} width={22} height={24} rx={3} fill="none" stroke="currentColor" strokeOpacity={current ? 1 : 0.35} strokeWidth={current ? 1.6 : 1} />
              <text x={x + 11} y={121} textAnchor="middle" className="fill-current font-mono text-[12px]" opacity={read ? 1 : 0.4}>
                {ch}
              </text>
            </g>
          );
        })}
        <text x={W - 4} y={121} textAnchor="end" className="fill-current font-mono text-[11px] uppercase tracking-[0.14em]" opacity={done && seen ? 1 : 0}>
          {accepted ? "✓ accepted" : state === -1 ? "✗ rejected (dead state)" : "✗ rejected (not in q4)"}
        </text>
      </svg>
      <figcaption className="label mt-3 flex items-baseline justify-between gap-4">
        <span>{caption}</span>
        <RedrawButton onClick={next}>↻ try another word</RedrawButton>
      </figcaption>
    </figure>
  );
}
