import { PageHead } from "@/components/platform/PageHead";
import { RaceCalendar } from "@/components/tools/public/RaceCalendar";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { PUBLIC_SOURCES, RACE_CALENDAR } from "@/lib/public-data";

export const metadata = { title: "Governor race calendar | Kitui 2027", robots: { index: false, follow: false } };

export default function Page() {
  return <>
    <PageHead kicker="Planning tool" title="Governor race calendar" lead="Every dated step a Governor candidate must track, from the Kenya Gazette." />
    <RaceCalendar entries={RACE_CALENDAR} />
    <p className="plat-card mt-4 p-4 text-[0.9rem] text-muted">On the 9 December 2026 fundraising date, the notice also states that section 26(2) of the Elections Act does not prohibit fundraising by or on behalf of a person contesting an election, or for a political party. Take legal advice on any specific event.</p>
    <ToolLimits does="Dates are copied from the Gazette notices and marked passed or upcoming from today's date in Nairobi." doesNot={["It is not legal advice.", "It does not track changes automatically. IEBC can amend dates by a new notice, and a High Court ruling on the election date remains subject to appeal.", "Party-specific dates are not included until the party publishes them."]} sources={[PUBLIC_SOURCES.calendar]} />
  </>;
}
