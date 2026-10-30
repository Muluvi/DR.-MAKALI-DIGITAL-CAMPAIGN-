#!/usr/bin/env node
/**
 * Build guard: data/geo/ward-keys.json still joins the register and the boundary file, ward for
 * ward (KITUI-OPEN-DATA-BRIEF.md, WP1).
 *
 * The key table is what lets any ward-level source (the scorecard's ward text today; health
 * facilities and census rows later) land on the right ward. If the register or the polygons
 * change and the table does not, a join quietly drops or misplaces a ward. This makes that loud.
 *
 * It checks, with no download:
 *   - exactly the register's 40 wards, each once, in its own constituency, slug as slugOf();
 *   - each wardcode exists in public/geo/kitui-wards.topo.json under the same name and
 *     constituency, and no two wards share one;
 *   - each open-admin-data code is present, unique and inside Kitui (KE015);
 *   - no alias resolves to two wards in one constituency, or repeats a ward's own name;
 *   - knbs_subcounty stays null until WP3 fills it from a source.
 *
 * Rebuild the table with `node scripts/build-ward-keys.mjs`. Runs as part of `npm run verify`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => JSON.parse(fs.readFileSync(path.join(ROOT, ...p), "utf8"));

const keys = read("data", "geo", "ward-keys.json");
const register = read("data", "ward-register.json");
const topo = read("public", "geo", "kitui-wards.topo.json");

const slugOf = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const fold = (s) => s.toLowerCase().replace(/[^a-z/]/g, "");

const errors = [];
const fail = (msg) => errors.push(msg);

const registerWards = register.constituencies.flatMap((c) => c.wards.map((w) => ({ name: w.name, constituency: c.name, id: c.id })));
if (keys.wards.length !== registerWards.length) fail(`${keys.wards.length} rows, but the register has ${registerWards.length} wards`);

for (const rw of registerWards) {
  const rows = keys.wards.filter((k) => k.name === rw.name && k.constituency === rw.constituency);
  if (rows.length !== 1) fail(`${rw.name} (${rw.constituency}): ${rows.length} rows in ward-keys.json`);
  else if (rows[0].constituency_id !== rw.id) fail(`${rw.name}: constituency_id "${rows[0].constituency_id}", register says "${rw.id}"`);
}

const polygons = new Map(topo.objects.wards.geometries.map((g) => [g.properties.wardcode, g.properties]));
const seen = { slug: new Set(), wardcode: new Set(), open_admin_id: new Set() };
for (const k of keys.wards) {
  if (k.slug !== slugOf(k.name)) fail(`${k.name}: slug "${k.slug}", expected "${slugOf(k.name)}"`);
  for (const field of ["slug", "wardcode", "open_admin_id"]) {
    if (!k[field]) fail(`${k.name}: no ${field}`);
    else if (seen[field].has(k[field])) fail(`${k.name}: ${field} "${k[field]}" used twice`);
    else seen[field].add(k[field]);
  }
  const p = polygons.get(k.wardcode);
  if (!p) fail(`${k.name}: wardcode ${k.wardcode} is not in the boundary file`);
  else if (p.ward !== k.name || p.constituency !== k.constituency) {
    fail(`${k.name}: wardcode ${k.wardcode} is "${p.ward}" (${p.constituency}) in the boundary file`);
  }
  if (k.open_admin_id && !k.open_admin_id.startsWith("KE015")) fail(`${k.name}: open_admin_id ${k.open_admin_id} is outside Kitui`);
  if (k.knbs_subcounty !== null) fail(`${k.name}: knbs_subcounty is set, but no sub-county source is registered yet`);
  for (const a of k.aliases) {
    if (!a.spelling || !a.source) fail(`${k.name}: alias without spelling or source`);
    if (a.spelling.toLowerCase() === k.name.toLowerCase()) fail(`${k.name}: alias "${a.spelling}" is its own name`);
  }
}

// One spelling, one ward, within a constituency: otherwise a join would have to guess.
for (const c of register.constituencies) {
  const owner = new Map();
  for (const k of keys.wards.filter((w) => w.constituency === c.name)) {
    for (const spelling of [k.name, ...k.aliases.map((a) => a.spelling)]) {
      const f = fold(spelling);
      if (owner.has(f) && owner.get(f) !== k.name) fail(`"${spelling}" names both ${owner.get(f)} and ${k.name} in ${c.name}`);
      owner.set(f, k.name);
    }
  }
}

if (errors.length > 0) {
  console.error("verify-ward-keys FAILED:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

const aliasCount = keys.wards.reduce((n, k) => n + k.aliases.length, 0);
console.log(
  `Ward key check passed: ${keys.wards.length} wards join the register and the boundary file one to one, ` +
  `${seen.open_admin_id.size} open-admin-data codes, ${aliasCount} aliases with no collisions.`
);
