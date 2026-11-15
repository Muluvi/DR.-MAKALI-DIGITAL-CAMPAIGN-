/**
 * The 36 tools, as the story shows them before one is opened: name, one line, the chapter heading
 * it lives under, and the gesture and preview its try-it card animates. Light on purpose: no data,
 * no components, so a chapter can show every card without loading a tool until it is opened.
 *
 * `home` is a live heading id (lib/heading-slug.ts). The tool opens there, inside the chapter, and
 * /tools/<slug> stays as a full-page view of the same tool.
 */
export type Gesture = "drag" | "tap" | "type" | "swipe";
export type Preview = "sliders" | "tiles" | "bars" | "rows" | "phone" | "cards" | "ring" | "calendar";

export interface ToolMeta { slug: string; title: string; line: string; home: string; gesture: Gesture; preview: Preview; prompt: string }

export const TOOL_META: ToolMeta[] = [
  // How Kitui voted
  { slug: "register-growth", title: "Register Growth Tracker", line: "The new voters since 2022, and what they do to the winning number.", home: "votes-sec-2-1", gesture: "drag", preview: "sliders", prompt: "Tilt the new voters toward the pool and watch the winning number move." },
  { slug: "polling-stations", title: "Polling Station Explorer", line: "Search every 2022 polling station in Kitui.", home: "votes-sec-2-1", gesture: "type", preview: "rows", prompt: "Type a place you know and see how many voters are registered there." },
  { slug: "swing-viewer", title: "2017 to 2022 Swing Viewer", line: "How the governor vote moved between the last two elections.", home: "votes-sec-2-2", gesture: "tap", preview: "bars", prompt: "Compare each candidate's 2017 and 2022 totals side by side." },
  { slug: "pareto-wards", title: "Pareto Ward Planner", line: "The fewest wards that hold a given share of the register.", home: "votes-sec-2-3", gesture: "drag", preview: "bars", prompt: "Drag to half the register: how few wards hold it?" },
  { slug: "coalition-path", title: "Coalition Path Builder", line: "Set his share in each constituency and see if it adds up.", home: "winning-sec-2-5", gesture: "drag", preview: "sliders", prompt: "Lower Kitui Central to 70% and find where the votes must come from instead." },
  { slug: "constituency-scorecard", title: "Constituency Scorecard", line: "One card per constituency: voters, stations and county spend.", home: "votes-sec-2-4", gesture: "swipe", preview: "cards", prompt: "Swipe through the eight constituencies, largest first." },
  { slug: "winning-number", title: "Winning-Number Simulator", line: "How many votes win, under the turnout and shares you set.", home: "winning-sec-2-5", gesture: "drag", preview: "sliders", prompt: "What if turnout falls to 55%? Drag it and see the gap." },
  // The county in numbers
  { slug: "map-studio", title: "Kitui Map Studio", line: "Switch the ward map between voters, stations, people and projects.", home: "kitui-sec-1-2", gesture: "tap", preview: "tiles", prompt: "Switch the layer to county projects, then tap the darkest ward." },
  // What voters need
  { slug: "drought-watch", title: "Drought and Livelihood Watch", line: "Drought, water, food, prices and livestock in one place.", home: "needs-sec-3-2", gesture: "tap", preview: "cards", prompt: "Check the latest drought phase before you post about water." },
  { slug: "county-money", title: "County Money Explainer", line: "The county's budget, audit queries and pending bills, with their limits.", home: "needs-sec-1-5", gesture: "tap", preview: "bars", prompt: "Switch to per resident: what does the budget mean for one person?" },
  { slug: "ward-equity", title: "Ward Equity Analyzer", line: "County project spend per 1,000 voters, ward by ward.", home: "spend-sec-3-7", gesture: "tap", preview: "bars", prompt: "Which wards sit below the county average? Find yours." },
  { slug: "service-delivery", title: "Service-Delivery Tracker", line: "The county's own projects, to verify and turn into proof.", home: "spend-sec-3-7", gesture: "tap", preview: "rows", prompt: "Filter to one ward and pick a project the team can visit." },
  // How voters get news
  { slug: "channel-mix", title: "Channel Mix by Sub-county", line: "Where the message must travel by radio and in person.", home: "news-sec-4-3", gesture: "tap", preview: "bars", prompt: "Find the sub-county where most adults have no phone." },
  { slug: "offline-waterline", title: "Offline Waterline", line: "How much of a win must come from voters reached offline.", home: "news-sec-4-4", gesture: "drag", preview: "sliders", prompt: "Raise internet use to 40%: is digital alone enough yet?" },
  // The diagnosis and the goal
  { slug: "assumptions", title: "Assumptions Panel", line: "Test the site's core arithmetic, and every calculated figure.", home: "diagnosis-sec-7-4", gesture: "drag", preview: "sliders", prompt: "Challenge an assumption: change the winner's share and see the bar move." },
  { slug: "nomination-path", title: "Governor Nomination Path", line: "What must be confirmed and filed on the road to the nomination.", home: "goal-sec-8-1", gesture: "tap", preview: "rows", prompt: "Tick off what is already done; the list remembers on this phone." },
  // The message and the voters
  { slug: "allocation", title: "Ward Allocation Simulator", line: "An equal split against a needs-weighted split between 40 wards.", home: "message-sec-10-1", gesture: "drag", preview: "bars", prompt: "Weight area more heavily: which wards gain the most?" },
  { slug: "issue-matcher", title: "Issue-to-Message Matcher", line: "The strongest-evidence issue to lead with, for each segment.", home: "message-sec-10-1", gesture: "tap", preview: "bars", prompt: "See which issue each segment's message should open with." },
  { slug: "fact-cards", title: "Fact Card Generator", line: "Any site figure as a ready-to-post line with its source.", home: "message-sec-10-2", gesture: "type", preview: "cards", prompt: "Search “water” and copy a line, source included." },
  { slug: "message-studio", title: "Message Studio", line: "Write once; see it on SMS, USSD, WhatsApp and radio.", home: "message-sec-10-4", gesture: "type", preview: "phone", prompt: "Type a message and watch it fill four screens." },
  { slug: "message-matrix", title: "Message Assignment Matrix", line: "Which message goes to which segment, channel and language.", home: "voters-sec-11-2", gesture: "tap", preview: "cards", prompt: "Pick farmers and radio: what does the message say?" },
  { slug: "youth-voters", title: "Youth and New Voter Calculator", line: "Youth and first-time voters under the turnout you set.", home: "voters-sec-11-3", gesture: "drag", preview: "sliders", prompt: "Raise youth turnout to 65%: how many votes is that?" },
  // Channels and language
  { slug: "priority-scorer", title: "Ward Priority Scorer", line: "Rank the 40 wards with weights you set.", home: "channels-sec-12-1", gesture: "drag", preview: "bars", prompt: "Put all the weight on the pool and see the top five change." },
  { slug: "zone-effort", title: "Zone Effort Planner", line: "Effort across the three zones, against where the voters are.", home: "channels-sec-12-1", gesture: "drag", preview: "ring", prompt: "Shift effort to the arid belt: is it now over or under its share?" },
  { slug: "radio", title: "Radio Planner", line: "The eight Kikamba stations and a weekly spot plan.", home: "channels-sec-12-3", gesture: "drag", preview: "bars", prompt: "Add spots on a monitoring-only station and see the warning." },
  { slug: "calendar", title: "Weekly Content Calendar", line: "The pillars as a week of posts, with the language rules.", home: "week-sec-12-6", gesture: "drag", preview: "calendar", prompt: "Drop Kikamba-first posts below four and see the rule flag it." },
  // Timeline and delivery
  { slug: "race-calendar", title: "Governor Race Calendar", line: "Every Gazette deadline, passed and upcoming.", home: "timeline-sec-14-1", gesture: "tap", preview: "calendar", prompt: "Filter to upcoming and add the dates to your phone's calendar." },
  { slug: "voter-density", title: "Voter Density Finder", line: "Where one field day meets the most voters.", home: "workstreams-sec-15-3", gesture: "tap", preview: "rows", prompt: "Pick a constituency and find its busiest polling centre." },
  { slug: "polling-agents", title: "Polling Agent Planner", line: "Agents and reserves needed at every station.", home: "workstreams-sec-15-3", gesture: "type", preview: "rows", prompt: "Set two agents a station: how many people does that take?" },
  { slug: "kpis", title: "KPI Ladder", line: "Test indicator readings against the targets.", home: "success-sec-18-2", gesture: "type", preview: "bars", prompt: "Type this week's reading and see how far it is from target." },
  { slug: "compliance", title: "Language and Compliance", line: "Check a bulk SMS against the sending rules.", home: "lawful-sec-19-2", gesture: "type", preview: "rows", prompt: "Paste a message and watch the seven checks light up." },
  // Evidence and reference
  { slug: "sources", title: "Sources and Data Gaps", line: "Where every official figure comes from, and what is missing.", home: "annex-evidence-sec-a-1", gesture: "tap", preview: "rows", prompt: "See what data is still missing, and who holds it." },
  { slug: "ward-dossier", title: "Ward Dossier", line: "Everything about one ward on one page.", home: "votes-sec-b-1", gesture: "type", preview: "rows", prompt: "Find your ward and open its dossier." },
  { slug: "ward-compare", title: "Ward Comparison", line: "Two to four wards, side by side.", home: "votes-sec-b-1", gesture: "tap", preview: "bars", prompt: "Compare the largest ward with the one you know best." },
  { slug: "ussd", title: "USSD Flow Builder", line: "Prototype the USSD menu and download it.", home: "annex-playbooks-sec-c-2", gesture: "type", preview: "phone", prompt: "Shorten the menu until it fits one 182-character screen." },
  { slug: "links", title: "Ward Link and QR Builder", line: "A trackable link and QR code for each ward.", home: "annex-technology-sec-e-1", gesture: "tap", preview: "tiles", prompt: "Pick a channel and print a ward's QR code for a poster." },
];

export const TOOL_BY_SLUG: Record<string, ToolMeta> = Object.fromEntries(TOOL_META.map((t) => [t.slug, t]));
