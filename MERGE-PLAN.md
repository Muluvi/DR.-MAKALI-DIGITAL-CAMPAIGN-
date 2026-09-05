# MERGE PLAN — structural consolidation of the Makali Mulu proposal site

Written before any application code was touched. Phases 0–2 (recon, inventory,
diagnosis) are summarised here; the full section-by-section evidence base is in
[`INVENTORY.md`](./INVENTORY.md). Every removal is logged in
[`CUT-LOG.md`](./CUT-LOG.md).

---

## 1. What a "section" is, and how many there are

**Definition.** A section is a numbered `##` or `###` heading in
`public/content/*.md`. This is not my definition — it is the application's.
`lib/section-index.ts` builds the table of contents from exactly these headings
(`/^(#{2,3})\s+(.+?)\s*$/`, fenced blocks skipped, leading section number
required), and `lib/heading-slug.ts` mints the deep-link id `<tab>-sec-<number>`
from the same match. `####`/`#####` headings sit *inside* a section: they become
disclosure panels through `lib/collapse-groups.ts` and never enter the index.

**Count: 262.** 50 `##` + 212 `###`. This is exactly the brief's figure, and
every heading carries a leading number, so nothing is unindexed.

**Stack.** Next.js 15 (App Router, single static route), React 19, TypeScript,
Tailwind v4, Recharts, framer-motion, `react-markdown` + `remark-gfm` +
`rehype-raw`. Content is ten markdown files read on the server in
`app/page.tsx`; markdown parsing never reaches the client bundle. Deployment is
Vercel. Build is gated by two `prebuild` guards — `verify-ward-register.mjs`
(ward arithmetic) and `verify-figures.mjs` (**every numeric literal rendered in
`components/` must appear in `public/content/*.md` or `data/`**).

That second guard matters enormously here: it makes the preservation rule
mechanical. Delete a figure from the markdown while a component still displays
it and the build fails.

---

## 2. Diagnosis

Each section was scored against the brief's three questions. Rather than publish
262 scores, the diagnosis is expressed as the four failure patterns they cluster
into, with the evidence for each.

### 2.1 Scoring, in aggregate

| Question | Finding |
|---|---|
| **Does it help Dr. Mulu decide?** | The decision inputs are strong but thinly spread. The three things that actually drive a yes/no — the nomination deadline, the budget tiers against the statutory ceiling, and what Firefly commits to deliver — occupy 13 of 262 sections. |
| **Does it prove capability, or assert it?** | The proposal proves far more than it asserts: ward-level arithmetic with the working shown, verified market rates, a named compliance gate, published data gaps. The problem is that the proof is *diluted*, not absent. |
| **What does it cost in time?** | 49,663 words across 262 headings. 78 sections (30%) carry under 80 words — the reader pays a heading's worth of attention for a paragraph's worth of content. |

The core pathology is not padding. It is **the same material written twice, in
two generations, and never reconciled** — an ASCII-diagram generation and a
markdown-table generation of the same analysis, both retained. This is visible
in the repository's own history ("Restructure the proposal content into ten
candidate-facing sections", "the document has been renumbered twice") and in
`lib/collapse-groups.ts`, which notes that "every hardcoded section list in this
repo had drifted out of date by the time anyone looked at it."

### 2.2 Exact and near-duplicates

