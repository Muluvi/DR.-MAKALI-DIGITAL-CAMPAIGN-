"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

/**
 * Arms a one-time entrance for the marks inside, without ever hiding the truth.
 *
 * The server HTML draws every mark at its final value. After hydration, and only if the block is
 * still below the fold and the reader has not asked for reduced motion, this sets
 * `data-armed`, which lets CSS hold the marks at their origin (a bar at zero, a path undrawn)
 * until the block enters view and `data-in` releases them. A block already on screen is never
 * armed, so nothing the reader is looking at ever jumps back to zero.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) return;
    el.dataset.armed = "true";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.in = "true";
        io.disconnect();
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
