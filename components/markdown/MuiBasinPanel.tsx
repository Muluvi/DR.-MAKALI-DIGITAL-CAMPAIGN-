import { MUI_BASIN_FACTS } from "../../data/mui-basin";
import { TierBadge } from "./TierBadge";
import { ProvenanceLine } from "./ProvenanceLine";

/** The Mui Basin coal question (Section 4.9). Server component, no chart — qualitative record. */
export function MuiBasinPanel() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">The Mui Basin Coal Question</h4>
      </div>
      <p className="t-small text-muted mb-4 leading-relaxed pl-3.5">
        Rendered as sourced statements, not invented figures — the research pass did not supply a concession count, a
        petition status, or a displacement headcount.
      </p>

      <div className="space-y-3">
        {MUI_BASIN_FACTS.map((f, i) => (
          <div key={i} className="rounded-xl border border-line/60 bg-paper p-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="t-micro uppercase tracking-wider font-bold text-muted">{f.label}</span>
              <TierBadge tier={f.source.tier} compact />
            </div>
            <p className="text-xs text-ink/90 leading-relaxed">{f.statement}</p>
            {f.note && <p className="t-label text-muted italic mt-1.5 leading-relaxed">{f.note}</p>}
          </div>
        ))}
      </div>

      <ProvenanceLine provenance={MUI_BASIN_FACTS.map((f) => ({ source: f.source, granularity: f.granularity }))} />
    </div>
  );
}
