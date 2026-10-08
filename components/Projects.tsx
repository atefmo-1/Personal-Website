import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { InkDrawing } from "./InkDrawing";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { drawings, projectDrawings } from "@/lib/drawings";
import { projects, projectsIntro, type Project } from "@/lib/projects";

// One compact card per project: a line drawing (or the project's image) on the left, then what it is, a few
// numbers from the case study and two clear actions. Hover only changes the outline.
// Also the featured project on the home page.
export function ProjectCard({ project: p, headingLevel: Heading = "h2" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const cs = p.caseStudy;
  const href = cs ? `/projects/${p.slug}` : p.live?.url;
  const art = projectDrawings[p.slug];
  return (
    <article className="relative grid overflow-hidden rounded-3xl border border-line bg-surface transition-colors hover:border-fg focus-within:border-fg md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      {art ? (
        // A pen drawing of the project, in the site's line style
        <div className="flex items-center justify-center border-b border-line px-8 py-8 md:border-b-0 md:border-r md:px-10">
          <InkDrawing drawing={art} delay={0.2} className="max-w-[300px]" />
        </div>
      ) : (
        <div className="relative aspect-[16/9] md:aspect-auto md:min-h-full">
          <Image src={p.image} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
        </div>
      )}

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-label">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-fg" />
            {p.status}
          </span>
          {p.live && <span className="font-mono text-xs uppercase tracking-label text-muted">{p.live.label}</span>}
        </div>

        <Heading className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {href ? (
            // Stretched link: the whole card opens the case study.
            <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {p.name}
            </Link>
          ) : (
            p.name
          )}
        </Heading>
        <p className="mt-3 max-w-[56ch] leading-relaxed text-muted">{p.blurb}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-3 py-1 text-sm">
              {t}
            </li>
          ))}
        </ul>

        {/* Above the stretched link, so each stays its own click target */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-3">
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
    </article>
  );
}

export function Projects() {
  return (
    <Section title="Projects" intro={projectsIntro} drawing={drawings.projects}>
      <div className="grid gap-6">
        {projects.map((p) => (
          <Reveal key={p.slug}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
