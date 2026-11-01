import { SECTIONS, type TabId } from "./heading-slug";

/**
 * The document as one continuous scroll, evidence first (the November 2026 restructure).
 *
 * The cover and the one-screen summary, then six Parts in the campaign-planning order: what Kitui
 * is and needs, the contest and where Dr. Mulu stands, the strategy the evidence justifies, how
 * Firefly delivers it, how it is measured and kept lawful, and the decision. The annexes follow.
 *
 * Section numbers are the document's addressing system. Every id live before this restructure has
 * a generated redirect (lib/anchors/restructure-2026-11.json), so a link already shared still lands
 * on the heading that holds the text it named.
 */
export const FLOW_ORDER: TabId[] = SECTIONS.map((s) => s.id);

/** The six Parts and the annexes, so the reader can feel where they are without a menu. */
export interface FlowAct {
  id: string;
  label: string;
  blurb: string;
  /** The first section of the act — the one that carries the act's full-bleed opener. */
  opensOn: TabId;
}

export const FLOW_ACTS: FlowAct[] = [
  { id: "kitui", label: "Kitui today", blurb: "Who lives here, and what do they need?", opensOn: "kitui" },
  { id: "contest", label: "The contest", blurb: "Who is running, and where does Dr. Mulu stand?", opensOn: "race" },
  { id: "strategy", label: "The strategy", blurb: "What should the campaign do, and why?", opensOn: "goal" },
  { id: "delivery", label: "How Firefly delivers", blurb: "Who does the work, when, and how?", opensOn: "engagement" },
  { id: "proof", label: "Proof and protection", blurb: "How will we know it works, and how is it kept safe and lawful?", opensOn: "success" },
  { id: "decision", label: "The decision", blurb: "What is Dr. Mulu being asked to decide?", opensOn: "receives" },
  { id: "reference", label: "Reference shelf", blurb: "Sources, playbooks, technology, runbooks and the fine print", opensOn: "annex-evidence" },
];

const ACT_BY_OPENER = new Map(FLOW_ACTS.map((a) => [a.opensOn as string, a]));

/** The act a section belongs to — the last act whose opener is at or before it in the flow. */
export function actOf(tabId: TabId): FlowAct {
  let current = FLOW_ACTS[0];
  for (const id of FLOW_ORDER) {
    const opener = ACT_BY_OPENER.get(id);
    if (opener) current = opener;
    if (id === tabId) return current;
  }
  return current;
}

/** True where this section opens a new act, and therefore carries the act's full-bleed marker. */
export function opensAct(tabId: TabId): FlowAct | null {
  return ACT_BY_OPENER.get(tabId) ?? null;
}

const INDEX = new Map(FLOW_ORDER.map((id, i) => [id, i]));

export function flowIndex(tabId: TabId): number {
  return INDEX.get(tabId) ?? 0;
}

export function flowNext(tabId: TabId): TabId | null {
  const i = INDEX.get(tabId);
  return i === undefined || i >= FLOW_ORDER.length - 1 ? null : FLOW_ORDER[i + 1];
}

export const FLOW_LENGTH = FLOW_ORDER.length;

/** SECTIONS, re-sorted into reading order. The metadata is unchanged; only the sequence moves. */
export const FLOW_SECTIONS = FLOW_ORDER.map((id) => SECTIONS.find((s) => s.id === id)!).filter(Boolean);
