/**
 * The one shape every figure in this audit draws from.
 *
 * WHY THIS EXTENDS data/types.ts RATHER THAN REPLACING IT. The repository already has a
 * provenance schema — `Source`, `Tier`, `Provenance`, `SourcedFigure` — and it is good: a tier
 * per source, a granularity per figure, a note where the source is partial, and a type system
 * that refuses a bare number where a sourced one belongs. Writing a second, parallel schema for
 * the same county's numbers would mean two places to correct a date and two answers to "where did
 * this come from", which is the exact failure this document's own Annex A is written against.
 *
 * So this adds the two things the figure layer needs and the existing schema does not carry:
 *
 *   KIND — how the number came to exist. A tier says who published it; it does not say whether
 *   the campaign measured it, derived it, modelled it or drew it as an illustration. Those want
 *   different marks on a chart: a modelled value is a range, an illustrative one is labelled as
 *   not real, and neither may be drawn as a precise measurement. Tier and kind are orthogonal and
 *   this document needs both — 605,703 is `reported` at Tier 3 in the prose and appears as
 *   `official` Tier 1 in a panel, which is conflict C-9 and is only expressible with both axes.
 *
 *   CONFLICTS — the ids from docs/visual-audit/CONFLICTS.md that bear on this value. A figure
 *   carrying one renders the Under review flag automatically, so a disputed number cannot be
 *   drawn silently. This is hard rule 2 made structural rather than remembered.
 */
import type { Granularity, Provenance, Source, Tier } from "../../data/types";

export type { Granularity, Provenance, Source, Tier };

/**
 * How a number came to exist. Drawn differently, every one of them.
 *
 *   official      a named public institution published it. Draw as a measurement.
 *   reported      media reported it; nobody official has confirmed it. Draw as a measurement,
 *                 label the tier.
 *   calculated    arithmetic this document performs on official figures — 532,758 x 61.7%. Draw as
 *                 a measurement, and show the working.
 *   modelled      the output of an assumption or a simulation. NEVER a point: a range, a band or
 *                 a category, labelled "Modelled".
 *   illustrative  a specimen. A mockup's copy, an example message. Labelled "Illustrative", and
 *                 never counted toward anything.
 */
export type FigureKind = "official" | "calculated" | "modelled" | "reported" | "illustrative";

export const KIND_LABEL: Record<FigureKind, string> = {
  official: "Official",
  reported: "Reported",
  calculated: "Calculated",
  modelled: "Modelled",
  illustrative: "Illustrative",
};

/** Kinds that must never be drawn as a precise measurement (Phase 7, and the handbook's rule). */
export const IMPRECISE_KINDS: ReadonlySet<FigureKind> = new Set<FigureKind>(["modelled", "illustrative"]);

export interface FigureValue<T = number> {
  value: T;
  /** "voters", "%", "pts", "KSh bn", "wards". Empty string for a bare count. */
  unit: string;
  source: Source;
  tier: Tier;
  /** ISO date, to whatever precision the source states. Never invented finer than the source. */
  asOf: string;
  kind: FigureKind;
  granularity?: Granularity;
  note?: string;
  /** Conflict ids from docs/visual-audit/CONFLICTS.md — e.g. ["C-9"]. */
  conflicts?: string[];
}

/** One labelled value in a series. */
export interface FigurePoint extends FigureValue {
  label: string;
  /** A modelled value's plausible interval. Required reading for `modelled` points. */
  range?: { low: number; high: number };
}

export interface FigureSeries {
  id: string;
  /**
   * The finding, stated as a sentence. Not "Registered voters by ward" — "Twelve of forty wards
   * hold 37.8% of the register". A headline that names the measure instead of the finding makes
   * the reader do the work the figure exists to do for them.
   */
  headline: string;
  /** What is measured, and in what units. The subtitle under the headline. */
  measure: string;
  points: FigurePoint[];
  /** Conflicts affecting the series as a whole, beyond any single point. */
  conflicts?: string[];
  note?: string;
}

/** Every distinct conflict id touching a series or any of its points. */
export function conflictsOf(series: FigureSeries): string[] {
  const ids = new Set(series.conflicts ?? []);
  for (const p of series.points) for (const c of p.conflicts ?? []) ids.add(c);
  return [...ids].sort();
}

/** The dominant tier of a series: the WEAKEST tier any of its points rests on. */
export function tierOf(series: FigureSeries): Tier {
  return series.points.reduce<Tier>((worst, p) => (p.tier > worst ? p.tier : worst), 1);
}

/**
 * The sources behind a series, deduplicated, in first-appearance order.
 *
 * A figure drawing on IEBC and KNBS must say both. Collapsing to "various" is how a source line
 * stops being a source line.
 */
export function sourcesOf(series: FigureSeries): Source[] {
  const seen = new Map<string, Source>();
  for (const p of series.points) if (!seen.has(p.source.name)) seen.set(p.source.name, p.source);
  return [...seen.values()];
}

/** True when any point may not be drawn as a precise measurement. */
export function isImprecise(series: FigureSeries): boolean {
  return series.points.some((p) => IMPRECISE_KINDS.has(p.kind));
}
