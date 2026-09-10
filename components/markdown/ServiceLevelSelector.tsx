"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { Check, Minus } from "lucide-react";

import { TIER_ATTRIBUTES, TIER_COLUMNS, type Cell } from "../../data/tier-matrix";
import { useMotionPreset } from "../../hooks/useMotionPreset";

/**
 * §9.2.5's three service levels, as one segmented control driving one panel.
 *
 * This replaces a budget modeller and a ceiling meter, and the replacement is the point. Those
 * two answered "how much of the statutory ceiling does this tier consume" — a question the
 * document no longer asks, because the levels are now levels of scope and the money is a
 * conversation for the meeting. What survives is the only question left: what actually changes
 * between Lean, Standard and Premium?
 *
 * So the interface is a chooser, not a calculator. One control, one panel, no derived figures —
 * every string is the cell as §9.2.6 prints it, read from data/tier-matrix.ts.
 *
 * "Only what differs" is on by default, and that is the whole argument for this component over
 * the table below it. Of the eight attributes, three are identical between Standard and Premium;
 * showing them anyway is how a comparison table tricks a reader into thinking the expensive
 * option buys more than it does. Hiding the matching rows makes the real difference — which
 * wards carry an active SMS and USSD layer — impossible to miss. The full table stays in the
 * document underneath at every width, as the accessible equivalent and as what a reader quotes.
 *
 * Motion contract: the thumb slides between segments, the panel does not animate on switch
 * (content that moves while being read is worse than content that appears). Under reduced motion
 * the thumb jumps.
 */

function CellValue({ value, emphasised }: { value: Cell; emphasised?: boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1.5 text-accent font-semibold">
        <Check size={14} className="stroke-[3] shrink-0" aria-hidden="true" />
        Included
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted">
        <Minus size={14} className="stroke-[3] shrink-0" aria-hidden="true" />
        Not included
      </span>
    );
  }
  return <span className={emphasised ? "font-bold text-ink" : "text-ink"}>{value}</span>;
}

/** Rows where this level differs from at least one other. */
function differingRows(id: "lean" | "standard" | "premium") {
  return TIER_ATTRIBUTES.filter((attr) =>
    TIER_COLUMNS.some((c) => c.id !== id && attr[c.id] !== attr[id])
  );
}

export function ServiceLevelSelector() {
  const preset = useMotionPreset();
  const [active, setActive] = useState(1);
  const [diffOnly, setDiffOnly] = useState(true);
  const groupId = useId();
  const column = TIER_COLUMNS[active];
  const rows = diffOnly ? differingRows(column.id) : TIER_ATTRIBUTES;
  const hidden = TIER_ATTRIBUTES.length - rows.length;

  return (
    <figure className="not-prose my-6 rounded-2xl border border-line/60 bg-card/70 p-4 sm:p-5">
      <figcaption className="mb-3">
        <h4 className="font-serif text-sm font-bold text-ink">Choose a service level</h4>
        <p className="t-small text-muted mt-0.5">
          What changes is scope — team, ward coverage, analytics depth, content cadence and
          research frequency. What it costs is a conversation for the meeting.
        </p>
      </figcaption>

      <div
        role="tablist"
        aria-label="Service level"
        className="relative grid grid-cols-3 gap-1 rounded-xl bg-paper border border-line/60 p-1"
      >
        {TIER_COLUMNS.map((c, i) => (
          <button
            key={c.id}
            role="tab"
            id={`${groupId}-tab-${c.id}`}
            aria-selected={i === active}
            aria-controls={`${groupId}-panel`}
            onClick={() => setActive(i)}
            className={`relative min-h-[44px] rounded-lg px-2 t-small font-bold transition-colors ${
              i === active ? "text-on-accent" : "text-muted hover:text-ink"
            }`}
          >
            {i === active && (
              <motion.span
                layoutId={`${groupId}-thumb`}
                transition={preset.feedback({ type: "spring", stiffness: 420, damping: 34 })}
                className="absolute inset-0 rounded-lg bg-accent-solid"
                aria-hidden="true"
              />
            )}
            <span className="relative flex flex-col items-center leading-tight">
              <span className="t-micro font-black opacity-70">{c.number}</span>
              {c.label}
            </span>
          </button>
        ))}
      </div>

      <div
        id={`${groupId}-panel`}
        role="tabpanel"
        aria-labelledby={`${groupId}-tab-${column.id}`}
        className="mt-4"
      >
        {column.recommended && (
          <p className="inline-flex items-center gap-1 rounded-full bg-accent/10 text-accent px-2 py-0.5 t-micro font-black mb-3">
            Recommended in §9.2.6
          </p>
        )}
        <dl className="space-y-3">
          {rows.map((attr) => (
            <div key={attr.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3 items-baseline">
              <dt className="t-micro font-black text-muted leading-snug">{attr.label}</dt>
              <dd className="t-small leading-snug">
                <CellValue value={attr[column.id]} emphasised={attr.emphasise?.includes(column.id)} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <label className="mt-4 flex items-center gap-2 min-h-[44px] t-small text-muted cursor-pointer">
        <input
          type="checkbox"
          checked={diffOnly}
          onChange={(e) => setDiffOnly(e.target.checked)}
          className="size-4 accent-[var(--accent-solid,currentColor)]"
        />
        Show only what differs from the other levels
        {diffOnly && hidden > 0 && (
          <span className="t-micro text-muted/80">({hidden} identical row{hidden === 1 ? "" : "s"} hidden)</span>
        )}
      </label>
    </figure>
  );
}
