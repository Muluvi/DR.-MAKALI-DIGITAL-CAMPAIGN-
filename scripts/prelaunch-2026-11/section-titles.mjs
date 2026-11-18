#!/usr/bin/env node
/**
 * lib/section-titles.generated.json: every numbered heading's printed number -> its id and the
 * words a reader sees, read from content/*.md (the same headings lib/section-index.ts indexes).
 * Text drawn outside the markdown renderer (figure specs, hand-built panels) uses it to name a
 * section instead of printing its number (lib/reader-text.ts). Run by prebuild; --check by verify.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, sectionIndex } from "./lib.mjs";

const OUT = path.join(ROOT, "lib", "section-titles.generated.json");
const map = Object.fromEntries(
  [...sectionIndex()].sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true })).map(([n, v]) => [n, { id: v.id, title: v.title.replace(/^Workstream \d+\s*[—–-]\s*/, "") }]),
);
const json = JSON.stringify(map, null, 1) + "\n";
if (process.argv.includes("--check")) {
  const now = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (now !== json) { console.error("section-titles: lib/section-titles.generated.json is stale; run node scripts/prelaunch-2026-11/section-titles.mjs"); process.exit(1); }
  console.log(`section-titles: ${Object.keys(map).length} headings, current`);
} else {
  fs.writeFileSync(OUT, json);
  console.log(`section-titles: ${Object.keys(map).length} headings written`);
}
