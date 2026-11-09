/**
 * The Campaigner Network's single line of command, and the arithmetic that follows from it.
 *
 * Every figure is computed from the reference data and this configuration, never typed: change the
 * default roles at a level and the minimums, spans and seat counts follow.
 */
import { CONSTITUENCIES, VILLAGES, WARDS, MATCH_BY_CODE } from "./reference.ts";
import register from "../../data/ward-register.json" with { type: "json" };

export type RoleKind =
  | "candidate"
  | "command_member"
  | "constituency_coordinator"
  | "constituency_deputy"
  | "ward_coordinator"
  | "ward_deputy"
  | "village_lead"
  | "village_campaigner"
  | "group_county_lead"
  | "group_constituency_lead"
  | "group_ward_rep"
  | "group_unit_leader";

export type LevelId = "candidate" | "command" | "constituency" | "ward" | "village";

export interface Level {
  id: LevelId;
  label: string;
  /** How many units of this level exist, from the reference data. */
  units: number;
  /** The seats every unit has by default: one person per role. Empty: named members, no fixed seats. */
  defaultRoles: RoleKind[];
  reportsTo: LevelId | null;
  /** Counted in the minimum field structure. Dr. Makali and Campaign Command are not field seats. */
  field: boolean;
}

export const ROLE_LABEL: Record<RoleKind, string> = {
  candidate: "Candidate",
  command_member: "Campaign Command member",
  constituency_coordinator: "Constituency Coordinator",
  constituency_deputy: "Constituency Deputy",
  ward_coordinator: "Ward Coordinator",
  ward_deputy: "Ward Deputy",
  village_lead: "Village Lead",
  village_campaigner: "Village Campaigner",
  group_county_lead: "County Group Lead",
  group_constituency_lead: "Constituency Group Lead",
  group_ward_rep: "Ward Group Representative",
  group_unit_leader: "Local unit leader",
};

export const LEVELS: Level[] = [
  { id: "candidate", label: "Dr. Makali", units: 1, defaultRoles: ["candidate"], reportsTo: null, field: false },
  { id: "command", label: "Campaign Command", units: 1, defaultRoles: [], reportsTo: "candidate", field: false },
  { id: "constituency", label: "Constituency", units: CONSTITUENCIES.length, defaultRoles: ["constituency_coordinator", "constituency_deputy"], reportsTo: "command", field: true },
  { id: "ward", label: "Ward", units: WARDS.length, defaultRoles: ["ward_coordinator", "ward_deputy"], reportsTo: "constituency", field: true },
  { id: "village", label: "Village", units: VILLAGES.length, defaultRoles: ["village_lead", "village_campaigner"], reportsTo: "ward", field: true },
];

export const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((l) => [l.id, l])) as Record<LevelId, Level>;

/** The minimum campaigners per village. Raised per ward or village by an authorised user, never lowered. */
export const VILLAGE_MINIMUM = LEVEL_BY_ID.village.defaultRoles.length;

export const VILLAGE_ROLES: RoleKind[] = ["village_lead", "village_campaigner"];
export const WARD_ROLES: RoleKind[] = ["ward_coordinator", "ward_deputy"];
export const CONSTITUENCY_ROLES: RoleKind[] = ["constituency_coordinator", "constituency_deputy"];
export const GROUP_ROLES: RoleKind[] = ["group_county_lead", "group_constituency_lead", "group_ward_rep", "group_unit_leader"];

export const levelOfRole = (k: RoleKind): LevelId | "group" =>
  k === "candidate" ? "candidate" : k === "command_member" ? "command" : CONSTITUENCY_ROLES.includes(k) ? "constituency" : WARD_ROLES.includes(k) ? "ward" : VILLAGE_ROLES.includes(k) ? "village" : "group";

/** Seats at one level with its default roles. */
export const seatsAt = (id: LevelId): number => LEVEL_BY_ID[id].units * LEVEL_BY_ID[id].defaultRoles.length;

/** 2 × 247 = 494 village campaigners at the minimum. */
export const villageMinimum = (): number => seatsAt("village");

/** Constituency, ward and village seats with default roles: 16 + 80 + 494 = 590 people at the minimum. */
export const fieldStructureMinimum = (): number => LEVELS.filter((l) => l.field).reduce((n, l) => n + seatsAt(l.id), 0);

export interface Span {
  level: string;
  of: string;
  min: number;
  max: number;
  median: number;
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** How many units each coordinator directs: Command → constituencies, constituency → wards, ward → villages. */
export function spansOfControl(): Span[] {
  const wardsPer = CONSTITUENCIES.map((c) => WARDS.filter((w) => w.constituency === c).length);
  const villagesPer = WARDS.map((w) => w.village_count);
  return [
    { level: "Campaign Command", of: "constituencies", min: CONSTITUENCIES.length, max: CONSTITUENCIES.length, median: CONSTITUENCIES.length },
    { level: "Constituency Coordinator", of: "wards", min: Math.min(...wardsPer), max: Math.max(...wardsPer), median: median(wardsPer) },
    { level: "Ward Coordinator", of: "villages", min: Math.min(...villagesPer), max: Math.max(...villagesPer), median: median(villagesPer) },
  ];
}

type RegConstituency = { id: string; name: string; wards: { name: string; voters: number }[] };

/**
 * A ward's 2022 registered voters divided by its villages: a ward average, estimated. It is not a
 * village figure. Villages are not IEBC units and the register is not published by village.
 */
export interface WardAverage {
  ward_code: number;
  ward: string;
  constituency: string;
  villages: number;
  ward_voters_2022: number;
  average_per_village: number;
  label: "ward average, estimated";
}

export function wardAverages(): WardAverage[] {
  const voters = new Map<string, number>();
  for (const c of register.constituencies as RegConstituency[]) for (const w of c.wards) voters.set(`${c.name}|${w.name}`, w.voters);
  return WARDS.map((w) => {
    const m = MATCH_BY_CODE.get(w.ward_code);
    if (!m) throw new Error(`structure: no register match for ward ${w.ward_code}`);
    const v = voters.get(`${m.register_constituency}|${m.register_ward}`);
    if (v === undefined) throw new Error(`structure: register has no ${m.register_ward}`);
    return { ward_code: w.ward_code, ward: w.ward, constituency: w.constituency, villages: w.village_count, ward_voters_2022: v, average_per_village: Math.round(v / w.village_count), label: "ward average, estimated" as const };
  });
}
