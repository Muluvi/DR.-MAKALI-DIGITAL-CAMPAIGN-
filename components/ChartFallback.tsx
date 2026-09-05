"use client";

/**
 * Reserved space for a chart block while its runtime loads. The height is held so the page
 * does not shift under the reader's thumb mid-scroll — the failure mode that makes a long
 * document feel broken on a phone.
 */
export function ChartFallback({ height = 320 }: { height?: number }) {
  return (
    <div
      className="w-full my-6 rounded-2xl border border-line/60 bg-card/50 animate-pulse"
      style={{ minHeight: height }}
      aria-hidden="true"
    />
  );
}
