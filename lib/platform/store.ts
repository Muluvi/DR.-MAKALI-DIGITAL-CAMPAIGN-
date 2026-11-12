/**
 * The platform's data store, for reading. Server only.
 *
 * The site has no sign-in: every page renders for anyone with the link, and nothing on the site
 * writes. This file used to hold the team sign-in and the session checks behind each edit; both
 * were removed along with the edits themselves.
 */
import { platformMode } from "./config";
import { localStore } from "./store/local";
import { supabaseStore } from "./store/supabase";
import type { Store } from "./store/types";

/** The store for reading. Null when the platform has no backend configured. */
export function readStore(): Store | null {
  const mode = platformMode();
  if (mode === "supabase") return supabaseStore();
  if (mode === "local") return localStore;
  return null;
}
