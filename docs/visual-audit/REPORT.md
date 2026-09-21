# Report — the visual compaction pass

Branch `claude/code-visual-audit-prompt-gh8n7r`, against the Phase 0 baseline at `bc1dc9e`.
Every figure below is measured by `scripts/measure-visual-baseline.mjs`, which is committed and
was used identically for the before and after columns.

**Read `CONFLICTS.md` first, and C-2 before anything else.** The §2.2 simulator's headline outcome
does not hold from today's date. It is the first interactive element in the proposal and it
currently tells Dr. Mulu he wins.

---

## 1. What changed, in one table

| | Before | After | |
|---|---|---|---|
| **LCP on `/`**, mid-range Android, slow 4G | 5,164 ms | **2,088 ms** | −60%, inside the 2,500 ms budget |
| **INP on `/`**, 4× CPU throttle | not measured | **120 ms** | inside the 200 ms budget |
| **INP on `/full`** | not measured | **304 ms** | **over budget — see §6** |
| **CLS** at load | 0 | **0** | held — 0.02 including a Brief/Full toggle, which is a reflow the reader asked for |
| **Page height** at 390 px | 467,728 px | **325,938 px** | −30.3% |
| **Reading time offered** | 289 min, take it or leave it | **Brief 109 min · Full 237 min** | a choice, both measured |
| **Words shown on a first read** | 63,337 (all of them) | **~23,900 (Brief, 109 of 237 min)** | nothing deleted |
| **First-load JS** | 458 kB | **491 kB** | **+33 kB over baseline — a regression, see §2.7** |
| **Figures under headings** | 272, of which 99 measured nothing | **152, all measuring something** | 102 headings now carry none |
| **Wrong table aggregates** | "Combined 68.7%" and three more, shipped | **none** | opt-in, per table, by name |
| **Figures reading zero with JS off** | `KSh0.00bn`, `0.0%`, `≈0k` | **none** | |
| **Duplicated text nodes** on `/full` | headline ×2, every counter ×3 | **131 words, all single labels** | measured, not assumed — see below |
| **ASCII blocks** | 67 | **0** | all 67 retired, 11,433 words |
| **Words in the `/full` DOM** | 71,291 | **79,048** | **up 10.9% — see §2.5** |
| **`og:image`** | absent, with `summary_large_image` | **1200×630 typographic card** | |
| Third-party requests | none | **none** | held |
| Sideways scroll at 390 px | none | **none** | held |
| `noindex, nofollow` | intact | **intact** | held |

---

## 2. The four ways the site got shorter

### 2.1 Brief / Full — the largest single change

The hero used to close on "30 sections, 289 minutes". A true number, and a closed door: it is the
first thing a reader learns about a document they were sent on WhatsApp, on a phone, while
deciding whether to spend an hour on it.

Brief does not shorten the document — it shortens the **first read**. Every subsection opens on its
lead paragraph, its callouts and its figures; the rest sits behind one control that says how many
words are behind it.

- **109 minutes against 237**, both computed from the same segmentation. (At the time this
  section was first written the figures were 121 and 288, over a document that still carried
  11,433 words of box-drawing; retiring those blocks moved both.)
- Both figures are computed **on the server from the segmentation the renderer actually uses**, so
  neither can drift from what the page does.
- Nothing is deleted and nothing is summarised. The folded prose stays in the DOM, clipped by a
  grid collapse rather than dropped, so the **printed briefing kit is still complete**.
- **Full means full.** `ProseFold` and `DisclosureGroup` used to keep their own defaults regardless
  of the choice, so "Full" would have returned a row of closed drawers with one open. Verified on
  §3A: Brief 3 of 11 folds open, Full 11 of 11, persisted across a reload.
- **A deep link always opens in full.** A cold visit to `#situation-sec-3-3-2` opens all 11.

The control is in the hero with both reading times, and again as a `B`/`F` button in the flow
chrome — the hero only exists on `/` and `/full`, and a reader arriving on a chapter route through
a deep link would otherwise have no way back to the whole text.

### 2.2 Figures replace the repeats

**All sixty-seven box-drawing blocks are retired.** Not one is left in `public/content/`: every
ASCII diagram, pseudo-table, card stack and restated summary in the document is now a figure,
**11,433 words**, each declared in `scripts/figure-retirements.json` with the checklist of facts
its figure is held to and the block's own lines kept verbatim in the declaration.

