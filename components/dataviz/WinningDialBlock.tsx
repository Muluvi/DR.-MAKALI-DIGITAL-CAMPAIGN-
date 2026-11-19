import { figure } from "../../lib/data/read";
import { resolveFigure } from "../../lib/card/spec";
import { TOOL_CONSTITUENCIES } from "../../lib/tools/dataset";
import { ExportableVisual } from "../visual/ExportableVisual";
import { WinningDial } from "./WinningDial";

/**
 * The scenario dial's frame: the registry's figures in, the source line out. The dial itself is
 * the client part (components/dataviz/WinningDial.tsx).
 */
export function WinningDialBlock() {
  const cons = TOOL_CONSTITUENCIES.map((c) => ({ id: c.id, name: c.name, voters: figure(`con.${c.id}`).value ?? c.voters, pool: c.pool }));
  const benchmark = resolveFigure({ id: "benchmark", label: "the working benchmark" });
  const turnout = resolveFigure({ id: "turnout.2022", label: "2022 turnout" });
  const register = resolveFigure({ id: "register.2022", label: "registered voters, 2022" });
  return (
    <ExportableVisual
      id="winning-dial"
      title={`Turn one dial: the lower the turnout, the larger the share ${benchmark.display} votes needs`}
      note="Ballots = each constituency's 2022 register × turnout. The even share is the one equal share across all eight that reaches the benchmark, the Winning-Number Simulator's own starting point. Arithmetic, not a forecast."
      figures={[register, turnout, benchmark]}
    >
      <WinningDial cons={cons} benchmark={benchmark.value ?? 0} turnout2022={turnout.value ?? 0} />
    </ExportableVisual>
  );
}
