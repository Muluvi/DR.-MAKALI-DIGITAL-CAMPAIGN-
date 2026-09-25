"use client";

import { useEffect } from "react";

/**
 * The page's micro-interactions (brief §7.6), delegated from the document so no component has to
 * carry them and no pointer move ever schedules a React render.
 *
 *   magnetic    primary buttons lean a few pixels toward a mouse pointer near them (desktop only)
 *   light       the section's key figure card carries a soft light that follows the pointer
 *               (desktop only), written as two custom properties the CSS reads
 *   ripple      a tap on a control on a touch screen leaves a brief ring at the finger, on one
 *               fixed layer above the page, so no control's own layout is touched
 *
 * Press states are CSS alone (app/premium.css, "micro-interactions"). Everything here is off
 * under reduced motion, and the pointer effects are off on a coarse pointer.
 */
const MAGNETIC = "[data-magnetic], button.bg-accent-solid, a.bg-accent-solid, .pf-storyptr a";
const LIGHT = ".rf--hero";
const TAPPABLE = "button, a[href], [role='tab'], label, summary";
const PULL = 6;
const REACH = 1.6;

export function MicroFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let magnet: HTMLElement | null = null;
    let frame = 0;
    let last: PointerEvent | null = null;

    const release = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty("translate");
    };

    const tick = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      // The light on the key figure card.
      const card = target?.closest<HTMLElement>(LIGHT);
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      }

      // The magnet: the button under or near the pointer leans toward it, within a few pixels.
      const near = target?.closest<HTMLElement>(MAGNETIC) ?? null;
      if (near !== magnet) {
        release(magnet);
        magnet = near;
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        if (Math.hypot(dx, dy) > REACH) {
          release(magnet);
          magnet = null;
        } else {
          magnet.style.setProperty("translate", `${(dx * PULL).toFixed(1)}px ${(dy * PULL * 0.6).toFixed(1)}px`);
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      release(magnet);
      magnet = null;
    };

    // One layer for every ripple, fixed over the page and never in the way of a tap.
    const layer = document.createElement("div");
    layer.className = "pf-ripples";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      const target = e.target instanceof Element ? e.target.closest(TAPPABLE) : null;
      if (!target) return;
      const dot = document.createElement("span");
      dot.className = "pf-ripple";
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      dot.addEventListener("animationend", () => dot.remove(), { once: true });
      layer.appendChild(dot);
    };

    if (fine) {
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerdown", onDown);
      if (frame) cancelAnimationFrame(frame);
      release(magnet);
      layer.remove();
    };
  }, []);
  return null;
}
