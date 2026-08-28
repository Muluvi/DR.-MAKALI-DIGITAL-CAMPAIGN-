"use client";

import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";

interface TableChartDatum {
  name: string;
  value: number;
  formatted: string;
}

export default function TableChart({ chartData, statsLabel }: { chartData: TableChartDatum[]; statsLabel?: string }) {
  return (
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
                    <p className="text-accent">{statsLabel || "Value"}: <span className="font-extrabold text-ink">{data.formatted}</span></p>
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
  );
}
