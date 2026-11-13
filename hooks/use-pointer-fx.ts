"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Pointer-driven effects, written as CSS custom properties rather than as React state.
 *
 * Every hook here follows the same discipline: the pointer event writes a custom property on one
 * element and returns. It never calls setState, so a mousemove never schedules a render, and it
 * never reads layout during the move — the element's box is measured once on enter and cached for
 * the duration of the gesture. On a mid-range Android that is the difference between a card that
 * tilts and a card that stutters.
 *
 * All three bail out entirely on a coarse pointer and under `prefers-reduced-motion`, so a phone
 * pays nothing for effects it cannot produce.
 */

function wantsPointerFx(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Spotlight / glow tracking. Writes `--px` and `--py` as percentages of the element's own box,
 * plus `--pointer-inside` so the CSS can fade the glow rather than snapping it.
 *
 * Pairs with `.fx-spotlight` and `.fx-glow-border`.
 */
export function usePointerGlow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const box = useRef<DOMRect | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !wantsPointerFx()) return;

    const enter = () => {
      box.current = el.getBoundingClientRect();
      el.style.setProperty("--pointer-inside", "1");
    };
    const move = (e: PointerEvent) => {
      const r = box.current;
      if (!r) return;
      el.style.setProperty("--px", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--py", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    const leave = () => {
      el.style.setProperty("--pointer-inside", "0");
      box.current = null;
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return ref;
}

/**
 * 3D perspective tilt. Writes `--fx-rx` / `--fx-ry` in degrees, clamped to `max`.
 *
 * The clamp matters more than the maths: past about 10 degrees a card stops reading as "lifting
 * toward you" and starts reading as broken perspective, and the text inside it goes soft.
 *
 * Pairs with `.fx-tilt`.
 */
export function useTilt<T extends HTMLElement>(max = 7) {
  const ref = useRef<T>(null);
  const box = useRef<DOMRect | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !wantsPointerFx()) return;

    const enter = () => {
      box.current = el.getBoundingClientRect();
      el.dataset.engaged = "true";
    };
    const move = (e: PointerEvent) => {
      const r = box.current;
      if (!r) return;
      // -0.5 … 0.5 from the centre of the card, on both axes.
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      // Y-rotation follows the horizontal offset; X-rotation is inverted so the edge nearest the
      // pointer comes toward the reader rather than away from them.
      el.style.setProperty("--fx-ry", `${dx * max * 2}deg`);
      el.style.setProperty("--fx-rx", `${-dy * max * 2}deg`);
      el.style.setProperty("--fx-tz", "10px");
    };
    const leave = () => {
      el.dataset.engaged = "false";
      el.style.setProperty("--fx-ry", "0deg");
      el.style.setProperty("--fx-rx", "0deg");
      el.style.setProperty("--fx-tz", "0px");
      box.current = null;
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max]);

  return ref;
}

/**
 * Magnetic attraction. The element drifts toward the pointer while the pointer is within
 * `radius` px of its centre, and springs back on leave.
 *
 * Listening on the window rather than the element is the whole point — an element that only
 * reacts once the pointer is already on it is not magnetic, it is a hover state.
 *
 * Pairs with `.fx-magnetic`.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3, radius = 90) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !wantsPointerFx()) return;

    let frame = 0;
    const move = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < radius + Math.max(r.width, r.height) / 2) {
          el.dataset.engaged = "true";
          el.style.setProperty("--mx", `${dx * strength}px`);
          el.style.setProperty("--my", `${dy * strength}px`);
        } else if (el.dataset.engaged === "true") {
          el.dataset.engaged = "false";
          el.style.setProperty("--mx", "0px");
          el.style.setProperty("--my", "0px");
        }
      });
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength, radius]);

  return ref;
}

/**
 * Material-style ripple from the exact click point.
 *
 * Returns a pointerdown handler; the host element needs `.fx-ripple-host`. The ink node removes
 * itself on animationend, so no cleanup state is held in React.
 */
export function useRipple<T extends HTMLElement>() {
  return useCallback((e: React.PointerEvent<T>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const host = e.currentTarget;
    const r = host.getBoundingClientRect();
    const ink = document.createElement("span");
    ink.className = "fx-ripple-ink";
    ink.style.setProperty("--rx", `${e.clientX - r.left}px`);
    ink.style.setProperty("--ry", `${e.clientY - r.top}px`);
    ink.addEventListener("animationend", () => ink.remove(), { once: true });
    host.appendChild(ink);
  }, []);
}
