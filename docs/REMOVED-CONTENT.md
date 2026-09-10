# REMOVED CONTENT — verbatim archive

Everything the content excision removed, preserved exactly as it stood at `4be4c43`.
Organised by section. Nothing here was hard-deleted: the full pre-excision tree is also on
branch `archive/pre-excision`.

This material is expected to be needed live in the meeting, and possibly in a contracting
annexe afterwards.

---

## 1-decision.md

### §9.2.1 The regulatory ceiling comes first *(Target 1 — deleted whole)*

```markdown
### 9.2.1 The regulatory ceiling comes first

On **7 August 2026** the IEBC gazetted the Election Campaign Financing
Regulations, 2026 (Gazette Notice No. 12251) together with binding contribution
and spending limits for the **10 August 2027** General Election.

Material provisions:
* Governor, Senator and Woman Representative candidates in a county share a
**single county-specific expenditure ceiling**.
* Ceilings were set using a formula weighting **population 70% and land area
30%**. Published county figures range from **Nairobi at KSh181.31 million**
down to **Lamu at KSh28.6 million**; others reported include Turkana
KSh142.07m, Marsabit KSh127.02m, Wajir KSh120.76m, Kiambu KSh110.96m, Nakuru
KSh107.10m and Garissa KSh106.01m.
* **Single-source contributions are capped at 20%** of the total permitted.
* The regulated expenditure period begins **at least six months before polling**
and ends **14 days after**.
* Exceeding the limit without reporting it is an offence carrying a fine of up
to **KSh2 million**, imprisonment up to **five years**, or both.
* Covered expenditure expressly includes **advertising, publicity material,
campaign personnel and communication** — that is, this engagement.

> **What the shared ceiling means, and the question it raises.** If the ceiling is genuinely
> shared across the Governor, Senator and Woman Representative races, then whose spending
> counts against Dr. Mulu's KSh97.56 million is a material question — and one the campaign
> cannot answer from the Gazette Notice alone. It most likely binds the three seats of a
> single party ticket at the general election rather than rival aspirants during a
> nomination, but that reading needs confirming with counsel before any tier below is
> committed to. **Every budget figure in this document assumes the whole ceiling is
> available to this campaign.** If it is not, all three tiers move.
>
> **Verified: the Kitui county-seat expenditure ceiling is KSh97.56 million**
> (IEBC, Gazette Notice No. 12251, 7 August 2026, First Schedule) — shared
> across the Governor, Senator and Woman Representative races. This figure has
> not been assumed or estimated. Kitui's population sits mid-range nationally
> while its land area (30,430 km², sixth largest) attracts the 30% area
> weighting. **Every budget tier below is expressed as a percentage of that
> ceiling as well as in absolute terms** — see Section 9.2.7 for the full
> operational compliance panel this ceiling drives.

```

### §9.2.2 Unit economics at verified market rates *(Target 2 — deleted whole)*

```markdown
### 9.2.2 Unit economics at verified market rates

These are current Kenyan market rates, not estimates. They make cost-per-contact
calculable rather than notional.

| Channel | Unit cost | Notes |
|---|---|---|
| **Bulk SMS** | **KSh0.25–1.06 per message**; KSh0.25–0.60 at volume; KSh0.25–0.30 at heaviest bundles | 160-character limit per billed message |
| **Sender ID registration** | **KSh4,500–14,100 one-off, per network** | Required for branded sender name |
| **Shared USSD code** | **~KSh34,800 per network** | Set-up in 5–7 working days |
| **Dedicated USSD code** | Higher; 2–4 weeks pending operator approval | `[Insert quoted figure at contracting]` |
| **USSD development** | **~KSh140,000** one-off | Menu build |
| **USSD hosting** | **~KSh5,000 per month** | Ongoing |
| **WhatsApp Business API** | **~KSh0.50+ per message** | Template-approved messages only |
| Meta / Google / TikTok ads | Market rate, auction-dependent | Benchmarked in Section 2.9.4 |

Providers active in this market include Celcom Africa, Africa's Talking,
Advanta Africa, Oramobile, AirTouch and Mobitech. **These are listed as market
options, not endorsements.** Final selection follows a procurement review at
contracting, and any vendor must demonstrate CA compliance, opt-out management,
DND filtering and per-send audit trails.

```

### §9.2.3 The cost-per-contact model *(Target 2 — deleted; consent argument relocated to §4.3.1)*

