#!/usr/bin/env node
/**
 * Build guard: every component mount point must name a heading that exists.
 *
 * MarkdownViewer mounts most of the document's visualisations from HEADING_INSERTS, a map keyed
 * by "<tab>-sec-<slug>". If a heading moves file or changes number and the key does not, the
 * component silently stops rendering — no error, no failed build, no missing import. That has
 * already happened once in this repo: HEADING_INSERTS' own comment records components keyed at
 * two or three ids at once, rendering the same chart up to three times in a section.
 *
 * This makes the failure loud. It rebuilds the section index from public/content/*.md using the
 * same rules as lib/section-index.ts, and fails the build naming any key that points nowhere.
 *
 * Runs as a `prebuild` step alongside verify-ward-register.mjs and verify-figures.mjs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "public", "content");

// The tab id for each content file, mirroring FILES in app/page.tsx.
const TABS = {
  "cover.md": "cover",
  "summary.md": "summary",
  "situation.md": "situation",
  "objectives.md": "objectives",
  "audiences.md": "audiences",
  "approach.md": "approach",
  "messaging.md": "messaging",
  "scope-platforms.md": "scope-platforms",
  "scope-media.md": "scope-media",
  "scope-ground.md": "scope-ground",
  "scope-data.md": "scope-data",
  "roadmap.md": "roadmap",
  "deliverables.md": "deliverables",
  "measurement.md": "measurement",
  "governance.md": "governance",
  "risk.md": "risk",
  "structure.md": "structure",
  "assumptions.md": "assumptions",
  "nextsteps.md": "nextsteps",
};

const LEADING = /^(\d+(?:\.\d+)*)\.?\s/;
const HEADING = /^(#{2,3})\s+(.+?)\s*$/;

function cleanTitle(raw) {
  return raw
    .replace(/\*\((new|updated)\)\*/gi, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/\s*\$?\\?ge\s*[\d,]+\$?/g, "")
    .trim();
}

/** Every id the document actually offers today. */
function liveIds() {
  const ids = new Set();
  for (const [file, tab] of Object.entries(TABS)) {
    const full = path.join(CONTENT, file);
    if (!fs.existsSync(full)) {
      console.error(`verify-mounts: content file missing: public/content/${file}`);
      process.exit(1);
    }
    let inFence = false;
    for (const line of fs.readFileSync(full, "utf8").split("\n")) {
      if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
      if (inFence) continue;
      const m = HEADING.exec(line);
      if (!m) continue;
      const num = LEADING.exec(cleanTitle(m[2]).trim());
      if (!num) continue;
      ids.add(`${tab}-sec-${num[1].replace(/\./g, "-")}`);
    }
  }
  return ids;
}

/** The keys of HEADING_INSERTS, read straight out of the source. */
function mountKeys() {
  const src = fs.readFileSync(path.join(ROOT, "components", "MarkdownViewer.tsx"), "utf8");
  const start = src.indexOf("const HEADING_INSERTS");
  const end = src.indexOf("\n};", start);
  if (start === -1 || end === -1) {
    console.error("verify-mounts: could not find HEADING_INSERTS in components/MarkdownViewer.tsx");
    process.exit(1);
  }
  return [...src.slice(start, end).matchAll(/^\s*"([a-z][a-z-]*-sec-[\d-]+)":/gm)].map((m) => m[1]);
}

const ids = liveIds();
const keys = mountKeys();
const orphans = keys.filter((k) => !ids.has(k));
const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);

const errors = [];
for (const k of orphans) errors.push(`HEADING_INSERTS key "${k}" names no heading in public/content.`);
for (const k of new Set(duplicates)) errors.push(`HEADING_INSERTS key "${k}" is declared more than once.`);

if (errors.length) {
  console.error("\nverify-mounts: component mount points do not match the document.\n");
  for (const e of errors) console.error(`  - ${e}`);
  console.error(`\n${keys.length} keys checked against ${ids.size} headings.\n`);
  process.exit(1);
}

console.log(`verify-mounts: ${keys.length} mount points all resolve (${ids.size} headings indexed).`);
