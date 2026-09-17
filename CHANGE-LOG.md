# Change log — the repositioning, and the public data pack (September 2026)

**Both baselines move to `90a1f32`.** This is a client-instructed content change, the same class of
event as the `5470756` consolidation and the `5ff79ce` excision already recorded below — the
document's author changing their own proposal, not a redesign quietly editing a document of record.
Every change is enumerated here first, which is the obligation that comes with moving a baseline.

To diff against earlier states: `CONTENT_BASELINE=6ffd6a9` for the pre-repositioning text,
`5470756` for pre-excision, `d1c1559` for the text as first written. `FIGURE_BASELINE=f6b0af4`
likewise.

## 1. What changed, and why

The site pitched Firefly as the team that would **build and run** the whole digital operation —
fourteen workstreams, an org chart placing the Firefly director above content, paid media and 40
ward champions. Dr. Mulu already has a verified page, 745 posts and a team publishing daily, so
that pitch misread his situation. The engagement is now **Analyse → Strategise → Direct**: Firefly
analyses, defines and directs; his team keeps publishing; Firefly operates only the offline layer
it already holds.

## 2. Routes added

| Route | Section | Content |
|---|---|---|
| `/presence` | **§1A** | The Existing Presence Audit — ninety days of his own channels: metrics, window, method, decision rules, the channels already found, and six profile-hygiene fixes |
| `/engine` | **§6A** | The content engine — four production pillars anchored on his own cover line, and one week of output before and after |

Section numbering now admits a letter suffix (`1A.2.1`, `6A.1.1`), matching the route labels the
document already used (3A, 8A). Seven regexes were extended in lockstep — `lib/heading-slug.ts`,
`lib/collapse-groups.ts`, `components/markdown/HighlightedText.tsx`, and four guards — and slugs
are now lowercased so `1A.4` yields `presence-sec-1a-4`. No existing id moves.

## 3. Sections materially rewritten

| § | Change |
|---|---|
| **0** | New ask: one week and one export, not a fourteen-workstream sprint. §0.3 now states the 6 / 6 / 2 ownership split |
| **1.1–1.2** | Re-dated to September 2026; addressed to Dr. Mulu personally; states that Firefly holds no publishing credentials |
| **2.1** | The "comprehensive digital campaign apparatus" paragraph replaced with the three-step engagement |
| **8.0** | Retitled; "What Firefly runs" column replaced with **Owner** — six Firefly, six team-directed, two out of scope. Publishing to owned accounts, team replacement, volunteer organising and the existing tech estate added to what is outside scope |
| **8.2–8.15** | Owner note at the head of every workstream. §8.10 becomes "What Firefly operates"; §8.11 and most of §8.14 move out of scope |
| **9.1.1–9.1.2** | Phases re-cut as weeks from signature; the Week 1 audit promoted out to §1A; account hardening reframed as a Firefly-specified standard your team applies |
| **10.1** | Levels re-denominated in **depth of intelligence**, not volume of output |
| **10.2** | **Produced by** column added to every deliverable row |
| **11.2.0** | New: indicators R-01 to R-05, anchored on recognition and persuasion in the deficit sub-counties |
| **12.1** | §12.1.2 "What Firefly runs" deleted; replaced with the weekly direction model and a RACI table. §12.3 approvals now name three parties and a publisher |
| **12.5** | Controllership stated channel by channel; inherited lists barred until consent is evidenced; NG-CDF beneficiary data barred outright; the audit's own processing brought inside the §12.5.5 gate |
| **13.0** | R6 added: what happens when Firefly's brief and the team's judgement disagree |
| **14.1–14.7** | Two-column team model replaces the org chart; community-manager and video-editor surge roles removed; **§14.7 added** — how the existing team is assessed and upskilled |
| **15.1–15.3** | Read-only analytics access added as a gating dependency; four assumptions added about the existing team and accounts; eight data requests added |
| **16** | Second ask removed; the fixed 30 September date replaced with the window that actually sets the pace |
| **Annex A** | §3.2.4 added: the evidence standard applied to the audit's own measurement |
| **Annex D** | The campaign's four-forum governance chart cut — it scheduled the candidate's war room and a finance officer's invoice clearances, neither of which is Firefly's to set |

## 4. The public data pack, integrated

| Finding | Where it landed |
|---|---|
| **Party renamed to Wiper Patriotic Front (WPF)** by ORPP certificate, August 2025 (T1) | Site-wide; note at §3.1.1; chrome in `ClientPage.tsx` |
| **Politrack Africa, 12 Mar 2026** (n = 2,927): Mulu 26.2%, Kasalu 35.2%, gap 9.0 pts | §3.1.5 — a three-row table across two houses, explicitly **not** drawn as one trend line |
| **The seat is open** — Malombe term-limited under Art. 180(7) | §3.1.5 |
| **Register grew**: +61,839 in the 2026 ECVR drive; 605,703 reported (T3, unverified) | §3.4.1 — `≈200,000` restated as a **floor**; `≈225,000` shown as [CALC] |
| **Bulk political SMS is English or Kiswahili only**, with 48-hour operator lodging (CA/NCIC, T1) | §8.10.2 rewritten; propagated to eight other files. Kikamba moves to radio, WhatsApp voice, USSD and in person. Same-day SMS rapid response removed as impossible |
| **ODPC bars reuse of public-programme data** for political mobilisation (T1, 2025) | §12.5.2 — NG-CDF bursary and beneficiary lists ruled off-limits; §15.1 narrowed to the *project record* |
| **Kitui is last in Kenya for basic drinking water — 21%** (KDHS 2022, T1); 7.2 km trekking, Feb 2026 (NDMA, T1) | §6.3 theme 1 |
| **55.2% poverty (~637,000 people); food is 72.5% of household spending** | §6.3 theme 2 — the number behind "From Poverty to Wealth Creation" |
| **KESTA**, the county's own FY2026/27 theme, prioritises household income; envelope split 84.3% / 8.1% / 7.5% | §6.3 theme 3 |
| **Radio frequencies and two missing stations** (County FM, KBC Mwatu FM) | `data/media-ownership.ts` + a frequency column in the rendered table |
| **@MakaliMulu confirmed; NG-CDF site is a proof-point library** | §1A.2.4 |
| **Six profile-hygiene fixes** — wrong MP start date, two garbled employer entries, Nairobi as current city, missing PhD, "Incoming Governor" | §1A.2.5 |
| **Home base is contested; Kitui East and South have non-WPF MPs** (140,749 voters, 26.4%) | §3.1.5a |
| Eleven sources added, tiered | `data/sources.ts` |

## 5. Figures that left public/content/, and why

Five deliberate removals, none of them a loss of evidence:

| Figure | Why it went |
|---|---|
| `483`, `77`, `22,340` | The USSD shortcode and SMS sender ID. **Neither is provisioned to this campaign** (§15.1), so printing them as live was a factual error in a document whose argument is provenance. Now `*[shortcode]#` and `[Insert sender ID]` everywhere, including `lib/phone-showcase.ts` |
| `20,000` | "Engaged followers" — a Phase −1 KPI that §11.2.3 rejects as a vanity metric two sections later. Replaced by R-02, reach share in the deficit pool |
| `150` | The second community manager's surge threshold. That role is your team's, not Firefly's (§14.4) |
| `14.3`, `14.4`, `14.5` | Never figures. Bare section numbers in §14.3's prose, now written as "Section 14.x" and correctly normalised away as references |

