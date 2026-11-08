"use client";

import { ToolActions } from "./ToolActions";

export function StationDownload({ ward, stations }: { ward: string; stations: { code: string; centre: string; station: string; voters: number }[] }) {
  const slug = ward.toLowerCase().replace(/[^a-z]+/g, "-");
  return <ToolActions filename={`${slug}-polling-stations-2022.csv`} rows={() => [["code", "registration_centre", "polling_station", "registered_voters"], ...stations.map((s) => [s.code, s.centre, s.station, s.voters])]} />;
}
