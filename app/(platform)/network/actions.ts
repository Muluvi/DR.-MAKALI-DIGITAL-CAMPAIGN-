"use server";

/**
 * Every write the Campaigner Network accepts. Each action resolves the signed-in person on the
 * server and calls the service, which checks the policy before it touches a row. While
 * NETWORK_PRIVATE is off, network() answers 404 and nothing here runs.
 */
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseUserClient } from "@/lib/platform/auth";
import { platformMode } from "@/lib/platform/config";
import { serviceClient } from "@/lib/platform/store/supabase";
import { network, networkDb, networkPrivateEnabled, LOCAL_NETWORK_COOKIE, localNetworkToken } from "@/lib/network/server";
import { resolveActor, Invalid, type RegisterInput, type RoleInput } from "@/lib/network/service";
import { NotAllowed } from "@/lib/network/policy";
import { toE164 } from "@/lib/network/conduct";
import type { FlagKind, Target, TaskState } from "@/lib/network/types";

export type NetResult = { ok: true; message: string; data?: unknown } | { ok: false; errors: Record<string, string> };

const fail = (m: string): NetResult => ({ ok: false, errors: { _: m } });

function guard(e: unknown): NetResult {
  if (e instanceof Invalid) return { ok: false, errors: e.errors };
  if (e instanceof NotAllowed) return fail(e.message);
  // The message of an unexpected error can carry a database detail; it never carries a row.
  return fail("Something went wrong. Nothing was saved.");
}

const refresh = () => revalidatePath("/network", "layout");

async function run(fn: () => Promise<string | { message: string; data?: unknown }>): Promise<NetResult> {
  try {
    const out = await fn();
    refresh();
    return typeof out === "string" ? { ok: true, message: out } : { ok: true, ...out };
  } catch (e) {
    // notFound() and redirect() throw control-flow errors that Next must see.
    if (e && typeof e === "object" && "digest" in e) throw e;
    return guard(e);
  }
}

/* ------------------------------------------------------------------ signing in */

/** Sends a one-time code to a registered number. The same reply either way, so the form reveals nobody. */
export async function sendCode(rawPhone: string): Promise<NetResult> {
  if (!networkPrivateEnabled()) return fail("The campaigner network is not switched on yet.");
  const phone = toE164(rawPhone);
  if (!phone) return { ok: false, errors: { phone: "Enter your Kenyan mobile number, for example 0712 345 678." } };
  const db = networkDb()!;
  const known = (await resolveActor(db, { phone })).kind === "person";
  if (known && platformMode() === "supabase") {
    await (await supabaseUserClient()).auth.signInWithOtp({ phone, options: { shouldCreateUser: true, channel: "sms" } });
  }
  return { ok: true, message: "If that number is registered in the network, a code is on its way by SMS." };
}

export async function verifyCode(rawPhone: string, code: string): Promise<NetResult> {
  if (!networkPrivateEnabled()) return fail("The campaigner network is not switched on yet.");
  const phone = toE164(rawPhone);
  const token = code.replace(/\D/g, "");
  if (!phone || token.length < 4) return { ok: false, errors: { code: "Enter the code from the SMS." } };
  const db = networkDb()!;
  if (platformMode() === "local") {
    const dev = process.env.NETWORK_LOCAL_CODE;
    if (!dev || token !== dev || (await resolveActor(db, { phone })).kind !== "person") return { ok: false, errors: { code: "That code is not right." } };
    (await cookies()).set(LOCAL_NETWORK_COOKIE, localNetworkToken(phone), { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 12 });
    return { ok: true, message: "Signed in." };
  }
  const sb = await supabaseUserClient();
  const { error } = await sb.auth.verifyOtp({ phone, token, type: "sms" });
  if (error) return { ok: false, errors: { code: "That code is not right, or it has expired." } };
  if ((await resolveActor(db, { phone })).kind !== "person") {
    await sb.auth.signOut();
    return fail("This number is not registered in the network.");
  }
  return { ok: true, message: "Signed in." };
}

export async function signOutNetwork() {
  if (platformMode() === "supabase") await (await supabaseUserClient()).auth.signOut();
  (await cookies()).delete(LOCAL_NETWORK_COOKIE);
  redirect("/network/sign-in");
}

/* ------------------------------------------------------------------ people and seats */

export async function registerPerson(input: RegisterInput): Promise<NetResult> {
  return run(async () => {
    const { svc } = await network();
    const v = await svc.register(input);
    return v.person.eligibility === "review" ? "Registered. The seat is held until Campaign Command clears the public-funds declaration." : "Registered. The seat is filled.";
  });
}

export async function addRole(personId: string, role: RoleInput): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.addRole(personId, role);
    return "Role added. They are counted once in unique people.";
  });
}

export async function endRole(roleId: string): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.endRole(roleId);
    return "Role ended. The seat shows as vacant.";
  });
}

export async function setPrimary(roleId: string): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.setPrimary(roleId);
    return "Primary reporting line changed.";
  });
}

export async function correctPerson(personId: string, patch: { name?: string; phone?: string; email?: string | null; woman?: boolean | null; youth?: boolean | null }): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.correct(personId, patch);
    return "Corrected.";
  });
}

export async function withdrawPerson(personId: string): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.withdraw(personId);
    return "Consent withdrawn. Their seats have ended and their details are erased.";
  });
}

