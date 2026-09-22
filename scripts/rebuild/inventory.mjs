#!/usr/bin/env node
/**
 * Every heading in public/content, as data.
 *
 * The restructure moves blocks of prose between files and renumbers them. Doing that from a
 * hand-typed list would be the one step where a section quietly disappears, so the list is
 * derived from the files themselves and the migration is checked against it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIR = path.join(ROOT, "public", "content");

const LEADING = /^((?:\d+[A-Z]?(?:\.\d+)*[a-z]?|[A-G](?:\.\d+)+))\.?\s+(.*)$/;

export function inventory() {
  const out = [];
  for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).sort()) {
    const id = file.replace(/\.md$/, "");
    const lines = fs.readFileSync(path.join(DIR, file), "utf-8").split("\n");
    let fence = false;
    lines.forEach((line, i) => {
      if (/^\s*```/.test(line)) fence = !fence;
      if (fence) return;
      const m = /^(#{1,6})\s+(.*)$/.exec(line);
      if (!m) return;
      const level = m[1].length;
      const text = m[2].trim();
      const num = LEADING.exec(text);
      out.push({
        file: id,
        line: i + 1,
        level,
        number: num ? num[1] : null,
        title: num ? num[2] : text,
        raw: text,
      });
    });
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inv = inventory();
  if (process.argv[2] === "--json") {
    console.log(JSON.stringify(inv, null, 2));
  } else {
    for (const h of inv) {
      console.log(`${h.file}\t${h.level}\t${h.number ?? "-"}\t${h.title}`);
    }
    console.error(`\n${inv.length} headings, ${new Set(inv.map((h) => h.file)).size} files, ${inv.filter((h) => h.number).length} numbered.`);
  }
}
