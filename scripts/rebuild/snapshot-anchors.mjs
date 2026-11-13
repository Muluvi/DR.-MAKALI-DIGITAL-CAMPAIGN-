#!/usr/bin/env node
/**
 * One-off: freeze every deep-link id that existed before this rebuild, and every redirect edge the
 * repo has ever declared, into lib/anchors/pre-rebuild.json.
 *
 * "Before this rebuild" is two states, because the branch arrived with two: the migrated document
 * merged in #12 (6af5d18) and the regenerated one at a089642, which re-added the thirty-section
 * files and their ids. A link minted against either can be in someone's WhatsApp history, so both
 * sets are kept. scripts/build-anchors.ts resolves every id here to a live heading and fails the
 * build when one does not.
 *
 *     node scripts/rebuild/snapshot-anchors.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const REVS = ["6af5d18", "a089642"];
const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 << 20 });

const LEADING = /^((?:\d+[A-Z]?(?:\.\d+)*|[A-G](?:\.\d+)+))\.?\s/;
const HEADING = /^(#{2,3})\s+(.+?)\s*$/;
const clean = (raw) => raw.replace(/\*\((new|updated)\)\*/gi, "").replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").trim();
const EDGE = /"([a-z0-9-]+-sec-[a-z0-9-]+)"\s*:\s*"([a-z0-9-]+-sec-[a-z0-9-]+)"/g;

const ids = new Set();
const edges = {};
/** A retired tab id that served a file which is still a route: tab -> route. */
const aliases = {};
const addEdges = (text) => {
  for (const [, from, to] of text.matchAll(EDGE)) if (!(from in edges)) edges[from] = to;
};

for (const rev of REVS) {
  const slugTs = git("show", `${rev}:lib/heading-slug.ts`);
  const filesTs = git("show", `${rev}:lib/content-files.ts`);
  const tabToFile = Object.fromEntries([...filesTs.matchAll(/^\s*"?([a-z0-9-]+)"?:\s*"([a-z0-9-]+\.md)"/gm)].map((m) => [m[1], m[2]]));
  addEdges(slugTs);
  for (const file of ["lib/legacy-ids.json", "lib/legacy-ids.generated.json"]) {
    try { addEdges(git("show", `${rev}:${file}`)); } catch { /* absent at this rev */ }
  }
  for (const [tab, file] of Object.entries(tabToFile)) {
    const route = file.replace(/\.md$/, "");
    if (route !== tab && !(tab in aliases)) aliases[tab] = route;
    let source;
    try { source = git("show", `${rev}:public/content/${file}`); } catch { continue; }
    let fence = false;
    for (const line of source.split("\n")) {
      if (/^\s*```/.test(line)) { fence = !fence; continue; }
      if (fence) continue;
      const m = HEADING.exec(line);
      if (!m) continue;
      const n = LEADING.exec(clean(m[2]));
      if (n) ids.add(`${tab}-sec-${n[1].replace(/\./g, "-").toLowerCase()}`);
    }
  }
}
for (const [from, to] of Object.entries(edges)) { ids.add(from); ids.add(to); }

const out = { revisions: REVS, aliases, ids: [...ids].sort(), edges: Object.fromEntries(Object.entries(edges).sort()) };
fs.writeFileSync(path.join(ROOT, "lib", "anchors", "pre-rebuild.json"), JSON.stringify(out, null, 1) + "\n");
console.log(`pre-rebuild anchors: ${out.ids.length} ids, ${Object.keys(out.edges).length} edges`);