| # | Duplicate pair | Evidence |
|---|---|---|
| D1 | **§3.4.1 and §3.5.1** both map Kamba-language radio ownership and political alignment | §3.4.1 as a 42-line ASCII table, §3.5.1 as a 9-row markdown table. Same stations, same rivals, same conclusion. |
| D2 | **§7.2 and §7.3** are two parallel accounts of the same team | Two role tables (§7.2.2 / §7.3.2), two cadence tables (§7.2.5 / §7.3.4), two governance models (§7.2.4 / §7.3.3), two lean-model arguments (§7.2.1 / §7.3.1). |
| D3 | **§5.1 and §5.2** are two crisis systems | Two monitoring inventories, two severity ladders, two pre-drafted message libraries. |
| D4 | **§5.2.2 and §5.4.2** — identical heading "Monitoring tools" | 4 of 6–8 rows identical (Meta Ad Library, Google Ads Transparency Centre, social listening, radio monitoring). |
| D5 | **§4.1 and §4.2** both describe the field↔digital closed loop | §4.1 has the mechanism without the governance; §4.2 has the governance without the mechanism. |
| D6 | **§1.2.3 and §1.3.2** both print the complete 40-ward register | The same 40 numbers, once grouped by constituency and once ranked. ~450 words duplicated. |
| D7 | **§1.2.2 and §1.2.10** both profile the same eight rivals | §1.2.2 the analysis, §1.2.10 the same people again with the sourcing standard. |
| D8 | **§1.2.5 and §1.2.8** both cover drought, IPC Phase 2 and the March 2026 floods | |
| D9 | **§8.2.3 and §8.2.4** both make the reject-vanity-metrics argument | |
| D10 | **§2.7.5 and §7.2.6** are two content-approval authorities | A 4-step "Governance Gateway" in §2 and a sign-off table in §7. §9.3.4 names §7.2.6 as the one that governs. |
| D11 | **§0.4 and §9.3.6** both argue "remote is not a compromise" | Thesis duplicated; substance complementary. |
| D12 | **§1.2.7 and §2.1.2** print the same four OAG audit queries verbatim | KSh670m / 1.09bn / 621.5m / 356.2m, plus the KSh1.3bn pending bills. |
| D13 | **§2.6.3, §2.7.2 and §3.6.4** are three channel matrices | message-by-channel, format-by-channel, language-by-channel. |

### 2.3 Fragments — sections carrying one idea that cannot stand alone

78 sections are under 80 words. The worst clusters:

- **§9.3.1–9.3.4** — 139 words across four headings ("Weekly strategy syncs" 30w,
  "Asset centralisation" 47w, "Performance tracking" 30w, "Escalation" 32w).
  One working relationship, quartered.
- **§2.2.1–2.2.4** — the four campaign pillars as four headings totalling 178
  words, while a `StrategicPillarsMatrix` component already renders them as a
  comparison at the parent heading. The prose duplicates the matrix.
- **§5.2.1** (15w), **§5.2.6** (24w), **§5.4.4** (20w), **§4.4.1** (17w),
  **§3.7.1** (19w), **§6.4.1** (23w) — ledes that were promoted to headings.
- **§1.1.1 "How Wiper picks its candidate" is completely empty.** Zero words, no
  children. It appears in the table of contents and the mobile TOC as a
  navigable entry that lands on nothing.

### 2.4 Orphaned data points

This is the category with the most analytical value locked up in it.

**The KPI diaspora.** Seven programme KPI tables sit at the tail of seven
unrelated subsections, in three different files: §3.5.6 (earned media), §3.7.5
(accessibility), §4.3.6 (offline layer), §4.4.5 (volunteers), §4.5.4
(coalition), §8.4.5 (message lab), §8.5.7 (tracker). None is cross-referenced
from anywhere. A reader cannot answer "what is Firefly actually committing to
be measured on?" without finding all seven and assembling the answer by hand —
and cannot see that one of them (§4.5.4, endorsements) is still an unfilled
`[Insert target]`.

**The severity ladder, split and contradictory.** §5.1.2 defines four tiers;
§5.2.4 defines three with the same "Level N" labels and different clocks.

**The team, split and contradictory.** §7.3.1 argues from a "4-person core
command structure"; §7.2.2, §9.2.5 and §9.2.6 all describe a 3-person core.

**Compliance, scattered across 13 sections** in three files — §3.3.3, §3.3.4,
§6.1.5, §6.1.6, §6.5.1–6.5.5, §6.6.1–6.6.3, §9.2.1, §9.2.4, §9.2.7.

**The honest-gaps ledger, scattered.** §1.3.6, §2.4.3, §3.3.2 and §6.1.6 each
publish what the campaign does *not* yet know. Together they are one of the
proposal's strongest credibility assets; apart, each reads as a caveat.

### 2.5 Sequencing that breaks the argument

