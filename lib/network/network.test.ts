/**
 * The Campaigner Network's verification: reference data, access, and function.
 *
 *     node --experimental-strip-types --test lib/network/network.test.ts
 *
 * Every person below is a test fixture that exists only in memory for the length of the run. Names
 * are visibly synthetic and the phone numbers sit in a block no real subscriber holds in these tests.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { ACT_SOURCE, CONSTITUENCIES, VILLAGES, WARDS, WARD_MATCHES, VILLAGE_BY_CODE, searchVillages } from "./reference.ts";
import { fieldStructureMinimum, spansOfControl, villageMinimum, wardAverages } from "./structure.ts";
import { memoryDb, type NetDb } from "./db.ts";
import { channelsFromEnv } from "./channels.ts";
import { networkService, publicCoverage, resolveActor, Invalid, type RegisterInput, type RoleInput } from "./service.ts";
import { NotAllowed, type Actor } from "./policy.ts";
import { prohibitedReason, toE164 } from "./conduct.ts";
import { SITE_OBJECTIVES } from "./objectives.ts";
import type { Person, Role } from "./types.ts";

/* ================================================================== reference data */

const SCHEDULE = fs
  .readFileSync(path.join(process.cwd(), "data", "network", "kitui-villages-act-2015.schedule.txt"), "utf8")
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("#"));

test("exactly 8 constituencies, 40 wards and 247 unique village codes running 1 to 247 without gaps", () => {
  assert.equal(CONSTITUENCIES.length, 8);
  assert.equal(WARDS.length, 40);
  assert.equal(new Set(WARDS.map((w) => w.ward_code)).size, 40);
  const codes = VILLAGES.map((v) => v.village_code);
  assert.equal(VILLAGES.length, 247);
  assert.equal(new Set(codes).size, 247);
  assert.deepEqual([...codes].sort((a, b) => a - b), Array.from({ length: 247 }, (_, i) => i + 1));
});

test("every village record carries the six required fields, with the Act as its source", () => {
  for (const v of VILLAGES) {
    for (const k of ["constituency", "ward_code", "ward", "village_code", "village_name", "source"] as const) assert.ok(v[k] !== undefined && v[k] !== "", `${v.village_code} ${k}`);
    assert.equal(v.source, ACT_SOURCE);
  }
  assert.match(ACT_SOURCE, /Kitui County Villages Act, 2015 \(No\. 1 of 2015\)/);
});

test("ward village counts match the line ranges in the schedule", () => {
  assert.equal(SCHEDULE.length, 40);
  for (const line of SCHEDULE) {
    const [, code, ward, range, names] = line.split("|");
    const [first, last] = range.split("-").map(Number);
    const w = WARDS.find((x) => x.ward_code === Number(code))!;
    assert.equal(w.ward, ward);
    assert.equal(w.village_count, last - first + 1, ward);
    assert.equal(VILLAGES.filter((v) => v.ward_code === w.ward_code).length, last - first + 1, ward);
    const listed = names.split(";").map((n) => n.trim());
    listed.forEach((n, i) => assert.equal(VILLAGE_BY_CODE.get(first + i)!.village_name, n, `village ${first + i}`));
  }
});

test("constituency ward counts", () => {
  const expected: Record<string, number> = { "Mwingi North": 5, "Mwingi West": 4, "Mwingi Central": 6, "Kitui West": 4, "Kitui Rural": 4, "Kitui Central": 5, "Kitui East": 6, "Kitui South": 6 };
  assert.deepEqual(Object.fromEntries(CONSTITUENCIES.map((c) => [c, WARDS.filter((w) => w.constituency === c).length])), expected);
});

test("the village minimum calculates to 494 and the default field structure to 590", () => {
  assert.equal(villageMinimum(), 494);
  assert.equal(fieldStructureMinimum(), 590);
});

test("repeated village names remain separate records, and search finds each", () => {
  for (const [name, codes] of [["Mutanda", [15, 105]], ["Mathyakani", [62, 74]], ["Ngiluni", [88, 123]], ["Kitoo", [206, 214]]] as const) {
    const recs = VILLAGES.filter((v) => v.village_name === name);
    assert.deepEqual(recs.map((r) => r.village_code), [...codes]);
    assert.notEqual(recs[0].ward_code, recs[1].ward_code);
    const found = searchVillages(name).map((v) => v.village_code);
    for (const c of codes) assert.ok(found.includes(c), `${name} ${c}`);
  }
});

