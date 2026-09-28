import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { CaseStudyToc } from "./CaseStudyToc";
import { CountText } from "./CountText";
import { PhoneFrame } from "./PhoneFrame";
import { Reveal } from "./Reveal";
import { SkillPill } from "./SkillPill";
import type { CaseStudy as CS, Feature, Project, Shot } from "@/lib/projects";

// A project page: hero, overview, v0, the product today (feature by feature: what, why, how),
// product decisions, engineering, metrics, timeline, contact. Text lines stay under ~72
// characters; cards only for personas, decisions and the timeline.

const card = "rounded-2xl border border-line bg-surface";
const measure = "max-w-[68ch]";

function Head({ n, title, intro }: { n: number; title: string; intro?: string }) {
  return (
    <div className="mb-8">
      <p className="font-mono text-xs text-muted">{String(n).padStart(2, "0")}</p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {intro && <p className={`mt-3 text-lg leading-relaxed text-muted ${measure}`}>{intro}</p>}
    </div>
  );
}

// One screenshot with a caption that always wraps, never clips.
function ShotFig({ s, sizes }: { s: Shot; sizes: string }) {
  return (
    <figure className="min-w-0">
      {s.kind === "phone" ? (
        <PhoneFrame src={s.src} alt={s.alt} width={s.width} height={s.height} sizes={sizes} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line">
          <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes={sizes} className="block h-auto w-full" />
        </div>
      )}
      <figcaption className="mt-3 text-center text-sm leading-snug text-muted">{s.caption}</figcaption>
    </figure>
  );
}

