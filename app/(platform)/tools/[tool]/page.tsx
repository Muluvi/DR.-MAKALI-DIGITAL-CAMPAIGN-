import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/platform/PageHead";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { CoalitionPath, MapStudio, ParetoWards, PriorityScorer, RegisterGrowth, YouthVoters } from "@/components/tools/kit/votes";
import { ChannelMix, IssueMatcher, MessageMatrix, OfflineWaterline, WardEquity } from "@/components/tools/kit/reach";
import { ContentCalendar, FactCards, MessageStudio, RadioPlanner } from "@/components/tools/kit/content";
import { Allocation, ConstituencyScorecard, VoterDensity, WardCompare, ZoneEffort } from "@/components/tools/kit/planning";
import { CountyMoney, DroughtWatch, SwingViewer } from "@/components/tools/kit/context";
import { AssumptionsPanel, Compliance, KpiLadder, LinkBuilder, StationExplorer, UssdBuilder } from "@/components/tools/kit/utilities";
import { CENSUS_COUNTY, CENSUS_SUBCOUNTIES, ISSUES, ISSUE_NOTES, TOOL_CONSTITUENCIES, TOOL_STATIONS, TOOL_WARDS, fig, figs } from "@/lib/tools/dataset";
import { FIGURES } from "@/lib/data/figures";
import { PUBLIC_SOURCES } from "@/lib/public-data";
import { MESSAGE_BY_CHANNEL, MESSAGE_BY_SEGMENT } from "@/lib/figures/annex";
import { CONTENT_TYPES, PILLARS } from "@/data/message-architecture";
import { RADIO_STATIONS } from "@/data/media-ownership";
import { GENERAL_ELECTION_KPIS, NOMINATION_KPIS } from "@/data/kpis";
import { SMS_LIMIT, USSD_HEADER, USSD_MENU } from "@/data/ussd-specimen";
import { ELECTORAL_HISTORY } from "@/data/electoral-history";
import waterAndDrought from "@/data/analysis/water-and-drought.json";

type Src = { label: string; href?: string };
type Tool = { title: string; lead: string; render: () => ReactNode; does: string; doesNot: string[]; sources: Src[] };

const v = (id: string) => fig(id).value ?? 0;
/** The 2022 winner's share of valid votes (IEBC Form 37C). */
const WINNER_SHARE = (v("result.2022.gov.malombe") / v("result.2022.gov.valid")) * 100;
const REGISTER: Src = PUBLIC_SOURCES.wards;
const STATIONS: Src = PUBLIC_SOURCES.stations;
const SCORECARD: Src = { label: "County Government of Kitui, Delivering the Kitui Promise: Three-Year Scorecard (itemised projects)" };
const CENSUS: Src = { label: "KNBS, 2019 Kenya Population and Housing Census (by sub-county)" };
const ICT: Src = { label: "Communications Authority / KNBS, ICT Analytical Report, 2023/24 Kenya Housing Survey" };
const PROPOSAL: Src = { label: "This proposal: its benchmark, targets and plans" };
const total = TOOL_WARDS.reduce((s, w) => s + w.voters, 0);
const zoneShare = (z: string) => (TOOL_CONSTITUENCIES.filter((c) => c.zone === z).reduce((s, c) => s + c.voters, 0) / total) * 100;
const RADIO_SHARE: Record<string, string> = { "Musyi FM": "radio.musyi", "Athiani FM": "radio.athiani", "Mbaitu FM": "radio.mbaitu", "County FM": "radio.county", "KBC Mwatu FM": "radio.mwatu" };

