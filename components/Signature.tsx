"use client";

import { useEffect, useRef } from "react";
import { signaturePoints, signatureSize } from "@/lib/signature";

// My name, drawn by a chain of spinning circles: a Fourier series. The outline of "Atef" is
// treated as a loop of complex numbers; a discrete Fourier transform turns that loop into
// circles, each spinning at a whole-number speed, and stacking them tip to tail traces the name.
// It starts when it scrolls into view; clicking redraws it. Reduced-motion readers see the
// finished name.
const DURATION = 14000; // ms for one full trace
const SHOWN = 90; // circles drawn on screen (all of them are summed)

type Term = { freq: number; amp: number; phase: number };

// Discrete Fourier transform of the points, as complex numbers x + iy.
function transform(): Term[] {
  const n = signaturePoints.length / 3;
  const terms: Term[] = [];
  for (let k = 0; k < n; k++) {
    let re = 0;
    let im = 0;
    for (let j = 0; j < n; j++) {
      const x = signaturePoints[j * 3];
      const y = signaturePoints[j * 3 + 1];
      const a = (-2 * Math.PI * k * j) / n;
      re += x * Math.cos(a) - y * Math.sin(a);
      im += x * Math.sin(a) + y * Math.cos(a);
    }
    re /= n;
    im /= n;
    // Use frequencies -n/2..n/2, so the circles turn both ways and the series stays smooth.
    const freq = k <= n / 2 ? k : k - n;
    terms.push({ freq, amp: Math.hypot(re, im), phase: Math.atan2(im, re) });
  }
  return terms.sort((a, b) => b.amp - a.amp);
}

export function Signature({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const still = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    const n = signaturePoints.length / 3;
    const terms = transform();
    let w = 0;
    let h = 0;
    let raf = 0;
    let t0 = 0;
    let progress = 0; // 0..1 of the trace, then up to 1.15 while the circles fade out
    let started = false;

    const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

    // Fit the name's box into the canvas, leaving room for the circles to swing.
    function frame() {
      const s = Math.min((w * 0.7) / signatureSize.w, (h * 0.78) / signatureSize.h);
      return { s, ox: (w - signatureSize.w * s) / 2, oy: (h - signatureSize.h * s) / 2 };
    }

    // Position of the chain's tip at time t (0..1), plus each circle's center if asked.
    function tip(t: number, centers?: number[]) {
      let x = 0;
      let y = 0;
      const a = 2 * Math.PI * t;
      for (let i = 0; i < terms.length; i++) {
        const { freq, amp, phase } = terms[i];
        if (centers && i < SHOWN) centers.push(x, y, amp);
        x += amp * Math.cos(freq * a + phase);
        y += amp * Math.sin(freq * a + phase);
      }
      return [x, y];
    }

    // The traced name, sampled once (it doesn't change), with the pen state per sample.
    const trace: number[] = [];
    for (let j = 0; j <= n * 2; j++) {
      const t = j / (n * 2);
      const [x, y] = tip(t);
      // Lift the pen near each jump too: the series rings a little where the path jumps.
      const at = Math.floor(t * n);
      let pen = 1;
      for (let d = -2; d <= 2; d++) pen &= signaturePoints[((at + d + n) % n) * 3 + 2];
      trace.push(x, y, pen);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const fg = css("--fg").replace(/ /g, ",");
      const { s, ox, oy } = frame();
      const X = (x: number) => ox + x * s;
      const Y = (y: number) => oy + y * s;
      const p = Math.min(1, progress);

      // The name so far, lifting the pen over the jumps between strokes
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(${fg},0.95)`;
      ctx.beginPath();
      const upto = Math.floor((trace.length / 3 - 1) * p);
      let down = false;
      for (let j = 0; j <= upto; j++) {
        const x = X(trace[j * 3]);
        const y = Y(trace[j * 3 + 1]);
        if (trace[j * 3 + 2]) {
          if (down) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
          down = true;
        } else down = false;
      }
      ctx.stroke();

      // The circles and arms, fading out once the name is done
      const fade = progress < 1 ? 1 : Math.max(0, 1 - (progress - 1) / 0.15);
      if (fade <= 0) return;
      const centers: number[] = [];
      const [tx, ty] = tip(p, centers);
      ctx.lineWidth = 0.8;
      for (let i = 1; i < centers.length / 3; i++) {
        const cx = X(centers[i * 3]);
        const cy = Y(centers[i * 3 + 1]);
        const r = centers[i * 3 + 2] * s;
        if (r < 0.6) continue;
        ctx.strokeStyle = `rgba(${fg},${0.16 * fade})`;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.strokeStyle = `rgba(${fg},${0.5 * fade})`;
      ctx.beginPath();
      for (let i = 1; i < centers.length / 3; i++) {
        const cx = X(centers[i * 3]);
        const cy = Y(centers[i * 3 + 1]);
        if (i === 1) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.lineTo(X(tx), Y(ty));
      ctx.stroke();
      ctx.fillStyle = `rgba(${fg},${fade})`;
      ctx.beginPath();
      ctx.arc(X(tx), Y(ty), 2.6, 0, Math.PI * 2);
      ctx.fill();
    }

    function tick(now: number) {
      progress = (now - t0) / DURATION;
      draw();
      raf = progress < 1.15 ? requestAnimationFrame(tick) : 0;
    }

    function play() {
      cancelAnimationFrame(raf);
      if (still) {
        progress = 2;
        return draw();
      }
      t0 = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
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
      { threshold: 0.35 },
    );
    io.observe(canvas);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-blueprint"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", draw);
    const button = canvas.parentElement!;
    const replay = () => {
      started = true;
      play();
    };
    button.addEventListener("click", replay);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", draw);
      button.removeEventListener("click", replay);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="My name, Atef, drawn by a chain of spinning circles (a Fourier series). Click to draw it again."
      title="Click to draw it again"
      className={`block w-full cursor-pointer rounded-2xl ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </button>
  );
}
