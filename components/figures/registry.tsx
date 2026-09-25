import { FigureFrame } from "./FigureFrame";
import { RegisterFigure } from "../register/Figure";
import { STORY_FIGURES } from "../../lib/premium/story";
import { REGISTER } from "../../lib/register/specs";
import {
  Allocation,
  BarList,
  BuildUp,
  GapBar,
  Hierarchy,
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
  Tree,
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
  AUDIENCE_FACETS,
  AUDIENCE_SEGMENTS,
  AUDIENCE_SERIES,
  CHANNEL_MESSAGE_SERIES,
  CONFLICT_PROTOCOL,
  ESCALATION_LADDER,
  ESCALATION_SERIES,
  HOLDING_POSITIONS,
  HOLDING_SERIES,
  MANDATE_SERIES,
  MATRIX_SERIES,
  MESSAGE_BY_CHANNEL,
  MESSAGE_BY_SEGMENT,
  PROTOCOL_SERIES,
  PROVENANCE_MANDATE,
  RESPONSE_MATRIX,
  RESPONSE_SLA,
  SEGMENTS_SERIES,
  SEGMENT_MESSAGE_SERIES,
  SLA_SERIES,
  TIERS_SERIES,
  TIER_CLASSIFICATION,
  VISIT_LOOP,
  VISIT_SERIES,
} from "../../lib/figures/annex";
import {
  CLEARANCE_SERIES,
  COMPLIANCE_SERIES,
  COMPLIANCE_TIERS,
  IEBC_CLEARANCES,
  LIABILITY_MATRIX,
  LIABILITY_SERIES,
  ORG_BRANCHES,
  ORG_CHAIN,
  ORG_SERIES,
  REPORTING_CHAIN,
  REPORTING_SERIES,
  REPORTING_TEAMS,
  ROLES_SERIES,
  ROLE_OWNERSHIP,
} from "../../lib/figures/governance";
import { RapidResponseFlowDiagram } from "../markdown/RapidResponseFlowDiagram";
import {
  MODULES_SERIES,
  RESEARCH_MODULES,
  RESEARCH_SPLIT,
  RESEARCH_TIERS,
  TRACKER_DIMENSIONS,
  TRACKER_SERIES,
} from "../../lib/figures/research";
import { GENERAL_ELECTION_KPIS, NOMINATION_KPIS } from "../../data/kpis";
import { KpiArchitecture } from "../charts/KpiArchitecture";
import { KpiScorecards } from "../charts/KpiScorecards";
import {
  APPROVAL_SERIES,
  APPROVAL_STEPS,
  ASSET_LIBRARY,
  FORMAT_SERIES,
  FORMAT_SPECS,
  LIBRARY_SERIES,
  PRODUCTION_SERIES,
  PRODUCTION_TIERS,
  USSD_MENU,
  USSD_SERIES,
  WEEKLY_CYCLE,
  WEEKLY_SERIES,
} from "../../lib/figures/production";
import {
  CYCLE_SERIES,
  FIELD_LOOP,
  FIELD_LOOP_TIERS,
  FIELD_REPORTS,
  FIELD_REPORTS_SERIES,
  FOUR_HOUR_CYCLE,
  OPERATING_RHYTHM,
  RHYTHM_SERIES,
} from "../../lib/figures/ground";
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

/* ------------------------------------------------------------------ §3.4 the deficit pool */

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
    "four are routed around is stated in full in §5.2.2.2.",
};

/* ------------------------------------------------------------------ §7.3 the language map */

const DEPLOYMENT_SERIES: FigureSeries = {
  id: "language-deployment",
  headline: "Every medium is allocated to the whole, and only one of them is allocated to Kikamba alone",
  measure: "§4.4.11's language allocation per campaign output medium. Each row totals 100%.",
  points: [],
  conflicts: ["C-21"],
  note:
    "The bulk SMS row gives Kikamba no allocation, which is what §5.2.3.3 requires — the " +
    "Communications Authority restricts political bulk SMS to English or Kiswahili — and what " +
    "§4.4.8's channel list contradicts. USSD is not restricted, and takes 50% Kikamba here.",
};

