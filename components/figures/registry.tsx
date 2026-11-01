import { isValidElement } from "react";

import { FigureFrame } from "./FigureFrame";
import { PanelFold } from "../markdown/PanelFold";
import { RegisterFigure } from "../register/Figure";
import { STORY_FIGURES } from "../../lib/premium/story";
import { REGISTER } from "../../lib/register/specs";
import {
  Allocation,
  BarList,
  GapBar,
  Hierarchy,
  PairedRows,
  ShareBar,
  SpecTable,
  Stepper,
  TierGrid,
  Tree,
} from "./marks";
import {
  CONSTITUENCY_RANKING,
  BIG_FOUR_TOTAL,
  BIG_FOUR_WARDS,
  COUNTY_REGISTER,
} from "../../lib/figures/register";
import { BYPASS_PILLARS } from "../../lib/figures/media";
import { LANGUAGES, LANGUAGE_DEPLOYMENT, LANGUAGE_SPLIT } from "../../lib/figures/language";
import {
  AUDIENCE_FACETS,
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
import {
  APPROVAL_SERIES,
  APPROVAL_STEPS,
  ASSET_LIBRARY,
  FORMAT_SERIES,
  FORMAT_SPECS,
  LIBRARY_SERIES,
  PRODUCTION_SERIES,
  PRODUCTION_TIERS,
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
  COUNTER_FIRE,
  COUNTER_FIRE_SERIES,
  CULTURAL_REGISTERS,
  QC_SERIES,
  QC_STAGES,
  REGISTERS_SERIES,
} from "../../lib/figures/messaging";
import { regFmt } from "../../lib/figures/from-registry";
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

/* ------------------------------------------------------------------ §3.4.3 the four paths */

/* ------------------------------------------------------------------ §3.4 the deficit pool */

/* ------------------------------------------------------------------ §3.4 the register itself */

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

/* ------------------------------------------------------------------ §3.7 who owns the air */

/* ------------------------------------------------------------------ §7.3 the language map */

const DEPLOYMENT_SERIES: FigureSeries = {
  id: "language-deployment",
  headline: "Every medium is allocated to the whole, and only one of them is allocated to Kikamba alone",
  measure: "§12.4's language allocation per campaign output medium. Each row totals 100%.",
  points: [],
  note:
    "The bulk SMS row gives Kikamba no allocation, as §15.3.3 requires: the Communications " +
    "Authority restricts political bulk SMS to English or Kiswahili. USSD is not restricted, and " +
    "takes 50% Kikamba here.",
};

const BYPASS_SERIES: FigureSeries = {
  id: "bypass-architecture",
  headline: `Four ways to reach ${regFmt("register.2022")} voters without a commercial gatekeeper's permission`,
  measure: "§15.2.2's gatekeeper bypass and direct reach architecture — the operational protocol for each pillar",
  points: [],
  note:
    "Numbered because §15.2.2 numbers them, and because four routes run in parallel but are stood " +
    "up in order. The station list in pillar 1 is §15.2.2's; two of the three stations it names, " +
    "Mang'elete among them, are in no ownership map — see §1.2 and C-20.",
};

/* ------------------------------------------------------------------ the registry */

type FigureEntry = { render: () => React.ReactNode; note: string };

export const FIGURES: Record<string, FigureEntry> = {
  "audience-overview": {
    note: "Six ways of cutting the electorate.",
    render: () => (
      <FigureFrame series={AUDIENCE_SERIES}>
        <TierGrid
          tiers={AUDIENCE_FACETS}
          flow="Connectivity and language are the two facets the rest of the proposal turns on."
        />
      </FigureFrame>
    ),
  },

  "visit-loop": {
    note: "Visit, commitment, twelve weeks, verification, published either way.",
    render: () => (
      <FigureFrame series={VISIT_SERIES}>
        <Stepper stages={VISIT_LOOP} />
      </FigureFrame>
    ),
  },

  "provenance-mandate": {
    note: "The three things every figure has to carry.",
    render: () => (
      <FigureFrame series={MANDATE_SERIES}>
        <SpecTable
          caption="§2.4 tri-partite provenance mandate"
          columns={["Requirement", "What it means", "Example"]}
          rows={PROVENANCE_MANDATE}
        />
      </FigureFrame>
    ),
  },

  "tier-classification": {
    note: "Three evidential tiers and what each may be used for.",
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
    note: "Four steps for when two sources disagree.",
    render: () => (
      <FigureFrame series={PROTOCOL_SERIES}>
        <Stepper stages={CONFLICT_PROTOCOL} />
      </FigureFrame>
    ),
  },

  "message-by-segment": {
    note: "Six segments, their message and the evidence behind it.",
    render: () => (
      <FigureFrame series={SEGMENT_MESSAGE_SERIES}>
        <SpecTable
          caption="§C.1 message-by-demographic-segment matrix"
          columns={["Target segment", "Tailored message & Kikamba framing", "Verifiable evidence & data source"]}
          rows={MESSAGE_BY_SEGMENT}
        />
      </FigureFrame>
    ),
  },

  "message-by-channel": {
    note: "Five channels, their register and their proof points.",
    render: () => (
      <FigureFrame series={CHANNEL_MESSAGE_SERIES}>
        <SpecTable
          caption="§C.2 message-by-channel matrix and evidence deployment"
          columns={["Channel & reach", "Format, tone & linguistic style", "Evidential proof points"]}
          rows={MESSAGE_BY_CHANNEL}
        />
      </FigureFrame>
    ),
  },

  "escalation-ladder": {
    note: "The decision levels for operational issues, and who decides at each.",
    render: () => (
      <FigureFrame series={ESCALATION_SERIES}>
        <Stepper stages={ESCALATION_LADDER} />
      </FigureFrame>
    ),
  },

  "response-matrix": {
    note: "The severity tiers, their protocol, turnaround and approver.",
    render: () => (
      <FigureFrame series={MATRIX_SERIES}>
        <SpecTable
          caption="The response decision tree"
          columns={["Severity tier", "Definition & impact threshold", "Strategic response protocol", "Turnaround target (SLA)", "Approved by"]}
          rows={RESPONSE_MATRIX}
          emphasise={3}
        />
      </FigureFrame>
    ),
  },

  "response-sla": {
    note: "Mandatory response time per channel.",
    render: () => (
      <FigureFrame series={SLA_SERIES}>
        <SpecTable
          caption="§E.2 rapid response SLA by channel"
          columns={["Channel & platform", "Mandatory response time target"]}
          rows={RESPONSE_SLA}
          emphasise={1}
        />
      </FigureFrame>
    ),
  },

  "holding-positions": {
    note: "Four attack lines with their pre-drafted answers and sources.",
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
    note: "Monitoring feeds through the decision tree and the legal gateway to the response channels.",
    render: () => <RapidResponseFlowDiagram />,
  },

  "compliance-architecture": {
    note: "The three statutes the campaign operates under.",
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
    note: "Seven clearances, their statutory standard and their current status.",
    render: () => (
      <FigureFrame series={CLEARANCE_SERIES}>
        <SpecTable
          caption="§19.4 IEBC statutory nomination clearance checklist"
          columns={["Clearance dimension", "Statutory standard & issuing authority", "Current status & legal verification"]}
          rows={IEBC_CLEARANCES}
          emphasise={2}
        />
      </FigureFrame>
    ),
  },

  "liability-matrix": {
    note: "Three statutory exposures and the mitigation against each.",
    render: () => (
      <FigureFrame series={LIABILITY_SERIES}>
        <SpecTable
          caption="§19.4 DPA 2019 and Election Offences statutory matrix"
          columns={["Legal dimension", "Statutory obligation / exposure risk", "Campaign risk mitigation protocol"]}
          rows={LIABILITY_MATRIX}
          emphasise={1}
        />
      </FigureFrame>
    ),
  },

  "org-chart": {
    note: "The lean core and the specialists each lead directs.",
    render: () => (
      <FigureFrame series={ORG_SERIES}>
        <Hierarchy chain={ORG_CHAIN} branches={ORG_BRANCHES} />
      </FigureFrame>
    ),
  },

  "role-ownership": {
    note: "Four core roles, what each owns and which specialists each directs.",
    render: () => (
      <FigureFrame series={ROLES_SERIES}>
        <SpecTable
          caption="§17.4 core campaign roles and ownership matrix"
          columns={["Core role", "Primary strategic & operational ownership", "Specialist subcontractors directed"]}
          rows={ROLE_OWNERSHIP}
        />
      </FigureFrame>
    ),
  },

  "reporting-lines": {
    note: "The two teams, the weekly brief and the line upward.",
    render: () => (
      <FigureFrame series={REPORTING_SERIES}>
        <TierGrid tiers={REPORTING_TEAMS} flow="Both teams meet at the weekly brief." />
        <div className="mt-2">
          <Hierarchy chain={REPORTING_CHAIN} />
        </div>
      </FigureFrame>
    ),
  },

  "research-and-tracker": {
    note: "The research programme and the service-delivery tracker.",
    render: () => (
      <FigureFrame series={RESEARCH_SPLIT}>
        <TierGrid
          tiers={RESEARCH_TIERS}
          flow="The evidence tests feed the tracker: what the ward-level record establishes about a ward becomes a baseline the tracker publishes against."
        />
      </FigureFrame>
    ),
  },

  "research-modules": {
    note: "Three research instruments and the decision each unlocks.",
    render: () => (
      <FigureFrame series={MODULES_SERIES}>
        <SpecTable
          caption="§18.5 recognition-deficit research architecture"
          columns={["Evidence test", "Method", "Record read", "Timing", "Decision unlocked"]}
          rows={RESEARCH_MODULES}
          emphasise={4}
        />
      </FigureFrame>
    ),
  },

  "delivery-tracker": {
    note: "Four delivery dimensions, their statutory sources and cadence.",
    render: () => (
      <FigureFrame series={TRACKER_SERIES}>
        <SpecTable
          caption="§15.1.1 public service-delivery tracker architecture"
          columns={["Core delivery dimension", "Primary statutory data sources", "Update cadence & verification"]}
          rows={TRACKER_DIMENSIONS}
        />
      </FigureFrame>
    ),
  },

  "production-pipeline": {
    note: "The content types, two engines, one approval gateway.",
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
    note: "Five channels, their technical specification and creative treatment.",
    render: () => (
      <FigureFrame series={FORMAT_SERIES}>
        <SpecTable
          caption="§15.1.2 production format specifications by channel"
          columns={["Channel & medium", "Technical specification", "Language & creative treatment"]}
          rows={FORMAT_SPECS}
        />
      </FigureFrame>
    ),
  },

  "weekly-cycle": {
    note: "The seven-day production cycle, focus and outputs per day.",
    render: () => (
      <FigureFrame series={WEEKLY_SERIES}>
        <SpecTable
          caption="§15.1.2 weekly 7-day content production cycle"
          columns={["Day", "Production focus & milestones", "Output deliverables"]}
          rows={WEEKLY_CYCLE}
        />
      </FigureFrame>
    ),
  },

  "approval-gateway": {
    note: "The four steps every asset passes before dispatch.",
    render: () => (
      <FigureFrame series={APPROVAL_SERIES}>
        <Stepper stages={APPROVAL_STEPS} />
      </FigureFrame>
    ),
  },

  "asset-library": {
    note: "The seven vaults of the campaign asset repository.",
    render: () => (
      <FigureFrame series={LIBRARY_SERIES}>
        <Tree root={ASSET_LIBRARY.root} nodes={ASSET_LIBRARY.nodes} />
      </FigureFrame>
    ),
  },

  "field-loop": {
    note: "The closed loop between field intelligence and published response.",
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
    note: "Four report types, their frequency, channel and captured fields.",
    render: () => (
      <FigureFrame series={FIELD_REPORTS_SERIES}>
        <SpecTable
          caption="§15.3.1 ward coordinator field reporting protocol"
          columns={["Report type", "Frequency", "Channel", "Data captured"]}
          rows={FIELD_REPORTS}
          emphasise={1}
        />
      </FigureFrame>
    ),
  },

  "four-hour-cycle": {
    note: "Ground report to synchronised deployment, on the clock.",
    render: () => (
      <FigureFrame series={CYCLE_SERIES}>
        <Stepper stages={FOUR_HOUR_CYCLE} />
      </FigureFrame>
    ),
  },

  "operating-rhythm": {
    note: "Seven standing forums, their owners and participants.",
    render: () => (
      <FigureFrame series={RHYTHM_SERIES}>
        <SpecTable
          caption="§15.3.1 campaign operational rhythm and governance cadence"
          columns={["Cadence & time (EAT)", "Forum", "Agenda", "Primary owner", "Participants"]}
          rows={OPERATING_RHYTHM}
        />
      </FigureFrame>
    ),
  },

  "data-layer": {
    note: "Capture, validation, output, and the encrypted core beneath them.",
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
    note: "The supporter record, field by field.",
    render: () => (
      <FigureFrame series={SUPPORTER_SCHEMA_SERIES}>
        <SpecTable
          caption="§15.4.1 supporter record schema specification"
          columns={["Field name", "Data type", "Description & constraints"]}
          rows={SUPPORTER_SCHEMA}
        />
      </FigureFrame>
    ),
  },

  "dpa-compliance": {
    note: "Six sections of the Data Protection Act 2019, and what each obliges.",
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
    note: "The four tiers of the campaign technology stack.",
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
    note: "Five components, their DPA risk level, and their decision status.",
    render: () => (
      <FigureFrame series={PROCUREMENT_SERIES}>
        <SpecTable
          caption="§15.4.3 technology stack master procurement matrix"
          columns={["System component", "Recommended vendor", "DPA risk level", "Decision status"]}
          rows={PROCUREMENT}
          emphasise={2}
        />
      </FigureFrame>
    ),
  },

  "bypass-architecture": {
    note: "The four bypass pillars and the protocol for each.",
    render: () => (
      <FigureFrame series={BYPASS_SERIES}>
        <Stepper
          stages={BYPASS_PILLARS.map((p) => ({ title: p.label, steps: [p.detail] }))}
        />
      </FigureFrame>
    ),
  },

  "counter-fire": {
    note: "Three ground rumours paired with the evidence that answers each.",
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
    note: "Four terms, the literal translation that fails, and the approved Kikamba idiom.",
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
    note: "The four gates between an English draft and a Kikamba broadcast.",
    render: () => (
      <FigureFrame series={QC_SERIES}>
        <Stepper stages={QC_STAGES} />
      </FigureFrame>
    ),
  },

  "language-map": {
    note: "The three languages, their reach, their audiences and their channels.",
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
                      <strong className="font-bold text-gold">Under review — C-21.</strong> §15.3.3 states
                      that the Communications Authority restricts political bulk SMS to English or
                      Kiswahili, and that an operator may refuse a non-compliant message. §12.4
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
    note: "Seven output media, each allocated across languages.",
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

  "constituency-power": {
    note: "The eight constituencies, ranked, with the Big 4 bracket.",
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

};

/**
 * Where §3.1–§3.4 would have drawn a figure the §3 story now carries: one line that names the
 * figure and links up to the step that holds it, with its sources, table and CSV.
 */
function StoryPointer({ spec }: { spec: { id: string; title: string; section: string } }) {
  return (
    <p className="pf-storyptr not-prose">
      <a href={`#${spec.id}`}>
        <span className="pf-storyptr__k">Figure</span>
        <span className="pf-storyptr__t">{spec.title}</span>
        <span className="pf-storyptr__h">In the four-step story at the start of this part, with its sources, table and CSV</span>
      </a>
    </p>
  );
}

/**
 * Legacy figures collapsed into the register figure that already drew the same facts (consolidation
 * pass, Step 3). The fence stays where it was, so every check keyed on it holds, and renders a
 * pointer to the surviving figure. Each is also recorded in scripts/figure-retirements.json.
 */
const COLLAPSED: Record<string, string> = {
  "nomination-scorecard": "fig-5-6-kpis",
  "ge-scorecard": "fig-5-6-kpis",
};

function CollapsedPointer({ spec }: { spec: { id: string; title: string } }) {
  return (
    <p className="pf-storyptr not-prose">
      <a href={`#${spec.id}`}>
        <span className="pf-storyptr__k">Figure</span>
        <span className="pf-storyptr__t">{spec.title}</span>
        <span className="pf-storyptr__h">Drawn once, above, with every indicator, its baseline, target, method and owner</span>
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
  const survivor = COLLAPSED[id] ? REGISTER[COLLAPSED[id]] : undefined;
  if (survivor) return <CollapsedPointer spec={survivor} />;
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
  // A framed figure carries its own "Show the details" control; anything else drawn here is a bespoke
  // panel, and goes behind the panel control like every other mounted panel.
  const node = entry.render();
  if (isValidElement(node) && node.type === FigureFrame) return node;
  return <PanelFold>{node}</PanelFold>;
}

export { GapBar };
