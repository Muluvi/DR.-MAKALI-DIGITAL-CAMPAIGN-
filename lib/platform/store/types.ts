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

/** Read-only: the site has no sign-in and accepts no edits. */
export interface Store {
  list(collection: string): Promise<StoredRecord[]>;
  listAll(): Promise<StoredRecord[]>;
  get(collection: string, id: string): Promise<StoredRecord | null>;
  audit(limit?: number): Promise<AuditEntry[]>;
}
