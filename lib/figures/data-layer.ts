/**
 * §5.2.4.1 and §5.2.4.3 — the data layer, the record it keeps, the law it keeps it under, and the stack.
 *
 * WHAT THESE REPLACE. Six box-drawing blocks: two architecture diagrams joined by ASCII arrows, a
 * supporter record schema, a Data Protection Act checklist, a procurement matrix, and one banner
 * that was a title drawn in characters above the title beneath it.
 *
 * THE SCHEMA IS THE REASON THIS FILE IS CAREFUL. §5.2.4.1's eighteen fields are a specification a
 * developer would implement from: `msisdn_hash` is SHA-256 and `phone_encrypted` is AES-256-GCM,
 * and those are not interchangeable — one is a one-way identifier and the other is reversible for
 * authorised SMS. Every field name, type and constraint below is transcribed exactly, including
 * the enum members and their order, because a schema paraphrased is a schema wrong.
 *
 * THE PROCUREMENT MATRIX STATES NO DECISIONS. All five rows read "Awaiting campaign decision", and
 * they stay that way. The brief forbids inventing anything, and a figure that rendered a pending
 * procurement as settled would be inventing the most consequential kind of thing in this chapter.
 */
import type { FigureSeries } from "./types";

/* ------------------------------------------------------------------ §5.2.4.1 the data layer */

export const DATA_LAYER_TIERS = [
  {
    label: "Ingestion & capture",
    items: ["Offline SMS / USSD", "400 ward captains", "WhatsApp / webforms", "Event registration"],
  },
  {
    label: "Processing & validation",
    items: ["Provenance tagger", "DPA consent engine", "Duplicate scrubber", "Tier classifier (1–3)"],
  },
  {
    label: "Output & channels",
    items: ["Target SMS / IVR", "Geofenced ads", "Polling samples", "Field logistics"],
  },
];

export const DATA_LAYER_CORE = {
  label: "Encrypted core database",
  items: ["Row-level security", "Audit provenance log"],
};

export const DATA_LAYER: FigureSeries = {
  id: "data-layer",
  headline: "Everything captured is tagged, consented and tiered before it reaches a channel",
  measure: "§5.2.4.1's campaign data layer architecture — capture, validation, output, and the core beneath them",
  points: [],
  note:
    "The ASCII original joined these with arrows. Arrows are the part that cannot survive a reflow, " +
    "so the order carries the flow and the line above says in words what the arrows said: capture " +
    "feeds validation, validation feeds the channels, and everything passes through the encrypted core.",
};

/* ------------------------------------------------------------------ §5.2.4.1 the supporter record */

/** §5.2.4.1's SUPPORTER RECORD SCHEMA SPECIFICATION, field for field. */
export const SUPPORTER_SCHEMA: string[][] = [
  ["supporter_id", "UUIDv4", "Unique, anonymised internal primary key"],
  ["msisdn_hash", "SHA-256", "One-way hashed phone identifier"],
  ["phone_encrypted", "AES-256-GCM", "Reversibly encrypted for authorised SMS"],
  ["first_name", "String (35)", "First name (for personalised SMS)"],
  ["last_name", "String (35)", "Last name"],
  ["constituency_id", "Enum (1..8)", "1 of 8 Kitui constituencies"],
  ["ward_id", "Enum (1..40)", "1 of 40 County Assembly wards"],
  ["polling_station", "String (80)", "IEBC polling station name / code"],
  ["age_cohort", "Enum", "18-24 | 25-34 | 35-49 | 50+ | Unknown"],
  ["gender", "Enum", "Male | Female | Unknown"],
  ["livelihood_group", "Enum", "Smallholder | Pastoralist | Bodaboda | MSME Trader | Professional | Student"],
  ["language_pref", "Enum", "Kikamba (default) | Kiswahili | English"],
  ["support_status", "Enum", "Hard Supporter | Soft Supporter | Lean Mulu | Undecided | Opposed | Inactive"],
  ["acquisition_source", "Enum", "SMS_Inbound | Ward_Captain | USSD_Tree | Web_Signup | Town_Hall | WhatsApp_Bot"],
  ["consent_status", "Boolean", "Explicit opt-in confirmation (DPA 2019)"],
  ["consent_timestamp", "ISO-8601", "UTC timestamp of explicit consent"],
  ["consent_channel", "Enum", "SMS_CONFIRM | FORM_CHECKBOX | PAPER_SIGN"],
  ["opt_out_status", "Boolean", "True if user texted STOP / requested deletion"],
  ["data_tier_source", "Enum (1..3)", "Provenance rating of record verification"],
];

export const SUPPORTER_SCHEMA_SERIES: FigureSeries = {
  id: "supporter-schema",
  headline: "Nineteen fields, four of them about consent and one that can never be reversed",
  measure: "§5.2.4.1's supporter record schema — field, type, and the constraint on each",
  points: [],
  note:
    "Transcribed field for field, including the enum members and their order: msisdn_hash is a " +
    "one-way SHA-256 identifier and phone_encrypted is reversible AES-256-GCM for authorised SMS, " +
    "and those are not interchangeable. It is now a real table — searchable, readable in order by " +
    "a screen reader, and wrapping rather than scrolling sideways on a phone.",
};

