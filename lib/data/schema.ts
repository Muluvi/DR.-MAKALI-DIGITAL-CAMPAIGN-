/**
 * The single data layer's shape (brief §O).
 *
 * Every number the proposal prints, in prose, chart, tile or table, is a Figure with an id. Prose
 * reaches it through a `{{id}}` token in content/*.md, which scripts/build-content.ts resolves
 * into public/content/*.md at build. A figure is one of four kinds of thing, and `state` says which:
 *
 *   sourced   read off a named document. Carries a source and a tier.
 *   modelled  computed or estimated by Firefly. Carries a note saying how, and is drawn hatched.
 *   needed    not in hand. `value` is null and `closesWith` names the document that would close it.
 *   target    a number Firefly or the campaign commits to, not evidence about the world. No tier.
 *
 * scripts/check-figures.ts enforces the rules each state implies, and fails the build on a breach.
 */

export type Tier = "T1" | "T2" | "T3";

export type FigureState = "sourced" | "modelled" | "needed" | "target";

export type Unit =
  | "voters"
  | "votes"
  | "people"
  | "households"
  | "count"
  | "percent"
  | "ksh"
  | "km2"
  | "per-km2"
  | "persons";

/** A second published value for the same quantity, kept because the sources disagree. */
export interface AltValue {
  value: number;
  source: string;
  tier: Tier;
  note?: string;
}

export interface Figure {
  id: string;
  /** Null only when state is "needed". */
  value: number | null;
  unit: Unit;
  /** Required for sourced and modelled figures; null for targets and for needed figures. */
  tier: Tier | null;
  state: FigureState;
  /** The document it was read from. Null only for a needed figure. */
  source: string | null;
  /** How a modelled figure was computed, or what a target commits to. Required for both. */
  note?: string;
  /** Decimal places when printed. Defaults to 0, or 1 for percentages. */
  decimals?: number;
  /** A disputed figure's other published value. Must differ from `value`. */
  alt?: AltValue;
  /** For a needed figure: the existing document that would close the gap. */
  closesWith?: string;
  /** As-of date of the underlying measurement, where the source gives one. */
  asOf?: string;
}
