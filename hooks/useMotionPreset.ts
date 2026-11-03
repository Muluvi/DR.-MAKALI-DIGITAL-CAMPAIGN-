"use client";

import { useEffect, useMemo, useState } from "react";
import type { Transition, Variants } from "motion/react";

import {
  DURATION, LOOP, SPRING, STAGGER, VIEWPORT, VIEWPORT_TALL,
  microReduced, reduced, variantsFor,
  type DurationKey, type SpringKey,
} from "../lib/motion";
import { useReducedMotionSafe } from "./use-reduced-motion-safe";

export function useMotionPreset() {
  const reduce = useReducedMotionSafe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return useMemo(
    () => ({
      /** Read it if you must branch on layout rather than on timing. Prefer the helpers. */
      reduce,

      /** Collapse a variant set to its finished state when the reader asked for less motion. */
      variants: (v: Variants): Variants => variantsFor(v, reduce),

      /**
       * The `initial` prop for an entrance — and the reason it is a function rather than a value.
       *
       * `initial={{ opacity: 0 }}` is written into the SERVER-RENDERED HTML, so the element ships
       * invisible and stays that way until React has hydrated and Motion has run. On this site
       * that meant 42 elements arriving at opacity 0 in the markup, including cards carrying
       * baseline figures, deadlines and named owners. A reader whose JavaScript is slow, blocked
       * or broken never sees them; nor does anything that reads the HTML directly.
       *
       * So the starting state is only ever applied after the first client render, and never at
       * all under reduced motion. The entrance still plays for everyone who can see it — it just
       * cannot be the reason content is missing.
       */
      enter: <T,>(from: T): T | false => (mounted && !reduce ? from : false),

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
    [reduce, mounted],
  );
}
