import Image from "next/image";
import { IconBrandYoutube, IconCompass, IconMapPin } from "@tabler/icons-react";
import { Reveal } from "./Reveal";
import { RouteMap } from "./RouteMap";
import { Section } from "./Section";
import { StatesGrid } from "./StatesGrid";
import { about } from "@/lib/site";

// DC is shown in the list but isn't a state, so it isn't counted.
const statesOnly = about.statesVisited.filter((s) => s !== "District of Columbia");

export function About() {
  return (
    <Section title="About">
      {/* Hobbies */}
      <section>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{about.hobbiesTitle}</h2>
        <Reveal>
          <ul className="mt-5 flex flex-wrap gap-2">
            {about.hobbies.map((h) => (
              <li
                key={h.name}
                className="group inline-flex cursor-default items-center gap-2 rounded-full border border-line px-4 py-2 text-[15px] transition-colors hover:border-fg"
              >
                {/* Each icon gets its own little hover motion; see .hobby-* in globals.css */}
                <h.icon size={18} stroke={1.6} className={`hobby-${h.motion}`} aria-hidden />
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

        {/* One standout trip */}
        <h3 className="label mt-8">{about.highlight.label}</h3>
        <Reveal className="mt-3 max-w-3xl rounded-xl border border-line p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <a
              href={about.highlight.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
            >
              <IconCompass size={18} stroke={1.6} className="self-center" aria-hidden />
              {about.highlight.title} <span aria-hidden className="text-muted">↗</span>
            </a>
            <span className="font-mono text-xs uppercase tracking-label text-muted">{about.highlight.dates}</span>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{about.highlight.text}</p>
        </Reveal>
      </section>

      {/* Orgs */}
      <section className="mt-14 sm:mt-16">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{about.currentlyTitle}</h2>
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
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{about.routeTitle}</h2>
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

    </Section>
  );
}
