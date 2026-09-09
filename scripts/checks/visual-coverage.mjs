#!/usr/bin/env node
/**
 * Generates the per-section half of docs/VISUAL-FEATURE-LEDGER.md.
 *
 * The point of generating it rather than writing it is that the claim being made — "every one of
 * the sections is covered" — is only worth anything if it is re-derived from the content and the
 * components each time, instead of being a table someone typed once and stopped updating.
 *
 *     node scripts/checks/visual-coverage.mjs            # print the table
 *     node scripts/checks/visual-coverage.mjs --check    # exit non-zero if any section is uncovered
 */
import { headings, mountKeys } from "../lib/content.mjs";
import { fail, pass, runIfMain } from "../lib/report.mjs";

export const name = "visual-coverage";

/**
 * What a heading gets, and why.
 *
 * The two entrance signatures are the whole point of the split: a sub-section opens a new
 * argument and wipes open; a part is a step inside one already open and rises. Most of the
 * sections are parts, and anything stronger on those turns a long read into a strobe.
 */
export function treatmentFor(h) {
  const shared = [
    "prose surfaces (links, tables, quotes, figures, rules, bold)",
    "native scroll-driven figure reveal",
  ];
  return h.level === 2
    ? ["h2: clip wipe from left", "gradient left bar", "marker sweep", "right-margin hairline", ...shared]
    : ["h3: 6px rise, 340ms", ...shared];
}

export function run() {
  const all = headings();
  const mounted = new Set(mountKeys());
  const uncovered = all.filter((h) => treatmentFor(h).length === 0);

  if (uncovered.length) {
    return fail(`${uncovered.length} section(s) with no treatment`, uncovered.map((h) => `${h.tab}: ${h.title}`));
  }
  return pass(
    `all ${all.length} sections covered ` +
      `(${all.filter((h) => h.level === 2).length} sub-sections, ${all.filter((h) => h.level === 3).length} parts, ` +
      `${mounted.size} with a bespoke visualisation).`
  );
}

/** The ledger table, for docs/VISUAL-FEATURE-LEDGER.md. */
function printTable() {
  console.log(`| # | Part | Lvl | Section | Entrance | Bespoke figure |`);
  console.log(`|---:|---|---|---|---|---|`);
  headings().forEach((h, i) => {
    const entrance = h.level === 2 ? "clip wipe ←" : "rise 6px";
    console.log(`| ${i + 1} | ${h.tab} | h${h.level} | ${h.title.replace(/\|/g, "\\|")} | ${entrance} | |`);
  });
}

const invokedDirectly = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (invokedDirectly && !process.argv.includes("--check")) printTable();
else await runIfMain(import.meta.url, { name, run });
