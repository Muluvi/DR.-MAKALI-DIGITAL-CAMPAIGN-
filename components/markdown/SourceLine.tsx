// The six sources the proposal itself cites for hard data (see Appendix B: Source Notes).
// A provenance line only ever names one of these, mechanically detected from text the source
// markdown already contains — never inferred or invented.
//
// The rendering moved to ProvenanceLine.tsx, which is where the footer chrome lives. This file
// is now the detector alone: the one thing here that ProvenanceLine's structured form cannot do.
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
