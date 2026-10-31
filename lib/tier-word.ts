/**
 * Plain words for the source tiers. The code keeps "T1" / "T2" / "T3" as data; the reader never
 * sees a code. Tier 1 is an official body, Tier 2 established media, Tier 3 a single unconfirmed
 * source (Annex A, "The three source tiers").
 */
export const TIER_WORD: Record<string, string> = {
  T1: "Official",
  T2: "Reported",
  T3: "Unconfirmed",
  "1": "Official",
  "2": "Reported",
  "3": "Unconfirmed",
};

export function tierWord(tier: string | number | null | undefined): string {
  if (tier === null || tier === undefined) return "";
  return TIER_WORD[String(tier)] ?? String(tier);
}
