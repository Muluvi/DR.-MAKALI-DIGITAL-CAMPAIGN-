/**
 * The explanation under each model: what the outcome says and what drives it, in plain sentences.
 * Every number in a sentence is one the model has just computed or one the visitor set; nothing is
 * estimated here. Pure, no imports beyond the models' own types.
 */
import { count, pct } from "./text.ts";
import { neutralShare, scenarioTotals, type RegisterRow, type Scenario } from "../winning-number.ts";
import type { AgentLine, AgentSum, StationRow } from "../polling-agents.ts";
import { leadingCriterion, type Ranked } from "../ward-priority.ts";
import type { SendResult } from "../send-check.ts";
import { fmtWeeks, type RolloutPlan } from "../rollout.ts";
import type { LayerKey, ReachRow } from "../reach.ts";
import type { Coverage } from "../brief-mix.ts";
import type { TierResult } from "../response-tier.ts";
import type { Found } from "../record-finder.ts";

export function explainWinning(rows: (RegisterRow & { name: string })[], s: Scenario, benchmark: number): string[] {
  const t = scenarioTotals(rows, s);
  const out = [`This scenario wins ${count(t.votes)} votes from ${count(t.ballots)} ballots: ${t.votes >= benchmark ? `${count(t.votes - benchmark)} above` : `${count(benchmark - t.votes)} short of`} the working benchmark of ${count(benchmark)}.`];
  const by = rows.map((r) => ({ r, v: (r.voters * s[r.code].turnout * s[r.code].share) / 10_000 })).sort((a, b) => b.v - a.v);
  out.push(`The most votes come from ${by[0].r.name} (${count(by[0].v)}), the fewest from ${by[by.length - 1].r.name} (${count(by[by.length - 1].v)}).`);
  if (t.ballots > 0) {
    const avgTurnout = (100 * t.ballots) / rows.reduce((a, r) => a + r.voters, 0);
    out.push(`At this scenario's overall turnout of ${pct(avgTurnout)}, an even share of ${pct(neutralShare(rows, benchmark, avgTurnout))} everywhere would just reach the benchmark.`);
  }
  return out;
}

export function explainAgents<W extends StationRow & { name: string }>(plan: AgentLine<W>[], sum: AgentSum): string[] {
  if (!sum.total) return ["Enter agents per station to see the plan."];
  const top = [...plan].sort((a, b) => b.total - a.total)[0];
  return [
    `The plan needs ${count(sum.total)} people across ${count(sum.stations)} stations: ${count(sum.base)} agents, ${count(sum.reserves)} reserves and ${count(sum.supervisors)} supervisors.`,
    `${top.w.name} needs the most, ${count(top.total)}, because it has ${count(top.w.stations)} stations.`,
  ];
}

const CRITERION = { voters: "register size", pool: "not having held office there", stations: "polling stations", projects: "county projects" } as const;
export function explainPriority(ranked: Ranked[]): string[] {
  if (!ranked.length || ranked[0].score === 0) return ["Every weight is zero, so no ward ranks above another. Set at least one weight."];
  const top = ranked.slice(0, 3);
  const top10pool = ranked.slice(0, 10).filter((r) => r.ward.pool === 1).length;
  const lead = leadingCriterion(ranked[0]);
  return [
    `The top three are ${top.map((r) => `${r.ward.name} (${r.score.toFixed(1)})`).join(", ")}.`,
    lead ? `${ranked[0].ward.name} ranks first mainly on ${CRITERION[lead]}.` : "",
    `${top10pool} of the top ten are in the four constituencies where he has not held office.`,
  ].filter(Boolean);
}

export function explainSend(r: SendResult, rail: string): string[] {
  if (!r.allowed) return [`The dispatch log would refuse this ${rail} send. Fix each reason and check again:`, ...r.refusals];
  return [r.ruled ? `The dispatch log would accept this ${rail} send: every rule it applies passes.` : `The dispatch log sets no rule for ${rail}, so nothing here refuses it. That is not clearance: opt-in and content rules still apply.`];
}

export function explainRollout(p: RolloutPlan, deadlineEvent: string): string[] {
  const out = [`All 40 wards are reporting by ${p.rolloutEnd}, ${p.slackToDeadline >= 0 ? `${fmtWeeks(p.slackToDeadline)} before` : `${fmtWeeks(-p.slackToDeadline)} after`} ${deadlineEvent}.`];
  if (p.optimisationWeeks >= 0) out.push(`That leaves ${fmtWeeks(p.optimisationWeeks)} of steady running before changes freeze.`);
  out.push(...p.warnings);
  if (p.slackToDeadline < 0) out.push("To finish in time: shorten a phase, put more constituencies in each wave, or start sooner.");
  return out;
}

const LAYER_NAME: Record<LayerKey, string> = { data: "internet users", smsOnly: "people with a phone but no internet", offline: "people with no phone" };
export function explainReach(rows: ReachRow[], reach: Record<LayerKey, number>): string[] {
  const voters = rows.reduce((a, r) => a + r.voters, 0);
  const reached = rows.reduce((a, r) => a + r.reached, 0);
  const worst = (Object.keys(reach) as LayerKey[]).sort((a, b) => reach[a] - reach[b])[0];
  return [
    `The mix reaches about ${count(reached)} of ${count(voters)} registered voters (${pct((100 * reached) / voters)}), and misses ${count(voters - reached)}.`,
    `It reaches ${LAYER_NAME[worst]} least: ${pct(100 * reach[worst])} of them.${reach.offline === 0 ? " Only radio and ground work reach people with no phone." : ""}`,
  ];
}

export function explainBrief(c: Coverage[]): string[] {
  const missed = c.filter((x) => !x.covered);
  if (!missed.length) return [`The week covers all ${c.length} segments.`];
  return [`The week covers ${c.length - missed.length} of ${c.length} segments.`, ...missed.map((m) => `${m.row.name} is missed because ${m.reasons.join("; ")}.`)];
}

export function explainTier(r: TierResult): string[] {
  return [`${r.tier.name}. ${r.rule}`, `Answer: ${r.tier.turnaround}. Drafted by ${r.tier.draftedBy.toLowerCase()}, approved by ${r.tier.approvedBy.toLowerCase()}.`, ...(r.flagged ? [r.flagged] : [])];
}

export function explainRecord(found: Found[], wardName: string): string[] {
  if (!found.length) return [`The scorecard places nothing in ${wardName} with these filters.`];
  const bySector = new Map<string, number>();
  for (const f of found) bySector.set(f.project.dims.sector, (bySector.get(f.project.dims.sector) ?? 0) + 1);
  const top = [...bySector.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const biggest = [...found].sort((a, b) => b.project.value - a.project.value)[0];
  return [
    `${found.length} project${found.length === 1 ? "" : "s"} for ${wardName}, mostly ${top.map(([s, n]) => `${s} (${n})`).join(", ")}.`,
    `The largest is ${biggest.project.label}, printed at KSh ${count(biggest.project.value)} (scorecard p. ${biggest.project.dims.page}). Each is the county's claim, not proof of delivery.`,
  ];
}
