import { Contours } from "./Contours";
import { InkDrawing } from "./InkDrawing";
import type { Drawing } from "@/lib/drawings";

type Props = {
  title: string;
  intro?: string;
  drawing?: Drawing;
  children: React.ReactNode;
};

// A page body with its heading. Behind the heading are the same trail-map contours as the home
// page (click or tap to ripple them), and beside it an optional pen drawing.
export function Section({ title, intro, drawing, children }: Props) {
  return (
    <section className="container-x pb-24 sm:pb-32">
      <header className="relative isolate mb-12 grid items-end gap-x-12 gap-y-8 pt-28 sm:mb-16 sm:pt-36 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
        <Contours className="pointer-events-none absolute inset-y-0 -left-4 -right-4 -z-10 h-full w-[calc(100%+2rem)] [mask-image:radial-gradient(ellipse_at_70%_60%,#000_25%,transparent_72%)] sm:-left-8 sm:w-[calc(100%+4rem)]" />
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
          {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
        </div>
        {drawing && <InkDrawing drawing={drawing} className="max-w-[400px] lg:justify-self-end" />}
      </header>
      {children}
    </section>
  );
}
