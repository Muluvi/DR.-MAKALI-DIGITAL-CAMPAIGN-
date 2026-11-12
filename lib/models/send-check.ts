/**
 * Send check: would the dispatch log accept this send? It runs the dispatch collection's own rules
 * (lib/platform/collections.ts), the same functions the workspace form and the server apply, so the
 * model and the log cannot disagree.
 *
 * It reports what those rules say. It is not legal clearance: counsel or the campaign's licensed
 * provider confirms the current text of the guidelines the rules encode.
 */
import { COLLECTIONS } from "../platform/collections.ts";
import { findPersonalData, personalDataMessage } from "../platform/personal-data.ts";

export type SendInputs = { rail: string; language: string; date: string; sendTime: string; lodgedOn: string; message: string };
export type SendResult = { allowed: boolean; refusals: string[]; ruled: boolean };

const DISPATCH = COLLECTIONS.find((c) => c.id === "dispatch");
if (!DISPATCH) throw new Error("send-check: the dispatch collection is missing");

const field = (key: string) => {
  const f = DISPATCH.fields.find((x) => x.key === key);
  if (!f) throw new Error(`send-check: the dispatch collection has no ${key} field`);
  return f;
};

/** The rails and languages the dispatch log offers, read from the collection rather than retyped. */
export const RAIL_OPTIONS: readonly string[] = field("rail").options ?? [];
export const LANGUAGE_OPTIONS: readonly string[] = field("language").options ?? [];

/** Rails the dispatch rules speak to. On any other rail the log applies no rule, and the check says so. */
export const RULED_RAILS = new Set(["SMS"]);

/** The SMS length limit the dispatch log applies, read from the message field's hint. */
export const SMS_LIMIT = Number(/(\d+) characters/.exec(field("message").hint ?? "")?.[1] ?? Number.NaN);

export function checkSend(i: SendInputs): SendResult {
  const record: Record<string, unknown> = { ...i };
  const refusals = (DISPATCH!.rules ?? []).map((r) => r(record)).filter((m): m is string => !!m);
  // The log's form refuses contact details in free text on every rail (lib/platform/validate.ts).
  const personal = findPersonalData(i.message);
  if (personal) refusals.push(personalDataMessage("The message", personal));
  return { allowed: refusals.length === 0, refusals, ruled: RULED_RAILS.has(i.rail) };
}
