import { ModelHead } from "@/components/models/ModelHead";
import { SendCheck } from "@/components/models/SendCheck";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { PUBLIC_SOURCES } from "@/lib/public-data";

export const metadata = { title: "Send check | Kitui 2027", robots: { index: false, follow: false } };

const nairobiToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(new Date());

export default async function Page({ searchParams }: { searchParams: Promise<{ rail?: string; language?: string; date?: string; sendTime?: string; lodgedOn?: string }> }) {
  const initial = await searchParams;
  return <>
    <ModelHead slug="send-check" lead="Describe a send before it is logged, and see whether the dispatch log would accept it, with the rule behind every refusal." />
    <SendCheck today={nairobiToday()} initial={initial} />
    <ToolLimits
      does="It runs the dispatch log's own rules, the same code the workspace form and the server apply when a send is logged, so the check and the log cannot disagree. Those rules apply to the SMS rail; on any other rail the log sets none."
      doesNot={[
        "It is not legal clearance. Counsel or the campaign's licensed provider confirms the current text of the guidelines these rules encode.",
        "It sends nothing. The platform plans and logs sends; it never sends one.",
        "It does not check consent: every recipient must have opted in, and the list stays in the campaign's own systems.",
        "It stores nothing you type, and the message text is never put in the link.",
      ]}
      sources={[PUBLIC_SOURCES.sms]}
    />
  </>;
}
