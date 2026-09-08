"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Gauge, Target, User, CalendarClock, Ruler } from "lucide-react";

import { ClaimBadge } from "../markdown/ClaimBadge";
import { baselineStatus, type Baseline, type Kpi } from "../../data/kpis";
import { useMotionPreset } from "../../hooks/useMotionPreset";
import { STAGGER, fadeUp, staggerContainer, VIEWPORT_TALL } from "../../lib/motion";

/**
 * The two scorecards as cards rather than as seven-column tables.
 *
 * A seven-column table at 390px is either a horizontal scroll or a wall of eight-point type, and
 * this reader is going to meet it on a phone. Each KPI becomes a card: the code, the target, one
 * track showing baseline against target, and a drawer holding the method, the owner and the
 * reporting cadence for anyone who wants them.
 *
 * THE TRACK IS THE POINT, AND SO IS ITS ABSENCE.
 *
 * Five of these nine KPIs have a real prior reading — 45,000 pledged voters, 120 captains, 72%
 * turnout conversion — and those get a filled track running from where the campaign is to where
 * it has to get. Two start at a true, measured zero (no polling agents deployed, no Form 37A
 * capture) and are drawn at zero, because that is the reading.
 *
 * The other four cannot be drawn that way. NW-01 to NW-03 read "Not yet measured": the Week 1
 * instrument is what will establish them, and a bar at zero would report an unmeasured quantity
 * as measured at nil. NW-04 is different again — "Confirm w/ party" is a decision nobody has
 * taken, not a reading nobody has made. Both get a hatched track that never acquires a fill, and
 * a badge naming which of the two states they are in.
 *
 * That distinction is the reason this component is careful rather than clever. The reader is a
 * certified monitoring-and-evaluation specialist; conflating "we have not measured this" with
 * "this measured zero" is the specific error their profession exists to catch.
 */

