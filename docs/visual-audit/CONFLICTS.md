# Conflicts — where the document disagrees with itself

**Firefly reconciles these. This audit does not.** Under hard rule 2, no number, claim or tier in
`public/content/` has been changed. Where a figure draws on a number that is in dispute, the figure
carries a visible **Under review** flag pointing here, and shows every version that is stated, dated
and attributed, rather than picking one.

Every entry below was checked against the source before being written down. The status line says
what the check found:

- **Confirmed** — reproduced from the repository. The conflict is real.
- **Confirmed, and worse / narrower than stated** — real, but the audit's description needed correcting.
- **Not confirmed** — the brief's description does not survive contact with the content. The entry
  says what is actually there instead. These matter as much as the confirmations: acting on a
  conflict that is not there would mean changing something that is correct.

Arithmetic was checked against `data/ward-register.json`, which sums exactly: each constituency's
wards sum to its stated total, and the eight constituencies sum to 532,758 across 40 wards.

---

## C-1 — The simulator contradicts itself in one panel · §2.2

**Status: Confirmed.** `components/markdown/PollingTrajectorySimulator.tsx`.

At the default +1.2 points per week over its hardcoded 14 weeks, the panel computes 22.1 + 16.8 =
**38.9%**, and then says both of these at once:

- Status pill: **"Below Viability Threshold (38.9%)"** — because 38.9 < 40.0.
- Takeaway: Dr. Mulu **"successfully overtakes Irene Kasalu (37.4%) and establishes an undeniable
  mandate for the Wiper gubernatorial nomination"** — because 38.9 > 37.4.

Both are true of the arithmetic; together they are not a finding a reader can act on.

Separately, `+16.8% Total Improvement` is a **units error**. 16.8 is a number of *percentage
points*, not a percentage. Rendering it with a `%` suffix invites the reading "16.8% better",
which would be 25.8%.

**What the figure does until this is settled:** show the gain in points, labelled points, and state
the two outcomes as what they are — above Kasalu's August share, below the 40% benchmark.

---

## C-2 — The simulator's 14 weeks have already partly elapsed · §2.2

**Status: Confirmed. This is the most consequential entry in this file.**

`weeksToNomination = 14` is hardcoded with no calendar anchor, and the 22.1% baseline is the
Mizani round of **7 August 2026**. So the 14 weeks run from 7 August and end **13 November 2026** —
which is why the projection lands neatly at the window's close.

Measured from today, 18 September 2026:

| | |
|---|---|
| 7 Aug 2026 → today | 42 days = **6.0 weeks, already gone** |
| today → 15 Nov 2026 | 58 days = **8.3 weeks remaining** |
| 7 Aug 2026 → 15 Nov 2026 | 100 days = 14.3 weeks |

At the recommended +1.2 points per week over the **8.3 weeks that remain**:

> 22.1 + (1.2 × 8.29) = **32.0%**

Not 38.9%. And **32.0% is below Kasalu's 37.4%**, so the panel's headline outcome — "overtakes
Irene Kasalu … establishes an undeniable mandate" — **does not hold as written**. To overtake her
from today needs **+1.85 points per week**; to reach the 40% benchmark needs **+2.16 points per
week**. Both are far above the slider's own "recommended baseline" and close to its maximum of 2.5.

Two further problems in the same model:

- The 38.9% outcome depends on gains between 7 August and today that **no published data shows**.
  The panel presents six weeks of assumed movement as if it were still ahead of the campaign.
- **Kasalu is held flat at 37.4%** while Dr. Mulu climbs. She is not flat in the evidence: she went
  31.3% → 37.4% between the June and August Mizani rounds, **+6.1 points**. A model that lets one
  candidate grow and freezes the other is not a projection of a contest.

**What the figure does until this is settled:** anchor the weeks on the calendar with a live "today"
marker, count only the weeks that remain, and show Kasalu's own June→August trajectory beside
Dr. Mulu's rather than as a fixed line.

**This one should be looked at before Dr. Mulu opens the document.** It is the first interactive
element in the proposal and it currently tells him he wins.

---

## C-3 — The 40% benchmark: source exists, label is wrong · §2.2 / §4.1 / §11.1

