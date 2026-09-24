# Auto-generated part visuals: the audit (brief §11)

Every entry of `data/section-visuals.generated.json` as it stood at `3f16f0b` (114 entries), with the
decision taken in the 2026 premium pass. Values in "why" are quoted from the old generated file.

**What changed in the generator** (`scripts/build-section-visuals.mjs`): the quantitative kinds
(stats, bars, gauge, bullet, donut, waterfall, contrast) can no longer be derived from prose, and a
timeline is kept only when four in five of its events carry a date, week, quarter, month or phase.
A retired heading carries nothing rather than a substitute: a list drawn from the bullets the reader
is about to read repeats the prose rather than doing a job. `scripts/visual-coverage.mjs` now fails
the build if a quantitative kind reappears. Quantitative visuals come only from the register
(`lib/register/specs/*`, numbers from `lib/data/figures.ts`).

**Replacements.** None of the retired entries needed a new register figure: each section that
measures something already carries one (for example §3.2 has `fig-3-2-register-map`, §3.2.1 has
`constituency-power`, and the §1.3.1–1.3.5 targets are in `fig-1-5-scorecard`, whose unmeasured
baselines render as named gaps). This fixes D-01 and D-02.

## Summary

| Kind | Before | Kept | Retired |
|---|---:|---:|---:|
| bars | 15 | 0 | 15 |
| bullet | 5 | 0 | 5 |
| checklist | 21 | 17 | 4 |
| contrast | 5 | 0 | 5 |
| donut | 4 | 0 | 4 |
| gauge | 8 | 0 | 8 |
| stats | 21 | 0 | 21 |
| stepper | 18 | 18 | 0 |
| timeline | 15 | 2 | 13 |
| waterfall | 2 | 0 | 2 |
| **All** | **114** | **37** | **77** |

## Every entry

