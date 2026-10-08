"use client";

import { useState } from "react";
import { Art, RedrawButton } from "./Art";

// The ridgelines panel inside the Outward Bound card on About.
export function TripRidgelines() {
  const [redraws, setRedraws] = useState(0);
  const caption = "Fig. 2 · Smith Rock to Broken Top, as ridgelines";
  return (
    <>
      <Art kind="ridges" seed={3} label={caption} className="h-28 lg:h-auto lg:min-h-[120px] lg:flex-1" redraws={redraws} />
      <p className="label mt-2 flex items-baseline justify-between gap-3">
        <span>{caption}</span>
        <RedrawButton onClick={() => setRedraws((n) => n + 1)} />
      </p>
    </>
  );
}
