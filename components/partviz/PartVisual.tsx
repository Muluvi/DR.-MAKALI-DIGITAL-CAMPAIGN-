"use client";

import { useEffect, useRef, useState } from "react";

import type { PartVisualSpec } from "../../lib/part-visuals";
import {
  BarRank,
  BulletTarget,
  ChecklistGrid,
  ContrastBar,
  DonutSplit,
  GaugeArc,
  MatrixGrid,
  Playbook,
  Quadrant,
  StatRail,
  Stepper,
  TimelineRail,
  Waffle,
  Waterfall,
} from "./kinds";

/**
 * The figure that belongs to one heading, where one is warranted.
 *
 * NOT EVERY HEADING HAS ONE, and that is the change. There used to be 272 of these, one under
 * every numbered heading, because PR #10 promised "a figure under every heading" — and 99 of them
 * measured nothing at all. They restated the heading (`statement`, 51), listed the subsections
 * about to be scrolled past (`chapter`, 23), redrew the heading's own bullets as a wheel (`hub`,
 * 11), quoted a truncated fragment of the prose beneath (`quote`, 6) or drew an abstract diagram
 * from an empty array (`shape`, 8). A further 37 (`table`) were derived, serialised and shipped
 * only to render null, because the part's real figure is its own interactive table.
 *
 * There are now 152, every one of which draws a measurable relationship, and 120 headings carry
 * no figure — which is a complete answer, and on a document 468,000 pixels tall it is a kinder
 * one than a panel that repeats the sentence beside it.
 *
 * Which figure it is comes from the heading's own content (see scripts/build-section-visuals.mjs),
 * so there is no mount table to drift out of step with the document, and a part that is rewritten
 * gets a figure that matches the rewrite.
 *
 * Where a heading already carries a hand-built visualisation in MarkdownViewer's HEADING_INSERTS,
 * that one wins and this renders nothing: the derived figure exists to cover the 220 parts that
 * had nothing, not to sit underneath the 50 that were designed.
 *
 * MOUNTING IS DEFERRED. The whole document is one continuous scroll now, so all of these are
 * on the page at once. Each mounts when it is within a screen and a half of the viewport and
 * reserves its height before then, which is what keeps the flow's scroll cheap and its layout
 * stable.
 *
 * The spec arrives as a PROP rather than being looked up here. The lookup table is 188 KB of
 * JSON; resolved on the server it stays on the server, and each figure carries only its own
 * spec across the boundary.
 */
export function PartVisual({ spec }: { spec: PartVisualSpec | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted || !spec) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "700px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, spec]);

  if (!spec) return null;

  return (
    <div ref={ref} className="pv-slot" data-kind={spec.kind}>
      {mounted ? <PartVisualBody spec={spec} /> : <span className="pv-slot__hold" aria-hidden="true" />}
    </div>
  );
}

function PartVisualBody({ spec }: { spec: PartVisualSpec }) {
  const d = spec.data;
  switch (spec.kind) {
    case "stats": return <StatRail data={d} />;
    case "bars": return <BarRank data={d} />;
    case "gauge": return <GaugeArc data={d} />;
    case "donut": return <DonutSplit data={d} />;
    case "waffle": return <Waffle data={d} />;
    case "waterfall": return <Waterfall data={d} />;
    case "bullet": return <BulletTarget data={d} />;
    case "stepper": return <Stepper data={d} />;
    case "timeline": return <TimelineRail data={d} />;
    case "playbook": return <Playbook data={d} />;
    case "matrix": return <MatrixGrid data={d} />;
    case "quadrant": return <Quadrant data={d} />;
    case "checklist": return <ChecklistGrid data={d} />;
    case "contrast": return <ContrastBar data={d} />;
    // No default panel. A kind this component does not know how to draw is a generator change
    // that has not landed here yet, and drawing something decorative in its place is how the 99
    // empty figures got onto the page in the first place.
    default: return null;
  }
}
