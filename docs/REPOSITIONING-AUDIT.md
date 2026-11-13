# Repositioning audit — Analyse → Strategise → Direct

*Firefly Management · 16 September 2026 · senior review before the site is shared*

Audited against the live site (`https://dr-makali-digital-campaign.vercel.app/`, fetched
16 September 2026, `x-vercel-cache: HIT`, content identical to `main`) and the repository at
`claude/makali-campaign-reposition-u79vru`.

**Read in full:** all 28 content files in `public/content/`, `lib/heading-slug.ts` (the route
and section order), `lib/phases.ts`, `app/layout.tsx` (metadata and robots), `app/[[...slug]]/page.tsx`,
`components/ClientPage.tsx` (chrome, header and footer strings), `data/sources.ts`,
`data/external-figures.ts`.

**Could not access, and not guessed at:**

* The 3D ward map, the charts and the collapsible blocks render client-side. Their *text* was read
  from the markdown and from `data/`, so no content is missing, but their rendered appearance on a
  phone was not observed.
* `data/ward-register.json`, `data/kpis.ts`, `data/competitors.ts`, `data/benchmarks.ts`,
  `data/tier-matrix.ts` were not opened line by line; figures quoted below come from the markdown
  that cites them.
* Dr. Mulu's Facebook Insights, any post-level export, and any handle or follower count on X,
  TikTok, Instagram, YouTube or WhatsApp. Marked `[DATA NEEDED]` throughout.

---

## 1. Executive verdict

1. **The site sells a department he already has.** §12.1.2 "What Firefly runs" lists content
   production, scheduling, community management and publishing. §14.6 draws an org chart with the
   Firefly Digital Director above content, paid media, community managers and 40 ward champions.
   To a man with a verified page, 745 posts and a team posting daily, that reads as a takeover bid.
   Rewrite §12.1.2 and §14.6 first; nothing else matters if those two survive.
2. **It analyses the race and never analyses him.** Every data point is about Kitui — the register,
   the census, the polls, the audit record. There is not one figure about his own channel. The Week 1
   "full digital audit" in §9.1.1 is a bullet inside a phase plan, invisible to a reader who never
   reaches Section 9. Promote it to a named section — the Existing Presence Audit — and put it on
   screen one. It is the whole proof that Firefly is the intelligence layer.
3. **The first screen asks for the wrong thing.** §0.1 asks him to approve a "Phase −1 nomination
   sprint" and a scope level. Under the new positioning the ask is smaller, faster and easier to
   say yes to: approve a Week 1 audit of his existing presence, and a six-week Analyse → Strategise →
   Direct cycle behind it. Rewrite §0.1.
4. **The addressee is wrong and it is a live exposure.** `components/ClientPage.tsx:602` and `:951`
   say the document is "prepared for Wiper Democratic Movement campaign leadership". The document
   argues how to beat three Wiper rivals. Change to Dr. Mulu personally, in both strings, before it
   is shared.
5. **The site is noindex; the repository is public.** `app/layout.tsx` sets `robots: {index: false}`,
   and every word of the proposal sits in `public/content/*.md` in a public GitHub repo, alongside
   internal audit logs. The confidentiality clause in §1.2 is unenforceable as things stand.

---

## 2. Current argument map

**What the site asks Dr. Mulu to approve.** Three things in one motion (§0.1): a *pivot*, making the
Wiper nomination rather than the general election the primary digital objective; a *deployment*,
authorising ward-level SMS micro-targeting, a visibility push in low-recognition sub-counties and
the first release of a service-delivery tracker; and an *integration*, putting the digital operation
inside the ground campaign's volunteer networks. Behind that sits a fourth approval he may not
notice he is giving: a scope level (§10.1, Level 2 recommended), which sets team size, content
volume and ward coverage. The deadline is 30 September 2026 and the requested action is a meeting
within fourteen days (§16.1, §16.2).

**The role it gives Firefly.** Builder and operator of the entire digital function. §12.1.2 lists
strategy, modelling, content production and scheduling in three languages, paid media, SMS and USSD,
fundraising, reputation monitoring and earned media as things "Firefly runs". §14.6 places the
Firefly Digital Director between the campaign's communications director and every executing role,
including 40 ward digital champions. §9.1.2 has Firefly bringing "professional pages, website,
analytics dashboards and donation portal live" — a build, not a review. §10.1.1 prices the levels in
units of Firefly's own output: flagship videos per week, daily social, weekly Live. The strategic
layer is real and well argued, but it is bundled inside a production contract and reads as its
justification.

**The order in which it builds its case.** Ask first, then credentials, then terrain, then work,
then terms. §0 the decision; §1 identification and confidentiality; §2 mandate and the governing
constraint; §3A–3C the nomination mechanism, the candidate, the vote arithmetic, channel reach and
media ownership; §4 objectives; §5 audiences; §6 the governing claim and pillars; §7 message
architecture and language; §8–8D the fourteen workstreams; §9 phasing; §10 deliverables; §11
measurement; §12 governance; §13 risk; §14 team; §15 assumptions; §16 the ask restated; annexes A–E.
It is a well-built proposal in the classical order. The problem is not the order — it is that the
order was designed to justify fourteen workstreams, and the new engagement has three steps.

---

## 3. Data foundation audit

### 3a. Every data point, with its stated tier

**The contest (Tier 2).** Mizani Africa, June 2026 and 7 August 2026: Kasalu 31.3% → 37.4%;
Mulu 20.2% → 22.1%; Wambua 16.3% → 14.3%; Ngilu not polled → 17.0%. Deficit 11.1 → 15.3 points.
Front-runner growing 6.1 points against his 1.9. (§0.1, §2.2, §3.1.5.)

**The selection mechanism (Tier 3).** Nomination by countywide opinion poll rather than a delegates'
contest; decision expected late October–November 2026. Reported, explicitly not confirmed by Wiper
(§2.2, §3.1.2, §15.3 assumption 1). The site is honest about this and says what would confirm it.

**The register (Tier 1, IEBC `rov_per_caw.pdf`, 2022).** 532,758 registered voters; 40 wards;
8 constituencies; 1,578 polling stations. Kitui Central 77,764. Mwingi bloc 200,198 (37.58%).
Kitui South 75,372 (14.15%). Kitui East border wards 65,377. Deficit pool 275,570 — 51.72% of the
register (§3.4.5). Top twelve wards by size, Kyuso 19,921 down to Mulango 15,135 (§3.4.2, §3.4.5).

**The county (Tier 1, KNBS 2019 census).** 1,136,187 residents; 587,151 women (51.7%); 86.4% of
residents aged 3+ outside the internet-using population; 13.6% active internet use; 95.2% rural;
37 persons/km²; ~400,000 on untreated surface water; ~613,000 cattle and ~2,000,000 goats; poultry
in over 90% of households; smartphones 63.7% of connected devices (§2.3, §3.3.5, §6.3).

**2022 results (Tier 1 / Tier 2).** Malombe won with 198,004 votes; Kasalu took 201,899 in the Woman
Representative race (§3.3.6). Note `data/sources.ts` flags `MEDIA_2022_DECLARATION` as supplied
"without naming a specific outlet or article URL".

**County money (Tier 1).** FY2026/27 resource envelope KSh13.79bn; own-source revenue target
KSh1.339bn (CFSP). OAG FY2023/24: KSh670m unconfirmed cash balances, KSh1.09bn uncollected rates and
rents, KSh621.5m IFMIS variance, KSh356.2m inter-account transfers. Controller of Budget: KSh1.3bn
pending bills at FY2020/21; FY2025/26 Q1 development absorption 18% (Tier 1) against 5% alleged in
media (Tier 2). NG-CDF: KSh47m in bursaries to 12,573 students (§6.1.1, §6.1.2, Annex B).

**Channel reach (mixed).** In-county digital ceiling ~72,000 voters, 36.2% of the ~200,000 threshold;
vernacular radio ~420,000; direct 2G SMS ~320,000; rebalanced effort weights 18% digital / 37% radio
/ 20% SMS / 18% caravans / 7% church (§3.6.1–§3.6.3). National platform sizing lives in
`data/external-figures.ts`: Facebook 23.09m, Messenger 20.18m, TikTok 18.4m, LinkedIn 6.30–7.44m
(NapoleonCat May 2026 and DataReportal 2026, Tier 2).

**Targets.** 40.0%+ countywide preference (§4.1); ≥55.0% among likely Wiper primary voters (NW-01);
≥70.0% aided name ID in the Mwingi sub-counties (NW-02); 200,000 verified supporters (§4.2);
220,000 pledged voters (GE-01); 120,000 consented SMS contacts (§8.10.6); 400 ward captains;
≥82% turnout conversion (GE-04); 62.0% participation baseline producing ~330,310 ballots (§3.4.1).

