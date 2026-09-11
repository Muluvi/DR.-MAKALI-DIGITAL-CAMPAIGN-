"use client";

import React from "react";

interface InlineSparklineProps {
  data: number[];
  label?: string;
  unit?: string;
  color?: string;
}

export function InlineSparkline({
  data,
  label,
  unit = "",
  color = "var(--color-accent)"
}: InlineSparklineProps) {
  if (!data || data.length < 2) return null;

  const width = 64;
  const height = 18;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 4) + 2;
      const y = height - 2 - ((val - min) / range) * (height - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const latest = data[data.length - 1];

  return (
    <span
      className="inline-flex items-center align-middle gap-1 mx-1.5 px-1.5 py-0.5 rounded bg-card/60 border border-line/40 tnum text-ink text-[0.8em] font-medium select-none not-prose"
      title={label ? `${label}: ${latest.toLocaleString()}${unit}` : undefined}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible shrink-0"
        aria-hidden="true"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Endpoint marker dot */}
        {points.split(" ").slice(-1).map((pt, i) => {
          const [cx, cy] = pt.split(",");
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="2"
              fill={color}
              stroke="var(--color-card)"
              strokeWidth="0.75"
            />
          );
        })}
      </svg>
      <span className="font-semibold text-accent t-micro">
        {latest.toLocaleString()}
        {unit}
      </span>
    </span>
  );
}
