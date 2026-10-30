#### The county: people, budget and three regions

Kitui County's vast physical and demographic characteristics define its developmental and electoral context:

## 1.1 The people: population, gender, age, households

#### The county's people and economy

```visual
kind: stats
items:
  - value: "{{census.population}}"
    label: "people, 2019 census"
    tier: 1
    body: "**Demographic Base:** Sourced from the official 2019 Kenya Population and Housing Census, the county population is **{{census.population}}** (comprising {{census.male}} males, {{census.female}} females, and 33 intersex individuals) (Tier 1). KNBS projects **{{population.2025}}** residents in 2025 and **{{population.2030}}** in 2030 (Tier 1, County Gender Data Sheet, October 2025)."
  - value: "{{census.households}}"
    label: "households"
    tier: 1
    body: "**Total Households:** **{{census.households}}** (Tier 1), with an average household size of **4.3 persons** (Tier 1)."
  - value: "{{census.area}} km²"
    label: "Kenya's sixth-largest county"
    tier: 1
    body: "**Vast Land Area:** **{{census.area}} km²** (Tier 1), establishing Kitui as Kenya's sixth-largest county, with a low population density of **37 persons/km²** (Tier 1) compared to the national average of 82."
  - value: "{{census.rural.share}}%"
    label: "rural"
    tier: 1
    body: "**Rural-Urban Split:** **{{census.rural.share}}% rural** ({{census.rural}} residents) vs **{{census.urban.share}}% urban** ({{census.urban}} residents) (Tier 1)."
  - value: "{{poverty.2021}}%"
    label: "in poverty, 2021"
    tier: 1
    body: "**Socio-Economic Vulnerability:** the **KNBS Kenya Poverty Report** puts **{{poverty.2021}}% of Kitui residents, about {{poverty.2021.people}} people, in poverty in 2021** (Tier 1). This is the official poverty rate; NDMA's 2025 long-rains assessment cites {{poverty.ndma.2019}}% \"below the poverty line (KNBS 2019)\" and a county poverty rate of {{poverty.ndma.county}}%, on bases it does not reconcile with this one (Tier 2), so neither is used in its place. Approximately **{{water.surface}} residents rely on untreated surface water** as their primary domestic source (Tier 1)."
  - value: "over 90%"
    label: "of households keep poultry"
    tier: 1
    body: "**Livestock Economy:** Anchored by approximately {{livestock.cattle}} cattle, {{livestock.goats}} goats, {{livestock.poultry}} poultry, and {{livestock.donkeys}} donkeys (livestock data validation 2023, cited by NDMA in July 2025; Tier 1). **Poultry farming is practiced by over 90% of households** (Tier 1), serving as a highly inclusive, gender-focused entry point for economic empowerment messaging."
```

```figure
id: fig-2-4-people
```

## 1.2 The land: area, density, rural and urban, the three regions

#### The three regions

Kitui is not a monolith. Its eight constituencies and 18 sub-counties have
distinct economic bases, infrastructure needs and political histories. Digital
and SMS messaging is calibrated to each.

```figure
id: fig-3-7-zones
```

