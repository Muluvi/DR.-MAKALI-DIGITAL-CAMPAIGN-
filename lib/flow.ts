import { SECTIONS, type TabId } from "./heading-slug";

/**
 * The document as one continuous scroll, in the engagement's own order.
 *
 * Cover, then Objectives, The Data, The Analysis, The Strategy, Implementation and Next Steps,
 * then the seven annexes. Section 5 is one section across six routes: a section is a unit of
 * argument and a route is a unit of transfer, and §5 is the longest part of the document.
 *
 * Section numbers are the document's addressing system. When the 2026 rebuild renumbered it,
 * every old id was given a generated redirect (lib/anchors/redirects.ts), so a link already
 * shared still lands on the heading it named.
 */
export const FLOW_ORDER: TabId[] = [
  // The cover opens the document: who it is for, who prepared it, and one line of terms. The full
  // terms are Annex G.
  "cover",
  // The engagement's own order, which is also the brief's: objectives, then the data, then what
  // the data implies, then what we will therefore do, then how it runs, then the decision.
  "objectives",
  "data",
  "analysis",
  "strategy",
  "implementation",
  "workstreams-platforms",
  "workstreams-media",
  "workstreams-ground",
  "workstreams-data",
  "delivery",
  "nextsteps",
  // Reference, after the offer is made.
  "annex-evidence",
  "annex-county",
  "annex-polls",
  "annex-messages",
  "annex-cadence",
  "annex-runbooks",
  "annex-terms",
];

/** The seven movements of the scroll, so the reader can feel where they are without a menu. */
export interface FlowAct {
  id: string;
  label: string;
  blurb: string;
  /** The first section of the act — the one that carries the act's full-bleed opener. */
  opensOn: TabId;
}

export const FLOW_ACTS: FlowAct[] = [
  { id: "objectives", label: "Objectives", blurb: "What this engagement is for, and how success will be judged", opensOn: "objectives" },
  { id: "data", label: "The Data", blurb: "What the official record shows, graded by source", opensOn: "data" },
  { id: "analysis", label: "The Analysis", blurb: "The winning number, where it lives, and why he isn't yet reaching it", opensOn: "analysis" },
  { id: "strategy", label: "The Strategy", blurb: "Each choice tied to the finding it answers", opensOn: "strategy" },
  { id: "implementation", label: "Implementation", blurb: "Who does what, when, and how it's checked", opensOn: "implementation" },
  { id: "close", label: "Next Steps", blurb: "What the campaign provides, and the decision requested", opensOn: "nextsteps" },
  { id: "reference", label: "Annexes", blurb: "Method, reference, polls for reference only, and terms", opensOn: "annex-evidence" },
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
