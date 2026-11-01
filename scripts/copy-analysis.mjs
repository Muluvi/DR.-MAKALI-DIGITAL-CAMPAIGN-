#!/usr/bin/env node
/**
 * Serves the analysis exports: copies data/analysis/*.json to public/content/analysis/ at build.
 *
 * data/analysis/ is the one editable copy (the site imports it; the pipeline publishes to it).
 * public/content/analysis/ is what a reader can fetch and check, and it is generated here, not
 * committed (consolidation pass, Step 2), so the two can never drift apart.
 *
 * Runs in `prebuild`, `predev` and `content`.
 *
 *     node scripts/copy-analysis.mjs           # copy
 *     node scripts/copy-analysis.mjs --check   # fail if a served file is missing or differs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FROM = path.join(ROOT, "data", "analysis");
const TO = path.join(ROOT, "public", "content", "analysis");
const files = fs.readdirSync(FROM).filter((f) => f.endsWith(".json")).sort();

if (process.argv.includes("--check")) {
  const bad = files.filter((f) => !fs.existsSync(path.join(TO, f)) || fs.readFileSync(path.join(TO, f), "utf8") !== fs.readFileSync(path.join(FROM, f), "utf8"));
  if (bad.length) {
    console.error(`copy-analysis: ${bad.length} served file(s) missing or stale: ${bad.join(", ")}. Run: node scripts/copy-analysis.mjs`);
    process.exit(1);
  }
  console.log(`copy-analysis: ${files.length} served files match data/analysis/`);
} else {
  fs.rmSync(TO, { recursive: true, force: true });
  fs.mkdirSync(TO, { recursive: true });
  for (const f of files) fs.copyFileSync(path.join(FROM, f), path.join(TO, f));
  console.log(`copy-analysis: ${files.length} files served from public/content/analysis/`);
}
