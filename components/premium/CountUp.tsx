"use client";

import { useEffect, useRef } from "react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

/**
 * A value label that counts up once, in view, and always ends on the exact printed string.
 *
 * The server renders the final text; with reduced motion or no script that is all anyone sees.
 * The count writes textContent from a rAF loop (no React renders per frame) and finishes by
 * restoring the original string, so rounding can never leave a wrong number on screen.
 */
export function CountUp({ text, ms = 900 }: { text: string; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    const target = Number(text.replace(/[^\d.]/g, ""));
    if (!el || reduce || !Number.isFinite(target) || target === 0) return;
    const decimals = (text.split(".")[1] ?? "").replace(/\D/g, "").length;
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / ms);
          const eased = 1 - Math.pow(1 - k, 3);
          if (k < 1) {
            el.textContent = (target * eased).toLocaleString("en-KE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
            raf = requestAnimationFrame(tick);
          } else {
            el.textContent = text;
          }
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text, ms, reduce]);

  return <span ref={ref}>{text}</span>;
}
