import { Database } from "lucide-react";

// The six sources the proposal itself cites for hard data (see Appendix B: Source Notes).
// A provenance line only ever names one of these, mechanically detected from text the source
// markdown already contains — never inferred or invented.
export const KNOWN_SOURCES = ["KNBS", "IEBC", "CA", "Mizani Africa", "KIPPRA", "NDMA"] as const;

const SOURCE_PATTERNS: Record<(typeof KNOWN_SOURCES)[number], RegExp> = {
  KNBS: /\bKNBS\b/,
  IEBC: /\bIEBC\b/,
  CA: /\bCA\b(?!\w)/, // Communications Authority — short token, so require it stand alone
  "Mizani Africa": /\bMizani Africa\b/,
  KIPPRA: /\bKIPPRA\b/,
  NDMA: /\bNDMA\b/,
};

export function detectSources(text: string): string[] {
  return KNOWN_SOURCES.filter((source) => SOURCE_PATTERNS[source].test(text));
}

export function SourceLine({ sources }: { sources: string[] }) {
  if (sources.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 px-4 sm:px-0 pt-2 pb-1 text-[9px] uppercase tracking-wider font-bold text-muted">
      <Database size={10} className="shrink-0 opacity-60" aria-hidden="true" />
      <span>Source: {sources.join(" · ")}</span>
    </div>
  );
}
