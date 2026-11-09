"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";

import { useInView } from "../../hooks/use-in-view";
import { tierWord } from "../../data/types";
import type { DigestStat } from "../../lib/digest";
import type { TabId } from "../../lib/heading-slug";
import { LeadMarkdown } from "../MarkdownViewer";
import { CountUp } from "../premium/CountUp";

/**
 * A chapter on one screen (streamline pass, November 2026).
 *
 * The flow was every chapter laid end to end: about 520 phone screens, with the decision in the
 * twenty-third chapter. A reader deciding whether to approve an engagement needs each chapter's
 * conclusion first and its evidence on demand, so on "/" a chapter now opens as this: what it
 * concludes, the numbers it rests on, and the steps of its argument. One control opens the whole
 * chapter in place, and every step is a way straight to that part of it.
 *
 * Everything here is the chapter's own: the lead is its lead fence, the numbers are its first stats
 * visual, the steps are its headings (lib/digest.ts). So the digest cannot say something the
 * chapter does not.
 *
 * MOTION. The steps draw forward along their line and the numbers count up, once, as the digest
 * arrives; both rest at their true values in the server HTML and under reduced motion
 * (app/streamline.css). Nothing is hidden waiting for a script.
 */

/** Steps shown before "and N more": a digest is a summary, and the chapter holds the rest. */
const MAX_STEPS = 5;

export interface DigestStep {
  id: string;
  title: string;
}

const TIER_TONE: Record<string, string> = { "1": "t1", "2": "t2", "3": "t3" };

export function ChapterDigest({
  tabId,
  lead,
  stats,
  steps,
  minutes,
  open,
  controls,
  onToggle,
  onStep,
}: {
  tabId: TabId;
  lead: string;
  stats: DigestStat[];
  steps: DigestStep[];
  /** How long the opened chapter takes to read, from what it shows on load. */
  minutes: number;
  open: boolean;
  /** The id of the chapter body this digest opens. */
  controls: string;
  onToggle: () => void;
  onStep: (id: string) => void;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.25, margin: "-6% 0px" });
  const shown = steps.slice(0, MAX_STEPS);
  const more = steps.length - shown.length;

  return (
    <div ref={ref} className="cd not-prose" data-in-view={inView ? "true" : "false"} data-open={open ? "true" : "false"}>
      {lead && (
        <div className="cd__lead">
          <LeadMarkdown text={lead} tabId={tabId} />
        </div>
      )}

      {stats.length > 0 && (
        <ul className="cd__stats" data-count={stats.length}>
          {stats.map((s) => (
            <li key={`${s.value}-${s.label}`} className="cd__stat">
              <span className="cd__value">
                <CountUp text={s.value} />
              </span>
              <span className="cd__label">{s.label}</span>
              {s.tier !== undefined && (
                <span className={`cd__tier cd__tier--${TIER_TONE[String(s.tier)] ?? "model"}`}>{tierWord(s.tier)}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {shown.length > 0 && (
        <div className="cd__inside">
          <p className="cd__kicker">In this chapter</p>
          <ol className="cd__steps" style={{ "--cd-steps": shown.length } as React.CSSProperties}>
            {shown.map((step, i) => (
              <li key={step.id} style={{ "--cd-i": i } as React.CSSProperties}>
                <button type="button" className="cd__step" onClick={() => onStep(step.id)}>
                  <span className="cd__node" aria-hidden="true">{i + 1}</span>
                  <span className="cd__step-title">{step.title}</span>
                  <ArrowUpRight size={14} aria-hidden="true" className="cd__step-go" />
                </button>
              </li>
            ))}
          </ol>
          {more > 0 && <p className="cd__more">and {more} more inside</p>}
        </div>
      )}

      <button type="button" className="cd__open" aria-expanded={open} aria-controls={controls} onClick={onToggle}>
        <span>{open ? "Close the chapter" : "Read the chapter"}</span>
        {!open && <span className="cd__mins">about {minutes} min</span>}
        <ChevronDown size={16} aria-hidden="true" className="cd__chev" />
      </button>
    </div>
  );
}
