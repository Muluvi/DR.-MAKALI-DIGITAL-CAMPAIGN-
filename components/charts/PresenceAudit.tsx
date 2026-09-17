"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

import { CONSTITUENCIES, COUNTY_TOTAL_WARDS } from "../../data/ward-register";
import { useMotionPreset } from "../../hooks/useMotionPreset";

/**
 * The four figures of the Section 1A presence audit.
 *
 * Every one of them is drawn before its data exists, and that is the point rather than a
 * shortcoming. The audit is Week 1 of the engagement; the proposal is read before Week 1. A
 * figure that invented a follower count to look finished would break the evidence standard in
 * Annex A on the one page that argues for measurement — so each renders its axes, its question
 * and a PENDING band, and fills in when the export lands.
 *
 * Only one side of one figure has real data today: the register half of the reach map, which is
 * the IEBC 2022 file already verified by scripts/verify-ward-register.mjs. It is drawn at full
 * strength beside an empty reach column, which states the gap more exactly than any placeholder.
 */

/** The constituencies inside the recognition-deficit pool (§3.4.5). */
const DEFICIT_IDS = ["mwingi-north", "mwingi-central", "mwingi-west", "kitui-south"];

function PendingBadge({ label = "Week 1 export" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 t-micro font-black uppercase tracking-wide text-gold">
      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" aria-hidden="true" />
      Data needed — {label}
    </span>
  );
}

function FigureShell({
  eyebrow,
  title,
  question,
  children,
  footnote,
  titleId,
}: {
  eyebrow: string;
  title: string;
  question: string;
  children: React.ReactNode;
  footnote: string;
  titleId: string;
}) {
  return (
    <section
      className="not-prose my-7 rounded-2xl border border-line bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-2)" }}
      aria-labelledby={titleId}
    >
      <div className="p-4 sm:p-5 pb-3">
        <p className="eyebrow-label">{eyebrow}</p>
        <h4 id={titleId} className="font-serif t-h4 font-black text-ink leading-tight mt-1">
          {title}
        </h4>
        <p className="t-small text-muted leading-relaxed mt-2">{question}</p>
      </div>
      {children}
      <div className="px-4 sm:px-5 py-3 border-t border-line/60 bg-paper/40">
        <p className="t-micro text-muted leading-relaxed">{footnote}</p>
      </div>
    </section>
  );
}

/**
 * Figure 1 — the reach map against the vote map.
 *
 * Register share is real and drawn to scale. Reach share is the column the audit fills. The
 * deficit constituencies are marked, because the single number this figure exists to produce is
 * the share of reach landing inside them (indicator R-02, §11.2.0).
 */