### 3b. Figures that are unsourced, inconsistent or outdated as of 16 September 2026

| # | Figure | Problem | Priority |
|---|---|---|---|
| 1 | 86.4% offline / 13.6% online (KNBS 2019) | The single most load-bearing number in the document, and it is seven years old. It also describes *residents aged 3 and above*, then is applied to the *registered-voter* base in §3.6.3 to derive "~72,000 voters". Different populations. | P1 |
| 2 | Cover date "August 2026" (§1.1) | Today is 16 September. The document dates itself as stale on the page that establishes its authority. | P1 |
| 3 | Phase −1 "August–September 2026" (§9.1.1, `lib/phases.ts`) | The phase window has effectively expired before the proposal is shared. Phase 0 "September–October 2026" is half gone. | P1 |
| 4 | Objectives clock "29 August 2026 to 15 November 2026" (§4.1) | Opens eighteen days before the reader sees it. | P1 |
| 5 | "A decision on 30 September 2026 leaves about 25 of those days" (§0.2, §16.1) | Arithmetic written against an earlier share date. Recompute, or drop the countdown and state the remaining days from the date the link is sent. | P1 |
| 6 | Mizani, 7 August 2026 | 40 days old and the only measured point. No September round is cited. The "widening" claim rests on two observations. | P2 |
| 7 | IEBC ward register (2022 file) | §15.1 item 5 asks the campaign for "current ward-level registration data", conceding that all ward arithmetic runs on the 2022 file. Continuous registration has run since. | P2 |
| 8 | Three different deficit targets | §4.1 says 40.0%+ countywide; NW-01 says ≥55.0% of likely Wiper primary voters; §9.1.1's KPI table says "deficit reduced to ≤10 points". §11.1 reconciles the first two. The third is a fourth basis and is not reconciled. | P2 |
| 9 | GE-04 baseline "72.0% (Historical Average)" | No source, no year, no geography. | P2 |
| 10 | Radio "78%+ of voters daily" (§3.6.3) | Stated in a rationale column with no source. It is ~420,000/532,758, so it is internally consistent — but the 420,000 itself is not tiered. | P2 |
| 11 | "150,000+ Kamba diaspora" (§3.6 / reach.md) | Unsourced. | P3 |
| 12 | Health insurance 11.7%; stunting 25%; never attended school 13.0%; completed secondary 17.4%; ndengu 45,000 tonnes and sub-32% value capture | The site already marks these "Evidence required" or "not yet tiered". Correctly handled — listed here so the list is complete. | P3 |
| 13 | Platform sizing table | `data/external-figures.ts` records that the table citing NapoleonCat and DataReportal "is no longer present in public/content/". Figures live in a component with no prose home. | P3 |

### 3c. The biggest gap — the Existing Presence Audit

The site analyses the race, the register, the county and the media landscape. It never analyses the
thing Dr. Mulu actually controls. His Facebook page carries ~15K followers and 745 posts, his team
posts daily, and the proposal contains no reading of any of it. That is the gap the new positioning
is built to fill, and it is currently one bullet inside §9.1.1.

Specify it as a named section, `public/content/presence.md`, Section 1 of the revised site.

**What it measures.**

*Structural — answer this first, because it gates everything else.*
Is "Hon Makali Mulu" a Facebook **Page** or a **personal profile in professional mode**? The visible
friends list suggests the latter. A profile has no Page Insights, no Meta Business Suite export, no
delegated admin roles and no ad account. If it is a profile, most of the metrics below do not exist
and the audit falls back to public post-level counts. `[DATA NEEDED — one screenshot of Meta
Business Suite, or of the page's Professional dashboard, settles it.]`

*Audience.* Followers by city and country. Followers by age band and sex. Follower growth curve,
12 months. This is the decisive measurement: it tests the recognition thesis directly against
his own asset.

*Reach.* Daily reach, organic against paid. Reach by city, mapped to sub-county. Reach per post.
Reach as a share of followers.

*Engagement.* Reactions, comments and shares per post. Engagement rate on reach, not on followers.
Share rate per 1,000 reached — the persuasion proxy, because a share puts his name into a network he
does not own. Count of distinct commenting accounts across the window, and the share of all comments
produced by the top 50 accounts.

*Content.* Every post in the window coded on four axes: pillar (activity / policy / record /
response / personal), language (English / Kiswahili / Kikamba / mixed), format (photo, album, video,
link, text), and whether it carries a commitment, a date, a ward name, or a call to action.

*Video.* 3-second and 30-second views, average watch time, completion rate.

*Cadence.* Posts per day, hour of day, day of week.

*Paid.* Meta Ad Library and Google Ads Transparency Centre for Dr. Mulu, Kasalu, Wambua and Ngilu.
Public, needs no access, and is the only competitive spend signal available.

*Other platforms.* `[DATA NEEDED — handles and follower counts for X, TikTok, Instagram, YouTube,
and any WhatsApp Channel or Business number. Do not estimate.]`

**Time window.** A rolling 90 days: 18 June to 16 September 2026. Three reasons. It is the longest
window Meta exports at post level without gaps. It brackets both Mizani rounds, so the digital record
can be read against the only two measured points that exist. And it is long enough to see cadence and
short enough to reflect the team working today. The follower-growth curve is pulled over 12 months
for seasonality, since that series is cheap and stable.

**Method.**
1. Confirm Page versus profile. Record the answer before anything else.
2. Export Meta Business Suite → Insights → 90 days: reach, engagement, followers, demographics, city
   breakdown, as CSV. If it is a profile, substitute a manual post-level tally of public counts.
3. Export post-level data for every post in the window. Two coders code each post on the four axes;
   disagreements are resolved by a third pass, and the inter-coder agreement rate is reported.
4. Repeat the public post-level coding for Kasalu, Wambua and Ngilu. Public posts only.
5. Pull the ad libraries for all four.
6. Overlay reach-by-city onto the 12 decisive wards in §3.4.2 and the 275,570-voter deficit pool in
   §3.4.5.
7. Handle all of it in aggregate. No named commenter lists, no export of individual profiles, no
   retention of personal data. The audit is counts and shares, and it is scoped in the §12.5.5
   memorandum before it starts.

**Findings that would change the strategy.** Stated as decision rules, not predictions.

| If the audit finds | The strategy changes to |
|---|---|
| Follower and reach geography concentrated in Kitui Central and Nairobi | Confirms the recognition thesis on his own data. Output weight shifts to Mwingi and the arid belt, and the headline indicator becomes reach share in the deficit pool. |
| Material reach in Mwingi but flat engagement there | The problem is message, not reach. The answer is the message lab (§11.3), not geofenced advertising, and the Phase −1 weighting in §3.4.5 is wrong. |
| Kikamba posts out-engaging English by a wide margin | Language stops being a preference and becomes a rule in the weekly brief. |
| Video watch time collapsing before 10 seconds | The 2–3 flagship videos per week in §10.1.1 are the wrong format. Short vertical and Kikamba voice notes replace them. |
| Most engagement produced by a few hundred repeat accounts | The follower base is a shell. Priority moves from page growth to consented WhatsApp and SMS list building. |
| Rivals running Meta ads while he is not | Part of the gap is bought reach. The ad-account question becomes urgent and is put to him directly. |
| It is a personal profile, not a Page | No Insights, no ads, no delegated access, no analytics to direct against. This is a P1 structural finding and changes what can be directed at all. |

**How to show it, with little text.**

*Visual 1 — "The reach map against the vote map."* Two 40-ward cartograms side by side. Left:
share of 90-day reach by ward, from the Meta city breakdown. Right: share of the register. A third,
smaller panel shows the difference on a diverging scale. One caption line: *"Half the register is in
the red."* Reuses `components/charts/WardCartogram.tsx`. **Replaces** the ASCII cross-match block and
the three prose sub-lists in §3.4.5 (roughly 400 words).

*Visual 2 — "Ninety days, coded."* A strip of 90 tiles, one per day, colour by content pillar, height
by reach. Pillar concentration, cadence and reach variance in one glance. **Replaces** any prose
description of his posting pattern, and the format table in §8.3.2 (roughly 250 words).

*Visual 3 — "Which language travels."* Three bars: engagement rate by post language, with post counts
underneath. **Replaces** the opening prose of §7.3.1 (roughly 150 words).

*Visual 4 — "Him against the field."* Four rows, one per candidate: posts per week, median shares per
post, and ads live. Public data only. **Replaces** the competitive prose in §13.4.4 (roughly 200 words).

