#!/usr/bin/env node
/**
 * Builds data/geo/ward-keys.json: one row per ward, joining every source that names Kitui's 40
 * wards (KITUI-OPEN-DATA-BRIEF.md, WP1).
 *
 *   register   data/ward-register.json (IEBC 2022), the spelling every other source joins to
 *   polygons   public/geo/kitui-wards.topo.json (benaboki, CC BY 4.0), by name and constituency
 *   codes      open-admin-data/kenya-administrative-divisions (CC BY 4.0), pinned by commit
 *
 * Register entries are never renamed. Every other spelling is recorded as an alias with the
 * source that uses it, so a later join (the scorecard's ward text, WP6) can resolve it without
 * guessing.
 *
 * The open-admin-data file is a raw download and lives in analysis/data/ (gitignored). Fetch it
 * once, then build:
 *
 *     node scripts/build-ward-keys.mjs --fetch   # download the pinned file, then build
 *     node scripts/build-ward-keys.mjs           # build from the local copy
 *
 * The committed output is checked on every `npm run verify` by scripts/verify-ward-keys.mjs,
 * which needs no download.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OAD_SHA = "60f507697da89f5c0580a177f15d21f14b679aac";
const OAD_URL = `https://raw.githubusercontent.com/open-admin-data/kenya-administrative-divisions/${OAD_SHA}/data/all-ward.json`;
const OAD_FILE = path.join(ROOT, "analysis", "data", "raw", "open-admin-data", OAD_SHA, "all-ward.json");
const OUT = path.join(ROOT, "data", "geo", "ward-keys.json");

/** Kitui's county code in open-admin-data. */
const OAD_COUNTY = "KE015";

/** open-admin-data names one Kitui constituency by its pre-2013 name. */
const OAD_CONSTITUENCY_ALIASES = { "Mwingi East": "Mwingi Central" };

/**
 * Spellings that do not join by case and spacing alone. Each names the register ward it means
 * and the source that uses it. `verify` marks an alias that rests on a reading of the place
 * name rather than a plain spelling variant: anything joined through it is marked unconfirmed. Scorecard spellings are as printed in the county's
 * Delivering the Kitui Promise scorecard (data/scorecard/kitui-scorecard-projects.csv).
 */
const EXPLICIT_ALIASES = [
  { ward: "Mutonguni", spelling: "Mutongoni", source: "open-admin-data", note: "Spelling variant." },
  { ward: "Mutito/Kaliku", spelling: "Mutitu/Kaliku", source: "open-admin-data, scorecard", note: "The register's spelling before 2026; see docs/visual-premium/GEOGRAPHY.md." },
  { ward: "Mumoni", spelling: "Muumoni", source: "scorecard", note: "Spelling variant." },
  { ward: "Nguutani", spelling: "Ngutani", source: "scorecard", note: "Spelling variant." },
  { ward: "Kanziko", spelling: "Kanziku/Simisi", source: "scorecard", note: "Kanziku is a spelling variant of Kanziko; Simisi is not a ward. Confirm before relying on it.", verify: true },
  { ward: "Mutomo", spelling: "Mutomo/Kibwea", source: "scorecard", note: "Kibwea is not a ward. Confirm before relying on it.", verify: true },
];

const slugOf = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
/** Case and spacing only: "Kwavonza/yatta" and "Kwa Vonza/Yatta" are the same spelling. */
const loose = (name) => name.toLowerCase().replace(/[^a-z/]/g, "");

async function fetchOad() {
  const res = await fetch(OAD_URL);
  if (!res.ok) throw new Error(`build-ward-keys: ${OAD_URL} returned ${res.status}`);
  fs.mkdirSync(path.dirname(OAD_FILE), { recursive: true });
  fs.writeFileSync(OAD_FILE, await res.text());
  console.log(`build-ward-keys: fetched ${path.relative(ROOT, OAD_FILE)}`);
}

if (process.argv.includes("--fetch")) await fetchOad();
if (!fs.existsSync(OAD_FILE)) {
  console.error(`build-ward-keys: ${path.relative(ROOT, OAD_FILE)} is missing. Run with --fetch.`);
  process.exit(1);
}

