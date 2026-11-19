import { resolveFigure } from "../../lib/card/spec";
import { TOOL_WARDS } from "../../lib/tools/dataset";
import { ExportableVisual } from "../visual/ExportableVisual";
import { WardLocator } from "./Locator";
import { RevealCard } from "./RevealCard";

/** The pool as a question first (C26), with its wards on the locator map (C24). */
export function PoolReveal() {
  const pool = resolveFigure({ id: "pool", label: "registered voters" });
  const share = resolveFigure({ id: "pool.share", label: "of the county's register" });
  const wards = resolveFigure({ id: "pool.wards", label: "wards" });
  const register = resolveFigure({ id: "register.2022", label: "registered voters, 2022" });
  return (
    <ExportableVisual
      id="pool-reveal"
      title="The pool, as a question"
      figures={[register, pool, share, wards]}
      card={{ type: "fact", params: { id: "pool" } }}
    >
      <RevealCard
        question="How many registered voters live in the four constituencies where Dr. Mulu has never held office?"
        answer={
          <p className="rv__ans">
            <strong className="rv__big">{pool.display}</strong> registered voters in {wards.display} wards of Mwingi North, West, Central and Kitui South: {share.display} of the county.
          </p>
        }
        aside={<WardLocator wards={TOOL_WARDS.filter((w) => w.pool).map((w) => w.id)} label="Map of Kitui with the pool's wards highlighted" size={150} tone="earth" className="rv__map" />}
      />
    </ExportableVisual>
  );
}
