"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { route, type Stop } from "@/lib/site";
import { useScrollReveal } from "./useScrollReveal";

// Equirectangular projection over a window that fits all three stops with breathing room.
const BOUNDS = { west: -95, east: 45, north: 52, south: -42 };
const SCALE = 10;
const W = (BOUNDS.east - BOUNDS.west) * SCALE;
const H = (BOUNDS.north - BOUNDS.south) * SCALE;

const project = (s: Pick<Stop, "lat" | "lon">) => ({
  x: (s.lon - BOUNDS.west) * SCALE,
  y: (BOUNDS.north - s.lat) * SCALE,
});

// Quadratic curve between two points, bowed to one side by `bend` × segment length.
function arc(a: { x: number; y: number }, b: { x: number; y: number }, bend: number) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return `M ${a.x} ${a.y} Q ${mx - dy * bend} ${my + dx * bend} ${b.x} ${b.y}`;
}

function haversineKm(a: Stop, b: Stop) {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const fmtCoord = (v: number, pos: string, neg: string) =>
  `${Math.abs(v).toFixed(2)}°${v >= 0 ? pos : neg}`;

const points = route.map(project);
const segments = points.slice(1).map((p, i) => arc(points[i], p, i === 0 ? -0.18 : -0.2));
const totalKm = route.slice(1).reduce((sum, s, i) => sum + haversineKm(route[i], s), 0);

// Timing: each leg draws in sequence; each stop lands when its leg arrives.
const LEG = [0.9, 1.5];
const legStart = (i: number) => 0.3 + LEG.slice(0, i).reduce((a, b) => a + b, 0);
const stopAt = (i: number) => (i === 0 ? 0.15 : legStart(i - 1) + LEG[i - 1]);

const every15 = (from: number, to: number) =>
  Array.from({ length: 25 }, (_, i) => -180 + i * 15).filter((v) => v > from && v < to);
const lons = every15(BOUNDS.west, BOUNDS.east);
const lats = every15(BOUNDS.south, BOUNDS.north);

const LABEL_POSITION = {
  left: { transform: "translate(calc(-100% - 20px), -50%)", align: "text-right" },
  above: { transform: "translate(-10px, calc(-100% - 22px))", align: "text-left" },
  below: { transform: "translate(calc(-100% + 10px), 22px)", align: "text-right" },
} as const;

export function RouteMap() {
  const maskId = useId().replace(/:/g, "");
  // Drawn and labeled by default; only replays the flight when it starts off-screen.
  const { ref, hidden } = useScrollReveal();
  const instant = { duration: 0 };

  return (
    <figure className="w-full">
      <div ref={ref} className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          role="img"
          aria-label={`Route: ${route.map((s) => s.city).join(", then ")}`}
        >
          {/* Graticule */}
          <g className="stroke-line" strokeWidth={1} vectorEffect="non-scaling-stroke">
            {lons.map((lon) => {
              const x = (lon - BOUNDS.west) * SCALE;
              return <line key={`lon${lon}`} x1={x} x2={x} y1={0} y2={H} vectorEffect="non-scaling-stroke" />;
            })}
            {lats.map((lat) => {
              const y = (BOUNDS.north - lat) * SCALE;
              return (
                <line
                  key={`lat${lat}`}
                  x1={0}
                  x2={W}
                  y1={y}
                  y2={y}
                  className={lat === 0 ? "stroke-muted/40" : undefined}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>

          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
              {segments.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={40}
                  strokeLinecap="round"
                  initial={false}
                  animate={{ pathLength: hidden ? 0 : 1 }}
                  transition={
                    hidden ? instant : { duration: LEG[i], delay: legStart(i), ease: [0.65, 0, 0.35, 1] }
                  }
                />
              ))}
            </mask>
          </defs>

          {/* Dotted, marching route — revealed by the mask as it "flies" */}
          <g mask={`url(#${maskId})`}>
            {segments.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                className="march stroke-fg"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="0 8"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          {/* Stops */}
          {points.map((p, i) => (
            <motion.g
              key={route[i].code}
              initial={false}
              animate={hidden ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
              transition={hidden ? instant : { delay: stopAt(i), type: "spring", stiffness: 300, damping: 18 }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              <circle cx={p.x} cy={p.y} r={18} fill="none" className="stroke-muted/60" vectorEffect="non-scaling-stroke" />
              <circle cx={p.x} cy={p.y} r={8} className="fill-fg" />
            </motion.g>
          ))}
        </svg>

        {/* Labels are HTML so they stay legible at any width */}
        {points.map((p, i) => {
          const s = route[i];
          const pos = LABEL_POSITION[s.labelSide];
          return (
            <motion.div
              key={s.code}
              className={`pointer-events-none absolute w-max max-w-[46vw] ${pos.align}`}
              style={{
                left: `${(p.x / W) * 100}%`,
                top: `${(p.y / H) * 100}%`,
                transform: pos.transform,
              }}
              initial={false}
              animate={{ opacity: hidden ? 0 : 1 }}
              transition={hidden ? instant : { delay: stopAt(i) + 0.15, duration: 0.5 }}
            >
              <div
                className={`flex items-center gap-1.5 font-display text-sm font-bold leading-tight sm:text-xl ${
                  s.labelSide === "above" ? "" : "flex-row-reverse"
                }`}
              >
                <s.icon className="h-4 w-4 shrink-0 text-muted sm:h-5 sm:w-5" stroke={1.6} aria-hidden />
                {s.city}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-label text-muted sm:text-[10px]">
                {s.place}
              </div>
            </motion.div>
          );
        })}
      </div>

      <figcaption className="label mt-10 flex flex-wrap gap-x-3 gap-y-1 sm:mt-8">
        {route.map((s, i) => (
          <span key={s.code} className="whitespace-nowrap">
            {fmtCoord(s.lat, "N", "S")} {fmtCoord(s.lon, "E", "W")}
            {i < route.length - 1 && <span className="pl-3 normal-case">to</span>}
          </span>
        ))}
        <span className="whitespace-nowrap text-fg">
          about {(Math.round(totalKm / 100) * 100).toLocaleString("en-US")} km
        </span>
      </figcaption>
    </figure>
  );
}
