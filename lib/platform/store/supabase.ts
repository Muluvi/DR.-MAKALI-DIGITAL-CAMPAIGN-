/**
 * Production store: Supabase Postgres (supabase/migrations/). Reads and the audit log go through
 * the service role on the server; record writes go through the signed-in user's own session, so
 * the database's row-level security refuses them unless the user is an active team member.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Actor, AuditEntry, Member, Store, StoredRecord } from "./types";

type Row = Record<string, unknown>;

export function serviceClient(): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const toRecord = (r: Row): StoredRecord => ({
  id: String(r.id), collection: String(r.collection), data: (r.data ?? {}) as Record<string, unknown>, archived: Boolean(r.archived),
  createdAt: String(r.created_at), createdBy: String(r.created_by), updatedAt: String(r.updated_at), updatedBy: String(r.updated_by),
});
const toAudit = (r: Row): AuditEntry => ({
  id: String(r.id), at: String(r.at), actor: String(r.actor), layer: r.layer as AuditEntry["layer"], action: r.action as AuditEntry["action"],
  collection: String(r.collection), recordId: String(r.record_id), title: String(r.title),
  before: (r.before ?? null) as AuditEntry["before"], after: (r.after ?? null) as AuditEntry["after"],
  ref: (r.ref ?? null) as AuditEntry["ref"], revertOf: (r.revert_of ?? null) as string | null,
});
const toMember = (r: Row): Member => ({
  email: String(r.email), name: String(r.name), role: r.role as Member["role"], active: Boolean(r.active), addedAt: String(r.added_at), addedBy: String(r.added_by),
});

function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/** `user` is the signed-in user's client (null when only reading). */
export function supabaseStore(user: SupabaseClient | null): Store {
  const svc = serviceClient();
  const writer = () => {
    if (!user) throw new Error("Sign in to edit.");
    return user;
  };
  const audit = async (actor: Actor, e: Omit<AuditEntry, "id" | "at" | "actor">) =>
    toAudit(
      must(
        await svc
          .from("audit_log")
          .insert({ actor: actor.name, actor_email: actor.email, layer: e.layer, action: e.action, collection: e.collection, record_id: e.recordId, title: e.title, before: e.before, after: e.after, ref: e.ref, revert_of: e.revertOf })
          .select()
          .single(),
      ) as Row,
    );

  return {
    async list(collection) {
      return (must(await svc.from("records").select("*").eq("collection", collection).eq("archived", false).order("updated_at", { ascending: false })) as Row[]).map(toRecord);
    },
    async listAll() {
      return (must(await svc.from("records").select("*").eq("archived", false)) as Row[]).map(toRecord);
    },
    async get(collection, id) {
      const rows = must(await svc.from("records").select("*").eq("collection", collection).eq("id", id).limit(1)) as Row[];
      return rows[0] ? toRecord(rows[0]) : null;
    },
    async create(actor, collection, data, title) {
      const r = toRecord(must(await writer().from("records").insert({ collection, data, created_by: actor.name, updated_by: actor.name }).select().single()) as Row);
      await audit(actor, { layer: "ops", action: "create", collection, recordId: r.id, title, before: null, after: data, ref: null, revertOf: null });
      return r;
    },
    async update(actor, collection, id, data, title, opts = {}) {
      const prev = await this.get(collection, id);
      if (!prev) throw new Error("That record no longer exists.");
      const archived = opts.archived ?? false;
      const r = toRecord(
        must(await writer().from("records").update({ data, archived, updated_by: actor.name, updated_at: new Date().toISOString() }).eq("id", id).select().single()) as Row,
      );
      await audit(actor, {
        layer: "ops", action: opts.revertOf ? "revert" : "update", collection, recordId: id, title,
        before: { ...prev.data, ...(prev.archived ? { _archived: true } : {}) }, after: { ...data, ...(archived ? { _archived: true } : {}) },
        ref: null, revertOf: opts.revertOf ?? null,
      });
      return r;
    },
    async audit(limit = 200) {
      return (must(await svc.from("audit_log").select("*").order("at", { ascending: false }).limit(limit)) as Row[]).map(toAudit);
    },
    async auditEntry(id) {
      const rows = must(await svc.from("audit_log").select("*").eq("id", id).limit(1)) as Row[];
      return rows[0] ? toAudit(rows[0]) : null;
    },
    async logPack(actor, entry) {
      return audit(actor, { ...entry, layer: "pack" });
    },
    async members() {
      return (must(await svc.from("team_members").select("*").order("name")) as Row[]).map(toMember);
    },
    async member(email) {
      const rows = must(await svc.from("team_members").select("*").eq("email", email.toLowerCase()).limit(1)) as Row[];
      return rows[0] ? toMember(rows[0]) : null;
    },
    async upsertMember(by, m) {
      const email = m.email.toLowerCase();
      const existing = await this.member(email);
      const row = existing
        ? must(await svc.from("team_members").update({ name: m.name, role: m.role, active: m.active }).eq("email", email).select().single())
        : must(await svc.from("team_members").insert({ email, name: m.name, role: m.role, active: m.active, added_by: by.name }).select().single());
      return toMember(row as unknown as Row);
    },
  };
}