| Chapter | Blocks | Words | Figures |
|---|---:|---:|---:|
| §3 — the situation, the arithmetic, reach and the air | 18 | 2,254 | 16 |
| §5 — the voter universes | 3 | 379 | 2 |
| §6A — the engine | 1 | 45 | 1 |
| §7 — messaging and language | 10 | 1,939 | 8 |
| §8 — the workstreams | 18 | 2,870 | 16 |
| §11 — measurement | 6 | 1,560 | 6 |
| §12 — governance cadence | 1 | 135 | 1 |
| §13 — risk and compliance | 7 | 1,777 | 7 |
| §14 — team and structure | 3 | 474 | 3 |
| **Total** | **67** | **11,433** | **60 registered figures** |

`figure-retirements.json` is the itemisation, block by block: what each one was, the facts its
figure is held to, why the replacement is better than the block, and the original lines. It is the
file to read if you want to check any single retirement rather than the shape of the whole.

**Six marks carry all sixty.** `SpecTable` (a real table where a table was drawn in characters),
`Stepper` (an ordered sequence, with an optional clock), `TierGrid` (an architecture diagram
without the arrows), `PairedRows` (two things that must be read together), `Tree` (a nested list
where box-drawing elbows were), and `Ledger` (findings that share no axis). The rest — `BarList`,
`ShareBar`, `RangeBars`, `Allocation`, `MessageHouse`, `Hierarchy`, `GapBar`, `BuildUp`,
`SlopeChart`, `RegisterGroups` — draw the quantities. **No connector lines anywhere**: an SVG
elbow between two boxes has to be redrawn at every breakpoint and the boxes must stack at 320px,
so order carries the sequence and a sentence carries the relationship.

Checking the replacements against those checklists is what made them better than the blocks:

- §3.4.1's table stated the required share as a **band** — 60.0–60.5% of ballots, 37.2–37.5% of the
  register — and the first build-up carried only the lower bound. The band is now computed and
  shown, and only then was the block retired.
- The four-paths ASCII stated four register totals and stopped. The whole of §3.4 turns on a
  register not being a vote, so **every path now also shows the ballots it yields at 62%**.
- The platform matrix printed a share column it had computed by hand. `platform-sizing` computes
  the same column from the headcounts and the register, and **one cell disagreed**: 35,000 is 6.5%
  on the TikTok row and 6.6% on the YouTube row directly beneath, for the same number against the
  same denominator. Logged as **C-18**, not corrected — and the Under review note on the band is
  what keeps the printed `6.5%` in the document. Correcting it would have deleted a figure.
- The offline table gave six channels one visual weight. Three of them cite nothing, and the
  document says so. `offline-channels` **hatches the unsourced three and writes "Source needed" on
  the bar** (C-17), and carries the standing warning that the six overlap: summed, they would claim
  1,800,000 reachable voters in a county whose register is 532,758.
- The three banners were the only blocks retired with **no figure replacing them**, because they
  carried no facts — each restated, in box-drawing characters, the heading immediately above it.
- §3.4.5's cross-match could not be retired as it stood. The panel already mounted at that heading
  drew the same twelve wards, and checking it against the block's checklist found **two gaps**: it
  collapsed the table's four recognition grades into three, losing the distinction between Kwa
  Vonza/Yatta's campus-town recall and Kitui West's border-belt recall, and it stated the overlap
  only in the top-8 window. The block's own claim — *5 of the top 11 … 83,496 voters* — is exactly
  right against the register; it is §3.4.6's "5 of top 8" that is not. **Both windows are now
  computed and shown**, with C-5 beneath them, and only then was the block retired.
- §3.4.6's banner is the textbook "restated summary table". Every one of its eight lines is now
  computed from the register rather than transcribed, and **each names the subsection that
  established it** — which turns a second copy of §3.4 into a way back into it. Three of the eight
  are in dispute (C-5, C-6, C-7); those rows print what §3.4.6 stated beside what the register says.
- §3.3.2's branch tree is the **only block retired without a new figure or a checklist gap**: the
  two prose bullets directly beneath it state every fact it carried, in fuller words, and the
  branch navigator at that heading draws the fork. It was a third copy between the other two.
- **§13.5 and §13.5.1 ask for two different numbers of signatures**, fifty lines apart: 500 per
  sub-county (4,000 across eight) and 500 in total across at least five. A nomination paper short
  of the statutory count is rejected. Both figures print their own wording with the C-22 flag, and
  neither resolves it — reading the Elections Act regulation is not a thing a figure should do on
  Firefly's behalf.
- **§13.5.1's status column includes one entry the campaign will not yet claim**: "[Requires legal
  confirmation]" against the party nomination timelines. It prints as it stands, next to two
  Verified, one Active, one Scheduled, one Pending and one Operationalized.
