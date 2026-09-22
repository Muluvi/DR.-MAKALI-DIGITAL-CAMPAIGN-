/**
 * §5, §6A and the annexes — the last thirteen box-drawing blocks in the document.
 *
 * WHAT THESE REPLACE. The audience architecture and segment summary, the visit-to-verification
 * loop, the three provenance blocks, both message matrices, the escalation protocol, and the three
 * rapid-response runbooks.
 *
 * THE PROVENANCE BLOCKS ARE THE DOCUMENT'S OWN RULES ABOUT EVIDENCE, and they are the rules this
 * entire audit has been applying. §3.2.3's step 4 — "if unreconciled, report both numbers
 * explicitly side-by-side with their respective sources rather than calculating an artificial
 * average" — is, word for word, what CONFLICTS.md does with all twenty-two entries. Retiring these
 * blocks into figures that state the rules plainly is the closest thing to a self-portrait this
 * pass produces, and the reason they are transcribed rather than paraphrased.
 *
 * THE KIKAMBA IN THE RUNBOOKS IS LOAD-BEARING. §13.1.4's four holding positions each carry a
 * Kikamba framing with full diacritics — ĩ, ũ, w' — and §7.3.2 forbids machine translation of
 * exactly this material. Every string is transcribed character for character.
 *
 * TWO OF THE SOURCE CELLS DECLINE TO CLAIM SOMETHING, and both are kept: §13.1.4's first position
 * says the classroom and bursary counts are pending the inventory and that only §3.3.1's 12,573
 * and KSh 47m should be used until reconciled, and its second says the ward allocation methodology
 * does not exist yet and the line should not go on air before it does.
 */
import type { FigureSeries } from "./types";

/* ------------------------------------------------------------------ §5.0 the audience overview */

export const AUDIENCE_FACETS = [
  { label: "Geographic locus", items: ["Rural: 95.2%", "Urban: 4.8%"] },
  { label: "Age demographic", items: ["Youth (18–35): ~44%", "Mid/senior (36+): 56%"] },
  { label: "Connectivity status", items: ["Offline (2G): 86.4%", "Online (smart): 13.6%"] },
  { label: "Primary language", items: ["Kikamba: ~76% (7.3)", "Kiswahili: ~16%", "English: ~8%"] },
  { label: "Livelihood clusters", items: ["Dryland agrarian", "Pastoral / livestock", "Informal / bodaboda"] },
  { label: "Diaspora matrix", items: ["Nairobi / Mombasa", "Remittance leverage", "Family opinion shapers"] },
];

export const AUDIENCE_SERIES: FigureSeries = {
  id: "audience-overview",
  headline: "Six ways of cutting the same electorate, and two of them decide the channel plan",
  measure: "§5.0's Kitui County audience architecture overview",
  points: [],
  conflicts: ["C-13"],
  note:
    "Connectivity and language are the two facets the rest of the proposal turns on: 86.4% offline " +
    "sets the channel mix, ~76% Kikamba sets the language mix. The 86.4% / 13.6% split is the 2019 " +
    "census rate, which §3.6.1 says the 2023/24 Kenya Housing Survey supersedes — C-13. Neither " +
    "rate has been changed anywhere.",
};

/* ------------------------------------------------------------------ §5.2 the segments */

export const AUDIENCE_SEGMENTS: string[][] = [
  [
    "1. Rural smallholders (agrarian core)",
    "~507,000 (derived) — 95.2% of county",
    "Tier 1 KNBS/IEBC",
    "Kamba radio & offline SMS",
    "Guaranteed minimum returns & sand dams",
  ],
  [
    "2. Agro-pastoralists (arid borderlands)",
    "~80,000–105,000 (requires survey)",
    "Primary research needed",
    "Vernacular radio & market days",
    "Livestock off-take & border security support",
  ],
  [
    "3. Youth cohort (ages 18–35)",
    "~234,000 voters — ~44% of register",
    "Tier 1 KNBS/IEBC",
    "TikTok, Meta, WhatsApp & sports",
    "Youth enterprise fund, TVET grants, no harassment",
  ],
  [
    "4. Urban MSMEs & informal traders",
    "~26,000 (derived) — 4.8% of county",
    "Tier 1 KNBS 2019",
    "Geofenced digital & trader barazas",
    "Single business permit, 24-hour lit market stalls",
  ],
  [
    "5. Formal professionals & civil servants",
    "~25,000–35,000 (requires survey)",
    "Primary research needed",
    "X, TV, LinkedIn, union synods",
    "Meritocracy, reliable medicine & pension flow",
  ],
  [
    "6. Out-of-county Kamba diaspora",
    "150k+ influencers (requires survey)",
    "Primary research needed",
    "Nairobi/coast ads & town halls",
    "Remittance relief & audited fiscal prudence",
  ],
];

