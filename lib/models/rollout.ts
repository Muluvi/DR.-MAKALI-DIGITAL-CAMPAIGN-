/**
 * Rollout planner: the six implementation phases laid against the gazetted calendar. Pure
 * arithmetic on dates, no imports. Every length is an input; the only fixed dates are the ones the
 * user picks from the Gazette and polling day.
 *
 *   1 Discovery               starts on the start date
 *   2 Readiness               follows Discovery
 *   3 Pilot                   the centre and the pilot constituencies
 *   4 County rollout          the remaining constituencies, in waves
 *   5 Optimisation            from the end of rollout to the start of election-day readiness
 *   6 Election-day readiness  a set number of weeks before polling day, ending on polling day
 *
 * Dates are ISO calendar days (YYYY-MM-DD), handled in UTC so a time zone cannot move a day.
 */

export type RolloutInputs = {
  start: string;
  discoveryWeeks: number;
  readinessWeeks: number;
  pilotWeeks: number;
  pilotConstituencies: number;
  perWave: number;
  weeksPerWave: number;
  readinessBeforePollWeeks: number;
  /** The gazetted date rollout must finish before. */
  deadline: string;
};

export type PhaseRow = { n: number; label: string; start: string; end: string; weeks: number; note: string };
export type RolloutPlan = {
  phases: PhaseRow[];
  waves: { n: number; constituencies: number; start: string; end: string }[];
  rolloutEnd: string;
  /** Weeks between the end of rollout and the deadline: negative when rollout overruns it. */
  slackToDeadline: number;
  /** Weeks of optimisation before election-day readiness: negative when rollout runs into it. */
  optimisationWeeks: number;
  warnings: string[];
};

const DAY = 86_400_000;
const parse = (iso: string): number => Date.parse(`${iso}T00:00:00Z`);
export const isoDay = (t: number): string => new Date(t).toISOString().slice(0, 10);
export const addDays = (iso: string, days: number): string => isoDay(parse(iso) + days * DAY);
/** Whole and part weeks from a to b (b after a is positive). */
export const weeksBetween = (a: string, b: string): number => (parse(b) - parse(a)) / (7 * DAY);
export const validDay = (iso: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(iso) && Number.isFinite(parse(iso)) && isoDay(parse(iso)) === iso;

const whole = (v: number, min: number): number => (Number.isFinite(v) ? Math.max(min, Math.floor(v)) : min);

/** A span of whole weeks that starts on `start`: it ends the day before the next span starts. */
function span(start: string, weeks: number): { start: string; end: string; next: string } {
  const next = addDays(start, weeks * 7);
  return { start, end: addDays(next, -1), next };
}

export function planRollout(raw: RolloutInputs, constituencies: number, pollingDay: string): RolloutPlan {
  const i = {
    ...raw,
    discoveryWeeks: whole(raw.discoveryWeeks, 1),
    readinessWeeks: whole(raw.readinessWeeks, 1),
    pilotWeeks: whole(raw.pilotWeeks, 1),
    pilotConstituencies: Math.min(constituencies, whole(raw.pilotConstituencies, 0)),
    perWave: whole(raw.perWave, 1),
    weeksPerWave: whole(raw.weeksPerWave, 1),
    readinessBeforePollWeeks: whole(raw.readinessBeforePollWeeks, 1),
  };
  const warnings: string[] = [];

  const discovery = span(i.start, i.discoveryWeeks);
  const readiness = span(discovery.next, i.readinessWeeks);
  const pilot = span(readiness.next, i.pilotWeeks);

  const remaining = constituencies - i.pilotConstituencies;
  const waveCount = Math.ceil(remaining / i.perWave);
  const waves: RolloutPlan["waves"] = [];
  let cursor = pilot.next;
  for (let n = 1; n <= waveCount; n++) {
    const s = span(cursor, i.weeksPerWave);
    waves.push({ n, constituencies: Math.min(i.perWave, remaining - (n - 1) * i.perWave), start: s.start, end: s.end });
    cursor = s.next;
  }
  const rolloutStart = pilot.next;
  const rolloutEnd = waves.length ? waves[waves.length - 1].end : pilot.end;

  const readyStart = addDays(pollingDay, -i.readinessBeforePollWeeks * 7);
  const optimisationStart = addDays(rolloutEnd, 1);
  const optimisationWeeks = weeksBetween(optimisationStart, readyStart);
  const slackToDeadline = weeksBetween(addDays(rolloutEnd, 1), i.deadline);

  if (slackToDeadline < 0) warnings.push(`Rollout ends ${fmtWeeks(-slackToDeadline)} after the deadline you chose.`);
  if (optimisationWeeks < 0) warnings.push(`Rollout runs ${fmtWeeks(-optimisationWeeks)} into election-day readiness, when changes should be frozen.`);
  if (parse(rolloutEnd) >= parse(pollingDay)) warnings.push("Rollout does not finish before polling day.");
  if (remaining === 0) warnings.push("Every constituency is in the pilot, so there is no rollout wave.");

  const phases: PhaseRow[] = [
    { n: 1, label: "Discovery", ...pick(discovery), weeks: i.discoveryWeeks, note: "Audit executed, users mapped to roles, the team's phones and connectivity checked, legal position scoped" },
    { n: 2, label: "Readiness", ...pick(readiness), weeks: i.readinessWeeks, note: "Sign-in proven, scoped edit roles, backups and monitoring" },
    { n: 3, label: "Pilot", ...pick(pilot), weeks: i.pilotWeeks, note: `The centre and ${i.pilotConstituencies} constituenc${i.pilotConstituencies === 1 ? "y" : "ies"} run the weekly cycle on the platform` },
    {
      n: 4,
      label: "County rollout",
      start: waves.length ? rolloutStart : "",
      end: waves.length ? rolloutEnd : "",
      weeks: waves.length * i.weeksPerWave,
      note: waves.length ? `${remaining} constituenc${remaining === 1 ? "y" : "ies"} in ${waves.length} wave${waves.length === 1 ? "" : "s"}, trained by role on their own phones` : "No wave: the pilot covers every constituency",
    },
    {
      n: 5,
      label: "Optimisation",
      start: optimisationWeeks > 0 ? optimisationStart : "",
      end: optimisationWeeks > 0 ? addDays(readyStart, -1) : "",
      weeks: Math.max(0, optimisationWeeks),
      note: optimisationWeeks > 0 ? "Monthly service reports, patching, restore tests" : "No time left between rollout and readiness",
    },
    { n: 6, label: "Election-day readiness", start: readyStart, end: pollingDay, weeks: i.readinessBeforePollWeeks, note: "Change freeze, rehearsed fallbacks, on-call cover to the close of polling-day support" },
  ];

  return { phases, waves, rolloutEnd, slackToDeadline, optimisationWeeks, warnings };
}

function pick(s: { start: string; end: string }) {
  return { start: s.start, end: s.end };
}

export function fmtWeeks(w: number): string {
  const r = Math.round(w * 10) / 10;
  return `${Number.isInteger(r) ? r : r.toFixed(1)} week${r === 1 ? "" : "s"}`;
}
