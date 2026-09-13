# Performance measurements — Phase 5, pass 1

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
| INP | the longest `event` entry carrying an `interactionId`, after one real tap |

The tap is on the first visible button, which is the same control before and
after on all twenty routes — the index opener on eighteen, "Full index" on `/`
and `/cover`. One run per route unless stated.

**Not measured:** a real handset, a real Kitui network, and any third-party
lab. This is emulation on a container, and emulated CPU throttling is not a
mid-range Android.

## Pass 1 — the charting runtime

`components/StrategicAids.tsx` is imported by both `ClientPage` and
`MarkdownViewer`, so it is in the first load on all nineteen routes. It carried
a dead `recharts` import, two dead chart-component imports, and a dead
`export { ChartComponent }` re-export. A re-export is a static import, so that
one line alone put the charting runtime in the shared chunk and defeated the
`next/dynamic` boundary on all eleven chart blocks under `components/markdown`.

`DataVisualizations` and `VoterProjectionsChart` do use recharts, render only
on the landing tab, and already sat inside a `LazyMount` — markup deferred,
code not. Both now load through the same dynamic boundary and `ChartFallback`
the markdown blocks use.

### From the build

| | Before | After |
|---|---|---|
| First Load JS, gzipped | 421 kB | **292 kB** |
| Route size | 319 kB | 189 kB |
| recharts on the first-load path | yes | no |

### Over the wire, mean of 20 routes

| | Before | After | Budget |
|---|---|---|---|
| Transferred | 704 kB | **584 kB** | ≤ 1.5 MB |
| JS | 420 kB | **300 kB** | ≤ 300 KB |
| Fonts | 206 kB | 206 kB | — |
| LCP | 2285 ms | 2319 ms | ≤ 2.5 s |
| FCP | 2142 ms | 2119 ms | — |
| TBT | 2604 ms | 2400 ms | — |
| INP | 1085 ms | 986 ms | ≤ 200 ms |

126 kB of JavaScript per route, on every route. LCP, TBT and INP did not
meaningfully move: the bytes removed were never on the critical path for first
paint, and the work that blocks the main thread is still there.

## Per-route, after pass 1

| Route | Transferred | JS | LCP | INP | CLS | Pass |
|---|---|---|---|---|---|---|
| `/` | 558 kB | 293 kB | 4.01 s | 832 ms | 0.002 | fail: LCP, INP |
| `/approach` | 550 kB | 293 kB | 1.86 s | 848 ms | 0.002 | fail: INP |
| `/assumptions` | 548 kB | 293 kB | 1.78 s | 816 ms | 0.002 | fail: INP |
| `/audiences` | 559 kB | 293 kB | 1.96 s | 768 ms | 0.002 | fail: INP |
| `/cover` | 556 kB | 293 kB | 3.97 s | 800 ms | 0.002 | fail: LCP, INP |
| `/deliverables` | 552 kB | 293 kB | 1.88 s | 896 ms | 0.002 | fail: INP |
| `/governance` | 639 kB | 293 kB | 2.36 s | 840 ms | 0.002 | fail: INP |
| `/measurement` | 565 kB | 293 kB | 2.19 s | 904 ms | 0.002 | fail: INP |
| `/messaging` | 649 kB | 293 kB | 2.54 s | 816 ms | 0.002 | fail: LCP, INP |
| `/nextsteps` | 546 kB | 293 kB | 1.68 s | 840 ms | 0.002 | fail: INP |
| `/objectives` | 545 kB | 293 kB | 1.66 s | 832 ms | 0.002 | fail: INP |
| `/risk` | 594 kB | 293 kB | 2.22 s | 816 ms | 0.002 | fail: INP |
| `/roadmap` | 557 kB | 293 kB | 2.31 s | 824 ms | 0.002 | fail: INP |
| `/scope-data` | 577 kB | 293 kB | 2.33 s | 904 ms | 0.002 | fail: INP |
| `/scope-ground` | 576 kB | 293 kB | 2.57 s | 848 ms | 0.002 | fail: LCP, INP |
| `/scope-media` | 561 kB | 293 kB | 1.98 s | 952 ms | 0.002 | fail: INP |
| `/scope-platforms` | 644 kB | 293 kB | 2.35 s | 808 ms | 0.002 | fail: INP |
| `/situation` | 796 kB | 429 kB | 3.14 s | 3712 ms | 0.000 | fail: JS, LCP, INP |
| `/structure` | 551 kB | 293 kB | 1.83 s | 864 ms | 0.002 | fail: INP |
| `/summary` | 550 kB | 293 kB | 1.75 s | 792 ms | 0.002 | fail: INP |

Failing routes: transferred 0/20 · JS 1/20 · LCP 5/20 · CLS 0/20 · **INP 20/20**.

`/situation` is the one route still over the JS budget, and correctly so — it
has charts, so it loads the chart runtime. That is the boundary working.

### LCP on `/` is bimodal, not regressed

Five consecutive runs of `/` on the same build: 4084, 3912, 1900, 1920,
4016 ms. Bytes were stable across all five (556–558 kB). Two clusters two
seconds apart means the LCP element itself is changing between runs, not that
the page got slower. The before/after difference on `/` and `/cover` is inside
that spread and should not be read as a regression. It does mean **`/` has an
unstable LCP element**, which is its own finding.

Route-level LCP differences under roughly 500 ms in the table above are not
meaningful at one run per route.

## What is left, in order of size

**INP, 768–3712 ms against a 200 ms budget, on every route.** The largest
failure in the document by a wide margin, and untouched by pass 1. One tap on
the index opener costs the reader most of a second. On `/situation` it costs
3.7 seconds. That route's tap also grows the document from 1,035,161 to
1,488,292 characters — the index renders all 241 sections into the DOM on open.

**Fonts, 206 kB on every route, unchanged.** Four faces preloaded:

| Face | Size | File |
|---|---|---|
| Newsreader italic | 64.5 kB | `4b9bb515ce6d026f-s.p.woff2` |
| Newsreader normal | 58.2 kB | `5611c55482296524-s.p.woff2` |
| JetBrains Mono | 40.5 kB | `bb3ef058b751a6ad-s.p.woff2` |
| Montserrat | 35.5 kB | `904be59b21bd51cb-s.p.woff2` |

The largest single file on the critical path is the **italic** cut of the
serif, preloaded on all twenty routes for emphasis text that is never the LCP
element. The brief specifies one variable family; there are three. Reducing
that is a typographic decision, not a mechanical one, so it is recorded rather
than taken.

**TBT, mean 2400 ms.** 4× CPU, so divide by four for an unthrottled desktop —
but the reader is on a phone, which is what 4× is standing in for.

## Not done

No fix for INP, fonts or the unstable LCP element. `/perf` takes one fix per
turn and re-measures; this is pass 1 of several. No `Save-Data` or
`prefers-reduced-motion` path was measured, because there is no Tier 2 import
to skip yet.
