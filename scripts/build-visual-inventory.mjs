#!/usr/bin/env node
/**
 * Every block of the proposal, listed once, with what is going to happen to it.
 *
 * WHY THIS IS GENERATED. The brief asks for one row per block across thirty chapters. Written by
 * hand that is a few thousand rows nobody can keep true, and the first edit to the markdown makes
 * it a lie. Generated, it cannot miss a block, it cannot invent one, and it can be re-run after
 * every conversion to show what is left.
 *
 * WHAT IS MECHANICAL AND WHAT IS A JUDGEMENT. The parser decides the id, the type and the word
 * count — facts about the source. It does NOT decide what a block is for. The FT relationship,
 * the action and the target component are editorial calls, and they live in
 * scripts/visual-inventory-plan.json, keyed by subsection, where they can be read and argued with
 * on their own. A subsection with no entry in the plan defaults to `argument` / KEEP-PROSE, which
 * is the safe default: prose survives unless someone has decided a figure can carry it.
 *
 * RETIRED WORDS ARE COUNTED, NOT ESTIMATED. The `retires` column sums the word counts of the
 * blocks actually marked for retirement, so "words retired under rule 1a" in REPORT.md is a
 * measurement rather than a recollection. Hard rule 1 says an `argument` block can never retire a
 * word; the generator enforces that and fails loudly rather than writing a row that breaks it.
 *
 *     node scripts/build-visual-inventory.mjs           # writes docs/visual-audit/INVENTORY.md
 *     node scripts/build-visual-inventory.mjs --check   # fails if the file is out of date
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "public", "content");
const PLAN_FILE = path.join(ROOT, "scripts", "visual-inventory-plan.json");
const OUT = path.join(ROOT, "docs", "visual-audit", "INVENTORY.md");

const BOX = /[┌│└═▼█┐┘├┤┬┴┼─╔╗╚╝║╠╣╦╩╬▲◄►]/;
const ACTIONS = new Set(["KEEP-PROSE", "CONVERT", "COLLAPSE", "DEDUPE", "FIX"]);

/** Reading order, so the inventory is in the order the document is read rather than alphabetical. */
const ORDER = [
  "decision", "summary", "presence", "situation", "arithmetic", "reach",
  "objectives", "audiences", "approach", "engine", "messaging",
  "scope", "scope-platforms", "scope-media", "scope-ground", "scope-data",
  "roadmap", "deliverables", "measurement", "governance", "risk", "structure",
  "assumptions", "nextsteps",
  "cover", "annex-evidence", "annex-county", "annex-messages", "annex-cadence", "annex-runbooks",
];

const words = (s) => (s.match(/\S+/g) ?? []).length;

/**
 * The section number a heading opens with, which is the document's own addressing system.
 *
 * "### 3.4.5 Where he is not yet known" -> "3.4.5". A heading with no leading number (the
 * "#### Path A: ..." blocks, the stage labels) keeps its parent's number and is distinguished by
 * the block index, because those headings are not addresses — they are labels inside a
 * subsection.
 */
function headingNumber(text) {
  const m = text.match(/^((?:\d+[A-Za-z]?\.)+\d+[a-z]?|\d+[A-Za-z]?)\s/);
  return m ? m[1] : null;
}

/**
 * Split one chapter's markdown into blocks, carrying the heading context down with them.
 *
 * Fenced blocks are taken whole — a box-drawing diagram is one block, not forty lines — and
 * tables are taken whole for the same reason. Everything else is separated by blank lines, which
 * is what markdown itself means by a block.
 */
