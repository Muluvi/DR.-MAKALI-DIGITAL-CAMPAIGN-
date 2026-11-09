/**
 * The Campaigner Network's storage, as the smallest interface the service needs: list with equality
 * filters, get, insert, update, remove. Three implementations share it, so the access rules are
 * written once and tested once:
 *
 *   memoryDb()      tests
 *   localDb()       development (PLATFORM_STORE=local), lib/network/db-local.ts; refused on Vercel
 *   supabaseDb()    production, lib/network/db-supabase.ts, server-side service role only
 *
 * The database itself refuses every request that is not the server's service role
 * (supabase/migrations/20261109000000_network.sql): no browser ever talks to these tables.
 */
export const TABLES = [
  "net_people",
  "net_roles",
  "net_groups",
  "net_tasks",
  "net_assignments",
  "net_reports",
  "net_flags",
  "net_messages",
  "net_deliveries",
  "net_audit",
  "net_aliases",
  "net_targets",
  "net_settings",
  "net_templates",
] as const;
export type Table = (typeof TABLES)[number];

export type Where = Record<string, string | number | boolean | null>;
export type Row = { id: string };

export interface NetDb {
  list<T extends Row>(table: Table, where?: Where): Promise<T[]>;
  get<T extends Row>(table: Table, id: string): Promise<T | null>;
  insert<T extends Row>(table: Table, row: T): Promise<T>;
  update<T extends Row>(table: Table, id: string, patch: Partial<T>): Promise<T>;
  remove(table: Table, id: string): Promise<void>;
}

const matches = (row: Row, where: Where = {}) => Object.entries(where).every(([k, v]) => ((row as unknown as Record<string, unknown>)[k] ?? null) === v);
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

/** An in-memory store over a plain object, so the local file store can share it. */
export function objectDb(state: Partial<Record<Table, Row[]>>, onChange: () => void = () => {}): NetDb {
  const rows = (t: Table) => (state[t] ??= []);
  return {
    async list(table, where) {
      return clone(rows(table).filter((r) => matches(r, where))) as never;
    },
    async get(table, id) {
      const r = rows(table).find((x) => x.id === id);
      return r ? (clone(r) as never) : null;
    },
    async insert(table, row) {
      if (rows(table).some((x) => x.id === row.id)) throw new Error(`${table}: duplicate id`);
      rows(table).push(clone(row));
      onChange();
      return clone(row);
    },
    async update(table, id, patch) {
      const r = rows(table).find((x) => x.id === id);
      if (!r) throw new Error(`${table}: no row ${id}`);
      Object.assign(r, clone(patch));
      onChange();
      return clone(r) as never;
    },
    async remove(table, id) {
      const list = rows(table);
      const i = list.findIndex((x) => x.id === id);
      if (i >= 0) list.splice(i, 1);
      onChange();
    },
  };
}

export const memoryDb = (): NetDb => objectDb({});
