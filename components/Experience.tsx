import { Reveal } from "./Reveal";
import { ExperienceRows } from "./RoleRows";
import { Section } from "./Section";
import { Skills } from "./Skills";
import { Certificates } from "./Certificates";
import { workBio } from "@/lib/experience";

export function Experience() {
  const [lead, ...rest] = workBio;
  return (
    <Section title="Work & Experience" art={{ kind: "converge", seed: 2, caption: "Fig. 1 · Scattered data in, one decision out" }}>
      <Reveal className="mb-16 max-w-3xl sm:mb-20">
        <p className="font-display text-xl font-medium leading-snug tracking-tight sm:text-2xl">{lead}</p>
        {rest.map((p) => (
          <p key={p} className="mt-5 text-lg leading-relaxed text-muted">
            {p}
          </p>
        ))}
      </Reveal>

      <ExperienceRows heading="h2" />
      <Skills />
      <Certificates />
    </Section>
  );
}
