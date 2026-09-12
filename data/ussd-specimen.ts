// the USSD layer section's USSD menu and the SMS layer section's SMS layer, as data for the feature-phone specimen.
//
// Two rules govern this file, and they are the reason it is data rather than copy inside a
// component.
//
// 1. THE MENU IS QUOTED, NOT WRITTEN. Every line below appears in the USSD layer section exactly as it is
//    printed there, Kikamba and English together, in that order. The document wrote a bilingual
//    menu; the widget shows a bilingual menu.
//
// 2. THE SHORTCODE IS A PLACEHOLDER AND STAYS ONE. the USSD layer section prints `*[Insert shortcode]#`, and
//    Appendix A logs the vendor allocation as an open item owned by the campaign. Inventing a
//    number here would be the exact failure the provenance system exists to prevent, so the
//    widget renders the placeholder with the badge it deserves.
//
// The SMS side follows the production and quality-control pipeline section's four-stage approval chain rather than shipping vernacular copy
// as though it were finished. English is Stage 1 — a master source that can be checked against
// the document. Kikamba and Kiswahili sit at Stage 2, and the chain names exactly who has to
// clear them: a Lead Kikamba Writer drafts, an independent reviewer reverse-translates, and a
// native Kamba elder or senior vernacular broadcaster holds mandatory sign-off. None of those
// people has been appointed — the workstream 4 — Accessibility and inclusion section puts that in Phase −1 — so no Kikamba prose is presented here
// as final, and none is invented to fill the gap.

export type SpecimenLanguage = "kikamba" | "kiswahili" | "english";

export const SPECIMEN_LANGUAGES: { id: SpecimenLanguage; label: string; note: string }[] = [
  { id: "kikamba", label: "Kikamba", note: "Default. The county's first language." },
  { id: "kiswahili", label: "Kiswahili", note: "National language." },
  { id: "english", label: "English", note: "Master source for drafting." },
];

/** the USSD layer section, verbatim. The header line and six options as the document prints them. */
export const USSD_HEADER = "KITUI NA MULU";

export interface UssdOption {
  key: string;
  /** As printed: Kikamba first, English after the slash, where the document gives both. */
  kikamba: string | null;
  english: string;
  /** the workstream 1 — Owned platforms and the service-delivery tracker section's service-delivery tracker is reachable from this option. */
  crossReference?: string;
}

export const USSD_MENU: UssdOption[] = [
  { key: "1", kikamba: "Sisemo sya Mulu", english: "Mulu's plan for my ward" },
  { key: "2", kikamba: "Andikithya kuvota", english: "Voter registration info" },
  { key: "3", kikamba: "Ripoti wia", english: "Report a local issue", crossReference: "the workstream 1 — Owned platforms and the service-delivery tracker section" },
  { key: "4", kikamba: "Kuthukuma", english: "Volunteer" },
  { key: "5", kikamba: "Kwithukiisya", english: "Get updates (opt-in)" },
  { key: "6", kikamba: null, english: "Kiswahili / English" },
];

/** the USSD layer section prints the shortcode as an unresolved placeholder. It stays one. */
export const USSD_SHORTCODE_PLACEHOLDER = "*[Insert shortcode]#";

/**
 * A USSD session is a network round trip, and a menu that appears instantly is the one detail
 * that gives a mockup away. the USSD layer section's own framing is that this works on every phone over 2G.
 */
export const USSD_LATENCY_MS = 1400;

// ---------------------------------------------------------------------------
// The SMS layer — the SMS layer section
// ---------------------------------------------------------------------------

/** the SMS layer section: "Message architecture — 160 characters, three languages, ward-tagged". */
export const SMS_LIMIT = 160;

export type ApprovalStage = 1 | 2 | 3 | 4;

export const APPROVAL_CHAIN: { stage: ApprovalStage; title: string; who: string }[] = [
  { stage: 1, title: "English master source drafting", who: "Policy Team, verified by Legal & Economic Lead" },
  { stage: 2, title: "Parallel adaptation (not literal translation)", who: "Lead Kikamba Writer · Swahili/Sheng Specialist" },
  { stage: 3, title: "Reverse-translation integrity audit", who: "Independent reviewer" },
  { stage: 4, title: "Kikamba cultural sign-off & executive clearance", who: "Lead Cultural & Vernacular Communications Advisor" },
];

export interface SmsSpecimen {
  /** One of the SMS layer section's six message types, named as the table names them. */
  type: string;
  /** the SMS layer section's own description of what that type contains. */
  structure: string;
  frequency: string;
  /**
   * The English master. Written from figures and commitments this document already carries,
   * and counted against the 160-character limit the document sets.
   */
  english: string;
  /**
   * Vernacular versions are null on purpose. the production and quality-control pipeline section requires a named drafter, an independent
   * reverse-translation audit and a native-speaker sign-off before Kikamba copy is released,
   * and the workstream 4 — Accessibility and inclusion section places those appointments in Phase −1. Nothing here fills that in.
   */
  kikamba: null;
  kiswahili: null;
}

export const SMS_SPECIMENS: SmsSpecimen[] = [
  {
    type: "Registration drive",
    structure: "Deadline, nearest centre, what to bring",
    frequency: "Phase-specific",
    english:
      "Kitui: voter registration is open. Bring your national ID to your nearest IEBC centre. Your ward, your vote. Reply STOP to opt out.",
  } as SmsSpecimen,
  {
    type: "Policy drop",
    structure: "One issue, one commitment, one verification promise",
    frequency: "Weekly",
    english:
      "Dr. Mulu: a clean audit record, and every county shilling published where you can check it. Read the record, not the promise. Reply STOP to opt out.",
  } as SmsSpecimen,
  {
    type: "GOTV sequence",
    structure: "Countdown, polling station, time",
    frequency: "Final 30 days",
    english:
      "Voting is tomorrow. Polls open 6am, close 5pm. Find your polling station on your ID slip. Every vote in this ward counts. Reply STOP to opt out.",
  } as SmsSpecimen,
];

/** the SMS layer section's stated unit cost, used to price a send in the panel. */
export const SMS_COST_PER_MESSAGE = { from: 0.25, to: 0.6, unit: "KSh" };
/** the SMS layer section's consented-contact target at Phase 3. */
export const CONSENTED_CONTACTS = 120000;
