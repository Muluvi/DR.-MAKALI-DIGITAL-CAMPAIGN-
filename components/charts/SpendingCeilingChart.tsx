"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

export interface TierBand {
  name: string;
  base: number; // KSh, invisible offset
  value: number; // KSh, visible segment height (low-to-high range)
  display: string;
  color: string;
}

export default function SpendingCeilingChart({ data, ceiling }: { data: TierBand[]; ceiling: number }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 24, right: 20, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.3} vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--color-muted)", fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} />
        <YAxis
          domain={[0, ceiling * 1.15]}
          tick={{ fill: "var(--color-muted)", fontSize: 9 }}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}m`}
        />
        <ReferenceLine
          y={ceiling}
          stroke="var(--color-danger)"
          strokeDasharray="5 3"
          strokeWidth={2}
          label={{ value: "Statutory ceiling: KSh97.56m", position: "insideTopRight", fill: "var(--color-danger)", fontSize: 9, fontWeight: 800 }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload.find((p) => p.dataKey === "value")?.payload as TierBand | undefined;
              if (!d) return null;
              return (
                <div className="bg-card border border-line p-2.5 shadow-md rounded-xl text-[10px] font-bold text-ink">
                  <p className="border-b border-line pb-1 mb-1">{d.name}</p>
                  <p className="text-accent">{d.display}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="base" stackId="tier" fill="transparent" />
        <Bar dataKey="value" stackId="tier" radius={[4, 4, 0, 0]}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
