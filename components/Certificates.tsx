import { Reveal } from "./Reveal";
import { brandColors, brandStyle } from "@/lib/brandColor";
import { certificates } from "@/lib/certificates";
import { Ink } from "./Ink";

// Sits under Skills on the Work & Experience page. Server component, like Skills.
export function Certificates() {
  return (
    <section id="certificates" className="mt-20 scroll-mt-24 sm:mt-28">
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl"><Ink>Certificates</Ink></h2>

      <Reveal>
        <ul className="mt-6 border-t border-line">
          {certificates.map((c) => (
            <li
              key={c.url}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-0.5 border-b border-line py-4"
            >
              <div>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
                >
                  {c.icon && (
                    <svg viewBox="0 0 24 24" className="brand h-4 w-4 shrink-0 self-center fill-current" style={brandStyle(brandColors(c.icon.hex))} aria-hidden>
                      <path d={c.icon.path} />
                    </svg>
                  )}
                  {c.name} <span aria-hidden className="text-muted">↗</span>
                </a>
                <p className="text-sm text-muted">{c.issuer}</p>
              </div>
              <p className="font-mono text-xs uppercase tracking-label text-muted">{c.issued}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
