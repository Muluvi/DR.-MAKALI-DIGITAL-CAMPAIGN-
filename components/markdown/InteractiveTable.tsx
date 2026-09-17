"use client";

import React, { useId, useState } from "react";
import { Search, Sparkles, ArrowUpDown, BarChart3, Table, Download } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";

import { SourceLine, detectSources } from "./SourceLine";
import { MatrixMarks } from "./MatrixMarks";
import ModelVariablesDrawer from "./ModelVariablesDrawer";
import { useIsMobile, useMounted } from "../../hooks/use-mobile";

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

  const ROW_PREVIEW = 10;
  const isCapped = !showAllRows && !searchTerm && filteredRows.length > ROW_PREVIEW + 2;
  const visibleRows = isCapped ? filteredRows.slice(0, ROW_PREVIEW) : filteredRows;

  /**
   * A column worth charting, and the reason this is strict.
   *
   * The old test stripped every non-digit and called whatever survived a number. So a column
   * reading "Week 1", "Week 2", "Week 1, 100%", "15,000", "400,000" was charted as 1, 2, 1,
   * 15000, 400000 — on one axis, against a maximum of 400,000, which drew "Week 1" as a bar
   * 0.00025% wide. The same arithmetic fed the summary strip, so it was reporting an average and
   * a total of a column that has no average or total.
   *
   * A column now qualifies only if EVERY cell in it is a bare figure — an optional currency or
   * comparator, digits, an optional unit — with no words wrapped around it, and only if the
   * whole column shares one unit. "15,000" and "400,000" qualify together. "Week 1" does not
   * qualify at all, and "Week 1, 100%" carries two numbers so it never could.
   *
   * Where nothing qualifies the chart toggle and the summary strip simply do not appear. A table
   * that cannot honestly be charted is a table, and that is a complete answer.
   */
  const numericColumnIndex = React.useMemo(() => {
    if (ths.length === 0 || parsedRows.length === 0) return -1;

    // Optional currency, optional comparator/sign, digits with separators, optional unit.
    const PURE_FIGURE = /^(?:KSh|Ksh|USD|US\$|\$|€|£)?\s*[≥≤<>+\u2212-]?\s*\d[\d,\s]*(?:\.\d+)?\s*(?:%|bn|m|k|pts?|votes?|wards?|stations?|captains?)?$/i;
    const unitOf = (t: string) =>
      (t.match(/(%|bn|m|k|pts?|votes?|wards?|stations?|captains?)\s*$/i)?.[1] ?? "").toLowerCase();

    // Column 0 is the label every mark is drawn against, so it is never also the measure.
    // Charting it plots each row against itself.
    for (let colIdx = 1; colIdx < ths.length; colIdx++) {
      const texts = parsedRows
        .map((row) => (row && row[colIdx] ? getDeepText(row[colIdx]).trim() : ""))
        .filter((t) => t.length > 0);

      // A mostly-empty column is not a measurement either.
      if (texts.length < Math.max(2, parsedRows.length * 0.6)) continue;
      if (!texts.every((t) => PURE_FIGURE.test(t))) continue;

      const units = new Set(texts.map(unitOf));
      if (units.size > 1) continue;

      // A plain 1, 2, 3 … run is a rank or a row number, not a quantity. The ward register's
      // Rank column passed every other test and produced a staircase of bars measuring nothing.
      const nums = texts.map((t) => Number.parseFloat(t.replace(/[^0-9.-]/g, "")));
      const isSequence = nums.every((n, i) => n === i + 1);
      if (isSequence) continue;

      return colIdx;
    }
    return -1;
  }, [ths, parsedRows]);

  const stats = React.useMemo(() => {
    if (numericColumnIndex === -1 || filteredRows.length === 0) return null;
    const vals = filteredRows.map(r => {
      if (!r || !r[numericColumnIndex]) return NaN;
      const txt = getDeepText(r[numericColumnIndex]);
      return parseFloat(txt.replace(/[^0-9.-]/g, ""));
    }).filter(v => !isNaN(v));

    if (vals.length === 0) return null;
    const sum = vals.reduce((a, b) => a + b, 0);
    const avg = sum / vals.length;
    const max = Math.max(...vals);
    const min = Math.min(...vals);

    const checkText = filteredRows.map(r => r && r[numericColumnIndex] ? getDeepText(r[numericColumnIndex]) : "").join("");
    const isCurrency = checkText.includes("KSh") || checkText.includes("$");
    const isPercent = checkText.includes("%");

    const format = (v: number) => {
      if (isCurrency) return `KSh ${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      if (isPercent) return `${v.toFixed(1)}%`;
      return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
    };

    return {
      avg: format(avg),
      max: format(max),
      min: format(min),
      sum: format(sum),
      label: getDeepText(ths[numericColumnIndex])
    };
  }, [filteredRows, numericColumnIndex, ths]);

  /**
   * Which column names the marks.
   *
   * Not always the first one. The ward register opens with Rank, so every bar was labelled "1",
   * "2", "3" against voter counts that were themselves correct — a chart of the right numbers
   * with the wrong names on them. The label is the first column that is genuinely text: not the
   * measure, and not a bare figure.
   */
  const labelColumnIndex = React.useMemo(() => {
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
  }, [ths, parsedRows, numericColumnIndex]);

  const chartData = React.useMemo(() => {
    if (numericColumnIndex === -1) return [];
    return filteredRows.map((row) => {
      const labelCell = row[labelColumnIndex];
      const valueCell = row[numericColumnIndex];
      const name = getDeepText(labelCell) || "Item";
      const valText = getDeepText(valueCell);
      const value = parseFloat(valText.replace(/[^0-9.-]/g, "")) || 0;
      return { name, value, formatted: valText };
    }).filter(item => item.name && !isNaN(item.value));
  }, [filteredRows, numericColumnIndex, labelColumnIndex]);

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
    return <div className="overflow-x-auto border border-line rounded-2xl my-4">{children}</div>;
  }

  return (
    // LayoutGroup pairs the row labels with the marks they become. Without it each layoutId is
    // matched globally, and two matrices open on the same page would trade rows.
    <LayoutGroup id={matrixId}>
      <div className="border-y sm:border border-line/40 sm:rounded-xl my-5 overflow-hidden bg-card/30">
      {/* Interactive Controls & Analytics Header */}
      <div className="print:hidden p-2.5 sm:p-3.5 border-b border-line/40 bg-paper/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-accent/10 text-accent">
            <Sparkles size={13} />
          </div>
          <div>
            <span
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="t-label font-semibold text-ink block"
            >
              Showing {filteredRows.length} of {parsedRows.length} rows
            </span>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="flex items-center gap-2 grow sm:grow-0 justify-end">
          {numericColumnIndex !== -1 && (
            <button
              onClick={() => setShowChart(!showChart)}
              aria-pressed={showChart}
              className={`tap-chip flex items-center gap-1.5 px-3 py-2 rounded-xl border t-micro font-bold transition-all cursor-pointer min-h-[44px] ${
                showChart
                  ? "bg-accent-solid border-accent-solid text-on-accent shadow-sm"
                  : "bg-paper/80 border-line text-muted hover:border-accent/40 hover:text-ink"
              }`}
            >
              {showChart ? <Table size={14} /> : <BarChart3 size={14} />}
              <span>{showChart ? "Table" : "Chart"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={downloadCsv}
            disabled={filteredRows.length === 0}
            title="Download this table as CSV"
            className="tap-chip flex items-center gap-1.5 px-3 py-2 rounded-xl border t-micro font-bold transition-all cursor-pointer min-h-[44px] bg-paper/80 border-line text-muted hover:border-accent/40 hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={14} aria-hidden="true" />
            <span>CSV</span>
          </button>

          <div className="relative flex-1 sm:w-44">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Filter table..."
              aria-label="Filter table rows"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="fx-input-glow w-full pl-8 pr-2.5 py-2 bg-paper/80 border border-line rounded-xl t-label font-normal text-ink placeholder:text-muted focus:outline-none focus:border-accent min-h-[44px]"
            />
          </div>
        </div>
      </div>

      {/* Numerical Insights Drawer (Displays only if a column is numeric) */}
      {stats && (
        <div className="px-3 py-2 bg-accent/[0.02] border-b border-line/30 grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
          <div className="min-w-0">
            <span className="t-micro font-semibold text-muted truncate block">Avg {stats.label}</span>
            <span className="block t-label sm:t-label font-bold text-accent mt-0.5 truncate">{stats.avg}</span>
          </div>
          <div className="min-w-0">
            <span className="t-micro font-semibold text-muted truncate block">Max Peak</span>
            <span className="block t-label sm:t-label font-bold text-gold mt-0.5 truncate">{stats.max}</span>
          </div>
          <div className="min-w-0">
            <span className="t-micro font-semibold text-muted truncate block">Combined</span>
            <span className="block t-label sm:t-label font-bold text-ink mt-0.5 truncate">{stats.sum}</span>
          </div>
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
                          <div
                            key={colIdx}
                            className="flex items-start justify-between gap-2.5 py-1 border-b border-line/15 last:border-b-0"
                          >
                            <span className="t-micro font-semibold text-muted shrink-0 pt-0.5" aria-hidden="true">
                              {colLabel}
                            </span>
                            <div className="text-right t-small text-ink/90 leading-snug break-words max-w-[70%]">
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
            <div className="overflow-x-auto w-full scrollbar-thin">
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
                          /* A blank header cell leaves this button with no text at all, so the
                             control announces as an unnamed button. Name it from the header where
                             there is one, and by position where there is not; the `th` carries
                             aria-sort, so the label only has to say what the button does. */
                          aria-label={`Sort by ${getDeepText(th.props.children).trim() || `column ${idx + 1}`}`}
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
            <div className="p-6 text-center t-label font-mono text-muted">
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
