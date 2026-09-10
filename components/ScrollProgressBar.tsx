"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fixed top progress bar. Primary implementation is pure CSS —
 * `animation-timeline: scroll()` drives a scaleX transform with no JS and no
 * layout shift (see .scroll-progress-fill in globals.css). Browsers without
 * scroll-driven animation support (detected once, no per-frame cost from the
 * feature check itself) fall back to a throttled scroll-listener that sets
 * the same transform manually.
 */
function detectNeedsFallback() {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") return true;
  return !CSS.supports("animation-timeline: scroll()");
}

export function ScrollProgressBar() {
  const [isMounted, setIsMounted] = useState(false);
  const [needsFallback, setNeedsFallback] = useState(false);
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const rafMount = requestAnimationFrame(() => {
      setIsMounted(true);
      if (detectNeedsFallback()) {
        setNeedsFallback(true);
      }
    });

    // The scroll listener runs whether or not CSS is driving the bar. Where CSS drives it the
    // listener is not painting anything — it is keeping aria-valuenow true, and a slider that
    // reports 0% for the whole document is worse than no slider.
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(totalHeight > 0 ? Math.min(1, window.scrollY / totalHeight) : 0);
        ticking.current = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafMount);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  /**
   * Tap the rail to jump to that point in the section.
   *
   * A progress rail that only reports is half a control: it is already the one element on screen
   * that maps the whole document to a line, so the reader who can see they are a third of the
   * way through should be able to put themselves two thirds of the way through. The hit area is
   * a transparent 44px band over a 4px rail — the rail stays hairline, the target does not.
   *
   * Keyboard: Home and End for the ends, arrows for 5% steps, so it is operable without a
   * pointer. `scroll-behavior: smooth` on <html> already carries the movement, and a reader with
   * prefers-reduced-motion has that turned off by the same stylesheet — so the jump is instant
   * for them, which is the correct degradation for a control whose job is arrival, not travel.
   *
   * The band is 20px, not the 44px a tap target normally gets. It is fixed at z-50 across the
   * full width, directly over the sticky toolbar, and at 44px it swallowed the toolbar's own
   * controls. Twenty pixels clears them and is still a deliberate target; the keyboard path
   * below is the full-size equivalent, which is what the exemption for a control this shape
   * asks for.
   */
  const jumpTo = (fraction: number) => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    window.scrollTo({ top: Math.max(0, Math.min(1, fraction)) * total });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const current = total > 0 ? window.scrollY / total : 0;
    const step = 0.05;
    const map: Record<string, number> = {
      Home: 0,
      End: 1,
      ArrowLeft: current - step,
      ArrowRight: current + step,
      ArrowDown: current + step,
      ArrowUp: current - step,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    jumpTo(map[e.key]);
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 print:hidden h-5 flex items-start pt-1.5 cursor-pointer group"
      role="slider"
      tabIndex={0}
      aria-label="Reading progress — tap or use arrow keys to jump"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-valuetext={`${Math.round(progress * 100)} per cent through this section`}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        jumpTo((e.clientX - rect.left) / rect.width);
      }}
    >
      <div className="scroll-progress-track relative w-full h-[2px] group-hover:h-[3px] group-focus-visible:h-[3px] bg-line/30 transition-[height] duration-150">
        <div
          className="scroll-progress-fill h-full origin-left bg-accent transition-transform duration-75"
          style={needsFallback ? { transform: `scaleX(${progress})` } : undefined}
        />
      </div>
    </div>
  );
}

