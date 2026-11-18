/**
 * Shared reading of content/*.md for the pre-launch pass (docs/prelaunch-2026-11): the section
 * index (printed number -> the heading's id and words), where an offset sits (section and fence),
 * and words as scripts/declutter/check-content.mjs counts them.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const CONTENT = path.join(ROOT, "content");
const FENCE = /^\s*```/;
/** As scripts/declutter/sections.mjs: the sections the content checks weigh. */
export const SECTION_HEADING = /^(#{2,3})\s+((?:\d+(?:\.\d+)*|[A-H](?:\.\d+)+))\s+(.*)$/;
/** As lib/heading-slug.ts: the headings that carry an id. */
const LEADING_NUMBER = /^((?:\d+[A-Z]?(?:\.\d+)*|[A-H](?:\.\d+)+))\.?\s/;

/** The chapters, with their printed number and label, read from lib/heading-slug.ts. */
export function chapters() {
  const src = fs.readFileSync(path.join(ROOT, "lib", "heading-slug.ts"), "utf8");
  return [...src.matchAll(/\{ id: "([^"]+)", part: (\d+), number: "([^"]*)", label: "([^"]+)"/g)].map((m) => ({ id: m[1], part: +m[2], number: m[3], label: m[4] }));
}

export function contentFiles() {
  const order = chapters().map((c) => c.id);
  return fs.readdirSync(CONTENT).filter((f) => f.endsWith(".md")).map((f) => path.basename(f, ".md")).filter((f) => order.includes(f));
}

const cleanTitle = (raw) => raw.replace(/\*\((new|updated)\)\*/gi, "").replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").trim();

/** Printed number -> { id, title, tab }. h2 and h3 headings, as lib/section-index.ts indexes them. */
export function sectionIndex() {
  const map = new Map();
  for (const tab of contentFiles()) {
    const text = fs.readFileSync(path.join(CONTENT, `${tab}.md`), "utf8");
    let inFence = false;
    for (const line of text.split("\n")) {
      if (FENCE.test(line)) { inFence = !inFence; continue; }
      if (inFence) continue;
      const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
      if (!m) continue;
      const title = cleanTitle(m[2]);
      const n = LEADING_NUMBER.exec(title);
      if (!n) continue;
      const number = n[1];
      const words = title.replace(LEADING_NUMBER, "").trim();
      if (!map.has(number)) map.set(number, { id: `${tab}-sec-${number.replace(/\./g, "-").toLowerCase()}`, title: words, tab });
    }
  }
  // A whole chapter ("Section 6") lands on its first heading and reads as the chapter's name.
  for (const c of chapters()) {
    if (!c.number || map.has(c.number)) continue;
    const first = [...map.values()].find((v) => v.tab === c.id);
    if (first) map.set(c.number, { id: first.id, title: c.label, tab: c.id, chapter: true });
  }
  return map;
}

/** The section number ("13.2", or "(intro)") and fence kind at a character offset. */
export function where(text, at) {
  const before = text.slice(0, at).split("\n");
  let section = "(intro)";
  let fence = null;
  for (const line of before.slice(0, -1)) {
    if (FENCE.test(line)) { fence = fence ? null : (line.trim().slice(3) || "code"); continue; }
    const m = fence ? null : SECTION_HEADING.exec(line);
    if (m) section = m[2];
  }
  // The line the offset is on may itself open a fence.
  return { section, fence };
}

/** Words as check-content counts them: whitespace runs with a letter or digit, YAML keys not counted. */
export const words = (s) =>
  (s.replace(/\b(?:kind|preset|title|note|items|label|text|head|fields|body|tier|when|value|badge|chips|caption)\s*:/g, " ").match(/\S+/g) ?? [])
    .filter((t) => /[A-Za-z0-9]/.test(t) && !/^\d+\.$/.test(t)).length;
