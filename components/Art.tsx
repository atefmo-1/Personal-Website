"use client";

import { useEffect, useRef } from "react";
import { fbm, noise, rng } from "@/lib/noise";

// Generative ink figures, drawn on a canvas in the theme's text color. Each one draws itself
// the first time it scrolls into view, and clicking it draws a new variation (a new seed).
// Reduced-motion readers get the finished figure straight away. Nothing reacts to hover.
export type ArtKind = "order" | "ridges" | "flow" | "converge" | "rings";

type Line = {
  pts: number[]; // x0, y0, x1, y1, ...
  width: number;
  alpha: number;
  start: number; // when this line starts and finishes drawing, as a share of the animation
  end: number;
  fill?: boolean; // fill below the line with the page color (ridgelines hide what's behind)
  dot?: boolean; // finish the line with a small dot
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

const builders = { order, ridges, flow, converge, rings };

export function Art({ kind, seed = 1, label, className = "" }: { kind: ArtKind; seed?: number; label: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => draw(progress);
    mq.addEventListener("change", onScheme);
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

// A figure with a gallery-style caption under it.
export function ArtFigure({ kind, seed, caption, className = "", artClassName = "aspect-[16/9]" }: { kind: ArtKind; seed?: number; caption: string; className?: string; artClassName?: string }) {
  return (
    <figure className={className}>
      <Art kind={kind} seed={seed} label={caption} className={artClassName} />
      <figcaption className="label mt-3 flex items-baseline justify-between gap-4">
        <span>{caption}</span>
        <span aria-hidden className="shrink-0 normal-case tracking-normal">
          ↻ redraw
        </span>
      </figcaption>
    </figure>
  );
}
