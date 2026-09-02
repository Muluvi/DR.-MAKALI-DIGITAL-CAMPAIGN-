"use client";

import { useReducedMotion } from "motion/react";

/**
 * Whether to take the reduced-motion path.
 *
 * `motion`'s own `useReducedMotion` returns `null` before hydration, which reads as falsy and
 * would let a full entrance play for one frame on a machine that asked for no motion. Coercing to
 * a boolean here means every caller gets a definite answer and nobody has to remember the quirk.
 *
 * Why a hook rather than the CSS media query the site already had: the block at globals.css
 * zeroes CSS `animation-duration` and `transition-duration`, which every `motion.div` on the site
 * ignored entirely. A reader with `reduce` set was getting all 22 ambient loops and every
 * JavaScript entrance. This is the mechanism that actually honours the preference.
 */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() === true;
}
