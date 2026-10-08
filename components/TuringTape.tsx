"use client";

import { useEffect, useRef, useState } from "react";
import { RedrawButton } from "./Art";

// A Turing machine that adds 1 to a binary number. State "right" walks to the end of the number;
// state "carry" walks back, turning 1s into 0s until it can write a 1, then halts. Each step is
// one move of the head. "Next number" loads another.
const NUMBERS = ["1011", "111", "1001", "10011"];
const STEP = 420;
const CELLS = 9;

type Snap = { tape: string[]; head: number; state: "right" | "carry" | "halt" };

function trace(num: string): Snap[] {
  const tape = Array(CELLS).fill("_");
  const start = Math.floor((CELLS - num.length) / 2);
  num.split("").forEach((c, i) => (tape[start + i] = c));
  let head = start;
  let state: Snap["state"] = "right";
  const out: Snap[] = [{ tape: [...tape], head, state }];
  while (state !== "halt" && out.length < 60) {
    const sym = tape[head];
    if (state === "right") {
      if (sym === "_") state = "carry", head--;
      else head++;
    } else if (sym === "1") {
      tape[head] = "0";
      head--;
    } else {
      tape[head] = "1";
      state = "halt";
    }
    out.push({ tape: [...tape], head, state });
  }
  return out;
}

const W = 300;
const H = 170;
const CW = 30;
const LEFT = (W - CELLS * CW) / 2;

export function TuringTape({ caption, className = "" }: { caption: string; className?: string }) {
  const [ni, setNi] = useState(0);
  const [step, setStep] = useState(0);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const steps = trace(NUMBERS[ni]);
  const snap = steps[Math.min(step, steps.length - 1)];
  const result = steps[steps.length - 1].tape.join("").replace(/_/g, "");

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
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return setStep(steps.length - 1);
    if (step >= steps.length - 1) return;
    const t = setTimeout(() => setStep(step + 1), STEP);
    return () => clearTimeout(t);
  }, [seen, step, steps.length]);

  return (
    <figure ref={ref} className={`print:hidden ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block aspect-[4/3] w-full text-fg" role="img" aria-label={`A Turing machine adding 1 to ${NUMBERS[ni]} in binary, giving ${result}.`}>
        <text x={W / 2} y={30} textAnchor="middle" className="fill-current font-mono text-[11px] uppercase tracking-[0.14em]">
          state: {snap.state}
        </text>
        {/* The head */}
        <path
          d={`M${LEFT + snap.head * CW + CW / 2 - 7} 52 L${LEFT + snap.head * CW + CW / 2 + 7} 52 L${LEFT + snap.head * CW + CW / 2} 62 Z`}
          fill="currentColor"
          className="transition-transform"
        />
        {snap.tape.map((c, i) => (
          <g key={i}>
            <rect x={LEFT + i * CW} y={68} width={CW} height={CW} fill="none" stroke="currentColor" strokeOpacity={i === snap.head ? 1 : 0.4} strokeWidth={i === snap.head ? 1.6 : 1} />
            <text x={LEFT + i * CW + CW / 2} y={88} textAnchor="middle" className="fill-current font-mono text-[13px]" opacity={c === "_" ? 0.25 : 1}>
              {c === "_" ? "·" : c}
            </text>
          </g>
        ))}
        <text x={W / 2} y={128} textAnchor="middle" className="fill-current font-mono text-[11px]" opacity={snap.state === "halt" ? 1 : 0.35}>
          {NUMBERS[ni]} + 1 = {snap.state === "halt" ? result : "…"}
        </text>
        <text x={W / 2} y={148} textAnchor="middle" className="fill-current font-mono text-[9px] uppercase tracking-[0.14em]" opacity={0.6}>
          step {Math.min(step, steps.length - 1)} of {steps.length - 1}
        </text>
      </svg>
      <figcaption className="label mt-3 flex items-baseline justify-between gap-4">
        <span>{caption}</span>
        <RedrawButton
          onClick={() => {
            setNi((ni + 1) % NUMBERS.length);
            setStep(0);
          }}
        >
          ↻ next number
        </RedrawButton>
      </figcaption>
    </figure>
  );
}
