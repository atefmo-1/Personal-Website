import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { CaseStudyToc } from "./CaseStudyToc";
import { Journey, Personas } from "./CaseStudyUx";
import { CountText } from "./CountText";
import { Reveal } from "./Reveal";
import { SkillPill } from "./SkillPill";
import type { Project } from "@/lib/projects";

type CS = NonNullable<Project["caseStudy"]>;

const h2 = "font-display text-3xl font-bold tracking-tight sm:text-4xl";
const card = "rounded-2xl border border-line bg-surface";

// Numbered section heading, matching the "On this page" list.
function Head({ n, title, lead }: { n: number; title: string; lead?: string }) {
  return (
    <div className="mb-8">
      <span className="font-mono text-xs text-muted">{String(n).padStart(2, "0")}</span>
      <h2 className={`${h2} mt-2`}>{title}</h2>
      {lead && <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}

function Shots({ shots, aspect }: { shots: CS["screens"]; aspect: string }) {
  return (
    // Side by side from tablet up; a swipeable row on phones.
    <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
      {shots.map((s) => (
        <li key={s.src} className="w-[72%] shrink-0 snap-start sm:w-[45%] md:w-auto">
          <figure>
            <div className={`relative ${aspect} overflow-hidden ${card}`}>
              <Image src={s.src} alt={s.alt} fill sizes="(min-width: 768px) 30vw, 72vw" className="object-cover object-top" />
            </div>
            <figcaption className="mt-3 text-sm text-muted">{s.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

// A project page, in the order a recruiter reads: what it is, the numbers, the problem, what users
// said, personas and the journey map, how I worked, what it does, the product and engineering
// calls, AI, the stack, what's next.
export function CaseStudy({ project }: { project: Project & { caseStudy: CS } }) {
  const cs = project.caseStudy;

  // Only sections this project has, numbered in order.
  const sections = [
    { id: "problem", label: "Problem" },
    ...(cs.research ? [{ id: "research", label: "Research" }] : []),
    ...(cs.personas ? [{ id: "personas", label: "Personas" }] : []),
    ...(cs.journey ? [{ id: "journey", label: "Journey map" }] : []),
    { id: "process", label: "How I worked" },
    { id: "product", label: "What it does" },
    { id: "decisions", label: "Decisions" },
    ...(cs.ai ? [{ id: "ai", label: "Where AI fits" }] : []),
    { id: "stack", label: "Built with" },
    { id: "next", label: "What's next" },
  ];
  const num = (id: string) => sections.findIndex((s) => s.id === id) + 1;
  const section = "scroll-mt-24";

  return (
    <article className="container-x pb-24 pt-28 sm:pb-32 sm:pt-36">
      <Link href="/projects" className="label transition-colors hover:text-fg">
        <span aria-hidden>← </span>All projects
      </Link>

      {/* Hero: name and summary, then the product itself, then the facts */}
      <header className="mt-8">
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
      </header>

      <figure className={`mt-12 overflow-hidden sm:mt-16 ${card}`}>
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

      <dl className="mt-6 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {cs.meta.map((m) => (
          <div key={m.label} className="border-b border-line py-4 sm:pr-6">
            <dt className="label">{m.label}</dt>
            <dd className="mt-1.5 text-[15px] leading-snug">{m.value}</dd>
          </div>
        ))}
      </dl>

      {/* By the numbers: scale and rigor at a glance */}
      <Reveal>
        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cs.numbers.map((n) => (
            <div key={n.label} className={`p-5 sm:p-6 ${card}`}>
              <dt className="sr-only">{n.label}</dt>
              <dd>
                <CountText text={n.value} className="block font-display text-4xl font-bold tracking-tight sm:text-5xl" />
                <span className="mt-2 block text-sm leading-snug text-muted">{n.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="mt-20 grid gap-16 sm:mt-28 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <CaseStudyToc items={sections} />
        </aside>

        <div className="min-w-0 space-y-24 sm:space-y-32">
          <Reveal as="section" id="problem" className={section}>
            <Head n={num("problem")} title="The problem" />
            <div className="max-w-[62ch] space-y-5">
              {cs.problem.map((p) => (
                <p key={p} className="text-lg leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
            {cs.framing && (
              <div className="mt-8 grid gap-4 md:grid-cols-[3fr_2fr]">
                <div className={`p-6 sm:p-7 ${card}`}>
                  <p className="label">How might we</p>
                  <p className="mt-3 font-display text-xl font-bold leading-snug tracking-tight sm:text-2xl">{cs.framing.hmw}</p>
                </div>
                <div className={`p-6 sm:p-7 ${card}`}>
                  <p className="label">User story</p>
                  <p className="mt-3 text-lg italic leading-snug">&ldquo;{cs.framing.story}&rdquo;</p>
                </div>
              </div>
            )}
          </Reveal>

          {cs.research && (
            <section id="research" className={section}>
              <Head n={num("research")} title="What students told me" lead={cs.research.intro} />
              <ol className="grid gap-4 md:grid-cols-2">
                {cs.research.insights.map((ins, i) => (
                  <Reveal as="li" key={ins.title} className={`flex flex-col p-6 sm:p-7 ${card}`}>
                    <span className="label">Insight {i + 1}</span>
                    <h3 className="mt-2 font-display text-xl font-bold tracking-tight">{ins.title}</h3>
                    <blockquote className="mt-4 border-l-2 border-fg pl-4">
                      <p className="font-display text-lg leading-snug">&ldquo;{ins.quote}&rdquo;</p>
                      <footer className="mt-2 text-xs text-muted">{ins.who}</footer>
                    </blockquote>
                    <p className="mb-5 mt-4 text-[15px] leading-relaxed text-muted">{ins.finding}</p>
                    <p className="mt-auto flex gap-2 border-t border-line pt-4 text-[15px] leading-relaxed">
                      <span aria-hidden className="shrink-0">→</span>
                      <span>
                        <span className="sr-only">So Reloco: </span>
                        {ins.response}
                      </span>
                    </p>
                  </Reveal>
                ))}
              </ol>
            </section>
          )}

          {cs.personas && (
            <section id="personas" className={section}>
              <Head n={num("personas")} title="Who I designed for" lead={cs.personas.intro} />
              <Personas data={cs.personas} />
            </section>
          )}

          {cs.journey && (
            <section id="journey" className={section}>
              <Head n={num("journey")} title="Mapping the journey" lead={cs.journey.intro} />
              <Journey data={cs.journey} />
            </section>
          )}

          <section id="process" className={section}>
            <Head n={num("process")} title="How I worked" />
            {/* A timeline: interviews to launch */}
            <ol className="relative ml-3 max-w-2xl border-l border-line">
              {cs.process.map((step, i) => (
                <Reveal as="li" key={step.title} className="relative pb-10 pl-10 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[13px] top-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-line bg-bg font-mono text-[10px] text-muted"
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-display text-xl font-bold tracking-tight">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{step.text}</p>
                </Reveal>
              ))}
            </ol>
          </section>

          <section id="product" className={section}>
            <Head n={num("product")} title="What it does" />
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {cs.features.map((f, i) => (
                <Reveal as="li" key={f.title} className={`p-6 ${card}`}>
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.text}</p>
                </Reveal>
              ))}
            </ul>

            <div className="mt-14">
              <h3 className="label mb-4">In the app</h3>
              <Shots shots={cs.screens} aspect="aspect-[2/3]" />
            </div>
            {cs.gallery && (
              <div className="mt-10">
                <h3 className="label mb-4">More screens</h3>
                <Shots shots={cs.gallery} aspect="aspect-square" />
              </div>
            )}
          </section>

          {/* The calls I made: product judgment on one side, engineering on the other */}
          <section id="decisions" className={section}>
            <Head n={num("decisions")} title="Decisions that shaped it" />
            <div className="grid gap-10 xl:grid-cols-2 xl:gap-12">
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

          {cs.ai && (
            <section id="ai" className={section}>
              <Head n={num("ai")} title="Where AI fits" lead={cs.ai.intro} />
              <div className="grid gap-4 xl:grid-cols-2">
                {(
                  [
                    ["Built", cs.ai.built, true],
                    ["Next", cs.ai.next, false],
                  ] as const
                ).map(([label, items, built]) => (
                  <Reveal key={label} className={`p-6 sm:p-7 ${card}`}>
                    <h3 className="label flex items-center gap-2">
                      <span
                        aria-hidden
                        className={`h-2 w-2 rounded-full border border-fg ${built ? "bg-fg" : "bg-transparent"}`}
                      />
                      {label}
                    </h3>
                    <ul className="mt-2">
                      {items.map((a) => (
                        <li key={a.title} className="border-b border-line py-4 last:border-b-0 last:pb-0">
                          <p className="font-medium">{a.title}</p>
                          <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{a.text}</p>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          <Reveal as="section" id="stack" className={section}>
            <Head n={num("stack")} title="Built with" />
            <dl className="border-t border-line">
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

          <Reveal as="section" id="next" className={section}>
            <Head n={num("next")} title="What's next" />
            <div className="max-w-[62ch] space-y-5">
              {cs.next.map((p) => (
                <p key={p} className="text-lg leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal className={`p-8 sm:p-12 ${card}`}>
            <p className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Want a walkthrough?</p>
            <p className="mt-3 max-w-[48ch] text-lg text-muted">
              Happy to go deeper on the research, the product calls, the roadmap engine, or anything else.
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
        </div>
      </div>
    </article>
  );
}
