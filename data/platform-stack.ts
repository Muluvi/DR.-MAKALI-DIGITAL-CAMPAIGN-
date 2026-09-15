import type { PlatformId } from "../components/brand/PlatformLogos";

/**
 * The owned-platform stack: the six platforms §8.1.1 commits the campaign to managing daily,
 * each carried back to the in-county sizing §3.6.1 gives it.
 *
 * Every figure here is quoted from public/content/reach.md §3.6.1 exactly as that table states
 * it — as a range, never as a midpoint, and never rounded to a single headline number. The
 * ranges are KNBS 2019 penetration applied to the register plus Meta Audience Insights, which
 * §3.6.1 marks Tier 1 & Tier 2; they are estimates of *reachable accounts*, not of votes, and
 * §3.6 caps the whole connected tier at ~72,000 voters against a 198,004 winning benchmark.
 *
 * THE META PROBLEM, STATED RATHER THAN SOLVED
 * -------------------------------------------
 * §3.6.1 sizes "Meta (FB/IG)" as one line. Facebook and Instagram are two separate daily
 * management commitments in §8.1.1 but one audience estimate in the evidence base, and there is
 * no basis anywhere in the proposal for splitting it. Both cards therefore carry the same
 * combined figure with `shared: true`, and the panel says so in a footnote. Inventing a split
 * would be the exact failure scripts/verify-figures.mjs exists to catch.
 */
export interface PlatformStackEntry {
  id: PlatformId;
  /** In-county active users, verbatim from the §3.6.1 sizing matrix. */
  reach: string;
  /** Share of the 532,758-voter register, verbatim from the same row. */
  share: string;
  /**
   * The upper bound of `reach` as a number, used only to set the width of the comparison bar.
   * It is the bound the §3.6.1 table states, never a midpoint — the bar is drawn to the most
   * favourable reading of each range so that no platform is visually understated, and the range
   * itself stays printed beside it.
   */
  upper: number;
  /** What the platform is for, condensed from that row's behavioural profile. */
  role: string;
  /** Production format §8.3.2 specifies for this surface, where it specifies one. */
  format: string | null;
  /** True where the figure is the combined Meta line rather than this platform's own. */
  shared?: boolean;
}

export const PLATFORM_STACK: PlatformStackEntry[] = [
  {
    id: "whatsapp",
    reach: "~65,000–80,000",
    share: "12.2% – 15.0%",
    upper: 80_000,
    role: "Primary closed-group organising hub; peer forwards; family and welfare associations.",
    format: "Ward-captain broadcast lists; 45-second voice notes",
  },
  {
    id: "facebook",
    reach: "~50,000–65,000",
    share: "9.4% – 12.2%",
    upper: 65_000,
    role: "Broadest public social network in Kitui; high engagement on political pages and groups.",
    format: "1080x1080 square carousel cards",
    shared: true,
  },
  {
    id: "instagram",
    reach: "~50,000–65,000",
    share: "9.4% – 12.2%",
    upper: 65_000,
    role: "The visual half of the Meta buy; same audience, carousel-led rather than feed-led.",
    format: "1080x1080 square carousel cards",
    shared: true,
  },
  {
    id: "tiktok",
    reach: "~35,000–45,000",
    share: "6.5% – 8.4%",
    upper: 45_000,
    role: "Fastest growing among youth 18–25; high virality for vernacular political comedy.",
    format: "1080x1920 vertical video",
  },
  {
    id: "youtube",
    reach: "~25,000–35,000",
    share: "4.7% – 6.6%",
    upper: 35_000,
    role: "Long-form debates, church sermons and rally livestreams; heavy data-cost limit.",
    format: "1920x1080 horizontal features",
  },
  {
    id: "x",
    reach: "~8,000–12,000",
    share: "1.5% – 2.3%",
    upper: 12_000,
    role: "Journalists, county elites, professionals and national political commentators.",
    format: null,
  },
];

/**
 * §8.1.2's paid surfaces, in the order that section lists them.
 *
 * `platform` is set only where the surface is one of the six branded platforms; Google and
 * retargeting are ad products rather than owned accounts, so they carry no brand tile. No
 * budget, share or allocation appears here: §8.1.2 promises "a monthly allocation matrix based
 * on ward-level registration and engagement data" and the campaign has not set one, so the
 * panel shows the targeting basis it does state and nothing more.
 */
export interface PaidSurface {
  name: string;
  platform: PlatformId | null;
  /** The targeting basis §8.1.2 states for this surface, condensed. */
  basis: string;
}

export const PAID_SURFACES: PaidSurface[] = [
  { name: "Meta ads", platform: "facebook", basis: "Targeted by ward, age, gender and interest" },
  { name: "Google Search & Display", platform: null, basis: "Captures high-intent voters already searching" },
  { name: "YouTube pre-roll", platform: "youtube", basis: "Runs before local and national content" },
  { name: "TikTok ads", platform: "tiktok", basis: "Reaches first-time and younger voters" },
  { name: "Retargeting", platform: null, basis: "Converts engaged users into donors and volunteers" },
];