## 6. Figures added

The Politrack round (26.2 / 35.2 / 18.8 / 18.6 / 0.6, n = 2,927), the Mizani August undecided
(6.0%), the 2026 register (605,703 and +61,839, both T3), the [CALC] threshold (≈225,000), water
(21%, 7.2 km), poverty (55.2%, ~637,000, 72.5%), the fiscal split (11.64bn / 1.12bn / 1.04bn /
84.3% / 8.1% / 7.5%), radio frequencies, and 140,749 non-WPF-MP voters.

## 7. Guards

`verify-mounts`, `verify-deep-links`, `visual-coverage` and `verify-figures` all pass unchanged in
intent; their TABS maps gained the two new routes and their id builders were lowercased to match
`lib/heading-slug.ts`. `verify-figures` caught the sender ID left stranded in
`lib/phone-showcase.ts` after the content placeholder went in — which is the guard doing exactly
its job.

---

# Change log — annexes, split routes, and the last of the spec (September 2026)

Content baseline moves to `6ffd6a9`. This entry covers the annex restructure and the four
content additions; the ASCII and spec-status work after it changed no content.

## 1. Routes

`situation.md` was a 59-minute route holding seven unrelated subjects. It is now three, and the
material that supports the argument rather than making it is behind five annexes.

| Route | Section numbers | From |
|---|---|---|
| `/situation` | §3.1, §3.3.1–3.3.6 | — (kept) |
| `/arithmetic` | §3.4, §3.5 | `situation.md` |
| `/reach` | §3.6, §3.7 | `situation.md` |
| `/annex-evidence` — Annex A | §3.2 | `situation.md` |
| `/annex-county` — Annex B | §3.3.7–3.3.10 | `situation.md` |
| `/annex-messages` — Annex C | §7.1.2, §7.1.3 | `messaging.md` |
| `/annex-cadence` — Annex D | §12.2, §12.4 | `governance.md` |
| `/annex-runbooks` — Annex E | §13.1.2–13.1.4, §13.2.2–13.2.4, §13.3.1–13.3.4, §13.4.2–13.4.3 | `risk.md` |

**Section numbers did not change.** A route is a container — which is how §8A–8D already worked —
so §3.4 is still §3.4 wherever it is served from.

**Every in-document cross-reference kept working with no edit.** `SectionNumberMap` resolves
in-prose "Section N.N" by number against the generated index, so the 173 cross-references in the
document followed their targets automatically. That design decision, made before this work, is
what made a seven-route move cheap.

**Deep links:** 43 new redirects, plus **152 existing redirect values repointed** — older entries
still aimed at `risk-sec-13-3-2` and its neighbours, which are now in Annex E. The deep-link guard
found every one. 880 legacy ids and 252 live ids resolve.

Each section that lost content carries a pointer to where it went, so the gap between §13.1.1 and
§13.1.5 reads as a move and not a hole.

## 2. Content added

| § | What | Why |
|---|---|---|
| **5.0** | The voter universes — voter, turnout, victory, base-hold, persuasion, mobilisation, soft opposition | Repairs the Objective → Audience break. §4's objectives are about universes; §5's segments are about people; nothing joined them |
| **13.0** | A five-row risk register | Repairs the Risk → Decision break. 514 lines of risk content had no summary a principal could read |
| **6.3** | Tier and source on all seven theme statistics | Three are established nowhere in the proposal and now say so |
| **11.2.3** | "Over 60% of social media interactions" withdrawn | No source in this proposal supports it. The claim keeps its shape and is marked Evidence required |

**Three universe sizes are deliberately left as `[VERIFIED FIGURE REQUIRED]`.** A register count is
the ceiling on a universe, never its size. §3.4.6 already records ward-level recognition as a named
data gap and §9.1.1 commits to measuring it in Week 1; estimating it here would be the exact
failure §3.2.3 forbids.

## 3. Other corrections

- The five orphan "IEBC ceiling" references now read "the agreed envelope". The spend ceiling was
  excised at the campaign's instruction; the referring sites had outlived it.
- The chrome counts **16 sections · 5 annexes**, derived, rather than folding either into the
  other. §1.3 now describes the annexes.

## 4. ASCII blocks (no content change)

`lib/ascii-diagram.ts` gained a banner parse. Six blocks were a single line of text inside a rule
box; every other parse rejected them, so they rendered as drawings — scaled to fit a phone, which
makes a heading about three pixels tall and puts a zoom control under it. They are now set as
text. **38 of 66 box-drawing blocks now upgrade to real layout, up from 32.** The remaining 28 are
genuine diagrams — flowcharts, architectures, an org chart — where scale-to-fit is correct.

## 5. Content diff

21 body lines removed, every one deliberately rewritten and listed in §2 and §3 above. 77 added.
**The moves themselves are invisible to the multiset compare**, which is both the property that
made this safe and the proof that no moved line was lost.

## 6. Guard state

```
ward register      532,758 across 40 wards            ✓
figures            every UI literal traces to source  ✓
figure retention   1,047 figures, 551 in content      ✓
content integrity  baseline 6ffd6a9                   ✓
mounts             39 mount points, 252 headings      ✓
deep links         880 legacy + 252 live ids          ✓
visual coverage    252 sections                       ✓
build / typecheck / lint                              ✓
```

---

# Change log — the UX pass (September 2026)

Applies §11 of `DR-MAKALI-PROPOSAL-REDESIGN-SPEC.md`. Content baseline moves to `6293c1c`.

## Already built — checked, not redone

| Spec item | State |
|---|---|
| 14 — ASCII KPI scorecards → component | Already done. `MarkdownViewer` intercepts the two banner blocks and renders `KpiScorecards` from `data/kpis.ts` |
| 31 — wide tables → stacked cards under 768px | Already done. `InteractiveTable` renders a card-stacked key/value view on mobile, and deliberately renders only one of the two |
| 32 — evidence-required token | Already done. `ClaimBadge` carries `unmeasured` — "Not yet measured" |
| 25 — grouped navigation | Already done. `MobileTOCModal` filters by part |

## Changed

| Area | Before | After |
|---|---|---|
| `Dashboard` | Two full copies of the metric set (`hidden sm:grid` + `block sm:hidden`), both shipped to every phone; mobile copy truncated label and source line | One tree: snapping rail on a phone, grid from `sm`. No truncation. Figures `text-2xl` → `text-3xl` |
| Nav labels | Four labels 35–43 chars, all opening `"Scope of work — "`, truncating to the shared prefix | Longest label 26 chars; the prefix lives once, in the part label |
| `DeficitGauge` surface | `SpotlightCard` — pointer-tracked light across a 15.3-point deficit | Flat bordered card. Treated surfaces reserved for the ask and the commitments |
| Takeaway boxes | 13 ASCII blocks, 84–93 chars wide, each restating adjacent prose | 12 deleted; §3.6.3's converted to a table — it carried the digital ceiling, radio/SMS reach and the 82/18 weighting |
| `audiences.md` §5.2 | Six segments presented as a partition, summing to ~2× the register, with two denominators unlabelled | States that they overlap and do not sum, and names which base each percentage uses |