test("bracketed sub-areas are searchable and the official name is kept exactly", () => {
  const kyanzai = VILLAGE_BY_CODE.get(185)!;
  assert.equal(kyanzai.village_name, "Kyanzai (Kamaembe, Kaliluni, Kwa-wewa, Itula-aka, Kenzini, Ka-kya)");
  assert.deepEqual(kyanzai.sub_areas, ["Kamaembe", "Kaliluni", "Kwa-wewa", "Itula-aka", "Kenzini", "Ka-kya"]);
  assert.ok(searchVillages("kwa wewa").some((v) => v.village_code === 185));
  assert.ok(searchVillages("Wikivuvwa").some((v) => v.village_code === 35));
});

test("an alias finds a village without changing its code or official name", () => {
  const hits = searchVillages("Kyusotown", [{ village_code: 6, alias: "Kyusotown" }]);
  assert.equal(hits[0].village_code, 6);
  assert.equal(hits[0].village_name, "Kyuso");
});

test("the 40 Act wards reconcile one-to-one with the site's 40 register wards, with every difference listed", () => {
  assert.equal(WARD_MATCHES.length, 40);
  assert.equal(new Set(WARD_MATCHES.map((m) => m.register_slug)).size, 40);
  for (const m of WARD_MATCHES) assert.equal(m.act_constituency, m.register_constituency, m.act_ward);
  const diffs = WARD_MATCHES.filter((m) => m.match !== "exact");
  assert.deepEqual(diffs.map((d) => d.act_ward_code), [333, 340, 360, 361, 366, 369]);
  for (const d of diffs) assert.ok(d.note, `${d.act_ward} needs a note`);
  // The register and the boundary file are untouched: the Act's Nzambani 360 is the boundary file's 361.
  assert.equal(WARD_MATCHES.find((m) => m.act_ward_code === 360)!.boundary_wardcode, 361);
});

test("ward average voters per village is labelled an estimate and spans come from the data", () => {
  const avg = wardAverages();
  assert.equal(avg.length, 40);
  for (const a of avg) assert.equal(a.label, "ward average, estimated");
  const township = avg.find((a) => a.ward_code === 355)!;
  assert.equal(township.average_per_village, Math.round(township.ward_voters_2022 / 5));
  const [cmd, cons, ward] = spansOfControl();
  assert.equal(cmd.max, 8);
  assert.deepEqual([cons.min, cons.max], [4, 6]);
  assert.deepEqual([ward.min, ward.max], [5, 9]);
});

test("tasks link to the five objectives already on the site", () => {
  assert.deepEqual(SITE_OBJECTIVES.map((o) => o.n), ["1", "2", "3", "4", "5"]);
});

/* ================================================================== fixtures */

const NO_CHANNELS = channelsFromEnv({});
const FIREFLY: Actor = { kind: "firefly", label: "Firefly", email: "owner@example.test" };

let seq = 0;
const phone = () => `+25470000${String(++seq).padStart(4, "0")}`;

function reg(name: string, role: RoleInput, extra: Partial<RegisterInput> = {}): RegisterInput {
  return {
    name, phone: phone(), consent_confirmed: true, consent_channel: "in_person",
    declaration_not_public_officer: true, serving_county_officer: false, public_funds_role: "none", role, ...extra,
  };
}

async function as(db: NetDb, personId: string): Promise<Actor> {
  const person = (await db.get<Person>("net_people", personId))!;
  return { kind: "person", person, roles: await db.list<Role>("net_roles", { person_id: personId }) };
}