- **§3.7 "Accessibility and inclusion" opens with 256 words about language** —
  Kikamba proverbs, the 50/30/20 content mix, the Kikamba-producer governance
  rule. That is §3.6's subject. The actual accessibility argument does not begin
  until §3.7.1. The section is two topics wearing one heading.
- **§0.3 points at §3.5 for the radio bypass; the bypass is in §3.4.3.** The
  duplication in D1 has desynchronised the pointer from the content.
- **§8.2 announces "Subsection 19A" and "Subsection 19B"** as its two halves —
  labels from a numbering scheme that no longer exists.
- **§1.1's opening** tells the reader that if the poll assumption is wrong, "the
  phasing in Section 8.2.3 needs to be revised". §8.2.3 is the KPI framework;
  the phasing is §8.3.

### 2.6 Defects surfaced by the audit

These are not consolidation opportunities — they are faults that fragmentation
concealed. They are fixed or flagged, never silently resolved.

**Dead cross-references (10 occurrences, 5 labels):** `Subsection 17A` ×4
(3-channels), `Subsection 19A/19B` ×5 (8-measure), `Section 16.4` (6-data
§6.5.3), `Section 16.5` (4-ground §4.3.2), `Section 16A` (7-team §7.1.6). None
resolves; `crossSectionTarget()` returns null and they render as inert text.

**Mis-targeted cross-references (6):** they resolve, but to the wrong topic.

| Location | Cites | Which is actually | Should be |
|---|---|---|---|
| §5.1 | §6.1.2 for "Defamation Law Safeguards" | "Every figure carries its provenance" | §5.1.5 |
| §9.3.3 | §5.1.5 for "the analytics maturity roadmap" | "Staying inside defamation law" | §6.4.5 |
| §4.1.3 | §4.3.4 for "the 40 major market centers" | "Voice and audio" | — |
| §8.2.3 | §1.2.3 for the vanity-metrics doctrine | "The 2022 baseline, ward by ward" | §8.2.4 |
| §1.1 | §8.2.3 for "the phasing" | "The KPI framework" | §8.3 |
| §4.3.2 | §3.6.4 for the consent regulatory basis | "Channel-by-language deployment" | §6.5.2 |

**Twelve stale banner labels** reading `SECTION 10 STRATEGIC TAKEAWAY` …
`SECTION 20 STRATEGIC TAKEAWAY` are rendered to the reader inside ASCII boxes,
numbered from a scheme two restructures out of date.

**Contradictions requiring a campaign decision** — see §6, TODOs. These are
*not* resolved here, because resolving them would mean altering a commitment.

---

## 3. Target architecture

The ten top-level documents are correct and stay. They are a reader's arc, not a
filing system, and the brief is a structural consolidation, not a re-scope.

What changes is the *inside* of six of them. The organising principle:

> **One subject, one section. Where two sections describe the same mechanism,
> they merge. Where a section is the evidence for another section's claim, they
> merge. Where a section is genuinely a different question, it stays — however
> short.**

### Final count: 262 → 196 *(as built)*

The number is an output, not a target. It is what remains after applying the
merge criterion, and it decomposes as:

| Document | Before | After | Change |
|---|--:|--:|--:|
| §0 Overview | 4 | 4 | 0 |
| §1 Where the race stands | 30 | 23 | −7 |
| §2 The argument we will make | 36 | 26 | −10 |
| §3 What we publish, and where | 33 | 24 | −9 |
| §4 What we run on the ground | 29 | 19 | −10 |
| §5 Defending the campaign | 26 | 17 | −9 |
| §6 Data, technology and compliance | 36 | 32 | −4 |
| §7 Who does the work | 19 | 8 | −11 |
| §8 How we will know it is working | 30 | 27 | −3 |
| §9 What we are asking for | 19 | 16 | −3 |
| **Total** | **262** | **196** | **−66** |

*(Planned 193. The three-section difference: §3 and §6 each kept one section the
plan proposed merging — see "Changed during implementation" below — and §8 gained
the consolidated KPI ledger as a new section.)*

