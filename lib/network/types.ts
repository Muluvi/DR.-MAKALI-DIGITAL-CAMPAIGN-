/**
 * The Campaigner Network's private records. Field names match the database columns
 * (supabase/migrations/20261109000000_network.sql), so every store reads and writes them as is.
 *
 * PERSONAL DATA. Person, the leader contact on Group, Report, Flag and Message hold personal data
 * and political association, which the Data Protection Act, 2019 treats as sensitive. They live only
 * in the server-side database. Nothing in this file is data: it is shapes.
 *
 * Never collected: national ID numbers, voter card numbers, or how a person intends to vote.
 */
import type { RoleKind } from "./structure.ts";

export type ConsentChannel = "in_person" | "phone_call" | "whatsapp" | "ussd" | "web_form";

export interface Consent {
  /** Who collected the consent: the registering account's name. */
  collected_by: string;
  collected_at: string;
  purpose: string;
  channel: ConsentChannel;
}

/** Roles paid from public funds that must be declared, and are routed to Command to decide. */
export type PublicFundsRole = "none" | "teacher" | "chief_or_assistant_chief" | "community_health_worker" | "other_public_funds" | "unsure";

export interface Person {
  id: string;
  name: string;
  /** E.164, e.g. +2547…; also the sign-in identity for a phone one-time code. */
  phone: string | null;
  email: string | null;
  /** Self-declared, optional, used only for the women-or-youth seat target. */
  woman: boolean | null;
  youth: boolean | null;
  consent: Consent;
  /** "I am not a serving public officer barred from partisan political activity." Must be true. */
  declaration_not_public_officer: boolean;
  /** Serving Village, Ward or Sub-County Administrator, or other county public officer: never appointed. */
  serving_county_officer: boolean;
  public_funds_role: PublicFundsRole;
  /** cleared: may hold a seat. review: Command decides. barred: may not hold a seat. */
  eligibility: "cleared" | "review" | "barred";
  status: "active" | "withdrawn";
  retention_until: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Role {
  id: string;
  person_id: string;
  kind: RoleKind;
  constituency: string | null;
  ward_code: number | null;
  village_code: number | null;
  group_type: GroupTypeId | null;
  group_id: string | null;
  /** The one reporting line this person's reports follow. Exactly one active role per person is primary. */
  is_primary: boolean;
  active: boolean;
  started_at: string;
  ended_at: string | null;
}

export type GroupTypeId =
  | "boda_boda"
  | "clergy_faith"
  | "women_chama"
  | "youth"
  | "disability"
  | "farmers_coop"
  | "traders"
  | "elders"
  | "retired_professionals"
  | "diaspora";

export type GroupLevel = "county" | "constituency" | "ward" | "unit";

export interface Group {
  id: string;
  type: GroupTypeId;
  name: string;
  level: GroupLevel;
  constituency: string | null;
  /** Required for a local unit, so the ward coordinator can see which groups operate there. */
  ward_code: number | null;
  village_code: number | null;
  leader_name: string | null;
  leader_phone: string | null;
  approx_members: number | null;
  activation: "identified" | "contacted" | "active" | "paused";
  representative_person_id: string | null;
  consent_status: "not_asked" | "given" | "refused" | "withdrawn";
  consent: Consent | null;
  /** An institutional endorsement is recorded only when confirmed in writing. */
  endorsement_confirmed_in_writing: boolean;
  endorsement_reference: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskState = "Assigned" | "Acknowledged" | "In progress" | "Done" | "Blocked";
export const TASK_STATES: TaskState[] = ["Assigned", "Acknowledged", "In progress", "Done", "Blocked"];

export interface Target {
  level?: "constituency" | "ward" | "village" | "group";
  constituency?: string;
  ward_code?: number;
  village_code?: number;
  role?: RoleKind;
  group_type?: GroupTypeId;
}

export interface Task {
  id: string;
  title: string;
  instructions: string;
  due: string;
  evidence: string;
  /** The objective number on the site ("1"–"5"), read from lib/register/specs/s1-objectives.ts. */
  objective: string;
  template: string | null;
  target: Target;
  chain: "geo" | "group";
  created_by: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  task_id: string;
  person_id: string;
  role_id: string;
  state: TaskState;
  note: string | null;
  via: "app" | "ussd" | "whatsapp";
  /** Set by Command when a group-chain task clashes with a geographic one for the same person. */
  clash_decision: string | null;
  updated_at: string;
}

export const ISSUE_CATEGORIES = ["Water", "Food and drought", "Health", "Roads", "Jobs and income", "Prices", "Public money", "Security", "Other"] as const;
export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export interface Report {
  id: string;
  person_id: string;
  role_id: string;
  task_id: string | null;
  chain: "geo" | "group";
  activity: string;
  constituency: string;
  ward_code: number;
  village_code: number | null;
  group_type: GroupTypeId | null;
  people_reached: number;
  issue_category: IssueCategory | null;
  issue_text: string | null;
  follow_up: boolean;
  follow_up_note: string | null;
  photo_path: string | null;
  channel: "app" | "ussd" | "whatsapp";
  created_at: string;
}

export type FlagKind = "safety" | "misconduct" | "unresponsive";

export interface Flag {
  id: string;
  kind: FlagKind;
  raised_by: string;
  details: string;
  constituency: string | null;
  ward_code: number | null;
  /** The Command member who owns it. */
  owner_person_id: string | null;
  state: "open" | "closed";
  resolution: string | null;
  created_at: string;
  closed_at: string | null;
}

export interface Message {
  id: string;
  kind: "broadcast" | "reply";
  from_person_id: string;
  /** Whose message a broadcast carries. Replies always route to the sender's ward coordinator. */
  voice: "command" | "candidate" | "campaigner";
  body: string;
  audience: Target | null;
  to_person_id: string | null;
  in_reply_to: string | null;
  created_at: string;
}

export type DeliveryStatus = "in_app" | "sent" | "failed";

export interface Delivery {
  id: string;
  message_id: string | null;
  task_id: string | null;
  person_id: string;
  channel: "app" | "whatsapp" | "ussd";
  /** "sent" means the provider accepted it, and no more. Nothing is ever recorded as delivered on our say-so. */
  status: DeliveryStatus;
  error: string | null;
  provider_id: string | null;
  at: string;
}

export type AuditAction = "view_contacts" | "create" | "edit" | "delete" | "withdraw" | "export" | "role_change" | "eligibility" | "settings";

export interface AuditRow {
  id: string;
  at: string;
  actor_person_id: string | null;
  actor_label: string;
  action: AuditAction;
  subject_table: string;
  subject_id: string | null;
  /** Never a name, phone number or report text: what kind of thing happened, and to how many. */
  detail: string;
}

export interface Alias {
  id: string;
  village_code: number;
  alias: string;
  added_by: string;
  at: string;
}

export interface UnitTarget {
  id: string;
  unit: "ward" | "village";
  code: number;
  /** Campaigners per village. Never below the network minimum. */
  target: number;
  set_by: string;
  at: string;
}

export interface Settings {
  id: "settings";
  /** The date personal data is deleted after the election, unless renewed consent says otherwise. */
  retention_until: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  title: string;
  instructions: string;
  evidence: string;
  objective: string;
  updated_at: string;
}
