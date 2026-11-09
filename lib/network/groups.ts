/**
 * The Special Groups network: the editable group types it starts with, and its chain.
 *
 * Types only. No real organisation, leader or membership number is seeded here or anywhere: every
 * group is entered by the team, with consent, in the private database.
 */
import type { GroupTypeId } from "./types.ts";
import type { RoleKind } from "./structure.ts";

export interface GroupType {
  id: GroupTypeId;
  label: string;
  /** The local unit's own word for itself. */
  unit: string;
  /** Rules that apply to this type in particular. */
  caution?: string;
}

export const GROUP_TYPES: GroupType[] = [
  { id: "boda_boda", label: "Boda boda groups and stages", unit: "stage" },
  {
    id: "clergy_faith",
    label: "Clergy and faith leaders",
    unit: "congregation",
    caution: "Faith leaders take part as individuals who have opted in. No institutional endorsement is recorded unless confirmed in writing, and no task may ask for partisan activity during worship.",
  },
  { id: "women_chama", label: "Women's groups, chamas and table-banking groups", unit: "chama" },
  { id: "youth", label: "Youth groups", unit: "group" },
  { id: "disability", label: "People with disabilities groups", unit: "group" },
  { id: "farmers_coop", label: "Farmers, livestock and cooperative groups", unit: "cooperative" },
  { id: "traders", label: "Market traders and small business groups", unit: "association" },
  {
    id: "elders",
    label: "Elders and community leaders",
    unit: "council",
    caution: "Community leaders take part as individuals who have opted in. No institutional endorsement is recorded unless confirmed in writing.",
  },
  { id: "retired_professionals", label: "Retired professionals", unit: "association" },
  { id: "diaspora", label: "Diaspora and Kitui residents' associations outside the county", unit: "association" },
];

export const GROUP_TYPE_BY_ID = Object.fromEntries(GROUP_TYPES.map((g) => [g.id, g])) as Record<GroupTypeId, GroupType>;
export const isGroupType = (s: unknown): s is GroupTypeId => typeof s === "string" && s in GROUP_TYPE_BY_ID;

/** Campaign Command, then County Group Lead, Constituency Group Lead, Ward Group Representative, then the local unit. */
export const GROUP_CHAIN: { role: RoleKind | "command"; label: string }[] = [
  { role: "command", label: "Campaign Command" },
  { role: "group_county_lead", label: "County Group Lead" },
  { role: "group_constituency_lead", label: "Constituency Group Lead" },
  { role: "group_ward_rep", label: "Ward Group Representative" },
  { role: "group_unit_leader", label: "Local unit (stage, congregation, chama, association)" },
];
