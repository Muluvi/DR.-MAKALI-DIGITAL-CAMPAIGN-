# Performance measurements — Phase 5

Measured numbers only. Anything not measured says so.

## Method

Production build (`next build`), served by `next start`, driven by headless
Chromium through the Chrome DevTools Protocol.

| Setting | Value |
|---|---|
| Network | 1.6 Mbit/s down, 750 kbit/s up, 150 ms RTT (Chrome's "Slow 4G") |
| CPU | 4× throttling (`Emulation.setCPUThrottlingRate`) |
| Viewport | 360 × 780, DPR 2, `isMobile`, touch |
| Cache | disabled — every load is cold |
| Bytes | `Network.loadingFinished.encodedDataLength`, i.e. over the wire |
| LCP / CLS / FCP / TBT | `PerformanceObserver`, buffered |
| INP | longest `event` entry with an `interactionId`, after one real tap |

The tap is on the index opener, the same control on every route and in every
run.

### INP is measured twice, and the difference matters

An earlier revision of this document reported INP between 768 and 3712 ms.
Those numbers were taken by tapping the instant `networkidle` fired, so the tap
landed while React still had queued work from page load. That measures the page
still settling, not the cost of the interaction.

On `/situation`: tapping immediately gives 3096 ms, with 2645 ms of it inside
pointerdown dispatch. Tapping six seconds later gives 328 ms, with pointerdown
processing at 7 ms. Both are real — a reader who taps during load does wait —
but only the second is the interaction's own cost, and the budget is about
interactions over the page's life. The table below reports the settled figure
and says so. The load-time figure is kept separately, below, because it is a
genuine finding of its own.

**Not measured:** a real handset, a real Kitui network, or any third-party lab.
This is emulation in a container, and emulated 4× CPU is a stand-in for a
mid-range Android, not the thing itself.

## Three passes

### Pass 1 — the charting runtime on every route

`components/StrategicAids.tsx` is imported by both `ClientPage` and
`MarkdownViewer`, so it is in the first load on all nineteen routes. It carried
a dead `recharts` import, two dead chart-component imports, and a dead
`export { ChartComponent }` re-export — a re-export being a static import, that
line alone put the charting runtime in the shared chunk and defeated the
`next/dynamic` boundary on all eleven chart blocks under `components/markdown`.
`DataVisualizations` and `VoterProjectionsChart` do use recharts, render only on
the landing tab, and already sat inside a `LazyMount`; both now load through the
same dynamic boundary and `ChartFallback` the markdown blocks use.

First Load JS 421 → 292 kB gzipped. Over the wire, JS 420 → 300 kB as a mean.
LCP, TBT and INP did not move: the bytes removed were never on the critical path
for first paint.

### Pass 2 — opening the full index

Opening the index created all 241 rows at once: about 4,600 nodes and 241 icons,
styled and laid out before the browser could paint. A CPU profile put 3638 ms in
browser style/layout/paint and ~1650 ms in React render. Two earlier hypotheses
were wrong and are recorded so they are not retried: the ripple's
`getBoundingClientRect` costs 0–1 ms during a real tap, and the modal's own
render is about 200 ms.

`content-visibility` containment on each row, plus painting 24 rows inside the
tap and appending the rest on the next frame. Nothing hidden, nothing dropped;
search still filters the full set.

Settled INP, measured by reverting the two files, rebuilding, and re-running the
same probe against this build:

| Route | Before | After |
|---|---|---|
| `/` | 864 ms | 280 ms |
| `/situation` | 808 ms | 320 ms |
| `/messaging` | 832 ms | 256 ms |
| `/scope-platforms` | 800 ms | 256 ms |
| `/summary` | 808 ms | 280 ms |

### Pass 3 — four preloaded fonts

199 kB of font on the critical path before anything could paint, the largest
single file the italic cut of the serif at 64.5 kB. Body text is Montserrat; the
serif carries headings and the mono is reserved for field instrumentation. Only
Montserrat is preloaded now. The other faces still load, still with
`display: swap` and an adjusted fallback, and on routes that render no serif
italic the italic face is no longer fetched at all.

Mean font bytes 206 → 149 kB. Mean LCP 2285 → 1965 ms.

This also explains the unstable LCP reported earlier. Five runs of `/` gave
4084, 3912, 1900, 1920 and 4016 ms on identical bytes; they now give 2488, 2476,
2472, 2536 and 2488. The LCP element was never changing — the fonts it waited on
were arriving in a different order each time.

Verified after the change that all four faces still load and resolve: serif
headings in Newsreader, mono in JetBrains Mono, body in Montserrat, and the
serif italic still present where the document uses it.

### Pass 4 — a forced layout per render

`useIsMobile` answered with `window.innerWidth < 768`. Reading `innerWidth`
flushes pending layout, and `useSyncExternalStore` calls `getSnapshot` on every
render and again to check for tearing, so every render of every consumer forced
a full layout of the document.

Instrumented on `/situation` at 4× CPU: **nineteen reads, 1413 ms between them,
74 ms each.** With a `MediaQueryList` answering instead: one read, 2 ms. Total
long-task time after `networkidle` fell from 4349 ms to 3639 ms in the same
sample.

It does not move INP and is not claimed to. Five settled runs on `/summary` give
264, 272, 248, 272, 272 ms with the change and 328, 264, 272, 240, 256 ms
without — the same number either side. What it removes is work the document was
doing for an answer it could get more cheaply.

## Variance, and what the per-route table is worth

The per-route figures above are one run each. Repeating them shows that is fine
for most routes and misleading for the heaviest one.

| Route | Five settled runs |
|---|---|
| `/summary` | 264, 272, 248, 272, 272 ms |
| `/situation` | 1320, 1328, 1192, 336, 424 ms |

`/summary` is stable to within 24 ms. `/situation` is not stable at all: the
same interaction on the same build costs anywhere from 336 to 1328 ms, because
work from page load is sometimes still running six seconds later. **Its 432 ms
in the table is a lucky draw, not a typical result.** Any future claim about
`/situation` needs repeated runs; a single number from that route means nothing.

## Three hypotheses that were wrong

Recorded so they are not retried.

**The ripple.** `useRipple` calls `getBoundingClientRect` on pointerdown, which
looks like a forced layout in a hot path. Measured during a real tap it costs
0–1 ms: layout is clean at dispatch, because the browser had to hit-test to
deliver the event.

**The index modal's own render.** About 200 ms. The cost was mounting the rows,
not the sheet.

**Motion's layout pairing.** Every card row carries a `layoutId`, which enlists
it in Motion's projection system. Gating that on visibility changed
`measureScroll` not at all — 1813 ms before, 1813 ms after — so the change was
reverted rather than kept for appearances.

## Where the document stands

| | Start | Now | Budget |
|---|---|---|---|
| Transferred | 704 kB | **527 kB** | ≤ 1.5 MB |
| JS | 420 kB | **300 kB** | ≤ 300 KB |
| Fonts | 206 kB | **149 kB** | — |
| LCP | 2285 ms | **1965 ms** | ≤ 2.5 s |
| TBT | 2604 ms | **2115 ms** | — |
| INP, settled | ~810 ms | **287 ms** | ≤ 200 ms |

All means across the same twenty routes.

| Route | Transferred | JS | LCP | INP (settled) | CLS | Pass |
|---|---|---|---|---|---|---|
| `/` | 495 kB | 293 kB | 2.53 s | 288 ms | 0.002 | fail: LCP, INP |
| `/approach` | 487 kB | 293 kB | 1.66 s | 256 ms | 0.012 | fail: INP |
| `/assumptions` | 548 kB | 293 kB | 1.72 s | 296 ms | 0.002 | fail: INP |
| `/audiences` | 495 kB | 293 kB | 1.71 s | 264 ms | 0.002 | fail: INP |
| `/cover` | 492 kB | 293 kB | 2.50 s | 312 ms | 0.002 | fail: INP |
| `/deliverables` | 489 kB | 293 kB | 1.71 s | 280 ms | 0.002 | fail: INP |
| `/governance` | 576 kB | 293 kB | 2.00 s | 264 ms | 0.002 | fail: INP |
| `/measurement` | 502 kB | 293 kB | 1.93 s | 264 ms | 0.002 | fail: INP |
| `/messaging` | 586 kB | 293 kB | 2.05 s | 264 ms | 0.002 | fail: INP |
| `/nextsteps` | 483 kB | 293 kB | 1.60 s | 280 ms | 0.002 | fail: INP |
| `/objectives` | 482 kB | 293 kB | 1.52 s | 280 ms | 0.002 | fail: INP |
| `/risk` | 531 kB | 293 kB | 2.02 s | 280 ms | 0.002 | fail: INP |
| `/roadmap` | 494 kB | 293 kB | 1.88 s | 272 ms | 0.002 | fail: INP |
| `/scope-data` | 514 kB | 293 kB | 2.03 s | 280 ms | 0.002 | fail: INP |
| `/scope-ground` | 513 kB | 293 kB | 2.22 s | 312 ms | 0.000 | fail: INP |
| `/scope-media` | 497 kB | 293 kB | 1.79 s | 256 ms | 0.002 | fail: INP |
| `/scope-platforms` | 580 kB | 293 kB | 2.14 s | 304 ms | 0.002 | fail: INP |
| `/situation` | 796 kB | 429 kB | 3.03 s | 432 ms | 0.000 | fail: JS, LCP, INP |
| `/structure` | 488 kB | 293 kB | 1.64 s | 288 ms | 0.002 | fail: INP |
| `/summary` | 487 kB | 293 kB | 1.61 s | 272 ms | 0.002 | fail: INP |

Failing: transferred 0/20 · JS 1/20 · LCP 2/20 · CLS 0/20 · INP 20/20.

## What is still outstanding

**INP, mean 287 ms against 200 ms.** Down from ~810, no longer the largest
failure, and still over. The remaining cost is style and layout on a document
carrying 4,200–10,000 nodes before the index is opened at all.

**Motion's projection system, ~1800 ms on `/situation`.** After the four passes
above, the largest single item left in a CPU profile of the seconds after load
is `measureScroll` inside Motion's projection node — the measurement every
mounted `motion.*` element pays. It is not driven by any one component, so there
is no surgical fix: it comes down with the number of `motion.*` elements
mounted, which is what `/motion` exists to reduce. It is also why `/situation`'s
interaction cost is so unstable. **This is the next real lever, and it belongs
to the motion phase rather than to another performance pass.**

**`/situation` at 429 kB of JS.** The one route over the JS budget, and
correctly so: it has charts, so it loads the chart runtime. It is also the
heaviest DOM in the document at 9,981 nodes, which is why its settled INP
(432 ms) is half again the next worst.

**LCP on `/` (2.53 s) and `/situation` (3.03 s).** Both marginal, both now
stable run to run.

**Load-time INP.** With the tap landing the instant the page reaches
`networkidle`, `/situation` still measures 3312 ms and `/scope-ground` 1504 ms —
everything else is 248–384 ms. That is React flushing queued work when a
discrete input arrives, and it is worth fixing separately: a reader who taps
while the page is still settling waits three seconds on the longest route.

**Three font families where the brief specifies one.** 149 kB of font remains.
Reducing to one family would take most of that, and it changes how every heading
and paragraph in the document looks. That is a typographic decision for the
author, not a mechanical one, so it is recorded rather than taken.

**`Save-Data` and `prefers-reduced-motion`.** Not measured — there is no Tier 2
dynamic import for them to skip yet.
