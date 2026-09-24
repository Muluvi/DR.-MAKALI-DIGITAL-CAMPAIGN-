"use client";

import React, { useId, useState } from "react";
import { Search, ArrowUpDown, BarChart3, Table, Download, MoreHorizontal } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";

import { SourceLine, detectSources } from "./SourceLine";
import { MatrixMarks } from "./MatrixMarks";
import ModelVariablesDrawer from "./ModelVariablesDrawer";
import { useIsMobile, useMounted } from "../../hooks/use-mobile";
import { chartSpecFor } from "../../lib/table-charts";

function getDeepText(node: any): string {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getDeepText).join("");
  if (typeof node === "object" && node.props) {
    if (node.props.children) return getDeepText(node.props.children);
    // HighlightedText (used inside <strong>/<p>/<li> to linkify cross-refs and badge stated
    // figures) takes its string as `text`, not `children` — without this fallback, any bold
    // or paragraph text routed through it goes invisible to the header/sort/search/chart logic.
    if (node.props.text) return String(node.props.text);
    if (node.props.value) return String(node.props.value);
  }
  return "";
}

function findCells(node: any, types: string[]): any[] {
  if (!node) return [];
  if (typeof node !== "object") return [];
  if (types.includes(node.type) || (node.type && typeof node.type === "string" && types.includes(node.type)) || (node.type && node.type.name && types.includes(node.type.name))) {
    return [node];
  }
  if (node.props && node.props.children) {
    return React.Children.toArray(node.props.children).flatMap(child => findCells(child, types));
  }
  return [];
}

