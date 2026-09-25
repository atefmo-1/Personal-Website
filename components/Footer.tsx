import { site } from "@/lib/site";

// Build time, so the stamp moves every time the site is redeployed.
const lastUpdated = new Date().toISOString().slice(0, 10).replaceAll("-", ".");

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-4 py-8 font-mono text-[11px] uppercase tracking-label text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Handmade in Chapel Hill.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a className="transition-colors hover:text-fg" href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className="transition-colors hover:text-fg" href={`mailto:${site.email}`}>
            Email
          </a>
          <a className="transition-colors hover:text-fg" href={site.resume} target="_blank" rel="noopener noreferrer">
            Resume
          </a>
        </div>
        <p>Updated {lastUpdated}</p>
      </div>
    </footer>
  );
}
