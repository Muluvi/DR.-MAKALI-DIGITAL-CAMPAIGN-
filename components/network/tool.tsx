"use client";

/**
 * The Campaigner Network tool's forms. Phone-first: one column, 44px targets, native inputs.
 * Every submit goes to a server action (app/(platform)/network/actions.ts), which checks the
 * signed-in person's seats before it reads or writes; nothing here decides access.
 */
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import * as A from "@/app/(platform)/network/actions";
import type { NetResult } from "@/app/(platform)/network/actions";
import { CONSTITUENCIES, VILLAGES, WARDS, searchVillages, type VillageAlias } from "@/lib/network/reference";
import { ROLE_LABEL, type RoleKind } from "@/lib/network/structure";
import { GROUP_TYPES } from "@/lib/network/groups";
import { PUBLIC_FUNDS_ROLES, PUBLIC_OFFICER_DECLARATION, COUNTY_OFFICERS_BARRED, PROHIBITED_SUMMARY } from "@/lib/network/conduct";
import { ISSUE_CATEGORIES, TASK_STATES, type ConsentChannel, type GroupTypeId, type PublicFundsRole, type Target, type TaskState } from "@/lib/network/types";

/* ------------------------------------------------------------------ plumbing */

function useAct() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<NetResult | null>(null);
  const run = (fn: () => Promise<NetResult>, onOk?: () => void) =>
    start(async () => {
      const r = await fn();
      setResult(r);
      if (r.ok) {
        onOk?.();
        router.refresh();
      }
    });
  return { pending, result, run, err: (k: string) => (result && !result.ok ? result.errors[k] : undefined) };
}

function Msg({ result }: { result: NetResult | null }) {
  if (!result) return null;
  const text = result.ok ? result.message : Object.values(result.errors).join(" ");
  return <p className="nw-msg" data-ok={result.ok} role={result.ok ? "status" : "alert"}>{text}</p>;
}

function Field({ id, label, error, children, hint }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="plat-label">{label}</label>
      {children}
      {hint && <p className="plat-hint">{hint}</p>}
      {error && <p className="plat-error" role="alert">{error}</p>}
    </div>
  );
}

const Submit = ({ pending, children }: { pending: boolean; children: React.ReactNode }) => (
  <button type="submit" className="plat-btn plat-btn-solid w-full justify-center sm:w-auto" disabled={pending}>{pending ? "Saving…" : children}</button>
);

/* ------------------------------------------------------------------ signing in */

export function SignInForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const { pending, result, run, err } = useAct();
  return (
    <form
      className="plat-card nw-form p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!sent) run(() => A.sendCode(phone), () => setSent(true));
        else run(() => A.verifyCode(phone, code), () => router.push("/network"));
      }}
    >
      <Field id="phone" label="Your mobile number" error={err("phone")}>
        <input id="phone" className="plat-input" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={sent} />
      </Field>
      {sent && (
        <Field id="code" label="The code from the SMS" error={err("code")}>
          <input id="code" className="plat-input" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} required />
        </Field>
      )}
      <Msg result={result} />
      <Submit pending={pending}>{sent ? "Sign in" : "Send me a code"}</Submit>
    </form>
  );
}

/* ------------------------------------------------------------------ places */

export interface Scope {
  /** Role kinds this person may appoint. */
  kinds: RoleKind[];
  /** Ward codes inside their area (all 40 for Command). */
  wards: number[];
  constituencies: string[];
  groups: { id: string; name: string; type: GroupTypeId; ward_code: number | null }[];
}

function VillagePicker({ id, wards, value, onChange, aliases = [] }: { id: string; wards: number[]; value: number | ""; onChange: (v: number | "") => void; aliases?: VillageAlias[] }) {
  const [q, setQ] = useState("");
  const allowed = useMemo(() => new Set(wards), [wards]);
  const list = q.trim().length >= 2 ? searchVillages(q, aliases, 40).filter((v) => allowed.has(v.ward_code)) : VILLAGES.filter((v) => allowed.has(v.ward_code));
  return (
    <div className="grid gap-2">
      <input aria-label="Search villages by name, place or local spelling" className="plat-input" type="search" placeholder="Search by name, place or local spelling" value={q} onChange={(e) => setQ(e.target.value)} />
      <select id={id} aria-label="Village" className="plat-input" value={value} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")} required>
        <option value="">Choose the village</option>
        {list.map((v) => (
          <option key={v.village_code} value={v.village_code}>{v.village_name}, {v.ward} ({v.village_code})</option>
        ))}
      </select>
    </div>
  );
}

