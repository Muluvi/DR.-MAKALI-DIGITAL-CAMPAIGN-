export interface Actor {
  email: string;
  name: string;
}

export interface StoredRecord {
  id: string;
  collection: string;
  data: Record<string, unknown>;
  /** A record the team reverted out of existence. Kept, never deleted, and hidden from lists. */
  archived: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export type AuditAction = "create" | "update" | "revert" | "pack-edit" | "pack-revert";

export interface AuditEntry {
  id: string;
  at: string;
  /** The team member's display name. Emails are never shown publicly. */
  actor: string;
  layer: "ops" | "pack";
  action: AuditAction;
  /** A working-record collection id, or a data-pack dataset id. */
  collection: string;
  recordId: string;
  title: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  /** For a data-pack edit: the edit branch and its commit, which `verify` gates before main. */
  ref: { branch: string; commitUrl?: string } | null;
  /** The entry this one reverted, if it is a revert. */
  revertOf: string | null;
}

export interface Member {
  email: string;
  name: string;
  role: "team" | "firefly";
  active: boolean;
  addedAt: string;
  addedBy: string;
}

export interface Store {
  list(collection: string): Promise<StoredRecord[]>;
  listAll(): Promise<StoredRecord[]>;
  get(collection: string, id: string): Promise<StoredRecord | null>;
  create(actor: Actor, collection: string, data: Record<string, unknown>, title: string): Promise<StoredRecord>;
  update(actor: Actor, collection: string, id: string, data: Record<string, unknown>, title: string, opts?: { archived?: boolean; revertOf?: string }): Promise<StoredRecord>;
  audit(limit?: number): Promise<AuditEntry[]>;
  auditEntry(id: string): Promise<AuditEntry | null>;
  logPack(actor: Actor, entry: Omit<AuditEntry, "id" | "at" | "actor" | "layer">): Promise<AuditEntry>;
  members(): Promise<Member[]>;
  member(email: string): Promise<Member | null>;
  upsertMember(by: Actor, m: Pick<Member, "email" | "name" | "role" | "active">): Promise<Member>;
}
