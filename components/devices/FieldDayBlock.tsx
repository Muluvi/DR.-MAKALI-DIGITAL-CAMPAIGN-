import QRCode from "qrcode";

import { CANONICAL_ORIGIN } from "../../lib/site";
import { TOOL_STATIONS, TOOL_WARDS } from "../../lib/tools/dataset";
import { ExportableVisual } from "../visual/ExportableVisual";
import { FieldDay, type FieldRoute } from "./FieldDay";

/** How many stops one field day makes: the Voter Density Finder's busiest centres, five a day. */
const STOPS = 5;

/**
 * The field day's frame: the Voter Density Finder's own sum (registered voters by polling centre,
 * 2022) for each constituency, and a QR code per route, made here on the server.
 */
export async function FieldDayBlock() {
  const codeOf = new Map(TOOL_WARDS.map((w) => [w.id, w.code]));
  const cons = [...new Set(TOOL_STATIONS.map((s) => s.constituencyName))].sort();
  const routes: FieldRoute[] = await Promise.all(
    cons.map(async (con) => {
      const m = new Map<string, { centre: string; ward: string; wardCode: string; voters: number; streams: number }>();
      for (const s of TOOL_STATIONS) {
        if (s.constituencyName !== con) continue;
        const k = `${s.ward}|${s.centre}`;
        const cur = m.get(k) ?? { centre: s.centre, ward: s.wardName, wardCode: codeOf.get(s.ward) ?? "", voters: 0, streams: 0 };
        cur.voters += s.voters;
        cur.streams += 1;
        m.set(k, cur);
      }
      const stops = [...m.values()].sort((a, b) => b.voters - a.voters).slice(0, STOPS);
      const link = `${CANONICAL_ORIGIN}/tools/ward-dossier/${stops[0].wardCode}`;
      const qr = await QRCode.toString(link, { type: "svg", margin: 0, errorCorrectionLevel: "M" });
      return { constituency: con, stops, qr, link };
    }),
  );
  // Busiest constituency first: the route a reader most likely wants.
  routes.sort((a, b) => b.stops.reduce((n, s) => n + s.voters, 0) - a.stops.reduce((n, s) => n + s.voters, 0));
  return (
    <ExportableVisual
      id="field-day"
      illustrative
      title="A field day by matatu: the five busiest polling centres, and a pass for the first stop"
      note="Pick a constituency. The stops are its busiest polling centres by registered voters, as the Voter Density Finder ranks them."
      source="Source: IEBC 2022 register of voters per polling station (Tier 1). Centre totals summed by the site."
      card={{ type: "roster", params: { set: "density" } }}
    >
      <FieldDay routes={routes} />
    </ExportableVisual>
  );
}
