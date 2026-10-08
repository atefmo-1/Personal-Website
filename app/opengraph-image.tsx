import { ImageResponse } from "next/og";
import { fbm } from "@/lib/noise";
import { site } from "@/lib/site";

// The link preview (LinkedIn, iMessage, Slack): my name over generative ridgelines, the same
// line art as the site's footer.
export const alt = `${site.name}: product and data`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function ridgelines() {
  const lines: string[] = [];
  const n = 16;
  for (let i = 0; i < n; i++) {
    const y0 = 420 + i * 13;
    let d = `M0 ${y0}`;
    for (let x = 0; x <= 1200; x += 8) {
      const t = x / 1200;
      // Peaks sit on the right, clear of the text
      const lift = Math.exp(-(((t - 0.8) / 0.09) ** 2)) * 1 + Math.exp(-(((t - 0.93) / 0.05) ** 2)) * 0.55;
      const depth = 0.4 + 0.6 * Math.sin((i / (n - 1)) * Math.PI);
      const r = fbm(x / 60 + 3, i * 0.45 + 3);
      d += ` L${x} ${(y0 - lift * r * depth * 330 - r * 8).toFixed(1)}`;
    }
    lines.push(d + ` L1200 630 L0 630 Z`);
  }
  return lines;
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#F6F5F2", color: "#141414", padding: "64px 72px", position: "relative" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          {ridgelines().map((d, i) => (
            <path key={i} d={d} fill="#F6F5F2" stroke="#141414" strokeWidth={1.6} strokeLinejoin="round" />
          ))}
        </svg>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#68686E" }}>{site.status}</div>
        <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -3, marginTop: 18, lineHeight: 1 }}>{site.name}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 32, marginTop: 22, lineHeight: 1.3, color: "#141414" }}>
          <span>Product and data.</span>
          <span>Morehead-Cain Scholar, UNC Chapel Hill ’27.</span>
        </div>
      </div>
    ),
    size,
  );
}
