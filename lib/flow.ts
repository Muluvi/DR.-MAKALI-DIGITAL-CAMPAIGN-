import { SECTIONS, type TabId } from "./heading-slug";

/**
 * The site as one continuous story (the flow pass, November 2026, docs/flow-2026-11/FLOW-PLAN.md):
 * the Welcome, then Data, Analysis, Objectives, Strategies and Implementation, in that order. The
 * evidence shelf follows the story.
 *
 * Section numbers are the document's addressing system and stay in the ids, never on screen. Every
 * id that moved chapter has a generated redirect (lib/anchors/flow-2026-11.json), so a link already
 * shared still lands on the heading that holds the text it named.
 */
export const FLOW_ORDER: TabId[] = SECTIONS.map((s) => s.id);

/** The five stages after the Welcome, then the evidence shelf, so the reader can feel where they are without a menu. */
export interface FlowAct {
  id: string;
  label: string;
  blurb: string;
  /** The first section of the act — the one that carries the act's full-bleed opener. */
  opensOn: TabId;
}

/**
 * The Welcome has no act: its chapters are part 0 and render without an opener. Act ids are internal
 * (not heading ids). The blurbs are Firefly's approved wording (FLOW-PLAN.md section 10, Q6).
 */
export const FLOW_ACTS: FlowAct[] = [
  { id: "data", label: "Data", blurb: "What is true about Kitui, its voters and Dr. Mulu?", opensOn: "kitui" },
  { id: "analysis", label: "Analysis", blurb: "What does the data mean for the race?", opensOn: "diagnosis" },
  { id: "objectives", label: "Objectives", blurb: "What must the campaign achieve?", opensOn: "goal" },
  { id: "strategies", label: "Strategies", blurb: "How will it achieve it?", opensOn: "position" },
  { id: "implementation", label: "Implementation", blurb: "Who does what, when, and how it is measured", opensOn: "engagement" },
  { id: "reference", label: "The evidence behind it", blurb: "Where every figure comes from, and the terms", opensOn: "annex-evidence" },
];

/**
 * The act that follows the story: the evidence shelf. It carries no stage dots, because the story
 * has ended before it.
 */
export const AFTER_ACTS: ReadonlySet<string> = new Set(["reference"]);
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
