"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export interface WaterfallStep {
  name: string;
  base: number; // invisible offset so the visible segment "floats"
  value: number; // visible segment height
  display: string;
  color: string;
  isTotal?: boolean;
}

export default function ResourceEnvelopeChart({ data }: { data: WaterfallStep[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.3} vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--color-muted)", fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} interval={0} />
        <YAxis
          tick={{ fill: "var(--color-muted)", fontSize: 9 }}
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(v) => `${v.toFixed(1)}bn`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload.find((p) => p.dataKey === "value")?.payload as WaterfallStep | undefined;
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
        <Bar dataKey="base" stackId="wf" fill="transparent" />
        <Bar dataKey="value" stackId="wf" radius={[4, 4, 0, 0]}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