**Why not lower.** Roughly 90 of the remaining sections are irreducible
evidence: §1.3's six-part ward arithmetic (four routes to the threshold with the
working shown), §6.1/§6.2/§6.6's data model, variable dictionary and statutory
pack, §8.3's five phases, §9.2's tier economics. Compressing those would destroy
the thing that makes this proposal credible — that it shows its working. The
brief's own instruction applies: a section that earns its independence keeps it.

**Why not higher.** Every merge below buys a comparison, a trend, a breakdown or
a cause-and-effect that the fragments could not deliver. None is made to reduce
the count.

---

## 4. The merges

Format: **sources → target · rationale · analytical gain** (what the merged
section lets the reader see that the fragments did not).

### §1 — Where the race stands (30 → 23)

**M01 · §1.1.1 (empty) → removed; §1.1.2–1.1.6 renumber to §1.1.1–1.1.5**
A heading with zero words and no children, live in the TOC. Not a merge — a
defect fix.
*Gain:* removes a navigable entry that lands on nothing.

**M02 · §1.2.10 → §1.2.2**
Both profile the same eight rivals; §1.2.10 adds the legal-attribution standard
and per-rival sourcing.
*Gain:* each rival's profile now carries its own evidentiary tier and legal
caution **inline**, instead of the caution arriving eight subsections later. The
reader sees claim and permissible-basis together — which is the whole point of a
document that says "no wrongdoing is asserted as settled fact."

**M03 · §1.2.8 → §1.2.5**
§1.2.5 already carries drought, IPC Phase 2 and the March 2026 floods under
"Natural Hazards"; §1.2.8 restates them and adds the CECM's 28,000-households
food-reserve figure.
*Gain:* the 28,000-household claim lands **next to** the 2019 census count of
262,942 households it is being questioned against. The document already flags
that discrepancy; adjacency is what makes the flag legible.

**M04 · §1.2.3's ward listing deduplicated against §1.3.2** *(no section removed)*
The 40-ward register appears twice. §1.2.3 keeps the constituency subtotals its
own "Mwingi bloc" finding needs; the full ward detail lives once, in §1.3.2's
ranked table where it carries cumulative share.
*Gain:* the "top 12 wards = the entire winning threshold" insight becomes
visible **on the register it is derived from**, instead of requiring the reader
to re-sort a constituency listing mentally. Removes ~450 words of duplicated
data and one drift risk.

**M05 · §1.4.1–1.4.4 → §1.4**
Four regional profiles of 115–190 words plus a weighting note, under a 28-word
parent that already binds `GeographicZoneMatrix`.
*Gain:* the three zones become a **comparison** — weight, character, recognition
position and channel reality read across rather than down.

### §2 — The argument we will make (36 → 26)

**M06 · §2.2.1–2.2.4 → §2.2**
178 words in four headings, duplicating the `StrategicPillarsMatrix` bound at
the parent.
*Gain:* four pillars side by side instead of stacked, and the prose stops
restating the matrix beside it.

**M07 · §2.6.2 → §2.5**
Two segment→message mappings.
*Gain:* one place answers "who are they → what do we say → where". It also makes
visible that §2.4.1's six segments and §2.5's seven are different taxonomies —
see TODO-4.

**M08 · §2.6.3 → §2.7.2**
Message-by-channel and format-by-channel, in separate subsections.
*Gain:* each channel now shows **what we say and in what form**, in one row.
Planning a channel stops requiring two lookups.

**M09 · §2.8.1 → §2.8 preamble** — a 59-word ethical boundary statement promoted
to a heading. *Gain:* the boundary is read as a condition of the whole section
rather than as one of its parts.

**M10 · §2.9.1–2.9.3 → §2.9 preamble** (§2.9.4 keeps its anchor, referenced from
§9.2.2). *Gain:* one AI operating picture — permitted use, tooling, cadence —
instead of three 60–100-word fragments.

**M11 · §2.7.5 → §7.2.6**
Two content-approval authorities. §9.3.4 names §7.2.6 as the one that governs.
*Gain:* **one approval matrix.** Today a reader meets a 4-step gateway in §2 and
a sign-off table in §7 and cannot tell which binds.

### §3 — What we publish, and where (33 → 22)

