import { ModelHead } from "@/components/models/ModelHead";
import { ResponseTier } from "@/components/models/ResponseTier";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { HOLDING_LINES, TIERS } from "@/lib/models/data";

export const metadata = { title: "Response tier | Kitui 2027", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const initial = await searchParams;
  return <>
    <ModelHead slug="response-tier" lead="Describe an incident and see its severity tier, how fast the campaign answers, who drafts and who approves, and the pre-drafted holding line to start from." />
    <ResponseTier tiers={TIERS} lines={HOLDING_LINES} initial={initial} />
    <ToolLimits
      does="It applies the four-tier escalation ladder in Risks and response, highest tier first, and reads its view counts and group count from the ladder's own thresholds. The holding line is the pre-drafted position from the runbooks for the line of attack you pick."
      doesNot={[
        "It does not replace the communications lead's judgement. Where the ladder names no tier for a case, it keeps the lower tier and says so.",
        "It does not draft a reply. The holding line is a structure to start from, not a script.",
        "It does not monitor anything. Incidents are logged on the rapid-response desk in the workspace.",
        "It stores nothing. Describe the incident, not the people in it.",
      ]}
      sources={[{ label: "This proposal: the severity tiers in Risks and response, and the holding positions in the runbooks" }]}
    />
  </>;
}
