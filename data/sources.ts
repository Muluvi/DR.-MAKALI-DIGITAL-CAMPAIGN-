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

export const ORPP_WPF_RENAME: Source = {
  name: "ORPP — certificate of change of name, Wiper Democratic Movement to Wiper Patriotic Front",
  url: "https://orpp.or.ke/certificate-of-change-of-name-to-wiper-patriotic-front-w-p-f-formerly-wiper-democratic-movement-w-d-m/",
  publicationDate: "2025-08",
  tier: 1,
};

export const IEBC_ECVR_2026: Source = {
  name: "IEBC — Enhanced Continuous Voter Registration press release (drive closed 28 April 2026)",
  url: "https://www.iebc.or.ke/uploads/resources/9AOpepKtL9.pdf",
  publicationDate: "2026-04",
  tier: 1,
  // The county-by-county breakdown is annexed to this release and is the Tier 1 replacement for
  // the 2022 ward file. Named as the highest-priority data request in §6.1.
};

export const PARLIAMENT_MEMBER_RECORD: Source = {
  name: "Parliament of Kenya — Hon. Mulu Makali, member record",
  url: "https://www.parliament.go.ke/the-national-assembly/hon-mulu-makali",
  publicationDate: "2026",
  tier: 1,
};

export const KDHS_2022: Source = {
  name: "KNBS — Kenya Demographic and Health Survey 2022, Kitui county factsheet",
  url: "https://www.knbs.or.ke/wp-content/uploads/2023/08/Kenya-Demographic-and-Health-Survey-2022-Factsheet-Kitui.pdf",
  publicationDate: "2022",
  tier: 1,
};

export const NDMA_BULLETIN_FEB_2026: Source = {
  name: "NDMA — National Drought Early Warning Bulletin, February 2026",
  url: "https://knowledgeweb.ndma.go.ke/Content/LibraryDocuments/National_Drought_Early_Warning_Bulletin_Feb_202620260311171955.pdf",
  publicationDate: "2026-02",
  tier: 1,
};

export const CA_POLITICAL_MESSAGING_GUIDELINES: Source = {
  name: "Communications Authority — guidelines on political bulk messages and political social media content",
  url: "https://www.ca.go.ke/sites/default/files/2023-06/Guidelines-on-Prevention-of-Dissemination-of-Undesirable-Bulk-and-Premium-Rate-Political-Messages-and-Political-Social-Media-Content-Via-Electronic-Networks-1.pdf",
  publicationDate: "2017",
  tier: 1,
  // The source for the two rules that reshape the SMS layer in §5.2.3.3: English or Kiswahili only,
  // and 48-hour advance lodging with the operator.
};

export const ODPC_ELECTORAL_GUIDANCE: Source = {
  name: "ODPC — Guidance Note on Processing Personal Data for Electoral Purposes",
  url: "https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Guidance-Notes-for-Electoral-Purposes.pdf",
  publicationDate: "2024-02",
  tier: 1,
};

export const ODPC_PUBLIC_SECTOR_GUIDANCE: Source = {
  name: "ODPC — Guidance Note for the Public Sector (2025)",
  url: "https://www.odpc.go.ke/wp-content/uploads/2025/11/ODPC-%E2%80%93-Guidance-Note-FOR-PUBLIC-SECTOR.pdf",
  publicationDate: "2025-11",
  tier: 1,
  // Bars reuse of public-programme personal data for political mobilisation without explicit
  // consent — the basis for the NG-CDF beneficiary prohibition in §5.7.6.
};

// ---- Tier 2 · Reported --------------------------------------------------------------------

export const KNBS_POVERTY_REPORT: Source = {
  name: "KNBS — Kenya Poverty Report, via national press coverage",
  url: "https://www.knbs.or.ke/wp-content/uploads/2024/10/The-Kenya-Poverty-Report-2022.pdf",
  publicationDate: "2022",
  tier: 2,
  // Tier 2 because the Kitui rows quoted (55.2% poverty, 72.5% food share) reach this proposal
  // through reporting rather than from the annex tables. §6.1 requests the annex.
};

export const IEBC_REGISTER_2026_REPORTED: Source = {
  name: "Reported 2026 registered-voter totals for Kitui (aggregator coverage)",
  publicationDate: "2026-07",
  tier: 3,
  // 605,703 county total and +61,839 new registrations. Tier 3 and explicitly unverified: used
  // nowhere in a calculation, only to show that ~200,000 is likely a floor (§3.4.1).
};


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