## Content diff

97 body lines removed — **every one a takeaway-box interior**. 18 added: the §5.2 note and the
§3.6.3 table. Enumerated via `CONTENT_DUMP` before the baseline moved.

## A defect the guard found in itself

`verify-figure-retention.mjs` refused the takeaway deletions, reporting `220k` and `420k` lost.
Both were notation, not loss: `220,000` and `420,000` are in content. The guard had been treating
`k` as an opaque unit. Magnitude suffixes (`k`, `m`, `bn`, `million`, `billion`) now fold into the
value; `%` is the only true unit left. Distinct-figure count falls 1,097 → **1,047** as forms
merge, which is the more accurate count.

Re-tested afterwards, because a guard that stops failing is worth checking:

| Test | Result |
|---|---|
| Delete a figure unique to content (`191,317`) | **Caught** |
| Move a content figure into a component (`186,132`) | **Caught** — the print-reach rule |
| Delete a figure that exists in three other content files | Passed, correctly — the rule is corpus-wide, not per-file |

---

# Change log — the P0 redesign (September 2026)

This entry records the P0 items from `DR-MAKALI-PROPOSAL-REDESIGN-SPEC.md`. It is the audit
trail the content-integrity baseline move depends on: every body line that differs from the
previous baseline `a275e00` is enumerated below, and each is an edit made on purpose.

**The governing constraint was that no figure may be removed.** Length comes out of prose. That
is now enforced mechanically rather than promised — see §0 below.

---

## 0. New build guard: figure retention

`scripts/verify-figure-retention.mjs` enumerates every quantity in `public/content/`, `data/`,
`components/` and `lib/` at a baseline commit, and fails the build if one disappears. Two rules:

1. **Retention** — a figure present at the baseline must still exist somewhere.
2. **Print reach** — a figure that was in `public/content/` must still be in `public/content/`,
   or be declared in `scripts/figure-migrations.json` with the place it went.

Rule 2 exists because rule 1 is not enough. Much of the landing route is `print:hidden`, so a
figure that moves from markdown into a component can satisfy rule 1 while vanishing from every
printed copy. Baseline: **1,097 distinct figures, 576 of them in content.** Both counts hold.

## 1. Content changes, enumerated

Twenty body lines differ from `a275e00`. Each is listed with why.

| # | File | Change | Why |
|---|---|---|---|
| 1 | `nextsteps.md` | Decision target `15 September 2026` → `30 September 2026`, with the compression stated | The date had all but lapsed; a live proposal carrying a spent deadline reads as abandoned |
| 2 | `summary.md` §2.2 | "prior to the final quarter of 2026" → "within the final quarter of 2026 — late October to November" | Contradiction C1 |
| 3 | `summary.md` §2.3 | "expected before the final quarter" → "expected in the final quarter … (Tier 3)" | Contradiction C1 |
| 4 | `roadmap.md` §9.1.1 | "before the final quarter of 2026" → "within the final quarter of 2026" | Contradiction C1 |
| 5 | `assumptions.md` §15.3(2) | Assumption restated as Q4, with the reconciliation and the Tier 3 flag recorded | Contradiction C1 |
| 6–9 | `deliverables.md` §10.1.1–10.1.2 | "3-person core" → "3-person **Firefly** core" (×4) | Contradiction C2 |
| 10 | `structure.md` §14.1 | New paragraph distinguishing the campaign's four-person command from Firefly's three-person delivery core | Contradiction C2 |
| 11–18 | `roadmap.md` §9.1 | Reach, follower and viral-view rows marked `°`; a new note defines them as operational diagnostics, not performance indicators | Contradiction C3 |
| 19 | `deliverables.md` §10.1.2 | New row: digital ad share of the agreed spend envelope, 15–20 / 30–40 / 45–55% | Figure rescue — see §2 |
| 20 | `measurement.md` §11.1.3 | Cross-reference §3.3.3 → §11.2.3 | §3.3.3 is "The 2022 baseline, ward by ward"; the vanity-metric doctrine is §11.2.3 |

**Every target figure in the roadmap tables is retained.** C3 was resolved by correcting what the
document *claims* those numbers are, not by deleting them.

### Two new content files

| File | § | What it is |
|---|---|---|
| `decision.md` | §0 | The ask, the cost of delay, the scope in one paragraph, the dependencies, and the identification block. 815 words |
| `scope.md` | §8.0 | All fourteen workstreams on one page, grouped by function, **and what is outside scope** — a boundary §2.4 promised and the document never drew. 779 words |

**On the numbering.** These are §0 and §8.0 because the document was already numbered 1–16 with
241 headings hanging off it. Numbering the decision route "1" would have renumbered every section
after it, invalidated 837 legacy deep links, and rewritten every cross-reference in 52,000 words
to move one page to the front. §0 reads correctly as the page before the proposal starts.

## 2. Figures rescued rather than lost

Three deletions proposed by the first draft of the spec would each have destroyed a figure. All
three were caught by re-checking every DELETE against the whole repository, and all three were
changed:

| Figure | Was only in | Now |
|---|---|---|
| Ad-budget shares 15–20 / 30–40 / 45–55% | `DataVisualizations.tsx`, hard-coded as "% of verified ceiling" | `deliverables.md` §10.1.2 and `data/tier-matrix.ts`, migrated **before** the component was deleted |
| June/August polling rounds, in print | `summary.md` §2.2's table — `DeficitGauge` was inside a `print:hidden` wrapper | Table kept; the wrapper fixed so the gauge prints too |
| `36.2%` digital ceiling, and the 82/18 channel split | `situation.md` §3.6.3's "STRATEGIC TAKEAWAY" box | Untouched. The box is scheduled for conversion to a table (P1), not deletion |

## 3. Code changes

| File | Change |
|---|---|
| `app/[[...slug]]/page.tsx` | `LANDING` = `decision`; `decision.md` and `scope.md` registered |
| `lib/heading-slug.ts` | `SECTIONS` gains `decision` (part 0) and `scope` (part 8); `PARTS` gains part 0 |
| `components/ClientPage.tsx` | `print:hidden` moved off the gauge wrapper onto `HeroVisual`; the whole figure stack moved from above the document to below it; `"Budget tiers"` → `"Scope levels"`; `DataVisualizations` removed |
| `components/DecisionPanel.tsx` | Resynced to `assumptions.md` §15.1: the excised expenditure-ceiling dependency dropped, "budget tier" → "service level", "compliance reviewer" → "data-protection reviewer" |
| `components/Dashboard.tsx` | Poll card removed — third rendering of figures `DeficitGauge` carries in full on the same page |
| `components/AskButton.tsx` | **New.** The ask, carried in the sticky bar and the mobile dock, on every route but its own |
| `components/DataVisualizations.tsx` | **Deleted.** One panel duplicated the polling figures a fourth time; the other put a budget slider on the landing page of a document whose §1.2 says commercial terms appear nowhere |
| `scripts/verify-figure-retention.mjs` | **New.** See §0 |
| `scripts/verify-mounts.mjs`, `verify-deep-links.mjs`, `visual-coverage.mjs` | Two new routes registered |

