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
 * `once: false` is supported so a surface can deliberately re-fire on re-entry,
 * but it is not the default: a counter that resets every time the reader scrolls back past it
 * reads as a glitch on the fourth pass, not as polish.
 */
export function useInView<T extends Element>({ once = true, amount = 0.3, margin = "0px" }: Options = {}) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  // Without IntersectionObserver the honest fallback is "visible", never "hidden" — an
  // unsupported API must not leave content permanently invisible. Support is a constant for
  // the life of the page, so it is derived here rather than pushed into state from an effect.
  //
  // The window check keeps the server's answer unchanged. Rendering on the server, there is no
  // IntersectionObserver either, and without the guard every section would be emitted as
  // already in view — the opposite of what this hook is for, and a flash of the whole document
  // before the client corrected it.
  const unobservable = typeof window !== "undefined" && typeof IntersectionObserver === "undefined";
  const inView = unobservable || seen;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          if (once) io.disconnect();
        } else if (!once) {
          setSeen(false);
        }
      },
      { threshold: amount, rootMargin: margin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, amount, margin]);

  return [ref, inView] as const;
}
