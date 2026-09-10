"use client";

import { useEffect, useRef } from "react";
import {
  animate, motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform,
} from "motion/react";
import { CalendarClock, TrendingDown, Vote } from "lucide-react";

import {
  CONTEST_ROUNDS, CONTEST_SOURCE, DEFICIT_FIRST, DEFICIT_LATEST, DEFICIT_WIDENING,
  FIRST_ROUND, LATEST_ROUND, SHARE_AXIS_MAX,
} from "../../data/nomination-contest";
import { TierBadge } from "../markdown/TierBadge";
import { useMotionPreset } from "../../hooks/useMotionPreset";
import { DURATION, EASE_ENTRANCE } from "../../lib/motion";

/**
 * The 15.3-point deficit, resolved by scrolling.
 *
 * This is the document's thesis, so it is the first thing the interface argues. Two opposed
 * columns grow toward their true shares as the reader scrolls the section, and the gap between
 * them counts up to 15.3 as they separate. Nothing autoplays: the reader drives it, which means
 * the number arrives at the pace they read rather than at a pace chosen for them.
 *
 * The second half is the part that matters more, and the part a bar chart hides. The deficit was
 * 11.1 points in June and 15.3 in August. A campaign that is behind can close a gap; a campaign
 * whose gap is opening has a different and more urgent problem, and the widening marker says so
 * in the same picture rather than in a footnote.
 *
 * WHAT THIS DOES NOT DO. Ngilu was not in the June round, so she has no June share and no line
 * is drawn to one. Wambua's share fell between rounds and that is shown as it happened. No
 * projection, no trendline beyond the two published points, and no fourth round: two rounds are
 * what exists.
 *
 * Motion contract. Column heights are `scaleY` from a bottom origin, so the compositor handles
 * every frame and nothing triggers layout on a mid-range Android. Under reduced motion the
 * scroll link is not registered at all — the columns render at their true shares from the first
 * frame and the deficit reads 15.3, because a column caught mid-growth is a column showing a
 * share nobody measured.
 *
 * Accessible equivalent: the table beneath is the real one, always in the DOM, carrying every
 * share in both rounds. The graphic is `aria-hidden`.
 */

const CANDIDATES = [
  { key: "mulu", name: "Dr. Makali Mulu", tone: "own" },
  { key: "kasalu", name: "Dr. Irene Kasalu", tone: "rival" },
  { key: "ngilu", name: "Charity Ngilu", tone: "field" },
  { key: "wambua", name: "Sen. Enoch Wambua", tone: "field" },
] as const;

function Column({
  share, label, sub, tone, progress, reduce,
}: {
  share: number;
  label: string;
  sub: string;
  tone: "own" | "rival";
  progress: ReturnType<typeof useTransform<number, number>> | null;
  reduce: boolean;
}) {
  const height = (share / SHARE_AXIS_MAX) * 100;
  const fill = tone === "own" ? "bg-accent-solid" : "bg-rival-solid";
  const text = tone === "own" ? "text-accent" : "text-rival";

  return (
    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
      <div className={`t-figure font-black tabular-nums leading-none ${text}`}>
        {share.toFixed(1)}<span className="t-label align-super font-bold">%</span>
      </div>
      <div className="relative w-full max-w-[92px] h-40 sm:h-56 rounded-t-xl bg-line/25 overflow-hidden">
        <motion.div
          className={`absolute inset-x-0 bottom-0 rounded-t-xl ${fill}`}
          style={{
            height: `${height}%`,
            transformOrigin: "bottom",
            // Reduced motion: no scroll link, no starting scale — the true share, immediately.
            scaleY: reduce || !progress ? 1 : progress,
          }}
          initial={false}
        />
      </div>
      <div className="text-center">
        <div className="t-label font-bold text-ink leading-tight">{label}</div>
        <div className="t-micro text-muted leading-tight">{sub}</div>
      </div>
    </div>
  );
}

