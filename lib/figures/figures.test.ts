/**
 * The arithmetic this document rests on, checked against the register it rests on.
 *
 *     node --experimental-strip-types --test lib/figures/figures.test.ts
 *     npm run test:figures
 *
 * WHY THESE ASSERTIONS EXIST. §3.4 states around forty derived figures — the top twelve wards, the
 * deficit pool, four coalition paths, ballots at 62% — and every one is a sum or a subtraction
 * over the same forty ward numbers. Stated as prose they can drift apart, and this audit found
 * that they have. A failing assertion here is therefore NOT permission to edit the content: hard
 * rule 2 says a disagreement between the document and its own arithmetic is logged in
 * CONFLICTS.md and rendered with an Under review flag, and reconciled by Firefly. The test names
 * the conflict where one exists.
 *
 * WHY IT READS THE JSON DIRECTLY. data/ward-register.ts imports ./ward-register.json, which plain
 * Node will not do without an import attribute the bundler does not want. So the arithmetic lives
 * in ./register-math.ts, which takes the register as an argument and imports nothing, and this
 * file hands it the same JSON the application reads — no bundler, no mocking, and no second copy
 * of the forty numbers this document rests on. ./register.ts binds the same functions to the real
 * register for the components.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  ballotsAt,
  blocTotal,
  bottomWards,
  countyTotal,
  rankWards,
  topWards,
  wardCount,
} from "./register-math.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const register = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "ward-register.json"), "utf8"));
const CONS = register.constituencies;

/** Share of the county register, to two places — the precision §3.4 prints. */
const share = (n: number) => Number(((n / countyTotal(CONS)) * 100).toFixed(2));

/* ------------------------------------------------------------------ the register itself */

test("each constituency's wards sum to its stated total", () => {
  for (const c of CONS) {
    const sum = c.wards.reduce((s: number, w: { voters: number }) => s + w.voters, 0);
    assert.equal(sum, c.voters, `${c.name}: wards sum to ${sum}, stated total is ${c.voters}`);
  }
});

test("the eight constituencies sum to 532,758 across 40 wards", () => {
  assert.equal(countyTotal(CONS), 532_758);
  assert.equal(wardCount(CONS), 40);
  assert.equal(CONS.length, 8);
});

test("the prison voters are carried separately and not folded into the ward register", () => {
  assert.equal(register.prisonVoters, 75);
  assert.equal(register.countyTotalWards, 532_758);
  assert.equal(register.countyTotalWithPrisons, 532_833);
  assert.equal(register.countyTotalWards + register.prisonVoters, register.countyTotalWithPrisons);
});

/* ------------------------------------------------------------------ concentration (§3.4.2) */

test("the top 12 wards hold 201,267 voters — 37.78% of the register", () => {
  assert.equal(topWards(CONS, 12), 201_267);
  assert.equal(share(201_267), 37.78);
});

test("the top 20 wards hold 315,006 voters — 59.13%", () => {
  assert.equal(topWards(CONS, 20), 315_006);
  assert.equal(share(315_006), 59.13);
});

test("the bottom 10 wards hold 96,415 voters — 18.10%", () => {
  assert.equal(bottomWards(CONS, 10), 96_415);
  assert.equal(share(96_415), 18.1);
});

test("the ward ranking is stable where two wards share a figure", () => {
  // Mui and Mutha both hold 11,039. An unstable sort would let the identity of the "12
  // megawards" change between a build and a screenshot of it.
  const twice = rankWards(CONS).filter((w) => w.voters === 11_039).map((w) => w.name);
  assert.deepEqual(twice, ["Mui", "Mutha"]);
  assert.deepEqual(rankWards(CONS).map((w) => w.name), rankWards(CONS).map((w) => w.name));
});

/* ------------------------------------------------------------------ the blocs (§3.3.3, §3.4.5) */

test("the Mwingi bloc holds 200,198 registered voters", () => {
  assert.equal(blocTotal(CONS, ["Mwingi North", "Mwingi West", "Mwingi Central"]), 200_198);
});

test("the Mwingi bloc exceeds the 2022 winning total on the register and falls short on ballots", () => {
  const mwingi = blocTotal(CONS, ["Mwingi North", "Mwingi West", "Mwingi Central"]);
  assert.ok(mwingi > 198_004, "the register is larger than 2022's winning tally");
  // §3.3.3 prints "roughly 124,100 ballots"; the exact product is 124,123.
  assert.equal(ballotsAt(mwingi, 0.62), 124_123);
  assert.ok(ballotsAt(mwingi, 0.62) < 198_004, "…and the ballots it yields are not");
});