/** Command, a Kitui Central coordinator, two ward coordinators, three village campaigners and the candidate. */
async function seed(channels = NO_CHANNELS) {
  const db = memoryDb();
  const svc = (a: Actor) => networkService({ db, channels }, a);
  const cmd = (await svc(FIREFLY).register(reg("Test Command One", { kind: "command_member" }))).person;
  const C = await as(db, cmd.id);
  const cand = (await svc(FIREFLY).register(reg("Test Candidate", { kind: "candidate" }))).person;
  const kc = (await svc(C).register(reg("Test Coordinator KC", { kind: "constituency_coordinator", constituency: "Kitui Central" }))).person;
  const w1 = (await svc(C).register(reg("Test Ward Township", { kind: "ward_coordinator", ward_code: 355 }))).person;
  const w2 = (await svc(C).register(reg("Test Ward Mulango", { kind: "ward_coordinator", ward_code: 357 }))).person;
  const W1 = await as(db, w1.id);
  const v1 = (await svc(W1).register(reg("Test Village Town A", { kind: "village_lead", village_code: 150 }))).person;
  const v2 = (await svc(W1).register(reg("Test Village Town B", { kind: "village_campaigner", village_code: 150 }))).person;
  const W2 = await as(db, w2.id);
  const v3 = (await svc(W2).register(reg("Test Village Kathungi", { kind: "village_lead", village_code: 161 }))).person;
  return { db, svc, ids: { cmd: cmd.id, cand: cand.id, kc: kc.id, w1: w1.id, w2: w2.id, v1: v1.id, v2: v2.id, v3: v3.id }, people: [cmd, cand, kc, w1, w2, v1, v2, v3] };
}

/* ================================================================== access */

test("an anonymous request gets no campaigner name, phone number or report from any service call", async () => {
  const { db, svc, ids, people } = await seed();
  const V1 = await as(db, ids.v1);
  await svc(V1).submitReport({ activity: "Test household visits", people_reached: 7, follow_up: false, issue_category: "Water" });
  const anon = svc({ kind: "anonymous" });
  for (const call of [() => anon.people(), () => anon.person(ids.v1), () => anon.reports(), () => anon.tasks(), () => anon.groups(), () => anon.coverage(), () => anon.digest(), () => anon.exportCsv("people"), () => anon.inbox(), () => anon.flags(), () => anon.auditLog()]) {
    await assert.rejects(call, NotAllowed);
  }
  // The open view: counts and states only.
  const open = JSON.stringify(await publicCoverage(db));
  for (const p of people) {
    assert.ok(!open.includes(p.name), "a name leaked into the public aggregate");
    assert.ok(!open.includes(p.phone!), "a phone number leaked into the public aggregate");
    assert.ok(!open.includes(p.id), "a person id leaked into the public aggregate");
  }
  assert.ok(!open.includes("Test household visits"));
  assert.equal(await resolveActor(db, { phone: "+254700009999" }).then((a) => a.kind), "anonymous");
});

test("a ward coordinator cannot read or edit another ward", async () => {
  const { db, svc, ids } = await seed();
  const W1 = svc(await as(db, ids.w1));
  await assert.rejects(() => W1.person(ids.v3), NotAllowed);
  assert.ok(!(await W1.people()).some((p) => p.person.id === ids.v3));
  assert.deepEqual((await W1.people()).map((p) => p.person.id).sort(), [ids.w1, ids.v1, ids.v2].sort());
  await assert.rejects(() => W1.correct(ids.v3, { name: "Changed" }), NotAllowed);
  await assert.rejects(() => W1.register(reg("Test Intruder", { kind: "village_campaigner", village_code: 161 })), NotAllowed);
  await assert.rejects(() => W1.setTarget("village", 161, 3), NotAllowed);
  await assert.rejects(() => W1.addAlias(161, "Kathungi Mpya"), NotAllowed);
  await assert.rejects(() => W1.withdraw(ids.v3), NotAllowed);
  // Their own ward is theirs.
  assert.equal((await W1.person(ids.v1)).person.id, ids.v1);
  await W1.setTarget("village", 150, 3);
});

test("a village campaigner reads only their own record", async () => {
  const { db, svc, ids } = await seed();
  const V1 = svc(await as(db, ids.v1));
  assert.deepEqual((await V1.people()).map((p) => p.person.id), [ids.v1]);
  await assert.rejects(() => V1.person(ids.v2), NotAllowed);
  await assert.rejects(() => V1.correct(ids.v2, { name: "Changed" }), NotAllowed);
  await assert.rejects(() => V1.register(reg("Test Recruit", { kind: "village_campaigner", village_code: 150 })), NotAllowed);
  // Correction of their own record is theirs.
  assert.equal((await V1.correct(ids.v1, { name: "Test Village Town A (corrected)" })).name, "Test Village Town A (corrected)");
});

test("non-Command users cannot export, and a Command export is logged", async () => {
  const { db, svc, ids } = await seed();
  for (const id of [ids.cand, ids.kc, ids.w1, ids.v1]) await assert.rejects(async () => svc(await as(db, id)).exportCsv("people"), NotAllowed);
  const C = svc(await as(db, ids.cmd));
  const out = await C.exportCsv("people");
  assert.equal(out.rows, 8);
  assert.ok((await C.auditLog()).some((a) => a.action === "export" && a.detail === "exported people: 8 rows"));
});