**M12 · §3.4 + §3.5 → §3.4 "Earned media, radio and the gatekeeper bypass"**
*(2 H2 + 10 H3 → 1 H2 + 6 H3)* — the largest single merge.
Sources: §3.4, §3.4.1–3.4.4, §3.5, §3.5.1–3.5.6.
*Gain:* the earned-media argument becomes a **causal chain in one scroll** —
*this* is who owns the airwaves (one station map, merging the ASCII and markdown
versions) → *therefore* this is the bottleneck → *therefore* this is the bypass
→ *therefore* this is how we pitch, train, debate and measure. Today the
ownership map is stated twice, the bypass sits in §3.4.3 while §0.3 points the
reader at §3.5, and the two halves of one strategy are separated by a section
boundary.

**M13 · §3.7's language preamble → §3.6** *(content move)*
256 words of Kikamba proverbs, content mix and producer governance, filed under
"Accessibility and inclusion".
*Gain:* §3.6 becomes the complete language section — which language, what
register, how produced, in what mix, on which channel. §3.7 becomes an actual
accessibility section that opens on its own subject.

**M14 · §3.6.1 + §3.6.4 → one** — two language×channel matrices.
*Gain:* one deployment matrix instead of two partial ones.

**M15 · §3.7.1 + §3.7.2 + §3.7.4 → one** — a 19-word lede, the 71-word case, and
a 67-word "why this is not an annex". One argument, quartered.
*Gain:* the accessibility case reads as an argument with evidence and a
conclusion.

**M16 · §3.3.3 + §3.3.4 → one** — the financing rules and the penalties for
breaking them.
*Gain:* obligation and consequence in one view. Cause and effect.

**M17 · §3.5.6 and §3.7.5 KPI tables → the consolidated ledger (M31).**

### §4 — What we run on the ground (29 → 19)

**M18 · §4.1 + §4.2 → §4.1 "Field and digital, working as one"**
*(2 H2 + 9 H3 → 1 H2 + 6 H3)*
*Gain:* the loop's **claim and its proof** finally meet. §4.1 promises a
published response in four hours but never says how it is held honest; §4.2
carries the ≥85% field-validation match rate, the 24-hour targeting latency and
the opponent-suppression discipline that make the claim falsifiable — in a
different H2. Merged, the mechanism and its instrumentation are one section.
§4.1.3 (boda boda, matatu, markets, barazas) survives as its own section: it is
physical distribution, not the loop.

**M19 · §4.4.1 → §4.4 preamble** — a 17-word section.

**M20 · §4.5.1 → §4.5 preamble; §4.5.3 → §4.5.2**
*Gain:* the endorsement calendar and the rules governing endorsements read as
one operating instrument.

**M21 · §4.3.6, §4.4.5, §4.5.4 KPI tables → the consolidated ledger (M31).**

### §5 — Defending the campaign (26 → 17)

**M22 · §5.1 + §5.2 → §5.1 "Rapid response and the war room"**
*(2 H2 + 12 H3 → 1 H2 + 7 H3)*
Sources: §5.1, §5.1.1–5.1.5, §5.2, §5.2.1–5.2.7, plus §5.4.2's tool table.
*Gain:* three separate gains, and this is the merge that justifies the project.
1. **One monitoring inventory.** What the campaign watches (four intelligence
   streams), with what tool, for what purpose — currently split across §5.1.1,
   §5.2.2 and §5.4.2, with four rows duplicated between the last two. Merged,
   the reader sees the full sensing capability at once, and that the same tools
   serve both threat detection and competitor tracking — which is a cost
   argument the fragments cannot make.
2. **One response ladder.** §5.1.2's four tiers and §5.2.4's three levels are
   placed adjacent, which is what makes their incompatibility visible and
   fixable. It is **not** reconciled here — see TODO-1.
3. **One message library.** §5.1.4's pre-drafted holding positions and §5.2.5's
   pre-approved library are the same asset described twice.

**M23 · §5.4.2 → the unified inventory in M22.**

**M24 · §5.4.4 → §5.4.3** — a 20-word alert note attached to the brief it feeds.

**M25 · §5.3.3 → §5.3.2** — phishing awareness into the account-security
baseline. *Gain:* one security baseline, credential and human factors together.

