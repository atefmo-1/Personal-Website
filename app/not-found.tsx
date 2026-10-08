import type { Metadata } from "next";
import { ArtFigure } from "@/components/Art";
import { Button } from "@/components/Button";
import { Ink } from "@/components/Ink";

export const metadata: Metadata = { title: "Off the trail" };

// The 404 page: a contour map, a trail that runs out, and the way back.
export default function NotFound() {
  return (
    <section className="container-x grid items-center gap-x-12 gap-y-10 pb-24 pt-28 sm:pb-32 sm:pt-36 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div>
        <p className="label">Error 404</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
          <Ink weight={3}>Off the trail</Ink>
        </h1>
        <p className="mt-5 max-w-md text-lg text-muted">
          This page doesn’t exist, or it moved. The trail back is well marked, though.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/">
            Back to the trailhead <span aria-hidden>→</span>
          </Button>
          <Button href="/contact" variant="ghost">
            Report a broken link
          </Button>
        </div>
      </div>
      <ArtFigure kind="lost" caption="Fig. 404 · A trail that simply stops" artClassName="aspect-[4/3]" />
    </section>
  );
}
