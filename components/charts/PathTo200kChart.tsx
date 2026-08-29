"use client";

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

export interface PathPoint {
  rank: number;
  ward: string;
  constituencyName: string;
  voters: number;
  cumulative: number;
  color: string;
}

export default function PathTo200kChart({ data, threshold }: { data: PathPoint[]; threshold: number }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.3} vertical={false} />
        <XAxis dataKey="rank" tick={{ fill: "var(--color-muted)", fontSize: 9 }} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} label={{ value: "Wards, ranked by register size ↓", position: "insideBottom", offset: -4, fill: "var(--color-muted)", fontSize: 9, fontWeight: 700 }} />
        <YAxis tick={{ fill: "var(--color-muted)", fontSize: 9 }} tickLine={false} axisLine={false} width={44} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <ReferenceLine
          y={threshold}
          stroke="var(--color-danger)"
          strokeDasharray="5 3"
          strokeWidth={2}
          label={{ value: `~${(threshold / 1000).toFixed(0)}k win threshold`, position: "insideTopLeft", fill: "var(--color-danger)", fontSize: 9, fontWeight: 800 }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload as PathPoint;
              return (
                <div className="bg-card border border-line p-2.5 shadow-md rounded-xl text-[10px] font-bold text-ink max-w-[200px]">
                  <p className="font-extrabold text-ink">{d.ward}</p>
                  <p className="text-muted font-semibold">{d.constituencyName}</p>
                  <p className="text-accent mt-1">Ward: <span className="text-ink">{d.voters.toLocaleString()}</span></p>
                  <p className="text-gold">Cumulative: <span className="text-ink">{d.cumulative.toLocaleString()}</span></p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="voters" barSize={6}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color} />
          ))}
        </Bar>
        <Line type="monotone" dataKey="cumulative" stroke="var(--color-ink)" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
