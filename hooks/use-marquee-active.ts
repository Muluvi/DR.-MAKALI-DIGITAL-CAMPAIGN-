"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether a looping marquee/ticker should be animating: only while its
 * container is on-screen, and never when the user has prefers-reduced-motion set.
 */
export function useMarqueeActive<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rafId = requestAnimationFrame(() => {
      setReducedMotion(mediaQuery.matches);
    });

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      cancelAnimationFrame(rafId);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { containerRef, isActive: isVisible && !reducedMotion };
}
