/**
 * The team's edits to the data pack, applied where the data is defined.
 *
 * Dr. Mulu's team edits data on the site (/team/data), not in GitHub. The editor writes its
 * changes to two overlay files, data/team/figures.json and data/team/lists.json, and commits them
 * through the gated edit branch (docs/ownership-2026-11). The original records stay exactly where
 * they are, in the file that defines them; the overlay changes fields and adds records, and never
 * removes one. Every reader of the data (prose tokens, charts, CSVs, the explorer, the analysis
 * export) sees the edited values because they are applied here, at definition.
 */
import figureEdits from "../../data/team/figures.json" with { type: "json" };
import listEdits from "../../data/team/lists.json" with { type: "json" };
import type { Figure } from "./schema";

export interface FigureEdits {
  patches: Record<string, Partial<Figure>>;
  added: Figure[];
}
export interface ListEdit {
  patches: Record<string, Record<string, unknown>>;
  added: Record<string, unknown>[];
}

export const FIGURE_EDITS = figureEdits as unknown as FigureEdits;
export const LIST_EDITS = (listEdits as unknown as { lists: Record<string, ListEdit> }).lists;

/** A figure as the team has edited it (or unchanged). The id can never be patched. */
export function patchFigure(f: Figure): Figure {
  const p = FIGURE_EDITS.patches[f.id];
  return p ? { ...f, ...p, id: f.id } : f;
}

/**
 * A structured list as the team has edited it. `key` names the field that identifies a record
 * (a KPI's code, a risk's code, a segment's id). Patches merge into the record with that key;
 * added records follow the originals, in the order they were added.
 */
export function withTeamEdits<T extends object>(list: string, key: keyof T, records: T[]): T[] {
  const e = LIST_EDITS[list];
  if (!e) return records;
  const out = records.map((r) => {
    const p = e.patches[String(r[key])];
    return p ? ({ ...r, ...p, [key]: r[key] } as T) : r;
  });
  for (const a of e.added ?? []) out.push(a as T);
  return out;
}