function RolePlace({ scope, kind, place, setPlace, err }: { scope: Scope; kind: RoleKind; place: Record<string, string | number | "">; setPlace: (p: Record<string, string | number | "">) => void; err: (k: string) => string | undefined }) {
  const village = kind === "village_lead" || kind === "village_campaigner";
  const ward = kind === "ward_coordinator" || kind === "ward_deputy" || kind === "group_ward_rep";
  const cons = kind === "constituency_coordinator" || kind === "constituency_deputy" || kind === "group_constituency_lead";
  const gtype = kind.startsWith("group_") && kind !== "group_unit_leader";
  return (
    <>
      {village && (
        <Field id="village_code" label="Village" error={err("village_code")}>
          <VillagePicker id="village_code" wards={scope.wards} value={(place.village_code as number) || ""} onChange={(v) => setPlace({ ...place, village_code: v })} />
        </Field>
      )}
      {ward && (
        <Field id="ward_code" label="Ward" error={err("ward_code")}>
          <select id="ward_code" className="plat-input" value={place.ward_code ?? ""} onChange={(e) => setPlace({ ...place, ward_code: Number(e.target.value) || "" })} required>
            <option value="">Choose the ward</option>
            {WARDS.filter((w) => scope.wards.includes(w.ward_code)).map((w) => <option key={w.ward_code} value={w.ward_code}>{w.ward}, {w.constituency}</option>)}
          </select>
        </Field>
      )}
      {cons && (
        <Field id="constituency" label="Constituency" error={err("constituency")}>
          <select id="constituency" className="plat-input" value={place.constituency ?? ""} onChange={(e) => setPlace({ ...place, constituency: e.target.value })} required>
            <option value="">Choose the constituency</option>
            {scope.constituencies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      )}
      {gtype && (
        <Field id="group_type" label="Group type" error={err("group_type")}>
          <select id="group_type" className="plat-input" value={place.group_type ?? ""} onChange={(e) => setPlace({ ...place, group_type: e.target.value })} required>
            <option value="">Choose the group type</option>
            {GROUP_TYPES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>
        </Field>
      )}
      {kind === "group_unit_leader" && (
        <Field id="group_id" label="Local unit" error={err("group_id")}>
          <select id="group_id" className="plat-input" value={place.group_id ?? ""} onChange={(e) => setPlace({ ...place, group_id: e.target.value })} required>
            <option value="">Choose the stage, congregation, chama or association</option>
            {scope.groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </Field>
      )}
    </>
  );
}

const roleInput = (kind: RoleKind, p: Record<string, string | number | "">) => ({
  kind,
  constituency: (p.constituency as string) || null,
  ward_code: (p.ward_code as number) || null,
  village_code: (p.village_code as number) || null,
  group_type: ((p.group_type as string) || null) as GroupTypeId | null,
  group_id: (p.group_id as string) || null,
});

/* ------------------------------------------------------------------ registering a campaigner */

export function RegisterForm({ scope }: { scope: Scope }) {
  const [kind, setKind] = useState<RoleKind>(scope.kinds.includes("village_campaigner") ? "village_campaigner" : scope.kinds[0]);
  const [place, setPlace] = useState<Record<string, string | number | "">>({});
  const [f, setF] = useState({ name: "", phone: "", email: "", woman: false, youth: false, consent: false, channel: "in_person" as ConsentChannel, declared: false, officer: false, funds: "none" as PublicFundsRole });
  const { pending, result, run, err } = useAct();
  if (!scope.kinds.length) return null;
  return (
    <form
      className="nw-form"
      onSubmit={(e) => {
        e.preventDefault();
        run(
          () => A.registerPerson({
            name: f.name, phone: f.phone, email: f.email || null, woman: f.woman || null, youth: f.youth || null,
            consent_confirmed: f.consent, consent_channel: f.channel,
            declaration_not_public_officer: f.declared, serving_county_officer: f.officer, public_funds_role: f.funds,
            role: roleInput(kind, place),
          }),
          () => { setF({ ...f, name: "", phone: "", email: "", woman: false, youth: false, consent: false, declared: false, officer: false, funds: "none" }); setPlace({}); },
        );
      }}
    >
      <fieldset>
        <legend>The seat</legend>
        <Field id="kind" label="Role" error={err("role")}>
          <select id="kind" className="plat-input" value={kind} onChange={(e) => { setKind(e.target.value as RoleKind); setPlace({}); }}>
            {scope.kinds.map((k) => <option key={k} value={k}>{ROLE_LABEL[k]}</option>)}
          </select>
        </Field>
        <RolePlace scope={scope} kind={kind} place={place} setPlace={setPlace} err={err} />
      </fieldset>
      <fieldset>
        <legend>The person</legend>
        <div className="row">
          <Field id="name" label="Name" error={err("name")}><input id="name" className="plat-input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required autoComplete="off" /></Field>
          <Field id="phone" label="Mobile number" error={err("phone")}><input id="phone" className="plat-input" type="tel" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} required autoComplete="off" /></Field>
        </div>
        <Field id="email" label="Email (optional)" error={err("email")}><input id="email" className="plat-input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="off" /></Field>
        <label className="nw-check"><input type="checkbox" checked={f.woman} onChange={(e) => setF({ ...f, woman: e.target.checked })} /> Woman (optional, self-declared, for the seat target only)</label>
        <label className="nw-check"><input type="checkbox" checked={f.youth} onChange={(e) => setF({ ...f, youth: e.target.checked })} /> Young person, 18 to 35 (optional, self-declared)</label>
        <p className="plat-hint">Never ask for an ID number, a voter card number, or how the person intends to vote.</p>
      </fieldset>
      <fieldset>
        <legend>Consent</legend>
        <p className="text-[0.85rem] text-muted">Read this to the person: their name and number are kept by Dr. Makali&rsquo;s campaign to organise them as a volunteer, allocate tasks and receive their reports. Not shared outside the campaign. Deleted after the election unless they agree otherwise. They can correct, withdraw or delete it at any time.</p>
        <label className="nw-check"><input type="checkbox" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} /> The person agreed, and I am recording who collected it, when, the purpose and the channel.</label>
        {err("consent") && <p className="plat-error" role="alert">{err("consent")}</p>}
        <Field id="channel" label="How they agreed" error={err("consent_channel")}>
          <select id="channel" className="plat-input" value={f.channel} onChange={(e) => setF({ ...f, channel: e.target.value as ConsentChannel })}>
            <option value="in_person">In person</option><option value="phone_call">Phone call</option><option value="whatsapp">WhatsApp</option><option value="ussd">USSD</option><option value="web_form">Web form</option>
          </select>
        </Field>
      </fieldset>
      <fieldset>
        <legend>Declaration</legend>
        <label className="nw-check"><input type="checkbox" checked={f.officer} onChange={(e) => setF({ ...f, officer: e.target.checked })} /> They currently serve as a Village, Ward or Sub-County Administrator, or another county public officer.</label>
        <p className="plat-hint">{COUNTY_OFFICERS_BARRED}</p>
        <label className="nw-check"><input type="checkbox" checked={f.declared} onChange={(e) => setF({ ...f, declared: e.target.checked })} /> They declare: &ldquo;{PUBLIC_OFFICER_DECLARATION}&rdquo;</label>
        <Field id="funds" label="Are they a teacher, chief, community health worker, or otherwise paid from public funds?">
          <select id="funds" className="plat-input" value={f.funds} onChange={(e) => setF({ ...f, funds: e.target.value as PublicFundsRole })}>
            {PUBLIC_FUNDS_ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </Field>
        {f.funds !== "none" && <p className="plat-hint">Campaign Command decides. The seat is held, not counted, until it does.</p>}
        {err("declaration") && <p className="plat-error" role="alert">{err("declaration")}</p>}
      </fieldset>
      <Msg result={result} />
      <Submit pending={pending}>Register</Submit>
    </form>
  );
}

/* ------------------------------------------------------------------ actions on a person */

export function PersonActions({ personId, self, command, roles, scope }: { personId: string; self: boolean; command: boolean; roles: { id: string; kind: RoleKind; active: boolean; is_primary: boolean; label: string; manage: boolean }[]; scope: Scope }) {
  const { pending, result, run } = useAct();
  const [adding, setAdding] = useState(false);
  const [kind, setKind] = useState<RoleKind | "">("");
  const [place, setPlace] = useState<Record<string, string | number | "">>({});
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <div className="grid gap-2">
      <ul className="grid gap-1">
        {roles.filter((r) => r.active).map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-2 text-[0.85rem]">
            <span>{r.label}{r.is_primary ? " · primary reporting line" : ""}</span>
            {!r.is_primary && (r.manage || self) && <button type="button" className="plat-btn plat-btn-sm" disabled={pending} onClick={() => run(() => A.setPrimary(r.id))}>Make primary</button>}
            {r.manage && <button type="button" className="plat-btn plat-btn-sm" disabled={pending} onClick={() => confirm("End this role? The seat will show as vacant.") && run(() => A.endRole(r.id))}>End role</button>}
          </li>
        ))}
      </ul>
      <div className="nw-actions">
        {scope.kinds.length > 0 && <button type="button" className="plat-btn plat-btn-sm" onClick={() => setAdding(!adding)}>Add a role</button>}
        <button type="button" className="plat-btn plat-btn-sm" onClick={() => setEditing(!editing)}>Correct</button>
        <button type="button" className="plat-btn plat-btn-sm" disabled={pending} onClick={() => confirm("Record that this person withdrew consent? Their seats end and their details are erased now.") && run(() => A.withdrawPerson(personId))}>Consent withdrawn</button>
        {(command || self) && <button type="button" className="plat-btn plat-btn-sm" disabled={pending} onClick={() => confirm("Delete this record permanently?") && run(() => A.deletePerson(personId))}>Delete</button>}
      </div>
      {adding && (
        <form className="nw-form" onSubmit={(e) => { e.preventDefault(); if (kind) run(() => A.addRole(personId, roleInput(kind, place)), () => setAdding(false)); }}>
          <select aria-label="Role" className="plat-input" value={kind} onChange={(e) => { setKind(e.target.value as RoleKind); setPlace({}); }} required>
            <option value="">Choose the role</option>
            {scope.kinds.map((k) => <option key={k} value={k}>{ROLE_LABEL[k]}</option>)}
          </select>
          {kind && <RolePlace scope={scope} kind={kind} place={place} setPlace={setPlace} err={() => undefined} />}
          <Submit pending={pending}>Add role</Submit>
        </form>
      )}
      {editing && (
        <form className="nw-form" onSubmit={(e) => { e.preventDefault(); run(() => A.correctPerson(personId, { ...(name ? { name } : {}), ...(phone ? { phone } : {}) }), () => setEditing(false)); }}>
          <input aria-label="Corrected name" className="plat-input" placeholder="Corrected name" value={name} onChange={(e) => setName(e.target.value)} />
          <input aria-label="Corrected mobile number" className="plat-input" type="tel" placeholder="Corrected mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Submit pending={pending}>Save correction</Submit>
        </form>
      )}
      <Msg result={result} />
    </div>
  );
}

