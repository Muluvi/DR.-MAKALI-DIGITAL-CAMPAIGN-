/**
 * Who is signed in, and what they may do. Server only.
 *
 * Viewing never calls this: every public page renders for anyone. Every edit (a server action)
 * calls requireMember() or requireFirefly() before it writes, so an edit cannot be reached by
 * hiding a button or guessing a URL. In production the database checks membership a second time
 * (supabase/migrations/, row-level security).
 *
 * A removed member loses access on their next request: membership is read from the database on
 * every check, never cached in the session.
 */
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fireflyAdminEmails, platformMode } from "./config";
import { localStore } from "./store/local";
import { supabaseStore } from "./store/supabase";
import type { Actor, Store } from "./store/types";

export interface Session extends Actor {
  role: "team" | "firefly";
}

export class NotAllowed extends Error {}

export async function supabaseUserClient(): Promise<SupabaseClient> {
  const jar = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) jar.set(name, value, options);
        } catch {
          // A server component cannot set cookies; the middleware refreshes the session instead.
        }
      },
    },
  });
}

/* ------------------------------------------------------------------ local (development) accounts */

export const LOCAL_COOKIE = "platform-local-session";
const secret = () => process.env.PLATFORM_LOCAL_SECRET || "development-only";
const sign = (email: string) => crypto.createHmac("sha256", secret()).update(email).digest("hex");
export const localToken = (email: string) => `${Buffer.from(email).toString("base64url")}.${sign(email)}`;
function readLocalToken(token: string | undefined): string | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const email = Buffer.from(b64, "base64url").toString();
  const expected = sign(email);
  return sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) ? email : null;
}
/** Development accounts: PLATFORM_LOCAL_USERS="email|password|Name,email|password|Name". */
export function localCredentials(): { email: string; password: string; name: string }[] {
  return (process.env.PLATFORM_LOCAL_USERS ?? "")
    .split(",")
    .map((s) => s.split("|"))
    .filter((p) => p.length >= 3)
    .map(([email, password, name]) => ({ email: email.trim().toLowerCase(), password, name: name.trim() }));
}

/* ------------------------------------------------------------------ the session */

/** The store for reading. Null when the platform has no backend configured. */
export function readStore(): Store | null {
  const mode = platformMode();
  if (mode === "supabase") return supabaseStore(null);
  if (mode === "local") return localStore;
  return null;
}

async function signedInEmail(): Promise<string | null> {
  const mode = platformMode();
  if (mode === "supabase") {
    const { data } = await (await supabaseUserClient()).auth.getUser();
    return data.user?.email?.toLowerCase() ?? null;
  }
  if (mode === "local") return readLocalToken((await cookies()).get(LOCAL_COOKIE)?.value);
  return null;
}

/** The signed-in team member, or null. Checks the member list on every call. */
export async function getSession(): Promise<Session | null> {
  const store = readStore();
  if (!store) return null;
  const email = await signedInEmail();
  if (!email) return null;
  const admin = fireflyAdminEmails().includes(email);
  const m = await store.member(email);
  if (m && m.active) return { email, name: m.name, role: admin || m.role === "firefly" ? "firefly" : "team" };
  // A Firefly admin named in FIREFLY_ADMIN_EMAILS can sign in before any member exists, to add the first ones.
  if (admin && !m) return { email, name: "Firefly", role: "firefly" };
  return null;
}

/** For every edit: the member, and a store that writes as them. Throws NotAllowed otherwise. */
export async function requireMember(): Promise<{ session: Session; store: Store }> {
  const session = await getSession();
  if (!session) throw new NotAllowed("Sign in with a team account to edit. Viewing needs no account.");
  const store = platformMode() === "supabase" ? supabaseStore(await supabaseUserClient()) : localStore;
  return { session, store };
}

export async function requireFirefly(): Promise<{ session: Session; store: Store }> {
  const r = await requireMember();
  if (r.session.role !== "firefly") throw new NotAllowed("Only Firefly, as the platform's owner, can manage team accounts.");
  return r;
}
