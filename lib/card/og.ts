/**
 * The share preview for each tool page (visual upgrade, E5): the card a pasted link shows in
 * WhatsApp. Square, because WhatsApp crops a link preview towards a square.
 */
import { TOOL_WARDS } from "../tools/dataset";
import { cardUrl, type CardRef } from "./spec";

const LARGEST = [...TOOL_WARDS].sort((a, b) => b.voters - a.voters);

const TOOL_CARDS: Record<string, CardRef> = {
  "winning-number": { type: "big-number", params: { view: "winning" } },
  "coalition-path": { type: "big-number", params: { view: "winning" } },
  assumptions: { type: "big-number", params: { view: "winning" } },
  "pareto-wards": { type: "ranked", params: { measure: "voters" } },
  "register-growth": { type: "stat-grid", params: { set: "county" } },
  "map-studio": { type: "map", params: { layer: "voters" } },
  "zone-effort": { type: "map", params: { layer: "zones" } },
  "drought-watch": { type: "forecast" },
  "county-money": { type: "receipt" },
  "ward-equity": { type: "ranked", params: { measure: "per1k" } },
  "channel-mix": { type: "pictogram", params: { set: "offline" } },
  "offline-waterline": { type: "pictogram", params: { set: "offline" } },
  "fact-cards": { type: "fact", params: { id: "register.2022" } },
  radio: { type: "week", params: { set: "radio" } },
  calendar: { type: "week", params: { set: "calendar" } },
  "race-calendar": { type: "countdown" },
  "voter-density": { type: "roster", params: { set: "density" } },
  "polling-agents": { type: "roster", params: { set: "agents", per: 2 } },
  kpis: { type: "progress", params: { set: "kpis" } },
  "nomination-path": { type: "progress" },
  "constituency-scorecard": { type: "carousel", params: { i: 1 } },
  "ward-compare": { type: "compare", params: { wards: LARGEST.slice(0, 2).map((w) => w.id).join(",") } },
  links: { type: "qr", params: { ward: LARGEST[0].id } },
  "message-studio": { type: "stat-grid", params: { set: "news" } },
  "message-matrix": { type: "stat-grid", params: { set: "news" } },
  "ward-dossier": { type: "ranked", params: { measure: "voters" } },
};

export function toolOgImage(slug: string): string {
  return cardUrl(TOOL_CARDS[slug] ?? { type: "stat-grid", params: { set: "county" } }, "square");
}

export function wardOgImage(code: string): string {
  return cardUrl({ type: "ward", params: { ward: code } }, "square");
}
