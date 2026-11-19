"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A soft ring on the first thing to tap (visual upgrade, A9).
 *
 * It pulses three times and stops, so it is an event, not an ambient loop (MOTION-SYSTEM.md). Once
 * the reader has used the control it never shows again on this phone, remembered under `id`.
 * Hidden under reduced motion by the CSS (`.tap-hint`), and never announced: the control it marks
 * already says what it does.
 */

const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

function seen(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function useTapHint(id: string) {
  const key = `tap-hint:${id}`;
  // The server and hydration agree on "no hint"; the stored answer arrives in the same commit as
  // the subscription, so there is no mismatch and no effect writing state.
  const show = useSyncExternalStore(subscribe, () => !seen(key), () => false);
  const used = useCallback(() => {
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      /* storage blocked: the hint simply returns next visit */
    }
    listeners.forEach((fn) => fn());
  }, [key]);
  return { show, used };
}

export function TapHint({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="tap-hint" aria-hidden="true" />;
}
