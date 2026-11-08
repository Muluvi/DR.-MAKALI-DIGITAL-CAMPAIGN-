/**
 * The data-pack editor's engine. Server only.
 *
 * An edit is described as a Target. apply() reads the file it touches, as it stands on main,
 * makes the change, and runs the data pack's own rules over the result (lib/data/rules.ts, the same
 * code `npm run verify` runs). If any rule fails, the edit is refused with a plain-language message
 * and nothing is written. If they pass, the change is committed to its own branch and the full
 * `npm run verify` and `npm run check:preservation` run in CI before it reaches main.
 *
 * Every edit is logged with what it changed from and to, so a revert restores the exact previous
 * value. Nothing is deleted: the only removal possible is reverting a record the team itself added.
 */
import fs from "node:fs";
import path from "node:path";
import { FIGURES } from "../data/figures";
import type { Figure, Tier, Unit, FigureState } from "../data/schema";
import { figureProblems, wardRegisterProblems, type WardRegister } from "../data/rules";
import { GENERAL_ELECTION_KPIS, NOMINATION_KPIS } from "../../data/kpis";
import { RISKS } from "../../data/risks";
import { SEGMENTS } from "../../data/segments";
import { SEVERITY_TIERS } from "../../data/escalation";
import { CONTENDERS } from "../../data/competitors";
import { RADIO_STATIONS } from "../../data/media-ownership";
import { PILLARS, CONTENT_TYPES } from "../../data/message-architecture";
import { PLOTTED_BENCHMARKS } from "../../data/benchmarks";
import { packMode } from "./config";
import { commitEdit, readMain } from "./github";

/* ------------------------------------------------------------------ what can be edited */

export { applyTo as preview };

export const FIGURE_FIELDS = ["value", "state", "tier", "source", "asOf", "note", "closesWith"] as const;
export type FigureField = (typeof FIGURE_FIELDS)[number];
export const STATES: FigureState[] = ["sourced", "modelled", "needed", "target"];
export const TIERS: Tier[] = ["T1", "T2", "T3"];
export const UNITS: Unit[] = ["voters", "votes", "people", "households", "count", "percent", "ksh", "km2", "per-km2", "persons"];

export interface EditableList {
  id: string;
  label: string;
  key: string;
  file: string;
  records: () => Record<string, unknown>[];
  /** Fields with a fixed set of values. */
  choices?: Record<string, (string | number)[]>;
}

/** The structured lists the team can edit, keyed as data/team/lists.json keys them. */
export const EDITABLE_LISTS: EditableList[] = [
  { id: "kpis.nomination", label: "Nomination indicators", key: "code", file: "data/kpis.ts", records: () => NOMINATION_KPIS as unknown as Record<string, unknown>[] },
  { id: "kpis.general-election", label: "General-election indicators", key: "code", file: "data/kpis.ts", records: () => GENERAL_ELECTION_KPIS as unknown as Record<string, unknown>[] },
  { id: "risks", label: "Risk register", key: "code", file: "data/risks.ts", records: () => RISKS as unknown as Record<string, unknown>[], choices: { likelihood: [1, 2, 3], impact: [1, 2, 3] } },
  { id: "segments", label: "Voter segments", key: "id", file: "data/segments.ts", records: () => SEGMENTS as unknown as Record<string, unknown>[] },
  { id: "escalation", label: "Response severity tiers", key: "name", file: "data/escalation.ts", records: () => SEVERITY_TIERS as unknown as Record<string, unknown>[] },
  { id: "contenders", label: "The field", key: "name", file: "data/competitors.ts", records: () => CONTENDERS as unknown as Record<string, unknown>[] },
  { id: "radio-stations", label: "Radio stations", key: "name", file: "data/media-ownership.ts", records: () => RADIO_STATIONS as unknown as Record<string, unknown>[] },
  { id: "pillars", label: "Message pillars", key: "title", file: "data/message-architecture.ts", records: () => PILLARS as unknown as Record<string, unknown>[] },
  { id: "content-types", label: "Content types", key: "code", file: "data/message-architecture.ts", records: () => CONTENT_TYPES as unknown as Record<string, unknown>[] },
  { id: "benchmarks", label: "Benchmarks and targets", key: "metric", file: "data/benchmarks.ts", records: () => PLOTTED_BENCHMARKS as unknown as Record<string, unknown>[] },
];
export const LIST_BY_ID = Object.fromEntries(EDITABLE_LISTS.map((l) => [l.id, l]));

