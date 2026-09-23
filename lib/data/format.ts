/**
 * The one place a number becomes text, so 605703 and "605,703" cannot drift apart.
 *
 * Grouping uses a comma and no locale lookup, because the page renders on the server and the
 * client and the two must agree character for character.
 */
import type { Figure } from "./schema";

/** A render modifier after the pipe in a `{{id|mod}}` token. */
export type FormatMod = "" | "tier" | "bn" | "m" | "k" | "abs" | "d0" | "d1" | "d2";

const TIER_TEXT = { T1: "Tier 1", T2: "Tier 2", T3: "Tier 3" } as const;

export function group(n: number, decimals = 0): string {
  const negative = n < 0;
  const fixed = Math.abs(n).toFixed(decimals);
  const [whole, frac] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (negative ? "−" : "") + grouped + (frac ? `.${frac}` : "");
}

function defaultDecimals(f: Figure): number {
  if (f.decimals !== undefined) return f.decimals;
  return f.unit === "percent" ? 1 : 0;
}

/**
 * The printed form of a figure. `bn`, `m` and `k` scale a shilling or head count for prose that
 * says "KSh 13.79 billion" or "KSh 670m"; `abs` drops a sign where the sentence carries it in words.
 */
export function formatFigure(f: Figure, mod: FormatMod = ""): string {
  if (mod === "tier") {
    if (f.state === "modelled") return "modelled";
    if (f.state === "target") return "target";
    if (f.state === "needed" || !f.tier) return "data needed";
    return TIER_TEXT[f.tier];
  }
  if (f.value === null) return `[DATA NEEDED — ${f.closesWith ?? "source"}]`;
  let v = f.value;
  // A shilling amount prints whole unless it is being scaled to billions.
  let d = f.unit === "ksh" ? 0 : defaultDecimals(f);
  if (mod === "bn") { v = v / 1e9; d = f.decimals ?? 2; }
  if (mod === "m") { v = v / 1e6; d = 0; }
  if (mod === "k") { v = v / 1e3; d = 0; }
  if (mod === "abs") v = Math.abs(v);
  if (mod === "d0") d = 0;
  if (mod === "d1") d = 1;
  if (mod === "d2") d = 2;
  return group(v, d);
}
