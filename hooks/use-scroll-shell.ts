"use client";

import { useEffect } from "react";

/**
 * The page-level scroll state, written once onto <html> as data attributes and custom properties
 * that CSS reads.
 *
 * Three things ride on this and none of them re-render React:
 *
 *   - `data-scroll-dir`     — drives the direction-aware header (`.fx-dir-header`).
 *   - `data-scrolled`       — drives the sticky header's stuck state.
 *
 * All of it is one passive scroll listener coalesced into a single rAF, because the alternative
 * this replaces was three separate components each running their own handler.
 *
 * A `--scroll-skew` custom property used to be written here on every scroll frame as well. It
 * was read by no rule and no component, and setting an inherited custom property on <html>
 * invalidates the computed style of every element below it — so each frame of scrolling cost a
 * full-document style recalculation (~5,800 elements) to drive nothing at all. Data attributes
 * are safe here in a way custom properties are not: they invalidate only the elements matched by
 * rules that mention them.
 */
export function useScrollShell() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    let lastY = window.scrollY;
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const dy = y - lastY;

      // A 6px threshold stops the header flickering on the sub-pixel scroll that a trackpad or a
      // momentum tail produces at rest.
      if (Math.abs(dy) > 6) {
        root.dataset.scrollDir = dy > 0 ? "down" : "up";
      }
      root.dataset.scrolled = y > 24 ? "true" : "false";

      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      delete root.dataset.scrollDir;
      delete root.dataset.scrolled;
    };
  }, []);
}

/**
 * Ambient time-of-day. Sets `data-daypart` on <html> from the reader's own clock, which shifts the
 * hero field a few degrees warmer at dawn and cooler after dark.
 *
 * Deliberately not applied to text or data colour — a document whose numbers change hue with the
 * time of day would be a document nobody could quote from. It reaches the aurora field only.
 */
export function useDaypart() {
  useEffect(() => {
    const set = () => {
      const h = new Date().getHours();
      document.documentElement.dataset.daypart =
        h < 7 ? "night" : h < 11 ? "dawn" : h < 17 ? "day" : h < 21 ? "dusk" : "night";
    };
    set();
    // Re-check hourly rather than on a timer per minute; the bands are hours wide.
    const id = window.setInterval(set, 30 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);
}
