```lead
Every figure in this proposal carries its source, its tier and its date, and where no source exists the gap is named rather than filled.
```

Every figure in this proposal carries its source, its tier and its date, and where no source exists the gap is named rather than filled. This annex sets out the provenance rules every figure is held to, the three source tiers it is graded against and the protocol for when two sources disagree, and then lists every figure with its source. It is referenced throughout and collected here so the method can be checked without interrupting the argument.

## A.1 Evidence standard: provenance and source tiers

### A.1.1 Every figure carries its provenance

So that no figure drifts between documents, every figure cited in memos, ad targeting budgets, field operations and briefings carries three things, its source, its tier and its date (the **three-part provenance rule**):

```figure
id: provenance-mandate
```

**The rule.** Any metric presented without all three is classed as **unverified draft data** and may not inform field allocations or spending decisions.

### A.1.2 The three source tiers

The campaign grades every source into one of three tiers:

```figure
id: tier-classification
```

```visual
kind: cards
preset: tier
title: "How each tier is used"
items:
  - title: "Tier 1"
    text: "(e.g., {{register.2022}} registered voters in 2022, 40 wards) is hardcoded into operational models and cannot be modified without gazetted IEBC addenda."
  - title: "Tier 2"
    text: "(e.g., the 2022 governor results as reported by The Star, the Nation and the Standard, pending the IEBC forms) is used with its source named, and where two published values disagree both are shown."
  - title: "Tier 3"
    text: "(e.g., informal reports of the method the Wiper Patriotic Front will use to select its Kitui nominee, or the {{register.2026}} registered voters reported for July 2026) is marked as single-source until validated by the issuing body's own documents: for the method, an NEC resolution or the party's nomination rules as filed; for the register, IEBC's own July 2026 figure."
```

#### The Kitui source pack (October 2026), and how each document is tiered

| Document | Publisher, date | Basis | Tier |
|---|---|---|---|
| County Gender Data Sheet, Kitui | County Government of Kitui with KNBS and UN Women, October 2025 | KDHS 2022, the 2019 Census, KNBS projections | Tier 1: an official compilation of official statistics |
| Kitui County Statistical Abstract 2015 | KNBS | Administrative data for 2013–14, KDHS 2014 | Tier 1, but over ten years old: a historical baseline only |
| Kitui County 2025 Long Rains Food and Nutrition Security Assessment | Multi-agency team led by NDMA; fieldwork July 2025 | Field transects, sector checklists, IPC analysis | Tier 1 |
| Delivering the Kitui Promise: Three-Year Scorecard (Aug 2022 – Aug 2025) | County Government of Kitui | The executive's own account | Tier 1 as a record of what the county claims; not evidence that the claims are true |

### A.1.3 When two sources disagree

When multiple sources report conflicting metrics (e.g., voter registration counts, vote totals, or demographic proportions), the analysis applies a **four-step protocol**:

```figure
id: conflict-protocol
```

**No guesswork.** The analysis never interpolates, smooths or invents numbers to fill gaps between conflicting datasets.

### A.1.4 The standard applied to our own measurement

```lead
The presence audit in Section 14.1 is held to the same rules as every figure in this document. Platform-reported metrics are **Tier 2**, and they are never presented as Tier 1 alongside IEBC or KNBS figures.
```

The presence audit in Section 14.1 is held to the same rules as every figure in this document.

```visual
kind: checklist
items:
  - label: "Provenance"
    body: "Every number carries its export date, its source system, and whether it came from a Page Insights export or a manual public tally. The two are not interchangeable and are never averaged."
  - label: "Tier"
    body: "Platform-reported metrics are **Tier 2**: they are the platform's own measurement of itself, they restate silently, and they are not audited. They are never presented as Tier 1 alongside IEBC or KNBS figures."
  - label: "Coding, and its agreement rate"
    text: "Post coding is done twice, independently, with disagreements resolved by a third pass."
    body: "**The inter-coder agreement rate is published with the findings.** A coding exercise that will not report its own agreement rate is an opinion wearing a table."
  - label: "Gaps"
    text: "A metric the export does not contain is reported as absent, not estimated."
    body: "Estimated engagement rates and inferred follower geographies are not used."
  - label: "Competitive figures"
    body: "are public-source only, gathered the same way for him and both nomination rivals, in the same window."
```

## A.2 Source table

<!-- source-table:start (generated by scripts/build-source-table.ts; do not edit) -->

Every figure in the store, 629 in all: 447 read off a named document, 114 modelled, 62 targets and 6 still needed. The needed figures are the open items listed in Section 7.3 and are not repeated here.

#### Sourced figures, by document