### §6 — Data, technology and compliance (36 → 31)

**M26 · §6.4.1 → §6.4 preamble** — a 23-word lede.

**M27 · §6.4.2 + §6.4.3 → one** — online attribution and offline conversion
tracking. *Gain:* "multi-touch" is only meaningful when both touches are in
view; the merged section is the actual attribution model.

**M28 · §6.5.1 + §6.5.2 + §6.5.3 → one**
The standard the campaign holds itself to, the regulatory facts, and the
controls.
*Gain:* obligation → control, readable as a table rather than three fragments.
The ODPC penalty record and the specific control that answers it stop being 200
words apart.

**M29 · §6.2.3 + §6.2.5 → one** — **not executed.** See "Changed during
implementation".

### §7 — Who does the work (19 → 8)

**M30 · §7.1.1–7.1.6 → §7.1**
Six service lines of 30–108 words each under a 27-word parent. As `####`
sub-headings inside one section they cross `lib/collapse-groups.ts`'s threshold
and render as a disclosure group automatically — the existing machinery, not new
UI.
*Gain:* the scope of work becomes **one scannable set** — "here is what you are
buying" — instead of six consecutive headings the reader must accumulate.

**M31 · §7.2 + §7.3 → §7.2 "The team, and how it is governed"**
*(2 H2 + 10 H3 → 1 H2 + 6 H3)*
Sources: §7.2, §7.2.1–7.2.6, §7.3, §7.3.1–7.3.4, plus §2.7.5 via M11.
*Gain:* today the reader **cannot answer "how many people, and who decides?"**
because the document answers twice and differently: two role definitions, two
escalation paths, two meeting calendars, and a lean-model argument that assumes
a 4-person core where every other section says 3. Merged, there is one org, one
escalation path, one calendar — and the headcount discrepancy becomes a single
visible question rather than a contradiction spread over two sections. See
TODO-2.

### §8 — How we will know it is working (30 → 27)

**M32 · §8.2.3 + §8.2.4 → one** — the vanity-metrics doctrine, stated twice.
*Gain:* the doctrine and its three pieces of evidence (86.4% offline, >60% of
engagement from non-resident accounts, zero turnout correlation) in one place.

**M33 · NEW §8.2.4 "What every programme is held to" — the consolidated KPI
ledger.** Sources: §3.5.6, §3.7.5, §4.3.6, §4.4.5, §4.5.4, §8.4.5, §8.5.7.
None of the seven is cross-referenced from anywhere; each sits at the tail of an
unrelated subsection in one of three files.
*Gain:* **the highest-value merge in the plan.** For the first time Dr. Mulu can
see, in one view, every operational commitment the vendor is offering to be
measured on — earned media, accessibility, the offline layer, volunteers,
coalitions, the message lab, the tracker — and can compare them: which carry
phased numeric trajectories (the offline layer: 15,000 → 40,000 → 80,000 →
120,000 consented contacts), which carry single thresholds, and which are still
an unfilled `[Insert target]` (endorsements, §4.5.4). That last comparison is
decision-grade information that does not exist anywhere in the current site.
Every metric and target moves **verbatim**; nothing is rescaled or reworded.

**M34 · §8.4.1 → §8.4 preamble** — a 71-word framing note.

### §9 — What we are asking for (19 → 16)

**M35 · §9.3.1–9.3.4 → §9.3.1 "How we would work together"**
139 words in four headings — syncs, asset centralisation, performance tracking,
escalation.
*Gain:* one operating rhythm, read as a week rather than as four disconnected
commitments. Also the natural place to fix §9.3.3's mis-reference to §5.1.5.

**M36 · §0.4 / §9.3.6 thesis de-duplication** *(no section removed)*
Both open "a remote operation is not a compromise". §0.4 keeps the argument (it
is a decision input in the executive summary); §9.3.6 keeps the delivery detail,
the Firefly proposition and the honest qualification about what remote delivery
cannot do. Only the restated thesis sentence is cut.
*Gain:* the closing section stops re-arguing a point already won 45,000 words
earlier and gets to its distinctive content — the limits — faster.