test("viewing a contact list, editing and role changes are audited, without personal data in the log", async () => {
  const { db, svc, ids, people } = await seed();
  await svc(await as(db, ids.w1)).people();
  const log = await svc(await as(db, ids.cmd)).auditLog();
  assert.ok(log.some((a) => a.action === "view_contacts"));
  assert.ok(log.some((a) => a.action === "role_change"));
  const text = JSON.stringify(log.map((a) => [a.detail, a.subject_id]));
  for (const p of people) assert.ok(!text.includes(p.phone!));
});

test("Dr. Makali sees the digest and county totals, not individual campaigners or reports", async () => {
  const { db, svc, ids, people } = await seed();
  await svc(await as(db, ids.v1)).submitReport({ activity: "Test visits", people_reached: 4, follow_up: true });
  const D = svc(await as(db, ids.cand));
  await assert.rejects(() => D.people(), NotAllowed);
  await assert.rejects(() => D.tasks(), NotAllowed);
  assert.deepEqual(await D.reports(), []);
  const digest = await D.digest();
  assert.equal(digest.reports_7d, 1);
  const json = JSON.stringify(digest);
  for (const p of people) assert.ok(!json.includes(p.name) && !json.includes(p.phone!) && !json.includes(p.id));
});

test("Firefly may appoint the first Command members and nothing else", async () => {
  const { svc } = await seed();
  const F = svc(FIREFLY);
  await assert.rejects(() => F.register(reg("Test Ward Seat", { kind: "ward_coordinator", ward_code: 340 })), NotAllowed);
  await assert.rejects(() => F.people(), NotAllowed);
});

/* ================================================================== function */

test("filling one and then two seats updates village, ward, constituency and county coverage", async () => {
  const db = memoryDb();
  const svc = (a: Actor) => networkService({ db, channels: NO_CHANNELS }, a);
  const cmd = (await svc(FIREFLY).register(reg("Test Command", { kind: "command_member" }))).person;
  const C = svc(await as(db, cmd.id));
  let cov = await C.coverage();
  assert.equal(cov.county.state, "Vacant");
  assert.equal(cov.county.required, 590);
  assert.equal(cov.county.filled, 0);

  await C.register(reg("Test Seat One", { kind: "village_lead", village_code: 150 }));
  cov = await C.coverage();
  const v = () => cov.villages.find((x) => x.village_code === 150)!;
  const w = () => cov.wards.find((x) => x.ward_code === 355)!;
  const c = () => cov.constituencies.find((x) => x.constituency === "Kitui Central")!;
  assert.deepEqual([v().state, v().filled, v().seats.map((s) => s.filled)], ["Partial", 1, [true, false]]);
  assert.deepEqual([w().state, w().filled, w().villages.Partial, w().villages.Vacant], ["Partial", 1, 1, 4]);
  assert.deepEqual([c().state, c().filled], ["Partial", 1]);
  assert.deepEqual([cov.county.state, cov.county.filled, cov.county.villages.Partial, cov.county.villages.Vacant], ["Partial", 1, 1, 246]);

  await C.register(reg("Test Seat Two", { kind: "village_campaigner", village_code: 150 }));
  cov = await C.coverage();
  assert.deepEqual([v().state, v().filled, v().seats.map((s) => s.filled)], ["Minimum met", 2, [true, true]]);
  assert.deepEqual([w().state, w().filled, w().filled_to_target, w().villages["Minimum met"]], ["Partial", 2, 2, 1]);
  assert.deepEqual([c().filled, cov.county.filled, cov.county.filled_to_target, cov.county.villages["Minimum met"]], [2, 2, 2, 1]);

  await C.register(reg("Test Seat Three", { kind: "village_campaigner", village_code: 150 }));
  cov = await C.coverage();
  assert.deepEqual([v().state, v().filled, v().filled_to_target], ["Above minimum", 3, 2]);

  // A raised target turns "above" back into "partial" until it is met.
  await C.setTarget("village", 150, 4);
  cov = await C.coverage();
  assert.deepEqual([v().state, v().target, v().seats.length], ["Partial", 4, 4]);
  await assert.rejects(() => C.setTarget("village", 150, 1), Invalid);

  // The open view agrees.
  const open = await publicCoverage(db);
  assert.equal(open.villages.find((x) => x.village_code === 150)!.filled, 3);
  assert.equal(open.status, "live");
});

