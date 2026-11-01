/**
 * The bridge from the registry (lib/data/figures.ts) to a legacy figure point.
 *
 * A legacy figure (lib/figures/*.ts, drawn by components/figures/registry.tsx) used to carry its
 * own copy of every number. This turns a registry id into a FigurePoint instead, so the value, the
 * tier, the source and the as-of date all come from the one record a refresh updates.
 */
import { figure } from "../data/figures";
import { formatFigure, type FormatMod } from "../data/format";
import type { FigureKind, FigurePoint, Granularity, Tier } from "./types";

const TIER_NUMBER = { T1: 1, T2: 2, T3: 3 } as const;

/** The printed form of a registry figure, as prose prints it: "447,007". */
export const regFmt = (id: string, mod: FormatMod = ""): string => formatFigure(figure(id), mod);

/** The registry value, required. */
export function regNum(id: string): number {
  const v = figure(id).value;
  if (v === null) throw new Error(`legacy figure: ${id} has no value`);
  return v;
}

/** A registry figure as a legacy point. Modelled and target figures are drawn hatched (imprecise). */
export function regPoint(id: string, label: string, extra: { note?: string; granularity?: Granularity; unit?: string } = {}): FigurePoint {
  const f = figure(id);
  if (f.value === null) throw new Error(`legacy figure: ${id} has no value`);
  const kind: FigureKind = f.state === "sourced" ? "official" : f.state === "modelled" ? "modelled" : "illustrative";
  const tier: Tier = f.tier ? TIER_NUMBER[f.tier] : 3;
  return {
    label,
    value: f.value,
    unit: extra.unit ?? f.unit,
    source: { name: f.source ?? "This proposal", publicationDate: f.asOf ?? "2026", tier },
    tier,
    asOf: f.asOf ?? "2026",
    kind,
    granularity: extra.granularity ?? "county",
    note: extra.note ?? f.note,
  };
}
