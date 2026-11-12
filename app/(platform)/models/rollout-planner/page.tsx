import { ModelHead } from "@/components/models/ModelHead";
import { RolloutPlanner } from "@/components/models/RolloutPlanner";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { CAMPAIGN_START, ROLLOUT_DEFAULTS as DEFAULTS, nextMonday } from "@/lib/models/rollout-defaults";
import { ELECTION_DAY } from "@/lib/phases";
import { PUBLIC_CONSTITUENCIES, PUBLIC_SOURCES, RACE_CALENDAR } from "@/lib/public-data";

export const metadata = { title: "Rollout planner | Kitui 2027", robots: { index: false, follow: false } };


export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const initial = await searchParams;
  if (!CAMPAIGN_START) throw new Error("rollout planner: the Governor campaign period is missing from the race calendar");
  return <>
    <ModelHead slug="rollout-planner" lead="Lay the six implementation phases from a start date, and see whether all 40 wards are reporting before the gazetted date you choose." />
    <RolloutPlanner calendar={RACE_CALENDAR} pollingDay={ELECTION_DAY} defaultStart={nextMonday()} defaultDeadline={CAMPAIGN_START.date} defaults={DEFAULTS} constituencies={PUBLIC_CONSTITUENCIES.length} initial={initial} />
    <ToolLimits
      does="Phases run back to back in whole weeks from the start date: Discovery, Readiness, then the Pilot with the centre and the constituencies you set. The rest of the eight constituencies follow in waves of the size and length you set. Election-day readiness starts the number of weeks you set before polling day and ends on it; Optimisation is whatever time is left between the end of rollout and readiness. The starting lengths are placeholders for the conversation, not a schedule Firefly has committed to."
      doesNot={[
        "It does not set the campaign's own phases (nomination, awareness, persuasion, turnout); those are in the Timeline chapter.",
        "It does not know how long a phase will really take. The pilot and the check of the team's phones and connectivity measure that, and the lengths are changed to match.",
        "It assumes one wave follows another, with no gap and no overlap.",
        "Gazetted dates are as published in August 2026. Check them against the current Gazette before relying on one.",
      ]}
      sources={[PUBLIC_SOURCES.calendar, { label: "Election day: the second Tuesday of August, Constitution of Kenya, Article 101" }]}
    />
  </>;
}
