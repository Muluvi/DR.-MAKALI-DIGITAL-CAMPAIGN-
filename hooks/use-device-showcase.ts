"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";

import { SPRING } from "../lib/motion";
import { useReducedMotionSafe } from "./use-reduced-motion-safe";

/**
 * The three mechanisms both device showcases are built on.
 *
 * components/phone/ and components/terminal/ are two devices, and their dimensions genuinely
 * differ — a handset is not a field terminal, and the constants stay in their own device.ts.
 * What was copied between them was the machinery: the same pointer-tilt springs, the same
 * ResizeObserver stage scaling, the same roving-tablist keyboard handler. Copied machinery
 * drifts, and here it already had — one frame animated the sheen's opacity and the other did
 * not, for no reason either file gave.
 */

/**
 * Pointer tilt on a device body.
 *
 * Mouse only: a phone that swings when you drag it with your thumb is fighting the scroll.
 * Reduced motion pins both axes at zero rather than damping them — the reader asked for no
 * motion, not less of it.
 */
export function useDeviceTilt<T extends HTMLElement>({
  maxRotateX,
  maxRotateY,
}: {
  maxRotateX: number;
  maxRotateY: number;
}) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<T>(null);
  const [pointerInside, setPointerInside] = useState(false);

  const rawY = useMotionValue(0);
  const rawX = useMotionValue(0);
  const rotateY = useSpring(rawY, SPRING.gentle);
  const rotateX = useSpring(rawX, SPRING.gentle);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce || e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rawY.set(px * maxRotateY * 2);
      rawX.set(-py * maxRotateX * 2);
    },
    [reduce, rawX, rawY, maxRotateX, maxRotateY]
  );

  const onPointerEnter = useCallback(() => setPointerInside(true), []);

  const onPointerLeave = useCallback(() => {
    setPointerInside(false);
    rawY.set(0);
    rawX.set(0);
  }, [rawX, rawY]);

  return {
    ref,
    reduce,
    pointerInside,
    /**
     * The springs themselves, so a caller can derive its own sheen from them. Gate them at the
     * style site with `reduce ? 0 : rotateY` — the hook does not pre-gate, because a gated value
     * is a union that useTransform cannot take.
     */
    rotateX,
    rotateY,
    /** Spread onto the perspective container. */
    handlers: { onPointerMove, onPointerEnter, onPointerLeave },
  };
}

/**
 * Fit a fixed-size device into whatever width it is given.
 *
 * The device is drawn once at its true size and scaled as a single transform, so nothing inside
 * it ever reflows. The caller reserves the scaled height via aspect-ratio, which is what keeps
 * cumulative layout shift at zero.
 */
export function useStageScale<T extends HTMLElement>(bodyWidth: number) {
  const stageRef = useRef<T>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / bodyWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [bodyWidth]);

  return { stageRef, scale };
}

/**
 * A roving tablist: arrow keys move between tabs, Home and End jump to the ends.
 *
 * This is the keyboard contract `role="tablist"` promises, and declaring the role without it is
 * worse than declaring no role at all — a screen-reader user is told there are tabs here and
 * then finds the arrow keys do nothing. Five components in this repo were in exactly that state.
 */
export function useRovingTabs<Id extends string>(ids: readonly Id[], active: Id, onSelect: (id: Id) => void) {
  const tabRefs = useRef<Partial<Record<Id, HTMLButtonElement | null>>>({});

  const focus = useCallback(
    (id: Id) => {
      onSelect(id);
      tabRefs.current[id]?.focus();
    },
    [onSelect]
  );

  const move = useCallback(
    (delta: number) => {
      const i = ids.indexOf(active);
      focus(ids[(i + delta + ids.length) % ids.length]);
    },
    [ids, active, focus]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (step) {
        e.preventDefault();
        move(step);
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        focus(ids[0]);
      } else if (e.key === "End") {
        e.preventDefault();
        focus(ids[ids.length - 1]);
      }
    },
    [ids, move, focus]
  );

  /** Spread onto each tab button: the ref, and the roving tabindex the pattern requires. */
  const tabProps = useCallback(
    (id: Id) => ({
      ref: (el: HTMLButtonElement | null) => {
        tabRefs.current[id] = el;
      },
      role: "tab" as const,
      "aria-selected": id === active,
      tabIndex: id === active ? 0 : -1,
      onClick: () => onSelect(id),
    }),
    [active, onSelect]
  );

  return { tabRefs, move, onKeyDown, tabProps };
}
