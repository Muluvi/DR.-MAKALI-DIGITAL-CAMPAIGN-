/**
 * Development store: one JSON file, read the same way as the Supabase store, so the read-only
 * pages can be exercised without a live database. platformMode() refuses it on Vercel.
 */
import fs from "node:fs";
import path from "node:path";
import type { AuditEntry, Store, StoredRecord } from "./types";

interface Db { records: StoredRecord[]; audit: AuditEntry[] }

const FILE = path.join(process.cwd(), ".platform-local", "store.json");

function load(): Db {
  if (!fs.existsSync(FILE)) return { records: [], audit: [] };
  return JSON.parse(fs.readFileSync(FILE, "utf8")) as Db;
}

export const localStore: Store = {
  async list(collection) {
    return load().records.filter((r) => r.collection === collection && !r.archived).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  async listAll() {
    return load().records.filter((r) => !r.archived);
  },
  async get(collection, rid) {
    return load().records.find((r) => r.collection === collection && r.id === rid) ?? null;
  },
  async audit(limit = 200) {
    return load().audit.slice().reverse().slice(0, limit);
  },
};
