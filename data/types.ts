// Canonical provenance schema for every factual figure introduced or re-cited by the 2026
// research pass. This is the spine of the document's source discipline: a figure without a
// Provenance cannot be rendered by any of the new data-driven blocks, because the type
// system will not let a component accept a bare number where a SourcedFigure is expected.
//
// Scope note (read before adding a file here): this schema governs the NEW factual content
// this pass adds — the ward register, the disputed figures, electoral history, fiscal/audit
// record, drought and food security, Mui Basin, the nomination path, the spending ceiling,
// the competitor field, media ownership, and the data-gaps register. It does not retrofit the
// pre-existing prose in public/content/*.md or the illustrative UI widgets in
// components/StrategicAids.tsx — see the PR description for why that is out of scope for this
// pass rather than silently incomplete.

/**
 * Tier 1 — OFFICIAL: a named public institution (IEBC, KNBS, Controller of Budget,
 * Auditor-General, NDMA, Communications Authority, Kenya Law / courts, Kenya Gazette, county
 * government).
 * Tier 2 — REPORTED: established media, not officially confirmed.
 * Tier 3 — SINGLE-SOURCE / PARTISAN: one local or partisan digital outlet only. Must always
 * render with a visible "unconfirmed" marker.
 */
export type Tier = 1 | 2 | 3;

// `label` and `short` are both rendered as visible text by TierBadge (never hover-only) — Tier
// 3's must say "Unconfirmed" outright, per the source-discipline rule that a Tier 3 claim is
// never shown without a visible unconfirmed marker.
export const TIER_META: Record<Tier, { label: string; short: string; description: string }> = {
  1: { label: "Official", short: "T1", description: "Named public institution — IEBC, KNBS, Controller of Budget, Auditor-General, NDMA, Communications Authority, Kenya Law, Kenya Gazette, county government." },
  2: { label: "Reported", short: "T2", description: "Established media, not officially confirmed." },
  3: { label: "Unconfirmed (single-source)", short: "T3 Unconfirmed", description: "One local or partisan digital outlet only — unconfirmed." },
};

/** Geographic granularity a figure was measured or reported at. Never conflate these. */
export type Granularity = "national" | "county" | "constituency" | "ward";

export const GRANULARITY_LABEL: Record<Granularity, string> = {
  national: "National",
  county: "County",
  constituency: "Constituency",
  ward: "Ward",
};

export interface Source {
  name: string;
  /**
   * Optional because a handful of figures supplied by the research pass named an outlet
   * (e.g. "The Star") without a specific article URL. Omitting the field rather than
   * inventing a link is deliberate — see `note` on the owning Provenance/DisputedValue for
   * what is missing and the Data Gaps Register (Section: Appendix C) for the acquisition
   * route. Never fabricate a URL to fill this in.
   */
  url?: string;
  /**
   * ISO date where the source gives one (YYYY-MM-DD). Falls back to YYYY-MM or YYYY when the
   * source only supplies month or year precision — never invented to a finer grain than the
   * source actually states.
   */
  publicationDate: string;
  tier: Tier;
}

export interface Provenance {
  source: Source;
  granularity: Granularity;
  /** Free-text caveat — e.g. "county total, not a ward breakdown" — shown beneath the figure. */
  note?: string;
}

export interface SourcedFigure<T = number> {
  label: string;
  value: T;
  unit: string;
  provenance: Provenance;
}

export interface DisputedValue<T = number> {
  value: T;
  unit: string;
  source: Source;
  granularity: Granularity;
}

export interface DisputedFigureEntry<T = number> {
  id: string;
  label: string;
  /** Every value in the dispute, shown side by side. Never averaged, never dropped. */
  values: [DisputedValue<T>, DisputedValue<T>, ...DisputedValue<T>[]];
  /** Index into `values` this document treats as preferred, if any. */
  preferredIndex?: number;
  /** Required whenever `preferredIndex` is set — the reasoning must be visible, not implied. */
  preferenceReason?: string;
  /** What confirmation would require — shown even when a preference is stated. */
  resolutionPath: string;
  status: "resolved-preferred" | "unresolved";
}
