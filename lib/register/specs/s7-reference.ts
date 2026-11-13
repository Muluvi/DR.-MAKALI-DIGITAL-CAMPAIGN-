/**
 * The figures that used to be drawn by the legacy system (components/figures/registry.tsx, from
 * lib/figures/*), as FigureSpecs (consolidation pass, Step 3 completed).
 *
 * Each keeps its id, so the ```figure fence in content still resolves, and its headline as its
 * title. Its data stays where it was (lib/figures/*.ts holds the qualitative tables, steps and
 * grids, and reads every number from the registry), and is drawn here through four adapters: a
 * table becomes a matrix, a stepper becomes steps, a tier grid becomes cards, and paired rows
 * become a two-column matrix. Every one now gets the register's frame: sources with their
 * reliability, a table view and a CSV.
 */
import register from "../../../data/ward-register.json" with { type: "json" };
import { figure } from "../../data/figures.ts";
import { formatFigure } from "../../data/format.ts";
import type { Chart, Column, FigureSpec, Row, SourceRef } from "../types.ts";
import type { FigureSeries } from "../../figures/types.ts";
import {
  AUDIENCE_FACETS, AUDIENCE_SERIES, CHANNEL_MESSAGE_SERIES, ESCALATION_LADDER, ESCALATION_SERIES,
  HOLDING_POSITIONS, HOLDING_SERIES, MATRIX_SERIES, MESSAGE_BY_CHANNEL, MESSAGE_BY_SEGMENT,
  RESPONSE_MATRIX, RESPONSE_SLA, SEGMENT_MESSAGE_SERIES, SLA_SERIES,
  VISIT_LOOP, VISIT_SERIES,
} from "../../figures/annex.ts";
import {
  CLEARANCE_SERIES, COMPLIANCE_SERIES, COMPLIANCE_TIERS, IEBC_CLEARANCES, LIABILITY_MATRIX, LIABILITY_SERIES, ORG_BRANCHES,
  ORG_CHAIN, ORG_SERIES, REPORTING_CHAIN, REPORTING_SERIES, REPORTING_TEAMS, ROLES_SERIES, ROLE_OWNERSHIP,
} from "../../figures/governance.ts";
import { MODULES_SERIES, RESEARCH_MODULES, RESEARCH_SPLIT, RESEARCH_TIERS, TRACKER_DIMENSIONS, TRACKER_SERIES } from "../../figures/research.ts";
import {
  APPROVAL_SERIES, APPROVAL_STEPS, ASSET_LIBRARY, FORMAT_SERIES, FORMAT_SPECS, LIBRARY_SERIES, PRODUCTION_SERIES,
  PRODUCTION_TIERS, WEEKLY_CYCLE, WEEKLY_SERIES,
} from "../../figures/production.ts";
import { CYCLE_SERIES, FIELD_LOOP, FIELD_LOOP_TIERS, FIELD_REPORTS, FIELD_REPORTS_SERIES, FOUR_HOUR_CYCLE, OPERATING_RHYTHM, RHYTHM_SERIES } from "../../figures/ground.ts";
import {
  DATA_LAYER, DATA_LAYER_CORE, DATA_LAYER_TIERS, DPA_COMPLIANCE, DPA_SERIES, PROCUREMENT, PROCUREMENT_SERIES, STACK_SERIES,
  STACK_TIERS, SUPPORTER_SCHEMA, SUPPORTER_SCHEMA_SERIES,
} from "../../figures/data-layer.ts";
import { COUNTER_FIRE, COUNTER_FIRE_SERIES, CULTURAL_REGISTERS, QC_SERIES, QC_STAGES, REGISTERS_SERIES } from "../../figures/messaging.ts";
import { LANGUAGES, LANGUAGE_DEPLOYMENT, LANGUAGE_SPLIT } from "../../figures/language.ts";
import { BYPASS_PILLARS } from "../../figures/media.ts";
import { pageDeep } from "../../reader-text.ts";

const PROPOSAL: SourceRef = { name: "This proposal", tier: null, state: "target" };
const TIER_CODE = { 1: "T1", 2: "T2", 3: "T3" } as const;

