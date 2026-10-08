"use client";

import { useEffect, useRef, useState } from "react";
import { RedrawButton } from "./Art";
import { rng } from "@/lib/noise";

// Conway's Game of Life: a live cell with two or three live neighbors survives, a dead cell with
// exactly three comes alive, everything else dies. It runs for a few hundred generations when it
// scrolls into view, then rests; "reseed" starts a new random soup. The grid wraps at the edges.
const CELL = 7;
const GENERATIONS = 240;
const FPS = 12;

export function LifeGrid({ caption, className = "" }: { caption: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seed, setSeed] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const still = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = Math.floor(w / CELL);
    const rows = Math.floor(h / CELL);
    const ox = (w - cols * CELL) / 2;
    const oy = (h - rows * CELL) / 2;
    const r = rng(seed * 7919 + 3);
    let grid = new Uint8Array(cols * rows).map(() => (r() < 0.28 ? 1 : 0));
    let gen = 0;
    let timer = 0;
    let started = false;

    const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim().replace(/ /g, ",");

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const fg = css("--fg");
      ctx.fillStyle = `rgba(${fg},0.85)`;
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          if (!grid[y * cols + x]) continue;
          ctx.beginPath();
          ctx.arc(ox + x * CELL + CELL / 2, oy + y * CELL + CELL / 2, CELL * 0.36, 0, Math.PI * 2);
          ctx.fill();
        }
      ctx.strokeStyle = `rgba(${fg},0.12)`;
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    }

    function step() {
      const next = new Uint8Array(cols * rows);
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
              if (!dx && !dy) continue;
              n += grid[((y + dy + rows) % rows) * cols + ((x + dx + cols) % cols)];
            }
          const alive = grid[y * cols + x];
          next[y * cols + x] = n === 3 || (alive && n === 2) ? 1 : 0;
        }
      grid = next;
    }

    function run() {
      if (gen >= GENERATIONS) return;
      step();
      gen++;
      draw();
      timer = window.setTimeout(run, 1000 / FPS);
    }

    draw();
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return;
      started = true;
      if (still) {
        for (let i = 0; i < 60; i++) step();
        draw();
      } else run();
    }, { threshold: 0.3 });
    io.observe(canvas);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-blueprint"] });
    return () => {
      clearTimeout(timer);
      io.disconnect();
      mo.disconnect();
    };
  }, [seed]);

  return (
    <figure className={`print:hidden ${className}`}>
      <canvas ref={canvasRef} className="block aspect-[4/3] w-full" role="img" aria-label="Conway's Game of Life running on a grid of dots" />
      <figcaption className="label mt-3 flex items-baseline justify-between gap-4">
        <span>{caption}</span>
        <RedrawButton onClick={() => setSeed((s) => s + 1)}>↻ reseed</RedrawButton>
      </figcaption>
    </figure>
  );
}
