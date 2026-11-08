```lead
Kitui is large, rural, young and poor: **{{census.population}}** people on **{{census.area}} km²**, a median age of **{{census.median-age}}**, and **{{poverty.2021}}%** in poverty in 2021.
```

Kitui is large, rural, young and poor: **{{census.population}}** people on **{{census.area}} km²**, a median age of **{{census.median-age}}**, and **{{poverty.2021}}%** in poverty in 2021 (Tier 1, KNBS). Its next governor runs a resource envelope of **KSh {{budget.total|bn}} billion** a year (Tier 3, unconfirmed). This chapter sets out who lives here and how the county is run; Chapter 3 sets out what they need.

## 1.1 Who lives here

The 2019 census counted **{{census.population}}** people: {{census.male}} men, {{census.female}} women and {{census.intersex}} intersex people (Tier 1, KNBS). KNBS projects **{{population.2025}}** residents in 2025 and **{{population.2030}}** in 2030 (Tier 1, County Gender Data Sheet, October 2025).

```visual
kind: stats
items:
  - value: "{{census.population}}"
    label: "people, 2019 census"
    tier: 1
    body: "{{census.male}} men, {{census.female}} women and {{census.intersex}} intersex people (Tier 1, KNBS 2019 Census)."
  - value: "{{census.households}}"
    label: "households"
    tier: 1
    body: "An average of **{{census.household-size}}** people per household (Tier 1, KNBS 2019 Census)."
  - value: "{{census.median-age}}"
    label: "median age, in years"
    tier: 1
    body: "Half of Kitui's residents are {{census.median-age}} or younger (Tier 1, calculated from KNBS 2019 Census Volume III)."
```

```figure
id: fig-2-4-people
```

**Age.** The median age is **{{census.median-age}}** (Tier 1, calculated from KNBS 2019 Census Volume III). The 2019 census puts **{{census.age.0-14.share}}%** of residents at 0–14, **{{census.age.15-34.share}}%** at 15–34, **{{census.age.35-59.share}}%** at 35–59 and **{{census.age.60-plus.share}}%** at 60 and over (Tier 1, KNBS 2019 Census Volume III).

**What it means for the campaign.** A county where half the people are under {{census.median-age}} has a large cohort of first-time voters arriving at each election, and women are the majority of residents ({{census.female.share}}%).

## 1.2 The land and its three regions

Kitui covers **{{census.area}} km²**, Kenya's sixth-largest county, at **{{census.density}}** people per km² (Tier 1, KNBS 2019 Census). The national comparison is not yet sourced: an earlier draft gave 82 per km²; the record that would settle it is KNBS 2019 Census Volume I.

```visual
kind: stats
items:
  - value: "{{census.area}} km²"
    label: "Kenya's sixth-largest county"
    tier: 1
    body: "**{{census.density}}** people per km² (Tier 1, KNBS 2019 Census)."
  - value: "{{census.rural.share}}%"
    label: "rural"
    tier: 2
    body: "**{{census.rural.share}}% rural** ({{census.rural}} residents) and **{{census.urban.share}}% urban** ({{census.urban}} residents) (Tier 2, KNBS 2019 Census Volume II via the CRA county fact sheet)."
```

*Source conflict: secondary reporting puts the rural share near 86%, and an earlier draft gave an urban share of 14.9% with no source; the figures above sum exactly to the census total and are the verified ones, at Tier 2 until the KNBS Volume II table itself is cited.*

**Three regions.** Kitui is not one place. Its eight constituencies and {{census.subcounties}} sub-counties have distinct economies, infrastructure needs and political histories, and the campaign's digital and SMS messaging is set for each.

```figure
id: fig-3-7-zones
```

