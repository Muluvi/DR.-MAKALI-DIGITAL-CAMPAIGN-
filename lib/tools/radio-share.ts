/**
 * Which registry figure holds each station's regional listener share (CA/KARF, Lower Eastern,
 * Tier 2). Stations without one are not measured. Read by the Radio Planner and the radio set
 * (components/devices/RadioSet.tsx), so the two can never disagree.
 */
export const RADIO_SHARE: Record<string, string> = { "Musyi FM": "radio.musyi", "Athiani FM": "radio.athiani", "Mbaitu FM": "radio.mbaitu", "County FM": "radio.county", "KBC Mwatu FM": "radio.mwatu" };

/** The Radio Planner's starting plan: ten spots a week on each priority station, none elsewhere. */
export const startingSpots = (posture: string) => (/^Priority/.test(posture) ? 10 : 0);
