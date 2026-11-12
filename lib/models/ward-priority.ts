/**
 * Ward priority: the 40 wards ranked by weights the user sets. Pure arithmetic, no imports.
 *
 * Each criterion is scaled across the 40 wards to 0–1 (lowest ward 0, highest 1), so a criterion
 * measured in thousands of voters cannot outweigh one measured in tens of stations. A ward's score
 * is the weighted mean of its scaled criteria, times 100. Equal scores keep register order, so the
 * ranking is stable.
 *
 * It ranks places, never people: every input is a ward-level count from a public source.
 */

export type PriorityWard = {
  code: string;
  name: string;
  slug: string;
  constituency: string;
  constituencyId: string;
  voters: number;
  stations: number;
  /** County projects in the itemised scorecard that resolve to this ward alone. */
  projects: number;
  /** 1 when the ward is in one of the four constituencies where he has never held office. */
  pool: 0 | 1;
};

export const CRITERIA = [
  { key: "voters", label: "Register size", hint: "Registered voters, 2022" },
  { key: "pool", label: "Where he has not held office", hint: "Wards in Mwingi North, West, Central and Kitui South" },
  { key: "stations", label: "Polling stations", hint: "Official station count, 2022" },
  { key: "projects", label: "County projects to cite", hint: "Itemised scorecard projects placed in the ward" },
] as const;

export type CriterionKey = (typeof CRITERIA)[number]["key"];
export type Weights = Record<CriterionKey, number>;
export type Ranked = { ward: PriorityWard; score: number; rank: number; parts: Record<CriterionKey, number> };

export const KEYS: CriterionKey[] = CRITERIA.map((c) => c.key);

/** Scale one criterion across the wards to 0–1. When every ward has the same value, all score 0. */
function scaler(wards: PriorityWard[], key: CriterionKey): (w: PriorityWard) => number {
  const vals = wards.map((w) => w[key]);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  return hi === lo ? () => 0 : (w) => (w[key] - lo) / (hi - lo);
}

/** Weights are clamped to 0–100; a negative or non-number weight counts as 0. */
export function cleanWeights(w: Partial<Weights>): Weights {
  return Object.fromEntries(KEYS.map((k) => [k, Math.min(100, Math.max(0, Number.isFinite(w[k]) ? Number(w[k]) : 0))])) as Weights;
}

export function rankWards(wards: PriorityWard[], weights: Partial<Weights>): Ranked[] {
  const w = cleanWeights(weights);
  const sum = KEYS.reduce((a, k) => a + w[k], 0);
  const scale = Object.fromEntries(KEYS.map((k) => [k, scaler(wards, k)])) as Record<CriterionKey, (x: PriorityWard) => number>;
  const scored = wards.map((ward, order) => {
    const parts = Object.fromEntries(KEYS.map((k) => [k, sum > 0 ? (100 * w[k] * scale[k](ward)) / sum : 0])) as Record<CriterionKey, number>;
    return { ward, order, parts, score: KEYS.reduce((a, k) => a + parts[k], 0) };
  });
  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  return scored.map(({ ward, parts, score }, i) => ({ ward, parts, score, rank: i + 1 }));
}

/** The criterion that contributes most to a ward's score, or null when every weight is 0. */
export function leadingCriterion(r: Ranked): CriterionKey | null {
  let best: CriterionKey | null = null;
  for (const k of KEYS) if (r.parts[k] > 0 && (best === null || r.parts[k] > r.parts[best])) best = k;
  return best;
}
