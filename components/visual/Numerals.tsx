"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "../../hooks/use-in-view";
import { useReducedMotion } from "../../hooks/use-media-query";

interface CountUpProps {
  value: number;
  /** Milliseconds for the whole count. */
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Count again each time it re-enters the viewport. */
  repeat?: boolean;
}

/**
 * A number that counts to its value.
 *
 * The honesty rules this file exists to enforce:
 *
 *   - The accessible name is the FINAL value from the first frame. A screen reader must never be
 *     handed 43,912 when the figure is 532,758.
 *   - Under reduced motion the count does not happen at all — the number renders final. Rule 3:
 *     never animate to the truth.
 *   - The last frame is set from `value`, not from the eased interpolation, so floating-point
 *     drift can never leave the display one unit short of the real figure.
 */
export function CountUp({
  value,
  duration = 1600,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  repeat = false,
}: CountUpProps) {
  const [ref, inView] = useInView<HTMLSpanElement>({ once: !repeat, amount: 0.5 });
  const reduce = useReducedMotion();
  const [counted, setCounted] = useState(0);
  const raf = useRef(0);

  // Rule 3, in one line: under reduced motion the figure is the value, not a point on the way to
  // it. Deriving rather than setting state also keeps the effect free of a synchronous setState.
  const shown = reduce ? value : counted;

  useEffect(() => {
    if (!inView || reduce) return;

    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      // Expo-out: most of the distance is covered early, so the figure is legible for most of
      // the animation rather than blurring past.
      const eased = 1 - Math.pow(1 - p, 4);
      setCounted(p === 1 ? value : value * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, value, duration, reduce]);

  const formatted = `${prefix}${shown.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
  const final = `${prefix}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true">{formatted}</span>
    </span>
  );
}

/**
 * The string form of CountUp, for values the document writes as text — "1.3M+", "KSh 4.2B", "86%".
 *
 * It replaces two near-identical hand-rolled counters that were in this repo, one of which
 * computed its progress as `(timestamp - timestamp % 1 + timestamp - startTime)` — very close to
 * double the real elapsed time, so it finished in about half the duration it was asked for.
 *
 * Anything that does not parse as prefix-number-suffix is rendered verbatim rather than being
 * coerced. A figure this document cannot parse is a figure it must not animate.
 */
export function CountUpText({
  text,
  duration = 1600,
  className = "",
}: {
  text: string;
  duration?: number;
  className?: string;
}) {
  const match = text.match(/^([^0-9.]*)([0-9.]+)([^0-9.]*)$/);
  if (!match) return <span className={className}>{text}</span>;

  const [, prefix, digits, suffix] = match;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;

  return (
    <CountUp
      value={parseFloat(digits)}
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
      duration={duration}
      className={className}
    />
  );
}

interface OdometerProps {
  value: number;
  className?: string;
  /** Pad to this many digits, so a rolling figure does not change width. */
  pad?: number;
}

/**
 * Odometer digit roll.
 *
 * Each column is a 0–9 wheel translated to its digit; only the digits that actually changed
 * move, which is what makes it read as an odometer rather than as ten numbers fading. Grouping
 * separators are emitted as static columns so the roll does not shove them around.
 */
export function Odometer({ value, className = "", pad = 0 }: OdometerProps) {
  const [ref, inView] = useInView<HTMLSpanElement>({ amount: 0.5 });
  const digits = Math.round(value).toString().padStart(pad, "0");
  const grouped = Number(digits).toLocaleString();

  return (
    <span ref={ref} className={`fx-odometer ${className}`}>
      <span className="sr-only">{grouped}</span>
      <span aria-hidden="true" className="inline-flex">
        {grouped.split("").map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i} className="fx-odometer-col">
              <span
                className="fx-odometer-wheel"
                style={{ "--fx-digit": inView ? Number(ch) : 0, "--fx-i": i } as React.CSSProperties}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i} className="px-[0.02em]">{ch}</span>
          )
        )}
      </span>
    </span>
  );
}

interface ProgressRingProps {
  /** 0–1. */
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  label?: string;
  /** Render as a gauge — a 270° arc with a needle — rather than a full ring. */
  gauge?: boolean;
}

/**
 * Progress ring and gauge.
 *
 * Under reduced motion `.fx-ring` is told `animation: none` and the dash offset resolves straight
 * to `--fx-ring-target`, so the arc is drawn at its true proportion on the first frame. A ring
 * frozen at zero would be reporting a figure of zero.
 */
export function ProgressRing({ value, size = 96, stroke = 8, className = "", label, gauge = false }: ProgressRingProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.4 });
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const arc = gauge ? circumference * 0.75 : circumference;
  const clamped = Math.max(0, Math.min(1, value));
  const target = arc * (1 - clamped);

  return (
    <div ref={ref} className={`relative inline-grid place-items-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ?? `${Math.round(clamped * 100)} percent`}>
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="var(--color-line)" strokeWidth={stroke}
          strokeDasharray={`${arc} ${circumference}`}
          transform={`rotate(${gauge ? 135 : -90} ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="var(--color-accent)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
          strokeDashoffset={inView ? target : arc}
          className={inView ? "fx-ring" : undefined}
          style={{ "--fx-ring-len": arc, "--fx-ring-target": target } as React.CSSProperties}
          transform={`rotate(${gauge ? 135 : -90} ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="absolute t-label font-black tabular-nums text-ink">{Math.round(clamped * 100)}%</span>
    </div>
  );
}