| Route | § | Heading | Kind | Decision | Why |
|---|---|---|---|---|---|
| objectives | 1.1 | The goal: the Wiper ticket first, the county second | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 200,000 votes, 10, 198,004 |
| objectives | 1.2 | The two deadlines | timeline | Keep | every event carries a date |
| objectives | 1.3.1 | Be known where he isn't yet | bullet | Retire | invents a baseline the text says is set in Week 1 (D-02); the target is in fig-1-5-scorecard; values: 1 now / 51.7 required |
| objectives | 1.3.2 | Turn his record into visible proof | bullet | Retire | invents a baseline the text says is set in Week 1 (D-02); the target is in fig-1-5-scorecard; values: 0 now / 40 required |
| objectives | 1.3.3 | Build a direct line to the voters the internet doesn't reach | bullet | Retire | invents a baseline the text says is set in Week 1 (D-02); the target is in fig-1-5-scorecard; values: 0 now / 120000 required |
| objectives | 1.3.4 | Give every post a voter, a ward and a reason | bullet | Retire | invents a baseline the text says is set in Week 1 (D-02); the target is in fig-1-5-scorecard; values: 1 now / None required |
| objectives | 1.3.5 | Hold the home base while Kitui Central runs its own race | bullet | Retire | invents a baseline the text says is set in Week 1 (D-02); the target is in fig-1-5-scorecard; values: 77764 now / 1 required |
| objectives | 1.4 | How this proposal is built | stepper | Keep | a genuine ordered sequence in the prose |
| data | 2.1 | The electorate | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| data | 2.2 | How Kitui has voted | timeline | Keep | every event carries a date |
| data | 2.4 | The county's people and economy | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| data | 2.5 | The budget the next governor runs | checklist | Keep | a genuine list of items in the prose |
| data | 2.7.1 | Who owns the Kamba-language stations, and who they favour | gauge | Retire | a single number lifted from the prose onto a gauge with no scale or measure; values: 5.7 |
| analysis | 3.10 | What the data can't yet tell us | stepper | Keep | a genuine ordered sequence in the prose |
| analysis | 3.11 | The diagnosis, and the evidence that could overturn it | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 201,899 votes, 198,004 |
| analysis | 3.1 | The number it takes | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 532,758 voters, 75 prison voters, 198,004 votes, 200,000 |
| analysis | 3.2.1 | The constituencies that decide it | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 123,522 ballots, Kyuso, 19,921 voters, Mumoni (15,877 voters) |
| analysis | 3.2 | Where the votes are | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 12 largest wards, 124,182 ballots, 20 wards, 10 smallest wards |
| analysis | 3.3 | Four routes to the number | waterfall | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 200,000, 200,198 voters, 15 wards, 37.58%, 101,182 votes short |
| analysis | 3.4 | Where he is known and where he isn't | stepper | Keep | a genuine ordered sequence in the prose |
| analysis | 3.5 | What his rivals have already proven | stepper | Keep | a genuine ordered sequence in the prose |
| analysis | 3.6 | Where party loyalty won't carry him | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 77,764 |
| analysis | 3.7.2 | The northern block: Mwingi | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 255,795 |
| analysis | 3.7 | The three regions | gauge | Retire | a single number lifted from the prose onto a gauge with no scale or measure; values: 18 |
| analysis | 3.8.1 | The offline majority, and the infrastructure that reaches it | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 158,696, 4.4, 06, 45, 24, |
| analysis | 3.8 | What each channel can physically reach | checklist | Keep | a genuine list of items in the prose |
| analysis | 3.9.1 | What the audit produces | stepper | Keep | a genuine ordered sequence in the prose |
| strategy | 4.1.1 | The evidence behind the claim | stepper | Keep | a genuine ordered sequence in the prose |
| strategy | 4.1.2 | The resource paradox | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: KSh 13.79 billion |
| strategy | 4.1.3 | Answering the charge that discipline is cold | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 670 million, 1.3 billion, 24 |
| strategy | 4.1.5 | The four campaign pillars in practice | stepper | Keep | a genuine ordered sequence in the prose |
| strategy | 4.1.6 | The six campaign themes | checklist | Retire | no longer passes the gate: it was reached only through the retired quantitative cascade |
| strategy | 4.2 | Where the effort goes | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| strategy | 4.3.2 | The Rural Agrarian & Smallholder Baseline | donut | Retire | a share drawn from a sentence, with no whole it is a share of; values: 73.8 |
| strategy | 4.3.4 | The Youth Cohort (Ages 18–35: Students, Bodaboda, Unemployed Graduates & Creatives) | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 234,000, 46.7, 18, 24,, 100 |
| strategy | 4.3.5 | The Urban & Peri-Urban Commercial Informal Sector (MSMEs & Traders) | checklist | Keep | a genuine list of items in the prose |
| strategy | 4.3.6 | The Formal Sector Professionals, Civil Servants & Educators | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 10, 40, 92.3, 24, |
| strategy | 4.3.7 | The Out-of-County Kamba Diaspora Matrix (Nairobi, Coast & Nationwide) | checklist | Keep | a genuine list of items in the prose |
| strategy | 4.3.8 | Segment sizing, and the evidence for it | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 26, 3, 4, 532,758, 1,136,187 |
| strategy | 4.4.1 | The central claim and its three pillars | checklist | Retire | no longer passes the gate: it was reached only through the retired quantitative cascade |
| strategy | 4.4.6 | Framing, worked through in examples | checklist | Keep | a genuine list of items in the prose |
| strategy | 4.4 | What we say, and in which language | gauge | Retire | a single number lifted from the prose onto a gauge with no scale or measure; values: 160 |
| strategy | 4.5.1 | Pillar 1 — Where the money went | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 275,570, 45, 15 |
| strategy | 4.5.2 | Pillar 2 — From poverty to wealth creation, one household | donut | Retire | a share drawn from a sentence, with no whole it is a share of; values: 90 |
| strategy | 4.5.3 | Pillar 3 — The economist explains | checklist | Keep | a genuine list of items in the prose |
| strategy | 4.5.4 | Pillar 4 — He came, and this is what he said he would do | checklist | Keep | a genuine list of items in the prose |
| strategy | 4.5.5 | One week, before and after | contrast | Retire | renders "the assumption / the finding" with no content from its section; values: Both rules are set by the Week 1 audit / by preference |
| strategy | 4.5 | What gets published | contrast | Retire | renders "the assumption / the finding" with no content from its section; values: so the campaign compounds / repeating |
| strategy | 4.6 | Which channel does which job | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 79.3%, 82%, 18% |
| strategy | 4.7 | Fix first: six profile corrections | contrast | Retire | renders "the assumption / the finding" with no content from its section; values: the assumption / the finding |
| implementation | 5.1.1 | Who owns what | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 40 |
| implementation | 5.1.2 | The fourteen, by owner | donut | Retire | a share drawn from a sentence, with no whole it is a share of; values: 73.8 |
| implementation | 5.1.3 | What is outside this scope | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 5.2, 03, 240, 800 M, 1,200 |
| implementation | 5.1.4 | How the levels change what runs | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 3, 40 |
| implementation | 5.1.6 | Digital infrastructure, brand and civic content | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| implementation | 5.1.7 | Growth, field advertising and reputation operations | stepper | Keep | a genuine ordered sequence in the prose |
| implementation | 5.2 | The workstreams in detail | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 5, 5.2, 11 |
| workstreams-platforms | 5.2.1.1 | Workstream 1 — Owned platforms and the service-delivery tracker | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| workstreams-platforms | 5.2.1.3 | Workstream 3 — Creative testing and AI assistance | stepper | Keep | a genuine ordered sequence in the prose |
| workstreams-media | 5.2.2.1 | Workstream 5 — Platform tactics and paid media | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 40, 18, 30 |
| workstreams-media | 5.2.2.2 | Workstream 6 — Earned media, journalists and debates | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| workstreams-ground | 5.2.3.1 | Workstream 7 — Ground-digital integration | checklist | Keep | a genuine list of items in the prose |
| workstreams-ground | 5.2.3.2 | Workstream 8 — The field-to-digital loop | stepper | Keep | a genuine ordered sequence in the prose |
| workstreams-ground | 5.2.3.3 | Workstream 9 — What Firefly operates: SMS, USSD and voice | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| workstreams-data | 5.2.4.1 | Workstream 11 — The data layer | checklist | Keep | a genuine list of items in the prose |
| workstreams-data | 5.2.4.2 | Workstream 12 — Predictive voter modelling | waterfall | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 5.7, 5.7, 5.7, 5.2 |
| workstreams-data | 5.2.4.3 | Workstream 13 — The technology stack | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| workstreams-data | 5.2.4.4 | Workstream 14 — Analytics and attribution | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| delivery | 5.3.4 | Why this comes first | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 15,000, 745, 158,696 |
| delivery | 5.3.5 | Method | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 90, 3, 4, 5, 6 |
| delivery | 5.3.7 | Phase 0: Instrumentation — Weeks 4–10 from signature | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 3, 4, 5 |
| delivery | 5.3 | The first four weeks | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| delivery | 5.4.1 | Phase 1: Awareness and Community Building — October–December 2026 | stepper | Keep | a genuine ordered sequence in the prose |
| delivery | 5.4.2 | Phase 2: Engagement and Persuasion — January–March 2027 | stepper | Keep | a genuine ordered sequence in the prose |
| delivery | 5.4.3 | Phase 3: Mobilisation and GOTV — April–August 2027 | stepper | Keep | a genuine ordered sequence in the prose |
| delivery | 5.4.4 | Post-election | gauge | Retire | a single number lifted from the prose onto a gauge with no scale or measure; values: 90 days |
| delivery | 5.4.7 | The sequenced calendar | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 26 |
| delivery | 5.4.8 | Managing endorsements | contrast | Retire | renders "the assumption / the finding" with no content from its section; values: the assumption / the finding |
| delivery | 5.4.9 | Coalition KPIs | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 80 |
| delivery | 5.4 | The phases to August 2027 | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 10 August 2027, 73.8, 200,000 |
| delivery | 5.5.1 | The three scope levels | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| delivery | 5.5.2 | The scope levels compared | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 3, 40 |
| delivery | 5.5.4 | What this proposal commits to | gauge | Retire | a single number lifted from the prose onto a gauge with no scale or measure; values: 5.7 |
| delivery | 5.6.10 | Rationale, structure and zone coverage | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 8 |
| delivery | 5.6.11 | Qualitative hypotheses, feedback loops and KPIs | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| delivery | 5.6.2 | Stage 2: the general election scorecard | gauge | Retire | a single number lifted from the prose onto a gauge with no scale or measure; values: 200,000 |
| delivery | 5.6.6 | The service-delivery performance tracker | checklist | Keep | a genuine list of items in the prose |
| delivery | 5.6.7 | Why vanity metrics are excluded | stepper | Keep | a genuine ordered sequence in the prose |
| delivery | 5.6.8 | Performance governance and executive escalation | checklist | Retire | no longer passes the gate: it was reached only through the retired quantitative cascade |
| delivery | 5.7.1 | Operating rhythm, tooling and reporting lines | stepper | Keep | a genuine ordered sequence in the prose |
| delivery | 5.7.9 | The compliance sign-off gate | stepper | Keep | a genuine ordered sequence in the prose |
| delivery | 5.8.14 | If it becomes a delegate primary | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 3 |
| delivery | 5.8.15 | If the incumbent's eligibility is contested | checklist | Keep | a genuine list of items in the prose |
| delivery | 5.8.2 | What we monitor, and how threats reach us | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 24, 7, 40, 180, 8 |
| delivery | 5.8.3 | Staying inside defamation law | checklist | Retire | no longer passes the gate: it was reached only through the retired quantitative cascade |
| delivery | 5.8.7 | The deepfake and manipulated media protocol | stepper | Keep | a genuine ordered sequence in the prose |
| delivery | 5.9 | How the work is staffed | checklist | Keep | a genuine list of items in the prose |
| nextsteps | 6.1.1 | What this asks of the campaign | gauge | Retire | a single number lifted from the prose onto a gauge with no scale or measure; values: 3 hours |
| nextsteps | 6.2.1 | Assumptions this proposal rests on | timeline | Retire | a list of facts or items, not events in time: a time axis would imply an order that is not there |
| nextsteps | 6.2 | Open items | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 48, 3 |
| nextsteps | 6.3.2 | The ask, in full | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 275,570, 201,899, 191,317 |
| nextsteps | 6.3 | The decision: one week and one export | contrast | Retire | renders "the assumption / the finding" with no content from its section; values: the assumption / the finding |
| annex-evidence | A.1.2 | The three source tiers | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 532,758, 605,703, 40 |
| annex-evidence | A.1.4 | The standard applied to our own measurement | checklist | Keep | a genuine list of items in the prose |
| annex-county | B.1 | The 40-ward register | bars | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 68,829, 16,471, 15,877, 9,131, 7,429 |
| annex-county | B.2 | County money and the audit record | donut | Retire | a share drawn from a sentence, with no whole it is a share of; values: 18 |
| annex-county | B.3 | Drought, food security and climate pressure | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 28,000 households |
| annex-county | B.4 | Mui Basin coal and the displaced communities | gauge | Retire | a single number lifted from the prose onto a gauge with no scale or measure; values: Petition 12 of 2014 |
| annex-county | B.5 | Each rival, and the legal ground to be careful on | checklist | Keep | a genuine list of items in the prose |
| annex-runbooks | F.12 | Competitive intelligence outputs and rapid alerts | checklist | Keep | a genuine list of items in the prose |
| annex-runbooks | F.5 | Rapid-response protocol and pre-approved message library | stepper | Keep | a genuine ordered sequence in the prose |
| annex-runbooks | F.6 | Red-team drills | stats | Retire | plots unlike quantities on one scale, or non-quantities (section numbers, times, counts of steps); values: 60, 30, 3, 4 |
| annex-runbooks | F.7 | The threat model | checklist | Keep | a genuine list of items in the prose |
| annex-runbooks | F.9 | Phishing awareness | checklist | Keep | a genuine list of items in the prose |
