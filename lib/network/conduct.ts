/**
 * Eligibility and conduct rules. Pure functions, used by the server on every write and by the
 * forms to explain a refusal before it is sent.
 */
import type { Person, PublicFundsRole } from "./types.ts";

export const PUBLIC_OFFICER_DECLARATION = "I am not a serving public officer barred from partisan political activity.";

export const COUNTY_OFFICERS_BARRED =
  "Village Administrators, Ward Administrators, Sub-County Administrators and other serving county public officers cannot be appointed to any seat in this network.";

export const PUBLIC_FUNDS_ROLES: { id: PublicFundsRole; label: string }[] = [
  { id: "none", label: "None of these" },
  { id: "teacher", label: "Teacher" },
  { id: "chief_or_assistant_chief", label: "Chief or assistant chief" },
  { id: "community_health_worker", label: "Community health worker (promoter)" },
  { id: "other_public_funds", label: "Another role paid from public funds" },
  { id: "unsure", label: "Not sure" },
];

/**
 * The eligibility a registration starts with. A serving county officer is barred outright. Anyone
 * paid from public funds, or unsure, is routed to Command to decide; they hold no active seat until
 * Command clears them.
 */
export function eligibilityFor(p: Pick<Person, "declaration_not_public_officer" | "serving_county_officer" | "public_funds_role">): {
  eligibility: Person["eligibility"];
  problem: string | null;
} {
  if (p.serving_county_officer) return { eligibility: "barred", problem: COUNTY_OFFICERS_BARRED };
  if (!p.declaration_not_public_officer) return { eligibility: "barred", problem: `The declaration is required: "${PUBLIC_OFFICER_DECLARATION}"` };
  if (p.public_funds_role !== "none") return { eligibility: "review", problem: null };
  return { eligibility: "cleared", problem: null };
}

/**
 * Activity no task, template or report may involve. Matched on the words used, so the form can say
 * why it refused; Command reviews anything that slips past, and the misconduct path takes reports
 * of other people doing these things.
 */
const PROHIBITED: { pattern: RegExp; reason: string }[] = [
  { pattern: /\b(give|gave|given|giving|hand(ed|ing)? out|distribut\w*|pay|paid|paying|offer\w*)\b[^.]{0,40}\b(money|cash|pesa|mpesa|m-pesa|gifts?|goods|food|flour|unga|sugar|fare|token|bribe)\b/i, reason: "giving money or goods to voters" },
  { pattern: /\b(bribe|bribing|bribery|vote[- ]buying|buy(ing)? votes)\b/i, reason: "giving money or goods to voters" },
  { pattern: /\b(collect\w*|gather\w*|take|taking|hold\w*|keep\w*|record\w*|photograph\w*)\b[^.]{0,40}\b(voter'?s? cards?|voters? cards?|id cards?|national ids?|identity cards?|ids)\b/i, reason: "collecting voter cards or IDs" },
  { pattern: /\b(id|identity card|voter card) numbers?\b/i, reason: "collecting voter cards or IDs" },
  { pattern: /\b(intimidat\w*|threaten\w*|harass\w*|coerc\w*|force (them|people|voters))\b/i, reason: "intimidation" },
  { pattern: /\b(tribe|tribal|tribesmen|ethnic\w*|outsiders?|foreigners? from)\b/i, reason: "ethnic messaging" },
  { pattern: /\b(during|in the middle of|at)\b[^.]{0,20}\b(worship|service|mass|sermon|prayers?)\b/i, reason: "partisan activity during worship" },
  { pattern: /\b(how (they|people|you) (will )?vote|voting intention|who (they|people) (will )?vote for)\b/i, reason: "recording how a person intends to vote" },
];

/** The reason text is refused, or null if it is clear. */
export function prohibitedReason(...texts: (string | null | undefined)[]): string | null {
  const t = texts.filter(Boolean).join(" \n ");
  for (const p of PROHIBITED) if (p.pattern.test(t)) return p.reason;
  return null;
}

export const PROHIBITED_SUMMARY =
  "No task, template or report may involve giving money or goods to voters, collecting voter cards or IDs, intimidation, ethnic messaging, or partisan activity during worship.";

/** Kenyan mobile numbers to E.164 (+2547… or +2541…). Null if it is not one. */
export function toE164(raw: string): string | null {
  const d = raw.replace(/[\s()-]/g, "");
  if (/^\+254[17]\d{8}$/.test(d)) return d;
  if (/^254[17]\d{8}$/.test(d)) return `+${d}`;
  if (/^0[17]\d{8}$/.test(d)) return `+254${d.slice(1)}`;
  return null;
}
