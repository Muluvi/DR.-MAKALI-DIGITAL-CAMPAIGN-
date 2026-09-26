/**
 * The ward arithmetic, as pure functions over a register.
 *
 * WHY THIS IS SEPARATE FROM register.ts. Everything here takes the register as an argument and
 * imports nothing. That is what lets lib/figures/figures.test.ts run it under plain
 * `node --test` against data/ward-register.json — the same file the application reads — with no
 * bundler, no module mocking and no second copy of the forty numbers this document rests on.
 *
 * register.ts binds these to the real register and adds the named constants. Keep the arithmetic
 * here; keep the bindings there. A number that cannot be checked from a terminal is a number this
 * proposal should not be printing.
 */
export interface RegisterWard {
  name: string;
  voters: number;
}

export interface RegisterConstituency {
  id?: string;
  name: string;
  voters: number;
  wards: RegisterWard[];
}

export interface RankedWard {
  rank: number;
  name: string;
  constituency: string;
  voters: number;
  /** Share of the countywide ward register, as a percentage. */
  share: number;
  /** Running total through this rank. */
  cumulative: number;
  cumulativeShare: number;
}

/* ------------------------------------------------------------------ the pure core */

/** Every ward, largest first, with its share and the running total — the §3.4.2 table, computed. */
export function rankWards(constituencies: RegisterConstituency[]): RankedWard[] {
  const total = countyTotal(constituencies);
  const flat = constituencies
    .flatMap((c) => c.wards.map((w) => ({ name: w.name, constituency: c.name, voters: w.voters })))
    // Ties broken by name so the ranking is stable across runs and platforms. Two wards in this
    // register share a figure (Mui and Mutha, 11,039 each), and an unstable sort would let the
    // "12 megawards" set change identity between a build and its own screenshot.
    .sort((a, b) => b.voters - a.voters || a.name.localeCompare(b.name));

  let running = 0;
  return flat.map((w, i) => {
    running += w.voters;
    return {
      rank: i + 1,
      name: w.name,
      constituency: w.constituency,
      voters: w.voters,
      share: (w.voters / total) * 100,
      cumulative: running,
      cumulativeShare: (running / total) * 100,
    };
  });
}

export const countyTotal = (constituencies: RegisterConstituency[]): number =>
  constituencies.reduce((sum, c) => sum + c.voters, 0);

export const wardCount = (constituencies: RegisterConstituency[]): number =>
  constituencies.reduce((n, c) => n + c.wards.length, 0);

/** The sum of the top `n` wards by register. */
export function topWards(constituencies: RegisterConstituency[], n: number): number {
  return rankWards(constituencies).slice(0, n).reduce((s, w) => s + w.voters, 0);
}

/** The sum of the smallest `n` wards by register. */
export function bottomWards(constituencies: RegisterConstituency[], n: number): number {
  const ranked = rankWards(constituencies);
  return ranked.slice(ranked.length - n).reduce((s, w) => s + w.voters, 0);
}

/** Registered voters across the named constituencies. Throws on a name this register lacks. */
export function blocTotal(constituencies: RegisterConstituency[], names: string[]): number {
  return names.reduce((sum, name) => {
    const c = constituencies.find((x) => x.name === name);
    if (!c) throw new Error(`register: no constituency named "${name}" — check the spelling against data/ward-register.json.`);
    return sum + c.voters;
  }, 0);
}

/**
 * Ballots at a turnout rate.
 *
 * Rounded, because a ballot is a whole thing. 532,758 at 61.7% gives 328,712, which is
 * this function's answer — the prose and the arithmetic agree here, and the figure says so.
 */
export const ballotsAt = (registered: number, turnout: number): number => Math.round(registered * turnout);