```markdown
### 9.2.3 The cost-per-contact model

Worked against Kitui's 2022 register of **532,758 voters** and a win threshold
of approximately **200,000 votes**.

**Single consented countywide SMS touch:**

| Reach basis | Volume | At KSh0.30 | At KSh0.60 |
|---|---|---|---|
| Full 2022 register (theoretical maximum) | 532,758 | KSh159,827 | KSh319,655 |
| Realistic consented list at Phase 3 (target 120,000) | 120,000 | KSh36,000 | KSh72,000 |
| Win-threshold universe (200,000) | 200,000 | KSh60,000 | KSh120,000 |

**Cost per contact: approximately KSh0.30–0.60 by SMS.** For comparison, a
digital impression is cheaper but reaches only the connected 13.6%, and a
physical canvass contact costs an order of magnitude more.

The critical constraint: **the campaign can only message consented numbers**
(Section 6.5). List building is therefore a KPI in its own right from Phase −1,
not an afterthought — consented contacts are a campaign asset that compounds,
and the only lawful route to this cost structure.

**Cost per persuaded voter.** Applying a conservative persuasion assumption of
`[Insert tested conversion rate — to be established by Phase 2 A/B testing; placeholder for modelling only]` across multi-touch sequences, the target
remains **≤ KSh200 per persuaded voter**, tracked monthly and reported against
actual spend rather than modelled spend.

```

### §9.2.4 Compliance instrumentation *(Target 1 — deleted whole)*

```markdown
### 9.2.4 Compliance instrumentation

**One question for the campaign's counsel before Phase −1 spend begins.** Section 3.3.3 puts
the lawful spending window as beginning "upon formal gazettement of candidates" (2027);
Section 9.2.1 puts it at "at least six months before polling". Phase −1 runs from now to the
nomination, which is outside both. Either that spending sits outside the regulated period —
in which case the ceiling does not constrain it and the tiers below are conservative — or it
is regulated, and the compliance instrumentation here should extend back to cover it.
Firefly's position is that the ledger below runs from day one either way, so the campaign is
covered on the stricter reading. **The legal reading itself is properly counsel's, and we
would want it confirmed before the first Phase −1 invoice.**

Because digital and SMS spend is now regulated expenditure:
* Every ad account, SMS dispatch and vendor invoice is logged to a single
reconciliation ledger from day one, tagged by date, channel, ward and
purpose.
* Monthly reconciliation against the county ceiling is a standing agenda item
(Section 7.2.5).
* The ledger is structured to produce an IEBC expenditure return directly,
without retrospective reconstruction.
* Contribution records capture source and value to evidence the 20% cap.
* **This is administrative discipline, not legal advice.** Reporting
obligations and their interpretation are for the campaign's counsel and
appointed campaign finance agent to confirm.

```

### §9.2.5 — the money passages only *(Target 1+2; the service levels themselves survive)*

```markdown
### 9.2.5 The three tiers

**How these tiers relate to the KSh 64.5 million plan.** Sections 3.3 and 6.6.1 set out a
KSh 64,500,000 operational budget for the whole campaign — field, media, tech and
contingency. The tiers below size **Firefly's digital and SMS function inside that**, not in
addition to it. The ad-spend percentages are of the KSh 97.56m statutory ceiling, which is
the binding legal constraint; the KSh 64.5m plan is the campaign's own spending intent
beneath it. Where the two disagree — the recommended tier's ad spend exceeds what 3.3.1
currently allocates to paid media — 3.3.1 is the figure to revise, and the target-vs-actual
table there says by how much.

**One definition per number.** Four different quantities are in play and were previously
quoted interchangeably:

| Term | Means | Where it is set |
|---|---|---|
| **Consented SMS contacts** | Phone numbers held with opt-in, reachable by SMS | 4.3.6: 120,000 by Phase 3 |
| **Contact universe** | Everyone reachable by any owned channel, SMS or otherwise | 9.2.6: ~60k / ~150k / ~250k by tier |
| **Pledged voters** | CRM records with phone, ward and polling station logged | 8.1.2 GE-01: 220,000 target |
| **Verified supporters** | Pledged voters confirmed by a second touch | 9.1.2: 200,000 target |

They are nested, not alternatives: consented contacts ⊂ contact universe, and verified
supporters ⊂ pledged voters. Cost-per-contact in 9.2.3 is priced on the first of these.

Percentages refer to the verified county ceiling of **KSh97.56 million**
(Section 9.2.1) and are stated in absolute terms against it. Ad spend is
regulated expenditure and sits inside that ceiling alongside transport, venues
and personnel — it is not additional to them.

```

Ad-spend lines removed from each level:

