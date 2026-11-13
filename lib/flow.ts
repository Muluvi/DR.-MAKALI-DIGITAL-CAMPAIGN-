import { SECTIONS, type TabId } from "./heading-slug";

/**
 * The document as one continuous scroll, evidence first (the November 2026 restructure).
 *
 * The cover and the one-screen summary, then six Parts in the campaign-planning order: what Kitui
 * is and needs, the contest and where Dr. Mulu stands, the strategy the evidence justifies, the
 * plan, how it is measured and kept lawful, and the decision. The evidence shelf follows, and then
 * the working platform the team uses (docs/toc-2026-11/RESTRUCTURED-TOC.md).
 *
 * Section numbers are the document's addressing system. Every id live before this restructure has
 * a generated redirect (lib/anchors/restructure-2026-11.json), so a link already shared still lands
 * on the heading that holds the text it named.
 */
export const FLOW_ORDER: TabId[] = SECTIONS.map((s) => s.id);

/** The six Parts, then the evidence shelf and the working platform, so the reader can feel where they are without a menu. */
export interface FlowAct {
  id: string;
  label: string;
  blurb: string;
  /** The first section of the act — the one that carries the act's full-bleed opener. */
  opensOn: TabId;
}

export const FLOW_ACTS: FlowAct[] = [
  { id: "kitui", label: "Kitui today", blurb: "What is true about the county and its voters?", opensOn: "kitui" },
  { id: "contest", label: "His standing", blurb: "Where does Dr. Mulu stand today?", opensOn: "record" },
  { id: "strategy", label: "The strategy", blurb: "What should the campaign do, and why?", opensOn: "goal" },
  { id: "delivery", label: "The plan", blurb: "Who does the work, in what order, and how?", opensOn: "engagement" },
  { id: "proof", label: "Proof and safeguards", blurb: "How would we know it worked, and that it stayed lawful?", opensOn: "success" },
  { id: "decision", label: "The decision", blurb: "What is Dr. Mulu being asked to decide?", opensOn: "platform" },
  { id: "reference", label: "The evidence behind it", blurb: "Where every figure comes from, and the terms it is offered on", opensOn: "annex-evidence" },
  { id: "working", label: "The working platform", blurb: "The playbooks and technology the team works from", opensOn: "annex-playbooks" },
];

/**
 * The acts that follow the argument: the evidence shelf, then the working platform. They carry no
 * part dots, because the six-part argument has ended before them.
 */
export const AFTER_ACTS: ReadonlySet<string> = new Set(["reference", "working"]);
export const isAfterAct = (actId: string | null | undefined): boolean => !!actId && AFTER_ACTS.has(actId);

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
