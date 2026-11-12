import { ModelHead } from "@/components/models/ModelHead";
import { ReachByChannel } from "@/components/models/ReachByChannel";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { REACH_SHARES } from "@/lib/models/data";
import { PUBLIC_CONSTITUENCIES, PUBLIC_SOURCES } from "@/lib/public-data";

export const metadata = { title: "Reach by channel | Kitui 2027", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  return <>
    <ModelHead slug="reach-by-channel" lead="Choose the channels in the mix and the reach you assume for each, and see who the mix reaches and who it misses, constituency by constituency." />
    <ReachByChannel constituencies={PUBLIC_CONSTITUENCIES} shares={REACH_SHARES} initial={m} />
    <ToolLimits
      does="The register splits into three layers from two published rates: internet users; phone owners without internet; and people with no phone. Social media and WhatsApp reach only the first layer, SMS and USSD the first two, radio and ground work all three. In each layer a channel reaches the share you assume, and channels are treated as independent chances: a voter is missed only if every channel that could reach them misses them."
      doesNot={[
        "It does not measure reach. Every reach figure is your assumption; the starting 25% is a placeholder, not evidence.",
        "It has no ward or constituency connectivity data: the county rates apply everywhere, which is certainly wrong for Township against Tharaka.",
        "No Kitui radio listenership data exists, so radio's reach is entirely your assumption.",
        "The rates were measured on everyone aged three and over and are applied to registered voters, which probably understates the phone layers.",
      ]}
      sources={[{ label: "Communications Authority and KNBS, ICT report on the 2023/24 Kenya Housing Survey: internet use and phone ownership" }, PUBLIC_SOURCES.wards]}
    />
  </>;
}
