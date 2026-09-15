"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

import { PlatformGlyph } from "../brand/PlatformLogos";
import { platformIdFor } from "../../lib/platform-mentions";

export interface PlatformDatum {
  name: string;
  value: number; // millions — upper bound where the source gives a range
  display: string;
  note: string;
  color: string;
}

/**
 * Axis label with the platform's mark in front of its name.
 *
 * A nested <svg> rather than a <foreignObject>, because the tick is rendered inside the chart's
 * own SVG and foreignObject does not survive being rasterised or printed reliably. The mark is
 * monochrome and takes the axis colour: the bars beside it already carry the chart's own
 * categorical palette, and a brand colour on the label would read as a second, contradicting
 * encoding of the same row.
 *
 * Messenger is in this dataset and is not one of the seven marks, so `platformIdFor` returns
 * null for it and that row keeps a plain text label — which is the correct outcome, not a gap.
 */
function PlatformTick({ x, y, payload }: { x?: number; y?: number; payload?: { value?: string } }) {
  const name = payload?.value ?? "";
  const id = platformIdFor(name);
  const cx = x ?? 0;
  const cy = y ?? 0;
  return (
    <g>
      {id && <PlatformGlyph id={id} size={11} x={cx - 86} y={cy - 6} />}
      <text
        x={cx - (id ? 71 : 86)}
        y={cy}
        dy={4}
        fill="var(--color-ink)"
        fontSize={10}
        fontWeight={700}
      >
        {name}
      </text>
    </g>
  );
}

export default function PlatformSizingChart({ data }: { data: PlatformDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" opacity={0.3} horizontal={false} />
        <XAxis type="number" tick={{ fill: "var(--color-muted)", fontSize: 9 }} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} unit="m" />
        <YAxis dataKey="name" type="category" tick={<PlatformTick />} tickLine={false} axisLine={false} width={90} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload as PlatformDatum;
              return (
                <div className="bg-card border border-line p-2.5 shadow-md rounded-xl t-label font-bold text-ink max-w-[220px]">
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