- **Retiring §11.1.3 found a live figure on the site five points below the one the proposal
  states.** `data/kpis.ts` held the Stage 1 headline targets twice — correctly inside the
  scorecard data, and again in a hand-typed summary feeding the architecture figure, where
  "≥ 70.0%" had become ">65%" and "Branch Executive" had become "Delegate". The stale copy is
  corrected, `figures.test.ts` now asserts every line of both stage summaries against the KPI it
  summarises, and **no content was changed** — this was a transcription in the repository
  disagreeing with the source it transcribes. **D-14** has the working.
- **§11's two scorecards were already being substituted, from the wrong side.** `KpiScorecards`
  has rendered in place of those blocks since an earlier pass, matched on the block's own banner
  text inside `MarkdownViewer` — a substitution that depended on a banner nobody could rename, and
  that left the seven-column ASCII in the markdown carrying the words anyway. Both are now
  `figure` fences resolved by the registry, and the string matching is deleted.
- **Nine KPI baselines, and only one of them is a number.** "Not yet measured (Week 1)" is drawn
  as an absence rather than a bar at zero, because an unmeasured quantity reported at nil is a
  different and false claim. The test now pins the three kinds so a later edit cannot quietly turn
  an absence into a figure.
- **The annexes' provenance blocks are the rules this audit has been applying.** §3.2.3 step 4
  reads: *"if unreconciled, report both numbers explicitly side-by-side with their respective
  sources rather than calculating an artificial average."* That is, word for word, what
  `CONFLICTS.md` does with all twenty-two entries, and what every Under review flag on every figure
  does. The figure says so on the step itself.
- **§13.1.2's first instruction is to do nothing**, and it is the most easily lost line in the
  runbook: a level 1 threat gets IGNORE / PASSIVE MONITOR, with an explicit instruction not to
  amplify or refute. It decides whether a fringe post stays fringe, so the figure keeps it first
  and in full.
- **Two of §13.1.4's four source cells decline to claim something, and both are kept.** Position 1
  says the classroom and bursary counts are pending the inventory and that only §3.3.1's **12,573
  recipients and KSh 47m** may be used until reconciled; position 2 says the ward allocation
  methodology has not been drafted and the line must not go on air before it is. A runbook that hid
  either would send a spokesperson on air with an unverified figure. Every Kikamba framing in that
  block is transcribed character for character — ĩ, ũ, and the apostrophe in *kũtelemw'a* —
  because §7.3.2 forbids machine translation of exactly this material.
- **§5.2's data tier column is the honest half of that table.** Three of the six segments are Tier
  1 and sized from the census and the register; the other three say "primary research needed" and
  carry a **range** rather than a number. The ranges print as ranges and the gaps as gaps.
- **Two §8.3 blocks were trees, and a tree drawn in characters is only a picture of one.** The
  USSD menu and the asset repository are now nested lists: the nesting *is* the structure and is
  announced as such, each path wraps inside its own indent instead of running into the next
  branch's, and the guides are borders rather than characters, so they never land in a copy-paste.
  The USSD figure carries the warning with it — the shortcode is not provisioned, the root still
  reads `*[Insert shortcode]#`, and a menu tree lifted into a slide is exactly how an
  unprovisioned shortcode reaches a flyer.
- **§8.3.2 is C-21 from the other end, and there the document is right.** Its SMS row states the
  constraint twice: "Kiswahili or English only (CA rule)", and GSM-7 encoding with no accented
  unicode — which independently rules out the ĩ and ũ Kikamba needs. §7.3.1 still lists 2G bulk
  SMS among Kikamba's channels.
- **§8.8.2's clock is the one thing an ASCII block did better than a paragraph**, so the figure
  keeps it. The four-hour cycle runs down the margin as a monospaced offset in front of each stage
  rather than sitting in a caption, because the claim *is* the clock: a rumour logged by USSD in
  Tseikuru, triaged, answered in three languages and deployed across four channels, all inside a
  morning. `Stepper` grew an optional offset for it.
- **§8.12.1's schema is the block that proves not every diagram wants to be a chart.** Nineteen
  typed fields with nothing to plot and nothing to rank: what it needed was to stop being an
  *image* of a table. Inside a code fence it could not wrap, could not be searched word by word,
  could not be read in order by a screen reader, and scrolled sideways on a phone. It is now a real
  `<table>` whose rows become labelled blocks at narrow widths. The content is identical — every
  field name, type and enum member transcribed, because a schema paraphrased is a schema wrong —
  and only its form changed. That is the whole of the improvement, and it is a large one.
