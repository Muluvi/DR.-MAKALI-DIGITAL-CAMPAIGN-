## 18.1 How success will be judged

Success is judged on measures Firefly can observe on his channels and on the SMS list it operates.

```figure
id: fig-1-5-scorecard
```

*The indicators themselves are set out in 18.1.*

#### The indicators

Every indicator here is one Firefly can observe on his own channels or on the SMS list it operates. Section 18.1 states the principle; this section states the measures.

```figure
id: fig-5-6-kpis
```

## 18.2 The scorecards for each stage

#### Stage scorecards: nomination window and general election

#### Stage 1: the nomination-window scorecard

The nomination phase focuses on securing the Wiper Patriotic Front nomination ticket.

```figure
id: nomination-scorecard
```

#### Stage 2: the general election scorecard

The general election phase focuses on voter mobilization, ground network readiness, and polling station defense to cross the {{benchmark}}-vote winning threshold.

```figure
id: ge-scorecard
```

#### Performance governance and executive escalation

To ensure accountability across all divisions, the KPI framework is embedded in a governance rhythm:

```visual
kind: stepper
items:
  - label: "Weekly Monday KPI Standup (08:00 EAT)"
    text: "Executive review of all Tier 1 metrics (NW-01 through NW-04 or GE-01 through GE-05)."
    body: "Any metric lagging behind target by $>10\\%$ triggers a mandatory **Red Flag Action Plan** within 24 hours."
  - label: "Monthly Reallocation Trigger"
    body: "If voter pledge recruitment (GE-01) lags in any sub-county for two consecutive cycles, the Campaign Manager shifts a fifth of that sub-county's communications weight from digital and creative output to ground sound-truck caravans, on the Section 12.2 weighting model."
  - label: "Polling Day Real-Time Conversion Operations (GE-04 & GE-05)"
    text: "On election day, the War Room monitors voter turnout conversion every hour from 06:00 to 17:00 EAT."
    body: "Wards reporting $<40\\%$ turnout by 12:00 EAT receive immediate boda boda mobilization squad dispatches."
```

## 18.3 Recognition where he is least known

#### Re-anchored: recognition and persuasion where he is least known

```lead
**R-02 is the indicator this engagement lives or dies on.** It is the only one fully inside the direction layer's control, it moves weekly, and it is the direct test of the recognition thesis in Section 7.1.
```

<!-- keep -->
**Followers are not the target. Being known in Mwingi is.**

Section 18.4 already rejects vanity metrics. These five indicators say what replaces them. Every
one is measured where Dr. Mulu is least known, and every one is read from his own channels or from
Firefly's dispatch logs.

```visual
kind: cards
preset: indicator
items:
  - title: "Followers located in Mwingi North, Central and West"
    chips: ["R-01"]
    head: { label: "Target", text: "A stated monthly gain on the Week 1 baseline" }
    fields:
      - { label: "Method", text: "Meta follower city breakdown mapped to sub-county, monthly (NW-02 above)" }
      - { label: "Baseline", text: "Set in Week 1" }
  - title: "Share of total reach landing in the {{pool}}-voter deficit pool"
    chips: ["R-02"]
    head: { label: "Target", text: "≥ {{pool.share}}%, the pool's own share of the register" }
    fields:
      - { label: "Method", text: "Meta city breakdown mapped to sub-county, weekly" }
      - { label: "Baseline", text: "Set in Week 1" }
  - title: "Shares per 1,000 reached, deficit wards only"
    chips: ["R-03"]
    head: { label: "Target", text: "Set against the measured Week 1 figure, as a stated point gain" }
    fields:
      - { label: "Method", text: "Post-level export, weekly" }
      - { label: "Baseline", text: "Set in Week 1" }
  - title: "Consented contacts in the 21 wards of the deficit pool, and their share of the list"
    chips: ["R-04"]
    head: { label: "Target", text: "Deficit-ward share of the list ≥ deficit-ward share of the register" }
    fields:
      - { label: "Method", text: "Firefly's own dispatch logs" }
      - { label: "Baseline", text: "0" }
  - title: "Kikamba-first share of weekly output, and its engagement on reach"
    chips: ["R-05"]
    head: { label: "Target", text: "≥ 4 of 7 weekly posts Kikamba-first (Section 12.6)" }
    fields:
      - { label: "Method", text: "Post coding, weekly (Section 18.5)" }
      - { label: "Baseline", text: "Set in Week 1" }
```

