/**
 * How an attack on the campaign is judged and answered: four severity tiers, one file.
 *
 * Earlier drafts carried two versions of this: a three-level attack ladder (fig-5-7, and the
 * Level 1–3 checklist in the runbooks) and the runbooks' four-tier response decision tree. Both
 * classified an incident by how severe it is and set who answers and how fast, and they disagreed on
 * the clocks. The four-tier tree is the one kept (consolidation pass, Step 1:
 * docs/consolidation-2026-11/DECISIONS.md D1.4). Each tier also carries who drafts and who approves,
 * from the ladder it replaces: the ladder's Level 1 maps to Moderate, Level 2 to High, Level 3 to
 * Critical. Isolated comments, which the ladder answered within four hours, the tree answers by not
 * answering at all; that is the tree's first instruction and it stands.
 *
 * Read by: fig-5-7 (Who approves what, How it works), the response decision tree figure
 * (response-matrix, Risks & response and the runbooks). The operational escalation ladder in How it
 * works (who resolves a logistics, scope or governance issue) is a different thing: it is about
 * decisions inside the campaign, not attacks on it, and it links here.
 *
 * No tier answers by bulk SMS: political bulk SMS is lodged with the operator 48 hours before it is
 * sent (Ground & offline), so it cannot carry a rapid response. The decision tree's "under 2 hours:
 * 2G ward SMS" rung is dropped for that reason (D1.9).
 *
 * Tiers are named, not numbered: "Tier 1" on this site means the strongest kind of evidence.
 */

export interface SeverityTier {
  name: "Negligible" | "Moderate" | "High" | "Critical";
  /** What puts an incident in this tier. */
  threshold: string;
  /** What the campaign does. */
  protocol: string;
  /** How fast, as the runbooks' decision tree sets it. */
  turnaround: string;
  draftedBy: string;
  approvedBy: string;
}

export const SEVERITY_TIERS: SeverityTier[] = [
  {
    name: "Negligible",
    threshold: "Isolated comment or post with under 50 views · fringe blog or anonymous account",
    protocol: "IGNORE / PASSIVE MONITOR — log into the intelligence feed; do NOT amplify or refute",
    turnaround: "No public response · continued observation for velocity changes",
    draftedBy: "—",
    approvedBy: "No approval: nothing is published",
  },
  {
    name: "Moderate",
    threshold: "Rumour active in 3+ ward WhatsApp groups, or one market centre baraza",
    protocol: "CONTAIN AT WARD LEVEL — deploy a 45-second WhatsApp Kikamba voice note and a fact-check card",
    turnaround: "Under 30 minutes: deploy the audio voice note to the affected ward groups",
    draftedBy: "Your team (pre-approved library)",
    approvedBy: "Your team lead, Firefly notified",
  },
  {
    name: "High",
    threshold: "Morning vernacular radio on-air mention; prominent rival press conference; a coordinated attack, or misinformation past 10,000 views",
    protocol: "HIGH-VELOCITY REBUTTAL — authorise a live studio call-in or release a signed media card",
    turnaround: "Under 15 minutes: call-in · under 45 minutes: fact-check infographic on social media",
    draftedBy: "Firefly",
    approvedBy: "Campaign Communications Director",
  },
  {
    name: "Critical",
    threshold: "Coordinated county-wide smear; national TV story; legal or regulatory threat; a false allegation or manipulated or AI-generated media",
    protocol: "EXECUTIVE CRISIS COUNTER — candidate live broadcast, or a constituency lead joint press conference",
    turnaround: "Under 15 minutes: war room · under 1 hour: official press",
    draftedBy: "Firefly",
    approvedBy: "Candidate + senior leadership",
  },
];
