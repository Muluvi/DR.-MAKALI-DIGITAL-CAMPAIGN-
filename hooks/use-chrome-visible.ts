"use client";

import { useEffect, useState } from "react";

/**
 * Whether the persistent mobile chrome should be on screen.
 *
 * "Zero chrome": at rest, a phone shows the document and nothing else. On a folded Galaxy Fold
 * the five fixed elements this governs — progress bar, top rule, section bar, bottom nav and
 * the quick-nav capsule — took about a fifth of a 653px viewport permanently, against a
 * document meant to be read in fragments between other obligations.
 *
 * Chrome is shown when the reader is plausibly looking for it: near the top of the page, or
 * immediately after an upward scroll. It withdraws when they scroll down, and again after a
 * pause once they have settled into reading. Nothing is removed — every control returns on one
 * upward flick, which is the gesture people already use to summon a browser's own chrome.
 *
 * Desktop is unaffected: the rail there is not competing for space.
 */
export function useChromeVisible({
  topThreshold = 240,
  idleMs = 2600,
  minDelta = 6,
}: { topThreshold?: number; idleMs?: number; minDelta?: number } = {}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reduced motion keeps the chrome put: withdrawing it is motion the reader opted out of.
    if (!coarse || reduced) return;

    let last = window.scrollY;
    let frame = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;

    const settle = () => {
      window.clearTimeout(idle);
      idle = setTimeout(() => {
        if (window.scrollY > topThreshold) setVisible(false);
      }, idleMs);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - last;
        if (Math.abs(delta) < minDelta) return;
        last = y;
        if (y <= topThreshold) setVisible(true);
        else setVisible(delta < 0);
        settle();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    settle();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [topThreshold, idleMs, minDelta]);

  return visible;
}
