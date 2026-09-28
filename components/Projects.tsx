import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { projects, projectsIntro } from "@/lib/projects";

// One card per project: the product's own landing page on top, then what it is, the proof
// (numbers from the case study) and two clear actions. Hover only changes the outline; nothing moves.
export function Projects() {
  return (
    <Section title="Projects" intro={projectsIntro}>
      <div className="grid gap-8">
        {projects.map((p) => {
          const cs = p.caseStudy;
          const href = cs ? `/projects/${p.slug}` : p.live?.url;
          return (
            <Reveal key={p.slug}>
              <article className="group relative overflow-hidden rounded-3xl border border-line bg-surface transition-colors hover:border-fg focus-within:border-fg">
                {(cs || p.image) && (
                  <div className="border-b border-line">
                    <Image
                      src={cs?.cover.src ?? p.image!}
                      alt=""
                      width={cs?.cover.width ?? 1600}
                      height={cs?.cover.height ?? 900}
                      sizes="(min-width: 1280px) 1200px, 100vw"
                      className="block h-auto w-full"
                    />
                  </div>
                )}

                <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-label">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-fg" />
                        {p.status}
                      </span>
                      {p.live && <span className="font-mono text-xs uppercase tracking-label text-muted">{p.live.label}</span>}
                    </div>

                    <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                      {href ? (
                        // Stretched link: the whole card opens the case study.
                        <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                          {p.name}
                        </Link>
                      ) : (
                        p.name
                      )}
                    </h2>
                    <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted">{p.blurb}</p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <li key={t} className="rounded-full border border-line px-3 py-1 text-sm">
                          {t}
                        </li>
                      ))}
                    </ul>

                    {/* Above the stretched link, so each stays its own click target */}
                    <div className="relative z-10 mt-8 flex flex-wrap gap-3">
                      {cs && (
                        <Button href={`/projects/${p.slug}`}>
                          Read the case study <span aria-hidden>→</span>
                        </Button>
                      )}
                      {p.live && (
                        <Button href={p.live.url} external variant="ghost">
                          Visit {p.live.label} <span aria-hidden>↗</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {cs && (
                    <div className="self-end">
                      <ul className="grid grid-cols-2 border-l border-t border-line">
                        {cs.numbers.map((n) => (
                          <li key={n.label} className="border-b border-r border-line p-4 sm:p-5">
                            <span className="sr-only">{`${n.value} ${n.label}`}</span>
                            <span aria-hidden>
                              <span className="block font-display text-3xl font-bold tracking-tight">{n.value}</span>
                              <span className="mt-1 block text-xs leading-snug text-muted">{n.label}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                      {cs.meta[0] && (
                        <p className="mt-4 text-sm text-muted">
                          <span className="label mr-2">{cs.meta[0].label}</span>
                          {cs.meta[0].value}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
