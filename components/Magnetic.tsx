"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  // Fraction of the cursor's offset from center that the element follows.
  strength?: number;
};

// Pulls its child slightly toward the cursor while hovered, then springs back.
export function Magnetic({ children, className, strength = 0.25 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
