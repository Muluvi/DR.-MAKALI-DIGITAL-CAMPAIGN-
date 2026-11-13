import type { DisputedFigureEntry } from "../../data/types";
import { InlineMarks } from "./InlineMarks";
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
  const resolved = entry.status === "resolved-preferred";
  const chosen = entry.values[entry.preferredIndex ?? 0];

  // A settled figure shows the one value the document uses, with its source and tier; the value
  // it rejected sits in one line beneath, named and sourced, with the reason. Nothing is dropped:
  // a reader can still see what was published elsewhere and why it is not used.
  if (resolved && chosen) {
    const others = entry.values.filter((_, i) => i !== (entry.preferredIndex ?? 0));
    return (
      <div className="not-prose my-6 rounded-2xl border border-line bg-paper p-4 sm:p-5 print-avoid-break">
        <span className="eyebrow-label !mb-2 !text-muted">The figure used</span>
        <h4 className="font-serif text-sm font-bold text-ink mb-2">{entry.label}</h4>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-serif text-2xl font-black text-ink tabular-nums">{formatValue(chosen.value, chosen.unit)}</span>
          <TierBadge tier={chosen.source.tier} compact />
          <span className="t-label text-muted">
            {chosen.source.name} · {chosen.source.publicationDate}
          </span>
        </div>
        {entry.preferenceReason && (
          <p className="t-label text-ink/80 leading-relaxed mt-3">
            <strong className="text-ink">Why this one:</strong> <InlineMarks text={entry.preferenceReason} />
          </p>
        )}
        {others.length > 0 && (
          <p className="t-label text-muted leading-relaxed mt-2">
            <strong className="text-ink/80">Not used:</strong>{" "}
            {others.map((v, i) => (
              <span key={i}>
                {i > 0 ? "; " : ""}
                <span className="tabular-nums">{formatValue(v.value, v.unit)}</span> ({v.source.name}, {v.source.publicationDate})
              </span>
            ))}
            .
          </p>
        )}
        <p className="t-label text-muted leading-relaxed mt-2">
          <strong className="text-ink/80">To make it firmer:</strong> {entry.resolutionPath}
        </p>
      </div>
    );
  }

  return (
    <div className="not-prose my-6 rounded-2xl border-2 border-dashed bg-paper p-4 sm:p-5 print-avoid-break border-danger/40">
      <span className="eyebrow-label !mb-2 !text-danger">Disputed figure — both values shown</span>
      <h4 className="font-serif text-sm font-bold text-ink mb-3">{entry.label}</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {entry.values.map((v, i) => (
          <div key={i} className="rounded-xl border p-3 border-line/60 bg-card">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <TierBadge tier={v.source.tier} compact />
            </div>
            <div className="font-serif text-lg font-black text-ink">{formatValue(v.value, v.unit)}</div>
            <div className="t-label text-muted mt-1">
              {v.source.name} · {v.source.publicationDate}
            </div>
          </div>
        ))}
      </div>

      <p className="t-label text-muted leading-relaxed mt-2">
        <strong className="text-ink/80">What would resolve this:</strong> {entry.resolutionPath}
      </p>
      <p className="t-micro font-black text-danger mt-2">Unresolved — neither value is asserted as correct.</p>
    </div>
  );
}