test("a person with two roles counts once in unique people and shows both roles", async () => {
  const { db, svc, ids } = await seed();
  const C = svc(await as(db, ids.cmd));
  const before = await C.uniquePeople();
  await C.addRole(ids.v1, { kind: "group_ward_rep", group_type: "boda_boda", ward_code: 355 });
  assert.equal(await C.uniquePeople(), before);
  const view = await C.person(ids.v1);
  assert.deepEqual(view.roles.filter((r) => r.active).map((r) => r.kind).sort(), ["group_ward_rep", "village_lead"]);
  assert.equal(view.roles.filter((r) => r.is_primary).length, 1);
  // Registering the same number again adds the role to the same person.
  const again = await C.register({ ...reg("Test Village Town A", { kind: "group_unit_leader" }), phone: view.person.phone! }).catch((e) => e);
  assert.ok(again instanceof Invalid); // no such local unit: the seat is refused, and no second person is created
  assert.equal(await C.uniquePeople(), before);
  // The village counts them once.
  const cov = await C.coverage();
  assert.equal(cov.villages.find((v) => v.village_code === 150)!.filled, 2);
});

test("a task reaches the correct targeted people, and only them", async () => {
  const { db, svc, ids } = await seed();
  const C = svc(await as(db, ids.cmd));
  const t1 = await C.createTask({ title: "Test visits", instructions: "Visit households.", due: "2026-12-01", evidence: "Count of households.", objective: "1", target: { level: "village", ward_code: 355 } });
  assert.deepEqual(t1.assignments.map((a) => a.person_id).sort(), [ids.v1, ids.v2].sort());
  const t2 = await C.createTask({ title: "Test ward check-in", instructions: "Confirm your village leads.", due: "2026-12-02", evidence: "List confirmed.", objective: "2", target: { constituency: "Kitui Central", role: "ward_coordinator" } });
  assert.deepEqual(t2.assignments.map((a) => a.person_id).sort(), [ids.w1, ids.w2].sort());
  await C.addRole(ids.v3, { kind: "group_ward_rep", group_type: "boda_boda", ward_code: 357 });
  const t3 = await C.createTask({ title: "Test stage visit", instructions: "Meet riders at the stage.", due: "2026-12-01", evidence: "Riders met.", objective: "1", target: { group_type: "boda_boda" } });
  assert.equal(t3.task.chain, "group");
  assert.deepEqual(t3.assignments.map((a) => a.person_id), [ids.v3]);
  // The campaigner sees their own tasks; the ward coordinator follows them; the other ward does not.
  assert.deepEqual((await svc(await as(db, ids.v1)).myAssignments()).map((x) => x.task.id), [t1.task.id]);
  const w2tasks = await svc(await as(db, ids.w2)).tasks();
  assert.ok(!w2tasks.some((t) => t.task.id === t1.task.id));
  // The funnel moves as campaigners acknowledge and finish.
  const V1 = svc(await as(db, ids.v1));
  const mine = (await V1.myAssignments())[0].assignment;
  await V1.updateAssignment(mine.id, "Acknowledged");
  await V1.updateAssignment(mine.id, "Done");
  await assert.rejects(async () => (await as2(db, ids.v2)).updateAssignment(mine.id, "Blocked"), NotAllowed);
  const f = (await C.tasks()).find((t) => t.task.id === t1.task.id)!.funnel;
  assert.deepEqual(f.stages.map((s) => s.value), [2, 1, 1]);
  // A prohibited task is refused.
  await assert.rejects(() => C.createTask({ title: "Test", instructions: "Collect voter cards from households.", due: "2026-12-01", evidence: "Cards.", objective: "3", target: {} }), Invalid);
  await assert.rejects(() => C.createTask({ title: "Test", instructions: "Hand out flour to voters after the rally.", due: "2026-12-01", evidence: "x", objective: "3", target: {} }), Invalid);
  // Only Command issues tasks.
  await assert.rejects(async () => svc(await as(db, ids.kc)).createTask({ title: "x", instructions: "y", due: "2026-12-01", evidence: "z", objective: "1", target: {} }), NotAllowed);
  // A geographic and a group task due the same day for one person is a clash Command sees.
  await C.addRole(ids.v1, { kind: "group_ward_rep", group_type: "women_chama", ward_code: 355 });
  await C.createTask({ title: "Test chama", instructions: "Meet the chama.", due: "2026-12-02", evidence: "Met.", objective: "1", target: { group_type: "women_chama" } });
  await C.createTask({ title: "Test village", instructions: "Village walk.", due: "2026-12-02", evidence: "Done.", objective: "1", target: { village_code: 150 } });
  assert.equal((await C.clashes()).filter((x) => x.person_id === ids.v1).length, 1);
});