const BYPASS_SERIES: FigureSeries = {
  id: "bypass-architecture",
  headline: "Four ways to reach 532,758 voters without a commercial gatekeeper's permission",
  measure: "§5.2.2.2's gatekeeper bypass and direct reach architecture — the operational protocol for each pillar",
  points: [],
  note:
    "Numbered because §5.2.2.2 numbers them, and because four routes run in parallel but are stood " +
    "up in order. The station list in pillar 1 is §5.2.2.2's; two of the three stations it names, " +
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
    note: "§2.6 — five platforms, each as a range, against the register.",
    render: () => (
      <FigureFrame series={PLATFORM_SIZING}>
        <RangeBars series={PLATFORM_SIZING} />
      </FigureFrame>
    ),
  },

  "offline-channels": {
    note: "§3.8.1 — six offline channels, three of them unsourced.",
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

  "audience-overview": {
    note: "§4.3 — six ways of cutting the electorate.",
    render: () => (
      <FigureFrame series={AUDIENCE_SERIES}>
        <TierGrid
          tiers={AUDIENCE_FACETS}
          flow="Connectivity and language are the two facets the rest of the proposal turns on."
        />
      </FigureFrame>
    ),
  },

  "audience-segments": {
    note: "§5.2 — six segments, their size, tier, channel and hook.",
    render: () => (
      <FigureFrame series={SEGMENTS_SERIES}>
        <SpecTable
          caption="§5.2 audience segment comparative summary"
          columns={["Segment", "Sized electorate", "Data tier", "Primary channel", "Decisive persuasion hook"]}
          rows={AUDIENCE_SEGMENTS}
          emphasise={2}
        />
      </FigureFrame>
    ),
  },

  "visit-loop": {
    note: "§4.5.4 — visit, commitment, twelve weeks, verification, published either way.",
    render: () => (
      <FigureFrame series={VISIT_SERIES}>
        <Stepper stages={VISIT_LOOP} />
      </FigureFrame>
    ),
  },

  "provenance-mandate": {
    note: "§3.2.1 — the three things every figure has to carry.",
    render: () => (
      <FigureFrame series={MANDATE_SERIES}>
        <SpecTable
          caption="§3.2.1 tri-partite provenance mandate"
          columns={["Requirement", "What it means", "Example"]}
          rows={PROVENANCE_MANDATE}
        />
      </FigureFrame>
    ),
  },

  "tier-classification": {
    note: "§A.1.2 — three evidential tiers and what each may be used for.",
    render: () => (
      <FigureFrame series={TIERS_SERIES}>
        <SpecTable
          caption="§A.1.2 three-tier evidential classification"
          columns={["Tier", "Source types", "Authorised strategic use"]}
          rows={TIER_CLASSIFICATION}
          emphasise={2}
        />
      </FigureFrame>
    ),
  },

  "conflict-protocol": {
    note: "§A.1.3 — four steps for when two sources disagree.",
    render: () => (
      <FigureFrame series={PROTOCOL_SERIES}>
        <Stepper stages={CONFLICT_PROTOCOL} />
      </FigureFrame>
    ),
  },

  "message-by-segment": {
    note: "§D.1 — six segments, their message and the evidence behind it.",
    render: () => (
      <FigureFrame series={SEGMENT_MESSAGE_SERIES}>
        <SpecTable
          caption="§D.1 message-by-demographic-segment matrix"
          columns={["Target segment", "Tailored message & Kikamba framing", "Verifiable evidence & data source"]}
          rows={MESSAGE_BY_SEGMENT}
        />
      </FigureFrame>
    ),
  },

  "message-by-channel": {
    note: "§D.2 — five channels, their register and their proof points.",
    render: () => (
      <FigureFrame series={CHANNEL_MESSAGE_SERIES}>
        <SpecTable
          caption="§D.2 message-by-channel matrix and evidence deployment"
          columns={["Channel & reach", "Format, tone & linguistic style", "Evidential proof points"]}
          rows={MESSAGE_BY_CHANNEL}
        />
      </FigureFrame>
    ),
  },

  "escalation-ladder": {
    note: "§E.2 — three escalation levels and who decides at each.",
    render: () => (
      <FigureFrame series={ESCALATION_SERIES}>
        <Stepper stages={ESCALATION_LADDER} />
      </FigureFrame>
    ),
  },

  "response-matrix": {
    note: "§F.1 — four threat severities, their protocol and SLA.",
    render: () => (
      <FigureFrame series={MATRIX_SERIES}>
        <SpecTable
          caption="§F.1 rapid response decision matrix"
          columns={["Threat severity", "Definition & impact threshold", "Strategic response protocol", "Turnaround target (SLA)"]}
          rows={RESPONSE_MATRIX}
          emphasise={3}
        />
      </FigureFrame>
    ),
  },

  "response-sla": {
    note: "§F.2 — mandatory response time per channel.",
    render: () => (
      <FigureFrame series={SLA_SERIES}>
        <SpecTable
          caption="§F.2 rapid response SLA by channel"
          columns={["Channel & platform", "Mandatory response time target"]}
          rows={RESPONSE_SLA}
          emphasise={1}
        />
      </FigureFrame>
    ),
  },

  "holding-positions": {
    note: "§F.3 — four attack lines with their pre-drafted answers and sources.",
    render: () => (
      <FigureFrame series={HOLDING_SERIES}>
        <ol className="not-prose m-0 list-none space-y-2 p-0">
          {HOLDING_POSITIONS.map((pos) => (
            <li key={pos.question} className="overflow-hidden rounded-lg border border-line">
              <p className="m-0 border-b border-line bg-paper/70 px-3 py-2 t-micro font-bold uppercase tracking-wide text-muted">
                {pos.question}
              </p>
              <dl className="m-0 bg-card px-3 py-2">
                {[
                  ["Attack line", pos.attack],
                  ["Holding message", pos.holding],
                  ["Kikamba framing", pos.kikamba],
                  ["Primary source", pos.source],
                ].map(([term, desc]) => (
                  <div key={term} className="mt-1 first:mt-0">
                    <dt className="t-micro font-bold text-accent">{term}</dt>
                    {/* Every line transcribed, diacritics included: §4.4.9 forbids machine
                        translation of exactly this material, and a normalised vowel is what
                        that rule exists to prevent. */}
                    <dd className="m-0 t-micro leading-snug text-ink">{desc}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>
      </FigureFrame>
    ),
  },

  "rapid-response-flow": {
    note: "§13.1 — monitoring feeds through the decision tree and the legal gateway to the response channels.",
    render: () => <RapidResponseFlowDiagram />,
  },

  "compliance-architecture": {
    note: "§5.8.11 — the three statutes the campaign operates under.",
    render: () => (
      <FigureFrame series={COMPLIANCE_SERIES}>
        <TierGrid
          tiers={COMPLIANCE_TIERS}
          flow="Nomination clearance first, then the data-protection regime the voter database sits under, then the offences that govern what may be said and when."
        />
      </FigureFrame>
    ),
  },

  "iebc-clearance": {
    note: "§5.8.12 — seven clearances, their statutory standard and their current status.",
    render: () => (
      <FigureFrame series={CLEARANCE_SERIES}>
        <SpecTable
          caption="§5.8.12 IEBC statutory nomination clearance checklist"
          columns={["Clearance dimension", "Statutory standard & issuing authority", "Current status & legal verification"]}
          rows={IEBC_CLEARANCES}
          emphasise={2}
        />
      </FigureFrame>
    ),
  },

  "liability-matrix": {
    note: "§5.8.13 — three statutory exposures and the mitigation against each.",
    render: () => (
      <FigureFrame series={LIABILITY_SERIES}>
        <SpecTable
          caption="§5.8.13 DPA 2019 and Election Offences statutory matrix"
          columns={["Legal dimension", "Statutory obligation / exposure risk", "Campaign risk mitigation protocol"]}
          rows={LIABILITY_MATRIX}
          emphasise={1}
        />
      </FigureFrame>
    ),
  },

  "org-chart": {
    note: "§5.9 — the lean core and the specialists each lead directs.",
    render: () => (
      <FigureFrame series={ORG_SERIES}>
        <Hierarchy chain={ORG_CHAIN} branches={ORG_BRANCHES} />
      </FigureFrame>
    ),
  },

  "role-ownership": {
    note: "§5.9.4 — four core roles, what each owns and which specialists each directs.",
    render: () => (
      <FigureFrame series={ROLES_SERIES}>
        <SpecTable
          caption="§5.9.4 core campaign roles and ownership matrix"
          columns={["Core role", "Primary strategic & operational ownership", "Specialist subcontractors directed"]}
          rows={ROLE_OWNERSHIP}
        />
      </FigureFrame>
    ),
  },

  "reporting-lines": {
    note: "§5.9.5 — the two teams, the weekly brief and the line upward.",
    render: () => (
      <FigureFrame series={REPORTING_SERIES}>
        <TierGrid tiers={REPORTING_TEAMS} flow="Both teams meet at the weekly brief." />
        <div className="mt-2">
          <Hierarchy chain={REPORTING_CHAIN} />
        </div>
      </FigureFrame>
    ),
  },

  "nomination-scorecard": {
    note: "§5.6.1 — the four nomination-window indicators, with their unmeasured baselines shown as absences.",
    render: () => (
      <KpiScorecards
        stage={1}
        kpis={NOMINATION_KPIS}
        title="Stage 1 — nomination window scorecard"
        note="Four indicators, measured against the Wiper primary-voter universe rather than the countywide public."
      />
    ),
  },

  "ge-scorecard": {
    note: "§5.6.2 — the five general-election indicators, anchored to the winning threshold.",
    render: () => (
      <KpiScorecards
        stage={2}
        kpis={GENERAL_ELECTION_KPIS}
        title="Stage 2 — general election scorecard"
        note="Five indicators, every one anchored to the ~200,000-vote winning threshold."
      />
    ),
  },

  "kpi-architecture": {
    note: "§1.5 — the two stages of targets, anchored to the vote threshold.",
    render: () => <KpiArchitecture />,
  },

  "research-and-tracker": {
    note: "§5.6.4 — the research programme and the service-delivery tracker.",
    render: () => (
      <FigureFrame series={RESEARCH_SPLIT}>
        <TierGrid
          tiers={RESEARCH_TIERS}
          flow="The research programme feeds the tracker: what the polling establishes about a ward becomes a baseline the tracker publishes against."
        />
      </FigureFrame>
    ),
  },

  "research-modules": {
    note: "§5.6.5 — three research instruments and the decision each unlocks.",
    render: () => (
      <FigureFrame series={MODULES_SERIES}>
        <SpecTable
          caption="§5.6.5 recognition-deficit research architecture"
          columns={["Research module", "Method & instrument", "Sample & stratification", "Timing", "Decision unlocked"]}
          rows={RESEARCH_MODULES}
          emphasise={4}
        />
      </FigureFrame>
    ),
  },

  "delivery-tracker": {
    note: "§5.6.6 — four delivery dimensions, their statutory sources and cadence.",
    render: () => (
      <FigureFrame series={TRACKER_SERIES}>
        <SpecTable
          caption="§5.6.6 public service-delivery tracker architecture"
          columns={["Core delivery dimension", "Primary statutory data sources", "Update cadence & verification"]}
          rows={TRACKER_DIMENSIONS}
        />
      </FigureFrame>
    ),
  },

  "production-pipeline": {
    note: "§5.2.1.2 — four pillars, two engines, one approval gateway.",
    render: () => (
      <FigureFrame series={PRODUCTION_SERIES}>
        <TierGrid
          tiers={PRODUCTION_TIERS}
          flow="The pillars feed both engines, and both engines leave through the gateway — nothing routes around it."
        />
      </FigureFrame>
    ),
  },

  "format-specs": {
    note: "§5.2.1.2 — five channels, their technical specification and creative treatment.",
    render: () => (
      <FigureFrame series={FORMAT_SERIES}>
        <SpecTable
          caption="§5.2.1.2 production format specifications by channel"
          columns={["Channel & medium", "Technical specification", "Language & creative treatment"]}
          rows={FORMAT_SPECS}
        />
      </FigureFrame>
    ),
  },

  "ussd-menu": {
    note: "§5.2.1.2 — the USSD menu tree, with the shortcode still unprovisioned.",
    render: () => (
      <FigureFrame series={USSD_SERIES}>
        <Tree root={USSD_MENU.root} nodes={USSD_MENU.nodes} />
      </FigureFrame>
    ),
  },

  "weekly-cycle": {
    note: "§5.2.1.2 — the seven-day production cycle, focus and outputs per day.",
    render: () => (
      <FigureFrame series={WEEKLY_SERIES}>
        <SpecTable
          caption="§5.2.1.2 weekly 7-day content production cycle"
          columns={["Day", "Production focus & milestones", "Output deliverables"]}
          rows={WEEKLY_CYCLE}
        />
      </FigureFrame>
    ),
  },

  "approval-gateway": {
    note: "§5.2.1.2 — the four steps every asset passes before dispatch.",
    render: () => (
      <FigureFrame series={APPROVAL_SERIES}>
        <Stepper stages={APPROVAL_STEPS} />
      </FigureFrame>
    ),
  },

  "asset-library": {
    note: "§5.2.1.2 — the seven vaults of the campaign asset repository.",
    render: () => (
      <FigureFrame series={LIBRARY_SERIES}>
        <Tree root={ASSET_LIBRARY.root} nodes={ASSET_LIBRARY.nodes} />
      </FigureFrame>
    ),
  },

  "field-loop": {
    note: "§5.2.3.1 — the closed loop between field intelligence and published response.",
    render: () => (
      <FigureFrame series={FIELD_LOOP}>
        <TierGrid
          tiers={FIELD_LOOP_TIERS}
          flow="Inbound feeds the war room; the war room feeds the outbound pipeline and the physical channels; what those produce comes back as field intelligence."
        />
      </FigureFrame>
    ),
  },

  "field-reports": {
    note: "§5.2.3.1 — four report types, their frequency, channel and captured fields.",
    render: () => (
      <FigureFrame series={FIELD_REPORTS_SERIES}>
        <SpecTable
          caption="§5.2.3.1 ward coordinator field reporting protocol"
          columns={["Report type", "Frequency", "Channel", "Data captured"]}
          rows={FIELD_REPORTS}
          emphasise={1}
        />
      </FigureFrame>
    ),
  },

  "four-hour-cycle": {
    note: "§5.2.3.1 — ground report to synchronised deployment, on the clock.",
    render: () => (
      <FigureFrame series={CYCLE_SERIES}>
        <Stepper stages={FOUR_HOUR_CYCLE} />
      </FigureFrame>
    ),
  },

  "operating-rhythm": {
    note: "§5.2.3.1 — seven standing forums, their owners and participants.",
    render: () => (
      <FigureFrame series={RHYTHM_SERIES}>
        <SpecTable
          caption="§5.2.3.1 campaign operational rhythm and governance cadence"
          columns={["Cadence & time (EAT)", "Forum", "Agenda", "Primary owner", "Participants"]}
          rows={OPERATING_RHYTHM}
        />
      </FigureFrame>
    ),
  },

  "data-layer": {
    note: "§5.2.4.1 — capture, validation, output, and the encrypted core beneath them.",
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
    note: "§5.2.4.1 — the supporter record, field by field.",
    render: () => (
      <FigureFrame series={SUPPORTER_SCHEMA_SERIES}>
        <SpecTable
          caption="§5.2.4.1 supporter record schema specification"
          columns={["Field name", "Data type", "Description & constraints"]}
          rows={SUPPORTER_SCHEMA}
        />
      </FigureFrame>
    ),
  },

  "dpa-compliance": {
    note: "§5.2.4.1 — six sections of the Data Protection Act 2019, and what each obliges.",
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
    note: "§5.2.4.3 — the four tiers of the campaign technology stack.",
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
    note: "§5.2.4.3 — five components, their DPA risk level, and their decision status.",
    render: () => (
      <FigureFrame series={PROCUREMENT_SERIES}>
        <SpecTable
          caption="§5.2.4.3 technology stack master procurement matrix"
          columns={["System component", "Recommended vendor", "DPA risk level", "Decision status"]}
          rows={PROCUREMENT}
          emphasise={2}
        />
      </FigureFrame>
    ),
  },

  "bypass-architecture": {
    note: "§5.2.2.2 — the four bypass pillars and the protocol for each.",
    render: () => (
      <FigureFrame series={BYPASS_SERIES}>
        <Stepper
          stages={BYPASS_PILLARS.map((p) => ({ title: p.label, steps: [p.detail] }))}
        />
      </FigureFrame>
    ),
  },

  "counter-fire": {
    note: "§4.4.2 — three ground rumours paired with the evidence that answers each.",
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
    note: "§4.4.9 — four terms, the literal translation that fails, and the approved Kikamba idiom.",
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
    note: "§4.4.10 — the four gates between an English draft and a Kikamba broadcast.",
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
    note: "§4.4.8 — the three languages, their reach, their audiences and their channels.",
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
                  {/* The channel list is §4.4.8's, transcribed. The flag is the audit's. */}
                  {l.conflicts?.includes("C-21") && (
                    <span className="mt-1 block rounded border border-gold/40 bg-gold/[0.06] px-2 py-1 text-ink">
                      <strong className="font-bold text-gold">Under review — C-21.</strong> §5.2.3.3 states
                      that the Communications Authority restricts political bulk SMS to English or
                      Kiswahili, and that an operator may refuse a non-compliant message. §4.4.11
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
    note: "§4.4.11 — seven output media, each allocated across languages.",
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
          And the four routes that need no station at all — stated in full in §5.2.2.2
        </p>
        <ol className="not-prose m-0 list-none space-y-1.5 p-0">
          {BYPASS_PILLARS.map((pillar, i) => (
            <li key={pillar.label} className="rounded-lg border border-line bg-paper/60 px-3 py-2.5">
              <p className="m-0 t-micro font-bold text-ink">
                {/* Numbered because §5.2.2.2 numbers them and because four routes executed in
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
    note: "§3.10 — the eight findings of §3.4, computed, with the three that are in dispute flagged.",
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
    note: "§3.4 — where the recognition deficit sits, as a share of the register.",
    render: () => (
      <FigureFrame series={DEFICIT_SERIES}>
        <ShareBar series={DEFICIT_SERIES} />
      </FigureFrame>
    ),
  },
};

/**
 * Where §3.1–§3.4 would have drawn a figure the §3 story now carries: one line that names the
 * figure and links up to the step that holds it, with its sources, table and CSV.
 */
function StoryPointer({ spec }: { spec: { id: string; title: string; section: string } }) {
  return (
    <p className="pf-storyptr not-prose">
      <a href={`#${spec.id}`}>
        <span className="pf-storyptr__k">Figure, §{spec.section}</span>
        <span className="pf-storyptr__t">{spec.title}</span>
        <span className="pf-storyptr__h">In the four-step story at the start of this part, with its sources, table and CSV</span>
      </a>
    </p>
  );
}

/**
 * The fence's renderer.
 *
 * An unknown id is drawn as a visible gap rather than silently dropped: a typo in a fence would
 * otherwise remove a figure from the document and nobody would find out until a reader did.
 */
export function Figure({ id }: { id: string }) {
  // The brief's figure register (lib/register/specs) is looked up first: one spec draws the chart,
  // the table view and the CSV.
  const spec = REGISTER[id];
  if (spec && STORY_FIGURES.has(id)) return <StoryPointer spec={spec} />;
  if (spec) return <RegisterFigure spec={spec} />;
  const entry = FIGURES[id];
  if (!entry) {
    return (
      <p className="not-prose my-4 rounded-lg border border-dashed border-gold/60 bg-gold/[0.06] px-3 py-2 t-micro text-ink">
        <strong className="font-bold text-gold">Figure not found:</strong>{" "}
        <code>{id}</code> is not in the figure register (lib/register/specs) or the figure registry (components/figures/registry.tsx).
      </p>
    );
  }
  return <>{entry.render()}</>;
}

export { GapBar };
