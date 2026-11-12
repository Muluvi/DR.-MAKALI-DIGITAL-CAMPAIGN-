/**
 * The rollout planner's starting values, shared by its page and its embed in the story. They are
 * placeholders for the conversation, not a plan Firefly has committed to: every one is an input on
 * the page, and the method note says so.
 */
import { RACE_CALENDAR } from "../public-data.ts";
import { addDays, type RolloutInputs } from "./rollout.ts";

export const ROLLOUT_DEFAULTS: Omit<RolloutInputs, "start" | "deadline"> = { discoveryWeeks: 4, readinessWeeks: 6, pilotWeeks: 6, pilotConstituencies: 2, perWave: 3, weeksPerWave: 3, readinessBeforePollWeeks: 4 };

/** The first deadline offered: the day the Governor campaign period starts, read from the Gazette calendar. */
export const CAMPAIGN_START = RACE_CALENDAR.find((c) => /Governor campaign period starts/.test(c.event));

/** Today in Nairobi, as an ISO day. */
export const nairobiToday = (): string => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(new Date());

/** The next Monday on or after today in Nairobi. */
export function nextMonday(): string {
  const today = nairobiToday();
  const dow = new Date(`${today}T00:00:00Z`).getUTCDay();
  return addDays(today, (8 - dow) % 7);
}