const as2 = async (db: NetDb, id: string) => networkService({ db, channels: NO_CHANNELS }, await as(db, id));

test("reports roll up from the ward to the constituency, Command and the digest", async () => {
  const { db, svc, ids } = await seed();
  await svc(await as(db, ids.v1)).submitReport({ activity: "Test visits", people_reached: 10, issue_category: "Water", follow_up: true });
  await svc(await as(db, ids.v2)).submitReport({ activity: "Test visits", people_reached: 6, issue_category: "Water", follow_up: false });
  await svc(await as(db, ids.v3)).submitReport({ activity: "Test visits", people_reached: 5, issue_category: "Roads", follow_up: false });
  const w1 = await svc(await as(db, ids.w1)).rollup();
  assert.deepEqual(w1.wards.map((w) => [w.key, w.reports, w.people_reached, w.follow_ups]), [["355", 2, 16, 1]]);
  const kc = await svc(await as(db, ids.kc)).rollup();
  assert.deepEqual(kc.constituencies.map((c) => [c.key, c.reports, c.people_reached]), [["Kitui Central", 3, 21]]);
  assert.equal(kc.wards.length, 2);
  const cmd = await svc(await as(db, ids.cmd)).rollup();
  assert.equal(cmd.county.people_reached, 21);
  assert.deepEqual(cmd.county.issues, { Water: 2, Roads: 1 });
  const d = await svc(await as(db, ids.cand)).digest();
  assert.deepEqual([d.reports_7d, d.people_reached_7d, d.top_issues_7d[0]], [3, 21, { issue: "Water", count: 2 }]);
  assert.equal(d.constituencies.find((c) => c.constituency === "Kitui Central")!.reports_7d, 3);
  // The village campaigner sees their own report and no other.
  assert.equal((await svc(await as(db, ids.v1)).reports()).length, 1);
  // A report describing prohibited activity is refused and pointed at the misconduct path.
  await assert.rejects(async () => svc(await as(db, ids.v1)).submitReport({ activity: "I gave money to voters", people_reached: 1, follow_up: false }), /Report misconduct/);
});


test("urgent flags skip to Command with an owner and a state; replies to his broadcasts go to the ward coordinator", async () => {
  const { db, svc, ids } = await seed();
  const V1 = svc(await as(db, ids.v1));
  const flag = await V1.raiseFlag({ kind: "unresponsive", details: "Test: ward coordinator has not answered for a week." });
  assert.equal(flag.ward_code, 355);
  assert.deepEqual((await svc(await as(db, ids.w1)).flags()).map((f) => f.id), []);
  const C = svc(await as(db, ids.cmd));
  assert.deepEqual((await C.flags()).map((f) => f.id), [flag.id]);
  await assert.rejects(() => C.updateFlag(flag.id, { state: "closed", resolution: "Spoke to them." }), Invalid);
  await assert.rejects(() => C.updateFlag(flag.id, { owner_person_id: ids.w1 }), Invalid);
  const closed = await C.updateFlag(flag.id, { owner_person_id: ids.cmd, state: "closed", resolution: "Spoke to them." });
  assert.equal(closed.state, "closed");

  const b = await C.broadcast({ body: "Test message from Dr. Makali.", voice: "candidate" });
  assert.equal(b.recipients, 6);
  const msg = (await V1.inbox()).find((m) => m.id === b.message.id)!;
  const reply = await V1.reply(msg.id, "Test reply.");
  assert.equal(reply.to_person_id, ids.w1);
  assert.notEqual(reply.to_person_id, ids.cand);
  assert.ok((await svc(await as(db, ids.w1)).inbox()).some((m) => m.id === reply.id));
  assert.ok(!(await svc(await as(db, ids.cand)).inbox()).some((m) => m.id === reply.id));
});

