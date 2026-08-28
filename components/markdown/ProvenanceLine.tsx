import { Database } from "lucide-react";
import type { Provenance } from "../../data/types";
import { GRANULARITY_LABEL } from "../../data/types";
import { TierBadge } from "./TierBadge";

function dedupeKey(p: Provenance): string {
  return `${p.source.name}__${p.source.publicationDate}__${p.granularity}`;
}

/**
 * Full provenance footer for a data-driven block: source name (linked when a URL was
 * supplied), publication date, geographic granularity, tier badge, and an optional caveat.
 * This is the mandatory footer for every new figure this pass introduces — extends the
 * existing SourceLine convention (which only ever named a source) with the full schema the
 * three-tier provenance system requires: value, unit, source, date, granularity and tier all
 * travel together, never split apart.
 */
export function ProvenanceLine({ provenance }: { provenance: Provenance | Provenance[] }) {
  const list = Array.isArray(provenance) ? provenance : [provenance];
  const seen = new Set<string>();
  const unique = list.filter((p) => {
    const key = dedupeKey(p);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (unique.length === 0) return null;

  return (
    <div className="px-4 sm:px-0 pt-3 pb-1 space-y-1.5 border-t border-line/30 mt-3">
      {unique.map((p, i) => (
        <div key={i} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] uppercase tracking-wider font-bold text-muted">
          <Database size={10} className="shrink-0 opacity-60" aria-hidden="true" />
          <TierBadge tier={p.source.tier} compact />
          <span>
            {p.source.url ? (
              <a href={p.source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-accent transition-colors">
                {p.source.name}
              </a>
            ) : (
              <span title="No specific document URL was supplied by the research pass — see the Data Gaps Register.">
                {p.source.name}
              </span>
            )}
          </span>
          <span className="opacity-60">·</span>
          <span>{p.source.publicationDate}</span>
          <span className="opacity-60">·</span>
          <span>{GRANULARITY_LABEL[p.granularity]}</span>
          {p.note && <span className="w-full sm:w-auto normal-case font-semibold text-muted/80 italic">{p.note}</span>}
        </div>
      ))}
    </div>
  );
}
