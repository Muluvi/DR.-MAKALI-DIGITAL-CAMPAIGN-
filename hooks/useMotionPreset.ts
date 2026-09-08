"use client";

import { useMemo } from "react";
import type { Transition, Variants } from "motion/react";

import {
  DURATION, LOOP, SPRING, STAGGER, VIEWPORT, VIEWPORT_TALL,
  microReduced, reduced, variantsFor,
  type DurationKey, type SpringKey,
} from "../lib/motion";
import { useReducedMotionSafe } from "./use-reduced-motion-safe";

/**
 * One place that knows about `prefers-reduced-motion`, so no component has to remember.
 *
 * Every consumer takes its variants, transitions, springs and stagger gaps from here and gets the
 * degraded path automatically. A component that reaches past this and writes its own
 * `{ duration: 0.5 }` is the bug this hook exists to make unnecessary.
 *
 * What "degraded" means is deliberate, and it is not "faster":
 *
 *   - Entrances collapse to their finished state. Nothing travels; everything is present.
 *   - Interaction feedback SURVIVES, shortened. A press state that stops responding reads as a
 *     broken button, which helps nobody.
 *   - Ambient loops do not run at all. A loop has no finished state to settle at.
 *   - Stagger goes to zero, so a forty-item list arrives at once instead of over two seconds.
 */
export function useMotionPreset() {
  const reduce = useReducedMotionSafe();

  return useMemo(
    () => ({
      /** Read it if you must branch on layout rather than on timing. Prefer the helpers. */
      reduce,

      /** Collapse a variant set to its finished state when the reader asked for less motion. */
      variants: (v: Variants): Variants => variantsFor(v, reduce),

      /** Any transition, degraded. */
      transition: (t: Transition): Transition => (reduce ? reduced : t),

      /** Interaction feedback: kept under reduced motion, just shorter. */
      feedback: (t: Transition): Transition => (reduce ? microReduced : t),

      /** A named spring, degraded. */
      spring: (k: SpringKey = "gentle"): Transition => (reduce ? reduced : SPRING[k]),

      /** A named duration in seconds, degraded. */
      duration: (k: DurationKey): number => (reduce ? 0.001 : DURATION[k]),

      /** A stagger gap in seconds. Zero under reduced motion. */
      stagger: (gap: number = STAGGER.normal): number => (reduce ? 0 : gap),

      /**
       * An ambient loop's transition, or `undefined` to mean "do not run".
       * Spread it: `transition={preset.loop({ repeat: Infinity, duration: LOOP.drift })}`.
       */
      loop: (t: Transition): Transition | undefined => (reduce ? undefined : t),

      /** Whether an ambient loop may run at all — for the marquees and the ambient field. */
      allowLoops: !reduce,

      /** The shared viewport contracts, so call sites stop inventing margins. */
      viewport: VIEWPORT,
      viewportTall: VIEWPORT_TALL,

      LOOP,
    }),
    [reduce],
  );
}
