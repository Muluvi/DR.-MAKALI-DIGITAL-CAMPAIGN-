/**
 * The instruction parsers: plain words in, the right options out, and nothing guessed.
 *
 *     node --experimental-strip-types --test lib/models/instruct/instruct.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { clauses, datesIn, numberFor, timeIn } from "./text.ts";
import { parseAgents, parseBrief, parseIncident, parsePriority, parseReach, parseRecord, parseRollout, parseSend, parseWinning } from "./parse.ts";
import { explainWinning } from "./explain.ts";
import { startingScenario } from "../winning-number.ts";
import { buildPriorityWards } from "../join.ts";
import { SEVERITY_TIERS } from "../../../data/escalation.ts";
import { classify } from "../response-tier.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const json = (p: string) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const pack = json("data/kitui-public.generated.json");
const CONS = pack.constituencies as { code: string; name: string; voters: number }[];
const WARDS = buildPriorityWards(pack.wards, json("data/ward-register.json"), json("data/analysis/projects-by-ward.json").values);
const TODAY = "2026-11-12";

test("text: numbers, dates and times are read as people write them", () => {
  assert.equal(numberFor("turnout of 65%", "turnout"), 65);
  assert.equal(numberFor("65 per cent turnout".replace(" per cent", "%"), "turnout"), 65);
  assert.deepEqual(datesIn("on 20 march", TODAY), ["2027-03-20"]);
  assert.deepEqual(datesIn("2027-03-20 and 18/3/2027", TODAY), ["2027-03-20", "2027-03-18"]);
  assert.deepEqual(datesIn("tomorrow", TODAY), ["2026-11-13"]);
  assert.equal(timeIn("at 6pm"), "18:00");
  assert.equal(timeIn("at 9:30 am"), "09:30");
  assert.equal(timeIn("18:45"), "18:45");
  assert.equal(clauses("SMS 40%, radio 20%; 3,000 views").length, 3);
});

test("winning number: a turnout for one constituency and a share for all", () => {
  const start = startingScenario(CONS, 200_000, 60);
  const r = parseWinning("turnout 70% in Mwingi North; share 55%", { a: start, b: start, active: "A" }, CONS);
  const mn = CONS.find((c) => c.name === "Mwingi North")!;
  const kc = CONS.find((c) => c.name === "Kitui Central")!;
  assert.equal(r.next.a[mn.code].turnout, 70);
  assert.equal(r.next.a[kc.code].turnout, 60);
  assert.ok(CONS.every((c) => r.next.a[c.code].share === 55));
  assert.equal(r.unclear.length, 0);
  const b = parseWinning("scenario b: turnout 50", { a: start, b: start, active: "A" }, CONS);
  assert.equal(b.next.active, "B");
  assert.ok(CONS.every((c) => b.next.b[c.code].turnout === 50 && b.next.a[c.code].turnout === 60));
  assert.ok(explainWinning(CONS, r.next.a, 200_000)[0].includes("votes"));
  const both = parseWinning("share 60% in Kitui Central; share 45%", { a: start, b: start, active: "A" }, CONS);
  assert.equal(both.next.a[kc.code].share, 60);
  assert.equal(both.next.a[mn.code].share, 45);
});

test("polling agents: per station, reserve and supervisors", () => {
  const r = parseAgents("2 agents per station, 10% reserve, one supervisor per 8 stations", { perStation: 0, reservePct: 0, perSupervisor: 0 });
  assert.equal(r.next.perStation, 2);
  assert.equal(r.next.reservePct, 10);
  assert.equal(r.next.perSupervisor, 8);
});

test("ward priority: named criteria count, the rest stop; 'only' and numbers too", () => {
  const even = { voters: 25, pool: 25, stations: 25, projects: 25 };
  assert.deepEqual(parsePriority("focus on register size and where he has not held office", even).next, { voters: 50, pool: 50, stations: 0, projects: 0 });
  assert.deepEqual(parsePriority("only stations", even).next, { voters: 0, pool: 0, stations: 50, projects: 0 });
  assert.deepEqual(parsePriority("voters 60, projects 40", even).next, { voters: 60, pool: 25, stations: 25, projects: 40 });
  assert.deepEqual(parsePriority("even weights", { voters: 0, pool: 0, stations: 100, projects: 0 }).next, even);
});

test("send check: rail, language, time, dates and the message", () => {
  const cur = { rail: "SMS", language: "Kiswahili", date: "", sendTime: "", lodgedOn: "", message: "" };
  const r = parseSend('SMS in Kikamba at 6pm on 20 March, lodged on 19 March, message: "Tukutane sokoni"', cur, ["SMS", "USSD", "WhatsApp", "Voice"], ["Kikamba", "Kiswahili", "English"], TODAY);
  assert.deepEqual({ rail: r.next.rail, language: r.next.language, time: r.next.sendTime, date: r.next.date, lodged: r.next.lodgedOn, message: r.next.message }, { rail: "SMS", language: "Kikamba", time: "18:00", date: "2027-03-20", lodged: "2027-03-19", message: "Tukutane sokoni" });
});

test("rollout: lengths, waves and a deadline named in words", () => {
  const anchors = [{ date: "2027-06-03", event: "County Governor nomination opens; Governor campaign period starts" }, { date: "2027-07-27", event: "Submit County and Constituency Chief Election Agents" }];
  const cur = { start: "2026-12-07", discoveryWeeks: 4, readinessWeeks: 6, pilotWeeks: 6, pilotConstituencies: 2, perWave: 3, weeksPerWave: 3, readinessBeforePollWeeks: 4, deadline: "2027-06-03" };
  const r = parseRollout("start 1 February; pilot 8 weeks; waves of 2; 4 weeks per wave; finish before the chief agents are submitted", cur, anchors, TODAY);
  assert.equal(r.next.start, "2027-02-01");
  assert.equal(r.next.pilotWeeks, 8);
  assert.equal(r.next.perWave, 2);
  assert.equal(r.next.weeksPerWave, 4);
  assert.equal(r.next.deadline, "2027-07-27");
});

test("reach: 'no radio', a reach figure, and 'only'", () => {
  const on = { on: true, reach: 25 };
  const mix = { social: on, sms: on, radio: on, ground: on };
  const r = parseReach("no radio, SMS 40%", mix);
  assert.equal(r.next.radio.on, false);
  assert.deepEqual(r.next.sms, { on: true, reach: 40 });
  const o = parseReach("only social media at 60%", mix);
  assert.deepEqual([o.next.social.on, o.next.sms.on, o.next.radio.on, o.next.ground.on], [true, false, false, false]);
  assert.equal(o.next.social.reach, 60);
});

test("brief mix: shares, languages and channels", () => {
  const types = [{ code: "P1" as const, short: "Where the money went" }, { code: "P2" as const, short: "One household" }, { code: "P3" as const, short: "The economist explains" }, { code: "P4" as const, short: "He came, and said" }];
  const cur = { shares: { P1: 25, P2: 25, P3: 25, P4: 25 }, languages: ["Kikamba", "Kiswahili", "English"], channels: ["SMS", "Facebook", "TikTok"], minShare: 10 };
  const r = parseBrief("P1 60%, P3 40%; no Kikamba; no TikTok", cur, types, ["Kikamba", "Kiswahili", "English"], ["SMS", "Facebook", "TikTok"]);
  assert.deepEqual(r.next.shares, { P1: 60, P2: 0, P3: 40, P4: 0 });
  assert.deepEqual(r.next.languages, ["Kiswahili", "English"]);
  assert.deepEqual(r.next.channels, ["SMS", "Facebook"]);
});

test("response tier: an incident described in words lands in the right tier", () => {
  const cur = { kind: "comment" as const, spread: "ward" as const, views: 10, wardGroups: 0, fringe: false };
  const lines = [{ question: "2. The northern and southern recognition deficit question", attack: "He is a Kitui Central leader who does not understand the challenges of Mwingi North" }];
  const r = parseIncident("A doctored video on WhatsApp says he does not understand Mwingi North, 3,000 views, county-wide", cur, lines);
  assert.equal(r.next.kind, "media");
  assert.equal(r.next.views, 3000);
  assert.equal(r.next.spread, "county");
  assert.equal(r.next.line, 0);
  assert.equal(classify(SEVERITY_TIERS, r.next).tier.name, "Critical");
  const radio = parseIncident("mentioned on Musyi FM this morning", cur, lines);
  assert.equal(classify(SEVERITY_TIERS, radio.next).tier.name, "High");
});

test("record finder: ward, sector and status from a sentence", () => {
  const wards = WARDS.map((w) => ({ slug: w.slug, name: w.name, constituency: w.constituency }));
  const r = parseRecord("completed water projects in Kyuso", { ward: wards[0].slug, constituency: wards[0].constituency, sector: "all", status: "all", includeConstituency: false }, wards, ["Water", "Health", "Roads"]);
  assert.equal(r.next.ward, "kyuso");
  assert.equal(r.next.sector, "Water");
  assert.equal(r.next.status, "complete");
});

test("anything not understood is reported, not guessed", () => {
  const r = parseAgents("make it nicer", { perStation: 1, reservePct: 0, perSupervisor: 0 });
  assert.deepEqual(r.next, { perStation: 1, reservePct: 0, perSupervisor: 0 });
  assert.equal(r.unclear.length, 1);
});
