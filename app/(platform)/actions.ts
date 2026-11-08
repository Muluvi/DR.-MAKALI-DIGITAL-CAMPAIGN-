"use server";

/**
 * Every write the platform accepts. Each action checks the session on the server before it does
 * anything (requireMember / requireFirefly), so hiding a button is never the protection: a request
 * from someone who is not an active team member is refused here, and again by the database.
 */
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { COLLECTION_BY_ID } from "@/lib/platform/collections";
import { validateRecord } from "@/lib/platform/validate";
import { resolveOptions } from "@/lib/platform/options";
import { LOCAL_COOKIE, localCredentials, localToken, NotAllowed, readStore, requireFirefly, requireMember, supabaseUserClient } from "@/lib/platform/auth";
import { fireflyAdminEmails, platformMode, teamLoginEnabled } from "@/lib/platform/config";
import { commit, Refused, type Target } from "@/lib/platform/pack";
import { serviceClient } from "@/lib/platform/store/supabase";

export type ActionResult = { ok: true; message: string } | { ok: false; errors: Record<string, string> };

const fail = (m: string): ActionResult => ({ ok: false, errors: { _: m } });

function guard(e: unknown): ActionResult {
  if (e instanceof NotAllowed) return fail(e.message);
  if (e instanceof Refused) return { ok: false, errors: { _: e.problems.join(" ") } };
  return fail(e instanceof Error ? e.message : "Something went wrong. Nothing was saved.");
}

function refresh() {
  for (const p of ["/workspace", "/progress", "/dashboards", "/explore", "/history"]) revalidatePath(p, "layout");
}

/* ------------------------------------------------------------------ working records */

export async function saveRecord(collectionId: string, id: string | null, input: Record<string, unknown>): Promise<ActionResult> {
  try {
    const { session, store } = await requireMember();
    const c = COLLECTION_BY_ID[collectionId];
    if (!c) return fail("That workspace does not exist.");
    const v = validateRecord(c, input, resolveOptions());
    if (!v.ok) return v;
    const title = String(v.data[c.titleField] ?? c.label);
    if (id) await store.update(session, c.id, id, v.data, title);
    else await store.create(session, c.id, v.data, title);
    refresh();
    return { ok: true, message: "Saved. It is on the site now." };
  } catch (e) {
    return guard(e);
  }
}

/** Puts a change back exactly as it was. A revert is itself logged, and can be reverted. */
export async function revertChange(auditId: string): Promise<ActionResult> {
  try {
    const { session, store } = await requireMember();
    const entry = await store.auditEntry(auditId);
    if (!entry) return fail("That change is not in the history.");
    if (entry.layer === "pack") {
      const undo = (entry.before as { _undo?: Target } | null)?._undo;
      if (!undo) return fail("This change cannot be reverted automatically.");
      const done = await commit(undo, session.name);
      await store.logPack(session, {
        action: "pack-revert", collection: entry.collection, recordId: entry.recordId, title: `Revert: ${entry.title}`,
        before: { ...done.before, _undo: done.undo }, after: done.after, ref: done.ref, revertOf: entry.id,
      });
      refresh();
      return { ok: true, message: "Revert submitted. The data checks run before it goes live." };
    }
    const c = COLLECTION_BY_ID[entry.collection];
    const current = await store.get(entry.collection, entry.recordId);
    if (!c || !current) return fail("That record no longer exists.");
    if (entry.action === "create" || !entry.before) {
      // Reverting a creation hides the record. It is kept, and reverting this revert restores it.
      await store.update(session, c.id, current.id, current.data, `Revert: ${entry.title}`, { archived: true, revertOf: entry.id });
    } else {
      const { _archived, ...before } = entry.before as Record<string, unknown>;
      await store.update(session, c.id, current.id, before, `Revert: ${entry.title}`, { archived: _archived === true, revertOf: entry.id });
    }
    refresh();
    return { ok: true, message: "Reverted. The previous version is back on the site." };
  } catch (e) {
    return guard(e);
  }
}

/* ------------------------------------------------------------------ the data pack */

