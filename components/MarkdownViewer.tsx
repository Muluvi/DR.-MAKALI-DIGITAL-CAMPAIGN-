"use client";

import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CheckCircle, Info, Volume2, Play, Pause, ChevronDown, ChevronUp, Search, Sparkles, ArrowUpDown, BarChart3, Table } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";

// Dictionary of definitions for hover tooltips
const DEFINITIONS: Record<string, string> = {
  "own-source revenue": "Kitui's locally-generated county treasury funds, targeted at KSh 1.339bn.",
  "polling deficit": "The 15.3% voter margin gap that this campaign is actively closing.",
  "ussd database": "Offline text-based digital voter registration system designed to reach citizens without internet.",
  "aircover": "Continuous community FM radio broadcasting synchronized with SMS networks.",
  "consensus strategy": "Direct delegate alignment to secure 75%+ endorsements without ballot splits.",
  "delegate nominations": "Wiper nomination delegates representing forty constituencies across Kitui."
};

// Tooltip helper component
function InlineTooltip({ text, term }: { text: string; term: string }) {
  const [visible, setVisible] = useState(false);
  const definition = DEFINITIONS[term.toLowerCase()];

  if (!definition) return <span>{text}</span>;

  return (
    <span 
      className="relative inline-block cursor-help group z-10"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="underline decoration-dotted decoration-accent decoration-2 font-semibold text-ink group-hover:text-accent transition-colors">
        {text}
      </span>
      <AnimatePresence>
        {visible && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-paper border border-line rounded-xl shadow-lg text-xs text-ink font-sans z-50 text-center leading-normal"
          >
            <span className="font-bold text-accent block mb-1 uppercase tracking-wider text-[10px] flex items-center justify-center gap-1">
              <Info size={11} /> Strategy Definition
            </span>
            {definition}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-paper" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// Master regex to match definitions and key badges in a single native pass
const termsUnion = Object.keys(DEFINITIONS).join("|");
const datePatterns = "August 2026|December 2026|April 2027|August 2027|2026/27|KSh 1\\.339bn";
const masterRegex = new RegExp(`(${termsUnion}|${datePatterns})`, "gi");

// Highly optimized memoized component to handle tooltip wrapping and badge highlights
const HighlightedText = React.memo(function HighlightedText({ text }: { text: string }) {
  const elements = React.useMemo(() => {
    if (!text) return null;
    const parts = text.split(masterRegex);
    if (parts.length === 1) return text;

    return parts.map((part, idx) => {
      const lower = part.toLowerCase();
      // If it is a defined term, wrap in a tooltip
      if (DEFINITIONS[lower]) {
        return <InlineTooltip key={idx} text={part} term={lower} />;
      }
      // If it is a key milestone date or budget figure, wrap in a badge
      if (/^(August 2026|December 2026|April 2027|August 2027|2026\/27|KSh 1\.339bn)$/i.test(part)) {
        return (
          <span 
            key={idx} 
            className="bg-gold/10 text-gold border border-gold/20 px-1.5 py-0.5 rounded font-mono text-[10px] font-bold mx-1 whitespace-nowrap"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  }, [text]);

  return <>{elements}</>;
});

function getDeepText(node: any): string {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getDeepText).join("");
  if (typeof node === "object" && node.props) {
    if (node.props.children) return getDeepText(node.props.children);
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

function InteractiveTable({ children }: { children: React.ReactNode }) {
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

  if (ths.length === 0) {
    return <div className="overflow-x-auto border border-line rounded-2xl my-4">{children}</div>;
  }

  return (
    <div className="border-x-0 sm:border border-y sm:border-line rounded-none sm:rounded-2xl -mx-4 sm:mx-0 bg-card/40 my-6 overflow-hidden shadow-none sm:shadow-sm hover:shadow-md transition-shadow">
      {/* Interactive Controls & Analytics Header */}
      <div className="p-3 sm:p-4 border-b border-line/60 bg-paper/60 backdrop-blur-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
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
          <div className="h-64 sm:h-72 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 10, left: 10, bottom: 25 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "var(--color-muted)", fontSize: 8, fontWeight: 750 }} 
                  tickLine={false} 
                  axisLine={false}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis 
                  tick={{ fill: "var(--color-muted)", fontSize: 8 }} 
                  tickLine={false} 
                  axisLine={false} 
                  width={40}
                  tickFormatter={(val) => val >= 1000000 ? `${(val/1000000).toFixed(1)}M` : val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
                />
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-line p-3 shadow-xl rounded-2xl text-[10px] font-bold text-ink max-w-[220px] backdrop-blur-md">
                          <p className="border-b border-line pb-1 mb-1 font-extrabold text-ink truncate">{data.name}</p>
                          <p className="text-accent">{stats?.label || "Value"}: <span className="font-extrabold text-ink">{data.formatted}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" fill="var(--color-accent)" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => {
                    const colors = ["var(--color-accent)", "var(--color-gold)", "#0ea5e9", "#10b981", "#8b5cf6"];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-[9px] font-bold text-muted uppercase tracking-wider animate-pulse">
            Interactive analytical projection of {stats?.label || "metrics"}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop View: Styled 4K OLED Matrix */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
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
              <tbody>
                {filteredRows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-line last:border-b-0 hover:bg-line/5 transition-colors">
                    {row.map((cell: any, cIdx) => (
                      <td key={cIdx} className="p-3 text-ink/90 font-semibold leading-relaxed">
                        {cell ? cell.props.children : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: No-Scroll Strategic Card Stack */}
          <div className="block sm:hidden divide-y divide-line/60">
            {filteredRows.map((row, rIdx) => (
              <div 
                key={rIdx} 
                className="p-4 bg-paper/10 space-y-2.5 hover:bg-line/5 transition-colors"
              >
                {row.map((cell: any, cIdx) => {
                  const headerLabel = getDeepText(ths[cIdx]) || `Field ${cIdx + 1}`;
                  const isPrimary = cIdx === 0;
                  return (
                    <div key={cIdx} className={isPrimary ? "border-b border-line/40 pb-1.5 mb-2" : "flex justify-between items-baseline gap-4"}>
                      <span className={`text-[9px] uppercase font-bold tracking-wider text-muted ${isPrimary ? "block text-[8px] mb-0.5 text-accent" : ""}`}>
                        {headerLabel}
                      </span>
                      <span className={isPrimary ? "text-[11px] font-black text-ink block" : "text-[11px] font-semibold text-ink/90 text-right leading-relaxed"}>
                        {cell ? cell.props.children : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
            {filteredRows.length === 0 && (
              <div className="p-6 text-center text-[10px] font-mono font-bold text-muted/60">
                No matching strategic metrics found.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function MarkdownViewer({ content }: { content: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative bg-card rounded-none sm:rounded-3xl border-0 shadow-none sm:shadow-sm overflow-hidden p-0 sm:p-8 pt-4 pb-6 sm:py-8">
      {/* Dynamic Faded Watermark Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-10">
        <div className="absolute top-[20%] right-[-10%] text-[8rem] font-black text-accent/5 rotate-[-12deg] font-serif uppercase">
          Wiper Movement
        </div>
        <div className="absolute bottom-[20%] left-[-15%] text-[8rem] font-black text-gold/5 rotate-[8deg] font-serif uppercase">
          Democratic
        </div>
      </div>

      {/* Integrated Media Briefing Placard at the top of long strategic pages */}
      <div className="mx-4 sm:mx-0 mb-6 bg-gradient-to-r from-accent/[0.03] to-gold/[0.03] border border-line/25 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
            <Volume2 size={18} />
          </div>
          <div>
            <h4 className="font-serif text-xs font-black text-ink">Campaign Audio Strategy Briefing</h4>
            <p className="text-[10px] text-muted uppercase tracking-wider font-bold">Listen to synthesized narrative breakdown (2:15 min)</p>
          </div>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-bold shadow-sm self-start sm:self-auto cursor-pointer"
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          {isPlaying ? "Pause Briefing" : "Listen Now"}
        </button>
      </div>

      <div className="prose max-w-none relative z-10 px-4 sm:px-0
        [&_p:first-of-type]:text-base [&_p:first-of-type]:sm:text-lg [&_p:first-of-type]:font-extrabold [&_p:first-of-type]:text-ink [&_p:first-of-type]:leading-relaxed [&_p:first-of-type]:border-b [&_p:first-of-type]:border-line/40 [&_p:first-of-type]:pb-4 [&_p:first-of-type]:mb-6
        [&_p:first-of-type::first-letter]:text-4xl [&_p:first-of-type::first-letter]:font-black [&_p:first-of-type::first-letter]:text-gold [&_p:first-of-type::first-letter]:mr-2 [&_p:first-of-type::first-letter]:float-left [&_p:first-of-type::first-letter]:leading-none
      ">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            table: ({ children }) => (
              <InteractiveTable>{children}</InteractiveTable>
            ),
            p: ({ children }) => (
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed my-4">
                {React.Children.map(children, (child) => {
                  if (typeof child === "string") return <HighlightedText text={child} />;
                  return child;
                })}
              </p>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-accent bg-accent/[0.03] px-5 py-4 rounded-r-2xl my-6 text-xs sm:text-sm font-semibold text-ink leading-relaxed shadow-sm italic relative">
                {children}
              </blockquote>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-2.5 my-3 text-xs sm:text-sm text-ink/90 list-none">
                <span className="mt-1 text-accent shrink-0">
                  <CheckCircle size={14} className="stroke-[2.5]" />
                </span>
                <span className="leading-relaxed">
                  {React.Children.map(children, (child) => {
                    if (typeof child === "string") return <HighlightedText text={child} />;
                    return child;
                  })}
                </span>
              </li>
            ),
            h2: ({ children }) => (
              <h2 className="font-serif text-base sm:text-lg font-black text-ink mt-8 mb-4 border-l-3 border-gold pl-3 leading-none uppercase tracking-wide">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-serif text-xs sm:text-sm font-extrabold text-ink mt-6 mb-2 text-accent uppercase tracking-wider">
                {children}
              </h3>
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
