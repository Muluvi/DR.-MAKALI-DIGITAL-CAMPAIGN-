/**
 * The Campaigner Network on the server: the release flag, the store, and who is signed in.
 * Server only. Nothing here is imported by a client component.
 *
 * THE FLAG. Every route that reads or writes personal data answers 404 unless NETWORK_PRIVATE=on
 * and a database is configured. It stays off until the owner has provisioned the database,
 * confirmed the access checks (docs/network/README.md) and Kenyan counsel has signed off the launch
 * checklist. The public aggregate view does not depend on it.
 *
 * SIGN-IN. The site's existing authentication is Supabase Auth. Its team accounts carry no area, so
 * the network adds role-scoped accounts on the same Supabase Auth: a person signs in with a one-time
 * code sent to the phone number on their record (or the email on it), and their seats decide what
 * they see. Firefly's existing platform-owner session may appoint the first Campaign Command
 * members, and nothing else.
 */
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getSession, supabaseUserClient } from "../platform/auth";
import { platformMode } from "../platform/config";
import { channelsFromEnv } from "./channels";
import { localDb } from "./db-local";
import { supabaseDb } from "./db-supabase";
import type { NetDb } from "./db";
import type { Actor } from "./policy";
import { networkService, resolveActor, type NetworkService } from "./service";

export function networkPrivateEnabled(): boolean {
  return process.env.NETWORK_PRIVATE === "on" && platformMode() !== "off";
}

/** The store, or null when no database is configured. Used by the public aggregate too. */
export function networkDb(): NetDb | null {
  const mode = platformMode();
  if (mode === "supabase") return supabaseDb();
  if (mode === "local") return localDb();
  return null;
}

/* ------------------------------------------------------------------ development sign-in */

export const LOCAL_NETWORK_COOKIE = "network-local-session";
const secret = () => {
  const s = process.env.PLATFORM_LOCAL_SECRET;
  if (!s) throw new Error("PLATFORM_LOCAL_SECRET is required for local network sign-in.");
  return s;
};
const sign = (v: string) => crypto.createHmac("sha256", secret()).update(`network:${v}`).digest("hex");
export const localNetworkToken = (phone: string) => `${Buffer.from(phone).toString("base64url")}.${sign(phone)}`;
function readLocalNetworkToken(token: string | undefined): string | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const phone = Buffer.from(b64, "base64url").toString();
  const expected = sign(phone);
  return sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) ? phone : null;
}

/* ------------------------------------------------------------------ who is signed in */

export async function networkActor(): Promise<Actor> {
  const db = networkDb();
  if (!networkPrivateEnabled() || !db) return { kind: "anonymous" };
  const mode = platformMode();
  if (mode === "supabase") {
    const { data } = await (await supabaseUserClient()).auth.getUser();
    const u = data.user;
    if (u) {
      const a = await resolveActor(db, { phone: u.phone ? `+${u.phone.replace(/^\+/, "")}` : null, email: u.email ?? null });
      if (a.kind === "person") return a;
    }
  } else if (mode === "local") {
    const phone = readLocalNetworkToken((await cookies()).get(LOCAL_NETWORK_COOKIE)?.value);
    if (phone) {
      const a = await resolveActor(db, { phone });
      if (a.kind === "person") return a;
    }
  }
  const team = await getSession().catch(() => null);
  if (team?.role === "firefly") return { kind: "firefly", label: `Firefly (${team.name})`, email: team.email };
  return { kind: "anonymous" };
}

/** For every private page, action and route: 404 while the flag is off, else the actor's service. */
export async function network(): Promise<{ svc: NetworkService; actor: Actor; db: NetDb }> {
  const db = networkDb();
  if (!networkPrivateEnabled() || !db) notFound();
  const actor = await networkActor();
  return { svc: networkService({ db, channels: channelsFromEnv() }, actor), actor, db };
}