Each visual ships with an honest empty state before the export lands: axes drawn, the question
printed, and the badge `[DATA NEEDED — Week 1 export]`. A module that shows its own missing data is
the argument for the engagement.

---

## 4. Verdict on every section and annex

### The table

| Section | Verdict | Priority | One-line change |
|---|---|---|---|
| **0. The decision** | CHANGE | **P1** | Ask for a Week 1 presence audit and a six-week Analyse → Strategise → Direct cycle, not a fourteen-workstream sprint. |
| **New — Existing Presence Audit** | **ADD** | **P1** | New `presence.md` as Section 1; the audit spec at 3c above, four visuals, minimal prose. |
| 1. Title and confidentiality | CHANGE | **P1** | Re-address to Dr. Mulu personally; re-date; state that Firefly holds no publishing credentials. |
| 2. Executive summary | CHANGE | **P1** | Replace "comprehensive digital campaign apparatus" (§2.1) with the three-step engagement; keep §2.2 and §2.3 intact. |
| 3A. Situation analysis | KEEP | P2 | Trim §3.3.1 to the two credentials the strategy uses; the rest is sound. |
| 3B. Vote arithmetic | KEEP | P2 | Keep every figure; cut §3.4.5's prose in favour of Visual 1. |
| 3C. Channel reach & media | KEEP | P2 | Re-label §3.6.3 as "where output weight goes" — it already argues in effort, not money. |
| 4. Strategic objectives | CHANGE | P2 | Re-anchor Commitments 1–2 to recognition in the deficit sub-counties; move 3–5 behind the general-election fold. |
| 5. Audience segmentation | KEEP | P2 | Bind each of the six segments to a content pillar so the segmentation has an output. |
| 6. Strategic approach | CHANGE | P2 | Anchor §6.2 on his own cover line, "From Poverty to Wealth Creation", rather than on Firefly's four-pillar abstraction. |
| 7. Messaging & narrative | MERGE | P2 | Merge §7.1 and §7.3 into the new Content Strategy Engine; keep §7.2 as the discipline annex. |
| **8. What we will run** | CHANGE | **P1** | Retitle "What Firefly owns, what your team runs, what is out of scope"; add the ownership column below. |
| 8A. Platforms & content | CHANGE | **P1** | §8.3 becomes the brief-and-calendar spec, not a studio; §8.2 tracker stays as a Firefly build. |
| 8B. Publishing & earned media | CHANGE | P2 | Firefly supplies briefing notes and debate prep; the team and the campaign place and publish. |
| 8C. Ground & offline reach | CHANGE | **P1** | Separate §8.10 (Firefly-operated infrastructure) from §8.8, §8.9, §8.11 (campaign-owned). |
| 8D. Data & technology | CHANGE | P2 | §8.14 mostly out of scope now; §8.15 promoted — it is the engine of the new positioning. |
| 9. Implementation roadmap | CHANGE | **P1** | Re-date every phase; Phase −1 becomes "Weeks 1–6 from signature", not "August–September 2026". |
| **10. Deliverables schedule** | CHANGE | **P1** | Levels stop being production volumes and become depth of intelligence; cut the ad-share row. |
| 11. Measurement framework | CHANGE | P2 | Promote NW-02 to the headline; add the four reach-and-persuasion indicators in item 5e. |
| **12. Governance & engagement** | CHANGE | **P1** | §12.1.2 "What Firefly runs" is the most damaging block on the site. Replace with the direction model. |
| 13. Risk management | KEEP | P2 | Add one row: what happens when Firefly's brief and the team's judgement disagree. |
| **14. Delivery structure** | CHANGE | **P1** | §14.6 draws Firefly over his team. Redraw as two teams side by side with one interface. |
| 15. Assumptions & dependencies | CHANGE | P2 | Add four assumptions about his existing team and accounts; drop the ones about building new ones. |
| 16. Next steps | MERGE | **P1** | Fold §16.1 into §0; keep §16.2 as a short close. The site should not ask twice. |
| Annex A — Evidence standard | KEEP | P3 | Best thing on the site. Add the audit's own method to it. |
| Annex B — County reference | KEEP | P3 | No change. |
| Annex C — Message assignment | CHANGE | P2 | Re-cut the grids by the new pillars; the segment and channel axes survive. |
| Annex D — Cadence & escalation | CHANGE | P2 | The campaign's four-forum governance chart is not Firefly's to set. Cut to the Firefly-team rhythm. |
| Annex E — Response runbooks | KEEP | P3 | Keep; retitle the ownership line so the team, not Firefly, executes. |

### Section 8 — the fourteen workstreams, reclassified

| WS | Workstream | New classification | Why |
|---|---|---|---|
| 1 | Owned platforms and the service-delivery tracker (§8.2) | **Split.** Tracker: Firefly-owned. Page operation: team-executed under direction. | The tracker is new infrastructure nobody currently runs. His page is not. |
| 2 | Content production and asset governance (§8.3) | **Team-executed under Firefly direction.** | He has a team producing daily. Firefly owns the brief, the calendar and the approval gate — not the camera. |
| 3 | AI-assisted creative and testing (§8.4) | **Firefly-owned.** | Test design, variant selection and reading the result is analysis. The team produces the variants. |
| 4 | Accessibility and inclusion (§8.5) | **Firefly-owned standard, team-executed.** | Firefly writes the standard into every brief; the team applies it. Keep it non-negotiable at all levels. |
| 5 | Platform tactics and paid media (§8.6) | **Team-executed under direction — with one open question.** | Firefly writes targeting plans and reads performance. Who holds the ad account is a decision for him, not an assumption. See open question Q4. |
| 6 | Earned media, journalists and debates (§8.7) | **Team-executed under direction.** Firefly owns briefing notes, debate prep and the evidence pack. | Placement is a relationship business the campaign already has. |
| 7 | Ground-digital integration (§8.8) | **Campaign-owned; Firefly supplies the instrument.** | The 40 ward coordinators are the campaign's people. Firefly owns the reporting template and the analysis that comes back. |
| 8 | The field-to-digital loop (§8.9) | **Campaign-owned; Firefly supplies the instrument.** | Same. |
| 9 | Offline reach: SMS, USSD and voice (§8.10) | **Firefly-owned.** | This is the infrastructure Firefly already holds — WhatsApp Business API and the USSD shortcode. It is the one operational thing in the engagement and should be stated as such. `[CONFIRM/EDIT]` |
| 10 | Digital organising and volunteers (§8.11) | **Out of scope.** | Volunteer recruitment, tiers and gamification belong to the ground campaign. Firefly defines the metrics the leaderboard reports. |
| 11 | The data layer (§8.12) | **Firefly-owned.** | The model and its governance are the analysis product. |
| 12 | Predictive voter modelling (§8.13) | **Firefly-owned, gated on §12.5.5.** | Keep the gate. Recommend ward-level aggregate scoring only until sign-off — it delivers most of the value at a fraction of the exposure. |
| 13 | The technology stack (§8.14) | **Mostly out of scope.** Firefly-owned for the tracker, the CRM, and the SMS/USSD/WhatsApp layer only. | He has accounts and hosting. Procuring a stack he already has is the clearest symptom of the old positioning. |
| 14 | Analytics and attribution (§8.15) | **Firefly-owned.** | This *is* the new positioning. It should stop being workstream fourteen and become Section 1's engine room. |

Count under the new model: **six Firefly-owned**, **six team-executed under Firefly direction**,
**two out of scope**. Say those three numbers on the page. They are the repositioning in one line.

### Detailed cards — P1 and P2

---

**§0 — The decision** · CHANGE · **P1**

*Why.* The current ask bundles a pivot, a deployment, an integration and a scope level into one
signature, and every one of them assumes Firefly builds the operation. Under Analyse → Strategise →
Direct the first ask is small: let us read your data.

*The exact change.* New headline: **"You already have the reach. This is what it is doing."**
New ask, replacing §0.1's three bullets:

> **Firefly Management asks for one week and one export.**
>
> **Week 1 — Analyse.** Firefly audits your existing presence: ninety days of reach, engagement,
> language and geography on your own channels, against the same window for Dr. Kasalu, Sen. Wambua
> and Hon. Ngilu. Public data for them; your own export for you.
>
> **Weeks 2–3 — Strategise.** From that audit, Firefly defines what to post, for whom, in which
> language, on which channel, and why. Four pillars, six segments, three languages, one calendar.
>
> **Weeks 4 onward — Direct.** Your team keeps publishing. Firefly issues the weekly brief, approves
> the calendar, and reviews performance against recognition in the sub-counties where you are least
> known.
>
> **Firefly publishes nothing on your accounts and holds no credentials to them.** The one thing it
> operates directly is the offline layer it already holds: the WhatsApp Business API line and the
> USSD shortcode. `[CONFIRM/EDIT]`

