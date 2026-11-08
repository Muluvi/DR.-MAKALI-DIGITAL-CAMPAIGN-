/**
 * Development store: one JSON file, the same semantics as the Supabase store. It exists so every
 * function can be exercised without a live database. platformMode() refuses it on Vercel.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Actor, AuditEntry, Member, Store, StoredRecord } from "./types";

interface Db { records: StoredRecord[]; audit: AuditEntry[]; members: Member[] }

const FILE = path.join(process.cwd(), ".platform-local", "store.json");

function load(): Db {
  if (!fs.existsSync(FILE)) return { records: [], audit: [], members: [] };
  return JSON.parse(fs.readFileSync(FILE, "utf8")) as Db;
}
function save(db: Db) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}
const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();

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
  async create(actor: Actor, collection, data, title) {
    const db = load();
    const r: StoredRecord = { id: id(), collection, data, archived: false, createdAt: now(), createdBy: actor.name, updatedAt: now(), updatedBy: actor.name };
    db.records.push(r);
    db.audit.push({ id: id(), at: r.createdAt, actor: actor.name, layer: "ops", action: "create", collection, recordId: r.id, title, before: null, after: data, ref: null, revertOf: null });
    save(db);
    return r;
  },
  async update(actor, collection, rid, data, title, opts = {}) {
    const db = load();
    const r = db.records.find((x) => x.collection === collection && x.id === rid);
    if (!r) throw new Error("That record no longer exists.");
    const before = { ...r.data, ...(r.archived ? { _archived: true } : {}) };
    r.data = data;
    r.archived = opts.archived ?? false;
    r.updatedAt = now();
    r.updatedBy = actor.name;
    db.audit.push({
      id: id(), at: r.updatedAt, actor: actor.name, layer: "ops", action: opts.revertOf ? "revert" : "update", collection, recordId: rid, title,
      before, after: { ...data, ...(r.archived ? { _archived: true } : {}) }, ref: null, revertOf: opts.revertOf ?? null,
    });
    save(db);
    return r;
  },
  async audit(limit = 200) {
    return load().audit.slice().reverse().slice(0, limit);
  },
  async auditEntry(aid) {
    return load().audit.find((a) => a.id === aid) ?? null;
  },
  async logPack(actor, entry) {
    const db = load();
    const a: AuditEntry = { ...entry, id: id(), at: now(), actor: actor.name, layer: "pack" };
    db.audit.push(a);
    save(db);
    return a;
  },
  async members() {
    return load().members;
  },
  async member(email) {
    return load().members.find((m) => m.email === email.toLowerCase()) ?? null;
  },
  async upsertMember(by, m) {
    const db = load();
    const email = m.email.toLowerCase();
    const existing = db.members.find((x) => x.email === email);
    if (existing) Object.assign(existing, { name: m.name, role: m.role, active: m.active });
    else db.members.push({ ...m, email, addedAt: now(), addedBy: by.name });
    save(db);
    return db.members.find((x) => x.email === email)!;
  },
};
