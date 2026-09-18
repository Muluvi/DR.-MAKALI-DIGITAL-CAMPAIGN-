import { SECTIONS, type TabId } from "./heading-slug";

/**
 * The document as one continuous scroll.
 *
 * The proposal used to be nineteen destinations behind a menu. On a phone that meant the reader's
 * first act was a navigation decision about a document they had not read — and the ask, the
 * evidence and the price sat behind three different taps. It is now one page in one direction:
 * the reader scrolls, and the argument arrives in the order it is built.
 *
 * ORDER IS NOT FILE ORDER. The numbered order is the order a proposal is FILED — cover sheet,
 * confidentiality, summary, analysis, scope, annexes. The order below is the order it is READ
 * when nobody can skip: what is being asked, the short version of why, the evidence, what the
 * evidence implies, what we will therefore do, how it runs, what it costs, what could go wrong,
 * and the ask again at the end where a decision is actually made.
 *
 * Two moves are deliberate:
 *
 *   - §1 (title, confidentiality, how to read this) leaves the front. It is front matter for a
 *     printed document and a closed door on a scrolling one: nobody arrives wanting to read the
 *     terms of a document they have not seen. It keeps its number, its route and every link into
 *     it, and it sits with the annexes as the colophon, where terms belong once the offer is made.
 *   - §2 (executive summary) moves up behind the ask, because a reader who stops after ninety
 *     seconds should still have the whole offer.
 *
 * Nothing is renumbered. Section numbers are the document's own addressing system and 837 deep
 * links depend on them; this is a reading order laid over them, not a replacement for them.
 */
export const FLOW_ORDER: TabId[] = [
  // Act I — the ask
  "decision",
  "summary",
  // Act II — what we know
  "presence",
  "situation",
  "arithmetic",
  "reach",
  // Act III — what it implies
  "objectives",
  "audiences",
  "approach",
  "engine",
  "messaging",
  // Act IV — what we will run
  "scope",
  "scope-platforms",
  "scope-media",
  "scope-ground",
  "scope-data",
  // Act V — how it is delivered and proved
  "roadmap",
  "deliverables",
  "measurement",
  "governance",
  "risk",
  "structure",
  // Act VI — the close
  "assumptions",
  "nextsteps",
  // Act VII — terms and reference
  "cover",
  "annex-evidence",
  "annex-county",
  "annex-messages",
  "annex-cadence",
  "annex-runbooks",
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
  { id: "ask", label: "The ask", blurb: "What is being requested, and by when", opensOn: "decision" },
  { id: "evidence", label: "What we know", blurb: "Your channels, the contest, the number, the reach", opensOn: "presence" },
  { id: "strategy", label: "What it implies", blurb: "Objectives, audiences, the approach and the words", opensOn: "objectives" },
  { id: "work", label: "What we will run", blurb: "Fourteen workstreams, and their boundaries", opensOn: "scope" },
  { id: "delivery", label: "How it is delivered", blurb: "Phasing, deliverables, measurement, governance, risk", opensOn: "roadmap" },
  { id: "close", label: "The close", blurb: "What this needs, and the decision", opensOn: "assumptions" },
  { id: "reference", label: "Terms and reference", blurb: "Confidentiality, method, annexes", opensOn: "cover" },
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
