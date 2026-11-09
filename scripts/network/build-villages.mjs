#!/usr/bin/env node
/**
 * Builds data/network/kitui-villages.v1.json from the Act's schedule
 * (data/network/kitui-villages-act-2015.schedule.txt).
 *
 * The schedule is the only hand-edited file. Each line is
 * `constituency|ward_code|ward|first_code-last_code|names;separated;by;semicolons`, and village codes are
 * assigned sequentially within the range, in the order listed. The build refuses a line whose name
 * count does not match its range, so a missing or extra semicolon cannot shift every code after it.
 *
 * Names are kept exactly as gazetted. A bracketed list is split out as `sub_areas` (so it is
 * searchable) without changing `village_name`.
 *
 *     node scripts/network/build-villages.mjs           # write the JSON
 *     node scripts/network/build-villages.mjs --check   # fail if the JSON is out of date
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = path.join(ROOT, "data", "network", "kitui-villages-act-2015.schedule.txt");
const OUT = path.join(ROOT, "data", "network", "kitui-villages.v1.json");

export const SOURCE =
  "Kitui County Villages Act, 2015 (No. 1 of 2015), Schedule, Kitui County Gazette Supplement No. 2, 24 March 2015";

/** Lower case, apostrophes and hyphens dropped, spaces collapsed: "Kwa-wewa" and "Kwa wewa" both match. */
export const normalise = (s) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/['’‘`-]/g, "").replace(/\s+/g, " ").trim();

function build() {
  const lines = fs.readFileSync(SRC, "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
  const problems = [];
  const constituencies = [];
  const wards = [];
  const villages = [];
  for (const line of lines) {
    const parts = line.split("|");
    if (parts.length !== 5) { problems.push(`not five fields: ${line}`); continue; }
    const [constituency, codeText, ward, range, namesText] = parts;
    const ward_code = Number(codeText);
    const [first, last] = range.split("-").map(Number);
    const names = namesText.split(";").map((n) => n.trim());
    if (names.length !== last - first + 1) problems.push(`${ward} (${ward_code}): ${names.length} names for range ${range}`);
    if (!constituencies.includes(constituency)) constituencies.push(constituency);
    wards.push({ constituency, ward_code, ward, first_village_code: first, last_village_code: last, village_count: last - first + 1 });
    names.forEach((village_name, i) => {
      const m = village_name.match(/^(.*?)\s*\((.*)\)$/);
      const base = m ? m[1] : village_name;
      const sub_areas = m ? m[2].split(",").map((s) => s.trim()).filter(Boolean) : [];
      const terms = new Set([village_name, base, ...base.split("/"), ...sub_areas].map(normalise).filter(Boolean));
      villages.push({ constituency, ward_code, ward, village_code: first + i, village_name, source: SOURCE, sub_areas, search_terms: [...terms] });
    });
  }
  if (problems.length) throw new Error(`build-villages: the schedule does not parse:\n  ${problems.join("\n  ")}`);
  return { version: 1, source: SOURCE, constituencies, wards, villages };
}

const json = `${JSON.stringify(build(), null, 1)}\n`;
if (process.argv.includes("--check")) {
  const now = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (now !== json) {
    console.error("build-villages: data/network/kitui-villages.v1.json is out of date. Run node scripts/network/build-villages.mjs");
    process.exit(1);
  }
  console.log("build-villages: kitui-villages.v1.json is current");
} else {
  fs.writeFileSync(OUT, json);
  console.log(`build-villages: wrote ${path.relative(ROOT, OUT)}`);
}