**Status: Not confirmed as written — corrected.**

The brief recorded that the 40% "Wiper nomination threshold" has no stated source, and that §3.4.2
notes there is no threshold for the general election. Neither survived checking:

- The 40% **is** sourced. §4.1 states it as *"a measured countywide public preference share of
  **40.0%+** in the official, party-commissioned surveys (Tier 2)"*, and §11.1 explains at length
  that it measures a different population from NW-01's ≥55% of sampled likely Wiper primary voters.
- **§3.4.2 contains no such statement.** Searched for it directly; the chapter's only threshold
  language is the ~200,000-vote victory threshold.

**The real defect is narrower and still worth fixing.** The simulator labels 40.0% as the
**"Wiper Nomination threshold"**. It is not a threshold of the nomination mechanism — it is a
*preference share of the countywide public* reported in party-commissioned surveys, and it is
**Tier 2**. The panel states it as a hard gate, unqualified and untiered, and a reader takes away
that 40% is a rule when it is a target drawn from a Tier 2 survey of a different population than
the one the §2.2 polls measure.

**What the figure does:** carry the population and the tier on the benchmark — "40.0%+ of countywide
public preference, party-commissioned surveys (Tier 2), §4.1" — never the bare word "threshold".

---

## C-4 — Path B's margin is measured against a different number than it names · §3.4.3

**Status: Confirmed, exactly.**

The prose says Path B *"exceeds the 200,000 threshold by 14,179 voters"*. It does not:

```
212,183 − 200,000 = 12,183   ← the margin over the number the sentence names
212,183 − 198,004 = 14,179   ← the number the sentence actually quotes
```

