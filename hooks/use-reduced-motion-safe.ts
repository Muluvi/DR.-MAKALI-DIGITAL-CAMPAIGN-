"use client";

import { useReducedMotion } from "./use-media-query";

/**
 * Whether to take the reduced-motion path.
 *
 * Why a hook rather than the CSS media query the site also has: the block in globals.css zeroes
 * CSS `animation-duration` and `transition-duration`, which every `motion.div` on the site
 * ignores entirely. A reader with `reduce` set was getting every JavaScript entrance and every
 * ambient loop. This is the mechanism that actually honours the preference for those.
 *
 * It used to wrap `motion`'s own `useReducedMotion`, which returns `null` on the server and again
 * on the first client render, then flips. That is a hydration mismatch wherever the value reaches
 * rendered TEXT rather than just a transition — and it did: NominationVerdict renders
 * `reduce ? DEFICIT.toFixed(1) : counted.toFixed(1)`, so a reduced-motion reader was served
 * "0.0" from the server and "15.3" from the client, and React discarded and re-rendered the whole
 * page beneath it on every load.
 *
 * `useMediaQuery` is built on `useSyncExternalStore` with an explicit server snapshot, so server
 * and hydration agree on `false` and the real value arrives in the same commit as the subscription.
 * The reader still lands on the reduced path; they just do not pay for a discarded tree first.
 */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion();
}