export async function deletePerson(personId: string): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.remove(personId);
    return "Deleted.";
  });
}

export async function decideEligibility(personId: string, decision: "cleared" | "barred"): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.decideEligibility(personId, decision);
    return decision === "cleared" ? "Cleared. Their seat is now active." : "Barred. The record has been deleted.";
  });
}

/* ------------------------------------------------------------------ targets, aliases, groups */

export async function setTarget(unit: "ward" | "village", code: number, target: number): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.setTarget(unit, code, target);
    return `Target set to ${target} per village.`;
  });
}

export async function addAlias(villageCode: number, alias: string): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.addAlias(villageCode, alias);
    return "Spelling added. It finds the village; the official name and code are unchanged.";
  });
}

export async function saveGroup(input: Record<string, unknown>): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.saveGroup(input);
    return "Group saved.";
  });
}

/* ------------------------------------------------------------------ tasks */

export async function createTask(input: { title: string; instructions: string; due: string; evidence: string; objective: string; template?: string | null; target: Target }): Promise<NetResult> {
  return run(async () => {
    const r = await (await network()).svc.createTask(input);
    const failed = r.deliveries.filter((d) => d.status === "failed").length;
    return `Issued to ${r.assignments.length} ${r.assignments.length === 1 ? "person" : "people"}.${failed ? ` ${failed} WhatsApp or USSD sends failed; see the task.` : ""}`;
  });
}

export async function updateAssignment(id: string, state: TaskState, note?: string): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.updateAssignment(id, state, note ?? null);
    return `Marked ${state.toLowerCase()}.`;
  });
}

export async function decideClash(ids: string[], decision: string): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.decideClash(ids, decision);
    return "Clash resolved.";
  });
}

export async function saveTemplate(input: { id: string; name: string; title: string; instructions: string; evidence: string; objective: string }): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.saveTemplate(input);
    return "Template saved.";
  });
}

/* ------------------------------------------------------------------ field reports */

const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const PHOTO_MAX = 5 * 1024 * 1024;

export async function submitReport(form: FormData): Promise<NetResult> {
  return run(async () => {
    const { svc, actor } = await network();
    if (actor.kind !== "person") throw new NotAllowed("Sign in to file a report.");
    let photo_path: string | null = null;
    const photo = form.get("photo");
    if (photo instanceof File && photo.size > 0) {
      const ext = PHOTO_TYPES[photo.type];
      if (!ext) throw new Invalid({ photo: "A photo must be a JPEG, PNG or WebP image." });
      if (photo.size > PHOTO_MAX) throw new Invalid({ photo: "A photo must be under 5 MB." });
      photo_path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
      const bytes = Buffer.from(await photo.arrayBuffer());
      if (platformMode() === "supabase") {
        const { error } = await serviceClient().storage.from("network-field-photos").upload(photo_path, bytes, { contentType: photo.type });
        if (error) throw new Invalid({ photo: "The photo could not be stored. Send the report without it, or try again." });
      } else {
        const fs = await import("node:fs");
        const path = await import("node:path");
        const file = path.join(process.cwd(), ".platform-local", "network-photos", photo_path);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, bytes);
      }
    }
    const num = (k: string) => (form.get(k) ? Number(form.get(k)) : null);
    const str = (k: string) => (typeof form.get(k) === "string" ? String(form.get(k)) : "");
    await svc.submitReport({
      role_id: str("role_id") || null,
      task_id: str("task_id") || null,
      activity: str("activity"),
      ward_code: num("ward_code"),
      village_code: num("village_code"),
      people_reached: Number(str("people_reached") || "NaN"),
      issue_category: str("issue_category") || null,
      issue_text: str("issue_text") || null,
      follow_up: str("follow_up") === "yes",
      follow_up_note: str("follow_up_note") || null,
      photo_path,
    });
    return "Sent to your ward coordinator. Thank you.";
  });
}

/* ------------------------------------------------------------------ flags, messages, settings */

export async function raiseFlag(input: { kind: FlagKind; details: string; ward_code?: number | null }): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.raiseFlag(input);
    return "Sent straight to Campaign Command. A named member will own it.";
  });
}

export async function updateFlag(id: string, patch: { owner_person_id?: string | null; state?: "open" | "closed"; resolution?: string | null }): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.updateFlag(id, patch);
    return "Flag updated.";
  });
}

export async function broadcast(input: { body: string; voice: "command" | "candidate"; audience?: Target | null }): Promise<NetResult> {
  return run(async () => {
    const r = await (await network()).svc.broadcast(input);
    const failed = r.deliveries.filter((d) => d.status === "failed").length;
    return `Sent to ${r.recipients} ${r.recipients === 1 ? "person" : "people"} in the app.${failed ? ` ${failed} WhatsApp or USSD sends failed.` : ""} Replies go to each sender's ward coordinator.`;
  });
}

export async function reply(messageId: string, body: string): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.reply(messageId, body);
    return "Sent to your coordinator.";
  });
}

export async function setRetention(date: string): Promise<NetResult> {
  return run(async () => {
    await (await network()).svc.setRetention(date);
    return `Personal data will be deleted after ${date}.`;
  });
}

export async function purgeExpired(): Promise<NetResult> {
  return run(async () => {
    const n = await (await network()).svc.purgeExpired();
    return `Deleted ${n} expired ${n === 1 ? "record" : "records"}.`;
  });
}