The figure quoted is the margin over **198,004** (Malombe's certified 2022 total), while the
sentence names **200,000**. The ASCII block above it is consistent — it prints 212,183 (39.83%) and
claims no margin.

Path A states its margin correctly against 198,004 (`+2,194`), and Path D against 200,000
(`−8,189`). Path B is the one that mixes them.

**Noted while checking, not a conflict:** Path B is also the only one of the four with no "Turnout
Reality" line. Paths A and D both convert their register to ballots at 62% and show how far short
that falls; Path B and Path C state a register total and stop. Since the entire point of §3.4 is
that a register is not a vote, Path B reads stronger than its own arithmetic supports.

---

## C-5 — "5 of top 8 wards" · §3.4.5 / §3.4.6

**Status: Confirmed.** Three different counts of the same overlap appear:

| Where | Claim | Against the register |
|---|---|---|
| §3.4.5 prose | "Mwingi North … **3 of the top 7**"; "Kitui South … **2 of the top 11**" | correct |
| §3.4.5 cross-match block | "**5 of the Top 11 Wards** (Kyuso, Tseikuru, Mumoni, Athi, Ikanga) … **83,496 Voters**" | correct |
| Deficit panel | "4 of the top 8 wards … 68,112" | correct — a narrower window |
| §3.4.6 summary table | "**5 of top 8 wards**" | **wrong** |

Three of the four are right. The summary line is the only one that is not, and it reads as the
cross-match block's count (5) printed against the prose's other window (top 8).

Ranked from the register, the wards in question sit at:

```
#1  Kyuso            19,921   Mwingi North
#2  Township         19,538   Kitui Central   ← not a deficit ward
#5  Tseikuru         16,471   Mwingi North
#7  Mumoni           15,877   Mwingi North
#8  Athi             15,843   Kitui South
#11 Ikanga/Kyatune   15,384   Kitui South
```

**Ikanga/Kyatune is #11, not top 8.** The summary line's "5 of top 8" is wrong; the §3.4.5 prose
("3 of the top 7" and "2 of the top 11") is the version that matches the register.

**What the figures do:** the deficit panel now computes and shows **both** windows — 4 of the top 8
(68,112) and 5 of the top 11 (83,496) — and carries this flag beneath them, so a reader meets the
two counts together rather than one at a time. The `targeting-summary` figure that replaced the
§3.4.6 banner prints what that banner stated, "5 of top 8 wards", beside the computed version.
Neither sentence in `public/content/` has been changed.

---

## C-6 — 51.72% or 51.73% · §3.4.5

**Status: Confirmed, and resolvable.** 275,570 / 532,758 = **51.7252%**.

Correctly rounded to two places that is **51.73%** — the panel. The prose's **51.72%** is a
truncation, not a rounding. This is the one conflict in this file with an arithmetically correct
answer rather than an editorial choice.

---

## C-7 — "24 northern and southern deficit wards" · §3.4.5

**Status: Confirmed.** Counting wards from the register:

```
Mwingi North      5
Mwingi West       4
Mwingi Central    6
Kitui South       6
                 ──
                 21
```

**21, not 24.** The count reaches 24 only by adding the three Kitui East border wards named
earlier in §3.4.5 (Endau/Malalani, Voo/Kyamatu, Mutitu/Kaliku) — but the **275,570 deficit pool
excludes Kitui East entirely**, being Mwingi (200,198) + Kitui South (75,372). So the same
paragraph uses one geography for its pool and another for its ward count.

This matters operationally, not just arithmetically: the sentence directs **70% of SMS/USSD
onboarding and 240 of 400 ward captains** into "these 24 wards", and there is no list of 24 wards
consistent with the pool they are said to serve.

**Related:** the 65% "Mwingi + Kitui South" effort weighting sits against a zone table whose arid
belt *includes* Kitui East. See C-16.

---

## C-8 — Poll tier labels disagree · §0.1, §3.1.5, hero

**Status: Confirmed.** The same two poll rounds carry different tiers in different places:

| Round | Provenance cards | §0.1 and the hero | §3.1.5 table note |
|---|---|---|---|
| Mizani, 7 Aug 2026 | T3 | Tier 2 | "All Tier 2" |
| Politrack, 12 Mar 2026 | T3 | — | "All Tier 2" |

The evidence standard in Annex A (§3.2.2) is one of this proposal's stated commitments, and a
figure that carries a tier badge is making a claim about provenance. Until this is settled the
`DotRange` shows the tier **as stated in §3.1.5** and flags the disagreement, rather than choosing.

---

## C-9 — The 2026 register is T1 in one place and Tier 3 in another · §3.4.1

**Status: Confirmed.** 605,703:

- Register panel: **"T1 Confirmed against the IEBC ECVR county annex"**.
- §3.4.1 prose: *"Local outlets report Kitui at 605,703 … (**Tier 3 — [VERIFY]**)"*.
- Threshold table: **"Reported 2026 register … (Tier 3, unverified)"**.

The prose is emphatic that the figure is **not used in any calculation**, and §15.1 lists the IEBC
ECVR annex as the highest-priority data request precisely because it would re-base §3.4. A panel
asserting T1 is asserting that request has already been answered.

The ≈225,000 like-for-like figure derived from it checks out arithmetically (605,703 × 37.2% =
225,322), but it inherits whatever tier 605,703 has.

---

## C-10 — Margin of error quoted at one end of a range · §3.1.3

**Status: Confirmed.** "N = 1,200 to 1,500 … ±2.53%".

±2.53% is the margin at **N = 1,500**. At **N = 1,200** it is about **±2.83%**. Quoting the
best-case end of a stated range as if it were the margin of the whole range understates the
uncertainty by about 12%.

**What the figure does:** plot margin against sample size across the stated range, so both ends are
visible, rather than printing one number.

---

## C-11 — A developer artefact is visible to the client · §3.4.2

**Status: Confirmed.** In `public/content/analysis/scenario-benchmarks.json`, served to the browser:

> "Every input is a placeholder assumption from config/assumptions.yaml."

`config/assumptions.yaml` is a path inside Firefly's own analysis pipeline. In a confidential
proposal to a client, a figure citing a filename on someone else's machine reads as unfinished work.

The sentence is also doing honest and necessary work — it marks the scenario as modelled. So this is
a wording fix, not a deletion. **D-7** proposes: *"Every input is a stated assumption
(Section 15.3)."*

---

## C-12 — Who owns the six · §0.3 vs §8.0.1

**Status: Confirmed.** The two lists do not name the same six:

- **§0.3** gives Firefly: analysis, modelling, creative testing, the accessibility standard, the
  data layer, offline reach.
- **§8.0.1** gives Firefly the **tracker (WS1)**, and marks **accessibility (WS4)** as *"Firefly
  standard, team-executed"* — which is a different division of labour in two of six.

**The canonical `OwnershipGrid` is not drawn until this is settled**, because it is the one figure
whose entire job is to say who does what, and a figure that answers that question wrongly is worse
than the two lists it replaces. Rendered flagged in the meantime.

---

## C-13 — Two connectivity rates, both in use · hero, §2.3, §3.6, §3.6.1, §8.0

**Status: Confirmed, and it is the most widespread conflict in the document.**

`components/markdown/AnalysisBlocks.tsx` states, on the page:

> **"These figures supersede the 13.6% used in the surrounding text."** That rate is from the 2019
> census. The 2023/24 Kenya Housing Survey puts Kitui internet use at **26.2%** and phone ownership
> at **44.1%** …

Meanwhile **13.6% / 86.4% appears in twelve chapters** — `approach`, `arithmetic`, `assumptions`,
`audiences`, `measurement`, `objectives`, `reach`, `roadmap`, `scope`, `scope-ground`,
`scope-platforms`, `situation` — and in the hero.

So the site tells the reader, in its own words, that the number it is using throughout is
superseded. The gap is not small: 13.6% → 26.2% roughly **doubles** the digitally reachable
population, and "86.4% offline" is one of the three load-bearing constraints of the whole strategy.

**What the figures do:** show **both, dated and attributed** — 2019 census and 2023/24 KHS side by
side, with the 2019 ↔ 2023/24 toggle the conversion map specifies — until Firefly chooses. No figure
prints one rate alone.

---

## C-14 — Two nomination windows · rail vs §0.2

**Status: Confirmed.** `components/charts/DeficitGauge.tsx` line 254 prints a band labelled
**"29 Aug – 15 Nov 2026"**. The content says the window *"opens in late October"* (§0.2), and
§2.2, §16.1 and §15.2 all say **"the final quarter of 2026 — late October to November on the
reported timetable"**.

An opening date two months earlier than the text is not a rounding. Every deadline in the proposal
is set by this window, and the Phase −1 sprint exists to finish before it.

The underlying date is itself **Tier 3** — reported, not confirmed by Wiper — which the timeline
must show.

---

## C-15 — The "four stages" figure labels contradict §3.6 · hero

**Status: Confirmed.** `components/HeroVisual.tsx`, the `digital` stage:

```
statBadge: "200,198 registered voters — the Mwingi bloc"
```

§3.6 argues that the Mwingi bloc is reached **offline** — by Kikamba vernacular radio, SMS/USSD,
market-day barazas and mobile-money agents — and §3.6.3 rebalances effort *away* from digital
(45 → 18) and *towards* radio (20 → 37) precisely because of it.

So the document's headline figure labels its largest offline constituency as the digital stage's
audience. See also Phase 2 item 6: the figure is 3D, heavy on mobile data, and defaults on.

---

## C-16 — Zone coverage and the sub-county mismatch · §3.5.3, §3.5.4

**Status: Confirmed; the content already notes it.** The arid belt as drawn includes **Migwani** and
**Mwingi East**, which are sub-counties, against a constituency-based register. The note exists in
the prose and must be carried **onto the figure**, where the reader is actually looking.

This compounds C-7: the 65% effort weighting names "Mwingi + Kitui South", while the zone table's
arid belt reaches into Kitui East.

---

## C-17 — Offline reach figures carry no tier · §3.6.2

**Status: Confirmed; the content says so itself.** Church ~350k, markets ~280k, mobile-money agents
~180k, and the kiosk and ambassador counts are stated without a tier or a source, and the prose
acknowledges they need one.

Radio (~420k), SMS (~320k) and USSD (~250k) are the three that decide the strategy, and they sit on
the same chart as the untiered figures with no visible difference between them.

**What the figure does:** draw **"Source needed"** on every untiered bar, and carry the standing
warning that these channels **overlap and must not be added together** — a stacked or summed version
of this chart would claim a reach larger than the county's population.

---

## C-18 — The same 35,000 is printed as two different shares of the same register · §3.1.1.1

**Status: Confirmed. Found by the figure's own arithmetic, not by the brief.**

The digital platform sizing matrix states each platform's range as a "% of 532k Register". Two rows
of that table quote **35,000** against the same denominator and print two different answers:

| Row | Figure | Printed share | 35,000 ÷ 532,758 |
| --- | --- | --- | --- |
| 3. TikTok — low end | ~35,000 | **6.5%** | 6.5695% → **6.6%** |
| 4. YouTube — high end | ~35,000 | **6.6%** | 6.5695% → **6.6%** |

Every other cell in that column is correctly rounded: WhatsApp 12.2%/15.0%, Meta 9.4%/12.2%, TikTok's
high end 8.4%, YouTube's low end 4.7%, X 1.5%/2.3%. The TikTok low end is the single cell that is
truncated rather than rounded, and the row directly beneath it prints the right answer for the same
number — so the table disagrees with itself in adjacent rows.

**Scale of the error:** 0.1 of a percentage point, about 500 voters. It changes no argument. It is
logged because a reader who checks one cell of this table with a calculator will check the rest, and
because the figure that replaces the table computes its labels rather than transcribing them — it
would have silently printed 6.6% and quietly disagreed with a document nobody had been told was
wrong.

**What the figure does:** `platform-sizing` prints the shares it computes, and carries the **Under
review** flag on the TikTok band pointing here. Neither number in `public/content/reach.md` has been
changed. `figures.test.ts` asserts both: that the computed share is 6.6%, and that §3.1.1.1 printed
6.5%, so the discrepancy cannot be closed by accident in either direction.

**For Firefly:** correcting the content cell to 6.6% resolves it and moves nothing else. The
alternative — that the low end was meant to be 34,600 or similar — would contradict the "~35,000"
stated twice more in the same section.

---

## C-19 — Eight subsection numbers in §3.6 belong to a chapter that no longer exists · §3.6.1, §3.6.2

**Status: Confirmed. Found while citing §3.6 in the reach figures.**

`public/content/reach.md` numbers its chapter **3.6** and its sections **3.6.1**, **3.6.2**, **3.6.3**
— and then numbers every subsection beneath them **3.1.x**:

| Heading in the file | Its parent section |
| --- | --- |
| `#### 3.1.1.1 Platform Sizing & Realistic In-County Reach` | 3.6.1 |
| `#### 3.1.1.2 What Digital CAN Do` | 3.6.1 |
| `#### 3.1.1.3 What Digital CANNOT Do` | 3.6.1 |
| `#### 3.1.2.1 Kikamba Vernacular Radio` | 3.6.2 |
| `#### 3.1.2.2 Direct 2G Bulk SMS & USSD Service` | 3.6.2 |
| `#### 3.1.2.3 Mobile-Money (M-Pesa) Agent Network Strategy` | 3.6.2 |
| `#### 3.1.2.4 Open-Air Market Day Barazas & Caravan Circuits` | 3.6.2 |
| `#### 3.1.2.5 Church Fellowships & Clergy Engagement` | 3.6.2 |

The chapter was renumbered from 3.1 to 3.6 at the `##` and `###` levels and the `####` level was
left behind. It reads as a survivor of an earlier structure, not as a deliberate cross-reference.

**It is the only place in the document this happens.** Every heading in all 30 chapters was checked
against its parent: these eight are the entire set. That is what makes it safe to call an artefact
rather than a convention.

**Consequence:** anything citing this material by its printed number cites a section that does not
exist. A reader looking up "§3.1.2.1" finds §3.1, *The strategic situation*, which is about the
nomination contest and says nothing about radio.

**What the figures do:** cite the section that actually contains the material — §3.6.1 for platform
sizing, §3.6.2 for the offline channels, §3.6.3 for the rebalance — and carry the **Under review**
flag pointing here, because the printed subsection numbers and the cited ones do not match and a
reader comparing them deserves to know which is which. No heading in `public/content/` has been
renumbered.

**For Firefly:** renumbering the eight to 3.6.1.1–3.6.1.3 and 3.6.2.1–3.6.2.5 resolves it. Nothing
elsewhere in the document links to the 3.1.x forms — checked — so the change is local to this file.

---

## C-20 — Musyi FM is a hostile gatekeeper and a priority placement, in the same section · §3.7, §3.7.1, §3.6.3

**Status: Confirmed. Found while reading §3.7 for the ownership figure.**

§3.7's bypass-architecture diagram opens with a list headed **"TIER 1: HOSTILE / GATEKEEPER
COMMERCIAL STATIONS"**, and the first station in it is **Musyi FM**. Twelve lines later, §3.7.1
says the opposite:

| Where | Musyi FM is |
| --- | --- |
| §3.7 diagram | a **Tier 1 hostile / gatekeeper** station — "politically aligned ownership & editorial vetoes", to be bypassed |
| §3.7.1 prose | "**open to the campaign** … commercially or institutionally independent (Royal Media Services)". "These carry the placement budget." |
| `data/media-ownership.ts` | `posture: "Priority — commercially independent, broad Ukambani reach."` |
| §3.6.3 rebalance | "Vernacular radio (**Musyi**, County, Wikwatyo)" — the row effort is scaled *up* into, from 20% to 37% |

Three of the four agree, and they are the three the campaign acts on: the placement budget, the
effort rebalance and the station data the site renders. The diagram is the outlier.

**Athiani FM is a milder version of the same thing.** The diagram files it under the same hostile
heading; §3.7.1 says it is "**party-sensitive rather than hostile**", and the data reads
"Party-aligned, not neutral." Hostile and party-sensitive are different postures with different
instructions, and the document gives both.

**This one is operational, not arithmetical.** §3.7's own opening sentence says the highest-reach
Kikamba stations "are owned, financed, or editorially steered by active political rivals" — if
Musyi FM is one of them, the placement budget in §3.7.1 is going to a station the campaign has
already called hostile. If it is not, the bypass architecture is being built around a station that
was available all along. A reader cannot tell which from the document.

**Two stations named in the diagram are not in the station data at all:** **Sang'u FM** (listed as
hostile) and **Mang'elete** (listed as a neutral bypass route). Both appear in the prose of six
other chapters. `data/media-ownership.ts` carries eight stations and neither is among them, so
nothing renders an ownership, a frequency or a posture for either.

