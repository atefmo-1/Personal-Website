"use client";

import { useEffect, useRef, useState } from "react";
import { fbm, noise, rng } from "@/lib/noise";

// Generative ink figures, drawn on a canvas in the theme's text color. Each one draws itself
// the first time it scrolls into view, and clicking it draws a new variation (a new seed).
// Reduced-motion readers get the finished figure straight away. Nothing reacts to hover.
export type ArtKind = "order" | "ridges" | "flow" | "converge" | "rings" | "lorenz" | "phyllotaxis" | "lissajous" | "spirograph" | "julia" | "shots" | "planes" | "lost";

type Line = {
  pts: number[]; // x0, y0, x1, y1, ...
  width: number;
  alpha: number;
  start: number; // when this line starts and finishes drawing, as a share of the animation
  end: number;
  fill?: boolean; // fill below the line with the page color (ridgelines hide what's behind)
  dot?: boolean; // finish the line with a small dot
  segs?: boolean; // pts are separate segments (x1, y1, x2, y2), not one polyline
  plane?: boolean; // a paper plane rides the tip of the line while it draws
  text?: { x: number; y: number; s: string; align?: CanvasTextAlign }; // a small label, shown once the line is drawn
};

const DURATION = 2400; // ms

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Many tangled lines on the left that settle into calm, parallel lines on the right.
function order(w: number, h: number, seed: number): Line[] {
  const n = Math.max(18, Math.round(h / 8));
  const lines: Line[] = [];
  const top = h * 0.14;
  const gap = (h * 0.72) / (n - 1);
  for (let i = 0; i < n; i++) {
    const base = top + i * gap;
    const pts: number[] = [];
    for (let x = 0; x <= w * 0.94; x += 2) {
      const t = x / w;
      const mess = 1 - smooth(0.12, 0.72, t);
      const wobble = (fbm(x / 90 + seed, i * 0.31 + seed * 2.3) - 0.5) * h * 1.25 + Math.sin(x / 23 + i) * 6;
      // Soft limit (tanh) so tangled lines never flatten against the edges
      const y = base + mess * wobble;
      pts.push(x, h / 2 + Math.tanh((y - h / 2) / (h * 0.46)) * h * 0.44);
    }
    const start = (i / n) * 0.35;
    lines.push({ pts, width: 1, alpha: 0.75, start, end: start + 0.65, dot: true });
  }
  return lines;
}

// Stacked ridgelines, like a mountain range seen in profile, back to front.
function ridges(w: number, h: number, seed: number): Line[] {
  const r = rng(seed * 7919 + 1);
  const peaks = Array.from({ length: 3 }, () => ({ at: 0.25 + r() * 0.5, width: 0.07 + r() * 0.1, height: 0.5 + r() * 0.5 }));
  const n = Math.max(14, Math.round(h / 11));
  const lines: Line[] = [];
  for (let i = 0; i < n; i++) {
    const y0 = h * 0.3 + (i / (n - 1)) * h * 0.66;
    const pts: number[] = [];
    for (let x = 0; x <= w; x += 3) {
      const t = x / w;
      let lift = 0;
      for (const p of peaks) lift += p.height * Math.exp(-(((t - p.at) / p.width) ** 2));
      const rough = fbm(x / 40 + seed * 3.1, i * 0.45 + seed);
      const depth = 0.55 + 0.45 * Math.sin((i / (n - 1)) * Math.PI); // middle rows rise most
      pts.push(x, y0 - lift * rough * depth * h * 0.42 - rough * 6);
    }
    const start = (i / n) * 0.55;
    lines.push({ pts, width: 1.1, alpha: 0.85, start, end: start + 0.45, fill: true });
  }
  // Squash the peaks if the tallest would poke out of a short box (like the footer's)
  let squash = 1;
  lines.forEach((l, i) => {
    const y0 = h * 0.3 + (i / (n - 1)) * h * 0.66;
    for (let k = 1; k < l.pts.length; k += 2) if (l.pts[k] < 4) squash = Math.min(squash, (y0 - 4) / (y0 - l.pts[k]));
  });
  if (squash < 1)
    lines.forEach((l, i) => {
      const y0 = h * 0.3 + (i / (n - 1)) * h * 0.66;
      for (let k = 1; k < l.pts.length; k += 2) l.pts[k] = y0 - (y0 - l.pts[k]) * squash;
    });
  return lines;
}

