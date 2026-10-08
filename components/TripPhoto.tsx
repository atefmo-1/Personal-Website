"use client";

import Image from "next/image";
import { useState } from "react";
import { about } from "@/lib/site";

// The Outward Bound photo, printed as a halftone (dots on a 45° screen, made from the photo) so it
// matches the site's line art. Click to see the real photo, and again to go back. In dark mode
// the dots turn light (.ink-invert in globals.css).
export function TripPhoto() {
  const [real, setReal] = useState(false);
  const { image } = about.highlight;
  return (
    <button
      type="button"
      onClick={() => setReal(!real)}
      aria-pressed={real}
      aria-label={real ? "Show the photo as a halftone print" : "Show the original photo"}
      className="group relative block aspect-[4/3] h-full w-full overflow-hidden sm:aspect-auto"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 640px) 224px, 100vw"
        className={`object-cover transition-opacity duration-500 ${real ? "opacity-100" : "opacity-0"}`}
      />
      <Image
        src="/about/smith-rock-halftone.webp"
        alt=""
        fill
        sizes="(min-width: 640px) 224px, 100vw"
        className={`ink-invert object-cover transition-opacity duration-500 ${real ? "opacity-0" : "opacity-100"}`}
      />
      <span className="absolute bottom-2 left-2 rounded-full border border-line bg-bg/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-label text-muted">
        {real ? "↻ halftone" : "↻ photo"}
      </span>
    </button>
  );
}
