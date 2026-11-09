/**
 * Who may read and change what in the Campaigner Network. Pure predicates, called by the service
 * (lib/network/service.ts) before every read, write and export. The pages never decide access.
 *
 *   Campaign Command            county-wide
 *   Constituency Coordinator    own constituency (deputies read; coordinators appoint)
 *   Ward Coordinator            own ward (deputies read; coordinators appoint)
 *   Village campaigner          own record, own tasks, own reports
 *   Group leads                 own group chain
 *   Dr. Makali                  the digest and county totals; no individual campaigner queue
 *   Firefly (platform owner)    appoints the first Campaign Command members, and nothing else
 *   Anyone else                 the open aggregate view only
 *
 * A person may hold several roles. Their access is the union of what each active role grants.
 */
import { CONSTITUENCY_ROLES, GROUP_ROLES, VILLAGE_ROLES, WARD_ROLES, type RoleKind } from "./structure.ts";
import { constituencyOfWard, VILLAGE_BY_CODE } from "./reference.ts";
import type { Group, Person, Report, Role } from "./types.ts";

export type Actor =
  | { kind: "anonymous" }
  | { kind: "firefly"; label: string; email: string }
  | { kind: "person"; person: Person; roles: Role[] };

export class NotAllowed extends Error {
  constructor(message = "You do not have access to this.") {
    super(message);
    this.name = "NotAllowed";
  }
}

const active = (a: Actor): Role[] => (a.kind === "person" ? a.roles.filter((r) => r.active) : []);
const has = (a: Actor, ...kinds: RoleKind[]) => active(a).some((r) => kinds.includes(r.kind));

export const isCommand = (a: Actor): boolean => has(a, "command_member");
export const isCandidate = (a: Actor): boolean => has(a, "candidate");
export const isSignedIn = (a: Actor): boolean => a.kind === "person" && active(a).length > 0;
export const actorLabel = (a: Actor): string => (a.kind === "person" ? a.person.name : a.kind === "firefly" ? a.label : "anonymous");
export const actorId = (a: Actor): string | null => (a.kind === "person" ? a.person.id : null);

const GEO_ROLES: RoleKind[] = [...CONSTITUENCY_ROLES, ...WARD_ROLES, ...VILLAGE_ROLES];

/** Whether one of the actor's roles covers the position `target` sits in. */
function covers(mine: Role, target: Pick<Role, "kind" | "constituency" | "ward_code" | "village_code" | "group_type" | "group_id">): boolean {
  switch (mine.kind) {
    case "constituency_coordinator":
    case "constituency_deputy":
      return GEO_ROLES.includes(target.kind) && target.constituency === mine.constituency;
    case "ward_coordinator":
    case "ward_deputy":
      return (WARD_ROLES.includes(target.kind) || VILLAGE_ROLES.includes(target.kind)) && target.ward_code === mine.ward_code;
    case "group_county_lead":
      return GROUP_ROLES.includes(target.kind) && target.group_type === mine.group_type;
    case "group_constituency_lead":
      return GROUP_ROLES.includes(target.kind) && target.group_type === mine.group_type && target.constituency === mine.constituency && target.kind !== "group_county_lead";
    case "group_ward_rep":
      return (target.kind === "group_ward_rep" || target.kind === "group_unit_leader") && target.group_type === mine.group_type && target.ward_code === mine.ward_code;
    case "group_unit_leader":
      return target.kind === "group_unit_leader" && !!mine.group_id && target.group_id === mine.group_id;
    default:
      return false;
  }
}

/** Read a person's record, roles and contact details. Their own record is always theirs. */
export function canReadPerson(a: Actor, personId: string, personRoles: Role[]): boolean {
  if (a.kind !== "person") return false;
  if (a.person.id === personId) return true;
  if (isCommand(a)) return true;
  const theirs = personRoles.filter((r) => r.active);
  return active(a).some((mine) => theirs.some((t) => covers(mine, t)));
}