<!-- keep -->
| Document | Tier | As of | Figures read off it |
|---|---|---|---|
| CA/KNBS, Analytical Report on ICT, 2023/24 Kenya Housing Survey (national tables), per Firefly's audit | Tier 1 | 2023/24 | `ict.kenya.internet` {{ict.kenya.internet}}%; `ict.kenya.internet.rural` {{ict.kenya.internet.rural}}%; `ict.kenya.internet.urban` {{ict.kenya.internet.urban}}%; `ict.kenya.internet.15-24` {{ict.kenya.internet.15-24}}%; `ict.kenya.internet.25-34` {{ict.kenya.internet.25-34}}%; `ict.kenya.internet.35-44` {{ict.kenya.internet.35-44}}%; `ict.kenya.youth` {{ict.kenya.youth}}%; `ict.kenya.youth.rural` {{ict.kenya.youth.rural}}%; `ict.kenya.youth.urban` {{ict.kenya.youth.urban}}%; `ict.kenya.internet.higher-ed` {{ict.kenya.internet.higher-ed}}%; `ict.nairobi.youth` {{ict.nairobi.youth}}%; `ict.mombasa.youth` {{ict.mombasa.youth}}%; `ict.kenya.phone` {{ict.kenya.phone}}% |
| Communications Authority / KNBS, ICT Analytical Report on the 2023/24 Kenya Housing Survey | Tier 1 | 2023-24 | `ict.internet` {{ict.internet}}%; `ict.phone` {{ict.phone}}% |
| Communications Authority, Q3 FY2025/26 sector statistics | Tier 1 | 2026-03 | `ict.sim-penetration` {{ict.sim-penetration}}%; `ict.momo-penetration` {{ict.momo-penetration}}%; `ict.sims.national` {{ict.sims.national}}; `ict.broadband.national` {{ict.broadband.national}}; `ict.momo.national` {{ict.momo.national}}; `ict.agents` {{ict.agents}} |
| Communications Authority, sector statistics | Tier 1 | 2025-09 | `ict.agents.2025` {{ict.agents.2025}} |
| Controller of Budget, County Budget Implementation Review Report | Tier 1 | 2020-21, 2025-26 Q1 | `budget.pending-bills.2021` KSh {{budget.pending-bills.2021}}; `budget.absorption.q1` {{budget.absorption.q1}}% |
| County Government of Kitui, Delivering the Kitui Promise: Three-Year Scorecard (Aug 2022 – Aug 2025) | Tier 1 | 2025-08 | `scorecard.claimed` {{scorecard.claimed}}; `scorecard.itemised` {{scorecard.itemised}}; `scorecard.itemised.ksh` KSh {{scorecard.itemised.ksh}}; `scorecard.kitui-central.projects` {{scorecard.kitui-central.projects}}; `scorecard.kitui-central.ksh` KSh {{scorecard.kitui-central.ksh}}; `scorecard.mwingi-north.projects` {{scorecard.mwingi-north.projects}}; `scorecard.mwingi-north.ksh` KSh {{scorecard.mwingi-north.ksh}}; `scorecard.kitui-south.projects` {{scorecard.kitui-south.projects}}; `scorecard.kitui-south.ksh` KSh {{scorecard.kitui-south.ksh}}; `scorecard.mwingi-central.projects` {{scorecard.mwingi-central.projects}}; `scorecard.mwingi-central.ksh` KSh {{scorecard.mwingi-central.ksh}}; `scorecard.kitui-east.projects` {{scorecard.kitui-east.projects}}; `scorecard.kitui-east.ksh` KSh {{scorecard.kitui-east.ksh}}; `scorecard.kitui-rural.projects` {{scorecard.kitui-rural.projects}}; `scorecard.kitui-rural.ksh` KSh {{scorecard.kitui-rural.ksh}}; `scorecard.kitui-west.projects` {{scorecard.kitui-west.projects}}; `scorecard.kitui-west.ksh` KSh {{scorecard.kitui-west.ksh}}; `scorecard.mwingi-west.projects` {{scorecard.mwingi-west.projects}}; `scorecard.mwingi-west.ksh` KSh {{scorecard.mwingi-west.ksh}}; `projects.ngomeni.count` {{projects.ngomeni.count}}; `projects.ngomeni.ksh` KSh {{projects.ngomeni.ksh}}; `projects.kyuso.count` {{projects.kyuso.count}}; `projects.kyuso.ksh` KSh {{projects.kyuso.ksh}}; `projects.mumoni.count` {{projects.mumoni.count}}; `projects.mumoni.ksh` KSh {{projects.mumoni.ksh}}; `projects.tseikuru.count` {{projects.tseikuru.count}}; `projects.tseikuru.ksh` KSh {{projects.tseikuru.ksh}}; `projects.tharaka.count` {{projects.tharaka.count}}; `projects.tharaka.ksh` KSh {{projects.tharaka.ksh}}; `projects.kyome-thaana.count` {{projects.kyome-thaana.count}}; `projects.kyome-thaana.ksh` KSh {{projects.kyome-thaana.ksh}}; `projects.nguutani.count` {{projects.nguutani.count}}; `projects.nguutani.ksh` KSh {{projects.nguutani.ksh}}; `projects.migwani.count` {{projects.migwani.count}}; `projects.migwani.ksh` KSh {{projects.migwani.ksh}}; `projects.kiomo-kyethani.count` {{projects.kiomo-kyethani.count}}; `projects.kiomo-kyethani.ksh` KSh {{projects.kiomo-kyethani.ksh}}; `projects.central.count` {{projects.central.count}}; `projects.central.ksh` KSh {{projects.central.ksh}}; `projects.kivou.count` {{projects.kivou.count}}; `projects.kivou.ksh` KSh {{projects.kivou.ksh}}; `projects.nguni.count` {{projects.nguni.count}}; `projects.nguni.ksh` KSh {{projects.nguni.ksh}}; `projects.nuu.count` {{projects.nuu.count}}; `projects.nuu.ksh` KSh {{projects.nuu.ksh}}; `projects.mui.count` {{projects.mui.count}}; `projects.mui.ksh` KSh {{projects.mui.ksh}}; `projects.waita.count` {{projects.waita.count}}; `projects.waita.ksh` KSh {{projects.waita.ksh}}; `projects.mutonguni.count` {{projects.mutonguni.count}}; `projects.mutonguni.ksh` KSh {{projects.mutonguni.ksh}}; `projects.kauwi.count` {{projects.kauwi.count}}; `projects.kauwi.ksh` KSh {{projects.kauwi.ksh}}; `projects.matinyani.count` {{projects.matinyani.count}}; `projects.matinyani.ksh` KSh {{projects.matinyani.ksh}}; `projects.kwa-mutonga-kithumula.count` {{projects.kwa-mutonga-kithumula.count}}; `projects.kwa-mutonga-kithumula.ksh` KSh {{projects.kwa-mutonga-kithumula.ksh}}; `projects.kisasi.count` {{projects.kisasi.count}}; `projects.kisasi.ksh` KSh {{projects.kisasi.ksh}}; `projects.mbitini.count` {{projects.mbitini.count}}; `projects.mbitini.ksh` KSh {{projects.mbitini.ksh}}; `projects.kwa-vonza-yatta.count` {{projects.kwa-vonza-yatta.count}}; `projects.kwa-vonza-yatta.ksh` KSh {{projects.kwa-vonza-yatta.ksh}}; `projects.kanyangi.count` {{projects.kanyangi.count}}; `projects.kanyangi.ksh` KSh {{projects.kanyangi.ksh}}; `projects.miambani.count` {{projects.miambani.count}}; `projects.miambani.ksh` KSh {{projects.miambani.ksh}}; `projects.township.count` {{projects.township.count}}; `projects.township.ksh` KSh {{projects.township.ksh}}; `projects.kyangwithya-west.count` {{projects.kyangwithya-west.count}}; `projects.kyangwithya-west.ksh` KSh {{projects.kyangwithya-west.ksh}}; `projects.mulango.count` {{projects.mulango.count}}; `projects.mulango.ksh` KSh {{projects.mulango.ksh}}; `projects.kyangwithya-east.count` {{projects.kyangwithya-east.count}}; `projects.kyangwithya-east.ksh` KSh {{projects.kyangwithya-east.ksh}}; `projects.zombe-mwitika.count` {{projects.zombe-mwitika.count}}; `projects.zombe-mwitika.ksh` KSh {{projects.zombe-mwitika.ksh}}; `projects.nzambani.count` {{projects.nzambani.count}}; `projects.nzambani.ksh` KSh {{projects.nzambani.ksh}}; `projects.chuluni.count` {{projects.chuluni.count}}; `projects.chuluni.ksh` KSh {{projects.chuluni.ksh}}; `projects.voo-kyamatu.count` {{projects.voo-kyamatu.count}}; `projects.voo-kyamatu.ksh` KSh {{projects.voo-kyamatu.ksh}}; `projects.endau-malalani.count` {{projects.endau-malalani.count}}; `projects.endau-malalani.ksh` KSh {{projects.endau-malalani.ksh}}; `projects.mutito-kaliku.count` {{projects.mutito-kaliku.count}}; `projects.mutito-kaliku.ksh` KSh {{projects.mutito-kaliku.ksh}}; `projects.ikanga-kyatune.count` {{projects.ikanga-kyatune.count}}; `projects.ikanga-kyatune.ksh` KSh {{projects.ikanga-kyatune.ksh}}; `projects.mutomo.count` {{projects.mutomo.count}}; `projects.mutomo.ksh` KSh {{projects.mutomo.ksh}}; `projects.mutha.count` {{projects.mutha.count}}; `projects.mutha.ksh` KSh {{projects.mutha.ksh}}; `projects.ikutha.count` {{projects.ikutha.count}}; `projects.ikutha.ksh` KSh {{projects.ikutha.ksh}}; `projects.kanziko.count` {{projects.kanziko.count}}; `projects.kanziko.ksh` KSh {{projects.kanziko.ksh}}; `projects.athi.count` {{projects.athi.count}}; `projects.athi.ksh` KSh {{projects.athi.ksh}}; `projects.multi-ward.count` {{projects.multi-ward.count}}; `projects.multi-ward.ksh` KSh {{projects.multi-ward.ksh}}; `projects.conflict.count` {{projects.conflict.count}}; `projects.conflict.ksh` KSh {{projects.conflict.ksh}}; `projects.constituency.count` {{projects.constituency.count}}; `projects.constituency.ksh` KSh {{projects.constituency.ksh}}; `projects.county.count` {{projects.county.count}}; `projects.county.ksh` KSh {{projects.county.ksh}}; `scorecard.countywide.ksh` KSh {{scorecard.countywide.ksh}}; `scorecard.mwingi-west.water.ksh` KSh {{scorecard.mwingi-west.water.ksh}}; `scorecard.kitui-central.health.ksh` KSh {{scorecard.kitui-central.health.ksh}}; `scorecard.health.attributed.ksh` KSh {{scorecard.health.attributed.ksh}}; `scorecard.vaccinated` {{scorecard.vaccinated}}; `scorecard.imr.from` {{scorecard.imr.from}}; `scorecard.imr.to` {{scorecard.imr.to}}; `scorecard.roads.graded` {{scorecard.roads.graded}}; `scorecard.roads.row.km` {{scorecard.roads.row.km}}; `scorecard.roads.row.ksh` KSh {{scorecard.roads.row.ksh}}; `scorecard.boreholes.drilled` {{scorecard.boreholes.drilled}}; `scorecard.boreholes.equipped` {{scorecard.boreholes.equipped}}; `scorecard.health.beneficiaries` {{scorecard.health.beneficiaries}}; `scorecard.kangu.ksh` KSh {{scorecard.kangu.ksh}}; `scorecard.kangu.households` {{scorecard.kangu.households}}; `scorecard.boda.sheds` {{scorecard.boda.sheds}}; `scorecard.boda.sheds.itemised` {{scorecard.boda.sheds.itemised}}; `scorecard.police.stations` {{scorecard.police.stations}}; `scorecard.police.complete` {{scorecard.police.complete}} |
| County Government of Kitui, KNBS and UN Women, County Gender Data Sheet: Kitui (October 2025), from KDHS 2022 and the 2019 Census | Tier 1 | 2022, 2025, 2030 | `ict.phone.adult.men` {{ict.phone.adult.men}}%; `ict.phone.adult.women` {{ict.phone.adult.women}}%; `ict.kenya.phone.adult.men` {{ict.kenya.phone.adult.men}}%; `ict.kenya.phone.adult.women` {{ict.kenya.phone.adult.women}}%; `ict.internet.1549.men` {{ict.internet.1549.men}}%; `ict.internet.1549.women` {{ict.internet.1549.women}}%; `ict.kenya.internet.1549.men` {{ict.kenya.internet.1549.men}}%; `ict.kenya.internet.1549.women` {{ict.kenya.internet.1549.women}}%; `register.women.share` {{register.women.share}}%; `women.nopaidwork` {{women.nopaidwork}}%; `women.nopaidwork.kenya` {{women.nopaidwork.kenya}}%; `men.nopaidwork` {{men.nopaidwork}}%; `women.unpaidwork` {{women.unpaidwork}}%; `men.unpaidwork` {{men.unpaidwork}}%; `women.unpaidwork.kenya` {{women.unpaidwork.kenya}}%; `men.unpaidwork.kenya` {{men.unpaidwork.kenya}}%; `women.purchases` {{women.purchases}}%; `women.purchases.kenya` {{women.purchases.kenya}}%; `women.cash.alone` {{women.cash.alone}}%; `women.cash.joint` {{women.cash.joint}}%; `women.cash.husband` {{women.cash.husband}}%; `water.women.collect` {{water.women.collect}}%; `water.women.collect.kenya` {{water.women.collect.kenya}}%; `water.30min` {{water.30min}}%; `water.30min.kenya` {{water.30min.kenya}}%; `water.over30` {{water.over30}}%; `water.over30.kenya` {{water.over30.kenya}}%; `health.access.problem` {{health.access.problem}}%; `health.access.problem.kenya` {{health.access.problem.kenya}}%; `health.facility-births` {{health.facility-births}}%; `health.facility-births.kenya` {{health.facility-births.kenya}}%; `health.skilled-birth` {{health.skilled-birth}}%; `health.imr` {{health.imr}}; `health.u5mr` {{health.u5mr}}; `health.imr.kenya` {{health.imr.kenya}}; `health.u5mr.kenya` {{health.u5mr.kenya}}; `edu.none.men` {{edu.none.men}}%; `edu.none.women` {{edu.none.women}}%; `edu.secondary.girls` {{edu.secondary.girls}}%; `edu.secondary.boys` {{edu.secondary.boys}}%; `edu.literacy.men` {{edu.literacy.men}}%; `edu.literacy.women` {{edu.literacy.women}}%; `population.2025` {{population.2025}}; `population.2030` {{population.2030}}; `population.15-24.2025` {{population.15-24.2025}}; `disability.men` {{disability.men}}%; `disability.women` {{disability.women}}%; `fuel.clean.2022` {{fuel.clean.2022}}%; `fuel.clean.2022.kenya` {{fuel.clean.2022.kenya}}% |
| Court of Appeal, Malombe v Ngilu [2018] KECA 460 | Tier 1 | Not stated | `result.2017.gov.ngilu` {{result.2017.gov.ngilu}}; `result.2017.gov.musila` {{result.2017.gov.musila}}; `result.2017.gov.malombe` {{result.2017.gov.malombe}} |
| IEBC 2022 polling station register | Tier 1 | Not stated | `register.polling-stations` {{register.polling-stations}} |
| IEBC certified result, Kitui governor 2022 (Form 37C), per Firefly's Public Data & Evidence Audit (24 Sep 2026) | Tier 1 | 2022-08 | `result.2022.gov.malombe` {{result.2022.gov.malombe}}; `result.2022.gov.musila` {{result.2022.gov.musila}}; `result.2022.gov.valid` {{result.2022.gov.valid}}; `turnout.2022` {{turnout.2022}}% |
| IEBC declaration, Kitui Central MP 2022, as gazetted (via The Star), per Firefly's Public Data & Evidence Audit (24 Sep 2026) | Tier 1 | 2022-08 | `result.2022.mp.mulu` {{result.2022.mp.mulu}}; `result.2022.mp.musambi` {{result.2022.mp.musambi}} |
| IEBC, Enhanced Continuous Voter Registration county annex (July 2026) | Tier 1 | 2026-04-28 | `register.2026.ecvr-drive` {{register.2026.ecvr-drive}} |
| IEBC, Registered Voters per County Assembly Ward (2022) | Tier 1 | Not stated | `con.mwingi-north` {{con.mwingi-north}}; `ward.ngomeni` {{ward.ngomeni}}; `ward.kyuso` {{ward.kyuso}}; `ward.mumoni` {{ward.mumoni}}; `ward.tseikuru` {{ward.tseikuru}}; `ward.tharaka` {{ward.tharaka}}; `con.mwingi-west` {{con.mwingi-west}}; `ward.kyome-thaana` {{ward.kyome-thaana}}; `ward.nguutani` {{ward.nguutani}}; `ward.migwani` {{ward.migwani}}; `ward.kiomo-kyethani` {{ward.kiomo-kyethani}}; `con.mwingi-central` {{con.mwingi-central}}; `ward.central` {{ward.central}}; `ward.kivou` {{ward.kivou}}; `ward.nguni` {{ward.nguni}}; `ward.nuu` {{ward.nuu}}; `ward.mui` {{ward.mui}}; `ward.waita` {{ward.waita}}; `con.kitui-west` {{con.kitui-west}}; `ward.mutonguni` {{ward.mutonguni}}; `ward.kauwi` {{ward.kauwi}}; `ward.matinyani` {{ward.matinyani}}; `ward.kwa-mutonga-kithumula` {{ward.kwa-mutonga-kithumula}}; `con.kitui-rural` {{con.kitui-rural}}; `ward.kisasi` {{ward.kisasi}}; `ward.mbitini` {{ward.mbitini}}; `ward.kwa-vonza-yatta` {{ward.kwa-vonza-yatta}}; `ward.kanyangi` {{ward.kanyangi}}; `con.kitui-central` {{con.kitui-central}}; `ward.miambani` {{ward.miambani}}; `ward.township` {{ward.township}}; `ward.kyangwithya-west` {{ward.kyangwithya-west}}; `ward.mulango` {{ward.mulango}}; `ward.kyangwithya-east` {{ward.kyangwithya-east}}; `con.kitui-east` {{con.kitui-east}}; `ward.zombe-mwitika` {{ward.zombe-mwitika}}; `ward.nzambani` {{ward.nzambani}}; `ward.chuluni` {{ward.chuluni}}; `ward.voo-kyamatu` {{ward.voo-kyamatu}}; `ward.endau-malalani` {{ward.endau-malalani}}; `ward.mutito-kaliku` {{ward.mutito-kaliku}}; `con.kitui-south` {{con.kitui-south}}; `ward.ikanga-kyatune` {{ward.ikanga-kyatune}}; `ward.mutomo` {{ward.mutomo}}; `ward.mutha` {{ward.mutha}}; `ward.ikutha` {{ward.ikutha}}; `ward.kanziko` {{ward.kanziko}}; `ward.athi` {{ward.athi}}; `register.2022` {{register.2022}}; `register.2022.prisons` {{register.2022.prisons}}; `register.2022.with-prisons` {{register.2022.with-prisons}} |
| KEPHIS 2024 tests, as cited in NDMA and Kitui County Steering Group, Kitui County 2025 Long Rains Food and Nutrition Security Assessment (July 2025) | Tier 1 | 2024 | `aflatoxin.maize` {{aflatoxin.maize}}%; `aflatoxin.groundnut` {{aflatoxin.groundnut}}% |
| Kitui Central NG-CDF bursary record | Tier 1 | Not stated | `record.bursary.recipients` {{record.bursary.recipients}}; `record.bursary.ksh` KSh {{record.bursary.ksh}} |
| Kitui Central NG-CDF, FY2026/27 allocation, per Firefly's audit | Tier 1 | 2026 | `ngcdf.allocation.2026` KSh {{ngcdf.allocation.2026}} |
| Kitui County Fiscal Strategy Paper FY2026/27, as approved by the County Assembly | Tier 1 | Not stated | `budget.equitable` KSh {{budget.equitable}}; `budget.grants` KSh {{budget.grants}}; `budget.equitable.share` {{budget.equitable.share}}%; `budget.grants.share` {{budget.grants.share}}% |
| KNBS 2019 Census Volume III, Table 2.3 (population by age, sex and sub-county), via rKenyaCensus | Tier 1 | 2019 | `census.age.0-14.share` {{census.age.0-14.share}}%; `census.age.15-34.share` {{census.age.15-34.share}}%; `census.age.35-59.share` {{census.age.35-59.share}}%; `census.age.60-plus.share` {{census.age.60-plus.share}}% |
| KNBS 2019 Census Volume IV, Table 2.19 (main lighting fuel), via rKenyaCensus | Tier 1 | 2019 | `electricity.mains.2019` {{electricity.mains.2019}}%; `electricity.national` {{electricity.national}}% |
| KNBS, 2019 Census Analytical Report on Migration, Volume VIII, per Firefly's audit | Tier 1 | 2019 | `migration.net` {{migration.net}} |
| KNBS, 2019 Census, agriculture report, per Firefly's audit | Tier 1 | 2019 | `livestock.households` {{livestock.households}} |
| KNBS, 2019 Census; IEBC | Tier 1 | Not stated | `census.subcounties` {{census.subcounties}} |
| KNBS, 2019 Kenya Population and Housing Census | Tier 1 | Not stated | `census.population` {{census.population}}; `census.male` {{census.male}}; `census.female` {{census.female}}; `census.households` {{census.households}}; `census.area` {{census.area}}; `census.intersex` {{census.intersex}}; `census.household-size` {{census.household-size}}; `census.density` {{census.density}}; `sub.kitui-central.population` {{sub.kitui-central.population}}; `sub.kitui-central.density` {{sub.kitui-central.density}}; `sub.kitui-central.households` {{sub.kitui-central.households}}; `sub.kitui-west.population` {{sub.kitui-west.population}}; `sub.kitui-west.density` {{sub.kitui-west.density}}; `sub.kitui-west.households` {{sub.kitui-west.households}}; `sub.katulani.population` {{sub.katulani.population}}; `sub.katulani.density` {{sub.katulani.density}}; `sub.katulani.households` {{sub.katulani.households}}; `sub.mwingi-central.population` {{sub.mwingi-central.population}}; `sub.mwingi-central.density` {{sub.mwingi-central.density}}; `sub.mwingi-central.households` {{sub.mwingi-central.households}}; `sub.kyuso.population` {{sub.kyuso.population}}; `sub.kyuso.density` {{sub.kyuso.density}}; `sub.kyuso.households` {{sub.kyuso.households}}; `sub.mumoni.population` {{sub.mumoni.population}}; `sub.mumoni.density` {{sub.mumoni.density}}; `sub.mumoni.households` {{sub.mumoni.households}}; `sub.tseikuru.population` {{sub.tseikuru.population}}; `sub.tseikuru.density` {{sub.tseikuru.density}}; `sub.tseikuru.households` {{sub.tseikuru.households}}; `sub.mutomo.population` {{sub.mutomo.population}}; `sub.mutomo.density` {{sub.mutomo.density}}; `sub.mutomo.households` {{sub.mutomo.households}}; `sub.ikutha.population` {{sub.ikutha.population}}; `sub.ikutha.density` {{sub.ikutha.density}}; `sub.ikutha.households` {{sub.ikutha.households}}; `sub.mwingi-east.population` {{sub.mwingi-east.population}}; `sub.mwingi-east.density` {{sub.mwingi-east.density}}; `sub.mwingi-east.households` {{sub.mwingi-east.households}}; `sub.mutitu.population` {{sub.mutitu.population}}; `sub.mutitu.density` {{sub.mutitu.density}}; `sub.mutitu.households` {{sub.mutitu.households}}; `sub.migwani.population` {{sub.migwani.population}}; `sub.migwani.density` {{sub.migwani.density}}; `sub.migwani.households` {{sub.migwani.households}} |
| KNBS, 2019 Kenya Population and Housing Census, per Firefly's audit | Tier 1 | 2019 | `fuel.unclean` {{fuel.unclean}}%; `fuel.firewood` {{fuel.firewood}}% |
| KNBS, KDHS 2022 (via the Advancing Nutrition policy brief), per Firefly's audit | Tier 1 | 2022 | `health.stunting` {{health.stunting}}% |
| KNBS, Kenya Demographic and Health Survey 2022 | Tier 1 | 2022 | `water.basic.kdhs` {{water.basic.kdhs}}%; `water.basic.nairobi` {{water.basic.nairobi}}% |
| KNBS, Kenya Demographic and Health Survey 2022, Kitui factsheet, per Firefly's audit | Tier 1 | 2022 | `health.insurance` {{health.insurance}}%; `health.insurance.nhif` {{health.insurance.nhif}}% |
| KNBS, Kenya Poverty Report (2021) | Tier 1 | Not stated | `poverty.2021` {{poverty.2021}}%; `poverty.2021.people` {{poverty.2021.people}} |
| KNBS, Kitui County Statistical Abstract 2015 | Tier 1 | 2013/14, 2014/15 | `ngcdf.kitui-central.2013` KSh {{ngcdf.kitui-central.2013}}; `ngcdf.kitui-central.2014` KSh {{ngcdf.kitui-central.2014}} |
| KNBS, via the NDMA Long Rains Food Security Assessment | Tier 1 | Not stated | `water.surface` {{water.surface}} |
| Livestock data validation 2023, as cited in the NDMA Kitui 2025 Long Rains Food and Nutrition Security Assessment (July 2025), p. 96 | Tier 1 | Not stated | `livestock.cattle` {{livestock.cattle}}; `livestock.goats` {{livestock.goats}}; `livestock.poultry` {{livestock.poultry}}; `livestock.donkeys` {{livestock.donkeys}} |
| NDMA and Kitui County Steering Group, Kitui County 2025 Long Rains Food and Nutrition Security Assessment (July 2025) | Tier 1 | 2024-06, 2025-04, 2025-06, 2025-07 | `water.points.working` {{water.points.working}}; `water.points.total` {{water.points.total}}; `water.points.working.kitui-central` {{water.points.working.kitui-central}}%; `water.points.working.kitui-south` {{water.points.working.kitui-south}}%; `water.schools.unsafe` {{water.schools.unsafe}}; `health.measles.ngomeni` {{health.measles.ngomeni}}; `health.typhoid.2025` {{health.typhoid.2025}}; `health.typhoid.2024` {{health.typhoid.2024}}; `health.dysentery.rise` {{health.dysentery.rise}}%; `schools.meals` {{schools.meals}}; `schools.meals.of` {{schools.meals.of}}; `schools.damaged` {{schools.damaged}}; `schools.damaged.learners` {{schools.damaged.learners}}; `livelihood.mixed` {{livelihood.mixed}}%; `livelihood.marginal` {{livelihood.marginal}}%; `livelihood.employment` {{livelihood.employment}}%; `wealth.verypoor` {{wealth.verypoor}}%; `wealth.poor` {{wealth.poor}}%; `wealth.middle` {{wealth.middle}}%; `wealth.better` {{wealth.better}}%; `greengrams.cash.marginal` {{greengrams.cash.marginal}}%; `greengrams.cash.mixed` {{greengrams.cash.mixed}}%; `greengrams.lr2025` {{greengrams.lr2025}}; `greengrams.lr2025.vs-average` {{greengrams.lr2025.vs-average}}%; `maize.lr2025.vs-average` {{maize.lr2025.vs-average}}%; `price.maize` KSh {{price.maize}}; `price.maize.average` KSh {{price.maize.average}}; `price.goat` KSh {{price.goat}}; `price.goat.average` KSh {{price.goat.average}}; `fodder.held` {{fodder.held}}; `fodder.needed` {{fodder.needed}}; `goats.ccpp.morbidity` {{goats.ccpp.morbidity}}%; `goats.ccpp.mortality` {{goats.ccpp.mortality}}%; `goats.ppr.morbidity` {{goats.ppr.morbidity}}%; `goats.ppr.mortality` {{goats.ppr.mortality}}%; `border.killed` {{border.killed}} |
| NDMA National Drought Early Warning Bulletin, February 2026 | Tier 1 | 2026-02 | `water.trek.2026-02` {{water.trek.2026-02}} |
| Office of the Auditor-General, Kitui County FY2023/24 audit report | Tier 1 | Not stated | `audit.cash` KSh {{audit.cash}}; `audit.uncollected` KSh {{audit.uncollected}}; `audit.ifmis` KSh {{audit.ifmis}}; `audit.transfers` KSh {{audit.transfers}} |
| SMART nutrition assessment 2023, as cited in NDMA and Kitui County Steering Group, Kitui County 2025 Long Rains Food and Nutrition Security Assessment (July 2025) | Tier 1 | 2023 | `health.diet.diversity` {{health.diet.diversity}}%; `health.diet.acceptable` {{health.diet.acceptable}}% |
| CA/KARF audience report, Lower Eastern (Kitui, Machakos, Makueni), per Firefly's audit | Tier 2 | Not stated | `radio.musyi` {{radio.musyi}}%; `radio.citizen` {{radio.citizen}}%; `radio.athiani` {{radio.athiani}}%; `radio.mbaitu` {{radio.mbaitu}}%; `radio.county` {{radio.county}}%; `radio.mwatu` {{radio.mwatu}}% |
| Communications Authority, Q3 FY2025/26 sector statistics | Tier 2 | Not stated | `ict.smartphone-share` {{ict.smartphone-share}}%; `ict.smartphones.national` {{ict.smartphones.national}} |
| Countdown 2030, Kitui health workforce, per Firefly Public Data & Evidence Audit (24 Sep 2026) | Tier 2 | Not stated | `health.density.doctors` {{health.density.doctors}}; `health.density.clinical` {{health.density.clinical}}; `health.density.lab` {{health.density.lab}}; `health.density.nurses` {{health.density.nurses}}; `health.density.core` {{health.density.core}} |
| County Government of Kitui, Delivering the Kitui Promise: Three-Year Scorecard (Aug 2022 – Aug 2025) | Tier 2 | Not stated | `farm.employs` {{farm.employs}}%; `farm.rural-households` {{farm.rural-households}}% |
| Equal Politics aggregation of IEBC 2022 presidential results (Tier 1 record: IEBC Forms 34B and 34C) | Tier 2 | 2022-08 | `result.2022.pres.odinga` {{result.2022.pres.odinga}}; `result.2022.pres.odinga.share` {{result.2022.pres.odinga.share}}%; `result.2022.pres.ruto` {{result.2022.pres.ruto}}; `result.2022.pres.ruto.share` {{result.2022.pres.ruto.share}}%; `result.2022.pres.wajackoyah` {{result.2022.pres.wajackoyah}}; `result.2022.pres.mwaure` {{result.2022.pres.mwaure}}; `result.2022.pres.rejected` {{result.2022.pres.rejected}}; `result.2022.pres.turnout` {{result.2022.pres.turnout}}% |
| Kitui County CECM for Agriculture, statement | Tier 2 | Not stated | `food.reserve-households` {{food.reserve-households}} |
| Kitui County Government and NTSA, August 2026, per Firefly Public Data & Evidence Audit (24 Sep 2026) | Tier 2 | 2026-08 | `boda.licensed.2026` {{boda.licensed.2026}} |
| Kitui County health planning baseline (CIDP), per Firefly's audit | Tier 2 | Not stated | `health.stunting.cidp` {{health.stunting.cidp}}% |
| Kitui County PCRA, derived from the 2019 Census, per Firefly's audit | Tier 2 | 2019 | `livestock.households.pcra` {{livestock.households.pcra}} |
| KNBS 2019 Census Volume II (rural and urban distribution), via the CRA Kitui County Fact Sheet, 3rd edition, and citypopulation.de | Tier 2 | Not stated | `census.rural` {{census.rural}}; `census.urban` {{census.urban}}; `census.rural.share` {{census.rural.share}}%; `census.urban.share` {{census.urban.share}}% |
| KNBS 2019 Census, via Stats Kenya county profile (statskenya.co.ke) | Tier 2 | 2009, 2019 | `census.median-age.statskenya` {{census.median-age.statskenya}}; `electricity.2019` {{electricity.2019}}%; `electricity.2009` {{electricity.2009}}%; `water.safe.2019` {{water.safe.2019}}%; `water.piped.2019` {{water.piped.2019}}% |
| KNBS Kenya Poverty Report, via national reporting | Tier 2 | Not stated | `food.share` {{food.share}}% |
| KNBS, 2019 Kenya Population and Housing Census | Tier 2 | 2019 | `ict.internet.2019` {{ict.internet.2019}}%; `ict.phone.2019` {{ict.phone.2019}}%; `ict.internet.2019.people` {{ict.internet.2019.people}}; `ict.phone.2019.people` {{ict.phone.2019.people}} |
| Media reporting of the IEBC 2022 declaration (The Star; Nation; Standard) | Tier 2 | Not stated | `result.2022.gov.mueke` {{result.2022.gov.mueke}}; `result.2022.senate.wambua` {{result.2022.senate.wambua}}; `result.2022.womanrep.kasalu` {{result.2022.womanrep.kasalu}} |
| NDMA and Kitui County Steering Group, Kitui County 2025 Long Rains Food and Nutrition Security Assessment (July 2025) | Tier 2 | Not stated | `poverty.ndma.2019` {{poverty.ndma.2019}}%; `poverty.ndma.county` {{poverty.ndma.county}}% |
| The Star, August 2022 | Tier 2 | Not stated | `result.2022.gov.musila.media` {{result.2022.gov.musila.media}} |
| A 2026 report, per Firefly Public Data & Evidence Audit (24 Sep 2026) | Tier 3 | 2026 | `boda.riders` {{boda.riders}}; `boda.unlicensed` {{boda.unlicensed}} |
| Catholic Diocese of Kitui, per Firefly Public Data & Evidence Audit (24 Sep 2026) | Tier 3 | Not stated | `church.catholic` {{church.catholic}} |
| County Assembly revision of the CFSP | Tier 3 | Not stated | `budget.osr.revised` KSh {{budget.osr.revised}} |
| Farm-gate price as quoted in the message matrix; source pending | Tier 3 | Not stated | `price.ndengu.farmgate` KSh {{price.ndengu.farmgate}} |
| Kitui Agricultural Show 2023, per Firefly Public Data & Evidence Audit (24 Sep 2026) | Tier 3 | Not stated | `show.2023` {{show.2023}} |
| Kitui Central Project Inventory 2013–2026, awaiting line items | Tier 3 | Not stated | `record.cdf.boreholes` {{record.cdf.boreholes}}; `record.cdf.school-water` {{record.cdf.school-water}} |
| Kitui County Fiscal Strategy Paper FY2026/27, as approved by the County Assembly | Tier 3 | Not stated | `budget.total` KSh {{budget.total}}; `budget.osr` KSh {{budget.osr}}; `budget.osr.share` {{budget.osr.share}}% |
| KNBS 2019 Census and ASTGS, as cited; page reference pending | Tier 3 | Not stated | `policy.ndengu-output` {{policy.ndengu-output}} |
| OAG County Executive audits FY2021/22 and FY2022/23, as reported; reports not yet retrieved | Tier 3 | Not stated | `audit.pending.contested` KSh {{audit.pending.contested}} |
| Public Facebook page, approximate count as displayed | Tier 3 | Not stated | `channel.fb.followers` {{channel.fb.followers}} |
| Public Facebook page, as displayed | Tier 3 | Not stated | `channel.fb.posts` {{channel.fb.posts}} |
| Public X profile @MakaliMulu, indexed snapshot, per Firefly Public Data & Evidence Audit (24 Sep 2026) | Tier 3 | 2026-09 | `channel.x.followers` {{channel.x.followers}} |
| Stats Kenya, reporting KNBS for 2022 | Tier 3 | 2022 | `poverty.2022.statskenya` {{poverty.2022.statskenya}}% |
| Venas News, registered voters by county, July 2026; unconfirmed until IEBC's own July figure is in hand | Tier 3 | 2026-07 | `register.2026` {{register.2026}} |

