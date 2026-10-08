"use client";

import { useEffect, useRef, useState } from "react";

// A hand-drawn ink underline: two loose marker strokes under a heading, drawn left to right the
// first time it scrolls into view (.ink-underline in globals.css). Each heading gets its own
// wobble, seeded from its text, so no two look the same but they never change between visits.
function seedOf(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function strokes(seed: number) {
  let s = seed || 1;
  const r = (min: number, max: number) => {
    s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909);
    return min + ((s >>> 0) / 4294967296) * (max - min);
  };
  const y = () => r(3.5, 6.5);
  // Out along the word, then a quicker return stroke a little lower, like a marker.
  return (
    `M${r(0, 2).toFixed(1)} ${y().toFixed(1)} C30 ${y().toFixed(1)} 68 ${y().toFixed(1)} ${r(97, 100).toFixed(1)} ${y().toFixed(1)} ` +
    `M${r(92, 96).toFixed(1)} ${(y() + 2).toFixed(1)} C66 ${(y() + 2).toFixed(1)} 34 ${(y() + 2.5).toFixed(1)} ${r(5, 12).toFixed(1)} ${(y() + 2.5).toFixed(1)}`
  );
}

export function Ink({ children, weight = 2 }: { children: string; weight?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setDrawn(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className="relative inline-block">
      {children}
      <svg
        aria-hidden
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        className={`ink-underline pointer-events-none absolute -bottom-[0.22em] -left-[3%] h-[0.34em] w-[106%] overflow-visible ${drawn ? "is-drawn" : ""}`}
      >
        <path d={strokes(seedOf(children))} fill="none" stroke="currentColor" strokeWidth={weight} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}
