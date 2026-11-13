/**
 * Choices for the team's forms, read from the data pack (and the story) at request time. Server only.
 */
import fs from "node:fs";
import path from "node:path";
import { WARD_ROWS } from "../data/figures";
import { CONSTITUENCIES } from "../../data/ward-register";
import { PILLARS, CONTENT_TYPES } from "../../data/message-architecture";
import { SEGMENTS } from "../../data/segments";
import { CONTENDERS } from "../../data/competitors";
import { SEVERITY_TIERS } from "../../data/escalation";
import { GENERAL_ELECTION_KPIS, NOMINATION_KPIS, RECOGNITION_INDICATORS } from "../../data/kpis";
import { PHASES } from "../phases";
import { strategyChoices } from "./library";
import type { OptionSource } from "./collections";
import type { Options } from "./validate";

/** The meeting rhythm, as the engagement chapter's table states it. */
function meetings(): string[] {
  const md = fs.readFileSync(path.join(process.cwd(), "content", "engagement.md"), "utf8");
  const out: string[] = [];
  for (const m of md.matchAll(/^\| \*\*(Daily|Weekly|Monthly|Quarterly)[^|]*\*\* \| ([^|]+?) \|/gm)) {
    const name = `${m[2].trim()} (${m[1].toLowerCase()})`;
    if (!out.includes(name)) out.push(name);
  }
  return out;
}

export function resolveOptions(): Options {
  const o: Record<OptionSource, string[]> = {
    wards: WARD_ROWS.map((w) => w.name).sort(),
    constituencies: CONSTITUENCIES.map((c) => c.name),
    pillars: PILLARS.map((p) => p.title),
    contentTypes: CONTENT_TYPES.map((c) => `${c.code} ${c.name}`),
    segments: SEGMENTS.map((s) => s.name),
    contenders: CONTENDERS.map((c) => c.name),
    severity: SEVERITY_TIERS.map((t) => t.name),
    kpis: [...NOMINATION_KPIS, ...GENERAL_ELECTION_KPIS].map((k) => `${k.code} ${k.title}`).concat(RECOGNITION_INDICATORS.map((k) => `${k.code} ${k.title}`)),
    strategies: strategyChoices(),
    phases: PHASES.map((p) => p.label),
    meetings: meetings(),
  };
  return o;
}