export function DeficitGauge() {
  const ref = useRef<HTMLDivElement>(null);
  const gapRef = useRef<HTMLSpanElement>(null);
  const { reduce } = useMotionPreset();

  // The reader's scroll through this element is the timeline, and it FINISHES WHILE THE BLOCK IS
  // STILL ARRIVING — from the moment its top crosses 95% of the viewport to the moment it
  // reaches 45%. That range matters more than it looks.
  //
  // A scroll-linked figure can rest wherever the reader stops, and this one was doing exactly
  // that: caught halfway up the page it read "Dr. Mulu trails by 10.9 points", which is a figure
  // no survey produced. Resolving during the approach means that by the time the sentence is
  // legible in the middle of the screen it has already settled on 15.3, and every position a
  // reader can comfortably stop at is a position showing the true number.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 45%"],
  });

  // A spring off the raw progress, so a flicked scroll on a phone reads as weight rather than as
  // jitter tracking every pixel.
  const eased = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // The completion guarantee, and the reason this is not scroll-linked alone.
  //
  // Scroll position is the reader's, and a reader can stop anywhere — including on a frame where
  // the count reads 11.5, a deficit no survey measured. A figure in this document may be
  // arriving or it may be true, and it may never be neither. So the scroll drives the resolve
  // while the reader is moving, and this floor finishes it if they stop: the displayed value is
  // whichever is further along. The gauge still answers to the scroll; it just cannot be left
  // holding a number that is not the number.
  const floor = useMotionValue(0);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      floor.set(1);
      return;
    }
    // From here the count owns the text, and it is guaranteed to reach 15.3.
    counting.current = true;
    if (gapRef.current) gapRef.current.textContent = "0.0";
    const controls = animate(floor, 1, { duration: DURATION.deliberate, ease: EASE_ENTRANCE });
    return () => controls.stop();
  }, [inView, reduce, floor]);

  const resolved = useTransform<number, number>([eased, floor], ([a, b]) => Math.max(a, b));
  const grow = useTransform(resolved, [0, 1], [0, 1]);
  const gap = useTransform(resolved, [0, 1], [0, DEFICIT_LATEST]);

  // The count only writes to the page once it is genuinely running.
  //
  // Before that the element holds the published figure — the value the server rendered, the
  // value a reader with no JavaScript sees, and the value in the printed PDF. Without this gate
  // the block sat at "0.0" from first paint until the reader happened to scroll into it, which
  // is the same failure as a server-rendered zero: a figure of nought where the figure is 15.3.
  const counting = useRef(false);

  useMotionValueEvent(gap, "change", (v) => {
    const node = gapRef.current;
    if (!node || !counting.current) return;
    // The spring approaches its target asymptotically and overshoot is possible on a fast
    // flick. Neither may put a wrong figure on screen, so the last tenth of the range is
    // pinned to the published value rather than interpolated toward it.
    node.textContent = v >= DEFICIT_LATEST - 0.05 ? DEFICIT_LATEST.toFixed(1) : v.toFixed(1);
  });

  return (
    <section
      ref={ref}
      className="not-prose my-8 rounded-3xl border border-line bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-3)" }}
      aria-labelledby="deficit-gauge-title"
    >
      <div className="px-4 sm:px-6 pt-5 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="eyebrow-label !mb-0">The contest, as measured</p>
          <TierBadge tier={2} compact />
        </div>
        <h3 id="deficit-gauge-title" className="font-serif t-headline font-black text-ink leading-[1.05] mt-1">
          Dr. Mulu trails by{" "}
          <span className="anim-num text-accent">
            <span className="sr-only">{DEFICIT_LATEST.toFixed(1)}</span>
            <span aria-hidden="true" className="anim-num__size">{DEFICIT_LATEST.toFixed(1)}</span>
            <span aria-hidden="true" ref={gapRef} className="anim-num__value">
              {DEFICIT_LATEST.toFixed(1)}
            </span>
          </span>{" "}
          points
        </h3>
        <p className="t-small text-muted mt-2 max-w-prose">
          {LATEST_ROUND.label}. The nomination is the binding contest, and this is the gap it has
          to close.
        </p>
      </div>

      {/* The graphic. Hidden from assistive technology — the table below carries the same
          figures, in full, and is the version a screen reader should meet. */}
      <div aria-hidden="true" className="px-4 sm:px-6 pt-4">
        <div className="flex items-end gap-3 sm:gap-6">
          <Column
            share={LATEST_ROUND.shares.mulu} label="Mulu" sub="the campaign" tone="own"
            progress={reduce ? null : grow} reduce={reduce}
          />
          <div className="flex flex-col items-center gap-1 pb-16 sm:pb-24 shrink-0">
            <TrendingDown size={16} className="text-danger" />
            <div className="t-micro font-black text-muted whitespace-nowrap">
              gap
            </div>
          </div>
          <Column
            share={LATEST_ROUND.shares.kasalu} label="Kasalu" sub="the leader" tone="rival"
            progress={reduce ? null : grow} reduce={reduce}
          />
        </div>
      </div>

      {/* The trend. Two published rounds, and the direction between them. */}
      <div aria-hidden="true" className="mx-4 sm:mx-6 mt-6 rounded-2xl border border-danger/25 bg-danger/[0.04] p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="t-micro font-black text-muted">
              And it is opening
            </div>
            <div className="t-small text-ink font-semibold leading-snug mt-0.5">
              {DEFICIT_FIRST} points in June, {DEFICIT_LATEST} points in August
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="t-figure font-black tabular-nums text-danger leading-none">
              +{DEFICIT_WIDENING}
            </div>
            <div className="t-micro text-muted">points wider</div>
          </div>
        </div>
        {/* Two segments on one track: what the gap was, and what it became. The extension grows
            from where June ended, so the widening is the part that moves. */}
        <div className="relative mt-3 h-2 rounded-full bg-line/40 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-danger/45"
            style={{ width: `${(DEFICIT_FIRST / SHARE_AXIS_MAX) * 100}%` }}
          />
          <motion.div
            className="absolute inset-y-0 rounded-full bg-danger"
            style={{
              left: `${(DEFICIT_FIRST / SHARE_AXIS_MAX) * 100}%`,
              width: `${(DEFICIT_WIDENING / SHARE_AXIS_MAX) * 100}%`,
              transformOrigin: "left",
              scaleX: reduce ? 1 : grow,
            }}
          />
        </div>
      </div>

      {/* Why a survey number is the ballot. This is the framing the rest of the document rests
          on, and it belongs beside the figure rather than four paragraphs later. */}
      <div className="px-4 sm:px-6 mt-6">
        <p className="t-small text-ink font-semibold leading-snug">
          The party is selecting by opinion poll, not by competitive primary. There is no delegate
          contest to organise — <em>the number above is the ballot</em>.
        </p>
        <div className="mt-4 pt-4 border-t border-line/60 grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <CalendarClock size={15} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="t-micro font-black text-muted">Nomination window</div>
              <div className="t-label font-bold text-ink mt-0.5">29 Aug – 15 Nov 2026</div>
              <div className="t-micro text-muted">Phase −1</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Vote size={15} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="t-micro font-black text-muted">General election</div>
              <div className="t-label font-bold text-ink mt-0.5">10 August 2027</div>
              <div className="t-micro text-muted">Threshold ≈200,000</div>
            </div>
          </div>
        </div>
      </div>

      {/* The accessible equivalent, and the version that prints. Never hidden. */}
      <div className="px-4 sm:px-6 py-5">
        <details className="group">
          <summary className="t-label font-bold text-accent cursor-pointer list-none inline-flex items-center gap-1.5 min-h-[44px] min-w-[44px] justify-center">
            <span className="underline underline-offset-4 decoration-dotted">
              Both published rounds, as a table
            </span>
          </summary>
          <div className="overflow-x-auto mt-3">
            <table className="w-full t-small border-collapse">
              <caption className="sr-only">
                Kitui County gubernatorial preference, {CONTEST_ROUNDS.map((r) => r.label).join(" and ")}.
                Shares are percentages.
              </caption>
              <thead>
                <tr className="bg-paper/70">
                  <th scope="col" className="text-left px-3 py-2 t-micro font-black text-muted border-b border-line">Candidate</th>
                  {CONTEST_ROUNDS.map((r) => (
                    <th key={r.date} scope="col" className="text-right px-3 py-2 t-micro font-black text-muted border-b border-line">
                      {r.short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CANDIDATES.map((c) => (
                  <tr key={c.key} className="border-b border-line/40 last:border-b-0">
                    <th scope="row" className="text-left px-3 py-2 font-semibold text-ink">{c.name}</th>
                    {CONTEST_ROUNDS.map((r) => {
                      const v = r.shares[c.key];
                      return (
                        <td key={r.date} className="text-right px-3 py-2 tabular-nums text-muted">
                          {v === null ? (
                            <span title="Not polled in this round">Not polled</span>
                          ) : (
                            `${v.toFixed(1)}%`
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-t-2 border-line">
                  <th scope="row" className="text-left px-3 py-2 font-black text-ink">Deficit, Kasalu over Mulu</th>
                  <td className="text-right px-3 py-2 tabular-nums font-bold text-ink">{DEFICIT_FIRST} pts</td>
                  <td className="text-right px-3 py-2 tabular-nums font-black text-danger">{DEFICIT_LATEST} pts</td>
                </tr>
              </tbody>
            </table>
            <p className="t-micro text-muted mt-2">
              Source: {CONTEST_SOURCE.name} (Tier {CONTEST_SOURCE.tier}). Ngilu was not included in
              the June round; that cell is a gap in the published data, not a zero.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
