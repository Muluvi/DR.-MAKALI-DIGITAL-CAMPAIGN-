/**
 * Two lists the tools and the share cards both read (visual upgrade, Part E), kept apart from the
 * tool components so an image route can use them without loading any tool.
 */
import { NOMINATION_CONFIRMATION_REQUIREMENTS } from "../../data/nomination-path";
import { RACE_CALENDAR } from "../public-data";

/** The Fact Card Generator's figures: a plain label and the registry id it reads. */
export const FACTS: [string, string][] = [
  ["Registered voters in Kitui, 2022", "register.2022"], ["Registered voters, July 2026 (reported)", "register.2026"], ["New voters in the April 2026 registration drive", "register.2026.ecvr-drive"],
  ["Polling stations, 2022", "register.polling-stations"], ["Turnout in the 2022 governor race", "turnout.2022"], ["Valid votes for governor, 2022", "result.2022.gov.valid"],
  ["Kitui's population, 2019 census", "census.population"], ["Households, 2019 census", "census.households"], ["Median age in Kitui", "census.median-age"],
  ["Residents aged 15 to 34", "census.age.15-34.share"], ["Residents in poverty", "poverty.2021"], ["People in poverty", "poverty.2021.people"],
  ["Residents using the internet", "ict.internet"], ["Residents who own a mobile phone", "ict.phone"],
  ["People with at least a basic drinking-water service", "water.basic.kdhs"], ["Residents relying on untreated surface water", "water.surface"], ["Water points not working, July 2025", "water.points.down.share"], ["Water points assessed, July 2025", "water.points.total"],
  ["County resource envelope, FY2026/27", "budget.total"], ["Equitable share from the national government", "budget.equitable"], ["County's own-source revenue, FY2026/27", "budget.osr"],
  ["Development budget spent, Q1 2025/26", "budget.absorption.q1"], ["Uncollected county rates and rents (Auditor-General)", "audit.uncollected"], ["Unconfirmed cash balances (Auditor-General)", "audit.cash"], ["County pending bills, FY2020/21", "budget.pending-bills.2021"],
  ["Average goat price, July 2025", "price.goat"], ["Average maize price per kg, July 2025", "price.maize"], ["Goats in Kitui", "livestock.goats"], ["Cattle in Kitui", "livestock.cattle"], ["Livestock-keeping households", "livestock.households"],
  ["Infant deaths per 1,000 live births", "health.imr"], ["Under-five deaths per 1,000 live births", "health.u5mr"], ["Children stunted", "health.stunting"], ["Births in a health facility", "health.facility-births"],
  ["Projects itemised in the county scorecard", "scorecard.itemised"], ["Projects the county scorecard claims", "scorecard.claimed"], ["Cost of the itemised projects", "scorecard.itemised.ksh"], ["Boreholes the county says it drilled", "scorecard.boreholes.drilled"],
  ["Kitui Central NG-CDF bursary recipients", "record.bursary.recipients"], ["Kitui Central NG-CDF bursaries, total", "record.bursary.ksh"],
];

const NOMINATION_WANTED = /Governor|financing account|authorised persons for campaign|expenditure report|Public officers/i;

/** The Governor Nomination Path: the two open confirmations, then the dated Gazette steps from 2027. */
export const NOMINATION_ITEMS: { id: string; label: string; detail: string }[] = [
  ...NOMINATION_CONFIRMATION_REQUIREMENTS.map((r, i) => ({ id: `party-${i}`, label: r, detail: "Needed to confirm the nomination method" })),
  ...RACE_CALENDAR.filter((e) => NOMINATION_WANTED.test(e.event) && e.date >= "2027-01-01").map((e) => ({ id: e.date + e.event, label: e.event, detail: `${e.date} · ${e.source}` })),
];
