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
 * §8.7.7's four bypass pillars, which §3.7's diagram summarised in four lines and pointed at.
 *
 * The detail is §8.7.7's, not the summary's: it is the canonical statement and the one that
 * carries the operational protocol. The summary's four route names are kept as the labels.
 */
export const BYPASS_PILLARS = [
  {
    label: "Faith-based, diocesan and community radio",
    summary: "Neutral and church-owned stations — Wikwatyo, Mang'elete, County FM",
    detail:
      "Direct media buying and civic issue programming. Highest qualitative credibility among rural women, " +
      "church elders and farming chamas; strictly neutral and immune to commercial political vetoes.",
  },
  {
    label: "Direct 2G bulk SMS and USSD",
    summary: "Zero-rated interactive USSD gateway, to 320,000 voters",
    detail:
      "The 2G SMS engine and the zero-rated USSD gateway via Africa's Talking. Bypasses radio entirely, landing " +
      "160-character localised policy alerts on feature phones within minutes.",
  },
  {
    label: "Mobile PA sound trucks and market caravans",
    summary: "Eight sub-counties, high-density market centres",
    detail:
      "Eight branded sound PA caravans deployed daily across the major market centres — Nguni, Tseikuru, Mutomo, " +
      "Kabati, Migwani, Ikutha. 90-second benga jingles, verified policy addresses and live Q&A to market crowds.",
  },
  {
    label: "Ward captain megaphone and WhatsApp audio",
    summary: "Grassroots baraza audio — pre-loaded megaphones and WhatsApp voice",
    detail:
      "400 ward captains with high-output portable megaphones and pre-loaded USB sticks carrying 45-second Kikamba " +
      "policy tracks, plus Kikamba audio notes dispatched across 180+ local WhatsApp groups.",
  },
];
