"use client";

import dynamic from "next/dynamic";

/**
 * The code-splitting boundary between the prose renderer and the sixty figures.
 *
 * WHY IT EXISTS. `MarkdownViewer` has to be a client component — it carries the Brief/Full switch,
 * the disclosures and the cross-references — and it renders figures inline where a ```figure fence
 * appears. Importing the registry directly from there pulled every figure's data into the shared
 * client bundle: eight data modules, `marks.tsx` and `registry.tsx`, roughly 258 kB of source, for
 * output the browser never changes. First-load JS went from 458 kB at baseline to 491 kB, past the
 * budget the audit set itself.
 *
 * WHY `ssr` STAYS TRUE, which is the whole subtlety. The obvious pattern in this repo is
 * `dynamic(..., { ssr: false })` — used for the charting runtime, where a chart with no JavaScript
 * is no chart. A figure is the opposite: rule 4 requires the final value in the server HTML, the
 * retirement of 67 ASCII blocks rests on those figures reaching a reader with JavaScript off, and
 * the printed kit is rendered from the same HTML. `ssr: false` would empty every figure in the
 * document for exactly the readers the audit spent its time protecting.
 *
 * So the figure is server-rendered into the HTML as before, and only the hydration chunk is
 * deferred. Nothing a reader sees changes; what changes is when the browser pays for it — and on
 * `/`, which opens on the ask and the executive summary, it does not pay until the reader scrolls
 * as far as §3.
 */
const LazyFigure = dynamic(() => import("./registry").then((m) => m.Figure));

export function Figure({ id }: { id: string }) {
  return <LazyFigure id={id} />;
}
