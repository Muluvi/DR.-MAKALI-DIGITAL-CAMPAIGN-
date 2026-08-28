"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export interface PlatformDatum {
  name: string;
  value: number; // millions — upper bound where the source gives a range
  display: string;
  note: string;
  color: string;
}

export default function PlatformSizingChart({ data }: { data: PlatformDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.3} horizontal={false} />
        <XAxis type="number" tick={{ fill: "var(--color-muted)", fontSize: 9 }} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} unit="m" />
        <YAxis dataKey="name" type="category" tick={{ fill: "var(--color-ink)", fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} width={90} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload as PlatformDatum;
              return (
                <div className="bg-card border border-line p-2.5 shadow-md rounded-xl text-[10px] font-bold text-ink max-w-[220px]">
                  <p className="border-b border-line pb-1 mb-1">{d.name}</p>
                  <p className="text-accent">{d.display}</p>
                  <p className="text-muted font-semibold mt-1 leading-snug normal-case">{d.note}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
