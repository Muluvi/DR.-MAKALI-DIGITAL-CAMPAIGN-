"use client";

import { useMemo, useState } from "react";
import { ALL_WARDS, COUNTY_TOTAL_WARDS } from "../../data/ward-register";
import { BarRows, type Mark } from "./primitives";

/**
 * Every ward, ranked by register size — the 40 wards, ranked, and the 12 that carry most section.
 *
 * This replaces WardRegisterTicker, which scrolled the same figures past the reader at 36px/s.
 * A ticker is on the pre-judged reject list for content that matters (docs/TRIAGE.md §5.3), and
 * of everything in this document the IEBC ward register is the most checkable dataset and the
 * one an economist is most likely to want to stop on. Rank order is the argument here, so it has
 * to hold still long enough to be read.
 *
 * The section already prints all 40 rows as a table, and that table stays — nothing is removed
 * (the mandate section, the substitution rule). What the chart adds is the shape the table cannot show at a
 * glance: how steeply the register concentrates, and where the cumulative line crosses.
 *
 * Every figure comes from data/ward-register.json, sourced to IEBC's "Registered Voters per
 * County Assembly Ward" and checked on every build by scripts/verify-ward-register.mjs. Nothing
 * here is a literal: the count, the ranking, the cumulative total and every share are derived
 * from that register, so they cannot drift from it.
 *
 * `COUNTY_TOTAL_WARDS` is the register total across wards (532,758), not a count of wards — the
 * ward count is `ranked.length`.
 */
const TOP_BLOC = 12;

export function WardRankedBars() {
  const [showAll, setShowAll] = useState(false);

  const ranked = useMemo(
    () => [...ALL_WARDS].sort((a, b) => b.voters - a.voters),
    []
  );

  const cumulativeTop = useMemo(
    () => ranked.slice(0, TOP_BLOC).reduce((sum, w) => sum + w.voters, 0),
    [ranked]
  );

  const marks: Mark[] = useMemo(
    () =>
      ranked.map((w, i) => {
        const share = (w.voters / COUNTY_TOTAL_WARDS) * 100;
        return {
          id: w.name,
          label: `${i + 1}. ${w.name}`,
          value: w.voters,
          display: w.voters.toLocaleString(),
          sub: `${share.toFixed(2)}% of the county register`,
          note: `${w.constituencyName} constituency.`,
          color: i < TOP_BLOC ? "var(--color-accent-solid)" : "var(--color-muted)",
        };
      }),
    [ranked]
  );

  const shown = showAll ? marks : marks.slice(0, TOP_BLOC);
  const topShare = (cumulativeTop / COUNTY_TOTAL_WARDS) * 100;

  return (
    <figure className="not-prose my-6 rounded-2xl border border-line bg-card p-4 sm:p-5">
      <figcaption className="mb-3">
        <h4 className="font-serif text-sm font-bold text-ink">
          The {ranked.length} wards, ranked by register size
        </h4>
        <p className="t-micro text-muted font-semibold mt-0.5">
          The first {TOP_BLOC} wards hold{" "}
          <strong className="text-accent">{cumulativeTop.toLocaleString()}</strong> registered
          voters — <strong className="text-accent">{topShare.toFixed(2)}%</strong> of the county
          register, from{" "}
          {Math.round((TOP_BLOC / ranked.length) * 100)}% of the wards. That concentration is the
          reason the targeting model works ward by ward rather than constituency by constituency.
        </p>
      </figcaption>

      <BarRows
        marks={shown}
        max={ranked[0]?.voters}
        listCaption={`All ${ranked.length} wards, with registered voters`}
        emptyHint="Select a ward for its share of the register and its constituency."
      />

      <button
        type="button"
        onClick={() => setShowAll((v) => !v)}
        className="fx-press fx-focus mt-3 t-micro font-bold text-accent"
      >
        {showAll
          ? `Show the leading ${TOP_BLOC} only`
          : `Show all ${ranked.length} wards, ranked`}
      </button>

      <p className="t-micro text-muted font-semibold mt-2">
        Source: IEBC, Registered Voters per County Assembly Ward (2022). Tier 1, ward-level.
      </p>
    </figure>
  );
}

export default WardRankedBars;