```markdown
* **Ad spend:** **KSh14.63m-19.51m** (15-20% of the KSh97.56m ceiling)     [Lean]
* **USSD:** shared code, all networks (~KSh34,800/network + KSh140,000
development + KSh5,000/month hosting)                                      [Standard]
* **Ad spend:** **KSh29.27m-39.02m** (30-40% of the KSh97.56m ceiling)     [Standard]
* **Ad spend:** **KSh43.90m-53.66m** (45-55% of the KSh97.56m ceiling), with
headroom preserved beneath the statutory cap                               [Premium]
* **Trade-offs:** approaches the statutory ceiling - requires disciplined
headroom management against other campaign expenditure, since the ceiling
covers the whole campaign, not the digital function alone                  [Premium]
```

### §9.2.6 — the recommendation paragraph, as it stood *(rewritten, not deleted)*

```markdown
**Recommendation: Tier 2 (Standard).** Tier 1 concentrates spend where Dr.
Mulu is already strong and leaves the recognition deficit untouched. Tier 3 is
defensible but presses against a statutory ceiling that must also accommodate
transport, venues and personnel across 30,430 square kilometres — and
transport is typically the largest single category of campaign expenditure.

```

### §9.2.7 Spending against the ceiling *(Target 1 — deleted whole)*

```markdown
### 9.2.7 Spending against the ceiling

The verified KSh97.56 million ceiling is not background reading — it is the
campaign's **binding budget constraint**, and every figure elsewhere in this
document sits underneath it. The panel below turns the Gazette Notice's
provisions into an operational checklist: the 20% single-source contribution
cap, the dedicated-account and authorised-person requirements, the KSh1
million audited-report threshold, the regulated expenditure window, and the
penalty exposure for getting any of it wrong.

---

```

### §9.3.3 Why a remote operation works *(Target 3 — framing deleted, contents salvaged)*

```markdown
### 9.3.3 Why a remote operation works

A remote digital operation is not a compromise. Digital campaigning does not
require a physical office in Kitui; it requires speed, data, creative
discipline and continuous availability. Firefly's role is:

- Strategy and message architecture
- Predictive modelling and analytics, within a governed compliance framework
- Content production and scheduling across three languages
- Paid media management and regulated-spend reconciliation
- SMS and USSD operations reaching the offline majority
- Online fundraising optimisation
- Reputation monitoring, crisis response and manipulated-media rebuttal
- Earned media and debate distribution

This allows the ground team to concentrate on direct voter contact, logistics
and physical mobilisation — while the two operations feed a single voter model
rather than running blind to each other (Section 4.2).

#### The Firefly proposition

Firefly is being proposed as the campaign's **outsourced digital function**, not as a single communications hire. The value is the operating system around the candidate: one accountable digital lead, a lean core, specialist surge capacity when the KPI or phase requires it, governed spend, multilingual production, low-connectivity distribution and a measurable reporting cadence.

Firefly is a **Kenya-based media and consulting company**. The proposal deliberately does not claim named clients or case studies; its proof is the specificity of the operating model, the governance architecture and the measurable deliverables set out in this document.

**One honest qualification.** Remote delivery works for everything above. It
does not replace the things it should not: the focus groups in Section 8.4
require facilitation in Kitui, the Kikamba producer must be a native speaker,
and the ward champion network is necessarily local. Those roles are budgeted as
local appointments, not absorbed into a remote retainer. A proposal claiming
that everything can be done from a laptop would be overselling, and this
document's entire proposition is that it does not oversell.

---

```

### §7.1 opener *(Target 3 — deleted)*

```markdown
Operating remotely allows for a dedicated digital war room, maintaining a
continuous, high-quality digital footprint without the logistical overhead of
being physically present on the campaign trail.
```

### §9.3.2 dependency 5 *(Target 1 — deleted)*

```markdown
5. **The verified expenditure ceiling** from the gazette schedule
```

### Clauses cut from surviving sentences

```markdown
§0.2  : 'a comprehensive, remotely managed digital campaign apparatus'
§0.3  : 'a remote digital war room executing structured red-team simulations'
§0.3  : constraint 2, 'The New Campaign Financing Framework' - see below
§7.1.2: 'All fundraising structured for compliance with the Election Campaign
         Financing Regulations, 2026 - including the 20% single-source
         contribution cap and full contribution records (Section 9.2.4).'
§7.1.2: 'Monthly spend allocation matrix ... - with every shilling logged
         against the IEBC expenditure return (Section 9.2.4).'
§9.1.1: 'reallocation of 40% of the digital ad budget'
§9.3.1: 'the compliance ledger reconciliation (Section 9.2.4),'
§9.3.1: 'A scheduled virtual briefing'
§9.3.2: dependency 4, 'Appointment of the compliance reviewer'
§9.3.2: dependency 8, 'Sign-off on the budget tier'
§9.3.4: 'We respectfully request a virtual meeting'
```

