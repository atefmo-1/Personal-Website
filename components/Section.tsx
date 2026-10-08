import { ArtFigure, type ArtKind } from "./Art";
import { Ink } from "./Ink";

type Props = {
  title: string;
  intro?: string;
  // A generative figure beside the heading, with its caption.
  art?: { kind: ArtKind; seed?: number; caption: string };
  children: React.ReactNode;
};

// A page body with its heading, and optionally a generative figure beside it.
export function Section({ title, intro, art, children }: Props) {
  return (
    <section className="container-x pb-24 pt-28 sm:pb-32 sm:pt-36">
      <header className="mb-12 grid items-end gap-x-12 gap-y-8 sm:mb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            <Ink weight={3}>{title}</Ink>
          </h1>
          {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
        </div>
        {art && <ArtFigure {...art} artClassName="aspect-[3/1]" />}
      </header>
      {children}
    </section>
  );
}
