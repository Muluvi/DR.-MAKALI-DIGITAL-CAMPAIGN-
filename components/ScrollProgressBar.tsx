"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fixed top progress bar. Primary implementation is pure CSS —
 * `animation-timeline: scroll()` drives a scaleX transform with no JS and no
 * layout shift (see .scroll-progress-fill in globals.css). Browsers without
 * scroll-driven animation support (detected once, no per-frame cost from the
 * feature check itself) fall back to a throttled scroll-listener that sets
 * the same transform manually.
 */
function detectNeedsFallback() {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") return true;
  return !CSS.supports("animation-timeline: scroll()");
}

export function ScrollProgressBar() {
  const [isMounted, setIsMounted] = useState(false);
  const [needsFallback, setNeedsFallback] = useState(false);
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const rafMount = requestAnimationFrame(() => {
      setIsMounted(true);
      if (detectNeedsFallback()) {
        setNeedsFallback(true);
      }
    });

    const fallback = detectNeedsFallback();
    if (!fallback) {
      return () => cancelAnimationFrame(rafMount);
    }

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(totalHeight > 0 ? Math.min(1, window.scrollY / totalHeight) : 0);
        ticking.current = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafMount);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className="scroll-progress-track fixed top-1.5 left-0 right-0 h-1 z-50 print:hidden"
      role="progressbar"
      aria-label="Reading progress"
      aria-hidden="true"
    >
      <div
        className="scroll-progress-fill h-full origin-left bg-gradient-to-r from-accent to-gold"
        style={needsFallback ? { transform: `scaleX(${progress})` } : undefined}
      />
    </div>
  );
}

