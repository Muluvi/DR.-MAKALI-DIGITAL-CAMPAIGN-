"use client";

import { useEffect, useSyncExternalStore } from "react";

import { SECTIONS, type TabId } from "../lib/heading-slug";

const STORAGE_KEY = "kitui2027:read";
const VALID = new Set(SECTIONS.map((s) => s.id) as string[]);

/**
 * Which of the nine sections this reader has opened.
 *
 * A 200-minute document read on a phone across several sittings has one navigational question
 * the index cannot answer: which parts have I already been through? Nine tabs look identical
 * whether you have read them or not.
 *
 * Kept in localStorage, per browser, and never sent anywhere — this is a confidential link-only
 * document and reading progress is the reader's own business. A private window, cleared site
 * data or a second device simply starts empty, which is why every access is guarded and the
 * empty state renders correctly.
 *
 * Built as an external store rather than state-in-an-effect. Recording a visit is a write to
 * localStorage that several components may want to read, and `useSyncExternalStore` gives a
 * defined server snapshot with no cascading render on mount.
 */

const EMPTY: ReadonlySet<TabId> = new Set<TabId>();
let cache: ReadonlySet<TabId> = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function load(): ReadonlySet<TabId> {
  if (loaded) return cache;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const ids = (JSON.parse(raw) as string[]).filter((id) => VALID.has(id)) as TabId[];
      if (ids.length) cache = new Set(ids);
    }
  } catch {
    // Private windows and blocked site data both land here. Nothing to recover; stay empty.
  }
  return cache;
}

function record(tab: TabId) {
  const current = load();
  if (current.has(tab)) return;
  const next = new Set(current);
  next.add(tab);
  // A new Set identity is what tells useSyncExternalStore the snapshot changed. Returning the
  // same mutated Set would compare equal and never re-render.
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    // Storage refused. The in-memory set still works for this sitting.
  }
  notify();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function useReadingProgress(activeTab: TabId) {
  const visited = useSyncExternalStore(
    subscribe,
    () => load(),
    () => EMPTY,
  );

  // Writing to the store is not setState — the snapshot change is what re-renders subscribers,
  // and it happens once per section rather than on every render.
  useEffect(() => {
    record(activeTab);
  }, [activeTab]);

  return { visited };
}

/**
 * Reading time from a word count.
 *
 * 220 words a minute, because that is what the toolbar and the desktop rail already use and a
 * document should not quote two different reading times for the same section. Rounded up: a
 * section that takes four and a half minutes is a five-minute commitment to a reader deciding
 * whether to start it.
 */
export const WORDS_PER_MINUTE = 220;

export function readingMinutes(words: number): number {
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