## 4. Guard state after the change

```
ward register      532,758 across 40 wards            ✓
figures            every UI literal traces to source  ✓
figure retention   1,097 figures, 576 in content      ✓  (new)
content integrity  baseline moved to this commit      ✓
mounts             39 mount points, 250 headings      ✓
deep links         837 legacy + 250 live ids          ✓
visual coverage    250 sections                       ✓
typecheck / lint   clean                              ✓
```

## 5. Still open — these need a decision, not an edit

| Item | Where | Who decides |
|---|---|---|
| **The 30 September decision date** is Firefly's to confirm against its own presentation plan | `nextsteps.md` §16.1 | Firefly |
| **The nomination window** was resolved toward Q4 because the document's operational detail already said Q4. It remains **Tier 3** and unconfirmed by Wiper | `summary.md`, `assumptions.md`, `roadmap.md` | Campaign, against §3.1.2's verification test |
| **The spend envelope** the ad shares attach to | `deliverables.md` §10.1.2 | Agreed at contracting |
| **`[CAMPAIGN DECISION REQUIRED]`** in the exclusions list | `scope.md` §8.0.2 | Campaign, before contracting |

---

# Change log — the sixteen-section restructure

The proposal's substance is unchanged. Its architecture is not.

Before this change the document ran over nine routes whose reading order and printed numbering
disagreed with each other: the first route opened at §0.1 and then jumped to §9.1, §8.1, §7.1,
§0.2, §9.2, §9.3. Related material sat apart — the objectives in one place and the scorecards
that measure them in another, the team in one section and the governance around it in a second,
the segments in the evidence part and the messages assigned to them two parts later. Headings
were descriptive ("What the campaign gets", "Watching the other campaigns") where proposal
convention is standard ("Strategic objectives", "Competitor monitoring").

The document is now in **sixteen canonical sections, numbered 1 to 16 in reading order**, served
over nineteen routes. Section 8, the scope of work, is the only section split across more than
one route: its fourteen workstreams run to 18,000 words, and one route for all of them would be
four times the weight of the next heaviest page.

Everything below is the record of what moved, what merged, what was written new, and what was
cut.

---

## 1. Restructure map

| New § | New section title | Source blocks (file + old heading) | Action |
|---|---|---|---|
| 1.1 | Proposal identification | `1-decision.md` front matter (title block, untitled) | retitled — given a numbered heading for the first time |
| 1.2 | Confidentiality and use | — | **new** |
| 1.3 | How this proposal is structured | — | **new** |
| 2.1 | The mandate | `1-decision.md` front matter (two opening paragraphs) + §0.2 "What Firefly would run, and the credential it builds on" | merged, retitled |
| 2.2 | The governing constraint | `1-decision.md` §0.1 "The bottleneck is the nomination, not the election" | moved, retitled |
| 2.3 | The operating conditions | `1-decision.md` §0.3 "Three realities the campaign has to work inside" | moved, retitled |
| 2.4 | What this proposal commits to | — | **new** |
| 3.1 | The nomination contest and its selection mechanism | `2-evidence.md` §1.1 "The nomination, and how it will be decided" | moved, retitled, split (§6.1.2–6.1.4 out) |
| 3.2 | Evidence standard: provenance and source tiers | `2-evidence.md` §6.1.2, §6.1.3, §6.1.4 | split out, promoted to a sub-section of its own |
| 3.3 | The candidate and the county | `2-evidence.md` §1.2 | moved |
| 3.4 | The vote arithmetic | `2-evidence.md` §1.3 "The arithmetic of winning" | moved, retitled |
| 3.5 | The county's three regions | `2-evidence.md` §1.4 | moved |
| 3.6 | Channel reach and the digital ceiling | `2-evidence.md` §3.1 "The two-tier channel architecture" | moved, retitled |
| 3.7 | Media ownership and access to air | `2-evidence.md` §3.4 "Earned media and the radio landscape" | moved, retitled |
| 4.1–4.2 | Objectives for the nomination window / for the general election | `1-decision.md` §9.1 "What the campaign gets" (§9.1.1, §9.1.2) | moved, retitled, promoted — the two children became sub-sections and the five commitments beneath them became numbered parts |
| 5.1–5.3 | The six voter segments / Segment sizing / Segment research still outstanding | `2-evidence.md` §2.4 "Who we are talking to" (§2.4.1–2.4.3) | moved, retitled, promoted |
| 6.1 | The governing claim: the Economist Governor | `3-strategy.md` §2.1 | moved, retitled |
| 6.2 | The four strategic pillars | `3-strategy.md` §2.2 "The four campaign pillars" | moved, retitled |
| 6.3 | The six campaign themes | `3-strategy.md` §2.3 | moved |
| 7.1 | The narrative spine and message architecture | `3-strategy.md` §2.6 "Message architecture" | moved, retitled |
| 7.1.2 | Message assignment by segment | `3-strategy.md` §2.6.2 "What we say to each segment" **+ §2.5 "Voter segments and the messaging framework"** | **merged** |
| 7.2 | Persuasion principles and message discipline | `3-strategy.md` §2.8 "Behavioural science and persuasion" | moved, retitled |
| 7.3 | Language, register and dialect | `4a-publishing.md` §3.6 "Working in three languages" | moved, retitled |
| 8.1 | Scope summary and workstream boundaries | `1-decision.md` §7.1 "The scope of work" | moved, retitled |
| 8.2 | Workstream 1 — Owned platforms and the service-delivery tracker | `3-strategy.md` §8.5 | moved, retitled |
| 8.3 | Workstream 2 — Content production and asset governance | `4a-publishing.md` §2.7 | moved, retitled |
| 8.4 | Workstream 3 — AI-assisted creative and testing | `4a-publishing.md` §2.9 | moved, retitled |
| 8.5 | Workstream 4 — Accessibility and inclusion | `3-strategy.md` §3.7 | moved, retitled |
| 8.6 | Workstream 5 — Platform tactics and paid media | `4a-publishing.md` §3.2 "Platform tactics" | moved, retitled, split (§3.4.3–3.4.4 out) |
| 8.7 | Workstream 6 — Earned media, journalists and debates | `4a-publishing.md` §3.5 **+ §3.4.3, §3.4.4** (which sat under Platform tactics) | merged, retitled |
| 8.8 | Workstream 7 — Ground-digital integration | `4b-ground.md` §4.1 "Field and digital, working as one" | moved, retitled |
| 8.9 | Workstream 8 — The field-to-digital loop | `4b-ground.md` §4.2 | moved, retitled |
| 8.10 | Workstream 9 — Offline reach: SMS, USSD and voice | `4b-ground.md` §4.3 "SMS, USSD and the offline majority" | moved, retitled |
| 8.11 | Workstream 10 — Digital organising and volunteers | `4b-ground.md` §4.4 | moved, retitled |
| 8.12 | Workstream 11 — The data layer | `4d-technology.md` §6.1 | moved, retitled, split (§6.1.6 out) |
| 8.13 | Workstream 12 — Predictive voter modelling | `4d-technology.md` §6.2 | moved, retitled |
| 8.14 | Workstream 13 — The technology stack | `4d-technology.md` §6.3 | moved, retitled |
| 8.15 | Workstream 14 — Analytics and attribution | `4d-technology.md` §6.4 | moved, retitled |
| 9.1 | Phasing, from engagement to the election period | `5-delivery.md` §8.3 "The phased plan" | moved, retitled |
| 9.2 | Coalition and endorsement sequencing | `4b-ground.md` §4.5 "The coalition and endorsement calendar" | moved, retitled |
| 10.1 | Scope levels and what each carries | `1-decision.md` §9.2 "Service levels" (§9.2.5, §9.2.6) | moved, retitled |
| 10.2 | The deliverables schedule | — | **new** |
| 11.1 | The headline scorecards | `1-decision.md` §8.1 (incl. §8.2.3) | moved |
| 11.2 | Indicators, and why these | `5-delivery.md` §8.2 "What we measure, and why" | moved, retitled |
| 11.3 | The Kitui message lab | `5-delivery.md` §8.4 | moved |
| 12.1 | The engagement model and operating rhythm | `1-decision.md` §9.3 "Working together, and what happens next" (§9.3.1, §9.3.3) | moved, retitled, split (§9.3.2 → §15.1, §9.3.4 → §16.2) |
| 12.2 | Cadence and the meeting rhythm | `4e-team.md` §7.2.5 "Operating cadence" **+ §7.3.4 "The meeting cadence"** | **merged**, promoted |
| 12.3 | Decision rights and content approval | `4e-team.md` §7.2.6 "Who signs off on content" | moved, retitled, promoted |
| 12.4 | The escalation path | `4e-team.md` §7.3.3 "How disagreements escalate" | moved, retitled, promoted |
| 12.5 | Data ethics, privacy and the data charter | `3-strategy.md` §6.5 "Ethics, privacy and the data charter" | moved, retitled |
| 13.1 | Rapid-response protocol and opposition handling | `4c-defence.md` §5.1 "Rapid response and opposition handling" | moved, retitled |
| 13.2 | The digital war room | `4c-defence.md` §5.2 | moved |
| 13.3 | Cybersecurity and manipulated media | `4c-defence.md` §5.3 | moved |
| 13.4 | Competitor monitoring | `4c-defence.md` §5.4 "Watching the other campaigns" | moved, retitled |
| 13.5 | Statutory and regulatory compliance | `2-evidence.md` §6.6 | moved |
| 14.1 | The lean core delivery model | `4e-team.md` §7.3 intro + §7.3.1 "Why the delivery model is lean" | moved, retitled, promoted |
| 14.2 | A lean core with a defined surge | `4e-team.md` §7.2 intro + §7.2.1 | moved, promoted |
| 14.3 | The core team, retained throughout | `4e-team.md` §7.2.2 | moved, promoted |
| 14.4 | Surge roles, activated by phase and scope level | `4e-team.md` §7.2.3 "Surge roles, activated by phase and service level" | moved, retitled, promoted |
| 14.5 | Leadership roles and who owns what | `4e-team.md` §7.3.2 "Core leadership roles and who owns what" | moved, retitled, promoted |
| 14.6 | Reporting lines | `4e-team.md` §7.2.4 | moved, promoted |
| 15.1 | What the campaign must provide | `1-decision.md` §9.3.2 "What Firefly needs from the campaign" | moved, retitled, promoted |
| 15.2 | Regulatory guidance still outstanding | `4d-technology.md` §6.1.6 "The ODPC guidance we are still waiting on" | moved, retitled, promoted |
| 15.3 | Assumptions this proposal rests on | — | **new** |
| 16.1 | The decision in front of the campaign | `5-delivery.md` §8.6 | moved |
| 16.2 | The ask | `1-decision.md` §9.3.4 | moved, promoted |

