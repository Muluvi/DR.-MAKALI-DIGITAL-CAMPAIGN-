// Reusable Source objects — one definition per institution/outlet, imported everywhere that
// institution is cited so a URL or date correction happens in exactly one place.
import type { Source } from "./types";

// ---- Tier 1 · Official ------------------------------------------------------------------

export const IEBC_WARD_REGISTER: Source = {
  name: "IEBC — Registered Voters per County Assembly Ward",
  url: "https://www.iebc.or.ke/docs/rov_per_caw.pdf",
  publicationDate: "2022",
  tier: 1,
};

export const IEBC_GAZETTE_CEILING: Source = {
  name: "Kenya Gazette Notice No. 12251 (IEBC, Election Campaign Financing Regulations 2026)",
  publicationDate: "2026-08-07",
  tier: 1,
};

export const IEBC_2022_RESULTS: Source = {
  name: "IEBC 2022 General Election declared results",
  url: "https://www.iebc.or.ke",
  publicationDate: "2022-08",
  tier: 1,
};

export const KNBS_CENSUS_2019: Source = {
  name: "KNBS, 2019 Kenya Population and Housing Census",
  publicationDate: "2019",
  tier: 1,
};

export const CONTROLLER_OF_BUDGET: Source = {
  name: "Controller of Budget, County Budget Implementation Review Report",
  publicationDate: "FY2025/26 Q1",
  tier: 1,
  // Only the CoB's own reported absorption rate (18%) is drawn from this source at present;
  // no primary CBIRR document was in the research hand-off, so no URL is attached — see
  // Section: Appendix C, "current pending bills" / audit-record row.
};

export const FISCAL_STRATEGY_PAPER_FY2026_27: Source = {
  name: "Kitui County Fiscal Strategy Paper, FY2026/27 (approved by the County Assembly)",
  publicationDate: "2026",
  tier: 1,
};

export const AUDITOR_GENERAL_FY2023_24: Source = {
  name: "Office of the Auditor-General, Kitui County FY2023/24 audit report",
  publicationDate: "FY2023/24",
  tier: 1,
};

export const NDMA_ALERT: Source = {
  name: "National Drought Management Authority (NDMA), Kitui County Drought Early Warning Bulletin",
  publicationDate: "2026-01",
  tier: 1,
};

export const IPC_CLASSIFICATION: Source = {
  name: "Integrated Food Security Phase Classification (IPC), Kenya",
  publicationDate: "2025-09",
  tier: 1,
};

export const COURT_OF_APPEAL_2018: Source = {
  name: "Court of Appeal, Malombe v Ngilu [2018] KECA 460",
  publicationDate: "2018",
  tier: 1,
  // No public case-record URL was supplied by the research pass. Cite via Kenya Law's case
  // search using this citation rather than a guessed link — see Data Gaps Register.
};

// ---- Tier 2 · Reported --------------------------------------------------------------------

export const THE_STAR: Source = {
  name: "The Star",
  publicationDate: "2022-08",
  tier: 2,
};

export const STANDARD_NATION: Source = {
  name: "The Standard / Nation",
  publicationDate: "2022-08",
  tier: 2,
};

export const MEDIA_2022_DECLARATION: Source = {
  name: "Kenyan media reporting of the 2022 IEBC declaration",
  publicationDate: "2022-08",
  tier: 2,
  // The research hand-off supplied these vote totals without naming a specific outlet or
  // article URL. Flagged in the Data Gaps Register rather than attributed to an invented
  // publication.
};

export const CBC_CECM_STATEMENT: Source = {
  name: "Kitui County CECM statement on household food reserves",
  publicationDate: "2026",
  tier: 2,
};

export const MEDIA_FLOODING_MARCH_2026: Source = {
  name: "Kenyan media reporting, March 2026 flooding",
  publicationDate: "2026-03",
  tier: 2,
};

export const MEDIA_ABSORPTION_ALT: Source = {
  name: "Other Kenyan media reporting on FY2025/26 Q1 development absorption",
  publicationDate: "2025",
  tier: 2,
};

export const MEDIA_MUI_BASIN: Source = {
  name: "Kenyan media reporting on Mui Basin coal concessions",
  publicationDate: "2024",
  tier: 2,
};

export const PETITION_12_2014: Source = {
  name: "Petition 12 of 2014 (Mui Basin coal concessions)",
  publicationDate: "2014",
  tier: 1,
  // The research hand-off did not specify which court/bench this petition was filed at, so no
  // URL is attached — cite via Kenya Law's case search using this reference. See Data Gaps
  // Register.
};

// ---- Tier 3 · Single-source / partisan -----------------------------------------------------

export const LOCAL_DIGITAL_NOMINATION_REPORT: Source = {
  name: "Local Kitui digital outlet reporting on the Wiper nomination method",
  publicationDate: "2026",
  tier: 3,
};

export const LOCAL_DIGITAL_MEDIA_OWNERSHIP: Source = {
  name: "Local digital reporting on Kamba-language radio ownership",
  publicationDate: "2026",
  tier: 3,
};
