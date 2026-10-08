import { Ink } from "./Ink";

type Props = {
  title: string;
  intro?: string;
  children: React.ReactNode;
};

// A page body with a simple heading.
export function Section({ title, intro, children }: Props) {
  return (
    <section className="container-x pb-24 pt-32 sm:pb-32 sm:pt-40">
      <header className="mb-12 max-w-2xl sm:mb-16">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
          <Ink weight={3}>{title}</Ink>
        </h1>
        {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
      </header>
      {children}
    </section>
  );
}
