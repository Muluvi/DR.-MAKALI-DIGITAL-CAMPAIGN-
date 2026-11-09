/**
 * The Campaigner Network's operations, bound to one actor. Every read, write and export checks the
 * policy (lib/network/policy.ts) here, on the server, before it touches a row; pages and routes only
 * call these methods. Nothing here logs a name, phone number or report text.
 *
 * Data flow:
 *   Down  Command issues a task → it fans out to every person holding a matching seat → each gets an
 *         assignment, visible in the app, and a WhatsApp or USSD push where a channel is connected.
 *   Up    A campaigner reports → the report carries their ward (or group chain) → their ward
 *         coordinator sees it → summaries roll up to the constituency, to Command, and into the
 *         one-screen digest for Dr. Makali, which holds counts only.
 *   Skip  An urgent flag (safety, misconduct, an unresponsive coordinator) goes straight to Command,
 *         with a named owner and an open/closed state.
 *   Reply A reply to any broadcast, his included, goes to the sender's ward coordinator (or the next
 *         seat up the chain), never to Dr. Makali.
 */
import crypto from "node:crypto";
import type { NetDb } from "./db.ts";
import type { Channels } from "./channels.ts";
import {
  actorId, actorLabel, canBroadcast, canChangeSettings, canEditGroup, canEditPerson, canExport, canIssueTasks, canManageFlags,
  canManageRole, canReadAudit, canReadDigest, canReadGroup, canReadPerson, canReadReport, canSetUnit, ensure, isCandidate,
  isCommand, isSignedIn, NotAllowed, type Actor,
} from "./policy.ts";
import {
  CONSTITUENCY_ROLES, GROUP_ROLES, levelOfRole, ROLE_LABEL, VILLAGE_MINIMUM, VILLAGE_ROLES, WARD_ROLES, type RoleKind,
} from "./structure.ts";
import { CONSTITUENCIES, VILLAGE_BY_CODE, WARD_BY_CODE, constituencyOfWard } from "./reference.ts";
import { computeCoverage, groupMatrix, toPublic, uniquePeople, type Coverage, type PublicCoverage, type SeatRole } from "./coverage.ts";
import { eligibilityFor, prohibitedReason, toE164 } from "./conduct.ts";
import { isGroupType } from "./groups.ts";
import { OBJECTIVE_BY_N } from "./objectives.ts";
import { DEFAULT_TEMPLATES } from "./templates.ts";
import { ELECTION_DAY } from "../phases.ts";
import {
  ISSUE_CATEGORIES, TASK_STATES, type Alias, type Assignment, type AuditAction, type AuditRow, type ConsentChannel, type Delivery,
  type Flag, type FlagKind, type Group, type GroupTypeId, type IssueCategory, type Message, type Person, type PublicFundsRole,
  type Report, type Role, type Settings, type Target, type Task, type TaskState, type Template, type UnitTarget,
} from "./types.ts";

export class Invalid extends Error {
  errors: Record<string, string>;
  constructor(errors: Record<string, string>) {
    super(Object.values(errors)[0] ?? "Check the form.");
    this.name = "Invalid";
    this.errors = errors;
  }
}

export interface Deps {
  db: NetDb;
  channels: Channels;
  now?: () => Date;
  id?: () => string;
}

export interface RoleInput {
  kind: RoleKind;
  constituency?: string | null;
  ward_code?: number | null;
  village_code?: number | null;
  group_type?: GroupTypeId | null;
  group_id?: string | null;
}

export interface RegisterInput {
  name: string;
  phone: string;
  email?: string | null;
  woman?: boolean | null;
  youth?: boolean | null;
  consent_confirmed: boolean;
  consent_channel: ConsentChannel;
  consent_purpose?: string;
  declaration_not_public_officer: boolean;
  serving_county_officer: boolean;
  public_funds_role: PublicFundsRole;
  role: RoleInput;
}

export const CONSENT_PURPOSE =
  "To organise you as a volunteer in Dr. Makali's 2027 campaign network: to allocate tasks, receive your field reports and contact you about campaign activity. Not shared outside the campaign. Deleted after the election unless you agree otherwise.";

/** Days after the election that personal data is kept by default, until Command sets a date. */
export const RETENTION_DAYS_AFTER_ELECTION = 90;

