import { SECTIONS, type TabId } from "./heading-slug";

/**
 * The document as one continuous scroll, decision first.
 *
 * Cover, then the decision, the evidence, the strategy, delivery (the operating model, the four
 * workstream routes and the staffing), measurement and governance, and risks, then the seven
 * annexes. Part 4 is one part across seven routes: a part is a unit of argument and a route is a
 * unit of transfer, and Part 4 is the longest part of the document.
 *
 * Section numbers are the document's addressing system. When the October 2026 restructure
 * renumbered it, every old id was given a generated redirect (lib/anchors/redirects.ts), so a
 * link already shared still lands on the heading that holds the text it named.
 */
export const FLOW_ORDER: TabId[] = [
  // The cover opens the document: who it is for, who prepared it, and one line of terms. The full
  // terms are Annex F.
  "cover",
  // The ask and everything a decision-maker needs to make it, before the argument behind it.
  "decision",
  // The record and what it implies, then what we will therefore do, then how it runs.
  "evidence",
  "strategy",
  "delivery",
  "workstreams-platforms",
  "workstreams-media",
  "workstreams-ground",
  "workstreams-data",
  "staffing",
  "measurement",
  "risks",
  // Reference, after the argument is made.
  "annex-evidence",
  "annex-county",
  "annex-messages",
  "annex-cadence",
  "annex-runbooks",
  "annex-terms",
  "annex-spec",
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
  { id: "decision", label: "The decision", blurb: "What is being asked, what do I get, who does what, and what must I decide or provide?", opensOn: "decision" },
  { id: "evidence", label: "The evidence", blurb: "What does the record show, and why is the plan shaped this way?", opensOn: "evidence" },
  { id: "strategy", label: "The strategy", blurb: "What do we do about it, and why that?", opensOn: "strategy" },
  { id: "delivery", label: "Delivery", blurb: "How is it run, when, by whom?", opensOn: "delivery" },
  { id: "measurement", label: "Measurement and governance", blurb: "How will we know it is working, and how is it kept lawful?", opensOn: "measurement" },
  { id: "risks", label: "Risks and response", blurb: "What could go wrong, and what happens when it does?", opensOn: "risks" },
  { id: "reference", label: "Annexes", blurb: "Method, county reference, the runbooks, terms and specifications", opensOn: "annex-evidence" },
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
