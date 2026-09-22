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

/**
 * Has the reader asked their browser to use less data?
 *
 * `prefers-reduced-data` is the standards-track media query and is still not widely implemented,
 * so `navigator.connection.saveData` — the Data Saver flag, which Chrome on Android exposes and
 * which is the one a reader in Kitui is most likely to have switched on — is checked alongside it.
 * Either is taken as a yes.
 *
 * The server snapshot is `false`, matching the rest of this file: the markup ships without the
 * heavy thing, and the client decides whether to offer it. Guessing the other way would serve the
 * expensive version to precisely the reader who asked not to receive it.
 */
export function useSaveData(): boolean {
  const prefersReducedData = useMediaQuery("(prefers-reduced-data: reduce)");

  const subscribe = useCallback((onChange: () => void) => {
    if (typeof navigator === "undefined") return () => {};
    const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
    connection?.addEventListener("change", onChange);
    return () => connection?.removeEventListener("change", onChange);
  }, []);

  const saveDataFlag = useSyncExternalStore(
    subscribe,
    () =>
      typeof navigator !== "undefined" &&
      Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData),
    () => false
  );

  return prefersReducedData || saveDataFlag;
}
