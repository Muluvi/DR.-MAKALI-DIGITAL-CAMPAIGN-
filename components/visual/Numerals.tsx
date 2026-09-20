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
 *   - THE SERVER RENDERS THE FINAL VALUE. This is the rule the component used to break. State was
 *     seeded with `useState(0)`, so the server HTML — and therefore a reader with JavaScript
 *     blocked, a slow phone before hydration, a printed page and reader mode — carried
 *     `KSh0.00bn`, `0.0%` and `≈0k`. Measured on the built site before this change: all three
 *     were literally in the response body. A figure that reads zero is not a loading state to a
 *     monitoring-and-evaluation specialist; it is a wrong measurement. The count now starts from
 *     the real figure and only drops to zero at the moment it is about to animate, on the client,
 *     inside a reduced-motion check.
 *   - THE ACCESSIBLE NAME IS ALWAYS THE FIGURE. A screen reader must never be handed 43,912
 *     when the figure is 532,758, and at rest the one node below reads exactly the published
 *     value.
 *   - ONE TEXT NODE. There is no visually hidden second copy. `aria-hidden` removes a node from
 *     the accessibility tree and from nothing else, so the old sr-only sibling was still picked
 *     up by copy-paste, find-in-page, reader mode and `textContent` — which is how the /full DOM
 *     came to carry 124,284 words against 63,433 in the source. The single node is exact at rest
 *     and only differs from the final value during the count itself.
 *   - Under reduced motion the count does not happen at all — the number renders final and never
 *     moves. Rule 3: never animate to the truth.
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
  // Seeded with the truth. `null` means "nothing has animated", and the figure renders final —
  // which is the state the server, a no-JS reader and reduced motion all stay in permanently.
  const [counted, setCounted] = useState<number | null>(null);
  const raf = useRef(0);

  const shown = counted ?? value;

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

  const format = (n: number) =>
    `${prefix}${n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  return (
    // The width of the FINAL string is reserved in `ch`, so a figure counting up cannot nudge the
    // line it sits on — the same CLS guarantee the old hidden sizer node bought, without putting
    // a second copy of the number into the document's text.
    <span
      ref={ref}
      className={`tabular-nums inline-block text-left ${className}`}
      style={{ minWidth: `${format(value).length}ch` }}
    >
      {format(shown)}
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
