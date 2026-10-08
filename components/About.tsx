import Image from "next/image";
import { IconBrandYoutube, IconCompass, IconMapPin } from "@tabler/icons-react";
import { Reveal } from "./Reveal";
import { RouteMap } from "./RouteMap";
import { Section } from "./Section";
import { StatesGrid } from "./StatesGrid";
import { about } from "@/lib/site";
import { ArtFigure, type ArtKind } from "./Art";
import { TripPhoto } from "./TripPhoto";
import { TripRidgelines } from "./TripRidgelines";
import { TuringTape } from "./TuringTape";
import { Ink } from "./Ink";
import { LifeGrid } from "./LifeGrid";

// DC is shown in the list but isn't a state, so it isn't counted.
const statesOnly = about.statesVisited.filter((s) => s !== "District of Columbia");

const sketches: { kind: ArtKind; caption: string }[] = [
  { kind: "lorenz", caption: "Lorenz attractor: chaos from three equations" },
  { kind: "phyllotaxis", caption: "Golden angle: 137.5°, like a sunflower" },
  { kind: "lissajous", caption: "Lissajous: two sine waves" },
  { kind: "spirograph", caption: "Spirograph: a wheel in a wheel" },
  { kind: "julia", caption: "Julia set: z² + c, as contours" },
  { kind: "flow", caption: "Flow field: ink on noise" },
];

const discrete: { kind: ArtKind; caption: string }[] = [
  { kind: "pascal", caption: "Pascal’s triangle mod p: fractals in counting" },
  { kind: "collatz", caption: "Collatz: every path ends at 1 (so far)" },
  { kind: "bst", caption: "Binary search tree, built one insert at a time" },
  { kind: "konigsberg", caption: "Königsberg: 7 bridges, all odd, no Euler walk" },
];

const sketchGrid = "mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-3";

export function About() {
  return (
    <Section title="About" art={{ kind: "shots", caption: "Fig. 1 · Every jump shot is a parabola" }}>
      {/* Hobbies */}
      <section>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl"><Ink>{about.hobbiesTitle}</Ink></h2>
        <Reveal>
          <ul className="mt-5 flex flex-wrap gap-2">
            {about.hobbies.map((h) => (
              <li
                key={h.name}
                className="inline-flex cursor-default items-center gap-2 rounded-full border border-line px-4 py-2 text-[15px] transition-colors hover:border-fg"
              >
                <h.icon size={18} stroke={1.6} aria-hidden />
                {h.name}
                {h.link && (
                  <a
                    href={h.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-ml-2 text-muted underline-offset-4 hover:text-fg hover:underline"
                  >
                    , {h.link.label} <span aria-hidden>↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
        {/* Favorite YouTube channels: small cards with each channel's picture */}
        <h3 className="label mt-8">{about.watchTitle}</h3>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {about.watchList.map((c) => (
            <li key={c.name}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col items-center gap-2 rounded-xl border border-line px-3 py-4 text-center transition-colors hover:border-fg"
              >
                <Image
                  src={c.avatar}
                  alt=""
                  width={48}
                  height={48}
                  unoptimized
                  className="h-12 w-12 shrink-0 rounded-full bg-line object-cover"
                />
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium leading-tight">{c.name}</span>
                  <span className="mt-1 flex items-center justify-center gap-1 break-all text-xs text-muted">
                    <IconBrandYoutube size={13} stroke={1.6} aria-hidden />
                    {c.handle}
                  </span>
                </span>
                <span className="sr-only"> on YouTube (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        {/* One standout trip, with the mountains it was in drawn as ridgelines */}
        <h3 className="label mt-8">{about.highlight.label}</h3>
        <Reveal className="mt-3 grid overflow-hidden rounded-xl border border-line sm:grid-cols-[14rem_1fr] lg:grid-cols-[14rem_1fr_minmax(0,24rem)]">
          <TripPhoto />
          <div className="p-5">
            <a
              href={about.highlight.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
            >
              <IconCompass size={18} stroke={1.6} className="self-center" aria-hidden />
              {about.highlight.title} <span aria-hidden className="text-muted">↗</span>
            </a>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{about.highlight.text}</p>
          </div>
          <div className="flex flex-col border-t border-line px-5 pb-4 pt-3 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0">
            <TripRidgelines />
          </div>
        </Reveal>
      </section>

      {/* Orgs */}
      <section className="mt-14 sm:mt-16">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl"><Ink>{about.currentlyTitle}</Ink></h2>
        <Reveal>
          <ul className="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
            {about.currently.map((c) => (
              <li key={c} className="border-b border-line py-3 text-[15px]">
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Route map */}
      <section className="grid-12 mt-14 gap-y-8 sm:mt-16">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl"><Ink>{about.routeTitle}</Ink></h2>
          <p className="mt-5 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line px-3.5 py-2 text-sm">
            <IconMapPin size={16} stroke={1.6} className="shrink-0" aria-hidden />
            {statesOnly.length} states + DC, and counting!
          </p>
          {/* The states themselves, as a tile map, right under the badge */}
          <div className="mt-4">
            <StatesGrid />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <RouteMap />
        </div>
      </section>

      {/* Sketchbook: drawings made with math */}
      <section className="mt-14 sm:mt-16">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl"><Ink>{about.sketchbookTitle}</Ink></h2>
        <p className="mt-3 max-w-2xl text-muted">{about.sketchbookIntro}</p>
        <h3 className="label mt-8">Curves and chaos</h3>
        <div className={sketchGrid}>
          {sketches.map((s) => (
            <ArtFigure key={s.kind} kind={s.kind} caption={s.caption} artClassName="aspect-[4/3]" />
          ))}
        </div>
        <h3 className="label mt-12">Computation and discrete math</h3>
        <div className={sketchGrid}>
          <TuringTape caption="Turing machine: adding 1 in binary" />
          <LifeGrid caption="Game of Life: four rules, endless patterns" />
          {discrete.map((s) => (
            <ArtFigure key={s.kind} kind={s.kind} caption={s.caption} artClassName="aspect-[4/3]" />
          ))}
        </div>
      </section>

    </Section>
  );
}
