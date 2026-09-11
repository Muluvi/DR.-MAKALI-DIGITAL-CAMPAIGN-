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

Four passages were written for this restructure. Nothing else new entered the document. Each is
quoted in full so it can be approved or struck.

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
Each described the retired nine-part grouping and would now be inaccurate. Their job — telling
the reader what a section is for before they enter it — is done by §1.3 and by the per-section
blurbs the navigation renders. Quoted in full:

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
