import { FigureFrame } from "./FigureFrame";
import {
  Allocation,
  BarList,
  BuildUp,
  GapBar,
  Ledger,
  MessageHouse,
  PairedRows,
  RangeBars,
  RegisterGroups,
  ShareBar,
  SlopeChart,
  SpecTable,
  Stepper,
  TierGrid,
} from "./marks";
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
import { TARGETING_SERIES, TARGETING_SUMMARY } from "../../lib/figures/targeting";
import { BYPASS_PILLARS, BYPASS_STATIONS, RADIO_GATEKEEPERS } from "../../lib/figures/media";
import { LANGUAGES, LANGUAGE_DEPLOYMENT, LANGUAGE_SPLIT } from "../../lib/figures/language";
import {
  DATA_LAYER,
  DATA_LAYER_CORE,
  DATA_LAYER_TIERS,
  DPA_COMPLIANCE,
  DPA_SERIES,
  PROCUREMENT,
  PROCUREMENT_SERIES,
  STACK_SERIES,
  STACK_TIERS,
  SUPPORTER_SCHEMA,
  SUPPORTER_SCHEMA_SERIES,
} from "../../lib/figures/data-layer";
import {
  CENTRAL_CLAIM,
  CLAIM_EVIDENCE,
  COUNTER_FIRE,
  COUNTER_FIRE_SERIES,
  CULTURAL_REGISTERS,
  MESSAGE_HOUSE,
  MESSAGE_PILLARS,
  QC_SERIES,
  QC_STAGES,
  REGISTERS_SERIES,
} from "../../lib/figures/messaging";
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

/* ------------------------------------------------------------------ §3.7 who owns the air */

const GATEKEEPER_SERIES: FigureSeries = {
  id: "radio-gatekeepers",
  headline: "The document names four hostile stations, and disagrees with itself about two of them",
  measure:
    "§3.7's Tier 1 hostile tier, read against data/media-ownership.ts — the reconciled map §3.7.1 says governs",
  points: [],
  conflicts: ["C-20"],
  note:
    "Ownership associations are publicly reported, not certified, and §3.7.1 carries the standing " +
    "instruction to verify this map before any placement is booked. The bypass architecture these " +
    "four are routed around is stated in full in §8.7.7.",
};

/* ------------------------------------------------------------------ §7.3 the language map */

const DEPLOYMENT_SERIES: FigureSeries = {
  id: "language-deployment",
  headline: "Every medium is allocated to the whole, and only one of them is allocated to Kikamba alone",
  measure: "§7.3.4's language allocation per campaign output medium. Each row totals 100%.",
  points: [],
  conflicts: ["C-21"],
  note:
    "The bulk SMS row gives Kikamba no allocation, which is what §8.10.2 requires — the " +
    "Communications Authority restricts political bulk SMS to English or Kiswahili — and what " +
    "§7.3.1's channel list contradicts. USSD is not restricted, and takes 50% Kikamba here.",
};

