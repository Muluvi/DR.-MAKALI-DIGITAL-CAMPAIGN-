/**
 * The administrative reference data for the Campaigner Network: Kitui's 8 constituencies, 40 wards
 * and 247 villages, from the Kitui County Villages Act, 2015 Schedule
 * (data/network/kitui-villages.v1.json, built by scripts/network/build-villages.mjs).
 *
 * `village_code` is the key. Several village names repeat in different wards (Mutanda, Mathyakani,
 * Ngiluni, Kitoo), so nothing here keys, groups or de-duplicates by name.
 *
 * Villages are administrative units, not IEBC units. Nothing here maps a village to a polling
 * centre or station, and no voter figure is stated for a village.
 *
 * Public data only: this module holds no person, contact or report, and is safe in a client bundle.
 */
import data from "../../data/network/kitui-villages.v1.json" with { type: "json" };
import reconciliation from "../../data/network/ward-reconciliation.json" with { type: "json" };

export interface Village {
  constituency: string;
  ward_code: number;
  ward: string;
  village_code: number;
  village_name: string;
  source: string;
  /** Places the gazetted name lists in brackets: sub-areas of the village, searchable. */
  sub_areas: string[];
  search_terms: string[];
}

export interface WardRef {
  constituency: string;
  ward_code: number;
  ward: string;
  first_village_code: number;
  last_village_code: number;
  village_count: number;
}

export interface WardMatch {
  act_ward_code: number;
  act_ward: string;
  act_constituency: string;
  register_slug: string;
  register_ward: string;
  register_constituency: string;
  boundary_wardcode: number;
  match: "exact" | "spelling" | "name" | "code";
  note?: string;
}

export const REFERENCE_VERSION: number = data.version;
export const ACT_SOURCE: string = data.source;
export const CONSTITUENCIES: string[] = data.constituencies;
export const WARDS: WardRef[] = data.wards;
export const VILLAGES: Village[] = data.villages;
export const WARD_MATCHES: WardMatch[] = reconciliation.wards as WardMatch[];

export const VILLAGE_BY_CODE: ReadonlyMap<number, Village> = new Map(VILLAGES.map((v) => [v.village_code, v]));
export const WARD_BY_CODE: ReadonlyMap<number, WardRef> = new Map(WARDS.map((w) => [w.ward_code, w]));
export const MATCH_BY_CODE: ReadonlyMap<number, WardMatch> = new Map(WARD_MATCHES.map((m) => [m.act_ward_code, m]));

export const wardsOf = (constituency: string): WardRef[] => WARDS.filter((w) => w.constituency === constituency);
export const villagesOf = (ward_code: number): Village[] => VILLAGES.filter((v) => v.ward_code === ward_code);
export const constituencyOfWard = (ward_code: number): string | null => WARD_BY_CODE.get(ward_code)?.constituency ?? null;

/** Lower case, apostrophes and hyphens dropped, spaces collapsed. The same rule the build uses. */
export const normalise = (s: string): string =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/['’‘`-]/g, "").replace(/\s+/g, " ").trim();

export interface VillageAlias {
  village_code: number;
  alias: string;
}

/**
 * Search by official name, any slash part, any bracketed sub-area, or a local alias an authorised
 * user added. An alias only finds a village; it never changes its code or its official name.
 */
export function searchVillages(query: string, aliases: VillageAlias[] = [], limit = 20): Village[] {
  const q = normalise(query);
  if (!q) return [];
  // Spaces are compared both ways, so "kwa wewa" finds "Kwa-wewa" and "kwamutonga" finds "Kwa Mutonga".
  const flat = (s: string) => s.replace(/ /g, "");
  const hit = (t: string) => t.includes(q) || flat(t).includes(flat(q));
  const aliasHits = new Set(aliases.filter((a) => hit(normalise(a.alias))).map((a) => a.village_code));
  const scored: { v: Village; s: number }[] = [];
  for (const v of VILLAGES) {
    let s = 0;
    if (v.search_terms.some((t) => t === q || flat(t) === flat(q))) s = 3;
    else if (v.search_terms.some((t) => t.startsWith(q) || flat(t).startsWith(flat(q)))) s = 2;
    else if (v.search_terms.some(hit)) s = 1;
    if (aliasHits.has(v.village_code)) s = Math.max(s, 2);
    if (s) scored.push({ v, s });
  }
  return scored.sort((a, b) => b.s - a.s || a.v.village_code - b.v.village_code).slice(0, limit).map((x) => x.v);
}