/** The sources a series' points carry, named once each; the proposal itself when it has none. */
function sourcesOf(series: FigureSeries): SourceRef[] {
  const seen = new Map<string, SourceRef>();
  for (const p of series.points) if (!seen.has(p.source.name)) seen.set(p.source.name, { name: p.source.name, tier: TIER_CODE[p.tier] ?? null, state: p.kind === "official" ? undefined : "modelled" });
  return seen.size ? [...seen.values()] : [PROPOSAL];
}

/** The frame every adapter shares: id, title, question, takeaway and sources from the series. */
function base(id: string, series: FigureSeries, chart: Chart, columns: Column[], rows: Row[], notes: (string | undefined)[] = []): FigureSpec {
  return {
    id,
    section: "reference",
    title: series.headline,
    question: series.measure,
    takeaway: series.note ?? series.headline,
    sources: sourcesOf(series),
    chart,
    columns,
    rows,
    notes: notes.filter((n): n is string => !!n),
  };
}

const keys = (header: string[]) => header.map((label, i) => ({ key: `c${i}`, label }));
const cellsOf = (row: string[]) => Object.fromEntries(row.map((v, i) => [`c${i}`, v]));

/** A table of text: the first column heads each row. */
function table(id: string, series: FigureSeries, header: string[], rows: string[][], notes: string[] = []): FigureSpec {
  return base(id, series, { type: "matrix", header, rows: rows.map((r) => ({ head: r[0], cells: r.slice(1) })) }, keys(header), rows.map((r) => ({ cells: cellsOf(r) })), notes);
}

/** Ordered stages, each with its steps. */
function stepper(id: string, series: FigureSeries, stages: { title: string; steps: string[]; at?: string }[], notes: string[] = []): FigureSpec {
  return base(
    id, series,
    { type: "steps", steps: stages.map((s) => ({ title: s.title, body: s.steps.join(" "), when: s.at || undefined })) },
    keys(["Stage", "What happens"]),
    stages.map((s) => ({ cells: cellsOf([s.at ? `${s.at} · ${s.title}` : s.title, s.steps.join(" ")]) })),
    notes,
  );
}

/** Groups of items, one card each; the flow line says how they connect. */
function grid(id: string, series: FigureSeries, tiers: { label: string; items: string[] }[], flow?: string, columns: 2 | 3 | 4 = 2): FigureSpec {
  return base(
    id, series,
    { type: "cards", columns, cards: tiers.map((t) => ({ title: t.label, body: t.items.join(" · ") })) },
    keys(["Group", "What it holds"]),
    tiers.map((t) => ({ cells: cellsOf([t.label, t.items.join(" · ")]) })),
    [flow],
  );
}

/** Two columns that read across: a requirement and its implementation, a rumour and its answer. */
function paired(id: string, series: FigureSeries, left: string, right: string, rows: { left: string; right: string[]; note?: string }[]): FigureSpec {
  const body = (r: { right: string[]; note?: string }) => [...r.right, r.note ? `(${r.note})` : ""].filter(Boolean).join(" ");
  return base(
    id, series,
    { type: "matrix", header: [left, right], rows: rows.map((r) => ({ head: r.left, cells: [body(r)] })) },
    keys([left, right]),
    rows.map((r) => ({ cells: cellsOf([r.left, body(r)]) })),
  );
}

/* ------------------------------------------------------------------ the series defined with their figures */

const DEPLOYMENT_SERIES: FigureSeries = {
  id: "language-deployment",
  headline: "Every medium is allocated to the whole, and only one of them is allocated to Kikamba alone",
  measure: "The language allocation per campaign output medium. Each row totals 100%.",
  points: [],
  note:
    "The bulk SMS row gives Kikamba no allocation, as the bulk SMS rule requires: the Communications " +
    "Authority restricts political bulk SMS to English or Kiswahili. USSD is not restricted, and takes 50% Kikamba here.",
};

