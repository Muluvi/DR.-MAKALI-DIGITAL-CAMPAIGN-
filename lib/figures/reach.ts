/**
 * §3C — how many voters each channel can reach, and which of those numbers are sourced.
 *
 * THE CARE THIS FILE NEEDS is not arithmetic, it is provenance. §3.4's figures all descend from
 * one Tier 1 register, so the only way to get them wrong is to add them up wrong. These do not:
 * they range from a census rate (Tier 1) through a platform vendor's audience estimate (Tier 2)
 * to six offline channel reaches the document states with **no source at all** and says so.
 * Drawing all of them the same way would be the single most misleading thing this pass could do.
 *
 * So every point carries its tier and its kind, and the marks read them: an untiered estimate is
 * hatched and labelled "Source needed", a range is drawn as a band rather than a point, and the
 * offline chart carries a standing warning that its channels OVERLAP and must never be summed.
 * Stacked, these six would claim to reach 1.8 million voters in a county of 532,758.
 *
 * NOTHING HERE IS CORRECTED. The figures are transcribed exactly as §3.6 states them, including
 * the ones this audit flags in C-13 and C-17. Hard rule 2: reconciling is Firefly's job.
 */
import { CA_POLITICAL_MESSAGING_GUIDELINES, KNBS_CENSUS_2019 } from "../../data/sources";
import type { Source } from "../../data/types";
import { COUNTY_REGISTER, WINNING_TOTAL_2022 } from "./register";
import type { FigurePoint, FigureSeries } from "./types";

/**
 * The document's own placeholder for a figure it has not sourced.
 *
 * Six of the offline channel reaches — and every platform-sizing band — are stated without a
 * citation. Rather than attach a plausible-looking source, this names the absence, and the marks
 * draw anything carrying it as hatched with "Source needed" on the bar. C-17.
 */
export const UNSOURCED: Source = {
  name: "Stated in §3.6 without a citation — source needed",
  publicationDate: "2026",
  tier: 3,
};

/** What §3.1.2.1 cites for the radio listenership figure — the one offline channel that has one. */
export const GEOPOLL_KARF: Source = {
  name: "GeoPoll / KARF industry listenership data",
  publicationDate: "2026",
  tier: 2,
};

/** Meta's own audience tool, which is what §3.1.1.1 cites for the platform bands. */
export const META_AUDIENCE_INSIGHTS: Source = {
  name: "Meta Audience Insights (platform-reported estimate)",
  publicationDate: "2026",
  tier: 2,
};

/* ------------------------------------------------------------------ §3.6 the split */

/**
 * The digital ceiling, and why it is the argument rather than a statistic.
 *
 * ~72,000 reachable voters against a 198,004 benchmark. §3.6 draws the conclusion itself — "digital
 * channels alone cannot mathematically win this election" — and the shortfall it quotes, 125,549,
 * is computed here rather than transcribed so the figure and the sentence can be compared.
 */
export const DIGITAL_REACH = 72_000;
export const OFFLINE_REACH = 460_000;
export const DIGITAL_SHORTFALL = WINNING_TOTAL_2022 - DIGITAL_REACH;

const censusRate = {
  unit: "voters",
  source: KNBS_CENSUS_2019,
  tier: 1 as const,
  asOf: "2019",
  kind: "calculated" as const,
  granularity: "county" as const,
  // Every figure derived from the 2019 rate inherits C-13: §2.6 states that the 2023/24 Kenya
  // Housing Survey supersedes it, and the rest of the document does not.
  conflicts: ["C-13"],
};

export const REACH_SPLIT: FigureSeries = {
  id: "reach-split",
  headline: `Every internet-connected voter in Kitui is about ${DIGITAL_REACH.toLocaleString("en-KE")} people — ${DIGITAL_SHORTFALL.toLocaleString("en-KE")} short of what won in 2022`,
  measure: `The ${COUNTY_REGISTER.toLocaleString("en-KE")} register split by connectivity, at the 2019 census rate`,
  points: [
    {
      label: "Offline — radio, SMS, markets, in person",
      value: OFFLINE_REACH,
      ...censusRate,
      note: "86.4% of the register. Strategic role: decisive ballot delivery.",
    },
    {
      label: "Digital or connected",
      value: DIGITAL_REACH,
      ...censusRate,
      note: "13.6% of the register. Strategic role: influencer and youth engine.",
    },
  ],
  conflicts: ["C-13"],
  note:
    "§2.6 states that the 2023/24 Kenya Housing Survey supersedes the 2019 rate, putting internet " +
    "use at 26.2% and phone ownership at 44.1% — which would roughly double the connected layer. " +
    "Both rates are stated in the document and neither has been changed.",
};

