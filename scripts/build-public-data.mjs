#!/usr/bin/env node
/**
 * The Kitui public data pack: official figures collected on 8 November 2026 (IEBC register, Kenya
 * Gazette). The CSVs in data/public-2026-11/ are the source; this writes the two generated JSON
 * files the site reads and fails if the pack stops reconciling.
 *
 *   node scripts/build-public-data.mjs           write
 *   node scripts/build-public-data.mjs --check   validate, and fail if the JSON is stale
 *
 * The ward comparison uses data/ward-register.json because both must describe the IEBC 2022
 * register. If that register is ever replaced by a newer one, replace this pack in the same change.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "data/public-2026-11");
const check = process.argv.includes("--check");
const EXPECT = { stations: 1578, centres: 1414, voters: 532758, wards: 40, constituencies: 8, limits: 51 };

function parse(file) {
  const text = fs.readFileSync(path.join(DIR, file), "utf8").replace(/\r/g, "").trimEnd();
  const lines = text.split("\n").map((line) => {
    const out = []; let cur = ""; let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
      else if (c === '"') q = true; else if (c === ",") { out.push(cur); cur = ""; } else cur += c;
    }
    out.push(cur); return out;
  });
  const [head, ...rows] = lines;
  return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}
const num = (s) => Number(String(s).replace(/,/g, ""));
const title = (s) => s.toLowerCase().replace(/(^|[\s/'-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
const fail = [];
const must = (ok, msg) => { if (!ok) fail.push(msg); };

const stations = parse("kitui-polling-stations-2022.csv");
const wardsRaw = parse("kitui-wards-2022-and-2027-limits.csv");
const limits = parse("kitui-spending-limits-2027.csv");
const calendar = parse("kitui-governor-race-calendar-2027.csv");
const register = JSON.parse(fs.readFileSync(path.join(ROOT, "data/ward-register.json"), "utf8"));
const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, "");
const regWard = new Map(register.constituencies.flatMap((c) => c.wards.map((w) => [norm(w.name), w])));

must(new Set(stations.map((s) => s.polling_station_code)).size === EXPECT.stations, "station codes are not 1,578 unique values");
must(stations.length === EXPECT.stations, "station rows are not 1,578");
must(new Set(stations.map((s) => s.ward_code + s.registration_centre_code)).size === EXPECT.centres, "registration centres are not 1,414");
must(stations.reduce((a, s) => a + num(s.registered_voters), 0) === EXPECT.voters, "station voters do not sum to 532,758");
for (const s of stations) must(s.polling_station_code.slice(3, 6) === s.constituency_code && s.polling_station_code.slice(6, 10) === s.ward_code, `station ${s.polling_station_code} does not contain its constituency and ward code`);
must(wardsRaw.length === EXPECT.wards, "wards are not 40");
must(new Set(wardsRaw.map((w) => w.constituency_code)).size === EXPECT.constituencies, "constituencies are not 8");
must(limits.length === EXPECT.limits, "spending-limit rows are not 51");

const byWard = new Map();
for (const s of stations) { if (!byWard.has(s.ward_code)) byWard.set(s.ward_code, []); byWard.get(s.ward_code).push(s); }
const wards = wardsRaw.map((w) => {
  const reg = regWard.get(norm(w.ward));
  must(!!reg, `ward ${w.ward} is not in ward-register.json`);
  must(reg?.voters === num(w.registered_voters_2022), `ward ${w.ward}: register differs from ward-register.json`);
  const own = byWard.get(w.ward_code) ?? [];
  must(own.length === num(w.polling_stations_2022), `ward ${w.ward}: station count differs`);
  must(own.reduce((a, s) => a + num(s.registered_voters), 0) === num(w.registered_voters_2022), `ward ${w.ward}: station voters differ`);
  return { code: w.ward_code, name: reg?.name ?? title(w.ward), constituencyCode: w.constituency_code, constituency: title(w.constituency), stations: num(w.polling_stations_2022), centres: num(w.registration_centres_2022), voters: num(w.registered_voters_2022), population: num(w.gazette_population), areaSqKm: num(w.gazette_area_sq_km), mcaLimit: num(w.mca_spending_limit_2027_ksh) };
});
const mp = new Map(limits.filter((l) => l.office === "Member of National Assembly").map((l) => [l.code, num(l.spending_limit_ksh)]));
const seen = new Map();
for (const w of wards) {
  const c = seen.get(w.constituencyCode) ?? { code: w.constituencyCode, name: w.constituency, wards: 0, stations: 0, centres: 0, voters: 0, mpLimit: mp.get(w.constituencyCode) };
  c.wards++; c.stations += w.stations; c.centres += w.centres; c.voters += w.voters; seen.set(w.constituencyCode, c);
}
const county = limits.filter((l) => l.area === "Kitui County").map((l) => ({ office: l.office, limit: num(l.spending_limit_ksh) }));
const summary = {
  retrieved: "2026-11-08",
  wards, constituencies: [...seen.values()], countyLimits: county,
  calendar: calendar.map((c) => ({ date: c.date, event: c.event, appliesTo: c.applies_to, source: c.source })),
};
const stationList = Object.fromEntries([...byWard].map(([code, list]) => [code, list.map((s) => ({ code: s.polling_station_code, centre: s.registration_centre, station: s.polling_station, voters: num(s.registered_voters) }))]));

if (fail.length) { console.error("public-data: the pack does not reconcile:\n - " + fail.slice(0, 40).join("\n - ")); process.exit(1); }
const out = { "data/kitui-public.generated.json": JSON.stringify(summary) + "\n", "data/kitui-stations.generated.json": JSON.stringify(stationList) + "\n" };
for (const [f, body] of Object.entries(out)) {
  const p = path.join(ROOT, f);
  if (check) { if (!fs.existsSync(p) || fs.readFileSync(p, "utf8") !== body) { console.error(`public-data: ${f} is stale, run node scripts/build-public-data.mjs`); process.exit(1); } }
  else fs.writeFileSync(p, body);
}
console.log(`public-data: ${EXPECT.stations} stations, ${EXPECT.centres} centres, ${EXPECT.wards} wards, ${EXPECT.limits} limits reconcile`);