---

## 5. Mechanics and risk

Renumbering is the dangerous part of this plan. Section numbers are load-bearing
in four places:

1. **`HEADING_INSERTS` in `components/MarkdownViewer.tsx`** — 38 component
   bindings keyed by `<tab>-sec-<number>`. A renumber silently unbinds them: the
   component simply stops rendering, with no error.
2. **In-prose cross-references** — ~130 `Section X.Y` strings resolved at render
   time by `crossSectionTarget()`.
3. **Hardcoded id lists** in `components/ClientPage.tsx` and
   `components/QuickNavCapsule.tsx`.
4. **`LEGACY_IDS` in `lib/heading-slug.ts`** — the repo's established convention
   for keeping already-shared deep links alive across a renumber. This document
   has been renumbered twice and the map is maintained both times; this plan
   follows that convention rather than inventing one.

Every renumber is therefore applied as a single atomic map (old number → new
number) rewritten across markdown, component bindings, prose references, id
lists and the legacy map together, with a post-check that every
`HEADING_INSERTS` key resolves to a heading that exists.

`verify-figures.mjs` runs on every build and is the backstop for the
preservation rule.

---

## 6. TODOs — open questions this audit raises

These are contradictions in the **existing** document. Resolving any of them
would mean altering a commitment, a target or a scope statement, which is
outside this brief. Each is surfaced, adjacent to its counterpart, using the
repository's existing `[Confirm …]` convention (which renders an "Awaiting
campaign decision" badge), and listed here.

**TODO-1 — Two incompatible crisis severity scales.**
§5.1.2 defines four tiers (Level 1 = ignore, no public response; Level 3 = <15
minutes). §5.2.4 defines three levels with the same "Level N" labels and
different clocks (Level 1 = ≤4 hours; Level 3 = ≤30 minutes). §5.2.7 (red-team
drills) and §9.3.4 both name §5.2.4 as authoritative; §7.2.6's approval table
also uses the three-level scale. **Which scale governs?**

**TODO-2 — Core team size.**
§7.3.1 argues the lean model from "a 4-person core command structure". §7.2.2
lists a 3-person core, and §9.2.5 and §9.2.6 both price "3-person core" in all
three budget tiers. **Three or four?**

**TODO-3 — The nomination target.**
§8.2.3 sets the nomination threshold at ">55% Wiper Party primary
delegate/voter preference share". §9.1.1 defines success as "40.0%+ countywide
public preference share". §8.3.1's Phase −1 KPI is "deficit reduced to ≤10
points" (i.e. ~27.4% against a 37.4% front-runner). **Which is the target?**

**TODO-4 — Three voter segmentations and four pillar taxonomies.**
Segments: §2.4.1 defines six, §2.5 defines seven, §2.6.2 maps a third set.
Pillars: §2.2 has four campaign pillars, §2.3 six themes, §2.6.1 three message
pillars, §2.7.1 four content pillars. These may be deliberate layers, but they
share vocabulary and counts differ, so a reader cannot answer "what does this
campaign stand for?" without getting four answers. **Consolidation of these
taxonomies is a strategy decision, not a structural one, and is not attempted
here.**

**TODO-5 — USSD short code: secured or not?**
§2.7.3 and §8.2.2 print a concrete code (`*483*77#`). §4.3.3, §6.4.3 and §8.5.2
print `[Insert shortcode]`. **Is the code obtained?** No figure has been changed
either way.

**TODO-6 — NG-CDF record stated three ways.**
"Best-evaluated constituency in the Eastern region, first of 71 in its peer
group" (§1.2.1, §2.1.1); "among the top 5 best-managed constituencies in Kenya"
(§2.6.1); "the top-ranked CDF infrastructure in Kenya" (§5.1.4). Bursaries
appear as "KSh47m to 12,573 students" (§1.2.1, §2.1.1) and as "18,000+" (§5.1.4,
§8.2.2). **These need reconciling against the primary records** — particularly
in a proposal whose §6.1.2 requires every figure to carry its provenance.

