/**
 * Production store: the platform's existing Supabase Postgres, through the service role, on the
 * server only. Row-level security on every net_* table has no policy at all, so the anon and
 * authenticated keys a browser could hold are refused outright; only this server reaches the rows,
 * and lib/network/service.ts decides what each signed-in person may see.
 */
import { serviceClient } from "../platform/store/supabase";
import type { NetDb, Row, Table, Where } from "./db";

const PAGE = 1000;

function fail(table: Table, error: { message: string } | null): void {
  // The table and the database's message, never the row: a row can hold personal data.
  if (error) throw new Error(`${table}: ${error.message}`);
}

export function supabaseDb(): NetDb {
  const sb = serviceClient();
  const filtered = (table: Table, where: Where = {}) => {
    let q = sb.from(table).select("*");
    for (const [k, v] of Object.entries(where)) q = v === null ? q.is(k, null) : q.eq(k, v);
    return q;
  };
  return {
    async list<T extends Row>(table: Table, where?: Where) {
      const out: T[] = [];
      for (let from = 0; ; from += PAGE) {
        const { data, error } = await filtered(table, where).order("id").range(from, from + PAGE - 1);
        fail(table, error);
        out.push(...((data ?? []) as T[]));
        if (!data || data.length < PAGE) return out;
      }
    },
    async get<T extends Row>(table: Table, id: string) {
      const { data, error } = await sb.from(table).select("*").eq("id", id).limit(1);
      fail(table, error);
      return ((data ?? [])[0] as T | undefined) ?? null;
    },
    async insert<T extends Row>(table: Table, row: T) {
      const { data, error } = await sb.from(table).insert(row as never).select().single();
      fail(table, error);
      return data as T;
    },
    async update<T extends Row>(table: Table, id: string, patch: Partial<T>) {
      const { data, error } = await sb.from(table).update(patch as never).eq("id", id).select().single();
      fail(table, error);
      return data as T;
    },
    async remove(table: Table, id: string) {
      const { error } = await sb.from(table).delete().eq("id", id);
      fail(table, error);
    },
  };
}