/** Appoint to, or end, a role. Strictly below the actor's own level, inside their scope. */
export function canManageRole(a: Actor, r: Pick<Role, "kind" | "constituency" | "ward_code" | "village_code" | "group_type" | "group_id">): boolean {
  if (a.kind === "firefly") return r.kind === "command_member" || r.kind === "candidate";
  if (a.kind !== "person") return false;
  if (isCommand(a)) return true;
  return active(a).some((mine) => {
    switch (mine.kind) {
      case "constituency_coordinator":
        return (WARD_ROLES.includes(r.kind) || VILLAGE_ROLES.includes(r.kind)) && r.constituency === mine.constituency;
      case "ward_coordinator":
        return VILLAGE_ROLES.includes(r.kind) && r.ward_code === mine.ward_code;
      case "group_county_lead":
        return ["group_constituency_lead", "group_ward_rep", "group_unit_leader"].includes(r.kind) && r.group_type === mine.group_type;
      case "group_constituency_lead":
        return ["group_ward_rep", "group_unit_leader"].includes(r.kind) && r.group_type === mine.group_type && r.constituency === mine.constituency;
      case "group_ward_rep":
        return r.kind === "group_unit_leader" && r.group_type === mine.group_type && r.ward_code === mine.ward_code;
      default:
        return false;
    }
  });
}

/** Correct a person's record: themselves, Command, or whoever may manage one of their roles. */
export function canEditPerson(a: Actor, personId: string, personRoles: Role[]): boolean {
  if (a.kind !== "person") return false;
  if (a.person.id === personId || isCommand(a)) return true;
  return personRoles.some((r) => r.active && canManageRole(a, r));
}

/** A group's record. Ward and constituency coordinators see the groups in their area, without the leader's contact. */
export function canReadGroup(a: Actor, g: Group): "full" | "summary" | false {
  if (a.kind !== "person") return false;
  if (isCommand(a)) return "full";
  const mine = active(a);
  const chain = mine.some((m) =>
    (m.kind === "group_county_lead" && m.group_type === g.type) ||
    (m.kind === "group_constituency_lead" && m.group_type === g.type && m.constituency === g.constituency) ||
    (m.kind === "group_ward_rep" && m.group_type === g.type && m.ward_code === g.ward_code) ||
    (m.kind === "group_unit_leader" && m.group_id === g.id),
  );
  if (chain || g.representative_person_id === a.person.id) return "full";
  const area = mine.some((m) =>
    ((m.kind === "ward_coordinator" || m.kind === "ward_deputy") && g.ward_code !== null && m.ward_code === g.ward_code) ||
    ((m.kind === "constituency_coordinator" || m.kind === "constituency_deputy") && m.constituency === g.constituency),
  );
  return area ? "summary" : false;
}

export function canEditGroup(a: Actor, g: Pick<Group, "type" | "constituency" | "ward_code" | "id">): boolean {
  if (a.kind !== "person") return false;
  if (isCommand(a)) return true;
  return active(a).some((m) =>
    (m.kind === "group_county_lead" && m.group_type === g.type) ||
    (m.kind === "group_constituency_lead" && m.group_type === g.type && m.constituency === g.constituency) ||
    (m.kind === "group_ward_rep" && m.group_type === g.type && g.ward_code !== null && m.ward_code === g.ward_code),
  );
}

/** A field report: its author, Command, and the chain it reports up. Dr. Makali sees only the digest. */
export function canReadReport(a: Actor, r: Report): boolean {
  if (a.kind !== "person") return false;
  if (a.person.id === r.person_id || isCommand(a)) return true;
  return active(a).some((m) => {
    if (r.chain === "geo") {
      if (m.kind === "ward_coordinator" || m.kind === "ward_deputy") return m.ward_code === r.ward_code;
      if (m.kind === "constituency_coordinator" || m.kind === "constituency_deputy") return m.constituency === r.constituency;
      return false;
    }
    if (m.group_type !== r.group_type) return false;
    if (m.kind === "group_county_lead") return true;
    if (m.kind === "group_constituency_lead") return m.constituency === r.constituency;
    if (m.kind === "group_ward_rep") return m.ward_code === r.ward_code;
    return false;
  });
}

/** Raise the campaigner target for a ward or a village, or add a village alias. */
export function canSetUnit(a: Actor, unit: "ward" | "village", code: number): boolean {
  if (a.kind !== "person") return false;
  if (isCommand(a)) return true;
  const ward = unit === "ward" ? code : VILLAGE_BY_CODE.get(code)?.ward_code ?? null;
  if (ward === null) return false;
  const constituency = constituencyOfWard(ward);
  return active(a).some((m) => (m.kind === "constituency_coordinator" && m.constituency === constituency) || (m.kind === "ward_coordinator" && m.ward_code === ward));
}

export const canExport = isCommand;
export const canIssueTasks = isCommand;
export const canBroadcast = isCommand;
export const canManageFlags = isCommand;
export const canReadAudit = isCommand;
export const canChangeSettings = isCommand;
export const canReadDigest = (a: Actor): boolean => isCommand(a) || isCandidate(a);

export function ensure(ok: boolean, message?: string): void {
  if (!ok) throw new NotAllowed(message);
}
