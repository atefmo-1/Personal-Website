"use client";

import { useEffect, useState } from "react";
import { CHAPEL_HILL, moonPhase, sunElevation } from "@/lib/sky";

// The sky over Chapel Hill right now: today's sun path, where the sun is on it, and the moon at
// night. Computed in the browser and updated every minute.
const W = 300;
const H = 86;
const HORIZON = 64;

type Now = {
  time: string;
  elevation: number;
  curve: string;
  below: string;
  dot: [number, number];
  moon: { age: number; lit: number };
};

function read(): Now {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit", hour12: false }).formatToParts(now);
  const hh = Number(parts.find((p) => p.type === "hour")!.value) % 24;
  const mm = Number(parts.find((p) => p.type === "minute")!.value);
  const midnight = now.getTime() - (hh * 60 + mm) * 60000;
  const x = (min: number) => (min / 1440) * W;
  const y = (el: number) => HORIZON - (el / 75) * (HORIZON - 8);
  // Today's path: solid where the sun is up, a faint dashed line for the whole day
  const day: string[][] = [[]];
  const all: string[] = [];
  for (let m = 0; m <= 1440; m += 10) {
    const el = sunElevation(new Date(midnight + m * 60000), ...CHAPEL_HILL);
    const pt = `${x(m).toFixed(1)} ${y(Math.max(el, -14)).toFixed(1)}`;
    all.push(pt);
    if (el >= 0) day[day.length - 1].push(pt);
    else if (day[day.length - 1].length) day.push([]);
  }
  const curve = day.filter((seg) => seg.length > 1).map((seg) => "M" + seg.join(" L")).join(" ");
  const below = "M" + all.join(" L");
  const elevation = sunElevation(now, ...CHAPEL_HILL);
  return {
    time: now.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" }),
    elevation,
    curve,
    below,
    dot: [x(hh * 60 + mm), y(Math.max(elevation, -14))],
    moon: moonPhase(now),
  };
}

// A moon drawn by its phase: the outer edge is a half circle, the terminator a half ellipse.
function Moon({ cx, cy, r, age }: { cx: number; cy: number; r: number; age: number }) {
  const waxing = age < 0.5;
  const k = Math.cos(age * 2 * Math.PI); // 1 at new, -1 at full
  const rx = Math.abs(k) * r;
  const outer = waxing ? 1 : 0;
  const inner = k > 0 ? (waxing ? 0 : 1) : waxing ? 1 : 0;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.5} />
      <path d={`M${cx} ${cy - r} A${r} ${r} 0 0 ${outer} ${cx} ${cy + r} A${rx} ${r} 0 0 ${inner} ${cx} ${cy - r}Z`} fill="currentColor" />
    </g>
  );
}

export function SkyNow({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Now | null>(null);

  useEffect(() => {
    setNow(read());
    const id = setInterval(() => setNow(read()), 60000);
    return () => clearInterval(id);
  }, []);

  const day = now ? now.elevation > -0.833 : true;

  return (
    <figure className={`min-h-[116px] print:hidden ${className}`}>
      {now && (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full text-fg" role="img" aria-label={`The sun's path over Chapel Hill today. It's ${now.time} there, and the sun is ${Math.abs(Math.round(now.elevation))}° ${day ? "above" : "below"} the horizon.`}>
            <line x1={0} y1={HORIZON} x2={W} y2={HORIZON} stroke="currentColor" strokeOpacity={0.5} />
            <path d={now.below} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeDasharray="2 4" />
            <path d={now.curve} fill="none" stroke="currentColor" strokeWidth={1.4} />
            {day ? (
              <g>
                <circle cx={now.dot[0]} cy={now.dot[1]} r={7} fill="rgb(var(--bg))" stroke="currentColor" />
                <circle cx={now.dot[0]} cy={now.dot[1]} r={3.5} fill="currentColor" />
              </g>
            ) : (
              <>
                <circle cx={now.dot[0]} cy={now.dot[1]} r={3} fill="currentColor" opacity={0.5} />
                <Moon cx={W - 14} cy={16} r={9} age={now.moon.age} />
              </>
            )}
            <text x={0} y={H - 4} className="fill-current font-mono text-[9px]" opacity={0.6}>12 AM</text>
            <text x={W / 2} y={H - 4} textAnchor="middle" className="fill-current font-mono text-[9px]" opacity={0.6}>NOON</text>
            <text x={W} y={H - 4} textAnchor="end" className="fill-current font-mono text-[9px]" opacity={0.6}>12 AM</text>
          </svg>
          <figcaption className="label mt-2 leading-relaxed">
            Chapel Hill · {now.time} · {day ? `sun ${Math.round(now.elevation)}° up` : `night · moon ${Math.round(now.moon.lit * 100)}% lit`}
          </figcaption>
        </>
      )}
    </figure>
  );
}