test("a failed WhatsApp or USSD send is recorded as failed, never as sent", async () => {
  const refuse: typeof fetch = async () => new Response("{}", { status: 500 });
  const unreachable: typeof fetch = async () => { throw new Error("offline"); };
  const env = { WHATSAPP_ACCESS_TOKEN: "test", WHATSAPP_PHONE_NUMBER_ID: "1", WHATSAPP_TEMPLATE: "task", USSD_PUSH_URL: "https://ussd.invalid/push", USSD_PUSH_KEY: "test" };
  for (const fetcher of [refuse, unreachable]) {
    const { db, svc, ids } = await seed(channelsFromEnv(env, fetcher));
    const C = svc(await as(db, ids.cmd));
    const t = await C.createTask({ title: "Test", instructions: "Visit households.", due: "2026-12-01", evidence: "Count.", objective: "1", target: { village_code: 150 } });
    const external = t.deliveries.filter((d) => d.channel !== "app");
    assert.equal(external.length, 4);
    assert.ok(external.every((d) => d.status === "failed" && d.error));
    assert.deepEqual([...new Set(external.map((d) => d.channel))].sort(), ["ussd", "whatsapp"]);
    const listed = (await C.tasks()).find((x) => x.task.id === t.task.id)!;
    assert.equal(listed.deliveries.sent, 0);
    assert.equal(listed.deliveries.failed.length, 4);
  }
  // A provider that accepts records "sent" with its id, and nothing more.
  const accept: typeof fetch = async () => new Response(JSON.stringify({ messages: [{ id: "wamid.test" }] }), { status: 200 });
  const { db, svc, ids } = await seed(channelsFromEnv({ WHATSAPP_ACCESS_TOKEN: "t", WHATSAPP_PHONE_NUMBER_ID: "1", WHATSAPP_TEMPLATE: "task" }, accept));
  const t = await svc(await as(db, ids.cmd)).createTask({ title: "Test", instructions: "Visit.", due: "2026-12-01", evidence: "Count.", objective: "1", target: { village_code: 161 } });
  assert.deepEqual(t.deliveries.filter((d) => d.channel === "whatsapp").map((d) => [d.status, d.provider_id]), [["sent", "wamid.test"]]);
  // Not connected: nothing is attempted, and the adapter says so if asked.
  const off = channelsFromEnv({});
  assert.equal(off.whatsapp.configured, false);
  assert.equal((await off.whatsapp.send("+254700000000", "x")).status, "failed");
});

test("eligibility: a serving county officer is refused and nothing is stored; public-funds roles wait for Command", async () => {
  const { db, svc, ids } = await seed();
  const C = svc(await as(db, ids.cmd));
  const before = (await db.list("net_people")).length;
  await assert.rejects(() => C.register(reg("Test Officer", { kind: "village_campaigner", village_code: 151 }, { serving_county_officer: true })), Invalid);
  await assert.rejects(() => C.register(reg("Test Undeclared", { kind: "village_campaigner", village_code: 151 }, { declaration_not_public_officer: false })), Invalid);
  assert.equal((await db.list("net_people")).length, before);
  const t = await C.register(reg("Test Teacher", { kind: "village_campaigner", village_code: 151 }, { public_funds_role: "teacher" }));
  assert.equal(t.person.eligibility, "review");
  assert.equal(t.roles[0].active, false);
  assert.equal((await C.coverage()).villages.find((v) => v.village_code === 151)!.filled, 0);
  assert.equal((await C.digest()).pending_review, 1);
  await C.decideEligibility(t.person.id, "cleared");
  assert.equal((await C.coverage()).villages.find((v) => v.village_code === 151)!.filled, 1);
});

