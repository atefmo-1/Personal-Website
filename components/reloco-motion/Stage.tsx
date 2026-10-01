"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { relocoSans } from "@/lib/relocoFonts";

// A phone screen for Reloco's motion graphics. Scenes are drawn at the app's own size (390 x 844,
// an iPhone's logical pixels, the same ratio as the screenshots) and scaled to whatever width the
// page gives them, in Reloco's light palette whatever the site's theme. A clock runs while the
// stage is on screen and loops; with "reduce motion" on, the scene shows its final frame instead.

export const W = 390;
export const H = 844;

const PALETTE = {
  "--r-canvas": "#f4eee3",
  "--r-surface": "#fffbf4",
  "--r-surface-2": "#ede5d6",
  "--r-fill": "#e8dfce",
  "--r-line": "rgb(19 41 75 / 0.12)",
  "--r-ink": "#13294b",
  "--r-ink-2": "#52607a",
  "--r-ink-3": "#8e96a6",
  "--r-primary": "#13294b",
  "--r-on-primary": "#fffbf4",
  "--r-leaf": "#4b9cd3",
  "--r-leaf-ink": "#1f5f97",
  "--r-leaf-soft": "#e1eef8",
  "--r-gold": "#e6b04a",
  "--r-gold-ink": "#7e5600",
  "--r-gold-soft": "#fbefd2",
  "--r-urgent": "#b5402f",
  "--r-urgent-ink": "#9e3325",
  "--r-urgent-soft": "#f7e1da",
  "--r-success": "#2f7fbf",
  "--r-shadow": "0 1px 0 rgb(19 41 75 / 0.05), 0 2px 8px -2px rgb(19 41 75 / 0.09)",
} as CSSProperties;

export interface Clock {
  /** Milliseconds into the loop. */
  t: number;
  /** The loop's length. */
  duration: number;
  /** "Reduce motion" is on: the clock sits at the end and nothing fades out. */
  reduced: boolean;
}

const ClockContext = createContext<Clock>({ t: 0, duration: 1, reduced: false });
export const useClock = () => useContext(ClockContext);

export function Stage({ alt, duration, children }: { alt: string; duration: number; children: ReactNode }) {
  const screen = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [clock, setClock] = useState<Clock>({ t: 0, duration, reduced: false });
  const [loop, setLoop] = useState(0);

  useLayoutEffect(() => {
    const el = screen.current!;
    const fit = () => setScale(el.clientWidth / W);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = screen.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setClock({ t: duration, duration, reduced: true });
      return;
    }
    let raf = 0;
    let start = 0;
    let running = false;
    const tick = (now: number) => {
      if (!start) start = now;
      let t = now - start;
      if (t >= duration) {
        start = now;
        t = 0;
        setLoop((n) => n + 1);
      }
      setClock({ t, duration, reduced: false });
      raf = requestAnimationFrame(tick);
    };
    // Runs only while on screen, so a page of scenes costs nothing while you read elsewhere.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          start = 0;
          raf = requestAnimationFrame(tick);
        } else if (!e.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [duration]);

  return (
    <div className="rounded-[2.2rem] bg-[#0b0b0c] p-[7px] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] ring-1 ring-line">
      <div ref={screen} role="img" aria-label={alt} data-duration={duration} className="relative overflow-hidden rounded-[1.8rem] bg-[#f4eee3]" style={{ aspectRatio: `${W} / ${H}` }}>
        <div
          aria-hidden
          className={`${relocoSans.className} absolute top-0 left-0 origin-top-left antialiased`}
          style={{ ...PALETTE, width: W, height: H, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden", color: "var(--r-ink)", background: "var(--r-canvas)" }}
        >
          <ClockContext.Provider value={clock}>
            {/* A new key each loop remounts the scene, so every entrance plays again. */}
            <div key={loop} className="relative h-full w-full">
              {children}
            </div>
          </ClockContext.Provider>
        </div>
      </div>
    </div>
  );
}
