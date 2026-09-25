/**
 * §5.8.11 and §5.9 — what the campaign has to clear, and who is accountable for clearing it.
 *
 * WHAT THESE REPLACE. Six box-drawing blocks: a statutory compliance architecture, an IEBC
 * clearance checklist, a DPA and Election Offences matrix, an org chart, a roles and ownership
 * matrix, and the reporting line between the existing team and Firefly.
 *
 * C-22 IS WHY THE FIRST TWO ARE HERE TOGETHER. §5.8.11 states the nomination endorsement requirement
 * as "500 Registered Voter Nomination Endorsement Signatures per Sub-County" — 4,000 across eight.
 * §5.8.12, fifty lines later, states it as "500 registered voter signatures from at least 5 of the
 * 8 Sub-Counties" — 500 in total. They differ by a factor of eight, and a nomination paper short of
 * the statutory count is rejected. Both are transcribed exactly and both carry the flag; neither
 * figure resolves them, because reading the Elections Act regulation is not a thing a figure should
 * do on Firefly's behalf.
 *
 * §5.8.12's STATUS COLUMN IS THE OTHER THING WORTH KEEPING EXACTLY. Seven clearances, and they are
 * at five different stages: Verified, Pending Filing Window, Active/Current, Scheduled,
 * Operationalized, and one that reads "[Requires Legal Confirmation]". That last one is the
 * document declining to claim a deadline it has not confirmed, and it prints as it stands.
 */
import type { FigureSeries } from "./types";

/* ------------------------------------------------------------------ §5.8.11 the architecture */

export const COMPLIANCE_TIERS = [
  {
    label: "1. IEBC nomination & statutory clearance requirements",
    items: [
      "University degree recognition & Commission for University Education (CUE) clearance",
      "EACC Chapter Six integrity clearance self-declaration",
      "Kenya Revenue Authority (KRA) tax compliance certificate",
      "Directorate of Criminal Investigations (DCI) police clearance certificate",
      "Higher Education Loans Board (HELB) clearance certificate",
      "500 registered voter nomination endorsement signatures per sub-county",
    ],
  },
  {
    label: "2. Data Protection Act (DPA 2019) & telco privacy compliance",
    items: [
      "Lawful basis: explicit opt-in consent for the 2G SMS and USSD registry",
      "Certificate of registration with the Office of the Data Protection Commissioner (ODPC)",
      "100% on-premise encrypted storage (AES-256) within Kenyan borders",
      'Direct "STOP" opt-out mechanism via the Africa\'s Talking API',
    ],
  },
  {
    label: "3. Election Offences Act (EOA 2016) defence & liability matrix",
    items: [
      "Prohibition of bribery, treating and undue influence",
      "Defamation and hate speech quarantine (NCIC / Penal Code compliance)",
      "Strict campaign ad blackout window — 48 hours prior to polling station opening",
    ],
  },
];

export const COMPLIANCE_SERIES: FigureSeries = {
  id: "compliance-architecture",
  headline: "Three statutes, and the first one has a signature count the document gives twice",
  measure: "§5.8.11's statutory compliance architecture",
  points: [],
  conflicts: ["C-22"],
  note:
    "The signature line reads “per sub-county” here — 4,000 across eight — and “from at least 5 " +
    "of the 8 Sub-Counties” in §5.8.12, which is 500 in total. Both are printed as stated. A " +
    "nomination paper short of the statutory count is rejected, so this is C-22 and it has a " +
    "deadline on it.",
};

/* ------------------------------------------------------------------ §5.8.12 the clearances */

export const IEBC_CLEARANCES: string[][] = [
  [
    "1. Academic degree requirement",
    "Bachelor's degree from a recognised university (Article 180(2) and Elections Act s.22). CUE recognition letter.",
    "Verified: Ph.D. in Economics, valid Master's and Bachelor's from the University of Nairobi.",
  ],
  [
    "2. Chapter Six integrity clearance",
    "Self-declaration form cleared by the Ethics and Anti-Corruption Commission (EACC). Zero pending corruption trials.",
    "Pending filing window: formal clearance submitted during the official statutory nomination window.",
  ],
  [
    "3. Tax compliance certificate (TCC)",
    "Valid tax compliance certificate issued by the Kenya Revenue Authority.",
    "Active / current: annual KRA clearance renewed annually.",
  ],
  [
    "4. Police clearance certificate (CID/DCI)",
    "Valid certificate of good conduct from the Directorate of Criminal Investigations.",
    "Scheduled: application to be filed 60 days prior to the IEBC date.",
  ],
  [
    "5. HELB clearance certificate",
    "Certificate of compliance from the Higher Education Loans Board.",
    "Verified: clear record with no outstanding student debt arrears.",
  ],
  [
    "6. Voter nomination endorsement roll",
    "500 registered voter signatures from at least 5 of the 8 sub-counties (Elections Act regulations).",
    "Operationalized: Field Ops registering 250 signatures per ward — a 10,000 total buffer roll.",
  ],
  [
    "7. Party nomination / direct ticket seal",
    "Certificate of nomination issued by the Wiper Patriotic Front NEC/NEB.",
    "[Requires legal confirmation]: exact internal party dispute filing timelines and gazette deadlines.",
  ],
];

export const CLEARANCE_SERIES: FigureSeries = {
  id: "iebc-clearance",
  headline: "Seven clearances at five different stages, and one the campaign will not yet claim",
  measure: "§5.8.12's IEBC statutory nomination clearance checklist — dimension, statutory standard, current status",
  points: [],
  conflicts: ["C-22"],
  note:
    "The status column is the point: two Verified, one Active, one Scheduled, one Pending the " +
    "filing window, one Operationalized — and one that reads “[Requires legal confirmation]”, " +
    "the document declining to claim a deadline it has not confirmed. Row 6's signature count " +
    "disagrees with §5.8.11's by a factor of eight: C-22.",
};

