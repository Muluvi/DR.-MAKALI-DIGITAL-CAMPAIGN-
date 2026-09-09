"use client";

import { useEffect, useMemo, useRef } from "react";

import { useActiveSection } from "../../hooks/use-active-section";
import { useFinePointer, useReducedMotion } from "../../hooks/use-media-query";

/**
 * Page chrome that only exists once the reader has started reading: the scroll-spy dots and the
 * custom cursor.
 *
 * A back-to-top button belongs on this list and is deliberately not here: QuickNavCapsule already
 * renders one, in the same corner. Two would have collided, and the brief's "back-to-top reveal"
 * is better served by giving the existing control the reveal than by adding a second control.
 *
 * Both are strictly additive. Nothing in the document depends on either, neither traps focus, and
 * each removes itself on the input modality it does not suit — the cursor never mounts on touch,
 * the dots never mount below xl.
 */

interface NavDotsProps {
  sections: { id: string; label: string }[];
  onSelect: (id: string) => void;
}

/**
 * Scroll-spy dots down the right edge.
 *
 * The active section comes from useActiveSection, which ClientPage also reads, so the dots and
 * the tab state can no longer disagree about where the reader is.
 */
export function NavDots({ sections, onSelect }: NavDotsProps) {
  const active = useActiveSection(useMemo(() => sections.map((s) => s.id), [sections]));

  return (
    <nav
      className="fixed right-3 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-2.5 print:hidden"
      aria-label="Section progress"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-current={isActive ? "true" : undefined}
            aria-label={s.label}
            title={s.label}
            className={`fx-navdot fx-focus rounded-full ${
              isActive ? "w-2.5 h-6 bg-accent" : "w-2.5 h-2.5 bg-line hover:bg-accent/60"
            }`}
          />
        );
      })}
    </nav>
  );
}

/**
 * The custom cursor: a hard dot at the pointer and a ring that lags behind it.
 *
 * The ring is the trail. A particle trail was the alternative and it was rejected — it costs a
 * permanent rAF loop and, at any density that reads as a trail, it looks like lag rather than
 * polish.
 *
 * It mounts only on a fine pointer with hover, and only when the reader has not asked for reduced
 * motion. Hiding the native cursor is the risky half, so it is done in CSS behind the same media
 * query the mount check uses: if this component ever fails to mount, the real cursor is still there.
 */
export function CustomCursor() {
  // Derived from the media queries rather than recorded into state from an effect, so the value
  // is right on the first client render and a change of input modality re-evaluates it.
  const finePointer = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = finePointer && !reduce;
  // The position properties are written onto the two cursor nodes, not onto <html>. Custom
  // properties inherit, so setting them on the root invalidates the computed style of every
  // element in the document — which meant a full-document style recalculation on every pointer
  // move, to move two 7px dots. Written on the nodes themselves, the invalidation is those nodes.
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("fx-cursor-host");
    let lagX = window.innerWidth / 2;
    let lagY = window.innerHeight / 2;
    let x = lagX;
    let y = lagY;
    let frame = 0;

    const move = (e: PointerEvent) => {
      // Nothing is painted until the pointer has actually been somewhere. Before the first move
      // both nodes sit at the origin of their transform, which put a stray ring in the middle of
      // the page for anyone who landed and started scrolling without moving the mouse.
      if (root.dataset.cursorLive !== "true") root.dataset.cursorLive = "true";
      x = e.clientX;
      y = e.clientY;
      dot.style.setProperty("--cx", `${x}px`);
      dot.style.setProperty("--cy", `${y}px`);

      // The ring grows over anything clickable, so the cursor itself reports affordance.
      const overControl = (e.target as Element | null)?.closest?.("a, button, [role='button'], input, select, textarea");
      ring.style.setProperty("--c-scale", overControl ? "1.55" : "1"); // verify-figures-ignore — cursor ring scale
    };

    const follow = () => {
      // Critically damped chase: 0.18 is slow enough to read as a trail, fast enough not to feel
      // like the ring is broken.
      lagX += (x - lagX) * 0.18;
      lagY += (y - lagY) * 0.18;
      ring.style.setProperty("--cx-lag", `${lagX}px`);
      ring.style.setProperty("--cy-lag", `${lagY}px`);
      frame = requestAnimationFrame(follow);
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(follow);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
      document.body.classList.remove("fx-cursor-host");
      delete root.dataset.cursorLive;
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dotRef} className="fx-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="fx-cursor-ring" aria-hidden="true" />
    </>
  );
}
