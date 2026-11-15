"use client";

import { useEffect, useState } from "react";
import type { LiveSnapshot } from "@/lib/live/snapshot";

/**
 * The story's live layer, fetched once per page and shared by every chapter that draws it. A save
 * anywhere on the page fires "live:changed", which fetches it again, so a record added inside a
 * chapter appears in that chapter's chart and in the header's last-update line at once.
 */
let cache: LiveSnapshot | null = null;
let pending: Promise<LiveSnapshot | null> | null = null;
const listeners = new Set<(s: LiveSnapshot | null) => void>();

function load(force = false): Promise<LiveSnapshot | null> {
  if (pending && !force) return pending;
  pending = fetch("/api/live", { cache: "no-store" })
    .then((r) => (r.ok ? (r.json() as Promise<LiveSnapshot>) : null))
    .catch(() => null)
    .then((s) => { cache = s; listeners.forEach((l) => l(s)); return s; });
  return pending;
}

if (typeof window !== "undefined") window.addEventListener("live:changed", () => void load(true));

export function useLive(): { live: LiveSnapshot | null; ready: boolean } {
  const [live, setLive] = useState<LiveSnapshot | null>(cache);
  const [ready, setReady] = useState(cache !== null);
  useEffect(() => {
    const l = (s: LiveSnapshot | null) => { setLive(s); setReady(true); };
    listeners.add(l);
    if (!cache) void load().then(l);
    return () => { listeners.delete(l); };
  }, []);
  return { live, ready };
}

export const announceLiveChange = () => window.dispatchEvent(new Event("live:changed"));

/** "3 minutes ago", "yesterday", "12 Nov". */
export function ago(iso: string | null): string {
  if (!iso) return "";
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 172800) return "yesterday";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
