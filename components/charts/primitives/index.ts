/**
 * Hand-rolled chart primitives — the replacement for Recharts (docs/VISUAL-FEATURES.md F-30).
 *
 * Recharts cost 123 KB gzipped as it was imported here, plus eleven transitive d3-* packages,
 * to draw bars, lines and one scatter. The arithmetic is in docs/TRIAGE.md §5.1.
 *
 * Three rules every primitive here follows:
 *   1. Axis ticks, category labels and legends are HTML text, never SVG text. SVG type scales
 *      with its viewBox, and a 10px tick becomes a 5px tick on the phone this is read on.
 *   2. Bars grow from their baseline, lines draw forward. Motion encodes the reading.
 *   3. Under reduced motion, and with JavaScript disabled, every mark renders at its final value.
 *      A bar caught at zero is showing false data.
 *
 * Each also renders its own accessible equivalent — a list or a table beneath the chart — so the
 * figures are reachable by in-page search, by assistive technology, and by a reader whose device
 * never ran the chart at all.
 */
export { BarRows } from "./BarRows";
export { BarColumns } from "./BarColumns";
export { LineSeries, type Series } from "./LineSeries";
export { ScatterQuadrant, type QuadrantMark } from "./ScatterQuadrant";
export { PlotFrame, type Scale } from "./PlotFrame";
export { InspectPanel, MarkList } from "./InspectPanel";
export type { Mark } from "./types";
