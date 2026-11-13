#!/usr/bin/env node
/**
 * Check 2 (brief 2026-10 declutter, section 10): every {{token}} present in content/*.md at 4bfc078
 * is still present at least once, inside or outside a fence.
 *
 *     node scripts/declutter/check-tokens.mjs
 */
import { baseFiles, nowFiles, readBase, readNow } from "./sections.mjs";

const TOKEN = /\{\{\s*[a-z0-9][a-z0-9.\-]*(?:\|[a-z0-9]+)?\s*\}\}/g;
const norm = (t) => t.replace(/\s+/g, "");
const before = new Set(baseFiles().flatMap((f) => (readBase(f).match(TOKEN) ?? []).map(norm)));
const after = new Set(nowFiles().flatMap((f) => (readNow(f).match(TOKEN) ?? []).map(norm)));
const lost = [...before].filter((t) => !after.has(t));
if (lost.length) {
  console.error(`check-tokens: ${lost.length} token(s) present at 4bfc078 are gone: ${lost.join(", ")}`);
  process.exit(1);
}
console.log(`check-tokens: all ${before.size} distinct tokens present at 4bfc078 are still present (${after.size} now)`);
