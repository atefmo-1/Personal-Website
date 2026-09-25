"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "./useScrollReveal";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article";
};

// Scroll-triggered fade + slide-up. Renders fully visible by default; see useScrollReveal
// for when (and whether) the dip-and-reveal actually runs.
export function Reveal({ children, className, delay = 0, as = "div" }: Props) {
  const { ref, hidden } = useScrollReveal();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      ref={ref}
      className={className}
      initial={false}
      animate={hidden ? "hidden" : "shown"}
      variants={{
        hidden: { opacity: 0, y: 20, transition: { duration: 0 } },
        shown: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </Tag>
  );
}
