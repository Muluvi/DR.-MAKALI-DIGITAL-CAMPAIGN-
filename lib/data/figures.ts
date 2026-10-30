/**
 * FIGURES: every number the proposal prints, once (brief §O, non-negotiable 6).
 *
 * Four groups, in this order:
 *
 *   1. The register, generated from data/ward-register.json (IEBC 2022, Tier 1): one figure per
 *      ward and per constituency, so a ward total can never be retyped.
 *   2. Sourced figures, read off a named document. Tier is the tier of the document cited
 *      (brief consistency fix 5), not of the value.
 *   3. Derived figures, computed here from 1 and 2, so a sum or a ballot count moves when its
 *      inputs move and cannot be typed wrong. Each is marked modelled, with its formula.
 *   4. Targets: numbers the engagement or the campaign commits to. Evidence about nothing, so no
 *      tier; each says whose target it is.
 *
 * Where the repo's data disagreed with a figure the rebuild brief quoted, the data won, and the
 * disagreement is logged in docs/rebuild/CONFLICTS-RESOLVED.md.
 */
import register from "../../data/ward-register.json" with { type: "json" };
import type { Figure, Tier, Unit } from "./schema";

const FIG: Record<string, Figure> = {};

function add(f: Figure): Figure {
  if (FIG[f.id]) throw new Error(`figures: duplicate id ${f.id}`);
  FIG[f.id] = f;
  return f;
}

function sourced(id: string, value: number, unit: Unit, tier: Tier, source: string, extra: Partial<Figure> = {}) {
  return add({ id, value, unit, tier, state: "sourced", source, ...extra });
}

function modelled(id: string, value: number, unit: Unit, note: string, extra: Partial<Figure> = {}) {
  return add({ id, value, unit, tier: extra.tier ?? "T1", state: "modelled", source: extra.source ?? "Derived in lib/data/figures.ts", note, ...extra });
}

function target(id: string, value: number, unit: Unit, note: string, extra: Partial<Figure> = {}) {
  return add({ id, value, unit, tier: null, state: "target", source: extra.source ?? "This proposal", note, ...extra });
}

