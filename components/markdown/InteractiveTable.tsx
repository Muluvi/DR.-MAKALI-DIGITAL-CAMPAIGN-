"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Search, Sparkles, ArrowUpDown, BarChart3, Table } from "lucide-react";
import { LazyMount } from "../LazyMount";
import { SourceLine, detectSources } from "./SourceLine";

// Recharts only loads once the user actually asks to see the chart view.
const TableChart = dynamic(() => import("./TableChart"), { ssr: false });

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

export function InteractiveTable({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showChart, setShowChart] = useState(false);

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

  // Analytical stats automatic detector
  const numericColumnIndex = React.useMemo(() => {
    if (ths.length === 0 || parsedRows.length === 0) return -1;
    for (let colIdx = 0; colIdx < ths.length; colIdx++) {
      let numericCount = 0;
      parsedRows.forEach(row => {
        if (row && row[colIdx]) {
          const text = getDeepText(row[colIdx]);
          if (text && !isNaN(parseFloat(text.replace(/[^0-9.-]/g, "")))) {
            numericCount++;
          }
        }
      });
      if (numericCount > parsedRows.length * 0.6) {
        return colIdx;
      }
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

  const chartData = React.useMemo(() => {
    if (numericColumnIndex === -1) return [];
    return filteredRows.map((row) => {
      const labelCell = row[0];
      const valueCell = row[numericColumnIndex];
      const name = getDeepText(labelCell) || "Item";
      const valText = getDeepText(valueCell);
      const value = parseFloat(valText.replace(/[^0-9.-]/g, "")) || 0;
      return { name, value, formatted: valText };
    }).filter(item => item.name && !isNaN(item.value));
  }, [filteredRows, numericColumnIndex]);

  const tableSources = React.useMemo(() => {
    const allText = [...ths, ...rowElements].map(getDeepText).join(" ");
    return detectSources(allText);
  }, [ths, rowElements]);

  if (ths.length === 0) {
    return <div className="overflow-x-auto border border-line rounded-2xl my-4">{children}</div>;
  }

  return (
    <div className="border-x-0 sm:border border-y sm:border-line rounded-none sm:rounded-2xl -mx-4 sm:mx-0 bg-card/40 my-6 overflow-hidden shadow-none sm:shadow-sm hover:shadow-md transition-shadow">
      {/* Interactive Controls & Analytics Header */}
      <div className="print:hidden p-3 sm:p-4 border-b border-line/60 bg-paper/60 backdrop-blur-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
            <Sparkles size={14} />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted">Analytical Matrix</span>
            <span className="text-[10px] font-black text-ink block mt-0.5">
              {filteredRows.length} of {parsedRows.length} targets matching
            </span>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0 justify-between md:justify-end">
          {numericColumnIndex !== -1 && (
            <button
              onClick={() => setShowChart(!showChart)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                showChart
                  ? "bg-accent border-accent text-white shadow-sm"
                  : "bg-paper/80 border-line text-muted hover:border-accent/40 hover:text-ink"
              }`}
            >
              {showChart ? <Table size={12} /> : <BarChart3 size={12} />}
              <span>{showChart ? "Show Table" : "Show Chart"}</span>
            </button>
          )}

          <div className="relative flex-1 max-w-xs md:w-48">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted animate-pulse" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-paper/80 border border-line rounded-lg text-[11px] font-semibold text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Numerical Insights Drawer (Displays only if a column is numeric) */}
      {stats && (
        <div className="px-4 py-2 bg-gradient-to-r from-accent/[0.02] to-gold/[0.02] border-b border-line/40 grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-[8px] uppercase tracking-widest font-bold text-muted">Avg {stats.label}</span>
            <span className="block text-xs font-black text-accent mt-0.5">{stats.avg}</span>
          </div>
          <div>
            <span className="text-[8px] uppercase tracking-widest font-bold text-muted">Max Peak</span>
            <span className="block text-xs font-black text-gold mt-0.5">{stats.max}</span>
          </div>
          <div>
            <span className="text-[8px] uppercase tracking-widest font-bold text-muted">Combined Target</span>
            <span className="block text-xs font-black text-ink mt-0.5">{stats.sum}</span>
          </div>
        </div>
      )}

      {/* Chart View (if toggle is active and data is available) */}
      {showChart && chartData.length > 0 ? (
        <div className="p-4 sm:p-6 bg-card/60 backdrop-blur-sm border-t border-line/40">
          <LazyMount minHeight={256}>
            <TableChart chartData={chartData} statsLabel={stats?.label} />
          </LazyMount>
          <div className="mt-4 text-center text-[9px] font-bold text-muted uppercase tracking-wider animate-pulse">
            Interactive analytical projection of {stats?.label || "metrics"}
          </div>
        </div>
      ) : (
        // Single table markup for all viewports — mobile layout is CSS-only (data-label + ::before)
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px] block sm:table">
            <thead className="hidden sm:table-header-group">
              <tr className="border-b border-line bg-line/10">
                {ths.map((th: any, idx) => (
                  <th
                    key={idx}
                    onClick={() => toggleSort(idx)}
                    className="p-3 font-extrabold tracking-wider text-muted uppercase cursor-pointer hover:bg-line/20 transition-colors select-none group"
                  >
                    <div className="flex items-center gap-1.5 justify-between">
                      <span>{th.props.children}</span>
                      <ArrowUpDown size={10} className="text-muted group-hover:text-accent transition-colors shrink-0" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="block sm:table-row-group">
              {filteredRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="block sm:table-row p-4 sm:p-0 space-y-2.5 sm:space-y-0 bg-paper/10 sm:bg-transparent border-b border-line/60 sm:border-line last:border-b-0 hover:bg-line/5 transition-colors"
                >
                  {row.map((cell: any, cIdx) => {
                    const headerLabel = getDeepText(ths[cIdx]) || `Field ${cIdx + 1}`;
                    const isPrimary = cIdx === 0;
                    return (
                      <td
                        key={cIdx}
                        data-label={headerLabel}
                        className={
                          isPrimary
                            ? "block sm:table-cell p-0 sm:p-3 pb-1.5 mb-2 sm:pb-3 sm:mb-0 border-b border-line/40 sm:border-b-0 text-[11px] font-black text-ink sm:font-semibold sm:text-ink/90 leading-relaxed before:content-[attr(data-label)] before:block before:text-[8px] before:uppercase before:font-bold before:tracking-wider before:text-accent before:mb-0.5 sm:before:content-none"
                            : "flex sm:table-cell justify-between sm:justify-start items-baseline gap-4 sm:gap-0 p-0 sm:p-3 text-[11px] text-right sm:text-left font-semibold text-ink/90 leading-relaxed before:content-[attr(data-label)] before:text-[9px] before:uppercase before:font-bold before:tracking-wider before:text-muted sm:before:content-none"
                        }
                      >
                        {cell ? cell.props.children : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRows.length === 0 && (
            <div className="p-6 text-center text-[10px] font-mono font-bold text-muted/60">
              No matching strategic metrics found.
            </div>
          )}
        </div>
      )}
      <SourceLine sources={tableSources} />
    </div>
  );
}