export const SEGMENTS_SERIES: FigureSeries = {
  id: "audience-segments",
  headline: "Six segments, and three of them are sized by a survey nobody has run",
  measure: "§5.2's audience segment comparative summary — size, data tier, primary channel and persuasion hook",
  points: [],
  note:
    "The data tier column is the one to read first. Three segments are Tier 1 and sized from the " +
    "census and the register; the other three say “primary research needed” and carry a range " +
    "rather than a number. The ranges are printed as ranges and the gaps as gaps — §11.2.1's " +
    "research programme is what closes them.",
};

/* ------------------------------------------------------------------ §6A.1.4 the visit loop */

export const VISIT_LOOP = [
  { at: "P4", title: "Visit", steps: ["Ward named, photo taken."] },
  { at: "", title: "Commitment logged", steps: ["With a date and a named ward."] },
  { at: "~12 weeks", title: "Elapse", steps: ["The interval between the promise and the check."] },
  {
    at: "P1",
    title: "Verification",
    steps: [
      "Delivered, delayed or not done.",
      "Published either way to the service-delivery tracker (§8.2) — and the result feeds the next visit.",
    ],
  },
];

export const VISIT_SERIES: FigureSeries = {
  id: "visit-loop",
  headline: "Every visit logs a commitment, and twelve weeks later the tracker says what happened to it",
  measure: "§6A.1.4's visit-to-verification loop",
  points: [],
  note:
    "It is a loop: the verification publishes to the tracker whether the commitment was kept or " +
    "not, and that record is what the next visit is measured against. “Published either way” is " +
    "the block's own phrase and the whole of its argument.",
};

/* ------------------------------------------------------------------ §3.2.1 the provenance mandate */

export const PROVENANCE_MANDATE: string[][] = [
  [
    "1. Primary source",
    "Exact institutional publishing entity",
    'e.g. "IEBC Certified Register", "KNBS 2019 Census"',
  ],
  [
    "2. Timestamp date",
    "Exact date or year of survey or official gazettement",
    'e.g. "August 2022", "7 August 2026"',
  ],
  [
    "3. Geographic unit",
    "Exact administrative boundary to which the data applies",
    'e.g. "Countywide", "Mwingi North", "Kyuso Ward"',
  ],
];

export const MANDATE_SERIES: FigureSeries = {
  id: "provenance-mandate",
  headline: "Three things every figure in this document has to carry",
  measure: "§3.2.1's tri-partite provenance mandate",
  points: [],
  note:
    "Source, date and geographic unit. Every figure in this pass carries all three in its " +
    "“View the data” disclosure, which is the document's own rule applied to the document's own " +
    "charts.",
};

/* ------------------------------------------------------------------ §3.2.2 the three tiers */

export const TIER_CLASSIFICATION: string[][] = [
  [
    "Tier 1",
    "Certified official records: IEBC gazetted registers · KNBS census bulletins · Auditor-General reports",
    "Unconditional baseline for all target mathematics, ward quotas, budgets and statutory compliance. Absolute authority.",
  ],
  [
    "Tier 2",
    "Independent field research: reputable public polls · commissioned survey waves · academic demographic data",
    "Directional tracking of candidate popularity, issue salience and message resonance. Used with stated confidence intervals and error bars.",
  ],
  [
    "Tier 3",
    "Internal / unverified intel: single-source field notes · campaign hearsay and rumours · self-reported crowd counts",
    "Hypothesis generation and field lead tracking ONLY. Strictly prohibited from driving financial or resource reallocation without escalation.",
  ],
];

