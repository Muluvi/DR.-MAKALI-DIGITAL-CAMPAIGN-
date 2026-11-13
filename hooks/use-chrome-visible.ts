"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Whether the floating page chrome should be on screen.
 *
 * One model for every floating element, because they were each deciding for themselves and the
 * ones that never withdrew sat permanently over the document. Measured at 1440px, the
 * quick-nav capsule covered content in every section sampled — the ward register's "County Ward
 * Average" figure, §0.1's "Wiper Nomination threshold", §2.4's geographic base — which is the
 * "figures are blocked" symptom rather than anything wrong with the figures.
 *
 * Thresholds match the behaviour MobileBottomNav already established, so the nav dock and the
 * capsules move together instead of fighting: reveal near the top of the page or on any
 * meaningful upward scroll, withdraw on a deliberate downward scroll.
 */
export function useChromeVisible() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reduced motion keeps the chrome put: sliding it away is motion the reader opted out of.
    // The layout fix below still applies, so nothing is covered either way.
    if (reduced) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (y < 80) setVisible(true);
        else if (delta > 14 && y > 150) setVisible(false);
        else if (delta < -10) setVisible(true);
        lastY.current = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return visible;
}
