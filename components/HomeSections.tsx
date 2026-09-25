import Link from "next/link";
import { Reveal } from "./Reveal";
import { EducationRows, ExperienceRows } from "./RoleRows";
import { about } from "@/lib/site";

const h2 = "font-display text-2xl font-bold tracking-tight sm:text-3xl";

function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-muted underline-offset-4 transition-colors hover:text-fg hover:underline">
      {children} <span aria-hidden>→</span>
    </Link>
  );
}

// Under the hero on the home page: the short story, then experience and education.
export function HomeSections() {
  return (
    <div className="container-x space-y-16 pb-24 sm:space-y-20 sm:pb-32">
      <Reveal className="border-t border-line pt-10 sm:pt-14">
        {about.paragraphs.map((p) => (
          <p key={p} className="max-w-4xl font-display text-2xl font-medium leading-[1.3] tracking-tight sm:text-3xl">
            {p}
          </p>
        ))}
        <div className="mt-5">
          <More href="/about">Hobbies, communities, and the route map</More>
        </div>
      </Reveal>

      <section>
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className={h2}>Experience</h2>
          <More href="/experience">Skills and more on work</More>
        </div>
        <ExperienceRows />
      </section>

      <section>
        <h2 className={`${h2} mb-5`}>Education</h2>
        <EducationRows />
      </section>
    </div>
  );
}