test("consent is required, recorded with who, when, purpose and channel; withdrawal and deletion erase the person", async () => {
  const { db, svc, ids } = await seed();
  const C = svc(await as(db, ids.cmd));
  await assert.rejects(() => C.register(reg("Test No Consent", { kind: "village_campaigner", village_code: 152 }, { consent_confirmed: false })), Invalid);
  const p = (await C.register(reg("Test Consented", { kind: "village_campaigner", village_code: 152 }, { consent_channel: "phone_call" }))).person;
  assert.equal(p.consent.collected_by, "Test Command One");
  assert.equal(p.consent.channel, "phone_call");
  assert.ok(p.consent.purpose.length > 20 && p.consent.collected_at);
  assert.equal(p.retention_until, "2027-11-08");
  const P = svc(await as(db, p.id));
  await P.withdraw(p.id);
  const after = (await db.get<Person>("net_people", p.id))!;
  assert.deepEqual([after.name, after.phone, after.status], ["Withdrawn", null, "withdrawn"]);
  assert.equal((await C.coverage()).villages.find((v) => v.village_code === 152)!.filled, 0);
  await C.remove(p.id);
  assert.equal(await db.get("net_people", p.id), null);
  // Retention: a purge after the date deletes everyone past it.
  const later = networkService({ db, channels: NO_CHANNELS, now: () => new Date("2027-11-09T00:00:00Z") }, await as(db, ids.cmd));
  assert.equal(await later.purgeExpired(), 8);
});

test("groups: every local unit links to a ward, leader contacts need consent, endorsements need writing", async () => {
  const { db, svc, ids } = await seed();
  const C = svc(await as(db, ids.cmd));
  await assert.rejects(() => C.saveGroup({ type: "boda_boda", name: "Test Stage", level: "unit" }), Invalid);
  await assert.rejects(() => C.saveGroup({ type: "boda_boda", name: "Test Stage", level: "unit", ward_code: 355, leader_name: "Test Leader", leader_phone: "0700000999" }), Invalid);
  await assert.rejects(() => C.saveGroup({ type: "clergy_faith", name: "Test Congregation", level: "unit", ward_code: 355, endorsement_confirmed_in_writing: true }), Invalid);
  const g = await C.saveGroup({ type: "boda_boda", name: "Test Stage", level: "unit", ward_code: 355, leader_name: "Test Leader", leader_phone: "0700000999", consent_status: "given" });
  assert.equal(g.constituency, "Kitui Central");
  // The ward coordinator sees the group operating in their ward, without the leader's contact.
  const seen = await svc(await as(db, ids.w1)).groups();
  assert.deepEqual(seen.map((x) => [x.name, x.access, x.leader_phone]), [["Test Stage", "summary", null]]);
  assert.deepEqual(await svc(await as(db, ids.w2)).groups(), []);
  // Counts reach the open matrix; the name does not.
  const open = await publicCoverage(db);
  assert.equal(open.groups!.boda_boda["Kitui Central"], 1);
  assert.ok(!JSON.stringify(open).includes("Test Stage"));
});

test("conduct helpers", () => {
  assert.equal(toE164("0700 001 234"), "+254700001234");
  assert.equal(toE164("12345"), null);
  assert.equal(prohibitedReason("Visit households and listen."), null);
  assert.equal(prohibitedReason("Ask people how they will vote"), "recording how a person intends to vote");
  assert.equal(prohibitedReason("Speak to the congregation during the service"), "partisan activity during worship");
});

test("USSD: a campaigner on a feature phone acknowledges a task and sends a numeric report", async () => {
  const { ussdReply } = await import("./ussd.ts");
  const { db, svc, ids } = await seed();
  await svc(await as(db, ids.cmd)).createTask({ title: "Test visits", instructions: "Visit households.", due: "2026-12-01", evidence: "Count.", objective: "1", target: { village_code: 161 } });
  const V3 = svc(await as(db, ids.v3));
  assert.match(await ussdReply(V3, ""), /^CON [\s\S]*1\. My tasks/);
  assert.match(await ussdReply(V3, "1"), /^CON Your tasks:\n1\. Test visits/);
  assert.match(await ussdReply(V3, "1*1*1"), /^END Marked acknowledged/);
  assert.equal((await V3.myAssignments())[0].assignment.state, "Acknowledged");
  assert.equal((await V3.myAssignments())[0].assignment.via, "ussd");
  assert.match(await ussdReply(V3, "2*12*1*1"), /^END Sent to your ward coordinator/);
  const w2 = await svc(await as(db, ids.w2)).reports();
  assert.deepEqual(w2.map((r) => [r.people_reached, r.issue_category, r.follow_up, r.channel, r.ward_code]), [[12, "Water", true, "ussd", 357]]);
  for (const screen of ["", "1", "1*1", "2", "2*12", "2*12*1"]) assert.ok((await ussdReply(V3, screen)).length <= 182, `screen "${screen}" is too long for USSD`);
  // An unregistered number gets nothing.
  assert.match(await ussdReply(svc({ kind: "anonymous" }), ""), /^END This number is not registered/);
});