- **§8.14.2's five procurement rows all read "Awaiting campaign decision", and all five still do.**
  A figure that rendered a pending procurement as settled would be inventing the most consequential
  kind of thing in that chapter.
- §7's other five blocks are the message house, the counter-fire table, the cultural registers
  and the QC gateway. Two things in them were worth protecting and are now protected by the
  figures rather than by luck. The **Kikamba orthography** in §7.3.2 — ĩ and ũ are distinct
  letters, not decorated vowels — is transcribed character for character, which is what §7.3.2's
  own ban on machine translation exists to insist on. And §7.1.4's bursary rebuttal ends
  **"Share pending the ledger"**: the document declining to claim a proportion it has not verified,
  inside its own counter-messaging table. It is the most creditable sentence in the block and it is
  kept exactly.
- §7.3's three blocks found **C-21, the one conflict here with a regulator attached.** §7.3.1
  lists "2G Bulk SMS & USSD" among Kikamba's dominant channels; §8.10.2 states, citing the
  Communications Authority at Tier 1, that political bulk SMS is restricted to English or Kiswahili
  and that an operator may **refuse** a non-compliant message. Six other places agree with
  §8.10.2 — including §7.3.4, in the same subsection, which gives the SMS rail 80% Kiswahili and
  20% English and allocates Kikamba none of it. `language-map` prints §7.3.1's channel list
  verbatim, bulk SMS included, and carries the flag: dropping the words quietly would have hidden a
  conflict that can have a message refused after the campaign has committed a 48-hour lodging lead
  time. The SMS rail is the channel §3.6.2 sizes at 320,000 voters.
- §3.7's radio landscape is the block that **found C-20**. Its hostile tier opens with Musyi FM;
  twelve lines later §3.7.1 gives Musyi FM the placement budget, the station data reads "Priority
  — commercially independent", and §3.6.3 scales radio effort up into it. `radio-gatekeepers`
  draws each station's posture from the ownership map §3.7.1 says governs and prints what the
  diagram said beside it, on the two rows where they differ. **Sang'u FM and Mang'elete, both named
  in the diagram, are in none of the eight rows of that map**; they render as "Not in the ownership
  map" rather than being dropped, because an omission a reader cannot see is the worse failure.

### 2.3 A figure has to earn its place

