import { Reveal } from "./Reveal";
import type { CaseStudy, Persona } from "@/lib/projects";

// UX research artifacts on a case study page: personas with a spectrum chart, and a journey map
// with its emotional curve, task flow and design principles. Drawn in the site's own style
// (text color only), with filled vs hollow markers telling the two personas apart.

const card = "rounded-2xl border border-line bg-surface";

function Marker({ filled, className = "" }: { filled: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-3 w-3 shrink-0 rounded-full border-2 border-fg ${filled ? "bg-fg" : "bg-bg"} ${className}`}
    />
  );
}

function PersonaCard({ p, filled }: { p: Persona; filled: boolean }) {
  return (
    <Reveal as="li" className={`flex flex-col p-6 sm:p-7 ${card}`}>
      <div className="flex items-center gap-2.5">
        <Marker filled={filled} />
        <h3 className="font-display text-2xl font-bold tracking-tight">{p.name}</h3>
      </div>
      <p className="label mt-2">{p.archetype}</p>
      <p className="mt-4 text-[15px] leading-relaxed">{p.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {p.tags.map((t) => (
          <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-5 grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
        {(
          [
            ["Goals", p.goals],
            ["Frustrations", p.frustrations],
          ] as const
        ).map(([label, items]) => (
          <div key={label}>
            <h4 className="label">{label}</h4>
            <ul className="mt-2 space-y-1.5 text-sm leading-snug text-muted">
              {items.map((g) => (
                <li key={g} className="flex gap-2">
                  <span aria-hidden>{label === "Goals" ? "+" : "−"}</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-auto pt-5 text-xs text-muted">{p.basedOn}</p>
    </Reveal>
  );
}

export function Personas({ data }: { data: NonNullable<CaseStudy["personas"]> }) {
  const [a, b] = data.people;
  const first = (name: string) => name.split(" ").pop();
  const lean = (v: number, left: string, right: string) =>
    v < 0.4 ? `leans ${left.toLowerCase()}` : v > 0.6 ? `leans ${right.toLowerCase()}` : "sits in the middle";
  return (
    <>
      <ul className="grid gap-4 md:grid-cols-2">
        <PersonaCard p={a} filled />
        <PersonaCard p={b} filled={false} />
      </ul>

      <Reveal className={`mt-4 p-6 sm:p-7 ${card}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="label">Where they sit</h3>
          <p className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Marker filled /> {first(a.name)}
            </span>
            <span className="flex items-center gap-1.5">
              <Marker filled={false} /> {first(b.name)}
            </span>
          </p>
        </div>
        <ul className="mt-5 space-y-5">
          {data.spectrum.map((s) => (
            <li key={s.left}>
              <div className="flex justify-between text-sm">
                <span>{s.left}</span>
                <span>{s.right}</span>
              </div>
              <div className="relative mt-2.5 h-3" aria-hidden>
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
                {s.values.map((v, i) => (
                  <span
                    key={`p${i}`}
                    className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fg ${i === 0 ? "bg-fg" : "bg-bg"}`}
                    style={{ left: `${v * 100}%` }}
                  />
                ))}
              </div>
              <p className="sr-only">
                {first(a.name)} {lean(s.values[0], s.left, s.right)}; {first(b.name)} {lean(s.values[1], s.left, s.right)}.
              </p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-8 max-w-[62ch] border-l-2 border-fg pl-5">
        <p className="text-lg leading-relaxed">{data.takeaway}</p>
      </Reveal>
    </>
  );
}

export function Journey({ data }: { data: NonNullable<CaseStudy["journey"]> }) {
  const n = data.stages.length;
  const x = (i: number) => ((i + 0.5) / n) * 100;
  const y = (level: number) => (1 - level) * 100;
  const rows = [
    ["Doing", "doing"],
    ["Thinking", "thinking"],
    ["Feeling", "feeling"],
  ] as const;
  const chip = "rounded-full border border-line bg-bg px-3 py-1.5 text-sm";
  const Arrow = () => (
    <span aria-hidden className="text-muted">
      →
    </span>
  );
  return (
    <>
      {/* The map scrolls sideways on narrow screens so each stage keeps a readable width */}
      <Reveal className={`overflow-hidden ${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] table-fixed border-collapse text-left">
            <caption className="sr-only">Journey map, stage by stage</caption>
            <colgroup>
              <col className="w-24" />
              {data.stages.map((s) => (
                <col key={s.name} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-line align-bottom">
                <th scope="col" className="p-4">
                  <span className="sr-only">Row</span>
                </th>
                {data.stages.map((s, i) => (
                  <th key={s.name} scope="col" className="border-l border-line p-4 font-normal">
                    <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mt-1 block font-display text-lg font-bold leading-tight tracking-tight">{s.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, key]) => (
                <tr key={key} className="border-b border-line align-top">
                  <th scope="row" className="label p-4 font-normal">
                    {label}
                  </th>
                  {data.stages.map((s) => (
                    <td
                      key={s.name}
                      className={`border-l border-line p-4 text-sm leading-snug ${
                        key === "thinking" ? "font-display text-[15px]" : key === "feeling" ? "font-medium" : "text-muted"
                      }`}
                    >
                      {key === "thinking" ? <>&ldquo;{s[key]}&rdquo;</> : s[key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="align-top">
                <th scope="row" className="label p-4 font-normal">
                  Emotion
                </th>
                <td colSpan={n} className="border-l border-line px-0 py-5">
                  <div className="relative mx-0 h-28" aria-hidden>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
                      <polyline
                        points={data.stages.map((s, i) => `${x(i)},${y(s.level)}`).join(" ")}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    {data.stages.map((s, i) => (
                      <span
                        key={s.name}
                        className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fg ${
                          s.level < 0.35 ? "bg-bg" : "bg-fg"
                        }`}
                        style={{ left: `${x(i)}%`, top: `${y(s.level)}%` }}
                      />
                    ))}
                  </div>
                  <p className="sr-only">
                    {data.stages.map((s) => `${s.name}: ${s.feeling}`).join(", ")}.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-10 max-w-[48ch]">
        <p className="font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl">&ldquo;{data.quote}&rdquo;</p>
        <p className="mt-3 text-sm text-muted">From my design notes</p>
      </Reveal>

      {/* The task flow: the happy path, then a branch at the dependency check */}
      <Reveal className={`mt-10 p-6 sm:p-7 ${card}`}>
        <h3 className="label">{data.flow.title}</h3>
        <ol className="mt-5 flex flex-wrap items-center gap-2">
          {data.flow.steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className={chip}>{s}</span>
              {i < data.flow.steps.length - 1 && <Arrow />}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center gap-2">
          <span aria-hidden className="text-muted">
            ↓
          </span>
          <span className="rounded-md border border-dashed border-fg px-3 py-1.5 text-sm font-medium">{data.flow.decision}</span>
        </div>
        <div className="mt-4 space-y-3 border-l border-line pl-4">
          {(
            [
              ["Yes", data.flow.yes],
              ["No", data.flow.no],
            ] as const
          ).map(([label, steps]) => (
            <div key={label} className="flex flex-wrap items-center gap-2">
              <span className="label w-8">{label}</span>
              <ol className="flex flex-wrap items-center gap-2">
                {steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className={`${chip} ${label === "Yes" && i === 0 ? "border-fg" : ""}`}>{s}</span>
                    {i < steps.length - 1 && <Arrow />}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Reveal>

      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {data.principles.map((p) => (
          <Reveal as="li" key={p.title} className={`p-6 ${card}`}>
            <span className="label">Design principle</span>
            <h3 className="mt-2 font-display text-xl font-bold tracking-tight">{p.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.text}</p>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