**What the figure does:** the ownership grid draws the posture from `data/media-ownership.ts` —
the reconciled version §3.7.1 points to and §8.7.1 governs — and carries the **Under review** flag
naming the diagram's contrary reading, rather than choosing between them. Stations the data does
not cover are shown as **not in the ownership map** rather than omitted, because an absence a
reader cannot see is the one kind this audit will not produce.

**For Firefly:** this needs answering before any placement is booked, which §3.7.1 already says is
a standing instruction. It is the only conflict in this file with a spending decision attached.

---

## C-21 — §7.3.1 puts Kikamba on a rail the Communications Authority closes to it · §7.3, §7.3.1 vs §8.10.2

**Status: Confirmed, and it is a compliance conflict rather than an arithmetical one.** It is the
most consequential entry in this file after C-2.

§7.3.1's trilingual matrix lists Kikamba's dominant media channels as:

> • Vernacular Radio (Musyi, Wikwatyo) • **2G Bulk SMS & USSD** • Baraza PA Addresses • Megaphone
> audio clips

§7.3's banner above it says the same: "Vernacular Radio Spots, Baraza Speeches, **2G SMS**,
Megaphone Audio & USSD".

§8.10.2 says the opposite, and cites a Tier 1 source for it:

> The CA/NCIC guidelines on political bulk messaging restrict political SMS to **English or
> Kiswahili** (Tier 1, Communications Authority). … they allow the operator to **refuse** a
> non-compliant message outright.
>
> **This changes the channel plan, not the language strategy.** Kikamba … simply cannot ride the
> bulk SMS rail.

