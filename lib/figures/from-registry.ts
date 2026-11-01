/**
 * The bridge from the registry (lib/data/figures.ts) to a legacy figure point.
 *
 * A legacy figure (lib/figures/*.ts, drawn by components/figures/registry.tsx) used to carry its
 * own copy of every number. This turns a registry id into a FigurePoint instead, so the value, the
 * tier, the source and the as-of date all come from the one record a refresh updates.
 */
import { figure } from "../data/figures";
import { formatFigure, type FormatMod } from "../data/format";

/** The printed form of a registry figure, as prose prints it: "447,007". */
export const regFmt = (id: string, mod: FormatMod = ""): string => formatFigure(figure(id), mod);