**Nothing was dropped without being listed.** All 49 old sub-sections and all 180 old parts are
accounted for above or in section 5 below. The mapping is mechanical and recorded: 229 old
heading numbers, 229 deep-link ids, and 221 in-prose cross-references were remapped by script,
and `scripts/verify-deep-links.mjs` proves that all 837 legacy ids still resolve.

---

## 2. Merges

**§2.5 "Voter segments and the messaging framework" into §7.1.2 "Message assignment by segment".**
Two tables assigned messages to segments — one in §2.5 and one in §2.6.2 — with a 200-word
reconciliation between them explaining why their row names differed. Holding the same
assignment in two places, in two sections, is the fault the reconciliation was written to
survive. They are now one sub-section; the reconciliation is kept verbatim because the two cuts
of the electorate it explains are both still there.

**§3.4.3 and §3.4.4 into §8.7 "Earned media, journalists and debates".** These two parts
("Getting on air around a hostile gatekeeper", "How we pitch: evidence first") sat under
§3.2 Platform tactics, which is paid media. They are earned-media method and now sit with it.

**§6.1.2–6.1.4 out of the nomination section and into §3.2 "Evidence standard".** The provenance
rule, the three source tiers and the disagreement procedure were parts of §1.1, a section about
how Wiper picks its candidate. They govern every figure in the document, so they are now a
sub-section of their own, cited from §1.3 and §15.3.

**§7.2.5 "Operating cadence" with §7.3.4 "The meeting cadence" into §12.2.** Two meeting
schedules, forty pages apart, in a document whose reader has to agree to one of them.

**§7.2 and §7.3 into one Delivery Structure (§14).** The team section and the leadership-roles
section described the same structure twice. Their structural parts are now §14.1–14.6 in one
run; their governance parts (cadence, sign-off, escalation) moved to §12, because governance is
what §12 is for.

**Front matter and §0.2 into §2.1 "The mandate".** The two paragraphs that opened the document
had no heading above them, which meant the section index could not see them and the table of
contents began at §0.1. They are now the opening of the executive summary.

---

## 3. Moves and renames

Every rename is in the map above. The resequencing reasons, grouped:

- **Objectives before evidence, not after it.** §9.1 → §4. The objectives were the last
  sub-section of the last part, after 38,000 words. Proposal convention states objectives
  immediately after the situation analysis, because they are the thing the rest of the document
  justifies.
- **Scope of work out of the decision layer.** §7.1 → §8.1, ahead of fourteen workstreams that
  were previously scattered across five separate parts (`2.7`, `2.9`, `3.2`, `3.5`, `3.7`,
  `4.1`–`4.4`, `6.1`–`6.4`, `8.5`). A reader could not answer "what exactly is being bought"
  without assembling it from five places. It is now one numbered section with defined
  boundaries.
- **Measurement out of two places into one.** §8.1 (scorecards, in the decision file) and §8.2
  (indicators, in the delivery file) were 30,000 words apart and measured the same objectives.
  Both are now §11, with the message lab (§8.4) beside them.
- **Governance out of three places into one.** The engagement rhythm (§9.3), the approval matrix
  (§7.2.6), the escalation path (§7.3.3) and the data charter (§6.5) now sit together as §12.
  Decision rights are the terms a principal reads before agreeing to anything.
- **Risk consolidated.** The four defence sub-sections and statutory compliance (§6.6, which was
  filed in the evidence part) are now §13.