test("the recognition-deficit pool is 275,570, and rounds to 51.73% not 51.72%", () => {
  const pool = blocTotal(CONS, ["Mwingi North", "Mwingi West", "Mwingi Central", "Kitui South"]);
  assert.equal(pool, 275_570);
  const exact = (pool / countyTotal(CONS)) * 100;
  assert.equal(Number(exact.toFixed(4)), 51.7252);
  // CONFLICT C-6. The panel prints 51.73% (correctly rounded); the prose prints 51.72%
  // (truncated). This assertion records which is which. It does not change either.
  assert.equal(Number(exact.toFixed(2)), 51.73);
});

test("the deficit wards number 21, not the 24 the mandate directs effort into (C-7)", () => {
  const names = ["Mwingi North", "Mwingi West", "Mwingi Central", "Kitui South"];
  const wards = CONS.filter((c: { name: string }) => names.includes(c.name))
    .reduce((n: number, c: { wards: unknown[] }) => n + c.wards.length, 0);
  // CONFLICT C-7. §3.4.5 sends 70% of SMS/USSD onboarding and 240 of 400 ward captains into
  // "these 24 northern and southern deficit wards", while the 275,570 pool it quotes excludes
  // Kitui East entirely. 15 Mwingi wards + 6 Kitui South wards is 21.
  assert.equal(wards, 21);
});

test("Ikanga/Kyatune ranks 11th, so the summary line's 'top 8' is wrong (C-5)", () => {
  const ranked = rankWards(CONS);
  const rankOf = (name: string) => ranked.find((w) => w.name === name)?.rank;
  assert.equal(rankOf("Kyuso"), 1);
  assert.equal(rankOf("Tseikuru"), 5);
  assert.equal(rankOf("Mumoni"), 7);
  assert.equal(rankOf("Athi"), 8);
  // CONFLICT C-5. The §3.4.5 prose says "2 of the top 11", which matches. The summary table
  // says "5 of top 8 wards", which cannot be true of a ward ranked 11th.
  assert.equal(rankOf("Ikanga/Kyatune"), 11);
});

/* ------------------------------------------------------------------ the four paths (§3.4.3) */

test("the four coalition paths total 200,198 / 212,183 / 201,267 / 191,811", () => {
  assert.equal(blocTotal(CONS, ["Mwingi North", "Mwingi West", "Mwingi Central"]), 200_198);
  assert.equal(blocTotal(CONS, ["Kitui Central", "Kitui South", "Kitui West"]), 212_183);
  assert.equal(topWards(CONS, 12), 201_267);
  assert.equal(blocTotal(CONS, ["Kitui Central", "Kitui West", "Kitui Rural"]), 191_811);
});

test("Path B's stated margin is measured against 198,004, not the 200,000 it names (C-4)", () => {
  const pathB = blocTotal(CONS, ["Kitui Central", "Kitui South", "Kitui West"]);
  // CONFLICT C-4. The prose says Path B "exceeds the 200,000 threshold by 14,179 voters".
  assert.equal(pathB - 200_000, 12_183, "the margin over the threshold the sentence names");
  assert.equal(pathB - 198_004, 14_179, "the margin the sentence actually quotes");
});

test("Path D cannot reach the threshold on its register at all", () => {
  const pathD = blocTotal(CONS, ["Kitui Central", "Kitui West", "Kitui Rural"]);
  assert.equal(pathD, 191_811);
  assert.equal(200_000 - pathD, 8_189);
  // And on ballots the gap is not close: §3.4.3's "more than 100,000 votes short".
  assert.equal(ballotsAt(pathD, 0.62), 118_923);
  assert.ok(200_000 - Math.round(ballotsAt(pathD, 0.62) * 0.8) > 100_000);
});

/* ------------------------------------------------------------------ constituency power (§3.4.4) */

