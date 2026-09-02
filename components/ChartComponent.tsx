"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, Info } from "lucide-react";

export interface ChartDataItem {
  name: string;
  value?: number;
  [key: string]: any;
}

export interface ChartBarConfig {
  dataKey: string;
  name?: string;
  color?: string;
}

export interface ChartComponentProps {
  data: ChartDataItem[];
  title?: string;
  description?: string;
  dataKey?: string;
  xAxisKey?: string;
  yAxisKey?: string;
  bars?: ChartBarConfig[];
  statsLabel?: string;
  layout?: "horizontal" | "vertical";
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

// Brand color palette defined in globals.css
const BRAND_COLORS = [
  "var(--color-accent, #00209f)",
  "var(--color-gold, #e31d2b)",
  "#2563eb", // Royal Cobalt
  "#d97706", // Amber
  "#059669", // Emerald
  "#7c3aed", // Violet
  "#475569", // Slate
];

export function ChartComponent({
  data,
  title,
  description,
  dataKey = "value",
  xAxisKey = "name",
  bars,
  statsLabel = "Value",
  layout = "horizontal",
  height = 280,
  showGrid = true,
  showLegend = false,
  valueFormatter,
  className = "",
}: ChartComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const formatValue = (val: any) => {
    if (typeof val !== "number") return val;
    if (valueFormatter) return valueFormatter(val);
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
    return val.toLocaleString();
  };

  if (!isMounted) {
    return (
      <div
        className={`bg-card border border-line rounded-2xl p-5 shadow-sm my-6 flex flex-col justify-center items-center gap-2 text-xs text-muted font-bold ${className}`}
        style={{ minHeight: height + 60 }}
      >
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span>Loading chart visualization...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`bg-card border border-line rounded-2xl p-5 shadow-sm my-6 text-center text-xs text-muted ${className}`}>
        No data available for chart.
      </div>
    );
  }

  const isVertical = layout === "vertical";

  return (
    <div className={`bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 space-y-4 not-prose ${className}`}>
      {(title || description) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/40 pb-3">
          <div>
            {title && (
              <h4 className="font-serif text-sm font-bold text-ink flex items-center gap-2">
                <BarChart3 size={16} className="text-accent shrink-0" />
                {title}
              </h4>
            )}
            {description && (
              <p className="t-small text-muted leading-tight mt-0.5">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 t-label font-bold text-accent bg-accent/5 px-2.5 py-1 rounded-lg border border-accent/15 self-start sm:self-auto">
            <TrendingUp size={12} />
            <span>Interactive Data</span>
          </div>
        </div>
      )}

      <div className="w-full t-label" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={layout}
            margin={{ top: 12, right: 12, left: isVertical ? 20 : 0, bottom: isVertical ? 5 : 20 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-line)"
                opacity={0.35}
                vertical={!isVertical}
                horizontal={isVertical}
              />
            )}

            {isVertical ? (
              <>
                <XAxis
                  type="number"
                  tick={{ fill: "var(--color-muted)", fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--color-line)" }}
                  tickFormatter={formatValue}
                />
                <YAxis
                  dataKey={xAxisKey}
                  type="category"
                  tick={{ fill: "var(--color-muted)", fontSize: 9, fontWeight: 700 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--color-line)" }}
                  width={85}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={xAxisKey}
                  tick={{ fill: "var(--color-muted)", fontSize: 9, fontWeight: 700 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--color-line)" }}
                  angle={data.length > 5 ? -20 : 0}
                  textAnchor={data.length > 5 ? "end" : "middle"}
                  interval={0}
                />
                <YAxis
                  tick={{ fill: "var(--color-muted)", fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--color-line)" }}
                  width={42}
                  tickFormatter={formatValue}
                />
              </>
            )}

            <Tooltip
              cursor={{ fill: "var(--color-line)", opacity: 0.15 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-card border border-line p-3 shadow-xl rounded-xl t-label font-bold text-ink max-w-[220px] backdrop-blur-md">
                      <p className="border-b border-line pb-1 mb-1 font-serif text-xs font-black truncate">
                        {item[xAxisKey] || item.name}
                      </p>
                      {payload.map((p, idx) => (
                        <p key={idx} className="text-accent flex items-center justify-between gap-3 mt-0.5">
                          <span className="text-muted font-medium">{p.name || statsLabel}:</span>
                          <span className="font-extrabold text-ink">
                            {formatValue(p.value as number)}
                          </span>
                        </p>
                      ))}
                      {item.detail && (
                        <p className="t-micro text-muted font-normal mt-1 border-t border-line/40 pt-1">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {showLegend && <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }} />}

            {bars && bars.length > 0 ? (
              bars.map((bar, barIdx) => (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  name={bar.name || bar.dataKey}
                  fill={bar.color || BRAND_COLORS[barIdx % BRAND_COLORS.length]}
                  radius={isVertical ? [0, 6, 6, 0] : [6, 6, 0, 0]}
                />
              ))
            ) : (
              <Bar
                dataKey={dataKey}
                name={statsLabel}
                fill="var(--color-accent, #00209f)"
                radius={isVertical ? [0, 6, 6, 0] : [6, 6, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || BRAND_COLORS[index % BRAND_COLORS.length]}
                  />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between t-label text-muted border-t border-line/30 pt-2.5">
        <span className="flex items-center gap-1">
          <Info size={12} className="text-accent" />
          Kitui 2027 Strategic Architecture Data Model
        </span>
        <span className="font-mono t-micro">Recharts Engine</span>
      </div>
    </div>
  );
}

export default ChartComponent;
