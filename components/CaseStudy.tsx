import Image from "next/image";
import Link from "next/link";
import { CaseStudyToc } from "./CaseStudyToc";
import { PhoneFrame } from "./PhoneFrame";
import { Reveal } from "./Reveal";
import { SkillPill } from "./SkillPill";
import { relocoDisplay, relocoSans } from "@/lib/relocoFonts";
import type {
  CaseStudy as CS,
  Feature,
  Layer,
  Persona,
  Project,
  Shot,
} from "@/lib/projects";

// A project page: hero, then nine numbered sections: at a glance, who it's for, research (v0),
// the product, design, engineering, what I'm measuring, timeline, try it.
// Design rules: one level of containment (no boxes inside cards), cards only for real objects
// (personas, timeline entries), one card style, nothing smaller than 13px, ~65-character lines.

const card = "rounded-[20px] border border-line bg-surface p-7 sm:p-8";
const cap = "font-mono text-[13px] uppercase tracking-label text-muted";
const measure = "max-w-[65ch]";
const two = (n: number) => String(n).padStart(2, "0");
// Reloco's brand blue, used only for the one turning point on the journey curve.
const accent = "#4B9CD3";

// Renders `code` in monospace and **numbers** in bold, so figures live inside sentences.
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("`") ? (
          <code
            key={i}
            className="rounded bg-line/40 px-1 py-0.5 font-mono text-[0.9em]"
          >
            {part.slice(1, -1)}
          </code>
        ) : part.startsWith("**") ? (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Head({
  n,
  title,
  intro,
}: {
  n: number;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-10">
      <p className="font-mono text-[13px] text-muted">{two(n)}</p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {intro && (
        <p className={`mt-3 text-[17px] leading-relaxed text-muted ${measure}`}>
          {intro}
        </p>
      )}
    </div>
  );
}

// One phone screenshot with a caption that always wraps, never clips.
function ShotFig({ s, sizes }: { s: Shot; sizes: string }) {
  return (
    <figure className="min-w-0">
      <PhoneFrame
        src={s.src}
        alt={s.alt}
        width={s.width}
        height={s.height}
        sizes={sizes}
      />
      <figcaption className="mt-3 text-center text-[14px] leading-snug text-muted">
        {s.caption}
      </figcaption>
    </figure>
  );
}

function FeatureText({ f, n }: { f: Feature; n: string }) {
  const lines = [
    ["What it does", f.what],
    ["Why it matters", f.why],
    ["How I built it", f.how],
  ].filter((l): l is [string, string | string[]] => !!l[1]);
  return (
    <div className="max-w-[460px]">
      <p className="font-mono text-[13px] text-muted">{n}</p>
      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {f.title}
      </h3>
      <dl className="mt-7 space-y-6">
        {lines.map(([label, text]) => (
          <div key={label}>
            <dt className={cap}>{label}</dt>
            <dd className="mt-3 text-[16px] leading-relaxed">
              {Array.isArray(text) ? (
                <ul className="space-y-2">
                  {text.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <span aria-hidden className="text-muted">
                        +
                      </span>
                      <span>
                        <Rich text={t} />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Rich text={text} />
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// One or two phones beside the text (max 460px) on wide screens, alternating sides. Below that,
// and for three phones, the text sits above a row of phones so each keeps a readable size.
// On phones, a three-screen row scrolls sideways with snap points; captions stay whole.
function FeatureBlock({ f, n, i }: { f: Feature; n: string; i: number }) {
  const count = f.shots.length;
  const phones =
    count >= 3 ? (
      <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
        {f.shots.map((s) => (
          <div
            key={s.src + s.caption}
            className="w-[240px] shrink-0 snap-center md:mx-auto md:w-full md:max-w-[290px]"
          >
            <ShotFig s={s} sizes="(min-width: 768px) 290px, 240px" />
          </div>
        ))}
      </div>
    ) : (
      <div
        className={`mx-auto grid w-full items-start gap-5 ${count === 1 ? "max-w-[300px] grid-cols-1" : "max-w-[620px] grid-cols-2"}`}
      >
        {f.shots.map((s) => (
          <ShotFig
            key={s.src + s.caption}
            s={s}
            sizes="(min-width: 1024px) 300px, 45vw"
          />
        ))}
      </div>
    );
  if (count >= 3)
    return (
      <Reveal as="article" id={`f-${f.id}`} className="scroll-mt-24">
        <FeatureText f={f} n={n} />
        <div className="mt-10">{phones}</div>
      </Reveal>
    );
  return (
    <Reveal as="article" id={`f-${f.id}`} className="scroll-mt-24">
      <div
        className={`grid items-center gap-10 2xl:gap-14 ${
          i % 2
            ? "2xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]"
            : "2xl:grid-cols-[minmax(0,1fr)_minmax(0,460px)]"
        }`}
      >
        <div
          className={`order-last ${i % 2 ? "2xl:order-last" : "2xl:order-first"}`}
        >
          {phones}
        </div>
        <FeatureText f={f} n={n} />
      </div>
    </Reveal>
  );
}

function PersonaCard({
  p,
  scales,
}: {
  p: Persona;
  scales: CS["v0"]["traitScales"];
}) {
  return (
    <li className={`flex flex-col ${card}`}>
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fg font-display text-xl font-bold text-bg"
        >
          {p.initials}
        </span>
        <div>
          <p className="font-display text-xl font-bold tracking-tight">
            {p.name}
          </p>
          <p className={cap}>{p.archetype}</p>
        </div>
      </div>
      <p className="mt-4 text-[15px] text-muted">{p.background}</p>
      <blockquote className="mt-5 font-display text-xl italic leading-snug">
        &ldquo;{p.quote}&rdquo;
      </blockquote>
      <p className="mt-4 text-[16px] leading-relaxed">{p.how}</p>

      <div className="mt-6 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
        {(
          [
            ["Goals", p.goals, "+"],
            ["Frustrations", p.frustrations, "−"],
          ] as const
        ).map(([label, items, mark]) => (
          <div key={label}>
            <p className={cap}>{label}</p>
            <ul className="mt-3 space-y-2 text-[15px] leading-snug">
              {items.map((g) => (
                <li key={g} className="flex gap-2">
                  <span aria-hidden className="text-muted">
                    {mark}
                  </span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-line pt-6">
        <p className={cap}>Traits</p>
        <ul className="mt-4 space-y-4">
          {scales.map((sc, i) => (
            <li key={sc.left}>
              <div className="flex justify-between gap-3 text-[13px] text-muted">
                <span>{sc.left}</span>
                <span className="text-right">{sc.right}</span>
              </div>
              <div className="relative mt-2 h-3" aria-hidden>
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
                <span
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg"
                  style={{ left: `${p.traits[i] * 100}%` }}
                />
              </div>
              <span className="sr-only">
                {p.traits[i] < 0.5
                  ? `Leans ${sc.left.toLowerCase()}`
                  : `Leans ${sc.right.toLowerCase()}`}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-6">
        <div className="border-t border-line pt-5">
          <p className={cap}>What Reloco gives them</p>
          <p className="mt-2 text-[16px] leading-relaxed">{p.gives}</p>
        </div>
      </div>
    </li>
  );
}

// The v0 journey: stage columns, then an emotion curve with labeled points and a y-axis.
function ConceptMap({ c }: { c: CS["v0"]["concept"] }) {
  const n = c.stages.length;
  const x = (i: number) => ((i + 0.5) / n) * 100;
  const y = (l: number) => (1 - l) * 100;
  const chip = "rounded-full border border-line px-3 py-1 text-[14px]";
  const dip = c.stages.find((s) => s.turningPoint);
  const Arrow = () => (
    <span aria-hidden className="text-muted">
      →
    </span>
  );
  return (
    <div className="space-y-12">
      <p className={`text-[16px] leading-relaxed text-muted ${measure}`}>
        {c.summary}
      </p>

      <div>
        <ol className="grid gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-0">
          {c.stages.map((s, i) => (
            <li key={s.name} className="border-t border-line pt-3 lg:px-2 lg:text-center">
              <p className="font-mono text-[13px] text-muted">{two(i + 1)}</p>
              <p className="mt-1 font-medium">{s.name}</p>
              <p className="mt-1 text-[14px] leading-snug text-muted">
                {s.doing}
              </p>
            </li>
          ))}
        </ol>

        <p className={`${cap} mt-10`}>How Amara felt at each stage</p>
        <div className="mt-4">
          {/* Same width as the stage columns above, so each point sits under its stage */}
          <div
            className="relative h-56 border-b border-l border-line sm:h-64"
            aria-hidden
          >
            <span className="absolute left-2 top-0 text-[13px] text-muted">
              Confident
            </span>
            <span className="absolute bottom-1 left-2 text-[13px] text-muted">
              Frustrated
            </span>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              <polyline
                points={c.stages
                  .map((s, i) => `${x(i)},${y(s.level)}`)
                  .join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {c.stages.map((s, i) => (
              <div
                key={s.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x(i)}%`, top: `${y(s.level)}%` }}
              >
                <span
                  className="block h-3.5 w-3.5 rounded-full border-2"
                  style={
                    s.turningPoint
                      ? { background: accent, borderColor: accent }
                      : undefined
                  }
                >
                  {!s.turningPoint && (
                    <span className="block h-full w-full rounded-full bg-fg" />
                  )}
                </span>
                <span
                  className={`absolute left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[13px] font-medium sm:block ${
                    s.turningPoint ? "top-5" : "bottom-5"
                  }`}
                  style={s.turningPoint ? { color: accent } : undefined}
                >
                  {s.feeling}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* On phones the emotion words sit in a list under the chart */}
        <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-[14px] sm:hidden">
          {c.stages.map((s) => (
            <li
              key={s.name}
              style={s.turningPoint ? { color: accent } : undefined}
            >
              {s.name}: {s.feeling}
            </li>
          ))}
        </ol>
        <p className="sr-only">
          {c.stages.map((s) => `${s.name}: ${s.feeling}`).join(", ")}.
        </p>
        {dip && (
          <p
            className={`mt-6 flex gap-3 text-[15px] leading-relaxed ${measure}`}
          >
            <span
              aria-hidden
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: accent }}
            />
            <span>
              <span className="font-medium">{dip.name}.</span>{" "}
              {dip.turningPoint}
            </span>
          </p>
        )}
      </div>

      <div>
        <p className={cap}>Task flow</p>
        <ol className="mt-4 flex flex-wrap items-center gap-2">
          {c.flow.steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className={chip}>{s}</span>
              {i < c.flow.steps.length - 1 && <Arrow />}
            </li>
          ))}
        </ol>
        <p className="mt-3 inline-block rounded-md border border-dashed border-fg px-3 py-1 text-[14px]">
          {c.flow.decision}
        </p>
        {(
          [
            ["Yes", c.flow.yes],
            ["No", c.flow.no],
          ] as const
        ).map(([label, steps]) => (
          <div key={label} className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`${cap} w-10`}>{label}</span>
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

// Engineering: five full-width rows (label and purpose on the left, parts as plain text on the
// right) joined by thin connectors. The Engine row is a pipeline of pills.
function Architecture({ layers }: { layers: Layer[] }) {
  return (
    <figure>
      <figcaption className={`${cap} mb-5`}>Architecture</figcaption>
      <ol className="border-t border-line">
        {layers.map((layer, li) => (
          <li key={layer.name}>
            <div className="grid gap-4 border-b border-line py-6 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8">
              <div>
                <p className="font-mono text-[13px] text-muted">L{li + 1}</p>
                <p className="font-display text-xl font-bold tracking-tight">
                  {layer.name}
                </p>
                <p className="mt-1 text-[14px] leading-snug text-muted">
                  {layer.purpose}
                </p>
              </div>
              <div className="min-w-0 text-[15px] leading-relaxed">
                {layer.pipeline ? (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
                    {layer.pipeline.map((step, i) => (
                      <span key={step} className="flex items-center gap-2">
                        <span className="rounded-full border border-fg/60 px-3.5 py-1.5 text-[14px] font-medium">
                          {step}
                        </span>
                        {i < layer.pipeline!.length - 1 && (
                          <span aria-hidden className="text-muted">
                            →
                          </span>
                        )}
                      </span>
                    ))}
                    {layer.aside && (
                      <span className="flex items-center gap-2 sm:ml-4">
                        <span aria-hidden className="text-muted">
                          +
                        </span>
                        <span className="rounded-full border border-dashed border-line px-3.5 py-1.5 text-[14px]">
                          {layer.aside}{" "}
                          <span className="text-muted">
                            (optional, notes only)
                          </span>
                        </span>
                      </span>
                    )}
                  </div>
                ) : layer.parts && layer.parts.every((p) => p.length < 60) ? (
                  <p>
                    {layer.parts.map((p, i) => (
                      <span key={p}>
                        {i > 0 && (
                          <span aria-hidden className="mx-2 text-muted">
                            ·
                          </span>
                        )}
                        <Rich text={p} />
                      </span>
                    ))}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {layer.parts?.map((p) => (
                      <li key={p}>
                        <Rich text={p} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {li < layers.length - 1 && (
              <div
                aria-hidden
                className="flex flex-col items-center py-1 text-muted"
              >
                <span className="h-3 w-px bg-line" />
                <span className="text-[13px] leading-none">↓</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function CaseStudy({
  project,
}: {
  project: Project & { caseStudy: CS };
}) {
  const cs = project.caseStudy;
  const sections = [
    { id: "glance", label: "At a glance" },
    { id: "audience", label: "Who it's for" },
    { id: "research", label: "Research (v0)" },
    { id: "shifts", label: "From concept to v1" },
    { id: "product", label: "The product" },
    { id: "design", label: "Design" },
    { id: "engineering", label: "Engineering" },
    { id: "metrics", label: "What I'm measuring" },
    { id: "timeline", label: "Timeline" },
    { id: "try", label: "Try it" },
  ];
  const num = (id: string) => sections.findIndex((s) => s.id === id) + 1;
  const section = "scroll-mt-24";
  const productN = num("product");
  const eng = cs.engineering;
  const [problem, solution, ...meta] = cs.glance;

  return (
    <article className="container-x pb-24 pt-28 sm:pb-32 sm:pt-36">
      <Link
        href="/projects"
        className={`${cap} transition-colors hover:text-fg`}
      >
        <span aria-hidden>← </span>All projects
      </Link>

      {/* Hero: one of the app's paintings with the name set over it, then the summary and actions */}
      <header className="mt-8">
        <div className="relative isolate overflow-hidden rounded-[20px] border border-line">
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
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45),rgba(0,0,0,0.15)_70%)]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <h1
              className={`${relocoDisplay.className} text-7xl leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-9xl lg:text-[10rem]`}
            >
              {/* Reloco's wordmark is lowercase */}
              <span className="lowercase">{project.name}</span>
            </h1>
            <p
              className={`${relocoSans.className} mt-3 text-[15px] drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-lg`}
            >
              {cs.hero.caption}
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-[60ch] text-xl leading-snug sm:text-2xl">
          {cs.oneLiner}
        </p>
        <p className="mt-4 text-[15px] text-muted">{cs.metaLine.join(" · ")}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={cs.cta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 font-mono text-[13px] uppercase tracking-label text-bg transition-colors hover:bg-fg/80"
          >
            {cs.cta.label} <span aria-hidden>↗</span>
          </a>
          <a
            href="#glance"
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-mono text-[13px] uppercase tracking-label transition-colors hover:border-fg"
          >
            Read the case study <span aria-hidden>↓</span>
          </a>
        </div>
      </header>

      {/* From "At a glance" on: a sticky "On this page" sidebar on desktop; phones read top to bottom */}
      <div className="mt-28 grid gap-12 sm:mt-36 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <CaseStudyToc items={sections} />
        </aside>

        <div className="min-w-0">
          <div className="space-y-28 sm:space-y-[140px]">
            {/* 01 At a glance: two big statements, then a thin meta row */}
            <section id="glance" className={section}>
              <Head n={num("glance")} title="At a glance" />
              <dl className="grid gap-10 md:grid-cols-2 md:gap-12">
                {[problem, solution].map((g) => (
                  <div key={g.label}>
                    <dt className={cap}>{g.label}</dt>
                    <dd className="mt-3 text-[20px] leading-snug sm:text-[22px]">
                      <Rich text={g.text} />
                    </dd>
                  </div>
                ))}
              </dl>
              <dl className="mt-10 grid gap-6 border-t border-line pt-6 md:grid-cols-3 md:gap-10">
                {meta.map((g) => (
                  <div key={g.label}>
                    <dt className={cap}>{g.label}</dt>
                    <dd className="mt-2 text-[15px] leading-relaxed">
                      {g.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* 02 Who it's for: three stretches of the degree, one large phone each. On desktop the
                text and the phones sit on shared rows (subgrid) so the phones line up. */}
            <section id="audience" className={section}>
              <Head
                n={num("audience")}
                title="Who it's for"
                intro={cs.audience.intro}
              />
              <div className="grid gap-16 lg:grid-cols-3 lg:grid-rows-[auto_auto] lg:gap-x-10 lg:gap-y-8">
                {cs.audience.groups.map((g) => (
                  <Reveal
                    key={g.title}
                    className="grid gap-7 lg:row-span-2 lg:grid-rows-subgrid"
                  >
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight">
                        {g.title}
                      </h3>
                      <p className="mt-2 text-[16px] leading-relaxed">
                        <Rich text={g.text} />
                      </p>
                    </div>
                    <div className="mx-auto w-full max-w-[290px]">
                      <ShotFig
                        s={g.shots[0]}
                        sizes="(min-width: 1024px) 290px, 80vw"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* 03 Research (v0) */}
            <section id="research" className={section}>
              <Head
                n={num("research")}
                title="Research (v0)"
                intro={cs.v0.intro}
              />

              {/* Insights: stacked on phones, a table from tablet up */}
              <ul className="border-t border-line md:hidden">
                {cs.v0.insights.map((r) => (
                  <li
                    key={r.insight}
                    className="space-y-2 border-b border-line py-4 text-[15px]"
                  >
                    <p className="text-[16px] font-medium">{r.insight}</p>
                    <p>
                      <span className="font-display">
                        &ldquo;{r.quote}&rdquo;
                      </span>
                      <span className="mt-1 block text-[13px] text-muted">
                        {r.who}
                      </span>
                    </p>
                    <p className="text-muted">
                      <span className={`${cap} mr-2`}>Ships today</span>
                      {r.today}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="hidden md:block">
                <table className="w-full border-collapse text-left text-[15px]">
                  <caption className="sr-only">
                    Interview insights, the evidence and what ships today
                  </caption>
                  <thead>
                    <tr className="border-b border-fg">
                      {["Insight", "Evidence", "What ships today"].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className={`${cap} py-3 pr-6 font-normal`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cs.v0.insights.map((r) => (
                      <tr
                        key={r.insight}
                        className="border-b border-line align-top"
                      >
                        <th
                          scope="row"
                          className="w-[22%] py-4 pr-6 text-[16px] font-medium"
                        >
                          {r.insight}
                        </th>
                        <td className="w-[38%] py-4 pr-6">
                          <span className="font-display">
                            &ldquo;{r.quote}&rdquo;
                          </span>
                          <span className="mt-1 block text-[13px] text-muted">
                            {r.who}
                          </span>
                        </td>
                        <td className="py-4 text-muted">{r.today}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="mt-16 font-display text-2xl font-bold tracking-tight">
                Personas
              </h3>
              <ul className="mt-6 grid items-stretch gap-6 lg:grid-cols-2">
                {cs.v0.personas.map((p) => (
                  <PersonaCard key={p.name} p={p} scales={cs.v0.traitScales} />
                ))}
              </ul>

              <h3 className="mt-16 font-display text-2xl font-bold tracking-tight">
                v0 concept: Amara&apos;s first week
              </h3>
              <div className="mt-6">
                <ConceptMap c={cs.v0.concept} />
              </div>
            </section>

            {/* From concept to v1: the bridge between the research and the product */}
            <section id="shifts" className={section}>
              <Head
                n={num("shifts")}
                title="From concept to v1"
                intro={cs.shifts.intro}
              />
              <div className="hidden border-t border-fg md:grid md:grid-cols-[1fr_1.2fr_1.3fr] md:gap-8">
                {["v0", "v1", "Why"].map((h) => (
                  <p key={h} className={`${cap} py-3`}>
                    {h}
                  </p>
                ))}
              </div>
              <ol className="border-t border-line md:border-t-0">
                {cs.shifts.rows.map((r) => (
                  <li
                    key={r.v0}
                    className="grid gap-2 border-b border-line py-5 md:grid-cols-[1fr_1.2fr_1.3fr] md:gap-8"
                  >
                    <p className="text-[15px] text-muted">
                      <span className={`${cap} mr-2 md:hidden`}>v0</span>
                      <span className="line-through decoration-line">
                        {r.v0}
                      </span>
                    </p>
                    <p className="text-[16px] font-medium">
                      <span className={`${cap} mr-2 md:hidden`}>v1</span>
                      {r.v1}
                    </p>
                    <p className="text-[15px] leading-relaxed text-muted">
                      <span className={`${cap} mr-2 md:hidden`}>Why</span>
                      {r.why}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* 04 The product */}
            <section id="product" className={section}>
              <Head n={productN} title="The product" intro={cs.productIntro} />
              <div className="space-y-28 sm:space-y-36">
                {cs.features.map((f, i) => (
                  <FeatureBlock
                    key={f.id}
                    f={f}
                    i={i}
                    n={`${productN}.${i + 1}`}
                  />
                ))}
              </div>

              <div className="mt-28 border-t border-line pt-12">
                <h3 className="font-display text-2xl font-bold tracking-tight">
                  {cs.progress.title}
                </h3>
                <p
                  className={`mt-2 text-[16px] leading-relaxed text-muted ${measure}`}
                >
                  {cs.progress.text}
                </p>
                <div className="mt-10 grid grid-cols-2 items-start gap-5 2xl:grid-cols-4">
                  {cs.progress.shots.map((s) => (
                    <div key={s.src} className="mx-auto w-full max-w-[270px]">
                      <ShotFig s={s} sizes="(min-width: 768px) 270px, 45vw" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 05 Design */}
            <section id="design" className={section}>
              <Head n={num("design")} title="Design" intro={cs.design.intro} />
              <dl className="border-t border-line">
                {cs.design.principles.map((d, i) => (
                  <div
                    key={d.title}
                    className="grid gap-2 border-b border-line py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-10"
                  >
                    <dt className="flex gap-4 text-[17px] font-medium">
                      <span className="font-mono text-[13px] font-normal text-muted">
                        {two(i + 1)}
                      </span>
                      {d.title}
                    </dt>
                    <dd className="text-[15px] leading-relaxed text-muted md:pl-0">
                      {d.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* 06 Engineering */}
            <section id="engineering" className={section}>
              <Head n={num("engineering")} title="Engineering" />
              <Architecture layers={eng.layers} />
              <p className="sr-only">
                Five layers, top to bottom: content (the task library, the
                school pack and country data); the engine, a pure pipeline from
                profile to chapters; runtime rules; data (a Store interface over
                Supabase Postgres with row-level security, plus a cookie store
                for development); and the surfaces students use.
              </p>

              <div className={`mt-12 ${measure}`}>
                <h3 className="font-display text-2xl font-bold tracking-tight">
                  Quality
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed">
                  <Rich text={eng.quality} />
                </p>
              </div>

              <div className={`mt-14 ${measure}`}>
                <h3 className="font-display text-2xl font-bold tracking-tight">
                  How a plan gets built
                </h3>
                <ol className="mt-5 space-y-2.5 text-[16px] leading-relaxed">
                  {eng.pipeline.map((p, i) => (
                    <li key={p} className="flex gap-4">
                      <span className="w-5 shrink-0 font-mono text-[13px] leading-[1.7] text-muted">
                        {i + 1}
                      </span>
                      {p}
                    </li>
                  ))}
                </ol>
              </div>

              <h3 className="mt-14 font-display text-2xl font-bold tracking-tight">
                Stack
              </h3>
              <dl className="mt-4 border-t border-line">
                {eng.stack.map((g) => (
                  <div
                    key={g.label}
                    className="grid gap-3 border-b border-line py-4 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-6"
                  >
                    <dt className={cap}>{g.label}</dt>
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
                  <div
                    key={r.metric}
                    className="space-y-1.5 border-b border-line py-4 text-[15px]"
                  >
                    <dt className="text-[16px] font-medium">{r.metric}</dt>
                    <dd>{r.definition}</dd>
                    <dd className="text-muted">
                      <span className={`${cap} mr-2`}>Why</span>
                      {r.why}
                    </dd>
                    <dd className="text-muted">
                      <span className={`${cap} mr-2`}>Source</span>
                      {r.source}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="hidden md:block">
                <table className="w-full border-collapse text-left text-[15px]">
                  <thead>
                    <tr className="border-b border-fg">
                      {["Metric", "Definition", "Why it matters", "Source"].map(
                        (h) => (
                          <th
                            key={h}
                            scope="col"
                            className={`${cap} py-3 pr-6 font-normal`}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {cs.metrics.rows.map((r) => (
                      <tr
                        key={r.metric}
                        className="border-b border-line align-top"
                      >
                        <th
                          scope="row"
                          className="py-4 pr-6 text-[16px] font-medium"
                        >
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
              <p className="mt-4 text-[14px] text-muted">{cs.metrics.note}</p>
            </section>

            {/* 08 Timeline */}
            <section id="timeline" className={section}>
              <Head n={num("timeline")} title="Timeline" />
              <ol className="grid gap-4">
                {cs.timeline.map((t) => (
                  <li
                    key={t.phase}
                    className={`grid gap-3 sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6 ${card}`}
                  >
                    <p className="font-display text-3xl font-bold tracking-tight">
                      {t.phase}
                    </p>
                    <div>
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[13px] uppercase tracking-label ${
                          t.status === "Completed"
                            ? "border-fg bg-fg text-bg"
                            : t.status === "In progress"
                              ? "border-fg"
                              : "border-dashed border-muted text-muted"
                        }`}
                      >
                        {t.status}
                      </span>
                      <p
                        className={`mt-3 text-[16px] leading-relaxed ${measure}`}
                      >
                        {t.text}
                      </p>
                    </div>
                    <p className="font-mono text-[13px] uppercase tracking-label text-muted sm:text-right">
                      {t.date ?? ""}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* 09 Try it */}
            <section
              id="try"
              className={`${section} rounded-[20px] bg-fg p-8 text-bg sm:p-12`}
            >
              <p className="font-mono text-[13px] opacity-70">
                {two(num("try"))}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Try it
              </h2>
              <p className="mt-3 max-w-[52ch] text-lg leading-relaxed opacity-80">
                {cs.tryIt.text}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <a
                  href={cs.tryIt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-bg px-5 py-3 font-mono text-[13px] uppercase tracking-label text-fg transition-opacity hover:opacity-85"
                >
                  {cs.tryIt.button} <span aria-hidden>↗</span>
                </a>
                <Link
                  href="/contact"
                  className="text-[15px] underline underline-offset-4 opacity-80 hover:opacity-100"
                >
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
