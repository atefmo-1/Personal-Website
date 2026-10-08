import type { Drawing } from "@/lib/drawings";

// A pen drawing that draws itself once (.ink-path in globals.css). Reduced-motion readers see
// it already drawn.
export function InkDrawing({ drawing, delay = 0.3, className = "" }: { drawing: Drawing; delay?: number; className?: string }) {
  return (
    <svg viewBox={drawing.viewBox ?? "0 0 400 120"} role="img" aria-label={drawing.label} className={`h-auto w-full overflow-visible text-fg ${className}`}>
      <path
        d={drawing.d}
        pathLength={1000}
        style={{ animationDelay: `${delay}s` }}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ink-path"
      />
    </svg>
  );
}