**R-02 is the indicator this engagement lives or dies on.** It is the only one fully inside the
direction layer's control, it moves weekly, and it is the direct test of the recognition thesis in
Section 7.1. If reach share in the deficit pool does not rise, the briefs are wrong and the monthly
review says so.

**Excluded, and named so the exclusion is visible:** total followers, impressions, post likes, video
views. They move without any voter moving. **R-03 replaces likes** because a share puts Dr. Mulu's
name inside a network he does not own — which, in a ward where he is unknown, is the only thing a
post can usefully do.

## 18.4 Why vanity metrics are excluded

The campaign excludes vanity metrics from all executive dashboards, reporting meetings, and vendor performance contracts based on the following realities:

```visual
kind: cards
items:
  - title: "Offline Reality"
    text: "{{ict.offline}}% of Kitui's residents are offline (CA/KNBS 2023/24, Tier 1)."
    body: "Optimizing for digital likes misallocates effort away from village barazas and market PA caravans."
  - title: "Geographic Skew"
    text: "Political content from Eastern Kenya draws a large share of its social media interaction from non-resident users in Nairobi, Mombasa and abroad, who are not registered to vote in Kitui's 40 wards."
    body: "**Evidence required:** an earlier draft of this section put that share at \"over 60%\", which no source in this proposal supports. The figure is withdrawn rather than restated; the ward-level split is obtainable from the campaign's own platform analytics in Week 1 (Section 14.1) and should replace this sentence once measured. The argument does not depend on the precise number."
    tier: "not yet tiered"
  - title: "Zero Correlation to Turnout"
    text: "A viral video does not transport an elderly voter in Ikutha or Nguni to their polling stream on election morning."
    body: "Physical voter pledge collection, verified 2G SMS connectivity, and trained polling day agents directly generate counted votes."
```

## 18.5 The presence audit: method

The first work of the engagement: ninety days of Dr. Mulu's own channels, measured, coded and read against the race. Everything after this section is built on what it finds.

#### The measurement set

```visual
kind: checklist
items:
  - label: "Audience"
    body: "Followers by city and country; by age band and sex; growth curve over 12 months"
    fields:
      - { label: "Why this one", text: "The decisive test. Follower geography checks the recognition thesis against his own asset." }
  - label: "Reach"
    body: "Daily reach, organic against paid; reach by city mapped to sub-county; reach per post; reach as a share of followers"
    fields:
      - { label: "Why this one", text: "Reach by city is the only routinely available proxy for ward-level penetration." }
  - label: "Engagement"
    body: "Reactions, comments and shares per post; engagement rate **on reach, not on followers**; shares per 1,000 reached; distinct commenting accounts, and the share of all comments from the top 50"
    fields:
      - { label: "Why this one", text: "Rate on reach is the honest denominator. Share rate is the persuasion proxy — a share puts his name inside a network he does not own." }
  - label: "Content"
    body: "Every post coded on four axes: pillar, language, format, and whether it carries a commitment, a date, a ward name or a call to action"
    fields:
      - { label: "Why this one", text: "Turns {{channel.fb.posts}} posts from an archive into a distribution. Without coding there is nothing to compare." }
  - label: "Video"
    text: "3-second and 30-second views, average watch time, completion rate"
    fields:
      - { label: "Why this one", text: "Decides whether long flagship video is the right commitment or the wrong one." }
  - label: "Cadence"
    text: "Posts per day, hour of day, day of week"
    fields:
      - { label: "Why this one", text: "Establishes what the team's current capacity actually is, before any brief assumes more of it." }
  - label: "Paid"
    body: "Meta Ad Library and Google Ads Transparency Centre, for Dr. Mulu and both nomination rivals"
    fields:
      - { label: "Why this one", text: "Public, needs no access from anyone, and is the only competitive advertising signal that exists." }
  - label: "Other platforms"
    body: "X: **@MakaliMulu**, about {{channel.x.followers}} followers in a September 2026 snapshot (Tier 3, a dated baseline). TikTok, Instagram, YouTube and any WhatsApp Channel or Business number: recorded in the Week 1 audit where they exist."
    fields:
      - { label: "Why this one", text: "Not estimated, per Annex A." }
```