/* ------------------------------------------------------------------ §5.2.4.1 the DPA applied */

export const DPA_COMPLIANCE = [
  {
    requirement: "1. Lawful basis for processing (Sec 30)",
    implementation: [
      "Explicit, affirmative opt-in consent captured before any voter receives bulk political SMS.",
    ],
  },
  {
    requirement: "2. Purpose limitation (Sec 25)",
    implementation: [
      "Supporter contact details collected for campaign updates will NEVER be sold, shared or repurposed.",
    ],
  },
  {
    requirement: "3. Data minimisation (Sec 25)",
    implementation: [
      "Collect only necessary operational fields; avoid harvesting unnecessary biometric or sensitive data.",
    ],
  },
  {
    requirement: "4. Mandatory opt-out (Sec 34)",
    implementation: [
      'EVERY broadcast message MUST include an immediate, free opt-out mechanism (e.g. "Reply STOP to OptOut").',
    ],
  },
  {
    requirement: "5. Data security & encryption (Sec 41)",
    implementation: [
      "Role-based access control (RBAC), end-to-end encryption (AES-256) and local cloud hosting.",
    ],
  },
  {
    requirement: "6. Right to rectify / erasure (Sec 40)",
    implementation: [
      "Direct automated USSD/SMS command to allow users to request complete deletion of their profile.",
    ],
  },
];

export const DPA_SERIES: FigureSeries = {
  id: "dpa-compliance",
  headline: "Six sections of the Data Protection Act 2019, and what each one obliges the campaign to build",
  measure: "§5.2.4.1's statutory compliance checklist — the legal requirement against the operational implementation",
  points: [],
  note:
    "Each requirement cites its section of the Act. The pairing is the content, so each is drawn " +
    "as one card rather than two columns that could shear apart at a narrow width.",
};

/* ------------------------------------------------------------------ §5.2.4.3 the stack */

export const STACK_TIERS = [
  {
    label: "Tier 1: offline telecom gateway",
    items: ["Africa's Talking / Safaricom", "Dedicated shortcode & USSD", "Two-way inbound/outbound SMS"],
  },
  {
    label: "Tier 2: core supporter CRM",
    items: ["PostgreSQL (AWS/GCP Cape Town)", "AES-256 encrypted PII fields", "RBAC & audit access logging"],
  },
  {
    label: "Tier 3: broadcast & listening",
    items: ["Buffer / Hootsuite Enterprise", "Brand24 / Talkwalker monitor", "Meta Business Suite & TikTok"],
  },
  {
    label: "Tier 4: analytics & ward tracker",
    items: ["Metabase / Apache Superset", "§5.2.1 service-delivery public policy tracker (web)"],
  },
];

export const STACK_SERIES: FigureSeries = {
  id: "tech-stack",
  headline: "Four tiers, and the personal data lives in exactly one of them",
  measure: "§5.2.4.3's campaign technology stack architecture",
  points: [],
  note:
    "Tier 1 collects the phone numbers and tier 2 holds them encrypted; tiers 3 and 4 work on " +
    "public and anonymised data. §5.2.4.3's procurement matrix rates the DPA risk of each " +
    "accordingly, and every one of its five rows is still awaiting a campaign decision.",
};

/* ------------------------------------------------------------------ §5.2.4.3 procurement */

/** §5.2.4.3's matrix. Every decision status reads "Awaiting campaign decision", and stays that way. */
export const PROCUREMENT: string[][] = [
  ["1. SMS/USSD gateway", "Africa's Talking / Safaricom Enterprise", "HIGH RISK (direct PII)", "Awaiting campaign decision"],
  ["2. Supporter CRM database", "PostgreSQL + Hasura (Cape Town region)", "CRITICAL (encrypted PII)", "Awaiting campaign decision"],
  ["3. Social publishing & listening", "Buffer / Hootsuite + Brand24 monitoring", "LOW-MODERATE (public data)", "Awaiting campaign decision"],
  ["4. BI analytics dashboard", "Metabase open source (self-hosted cloud)", "MINIMAL (anonymised)", "Awaiting campaign decision"],
  ["5. Public service tracker (19B)", "Next.js web platform + Cloudflare edge", "LOW RISK (public policy)", "Awaiting campaign decision"],
];

export const PROCUREMENT_SERIES: FigureSeries = {
  id: "procurement-matrix",
  headline: "Five components, rated for data-protection risk, and not one of them decided",
  measure: "§5.2.4.3's technology stack master procurement matrix",
  points: [],
  note:
    "All five rows read “Awaiting campaign decision” in the source and all five read it here. A " +
    "figure that rendered a pending procurement as settled would be inventing the most " +
    "consequential kind of thing in this chapter.",
};
