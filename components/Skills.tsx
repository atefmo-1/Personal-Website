import { Reveal } from "./Reveal";
import { brandColors, brandStyle } from "@/lib/brandColor";
import { skillGroups, skillsIntro } from "@/lib/skills";

// Compact block that sits under the roles on the Work & Experience page.
// Server component on purpose: icon paths are inlined into the HTML, so the (large)
// simple-icons package never ships to the browser.
export function Skills() {
  return (
    <section id="skills" className="mt-20 scroll-mt-24 sm:mt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Skills & tools</h2>
        <p className="text-muted">{skillsIntro}</p>
      </div>

      <Reveal>
        <dl className="mt-6 border-t border-line">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="grid gap-3 border-b border-line py-4 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-6"
            >
              <dt className="label">{group.title}</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((s) => (
                    <li
                      key={s.name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-sm"
                    >
                      {s.icon && (
                        <svg viewBox="0 0 24 24" className="brand h-3.5 w-3.5 shrink-0 fill-current" style={brandStyle(brandColors(s.icon.hex))} aria-hidden>
                          <path d={s.icon.path} />
                        </svg>
                      )}
                      {s.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