test('the "Big 4" hold 296,196 voters — 55.60% across 22 wards', () => {
  const big4 = blocTotal(CONS, ["Kitui Central", "Kitui South", "Mwingi Central", "Mwingi North"]);
  assert.equal(big4, 296_196);
  assert.equal(share(big4), 55.6);
  const wards = CONS.filter((c: { name: string }) =>
    ["Kitui Central", "Kitui South", "Mwingi Central", "Mwingi North"].includes(c.name)
  ).reduce((n: number, c: { wards: unknown[] }) => n + c.wards.length, 0);
  assert.equal(wards, 22);
});

test("every constituency's share and average ward size are what §3.4.4 printed", () => {
  /**
   * The rows of the CONSTITUENCY STRUCTURAL POWER RANKING table, as that table printed them.
   *
   * Written in the document's own notation — thousands separated, shares to two places — rather
   * than as numeric literals, for two reasons. It is the form a reader sees, so the assertion is
   * about the rendered figure and not about an intermediate. And the figure that replaced the
   * table COMPUTES all of this from the register instead of reprinting it, which is the right way
   * round but leaves no literal in the repository: the figure-retention guard correctly reported
   * fourteen figures as vanished. Pinning the printed form here restores them and proves the
   * arithmetic at the same time, which a declaration alone could not do.
   */
  const ROWS = [
    "1 | Kitui Central  | 77,764 | 14.60% | 5 wards | 15,553 voters",
    "2 | Kitui South    | 75,372 | 14.15% | 6 wards | 12,562 voters",
    "3 | Mwingi Central | 74,231 | 13.93% | 6 wards | 12,372 voters",
    "4 | Mwingi North   | 68,829 | 12.92% | 5 wards | 13,766 voters",
    "5 | Kitui East     | 65,377 | 12.27% | 6 wards | 10,896 voters",
    "6 | Kitui West     | 59,047 | 11.08% | 4 wards | 14,762 voters",
    "7 | Mwingi West    | 57,138 | 10.72% | 4 wards | 14,285 voters",
    "8 | Kitui Rural    | 55,000 | 10.32% | 4 wards | 13,750 voters",
  ];

  const num = (cell: string) => Number(cell.replace(/[^0-9.]/g, ""));
  const total = countyTotal(CONS);
  const ranked = [...CONS].sort(
    (a: { voters: number; name: string }, b: { voters: number; name: string }) =>
      b.voters - a.voters || a.name.localeCompare(b.name),
  );

  ROWS.forEach((row, i) => {
    const [rank, name, voters, share, wards, averageWard] = row.split("|").map((c) => c.trim());
    const c = ranked[i];
    assert.equal(Number(rank), i + 1);
    assert.equal(c.name, name);
    assert.equal(c.voters, num(voters));
    assert.equal(c.wards.length, num(wards));
    assert.equal(Number(((c.voters / total) * 100).toFixed(2)), num(share));
    assert.equal(Math.round(c.voters / c.wards.length), num(averageWard));
  });
});

/* ------------------------------------------------------------------ turnout and threshold (§3.4.1) */

test("the county casts about 330,310 ballots at the 62% baseline", () => {
  assert.equal(ballotsAt(countyTotal(CONS), 0.62), 330_310);
});

test("198,004 is 37.2% of the register and 60.0% of ballots cast", () => {
  const total = countyTotal(CONS);
  assert.equal(Number(((198_004 / total) * 100).toFixed(1)), 37.2);
  assert.equal(Number(((198_004 / ballotsAt(total, 0.62)) * 100).toFixed(1)), 59.9);
  // §3.4.1 prints the required share as a 60.0%–60.5% band against a 198,004–200,000 threshold.
  // The low end computes to 59.9%, which rounds into the band's stated floor at one decimal.
  assert.equal(Number(((200_000 / ballotsAt(total, 0.62)) * 100).toFixed(1)), 60.5);
});

test("register growth sums exactly: 532,758 + 61,839 + 11,106 = 605,703", () => {
  assert.equal(532_758 + 61_839 + 11_106, 605_703);
});

test("the like-for-like threshold on the 2026 register is about 225,000", () => {
  assert.equal(Math.round(605_703 * 0.372), 225_322);
});

/* ------------------------------------------------------------------ reach (§3.6) */

