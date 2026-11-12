/**
 * Live store on Vercel Blob: the workspace's records and change history, as private JSON objects
 * in a Blob store connected to the Vercel project (its BLOB_READ_WRITE_TOKEN is set by Vercel).
 *
 *   records/<collection>/<id>.json   one record, overwritten when it changes
 *   audit/<id>.json                  one change-history entry, written once and never changed
 *
 * The rules the database enforced hold here by construction: nothing is ever deleted (this module
 * has no delete), a change-history entry is created with overwriting refused, and only the site's
 * server holds the token, so no browser reads or writes the store directly. Every read bypasses the
 * CDN cache, so a save shows on the next page load.
 *
 * Change-history ids start with an inverted timestamp, so the store's name order is newest first.
 * Objects read are kept in memory by version tag, so a page view re-reads only what changed.
 */
import crypto from "node:crypto";
import { get, list, put } from "@vercel/blob";
import type { Actor, AuditEntry, Store, StoredRecord } from "./types";

const ACCESS = "private" as const;
const ID = /^[0-9a-f-]{36}$/;
const AUDIT_ID = /^\d{13}-[0-9a-f-]{36}$/;
const SLUG = /^[a-z0-9-]{1,40}$/;

async function readJson<T>(pathname: string): Promise<T | null> {
  const res = await get(pathname, { access: ACCESS, useCache: false });
  if (!res?.stream) return null;
  return (await new Response(res.stream).json()) as T;
}

async function writeJson(pathname: string, value: unknown, overwrite: boolean): Promise<void> {
  await put(pathname, JSON.stringify(value), { access: ACCESS, contentType: "application/json", addRandomSuffix: false, allowOverwrite: overwrite, cacheControlMaxAge: 60 });
}

type Listed = { pathname: string; etag: string };

/** Every object under a prefix, with its version tag, following the list's pages. */
async function listed(prefix: string, max = Infinity): Promise<Listed[]> {
  const out: Listed[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    out.push(...page.blobs.map((b) => ({ pathname: b.pathname, etag: b.etag })));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && out.length < max);
  return out.slice(0, max);
}

/**
 * Objects already read, by path and version tag. A page view then costs one list call plus a read
 * of only what changed since this server last looked, instead of a read of every record. Bounded,
 * so a long-lived server cannot grow without limit.
 */
const memo = new Map<string, unknown>();
const MEMO_MAX = 4096;
const remember = (key: string, value: unknown) => {
  if (memo.size >= MEMO_MAX) memo.delete(memo.keys().next().value as string);
  memo.set(key, value);
};

/** Read many objects, twenty at a time, from memory where the version is unchanged. */
async function readAll<T>(items: Listed[]): Promise<T[]> {
  const out: (T | null)[] = new Array(items.length).fill(null);
  const missing: number[] = [];
  items.forEach((it, i) => {
    const hit = memo.get(`${it.pathname}@${it.etag}`);
    if (hit !== undefined) out[i] = hit as T;
    else missing.push(i);
  });
  for (let k = 0; k < missing.length; k += 20) {
    const batch = missing.slice(k, k + 20);
    const got = await Promise.all(batch.map((i) => readJson<T>(items[i].pathname)));
    batch.forEach((i, j) => {
      out[i] = got[j];
      if (got[j] !== null) remember(`${items[i].pathname}@${items[i].etag}`, got[j]);
    });
  }
  return out.filter((x): x is T => x !== null);
}

const recordPath = (collection: string, id: string) => {
  if (!SLUG.test(collection) || !ID.test(id)) throw new Error("That record does not exist.");
  return `records/${collection}/${id}.json`;
};
const now = () => new Date().toISOString();
const newAuditId = () => `${String(10 ** 13 - Date.now()).padStart(13, "0")}-${crypto.randomUUID()}`;

async function audit(actor: Actor, e: Omit<AuditEntry, "id" | "at" | "actor">): Promise<AuditEntry> {
  const entry: AuditEntry = { ...e, id: newAuditId(), at: now(), actor: actor.name };
  await writeJson(`audit/${entry.id}.json`, entry, false);
  return entry;
}

export const blobStore: Store = {
  async list(collection) {
    if (!SLUG.test(collection)) return [];
    const rows = await readAll<StoredRecord>(await listed(`records/${collection}/`));
    return rows.filter((r) => !r.archived).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  async listAll() {
    return (await readAll<StoredRecord>(await listed("records/"))).filter((r) => !r.archived);
  },
  async get(collection, id) {
    try {
      return await readJson<StoredRecord>(recordPath(collection, id));
    } catch {
      return null;
    }
  },
  async create(actor, collection, data, title) {
    const id = crypto.randomUUID();
    const at = now();
    const r: StoredRecord = { id, collection, data, archived: false, createdAt: at, createdBy: actor.name, updatedAt: at, updatedBy: actor.name };
    await writeJson(recordPath(collection, id), r, false);
    await audit(actor, { layer: "ops", action: "create", collection, recordId: id, title, before: null, after: data, ref: null, revertOf: null });
    return r;
  },
  async update(actor, collection, id, data, title, opts = {}) {
    const prev = await this.get(collection, id);
    if (!prev) throw new Error("That record no longer exists.");
    const archived = opts.archived ?? false;
    const r: StoredRecord = { ...prev, data, archived, updatedAt: now(), updatedBy: actor.name };
    await writeJson(recordPath(collection, id), r, true);
    await audit(actor, {
      layer: "ops", action: opts.revertOf ? "revert" : "update", collection, recordId: id, title,
      before: { ...prev.data, ...(prev.archived ? { _archived: true } : {}) }, after: { ...data, ...(archived ? { _archived: true } : {}) },
      ref: null, revertOf: opts.revertOf ?? null,
    });
    return r;
  },
  async audit(limit = 200) {
    return readAll<AuditEntry>(await listed("audit/", limit));
  },
  async auditEntry(id) {
    if (!AUDIT_ID.test(id)) return null;
    return readJson<AuditEntry>(`audit/${id}.json`);
  },
  async logPack(actor, entry) {
    return audit(actor, { ...entry, layer: "pack" });
  },
};
