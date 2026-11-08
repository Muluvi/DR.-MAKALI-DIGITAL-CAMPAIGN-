import { PageHead } from "@/components/platform/PageHead";
import { NominationPath } from "@/components/tools/public/NominationPath";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { NOMINATION_CONFIRMATION_REQUIREMENTS, NOMINATION_METHOD_CLAIM } from "@/data/nomination-path";
import { PUBLIC_SOURCES, RACE_CALENDAR } from "@/lib/public-data";

export const metadata = { title: "Governor nomination path | Kitui 2027", robots: { index: false, follow: false } };

const WANTED = /Governor|financing account|authorised persons for campaign|expenditure report|Public officers/i;

export default function Page() {
  const dated = RACE_CALENDAR.filter((e) => WANTED.test(e.event) && e.date >= "2027-01-01").map((e) => ({ id: e.date + e.event, label: e.event, detail: `${e.date} · ${e.source}` }));
  const party = NOMINATION_CONFIRMATION_REQUIREMENTS.map((r, i) => ({ id: `party-${i}`, label: r, detail: "Needed to confirm the nomination method" }));
  return <>
    <PageHead kicker="Planning tool" title="Governor nomination path" lead="What must be confirmed and filed on the road to the nomination." />
    <p className="plat-card mb-4 p-4 text-[0.9rem] text-muted"><strong className="text-ink">Unconfirmed:</strong> {NOMINATION_METHOD_CLAIM.value}. {NOMINATION_METHOD_CLAIM.provenance.note}</p>
    <NominationPath items={[...party, ...dated]} />
    <ToolLimits does="The list combines the campaign's two open confirmation requirements with the dated Gazette steps. Ticks are saved only on this device." doesNot={["It is not the full IEBC nomination requirements. Check the current Elections (General) Regulations and IEBC guidance for paperwork and qualifications.", "It does not confirm Wiper's nomination rules.", "It stores no names or documents."]} sources={[PUBLIC_SOURCES.calendar, { label: "Campaign nomination-path record" }]} />
  </>;
}
