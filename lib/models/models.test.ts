/**
 * Outcome tests for the models: known inputs, known outcomes, against the same data the site reads.
 *
 *     node --experimental-strip-types --test lib/models/models.test.ts
 *     npm run test:models
 *
 * A model is arithmetic on stated assumptions, so every outcome here is checkable by hand. If one
 * fails, the model changed what it computes; fix the model, not the expected value, unless the
 * method itself was meant to change.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { val } from "../data/read.ts";
import { neutralShare, scenarioTotals, startingScenario } from "./winning-number.ts";
import { agentInputsReady, agentPlan, agentTotals } from "./polling-agents.ts";
import { rankWards, leadingCriterion } from "./ward-priority.ts";
import { buildPriorityWards, POOL_CONSTITUENCIES } from "./join.ts";
import { checkSend, LANGUAGE_OPTIONS, RAIL_OPTIONS, SMS_LIMIT } from "./send-check.ts";
import { addDays, planRollout, validDay, weeksBetween } from "./rollout.ts";
import { LIVE_MODELS, MODELS } from "./catalogue.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const json = (p: string) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const pack = json("data/kitui-public.generated.json");
const WARDS = buildPriorityWards(pack.wards, json("data/ward-register.json"), json("data/analysis/projects-by-ward.json").values);
const CONS = pack.constituencies as { code: string; voters: number }[];

/* ------------------------------------------------------------ winning number */
test("winning number: the starting scenario reaches the benchmark, and one tenth of a point less does not", () => {
  const benchmark = val("benchmark");
  const turnout = val("turnout.constant");
  const start = startingScenario(CONS, benchmark, turnout);
  assert.ok(scenarioTotals(CONS, start).votes >= benchmark);
  const share = neutralShare(CONS, benchmark, turnout);
  const lower = Object.fromEntries(CONS.map((c) => [c.code, { turnout, share: share - 0.1 }]));
  assert.ok(scenarioTotals(CONS, lower).votes < benchmark);
});

test("winning number: votes are register × turnout × share", () => {
  const rows = [{ code: "a", voters: 10_000 }, { code: "b", voters: 20_000 }];
  const t = scenarioTotals(rows, { a: { turnout: 50, share: 40 }, b: { turnout: 60, share: 50 } });
  assert.equal(t.ballots, 5_000 + 12_000);
  assert.equal(t.votes, 2_000 + 6_000);
});

/* ------------------------------------------------------------ polling agents */
test("polling agents: totals add up across the county's stations", () => {
  const plan = agentPlan(pack.wards as { code: string; stations: number }[], { perStation: 2, reservePct: 10, perSupervisor: 10 });
  const sum = agentTotals(plan);
  const stations = (pack.wards as { stations: number }[]).reduce((a, w) => a + w.stations, 0);
  assert.equal(sum.stations, stations);
  assert.equal(sum.base, stations * 2);
  assert.equal(sum.total, sum.base + sum.reserves + sum.supervisors);
  // Reserves and supervisors round up per ward, so they are at least the county-level figure.
  assert.ok(sum.reserves >= Math.ceil(stations * 2 * 0.1));
  assert.ok(sum.supervisors >= Math.ceil(stations / 10));
});

test("polling agents: one ward, by hand", () => {
  const [line] = agentPlan([{ code: "x", stations: 33 }], { perStation: 2, reservePct: 10, perSupervisor: 10 });
  assert.deepEqual({ base: line.base, reserves: line.reserves, supervisors: line.supervisors, total: line.total }, { base: 66, reserves: 7, supervisors: 4, total: 77 });
  assert.equal(agentInputsReady({ perStation: 0, reservePct: 0, perSupervisor: 0 }), false);
});

/* ------------------------------------------------------------ ward priority */
test("ward priority: the join covers all 40 wards and agrees with the registry's pool", () => {
  assert.equal(WARDS.length, 40);
  const pool = WARDS.filter((w) => w.pool === 1).reduce((a, w) => a + w.voters, 0);
  assert.equal(pool, val("pool"));
  assert.equal(new Set(WARDS.map((w) => w.constituencyId).filter((c) => POOL_CONSTITUENCIES.includes(c))).size, POOL_CONSTITUENCIES.length);
  const projects = json("data/analysis/projects-by-ward.json").values.filter((v: { dims: { ward?: string; measure?: string } }) => v.dims.ward && v.dims.measure === "projects").reduce((a: number, v: { value: number }) => a + v.value, 0);
  assert.equal(WARDS.reduce((a, w) => a + w.projects, 0), projects);
});

test("ward priority: register size alone ranks the largest register first", () => {
  const ranked = rankWards(WARDS, { voters: 100, pool: 0, stations: 0, projects: 0 });
  const largest = [...WARDS].sort((a, b) => b.voters - a.voters)[0];
  assert.equal(ranked[0].ward.code, largest.code);
  assert.equal(ranked[0].score, 100);
  assert.equal(leadingCriterion(ranked[0]), "voters");
  for (const r of ranked) assert.ok(r.score >= 0 && r.score <= 100);
});

