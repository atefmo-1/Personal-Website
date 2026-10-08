"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { rng } from "@/lib/noise";

// My skills as a night sky: one constellation per group (Product, AI, Tools, Stack). Stars are
// joined by the shortest set of lines that connects them all (a minimum spanning tree), which is
// how a constellation reads. Click a constellation, or its name, to light it up and read its
// stars. The full list stays in the table below, so this is the picture, not the only source.
type Group = { title: string; items: string[] };
type Star = { x: number; y: number; name: string; size: number };

const W = 1000;
const H = 360;

function layout(groups: Group[]) {
  return groups.map((g, gi) => {
    const r = rng(9001 + gi * 97);
    const cx = (W / groups.length) * (gi + 0.5);
    const cy = H * 0.48;
    const rx = W / groups.length / 2 - 34;
    const ry = H * 0.36;
    // Spread stars out: try a few spots for each and keep the one farthest from the others
    const stars: Star[] = [];
    for (const name of g.items) {
      let best = { x: cx, y: cy, d: -1 };
      for (let k = 0; k < 24; k++) {
        const a = r() * Math.PI * 2;
        const m = Math.sqrt(r());
        const x = cx + Math.cos(a) * rx * m;
        const y = cy + Math.sin(a) * ry * m;
        const d = Math.min(Infinity, ...stars.map((s) => Math.hypot(s.x - x, s.y - y)));
        if (d > best.d) best = { x, y, d };
      }
      stars.push({ x: best.x, y: best.y, name, size: 1.6 + r() * 2.2 });
    }
    // Prim's algorithm for the minimum spanning tree
    const edges: [number, number][] = [];
    const inTree = new Set([0]);
    while (inTree.size < stars.length) {
      let pick: [number, number, number] = [-1, -1, Infinity];
      for (const i of inTree)
        for (let j = 0; j < stars.length; j++) {
          if (inTree.has(j)) continue;
          const d = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
          if (d < pick[2]) pick = [i, j, d];
        }
      edges.push([pick[0], pick[1]]);
      inTree.add(pick[1]);
    }
    return { title: g.title, cx, stars, edges };
  });
}

export function SkillConstellation({ groups }: { groups: Group[] }) {
  const skies = useMemo(() => layout(groups), [groups]);
  const [active, setActive] = useState<number | null>(null);
  const [seen, setSeen] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setSeen(true);
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="mt-8 print:hidden">
      {/* Scrolls sideways on phones so the stars keep their room */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className={`constellation block w-full min-w-[720px] text-fg ${seen ? "is-seen" : ""}`}
          role="img"
          aria-label={`My skills drawn as four constellations: ${groups.map((g) => `${g.title} (${g.items.length})`).join(", ")}.`}
        >
          {skies.map((sky, gi) => {
            const on = active === gi;
            const dim = active !== null && !on;
            return (
              <g
                key={sky.title}
                onClick={() => setActive(on ? null : gi)}
                className="cursor-pointer transition-opacity duration-300"
                style={{ opacity: dim ? 0.25 : 1 }}
              >
                {/* A generous click target for the whole constellation */}
                <rect x={sky.cx - W / skies.length / 2} y={0} width={W / skies.length} height={H} fill="transparent" />
                {sky.edges.map(([a, b], i) => (
                  <line
                    key={i}
                    x1={sky.stars[a].x}
                    y1={sky.stars[a].y}
                    x2={sky.stars[b].x}
                    y2={sky.stars[b].y}
                    stroke="currentColor"
                    strokeWidth={on ? 1.1 : 0.8}
                    strokeOpacity={on ? 0.8 : 0.4}
                    pathLength={1}
                    className="constellation-edge"
                    style={{ transitionDelay: `${gi * 0.25 + i * 0.04}s` }}
                  />
                ))}
                {sky.stars.map((s, i) => (
                  <g key={s.name}>
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r={on ? s.size + 0.8 : s.size}
                      fill="currentColor"
                      className="constellation-star"
                      style={{ transitionDelay: `${gi * 0.25 + i * 0.03}s` }}
                    />
                    {on && (
                      // Label beside the star, on the side facing away from the constellation's center
                      <text
                        x={s.x + (s.x < sky.cx ? -(s.size + 5) : s.size + 5)}
                        y={s.y + 3.5}
                        textAnchor={s.x < sky.cx ? "end" : "start"}
                        className="fill-current font-mono text-[10px]"
                      >
                        {s.name}
                      </text>
                    )}
                  </g>
                ))}
                <text x={sky.cx} y={H - 12} textAnchor="middle" className="fill-current font-mono text-[12px] uppercase tracking-[0.14em]" opacity={on ? 1 : 0.6}>
                  {sky.title} · {sky.stars.length}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="label mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <span>Fig. 2 · The toolbox as constellations, each joined by its minimum spanning tree. Click one to read its stars.</span>
        <span className="flex gap-2 normal-case tracking-normal">
          {skies.map((sky, gi) => (
            <button
              key={sky.title}
              type="button"
              aria-pressed={active === gi}
              onClick={() => setActive(active === gi ? null : gi)}
              className={`rounded-full border px-2.5 py-0.5 transition-colors ${active === gi ? "border-fg text-fg" : "border-line hover:border-fg"}`}
            >
              {sky.title}
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
