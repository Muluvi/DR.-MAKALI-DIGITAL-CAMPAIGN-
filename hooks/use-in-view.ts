"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  /** Fire once and disconnect. The default, because this is a long document to re-read. */
  once?: boolean;
  /** Fraction of the element that must be visible. */
  amount?: number;
  /** Extra margin around the root box, e.g. "-10% 0px". */
  margin?: string;
}

/**
 * Viewport detection on a plain IntersectionObserver.
 *
 * `motion`'s `useInView` does the same job, but it pulls the animation runtime into any component
 * that only wants to know whether it is on screen. This is the version for components that want
 * the answer and nothing else — count-ups, chart mounts, lazy figures.
 *
 * `once: false` is supported so a surface can deliberately re-fire on re-entry (§3 of the brief),
 * but it is not the default: a counter that resets every time the reader scrolls back past it
 * reads as a glitch on the fourth pass, not as polish.
 */
export function useInView<T extends Element>({ once = true, amount = 0.3, margin = "0px" }: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver the honest fallback is "visible", never "hidden" — an
    // unsupported API must not leave content permanently invisible.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: amount, rootMargin: margin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, amount, margin]);

  return [ref, inView] as const;
}
