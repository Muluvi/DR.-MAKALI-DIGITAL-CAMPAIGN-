import { packDatasets, meta } from "@/lib/platform/catalogue";
import { teamDatasets } from "@/lib/platform/team-datasets";
import { PageHead } from "@/components/platform/PageHead";
import { Explorer } from "@/components/platform/Explorer";

export const metadata = { title: "Explore the data | Kitui 2027", robots: { index: false, follow: false } };

export default async function Explore({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const all = [...packDatasets(), ...(await teamDatasets())];
  const current = all.find((d) => d.id === sp.ds) ?? all[0];
  return (
    <>
      <PageHead kicker="Data explorer" title="Every dataset, searchable" lead="Every record the platform holds: the figure registry, the register, the county's projects, the analysis outputs, the strategy lists and the team's own records. Filter, sort, share the view as a link, or download it." />
      <Explorer datasets={all.map(meta)} current={current} />
    </>
  );
}
