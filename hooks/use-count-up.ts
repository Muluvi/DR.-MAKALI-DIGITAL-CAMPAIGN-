"use client";

import { useEffect, useState } from "react";

/**
 * The site's one count-up implementation. Previously duplicated three times — once correctly in
 * `NominationVerdict.tsx`, and twice more in `Dashboard.tsx` and `AnimatedMetric.tsx` with a
 * setInterval-free rAF loop that never checked `prefers-reduced-motion` and, in Dashboard's case,
 * computed elapsed time as `timestamp - timestamp % 1 + timestamp - startTime` — which is not
 * `timestamp - startTime`, so the counter jumped straight to somewhere past halfway on its first
 * frame rather than actually counting up.
 *
 * Expo-out, matching `EASE_ENTRANCE` (lib/motion.ts) so every counter on the site settles the same
 * way. Under reduced motion the frame loop never starts — the number is simply present, per the
 * site's rule that reduced motion is a different finished state, not a degraded animation.
 */
export function useCountUp(target: number, active: boolean, reduce: boolean, duration = 900): number {
  const [progressed, setProgressed] = useState(0);

  useEffect(() => {
    if (reduce || !active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(2, -10 * t);
      setProgressed(t < 1 ? eased : 1);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduce, duration]);

  if (reduce) return target;
  return target * progressed;
}

const NUMERIC_METRIC = /^([^0-9.]*)([0-9.]+)([^0-9.]*)$/;

/**
 * The same count-up, for a pre-formatted metric string ("22.1%", "KSh13.79bn", "≈200k") rather
 * than a bare number — the shape `Dashboard.tsx`'s metric grid and `AnimatedMetric.tsx` need.
 * Anything the prefix/suffix regex can't parse (no numeric run) is returned unchanged and unanimated
 * — a label is not a metric.
 */
export function useFormattedCountUp(value: string, active: boolean, reduce: boolean, duration = 900): string {
  const match = value.match(NUMERIC_METRIC);
  const target = match ? parseFloat(match[2]) : 0;
  const progressed = useCountUp(target, active && !!match, reduce, duration);

  if (!match) return value;
  const [, prefix, digits, suffix] = match;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  return `${prefix}${(reduce ? target : progressed).toFixed(decimals)}${suffix}`;
}