export function EligibilityButtons({ personId }: { personId: string }) {
  const { pending, result, run } = useAct();
  return (
    <div className="nw-actions">
      <button type="button" className="plat-btn plat-btn-sm plat-btn-solid" disabled={pending} onClick={() => run(() => A.decideEligibility(personId, "cleared"))}>Clear: may hold a seat</button>
      <button type="button" className="plat-btn plat-btn-sm" disabled={pending} onClick={() => confirm("Bar this person? Their record is deleted.") && run(() => A.decideEligibility(personId, "barred"))}>Bar and delete</button>
      <Msg result={result} />
    </div>
  );
}

/* ------------------------------------------------------------------ tasks */

export function TaskForm({ templates, objectives }: { templates: { id: string; name: string; title: string; instructions: string; evidence: string; objective: string }[]; objectives: { n: string; title: string }[] }) {
  const { pending, result, run, err } = useAct();
  const [t, setT] = useState({ template: "", title: "", instructions: "", evidence: "", objective: "", due: "" });
  const [target, setTarget] = useState<Target>({});
  return (
    <form className="nw-form" onSubmit={(e) => { e.preventDefault(); run(() => A.createTask({ ...t, template: t.template || null, target })); }}>
      <Field id="template" label="Start from a template">
        <select id="template" className="plat-input" value={t.template} onChange={(e) => { const x = templates.find((y) => y.id === e.target.value); setT(x ? { ...t, template: x.id, title: x.title, instructions: x.instructions, evidence: x.evidence, objective: x.objective } : { ...t, template: "" }); }}>
          <option value="">No template</option>
          {templates.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </Field>
      <Field id="title" label="Title" error={err("title")}><input id="title" className="plat-input" value={t.title} onChange={(e) => setT({ ...t, title: e.target.value })} required /></Field>
      <Field id="instructions" label="Instructions" error={err("instructions")} hint={PROHIBITED_SUMMARY}><textarea id="instructions" className="plat-input min-h-28" value={t.instructions} onChange={(e) => setT({ ...t, instructions: e.target.value })} required /></Field>
      <div className="row">
        <Field id="due" label="Due" error={err("due")}><input id="due" type="date" className="plat-input" value={t.due} onChange={(e) => setT({ ...t, due: e.target.value })} required /></Field>
        <Field id="objective" label="Objective it serves" error={err("objective")}>
          <select id="objective" className="plat-input" value={t.objective} onChange={(e) => setT({ ...t, objective: e.target.value })} required>
            <option value="">Choose</option>
            {objectives.map((o) => <option key={o.n} value={o.n}>{o.title}</option>)}
          </select>
        </Field>
      </div>
      <Field id="evidence" label="Evidence required" error={err("evidence")}><input id="evidence" className="plat-input" value={t.evidence} onChange={(e) => setT({ ...t, evidence: e.target.value })} required /></Field>
      <fieldset>
        <legend>Who it goes to</legend>
        <div className="row">
          <select aria-label="Level" className="plat-input" value={target.level ?? ""} onChange={(e) => setTarget({ ...target, level: (e.target.value || undefined) as Target["level"] })}>
            <option value="">Any level</option><option value="constituency">Constituency seats</option><option value="ward">Ward seats</option><option value="village">Village seats</option><option value="group">Special groups</option>
          </select>
          <select aria-label="Role" className="plat-input" value={target.role ?? ""} onChange={(e) => setTarget({ ...target, role: (e.target.value || undefined) as RoleKind | undefined })}>
            <option value="">Any role</option>
            {(Object.keys(ROLE_LABEL) as RoleKind[]).filter((k) => k !== "candidate" && k !== "command_member").map((k) => <option key={k} value={k}>{ROLE_LABEL[k]}</option>)}
          </select>
          <select aria-label="Group type" className="plat-input" value={target.group_type ?? ""} onChange={(e) => setTarget({ ...target, group_type: (e.target.value || undefined) as GroupTypeId | undefined })}>
            <option value="">Any group type</option>
            {GROUP_TYPES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>
          <select aria-label="Constituency" className="plat-input" value={target.constituency ?? ""} onChange={(e) => setTarget({ ...target, constituency: e.target.value || undefined, ward_code: undefined, village_code: undefined })}>
            <option value="">All constituencies</option>
            {CONSTITUENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select aria-label="Ward" className="plat-input" value={target.ward_code ?? ""} onChange={(e) => setTarget({ ...target, ward_code: Number(e.target.value) || undefined, village_code: undefined })}>
            <option value="">All wards</option>
            {WARDS.filter((w) => !target.constituency || w.constituency === target.constituency).map((w) => <option key={w.ward_code} value={w.ward_code}>{w.ward}</option>)}
          </select>
          <select aria-label="Village" className="plat-input" value={target.village_code ?? ""} onChange={(e) => setTarget({ ...target, village_code: Number(e.target.value) || undefined })}>
            <option value="">All villages</option>
            {VILLAGES.filter((v) => (!target.ward_code || v.ward_code === target.ward_code) && (!target.constituency || v.constituency === target.constituency)).map((v) => <option key={v.village_code} value={v.village_code}>{v.village_name} ({v.village_code})</option>)}
          </select>
        </div>
        {err("target") && <p className="plat-error" role="alert">{err("target")}</p>}
      </fieldset>
      <Msg result={result} />
      <Submit pending={pending}>Issue the task</Submit>
    </form>
  );
}

export function AssignmentControls({ id, state }: { id: string; state: TaskState }) {
  const { pending, result, run } = useAct();
  const [note, setNote] = useState("");
  return (
    <div className="grid gap-2">
      <div className="nw-actions" role="group" aria-label="Update this task">
        {TASK_STATES.filter((s) => s !== "Assigned").map((s) => (
          <button key={s} type="button" className={`plat-btn plat-btn-sm ${s === state ? "plat-btn-solid" : ""}`} aria-pressed={s === state} disabled={pending} onClick={() => run(() => A.updateAssignment(id, s, note || undefined))}>{s}</button>
        ))}
      </div>
      <input aria-label="Note (optional)" className="plat-input" placeholder="Note (optional), e.g. why it is blocked" value={note} onChange={(e) => setNote(e.target.value)} />
      <Msg result={result} />
    </div>
  );
}

export function ClashForm({ ids }: { ids: string[] }) {
  const { pending, result, run } = useAct();
  const [d, setD] = useState("");
  return (
    <form className="nw-form" onSubmit={(e) => { e.preventDefault(); run(() => A.decideClash(ids, d)); }}>
      <input aria-label="Decision" className="plat-input" placeholder="Which task stands, and when the other is done" value={d} onChange={(e) => setD(e.target.value)} required />
      <Submit pending={pending}>Resolve</Submit>
      <Msg result={result} />
    </form>
  );
}

export function TemplateForm({ t, objectives }: { t: { id: string; name: string; title: string; instructions: string; evidence: string; objective: string }; objectives: { n: string; title: string }[] }) {
  const { pending, result, run, err } = useAct();
  const [x, setX] = useState(t);
  return (
    <form className="nw-form" onSubmit={(e) => { e.preventDefault(); run(() => A.saveTemplate(x)); }}>
      <input aria-label="Template name" className="plat-input" value={x.name} onChange={(e) => setX({ ...x, name: e.target.value })} />
      <input aria-label="Task title" className="plat-input" value={x.title} onChange={(e) => setX({ ...x, title: e.target.value })} />
      <textarea aria-label="Instructions" className="plat-input min-h-24" value={x.instructions} onChange={(e) => setX({ ...x, instructions: e.target.value })} />
      {err("instructions") && <p className="plat-error">{err("instructions")}</p>}
      <input aria-label="Evidence required" className="plat-input" value={x.evidence} onChange={(e) => setX({ ...x, evidence: e.target.value })} />
      <select aria-label="Objective" className="plat-input" value={x.objective} onChange={(e) => setX({ ...x, objective: e.target.value })}>
        {objectives.map((o) => <option key={o.n} value={o.n}>{o.title}</option>)}
      </select>
      <Submit pending={pending}>Save template</Submit>
      <Msg result={result} />
    </form>
  );
}

/* ------------------------------------------------------------------ field reports */

export function ReportForm({ roles, tasks, villages }: { roles: { id: string; label: string }[]; tasks: { id: string; title: string }[]; villages: { code: number; name: string }[] }) {
  const { pending, result, run, err } = useAct();
  const [follow, setFollow] = useState(false);
  return (
    <form
      className="nw-form"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        run(() => A.submitReport(data), () => form.reset());
      }}
    >
      {roles.length > 1 && (
        <Field id="role_id" label="Reporting as">
          <select id="role_id" name="role_id" className="plat-input">{roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select>
        </Field>
      )}
      {tasks.length > 0 && (
        <Field id="task_id" label="For a task (optional)" error={err("task_id")}>
          <select id="task_id" name="task_id" className="plat-input"><option value="">Not for a task</option>{tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select>
        </Field>
      )}
      <Field id="activity" label="What did you do?" error={err("activity")}><textarea id="activity" name="activity" className="plat-input min-h-24" required /></Field>
      {villages.length > 0 && (
        <Field id="village_code" label="Where" error={err("village_code") ?? err("ward_code")}>
          <select id="village_code" name="village_code" className="plat-input"><option value="">My ward</option>{villages.map((v) => <option key={v.code} value={v.code}>{v.name}</option>)}</select>
        </Field>
      )}
      <Field id="people_reached" label="People reached" error={err("people_reached")}><input id="people_reached" name="people_reached" className="plat-input" type="number" inputMode="numeric" min={0} step={1} required /></Field>
      <Field id="issue_category" label="Main issue raised" error={err("issue_category")}>
        <select id="issue_category" name="issue_category" className="plat-input"><option value="">None</option>{ISSUE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
      </Field>
      <Field id="issue_text" label="The issue, in their words (optional)"><textarea id="issue_text" name="issue_text" className="plat-input min-h-20" /></Field>
      <label className="nw-check"><input type="checkbox" name="follow_up" value="yes" checked={follow} onChange={(e) => setFollow(e.target.checked)} /> Follow-up needed</label>
      {follow && <Field id="follow_up_note" label="What follow-up?"><input id="follow_up_note" name="follow_up_note" className="plat-input" /></Field>}
      <Field id="photo" label="Photo (optional)" error={err("photo")} hint="Of the place or the activity. Avoid faces of people who have not agreed.">
        <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="plat-input" />
      </Field>
      <Msg result={result} />
      <Submit pending={pending}>Send to my coordinator</Submit>
    </form>
  );
}

/* ------------------------------------------------------------------ flags */

export function FlagForm({ defaultKind = "misconduct" }: { defaultKind?: "safety" | "misconduct" | "unresponsive" }) {
  const { pending, result, run, err } = useAct();
  const [kind, setKind] = useState(defaultKind);
  const [details, setDetails] = useState("");
  return (
    <form className="nw-form" onSubmit={(e) => { e.preventDefault(); run(() => A.raiseFlag({ kind, details }), () => setDetails("")); }}>
      <Field id="flag-kind" label="What is it?" error={err("kind")}>
        <select id="flag-kind" className="plat-input" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option value="misconduct">Misconduct: money or goods to voters, collecting cards or IDs, intimidation, ethnic messaging</option>
          <option value="safety">A threat to someone&rsquo;s safety</option>
          <option value="unresponsive">A coordinator who is not responding</option>
        </select>
      </Field>
      <Field id="flag-details" label="What happened, where and when" error={err("details")}><textarea id="flag-details" className="plat-input min-h-28" value={details} onChange={(e) => setDetails(e.target.value)} required /></Field>
      <Msg result={result} />
      <Submit pending={pending}>Send straight to Campaign Command</Submit>
    </form>
  );
}

export function FlagManage({ id, owner, state, members }: { id: string; owner: string | null; state: "open" | "closed"; members: { id: string; name: string }[] }) {
  const { pending, result, run } = useAct();
  const [o, setO] = useState(owner ?? "");
  const [res, setRes] = useState("");
  return (
    <div className="grid gap-2">
      <div className="row grid gap-2 sm:grid-cols-2">
        <select aria-label="Owner" className="plat-input" value={o} onChange={(e) => setO(e.target.value)}>
          <option value="">No owner yet</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <button type="button" className="plat-btn plat-btn-sm" disabled={pending} onClick={() => run(() => A.updateFlag(id, { owner_person_id: o || null }))}>Name owner</button>
      </div>
      {state === "open" ? (
        <form className="nw-form" onSubmit={(e) => { e.preventDefault(); run(() => A.updateFlag(id, { owner_person_id: o || null, state: "closed", resolution: res })); }}>
          <input aria-label="Resolution" className="plat-input" placeholder="How it was resolved" value={res} onChange={(e) => setRes(e.target.value)} required />
          <Submit pending={pending}>Close</Submit>
        </form>
      ) : (
        <button type="button" className="plat-btn plat-btn-sm" disabled={pending} onClick={() => run(() => A.updateFlag(id, { state: "open" }))}>Reopen</button>
      )}
      <Msg result={result} />
    </div>
  );
}

/* ------------------------------------------------------------------ messages */

export function BroadcastForm() {
  const { pending, result, run, err } = useAct();
  const [body, setBody] = useState("");
  const [voice, setVoice] = useState<"command" | "candidate">("command");
  const [constituency, setConstituency] = useState("");
  return (
    <form className="nw-form" onSubmit={(e) => { e.preventDefault(); run(() => A.broadcast({ body, voice, audience: constituency ? { constituency } : null }), () => setBody("")); }}>
      <Field id="voice" label="Whose message"><select id="voice" className="plat-input" value={voice} onChange={(e) => setVoice(e.target.value as typeof voice)}><option value="command">Campaign Command</option><option value="candidate">Dr. Makali, in his words</option></select></Field>
      <Field id="aud" label="To"><select id="aud" className="plat-input" value={constituency} onChange={(e) => setConstituency(e.target.value)}><option value="">Every campaigner</option>{CONSTITUENCIES.map((c) => <option key={c} value={c}>Everyone in {c}</option>)}</select></Field>
      <Field id="body" label="Message" error={err("body")} hint="Replies go to each sender's ward coordinator, not to Dr. Makali."><textarea id="body" className="plat-input min-h-28" value={body} onChange={(e) => setBody(e.target.value)} required /></Field>
      <Msg result={result} />
      <Submit pending={pending}>Send</Submit>
    </form>
  );
}

export function ReplyForm({ messageId }: { messageId: string }) {
  const { pending, result, run } = useAct();
  const [body, setBody] = useState("");
  return (
    <form className="nw-form" onSubmit={(e) => { e.preventDefault(); run(() => A.reply(messageId, body), () => setBody("")); }}>
      <input aria-label="Reply" className="plat-input" placeholder="Reply to your coordinator" value={body} onChange={(e) => setBody(e.target.value)} required />
      <Submit pending={pending}>Reply</Submit>
      <Msg result={result} />
    </form>
  );
}

/* ------------------------------------------------------------------ targets, spellings, groups, retention */

export function TargetForm({ wards }: { wards: number[] }) {
  const { pending, result, run, err } = useAct();
  const [unit, setUnit] = useState<"ward" | "village">("village");
  const [code, setCode] = useState<number | "">("");
  const [target, setTarget] = useState(3);
  return (
    <form className="nw-form" onSubmit={(e) => { e.preventDefault(); if (code) run(() => A.setTarget(unit, code, target)); }}>
      <select aria-label="Unit" className="plat-input" value={unit} onChange={(e) => { setUnit(e.target.value as "ward" | "village"); setCode(""); }}><option value="village">One village</option><option value="ward">Every village in a ward</option></select>
      {unit === "ward" ? (
        <select aria-label="Ward" className="plat-input" value={code} onChange={(e) => setCode(Number(e.target.value) || "")} required>
          <option value="">Choose the ward</option>{WARDS.filter((w) => wards.includes(w.ward_code)).map((w) => <option key={w.ward_code} value={w.ward_code}>{w.ward}</option>)}
        </select>
      ) : <VillagePicker id="target-village" wards={wards} value={code} onChange={setCode} />}
      <Field id="target" label="Campaigners per village" error={err("target")}><input id="target" className="plat-input" type="number" min={2} max={50} value={target} onChange={(e) => setTarget(Number(e.target.value))} /></Field>
      <Submit pending={pending}>Set target</Submit>
      <Msg result={result} />
    </form>
  );
}

export function AliasForm({ wards }: { wards: number[] }) {
  const { pending, result, run, err } = useAct();
  const [code, setCode] = useState<number | "">("");
  const [alias, setAlias] = useState("");
  return (
    <form className="nw-form" onSubmit={(e) => { e.preventDefault(); if (code) run(() => A.addAlias(code, alias), () => setAlias("")); }}>
      <VillagePicker id="alias-village" wards={wards} value={code} onChange={setCode} />
      <Field id="alias" label="Local spelling" error={err("alias")} hint="It helps people find the village. The official name and code never change."><input id="alias" className="plat-input" value={alias} onChange={(e) => setAlias(e.target.value)} required /></Field>
      <Submit pending={pending}>Add spelling</Submit>
      <Msg result={result} />
    </form>
  );
}

export function GroupForm({ wards }: { wards: number[] }) {
  const { pending, result, run, err } = useAct();
  const [g, setG] = useState({ type: "", name: "", level: "unit", ward_code: "" as number | "", village_code: "" as number | "", constituency: "", approx_members: "", activation: "identified", consent_status: "not_asked", leader_name: "", leader_phone: "", endorsement_confirmed_in_writing: false, endorsement_reference: "" });
  return (
    <form className="nw-form" onSubmit={(e) => { e.preventDefault(); run(() => A.saveGroup({ ...g, ward_code: g.ward_code || null, village_code: g.village_code || null, constituency: g.constituency || null, approx_members: g.approx_members === "" ? null : Number(g.approx_members) })); }}>
      <div className="row">
        <Field id="g-type" label="Type" error={err("type")}><select id="g-type" className="plat-input" value={g.type} onChange={(e) => setG({ ...g, type: e.target.value })} required><option value="">Choose</option>{GROUP_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select></Field>
        <Field id="g-level" label="Level" error={err("level")}><select id="g-level" className="plat-input" value={g.level} onChange={(e) => setG({ ...g, level: e.target.value })}><option value="unit">Local unit</option><option value="ward">Ward</option><option value="constituency">Constituency</option><option value="county">County</option></select></Field>
      </div>
      <Field id="g-name" label="Name" error={err("name")}><input id="g-name" className="plat-input" value={g.name} onChange={(e) => setG({ ...g, name: e.target.value })} required /></Field>
      {(g.level === "unit" || g.level === "ward") && (
        <Field id="g-ward" label="Ward" error={err("ward_code")}><select id="g-ward" className="plat-input" value={g.ward_code} onChange={(e) => setG({ ...g, ward_code: Number(e.target.value) || "" })} required><option value="">Choose the ward</option>{WARDS.filter((w) => wards.includes(w.ward_code)).map((w) => <option key={w.ward_code} value={w.ward_code}>{w.ward}</option>)}</select></Field>
      )}
      {g.level === "constituency" && (
        <Field id="g-cons" label="Constituency" error={err("constituency")}><select id="g-cons" className="plat-input" value={g.constituency} onChange={(e) => setG({ ...g, constituency: e.target.value })} required><option value="">Choose</option>{CONSTITUENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
      )}
      <div className="row">
        <Field id="g-members" label="Approximate members" error={err("approx_members")}><input id="g-members" className="plat-input" type="number" min={0} value={g.approx_members} onChange={(e) => setG({ ...g, approx_members: e.target.value })} /></Field>
        <Field id="g-act" label="Activation"><select id="g-act" className="plat-input" value={g.activation} onChange={(e) => setG({ ...g, activation: e.target.value })}><option value="identified">Identified</option><option value="contacted">Contacted</option><option value="active">Active</option><option value="paused">Paused</option></select></Field>
      </div>
      <fieldset>
        <legend>Leader contact (only with their consent)</legend>
        <select aria-label="Consent status" className="plat-input" value={g.consent_status} onChange={(e) => setG({ ...g, consent_status: e.target.value })}><option value="not_asked">Not asked yet</option><option value="given">Consent given</option><option value="refused">Refused</option><option value="withdrawn">Withdrawn</option></select>
        {g.consent_status === "given" && (
          <div className="row">
            <input aria-label="Leader name" className="plat-input" placeholder="Leader name" value={g.leader_name} onChange={(e) => setG({ ...g, leader_name: e.target.value })} />
            <input aria-label="Leader mobile number" className="plat-input" type="tel" placeholder="Leader mobile number" value={g.leader_phone} onChange={(e) => setG({ ...g, leader_phone: e.target.value })} />
          </div>
        )}
        {err("consent_status") && <p className="plat-error">{err("consent_status")}</p>}
        {err("leader_phone") && <p className="plat-error">{err("leader_phone")}</p>}
      </fieldset>
      <fieldset>
        <legend>Institutional endorsement</legend>
        <label className="nw-check"><input type="checkbox" checked={g.endorsement_confirmed_in_writing} onChange={(e) => setG({ ...g, endorsement_confirmed_in_writing: e.target.checked })} /> The institution has endorsed in writing</label>
        {g.endorsement_confirmed_in_writing && <input aria-label="Reference of the written confirmation" className="plat-input" placeholder="Reference of the letter" value={g.endorsement_reference} onChange={(e) => setG({ ...g, endorsement_reference: e.target.value })} />}
        {err("endorsement_reference") && <p className="plat-error">{err("endorsement_reference")}</p>}
        <p className="plat-hint">Faith and community leaders take part as individuals who opt in. Never record an endorsement that is not confirmed in writing.</p>
      </fieldset>
      <Msg result={result} />
      <Submit pending={pending}>Save group</Submit>
    </form>
  );
}

export function RetentionForm({ current }: { current: string }) {
  const { pending, result, run, err } = useAct();
  const [d, setD] = useState(current);
  return (
    <form className="nw-form" onSubmit={(e) => { e.preventDefault(); run(() => A.setRetention(d)); }}>
      <Field id="retention" label="Delete personal data after" error={err("retention_until")}><input id="retention" type="date" className="plat-input" value={d} onChange={(e) => setD(e.target.value)} required /></Field>
      <div className="nw-actions">
        <Submit pending={pending}>Set retention date</Submit>
        <button type="button" className="plat-btn" disabled={pending} onClick={() => confirm("Delete every record whose retention date has passed?") && run(() => A.purgeExpired())}>Run the retention purge now</button>
      </div>
      <Msg result={result} />
    </form>
  );
}
