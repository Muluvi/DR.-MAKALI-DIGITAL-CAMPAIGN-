#!/usr/bin/env node
/**
 * Every heading in content/*.md, levels 2 to 6, with its file, level, number, title and the words
 * that sit under it before the next heading.
 *
 * Written for the October 2026 table-of-contents restructure (docs/restructure-2026-10/). Headings
 * inside fenced blocks are skipped, except ```textversion fences: those are prose a figure has taken
 * over, and their run-in headings are part of the document's heading set.
 *
 * A heading is numbered when it is level 2 or 3 and opens with a section number; deeper headings
 * are run-ins whatever their text begins with.
 *
 * Word count is whitespace-separated tokens of the raw body, fences included, so it matches the
 * counts in docs/restructure-2026-10/preview.md section 6.
 *
 *     node --experimental-strip-types scripts/heading-inventory.ts             # summary
 *     node --experimental-strip-types scripts/heading-inventory.ts --json      # every heading, as JSON
 *     node --experimental-strip-types scripts/heading-inventory.ts --strict    # fail on a duplicate
 *                                                                              # number in a file, or a
 *                                                                              # numbered heading deeper
 *                                                                              # than three levels
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, process.argv.find((a) => a.startsWith("--dir="))?.slice(6) ?? "content");

/** The same leading-number shape lib/heading-slug.ts accepts. */
const LEADING = /^((?:\d+[A-Z]?(?:\.\d+)*|[A-G](?:\.\d+)+))\.?\s/;
const HEADING = /^(#{2,6})\s+(.+?)\s*$/;
const FENCE = /^\s*(```+|~~~+)\s*(\S*)/;

export interface Heading {
  file: string;
  level: number;
  ref: string | null;
  title: string;
  words: number;
  line: number;
}

export function inventory(dir = SRC): Heading[] {
  const out: Heading[] = [];
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    const file = name.replace(/\.md$/, "");
    let fence: string | null = null;
    let current: Heading | null = null;
    fs.readFileSync(path.join(dir, name), "utf8").split("\n").forEach((line, i) => {
      const f = FENCE.exec(line);
      if (f) {
        fence = fence === null ? f[2] || "plain" : null;
        if (current) current.words += line.split(/\s+/).filter(Boolean).length;
        return;
      }
      const h = fence === null || fence === "textversion" ? HEADING.exec(line) : null;
      if (h) {
        const title = h[2].trim();
        const level = h[1].length;
        // Only levels 2 and 3 carry a section number (lib/section-index.ts indexes those two); a
        // "1." opening a level-4 run-in is a list ordinal, not a section number.
        current = { file, level, ref: level <= 3 ? LEADING.exec(title)?.[1] ?? null : null, title, words: 0, line: i + 1 };
        out.push(current);
        return;
      }
      if (current) current.words += line.split(/\s+/).filter(Boolean).length;
    });
  }
  return out;
}

const depth = (ref: string) => ref.split(".").length - (/^[A-G]\./.test(ref) ? 1 : 0);

if (import.meta.url === `file://${process.argv[1]}`) {
  const all = inventory();
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(all, null, 1));
    process.exit(0);
  }
  const numbered = all.filter((h) => h.ref);
  const errors: string[] = [];
  if (process.argv.includes("--strict")) {
    const seen = new Map<string, Heading>();
    for (const h of numbered) {
      const key = `${h.file}:${h.ref}`;
      if (seen.has(key)) errors.push(`content/${h.file}.md:${h.line}: number ${h.ref} repeats line ${seen.get(key)!.line}`);
      seen.set(key, h);
      if (depth(h.ref!) > 3) errors.push(`content/${h.file}.md:${h.line}: ${h.ref} is deeper than three numbered levels`);
    }
  }
  const byLevel = [2, 3, 4, 5, 6].map((l) => `h${l} ${all.filter((h) => h.level === l).length}`).join(", ");
  console.log(`heading-inventory: ${all.length} headings (${numbered.length} numbered, ${all.length - numbered.length} unnumbered run-ins); ${byLevel}`);
  if (errors.length) {
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}
