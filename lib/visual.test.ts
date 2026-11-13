/**
 * The ```visual fence: the fixture compiles, carries every kind, and every fence in the content
 * fits its kind (brief 2026-10 declutter, 5.2).
 *
 *     node --experimental-strip-types --test lib/visual.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { compileVisuals } from "./visual-compile.ts";
import { VISUAL_KINDS, validateVisual, visibleWords, type VisualSpec } from "./visual.ts";

const fence = /^```visual\n(.*)\n```$/gm;

test("the fixture renders every kind", () => {
  const src = fs.readFileSync(path.join(process.cwd(), "docs", "declutter", "fixture-visual-kinds.md"), "utf8");
  const out = compileVisuals(src, "fixture");
  const kinds = new Set([...out.matchAll(fence)].map((m) => (JSON.parse(m[1]) as VisualSpec).kind));
  assert.deepEqual([...kinds].sort(), [...VISUAL_KINDS].sort());
});

test("every visual fence in the served content fits its kind", () => {
  const dir = path.join(process.cwd(), "public", "content");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    for (const m of fs.readFileSync(path.join(dir, f), "utf8").matchAll(fence)) {
      assert.deepEqual(validateVisual(JSON.parse(m[1])), [], `${f}: ${m[1].slice(0, 80)}`);
    }
  }
});

test("a malformed fence fails the build with its line", () => {
  assert.throws(() => compileVisuals("a\n```visual\nkind: cards\n```\n", "x.md"), /x\.md:2: visual fence: cards needs items/);
  assert.throws(() => compileVisuals("```visual\nkind: [\n```", "x.md"), /not valid YAML/);
});

test("card fields fold; card heads show", () => {
  const spec: VisualSpec = { kind: "cards", items: [{ title: "One two", head: { label: "Target", text: "three four" }, fields: [{ label: "Hidden", text: "five six seven" }] }] };
  assert.equal(visibleWords(spec), 5);
});
