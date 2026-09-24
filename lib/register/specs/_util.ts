/**
 * Helpers every spec uses to read the data layer. A spec never types a number: it names a figure
 * and these return its value, its printed form, or its source as a tier-pilled reference.
 */
import { FIGURES } from "../../data/figures.ts";
import { formatFigure, type FormatMod } from "../../data/format.ts";
import type { Figure } from "../../data/schema.ts";
import type { Bar, CellState, SourceRef } from "../types.ts";

export function F(id: string): Figure {
  const f = FIGURES[id];
  if (!f) throw new Error(`register spec: unknown figure ${id}`);
  return f;
}

/** The value, or null for a named gap. */
export const val = (id: string): number | null => F(id).value;

/** The value, required: a spec that cannot draw without it fails the build. */
export function num(id: string): number {
  const v = F(id).value;
  if (v === null) throw new Error(`register spec: ${id} has no value`);
  return v;
}

export const fmt = (id: string, mod: FormatMod = ""): string => formatFigure(F(id), mod);

/** The source of a figure as the frame's source line prints it. */
export function src(id: string, name?: string): SourceRef {
  const f = F(id);
  return { name: name ?? f.source ?? `[DATA NEEDED — ${f.closesWith ?? "source"}]`, tier: f.tier, state: f.state === "sourced" ? undefined : f.state };
}

export const stateOf = (id: string): CellState => F(id).state;

/** A bar read straight off a figure. */
export function bar(id: string, label: string, extra: Partial<Bar> = {}): Bar {
  const f = F(id);
  return { label, value: f.value, state: f.state, ...extra };
}

/** Sort bars by value, largest first (brief §M: sort unless the order is the point). */
export const byValue = (bars: Bar[]): Bar[] => [...bars].sort((a, b) => (b.value ?? -1) - (a.value ?? -1));

/** The live deep link to a numbered section: "3.4" -> "/analysis#analysis-sec-3-4". */
export function secHref(num: string): string {
  const ws: Record<string, string> = { "5.2.1": "workstreams-platforms", "5.2.2": "workstreams-media", "5.2.3": "workstreams-ground", "5.2.4": "workstreams-data" };
  const top: Record<string, string> = { "1": "objectives", "2": "data", "3": "analysis", "4": "strategy", "6": "nextsteps" };
  const parts = num.split(".");
  let tab = top[parts[0]];
  if (parts[0] === "5") {
    const key = parts.slice(0, 3).join(".");
    tab = ws[key] ?? (parts[1] === "1" || parts[1] === "2" ? "implementation" : "delivery");
  }
  if (!tab) throw new Error(`secHref: no route for ${num}`);
  return `/${tab}#${tab}-sec-${parts.join("-")}`;
}
