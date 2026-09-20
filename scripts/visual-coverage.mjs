#!/usr/bin/env node
/**
 * Generates the per-section half of docs/VISUAL-FEATURE-LEDGER.md.
 *
 * The point of generating it rather than writing it is that the claim being made is only worth
 * anything if it is re-derived from the content and the components each time, instead of being a
 * table someone typed once and stopped updating.
 *
 * WHAT THIS CHECK NOW ASSERTS, AND WHY IT IS THE OPPOSITE OF WHAT IT USED TO.
 *
 * It used to fail the build if any numbered heading carried no figure. That is what produced the
 * 99 figures that measured nothing — a rule that must always find something will always find
 * something, and what it found was the heading restated, the subsection list redrawn, and in
 * eight cases an abstract diagram built from an empty array.
 *
 * So the assertion is inverted. A heading carrying NO figure is now a valid and common outcome,
 * reported rather than punished. What fails the build is a heading carrying a figure of a RETIRED
 * kind — one of the five that drew nothing — because that means the generator has started
 * manufacturing coverage again.
 *
 * It rebuilds the section index with the same rules as lib/section-index.ts and verify-mounts.mjs,
 * then reports the visual treatment each heading receives. Run with:
 *
 *     node scripts/visual-coverage.mjs            # print the table
 *     node scripts/visual-coverage.mjs --check    # exit non-zero if a retired figure kind is back
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "public", "content");

const TABS = {
  "decision.md": "decision",
  "cover.md": "cover",
  "presence.md": "presence",
  "summary.md": "summary",
  "situation.md": "situation",
  "objectives.md": "objectives",
  "audiences.md": "audiences",
  "approach.md": "approach",
  "engine.md": "engine",
  "messaging.md": "messaging",
  "scope.md": "scope",
  "scope-platforms.md": "scope-platforms",
  "scope-media.md": "scope-media",
  "scope-ground.md": "scope-ground",
  "scope-data.md": "scope-data",
  "roadmap.md": "roadmap",
  "deliverables.md": "deliverables",
  "measurement.md": "measurement",
  "governance.md": "governance",
  "risk.md": "risk",
  "structure.md": "structure",
  "assumptions.md": "assumptions",
  "nextsteps.md": "nextsteps",
  "arithmetic.md": "arithmetic",
  "reach.md": "reach",
  "annex-evidence.md": "annex-evidence",
  "annex-county.md": "annex-county",
  "annex-messages.md": "annex-messages",
  "annex-cadence.md": "annex-cadence",
  "annex-runbooks.md": "annex-runbooks",
};

const HEADING = /^(#{2,3})\s+(.+?)\s*$/;

function cleanTitle(raw) {
  return raw.replace(/\*\((new|updated)\)\*/gi, "").replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").trim();
}

/** Every heading in document order, with the file it came from and its level. */
function headings() {
  const out = [];
  for (const [file, tab] of Object.entries(TABS)) {
    let inFence = false;
    for (const line of fs.readFileSync(path.join(CONTENT, file), "utf8").split("\n")) {
      if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
      if (inFence) continue;
      const m = line.match(HEADING);
      if (!m) continue;
      out.push({ tab, level: m[1].length, title: cleanTitle(m[2]) });
    }
  }
  return out;
}

/** The derived figure each heading carries, read out of the generated specification. */
function derivedKinds() {
  const file = path.join(ROOT, "data", "section-visuals.generated.json");
  if (!fs.existsSync(file)) return new Map();
  const specs = JSON.parse(fs.readFileSync(file, "utf8"));
  return new Map(Object.entries(specs).map(([id, spec]) => [id, spec.kind]));
}

const LEADING = /^(\d+[A-Z]?(?:\.\d+)*)\.?\s/;
const idFor = (h) => {
  const m = LEADING.exec(h.title.trim());
  return m ? `${h.tab}-sec-${m[1].replace(/\./g, "-").toLowerCase()}` : null;
};

