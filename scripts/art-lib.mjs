// Shared helpers for the generated project art: seeded RNG and a flat, faceted (low-poly)
// background in the same visual language as the portrait.

export function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
export const shade = (c, k) => c.map((v) => Math.max(0, Math.min(255, Math.round(v * k))));
export const rgb = (c) => `rgb(${c.join(",")})`;

// Jittered grid, each cell split into two triangles, colored along a diagonal ramp.
export function facets(seed, from, to, W = 1200, H = 800) {
  const r = rng(seed), cols = 11, rows = 8, cw = W / (cols - 1), ch = H / (rows - 1);
  const pts = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const edgeX = x === 0 || x === cols - 1, edgeY = y === 0 || y === rows - 1;
    pts.push([x * cw + (edgeX ? 0 : (r() - 0.5) * cw * 0.7), y * ch + (edgeY ? 0 : (r() - 0.5) * ch * 0.7)]);
  }
  const P = (x, y) => pts[y * cols + x];
  const a = hex(from), b = hex(to);
  let out = "";
  for (let y = 0; y < rows - 1; y++) for (let x = 0; x < cols - 1; x++) {
    const q = [P(x, y), P(x + 1, y), P(x + 1, y + 1), P(x, y + 1)];
    const tris = r() > 0.5 ? [[q[0], q[1], q[2]], [q[0], q[2], q[3]]] : [[q[0], q[1], q[3]], [q[1], q[2], q[3]]];
    for (const t of tris) {
      const cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
      const k = Math.min(1, Math.max(0, (cx / W) * 0.55 + (1 - cy / H) * 0.45));
      const c = shade(mix(a, b, k), 0.94 + r() * 0.12);
      out += `<polygon points="${t.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="${rgb(c)}" stroke="${rgb(c)}" stroke-width="1"/>`;
    }
  }
  return out;
}

export const svg = (body, W = 1200, H = 800) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${body}</svg>\n`;
