"use client";

import React, { useState } from "react";
import { Target, MapPin, TrendingDown, AlertTriangle, Radio } from "lucide-react";

import { ALL_WARDS, CONSTITUENCIES, COUNTY_TOTAL_WARDS, MWINGI_BLOC_TOTAL } from "../../data/ward-register";
import { TierBadge } from "./TierBadge";
import { UnderReview } from "../figures/UnderReview";

/**
 * §3.4 — recognition deficit mapped against voter concentration.
 *
 * WHAT THIS DELIBERATELY DOES NOT SHOW: ward-level polling. No ward-level poll of this race
 * exists. Only two countywide Mizani data points are available (§2.2), and §3.10 lists
 * ward-level recognition data as a named Tier 1 gap. An earlier version of this component
 * carried per-ward `muluPollingBaseline` / `kasaluPollingBaseline` percentages; they were
 * invented, and they are gone.
 *
 * What replaces them is what §3.4 actually asserts: a STRUCTURAL recognition status per
 * constituency — home anchor, neighbouring belt, or critical deficit — derived from where
 * Dr. Mulu has held office, not from any survey. The ward list is the top 12 by register,
 * computed from data/ward-register.json rather than typed in; §3.4's own table is that same
 * top 12, so the two cannot drift apart.
 */

type RecognitionStatus = "anchor" | "belt" | "moderate" | "deficit";

/**
 * FOUR grades, not three, because §3.4's cross-match table used four.
 *
 * The block this panel retired distinguished MODERATE/HIGH (Neighboring belt) — Mutonguni and
 * Kauwi in Kitui West — from a plain MODERATE (University/Peri-urban) for Kwa Vonza/Yatta in
 * Kitui Rural. An earlier version of this panel called both of them "Neighbouring belt", which
 * would have made the retirement a quiet loss of a distinction the document drew deliberately:
 * Kwa Vonza/Yatta's recall is a campus-town effect, not a border effect.
 */
const STATUS_META: Record<RecognitionStatus, { label: string; note: string; className: string; dot: string }> = {
  anchor: {
    label: "Home anchor",
    note: "13 consecutive years as MP. High brand saturation.",
    className: "border-emerald-500/25 bg-emerald-500/[0.04]",
    dot: "bg-emerald-500",
  },
  belt: {
    label: "Moderate / high",
    note: "Neighbouring belt — contiguous with the home constituency.",
    className: "border-lime-600/25 bg-lime-600/[0.04]",
    dot: "bg-lime-600",
  },
  moderate: {
    label: "Moderate",
    note: "University and peri-urban population, not a border effect.",
    className: "border-amber-500/25 bg-amber-500/[0.04]",
    dot: "bg-amber-500",
  },
  deficit: {
    label: "Critical deficit",
    note: "Out-of-constituency. Recall limited against countywide office holders.",
    className: "border-rose-500/25 bg-rose-500/[0.04]",
    dot: "bg-rose-500",
  },
};

/** Per §3.4: the anchor is Kitui Central, Kitui West is the neighbouring belt and Kitui Rural
 *  the peri-urban moderate; Mwingi (all three), Kitui South and Kitui East are the deficit zones. */
const STATUS_BY_CONSTITUENCY: Record<string, RecognitionStatus> = {
  "kitui-central": "anchor",
  "kitui-west": "belt",
  "kitui-rural": "moderate",
  "mwingi-north": "deficit",
  "mwingi-central": "deficit",
  "mwingi-west": "deficit",
  "kitui-south": "deficit",
  "kitui-east": "deficit",
};

/**
 * The qualifier §3.4 printed against each ward, where it printed one more specific than its
 * constituency's.
 *
 * Tseikuru and Kyuso are both Mwingi North and both critical deficits, and the table gave them
 * different reasons — Tseikuru is the party's own base in the north, Kyuso simply out of
 * constituency. A grade per constituency cannot carry that, so the ward carries it.
 */
const WARD_QUALIFIER: Record<string, string> = {
  Kyuso: "Out-of-constituency.",
  Tseikuru: "Party base, north.",
  Mumoni: "Out-of-constituency.",
  Athi: "Deep south belt.",
  "Ikanga/Kyatune": "Deep south belt.",
};

