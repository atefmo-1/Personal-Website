import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { CaseStudyToc } from "./CaseStudyToc";
import { CountText } from "./CountText";
import { PhoneFrame } from "./PhoneFrame";
import { Reveal } from "./Reveal";
import { SkillPill } from "./SkillPill";
import { relocoDisplay, relocoSans } from "@/lib/relocoFonts";
import type { CaseStudy as CS, Feature, Layer, Project, Shot } from "@/lib/projects";

// A project page: hero, then nine numbered sections: at a glance, who it's for, research (v0),
// the product, design and iteration, engineering, what I'm measuring, timeline, try it.
// Text lines stay under ~72 characters. Phone frames are the same width within every row.

const card = "rounded-2xl border border-line bg-surface";
const measure = "max-w-[68ch]";
const two = (n: number) => String(n).padStart(2, "0");

function Head({ n, title, intro }: { n: number; title: string; intro?: string }) {
  return (
    <div className="mb-8">
      <p className="font-mono text-xs text-muted">{two(n)}</p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {intro && <p className={`mt-3 text-lg leading-relaxed text-muted ${measure}`}>{intro}</p>}
    </div>
  );
}

// One phone screenshot with a caption that always wraps, never clips.
function ShotFig({ s, sizes }: { s: Shot; sizes: string }) {
  return (
    <figure className="min-w-0">
      <PhoneFrame src={s.src} alt={s.alt} width={s.width} height={s.height} sizes={sizes} />
      <figcaption className="mt-3 text-center text-sm leading-snug text-muted">{s.caption}</figcaption>
    </figure>
  );
}

// A row of phones: side by side from tablet up. Two or four per row on phones.
function PhoneRow({ shots, className = "" }: { shots: Shot[]; className?: string }) {
  const cols = shots.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : shots.length === 3 ? "sm:grid-cols-3" : "grid-cols-2";
  return (
    <div className={`grid items-start gap-5 ${cols} ${className}`}>
      {shots.map((s) => (
        <div key={s.src + s.caption} className="mx-auto w-full max-w-[220px]">
          <ShotFig s={s} sizes="(min-width: 640px) 220px, 45vw" />
        </div>
      ))}
    </div>
  );
}

