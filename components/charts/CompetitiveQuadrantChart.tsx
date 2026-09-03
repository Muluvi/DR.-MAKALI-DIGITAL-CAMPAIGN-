"use client";

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer, Cell } from "recharts";

import { DURATION } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

export interface QuadrantPoint {
  name: string;
  preference: number; // measured, Mizani Africa 7 August 2026 (%)
  credibility: number; // 1-3 qualitative scale, NOT measured data
  credibilityLabel: string;
  note: string;
  color: string;
}

export default function CompetitiveQuadrantChart({ data }: { data: QuadrantPoint[] }) {
  const reduce = useReducedMotionSafe();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.4} />
        <ReferenceLine x={26} stroke="var(--color-line)" strokeDasharray="4 4" />
        <ReferenceLine y={2} stroke="var(--color-line)" strokeDasharray="4 4" />
        <XAxis
          type="number"
          dataKey="preference"
          name="Measured preference"
          domain={[0, 45]}
          unit="%"
          tick={{ fill: "var(--color-muted)", fontSize: 10, fontWeight: 700 }}
          tickLine={false}
          axisLine={{ stroke: "var(--color-line)" }}
          label={{ value: "Measured preference (Mizani Africa, 7 Aug 2026) →", position: "insideBottom", offset: -12, fill: "var(--color-muted)", fontSize: 10, fontWeight: 700 }}
        />
        <YAxis
          type="number"
          dataKey="credibility"
          name="Fiscal credibility"
          domain={[0, 4]}
          ticks={[1, 2, 3]}
          tickFormatter={(v) => (v === 1 ? "Low" : v === 2 ? "Medium" : v === 3 ? "High" : "")}
          tick={{ fill: "var(--color-muted)", fontSize: 10, fontWeight: 700 }}
          tickLine={false}
          axisLine={{ stroke: "var(--color-line)" }}
          width={70}
          label={{ value: "Perceived fiscal credibility (qualitative) ↑", angle: -90, position: "insideLeft", fill: "var(--color-muted)", fontSize: 10, fontWeight: 700 }}
        />
        <ZAxis range={[260, 260]} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload as QuadrantPoint;
              return (
                <div className="bg-card border border-line p-3 shadow-md rounded-xl t-label font-bold text-ink max-w-[220px]">
                  <p className="font-extrabold text-ink mb-1">{d.name}</p>
                  <p className="text-accent">Preference: <span className="text-ink">{d.preference}%</span></p>
                  <p className="text-gold">Credibility: <span className="text-ink">{d.credibilityLabel}</span></p>
                  <p className="text-muted font-semibold mt-1 leading-snug normal-case">{d.note}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter
          data={data}
          isAnimationActive={!reduce}
          animationDuration={DURATION.entrance * 1000}
          animationEasing="ease-out"
        >
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color} stroke="var(--color-card)" strokeWidth={2} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