export function ReachVsVoteMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const { reduce } = useMotionPreset();
  const shown = reduce || inView;

  const rows = [...CONSTITUENCIES]
    .map((c) => ({
      id: c.id,
      name: c.name,
      voters: c.voters,
      share: (c.voters / COUNTY_TOTAL_WARDS) * 100,
      deficit: DEFICIT_IDS.includes(c.id),
    }))
    .sort((a, b) => b.share - a.share);

  const max = Math.max(...rows.map((r) => r.share));
  const deficitShare = rows.filter((r) => r.deficit).reduce((s, r) => s + r.share, 0);

  return (
    <FigureShell
      titleId="reach-vs-vote-title"
      eyebrow="Presence audit · figure 1"
      title="The reach map against the vote map"
      question="How much of the existing reach lands where Dr. Mulu is not yet known?"
      footnote={`Register: IEBC, Registered Voters per County Assembly Ward, 2022 (Tier 1) — ${COUNTY_TOTAL_WARDS.toLocaleString()} voters across 40 wards. Reach: pending the Week 1 Meta city-level export, mapped to sub-county. Platform-reported reach is Tier 2 and is never averaged with the register.`}
    >
      <div ref={ref} className="px-4 sm:px-5 pb-4">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 sm:gap-x-3 t-micro font-black uppercase tracking-wide text-muted pb-2 border-b border-line/60">
          <div className="text-right">Share of register</div>
          <div className="text-center px-1">Constituency</div>
          <div>Share of reach</div>
        </div>

        <ul className="divide-y divide-line/40">
          {rows.map((r) => (
            <li key={r.id} className="grid grid-cols-[1fr_auto_1fr] gap-x-2 sm:gap-x-3 items-center py-1.5">
              {/* Register — real, drawn to scale, right-aligned so the two columns meet in the middle. */}
              <div className="flex justify-end items-center gap-2">
                <span className="t-micro tabular-nums text-muted shrink-0">{r.share.toFixed(1)}%</span>
                <span
                  className={`h-3 rounded-sm ${r.deficit ? "bg-accent" : "bg-ink/25"}`}
                  style={{
                    width: shown ? `${(r.share / max) * 100}%` : 0,
                    transition: reduce ? undefined : "width 700ms cubic-bezier(0.2,0.8,0.2,1)",
                  }}
                />
              </div>

              <div className="text-center px-1 min-w-[6.5rem] sm:min-w-[9rem]">
                <span className={`t-micro ${r.deficit ? "font-black text-accent" : "text-ink"}`}>
                  {r.name}
                </span>
              </div>

              {/* Reach — deliberately empty. The hatch says "not measured", not "zero". */}
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-3 w-full rounded-sm border border-dashed border-line"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, var(--color-line) 0 1px, transparent 1px 6px)",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-accent/40 bg-accent/5 px-3 py-2.5">
          <p className="t-small text-ink leading-snug">
            <strong className="font-black text-accent">{deficitShare.toFixed(1)}%</strong> of the
            register sits in the four recognition-deficit constituencies. The target for R-02 is a
            reach share at least that high.
          </p>
          <PendingBadge />
        </div>
      </div>
    </FigureShell>
  );
}

/**
 * Figure 2 — ninety days, coded.
 *
 * One tile per day in the audit window. Colour carries the content pillar, height carries reach.
 * Drawn empty, at the right dimensions, so the reader sees the shape of the question: ninety
 * days of output with nothing yet said about what any of it was for.
 */
export function PresenceStrip() {
  const days = Array.from({ length: 90 }, (_, i) => i);

  return (
    <FigureShell
      titleId="presence-strip-title"
      eyebrow="Presence audit · figure 2"
      title="Ninety days, coded"
      question="18 June to 16 September 2026 — every post coded by pillar, language, format, and whether it carries a commitment, a date or a ward name."
      footnote="Window chosen for three reasons: it is the longest Meta exports at post level without gaps, it brackets both published Mizani rounds, and it describes the team working today. Coded twice, independently; the inter-coder agreement rate publishes with the findings (Annex A, §3.2.4)."
    >
      <div className="px-4 sm:px-5 pb-4">
        <div aria-hidden="true" className="flex items-end gap-[2px] h-20 sm:h-24">
          {days.map((d) => (
            <span
              key={d}
              className="flex-1 rounded-[2px] border-t border-dashed border-line/80 bg-ink/[0.04]"
              style={{ height: `${28 + ((d * 37) % 11)}%` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-1.5 t-micro text-muted tabular-nums">
          <span>18 Jun</span>
          <span>16 Sep 2026</span>
        </div>
        <p className="sr-only">
          A strip of ninety daily tiles covering 18 June to 16 September 2026. Each tile is
          coloured by content pillar and sized by reach once the Week 1 export is loaded; it is
          currently unfilled.
        </p>
        <div className="mt-3">
          <PendingBadge />
        </div>
      </div>
    </FigureShell>
  );
}

/**
 * Figure 3 — which language travels.
 *
 * Three bars: engagement rate by post language, on reach rather than on followers. The
 * denominator is named on the figure because it is the thing most often got wrong, and getting
 * it wrong flatters every campaign that does.
 */
export function LanguageBars() {
  const languages = ["Kikamba", "Kiswahili", "English"];

  return (
    <FigureShell
      titleId="language-bars-title"
      eyebrow="Presence audit · figure 3"
      title="Which language travels"
      question="Engagement rate by post language — measured on reach, not on followers."
      footnote="If one language out-performs the others by a wide margin, language stops being a preference in the weekly brief and becomes a rule (§7.3). Post counts print beneath each bar, because a rate over four posts is not a finding."
    >
      <div className="px-4 sm:px-5 pb-4">
        <ul className="space-y-3">
          {languages.map((l) => (
            <li key={l} className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
              <span className="t-small font-bold text-ink">{l}</span>
              <span
                aria-hidden="true"
                className="h-5 rounded-md border border-dashed border-line"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, var(--color-line) 0 1px, transparent 1px 6px)",
                }}
              />
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <PendingBadge />
        </div>
      </div>
    </FigureShell>
  );
}

/**
 * Figure 4 — him against the field.
 *
 * The only figure in the audit whose data needs no access from anyone: every column is public.
 * Rival rows come from the same public post-level coding, in the same window, so the comparison
 * is like for like rather than his export against their impressions.
 */
export function FieldComparison() {
  const field = [
    { name: "Dr. Makali Mulu", self: true },
    { name: "Dr. Irene Kasalu", self: false },
    { name: "Sen. Enoch Wambua", self: false },
    { name: "Hon. Charity Ngilu", self: false },
  ];

  return (
    <FigureShell
      titleId="field-comparison-title"
      eyebrow="Presence audit · figure 4"
      title="Him against the field"
      question="Posts per week, median shares per post, and ads live — for all four candidates, over the same ninety days."
      footnote="Public data only: visible post counts, visible engagement, Meta Ad Library and the Google Ads Transparency Centre. No access is required from anyone, and nothing here is scraped from a private source (§13.4.1)."
    >
      <div className="px-4 sm:px-5 pb-4">
        <div className="grid grid-cols-[1fr_repeat(3,minmax(3.5rem,auto))] gap-x-2 sm:gap-x-4 t-micro font-black uppercase tracking-wide text-muted pb-2 border-b border-line/60">
          <div>Candidate</div>
          <div className="text-right">Posts/wk</div>
          <div className="text-right">Shares</div>
          <div className="text-right">Ads live</div>
        </div>
        <ul className="divide-y divide-line/40">
          {field.map((c) => (
            <li
              key={c.name}
              className="grid grid-cols-[1fr_repeat(3,minmax(3.5rem,auto))] gap-x-2 sm:gap-x-4 items-center py-2.5"
            >
              <span className={`t-small ${c.self ? "font-black text-accent" : "text-ink"}`}>
                {c.name}
              </span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="text-right t-small tabular-nums text-muted">
                  —
                </span>
              ))}
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <PendingBadge label="public pull, week 1" />
        </div>
      </div>
    </FigureShell>
  );
}