- **Dependencies made a section rather than a sub-section.** "What Firefly needs from the
  campaign" (§9.3.2) was a part inside the closing section. It is now §15.1, because the
  conditions a proposal depends on are a section a principal expects to find.
- **Standard titles throughout.** "What the campaign gets" → "Strategic objectives"; "The
  arithmetic of winning" → "The vote arithmetic"; "Watching the other campaigns" → "Competitor
  monitoring"; "Service levels" → "Scope levels and what each carries"; "Behavioural science and
  persuasion" → "Persuasion principles and message discipline"; "The two-tier channel
  architecture" → "Channel reach and the digital ceiling"; "Working together, and what happens
  next" → split into an engagement model (§12.1) and an ask (§16.2).
- **Numbering rebuilt.** Sub-section numbers now run 1..n within their section with no gaps. The
  old numbering had §9.2.5 and §9.2.6 with no §9.2.1–4, §6.1.1 followed by §6.1.5, and parts
  numbered for a section they did not sit in (§8.2.3 under §8.1, §3.4.3 under §3.2, §6.1.2 under
  §1.1).

---

## 4. Additions

Five things were written for this restructure — four passages and one set of one-line section
ledes. Nothing else new entered the document. Each is quoted in full so it can be approved or
struck.

### 4.1 — §1.2 Confidentiality and use

> This proposal is submitted in confidence to Hon. Dr. Benson Makali Mulu and to those he
> authorises to review it. It sets out Firefly Management's analysis, method and proposed scope of
> work for the Kitui gubernatorial campaign, and is provided for the purpose of evaluating this
> engagement.
>
> It should not be circulated beyond the campaign's decision-making group, published, or disclosed
> to any third party — including any other aspirant, party organ or media house — without Firefly
> Management's written consent.
>
> Nothing in this document constitutes a binding commitment by either party. Commercial terms are
> settled separately and in person, and appear nowhere in these pages.

### 4.2 — §1.3 How this proposal is structured

> The proposal is in sixteen sections and is built to be read in order, but each section stands on
> its own.
>
> **Sections 2 to 5 establish the mandate and the terrain.** The executive summary states what
> Firefly would run and under what constraint; the situation analysis sets out the nomination
> contest, the candidate, the vote arithmetic, the county and the channels that reach it; the
> strategic objectives state what the digital function must achieve; the audience segmentation
> names the voters it must move.
>
> **Sections 6 and 7 state the approach.** The governing claim, the pillars and themes it rests on,
> and the message architecture that carries them into three languages.
>
> **Sections 8 to 11 are the work itself.** Fourteen numbered workstreams with defined boundaries,
> the phasing that sequences them, the deliverables each produces and at what cadence, and the
> indicators performance is judged against.
>
> **Sections 12 to 16 are the terms of engagement.** How Firefly and the campaign work together,
> what can go wrong and how it is handled, the shape of the delivery team, what this proposal
> assumes and needs, and the decision being asked for.
>
> Two conventions run throughout. Every factual claim carries a source and a confidence tier, set
> out in Section 3.2. Where a figure the campaign will need does not exist in any published source,
> it is marked as a named data gap rather than estimated, and Section 15.1 lists every open item in
> one place.

### 4.3 — §2.4 What this proposal commits to

> Firefly commits to a scope, a cadence and a standard. It does not commit to an electoral outcome,
> and no figure in this document should be read as one.
>
> **The scope** is the fourteen workstreams in Section 8, with their boundaries stated so that what
> is outside them is as clear as what is inside.
>
> **The cadence** is in Section 10: what is produced, how often, and in what form, at whichever
> scope level the campaign selects.
>
> **The standard** is in Sections 11 and 12: indicators that trace to either the nomination poll
> share or the vote threshold, reported on a fixed cycle to a single named campaign counterpart,
> with an escalation path that is agreed before it is needed rather than improvised under pressure.
>
> **The conditions** are in Section 15. This proposal depends on decisions and appointments that
> only the campaign can make, and it names them rather than assuming them.

### 4.4 — §10.2 The deliverables schedule

Every row of this table is a commitment already made elsewhere in the proposal; the table
consolidates them and cites where each is set. No cadence, format or deliverable in it is new.

> Every row below is set somewhere else in this proposal, in the workstream that produces it. This
> section consolidates them so the campaign can see the whole production commitment on one page
> rather than assembling it from nine sections. Where a cadence varies by scope level, Section 10.1
> governs; the cadence shown here is the one Level 2 carries.
>
> | Deliverable | Cadence | Form | Where it is set |
> |---|---|---|---|
> | Flagship video | 2–3 per week | Subtitled video, platform-native cuts | 10.1.1 |
> | Daily multilingual social | Daily | Post, graphic or short video in English, Kiswahili and Kikamba | 10.1.1, 8.3.4 |
> | Kikamba voice note | Weekly | Audio for WhatsApp and community networks | 10.1.1, 8.3.2 |
> | Facebook Live | Weekly | Live broadcast with moderated comments | 10.1.1 |
> | Kitui Economic Brief | Monthly | Plain-language explainer, print and digital | 10.1.1 |
> | "Dr. Mulu Explains" | Weekly | Explainer video or audio on county finance | 8.1.1 |
> | Production schedule | Weekly | Approved content calendar for the week ahead | 8.3.4 |
> | SMS touch to the consented list | Fortnightly, rising to a GOTV surge | 160-character Kikamba, Kiswahili or English SMS | 8.10.2, 10.1.1 |
> | USSD menu availability | Continuous once provisioned | Zero-rated interactive menu across all networks | 8.10.3 |
> | Ward coordinator field report | Daily | Structured report from all 40 wards into the CRM | 8.8.1 |
> | Creative test cycle | Weekly | A/B test results and the decisions taken from them | 8.4.3 |
> | Performance report | Monthly | Reach, engagement, sentiment, conversion, spend-weighting | 12.1.1 |
> | Sentiment report to leadership | Monthly | Written brief with ward-level detail | 8.1.2 |
> | Competitive brief | Monthly | Public-source summary of rival activity | 13.4.3 |
> | Tracking survey wave | Bi-weekly through the nomination window | Internal instrument, countywide and by zone | 4.1.1, 11.2.1 |
> | Focus groups | Quarterly | Facilitated sessions across the three zones | 11.3.1 |
> | Red-team drill | Quarterly | Simulated attack and a written after-action note | 13.2.4 |
> | Compliance review | Once, early, then on material change | Written opinion from the campaign's appointed reviewer | 12.5.5 |
> | Asset library deposit | Continuous | Originals with metadata retained, catalogued | 8.3.6, 12.1.1 |
>
> Three deliverables are gated on decisions the campaign has not yet made: the USSD menu cannot be
> provisioned until the shortcode is, the compliance review cannot start until the reviewer is
> appointed, and sign-language interpretation on flagship content depends on the interpreter or
> service named in Section 15.1. Each is listed there.

### 4.5 — §15.3 Assumptions this proposal rests on

Each numbered assumption restates a condition the document already relies on and cites where it
is established. None asserts a new fact.

