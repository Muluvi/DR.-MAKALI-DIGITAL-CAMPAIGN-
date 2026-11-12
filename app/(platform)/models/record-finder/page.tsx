import { ModelHead } from "@/components/models/ModelHead";
import { RecordFinder } from "@/components/models/RecordFinder";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { FINDER_WARDS, PROJECTS, SCORECARD_SOURCE } from "@/lib/models/data";

export const metadata = { title: "Record finder | Kitui 2027", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const initial = await searchParams;
  return <>
    <ModelHead slug="record-finder" lead="Pick a ward and see the county projects the scorecard places there, each with the page to cite, so a speaker knows what is on the record before they arrive." />
    <RecordFinder projects={PROJECTS} wards={FINDER_WARDS} source={SCORECARD_SOURCE} initial={initial} />
    <ToolLimits
      does="It lists the itemised projects in the county's own scorecard whose printed place resolves to the ward: alone, or named with other places. You can add the projects the scorecard places only at constituency level. Every cost and status is as the county printed it, with the page number."
      doesNot={[
        "It does not verify anything. Every project is a claim the county printed, not evidence it was delivered; a verification visit is logged in the service-delivery tracker.",
        "It covers the scorecard's itemised projects only, not the county budget.",
        "County-wide and headquarters projects are not placed in any ward and are left out.",
      ]}
      sources={[{ label: `${SCORECARD_SOURCE}, August 2022 to August 2025` }]}
    />
  </>;
}
