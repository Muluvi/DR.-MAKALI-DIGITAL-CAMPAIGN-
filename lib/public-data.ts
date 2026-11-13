/**
 * The Kitui public data pack, read by the planning tools. Generated from data/public-2026-11/ by
 * scripts/build-public-data.mjs, which fails `npm run verify` if the pack stops reconciling.
 */
import summary from "@/data/kitui-public.generated.json";

export type PublicWard = { code: string; name: string; constituencyCode: string; constituency: string; stations: number; centres: number; voters: number; population: number; areaSqKm: number; mcaLimit: number };
type PublicConstituency = { code: string; name: string; wards: number; stations: number; centres: number; voters: number; mpLimit: number };
export type CalendarEntry = { date: string; event: string; appliesTo: string; source: string };

export const PUBLIC_RETRIEVED: string = summary.retrieved;
export const PUBLIC_WARDS = summary.wards as PublicWard[];
export const PUBLIC_CONSTITUENCIES = summary.constituencies as PublicConstituency[];
export const RACE_CALENDAR = summary.calendar as CalendarEntry[];
export const countyTotals = PUBLIC_WARDS.reduce((t, w) => ({ stations: t.stations + w.stations, centres: t.centres + w.centres, voters: t.voters + w.voters }), { stations: 0, centres: 0, voters: 0 });

export const PUBLIC_SOURCES = {
  stations: { label: "IEBC register of voters per polling station, 2022", href: "https://www.iebc.or.ke/docs/rov_per_polling_station.pdf" },
  wards: { label: "IEBC register of voters per ward, 2022", href: "https://www.iebc.or.ke/docs/rov_per_caw.pdf" },
  limits: { label: "Gazette Notice 12251, 7 August 2026: ward population and area", href: "https://www.iebc.or.ke/uploads/resources/QUTuQXad27.pdf" },
  calendar: { label: "Gazette Notices 13497 to 13503, 20 August 2026", href: "https://www.iebc.or.ke/uploads/resources/3MMJlcBEs1.pdf" },
  sms: { label: "Communications Authority political messaging guidelines, July 2017", href: "https://www.ca.go.ke/sites/default/files/2023-06/Guidelines-on-Prevention-of-Dissemination-of-Undesirable-Bulk-and-Premium-Rate-Political-Messages-and-Political-Social-Media-Content-Via-Electronic-Networks-1.pdf" },
} as const;
