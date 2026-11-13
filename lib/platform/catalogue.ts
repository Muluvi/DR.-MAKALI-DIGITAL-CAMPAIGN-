/**
 * Every dataset in the data pack, as rows the data explorer can search, filter, sort and export.
 * Server only (reads data/analysis/ from disk so a team edit is picked up on the next build).
 *
 * Columns are the fields each dataset actually has. A column is offered as a filter only when it
 * has a small set of distinct values (a constituency, a sector, a tier, a state), so a filter can
 * never offer a dimension the data does not carry. Nothing is summarised away: every record in the
 * data pack is a row here (the preservation manifest counts them).
 */
import fs from "node:fs";
import path from "node:path";
import { FIGURES, WARD_ROWS } from "../data/figures";
import { formatFigure } from "../data/format";
import { tierWord } from "../../data/types";
import { CONSTITUENCIES } from "../../data/ward-register";
import { PROJECTS } from "../../data/projects";
import { GENERAL_ELECTION_KPIS, NOMINATION_KPIS, RECOGNITION_INDICATORS } from "../../data/kpis";
import { SEGMENTS } from "../../data/segments";
import { RADIO_STATIONS } from "../../data/media-ownership";
import { PILLARS, CONTENT_TYPES } from "../../data/message-architecture";
import { PLOTTED_BENCHMARKS } from "../../data/benchmarks";
import { ELECTORAL_HISTORY } from "../../data/electoral-history";
import { PLATFORM_AUDIENCES } from "../../data/external-figures";
import { USSD_MENU, SMS_SPECIMENS } from "../../data/ussd-specimen";
import { TIER_ATTRIBUTES } from "../../data/tier-matrix";
import { PHASES } from "../phases";

export type Cell = string | number | null;
export interface Column {
  key: string;
  label: string;
  numeric: boolean;
  /** Distinct values, when few enough to filter by. */
  values?: string[];
}
export interface Dataset {
  id: string;
  label: string;
  group: "Figures" | "Electorate" | "County records" | "Analysis" | "Strategy lists" | "Team records";
  description: string;
  columns: Column[];
  rows: Record<string, Cell>[];
}
export interface DatasetMeta {
  id: string;
  label: string;
  group: Dataset["group"];
  count: number;
}

const FILTER_MAX = 14;

function toCell(v: unknown): Cell {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.map((x) => (typeof x === "object" ? JSON.stringify(x) : String(x))).join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/** Flattens one level of nesting ("baseline.note"), so every field of a record is a column. */
function flatten(rec: object): Record<string, Cell> {
  const out: Record<string, Cell> = {};
  for (const [k, v] of Object.entries(rec)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const [k2, v2] of Object.entries(v)) out[`${k}.${k2}`] = toCell(v2);
    } else out[k] = toCell(v);
  }
  return out;
}

const humanise = (k: string) => {
  const s = k.replace(/[._]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function columnsOf(rows: Record<string, Cell>[], labels: Record<string, string> = {}, order?: string[]): Column[] {
  const keys = order ?? [...new Set(rows.flatMap((r) => Object.keys(r)))];
  return keys.map((key) => {
    const vals = rows.map((r) => r[key]).filter((v) => v !== null && v !== "");
    const numeric = vals.length > 0 && vals.every((v) => typeof v === "number");
    const distinct = [...new Set(vals.map(String))];
    return { key, label: labels[key] ?? humanise(key), numeric, values: !numeric && distinct.length > 1 && distinct.length <= FILTER_MAX && distinct.length < vals.length ? distinct.sort() : undefined };
  });
}

function make(id: string, label: string, group: Dataset["group"], description: string, records: readonly object[], labels: Record<string, string> = {}, order?: string[]): Dataset {
  const rows = records.map(flatten);
  return { id, label, group, description, rows, columns: columnsOf(rows, labels, order) };
}

const STATE_WORD: Record<string, string> = { sourced: "Sourced", modelled: "Modelled", target: "Target", needed: "Needed" };

function figuresDataset(): Dataset {
  const rows = Object.values(FIGURES)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((f) => ({
      id: f.id,
      topic: f.id.split(".")[0],
      printed: f.value === null ? "Not in hand" : formatFigure(f),
      value: f.value,
      unit: f.unit,
      state: STATE_WORD[f.state] ?? f.state,
      reliability: tierWord(f.tier) || null,
      source: f.source,
      asOf: f.asOf ?? null,
      note: f.note ?? null,
    }));
  return {
    id: "figures",
    label: "Every figure on the site",
    group: "Figures",
    description: "The registry: every number the story, charts and tables print, with its source and reliability.",
    rows,
    columns: columnsOf(rows, { asOf: "As of", printed: "As printed" }).map((c) => (c.key === "topic" ? { ...c, values: [...new Set(rows.map((r) => r.topic))].sort() } : c)),
  };
}

function analysisDatasets(): Dataset[] {
  const dir = path.join(process.cwd(), "data", "analysis");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f !== "manifest.json" && f !== "projects-register.json")
    .sort()
    .map((f) => {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; title: string; description: string; values: Record<string, unknown>[] };
      const records = d.values.map(({ dims, ...v }) => ({ ...v, ...((dims as object) ?? {}), tier: tierWord(v.tier as number) }));
      return make(`analysis-${d.id}`, d.title, "Analysis", d.description, records, { as_of: "As of", source_id: "Source" });
    });
}

