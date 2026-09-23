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
sourced("register.2026", 605_703, "voters", "T1", ECVR, { asOf: "2026-07" });
sourced("register.2026.ecvr-drive", 61_839, "voters", "T1", ECVR, { asOf: "2026-04-28", note: "New voters in the 30-day ECVR drive that closed 28 April 2026." });
modelled("register.2026.growth", v("register.2026") - v("register.2022"), "voters", "605,703 less 532,758: growth since 2022.");
modelled("register.2026.continuous", v("register.2026") - v("register.2022") - v("register.2026.ecvr-drive"), "voters", "Growth since 2022 less the ECVR drive: continuous registration outside the drive.");
sourced("register.polling-stations", 1_578, "count", "T1", "IEBC 2022 polling station register");
modelled("register.2022.ward-mean", Math.round(v("register.2022") / 40), "voters", "532,758 across 40 wards.");
add({ id: "register.2026.by-ward", value: null, unit: "voters", tier: null, state: "needed", source: null, closesWith: "IEBC ECVR ward annex" });

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
sourced("result.2022.gov.malombe", 198_004, "votes", "T2", MEDIA_2022, { asOf: "2022-08" });
sourced("result.2022.gov.musila", 114_606, "votes", "T2", "The Star, August 2022", {
  asOf: "2022-08",
  alt: { value: 117_606, source: "Nation and Standard, August 2022", tier: "T2", note: "Two published totals. Neither is preferred." },
});
sourced("result.2022.gov.musila.alt", 117_606, "votes", "T2", "Nation and Standard, August 2022", { note: "The other published total; see result.2022.gov.musila." });
sourced("result.2022.gov.mueke", 10_639, "votes", "T2", MEDIA_2022);
sourced("result.2022.senate.wambua", 191_317, "votes", "T2", MEDIA_2022);
sourced("result.2022.womanrep.kasalu", 201_899, "votes", "T2", MEDIA_2022);
sourced("result.2017.gov.ngilu", 169_990, "votes", "T1", COA_2018);
sourced("result.2017.gov.musila", 114_827, "votes", "T1", COA_2018);
sourced("result.2017.gov.malombe", 74_681, "votes", "T1", COA_2018);
add({ id: "result.2022.mp.mulu", value: null, unit: "votes", tier: null, state: "needed", source: null, closesWith: "IEBC Form 35B, Kitui Central MP 2022" });

// ---- the benchmark and the arithmetic (Section 3.1)
target("benchmark", 200_000, "votes", "The single working benchmark: the 2022 winning tally, 198,004, rounded. Stated once in Section 3.1 and reused everywhere (consistency fix 3).");
modelled("benchmark.share-2022", pct(v("result.2022.gov.malombe"), v("register.2022")), "percent", "198,004 / 532,758: the 2022 winner's share of the register.");
modelled("benchmark.2026-equivalent", Math.round((v("result.2022.gov.malombe") / v("register.2022")) * v("register.2026")), "votes", "The 2022 winner's share of the register applied to the July 2026 register. A ratio carried forward, not a forecast.");
modelled("benchmark.2026-equivalent.rounded", Math.round(v("benchmark.2026-equivalent") / 5000) * 5000, "votes", "The 2026 equivalent, rounded to the nearest 5,000 for prose.");
modelled("benchmark.2026-equivalent.share", pct(v("result.2022.gov.malombe"), v("register.2022")), "percent", "The share carried forward: 198,004 / 532,758.");
target("turnout.constant", 62, "percent", "The turnout constant used in every calculation. Not a measurement: no certified county turnout is in the evidence pack, and the scenario model brackets it at 55–72%.", { decimals: 0 });
const TURNOUT = v("turnout.constant") / 100;
modelled("ballots.2022", Math.round(v("register.2022") * TURNOUT), "votes", "2022 register × 62% turnout constant.");
modelled("benchmark.share-of-ballots", pct(v("benchmark"), v("register.2022") * TURNOUT), "percent", "200,000 / ballots at 62%.");
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
  modelled(`path.${key}.ballots`, ballots, "votes", `${what} × 62% turnout constant.`);
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
sourced("census.rural", 1_082_168, "people", "T1", CENSUS);
sourced("census.urban", 54_019, "people", "T1", CENSUS);
sourced("census.rural.share", 95.2, "percent", "T1", CENSUS);
sourced("census.urban.share", 4.8, "percent", "T1", CENSUS);
sourced("water.surface", 400_000, "people", "T1", "KNBS, via the NDMA Long Rains Food Security Assessment", { note: "Approximate: residents relying on untreated surface water." });
sourced("poverty.2021", 55.2, "percent", "T1", "KNBS, Kenya Poverty Report (2021)", {
  alt: { value: 60.4, source: "NDMA Long Rains Food Security Assessment, citing KNBS", tier: "T2", note: "An older or differently defined rate. Both are shown; the KNBS report is current." },
});
sourced("poverty.2021.people", 637_000, "people", "T1", "KNBS, Kenya Poverty Report (2021)");
sourced("livestock.cattle", 613_000, "count", "T1", "Kitui County livestock statistics, as cited in the evidence pack");
sourced("livestock.goats", 2_000_000, "count", "T1", "Kitui County livestock statistics, as cited in the evidence pack");
sourced("livestock.poultry", 4_000_000, "count", "T1", "Kitui County livestock statistics, as cited in the evidence pack");
sourced("livestock.donkeys", 326_000, "count", "T1", "Kitui County livestock statistics, as cited in the evidence pack");
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
sourced("budget.total", 13.79e9, "ksh", "T3", CFSP, { note: "Cited through secondary reporting of the Paper; verify.", decimals: 2 });
sourced("budget.equitable", 11.64e9, "ksh", "T1", CFSP, { decimals: 2 });
sourced("budget.osr", 1.12e9, "ksh", "T3", CFSP, {
  decimals: 2,
  alt: { value: 1.339e9, source: "County Assembly revision of the CFSP [S48]", tier: "T3", note: "Raised by the Assembly. Both published; neither is preferred." },
});
sourced("budget.osr.revised", 1.339e9, "ksh", "T3", "County Assembly revision of the CFSP [S48]", { decimals: 3 });
sourced("budget.grants", 1.04e9, "ksh", "T1", CFSP, { decimals: 2 });
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