/** RFC 4180 quoting: wrap when the cell contains a delimiter, and double any inner quote. */
function csvCell(value: string): string {
  const text = value.replace(/\s+/g, " ").trim();
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function slugForFile(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "table";
}

export function InteractiveTable({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showChart, setShowChart] = useState(false);
  // Scopes the shared-element ids to this matrix, so two matrices on one page cannot claim each
  // other's rows when both are toggled.
  const matrixId = useId();
  const [showAllRows, setShowAllRows] = useState(false);

  const childrenArray = React.Children.toArray(children);
  const theadElement = childrenArray.find((child: any) => child?.type === "thead");
  const tbodyElement = childrenArray.find((child: any) => child?.type === "tbody");

  const ths = React.useMemo(() => {
    return theadElement ? findCells(theadElement, ["th"]) : [];
  }, [theadElement]);

  const rowElements = React.useMemo(() => {
    return tbodyElement ? findCells(tbodyElement, ["tr"]) : [];
  }, [tbodyElement]);

  const parsedRows = React.useMemo(() => {
    return rowElements.map((tr: any) => findCells(tr, ["td", "th"]));
  }, [rowElements]);

  const toggleSort = (colIdx: number) => {
    if (sortColumn === colIdx) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(colIdx);
      setSortDirection("asc");
    }
  };

  const sortedRows = React.useMemo(() => {
    if (sortColumn === null) return parsedRows;
    const rowsCopy = [...parsedRows];
    rowsCopy.sort((a, b) => {
      const aCell = a[sortColumn];
      const bCell = b[sortColumn];
      const aText = getDeepText(aCell);
      const bText = getDeepText(bCell);

      const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ""));
      const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ""));

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      }
      return sortDirection === "asc" ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });
    return rowsCopy;
  }, [parsedRows, sortColumn, sortDirection]);

  const filteredRows = React.useMemo(() => {
    if (!searchTerm) return sortedRows;
    const term = searchTerm.toLowerCase();
    return sortedRows.filter(row =>
      row.some(cell => getDeepText(cell).toLowerCase().includes(term))
    );
  }, [sortedRows, searchTerm]);

  // Long registers — the 40-ward table, the model data dictionary — are reference material, and
  // rendering all of them inline turns a section into a scroll. Show a readable first screen and
  // let the reader ask for the rest. Filtering shows every match: someone who has typed a query
  // is looking for a specific row, not browsing.
  const tableSources = React.useMemo(() => {
    const allText = [...ths, ...rowElements].map(getDeepText).join(" ");
    return detectSources(allText);
  }, [ths, rowElements]);

  const downloadCsv = React.useCallback(() => {
    const headers = ths.map((th: any) => getDeepText(th.props.children));
    // Export what the reader is actually looking at: the current sort and the current
    // filter, not the untouched source order. A file that disagrees with the screen it
    // came from is worse than no file.
    const body = filteredRows.map((row) => row.map((cell: any) => getDeepText(cell)));

    // Provenance travels with the figures. Every other surface in this document refuses to
    // show a number without naming where it came from, and a file leaving the page is the
    // one place that rule matters most — once it is a spreadsheet on someone's laptop,
    // the page's own source line is gone.
    const preamble = [
      ["# Dr. Makali campaign proposal — table export"],
      [`# Retrieved: ${new Date().toISOString().slice(0, 10)}`],
      [`# Source page: ${typeof window !== "undefined" ? window.location.href : ""}`],
      ...(tableSources.length > 0 ? [[`# Source: ${tableSources.join(" | ")}`]] : []),
      ...(filteredRows.length !== parsedRows.length
        ? [[`# Filtered view: ${filteredRows.length} of ${parsedRows.length} rows`]]
        : []),
      [],
    ];

    const csv = [...preamble, headers, ...body]
      .map((row) => row.map((cell) => csvCell(String(cell ?? ""))).join(","))
      .join("\r\n");

    // The BOM is what makes Excel read this as UTF-8; without it the document's en dashes,
    // minus signs and Kikamba diacritics arrive as mojibake.
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // Five tables can share one page, and a first column headed "Rank" or "Ward" names none
    // of them usefully on its own — prefix the route so a folder of exports stays readable.
    const page =
      typeof window !== "undefined"
        ? slugForFile(window.location.pathname.replace(/^\/+|\/+$/g, "")) 
        : "";
    const stem = slugForFile(headers[0] ?? "table");
    a.download = `makali-${page && page !== "table" ? `${page}-` : ""}${stem}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [ths, filteredRows, parsedRows.length, tableSources]);

  /**
   * A filter earns its place above ten rows and not below.
   *
   * Under ten, scrolling to the row is faster than reaching for a keyboard — and on a phone the
   * box costs a 44px band plus the keyboard it summons. Most of this document's 74 tables are
   * four or five rows.
   */
  const showFilter = parsedRows.length > 10;

  const ROW_PREVIEW = 10;
  const isCapped = !showAllRows && !searchTerm && filteredRows.length > ROW_PREVIEW + 2;
  const visibleRows = isCapped ? filteredRows.slice(0, ROW_PREVIEW) : filteredRows;

  /**
   * Which columns this table is ALLOWED to chart, and whether it may show an aggregate.
   *
   * Both used to be inferred. A column qualified if every one of its cells matched a "bare figure"
   * regular expression, and qualifying bought it a Chart toggle and an "Avg / Max Peak / Combined"
   * strip. That test asks whether the cells look like numbers. It cannot ask the only question
   * that matters — whether these particular numbers may be added to one another — and so the site
   * shipped, among others:
   *
   *     Combined 68.7%     Kasalu's poll shares from two different rounds, added together
   *     Combined 68.5%     Dr. Mulu's three poll shares, added together
   *     Avg WS 7           the workstream identifiers, averaged
   *     Combined 832,002   a zone table counting its own Total row a second time
   *
   * for a county with 532,758 registered voters. None of those is a parsing bug; the parser was
   * answering a question that cannot be answered from the characters in a cell.
   *
   * The decision now lives in lib/table-charts.ts, keyed on the header row, where a person makes
   * it once per table and says why. A table that is not named there gets no chart and no
   * aggregate — which is the right default, and the one that applies to 73 of this document's 74
   * tables.
   */
  const spec = React.useMemo(() => chartSpecFor(ths.map(getDeepText)), [ths]);

  /** Rows a spec excludes as totals or subtotals, so they are never a data point. */
  const isExcluded = React.useCallback(
    (row: any[]) => {
      if (!spec?.excludeRows?.length || !row?.[0]) return false;
      const label = getDeepText(row[0]).toLowerCase().trim();
      return spec.excludeRows.some((r) => label.includes(r.toLowerCase()));
    },
    [spec]
  );

  const columnByHeader = React.useCallback(
    (name: string | undefined) => {
      if (!name) return -1;
      const wanted = name.toLowerCase();
      return ths.findIndex((th) => getDeepText(th).toLowerCase().includes(wanted));
    },
    [ths]
  );

  // -1 whenever the table has not opted in, which switches the chart toggle off entirely.
  const numericColumnIndex = React.useMemo(
    () => (spec?.chart ? columnByHeader(spec.valueColumn) : -1),
    [spec, columnByHeader]
  );

  /**
   * The aggregate, where a spec declares one.
   *
   * It carries the table's own words for what it means, never "Combined" — that label is what made
   * the old strip plausible, because it fits any column and commits to nothing. Total rows are
   * excluded, and if the declared column cannot be found nothing is shown rather than something
   * approximate.
   */
  const stats = React.useMemo(() => {
    if (!spec?.aggregate || numericColumnIndex === -1) return null;
    const values = filteredRows
      .filter((r) => !isExcluded(r))
      .map((r) => (r?.[numericColumnIndex] ? Number.parseFloat(getDeepText(r[numericColumnIndex]).replace(/[^0-9.-]/g, "")) : NaN))
      .filter((v) => !Number.isNaN(v));
    if (values.length === 0) return null;

    const { of, label } = spec.aggregate;
    const value =
      of === "sum" ? values.reduce((a, b) => a + b, 0)
      : of === "mean" ? values.reduce((a, b) => a + b, 0) / values.length
      : of === "max" ? Math.max(...values)
      : Math.min(...values);

    const sample = filteredRows.map((r) => (r?.[numericColumnIndex] ? getDeepText(r[numericColumnIndex]) : "")).join("");
    const unit = sample.includes("KSh") ? "KSh " : "";
    const pct = sample.includes("%") ? "%" : "";
    return {
      label,
      value: `${unit}${value.toLocaleString(undefined, { maximumFractionDigits: pct ? 1 : 0 })}${pct}`,
      rows: values.length,
    };
  }, [spec, numericColumnIndex, filteredRows, isExcluded]);

  /**
   * Which column names the marks. Declared by the spec, with a fallback for the case it omits it.
   *
   * The fallback is the first column that is genuinely text — not the measure, and not a bare
   * figure. The ward register opens with Rank, so without this every bar was labelled "1", "2",
   * "3" against voter counts that were themselves correct: a chart of the right numbers with the
   * wrong names on them.
   */
  const labelColumnIndex = React.useMemo(() => {
    const declared = columnByHeader(spec?.labelColumn);
    if (declared !== -1) return declared;

    const BARE_FIGURE = /^[^A-Za-z]*\d[\d,.\s]*[^A-Za-z]*$/;
    for (let colIdx = 0; colIdx < ths.length; colIdx++) {
      if (colIdx === numericColumnIndex) continue;
      const texts = parsedRows
        .map((row) => (row && row[colIdx] ? getDeepText(row[colIdx]).trim() : ""))
        .filter(Boolean);
      if (texts.length === 0) continue;
      if (texts.every((t) => BARE_FIGURE.test(t))) continue;
      return colIdx;
    }
    return 0;
  }, [ths, parsedRows, numericColumnIndex, spec, columnByHeader]);

  const chartData = React.useMemo(() => {
    if (numericColumnIndex === -1) return [];
    return filteredRows
      // A total row is not a data point. Charting one draws a bar the height of every other bar
      // added together, which is how the zone tables came to claim 832,002 voters.
      .filter((row) => !isExcluded(row))
      .map((row) => {
        const labelCell = row[labelColumnIndex];
        const valueCell = row[numericColumnIndex];
        const name = getDeepText(labelCell) || "Item";
        const valText = getDeepText(valueCell);
        const value = parseFloat(valText.replace(/[^0-9.-]/g, "")) || 0;
        return { name, value, formatted: valText };
      })
      .filter((item) => item.name && !isNaN(item.value));
  }, [filteredRows, numericColumnIndex, labelColumnIndex, isExcluded]);

  const isModelVariables = React.useMemo(() => {
    const allText = [...ths, ...parsedRows.slice(0, 5).flat()].map(getDeepText).join(" ").toLowerCase();
    return (
      allText.includes("variable") &&
      (allText.includes("voter_id") || (allText.includes("source") && allText.includes("format") && allText.includes("type")))
    );
  }, [ths, parsedRows]);

  const isMobile = useIsMobile();
  const mounted = useMounted();

  if (isModelVariables) {
    return <ModelVariablesDrawer />;
  }

  if (ths.length === 0) {
    return (
      <div
        className="fx-focus overflow-x-auto border border-line rounded-2xl my-4"
        tabIndex={0}
        role="group"
        aria-label="Table, scrollable"
      >
        {children}
      </div>
    );
  }

  return (
    // LayoutGroup pairs the row labels with the marks they become. Without it each layoutId is
    // matched globally, and two matrices open on the same page would trade rows.
    <LayoutGroup id={matrixId}>
      <div className="border-y sm:border border-line/40 sm:rounded-xl my-5 overflow-hidden bg-card/30">
      {/* The toolbar, on a diet.

          It carried four controls on every one of this document's 74 tables: a row count, a Chart
          toggle, a CSV button and an always-present filter box. On a 390px screen that is a band
          of chrome as tall as three rows of the table it introduces, repeated 74 times, most of it
          for tables of four rows that nobody will filter and that could not honestly be charted.

          What is left: the row count, because a filtered table must say so; a filter ONLY above
          ten rows, because below that scrolling is faster than typing; and CSV and Chart behind
          one overflow control, because they are occasional and the table is not. */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-2 border-b border-line/40 bg-paper/40 px-2.5 py-2 sm:px-3.5">
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="t-micro font-semibold text-muted"
        >
          {filteredRows.length === parsedRows.length
            ? `${parsedRows.length} rows`
            : `Showing ${filteredRows.length} of ${parsedRows.length} rows`}
        </span>

        <div className="flex items-center gap-2">
          {showFilter && (
            <div className="relative w-40 sm:w-44">
              <Search size={13} aria-hidden="true" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Filter rows"
                aria-label="Filter table rows"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-line bg-paper/80 py-2 pl-8 pr-2.5 t-micro font-normal text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>
          )}

          {/* One control for the occasional actions. `details` rather than a button and a state
              flag: it closes on Escape and on a click outside for free, and it works before
              hydration. */}
          <details className="relative">
            <summary
              className="tap-chip flex min-h-[44px] min-w-[44px] cursor-pointer list-none items-center justify-center rounded-xl border border-line bg-paper/80 px-3 text-muted transition-colors hover:border-accent/40 hover:text-ink"
              aria-label="More actions for this table"
            >
              <MoreHorizontal size={16} aria-hidden="true" />
            </summary>
            <div className="absolute right-0 z-20 mt-1 min-w-[10rem] rounded-xl border border-line bg-card p-1 shadow-lg">
              {numericColumnIndex !== -1 && (
                <button
                  type="button"
                  onClick={() => setShowChart(!showChart)}
                  aria-pressed={showChart}
                  className="flex w-full min-h-[44px] cursor-pointer items-center gap-2 rounded-lg px-3 t-micro font-semibold text-ink hover:bg-accent/[0.08]"
                >
                  {showChart ? <Table size={14} aria-hidden="true" /> : <BarChart3 size={14} aria-hidden="true" />}
                  <span>{showChart ? "Show as table" : "Show as chart"}</span>
                </button>
              )}
              <button
                type="button"
                onClick={downloadCsv}
                disabled={filteredRows.length === 0}
                className="flex w-full min-h-[44px] cursor-pointer items-center gap-2 rounded-lg px-3 t-micro font-semibold text-ink hover:bg-accent/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download size={14} aria-hidden="true" />
                <span>Download CSV</span>
              </button>
            </div>
          </details>
        </div>
      </div>

      {/* One declared aggregate, in the table's own words, or nothing at all.

          This was a three-cell strip reading "Avg <column> / Max Peak / Combined" under every
          table with a numeric-looking column. It is now opt-in per table (lib/table-charts.ts),
          it states what it aggregated rather than labelling it "Combined", and it excludes the
          total rows that made it double-count. No table in this document currently declares one. */}
      {stats && (
        <div className="px-3 py-2 bg-accent/[0.02] border-b border-line/30 flex items-baseline gap-2 flex-wrap">
          <span className="t-micro font-semibold text-muted">{stats.label}</span>
          <span className="t-label font-bold text-ink tabular-nums">{stats.value}</span>
          <span className="t-micro text-muted">over {stats.rows} rows</span>
        </div>
      )}

      {/* Chart View (if toggle is active and data is available) */}
      {showChart && chartData.length > 0 ? (
        <MatrixMarks data={chartData} statsLabel={stats?.label} idPrefix={matrixId} />
      ) : (
        <div className="w-full">
          {/* If on mobile viewport, render only the card-stacking view to avoid dual DOM bloat */}
          {mounted && isMobile ? (
            <div className="p-2.5 space-y-2.5">
              {visibleRows.map((row, rIdx) => {
                const primaryCell = row[0];
                const remainingCells = row.slice(1);
                return (
                  <div
                    key={rIdx}
                    style={{ "--fx-i": Math.min(rIdx, 12) } as React.CSSProperties}
                    className="fx-item-insert bg-card/70 border border-line/60 rounded-xl p-3 shadow-xs space-y-2 hover:border-line transition-colors"
                  >
                    {/* Lead cell rendered as card header */}
                    <div className="font-bold text-ink t-small pb-1.5 border-b border-line/30 flex items-center justify-between">
                      <motion.div layoutId={`${matrixId}-label-${rIdx}`} className="min-w-0 break-words">
                        {primaryCell ? primaryCell.props?.children : null}
                      </motion.div>
                      {ths[0] && (
                        <span className="t-micro font-mono text-muted shrink-0 ml-2" aria-hidden="true">
                          #{rIdx + 1}
                        </span>
                      )}
                    </div>

                    {/* Remaining cells rendered as paired key-values */}
                    <div className="space-y-1.5">
                      {remainingCells.map((cell: any, cIdx: number) => {
                        const colIdx = cIdx + 1;
                        const thNode = ths[colIdx];
                        const colLabel = thNode ? getDeepText(thNode) : `Col ${colIdx + 1}`;
                        return (
                          // Label above value, both left-aligned (brief G-6, D-04). A value set
                          // right-aligned in 70% of a phone's width wrapped into a ragged column.
                          <div key={colIdx} className="pf-kv py-1.5 border-b border-line/15 last:border-b-0">
                            <span className="block t-micro font-semibold text-muted" aria-hidden="true">
                              {colLabel}
                            </span>
                            <div className="t-small text-ink/90 leading-snug break-words">
                              {cell ? cell.props?.children : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Desktop Tabular Grid View (>= md or SSR) */
            <div className="fx-focus overflow-x-auto w-full scrollbar-thin" tabIndex={0} role="group" aria-label="Table, scrollable">
              <table className="w-full text-left border-collapse t-small">
                <thead className="table-header-group">
                  <tr className="border-b border-line/50 bg-paper/50">
                    {ths.map((th: any, idx) => (
                      <th
                        key={idx}
                        scope="col"
                        aria-sort={
                          sortColumn === idx
                            ? sortDirection === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                        className="sticky top-0 z-10 font-semibold t-label sm:t-small text-muted bg-paper/90 backdrop-blur-sm select-none whitespace-nowrap"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(idx)}
                          className="fx-focus group flex w-full min-h-[44px] items-center gap-1.5 justify-between p-2.5 sm:p-3 text-left cursor-pointer hover:bg-line/20 transition-colors"
                        >
                          <span>{th.props.children}</span>
                          <ArrowUpDown size={10} aria-hidden="true" className="fx-icon-rise text-muted group-hover:text-accent transition-colors shrink-0" />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="table-row-group divide-y divide-line/20">
                  {visibleRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      style={{ "--fx-i": Math.min(rIdx, 12) } as React.CSSProperties}
                      className="fx-item-insert fx-flip-item hover:bg-accent/[0.06] hover:shadow-[inset_3px_0_0_var(--color-accent)] transition-colors"
                    >
                      {row.map((cell: any, cIdx) => {
                        const isPrimary = cIdx === 0;
                        return (
                          <td
                            key={cIdx}
                            className={`p-2.5 sm:p-3 t-small sm:t-body leading-relaxed ${
 isPrimary
                                ? "font-semibold text-ink whitespace-nowrap"
                                : "text-ink/90 whitespace-normal"
                            }`}
                          >
                            {cell ? cell.props.children : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination and View Limits */}
          {isCapped && (
            <button
              type="button"
              onClick={() => setShowAllRows(true)}
              className="fx-press fx-focus w-full py-3 t-label font-bold text-accent border-t border-line/40 hover:bg-accent/[0.06] transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Show all {filteredRows.length} rows
            </button>
          )}
          {showAllRows && !searchTerm && filteredRows.length > 12 && (
            <button
              type="button"
              onClick={() => setShowAllRows(false)}
              className="fx-press fx-focus w-full py-3 t-label font-bold text-muted border-t border-line/40 hover:text-ink transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Show fewer rows
            </button>
          )}
          {filteredRows.length === 0 && (
            <div className="p-6 text-center t-label font-mono text-muted/70">
              No matching strategic metrics found.
            </div>
          )}
        </div>
      )}
      <SourceLine sources={tableSources} />
      </div>
    </LayoutGroup>
  );
}
