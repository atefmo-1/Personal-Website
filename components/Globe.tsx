"use client";

import { useEffect, useRef } from "react";
import { route } from "@/lib/site";

// A slowly spinning dotted globe with the route pinned on it (Sharqia → Johannesburg → Chapel Hill).
// Drawn on a canvas in the theme's text color at low opacity, so it works in light and dark mode.
// Reduced-motion readers get one still frame. Pauses when off-screen or the tab is hidden.
const TILT = (-18 * Math.PI) / 180; // tip the north pole toward the viewer a little
const SPEED = 0.07; // radians per second
const rad = (d: number) => (d * Math.PI) / 180;

type Vec = [number, number, number];
const toVec = (lat: number, lon: number): Vec => [Math.cos(rad(lat)) * Math.cos(rad(lon)), Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat))];

// Great-circle points between two cities, for the route arcs.
function arc(a: Vec, b: Vec, steps = 48): Vec[] {
  const dot = Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
  const w = Math.acos(dot);
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const s1 = Math.sin((1 - t) * w) / Math.sin(w);
    const s2 = Math.sin(t * w) / Math.sin(w);
    return [a[0] * s1 + b[0] * s2, a[1] * s1 + b[1] * s2, a[2] * s1 + b[2] * s2];
  });
}

// Dots along parallels and meridians.
const DOTS: Vec[] = [];
for (let lat = -75; lat <= 75; lat += 15) for (let lon = 0; lon < 360; lon += 4) DOTS.push(toVec(lat, lon));
for (let lon = 0; lon < 360; lon += 30) for (let lat = -84; lat <= 84; lat += 4) DOTS.push(toVec(lat, lon));

const PINS = route.map((s) => toVec(s.lat, s.lon));
const ARCS = PINS.slice(1).map((p, i) => arc(PINS[i], p));

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const still = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    let raf = 0;
    let visible = true;
    let angle = rad(24); // start centered on the Atlantic (~24°W), so all three pins face us
    let last = performance.now();

    const fg = () => getComputedStyle(document.documentElement).getPropertyValue("--fg").trim().replace(/ /g, ",");

    function project([x, y, z]: Vec): [number, number, number] {
      // spin around the polar axis, then tilt toward the viewer
      const cx = x * Math.cos(angle) - y * Math.sin(angle);
      const cy = x * Math.sin(angle) + y * Math.cos(angle);
      const ty = cy;
      const tz = z * Math.cos(TILT) - cx * Math.sin(TILT);
      const depth = z * Math.sin(TILT) + cx * Math.cos(TILT); // > 0 means facing us
      return [ty, -tz, depth];
    }

    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = canvas.clientWidth;
      if (canvas.width !== size * dpr) {
        canvas.width = canvas.height = size * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const r = size / 2 - 4;
      const c = fg();
      const at = (v: Vec) => {
        const [x, y, d] = project(v);
        return [size / 2 + x * r, size / 2 + y * r, d] as const;
      };

      for (const v of DOTS) {
        const [x, y, d] = at(v);
        if (d <= 0) continue;
        ctx.fillStyle = `rgba(${c},${0.06 + d * 0.22})`;
        ctx.fillRect(x - 0.9, y - 0.9, 1.8, 1.8);
      }

      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 5]);
      for (const pts of ARCS) {
        ctx.beginPath();
        let pen = false;
        for (const v of pts) {
          const [x, y, d] = at(v);
          if (d <= 0) { pen = false; continue; }
          if (pen) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
          pen = true;
        }
        ctx.strokeStyle = `rgba(${c},0.55)`;
        ctx.stroke();
      }
      ctx.setLineDash([]);

      for (const v of PINS) {
        const [x, y, d] = at(v);
        if (d <= 0) continue;
        ctx.fillStyle = `rgba(${c},${0.35 + d * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(${c},0.3)`;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function tick(now: number) {
      angle += ((now - last) / 1000) * SPEED;
      last = now;
      if (visible && !document.hidden) draw();
      raf = requestAnimationFrame(tick);
    }

    draw();
    if (still) {
      // Theme changes still need a redraw even without animation.
      const obs = new MutationObserver(draw);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => obs.disconnect();
    }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
