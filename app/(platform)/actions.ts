"use server";

/**
 * Every write the platform accepts. There is no sign-in: anyone with the link can save, and each
 * action runs on the server only, rate limited per visitor, validated by the same rules as the
 * form, and logged in the public change history so it can be put back (lib/platform/auth.ts).
 */
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { COLLECTION_BY_ID } from "@/lib/platform/collections";
import { validateRecord } from "@/lib/platform/validate";
import { resolveOptions } from "@/lib/platform/options";
import { NotAllowed, openEditor } from "@/lib/platform/auth";
import { commit, Refused, type Target } from "@/lib/platform/pack";
import { callerKey, limiter, LIMITS, waitMessage } from "@/lib/platform/rate-limit";

export type ActionResult = { ok: true; message: string } | { ok: false; errors: Record<string, string> };

const fail = (m: string): ActionResult => ({ ok: false, errors: { _: m } });

function guard(e: unknown): ActionResult {
  if (e instanceof NotAllowed) return fail(e.message);
  if (e instanceof Refused) return { ok: false, errors: { _: e.problems.join(" ") } };
  return fail(e instanceof Error ? e.message : "Something went wrong. Nothing was saved.");
}

/** Refuses the call when this caller has hit the action's limit (lib/platform/rate-limit.ts). */
async function throttled(action: keyof typeof LIMITS, extra = ""): Promise<ActionResult | null> {
  const wait = limiter.hit(`${action}|${callerKey(await headers())}|${extra}`, LIMITS[action]);
  return wait ? fail(waitMessage(wait)) : null;
}

function refresh() {
  for (const p of ["/workspace", "/progress", "/dashboards", "/explore", "/history"]) revalidatePath(p, "layout");
}

/* ------------------------------------------------------------------ working records */

export async function saveRecord(collectionId: string, id: string | null, input: Record<string, unknown>): Promise<ActionResult> {
  try {
    const limited = await throttled("save");
    if (limited) return limited;
    const { actor, store } = openEditor();
    const c = COLLECTION_BY_ID[collectionId];
    if (!c) return fail("That workspace does not exist.");
    const v = validateRecord(c, input, resolveOptions());
    if (!v.ok) return v;
    const title = String(v.data[c.titleField] ?? c.label);
    if (id) await store.update(actor, c.id, id, v.data, title);
    else await store.create(actor, c.id, v.data, title);
    refresh();
    return { ok: true, message: "Saved. It is on the site now." };
  } catch (e) {
    return guard(e);
  }
}

/** Puts a change back exactly as it was. A revert is itself logged, and can be reverted. */
export async function revertChange(auditId: string): Promise<ActionResult> {
  try {
    const limited = await throttled("save");
    if (limited) return limited;
    const { actor, store } = openEditor();
    const entry = await store.auditEntry(auditId);
    if (!entry) return fail("That change is not in the history.");
    if (entry.layer === "pack") {
      const undo = (entry.before as { _undo?: Target } | null)?._undo;
      if (!undo) return fail("This change cannot be reverted automatically.");
      const done = await commit(undo, actor.name);
      await store.logPack(actor, {
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
      await store.update(actor, c.id, current.id, current.data, `Revert: ${entry.title}`, { archived: true, revertOf: entry.id });
    } else {
      const { _archived, ...before } = entry.before as Record<string, unknown>;
      await store.update(actor, c.id, current.id, before, `Revert: ${entry.title}`, { archived: _archived === true, revertOf: entry.id });
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
    const limited = await throttled("packEdit");
    if (limited) return limited;
    const { actor, store } = openEditor();
    const done = await commit(target, actor.name);
    await store.logPack(actor, {
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
