"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

/**
 * One beat of readable prose.
 *
 * The entrance is a 14px lift and a fade, once, on first approach — enough to give the scroll a
 * pulse without turning a 900-word passage into a slideshow. `once: true` matters: a reader who
 * scrolls back up to re-read a paragraph should find it there, not watch it animate in again.
 */
export function Scene({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const reduce = useReducedMotionSafe();

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`py-14 md:py-24 ${className}`}
    >
      {children}
    </motion.div>
  );
}
