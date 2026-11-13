import { PageHead } from "@/components/platform/PageHead";
import { ScenarioSimulator } from "@/components/tools/public/ScenarioSimulator";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { PUBLIC_CONSTITUENCIES, PUBLIC_SOURCES } from "@/lib/public-data";

export const metadata = { title: "Winning-number simulator | Kitui 2027", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  return <>
    <PageHead kicker="Scenario model" title="Winning-number simulator" lead="Set turnout and share by constituency, compare two scenarios, and see the gap to the working benchmark." />
    <ScenarioSimulator constituencies={PUBLIC_CONSTITUENCIES} initial={s} />
    <ToolLimits does="Votes equal the 2022 register times turnout times share, for each constituency. Every scenario starts from the 2022 county turnout and the even share that reaches the benchmark. Those starting values are arithmetic, not evidence of support." doesNot={["It is a scenario model, not a forecast or a probability of winning.", "It does not use ward or constituency election results, because no official set is held yet.", "It uses the 2022 register. Newer ward-level figures are not published.", "It never sends what you enter anywhere."]} sources={[PUBLIC_SOURCES.wards, { label: "Benchmark and turnout: the campaign figure registry" }]} />
  </>;
}