> This proposal is built on the following assumptions. Each is stated so that if one fails, the
> campaign can see immediately what in the plan moves. None of them is a prediction, and none is
> presented as settled fact.
>
> 1. **The Wiper ticket is decided by opinion poll, not a delegates' contest.** This is reported
>    and not confirmed by the party (Tier 3; Section 3.1.2). If it becomes a delegate primary, the
>    targeting model changes from countywide name recognition to delegate arithmetic, and
>    Section 3.1.6 sets out what that would require.
>
> 2. **The decision falls before the final quarter of 2026.** Every deadline in Section 4.1 and the
>    Phase −1 sprint in Section 9.1.1 are set by that window. A later date lengthens the sprint; an
>    earlier one compresses it and forces the reallocation triggers in Section 4.1 sooner.
>
> 3. **The register and connectivity figures hold.** The 532,758 registered voters, the 86.4%
>    outside the internet-using population and the ward-level distribution in Section 3.4 are the
>    most recent published figures. The offline layer in Section 8.10 is sized against them.
>
> 4. **The campaign appoints the named roles.** The data-protection and electoral-law reviewer, the
>    qualitative research facilitator and the sign-language provider are campaign appointments, not
>    Firefly's. Section 15.1 lists them.
>
> 5. **The candidate is available to the production cycle.** The weekly Facebook Live, the
>    explainer series and the debate preparation in Section 8.7 assume scheduled candidate time.
>    Without it, the earned-media and owned-video commitments in Section 10.2 cannot hold at the
>    stated cadence.
>
> 6. **Telco and platform access is obtained on ordinary commercial terms.** The SMS aggregator,
>    the shortcode and the advertising platforms are assumed available to a compliant political
>    advertiser. Section 13.5 covers the compliance conditions; Section 15.2 covers the regulatory
>    guidance still outstanding.
>
> 7. **The engagement is embedded with the campaign.** Firefly works alongside the campaign's own
>    structure under Section 12, not at arm's length from it, and the ground-digital integration in
>    Section 8.8 assumes daily contact with the field operation.

### 4.6 — Sixteen orientation ledes, one per route

The old document carried a one-line lede at the head of each of its nine content files, styled as
the section's opening statement. Those nine described the retired nine-part grouping and are
removed (section 5.2). These replace them, one per route, and are what the cover's own promise —
"every one opens on what it is for" — refers to.

| Route | Lede |
|---|---|
| Cover | Who this proposal is for, who prepared it, the terms it is submitted under, and the order of the sixteen sections that follow. |
| Executive summary | The mandate, the constraint that governs it, the conditions the work operates inside, and what Firefly commits to — readable on its own, without the fourteen sections beneath it. |
| Situation analysis | The ground as it is: how the nomination will be decided, the evidence standard every figure here is held to, the candidate and the county, the ward arithmetic that sets the winning number, the three regions, what digital reach can and cannot deliver against it, and who controls the radio. |
| Strategic approach | The claim at the centre of this campaign, the four pillars it rests on, and the six themes that carry it into the county. |
| Messaging framework | The narrative spine, the message assigned to each segment and each channel, the answer to disinformation, the persuasion principles the campaign holds itself to, and the three languages every asset has to work in. |
| Scope — platforms and content | The boundaries of the engagement, then the first four workstreams: the owned platforms and the service-delivery tracker, content production, AI-assisted creative, and the accessibility standard that applies across all fourteen. |
| Scope — publishing and earned media | Two workstreams: paid media across the platforms that reach the connected minority, and earned media in a county whose Kamba-language radio is largely controlled by rivals. |
| Scope — ground and offline reach | Four workstreams that reach voters off the internet: ground-digital integration, the field-to-digital loop, the SMS, USSD and voice layer, and the volunteer programme behind them. |
| Scope — data and technology | Four workstreams that sit under the rest: the data model, the voter model built on it, the technology stack that runs both, and the analytics layer that measures what the other ten produce. |
| Implementation roadmap | The plan phase by phase, from the nomination sprint through to the election period, and the coalition and endorsement sequence set against it. |
| Deliverables schedule | What the campaign receives, at which scope level, how often, and in what form. |
| Measurement framework | The headline scorecards, the indicator framework anchored to the vote threshold, what is deliberately not measured, and the research programme that tests the message. |
| Engagement and governance | How Firefly and the campaign work together: the operating rhythm, the meeting cadence, who decides what, how a disagreement escalates, and the data charter that governs all of it. |
| Risk management | What can go wrong and what happens when it does: rapid response, the war room that runs it, the cybersecurity and manipulated-media protocols, competitor monitoring from public sources, and the statutory ground all of it stands on. |
| Assumptions and dependencies | What this proposal needs from the campaign, the regulatory guidance still outstanding, and the seven assumptions the whole plan rests on. |
| Next steps | The decision in front of the campaign, and the specific action this proposal asks for. |

Strategic objectives, Audience segmentation and Delivery structure carry no new lede: each already
opens on a paragraph of the author's own, which now does that job.

---

## 5. Removals and placeholders

### 5.1 Removals required by the brief

**Campaign-finance and expenditure-ceiling material.** Two passages remained after the earlier
excision. Both are gone:

1. `3-strategy.md` §6.5.5, question 4 of the compliance-review brief — removed, and questions 5
   and 6 renumbered to 4 and 5:
   > 4. What are the disclosure and record-keeping obligations for digital and SMS
   >    expenditure under the Election Campaign Financing Regulations, 2026, and who
   >    must file them?
2. `5-delivery.md` §8.3.2, Phase 0 checklist:
   > - Verify the Kitui expenditure ceiling from the gazette schedule

**Cost placeholders.** Two placeholders invited a price into the document. Both reworded to ask
for the specification instead, with no commercial term left in the text:

| Was | Is now |
|---|---|
| `[Insert quoted cost — typically a modest per-key figure; two keys per critical account holder for redundancy]` | `[Insert specified hardware security key model — two keys per critical account holder for redundancy]` |
| `[Insert vendor and cost at contracting]` | `[Insert vendor — selected at contracting]` |

### 5.2 Removals the restructure made redundant

**Eight orientation lines**, one at the head of each of the eight non-landing content files.
Each described the retired nine-part grouping and would now be inaccurate. They are replaced by
the sixteen route ledes in section 4.6, which do the same job for the new architecture. Quoted in
full so the replacement is auditable:

> The ground as it is: how the nomination will be decided, the candidate and the county, the ward arithmetic that sets the winning number, what digital reach can and cannot deliver against it, who the voters are, who controls the radio, and the law all of it runs inside.

> The claim at the centre of this campaign, the pillars, themes and segments beneath it, how the message is built and framed, and the limits the campaign puts on itself.

> What the campaign produces and where it goes: the content pipeline, paid media, the radio bypass, journalists and debates, and the three languages every asset has to work in.

> How field reporting and digital response feed each other, the SMS and USSD layer that reaches voters off the internet, and the volunteer and coalition programmes behind it.

> Rapid response, the war room that runs it, the cybersecurity and manipulated-media protocols behind it, and how rivals are monitored from public sources.

> The data model, the voter model built on it, the technology stack, and the analytics layer that measures all of it.

> The team that runs the engagement, how it is structured, and the leadership roles and governance rhythm around it.

> The twelve-month plan phase by phase, what is measured and how performance is governed, and the message lab that tests it.

**Two dangling cross-references** to sections deleted in an earlier excision, which pointed at
nothing:

