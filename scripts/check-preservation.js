#!/usr/bin/env node
/**
 * PRESERVATION CHECK. Compares the repository against scripts/preservation-manifest.json, the
 * snapshot taken at tag `pre-ownership-baseline` before the platform-ownership work began.
 *
 *   node scripts/check-preservation.js           check (fails on a missing file or a dropped count)
 *   node scripts/check-preservation.js --write   regenerate the manifest (baseline only, never to
 *                                                paper over a drop)
 *
 * It FAILS when a protected file is missing, or when any record, strategy or solution count is
 * lower than the baseline. It REPORTS, without failing, a protected file whose hash changed: an
 * intentional cross-reference edit is allowed, and the Preservation Audit lists each one with its
 * reason. Counts may rise (the team adds records); they may never fall.
 *
 * Run through npm so the TypeScript loader is registered:  npm run check:preservation
 */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { pathToFileURL } = require("node:url");

const ROOT = path.resolve(__dirname, "..");
const MANIFEST = path.join(__dirname, "preservation-manifest.json");

/** Protected trees: datasets, the data pack, strategy and solution content, existing tools. */
const PROTECTED_DIRS = [
  "data",
  "lib/data",
  "content",
  "analysis/config",
  "analysis/reports",
  "analysis/src",
  "components/phone",
  "components/tools",
  "components/charts",
  "components/terminal",
  "components/markdown",
  "components/register",
  "components/premium",
  "components/partviz",
  "app/tools",
];
const PROTECTED_FILES = ["lib/phases.ts", "lib/flow.ts", "lib/heading-slug.ts", "lib/content-files.ts", "lib/phone-showcase.ts"];

/** Data modules whose exported arrays and objects are counted record by record. */
const TS_MODULES = [
  "lib/data/figures.ts",
  "lib/phases.ts",
  "data/benchmarks.ts",
  "data/competitors.ts",
  "data/disputed-figures.ts",
  "data/drought-food-security.ts",
  "data/electoral-arithmetic.ts",
  "data/electoral-history.ts",
  "data/escalation.ts",
  "data/external-figures.ts",
  "data/fiscal-audit.ts",
  "data/kpis.ts",
  "data/media-ownership.ts",
  "data/message-architecture.ts",
  "data/mui-basin.ts",
  "data/nomination-path.ts",
  "data/projects.ts",
  "data/risks.ts",
  "data/segments.ts",
  "data/sources.ts",
  "data/terminal-showcase.ts",
  "data/tier-matrix.ts",
  "data/ussd-specimen.ts",
  "data/ward-register.ts",
  "data/analysis-exports.ts",
];

const walk = (rel) => {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return [];
  const st = fs.statSync(abs);
  if (st.isFile()) return [rel];
  return fs.readdirSync(abs).flatMap((n) => (n === "__pycache__" || n === "node_modules" ? [] : walk(path.join(rel, n))));
};
const sha = (rel) => crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");

function protectedFiles() {
  return [...new Set([...PROTECTED_DIRS.flatMap(walk), ...PROTECTED_FILES])].filter((f) => fs.existsSync(path.join(ROOT, f))).sort();
}

/** Record counts for one JSON dataset. */
function jsonCounts(rel) {
  const d = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
  const c = {};
  if (Array.isArray(d)) c.records = d.length;
  else if (d && typeof d === "object") {
    for (const [k, v] of Object.entries(d)) if (Array.isArray(v)) c[k] = v.length;
    if (Array.isArray(d.constituencies)) c.wards = d.constituencies.reduce((n, x) => n + (Array.isArray(x.wards) ? x.wards.length : 0), 0);
  }
  return c;
}