**TODO-9 — An undetermined statutory citation in §6.3.1.**
Two bullets in the technology stack's compliance notes read "Telecommunications
data constitutes direct personal data (Section 4.4)" and "Compliant with Section
4.4 provided individual user profiles are not scraped". In context — a "DPA 2019
Exposure & Compliance" bullet — this reads as a citation to the Data Protection
Act, but the old §4.4 of *this document* was "Digital organising and volunteers",
which would also be a plausible if unhelpful referent. A renumber in this branch
initially rewrote it as though it named this document; that was reverted and the
text now reads "Section 4.4 of the DPA 2019", which is the reading the
surrounding sentence supports. **If that is wrong, it should be corrected by
counsel** — this consolidation has no basis for deciding which Act section was
meant.

**TODO-8 — The county register does not reconcile three ways.**
§1.2.3's summary records "**532,758** (comprising **532,753** ward-registered
voters and **5** prison-registered voters)". But its own 40-ward register — and
§1.3.2's ranked table — sum to **532,758 ward-registered voters**, which leaves
no room for the 5. Meanwhile `data/ward-register.json` records 532,758 ward
voters plus **75** prison voters, totalling 532,833, and
`scripts/verify-ward-register.mjs` asserts that arithmetic on every build. So the
build guard and the prose disagree. Surfaced in §1.2.3 with a `[Confirm …]`
marker; **no figure was changed.** This one matters more than the others because
532,758 is the denominator under the ~200,000 win threshold.

**TODO-7 — Twelve stale banner labels.** `SECTION 10 … SECTION 20 STRATEGIC
TAKEAWAY` inside ASCII boxes, from a retired numbering scheme, visible to the
reader. Fixed as part of the sections they sit in where a merge touches them;
listed in `CUT-LOG.md` where changed.

---

## 6a. Changed during implementation

Two departures from the plan above, both made on closer reading of the text:

**M29 (§6.2.3 + §6.2.5) was dropped.** The plan proposed merging the modelling
methodology with the model's evaluation criteria. In place, §6.2 runs: what the
model scores → data sources → method → **variable dictionary** → evaluation →
use → the compliance gate. The variable dictionary sits between method and
evaluation and is 367 words, the longest part of the section and the one §4.1
cross-references. Merging around it would have either buried the dictionary or
broken the sequence, for a gain that was marginal to begin with. §6.2's seven
parts each answer a distinct question in order; that earns independence.

**§3.6 kept three sections rather than two.** M15 merged the accessibility case
into one section as planned, but the commitments table and its KPI pointer stayed
separate rather than collapsing further — the commitments are cited by name from
§7.1 and §3.4, and are the section's load-bearing content.

**Two defects were found during implementation, not planning**, and are recorded
as TODO-8 (the county register reconciling three different ways) and TODO-9
below. Both were surfaced by doing arithmetic the audit had not planned to do.

---

## 7. What is deliberately not merged

| Kept | Why |
|---|---|
| **§0.1–0.4** (4 sections) | Each is a distinct decision input — the deadline, the offer, the constraints, the delivery model. All 236w+. The overview is the one place a busy reader may stop. |
| **§1.3.1–1.3.6** (6 sections) | The ward arithmetic with the working shown. Four routes to the threshold, each with its own proof, including the one that proves a home-constituency strategy is arithmetically impossible. This is the proposal's strongest analysis. |
| **§6.1, §6.2, §6.3, §6.6** (~24 sections) | The data model, variable dictionary, stack costing and statutory pack. Dense, non-overlapping reference material that a technical reader will navigate rather than read. |
| **§8.3.1–8.3.6** (6 sections) | Five phases plus post-election. A time sequence; merging phases would destroy the sequence. |
| **§9.2.5 / §9.2.6** | The three tiers and the tier comparison. Kept separate because §9.2.5 renders as a disclosure group of three panels and §9.2.6 is the cross-tier table — merging would collapse the comparison into the detail. |
| **§8.1.1 / §8.1.2** | Two stage scorecards, already adjacent and already a comparison. |
| **§4.3.4 "Voice and audio"** (62w) | Short, but a distinct channel layer with its own cost and rationale (audio travels where text does not; 13.0% never attended school). |
