#!/usr/bin/env node
/**
 * Derives one bespoke visual specification for every heading in the proposal.
 *
 * The brief was "use the visual features extensively in every part, and text may be removed so
 * long as a visual tool replaces it". 273 headings is far past the point where a hand-written
 * mount table stays honest — HEADING_INSERTS already records what happens when keys drift from
 * the headings they name. So the specs are DERIVED from the prose, by the same rules every time,
 * and written to data/section-visuals.generated.json.
 *
 * The classification follows the chooser in the visuals handbook (Part 5.9 / Part 14): the shape
 * of the content decides the shape of the visual.
 *
 *   "Baseline … Target …"        -> bullet chart (actual against target)
 *   "First …, then …"            -> vertical stepper
 *   "If …, then …"               -> response playbook / decision tree
 *   "Phase −1 …", dated bullets  -> vertical timeline
 *   a × b × c = d                -> build-up waterfall
 *   shares that sum to ~100      -> waffle
 *   two time points              -> slope
 *   many labelled magnitudes     -> ordered horizontal bars
 *   a handful of figures         -> KPI stat rail with sparklines
 *   criteria across items        -> comparison matrix
 *   grouped bullets round a hub  -> hub / concentric diagram
 *   an enumerated commitment set -> checklist grid
 *
 * Anything a rule cannot read with confidence falls back to the section's own figures, and where
 * there are none, to a structural "shape of this part" diagram built from its list tree — never
 * to a decorative panel, because a visual that does no job is the one thing the handbook cuts.
 *
 * Run:  node scripts/build-section-visuals.mjs           # write the JSON
 *       node scripts/build-section-visuals.mjs --report  # print the distribution
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contentTabs } from "./content-routes.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "public", "content");
const OUT = path.join(ROOT, "data", "section-visuals.generated.json");

const TABS = contentTabs();

const HEADING = /^(#{2,3})\s+(.+?)\s*$/;
const LEADING_NUMBER = /^((?:\d+[A-Z]?(?:\.\d+)*|[A-G](?:\.\d+)+))\.?\s/;

const cleanTitle = (raw) =>
  raw
    .replace(/\*\((new|updated)\)\*/gi, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    // Strip LaTeX "\ge 55" / "$\ge 55$" left over from the source document's display math.
    //
    // THE BACKSLASH IS REQUIRED, and that is the whole point of this line. It used to be optional
    // (`\\?`), which let the pattern match the letters "ge" inside an ordinary word whenever a
    // comma or a number followed. Three headings in this document were silently corrupted by it,
    // and the corruption was invisible in the markdown because it happened here, on the way into
    // data/section-visuals.generated.json:
    //
    //     "7.3 Language, register and dialect"  ->  "7.3 Langua register and dialect"
    //     "11.1.1 Stage 1: the nomination..."   ->  "11.1.1 Sta: the nomination..."
    //     "11.1.2 Stage 2: the general..."      ->  "11.1.2 Sta: the general..."
    //
    // and it was waiting for more: "Percentage 40" -> "Percenta", "Coverage 78.8%" -> "Covera.8%",
    // "Large 12 wards" -> "Lar wards". These were logged as content typos to be fixed by hand.
    // They are not in the content; the content is correct. One character in this regex was.
    .replace(/\s*\$?\\ge\s*[\d,]+\$?/g, "")
    .trim();

const headingSlug = (text) => {
  const m = LEADING_NUMBER.exec(text.trim());
  return m ? m[1].replace(/\./g, "-").toLowerCase() : null;
};

/* ------------------------------------------------------------------ parsing */

/** Every heading with the body that belongs to it (up to the next h2/h3). */
function readSections() {
  const out = [];
  for (const [file, tab] of Object.entries(TABS)) {
    const lines = fs.readFileSync(path.join(CONTENT, file), "utf8").split("\n");
    let current = null;
    let inFence = false;
    for (const line of lines) {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        if (current) current.body.push(line);
        continue;
      }
      if (!inFence) {
        const m = line.match(HEADING);
        if (m) {
          if (current) out.push(current);
          const title = cleanTitle(m[2]);
          const slug = headingSlug(title);
          current = {
            tab,
            level: m[1].length,
            title,
            number: (LEADING_NUMBER.exec(title.trim()) || [, ""])[1] || "",
            id: slug ? `${tab}-sec-${slug}` : null,
            body: [],
          };
          continue;
        }
      }
      if (current) current.body.push(line);
    }
    if (current) out.push(current);
  }
  return out;
}

const stripEmphasis = (s) =>
  s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