**The rest of the document is on §8.10.2's side, in six places**, which is what makes this a
drafting survival rather than an open question:

| Where | What it says |
| --- | --- |
| §7.3.4 | "Direct 2G Bulk SMS — **80% Kiswahili** (Rural), 20% English". Kikamba gets no allocation. |
| §5.1.1 / §5.1.2 | "Kikamba on voice; **Kiswahili on SMS**" |
| §5.1 | "Bulk political SMS is restricted to English or Kiswahili by the CA/NCIC guidelines" |
| §3.6.2 | "Dispatching customised **Kiswahili** messages … the Kikamba version travels by voice note" |
| §9 deliverables | "**Kikamba is not permitted on the bulk SMS rail** (§8.10.2)" |
| §13 rapid response | rebuttals run "across all channels **except bulk SMS**" |
| §7.1 | "a 160-character **Kiswahili** SMS" |

**USSD is not affected.** §7.3.4 allocates the USSD menu 50% Kikamba, and §8.10.2 explicitly lists
"USSD menu text" among the places Kikamba belongs. It is the **bulk SMS** half of §7.3.1's "2G Bulk
SMS & USSD" that the guideline closes.

**Why it matters operationally.** The SMS rail is the channel §3.6.2 sizes at **320,000 reachable
voters**, the largest in the plan after radio, and §8.10.2 adds that every bulk political message
must be lodged with the operator 48 hours in advance with verbatim text — so a Kikamba SMS is not
merely off-strategy, it is a message an operator may refuse after the campaign has committed the
lead time. A field team working from §7.3.1's matrix alone would draft one.

