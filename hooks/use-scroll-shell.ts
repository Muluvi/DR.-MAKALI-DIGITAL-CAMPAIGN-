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
 *   - `--scroll-skew`       — scroll-velocity skew, clamped hard at ±3deg.
 *
 * All of it is one passive scroll listener coalesced into a single rAF, because the alternative
 * this replaces was three separate components each running their own handler.
 */
export function useScrollShell() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lastY = window.scrollY;
    let lastT = performance.now();
    let frame = 0;
    let decay = 0;

    const settle = () => {
      // Skew has to return to zero on its own, or a page that stops scrolling stays sheared.
      decay = window.setTimeout(() => root.style.setProperty("--scroll-skew", "0deg"), 90);
    };

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const now = performance.now();
      const dy = y - lastY;
      const dt = Math.max(1, now - lastT);

      // A 6px threshold stops the header flickering on the sub-pixel scroll that a trackpad or a
      // momentum tail produces at rest.
      if (Math.abs(dy) > 6) {
        root.dataset.scrollDir = dy > 0 ? "down" : "up";
      }
      root.dataset.scrolled = y > 24 ? "true" : "false";

      if (!reduce) {
        // px/ms → degrees, clamped. Past ~3deg the skew stops reading as speed and starts
        // reading as a rendering fault.
        const skew = Math.max(-3, Math.min(3, (dy / dt) * 2.2));
        root.style.setProperty("--scroll-skew", `${skew.toFixed(2)}deg`);
        window.clearTimeout(decay);
        settle();
      }

      lastY = y;
      lastT = now;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(decay);
      delete root.dataset.scrollDir;
      delete root.dataset.scrolled;
      root.style.removeProperty("--scroll-skew");
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
