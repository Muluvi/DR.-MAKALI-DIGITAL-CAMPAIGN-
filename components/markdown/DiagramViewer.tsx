"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, Minus, Plus, RotateCcw, Scan, X } from "lucide-react";

/**
 * The reading surface for the proposal's box-drawing diagrams.
 *
 * These blocks are drawings, not prose: the monospace grid carries the meaning, so the text can
 * never be reflowed. That leaves width as the whole problem. The widest diagram is 112 columns,
 * which at the phone type size is roughly 690px of drawing inside a 400px card — about two
 * fifths of it off-screen behind a horizontal scroll that a reader moving vertically down a
 * long document will not necessarily discover.
 *
 * So the default stops hiding anything: if the drawing is wider than its card it is scaled to
 * fit, and the whole shape is visible at a glance. Scaling a 112-column diagram to a phone makes
 * it too small to read comfortably, which is what the second control is for — the drawing opens
 * full-screen, where it can be zoomed and dragged at a size that reads. Nothing is transcribed,
 * summarised or reflowed; the same characters are presented at a size the reader chooses.
 */

/** Zoom bounds and step for the full-screen reader. Presentation only — no document figure. */
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Measures the drawing against the space it actually has. Returns the factor that makes it fit
 * (1 when it already does) and its natural height, which the caller needs because a scaled
 * element keeps its unscaled height in flow.
 */
function useFit(outer: React.RefObject<HTMLDivElement | null>, inner: React.RefObject<HTMLPreElement | null>) {
  const [fit, setFit] = useState({ scale: 1, naturalHeight: 0 });

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;

    const measure = () => {
      // clientWidth includes the card's horizontal padding, which is not space the drawing can
      // use — scaling against it leaves the drawing overflowing by exactly that padding.
      const cs = getComputedStyle(o);
      const avail = o.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const natural = i.scrollWidth;
      const naturalHeight = i.scrollHeight;
      if (!avail || !natural) return;
      setFit({ scale: natural > avail ? avail / natural : 1, naturalHeight });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    // The drawing's own size changes with the fluid type scale, not just the card's width.
    ro.observe(i);
    return () => ro.disconnect();
  }, [outer, inner]);

  return fit;
}

/** The full-screen reader: the same drawing, at a size the reader sets, dragged into view. */
function DiagramOverlay({
  title,
  body,
  onClose,
}: {
  title?: string;
  body: string;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Open at the size that shows the whole drawing, so the reader starts from the shape and
  // zooms into the detail rather than landing mid-diagram with no idea of its extent.
  useLayoutEffect(() => {
    const s = surfaceRef.current;
    const p = preRef.current;
    if (!s || !p) return;
    const fit = Math.min(1, (s.clientWidth - 24) / p.scrollWidth);
    setZoom(clamp(fit, MIN_ZOOM, MAX_ZOOM));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setZoom((z) => clamp(z + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM));
      if (e.key === "-") setZoom((z) => clamp(z - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM));
    };
    window.addEventListener("keydown", onKey);
    // The page behind must not scroll while the reader is dragging the diagram over it.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    setPan({ x: d.px + (e.clientX - d.x), y: d.py + (e.clientY - d.y) });
  };
  const endDrag = () => {
    drag.current = null;
  };

  const reset = () => {
    setPan({ x: 0, y: 0 });
    const s = surfaceRef.current;
    const p = preRef.current;
    if (s && p) setZoom(clamp(Math.min(1, (s.clientWidth - 24) / p.scrollWidth), MIN_ZOOM, MAX_ZOOM));
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-paper print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} — full screen` : "Diagram — full screen"}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-line bg-card shrink-0">
        <span className="t-small font-bold text-ink leading-tight min-w-0 break-words flex-1">
          {title ?? "Diagram"}
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => clamp(z - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM))}
          className="tap p-2 rounded-lg border border-line text-muted hover:text-ink"
          aria-label="Zoom out"
        >
          <Minus size={15} />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => clamp(z + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM))}
          className="tap p-2 rounded-lg border border-line text-muted hover:text-ink"
          aria-label="Zoom in"
        >
          <Plus size={15} />
        </button>
        <button
          type="button"
          onClick={reset}
          className="tap p-2 rounded-lg border border-line text-muted hover:text-ink"
          aria-label="Reset view"
        >
          <RotateCcw size={15} />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="tap p-2 rounded-lg border border-line text-muted hover:text-ink"
          aria-label="Close full screen"
        >
          <X size={15} />
        </button>
      </div>

      <div
        ref={surfaceRef}
        className="flex-1 overflow-hidden touch-none cursor-grab active:cursor-grabbing flex items-center justify-center"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <pre
          ref={preRef}
          className="ascii-pre font-mono leading-[1.45] text-ink m-0 p-3 whitespace-pre w-max select-text"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            // The surface centres the pre's unscaled box, so the scale has to work from the
            // same centre; against a top-left origin the two disagree and the drawing lands
            // off to one side of the screen.
            transformOrigin: "center",
          }}
        >
          {body}
        </pre>
      </div>
    </div>,
    document.body
  );
}

export function DiagramViewer({ title, body }: { title?: string; body: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const { scale: fitScale, naturalHeight } = useFit(outerRef, preRef);
  const [open, setOpen] = useState(false);
  const [actualSize, setActualSize] = useState(false);

  const overflows = fitScale < 1;
  const scale = overflows && !actualSize ? fitScale : 1;

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <div
        ref={outerRef}
        className={actualSize ? "scroll-x px-3 py-3" : "overflow-hidden px-3 py-3"}
      >
        {/* A scaled element keeps its unscaled box in flow, so the height is set explicitly on a
            sizer; without it every fitted drawing trails a band of dead space below it. */}
        <div
          style={
            scale === 1 || !naturalHeight
              ? undefined
              : { height: naturalHeight * scale, overflow: "hidden" }
          }
        >
          <pre
            ref={preRef}
            className="ascii-pre font-mono leading-[1.45] text-ink m-0 p-0 whitespace-pre w-max"
            style={scale === 1 ? undefined : { transform: `scale(${scale})`, transformOrigin: "top left" }}
          >
            {body}
          </pre>
        </div>
      </div>

      {overflows && (
        <div className="flex items-center gap-2 px-3 pb-3 -mt-1">
          <button
            type="button"
            onClick={() => setActualSize((v) => !v)}
            className="tap inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-line bg-paper/60 t-label font-bold text-muted hover:text-ink"
          >
            <Scan size={12} />
            {actualSize ? "Fit to width" : "Actual size"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="tap inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-accent/30 bg-accent/5 t-label font-bold text-accent hover:bg-accent/10"
          >
            <Maximize2 size={12} />
            Full screen
          </button>
        </div>
      )}

      {open && <DiagramOverlay title={title} body={body} onClose={close} />}
    </>
  );
}