**What the figure does:** `language-map` prints Kikamba's channel list exactly as §7.3.1 states it,
including 2G Bulk SMS, and carries the **Under review** flag naming §8.10.2 against it. The
`language-deployment` figure beside it shows §7.3.4's allocation, where the same channel is 80%
Kiswahili and 20% English. Neither line has been changed.

**For Firefly:** §8.10.2's own wording — "this changes the channel plan, not the language strategy"
— reads as the resolution already written down. Striking "2G Bulk SMS" from §7.3.1's and §7.3's
Kikamba channel lists, leaving USSD, reconciles all eight places and moves nothing else.

---

## C-22 — 500 signatures per sub-county, or 500 in total? · §13.5 vs §13.5.1

**Status: Confirmed, and the two readings differ by a factor of eight.**

Two blocks fifty lines apart state the IEBC nomination endorsement requirement, and they do not
state the same requirement:

| Where | What it says | What that means |
| --- | --- | --- |
| §13.5, statutory compliance architecture | "**500** Registered Voter Nomination Endorsement Signatures **per Sub-County**" | 500 × 8 = **4,000 signatures**, in every sub-county |
| §13.5.1, IEBC clearance checklist | "**500** registered voter signatures **from at least 5 of the 8 Sub-Counties**" | **500 signatures in total**, spread across a minimum of five |

