/**
 * What the story draws under each heading besides its text: the tools that work on it, the team's
 * live records and charts that measure it, and the change history. This is where the platform's
 * pages were folded into the chapters (story integration, November 2026); /tools, /workspace,
 * /dashboards and /history stay as full-page views of the same things.
 *
 * Every key is a live heading id (lib/heading-slug.ts); scripts/check-story-embeds.mjs fails the
 * build if one stops existing.
 */
import { TOOL_META, type ToolMeta } from "@/lib/tools/meta";
import { COLLECTION_BY_ID } from "@/lib/platform/collections";

export type PackChart = "voters" | "sectors";

/** The ten working records, each where the work it records is described. */
export const RECORD_HOMES: Record<string, string[]> = {
  "needs-sec-3-7": ["projects"],
  "news-sec-4-4": ["dispatch"],
  "message-sec-10-4": ["tests"],
  "channels-sec-12-6": ["calendar"],
  "engagement-sec-13-4": ["briefs"],
  "engagement-sec-13-5": ["cadence"],
  "workstreams-sec-15-1": ["implementation"],
  "workstreams-sec-15-3": ["field"],
  "success-sec-18-2": ["kpi-actuals"],
  "success-sec-18-5": ["channel-audit"],
};

/** The seven team charts. */
export const CHART_HOMES: Record<string, string[]> = {
  "news-sec-4-4": ["offline"],
  "record-sec-6-5": ["reach"],
  "diagnosis-sec-7-2": ["sentiment"],
  "channels-sec-12-6": ["calendar"],
  "workstreams-sec-15-1": ["implementation"],
  "workstreams-sec-15-3": ["field"],
  "success-sec-18-2": ["kpis"],
};

/** The two data-pack charts from the dashboards page. */
export const PACK_HOMES: Record<string, PackChart[]> = {
  "votes-sec-2-4": ["voters"],
  "needs-sec-3-7": ["sectors"],
};

/** The visuals for the chapters that were mostly text (components/story/Visuals.tsx). */
export type StoryVisual = "proof" | "paradox" | "ask" | "roles" | "languages" | "deliverables" | "phase-now";
export const VISUAL_HOMES: Record<string, StoryVisual[]> = {
  "position-sec-9-1": ["proof"],
  "position-sec-9-2": ["paradox"],
  "ask-sec-23-1": ["ask"],
  "engagement-sec-13-2": ["roles"],
  "channels-sec-12-4": ["languages"],
  "receives-sec-21-2": ["deliverables"],
  "timeline-sec-14-4": ["phase-now"],
};

/** The next Gazette deadline, counted down. */
export const COUNTDOWN_HOMES = ["goal-sec-8-1", "timeline-sec-14-1"];

/** The change history, the data editor and the explorer. */
export const FEED_HOME = "annex-evidence-sec-a-2";

export interface Embeds { tools: ToolMeta[]; records: string[]; charts: string[]; pack: PackChart[]; feed: boolean; countdown: boolean; visuals: StoryVisual[] }

const TOOLS_AT: Record<string, ToolMeta[]> = {};
for (const t of TOOL_META) (TOOLS_AT[t.home] ??= []).push(t);

export function embedsAt(id: string | null): Embeds | null {
  if (!id) return null;
  const e: Embeds = { tools: TOOLS_AT[id] ?? [], records: RECORD_HOMES[id] ?? [], charts: CHART_HOMES[id] ?? [], pack: PACK_HOMES[id] ?? [], feed: id === FEED_HOME, countdown: COUNTDOWN_HOMES.includes(id), visuals: VISUAL_HOMES[id] ?? [] };
  return e.tools.length || e.records.length || e.charts.length || e.pack.length || e.feed || e.countdown || e.visuals.length ? e : null;
}

/** Everything a chapter holds that can be used, not just read: the digest's "Try it here" strip. */
export function chapterHands(tab: string): { id: string; label: string; kind: "tool" | "record"; gesture?: string }[] {
  const out: { id: string; label: string; kind: "tool" | "record"; gesture?: string }[] = [];
  for (const t of TOOL_META) if (t.home.startsWith(`${tab}-sec-`)) out.push({ id: t.home, label: t.title, kind: "tool", gesture: t.gesture });
  for (const [home, recs] of Object.entries(RECORD_HOMES)) if (home.startsWith(`${tab}-sec-`)) for (const r of recs) out.push({ id: home, label: COLLECTION_BY_ID[r]?.label ?? r, kind: "record" });
  return out;
}

export const ALL_EMBED_HOMES = [...new Set([...TOOL_META.map((t) => t.home), ...Object.keys(RECORD_HOMES), ...Object.keys(CHART_HOMES), ...Object.keys(PACK_HOMES), ...COUNTDOWN_HOMES, ...Object.keys(VISUAL_HOMES), FEED_HOME])];
