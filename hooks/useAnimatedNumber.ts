"use client";

import { useCallback, useEffect, useRef } from "react";
import { useInView, useMotionValue, useMotionValueEvent, useSpring } from "motion/react";

import { SPRING, VIEWPORT_COUNT } from "../lib/motion";
import { useReducedMotionSafe } from "./use-reduced-motion-safe";

/**
 * A figure that counts to its value, without ever displaying a figure that is not true.
 *
 * This document is a work sample for a certified monitoring-and-evaluation specialist. A number
 * that renders 0 — in the HTML, in a screen reader, or on a printed page — is not a loading
 * state to them, it is a wrong measurement. So three things are guaranteed:
 *
 *   1. THE SERVER RENDERS THE FINAL VALUE. Not zero. A reader with JavaScript blocked, a printed
 *      PDF, and the HTML a crawler would see all carry the real figure. The count-up is an
 *      enhancement layered on top, and the element only drops to zero at the moment it is about
 *      to count — 80px before it enters the viewport, which is off-screen.
 *   2. THE ACCESSIBLE NAME IS ALWAYS FINAL. The animating text is `aria-hidden`; a visually
 *      hidden sibling carries the real figure from the first frame, so a screen reader is never
 *      handed 43,912 when the figure is 532,758.
 *   3. REDUCED MOTION MEANS NO COUNT AT ALL. Not a fast count — none. The figure renders final
 *      and never moves.
 *
 * Width is reserved by a hidden copy of the final string, so a figure counting from 0 to 532,758
 * cannot shift the line it sits on. That is the whole CLS story for every number on the site.
 *
 * Updates are written straight to the DOM node rather than through React state: a spring emits
 * roughly 60 values a second and re-rendering a component tree that often is how a mid-range
 * Android drops frames.
 */

export interface NumberFormat {
  /** e.g. "KSh " */
  prefix?: string;
  /** e.g. "%", "bn", "m", " votes" */
  suffix?: string;
  /** Percentages take 1; whole counts take 0. */
  decimals?: number;
  /** Thousands separators. On by default — 532,758 is how the register prints it. */
  separator?: boolean;
}

export function formatNumber(value: number, f: NumberFormat = {}): string {
  const { prefix = "", suffix = "", decimals = 0, separator = true } = f;
  const body = value.toLocaleString("en-KE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: separator,
  });
  return `${prefix}${body}${suffix}`;
}

/** Parse a written figure — "KSh 13.79bn", "22.1%", "532,758" — into a value and its format. */
export function parseFigure(text: string): { value: number; format: NumberFormat } {
  const m = /^([^\d\-+.]*)([-+]?[\d,]*\.?\d+)(.*)$/.exec(text.trim());
  if (!m) return { value: Number.parseFloat(text) || 0, format: {} };
  const [, prefix, digits, suffix] = m;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  return {
    value: Number.parseFloat(digits.replace(/,/g, "")),
    format: { prefix, suffix, decimals, separator: digits.includes(",") || !digits.includes(".") },
  };
}

interface Options extends NumberFormat {
  /** Which named spring drives the count. `heavy` reads as deliberate; `snappy` as a tick-over. */
  spring?: keyof typeof SPRING;
}

export function useAnimatedNumber(value: number, options: Options = {}) {
  // Destructured rather than kept as an object, because `options` is almost always an inline
  // literal — a new identity on every render — and a formatter that changes identity every
  // render restarts the count on every render.
  const { spring = "heavy", prefix, suffix, decimals, separator } = options;

  const reduce = useReducedMotionSafe();
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, VIEWPORT_COUNT);

  const fmt = useCallback(
    (v: number) => formatNumber(v, { prefix, suffix, decimals, separator }),
    [prefix, suffix, decimals, separator],
  );

  // Seeded with the real value, so the first server and client renders agree on the truth and
  // hydration has nothing to correct.
  const raw = useMotionValue(value);
  const animated = useSpring(raw, SPRING[spring]);

  useMotionValueEvent(animated, "change", (v) => {
    const node = textRef.current;
    if (node) node.textContent = fmt(v);
  });

  useEffect(() => {
    if (reduce || !inView) return;
    // Drop to zero and climb, both inside this frame. The zero is never painted on screen:
    // VIEWPORT_COUNT fires 80px before the element arrives.
    raw.jump(0);
    animated.jump(0);
    raw.set(value);
    // The spring settles asymptotically, so pin the exact figure once it is done. Floating-point
    // drift must not leave 532,758 displaying as 532,757.
    const stop = animated.on("animationComplete", () => {
      const node = textRef.current;
      if (node) node.textContent = fmt(value);
    });
    return stop;
  }, [inView, reduce, value, raw, animated, fmt]);

  const final = fmt(value);
  return { containerRef, textRef, final, inView, reduce };
}
