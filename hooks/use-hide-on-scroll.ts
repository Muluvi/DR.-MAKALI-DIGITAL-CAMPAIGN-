"use client";

import { useEffect, useState } from "react";

/**
 * True while the reader is scrolling down through the body of the document.
 *
 * The mobile chrome is ~113px of a 653px folded-Fold viewport — a fifth of the screen held
 * permanently by controls, against a document meant to be read in fragments on a phone. Rather
 * than cut the controls, they yield while the reader is moving forward and come back the moment
 * they scroll up, which is when someone is looking for navigation.
 *
 * Deliberately does not hide near the top of the page (the controls are the orientation aid
 * there) or when the page is too short to scroll meaningfully.
 */
export function useHideOnScroll(threshold = 320) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - last;
        // Ignore sub-pixel jitter and rubber-banding at either end.
        if (Math.abs(delta) < 6) return;
        if (y < threshold) setHidden(false);
        else setHidden(delta > 0);
        last = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return hidden;
}
