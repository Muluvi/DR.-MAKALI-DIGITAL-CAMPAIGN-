#### Who we are trying to move

Because Section 1.2: the three regions differ in economy, connectivity and language, so one countywide message fails.

```figure
id: audience-overview
```

## 11.1 The universes: base, persuasion, turnout

#### The universes: voter, turnout, victory, base, persuasion, mobilisation

```lead
Segments say where to speak and in what language; universes say what success looks like there.
```

The six segments below describe **who** the voters are. This table describes **what the campaign
needs each group to do**, which is a different question and the one the objectives in Section 8.2
are written against. Segments say where to speak and in what language; universes say what
success looks like there.

```visual
kind: nested
note: "**Two of these sizes are deliberately not stated.**"
items:
  - label: "Voter universe"
    text: "**{{register.2022}}**"
    items:
      - label: "Expected turnout universe"
        text: "**~{{ballots.2022}}**"
        items:
          - { label: "Victory universe", text: "**~{{benchmark}}**" }
  - { label: "Base-hold universe", text: "Not stated" }
  - { label: "Persuasion universe", text: "Not stated" }
  - { label: "Mobilisation universe", text: "Target **{{target.supporters}}** verified supporters" }
body: "| Universe | Definition | Size | Basis | What it owns |\n|---|---|---|---|---|\n| Voter universe | Every registered voter in Kitui County | **{{register.2022}}** | IEBC ward register (Tier 1) | — |\n| Expected turnout universe | Ballots expected at the {{turnout.constant}}% turnout rate (the certified 2022 rate) | **~{{ballots.2022}}** | Derived at the modelling constant, Section 2.1 | — [CONFLICT C8: see open items] |\n| **Victory universe** | Votes required to win the general election | **~{{benchmark}}** | Section 2.1; {{result.2022.gov.malombe}} won in 2022 (Tier 1, IEBC Form 37C) | GOTV |\n| **Base-hold universe** | The anchor: Kitui Central and Kitui West | Not stated — Kitui Central holds **{{con.kitui-central}}** registered voters (Tier 1), but a register count is not a support estimate | Section 1.2 | Mobilisation |\n| **Persuasion universe** | The Mwingi bloc and the arid belt, where recognition is weakest | Not stated — the Mwingi constituencies hold **{{bloc.mwingi}}** registered voters (Tier 1), which is the ceiling on this universe and not its size | Section 6.2 | Recognition |\n| **Mobilisation universe** | Identified supporters needing a turnout contact | Target **{{target.supporters}}** verified supporters | Section 8.2 (target) | Field + SMS |"
```

No official source reports ward-level
recognition or support (Section 7.3). This proposal works from existing records only: Week 1
measures what his own channels reach (Section 14.1), which is evidence about reach, not about
support, and the IEBC's ward-level results (Section 2.2) show how each ward has actually voted. A register count is the most a universe can
contain, never what it does contain, and the two are not interchangeable. Estimating the
difference would be the exact failure Annex A.1.3's ban on guesswork forbids.

## 11.2 The six voter segments

```lead
**Each segment carries the production pillar that commissions for it** (Section 12.6), so the segmentation has an output rather than only a description.
```

**Each segment carries the production pillar that commissions for it** (Section 12.6), so the
segmentation has an output rather than only a description:

**P4 — *He came, and this is what he said he would do* — is not in the table because it is not
segment-led.** It is ward-led: whichever ward Dr. Mulu visited that day, in that ward's own channels.
It is the pillar that feeds P1 twelve weeks later.

Where
an official indicator bears on it — drought and food security (Section 3.2), poverty and water
access (Section 1.1), health coverage (Section 10.3) — the segment's message cites that indicator.
The rest is tested only by how content on it performs on reach and engagement, and a hypothesis
the weekly brief cannot support is dropped rather than asserted.

