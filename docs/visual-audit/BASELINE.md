# Baseline — before the visual compaction

Measured 18 September 2026 on commit `bc1dc9e` ("Stop the risk quadrant hiding half its risks", PR #11),
branch `claude/code-visual-audit-prompt-gh8n7r`, against a local production build (`npm run build`
then `next start`). Every figure below is reproducible with the scripts named at the end.

This file is the "before" column of `REPORT.md`. Nothing here is a judgement; it is the measurement.

---

## 1. Repository map

| What | Where |
|---|---|
| Chapter Markdown | `public/content/*.md` — 30 files, one per chapter |
| Chapter → file map | `lib/content-files.ts` |
| Route | `app/[[...slug]]/page.tsx` — optional catch-all; `/` is the streamed flow, `/full` the whole document, `/<slug>` one chapter |
| Markdown renderer | `components/MarkdownViewer.tsx` (646 lines) — **`"use client"`** |
| Page shell / hero | `components/ClientPage.tsx` (490 lines) |
| Hero counter cards | `components/Dashboard.tsx` → `CountUpText` |
| Hero fact grid | `components/KeyFactsStrip.tsx` |
| Table wrapper | `components/markdown/InteractiveTable.tsx` (538 lines) |
| Auto figure system | `components/partviz/PartVisual.tsx` + `kinds.tsx`, specs in `data/section-visuals.generated.json`, generator `scripts/build-section-visuals.mjs`, overrides `scripts/section-visual-overrides.json` |
| Bespoke figures | `components/charts/*` (17), `components/markdown/*` (60+), `components/phone/*`, `components/terminal/*` |
| Heading-anchored figure map | `HEADING_INSERTS` in `components/MarkdownViewer.tsx` |
| Counters / motion primitives | `components/visual/` — `Numerals.tsx` (`CountUp`, `Odometer`, `ProgressRing`), `AnimatedNumber.tsx`, `SplitText.tsx`, `Reveal.tsx`, `Surfaces.tsx`, `AmbientField.tsx` |
| `fx-*` micro-effects | `app/visual-fx.css` (65 KB), `app/globals.css` (67 KB), `app/part-visuals.css` (29 KB), `app/flow.css` (12 KB) |
| Typed data already in repo | `data/` — `ward-register.ts`, `county-profile.ts`, `nomination-contest.ts`, `electoral-history.ts`, `fiscal-audit.ts`, `kpis.ts`, `sources.ts`, `tier-matrix.ts`, `benchmarks.ts` and 12 more |
| Analysis exports | `data/analysis/*.json` mirrored to `public/content/analysis/*.json` |
| Build-time guards | `scripts/verify-*.mjs`, run by `npm run verify` |

`@google/genai` is **not** a dependency — it was already removed from `package.json`. Nothing from the
AI Studio template reaches any bundle. Confirmed: no third-party host is contacted by any route (see §5).

---

## 2. Build output

```
Route (app)                                 Size  First Load JS
┌ ○ /_not-found                            124 B         103 kB
└ ● /[[...slug]]                          352 kB         458 kB
+ First Load JS shared by all             103 kB
  ├ chunks/255-9e5c9994c6807ca2.js       46.1 kB
  ├ chunks/4bd1b696-409494caf8c83275.js  54.2 kB
  └ other shared chunks (total)          2.29 kB
```

**First-load JS for every content route: 458 kB.** That is the number Phase 7 must not exceed.

Cause, for the record: `MarkdownViewer` is a client component, so `react-markdown`, `remark-gfm`,
`rehype-raw` and their unified/mdast/hast dependency trees are in the client bundle, together with
103 of the repo's 125 components — which is nearly all of them.

Prerendered HTML on disk:

| File | Bytes |
|---|---|
| `.next/server/app/index.html` (`/`) | 276,466 |
| `.next/server/app/full.html` (`/full`) | 3,486,924 |

---

## 3. Page metrics

Production server, Chromium, `networkidle`.

| Route | Viewport | Scroll height | Requests | Transferred | DOM nodes | Sideways scroll |
|---|---|---|---|---|---|---|
| `/` | 390 × 844 | **467,728 px** | 17 | 749,405 B | 2,622 | no |
| `/` | 1440 × 900 | **466,014 px** | 17 | 751,286 B | 2,649 | no |
| `/full` | 390 × 844 | **467,728 px** | 28 | 1,466,449 B | 28,241 | no |
| `/full` | 1440 × 900 | **466,014 px** | 28 | 1,468,330 B | 26,681 | no |

Transferred is `encodedDataLength` off the wire — what the reader on mobile data pays for, after
compression. Two consecutive runs of the measurement script agree byte-for-byte on all four rows.

`/` and `/full` report the same height because `/`'s unstreamed sections reserve their measured
height through `containIntrinsicSize` (`lib/section-heights.ts`). The page is ~468,000 px tall on a
phone: about **554 screens** at 844 px.

### Core Web Vitals — mid-range Android profile

CPU throttled 4×, network 1.6 Mbps / 150 ms RTT (slow 4G), 390 × 844 @2×.

| Route | FCP | **LCP** | **CLS** | Load |
|---|---|---|---|---|
| `/` | 2,064 ms | **5,204 ms** | **0** | 9,174 ms |
| `/full` | 2,012 ms | **2,012 ms** | **0** | 20,592 ms |

LCP on `/` is **5.2 s against a 2.5 s budget** — the hero portrait plus 458 kB of JS. CLS is already
clean and must stay that way. INP was not measured directly; TBT is dominated by the same bundle.

---

## 4. Content census

Counted from `public/content/*.md` (source), and from the rendered DOM.

- **Words in source: 63,433** across 30 chapters. The hero's "289 minutes" is this figure.
- Words in the `/full` DOM: **71,291** at 390 px — 1.12× the source. The overhead is figure labels,
  chapter chrome, table headers and the visually hidden duplicates in §6.2.
- Of those, **2,836 words are in the document twice** — inside `.sr-only` or `aria-hidden` nodes.
  That is the duplication §6.2 describes, measured.
- Words rendered visibly at first paint on `/`: **1,462** at 390 px, 1,586 at 1440 px. (Measured by
  `innerText`, which excludes subtrees skipped by `content-visibility: auto` — this is a measure of
  what the browser has laid out, not of a reading mode. There is no reading mode yet.)

> **Correction.** The first version of this file reported 124,284 DOM words for `/full` — 1.96× the
> source — and attributed "a large share" of the gap to duplicated text nodes. Both were wrong, and
> for the same reason: the count came from `document.body.textContent`, which includes the contents
> of every `<script>`. A React Server Components page carries its entire flight payload inline in
> script tags, so roughly 53,000 "words" of serialised JSON were being counted as document text.
> `scripts/measure-visual-baseline.mjs` now walks text nodes and skips `script`, `style`,
> `template` and `noscript`. The duplication in §6.2 is real, and it is 2,836 words, not 60,000.

| Chapter | Words | | Chapter | Words |
|---|---|---|---|---|
| decision | 1,067 | | measurement | 3,448 |
| cover | 624 | | governance | 3,063 |
| presence | 1,930 | | risk | 2,614 |
| summary | 1,299 | | structure | 1,658 |
| situation | 4,421 | | assumptions | 1,478 |
| arithmetic | 4,687 | | nextsteps | 552 |
| reach | 2,439 | | annex-evidence | 791 |
| objectives | 962 | | annex-county | 601 |
| audiences | 2,816 | | annex-messages | 1,780 |
| approach | 1,666 | | annex-cadence | 428 |
| engine | 1,019 | | annex-runbooks | 2,373 |
| messaging | 3,107 | | scope | 1,100 |
| scope-platforms | 4,072 | | scope-media | 2,194 |
| scope-ground | 3,711 | | scope-data | 3,974 |
| roadmap | 2,062 | | deliverables | 1,497 |

### Blocks

| Thing | Count |
|---|---|
| Fenced code blocks | **70** |
| …of which contain box-drawing characters (`┌ │ └ ═ ▼ █ ─ ┐ ┘ ├ ┤ …`) | **67** |
| Markdown tables | **74** (546 body rows) |
| Headings (`##`/`###`/`####`) | **342** (85 / 188 / 61, plus 1 `#` and 8 `#####`) |
| `pv-slot` auto-figure specs in `data/section-visuals.generated.json` | **272** |

Target for Phase 5: **0** ASCII blocks remaining.

`pv-slot` specs by kind — this is the shape of the "a figure under every heading" problem:

| Kind | Count | | Kind | Count |
|---|---|---|---|---|
| statement | **51** | | timeline | 13 |
| table | **37** | | hub | **11** |
| stats | **31** | | donut | 9 |
| stepper | 30 | | shape | **8** |
| chapter | **23** | | gauge | 7 |
| bars | 18 | | quote | **6** |
| checklist | 14 | | bullet | 5 |
| contrast | 4 | | playbook | 2 |
| waffle | 2 | | quadrant | 1 |

`statement` (51), `chapter` (23), `hub` (11), `quote` (6) and `shape` (8) — **99 of 272** — carry no
measurement at all. They restate a heading, draw abstract art, or re-typeset a sentence already on
the page. Those are the first candidates for removal under Phase 2 item 5.

---

## 5. Confidentiality and third parties

- `robots` meta is `noindex, nofollow` — intact (`app/layout.tsx`).
- **Zero third-party hosts** are contacted on `/` or `/full`. Fonts are self-hosted by `next/font`.
  No analytics, no tile server, no runtime fetch. This must stay true.
- `og:image` is **absent** while `twitter:card` is `summary_large_image` — the WhatsApp/Twitter
  preview is text only. (Phase 2 item 7.)

---

## 6. Confirmed P0 defects, with evidence

### 6.1 Hero counters render zeros before hydration

The `/` page with JavaScript disabled, read out of the DOM verbatim:

```
Where the campaign stands today
KSh13.79bn
KSh0.00bn          <- the visible layer
FY2026/27 Kitui resource
Own-source revenue: KSh1.339bn
86.4%
0.0%               <- the visible layer
Offline pop (KNBS 2019)
≈200k
≈0k                <- the visible layer
2022 winning-vote
```

`components/visual/Numerals.tsx` → `CountUp` seeds its visible span from `useState(0)` and only
leaves zero once the IntersectionObserver fires after hydration. On a slow phone, `KSh0.00bn` is
what the reader sees. Grep of the built HTML confirms `KSh0.00bn`, `>0.0%<` and `≈0k` are literally
in the server response.

The 390 px screenshot (`screenshots/before/root-390.png`) caught the count mid-flight displaying
**`KSh13.49bn`** and **`84.5%`** — neither of which is a figure in this document. A figure that is
wrong for 1.6 seconds on every load is wrong.

### 6.2 Duplicate text nodes

Same no-JS dump: the headline appears **twice** —

```
Kitui 2027: the intelligence behind what you already publish.
Kitui 2027:
the intelligence behind what you already publish.
```

`components/visual/SplitText.tsx` renders an `sr-only` copy plus an `aria-hidden` split copy.
`aria-hidden` removes a node from the accessibility tree; it does **not** remove it from
`textContent`, from reader mode, from find-in-page, or from copy-paste.

`components/visual/AnimatedNumber.tsx` is worse — it renders each figure **three times**
(`sr-only` + `anim-num__size` sizer + `anim-num__value`), which is the source of the
`15.315.315.3`, `532,758532,758532,758` and `330,310330,310330,310` strings. `Odometer`,
`Typewriter` and `Scramble` in the same folder share the pattern.

Measured: **2,836 words** of the `/full` DOM are inside `.sr-only` or `aria-hidden` nodes — text
that is in the document twice. (An earlier draft of this file put the figure far higher; see the
correction in §4.)

### 6.3 DataTable auto-stats are wrong

`InteractiveTable.tsx` lines 224–256 compute `avg` / `max` / `sum` over any column that passes a
purely syntactic "is this a bare figure" test, and render them as **Avg / Max Peak / Combined**
under every qualifying table. The test says nothing about whether the column is *addable*. Live
results include:

- **"Combined 68.7%"** — Kasalu's two poll shares summed. (Present in the built HTML.)
- "Combined 68.5%" — Mulu's three poll shares summed.
- "Avg WS 7 / Max Peak 14 / Combined 106" — workstream *identifiers* averaged.
- "Combined 447,940 / 511,590 / 832,002" — zone tables counting their own Total row a second time.

Poll shares from different rounds are not addable; nor are row identifiers; nor is a column that
already contains its own total.

### 6.4 Automatic Chart toggle

The same `numericColumnIndex` gates a Chart button on every table where one column parses as
figures — including categorical tables and tables containing a Total row, which then plots as a bar
twice the height of everything else.

### 6.5 3D "four stages" figure

`components/HeroVisual.tsx` (663 lines, client, `motion` + tilt). Its `digital` stage is labelled
**"200,198 registered voters — the Mwingi bloc"** while §3.6 argues the Mwingi bloc is reached
**offline**. Logged as **C-15**.

### 6.6 Denied effects currently in the hero

`Dashboard.tsx` renders the three counters inside `TiltCard` (3D tilt), `SpotlightCard`
(cursor spotlight) and `fx-mesh` (mesh-gradient background) — all three on the Phase 6 deny list —
and the cards are a clipping horizontal rail on a phone (`root-390.png` shows
"Offline pop (KN…" and "13.6% active internet…" cut off).

---

## 7. Screenshots

`docs/visual-audit/screenshots/before/` — `/`, §0 decision, §2 summary, §3A situation,
§3B arithmetic, §3C reach, each at 390 × 844 and 1440 × 900. Viewport-sized, not full-page: a
full-page capture of a 468,000 px document is neither producible nor readable.

---

## 8. How to reproduce

```bash
npm ci && npm run build            # build output, table above
npx next start -p 3210             # then, with Playwright available:
node scripts/measure-visual-baseline.mjs
```

`scripts/measure-visual-baseline.mjs` is committed alongside this file and prints every number in
§3, §4 and §6.1 as JSON.
