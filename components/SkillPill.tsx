import { brandColors, brandStyle } from "@/lib/brandColor";
import type { Skill } from "@/lib/skills";

// One tool or skill as a rounded pill, with its brand logo when Simple Icons has one.
// Used by the Skills block and by each project's stack. Server component, so icon paths
// are inlined into the HTML and simple-icons never ships to the browser.
export function SkillPill({ skill }: { skill: Skill }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-sm">
      {skill.icon && (
        <svg
          viewBox="0 0 24 24"
          className="brand h-3.5 w-3.5 shrink-0 fill-current"
          style={brandStyle(brandColors(skill.icon.hex))}
          aria-hidden
        >
          <path d={skill.icon.path} />
        </svg>
      )}
      {skill.name}
    </li>
  );
}