export const TIERS_SERIES: FigureSeries = {
  id: "tier-classification",
  headline: "Three tiers, and only one of them may move money",
  measure: "§3.2.2's three-tier evidential classification — tier, source types, authorised strategic use",
  points: [],
  note:
    "The authorised-use column is what makes the tiers operational rather than descriptive: Tier 3 " +
    "is strictly prohibited from driving financial or resource reallocation without escalation. " +
    "Every figure in this pass carries the tier the section states, and flags disagreement rather " +
    "than resolving it — which is C-8 and C-9.",
};

/* ------------------------------------------------------------------ §3.2.3 conflict resolution */

export const CONFLICT_PROTOCOL = [
  {
    title: "Tier hierarchy test",
    steps: ["Tier 1 always overrides Tier 2; Tier 2 always overrides Tier 3."],
  },
  {
    title: "Methodological audit, for tier-equivalent conflicts",
    steps: [
      "Audit sample sizes, sampling frame (IEBC register vs. random dial), fieldwork dates and non-response bias.",
    ],
  },
  {
    title: "Conservative baseline selection",
    steps: [
      "In electoral modelling, adopt the lower, more demanding performance assumption to prevent operational complacency.",
    ],
  },
  {
    title: "Explicit dual-labelling",
    steps: [
      "If unreconciled, report both numbers explicitly side-by-side with their respective sources rather than calculating an artificial average.",
    ],
    emphasis:
      "This is the rule CONFLICTS.md follows for all twenty-two entries, and the reason no figure in this pass averages a disputed number.",
  },
];

export const PROTOCOL_SERIES: FigureSeries = {
  id: "conflict-protocol",
  headline: "What to do when two sources disagree, in four steps the document wrote for itself",
  measure: "§3.2.3's conflict resolution protocol, in order",
  points: [],
  note:
    "Step 4 is the one this audit has been applying throughout: where the document disagrees with " +
    "itself, both numbers are shown with their sources and neither is averaged away. The steps are " +
    "numbered because they are tried in order — the methodological audit only applies once the " +
    "tier test comes back equal.",
};

/* ------------------------------------------------------------------ §7.1.2 message by segment */

export const MESSAGE_BY_SEGMENT: string[][] = [
  [
    "1. Smallholder crop farmers — 32.8% of electorate, ~175,000 voters",
    '"Never sell Ndengu at Ksh 40 again." · County guaranteed aggregation minimum floor price (Ksh 85/kg) plus local storage · Kikamba: "Uithio wa Ndengu na Mbemba"',
    "KNBS agrarian data: Kitui farmers lose ~68% of value to middlemen during peak harvest · pilot Kitui Central Farmers SACCO",
  ],
  [
    "2. Agro-pastoralists & herders (Mwingi/South) — 14.5%, ~77,000 voters",
    '"Water pans, livestock feed reserves, and border security lighting." · Decentralised veterinary cold-chain · Kikamba: "Kithima kya Kyalo na Syana"',
    "National Drought Management Authority reports: livestock mortality drops 45% with localised water points",
  ],
  [
    "3. Youth hustlers & boda operators (18–35) — 43.9%, ~234,000 voters",
    '"The Youth Innovation & Enterprise Fund: zero-interest equipment loans." · Free driving licences & digital hubs · Kikamba: "Wathi wa Mwanya kwa Mwanake"',
    "Kitui Central NG-CDF data: over 4,200 youth sponsored with NITA/TVET technical bursaries",
  ],
  [
    "4. Rural women, caregivers & chamas — 52.1% of electorate, ~278,000 voters",
    '"Clean water within 1 km and stocked maternity dispensaries in every sub-location." · Ksh 50,000 table-banking seed capital · Kikamba: "Mumo kwa Aka na Syana"',
    "Kitui Central project log: 84 functional solar boreholes built with clean water tariffs · Ksh 120M disbursed to women CBOs",
  ],
  [
    "5. Urban MSMEs, traders & market stall keepers — 18.2%, ~97,000 voters",
    '"Single Business Permit reform and 0% harassment of mama mbogas." · Modern solar market shades & drainage · Kikamba: "Biashara Nzeo na Kazi"',
    "Parliamentary Hansard: Dr. Mulu's defence of MSME tax relief in the Finance Bill 2024 · Kitui Market Vendor Council log",
  ],
  [
    "6. Teachers, civil servants & elite professionals — 8.5%, ~45,000 voters",
    '"Timely county salaries, meritocratic promotions, and NHIF/SHIF hospital cover." · Strict adherence to SRC salary codes',
    "Auditor-General & CRA data: Dr. Mulu's published fiscal blueprints on county debt relief",
  ],
];