/** Counts for one content chapter: headings (sections), strategy and solution blocks. */
function contentCounts(rel) {
  const t = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const fences = (kind) => (t.match(new RegExp("^```" + kind + "\\s*$", "gm")) || []).length;
  return {
    headings: (t.match(/^#{1,6} /gm) || []).length,
    workstreams: (t.match(/^#{2,4} .*Workstream \d+/gm) || []).length,
    figureFences: fences("figure"),
    visualFences: fences("visual"),
    leadFences: fences("lead"),
    textversionFences: fences("textversion"),
    tableRows: (t.match(/^\|(?!\s*-).*\|\s*$/gm) || []).length,
    words: t.split(/\s+/).filter(Boolean).length,
  };
}

async function moduleCounts(rel) {
  const m = await import(pathToFileURL(path.join(ROOT, rel)).href);
  const c = {};
  for (const [k, v] of Object.entries(m)) {
    if (Array.isArray(v)) c[k] = v.length;
    else if (v && typeof v === "object") c[k] = Object.keys(v).length;
  }
  return c;
}

async function snapshot() {
  const files = {};
  for (const f of protectedFiles()) files[f] = sha(f);
  const counts = {};
  for (const f of Object.keys(files)) {
    if (f.endsWith(".json") && (f.startsWith("data/") || f.startsWith("lib/data/"))) counts[f] = jsonCounts(f);
    if (f.startsWith("content/") && f.endsWith(".md")) counts[f] = contentCounts(f);
    if (f.endsWith(".csv")) counts[f] = { rows: fs.readFileSync(path.join(ROOT, f), "utf8").trim().split("\n").length - 1 };
  }
  for (const f of TS_MODULES) counts[f] = await moduleCounts(f);
  return { files, counts };
}

async function main() {
  const write = process.argv.includes("--write");
  const now = await snapshot();
  if (write) {
    const out = {
      $comment: "Preservation baseline. Generated by scripts/check-preservation.js --write at tag pre-ownership-baseline. Counts may rise, never fall; a protected file may change only as a logged intentional edit.",
      baseline: "pre-ownership-baseline",
      generated: new Date().toISOString(),
      fileCount: Object.keys(now.files).length,
      files: now.files,
      counts: now.counts,
    };
    fs.writeFileSync(MANIFEST, JSON.stringify(out, null, 2) + "\n");
    console.log(`check-preservation: wrote ${out.fileCount} files and ${Object.keys(now.counts).length} count sets to ${path.relative(ROOT, MANIFEST)}`);
    return;
  }
  const base = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const failures = [];
  const changed = [];
  // On Vercel, paths in .vercelignore (the Python analysis pipeline) are deliberately not uploaded,
  // so they are absent by design there. CI checks them in full.
  const notUploaded = process.env.VERCEL && fs.existsSync(path.join(ROOT, ".vercelignore"))
    ? fs.readFileSync(path.join(ROOT, ".vercelignore"), "utf8").split("\n").map((l) => l.trim()).filter((l) => l.startsWith("/")).map((l) => l.slice(1))
    : [];
  let skipped = 0;
  for (const [f, h] of Object.entries(base.files)) {
    if (notUploaded.some((p) => f.startsWith(p))) { skipped++; continue; }
    if (!fs.existsSync(path.join(ROOT, f))) failures.push(`missing: ${f}`);
    else if (sha(f) !== h) changed.push(f);
  }
  // A chapter may hand a whole section to another chapter by a logged move (scripts/consolidation/
  // move-section.mjs writes docs/consolidation-2026-11/ledger.json). Its own counts then fall, and
  // the receiving chapter's rise by the same amount. Such a fall is allowed only when the chapter has
  // a logged move out AND the total of that count across every chapter is still at or above the
  // baseline, so content can move between chapters but never leave the site.
  const moveLedger = path.join(ROOT, "docs", "consolidation-2026-11", "ledger.json");
  const movedOut = new Set(
    (fs.existsSync(moveLedger) ? JSON.parse(fs.readFileSync(moveLedger, "utf8")) : [])
      .filter((e) => e.kind === "moved" && e.to && e.to.split(":")[0] !== e.file)
      .map((e) => `content/${e.file}.md`)
  );
  const contentTotal = (counts, k) =>
    Object.entries(counts).filter(([f]) => f.startsWith("content/") && f.endsWith(".md")).reduce((n, [, c]) => n + (c[k] ?? 0), 0);
  const moves = [];
  for (const [f, set] of Object.entries(base.counts)) {
    const cur = now.counts[f];
    if (!cur) { failures.push(`no longer countable: ${f}`); continue; }
    for (const [k, n] of Object.entries(set)) {
      if (k === "words") continue; // words are guarded by check:content against its own ledger
      if ((cur[k] ?? 0) >= n) continue;
      if (movedOut.has(f) && contentTotal(now.counts, k) >= contentTotal(base.counts, k)) {
        moves.push(`${f} ${k} ${n} -> ${cur[k] ?? 0} (logged move out; all chapters ${contentTotal(base.counts, k)} -> ${contentTotal(now.counts, k)})`);
        continue;
      }
      failures.push(`count dropped: ${f} ${k} ${n} -> ${cur[k] ?? 0}`);
    }
  }
  if (moves.length) {
    console.log(`check-preservation: ${moves.length} count(s) moved to another chapter by a logged move, none lost:`);
    for (const m of moves) console.log(`   ${m}`);
  }
  if (changed.length) {
    console.log(`check-preservation: ${changed.length} protected file(s) edited since the baseline (allowed; list each in the Preservation Audit):`);
    for (const f of changed) console.log(`   ${f}`);
  }
  if (failures.length) {
    console.error(`check-preservation: FAILED\n${failures.map((x) => "   " + x).join("\n")}`);
    process.exit(1);
  }
  const added = Object.keys(now.files).filter((f) => !(f in base.files)).length;
  console.log(`check-preservation: ${Object.keys(base.files).length - skipped} protected files present, no count below baseline${added ? `, ${added} new file(s)` : ""}${skipped ? ` (${skipped} in .vercelignore not uploaded to Vercel; checked in CI)` : ""}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