const KITUI_SOUTH_TOTAL = CONSTITUENCIES.find((c) => c.id === "kitui-south")?.voters ?? 0;

/** §3.4's "Total Decisive Deficit Pool" — Mwingi bloc plus Kitui South, both from the register. */
const DEFICIT_POOL = MWINGI_BLOC_TOTAL + KITUI_SOUTH_TOTAL;
const DEFICIT_POOL_SHARE = (DEFICIT_POOL / COUNTY_TOTAL_WARDS) * 100;

const DECISIVE_WARDS = [...ALL_WARDS]
  .sort((a, b) => b.voters - a.voters)
  .slice(0, 12)
  .map((w, i) => ({ ...w, rank: i + 1, status: STATUS_BY_CONSTITUENCY[w.constituencyId] ?? "deficit" }));

const DEFICIT_IN_TOP_8 = DECISIVE_WARDS.filter((w) => w.rank <= 8 && w.status === "deficit");
const DEFICIT_IN_TOP_8_VOTERS = DEFICIT_IN_TOP_8.reduce((sum, w) => sum + w.voters, 0);

/**
 * The overlap §3.4 actually claimed, which is not the one §3.10 summarised.
 *
 * The retired cross-match block closed on "5 of the Top 11 Wards (Kyuso, Tseikuru, Mumoni, Athi,
 * Ikanga) … 83,496 Voters", and against the register that is exactly right. The §3.10 summary
 * table says "5 of top 8", which is not: Ikanga/Kyatune ranks 11th. Both windows are computed here
 * so the panel can show where the two claims part company instead of picking one — C-5.
 */
const DEFICIT_IN_TOP_11 = DECISIVE_WARDS.filter((w) => w.rank <= 11 && w.status === "deficit");
const DEFICIT_IN_TOP_11_VOTERS = DEFICIT_IN_TOP_11.reduce((sum, w) => sum + w.voters, 0);

const fmt = (n: number) => n.toLocaleString("en-KE");