Keep §0.2's honest caveat about Dr. Kasalu's 201,899 votes verbatim — it is the most credible
paragraph on the site. Keep the 15.3-point figure. Delete "What is being bought" (§0.3) entirely and
replace with the 6 / 6 / 2 ownership split as a single visual.

*Visual replacing the cut text.* **"The three steps."** A horizontal rail, three stations, each with
one line and one output: ANALYSE → *the presence audit*; STRATEGISE → *the pillar map and the
calendar*; DIRECT → *the weekly brief*. Underneath, a thin ownership bar: six blocks Firefly-owned,
six team-executed, two out of scope. Replaces §0.3 in full (roughly 180 words) and the scope-level
recommendation sentence.

---

**New Section 1 — Existing Presence Audit** · ADD · **P1**

*Why.* Analyse must come first and must be about him. Without it, the site has no evidence that
Firefly can see anything his team cannot.

*The exact change.* New file `public/content/presence.md`, routed as Section 1 in
`lib/heading-slug.ts`, immediately after `decision`. Content is the spec at 3c: metrics, window,
method, decision rules, four visuals. Prose budget: under 500 words. The four visuals carry it.

*Visual spec.* Visuals 1–4 as specified in 3c, each with the `[DATA NEEDED — Week 1 export]` empty
state.

---

**§1.1 / ClientPage chrome — the addressee** · CHANGE · **P1**

*Why.* The document argues how to defeat three Wiper rivals and addresses itself to Wiper's
leadership. That is not a typo; it is a disclosure risk to the man it is written for.

*The exact change.* In `components/ClientPage.tsx:602`, replace
`— prepared for Wiper Democratic Movement campaign leadership.` with
`— prepared for Hon. Dr. Benson Makali Mulu, MP. Personal and confidential.`
In `:951`, replace the footer string with
`— link-only, prepared for Hon. Dr. Benson Makali Mulu personally. Not for circulation.`
In `cover.md` §1.1, change **Date:** to `September 2026` and add one line to §1.2: *"This document is
for Dr. Mulu. It is not addressed to any party organ, and it should not be shared with one."*

---

**§2.1 — The mandate** · CHANGE · **P1**

*Why.* "This document details a comprehensive digital campaign apparatus. The operational scope spans
multi-channel social media governance, localized content development…" is the old positioning in a
single sentence, in the executive summary, where a busy reader stops.

*The exact change.* Replace that paragraph with:

> Dr. Mulu is already in the conversation. A verified page, 745 posts, a team that publishes every
> day in three languages. What the record does not yet show is a reason behind any single post: which
> voter it was for, which of the 275,570 registered voters in his recognition-deficit wards it
> reached, and whether it moved anything. Firefly supplies that layer. It analyses the race, the
> electorate and his own performance; it defines what to post and why; and it directs his team
> through briefs, calendars, approvals and reviews. The team keeps publishing.

Keep §2.2 and §2.3 unchanged — the governing constraint and the three structural constraints are the
strongest analysis on the site and are unaffected by the repositioning.

---

**§8.0 — The fourteen workstreams** · CHANGE · **P1**

*Why.* The table's third column is headed "What Firefly runs" for all fourteen rows. That single
column heading is the proposal's misreading of his situation, repeated fourteen times.

*The exact change.* Retitle the section **"What Firefly owns, what your team runs, and what is
outside this"**. Replace the "What Firefly runs" column with two: **Owner** (Firefly / Your team,
directed / Out of scope) and **What Firefly contributes**. Populate from the reclassification table
above. Add a lead line: *"Six of the fourteen are Firefly's to operate. Six your team already runs
and will keep running, to a brief. Two are not this engagement's to touch."* Keep §8.0.2's
out-of-scope list — it is well drawn — and add Workstream 10 to it.

*Visual replacing the cut text.* **"Fourteen, sorted."** Three columns of cards under the three
ownership headings, each card one workstream with a one-line contribution. Replaces §8.0.1's table
and §8.0.3's level prose (roughly 300 words).

---

**§8C / §8.10 — the offline layer** · CHANGE · **P1**

*Why.* This is the only thing Firefly operates directly, and it is currently buried as workstream 9
of 14, presented at the same weight as things his team already does.

*The exact change.* Lift §8.10 into its own short section under the new Section 4, "What Firefly
operates". Open with the plain statement: *"Two pieces of infrastructure, held and run by Firefly:
the WhatsApp Business API line and the USSD shortcode.* `[CONFIRM/EDIT — confirm both are held, and
whether the shortcode is dedicated or shared]`*. Everything else on this page is your team's, to a
Firefly brief."* Keep §8.10.6's consented-list ladder — it is the one number in the document that
compounds. Move §8.8, §8.9 and §8.11 behind a collapsed "campaign-owned, for reference" fold.

---

**§9 — The roadmap** · CHANGE · **P1**

*Why.* Phase −1 is dated "August–September 2026" and Phase 0 "September–October 2026". Both windows
have opened, and one has largely closed, before the link is sent.

*The exact change.* Re-cut every phase as weeks from signature rather than calendar months.
`lib/phases.ts` carries the labels, so edit there and in `roadmap.md` together:
Phase −1 → **"Weeks 1–6 · Audit, strategy, first directed cycle"**;
Phase 0 → **"Weeks 4–10 · Instrumentation"**;
Phases 1–3 keep their calendar anchors because they are tied to the electoral calendar, not to
Firefly's start date. Move the Week 1 digital-audit bullet out of §9.1.1 — it now has its own
section — and leave a cross-reference.

---

**§10 — Deliverables and scope levels** · CHANGE · **P1**

*Why.* The three levels are denominated in Firefly's production volume: flagship videos per week,
daily social, weekly Live. That is a production vendor's price ladder, and under the new positioning
it describes work his team does. It also carries the last campaign-finance residue on the site.

*The exact change.* Re-denominate the levels in **depth of intelligence**, not volume of output:

| | Level 1 | Level 2 *(recommended)* | Level 3 |
|---|---|---|---|
| Presence audit | Once, at start | Refreshed monthly | Refreshed fortnightly |
| Wards instrumented for reach reporting | 12 decisive wards | **All 40** | All 40 + diaspora |
| Weekly brief | Yes | Yes | Yes |
| Creative testing | Monthly cycle | Weekly cycle | Weekly + message lab |
| Research | None | Quarterly focus groups | Monthly message lab |
| Team upskilling | Standard written once | Standard + pairing to Month 3 | Standard + embedded coaching |
| Offline layer | SMS to consented list | **SMS + USSD, all 40 wards** | + expanded WhatsApp API |

Delete the row "Digital ad share of the agreed spend envelope · 15–20% / 30–40% / 45–55%" and the
`[SPEND ENVELOPE — AGREED AT CONTRACTING]` paragraph beneath it. Delete "These are levels of scope,
not price lists" — a sentence denying price is still a sentence about price. Keep the definitional
table at the top of §10.1.1 (consented contacts ⊂ contact universe, verified supporters ⊂ pledged
voters); it prevents a real confusion. In §10.2, strip every row Firefly no longer produces and mark
the rest "produced by your team, to the weekly brief".

*Visual replacing the cut text.* **"What changes between the levels."** A three-column comparison with
seven rows and filled/half/empty dots. Replaces §10.1.1's three prose blocks in full (roughly 700
words).

---

**§12 — Governance** · CHANGE · **P1**

*Why.* §12.1.2 "What Firefly runs" lists content production and scheduling, community management,
fundraising and paid media as Firefly's. Under the new positioning, three of those are his team's and
one is the campaign's. Left standing, this block contradicts every other change recommended here.

*The exact change.* Delete §12.1.2 and replace with the direction model drafted at item 5c. Rewrite
§12.3's decision-rights table to name three parties, not two:

| Content type | Drafted by | Approved by | Published by | Turnaround |
|---|---|---|---|---|
| Routine post inside an approved brief | Your team | Your team lead | Your team | Same day |
| New policy claim or figure | Your team | Firefly + campaign counterpart | Your team | 24 hours |
| Kikamba voice note | Your team + Kikamba reviewer | Firefly | Your team | 48 hours |
| Response to attack, Level 1 | Your team | Your team lead, Firefly notified | Your team | ≤4 hours |
| Response to attack, Level 2 | Firefly drafts | Campaign comms director | Your team | ≤2 hours |
| Response to attack, Level 3 | Firefly drafts | Candidate | Your team | ≤30 minutes |
| SMS / USSD / WhatsApp broadcast | Firefly | Campaign counterpart | **Firefly** | 24 hours |
| Any voter-file-based targeting | — | **§12.5.5 gate** | — | Before launch |

