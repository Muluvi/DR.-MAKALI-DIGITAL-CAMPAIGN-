"use client";

import { useEffect, useState } from "react";

/**
 * Adds data-in="true" the first time the element is on screen, which starts its animations.
 * A callback ref, so an element that appears after the first render (a card that waits for
 * today's date or for live data) is still observed.
 */
export function useReveal<T extends HTMLElement>(): [(node: T | null) => void, boolean] {
  const [el, setEl] = useState<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!el || inView) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setInView(true); io.disconnect(); } }, { rootMargin: "0px 0px -12% 0px", threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [el, inView]);
  return [setEl, inView];
}
