// Figures sourced from named external publications rather than from the proposal text.
//
// Why this module exists: appendix.md §B (Source Notes) cites NapoleonCat (May 2026) and
// DataReportal (Digital 2026 Kenya) as the sources for national platform audience data, but the
// table carrying the actual numbers is no longer present in public/content/. Those figures were
// therefore living only inside a component, where nothing could review them and
// scripts/verify-figures.mjs could not distinguish them from invented ones.
//
// Putting them here does three things: it keeps them reviewable in one place alongside their
// citation, it matches the pattern data/sources.ts already establishes, and it lets the figure
// guard treat them as sourced. It does NOT make them Tier 1 — they are third-party platform
// estimates, and the campaign should confirm them against a current NapoleonCat/DataReportal
// pull before any of them is used for ad planning.
//
// OPEN ITEM for the campaign: restore the §2.5 platform-sizing table to the proposal text, or
// confirm these figures should be dropped. Flagged in the audit rather than resolved silently.

import type { Source } from "./types";

export const NAPOLEONCAT_MAY_2026: Source = {
  name: "NapoleonCat — Kenya social media audience estimates",
  url: "https://napoleoncat.com/stats/social-media-users-in-kenya/",
  publicationDate: "2026-05",
  tier: 2,
};

export const DATAREPORTAL_2026: Source = {
  name: "DataReportal — Digital 2026: Kenya",
  url: "https://datareportal.com/reports/digital-2026-kenya",
  publicationDate: "2026",
  tier: 2,
};

export interface PlatformAudience {
  /** Platform name as it appears in ad-buying interfaces. */
  name: string;
  /** Millions of accounts/users. Plotted value. */
  value: number;
  /** Exactly how the source states it, including any range. Never averaged into a midpoint. */
  display: string;
  note: string;
  source: Source;
}

/**
 * National (Kenya-wide) platform sizing, for ad planning only. These are national figures, not
 * Kitui figures — §9A.1 sizes in-county reach separately, and the two must not be confused.
 *
 * WhatsApp is deliberately absent: the source describes it as "effectively universal among
 * connected users" and gives no audience figure, so it is not plotted rather than assigned an
 * invented number.
 */
export const PLATFORM_AUDIENCES: PlatformAudience[] = [
  {
    name: "Facebook",
    value: 23.09,
    display: "23.09m (37.5% of population), May 2026",
    note: "Largest cohort 25–34; 55.2% male.",
    source: NAPOLEONCAT_MAY_2026,
  },
  {
    name: "Messenger",
    value: 20.18,
    display: "20.18m",
    note: "Under-used for direct constituent contact.",
    source: NAPOLEONCAT_MAY_2026,
  },
  {
    name: "TikTok",
    value: 18.4,
    display: "18.4m aged 18+, late 2025",
    note: "Primary first-time-voter channel.",
    source: DATAREPORTAL_2026,
  },
  {
    name: "LinkedIn",
    value: 7.44,
    display: "6.30m–7.44m (range as stated)",
    note: "Professional associations, diaspora. Bar plotted at the upper bound.",
    source: DATAREPORTAL_2026,
  },
  {
    name: "Instagram",
    value: 5.1,
    display: "5.10m",
    note: "Largest cohort 18–24.",
    source: NAPOLEONCAT_MAY_2026,
  },
];
