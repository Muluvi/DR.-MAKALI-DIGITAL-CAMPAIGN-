"use client";

import { useChromeVisibleRaw } from "./use-scroll-position";
import { useReducedMotionSafe } from "./use-reduced-motion-safe";

/**
 * Whether the floating page chrome should be on screen.
 *
 * One model for every floating element, because they were each deciding for themselves and the
 * ones that never withdrew sat permanently over the document. Measured at 1440px, the
 * quick-nav capsule covered content in every section sampled — the ward register's "County Ward
 * Average" figure, §0.1's "Wiper Nomination threshold", §2.4's geographic base — which is the
 * "figures are blocked" symptom rather than anything wrong with the figures.
 *
 * The thresholds match the behaviour MobileBottomNav established, so the nav dock and the
 * capsules move together instead of fighting. They used to be COPIED from MobileBottomNav into
 * this file, which is how two elements meant to move together drift apart. They now live in the
 * scroll broker, which is the only place that can hold them: the rule is stateful — it depends
 * on the previous answer as well as the current position — and that state belongs with the
 * listener, not with each reader.
 */
export function useChromeVisible() {
  const reduce = useReducedMotionSafe();
  const visible = useChromeVisibleRaw();

  // Reduced motion keeps the chrome put: sliding it away is motion the reader opted out of.
  // The layout fix this hook exists for still applies, so nothing is covered either way.
  return reduce ? true : visible;
}
