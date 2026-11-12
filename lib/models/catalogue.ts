/**
 * The Models area: what each model takes, what it shows and what it stands on. The hub and each
 * model's page read this list, so a model is described once.
 *
 * "Live" means the page exists and runs the shared functions in lib/models/. "Planned" is in the
 * plan (docs/value-2026-11/README.md) and has no page yet; the hub names it and does not link it.
 */

export type ModelEntry = {
  slug: string;
  name: string;
  question: string;
  inputs: string;
  outcome: string;
  data: string;
  status: "Live" | "Planned";
};

export const MODELS: ModelEntry[] = [
  {
    slug: "winning-number",
    name: "Winning number",
    question: "What turnout and share reach the benchmark?",
    inputs: "Turnout and vote share by constituency, in two scenarios",
    outcome: "Votes reached against the working benchmark, side by side",
    data: "IEBC 2022 register by constituency; benchmark and turnout from the figure registry",
    status: "Live",
  },
  {
    slug: "polling-agents",
    name: "Polling-agent cover",
    question: "How many people does polling day need, ward by ward?",
    inputs: "Agents per station, reserve percentage, stations per supervisor",
    outcome: "Headcount by ward and in total",
    data: "IEBC 2022 polling-station list",
    status: "Live",
  },
  {
    slug: "ward-priority",
    name: "Ward priority",
    question: "Which wards come first, on the weights you choose?",
    inputs: "A weight for register size, wards where he has not held office, stations and county projects",
    outcome: "The 40 wards ranked, on a tile map and in a table",
    data: "IEBC 2022 ward register and station list; the county scorecard's itemised projects",
    status: "Live",
  },
  {
    slug: "send-check",
    name: "Send check",
    question: "Would the dispatch log accept this send?",
    inputs: "Rail, language, message, send date and time, lodging date",
    outcome: "Allowed or refused, with the rule that applies",
    data: "The dispatch log's own rules, from the Communications Authority guidelines of 2017",
    status: "Live",
  },
  {
    slug: "rollout-planner",
    name: "Rollout planner",
    question: "Does the platform reach all 40 wards in time?",
    inputs: "Start date, phase lengths, pilot size, constituencies per wave, the freeze before polling day",
    outcome: "The six implementation phases against the gazetted dates, and the weeks to spare",
    data: "The gazetted race calendar for the 2027 general election",
    status: "Live",
  },
  {
    slug: "reach-by-channel",
    name: "Reach by channel",
    question: "Who does a channel mix reach, and who does it miss?",
    inputs: "Share of effort per channel and assumed reach per channel",
    outcome: "Reach by constituency, and the gap",
    data: "Channel reach and connectivity figures in the registry",
    status: "Planned",
  },
  {
    slug: "brief-mix",
    name: "Weekly brief mix",
    question: "Which voter segments does this week's brief cover?",
    inputs: "Pillar weights, content types, languages",
    outcome: "The six segments covered and missed",
    data: "The message architecture and segment definitions",
    status: "Planned",
  },
  {
    slug: "response-tier",
    name: "Response tier",
    question: "How serious is this incident, and who approves the answer?",
    inputs: "What happened, where, how far it has spread",
    outcome: "Severity tier, approver and the holding line to start from",
    data: "The escalation ladder and the runbooks",
    status: "Planned",
  },
  {
    slug: "record-finder",
    name: "Record finder",
    question: "Which county projects can a speaker cite in this ward?",
    inputs: "Ward, sector, project status",
    outcome: "Projects with their sources",
    data: "The county projects register (401 itemised projects)",
    status: "Planned",
  },
];

export const LIVE_MODELS = MODELS.filter((m) => m.status === "Live");
export const modelBySlug = (slug: string): ModelEntry => {
  const m = MODELS.find((x) => x.slug === slug);
  if (!m) throw new Error(`models: no model ${slug}`);
  return m;
};
