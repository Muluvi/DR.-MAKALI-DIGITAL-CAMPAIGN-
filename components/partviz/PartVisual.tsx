"use client";

import { useEffect, useRef, useState } from "react";

import type { PartVisualSpec } from "../../lib/part-visuals";
import {
  BarRank,
  BulletTarget,
  ChapterMap,
  ChecklistGrid,
  ContrastBar,
  DonutSplit,
  GaugeArc,
  HubDiagram,
  MatrixGrid,
  Playbook,
  Quadrant,
  QuoteMark,
  ShapeMap,
  StatRail,
  StatementPanel,
  Stepper,
  TimelineRail,
  Waffle,
  Waterfall,
} from "./kinds";

/**
 * The figure that belongs to one heading.
 *
 * Every numbered heading in the proposal has one. Which figure it is comes from the heading's own
 * content (see scripts/build-section-visuals.mjs), so there is no mount table to drift out of
 * step with the document, and a part that is rewritten gets a figure that matches the rewrite.
 *
 * Where a heading already carries a hand-built visualisation in MarkdownViewer's HEADING_INSERTS,
 * that one wins and this renders nothing: the derived figure exists to cover the 220 parts that
 * had nothing, not to sit underneath the 50 that were designed.
 *
 * MOUNTING IS DEFERRED. The whole document is one continuous scroll now, so all 272 of these are
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
    // The part's figure is the table in its own prose — searchable, sortable, exportable and
    // already laid out as cards on a phone. Drawing a second reading of the same rows above it
    // is duplication, not coverage. See scripts/build-section-visuals.mjs.
    case "table": return null;
    case "quadrant": return <Quadrant data={d} />;
    case "hub": return <HubDiagram data={d} />;
    case "checklist": return <ChecklistGrid data={d} />;
    case "chapter": return <ChapterMap data={d} spec={spec} />;
    case "quote": return <QuoteMark data={d} />;
    case "contrast": return <ContrastBar data={d} />;
    case "statement": return <StatementPanel data={d} spec={spec} />;
    default: return <ShapeMap data={d} spec={spec} />;
  }
}
