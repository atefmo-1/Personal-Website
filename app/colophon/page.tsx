import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

export const metadata: Metadata = { title: "Colophon" };

// How the site is made. Linked from the footer.
const rows: { label: string; body: React.ReactNode }[] = [
  {
    label: "Type",
    body: (
      <>
        <span className="font-display font-bold">Space Grotesk</span> for headlines, <span className="font-sans">Inter</span> for reading,{" "}
        and <span className="font-mono text-[0.9em]">JetBrains Mono</span> for labels. The signature on the home page is traced from Sacramento.
      </>
    ),
  },
  {
    label: "Color",
    body: "One ink, one paper, and one accent: an ink blue, kept for live dots, the current page and keyboard focus. Dark mode swaps ink and paper. Type “draw” anywhere for blueprint mode.",
  },
  {
    label: "Drawings",
    body: "Every figure is drawn live in your browser from math, so no two visits have to look the same: a Fourier series for my name, the Lorenz system (solved step by step), the golden angle, Lissajous and spirograph curves, a Julia set traced as contour lines, noise-driven flow fields, ridgelines, and the parabolas of a jump shot. The route drawing on the home page is a hand-written SVG path. The Outward Bound photo is printed as a halftone made from the original.",
  },
  {
    label: "Built with",
    body: "Next.js, React and TypeScript, styled with Tailwind CSS, animated with Framer Motion and plain CSS, and hosted on Vercel. Contact-form messages are delivered by Resend. Icons from Tabler and Simple Icons.",
  },
  {
    label: "Tools",
    body: "Figma for design and Claude Code for building.",
  },
  {
    label: "Care",
    body: "Nothing moves when you hover. If your device asks for reduced motion, every drawing appears already finished. Keyboard focus is marked, pages print cleanly, and there are no analytics or trackers.",
  },
];

export default function ColophonPage() {
  return (
    <Section title="Colophon" intro="How this site is made." art={{ kind: "spirograph", seed: 2, caption: "Fig. 1 · A wheel inside a wheel" }}>
      <Reveal>
        <dl className="border-t border-line">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="label pt-1">{r.label}</dt>
              <dd className="max-w-3xl leading-relaxed">{r.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-muted">
          Handmade in Chapel Hill by Atef Mohamed.
        </p>
      </Reveal>
    </Section>
  );
}