/* ------------------------------------------------------------------ §3.1.1.1 platform sizing */

/**
 * One place that turns a headcount into the register share the document prints.
 *
 * Every share on these two figures is COMPUTED rather than transcribed, which is how C-18 surfaced:
 * §3.1.1.1 prints 35,000 as 6.5% in one row and 6.6% in the next. A transcribing figure would have
 * reprinted both and nobody would have noticed.
 */
const shareOfRegister = (n: number) => `${((n / COUNTY_REGISTER) * 100).toFixed(1)}%`;

/**
 * Five platforms, each stated as a RANGE.
 *
 * They are ranges in the document and they stay ranges here. Collapsing "~65,000–80,000" to a
 * midpoint would manufacture a precision nobody measured, and it is the estimate most likely to be
 * quoted back at the campaign by someone holding a different one.
 */
export const PLATFORM_SIZING: FigureSeries = {
  id: "platform-sizing",
  headline: "No single platform reaches more than one Kitui voter in seven, and the largest is a closed network",
  measure: `Estimated in-county active users per platform, as a range, against the ${COUNTY_REGISTER.toLocaleString("en-KE")} register`,
  points: (
    [
      ["WhatsApp", 65_000, 80_000, "Primary closed-group organising hub; peer forwards; family and welfare associations.", undefined],
      ["Meta (Facebook / Instagram)", 50_000, 65_000, "Broadest public social network in Kitui; high engagement on political pages and groups.", undefined],
      // C-18: §3.1.1.1 prints this low end as 6.5% of the register and the row beneath it prints the
      // same 35,000 as 6.6%. The share below is computed, so it says 6.6%; the flag says the document
      // says otherwise. Neither number in the content has been changed.
      ["TikTok", 35_000, 45_000, "Fastest growing among youth (18–25); high virality for vernacular political comedy.", "C-18"],
      ["YouTube", 25_000, 35_000, "Long-form debates, church sermons and rally livestreams; heavy data-cost limit.", undefined],
      ["X (Twitter)", 8_000, 12_000, "Journalists, county elites, professionals and national political commentators.", undefined],
    ] as const
  ).map<FigurePoint>(([label, low, high, profile, conflict]) => ({
    label,
    // The value is the low end, NOT a midpoint: where a figure must be a single number, it is the
    // one the document can defend. The band carries the rest and the label prints both ends.
    value: low,
    range: { low, high },
    unit: "users",
    source: META_AUDIENCE_INSIGHTS,
    tier: 2,
    asOf: "2026",
    kind: "modelled",
    granularity: "county",
    conflicts: conflict ? [conflict] : undefined,
    note:
      `${shareOfRegister(low)}–${shareOfRegister(high)} of the register. ${profile}` +
      (conflict === "C-18" ? " §3.1.1.1 prints this low end as 6.5% — under review, C-18." : ""),
  })),
  conflicts: ["C-18"],
  note:
    "Estimates, not measurements: §3.1.1.1 derives them from KNBS 2019 penetration rates and Meta " +
    "Audience Insights. Drawn as bands for that reason. The platforms overlap — one voter may use " +
    "four of them — so these must never be added together.",
};

/* ------------------------------------------------------------------ §3.8.1 offline channels */

/**
 * Six offline channels, three of which the document sources and three of which it does not.
 *
 * The distinction is the whole point of drawing this. Radio, SMS and USSD are the channels the
 * strategy turns on; church, markets and mobile-money agents are stated with no citation, and two
 * of them (church 350k, markets 280k) are larger than the SMS layer the campaign plans to build.
 * A chart that drew all six identically would let an unsourced 350,000 outrank a sourced 320,000.
 */