function trackFraction(b: Baseline, targetValue: number | null): number | null {
  if (b.kind !== "measured" || targetValue === null || targetValue === 0) return null;
  return Math.max(0, Math.min(1, b.value / targetValue));
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const { reduce, spring, viewportTall } = useMotionPreset();
  const status = baselineStatus(kpi.baseline);
  const fraction = trackFraction(kpi.baseline, kpi.targetValue);

  return (
    <motion.li variants={fadeUp} className="list-none">
      <div
        className="rounded-2xl border border-line bg-card overflow-hidden"
        style={{ boxShadow: "var(--shadow-2)" }}
      >
        <div className="p-4">
          <div>
            <span className="font-mono t-micro font-black tracking-wider text-accent">
              {kpi.code}
            </span>
            <h4 className="t-label font-bold text-ink leading-snug mt-0.5 text-balance">
              {kpi.title}
            </h4>
            {/* Below the title rather than beside it. "Awaiting campaign decision" is 27
                characters, and on a 390px screen a badge that long shares a row with a heading
                by squeezing it to one word per line. */}
            <div className="mt-2">
              <ClaimBadge status={status} compact />
            </div>
          </div>

          {/* Baseline -> target. */}
          <div className="mt-4">
            <dl className="mb-2 space-y-1.5">
              <div className="flex items-baseline gap-2">
                <dt className="t-micro font-black uppercase tracking-wider text-muted w-[4.75rem] shrink-0 whitespace-nowrap">
                  Baseline
                </dt>
                <dd className="t-small font-bold text-ink leading-snug min-w-0">
                  {kpi.baseline.kind === "measured" ? kpi.baseline.display : kpi.baseline.note}
                </dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="t-micro font-black uppercase tracking-wider text-accent w-[4.75rem] shrink-0 whitespace-nowrap">
                  Target
                </dt>
                <dd className="t-small font-black text-ink leading-snug tabular-nums min-w-0">
                  {kpi.target}
                </dd>
              </div>
            </dl>

            {fraction === null ? (
              // No reading exists. The track is hatched, carries no fill, and says so in words
              // as well as in texture — the hatch is not the only thing distinguishing it.
              <>
                <div
                  className="track-unmeasured h-3 rounded-full"
                  data-animate={reduce ? undefined : "true"}
                  role="img"
                  aria-label={
                    kpi.baseline.kind === "unmeasured"
                      ? `No baseline measurement exists for ${kpi.code}. Target ${kpi.target}.`
                      : `Baseline for ${kpi.code} awaits confirmation with the party. Target ${kpi.target}.`
                  }
                />
                <p className="t-micro text-muted mt-1.5 leading-snug">
                  {kpi.baseline.kind === "unmeasured"
                    ? "No starting value — the Week 1 instrument establishes it. Not drawn at zero."
                    : "Awaiting confirmation with the party. Not a measurement, and not drawn as one."}
                </p>
              </>
            ) : (
              <>
                <div
                  className="relative h-3 rounded-full bg-line/40 overflow-hidden"
                  role="img"
                  aria-label={`${kpi.code}: baseline ${kpi.baseline.kind === "measured" ? kpi.baseline.display : ""}, target ${kpi.target}.`}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-accent-solid"
                    style={{ width: `${fraction * 100}%`, transformOrigin: "left" }}
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={viewportTall}
                    transition={spring("gentle")}
                  />
                </div>
                <p className="t-micro text-muted mt-1.5 tabular-nums">
                  {Math.round(fraction * 100)}% of target at baseline
                  {kpi.baseline.kind === "measured" && kpi.baseline.note
                    ? ` · ${kpi.baseline.note}`
                    : ""}
                </p>
              </>
            )}
          </div>

          <p className="t-small text-muted leading-relaxed mt-3">{kpi.definition}</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={drawerId}
          className="w-full min-h-[44px] px-4 py-2.5 flex items-center justify-between gap-2 border-t border-line/60 bg-paper/50 t-micro font-black uppercase tracking-wider text-muted hover:text-ink fx-press fx-focus cursor-pointer"
        >
          <span>How it is measured, and by whom</span>
          <ChevronDown
            size={14}
            className="shrink-0 transition-transform duration-200"
            style={{ transform: open ? "rotate(180deg)" : "none" }}
            aria-hidden="true"
          />
        </button>

        {/* grid-template-rows 0fr -> 1fr: a height change the compositor can do. */}
        <div
          id={drawerId}
          className="grid transition-[grid-template-rows] duration-200 ease-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden min-h-0">
            <dl className="px-4 py-3 space-y-2.5 border-t border-line/40">
              {[
                { icon: Ruler, term: "Measurement method", desc: kpi.method },
                { icon: User, term: "Owner", desc: kpi.owner },
                { icon: CalendarClock, term: "Reporting cadence", desc: kpi.cadence },
              ].map(({ icon: Icon, term, desc }) => (
                <div key={term} className="flex items-start gap-2">
                  <Icon size={13} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="t-micro font-black uppercase tracking-wider text-muted">{term}</dt>
                    <dd className="t-small text-ink leading-snug">{desc}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function KpiScorecards({
  stage, kpis, title, note,
}: {
  stage: 1 | 2;
  kpis: Kpi[];
  title: string;
  note: string;
}) {
  const { variants } = useMotionPreset();
  const unmeasured = kpis.filter((k) => k.baseline.kind !== "measured").length;

  return (
    <section className="not-prose my-6" aria-label={title}>
      <div className="flex items-center gap-2 mb-1">
        {stage === 1 ? (
          <Gauge size={15} className="text-accent shrink-0" aria-hidden="true" />
        ) : (
          <Target size={15} className="text-gold shrink-0" aria-hidden="true" />
        )}
        <h4 className="font-serif t-label font-black text-ink">{title}</h4>
      </div>
      <p className="t-small text-muted leading-relaxed mb-4">{note}</p>

      {unmeasured > 0 && (
        <p className="t-small text-muted leading-relaxed mb-4 rounded-xl border border-dashed border-line bg-paper/50 px-3 py-2.5">
          <strong className="text-ink font-bold">
            {unmeasured === kpis.length
              ? `None of these ${kpis.length} has a baseline figure yet.`
              : `${unmeasured} of these ${kpis.length} have no baseline figure yet.`}
          </strong>{" "}
          Their tracks are hatched rather than filled. Nothing here is drawn at zero unless zero is
          the reading.
        </p>
      )}

      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        variants={variants(staggerContainer(STAGGER.loose))}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_TALL}
      >
        {kpis.map((k) => (
          <KpiCard key={k.code} kpi={k} />
        ))}
      </motion.ul>
    </section>
  );
}
