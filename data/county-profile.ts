// The county's own dimensions, as one canonical store.
//
// These four figures are the ones the chrome quotes most often — the hero strip, the dock, the
// index sheet — and before this module each was typed where it was drawn. That is how the
// header came to carry "1.3M+ Population Outreach" against a document whose §2.2 states
// 1,136,187 residents on the 2019 census, with the 2024 projection at approximately 1.2m and
// explicitly tiered lower. A rounded-up figure in the chrome is the one place a sceptical
// reader checks first, so the chrome now reads from the same place the body does.
//
// Every value below is quoted from public/content, with the tier the document itself assigns.
import type { SourcedFigure } from "./types";
import { KNBS_CENSUS_2019 } from "./sources";
import { COUNTY_TOTAL_WARDS, TOTAL_WARDS, CONSTITUENCIES } from "./ward-register";

export const COUNTY_POPULATION: SourcedFigure = {
  label: "Kitui County resident population",
  value: 1_136_187,
  unit: "residents",
  provenance: {
    source: KNBS_CENSUS_2019,
    granularity: "county",
    note:
      "549,003 males, 587,151 females, 33 intersex (§2.2). The 2024 projection of approximately " +
      "1.2 million is Tier 2 and is not used in the chrome.",
  },
};

export const COUNTY_WOMEN: SourcedFigure = {
  label: "Women resident in Kitui County",
  value: 587_151,
  unit: "residents",
  provenance: {
    source: KNBS_CENSUS_2019,
    granularity: "county",
    note: "51.7% of the resident population. The register is not published by sex (§9.1.1).",
  },
};

/**
 * The denominator of the 13.6% is the population aged 3 and above, not the whole county.
 *
 * §2.2 states it that way and the arithmetic only works that way: 143,340 / 1,053,991 = 13.6%,
 * where 143,340 / 1,136,187 would be 12.6%. §4.3.1 had quoted the whole-county denominator
 * against the aged-3+ percentage, which is the one sum in the document a reader can check in
 * their head. Both figures are kept here so the base can never be dropped again.
 */
export const INTERNET_USE_BASE: SourcedFigure = {
  label: "Kitui residents aged 3 and above",
  value: 1_053_991,
  unit: "residents",
  provenance: {
    source: KNBS_CENSUS_2019,
    granularity: "county",
    note: "The census reports internet use for this population, not for all residents (§2.2).",
  },
};

export const INTERNET_USERS: SourcedFigure = {
  label: "Kitui residents using the internet",
  value: 143_340,
  unit: "residents aged 3+",
  provenance: {
    source: KNBS_CENSUS_2019,
    granularity: "county",
    note: "13.6% of residents aged 3 and above; the remaining 86.4% are the offline majority.",
  },
};

/** Derived, never typed: 1 − 143,340 / 1,053,991, to one decimal place. */
export const OFFLINE_SHARE_PCT =
  Math.round((1 - INTERNET_USERS.value / INTERNET_USE_BASE.value) * 1000) / 10;

export const ONLINE_SHARE_PCT = Math.round((100 - OFFLINE_SHARE_PCT) * 10) / 10;

export const REGISTERED_VOTERS = COUNTY_TOTAL_WARDS;
export const WARD_COUNT = TOTAL_WARDS;
export const CONSTITUENCY_COUNT = CONSTITUENCIES.length;