### §0.3 constraint 2 — The New Campaign Financing Framework *(Target 1 — deleted whole)*

```markdown
2. **The New Campaign Financing Framework:** **The regulatory environment underwent a critical transformation on 7 August 2026,** when the IEBC gazetted the Election Campaign Financing Regulations, 2026, establishing strict, reportable, and criminally sanctionable expenditure and contribution ceilings. Every digital ad spend and campaign allocation is now legally regulated and must be monitored with forensic accounting precision.
```

### Placeholders register — rows removed

```markdown
| **Dedicated USSD code quotation** | 9.2.2 | Operator, 2-4 weeks |
and 'tested conversion rate' (9.2.3) from the final row.
```


### 4a-publishing.md — §3.3 Paid media and campaign financing, entire (§3.3.1–3.3.4) *(Targets 1+2)*

```markdown
## 3.3 Paid media and campaign financing

Campaign expenditures in Kenyan gubernatorial elections are governed by strict statutory ceilings, disclosure requirements, and accounting rules enforced by the Independent Electoral and Boundaries Commission (IEBC) under the Election Offences Act, the Elections Act, and the Campaign Financing framework.

For Kitui County, the maximum statutory spending ceiling is **Ksh 97,560,000** (IEBC Gazette Notice No. 12251, published 7 August 2026). The campaign constructs a disciplined, audited budget allocated proportionally against the **channel reach realities established in Section 3.1**.

```
════════════════════════════════════════════════════════════════════════════════════
                  STATUTORY BUDGET ALLOCATION & CEILING (IEBC)
════════════════════════════════════════════════════════════════════════════════════

   STATUTORY CEILING: Ksh 97,560,000 (IEBC Gazette Notice 12251 / Aug 2026)
   PLANNED OPERATIONAL BUDGET: Ksh 64,500,000 (Prudent 66.1% Deployment)
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
   FIELD & GROUND               BROADCAST & OFFLINE          TECH, COMPLIANCE
   MOBILISATION (rows 3+6)      PAID MEDIA (rows 1,2,4,5)    & CONTINGENCY (row 7)
   Ksh 36,000,000 (55.8%)       Ksh 21,700,000 (33.6%)       Ksh 6,800,000 (10.5%)
 ┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
 │ • 400 Ward Captains  │     │ • Kikamba Radio Spots│     │ • Africa's Talking   │
 │ • 8 Sound PA Trucks  │     │ • 2G Bulk SMS (1.5M) │     │   USSD / SMS Gateway │
 │ • Boda Stage Rallies │     │ • Baraza Glossy Print│     │ • DPA Legal Audits   │
 │ • Polling Agent Pay  │     │ • Targeted Meta Ads  │     │ • Statutory Reserves │
 └──────────────────────┘     └──────────────────────┘     └──────────────────────┘
════════════════════════════════════════════════════════════════════════════════════
```

---

### 3.3.1 Where the paid budget goes, by reachable population

To maximize cost-per-contact efficiency, media expenditures are strictly indexed against the verified reachable voting population across Kitui's 8 sub-counties (532,758 registered voters):

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               CHANNEL ALLOCATION VS. REACHABLE POPULATION                                   │
├──────────────────────────┬───────────────────┬───────────────────┬────────────────┬─────────────────────────┤
│ Media / Channel Medium   │ Reachable Voters  │ Channel Reach %   │ Budget         │ Budget Allocation Share │
│                          │ (3.1 unless marked) │ of Electorate     │ Allocation     │ (% of Total Planned)    │
├──────────────────────────┼───────────────────┼───────────────────┼────────────────┼─────────────────────────┤
│ 1. Kikamba Vernacular    │ 420,000 Voters    │ 78.8%             │ Ksh 10,800,000 │ 16.7%                   │
│    Radio (Musyi, County) │                   │                   │                │                         │
├──────────────────────────┼───────────────────┼───────────────────┼────────────────┼─────────────────────────┤
│ 2. Direct 2G Bulk SMS    │ 320,000 Voters    │ 60.1%             │ Ksh 2,850,000  │ 4.4%                    │
│    & USSD Portal         │                   │                   │                │                         │
├──────────────────────────┼───────────────────┼───────────────────┼────────────────┼─────────────────────────┤
│ 3. Market Caravans, PA   │ 280,000 Voters    │ 52.6%             │ Ksh 14,500,000 │ 22.5%                   │
│    Trucks & Baraza Staging│                   │                   │                │                         │
├──────────────────────────┼───────────────────┼───────────────────┼────────────────┼─────────────────────────┤
│ 4. Printed Collateral &  │ 220,000 (est.)    │ 41.3%             │ Ksh 6,200,000  │ 9.6%                    │
│    Baraza Photobooks     │                   │                   │                │                         │
├──────────────────────────┼───────────────────┼───────────────────┼────────────────┼─────────────────────────┤
│ 5. Digital Video & Ads   │ ~72,000 voters    │ 13.6%             │ Ksh 1,850,000  │ 2.9%                    │
│    (Meta, TikTok, X)     │ (Youth/Diaspora)  │                   │                │                         │
├──────────────────────────┼───────────────────┼───────────────────┼────────────────┼─────────────────────────┤
│ 6. Groundgame Mobilizers │ 450,000+ (est.)   │ 84.5%             │ Ksh 21,500,000 │ 33.3%                   │
│    & Polling Day Agents  │ (Direct Ground)   │                   │                │                         │
├──────────────────────────┼───────────────────┼───────────────────┼────────────────┼─────────────────────────┤
│ 7. Tech Stack, Legal,    │ System Wide       │ N/A               │ Ksh 6,800,000  │ 10.5%                   │
│    DPA & Contingency     │                   │                   │                │                         │
├──────────────────────────┴───────────────────┴───────────────────┼────────────────┼─────────────────────────┤
│ TOTAL PLANNED CAMPAIGN EXPENDITURE                              │ Ksh 64,500,000 │ 100.0%                  │
│ STATUTORY EXPENDITURE CEILING (IEBC GAZETTE 12251)               │ Ksh 97,560,000 │ (Headroom: Ksh 33.06M)  │
└──────────────────────────────────────────────────────────────────┴────────────────┴─────────────────────────┘
```

