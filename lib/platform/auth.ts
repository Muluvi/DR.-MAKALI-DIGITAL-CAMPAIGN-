/**
 * Who may edit: anyone with the link. Server only.
 *
 * There is no sign-in anywhere on the site (Firefly's decision, November 2026). Everything is open
 * to view, and anyone with the link can add to or change the team's working records and the data
 * pack. What protects the record instead of an account:
 *
 *   - every change is logged in the public change history and can be put back exactly;
 *   - nothing is ever deleted (the database refuses it);
 *   - every record is checked by the same rules as before, and free text refuses phone numbers,
 *     ID numbers and email addresses (lib/platform/validate.ts);
 *   - data-pack edits pass the full data checks before they reach the site (lib/platform/pack.ts);
 *   - each visitor's saves are rate limited (lib/platform/rate-limit.ts).
 *
 * Writes go through the server only, with the service role, so the database is never written from
 * a browser. Editing is available whenever a store is configured; with none, the site is view only
 * and every save says why.
 */
import { platformMode } from "./config";
import { localStore } from "./store/local";
import { supabaseStore } from "./store/supabase";
import type { Actor, Store } from "./store/types";

export class NotAllowed extends Error {}

/** How every change is attributed in the change history: no account, so no name. */
export const VISITOR: Actor = { email: "", name: "Anyone with the link" };

/** The store for reading. Null when the platform has no backend configured. */
export function readStore(): Store | null {
  const mode = platformMode();
  if (mode === "supabase") return supabaseStore();
  if (mode === "local") return localStore;
  return null;
}

/**
 * Firefly's switch for a vandalism clean-up: PLATFORM_EDITING=paused stops every save for everyone,
 * while the site stays open to read and the change history is put right.
 */
export const editingPaused = (): boolean => process.env.PLATFORM_EDITING === "paused";

/** Whether saving is possible: a store is connected and saving is not paused. */
export const editingAvailable = (): boolean => platformMode() !== "off" && !editingPaused();

/** For every edit: the store to write to, and how the change is attributed. */
export function openEditor(): { actor: Actor; store: Store } {
  if (editingPaused()) throw new NotAllowed("Saving is paused for everyone for a short while, while Firefly puts back unwanted changes. Everything stays open to read.");
  const store = readStore();
  if (!store) throw new NotAllowed("The workspace database is not connected yet, so nothing can be saved. Everything on the site stays open to read.");
  return { actor: VISITOR, store };
}
