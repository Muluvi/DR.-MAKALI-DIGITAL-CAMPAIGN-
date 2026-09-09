#!/usr/bin/env node
/**
 * Build guard: every deep link ever minted for this document must still resolve.
 *
 * The document is one route with fragment identifiers ("#evidence-sec-1-3-2"), so a browser never
 * sends the fragment to the server and a next.config redirect cannot help. The only mechanism
 * that can preserve a shared link is the client-side LEGACY_IDS map in lib/heading-slug.ts.
 *
 * That map now carries three generations of ids and 608 entries, which is far past what anyone
 * can check by reading. This asserts, mechanically, that:
 *
 *   - every key resolves, through resolveLegacySectionId, to a heading that exists today; and
 *   - every heading that exists today is reachable by its own id.
 */
import { liveIds, slugMap } from "../lib/content.mjs";
import { fail, pass, runIfMain } from "../lib/report.mjs";

export const name = "deep-links";

export function run() {
  const live = liveIds();
  const aliases = slugMap("TAB_ALIASES");
  const legacy = slugMap("LEGACY_IDS");

  /** Mirrors resolveLegacySectionId in lib/heading-slug.ts. */
  function resolve(id) {
    if (live.has(id)) return id;
    const [tab, ...rest] = id.split("-sec-");
    if (!rest.length) return id;
    const canonical = `${aliases[tab] ?? tab}-sec-${rest.join("-sec-")}`;
    const target = legacy[canonical];
    if (!target) return id;
    return live.has(target) ? target : id;
  }

  const errors = [];
  for (const key of Object.keys(legacy)) {
    if (!live.has(resolve(key))) errors.push(`legacy id "${key}" resolves to nothing (maps to "${legacy[key]}").`);
  }
  for (const id of live) {
    if (resolve(id) !== id) errors.push(`live id "${id}" does not resolve to itself.`);
  }

  if (errors.length) return fail("broken deep links.", errors);
  return pass(`${Object.keys(legacy).length} legacy ids and ${live.size} live ids all resolve.`);
}

await runIfMain(import.meta.url, { name, run });
