import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { Reveal } from "./Reveal";
import type { Project } from "@/lib/projects";

const h2 = "font-display text-2xl font-bold tracking-tight sm:text-3xl";

// A project page: header, cover, problem, process, feature walkthrough with images, what's next.
export function CaseStudy({ project }: { project: Project & { caseStudy: NonNullable<Project["caseStudy"]> } }) {
  const cs = project.caseStudy;
  return (
    <article className="container-x pb-24 pt-28 sm:pb-32 sm:pt-36">
      <Link href="/projects" className="label transition-colors hover:text-fg">
        <span aria-hidden>← </span>All projects
      </Link>

      <header className="grid-12 mt-8 gap-y-10">
        <div className="col-span-12 lg:col-span-8">
          <span className="inline-block rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-label text-muted">
            {project.status}
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight sm:text-7xl">{project.name}</h1>
          <p className="mt-5 max-w-[36ch] text-xl leading-snug sm:text-2xl">{cs.tagline}</p>
        </div>
        <dl className="col-span-12 self-end border-t border-line lg:col-span-4">
          {cs.meta.map((m) => (
            <div key={m.label} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-3 text-[15px]">
              <dt className="text-muted">{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <figure className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl bg-surface sm:mt-16">
        <Image src={cs.cover.src} alt={cs.cover.alt} fill priority unoptimized sizes="100vw" className="object-cover" />
      </figure>

      <Reveal className="grid-12 mt-20 gap-y-6 sm:mt-28">
        <h2 className={`${h2} col-span-12 lg:col-span-4`}>The problem</h2>
        <div className="col-span-12 space-y-5 lg:col-span-8">
          {cs.problem.map((p) => (
            <p key={p} className="text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-20 sm:mt-28">
        <h2 className={h2}>How I built it</h2>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cs.process.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-line bg-surface p-6">
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <section className="mt-20 sm:mt-28">
        <h2 className={h2}>What it does</h2>
        <div className="mt-10 space-y-16 sm:space-y-24">
          {cs.features.map((f, i) => (
            <Reveal key={f.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
              <div className={`relative aspect-square overflow-hidden rounded-2xl bg-surface ${i % 2 ? "md:order-last" : ""}`}>
                {/* Small SVGs (~20 KB), so load them up front rather than popping in on scroll */}
                <Image src={f.image} alt={f.alt} fill unoptimized loading="eager" sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div>
                <span className="font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")} / {String(cs.features.length).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{f.title}</h3>
                <p className="mt-4 max-w-[42ch] text-lg leading-relaxed text-muted">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal className="grid-12 mt-20 gap-y-6 sm:mt-28">
        <h2 className={`${h2} col-span-12 lg:col-span-4`}>What&apos;s next</h2>
        <div className="col-span-12 space-y-5 lg:col-span-8">
          {cs.next.map((p) => (
            <p key={p} className="text-lg leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-20 rounded-2xl border border-line bg-surface p-8 sm:mt-28 sm:p-12">
        <p className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Want a walkthrough?</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/contact">
            Say hello <span aria-hidden>→</span>
          </Button>
          <Button href="/projects" variant="ghost">
            More projects
          </Button>
        </div>
      </Reveal>
    </article>
  );
}