// ---- his channels (Section 2.9), read off the public page
sourced("channel.fb.followers", 15_000, "count", "T3", "Public Facebook page, approximate count as displayed", { note: "Approximate; replaced by the Week 1 export." });
sourced("channel.fb.posts", 745, "count", "T3", "Public Facebook page, as displayed");

// ---- Annex C: the one poll with a published sample
sourced("poll.politrack.n", 2_927, "count", "T3", "Politrack Africa, via The County Diary, 12 March 2026");

// ---- segment sizes that are derived rather than measured (Section 4.3)
modelled("segment.rural.voters", Math.round((v("register.2022") * 95.2) / 100 / 1000) * 1000, "voters", "95.2% rural share applied to the 2022 register, rounded. The register is not published by rural/urban split.");
modelled("segment.urban.voters", Math.round((v("register.2022") * 4.8) / 100 / 1000) * 1000, "voters", "4.8% urban share applied to the 2022 register, rounded.");
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
target("target.captains", 400, "count", "Ward captains, 10 per ward: a campaign-owned recommendation (Section 5.1.3).", { source: T_CAMPAIGN });
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
target("effort.digital.pool", 65, "percent", "Share of Phase −1 digital reach effort geofenced to the pool.", { source: T_FIREFLY, decimals: 0 });
target("effort.sms.pool", 70, "percent", "Share of SMS/USSD onboarding effort to the pool's 21 wards.", { source: T_FIREFLY, decimals: 0 });

// ---- county-policy parameters the campaign is still to size (Section 4.4)
target("policy.ward-fund", 100_000_000, "ksh", "The proposed Ward Development Equalization Fund, per ward per year: a campaign policy proposal, not yet sized.", { source: "Campaign policy proposal, this proposal" });
sourced("policy.ndengu-output", 45_000, "count", "T3", "KNBS 2019 Census and ASTGS, as cited; page reference pending", { note: "Tonnes of ndengu output, not yet tiered to a page." });

export const FIGURES: Readonly<Record<string, Figure>> = FIG;

/** The ward register as ranked rows, for tables and charts that need the order. */
export const WARD_ROWS = WARDS.map((w) => ({ id: `ward.${slugOf(w.name)}`, name: w.name, constituency: w.constituency, voters: w.voters }));

export function figure(id: string): Figure {
  const f = FIG[id];
  if (!f) throw new Error(`figures: unknown id "${id}"`);
  return f;
}
