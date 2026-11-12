"use client";

/**
 * A model as it runs inside the story: the same component as its own page, with the data it needs,
 * and `embedded` set so it never rewrites the story's address. Loaded only when a reader opens a
 * model-embed card (components/models/ModelEmbed.tsx), so the story's first load does not carry it.
 */
import { ScenarioSimulator } from "@/components/tools/public/ScenarioSimulator";
import { PollingAgentPlanner } from "@/components/tools/public/PollingAgentPlanner";
import { WardPriority } from "./WardPriority";
import { SendCheck } from "./SendCheck";
import { RolloutPlanner } from "./RolloutPlanner";
import { ReachByChannel } from "./ReachByChannel";
import { BriefMix } from "./BriefMix";
import { ResponseTier } from "./ResponseTier";
import { RecordFinder } from "./RecordFinder";
import { BRIEF_LANGUAGES, BRIEF_PLAN, BRIEF_SIZES, BRIEF_TYPES, FINDER_WARDS, HOLDING_LINES, PRIORITY_WARDS, PROJECTS, REACH_SHARES, SCORECARD_SOURCE, TIERS } from "@/lib/models/data";
import { CAMPAIGN_START, ROLLOUT_DEFAULTS, nairobiToday, nextMonday } from "@/lib/models/rollout-defaults";
import { ELECTION_DAY } from "@/lib/phases";
import { PUBLIC_CONSTITUENCIES, PUBLIC_WARDS, RACE_CALENDAR } from "@/lib/public-data";

export default function EmbeddedModel({ slug }: { slug: string }) {
  switch (slug) {
    case "winning-number": return <ScenarioSimulator constituencies={PUBLIC_CONSTITUENCIES} embedded />;
    case "polling-agents": return <PollingAgentPlanner wards={PUBLIC_WARDS} initial={{ agents: "1" }} embedded />;
    case "ward-priority": return <WardPriority wards={PRIORITY_WARDS} embedded />;
    case "send-check": return <SendCheck today={nairobiToday()} initial={{}} embedded />;
    case "rollout-planner": return <RolloutPlanner calendar={RACE_CALENDAR} pollingDay={ELECTION_DAY} defaultStart={nextMonday()} defaultDeadline={CAMPAIGN_START?.date ?? ELECTION_DAY} defaults={ROLLOUT_DEFAULTS} constituencies={PUBLIC_CONSTITUENCIES.length} initial={{}} embedded />;
    case "reach-by-channel": return <ReachByChannel constituencies={PUBLIC_CONSTITUENCIES} shares={REACH_SHARES} embedded />;
    case "brief-mix": return <BriefMix plan={BRIEF_PLAN} types={BRIEF_TYPES} languages={BRIEF_LANGUAGES} sizes={BRIEF_SIZES} initial={{}} embedded />;
    case "response-tier": return <ResponseTier tiers={TIERS} lines={HOLDING_LINES} initial={{}} embedded />;
    case "record-finder": return <RecordFinder projects={PROJECTS} wards={FINDER_WARDS} source={SCORECARD_SOURCE} initial={{}} embedded />;
    default: return null;
  }
}
