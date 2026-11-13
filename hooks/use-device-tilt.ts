"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { useMotionValue, useMotionValueEvent, useScroll, useSpring, type MotionValue } from "motion/react";

import { SPRING } from "../lib/motion";
import { useReducedMotionSafe } from "./use-reduced-motion-safe";

/**
 * The tilt every device mockup shares (brief G-10): "a slight 3D tilt that responds to pointer
 * or scroll".
 *
 *   pointer   a fine pointer (a mouse) turns the device toward itself, within the limits;
 *   scroll    on touch screens, where there is no hover, the device pitches gently as it crosses
 *             the viewport: tipped back as it enters from below, level at the centre, tipped
 *             forward as it leaves. The page scroll drives it; nothing scrolls on its own.
 *
 * Both write the same two motion values through a gentle spring, so the device never jumps.
 * Under reduced motion both stay at zero and the device is drawn square to the reader.
 */
export function useDeviceTilt(
  ref: RefObject<HTMLElement | null>,
  { maxX, maxY }: { maxX: number; maxY: number }
): {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
  active: boolean;
} {
  const reduce = useReducedMotionSafe();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, SPRING.gentle);
  const rotateY = useSpring(rawY, SPRING.gentle);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const on = () => setCoarse(mq.matches);
    const t = window.setTimeout(on, 0);
    mq.addEventListener("change", on);
    return () => {
      window.clearTimeout(t);
      mq.removeEventListener("change", on);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce || !coarse) return;
    const k = Math.max(-1, Math.min(1, (0.5 - p) * 2));
    rawX.set(k * maxX);
    rawY.set(-k * maxY * 0.5);
  });

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce || e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rawY.set(px * maxY * 2);
      rawX.set(-py * maxX * 2);
    },
    [reduce, ref, rawX, rawY, maxX, maxY]
  );

  const onPointerLeave = useCallback(() => {
    if (coarse) return;
    rawX.set(0);
    rawY.set(0);
  }, [coarse, rawX, rawY]);

  return { rotateX, rotateY, onPointerMove, onPointerLeave, active: !reduce };
}