/** A list's editable fields: the top-level strings and numbers its records carry. */
export function listFields(l: EditableList): { key: string; type: "string" | "number" }[] {
  const out = new Map<string, "string" | "number">();
  for (const r of l.records()) {
    for (const [k, v] of Object.entries(r)) {
      if (k === l.key) continue;
      if (typeof v === "string") out.set(k, "string");
      else if (typeof v === "number" && !out.has(k)) out.set(k, "number");
    }
  }
  return [...out].map(([key, type]) => ({ key, type }));
}

export const ANALYSIS_FIELDS = ["value", "note", "as_of", "status", "method", "tier", "source_id"] as const;
export const ANALYSIS_STATUS = ["confirmed", "verify", "placeholder"];
export const ANALYSIS_METHOD = ["official", "calculated", "modelled"];
export function analysisFiles(): string[] {
  return fs.readdirSync(path.join(process.cwd(), "data", "analysis")).filter((f) => f.endsWith(".json") && f !== "manifest.json").sort();
}

/* ------------------------------------------------------------------ targets */

export type Target =
  | { kind: "figure"; id: string; patch: Partial<Pick<Figure, FigureField>> }
  | { kind: "figure-add"; figure: Figure }
  | { kind: "figure-remove-added"; id: string }
  | { kind: "ward"; constituency: string; ward: string; voters: number; updateTotals: boolean }
  | { kind: "register-totals"; values: Record<string, number> }
  | { kind: "list"; list: string; key: string; patch: Record<string, unknown> }
  | { kind: "list-add"; list: string; record: Record<string, unknown> }
  | { kind: "list-remove-added"; list: string; key: string }
  | { kind: "analysis"; file: string; index: number; patch: Record<string, unknown> };

export interface Applied {
  file: string;
  text: string;
  title: string;
  /** The target that undoes this edit exactly. */
  undo: Target;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
}

export class Refused extends Error {
  problems: string[];
  constructor(problems: string[]) {
    super(problems.join(" "));
    this.problems = problems;
  }
}

const json = (t: string) => JSON.parse(t) as Record<string, unknown>;
const stringify = (o: unknown) => JSON.stringify(o, null, 2) + "\n";
const pick = (o: Record<string, unknown>, keys: string[]) => Object.fromEntries(keys.map((k) => [k, o[k] ?? null]));

function figureEditsFile(text: string) {
  const d = json(text) as { $comment?: string; patches: Record<string, Record<string, unknown>>; added: Figure[] };
  d.patches ??= {};
  d.added ??= [];
  return d;
}

/** Normalises a figure patch: empty strings become absent, numbers stay numbers. */
function cleanFigurePatch(p: Record<string, unknown>): Partial<Pick<Figure, FigureField>> {
  const out: Record<string, unknown> = {};
  for (const k of FIGURE_FIELDS) {
    if (!(k in p)) continue;
    const v = p[k];
    if (k === "value") out.value = v === "" || v === null || v === undefined ? null : Number(String(v).replace(/[,\s]/g, ""));
    else if (k === "tier") out.tier = v === "" || v === null ? null : v;
    else out[k] = v === "" || v === null ? undefined : String(v).trim();
  }
  return out as Partial<Pick<Figure, FigureField>>;
}

