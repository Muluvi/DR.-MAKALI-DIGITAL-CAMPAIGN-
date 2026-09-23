#!/usr/bin/env node
/**
 * The data layer's rules, enforced at build (brief §O). Fails on:
 *
 *   - a needed figure that has a value, or a figure with no value that is not needed
 *   - a sourced figure with no source, or a sourced or modelled figure with no tier
 *   - a modelled figure, or a target, with no note saying how or whose
 *   - an alt value equal to the primary: a real dispute silently collapsed
 *   - any bare numeric literal of three or more digits in content/*.md outside the allow-list
 *
 * The allow-list is for numbers that are not data: identifiers, specifications, citations and
 * units of a rate. Each entry says why it is there.
 *
 *     node --experimental-strip-types scripts/check-figures.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FIGURES } from "../lib/data/figures.ts";
import { ALLOW } from "../lib/data/allow.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "content");

/** The brief's literal test, /\b\d{3,}\b/, read so that "605,703" counts as one literal. */
const LITERAL = /(?<![\w.,{|])\d{1,3}(?:,\d{3})+(?:\.\d+)?(?![\d}])|(?<![\w.,{|])\d{3,}(?:\.\d+)?(?![\d}])/g;

const errors: string[] = [];

for (const [id, f] of Object.entries(FIGURES)) {
  if (f.id !== id) errors.push(`${id}: id field "${f.id}" does not match its key`);
  if (f.state === "needed" && f.value !== null) errors.push(`${id}: needed but has a value`);
  if (f.state !== "needed" && f.value === null) errors.push(`${id}: no value but not marked needed`);
  if (f.state === "needed" && !f.closesWith) errors.push(`${id}: needed, but names no document that would close it`);
  if (f.state === "sourced" && !f.source) errors.push(`${id}: sourced with no source`);
  if ((f.state === "sourced" || f.state === "modelled") && !f.tier) errors.push(`${id}: ${f.state} with no tier`);
  if (f.state === "modelled" && !f.note) errors.push(`${id}: modelled with no note`);
  if (f.state === "target" && !f.note) errors.push(`${id}: target with no note`);
  if (f.alt && f.alt.value === f.value) errors.push(`${id}: alt equals primary — a dispute collapsed`);
}

for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith(".md")).sort()) {
  const lines = fs.readFileSync(path.join(SRC, file), "utf8").split("\n");
  let fence = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { fence = !fence; return; }
    if (fence) return;
    for (const m of line.matchAll(LITERAL)) {
      const at = m.index ?? 0;
      const around = line.slice(Math.max(0, at - 12), at + m[0].length + 12);
      if (ALLOW.some((re) => re.test(around))) continue;
      errors.push(`content/${file}:${i + 1}: numeric literal "${m[0]}" — use a {{figure}} token`);
    }
  });
}

if (errors.length) {
  console.error(`check-figures: ${errors.length} problem(s)`);
  for (const e of errors.slice(0, 60)) console.error(`  - ${e}`);
  if (errors.length > 60) console.error(`  … and ${errors.length - 60} more`);
  process.exit(1);
}
console.log(`check-figures: ${Object.keys(FIGURES).length} figures valid, no numeric literal in content/`);
