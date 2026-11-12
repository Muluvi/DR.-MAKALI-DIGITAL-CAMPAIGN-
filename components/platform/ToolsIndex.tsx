import Link from "next/link";
import { PageHead } from "@/components/platform/PageHead";
import { LIVE_MODELS } from "@/lib/models/catalogue";

/**
 * The one Tools hub: the reference tools, each with a page. Scenario models (winning number,
 * polling-agent cover and the rest) live under /models. Nothing is listed that has no page.
 */
const TOOLS = [
  { href: "/tools/race-calendar", title: "Governor race calendar", text: "Every gazetted date a Governor candidate must track, passed and upcoming, with a calendar file to import." },
  { href: "/tools/ward-dossier", title: "Ward dossier", text: "Register, stations, population and area for the county, its constituencies and all 40 wards." },
  { href: "/tools/nomination-path", title: "Governor nomination path", text: "What must be confirmed and filed on the road to the nomination, with the dates." },
  { href: "/tools/service-delivery", title: "Service-delivery tracker", text: "The county scorecard's itemised projects, by constituency, ward, sector and status." },
  { href: "/tools/sources", title: "Sources and data gaps", text: "Where the official figures come from, and what is still missing." },
];

export function ToolsIndex() {
  return (
    <>
      <PageHead kicker="Tools" title="Reference tools" lead="The official data and dates the campaign works from, open to anyone with the link. Each one names its source and what it does not do." />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="plat-card group flex h-full flex-col p-5 transition-colors hover:border-accent">
              <h2 className="font-serif text-xl text-ink group-hover:text-accent">{t.title}</h2>
              <p className="mt-2 text-[0.9rem] text-muted">{t.text}</p>
              <span className="mt-auto pt-4 text-[0.85rem] font-semibold text-ink underline">Open</span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="plat-card mt-8 p-5" aria-labelledby="tools-models">
        <h2 id="tools-models" className="font-serif text-xl text-ink">Looking for a scenario?</h2>
        <p className="mt-2 max-w-2xl text-[0.9rem] text-muted">Tools that take your assumptions and show an outcome are in Models: {LIVE_MODELS.map((m) => m.name.toLowerCase()).join(", ")}.</p>
        <Link href="/models" className="plat-btn plat-btn-sm mt-3">Open Models</Link>
      </section>
    </>
  );
}