export async function savePackEdit(target: Target): Promise<ActionResult> {
  try {
    const { session, store } = await requireMember();
    const done = await commit(target, session.name);
    await store.logPack(session, {
      action: "pack-edit", collection: target.kind, recordId: done.file, title: done.title,
      before: { ...done.before, _undo: done.undo }, after: done.after, ref: done.ref, revertOf: null,
    });
    refresh();
    return {
      ok: true,
      message: done.ref.branch === "local working tree" ? "Saved to the working tree." : "Submitted. The data checks run now; if they pass, it is live in a few minutes. Track it in the change history.",
    };
  } catch (e) {
    return guard(e);
  }
}

/* ------------------------------------------------------------------ team accounts (Firefly) */

export async function saveMember(input: { email: string; name: string; role: "team" | "firefly"; active: boolean; invite?: boolean }): Promise<ActionResult> {
  try {
    const { session, store } = await requireFirefly();
    const email = input.email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, errors: { email: "Enter a valid email address." } };
    if (!input.name.trim()) return { ok: false, errors: { name: "Enter the member's name." } };
    if (email === session.email && !input.active) return fail("You cannot remove your own account.");
    const existing = await store.member(email);
    await store.upsertMember(session, { email, name: input.name.trim(), role: input.role, active: input.active });
    if (!existing && input.invite !== false && platformMode() === "supabase") {
      const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "";
      const { error } = await serviceClient().auth.admin.inviteUserByEmail(email, { redirectTo: `${origin}/team/auth/callback` });
      if (error && !/already been registered/i.test(error.message)) return fail(`Added, but the invitation email failed: ${error.message}`);
    }
    revalidatePath("/team/admin");
    return { ok: true, message: input.active ? (existing ? "Updated." : "Added. They can sign in now.") : "Removed. They can no longer edit." };
  } catch (e) {
    return guard(e);
  }
}

/* ------------------------------------------------------------------ signing in and out */

export async function signIn(input: { email: string; password?: string; magic?: boolean }): Promise<ActionResult> {
  const email = input.email.trim().toLowerCase();
  if (!email) return { ok: false, errors: { email: "Enter your email address." } };
  const mode = platformMode();
  if (!teamLoginEnabled() || mode === "off") return fail("Sign-in is switched off. The site is open to view.");
  if (mode === "local") {
    const cred = localCredentials().find((c) => c.email === email && c.password === input.password);
    if (!cred) return fail("That email and password do not match a team account.");
    const store = readStore()!;
    if (!(await store.member(email)) && fireflyAdminEmails().includes(email)) await store.upsertMember({ email, name: cred.name }, { email, name: cred.name, role: "firefly", active: true });
    if (!(await store.member(email))?.active) return fail("This account is not on the team. Ask Firefly to add it.");
    (await cookies()).set(LOCAL_COOKIE, localToken(email), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 });
    return { ok: true, message: "Signed in." };
  }
  const sb = await supabaseUserClient();
  if (input.magic || !input.password) {
    const allowed = fireflyAdminEmails().includes(email) || (await readStore()!.member(email))?.active;
    // The same reply either way, so the form cannot be used to find out who is on the team.
    if (allowed) {
      const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "";
      await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: fireflyAdminEmails().includes(email), emailRedirectTo: `${origin}/team/auth/callback` } });
    }
    return { ok: true, message: "If that address belongs to a team account, a sign-in link is on its way. Open it on this phone." };
  }
  const { error } = await sb.auth.signInWithPassword({ email, password: input.password });
  if (error) return fail("That email and password do not match a team account.");
  if (!fireflyAdminEmails().includes(email) && !(await readStore()!.member(email))?.active) {
    await sb.auth.signOut();
    return fail("This account is not on the team. Ask Firefly to add it.");
  }
  return { ok: true, message: "Signed in." };
}

export async function signOut() {
  if (platformMode() === "supabase") await (await supabaseUserClient()).auth.signOut();
  (await cookies()).delete(LOCAL_COOKIE);
  redirect("/workspace");
}
