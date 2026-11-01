/**
 * Reading the registry from a component or a data file: the one way site code gets a number.
 *
 * A component never types a figure the registry holds (consolidation pass, Step 2; enforced by
 * scripts/consolidation/scan-literals.mjs --check). It names the figure instead:
 *
 *   val("register.2022")            532758       the value, for arithmetic and chart scales
 *   fmt("register.2022")            "532,758"    the printed form, as {{register.2022}} prints it
 *   fmt("budget.total", "bn")       "13.79"      a scaled form (see lib/data/format.ts)
 *   figure("register.2022")         the whole record: value, unit, tier, source, state, date
 */
import { figure } from "./figures.ts";
import { formatFigure, type FormatMod } from "./format.ts";

export { figure };

/** The value, required: a figure with no value (a named gap) throws, so a chart cannot draw a gap as zero. */
export function val(id: string): number {
  const v = figure(id).value;
  if (v === null) throw new Error(`registry: ${id} has no value`);
  return v;
}

/** The printed form of a figure, exactly as its {{token}} prints in prose. */
export const fmt = (id: string, mod: FormatMod = ""): string => formatFigure(figure(id), mod);
