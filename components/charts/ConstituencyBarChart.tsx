"use client";

import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ConstituencyChartDatum {
  id: string;
  name: string;
  voters: number;
  share: string;
}

export default function ConstituencyBarChart({
  chartData,
  selectedID,
  onSelect
}: {
  chartData: ConstituencyChartDatum[];
  selectedID: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.3} />
        <XAxis dataKey="name" tick={{ fill: "var(--color-muted)", fontSize: 8, fontWeight: 700 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "var(--color-muted)", fontSize: 8 }} tickLine={false} axisLine={false} width={35} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const dataEntry = payload[0].payload;
              return (
                <div className="bg-card border border-line p-2 shadow-md rounded-xl t-label font-bold text-ink">
                  <p className="font-extrabold text-ink">{dataEntry.name}</p>
                  <p className="text-accent">Registered: <span className="font-extrabold text-ink">{dataEntry.voters.toLocaleString()}</span></p>
                  <p className="text-gold">Share: <span className="font-extrabold text-ink">{dataEntry.share}</span></p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="voters" fill="var(--color-accent)" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={selectedID === entry.id ? "var(--color-accent)" : "var(--color-muted)"}
              opacity={selectedID === entry.id ? 1 : 0.4}
              className="cursor-pointer"
              onClick={() => onSelect(entry.id)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
