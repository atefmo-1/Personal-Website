import { Reveal } from "./Reveal";
import { SkillConstellation } from "./SkillConstellation";
import { SkillPill } from "./SkillPill";
import { skillGroups, skillsIntro } from "@/lib/skills";
import { Ink } from "./Ink";

// Compact block that sits under the roles on the Work & Experience page.
// Server component on purpose: icon paths are inlined into the HTML, so the (large)
// simple-icons package never ships to the browser.
export function Skills() {
  return (
    <section id="skills" className="mt-20 scroll-mt-24 sm:mt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl"><Ink>Skills & tools</Ink></h2>
        <p className="text-muted">{skillsIntro}</p>
      </div>

      <SkillConstellation groups={skillGroups.map((g) => ({ title: g.title, items: g.items.map((s) => s.name) }))} />

      <Reveal>
        <dl className="mt-8 border-t border-line">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="grid gap-3 border-b border-line py-4 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-6"
            >
              <dt className="label">{group.title}</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((s) => (
                    <SkillPill key={s.name} skill={s} />
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
