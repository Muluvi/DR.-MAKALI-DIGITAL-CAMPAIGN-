"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export interface StationBar {
  name: string;
  reachTier: number; // 1–3, qualitative — see data/media-ownership.ts
  reachLabel: string;
  alignmentCategory: string;
  color: string;
}

export default function MediaOwnershipChart({ data }: { data: StationBar[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.3} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 3]}
          ticks={[1, 2, 3]}
          tickFormatter={(v) => (v === 1 ? "Emerging" : v === 2 ? "Medium" : v === 3 ? "High" : "")}
          tick={{ fill: "var(--color-muted)", fontSize: 9, fontWeight: 700 }}
          tickLine={false}
          axisLine={{ stroke: "var(--color-line)" }}
          label={{ value: "Reach (qualitative read, not measured) →", position: "insideBottom", offset: -6, fill: "var(--color-muted)", fontSize: 9, fontWeight: 700 }}
        />
        <YAxis type="category" dataKey="name" width={90} tick={{ fill: "var(--color-ink)", fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "var(--color-line)", opacity: 0.15 }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload as StationBar;
              return (
                <div className="bg-card border border-line p-2.5 shadow-md rounded-xl text-[10px] font-bold text-ink max-w-[220px]">
                  <p className="font-extrabold text-ink mb-1">{d.name}</p>
                  <p style={{ color: d.color }}>{d.alignmentCategory}</p>
                  <p className="text-muted font-semibold mt-1">{d.reachLabel}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="reachTier" radius={[0, 4, 4, 0]}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
