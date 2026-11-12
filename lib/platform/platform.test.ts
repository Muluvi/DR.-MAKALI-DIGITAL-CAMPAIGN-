/**
 * The personal-data check the workspace forms run on free text (lib/platform/personal-data.ts), and
 * the rate limiter on the server actions (lib/platform/rate-limit.ts).
 *
 *     node --experimental-strip-types --test lib/platform/platform.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { findPersonalData } from "./personal-data.ts";
import { validateRecord } from "./validate.ts";
import { COLLECTIONS } from "./collections.ts";
import { RateLimiter } from "./rate-limit.ts";

test("phone numbers are found however they are written", () => {
  for (const t of ["call 0712345678 tomorrow", "+254712345678", "254 712 345 678", "0712-345-678", "landline 020 2345678"]) assert.equal(findPersonalData(t), "phone", t);
});

test("ID numbers and email addresses are found", () => {
  assert.equal(findPersonalData("ID 23456789 at the gate"), "id");
  assert.equal(findPersonalData("write to someone@example.com"), "email");
});

test("ordinary campaign text passes", () => {
  for (const t of ["Market day in Kyuso, about 300 people", "Budget line KSh 2,500,000 for water", "Week 12, 10:30 baraza", "Ward 0331 report", "2027 election, 40 wards", "see https://www.iebc.or.ke/docs/rov_per_caw.pdf"]) assert.equal(findPersonalData(t), null, t);
});

test("a workspace form refuses a phone number in free text, on the server's own validator", () => {
  const field = COLLECTIONS.find((c) => c.fields.some((f) => f.type === "longtext"))!;
  const longtext = field.fields.find((f) => f.type === "longtext")!;
  const r = validateRecord(field, { [longtext.key]: "Spoke to the chair, 0722 000 111" }, {});
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.errors[longtext.key], /phone number/);
});


test("rate limit: a window allows its limit, refuses the next, and resets", () => {
  const r = new RateLimiter();
  const l = { limit: 3, windowMs: 1000 };
  assert.deepEqual([r.hit("k", l, 0), r.hit("k", l, 1), r.hit("k", l, 2)], [0, 0, 0]);
  assert.equal(r.hit("k", l, 3), 997);
  assert.equal(r.hit("other", l, 3), 0);
  assert.equal(r.hit("k", l, 1000), 0);
});

test("rate limit: memory stays bounded", () => {
  const r = new RateLimiter(10);
  for (let i = 0; i < 100; i++) r.hit(`k${i}`, { limit: 1, windowMs: 60_000 }, 0);
  assert.ok((r as unknown as { slots: Map<string, unknown> }).slots.size <= 10);
});
