"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Content is visible by default: server HTML, first paint, no-JS, and reduced-motion readers all
// see everything at full opacity. Only after mount, and only when the reader has confirmed
// `prefers-reduced-motion: no-preference`, do elements that start *below* the viewport get
// "armed" (dipped out of sight) so they can animate in. Anything already on screen is left alone.
export function useScrollReveal<T extends Element = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);
  const [motionOK, setMotionOK] = useState(false);

  const inView = useInView(ref, { once: true, amount: 0.3 });
  // Safety net: an element the reader has already scrolled up past the top of the viewport
  // counts as revealed, even if a fast scroll skipped straight over the 30% threshold.
  const passed = useInView(ref, { once: true, margin: "100000px 0px -100% 0px" });

  useEffect(() => {
    const ok = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    setMotionOK(ok);
    const el = ref.current;
    if (ok && el && el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, []);

  const hidden = armed && !inView && !passed;
  return { ref, hidden, inView, motionOK };
}
