/**
 * How many voters each channel can reach, and which of those numbers are measured.
 *
 * THE CARE THIS FILE NEEDS is provenance. The connectivity split is read from the registry
 * (lib/data/figures.ts: reach.smartphone, reach.sms-only, reach.nophone, reach.offline), the CA/KNBS
 * 2023/24 rates applied to the July 2026 register, so a refresh of either moves this figure too.
 *
 * The offline channels are not all measured. Only the SMS layer has a reach a source supports: the
 * phone owners who are not online, reach.sms-only. Radio, church, markets, USSD and mobile-money
 * agents were once given reach numbers no source published (420,000 to 180,000; summed they claimed
 * 1.8 million voters in a county of about 600,000). They are now shown as "not measured", with the
 * basis each was argued on kept as context, and they carry no number (consolidation pass, Step 1,
 * docs/consolidation-2026-11/DECISIONS.md D1.1).
 */
import { CA_POLITICAL_MESSAGING_GUIDELINES } from "../../data/sources";
import type { Source } from "../../data/types";
import { regFmt, regPoint } from "./from-registry";
import { COUNTY_REGISTER } from "./register";
import type { FigurePoint, FigureSeries } from "./types";

/** Meta's own audience tool, which is what the platform bands cite. */
export const META_AUDIENCE_INSIGHTS: Source = {
  name: "Meta Audience Insights (platform-reported estimate)",
  publicationDate: "2026",
  tier: 2,
};

/* ------------------------------------------------------------------ the connectivity split */

/**
 * The digital ceiling, and why it is the argument rather than a statistic: every voter reachable
 * online, against the 200,000 benchmark. Both numbers, and the shortfall, are registry reads.
 */
export const REACH_SPLIT: FigureSeries = {
  id: "reach-split",
  headline: `Every voter reachable online in Kitui is about ${regFmt("reach.smartphone")} people, ${regFmt("reach.smartphone.short")} short of the ${regFmt("benchmark")} benchmark`,
  measure: `The July 2026 register split by connectivity, at the CA/KNBS 2023/24 rates: ${regFmt("reach.offline")} offline`,
  points: [
    regPoint("reach.smartphone", "Online: reachable on social and messaging platforms", { note: `${regFmt("ict.internet")}% internet use applied to the July 2026 register. Strategic role: influencer and youth engine.` }),
    regPoint("reach.sms-only", "Phone, not online: reachable by SMS and USSD", { note: `${regFmt("ict.phone")}% phone ownership less ${regFmt("ict.internet")}% internet use. Strategic role: the direct offline layer.` }),
    regPoint("reach.nophone", "No phone: radio, markets and in person", { note: "The remainder of the July 2026 register. Strategic role: decisive ballot delivery, through people and radio." }),
  ],
  note:
    `Offline means the SMS-only and no-phone groups together: ${regFmt("reach.offline")} voters. ` +
    `The 2019 census rate (${regFmt("ict.internet.2019")}% internet use) is superseded by the CA/KNBS 2023/24 rates used here.`,
};

/* ------------------------------------------------------------------ platform sizing */

/**
 * One place that turns a headcount into the register share the document prints.
 *
 * Every share on these two figures is COMPUTED rather than transcribed, which is how C-18 surfaced:
 * §3.1.1.1 [CHECK REF] prints 35,000 as 6.5% in one row and 6.6% in the next. A transcribing figure would have
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
      // C-18: §3.1.1.1 [CHECK REF] prints this low end as 6.5% of the register and the row beneath it prints the
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
      (conflict === "C-18" ? " §3.1.1.1 [CHECK REF] prints this low end as 6.5% — under review, C-18." : ""),
  })),
  conflicts: ["C-18"],
  note:
    "Estimates, not measurements: §3.1.1.1 [CHECK REF] derives them from KNBS 2019 penetration rates and Meta " +
    "Audience Insights. Drawn as bands for that reason. The platforms overlap — one voter may use " +
    "four of them — so these must never be added together.",
};

/* ------------------------------------------------------------------ offline channels */

/**
 * The one offline channel with a reach a source supports: the SMS layer, sized by the phone owners
 * who are not online. The campaign's own list is a target on top of it (target.sms), never larger.
 */
export const OFFLINE_CHANNELS: FigureSeries = {
  id: "offline-channels",
  headline: `Only one offline channel has a measured reach: ${regFmt("reach.sms-only")} voters own a phone but are not online`,
  measure: "Reachable voters per offline channel, where a source supports a number; the rest are not measured",
  points: [
    regPoint("reach.sms-only", "Direct SMS and USSD (phone owners not online)", {
      note: `The ceiling for the SMS layer. The consented list the campaign builds is a target of ${regFmt("target.sms")} by the election.`,
    }),
  ],
  note:
    "THESE CHANNELS OVERLAP AND MUST NOT BE ADDED. One voter listens to radio, attends a market and " +
    "holds a phone. The channels below have no published reach for Kitui; each is shown with the " +
    "basis it was argued on, and with no number.",
};

/** Offline channels with no sourced reach: kept as context, drawn with no number. */
export interface UnmeasuredChannel {
  label: string;
  basis: string;
  role: string;
  /** A source that speaks to the channel's use, though not to its reach in Kitui. */
  source?: Source;
}

export const OFFLINE_UNMEASURED: UnmeasuredChannel[] = [
  { label: "Kikamba vernacular radio", basis: "78–80% daily or weekly listenership, as industry listenership data reports it", role: "Mass persuasion, cultural credibility, policy dissemination and rally build-ups.", source: { name: "GeoPoll / KARF industry listenership data", publicationDate: "2026", tier: 2 } },
  { label: "Church and synod networks", basis: "Weekly attendance", role: "Sunday fellowship greetings, pastoral blessings and clergy alignment." },
  { label: "Open-air market barazas", basis: "Physical foot-fall", role: "Weekly physical interaction, flyer distribution and localised speeches." },
  { label: "USSD interactive service", basis: "Feature-phone users; sessions are counted once the code is live", role: "Zero-rated policy quiz, ward-captain registration and polling-station lookup.", source: CA_POLITICAL_MESSAGING_GUIDELINES },
  { label: "Mobile-money agents (M-Pesa)", basis: "Monthly interactions across 1,800+ M-Pesa kiosks", role: "Word-of-mouth peer network, branded point-of-sale collateral." },
];

/* ------------------------------------------------------------------ §3.6.3 [CHECK REF] the rebalance */

/**
 * Where effort goes, before and after.
 *
 * Shares, not money. The source sentence in §2.7 describes its own weighting as being "on output
 * and targeting", and D-11 records that every figure label in this pass says "effort" rather than
 * "spend" for that reason — hard rule 3 forbids introducing budget material, and these are not it.
 */
export const EFFORT_REBALANCE = [
  {
    label: "Vernacular radio (Musyi, County, Wikwatyo)",
    from: 20,
    to: 37,
    note: "Under-allocated → dominant share. Scaled up to dominate the primary medium, with 78–80% daily or weekly listenership reported.",
  },
  {
    label: "Direct 2G SMS and USSD tree (ward captain field net)",
    from: 10,
    to: 20,
    note: "Under-allocated → high priority. Doubled to build a resilient, direct pipeline to the phone owners who are not online.",
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
    note: "Over-allocated → right-sized. Capped to reflect the digital ceiling plus diaspora mobilisation.",
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
