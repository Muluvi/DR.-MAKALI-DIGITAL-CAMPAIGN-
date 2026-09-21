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
 *
 * Runs as a `prebuild` step alongside the other guards.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contentTabs } from "./content-routes.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "public", "content");

const TABS = contentTabs();

const LEADING = /^((?:\d+[A-Z]?(?:\.\d+)*|[A-G](?:\.\d+)+))\.?\s/;
const HEADING = /^(#{2,3})\s+(.+?)\s*$/;
const clean = (raw) =>
  raw.replace(/\*\((new|updated)\)\*/gi, "").replace(/\*\*/g, "").replace(/\*/g, "")
     .replace(/`/g, "").replace(/\s*\$?\\?ge\s*[\d,]+\$?/g, "").trim();

const liveIds = new Set();
for (const [file, tab] of Object.entries(TABS)) {
  let inFence = false;
  for (const line of fs.readFileSync(path.join(CONTENT, file), "utf8").split("\n")) {
    if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = HEADING.exec(line);
    if (!m) continue;
    const num = LEADING.exec(clean(m[2]).trim());
    if (num) liveIds.add(`${tab}-sec-${num[1].replace(/\./g, "-").toLowerCase()}`);
  }
}

// Read the maps from exactly what ships, so this guard cannot drift from it.
//
// LEGACY_IDS outgrew the source file at the 2026 restructure — composing three earlier
// generations through a fourth renumbering took it past a thousand entries — and it now lives in
// lib/legacy-ids.json, imported by lib/heading-slug.ts. TAB_ALIASES is still read out of the
// source, and is now empty: it keyed on an id's old TAB, which stopped carrying information the
// moment section numbers themselves moved.
const src = fs.readFileSync(path.join(ROOT, "lib", "heading-slug.ts"), "utf8");
const slice = (name) => {
  const start = src.indexOf(`const ${name}`);
  const end = src.indexOf("\n};", start);
  if (start === -1 || end === -1) return {};
  return Object.fromEntries([...src.slice(start, end).matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]));
};
const ALIASES = slice("TAB_ALIASES");
const LEGACY = JSON.parse(fs.readFileSync(path.join(ROOT, "lib", "legacy-ids.json"), "utf8"));

/** Mirrors resolveLegacySectionId in lib/heading-slug.ts. */
function resolve(id) {
  if (liveIds.has(id)) return id;
  const [tab, ...rest] = id.split("-sec-");
  if (!rest.length) return id;
  const canonical = `${ALIASES[tab] ?? tab}-sec-${rest.join("-sec-")}`;
  const target = LEGACY[canonical];
  if (!target) return id;
  return liveIds.has(target) ? target : id;
}

const errors = [];
for (const key of Object.keys(LEGACY)) {
  if (!liveIds.has(resolve(key))) errors.push(`legacy id "${key}" resolves to nothing (maps to "${LEGACY[key]}").`);
}
for (const id of liveIds) {
  if (resolve(id) !== id) errors.push(`live id "${id}" does not resolve to itself.`);
}

if (errors.length) {
  console.error("\nverify-deep-links: broken deep links.\n");
  for (const e of errors.slice(0, 25)) console.error(`  - ${e}`);
  if (errors.length > 25) console.error(`  ... and ${errors.length - 25} more.`);
  process.exit(1);
}

console.log(
  `verify-deep-links: ${Object.keys(LEGACY).length} legacy ids and ${liveIds.size} live ids all resolve.`
);
