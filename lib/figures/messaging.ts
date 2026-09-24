/**
 * §7.1 — the central claim, the three languages it has to survive, and the three pillars under it.
 *
 * WHAT THIS REPLACES. Two box-drawing blocks eleven lines apart: a MESSAGE ARCHITECTURE HIERARCHY
 * drawing the claim over three pillars, and a CENTRAL CAMPAIGN CLAIM & SLOGAN box giving the claim
 * in English, Kikamba and Kiswahili with its primary evidence. They are two halves of one message
 * house, and neither is complete without the other: the hierarchy states the pillars without the
 * translations, the slogan box states the translations without the pillars.
 *
 * WHY THE TRANSLATIONS ARE THE POINT. §4.4.9 forbids machine translation of Kikamba outright and
 * requires a named cultural sign-off for every vernacular line, and §4.4.8 puts 76% of the county's
 * primary reach in Kikamba. A message house that drew the English claim large and left the Kikamba
 * one in a footnote would invert the document's own argument about which version does the work. So
 * all three sit at the same size, in the order the campaign speaks them.
 *
 * NOTHING IS TRANSLATED, SHORTENED OR RE-PUNCTUATED HERE. Every line is the block's, character for
 * character, including the Kikamba orthography. A figure that quietly normalised a vernacular
 * slogan would be doing the exact thing §4.4.9 exists to prevent.
 */
import type { FigureSeries } from "./types";

export type ClaimLine = { language: string; text: string };

/** The central claim, in the three languages §7.1.1 states it in. */
export const CENTRAL_CLAIM: ClaimLine[] = [
  { language: "English", text: "The Proven Economist for Kitui's Economy: Clean Hands, Real Jobs, and Lasting Wealth." },
  { language: "Kikamba", text: "Muvisi wa Mbee wa Utonga na Kazi: Mbee wa Mbee na Wathi Mumo." },
  { language: "Kiswahili", text: "Uchumi Bora na Kazi: Uongozi wa Uwazi na Maendeleo ya Kweli." },
];

/** §7.1.1's primary evidence line, which is what the claim rests on rather than decoration. */
export const CLAIM_EVIDENCE =
  "13-year legislative record as Vice-Chair / Ranking Member of the National Assembly Departmental " +
  "Committee on Finance & National Planning and Public Debt & Privatization.";

export type MessagePillar = {
  /** The hierarchy block's short name for the pillar. */
  short: string;
  /** The subsection heading's full name, and the campaign pillars it carries. */
  full: string;
  carries: string;
  proofPoint: string;
  proofSource: string;
};

export const MESSAGE_PILLARS: MessagePillar[] = [
  {
    short: "Integrity & prudence",
    full: "Fiscal Integrity & Transparent Public Finance",
    carries: "Campaign pillars 2.2.1 and 2.2.4",
    proofPoint: "13 years of clean CDF audit certificates",
    proofSource: "Auditor-General",
  },
  {
    short: "Jobs & wealth",
    full: "Household Economic Empowerment & Agrarian Value Addition",
    carries: "Campaign pillar 2.2.3",
    proofPoint: "Sub-county value-add investment model",
    proofSource: "KNBS census",
  },
  {
    short: "Devolution & water",
    full: "Devolution Equity, Universal Water Access & Healthcare",
    carries: "Campaign pillars 2.2.1 and 2.2.2",
    proofPoint: "Equal ward fund allocation — the Ksh 100M per ward guarantee",
    proofSource: "§7.1 message architecture",
  },
];

export const MESSAGE_HOUSE: FigureSeries = {
  id: "message-house",
  headline: "One claim, three languages, three pillars — and a named proof point under each",
  measure: "§7.1's message architecture and §7.1.1's central claim, drawn as one house",
  points: [],
  note:
    "The three language versions are printed at equal weight because §4.4.8 puts 76% of the " +
    "county's primary reach in Kikamba, and §4.4.9 forbids machine translation of it and requires " +
    "a named cultural sign-off for every vernacular line. Each is transcribed exactly as §7.1.1 " +
    "states it. The pillar names are §7.1's short forms; the full headings and the campaign pillars " +
    "each one carries are printed beneath them.",
};

/* ------------------------------------------------------------------ §4.4.2 counter-fire */

/**
 * The three ground rumours §4.4.2 names, and what the campaign says back.
 *
 * TRANSCRIBED, INCLUDING THE HONEST GAP. The bursary rebuttal ends "Share pending the ledger" —
 * the document declining to claim a proportion it has not verified, in the middle of its own
 * counter-messaging table. That sentence is the most creditable thing in the block and it is kept
 * exactly, rather than tidied into a cleaner-sounding rebuttal.
 */
