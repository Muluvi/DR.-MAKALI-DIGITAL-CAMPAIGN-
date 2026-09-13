"use client";

import React, { useEffect, useRef, useState } from "react";

import { useInView } from "../../hooks/use-in-view";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

/**
 * A figure that counts to its value on approach.
 *
 * The accessible name is the final value from the first frame, and under reduced motion the
 * number renders final immediately — a figure is never animated *to* the truth.
 */
export function CountTo({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>({ once: true, amount: 0.5 });
  const reduce = useReducedMotionSafe();
  const [n, setN] = useState(0);
  const raf = useRef(0);
  const shown = reduce ? value : n;

  useEffect(() => {
    if (!inView || reduce) return;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / 1500, 1);
      setN(p === 1 ? value : value * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, reduce, value]);

  const text = shown.toLocaleString("en-KE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const final = value.toLocaleString("en-KE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <span ref={ref}>
      <span aria-hidden="true">{text}{suffix}</span>
      <span className="sr-only">{final}{suffix}</span>
    </span>
  );
}
