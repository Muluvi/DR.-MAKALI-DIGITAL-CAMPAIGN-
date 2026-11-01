import { fmt, val } from "../lib/data/read.ts";
/**
 * Centralized Electoral Arithmetic and Official Certified Benchmarks
 * Single Source of Truth for all quantitative claims across prose and visuals.
 */

export interface CertifiedResult {
  candidate: string;
  office: string;
  year: number;
  votes: number;
  tier: "T1" | "T2" | "T3";
  source: string;
  notes?: string;
}

export const ELECTORAL_ARITHMETIC = {
  // Electorate baselines
  register2022Certified: val("register.2022"), // 40 wards; prisons in register.2022.with-prisons - T1
  register2026ECVRReported: val("register.2026"), // July 2026 reported - T3 uncertified
  turnoutHistoricalAvgPct: 61.7, // Certified 2022 county turnout, IEBC Form 37C - T1

  // Winning thresholds & margins
  victoryThresholdBenchmark: val("benchmark"), // Derived from Malombe 2022 winning total
  malombe2022Certified: val("result.2022.gov.malombe"),
  pathBWinningMargin: 12183, // 200,000 - 187,817 = +12,183

  // Sourced historical certified peak votes
  certifiedResults: [
    {
      candidate: "Irene Kasalu",
      office: "Woman Representative",
      year: 2022,
      votes: val("result.2022.womanrep.kasalu"),
      tier: "T1",
      source: "IEBC Certified Results 2022",
    },
    {
      candidate: "Julius Malombe",
      office: "Governor",
      year: 2022,
      votes: val("result.2022.gov.malombe"),
      tier: "T1",
      source: "IEBC Certified Results 2022",
    },
    {
      candidate: "Enoch Wambua",
      office: "Senator",
      year: 2022,
      votes: val("result.2022.senate.wambua"),
      tier: "T1",
      source: "IEBC Certified Results 2022",
    },
    {
      candidate: "Charity Ngilu",
      office: "Governor",
      year: 2017,
      votes: val("result.2017.gov.ngilu"),
      tier: "T1",
      source: "IEBC Certified Results 2017",
    },
    {
      candidate: "David Musila",
      office: "Governor",
      year: 2017,
      votes: val("result.2017.gov.musila"),
      tier: "T1",
      source: "IEBC Certified Results 2017",
    },
    {
      candidate: "David Musila",
      office: "Governor",
      year: 2022,
      votes: val("result.2022.gov.musila"), // IEBC Form 37C; The Star's early total (result.2022.gov.musila.media) is not used
      tier: "T1",
      source: "IEBC Certified Results 2022",
      notes: `${fmt("result.2022.gov.musila")} certified (IEBC Form 37C); The Star's early total of ${fmt("result.2022.gov.musila.media")} is not used`,
    },
  ] as CertifiedResult[],

  // Regional geographic distribution
  mwingiAndSouthRegisterPct: 51.7, // 51.7% of voters live in Mwingi (North, West, Central) & Kitui South
  topWardsPareto: {
    top12WardsVoters: 201385,
    top12WardsSharePct: 37.8,
  },
  deficitWards: {
    mwingiNorthTop7Count: 3, // Mwingi North contains 3 of top 7 deficit wards
    kituiSouthTop11Count: 2, // Kitui South contains 2 of top 11 deficit wards
  },

  // County fiscal envelope FY2026/27
  fiscalEnvelopeFY2026_27: {
    total: 12.38e9, // KSh 12.38B
    equitableShare: 10.44e9, // KSh 10.44B (84.3%)
    conditionalGrants: 1.00e9, // KSh 1.00B (8.1%)
    ownSourceRevenue: 0.94e9, // KSh 0.94B (7.5%)
  },

  // Connectivity and device realities (CA / KNBS 2023/24)
  connectivity: {
    internetUsePct: 26.2, // CA/KNBS 2023/24
    mobilePhoneOwnershipPct: 44.1, // CA/KNBS 2023/24
    historical2019InternetPct: 13.6, // KNBS 2019 Census reference
    consentedSmsTarget: val("target.sms"), // Observable rural milestone
    supporterDatabaseTarget: val("target.supporters"), // Observable 40-ward DB milestone
  },
} as const;
