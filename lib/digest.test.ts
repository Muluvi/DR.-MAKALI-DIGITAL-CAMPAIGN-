import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { chapterDigest } from "./digest.ts";
import { CONTENT_FILES } from "./content-files.ts";

const CONTENT = path.join(import.meta.dirname, "..", "public", "content");

test("the takeaway is the chapter's first lead fence", () => {
  const d = chapterDigest("```lead\nWater comes first.\n```\n\nWater comes first. Then food.\n\n## 1.1 Water\n\n```lead\nA later lead.\n```\n");
  assert.equal(d.lead, "Water comes first.");
});

test("a chapter with no lead gives its first paragraph, not a heading, comment or fence", () => {
  const d = chapterDigest("<!-- keep -->\n## E.1 A heading\n\n```visual\n{\"kind\":\"cards\",\"items\":[]}\n```\n\nThe first sentence of prose.\n\nThe second.\n");
  assert.equal(d.lead, "The first sentence of prose.");
});

test("the numbers are the first stats visual, as printed, tier kept, four at most", () => {
  const items = [1, 2, 3, 4, 5].map((n) => ({ value: `${n}0%`, label: `label ${n}`, tier: n === 2 ? "modelled" : 1, body: "folded" }));
  const md = "```visual\n{\"kind\":\"cards\",\"items\":[{\"title\":\"not stats\"}]}\n```\n\n```visual\n" + JSON.stringify({ kind: "stats", items }) + "\n```\n";
  const d = chapterDigest(md);
  assert.deepEqual(d.stats, [
    { value: "10%", label: "label 1", tier: 1 },
    { value: "20%", label: "label 2", tier: "modelled" },
    { value: "30%", label: "label 3", tier: 1 },
    { value: "40%", label: "label 4", tier: 1 },
  ]);
});

test("a chapter with no stats visual shows no numbers, and a broken fence shows none", () => {
  assert.deepEqual(chapterDigest("```lead\nA claim with **51.7%** in it.\n```\n").stats, []);
  assert.deepEqual(chapterDigest("```visual\n{\"kind\":\"stats\", broken\n```\n").stats, []);
});

test("every chapter of the built document yields a takeaway", () => {
  for (const [tab, file] of Object.entries(CONTENT_FILES)) {
    const d = chapterDigest(fs.readFileSync(path.join(CONTENT, file), "utf8"));
    assert.ok(d.lead.length > 20, `${tab} has no takeaway`);
    assert.ok(!d.lead.startsWith("#") && !d.lead.startsWith("```"), `${tab}'s takeaway is not prose`);
    for (const s of d.stats) assert.ok(s.value && s.label, `${tab} has a number without a label`);
  }
});
