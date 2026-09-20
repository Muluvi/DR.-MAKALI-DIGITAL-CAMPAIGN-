import { FigureFrame } from "./FigureFrame";
import { BarList, BuildUp, GapBar, RangeBars, RegisterGroups, ShareBar, SlopeChart } from "./marks";
import { CONSTITUENCIES } from "../../data/ward-register";
import {
  COALITION_PATHS,
  CONSTITUENCY_RANKING,
  BIG_FOUR_TOTAL,
  BIG_FOUR_WARDS,
  COUNTY_REGISTER,
  DEFICIT_POOL,
  DEFICIT_POOL_SHARE,
  DEFICIT_WARD_COUNT,
  THRESHOLD_ROUNDED,
  TOP_12,
  TOP_20,
  BOTTOM_10,
  WARD_RANKING,
  WINNING_TOTAL_2022,
} from "../../lib/figures/register";
import { REGISTER_GROWTH_SERIES, THRESHOLD_SERIES } from "../../lib/figures/threshold";
import {
  DIGITAL_REACH,
  DIGITAL_SHORTFALL,
  EFFORT_REBALANCE,
  OFFLINE_CHANNELS,
  PLATFORM_SIZING,
  REACH_SPLIT,
} from "../../lib/figures/reach";
import { IEBC_WARD_REGISTER } from "../../data/sources";
import type { FigurePoint, FigureSeries } from "../../lib/figures/types";

/**
 * One figure per id, resolved by name from the markdown.
 *
 * WHY A REGISTRY AND NOT A HEADING MAP. HEADING_INSERTS in MarkdownViewer keys a component to a
 * heading id, which puts every figure at the top of its subsection whether or not that is where
 * the argument needs it. A ```figure fence puts the figure exactly where the prose reaches it —
 * which is what lets an ASCII diagram be replaced IN PLACE rather than lifted to the heading and
 * leaving a hole behind.
 *
 * An id that is not in this table renders a visible, honest placeholder rather than nothing.
 * Silence would mean a fence typo removes a figure and no one finds out until a reader does.
 */

const officialRegister = {
  unit: "voters",
  source: IEBC_WARD_REGISTER,
  tier: 1 as const,
  asOf: "2022",
  kind: "official" as const,
  granularity: "ward" as const,
};

/* ------------------------------------------------------------------ §3.4.2 concentration */

const WARD_RANKING_SERIES: FigureSeries = {
  id: "ward-ranking",
  headline: `Twelve of the forty wards hold ${TOP_12.toLocaleString("en-KE")} voters — ${((TOP_12 / COUNTY_REGISTER) * 100).toFixed(2)}% of the register`,
  measure: "Registered voters per ward, 2022 IEBC register, largest first",
  points: WARD_RANKING.map<FigurePoint>((w) => ({
    label: `${w.name} (${w.constituency})`,
    value: w.voters,
    ...officialRegister,
  })),
  note: "Registration is concentrated, not evenly spread: a flat distribution would put 13,319 voters in each ward.",
};

/* ------------------------------------------------------------------ §3.4.3 the four paths */

const PATHS_SERIES: FigureSeries = {
  id: "paths-to-threshold",
  headline: `Three of the four routes clear ${THRESHOLD_ROUNDED.toLocaleString("en-KE")} on the register, and none of them clears it on ballots`,
  measure: `Registered voters per coalition, and the ballots each yields at the 62% turnout baseline`,
  points: COALITION_PATHS.map<FigurePoint>((p) => ({
    label: `Path ${p.id} — ${p.name}`,
    value: p.registered,
    ...officialRegister,
    note:
      `${p.wards} wards · ${p.share.toFixed(2)}% of the register · about ${p.ballots.toLocaleString("en-KE")} ballots at 62%` +
      ` · ${p.marginOverRounded >= 0 ? "+" : "−"}${Math.abs(p.marginOverRounded).toLocaleString("en-KE")} against 200,000` +
      ` · ${p.marginOver2022 >= 0 ? "+" : "−"}${Math.abs(p.marginOver2022).toLocaleString("en-KE")} against 198,004`,
    conflicts: p.id === "B" ? ["C-4"] : undefined,
  })),
  note:
    "Both margins are shown on every path because §3.4.3 mixes them: Path B's prose quotes the margin over 198,004 " +
    "while naming the 200,000 threshold. Neither number has been changed.",
};

/* ------------------------------------------------------------------ §3.4.5 the deficit pool */