One is a per-sub-county quota. The other is a countywide total with a geographic spread condition.
They cannot both be the requirement.

**The status column implies a third figure again.** §13.5.1's own status cell reads "Field Ops
registering **250 signatures per ward** (10,000 total buffer roll)" — 250 × 40 wards = 10,000, which
checks out as arithmetic and is 20× the 500 total or 2.5× the 4,000 quota. As a deliberate buffer
that is defensible under either reading; it is noted here only because a reader reconciling the two
statements above will reach it next and find a third number.

**This is a filing requirement, which is what makes it worth flagging.** A nomination paper short of
the statutory endorsement count is rejected, and the rejection is not appealable on the basis that
the campaign's own brief said 500. The correct figure is in the Elections Act regulations the
checklist cites; this audit does not assert which reading is right, because reading the regulation
is not something a figure should do on Firefly's behalf.

**What the figures do:** `compliance-architecture` prints §13.5's wording and `iebc-clearance`
prints §13.5.1's, each with the **Under review** flag pointing here. Neither has been changed, and
neither figure resolves them into one number.

**For Firefly:** this needs the regulation checked and one of the two lines corrected before the
nomination window. It is the second conflict in this file with a deadline attached, after C-21.

---

## Standing figure rules that come out of this file

1. No figure prints a disputed number alone. It shows every stated version, dated and attributed.
2. Modelled, illustrative and qualitative values are drawn as ranges, bands or categories — never as
   precise measurements. The preference-vs-credibility scatter's vertical axis is an editorial
   reading and becomes categorical bands for this reason.
3. Every figure touching an entry above carries the **Under review** flag and links here.
4. Tier badges show the tier **as the section states it**, and flag disagreement rather than
   resolving it.
