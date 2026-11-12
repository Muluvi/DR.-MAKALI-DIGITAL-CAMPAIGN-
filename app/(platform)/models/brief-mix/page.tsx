import { ModelHead } from "@/components/models/ModelHead";
import { BriefMix } from "@/components/models/BriefMix";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { BRIEF_LANGUAGES, BRIEF_PLAN, BRIEF_SIZES, BRIEF_TYPES } from "@/lib/models/data";

export const metadata = { title: "Weekly brief mix | Kitui 2027", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ s?: string; l?: string; c?: string; min?: string }> }) {
  const initial = await searchParams;
  return <>
    <ModelHead slug="brief-mix" lead="Set how the week divides between the four content types, and the languages and channels it uses, and see which of the six voter segments it covers and which it misses." />
    <BriefMix plan={BRIEF_PLAN} types={BRIEF_TYPES} languages={BRIEF_LANGUAGES} sizes={BRIEF_SIZES} initial={initial} />
    <ToolLimits
      does="Each segment has a content type, its languages and its lead channels in the segment plan the strategy sets out (The voters to win). A segment is covered when its content type has at least the minimum share of the week you set, and the week uses at least one of its languages and one of its lead channels. Each miss names what failed."
      doesNot={[
        "It does not say how many people in a segment see the content. Coverage here means the week is aimed at them, not that it reached them.",
        "It does not rank the segments. Priority is set by the presence audit and the monthly review.",
        "Three of the six segments have no published voter count, and none is estimated here.",
        "Political SMS carries English or Kiswahili only; a week that ticks Kikamba and SMS still sends Kikamba by voice or WhatsApp.",
      ]}
      sources={[{ label: "This proposal: the segment plan in The voters to win, and the content types in The message" }]}
    />
  </>;
}
