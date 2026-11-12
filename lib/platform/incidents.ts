/**
 * Platform incidents, as /status lists them: anything that stopped the team working or put data at
 * risk. Firefly adds an entry when an incident opens and closes it with what was done; the list is
 * part of the monthly service report. Newest first.
 *
 * Kept in the repository until monitoring is connected (Readiness phase), so every entry is
 * reviewed and dated like any other change.
 */
export type Incident = {
  opened: string; // ISO date
  closed: string | null;
  title: string;
  impact: string;
  done: string;
};

export const INCIDENTS: Incident[] = [];
