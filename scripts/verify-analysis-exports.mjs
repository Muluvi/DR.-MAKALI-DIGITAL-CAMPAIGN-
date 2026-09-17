#!/usr/bin/env node
/**
 * Build guard: the analysis pipeline's figures keep their provenance all the way to the page.
 *
 * The pipeline in /analysis publishes JSON under a contract — every value carries its source,
 * tier, date, method and confidence, a Tier 3 figure is always marked "verify", and a modelled
 * figure is never "confirmed". The pipeline enforces that on export, and data/analysis-exports.ts
 * asserts it again at module load. Neither can stop someone hand-editing a JSON file in
 * data/analysis/ afterwards, which is exactly how a figure quietly loses the marker that says
 * it is unconfirmed.
 *
 * This runs the same contract as a build step, and additionally checks the two published copies
 * have not drifted apart: data/analysis/ is what the site imports, public/content/analysis/ is
 * what a reader can fetch and check. If those two disagree, the page and its receipts disagree.
 *
 * To change any figure here, change the data pack or the assumptions and re-run the pipeline:
 *   cd analysis && python -m src.run_all && python -m src.publish --approved
 *
 * Runs as part of `npm run verify`. (Note: this repo has no `prebuild` script, despite what
 * some sibling guards' comments say — `npm run verify` is the chain that actually runs.)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data", "analysis");
const PUBLIC_DIR = path.join(ROOT, "public", "content", "analysis");
const COMPONENT_DIR = path.join(ROOT, "components", "markdown");

const REQUIRED = ["value", "unit", "source_id", "tier", "as_of", "method", "status"];
const METHODS = new Set(["official", "calculated", "modelled"]);
const STATUSES = new Set(["confirmed", "verify", "placeholder"]);

/** Never publishable to a public URL — see analysis/config/assumptions.yaml. */
const NEVER_PUBLISH = new Set([
  "vulnerabilities", "rival_analysis", "holdout_assignments", "nomination_leverage",
]);

const errors = [];
const fail = (msg) => errors.push(msg);

if (!fs.existsSync(DATA_DIR)) {
  console.error(`verify-analysis-exports: ${path.relative(ROOT, DATA_DIR)} is missing. Run the pipeline.`);
  process.exit(1);
}

const charts = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json") && f !== "manifest.json");
if (charts.length === 0) fail("no analysis exports found in data/analysis/");

let valueCount = 0;
for (const file of charts) {
  const id = path.basename(file, ".json");
  const chart = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));

  if (chart.id !== id) fail(`${file}: declares id "${chart.id}"`);
  if (NEVER_PUBLISH.has(id)) fail(`${file}: "${id}" is on the never-publish list but was published`);
  if (!Array.isArray(chart.values) || chart.values.length === 0) fail(`${file}: carries no values`);

  for (const v of chart.values ?? []) {
    valueCount++;
    const where = `${file} / "${v.label}"`;
    for (const field of REQUIRED) {
      if (!(field in v)) fail(`${where}: missing "${field}"`);
    }
    if (!METHODS.has(v.method)) fail(`${where}: method "${v.method}" is not official/calculated/modelled`);
    if (!STATUSES.has(v.status)) fail(`${where}: status "${v.status}" is not confirmed/verify/placeholder`);
    if (v.tier === 3 && v.status !== "verify") fail(`${where}: Tier 3 figure is not marked "verify"`);
    if (v.method === "modelled" && v.status === "confirmed") fail(`${where}: modelled figure marked "confirmed"`);
    if (!v.source_id) fail(`${where}: no source_id`);
    if (!v.as_of) fail(`${where}: no as_of date`);
  }

  // The served copy must match the imported copy, byte for byte.
  const servedPath = path.join(PUBLIC_DIR, file);
  if (!fs.existsSync(servedPath)) {
    fail(`${file}: imported by the site but not served from public/content/analysis/`);
  } else if (fs.readFileSync(servedPath, "utf8") !== fs.readFileSync(path.join(DATA_DIR, file), "utf8")) {
    fail(`${file}: the served copy and the imported copy have drifted apart`);
  }
}

// Every id a component asks for must exist, or the block renders nothing and says nothing.
const referenced = new Set();
for (const file of fs.readdirSync(COMPONENT_DIR).filter((f) => f.endsWith(".tsx"))) {
  const src = fs.readFileSync(path.join(COMPONENT_DIR, file), "utf8");
  for (const m of src.matchAll(/analysisExport\(\s*"([^"]+)"\s*\)/g)) referenced.add(m[1]);
}
for (const id of referenced) {
  if (!charts.includes(`${id}.json`)) fail(`a component references analysisExport("${id}") but no such export exists`);
}

if (errors.length > 0) {
  console.error("verify-analysis-exports FAILED:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `Analysis export check passed: ${charts.length} exports, ${valueCount} values, all carrying ` +
  `source, tier, date, method and status; ${referenced.size} referenced by components; ` +
  `served and imported copies identical.`
);