/** The ids that carry a bespoke visualisation, read out of the renderer's own mount table. */
function mountedIds() {
  const src = fs.readFileSync(path.join(ROOT, "components", "MarkdownViewer.tsx"), "utf8");
  const block = src.slice(src.indexOf("const HEADING_INSERTS"));
  return new Set([...block.matchAll(/"([a-z][a-z-]*-sec-[0-9a-z-]+)"/g)].map((m) => m[1]));
}

/**
 * What a heading gets, and why.
 *
 * The two entrance signatures are the whole point of the split: a sub-section opens a new
 * argument and wipes open; a part is a step inside one already open and rises. 190-odd of the 262
 * are parts, and anything stronger on those turns a long read into a strobe.
 */
function treatmentFor(h) {
  const shared = [
    "prose surfaces (links, tables, quotes, figures, rules, bold)",
    "native scroll-driven figure reveal",
  ];
  return h.level === 2
    ? ["h2: clip wipe from left", "gradient left bar", "marker sweep", "right-margin hairline", ...shared]
    : ["h3: 6px rise, 340ms", ...shared];
}

const all = headings();
const mounted = mountedIds();
const derived = derivedKinds();
const check = process.argv.includes("--check");

/**
 * What figure this heading carries, if any.
 *
 * The hand-built component where MarkdownViewer names one; otherwise the figure derived from the
 * heading's own prose; otherwise nothing, which is now a real and frequent answer rather than a
 * gap to be filled.
 */
function figureFor(h) {
  const id = idFor(h);
  if (!id) return { kind: "—", source: "unnumbered" };
  if (mounted.has(id)) return { kind: "bespoke component", source: "MarkdownViewer" };
  const kind = derived.get(id);
  // No figure is a legitimate answer, and for about a third of this document it is the right one.
  // A part whose figure IS its own interactive table lands here too: the table already gives it
  // search, sorting, CSV and a card layout on phones, so nothing is drawn above it.
  if (!kind) return { kind: "—", source: "none" };
  return { kind, source: "derived" };
}

/**
 * Figure kinds that were removed because they measured nothing. If one reappears in the generated
 * specs, the "cover every heading" instinct has crept back in and the build should say so.
 */
const RETIRED_KINDS = new Set(["statement", "chapter", "hub", "quote", "shape", "table"]);

if (check) {
  const revived = [...derived.entries()].filter(([, kind]) => RETIRED_KINDS.has(kind));
  if (revived.length) {
    console.error(`visual-coverage: ${revived.length} heading(s) carry a retired figure kind:`);
    for (const [id, kind] of revived.slice(0, 12)) console.error(`  ${id} -> ${kind}`);
    console.error("These kinds drew no measurable relationship and were removed. See scripts/build-section-visuals.mjs.");
    process.exit(1);
  }

  const bespoke = all.filter((h) => figureFor(h).source === "MarkdownViewer").length;
  const derivedCount = all.filter((h) => figureFor(h).source === "derived").length;
  const figureless = all.filter((h) => figureFor(h).source === "none").length;
  console.log(
    `visual-coverage: ${all.length} sections ` +
      `(${all.filter((h) => h.level === 2).length} sub-sections, ${all.filter((h) => h.level === 3).length} parts) — ` +
      `${bespoke} hand-built, ${derivedCount} derived from their own content, ` +
      `${figureless} carrying no figure because their content measures nothing.`
  );
  process.exit(0);
}

console.log(`| # | Part | Lvl | Section | Entrance | Figure |`);
console.log(`|---:|---|---|---|---|---|`);
all.forEach((h, i) => {
  const entrance = h.level === 2 ? "clip wipe ←" : "rise 6px";
  const fig = figureFor(h);
  console.log(
    `| ${i + 1} | ${h.tab} | h${h.level} | ${h.title.replace(/\|/g, "\\|")} | ${entrance} | ${fig.kind}${fig.source === "derived" ? "" : fig.source === "none" ? " (none)" : " ·"} |`
  );
});