/** Bullet items, with the bolded field label lifted out where the item carries one. */
function bullets(body) {
  const out = [];
  let buf = null;
  for (const raw of body) {
    const m = raw.match(/^(\s*)(?:[*\-+]|\d+\.)\s+(.*)$/);
    if (m) {
      if (buf) out.push(buf);
      buf = { indent: m[1].length, text: m[2] };
    } else if (buf && /^\s{2,}\S/.test(raw)) {
      buf.text += " " + raw.trim();
    } else if (buf && raw.trim() === "") {
      out.push(buf);
      buf = null;
    }
  }
  if (buf) out.push(buf);
  return out.map((b) => {
    const lab = b.text.match(/^\*\*(.{1,44}?):?\*\*:?\s*(.*)$/);
    return {
      indent: b.indent,
      label: lab ? lab[1].replace(/:$/, "").trim() : null,
      value: lab ? stripEmphasis(lab[2]) : stripEmphasis(b.text),
      raw: b.text,
    };
  });
}

/** Markdown tables in the body, as header + rows of cell text. */
function tables(body) {
  const out = [];
  let cur = null;
  for (const raw of body) {
    const line = raw.trim();
    const isRow = line.startsWith("|") && line.endsWith("|") && line.length > 2;
    if (isRow) {
      const cells = line.slice(1, -1).split("|").map((c) => stripEmphasis(c));
      if (/^[-: ]+$/.test(cells.join(""))) continue;
      if (!cur) cur = { header: cells, rows: [] };
      else cur.rows.push(cells);
    } else if (cur) {
      out.push(cur);
      cur = null;
    }
  }
  if (cur) out.push(cur);
  return out.filter((t) => t.rows.length);
}

/**
 * Steps written inside a text diagram.
 *
 * 102 of the proposal's figures are box-drawing diagrams in fenced blocks, and many of them are
 * numbered sequences — "STEP 1: CREATIVE DRAFTING", "PHASE 2: …". AsciiDiagram already renders
 * the block; this reads the same block's spine so the part gets a real stepper as well as the
 * drawing, rather than nothing because the section happens to contain no bullets.
 */
