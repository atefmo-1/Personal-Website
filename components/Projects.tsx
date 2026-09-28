import Image from "next/image";
import Link from "next/link";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { projects, projectsIntro } from "@/lib/projects";

// Project cards in the site's own colors: text on the left, the project's image on the right.
// Cards with a case study link to /projects/<slug> (the whole card is clickable).
export function Projects() {
  return (
    <Section title="Projects" intro={projectsIntro}>
      <div className="grid gap-6">
        {projects.map((p) => (
          <Reveal key={p.slug}>
            <Magnetic strength={0.03}>
              <article className="group relative grid items-center gap-6 overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-fg focus-within:ring-2 focus-within:ring-fg focus-within:ring-offset-2 focus-within:ring-offset-bg sm:p-10 lg:grid-cols-2">
                <div>
                  <span className="inline-block rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-label text-muted">
                    {p.status}
                  </span>
                  <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                    {p.caseStudy ? (
                      // Stretched link: the whole card is clickable, the link text stays the name.
                      <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                        {p.name}
                      </Link>
                    ) : (
                      p.name
                    )}
                  </h2>
                  <p className="mt-3 max-w-[48ch] text-lg leading-relaxed text-muted">{p.blurb}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded-full border border-line px-3 py-1 text-sm">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-label">
                    {p.caseStudy && (
                      <p className="inline-flex items-center gap-2" aria-hidden>
                        Read the case study
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </p>
                    )}
                    {p.live && (
                      // Sits above the card's stretched link so it stays its own click target.
                      <a
                        href={p.live.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 inline-flex items-center gap-1.5 text-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
                      >
                        {p.live.label} <span aria-hidden>↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </article>
            </Magnetic>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
