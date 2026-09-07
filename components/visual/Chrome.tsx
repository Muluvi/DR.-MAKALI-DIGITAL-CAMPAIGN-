"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useFinePointer, useReducedMotion } from "../../hooks/use-media-query";

/**
 * Page chrome that only exists once the reader has started reading: the back-to-top control, the
 * scroll-spy dots, and the custom cursor.
 *
 * All three are strictly additive. Nothing in the document depends on them, none of them traps
 * focus, and each one removes itself on the input modality it does not suit — the cursor never
 * mounts on touch, the dots never mount on a phone.
 */

export function BackToTop({ threshold = 900 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > threshold);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  const toTop = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={toTop}
      data-visible={visible}
      // `inert` rather than a conditional render: the button keeps its place in the layout and in
      // the tab order's geometry, and never becomes a focusable control the reader cannot see.
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className="fx-backtotop fx-glass fx-press fx-focus fixed right-4 z-40 hidden lg:grid place-items-center w-11 h-11 rounded-full text-accent bottom-6 print:hidden"
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}

interface NavDotsProps {
  sections: { id: string; label: string }[];
  onSelect: (id: string) => void;
}

/**
 * Scroll-spy dots down the right edge.
 *
 * The active section is resolved by an IntersectionObserver over the real section elements rather
 * than by comparing scroll offsets, so it stays correct when a lazy section changes height
 * underneath the reader — which, in a document that mounts fifty figures on demand, it does.
 */
export function NavDots({ sections, onSelect }: NavDotsProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        // The section closest to the top of the band wins, so a tall section does not keep the
        // marker while a short one scrolls past inside it.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace(/^section-/, ""));
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    const els = sections
      .map((s) => document.getElementById(`section-${s.id}`))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

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

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("fx-cursor-host");

    const root = document.documentElement;
    let lagX = window.innerWidth / 2;
    let lagY = window.innerHeight / 2;
    let x = lagX;
    let y = lagY;
    let frame = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      root.style.setProperty("--cx", `${x}px`);
      root.style.setProperty("--cy", `${y}px`);

      // The ring grows over anything clickable, so the cursor itself reports affordance.
      const overControl = (e.target as Element | null)?.closest?.("a, button, [role='button'], input, select, textarea");
      root.style.setProperty("--c-scale", overControl ? "1.55" : "1"); // verify-figures-ignore — cursor ring scale
    };

    const follow = () => {
      // Critically damped chase: 0.18 is slow enough to read as a trail, fast enough not to feel
      // like the ring is broken.
      lagX += (x - lagX) * 0.18;
      lagY += (y - lagY) * 0.18;
      root.style.setProperty("--cx-lag", `${lagX}px`);
      root.style.setProperty("--cy-lag", `${lagY}px`);
      frame = requestAnimationFrame(follow);
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(follow);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
      document.body.classList.remove("fx-cursor-host");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div className="fx-cursor-dot" aria-hidden="true" />
      <div className="fx-cursor-ring" aria-hidden="true" />
    </>
  );
}
