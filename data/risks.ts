/**
 * The risk register: the six risks that decide whether the plan survives contact, one file.
 *
 * Read by: fig-5-8 (Risks & response). The prose in Risks & response discusses R1, R2 and R6 by
 * code, and its "six risks" is checked against this list's length (consolidation pass, Step 6).
 * The runbooks' threat model is a different list: what an attacker may do, not what may go wrong
 * with the plan.
 *
 * To edit: change a row here. Likelihood and impact are 1 (low / moderate) to 3 (high / severe).
 */

export interface Risk {
  code: string;
  label: string;
  likelihood: 1 | 2 | 3;
  impact: 1 | 2 | 3;
  owner: string;
  why: string;
  mitigation: string;
}

export const RISKS: Risk[] = [
  { code: "R1", label: "Nomination decided by delegates, not the reported countywide selection", likelihood: 2, impact: 3, owner: "Firefly Director + campaign", why: "The reported selection method is Tier 3 and unconfirmed; the targeting model changes wholesale", mitigation: "Section 5.4's delegate whip contingency; Section 5.2 names the party documents that would close this" },
  { code: "R2", label: "The recognition hypothesis is wrong", likelihood: 2, impact: 3, owner: "Head of Research", why: "The deficit may be about perceived distance, not unfamiliarity; the Phase −1 channel mix is built on it", mitigation: "Tested in Week 1 by the presence audit, and against the IEBC ward-level results once in hand, before anything is committed against it" },
  { code: "R3", label: "Data-protection reviewer not appointed in time", likelihood: 2, impact: 2, owner: "Campaign", why: "The long-lead appointment; gates the voter-file work and the mass SMS layer", mitigation: "Section 19.2's compliance gate; named as a gating dependency in Section 22.2" },
  { code: "R4", label: "ODPC guidance prohibits the SMS approach", likelihood: 1, impact: 2, owner: "Campaign Legal Director", why: "The political-campaigning circular could not be retrieved; Workstream 9 is the layer the race turns on", mitigation: "Section 19.5's three mandatory actions, before Phase −1 broadcasting" },
  { code: "R5", label: "Manipulated-media attack in the nomination window", likelihood: 2, impact: 2, owner: "Digital Director", why: "A compressed window leaves no time to recover", mitigation: "Section 20.4's protocol; hardware-key 2FA from day one" },
  { code: "R6", label: "The brief and the team's judgement disagree", likelihood: 3, impact: 2, owner: "Firefly Director + team lead", why: "It will happen, and should: moderate if handled, severe if suppressed", mitigation: "The brief states intent and the rule, never the caption; overrides are logged and read monthly as data, not as non-compliance" },
];