```visual
kind: tabs
preset: zone
items:
  - title: "The urban and central anchor: Kitui Central and Kitui West"
    body: "| Sub-County | Population | Density/km² | Households | Strategic value |\n|---|---|---|---|---|\n| Kitui Central | {{sub.kitui-central.population}} | {{sub.kitui-central.density}} | {{sub.kitui-central.households}} | Highest density; Dr. Mulu's home base |\n| Kitui West | {{sub.kitui-west.population}} | {{sub.kitui-west.density}} | {{sub.kitui-west.households}} | High density; contiguous |\n| Katulani | {{sub.katulani.population}} | {{sub.katulani.density}} | {{sub.katulani.households}} | Dense peri-urban |\n| **Total** | **{{zone.anchor.population}}** | — | **{{zone.anchor.households}}** | **{{zone.anchor.share}}% of county population** |\n\nKitui Central leads the county in registered voter density and is Dr. Mulu's\nhome base and highest-literacy zone — {{con.kitui-central}} registered voters in 2022 across\nfive wards (Township {{ward.township}}; Kyangwithya West {{ward.kyangwithya-west}}; Kyangwithya East {{ward.kyangwithya-east}};\nMulango {{ward.mulango}}; Miambani {{ward.miambani}}).\n\nMessaging here emphasises track record, professional competence and national\nreputation. **This base must be mobilised early and intensely — it is the only\nzone where Dr. Mulu starts with a structural advantage, and in a\ncountywide nomination contest, consolidating a base is cheaper than converting a\nstranger.**"
  - title: "The northern block: Mwingi"
    body: "| Sub-County | Population | Density/km² | Households | Key issues |\n|---|---|---|---|---|\n| Mwingi Central | {{sub.mwingi-central.population}} | 95 | {{sub.mwingi-central.households}} | Economic hub for the north |\n| Kyuso | {{sub.kyuso.population}} | 30 | {{sub.kyuso.households}} | Arid, livestock-focused |\n| Mumoni | {{sub.mumoni.population}} | 48 | {{sub.mumoni.households}} | Semi-arid agriculture |\n| Tseikuru | {{sub.tseikuru.population}} | 30 | {{sub.tseikuru.households}} | Pastoral/agricultural mix |\n| **Total** | **{{zone.mwingi.population}}** | — | **{{zone.mwingi.households}}** | **{{zone.mwingi.share}}% of county population** |\n\nBalancing representation between \"Kitui Proper\" and \"Mwingi\" is critical.\nMessaging must assure northern voters that devolved funds will be distributed\nequitably per ward without regional bias — a commitment Dr. Mulu can make more\ncredibly than any rival precisely because he can publish the allocation\nmethodology and then evaluate against it.\n\n**Nomination-window priority.** This zone represents nearly a quarter of the\ncounty and is where a Kitui Central MP is structurally least known. It carries\ndisproportionate Phase −1 weighting of effort and reach."
  - title: "The arid and resource belt: Kitui South and East"
    body: "| Sub-County | Population | Density/km² | Households | Characteristics |\n|---|---|---|---|---|\n| Mutomo | {{sub.mutomo.population}} | 40 | {{sub.mutomo.households}} | Largest population; arid |\n| Ikutha | {{sub.ikutha.population}} | 9 | {{sub.ikutha.households}} | Extremely low density; vast |\n| Mwingi East | {{sub.mwingi-east.population}} | 25 | {{sub.mwingi-east.households}} | Resource extraction potential |\n| Mutitu | {{sub.mutitu.population}} | 12 | {{sub.mutitu.households}} | Sparse; pastoral |\n| Migwani | {{sub.migwani.population}} | {{sub.migwani.density}} | {{sub.migwani.households}} | Higher density; market centre |\n| **Total** | **{{zone.arid.population}}** | — | **{{zone.arid.households}}** | **{{zone.arid.share}}% of county population** |\n\nOver a third of the county, at an average of 19 persons per square kilometre.\nFraming centres on transformative infrastructure — water pipelines, road\nnetworks, and responsible management of mineral resource wealth for local\nbenefit.\n\n**This is where the connectivity gap bites hardest and where SMS/USSD (Section\n4.3 [CHECK REF]) does the heavy lifting.** Digital-only reach into Ikutha at 9 persons/km²\nis not a strategy; it is an assumption. Mapped against the 2022 baseline register,\nregistered voters in Kitui South total {{con.kitui-south}}, distributed across six wards: Athi ({{ward.athi}}),\nIkanga/Kyatune ({{ward.ikanga-kyatune}}), Mutomo/Kibwea ({{ward.mutomo}}), Ikutha ({{ward.ikutha}}), Mutha ({{ward.mutha}}), and Kanziko ({{ward.kanziko}})."
body: "**A note on the names in this table.** These are *administrative sub-counties*, which do not\nmap one-to-one onto the eight constituencies used for the ward register in Section 2.1.\nMigwani and Mwingi East appear here, while Migwani **Ward** sits in Mwingi West constituency\nin the northern bloc — the two are different units with the same name. Anyone reading the\nzone tables against the ward register should treat the constituency figures in 3.3.3 [CHECK REF] as\nauthoritative for targeting, and these as demographic context only."
```

## 1.3 Living standards: poverty, water, electricity, phones and internet

<!-- restructure 2026-11: to be written from the verified data -->

## 1.4 How the county is run: 8 constituencies, 40 wards, sub-counties and villages

The Governor of Kitui is the supreme executive authority of the county, responsible under the County Governments Act for administering public services to over one million residents. Key administrative and policy competencies include:

```visual
kind: checklist
items:
  - label: "Agriculture and Water Infrastructure"
    text: "Developing drought-resilient food production, sand dams, irrigation, and livestock markets."
  - label: "County Health Services"
    text: "Managing health facilities, personnel, pharmaceutical procurement, and sanitation."
  - label: "Economic Devolution and Infrastructure"
    text: "Constructing county road networks, market facilities, and trade support systems."
  - label: "Financial Administration"
    text: "Accountably managing public revenue allocations and local own-source collections."
```

## 1.5 The county's money: the budget envelope, the development plan, the audit record

#### The budget the next governor runs

```lead
According to the approved Kitui County Fiscal Strategy Paper for FY2026/27, the total projected resource envelope is **KSh 13.79 billion**; the total itself is cited through secondary reporting of the Paper (Tier 3) until the Paper is cited directly.
```

#### Sourced Revenue Envelope, FY2026/27 (Approved Fiscal Strategy Paper):

The county budget represents a significant administrative responsibility. According to the approved Kitui County Fiscal Strategy Paper for FY2026/27, the total projected resource envelope is **KSh 13.79 billion**, comprising:

*   **Equitable Share:** KSh 11.64 billion ({{budget.equitable.share}}% of the envelope) (Tier 1).
*   **Own-Source Revenue:** KSh 1.12 billion in the Fiscal Strategy Paper ({{budget.osr.share}}%), raised to **KSh 1.339 billion** by the County Assembly. The final approved FY2026/27 budget settles which applies; until it is in hand, both are shown (Tier 3, verify).
*   **Conditional Grants:** KSh 1.04 billion ({{budget.grants.share}}%) (Tier 1).

```figure
id: fig-2-5-budget
```

The three parts sum to KSh 13.80 billion against a published total of 13.79: the KSh 0.01 billion difference is rounding in the source, and is shown as its own segment rather than absorbed. The total itself is cited through secondary reporting of the Paper (Tier 3) until the Paper is cited directly.

**The Strategic Opportunity:** This KSh 13.79 billion envelope represents the actual fiscal ceiling of devolved governance. The campaign will translate this budget into clear, ward-level policy targets, demonstrating how an expert economist will optimize public resource allocation across the 40 wards.