```visual
kind: tabs
preset: zone
items:
  - title: "The urban and central anchor: Kitui Central and Kitui West"
    body: "| Sub-County (Tier 1, KNBS 2019 Census) | Population | Density/km² | Households | Strategic value |\n|---|---|---|---|---|\n| Kitui Central | {{sub.kitui-central.population}} | {{sub.kitui-central.density}} | {{sub.kitui-central.households}} | Highest density; Dr. Makali Mulu's home base |\n| Kitui West | {{sub.kitui-west.population}} | {{sub.kitui-west.density}} | {{sub.kitui-west.households}} | High density; contiguous |\n| Katulani | {{sub.katulani.population}} | {{sub.katulani.density}} | {{sub.katulani.households}} | Dense peri-urban |\n| **Total** | **{{zone.anchor.population}}** | — | **{{zone.anchor.households}}** | **{{zone.anchor.share}}% of county population** |\n\nKitui Central has the county's highest registered-voter density and is Dr. Mulu's\nhome base and highest-literacy zone: {{con.kitui-central}} registered voters in 2022 across\nfive wards (Township {{ward.township}}; Kyangwithya West {{ward.kyangwithya-west}}; Kyangwithya East {{ward.kyangwithya-east}};\nMulango {{ward.mulango}}; Miambani {{ward.miambani}}), all Tier 1 (IEBC).\n\nMessaging here leads on his record, professional competence and national\nstanding. **This base is mobilised early. It is the only\nzone where Dr. Mulu starts with a structural advantage, and in a\ncountywide nomination contest a base is cheaper to consolidate than a\nstranger is to convert.**"
  - title: "The northern block: Mwingi"
    body: "| Sub-County (Tier 1, KNBS 2019 Census) | Population | Density/km² | Households | Key issues |\n|---|---|---|---|---|\n| Mwingi Central | {{sub.mwingi-central.population}} | {{sub.mwingi-central.density}} | {{sub.mwingi-central.households}} | Economic hub for the north |\n| Kyuso | {{sub.kyuso.population}} | {{sub.kyuso.density}} | {{sub.kyuso.households}} | Arid, livestock-focused |\n| Mumoni | {{sub.mumoni.population}} | {{sub.mumoni.density}} | {{sub.mumoni.households}} | Semi-arid agriculture |\n| Tseikuru | {{sub.tseikuru.population}} | {{sub.tseikuru.density}} | {{sub.tseikuru.households}} | Pastoral/agricultural mix |\n| **Total** | **{{zone.mwingi.population}}** | — | **{{zone.mwingi.households}}** | **{{zone.mwingi.share}}% of county population** |\n\nThe balance between \"Kitui Proper\" and \"Mwingi\" matters.\nNorthern voters need to hear that devolved funds will be shared\nfairly by ward, without regional bias. Dr. Mulu can make that commitment more\ncredibly than any rival, because he can publish the allocation\nmethodology and then evaluate against it.\n\n**Nomination-window priority.** This zone holds nearly a quarter of the\ncounty, and it is where a Kitui Central MP is least known. It carries\nmore than its share of Phase −1 effort and reach."
  - title: "The arid and resource belt: Kitui South and East"
    body: "| Sub-County (Tier 1, KNBS 2019 Census) | Population | Density/km² | Households | Characteristics |\n|---|---|---|---|---|\n| Mutomo | {{sub.mutomo.population}} | {{sub.mutomo.density}} | {{sub.mutomo.households}} | Largest population; arid |\n| Ikutha | {{sub.ikutha.population}} | {{sub.ikutha.density}} | {{sub.ikutha.households}} | Extremely low density; vast |\n| Mwingi East | {{sub.mwingi-east.population}} | {{sub.mwingi-east.density}} | {{sub.mwingi-east.households}} | Resource extraction potential |\n| Mutitu | {{sub.mutitu.population}} | {{sub.mutitu.density}} | {{sub.mutitu.households}} | Sparse; pastoral |\n| Migwani | {{sub.migwani.population}} | {{sub.migwani.density}} | {{sub.migwani.households}} | Higher density; market centre |\n| **Total** | **{{zone.arid.population}}** | — | **{{zone.arid.households}}** | **{{zone.arid.share}}% of county population** |\n\nOver a third of the county, at an average density an earlier draft put at 19 people per km² (not yet sourced).\nThe message here is infrastructure: water pipelines, roads,\nand mineral wealth managed for local\nbenefit.\n\n**This is where the connectivity gap is widest, and where SMS and USSD (Section\n15.3.3) do most of the work.** Reaching Ikutha, at {{sub.ikutha.density}} people per km², by digital alone\nis not a strategy; it is an assumption. On the 2022 register,\nKitui South has {{con.kitui-south}} registered voters in six wards: Athi ({{ward.athi}}),\nIkanga/Kyatune ({{ward.ikanga-kyatune}}), Mutomo/Kibwea ({{ward.mutomo}}), Ikutha ({{ward.ikutha}}), Mutha ({{ward.mutha}}) and Kanziko ({{ward.kanziko}}), all Tier 1 (IEBC)."
body: "**A note on the names in this table.** These are *administrative sub-counties*, which do not\nmap one-to-one onto the eight constituencies of the ward register in Annex B.\nMigwani and Mwingi East appear here, while Migwani **Ward** sits in Mwingi West constituency,\nin the northern bloc: two different units with the same name. Read against the\nward register, the constituency figures in Annex B govern targeting, and these tables are\ndemographic context only."
```

Living standards, from poverty and water to electricity, phones and the internet, are set out with the rest of what voters need, in What voters need.

## 1.4 How the county is run

Kitui has eight constituencies, 40 county assembly wards and {{census.subcounties}} administrative sub-counties (Tier 1, IEBC and KNBS). The county also counts villages as administrative units. No verified figure is available yet for their number; the record that would settle it is the Kitui County Integrated Development Plan 2023–2027. The reported count is of villages, not sub-locations, and the two are not used interchangeably.

Constituencies and wards are the electoral units, and the ward register in Annex B uses them. Sub-counties are the administrative units the census reports by, and they do not map one-to-one onto constituencies (Section 1.2).

The Governor of Kitui heads the county executive. Under the County Governments Act the office runs public services for more than one million residents. Its main responsibilities:

```visual
kind: checklist
items:
  - label: "Agriculture and Water Infrastructure"
    text: "Drought-resilient food production, sand dams, irrigation, and livestock markets."
  - label: "County Health Services"
    text: "Health facilities, staff, medicine procurement, and sanitation."
  - label: "Economic Devolution and Infrastructure"
    text: "County roads, market facilities, and support for trade."
  - label: "Financial Administration"
    text: "Accountable management of revenue allocations and the county's own-source collections."
```

The county's money, from the budget envelope to the audit record, is set out in one place in What voters need, beside how it was spent.