// Streamlines through a noise field, like ink spreading in water.
function flow(w: number, h: number, seed: number): Line[] {
  const r = rng(seed * 104729 + 3);
  const count = Math.min(900, Math.round((w * h) / 380));
  const scale = 1 / 170;
  const lines: Line[] = [];
  for (let k = 0; k < count; k++) {
    let x = r() * w;
    let y = r() * h;
    const pts = [x, y];
    for (let s = 0; s < 120; s++) {
      const a = fbm(x * scale + seed, y * scale - seed) * Math.PI * 4;
      x += Math.cos(a) * 1.8;
      y += Math.sin(a) * 1.8;
      if (x < 0 || x > w || y < 0 || y > h) break;
      pts.push(x, y);
    }
    if (pts.length < 12) continue;
    const start = r() * 0.4;
    lines.push({ pts, width: 0.7, alpha: 0.42, start, end: start + 0.6 });
  }
  return lines;
}

// Lines that wander in from the left and all find their way to one point.
function converge(w: number, h: number, seed: number): Line[] {
  const r = rng(seed * 15485863 + 7);
  const tx = w * 0.8;
  const ty = h * 0.5;
  const maxD = Math.hypot(w, h);
  const lines: Line[] = [];
  const count = Math.min(170, Math.round(h / 1.6));
  for (let k = 0; k < count; k++) {
    let x = 4 + r() * w * 0.3;
    let y = h * 0.06 + r() * h * 0.88;
    const pts = [x, y];
    for (let s = 0; s < 600; s++) {
      const dx = tx - x;
      const dy = ty - y;
      const d = Math.hypot(dx, dy);
      if (d < 5) break;
      const a = fbm(x / 120 + seed, y / 120 - seed) * Math.PI * 4;
      const pull = Math.min(1, 0.3 + 0.7 * (1 - d / maxD) ** 2 + (d < 70 ? 0.5 : 0));
      const vx = Math.cos(a) * (1 - pull) + (dx / d) * pull;
      const vy = Math.sin(a) * (1 - pull) + (dy / d) * pull;
      const m = Math.hypot(vx, vy) || 1;
      x += (vx / m) * 2.2;
      y += (vy / m) * 2.2;
      if (x < 2 || x > w - 2 || y < 2 || y > h - 2) break;
      pts.push(x, y);
    }
    if (pts.length < 20) continue;
    const start = r() * 0.3;
    lines.push({ pts, width: 0.8, alpha: 0.45, start, end: start + 0.7 });
  }
  // The point everything arrives at
  const ring: number[] = [];
  for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.1) ring.push(tx + Math.cos(a) * 9, ty + Math.sin(a) * 9);
  lines.push({ pts: ring, width: 1.6, alpha: 1, start: 0.85, end: 1 });
  return lines;
}

// Wobbly concentric rings, like a tree's growth rings, with a few marked darker.
function rings(w: number, h: number, seed: number): Line[] {
  const cx = w / 2;
  const cy = h / 2;
  const n = 30;
  const rmax = Math.min(w, h) * 0.47;
  const gap = rmax / (n + 2);
  const marked = new Set([9, 18, 26]);
  const lines: Line[] = [];
  for (let k = 0; k < n; k++) {
    const pts: number[] = [];
    const base = gap * (k + 2);
    for (let i = 0; i <= 240; i++) {
      const a = (i / 240) * Math.PI * 2;
      const wob = (noise(Math.cos(a) * 1.4 + 9 + seed, Math.sin(a) * 1.4 + k * 0.06 + seed) - 0.5) * gap * (2 + k * 0.18);
      pts.push(cx + Math.cos(a) * (base + wob) * (w > h ? 1.25 : 1), cy + Math.sin(a) * (base + wob));
    }
    const start = (k / n) * 0.6;
    lines.push({ pts, width: marked.has(k) ? 2 : 0.9, alpha: marked.has(k) ? 1 : 0.6, start, end: start + 0.4 });
  }
  return lines;
}

