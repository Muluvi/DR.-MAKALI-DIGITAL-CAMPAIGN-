/**
 * Polling-agent cover: headcount by ward from the official station count and three planning
 * assumptions the user enters. Pure arithmetic, no imports.
 *
 *   agents       stations × agents per station
 *   reserves     agents × reserve %, rounded up
 *   supervisors  stations ÷ stations per supervisor, rounded up (0 when no span is set)
 */

export type StationRow = { code: string; stations: number };
export type AgentInputs = { perStation: number; reservePct: number; perSupervisor: number };
export type AgentLine<W extends StationRow> = { w: W; base: number; reserves: number; supervisors: number; total: number };
export type AgentSum = { base: number; reserves: number; supervisors: number; total: number; stations: number };

/** The plan can be drawn only once agents per station is a positive number and the reserve is not negative. */
export const agentInputsReady = (i: AgentInputs): boolean => i.perStation > 0 && i.reservePct >= 0;

export function agentLine<W extends StationRow>(w: W, i: AgentInputs): AgentLine<W> {
  const base = w.stations * i.perStation;
  const reserves = Math.ceil((base * i.reservePct) / 100);
  const supervisors = i.perSupervisor > 0 ? Math.ceil(w.stations / i.perSupervisor) : 0;
  return { w, base, reserves, supervisors, total: base + reserves + supervisors };
}

export function agentPlan<W extends StationRow>(wards: W[], i: AgentInputs): AgentLine<W>[] {
  return wards.map((w) => agentLine(w, i));
}

export function agentTotals<W extends StationRow>(plan: AgentLine<W>[]): AgentSum {
  return plan.reduce(
    (t, p) => ({ base: t.base + p.base, reserves: t.reserves + p.reserves, supervisors: t.supervisors + p.supervisors, total: t.total + p.total, stations: t.stations + p.w.stations }),
    { base: 0, reserves: 0, supervisors: 0, total: 0, stations: 0 },
  );
}
