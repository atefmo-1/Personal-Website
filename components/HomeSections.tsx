import Link from "next/link";
import { ArtFigure } from "./Art";
import { Signature } from "./Signature";
import { Reveal } from "./Reveal";
import { ProjectCard } from "./Projects";
import { EducationRows, ExperienceRows } from "./RoleRows";
import { showProjects } from "@/lib/pages";
import { projects } from "@/lib/projects";
import { signaturePoints } from "@/lib/signature";
import { about } from "@/lib/site";
import { Ink } from "./Ink";

const h2 = "font-display text-2xl font-bold tracking-tight sm:text-3xl";

function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-muted underline-offset-4 transition-colors hover:text-fg hover:underline">
      {children} <span aria-hidden>→</span>
    </Link>
  );
}

const featured = projects.find((p) => p.slug === "reloco");

// Under the hero on the home page: the short story, the featured project, then education and experience.
export function HomeSections() {
  return (
    <div className="container-x space-y-16 pb-24 sm:space-y-20 sm:pb-32">
      <Reveal className="grid items-center gap-x-12 gap-y-10 border-t border-line pt-10 sm:pt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          {about.paragraphs.map((p) => (
            <p key={p} className="max-w-4xl font-display text-2xl font-medium leading-[1.3] tracking-tight sm:text-3xl">
              {p}
            </p>
          ))}
          <div className="mt-5">
            <More href="/about">Hobbies, communities, and the route map</More>
          </div>
        </div>
        <ArtFigure kind="delta" seed={1} caption="Fig. 2 · The Nile Delta. I grew up at the dot." artClassName="aspect-[4/3]" />
      </Reveal>

      {showProjects && featured && (
        <section>
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 className={h2}><Ink>Featured project</Ink></h2>
            <More href="/projects">All projects</More>
          </div>
          <Reveal>
            <ProjectCard project={featured} headingLevel="h3" />
          </Reveal>
        </section>
      )}

      <section>
        <h2 className={`${h2} mb-5`}><Ink>Education</Ink></h2>
        <EducationRows />
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className={h2}><Ink>Experience</Ink></h2>
          <More href="/experience">Skills and more on work</More>
        </div>
        <ExperienceRows />
      </section>

      {/* Signed off: my name, drawn by a Fourier series */}
      <figure className="mx-auto max-w-3xl print:hidden">
        <Signature className="aspect-[16/9]" />
        <figcaption className="label mt-3 flex items-baseline justify-between gap-4">
          <span>Fig. 3 · My name, drawn by {signaturePoints.length / 3} spinning circles (a Fourier series)</span>
          <span aria-hidden className="shrink-0 normal-case tracking-normal">
            ↻ redraw
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