export const defaultRetention = (): string => {
  const d = new Date(`${ELECTION_DAY}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + RETENTION_DAYS_AFTER_ELECTION);
  return d.toISOString().slice(0, 10);
};

export interface PersonView {
  person: Person;
  roles: Role[];
}

export interface Funnel {
  Assigned: number;
  Acknowledged: number;
  "In progress": number;
  Done: number;
  Blocked: number;
  /** Cumulative: everything assigned, everything at least acknowledged, everything done. */
  stages: { label: "Assigned" | "Acknowledged" | "Done"; value: number }[];
}

export interface UnitSummary {
  key: string;
  reports: number;
  people_reached: number;
  follow_ups: number;
  issues: Partial<Record<IssueCategory, number>>;
}

export interface Digest {
  generated_at: string;
  coverage: Coverage["county"];
  constituencies: { constituency: string; required: number; filled_to_target: number; state: string; reports_7d: number }[];
  unique_people: number;
  women_or_youth_villages: { met: number; of: number };
  funnel: Funnel;
  reports_7d: number;
  people_reached_7d: number;
  top_issues_7d: { issue: string; count: number }[];
  open_flags: Record<FlagKind, number>;
  pending_review: number;
}

const GEO_ROLES: RoleKind[] = [...CONSTITUENCY_ROLES, ...WARD_ROLES, ...VILLAGE_ROLES];
const isDate = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const text = (s: unknown, max = 2000): string => (typeof s === "string" ? s.trim().slice(0, max) : "");

/** A cell that a spreadsheet would read as a formula is prefixed so it stays text. */
const csvCell = (v: unknown): string => {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (header: string[], rows: unknown[][]) => [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n") + "\n";

/* ------------------------------------------------------------------ actor resolution */

/** The person a signed-in identity (a verified phone number or email) belongs to, with their roles. */
export async function resolveActor(db: NetDb, identity: { phone?: string | null; email?: string | null }): Promise<Actor> {
  const people = await db.list<Person>("net_people", { status: "active" });
  const phone = identity.phone ? toE164(identity.phone) : null;
  const email = identity.email?.toLowerCase() ?? null;
  const person = people.find((p) => (phone && p.phone === phone) || (email && p.email?.toLowerCase() === email));
  if (!person) return { kind: "anonymous" };
  const roles = await db.list<Role>("net_roles", { person_id: person.id });
  return { kind: "person", person, roles };
}

/* ------------------------------------------------------------------ the open view */

/**
 * The aggregate the open site shows: counts and states, by constituency and ward, and seat states by
 * village. Built from coverage tallies alone, so no name, phone number or report can reach it.
 */
export async function publicCoverage(db: NetDb | null, now = new Date()): Promise<PublicCoverage> {
  if (!db) return toPublic(computeCoverage([], []), "not_recording", null, now.toISOString());
  const [people, roles, targets, groups] = await Promise.all([
    db.list<Person>("net_people"),
    db.list<Role>("net_roles", { active: true }),
    db.list<UnitTarget>("net_targets"),
    db.list<Group>("net_groups"),
  ]);
  const cov = computeCoverage(seatRoles(people, roles), targets);
  return toPublic(cov, "live", groupMatrix(groups.filter((g) => g.level === "unit")), now.toISOString());
}

/** Active seats held by active, cleared people: the only roles that count towards coverage. */
function seatRoles(people: Person[], roles: Role[]): (SeatRole & Role)[] {
  const ok = new Set(people.filter((p) => p.status === "active" && p.eligibility === "cleared").map((p) => p.id));
  return roles.filter((r) => r.active && ok.has(r.person_id));
}

/* ------------------------------------------------------------------ the service */

export function networkService(deps: Deps, actor: Actor) {
  const { db, channels } = deps;
  const now = () => (deps.now ? deps.now() : new Date()).toISOString();
  const today = () => now().slice(0, 10);
  const newId = deps.id ?? (() => crypto.randomUUID());
  const me = actorId(actor);

  const audit = (action: AuditAction, subject_table: string, subject_id: string | null, detail: string) =>
    db.insert<AuditRow>("net_audit", { id: newId(), at: now(), actor_person_id: me, actor_label: actorLabel(actor), action, subject_table, subject_id, detail });

  /** Every read and write but registration needs a person holding a seat (or awaiting one). */
  const signedIn = () => {
    if (actor.kind !== "person") throw new NotAllowed("Sign in to use the campaigner network.");
  };

  const load = async () => {
    const [people, roles] = await Promise.all([db.list<Person>("net_people"), db.list<Role>("net_roles")]);
    const rolesOf = new Map<string, Role[]>();
    for (const r of roles) rolesOf.set(r.person_id, [...(rolesOf.get(r.person_id) ?? []), r]);
    return { people, roles, rolesOf };
  };

  const settings = async (): Promise<Settings> =>
    (await db.get<Settings>("net_settings", "settings")) ?? { id: "settings", retention_until: defaultRetention(), updated_at: now() };

  /** Fill in a role's place from its most specific unit, and check it exists. */
  async function placeRole(input: RoleInput): Promise<Omit<Role, "id" | "person_id" | "is_primary" | "active" | "started_at" | "ended_at">> {
    const kind = input.kind;
    if (!(kind in ROLE_LABEL)) throw new Invalid({ role: "Choose a role." });
    const base = { kind, constituency: null as string | null, ward_code: null as number | null, village_code: null as number | null, group_type: null as GroupTypeId | null, group_id: null as string | null };
    if (kind === "candidate" || kind === "command_member") return base;
    if (VILLAGE_ROLES.includes(kind)) {
      const v = VILLAGE_BY_CODE.get(Number(input.village_code));
      if (!v) throw new Invalid({ village_code: "Choose the village." });
      return { ...base, constituency: v.constituency, ward_code: v.ward_code, village_code: v.village_code };
    }
    if (WARD_ROLES.includes(kind)) {
      const w = WARD_BY_CODE.get(Number(input.ward_code));
      if (!w) throw new Invalid({ ward_code: "Choose the ward." });
      return { ...base, constituency: w.constituency, ward_code: w.ward_code };
    }
    if (CONSTITUENCY_ROLES.includes(kind)) {
      if (!input.constituency || !CONSTITUENCIES.includes(input.constituency)) throw new Invalid({ constituency: "Choose the constituency." });
      return { ...base, constituency: input.constituency };
    }
    if (kind === "group_unit_leader") {
      const g = input.group_id ? await db.get<Group>("net_groups", input.group_id) : null;
      if (!g || g.level !== "unit") throw new Invalid({ group_id: "Choose the local unit (stage, congregation, chama or association)." });
      return { ...base, group_type: g.type, group_id: g.id, constituency: g.constituency, ward_code: g.ward_code, village_code: g.village_code };
    }
    if (!isGroupType(input.group_type)) throw new Invalid({ group_type: "Choose the group type." });
    if (kind === "group_county_lead") return { ...base, group_type: input.group_type };
    if (kind === "group_constituency_lead") {
      if (!input.constituency || !CONSTITUENCIES.includes(input.constituency)) throw new Invalid({ constituency: "Choose the constituency." });
      return { ...base, group_type: input.group_type, constituency: input.constituency };
    }
    const w = WARD_BY_CODE.get(Number(input.ward_code));
    if (!w) throw new Invalid({ ward_code: "Choose the ward." });
    return { ...base, group_type: input.group_type, constituency: w.constituency, ward_code: w.ward_code };
  }

  async function appoint(person: Person, input: RoleInput, existing: Role[]): Promise<Role> {
    const placed = await placeRole(input);
    ensure(canManageRole(actor, placed), "You cannot appoint to that seat. It is outside your area or above your level.");
    if (existing.some((r) => r.active && r.kind === placed.kind && r.village_code === placed.village_code && r.ward_code === placed.ward_code && r.constituency === placed.constituency && r.group_type === placed.group_type && r.group_id === placed.group_id)) {
      throw new Invalid({ role: "This person already holds that seat." });
    }
    const hasPrimary = existing.some((r) => r.active && r.is_primary);
    const role: Role = {
      id: newId(), person_id: person.id, ...placed,
      is_primary: !hasPrimary,
      active: person.eligibility === "cleared" && person.status === "active",
      started_at: now(), ended_at: null,
    };
    await db.insert("net_roles", role);
    await audit("role_change", "net_roles", role.id, `appointed ${ROLE_LABEL[role.kind]}${role.active ? "" : " (held until Command clears eligibility)"}`);
    return role;
  }

  /** People whose seats sit in an area, for a task or broadcast: one entry per person. */
  async function recipients(target: Target | null, chain: "geo" | "group" | "all"): Promise<{ person: Person; role: Role }[]> {
    const { people, roles } = await load();
    const byId = new Map(people.map((p) => [p.id, p]));
    const out = new Map<string, { person: Person; role: Role }>();
    for (const r of seatRoles(people, roles)) {
      const isGroup = GROUP_ROLES.includes(r.kind);
      if (chain === "geo" && !GEO_ROLES.includes(r.kind)) continue;
      if (chain === "group" && !isGroup) continue;
      if (chain === "all" && !GEO_ROLES.includes(r.kind) && !isGroup) continue;
      const t = target ?? {};
      if (t.level && t.level !== "group" && levelOfRole(r.kind) !== t.level) continue;
      if (t.role && r.kind !== t.role) continue;
      if (t.group_type && r.group_type !== t.group_type) continue;
      if (t.constituency && r.constituency !== t.constituency) continue;
      if (t.ward_code && r.ward_code !== t.ward_code) continue;
      if (t.village_code && r.village_code !== t.village_code) continue;
      if (!out.has(r.person_id)) out.set(r.person_id, { person: byId.get(r.person_id)!, role: r });
    }
    return [...out.values()];
  }

  /** In-app always; WhatsApp and USSD push only where connected. Every outcome is recorded as it was. */
  async function deliver(list: { person: Person }[], body: string, ref: { task_id?: string; message_id?: string }): Promise<Delivery[]> {
    const out: Delivery[] = [];
    for (const { person } of list) {
      const base = { message_id: ref.message_id ?? null, task_id: ref.task_id ?? null, person_id: person.id };
      out.push(await db.insert<Delivery>("net_deliveries", { id: newId(), ...base, channel: "app", status: "in_app", error: null, provider_id: null, at: now() }));
      for (const ch of [channels.whatsapp, channels.ussd]) {
        if (!ch.configured || !person.phone) continue;
        const r = await ch.send(person.phone, body);
        out.push(await db.insert<Delivery>("net_deliveries", { id: newId(), ...base, channel: ch.id, status: r.status, error: r.error, provider_id: r.provider_id, at: now() }));
      }
    }
    return out;
  }

  function validTarget(t: Target): Target {
    const out: Target = {};
    if (t.level) {
      if (!["constituency", "ward", "village", "group"].includes(t.level)) throw new Invalid({ target: "Choose a level." });
      out.level = t.level;
    }
    if (t.constituency) {
      if (!CONSTITUENCIES.includes(t.constituency)) throw new Invalid({ target: "Unknown constituency." });
      out.constituency = t.constituency;
    }
    if (t.ward_code) {
      if (!WARD_BY_CODE.has(Number(t.ward_code))) throw new Invalid({ target: "Unknown ward." });
      out.ward_code = Number(t.ward_code);
    }
    if (t.village_code) {
      if (!VILLAGE_BY_CODE.has(Number(t.village_code))) throw new Invalid({ target: "Unknown village." });
      out.village_code = Number(t.village_code);
    }
    if (t.role) {
      if (!(t.role in ROLE_LABEL) || t.role === "candidate" || t.role === "command_member") throw new Invalid({ target: "Choose a field role." });
      out.role = t.role;
    }
    if (t.group_type) {
      if (!isGroupType(t.group_type)) throw new Invalid({ target: "Unknown group type." });
      out.group_type = t.group_type;
    }
    return out;
  }

  /** Where a report or reply from this role goes: the next seat up its own chain. */
  async function reportsTo(role: Role): Promise<string | null> {
    const roles = (await load()).roles.filter((r) => r.active && r.person_id !== role.person_id);
    const first = (pred: (r: Role) => boolean, ...kinds: RoleKind[]) => {
      for (const k of kinds) {
        const hit = roles.find((r) => r.kind === k && pred(r));
        if (hit) return hit.person_id;
      }
      return null;
    };
    if (VILLAGE_ROLES.includes(role.kind)) return first((r) => r.ward_code === role.ward_code, "ward_coordinator", "ward_deputy") ?? first((r) => r.constituency === role.constituency, "constituency_coordinator", "constituency_deputy");
    if (WARD_ROLES.includes(role.kind)) return first((r) => r.constituency === role.constituency, "constituency_coordinator", "constituency_deputy");
    if (role.kind === "group_unit_leader") return first((r) => r.group_type === role.group_type && r.ward_code === role.ward_code, "group_ward_rep") ?? first((r) => r.group_type === role.group_type && r.constituency === role.constituency, "group_constituency_lead") ?? first((r) => r.group_type === role.group_type, "group_county_lead");
    if (role.kind === "group_ward_rep") return first((r) => r.group_type === role.group_type && r.constituency === role.constituency, "group_constituency_lead") ?? first((r) => r.group_type === role.group_type, "group_county_lead");
    if (role.kind === "group_constituency_lead") return first((r) => r.group_type === role.group_type, "group_county_lead");
    return null; // Constituency seats, county group leads and Command report to Command itself.
  }

  const myRoles = () => (actor.kind === "person" ? actor.roles.filter((r) => r.active) : []);
  const primaryRole = () => myRoles().find((r) => r.is_primary) ?? myRoles()[0] ?? null;

  function funnelOf(as: Assignment[]): Funnel {
    const c = Object.fromEntries(TASK_STATES.map((s) => [s, as.filter((a) => a.state === s).length])) as Record<TaskState, number>;
    return {
      ...c,
      stages: [
        { label: "Assigned", value: as.length },
        { label: "Acknowledged", value: as.filter((a) => a.state !== "Assigned").length },
        { label: "Done", value: c.Done },
      ],
    };
  }

  function summarise(reports: Report[], keyOf: (r: Report) => string): UnitSummary[] {
    const m = new Map<string, UnitSummary>();
    for (const r of reports) {
      const k = keyOf(r);
      const s = m.get(k) ?? { key: k, reports: 0, people_reached: 0, follow_ups: 0, issues: {} };
      s.reports++;
      s.people_reached += r.people_reached;
      if (r.follow_up) s.follow_ups++;
      if (r.issue_category) s.issues[r.issue_category] = (s.issues[r.issue_category] ?? 0) + 1;
      m.set(k, s);
    }
    return [...m.values()];
  }

  return {
    actor,

    /* ---------------------------------------------------------------- coverage */

    /** Seat counts and states. Counts only, so any signed-in seat may see the county picture. */
    async coverage(): Promise<Coverage> {
      signedIn();
      const { people, roles } = await load();
      return computeCoverage(seatRoles(people, roles), await db.list<UnitTarget>("net_targets"));
    },

    /** Distinct people holding a seat: two roles, one person. */
    async uniquePeople(): Promise<number> {
      signedIn();
      const { people, roles } = await load();
      return uniquePeople(seatRoles(people, roles));
    },

    /* ---------------------------------------------------------------- people */

    /** The people the actor may see, with contacts. Viewing a contact list is logged. */
    async people(filter: { ward_code?: number; constituency?: string } = {}): Promise<PersonView[]> {
      signedIn();
      if (isCandidate(actor) && !isCommand(actor) && myRoles().every((r) => r.kind === "candidate")) throw new NotAllowed("Dr. Makali's view is the digest and county totals.");
      const { people, rolesOf } = await load();
      const out = people
        .filter((p) => canReadPerson(actor, p.id, rolesOf.get(p.id) ?? []) && (isCommand(actor) || p.id === me || p.status === "active"))
        .map((p) => ({ person: p, roles: rolesOf.get(p.id) ?? [] }))
        .filter((v) => (!filter.ward_code || v.roles.some((r) => r.ward_code === filter.ward_code)) && (!filter.constituency || v.roles.some((r) => r.constituency === filter.constituency)));
      if (out.some((v) => v.person.id !== me)) await audit("view_contacts", "net_people", null, `viewed a contact list of ${out.length} ${out.length === 1 ? "person" : "people"}`);
      return out;
    },

    async person(id: string): Promise<PersonView> {
      signedIn();
      const p = await db.get<Person>("net_people", id);
      const roles = p ? await db.list<Role>("net_roles", { person_id: id }) : [];
      ensure(!!p && canReadPerson(actor, id, roles));
      if (id !== me) await audit("view_contacts", "net_people", id, "viewed one contact record");
      return { person: p!, roles };
    },

    /**
     * Register a campaigner, with consent, the declaration and a seat. A serving county officer is
     * refused and nothing is stored. Anyone paid from public funds, or unsure, is stored with the
     * seat held until Command decides. A number already registered gets the new role on the same
     * person, so one person is never two.
     */
    async register(input: RegisterInput): Promise<PersonView> {
      const errors: Record<string, string> = {};
      const name = text(input.name, 120);
      if (!name) errors.name = "Enter the person's name.";
      const phone = toE164(text(input.phone, 30));
      if (!phone) errors.phone = "Enter a Kenyan mobile number, for example 0712 345 678.";
      const email = text(input.email ?? "", 200).toLowerCase() || null;
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = "Enter a valid email address, or leave it blank.";
      if (!input.consent_confirmed) errors.consent = "Record the person's consent before storing their details.";
      if (!["in_person", "phone_call", "whatsapp", "ussd", "web_form"].includes(input.consent_channel)) errors.consent_channel = "Say how consent was given.";
      const elig = eligibilityFor(input);
      if (elig.problem) errors.declaration = elig.problem;
      if (Object.keys(errors).length) throw new Invalid(errors);

      const { people, rolesOf } = await load();
      const existing = people.find((p) => p.phone === phone);
      if (existing) {
        if (!canEditPerson(actor, existing.id, rolesOf.get(existing.id) ?? [])) throw new NotAllowed("This number is already registered outside your area. Ask Campaign Command to add the role.");
        await appoint(existing, input.role, rolesOf.get(existing.id) ?? []);
        return { person: existing, roles: await db.list<Role>("net_roles", { person_id: existing.id }) };
      }
      // Check the seat before anything is stored.
      ensure(canManageRole(actor, await placeRole(input.role)), "You cannot appoint to that seat. It is outside your area or above your level.");
      const person: Person = {
        id: newId(), name, phone, email,
        woman: input.woman ?? null, youth: input.youth ?? null,
        consent: { collected_by: actorLabel(actor), collected_at: now(), purpose: text(input.consent_purpose ?? "", 600) || CONSENT_PURPOSE, channel: input.consent_channel },
        declaration_not_public_officer: true, serving_county_officer: false, public_funds_role: input.public_funds_role,
        eligibility: elig.eligibility, status: "active", retention_until: (await settings()).retention_until,
        created_at: now(), updated_at: now(), created_by: actorLabel(actor),
      };
      await db.insert("net_people", person);
      await audit("create", "net_people", person.id, `registered a person${elig.eligibility === "review" ? "; eligibility routed to Command" : ""}`);
      const role = await appoint(person, input.role, []);
      return { person, roles: [role] };
    },

    /** A second seat for someone already registered: a village role and a group role, one person. */
    async addRole(personId: string, input: RoleInput): Promise<Role> {
      signedIn();
      const p = await db.get<Person>("net_people", personId);
      ensure(!!p && p.status === "active", "That person is not on the register.");
      return appoint(p!, input, await db.list<Role>("net_roles", { person_id: personId }));
    },

    async endRole(roleId: string): Promise<void> {
      signedIn();
      const r = await db.get<Role>("net_roles", roleId);
      ensure(!!r && canManageRole(actor, r!));
      await db.update<Role>("net_roles", roleId, { active: false, is_primary: false, ended_at: now() });
      if (r!.is_primary) {
        const next = (await db.list<Role>("net_roles", { person_id: r!.person_id, active: true }))[0];
        if (next) await db.update<Role>("net_roles", next.id, { is_primary: true });
      }
      await audit("role_change", "net_roles", roleId, `ended ${ROLE_LABEL[r!.kind]}`);
    },

    /** Each person has one primary reporting line. */
    async setPrimary(roleId: string): Promise<void> {
      signedIn();
      const r = await db.get<Role>("net_roles", roleId);
      ensure(!!r && r!.active && (r!.person_id === me || canManageRole(actor, r!)));
      for (const other of await db.list<Role>("net_roles", { person_id: r!.person_id })) {
        if (other.is_primary !== (other.id === roleId)) await db.update<Role>("net_roles", other.id, { is_primary: other.id === roleId });
      }
      await audit("role_change", "net_roles", roleId, `made ${ROLE_LABEL[r!.kind]} the primary reporting line`);
    },

    /** Correction: by the person themselves, Command, or whoever manages one of their seats. */
    async correct(personId: string, patch: { name?: string; phone?: string; email?: string | null; woman?: boolean | null; youth?: boolean | null }): Promise<Person> {
      signedIn();
      const p = await db.get<Person>("net_people", personId);
      const roles = await db.list<Role>("net_roles", { person_id: personId });
      ensure(!!p && canEditPerson(actor, personId, roles));
      const next: Partial<Person> = { updated_at: now() };
      if (patch.name !== undefined) {
        const n = text(patch.name, 120);
        if (!n) throw new Invalid({ name: "Enter the person's name." });
        next.name = n;
      }
      if (patch.phone !== undefined) {
        const ph = toE164(patch.phone);
        if (!ph) throw new Invalid({ phone: "Enter a Kenyan mobile number." });
        if ((await db.list<Person>("net_people", { phone: ph })).some((x) => x.id !== personId)) throw new Invalid({ phone: "That number belongs to another registered person." });
        next.phone = ph;
      }
      if (patch.email !== undefined) next.email = patch.email ? text(patch.email, 200).toLowerCase() : null;
      if (patch.woman !== undefined) next.woman = patch.woman;
      if (patch.youth !== undefined) next.youth = patch.youth;
      const out = await db.update<Person>("net_people", personId, next);
      await audit("edit", "net_people", personId, `corrected ${Object.keys(next).filter((k) => k !== "updated_at").join(", ") || "nothing"}`);
      return out;
    },

    /** Withdrawal of consent: every seat ends and the person's details are erased at once. */
    async withdraw(personId: string): Promise<void> {
      signedIn();
      const p = await db.get<Person>("net_people", personId);
      const roles = await db.list<Role>("net_roles", { person_id: personId });
      ensure(!!p && canEditPerson(actor, personId, roles));
      for (const r of roles.filter((x) => x.active)) await db.update<Role>("net_roles", r.id, { active: false, is_primary: false, ended_at: now() });
      await db.update<Person>("net_people", personId, { name: "Withdrawn", phone: null, email: null, woman: null, youth: null, status: "withdrawn", updated_at: now() });
      await audit("withdraw", "net_people", personId, "consent withdrawn; seats ended and details erased");
    },

    /** Deletion: the person, their seats and their assignments are removed. Their reports stay, unlinked. */
    async remove(personId: string): Promise<void> {
      signedIn();
      const p = await db.get<Person>("net_people", personId);
      const roles = await db.list<Role>("net_roles", { person_id: personId });
      ensure(!!p && (isCommand(actor) || personId === me), "Only Campaign Command, or the person themselves, can delete a record.");
      await erase(personId, roles);
      await audit("delete", "net_people", personId, "record deleted");
    },

    /** Command decides a routed eligibility case. Barred: the record is deleted. */
    async decideEligibility(personId: string, decision: "cleared" | "barred"): Promise<void> {
      ensure(isCommand(actor), "Campaign Command decides eligibility.");
      const roles = await db.list<Role>("net_roles", { person_id: personId });
      if (decision === "barred") {
        await erase(personId, roles);
        await audit("eligibility", "net_people", personId, "barred; record deleted");
        return;
      }
      await db.update<Person>("net_people", personId, { eligibility: "cleared", updated_at: now() });
      for (const r of roles.filter((x) => !x.ended_at)) await db.update<Role>("net_roles", r.id, { active: true });
      await audit("eligibility", "net_people", personId, "cleared; seats activated");
    },

    /* ---------------------------------------------------------------- targets and aliases */

    async setTarget(unit: "ward" | "village", code: number, target: number): Promise<void> {
      signedIn();
      ensure(canSetUnit(actor, unit, code), "You can raise targets only inside your own area.");
      if (!Number.isInteger(target) || target < VILLAGE_MINIMUM || target > 50) throw new Invalid({ target: `A target is a whole number from ${VILLAGE_MINIMUM} (the network minimum) to 50.` });
      const prior = (await db.list<UnitTarget>("net_targets", { unit, code }))[0];
      if (prior) await db.update<UnitTarget>("net_targets", prior.id, { target, set_by: actorLabel(actor), at: now() });
      else await db.insert<UnitTarget>("net_targets", { id: newId(), unit, code, target, set_by: actorLabel(actor), at: now() });
      await audit("settings", "net_targets", `${unit}:${code}`, `set the ${unit} target to ${target} per village`);
    },

    async targets(): Promise<UnitTarget[]> {
      signedIn();
      return db.list<UnitTarget>("net_targets");
    },

    /** A local spelling. It finds the village; it never changes the code or the official name. */
    async addAlias(villageCode: number, alias: string): Promise<Alias> {
      signedIn();
      ensure(canSetUnit(actor, "village", villageCode), "You can add spellings only for villages in your own area.");
      const a = text(alias, 80);
      if (!a) throw new Invalid({ alias: "Enter the local spelling." });
      const row: Alias = { id: newId(), village_code: villageCode, alias: a, added_by: actorLabel(actor), at: now() };
      await db.insert("net_aliases", row);
      await audit("settings", "net_aliases", row.id, `added a spelling for village ${villageCode}`);
      return row;
    },

    async aliases(): Promise<Alias[]> {
      signedIn();
      return db.list<Alias>("net_aliases");
    },

    /* ---------------------------------------------------------------- special groups */

    async groups(): Promise<(Group & { access: "full" | "summary" })[]> {
      signedIn();
      const out: (Group & { access: "full" | "summary" })[] = [];
      for (const g of await db.list<Group>("net_groups")) {
        const a = canReadGroup(actor, g);
        if (a === "full") out.push({ ...g, access: a });
        else if (a === "summary") out.push({ ...g, leader_name: null, leader_phone: null, consent: null, access: a });
      }
      if (out.some((g) => g.access === "full" && g.leader_phone)) await audit("view_contacts", "net_groups", null, `viewed ${out.length} group records with leader contacts`);
      return out;
    },

    async saveGroup(input: Partial<Group> & { id?: string }): Promise<Group> {
      signedIn();
      const prior = input.id ? await db.get<Group>("net_groups", input.id) : null;
      const errors: Record<string, string> = {};
      const type = input.type ?? prior?.type;
      if (!isGroupType(type)) errors.type = "Choose the group type.";
      const name = text(input.name ?? prior?.name ?? "", 160);
      if (!name) errors.name = "Enter the group's name.";
      const level = input.level ?? prior?.level ?? "unit";
      if (!["county", "constituency", "ward", "unit"].includes(level)) errors.level = "Choose the level.";
      let ward_code = input.ward_code !== undefined ? (input.ward_code ? Number(input.ward_code) : null) : prior?.ward_code ?? null;
      const village_code = input.village_code !== undefined ? (input.village_code ? Number(input.village_code) : null) : prior?.village_code ?? null;
      if (village_code !== null) {
        const v = VILLAGE_BY_CODE.get(village_code);
        if (!v) errors.village_code = "Unknown village.";
        else ward_code = v.ward_code;
      }
      if ((level === "unit" || level === "ward") && (!ward_code || !WARD_BY_CODE.has(ward_code))) errors.ward_code = "Every local unit links to a ward. Choose it.";
      const constituency = ward_code ? constituencyOfWard(ward_code) : input.constituency ?? prior?.constituency ?? null;
      if (level === "constituency" && (!constituency || !CONSTITUENCIES.includes(constituency))) errors.constituency = "Choose the constituency.";
      const consent_status = input.consent_status ?? prior?.consent_status ?? "not_asked";
      const leader_name = input.leader_name !== undefined ? text(input.leader_name ?? "", 120) || null : prior?.leader_name ?? null;
      const rawPhone = input.leader_phone !== undefined ? text(input.leader_phone ?? "", 30) : prior?.leader_phone ?? "";
      const leader_phone = rawPhone ? toE164(rawPhone) : null;
      if (rawPhone && !leader_phone) errors.leader_phone = "Enter a Kenyan mobile number.";
      if ((leader_name || leader_phone) && consent_status !== "given") errors.consent_status = "Record the leader's consent before storing their contact.";
      const endorsed = input.endorsement_confirmed_in_writing ?? prior?.endorsement_confirmed_in_writing ?? false;
      const endorsement_reference = text(input.endorsement_reference ?? prior?.endorsement_reference ?? "", 200) || null;
      if (endorsed && !endorsement_reference) errors.endorsement_reference = "An institutional endorsement is recorded only when confirmed in writing: give the letter's reference.";
      const approx = input.approx_members !== undefined ? input.approx_members : prior?.approx_members ?? null;
      if (approx !== null && (!Number.isInteger(Number(approx)) || Number(approx) < 0)) errors.approx_members = "Approximate members is a whole number.";
      if (Object.keys(errors).length) throw new Invalid(errors);
      const g: Group = {
        id: prior?.id ?? newId(), type: type as GroupTypeId, name, level, constituency, ward_code, village_code,
        leader_name: consent_status === "given" ? leader_name : null, leader_phone: consent_status === "given" ? leader_phone : null,
        approx_members: approx === null ? null : Number(approx),
        activation: input.activation ?? prior?.activation ?? "identified",
        representative_person_id: input.representative_person_id !== undefined ? input.representative_person_id : prior?.representative_person_id ?? null,
        consent_status,
        consent: consent_status === "given" ? prior?.consent ?? { collected_by: actorLabel(actor), collected_at: now(), purpose: CONSENT_PURPOSE, channel: "in_person" } : null,
        endorsement_confirmed_in_writing: endorsed, endorsement_reference: endorsed ? endorsement_reference : null,
        created_at: prior?.created_at ?? now(), updated_at: now(),
      };
      ensure(canEditGroup(actor, g) && (!prior || canEditGroup(actor, prior)), "You can edit groups only in your own group chain.");
      if (prior) await db.update<Group>("net_groups", g.id, g);
      else await db.insert("net_groups", g);
      await audit(prior ? "edit" : "create", "net_groups", g.id, `${prior ? "updated" : "added"} a ${type} ${level}`);
      return g;
    },

    /* ---------------------------------------------------------------- tasks */

    async templates(): Promise<Template[]> {
      signedIn();
      const saved = await db.list<Template>("net_templates");
      const byId = new Map(saved.map((t) => [t.id, t]));
      return [...DEFAULT_TEMPLATES.map((d) => byId.get(d.id) ?? { ...d, updated_at: "" }), ...saved.filter((t) => !DEFAULT_TEMPLATES.some((d) => d.id === t.id))];
    },

    async saveTemplate(t: Omit<Template, "updated_at">): Promise<Template> {
      ensure(canIssueTasks(actor), "Campaign Command edits the templates.");
      const errors: Record<string, string> = {};
      if (!text(t.name)) errors.name = "Name the template.";
      if (!text(t.title)) errors.title = "Give the task a title.";
      if (!text(t.instructions)) errors.instructions = "Write the instructions.";
      if (!OBJECTIVE_BY_N[t.objective]) errors.objective = "Link the template to one of the five objectives.";
      const bad = prohibitedReason(t.title, t.instructions, t.evidence);
      if (bad) errors.instructions = `Refused: this involves ${bad}.`;
      if (Object.keys(errors).length) throw new Invalid(errors);
      const id = text(t.id, 60) || newId();
      const row: Template = { id, name: text(t.name, 80), title: text(t.title, 160), instructions: text(t.instructions), evidence: text(t.evidence, 400), objective: t.objective, updated_at: now() };
      if (await db.get("net_templates", id)) await db.update("net_templates", id, row);
      else await db.insert("net_templates", row);
      await audit("settings", "net_templates", id, "saved a task template");
      return row;
    },

    /** Command issues a task: it reaches every person holding a matching seat, and nobody else. */
    async createTask(input: { title: string; instructions: string; due: string; evidence: string; objective: string; template?: string | null; target: Target }) {
      ensure(canIssueTasks(actor), "Campaign Command issues tasks.");
      const errors: Record<string, string> = {};
      const title = text(input.title, 160);
      const instructions = text(input.instructions);
      const evidence = text(input.evidence, 400);
      if (!title) errors.title = "Give the task a title.";
      if (!instructions) errors.instructions = "Write the instructions.";
      if (!isDate(input.due)) errors.due = "Choose a due date.";
      if (!evidence) errors.evidence = "Say what evidence is required.";
      if (!OBJECTIVE_BY_N[input.objective]) errors.objective = "Link the task to one of the five objectives.";
      const bad = prohibitedReason(title, instructions, evidence);
      if (bad) errors.instructions = `Refused: this task involves ${bad}.`;
      if (Object.keys(errors).length) throw new Invalid(errors);
      const target = validTarget(input.target ?? {});
      const chain: Task["chain"] = target.level === "group" || target.group_type || (target.role && GROUP_ROLES.includes(target.role)) ? "group" : "geo";
      const task: Task = { id: newId(), title, instructions, due: input.due, evidence, objective: input.objective, template: input.template ?? null, target, chain, created_by: actorLabel(actor), created_at: now() };
      await db.insert("net_tasks", task);
      const people = await recipients(target, chain);
      const assignments: Assignment[] = [];
      for (const { person, role } of people) {
        assignments.push(await db.insert<Assignment>("net_assignments", { id: newId(), task_id: task.id, person_id: person.id, role_id: role.id, state: "Assigned", note: null, via: "app", clash_decision: null, updated_at: now() }));
      }
      const deliveries = await deliver(people, `New campaign task: ${title}. Due ${input.due}. Open the campaign app, or dial the campaign shortcode, to acknowledge it.`, { task_id: task.id });
      await audit("create", "net_tasks", task.id, `issued a task to ${assignments.length} ${assignments.length === 1 ? "person" : "people"}`);
      return { task, assignments, deliveries };
    },

    /** Tasks the actor issued or can follow, with their assignments in scope and the funnel. */
    async tasks() {
      signedIn();
      const [tasks, all, deliveries, { rolesOf }] = await Promise.all([db.list<Task>("net_tasks"), db.list<Assignment>("net_assignments"), db.list<Delivery>("net_deliveries"), load()]);
      const command = isCommand(actor);
      const visible = all.filter((a) => command || a.person_id === me || canReadPerson(actor, a.person_id, rolesOf.get(a.person_id) ?? []));
      if (!command && isCandidate(actor) && myRoles().every((r) => r.kind === "candidate")) throw new NotAllowed("Dr. Makali's view is the digest and county totals.");
      const ids = new Set(visible.map((a) => a.task_id));
      return tasks
        .filter((t) => command || ids.has(t.id))
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map((t) => {
          const as = visible.filter((a) => a.task_id === t.id);
          const ds = deliveries.filter((d) => d.task_id === t.id && (command || as.some((a) => a.person_id === d.person_id)));
          return { task: t, assignments: as, funnel: funnelOf(as), deliveries: { in_app: ds.filter((d) => d.status === "in_app").length, sent: ds.filter((d) => d.status === "sent").length, failed: ds.filter((d) => d.status === "failed") } };
        });
    },

    async myAssignments(): Promise<{ assignment: Assignment; task: Task }[]> {
      signedIn();
      if (!me) return [];
      const as = await db.list<Assignment>("net_assignments", { person_id: me });
      const tasks = new Map((await db.list<Task>("net_tasks")).map((t) => [t.id, t]));
      return as.map((a) => ({ assignment: a, task: tasks.get(a.task_id)! })).filter((x) => x.task).sort((a, b) => a.task.due.localeCompare(b.task.due));
    },

    async updateAssignment(id: string, state: TaskState, note?: string | null, via: Assignment["via"] = "app"): Promise<Assignment> {
      signedIn();
      const a = await db.get<Assignment>("net_assignments", id);
      ensure(!!a && (a!.person_id === me || isCommand(actor)), "You can update only your own tasks.");
      if (!TASK_STATES.includes(state)) throw new Invalid({ state: "Choose a state." });
      const n = note ? text(note, 600) : null;
      if (n && prohibitedReason(n)) throw new Invalid({ note: `Refused: this involves ${prohibitedReason(n)}. To report someone else doing it, use Report misconduct.` });
      return db.update<Assignment>("net_assignments", id, { state, note: n ?? a!.note, via, updated_at: now() });
    },

    /** A person with a geographic task and a group-chain task due the same day: Command decides which stands. */
    async clashes() {
      ensure(isCommand(actor), "Campaign Command resolves clashes.");
      const [as, tasks] = await Promise.all([db.list<Assignment>("net_assignments"), db.list<Task>("net_tasks")]);
      const t = new Map(tasks.map((x) => [x.id, x]));
      const open = as.filter((a) => a.state !== "Done" && !a.clash_decision && t.get(a.task_id));
      const out: { person_id: string; geo: Assignment; group: Assignment; due: string }[] = [];
      for (const g of open.filter((a) => t.get(a.task_id)!.chain === "group")) {
        for (const o of open.filter((a) => a.person_id === g.person_id && t.get(a.task_id)!.chain === "geo")) {
          if (t.get(g.task_id)!.due === t.get(o.task_id)!.due) out.push({ person_id: g.person_id, geo: o, group: g, due: t.get(g.task_id)!.due });
        }
      }
      return out;
    },

    async decideClash(assignmentIds: string[], decision: string): Promise<void> {
      ensure(isCommand(actor), "Campaign Command resolves clashes.");
      const d = text(decision, 400);
      if (!d) throw new Invalid({ decision: "Say which task stands, and when the other is done." });
      for (const id of assignmentIds) await db.update<Assignment>("net_assignments", id, { clash_decision: d, updated_at: now() });
      await audit("edit", "net_assignments", null, `resolved a task clash for ${assignmentIds.length} assignments`);
    },

    /* ---------------------------------------------------------------- field reports */

    /** A field signal from a seat holder. It reports up their own line: ward, or group chain. */
    async submitReport(input: { role_id?: string | null; task_id?: string | null; activity: string; ward_code?: number | null; village_code?: number | null; people_reached: number; issue_category?: string | null; issue_text?: string | null; follow_up: boolean; follow_up_note?: string | null; photo_path?: string | null; channel?: Report["channel"] }): Promise<Report> {
      signedIn();
      ensure(isSignedIn(actor), "Only a person holding a seat can file a field report.");
      const role = input.role_id ? myRoles().find((r) => r.id === input.role_id) : primaryRole();
      if (!role) throw new NotAllowed("Choose one of your own seats to report from.");
      if (role.kind === "candidate") throw new NotAllowed("Dr. Makali receives the digest; he does not file field reports.");
      const errors: Record<string, string> = {};
      const activity = text(input.activity, 600);
      if (!activity) errors.activity = "Say what you did.";
      const reached = Number(input.people_reached);
      if (!Number.isInteger(reached) || reached < 0 || reached > 100000) errors.people_reached = "People reached is a whole number.";
      const cat = input.issue_category ? (ISSUE_CATEGORIES.includes(input.issue_category as IssueCategory) ? (input.issue_category as IssueCategory) : null) : null;
      if (input.issue_category && !cat) errors.issue_category = "Choose an issue from the list.";
      let ward_code = role.ward_code ?? (input.ward_code ? Number(input.ward_code) : null);
      let village_code = role.village_code ?? (input.village_code ? Number(input.village_code) : null);
      if (village_code !== null) {
        const v = VILLAGE_BY_CODE.get(village_code);
        if (!v || (role.ward_code !== null && v.ward_code !== role.ward_code)) errors.village_code = "Choose a village in your ward.";
        else ward_code = v.ward_code;
      }
      if (!ward_code || !WARD_BY_CODE.has(ward_code)) errors.ward_code = "Choose the ward.";
      else if (role.constituency && constituencyOfWard(ward_code) !== role.constituency) errors.ward_code = "Choose a ward in your constituency.";
      const bad = prohibitedReason(activity, input.issue_text, input.follow_up_note);
      if (bad) errors.activity = `This report describes ${bad}. If you are reporting someone else doing it, use Report misconduct instead.`;
      if (input.task_id) {
        const mine = await db.list<Assignment>("net_assignments", { task_id: input.task_id, person_id: me });
        if (!mine.length) errors.task_id = "That task is not one of yours.";
      }
      if (Object.keys(errors).length) throw new Invalid(errors);
      if (ward_code === null) throw new Invalid({ ward_code: "Choose the ward." });
      village_code = village_code ?? null;
      const r: Report = {
        id: newId(), person_id: me!, role_id: role.id, task_id: input.task_id ?? null,
        chain: GROUP_ROLES.includes(role.kind) ? "group" : "geo",
        activity, constituency: constituencyOfWard(ward_code)!, ward_code, village_code, group_type: role.group_type,
        people_reached: reached, issue_category: cat, issue_text: text(input.issue_text ?? "", 600) || null,
        follow_up: !!input.follow_up, follow_up_note: text(input.follow_up_note ?? "", 600) || null,
        photo_path: input.photo_path ?? null, channel: input.channel ?? "app", created_at: now(),
      };
      await db.insert("net_reports", r);
      return r;
    },

    async reports(): Promise<Report[]> {
      signedIn();
      return (await db.list<Report>("net_reports")).filter((r) => canReadReport(actor, r)).sort((a, b) => b.created_at.localeCompare(a.created_at));
    },

    /** Ward summaries rolled up to constituencies, from the reports the actor may read. Counts only. */
    async rollup(): Promise<{ wards: UnitSummary[]; constituencies: UnitSummary[]; county: UnitSummary }> {
      signedIn();
      const rs = (await db.list<Report>("net_reports")).filter((r) => canReadReport(actor, r));
      const county = summarise(rs, () => "county")[0] ?? { key: "county", reports: 0, people_reached: 0, follow_ups: 0, issues: {} };
      return { wards: summarise(rs, (r) => String(r.ward_code)), constituencies: summarise(rs, (r) => r.constituency), county };
    },

    /** Dr. Makali's one screen. Totals and states only: no names, no reports, no queue. */
    async digest(): Promise<Digest> {
      ensure(canReadDigest(actor), "The digest is for Dr. Makali and Campaign Command.");
      const [{ people, roles }, targets, as, rs, flags] = await Promise.all([load(), db.list<UnitTarget>("net_targets"), db.list<Assignment>("net_assignments"), db.list<Report>("net_reports"), db.list<Flag>("net_flags", { state: "open" })]);
      const seats = seatRoles(people, roles);
      const cov = computeCoverage(seats, targets);
      const since = new Date(Date.parse(now()) - 7 * 864e5).toISOString();
      const recent = rs.filter((r) => r.created_at >= since);
      const issues = new Map<string, number>();
      for (const r of recent) if (r.issue_category) issues.set(r.issue_category, (issues.get(r.issue_category) ?? 0) + 1);
      const flagged = new Set(people.filter((p) => p.woman || p.youth).map((p) => p.id));
      const staffed = cov.villages.filter((v) => v.filled > 0);
      const wyMet = staffed.filter((v) => seats.some((s) => VILLAGE_ROLES.includes(s.kind) && s.village_code === v.village_code && flagged.has(s.person_id))).length;
      return {
        generated_at: now(),
        coverage: cov.county,
        constituencies: cov.constituencies.map((c) => ({ constituency: c.constituency, required: c.required, filled_to_target: c.filled_to_target, state: c.state, reports_7d: recent.filter((r) => r.constituency === c.constituency).length })),
        unique_people: uniquePeople(seats),
        women_or_youth_villages: { met: wyMet, of: staffed.length },
        funnel: funnelOf(as),
        reports_7d: recent.length,
        people_reached_7d: recent.reduce((n, r) => n + r.people_reached, 0),
        top_issues_7d: [...issues.entries()].map(([issue, count]) => ({ issue, count })).sort((a, b) => b.count - a.count).slice(0, 5),
        open_flags: { safety: flags.filter((f) => f.kind === "safety").length, misconduct: flags.filter((f) => f.kind === "misconduct").length, unresponsive: flags.filter((f) => f.kind === "unresponsive").length },
        pending_review: people.filter((p) => p.status === "active" && p.eligibility === "review").length,
      };
    },

    /* ---------------------------------------------------------------- urgent flags and misconduct */

    /** Skip-level: straight to Command, whatever the sender's seat. */
    async raiseFlag(input: { kind: FlagKind; details: string; ward_code?: number | null }): Promise<Flag> {
      signedIn();
      if (actor.kind !== "person") throw new NotAllowed("Sign in to raise a flag.");
      if (!["safety", "misconduct", "unresponsive"].includes(input.kind)) throw new Invalid({ kind: "Choose what kind of flag this is." });
      const details = text(input.details, 2000);
      if (!details) throw new Invalid({ details: "Say what happened, where and when." });
      const ward = input.ward_code ? Number(input.ward_code) : primaryRole()?.ward_code ?? null;
      if (ward !== null && !WARD_BY_CODE.has(ward)) throw new Invalid({ ward_code: "Unknown ward." });
      const f: Flag = { id: newId(), kind: input.kind, raised_by: me!, details, constituency: ward ? constituencyOfWard(ward) : primaryRole()?.constituency ?? null, ward_code: ward, owner_person_id: null, state: "open", resolution: null, created_at: now(), closed_at: null };
      await db.insert("net_flags", f);
      return f;
    },

    async flags(): Promise<Flag[]> {
      signedIn();
      const all = await db.list<Flag>("net_flags");
      return (isCommand(actor) ? all : all.filter((f) => f.raised_by === me)).sort((a, b) => b.created_at.localeCompare(a.created_at));
    },

    async updateFlag(id: string, patch: { owner_person_id?: string | null; state?: "open" | "closed"; resolution?: string | null }): Promise<Flag> {
      ensure(canManageFlags(actor), "Campaign Command owns urgent flags.");
      const f = await db.get<Flag>("net_flags", id);
      if (!f) throw new Invalid({ _: "That flag no longer exists." });
      const next: Partial<Flag> = {};
      if (patch.owner_person_id !== undefined) {
        if (patch.owner_person_id) {
          const r = await db.list<Role>("net_roles", { person_id: patch.owner_person_id, kind: "command_member", active: true });
          if (!r.length) throw new Invalid({ owner_person_id: "The owner must be a member of Campaign Command." });
        }
        next.owner_person_id = patch.owner_person_id;
      }
      if (patch.state === "closed") {
        if (!(patch.owner_person_id ?? f.owner_person_id)) throw new Invalid({ owner_person_id: "Name an owner before closing." });
        const res = text(patch.resolution ?? f.resolution ?? "", 1000);
        if (!res) throw new Invalid({ resolution: "Record how it was resolved." });
        Object.assign(next, { state: "closed", resolution: res, closed_at: now() });
      } else if (patch.state === "open") Object.assign(next, { state: "open", closed_at: null });
      const out = await db.update<Flag>("net_flags", id, next);
      await audit("edit", "net_flags", id, `flag ${out.state}${out.owner_person_id ? ", owner named" : ""}`);
      return out;
    },

    /* ---------------------------------------------------------------- broadcasts and replies */

    /** Command sends to every seat in an area, his voice or Command's. Replies never come back to him. */
    async broadcast(input: { body: string; voice: "command" | "candidate"; audience?: Target | null }) {
      ensure(canBroadcast(actor), "Campaign Command sends broadcasts.");
      const body = text(input.body, 1000);
      if (!body) throw new Invalid({ body: "Write the message." });
      const bad = prohibitedReason(body);
      if (bad) throw new Invalid({ body: `Refused: this message involves ${bad}.` });
      const audience = input.audience ? validTarget(input.audience) : null;
      const m: Message = { id: newId(), kind: "broadcast", from_person_id: me!, voice: input.voice === "candidate" ? "candidate" : "command", body, audience, to_person_id: null, in_reply_to: null, created_at: now() };
      await db.insert("net_messages", m);
      const people = await recipients(audience, "all");
      const deliveries = await deliver(people, body, { message_id: m.id });
      await audit("create", "net_messages", m.id, `broadcast to ${people.length} ${people.length === 1 ? "person" : "people"}`);
      return { message: m, recipients: people.length, deliveries };
    },

    /** Broadcasts that reached the actor, and replies routed to them (or, for Command, to Command). */
    async inbox(): Promise<Message[]> {
      signedIn();
      const [ms, ds] = await Promise.all([db.list<Message>("net_messages"), me ? db.list<Delivery>("net_deliveries", { person_id: me }) : Promise.resolve([] as Delivery[])]);
      const got = new Set(ds.map((d) => d.message_id));
      return ms
        .filter((m) => got.has(m.id) || (m.kind === "reply" && (m.to_person_id === me || (m.to_person_id === null && isCommand(actor)))) || (isCommand(actor) && m.kind === "broadcast"))
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
    },

    async reply(messageId: string, body: string): Promise<Message> {
      signedIn();
      const m = await db.get<Message>("net_messages", messageId);
      const mine = me ? await db.list<Delivery>("net_deliveries", { person_id: me, message_id: messageId }) : [];
      ensure(!!m && (mine.length > 0 || m!.to_person_id === me), "You can reply only to messages you received.");
      const b = text(body, 1000);
      if (!b) throw new Invalid({ body: "Write your reply." });
      const role = primaryRole();
      const to = role ? await reportsTo(role) : null;
      const r: Message = { id: newId(), kind: "reply", from_person_id: me!, voice: "campaigner", body: b, audience: null, to_person_id: to, in_reply_to: messageId, created_at: now() };
      await db.insert("net_messages", r);
      return r;
    },

    /* ---------------------------------------------------------------- settings, retention, audit, export */

    settings,

    async setRetention(date: string): Promise<Settings> {
      ensure(canChangeSettings(actor), "Campaign Command sets the retention date.");
      if (!isDate(date) || date < ELECTION_DAY) throw new Invalid({ retention_until: "Choose a date after the election." });
      const s: Settings = { id: "settings", retention_until: date, updated_at: now() };
      if (await db.get("net_settings", "settings")) await db.update("net_settings", "settings", s);
      else await db.insert("net_settings", s);
      for (const p of await db.list<Person>("net_people")) await db.update<Person>("net_people", p.id, { retention_until: date });
      await audit("settings", "net_settings", "settings", `retention date set to ${date}`);
      return s;
    },

    /** Deletes everyone whose retention date has passed. Run by Command, or by the scheduled job. */
    async purgeExpired(): Promise<number> {
      ensure(canChangeSettings(actor), "Campaign Command runs the retention purge.");
      const expired = (await db.list<Person>("net_people")).filter((p) => p.retention_until < today());
      for (const p of expired) await erase(p.id, await db.list<Role>("net_roles", { person_id: p.id }));
      await audit("delete", "net_people", null, `retention purge deleted ${expired.length} records`);
      return expired.length;
    },

    async auditLog(limit = 300): Promise<AuditRow[]> {
      ensure(canReadAudit(actor), "Campaign Command reads the audit log.");
      return (await db.list<AuditRow>("net_audit")).sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
    },

    /** Command only, and logged. CSV, generated on request, never written to disk or /public. */
    async exportCsv(kind: "people" | "reports" | "coverage"): Promise<{ filename: string; body: string; rows: number }> {
      ensure(canExport(actor), "Only Campaign Command can export.");
      let out: { filename: string; body: string; rows: number };
      if (kind === "people") {
        const { people, rolesOf } = await load();
        const rows = people.flatMap((p) => (rolesOf.get(p.id) ?? []).filter((r) => r.active).map((r) => [p.name, p.phone, ROLE_LABEL[r.kind], r.is_primary ? "yes" : "", r.constituency, r.ward_code ? WARD_BY_CODE.get(r.ward_code)?.ward : "", r.ward_code, r.village_code ? VILLAGE_BY_CODE.get(r.village_code)?.village_name : "", r.village_code, r.group_type, p.eligibility, p.consent.collected_at.slice(0, 10), p.consent.channel, p.retention_until]));
        out = { filename: "campaigner-network-people.csv", body: csv(["name", "phone", "role", "primary", "constituency", "ward", "ward_code", "village", "village_code", "group_type", "eligibility", "consent_date", "consent_channel", "retention_until"], rows), rows: rows.length };
      } else if (kind === "reports") {
        const rs = await db.list<Report>("net_reports");
        const rows = rs.map((r) => [r.created_at, r.constituency, WARD_BY_CODE.get(r.ward_code)?.ward, r.ward_code, r.village_code, r.chain, r.group_type, r.activity, r.people_reached, r.issue_category, r.issue_text, r.follow_up ? "yes" : "no", r.channel]);
        out = { filename: "campaigner-network-field-signals.csv", body: csv(["created_at", "constituency", "ward", "ward_code", "village_code", "chain", "group_type", "activity", "people_reached", "issue", "issue_detail", "follow_up", "channel"], rows), rows: rows.length };
      } else {
        const { people, roles } = await load();
        const cov = computeCoverage(seatRoles(people, roles), await db.list<UnitTarget>("net_targets"));
        const rows = cov.villages.map((v) => {
          const ref = VILLAGE_BY_CODE.get(v.village_code)!;
          return [ref.constituency, ref.ward, ref.ward_code, ref.village_name, v.village_code, v.target, v.filled, v.state];
        });
        out = { filename: "campaigner-network-coverage.csv", body: csv(["constituency", "ward", "ward_code", "village", "village_code", "target", "filled", "state"], rows), rows: rows.length };
      }
      await audit("export", kind === "people" ? "net_people" : kind === "reports" ? "net_reports" : "coverage", null, `exported ${kind}: ${out.rows} rows`);
      return out;
    },
  };

  async function erase(personId: string, roles: Role[]) {
    for (const r of roles) await db.remove("net_roles", r.id);
    for (const a of await db.list<Assignment>("net_assignments", { person_id: personId })) await db.remove("net_assignments", a.id);
    for (const r of await db.list<Report>("net_reports", { person_id: personId })) await db.update<Report>("net_reports", r.id, { person_id: "deleted", photo_path: null });
    await db.remove("net_people", personId);
  }
}

export type NetworkService = ReturnType<typeof networkService>;
