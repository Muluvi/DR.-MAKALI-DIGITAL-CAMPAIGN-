"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUp, Minus } from "lucide-react";

import {
  PLOTTED_BENCHMARKS, UNPLOTTED_BENCHMARKS, targetPosition, type Benchmark,
} from "../../data/benchmarks";
import { useMotionPreset } from "../../hooks/useMotionPreset";
import { STAGGER } from "../../lib/motion";

/**
 * §8.15.2's targets against the industry bands they are set relative to.
 *
 * The table gives a global benchmark and a campaign target in adjacent columns and leaves the
 * reader to hold eight pairs of numbers in their head. What it never shows is the relationship:
 * which targets are set ABOVE the band the industry works in, which sit inside it, and by how
 * far. On one shared axis that is a glance rather than an exercise.
 *
 * It matters here more than it would elsewhere. This reader is a certified monitoring-and-
 * evaluation specialist, and the first question they will ask of a target table is whether the
 * targets are ambitious, conservative, or set without reference to anything. Two of these five
 * are deliberately above the band, two sit at its top edge, and one sits inside it — which is a
 * defensible pattern, and the picture is what makes it legible as a pattern at all.
 *
 * Only the five metrics on a comparable percentage scale are plotted. A cost in shillings, a
 * cost in dollars and a shift in survey points do not share an axis, and forcing them onto one
 * would invent a comparison the document does not make — so those three are listed as text
 * beneath, with their figures intact.
 *
 * Motion contract: bands scale from their left edge, markers fade and settle. Nothing is
 * scroll-linked, because a benchmark caught mid-growth would misstate a band. Reduced motion
 * renders everything final.
 */

function Row({ b, index, shown }: { b: Benchmark; index: number; shown: boolean }) {
  const { reduce, spring, enter } = useMotionPreset();
  const position = targetPosition(b);
  const width = b.benchmarkTo - b.benchmarkFrom;

  return (
    <li className="py-3 border-b border-line/40 last:border-b-0">
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="t-small font-bold text-ink leading-snug min-w-0">{b.metric}</span>
        <span
          className={`inline-flex items-center gap-1 t-micro font-black shrink-0 ${
            position === "above" ? "text-accent" : "text-muted"
          }`}
        >
          {position === "above" ? (
            <ArrowUp size={11} aria-hidden="true" />
          ) : (
            <Minus size={11} aria-hidden="true" />
          )}
          {position === "above" ? "above band" : "at band"}
        </span>
      </div>

      {/* One 0–100 axis, shared by every row, so the rows are comparable to each other and not
          just internally. */}
      <div className="relative h-6" aria-hidden="true">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-line/40" />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-[7px] rounded-full bg-rival-solid/45"
          style={{ left: `${b.benchmarkFrom}%`, width: `${width}%`, transformOrigin: "left" }}
          initial={enter({ scaleX: 0 })}
          animate={shown ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ ...spring("gentle"), delay: reduce ? 0 : index * STAGGER.loose }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-accent"
          style={{ left: `${b.target}%` }}
          initial={enter({ opacity: 0, scaleY: 0.4 })}
          animate={shown ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0.4 }}
          transition={{ ...spring("bouncy"), delay: reduce ? 0 : 0.25 + index * STAGGER.loose }}
        />
      </div>

      <div className="flex items-baseline justify-between gap-3 t-micro tabular-nums">
        <span className="text-muted">Benchmark {b.benchmarkLabel}</span>
        <span className="text-accent font-bold">Target {b.targetLabel}</span>
      </div>
      <p className="t-micro text-muted mt-1 leading-snug">{b.definition}</p>
    </li>
  );
}

export function BenchmarkLadder() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const { reduce } = useMotionPreset();
  const shown = reduce || inView;
  const above = PLOTTED_BENCHMARKS.filter((b) => targetPosition(b) === "above").length;

  return (
    <section
      ref={ref}
      className="not-prose my-7 rounded-2xl border border-line bg-card p-4 sm:p-5"
      style={{ boxShadow: "var(--shadow-2)" }}
      aria-labelledby="benchmark-ladder-title"
    >
      <p className="eyebrow-label">Targets against the field</p>
      <h4 id="benchmark-ladder-title" className="font-serif t-label font-black text-ink">
        Where these targets sit relative to industry benchmarks
      </h4>
      <p className="t-small text-muted leading-relaxed mt-1.5">
        {above} of the {PLOTTED_BENCHMARKS.length} comparable targets are set above the band the
        industry works in; the rest sit at its upper edge. One shared 0–100 axis, so the rows can
        be read against each other.
      </p>

      <div className="flex items-center gap-4 mt-3 mb-1">
        <span className="inline-flex items-center gap-1.5 t-micro text-muted">
          <span aria-hidden="true" className="w-4 h-[7px] rounded-full bg-rival-solid/45" />
          Global benchmark
        </span>
        <span className="inline-flex items-center gap-1.5 t-micro text-muted">
          <span aria-hidden="true" className="w-[3px] h-4 rounded-full bg-accent" />
          Campaign target
        </span>
      </div>

      <ul>
        {PLOTTED_BENCHMARKS.map((b, i) => (
          <Row key={b.metric} b={b} index={i} shown={shown} />
        ))}
      </ul>

      <div className="mt-4 pt-4 border-t border-line/60">
        <p className="t-micro font-black text-muted mb-2">
          Measured on their own scales
        </p>
        <dl className="space-y-2">
          {UNPLOTTED_BENCHMARKS.map((u) => (
            <div key={u.metric} className="flex flex-col gap-0.5">
              <dt className="t-small font-bold text-ink leading-snug">{u.metric}</dt>
              <dd className="t-micro text-muted leading-snug">
                {u.definition} · Benchmark {u.benchmarkLabel} ·{" "}
                <span className="text-accent font-bold">Target {u.targetLabel}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="t-micro text-muted mt-2 leading-snug">
          These three are not plotted above: a cost in shillings, a cost in dollars and a shift in
          survey points share no axis, and putting them on one would invent a comparison this
          document does not make.
        </p>
      </div>
    </section>
  );
}
