"use client";

import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

import { DURATION } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

interface LedgerChartDatum {
  name: string;
  budget: number;
  formatted: string;
}

export default function ResourceLedgerBarChart({
  chartData,
  colors
}: {
  chartData: LedgerChartDatum[];
  colors: string[];
}) {
  const reduce = useReducedMotionSafe();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fill: "var(--color-muted)", fontSize: 8, fontWeight: 700 }}
          tickLine={false}
          axisLine={false}
          width={85}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-card border border-line p-2.5 shadow-md rounded-xl t-label font-bold text-ink">
                  <p className="border-b border-line pb-1 mb-1 text-ink">{data.name}</p>
                  <p className="text-accent">Budget: {data.formatted}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="budget"
          radius={[0, 4, 4, 0]}
          isAnimationActive={!reduce}
          animationDuration={DURATION.entrance * 1000}
          animationEasing="ease-out"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