const register = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "ward-register.json"), "utf8"));
const topo = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "geo", "kitui-wards.topo.json"), "utf8"));
const oad = JSON.parse(fs.readFileSync(OAD_FILE, "utf8")).filter((w) => w.id.startsWith(`${OAD_COUNTY}`));

const errors = [];
const explicitBySpelling = new Map(EXPLICIT_ALIASES.map((a) => [loose(a.spelling), a]));

function joinOad(ward, constituency) {
  const hits = oad.filter((w) => {
    const parent = OAD_CONSTITUENCY_ALIASES[w.parent.name.en] ?? w.parent.name.en;
    if (parent !== constituency) return false;
    const spelling = loose(w.name.en);
    return spelling === loose(ward) || explicitBySpelling.get(spelling)?.ward === ward;
  });
  if (hits.length !== 1) errors.push(`${ward} (${constituency}): ${hits.length} open-admin-data records join`);
  return hits[0];
}

const wards = [];
for (const c of register.constituencies) {
  for (const w of c.wards) {
    const polygon = topo.objects.wards.geometries.filter(
      (g) => g.properties.ward === w.name && g.properties.constituency === c.name
    );
    if (polygon.length !== 1) errors.push(`${w.name} (${c.name}): ${polygon.length} polygons join`);
    const record = joinOad(w.name, c.name);

    const aliases = [];
    const addAlias = (a) => {
      const same = aliases.find((x) => x.spelling.toLowerCase() === a.spelling.toLowerCase());
      if (same) same.source = [...new Set([...same.source.split(", "), ...a.source.split(", ")])].join(", ");
      else aliases.push(a);
    };
    // A difference of case alone is not an alias.
    if (record && record.name.en.toLowerCase() !== w.name.toLowerCase()) {
      const explicit = explicitBySpelling.get(loose(record.name.en));
      addAlias({ spelling: record.name.en, source: "open-admin-data", note: explicit?.note ?? "Spacing only." });
    }
    for (const a of EXPLICIT_ALIASES.filter((a) => a.ward === w.name)) {
      addAlias({ spelling: a.spelling, source: a.source, note: a.note, ...(a.verify ? { verify: true } : {}) });
    }
    if (w.name === "Kwa Vonza/Yatta") {
      addAlias({ spelling: "Kwavonza/Yatta", source: "benaboki boundary file", note: "Spacing only. Joined in the polygon build; see docs/visual-premium/GEOGRAPHY.md." });
    }

    wards.push({
      slug: slugOf(w.name),
      name: w.name,
      constituency: c.name,
      constituency_id: c.id,
      wardcode: polygon[0]?.properties.wardcode ?? null,
      open_admin_id: record?.id ?? null,
      open_admin_name: record?.name.en ?? null,
      knbs_subcounty: null,
      aliases,
    });
  }
}

if (errors.length > 0) {
  console.error("build-ward-keys FAILED:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

const out = {
  id: "ward-keys",
  description:
    "One row per ward: the register's spelling and slug, the boundary file's wardcode, the open-admin-data code, and every other spelling in use.",
  sources: {
    register: "IEBC, Registered Voters per County Assembly Ward (2022): data/ward-register.json",
    wardcode: "Omare & Omare (2017), Kenya County Assembly Boundaries, CC BY 4.0: public/geo/kitui-wards.topo.json",
    open_admin_id: `open-admin-data, Kenya Administrative Divisions, CC BY 4.0, commit ${OAD_SHA}`,
  },
  constituency_aliases: Object.entries(OAD_CONSTITUENCY_ALIASES).map(([spelling, constituency]) => ({
    spelling,
    constituency,
    source: "open-admin-data",
    note: `Pre-2013 name of ${constituency}.`,
  })),
  knbs_subcounty_status:
    "[DATA NEEDED] KNBS 2019 census sub-counties are not IEBC constituencies, and no sub-county polygons or ward-to-sub-county list is in the repo. Filled by spatial overlay in WP3, never forced onto constituencies.",
  wards,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`build-ward-keys: ${wards.length} wards written to ${path.relative(ROOT, OUT)}, ${wards.reduce((n, w) => n + w.aliases.length, 0)} aliases`);
