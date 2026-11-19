import { PUBLIC_SOURCES, RACE_CALENDAR } from "../../lib/public-data";
import { ExportableVisual } from "../visual/ExportableVisual";
import { RouteTimeline } from "./RouteTimeline";

/** The route's frame: the Gazette calendar in, the source line out. */
export function RouteTimelineBlock() {
  return (
    <ExportableVisual
      id="route-to-2027"
      title="The road to 2027, stop by stop"
      note="Every Gazette deadline on the way to the governor's race, in order. The matatu sits at the next stop."
      source={`Source: ${PUBLIC_SOURCES.calendar.label} (Tier 1). Passed and upcoming are worked out from the date on this device.`}
      card={{ type: "countdown" }}
    >
      <RouteTimeline stops={RACE_CALENDAR} />
    </ExportableVisual>
  );
}
