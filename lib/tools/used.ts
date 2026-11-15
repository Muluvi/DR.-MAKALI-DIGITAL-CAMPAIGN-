/**
 * Which tools this reader has opened, on this device (localStorage, "sx-used-<slug>").
 *
 * The flag was "1". Since the flow pass (WP11) it holds the time the tool was last opened, so the
 * Tools panel can list the tools used most recently first. An old "1" still reads as used, with no
 * time, and sorts after every timed one. Storage can be unavailable (private mode, blocked site
 * data): every read and write is guarded, and nothing breaks without it.
 */
const key = (slug: string) => `sx-used-${slug}`;

/** When the tool was last opened: a time in ms, 0 for an old flag with no time, or null if never. */
export function usedAt(slug: string): number | null {
  try {
    const v = localStorage.getItem(key(slug));
    if (v === null) return null;
    const n = Number(v);
    return v === "1" || !Number.isFinite(n) ? 0 : n;
  } catch {
    return null;
  }
}

export const isUsed = (slug: string): boolean => usedAt(slug) !== null;

export function markUsed(slug: string): void {
  try {
    localStorage.setItem(key(slug), String(Date.now()));
  } catch {
    /* storage can be unavailable */
  }
}

/** The used tools' slugs, most recently opened first. */
export function recentlyUsed(slugs: readonly string[]): string[] {
  return slugs
    .map((s) => ({ s, at: usedAt(s) }))
    .filter((x): x is { s: string; at: number } => x.at !== null)
    .sort((a, b) => b.at - a.at)
    .map((x) => x.s);
}