function fenceSteps(body) {
  const out = [];
  let inFence = false;
  for (const raw of body) {
    if (/^\s*```/.test(raw)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) continue;
    const m = raw.match(/^[\s│|]*(?:STEP|PHASE|STAGE|TIER|LEVEL|ROUND)\s*([−-]?\d+)\s*[:.\u2013\u2014-]\s*(.+?)[\s│|]*$/i);
    if (m) out.push({ n: out.length + 1, label: stripEmphasis(m[2]).replace(/[─━=]+$/, "").trim(), body: "" });
  }
  return out;
}

const paragraphs = (body) => {
  const text = body.join("\n");
  return text
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n\s*\n/)
    .map((p) => stripEmphasis(p))
    .filter((p) => p && !p.startsWith("|") && !/^[*\-+]\s/.test(p) && !/^>/.test(p) && p.length > 40);
};

const NUM = /(-?\d[\d,]*(?:\.\d+)?)\s*(%|percent|pts?|points?|m\b|million|k\b|bn\b|billion|KES|Ksh)?/gi;

/** Parse "1,136,187" / "40.0%" / "1.2m" into a number plus the unit it was written with. */
function parseFigure(raw, unit) {
  let n = Number(String(raw).replace(/,/g, ""));
  if (!Number.isFinite(n)) return null;
  const u = (unit || "").toLowerCase();
  if (u === "m" || u === "million") n *= 1_000_000;
  else if (u === "k") n *= 1_000;
  else if (u === "bn" || u === "billion") n *= 1_000_000_000;
  return { value: n, pct: u === "%" || u === "percent", pts: u.startsWith("pt") || u.startsWith("point") };
}

/** Lines set as a blockquote — the part's own governing sentence, where it has one. */
function quotes(body) {
  return body
    .filter((l) => /^\s*>/.test(l))
    .map((l) => stripEmphasis(l.replace(/^\s*>\s?/, "")))
    .filter(Boolean);
}

/**
 * Figures, with the words around them as the label.
 *
 * Bold runs first, because the document bolds the figures it wants read. Where a part bolds
 * none, the same reader still deserves its numbers, so the second pass reads them out of plain
 * prose — sentence-anchored, so "40 wards" is a figure and "Section 3.4.6" is not.
 */
function figures(body) {
  const text = body.join("\n").replace(/```[\s\S]*?```/g, "");
  const bold = figuresFrom(text, /\*\*([^*]{1,90}?)\*\*/g, 1);
  if (bold.length >= 2) return bold;
  const plain = figuresFrom(text, /(?<![.\d])\b(\d[\d,]*(?:\.\d+)?\s*(?:%|percent|pts?|points?|m|million|k|bn|billion)?)\b/gi, 1, true);
  const merged = [...bold];
  for (const f of plain) if (!merged.some((x) => x.value === f.value)) merged.push(f);
  return merged;
}

// A cross-reference in the twenty-odd characters before a number ("Sections 2 to 5", "Tier 2",
// "Annex E") makes that number an address. Anchoring only at the very end missed "Sections 2 to
// 5", where the reference word is four characters upstream of the digit being read.
const SECTION_REF = /\b(sections?|§|tiers?|annexe?s?|workstreams?|phases?|figures?|tables?|parts?|r\d)\b[^.]{0,22}$/i;
const ADDRESS = /^\s*\(?\s*(sections?|§|tiers?|annexes?|annex|workstreams?|phases?|figures?|tables?|parts?|commitments?|weeks?|days?|rounds?)\b/i;

function figuresFrom(text, re, group, plainMode = false) {
  const out = [];
  const seen = new Set();
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(text))) {
    const inner = m[group];
    NUM.lastIndex = 0;
    const f = NUM.exec(inner);
    if (!f || !/\d/.test(f[1])) continue;
    const parsed = parseFigure(f[1], f[2]);
    if (!parsed) continue;
    const before = stripEmphasis(text.slice(Math.max(0, m.index - 110), m.index));
    const after = stripEmphasis(text.slice(m.index + m[0].length, m.index + m[0].length + 90));
    // "Section 3.4.6", "Tier 2", "R1" are addresses, not quantities — in bold as much as in prose.
    if (ADDRESS.test(inner)) continue;
    // A bare year is a date, not a quantity — in a bold run as much as in plain prose.
    if (!parsed.pct && !parsed.pts && /^(19|20)\d\d$/.test(f[1].replace(/,/g, ""))) continue;
    if (plainMode && (SECTION_REF.test(before) || parsed.value < 3)) continue;
    const label = labelFor(stripEmphasis(inner), before, after);
    const key = `${parsed.value}|${label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (label.replace(/[^A-Za-z]/g, "").length < 4) continue;
    /**
     * What the figure PRINTS.
     *
     * The bold run, when the bold run is a figure — "532,758", "KSh 13.79 billion", "86.4%". When
     * it is a sentence that happens to contain a number, the sentence is not the figure, and
     * printing it inside a stat tile produced tiles reading "a Tier 3, single-source repo". Past
     * that length the tile prints the quantity alone and the sentence stays in the prose.
     */
    const written = stripEmphasis(inner).trim();
    const display = written.length <= 22 ? written : `${f[1]}${f[2] ? (f[2] === "%" ? "%" : ` ${f[2]}`) : ""}`;
    out.push({
      value: parsed.value,
      pct: parsed.pct,
      pts: parsed.pts,
      display,
      long: written.length > 22,
      label,
    });
  }
  return out;
}

const STOP = /^(the|a|an|of|and|or|to|in|on|at|is|are|was|were|by|for|with|that|this|it|as|from|but|not|its|their|his|her|which|who|what|when|be|been|has|have|had|will|would|can|could|than|then|so|because|about|into|over|under|between|per|each|every|only|also|now|just|one|two|three|out|up|down|there|here|all|any|more|most|such|these|those|we|they|i|you|he|she|our|your|my)$/i;
const DROP_WORD = /^(section|sections|tier|annex|workstream|phase|figure|table|part|parts)$/i;

const contentWords = (s) =>
  s
    .replace(/[^\w\s%–—-]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[-–—]+|[-–—]+$/g, ""))
    .filter((w) => w && !/^\d/.test(w) && !DROP_WORD.test(w));

/**
 * A short, honest label for a figure: what the number measures, in the document's own words.
 *
 * The figure's own bold run first, because "**40 wards**" names itself. Failing that the clause
 * AFTER it, which is where English puts the thing being counted ("**86.4%** of Kitui residents
 * are outside…"), and only then the clause before. Leading function words are dropped at each
 * step, so the label reads as a noun phrase rather than as a sentence fragment.
 */
const PREP = /^(in|of|for|on|at|with|by|from|to|into|across|against|between|per|within|under|over|about|that|who|which|whose)$/i;

function labelFor(inner, before, after) {
  const trim = (words) => {
    const out = [...words];
    while (out.length && STOP.test(out[0])) out.shift();
    while (out.length && STOP.test(out[out.length - 1])) out.pop();
    return out;
  };
  /**
   * A label is a noun phrase, not a sentence opening.
   *
   * "743 posts" labels itself; "743 posts, a team that publishes every day" does not, and the
   * clause after the comma belongs to the sentence rather than to the figure. So the phrase is
   * cut at the first comma and then at the first preposition or relative pronoun that follows at
   * least one word of substance — which is where, in English, the noun stops and its
   * qualification starts.
   */
  const phrase = (raw, fromEnd = false) => {
    // Looking backwards, the clause that matters is the LAST one in the window, and the window
    // itself starts 110 characters back — in the middle of a word. Taking the first clause and
    // then its last four words produced labels like "rted alongside the findings": the tail of
    // "reported", promoted to the head of a label.
    const parts = (raw || "").split(/[,;:—–.]/).filter((x) => x.trim());
    const seg = fromEnd ? parts[parts.length - 1] : parts[0];
    const words = trim(contentWords(seg || ""));
    const picked = fromEnd ? words.slice(-4) : words.slice(0, 4);
    const out = [];
    for (const w of picked) {
      if (out.length >= 1 && PREP.test(w)) break;
      out.push(w);
      if (out.length === 4) break;
    }
    // Trim again after the cut: slicing four words off a longer clause can leave "are the"
    // hanging on the end, which reads as a sentence that was interrupted rather than as a label.
    while (out.length && STOP.test(out[out.length - 1])) out.pop();
    return out;
  };

  const own = phrase(inner.replace(/-?\d[\d,]*(\.\d+)?\s*(%|percent|pts?|points?|m\b|million|k\b|bn\b|KES|Ksh)?/gi, " "));
  if (own.length) return own.join(" ").slice(0, 34);

  const next = phrase(after);
  if (next.length >= 1) return next.join(" ").slice(0, 34);

  const prev = phrase(before, true);
  return prev.join(" ").slice(0, 34);
}

/* ----------------------------------------------------------- classification */

const IF_THEN = /\bif\b[^.]{4,140}?\b(then|trigger|escalate|activate|deploy|switch|move|revert|stop)\b/i;
const SEQUENCE = /\b(first|then|next|finally|step\s*\d|stage\s*\d|week\s*\d|day\s*\d)\b/i;
const PHASE = /\bphase\s*(−1|-1|0|1|2|3)\b/i;
const CONTRAST = /\b(not\s+\w[\w\s,'-]{2,60}?\s+but\b|rather than|instead of|as against|where\w* others|neither\b)/i;
const DATEY = /\b(20\d\d|january|february|march|april|may|june|july|august|september|october|november|december)\b/i;

/** Which relationship this part is actually about. Order matters: first match wins. */
function classify(sec) {
  const b = bullets(sec.body);
  const t = tables(sec.body);
  const f = figures(sec.body);
  const text = sec.body.join(" ");
  const labelled = b.filter((x) => x.label);
  const labels = labelled.map((x) => x.label.toLowerCase());

  const has = (...names) => names.every((n) => labels.some((l) => l.includes(n)));

  // Actual against target, written as a commitment. The handbook's bullet chart.
  if (has("baseline", "target")) return "bullet";
  if (has("baseline figure") || has("target figure")) return "bullet";

  // A build-up: register × turnout × share = votes. The most persuasive visual available.
  if (/×|\bmultiplied by\b/.test(text) && f.length >= 3) return "waterfall";

  // Risk registers and anything scored across two axes.
  if (t.length && t[0].header.some((h) => /likelihood/i.test(h)) && t[0].header.some((h) => /impact/i.test(h)))
    return "quadrant";

  // Dated or phased sequences. The labels themselves have to carry the time — a bullet list whose
  // bodies happen to mention 2019 is a list of facts, not a chronology, and drawing a time rail
  // under it asserts an order the document never claimed.
  const datedLabels = labelled.filter((x) => DATEY.test(x.label) || /^(week|day|month|phase|stage|q[1-4])\b/i.test(x.label));
  if (PHASE.test(text) || datedLabels.length >= 2) return "timeline";

  // Trigger -> response pairs. Either written as a two-column table whose first column asks the
  // question ("If the audit finds …" / "The strategy changes to …"), or as if/then bullets.
  if (t.length && t[0].header.length === 2 && /^if\b|^when\b|trigger/i.test(t[0].header[0]) && t[0].rows.length >= 2)
    return "playbook";
  if (IF_THEN.test(text) && b.length >= 2) return "playbook";

  // Ordered process — in bullets, or as the numbered spine of a text diagram.
  if (SEQUENCE.test(text) && b.length >= 3) return "stepper";
  if (fenceSteps(sec.body).length >= 2) return "stepper";

  /**
   * A table is already the figure.
   *
   * These parts were classified as "matrix" and drawn as a tap-to-open list of the table's own
   * rows — directly above the table itself, which InteractiveTable renders with search, sorting,
   * CSV export and a card layout on phones. Two readings of the same eight rows, one after the
   * other, is not coverage; it is the same thing said twice, and the handbook's rule is that a
   * visual must do a job nothing else on the page is already doing.
   *
   * So the table keeps the part, and nothing is drawn above it. A table whose shape says
   * something a table cannot — likelihood against impact, trigger against response — is still
   * lifted out, by the two rules above this one.
   */
  // Returns null, not "table". The spec was always rendered as nothing (PartVisual's `case
  // "table": return null`), so 37 of them were being derived, serialised into a 188 KB JSON file
  // and shipped to the browser in order to draw nothing. The intent was right and is unchanged —
  // the part's figure IS its own interactive table — so the heading simply carries no derived
  // figure and says so, instead of carrying an empty one.
  if (t.length && t[0].header.length >= 3 && t[0].rows.length >= 3) return null;

  // Shares of one whole.
  const pcts = f.filter((x) => x.pct && x.value > 0 && x.value <= 100);
  if (pcts.length >= 2) {
    const sum = pcts.slice(0, 4).reduce((s, x) => s + x.value, 0);
    if (sum > 88 && sum < 112) return "waffle";
  }
  if (pcts.length >= 1 && pcts.length <= 2 && f.length <= 3) return "donut";

  // Many comparable magnitudes.
  const mags = f.filter((x) => !x.pct && x.value >= 1);
  if (mags.length >= 4) return "bars";

  // A grouped set of definitions hanging off one idea used to become a "hub" here — the heading
  // in a circle with its own bullet list redrawn as spokes around it. It measures nothing: every
  // word in it is already in the list directly beneath. Where one of these genuinely wants a
  // figure (§3.3.4's four competencies, §6.2's four strategic pillars) it gets a purpose-built
  // one keyed on its section id, not a generic wheel derived from its punctuation.

  // Enumerated commitments, rules or conditions.
  if (b.length >= 4) return "checklist";

  // A handful of figures.
  if (f.length >= 2) return "stats";
  if (f.length === 1) return "gauge";

  // "Not X but Y", "rather than", "instead of" — a position on a line between two poles.
  const words = text.split(/\s+/).filter(Boolean).length;
  if (CONTRAST.test(text) && words < 420) return "contrast";

  /**
   * NOTHING. And this is the change that matters most in this file.
   *
   * There used to be four more rungs below this one — `chapter`, `quote`, `statement` and
   * `shape` — and between them they caught every heading the measuring rules had not. That was
   * the point: PR #10 promised "a figure under every heading", and a rule that must always
   * produce something will always produce something. It produced 99 of these, and none of them
   * measured anything:
   *
   *   statement (51)  re-typeset a sentence that is already in the prose immediately below it.
   *   chapter   (23)  a miniature contents list of the subsections the reader is about to
   *                   scroll through anyway, duplicating the chapter rail.
   *   hub       (11)  redrew the heading's own bullet list as a hub and spokes.
   *   quote      (6)  pulled a fragment out of the prose, truncated to fit — one of them ended
   *                   mid-sentence on "...the Office of the Registrar of Political Parties
   *                   issued a".
   *   shape      (8)  drew an abstract diagram from `nodes: []`. No data at all.
   *
   * A figure that restates its own caption costs the reader scroll and gives back nothing, and on
   * a document that is already 468,000 pixels tall that is not a neutral trade. So a heading whose
   * content carries no measurable relationship now gets NO figure, and the prose speaks for itself.
   * Coverage is not a virtue; a figure has to earn its place.
   */
  return null;
}

/* ------------------------------------------------------------------ payload */

const short = (s, n = 62) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…");
const titleNoNumber = (t) => t.replace(LEADING_NUMBER, "").trim();

function buildData(sec, kind) {
  const b = bullets(sec.body);
  const t = tables(sec.body);
  const f = figures(sec.body);
  const labelled = b.filter((x) => x.label);
  const paras = paragraphs(sec.body);

  const pick = (name) => {
    const hit = labelled.find((x) => x.label.toLowerCase().includes(name));
    return hit ? hit.value : null;
  };
  const firstNumber = (s) => {
    if (!s) return null;
    NUM.lastIndex = 0;
    const m = NUM.exec(s);
    return m ? parseFigure(m[1], m[2]) : null;
  };

  switch (kind) {
    case "bullet": {
      const baseline = firstNumber(pick("baseline"));
      const target = firstNumber(pick("target"));
      return {
        baselineLabel: short(pick("baseline") || "Baseline", 84),
        targetLabel: short(pick("target") || "Target", 84),
        baseline: baseline ? baseline.value : 0,
        target: target ? target.value : null,
        unit: target && target.pct ? "%" : "",
        deadline: pick("deadline") ? short(pick("deadline"), 58) : null,
        owner: pick("owner") ? short(pick("owner"), 58) : null,
        trigger: pick("trigger") ? short(pick("trigger"), 150) : null,
      };
    }
    case "waterfall":
      return {
        steps: f.slice(0, 5).map((x) => ({ label: short(x.label, 30), value: x.value, display: x.display })),
      };
    case "quadrant":
      return {
        items: (t[0]?.rows || []).slice(0, 10).map((r) => ({
          id: r[0],
          label: short(r[1] || r[0], 70),
          x: r.findIndex((c) => /likelihood/i.test(c)) >= 0 ? null : null,
          likelihood: r[2] || "",
          impact: r[3] || "",
          owner: r[4] || "",
        })),
      };
    case "timeline":
      return {
        events: (labelled.length ? labelled : b)
          .slice(0, 8)
          .map((x) => ({ label: short(x.label || x.value.split(/[.—–]/)[0], 40), body: short(x.value, 120) })),
      };
    case "playbook": {
      const twoCol = t.find((x) => x.header.length === 2 && x.rows.length >= 2);
      if (twoCol) {
        return {
          pairs: twoCol.rows.slice(0, 8).map((r) => ({ when: short(r[0], 110), then: short(r[1], 130) })),
          heads: twoCol.header.map((h) => short(h, 32)),
        };
      }
      return {
        pairs: b
          .slice(0, 8)
          .map((x) => {
            const m = (x.label ? `${x.label}: ${x.value}` : x.value).match(
              /if\s+([^,]{4,130}?),?\s*(?:then\s+)?((?:trigger|escalate|activate|deploy|switch|move|revert|stop)[^.]{0,130})/i
            );
            return m
              ? { when: short(m[1], 96), then: short(m[2], 110) }
              : { when: short(x.label || x.value.split(/[.—–]/)[0], 96), then: short(x.value, 110) };
          })
          .filter((p) => p.when),
      };
    }
    case "stepper": {
      const fenced = fenceSteps(sec.body);
      if (b.length < 2 && fenced.length >= 2) return { steps: fenced.slice(0, 8).map((x) => ({ ...x, label: short(x.label, 44) })) };
      return {
        steps: b.slice(0, 8).map((x, i) => ({
          n: i + 1,
          label: short(x.label || x.value.split(/[.—–:]/)[0], 44),
          body: short(x.value, 130),
        })),
      };
    }
    case "table":
      return { header: (t[0]?.header || []).slice(0, 6).map((h) => short(h, 24)), rows: (t[0]?.rows || []).length };
    case "matrix":
      return {
        header: (t[0]?.header || []).slice(0, 5).map((h) => short(h, 24)),
        rows: (t[0]?.rows || []).slice(0, 8).map((r) => r.slice(0, 5).map((c) => short(c, 46))),
      };
    case "waffle": {
      const pcts = f.filter((x) => x.pct && x.value > 0 && x.value <= 100).slice(0, 4);
      return { parts: pcts.map((x) => ({ label: short(x.label, 28), value: x.value })) };
    }
    case "donut": {
      const p = f.find((x) => x.pct);
      return {
        value: p ? p.value : 0,
        label: short(p ? p.label : titleNoNumber(sec.title), 40),
        rest: short(paras[0] || "", 110),
      };
    }
    case "bars":
      return {
        items: f
          .filter((x) => !x.pct && !x.long)
          .slice(0, 6)
          .map((x) => ({ label: short(x.label, 30), value: x.value, display: x.display })),
      };
    case "hub":
      return {
        centre: short(titleNoNumber(sec.title), 34),
        spokes: labelled.slice(0, 7).map((x) => ({ label: short(x.label, 40), body: short(x.value, 108) })),
      };
    case "checklist":
      return {
        items: b.slice(0, 8).map((x) => ({
          label: short(x.label || x.value.split(/[.—–:]/)[0], 46),
          body: x.label ? short(x.value, 112) : "",
        })),
      };
    case "stats":
      return {
        figures: f.filter((x) => !x.long).slice(0, 4).map((x) => ({
          label: short(x.label, 26),
          value: x.value,
          display: x.display,
          pct: x.pct,
        })),
      };
    case "gauge": {
      const one = f[0];
      return {
        value: one ? one.value : 0,
        display: one ? one.display : "",
        label: short(one ? one.label : titleNoNumber(sec.title), 40),
        pct: one ? one.pct : false,
        long: one ? one.long === true : true,
      };
    }
    case "chapter":
      return {
        lead: short(paras[0] || "", 150),
        // Filled in below, once every part is classified: the chapter's own parts and the
        // visual each of them carries.
        parts: [],
      };
    case "quote": {
      const qs = quotes(sec.body).filter((q) => q.length > 40);
      return { quote: short(qs[0] || "", 260), support: short(paras[0] || "", 130) };
    }
    case "contrast": {
      const src = paras.join(" ");
      const m = src.match(/\b(?:not|neither)\s+([\w][^,.;]{3,70}?)\s+(?:but|rather than|instead of|nor)\s+([^,.;]{3,70})/i)
        || src.match(/([^,.;]{4,70}?)\s+rather than\s+([^,.;]{4,70})/i)
        || src.match(/([^,.;]{4,70}?)\s+instead of\s+([^,.;]{4,70})/i);
      return {
        left: short(m ? m[1].trim() : "the assumption", 42),
        right: short(m ? m[2].trim() : "the finding", 42),
        lead: short(paras[0] || "", 170),
      };
    }
    case "statement":
      return {
        statement: short(paras[0] || titleNoNumber(sec.title), 190),
        support: short(paras[1] || "", 120),
        words: sec.body.join(" ").split(/\s+/).filter(Boolean).length,
      };
    default:
      return {
        lead: short(paras[0] || titleNoNumber(sec.title), 150),
        nodes: b.slice(0, 5).map((x) => short(x.label || x.value.split(/[.—–:]/)[0], 40)),
        words: sec.body.join(" ").split(/\s+/).filter(Boolean).length,
      };
  }
}

/* --------------------------------------------------------------------- main */

const sections = readSections();
const specs = {};
const dist = {};

/**
 * Would this figure be worth drawing?
 *
 * A derivation that comes back with one item, or with a label that is the tail of a word, has not
 * found a relationship — it has found noise, and drawing it anyway is how a site ends up with 272
 * charts that each say nothing. So every payload is checked before it is kept, and anything that
 * fails falls back to the part's own governing sentence, which always says something.
 */
const WORDY = /^[A-Za-z][A-Za-z0-9'’\u2013\u2014 -]{2,}$/;
const okLabel = (s) => typeof s === "string" && s.replace(/[^A-Za-z]/g, "").length >= 4;

function usable(kind, data) {
  const list = (v) => (Array.isArray(v) ? v : []);
  switch (kind) {
    // A stat rail built entirely out of numbers that were embedded in sentences is not a rail —
    // it is three sentences with their verbs removed. One clean figure is enough; none is not.
    case "stats": return list(data.figures).length >= 1 && list(data.figures).some((f) => !f.long);
    case "bars": return list(data.items).filter((i) => !i.long).length >= 2;
    case "waterfall": return list(data.steps).length >= 2;
    case "gauge": return okLabel(data.label) && data.long !== true;
    case "donut": return okLabel(data.label) && data.value > 0;
    case "waffle": {
      const parts = list(data.parts);
      const sum = parts.filter((p) => okLabel(p.label)).reduce((a, b) => a + b.value, 0);
      return parts.length >= 2 && sum > 85 && sum < 115;
    }
    case "stepper": return list(data.steps).length >= 2;
    case "timeline": return list(data.events).length >= 2;
    case "playbook": return list(data.pairs).length >= 2;
    case "checklist": return list(data.items).length >= 2;
    case "hub": return list(data.spokes).length >= 2;
    case "matrix": return list(data.rows).length >= 2 && list(data.header).length >= 2;
    // The figure is the table the prose already carries; there is nothing extra to draw.
    case "table": return typeof data.rows === "number" && data.rows >= 2;
    case "quadrant": return list(data.items).length >= 2;
    // A chapter door's parts are attached after every heading is classified, so there is nothing
    // to check yet. The pass that fills them demotes any door that turns out to have none.
    case "chapter": return true;
    case "quote": return typeof data.quote === "string" && data.quote.length >= 45;
    case "contrast": return WORDY.test(String(data.left)) && WORDY.test(String(data.right));
    case "bullet": return data.target !== null || data.baseline > 0;
    default: return true;
  }
}

/**
 * Drop the items that say nothing, and the ones that say it twice.
 *
 * Filtering rather than rejecting: one unreadable label in a list of six is a bad row, not a bad
 * figure, and throwing the whole figure away for it loses five good rows. What the gate below
 * then checks is whether enough survived to be worth drawing.
 */
function clean(kind, data) {
  const key = { bars: "items", stats: "figures", stepper: "steps", timeline: "events", checklist: "items", hub: "spokes", waterfall: "steps" }[kind];
  if (!key || !Array.isArray(data[key])) return data;
  const seen = new Set();
  data[key] = data[key].filter((x) => {
    if (!okLabel(x.label)) return false;
    const k = String(x.label ?? "").toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  if (kind === "stepper") data[key].forEach((x, i) => { x.n = i + 1; });
  return data;
}

/**
 * What to draw when the first choice does not survive the gate.
 *
 * A cascade rather than a cliff. "Demographic base / Total households / Vast land area" is read as
 * a timeline because each item is a labelled bullet carrying a year, and it plainly is not one —
 * but it is a perfectly good stat rail, and falling straight to a sentence would throw away four
 * figures the section is built on. Each rung is tried in turn and the first that passes is used.
 */
const FALLBACKS = ["stats", "checklist", "bars"];

/**
 * The cascade, which is now allowed to end in nothing.
 *
 * It used to end in `statement` unconditionally — a rung that always passes, so the cascade could
 * never fail and every heading got something. Now each rung must actually be usable, and when
 * none is, this returns null and the heading carries no figure. That is a real answer, and for
 * roughly a third of this document it is the correct one.
 */
function fallbackFor(sec, rejected) {
  for (const kind of FALLBACKS) {
    if (kind === rejected) continue;
    const data = clean(kind, buildData(sec, kind));
    if (usable(kind, data)) return { kind, data };
  }
  return null;
}

/**
 * The curated layer.
 *
 * Derivation gets 272 parts to a figure that is about their own content, which is the only way a
 * document this size gets covered honestly. It does not get every one of them to the RIGHT
 * figure: a rule that reads magnitudes cannot tell the clock on a radio show ("06:00-09:00") from
 * a quantity, and a rule that reads a labelled list cannot tell a maturity ladder from a set of
 * unrelated counts. Where the derivation reads a part wrongly, the correction is written by hand
 * in scripts/section-visual-overrides.json and wins. Naming the kind is enough — the payload is
 * rebuilt for it from the same prose — and `data` may override individual fields on top.
 *
 * The rule stays general. The exception stays visible, and stays in one file somebody can read.
 */
const OVERRIDES = (() => {
  const file = path.join(ROOT, "scripts", "section-visual-overrides.json");
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
})();

const ALL_IDS = new Set(sections.filter((s) => s.id).map((s) => s.id));
let figureless = 0;

for (const sec of sections) {
  if (!sec.id) continue;
  const over = OVERRIDES[sec.id];

  // An override of "none" is a curated judgement that this heading warrants no figure. Nine of
  // the twelve overrides in this file used to say "statement" instead, which was the only way to
  // express that before a heading was allowed to have nothing.
  if (over?.kind === "none") { figureless += 1; continue; }

  let kind = over?.kind ?? classify(sec);
  if (kind === null) { figureless += 1; continue; }

  let data = clean(kind, buildData(sec, kind));
  if (!over && !usable(kind, data)) {
    const fb = fallbackFor(sec, kind);
    if (!fb) { figureless += 1; continue; }
    ({ kind, data } = fb);
  }
  if (over?.data) data = { ...data, ...over.data };
  dist[kind] = (dist[kind] || 0) + 1;
  specs[sec.id] = {
    id: sec.id,
    tab: sec.tab,
    level: sec.level,
    number: sec.number,
    title: titleNoNumber(sec.title),
    kind,
    data,
  };
}

for (const [id, over] of Object.entries(OVERRIDES)) {
  // "none" is a curated decision that this heading carries no figure, so there is no spec to
  // validate — but the heading itself still has to exist, or the override is naming a ghost.
  if (over.kind === "none") {
    if (!ALL_IDS.has(id)) {
      console.error(`section-visuals: override names a heading that does not exist: ${id}`);
      process.exit(1);
    }
    continue;
  }
  if (!specs[id]) {
    console.error(`section-visuals: override names a heading that does not exist: ${id}`);
    process.exit(1);
  }
  // An override skips the quality gate by design — it is a human saying "this one, here". That
  // makes it the one place an empty figure can reach the page, so it is checked on its own.
  if (!usable(specs[id].kind, specs[id].data)) {
    console.error(`section-visuals: override for ${id} produces an empty "${over.kind}" figure.`);
    process.exit(1);
  }
}

if (process.argv.includes("--report")) {
  console.log(`sections with an id: ${ALL_IDS.size} / ${sections.length}`);
  console.log(`  with a figure:  ${Object.keys(specs).length}`);
  console.log(`  without one:    ${figureless}  (no measurable relationship in the content)`);
  for (const [k, v] of Object.entries(dist).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(10)} ${v}`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(specs, null, 1) + "\n");
console.log(
  `section-visuals: ${Object.keys(specs).length} specs written to data/section-visuals.generated.json ` +
  `(${figureless} headings carry no figure, by design)`
);
for (const [k, v] of Object.entries(dist).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(10)} ${v}`);