function FeatureBlock({ f, i }: { f: Feature; i: number }) {
  const phones = f.shots.filter((s) => s.kind === "phone");
  const desktops = f.shots.filter((s) => s.kind === "desktop");
  const cols = phones.length >= 3 ? "grid-cols-2 sm:grid-cols-3" : phones.length === 2 ? "grid-cols-2" : "grid-cols-1";
  const lines = [
    ["What it does", f.what],
    ["Why it matters", f.why],
    ["How I built it", f.how],
  ].filter((l): l is [string, string] => !!l[1]);
  return (
    <Reveal as="article" id={`f-${f.id}`} className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
      <div className={`grid gap-6 ${i % 2 ? "lg:order-last" : ""}`}>
        {phones.length > 0 && (
          <div className={`mx-auto grid w-full gap-4 ${cols} ${phones.length === 1 ? "max-w-[260px]" : phones.length === 2 ? "max-w-[480px]" : ""}`}>
            {phones.map((s) => (
              <ShotFig key={s.src} s={s} sizes="(min-width: 1024px) 240px, 45vw" />
            ))}
          </div>
        )}
        {desktops.map((s) => (
          <ShotFig key={s.src} s={s} sizes="(min-width: 1024px) 560px, 100vw" />
        ))}
      </div>
      <div className={measure}>
        <p className="font-mono text-xs text-muted">4.{i + 1}</p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">{f.title}</h3>
        <dl className="mt-6 space-y-5">
          {lines.map(([label, text]) => (
            <div key={label}>
              <dt className="label">{label}</dt>
              <dd className="mt-1.5 text-[16px] leading-relaxed">{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Reveal>
  );
}

function ConceptMap({ c }: { c: CS["v0"]["concept"] }) {
  const n = c.stages.length;
  const x = (i: number) => ((i + 0.5) / n) * 100;
  const y = (l: number) => (1 - l) * 100;
  const chip = "rounded-full border border-line px-3 py-1 text-sm";
  return (
    <div className="space-y-8 pt-6">
      <p className={`text-[15px] leading-relaxed text-muted ${measure}`}>{c.summary}</p>
      <div>
        <p className="label">Journey map: a student&apos;s first week with the v0 concept</p>
        <ol className="mt-4 grid gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {c.stages.map((s, i) => (
            <li key={s.name} className="border-t border-line pt-3">
              <p className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 font-medium">{s.name}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{s.doing}</p>
              <p className="mt-2 text-sm">{s.feeling}</p>
            </li>
          ))}
        </ol>
        <div className="relative mt-6 hidden h-20 lg:block" aria-hidden>
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
              {i < c.flow.steps.length - 1 && <span aria-hidden className="text-muted">→</span>}
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
                {i < steps.length - 1 && <span aria-hidden className="text-muted">→</span>}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Engineering: how the pieces connect, drawn as boxes and arrows.
function Architecture() {
  const box = "rounded-lg border border-line bg-bg px-3 py-2 text-center text-sm";
  const arrow = <span aria-hidden className="text-center text-muted">↓</span>;
  return (
    <figure className={`p-5 sm:p-7 ${card}`}>
      <figcaption className="label">Architecture</figcaption>
      <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="grid gap-2">
          <div className={box}>Profile: about 10 answers</div>
          {arrow}
          <div className={`${box} border-fg font-medium`}>Rules engine (pure function)</div>
          {arrow}
          <div className={box}>Roadmap</div>
          {arrow}
          <div className="grid grid-cols-2 gap-2">
            {["Today", "Journey", "Calendar feed", "Share page"].map((t) => (
              <div key={t} className={box}>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="grid content-start gap-2">
          <div className={`${box} border-fg font-medium`}>Store interface</div>
          {arrow}
          <div className="grid grid-cols-2 gap-2">
            <div className={box}>Cookie store (guests)</div>
            <div className={box}>Supabase Postgres with RLS (accounts)</div>
          </div>
          <p className="mt-2 text-sm leading-snug text-muted">On sign-in, guest progress is imported into the account.</p>
        </div>
      </div>
      <p className="sr-only">
        A profile goes into the rules engine, a pure function, which produces the roadmap. The roadmap feeds Today,
        Journey, the calendar feed and the share page. Data goes through one Store interface, backed by a cookie store for
        guests or Supabase Postgres with row-level security for accounts.
      </p>
    </figure>
  );
}

export function CaseStudy({ project }: { project: Project & { caseStudy: CS } }) {
  const cs = project.caseStudy;
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "v0", label: "v0: Where it started" },
    { id: "product", label: "The product today" },
    { id: "decisions", label: "Product decisions" },
    { id: "engineering", label: "Engineering" },
    { id: "metrics", label: "Metrics" },
    { id: "timeline", label: "Timeline" },
  ];
  const num = (id: string) => sections.findIndex((s) => s.id === id) + 2; // 1 is the hero
  const section = "scroll-mt-24";
  const [khoa, amara] = cs.v0.personas;

  return (
    <article className="container-x pb-24 pt-28 sm:pb-32 sm:pt-36">
      <Link href="/projects" className="label transition-colors hover:text-fg">
        <span aria-hidden>← </span>All projects
      </Link>

      {/* 1. Hero */}
      <header className="mt-8">
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">{project.name}</h1>
        <p className="mt-4 max-w-[40ch] text-xl leading-snug sm:text-2xl">{cs.oneLiner}</p>
        <p className="mt-4 text-sm text-muted">{cs.metaLine.join(" · ")}</p>
        <div className="mt-7">
          <Button href={cs.cta.url} external>
            {cs.cta.label} <span aria-hidden>↗</span>
          </Button>
        </div>
      </header>

      <figure className="mt-10 overflow-hidden rounded-2xl border border-line sm:mt-14">
        <Image
          src={cs.hero.src}
          alt={cs.hero.alt}
          width={cs.hero.width}
          height={cs.hero.height}
          priority
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="block h-auto w-full"
        />
      </figure>

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
          <CaseStudyToc items={sections} start={2} />
        </aside>

        <div className="min-w-0">
          {/* Mobile: a compact jump menu */}
          <details className="mb-12 rounded-xl border border-line lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium">Jump to</summary>
            <ol className="border-t border-line px-4 py-2">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-3 py-1.5 text-sm text-muted hover:text-fg">
                    <span className="font-mono text-xs">{String(i + 2).padStart(2, "0")}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          <div className="space-y-28 sm:space-y-36">
            {/* 2. Overview */}
            <section id="overview" className={section}>
              <Head n={num("overview")} title="Overview" />
              <div className={`space-y-6 ${measure}`}>
                <div>
                  <h3 className="label">The problem</h3>
                  <p className="mt-2 text-lg leading-relaxed">{cs.overview.problem}</p>
                </div>
                <div>
                  <h3 className="label">What I built</h3>
                  <p className="mt-2 text-lg leading-relaxed">{cs.overview.built}</p>
                </div>
              </div>
            </section>

            {/* 3. v0 */}
            <section id="v0" className={section}>
              <Head n={num("v0")} title="v0: Where it started" intro={cs.v0.intro} />

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
                {[khoa, amara].map((p) => (
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
                  v0 concept: journey map and task flow
                  <span aria-hidden className="text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="pb-8">
                  <ConceptMap c={cs.v0.concept} />
                </div>
              </details>
            </section>

            {/* 4. The product today */}
            <section id="product" className={section}>
              <Head
                n={num("product")}
                title="The product today"
                intro="Each feature: what it does, why it matters, and how I built it."
              />
              <div className="space-y-24 sm:space-y-32">
                {cs.features.map((f, i) => (
                  <FeatureBlock key={f.id} f={f} i={i} />
                ))}
              </div>
              {cs.landingStrip && (
                <div className="mt-24 border-t border-line pt-10">
                  <p className="text-lg">{cs.landingStrip.caption}</p>
                  <div className="mt-6 grid gap-5 md:grid-cols-3">
                    {cs.landingStrip.shots.map((s) => (
                      <ShotFig key={s.src} s={s} sizes="(min-width: 768px) 30vw, 100vw" />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 5. Product decisions */}
            <section id="decisions" className={section}>
              <Head n={num("decisions")} title="Product decisions" intro="What I chose, what I turned down, and why." />
              <ul className="grid gap-4 md:grid-cols-2">
                {cs.decisions.map((d) => (
                  <li key={d.decision} className={`p-5 ${card}`}>
                    <p className="font-medium">{d.decision}</p>
                    <dl className="mt-3 space-y-2 text-[15px]">
                      <div className="flex gap-2">
                        <dt className="label w-20 shrink-0 pt-0.5">Rejected</dt>
                        <dd className="text-muted">{d.rejected}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="label w-20 shrink-0 pt-0.5">Why</dt>
                        <dd>{d.why}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </section>

            {/* 6. Engineering */}
            <section id="engineering" className={section}>
              <Head n={num("engineering")} title="Engineering" />
              <Architecture />
              <ul className={`mt-8 grid gap-x-8 gap-y-2 text-[15px] sm:grid-cols-2 ${measure}`}>
                {cs.engineering.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden className="text-muted">+</span>
                    {b}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {cs.engineering.stack.map((s) => (
                  <SkillPill key={s.name} skill={s} />
                ))}
              </ul>

              <h3 className="mt-14 font-display text-2xl font-bold tracking-tight">Where AI fits</h3>
              <div className={`mt-4 space-y-3 text-[15px] leading-relaxed ${measure}`}>
                <p>
                  <span className="label mr-2">Built</span>
                  {cs.engineering.ai.built.join(" ")}
                </p>
                <p>
                  <span className="label mr-2">Next (v1.1)</span>
                  {cs.engineering.ai.next.join(" ")}
                </p>
                <p>
                  <span className="label mr-2">Cost control</span>
                  {cs.engineering.ai.cost}
                </p>
              </div>
            </section>

            {/* 7. Metrics */}
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

            {/* 8. Timeline */}
            <section id="timeline" className={section}>
              <Head n={num("timeline")} title="Timeline" />
              <ol className="grid gap-3">
                {cs.timeline.map((t) => (
                  <li key={t.phase} className={`grid gap-2 p-5 sm:grid-cols-[6rem_1fr] sm:gap-6 ${card}`}>
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
                  </li>
                ))}
              </ol>
            </section>

            {/* 9. Contact */}
            <section className={`p-8 sm:p-12 ${card}`}>
              <h2 className="font-display text-3xl font-bold tracking-tight">Want a walkthrough?</h2>
              <p className={`mt-3 text-lg text-muted ${measure}`}>
                I can walk through the research, the rules engine or any decision on this page.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/contact">
                  Say hello <span aria-hidden>→</span>
                </Button>
                <Button href={cs.cta.url} external variant="ghost">
                  {cs.cta.label} <span aria-hidden>↗</span>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
