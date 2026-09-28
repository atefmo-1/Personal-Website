import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { CountText } from "./CountText";
import { Reveal } from "./Reveal";
import { SkillPill } from "./SkillPill";
import type { Project } from "@/lib/projects";

const h2 = "font-display text-2xl font-bold tracking-tight sm:text-3xl";

// A project page, in the order a recruiter reads: what it is, the numbers, the problem, how I
// worked, what it does (real screens), the product and engineering calls, the stack, what's next.
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
          <div className="mt-8 flex flex-wrap gap-3">
            {cs.links.map((l, i) => (
              <Button key={l.url} href={l.url} external variant={i === 0 ? "primary" : "ghost"}>
                {l.label} <span aria-hidden>↗</span>
              </Button>
            ))}
          </div>
        </div>
        <dl className="col-span-12 self-end border-t border-line lg:col-span-4">
          {cs.meta.map((m) => (
            <div key={m.label} className="grid grid-cols-[6rem_1fr] gap-4 border-b border-line py-3 text-[15px]">
              <dt className="text-muted">{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <figure className="relative mt-12 overflow-hidden rounded-2xl border border-line bg-surface sm:mt-16">
        <Image
          src={cs.cover.src}
          alt={cs.cover.alt}
          width={cs.cover.width}
          height={cs.cover.height}
          priority
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="h-auto w-full"
        />
      </figure>

      {/* By the numbers: scale and rigor at a glance */}
      <Reveal>
        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cs.numbers.map((n) => (
            <div key={n.label} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <dt className="sr-only">{n.label}</dt>
              <dd>
                <CountText text={n.value} className="block font-display text-4xl font-bold tracking-tight sm:text-5xl" />
                <span className="mt-2 block text-sm leading-snug text-muted">{n.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

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
        <h2 className={h2}>How I worked</h2>
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
                <Image src={f.image} alt={f.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
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

      {/* The calls I made: product judgment on one side, engineering on the other */}
      <section className="mt-20 sm:mt-28">
        <h2 className={h2}>Decisions that shaped it</h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {(
            [
              ["Product", cs.decisions.product],
              ["Engineering", cs.decisions.engineering],
            ] as const
          ).map(([label, items]) => (
            <Reveal key={label}>
              <h3 className="label">{label}</h3>
              <ul className="mt-3 border-t border-line">
                {items.map((d) => (
                  <li key={d.title} className="border-b border-line py-5">
                    <p className="font-display text-xl font-bold tracking-tight">{d.title}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{d.text}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal className="mt-20 sm:mt-28">
        <h2 className={h2}>Built with</h2>
        <dl className="mt-6 border-t border-line">
          {cs.stack.map((group) => (
            <div
              key={group.label}
              className="grid gap-3 border-b border-line py-4 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-6"
            >
              <dt className="label">{group.label}</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((s) => (
                    <SkillPill key={s.name} skill={s} />
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

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
        <p className="mt-3 max-w-[48ch] text-lg text-muted">
          Happy to go deeper on the product calls, the roadmap engine, or anything else.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/contact">
            Say hello <span aria-hidden>→</span>
          </Button>
          {cs.links[0] && (
            <Button href={cs.links[0].url} external variant="ghost">
              {cs.links[0].label} <span aria-hidden>↗</span>
            </Button>
          )}
        </div>
      </Reveal>
    </article>
  );
}
