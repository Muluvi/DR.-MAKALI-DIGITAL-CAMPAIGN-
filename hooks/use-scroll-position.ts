"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * One scroll listener for the whole page.
 *
 * Four components and hooks each attached their own passive listener with its own
 * requestAnimationFrame throttle, and each recomputed the same two numbers from them:
 * ScrollProgressBar (document progress), QuickNavCapsule (past 400px?), useChromeVisible
 * (direction) and useScrollShell (direction, again). On a document this long that is four
 * handlers and up to four rAF callbacks per scroll frame to answer one question.
 *
 * Worse than the cost: they were four separate opinions. use-chrome-visible's own doc comment
 * records the floating capsules and the nav dock disagreeing about when to withdraw, and fixes
 * it by copying MobileBottomNav's thresholds into itself. Copied thresholds drift; one source
 * cannot.
 *
 * Built as an external store rather than state in an effect, so a component reads the correct
 * value on its first client render and the server gets a defined answer, with no cascading
 * second render on mount.
 */

export interface ScrollState {
  /** window.scrollY at the last frame. */
  y: number;
  /** Change since the previous frame, sub-pixel noise included. */
  dy: number;
  /** Last movement over the 6px threshold that counts as a deliberate scroll. */
  direction: "up" | "down";
  /** 0 to 1 through the document. */
  progress: number;
  /**
   * Whether the floating page chrome should be on screen.
   *
   * Carried in the broker rather than derived by each consumer because it is stateful — it
   * depends on the previous answer as well as the current position — and the previous answer
   * lives here. Deriving it in a selector would mean a selector that mutates, and
   * useSyncExternalStore requires selectors to be pure.
   *
   * Reveal near the top of the page or on any meaningful upward scroll; withdraw on a
   * deliberate downward one. MobileBottomNav established these thresholds and every other
   * floating element used to carry its own copy of them.
   */
  chromeVisible: boolean;
}

const INITIAL: ScrollState = { y: 0, dy: 0, direction: "up", progress: 0, chromeVisible: true };

let state = INITIAL;
let frame = 0;
const listeners = new Set<() => void>();

function read() {
  frame = 0;
  const y = window.scrollY;
  const dy = y - state.y;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;

  state = {
    y,
    dy,
    // A 6px threshold stops the header flickering on the sub-pixel scroll a trackpad or a
    // momentum tail produces at rest.
    direction: Math.abs(dy) > 6 ? (dy > 0 ? "down" : "up") : state.direction,
    progress: scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0,
    chromeVisible: y < 80 ? true : dy > 14 && y > 150 ? false : dy < -10 ? true : state.chromeVisible,
  };
  listeners.forEach((l) => l());
}

const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(read);
};

function subscribe(onChange: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    read();
  }
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

/**
 * Select one value out of the scroll state.
 *
 * Selecting rather than returning the whole object is what keeps this cheap: a component that
 * only cares whether the reader is past 400px re-renders when that boolean flips, not on every
 * frame of every scroll.
 */
export function useScrollSelector<T>(select: (s: ScrollState) => T): T {
  const get = useCallback(() => select(state), [select]);
  return useSyncExternalStore(subscribe, get, () => select(INITIAL));
}

const selectProgress = (s: ScrollState) => s.progress;

/** How far through the document the reader is, 0 to 1. */
export const useScrollProgress = () => useScrollSelector(selectProgress);

const selectChromeVisible = (s: ScrollState) => s.chromeVisible;

/** Whether the floating page chrome should be on screen. See ScrollState.chromeVisible. */
export const useChromeVisibleRaw = () => useScrollSelector(selectChromeVisible);

/** Whether the reader has scrolled past `px`. Re-renders only when the answer changes. */
export function useScrolledPast(px: number): boolean {
  const select = useCallback((s: ScrollState) => s.y > px, [px]);
  return useScrollSelector(select);
}