Note the one row where Firefly publishes. That asymmetry is the positioning, stated as a workflow.
Keep §12.5 in full and promote §12.5.5 — it is the strongest governance control in the document.

---

**§14 — Delivery structure** · CHANGE · **P1**

*Why.* §14.6 draws the Firefly Digital Director above content, paid media, community managers, video
editors and 40 ward champions. It is a replacement org chart for a team that already exists. §14.4's
surge bench compounds it by listing community managers and video editors as Firefly hires.

*The exact change.* Replace §14.6's reporting-lines diagram with two columns and one interface:

```
   YOUR TEAM (existing)                 FIREFLY (three people)
   ────────────────────                 ──────────────────────
   Team lead / publisher                Strategy Director
   Content producers                    Analyst
   Kikamba producer                     Offline-layer operator
   Community responders                      │
        │                                    │
        └──────── the weekly brief ──────────┘
                        │
              Campaign counterpart (one named person)
                        │
                   Dr. Makali Mulu
```

Cut §14.4's Community Managers and Video Editor rows — those roles exist on his side. Keep the
Kikamba reviewer (as a reviewer, not a producer), the Data Analyst and the Crisis Lead. Rewrite
§14.1's "sprawling in-house teams" framing: it currently reads as an argument against the very team
he has, which is a bad sentence to leave in front of the man who hired them.

*Visual replacing the cut text.* The two-column diagram above, plus a small strip: *"Firefly adds
three people. It removes none."* Replaces §14.6's ASCII tree and §14.1's four numbered arguments
(roughly 450 words).

---

**§16 — Next steps** · MERGE · **P1**

*Why.* The site asks twice: §0.1 at the front and §16.1 at the back, in different words, with a
countdown that no longer computes. A proposal that makes its ask twice is unsure of it.

*The exact change.* Fold §16.1's decision protocol into §0. Keep §16.2's closing paragraphs — the
"verifying whether public money delivered what it promised" line is the best sentence Firefly has
written — but strip the second ask from it and end on one sentence: *"Firefly would like one week and
one export. Everything after that is evidence."* Recompute or delete the "25 of those days"
arithmetic; the countdown should be generated from the date the link is sent, not hard-coded.

---

**§4 — Objectives** · CHANGE · P2

*Why.* Commitments 3–5 (200,000 supporters, 120,000 SMS subscribers, 400 ward captains) are
general-election build targets that assume Firefly staffs the field. Under the new model they are the
campaign's, and they crowd out the two objectives that are actually Firefly's.

*The exact change.* Promote Commitment 1 (sub-county recognition) and Commitment 2 (female preference
lift) to the section's whole first screen, and re-anchor both to the deficit sub-counties. Move
Commitments 3–5 behind a "general election, campaign-owned" fold, with Firefly's contribution named
as the instrument, not the target.

---

**§6 — Strategic approach** · CHANGE · P2

*Why.* §6.2's four pillars are Firefly's abstractions — "fiscal accountability and devolution",
"data-driven civic engagement". His own cover line already carries a stronger frame: *"The mission is
for Kitui to prosper. From Poverty to Wealth Creation."* The site never uses it.

*The exact change.* Re-anchor §6.2 on the cover line and merge with the content engine at item 5a.
Keep §6.1.2 (the resource paradox) and §6.1.3 (the answer to "discipline is cold") intact — both are
strong and both survive the repositioning untouched.

---

**§11 — Measurement** · CHANGE · P2

*Why.* §11.2.3 already excludes vanity metrics and §11.1.1's NW-02 already measures Mwingi name ID.
The problem is ordering: NW-02 sits third in a four-row ASCII table, and §9.1.1's Phase −1 KPI table
still counts "combined social reach 400,000" and "engaged followers 20,000", which are exactly the
metrics §11.2.3 rejects.

*The exact change.* Promote NW-02 to the headline indicator. Add the four indicators at item 5e.
Delete the "combined social reach" and "engaged followers" rows from §9.1.1's KPI table — they
contradict §11.2.3 two sections later, and a reader who notices stops trusting both.

---

**§13 — Risk** · KEEP · P2

*The exact change.* One added row to the register: *"Firefly's brief and the team's judgement
disagree."* Mitigation: the brief states intent and the rule, not the caption. Where the team
overrides, they log why in the calendar, and the monthly review reads the overrides as data. A
direction model with no disagreement protocol fails on its first collision.

---

**§15 — Assumptions** · CHANGE · P2

*The exact change.* Delete assumption 4's implication that Firefly assembles a team. Add four:
(i) the Facebook asset is a Page, not a personal profile; (ii) his team will accept a weekly brief
and a named approval path; (iii) Insights access can be granted at analyst level without admin
rights; (iv) any existing SMS or WhatsApp list carries documented opt-in, or is not used.

---

**Annexes C and D** · CHANGE · P2

*Annex C.* Re-cut the message-assignment grids by the four new pillars. The segment and channel axes
survive; only the row labels change.

*Annex D.* Cut the four-forum "Campaign Leadership Governance Cadence" chart. It sets the *campaign's*
internal meeting rhythm, including the candidate's Monday war room and the finance officer's invoice
clearances — none of which is Firefly's to schedule, and one of which is a budget reference.
Keep the Firefly–campaign rhythm table at the top of §12.2 and nothing else.

---

## 5. New sections — draft copy and visual specs

### 5a. The content strategy engine

*Draft copy.*

> **Four pillars. One mission, in his own words.**
>
> *"The mission is for Kitui to prosper. From Poverty to Wealth Creation."* That line is already on
> his cover. Nothing published so far argues it. These four pillars do — and the fourth feeds the
> first, so the campaign compounds instead of repeating.
>
> **Pillar 1 · Where the money went.**
> *Segment:* smallholders and traders in Mwingi and Kitui South — the 275,570 registered voters in
> the recognition-deficit pool (§3.4.5).
> *Language:* Kikamba primary, Kiswahili secondary.
> *Channel:* WhatsApp voice note, SMS, Facebook.
> *Format:* 45–60 seconds. One figure. One named place. One verdict: delivered, delayed, or not done.
> *Why it exists:* no rival can run it. Dr. Mulu is an M&E Champion designated by the Ministry of
> Finance and ran the best-evaluated constituency in the Eastern region for FY2014/15 (§2.1). This
> pillar turns that from a line in a CV into a weekly habit, and it answers *"who is this man"* with
> a ward name rather than a qualification.
>
> **Pillar 2 · From poverty to wealth creation, one household.**
> *Segment:* the rural agrarian baseline and the women's household economy — 587,151 women, 51.7% of
> residents (§4.1.2).
> *Language:* Kikamba.
> *Channel:* WhatsApp, SMS, Facebook.
> *Format:* one household, one income stream, one number. Poultry is in over 90% of Kitui households
> (§3.3.5) and carries no county policy at all.
> *Why it exists:* the cover line is currently a banner. A slogan with no weekly proof behind it is a
> banner. This pillar is the proof.
>
> **Pillar 3 · The economist explains.**
> *Segment:* youth 18–35, traders, professionals, the out-of-county Kamba diaspora.
> *Language:* Kiswahili and Sheng, with Kikamba hooks; English for diaspora and press.
> *Channel:* TikTok, Facebook, X, YouTube.
> *Format:* 45-second vertical video. One county figure made physical — KSh13.79 billion, or
> KSh670 million in unconfirmed cash balances, shown with objects rather than charts.
> *Why it exists:* it converts "PhD in Economics" from a title into a demonstrated skill, and it is
> the only pillar that travels beyond the county to the diaspora and the national desk.
>
> **Pillar 4 · He came, and this is what he said he would do.**
> *Segment:* the specific ward visited, that day.
> *Language:* Kikamba and Kiswahili.
> *Channel:* Facebook, the ward's WhatsApp group, SMS to that ward's consented list.
> *Format:* the photograph his team already takes — plus one commitment and one date.
> *Why it exists:* this is not new work. It is his current daily activity post with two fields added.
> Twelve weeks later, that commitment and that date become a Pillar 1 post. The engine is the loop
> between pillar four and pillar one, and nothing else on this page matters as much.
>
> `[KIKAMBA REVIEW NEEDED — pillar names in Kikamba, by the native-speaker reviewer named in §15.1.
> None invented here.]`

*Visual spec.* **"The engine."** A closed loop, four stations: *Visit* → *Commitment logged with a
date* → *(12 weeks)* → *Verification post* → *Tracker entry* → back to *Visit*. Beside it, a 4×5 grid:
one row per pillar, columns for segment, language, channel, format, reason. The grid replaces the
four-pillar prose in §6.2.1 and the four content pillars in §8.3.1 — two overlapping four-item lists,
roughly 600 words, collapsed into one grid and one loop.

