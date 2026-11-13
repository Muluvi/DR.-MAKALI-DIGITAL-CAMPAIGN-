/**
 * Winning number: votes reached against the working benchmark, constituency by constituency.
 *
 * Pure arithmetic, no imports: the page, the tests and any later explanation layer call the same
 * functions, so one set of inputs always gives one outcome. Votes = register × turnout × share.
 */

export type Cell = { turnout: number; share: number };
export type Scenario = Record<string, Cell>;
export type RegisterRow = { code: string; voters: number };
type Totals = { ballots: number; votes: number };

export const clampPct = (v: number): number => Math.min(100, Math.max(0, v));

/**
 * The even share of ballots that reaches the benchmark at one county turnout, rounded up to one
 * decimal place so the starting scenario never falls short by rounding.
 */
export function neutralShare(rows: RegisterRow[], benchmark: number, turnout: number): number {
  const voters = rows.reduce((a, c) => a + c.voters, 0);
  if (voters <= 0 || turnout <= 0) return 0;
  return clampPct(Math.ceil((benchmark / ((voters * turnout) / 100)) * 1000) / 10);
}

/** Every constituency at the same turnout and the neutral share. */
export function startingScenario(rows: RegisterRow[], benchmark: number, turnout: number): Scenario {
  const share = neutralShare(rows, benchmark, turnout);
  return Object.fromEntries(rows.map((c) => [c.code, { turnout, share }]));
}

/** Ballots cast and votes won, summed across constituencies. A constituency missing from the scenario counts as zero. */
export function scenarioTotals(rows: RegisterRow[], s: Scenario): Totals {
  return rows.reduce(
    (t, c) => {
      const cell = s[c.code];
      if (!cell) return t;
      const ballots = (c.voters * cell.turnout) / 100;
      return { ballots: t.ballots + ballots, votes: t.votes + (ballots * cell.share) / 100 };
    },
    { ballots: 0, votes: 0 },
  );
}