**Two rows are estimates, not Section 3.1 figures.** Printed collateral and groundgame reach
are marked *(est.)* — Section 3.1 sizes six channels and neither is among them. Both need a
sourced basis before they carry a budget line of this size.

**Where this budget diverges from the 3.1.3 target.** Taking the five communications lines
(rows 1–5, KSh 36.2m) as the communications budget:

| Domain | 3.1.3 target | This budget | Gap |
|---|---:|---:|---:|
| Vernacular radio | 37% | **29.8%** | −7.2 pts |
| Direct 2G SMS & USSD | 20% | **7.9%** | −12.1 pts |
| Market caravans & collateral (rows 3 + 4) | 18% | **57.2%** | **+39.2 pts** |
| Digital & social | 18% | **5.1%** | −12.9 pts |
| Church & community | 7% | **0%** | −7 pts |

The caravan and collateral line carries roughly **KSh 14 million more** than the reach
argument in 3.1.3 supports, and the church network — sized at ~350,000 weekly attendees in
3.1.2 — carries nothing at all. This is a decision for campaign leadership, not a rounding
error: either the physical caravan programme is doing work the reach table does not capture
and 3.1.3 should be restated, or the allocation moves. **It is flagged here rather than
resolved, because the answer determines where a fifth of the communications budget goes.**

---

### 3.3.2 Rate cards we still have to obtain

