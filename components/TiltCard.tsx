"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

// Tilts its child a few degrees in 3D toward the cursor, then springs back flat.
// Mouse only (touch devices never fire mousemove), and off for reduced-motion readers.
export function TiltCard({ children, className, max = 8 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0); // -0.5 .. 0.5 across the card
  const py = useMotionValue(0);
  const spring = { stiffness: 180, damping: 18, mass: 0.5 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring);

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </div>
  );
}