export const SEGMENT_MESSAGE_SERIES: FigureSeries = {
  id: "message-by-segment",
  headline: "Six segments, six messages, and a named evidence source behind every one",
  measure: "§7.1.2's message-by-demographic-segment matrix — segment, tailored message and Kikamba framing, verifiable evidence",
  points: [],
  note:
    "The evidence column is not decoration: §8.3.5's approval gateway makes a primary citation " +
    "mandatory at drafting, and this matrix is where each segment's citation is named. The Kikamba " +
    "framings are transcribed exactly, diacritics included.",
};

/* ------------------------------------------------------------------ §7.1.3 message by channel */

export const MESSAGE_BY_CHANNEL: string[][] = [
  [
    "1. Kikamba vernacular radio (Musyi, Mbaitu, Sang'u) — reach ~420,000 voters",
    "45-second testimonials and live studio debates · conversational, authentic, culturally grounded Kikamba with elder idioms",
    "Auditor-General clean audit certificates · concrete CDF school and water case studies, with GPS location names",
  ],
  [
    "2. Direct 2G bulk SMS & USSD — reach ~320,000 voters",
    '160-character hyper-local alerts · "Tseikuru: Dr. Mulu guarantees Ksh 100M Equalization Fund for local water pans"',
    "Specific ward development budget pledge (the Ksh 100M/ward fund) · free USSD code to read the manifesto",
  ],
  [
    "3. Market caravans & barazas — reach ~280,000 voters",
    "High-energy PA speeches and jingles · rhythmic Kikamba music, local merchant endorsements, candidate Q&A",
    "Physical display of project photobooks and contractor logs · live testimony from beneficiaries",
  ],
  [
    "4. WhatsApp & social video (Meta, TikTok, X) — reach ~72,000 voters",
    "30-second TikTok clips and infographic cards · visual, fast-paced, urban Sheng/English highlighting national economic policy",
    "Side-by-side graphical comparison of CDF budgets against county wastage · National Assembly Hansard clips",
  ],
  [
    "5. Church synods & pastoral — reach ~350,000 voters",
    "Reverent 3-minute fellowship speech · biblical stewardship themes (Luke 16:10 — 'Faithful in small, faithful in much')",
    "Values of servant leadership, integrity, non-violent politics and youth moral mentorship",
  ],
];

export const CHANNEL_MESSAGE_SERIES: FigureSeries = {
  id: "message-by-channel",
  headline: "Five channels, each with its own register and its own proof",
  measure: "§7.1.3's message-by-channel matrix — channel and reach, format and linguistic style, evidential proof points",
  points: [],
  note:
    "The reach figures are §3.6.2's and §3.6.1's, restated here per channel: radio ~420,000, SMS " +
    "~320,000, caravans ~280,000, church ~350,000, social ~72,000. They must not be added — the " +
    "channels overlap, as §3.6.2's own warning says.",
};

/* ------------------------------------------------------------------ §12.4 the escalation ladder */

export const ESCALATION_LADDER = [
  {
    title: "Operational resolution — under 1 hour",
    steps: [
      "Issues: logistics delays, vendor equipment failure, routine social rumours.",
      "Resolution authority: the respective functional lead (Comms, Field or Tech).",
      "Rule: the functional lead resolves and logs the incident in the Daily Pulse Report.",
    ],
  },
  {
    title: "Strategic & scope escalation — under 2 hours",
    steps: [
      "Issues: unexpected scope overruns, a competitor attack requiring a major change in media weighting, or a constituency coordinator dispute.",
      "Resolution authority: Campaign Manager & Chief of Operations.",
      "Rule: the Campaign Manager makes a binding operational determination.",
    ],
  },
  {
    title: "Governance, coalition & red-line escalation — under 4 hours",
    steps: [
      "Issues: Wiper Party leadership alignments, major endorsements or defections, litigation and legal threats, or fundamental policy manifesto revisions.",
      "Resolution authority: Dr. Makali Mulu & the Strategic Advisory Board.",
      "Rule: the candidate delivers the final executive directive.",
    ],
  },
];