const BYPASS_SERIES: FigureSeries = {
  id: "bypass-architecture",
  headline: `Four ways to reach ${formatFigure(figure("register.2022"))} voters without a commercial gatekeeper's permission`,
  measure: "The gatekeeper bypass and direct reach architecture: the operational protocol for each route",
  points: [],
  note:
    "Four routes run in parallel but are stood up in order. Mang'elete, named in the first route, is in no ownership " +
    "map; the ownership map in Who owns the airwaves governs.",
};

/* ------------------------------------------------------------------ constituency power, from the register */

type Constituency = { id: string; name: string; voters: number; wards: { name: string; voters: number }[] };
const CONS = [...(register.constituencies as Constituency[])].sort((a, b) => b.voters - a.voters);
const TOTAL = figure("register.2022").value as number;
const BIG4 = CONS.slice(0, 4);
const BIG4_TOTAL = BIG4.reduce((n, c) => n + c.voters, 0);
const BIG4_WARDS = BIG4.reduce((n, c) => n + c.wards.length, 0);
const share = (n: number) => ((n / TOTAL) * 100).toFixed(2);
const group = (n: number) => n.toLocaleString("en-GB");

const FIG_CONSTITUENCY_POWER: FigureSpec = {
  id: "constituency-power",
  section: "reference",
  title: `Four of the eight constituencies hold ${group(BIG4_TOTAL)} voters, ${share(BIG4_TOTAL)}% of the county, across ${BIG4_WARDS} wards`,
  question: "Registered voters per constituency, largest first, with ward count and average ward size",
  takeaway: `The "Big 4" (${BIG4.map((c) => c.name).join(", ")}) are where the register is; read with the ward map, they are where the effort is weighed.`,
  sources: [{ name: figure("register.2022").source ?? "IEBC", tier: "T1" }],
  chart: { type: "bars", bars: CONS.map((c, i) => ({ label: c.name, value: c.voters, state: "sourced" as const, tone: i < 4 ? ("accent" as const) : ("neutral" as const), note: `${share(c.voters)}% · ${c.wards.length} wards` })), unit: "voters" },
  columns: [{ key: "name", label: "Constituency" }, { key: "voters", label: "Registered voters, 2022", numeric: true }, { key: "share", label: "Share, %", numeric: true }, { key: "wards", label: "Wards", numeric: true }, { key: "avg", label: "Average ward", numeric: true }],
  rows: CONS.map((c) => ({ cells: { name: c.name, voters: c.voters, share: Number(share(c.voters)), wards: c.wards.length, avg: Math.round(c.voters / c.wards.length) } })),
};

/* ------------------------------------------------------------------ the language map */

const FIG_LANGUAGE_MAP: FigureSpec = {
  ...base(
    "language-map", LANGUAGE_SPLIT,
    {
      type: "composite",
      parts: [
        { heading: "Primary reach, by language", chart: { type: "bars", bars: LANGUAGES.map((l) => ({ label: l.name, value: l.share, state: "modelled" as const, display: `~${l.share}%` })), unit: "%" } },
        { heading: "Who each language reaches, and through which channels", chart: { type: "cards", columns: 3, cards: LANGUAGES.map((l) => ({ kicker: `~${l.share}%`, title: l.name, body: `Audiences: ${l.audiences.join(" · ")}. Channels: ${l.channels.join(" · ")}.`, meta: l.objective })) } },
      ],
    },
    keys(["Language", "Primary reach, %", "Audiences", "Channels", "Objective"]),
    LANGUAGES.map((l) => ({ cells: cellsOf([l.name, String(l.share), l.audiences.join(" · "), l.channels.join(" · "), l.objective]) })),
    ["Political bulk SMS is English or Kiswahili only (Communications Authority); Kikamba travels by voice note and radio."],
  ),
};

const mix = (r: (typeof LANGUAGE_DEPLOYMENT)[number]) => [r.primary, ...r.secondary].map((s) => `${s.language} ${s.share}%`).join(" · ");
const FIG_LANGUAGE_DEPLOYMENT = table(
  "language-deployment", DEPLOYMENT_SERIES, ["Medium", "Language mix", "Note"],
  LANGUAGE_DEPLOYMENT.map((r) => [r.medium, mix(r), r.note ?? ""]),
);

