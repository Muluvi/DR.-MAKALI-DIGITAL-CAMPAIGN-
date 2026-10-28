/**
 * X1 to X4 and X6 (brief 2026-10 declutter, 5.4): every working mark in the content, and what the
 * renderer makes of it. Runs on the resolved content (public/content), so a mark added to the
 * source is caught here the next time anyone runs `npm run verify`.
 *
 *     node --experimental-strip-types --test lib/inline-marks.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { tokenizeInline, splitTier, refsOf, COUNSEL_NOTE } from "./inline-marks.ts";

const DIR = path.join(process.cwd(), "public", "content");
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).sort();
/** Prose only: fences carry figure ids and visual JSON, which the renderer never tokenizes. */
function prose(text: string): string {
  return text.replace(/^```[\s\S]*?^```/gm, "").replace(/\s+/g, " ");
}
const all = files.map((f) => prose(fs.readFileSync(path.join(DIR, f), "utf8"))).join(" ");

test("every tier parenthetical becomes a badge, and its head names a tier", () => {
  const raw = [...all.matchAll(/\(Tier [123]/g)].length;
  const parts = tokenizeInline(all).filter((p) => p.type === "tier");
  assert.equal(parts.length, raw, "a tier parenthetical the pattern does not close");
  const seen = new Map<string, number>();
  for (const p of parts) {
    if (p.type !== "tier") continue;
    assert.ok(p.tiers.length >= 1, `no tier in ${p.raw}`);
    seen.set(p.head, (seen.get(p.head) ?? 0) + 1);
  }
  // The list of every badge head the content uses, so a new form shows up in review.
  console.log("tier badge heads:", JSON.stringify([...seen.entries()].sort()));
});

test("splitTier keeps the source and caveat behind the badge, word for word", () => {
  assert.deepEqual(splitTier("(Tier 1, IEBC Form 37C)"), { tiers: [1], head: "Tier 1", rest: "IEBC Form 37C" });
  assert.deepEqual(splitTier("(Tier 3; Section 2.5.2 sets out what would confirm it)"), {
    tiers: [3],
    head: "Tier 3",
    rest: "Section 2.5.2 sets out what would confirm it",
  });
  assert.deepEqual(splitTier("(Tier 1 / Tier 2)"), { tiers: [1, 2], head: "Tier 1 / Tier 2", rest: "" });
  assert.equal(splitTier("(Tier 1 gap)").head, "Tier 1 gap");
});

test("every conflict marker becomes a chip", () => {
  const raw = [...all.matchAll(/\[CONFLICT C\d/g)].length;
  assert.equal(raw, 27, "the restructure left 27 conflict markers in the content");
  assert.equal(tokenizeInline(all).filter((p) => p.type === "conflict").length, raw);
});

test("every [CHECK REF] is matched, so none reaches a reader", () => {
  const raw = [...all.matchAll(/\[CHECK REF\]/g)].length;
  assert.equal(tokenizeInline(all).filter((p) => p.type === "checkref").length, raw);
});

test("every [VERIFY …] becomes a status chip", () => {
  const raw = [...all.matchAll(/\[VERIFY/g)].length;
  assert.equal(tokenizeInline(all).filter((p) => p.type === "status").length, raw);
});

test("the counsel note in a code span is recognised", () => {
  const m = COUNSEL_NOTE.exec("[Confirm approach with campaign counsel — agent networks are regulated financial infrastructure]");
  assert.equal(m?.[1], "agent networks are regulated financial infrastructure");
});

test("parenthesised section references become link chips; references in a sentence do not", () => {
  const xref = tokenizeInline("Set in Week 1 (Section 4.2.1), and Section 4.6.6 sets out how.");
  assert.deepEqual(xref.filter((p) => p.type === "xref").map((p) => (p.type === "xref" ? p.refs : [])), [["4.2.1"]]);
  assert.deepEqual(refsOf("(Sections 2.5 and 2.6)"), ["2.5", "2.6"]);
  assert.deepEqual(refsOf("(Section A.1.2)"), ["A.1.2"]);
  const n = tokenizeInline(all).filter((p) => p.type === "xref").length;
  console.log("parenthesised references drawn as chips:", n);
  assert.ok(n > 100);
});