function FeatureText({ f, n }: { f: Feature; n: string }) {
  const lines = [
    ["What it does", f.what],
    ["Why it matters", f.why],
    ["How I built it", f.how],
  ].filter((l): l is [string, string | string[]] => !!l[1]);
  return (
    <div className={measure}>
      <p className="font-mono text-xs text-muted">{n}</p>
      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">{f.title}</h3>
      <dl className="mt-6 space-y-5">
        {lines.map(([label, text]) => (
          <div key={label}>
            <dt className="label">{label}</dt>
            <dd className="mt-1.5 text-[16px] leading-relaxed">
              {Array.isArray(text) ? (
                <ul className="space-y-1.5">
                  {text.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <span aria-hidden className="text-muted">
                        +
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              ) : (
                text
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// One or two phones beside the text, alternating sides on desktop; phones above text on mobile.
function FeatureBlock({ f, n, i }: { f: Feature; n: string; i: number }) {
  const one = f.shots.length === 1;
  return (
    <Reveal as="article" id={`f-${f.id}`} className="scroll-mt-24">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div
          className={`mx-auto grid w-full items-start gap-4 ${one ? "max-w-[240px] grid-cols-1" : "max-w-[480px] grid-cols-2"} ${i % 2 ? "lg:order-last" : ""}`}
        >
          {f.shots.map((s) => (
            <ShotFig key={s.src + s.caption} s={s} sizes="(min-width: 1024px) 240px, 45vw" />
          ))}
        </div>
        <FeatureText f={f} n={n} />
      </div>
    </Reveal>
  );
}

function ConceptMap({ c }: { c: CS["v0"]["concept"] }) {
  const n = c.stages.length;
  const x = (i: number) => ((i + 0.5) / n) * 100;
  const y = (l: number) => (1 - l) * 100;
  const chip = "rounded-full border border-line px-3 py-1 text-sm";
  const Arrow = () => (
    <span aria-hidden className="text-muted">
      →
    </span>
  );
  return (
    <div className="space-y-8 pt-2">
      <p className={`text-[15px] leading-relaxed text-muted ${measure}`}>{c.summary}</p>
      <div>
        <p className="label">Journey map</p>
        <ol className="mt-4 grid gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {c.stages.map((s, i) => (
            <li key={s.name} className="border-t border-line pt-3">
              <p className="font-mono text-xs text-muted">{two(i + 1)}</p>
              <p className="mt-1 font-medium">{s.name}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{s.doing}</p>
            </li>
          ))}
        </ol>
        <div className="relative mt-6 hidden h-16 lg:block" aria-hidden>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            <polyline
              points={c.stages.map((s, i) => `${x(i)},${y(s.level)}`).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {c.stages.map((s, i) => (
            <span
              key={s.name}
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fg bg-bg"
              style={{ left: `${x(i)}%`, top: `${y(s.level)}%` }}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="label">Task flow</p>
        <ol className="mt-4 flex flex-wrap items-center gap-2">
          {c.flow.steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className={chip}>{s}</span>
              {i < c.flow.steps.length - 1 && <Arrow />}
            </li>
          ))}
        </ol>
        <p className="mt-3 inline-block rounded-md border border-dashed border-fg px-3 py-1 text-sm">{c.flow.decision}</p>
        {(
          [
            ["Yes", c.flow.yes],
            ["No", c.flow.no],
          ] as const
        ).map(([label, steps]) => (
          <div key={label} className="mt-3 flex flex-wrap items-center gap-2">
            <span className="label w-8">{label}</span>
            {steps.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span className={chip}>{s}</span>
                {i < steps.length - 1 && <Arrow />}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Engineering: five stacked layers, each a labeled band with its parts inside. The Engine's parts
// are a sequence, so they read left to right with arrows; the other layers' parts are a set.
function Architecture({ layers }: { layers: Layer[] }) {
  return (
    <figure>
      <figcaption className="label mb-4">Architecture</figcaption>
      <ol className="grid gap-1">
        {layers.map((layer, li) => {
          const sequence = layer.name === "Engine";
          return (
            <li key={layer.name}>
              <div className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-5 sm:p-5">
                <div>
                  <p className="font-mono text-[10px] text-muted">L{li + 1}</p>
                  <p className="font-display text-lg font-bold tracking-tight">{layer.name}</p>
                </div>
                <div className="min-w-0">
                  {layer.note && <p className="mb-3 text-sm leading-snug text-muted">{layer.note}</p>}
                  <ul className={`flex flex-wrap items-stretch gap-2 ${sequence ? "items-center" : ""}`}>
                    {layer.parts.map((p, pi) => (
                      <li key={p.title} className={`flex items-center gap-2 ${p.text && !sequence ? "basis-full sm:basis-[calc(50%-0.25rem)]" : ""}`}>
                        <div
                          className={`h-full w-full rounded-lg border bg-bg px-3 py-2 text-sm ${
                            p.title.startsWith("AI") ? "border-dashed border-line" : "border-line"
                          }`}
                        >
                          <p className="font-medium leading-snug">{p.title}</p>
                          {p.text && <p className="mt-1 text-[13px] leading-snug text-muted">{p.text}</p>}
                        </div>
                        {sequence && pi < layer.parts.length - 2 && (
                          <span aria-hidden className="text-muted">
                            →
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {li < layers.length - 1 && (
                <p aria-hidden className="py-1 text-center text-muted">
                  ↓
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

export function CaseStudy({ project }: { project: Project & { caseStudy: CS } }) {
  const cs = project.caseStudy;
  const sections = [
    { id: "glance", label: "At a glance" },
    { id: "audience", label: "Who it's for" },
    { id: "research", label: "Research (v0)" },
    { id: "product", label: "The product" },
    { id: "design", label: "Design and iteration" },
    { id: "engineering", label: "Engineering" },
    { id: "metrics", label: "What I'm measuring" },
    { id: "timeline", label: "Timeline" },
    { id: "try", label: "Try it" },
  ];
  const num = (id: string) => sections.findIndex((s) => s.id === id) + 1;
  const section = "scroll-mt-24";
  const productN = num("product");
  const eng = cs.engineering;

  return (
    <article className="container-x pb-24 pt-28 sm:pb-32 sm:pt-36">
      <Link href="/projects" className="label transition-colors hover:text-fg">
        <span aria-hidden>← </span>All projects
      </Link>

      {/* Hero: one of the app's paintings with the name set over it, then the summary and actions */}
      <header className="mt-8">
        <div className="relative isolate overflow-hidden rounded-3xl border border-line">
          <Image
            src={cs.hero.src}
            alt={cs.hero.alt}
            width={cs.hero.width}
            height={cs.hero.height}
            priority
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="block aspect-[4/5] h-full w-full object-cover sm:aspect-[16/9]"
          />
          {/* Darken toward the middle so the white type reads on any part of the painting */}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45),rgba(0,0,0,0.15)_70%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <h1 className={`${relocoDisplay.className} text-7xl leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-9xl lg:text-[10rem]`}>
              {/* Reloco's wordmark is lowercase */}
              <span className="lowercase">{project.name}</span>
            </h1>
            <p className={`${relocoSans.className} mt-3 text-sm drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-lg`}>{cs.hero.caption}</p>
          </div>
        </div>

        <p className="mt-8 max-w-[56ch] text-xl leading-snug sm:text-2xl">{cs.oneLiner}</p>
        <p className="mt-4 text-sm text-muted">{cs.metaLine.join(" · ")}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={cs.cta.url} external>
            {cs.cta.label} <span aria-hidden>↗</span>
          </Button>
          <a
            href="#glance"
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-mono text-xs uppercase tracking-label transition-colors hover:border-fg"
          >
            Read the case study <span aria-hidden>↓</span>
          </a>
        </div>
      </header>

      {/* Stats: screen readers hear one sentence per stat; the counter and label are hidden from them */}
      <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cs.numbers.map((n) => (
          <li key={n.label} className={`p-5 ${card}`}>
            <span className="sr-only">{`${n.value} ${n.label}`}</span>
            <span aria-hidden>
              <CountText text={n.value} className="block font-display text-4xl font-bold tracking-tight" />
              <span className="mt-1.5 block text-sm leading-snug text-muted">{n.label}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-20 grid gap-12 sm:mt-28 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <CaseStudyToc items={sections} />
        </aside>

        <div className="min-w-0">
          {/* Mobile: a compact jump menu */}
          <details className="mb-12 rounded-xl border border-line lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium">Jump to</summary>
            <ol className="border-t border-line px-4 py-2">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-3 py-1.5 text-sm text-muted hover:text-fg">
                    <span className="font-mono text-xs">{two(i + 1)}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          <div className="space-y-28 sm:space-y-36">
            {/* 01 At a glance */}
            <section id="glance" className={section}>
              <Head n={num("glance")} title="At a glance" />
              <dl className="grid border-l border-t border-line sm:grid-cols-2 xl:grid-cols-5">
                {cs.glance.map((g) => (
                  <div key={g.label} className="border-b border-r border-line p-5">
                    <dt className="label">{g.label}</dt>
                    <dd className="mt-2 text-[15px] leading-relaxed">{g.text}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* 02 Who it's for: three stretches of the degree. On desktop the text and the phones
                sit on shared rows (subgrid), so the phones line up across the columns. */}
            <section id="audience" className={section}>
              <Head n={num("audience")} title="Who it's for" intro={cs.audience.intro} />
              <div className="grid gap-14 lg:grid-cols-3 lg:grid-rows-[auto_auto] lg:gap-x-8 lg:gap-y-8">
                {cs.audience.groups.map((g) => (
                  <Reveal key={g.title} className="grid gap-6 lg:row-span-2 lg:grid-rows-subgrid">
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight">{g.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed">{g.text}</p>
                    </div>
                    <div className="grid grid-cols-2 items-start gap-4 lg:grid-cols-1">
                      {g.shots.map((s) => (
                        <div key={s.src} className="mx-auto w-full max-w-[200px]">
                          <ShotFig s={s} sizes="(min-width: 1024px) 200px, 45vw" />
                        </div>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* 03 Research (v0) */}
            <section id="research" className={section}>
              <Head n={num("research")} title="Research (v0)" intro={cs.v0.intro} />

              {/* Insights: stacked on phones, a table from tablet up */}
              <ul className="border-t border-line md:hidden">
                {cs.v0.insights.map((r) => (
                  <li key={r.insight} className="space-y-2 border-b border-line py-4 text-[15px]">
                    <p className="font-medium">{r.insight}</p>
                    <p>
                      <span className="font-display">&ldquo;{r.quote}&rdquo;</span>
                      <span className="mt-1 block text-xs text-muted">{r.who}</span>
                    </p>
                    <p className="text-muted">
                      <span className="label mr-2">Ships today</span>
                      {r.today}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="hidden md:block">
                <table className="w-full border-collapse text-left text-[15px]">
                  <caption className="sr-only">Interview insights, the evidence and what ships today</caption>
                  <thead>
                    <tr className="border-b border-fg">
                      {["Insight", "Evidence", "What ships today"].map((h) => (
                        <th key={h} scope="col" className="label py-3 pr-6 font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cs.v0.insights.map((r) => (
                      <tr key={r.insight} className="border-b border-line align-top">
                        <th scope="row" className="w-[22%] py-4 pr-6 font-medium">
                          {r.insight}
                        </th>
                        <td className="w-[38%] py-4 pr-6">
                          <span className="font-display">&ldquo;{r.quote}&rdquo;</span>
                          <span className="mt-1 block text-xs text-muted">{r.who}</span>
                        </td>
                        <td className="py-4 text-muted">{r.today}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="label mt-12">Personas</h3>
              <ul className="mt-4 grid gap-4 md:grid-cols-2">
                {cs.v0.personas.map((p) => (
                  <li key={p.name} className={`p-5 ${card}`}>
                    <p className="font-display text-xl font-bold tracking-tight">{p.name}</p>
                    <p className="label mt-1">{p.archetype}</p>
                    <p className="mt-3 text-[15px] leading-relaxed">{p.summary}</p>
                    <p className="mt-3 text-xs text-muted">
                      {p.tags.join(", ")}. {p.basedOn}.
                    </p>
                  </li>
                ))}
              </ul>

              <details className="group mt-10 border-y border-line">
                <summary className="flex cursor-pointer items-center justify-between py-4 font-medium">
                  v0 concept
                  <span aria-hidden className="text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-8">
                  <ConceptMap c={cs.v0.concept} />
                </div>
              </details>
            </section>

            {/* 04 The product */}
            <section id="product" className={section}>
              <Head n={productN} title="The product" intro={cs.productIntro} />
              <div className="space-y-24 sm:space-y-32">
                {cs.features.map((f, i) => (
                  <FeatureBlock key={f.id} f={f} i={i} n={`${productN}.${i + 1}`} />
                ))}
              </div>

              <div className="mt-24 border-t border-line pt-12">
                <h3 className="font-display text-2xl font-bold tracking-tight">{cs.progress.title}</h3>
                <p className={`mt-2 text-[16px] leading-relaxed text-muted ${measure}`}>{cs.progress.text}</p>
                <PhoneRow shots={cs.progress.shots} className="mt-8" />
              </div>
            </section>

            {/* 05 Design and iteration */}
            <section id="design" className={section}>
              <Head n={num("design")} title="Design and iteration" intro={cs.design.intro} />

              <h3 className="label">Principles</h3>
              <dl className={`mt-3 border-t border-line ${measure}`}>
                {cs.design.principles.map((d) => (
                  <div key={d.title} className="border-b border-line py-3.5 sm:grid sm:grid-cols-[16rem_1fr] sm:gap-6">
                    <dt className="font-medium">{d.title}</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-muted sm:mt-0">{d.text}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="label mt-14">Iterations</h3>
              <ol className="mt-4 space-y-10">
                {cs.design.iterations.map((it, i) => (
                  <li key={it.title} className="grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
                    <div className={`flex gap-4 ${measure}`}>
                      <span className="font-mono text-xs text-muted">{two(i + 1)}</span>
                      <div>
                        <p className="font-medium">{it.title}</p>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{it.text}</p>
                      </div>
                    </div>
                    {it.shots && <PhoneRow shots={it.shots} className="mx-auto w-full max-w-[460px]" />}
                  </li>
                ))}
              </ol>
            </section>

            {/* 06 Engineering */}
            <section id="engineering" className={section}>
              <Head n={num("engineering")} title="Engineering" />
              <div className="grid gap-10">
                <Architecture layers={eng.layers} />
                <div className={measure}>
                  <h3 className="label mb-4">How a plan gets built</h3>
                  <ol className="space-y-3 border-l border-line pl-5 text-[15px] leading-relaxed">
                    {eng.pipeline.map((p, i) => (
                      <li key={p} className="relative">
                        <span className="absolute -left-[2.05rem] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-bg font-mono text-[10px] text-muted">
                          {i + 1}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <p className="sr-only">
                Five layers, top to bottom: content (the task library, the school pack and country data); the engine, a pure
                pipeline from profile to chapters; runtime rules; data (a Store interface over Supabase Postgres with
                row-level security, plus a cookie store for development); and the surfaces students use.
              </p>

              <h3 className="mt-14 font-display text-2xl font-bold tracking-tight">Quality</h3>
              <ul className={`mt-4 space-y-2.5 text-[16px] leading-relaxed ${measure}`}>
                {eng.quality.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden className="text-muted">
                      +
                    </span>
                    {h}
                  </li>
                ))}
              </ul>

              <h3 className="mt-12 font-display text-2xl font-bold tracking-tight">Where AI fits</h3>
              <dl className={`mt-4 space-y-3 text-[15px] leading-relaxed ${measure}`}>
                {(
                  [
                    ["Built", eng.ai.built],
                    ["Next", eng.ai.next],
                    ["Cost control", eng.ai.cost],
                  ] as const
                ).map(([label, text]) => (
                  <div key={label} className="sm:flex sm:gap-4">
                    <dt className="label w-28 shrink-0 pt-0.5">{label}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-12 font-display text-2xl font-bold tracking-tight">Stack</h3>
              <dl className="mt-4 border-t border-line">
                {eng.stack.map((g) => (
                  <div key={g.label} className="grid gap-3 border-b border-line py-4 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-6">
                    <dt className="label">{g.label}</dt>
                    <dd>
                      <ul className="flex flex-wrap gap-1.5">
                        {g.items.map((s) => (
                          <SkillPill key={s.name} skill={s} />
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* 07 What I'm measuring */}
            <section id="metrics" className={section}>
              <Head n={num("metrics")} title="What I'm measuring" />
              <dl className="border-t border-line md:hidden">
                {cs.metrics.rows.map((r) => (
                  <div key={r.metric} className="space-y-1.5 border-b border-line py-4 text-[15px]">
                    <dt className="font-medium">{r.metric}</dt>
                    <dd>{r.definition}</dd>
                    <dd className="text-muted">
                      <span className="label mr-2">Why</span>
                      {r.why}
                    </dd>
                    <dd className="text-muted">
                      <span className="label mr-2">Source</span>
                      {r.source}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="hidden md:block">
                <table className="w-full border-collapse text-left text-[15px]">
                  <thead>
                    <tr className="border-b border-fg">
                      {["Metric", "Definition", "Why it matters", "Source"].map((h) => (
                        <th key={h} scope="col" className="label py-3 pr-6 font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cs.metrics.rows.map((r) => (
                      <tr key={r.metric} className="border-b border-line align-top">
                        <th scope="row" className="py-4 pr-6 font-medium">
                          {r.metric}
                        </th>
                        <td className="py-4 pr-6">{r.definition}</td>
                        <td className="py-4 pr-6 text-muted">{r.why}</td>
                        <td className="py-4 text-muted">{r.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-muted">{cs.metrics.note}</p>
            </section>

            {/* 08 Timeline */}
            <section id="timeline" className={section}>
              <Head n={num("timeline")} title="Timeline" />
              <ol className="relative ml-2 border-l border-line">
                {cs.timeline.map((t) => (
                  <li key={t.phase} className="relative pb-4 pl-7 last:pb-0">
                    <span
                      aria-hidden
                      className={`absolute -left-[7px] top-6 h-3.5 w-3.5 rounded-full border-2 ${
                        t.status === "Completed" ? "border-fg bg-fg" : t.status === "In progress" ? "border-fg bg-bg" : "border-muted bg-bg"
                      }`}
                    />
                    <div className={`grid gap-2 p-5 sm:grid-cols-[5rem_1fr] sm:gap-6 ${card}`}>
                      <p className="font-display text-xl font-bold">{t.phase}</p>
                      <div>
                        <p className="flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-label ${
                              t.status === "Completed"
                                ? "border-fg bg-fg text-bg"
                                : t.status === "In progress"
                                  ? "border-fg"
                                  : "border-dashed border-muted text-muted"
                            }`}
                          >
                            {t.status}
                          </span>
                          {t.date && <span className="font-mono text-xs uppercase tracking-label text-muted">{t.date}</span>}
                        </p>
                        <p className={`mt-2 text-[15px] leading-relaxed ${measure}`}>{t.text}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* 09 Try it */}
            <section id="try" className={`${section} rounded-2xl bg-fg p-8 text-bg sm:p-12`}>
              <p className="font-mono text-xs opacity-70">{two(num("try"))}</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Try it</h2>
              <p className="mt-3 max-w-[52ch] text-lg leading-relaxed opacity-80">{cs.tryIt.text}</p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <a
                  href={cs.tryIt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-bg px-5 py-3 font-mono text-xs uppercase tracking-label text-fg transition-opacity hover:opacity-85"
                >
                  {cs.tryIt.button} <span aria-hidden>↗</span>
                </a>
                <Link href="/contact" className="text-sm underline underline-offset-4 opacity-80 hover:opacity-100">
                  Say hello
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
