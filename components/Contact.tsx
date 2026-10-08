import { IconBrandLinkedin, IconFileText } from "@tabler/icons-react";
import { ContactForm } from "./ContactForm";
import { MorseHello } from "./MorseHello";
import { CopyEmail } from "./CopyEmail";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { site } from "@/lib/site";
import { Ink } from "./Ink";

const links = [
  { label: "LinkedIn", href: site.linkedin, icon: IconBrandLinkedin, external: true },
  { label: "Resume", href: site.resume, icon: IconFileText, external: true },
];

export function Contact() {
  return (
    <Section
      title="Say hello"
      art={{ kind: "planes", caption: "Fig. 1 · Messages, inbound to Chapel Hill" }}
      intro="Recruiting, want to work on something together, looking for advice, or up for a coffee or a call? My inbox is open 👋"
    >
      <MorseHello className="-mt-4 mb-12 sm:mb-14" />

      <div className="grid-12 gap-y-10">
        {/* Direct options: quickest for recruiters, so they come first */}
        <Reveal className="col-span-12 lg:col-span-4">
          <h2 className="label">Email me directly</h2>
          <div className="mt-3">
            <CopyEmail email={site.email} />
          </div>
          <p className="mt-4 text-xs text-muted">School email (UNC)</p>
          <div className="mt-1.5">
            <CopyEmail email={site.schoolEmail} />
          </div>

          <h2 className="label mt-8">Or find me here</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[15px] transition-colors hover:border-fg"
                >
                  <l.icon size={18} stroke={1.6} aria-hidden />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* The form, in a card */}
        <Reveal className="col-span-12 lg:col-span-7 lg:col-start-6" delay={0.1}>
          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold tracking-tight"><Ink>Send a message</Ink></h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
