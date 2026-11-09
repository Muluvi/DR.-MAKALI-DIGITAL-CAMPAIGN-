/**
 * Coverage: how many seats each unit needs, how many are held, and its state.
 *
 * Pure: it takes active roles and unit targets and returns counts. It never sees a name or a phone
 * number, which is what lets publicCoverage() serve the open view.
 *
 *   Vacant         no seat in the unit is held
 *   Partial        some seats held, but at least one village (or leadership seat) is short of its target
 *   Minimum met    every seat held, exactly at target
 *   Above minimum  every seat held, and more people than the target
 *
 * A unit's seats include its own leadership seats and every unit below it. A village's target is
 * the network minimum unless an authorised user raised it, for the village or for its whole ward.
 */
import { CONSTITUENCIES, VILLAGES, WARDS, type Village } from "./reference.ts";
import { CONSTITUENCY_ROLES, VILLAGE_MINIMUM, VILLAGE_ROLES, WARD_ROLES, type RoleKind } from "./structure.ts";
import type { GroupTypeId } from "./types.ts";
import { GROUP_TYPES } from "./groups.ts";

export type CoverageState = "Vacant" | "Partial" | "Minimum met" | "Above minimum";
export const COVERAGE_STATES: CoverageState[] = ["Vacant", "Partial", "Minimum met", "Above minimum"];

/** The minimum a role needs to be counted: an active seat held by a cleared, active person. */
export interface SeatRole {
  person_id: string;
  kind: RoleKind;
  constituency: string | null;
  ward_code: number | null;
  village_code: number | null;
}

export interface TargetRow {
  unit: "ward" | "village";
  code: number;
  target: number;
}

export interface Tally {
  required: number;
  /** People holding a seat in the unit, all of them. */
  filled: number;
  /** Seats held, counting no seat group beyond its target. */
  filled_to_target: number;
  state: CoverageState;
}

export interface Seat {
  role: RoleKind;
  filled: boolean;
}

export interface VillageCoverage extends Tally {
  village_code: number;
  ward_code: number;
  target: number;
  seats: Seat[];
}

export interface WardCoverage extends Tally {
  ward_code: number;
  constituency: string;
  leadership: Seat[];
  villages: Record<CoverageState, number>;
}

export interface ConstituencyCoverage extends Tally {
  constituency: string;
  leadership: Seat[];
  villages: Record<CoverageState, number>;
}

export interface CountyCoverage extends Tally {
  villages: Record<CoverageState, number>;
  villages_total: number;
}

export interface Coverage {
  county: CountyCoverage;
  constituencies: ConstituencyCoverage[];
  wards: WardCoverage[];
  villages: VillageCoverage[];
}

export function stateOf(required: number, filled: number, filledToTarget: number): CoverageState {
  if (filled === 0) return "Vacant";
  if (filledToTarget < required) return "Partial";
  return filled > required ? "Above minimum" : "Minimum met";
}

const emptyStates = (): Record<CoverageState, number> => ({ Vacant: 0, Partial: 0, "Minimum met": 0, "Above minimum": 0 });

/** A village's target: its own override, else its ward's, else the network minimum. Never below the minimum. */
export function villageTarget(v: Pick<Village, "village_code" | "ward_code">, targets: TargetRow[]): number {
  const own = targets.find((t) => t.unit === "village" && t.code === v.village_code)?.target;
  const ward = targets.find((t) => t.unit === "ward" && t.code === v.ward_code)?.target;
  return Math.max(VILLAGE_MINIMUM, own ?? ward ?? VILLAGE_MINIMUM);
}

/** Leadership seats: one per default role; a seat is held when anyone active holds that role. */
function leadership(kinds: RoleKind[], held: SeatRole[]): { seats: Seat[]; filled: number; toTarget: number } {
  const seats = kinds.map((k) => ({ role: k, filled: held.some((r) => r.kind === k) }));
  const people = new Set(held.map((r) => r.person_id)).size;
  return { seats, filled: people, toTarget: seats.filter((s) => s.filled).length };
}