function applyTo(target: Target, text: string): Applied {
  switch (target.kind) {
    case "figure": {
      const cur = FIGURES[target.id];
      if (!cur) throw new Refused([`There is no figure with the id "${target.id}".`]);
      const patch = cleanFigurePatch(target.patch as Record<string, unknown>);
      const candidate = { ...cur, ...patch } as Figure;
      for (const k of Object.keys(patch)) if ((patch as Record<string, unknown>)[k] === undefined) delete (candidate as unknown as Record<string, unknown>)[k];
      const problems = figureProblems(target.id, candidate).map((p) => p.plain);
      if (problems.length) throw new Refused(problems);
      const d = figureEditsFile(text);
      const keys = Object.keys(patch);
      const before = pick(cur as unknown as Record<string, unknown>, keys);
      const merged: Record<string, unknown> = { ...(d.patches[target.id] ?? {}) };
      for (const [k, v] of Object.entries(patch)) merged[k] = v === undefined ? null : v;
      d.patches[target.id] = merged;
      return { file: "data/team/figures.json", text: stringify(d), title: `Figure ${target.id}`, before, after: pick(merged, keys), undo: { kind: "figure", id: target.id, patch: before as Partial<Pick<Figure, FigureField>> } };
    }
    case "figure-add": {
      const f = target.figure;
      if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(f.id)) throw new Refused(["A figure id is lowercase words joined by dots, such as reach.mwingi-north.2027."]);
      if (FIGURES[f.id]) throw new Refused([`A figure with the id "${f.id}" already exists. Edit it instead.`]);
      const problems = figureProblems(f.id, f).map((p) => p.plain);
      if (problems.length) throw new Refused(problems);
      const d = figureEditsFile(text);
      if (d.added.some((x) => x.id === f.id)) throw new Refused([`A figure with the id "${f.id}" is already waiting to go live.`]);
      d.added.push(f);
      return { file: "data/team/figures.json", text: stringify(d), title: `New figure ${f.id}`, before: {}, after: f as unknown as Record<string, unknown>, undo: { kind: "figure-remove-added", id: f.id } };
    }
    case "figure-remove-added": {
      const d = figureEditsFile(text);
      const f = d.added.find((x) => x.id === target.id);
      if (!f) throw new Refused(["Only a figure the team added can be taken back out, and this one is not in the team's additions."]);
      d.added = d.added.filter((x) => x.id !== target.id);
      return { file: "data/team/figures.json", text: stringify(d), title: `Take back figure ${target.id}`, before: f as unknown as Record<string, unknown>, after: {}, undo: { kind: "figure-add", figure: f } };
    }
    case "ward":
    case "register-totals": {
      // Both become one list of numbers to set: a ward's voters, a constituency's total
      // ("<name> total"), or a county total. The undo is the same list with the old numbers.
      const reg = json(text) as unknown as WardRegister;
      const values: Record<string, number> = {};
      if (target.kind === "ward") {
        const c = reg.constituencies.find((x) => x.name === target.constituency);
        const w = c?.wards.find((x) => x.name === target.ward);
        if (!c || !w) throw new Refused(["That ward is not in the register."]);
        if (!Number.isInteger(target.voters) || target.voters < 0) throw new Refused(["Registered voters must be a whole number."]);
        values[w.name] = target.voters;
        if (target.updateTotals) {
          const cSum = c.wards.reduce((n, x) => n + (x.name === w.name ? target.voters : x.voters), 0);
          values[`${c.name} total`] = cSum;
          const county = reg.constituencies.reduce((n, x) => n + (x.name === c.name ? cSum : x.voters), 0);
          values.countyTotalWards = county;
          values.countyTotalWithPrisons = county + reg.prisonVoters;
        }
      } else Object.assign(values, target.values);
      const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let out = text;
      const before: Record<string, number> = {};
      for (const [k, v] of Object.entries(values)) {
        if (k === "countyTotalWards" || k === "countyTotalWithPrisons" || k === "prisonVoters") {
          before[k] = reg[k];
          reg[k] = v;
          out = out.replace(new RegExp(`("${k}": )\\d+(,)`), `$1${v}$2`);
        } else if (k.endsWith(" total")) {
          const c = reg.constituencies.find((x) => x.name === k.slice(0, -" total".length));
          if (!c) throw new Refused([`${k} is not in the register.`]);
          const at = out.indexOf(`"name": "${c.name}"`);
          const vAt = out.indexOf(`"voters": ${c.voters},`, at);
          if (at < 0 || vAt < 0) throw new Refused([`Could not find the ${c.name} total in the register.`]);
          out = out.slice(0, vAt) + `"voters": ${v},` + out.slice(vAt + `"voters": ${c.voters},`.length);
          before[k] = c.voters;
          c.voters = v;
        } else {
          const w = reg.constituencies.flatMap((c) => c.wards).find((x) => x.name === k);
          if (!w) throw new Refused([`${k} is not a ward in the register.`]);
          const re = new RegExp(`(\\{ "name": "${esc(w.name)}", "voters": )\\d+( \\})`);
          if (!re.test(out)) throw new Refused([`Could not find ${k} in the register.`]);
          out = out.replace(re, `$1${v}$2`);
          before[k] = w.voters;
          w.voters = v;
        }
      }
      const problems = wardRegisterProblems(reg).map((p) => p.plain);
      if (problems.length) throw new Refused(problems);
      return { file: "data/ward-register.json", text: out, title: target.kind === "ward" ? `Register: ${target.ward}` : "Register numbers", before, after: values, undo: { kind: "register-totals", values: before } };
    }
    case "list":
    case "list-add":
    case "list-remove-added": {
      const l = LIST_BY_ID[target.list];
      if (!l) throw new Refused(["That list cannot be edited here."]);
      const d = json(text) as { lists: Record<string, { patches: Record<string, Record<string, unknown>>; added: Record<string, unknown>[] }> };
      d.lists ??= {};
      const e = (d.lists[l.id] ??= { patches: {}, added: [] });
      e.patches ??= {};
      e.added ??= [];
      const fields = listFields(l);
      const check = (rec: Record<string, unknown>, keys: string[]) => {
        const problems: string[] = [];
        for (const k of keys) {
          const f = fields.find((x) => x.key === k);
          if (!f) { problems.push(`"${k}" cannot be edited here.`); continue; }
          const v = rec[k];
          if (f.type === "number" && v !== null && !(typeof v === "number" && Number.isFinite(v))) problems.push(`${k} must be a number.`);
          if (f.type === "string" && (typeof v !== "string" || !v.trim())) problems.push(`${k} cannot be empty.`);
          const allowed = l.choices?.[k];
          if (allowed && !allowed.includes(v as never)) problems.push(`${k} must be one of ${allowed.join(", ")}.`);
        }
        if (problems.length) throw new Refused(problems);
      };
      if (target.kind === "list") {
        const orig = l.records().find((r) => String(r[l.key]) === target.key);
        if (!orig) throw new Refused(["That record is not in the list."]);
        const keys = Object.keys(target.patch);
        check(target.patch, keys);
        const added = e.added.find((r) => String(r[l.key]) === target.key);
        const before = pick(orig, keys);
        if (added) Object.assign(added, target.patch);
        else e.patches[target.key] = { ...(e.patches[target.key] ?? {}), ...target.patch };
        return { file: "data/team/lists.json", text: stringify(d), title: `${l.label}: ${target.key}`, before, after: target.patch, undo: { kind: "list", list: l.id, key: target.key, patch: before } };
      }
      if (target.kind === "list-add") {
        const k = String(target.record[l.key] ?? "").trim();
        if (!k) throw new Refused([`A new record needs its ${l.key}.`]);
        if (l.records().some((r) => String(r[l.key]) === k)) throw new Refused([`"${k}" is already in the list.`]);
        check(target.record, fields.filter((f) => f.type === "string").map((f) => f.key).filter((f) => f in target.record));
        e.added.push(target.record);
        return { file: "data/team/lists.json", text: stringify(d), title: `${l.label}: new ${k}`, before: {}, after: target.record, undo: { kind: "list-remove-added", list: l.id, key: k } };
      }
      const rec = e.added.find((r) => String(r[l.key]) === target.key);
      if (!rec) throw new Refused(["Only a record the team added can be taken back out."]);
      e.added = e.added.filter((r) => r !== rec);
      return { file: "data/team/lists.json", text: stringify(d), title: `${l.label}: take back ${target.key}`, before: rec, after: {}, undo: { kind: "list-add", list: l.id, record: rec } };
    }
    case "analysis": {
      if (!analysisFiles().includes(target.file)) throw new Refused(["That analysis file cannot be edited here."]);
      const d = json(text) as { values: Record<string, unknown>[] };
      const rec = d.values[target.index];
      if (!rec) throw new Refused(["That row is not in the file."]);
      const problems: string[] = [];
      const p = { ...target.patch };
      for (const k of Object.keys(p)) if (!(ANALYSIS_FIELDS as readonly string[]).includes(k)) problems.push(`"${k}" cannot be edited here.`);
      if ("value" in p) {
        p.value = p.value === "" || p.value === null ? null : Number(String(p.value).replace(/[,\s]/g, ""));
        if (p.value !== null && !Number.isFinite(p.value as number)) problems.push("The value must be a number.");
      }
      if ("tier" in p) { p.tier = Number(p.tier); if (![1, 2, 3].includes(p.tier as number)) problems.push("Reliability must be Official, Reported or Unconfirmed."); }
      if ("status" in p && !ANALYSIS_STATUS.includes(String(p.status))) problems.push("Status must be confirmed, verify or placeholder.");
      if ("method" in p && !ANALYSIS_METHOD.includes(String(p.method))) problems.push("Method must be official, calculated or modelled.");
      if ("source_id" in p && !String(p.source_id ?? "").trim()) problems.push("Every value needs its source.");
      if (problems.length) throw new Refused(problems);
      const before = pick(rec, Object.keys(p));
      Object.assign(rec, p);
      return { file: `data/analysis/${target.file}`, text: stringify(d), title: `${target.file.replace(/\.json$/, "")}: ${String(rec.label)}`, before, after: p, undo: { kind: "analysis", file: target.file, index: target.index, patch: before } };
    }
  }
}

