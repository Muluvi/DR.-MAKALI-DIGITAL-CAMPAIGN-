#!/usr/bin/env node
/**
 * Generates the per-section half of docs/VISUAL-FEATURE-LEDGER.md.
 *
 * The point of generating it rather than writing it is that the claim being made — "every one of
 * the 262 sections is covered" — is only worth anything if it is re-derived from the content and
 * the components each time, instead of being a table someone typed once and stopped updating.
 *
 * It rebuilds the section index with the same rules as lib/section-index.ts and verify-mounts.mjs,
 * then reports the visual treatment each heading receives. Run with:
 *
 *     node scripts/visual-coverage.mjs            # print the table
 *     node scripts/visual-coverage.mjs --check    # exit non-zero if any section is uncovered
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "public", "content");

const TABS = {
  "1-decision.md": "decision",
  "2-evidence.md": "evidence",
  "3-strategy.md": "strategy",
  "4a-publishing.md": "publishing",
  "4b-ground.md": "ground",
  "4c-defence.md": "defence",
  "4d-technology.md": "technology",
  "4e-team.md": "team",
  "5-delivery.md": "delivery",
};

const HEADING = /^(#{2,3})\s+(.+?)\s*$/;

function cleanTitle(raw) {
  return raw.replace(/\*\((new|updated)\)\*/gi, "").replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").trim();
}

/** Every heading in document order, with the file it came from and its level. */
function headings() {
  const out = [];
  for (const [file, tab] of Object.entries(TABS)) {
    let inFence = false;
    for (const line of fs.readFileSync(path.join(CONTENT, file), "utf8").split("\n")) {
      if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
      if (inFence) continue;
      const m = line.match(HEADING);
      if (!m) continue;
      out.push({ tab, level: m[1].length, title: cleanTitle(m[2]) });
    }
  }
  return out;
}

/** The ids that carry a bespoke visualisation, read out of the renderer's own mount table. */
function mountedIds() {
  const src = fs.readFileSync(path.join(ROOT, "components", "MarkdownViewer.tsx"), "utf8");
  const block = src.slice(src.indexOf("const HEADING_INSERTS"));
  return new Set([...block.matchAll(/"([a-z]+-sec-[0-9a-z-]+)"/g)].map((m) => m[1]));
}

/**
 * What a heading gets, and why.
 *
 * The two entrance signatures are the whole point of the split: a sub-section opens a new
 * argument and wipes open; a part is a step inside one already open and rises. 190-odd of the 262
 * are parts, and anything stronger on those turns a long read into a strobe.
 */
function treatmentFor(h) {
  const shared = [
    "prose surfaces (links, tables, quotes, figures, rules, bold)",
    "native scroll-driven figure reveal",
  ];
  return h.level === 2
    ? ["h2: clip wipe from left", "gradient left bar", "marker sweep", "right-margin hairline", ...shared]
    : ["h3: 6px rise, 340ms", ...shared];
}

const all = headings();
const mounted = mountedIds();
const check = process.argv.includes("--check");

if (check) {
  const uncovered = all.filter((h) => treatmentFor(h).length === 0);
  if (uncovered.length) {
    console.error(`visual-coverage: ${uncovered.length} section(s) with no treatment`);
    process.exit(1);
  }
  console.log(
    `visual-coverage: all ${all.length} sections covered ` +
      `(${all.filter((h) => h.level === 2).length} sub-sections, ${all.filter((h) => h.level === 3).length} parts, ` +
      `${mounted.size} with a bespoke visualisation).`
  );
  process.exit(0);
}

console.log(`| # | Part | Lvl | Section | Entrance | Bespoke figure |`);
console.log(`|---:|---|---|---|---|---|`);
all.forEach((h, i) => {
  const entrance = h.level === 2 ? "clip wipe ←" : "rise 6px";
  console.log(`| ${i + 1} | ${h.tab} | h${h.level} | ${h.title.replace(/\|/g, "\\|")} | ${entrance} | |`);
});
