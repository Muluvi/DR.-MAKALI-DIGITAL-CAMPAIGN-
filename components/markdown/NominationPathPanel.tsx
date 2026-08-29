import { NOMINATION_METHOD_CLAIM, NOMINATION_CONFIRMATION_REQUIREMENTS } from "../../data/nomination-path";
import { TierBadge } from "./TierBadge";
import { ProvenanceLine } from "./ProvenanceLine";

/**
 * The nomination path (Section 1A) — the highest-stakes Tier 3 claim in the document, since
 * the whole Phase −1 strategy is built on it. Server component, no chart.
 */
export function NominationPathPanel() {
  return (
    <div className="not-prose my-6 rounded-2xl border-2 border-dashed border-danger/40 bg-paper p-4 sm:p-5 print-avoid-break">
      <div className="flex items-center gap-2 mb-2">
        <TierBadge tier={3} />
        <span className="text-[9px] font-black uppercase tracking-wider text-danger">Unconfirmed by Wiper</span>
      </div>
      <h4 className="font-serif text-sm font-bold text-ink mb-2">{NOMINATION_METHOD_CLAIM.label}</h4>
      <p className="font-serif text-base font-black text-ink mb-2">{NOMINATION_METHOD_CLAIM.value}</p>
      <p className="text-xs text-ink/80 leading-relaxed mb-3">{NOMINATION_METHOD_CLAIM.provenance.note}</p>

      <div className="rounded-xl border border-line/60 bg-card p-3">
        <div className="text-[9px] uppercase tracking-wider font-black text-ink mb-1.5">What would confirm this</div>
        <ul className="space-y-1.5">
          {NOMINATION_CONFIRMATION_REQUIREMENTS.map((req, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-ink/80 leading-relaxed">
              <span className="text-accent mt-0.5 shrink-0">›</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      <ProvenanceLine provenance={NOMINATION_METHOD_CLAIM.provenance} />
    </div>
  );
}
