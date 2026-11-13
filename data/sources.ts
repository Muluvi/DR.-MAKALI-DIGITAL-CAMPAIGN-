// Reusable Source objects — one definition per institution/outlet, imported everywhere that
// institution is cited so a URL or date correction happens in exactly one place. Nine of them are
// also the registry's sources (lib/data/figures.ts reads their names), so a document is named the
// same way in a figure's source line and in the evidence table (consolidation pass, Step 2).
import type { Source } from "./types";

// ---- Tier 1 · Official ------------------------------------------------------------------

export const IEBC_WARD_REGISTER: Source = {
  name: "IEBC, Registered Voters per County Assembly Ward (2022)",
  url: "https://www.iebc.or.ke/docs/rov_per_caw.pdf",
  publicationDate: "2022",
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
  name: "Kitui County Fiscal Strategy Paper FY2026/27, as approved by the County Assembly",
  publicationDate: "2026",
  tier: 1,
};

export const AUDITOR_GENERAL_FY2023_24: Source = {
  name: "Office of the Auditor-General, Kitui County FY2023/24 audit report",
  publicationDate: "FY2023/24",
  tier: 1,
};



export const COURT_OF_APPEAL_2018: Source = {
  name: "Court of Appeal, Malombe v Ngilu [2018] KECA 460",
  publicationDate: "2018",
  tier: 1,
  // No public case-record URL was supplied by the research pass. Cite via Kenya Law's case
  // search using this citation rather than a guessed link — see Data Gaps Register.
};




export const KDHS_2022: Source = {
  name: "KNBS, Kenya Demographic and Health Survey 2022, Kitui factsheet, per Firefly's audit",
  url: "https://www.knbs.or.ke/wp-content/uploads/2023/08/Kenya-Demographic-and-Health-Survey-2022-Factsheet-Kitui.pdf",
  publicationDate: "2022",
  tier: 1,
};





// ---- Tier 2 · Reported --------------------------------------------------------------------


export const IEBC_REGISTER_2026_REPORTED: Source = {
  name: "Venas News, registered voters by county, July 2026; unconfirmed until IEBC's own July figure is in hand",
  publicationDate: "2026-07",
  tier: 3,
  // 605,703 county total and +61,839 new registrations. Tier 3 and explicitly unverified: used
  // nowhere in a calculation, only to show that ~200,000 is likely a floor (§3.4.1).
};




export const MEDIA_2022_DECLARATION: Source = {
  name: "Media reporting of the IEBC 2022 declaration (The Star; Nation; Standard)",
  publicationDate: "2022-08",
  tier: 2,
  // The research hand-off supplied these vote totals without naming a specific outlet or
  // article URL. Flagged in the Data Gaps Register rather than attributed to an invented
  // publication.
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