// Fit points into the canvas with a margin, keeping their proportions.
function fit(all: number[][], w: number, h: number, margin = 0.08) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const pts of all)
    for (let i = 0; i < pts.length; i += 2) {
      x0 = Math.min(x0, pts[i]); x1 = Math.max(x1, pts[i]);
      y0 = Math.min(y0, pts[i + 1]); y1 = Math.max(y1, pts[i + 1]);
    }
  const s = Math.min((w * (1 - 2 * margin)) / (x1 - x0 || 1), (h * (1 - 2 * margin)) / (y1 - y0 || 1));
  const ox = (w - (x1 - x0) * s) / 2 - x0 * s;
  const oy = (h - (y1 - y0) * s) / 2 - y0 * s;
  for (const pts of all) for (let i = 0; i < pts.length; i += 2) { pts[i] = ox + pts[i] * s; pts[i + 1] = oy + pts[i + 1] * s; }
}

// The Lorenz system: three simple equations whose solution never repeats. Two runs start
// 0.001 apart and drift onto different paths (the butterfly effect).
function lorenz(w: number, h: number, seed: number): Line[] {
  const [sigma, rho, beta, dt] = [10, 28, 8 / 3, 0.005];
  const turn = (seed - 1) * 0.5; // each redraw views the attractor from a new angle
  const run = (x: number, y: number, z: number) => {
    const pts: number[] = [];
    const f = (x: number, y: number, z: number) => [sigma * (y - x), x * (rho - z) - y, x * y - beta * z];
    for (let i = 0; i < 9000; i++) {
      // Runge-Kutta 4
      const k1 = f(x, y, z);
      const k2 = f(x + (dt / 2) * k1[0], y + (dt / 2) * k1[1], z + (dt / 2) * k1[2]);
      const k3 = f(x + (dt / 2) * k2[0], y + (dt / 2) * k2[1], z + (dt / 2) * k2[2]);
      const k4 = f(x + dt * k3[0], y + dt * k3[1], z + dt * k3[2]);
      x += (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
      y += (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      z += (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
      if (i > 60) pts.push(x * Math.cos(turn) - y * Math.sin(turn), -z);
    }
    return pts;
  };
  const a = run(0.1, 0, 0);
  const b = run(0.101, 0, 0);
  fit([a, b], w, h, 0.06);
  return [
    { pts: b, width: 0.7, alpha: 0.35, start: 0.05, end: 1 },
    { pts: a, width: 0.8, alpha: 0.8, start: 0, end: 0.95 },
  ];
}

// Seeds placed 137.5 degrees apart (the golden angle), the way a sunflower packs them.
function phyllotaxis(w: number, h: number, seed: number): Line[] {
  const n = 640;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const spin = (seed - 1) * 0.7;
  const c = (Math.min(w, h) * 0.46) / Math.sqrt(n);
  const lines: Line[] = [];
  for (let i = 1; i <= n; i++) {
    const r = c * Math.sqrt(i);
    const a = i * golden + spin;
    const x = w / 2 + r * Math.cos(a);
    const y = h / 2 + r * Math.sin(a);
    const size = 0.6 + (i / n) * 2.6;
    const pts: number[] = [];
    for (let k = 0; k <= 12; k++) pts.push(x + Math.cos((k / 12) * Math.PI * 2) * size, y + Math.sin((k / 12) * Math.PI * 2) * size);
    const start = (i / n) * 0.85;
    lines.push({ pts, width: 0.9, alpha: 0.85, start, end: start + 0.15 });
  }
  return lines;
}

// Two sine waves at different speeds, one across and one up: a Lissajous figure. Nested copies
// with a slowly shifting phase give it depth.
function lissajous(w: number, h: number, seed: number): Line[] {
  const ratios = [[3, 2], [5, 4], [3, 4], [5, 6], [7, 6], [4, 5]];
  const [a, b] = ratios[(seed - 1) % ratios.length];
  const curves: number[][] = [];
  for (let k = 0; k < 7; k++) {
    const pts: number[] = [];
    const shift = Math.PI / 2 / a + k * 0.07;
    for (let i = 0; i <= 1400; i++) {
      const t = (i / 1400) * Math.PI * 2;
      pts.push(Math.sin(a * t + shift), Math.sin(b * t));
    }
    curves.push(pts);
  }
  fit(curves, w, h);
  return curves.map((pts, k) => ({ pts, width: k === 0 ? 1.3 : 0.7, alpha: k === 0 ? 0.95 : 0.5 - k * 0.05, start: k * 0.06, end: 0.6 + k * 0.06 }));
}

// A pen in a small wheel rolling inside a big one: a spirograph (hypotrochoid).
function spirograph(w: number, h: number, seed: number): Line[] {
  const sets = [[11, 7, 5], [9, 5, 4.2], [13, 8, 6], [8, 5, 5], [7, 4, 3.4]];
  const [R, r, d] = sets[(seed - 1) % sets.length];
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const turns = r / gcd(R, r);
  const pts: number[] = [];
  const steps = 3200;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns;
    pts.push((R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t), (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t));
  }
  fit([pts], w, h);
  return [{ pts, width: 0.8, alpha: 0.85, start: 0, end: 1 }];
}

// A Julia set (z -> z^2 + c), drawn as contour lines of how fast each point escapes.
function julia(w: number, h: number, seed: number): Line[] {
  const cs = [[-0.8, 0.156], [-0.4, 0.6], [0.285, 0.01], [-0.70176, -0.3842], [-0.835, -0.2321]];
  const [cr, ci] = cs[(seed - 1) % cs.length];
  const cell = 3;
  const cols = Math.ceil(w / cell) + 1;
  const rows = Math.ceil(h / cell) + 1;
  const span = 3.1 / Math.min(w, h);
  const field = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      let x = (i * cell - w / 2) * span;
      let y = (j * cell - h / 2) * span;
      let k = 0;
      for (; k < 120 && x * x + y * y < 16; k++) [x, y] = [x * x - y * y + cr, 2 * x * y + ci];
      // Smooth escape count, compressed so the levels spread out evenly
      const v = k >= 120 ? 120 : k + 1 - Math.log2(Math.log2(Math.max(1.0001, Math.sqrt(x * x + y * y))));
      field[j * cols + i] = Math.log(1 + v);
    }
  const levels = 11;
  const lines: Line[] = [];
  for (let l = 0; l < levels; l++) {
    const iso = 1.2 + (l / (levels - 1)) * 2.9;
    const pts = isoSegments(field, cols, rows, cell, iso);
    const start = (l / levels) * 0.7;
    lines.push({ pts, width: 0.8, alpha: 0.35 + (l / levels) * 0.55, start, end: start + 0.3, segs: true });
  }
  return lines;
}

// Marching squares: segments where a grid of values crosses `iso`.
function isoSegments(field: Float32Array, cols: number, rows: number, cell: number, iso: number) {
  const out: number[] = [];
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  for (let j = 0; j < rows - 1; j++)
    for (let i = 0; i < cols - 1; i++) {
      const tl = field[j * cols + i], tr = field[j * cols + i + 1];
      const br = field[(j + 1) * cols + i + 1], bl = field[(j + 1) * cols + i];
      const idx = (tl > iso ? 8 : 0) | (tr > iso ? 4 : 0) | (br > iso ? 2 : 0) | (bl > iso ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * cell, y = j * cell;
      const T = [lerp(x, x + cell, (iso - tl) / (tr - tl)), y];
      const R = [x + cell, lerp(y, y + cell, (iso - tr) / (br - tr))];
      const B = [lerp(x, x + cell, (iso - bl) / (br - bl)), y + cell];
      const L = [x, lerp(y, y + cell, (iso - tl) / (bl - tl))];
      const seg = (a: number[], b: number[]) => out.push(a[0], a[1], b[0], b[1]);
      switch (idx) {
        case 1: case 14: seg(L, B); break;
        case 2: case 13: seg(B, R); break;
        case 3: case 12: seg(L, R); break;
        case 4: case 11: seg(T, R); break;
        case 6: case 9: seg(T, B); break;
        case 7: case 8: seg(L, T); break;
        case 5: seg(L, T); seg(B, R); break;
        case 10: seg(T, R); seg(L, B); break;
      }
    }
  return out;
}

// A hoop and a handful of jump shots: each one is a parabola, y = y0 + vy*t + g*t^2/2.
function shots(w: number, h: number, seed: number): Line[] {
  const r = rng(seed * 40503 + 5);
  const floor = h * 0.94;
  const rim = { x: w * 0.83, y: h * 0.4 };
  const lines: Line[] = [];
  // Floor, pole, backboard, rim and net
  lines.push({ pts: [w * 0.02, floor, w * 0.98, floor], width: 1, alpha: 0.6, start: 0, end: 0.1 });
  lines.push({ pts: [w * 0.93, floor, w * 0.93, h * 0.22, w * 0.88, h * 0.22], width: 1.4, alpha: 0.9, start: 0.02, end: 0.12 });
  lines.push({ pts: [w * 0.88, h * 0.12, w * 0.88, h * 0.46], width: 2, alpha: 1, start: 0.06, end: 0.14 });
  lines.push({ pts: [w * 0.88, rim.y, w * 0.79, rim.y], width: 1.6, alpha: 1, start: 0.1, end: 0.16 });
  for (let i = 0; i < 4; i++) {
    const x = w * 0.79 + (i / 3) * w * 0.09;
    lines.push({ pts: [x, rim.y, w * 0.805 + (i / 3) * w * 0.06, rim.y + h * 0.12], width: 0.7, alpha: 0.55, start: 0.12, end: 0.18 });
  }
  const n = 7;
  for (let i = 0; i < n; i++) {
    const x0 = w * (0.05 + r() * 0.55);
    const y0 = floor - h * (0.2 + r() * 0.08);
    const miss = i === 2 || i === 5;
    const tx = rim.x + (miss ? (r() < 0.5 ? -1 : 1) * w * 0.035 : 0);
    const T = 1;
    const g = h * (2.2 + r() * 1.2); // higher arcs for some shots
    const vx = (tx - x0) / T;
    const vy = (rim.y - y0 - (g * T * T) / 2) / T;
    const pts: number[] = [];
    for (let t = 0; t <= T; t += 0.01) pts.push(x0 + vx * t, y0 + vy * t + (g * t * t) / 2);
    if (miss) {
      // Off the rim: a small bounce away
      const bx = tx;
      for (let t = 0.01; t <= 0.5; t += 0.01) pts.push(bx + (tx < rim.x ? -1 : 1) * w * 0.12 * t, rim.y - h * 0.5 * t + h * 1.6 * t * t);
    } else {
      for (let t = 0.01; t <= 0.12; t += 0.01) pts.push(tx, rim.y + h * t);
    }
    const start = 0.15 + (i / n) * 0.7;
    lines.push({ pts, width: miss ? 0.8 : 1.1, alpha: miss ? 0.5 : 0.85, start, end: start + 0.16, dot: true });
  }
  return lines;
}

// Paper planes on curved paths from all directions, landing in Chapel Hill.
function planes(w: number, h: number, seed: number): Line[] {
  const r = rng(seed * 7477 + 13);
  const home = { x: w * 0.6, y: h * 0.56 };
  const lines: Line[] = [];
  const n = 14;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r() * 0.4;
    const far = Math.max(w, h) * (0.55 + r() * 0.2);
    const x0 = home.x + Math.cos(a) * far;
    const y0 = home.y + Math.sin(a) * far * 0.6;
    // Curve each path to one side, like a great-circle route on a flat map
    const mx = (x0 + home.x) / 2 - Math.sin(a) * far * 0.35 * (r() < 0.5 ? 1 : -1);
    const my = (y0 + home.y) / 2 - Math.abs(Math.cos(a)) * far * 0.25;
    const pts: number[] = [];
    for (let t = 0; t <= 1; t += 0.01) {
      const u = 1 - t;
      const x = u * u * x0 + 2 * u * t * mx + t * t * home.x;
      const y = u * u * y0 + 2 * u * t * my + t * t * home.y;
      if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;
      pts.push(x, y);
    }
    if (pts.length < 6) continue;
    const start = r() * 0.55;
    lines.push({ pts, width: 0.9, alpha: 0.6, start, end: start + 0.4, plane: true });
  }
  const ring = (rad: number) => {
    const pts: number[] = [];
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.15) pts.push(home.x + Math.cos(a) * rad, home.y + Math.sin(a) * rad);
    return pts;
  };
  lines.push({ pts: ring(4), width: 2, alpha: 1, start: 0.9, end: 0.97 });
  lines.push({ pts: ring(11), width: 0.9, alpha: 0.6, start: 0.93, end: 1, text: { x: home.x + 18, y: home.y + 4, s: "CHAPEL HILL", align: "left" } });
  return lines;
}

