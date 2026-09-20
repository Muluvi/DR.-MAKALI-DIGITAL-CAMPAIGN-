/**
 * §3.7 and §8.7.7 — who owns the air in Kitui, and the four ways the campaign gets on it anyway.
 *
 * ONE FACT SHAPES THIS WHOLE FILE: §3.7 and §3.7.1 disagree about which stations are hostile, and
 * the disagreement is not cosmetic. §3.7's diagram files **Musyi FM** under "TIER 1: HOSTILE /
 * GATEKEEPER COMMERCIAL STATIONS"; §3.7.1 says Musyi FM is open to the campaign and carries the
 * placement budget; `data/media-ownership.ts` reads "Priority — commercially independent"; and
 * §3.6.3's rebalance scales vernacular radio effort UP into Musyi from 20% to 37%. Athiani FM is
 * the same argument at lower volume — "hostile" in the diagram, "party-sensitive rather than
 * hostile" in the prose. C-20.
 *
 * So the roster below is built from `data/media-ownership.ts`, which §3.7.1 names as the version
 * that governs, and each station carries what §3.7's diagram said about it where the two differ.
 * Picking one and rendering it silently is the single thing this figure must not do: a reader
 * deciding where to spend the placement budget needs to see that the document gives two answers.
 *
 * TWO STATIONS THE DIAGRAM NAMES ARE IN NO OWNERSHIP MAP. Sang'u FM (listed hostile) and
 * Mang'elete (listed as a neutral bypass route) appear in the prose of six chapters and in none of
 * the eight rows of `data/media-ownership.ts`. They are carried here as explicit unknowns rather
 * than dropped, because an omission a reader cannot see is the kind this audit will not produce.
 */
import { RADIO_STATIONS } from "../../data/media-ownership";

export type RosterRow = {
  label: string;
  value: string;
  detail: string;
  section: string;
  stated?: string;
  conflicts?: string[];
};

/** The four stations §3.7's diagram grouped as Tier 1 hostile gatekeepers, in its order. */
const DIAGRAM_HOSTILE = ["Musyi FM", "Mbaitu FM", "Sang'u FM", "Athiani FM"];

/** What §3.7's diagram asserted about every station in that group. */
const DIAGRAM_CLAIM = "Tier 1 hostile / gatekeeper — politically aligned ownership and editorial vetoes";

/**
 * A station the diagram names that the ownership map does not carry.
 *
 * Stated as an absence, with the word "not" in it, because that is the honest rendering. The
 * alternative — leaving the row out — would make the diagram and the figure disagree about how
 * many stations exist, which is a worse failure than admitting a gap.
 */
const NOT_IN_MAP = (name: string, role: string): RosterRow => ({
  label: name,
  value: "Not in the ownership map",
  detail: `${role} No owner, frequency or posture is recorded for it in data/media-ownership.ts, which carries eight stations. It appears in the prose of six chapters.`,
  section: "§3.7",
  stated: DIAGRAM_CLAIM,
  conflicts: ["C-20"],
});

const stationRow = (name: string): RosterRow => {
  const s = RADIO_STATIONS.find((r) => r.name === name);
  if (!s) return NOT_IN_MAP(name, "Named in §3.7's hostile tier.");

  // The diagram and the ownership map agree about a station only when the map's posture is one
  // the campaign does not place into. Ngilu's two stations are monitoring targets on both
  // readings; Musyi and Athiani are not.
  const agrees = /Monitor|As above/.test(s.posture);

  return {
    label: s.name,
    value: s.alignment,
    detail: `${s.frequency ?? "Kitui frequency not published"} · ${s.posture}`,
    section: "§3.7.1",
    stated: agrees ? undefined : DIAGRAM_CLAIM,
    conflicts: agrees ? undefined : ["C-20"],
  };
};

/** §3.7's hostile tier, read against the ownership map §3.7.1 says governs. */
export const RADIO_GATEKEEPERS: RosterRow[] = DIAGRAM_HOSTILE.map(stationRow);

/** The stations §3.7's diagram routed around them to, and what the map says about those. */
export const BYPASS_STATIONS: RosterRow[] = [
  stationRow("Wikwatyo FM"),
  NOT_IN_MAP("Mang'elete", "Named in §3.7 and §8.7.7 as a neutral, church-owned bypass route."),
  stationRow("County FM"),
];

/**
 * §8.7.7's four bypass pillars, at both the levels the document states them.
 *
 * §3.7 named the four routes in four lines and pointed at §8.7.7 for the protocol; §8.7.7 gave the
 * protocol in a table of its own. Both blocks are retired, so both levels live here: `summary` is
 * §3.7's line and `detail` is §8.7.7's cell, transcribed. The §3.7 figure prints the summary and
 * says where the full version is, exactly as the block it replaced did; the §8.7.7 figure prints
 * the protocol. Flattening them into one would either lose §8.7.7's operational detail or move it
 * four chapters earlier than the document puts it.
 */
export const BYPASS_PILLARS = [
  {
    label: "Faith-based, diocesan and community radio",
    summary: "Neutral and church-owned stations \u2014 Wikwatyo, Mang'elete, County FM",
    detail:
      "Direct media buying and civic issue programming on Radio Wikwatyo (Seventh-Day Adventist, Kitui), " +
      "County FM and Mang'elete. These stations hold the highest qualitative credibility among rural women, " +
      "church elders and farming chamas; strictly neutral and immune to commercial political vetoes.",
  },
  {
    label: "Direct 2G bulk SMS and USSD, to 320,000 voters",
    summary: "Zero-rated interactive USSD gateway (*[shortcode]#)",
    detail:
      "Deployment of the 2G SMS Engine (1.5M messages) and the zero-rated USSD gateway (*[shortcode]#) via " +
      "Africa's Talking. Bypasses radio entirely by landing 160-character localised policy alerts directly " +
      "onto voters' feature phones within minutes.",
  },
  {
    label: "8-sub-county mobile PA sound truck and caravan fleet",
    summary: "High-density market centre caravans",
    detail:
      "Daily deployment of 8 branded sound PA caravans across all major market centres \u2014 Nguni, Tseikuru, " +
      "Mutomo, Kabati, Migwani, Ikutha. Broadcasts 90-second benga audio jingles, verified candidate policy " +
      "addresses and live Q&A sessions directly to market crowds.",
  },
  {
    label: "Ward captain megaphone and WhatsApp audio network",
    summary: "Grassroots baraza audio \u2014 pre-loaded megaphones and WhatsApp voice",
    detail:
      "400 ward captains equipped with high-output portable megaphones and pre-loaded USB memory sticks " +
      "containing 45-second Kikamba policy tracks. Direct dispatch of Kikamba audio notes across 180+ local " +
      "WhatsApp groups for organic peer-to-peer sharing among teachers, youth and traders.",
  },
];
