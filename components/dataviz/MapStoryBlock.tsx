import { COUNTY } from "../../lib/premium/county";
import { resolveFigure } from "../../lib/card/spec";
import { TOOL_WARDS } from "../../lib/tools/dataset";
import { ExportableVisual } from "../visual/ExportableVisual";
import { MapStory, type StoryStep, type StoryWard } from "./MapStory";

/**
 * The map story's frame (visual upgrade, C15): the real ward boundaries (lib/premium/county.ts),
 * Map Studio's own ward data (lib/tools/dataset.ts), and captions whose numbers are registry
 * figures. Each layer is shaded by fifths of the 40 wards, the way Map Studio shades it.
 */
const fifthOf = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return (v: number) => Math.min(4, Math.floor((sorted.filter((s) => s < v).length / values.length) * 5));
};

export function MapStoryBlock() {
  const byId = new Map(TOOL_WARDS.map((w) => [`ward.${w.id}`, w]));
  const q = {
    voters: fifthOf(TOOL_WARDS.map((w) => w.voters)),
    stations: fifthOf(TOOL_WARDS.map((w) => w.stations)),
    projects: fifthOf(TOOL_WARDS.map((w) => w.projects)),
  };
  const wards: StoryWard[] = COUNTY.map((c) => {
    const w = byId.get(c.tile.id)!;
    return { id: c.tile.id, name: c.tile.name, path: c.path, zone: w.zone, pool: w.pool, q: { voters: q.voters(w.voters), stations: q.stations(w.stations), projects: q.projects(w.projects) } };
  });

  // The pool's bounding box, from the ward rings, for the last step's close-up.
  const pts = COUNTY.filter((c) => byId.get(c.tile.id)?.pool).flatMap((c) => [...c.path.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const poolCam = { s: Math.min(1.6, 0.92 * Math.min(600 / (x1 - x0), 1000 / (y1 - y0))), cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };

  const top12 = resolveFigure({ id: "pareto.top12.share", label: "" });
  const stations = resolveFigure({ id: "register.polling-stations", label: "" });
  const pool = resolveFigure({ id: "pool", label: "" });
  const poolShare = resolveFigure({ id: "pool.share", label: "" });
  const register = resolveFigure({ id: "register.2022", label: "" });
  const projects = TOOL_WARDS.reduce((n, w) => n + w.projects, 0);

  const steps: StoryStep[] = [
    { layer: "voters", title: "Where the voters are", text: `${register.display} registered voters, and the twelve largest wards hold ${top12.display} of them. The darker the ward, the more voters.` },
    { layer: "stations", title: "Where they vote", text: `${stations.display} polling stations. They follow the people: the crowded wards carry the most.` },
    { layer: "projects", title: "Where the county has built", text: `${projects.toLocaleString("en-KE")} itemised county projects placed on a single ward. Some wards with many voters have few.` },
    { layer: "zones", title: "Three regions", text: "The anchor around Kitui town, the Mwingi block to the north, and the arid belt to the east and south. Kitui Rural sits in none." },
    { layer: "pool", title: "Where he has never held office", text: `Mwingi North, West, Central and Kitui South: ${pool.display} registered voters, ${poolShare.display} of the county.` },
  ];

  return (
    <ExportableVisual
      id="map-story"
      title="Kitui in five maps: voters, polling stations, county projects, regions, and the pool"
      note="Scroll: the map changes as each caption passes."
      figures={[register, top12, stations, pool, poolShare]}
      source="Source: IEBC 2022 register and polling-station list (Tier 1); County Government of Kitui three-year scorecard, itemised projects placed on one ward; ward boundaries: Omare and Omare (2017), digitised from the IEBC ward delimitation, CC BY 4.0. Fifths and shares calculated by the site."
      card={{ type: "map", params: { layer: "voters" } }}
    >
      <MapStory wards={wards} steps={steps} poolCam={poolCam} />
    </ExportableVisual>
  );
}
