#!/usr/bin/env node
/**
 * docs/declutter/CUTS.md, generated from docs/declutter/cuts.json (every deletion and move made by
 * scripts/declutter/edit.py). `--check` fails if CUTS.md is stale.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadCuts } from "./sections.mjs";

const cuts = loadCuts();
const KIND = {
  duplicate: "Verified duplicate",
  chip: "Restatement, now a chip",
  blurb: "Tab intro (repeats the navigation blurb)",
  signpost: "Signpost or meta-text",
  register: "Intensifier (X10)",
  history: "Editorial history of the drafts",
  moved: "Moved to its home",
};
const esc = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
const total = cuts.filter((c) => c.kind !== "moved").reduce((n, c) => n + c.words, 0);
const lines = [
  "# Cuts",
  "",
  "Every deletion made by the declutter, generated from `cuts.json` by `scripts/declutter/build-cuts-md.mjs`. Each row gives the file, the section, the opening words, the words removed (net of any short reference left in place), the kind of cut and the canonical home where its facts still stand. `scripts/declutter/check-content.mjs` checks that every duplicate's tokens and names are at its home (check 5) and that the word count balances (check 4).",
  "",
  `${cuts.filter((c) => c.kind !== "moved").length} cuts, ${total.toLocaleString("en-GB")} words; ${cuts.filter((c) => c.kind === "moved").length} passages moved to their homes.`,
  "",
  "| File | Section | First words | Words | Kind | Canonical home | Note |",
  "|---|---|---|---:|---|---|---|",
  ...cuts.map((c) => `| ${c.file} | ${c.section} | ${esc(c.first12)} | ${c.words} | ${KIND[c.kind] ?? c.kind} | ${esc(c.home || "—")} | ${esc(c.note || "")}${c.replacement ? ` Left in place: \`${esc(c.replacement)}\`.` : ""} |`),
  "",
];
const out = lines.join("\n");
const file = path.join(ROOT, "docs", "declutter", "CUTS.md");
if (process.argv.includes("--check")) {
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== out) {
    console.error("build-cuts-md: docs/declutter/CUTS.md is stale. Run: node scripts/declutter/build-cuts-md.mjs");
    process.exit(1);
  }
  console.log("build-cuts-md: CUTS.md is current");
} else {
  fs.writeFileSync(file, out);
  console.log(`build-cuts-md: ${cuts.length} rows`);
}