const BYPASS_SERIES: FigureSeries = {
  id: "bypass-architecture",
  headline: "Four ways to reach 532,758 voters without a commercial gatekeeper's permission",
  measure: "§8.7.7's gatekeeper bypass and direct reach architecture — the operational protocol for each pillar",
  points: [],
  note:
    "Numbered because §8.7.7 numbers them, and because four routes run in parallel but are stood " +
    "up in order. The station list in pillar 1 is §8.7.7's; two of the three stations it names, " +
    "Mang'elete among them, are in no ownership map — see §3.7 and C-20.",
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

  "data-layer": {
    note: "§8.12 — capture, validation, output, and the encrypted core beneath them.",
    render: () => (
      <FigureFrame series={DATA_LAYER}>
        <TierGrid
          tiers={DATA_LAYER_TIERS}
          flow="Capture feeds validation; validation feeds the channels; everything passes through the encrypted core."
          terminal={DATA_LAYER_CORE}
        />
      </FigureFrame>
    ),
  },

  "supporter-schema": {
    note: "§8.12.1 — the supporter record, field by field.",
    render: () => (
      <FigureFrame series={SUPPORTER_SCHEMA_SERIES}>
        <SpecTable
          caption="§8.12.1 supporter record schema specification"
          columns={["Field name", "Data type", "Description & constraints"]}
          rows={SUPPORTER_SCHEMA}
        />
      </FigureFrame>
    ),
  },

  "dpa-compliance": {
    note: "§8.12.2 — six sections of the Data Protection Act 2019, and what each obliges.",
    render: () => (
      <FigureFrame series={DPA_SERIES}>
        <PairedRows
          leftLabel="Legal requirement"
          rightLabel="Operational campaign implementation"
          rows={DPA_COMPLIANCE.map((r) => ({ left: r.requirement, right: r.implementation }))}
        />
      </FigureFrame>
    ),
  },

  "tech-stack": {
    note: "§8.14 — the four tiers of the campaign technology stack.",
    render: () => (
      <FigureFrame series={STACK_SERIES}>
        <TierGrid
          tiers={STACK_TIERS}
          flow="The gateway collects, the CRM holds it encrypted, and tiers 3 and 4 work on public and anonymised data."
        />
      </FigureFrame>
    ),
  },

  "procurement-matrix": {
    note: "§8.14.2 — five components, their DPA risk level, and their decision status.",
    render: () => (
      <FigureFrame series={PROCUREMENT_SERIES}>
        <SpecTable
          caption="§8.14.2 technology stack master procurement matrix"
          columns={["System component", "Recommended vendor", "DPA risk level", "Decision status"]}
          rows={PROCUREMENT}
          emphasise={2}
        />
      </FigureFrame>
    ),
  },

  "bypass-architecture": {
    note: "§8.7.7 — the four bypass pillars and the protocol for each.",
    render: () => (
      <FigureFrame series={BYPASS_SERIES}>
        <Stepper
          stages={BYPASS_PILLARS.map((p) => ({ title: p.label, steps: [p.detail] }))}
        />
      </FigureFrame>
    ),
  },

  "counter-fire": {
    note: "§7.1.4 — three ground rumours paired with the evidence that answers each.",
    render: () => (
      <FigureFrame series={COUNTER_FIRE_SERIES}>
        <PairedRows
          leftLabel="Competitor ground rumour"
          rightLabel="Factual evidence-backed counter-fire"
          rows={COUNTER_FIRE.map((r) => ({ left: r.rumour, right: r.answers, note: r.note }))}
        />
      </FigureFrame>
    ),
  },

  "cultural-registers": {
    note: "§7.3.2 — four terms, the literal translation that fails, and the approved Kikamba idiom.",
    render: () => (
      <FigureFrame series={REGISTERS_SERIES}>
        <PairedRows
          leftLabel="Literal / bad translation"
          rightLabel="Approved cultural Kikamba framing"
          rows={CULTURAL_REGISTERS.map((r) => ({
            left: r.literal,
            leftSub: `${r.literalWhy} — for “${r.term}”`,
            right: [r.approved, `“${r.gloss}”`],
          }))}
        />
      </FigureFrame>
    ),
  },

  "qc-gateway": {
    note: "§7.3.3 — the four gates between an English draft and a Kikamba broadcast.",
    render: () => (
      <FigureFrame series={QC_SERIES}>
        <Stepper stages={QC_STAGES} />
      </FigureFrame>
    ),
  },

  "message-house": {
    note: "§7.1 — the central claim in three languages over its three pillars.",
    render: () => (
      <FigureFrame series={MESSAGE_HOUSE}>
        <MessageHouse claim={CENTRAL_CLAIM} evidence={CLAIM_EVIDENCE} pillars={MESSAGE_PILLARS} />
      </FigureFrame>
    ),
  },

  "language-map": {
    note: "§7.3.1 — the three languages, their reach, their audiences and their channels.",
    render: () => (
      <FigureFrame series={LANGUAGE_SPLIT}>
        <ShareBar series={LANGUAGE_SPLIT} />
        <dl className="mt-4 space-y-2.5">
          {LANGUAGES.map((l) => (
            <div key={l.name} className="rounded-lg border border-line bg-paper/60 px-3 py-2.5">
              <dt className="t-micro font-bold text-ink">
                {l.name}
                <span className="ml-1.5 font-normal tabular-nums text-muted">
                  estimated primary reach ~{l.share}%
                </span>
              </dt>
              <dd className="m-0 mt-1 t-micro leading-snug text-muted">
                <span className="font-semibold text-ink">Audiences.</span> {l.audiences.join(" · ")}
                <span className="mt-1 block">
                  <span className="font-semibold text-ink">Channels.</span> {l.channels.join(" · ")}
                  {/* The channel list is §7.3.1's, transcribed. The flag is the audit's. */}
                  {l.conflicts?.includes("C-21") && (
                    <span className="mt-1 block rounded border border-gold/40 bg-gold/[0.06] px-2 py-1 text-ink">
                      <strong className="font-bold text-gold">Under review — C-21.</strong> §8.10.2 states
                      that the Communications Authority restricts political bulk SMS to English or
                      Kiswahili, and that an operator may refuse a non-compliant message. §7.3.4
                      allocates this rail 80% Kiswahili and 20% English. USSD is not restricted.
                    </span>
                  )}
                </span>
                <span className="mt-1 block">{l.objective}</span>
              </dd>
            </div>
          ))}
        </dl>
      </FigureFrame>
    ),
  },

  "language-deployment": {
    note: "§7.3.4 — seven output media, each allocated across languages.",
    render: () => (
      <FigureFrame series={DEPLOYMENT_SERIES}>
        <Allocation
          rows={LANGUAGE_DEPLOYMENT.map((r) => ({
            medium: r.medium,
            segments: [{ language: r.primary.language, share: r.primary.share }, ...r.secondary],
            note: r.note,
            conflicts: r.conflicts,
          }))}
        />
      </FigureFrame>
    ),
  },

  "radio-gatekeepers": {
    note: "§3.7 — the four stations the diagram called hostile, and what the ownership map says.",
    render: () => (
      <FigureFrame series={GATEKEEPER_SERIES}>
        <p className="mb-2 t-micro font-bold uppercase tracking-wide text-muted">
          §3.7: Tier 1 hostile / gatekeeper commercial stations
        </p>
        <Ledger rows={RADIO_GATEKEEPERS} statedLabel="§3.7's diagram calls this" nameFirst />
        <p className="mb-2 mt-4 t-micro font-bold uppercase tracking-wide text-muted">
          §3.7: the stations it routes around them to
        </p>
        <Ledger rows={BYPASS_STATIONS} statedLabel="§3.7's diagram calls this" nameFirst />
        <p className="mb-2 mt-4 t-micro font-bold uppercase tracking-wide text-muted">
          And the four routes that need no station at all — stated in full in §8.7.7
        </p>
        <ol className="not-prose m-0 list-none space-y-1.5 p-0">
          {BYPASS_PILLARS.map((pillar, i) => (
            <li key={pillar.label} className="rounded-lg border border-line bg-paper/60 px-3 py-2.5">
              <p className="m-0 t-micro font-bold text-ink">
                {/* Numbered because §8.7.7 numbers them and because four routes executed in
                    parallel still have an order of deployment. */}
                <span className="mr-1.5 tabular-nums text-muted">{i + 1}.</span>
                {pillar.label}
              </p>
              <p className="m-0 mt-0.5 t-micro leading-snug text-muted">{pillar.summary}</p>
            </li>
          ))}
        </ol>
      </FigureFrame>
    ),
  },

  "targeting-summary": {
    note: "§3.4.6 — the eight findings of §3.4, computed, with the three that are in dispute flagged.",
    render: () => (
      <FigureFrame series={TARGETING_SERIES}>
        <Ledger rows={TARGETING_SUMMARY} />
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
