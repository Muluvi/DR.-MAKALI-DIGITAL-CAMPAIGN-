"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export interface SlopeSeries {
  key: string;
  name: string;
  color: string;
}

export default function MizaniSlopeChart({ data, series }: { data: Record<string, string | number | null>[]; series: SlopeSeries[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.3} />
        <XAxis dataKey="survey" tick={{ fill: "var(--color-muted)", fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} />
        <YAxis
          domain={[0, 45]}
          unit="%"
          tick={{ fill: "var(--color-muted)", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-card border border-line p-2.5 shadow-md rounded-xl text-[10px] font-bold text-ink">
                  <p className="border-b border-line pb-1 mb-1">{label}</p>
                  {payload.map((p) => (
                    <p key={p.dataKey as string} style={{ color: p.color }}>
                      {p.name}: <span className="text-ink">{p.value}%</span>
                    </p>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="linear"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2.5}
            dot={{ r: 4, strokeWidth: 0, fill: s.color }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