**A segment that runs across the six: women, the household economy and the water carriers.** Women are **{{register.women.share}}% of Kitui's registered voters** (2022). {{women.nopaidwork}}% of women aged 15–49 had no paid work in the past year, against {{women.nopaidwork.kenya}}% nationally and {{men.nopaidwork}}% of Kitui's men; women give {{women.unpaidwork}}% of their time on unpaid domestic and care work against {{men.unpaidwork}}% for men; adult women are {{water.women.collect}}% of those who collect household drinking water; and {{ict.internet.1549.women}}% of women used the internet in the past year, against {{ict.internet.1549.men}}% of men (County Gender Data Sheet, October 2025, Tier 1). Section 10.4 already assigns a message to women's cooperatives and table-banking groups; this makes them a segment. Lead pillar: **P2**, one household, one income stream. Lead channels: SMS, WhatsApp voice notes, table-banking groups and church networks, because the internet gap makes social media the wrong channel for this message. Proof: the poultry and water commitments. The sheet's violence statistics stay out of campaign messaging unless the campaign adopts a specific policy, and its County Assembly chart is verified before it is quoted.

```visual
kind: tabs
preset: segment
note: "**The \"core anxiety\" under each segment is a working hypothesis, not a measured opinion.**"
items:
  - title: "The Rural Agrarian & Smallholder Baseline"
    fields:
      - { label: "Primary pillar", text: "**P2** — one household, one income stream" }
      - { label: "Language", text: "Kikamba on voice; Kiswahili on SMS" }
      - { label: "Lead channel", text: "WhatsApp voice note, SMS" }
      - { label: "Empirical Sizing", text: "**{{census.rural}} rural residents — {{census.rural.share}}% of the county population** (2019 KNBS Census, Tier 1; see Section 1.1). The register is not published by rural/urban split, so applying that share to the {{register.2022}} register gives approximately **{{segment.rural.voters}} rural registered voters** across 36 non-urban wards — a **derived estimate, not a measured figure**." }
      - { label: "Geographic Base", text: "Rural agricultural belts in Kitui Central (Mulango, Kyangwithya East), Kitui West (Mutonguni, Kauwi), Kitui Rural (Kisasi, Mbitini), Mwingi Central (Nuu, Nguni), Mwingi West (Nguutani, Migwani), and Kitui East (Zombe, Chuluni)." }
      - { label: "Connectivity & Media Consumption", text: "**{{ict.offline}}% of residents offline countywide** (CA/KNBS 2023/24, Tier 1); 2G/GSM feature phone dominance; high evening vernacular radio listenership; weekly open-air market gatherings." }
      - { label: "Reachable Channels", text: "- **Primary:** Kamba Vernacular Radio (Musyi FM, Mbaitu FM, Sang'u FM, Athiani FM, Syokimau FM) during morning (06:00–08:30) and evening drive (19:00–21:30). [CONFLICT C7: see open items]\n- **Secondary:** Direct localised bulk SMS in **Kiswahili** to consented contacts on the Firefly-operated line (Section 15.3.3); the campaign's own ward-captain network, which could carry it further, is campaign-owned (Section 13.3). Bulk political SMS is restricted to English or Kiswahili by the CA/NCIC guidelines; the Kikamba version of the same message travels as a WhatsApp voice note (Section 15.3.3).\n- **Physical:** Open-air market day barazas (e.g., Kalundu, Kabati, Mbondoni, Nguni, Mutomo), church fellowships (AIC, Catholic, Redeemed), and agricultural cooperative/SACCO meetings." }
      - { label: "Persuasion Lever (What It Takes to Move Them)", text: "- *Core Anxiety:* Persistent seasonal crop failure, unmitigated drought shocks, exploitative middlemen for green grams (*ndengu*) and pigeon peas (*nzuu*), and erratic subsidized seed/fertilizer distribution.\n- *Candidate Value Proposition:* Frame Dr. Mulu's public finance expertise as a guarantee of **guaranteed minimum returns (GMR)**, county-backed cold storage and aggregate marketing boards, and decentralized solar-powered sand dam and borehole expansion.\n- *Track Record Proof:* Evidence of CDF-funded water harvesting tanks and community boreholes installed across Kitui Central schools and dispensaries." }
  - title: "The Agro-Pastoralist & Arid-Zone Livestock Keepers"
    fields:
      - { label: "Primary pillar", text: "**P1** — where the money went" }
      - { label: "Language", text: "Kikamba on radio and USSD; Kiswahili on SMS" }
      - { label: "Lead channel", text: "SMS, USSD, radio" }
      - { label: "Empirical Sizing", text: "**{{livestock.households}} livestock-farming households** countywide (2019 Census agriculture report, Tier 1), or {{livestock.households.pcra}} households practising livestock production on the county PCRA's definition (Tier 2). The two are different definitions and are shown side by side, never averaged. Households are not voters, so no voter count is derived." }
      - { label: "Geographic Base", text: "Mwingi North (Kyuso, Tseikuru, Tharaka, Ngomeni), Mwingi Central (Waita, Kivou), Kitui South (Mutha, Kanziko, Ikutha, Athi), and Kitui East (Endau/Malalani, Voo/Kyamatu)." }
      - { label: "Connectivity & Media Consumption", text: "Highly dispersed geography; intermittent 2G cellular coverage; heavy battery-powered solar radio listenership; pastoral migration routes." }
      - { label: "Reachable Channels", text: "- **Primary:** Vernacular radio news bulletins and pastoralist agricultural segments (Musyi FM, Sang'u FM).\n- **Secondary:** Weekly livestock market hubs (e.g., Nguni Livestock Market, Tseikuru, Mutha, Kanziko livestock yards).\n- **Intermediaries:** Clan elders (*Atumia ma Utui*), grazing committee chairpersons, and livestock trader association leaders." }
      - { label: "Persuasion Lever (What It Takes to Move Them)", text: "- *Core Anxiety:* Banditry/insecurity along the Tana River and Garissa borders, pasture depletion, lack of county livestock off-take programs during drought, animal disease outbreaks, and predatory livestock buyers.\n- *Candidate Value Proposition:* Concrete commitments to county-financed livestock vaccination corridors, modern meat processing/abattoir facilities in Mwingi and Mutomo, and assertive security coordination with the national government backed by Dr. Mulu's parliamentary budgeting influence." }
  - title: "The Youth Cohort (Ages 18–35: Students, Bodaboda, Unemployed Graduates & Creatives)"
    fields:
      - { label: "Primary pillar", text: "**P3** — the economist explains" }
      - { label: "Language", text: "Kiswahili / Sheng, Kikamba hooks" }
      - { label: "Lead channel", text: "TikTok, Facebook" }
      - { label: "Empirical Sizing", text: "**~44% of the register, about {{segment.youth.voters}} registered voters** (modelled: the 2019 KNBS Census age distribution applied to the 2022 IEBC register; the register is not published by age)." }
      - { label: "Geographic Base", text: "Clustered heavily in peri-urban corridors (Kitui Township, Kwa Vonza/SEKU/KU university belts, Mwingi Central town, Mutonguni, Kabati) and dispersed across rural trading centers." }
      - { label: "Connectivity & Media Consumption", text: "High smartphone and feature-phone social media usage (internet use nationally is {{ict.kenya.internet.15-24}}% at 15–24 and {{ict.kenya.internet.25-34}}% at 25–34, and {{ict.kenya.youth.rural}}% among rural 18–34s: CA/KNBS 2023/24, national figures, Tier 1); active on WhatsApp groups, TikTok, Facebook Mobile, and YouTube; congregation at bodaboda stages, video dens, and sports centers." }
      - { label: "Reachable Channels", text: "- **Primary Digital:** Targeted Meta (Facebook/Instagram) and TikTok short-form video campaigns; viral WhatsApp audio and graphic forwards.\n- **Primary Physical:** Bodaboda stage associations, local football tournament circuits, university/college student unions (SEKU, KU Kitui Campus, Kitui KMTC).\n- **Direct:** SMS broadcasts detailing youth enterprise programs and vocational grants." }
      - { label: "Persuasion Lever (What It Takes to Move Them)", text: "- *Core Anxiety:* Chronic youth un/underemployment, predatory digital lending apps, arbitrary county revenue enforcement/harassment of bodaboda and small kiosks, lack of capital for startup ventures.\n- *Candidate Value Proposition:* Dismantling the \"politician handouts\" model in favor of an institutionalized **County Youth Enterprise & Innovation Fund**, county-funded driving and TVET scholarship vouchers, zero-rating of small informal trade licenses, and creative economy support.\n- *Track Record Proof:* Highlight Dr. Mulu's 100% transparent Kitui Central Constituency NG-CDF bursary disbursement formula, which educated thousands of tertiary and secondary students without patronage." }
  - title: "The Urban & Peri-Urban Commercial Informal Sector (MSMEs & Traders)"
    fields:
      - { label: "Primary pillar", text: "**P3** — the economist explains" }
      - { label: "Language", text: "Kiswahili" }
      - { label: "Lead channel", text: "Facebook, WhatsApp" }
      - { label: "Empirical Sizing", text: "**{{census.urban}} urban residents — {{census.urban.share}}% of the county population** (2019 KNBS Census urban classification, Tier 1). Applying that share to the register gives approximately **{{segment.urban.voters}} urban registered voters** — again derived, not measured. Note this segment's messaging reach extends well beyond the urban classification, since peri-urban trading centres in the ward list sit inside rural wards." }
      - { label: "Geographic Base", text: "Kitui Township ({{ward.township}} voters), Mwingi Central Town ({{ward.central}} voters), Kwa Vonza/Yatta ({{ward.kwa-vonza-yatta}} voters), Mutomo ({{ward.mutomo}} voters), Matinyani ({{ward.matinyani}} voters), and Nguutani ({{ward.nguutani}} voters)." }
      - { label: "Connectivity & Media Consumption", text: "Higher mobile internet use than the county (internet use is {{ict.kenya.internet.urban}}% in urban Kenya against {{ict.kenya.internet.rural}}% rural: CA/KNBS 2023/24, national figures, Tier 1); constant WhatsApp business use; daily interaction with county revenue collectors; regular local vernacular radio listening." }
      - { label: "Reachable Channels", text: "- **Physical:** Direct walk-throughs in commercial business districts, market trader association meetings, chamber of commerce chapters (KNCCI Kitui Chapter).\n- **Digital:** Hyper-geofenced Meta ads (Kitui and Mwingi town centers) and peer-to-peer WhatsApp broadcast chains.\n- **Radio:** Midday business talk shows on Musyi FM and Mbaitu FM." }
      - { label: "Persuasion Lever (What It Takes to Move Them)", text: "- *Core Anxiety:* Excessive county cess/taxes without basic market infrastructure (clean water, lighting, sanitation, paved stalls), arbitrary harassment by county enforcement officers (*kanjo*), fire disasters in markets with zero fire engine response.\n- *Candidate Value Proposition:* \"The Economist's Business Charter\": Single unified business permit, 24-hour solar-lit and secured markets, modern sanitation facilities, and predictable county tax codes that stimulate rather than suffocate micro-commerce." }
  - title: "The Formal Sector Professionals, Civil Servants & Educators"
    fields:
      - { label: "Primary pillar", text: "**P1** — the verification record" }
      - { label: "Language", text: "English, Kiswahili" }
      - { label: "Lead channel", text: "Facebook, X, YouTube" }
      - { label: "Empirical Sizing", text: "not published: comprises teachers under KNUT/KUPPET, healthcare workers, county and national civil servants, bank staff and clergy. Kitui's core health workforce density is {{health.density.core}} (doctors, clinical officers, laboratory staff and nurses per ten thousand people) (Countdown 2030, Tier 2); no size is estimated." }
      - { label: "Geographic Base", text: "Administrative hubs (Kitui Town, Mwingi Town, sub-county headquarters) and public schools/hospitals throughout all 40 wards." }
      - { label: "Connectivity & Media Consumption", text: "Predominantly smartphone and laptop connected (internet use reaches about {{ict.kenya.internet.higher-ed}}% among Kenyans with higher education: CA/KNBS 2023/24, national, Tier 1); active on X (Twitter), Facebook, LinkedIn, professional WhatsApp groups; readers of national daily newspapers and policy analyses." }
      - { label: "Reachable Channels", text: "- **Direct & Digital:** Thought-leadership policy whitepapers, LinkedIn/X executive briefs, structured appearances on national/regional television (Citizen TV, TV47, KTN) and prime-time radio talk shows.\n- **Institutional:** Union delegate barazas (KNUT Kitui Branch, KUPPET, KMPDU, KNUMLO), Kenya Primary School Heads Association (KEPSHA), and clergy synods." }
      - { label: "Persuasion Lever (What It Takes to Move Them)", text: "- *Core Anxiety:* Delayed statutory deductions, stalled career progression/promotions in county government, poor hospital drug supplies undermining medical practice, politicized public service appointments.\n- *Candidate Value Proposition:* Meritocratic public service administration, on-time payment of county health workers, professionalization of the County Public Service Board, and institutional governance free from cronyism.\n- *Track Record Proof:* Dr. Mulu's pristine academic and professional standing (PhD in Economics, Parliamentary Budget & Appropriations Committee member, non-corrupt institutional reputation)." }
  - title: "The Out-of-County Kamba Diaspora Matrix (Nairobi, Coast & Nationwide)"
    fields:
      - { label: "Primary pillar", text: "**P3** — the economist explains" }
      - { label: "Language", text: "English, Kikamba" }
      - { label: "Lead channel", text: "Facebook, YouTube, WhatsApp" }
      - { label: "Empirical Sizing", text: "Kitui's net recent-migration balance was **{{migration.net}}** in 2019 (KNBS Census Analytical Report on Migration, Volume VIII, Tier 1), one of the largest outflows in the country. That is migration context, not a voter count: the share of Kitui-born residents elsewhere who remain registered in Kitui is not published, and no voter size is estimated." }
      - { label: "Geographic Concentration", text: "Nairobi (Embakasi, Kasarani, Kibra, Starehe, Eastleigh, Westlands), Mombasa/Coast (Changamwe, Likoni, Kisauni, Malindi), Machakos/Makueni urban centers." }
      - { label: "Strategic Role", text: "Even those registered to vote in Nairobi/Mombasa act as **critical opinion shapers and financial remitters**. They pay school fees, medical bills, and funeral costs for rural relatives; their political endorsements carry immense weight during family decision-making." }
      - { label: "Connectivity & Media Consumption", text: "Predominantly internet connected (internet use among 18–34s is {{ict.nairobi.youth}}% in Nairobi and {{ict.mombasa.youth}}% in Mombasa: CA/KNBS 2023/24, Tier 1); active on X, Facebook, WhatsApp, YouTube, and national podcasts." }
      - { label: "Reachable Channels", text: "- **Digital:** Targeted geofenced Meta/Google/YouTube digital ad campaigns focused on Nairobi and Mombasa IP addresses targeting Kamba language speakers and Kitui interest groups.\n- **Town Halls:** Physical diaspora engagement dinners and business breakfast town halls in Nairobi and Mombasa.\n- **WhatsApp Networks:** Organized Kitui Professionals Diaspora WhatsApp forums and welfare association groups." }
      - { label: "Persuasion Lever (What It Takes to Move Them)", text: "- *Core Anxiety:* Inefficient county spending that leaves their rural parents and siblings in perpetual poverty, requiring continuous emergency financial bailouts from the diaspora.\n- *Candidate Value Proposition:* Presenting Dr. Mulu as the \"Diaspora's Trusted Steward\"—an economist who will manage county funds with audited transparency, build reliable healthcare and water systems, and create an enabling environment for diaspora private investments in real estate, agribusiness, and tourism." }
```

## 11.3 How large each segment is, and the evidence

#### Segment sizing, and the evidence for it

```lead
**These six segments overlap, and the figures below are not additive.** **Check the base before quoting any percentage here.**
```

**These six segments overlap, and the figures below are not additive.** A 26-year-old
smallholder in Mwingi sits in segment 1 and segment 3; a trader who keeps goats sits in 2 and 4.
Where a size is stated it is a census share or a derived estimate labelled as one; where no source
exists, no size is given.
None is a share of a partition.

**Check the base before quoting any percentage here.** Two denominators are in play: the
**register** ({{register.2022}} voters) and the **county population** ({{census.population}} residents). "{{census.rural.share}}% rural",
for instance, is a population share; "~44% youth" is a share of the register. The column below
states which applies to each row.

```figure
id: fig-4-3-segments
```
