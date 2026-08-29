"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

export interface TimelinePoint {
  year: string;
  winner: string | null; // null = 2013, a named gap, not a zero result
  votes: number | null;
  color: string;
}

export default function ElectoralTimelineChart({ data }: { data: TimelinePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 24, right: 20, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.3} vertical={false} />
        <XAxis dataKey="year" tick={{ fill: "var(--color-muted)", fontSize: 11, fontWeight: 800 }} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} />
        <YAxis tick={{ fill: "var(--color-muted)", fontSize: 9 }} tickLine={false} axisLine={false} width={44} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload as TimelinePoint;
              if (d.votes === null) {
                return (
                  <div className="bg-card border border-line p-2.5 shadow-md rounded-xl text-[10px] font-bold text-ink max-w-[200px]">
                    <p className="font-extrabold text-ink">{d.year}</p>
                    <p className="text-muted font-semibold">No sourced result — named gap, not invented.</p>
                  </div>
                );
              }
              return (
                <div className="bg-card border border-line p-2.5 shadow-md rounded-xl text-[10px] font-bold text-ink max-w-[200px]">
                  <p className="font-extrabold text-ink">{d.year} winner: {d.winner}</p>
                  <p className="text-accent">{d.votes.toLocaleString()} votes</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="votes" radius={[4, 4, 0, 0]} maxBarSize={80}>
          <LabelList dataKey="winner" position="top" style={{ fill: "var(--color-ink)", fontSize: 10, fontWeight: 800 }} />
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.votes === null ? "transparent" : entry.color} stroke={entry.votes === null ? "var(--color-line)" : "none"} strokeDasharray={entry.votes === null ? "4 3" : undefined} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