#### Modelled figures, and how each is computed

<!-- keep -->
| Figure | Value | Tier of its inputs | How it is computed |
|---|---|---|---|
| `register.2026.growth` | {{register.2026.growth}} | Tier 3 | 605,703 less 532,758: growth since 2022. |
| `register.2026.continuous` | {{register.2026.continuous}} | Tier 3 | Growth since 2022 less the ECVR drive: continuous registration outside the drive. |
| `register.2022.ward-mean` | {{register.2022.ward-mean}} | Tier 1 | 532,758 across 40 wards. |
| `bloc.mwingi` | {{bloc.mwingi}} | Tier 1 | Mwingi North + West + Central, 2022 register. |
| `pool` | {{pool}} | Tier 1 | The four constituencies where he has never held office: Mwingi North, West, Central and Kitui South. |
| `pool.share` | {{pool.share}}% | Tier 1 | Pool / 2022 register. |
| `pool.wards` | {{pool.wards}} | Tier 1 | Wards in the pool. |
| `bloc.mwingi.share` | {{bloc.mwingi.share}}% | Tier 1 | Mwingi bloc / 2022 register. |
| `con.kitui-central.share` | {{con.kitui-central.share}}% | Tier 1 | Kitui Central / 2022 register. |
| `con.kitui-south.share` | {{con.kitui-south.share}}% | Tier 1 | Kitui South / 2022 register. |
| `east-south` | {{east-south}} | Tier 1 | Kitui East + Kitui South: the two constituencies without Wiper MPs. |
| `east-south.share` | {{east-south.share}}% | Tier 1 | Kitui East + South / 2022 register. |
| `big4` | {{big4}} | Tier 1 | Kitui Central, Kitui South, Mwingi Central and Mwingi North. |
| `big4.share` | {{big4.share}}% | Tier 1 | Big 4 / 2022 register. |
| `pareto.top12` | {{pareto.top12}} | Tier 1 | The twelve largest wards, 2022 register. |
| `pareto.top12.share` | {{pareto.top12.share}}% | Tier 1 | Top 12 / 2022 register. |
| `pareto.top20` | {{pareto.top20}} | Tier 1 | The twenty largest wards. |
| `pareto.top20.share` | {{pareto.top20.share}}% | Tier 1 | Top 20 / 2022 register. |
| `pareto.bottom10` | {{pareto.bottom10}} | Tier 1 | The ten smallest wards. |
| `pareto.bottom10.share` | {{pareto.bottom10.share}}% | Tier 1 | Bottom 10 / 2022 register. |
| `pareto.top12.in-pool` | {{pareto.top12.in-pool}} | Tier 1 | Of the twelve largest wards, those in the pool (consistency fix 4). |
| `pareto.top12.in-pool.voters` | {{pareto.top12.in-pool.voters}} | Tier 1 | Registered voters in those wards. |
| `pareto.top12.in-pool.share` | {{pareto.top12.in-pool.share}}% | Tier 1 | Their share of the register. |
| `mwingi-north.top3` | {{mwingi-north.top3}} | Tier 1 | Kyuso + Tseikuru + Mumoni. |
| `result.2022.gov.musila.share` | {{result.2022.gov.musila.share}}% | Tier 1 | 117,606 / 328,760 valid votes: matches the certified share. |
| `benchmark.share-2022` | {{benchmark.share-2022}}% | Tier 1 | 198,004 / 532,758: the 2022 winner's share of the register. |
| `benchmark.2026-equivalent` | {{benchmark.2026-equivalent}} | Tier 1 | The 2022 winner's share of the register applied to the July 2026 register. A ratio carried forward, not a forecast. |
| `benchmark.2026-equivalent.rounded` | {{benchmark.2026-equivalent.rounded}} | Tier 1 | The 2026 equivalent, rounded to the nearest 5,000 for prose. |
| `benchmark.2026-equivalent.share` | {{benchmark.2026-equivalent.share}}% | Tier 1 | The share carried forward: 198,004 / 532,758. |
| `turnout.rate` | {{turnout.rate}}% | Tier 1 | The turnout rate as a multiplier, for the working shown in Section 2.5. |
| `ballots.2022` | {{ballots.2022}} | Tier 1 | 2022 register × the turnout rate (the certified 2022 rate, carried forward). |
| `ballots.2026` | {{ballots.2026}} | Tier 1 | July 2026 register × the 2022 turnout rate, carried forward. |
| `benchmark.share-of-ballots.2026` | {{benchmark.share-of-ballots.2026}}% | Tier 1 | 200,000 / ballots at the 2022 turnout rate on the July 2026 register. |
| `benchmark.share-of-ballots` | {{benchmark.share-of-ballots}}% | Tier 1 | 200,000 / ballots at the 2022 turnout rate. |
| `benchmark.share-of-register` | {{benchmark.share-of-register}}% | Tier 1 | 200,000 / 2022 register. |
| `gap.wambua-to-benchmark-2022` | {{gap.wambua-to-benchmark-2022}} | Tier 1 | 198,004 less 191,317. |
| `path.a.registered` | {{path.a.registered}} | Tier 1 | Mwingi Central + North + West, 2022 register. |
| `path.a.share` | {{path.a.share}}% | Tier 1 | Mwingi Central + North + West / 2022 register. |
| `path.a.ballots` | {{path.a.ballots}} | Tier 1 | Mwingi Central + North + West × the 2022 turnout rate, carried forward. |
| `path.a.margin` | {{path.a.margin}} | Tier 1 | Ballots at the constant less 200,000, even if every ballot went to him. |
| `path.b.registered` | {{path.b.registered}} | Tier 1 | Kitui Central + South + West, 2022 register. |
| `path.b.share` | {{path.b.share}}% | Tier 1 | Kitui Central + South + West / 2022 register. |
| `path.b.ballots` | {{path.b.ballots}} | Tier 1 | Kitui Central + South + West × the 2022 turnout rate, carried forward. |
| `path.b.margin` | {{path.b.margin}} | Tier 1 | Ballots at the constant less 200,000, even if every ballot went to him. |
| `path.c.registered` | {{path.c.registered}} | Tier 1 | The twelve largest wards, 2022 register. |
| `path.c.share` | {{path.c.share}}% | Tier 1 | The twelve largest wards / 2022 register. |
| `path.c.ballots` | {{path.c.ballots}} | Tier 1 | The twelve largest wards × the 2022 turnout rate, carried forward. |
| `path.c.margin` | {{path.c.margin}} | Tier 1 | Ballots at the constant less 200,000, even if every ballot went to him. |
| `path.d.registered` | {{path.d.registered}} | Tier 1 | Kitui Central + West + Rural (the home belt), 2022 register. |
| `path.d.share` | {{path.d.share}}% | Tier 1 | Kitui Central + West + Rural (the home belt) / 2022 register. |
| `path.d.ballots` | {{path.d.ballots}} | Tier 1 | Kitui Central + West + Rural (the home belt) × the 2022 turnout rate, carried forward. |
| `path.d.margin` | {{path.d.margin}} | Tier 1 | Ballots at the constant less 200,000, even if every ballot went to him. |
| `path.a.at80` | {{path.a.at80}} | Tier 1 | 80% of the route's ballots. |
| `path.a.at80.short` | {{path.a.at80.short}} | Tier 1 | 200,000 less 80% of the route's ballots. |
| `path.d.at80` | {{path.d.at80}} | Tier 1 | 80% of the route's ballots. |
| `path.d.at80.short` | {{path.d.at80.short}} | Tier 1 | 200,000 less 80% of the route's ballots. |
| `census.female.share` | {{census.female.share}}% | Tier 1 | Women / residents. |
| `census.median-age` | {{census.median-age}} | Tier 1 | Median age in years, interpolated within the single year of age where the cumulative count of residents passes half: 545,111 are under 18 and 24,682 are aged 18, of 1,136,144 with age stated. |
| `zone.anchor.population` | {{zone.anchor.population}} | Tier 1 | Sum of the zone's sub-counties: kitui-central, kitui-west, katulani. |
| `zone.anchor.households` | {{zone.anchor.households}} | Tier 1 | Sum of the zone's sub-counties. |
| `zone.anchor.share` | {{zone.anchor.share}}% | Tier 1 | Zone population / county. |
| `zone.mwingi.population` | {{zone.mwingi.population}} | Tier 1 | Sum of the zone's sub-counties: mwingi-central, kyuso, mumoni, tseikuru. |
| `zone.mwingi.households` | {{zone.mwingi.households}} | Tier 1 | Sum of the zone's sub-counties. |
| `zone.mwingi.share` | {{zone.mwingi.share}}% | Tier 1 | Zone population / county. |
| `zone.arid.population` | {{zone.arid.population}} | Tier 1 | Sum of the zone's sub-counties: mutomo, ikutha, mwingi-east, mutitu, migwani. |
| `zone.arid.households` | {{zone.arid.households}} | Tier 1 | Sum of the zone's sub-counties. |
| `zone.arid.share` | {{zone.arid.share}}% | Tier 1 | Zone population / county. |
| `zones.population` | {{zones.population}} | Tier 1 | The three zones together. |
| `zones.share` | {{zones.share}}% | Tier 1 | The three zones / county. |
| `zones.excluded` | {{zones.excluded}} | Tier 1 | Residents in no zone, rounded to the nearest 10,000. |
| `zones.excluded.share` | {{zones.excluded.share}}% | Tier 1 | Residents in no zone / county: 100 less the three zones' share. |
| `zone.anchor.register.share` | {{zone.anchor.register.share}}% | Tier 1 | Kitui Central + Kitui West / 2022 register. |
| `zone.mwingi.register.share` | {{zone.mwingi.register.share}}% | Tier 1 | Mwingi North + West + Central / 2022 register. |
| `zone.arid.register.share` | {{zone.arid.register.share}}% | Tier 1 | Kitui South + Kitui East / 2022 register. |
| `con.kitui-rural.share` | {{con.kitui-rural.share}}% | Tier 1 | Kitui Rural / 2022 register. |
| `ict.offline` | {{ict.offline}}% | Tier 1 | 100% less 26.2% internet use. |
| `reach.smartphone` | {{reach.smartphone}} | Tier 1 | 26.2% internet use applied to the July 2026 register. |
| `reach.sms-only` | {{reach.sms-only}} | Tier 1 | 44.1% phone ownership less 26.2% internet use, on the July 2026 register. |
| `reach.nophone` | {{reach.nophone}} | Tier 1 | No phone: the remainder of the July 2026 register. |
| `reach.offline` | {{reach.offline}} | Tier 1 | The July 2026 register less those reachable online. |
| `reach.smartphone.short` | {{reach.smartphone.short}} | Tier 1 | 200,000 less the digital ceiling. |
| `reach.smartphone.of-benchmark` | {{reach.smartphone.of-benchmark}}% | Tier 1 | The digital ceiling / 200,000. |
| `budget.rounding` | KSh {{budget.rounding}} | Tier 1 | Published total less the three parts: rounding in the source, shown as its own segment. |
| `segment.rural.voters` | {{segment.rural.voters}} | Tier 1 | 95.2% rural share applied to the 2022 register, rounded. The register is not published by rural/urban split. |
| `segment.urban.voters` | {{segment.urban.voters}} | Tier 1 | 4.8% urban share applied to the 2022 register, rounded. |
| `segment.youth.voters` | {{segment.youth.voters}} | Tier 1 | The 2019 census age distribution applied to the 2022 register; the register is not published by age. |
| `segment.youth.share` | {{segment.youth.share}}% | Tier 1 | Youth voters / the 2022 register. |
| `con.mwingi-north.share` | {{con.mwingi-north.share}}% | Tier 1 | Mwingi North / 2022 register. |
| `policy.ward-fund.total` | KSh {{policy.ward-fund.total}} | Tier 1 | KSh 100m per ward × 40 wards, a year. |
| `policy.ward-fund.share` | {{policy.ward-fund.share}}% | Tier 1 | The ward fund / the KSh 13.79bn envelope. |
| `policy.ndengu.bridge` | KSh {{policy.ndengu.bridge}} | Tier 1 | (floor price − farm-gate price) × output in kg: the county bridges the gap. |
| `policy.ndengu.purchase` | KSh {{policy.ndengu.purchase}} | Tier 1 | Floor price × output in kg: the county buys the crop outright. |
| `policy.flagships.bridge` | KSh {{policy.flagships.bridge}} | Tier 1 | Ward fund + the ndengu bridge. |
| `policy.flagships.share` | {{policy.flagships.share}}% | Tier 1 | Both commitments, bridge case / the envelope. |
| `ict.phone.adult` | {{ict.phone.adult}}% | Tier 1 | Adult phone ownership weighted by the register's sex split: 52% × 73.9% + 48% × 77.7%. |
| `reach.phone.adult` | {{reach.phone.adult}} | Tier 3 | The adult phone-ownership rate applied to the July 2026 register, rounded to the nearest 1,000. The adult basis: voters are adults. |
| `reach.nophone.adult` | {{reach.nophone.adult}} | Tier 3 | The July 2026 register less adult phone owners, rounded to the nearest 1,000. |
| `reach.phone.resident` | {{reach.phone.resident}} | Tier 1 | Phone owners on the resident basis: reachable online plus reachable by SMS only. |
| `reach.phone.ratio` | {{reach.phone.ratio}} | Tier 1 | Adult-basis phone owners / resident-basis phone owners. |
| `water.points.down.share` | {{water.points.down.share}}% | Tier 1 | Water sources not operational / all water sources assessed. |
| `health.typhoid.rise` | {{health.typhoid.rise}}% | Tier 1 | Rise in typhoid cases, January–June 2025 on the year before. |
| `scorecard.unitemised` | {{scorecard.unitemised}} | Tier 1 | Projects claimed less projects itemised. |
| `scorecard.kitui-central.per-voter` | KSh {{scorecard.kitui-central.per-voter}} | Tier 1 | Itemised spend / the constituency's 2022 register. Covers the 401 itemised projects only. |
| `scorecard.mwingi-north.per-voter` | KSh {{scorecard.mwingi-north.per-voter}} | Tier 1 | Itemised spend / the constituency's 2022 register. Covers the 401 itemised projects only. |
| `scorecard.kitui-south.per-voter` | KSh {{scorecard.kitui-south.per-voter}} | Tier 1 | Itemised spend / the constituency's 2022 register. Covers the 401 itemised projects only. |
| `scorecard.mwingi-central.per-voter` | KSh {{scorecard.mwingi-central.per-voter}} | Tier 1 | Itemised spend / the constituency's 2022 register. Covers the 401 itemised projects only. |
| `scorecard.kitui-east.per-voter` | KSh {{scorecard.kitui-east.per-voter}} | Tier 1 | Itemised spend / the constituency's 2022 register. Covers the 401 itemised projects only. |
| `scorecard.kitui-rural.per-voter` | KSh {{scorecard.kitui-rural.per-voter}} | Tier 1 | Itemised spend / the constituency's 2022 register. Covers the 401 itemised projects only. |
| `scorecard.kitui-west.per-voter` | KSh {{scorecard.kitui-west.per-voter}} | Tier 1 | Itemised spend / the constituency's 2022 register. Covers the 401 itemised projects only. |
| `scorecard.mwingi-west.per-voter` | KSh {{scorecard.mwingi-west.per-voter}} | Tier 1 | Itemised spend / the constituency's 2022 register. Covers the 401 itemised projects only. |
| `scorecard.attributed.ksh` | KSh {{scorecard.attributed.ksh}} | Tier 1 | Itemised spend attributed to a constituency. |
| `scorecard.pool.share` | {{scorecard.pool.share}}% | Tier 1 | The pool's four constituencies' share of constituency-attributed itemised spend. |
| `scorecard.vaccinated.itemised` | {{scorecard.vaccinated.itemised}} | Tier 1 | The itemised vaccination rows: 216,441 + 10,050 animals. |
| `scorecard.roads.row.per-km` | KSh {{scorecard.roads.row.per-km}} | Tier 1 | The itemised road row's cost / its length. |

