/**
 * The ```visual fence: text the proposal writes as prose, laid out as the shape it already has
 * (brief 2026-10 declutter, sections 4 and 5.2).
 *
 * In content/*.md a visual fence is YAML. scripts/build-content.ts resolves its {{tokens}}, parses
 * it, checks it against the shapes below and writes it to public/content as JSON, so the page never
 * ships a YAML parser. Every string is the document's own markdown, moved verbatim: the fence
 * REPLACES the bullets it was built from, so the words are still in the source and the conservation
 * check counts them there.
 *
 * What a reader sees on load and what sits behind a disclosure is fixed per kind, and visibleWords
 * counts the first: card titles and headlines show, card fields fold; every tab label shows, the
 * first tab's panel shows; a step's label and short text show, its body folds.
 */

export type Text = string;

/** A labelled field: "Baseline: set in Week 1…". */
export interface Field { label: string; text: Text }

/** One entry of a list-shaped visual: a card, a tab, a step, an event, a checklist row. */
export interface Item {
  /** The bold line. */
  label?: string;
  /** Cards and tabs use `title`; every other kind uses `label`. Either is accepted. */
  title?: string;
  /** A short visible line under the label (12 words or so). */
  text?: Text;
  /** A visible headline field: "Target: …". */
  head?: Field;
  /** Visible chips: indicator codes, owners, status. */
  chips?: string[];
  /** A visible marker set on a card: "campaign-owned", "largest unknown". */
  badge?: string;
  /** A tier, shown as a badge: 1, 2, 3, "modelled", "not yet tiered". */
  tier?: number | string;
  /** For stats: the value, as resolved text ("605,703", "51.7%"). */
  value?: string;
  /** For stats: a one-line caption under the label. */
  caption?: Text;
  /** Behind the item's disclosure: the remaining fields, moved verbatim. */
  fields?: Field[];
  /** Behind the item's disclosure: free markdown, moved verbatim. */
  body?: Text;
  /** A `[CONFLICT Cn: see open items]` marker that belongs to this item. */
  conflict?: string;
  /** For timelines: when. */
  when?: string;
  /** For weeks: the day. */
  day?: string;
  /** For weeks and nested sets: the entries. */
  items?: Item[];
}

export interface Side { title: string; items: Item[] }

export interface VisualSpec {
  kind: VisualKind;
  /** An anchor id, unique on the page. */
  id?: string;
  /** The finding the visual states (the FigureFrame contract). */
  title?: Text;
  /** One visible line under the title. */
  note?: Text;
  /** Where the numbers come from, with tier and date, when the visual carries numbers. */
  source?: Text;
  /** Layout variant within a kind ("objective", "candidate", "proof"). */
  preset?: string;
  items?: Item[];
  /** inout */
  in?: Item[];
  out?: Item[];
  /** contrast */
  left?: Side;
  right?: Side;
  /** hypothesis */
  hypothesis?: Text;
  for?: Text;
  against?: Text;
  test?: Text;
  /** qa */
  attack?: Text;
  answer?: Text;
  /** Behind a disclosure under the whole visual. */
  body?: Text;
  /** crosswalk and matrix */
  columns?: string[];
  rows?: { cells: Text[]; body?: Text }[];
}

const VISUAL_KINDS = [
  "stats",
  "cards",
  "tabs",
  "timeline",
  "stepper",
  "checklist",
  "inout",
  "contrast",
  "hypothesis",
  "qa",
  "crosswalk",
  "nested",
  "week",
  "matrix",
  "bars",
  "donut",
] as const;
export type VisualKind = (typeof VISUAL_KINDS)[number];

/** Problems with a spec, as sentences. An empty list means it renders. */
export function validateVisual(spec: unknown): string[] {
  const errors: string[] = [];
  if (!spec || typeof spec !== "object") return ["the fence is not a mapping"];
  const s = spec as VisualSpec;
  if (!VISUAL_KINDS.includes(s.kind)) return [`unknown kind "${String(s.kind)}"`];
  const needItems = ["stats", "cards", "tabs", "timeline", "stepper", "checklist", "nested", "week", "bars", "donut"];
  if (needItems.includes(s.kind) && !(Array.isArray(s.items) && s.items.length)) errors.push(`${s.kind} needs items`);
  if (Array.isArray(s.items)) {
    s.items.forEach((it, i) => {
      if (!it || typeof it !== "object") errors.push(`item ${i + 1} is not a mapping`);
      else if (!(it.label || it.title || it.day || it.value || it.head)) errors.push(`item ${i + 1} has no label, title or headline`);
      if (it && (s.kind === "bars" || s.kind === "donut") && !Number.isFinite(numberOf(it.value))) errors.push(`item ${i + 1} has no numeric value`);
      if (it && s.kind === "stats" && !it.value) errors.push(`item ${i + 1} has no value`);
    });
  }
  if (s.kind === "inout" && !(Array.isArray(s.in) || Array.isArray(s.out))) errors.push("inout needs in or out");
  if (s.kind === "contrast" && !(s.left && s.right)) errors.push("contrast needs left and right");
  if (s.kind === "hypothesis" && !(s.hypothesis && s.test)) errors.push("hypothesis needs hypothesis and test");
  if (s.kind === "qa" && !(s.attack && s.answer)) errors.push("qa needs attack and answer");
  if ((s.kind === "crosswalk" || s.kind === "matrix") && !(Array.isArray(s.columns) && Array.isArray(s.rows) && s.rows.length)) {
    errors.push(`${s.kind} needs columns and rows`);
  }
  return errors;
}

/** The number in a resolved value string: "605,703" → 605703, "51.7%" → 51.7, "KES 13.79bn" → 13.79. */
export function numberOf(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return NaN;
  const m = /-?\d[\d,]*(?:\.\d+)?/.exec(value);
  return m ? Number(m[0].replace(/,/g, "")) : NaN;
}