export const ESCALATION_SERIES: FigureSeries = {
  id: "escalation-ladder",
  headline: "Three levels, three authorities, and the candidate is only in the third",
  measure: "§12.4's three-tier escalation protocol — issues, resolution authority and the rule at each level",
  points: [],
  note:
    "The levels are numbered because escalation is ordered: a level 1 issue that is not resolved " +
    "inside the hour becomes a level 2 issue, and the authority changes with it. Each level names " +
    "who decides and what they must do, which is what makes it a protocol rather than a list.",
};

/* ------------------------------------------------------------------ §13.1.2 the decision matrix */

export const RESPONSE_MATRIX: string[][] = [
  [
    "Level 1: negligible",
    "Isolated comment or post with under 50 views · fringe blog or anonymous account",
    "IGNORE / PASSIVE MONITOR — log into the intelligence feed; do NOT amplify or refute",
    "No public response · continued observation for velocity changes",
  ],
  [
    "Level 2: moderate",
    "Rumour active in 3+ ward WhatsApp groups, or one market centre baraza",
    "CONTAIN AT WARD LEVEL — deploy a 45-second WhatsApp Kikamba voice note and a fact-check card",
    "Under 30 minutes: deploy the audio voice note to the affected ward groups",
  ],
  [
    "Level 3: high",
    "Morning vernacular radio on-air mention; prominent rival press conference",
    "HIGH-VELOCITY REBUTTAL — authorise a live studio call-in or release a signed media card",
    "Under 15 minutes: call-in · under 45 minutes: fact-check infographic on social media",
  ],
  [
    "Level 4: critical",
    "Coordinated county-wide smear; national TV story; legal or regulatory threat",
    "EXECUTIVE CRISIS COUNTER — candidate live broadcast, or a constituency lead joint press conference",
    "Under 15 minutes: war room · under 1 hour: official press · under 2 hours: 2G ward SMS",
  ],
];

export const MATRIX_SERIES: FigureSeries = {
  id: "response-matrix",
  headline: "Four severities, and the first instruction is to do nothing",
  measure: "§13.1.2's rapid response decision matrix — severity, threshold, protocol and turnaround SLA",
  points: [],
  note:
    "Level 1's protocol is IGNORE / PASSIVE MONITOR, with an explicit instruction not to amplify " +
    "or refute. It is the most easily lost line in the runbook and the one that decides whether a " +
    "fringe post stays fringe. The thresholds are stated in advance, which is what makes the " +
    "matrix usable at speed.",
};

/* ------------------------------------------------------------------ §13.1.3 the SLA ladder */

export const RESPONSE_SLA: string[][] = [
  [
    "1. Live vernacular radio (Musyi, Mbaitu, Sang'u)",
    "Under 15 minutes: studio call-in by the authorised campaign spokesperson or lead",
  ],
  [
    "2. WhatsApp community groups (40-ward network)",
    "Under 30 minutes: dispatch of a 45-second debunking Kikamba audio clip by the ward captain",
  ],
  ["3. Digital platforms (X, Meta)", "Under 45 minutes: verified evidence card with a primary document citation"],
  [
    "4. Direct 2G bulk SMS push (targeted wards only)",
    "Under 2 hours: corrective 160-character SMS to registered voters in the affected sub-county",
  ],
  [
    "5. Printed baraza fact sheets",
    "Under 24 hours: overnight print and courier to market centre distribution champions",
  ],
];

export const SLA_SERIES: FigureSeries = {
  id: "response-sla",
  headline: "From fifteen minutes on air to twenty-four hours in print",
  measure: "§13.1.3's rapid response SLA by channel",
  points: [],
  note:
    "The ladder runs from the fastest channel to the slowest, which is also the order a rebuttal " +
    "travels: radio first, then WhatsApp, then digital, then SMS, then print. §8.10.2's 48-hour " +
    "lodging rule is why the SMS rung sits at two hours rather than minutes.",
};

/* ------------------------------------------------------------------ §13.1.4 holding positions */