### 5b. Before and after — one week of daily activity posts

*Draft copy.*

> **Same week. Same events. Same team. Different structure.**
>
> The pattern below is his current one as observed from the public page: a daily record of where he
> was, mostly in English, with no ward named outside Kitui Central, no commitment attached and no ask.
> `[CONFIRM against the Week 1 export before this is shown to him — it must be his actual week, not
> a characterisation of it.]`

| Day | Now | After |
|---|---|---|
| Mon | Church service, Kitui Central. Photos. English caption. | **P2.** Same photos. Kikamba caption on one family's poultry income. One figure. |
| Tue | Delegation meeting. Group photo. English. | **P3.** 45-second vertical clip: what the delegation asked for, and what it costs the county. Kiswahili. |
| Wed | Budget Committee, Parliament. Photo. English. | **P1.** What that committee released to Kitui this quarter, and whether it arrived. Kikamba voice note. |
| Thu | Road inspection. Photos. English. | **P4.** Same photos, plus: the ward named, one commitment, one date. Goes to that ward's WhatsApp group and consented SMS list. |
| Fri | Funeral attendance. Photos. | *Unchanged.* Not every post is a campaign asset, and one that tries to be is worse than one that does not. |
| Sat | Harambee. Photos. English. | **P2.** One household, one income stream, one number. Kikamba. |
| Sun | Church. Photos. | **P1.** A twelve-week-old Thursday commitment, revisited. Delivered, delayed, or not done. |

> **Two rules on top.** At least two of the seven originate in a ward inside the deficit pool.
> At least four are Kikamba-first. Both rules are set by the Week 1 audit, not by preference, and
> both are checked in the weekly review.
>
> **What changed:** two fields on a Thursday post, and a language rule. **What did not change:** who
> takes the photograph, who writes the caption, and who presses publish.

*Visual spec.* **"Seven days, twice."** Two stacked seven-tile strips, before and after, each tile
coloured by pillar with the language as a corner mark. Deficit-ward posts carry a ring. The single
most persuasive object on the site, because it shows the change costing him nothing. Replaces any
prose explanation of the pillar system in operation.

### 5c. The direction model

*Draft copy.*

> **Firefly steers. Your team publishes. One brief a week holds it together.**
>
> **Thursday, 16:00 — the brief.** One page from Firefly: last week's reach in the deficit wards
> against the week before; this week's pillar weights; the three posts that must happen and the ward
> each is for; the language rule; one thing to stop doing.
>
> **Friday — the calendar.** Your team returns the week's calendar in the shared sheet, mapped to the
> brief. Firefly comments; it does not rewrite.
>
> **Monday, 09:00 — thirty minutes.** Approve, amend, flag. The only standing meeting in the
> engagement.
>
> **Tuesday to Sunday — publishing.** Your team, on your accounts, with your credentials. Firefly
> publishes on one channel only: the SMS, USSD and WhatsApp layer it operates.
>
> **Wednesday — one number.** A mid-week reach check against the deficit wards, and at most one
> adjustment. If nothing needs adjusting, nothing is sent.
>
> **Last Friday of the month — the review.** Recognition indicators, the overrides log, and the brief
> re-based on what the month proved.

**RACI.** R responsible · A accountable · C consulted · I informed.

| Activity | Firefly | Your team | Dr. Mulu | Campaign counterpart | Appointed reviewer |
|---|---|---|---|---|---|
| Presence audit and analysis | **R/A** | C | I | I | — |
| Pillar and segment strategy | **R/A** | C | C | C | — |
| Weekly brief | **R/A** | C | I | I | — |
| Content calendar | C | **R** | I | **A** | — |
| Writing, filming, editing | C | **R/A** | C | I | — |
| Kikamba language review | C | **R/A** | I | I | — |
| Publishing to owned accounts | I | **R/A** | I | I | — |
| Community replies and moderation | C | **R/A** | I | I | — |
| Paid targeting plan | **R** | C | I | **A** | — |
| Ad account operation | C | **R** | I | **A** | — |
| SMS / USSD / WhatsApp dispatch | **R/A** | I | I | C | C |
| Measurement and reporting | **R/A** | C | I | I | — |
| Data-protection sign-off | C | I | I | **A** | **R** |
| Crisis, Level 3 | **R** | C | **A** | C | I |

*Visual spec.* **"The week."** A seven-day ring with four marked points — brief, calendar, call,
review — and the publishing days shaded in the team's colour, not Firefly's. Beside it, the RACI as a
dot matrix: solid for R, ring for A, small dot for C, blank for I. Replaces §12.1.1's four bullets,
§12.2's meeting table and Annex D's four-forum chart (roughly 900 words across three places).

### 5d. Team onboarding

*Draft copy.*

> **Firefly assesses the team you have. It does not replace it.**
>
> **Week 1 — the capability map, not an appraisal.** Four axes, scored 1–4, with each person in the
> room while it is scored: platform mechanics, Kikamba fluency and cultural register, measurement
> literacy, response speed under pressure. The map goes to Dr. Mulu and to the team. Nobody is graded
> in private.
>
> **Week 2 — one written standard.** The brief template, the caption pattern, the commitment-and-date
> rule, the language rule, the escalation line, the accessibility floor. Six pages. It belongs to the
> team from the day it is written.
>
> **Weeks 3–8 — pairing, not training.** Firefly and the team write the first three briefs together.
> Then Firefly writes and the team marks it up. Then the team drafts and Firefly reviews.
>
> **Month 3 — the handover of the pen.** The team writes the weekly brief; Firefly reviews and
> challenges it. That is the success measure. An intelligence layer that makes itself permanently
> necessary has failed at the part that mattered.
>
> **Where a gap cannot be closed by upskilling** — no native Kikamba producer, no one who can cut
> vertical video — Firefly names the gap in the capability map and the campaign decides whether to
> fill it. Firefly does not fill it by default, and does not propose itself for the role.

*Visual spec.* **"Four axes, twelve weeks."** A small radar chart per team member — anonymised as
Producer 1, Producer 2 — with two overlaid traces, Week 1 and Month 3, the second drawn as a target
outline until it is measured. Below, a three-band timeline: *assess · standardise · hand over*.
Replaces §14.4's surge-role table in part (roughly 300 words), since three of its rows disappear.

### 5e. Re-anchored measurement

*Draft copy.*

> **Followers are not the target. Being known in Mwingi is.**
>
> §11.2.3 already rejects vanity metrics. These five indicators say what replaces them. Every one is
> measured where he is least known, and four of the five can be read weekly.

| Code | Indicator | Method | Baseline | Target |
|---|---|---|---|---|
| **R-01** | Aided name recognition, Mwingi North, Central and West | Sub-county CATI booster, N=600 (§11.1.1 NW-02) | `[DATA NEEDED — Week 1 instrument]` | ≥70% |
| **R-02** | Share of total reach landing in the 275,570-voter deficit pool | Meta city breakdown mapped to sub-county, weekly | `[DATA NEEDED — Week 1 export]` | ≥51.7%, the pool's share of the register |
| **R-03** | Shares per 1,000 reached, deficit wards only | Post-level export, weekly | `[DATA NEEDED — Week 1 export]` | Set against the measured Week 1 figure, as a stated gain |
| **R-04** | Consented contacts in the 24 deficit wards, and their share of the list | Firefly's own dispatch logs | 0 | Deficit-ward share of the list ≥ deficit-ward share of the register |
| **R-05** | First-choice preference among likely Wiper primary voters | Rolling tracking poll, N=400 CATI (§11.1.1 NW-01) | Not yet measured | ≥55% |
>
> **Excluded, and named so the exclusion is visible:** total followers, impressions, post likes, video
> views. They move without any voter moving. R-03 is included instead of likes because a share puts
> his name inside a network he does not own — which, in a ward where he is unknown, is the only thing
> a post can usefully do.

*Visual spec.* **"The recognition ladder."** One row per deficit sub-county. A hollow dot for the
Week 1 baseline, a filled dot for the latest wave, a connecting line, and a vertical target line at
70%. Rows sort by distance from target, so the worst sits at the top. Replaces §11.1.1's and
§11.1.2's two ASCII KPI tables (roughly 700 words), with the full tables kept behind a fold for the
reader who wants them.

---

## 6. Risk flags, most severe first