export const OFFLINE_CHANNELS: FigureSeries = {
  id: "offline-channels",
  headline: "Kikamba radio reaches more Kitui voters than every digital platform combined",
  measure: `Maximum reachable voters per offline channel, against the ${COUNTY_REGISTER.toLocaleString("en-KE")} register`,
  points: (
    [
      ["Kikamba vernacular radio", 420_000, "78–80% daily/weekly listenership", "Mass persuasion, cultural credibility, policy dissemination and rally build-ups.", "geopoll"],
      ["Church and synod networks", 350_000, "Weekly attendance", "Sunday fellowship greetings, pastoral blessings and clergy alignment.", "none"],
      ["Direct 2G SMS (opt-in database)", 320_000, "60%+ of the active register on basic GSM handsets", "Hyper-localised ward updates, endorsement letters and GOTV alerts.", "ca"],
      ["Open-air market barazas", 280_000, "Physical foot-fall", "Weekly physical interaction, flyer distribution and localised speeches.", "none"],
      ["USSD interactive service", 250_000, "Feature-phone users", "Zero-rated policy quiz, ward-captain registration and polling-station lookup.", "ca"],
      ["Mobile-money agents (M-Pesa)", 180_000, "Monthly interactions across 1,800+ M-Pesa kiosks", "Word-of-mouth peer network, branded point-of-sale collateral.", "none"],
    ] as const
  ).map<FigurePoint>(([label, value, basis, role, provenance]) => ({
    label,
    value,
    unit: "voters",
    source:
      provenance === "geopoll" ? GEOPOLL_KARF
      : provenance === "ca" ? CA_POLITICAL_MESSAGING_GUIDELINES
      : UNSOURCED,
    tier: provenance === "none" ? 3 : 2,
    asOf: "2026",
    // `modelled` rather than `official`, so the marks hatch them: none of these six is a
    // measurement of anything. The three unsourced ones additionally say so in their note.
    kind: "modelled",
    granularity: "county",
    conflicts: provenance === "none" ? ["C-17"] : undefined,
    note:
      `${shareOfRegister(value)} of the register · ${basis}. ${role}` +
      (provenance === "none" ? " SOURCE NEEDED — stated in §3.8.1 without a citation." : ""),
  })),
  conflicts: ["C-17"],
  note:
    "THESE CHANNELS OVERLAP AND MUST NOT BE ADDED. One voter listens to radio, attends a market and " +
    "holds a phone. Summed, the six would claim 1,800,000 reachable voters in a county with a " +
    "register of 532,758. Three of them — church, markets and mobile-money agents — are stated in " +
    "§3.8.1 with no source, and the document says so.",
};

/* ------------------------------------------------------------------ §3.6.3 the rebalance */

/**
 * Where effort goes, before and after.
 *
 * Shares, not money. The source sentence in §3.4 describes its own weighting as being "on output
 * and targeting", and D-11 records that every figure label in this pass says "effort" rather than
 * "spend" for that reason — hard rule 3 forbids introducing budget material, and these are not it.
 */
export const EFFORT_REBALANCE = [
  {
    label: "Vernacular radio (Musyi, County, Wikwatyo)",
    from: 20,
    to: 37,
    note: "Under-allocated → dominant share. Scaled up to dominate the primary medium reaching 78%+ of voters daily.",
  },
  {
    label: "Direct 2G SMS and USSD tree (ward captain field net)",
    from: 10,
    to: 20,
    note: "Under-allocated → high priority. Doubled to build a resilient, direct pipeline to 320k feature-phone voters.",
  },
  {
    label: "Market caravans and barazas (PA trucks, collateral)",
    from: 15,
    to: 18,
    note: "Maintained for physical presence and live crowd momentum on market days.",
  },
  {
    label: "Digital and social media (Meta, TikTok, X, YouTube)",
    from: 45,
    to: 18,
    note: "Over-allocated → right-sized. Capped to reflect 13.6% in-county penetration plus diaspora mobilisation.",
  },
  {
    label: "Church and community outreaches (clergy synods, guilds)",
    from: 10,
    to: 7,
    note: "Focused on protocol-compliant clergy partnerships and Sunday tours.",
  },
];

/** Both columns must sum to 100%, or the rebalance is not a reallocation. */
export const REBALANCE_TOTALS = {
  from: EFFORT_REBALANCE.reduce((n, r) => n + r.from, 0),
  to: EFFORT_REBALANCE.reduce((n, r) => n + r.to, 0),
};
