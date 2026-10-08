"use client";

import { useEffect, useRef } from "react";

// Faint topographic contour lines, like a trail map, behind the hero. Clicking or tapping
// anywhere in the hero (outside links and buttons) sends a ripple through the lines.
// The lines are static otherwise, so nothing moves on hover and the canvas only redraws
// while a ripple is running. Reduced-motion readers get the still map with no ripples.
const CELL = 7; // marching-squares grid size in CSS px
const LEVELS = 14; // number of contour lines across the height range
const RIPPLE_SPEED = 520; // px per second
const RIPPLE_LIFE = 1.6; // seconds
const RIPPLE_WIDTH = 46; // px, thickness of the moving ring
const RIPPLE_AMP = 12; // px, how far lines bend at the ring

// Deterministic value noise, so the map is the same on every visit.
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function terrain(x: number, y: number) {
  return noise(x, y) * 0.6 + noise(x * 2.1 + 5.2, y * 2.1 + 1.3) * 0.28 + noise(x * 4.3 + 9.1, y * 4.3 + 7.7) * 0.12;
}

// Line segments (x1, y1, x2, y2) for every contour level, via marching squares.
function contourSegments(w: number, h: number): Float32Array {
  const cols = Math.ceil(w / CELL) + 1;
  const rows = Math.ceil(h / CELL) + 1;
  const scale = 1 / 260; // px per noise unit: bigger hills on wider screens stay the same size
  const field = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) field[j * cols + i] = terrain(i * CELL * scale, j * CELL * scale);

  const out: number[] = [];
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  for (let l = 1; l <= LEVELS; l++) {
    const iso = 0.12 + (l / (LEVELS + 1)) * 0.76;
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const tl = field[j * cols + i];
        const tr = field[j * cols + i + 1];
        const br = field[(j + 1) * cols + i + 1];
        const bl = field[(j + 1) * cols + i];
        const idx = (tl > iso ? 8 : 0) | (tr > iso ? 4 : 0) | (br > iso ? 2 : 0) | (bl > iso ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const x = i * CELL;
        const y = j * CELL;
        // Crossing points on each edge of the cell.
        const top = [lerp(x, x + CELL, (iso - tl) / (tr - tl)), y];
        const right = [x + CELL, lerp(y, y + CELL, (iso - tr) / (br - tr))];
        const bottom = [lerp(x, x + CELL, (iso - bl) / (br - bl)), y + CELL];
        const left = [x, lerp(y, y + CELL, (iso - tl) / (bl - tl))];
        const seg = (a: number[], b: number[]) => out.push(a[0], a[1], b[0], b[1]);
        switch (idx) {
          case 1: case 14: seg(left, bottom); break;
          case 2: case 13: seg(bottom, right); break;
          case 3: case 12: seg(left, right); break;
          case 4: case 11: seg(top, right); break;
          case 6: case 9: seg(top, bottom); break;
          case 7: case 8: seg(left, top); break;
          case 5: seg(left, top); seg(bottom, right); break;
          case 10: seg(top, right); seg(left, bottom); break;
        }
      }
    }
  }
  return new Float32Array(out);
}

type Ripple = { x: number; y: number; t0: number };

export function Contours({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const host = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    const still = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    let segs: Float32Array = new Float32Array(0);
    let ripples: Ripple[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    const fg = () => getComputedStyle(document.documentElement).getPropertyValue("--fg").trim().replace(/ /g, ",");

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      segs = contourSegments(w, h);
      draw(performance.now());
    }

    // How far a point is pushed outward by the live ripples, as [dx, dy, strength 0..1].
    function displace(x: number, y: number, now: number): [number, number, number] {
      let dx = 0;
      let dy = 0;
      let s = 0;
      for (const r of ripples) {
        const t = (now - r.t0) / 1000;
        const ex = x - r.x;
        const ey = y - r.y;
        const d = Math.hypot(ex, ey) || 1;
        const k = Math.exp(-(((d - t * RIPPLE_SPEED) / RIPPLE_WIDTH) ** 2)) * (1 - t / RIPPLE_LIFE) ** 2;
        if (k < 0.01) continue;
        const push = Math.sin((d - t * RIPPLE_SPEED) / 9) * RIPPLE_AMP * k;
        dx += (ex / d) * push;
        dy += (ey / d) * push;
        s = Math.max(s, k);
      }
      return [dx, dy, s];
    }

    function draw(now: number) {
      ctx.clearRect(0, 0, w, h);
      const c = fg();
      ctx.lineWidth = 1;
      const base = new Path2D();
      const lit = new Path2D();
      for (let i = 0; i < segs.length; i += 4) {
        let x1 = segs[i], y1 = segs[i + 1], x2 = segs[i + 2], y2 = segs[i + 3];
        if (ripples.length) {
          const a = displace(x1, y1, now);
          const b = displace(x2, y2, now);
          x1 += a[0]; y1 += a[1]; x2 += b[0]; y2 += b[1];
          const p = Math.max(a[2], b[2]) > 0.25 ? lit : base;
          p.moveTo(x1, y1);
          p.lineTo(x2, y2);
        } else {
          base.moveTo(x1, y1);
          base.lineTo(x2, y2);
        }
      }
      ctx.strokeStyle = `rgba(${c},0.09)`;
      ctx.stroke(base);
      ctx.strokeStyle = `rgba(${c},0.45)`;
      ctx.stroke(lit);
    }

    function tick(now: number) {
      ripples = ripples.filter((r) => now - r.t0 < RIPPLE_LIFE * 1000);
      draw(now);
      raf = ripples.length ? requestAnimationFrame(tick) : 0;
    }

    function onPointerDown(e: PointerEvent) {
      if ((e.target as Element).closest("a, button, input, textarea, select, label")) return;
      const box = canvas.getBoundingClientRect();
      ripples.push({ x: e.clientX - box.left, y: e.clientY - box.top, t0: performance.now() });
      if (ripples.length > 4) ripples.shift();
      if (!raf) raf = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    // Redraw in the new color when the theme changes.
    const mo = new MutationObserver(() => draw(performance.now()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => draw(performance.now());
    mq.addEventListener("change", onScheme);
    if (!still) host.addEventListener("pointerdown", onPointerDown);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", onScheme);
      host.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