**1. The addressee.** `components/ClientPage.tsx:602` and `:951` address the document to "Wiper
Democratic Movement campaign leadership", in the header chrome and the footer — the two places
visible on every route. The document's own §3.1 describes a contested Wiper nomination against
Dr. Kasalu, Sen. Wambua and Hon. Ngilu, and §13.4.4 assesses each of them. A strategy for defeating
three Wiper aspirants, addressed to Wiper. §0.5 and §1.1 meanwhile address it correctly to Dr. Mulu,
so the site contradicts itself. **Recommended addressee: Hon. Dr. Benson Makali Mulu, MP —
personally, and named as such in both chrome strings, the metadata description and §1.2.** No party
organ, no "campaign leadership", no committee. P1, and it is a two-line code change.

**2. Wording that still implies Firefly will create, take over or run his accounts.** In descending
order of damage:

| Location | Wording | Fix |
|---|---|---|
| §12.1.2 | "What Firefly runs" — content production and scheduling, community, fundraising, paid media | Delete the section; replace with the direction model (5c). |
| §14.6 | Org chart placing the Firefly Director above content, paid media, community managers, 40 ward champions | Replace with the two-column diagram (§14 card). |
| §9.1.2 | "professional pages, website, analytics dashboards and donation portal live" | "Analytics access configured on the accounts you already hold." |
| §9.1.1 | "Secure and harden all accounts: hardware-key 2FA for the candidate and all admins" | Reads as Firefly taking admin. "Firefly specifies the account-security baseline; your team applies it." |
| §8.6 | "Daily posts in English, Kiswahili and Kikamba", per platform, as Firefly's deliverable | Reframe every platform block as a brief: what to post there and why, not that Firefly posts it. |
| §8.3 | "the studio", "the weekly production schedule", "who approves what" | Retitle as the brief-and-calendar spec. |
| §10.1.1 | Levels denominated in videos per week, daily social, weekly Live | Re-denominate as depth of intelligence (§10 card). |
| §2.1 | "This document details a comprehensive digital campaign apparatus" | Replaced in the §2.1 card. |
| §0.3 | "What is being bought: fourteen numbered workstreams…" | Delete; replace with the 6/6/2 ownership visual. |
| §8.11 | Volunteer tiers, gamification, leaderboards run by a Firefly coordinator | Move out of scope; Firefly defines the metrics only. |
| Site title / hero | "Kitui 2027: the operating system for an Economist Governor" | An operating system is something you install to replace what is running. Suggest: **"Kitui 2027: the intelligence behind what you already publish."** |

**3. Confidentiality — the repository is public and the site is not.** `app/layout.tsx` sets
`robots: {index: false, follow: false}`, and §1.2 asserts the proposal "should not be circulated
beyond the campaign's decision-making group". Meanwhile the full text of all 28 sections sits in
`public/content/*.md` in a public GitHub repository, along with `WRITING-LOG.md`,
`AUDIT-FINDINGS-PROMPTS-A-AND-B.md`, `docs/restructure/*` and `docs/REMOVED-CONTENT.md` — internal
notes about the client and about what was cut for him. GitHub is indexed. The noindex on the site is
therefore cosmetic: the document is already public, in a more damaging form, under a repository name
that contains the candidate's name. **Fix before sharing: make the repository private.** If it must
stay public, move `public/content/` out of the repo and load it from a private store — but private is
the correct answer, and it costs nothing. P1.

**4. Data protection under the Data Protection Act, 2019.** §12.5.5 is the strongest control in the
document and should be kept and promoted, not weakened. Four exposures it does not currently cover:

* **Controllership is unstated.** Under the new positioning Firefly *operates* the WhatsApp Business
  API line and the USSD shortcode. That makes Firefly a data controller, or a joint controller with
  the campaign — not a processor acting on instructions. Registration obligations, breach-notification
  duty and liability follow controllership. The site must say who the controller is for each channel,
  in a sentence, and §12.5.5's scope memorandum must answer it before the first dispatch.
* **Inherited lists.** Any SMS or WhatsApp contacts held by the existing team arrive with unknown
  opt-in provenance. `[DATA NEEDED]` Recommend a stated rule on the page: *a contact whose consent
  cannot be evidenced is not messaged*, and no inherited list is merged into the consented list until
  its origin is documented. This is also the honest answer to §12.5.2's own point about purchased
  databases.
* **The presence audit itself processes personal data.** Commenter analysis, demographic breakdowns
  and engagement coding all touch data subjects. It is low-risk and aggregate, but it should sit
  inside the §12.5.5 scope memorandum rather than outside it. Add one line to the new Section 1.
* **Live-looking identifiers in a public repository.** §8.3.3 prints a USSD string `*483*77#` and an
  SMS opt-out `STOP=22340`, and §8.2.2 uses `[Insert shortcode]` elsewhere. Either these are
  provisioned to this campaign — in which case publishing them in a public repo is an exposure — or
  they are not, in which case printing them as live is a factual error in a document whose whole
  argument is provenance. Resolve, and mark them as placeholders until provisioned.

**5. Residual budget, cost and spend language.** The constraint says no cost, budget or fee figures,
and no campaign-finance material. County fiscal figures (KSh13.79bn, the audit record) are policy
content and stay. These are the residue:

| Location | Wording |
|---|---|
| §10.1.2 | "Digital ad share of the agreed spend envelope · 15–20% / 30–40% / 45–55%" and the `[SPEND ENVELOPE — AGREED AT CONTRACTING]` paragraph — the largest single breach, and it is a table row a reader will stop on |
| §10.1.1 | "These are levels of scope, not price lists"; "What it costs is a conversation for the meeting" |
| §3.4.5 | "65% of all Phase −1 digital ad spend (Meta, Google, YouTube) must be geofenced…" |
| §11.2.4 | "automatically reallocates 20% of digital/creative budget" |
| §0.2, §9.1.1 | "before significant budget commits against it" |
| §12.5.5 | "fully costed in every budget tier" |
| §14.3 | "approved budget envelope"; "cannot exceed a ward's agreed envelope" |
| §12.3 | two rows on paid-spend reallocation |
| Annex D | "Approve weekly budget & tour itinerary"; "Authorize milestone invoice clearances"; "Finance Officer" |
| Annex E | "cost very little" |
| §3.4.2, §3.5.4 | "disproportionate Phase −1 budget weighting"; "distribute 100% of budget" |

§3.6.3 already shows the correct register — it argues in *share of communications effort* and says so
explicitly. Convert every entry above to that language: effort weight, output weight, ward priority.
Delete the §10.1.2 row and paragraph outright.

**6. Dates that have passed or need updating.** As of today, 16 September 2026: the cover is dated
August 2026 (§1.1); Phase −1 is dated August–September 2026 (§9.1.1, `lib/phases.ts`); Phase 0 is
dated September–October 2026 and is half elapsed; the objectives clock opened on 29 August 2026
(§4.1); the Mizani round is 40 days old; and the 30 September 2026 decision date is 14 days away,
which collides with the "meeting within the next fourteen days" ask in §16.2 — the meeting would land
on the deadline. §0.2's claim that a 30 September decision "leaves about 25 of those days" was written
against an earlier send date and no longer computes. Recommendation: re-date the cover; convert phases
to weeks-from-signature; and either recompute the countdown from the actual send date or replace it
with the underlying point, which does not decay — *the polling window opens in late October, and the
sprint needs six weeks in front of it.*

---

## 7. Revised site outline

Analyse → Strategise → Direct, legible from the first screen.

**Screen 1 · Section 0 — The decision.**
Headline: *"You already have the reach. This is what it is doing."*
The three-step rail: ANALYSE · STRATEGISE · DIRECT, one line each.
The ask: one week, one export.
Two figures: **15.3 points** behind; **51.7%** of the register in wards where he is least known.
One boundary: *Firefly publishes nothing on your accounts.*
The 6 / 6 / 2 ownership bar.

**ANALYSE**
* **1. Your presence today** *(new)* — the 90-day audit. Four visuals. Under 500 words.
* **2. The contest** — §3.1, §3.3.2, §3.3.6, the Mizani rounds, Dr. Kasalu's 201,899 votes.
* **3. The electorate** — §3.4 arithmetic, §3.5 zones, §3.6 reach, §3.7 media ownership.

**STRATEGISE**
* **4. The engine** *(new, absorbing §6.2, §7.1, §8.3.1)* — four pillars, segment, language, channel,
  format, reason.
* **5. One week, before and after** *(new)* — the seven-day strip.
* **6. Message discipline** — §7.2 and §7.3, compressed; Annex C behind it.

**DIRECT**
* **7. How the week runs** *(new, absorbing §12.1, §12.2, §12.3)* — brief, calendar, approval, review,
  RACI.
* **8. Your team** *(new, absorbing part of §14)* — capability map, the written standard, the handover
  of the pen.
