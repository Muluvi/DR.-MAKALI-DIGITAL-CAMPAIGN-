"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export interface FiscalBar {
  name: string;
  value: number; // KSh
  display: string;
  color: string;
}

export default function FiscalAuditChart({ data }: { data: FiscalBar[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.3} vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--color-muted)", fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} interval={0} />
        <YAxis tick={{ fill: "var(--color-muted)", fontSize: 9 }} tickLine={false} axisLine={false} width={44} tickFormatter={(v) => `${(v / 1_000_000_000).toFixed(1)}bn`} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload as FiscalBar;
              return (
                <div className="bg-card border border-line p-2.5 shadow-md rounded-xl text-[10px] font-bold text-ink max-w-[220px]">
                  <p className="font-extrabold text-ink mb-1">{d.name}</p>
                  <p className="text-accent">{d.display}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={90}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
