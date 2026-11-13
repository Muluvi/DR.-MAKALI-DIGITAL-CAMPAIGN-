# Claude Code brief: turn the Makali proposal from a document into a website

Repository: `Muluvi/DR.-MAKALI-DIGITAL-CAMPAIGN-` (trailing hyphen). Live site: https://dr-makali-digital-campaign.vercel.app/ (Vercel project `dr-makali-digital-campaign`, production deployment `dpl_6Hrupsas8mjfw4tS7AWfTammsbQV` at commit `4bfc078`, the merge of PR #33).

Owner: Firefly (Brian Muluvi). Write in British English. Read this whole brief before acting.

**Revision 2 (28 Oct 2026, owner's instruction): the site has one version. Remove Brief and Full.** There is no reading-mode toggle after this work. Readers see one site: the decluttered view described here. Section 5.0 says what to remove and what replaces it.

Companion files: **`makali-declutter-plan.json`** (the plan as data), **`measure-text-load.mjs`** (the measurement script) and **`metrics-baseline.json`** (today's measurements). Copy it to `docs/declutter/plan.json` in the repo first. It holds the section-by-section plan in section 9 as data (190 sections), plus a block-level worklist of 839 flagged blocks. Section 9 and the JSON say the same thing; if they disagree, section 9 wins and you log the difference.

---

## 0. Mandate and how to run

**The problem.** The site reads like a 290-minute document. At phone width (390 × 844) it is **607 screens long in Full mode and 371 in Brief mode**. Readers arrive from a WhatsApp link, on a phone. The owner's instruction: *"This is a website and not a document. Identify all text that can be summarised, that can be displayed using visual tools, etc."*

**What you do.** Remove the Brief/Full reading mode (section 5.0), carry out the plan in section 9 end to end on a branch, verify, open a PR, check the Vercel preview, merge, and check production. Follow the owner's standing instruction from the last restructure: **do not stop for approval.** Stop only under section 11 (hard stops).

**What "done" means.** The targets in section 3 are met, every check in section 10 passes, and no fact, figure, source, tier label or hedge has been lost or strengthened.

---

## 1. What the analysis found

Measured on a production build of `4bfc078` (the commit live today), with `measure-text-load.mjs`. **That script and its output are not in the repository: they are attached with this brief** as `measure-text-load.mjs` and `metrics-baseline.json`. Commit them in Stage 1 to `scripts/measure-text-load.mjs` and `docs/declutter/metrics-baseline.json`.

| | Brief mode | Full mode |
|---|---:|---:|
| Phone screens, all 19 tabs | **371** | **607** |
| Rendered words | 62,218 | 77,724 |
| …of which inside figures | 25,541 | 25,405 |
| Paragraphs over 60 words | 82 | 82 |
| Raw `[CONFLICT Cn]` markers visible to readers | 19 | 27 |
| Raw "(Tier N …)" parentheticals visible | 161 | 169 |

The worst tabs: Evidence (99 / 130 screens), Strategy (54 / 92), Decision (32 / 53), Measurement (28 / 49).

Source markdown (`content/*.md`) is 42,664 words in 1,267 blocks: paragraphs 16,781 words, bullet and numbered lists 15,009, tables 5,937, callouts 3,097, text versions 1,656. **Lists carry almost as much text as prose**, and most of them are repeated-field records that belong in cards, tables or tabs.

Nine findings drive the plan:

1. **The text and the visual both render.** 92 figures and 39 mounted components already show most of the numbers, but the bullet lists that restate them are still printed underneath (for example 1.2, 1.5.1, 2.1, 2.2, 2.7.1, 2.8.1, 2.8.2, 2.11, 3.3.1, 3.3.2). In about 46 blocks (around 7,000 words) a numeric list sits in a section that already has a figure or component.
2. **The 34 derived heading visuals duplicate their own prose.** `scripts/build-section-visuals.mjs` draws 24 steppers, 9 checklists and 1 timeline from a section's bullets, and leaves the bullets in place. Some kinds are also wrong for the content: the rival list in 2.6.1 is drawn as a "stepper", for instance.
3. **Records with repeated fields are written out as prose.** These include the 5 objectives (7 fields each), the 3 service levels, the 6 voter segments (7 fields, about 1,500 words: the largest block on the site), the 4 production pillars (5 fields), the 5 offline channels (3 fields), the 4 distribution networks, and the candidates.
4. **The same fact is stated many times.** The nomination window appears in 1.1 (three times), 1.2, 1.8, 2.5.1 and 4.2.1. "Firefly publishes nothing on his accounts" appears in at least seven places. His record (PhD, Budget Committee, M&E Champion, best-evaluated constituency, KSh 47m bursaries) appears in 1.1, 1.3.2, 2.6.1, 2.10.1, 3.1, 3.1.1, 3.2.3 and 4.5.1. The term limit appears three times in 2.6, and the digital ceiling in 1.3.3, 1.4.2, 2.9.3 (twice), 3.3.2 (twice) and 4.5.9. The repo's duplicate finder (`scripts/find-duplicates.mjs`) reports 0 repeats because it only catches near-verbatim paragraphs; these are the same fact reworded.
5. **The pillar systems are confusing.** Readers meet 4 campaign pillars, 3 message pillars, 4 production pillars (P1–P4), 4 content buckets (A–D) and 6 themes: 21 items, plus several paragraphs explaining that they are different things.
6. **Signposts and meta-text.** There are 41 blocks such as "What this section adds is…", "Section 4.5 sets each workstream out in full…" and "This section constructs…". Every tab also opens with a paragraph that repeats its navigation blurb.
7. **Inflated register.** Phrases such as "absolute mathematical certainty", "strictly", "forensic analysis", "turns standard political promotion on its head", "industrial pipeline", "air-conditioned command center" and "unassailable" undercut a proposal whose pitch is rigour.
8. **Internal working marks reach readers.** `[CONFLICT Cn: see open items]` (27 visible), `[CHECK REF]` (12 in source), `[VERIFY …]`, `[Confirm approach with campaign counsel …]` and research status notes ("awaiting primary documents") all print as plain text.
9. **Figures carry too much text.** Figure text is about a third of all rendered words. The 15 wordiest figures each exceed 380 words; `fig-5-2-4-stack` is 934 and `fig-cover-map` 728.

---

## 2. The rule that changes, and the rules that do not

`lib/reading-mode.tsx` records the old rule: *"Brief does not shorten the document … Nothing is deleted, nothing is summarised."* **The owner has now asked for summarising, and for one version of the site.** A section may show a summary and a visual in place of its prose, and duplicated text may be deleted. `lib/reading-mode.tsx` is removed (section 5.0); record the old rule and why it changed in `docs/declutter/DECISIONS.md`, citing this brief.

What still holds, without exception:

1. **No fact is lost.** Everything a summary or visual replaces stays reachable: in the section's "Read the full text" disclosure, in a card or row disclosure, in the figure's "View the data", or in print. The one exception is a *verified duplicate*: text whose every fact is already stated at its canonical home (section 6). That text is deleted and logged.
2. **Summaries are extractive.** A summary (a `lead`, see 5.1) is built from the passage's own sentences and clauses. Clauses may be dropped and sentences shortened. **You may not add an adjective or intensifier, merge facts from two sections, change a number, introduce a figure that is not a `{{token}}` already in the passage, or strengthen a claim.**
3. **Hedges survive.** If the sentence a summary draws on contains any of the following, the summary keeps it, attached to the same claim: *reported, not confirmed, unconfirmed, hypothesis, working hypothesis, modelled, derived, estimate, CALC, not a forecast, to be cited, to be confirmed, pending, awaiting, Tier 2, Tier 3, not yet tiered, media report, single-source*. This is checked by a script (section 10, check 7).
4. **Numbers stay tokens.** Every number in new markdown, including inside `visual` fences, uses the existing `{{token}}` system (`lib/data/figures.ts`, resolved by `scripts/build-content.ts`, which also resolves tokens inside fences). `scripts/check-copy.ts` must keep passing (it rejects bare three-digit literals). Do not add figures to `lib/data/figures.ts` unless a number already in the prose has no token; in that case add a token with the source and tier the prose states, and log it.
5. **Tiers and sources survive.** Every tier label still reaches the reader, as a badge (X1) where it used to be a parenthetical.
6. **Conflicts C1–C8 stay unresolved.** Both versions stay. Only how the marker looks changes (X2).
7. **Commitments are not summarised.** The Digital Ethics and Data Charter wording (5.3.3), the terms of use (F.1), the compliance gate rule (5.3.4), the "not a legal opinion" statements and the Boundary statement in 3.5.2 keep their full text visible on the page, not behind a disclosure. A clause-title list may sit above them as navigation.
8. **Deep links still land.** Every existing section id keeps resolving (the anchor build already fails otherwise). A deep link to a section, or to anything inside a closed disclosure, opens that disclosure and scrolls to the target (this replaces the old rule that a deep link switched the whole document to Full).

---

## 3. Targets

Measured with `scripts/measure-text-load.mjs` at 390 × 844 on a production build, before and after.

| Measure | Now | Target |
|---|---:|---:|
| Phone screens, all tabs (one version) | 371 (Brief, the default) · 607 (Full) | **≤ 170** |
| Rendered words visible on load | 62,218 (Brief) · 77,724 (Full) | **≤ 26,000** |
| Visible running prose (source words, plan total) | 42,664 | **≈ 9,600** (section 9) |
| Paragraphs over 60 words visible on load | 82 | **0** |
| Raw `[CONFLICT`, `CHECK REF`, `[VERIFY`, `(Tier N` strings in reader-visible text | 27 + 12 + 169 | **0** (all become components) |
| Words visible in a figure before its disclosure | up to 934 | **≤ 80 per figure** |
| Reading-mode controls, code paths, localStorage reads | 3 controls, 11 files | **0** |
| Lighthouse accessibility (mobile) | 100 (last report) | **stays 100** |
| First Load JS, shared | 103 kB | **≤ 110 kB** (no new chart library; removing the mode code should shrink it) |

"Visible on load" means text not inside a closed disclosure. Closed disclosures use `hidden="until-found"` (5.0), so `innerText` does not count them and browser find-in-page still reaches them.

Per-tab targets (visible running prose, source words) are in section 9. A tab may miss its own number by 15% provided the total holds.

---

## 4. Treatment codes

Every section in section 9 carries one or more of these codes.

| Code | Meaning | What you do |
|---|---|---|
| **CUT** | Signpost, meta-text, inflated framing or verified duplicate | Delete. For a duplicate, first confirm every fact is at the canonical home (section 6); if one is not, move it there. Log each cut in `docs/declutter/CUTS.md` (file, section, first 12 words, word count, canonical home). |
| **SUM** | Long prose | Add a `lead` (5.1) of at most two sentences drawn from the passage. The original moves into a "Read the full text" disclosure under the lead and visuals. |
| **REUSE** | An existing figure or component already shows this | Check every number in the prose against the component's data source (the figure series in `lib/figures`, `lib/register/specs`, `data/*.ts`). If all are there, delete the prose (log it as a CUT). If some are missing, add them to the component's note or data, then delete. |
| **STAT** | A handful of key numbers | `visual` fence, kind `stats` (StatRail). 3–6 tiles: value token, label of 2–5 words, tier badge, optional one-line caption. |
| **CARDS** | Records with the same fields | `visual` fence, kind `cards`. Each card: title, one or two headline fields visible, the remaining fields in the card's disclosure, text moved verbatim. Swipe row on phone, grid on desktop. |
| **MATRIX** | Criteria across items, or a large table | Keep the table as data. Render it sortable or filterable, with a sensible default sort on phone and long cells in row disclosures. |
| **TABS** | Parallel profiles where the reader wants one at a time | kind `tabs`: one panel per item (segments, zones, phases). Every panel is server-rendered and printed. |
| **TIME** | Dated or phased items | kind `timeline` (TimelineRail). |
| **STEPS** | An ordered process | kind `stepper`. Bold label plus at most 12 words visible; body in the step's disclosure. |
| **WEEK** | A weekly schedule | kind `week`: a Mon–Sun strip or grid. |
| **INOUT** | Scope boundaries | kind `inout`: two-column In / Out checklist. |
| **CHART** | Comparable magnitudes or shares | An existing partviz kind (`bars`, `donut`, `waffle`, `waterfall`, `bullet`) fed by tokens. |
| **HYP** | Hypothesis, evidence for and against, test | kind `hypothesis`: four panels. |
| **QA** | Attack and answer | kind `qa`: two panels. |
| **CROSS** | Several overlapping frameworks | kind `crosswalk`: one matrix showing how they map. No item is renamed or merged. |
| **KEEP** | Already right-sized | Apply the cross-cutting fixes (section 5.4) only. |

---

## 5. How to build it

### 5.0 Remove Brief and Full (do this first, in Stage 2)

The site gets one rendering. Remove:

| Remove | Where |
|---|---|
| The segmented Brief/Full control | `components/ReadingModeToggle.tsx` (delete the file and its uses) |
| The B/F toggle button | `components/flow/FlowChrome.tsx` (around lines 96–111) |
| The Brief/Full switch in the premium chrome | `components/premium/Chrome.tsx` (around line 62) |
| The mode store and provider | `lib/reading-mode.tsx` (delete); `ReadingModeProvider` in `components/ClientPage.tsx` |
| Mode-dependent defaults | `components/markdown/BriefFold.tsx`, `ProseFold.tsx`, `DisclosureGroup.tsx`, `TextVersion.tsx` |
| The "brief" segment kind and splitter | `lib/collapse-groups.ts` (`kind: "brief"`, `splitBrief`) and its handling in `components/MarkdownViewer.tsx` (around line 652) |
| The two reading times on the hero ("Brief: ~N min" against the full time) | `app/[[...slug]]/page.tsx` (around lines 107–161) and the props passed through `components/ClientPage.tsx` |
| Mode-specific CSS | `app/globals.css` (`.focus-reading-mode` and any `[data-mode]` selectors) |
| The stored preference | Stop reading `kitui2027:reading-mode`. Add one line that removes the key on load, wrapped in try/catch, and note it can be deleted after 2026-12-31 |

What replaces it, fixed for every reader:

- **One fold type: "Read the full text (N words)".** Merge `BriefFold` and `ProseFold` into one `ReadMore` component, closed by default. Keep what `BriefFold` does well: content rendered on the server, stays in the DOM, `inert` while closed. Use `hidden="until-found"` (with the `beforematch` event to open it) so find-in-page reaches folded text. Fall back to a CSS collapse where the attribute is unsupported.
- **Text versions** (`textversion` fences): closed by default under their figure, opened on tap. This is the old Brief behaviour, now the only one.
- **Disclosure groups:** an accordion, one open at a time, as Brief had.
- **Long prose in KEEP and REUSE sections** (over 60 words) that this plan does not summarise: show the first paragraph and put the rest in `ReadMore`. This is the old Brief default, now applied once rather than as a mode.
- **Deep links:** open every fold that contains the target, then scroll (5.1 and section 2, rule 8).
- **Print:** every fold, disclosure, tab panel and figure note prints open (`components/PrintSafeDisclosures.tsx`).
- **Reading time:** one figure on the hero, measured from what is visible on load, labelled e.g. "~35 min read".
- Comments that explain Brief/Full elsewhere (e.g. `components/figures/FigureBoundary.tsx`) are updated so no stale mention of the modes remains.

### 5.1 The `lead` fence (summaries)

````markdown
### 2.6.3 The incumbent is term-limited: 2027 is an open seat

```lead
Article 180(7) of the Constitution limits a governor to two terms (Tier 1); Governor Malombe is serving his second, so 2027 is an open seat.
```

(original prose unchanged below)
````

- The `lead` shows, then any visuals, then a closed **"Read the full text (N words)"** disclosure holding the section's original prose. This is the one fold type on the site (5.0).
- Print, a deep link into the section, and find-in-page open the disclosure. The `lead` is hidden in print, because the full text is printed beneath it and the lead is drawn from it.
- Sections without a `lead` show their prose as written (KEEP sections are already short), with no fold.
- Implement this in `components/MarkdownViewer.tsx` next to the existing `textversion` and `figure` fence handling (around lines 409–430), using the same `fenceLanguage()` helper.
- Leads are at most 45 words, plain register, no rhetorical openers.

### 5.2 The `visual` fence (text into visuals)

````markdown
```visual
kind: cards
id: objectives
items:
  - title: Be known where he isn't yet
    head: { label: Target, text: "At least {{pool.share}}% of his reach landing in the pool…" }
    chips: [NW-01, R-02]
    fields:
      - { label: Finding it answers, text: "{{pool.share}}% of the register, {{pool}} voters, lives in…" }
      - { label: Baseline, text: "Set in Week 1, from his own Insights export…" }
```
````

- Parse as YAML. `js-yaml` is in the lockfile only as a transitive dependency, so add it (or `yaml`) to `package.json` as a direct dependency rather than relying on it. `text` values are the original markdown, moved verbatim with tokens intact, and rendered through the same inline markdown renderer.
- **The fence replaces the bullets it was built from.** The words now live in the fence, so nothing is lost. The conservation check (section 10, check 4) counts words inside `visual` fences as present.
- Kinds that map to existing primitives: `stats`, `timeline`, `stepper`, `checklist`, `matrix`, `contrast`, `playbook`, `bars`, `donut`, `waffle`, `waterfall`, `bullet`. Use `components/partviz/kinds.tsx`, which already exports `StatRail`, `BarRank`, `DonutSplit`, `Waffle`, `Waterfall`, `BulletTarget`, `Stepper`, `TimelineRail`, `Playbook`, `MatrixGrid`, `ChecklistGrid`, `ContrastBar` and `GaugeArc`, plus `VizFrame` and `Disclose` from `primitives.tsx`.
- New kinds to build, in the same file and style: `cards`, `tabs`, `week`, `inout`, `hypothesis`, `qa`, `crosswalk`, `nested` (nested sets). Keep them server components where possible. Interactivity (tabs, sort, filter) is a small client island; with JavaScript off, every panel shows stacked.
- Every visual meets the FigureFrame contract (`components/figures/FigureFrame.tsx`): it states its finding, shows source, tier and date where it carries numbers, and offers its data or text in a disclosure that is open in print.
- A section with a `visual` fence gets **no** derived heading visual. Make `scripts/build-section-visuals.mjs` skip it.
- Specialised components named in section 9 (ObjectiveCard, CandidateCard, SegmentTabs, ProofCard and so on) are **`visual` kinds with a preset**, not new bespoke components. Use one generic `cards` and one generic `tabs` with a `preset` field only where layout differs.
- Accessibility: headings inside cards and tabs keep the document outline; tabs use the ARIA tabs pattern; colour is never the only signal; touch targets are at least 44 px; reduced motion is respected.
- Palette and type: use the existing tokens in `app/globals.css` and `tailwind.config.*`. No new colours.

### 5.3 The 34 derived heading visuals

For every id in `data/section-visuals.generated.json` (listed in the JSON, `derivedVisualToResolve: true`), do one of the following:

- **(a)** the section gets a `visual` fence under this plan, so the derived visual is skipped automatically; or
- **(b)** the derived visual carries the content and the bullets it was drawn from are deleted. Allowed only if the derived kind is right for the content: a stepper for an ordered process, a checklist for a commitment set; or
- **(c)** set it to `{"kind": "none", "note": "…"}` in `scripts/section-visual-overrides.json`, with the reason.

Never leave both a derived visual and its source bullets.

### 5.4 Cross-cutting fixes (apply on every tab)

| # | Fix |
|---|---|
| **X1** | **Tier parentheticals become badges.** Replace "(Tier 1)", "(Tier 2, a media report …)", "(Tier 3; Section 2.5.2 …)" with the existing `TierBadge` (`components/markdown/TierBadge.tsx`). The badge opens, on tap, to the parenthetical's remaining words (source, caveat) and to the tier legend in A.1.2. Implement it as a renderer transform over a fixed pattern list, with a test listing every pattern found; do not hand-edit 196 places. Where the number is a token, `{{id|tier}}` gives the tier from the data; if it disagrees with the typed parenthetical, **do not pick**: log it in `docs/declutter/TIER-MISMATCHES.md` and render the typed one. |
| **X2** | **Conflict markers become a chip.** `[CONFLICT Cn: see open items]` renders as `UnderReview` (`components/figures/UnderReview.tsx`) with the reader text "Two versions in this document — under review" linking to the open-items list. The source text is unchanged. |
| **X3** | **`[CHECK REF]` is hidden from readers.** It renders nothing in production builds and a dashed outline in development (`NODE_ENV !== "production"`). Source unchanged; still listed in `docs/restructure-2026-10/OPEN-ITEMS.md`. |
| **X4** | **Internal notes become a status chip.** `[VERIFY …]`, `` `[Confirm approach with campaign counsel …]` `` and the "awaiting primary documents / page reference" sub-bullets in 3.2.2 render as a small "Source pending" or "Counsel review" chip, with the note in its disclosure. |
| **X5** | **Workstream group banners become a chip.** The "Group: … Four workstreams that …" sentence is repeated in all 14 workstream banners. Render it as a group chip; the sentence shows once, in 4.5. |
| **X6** | **Cross-references become link chips.** "(Section 2.5.2)" becomes a compact "§2.5.2" link chip. Use the existing `CrossRef` component if it fits. Apply only to parenthesised references; references inside a sentence ("Section 4.6.6 sets out how…") stay as text. |
| **X7** | **The nomination window says it once.** Every restatement of "settled by a party-run countywide selection in the final quarter of 2026 (reported, Tier 3)" outside its home (2.5) becomes a `WindowChip`: "Wiper decision: late Oct–Nov 2026 · reported · Tier 3 · §2.5". |
| **X8** | **Say-once facts** (section 6): the restatement becomes one short reference plus a link to the canonical home. |
| **X9** | **Tab intro paragraphs** that repeat the navigation blurb (`SECTIONS[].blurb` in `lib/heading-slug.ts`) are deleted. Check the blurb carries the same content first. |
| **X10** | **Plain register.** Delete the intensifiers and rhetorical framing listed in section 1, finding 7, wherever they stand in a sentence you otherwise keep. Deleting is allowed; substituting is not. Log each one. |

---

## 6. Say once: canonical homes

Each fact is stated in full at its home. Everywhere else it becomes a one-line reference with a link, or a chip.

| Fact | Home | Restated in (cut to reference) |
|---|---|---|
| Nomination window: Q4 2026, reported, Tier 3 | 2.5.1 / 2.5.2 | 1.1 (×3), 1.2, 1.8 no. 2, 4.2.1 |
| Firefly publishes nothing on his accounts and holds no credentials; operates only WhatsApp API and USSD | 1.4.1 | 1.1 (×2), 1.4.3, 4.1.1, 4.1.2, 4.5.2 banner, 4.5.9 banner |
| Workstream ownership split | 1.4.2 (`fig-5-1-workstreams`) | 1.4 intro, 1.6 (keep [C3] at both) |
| Level 2 recommendation and why | 1.5.2 | 1.4.2, 1.5.1 Level 1 trade-offs |
| His record: PhD, Budget and Appropriations Committee, M&E Champion, ESK, best-evaluated FY2014/15, KSh 47m bursaries, CBS | 2.10.1 | 1.1, 1.3.2, 2.6.1, 3.1, 3.1.1, 3.2.3 P1, 4.5.1 "Why it exists" |
| Recognition hypothesis and its test | 2.12 | 1.1, 1.2, 2.7.1, 3.3.1, 4.2.1, 5.2.6 |
| Connectivity: internet %, offline %, phone %, agents | 2.9.1 | 2.9.3, 3.4.2, 4.5.9, 5.1.3, 4.5.4 |
| Digital ceiling: reach.smartphone short of benchmark | 2.9.3 | 1.3.3, 1.4.2, 3.3.2 (×2), 4.5.9 |
| Term limit, open seat | 2.6.3 | 2.6.1 last bullet, 2.6.2 last bullet |
| Radio listenership shares (CA/KARF, Lower Eastern) | 2.9.2 | 2.9.4, 3.3.2 table ([C7] at all) |
| Station ownership and posture | 4.5.6 | 2.9.2 bullets, 2.9.4 |
| Bulk political SMS: English or Kiswahili only, 48-hour lodging | 4.5.9 | 1.5.3 row, 2.9.4, 3.4.2, 3.6.1 |
| County audit findings (unconfirmed cash, IFMIS variance, pending bills) | B.2 / 3.1.2 chart | 3.1.3, 3.2.3 P3, 1.1 |
| Register 2022, 2026, benchmark, turnout | 2.1 (one StatRail) | the second list in 2.1 |
| Weekly operating rhythm | 4.1.1 WeekStrip | D.1, 4.5.2 weekly cycle |

Before cutting a restatement, diff its facts against the home. **If the restatement carries a detail the home lacks, move that detail to the home first.**

---

## 7. Figure slimming

For every figure over 80 words (92 of the 105 figures rendered today; the 15 wordiest are listed below):

- **Visible by default:** the headline (the finding), the chart, a takeaway of at most one sentence, and the source line with tier and date.
- **Into the "Method and notes" disclosure** (closed by default, open in print): per-point notes, methodology, caveats, long legends and secondary tables.
- The FigureFrame contract stays: "View the data" stays, and conflicts and modelled points stay flagged.
- Edit text fields only (`note`, `takeaway`, `question`, legend labels in `lib/register/specs/*`, `lib/figures/*`). **Never edit a value, source, tier, date or kind.** Run `npm run test:figures` and `node scripts/verify-figures.mjs` after each spec file.

| Figure | Tab | Words now |
|---|---|---:|
| fig-5-2-4-stack | annex-spec | 934 |
| fig-cover-map | cover | 728 |
| fig-5-6-kpis | measurement | 698 |
| fig-3-2-register-map | evidence | 657 |
| "Four attack lines, four answers…" | annex-runbooks | 627 |
| fig-3-4-footprint | evidence | 562 |
| fig-3-6-party-flow | evidence | 530 |
| fig-5-8-risk | risks | 519 |
| fig-3-7-zones | evidence | 497 |
| fig-3-3-paths | evidence | 487 |
| fig-4-2-effort | strategy | 471 |
| fig-6-1-dependencies | decision | 403 |
| "Six segments, six messages…" | annex-messages | 388 |
| fig-4-8-decision-rules | strategy | 387 |
| fig-5-4-ladder | delivery | 381 |

The full list is in `docs/declutter/metrics-baseline.json`, field `figures`.

---

## 8. Stages

Branch: `declutter/website-2026-10`. One commit per stage, message `declutter: <stage>`, ending with the attribution lines the harness gives. Run `npm run verify` and `npm run build` after every stage, and fix failures before moving on.

1. **Baseline.** Add the attached `measure-text-load.mjs` as `scripts/measure-text-load.mjs` and the attached `metrics-baseline.json` as `docs/declutter/metrics-baseline.json`, then commit them. Rebuild, re-measure (`node scripts/measure-text-load.mjs http://localhost:3100 baseline`) and confirm the numbers in section 1 within ±2%. After Stage 2 the site has one mode: run the script with `--single` (it then measures once, labelled `site`, and also counts the words inside closed folds separately as `foldedWords`). Compare `site` against the baseline's Brief rows. Copy `plan.json`. Write `docs/declutter/README.md` (what this is, how to re-measure).
2. **One version, and the mechanisms.** First remove Brief/Full (5.0) and confirm the build, deep links and print. Then add the `lead` fence; `visual` fence with the existing kinds and the new kinds; build-section-visuals skip; the X1–X6 renderer transforms with tests. No content changes yet. Add one fixture page or test that renders every kind.
3. **Cross-cutting content fixes.** X7–X10 across all tabs; the say-once cuts in section 6; tab intros. Log every cut.
4. **Part 1 (decision) and cover.**
5. **Part 2 (evidence).**
6. **Part 3 (strategy)**, including the pillar crosswalk.
7. **Part 4 (delivery, the four workstream tabs, staffing).**
8. **Parts 5–6 (measurement, risks).**
9. **Annexes A–G.**
10. **Figure slimming** (section 7) and the 34 derived visuals (5.3).
11. **Verification**, PR, preview check, merge, production check (sections 10 and 12).

Within a stage, work section by section in the order of section 9. After each tab, re-run the measurement for that tab and note the before and after in `docs/declutter/PROGRESS.md`.

---

## 9. The per-tab plan

The plan is long, so it sits at the end of this brief, after section 14. It covers every section, tab by tab. Columns: **Now** = source words today; **Target** = visible running prose on load (card, tab and figure text excluded); **Treatment** = codes from section 4; **Visual** = what replaces the text ("existing" means already in the repo); **Instruction** = what to do. Sections not listed individually follow the default: ≤ 60 words KEEP, otherwise SUM.

---

## 10. Acceptance checks (all must pass)

**Content safety**
1. `npm run verify` passes (it already runs content staleness, open items, figures, copy, ward register, figure fences, duplicates, mounts, anchors, visual coverage and figure tests).
2. Every `{{token}}` present at `4bfc078` is still present after, at least once, in `content/*.md` (inside or outside fences). Write `scripts/declutter/check-tokens.mjs`.
3. All 92 `figure` fences and 5 `textversion` fences are still present, unchanged.
4. **Word conservation.** Words after (prose + `visual` fence text + `lead` excluded) + words logged in CUTS.md (verified duplicates and signposts) = words before ±1%. A section losing more than 2% unlogged fails.
5. **Duplicate cuts are real.** For each CUT logged as a duplicate, a script confirms every token and every capitalised name in the cut text appears at the logged canonical home.
6. **Leads are extractive.** `scripts/declutter/check-leads.mjs`: every token in a `lead` appears in that section's prose; every word of 5 or more letters in the lead appears in the section's prose (allow up to 2 that do not, and print them for review); no lead exceeds 45 words.
7. **Hedges survive.** For each `lead`, take the prose sentences sharing most words with it; any hedge word from section 2, rule 3 in those sentences must appear in the lead. Fail otherwise.
8. **No values changed.** `git diff 4bfc078 -- lib/data/figures.ts lib/figures data` shows no changed `value`, `tier`, `source` or `asOf` field. Additions are allowed only as section 2, rule 4 permits, and are logged.
9. Conflicts C1–C8: the same count of `[CONFLICT Cn` markers in `content/*.md` as at `4bfc078` (27), each still inside the passage it marked.

**Reader-facing**
10. In the rendered HTML, zero matches for `[CONFLICT`, `CHECK REF`, `[VERIFY`, `[Confirm approach`, and for `\(Tier [123]` outside badges.
11. Zero paragraphs over 60 words outside folds. **No reading-mode code remains:** `grep -rn "reading-mode\|useReadingMode\|ReadingModeToggle\|BriefFold\|kind: \"brief\"" app components lib` returns nothing (beyond the one-line key cleanup), and no control on any page offers Brief or Full.
12. The targets in section 3 are met (record the final metrics in `docs/declutter/metrics-after.json` and the comparison in `docs/declutter/REPORT.md`).
13. Print: open `/decision?print` (or the repo's print route; check `components/PrintSafeDisclosures.tsx`) and confirm folds, card and row disclosures, tabs and figure notes all print open.
14. JavaScript off: every tab panel and card disclosure content is present in the HTML.
15. Deep links: 30 random old ids from `lib/anchors/pre-rebuild.json` plus 20 current ids land on the right heading, with the containing folds open.
16. Lighthouse mobile on `/`, `/evidence`, `/strategy`: accessibility 100; performance not lower than baseline minus 3; CLS < 0.1.
17. Screenshots at 390 px and 1280 px of every tab, before and after, in `docs/declutter/screenshots/` (Playwright is installed; use `require('playwright')`, do not reinstall).

---

## 11. Do not touch; hard stops

Do not touch:
- Figure values, sources, tiers and dates; `analysis/`; `data/*.ts` values.
- Heading numbers and ids (the restructure just settled them).
- The decisions behind C1–C8; pillar names; the strategy.
- Production settings in Vercel; environment variables.
- Do not force-push `main`.

Stop and report, without merging, only if:
- a summary cannot be written without dropping a hedge or a tier;
- a REUSE or CUT would lose a fact that has no home and nowhere to go;
- `npm run build` cannot pass without changing a value or a source;
- the screens target is missed by more than 25% after every section in section 9 is done (report what blocks it);
- production fails a live check and rollback fails.

Anything else: take the conservative option, log it in `docs/declutter/DECISIONS.md`, and continue.

---

## 12. PR, merge, rollback

- **PR title:** `Declutter: one website, no Brief/Full (≤ 170 phone screens)`. **Body:** the before/after table, what changed by treatment code, the check results, links to CUTS.md, DECISIONS.md, TIER-MISMATCHES.md and REPORT.md, then the attribution lines the harness gives.
- Wait for the Vercel preview. Run checks 10–16 against the preview URL.
- **Before merging,** record the current production deployment id (`dpl_6Hrupsas8mjfw4tS7AWfTammsbQV` unless it has changed). Merge with a merge commit (keep stage commits). Repeat checks 10, 12 and 15 against production.
- **Rollback:** promote the recorded deployment (`request_rollback` / `vercel rollback`), revert the merge commit on a new branch (`git revert -m 1 <sha>`), open a PR and report.

---

## 13. Open items for the owner (do not decide them; list them in the final report)

1. **Pillar consolidation.** The crosswalk shows 21 pillars and themes. Whether to reduce them is a strategy decision.
2. **C1–C8 and the 12 `[CHECK REF]` citations** remain open (`docs/restructure-2026-10/OPEN-ITEMS.md`).
3. **Six sub-counties are in no zone** (3.3.1 coverage note), a Week 2 task in the plan.
4. **"Not yet tiered" statistics** that cards now show prominently: 13.0% never attended school, 17.4% completed secondary, 78.4% farm-dependent, 61% water access. They are labelled, but the owner may prefer to hold them back.
5. **Stale dates** (`docs/restructure-2026-10/TODO-dates.md`). The nomination window "late October to November 2026" is now the present.

---

## 14. Final message to the owner

Keep it short: before/after screens and words (Brief and Full before; the single site after), the merge and production status, the check results, and the open items in section 13 with links.


---

# Section 9: the per-tab plan

| Tab | Words now (source) | Target on load | Cut |
|---|---:|---:|---:|
| cover | 138 | 138 | 0% |
| decision | 4,735 | 875 | 82% |
| evidence | 7,859 | 1,572 | 80% |
| strategy | 7,900 | 1,287 | 84% |
| delivery | 2,507 | 586 | 77% |
| workstreams-platforms | 2,159 | 350 | 84% |
| workstreams-media | 1,335 | 210 | 84% |
| workstreams-ground | 2,317 | 340 | 85% |
| workstreams-data | 1,446 | 320 | 78% |
| staffing | 1,093 | 272 | 75% |
| measurement | 3,781 | 1,366 | 64% |
| risks | 1,424 | 418 | 71% |
| annex-evidence | 452 | 264 | 42% |
| annex-county | 976 | 329 | 66% |
| annex-messages | 875 | 151 | 83% |
| annex-cadence | 228 | 89 | 61% |
| annex-runbooks | 1,089 | 544 | 50% |
| annex-terms | 137 | 137 | 0% |
| annex-spec | 2,213 | 358 | 84% |
| **Total** | **42,664** | **9,606** | **77%** |

### `cover` — 138 words now → 138 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 138 | 138 | KEEP | CoverHero (existing) | Leave. Check the hero shows one reading time (5.0), measured from what is visible on load. |

### `decision` — 4,735 words now → 875 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 26 | 0 | CUT | - | Tab blurb already says this in navigation. Delete. |
| 1.1 | The ask: one week and one export | 772 | 120 | CUT SUM STAT | fig-6-3-decision (existing) + StatRail: pool voters, pool share, offline %, rival 2022 tallies | The ask appears three times ("The window" callout, "The ask", "The ask, in full"). Keep one: a 3-line lead (ask = one week + one export; Firefly directs, team publishes, Firefly publishes nothing on his accounts; no electoral outcome promised) + StatRail. Delete the "What this section adds" signpost. Fold the rest of "The ask, in full". The nomination-window sentence becomes the WindowChip (X7). |
| 1.2 | The goal and the two deadlines | 231 | 40 | REUSE CUT | fig-1-1-timeline (existing) | The two bullets and two numbered deadlines restate the timeline figure. Keep one sentence ("Two deadlines: the Wiper decision, reported late Oct–Nov 2026; the general election, 10 Aug 2027") and the figure. Move the "Success Definition" sentence into the figure takeaway if it is not already there. |
| 1.3 | Five objectives for the digital operation | 2 | 2 | KEEP | fig-1-3-objectives (existing) | Keep the figure. |
| 1.3.1 | Be known where he isn't yet | 154 | 35 | CARDS | ObjectiveCard (new, one per objective; 5 cards in a swipe row on phone) | All five objectives use the same 7 labelled fields (Traceability, Finding, Baseline, Target, Served by, Measured by, Owner). Render each as a card: title, Target (bold), Measured by (indicator codes as chips), Owner. Finding/Baseline/Traceability/Served-by go behind the card's "Details" disclosure. Text is moved, not rewritten. |
| 1.3.2 | Turn his record into visible proof | 139 | 35 | CARDS | ObjectiveCard (new, one per objective; 5 cards in a swipe row on phone) | All five objectives use the same 7 labelled fields (Traceability, Finding, Baseline, Target, Served by, Measured by, Owner). Render each as a card: title, Target (bold), Measured by (indicator codes as chips), Owner. Finding/Baseline/Traceability/Served-by go behind the card's "Details" disclosure. Text is moved, not rewritten. |
| 1.3.3 | Build a direct line to the voters the internet d | 103 | 35 | CARDS | ObjectiveCard (new, one per objective; 5 cards in a swipe row on phone) | All five objectives use the same 7 labelled fields (Traceability, Finding, Baseline, Target, Served by, Measured by, Owner). Render each as a card: title, Target (bold), Measured by (indicator codes as chips), Owner. Finding/Baseline/Traceability/Served-by go behind the card's "Details" disclosure. Text is moved, not rewritten. |
| 1.3.4 | Give every post a voter, a ward and a reason | 143 | 35 | CARDS | ObjectiveCard (new, one per objective; 5 cards in a swipe row on phone) | All five objectives use the same 7 labelled fields (Traceability, Finding, Baseline, Target, Served by, Measured by, Owner). Render each as a card: title, Target (bold), Measured by (indicator codes as chips), Owner. Finding/Baseline/Traceability/Served-by go behind the card's "Details" disclosure. Text is moved, not rewritten. |
| 1.3.5 | Hold the home base while Kitui Central runs its  | 113 | 35 | CARDS | ObjectiveCard (new, one per objective; 5 cards in a swipe row on phone) | All five objectives use the same 7 labelled fields (Traceability, Finding, Baseline, Target, Served by, Measured by, Owner). Render each as a card: title, Target (bold), Measured by (indicator codes as chips), Owner. Finding/Baseline/Traceability/Served-by go behind the card's "Details" disclosure. Text is moved, not rewritten. |
| 1.4 | Who does what: ownership and boundaries | 94 | 15 | CUT | - | Signpost paragraphs. Keep one line: "Seven workstreams Firefly operates, six your team runs to a brief, two outside scope."  [C3 stays marked]. |
| 1.4.1 | How this proposal is built | 187 | 40 | REUSE STEPS | fig-1-4-flow (existing) + Stepper: Analyse W1 / Strategise W2–3 / Direct W4+ | The three Analyse/Strategise/Direct bullets become the Stepper; delete them as prose. Remove the "built in the same order" sentence (carries [CHECK REF]). "Firefly publishes nothing..." is said here once (canonical home, X8). |
| 1.4.2 | The fourteen workstreams, by owner | 414 | 70 | CUT REUSE | fig-5-1-workstreams (existing) | The owner split is stated three times (1.4, 1.4.2 bullets, 1.6). Keep the figure + the two "Workstream 9 / Workstream 14" call-outs as a two-card row. Delete the "Who owns what" bullets (the figure carries them) and the Level 2 recommendation repeat (canonical home 1.5.2). "The Firefly proposition" paragraph: summarise to one line, fold the rest. |
| 1.4.3 | What is outside this scope | 329 | 40 | INOUT | InOutScope (new): two-column In / Out checklist, 10 Out items, each one line | Each bullet becomes one Out row: bold label + ≤ 12-word clause from its own first sentence; the remaining sentences go in the row's disclosure. Delete the closing italic pointer. |
| 1.5.1 | The three scope levels | 506 | 80 | REUSE CUT | ServiceLevelSelector + TierComparisonCarousel (existing, mounted) | The three Level 1/2/3 bullet lists duplicate the two mounted components. Verify every field in the bullets exists in the component data (data/ or lib/); add any that are missing to the component data, then delete the lists. Keep the "one definition per number" table (it is unique) but render it as a nested-sets visual (NestedSets, new: contact universe ⊃ consented SMS; pledged ⊃ verified). Keep "Accessibility is not a service level" as a one-line callout. |
| 1.5.2 | The scope levels compared | 80 | 60 | KEEP | fig-5-5-cadence (existing) | Canonical home of the Level 2 recommendation. Keep. |
| 1.5.3 | The deliverables schedule | 451 | 40 | MATRIX | DeliverablesTable (new, sortable/filterable): filter chips Firefly / Your team / Campaign; group by cadence Daily · Weekly · Fortnightly · Monthly · Quarterly · Once | Keep all 18 rows. Default view on phone: grouped by cadence, Firefly rows highlighted. Two intro paragraphs → one line. The "four deliverables are gated" paragraph becomes a 4-item ChecklistGrid ("Gated on"). |
| 1.6 | What this proposal commits to | 197 | 50 | SUM | checklist (partviz): Scope / Cadence / Standard / Conditions | Four bold-led paragraphs → four checklist rows, each the bold label + its first sentence. Rest folded. |
| 1.7 | What this needs from the campaign | 154 | 25 | KEEP | fig-6-1-dependencies + textversion (existing) | Keep. |
| 1.8 | Assumptions this proposal rests on | 612 | 90 | CARDS SUM | AssumptionTable (new): # · assumption (bold line) · status chip (Tier/unknown) · "If it fails →" · where | Eleven numbered assumptions (1–7 plus 4a–4d). Each row keeps its bold first sentence; the "if it fails" clause is lifted verbatim into its column. Delete the editorial history in assumption 2 ("Earlier drafts of this proposal said…") — it describes drafts, not the plan. Flag 4a (Page or profile) as the largest unknown, as the text already does. |
| 1.9 | How success will be judged | 28 | 28 | KEEP | fig-1-5-scorecard (existing) | Keep. |

### `evidence` — 7,859 words now → 1,572 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 31 | 0 | CUT | - | Duplicates the tab blurb. |
| 2.1 | The electorate and the number it takes | 616 | 90 | CUT STAT REUSE | StatRail: register 2022 · 40 wards / 8 constituencies · polling stations · register Jul 2026 (Tier 3) · benchmark · turnout 2022; then fig-2-1-register + fig-3-1-funnel | The electorate is listed twice ("The electorate" and "The number it takes" repeat register, prisons, 2026 register, benchmark and turnout). Merge into one StatRail; keep the [CALC] ≈ benchmark-on-2026-register line as a BulletTarget or one sentence. Delete the two framing paragraphs ("governed by strict spatial and demographic mathematics…", "This section constructs…") and "To achieve absolute mathematical certainty". The ECVR phase detail goes in the register tile's disclosure. Keep [CONFLICT C8] as a chip on the turnout tile. |
| 2.2 | How Kitui has voted | 363 | 60 | REUSE CUT | fig-2-2-results + ElectoralHistoryPanel (existing) | Five result bullets restate the results figure. Verify each figure is in the panel data; then replace with a 3-row ResultsTable (2017, 2022 governor; 2022 MP/Senate/Woman Rep) or delete if the panel already shows it. The source caveats (media variant, Form 37C/38C/39C not in hand) become tier badges + one "Records still to obtain" ChecklistGrid shared with 2.11. |
| 2.3 | Where the votes are | 157 | 40 | STAT REUSE | fig-3-2-register-map (existing) + StatRail: top 12 wards = x% · top 20 = y% · bottom 10 = z% | The three numbered "insights" become three stat tiles, each with its one-line meaning. Delete the opening paragraph's "extreme density clustering" framing; keep "an even split would be N per ward" as the tile caption. |
| 2.3.1 | The constituencies that decide it | 266 | 70 | REUSE SUM | constituency-power figure (existing) | Keep the Mwingi-bloc finding (necessary, not sufficient) as a two-line callout. The "Analytical Hierarchy" list restates the constituency figure; fold it. |
| 2.4 | Four routes to the number | 589 | 70 | KEEP | fig-3-3-paths + textversion (existing) | Keep; the text version is already the accessible alternative. Retire the derived stepper for this heading (override kind "none"). |
| 2.5 | The nomination rules and the calendar | 2 | 2 | KEEP | fig-2-3-nomination (existing) |  |
| 2.5.1 | How Wiper picks its candidate | 188 | 60 | SUM | - | Lead: "The selection method is a single-source Tier 3 report. The 2022 precedent was delegates and panels (Kilonzo v Wiper, Tier 1)." Fold the rest. |
| 2.5.2 | Where the selection method stands | 198 | 50 | STEPS | ChecklistGrid "What would confirm it": NEC resolution · 2027 nomination rules filed with IEBC/ORPP | The two numbered items become the checklist. The party-renaming callout becomes a one-line note. |
| 2.6 | The field: rivals and an open seat | 26 | 20 | KEEP | fig-3-5-field (existing) |  |
| 2.6.1 | Stage One: the Wiper nomination | 440 | 90 | CARDS | CandidateCard (new; one card per person: name, office, best 2022/2017 tally, tier badge, "record to hold") | Three rival bullets + the incumbent bullet → cards. The Kasalu equal-ward policy argument (with [CONFLICT C6]) leaves the card and becomes one PolicyConflict callout: "Two positions cannot both be run — Firefly recommends needs-weighted; the campaign decides." The incumbent bullet is cut (canonical home 2.6.3). Retire the derived stepper for this heading. |
| 2.6.2 | Stage Two: the general election field | 359 | 70 | CARDS | CandidateCard ×5 | Same card. Malombe bullet is cut (canonical home 2.6.3). Retire the derived stepper. |
| 2.6.3 | The incumbent is term-limited: 2027 is an open s | 163 | 50 | SUM | - | Canonical home of the term-limit fact. Lead: "Article 180(7) limits a governor to two terms; Malombe is serving his second, so 2027 is an open seat." Keep "what would change it" as one line. |
| 2.6.4 | Reading the current field | 112 | 40 | SUM | - | Lead sentence: compete on verifiable fiscal and delivery competence, not on countywide presence. Fold the rest. |
| 2.7 | Where he is known and where he isn't | 17 | 0 | CUT | - | Signpost. |
| 2.7.1 | Where he has held office, and where he has not | 364 | 70 | REUSE STAT | fig-3-4-footprint + RecognitionDeficitOverlay (existing) + StatRail: pool voters · pool share · 5 of 12 largest wards in the pool | The office-history list and the five-wards list restate the footprint map. Keep the pool formula as one stat; fold the lists. |
| 2.7.2 | Where party loyalty won't carry him | 208 | 70 | SUM | fig-3-6-party-flow (existing) | Two bold-led findings stay as two one-line callouts (Kitui Central has its own MP race; East and South will not carry party flow). Fold the rest. |
| 2.8.1 | The county's people and economy | 289 | 50 | REUSE STAT | fig-2-4-people (existing) + StatRail: population · households · area & density · rural share · poverty rate | Bullets restate the people figure; cut after verifying. The NDMA drought paragraph becomes a 3-point TimelineRail (Alert Jan 2026 · IPC 2 Sep 2025 · floods Mar 2026) or links to Annex B.3, which carries the same. |
| 2.8.2 | The budget the next governor runs | 268 | 50 | REUSE STAT | fig-2-5-budget + ResourceEnvelopeBlock (existing) | The four governor competencies → a 4-icon row (IconRow, new or ChecklistGrid). Revenue bullets restate the budget figure; cut. The rounding paragraph becomes the figure's note. "The Strategic Opportunity" → one line. |
| 2.8.3 | The three regions | 514 | 80 | TABS REUSE | fig-3-7-zones + GeographicZoneMatrix (existing); ZoneTabs (new): Anchor · Mwingi · Arid belt | Three zone tables + three messaging paragraphs → one tabbed panel; each tab = table + 2-line message. The sub-county naming note goes in a disclosure. Two [CHECK REF] here stay hidden from readers (X3). |
| 2.9.1 | How people get information | 274 | 50 | REUSE STAT | fig-2-6-connectivity + ChannelReachBlock (existing); StatRail: internet % · offline % · phone % · M-Pesa agents | Canonical home of the connectivity figures. The 4-row table is kept in the figure's "View the data"; prose that repeats it is cut. |
| 2.9.2 | Who owns the airwaves | 338 | 50 | REUSE SUM | fig-2-7-media + MediaOwnershipBlock (existing) | The three ownership bullets → a 3-swatch legend (placement / party-sensitive / monitor) inside the block. The listenership note becomes the figure's source line. Canonical home of station posture is 4.5.6. |
| 2.9.3 | What each channel can physically reach | 406 | 60 | REUSE CUT | fig-3-8-ceiling (existing) + ContrastBar "What digital can / cannot do" | Canonical home of the digital ceiling. The [!CRITICAL] callout stays (trimmed to its two numbers). The paragraph restating 2.9.1's rates is cut. The two 3-item lists become one ContrastBar (Can / Cannot), each item its bold label only, body in disclosure. Retire the derived stepper. |
| 2.9.4 | The offline majority, and the infrastructure tha | 664 | 100 | CARDS WEEK | ChannelCard ×5 (Radio · SMS/USSD · M-Pesa agents · Markets · Church), each with three rows: Reach · Firefly operates · Campaign would run; MarketWeek (new): Mon–Sat grid of 12 markets | The five channel blocks share the same three fields; render as cards. The Market Rotation Map becomes a 6-column weekly grid with constituency colour. Radio shares are cut here (canonical home 2.9.2). Kikamba-not-on-SMS is cut here (canonical home 4.5.9). |
| 2.10.1 | Dr. Mulu's public record | 386 | 70 | CARDS REUSE | fig-2-8-record (existing) + ProofCard ×6 (asset · evidence · tier · use) | Canonical home of his record (PhD, B&A Committee, M&E Champion, ESK, best-evaluated FY2014/15, KSh 47m bursaries, CBS). The 6-row table becomes six ProofCards. Every other place the record is restated (1.1, 1.3.2, 2.6.1, 3.1, 3.1.1, 3.2.3 P1, 4.5.1) links here instead. |
| 2.10.2 | His channels today, and his rivals' | 60 | 50 | KEEP | fig-2-9-channels (existing) |  |
| 2.10.3 | What his current presence shows | 146 | 50 | REUSE CARDS | fig-3-9-audit (existing) + 4-tile row "What the audit produces" | The four outputs become four placeholder tiles labelled "Set in Week 1". Retire the derived stepper. |
| 2.11 | What the data can't yet tell us | 209 | 40 | REUSE CUT | fig-3-10-gaps (existing) | The three numbered gaps restate the gaps figure; cut after verifying. Shares the "Records still to obtain" checklist with 2.2. Retire the derived checklist. |
| 2.12 | The diagnosis, and the evidence that could overt | 206 | 70 | HYP | HypothesisCard (new): Hypothesis · For · Against · Test; then fig-3-11-evidence | Canonical home of the recognition hypothesis. The four bold-led paragraphs map 1:1 onto the card's four panels. Other restatements (1.1, 1.2, 2.7.1, 3.3.1, 4.2.1, 5.2.6) link here. |

### `strategy` — 7,900 words now → 1,287 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 44 | 0 | CUT | - | Duplicates the tab blurb. |
| 3.1 | The position | 243 | 50 | SUM CUT | fig-4-1-message-house is in 3.2; EconomistGovernorThesis (existing, mounted) | Lead: "Dr. Mulu is the Economist Governor: the one candidate qualified to verify whether public money delivered." The credentials paragraph is cut (canonical home 2.10.1). Remove inflated register ("turns standard political promotion on its head", "Forensic analysis", "highly powerful"). |
| 3.1.1 | The evidence behind the claim | 206 | 20 | CUT | link to 2.10.1 | Four credential bullets repeat 2.10.1. Replace with one line + link. Retire the derived stepper. |
| 3.1.2 | The resource paradox | 189 | 50 | CHART | BarRank: the four audit findings (KSh) + pending bills; reuse FiscalAuditChart data (lib/figures, annex B.2) | Four numbered audit figures → one bar chart from the existing fiscal-audit data; one-line lead ("resources are not the problem; deployment is"). Do not introduce new numbers. |
| 3.1.3 | Answering the charge that discipline is cold | 185 | 50 | QA | AttackAnswer (new): attack quote · answer (first two sentences) · disclosure | Rival attack / rebuttal as a two-panel card. Plain-register the rebuttal's first two sentences; fold the rest. |
| 3.2 | The pillar architecture | 77 | 40 | CROSS | PillarCrosswalk (new): one matrix mapping the 4 campaign pillars × 3 message pillars × 4 production pillars (P1–P4) × 4 content buckets (A–D) × 6 themes | The reader currently meets 21 pillars and themes across 3.2.1–3.2.4 and 4.5.2, and the text spends paragraphs explaining they are different things. The crosswalk shows it once. Do not merge or rename any pillar — that is a strategy decision for the owner (open item). |
| 3.2.1 | Campaign pillars | 236 | 50 | CARDS | PillarCard ×4 (title + first sentence) | Each bullet → card; rest folded. The cover line becomes a QuoteBand. Retire the derived checklist. |
| 3.2.2 | The central claim and its three pillars | 853 | 120 | CARDS | fig-4-1-message-house (existing) + MessagePillarCard ×3 (narrative quote · evidence status chips) | The "awaiting primary documents / page references" sub-bullets are research status, not message. Render each as a status chip ("Source pending: OAG NG-CDF reports 2013–2025") with the explanation in a disclosure. The envelope-arithmetic callout becomes a stacked bar of the KSh 13.79bn envelope: ward fund 29%, ndengu floor ~15%, rest — using only the figures already in the callout. [C6] chip on Pillar 3. |
| 3.2.3 | Production pillars and the visit-to-verification | 883 | 100 | MATRIX REUSE | ProductionPillarMatrix (new): P1–P4 as columns × rows Segment · Language · Channel · Format · Why; visit-loop figure (existing); content buckets A–D as 4 compact cards | P1–P4 share five fields: one matrix replaces about 450 words of bullets. The two framing paragraphs ("These are the production pillars… different objects") are replaced by the crosswalk in 3.2. Content buckets A–D: Core theme + Formats only; Tone in disclosure. Retire the derived stepper. |
| 3.2.4 | The six campaign themes | 652 | 90 | CARDS | ThemeCard ×6: theme · headline stat · tier badge · "not yet tiered" chip where the text says so | Each theme keeps its single strongest Tier 1 stat as the card headline (water 21% basic service, last in Kenya; poverty rate; envelope; insurance/stunting; bursaries). The water-theme "why strongest" sentence stays. Other evidence folds. |
| 3.3.1 | Where the effort goes | 367 | 50 | REUSE SUM | fig-4-2-effort (existing) | Three weighting bullets restate the effort figure; keep the two percentages as a StatRail and fold. The coverage note (six unassigned sub-counties) becomes a one-line warning callout; it is an open task. |
| 3.3.2 | Which channel does which job | 277 | 50 | REUSE STAT | fig-4-6-channel-shift + ReachSplit (existing): register split smartphone-reachable / SMS-only / no phone | The "in one view" table duplicates the figure; render its three reach rows as the ReachSplit bar and its two weight rows as a DonutSplit. Delete "A common failure mode…" framing. |
| 3.3.3 | The gatekeeper bottleneck | 95 | 30 | CARDS | IconRow ×3 hazards | Three numbered hazards → three tiles, bold label + one clause. |
| 3.4 | Who we are trying to move | 137 | 30 | CUT | audience-overview (existing) | Delete the three framing paragraphs except one line: "Six segments; one countywide message fails." |
| 3.4.1 | The universes: voter, turnout, victory, base, pe | 300 | 50 | CHART | NestedSets (new): voter ⊃ turnout ⊃ victory; base / persuasion / mobilisation as labelled rings with "not stated" shown as hatched | Keep the table in "View the data". The "two sizes deliberately not stated" paragraph → one caption. |
| 3.4.2 | The six voter segments | 1752 | 120 | TABS REUSE | AudienceSegmentationMatrix (existing, mounted) + SegmentTabs (new): six tabs, each tab = Size · Where · Channels · Core anxiety · Offer · Proof | The single largest prose block on the site (~1,500 words). Six segments share seven fields; one tabbed profile shows one segment at a time. The pillar/language/channel table at the top stays as the tab header row. The "core anxiety is a hypothesis" paragraph becomes a persistent one-line note on the panel. [C7] chip on the radio-station row. |
| 3.4.3 | Segment sizing, and the evidence for it | 115 | 40 | REUSE | fig-4-3-segments (existing) | Keep the "not additive" and "check the base" warnings as two one-line notes. |
| 3.5 | What we say, and in which language | 105 | 30 | CUT | fig-4-4-message-region (existing) | Delete "empty populist slogans" and "Evidence-Backed Message Hierarchy" framing; keep one line on provenance discipline. |
| 3.5.1 | Counter-messaging against disinformation | 2 | 2 | KEEP | - |  |
| 3.5.2 | Persuasion principles and message discipline | 231 | 60 | CARDS | PrincipleCard ×8 (principle · campaign application), PersuasionFramingMatrix (existing, mounted) | Check whether the mounted matrix already shows the 8-row table; if so, cut the table. Keep the Boundary paragraph as a callout (it is a commitment). |
| 3.5.3 | Framing, worked through in examples | 306 | 60 | CARDS | MessageMock (new or phone/primitives): each example as an SMS/voice-note bubble tagged with its principle | Examples are already short; render them as message bubbles grouped by issue. Retire the derived stepper. |
| 3.6.1 | Which language reaches which voters, on which ch | 291 | 50 | CHART | language-map (existing) + DonutSplit 50/30/20 Kikamba/Kiswahili/English | The content-mix table becomes the donut ([C1] chip — the 50% share is disputed). Proverbs become a ProverbCard row marked "draft — native-speaker review". The opening two paragraphs → one line. |
| 3.6.2 | Register, dialect and the discipline it takes | 136 | 30 | CARDS | cultural-registers (existing) + 3 rule tiles (Do / Never / Always) | Three numbered rules → three tiles. |
| 3.6.3 | The production and quality-control pipeline | 22 | 15 | KEEP | qc-gateway (existing) | Cut the "severe version-drift" sentence. |
| 3.7 | A week of publishing, before and after | 163 | 70 | KEEP | fig-4-5-calendar (existing) | Keep the "What changed / What did not change" pair as a two-column ContrastBar. |
| 3.8 | When the plan changes | 33 | 30 | KEEP | fig-4-8-decision-rules (existing) |  |

### `delivery` — 2,507 words now → 586 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 25 | 0 | CUT | - |  |
| 4.1.1 | Operating rhythm, tooling and reporting lines | 274 | 50 | WEEK | WeekStrip (new): Thu brief · Fri calendar · Mon 30-min review · Tue–Sun publishing · Wed one number · last Fri monthly review | Six rhythm bullets → a weekly strip (this is also D.1's content and 4.5.2's weekly-cycle; link both here). The three bold-led paragraphs (assets, tracking, escalation) → three one-line rows. Retire the derived stepper. |
| 4.1.2 | Who does what, in one table | 252 | 40 | MATRIX | RaciGrid (new): the 14×5 table rendered as a coloured grid, R/A cells filled | Keep every cell. Two closing paragraphs → one line each. |
| 4.1.3 | Decision rights and content approval | 62 | 50 | KEEP | fig-5-7-approval (existing) |  |
| 4.2.1 | The first four weeks | 552 | 90 | TIME | fig-5-3-four-weeks (existing) + TimelineRail W1 · W1–2 · W2–6 · W6–8; KPI table → BulletTarget list | The hypothesis paragraph is cut (canonical home 2.12). The four week-bands of bullets become the timeline rail with items as chips. The Phase −1 KPI table stays as a compact target list. |
| 4.2.2 | Phase 0: Instrumentation — Weeks 4–10 from signa | 177 | 40 | TIME | TimelineRail weeks 1–2 · 3–4 · 5–6 · 7–8 | Activities → rail; KPI bullets → ChecklistGrid. |
| 4.2.3 | Fix first: six profile corrections | 157 | 50 | REUSE SUM | fig-4-7-profile-fixes (existing) | Keep "the PhD is the one to fix first" and the Page-or-profile question as two callouts; fold the explanation. |
| 4.3 | The phases to August 2027 | 37 | 30 | KEEP | fig-5-4-phases + PhaseRail (existing) |  |
| 4.3.1 | The target ladder | 278 | 40 | KEEP | fig-5-4-ladder + textversion (existing) |  |
| 4.3.2 | Phase 1: Awareness and Community Building — Octo | 96 | 30 | TABS | PhaseTabs (new) — one tab per phase (activities list) under PhaseRail | The three phase sections become three tabs of one panel. Each "KPIs: set out in the target ladder" line is cut. Retire the derived stepper. |
| 4.3.3 | Phase 2: Engagement and Persuasion — January–Mar | 105 | 30 | TABS | PhaseTabs (new) — one tab per phase (activities list) under PhaseRail | The three phase sections become three tabs of one panel. Each "KPIs: set out in the target ladder" line is cut. Retire the derived stepper. |
| 4.3.4 | Phase 3: Mobilisation and GOTV — April–August 20 | 97 | 30 | TABS | PhaseTabs (new) — one tab per phase (activities list) under PhaseRail | The three phase sections become three tabs of one panel. Each "KPIs: set out in the target ladder" line is cut. Retire the derived stepper. |
| 4.3.5 | Post-election | 36 | 36 | KEEP | - |  |
| 4.4 | Coalitions and endorsements | 359 | 70 | TIME | CoalitionTimeline (TimelineRail): 8 rows by phase; endorsements rules → ChecklistGrid; KPIs → StatRail | The sequenced table becomes the rail (phase · who · engagement); digital output in the item disclosure. Principle paragraph → one line. |

### `workstreams-platforms` — 2,159 words now → 350 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| 4.5 | The fourteen workstreams | 428 | 60 | CUT REUSE | fig-5-2-workstream-panels (existing) | The two long scope lists (Digital infrastructure…; Growth…) are held together pending C4. Render as two collapsed DisclosureGroups showing only their bold labels. Delete the 4-group restatement sentence. |
| 4.5.1 | Workstream 1 — Owned platforms and the service-d | 775 | 120 | CARDS SUM | PublicServiceDeliveryTracker (existing) + fig-5-2-1-report-flow; ChannelChips (USSD/SMS/WhatsApp/Web/Champion); 5 principle tiles; KPI table | X5 banner → chips. "Why it exists" repeats 2.10.1 → one line. The 5 design principles → 5 tiles (bold line only). "What it is worth" 5 bullets → 5 icon rows. The second "service-delivery performance tracker" block repeats the first (and carries [C5]): keep only the post-election Day-One dashboard paragraph, folded. |
| 4.5.2 | Workstream 2 — The content brief and asset gover | 232 | 40 | REUSE CUT | production-pipeline, weekly-cycle, approval-gateway, asset-library (existing) | Four figures carry the workstream. Delete the "rigorous, industrial pipeline" paragraph (its offline-first point is 2.9.3's). Keep the italic pointer as a link chip. |
| 4.5.3 | Workstream 3 — Creative testing and AI assistanc | 273 | 60 | CARDS | Do/Never panel for AI use; testing rules → ChecklistGrid; benchmarks → BulletTarget | Disclosure commitment → callout. Tools table stays in a disclosure. Retire the derived stepper. |
| 4.5.4 | Workstream 4 — Accessibility and inclusion | 451 | 70 | CARDS | CommitmentGrid (7 tiles: KSL · captions · WCAG · plain language · audio · low bandwidth · print); KPIs → ChecklistGrid | The case bullets → StatRail (13.0% never attended school — note it is "not yet tiered" per 3.2.4; offline %). The commitments table becomes the tile grid. |

### `workstreams-media` — 1,335 words now → 210 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| 4.5.5 | Workstream 5 — Platform tactics and paid media | 110 | 60 | KEEP | MediaPlaybackMockup (existing) |  |
| 4.5.6 | Workstream 6 — Earned media, journalists and deb | 1225 | 150 | MATRIX CARDS | StationTable (existing premium component) for the 9-station ownership map; JournalistTiers (4 cards A–D); bypass-architecture (existing) | Canonical home of radio ownership and posture ([C7]). Journalist table → 4 cards. Media training, debate playbook and pre-drafted lines: keep headings, fold bodies (they are operating detail). Earned media KPIs → StatRail. |

### `workstreams-ground` — 2,317 words now → 340 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| 4.5.7 | Workstream 7 — Ground-digital integration | 760 | 90 | CARDS REUSE | field-loop, field-reports, four-hour-cycle, operating-rhythm (existing); NetworkCard ×4 (boda, matatu, markets, barazas) | Opening two paragraphs → one line (cut "air-conditioned command center"). The four report types → 4 tiles with their example quote. The four distribution networks share Infrastructure/Role/Execution → cards, marked "campaign-owned". Retire the derived stepper. |
| 4.5.8 | Workstream 8 — The field-to-digital loop | 345 | 50 | STEPS | fig-5-2-3-field-loop (existing) + two-direction flow (Field→Digital 4 steps; Digital→Field 3 steps) | The nested bullets become the two flow lanes. Governance bullets → ChecklistGrid. Retire the derived stepper. |
| 4.5.9 | Workstream 9 — What Firefly operates: SMS, USSD  | 1120 | 140 | CARDS MATRIX | fig-5-2-3-ussd-menu (existing) + SMS message-type table + KPI table as BulletTarget by phase | Canonical home of "Kikamba cannot ride bulk SMS". "Why this layer decides the race" repeats 2.9.1/2.9.3: keep the "one in four residents" sentence only. Operational-discipline bullets → ChecklistGrid. Agent-network section → one card with its counsel-review chip (X4). Two [CHECK REF] hidden. |
| 4.5.10 | Workstream 10 — Digital organising and volunteer | 92 | 60 | KEEP | - | Banner already says out of scope; keep the pointer to G.3. |

### `workstreams-data` — 1,446 words now → 320 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| 4.5.11 | Workstream 11 — The data layer | 300 | 70 | REUSE | data-layer, supporter-schema (existing) | Architecture principles list → ChecklistGrid. |
| 4.5.12 | Workstream 12 — Predictive voter modelling | 403 | 90 | STEPS SUM | Stepper: score → method → evaluate → use; gate chip "Gated on 5.3.4 sign-off" | Four run-in sections become a 4-step pipeline, each step one line + disclosure. Retire the derived stepper in favour of this one. |
| 4.5.13 | Workstream 13 — The technology stack | 121 | 60 | KEEP | - | Banner says mostly outside scope; keep pointer to G.4. |
| 4.5.14 | Workstream 14 — Analytics and attribution | 622 | 100 | REUSE TIME | BenchmarkLadder (existing, mounted) + maturity roadmap as TimelineRail Stage 1–4 with phase | Attribution model → one diagram line; metrics table stays; roadmap → rail. |

### `staffing` — 1,093 words now → 272 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 24 | 0 | CUT | - |  |
| 4.6 | How the work is staffed | 330 | 50 | REUSE | org-chart, fig-5-9-team (existing) | Keep two lines; the role list restates the org chart. Retire the derived stepper. |
| 4.6.1 | A lean core with a defined surge | 70 | 40 | KEEP | - |  |
| 4.6.2 | The core team, retained throughout | 191 | 30 | CARDS | RoleCard ×3 | Core-team table → 3 role cards. |
| 4.6.3 | Surge roles, activated by phase and scope level | 176 | 40 | MATRIX | SurgeTable with trigger column highlighted | Keep the table; intro → one line. |
| 4.6.4 | Leadership roles and who owns what | 2 | 2 | KEEP | - |  |
| 4.6.5 | Reporting lines | 61 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| 4.6.6 | How the existing team is assessed and upskilled | 239 | 50 | TIME | TimelineRail: Week 2 standard → Weeks 3–8 pairing → Month 3 handover | Three bold-led stages → rail; fold the explanation. |

### `measurement` — 3,781 words now → 1,366 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 19 | 0 | CUT | - |  |
| 5.1 | The indicators | 31 | 25 | KEEP | fig-5-6-kpis + ObjectivesIndex (existing) | Slim the figure text (see section 7 of the brief): it is the third-wordiest figure. |
| 5.1.1 | Stage scorecards: nomination window and general  | 43 | 20 | KEEP | nomination-scorecard, ge-scorecard (existing) | Cut the two one-line framings ("unassailable party consensus"). |
| 5.1.2 | Re-anchored: recognition and persuasion where he | 313 | 60 | MATRIX | IndicatorCards R-01…R-05 (code chip · indicator · target); R-02 highlighted | Keep the table in a disclosure. "R-02 is the indicator this engagement lives or dies on" stays as the callout. |
| 5.1.3 | Why vanity metrics are excluded | 185 | 40 | CARDS | 3 tiles: Offline reality · Geographic skew · No link to turnout | Bold labels + first sentence. The withdrawn ">60%" editorial note is cut from reader view (log it). Retire the derived checklist. |
| 5.1.4 | Performance governance and executive escalation | 140 | 40 | STEPS | Playbook rows: trigger → action (3 rows) | Each numbered rule becomes trigger/response. |
| 5.2 | The presence audit: method | 30 | 30 | KEEP | - |  |
| 5.2.1 | The measurement set | 285 | 40 | MATRIX | MeasurementTable (8 groups) with "why" in row disclosure | Keep every row. |
| 5.2.2 | The window | 79 | 30 | SUM | - | Lead: "Ninety days: 18 Jun–16 Sep 2026 — the longest gap-free post-level export." Fold. |
| 5.2.3 | Why this comes first | 153 | 30 | CUT | - | Repeats 2.7 and 2.9.3; keep the bold question as a QuoteBand and the link. |
| 5.2.4 | Method | 193 | 40 | STEPS | Stepper ×8 | Eight numbered method steps → stepper (bold label + clause; body in disclosure). |
| 5.2.5 | What this section is not | 61 | 40 | KEEP | - |  |
| 5.2.6 | Testing the hypothesis on existing records | 119 | 40 | REUSE CUT | research-and-tracker, research-modules (existing) | Opening paragraph is a signpost; hypothesis restates 2.12. Keep one line + figures. |
| 5.3.1 | The standard we hold ourselves to | 534 | 90 | MATRIX SUM | Controller table (3 rows) + 3 rule callouts: bursary list off-limits · inherited lists not used · audit inside scope | Keep the not-a-legal-opinion framing as one line. Each bold rule → callout with first two sentences; rest folded. |
| 5.3.2 | The regulatory environment and compliance measur | 386 | 70 | MATRIX | Two tables kept; "commercial reality" → one callout | The DPA-applied paragraph (inflated) → one line. Safeguards list → ChecklistGrid. One [CHECK REF] hidden. |
| 5.3.3 | The Digital Ethics and Data Charter | 616 | 616 | KEEP | DataSecurityEthicsCharter (existing, mounted) + clause-title list as navigation | Published commitment: the full wording stays visible (section 2, rule 7). If the mounted component already renders all 10 clauses verbatim, delete the duplicate quoted copy in the prose so it appears once. Trim only the "Why publish it" paragraph (SUM). |
| 5.3.4 | The compliance sign-off gate | 306 | 70 | STEPS | Gate stepper (5 steps) + 5 open legal questions as a numbered checklist | Keep the bold gate rule as the lead. Retire the derived checklist. |
| 5.3.5 | Statutory compliance, IEBC clearance and liabili | 46 | 25 | KEEP | compliance-architecture, iebc-clearance, liability-matrix (existing) | Cut the "compliance pack consolidates…" sentence. |
| 5.3.6 | Open regulatory action items | 242 | 60 | SUM | ActionChecklist (3 mandatory actions) | Trim the [!WARNING] callout to status + the three actions. |

### `risks` — 1,424 words now → 418 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 37 | 0 | CUT | - |  |
| 6.1 | Risks and responses | 209 | 40 | KEEP | fig-5-8-risk (existing) | Slim the figure text (519 words). |
| 6.2.1 | Rapid-response protocol and opposition handling | 97 | 40 | KEEP | rapid-response-flow, CounterMessagingGrid (existing) |  |
| 6.2.2 | What we monitor, and how threats reach us | 137 | 30 | CARDS | Source → channel flow tiles |  |
| 6.2.3 | Staying inside defamation law | 138 | 40 | CARDS | Rule tiles (Rule 1…n) | Remove inflated register; each rule bold line only, body folded. |
| 6.2.4 | War room operating model, shift coverage and das | 96 | 50 | KEEP | - |  |
| 6.3.1 | The deepfake and manipulated media protocol | 477 | 100 | TIME CARDS | Prevention / Detection as two ChecklistGrids; 30-minute rebuttal table as a minute-by-minute TimelineRail | Context paragraph → one line. Keep the liar's-dividend paragraph and the standing rule as callouts. Retire the derived stepper. |
| 6.4 | Competitor monitoring | 18 | 18 | KEEP | - |  |
| 6.4.1 | Public sources only, and the line we do not cros | 64 | 50 | KEEP | - |  |
| 6.5 | If it becomes a delegate primary | 151 | 50 | SUM | - |  |

### `annex-evidence` — 452 words now → 264 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 39 | 39 | KEEP | - |  |
| A.1.1 | Every figure carries its provenance | 57 | 57 | KEEP | - |  |
| A.1.2 | The three source tiers | 136 | 60 | MATRIX | TierLegend (new): three tier cards; the same legend the X1 badges open | This is the key every tier badge points at; keep all wording. |
| A.1.3 | When two sources disagree | 48 | 48 | KEEP | - |  |
| A.1.4 | The standard applied to our own measurement | 172 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |

### `annex-county` — 976 words now → 329 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 39 | 39 | KEEP | - |  |
| B.1 | The 40-ward register | 192 | 30 | REUSE CUT | WardCartogram (existing) + sortable ward table | The 40-ward bullet list is the data behind the cartogram; render as a sortable table (constituency, ward, voters) in a disclosure and cut the bullets. |
| B.2 | County money and the audit record | 139 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| B.3 | Drought, food security and climate pressure | 90 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| B.4 | Mui Basin coal and the displaced communities | 69 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| B.5 | Each rival, and the legal ground to be careful o | 447 | 80 | CARDS | CompetitorFieldPanel (existing, mounted) | Check the panel already carries each rival; then fold the bullets. Retire the derived checklist. |

### `annex-messages` — 875 words now → 151 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 105 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| C.1 | Message assignment by segment | 759 | 80 | MATRIX | Message grid kept; intro callout trimmed |  |
| C.2 | Message assignment by channel | 11 | 11 | KEEP | - |  |

### `annex-cadence` — 228 words now → 89 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 28 | 28 | KEEP | - |  |
| D.1 | Cadence and the meeting rhythm | 179 | 40 | REUSE | link to the 4.1.1 WeekStrip | Meeting table stays. |
| D.2 | The escalation path | 21 | 21 | KEEP | - |  |

### `annex-runbooks` — 1,089 words now → 544 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 40 | 40 | KEEP | - |  |
| E.1 | The four-tier response decision tree | 22 | 22 | KEEP | - |  |
| E.2 | Response times, by channel | 2 | 2 | KEEP | - |  |
| E.3 | Holding positions, pre-drafted | 20 | 20 | KEEP | - |  |
| E.4 | Monitoring tools | 85 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| E.5 | Rapid-response protocol and pre-approved message | 100 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| E.6 | Red-team drills | 242 | 60 | MATRIX | Drill table kept | Scenario numbering 1,2,3,4,5,7 is left as found (open item). |
| E.7 | The threat model | 104 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| E.8 | Account security baseline | 146 | 40 | CARDS | Security baseline ChecklistGrid |  |
| E.9 | Phishing awareness | 76 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| E.10 | The incident response plan | 128 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| E.12 | Competitive intelligence outputs and rapid alert | 124 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |

### `annex-terms` — 137 words now → 137 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| F.1 | Confidentiality and use | 137 | 137 | KEEP | - | Terms of use: never summarised. |

### `annex-spec` — 2,213 words now → 358 on load

| § | Section | Now | Target | Treatment | Visual | Instruction |
|---|---|---:|---:|---|---|---|
| (intro) | intro | 38 | 38 | KEEP | - |  |
| G.1 | Platform playbooks | 358 | 80 | CARDS | PlatformCard ×n | Platform playbooks share fields → cards. |
| G.2 | Formats, copy samples and USSD pointer | 245 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| G.3 | Volunteer programme reference | 305 | 60 | SUM | - | Default rule: lead of ≤ 2 sentences drawn from the passage; rest folded. |
| G.4 | Technology reference architecture | 828 | 60 | MATRIX | tech-stack, fig-5-2-4-stack + textversion (existing) | The figure is the wordiest on the site (934 words). Slim it: component, tool, risk level, status visible; the rest in the row disclosure. Three [CHECK REF] hidden. |
| G.5 | Voter model: data sources and variable dictionar | 439 | 60 | MATRIX | Variable dictionary as sortable table | Retire the derived checklist. |
