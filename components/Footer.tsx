import { Art } from "./Art";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer>
      {/* Ridgelines along the bottom of every page */}
      <div className="container-x">
        <Art kind="ridges" seed={11} label="Ridgelines, a generative drawing" className="h-24 sm:h-32" />
      </div>
      <div className="border-t border-line">
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
      </div>
      </div>
    </footer>
  );
}