/* ------------------------------------------------------------------ committing */

const FILE_OF: Record<Target["kind"], (t: Target) => string> = {
  figure: () => "data/team/figures.json",
  "figure-add": () => "data/team/figures.json",
  "figure-remove-added": () => "data/team/figures.json",
  ward: () => "data/ward-register.json",
  "register-totals": () => "data/ward-register.json",
  list: () => "data/team/lists.json",
  "list-add": () => "data/team/lists.json",
  "list-remove-added": () => "data/team/lists.json",
  analysis: (t) => `data/analysis/${(t as Extract<Target, { kind: "analysis" }>).file}`,
};

export interface Committed extends Applied {
  ref: { branch: string; commitUrl?: string };
}

/** Validates and commits one edit. Throws Refused with plain-language problems. */
export async function commit(target: Target, by: string): Promise<Committed> {
  const mode = packMode();
  if (mode === "off") throw new Refused(["Data editing is not switched on yet: Firefly has not connected the site to GitHub."]);
  const file = FILE_OF[target.kind](target);
  if (mode === "local") {
    const abs = path.join(process.cwd(), file);
    const applied = applyTo(target, fs.readFileSync(abs, "utf8"));
    fs.writeFileSync(abs, applied.text);
    return { ...applied, ref: { branch: "local working tree" } };
  }
  const { text, sha } = await readMain(file);
  const applied = applyTo(target, text);
  const ref = await commitEdit({ file, text: applied.text, sha, name: applied.title, message: `Team edit: ${applied.title}\n\nTeam-Edit-By: ${by}` });
  return { ...applied, ref };
}