#### The window

```lead
**Ninety days: 18 June to 16 September 2026.** It is the longest window Meta exports at post level without gaps.
```

**Ninety days: 18 June to 16 September 2026.** Two reasons, and neither of them is convenience.

1.  It is the longest window Meta exports at post level without gaps.
2.  It is long enough to show cadence and short enough to describe the team working today rather
    than a team that has changed since.

The follower-growth curve is pulled over twelve months instead, for seasonality. That series is
cheap and stable, and a ninety-day slice of it says nothing.

#### Why this comes first

```lead
What it has never been asked is the only question that matters in a countywide name-recognition contest: **how much of this reach lands where he is not yet known?**
```

Every other analysis in this document is about Kitui — the register, the census, the results, the
audit record. This one is about the only communications asset Dr. Mulu actually controls.

A verified Facebook presence, roughly {{channel.fb.followers}} followers and {{channel.fb.posts}} posts is not a standing start. It is
an operating channel with a record, and that record can be read. What it has never been asked is the
only question that matters in a countywide name-recognition contest: **how much of this reach lands
where he is not yet known?**

Section 6.2 establishes that **{{pool}} registered voters — {{pool.share}}% of the county register** — sit
where he has never held office. Section 4.3 establishes that in-county digital reach has a
ceiling of about {{reach.smartphone}} voters. Put together, those two figures make one measurement decisive:
the share of existing reach that lands inside the deficit pool. Nothing in the public record answers
it. The Week 1 audit does.

#### Method

```visual
kind: stepper
items:
  - label: "Confirm Page or profile"
    text: "Record the answer before anything else is touched."
  - label: "Export"
    text: "Meta Business Suite → Insights → 90 days: reach, engagement, followers, demographics, city breakdown, as CSV."
    body: "If it is a profile, substitute a manual tally of public counts and say so on every chart that results."
  - label: "Post-level export"
    text: "every post in the window."
  - label: "Code it twice"
    body: "Two coders score each post on the four axes independently; disagreements go to a third pass; the inter-coder agreement rate is reported alongside the findings. A coding exercise that does not report its own agreement rate is an opinion."
  - label: "Competitive baseline"
    body: "The same public post-level coding for Dr. Kasalu and Sen. Wambua, the two nomination rivals in Section 5.3. Public posts only."
  - label: "Ad libraries"
    text: "for all three."
  - label: "Overlay"
    body: "Reach-by-city onto the twelve decisive wards in Section 2.3 and the {{pool}}-voter deficit pool in Section 6.2."
  - label: "Aggregate only"
    text: "No named commenter lists, no export of individual profiles, no retention of personal data."
    body: "Counts and shares. The audit is scoped in the Section 19.2 memorandum before it begins, on the same terms as every other processing activity in this engagement."
```

#### What this section is not

```lead
It is not an appraisal of the people doing the work. This section reads the output, not the operators.
```

It is not an appraisal of the people doing the work. Section 17.5 sets out how the team is assessed
and upskilled, and that assessment is done with them in the room. This section reads the output, not
the operators — and the distinction is kept deliberately, because a measurement exercise that
doubles as a performance review will be resisted, and rightly.

#### Testing the hypothesis on existing records

```lead
The campaign tests the **"Recognition-Deficit Hypothesis"** on records that already exist: his own channel analytics, the IEBC's ward-level results, and what arrives unprompted on the line Firefly operates. Nothing is commissioned to test it.
```

```figure
id: research-and-tracker
```

Before committing the campaign's broadcast and caravan effort to Northern and Southern Kitui, the campaign tests the **"Recognition-Deficit Hypothesis"** (the proposition that Dr. Makali Mulu's primary electoral vulnerability outside Kitui Central is name recognition rather than unfavorable perception) on records that already exist: his own channel analytics, the IEBC's ward-level results, and what arrives unprompted on the line Firefly operates. Nothing is commissioned to test it.

```figure
id: research-modules
```
