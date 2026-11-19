import { COUNTY } from "../../lib/premium/county";
import { ExportableVisual } from "../visual/ExportableVisual";
import { BriefMemo, CommandMap, Kanban } from "./LiveBoards";

/** The command map's frame: the real ward boundaries in, the live records drawn on them. */
export function CommandMapBlock() {
  const wards = COUNTY.map((c) => ({ id: c.tile.id, name: c.tile.name, path: c.path }));
  return (
    <ExportableVisual id="command-map" title="The command map: where the team's field reports come from" note="Each ward's brightness is how many field reports the team has saved for it." source="Source: the team's field and sentiment records, saved in the workspace.">
      <CommandMap wards={wards} />
    </ExportableVisual>
  );
}

export function KanbanBlock() {
  return (
    <ExportableVisual id="implementation-board" title="This week's work, from planned to done" note="The team's implementation records, in the columns of their own status." source="Source: the team's implementation records, saved in the workspace.">
      <Kanban />
    </ExportableVisual>
  );
}

export function BriefMemoBlock() {
  return (
    <ExportableVisual id="brief-memo" title="The weekly brief, as it would print" note="The latest brief the team has saved, laid out as a memo." source="Source: the team's weekly briefs, saved in the workspace.">
      <BriefMemo />
    </ExportableVisual>
  );
}