export const COUNTER_FIRE = [
  {
    rumour:
      "Dr. Mulu is only interested in Kitui Central and will neglect Northern/Southern wards.",
    answers: [
      "FACT: As MP, Dr. Mulu defended equal revenue allocation for all 47 counties and sponsored national water subsidies for ASAL regions (Hansard).",
      "COMMITMENT: Legally binding Ward Equalization Fund guarantee (Ksh 100M/yr).",
    ],
  },
  {
    rumour: "Economists only care about numbers, not the poor.",
    answers: [
      "FACT: 13 years of Kitui Central CDF directed the majority of funds to needy student bursaries — 12,573 recipients, KSh 47m (Tier 1, §4.1.1) — and village boreholes.",
    ],
    note: "Share pending the ledger.",
  },
  {
    rumour: "He is not politically aligned with Kalonzo Musyoka / Azimio.",
    answers: [
      "FACT: Dr. Mulu is a senior founding parliamentary stalwart of the Wiper Democratic Movement, trusted by Party Leader Kalonzo Musyoka on national budget and economic coalition planning.",
    ],
  },
];

export const COUNTER_FIRE_SERIES: FigureSeries = {
  id: "counter-fire",
  headline: "Three ground rumours, and the evidence the campaign answers each with",
  measure: "§4.4.2's rumour-and-rebuttal protocol, paired",
  points: [],
  note:
    "One of the three rebuttals ends “Share pending the ledger” — the document declining to claim " +
    "a proportion it has not verified, inside its own counter-messaging table. It is kept exactly.",
};

/* ------------------------------------------------------------------ §4.4.9 cultural registers */

/**
 * Four technical terms, the literal translation that fails, and the approved Kikamba framing.
 *
 * THE ORTHOGRAPHY IS THE DATA. Every Kikamba string below carries its diacritics exactly as
 * §4.4.9 prints them — ĩ and ũ are distinct letters, not decorated vowels, and §4.4.9's own second
 * rule of engagement forbids machine translation precisely because automated handling destroys
 * this. A figure that normalised them would be the failure the section warns about.
 */
export const CULTURAL_REGISTERS = [
  {
    term: "Fiscal Prudence & Integrity",
    literal: "Kũũsũvĩa mbesa nesa",
    literalWhy: "Too generic / bureaucratic",
    approved: "Kĩtĩo kya Kũthũkũma na Moko Matheũ",
    gloss: "The Honor of Public Service with Clean Hands",
  },
  {
    term: "Household Economic Empowerment",
    literal: "Kũnenga andũ mbesa",
    literalWhy: "Sounds like handouts",
    approved: "Ũtonga wa Mĩsyĩ na Mbũi Mĩĩtĩ",
    gloss: "Sustainable Wealth Rooted in Household Farms",
  },
  {
    term: "Devolution Equity & Ward Equalization",
    literal: "Kũgawanya mbesa sya ward",
    literalWhy: "Mechanical division",
    approved: "Kĩla Kĩtheka na Mwanya Wayo: Mumo kwa Onthe",
    gloss: "Every Ridge its Equal Share: Prosperity for All",
  },
  {
    term: "Youth Technical & Vocational Training",
    literal: "Masomo ma amwanake",
    literalWhy: "Schooling only",
    approved: "Wathi wa Mwanake: Moko ma Kũseũvya Wĩa",
    gloss: "Youth Mastery: Practical Hands that Build Work",
  },
];

export const REGISTERS_SERIES: FigureSeries = {
  id: "cultural-registers",
  headline: "Four terms where the literal translation loses the argument",
  measure: "§4.4.9's proverbial framing protocol — the term, the translation that fails, and the approved idiom",
  points: [],
  note:
    "Every Kikamba string is transcribed with its diacritics exactly as §4.4.9 prints them. ĩ and " +
    "ũ are distinct letters rather than decorated vowels, and §4.4.9's own rules of engagement " +
    "forbid machine translation of Kikamba for this reason.",
};

/* ------------------------------------------------------------------ §4.4.10 the QC gateway */

export const QC_STAGES = [
  {
    title: "English master source drafting",
    steps: [
      "Policy team crafts the core English policy brief, Hansard citation or release.",
      "Verified by the Legal & Economic Lead for empirical accuracy.",
    ],
  },
  {
    title: "Parallel adaptation — not literal translation",
    steps: [
      "Lead Kikamba writer drafts the culturally resonant vernacular version.",
      "Swahili/Sheng specialist drafts the street-smart and market versions.",
    ],
  },
  {
    title: "Reverse-translation integrity audit",
    steps: [
      "An independent reviewer translates the vernacular draft back into English to verify that no policy commitments were distorted, inflated or omitted.",
    ],
  },
  {
    title: "Kikamba cultural sign-off and executive clearance",
    steps: ["Final sign-off by the Campaign Manager before release to audio studio or print."],
    emphasis:
      "Mandatory sign-off authority for Kikamba copy: Lead Cultural & Vernacular Communications Advisor (native Kamba elder / senior vernacular broadcaster).",
  },
];

export const QC_SERIES: FigureSeries = {
  id: "qc-gateway",
  headline: "Four gates between an English draft and a Kikamba broadcast",
  measure: "§4.4.10's translation and quality-control gateway, in order",
  points: [],
  note:
    "Numbered because it is a real sequence: the reverse-translation audit cannot run before the " +
    "adaptation it audits exists, and the cultural sign-off is the last gate before release.",
};
