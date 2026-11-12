import { ModelHead } from "@/components/models/ModelHead";
import { WardPriority } from "@/components/models/WardPriority";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { PRIORITY_WARDS } from "@/lib/models/data";
import { PUBLIC_SOURCES } from "@/lib/public-data";

export const metadata = { title: "Ward priority | Kitui 2027", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const { w } = await searchParams;
  return <>
    <ModelHead slug="ward-priority" lead="Weigh what matters to you, and see the 40 wards ranked on the map and in a table. Change a weight and the order moves." />
    <WardPriority wards={PRIORITY_WARDS} initial={w} />
    <ToolLimits
      does="Each criterion is scaled across the 40 wards from 0 (the lowest ward) to 1 (the highest). A ward's score is the weighted mean of its four scaled criteria, times 100, so the weights set how much each one counts. Where he has not held office is yes or no: wards in Mwingi North, Mwingi West, Mwingi Central and Kitui South count 1, the rest 0. County projects are the itemised scorecard projects whose printed place names that ward alone."
      doesNot={[
        "It does not say where he will win or lose. It ranks places on the weights you choose, and different weights give a different order.",
        "It ranks wards, never people. No voter is scored and no sensitive characteristic is an input.",
        "It uses the 2022 register and station list. Newer ward-level figures are not published.",
        "Projects placed in several wards, in no ward or county-wide are left out, not spread across wards.",
      ]}
      sources={[PUBLIC_SOURCES.wards, PUBLIC_SOURCES.stations, { label: "County Government of Kitui, Delivering the Kitui Promise: Three-Year Scorecard (Aug 2022 – Aug 2025), itemised projects by ward" }]}
    />
  </>;
}
