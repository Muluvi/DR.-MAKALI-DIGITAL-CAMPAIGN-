import { Database } from "lucide-react";
import type { Provenance } from "../../data/types";
import { GRANULARITY_LABEL } from "../../data/types";
import { TierBadge } from "./TierBadge";

/** The footer chrome both provenance forms share: the database mark, then the line's content. */
function Footer({ children, bordered = true }: { children: React.ReactNode; bordered?: boolean }) {
  return (
    <div className={`px-4 sm:px-0 pt-3 pb-1 space-y-1.5 ${bordered ? "border-t border-line/30 mt-3" : ""}`}>
      {children}
    </div>
  );
}

/** One provenance row: the mark, the tier, the source, and what it is granular to. */
const ROW_CLASS = "flex flex-wrap items-center gap-x-2 gap-y-1 t-micro uppercase tracking-wider font-bold text-muted";

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
    <Footer>
      {unique.map((p, i) => (
        <div key={i} className={ROW_CLASS}>
          <Database size={10} className="shrink-0 opacity-60" aria-hidden="true" />
          <TierBadge tier={p.source.tier} compact />
          <span>
            {p.source.url ? (
              <a href={p.source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] py-1 underline decoration-dotted underline-offset-2 hover:text-accent transition-colors">
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
          {p.note && <span className="w-full sm:w-auto normal-case font-semibold text-muted italic">{p.note}</span>}
        </div>
      ))}
    </Footer>
  );
}

/**
 * The prose-detected form: source names found in a table's own text, where no structured
 * provenance exists to attach.
 *
 * This was a separate component with its own copy of the footer chrome — a second
 * `<Database size={10}>` and a second `t-micro uppercase tracking-wider` line, 90% the same
 * markup. ProvenanceLine's doc comment above says it "extends the existing SourceLine
 * convention"; that supersession is finished here. What is genuinely different — detecting
 * names in prose rather than reading a structured record — is `detectSources`, and it stays.
 */
export function SourceLine({ sources }: { sources: string[] }) {
  if (sources.length === 0) return null;
  return (
    <Footer bordered={false}>
      <div className={ROW_CLASS}>
        <Database size={10} className="shrink-0 opacity-60" aria-hidden="true" />
        <span>Source: {sources.join(" · ")}</span>
      </div>
    </Footer>
  );
}
