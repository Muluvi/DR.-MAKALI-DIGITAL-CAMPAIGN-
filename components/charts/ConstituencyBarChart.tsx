"use client";

import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ConstituencyChartDatum {
  id: string;
  name: string;
  voters: number;
  share: string;
}

const ABBR: Record<string, string> = {
  "Mwingi North": "Mw.N",
  "Mwingi West": "Mw.W",
  "Mwingi Central": "Mw.C",
  "Kitui West": "Kt.W",
  "Kitui Rural": "Kt.R",
  "Kitui Central": "Kt.C",
  "Kitui East": "Kt.E",
  "Kitui South": "Kt.S",
};

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
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.3} />
        <XAxis
          dataKey="name"
          tick={{ fill: "var(--color-muted)", fontSize: "var(--fs-chart-tick)", fontWeight: 700 }}
          tickLine={false}
          axisLine={false}
          interval={0}
          tickFormatter={(name: string) => ABBR[name] || (name.length > 5 ? name.slice(0, 4) + "." : name)}
        />
        <YAxis tick={{ fill: "var(--color-muted)", fontSize: "var(--fs-chart-tick)" }} tickLine={false} axisLine={false} width={35} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
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