"A figure under every heading" (PR #10) produced 272 derived figures. **99 measured nothing**: 51
re-typeset the heading, 23 listed the subsections below it, 11 redrew its own bullets as a wheel, 6
quoted a truncated fragment — one ended mid-sentence on *"…the Office of the Registrar of Political
Parties issued a"* — and 8 drew a diagram from an empty node array. A further 37 were derived,
serialised into a 188 kB JSON file and shipped to the browser **in order to render null**.

272 → 152, every one drawing a measurable relationship. **102 headings now carry no figure**, which
is a complete answer. `scripts/visual-coverage.mjs` is inverted to match: it no longer fails the
build when a heading has no figure, it fails when a retired kind comes back.

### 2.4 Less chrome

- The table toolbar carried four controls on all 74 tables. Now: a row count, a filter **only above
  ten rows**, and CSV/Chart behind one overflow control.
- The hero's three counter cards — inside a tilting, spotlit, mesh-gradient panel that scrolled
  sideways on a phone and clipped its own labels — are one server-rendered strip.
- 14 components implementing denied effects were deleted outright, with their four files.

### 2.7 First-load JS went over budget, and this is the one promise this pass broke

**458 kB at baseline, 453 kB when §7 was written, 491 kB now.** The budget was “not above
baseline”, and the finished branch is **33 kB above it**. It went over between that measurement and
the last of the 67 retirements, and nothing re-measured it until the work was done. Stated here
rather than left in a build log.

**The cause is one import edge.** `MarkdownViewer` is a client component — it has to be, it carries
the Brief/Full switch and the disclosures — and it imports `Figure` from
`components/figures/registry.tsx`. The registry imports all eight figure data modules eagerly, so
every series, every transcribed table row, every Kikamba string and every note is compiled into the
client bundle: roughly **258 kB of source** across `lib/figures/*` plus `marks.tsx` and
`registry.tsx`.

**Almost none of it needs to be there.** The marks are pure functions of their data and render
identically on the server; nothing in a figure is interactive except the `details` that
`PrintSafeDisclosures` toggles. The data is shipped to the browser to render something the browser
never changes.

**The fix is a prop, not a rewrite:** render the figures on the server and pass them into
`MarkdownViewer` as a map of ready React nodes, the way a client component is meant to receive
server-rendered children. It is a contained change with a clear test — the build's First Load JS
line — and it is recommended rather than attempted here, because it touches the render path of
every page at the end of a long pass. `LAUNCH.md` carries it as the first engineering item.

---

### 2.6 Duplicates are collapsed, not deleted

**Three paragraphs now arrive as one line each**, naming the section the reader met them in first,
with the text itself one tap away. Nothing is removed, so nothing waits on Firefly.

| Reader meets it first | Collapsed copy | Overlap |
|---|---|---|
| §0.1 The ask | §2.1 The mandate | **1.00** — 59 words, word for word |
| §0.1 The ask | §2.4 What this proposal commits to | 0.70 |
| §8.0 What Firefly owns | §10.1 Scope levels | 0.81 |

**D-1 tabled eleven of these; three survive.** The restructure and the retirement of 67 ASCII
blocks removed the rest, and the hand-written list had quietly gone stale. It is derived now:
`scripts/find-duplicates.mjs` re-runs the detection on every build and fails if `duplicates.json`
declares a repetition that is gone or misses one that is there.

**The mechanism took three attempts**, because a collapsed duplicate that vanishes from the printed
kit is a deletion nobody approved, and the first two did exactly that — measured under print
emulation, not assumed. The grid-rows technique computed its print override correctly and still
measured zero; a plain closed `details` measured 39px against a 37px summary, its body absent,
because Chrome hides closed-disclosure content through a UA slot no author CSS reaches. What ships
renders `<details open>` from the server and closes it with script, reopening on `beforeprint`. The
complete document is the default; the collapse is the enhancement. **With JavaScript off, every
cross-reference is open.**

---

### 2.5 One number went the wrong way, and it should have

**The `/full` DOM carries 79,048 words, up from 71,291 at baseline — 10.9% more.** That is the
honest result of retiring 67 ASCII blocks, and it is worth stating rather than leaving for someone
to find.

A box-drawing block is mostly not words. `│`, `├──` and a row of `═` cost pixels and cost a screen
reader dearly, but they cost few words. What replaces them carries **more** text than they did,
deliberately: each figure has a headline, a measure line naming what is being counted, a source and
tier, a note explaining what the reader should take from it, and a "View the data" table holding
every number. §8.12.1's schema went from an unreadable 19-row picture of a table to a real table
with a caption; §3.6.2's six channels gained "Source needed" on three bars and a standing warning
that they must not be summed. None of that existed in the fence.

**So three other numbers are the ones to read against it:**

- **Page height fell 30.3%**, 467,728 px to 325,938 px. The words are more numerous and take far
  less room, because a table is not 90 characters wide on a 390 px screen.
- **Reading time fell**: Brief 121 → **109 minutes**, Full 288 → **237 minutes**. Those are computed
  on the server from the segmentation the renderer uses, over the markdown — which is genuinely
  shorter by 11,433 words.
- **Sideways scroll is still zero at 390 px**, on every route, which the retired blocks could not
  manage.

The trade is: fewer words in the document, more words on the page, and every added word doing
something a box-drawing character could not — naming a source, flagging a conflict, or telling a
screen reader what a column is.

**And the duplication number is now measured rather than asserted.** The baseline said 2,836 words
were "in the document twice"; the script counted every `.sr-only` word and called them all
duplicates, which was wrong — a table caption or a "Stage 2:" ordinal is not a twin of anything,
and removing it would make the page worse. The script now reports `hiddenWords` and
`duplicatedWords` separately, the second checking each hidden string against the visible rendering.
On the finished site `/full` at 390 px has **3,581 hidden words of which 131 are duplicates**, all
single labels — "Kasalu", "Mulu", "Status" — where a chart's accessible name coincides with its
visible one. `BASELINE.md` carries the correction.

---

## 3. The defects that were fixed first

### 3.1 The hero was reporting zero

`CountUp` seeded its visible span with `useState(0)`, so the server HTML — and a slow phone before
hydration, a reader with JavaScript off, reader mode and print — carried **`KSh0.00bn`, `0.0%` and
`≈0k`**. The 390 px baseline screenshot caught the count mid-flight showing **`KSh13.49bn` and
`84.5%`**, neither of which is a figure in this document.

The effect on LCP was not the point but is the headline: **5,164 → 1,932 ms**. The largest element
was a counter whose text changed after hydration, so the measurement restarted.

### 3.2 Every figure was in the document up to three times

`AnimatedNumber` rendered each figure three times (`sr-only` + width sizer + value); `SplitText`
rendered the headline twice. `aria-hidden` and `sr-only` move a node in or out of the accessibility
tree and do **nothing else** — both halves were real text to copy-paste, find-in-page and reader
mode. Width is now reserved in `ch` against the final string.

### 3.3 "Combined 68.7%" — Kasalu's two poll shares, added together

The table strip computed Avg/Max/Combined over any column that *looked* numeric — a question about
characters, not about whether the numbers may be added. It shipped, among others, the workstream
identifiers averaged and a zone table counting its own Total row twice, for **832,002 voters in a
county of 532,758**.

Charts and aggregates are now opt-in per table in `lib/table-charts.ts`, with the aggregation
named, the column named and the total rows excluded. **73 of 74 tables opt into nothing.**

### 3.4 The three "heading typos" are not in the content

`Langua register and dialect` and two `Sta:` scorecard headings were logged as content typos to fix
by hand. **The markdown is correct and always was.** All three were corrupted on the way into
`section-visuals.generated.json` by an optional backslash in a LaTeX guard, which let
`/\s*\$?\\?ge\s*[\d,]+\$?/` eat the letters "ge" inside any word followed by a comma or a number.
It was waiting for `"Percentage 40"` → `"Percenta"` and `"Coverage 78.8%"` → `"Covera.8%"`.

One character fixed in the generator. **No content edited.**

### 3.5 The rest

- **3D terrain** defaults to 2D and offers itself only on a fine pointer, a wide viewport, no Data
  Saver and no reduced-motion request. It carries an Under review flag for C-15, whose labels
  contradict §3.6 and which stay as written.
- **`og:image`** — a typographic card, no photograph (D-8), built by a committed script, so a
  link-only proposal shared on WhatsApp stops previewing as a broken large-image card.
- **Reserved page heights** were measured before Brief mode existed, so the page claimed
  467,728 px while rendering far less. Re-measured after every retirement: **325,938 px, −30.3%**.

---

## 4. Conflicts: 21 confirmed, 1 corrected

`CONFLICTS.md` has the working for each. Every one was checked against the source rather than
copied from the brief, and the arithmetic against `data/ward-register.json`, which sums exactly.

**Four of them the brief did not know about**, and all three came out of the figure work itself.
A figure that computes its labels rather than transcribing them disagrees out loud with a document
that has drifted (**C-18**, a tenth of a percentage point); a figure that cites its section has to
decide which number that section is (**C-19**, eight stale heading numbers); and a figure that
draws a station's posture from the station data has to notice when the prose above it says the
opposite (**C-20**, which is the one with a spending decision attached — §3.7 files Musyi FM under
hostile gatekeepers while §3.7.1 gives it the placement budget). **C-21** and **C-22** are the last two, and the two with deadlines on them: §7.3.1 puts Kikamba on the bulk SMS rail that the Communications Authority
closes to it, against six other places in the document and a Tier 1 source; and §13.5 asks for 500
nomination signatures **per sub-county** where §13.5.1 asks for 500 **in total** across at least
five — a factor of eight, on a filing whose rejection is not appealable. None has been corrected
in the content.

**C-2 is the one to read before Dr. Mulu opens the document.** The §2.2 simulator's 14 weeks run
from the 7 August poll, so six of them have already gone. Over the **8.3 weeks that remain**,
+1.2 points a week reaches **32.0%** — below Kasalu's 37.4%, so the panel's "overtakes Irene Kasalu
… establishes an undeniable mandate" **does not hold as written**. Overtaking her from today needs
+1.85 a week; the 40% benchmark needs +2.16, against a slider whose maximum is 2.5. The model also
holds Kasalu flat at 37.4% although she gained 6.1 points between June and August.

**C-3 did not survive checking and is corrected in place.** The 40% benchmark **is** sourced — §4.1,
Tier 2, a countywide public preference share — and §3.4.2 contains no statement about
general-election thresholds. The real defect is narrower: the simulator calls it a "Wiper Nomination
threshold" with neither the population nor the tier.

Confirmed by computation, in `lib/figures/figures.test.ts`: the deficit pool is 51.7252%, which
rounds to the panel's **51.73%** and not the prose's 51.72% (C-6); Ikanga/Kyatune ranks **11th**, so
"5 of top 8 wards" cannot be right (C-5); the deficit wards number **21**, not the 24 the mandate
sends 240 captains into (C-7); and Path B's 14,179 is the margin over 198,004, not over the 200,000
it names (C-4).

---

## 5. What is not done

**`LAUNCH.md` is the actionable version of this section** — what blocks the merge, what blocks
sending the link to Dr. Mulu, and what can follow it, with an owner and an estimate against each.
What follows here is the audit's own account.

Stated plainly, because a report that implies otherwise is worth less than no report.

**The ASCII blocks are done — all 67 of them.** That was the largest item on this list through
most of this pass, and it is closed. What remains:

- **Two phrase-level repetitions are still open.** The paragraph-level ones are collapsed (§2.6
  below); the Tier 3 poll statement and the 86.4% statement repeat as phrases inside differently
  worded paragraphs, which the matcher does not reach. The 86.4% case cannot be collapsed while
  C-13 is unanswered anyway — a cross-reference pointing at one of two contradictory numbers would
  settle the conflict by sleight of hand.
- **The desktop figure rail** (Phase 5 item 5) is not built, and **should not be**. Measured on
  `/full` at 1440 px across all 71 figures: those with a data table need a mean of **665 px** of
  content width, those without **577 px**, and **not one is narrow enough for a rail** (≤ 380 px)
  against a 768 px prose measure. Fifty-four carry a table of two to seven columns. A rail would
  give every one of them half the width its content needs, which is the sideways scroll this pass
  spent its first day removing. **D-15** has the measurement and what would have to change first.
- **INP on `/full` is 304 ms**, over the 200 ms budget. `/` — the route a reader arrives on — is
  120 ms. The worst control on `/full` is opening a figure's data table at **272 ms**, on a page
  holding all 30 chapters and all 60 figures at once; the Brief/Full toggle is 200 ms there. Not
  fixed: the remedies are a CSS-driven reading mode or virtualising `/full`, and neither is a
  change to make in the last hour of a pass whose Brief/Full correctness took three attempts to
  get right. Measured and stated rather than left unmeasured.
- **Twenty-two conflicts are logged and none is resolved**, which is correct — hard rule 2 puts
  reconciliation with Firefly — but it is not the same as the document being consistent. C-2, C-21
  and C-22 have dates attached and should be read first.

The inventory's remaining "437 words retired" is the **plan** for the last DEDUPE blocks, not
box-drawing ones; every CONVERT block in it is done. The state is **11,433 words**, summarised in
§2.2 above and itemised in `figure-retirements.json`.

---

## 6. Verification

`npm run verify` — eleven guards and 38 arithmetic assertions, all passing:

```
Ward register integrity ... 40 wards across 8 constituencies sum to 532,758
Analysis exports ......... 9 exports, 96 values, all carrying source, tier, date, method, status
Figure verification ...... every numeric literal in the UI traces to the source
Figure fences ............ all 58 ```figure fences resolve to one of 60 registered figures
Duplicates ............... 3 declared repetitions, all present, none undeclared
Figure retention ......... all 1,055 figures present at the baseline survive; all 552 content
                           figures still reach the print path (70 declared migrations)
Content integrity ........ all 3,144 body lines unchanged since 228eb02, apart from 65 entries
                           covering 67 blocks retired under rule 1a and declared
verify-mounts ............ 50 mount points resolve
verify-deep-links ........ 880 legacy ids and 272 live ids resolve
visual-coverage .......... no retired figure kind has returned
figures.test.ts .......... 38 passed
```

Three guards were improved by the work rather than worked around, and a fourth was written:

- `verify-figure-retention` indexed `section-visuals.generated.json`, a file **derived from**
  `public/content`, which made it circular: regenerating it reported section 6.2 as a lost figure.
- Rule 1 never consulted the declared-migrations list, so a figure declared "removed, not moved"
  satisfied rule 2 and still failed rule 1, surviving only when its digits happened to appear
  inside another number.
- `measure-section-heights.mjs` could not be run as its own documentation instructed — it said to
  point `NODE_PATH` at playwright, and ESM resolution does not consult `NODE_PATH`. That is why the
  heights were stale.

`verify-figure-fences.mjs` is the new one, and it exists because the bug it catches **shipped**. A
```figure fence body must read `id: some-figure-id`; two of them were written as a bare id, which
renders a visible "Malformed figure fence" banner exactly where the retired ASCII block used to be.
Neither existing guard could see it: retention passed because the figures still lived in the test
file and the data modules — it asks whether a number survives somewhere, not whether the figure
meant to show it renders — and content integrity passed because the retirements were properly
declared, which authorises removing the block but cannot know the replacement is broken. So a block
could be retired, its retirement correctly declared, and the figure that justified the retirement
silently replaced by an error banner: rule 1a's exact failure mode, arriving through a typo. The
guard parses every fence and checks the id against the registry, and it was tested against both
forms of the bug before being added to `npm run verify`.

**A final sweep of all 23 routes**, at 390 px: every one returns 200, none scrolls sideways, none
renders a figure placeholder or an unresolved fence, none throws a page error, and none shows a
figure reading zero because JavaScript has not run.

One apparent exception was checked by hand and is not one. §3.4's scenario panel reports **0.0% of
draws above 198,004** under the current measured preference, and that zero is the finding, not a
loading state: the same scenario's 95th percentile is 131,934, so none of the 10,000 draws reaches
the 2022 tally. It renders with its PROVISIONAL and Modelled badges, as a modelled zero should.

**INP, the one Core Web Vital this audit had never measured, is now measured.** At 4× CPU
throttle, clicking every control this redesign added or kept:

| Control | `/full` |
|---|---:|
| Open a figure's data table | **272 ms** |
| Brief → Full | 200 ms |
| Full → Brief | 160 ms |
| Open a cross-reference | 104 ms |
| Open a subsection disclosure | 88 ms |
| A table toolbar control | 80 ms |

`/` is **120 ms** and inside the 200 ms budget; `/full` is **304 ms** and is not. `/full` is the
whole-document route — 30 chapters and 60 figures in one DOM — and every one of those controls
costs more there than where a reader actually meets it. It is stated rather than fixed: see §5.

**CLS is measured before anything is clicked**, and that is not a convenience. Switching Brief to
Full reflows the document because the reader asked it to, and the API only discounts shifts within
500 ms of the input — so a script that clicks and then waits records a deliberate reflow as
instability. At load, both routes are **0**. Including a Brief/Full toggle, `/` reads 0.02, and
that number would be a lie about the page.

**Print reach was verified, then the verification was found wanting, then it was fixed.**

Every retirement batch was checked by emulating print and looking for the block's facts in
`document.body.innerText`. All of them passed. **The probe was wrong**: `innerText` skips the
contents of a closed `<details>` whatever the CSS says, and the facts it found were the ones that
also appear in a figure's headline, note or labels — not the ones that live only in its data table.

The underlying belief was wrong too. `FigureFrame` carried a `print:open` class, and `open` is an
attribute, not a CSS property, so it styled nothing; `globals.css` carried
`details:not([open]) > *:not(summary) { display: revert }` under `@media print`, and Chrome hides a
closed disclosure's contents through content-visibility on a UA slot author CSS cannot reach.

**Measured instead of argued, by rendering to PDF: `/reach` was 21 pages with the disclosures as
they were, and 24 with every `details` opened first.** Three pages of figure data tables were
missing from the printed proposal — which is the retired ASCII blocks' numbers leaving the printed
document when the blocks did, the exact failure rule 2 exists to prevent.

Fixed the way the cross-references were: every disclosure holding **content** — a figure's data
table, the polling gauge's table, a rule 1b cross-reference — now ships with the `open` attribute
and is closed by `PrintSafeDisclosures`, which reopens them on `beforeprint`. The overflow menu in
`InteractiveTable` is deliberately excluded: it holds controls, and controls should not print.
Re-measured: **24 pages either way**, and with JavaScript disabled all five disclosures on `/reach`
are open. All 60 migration declarations carry the corrected account.

---

## 7. Screenshots

`docs/visual-audit/screenshots/` — `before/` and `after/`, same six routes, 390 × 844 and
1440 × 900: `/`, §0 decision, §2 summary, §3A situation, §3B arithmetic, §3C reach.

The clearest pair is `root-390`. Before: three counters mid-count at `KSh13.49bn` and `84.5%`,
clipping sideways. After: the gap — 22.1% against 37.4%, **15.3 points behind** — drawn as one
distance, above a Brief/Full control offering 109 minutes or 237.

---

## 8. Assumptions made

1. **Brief is the default** (D-2). Reversible in one line.
2. **Race-first hero** (D-3). The envelope keeps its place in the strip, one item down.
3. **A folded block that sat between two kept blocks moves below them** (D-2). One disclosure per
   subsection cannot hold blocks interleaved with visible ones without either reordering them or
   splitting into several controls, and several controls is the failure `DisclosureGroup` already
   warns about. Order within each group is untouched; Full restores the document's order exactly.
4. **No prose was rewritten, tightened or summarised.** The only content edits are the four declared
   retirements and the `figure` fences that replaced them.
5. **`statement`, `chapter`, `hub`, `quote`, `shape` and `table` are retired figure kinds.** The
   nine curated overrides that existed only to force a heading down to `statement` now say `none`.
6. **Four deviations from the conversion map**, each recorded in D-13 with the reason: §3.1.5,
   §3.3.6, §3.4.2's concentration bullets and §1A.5 were kept or collapsed rather than retired,
   because in each case the block carries reasoning or a specification no figure draws.
