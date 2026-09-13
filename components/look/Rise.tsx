"use client";

import React from "react";
import { motion } from "motion/react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

/**
 * The scroll fade-in every one of the reference sites uses, and the only entrance in this test.
 *
 * 16px and 500ms, once, on approach. Subscrr and Linearity both do exactly this and nothing
 * more for body sections; the restraint is the point. Under reduced motion the content is
 * simply there.
 */
export function Rise({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