export function computeCoverage(roles: SeatRole[], targets: TargetRow[]): Coverage {
  const villages: VillageCoverage[] = VILLAGES.map((v) => {
    const here = roles.filter((r) => VILLAGE_ROLES.includes(r.kind) && r.village_code === v.village_code);
    const n = new Set(here.map((r) => r.person_id)).size;
    const target = villageTarget(v, targets);
    const leads = here.filter((r) => r.kind === "village_lead").length;
    const leadHeld = leads >= 1;
    const slots = Math.max(target, n);
    const seats: Seat[] = [{ role: "village_lead", filled: leadHeld }];
    const campaignersHeld = n - (leadHeld ? 1 : 0);
    for (let i = 1; i < slots; i++) seats.push({ role: "village_campaigner", filled: i <= campaignersHeld });
    const toTarget = Math.min(n, target);
    return { village_code: v.village_code, ward_code: v.ward_code, target, seats, required: target, filled: n, filled_to_target: toTarget, state: stateOf(target, n, toTarget) };
  });

  const wards: WardCoverage[] = WARDS.map((w) => {
    const vs = villages.filter((v) => v.ward_code === w.ward_code);
    const lead = leadership(WARD_ROLES, roles.filter((r) => WARD_ROLES.includes(r.kind) && r.ward_code === w.ward_code));
    const required = WARD_ROLES.length + vs.reduce((n, v) => n + v.required, 0);
    const filled = lead.filled + vs.reduce((n, v) => n + v.filled, 0);
    const toTarget = lead.toTarget + vs.reduce((n, v) => n + v.filled_to_target, 0);
    const states = emptyStates();
    for (const v of vs) states[v.state]++;
    return { ward_code: w.ward_code, constituency: w.constituency, leadership: lead.seats, villages: states, required, filled, filled_to_target: toTarget, state: stateOf(required, filled, toTarget) };
  });

  const constituencies: ConstituencyCoverage[] = CONSTITUENCIES.map((c) => {
    const ws = wards.filter((w) => w.constituency === c);
    const lead = leadership(CONSTITUENCY_ROLES, roles.filter((r) => CONSTITUENCY_ROLES.includes(r.kind) && r.constituency === c));
    const required = CONSTITUENCY_ROLES.length + ws.reduce((n, w) => n + w.required, 0);
    const filled = lead.filled + ws.reduce((n, w) => n + w.filled, 0);
    const toTarget = lead.toTarget + ws.reduce((n, w) => n + w.filled_to_target, 0);
    const states = emptyStates();
    for (const w of ws) for (const s of Object.keys(states) as CoverageState[]) states[s] += w.villages[s];
    return { constituency: c, leadership: lead.seats, villages: states, required, filled, filled_to_target: toTarget, state: stateOf(required, filled, toTarget) };
  });

  const required = constituencies.reduce((n, c) => n + c.required, 0);
  const filled = constituencies.reduce((n, c) => n + c.filled, 0);
  const toTarget = constituencies.reduce((n, c) => n + c.filled_to_target, 0);
  const states = emptyStates();
  for (const v of villages) states[v.state]++;
  return {
    county: { required, filled, filled_to_target: toTarget, state: stateOf(required, filled, toTarget), villages: states, villages_total: villages.length },
    constituencies,
    wards,
    villages,
  };
}

/** Distinct people holding any active role: a person with a village role and a group role counts once. */
export const uniquePeople = (roles: { person_id: string }[]): number => new Set(roles.map((r) => r.person_id)).size;

/** Active local units of each group type, by constituency. Counts only: no names, leaders or members. */
export function groupMatrix(groups: { type: GroupTypeId; constituency: string | null; activation: string }[]): Record<GroupTypeId, Record<string, number>> {
  const m = Object.fromEntries(GROUP_TYPES.map((g) => [g.id, Object.fromEntries(CONSTITUENCIES.map((c) => [c, 0]))])) as Record<GroupTypeId, Record<string, number>>;
  for (const g of groups) if (g.constituency && g.activation !== "paused" && m[g.type] && g.constituency in m[g.type]) m[g.type][g.constituency]++;
  return m;
}

/**
 * The open view. Counts and states by constituency and ward, and seat states by village. It carries
 * no name, phone number, contact route, person id or report: built from the coverage tally alone.
 */
export interface PublicCoverage {
  status: "live" | "not_recording";
  generated_at: string;
  county: CountyCoverage;
  constituencies: ConstituencyCoverage[];
  wards: WardCoverage[];
  villages: { village_code: number; state: CoverageState; target: number; filled: number; seats: Seat[] }[];
  groups: Record<GroupTypeId, Record<string, number>> | null;
}

export function toPublic(c: Coverage, status: PublicCoverage["status"], groups: PublicCoverage["groups"], now: string): PublicCoverage {
  return {
    status,
    generated_at: now,
    county: c.county,
    constituencies: c.constituencies,
    wards: c.wards,
    villages: c.villages.map((v) => ({ village_code: v.village_code, state: v.state, target: v.target, filled: v.filled, seats: v.seats })),
    groups,
  };
}