test("ward priority: the pool weight alone puts every pool ward above every other", () => {
  const ranked = rankWards(WARDS, { voters: 0, pool: 50, stations: 0, projects: 0 });
  const n = WARDS.filter((w) => w.pool === 1).length;
  assert.ok(ranked.slice(0, n).every((r) => r.ward.pool === 1));
  assert.ok(ranked.slice(n).every((r) => r.ward.pool === 0));
});

test("ward priority: no weights gives every ward 0 and keeps register order", () => {
  const ranked = rankWards(WARDS, { voters: 0, pool: 0, stations: 0, projects: 0 });
  assert.ok(ranked.every((r) => r.score === 0));
  assert.deepEqual(ranked.map((r) => r.ward.code), WARDS.map((w) => w.code));
  assert.equal(leadingCriterion(ranked[0]), null);
});

/* ------------------------------------------------------------ send check */
const okSms = { rail: "SMS", language: "Kiswahili", date: "2027-03-10", sendTime: "10:00", lodgedOn: "2027-03-07", message: "Habari" };

test("send check: reads the dispatch log's options and limit", () => {
  assert.ok(RAIL_OPTIONS.includes("SMS") && RAIL_OPTIONS.includes("WhatsApp"));
  assert.ok(LANGUAGE_OPTIONS.includes("Kikamba"));
  assert.equal(SMS_LIMIT, 160);
});

test("send check: a compliant SMS is allowed", () => {
  const r = checkSend(okSms);
  assert.equal(r.allowed, true);
  assert.equal(r.ruled, true);
});

test("send check: each SMS rule refuses on its own", () => {
  assert.equal(checkSend({ ...okSms, language: "Kikamba" }).allowed, false);
  assert.equal(checkSend({ ...okSms, sendTime: "07:59" }).allowed, false);
  assert.equal(checkSend({ ...okSms, sendTime: "17:01" }).allowed, false);
  assert.equal(checkSend({ ...okSms, message: "x".repeat(161) }).allowed, false);
  assert.equal(checkSend({ ...okSms, message: "x".repeat(160) }).allowed, true);
  assert.equal(checkSend({ ...okSms, lodgedOn: "2027-03-09" }).allowed, false);
  assert.equal(checkSend({ ...okSms, lodgedOn: "2027-03-08" }).allowed, true);
  assert.equal(checkSend({ ...okSms, lodgedOn: "" }).allowed, false);
});

test("send check: on a rail the log sets no rule for, nothing is refused and the result says so", () => {
  const r = checkSend({ ...okSms, rail: "WhatsApp", language: "Kikamba", sendTime: "22:00", lodgedOn: "" });
  assert.equal(r.allowed, true);
  assert.equal(r.ruled, false);
});

/* ------------------------------------------------------------ rollout */
const base = { start: "2026-12-07", discoveryWeeks: 4, readinessWeeks: 6, pilotWeeks: 6, pilotConstituencies: 2, perWave: 3, weeksPerWave: 3, readinessBeforePollWeeks: 4, deadline: "2027-06-03" };

test("rollout: phases follow each other day after day, by hand", () => {
  const p = planRollout(base, 8, "2027-08-10");
  const [d, r, pi, ro, op, ed] = p.phases;
  assert.deepEqual([d.start, d.end], ["2026-12-07", "2027-01-03"]);
  assert.deepEqual([r.start, r.end], ["2027-01-04", "2027-02-14"]);
  assert.deepEqual([pi.start, pi.end], ["2027-02-15", "2027-03-28"]);
  assert.equal(p.waves.length, 2);
  assert.deepEqual(p.waves.map((w) => w.constituencies), [3, 3]);
  assert.deepEqual([ro.start, ro.end], ["2027-03-29", "2027-05-09"]);
  assert.deepEqual([ed.start, ed.end], ["2027-07-13", "2027-08-10"]);
  assert.equal(op.start, "2027-05-10");
  assert.equal(op.end, "2027-07-12");
  assert.equal(p.slackToDeadline, weeksBetween("2027-05-10", "2027-06-03"));
  assert.deepEqual(p.warnings, []);
});

test("rollout: an overrun is reported, not hidden", () => {
  const p = planRollout({ ...base, readinessWeeks: 20, pilotWeeks: 10, perWave: 1, weeksPerWave: 4 }, 8, "2027-08-10");
  assert.ok(p.slackToDeadline < 0);
  assert.ok(p.optimisationWeeks < 0);
  assert.ok(p.warnings.length >= 2);
  assert.equal(p.phases[4].weeks, 0);
});

test("rollout: date helpers", () => {
  assert.equal(addDays("2027-02-28", 1), "2027-03-01");
  assert.equal(validDay("2027-02-29"), false);
  assert.equal(validDay("2028-02-29"), true);
});

/* ------------------------------------------------------------ catalogue */
test("catalogue: nine models, five live, each live model has a page", () => {
  assert.equal(MODELS.length, 9);
  assert.equal(LIVE_MODELS.length, 5);
  for (const m of LIVE_MODELS) assert.ok(fs.existsSync(path.join(ROOT, "app", "(platform)", "models", m.slug, "page.tsx")), `no page for ${m.slug}`);
});
