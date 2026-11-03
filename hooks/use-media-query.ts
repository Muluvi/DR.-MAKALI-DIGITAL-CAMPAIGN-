"use client";

import { useEffect, useState } from "react";

/**
 * A media query as reactive, hydration-safe state.
 *
 * Initialized to `false` to match the server snapshot and initial client hydration render pass,
 * preventing React hydration mismatch when client browser preferences (reduced motion, hover, etc.)
 * differ from the server's default render.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    const id = requestAnimationFrame(() => setMatches(mql.matches));
    mql.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(id);
      mql.removeEventListener("change", onChange);
    };
  }, [query]);

  return matches;
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
 */
export function useSaveData(): boolean {
  const prefersReducedData = useMediaQuery("(prefers-reduced-data: reduce)");
  const [saveDataFlag, setSaveDataFlag] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const conn = (
      navigator as Navigator & {
        connection?: {
          saveData?: boolean;
          addEventListener?: (type: string, listener: () => void) => void;
          removeEventListener?: (type: string, listener: () => void) => void;
        };
      }
    ).connection;
    if (!conn) return;
    const onChange = () => setSaveDataFlag(Boolean(conn.saveData));
    const id = requestAnimationFrame(() => setSaveDataFlag(Boolean(conn.saveData)));
    conn.addEventListener?.("change", onChange);
    return () => {
      cancelAnimationFrame(id);
      conn.removeEventListener?.("change", onChange);
    };
  }, []);

  return prefersReducedData || saveDataFlag;
}