export function RecognitionDeficitOverlay() {
  const [filterMode, setFilterMode] = useState<"all" | "deficitOnly">("all");
  const displayed = filterMode === "all" ? DECISIVE_WARDS : DECISIVE_WARDS.filter((w) => w.status === "deficit");
  const deficitCount = DECISIVE_WARDS.filter((w) => w.status === "deficit").length;

  return (
    <div className="my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Target size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="t-label font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded">
                Recognition deficit
              </span>
              <TierBadge tier={1} compact />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-ink mt-1">
              The decisive wards are the deficit wards
            </h3>
          </div>
        </div>

        <div className="flex items-center p-1 bg-paper border border-line rounded-xl shrink-0" role="group" aria-label="Filter wards">
          <button
            onClick={() => setFilterMode("all")}
            aria-pressed={filterMode === "all"}
            className={`px-3 py-1.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg t-small font-bold transition-colors cursor-pointer ${
 filterMode === "all" ? "bg-accent-solid text-on-accent" : "text-muted hover:text-ink"
            }`}
          >
            Top 12
          </button>
          <button
            onClick={() => setFilterMode("deficitOnly")}
            aria-pressed={filterMode === "deficitOnly"}
            className={`px-3 py-1.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg t-small font-bold transition-colors cursor-pointer ${
 filterMode === "deficitOnly" ? "bg-accent-solid text-on-accent" : "text-muted hover:text-ink"
            }`}
          >
            Deficit only ({deficitCount})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line border-b border-line bg-card">
        <div className="p-3.5 sm:p-4">
          <div className="t-label font-black text-muted">Decisive deficit pool</div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-ink mt-0.5 tabular-nums">
            {fmt(DEFICIT_POOL)}
          </div>
          <div className="t-small text-muted mt-0.5 tabular-nums">
            {DEFICIT_POOL_SHARE.toFixed(2)}% of the county register
          </div>
        </div>
        <div className="p-3.5 sm:p-4">
          <div className="t-label font-black text-muted">Countywide polling deficit</div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5 tabular-nums">
            −15.3 points
          </div>
          <div className="t-small text-muted mt-0.5">Kasalu 37.4%, Mulu 22.1%</div>
        </div>
        <div className="p-3.5 sm:p-4">
          <div className="t-label font-black text-muted">Phase −1 geofenced spend</div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-accent mt-0.5 tabular-nums">65%</div>
          <div className="t-small text-muted mt-0.5">Mwingi (all three) + Kitui South</div>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2">
        {displayed.map((w) => {
          const meta = STATUS_META[w.status];
          const share = (w.voters / COUNTY_TOTAL_WARDS) * 100;
          return (
            <div key={`${w.constituencyId}-${w.name}`} className={`p-3 sm:p-3.5 rounded-xl border ${meta.className}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="font-mono t-small font-bold text-muted tabular-nums pt-0.5 shrink-0 w-5">
                    {w.rank}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-ink truncate">{w.name}</div>
                    <div className="t-small text-muted flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="shrink-0" aria-hidden="true" />
                      <span className="truncate">{w.constituencyName}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-ink tabular-nums">{fmt(w.voters)}</div>
                  <div className="t-label text-muted tabular-nums">{share.toFixed(2)}% of register</div>
                </div>
              </div>
              <div className="flex items-start gap-1.5 mt-2.5 pt-2.5 border-t border-line/40">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${meta.dot}`} aria-hidden="true" />
                <span className="t-label font-black text-ink shrink-0">{meta.label}</span>
                {/* No truncation on the qualifier: it is the reason, and §3.4 gave a different one
                    to two wards in the same constituency. Clipping it would erase the distinction. */}
                <span className="t-label text-muted">
                  — {WARD_QUALIFIER[w.name] ? `${WARD_QUALIFIER[w.name]} ` : ""}
                  {meta.note}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 bg-paper/60 border-t border-line space-y-2">
        <p className="t-small text-muted font-medium flex items-start gap-1.5">
          <TrendingDown size={12} className="text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            {DEFICIT_IN_TOP_8.length} of the top 8 wards countywide —{" "}
            {DEFICIT_IN_TOP_8.map((w) => w.name).join(", ")} — sit in the deepest recognition deficit territory,{" "}
            <span className="tabular-nums">{fmt(DEFICIT_IN_TOP_8_VOTERS)}</span> voters between them. Widen the window
            by three places and it is{" "}
            <strong className="font-semibold text-ink">
              {DEFICIT_IN_TOP_11.length} of the top 11 — {DEFICIT_IN_TOP_11.map((w) => w.name).join(", ")}
            </strong>
            , <span className="tabular-nums">{fmt(DEFICIT_IN_TOP_11_VOTERS)}</span> voters. Either way, the wards that
            decide the election are the wards where Dr. Mulu is least known.
          </span>
        </p>
        {/* §3.10's summary table reads "5 of top 8 wards", which is the top-11 count printed
            against the top-8 window. Both figures above are computed from the register; neither
            sentence in the content has been changed. */}
        <UnderReview ids={["C-5"]}>
          §3.10 summarises this overlap as “5 of top 8 wards”. Ranked on the register,
          Ikanga/Kyatune is 11th — so the five named wards are 5 of the top 11, as §3.4 itself
          states, and 4 of them are in the top 8. Both counts are shown; neither has been changed.
        </UnderReview>
        <p className="t-small text-muted flex items-start gap-1.5">
          <AlertTriangle size={12} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            Recognition status here is <strong>structural</strong> — derived from where Dr. Mulu has held office, not
            from any survey. No ward-level poll of this race exists; §3.10 lists ward-level recognition data as a named
            Tier 1 gap, and commissioning it is a Phase −1 research priority.
          </span>
        </p>
        <p className="t-small text-muted flex items-start gap-1.5">
          <Radio size={12} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            Ward figures: IEBC 2022 register, all 40 wards. Ranking computed from that register, not asserted.
          </span>
        </p>
      </div>
    </div>
  );
}