/* ------------------------------------------------------------------ the rest, one adapter each */

const RAW: FigureSpec[] = [
  grid("audience-overview", AUDIENCE_SERIES, AUDIENCE_FACETS, "Connectivity and language are the two facets the rest of the proposal turns on.", 3),
  stepper("visit-loop", VISIT_SERIES, VISIT_LOOP),
  table("message-by-segment", SEGMENT_MESSAGE_SERIES, ["Target segment", "Tailored message & Kikamba framing", "Verifiable evidence & data source"], MESSAGE_BY_SEGMENT),
  table("message-by-channel", CHANNEL_MESSAGE_SERIES, ["Channel & reach", "Format, tone & linguistic style", "Evidential proof points"], MESSAGE_BY_CHANNEL),
  stepper("escalation-ladder", ESCALATION_SERIES, ESCALATION_LADDER),
  table("response-matrix", MATRIX_SERIES, ["Severity tier", "Definition & impact threshold", "Strategic response protocol", "Turnaround target", "Approved by"], RESPONSE_MATRIX),
  table("response-sla", SLA_SERIES, ["Channel & platform", "Response time target"], RESPONSE_SLA),
  table("holding-positions", HOLDING_SERIES, ["Question", "Attack line", "Holding message", "Kikamba framing", "Primary source"], HOLDING_POSITIONS.map((p) => [p.question, p.attack, p.holding, p.kikamba, p.source])),
  grid("compliance-architecture", COMPLIANCE_SERIES, COMPLIANCE_TIERS, "Nomination clearance first, then the data-protection regime the voter database sits under, then the offences that govern what may be said and when.", 3),
  table("iebc-clearance", CLEARANCE_SERIES, ["Clearance dimension", "Statutory standard & issuing authority", "Current status & legal verification"], IEBC_CLEARANCES),
  table("liability-matrix", LIABILITY_SERIES, ["Legal dimension", "Statutory obligation / exposure risk", "Campaign risk mitigation protocol"], LIABILITY_MATRIX),
  base(
    "org-chart", ORG_SERIES,
    { type: "composite", parts: [
      { heading: "The chain of command", chart: { type: "steps", steps: ORG_CHAIN.map((c) => ({ title: c.role, body: "" })) } },
      { heading: "What each lead directs", chart: { type: "cards", columns: 3, cards: ORG_BRANCHES.map((b) => ({ title: b.label, body: b.items.join(" · ") })) } },
    ] },
    keys(["Role or lead", "Directs"]),
    [...ORG_CHAIN.map((c) => ({ cells: cellsOf([c.role, ""]) })), ...ORG_BRANCHES.map((b) => ({ cells: cellsOf([b.label, b.items.join(" · ")]) }))],
  ),
  table("role-ownership", ROLES_SERIES, ["Core role", "Primary strategic & operational ownership", "Specialist subcontractors directed"], ROLE_OWNERSHIP),
  base(
    "reporting-lines", REPORTING_SERIES,
    { type: "composite", parts: [
      { heading: "The two teams", chart: { type: "cards", columns: 2, cards: REPORTING_TEAMS.map((t) => ({ title: t.label, body: t.items.join(" · ") })) } },
      { heading: "The reporting line", chart: { type: "steps", steps: REPORTING_CHAIN.map((c) => ({ title: c.role, body: "" })) } },
    ] },
    keys(["Team or role", "Detail"]),
    [...REPORTING_TEAMS.map((t) => ({ cells: cellsOf([t.label, t.items.join(" · ")]) })), ...REPORTING_CHAIN.map((c) => ({ cells: cellsOf([c.role, ""]) }))],
    ["Both teams meet at the weekly brief."],
  ),
  grid("research-and-tracker", RESEARCH_SPLIT, RESEARCH_TIERS, "The evidence tests feed the tracker: what the ward-level record establishes about a ward becomes a baseline the tracker publishes against."),
  table("research-modules", MODULES_SERIES, ["Evidence test", "Method", "Record read", "Timing", "Decision unlocked"], RESEARCH_MODULES),
  table("delivery-tracker", TRACKER_SERIES, ["Core delivery dimension", "Primary statutory data sources", "Update cadence & verification"], TRACKER_DIMENSIONS),
  grid("production-pipeline", PRODUCTION_SERIES, PRODUCTION_TIERS, "The content types feed both engines, and both engines leave through the gateway: nothing routes around it."),
  table("format-specs", FORMAT_SERIES, ["Channel & medium", "Technical specification", "Language & creative treatment"], FORMAT_SPECS),
  table("weekly-cycle", WEEKLY_SERIES, ["Day", "Production focus & milestones", "Output deliverables"], WEEKLY_CYCLE),
  stepper("approval-gateway", APPROVAL_SERIES, APPROVAL_STEPS),
  base(
    "asset-library", LIBRARY_SERIES,
    { type: "cards", columns: 2, cards: ASSET_LIBRARY.nodes.map((n) => ({ kicker: ASSET_LIBRARY.root, title: n.label, body: (n.children ?? []).join(" · ") })) },
    keys(["Folder", "Contents"]),
    ASSET_LIBRARY.nodes.map((n) => ({ cells: cellsOf([n.label, (n.children ?? []).join(" · ")]) })),
  ),
  grid("field-loop", FIELD_LOOP, FIELD_LOOP_TIERS, "Inbound feeds the war room; the war room feeds the outbound pipeline and the physical channels; what those produce comes back as field intelligence."),
  table("field-reports", FIELD_REPORTS_SERIES, ["Report type", "Frequency", "Channel", "Data captured"], FIELD_REPORTS),
  stepper("four-hour-cycle", CYCLE_SERIES, FOUR_HOUR_CYCLE),
  table("operating-rhythm", RHYTHM_SERIES, ["Cadence & time (EAT)", "Forum", "Agenda", "Primary owner", "Participants"], OPERATING_RHYTHM),
  grid("data-layer", DATA_LAYER, [...DATA_LAYER_TIERS, DATA_LAYER_CORE], "Capture feeds validation; validation feeds the channels; everything passes through the encrypted core."),
  table("supporter-schema", SUPPORTER_SCHEMA_SERIES, ["Field name", "Data type", "Description & constraints"], SUPPORTER_SCHEMA),
  paired("dpa-compliance", DPA_SERIES, "Legal requirement", "Operational campaign implementation", DPA_COMPLIANCE.map((r) => ({ left: r.requirement, right: r.implementation }))),
  grid("tech-stack", STACK_SERIES, STACK_TIERS, "The gateway collects, the CRM holds it encrypted, and the analysis and publishing tiers work on public and anonymised data."),
  table("procurement-matrix", PROCUREMENT_SERIES, ["System component", "Recommended vendor", "DPA risk level", "Decision status"], PROCUREMENT),
  stepper("bypass-architecture", BYPASS_SERIES, BYPASS_PILLARS.map((p) => ({ title: p.label, steps: [p.detail] }))),
  paired("counter-fire", COUNTER_FIRE_SERIES, "Competitor ground rumour", "Factual evidence-backed counter-fire", COUNTER_FIRE.map((r) => ({ left: r.rumour, right: r.answers, note: r.note }))),
  paired("cultural-registers", REGISTERS_SERIES, "Literal / bad translation", "Approved cultural Kikamba framing", CULTURAL_REGISTERS.map((r) => ({ left: `${r.literal} (${r.literalWhy}, for “${r.term}”)`, right: [r.approved, `“${r.gloss}”`] }))),
  stepper("qc-gateway", QC_SERIES, QC_STAGES),
  FIG_LANGUAGE_MAP,
  FIG_LANGUAGE_DEPLOYMENT,
  FIG_CONSTITUENCY_POWER,
];

/** Their prose in plain words (lib/reader-text.ts pageDeep): no old section citations on the page. */
export const S7: FigureSpec[] = RAW.map((s) => pageDeep(s));
