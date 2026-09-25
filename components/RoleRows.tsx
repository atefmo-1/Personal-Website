import { CountText } from "./CountText";
import { ExternalLink } from "./ExternalLink";
import { Reveal } from "./Reveal";
import { experience } from "@/lib/experience";
import { logos, type LogoKey } from "@/lib/logos";
import { about } from "@/lib/site";

// Shared row layout for jobs and schools: name + detail | highlight | location | date.
// Fixed column widths so every row lines up.
const rowFrame = "border-b border-line py-4 sm:py-5";
const rowGrid =
  "grid grid-cols-1 gap-0.5 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1fr)_9rem] sm:items-baseline sm:gap-6";
const row = `${rowFrame} ${rowGrid}`;
const name = "font-display text-xl font-bold tracking-tight sm:text-2xl";
const date = "font-mono text-xs uppercase tracking-label text-muted sm:text-right";

// `Heading` lets a page pick the right heading level for its outline.
export function ExperienceRows({ heading: Heading = "h3" }: { heading?: "h2" | "h3" }) {
  return (
    <ol className="border-t border-line">
      {experience.map((job) => (
        <Reveal as="li" key={job.company} className={row}>
          <div>
            <Heading className={name}>
              <ExternalLink href={job.url}>{job.company}</ExternalLink>
            </Heading>
            <p className="text-sm text-muted">{job.what}</p>
          </div>
          <div>
            <p className="font-medium">{job.role}</p>
            {job.focus && <p className="text-sm text-muted">{job.focus}</p>}
          </div>
          <p className="text-muted">{job.location}</p>
          <p className={date}>{job.dates}</p>
        </Reveal>
      ))}
    </ol>
  );
}

// Logo on its own line above the name: same height for tall marks (UNC, ALA); the wide
// Samsung wordmark gets width instead so its letters stay readable.
function LogoSlot({ id }: { id?: LogoKey }) {
  const logo = id ? logos[id] : undefined;
  return (
    <span className="mb-2 flex h-7 w-fit items-center text-fg/80" aria-hidden>
      {logo?.kind === "mask" && (
        <span
          className="block h-7 bg-current"
          style={{
            aspectRatio: logo.aspect,
            maskImage: `url(${logo.src})`,
            WebkitMaskImage: `url(${logo.src})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      )}
      {logo?.kind === "svg" && (
        <svg viewBox={logo.viewBox} className="w-24 fill-current" style={{ aspectRatio: logo.aspect }}>
          <path d={logo.path} />
        </svg>
      )}
    </span>
  );
}

export function EducationRows({ heading: Heading = "h3" }: { heading?: "h2" | "h3" }) {
  return (
    <ol className="border-t border-line">
      {about.education.map((e) => (
        // Logo sits on its own line above the grid, so the name, highlight, location, and date
        // keep lining up on the same baseline.
        <Reveal as="li" key={e.name} className={rowFrame}>
          <LogoSlot id={e.logo} />
          <div className={rowGrid}>
            <div>
              <Heading className={name}>
                <ExternalLink href={e.url}>{e.name}</ExternalLink>
              </Heading>
              <p className="text-sm text-muted">{e.detail}</p>
              {e.scholarship && (
                <p className="mt-1 text-sm">
                  <ExternalLink href={e.scholarship.url} small>
                    {e.scholarship.name}
                  </ExternalLink>
                  <span className="text-muted"> {e.scholarship.note}</span>
                </p>
              )}
            </div>
            <p className="font-medium">
              <CountText text={e.highlight} />
            </p>
            {/* Empty cells still hold their grid column on desktop, and vanish on phones */}
            <p className={e.location ? "text-muted" : "hidden sm:block"}>{e.location}</p>
            <p className={`${date} ${e.dates ? "" : "hidden sm:block"}`}>{e.dates}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
