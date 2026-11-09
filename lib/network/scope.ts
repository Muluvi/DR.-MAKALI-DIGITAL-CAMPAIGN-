/**
 * What the tool's forms offer a signed-in person: the seats they may appoint and the places inside
 * their area. A convenience for the interface only. The service checks every write again
 * (lib/network/policy.ts), so a form that offered too much would still be refused.
 */
import { CONSTITUENCIES, VILLAGE_BY_CODE, WARDS, WARD_BY_CODE } from "./reference.ts";
import { ROLE_LABEL, type RoleKind } from "./structure.ts";
import { GROUP_TYPE_BY_ID } from "./groups.ts";
import { isCommand, type Actor } from "./policy.ts";
import type { Group, Role } from "./types.ts";

export interface ToolScope {
  kinds: RoleKind[];
  wards: number[];
  constituencies: string[];
  groups: { id: string; name: string; type: Group["type"]; ward_code: number | null }[];
}

const ALL_KINDS = Object.keys(ROLE_LABEL) as RoleKind[];

export function scopeFor(actor: Actor, groups: Group[] = []): ToolScope {
  const units = groups.filter((g) => g.level === "unit").map((g) => ({ id: g.id, name: g.name, type: g.type, ward_code: g.ward_code }));
  if (actor.kind === "firefly") return { kinds: ["command_member", "candidate"], wards: [], constituencies: [], groups: [] };
  if (actor.kind !== "person") return { kinds: [], wards: [], constituencies: [], groups: [] };
  if (isCommand(actor)) return { kinds: ALL_KINDS, wards: WARDS.map((w) => w.ward_code), constituencies: CONSTITUENCIES, groups: units };
  const kinds = new Set<RoleKind>();
  const wards = new Set<number>();
  const cons = new Set<string>();
  const groupIds = new Set<string>();
  for (const r of actor.roles.filter((x) => x.active)) {
    switch (r.kind) {
      case "constituency_coordinator":
        ["ward_coordinator", "ward_deputy", "village_lead", "village_campaigner"].forEach((k) => kinds.add(k as RoleKind));
        WARDS.filter((w) => w.constituency === r.constituency).forEach((w) => wards.add(w.ward_code));
        cons.add(r.constituency!);
        break;
      case "ward_coordinator":
        ["village_lead", "village_campaigner"].forEach((k) => kinds.add(k as RoleKind));
        wards.add(r.ward_code!);
        break;
      case "group_county_lead":
        ["group_constituency_lead", "group_ward_rep", "group_unit_leader"].forEach((k) => kinds.add(k as RoleKind));
        WARDS.forEach((w) => wards.add(w.ward_code));
        CONSTITUENCIES.forEach((c) => cons.add(c));
        units.filter((g) => g.type === r.group_type).forEach((g) => groupIds.add(g.id));
        break;
      case "group_constituency_lead":
        ["group_ward_rep", "group_unit_leader"].forEach((k) => kinds.add(k as RoleKind));
        WARDS.filter((w) => w.constituency === r.constituency).forEach((w) => wards.add(w.ward_code));
        cons.add(r.constituency!);
        units.filter((g) => g.type === r.group_type && g.ward_code && WARD_BY_CODE.get(g.ward_code)?.constituency === r.constituency).forEach((g) => groupIds.add(g.id));
        break;
      case "group_ward_rep":
        kinds.add("group_unit_leader");
        wards.add(r.ward_code!);
        units.filter((g) => g.type === r.group_type && g.ward_code === r.ward_code).forEach((g) => groupIds.add(g.id));
        break;
      case "ward_deputy":
      case "constituency_deputy":
        // Deputies read their area; they appoint nobody. Their area still drives the report form.
        if (r.ward_code) wards.add(r.ward_code);
        else WARDS.filter((w) => w.constituency === r.constituency).forEach((w) => wards.add(w.ward_code));
        break;
    }
  }
  return { kinds: [...kinds], wards: [...wards].sort((a, b) => a - b), constituencies: [...cons], groups: units.filter((g) => groupIds.has(g.id)) };
}

/** A seat in words: "Village Lead, Town (Township ward)". Names official units only. */
export function seatLabel(r: Pick<Role, "kind" | "constituency" | "ward_code" | "village_code" | "group_type">): string {
  const place = r.village_code
    ? `${VILLAGE_BY_CODE.get(r.village_code)?.village_name} (${WARD_BY_CODE.get(r.ward_code!)?.ward} ward)`
    : r.ward_code
      ? `${WARD_BY_CODE.get(r.ward_code)?.ward} ward`
      : r.constituency ?? (r.kind === "command_member" || r.kind === "candidate" ? "" : "Kitui County");
  const group = r.group_type ? `, ${GROUP_TYPE_BY_ID[r.group_type]?.label}` : "";
  return `${ROLE_LABEL[r.kind]}${group}${place ? `, ${place}` : ""}`;
}