#### Targets, and whose each is

<!-- keep -->
| Target | Value | Whose, and what it commits to |
|---|---|---|
| `benchmark` | {{benchmark}} | The single working benchmark: the 2022 winning tally, 198,004, rounded. Stated once in Section 2.5 and reused everywhere (consistency fix 3). |
| `turnout.constant` | {{turnout.constant}}% | The turnout rate used in every calculation: the certified 2022 county rate carried forward to 2027. An assumption about 2027, not a measurement of it; the scenario model brackets it at 55–72%. |
| `policy.ndengu-floor` | KSh {{policy.ndengu-floor}} | A proposed floor price for ndengu, per kilogram: a campaign policy proposal, not yet sized. |
| `target.sms.phase-1` | {{target.sms.phase-1}} | Consented SMS contacts by the end of Phase −1. |
| `target.sms.phase-1b` | {{target.sms.phase-1b}} | Consented SMS contacts, Phase 1. |
| `target.sms.phase-2` | {{target.sms.phase-2}} | Consented SMS contacts, Phase 2. |
| `target.sms` | {{target.sms}} | Consented SMS/USSD contacts by Phase 3 (objective 1.3.3). |
| `target.ussd.phase-1` | {{target.ussd.phase-1}} | USSD unique sessions, Phase 1. |
| `target.ussd.phase-2` | {{target.ussd.phase-2}} | USSD unique sessions, Phase 2. |
| `target.ussd.phase-3` | {{target.ussd.phase-3}} | USSD unique sessions, Phase 3. |
| `target.tracker.phase-1` | {{target.tracker.phase-1}} | Tracker reports, Phase 1. |
| `target.tracker.phase-2` | {{target.tracker.phase-2}} | Tracker reports, Phase 2. |
| `target.tracker.phase-3` | {{target.tracker.phase-3}} | Tracker reports, Phase 3. |
| `target.reach.phase-1` | {{target.reach.phase-1}} | Combined social reach, Phase 1: an operational diagnostic, not a performance indicator. |
| `target.reach.phase-2` | {{target.reach.phase-2}} | Cumulative reach, Phase 2: diagnostic. |
| `target.reach.phase-3` | {{target.reach.phase-3}} | Cumulative reach, Phase 3: diagnostic. |
| `target.followers.phase-1` | {{target.followers.phase-1}} | Engaged followers, Phase 1: diagnostic. |
| `target.followers.phase-2` | {{target.followers.phase-2}} | Engaged followers, Phase 2: diagnostic. |
| `target.followers.phase-3` | {{target.followers.phase-3}} | Engaged followers, Phase 3: diagnostic. |
| `target.subscribers.phase-1` | {{target.subscribers.phase-1}} | Email/SMS subscribers, Phase 1. |
| `target.subscribers.phase-2` | {{target.subscribers.phase-2}} | Email/SMS subscribers, Phase 2. |
| `target.volunteers.phase-1` | {{target.volunteers.phase-1}} | Digital volunteer sign-ups, Phase 1 (campaign-owned programme). |
| `target.volunteers.phase-2` | {{target.volunteers.phase-2}} | Digital volunteer sign-ups, Phase 2 (campaign-owned programme). |
| `target.pledges` | {{target.pledges}} | Digital pledges to vote, Phase 3. |
| `target.supporters` | {{target.supporters}} | Verified supporters mapped to polling stations by 31 May 2027 (objective 1.3.4). |
| `target.pledged-voters` | {{target.pledged-voters}} | Pledged voters in the CRM (GE-01). |
| `target.contact-universe.lean` | {{target.contact-universe.lean}} | Realistic Phase 3 contact universe at Level 1. |
| `target.contact-universe.standard` | {{target.contact-universe.standard}} | Realistic Phase 3 contact universe at Level 2. |
| `target.contact-universe.premium` | {{target.contact-universe.premium}} | Realistic Phase 3 contact universe at Level 3. |
| `target.content.first` | {{target.content.first}} | Pieces of content approved and scheduled in Phase 0. |
| `target.captains` | {{target.captains}} | Ward captains, 10 per ward: a campaign-owned recommendation. |
| `target.captains.pool` | {{target.captains.pool}} | Of the 400 captains, those recommended for the pool's wards: campaign-owned. |
| `target.ambassadors` | {{target.ambassadors}} | M-Pesa 'Economic Ambassadors': a campaign-owned recommendation. |
| `target.stage-champions` | {{target.stage-champions}} | Boda-boda Stage Champions, 30 per ward: a campaign-owned recommendation. |
| `target.volunteer-points` | {{target.volunteer-points}} | Average points per volunteer per month: the campaign-owned volunteer programme's target. |
| `target.whatsapp-groups` | {{target.whatsapp-groups}} | Community WhatsApp groups monitored by the 40 constituency monitoring assistants. |
| `effort.p-1.anchor` | {{effort.p-1.anchor}}% | Share of communications effort to the anchor zone. |
| `effort.p-1.mwingi` | {{effort.p-1.mwingi}}% | Share of communications effort to the Mwingi block. |
| `effort.p-1.arid` | {{effort.p-1.arid}}% | Share of communications effort to the arid and resource belt. |
| `effort.p-1.rotating` | {{effort.p-1.rotating}}% | Share of communications effort rotating across wards as testing. |
| `effort.p12.anchor` | {{effort.p12.anchor}}% | Share of communications effort to the anchor zone. |
| `effort.p12.mwingi` | {{effort.p12.mwingi}}% | Share of communications effort to the Mwingi block. |
| `effort.p12.arid` | {{effort.p12.arid}}% | Share of communications effort to the arid and resource belt. |
| `effort.p12.rotating` | {{effort.p12.rotating}}% | Share of communications effort rotating across wards as testing. |
| `effort.p3.anchor` | {{effort.p3.anchor}}% | Share of communications effort to the anchor zone. |
| `effort.p3.mwingi` | {{effort.p3.mwingi}}% | Share of communications effort to the Mwingi block. |
| `effort.p3.arid` | {{effort.p3.arid}}% | Share of communications effort to the arid and resource belt. |
| `effort.p3.rotating` | {{effort.p3.rotating}}% | Share of communications effort rotating across wards as testing. |
| `channel.radio.conventional` | {{channel.radio.conventional}}% | Vernacular radio (Musyi, County, Wikwatyo): share of effort in the conventional pitch, as Firefly characterises it. |
| `channel.radio.rebalanced` | {{channel.radio.rebalanced}}% | Vernacular radio (Musyi, County, Wikwatyo): share of effort, rebalanced. |
| `channel.sms.conventional` | {{channel.sms.conventional}}% | Direct SMS and the USSD tree: share of effort in the conventional pitch, as Firefly characterises it. |
| `channel.sms.rebalanced` | {{channel.sms.rebalanced}}% | Direct SMS and the USSD tree: share of effort, rebalanced. |
| `channel.markets.conventional` | {{channel.markets.conventional}}% | Market caravans and barazas: share of effort in the conventional pitch, as Firefly characterises it. |
| `channel.markets.rebalanced` | {{channel.markets.rebalanced}}% | Market caravans and barazas: share of effort, rebalanced. |
| `channel.digital.conventional` | {{channel.digital.conventional}}% | Digital and social media: share of effort in the conventional pitch, as Firefly characterises it. |
| `channel.digital.rebalanced` | {{channel.digital.rebalanced}}% | Digital and social media: share of effort, rebalanced. |
| `channel.church.conventional` | {{channel.church.conventional}}% | Church and community outreach: share of effort in the conventional pitch, as Firefly characterises it. |
| `channel.church.rebalanced` | {{channel.church.rebalanced}}% | Church and community outreach: share of effort, rebalanced. |
| `channel.offline.rebalanced` | {{channel.offline.rebalanced}}% | Share of effort offline, rebalanced: radio, SMS, caravans and church. |
| `effort.digital.pool` | {{effort.digital.pool}}% | Share of Phase −1 digital reach effort geofenced to the pool. |
| `effort.sms.pool` | {{effort.sms.pool}}% | Share of SMS/USSD onboarding effort to the pool's 21 wards. |
| `policy.ward-fund` | KSh {{policy.ward-fund}} | The proposed Ward Development Equalization Fund, per ward per year: a campaign policy proposal, not yet sized. |

<!-- source-table:end -->