/* ------------------------------------------------------------------ §5.8.13 the liability matrix */

export const LIABILITY_MATRIX: string[][] = [
  [
    "1. Data Protection Act (DPA 2019) compliance",
    "Unlawful processing of personal voter phone numbers carries fines up to Ksh 5,000,000 or 2 years jail.",
    'Campaign registered with the ODPC as a Data Controller; all voter phone numbers sourced via opt-in barazas; mandatory "STOP" SMS opt-out.',
  ],
  [
    "2. Election Offences Act (EOA 2016) — bribery",
    "Voter bribery, distribution of cash or free merchandise at rallies is an electoral offence causing candidate disqualification and 5-year jail.",
    "Strict prohibition of direct cash handouts at rallies; all logistics payments to agents made via audited M-Pesa bulk business disbursements.",
  ],
  [
    "3. 48-hour campaign blackout window",
    "All campaign advertising, broadcasts and public rallies must cease 48 hours prior to polling station opening.",
    "All radio spots, SMS engines and sound caravans terminate exactly at 18:00 EAT on the 2nd day prior to polling day.",
  ],
];

export const LIABILITY_SERIES: FigureSeries = {
  id: "liability-matrix",
  headline: "Three exposures, and two of them end in a custodial sentence",
  measure: "§5.8.13's DPA 2019 and Election Offences statutory matrix — obligation, exposure, mitigation",
  points: [],
  note:
    "The exposure column carries the penalty as the document states it — Ksh 5,000,000 or two " +
    "years, and disqualification plus five years — because a mitigation protocol read without its " +
    "exposure is a procedure rather than a reason.",
};

/* ------------------------------------------------------------------ §5.9 the org chart */

export const ORG_CHAIN = [
  { role: "Dr. Makali Mulu (candidate) & strategic advisory board" },
  { role: "Campaign Manager & Chief of Operations (lead operator)" },
];

export const ORG_BRANCHES = [
  {
    label: "Communications & media lead",
    items: ["Kikamba audio production", "Video crews", "Graphic design", "Radio buying"],
  },
  {
    label: "Field ops & logistics lead",
    items: ["PA sound rig crews", "Tent / staging providers", "Fuel / transport"],
  },
  {
    label: "Data, tech & compliance lead",
    items: ["SMS/USSD development (Africa's Talking)", "Cloud host", "DPA legal"],
  },
];

export const ORG_SERIES: FigureSeries = {
  id: "org-chart",
  headline: "A lean core of three leads, each directing subcontracted specialists",
  measure: "§5.9's lean core plus specialist vendor model",
  points: [],
  note:
    "The three leads report to the Campaign Manager and the specialists are subcontracted, not " +
    "hired. No role or headcount has been added: this is exactly the set the block named.",
};

/* ------------------------------------------------------------------ §5.9.4 roles and ownership */

export const ROLE_OWNERSHIP: string[][] = [
  [
    "1. Campaign Manager & Chief of Operations",
    "Overall campaign execution, budget allocation, strategic schedule and coalition alignment · direct liaison with Dr. Mulu and the advisory board · primary escalation authority for all domains",
    "General logistics vendors · security coordination firm",
  ],
  [
    "2. Communications & Media Lead",
    "Narrative framing, press relations, crisis communications and message discipline · vernacular radio interview briefing notes and the social media publishing calendar",
    "Vernacular audio studio · video production crew · digital ad buying agency · vernacular radio media buyer",
  ],
  [
    "3. Field Operations & Ground Logistics Lead",
    "Operational leadership of 8 constituency leads and 40 ward coordinators · market day caravan routes, baraza scheduling and volunteer deployment logistics",
    "Sound truck & PA rig rentals · event staging & marquee company · boda boda stage champions · transport & fuel fleet SACCOs",
  ],
  [
    "4. Data, Technology & Compliance Lead (DPO)",
    "Management of the CRM database, analytics BI dashboards and voter registration targets · statutory compliance with DPA 2019, consent logging and cyber incident management",
    "SMS/USSD gateway vendor (selected at contracting) · cloud infrastructure · legal data protection counsel",
  ],
];

export const ROLES_SERIES: FigureSeries = {
  id: "role-ownership",
  headline: "Four core roles, and every specialist in the campaign reports through one of them",
  measure: "§5.9.4's core campaign roles and ownership matrix — role, ownership, subcontractors directed",
  points: [],
  note:
    "No role, headcount or vendor has been added. The SMS/USSD gateway vendor is stated as " +
    "“selected at contracting”, which is the same pending state §5.2.4.3's procurement matrix " +
    "records for every one of its five rows.",
};

/* ------------------------------------------------------------------ §5.9.5 the reporting line */

export const REPORTING_TEAMS = [
  {
    label: "Your team (existing)",
    items: ["Team lead / publisher", "Content producers", "Kikamba producer", "Community responders"],
  },
  { label: "Firefly (three people)", items: ["Strategy Director", "Analyst", "Offline-layer operator"] },
];

export const REPORTING_CHAIN = [
  { role: "Campaign counterpart (one named person)", note: "Both teams meet here, through the weekly brief." },
  { role: "Campaign Manager" },
  { role: "Dr. Makali Mulu" },
];

export const REPORTING_SERIES: FigureSeries = {
  id: "reporting-lines",
  headline: "Two teams, one weekly brief, and a single named counterpart between them and the candidate",
  measure: "§5.9.5's reporting lines",
  points: [],
  note:
    "The weekly brief is the join: the existing team and Firefly's three people meet there, and " +
    "one named counterpart carries it upward. Firefly is three people and the block says so.",
};
