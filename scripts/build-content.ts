#!/usr/bin/env node
/**
 * content/*.md -> public/content/*.md, with every `{{figure-id}}` token replaced by its value.
 *
 * The markdown in content/ is the source: it carries no numeric literal of its own (brief
 * non-negotiable 6), only tokens that name a figure in lib/data/figures.ts. This step writes the
 * resolved copy the site serves and every other build script reads. An unknown id fails the build.
 *
 * Token forms:
 *   {{register.2026}}          605,703
 *   {{budget.total|bn}}        13.79        (also |m, |k for millions and thousands)
 *   {{path.a.margin|abs}}      75,877       (the sentence carries the sign in words)
 *   {{register.2026|tier}}     Tier 1       (or "modelled", "target", "data needed")
 *   {{pool.share|d0}}          52           (|d0, |d1, |d2 override the decimals)
 *
 *     node --experimental-strip-types scripts/build-content.ts           # write
 *     node --experimental-strip-types scripts/build-content.ts --check   # fail if public/content is stale
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FIGURES } from "../lib/data/figures.ts";
import { formatFigure, type FormatMod } from "../lib/data/format.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "content");
const OUT = path.join(ROOT, "public", "content");
const CHECK = process.argv.includes("--check");

const TOKEN = /\{\{\s*([a-z0-9][a-z0-9.\-]*)(?:\|([a-z0-9]+))?\s*\}\}/g;
const MODS = new Set(["", "tier", "bn", "m", "k", "abs", "d0", "d1", "d2"]);

export function resolveTokens(source: string, file = "<string>"): string {
  return source.replace(TOKEN, (_, id: string, mod = "") => {
    const f = FIGURES[id];
    if (!f) throw new Error(`${file}: unknown figure "${id}"`);
    if (!MODS.has(mod)) throw new Error(`${file}: unknown modifier "${mod}" on "${id}"`);
    return formatFigure(f, mod as FormatMod);
  });
}

const stale: string[] = [];
let tokens = 0;
for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith(".md")).sort()) {
  const source = fs.readFileSync(path.join(SRC, file), "utf8");
  tokens += (source.match(TOKEN) ?? []).length;
  const out = resolveTokens(source, `content/${file}`);
  const target = path.join(OUT, file);
  const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : null;
  if (current === out) continue;
  if (CHECK) stale.push(file);
  else fs.writeFileSync(target, out);
}
if (stale.length) {
  console.error(`build-content: public/content is stale for ${stale.join(", ")}. Run: npm run content`);
  process.exit(1);
}
console.log(`build-content: ${tokens} figure tokens resolved into public/content`);
