/**
 * Production store: Supabase Postgres (supabase/migrations/), read through the service role on the
 * server. Read-only: the site has no sign-in and writes nothing.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AuditEntry, Store, StoredRecord } from "./types";

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

function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export function supabaseStore(): Store {
  const svc = serviceClient();
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
    async audit(limit = 200) {
      return (must(await svc.from("audit_log").select("*").order("at", { ascending: false }).limit(limit)) as Row[]).map(toAudit);
    },
  };
}
