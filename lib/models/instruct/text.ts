/**
 * Reading plain instructions: the shared pieces every model's instruction parser uses.
 *
 * This is not a language model and calls no service. It reads what a visitor types in their own
 * browser, by rule: names it knows (constituencies, wards, channels, languages), keywords, numbers
 * next to keywords, dates and times. Whatever it cannot place it says so, rather than guessing, and
 * it never produces a figure of its own: it only sets a model's options, and the model computes.
 *
 * Pure, no imports, so the pages and the tests share it.
 */

export type Parsed<T> = { next: T; understood: string[]; unclear: string[] };

const NUM = String.raw`(\d+(?:[.,]\d+)?)`;
const toNumber = (s: string): number => Number(s.replace(/,(?=\d{3}\b)/g, "").replace(",", "."));

/** Lower-case, with "per cent" and "percent" as "%", and curly quotes made plain. */
function normal(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s*(?:per ?cent|pct)\b/g, "%")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split an instruction into clauses: on semicolons, new lines, "then", and commas or full stops that are not inside a number. */
export const clauses = (text: string): string[] =>
  normal(text)
    .split(/;|\n|\bthen\b|,(?!\d{3}\b)(?!\d)|\.(?!\d)/)
    .map((c) => c.trim())
    .filter(Boolean);

/** The number tied to a keyword in a clause: "turnout 65", "turnout of 65%", "65% turnout". */
export function numberFor(clause: string, keyword: string): number | null {
  const after = new RegExp(`(?:${keyword})[^\\d]{0,24}?${NUM}`).exec(clause);
  if (after) return toNumber(after[1]);
  const before = new RegExp(`${NUM}\\s*%?\\s*(?:of\\s+(?:the\\s+)?)?(?:${keyword})`).exec(clause);
  return before ? toNumber(before[1]) : null;
}

/** Every bare number in a clause, in order. */
export const numbersIn = (clause: string): number[] => [...clause.matchAll(new RegExp(NUM, "g"))].map((m) => toNumber(m[1]));

export const has = (clause: string, pattern: string): boolean => new RegExp(`(?:^|\\b)(?:${pattern})`).test(clause);

/** "No radio", "without radio", "drop radio", "not radio", "exclude radio". */
export const negated = (clause: string, pattern: string): boolean => new RegExp(`\\b(?:no|not|without|drop|exclude|remove|minus|except|turn off|switch off)\\s+(?:the\\s+)?(?:${pattern})`).test(clause);

/** "Only radio", "just radio", "radio only", "radio alone". */
export const only = (clause: string, pattern: string): boolean => new RegExp(`\\b(?:only|just|solely)\\s+(?:the\\s+)?(?:${pattern})|(?:${pattern})\\s+(?:only|alone)\\b`).test(clause);

/** The names a clause mentions. A name like "Kyome/Thaana" is found by either part. */
export function namesIn<T extends { name: string }>(clause: string, items: T[]): T[] {
  return items.filter((it) => {
    const parts = [it.name, ...it.name.split(/[/-]/)].map((p) => normal(p).replace(/[^a-z0-9 ]/g, "").trim()).filter((p) => p.length >= 3);
    return parts.some((p) => new RegExp(`\\b${p.replace(/ /g, "\\s*")}\\b`).test(clause.replace(/[^a-z0-9 %.]/g, " ")));
  });
}


const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const utc = (y: number, m: number, d: number) => Date.UTC(y, m, d);

/**
 * The dates a clause names, in order, as ISO days. Reads 2027-03-12, 12/3/2027 (day first),
 * "12 March 2027", "March 12", "12 March" (the next one on or after today), "today", "tomorrow",
 * "in 3 days", "in 2 weeks".
 */
export function datesIn(clause: string, today: string): string[] {
  const out: { at: number; d: string }[] = [];
  const t0 = Date.parse(`${today}T00:00:00Z`);
  const valid = (y: number, m: number, d: number) => {
    const t = utc(y, m, d);
    return new Date(t).getUTCMonth() === m && new Date(t).getUTCDate() === d ? iso(t) : null;
  };
  const nextOccurrence = (m: number, d: number) => {
    const y = new Date(t0).getUTCFullYear();
    const a = valid(y, m, d);
    return a && Date.parse(`${a}T00:00:00Z`) >= t0 ? a : valid(y + 1, m, d);
  };
  for (const m of clause.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)) {
    const v = valid(+m[1], +m[2] - 1, +m[3]);
    if (v) out.push({ at: m.index ?? 0, d: v });
  }
  for (const m of clause.matchAll(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g)) {
    const v = valid(+m[3], +m[2] - 1, +m[1]);
    if (v) out.push({ at: m.index ?? 0, d: v });
  }
  const mon = String.raw`(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?`;
  for (const m of clause.matchAll(new RegExp(String.raw`\b(\d{1,2})(?:st|nd|rd|th)?\s+${mon}(?:\s+(\d{4}))?`, "g"))) {
    const mi = MONTHS.indexOf(m[2]);
    const v = m[3] ? valid(+m[3], mi, +m[1]) : nextOccurrence(mi, +m[1]);
    if (v) out.push({ at: m.index ?? 0, d: v });
  }
  for (const m of clause.matchAll(new RegExp(String.raw`\b${mon}\s+(\d{1,2})(?:st|nd|rd|th)?\b(?:,?\s+(\d{4}))?`, "g"))) {
    const mi = MONTHS.indexOf(m[1]);
    const v = m[3] ? valid(+m[3], mi, +m[2]) : nextOccurrence(mi, +m[2]);
    if (v && !out.some((o) => o.d === v)) out.push({ at: m.index ?? 0, d: v });
  }
  for (const m of clause.matchAll(/\b(today|tomorrow)\b/g)) out.push({ at: m.index ?? 0, d: iso(t0 + (m[1] === "tomorrow" ? DAY : 0)) });
  for (const m of clause.matchAll(/\bin (\d+) (day|week)s?\b/g)) out.push({ at: m.index ?? 0, d: iso(t0 + +m[1] * (m[2] === "week" ? 7 : 1) * DAY) });
  return out.sort((a, b) => a.at - b.at).map((o) => o.d);
}

/** A time of day as 24-hour HH:MM: "6pm", "6:30 pm", "18:30", "0930 hrs". Null when none is named. */
export function timeIn(clause: string): string | null {
  const ampm = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)/.exec(clause);
  if (ampm) {
    let h = +ampm[1] % 12;
    if (ampm[3].startsWith("p")) h += 12;
    return `${String(h).padStart(2, "0")}:${ampm[2] ?? "00"}`;
  }
  const hm = /\b([01]?\d|2[0-3]):([0-5]\d)\b/.exec(clause);
  if (hm) return `${hm[1].padStart(2, "0")}:${hm[2]}`;
  const hrs = /\b([01]\d|2[0-3])([0-5]\d)\s*(?:hrs|hours|h)\b/.exec(clause);
  if (hrs) return `${hrs[1]}:${hrs[2]}`;
  return null;
}

export const clampTo = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
export const pct = (v: number): string => `${Math.round(v * 10) / 10}%`;
export const count = (v: number): string => Math.round(v).toLocaleString("en-KE");