// For the 404 page: a contour map and a dashed trail that wanders in and simply stops.
function lost(w: number, h: number, seed: number): Line[] {
  const cell = 5;
  const cols = Math.ceil(w / cell) + 1;
  const rows = Math.ceil(h / cell) + 1;
  const field = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) field[j * cols + i] = fbm((i * cell) / 210 + seed * 4, (j * cell) / 210 + seed);
  const lines: Line[] = [];
  const levels = 10;
  for (let l = 0; l < levels; l++) {
    const iso = 0.22 + (l / (levels - 1)) * 0.56;
    lines.push({ pts: isoSegments(field, cols, rows, cell, iso), width: 0.8, alpha: 0.3 + (l % 3 === 0 ? 0.15 : 0), start: 0, end: 0.45, segs: true });
  }
  // The trail: a wandering line, cut into dashes
  const r = rng(seed * 31 + 9);
  const end = { x: w * (0.56 + r() * 0.12), y: h * (0.32 + r() * 0.16) };
  let x = w * 0.04;
  let y = h * 0.86;
  const dashes: number[] = [];
  let travelled = 0;
  for (let s = 0; s < 900; s++) {
    const dx = end.x - x;
    const dy = end.y - y;
    const d = Math.hypot(dx, dy);
    if (d < 4) break;
    const a = Math.atan2(dy, dx) + (noise(x / 60 + seed, y / 60) - 0.5) * 2.2;
    const nx = x + Math.cos(a) * 2;
    const ny = y + Math.sin(a) * 2;
    if (Math.floor(travelled / 7) % 2 === 0) dashes.push(x, y, nx, ny);
    travelled += 2;
    x = nx;
    y = ny;
  }
  lines.push({ pts: dashes, width: 1.8, alpha: 1, start: 0.35, end: 0.9, segs: true });
  // Where the trail runs out
  const q = 7;
  lines.push({ pts: [end.x - q, end.y - q, end.x + q, end.y + q, end.x - q, end.y + q, end.x + q, end.y - q], width: 2, alpha: 1, start: 0.9, end: 1, segs: true, text: { x: end.x + 14, y: end.y + 4, s: "YOU ARE HERE (?)", align: "left" } });
  return lines;
}

