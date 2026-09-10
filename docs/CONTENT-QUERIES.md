# Content queries — September 2026 accuracy pass

Everything below was found by reading the document against itself. Each item says what the
document currently claims in two places, what was done, and what is left for the campaign to
decide. **Nothing here was resolved by inventing a figure.** Where a correction was applied it
is either a recomputation from figures the proposal already publishes, or the adoption of one
of the document's own two statements over an unsourced one — and every body-text edit is quoted
old and new in `scripts/notation-rewrites.json`, which the build guard checks on every commit.

Four items still need a decision from the campaign — items 1, 2, 8 and 10. They are
marked **DECISION**.

---

## 1. Pledged-voter baseline — 45,000 against 0 · **fixed, DECISION available**

§8.1.2 GE-01 gave an empirical baseline of **45,000** pledged voters, annotated "Central
Baseline". §9.1.2 Commitment 3, four pages earlier, gives the baseline for the same quantity as
**0 registered, verified supporters in the campaign's centralized database**, with a named
owner (Director of Field Operations & Database Management), a deadline (31 May 2027) and an
escalation trigger.

Both cannot hold, and this is the most damaging pair in the document: a reader who catches it
has no way to tell which of the other eight indicators are also wrong.

**Applied.** GE-01 now reads `0 pledged voters (Section 9.1.2)`. Grounds: 45,000 appears
nowhere else in the proposal, in `data/`, or in any source; it carries no measurement date and
no method. The §9.1.2 zero is the campaign's own operational record. GE-03 and GE-05 in the
same table already read 0. This is the remedy the earlier audit applied to the four unsourced
NW-01…04 baselines rather than choosing between two unsourced values.

**DECISION.** If Dr. Mulu's constituency operation does hold an inherited database of roughly
45,000 contacts, that is a real asset and this fix is backwards. The right correction then is
to restore the figure here **with its source and its as-of date**, and to amend §9.1.2
Commitment 3 to say the campaign starts from that base rather than from zero. Please confirm
which way round it goes.

## 2. Ward Captain baseline — 120 against 0 · **fixed, same DECISION**

§8.1.2 GE-02 gave **120 Captains**, annotated "Central only". §9.1.2 Commitment 5 gives **0
active Ward Captains**, with an owner, a deadline of 31 January 2027 and a trigger.

**Applied.** GE-02 now reads `0 active Captains (Section 9.1.2)`, on the same grounds as item 1.
`data/kpis.ts` was updated to match, so the scorecard component and the table cannot drift
apart.

**DECISION.** Same question. If 120 captains are already active somewhere in the county, say
where and as of when, and both places should carry that instead.

## 3. The 13.6% internet-use figure had the wrong denominator · **fixed**

§4.3.1 read: *"Kitui has 143,340 internet users out of a population of 1,136,187 — 13.6%. It
has 452,948 mobile phone owners — 42.9%."*

Neither percentage works against 1,136,187: 143,340 / 1,136,187 is **12.6%**, and
452,948 / 1,136,187 is **39.9%**. Both work exactly against the base §2.2 states — **1,053,991
residents aged 3 and above**, which is the population the census measures internet use for:
13.6% and 43.0%.

This is the arithmetic the entire offline argument rests on, and it is the one sum in the
document a reader can check in their head.

**Applied.** The denominator is corrected to the one §2.2 publishes. No percentage changed.
`data/county-profile.ts` now derives 86.4% from the two figures so nothing types it again.

## 4. The turnout assumption behind "~53.4%" · **fixed**

§8.2.3 described 200,000 votes as *"~53.4% of expected turnout across Kitui's 532,758
registered voters"*. That implies an expected turnout of about **374,500** — a 70.3%
participation rate the document assumes nowhere.

What the document does state, in §1.3.1, is a **62.0% countywide participation baseline**
(Tier 1, §1.2.3), worked through to **~330,310 ballots cast**. Against that, 200,000 is
**60.5%**.

`charts/VoteFunnel` was quoting 53.4% while drawing 330,310 in the same figure.

**Applied.** §8.2.3 now reads "approximately 60.5% of the ~330,310 ballots expected at the
county's 62.0% participation baseline", so the assumption is stated rather than hidden inside
the percentage. The chart derives the share instead of carrying it as text.

## 5. The KPI architecture box disagreed with the scorecards it summarises · **fixed**

Four labels in the §8.2.3 box:

| Box said | Scorecard says |
|---|---|
| North Sub-County Name ID (>65%) | NW-02: **≥ 70.0%** |
| Wiper Primary Share (Target >55%) | NW-01: **≥ 55.0%** |
| Delegate Endorsement Pledges (8/8) | NW-04: Sub-County Wiper **Executive Branch Committees** |
| (Primary Delegate / Voter Preference) | NW-01: sampled likely Wiper **primary voters** |

**Applied.** All four now match the scorecards. The two "delegate" labels are the same problem
as item 6.

## 6. Delegates against opinion poll · **fixed**

§1.1 reports that the party intends to select its Kitui nominee **by opinion poll rather than a
competitive primary**, and that *"there is no delegate contest to organise"* — flagged Tier 3,
unconfirmed by Wiper.

Against that, the document elsewhere referred to delegate endorsement pledges, "primary
delegate/voter preference share", and the polling simulator spoke of establishing a mandate
"before delegates convene in late 2026".

**Applied.** The three UI and summary references now name the Wiper Executive Branch Committees
that NW-04 actually measures, and the simulator refers to the party's opinion-polling window,
which §8.3.1 dates to late October 2026.