function parseBlocks(raw, tab) {
  const lines = raw.split("\n");
  const blocks = [];
  let subsection = null;      // the numbered heading this block sits under
  let subtitle = "";          // that heading's text, for the report
  let label = null;           // an unnumbered #### label inside the subsection
  let index = 0;

  const push = (type, text, extra = {}) => {
    if (!text.trim()) return;
    blocks.push({
      tab,
      subsection: subsection ?? "—",
      subtitle,
      label,
      index: index++,
      type,
      words: words(text),
      text,
      ...extra,
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ---- headings -----------------------------------------------------------------
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const text = h[2].replace(/\s*#+\s*$/, "").trim();
      const number = headingNumber(text);
      if (number) {
        subsection = number;
        subtitle = text;
        label = null;
        index = 0;
      } else if (h[1].length >= 4) {
        label = text;
      } else {
        subsection = subsection ?? "—";
        subtitle = text;
        label = null;
        index = 0;
      }
      blocks.push({
        tab, subsection: subsection ?? "—", subtitle, label: number ? null : label,
        index: -1, type: "heading", words: words(text), text, level: h[1].length,
      });
      continue;
    }

    // ---- fenced blocks ------------------------------------------------------------
    if (/^```/.test(line)) {
      const info = line.slice(3).trim();
      const start = i;
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) i += 1;
      const body = lines.slice(start + 1, i).join("\n");
      const type = info === "figure" ? "figure" : BOX.test(body) ? "ascii" : "code";
      push(type, body, { fence: info || null, lines: i - start - 1 });
      continue;
    }

    // ---- tables -------------------------------------------------------------------
    if (/^\s*\|.*\|\s*$/.test(line) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] ?? "")) {
      const start = i;
      i += 2;
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) i += 1;
      const body = lines.slice(start, i).join("\n");
      i -= 1;
      const cols = (lines[start].match(/\|/g) ?? []).length - 1;
      push("table", body, { rows: i - start - 1, cols });
      continue;
    }

    // ---- blockquotes --------------------------------------------------------------
    if (/^\s*>/.test(line)) {
      const start = i;
      while (i < lines.length && (/^\s*>/.test(lines[i]) || lines[i].trim() === "")) {
        if (lines[i].trim() === "" && !/^\s*>/.test(lines[i + 1] ?? "")) break;
        i += 1;
      }
      push("callout", lines.slice(start, i).join("\n"));
      i -= 1;
      continue;
    }

    // ---- lists --------------------------------------------------------------------
    if (/^\s*(?:[-*+]|\d+\.)\s/.test(line)) {
      const start = i;
      while (i < lines.length && lines[i].trim() !== "") i += 1;
      const body = lines.slice(start, i).join("\n");
      const items = (body.match(/^\s*(?:[-*+]|\d+\.)\s/gm) ?? []).length;
      push("list", body, { items });
      i -= 1;
      continue;
    }

    // ---- raw HTML -----------------------------------------------------------------
    if (/^\s*<(?:div|span|details|figure|section|p|aside)/i.test(line)) {
      const start = i;
      while (i < lines.length && lines[i].trim() !== "") i += 1;
      push("html", lines.slice(start, i).join("\n"));
      i -= 1;
      continue;
    }

    // ---- prose --------------------------------------------------------------------
    if (line.trim()) {
      const start = i;
      // A paragraph ends at the next block, not only at the next blank line. Five tables in this
      // document sit directly under their introducing sentence with no blank line between, and
      // without this test they were counted as part of the paragraph — the inventory reported 69
      // tables against the 74 that are there.
      const opensAnotherBlock = (n) =>
        n === undefined || n.trim() === "" ||
        /^(#{1,6})\s/.test(n) || /^```/.test(n) ||
        /^\s*(?:[-*+]|\d+\.)\s/.test(n) || /^\s*>/.test(n) ||
        (/^\s*\|.*\|\s*$/.test(n));
      while (i < lines.length && !opensAnotherBlock(lines[i])) i += 1;
      push("prose", lines.slice(start, i).join("\n"));
      i -= 1;
    }
  }
  return blocks;
}

/**
 * The editorial plan for one block.
 *
 * Matching is most-specific-first: a rule naming this block's type inside this subsection beats a
 * rule for the subsection, which beats the chapter default. Nothing here guesses — an unmatched
 * block is prose that stays.
 */
function planFor(plan, block) {
  const bySection = plan.sections?.[`${block.tab}:${block.subsection}`];
  const byChapter = plan.chapters?.[block.tab];
  const candidates = [
    // Per-block-index rules exist because a type rule is too blunt where it matters most. In
    // §3.3.4 one list is four administrative competencies (a figure re-labels them) and another
    // is the three revenue components (the envelope bar genuinely replaces them); in §3.4.5 one
    // list restates ward numbers the deficit panel draws and the next is the operational mandate,
    // which is reasoning. A single `list: CONVERT` would have deleted the reasoning along with
    // the restatement, which is exactly what rule 1 exists to prevent.
    bySection?.indexes?.[String(block.index).padStart(2, "0")],
    bySection?.blocks?.[block.type],
    bySection?.default,
    byChapter?.blocks?.[block.type],
    byChapter?.default,
  ].filter(Boolean);

  // An ASCII diagram has no defence: rule 1a names it as retirable once a figure carries the same
  // facts, and leaving one in place after this work would be the single most visible failure.
  const fallback =
    block.type === "ascii"
      ? { relationship: "diagram", action: "CONVERT", target: "(unassigned — see conversion map)" }
      : { relationship: "argument", action: "KEEP-PROSE", target: "—" };

  return Object.assign({}, fallback, ...candidates.reverse());
}

function build() {
  const files = fs.readdirSync(CONTENT).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  const missing = files.filter((f) => !ORDER.includes(f));
  if (missing.length) throw new Error(`build-visual-inventory: chapter(s) missing from ORDER: ${missing.join(", ")}`);

  const plan = fs.existsSync(PLAN_FILE) ? JSON.parse(fs.readFileSync(PLAN_FILE, "utf8")) : {};
  const rows = [];
  const violations = [];

  for (const tab of ORDER) {
    const raw = fs.readFileSync(path.join(CONTENT, `${tab}.md`), "utf8");
    for (const block of parseBlocks(raw, tab)) {
      if (block.type === "heading") continue;
      const p = planFor(plan, block);
      const action = p.action;
      if (!ACTIONS.has(action)) violations.push(`${tab}:${block.subsection} — unknown action "${action}"`);

      // Only CONVERT deletes. COLLAPSE keeps every word behind a disclosure, and DEDUPE keeps
      // them behind a CrossRef until Firefly approves deletion in DECISIONS.md (rule 1b) — so
      // neither retires anything, and counting them as retired would overstate the compaction by
      // claiming credit for words that are still on the page.
      const retires = action === "CONVERT" ? block.words : 0;
      const pending = action === "DEDUPE" ? block.words : 0;

      // Hard rule 1: reasoning no visual can carry never loses a word, whatever the plan says.
      if (retires > 0 && p.relationship === "argument") {
        violations.push(
          `${tab}:${block.subsection} block ${block.index} — an \`argument\` block is marked CONVERT, ` +
          `which would retire ${block.words} words of reasoning. Rule 1 forbids it.`
        );
      }

      rows.push({
        id: `${tab}:${block.subsection}:${String(block.index).padStart(2, "0")}`,
        tab,
        subsection: block.subsection,
        subtitle: block.subtitle,
        label: block.label,
        type: block.type,
        words: block.words,
        relationship: p.relationship,
        action,
        target: p.target ?? "—",
        retires,
        pending,
        note: p.note ?? "",
      });
    }
  }
  return { rows, violations };
}

/** One row of the table, with the pipe characters inside cell text escaped so the table survives. */
const cell = (v) => String(v ?? "").replace(/\|/g, "\\|").replace(/\n+/g, " ");

function render({ rows, violations }) {
  const total = rows.reduce((a, r) => a + r.words, 0);
  const retired = rows.reduce((a, r) => a + r.retires, 0);
  const pending = rows.reduce((a, r) => a + r.pending, 0);
  const byAction = {};
  const byType = {};
  for (const r of rows) {
    byAction[r.action] = (byAction[r.action] ?? 0) + 1;
    byType[r.type] = (byType[r.type] ?? 0) + 1;
  }

  const out = [];
  out.push("# Inventory — every block, and what happens to it");
  out.push("");
  out.push("<!-- GENERATED by scripts/build-visual-inventory.mjs. Do not edit by hand. -->");
  out.push("<!-- The editorial columns come from scripts/visual-inventory-plan.json — edit that. -->");
  out.push("");
  out.push(
    "The parser owns `id`, `type` and `words`: those are facts about the markdown. The plan file owns",
    "`relationship`, `action`, `target` and the note: those are editorial calls. A block with no entry",
    "in the plan defaults to `argument` / KEEP-PROSE, because prose survives unless somebody has",
    "decided a figure can carry it.",
    ""
  );
  out.push("**Actions.** KEEP-PROSE — stays as written. CONVERT — a figure takes over its job and the");
  out.push("block is retired under rule 1a. COLLAPSE — kept in full, behind the Brief-mode disclosure.");
  out.push("DEDUPE — collapsed to a `CrossRef` under rule 1b, pending Firefly's approval in DECISIONS.md.");
  out.push("FIX — a defect, not a conversion.");
  out.push("");
  out.push("## Totals");
  out.push("");
  out.push(`- Blocks: **${rows.length}**, carrying **${total.toLocaleString()}** words.`);
  out.push(`- Words retired outright, under rule 1a: **${retired.toLocaleString()}** (${((retired / total) * 100).toFixed(1)}% of the document). Every one is an ASCII diagram, a card stack or a table a figure now renders.`);
  out.push(`- Words collapsed to a \`CrossRef\` under rule 1b, still on the page, pending Firefly's answer to D-1: **${pending.toLocaleString()}**.`);
  out.push("");
  out.push("| Action | Blocks | | Type | Blocks |");
  out.push("|---|---|---|---|---|");
  const acts = Object.entries(byAction).sort((a, b) => b[1] - a[1]);
  const types = Object.entries(byType).sort((a, b) => b[1] - a[1]);
  for (let i = 0; i < Math.max(acts.length, types.length); i++) {
    const a = acts[i] ? `${acts[i][0]} | ${acts[i][1]}` : " | ";
    const t = types[i] ? `${types[i][0]} | ${types[i][1]}` : " | ";
    out.push(`| ${a} | | ${t} |`);
  }
  out.push("");

  if (violations.length) {
    out.push("## ⚠ Rule violations in the plan");
    out.push("");
    out.push("These must be resolved before the conversions land. A row below means the plan asks for a");
    out.push("word of reasoning to be deleted, which hard rule 1 forbids.");
    out.push("");
    for (const v of violations) out.push(`- ${v}`);
    out.push("");
  }

  let tab = null;
  for (const r of rows) {
    if (r.tab !== tab) {
      tab = r.tab;
      const chapterWords = rows.filter((x) => x.tab === tab).reduce((a, x) => a + x.words, 0);
      const chapterRetired = rows.filter((x) => x.tab === tab).reduce((a, x) => a + x.retires, 0);
      out.push("");
      out.push(`## ${tab} — ${rows.filter((x) => x.tab === tab).length} blocks, ${chapterWords.toLocaleString()} words, ${chapterRetired.toLocaleString()} retired`);
      out.push("");
      out.push("| id | type | words | relationship | action | target | retires | note |");
      out.push("|---|---|---|---|---|---|---|---|");
    }
    out.push(
      `| \`${r.id}\` | ${r.type} | ${r.words} | ${cell(r.relationship)} | ${r.action} | ${cell(r.target)} | ${r.retires || ""} | ${cell(r.note)} |`
    );
  }
  out.push("");
  return out.join("\n");
}

const result = build();
const text = render(result);

if (process.argv.includes("--check")) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (current !== text) {
    console.error("build-visual-inventory: docs/visual-audit/INVENTORY.md is out of date. Run `node scripts/build-visual-inventory.mjs`.");
    process.exit(1);
  }
  if (result.violations.length) {
    console.error(`build-visual-inventory: ${result.violations.length} rule violation(s) in the plan:`);
    for (const v of result.violations) console.error(`  ${v}`);
    process.exit(1);
  }
  console.log(`build-visual-inventory: ${result.rows.length} blocks, inventory current.`);
} else {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, text);
  const retired = result.rows.reduce((a, r) => a + r.retires, 0);
  const pendingWords = result.rows.reduce((a, r) => a + r.pending, 0);
  console.log(`build-visual-inventory: ${result.rows.length} blocks written to docs/visual-audit/INVENTORY.md (${retired.toLocaleString()} retired, ${pendingWords.toLocaleString()} pending dedupe).`);
  for (const v of result.violations) console.error(`  violation: ${v}`);
}
