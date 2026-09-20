"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Brief or Full, and why the document has the choice at all.
 *
 * The proposal is 63,433 words — the hero says 289 minutes, and it is telling the truth. It is
 * opened from a WhatsApp link, on a phone, by a reader deciding whether to spend an hour on it.
 * 289 minutes is not an invitation.
 *
 * Brief does not shorten the document. It shortens the FIRST READ: every subsection opens on its
 * lead paragraph, its callouts and its figures, and the remaining prose sits behind one
 * disclosure. Nothing is deleted, nothing is summarised, and every word is one tap away — which
 * is what lets the site get shorter without breaking the brief's first hard rule.
 *
 * THREE THINGS ALWAYS OPEN IN FULL, whatever the mode:
 *   - a deep link, because a shared §13.4.3 link must land on §13.4.3 and not on a closed drawer;
 *   - print and Save as PDF, because a printed briefing kit is the document of record, and the
 *     folded prose stays in the DOM precisely so the print stylesheet can reveal it;
 *   - find-in-page, as far as the browser supports it.
 *
 * WHY useSyncExternalStore AND NOT useState + useEffect. The reader's choice lives in
 * localStorage, which React does not own and cannot render from directly. Reading it in an effect
 * and calling setState means a second render on every mount and, on this page, a visible collapse
 * and re-expansion for anyone who chose Full. Subscribing to it as an external store gives the
 * right value on the first client render, gives the server a defined answer, and keeps two open
 * tabs in step through the `storage` event. It is the same pattern hooks/use-media-query.ts uses
 * for the same reason.
 */
export type ReadingMode = "brief" | "full";

const STORAGE_KEY = "kitui2027:reading-mode";

function readStored(): ReadingMode | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "full" || raw === "brief" ? raw : null;
  } catch {
    // Private browsing, blocked storage, or a quota error. Not a reason to fail to render.
    return null;
  }
}

/**
 * The client's current answer, cached.
 *
 * The cache is not an optimisation — useSyncExternalStore requires a snapshot that is stable
 * between notifications, and a function that read localStorage on every call would return a new
 * value identity each time and loop.
 */
let current: ReadingMode | null = null;
const listeners = new Set<() => void>();

function snapshot(): ReadingMode {
  if (current !== null) return current;
  // A reader who arrived on a deep link asked for a specific passage, so give them the passage:
  // the document opens in Full rather than landing them on a closed disclosure. This is resolved
  // once, at first read, so it cannot fight a reader who then chooses Brief.
  if (typeof window !== "undefined" && window.location.hash.length > 1) {
    current = "full";
    return current;
  }
  current = readStored() ?? "brief";
  return current;
}

/** The server has no localStorage and no hash. Brief is the default, and the default is Brief. */
const serverSnapshot = (): ReadingMode => "brief";

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  const onHashChange = () => {
    if (window.location.hash.length > 1 && current !== "full") {
      current = "full";
      notify();
    }
  };
  // Another tab changed the preference. Keeping them in step costs one listener.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    const next = readStored() ?? "brief";
    if (next !== current) {
      current = next;
      notify();
    }
  };

  window.addEventListener("hashchange", onHashChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("hashchange", onHashChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function setReadingMode(next: ReadingMode): void {
  if (current === next) return;
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // The choice still applies to this visit; it just will not be remembered.
  }
  notify();
}

export function useReadingMode(): { mode: ReadingMode; setMode: (mode: ReadingMode) => void } {
  const mode = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const setMode = useCallback((next: ReadingMode) => setReadingMode(next), []);
  return { mode, setMode };
}

/**
 * Kept as a component so the tree reads the way it did, and so a future change of mechanism has
 * one place to land. The store is module-level, so this renders its children unchanged.
 */
export function ReadingModeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