* **9. What Firefly operates** *(from §8.10)* — WhatsApp Business API and USSD. The one place Firefly
  publishes.
* **10. What is measured** — the recognition ladder, R-01 to R-05, and what is excluded.

**TERMS**
* **11. Ownership map** — the fourteen, sorted 6 / 6 / 2, with what is outside.
* **12. Risk and compliance** — §13 compressed, §12.5 promoted, §12.5.5 as the gate.
* **13. Assumptions and what is needed** — §15, with the four new assumptions.
* **14. Confidentiality and terms** — §1, re-addressed.
* **Annexes A–E** — evidence standard, county reference, message assignment, cadence, runbooks.

Twenty-eight routes become fourteen plus five annexes. Nothing in Section 3 is deleted; the
arithmetic, the zones and the media analysis are the strongest evidence Firefly has, and they are
*why* the strategy layer is credible. They simply stop being the opening argument.

---

## 8. Implementation checklist, in order

Ordered so nothing is written twice.

| # | Edit | File | Priority |
|---|---|---|---|
| 1 | Make the GitHub repository private | repository settings | **P1** |
| 2 | Re-address the header and footer chrome to Dr. Mulu personally | `components/ClientPage.tsx:602`, `:951` | **P1** |
| 3 | Re-date the cover; add the "not addressed to a party organ" line | `public/content/cover.md` §1.1, §1.2 | **P1** |
| 4 | Update the metadata description; keep `robots: index:false` | `app/layout.tsx` | **P1** |
| 5 | Write the new ask and the three-step rail | `public/content/decision.md` §0.1–§0.3 | **P1** |
| 6 | Create the Existing Presence Audit section | new `public/content/presence.md` | **P1** |
| 7 | Register the new route and its position in the order | `lib/heading-slug.ts` (`SECTIONS`), `app/[[...slug]]/page.tsx` (`FILES`) | **P1** |
| 8 | Replace the §2.1 opening paragraph | `public/content/summary.md` | **P1** |
| 9 | Delete §12.1.2; write the direction model and the three-party approval table | `public/content/governance.md` | **P1** |
| 10 | Redraw the reporting lines as two columns; cut the community-manager and video-editor rows; rewrite the §14.1 framing | `public/content/structure.md` | **P1** |
| 11 | Retitle §8.0 and add the Owner column with the 6/6/2 split | `public/content/scope.md` | **P1** |
| 12 | Delete the ad-share row and the spend-envelope paragraph; re-denominate the levels | `public/content/deliverables.md` §10.1.1, §10.1.2 | **P1** |
| 13 | Re-cut the phases as weeks from signature | `public/content/roadmap.md`, `lib/phases.ts` | **P1** |
| 14 | Fold §16.1 into §0; cut the second ask; fix or remove the countdown | `public/content/nextsteps.md` | **P1** |
| 15 | Build the four presence-audit visuals with honest empty states | `components/charts/` — reuse `WardCartogram.tsx`; new `PresenceStrip.tsx`, `LanguageBars.tsx`, `FieldComparison.tsx` | **P1** |
| 16 | Write the content strategy engine; merge §6.2 and §8.3.1 | new `public/content/engine.md`; edit `approach.md`, `scope-platforms.md` | P2 |
| 17 | Write the before-and-after week | into `engine.md`; new `components/charts/WeekStrip.tsx` | P2 |
| 18 | Write team onboarding | into `structure.md` or new `public/content/team.md` | P2 |
| 19 | Add R-01 to R-04; promote NW-02; delete the reach and follower rows from §9.1.1's KPI table | `public/content/measurement.md`, `roadmap.md` | P2 |
| 20 | Reclassify the fourteen across the scope files; move §8.11 out of scope; lift §8.10 into "What Firefly operates" | `scope-platforms.md`, `scope-media.md`, `scope-ground.md`, `scope-data.md` | P2 |
| 21 | Re-anchor §4.1 on the deficit sub-counties; fold Commitments 3–5 | `public/content/objectives.md` | P2 |
| 22 | Sweep the remaining budget and spend language in the risk table above | `arithmetic.md`, `measurement.md`, `governance.md`, `structure.md`, `annex-cadence.md`, `annex-runbooks.md` | P2 |
| 23 | Add the controllership sentence, the inherited-list rule and the audit's own processing scope | `public/content/governance.md` §12.5 | P2 |
| 24 | Resolve or mark the `*483*77#` and `STOP=22340` identifiers | `public/content/scope-platforms.md` §8.3.3 | P2 |
| 25 | Add the four new assumptions; drop the team-assembly one | `public/content/assumptions.md` | P2 |
| 26 | Cut the four-forum governance chart | `public/content/annex-cadence.md` | P2 |
| 27 | Re-cut the message grids by the new pillars | `public/content/annex-messages.md` | P2 |
| 28 | Add the brief-versus-judgement row to the risk register | `public/content/risk.md` | P2 |
| 29 | Rename the hero line | `components/ClientPage.tsx`, `app/layout.tsx` | P3 |
| 30 | Re-run the content and figure guards | `scripts/verify-content-integrity.mjs`, `verify-figures.mjs`, `verify-deep-links.mjs`, `verify-mounts.mjs` | P3 |

Step 30 matters more than its priority suggests: the repo enforces that no figure is removed without
being accounted for (`scripts/figure-migrations.json`, `verify-figure-retention.mjs`). Every cut above
must be registered there or the build will reject it — which is exactly the discipline the site
claims, applied to itself.

---

## 9. Assumptions, and what to confirm with Dr. Mulu's team

**Assumptions made in this audit.**

1. The Facebook description given in the brief — ~15K followers, 745 posts, verified, bio and cover
   line as quoted, English/Swahili/Kamba listed, a visible friends list — is accurate as at today.
   Nothing here adds a number to it.
2. Firefly already holds and operates the WhatsApp Business API line and the USSD shortcode. The brief
   marks this `[CONFIRM/EDIT]` and so does every recommendation that depends on it.
3. His team is a functioning publishing team with its own credentials, not a single person, and its
   members are willing to work to an external brief.
4. The engagement is embedded, as §15.3 assumption 7 already states. Nothing recommended here is
   framed as remote, and the "no remote framing" constraint is currently unbreached — the only
   `remote` strings in the repo describe Kitui South's geography and diaspora family influence.
5. The fixed constraints in the brief override the site's own current content wherever they conflict.
6. Commercial terms stay off the page entirely, including the scope-level ad-share row, which is the
   one place the site still edges towards them.

**Open questions — the first three block Week 1.**

**Q1. Page or profile?** Is "Hon Makali Mulu" a Facebook Page or a personal profile in professional
mode? This determines whether Insights, ad accounts and delegated access exist at all. *How to
obtain:* one screenshot of Meta Business Suite, or of the Professional dashboard. Five minutes.

**Q2. Analyst access.** Can Firefly be granted Insights/Analyst access — read-only, no publishing
rights — on Facebook, and on whatever else he holds? The whole engagement is priced on reading data
Firefly cannot currently see. *How to obtain:* Meta Business Suite → People → add with Analyst role.

**Q3. The other platforms.** Handles and follower counts for X, TikTok, Instagram, YouTube, and any
WhatsApp Channel or Business number. *How to obtain:* ask the team lead; verify each publicly. Marked
`[DATA NEEDED]` until then, and not estimated.

**Q4. Who holds the ad account?** If Firefly writes targeting plans but the team operates the account,
the loop is slow. If Firefly operates it, that is Firefly running something — against the positioning.
Recommendation: the campaign holds the account, Firefly holds Analyst plus Advertiser access, and the
team places. Needs his decision, not an assumption.

**Q5. The existing lists.** Does the team hold any SMS or WhatsApp contact list, and can opt-in be
evidenced for it? If not, it is not merged and not messaged.

**Q6. The shortcode and sender ID.** Are `*483*77#` and `22340` provisioned to this campaign, or
illustrative? §15.1 lists them as pending at contracting, but §8.3.3 prints them as live.

**Q7. The team.** How many people, what does each do, and who is the team lead who would receive the
weekly brief? The direction model needs one name on the other side of the interface.

**Q8. The counterpart.** §15.1 item 1 and §14.6 both require one named campaign-side approver. Still
unfilled, and it gates the approval table in §12.3.

**Q9. The data-protection reviewer.** §12.5.5's long-lead item, still `[to be appointed]`. It now
gates more than before, because Firefly operating the WhatsApp and USSD layer raises the
controllership question in risk flag 4.

**Q10. September polling.** Has any round been published since Mizani's 7 August survey, or has the
campaign commissioned one? The entire opening argument rests on two observations, and the second is
40 days old.
