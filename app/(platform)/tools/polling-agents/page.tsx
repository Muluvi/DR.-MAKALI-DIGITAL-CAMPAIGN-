import { PageHead } from "@/components/platform/PageHead";
import { PollingAgentPlanner } from "@/components/tools/public/PollingAgentPlanner";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { PUBLIC_SOURCES, PUBLIC_WARDS } from "@/lib/public-data";

export const metadata = { title: "Polling agent planner | Kitui 2027", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ agents?: string; reserve?: string; span?: string }> }) {
  const initial = await searchParams;
  return <>
    <PageHead kicker="Planning tool" title="Polling agent planner" lead="Work out how many people the campaign needs, ward by ward, from the official station count." />
    <PollingAgentPlanner wards={PUBLIC_WARDS} initial={initial} />
    <ToolLimits does="Agents equal stations times your agents-per-station figure. Reserves are a percentage of agents, rounded up. Supervisors, if set, are stations divided by your span, rounded up." doesNot={["It does not state how many agents the law allows at a station. That input is your planning assumption, so confirm it against the current Elections (General) Regulations.", "It stores no agent names, phone numbers or ID numbers.", "It uses the 2022 station list. Re-check when the IEBC publishes the 2027 list."]} sources={[PUBLIC_SOURCES.stations]} />
  </>;
}
