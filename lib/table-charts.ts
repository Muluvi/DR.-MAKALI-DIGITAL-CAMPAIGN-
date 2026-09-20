/**
 * Which tables may draw a chart, and which may show an aggregate. Both are opt-in, by name.
 *
 * WHY THIS FILE EXISTS.
 *
 * Both behaviours used to be automatic: any column whose every cell parsed as a bare figure got a
 * Chart toggle and an "Avg / Max Peak / Combined" strip. The test was syntactic — it asked whether
 * the cells looked like numbers, never whether they were the kind of number you may add together.
 * On the live site that produced, among others:
 *
 *   - "Combined 68.7%"  — Irene Kasalu's poll shares from two different rounds, added.
 *   - "Combined 68.5%"  — Dr. Mulu's three poll shares, added.
 *   - "Avg WS 7 / Max Peak 14 / Combined 106" — the workstream NUMBERS, averaged and totalled.
 *   - "Combined 447,940 / 511,590 / 832,002" — zone tables whose own Total row was counted again.
 *
 * A share of a sample is not addable to another share of another sample. An identifier is not a
 * quantity. A column containing its own total cannot be totalled. None of those facts is visible
 * to a regular expression, and none of them is a bug in the parsing — the parsing was answering a
 * question that cannot be answered from the characters in the cell.
 *
 * So the aggregate is now a claim somebody makes deliberately, about a named table, with the
 * aggregation stated and the total rows excluded. Nothing here is inferred. A table absent from
 * this file gets no chart and no aggregate, which is the correct default: a table that cannot
 * honestly be charted is a table, and that is a complete answer.
 *
 * HOW A TABLE IS NAMED. By the text of its header row, lower-cased and joined — the markdown is
 * under a content-integrity guard (scripts/verify-content-integrity.mjs) and must not be edited to
 * carry a marker. Matching on the header keeps the opt-in out of the prose while still naming one
 * specific table. Where two tables share a header signature they share an entry, which is correct:
 * the same columns mean the same thing.
 */

export type Aggregation = "sum" | "mean" | "max" | "min";

export interface TableChartSpec {
  /**
   * How the marks are drawn. `bar` is horizontal with direct labels, which is what a ranked
   * category list wants; nothing else is offered, because nothing else has been asked for by a
   * table in this document.
   */
  chart?: "bar";
  /**
   * Which column carries the measure, by header text (case-insensitive, matched on inclusion).
   * Required for a chart. Naming it rather than sniffing it is the point of this file.
   */
  valueColumn?: string;
  /** Which column names the marks. Defaults to the first column that is not the measure. */
  labelColumn?: string;
  /**
   * The aggregate to show, and the words to show it under. Omitted means no aggregate — which is
   * the case for every table in this document at the time of writing.
   *
   * `label` is mandatory alongside it and must say what the aggregation means in the table's own
   * terms ("Total registered voters across all 40 wards"), never a bare "Combined". The strip that
   * this replaced failed precisely because "Combined" is a word that fits any column.
   */
  aggregate?: { of: Aggregation; label: string };
  /**
   * Row labels that are totals or subtotals and must be excluded from any aggregate or chart.
   * Matched case-insensitively on the row's first cell. This is why the zone tables were reporting
   * 832,002 for a county of 532,758 — the Total row was a data point.
   */
  excludeRows?: string[];
  /** Why this table earned a chart. Read by nobody at runtime; read by the next person here. */
  note?: string;
}

/** Header signature: every header cell, lower-cased, trimmed, joined with "|". */
export function tableSignature(headers: string[]): string {
  return headers.map((h) => h.toLowerCase().replace(/\s+/g, " ").trim()).join("|");
}

/**
 * The opt-in list.
 *
 * It is deliberately short, and it is meant to stay short. Under the conversion map the tables
 * that carry an argument become purpose-built figures with their own data files, their own source
 * and tier lines and their own "View the data" disclosure — a generic bar chart bolted onto a
 * markdown table is what those figures replace, not something to add alongside them.
 *
 * The one table here is the 40-ward register ranking. It is a genuine ranked magnitude of one unit
 * (registered voters), it is the table §3.4.2 is built around, and its own cumulative column means
 * a reader is already being asked to see it as a distribution.
 */
export const TABLE_CHARTS: Record<string, TableChartSpec> = {
  "rank|ward|constituency|registered voters|% of county register|cumulative voters|cumulative %": {
    chart: "bar",
    valueColumn: "registered voters",
    labelColumn: "ward",
    // No aggregate. The column's own last cumulative cell already states 532,758 and 100.00%, so a
    // "Combined" underneath it would be the same figure a second time — and the cumulative column
    // says it better, because it says it in order.
    note: "§3.4.2. One unit, one measure, already presented as a ranked distribution.",
  },
};

export function chartSpecFor(headers: string[]): TableChartSpec | null {
  return TABLE_CHARTS[tableSignature(headers)] ?? null;
}