const DEFICIT_SERIES: FigureSeries = {
  id: "deficit-pool",
  headline: `${DEFICIT_POOL.toLocaleString("en-KE")} registered voters — ${DEFICIT_POOL_SHARE.toFixed(2)}% of the county — sit in the constituencies where he is least known`,
  measure: "Registered voters in the Mwingi bloc and Kitui South, against the rest of the county",
  points: [
    { label: "Mwingi North, West and Central", value: 200_198, ...officialRegister, note: "15 wards" },
    { label: "Kitui South", value: 75_372, ...officialRegister, note: "6 wards" },
    {
      label: "The rest of the county",
      value: COUNTY_REGISTER - DEFICIT_POOL,
      ...officialRegister,
      note: "Kitui Central, West, Rural and East — 19 wards",
    },
  ],
  conflicts: ["C-6", "C-7"],
  note:
    `The pool spans ${DEFICIT_WARD_COUNT} wards, not the 24 the operational mandate directs effort into — ` +
    `the mandate's count includes three Kitui East border wards that this pool excludes. The share computes to ` +
    `${DEFICIT_POOL_SHARE.toFixed(4)}%, which rounds to ${DEFICIT_POOL_SHARE.toFixed(2)}%; the prose prints 51.72%.`,
};

/* ------------------------------------------------------------------ §3.4 the register itself */

const REGISTER_SERIES: FigureSeries = {
  id: "register-map",
  headline: `${COUNTY_REGISTER.toLocaleString("en-KE")} registered voters across 40 wards, and they are not evenly spread`,
  measure: "Registered voters per ward, grouped by constituency — 2022 IEBC register",
  points: WARD_RANKING.map<FigurePoint>((w) => ({
    label: `${w.name} (${w.constituency})`,
    value: w.voters,
    ...officialRegister,
  })),
  note: "A flat distribution would put 13,319 voters in every ward. The largest holds 19,921 and the smallest 7,429.",
};

/* ------------------------------------------------------------------ §3.4.4 constituency power */

const CONSTITUENCY_SERIES: FigureSeries = {
  id: "constituency-power",
  headline: `Four of the eight constituencies hold ${BIG_FOUR_TOTAL.toLocaleString("en-KE")} voters — ${((BIG_FOUR_TOTAL / COUNTY_REGISTER) * 100).toFixed(2)}% of the county across ${BIG_FOUR_WARDS} wards`,
  measure: "Registered voters per constituency, largest first, with ward count and average ward size",
  points: CONSTITUENCY_RANKING.map<FigurePoint>((c) => ({
    label: c.name,
    value: c.voters,
    ...officialRegister,
    granularity: "constituency",
    note: `${c.share.toFixed(2)}% of the county · ${c.wards} wards · ${c.averageWard.toLocaleString("en-KE")} voters per ward on average`,
  })),
};

/* ------------------------------------------------------------------ §3.6.3 the rebalance */

const REBALANCE_SERIES: FigureSeries = {
  id: "effort-rebalance",
  headline: "The rebalance moves effort out of digital and into radio, SMS and USSD",
  measure: "Share of campaign effort per channel, as a traditional pitch would weight it and as §3.6.3 weights it",
  points: EFFORT_REBALANCE.map<FigurePoint>((row) => ({
    label: row.label,
    value: row.to,
    unit: "%",
    source: IEBC_WARD_REGISTER,
    tier: 3,
    asOf: "2026",
    kind: "illustrative",
    granularity: "county",
    note: `${row.from}% → ${row.to}%${row.note ? ` · ${row.note}` : ""}`,
  })),
  note:
    "Effort, not money. The weighting is on output and targeting; no budget figure is stated " +
    "anywhere in this pass (D-11). Both columns sum to 100%.",
};

/* ------------------------------------------------------------------ the registry */

type FigureEntry = { render: () => React.ReactNode; note: string };