export function packDatasets(): Dataset[] {
  return [
    figuresDataset(),
    make("wards", "Registered voters by ward", "Electorate", "IEBC 2022 register, all 40 wards.", WARD_ROWS.map(({ id, ...w }) => ({ ...w, figure: id })), { voters: "Registered voters" }),
    make("constituencies", "Registered voters by constituency", "Electorate", "IEBC 2022 register, the eight constituencies.", CONSTITUENCIES.map((c) => ({ name: c.name, voters: c.voters, wards: c.wards.length })), { voters: "Registered voters", wards: "Wards" }),
    make("electoral-history", "Election results since 2013", "Electorate", "Kitui races in the record, as the story cites them.", ELECTORAL_HISTORY),
    make("projects", "County projects, itemised", "County records", "Every project in the county's Three-Year Scorecard, placed on wards where the printed place allows.", PROJECTS.map(({ provenance, ...p }) => ({ ...p, tier: tierWord(provenance.tier), as_of: provenance.as_of })), { amount: "Cost (KSh)", asPrinted: "As printed" }),
    ...analysisDatasets(),
    make("kpis", "Indicators", "Strategy lists", "The nomination and general-election scorecards.", [...NOMINATION_KPIS.map((k) => ({ scorecard: "Nomination", ...k })), ...GENERAL_ELECTION_KPIS.map((k) => ({ scorecard: "General election", ...k }))]),
    make("recognition", "Recognition indicators", "Strategy lists", "Recognition where Dr. Mulu is least known.", RECOGNITION_INDICATORS),
    make("pillars", "Message pillars", "Strategy lists", "The three pillars the message is argued through.", PILLARS),
    make("content-types", "Content types", "Strategy lists", "The four content types the weekly brief allocates.", CONTENT_TYPES),
    make("segments", "Voter segments", "Strategy lists", "The six segments, each sized by a registry figure where one is published.", SEGMENTS),
    make("radio", "Radio stations", "Strategy lists", "Vernacular and national stations, ownership and reach.", RADIO_STATIONS),
    make("benchmarks", "Benchmarks and targets", "Strategy lists", "Global benchmarks beside the campaign's targets.", PLOTTED_BENCHMARKS),
    make("platform-audiences", "Platform audiences", "Strategy lists", "Published audience sizes by platform.", PLATFORM_AUDIENCES),
    make("ussd-menu", "USSD menu", "Strategy lists", "The menu specimen, in Kikamba and English.", USSD_MENU),
    make("sms-specimens", "SMS specimens", "Strategy lists", "The SMS formats and their frequency.", SMS_SPECIMENS),
    make("phases", "Phases", "Strategy lists", "The campaign calendar.", PHASES),
    make("scope-levels", "Scope levels", "Strategy lists", "What each scope level carries.", TIER_ATTRIBUTES),
  ];
}

export const meta = (d: Dataset): DatasetMeta => ({ id: d.id, label: d.label, group: d.group, count: d.rows.length });
