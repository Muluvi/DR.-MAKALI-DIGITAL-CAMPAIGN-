"use client";

import { useEffect, useRef } from "react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

/**
 * One number inside a printed string: "KSh 11.64bn" is prefix "KSh ", number "11.64", suffix
 * "bn". Anything with two numbers in it ("200,000–225,000", "1 of 3") is not counted at all:
 * counting one of them would put a false pair on screen for a moment.
 */
const SINGLE = /^([^\d]*?)(\d[\d,]*(?:\.\d+)?)([^\d]*)$/;

/**
 * A value label that counts up once, in view, and always ends on the exact printed string.
 *
 * The server renders the final text; with reduced motion or no script that is all anyone sees.
 * The count writes textContent from a rAF loop (no React renders per frame) and finishes by
 * restoring the original string, so rounding can never leave a wrong number on screen. The
 * prefix and suffix stay put while the number runs, so a unit never flickers.
 */
export function CountUp({ text, ms = 900 }: { text: string; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    const m = SINGLE.exec(text);
    if (!el || reduce || !m) return;
    const [, pre, num, post] = m;
    const target = Number(num.replace(/,/g, ""));
    if (!Number.isFinite(target) || target === 0) return;
    const decimals = (num.split(".")[1] ?? "").length;
    const grouped = num.includes(",");
    const fmt = (v: number) =>
      grouped || v >= 10000
        ? v.toLocaleString("en-KE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : v.toFixed(decimals);
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
            el.textContent = `${pre}${fmt(target * eased)}${post}`;
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
