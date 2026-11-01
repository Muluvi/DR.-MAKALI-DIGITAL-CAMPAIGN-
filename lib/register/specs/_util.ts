/**
 * Helpers every spec uses to read the data layer. A spec never types a number: it names a figure
 * and these return its value, its printed form, or its source as a tier-pilled reference.
 */
import { FIGURES } from "../../data/figures.ts";
import { formatFigure, type FormatMod } from "../../data/format.ts";
import type { Figure } from "../../data/schema.ts";
import type { Bar, CellState, SourceRef } from "../types.ts";

export function F(id: string): Figure {
  const f = FIGURES[id];
  if (!f) throw new Error(`register spec: unknown figure ${id}`);
  return f;
}

/** The value, or null for a named gap. */
export const val = (id: string): number | null => F(id).value;

/** The value, required: a spec that cannot draw without it fails the build. */
export function num(id: string): number {
  const v = F(id).value;
  if (v === null) throw new Error(`register spec: ${id} has no value`);
  return v;
}

export const fmt = (id: string, mod: FormatMod = ""): string => formatFigure(F(id), mod);

/** The source of a figure as the frame's source line prints it. */
export function src(id: string, name?: string): SourceRef {
  const f = F(id);
  return { name: name ?? f.source ?? `[DATA NEEDED — ${f.closesWith ?? "source"}]`, tier: f.tier, state: f.state === "sourced" ? undefined : f.state };
}

export const stateOf = (id: string): CellState => F(id).state;

/** A bar read straight off a figure. */
export function bar(id: string, label: string, extra: Partial<Bar> = {}): Bar {
  const f = F(id);
  return { label, value: f.value, state: f.state, ...extra };
}

/** Sort bars by value, largest first (brief §M: sort unless the order is the point). */
export const byValue = (bars: Bar[]): Bar[] => [...bars].sort((a, b) => (b.value ?? -1) - (a.value ?? -1));

/** The live deep link to a numbered section: "6.2" -> "/record#record-sec-6-2". */
export function secHref(num: string): string {
  // One route per chapter (the November 2026 restructure). Chapter 15 runs across four routes, one
  // per workstream group: 15.1 platforms, 15.2 media, 15.3 ground, 15.4 data. The consolidation pass
  // merged chapters 16, 17 and 22 and annexes B and H into the routes that now hold them.
  const chapter: Record<string, string> = {
    "1": "kitui", "2": "votes", "3": "needs", "4": "news", "5": "race", "6": "record", "7": "diagnosis",
    "8": "goal", "9": "position", "10": "message", "11": "voters", "12": "channels", "13": "engagement",
    "14": "timeline", "16": "timeline", "17": "engagement", "18": "success", "19": "lawful", "20": "response",
    "21": "receives", "22": "receives", "23": "ask",
  };
  const annex: Record<string, string> = {
    A: "annex-evidence", B: "votes", C: "annex-playbooks", D: "annex-volunteers", E: "annex-technology",
    F: "annex-runbooks", G: "annex-terms", H: "annex-terms",
  };
  const workstreams: Record<string, string> = { "1": "workstreams", "2": "workstreams", "3": "workstreams", "4": "workstreams" };
  const parts = num.split(".");
  const tab = parts[0] === "15" ? workstreams[parts[1] ?? "1"] : chapter[parts[0]] ?? annex[parts[0]];
  if (!tab) throw new Error(`secHref: no route for ${num}`);
  return `/${tab}#${tab}-sec-${parts.join("-").toLowerCase()}`;
}
