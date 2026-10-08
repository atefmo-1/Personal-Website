"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "./useScrollReveal";

// Animates every number in a string when it scrolls into view:
// percentages count DOWN from 100 (so "<1%" reads as selective), other numbers count UP from 0.
// Same rules as the scroll reveals: the final text is what renders first, and nothing animates
// unless the reader allows motion and the text started below the fold.
const NUMBER = /(\d[\d,]*(?:\.\d+)?)(%?)/g;

type Part = string | { to: number; from: number; decimals: number; commas: boolean; suffix: string };

function parse(text: string): Part[] {
  const parts: Part[] = [];
  let last = 0;
  for (const m of text.matchAll(NUMBER)) {
    const raw = m[1];
    if (m.index! > last) parts.push(text.slice(last, m.index));
    const to = parseFloat(raw.replace(/,/g, ""));
    const percent = m[2] === "%";
    parts.push({
      to,
      from: percent ? 100 : 0,
      decimals: raw.includes(".") ? raw.split(".")[1].length : 0,
      commas: raw.includes(","),
      suffix: m[2],
    });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function format(n: number, decimals: number, commas: boolean) {
  return commas
    ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : n.toFixed(decimals);
}

export function CountText({ text, className }: { text: string; className?: string }) {
  const { ref, hidden, motionOK } = useScrollReveal<HTMLSpanElement>();
  const [t, setT] = useState(1); // 0 = start values, 1 = final text
  const wasHidden = useRef(false);

  useEffect(() => {
    if (hidden) {
      wasHidden.current = true;
      setT(0);
      return;
    }
    if (!wasHidden.current || !motionOK) return;
    const controls = animate(0, 1, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: setT });
    return () => controls.stop();
  }, [hidden, motionOK]);

  const parts = parse(text);
  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the final text once, not every animation frame */}
      <span className="sr-only">{text}</span>
      {/* Printing shows the final text, even if the numbers haven't counted up yet */}
      <span aria-hidden className="hidden print:inline">
        {text}
      </span>
      <span aria-hidden className="print:hidden">
        {parts.map((p, i) =>
          typeof p === "string" ? (
            p
          ) : (
            // Fixed-width digits only on the numbers, so they don't jitter while counting
            <span key={i} className="tabular-nums">
              {format(p.from + (p.to - p.from) * t, p.decimals, p.commas)}
              {p.suffix}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
