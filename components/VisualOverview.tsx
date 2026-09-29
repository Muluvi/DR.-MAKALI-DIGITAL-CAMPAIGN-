import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, BarChart3, MapPinned, Route, ShieldCheck } from "lucide-react";

import type { TabId } from "@/lib/heading-slug";

type VisualOverviewProps = {
  sections: Array<{ id: TabId; label: string; number: string }>;
  wordCounts: Record<TabId, number>;
};

const signals = [
  { label: "Evidence base", value: "Source-led", detail: "Claims keep provenance and uncertainty visible.", icon: ShieldCheck, tone: "gold" },
  { label: "Geography", value: "40 wards", detail: "Prioritise by reach, register and field coverage.", icon: MapPinned, tone: "blue" },
  { label: "Operating route", value: "−1 → 3", detail: "Nomination sprint through measurement and learning.", icon: Route, tone: "coral" },
  { label: "Decision model", value: "200k", detail: "A benchmark to test, not a forecast to promise.", icon: BarChart3, tone: "green" },
] as const;

export function VisualOverview({ sections, wordCounts }: VisualOverviewProps) {
  const totalWords = Object.values(wordCounts).reduce((sum, count) => sum + count, 0);
  const largest = sections.reduce((max, section) => (wordCounts[section.id] > wordCounts[max.id] ? section : max), sections[0]);

  return (
    <section className="visual-overview" aria-labelledby="visual-overview-title">
      <div className="visual-overview__heading">
        <div>
          <p className="visual-overview__eyebrow">Decision map</p>
          <h2 id="visual-overview-title">The route, before the detail.</h2>
          <p>Four signals hold the argument together. Open a section when you need the evidence behind the shape.</p>
        </div>
        <span className="visual-overview__reading">{Math.round(totalWords / 250)} min full read</span>
      </div>

      <div className="visual-overview__grid">
        {signals.map(({ label, value, detail, icon: Icon, tone }) => (
          <div key={label} className={`visual-overview__card is-${tone}`}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </div>
        ))}
      </div>

      <div className="visual-overview__rail" aria-label="Document route">
        {sections.slice(0, 6).map((section, index) => (
          <Link key={section.id} href={`#section-${section.id}`} className="visual-overview__step">
            <span>{section.number}</span>
            <strong>{section.label}</strong>
            {index < 3 ? <ArrowDownRight aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
          </Link>
        ))}
        <span className="visual-overview__tail">+{Math.max(0, sections.length - 6)} sections</span>
      </div>

      <p className="visual-overview__caption">
        The largest chapter is <strong>{largest?.label}</strong> at {wordCounts[largest?.id ?? sections[0]?.id].toLocaleString("en-KE")} words. Start with the map, then choose the depth you need.
      </p>
    </section>
  );
}
