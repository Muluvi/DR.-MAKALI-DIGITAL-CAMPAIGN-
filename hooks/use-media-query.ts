"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A media query as reactive, SSR-safe state.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect` for a reason that is not stylistic:
 * setting state from an effect body to record a media query causes a cascading second render on
 * every mount, and React's lint rules now reject it. This subscribes to the query directly, so
 * the value is correct on the first client render and the server gets a defined answer.
 *
 * The server snapshot is always `false`. That is the safe direction for every caller here:
 * `(prefers-reduced-motion: reduce)` false means the markup ships with animation classes that a
 * reduced-motion reader's CSS then neutralises, and `(hover: hover)` false means the custom
 * cursor is absent from the server HTML and mounts only once the client confirms a fine pointer.
 * Guessing the other way would flash an effect at exactly the reader who asked not to see one.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => (typeof window === "undefined" ? false : window.matchMedia(query).matches),
    () => false
  );
}

/** The two queries this codebase asks about constantly. */
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