- "(Sections 2.6 and 16A)" in the scope of work → repointed to the message architecture and the
  manipulated-media protocol, and now reads "(Sections 7.1 and 13.3)".
- "(Section 4.3 & 10.1)" in the technology stack → now "(Section 8.10)". There is no §10.1 in the
  sense that reference meant.

**Sixty-eight horizontal rules** that marked seams between blocks in the old file layout. The
new files carry one rule between sub-sections, uniformly.

### 5.3 Placeholders awaiting a real figure

No new placeholder was introduced. The proposal's marked placeholders are unchanged in substance
and all collected in §15.1 "What the campaign must provide". Listed here so the author has them
in one place outside the document:

| Placeholder | Now in § | From whom |
|---|---|---|
| `[Insert shortcode]`, `[Insert verified number]` (sender ID) | 8.10.3, 8.15.1, 8.2.3, 8.2.7 | Telco / aggregator at contracting |
| `[Insert specified hardware security key model …]` | 13.3.2 | Firefly, at contracting |
| `[Insert vendor — selected at contracting]` (deepfake detection) | 13.3.5 | Firefly, at contracting |
| `[Insert named Kenyan data-protection / electoral-law specialist …]` | 12.5.5, 13.5 | Campaign appoints |
| `[Insert — independent Kenyan qualitative research facilitator …]` | 11.3.1 | Firefly recommends, campaign appoints |
| `[Insert — Kenya National Association of the Deaf or an accredited interpreter service]` | 8.5.3 | Campaign or KNAD |
| `[Insert additional authentic Kikamba proverbs and phrases …]`, `[Insert — native-speaker developed]` | 8.5 | Kikamba producer, Phase −1 |
| `[Insert SLA — recommend 14 days]` | 12.5.4 | Campaign counsel |
| `[Insert baseline audit results — Week 1 deliverable]` | 9.1.1 | Established by measurement |
| `[Insert target]` (community-manager surge) | 14.4 | Established by measurement |
| `[Insert threshold — recommend 1.5% CTR]`, `[Insert threshold — recommend 150/day]` | 8.4.3 | Established by testing |
| `[Confirm approach with campaign counsel — agent networks are regulated financial infrastructure …]` | 8.10.5 | Campaign counsel |

Alongside these sit the document's **named data gaps** — figures the campaign will need that no
published source reports, and which the proposal deliberately does not estimate: sub-county
recognition in Mwingi and preference share by sex or age band (§3.4.6), the sizing of three voter
segments pending the Phase −1 survey (§5.3), and the ODPC's guidance on political messaging
(§15.2).

---

## 6. Judgement calls

Five places where the correct answer was not obvious, and what was decided.

**1. Which "cost figures" the brief's first constraint reaches.** The constraint bars cost,
budget, fee, rate and pricing figures "of any kind", and says commercial terms are handled in
person. Read literally it would also delete the county's KSh 13.79bn resource envelope, the
KSh 1.339bn own-source revenue target, the Auditor-General's exposure figures and the policy
prices in the message matrix (a guaranteed floor price for ndengu, a table-banking seed amount).
Those are not commercial terms of this engagement — they are the evidence base of the Economist
Governor claim and the substance of what the campaign says to voters, and deleting them would
gut the proposal against the brief's eighth constraint. The constraint has been applied to
**the engagement's own commercial terms**, which now appear nowhere: §10.1 states in terms that
the scope levels are levels of scope and not price lists, the two cost placeholders are gone, and
§1.2 says commercial terms are settled in person.

**2. Section 8 over four routes.** The canonical structure asks for one Scope of Work section.
It is one section, numbered 8.1 to 8.15 continuously. It is *served* over four routes because
18,000 words on one page would be the heaviest thing in the document by a wide margin, in a
proposal whose own §8.1.1 makes 3G loading non-negotiable. The navigation groups the four as one
section, so a reader skimming the contents sees sixteen sections, not nineteen.

**3. Geography as terrain rather than as a segment.** §3.5 "The county's three regions" could
have gone into §5 Audience Segmentation. It stayed in the situation analysis because it
describes where the electorate is and how the zones are weighted, not who the campaign must
move; §5 carries the six behavioural segments, which is what the canonical structure asks of it.

**4. The war room in Risk, not in Scope.** §13.2 describes a standing capability with rosters and
tooling, which reads like a workstream. It sits in §13 because the canonical structure puts the
rapid-response protocol there, and separating the protocol from the room that runs it would
recreate exactly the kind of split this restructure exists to close.

**5. Objectives stated as outcomes.** §4 states success as securing the nomination and delivering
the vote threshold. Those are the campaign's objectives, which is what the section is for; they
are not promises by Firefly. §2.4, newly written, says so explicitly — the commitment is to
scope, cadence and standard, and no figure in the document should be read as a guarantee of
result.

---

## 7. Open questions for the author

1. **The date on the cover still reads August 2026.** §1.1 carries it unchanged. If the proposal
   goes to Dr. Mulu later than that, the date and the Phase −1 window in §9.1.1 move together.
2. **§10.1 recommends Level 2 (Standard).** The recommendation is now in the Deliverables
   Schedule rather than in a closing "service levels" section. If the intention is that the
   campaign chooses a level in the meeting rather than reading a recommendation, the
   recommendation paragraph should be cut — it is the one place the document argues for a
   commercial choice in writing.
3. **§10.2's cadence column assumes Level 2 throughout.** If a different level is agreed, that
   table is the one place that needs restating.
4. **The five operational commitments in §4 name owners by role** ("Director of Digital
   Communications & Media", "Grassroots Operations Coordinator"). Those roles are not the same as
   the roles named in §14.5. Whether they should be reconciled, or deliberately distinguished as
   campaign-side against Firefly-side, is a decision only the author can make.
5. **§13.5's IEBC clearance checklist carries statuses** ("Verified", and others). Those were
   current when written; before this goes to the principal, they want checking against the
   primary documents.
6. **Two placeholders name a Kikamba producer who has not been appointed** (§8.5). If the
   appointment has since happened, the placeholders close.
7. **§15.1 says "There are 17" marked placeholders; a literal count of the markers gives 18.**
   The table groups two markers into one row in places, which may be the intended reading. The
   sentence was left as written rather than corrected, because changing it is a body-text edit
   and the right number depends on whether grouped rows count once or twice.

---

## 8. How this was verified

- `npm run lint` — clean.
- `next build` — 24 routes generated, no type errors.
- `scripts/verify-ward-register.mjs` — 40 wards sum to the IEBC register.
- `scripts/verify-figures.mjs` — every numeric literal in the UI traces to the source.
- `scripts/verify-mounts.mjs` — all 39 component mount points resolve to a heading that exists.
- `scripts/verify-deep-links.mjs` — 837 legacy ids and 241 live ids all resolve.
- `scripts/visual-coverage.mjs --check` — all 241 sections carry a visual treatment.
- `scripts/verify-content-integrity.mjs` — the body-text guard. Its baseline moves with this
  restructure, as it did for the excision before it; the differences it reports against the old
  baseline are exactly the four authored passages in section 4, the removals in section 5, and
  cross-references repointed to the new numbering. The script's own header records the move.