export const HOLDING_POSITIONS = [
  {
    question: '1. The "term-limit / career politician" question',
    attack: '"He has been in Parliament for three terms (15 years); it is time for new blood."',
    holding:
      '"Service is measured by verifiable results and integrity, not turnover. Dr. Makali Mulu used his 13 years in Parliament to build the top-ranked CDF infrastructure in Kenya, serve as Ranking Member on Finance, and maintain a spotless anti-corruption record."',
    kikamba:
      "Kũthũkũma nĩ wĩtĩkĩlo na wathi mũseo. Nĩ mũthũkũmi mũmanya meko, ũte na kambĩ sya kũya mbesa sya mwananchi.",
    source:
      "National Assembly Hansard; Kitui Central NG-CDF project inventory (84 solar boreholes; classroom and bursary counts pending the inventory — the Tier 1 figure in §3.3.1 and §6.1.1 is 12,573 bursary recipients and KSh 47m, and only that figure should be used until it is reconciled).",
  },
  {
    question: '2. The "northern & southern recognition deficit" question',
    attack:
      '"He is a Kitui Central leader who does not understand the challenges of Mwingi North, Mwingi Central, or Kitui South."',
    holding:
      "\"Kitui's economic challenges—water scarcity, unpaved feeder roads, and broker cartels—do not carry a sub-county boundary. As an economist, Dr. Mulu's 2027 Blueprint establishes a statutory Ksh 100 Million/Ward Annual Equalization Fund ensuring every single ward in Mwingi North and Kitui South receives guaranteed, direct capital investment.\"",
    kikamba:
      "Mwanya wa maendeeo nĩ wa kĩla mũndũ. Mbesa sya Ward Fund syĩithiwa kwa kĩla kĩtheka kũtetheesya mĩsyĩ yonthe ya Kitui ta ĩmwe.",
    source:
      "The ward allocation methodology, once drafted. §8.2 is the delivery tracker and does not carry a schedule; Firefly would build the formula with the campaign before this line is used on air.",
  },
  {
    question: '3. The "Nairobi technocrat" question',
    attack:
      '"He is a bookish technocrat who spends his time in Nairobi committees rather than on the ground with ordinary wananchi."',
    holding:
      "\"Dr. Mulu's presence in Nairobi was spent on the floor of the National Assembly fighting punitive taxes, defending devolved county revenue allocations, and bringing national treasury resources directly home to build schools and water pans across the county.\"",
    kikamba:
      "Nĩwe wĩkalaa mbungene akĩsũngĩĩa mwananchi mbesa itie kũtelemw'a. Meko make me mĩũndanĩ.",
    source:
      "Commission on Revenue Allocation county allocation defences; parliamentary Hansard, Division of Revenue Bills 2017–2024.",
  },
  {
    question: '4. The "county government debt & pending bills collapse" comparison',
    attack: '"All politicians make promises, but once in office, public funds disappear."',
    holding:
      '"Look at the record, not the rhetoric. In 13 years managing public funds in Kitui Central, Dr. Makali Mulu achieved 13 consecutive unqualified clean audit certificates from the Auditor-General. By contrast, Kitui County executive accounts accumulated over Ksh 2.4 Billion in pending bills and audit queries under previous administrations."',
    kikamba:
      "Tala meko, ndũkatale ndeto. Kĩtĩo kya Kũthũkũma nĩ kĩũ kĩtheu kĩte na ũkĩlyo wa ũkũli.",
    source:
      "Office of the Auditor-General certified audit reports 2013–2025; OAG county executive audit reports FY 2021/22 and FY 2022/23.",
  },
];

export const HOLDING_SERIES: FigureSeries = {
  id: "holding-positions",
  headline: "Four attack lines, four answers, and two sources that say the answer is not ready yet",
  measure: "§13.1.4's pre-drafted holding positions — attack line, holding message, Kikamba framing and primary source",
  points: [],
  note:
    "TWO OF THE FOUR SOURCE CELLS DECLINE TO CLAIM SOMETHING, and both are kept exactly. Position 1 " +
    "says the classroom and bursary counts are pending the inventory and that only §3.3.1's 12,573 " +
    "recipients and KSh 47m should be used until reconciled. Position 2 says the ward allocation " +
    "methodology does not exist yet and the line should not go on air before it does. A runbook " +
    "that hid either would be a runbook that sends a spokesperson on air with an unverified figure.",
};
