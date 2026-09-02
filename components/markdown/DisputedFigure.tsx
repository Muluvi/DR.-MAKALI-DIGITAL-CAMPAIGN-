import type { DisputedFigureEntry } from "../../data/types";
import { TierBadge } from "./TierBadge";

function formatValue(value: number, unit: string): string {
  if (unit.startsWith("%")) return `${value}${unit}`;
  return `${value.toLocaleString()} ${unit}`;
}

/**
 * Renders a disputed figure with every value it carries, side by side, each with its own
 * source and tier — never averaged, never rounded away, never silently reduced to one number.
 * A preferred value (if any) is marked and reasoned; an unresolved dispute says so plainly and
 * states what would resolve it. Server component — no chart library, no hooks, near-zero
 * bundle cost regardless of how many places in the document render one.
 */
export function DisputedFigure({ entry }: { entry: DisputedFigureEntry }) {
  return (
    <div className="not-prose my-6 rounded-2xl border-2 border-dashed border-danger/40 bg-paper p-4 sm:p-5 print-avoid-break">
      <span className="eyebrow-label !mb-2 !text-danger">Disputed figure — both values shown</span>
      <h4 className="font-serif text-sm font-bold text-ink mb-3">{entry.label}</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {entry.values.map((v, i) => {
          const isPreferred = entry.preferredIndex === i;
          return (
            <div
              key={i}
              className={`rounded-xl border p-3 ${isPreferred ? "border-accent/50 bg-accent/[0.04]" : "border-line/60 bg-card"}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <TierBadge tier={v.source.tier} compact />
                {isPreferred && <span className="t-micro font-black uppercase tracking-wider text-accent">Preferred</span>}
              </div>
              <div className="font-serif text-lg font-black text-ink">{formatValue(v.value, v.unit)}</div>
              <div className="t-label text-muted mt-1">
                {v.source.name} · {v.source.publicationDate}
              </div>
            </div>
          );
        })}
      </div>

      {entry.status === "resolved-preferred" && entry.preferenceReason && (
        <p className="text-xs text-ink/80 leading-relaxed">
          <strong className="text-ink">Why the preferred value is used:</strong> {entry.preferenceReason}
        </p>
      )}

      <p className="text-xs text-muted leading-relaxed mt-2">
        <strong className="text-ink/80">What would resolve this:</strong> {entry.resolutionPath}
      </p>

      {entry.status === "unresolved" && (
        <p className="t-micro uppercase tracking-wider font-black text-danger mt-2">
          Unresolved — neither value is asserted as correct.
        </p>
      )}
    </div>
  );
}
