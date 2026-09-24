/**
 * §7.3 — which language reaches which voters, on which channel, and the one rail it cannot use.
 *
 * WHAT THESE FIGURES REPLACE. Three box-drawing blocks stating one language map at three levels of
 * detail: a compressed banner at §7.3, the full matrix at §4.4.8, and a channel-by-channel
 * allocation at §4.4.11. The banner and the matrix are the same table — same three languages, same
 * 76/16/8 shares, same audiences, same channels — so the banner is a summary of the thing eleven
 * lines below it. Rule 1a retires both once a figure carries the fuller one's facts.
 *
 * THE FIGURE'S REAL JOB IS C-21, and it is a compliance conflict rather than a rounding. §4.4.8
 * lists "2G Bulk SMS & USSD" among Kikamba's dominant channels. §5.2.3.3 states, citing the
 * Communications Authority at Tier 1, that bulk political SMS is restricted to English or
 * Kiswahili and that an operator may refuse a non-compliant message outright — and six other
 * places in the document agree with §5.2.3.3, including §4.4.11 in the same subsection, which gives
 * the SMS rail 80% Kiswahili and 20% English and allocates Kikamba none of it.
 *
 * So the Kikamba channel list below is transcribed EXACTLY as §4.4.8 states it, bulk SMS included,
 * and the channel carries the flag. Quietly dropping it would hide the one conflict in this file
 * that could have a message refused by an operator after the campaign had committed a 48-hour
 * lodging lead time. Hard rule 2: Firefly reconciles, this does not.
 */
import type { FigurePoint, FigureSeries } from "./types";
import type { Source } from "../../data/types";

/**
 * §7.3 states the three reach shares with no citation, and they are a language map rather than a
 * measurement — so they are Tier 3 and say so, rather than borrowing the register's authority.
 */
const LANGUAGE_REACH: Source = {
  name: "Stated in §4.4.8 as an estimated primary reach — source needed",
  publicationDate: "2026",
  tier: 3,
};

export type LanguageRow = {
  name: string;
  /** Estimated primary reach, as §4.4.8 states it. */
  share: number;
  audiences: string[];
  channels: string[];
  objective: string;
  conflicts?: string[];
};

export const LANGUAGES: LanguageRow[] = [
  {
    name: "Kikamba",
    share: 76,
    audiences: [
      "Rural smallholder farmers (32.8%)",
      "Women chamas and rural mothers (52.1%)",
      "Village elders and clan leaders",
      "Agro-pastoralists (Mwingi and South)",
    ],
    // Transcribed as §4.4.8 states it. "2G Bulk SMS" is the conflict, not a typo to fix here.
    channels: ["Vernacular radio (Musyi, Wikwatyo)", "2G Bulk SMS & USSD", "Baraza PA addresses", "Megaphone audio clips"],
    objective: "Establish emotional affinity, cultural authenticity and unshakeable community stewardship trust.",
    conflicts: ["C-21"],
  },
  {
    name: "Kiswahili (and Sheng)",
    share: 16,
    audiences: [
      "Urban MSMEs, mama mbogas and traders",
      "Boda boda riders and hustlers (43.9%)",
      "Inter-county commuters and transporters",
      "Semi-urban youth cohorts",
    ],
    channels: ["Market PA sound trucks", "TikTok and Reels video", "WhatsApp group flyers", "Open-air town rallies"],
    objective: "Communicate everyday economic solidarity, commercial dynamism and hustle dignity.",
  },
  {
    name: "English",
    share: 8,
    audiences: [
      "Teachers, doctors and civil servants",
      "National press bureau chiefs",
      "Professional and corporate diaspora",
      "Judicial, EACC and regulatory bodies",
    ],
    channels: [
      "60-page main manifesto",
      "Statutory IEBC filings",
      "LinkedIn and X longform",
      "National TV interviews (Citizen, KTN, NTV)",
    ],
    objective: "Project technocratic competence, statutory legal precision and national economic policy leadership.",
  },
];

export const LANGUAGE_SPLIT: FigureSeries = {
  id: "language-map",
  headline: "Three languages, and three quarters of the county reachable in only one of them",
  measure: "Estimated primary reach per language, as §4.4.8 states it",
  points: LANGUAGES.map<FigurePoint>((l) => ({
    label: l.name,
    value: l.share,
    unit: "%",
    source: LANGUAGE_REACH,
    tier: 3,
    asOf: "2026",
    kind: "modelled",
    granularity: "county",
    note: l.objective,
    conflicts: l.conflicts,
  })),
  conflicts: ["C-21"],
  note:
    "The three shares are stated in §4.4.8 without a citation and sum to 100%, so they are a " +
    "language map rather than a measurement. Kikamba's channel list is transcribed exactly as " +
    "§4.4.8 gives it, including 2G Bulk SMS — which §5.2.3.3 says the Communications Authority " +
    "closes to Kikamba. Neither line has been changed.",
};

/** §4.4.11's channel-by-channel allocation, whose SMS row is the version C-21 points at. */
export type DeploymentRow = {
  medium: string;
  primary: { language: string; share: number };
  secondary: { language: string; share: number }[];
  /** Where §4.4.11 wrote a qualifier in the cell rather than a percentage. */
  note?: string;
  conflicts?: string[];
};

export const LANGUAGE_DEPLOYMENT: DeploymentRow[] = [
  {
    medium: "Vernacular radio spots",
    primary: { language: "Kikamba", share: 100 },
    secondary: [],
    note: "None — zero English or Swahili intrusion on spots.",
  },
  {
    medium: "Direct 2G bulk SMS",
    primary: { language: "Kiswahili", share: 80 },
    secondary: [{ language: "English", share: 20 }],
    note: "Kiswahili rural, English for urban centres and youth boda. Kikamba is allocated none of this rail — which is what §5.2.3.3 requires and §4.4.8 contradicts.",
    conflicts: ["C-21"],
  },
  {
    medium: "USSD menu system",
    primary: { language: "Kikamba", share: 50 },
    secondary: [{ language: "Kiswahili", share: 50 }],
    note: "Toggle via option 0 on the USSD menu. USSD is not restricted — §5.2.3.3 names USSD menu text as a place Kikamba belongs.",
  },
  {
    medium: "Baraza print collateral",
    primary: { language: "Kikamba", share: 70 },
    secondary: [{ language: "Kiswahili and English", share: 30 }],
    note: "Executive summaries in the secondary languages.",
  },
  {
    medium: "Sound PA truck jingles",
    primary: { language: "Kikamba", share: 85 },
    secondary: [{ language: "Swahili / Sheng", share: 15 }],
    note: "The Swahili share is for urban market stops.",
  },
  {
    medium: "TikTok and Reels video",
    primary: { language: "Swahili / Sheng", share: 50 },
    secondary: [
      { language: "English", share: 35 },
      { language: "Kikamba punchlines", share: 15 },
    ],
  },
  {
    medium: "Formal policy manifesto",
    primary: { language: "English", share: 100 },
    secondary: [],
    note: "Abridged 12-page summaries in Kikamba and Swahili.",
  },
];

/** Every row must allocate 100%, or it is not an allocation. Asserted in figures.test.ts. */
export const deploymentTotal = (row: DeploymentRow) =>
  row.primary.share + row.secondary.reduce((n, s) => n + s.share, 0);