test("the three reach segments sum to the reported 2026 register", () => {
  const reach = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data", "analysis", "channel-reach.json"), "utf8")
  );

  // The export carries a "Total electorate" row beside the three segments. Selecting on the unit
  // alone picks it up and doubles the answer — which is precisely the failure this audit removed
  // from the table toolbar, where a zone table's own Total row was charted as a data point and a
  // county of 532,758 was reported as 832,002. The total is here to be CHECKED AGAINST, not added.
  const isTotal = (v: { label: string }) => /^total\b/i.test(v.label);
  const segments = reach.values.filter((v: { unit: string; label: string }) => v.unit === "voters" && !isTotal(v));
  const total = reach.values.find((v: { unit: string; label: string }) => v.unit === "voters" && isTotal(v));

  assert.equal(segments.length, 3, "three mutually exclusive segments");
  assert.equal(158_696 + 108_419 + 338_588, 605_703);

  const sum = segments.reduce((s: number, v: { value: number }) => s + v.value, 0);
  assert.equal(sum, 605_703, "the published segments must still sum to the register they split");
  assert.equal(total.value, sum, "and the stated total must be that sum, not a separate claim");

  // Every segment is modelled, and none may be drawn as a precise measurement.
  for (const v of segments) assert.equal(v.method, "modelled");
  // The total is not modelled — it is the register — and the figure must not blur the two.
  assert.equal(total.method, "official");
});

test("13.6% of the 2019 census population is 143,340 internet users", () => {
  assert.equal(Number(((143_340 / 1_053_991) * 100).toFixed(1)), 13.6);
});

/* ------------------------------------------------------------------ zones (§3.5) */

test("the three zone populations sum to 895,766 — 78.8% of 1,136,187", () => {
  assert.equal(223_970 + 255_795 + 416_001, 895_766);
  assert.equal(Number(((895_766 / 1_136_187) * 100).toFixed(1)), 78.8);
});

/* ------------------------------------------------------------------ the simulator (§2.2) */

test("the §2.2 simulator's 14 weeks run from the 7 August poll, not from today (C-2)", () => {
  const poll = new Date("2026-08-07");
  const windowCloses = new Date("2026-11-15");
  const week = 7 * 24 * 60 * 60 * 1000;

  // 14 weeks from the baseline poll lands at the window's close, which is why the projection
  // reaches 38.9% exactly there.
  const weeksAvailable = (windowCloses.getTime() - poll.getTime()) / week;
  assert.ok(weeksAvailable > 14 && weeksAvailable < 14.5, `poll to window close is ${weeksAvailable.toFixed(1)} weeks`);
  assert.equal(Number((22.1 + 1.2 * 14).toFixed(1)), 38.9);

  // CONFLICT C-2. Measured from the audit date, six of those weeks have already gone, and the
  // panel's headline outcome does not survive the remainder.
  const audited = new Date("2026-09-18");
  const weeksLeft = (windowCloses.getTime() - audited.getTime()) / week;
  assert.ok(weeksLeft > 8 && weeksLeft < 8.5, `today to window close is ${weeksLeft.toFixed(1)} weeks`);

  const reachable = 22.1 + 1.2 * weeksLeft;
  assert.equal(Number(reachable.toFixed(1)), 32.0);
  assert.ok(reachable < 37.4, "at the recommended pace the panel does not overtake Kasalu");
  assert.ok(reachable < 40.0, "…nor reach the 40% benchmark");

  // What the pace would have to be, from today.
  assert.equal(Number(((37.4 - 22.1) / weeksLeft).toFixed(2)), 1.85);
  assert.equal(Number(((40.0 - 22.1) / weeksLeft).toFixed(2)), 2.16);
});

test("Kasalu is not flat: she gained 6.1 points between the two published Mizani rounds (C-2)", () => {
  // The simulator holds her at 37.4% while Dr. Mulu climbs.
  assert.equal(Number((37.4 - 31.3).toFixed(1)), 6.1);
  assert.equal(Number((37.4 - 22.1).toFixed(1)), 15.3, "the deficit the document leads with");
  assert.equal(Number((31.3 - 20.2).toFixed(1)), 11.1, "the June deficit it widened from");
});

test("the poll margin of error is quoted at the favourable end of its stated range (C-10)", () => {
  // §3.1.3 says "N = 1,200 to 1,500 … ±2.53%". A 95% margin for a proportion at p=0.5.
  const moe = (n: number) => Number((1.96 * Math.sqrt(0.25 / n) * 100).toFixed(2));
  assert.equal(moe(1500), 2.53);
  assert.equal(moe(1200), 2.83);
});
