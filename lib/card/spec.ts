/**
 * The export contract every visual shares with its share card (visual upgrade, E1).
 *
 * A visual on the page and the image made from it must never disagree about a number, its tier
 * or its source. So neither formats a figure itself: both name registry ids and resolve them
 * here, through the same `fmt` the prose uses for its {{tokens}}. The page lays the result out
 * one way, `app/api/card/[type]/route.tsx` another; the data, title, labels and source line are
 * the same object.
 *
 * Isomorphic on purpose: the image route runs it on the server, the Save-as-image sheet runs it in
 * the browser to caption its preview.
 */
import { figure, fmt } from "../data/read";
import type { Figure } from "../data/schema";
import type { FormatMod } from "../data/format";

/* ------------------------------------------------------------------------------- formats */

export type CardFormat = "chat" | "status" | "square" | "a4";

/** Pixel sizes. `a4` is A4 at 300 dpi, for printing the operations sheets. */
export const CARD_FORMATS: Record<CardFormat, { w: number; h: number; label: string; hint: string }> = {
  chat: { w: 1080, h: 1350, label: "Chat", hint: "WhatsApp chat, 1080 × 1350" },
  status: { w: 1080, h: 1920, label: "Status", hint: "WhatsApp Status, 1080 × 1920" },
  square: { w: 1080, h: 1080, label: "Square", hint: "Square post, 1080 × 1080" },
  a4: { w: 2480, h: 3508, label: "A4 print", hint: "Printable A4 portrait, 300 dpi" },
};

export const DEFAULT_FORMAT: CardFormat = "chat";

export function isCardFormat(v: unknown): v is CardFormat {
  return typeof v === "string" && v in CARD_FORMATS;
}

/* ------------------------------------------------------------------------------- figures */

const TIER_WORD = { T1: "Tier 1", T2: "Tier 2", T3: "Tier 3" } as const;

/**
 * How sure a figure is, in the words a reader needs: its tier, or that it is calculated, a target,
 * or not yet in hand. Figures carry no status chips on the site (November 2026), so this text goes
 * into the source line and the card caption, never a badge.
 */
export function provenanceOf(f: Figure): string {
  if (f.state === "target") return "target";
  if (f.state === "needed" || f.value === null) return "data needed";
  if (f.state === "modelled") return f.tier ? `calculated from ${TIER_WORD[f.tier]} inputs` : "calculated";
  return f.tier ? TIER_WORD[f.tier] : "untiered";
}

/** A figure as a visual or a card shows it: the printed value, the words around it, its provenance. */
export interface ResolvedFigure {
  id: string;
  /** The number, for drawing. Null for a figure not yet in hand. */
  value: number | null;
  /** Exactly as its {{token}} prints in prose, with any prefix and suffix. */
  display: string;
  label: string;
  provenance: string;
  source: string | null;
  asOf?: string;
  state: Figure["state"];
}

export interface FigureRef {
  id: string;
  label: string;
  mod?: FormatMod;
  prefix?: string;
  suffix?: string;
}

export function resolveFigure(ref: FigureRef): ResolvedFigure {
  const f = figure(ref.id);
  const unitSuffix = ref.suffix ?? (f.unit === "percent" ? "%" : "");
  return {
    id: f.id,
    value: f.value,
    display: f.value === null ? "Data needed" : `${ref.prefix ?? ""}${fmt(ref.id, ref.mod ?? "")}${unitSuffix}`,
    label: ref.label,
    provenance: provenanceOf(f),
    source: f.source,
    asOf: f.asOf,
    state: f.state,
  };
}

/** Year or month of a measurement, as a reader says it: "2026-07" → "July 2026". */
export function asOfText(asOf?: string): string {
  if (!asOf) return "";
  const [y, m] = asOf.split("-");
  if (!m) return y;
  const month = new Date(Date.UTC(Number(y), Number(m) - 1, 1)).toLocaleString("en-GB", { month: "long", timeZone: "UTC" });
  return `${month} ${y}`;
}

/**
 * One source line for a set of figures: each distinct document with its tier and date, then a note
 * for anything calculated or set as a target. Calculated figures name the documents their inputs
 * come from through their own `source` where the registry records one.
 */
export function sourceLine(figs: ResolvedFigure[]): string {
  // Each document once, with EVERY tier its figures carry ("Tier 1 and Tier 3"), so no figure's
  // tier is ever reported as another's. Dates likewise, every one that applies.
  const docs = new Map<string, { tiers: Set<string>; dates: Set<string> }>();
  let calculated = false;
  let targets = false;
  for (const f of figs) {
    if (f.state === "target") { targets = true; continue; }
    if (f.state === "modelled") calculated = true;
    if (!f.source || f.source.startsWith("Derived in")) continue;
    const d = docs.get(f.source) ?? { tiers: new Set<string>(), dates: new Set<string>() };
    if (/^Tier \d$/.test(f.provenance) || f.provenance.startsWith("calculated from")) d.tiers.add(f.provenance);
    const when = asOfText(f.asOf);
    if (when) d.dates.add(when);
    docs.set(f.source, d);
  }
  const parts = [...docs.entries()].map(([name, d]) => {
    const tiers = [...d.tiers].sort();
    const tierText = tiers.length > 1 ? `${tiers.slice(0, -1).join(", ")} and ${tiers[tiers.length - 1]}` : tiers[0] ?? "";
    const meta = [tierText, [...d.dates].join(", ")].filter(Boolean).join(", ");
    return meta ? `${name} · ${meta}` : name;
  });
  if (calculated) parts.push("shares and totals calculated by the site from these sources");
  if (targets) parts.push("targets are the plan's, not results");
  return parts.length ? `Source: ${parts.join("; ")}.` : "";
}

/* ------------------------------------------------------------------------------- the card */

/** The eighteen share-card templates (visual upgrade, E3). */
export type CardType =
  | "big-number" | "stat-grid" | "ward" | "ranked" | "map" | "compare" | "pictogram" | "forecast"
  | "receipt" | "report" | "countdown" | "phone" | "fact" | "progress" | "week" | "roster" | "qr" | "carousel";

/**
 * Which card a visual exports as, and with what view state. Every piece of state lives in `params`,
 * so the card's URL is the shareable, stable address of exactly this view.
 */
export interface CardRef {
  type: CardType;
  params?: Record<string, string | number | undefined>;
}

/** The image URL for a card in a format. Relative, so it works on every deployment. */
export function cardUrl(ref: CardRef, format: CardFormat = DEFAULT_FORMAT): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(ref.params ?? {})) if (v !== undefined && v !== "") q.set(k, String(v));
  if (format !== DEFAULT_FORMAT) q.set("format", format);
  const qs = q.toString();
  return `/api/card/${ref.type}${qs ? `?${qs}` : ""}`;
}