export const FIGURES: Record<string, FigureEntry> = {
  "reach-split": {
    note: "§3.6 — the register split by connectivity, and the digital ceiling.",
    render: () => (
      <FigureFrame series={REACH_SPLIT}>
        <ShareBar series={REACH_SPLIT} />
        <p className="mt-3 rounded-lg border border-gold/40 bg-gold/[0.06] px-3 py-2 t-micro leading-snug text-ink">
          <strong className="font-bold text-gold">The digital ceiling.</strong> Capturing every
          connected voter in the county assembles about {DIGITAL_REACH.toLocaleString("en-KE")}{" "}
          reachable people — and reach is not votes — leaving the campaign{" "}
          <strong className="font-bold">{DIGITAL_SHORTFALL.toLocaleString("en-KE")} short</strong> of
          the 198,004 benchmark.
        </p>
      </FigureFrame>
    ),
  },

  "platform-sizing": {
    note: "§3.6.1 — five platforms, each as a range, against the register.",
    render: () => (
      <FigureFrame series={PLATFORM_SIZING}>
        <RangeBars series={PLATFORM_SIZING} />
      </FigureFrame>
    ),
  },

  "offline-channels": {
    note: "§3.6.2 — six offline channels, three of them unsourced.",
    render: () => (
      <FigureFrame series={OFFLINE_CHANNELS}>
        <BarList series={OFFLINE_CHANNELS} />
      </FigureFrame>
    ),
  },

  "effort-rebalance": {
    note: "§3.6.3 — the traditional pitch against the rebalanced weighting.",
    render: () => (
      <FigureFrame series={REBALANCE_SERIES}>
        <SlopeChart
          rows={EFFORT_REBALANCE.map((r) => ({ label: r.label, from: r.from, to: r.to, note: r.note ?? undefined }))}
          fromLabel="Traditional pitch"
          toLabel="Rebalanced — §3.6.3"
        />
      </FigureFrame>
    ),
  },

  "register-map": {
    note: "§3.4 — the whole register, grouped by constituency.",
    render: () => (
      <FigureFrame series={REGISTER_SERIES}>
        <RegisterGroups
          groups={CONSTITUENCIES.map((c) => ({ name: c.name, voters: c.voters, wards: c.wards }))}
          countyTotal={COUNTY_REGISTER}
          scaleMax={Math.max(...WARD_RANKING.map((w) => w.voters))}
        />
      </FigureFrame>
    ),
  },

  "constituency-power": {
    note: "§3.4.4 — the eight constituencies, ranked, with the Big 4 bracket.",
    render: () => (
      <FigureFrame series={CONSTITUENCY_SERIES}>
        <BarList
          series={CONSTITUENCY_SERIES}
          cumulative
          brackets={[
            {
              through: 4,
              label: `The "Big 4" — Kitui Central, Kitui South, Mwingi Central and Mwingi North — hold ${BIG_FOUR_TOTAL.toLocaleString("en-KE")} voters (${((BIG_FOUR_TOTAL / COUNTY_REGISTER) * 100).toFixed(2)}%) across ${BIG_FOUR_WARDS} wards`,
            },
          ]}
        />
      </FigureFrame>
    ),
  },

  "threshold-build-up": {
    note: "§3.4.1 — register → ballots → the votes that win.",
    render: () => (
      <FigureFrame series={THRESHOLD_SERIES}>
        <BuildUp
          series={THRESHOLD_SERIES}
          threshold={{ value: WINNING_TOTAL_2022, label: "What won the seat in 2022" }}
        />
      </FigureFrame>
    ),
  },

  "register-growth": {
    note: "§3.4.1 — the 2026 register and the like-for-like threshold on it.",
    render: () => (
      <FigureFrame series={REGISTER_GROWTH_SERIES}>
        <BuildUp series={REGISTER_GROWTH_SERIES} />
      </FigureFrame>
    ),
  },

  "ward-ranking": {
    note: "§3.4.2 — the forty wards, ranked, with the concentration brackets.",
    render: () => (
      <FigureFrame series={WARD_RANKING_SERIES}>
        <BarList
          series={WARD_RANKING_SERIES}
          cumulative
          limit={12}
          brackets={[
            { through: 12, label: `Top 12 wards: ${TOP_12.toLocaleString("en-KE")} voters, ${((TOP_12 / COUNTY_REGISTER) * 100).toFixed(2)}% of the register` },
            { through: 20, label: `Top 20 wards: ${TOP_20.toLocaleString("en-KE")}, ${((TOP_20 / COUNTY_REGISTER) * 100).toFixed(2)}%` },
            { through: 40, label: `Bottom 10 wards: ${BOTTOM_10.toLocaleString("en-KE")}, ${((BOTTOM_10 / COUNTY_REGISTER) * 100).toFixed(2)}% — across a quarter of the wards and most of the distance` },
          ]}
        />
      </FigureFrame>
    ),
  },

  "paths-to-threshold": {
    note: "§3.4.3 — the four coalition routes, on the register and on ballots.",
    render: () => (
      <FigureFrame series={PATHS_SERIES}>
        <BuildUp
          series={PATHS_SERIES}
          threshold={{ value: THRESHOLD_ROUNDED, label: "The ~200,000 threshold" }}
        />
      </FigureFrame>
    ),
  },

  "deficit-pool": {
    note: "§3.4.5 — where the recognition deficit sits, as a share of the register.",
    render: () => (
      <FigureFrame series={DEFICIT_SERIES}>
        <ShareBar series={DEFICIT_SERIES} />
      </FigureFrame>
    ),
  },
};

/**
 * The fence's renderer.
 *
 * An unknown id is drawn as a visible gap rather than silently dropped: a typo in a fence would
 * otherwise remove a figure from the document and nobody would find out until a reader did.
 */
export function Figure({ id }: { id: string }) {
  const entry = FIGURES[id];
  if (!entry) {
    return (
      <p className="not-prose my-4 rounded-lg border border-dashed border-gold/60 bg-gold/[0.06] px-3 py-2 t-micro text-ink">
        <strong className="font-bold text-gold">Figure not found:</strong>{" "}
        <code>{id}</code> is not in the figure registry (components/figures/registry.tsx).
      </p>
    );
  }
  return <>{entry.render()}</>;
}

export { GapBar };
