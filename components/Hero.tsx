import Image from "next/image";
import { ArtFigure } from "./Art";
import { Button } from "./Button";
import { InkJourney } from "./InkJourney";
import { RotatingWord } from "./RotatingWord";
import { site } from "@/lib/site";

// The entrance is pure CSS (see .enter-* in globals.css), gated on
// `prefers-reduced-motion: no-preference`. Server HTML is fully visible; nothing waits on JS.
const delay = (s: number) => ({ animationDelay: `${s}s` });

// Each letter is its own span (for the stagger), which disables the font's kerning, so tight
// pairs get a manual nudge. In Space Grotesk, E's arms otherwise fuse into D's stem.
const KERN: Record<string, string> = { ED: "0.05em" };

function SplitWord({ word, start }: { word: string; start: number }) {
  return (
    <span className="inline-flex overflow-hidden pb-[0.04em]" aria-hidden>
      {word.split("").map((ch, i) => (
        <span
          key={i}
          className="enter-letter inline-block"
          style={{ ...delay(start + i * 0.04), marginRight: KERN[(ch + (word[i + 1] ?? "")).toUpperCase()] }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid-12 items-center gap-y-8 pb-10 pt-24 sm:pb-14 sm:pt-28">
        {/* Portrait: first on phones, right column on desktop */}
        <figure className="enter-fade relative col-span-12 lg:order-last lg:col-span-4 lg:col-start-9" style={delay(0.2)}>
          <div className="w-36 sm:w-44 lg:ml-auto lg:w-full lg:max-w-[300px]">
            <div className="relative aspect-[5/6] w-full overflow-hidden rounded-3xl bg-line">
              <Image
                src={site.portrait}
                alt={`Illustrated portrait of ${site.name}`}
                fill
                priority
                sizes="(min-width: 1024px) 300px, 176px"
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </figure>

        <div className="col-span-12 lg:col-span-8">
          <p className="enter-fade font-mono text-[11px] uppercase tracking-label text-muted">{site.status}</p>

          <h1
            className="mt-4 font-display font-bold uppercase leading-[0.86] tracking-[-0.025em] text-[13vw] sm:text-[10vw] lg:text-[min(6.5vw,6rem)]"
            aria-label={site.name}
          >
            <span className="-ml-[0.05em] block">
              <SplitWord word={site.firstName} start={0.1} />
            </span>
            <span className="-ml-[0.05em] block">
              <SplitWord word={site.lastName} start={0.28} />
            </span>
          </h1>

          <div className="enter-rise mt-5" style={delay(0.45)}>
            <p className="max-w-[44ch] text-xl leading-snug sm:text-2xl">
              Studying <strong className="font-semibold">{site.study.majors[0]}</strong> and{" "}
              <strong className="font-semibold">{site.study.majors[1]}</strong> at{" "}
              <strong className="font-semibold">{site.study.school}</strong> as a{" "}
              <strong className="font-semibold">{site.study.scholarship}</strong> {site.study.flag}
            </p>
          </div>

          <div className="enter-rise" style={delay(0.65)}>
            <p className="mt-5 max-w-[42ch] text-lg leading-snug text-muted">
              <RotatingWord {...site.positioning} />
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={site.resume} external>
                Grab my resume <span aria-hidden>↗</span>
              </Button>
              <Button href="/contact" variant="ghost">
                Say hello <span aria-hidden>→</span>
              </Button>
            </div>
          </div>

          {/* The tagline, drawn: tangled lines that settle into calm, parallel ones */}
          <ArtFigure
            kind="order"
            caption="Fig. 1 · Messy workflows in, tools people use out"
            className="enter-fade mt-7 max-w-[560px]"
            artClassName="aspect-[6/1]"
          />
        </div>

        <div className="order-last col-span-12 mt-4 sm:mt-8">
          <InkJourney />
        </div>
      </div>
    </section>
  );
}