To maintain strict accounting integrity, **unverified cost estimates are rejected**. Where published commercial rate cards do not exist in the empirical research repository, line items are formally designated as **"Required Procurement Research"**:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   RATE-CARD RESEARCH & PROCUREMENT STATUS                                   │
├────────────────────────────┬─────────────────────────────┬──────────────────────────────────────────────────┤
│ Procurement Item           │ Verified Rate-Card Status   │ Action & Required Procurement Research           │
├────────────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────┤
│ 1. Vernacular Radio Spots  │ **Verified Industry Bench** │ Standard prime-time rates (Ksh 8k–14k per 45s);  │
│    (Musyi FM / County FM)  │ (Royal Media; independent)  │ Required: Negotiate bulk multi-month package rate│
├────────────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────┤
│ 2. 2G Bulk SMS Gateway     │ **Verified Carrier Rate**   │ Safaricom/Airtel aggregated via Africa's Talking │
│    (Sender ID: DR_MAKALI)  │ (Africa's Talking API)      │ — see Section 9.2.2 for the rate card.           │
├────────────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────┤
│ 3. USSD Interactive Portal │ **Verified Carrier Rate**   │ Shared code, development and hosting per the     │
│    (*483*77#)              │ (Direct Telco SDP)          │ Section 9.2.2 rate card; session fee Ksh 0.15.   │
├────────────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────┤
│ 4. Outdoor Billboard       │ **Awaiting Procurement Res**│ Commercial rate cards for Kitui Town, Mwingi, and│
│    Structures (Static PVC) │                             │ Mutomo intersections *[Required Research]*.      │
├────────────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────┤
│ 5. Sound Truck & Mobile    │ **Awaiting Procurement Res**│ Formal lease quotations from Eastern Kenya audio │
│    PA Rig Leases (8 Trucks)│                             │ rig vendors across 8 sub-counties *[Required]*.   │
├────────────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────┤
│ 6. High-Volume Color Print │ **Awaiting Procurement Res**│ Volume discount quotations for 200,000 A5        │
│    (A5 Baraza Foldouts)    │                             │ glossy 4-page leaflets (Nairobi vs Kitui presses)│
└────────────────────────────┴─────────────────────────────┴──────────────────────────────────────────────────┘
```

---

### 3.3.3 The campaign financing rules we work inside

The campaign adheres to all six statutory financing mandates established under Kenyan electoral law:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             STATUTORY CAMPAIGN FINANCING COMPLIANCE PROTOCOLS                               │
├───────────────────────────────────┬─────────────────────────────────────────────────────────────────────────┤
│ Statutory Requirement             │ Operational Governance & Mandatory Compliance Protocol                  │
├───────────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ 1. County Spending Ceiling        │ • **Ksh 97,560,000** absolute statutory limit for Kitui County          │
│    (IEBC Gazette Notice 12251)    │ • Planned budget (Ksh 64.50M) operates with a 33.9% safety margin.      │
├───────────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ 2. 20% Single-Source Contribution │ • **Maximum single-source contribution:** Ksh 19,512,000 (20% of limit). │
│    Cap                            │ • System rejects any single donor contribution exceeding this threshold.│
│                                   │ • Strict tracking of individual, corporate, and harambee donor ledgers. │
├───────────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ 3. Dedicated Campaign Bank        │ • Mandatory opening of a designated **"Dr. Makali Mulu Campaign Trust"**│
│    Account Requirement            │   commercial bank account at a licensed tier-1 Kenyan bank.             │
│                                   │ • All donations, mobile money, and payments must flow through this acct.│
├───────────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ 4. Authorised Person & Agent      │ • Written notification to IEBC of the Campaign Expenditure Committee    │
│    Notification to IEBC           │   and signatory — see 6.6.1 for members and the 3-month deadline.       │
├───────────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ 5. Ksh 1,000,000 Audited Report   │ • Any expenditure line or single donor receipt equal to or exceeding    │
│    Disclosure Threshold           │   **Ksh 1,000,000** must be documented with a certified invoice/receipt │
│                                   │   and filed in the statutory audit register.                            │
├───────────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ 6. Statutory Expenditure Window   │ • Lawful spending window begins upon formal gazettement of candidates   │
│    & Final Submission             │   and closes 24 hours before polling day (2027 General Election).       │
│                                   │ • Final certified audit report submitted to IEBC within **90 days** post│
│                                   │   election declaration.                                                 │
└───────────────────────────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.3.4 Penalty exposure, and how we stay clear of it

Violations of campaign financing limits and accounting rules carry severe civil, financial, and criminal liabilities under Kenyan law:

1.  **Exceeding Spending Ceilings:** Disqualification of the candidate, fines up to **Ksh 2,000,000**, and imprisonment of the campaign treasurer for up to 5 years (Election Offences Act).
2.  **Failure to File Audited Returns:** Formal bar from contesting future elective office for a period of up to five years.
3.  **Accepting Prohibited Donations:** Forfeiture of foreign or anonymous funds exceeding statutory limits to the State, accompanied by mandatory statutory disclosures.

```
════════════════════════════════════════════════════════════════════════════════════
                          SECTION 3.3.4 STRATEGIC TAKEAWAY
════════════════════════════════════════════════════════════════════════════════════
 • Statutory Cap Compliance:    Planned budget of Ksh 64.5M operates safely within the
                                Ksh 97.56M IEBC ceiling (Gazette Notice 12251).
 • Population-Weighted Media:   78.8% of media budget goes to broadcast radio, bulk SMS,
                                and physical field caravans reflecting true ground reach.
 • Strict Accounting Gates:     Dedicated campaign account, 20% single-source cap 
                                (Ksh 19.51M), and certified audits for all Ksh 1M+ items.
 • Procurement Discipline:      Unverified cost items explicitly flagged for procurement
                                research rather than speculative estimation.
════════════════════════════════════════════════════════════════════════════════════
```
---
```

### 4a-publishing.md — §2.9.3 compliance-ledger bullet *(Target 1)*

```markdown
* **Every test logged to the compliance ledger** (Section 9.2.4)
```

### 2-evidence.md — §6.6 compliance-architecture panel, block 1 *(Target 1)*

```markdown
   1. CAMPAIGN FINANCING COMPLIANCE (IEBC Gazette No. 12251 & ECFA 2026)
   • Strict Ksh 97,560,000 Total Expenditure Ceiling (Utilization capped at Ksh 64.5M)
   • 20% Single-Source Donor Cap (Max Ksh 19,512,000 per entity)
   • Dedicated Campaign Trust Bank Account & Certified Signatory Notification
   • Mandatory Reporting on all Receipts/Expenditures ≥ Ksh 1,000,000
   • 90-Day Post-Election Audited Accounts Submission to IEBC
                                      │
                                      ▼
```

### 2-evidence.md — §6.6.1 Campaign financing obligations under the ECFA *(Target 1, deleted whole)*

```markdown
### 6.6.1 Campaign financing obligations under the ECFA

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           ELECTION CAMPAIGN FINANCING STATUTORY OBLIGATIONS                                 │
├──────────────────────────┬───────────────────────────────────────────┬──────────────────────────────────────┤
│ Statutory Requirement    │ Operational Rule & Legal Threshold        │ Verification & Compliance Protocol   │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 1. County Expenditure    │ • Total campaign spend must not exceed    │ • Campaign budget strictly capped    │
│    Ceiling               │   **Ksh 97,560,000** (IEBC Gazette        │   at Ksh 64,500,000 (66.1% limit),   │
│                          │   Notice No. 12251, 7 August 2026).       │   leaving Ksh 33.06M safety margin.  │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 2. Single-Source Donor   │ • No single individual or corporate donor │ • All donations > Ksh 500,000 undergo│
│    Contribution Cap      │   may contribute > **20% of the ceiling** │   source-of-funds verification by the│
│                          │   (**Max: Ksh 19,512,000**).              │   Compliance Officer before receipt. │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 3. Dedicated Campaign    │ • All campaign funds must flow through a  │ • Formal account opening at a Tier-1 │
│    Bank Account          │   single dedicated bank account titled    │   commercial bank; certified bank    │
│                          │   *"Dr. Makali Mulu Campaign Trust"*.     │   statements filed monthly.          │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 4. Campaign Expenditure  │ • Campaign Expenditure Committee must be  │ • Formal written notification of 3–5 │
│    Committee & Signatory │   notified to the IEBC at least 3 months  │   committee members and Authorized   │
│                          │   prior to the general election.          │   Signatory submitted to IEBC Chair. │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 5. Large Transaction     │ • Mandatory itemized disclosure of all    │ • Certified invoices, contracts, and │
│    Reporting Threshold   │   receipts and payments **≥ Ksh 1,000,000**│   receipts logged in real time.      │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 6. Post-Election Audited │ • Certified, audited campaign expenditure │ • External ICPAK-registered audit    │
│    Final Accounts        │   accounts must be submitted to the IEBC  │   firm commissioned to deliver final │
│                          │   within **90 days** post-election.       │   filing within 60 days of election. │
└──────────────────────────┴───────────────────────────────────────────┴──────────────────────────────────────┘
```

---
```

### 2-evidence.md — §3.1.3 reconciliation paragraph naming the KSh14m gap *(Target 2)*

```markdown
The table below is the **rebalancing target** — the direction of travel away from the
conventional pitch, argued from reach. It is not a formula the budget already satisfies:
Section 3.3.1 carries the actual shillings, and the two do not currently agree. That gap is
stated under 3.3.1 rather than smoothed over here, because closing it is a live decision
about where roughly KSh 14 million goes, not a presentation choice.
```

### 4b-ground.md — §4.3.2 SMS cost paragraph *(Target 2)*

```markdown
**Cost:** at KSh0.25–0.60 per message, a fortnightly touch to 120,000 consented
voters costs approximately **KSh30,000–72,000 per send** — see Section 9.2.3.
```

### 4b-ground.md — §4.3.3 USSD cost sentence *(Target 2; set-up timing retained)*

```markdown
**Cost:** shared code approximately **KSh34,800 per network**, development
approximately **KSh140,000**, hosting approximately **KSh5,000 per month**.
```

### 4b-ground.md — §4.3.6 cost-per-consented-contact KPI row *(Target 2)*

```markdown
| Cost per consented contact | ≤KSh0.60 | ≤KSh0.50 | ≤KSh0.40 | ≤KSh0.35 |
```

### 4c-defence.md — §5.1.4 holding row 6, IEBC spending-ceiling allegation *(Target 1)*

```markdown
| 6 | Allegation of exceeding the IEBC spending ceiling | Ledger reconciliation retrieval (Section 9.2.4) |
```

### 4d-technology.md — §6.3.1 cost lines, ten bullets *(Target 2; every component and vendor survives)*

```markdown
Sender ID/shortcode setup, dedicated USSD channel, per-message SMS traffic, managed cloud
database hosting, deployment/schema config, social publishing tier, social listening tier,
tracker software licence, tracker hosting, domain & edge CDN — all quoted in Ksh.
```

### 4d-technology.md — §6.3.2 procurement matrix, indicative-cost column *(Target 2)*

```markdown
Ksh 950k–1.3M · Ksh 350k–500k · Ksh 45k–70k/month · Ksh 10k–15k/month · Ksh 5k/month
```

### 4d-technology.md — §6.4.2 cost-per-persuaded-voter benchmark row *(Target 2)*

```markdown
| Cost per persuaded voter | Total spend ÷ estimated persuaded | $1–$5 | ≤ KSh200 |
```

### 4d-technology.md — §6.4.2 cost-per-consented-contact benchmark row *(Target 2)*

```markdown
| **Cost per consented contact** | Total channel spend ÷ consented contacts | — | ≤ KSh0.60 falling to KSh0.35 |
```

### 4e-team.md — §7.2.5 monthly review, ceiling-reconciliation output *(Target 1)*

```markdown
| **Monthly** | Performance & compliance review | ... | Analytics report; competitive brief; spend reconciliation against IEBC ceiling |
```

### 3-strategy.md — §8.5.6 Build and cost *(Target 2; the build itself survives)*

```markdown
Built on the USSD/SMS infrastructure already costed in Section 9.2.2 — shared
USSD code (~KSh34,800 per network), development (~KSh140,000), hosting
(~KSh5,000/month) — plus a lightweight public register on the campaign site.
**Marginal cost over the SMS/USSD layer is low; distinctiveness is high.**
```

### 5-delivery.md — §8.3.1 compliance-ledger task *(Target 1)*

```markdown
- Establish the compliance ledger (Section 9.2.4)
```

### 5-delivery.md — §8.1.2 cost-per-persuaded-voter scorecard row *(Target 2)*

```markdown
| Cost per persuaded voter | ≤ KSh200 |
```

### 5-delivery.md — §8.2.1 research architecture, estimated-cost-band column *(Target 2)*

```markdown
Ksh 1.2M – Ksh 1.6M (baseline poll) · Ksh 850k – Ksh 1.1M (focus groups) · Ksh 250k – Ksh 400k / month (SMS pulse)
```

### 5-delivery.md — §0.4 Why the operation is run remotely *(Target 3; decision protocol salvaged)*

```markdown
## 0.4 Why the operation is run remotely

Operating a decentralized digital command center is not an operational compromise; it is a high-yield strategic asset. Modern digital warfare is won through speed, analytical precision, and creative discipline rather than physical co-location. While ground teams execute face-to-face voter mobilization and barazas, Firefly maintains a highly secure, centralized digital command node. This operating model offers three decisive advantages:

1. **Strategic Resource Arbitrage & Cost Efficiency:** By eliminating the substantial administrative overhead, transport logistics, physical security costs, and local office footprints associated with a centralized physical headquarters, the campaign can redirect maximum budget directly into high-impact digital and SMS micro-targeted voter outreach.
2. **Uncompromised Information Security & Operational Resilience:** A decentralized node removes localized vulnerabilities. It insulates sensitive strategic planning, data assets, and coordination databases from local corporate espionage, physical wiretapping, device interception, and local political pressure, establishing an extremely secure operational buffer.
3. **Speed, Technical Specialization, and Agile Crisis Mobilization:** This model allows the instant deployment of specialized technical talent — spanning real-time monitoring, AI-assisted creative optimization, multi-touch attribution, and defensive cybersecurity — without geographical friction. Technical specialists operate in a highly focused environment, enabling rapid-response asset creation and crisis mitigation around the clock.

The strategic architecture detailed below is engineered for a singular objective: to position Dr. Makali Mulu as the mathematically undeniable candidate — first for the Wiper gubernatorial nomination, and subsequently for the governorship of Kitui County.
```

### 3-strategy.md — §6.5.2 regulatory-environment table, campaign-finance row *(Target 1)*

```markdown
| **Campaign finance** | Expenditure limits, contribution caps and disclosure obligations in force from 7 August 2026 | IEBC Gazette Notice No. 12251 |
```

### 3-strategy.md — §6.5.4 charter control map, compliance-ledger clause *(Target 1; the control is now named as the per-send audit trail, which survives)*

```markdown
the compliance ledger (clause 3)
```

### 4b-ground.md — §4.3.2 per-send audit trail, compliance-ledger destination *(Target 1; the audit trail itself is a data-protection commitment and stays)*

```markdown
* Per-send audit trail retained for the compliance ledger
```

### 5-delivery.md — §8.3.6 post-election expenditure return *(Target 1)*

```markdown
- Final IEBC expenditure return filed with the campaign finance agent
```
