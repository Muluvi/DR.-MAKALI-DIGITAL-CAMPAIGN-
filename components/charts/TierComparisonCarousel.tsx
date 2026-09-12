"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Check, Minus, Star } from "lucide-react";

import { TIER_ATTRIBUTES, TIER_COLUMNS, type Cell, type TierColumn } from "../../data/tier-matrix";
import { useMotionPreset } from "../../hooks/useMotionPreset";
import { STAGGER, fadeUp, staggerContainer, VIEWPORT } from "../../lib/motion";

/**
 * the scope levels compared section's nine-attribute matrix, as one card per tier.
 *
 * A four-column comparison table on a 390px phone stacks into nine cards — one per ATTRIBUTE,
 * each repeating all three tiers. That answers "what does row six say", which is not the question
 * the scope levels compared section exists to answer. The reader is choosing between three tiers, so the card is the tier:
 * swipe left, swipe right, decide. Three cards, snap-aligned, in the scope levels compared section's own column order —
 * Lean, Standard, Premium — with Tier 2 marked as recommended because the section's own next
 * paragraph recommends it. Reordering the columns to put the recommendation first would be the
 * interface disagreeing with the document, which is not a decision an interface gets to make.
 *
 * Phone only. Above `sm` the table itself is the better comparison: its rows line up across all
 * three tiers, where three cards side by side drift out of alignment as their text wraps. The
 * table stays in the document at every width — it is the accessible equivalent and it is what a
 * reader quotes from; this is a second rendering of it, and every string in data/tier-matrix.ts
 * is the cell as the scope levels compared section prints it.
 *
 * Motion contract: cards rise on entering the viewport, staggered. Swiping is the browser's own
 * scroll-snap — no drag handler, no library, so it works with a trackpad, a thumb, a keyboard and
 * a screen reader's own scrolling alike. Under reduced motion the cards are simply present, and
 * the dots jump rather than smooth-scroll.
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

function TierCard({ column, index }: { column: TierColumn; index: number }) {
  const preset = useMotionPreset();
  return (
    <motion.li
      variants={preset.variants(fadeUp)}
      className={`snap-center shrink-0 basis-[85%] rounded-2xl border p-4 ${
 column.recommended
          ? "border-accent/60 bg-accent/[0.06] ring-1 ring-accent/25"
          : "border-line/60 bg-card/70"
      }`}
      aria-labelledby={`tier-card-${column.id}`}
    >
      <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-line/50">
        <h4 id={`tier-card-${column.id}`} className="font-serif font-semibold text-ink leading-tight">
          <span className="block t-micro font-sans font-black text-muted">
            {column.number}
          </span>
          {column.label}
        </h4>
        {column.recommended && (
          <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-accent-solid text-on-accent px-2 py-0.5 t-micro font-black">
            <Star size={10} className="fill-current" aria-hidden="true" />
            Recommended
          </span>
        )}
      </div>

      <dl className="space-y-3">
        {TIER_ATTRIBUTES.map((attr) => (
          <div key={attr.label}>
            <dt className="t-micro font-black text-muted leading-snug">
              {attr.label}
            </dt>
            <dd className="t-small leading-snug mt-0.5">
              <CellValue
                value={attr[column.id]}
                emphasised={attr.emphasise?.includes(column.id)}
              />
            </dd>
          </div>
        ))}
      </dl>

      <span className="sr-only">{`Column ${index + 1} of ${TIER_COLUMNS.length} in the section 9.2.6 comparison table below.`}</span>
    </motion.li>
  );
}

export function TierComparisonCarousel() {
  const preset = useMotionPreset();
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const [active, setActive] = useState(0);

  // Which card the track is showing, read from scroll position rather than tracked in state on
  // every tap — a thumb swipe and a dot tap have to agree, and only the scroll position knows.
  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const centre = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centre);
      if (d < best) { best = d; nearest = i; }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; syncActive(); });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    syncActive();
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [syncActive]);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: preset.reduce ? "auto" : "smooth",
    });
  };

  return (
    <div ref={ref} className="not-prose my-6 sm:hidden print:hidden">
      <p className="t-micro font-black text-muted mb-2">
        Swipe to compare the three tiers
      </p>

      <motion.ol
        ref={trackRef}
        variants={preset.variants(staggerContainer(preset.stagger(STAGGER.normal)))}
        initial={preset.enter("hidden")}
        animate={inView ? "visible" : undefined}
        className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-4 px-4 pb-2"
      >
        {TIER_COLUMNS.map((column, i) => (
          <TierCard key={column.id} column={column} index={i} />
        ))}
      </motion.ol>

      {/* Dots are a second way to reach a card, not the only way — the track scrolls without
          them, and they carry the tier's name so a screen reader gets a destination, not "2". */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {TIER_COLUMNS.map((column, i) => (
          <button
            key={column.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show ${column.number} — ${column.label}`}
            aria-current={active === i ? "true" : undefined}
            className="fx-focus flex h-11 w-11 items-center justify-center rounded-full cursor-pointer"
          >
            <span
              className={`block rounded-full transition-all duration-200 ${
 active === i ? "w-6 h-2 bg-accent" : "w-2 h-2 bg-line"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