const FACTS: [string, string][] = [
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

const TOOLS: Record<string, Tool> = {
  "coalition-path": {
    title: "Coalition Path Builder", lead: "Set his share of the vote in each constituency and see whether the shares add up to the winning number.",
    render: () => <CoalitionPath cons={TOOL_CONSTITUENCIES} benchmark={v("benchmark")} turnout={v("turnout.2022")} register2022={v("register.2022")} register2026={v("register.2026")} />,
    does: "Votes in a constituency are its registered voters × turnout × the share you set. The total is compared with the benchmark, the 2022 winning tally rounded. The uniform share is the one equal share across all eight that reaches the benchmark.",
    doesNot: ["It does not forecast the result: every share is your assumption.", "The 2026 option spreads the reported July 2026 total on 2022 shares, because the IEBC has not published it by constituency.", "Turnout is applied evenly; 2022 turnout by constituency is not in hand."],
    sources: [REGISTER, PROPOSAL],
  },
  "priority-scorer": {
    title: "Ward Priority Scorer", lead: "Rank the 40 wards by the things that matter to the plan, with weights you set.",
    render: () => <PriorityScorer wards={TOOL_WARDS} />,
    does: "Each measure is scaled from 0 (lowest ward) to 1 (highest) and mixed by your weights. Under-served is the inverse of county projects per 1,000 registered voters.",
    doesNot: ["It uses no opinion data and no ward-level results, which are not in hand.", "County projects count only the 401 itemised in the scorecard, placed on wards where the printed place allows."],
    sources: [REGISTER, STATIONS, SCORECARD],
  },
  "map-studio": {
    title: "Kitui Map Studio", lead: "Switch the ward map between the register, polling stations, population, county projects and the zones.",
    render: () => <MapStudio wards={TOOL_WARDS} />,
    does: "Each ward is one tile inside its constituency block. A layer shades the wards in fifths, from lightest to darkest, and every tile prints its own value. Tap a ward for its numbers.",
    doesNot: ["It is schematic: tile position inside a constituency carries no geographic meaning.", "Population is the IEBC's 2026 boundary gazette figure for each ward."],
    sources: [REGISTER, STATIONS, PUBLIC_SOURCES.limits, SCORECARD],
  },
  "pareto-wards": {
    title: "Pareto Ward Planner", lead: "The fewest wards that hold a given share of the register.",
    render: () => <ParetoWards wards={TOOL_WARDS} />,
    does: "Wards are taken largest first until their combined 2022 register reaches the share you set.",
    doesNot: ["Size is not support: a large ward is where the voters are, not where they will vote for him.", "Ward figures are 2022: the IEBC has not published the 2026 register by ward."],
    sources: [REGISTER],
  },
  "register-growth": {
    title: "Register Growth Tracker", lead: "The new voters since 2022, and what they do to the winning number.",
    render: () => <RegisterGrowth cons={TOOL_CONSTITUENCIES} register2022={v("register.2022")} growth={v("register.2026.growth")} drive={v("register.2026.ecvr-drive")} turnout={v("turnout.2022")} winnerShare={WINNER_SHARE} />,
    does: "Growth is the reported July 2026 total less the 2022 register. It is spread on 2022 shares, or tilted toward or away from the pool, and the winning number is recalculated at the 2022 winner's share of valid votes.",
    doesNot: ["The July 2026 total is reported by an aggregator (Tier 3) until the IEBC's own figure is in hand.", "Where the new voters registered is not published: the spread is an assumption."],
    sources: [REGISTER, { label: "IEBC, Enhanced Continuous Voter Registration count (April 2026)" }, { label: "Venas News, registered voters by county, July 2026 (reported)" }],
  },
  "youth-voters": {
    title: "Youth and New Voter Calculator", lead: "Youth and first-time voters under the turnout and share you set.",
    render: () => <YouthVoters register2022={v("register.2022")} youth={v("segment.youth.voters")} firstTime={v("register.2026.growth")} benchmark={v("benchmark")} />,
    does: "Youth voters are the 2019 census age distribution applied to the 2022 register (modelled). New voters are the reported growth since 2022. Votes are count × turnout × share, each set by you.",
    doesNot: ["The IEBC does not publish the register by age, so the youth count is modelled.", "No source measures turnout or support by age in Kitui."],
    sources: [CENSUS, REGISTER],
  },
  "channel-mix": {
    title: "Channel Mix by Sub-county", lead: "Where the message has to travel by radio and in person, and where SMS or digital can carry it.",
    render: () => <ChannelMix rows={CENSUS_SUBCOUNTIES} county={CENSUS_COUNTY} latest={{ internet: v("ict.internet"), phone: v("ict.phone") }} />,
    does: "For each sub-county, adults are split into online (internet use), phone but not online (phone ownership less internet use) and no phone, from the 2019 census. The modelled option scales each sub-county by the change in the county rates to 2023/24.",
    doesNot: ["Sub-counties do not map one-to-one onto constituencies.", "Radio listenership by sub-county is not measured, so the radio share is everyone without a phone, not a listener count."],
    sources: [CENSUS, ICT],
  },
  "offline-waterline": {
    title: "Offline Waterline", lead: "How many voters a message can reach online, by SMS, and only offline.",
    render: () => <OfflineWaterline register={v("register.2026")} internet={v("ict.internet")} phone={v("ict.phone")} benchmark={v("benchmark")} />,
    does: "The register is split by the county's internet-use and phone-ownership rates. The benchmark is set against digital reach to show how much of a win has to come from offline.",
    doesNot: ["Rates are residents of all ages applied to voters, as the site's own reach figures are.", "Reach is not persuasion: a voter reachable online still has to be reached, and to agree."],
    sources: [ICT, REGISTER],
  },
  "message-matrix": {
    title: "Message Assignment Matrix", lead: "Which message goes to which segment, on which channel, in which language.",
    render: () => <MessageMatrix segments={MESSAGE_BY_SEGMENT} channels={MESSAGE_BY_CHANNEL} />,
    does: "Pairs the site's message-by-segment table with its message-by-channel table, and adds the channel's language rule.",
    doesNot: ["It does not write new claims: every message and proof point is the site's own.", "Claims the playbooks mark as awaiting documents stay unpublished until they are in hand."],
    sources: [{ label: "This proposal, Platform playbooks: message by segment and by channel" }],
  },
  "issue-matcher": {
    title: "Issue-to-Message Matcher", lead: "The strongest-evidence issue to lead with, for each segment.",
    render: () => <IssueMatcher issues={ISSUES} segments={MESSAGE_BY_SEGMENT} notes={ISSUE_NOTES} />,
    does: "Issues are ranked by the strength of the official record behind them. For each segment, the tool finds the highest-ranked issue its message already speaks to, by named keywords.",
    doesNot: ["The ranking is evidence strength, not what voters say matters: no opinion data is used.", "A keyword match is a pointer, not a judgement; the strategy core decides the lead issue."],
    sources: [{ label: "Analysis pipeline, issue evidence ranking (stage 10)" }],
  },
  "ward-equity": {
    title: "Ward Equity Analyzer", lead: "County project spend per 1,000 voters, ward by ward.",
    render: () => <WardEquity wards={TOOL_WARDS} />,
    does: "Divides the county scorecard's itemised project spend in each ward by the ward's 2022 registered voters.",
    doesNot: [`It covers the ${fig("scorecard.itemised").display} itemised projects, not the county budget and not the ${fig("scorecard.claimed").display} projects the scorecard claims.`, "A project listed for several wards is counted in each."],
    sources: [SCORECARD, REGISTER],
  },
  calendar: {
    title: "Weekly Content Calendar", lead: "The pillars laid out as a week of posts, with the brief's language and ward rules.",
    render: () => <ContentCalendar pillars={PILLARS.map((p) => p.title)} types={CONTENT_TYPES.map((c) => ({ code: c.code, short: c.short }))} wards={TOOL_WARDS} />,
    does: "Posts are split across the three pillars by your weights (largest remainder), the four content types rotate, the first posts are Kikamba-first, and two originate in pool wards, largest first.",
    doesNot: ["It plans; it does not publish. The calendar the team works from is in the Workspace."],
    sources: [{ label: "This proposal, The message: pillars, content types and the weekly brief's rules" }],
  },
  "message-studio": {
    title: "Message Studio", lead: "Write a message once and see it on SMS, USSD, WhatsApp and radio.",
    render: () => <MessageStudio smsLimit={SMS_LIMIT} />,
    does: "Counts characters and words, splits SMS into parts, and times a radio read at 150 words a minute.",
    doesNot: ["It sends nothing.", "It does not translate: Kikamba text goes to the Kikamba reviewer."],
    sources: [PUBLIC_SOURCES.sms],
  },
  "fact-cards": {
    title: "Fact Card Generator", lead: "Any site figure as a ready-to-post line with its source.",
    render: () => <FactCards facts={FACTS.map(([label, id]) => ({ label, f: fig(id) }))} />,
    does: "Reads the figure, its source, its date and its tier from the site's figure registry, so a team edit reaches the card.",
    doesNot: ["It flags, but does not block, Tier 3, calculated and target figures: say what they are when you post them."],
    sources: [{ label: "The site's figure registry (Evidence and sources)" }],
  },
  radio: {
    title: "Radio Planner", lead: "The eight Kikamba stations, their ownership, and a weekly spot plan.",
    render: () => <RadioPlanner stations={RADIO_STATIONS.map((s) => ({ name: s.name, frequency: s.frequency, alignment: s.alignment, posture: s.posture, reachLabel: s.reachLabel, share: RADIO_SHARE[s.name] ? fig(RADIO_SHARE[s.name]) : null }))} />,
    does: "Sums spots and airtime by station. The index multiplies spots by each station's share of listeners across Lower Eastern, to compare plans.",
    doesNot: ["Listener shares are regional (Kitui, Machakos, Makueni) and from an earlier measurement; they rank stations, they do not size Kitui's audience.", "Ownership is publicly reported, not certified."],
    sources: [{ label: "CA/KARF audience report, Lower Eastern" }, { label: "Local media ownership reporting" }],
  },
  "ward-compare": {
    title: "Ward Comparison", lead: "Two to four wards, side by side.",
    render: () => <WardCompare wards={TOOL_WARDS} total={total} />,
    does: "Shows the same official measures for each ward you pick, with a bar against the largest of them.",
    doesNot: ["Ward voter figures are from 2022."],
    sources: [REGISTER, STATIONS, PUBLIC_SOURCES.limits, SCORECARD],
  },
  "constituency-scorecard": {
    title: "Constituency Scorecard", lead: "One card per constituency.",
    render: () => <ConstituencyScorecard cons={TOOL_CONSTITUENCIES} total={total} />,
    does: "Brings each constituency's register, wards, stations and county project spend onto one card.",
    doesNot: ["Spend is the county scorecard's itemised projects attributed to the constituency, not the county budget."],
    sources: [REGISTER, STATIONS, SCORECARD],
  },
  "zone-effort": {
    title: "Zone Effort Planner", lead: "Split communications effort across the anchor, Mwingi and the arid belt, against where the voters are.",
    render: () => <ZoneEffort shares={{ anchor: zoneShare("anchor"), mwingi: zoneShare("mwingi"), arid: zoneShare("arid"), rural: zoneShare("none") }} phases={[{ id: "p-1", label: "The nomination sprint" }, { id: "p12", label: "Awareness and persuasion" }, { id: "p3", label: "Mobilisation and turnout" }].map((p) => ({ ...p, anchor: v(`effort.${p.id}.anchor`), mwingi: v(`effort.${p.id}.mwingi`), arid: v(`effort.${p.id}.arid`), rotating: v(`effort.${p.id}.rotating`) }))} />,
    does: "Compares each zone's share of effort with its share of the 2022 register. The starting weights are the plan's own, by phase.",
    doesNot: ["Effort is a share of the team's work, not money.", "Kitui Rural is in no zone; the plan carries it in the rotating share."],
    sources: [REGISTER, PROPOSAL],
  },
  "voter-density": {
    title: "Voter Density Finder", lead: "Where a field day reaches the most voters.",
    render: () => <VoterDensity wards={TOOL_WARDS} stations={TOOL_STATIONS} />,
    does: "Adds up the streams at each polling centre and ranks centres by registered voters. Ward density is registered voters per km².",
    doesNot: ["A polling centre is a place voters are registered, not a place they gather: use it to choose markets and venues near it.", "Figures are from 2022."],
    sources: [STATIONS, PUBLIC_SOURCES.limits],
  },
  allocation: {
    title: "Ward Allocation Simulator", lead: "An equal split against a needs-weighted split between the 40 wards.",
    render: () => <Allocation wards={TOOL_WARDS} defaultTotal={v("policy.ward-fund.total")} />,
    does: "The equal split divides the total by 40. The needs-weighted split mixes each ward's share of population, of area and of the gap in county projects per voter, by your weights.",
    doesNot: ["It tests formulas; the published formula is the campaign's to set.", "Ward poverty rates are not published, so poverty is not in the formula."],
    sources: [PUBLIC_SOURCES.limits, SCORECARD, PROPOSAL],
  },
  "county-money": {
    title: "County Money Explainer", lead: "The county's budget, audit queries and pending bills, with the limits of each figure.",
    render: () => <CountyMoney f={figs(["budget.total", "budget.equitable", "budget.osr", "budget.grants", "budget.absorption.q1", "audit.cash", "audit.uncollected", "audit.ifmis", "audit.transfers", "audit.pending.contested", "budget.pending-bills.2021"])} population={v("census.population")} />,
    does: "Shows each figure with its source, year and tier, and the share of the envelope each income stream makes.",
    doesNot: ["The envelope is cited through secondary reporting of the Fiscal Strategy Paper (Tier 3).", "The two pending-bills figures are different years and scopes: never add them."],
    sources: [{ label: "Kitui County Fiscal Strategy Paper FY2026/27" }, { label: "Office of the Auditor-General, Kitui County FY2023/24" }, { label: "Controller of Budget, County Budget Implementation Review Reports" }],
  },
  "drought-watch": {
    title: "Drought and Livelihood Watch", lead: "Drought, water, food, prices and livestock in one place.",
    render: () => <DroughtWatch phases={(waterAndDrought as { values: { label: string; value: string | number; as_of: string; unit: string }[] }).values.filter((x) => x.unit === "phase")} f={figs(["water.basic.kdhs", "water.surface", "water.points.down.share", "water.points.total", "price.goat", "price.maize", "livestock.goats", "livestock.cattle", "livestock.households", "food.reserve-households", "poverty.2021", "livelihood.mixed", "livelihood.marginal", "health.stunting"])} sections={[
      { title: "Water", items: [{ id: "water.basic.kdhs", label: "At least a basic drinking-water service" }, { id: "water.surface", label: "Relying on untreated surface water", unit: "people" }, { id: "water.points.down.share", label: "Water points not working" }, { id: "water.points.total", label: "Water points assessed" }] },
      { title: "Prices and livestock", items: [{ id: "price.goat", label: "Average goat price", unit: "KSh" }, { id: "price.maize", label: "Average maize price", unit: "KSh per kg" }, { id: "livestock.goats", label: "Goats" }, { id: "livestock.cattle", label: "Cattle" }, { id: "livestock.households", label: "Livestock-keeping households" }] },
      { title: "Food and livelihoods", items: [{ id: "food.reserve-households", label: "Households in the county food reserve programme" }, { id: "poverty.2021", label: "Residents in poverty" }, { id: "livelihood.mixed", label: "Residents in the mixed-farming zone" }, { id: "livelihood.marginal", label: "Residents in the marginal mixed-farming zone" }, { id: "health.stunting", label: "Children stunted" }] },
    ]} />,
    does: "Collects the site's drought, water, food and livestock figures, each with its source, date and tier.",
    doesNot: ["It is not live: it shows the latest figures the site holds, with their dates. Check the NDMA's current bulletin before quoting a month."],
    sources: [{ label: "NDMA drought early-warning bulletins" }, { label: "NDMA and Kitui County Steering Group, 2025 Long Rains Assessment" }, { label: "KNBS, KDHS 2022 and 2019 Census" }],
  },
  "swing-viewer": {
    title: "2017 to 2022 Swing Viewer", lead: "How the governor vote moved between 2017 and 2022, countywide.",
    render: () => <SwingViewer races={ELECTORAL_HISTORY.filter((r) => r.office === "Kitui Governor" && r.results).map((r) => ({ year: r.year, results: r.results!.map((x) => ({ candidate: x.candidate, votes: x.votes })) }))} turnout2022={v("turnout.2022")} valid2022={v("result.2022.gov.valid")} />,
    does: "Sets each candidate's countywide votes in 2017 against 2022, as the site's electoral history records them.",
    doesNot: ["2017 ward and constituency tallies are not in hand, so the swing is countywide only.", "Shares are of the listed candidates' votes, not of all valid votes."],
    sources: [{ label: "Court of Appeal, Malombe v Ngilu [2018] KECA 460 (2017 result)" }, { label: "IEBC certified result, Form 37C (2022)" }],
  },
  ussd: {
    title: "USSD Flow Builder", lead: "Prototype the USSD menu and download it for the shortcode provider.",
    render: () => <UssdBuilder header={USSD_HEADER} menu={USSD_MENU.map((o) => ({ key: o.key, kikamba: o.kikamba ?? "", english: o.english, does: o.does }))} />,
    does: "Starts from the site's USSD menu, lets you edit it, previews it on a handset screen with a 182-character count, and exports it as JSON.",
    doesNot: ["It does not connect to a shortcode or a network.", "Kikamba wording still needs the Kikamba reviewer."],
    sources: [{ label: "This proposal, the USSD menu specimen" }],
  },
  compliance: {
    title: "Language and Compliance", lead: "Check a bulk SMS against the sending rules before it goes for approval.",
    render: () => <Compliance smsLimit={SMS_LIMIT} />,
    does: "Checks length, language, opt-out, the 48-hour lodging rule and the sending window, and asks a person to confirm the authorisation and the no-attack rule.",
    doesNot: ["It is not legal advice, and the rules are from the 2017 guidelines: have them confirmed as current.", "It cannot judge tone or truth: a person reads every message."],
    sources: [PUBLIC_SOURCES.sms],
  },
  kpis: {
    title: "KPI Ladder", lead: "Test indicator readings against the targets.",
    render: () => <KpiLadder kpis={[...NOMINATION_KPIS.map((k) => ({ ...k, scorecard: "Nomination" })), ...GENERAL_ELECTION_KPIS.map((k) => ({ ...k, scorecard: "General election" }))].map((k) => ({ code: k.code, title: k.title, target: k.target, targetValue: k.targetValue, unit: k.unit, owner: k.owner, cadence: k.cadence, scorecard: k.scorecard }))} />,
    does: "Compares the value you enter with each indicator's numeric target.",
    doesNot: ["Readings typed here are not saved; the KPI tracker in the Workspace keeps the record.", "Indicators whose target depends on the Week 1 baseline cannot be scored yet."],
    sources: [{ label: "This proposal, Measuring success: the scorecards" }],
  },
  "polling-stations": {
    title: "Polling Station Explorer", lead: "Search every 2022 polling station in Kitui.",
    render: () => <StationExplorer stations={TOOL_STATIONS} />,
    does: "Searches the IEBC's 2022 station list by station, centre, ward or code, and downloads what you find.",
    doesNot: ["It is the 2022 list: re-check when the IEBC publishes the 2027 list."],
    sources: [STATIONS],
  },
  links: {
    title: "Ward Link and QR Builder", lead: "A trackable link and QR code for each ward.",
    render: () => <LinkBuilder wards={TOOL_WARDS} base="https://dr-makali-digital-campaign.vercel.app/" />,
    does: "Adds the channel, the ward and a campaign tag to any web address, and draws a QR code for each.",
    doesNot: ["It records nothing about the people who open the links.", "Counting visits needs analytics on the page the link opens."],
    sources: [REGISTER],
  },
  assumptions: {
    title: "Assumptions Panel", lead: "Test the site's core arithmetic, and see every calculated figure and target with its method.",
    render: () => <AssumptionsPanel winnerShare={WINNER_SHARE} f={figs(["register.2022", "register.2026", "turnout.2022", "benchmark.2026-equivalent", "ict.internet", "reach.smartphone"])} modelled={Object.values(FIGURES).filter((x) => (x.state === "modelled" || x.state === "target") && x.value !== null).map((x) => fig(x.id)).sort((a, b) => a.id.localeCompare(b.id))} />,
    does: "Recalculates the winning number (register × turnout × winner's share) and online reach (register × internet use) from inputs you set, and lists every calculated figure and target with its method.",
    doesNot: ["It changes nothing on the site: published figures change only in the data editor, where the checks run."],
    sources: [{ label: "The site's figure registry (Evidence and sources)" }],
  },
};

const TOOL_SLUGS = Object.keys(TOOLS);
export function generateStaticParams() {
  return TOOL_SLUGS.map((tool) => ({ tool }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  return { title: `${TOOLS[tool]?.title ?? "Tool"} | Kitui 2027`, robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const t = TOOLS[tool];
  if (!t) notFound();
  return <>
    <PageHead kicker="Planning tool" title={t.title} lead={t.lead} />
    {t.render()}
    <ToolLimits does={t.does} doesNot={t.doesNot} sources={t.sources} />
  </>;
}
