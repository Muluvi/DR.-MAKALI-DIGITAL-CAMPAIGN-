"use client";

import { useEffect, useState } from "react";
import type { PublicCoverage } from "../../lib/network/coverage";

/**
 * The open aggregate (app/api/network/coverage/route.ts), fetched once per page and shared by every
 * network figure. `undefined` while loading, `null` when it could not be reached. It holds counts
 * and states only: no name, phone number or report ever reaches the browser through it.
 */
let pending: Promise<PublicCoverage | null> | null = null;

export function usePublicCoverage(): PublicCoverage | null | undefined {
  const [data, setData] = useState<PublicCoverage | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    pending ??= fetch("/api/network/coverage", { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? (r.json() as Promise<PublicCoverage>) : null))
      .catch(() => null);
    pending.then((d) => {
      if (live) setData(d);
    });
    return () => {
      live = false;
    };
  }, []);
  return data;
}
