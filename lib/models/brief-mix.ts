/**
 * Weekly brief mix: which of the six voter segments a week's brief covers, and which it misses.
 * Pure, no imports: the segment plan is passed in (lib/register/specs/s4-strategy.ts, SEGMENT_PLAN,
 * the same table fig-4-3 prints).
 *
 * A segment counts as covered when three things hold:
 *   1. its content type gets at least the minimum share of the week you set;
 *   2. the week uses at least one of its languages;
 *   3. the week uses at least one of its lead channels.
 * Each miss says which of the three failed.
 */

export type ContentCode = "P1" | "P2" | "P3" | "P4";
export type PlanRow = { id: string; name: string; pillar: ContentCode; languages: string[]; channels: string[] };
export type MixInputs = { shares: Record<ContentCode, number>; languages: string[]; channels: string[]; minShare: number };
export type Coverage = { row: PlanRow; covered: boolean; reasons: string[] };

export const KNOWN_LANGUAGES = ["Kikamba", "Kiswahili", "English", "Sheng"] as const;

/** The languages a plan cell names ("Kikamba on voice; Kiswahili on SMS" → Kikamba, Kiswahili). */
export const languagesIn = (text: string): string[] => KNOWN_LANGUAGES.filter((l) => new RegExp(`\\b${l}\\b`, "i").test(text));
/** The channels a plan cell lists ("WhatsApp voice note, SMS" → two channels). */
export const channelsIn = (text: string): string[] => text.split(",").map((c) => c.trim()).filter(Boolean);

export function toPlanRows(plan: Record<string, { pillar: string; lang: string; channel: string }>, names: Record<string, string>): PlanRow[] {
  return Object.entries(plan).map(([id, p]) => ({ id, name: names[id] ?? id, pillar: p.pillar as ContentCode, languages: languagesIn(p.lang), channels: channelsIn(p.channel) }));
}

export const sharesTotal = (s: Record<ContentCode, number>): number => (Object.values(s) as number[]).reduce((a, v) => a + (Number.isFinite(v) ? v : 0), 0);

export function coverage(rows: PlanRow[], i: MixInputs): Coverage[] {
  return rows.map((row) => {
    const reasons: string[] = [];
    const share = i.shares[row.pillar] ?? 0;
    if (share < i.minShare) reasons.push(`its content type, ${row.pillar}, has ${share}% of the week (the minimum you set is ${i.minShare}%)`);
    if (!row.languages.some((l) => i.languages.includes(l))) reasons.push(`none of its languages (${row.languages.join(", ")}) is in the week`);
    if (!row.channels.some((c) => i.channels.includes(c))) reasons.push(`none of its lead channels (${row.channels.join(", ")}) is in the week`);
    return { row, covered: reasons.length === 0, reasons };
  });
}

/** Every channel the plan names, once, in first-seen order. */
export const allChannels = (rows: PlanRow[]): string[] => [...new Set(rows.flatMap((r) => r.channels))];