**Nothing else needed, and worth saying why.** §1.1's *Delegate Whip Contingency Plan* also
reallocates the 400 Ward Captains to whip operations against an estimated 1,200–1,500
delegates. That is not a contradiction: it opens *"If Wiper party leadership departs from the
opinion-poll mechanism and reverts to a delegate-based nomination primary"*, so the proposal
already states it is resourced for both routes and names the trigger that picks one. It is one
of the better-argued passages in the document and nothing was changed in it.

What was wrong was only the summary layer above it — a box and a simulator caption that
asserted a delegate contest as fact where §1.1 is careful to call it a contingency.

## 7. Village Ward Captain against Ward Captain · **fixed** — and a correction to our own first reading

Three mentions called the 400-strong network **Village Ward Captains** or **Village Captains**;
21 others, including §9.1.2 Commitment 5, §8.1.2 GE-02 and `data/kpis.ts`, call it **Ward
Captains**. GE-02's own definition gives 10 per ward across 40 wards under both names, so they
are one structure.

**Applied.** Unified to Ward Captain.

**A correction worth recording.** This pass initially also folded the document's six "ward
champion" references into Ward Captain, on the reading that one network was being named three
ways. That was wrong, and the document says so two sections further on. §4.4's tiered volunteer
programme defines **Ward Champion as tier 2 of four** — entry is a ward WhatsApp group plus a
data-handling briefing; the duties are distributing content, reporting ground sentiment and
recruiting five advocates. §7.2's team table carries a **Volunteer & Ward Champion
Coordinator** for that programme, distinct from the Groundgame Director who owns the 400
captains. Two structures, described consistently. **The seven renames were reverted** and the
document is unchanged on this point.

The one thing worth doing here is editorial, not factual: the two roles are one word apart and
a reader meeting "ward champion" in §5.3 has no reason to know it is not a Ward Captain. A
single sentence in §4.4 saying so — *"Ward Champions are volunteers in the tiered programme
below; the 400 Ward Captains of §9.1.2 are a separate, vetted field structure"* — would settle
it. We have not added it, because adding a sentence to the body is the campaign's call.

## 8. Nomination close date — four values in play · **DECISION, nothing changed**

| Where | What it says |
|---|---|
| §9.1.1 | Active period **29 August 2026 – 15 November 2026** |
| §1.1 | Senior party strategists intend to conclude **prior to the final quarter of 2026** |
| §9.1.1 Commitments 1–2 | Deadlines of **31 October 2026** |
| §8.3.1 | The Wiper opinion-polling window **commences in late October 2026** |
| §8.6 | Decision target **15 September 2026**, to allow 45 days before that window |

These are not all contradictions — a window that opens 29 August and closes 15 November can
contain an October polling exercise and a 31 October commitment deadline. But "prior to the
final quarter of 2026" (i.e. before 1 October) cannot sit with a window that closes on
15 November, and a reader has to build that reconciliation themselves.

**Nothing changed.** This needs one sentence from the campaign stating the operative dates and
which of them are the party's and which are Firefly's. Once we have it, the phase rail and the
countdown can key off a single source.

## 9. The 2019 population in the site chrome · **fixed**

The header ticker read **"1.3M+ Population Outreach"**. §2.2 gives **1,136,187** on the 2019
census (Tier 1) and puts the 2024 projection at approximately 1.2 million (Tier 2). 1.3M is
above both. **Applied:** the chrome now reads the census figure from a canonical store.

Three other items in that same ticker — *"Kitui Central Digital Pilot Complete"*, *"Interactive
FM Radio Aircover Synced"*, *"Township Business Coalition Networks"* — described work as
finished that no section of the proposal claims has begun. They are removed. If any of them
**is** complete, it is a strong credential and belongs in the body with a date, not in a strip
of decorations.

## 10. The party's name · **fixed**

The site chrome said **Wiper Patriotic Front (WPF)** in five places and **Wiper Movement** in
the watermark. All nine content files say **Wiper Democratic Movement**. **Applied:** the
chrome now matches the document.

**DECISION, if applicable.** If Wiper has rebranded and "Wiper Patriotic Front" is now correct,
then the nine content files are the ones that need changing, and the rebrand should be stated
once where the party is first named.

## 11. The hero's four figures · **fixed**

The opening panel showed `77,764 Home Base`, `40 Wards Deployed`, `200,198 Mwingi Pivot` and
`198,004 Win Baseline` as one series of bare numbers. Two are register counts, one is a ward
count, and one is a 2022 vote total. **200,198 registered and 198,004 cast are four digits
apart and read as a typo of one another.** Each badge now carries its unit.

---

## Deliberately left alone

- **The §3.3.3 / §9.2.1 regulated-window question.** Flagged in the document as a question for
  counsel. It is one of the proposal's strongest credibility moves and resolving it here would
  be pretending to an answer nobody has.
- **The three disputed external figures** in `data/disputed-figures.ts` (Kitui Central's 2019
  population, Musila's 2022 runner-up total, the FY2025/26 Q1 absorption rate). Each keeps both
  values, both sources, and either a stated preference or the document that would settle it.
- **NW-01…04's "Not yet measured (Week 1)" baselines** and the hatched tracks that draw them.
  They are the document's core credibility device and no estimate was substituted for any of
  them.
- **The 20 remaining `[Insert…]` / `[Confirm…]` placeholders.** Each is a campaign decision or
  a primary document Firefly does not hold.
- **The Kikamba and Kiswahili strings** on the USSD and SMS mockups, which remain behind
  §3.6.3's four-stage approval chain rather than being drafted here.