const builders = { lost, shots, planes, order, ridges, flow, converge, rings, lorenz, phyllotaxis, lissajous, spirograph, julia };

// `redraws` lets something outside the canvas (the caption's redraw button) ask for a new version:
// each time the number goes up, the figure draws a new variation.
export function Art({ kind, seed = 1, label, className = "", redraws = 0 }: { kind: ArtKind; seed?: number; label: string; className?: string; redraws?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (redraws > 0) redrawRef.current();
  }, [redraws]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const still = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    let current = seed;
    let lines: Line[] = [];
    let w = 0;
    let h = 0;
    let t0 = 0;
    let raf = 0;
    let started = false;
    let progress = 0;

    const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

    function draw(p: number) {
      progress = p;
      ctx.clearRect(0, 0, w, h);
      const fg = css("--fg").replace(/ /g, ",");
      const bg = `rgb(${css("--bg").replace(/ /g, ",")})`;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const l of lines) {
        const f = clamp((p - l.start) / (l.end - l.start));
        if (f <= 0) continue;
        if (l.segs) {
          // Separate segments: reveal them in order (top to bottom of the grid)
          const segCount = Math.floor((l.pts.length / 4) * f);
          ctx.beginPath();
          for (let i = 0; i < segCount; i++) {
            ctx.moveTo(l.pts[i * 4], l.pts[i * 4 + 1]);
            ctx.lineTo(l.pts[i * 4 + 2], l.pts[i * 4 + 3]);
          }
          ctx.strokeStyle = `rgba(${fg},${l.alpha})`;
          ctx.lineWidth = l.width;
          ctx.stroke();
          if (l.text && f === 1) {
            ctx.font = `500 10px ${css("--font-mono") || "monospace"}`;
            ctx.textAlign = l.text.align ?? "left";
            ctx.fillStyle = `rgba(${fg},0.8)`;
            ctx.fillText(l.text.s, l.text.x, l.text.y);
          }
          continue;
        }
        const count = Math.max(2, Math.floor((l.pts.length / 2) * f));
        ctx.beginPath();
        ctx.moveTo(l.pts[0], l.pts[1]);
        for (let i = 1; i < count; i++) ctx.lineTo(l.pts[i * 2], l.pts[i * 2 + 1]);
        if (l.fill) {
          ctx.save();
          ctx.lineTo(l.pts[(count - 1) * 2], h);
          ctx.lineTo(l.pts[0], h);
          ctx.closePath();
          ctx.fillStyle = bg;
          ctx.fill();
          ctx.restore();
          ctx.beginPath();
          ctx.moveTo(l.pts[0], l.pts[1]);
          for (let i = 1; i < count; i++) ctx.lineTo(l.pts[i * 2], l.pts[i * 2 + 1]);
        }
        ctx.strokeStyle = `rgba(${fg},${l.alpha})`;
        ctx.lineWidth = l.width;
        ctx.stroke();
        if (l.plane && f < 1 && count > 2) {
          // A small paper plane at the head, pointing along the path
          const hx = l.pts[(count - 1) * 2];
          const hy = l.pts[(count - 1) * 2 + 1];
          const ang = Math.atan2(hy - l.pts[(count - 2) * 2 + 1], hx - l.pts[(count - 2) * 2]);
          ctx.save();
          ctx.translate(hx, hy);
          ctx.rotate(ang);
          ctx.beginPath();
          ctx.moveTo(6, 0);
          ctx.lineTo(-5, -4.5);
          ctx.lineTo(-2.5, 0);
          ctx.lineTo(-5, 4.5);
          ctx.closePath();
          ctx.fillStyle = bg;
          ctx.fill();
          ctx.strokeStyle = `rgba(${fg},1)`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
          ctx.restore();
        }
        if (l.text && f === 1) {
          ctx.font = `500 10px ${css("--font-mono") || "monospace"}`;
          ctx.textAlign = l.text.align ?? "left";
          ctx.fillStyle = `rgba(${fg},0.8)`;
          ctx.fillText(l.text.s, l.text.x, l.text.y);
        }
        if (l.dot && f === 1) {
          const x = l.pts[l.pts.length - 2];
          const y = l.pts[l.pts.length - 1];
          ctx.fillStyle = `rgba(${fg},${l.alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function build() {
      lines = builders[kind](w, h, current);
    }

    function tick(now: number) {
      const t = clamp((now - t0) / DURATION);
      draw(t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
      raf = t < 1 ? requestAnimationFrame(tick) : 0;
    }

    function play() {
      cancelAnimationFrame(raf);
      if (still) return draw(1);
      t0 = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nw = canvas.clientWidth;
      const nh = canvas.clientHeight;
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw(started ? (raf ? progress : 1) : 0);
    }

    function redraw() {
      current += 1;
      build();
      started = true;
      play();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started) return;
        started = true;
        play();
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(canvas);
    const mo = new MutationObserver(() => draw(progress));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-blueprint"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => draw(progress);
    mq.addEventListener("change", onScheme);
    redrawRef.current = redraw;
    const button = canvas.parentElement!;
    button.addEventListener("click", redraw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", onScheme);
      button.removeEventListener("click", redraw);
    };
  }, [kind, seed]);

  // Field figures fade out toward their edges instead of stopping at a hard border.
  const soft = kind === "flow" || kind === "converge" ? "[mask-image:radial-gradient(ellipse_at_center,#000_55%,transparent_100%)]" : "";
  return (
    <button type="button" aria-label={`${label}. Click to draw a new version.`} title="Click to draw a new version" className={`block w-full cursor-pointer rounded-2xl ${soft} ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </button>
  );
}

// A figure with a gallery-style caption under it. Clicking the drawing or "redraw" draws a new one.
export function ArtFigure({ kind, seed, caption, className = "", artClassName = "aspect-[16/9]" }: { kind: ArtKind; seed?: number; caption: string; className?: string; artClassName?: string }) {
  const [redraws, setRedraws] = useState(0);
  return (
    <figure className={`print:hidden ${className}`}>
      <Art kind={kind} seed={seed} label={caption} className={artClassName} redraws={redraws} />
      <figcaption className="label mt-3 flex items-baseline justify-between gap-4">
        <span>{caption}</span>
        <RedrawButton onClick={() => setRedraws((n) => n + 1)} />
      </figcaption>
    </figure>
  );
}

export function RedrawButton({ onClick, children = "↻ redraw" }: { onClick: () => void; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full border border-line px-2 py-0.5 normal-case tracking-normal transition-colors hover:border-fg hover:text-fg"
    >
      {children}
    </button>
  );
}
