/**
 * The figure register (brief §N), in document order. Each id is the DOM id, the CSV filename
 * (public/data/<id>.csv, written by scripts/build-csv.ts) and the table-of-figures entry.
 */
import type { FigureSpec } from "../types.ts";
import { S2 } from "./s2-data.ts";

export const REGISTER_ORDER: FigureSpec[] = [...S2];

export const REGISTER: Record<string, FigureSpec> = Object.fromEntries(REGISTER_ORDER.map((s) => [s.id, s]));