/** Stable slug for a ward or constituency name: "Kwa Vonza/Yatta" -> "kwa-vonza-yatta". */
export function slugOf(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const v = (id: string): number => {
  const f = FIG[id];
  if (!f || f.value === null) throw new Error(`figures: ${id} has no value`);
  return f.value;
};
const pct = (part: number, whole: number) => (part / whole) * 100;

/* =============================================================== 1. the register, generated */

const IEBC_WARDS = "IEBC, Registered Voters per County Assembly Ward (2022)";

type Constituency = { id: string; name: string; voters: number; wards: { name: string; voters: number }[] };
const CONSTITUENCIES = register.constituencies as Constituency[];

for (const c of CONSTITUENCIES) {
  sourced(`con.${c.id}`, c.voters, "voters", "T1", IEBC_WARDS);
  for (const w of c.wards) sourced(`ward.${slugOf(w.name)}`, w.voters, "voters", "T1", IEBC_WARDS);
}

const WARDS = CONSTITUENCIES.flatMap((c) => c.wards.map((w) => ({ ...w, constituency: c.id })))
  .sort((a, b) => b.voters - a.voters);

sourced("register.2022", register.countyTotalWards, "voters", "T1", IEBC_WARDS);
sourced("register.2022.prisons", register.prisonVoters, "voters", "T1", IEBC_WARDS);
sourced("register.2022.with-prisons", register.countyTotalWithPrisons, "voters", "T1", IEBC_WARDS);

const ECVR = "IEBC, Enhanced Continuous Voter Registration county annex (July 2026)";
// Tier 3 and unconfirmed (25 September 2026): reported by an aggregator. No IEBC document giving
// the July total is in hand; the ECVR annex is April's release and carries the drive only.
const REGISTER_2026_REPORTED = "Venas News, registered voters by county, July 2026 [S4]; unconfirmed until IEBC's own July figure is in hand";
sourced("register.2026", 605_703, "voters", "T3", REGISTER_2026_REPORTED, { asOf: "2026-07" });
sourced("register.2026.ecvr-drive", 61_839, "voters", "T1", ECVR, { asOf: "2026-04-28", note: "New voters in ECVR Phase 1, the 30-day drive that closed 28 April 2026. A further phase ran 25 June to 25 July 2026 (IEBC gazette notice, 24 June 2026)." });
modelled("register.2026.growth", v("register.2026") - v("register.2022"), "voters", "605,703 less 532,758: growth since 2022.", { tier: "T3" });
modelled("register.2026.continuous", v("register.2026") - v("register.2022") - v("register.2026.ecvr-drive"), "voters", "Growth since 2022 less the ECVR drive: continuous registration outside the drive.", { tier: "T3" });
sourced("register.polling-stations", 1_578, "count", "T1", "IEBC 2022 polling station register");
modelled("register.2022.ward-mean", Math.round(v("register.2022") / 40), "voters", "532,758 across 40 wards.");

/* ------------------------------------------------------------------ groupings of the register */

const sumCons = (...ids: string[]) => ids.reduce((n, id) => n + v(`con.${id}`), 0);
modelled("bloc.mwingi", sumCons("mwingi-north", "mwingi-west", "mwingi-central"), "voters", "Mwingi North + West + Central, 2022 register.");
modelled("pool", sumCons("mwingi-north", "mwingi-west", "mwingi-central", "kitui-south"), "voters", "The four constituencies where he has never held office: Mwingi North, West, Central and Kitui South.");
modelled("pool.share", pct(v("pool"), v("register.2022")), "percent", "Pool / 2022 register.");
modelled("pool.wards", CONSTITUENCIES.filter((c) => ["mwingi-north", "mwingi-west", "mwingi-central", "kitui-south"].includes(c.id)).reduce((n, c) => n + c.wards.length, 0), "count", "Wards in the pool.");
modelled("bloc.mwingi.share", pct(v("bloc.mwingi"), v("register.2022")), "percent", "Mwingi bloc / 2022 register.", { decimals: 2 });
modelled("con.kitui-central.share", pct(v("con.kitui-central"), v("register.2022")), "percent", "Kitui Central / 2022 register.");
modelled("con.kitui-south.share", pct(v("con.kitui-south"), v("register.2022")), "percent", "Kitui South / 2022 register.", { decimals: 2 });
modelled("east-south", sumCons("kitui-east", "kitui-south"), "voters", "Kitui East + Kitui South: the two constituencies without Wiper MPs.");
modelled("east-south.share", pct(v("east-south"), v("register.2022")), "percent", "Kitui East + South / 2022 register.");
modelled("big4", sumCons("kitui-central", "kitui-south", "mwingi-central", "mwingi-north"), "voters", "Kitui Central, Kitui South, Mwingi Central and Mwingi North.");
modelled("big4.share", pct(v("big4"), v("register.2022")), "percent", "Big 4 / 2022 register.", { decimals: 2 });

const top = (n: number) => WARDS.slice(0, n).reduce((s, w) => s + w.voters, 0);
modelled("pareto.top12", top(12), "voters", "The twelve largest wards, 2022 register.");
modelled("pareto.top12.share", pct(top(12), v("register.2022")), "percent", "Top 12 / 2022 register.", { decimals: 2 });
modelled("pareto.top20", top(20), "voters", "The twenty largest wards.");
modelled("pareto.top20.share", pct(top(20), v("register.2022")), "percent", "Top 20 / 2022 register.", { decimals: 2 });
const bottom10 = WARDS.slice(-10).reduce((s, w) => s + w.voters, 0);
modelled("pareto.bottom10", bottom10, "voters", "The ten smallest wards.");
modelled("pareto.bottom10.share", pct(bottom10, v("register.2022")), "percent", "Bottom 10 / 2022 register.", { decimals: 2 });
const POOL_IDS = new Set(["mwingi-north", "mwingi-west", "mwingi-central", "kitui-south"]);
const top12InPool = WARDS.slice(0, 12).filter((w) => POOL_IDS.has(w.constituency));
modelled("pareto.top12.in-pool", top12InPool.length, "count", "Of the twelve largest wards, those in the pool (consistency fix 4).");
modelled("pareto.top12.in-pool.voters", top12InPool.reduce((s, w) => s + w.voters, 0), "voters", "Registered voters in those wards.");
modelled("pareto.top12.in-pool.share", pct(top12InPool.reduce((s, w) => s + w.voters, 0), v("register.2022")), "percent", "Their share of the register.");
modelled("mwingi-north.top3", v("ward.kyuso") + v("ward.tseikuru") + v("ward.mumoni"), "voters", "Kyuso + Tseikuru + Mumoni.");

/* =============================================================== 2. sourced figures */

// ---- results (Section 2.2). The 2022 figures are cited through media reporting of the IEBC
// declaration (analysis/config/assumptions.yaml S11-S13), so they are Tier 2 until a form is cited.
const MEDIA_2022 = "Media reporting of the IEBC 2022 declaration (The Star; Nation; Standard)";
const COA_2018 = "Court of Appeal, Malombe v Ngilu [2018] KECA 460";
// The governor's race is now cited to the certified result (Form 37C), compiled in Firefly's Public
// Data & Evidence Audit of 24 September 2026. The certified 35.77% share matches 117,606 for Musila,
// which settles the two published totals; The Star's 114,606 is kept as the media variant.
const IEBC_37C = "IEBC certified result, Kitui governor 2022 (Form 37C), per Firefly's Public Data & Evidence Audit (24 Sep 2026)";
const AUDIT = "Firefly Public Data & Evidence Audit (24 Sep 2026)";
sourced("result.2022.gov.malombe", 198_004, "votes", "T1", IEBC_37C, { asOf: "2022-08" });
sourced("result.2022.gov.musila", 117_606, "votes", "T1", IEBC_37C, {
  asOf: "2022-08",
  alt: { value: 114_606, source: "The Star, August 2022", tier: "T2", note: "An early media total; the certified share (35.77%) matches 117,606." },
});
sourced("result.2022.gov.musila.media", 114_606, "votes", "T2", "The Star, August 2022", { note: "The early media total; the certified figure is 117,606." });
sourced("result.2022.gov.valid", 328_760, "votes", "T1", IEBC_37C);
modelled("result.2022.gov.musila.share", pct(v("result.2022.gov.musila"), v("result.2022.gov.valid")), "percent", "117,606 / 328,760 valid votes: matches the certified share.", { decimals: 2 });
sourced("turnout.2022", 61.7, "percent", "T1", IEBC_37C, { note: "Valid votes as a share of the 2022 register: 328,760 / 532,758." });
sourced("result.2022.gov.mueke", 10_639, "votes", "T2", MEDIA_2022);
sourced("result.2022.senate.wambua", 191_317, "votes", "T2", MEDIA_2022);
sourced("result.2022.womanrep.kasalu", 201_899, "votes", "T2", MEDIA_2022);
sourced("result.2017.gov.ngilu", 169_990, "votes", "T1", COA_2018);
sourced("result.2017.gov.musila", 114_827, "votes", "T1", COA_2018);
sourced("result.2017.gov.malombe", 74_681, "votes", "T1", COA_2018);
const IEBC_35B = "IEBC declaration, Kitui Central MP 2022, as gazetted (via The Star), per Firefly's Public Data & Evidence Audit (24 Sep 2026)";
sourced("result.2022.mp.mulu", 30_954, "votes", "T1", IEBC_35B, {
  asOf: "2022-08",
  alt: { value: 30_571, source: "Mwingi Times, August 2022", tier: "T3", note: "Early media totals differ: 30,571 (Mwingi Times) and 31,754 (Safi News, Tuko). The gazetted 30,954 is used." },
});
sourced("result.2022.mp.musambi", 9_866, "votes", "T1", IEBC_35B, { note: "Boniface Musambi, second in Kitui Central, 2022." });

// ---- the benchmark and the arithmetic (Section 3.1)
target("benchmark", 200_000, "votes", "The single working benchmark: the 2022 winning tally, 198,004, rounded. Stated once in Section 2.1 and reused everywhere (consistency fix 3).");
modelled("benchmark.share-2022", pct(v("result.2022.gov.malombe"), v("register.2022")), "percent", "198,004 / 532,758: the 2022 winner's share of the register.");
modelled("benchmark.2026-equivalent", Math.round((v("result.2022.gov.malombe") / v("register.2022")) * v("register.2026")), "votes", "The 2022 winner's share of the register applied to the July 2026 register. A ratio carried forward, not a forecast.");
modelled("benchmark.2026-equivalent.rounded", Math.round(v("benchmark.2026-equivalent") / 5000) * 5000, "votes", "The 2026 equivalent, rounded to the nearest 5,000 for prose.");
modelled("benchmark.2026-equivalent.share", pct(v("result.2022.gov.malombe"), v("register.2022")), "percent", "The share carried forward: 198,004 / 532,758.");
target("turnout.constant", v("turnout.2022"), "percent", "The turnout rate used in every calculation: the certified 2022 county rate carried forward to 2027. An assumption about 2027, not a measurement of it; the scenario model brackets it at 55–72%.", { decimals: 1 });
const TURNOUT = v("turnout.constant") / 100;
modelled("turnout.rate", TURNOUT, "percent", "The turnout rate as a multiplier, for the working shown in Section 2.4.", { decimals: 3 });
modelled("ballots.2022", Math.round(v("register.2022") * TURNOUT), "votes", "2022 register × the turnout rate (the certified 2022 rate, carried forward).");
modelled("ballots.2026", Math.round(v("register.2026") * TURNOUT), "votes", "July 2026 register × the 2022 turnout rate, carried forward.");
modelled("benchmark.share-of-ballots.2026", pct(v("benchmark"), v("register.2026") * TURNOUT), "percent", "200,000 / ballots at the 2022 turnout rate on the July 2026 register.");
modelled("benchmark.share-of-ballots", pct(v("benchmark"), v("register.2022") * TURNOUT), "percent", "200,000 / ballots at the 2022 turnout rate.");
modelled("benchmark.share-of-register", pct(v("benchmark"), v("register.2022")), "percent", "200,000 / 2022 register.");
modelled("gap.wambua-to-benchmark-2022", v("result.2022.gov.malombe") - v("result.2022.senate.wambua"), "votes", "198,004 less 191,317.");

// ---- the four routes (Section 3.3): registered voters, ballots at the constant, and the margin
// against 200,000 at 100% of ballots. Consistency fix 3: model output against 200,000.
const ROUTES: [string, number, string][] = [
  ["a", v("bloc.mwingi"), "Mwingi Central + North + West"],
  ["b", sumCons("kitui-central", "kitui-south", "kitui-west"), "Kitui Central + South + West"],
  ["c", top(12), "The twelve largest wards"],
  ["d", sumCons("kitui-central", "kitui-west", "kitui-rural"), "Kitui Central + West + Rural (the home belt)"],
];
for (const [key, registered, what] of ROUTES) {
  modelled(`path.${key}.registered`, registered, "voters", `${what}, 2022 register.`);
  modelled(`path.${key}.share`, pct(registered, v("register.2022")), "percent", `${what} / 2022 register.`, { decimals: 2 });
  const ballots = Math.round(registered * TURNOUT);
  modelled(`path.${key}.ballots`, ballots, "votes", `${what} × the 2022 turnout rate, carried forward.`);
  modelled(`path.${key}.margin`, ballots - v("benchmark"), "votes", "Ballots at the constant less 200,000, even if every ballot went to him.");
}
for (const key of ["a", "d"]) {
  const eighty = Math.round(0.8 * v(`path.${key}.ballots`));
  modelled(`path.${key}.at80`, eighty, "votes", "80% of the route's ballots.");
  modelled(`path.${key}.at80.short`, v("benchmark") - eighty, "votes", "200,000 less 80% of the route's ballots.");
}

// ---- people and economy (Section 2.4). KNBS 2019 Census unless stated.
const CENSUS = "KNBS, 2019 Kenya Population and Housing Census";
sourced("census.population", 1_136_187, "people", "T1", CENSUS);
sourced("census.male", 549_003, "people", "T1", CENSUS);
sourced("census.female", 587_151, "people", "T1", CENSUS);
modelled("census.female.share", pct(587_151, 1_136_187), "percent", "Women / residents.");
sourced("census.households", 262_942, "households", "T1", CENSUS);
sourced("census.area", 30_430, "km2", "T1", CENSUS);
// Rural and urban (restructure 2026-11): the brief's verified-data check (29 October 2026) found no
// source for an earlier draft's 14.9% urban share and secondary reporting near 86% rural. The site's
// split is corroborated by the CRA County Fact Sheet (3rd edition) and citypopulation.de, both from
// KNBS 2019 Census Volume II, so it stays, at Tier 2 until the Volume II table is cited directly.
const CENSUS_VOL2 = "KNBS 2019 Census Volume II (rural and urban distribution), via the CRA Kitui County Fact Sheet, 3rd edition, and citypopulation.de";
const CENSUS_VOL2_NOTE = "Tier 2 until the KNBS Volume II table itself is cited. Secondary sources putting the rural share near 86% do not reconcile with this split, which sums exactly to the census total.";
sourced("census.rural", 1_082_168, "people", "T2", CENSUS_VOL2, { note: CENSUS_VOL2_NOTE });
sourced("census.urban", 54_019, "people", "T2", CENSUS_VOL2, { note: CENSUS_VOL2_NOTE });
sourced("census.rural.share", 95.2, "percent", "T2", CENSUS_VOL2, { note: CENSUS_VOL2_NOTE });
sourced("census.urban.share", 4.8, "percent", "T2", CENSUS_VOL2, { note: CENSUS_VOL2_NOTE });
sourced("census.intersex", 33, "people", "T1", CENSUS);
sourced("census.household-size", 4.3, "persons", "T1", CENSUS, { decimals: 1, note: "Average household size." });
sourced("census.density", 37, "per-km2", "T1", CENSUS, { note: "Persons per square kilometre." });
sourced("census.subcounties", 18, "count", "T1", "KNBS, 2019 Census; IEBC", { note: "Administrative sub-counties." });

// Verified-data check of 29 October 2026 (restructure 2026-11). Each is graded by the document cited.
const STATS_KENYA = "KNBS 2019 Census, via Stats Kenya county profile (statskenya.co.ke)";
sourced("census.median-age", 17, "count", "T2", STATS_KENYA, { asOf: "2019", note: "Median age in years." });
sourced("electricity.2019", 17.2, "percent", "T2", STATS_KENYA, { asOf: "2019", note: "Households with electricity." });
sourced("electricity.2009", 4.8, "percent", "T2", STATS_KENYA, { asOf: "2009", note: "Households with electricity, 2009 Census." });
sourced("water.safe.2019", 38.5, "percent", "T2", STATS_KENYA, { asOf: "2019", note: "Households with safe drinking water (the census definition). An earlier draft's 53.2% likely used a different definition and is not used." });
sourced("water.piped.2019", 5.1, "percent", "T2", STATS_KENYA, { asOf: "2019", note: "Households with piped water." });
const EQUAL_POLITICS = "Equal Politics aggregation of IEBC 2022 presidential results (Tier 1 record: IEBC Forms 34B and 34C)";
sourced("result.2022.pres.odinga", 235_400, "votes", "T2", EQUAL_POLITICS, { asOf: "2022-08" });
sourced("result.2022.pres.odinga.share", 70.82, "percent", "T2", EQUAL_POLITICS, { decimals: 2 });
sourced("result.2022.pres.ruto", 89_419, "votes", "T2", EQUAL_POLITICS, { asOf: "2022-08" });
sourced("result.2022.pres.ruto.share", 26.9, "percent", "T2", EQUAL_POLITICS, { decimals: 2 });
sourced("result.2022.pres.wajackoyah", 2_838, "votes", "T2", EQUAL_POLITICS);
sourced("result.2022.pres.mwaure", 1_446, "votes", "T2", EQUAL_POLITICS);
sourced("result.2022.pres.rejected", 3_306, "votes", "T2", EQUAL_POLITICS);
sourced("result.2022.pres.turnout", 62, "percent", "T2", EQUAL_POLITICS, { decimals: 0, note: "Approximate. Includes rejected ballots, so it is not the same base as turnout.2022 (governor valid votes / register)." });
sourced("poverty.2022.statskenya", 58.3, "percent", "T3", "Stats Kenya, reporting KNBS for 2022", { asOf: "2022", note: "Not used in place of the KNBS 2021 rate until verified against the KNBS 2022 poverty report." });
for (const [id, unit, closes] of [
  ["census.age-bands", "percent", "KNBS 2019 Census Volume III (population by age and sex), the Kitui table"],
  ["literacy.county", "percent", "KNBS county literacy table (2019 Census or KDHS 2022 county report); the draft's 56.3% and 87.4% have no confirmed source"],
  ["electricity.national", "percent", "KNBS 2019 Census Volume IV national household electricity table"],
  ["admin.villages", "count", "Kitui County Integrated Development Plan 2023–2027 (the count of villages, reported as 247)"],
  ["cidp.sectors", "count", "Kitui County Integrated Development Plan 2023–2027 (KIPPRA repository), the priority-sector list"],
  ["unemployment.youth.county", "percent", "KNBS Quarterly Labour Force Survey county tables, or the 2019 Census Volume IV labour table"],
  ["cpi.county", "percent", "KNBS county consumer price index series"],
  ["roads.county", "count", "Kitui County roads inventory (CIDP 2023–2027) and KeRRA/KURA classified-road data"],
] as const) add({ id, value: null, unit, tier: null, state: "needed", source: null, closesWith: closes });
sourced("water.surface", 400_000, "people", "T1", "KNBS, via the NDMA Long Rains Food Security Assessment", { note: "Approximate: residents relying on untreated surface water." });
sourced("poverty.2021", 55.2, "percent", "T1", "KNBS, Kenya Poverty Report (2021)", {
  note: "The official poverty rate. The 60.4% in the NDMA food-security assessment is not a poverty-report rate and is not used (confirmed 25 September 2026).",
});
sourced("poverty.2021.people", 637_000, "people", "T1", "KNBS, Kenya Poverty Report (2021)");
sourced("livestock.cattle", 613_000, "count", "T1", "Livestock data validation 2023, as cited in the NDMA Kitui 2025 Long Rains Food and Nutrition Security Assessment (July 2025), p. 96");
sourced("livestock.goats", 2_000_000, "count", "T1", "Livestock data validation 2023, as cited in the NDMA Kitui 2025 Long Rains Food and Nutrition Security Assessment (July 2025), p. 96");
sourced("livestock.poultry", 4_000_000, "count", "T1", "Livestock data validation 2023, as cited in the NDMA Kitui 2025 Long Rains Food and Nutrition Security Assessment (July 2025), p. 96");
sourced("livestock.donkeys", 326_000, "count", "T1", "Livestock data validation 2023, as cited in the NDMA Kitui 2025 Long Rains Food and Nutrition Security Assessment (July 2025), p. 96");
sourced("food.reserve-households", 28_000, "households", "T2", "Kitui County CECM for Agriculture, statement");

// ---- sub-county census tables (Section 3.7)
const SUBCOUNTIES: [string, number, number, number][] = [
  ["kitui-central", 105_991, 251, 29_057],
  ["kitui-west", 70_871, 170, 17_497],
  ["katulani", 47_108, 146, 12_170],
  ["mwingi-central", 108_713, 95, 26_753],
  ["kyuso", 76_867, 30, 15_993],
  ["mumoni", 29_344, 48, 6_496],
  ["tseikuru", 40_871, 30, 8_579],
  ["mutomo", 113_356, 40, 23_044],
  ["ikutha", 82_964, 9, 16_679],
  ["mwingi-east", 85_139, 25, 18_730],
  ["mutitu", 55_287, 12, 11_521],
  ["migwani", 79_255, 125, 19_096],
];
for (const [id, pop, density, hh] of SUBCOUNTIES) {
  sourced(`sub.${id}.population`, pop, "people", "T1", CENSUS);
  sourced(`sub.${id}.density`, density, "per-km2", "T1", CENSUS);
  sourced(`sub.${id}.households`, hh, "households", "T1", CENSUS);
}
const zoneSum = (ids: string[], field: string) => ids.reduce((n, id) => n + v(`sub.${id}.${field}`), 0);
const ZONES: [string, string[]][] = [
  ["anchor", ["kitui-central", "kitui-west", "katulani"]],
  ["mwingi", ["mwingi-central", "kyuso", "mumoni", "tseikuru"]],
  ["arid", ["mutomo", "ikutha", "mwingi-east", "mutitu", "migwani"]],
];
for (const [zone, ids] of ZONES) {
  modelled(`zone.${zone}.population`, zoneSum(ids, "population"), "people", `Sum of the zone's sub-counties: ${ids.join(", ")}.`);
  modelled(`zone.${zone}.households`, zoneSum(ids, "households"), "households", "Sum of the zone's sub-counties.");
  modelled(`zone.${zone}.share`, pct(zoneSum(ids, "population"), v("census.population")), "percent", "Zone population / county.");
}
modelled("zones.population", ZONES.reduce((n, [, ids]) => n + zoneSum(ids, "population"), 0), "people", "The three zones together.");
modelled("zones.share", pct(v("zones.population"), v("census.population")), "percent", "The three zones / county.");
modelled("zones.excluded", Math.round((v("census.population") - v("zones.population")) / 1e4) * 1e4, "people", "Residents in no zone, rounded to the nearest 10,000.");
modelled("zones.excluded.share", 100 - v("zones.share"), "percent", "Residents in no zone / county: 100 less the three zones' share.");
// The zones' share of the register, read from the constituencies that make each zone up. Sub-counties
// and constituencies are different units (Section 3.7.3), so this is the nearest register match.
modelled("zone.anchor.register.share", pct(sumCons("kitui-central", "kitui-west"), v("register.2022")), "percent", "Kitui Central + Kitui West / 2022 register.");
modelled("zone.mwingi.register.share", pct(v("bloc.mwingi"), v("register.2022")), "percent", "Mwingi North + West + Central / 2022 register.");
modelled("zone.arid.register.share", pct(sumCons("kitui-south", "kitui-east"), v("register.2022")), "percent", "Kitui South + Kitui East / 2022 register.");
modelled("con.kitui-rural.share", pct(v("con.kitui-rural"), v("register.2022")), "percent", "Kitui Rural / 2022 register.");

// ---- connectivity (Section 2.6). CA/KNBS 2023/24 is current (consistency fix 2); 2019 is comparison only.
const CA_2024 = "Communications Authority / KNBS, ICT Analytical Report on the 2023/24 Kenya Housing Survey";
sourced("ict.internet", 26.2, "percent", "T1", CA_2024, { asOf: "2023-24" });
sourced("ict.phone", 44.1, "percent", "T1", CA_2024, { asOf: "2023-24" });
modelled("ict.offline", 100 - 26.2, "percent", "100% less 26.2% internet use.", { source: CA_2024 });
sourced("ict.internet.2019", 13.6, "percent", "T2", CENSUS, { asOf: "2019" });
sourced("ict.phone.2019", 42.9, "percent", "T2", CENSUS, { asOf: "2019" });
sourced("ict.internet.2019.people", 143_340, "people", "T2", CENSUS);
sourced("ict.phone.2019.people", 452_948, "people", "T2", CENSUS);
sourced("ict.smartphone-share", 59.7, "percent", "T2", "Communications Authority, Q3 FY2025/26 sector statistics", { note: "50.2m smartphones / 84.1m active SIMs, national." });
sourced("ict.sim-penetration", 157.7, "percent", "T1", "Communications Authority, Q3 FY2025/26 sector statistics");
sourced("ict.momo-penetration", 100.1, "percent", "T1", "Communications Authority, Q3 FY2025/26 sector statistics");
sourced("ict.agents", 602_470, "count", "T1", "Communications Authority, Q3 FY2025/26 sector statistics", { asOf: "2026-03" });
sourced("ict.agents.2025", 480_216, "count", "T1", "Communications Authority, sector statistics", { asOf: "2025-09" });

// ---- modelled reach on the July 2026 register (Section 3.8), from the pipeline's channel-reach export.
const REACH = "analysis pipeline, stage 09 (published rates × July 2026 register)";
modelled("reach.smartphone", 158_696, "voters", "26.2% internet use applied to the July 2026 register.", { source: REACH });
modelled("reach.sms-only", 108_419, "voters", "44.1% phone ownership less 26.2% internet use, on the July 2026 register.", { source: REACH });
modelled("reach.nophone", 338_588, "voters", "No phone: the remainder of the July 2026 register.", { source: REACH });
modelled("reach.offline", v("register.2026") - v("reach.smartphone"), "voters", "The July 2026 register less those reachable online.");
modelled("reach.smartphone.short", v("benchmark") - v("reach.smartphone"), "votes", "200,000 less the digital ceiling.");
modelled("reach.smartphone.of-benchmark", pct(v("reach.smartphone"), v("benchmark")), "percent", "The digital ceiling / 200,000.");

// ---- the county budget (Section 2.5): CFSP FY2026/27 [S47, S48]
const CFSP = "Kitui County Fiscal Strategy Paper FY2026/27, as approved by the County Assembly";
sourced("budget.total", 13.79e9, "ksh", "T3", CFSP, { note: "Cited through secondary reporting of the Paper; verify. The Paper sets the envelope at KSh 13.79bn (confirmed 25 September 2026); a KSh 13.78bn reading is not used.", decimals: 2 });
sourced("budget.equitable", 11.64e9, "ksh", "T1", CFSP, { decimals: 2 });
sourced("budget.osr", 1.12e9, "ksh", "T3", CFSP, {
  decimals: 2,
  alt: { value: 1.339e9, source: "County Assembly revision of the CFSP [S48]", tier: "T3", note: "Raised by the Assembly. The final approved FY2026/27 budget settles which applies; until it is in hand, both are shown." },
});
sourced("budget.osr.revised", 1.339e9, "ksh", "T3", "County Assembly revision of the CFSP [S48]", { decimals: 3 });
sourced("budget.grants", 1.04e9, "ksh", "T1", CFSP, { decimals: 2, note: "Conditional and unconditional grants in the Paper (confirmed 25 September 2026); a KSh 1.03bn reading is not used." });
modelled("budget.rounding", 13.79e9 - (11.64e9 + 1.12e9 + 1.04e9), "ksh", "Published total less the three parts: rounding in the source, shown as its own segment.", { decimals: 2 });

// ---- the county audit record (Annex B, Section 4.1.2)
const OAG = "Office of the Auditor-General, Kitui County FY2023/24 audit report";
sourced("audit.cash", 670_000_000, "ksh", "T1", OAG);
sourced("audit.uncollected", 1_090_000_000, "ksh", "T1", OAG);
sourced("audit.ifmis", 621_500_000, "ksh", "T1", OAG);
sourced("audit.transfers", 356_200_000, "ksh", "T1", OAG);

// ---- the candidate's record (Section 2.8)
sourced("record.bursary.recipients", 12_573, "count", "T1", "Kitui Central NG-CDF bursary record");
sourced("record.bursary.ksh", 47_000_000, "ksh", "T1", "Kitui Central NG-CDF bursary record");
sourced("record.cdf.boreholes", 84, "count", "T3", "Kitui Central Project Inventory 2013–2026, awaiting line items");
sourced("record.cdf.school-water", 142, "count", "T3", "Kitui Central Project Inventory 2013–2026, awaiting line items");
// Figures the November 2026 restructure found typed into prose; each now has a token.
const COB = "Controller of Budget, County Budget Implementation Review Report";
sourced("budget.pending-bills.2021", 1.3e9, "ksh", "T1", COB, { asOf: "2020-21", decimals: 1, note: "Outstanding pending bills, FY2020/21." });
sourced("budget.absorption.q1", 18, "percent", "T1", COB, { asOf: "2025-26 Q1", decimals: 0, note: "Development absorption, FY2025/26 first quarter. Media reports of 5% are not used." });
sourced("audit.pending.contested", 2.4e9, "ksh", "T3", "OAG County Executive audits FY2021/22 and FY2022/23, as reported; reports not yet retrieved", { decimals: 1, note: "A different measure from the FY2020/21 pending bills: different years, different scope." });
sourced("water.basic.kdhs", 21, "percent", "T1", "KNBS, Kenya Demographic and Health Survey 2022", { asOf: "2022", decimals: 0, note: "Population with at least a basic drinking-water service; the lowest county in Kenya." });
sourced("water.basic.nairobi", 99, "percent", "T1", "KNBS, Kenya Demographic and Health Survey 2022", { asOf: "2022", decimals: 0 });
sourced("water.trek.2026-02", 7.2, "count", "T1", "NDMA National Drought Early Warning Bulletin, February 2026", { asOf: "2026-02", decimals: 1, note: "Average water trekking distance in kilometres; the longest of Kenya's semi-arid counties." });
sourced("food.share", 72.5, "percent", "T2", "KNBS Kenya Poverty Report, via national reporting", { note: "Share of household spending that goes on food." });
target("policy.ndengu-floor", 85, "ksh", "A proposed floor price for ndengu, per kilogram: a campaign policy proposal, not yet sized.", { source: "Campaign policy proposal, this proposal" });
sourced("price.ndengu.farmgate", 40, "ksh", "T3", "Farm-gate price as quoted in the message matrix; source pending", { note: "Per kilogram." });

// ---- his channels (Section 2.9), read off the public page
sourced("channel.fb.followers", 15_000, "count", "T3", "Public Facebook page, approximate count as displayed", { note: "Approximate; replaced by the Week 1 export." });
sourced("channel.fb.posts", 745, "count", "T3", "Public Facebook page, as displayed");


// ---- segment sizes that are derived rather than measured (Section 4.3)
modelled("segment.rural.voters", Math.round((v("register.2022") * v("census.rural.share")) / 100 / 1000) * 1000, "voters", "95.2% rural share applied to the 2022 register, rounded. The register is not published by rural/urban split.");
modelled("segment.urban.voters", Math.round((v("register.2022") * v("census.urban.share")) / 100 / 1000) * 1000, "voters", "4.8% urban share applied to the 2022 register, rounded.");
modelled("segment.youth.voters", 234_000, "voters", "The 2019 census age distribution applied to the 2022 register; the register is not published by age.");

// ---- shares quoted in prose, computed so they cannot drift from their parts
// The CFSP states its own shares. They are kept as published: 11.64 / 13.79 computes to 84.4%, the
// Paper prints 84.3%, and the printed figure is the sourced one.
sourced("budget.equitable.share", 84.3, "percent", "T1", CFSP);
sourced("budget.osr.share", 8.1, "percent", "T3", CFSP);
sourced("budget.grants.share", 7.5, "percent", "T1", CFSP);
modelled("con.mwingi-north.share", pct(v("con.mwingi-north"), v("register.2022")), "percent", "Mwingi North / 2022 register.", { decimals: 2 });

/* =============================================================== 4. targets */

const T_FIREFLY = "Firefly's target, this proposal";
const T_CAMPAIGN = "The campaign's build target, this proposal";
target("target.sms.phase-1", 15_000, "count", "Consented SMS contacts by the end of Phase −1.", { source: T_FIREFLY });
target("target.sms.phase-1b", 40_000, "count", "Consented SMS contacts, Phase 1.", { source: T_FIREFLY });
target("target.sms.phase-2", 80_000, "count", "Consented SMS contacts, Phase 2.", { source: T_FIREFLY });
target("target.sms", 120_000, "count", "Consented SMS/USSD contacts by Phase 3 (objective 1.3.3).", { source: T_FIREFLY });
target("target.ussd.phase-1", 5_000, "count", "USSD unique sessions, Phase 1.", { source: T_FIREFLY });
target("target.ussd.phase-2", 25_000, "count", "USSD unique sessions, Phase 2.", { source: T_FIREFLY });
target("target.ussd.phase-3", 60_000, "count", "USSD unique sessions, Phase 3.", { source: T_FIREFLY });
target("target.tracker.phase-1", 500, "count", "Tracker reports, Phase 1.", { source: T_FIREFLY });
target("target.tracker.phase-2", 3_000, "count", "Tracker reports, Phase 2.", { source: T_FIREFLY });
target("target.tracker.phase-3", 8_000, "count", "Tracker reports, Phase 3.", { source: T_FIREFLY });
target("target.reach.phase-1", 1_000_000, "count", "Combined social reach, Phase 1: an operational diagnostic, not a performance indicator.", { source: T_FIREFLY });
target("target.reach.phase-2", 3_000_000, "count", "Cumulative reach, Phase 2: diagnostic.", { source: T_FIREFLY });
target("target.reach.phase-3", 5_000_000, "count", "Cumulative reach, Phase 3: diagnostic.", { source: T_FIREFLY });
target("target.followers.phase-1", 50_000, "count", "Engaged followers, Phase 1: diagnostic.", { source: T_FIREFLY });
target("target.followers.phase-2", 150_000, "count", "Engaged followers, Phase 2: diagnostic.", { source: T_FIREFLY });
target("target.followers.phase-3", 250_000, "count", "Engaged followers, Phase 3: diagnostic.", { source: T_FIREFLY });
target("target.subscribers.phase-1", 5_000, "count", "Email/SMS subscribers, Phase 1.", { source: T_FIREFLY });
target("target.subscribers.phase-2", 15_000, "count", "Email/SMS subscribers, Phase 2.", { source: T_FIREFLY });
target("target.volunteers.phase-1", 1_000, "count", "Digital volunteer sign-ups, Phase 1 (campaign-owned programme).", { source: T_CAMPAIGN });
target("target.volunteers.phase-2", 5_000, "count", "Digital volunteer sign-ups, Phase 2 (campaign-owned programme).", { source: T_CAMPAIGN });
target("target.pledges", 30_000, "count", "Digital pledges to vote, Phase 3.", { source: T_CAMPAIGN });
target("target.supporters", 200_000, "count", "Verified supporters mapped to polling stations by 31 May 2027 (objective 1.3.4).", { source: T_CAMPAIGN });
target("target.pledged-voters", 220_000, "count", "Pledged voters in the CRM (GE-01).", { source: T_CAMPAIGN });
target("target.contact-universe.lean", 60_000, "count", "Realistic Phase 3 contact universe at Level 1.", { source: T_FIREFLY });
target("target.contact-universe.standard", 150_000, "count", "Realistic Phase 3 contact universe at Level 2.", { source: T_FIREFLY });
target("target.contact-universe.premium", 250_000, "count", "Realistic Phase 3 contact universe at Level 3.", { source: T_FIREFLY });
target("target.content.first", 100, "count", "Pieces of content approved and scheduled in Phase 0.", { source: T_FIREFLY });
target("target.captains", 400, "count", "Ward captains, 10 per ward: a campaign-owned recommendation (Section 1.4.3).", { source: T_CAMPAIGN });
target("target.captains.pool", 240, "count", "Of the 400 captains, those recommended for the pool's wards: campaign-owned.", { source: T_CAMPAIGN });
target("target.ambassadors", 800, "count", "M-Pesa 'Economic Ambassadors': a campaign-owned recommendation.", { source: T_CAMPAIGN });
target("target.stage-champions", 1_200, "count", "Boda-boda Stage Champions, 30 per ward: a campaign-owned recommendation.", { source: T_CAMPAIGN });
target("target.volunteer-points", 100, "count", "Average points per volunteer per month: the campaign-owned volunteer programme's target.", { source: T_CAMPAIGN });
target("target.whatsapp-groups", 180, "count", "Community WhatsApp groups monitored by the 40 constituency monitoring assistants.", { source: T_FIREFLY });

// ---- Firefly's effort weighting by zone (Section 4.2): shares of communications effort, by phase
const EFFORT: [string, number, number, number, number][] = [
  ["p-1", 20, 35, 30, 15],
  ["p12", 25, 25, 30, 20],
  ["p3", 25, 25, 35, 15],
];
for (const [phase, anchor, mwingi, arid, rotating] of EFFORT) {
  target(`effort.${phase}.anchor`, anchor, "percent", "Share of communications effort to the anchor zone.", { source: T_FIREFLY, decimals: 0 });
  target(`effort.${phase}.mwingi`, mwingi, "percent", "Share of communications effort to the Mwingi block.", { source: T_FIREFLY, decimals: 0 });
  target(`effort.${phase}.arid`, arid, "percent", "Share of communications effort to the arid and resource belt.", { source: T_FIREFLY, decimals: 0 });
  target(`effort.${phase}.rotating`, rotating, "percent", "Share of communications effort rotating across wards as testing.", { source: T_FIREFLY, decimals: 0 });
}
// ---- where communications effort goes by channel (Section 4.6): the conventional pitch as Firefly
// characterises it, and the rebalanced target. Shares of effort, not money.
const CHANNEL_SHIFT: [string, string, number, number][] = [
  ["radio", "Vernacular radio (Musyi, County, Wikwatyo)", 20, 37],
  ["sms", "Direct SMS and the USSD tree", 10, 20],
  ["markets", "Market caravans and barazas", 15, 18],
  ["digital", "Digital and social media", 45, 18],
  ["church", "Church and community outreach", 10, 7],
];
for (const [id, label, from, to] of CHANNEL_SHIFT) {
  target(`channel.${id}.conventional`, from, "percent", `${label}: share of effort in the conventional pitch, as Firefly characterises it.`, { source: T_FIREFLY, decimals: 0 });
  target(`channel.${id}.rebalanced`, to, "percent", `${label}: share of effort, rebalanced.`, { source: T_FIREFLY, decimals: 0 });
}
target("channel.offline.rebalanced", CHANNEL_SHIFT.filter(([id]) => id !== "digital").reduce((n, [, , , to]) => n + to, 0), "percent", "Share of effort offline, rebalanced: radio, SMS, caravans and church.", { source: T_FIREFLY, decimals: 0 });
target("effort.digital.pool", 65, "percent", "Share of Phase −1 digital reach effort geofenced to the pool.", { source: T_FIREFLY, decimals: 0 });
target("effort.sms.pool", 70, "percent", "Share of SMS/USSD onboarding effort to the pool's 21 wards.", { source: T_FIREFLY, decimals: 0 });

// ---- public statistics compiled in Firefly's Public Data & Evidence Audit (24 Sep 2026). Each names
// the document the audit read; national figures are labelled national wherever they are printed.
const KDHS = "KNBS, Kenya Demographic and Health Survey 2022, Kitui factsheet, per Firefly's audit";
sourced("health.insurance", 11.7, "percent", "T1", KDHS, { asOf: "2022", note: "Household population with any health insurance." });
sourced("health.insurance.nhif", 10.3, "percent", "T1", KDHS, { asOf: "2022" });
sourced("health.stunting", 25.1, "percent", "T1", "KNBS, KDHS 2022 (via the Advancing Nutrition policy brief), per Firefly's audit", {
  asOf: "2022",
  alt: { value: 29.3, source: "Kitui County health planning baseline (CIDP)", tier: "T2", note: "A county planning baseline, older than KDHS 2022." },
});
sourced("health.stunting.cidp", 29.3, "percent", "T2", "Kitui County health planning baseline (CIDP), per Firefly's audit", { note: "The older county baseline; KDHS 2022 is used." });
const CENSUS_2019_AUDIT = "KNBS, 2019 Kenya Population and Housing Census, per Firefly's audit";
sourced("fuel.unclean", 92.6, "percent", "T1", CENSUS_2019_AUDIT, { asOf: "2019", note: "Households cooking with unclean fuels: firewood, paraffin, charcoal." });
sourced("fuel.firewood", 79.5, "percent", "T1", CENSUS_2019_AUDIT, { asOf: "2019" });
sourced("livestock.households", 215_003, "households", "T1", "KNBS, 2019 Census, agriculture report, per Firefly's audit", {
  asOf: "2019",
  alt: { value: 177_701, source: "Kitui County PCRA, derived from the census", tier: "T2", note: "A different definition: households practising livestock production. Both are real; they are shown side by side, never averaged." },
});
sourced("livestock.households.pcra", 177_701, "households", "T2", "Kitui County PCRA, derived from the 2019 Census, per Firefly's audit", { asOf: "2019", note: "Households practising livestock production: a different definition from the census agriculture report." });
sourced("migration.net", -72_051, "people", "T1", "KNBS, 2019 Census Analytical Report on Migration, Volume VIII, per Firefly's audit", { asOf: "2019", note: "Net recent-migration balance. Migration context, not a voter count." });
const ICT_NATIONAL = "CA/KNBS, Analytical Report on ICT, 2023/24 Kenya Housing Survey (national tables), per Firefly's audit";
for (const [id, value] of [
  ["ict.kenya.internet", 35.0], ["ict.kenya.internet.rural", 25.0], ["ict.kenya.internet.urban", 56.6],
  ["ict.kenya.internet.15-24", 46.6], ["ict.kenya.internet.25-34", 59.3], ["ict.kenya.internet.35-44", 47.1],
  ["ict.kenya.youth", 58.6], ["ict.kenya.youth.rural", 46.7], ["ict.kenya.youth.urban", 78.7],
  ["ict.kenya.internet.higher-ed", 92.3], ["ict.nairobi.youth", 83.1], ["ict.mombasa.youth", 70.4],
  ["ict.kenya.phone", 53.7],
] as [string, number][]) sourced(id, value, "percent", "T1", ICT_NATIONAL, { asOf: "2023/24", note: "National or city figure, not a Kitui figure." });
const RADIO_LE = "CA/KARF audience report, Lower Eastern (Kitui, Machakos, Makueni), per Firefly's audit";
for (const [id, value] of [["radio.musyi", 17.3], ["radio.citizen", 11.3], ["radio.athiani", 10.9], ["radio.mbaitu", 5.7], ["radio.county", 4.4], ["radio.mwatu", 0.5]] as [string, number][])
  sourced(id, value, "percent", "T2", RADIO_LE, { note: "Share of listeners across Lower Eastern, not Kitui alone, from an earlier measurement; the year is to be confirmed against the report." });
sourced("boda.riders", 14_000, "people", "T3", `A 2026 report, per ${AUDIT}`, { asOf: "2026", note: "An estimate, not an NTSA register count." });
sourced("boda.unlicensed", 10_921, "people", "T3", `A 2026 report, per ${AUDIT}`, { asOf: "2026" });
sourced("boda.licensed.2026", 783, "people", "T2", `Kitui County Government and NTSA, August 2026, per ${AUDIT}`, { asOf: "2026-08", note: "Smart driving licences issued, drawn from all 40 wards." });
sourced("ngcdf.allocation.2026", 192_613_000, "ksh", "T1", "Kitui Central NG-CDF, FY2026/27 allocation, per Firefly's audit", { asOf: "2026", decimals: 3 });
sourced("channel.x.followers", 5_100, "count", "T3", `Public X profile @MakaliMulu, indexed snapshot, per ${AUDIT}`, { asOf: "2026-09", note: "Approximate and live; a dated baseline, replaced by the Week 1 export." });
sourced("church.catholic", 240_000, "people", "T3", `Catholic Diocese of Kitui, per ${AUDIT}`, { note: "Over 240,000 baptised Catholics across the diocese. A floor, not a congregation count." });
sourced("show.2023", 70_000, "people", "T3", `Kitui Agricultural Show 2023, per ${AUDIT}`, { note: "More than 70,000 attendees over three days: one event, not market-day attendance." });
for (const [id, value] of [["health.density.doctors", 0.7], ["health.density.clinical", 2.3], ["health.density.lab", 1.8], ["health.density.nurses", 7.2], ["health.density.core", 10.2]] as [string, number][])
  sourced(id, value, "count", "T2", `Countdown 2030, Kitui health workforce, per ${AUDIT}`, { note: "Per 10,000 population." });

// ---- county-policy parameters the campaign is still to size (Section 4.4)
target("policy.ward-fund", 100_000_000, "ksh", "The proposed Ward Development Equalization Fund, per ward per year: a campaign policy proposal, not yet sized.", { source: "Campaign policy proposal, this proposal" });
sourced("policy.ndengu-output", 45_000, "count", "T3", "KNBS 2019 Census and ASTGS, as cited; page reference pending", { note: "Tonnes of ndengu output, not yet tiered to a page." });

// ---- the Kitui source pack (29 Oct 2026): four documents read in docs/evidence-2026-10/source-pack-upgrades.md.
// Pages are those of the cleaned kitui-source-documents.pdf. National figures are labelled national.
const GDS = "County Government of Kitui, KNBS and UN Women, County Gender Data Sheet: Kitui (October 2025), from KDHS 2022 and the 2019 Census";
const NDMA25 = "NDMA and Kitui County Steering Group, Kitui County 2025 Long Rains Food and Nutrition Security Assessment (July 2025)";
const SCORECARD = "County Government of Kitui, Delivering the Kitui Promise: Three-Year Scorecard (Aug 2022 – Aug 2025)";
const ABSTRACT_2015 = "KNBS, Kitui County Statistical Abstract 2015";
const NATIONAL = "Kenya, national figure, not a Kitui figure.";
const page = (n: string, extra = "") => `Source pack p. ${n}.${extra ? ` ${extra}` : ""}`;

// Phones, internet and the register's sex split (KDHS 2022 via the Gender Data Sheet).
sourced("ict.phone.adult.men", 77.7, "percent", "T1", GDS, { asOf: "2022", note: page("9", "Men aged 18 and over who own a mobile phone.") });
sourced("ict.phone.adult.women", 73.9, "percent", "T1", GDS, { asOf: "2022", note: page("9", "Women aged 18 and over who own a mobile phone.") });
sourced("ict.kenya.phone.adult.men", 80.4, "percent", "T1", GDS, { asOf: "2022", note: page("9", NATIONAL) });
sourced("ict.kenya.phone.adult.women", 77.5, "percent", "T1", GDS, { asOf: "2022", note: page("9", NATIONAL) });
sourced("ict.internet.1549.men", 34.7, "percent", "T1", GDS, { asOf: "2022", note: page("9", "Men aged 15–49 who used the internet in the last 12 months.") });
sourced("ict.internet.1549.women", 23.3, "percent", "T1", GDS, { asOf: "2022", note: page("9", "Women aged 15–49 who used the internet in the last 12 months.") });
sourced("ict.kenya.internet.1549.men", 56.2, "percent", "T1", GDS, { asOf: "2022", note: page("9", NATIONAL) });
sourced("ict.kenya.internet.1549.women", 44.2, "percent", "T1", GDS, { asOf: "2022", note: page("9", NATIONAL) });
sourced("register.women.share", 52, "percent", "T1", GDS, { asOf: "2022", decimals: 0, note: page("10", "Women's share of registered voters, 2022.") });
modelled(
  "ict.phone.adult",
  (v("register.women.share") * v("ict.phone.adult.women") + (100 - v("register.women.share")) * v("ict.phone.adult.men")) / 100,
  "percent",
  "Adult phone ownership weighted by the register's sex split: 52% × 73.9% + 48% × 77.7%.",
  { source: GDS },
);
modelled("reach.phone.adult", Math.round((v("register.2026") * v("ict.phone.adult")) / 100 / 1000) * 1000, "voters", "The adult phone-ownership rate applied to the July 2026 register, rounded to the nearest 1,000. The adult basis: voters are adults.", { tier: "T3", source: GDS });
modelled("reach.nophone.adult", Math.round((v("register.2026") - (v("register.2026") * v("ict.phone.adult")) / 100) / 1000) * 1000, "voters", "The July 2026 register less adult phone owners, rounded to the nearest 1,000.", { tier: "T3", source: GDS });
modelled("reach.phone.resident", v("reach.smartphone") + v("reach.sms-only"), "voters", "Phone owners on the resident basis: reachable online plus reachable by SMS only.", { source: REACH });
modelled("reach.phone.ratio", v("reach.phone.adult") / v("reach.phone.resident"), "count", "Adult-basis phone owners / resident-basis phone owners.", { source: REACH, decimals: 1 });

// Women (Gender Data Sheet).
sourced("women.nopaidwork", 60.2, "percent", "T1", GDS, { asOf: "2022", note: page("9", "Women aged 15–49 with no paid work in the past 12 months.") });
sourced("women.nopaidwork.kenya", 40.3, "percent", "T1", GDS, { asOf: "2022", note: page("9", NATIONAL) });
sourced("men.nopaidwork", 21.9, "percent", "T1", GDS, { asOf: "2022", note: page("9", "Men aged 15–49 with no paid work in the past 12 months.") });
sourced("women.unpaidwork", 14.8, "percent", "T1", GDS, { note: page("10", "Share of time women aged 15+ spend on unpaid domestic and care work.") });
sourced("men.unpaidwork", 2.8, "percent", "T1", GDS, { note: page("10", "Share of time men aged 15+ spend on unpaid domestic and care work.") });
sourced("women.unpaidwork.kenya", 18.7, "percent", "T1", GDS, { note: page("10", NATIONAL) });
sourced("men.unpaidwork.kenya", 3.6, "percent", "T1", GDS, { note: page("10", NATIONAL) });
sourced("women.purchases", 87.4, "percent", "T1", GDS, { asOf: "2022", note: page("10", "Women who take part in decisions on major household purchases.") });
sourced("women.purchases.kenya", 78.2, "percent", "T1", GDS, { asOf: "2022", note: page("10", NATIONAL) });
sourced("women.cash.alone", 4.7, "percent", "T1", GDS, { asOf: "2022", note: page("10", "Women with cash earnings who decide alone how they are used.") });
sourced("women.cash.joint", 67.3, "percent", "T1", GDS, { asOf: "2022", note: page("10", "…who decide jointly with their husbands.") });
sourced("women.cash.husband", 27.9, "percent", "T1", GDS, { asOf: "2022", note: page("10", "…whose husbands mainly decide.") });
sourced("water.women.collect", 66.0, "percent", "T1", GDS, { note: page("6", "Adult women as a share of those who collect household drinking water.") });
sourced("water.women.collect.kenya", 68.5, "percent", "T1", GDS, { note: page("6", NATIONAL) });

// Water.
sourced("water.30min", 21.2, "percent", "T1", GDS, { note: page("6", "Population reaching drinking water in under 30 minutes.") });
sourced("water.30min.kenya", 67.9, "percent", "T1", GDS, { note: page("6", NATIONAL) });
sourced("water.over30", 61.8, "percent", "T1", GDS, { note: page("6", "Population spending more than 30 minutes to reach drinking water.") });
sourced("water.over30.kenya", 8.7, "percent", "T1", GDS, { note: page("6", NATIONAL) });
sourced("water.points.working", 450, "count", "T1", NDMA25, { asOf: "2025-07", note: page("103", "Water sources operational at the assessment.") });
sourced("water.points.total", 630, "count", "T1", NDMA25, { asOf: "2025-07", note: page("103") });
modelled("water.points.down.share", (100 * (v("water.points.total") - v("water.points.working"))) / v("water.points.total"), "percent", "Water sources not operational / all water sources assessed.", { source: NDMA25 });
sourced("water.points.working.kitui-central", 56, "percent", "T1", NDMA25, { asOf: "2025-07", decimals: 0, note: page("103", "Share of water sources operational in Kitui Central, the lowest of the eight.") });
sourced("water.points.working.kitui-south", 61, "percent", "T1", NDMA25, { asOf: "2025-07", decimals: 0, note: page("103") });
sourced("water.schools.unsafe", 2_244, "count", "T1", NDMA25, { asOf: "2025-07", note: page("116", "School units (797 pre-primary, 679 primary, 558 junior, 210 secondary) without safe water within 100 m. Units by level; several may share a compound.") });

// Health.
sourced("health.access.problem", 69.5, "percent", "T1", GDS, { asOf: "2022", note: page("8", "Women reporting at least one problem accessing health care.") });
sourced("health.access.problem.kenya", 52.4, "percent", "T1", GDS, { asOf: "2022", note: page("8", NATIONAL) });
sourced("health.facility-births", 79.5, "percent", "T1", GDS, { asOf: "2022", note: page("8") });
sourced("health.facility-births.kenya", 88.1, "percent", "T1", GDS, { asOf: "2022", note: page("8", NATIONAL) });
sourced("health.skilled-birth", 86.0, "percent", "T1", GDS, { asOf: "2022", note: page("8") });
sourced("health.imr", 23, "count", "T1", GDS, { asOf: "2022", note: page("7", "Infant deaths per 1,000 live births, KDHS 2022.") });
sourced("health.u5mr", 27, "count", "T1", GDS, { asOf: "2022", note: page("7", "Under-5 deaths per 1,000 live births, KDHS 2022.") });
sourced("health.imr.kenya", 32, "count", "T1", GDS, { asOf: "2022", note: page("7", NATIONAL) });
sourced("health.u5mr.kenya", 41, "count", "T1", GDS, { asOf: "2022", note: page("7", NATIONAL) });
sourced("health.measles.ngomeni", 112, "count", "T1", NDMA25, { asOf: "2025-06", note: page("106", "Confirmed measles cases, Ngomeni, January–June 2025.") });
sourced("health.typhoid.2025", 2_564, "count", "T1", NDMA25, { asOf: "2025-06", note: page("106", "Typhoid cases, January–June 2025.") });
sourced("health.typhoid.2024", 1_696, "count", "T1", NDMA25, { asOf: "2024-06", note: page("106", "Typhoid cases in the same period a year earlier.") });
modelled("health.typhoid.rise", (100 * (v("health.typhoid.2025") - v("health.typhoid.2024"))) / v("health.typhoid.2024"), "percent", "Rise in typhoid cases, January–June 2025 on the year before.", { source: NDMA25 });
sourced("health.dysentery.rise", 8.5, "percent", "T1", NDMA25, { asOf: "2025-06", note: page("106") });
sourced("health.diet.diversity", 42.9, "percent", "T1", `SMART nutrition assessment 2023, as cited in ${NDMA25}`, { asOf: "2023", note: page("107–108", "Children 6–23 months meeting minimum dietary diversity.") });
sourced("health.diet.acceptable", 30.5, "percent", "T1", `SMART nutrition assessment 2023, as cited in ${NDMA25}`, { asOf: "2023", note: page("107–108", "Children 6–23 months with a minimum acceptable diet.") });

// Education.
sourced("edu.none.men", 9.7, "percent", "T1", GDS, { asOf: "2022", note: page("8", "Males aged 6 and over with no education.") });
sourced("edu.none.women", 15.1, "percent", "T1", GDS, { asOf: "2022", note: page("8", "Females aged 6 and over with no education.") });
sourced("edu.secondary.girls", 51.6, "percent", "T1", GDS, { asOf: "2022", note: page("9", "Girls' net secondary attendance.") });
sourced("edu.secondary.boys", 40.8, "percent", "T1", GDS, { asOf: "2022", note: page("9", "Boys' net secondary attendance.") });
sourced("edu.literacy.men", 99.3, "percent", "T1", GDS, { asOf: "2022", note: page("8", "Men aged 15–49.") });
sourced("edu.literacy.women", 94.8, "percent", "T1", GDS, { asOf: "2022", note: page("8", "Women aged 15–49.") });
sourced("schools.meals", 439, "count", "T1", NDMA25, {
  asOf: "2025-07",
  note: page("111", "Schools with a meals programme, of 3,969."),
  alt: { value: 1_994, source: `${NDMA25}, p. 113`, tier: "T1", note: "School units with a programme, of 5,868, all parent-supported. The report's two counts do not agree; both are kept." },
});
sourced("schools.meals.of", 3_969, "count", "T1", NDMA25, { asOf: "2025-07", note: page("111") });
sourced("schools.damaged", 426, "count", "T1", NDMA25, { asOf: "2025-04", note: page("111", "Schools damaged, March–April 2025: 107 pre-primary, 137 primary, 134 junior, 48 secondary.") });
sourced("schools.damaged.learners", 9_900, "people", "T1", NDMA25, { asOf: "2025-04", note: page("111", "About 9,900 learners affected.") });

// Food security, livelihoods and the economy.
sourced("livelihood.mixed", 55, "percent", "T1", NDMA25, { decimals: 0, note: page("92", "Share of the population in the mixed farming zone.") });
sourced("livelihood.marginal", 42, "percent", "T1", NDMA25, { decimals: 0, note: page("92", "Share of the population in the marginal mixed farming zone.") });
sourced("livelihood.employment", 3, "percent", "T1", NDMA25, { decimals: 0, note: page("92", "Formal and unskilled employment zone.") });
sourced("wealth.verypoor", 29, "percent", "T1", NDMA25, { decimals: 0, note: page("92") });
sourced("wealth.poor", 31, "percent", "T1", NDMA25, { decimals: 0, note: page("92") });
sourced("wealth.middle", 26, "percent", "T1", NDMA25, { decimals: 0, note: page("92") });
sourced("wealth.better", 14, "percent", "T1", NDMA25, { decimals: 0, note: page("92") });
sourced("greengrams.cash.marginal", 40, "percent", "T1", NDMA25, { decimals: 0, note: page("94–95", "Green grams' share of cash income in marginal mixed farming.") });
sourced("greengrams.cash.mixed", 30, "percent", "T1", NDMA25, { decimals: 0, note: page("94–95", "…in mixed farming.") });
sourced("greengrams.lr2025", 146_522, "count", "T1", NDMA25, { asOf: "2025-07", note: page("95", "90 kg bags, long rains 2025.") });
sourced("greengrams.lr2025.vs-average", 58, "percent", "T1", NDMA25, { asOf: "2025-07", decimals: 0, note: page("95", "Above the five-year average.") });
sourced("maize.lr2025.vs-average", 41, "percent", "T1", NDMA25, { asOf: "2025-07", decimals: 0, note: page("95", "Below the five-year average.") });
sourced("price.maize", 59, "ksh", "T1", NDMA25, { asOf: "2025-07", note: page("102", "Per kg; five-year average 56.") });
sourced("price.maize.average", 56, "ksh", "T1", NDMA25, { note: page("102") });
sourced("price.goat", 5_969, "ksh", "T1", NDMA25, { asOf: "2025-07", note: page("102", "A medium goat.") });
sourced("price.goat.average", 4_262, "ksh", "T1", NDMA25, { note: page("102") });
sourced("fodder.held", 21_734, "count", "T1", NDMA25, { asOf: "2025-07", note: page("97–98", "Bales of fodder held.") });
sourced("fodder.needed", 215_000, "count", "T1", NDMA25, { asOf: "2025-07", note: page("97–98", "Bales needed. No commercial fodder or pasture business in the county.") });
sourced("aflatoxin.maize", 32, "percent", "T1", `KEPHIS 2024 tests, as cited in ${NDMA25}`, { asOf: "2024", decimals: 0, note: page("96", "Maize samples above the safe limit.") });
sourced("aflatoxin.groundnut", 75, "percent", "T1", `KEPHIS 2024 tests, as cited in ${NDMA25}`, { asOf: "2024", decimals: 0, note: page("96", "Groundnut samples above the safe limit.") });
sourced("goats.ccpp.morbidity", 29, "percent", "T1", NDMA25, { decimals: 0, note: page("100", "CCPP morbidity in goats; mortality 15%.") });
sourced("goats.ccpp.mortality", 15, "percent", "T1", NDMA25, { decimals: 0, note: page("100") });
sourced("goats.ppr.morbidity", 15, "percent", "T1", NDMA25, { decimals: 0, note: page("100", "PPR morbidity in goats; mortality 8%.") });
sourced("goats.ppr.mortality", 8, "percent", "T1", NDMA25, { decimals: 0, note: page("100") });
sourced("border.killed", 2, "count", "T1", NDMA25, { asOf: "2025-07", note: page("93", "People killed on the Kitui–Tana River border (Endau/Malalani).") });
sourced("poverty.ndma.2019", 60.4, "percent", "T2", NDMA25, { note: page("92", "Cited by NDMA as \"below the poverty line (KNBS 2019)\"; a different base from KNBS 2021's 55.2%.") });
sourced("poverty.ndma.county", 63.1, "percent", "T2", NDMA25, { note: page("92", "Cited by NDMA as \"a county poverty rate\"; base not stated.") });

// Population and inclusion.
sourced("population.2025", 1_258_954, "people", "T1", GDS, { asOf: "2025", note: page("6", "KNBS projection.") });
sourced("population.2030", 1_327_463, "people", "T1", GDS, { asOf: "2030", note: page("6", "KNBS projection.") });
sourced("population.15-24.2025", 276_060, "people", "T1", GDS, { asOf: "2025", note: page("6", "KNBS projection. The 18–34 row on the same page is not used: its 2025 and 2030 totals cannot both be right.") });
sourced("disability.men", 7.5, "percent", "T1", GDS, { asOf: "2022", note: page("6", "Men aged 15 and over with a disability.") });
sourced("disability.women", 5.5, "percent", "T1", GDS, { asOf: "2022", note: page("6", "Women aged 15 and over with a disability.") });
sourced("fuel.clean.2022", 6.3, "percent", "T1", GDS, { asOf: "2022", note: page("6", "Households relying on clean cooking fuels.") });
sourced("fuel.clean.2022.kenya", 21.2, "percent", "T1", GDS, { asOf: "2022", note: page("6", NATIONAL) });
sourced("farm.employs", 66, "percent", "T2", SCORECARD, { decimals: 0, note: page("141", "The county government's statement that agriculture employs 66% of the population: a claim by the county, not a statistical measurement.") });
sourced("farm.rural-households", 87, "percent", "T2", SCORECARD, { decimals: 0, note: page("141", "The county government's statement that agriculture sustains 87% of rural households.") });

// The incumbent's scorecard: what it claims, and what it itemises (data/scorecard/kitui-scorecard-projects.csv).
sourced("scorecard.claimed", 2_244, "count", "T1", SCORECARD, { asOf: "2025-08", note: page("139–140", "Projects and programmes claimed. Tier 1 as a record of what the county claims, not evidence that the claims are true.") });
sourced("scorecard.itemised", 401, "count", "T1", SCORECARD, { asOf: "2025-08", note: page("140–165", "Projects itemised in the scorecard's tables with cost, place and status.") });
sourced("scorecard.itemised.ksh", 1_363_953_263, "ksh", "T1", SCORECARD, { asOf: "2025-08", decimals: 2, note: "Sum of the itemised costs (data/scorecard/kitui-scorecard-projects.csv)." });
modelled("scorecard.unitemised", v("scorecard.claimed") - v("scorecard.itemised"), "count", "Projects claimed less projects itemised.", { source: SCORECARD });
const SCORECARD_SPEND: [string, number, number][] = [
  ["kitui-central", 69, 254.9], ["mwingi-north", 54, 211.2], ["kitui-south", 59, 197.5], ["mwingi-central", 59, 182.3],
  ["kitui-east", 45, 133.7], ["kitui-rural", 28, 109.9], ["kitui-west", 33, 62.9], ["mwingi-west", 27, 50.5],
];
for (const [id, n, m] of SCORECARD_SPEND) {
  sourced(`scorecard.${id}.projects`, n, "count", "T1", SCORECARD, { asOf: "2025-08", note: "Itemised projects attributed to the constituency." });
  sourced(`scorecard.${id}.ksh`, m * 1e6, "ksh", "T1", SCORECARD, { asOf: "2025-08", decimals: 1, note: "Itemised spend attributed to the constituency, KSh, summed from the scorecard's tables." });
  modelled(`scorecard.${id}.per-voter`, (m * 1e6) / v(`con.${id}`), "ksh", "Itemised spend / the constituency's 2022 register. Covers the 401 itemised projects only.", { source: SCORECARD });
}
sourced("scorecard.countywide.ksh", 160.9e6, "ksh", "T1", SCORECARD, { asOf: "2025-08", decimals: 1, note: "Itemised spend attributed to the whole county or headquarters (27 projects)." });
modelled("scorecard.attributed.ksh", SCORECARD_SPEND.reduce((n, [, , m]) => n + m * 1e6, 0), "ksh", "Itemised spend attributed to a constituency.", { source: SCORECARD, decimals: 1 });
modelled("scorecard.pool.share", (100 * ["mwingi-north", "mwingi-central", "mwingi-west", "kitui-south"].reduce((n, id) => n + v(`scorecard.${id}.ksh`), 0)) / v("scorecard.attributed.ksh"), "percent", "The pool's four constituencies' share of constituency-attributed itemised spend.", { source: SCORECARD });
sourced("scorecard.mwingi-west.water.ksh", 1.9e6, "ksh", "T1", SCORECARD, { asOf: "2025-08", decimals: 1, note: "Itemised water spend in Mwingi West." });
sourced("scorecard.kitui-central.health.ksh", 76.6e6, "ksh", "T1", SCORECARD, { asOf: "2025-08", decimals: 1, note: "Itemised health spend in Kitui Central, which includes the county referral hospital." });
sourced("scorecard.health.attributed.ksh", 153.4e6, "ksh", "T1", SCORECARD, { asOf: "2025-08", decimals: 1, note: "Itemised health spend attributed to individual constituencies." });
// Its headline claims, as printed, and the itemised figures they do not reconcile with (the tracker's questions).
sourced("scorecard.vaccinated", 1_500_000, "count", "T1", SCORECARD, { note: page("141", "Livestock vaccinated, as claimed.") });
modelled("scorecard.vaccinated.itemised", 216_441 + 10_050, "count", "The itemised vaccination rows: 216,441 + 10,050 animals.", { source: SCORECARD });
sourced("scorecard.imr.from", 47, "count", "T1", SCORECARD, { note: page("146", "Infant mortality per 1,000, as claimed, before.") });
sourced("scorecard.imr.to", 13, "count", "T1", SCORECARD, { note: page("146", "…and after. The scorecard does not say whether this is a facility or a county rate.") });
sourced("scorecard.roads.graded", 6_974.77, "count", "T1", SCORECARD, { decimals: 2, note: page("152", "Km of road graded, as claimed.") });
sourced("scorecard.roads.row.km", 2_800, "count", "T1", SCORECARD, { note: page("152–153", "The itemised row \"30 km per ward\".") });
sourced("scorecard.roads.row.ksh", 18_000_000, "ksh", "T1", SCORECARD, { note: page("152–153") });
modelled("scorecard.roads.row.per-km", v("scorecard.roads.row.ksh") / v("scorecard.roads.row.km"), "ksh", "The itemised road row's cost / its length.", { source: SCORECARD });
sourced("scorecard.boreholes.drilled", 57, "count", "T1", SCORECARD, { note: page("143") });
sourced("scorecard.boreholes.equipped", 32, "count", "T1", SCORECARD, { note: page("143") });
sourced("scorecard.health.beneficiaries", 1_304_665, "people", "T1", SCORECARD, { note: page("147", "Beneficiaries listed for two health projects: larger than the 2019 population.") });
sourced("scorecard.kangu.ksh", 839_700_000, "ksh", "T1", SCORECARD, { decimals: 1, note: page("143", "The Kangu Kangu water project, commissioned 19 September 2025.") });
sourced("scorecard.kangu.households", 25_000, "households", "T1", SCORECARD, { note: page("143", "Households, as claimed (\"25,000+\").") });
sourced("scorecard.boda.sheds", 44, "count", "T1", SCORECARD, { note: page("162", "Boda boda sheds, as claimed; 32 are itemised.") });
sourced("scorecard.boda.sheds.itemised", 32, "count", "T1", SCORECARD, { note: page("162–163") });
sourced("scorecard.police.stations", 8, "count", "T1", SCORECARD, { note: page("165", "Border police stations, as claimed; six complete.") });
sourced("scorecard.police.complete", 6, "count", "T1", SCORECARD, { note: page("165") });

// The 2015 abstract: history only.
sourced("ngcdf.kitui-central.2013", 76.7e6, "ksh", "T1", ABSTRACT_2015, { asOf: "2013/14", decimals: 1, note: page("75") });
sourced("ngcdf.kitui-central.2014", 110.3e6, "ksh", "T1", ABSTRACT_2015, { asOf: "2014/15", decimals: 1, note: page("75", "Provisional.") });

export const FIGURES: Readonly<Record<string, Figure>> = FIG;

/** The ward register as ranked rows, for tables and charts that need the order. */
export const WARD_ROWS = WARDS.map((w) => ({ id: `ward.${slugOf(w.name)}`, name: w.name, constituency: w.constituency, voters: w.voters }));

export function figure(id: string): Figure {
  const f = FIG[id];
  if (!f) throw new Error(`figures: unknown id "${id}"`);
  return f;
}
