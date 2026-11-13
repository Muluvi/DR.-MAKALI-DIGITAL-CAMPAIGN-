"""The evidence pass (29 Oct 2026): the Kitui source pack, applied per section 7 of
docs/evidence-2026-10/source-pack-upgrades.md. Every addition, replacement and move is logged in
docs/evidence-2026-10/ledger.json, which `npm run check:content` weighs against 8f10cb9."""
import os
import re
import sys

os.environ.setdefault("CONTENT_LEDGER", os.path.join("docs", "evidence-2026-10", "ledger.json"))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from edit import *  # noqa: E402,F403
from edit import _log  # noqa: E402
from stage_helpers import block  # noqa: E402

PACK = "Kitui source pack (docs/evidence-2026-10/source-pack-upgrades.md)"


def prose_words(text):
    """Words a check-content pass counts as prose: everything outside ```visual fences."""
    return words(re.sub(r"```visual\n[\s\S]*?```", " ", text))


def add(name, number, anchor, text, note, before=False):
    """Insert `text` after (or before) `anchor` in a section, and log it as an addition."""
    replace(name, number, anchor, (text + anchor) if before else (anchor + text))
    _log({"file": name, "section": number, "first12": first12(text.strip()), "words": prose_words(text), "kind": "added",
          "home": PACK, "note": note, "text": text.strip()})


def append(name, number, text, note):
    """Add `text` at the end of a section's body, before the next heading, and log it."""
    src = read(name)
    a, b = span(src, number)
    body = src[a:b].rstrip("\n")
    write(name, src[:a] + body + "\n\n" + text.strip("\n") + "\n\n" + src[b:])
    _log({"file": name, "section": number, "first12": first12(text.strip()), "words": prose_words(text), "kind": "added",
          "home": PACK, "note": note, "text": text.strip()})


def swap_text(name, number, old, new, note):
    """Replace superseded wording or a superseded figure, and log both versions."""
    cut(name, number, old, kind="replaced", home=PACK, new=new, note=note)


# ================================================================ 2.8.1 the county's people
E = "evidence"
swap_text(E, "2.8.1", "Projections estimate a population base of approximately 1.2 million by 2024 (Tier 2).",
          "KNBS projects **{{population.2025}}** residents in 2025 and **{{population.2030}}** in 2030 (Tier 1, County Gender Data Sheet, October 2025).",
          "The Tier 2 '1.2 million by 2024' gives way to the KNBS projections (source pack p. 6).")
swap_text(E, "2.8.1", "the 60.4% in the NDMA Long Rains Food Security Assessment is a food-security figure, not a poverty-report rate, and is not used.",
          "NDMA's 2025 long-rains assessment cites {{poverty.ndma.2019}}% \\\"below the poverty line (KNBS 2019)\\\" and a county poverty rate of {{poverty.ndma.county}}%, on bases it does not reconcile with this one (Tier 2), so neither is used in its place.",
          "The note called 60.4% a food-security figure; NDMA cites it as a KNBS 2019 poverty line, beside a second rate (p. 92). Both are now shown, neither replaces the KNBS 2021 rate.")
swap_text(E, "2.8.1", "{{livestock.donkeys}} donkeys (Tier 1).",
          "{{livestock.donkeys}} donkeys (livestock data validation 2023, cited by NDMA in July 2025; Tier 1).",
          "The livestock counts' source is now named (p. 96).")
add(E, "2.8.1", "  - when: \"September 2025\"\n",
    "  - when: \"July 2025\"\n    label: \"NDMA long-rains assessment: IPC 2, worsening; the marginal mixed-farming zone ({{livelihood.marginal}}% of residents) projected to IPC 3 (\\\"Crisis\\\") for October–December 2025\"\n    tier: 1\n",
    "The July 2025 NDMA phase and projection (pp. 90, 120).", before=True)
add(E, "2.8.1", "id: fig-2-4-people\n```\n",
    "\n**Livelihoods and wealth (NDMA, July 2025, Tier 1).** {{livelihood.mixed}}% of residents live in the mixed farming zone, "
    "{{livelihood.marginal}}% in marginal mixed farming and {{livelihood.employment}}% in formal and unskilled employment. NDMA's wealth "
    "groups are very poor {{wealth.verypoor}}%, poor {{wealth.poor}}%, middle {{wealth.middle}}% and better-off {{wealth.better}}%: the "
    "Tier 1 basis for the rural agrarian and agro-pastoralist segments in Section 3.4.2.\n",
    "Livelihood zones and wealth groups (p. 92).")

# ================================================================ 2.9.1 and 2.9.3: two bases for phone reach
table_end = "| Mobile Financial Services | Near-universal reliance on mobile transactions | Dominant mobile-money footprint | 53.4 million subscriptions ({{ict.momo-penetration}}%); **{{ict.agents}} registered agents** (March 2026) |\n"
add(E, "2.9.1", table_end,
    "| Mobile Phone Ownership, adults (KDHS 2022) | Men 18+ **{{ict.phone.adult.men}}%**, women 18+ **{{ict.phone.adult.women}}%** (County Gender Data Sheet, October 2025) (Tier 1) | — | Kenya: men {{ict.kenya.phone.adult.men}}%, women {{ict.kenya.phone.adult.women}}% (Tier 1) |\n"
    "| Internet Use, ages 15–49 (KDHS 2022) | Men **{{ict.internet.1549.men}}%**, women **{{ict.internet.1549.women}}%** (Tier 1) | — | Kenya: men {{ict.kenya.internet.1549.men}}%, women {{ict.kenya.internet.1549.women}}% (Tier 1) |\n"
    "\n**Two bases, never averaged.** {{ict.phone}}% and {{ict.internet}}% are shares of all residents, children included. "
    "The register holds adults only, and adults own phones at about three times in four. Section 2.9.3 models voter reach on both "
    "bases and states which it uses.\n",
    "Adult phone and internet rates from KDHS 2022 (source pack p. 9), beside the resident rates.")
add(E, "2.9.3", "mobilize the out-of-county diaspora.\n",
    "\n**The SMS and USSD layer reaches more voters than the resident rate implies.** On the resident basis "
    "({{ict.phone}}% of all residents) about {{reach.phone.resident}} voters own a phone. On the adult basis ({{ict.phone.adult}}% of "
    "adults, KDHS 2022, weighted by the register's {{register.women.share}}% women) about **{{reach.phone.adult}}** do and about "
    "{{reach.nophone.adult}} do not (both modelled on the July 2026 register as reported, so Tier 3). That is roughly "
    "{{reach.phone.ratio}} times as many voters within reach of SMS and USSD. The digital ceiling above does not move: internet use "
    "among adults aged 15–49 is {{ict.internet.1549.men}}% for men and {{ict.internet.1549.women}}% for women.\n",
    "The adult-based reach model (source pack section 3.1).")

# ================================================================ 2.12 the diagnosis: need and recognition point the same way
add(E, "2.12", "body: \"That test is not a formality; it is the first deliverable.",
    " A further line for what supports it: NDMA ranks Mwingi North and Kitui South the two most food-insecure sub-counties in "
    "July 2025 and Kitui Central the least (Tier 1, Annex B.3), so the pool is where county service delivery is under the most "
    "visible strain, and a verification candidate has the most to show there.",
    "The NDMA ranking added to what supports the diagnosis, in the card's details (pp. 121–122).")

# ================================================================ 3.2.2 the pillars' unverified figures
S = "strategy"
swap_text(S, "3.2.2", "Narrative Statement *(Firefly is verifying the 78.4% figure against KNBS before this line is used)*",
          "Narrative Statement *(the farming shares are the county government's own figures, Tier 2)*",
          "The untiered 78.4% gives way to the county's own statement (scorecard p. 141), quoted as the county's claim.")
swap_text(S, "3.2.2", "*\\\"78.4% of Kitui's households depend on farming and livestock, yet",
          "*\\\"Agriculture employs {{farm.employs}}% of Kitui's people and sustains {{farm.rural-households}}% of its rural households, by the county's own count, yet",
          "As above.")
add(S, "3.2.2", "**Kitui County Integrated Development Plan (CIDP III).** The 61% figure is not yet tiered.",
    " The County Gender Data Sheet (October 2025) gives {{water.over30}}% of residents taking more than 30 minutes to reach "
    "drinking water (KDHS 2022, Tier 1); it is not substituted until the CIDP's 61% is confirmed to be the same measure.",
    "A candidate replacement for the untiered 61%, held until the measure is confirmed (p. 6).")

# ================================================================ 3.2.4 the themes: new evidence
add(S, "3.2.4", "      - { label: \"Why this is the strongest theme in the document\"",
    "      - { label: \"New evidence, October 2025 and July 2025\", text: \"Only {{water.30min}}% of residents reach drinking water in under 30 minutes (Kenya {{water.30min.kenya}}%), and {{water.over30}}% take longer (County Gender Data Sheet, Tier 1). In July 2025, {{water.points.working}} of {{water.points.total}} water sources were working, so **{{water.points.down.share}}% were not**; in Kitui Central only {{water.points.working.kitui-central}}% were working, the lowest of the eight (NDMA, Tier 1). **{{water.schools.unsafe}} school units have no safe water within 100 m.** The Kitui Central figure is in his own constituency: water points are county assets, not NG-CDF ones, but prepare the answer before using the number. The school figure counts units by level, several of which may share a compound; it is used with that wording or not at all.\" }\n",
    "Water evidence (pp. 6, 103–104, 116).", before=True)
add(S, "3.2.4", "      - { label: \"Evidence, continued\", text: \"That second figure is the whole argument",
    "      - { label: \"Green grams, markets and the fodder gap\", text: \"Green grams give {{greengrams.cash.marginal}}% of cash income in marginal mixed farming and {{greengrams.cash.mixed}}% in mixed farming; the long rains of 2025 produced {{greengrams.lr2025}} bags, {{greengrams.lr2025.vs-average}}% above the five-year average, while maize was {{maize.lr2025.vs-average}}% below (NDMA, Tier 1). This does not confirm the untiered annual output in Message Pillar 2: the long rains supply only part of the year's crop. Maize sold at KSh {{price.maize}} a kg against a five-year average of {{price.maize.average}}. The county holds {{fodder.held}} bales of fodder against {{fodder.needed}} needed and has no commercial fodder business. KEPHIS found {{aflatoxin.maize}}% of maize and {{aflatoxin.groundnut}}% of groundnut samples above the aflatoxin limit in 2024.\" }\n",
    "Economy evidence (pp. 94–98, 102).", before=True)
swap_text(S, "3.2.4", "    head: { label: \"Evidence\", text: \"13.0% never attended school and 17.4% completed secondary (both stated at Section 4.5.4 and **not yet tiered** — obtainable from the KNBS county bulletin).\" }",
          "    head: { label: \"Evidence\", text: \"{{edu.none.women}}% of females and {{edu.none.men}}% of males aged six and over have no education (KDHS 2022, Tier 1; this replaces an untiered 13.0%). 17.4% completed secondary is still **not yet tiered**.\" }",
          "The untiered 13.0% gives way to KDHS 2022's no-education rates by sex (p. 8).")
add(S, "3.2.4", "      - { label: \"Evidence, continued\", text: \"and **KSh47m already delivered",
    "      - { label: \"School meals, damaged schools and attendance\", text: \"School meals reach a minority of schools, and much of the provision is parent-funded; NDMA links the gap to absenteeism, dropout and transfers out of the county. Its report gives two counts that do not agree: {{schools.meals}} of {{schools.meals.of}} schools with a programme on one page, and a larger count of school units on another (Tier 1). {{schools.damaged}} schools were damaged in March–April 2025, affecting about {{schools.damaged.learners}} learners. Girls attend secondary school more than boys: net attendance {{edu.secondary.girls}}% against {{edu.secondary.boys}}%.\" }\n",
    "Education evidence (pp. 9, 111, 113–114).", before=True)
swap_text(S, "3.2.4", "    head: { label: \"Evidence\", text: \"{{health.insurance}}% of Kitui residents have any health insurance, and",
          "    fields:\n      - { label: \"Access, births and outbreaks\", text: \"{{health.access.problem}}% of women report a problem getting health care (Kenya {{health.access.problem.kenya}}%); {{health.facility-births}}% of births are in a facility (Kenya {{health.facility-births.kenya}}%). In January–June 2025 Ngomeni had a confirmed measles outbreak ({{health.measles.ngomeni}} cases) and typhoid cases rose from {{health.typhoid.2024}} to {{health.typhoid.2025}}, which NDMA attributes to contaminated water and poor sanitation. Infant mortality is {{health.imr}} per thousand births and under-5 mortality {{health.u5mr}}, both better than Kenya's {{health.imr.kenya}} and {{health.u5mr.kenya}} (KDHS 2022, Tier 1). Only {{health.diet.diversity}}% of children aged 6–23 months meet minimum dietary diversity (SMART 2023).\" }\n    head: { label: \"Evidence\", text: \"{{health.insurance}}% of Kitui residents have any health insurance, and",
          "Health evidence (pp. 7–8, 106–108), as a field under the theme's evidence.")

# A seventh theme: security and resource conflict (source pack 3.3).
add(S, "3.2.4", "    badge: \"not yet tiered\"\n```\n",
    "\n**A further theme the evidence now supports: security and resource conflict.** NDMA reports {{border.killed}} people killed "
    "on the Kitui–Tana River border at Endau/Malalani, herders migrating in, clashes between herder communities in Ngomeni and "
    "Tseikuru, and wildlife preying on stock and crops near Tsavo East (July 2025, Tier 1). The county's scorecard claims "
    "{{scorecard.police.stations}} border police stations, {{scorecard.police.complete}} of them complete. This is the Tier 1 evidence "
    "for the insecurity the agro-pastoralist segment lists as its core anxiety (Section 3.4.2). It is framed as resource and border "
    "security, never in community or ethnic terms (Charter clause 6, Section 5.3.3).\n",
    "Security and resource conflict (pp. 93, 165).", before=False)

# ================================================================ 3.3.1 where the effort goes: need, and the county's own spend
add(S, "3.3.1", "Effort and content allocation across zones, by phase.\n",
    "\n**Where the voters are, and where the need is most severe.** NDMA ranks Mwingi North first and Kitui South second of the "
    "eight sub-counties for food-insecurity severity, and Kitui Central eighth (July 2025, Tier 1; the full ranking is in Annex B.3). "
    "Its hotspot wards in the three most severe sub-counties include Kyuso, Tseikuru and Athi, three of the twelve largest wards "
    "(Section 2.3). The county's own scorecard now supplies part of the ward-level expenditure data this weighting needs: on its "
    "{{scorecard.itemised}} itemised projects the pool's four constituencies receive {{scorecard.pool.share}}% of constituency-"
    "attributed expenditure against {{pool.share}}% of the register, so the pool as a whole was not passed over and the proposal does not "
    "claim it was. The gap is Mwingi West, at KSh {{scorecard.mwingi-west.per-voter}} per registered voter against KSh "
    "{{scorecard.kitui-central.per-voter}} in Kitui Central (Annex B.2).\n",
    "NDMA ranking and the scorecard's spend split (pp. 121–122; scorecard tables).", before=True)

# ================================================================ 3.3.2 the reach rows: two bases
swap_text(S, "3.3.2", "| No phone: radio or in person only | ~{{reach.nophone}} voters (modelled) |",
          "| Phone owners: the SMS and USSD layer | ~{{reach.phone.resident}} voters on the resident rate ({{ict.phone}}%); ~{{reach.phone.adult}} on the adult rate (KDHS 2022: {{ict.phone.adult}}%). Both modelled, never averaged (Section 2.9.3) |\n"
          "| No phone: radio or in person only | ~{{reach.nophone}} voters on the resident rate; ~{{reach.nophone.adult}} on the adult rate (both modelled) |",
          "The no-phone row restated as a range on both bases (source pack 3.1).")

# ================================================================ 3.4.2 a segment across the six: women
add(S, "3.4.2", "\n```visual\nkind: tabs\npreset: segment\n",
    "\n**A segment that runs across the six: women, the household economy and the water carriers.** Women are "
    "**{{register.women.share}}% of Kitui's registered voters** (2022). {{women.nopaidwork}}% of women aged 15–49 had no paid work in "
    "the past year, against {{women.nopaidwork.kenya}}% nationally and {{men.nopaidwork}}% of Kitui's men; women give "
    "{{women.unpaidwork}}% of their time on unpaid domestic and care work against {{men.unpaidwork}}% for men; adult women are "
    "{{water.women.collect}}% of those who collect household drinking water; and {{ict.internet.1549.women}}% of women used the "
    "internet in the past year, against {{ict.internet.1549.men}}% of men (County Gender Data Sheet, October 2025, Tier 1). Annex C "
    "already assigns a message to women's cooperatives and table-banking groups; this makes them a segment. Lead pillar: **P2**, "
    "one household, one income stream. Lead channels: SMS, WhatsApp voice notes, table-banking groups and church networks, because "
    "the internet gap makes social media the wrong channel for this message. Proof: the poultry and water commitments. The sheet's "
    "violence statistics stay out of campaign messaging unless the campaign adopts a specific policy, and its County Assembly chart "
    "is verified before it is quoted.\n",
    "A women's segment across the six (source pack 3.4; GDS pp. 6, 9–10).", before=True)

# ================================================================ 3.5 the incumbent's slogan
add(S, "3.5", "```figure\nid: fig-4-4-message-region\n```\n",
    "\n**The incumbent's slogan already claims resources.** The county scorecard runs *\"Rasilimali Zetu, Maisha Bora\"* "
    "(\"Our Resources, Better Lives\") on every page. This proposal's governing line, *\"Kitui has resources. What it has lacked is "
    "leadership that understands how to use them — and the discipline to prove it did\"*, answers it. Governor Malombe's "
    "administration is Wiper and the nomination is a Wiper contest, so until the ticket is settled the campaign uses the line's "
    "verification half (publish whether it happened), not its deficit half. In the general election the full contrast is available.\n",
    "The slogan contrast and when to use it (source pack 3.5).", before=True)

# ================================================================ 3.5.3 framing: five new examples, and the 2022 fuel figure
add(S, "3.5.3", "  - title: \"Fiscal accountability\"\n",
    "      - { label: \"Loss aversion (July 2025)\", text: \"\\\"More than a quarter of Kitui's water points were not working in July 2025 (NDMA). Every broken borehole is a longer walk for a woman in Mutha.\\\" {{water.points.down.share}}% of {{water.points.total}} sources, Tier 1.\" }\n"
    "      - { label: \"Verification (the county's own count)\", text: \"\\\"The county says it drilled {{scorecard.boreholes.drilled}} boreholes. Dial `[shortcode]` and check the one nearest you.\\\" During the nomination window, the verification half only (Section 3.5).\" }\n",
    "Two water framings (source pack 3.5).", before=True)
add(S, "3.5.3", "  - title: \"Youth unemployment\"\n",
    "      - { label: \"Social proof\", text: \"\\\"Green grams beat the five-year average by {{greengrams.lr2025.vs-average}}% this season. Kitui farmers adapt; the county should help them sell.\\\" NDMA, long rains 2025, Tier 1.\" }\n",
    "A green-gram framing (source pack 3.5).", before=True)
add(S, "3.5.3", "  - title: \"Energy poverty\"\n",
    "      - { label: \"Anchoring\", text: \"\\\"Seven in ten Kitui residents report a problem getting health care. Dr. Mulu will publish which clinics have medicines this week.\\\" {{health.access.problem}}% of women, KDHS 2022, Tier 1: say \\\"residents report\\\" only with that base stated.\" }\n"
    "  - title: \"School meals\"\n"
    "    fields:\n"
    "      - { label: \"Messenger effect\", text: \"A parent from a school running a parent-funded meals programme, on why the county should carry it. NDMA links the gap to absenteeism and dropout (Section 3.2.4).\" }\n",
    "A health anchoring and a school-meals messenger (source pack 3.5).", before=True)
swap_text(S, "3.5.3", "      - { label: \"Anchoring\", text: \"\\\"{{fuel.unclean}}% of Kitui households still cook with unclean fuels. Energy poverty is economic poverty.\\\" 2019 Census, Tier 1; {{fuel.firewood}}% cook mainly with firewood.\" }",
          "      - { label: \"Anchoring\", text: \"\\\"Only {{fuel.clean.2022}}% of Kitui households cook with clean fuels. Energy poverty is economic poverty.\\\" 2022, County Gender Data Sheet, Tier 1 (Kenya {{fuel.clean.2022.kenya}}%). The 2019 Census put unclean fuels at {{fuel.unclean}}% and firewood at {{fuel.firewood}}%.\" }",
          "The 2022 clean-fuel figure leads; the 2019 Census figures stay as context (p. 6).")

# ================================================================ 4.5.1 the tracker's opening register and first questions
P = "workstreams-platforms"
add(P, "4.5.1", "#### Tracker KPIs\n",
    "#### The opening register: the county's own scorecard\n\n"
    "The tracker does not start from an empty list. The county's *Delivering the Kitui Promise* scorecard (August 2022 – August "
    "2025) claims {{scorecard.claimed}} projects and itemises {{scorecard.itemised}} of them with value, ward and status, KSh "
    "{{scorecard.itemised.ksh|bn}} billion in all (Tier 1 as a record of what the county claims, not evidence that the claims are "
    "true). Those rows load as the tracker's opening register ([kitui-scorecard-projects.csv](/data/kitui-scorecard-projects.csv)): "
    "each becomes a public row, *County says: complete. Residents say: ___*, and reports through USSD option 3 fill the second "
    "column.\n\n"
    "The first verification questions are inconsistencies inside the county's document or against an official statistic. Each is a "
    "question to publish and test, not an accusation, and a county correspondent can check the first six independently (Section 4.5.6).\n\n"
    "```visual\nkind: checklist\ntitle: \"The tracker's first questions\"\nitems:\n"
    "  - label: \"Q1. Livestock vaccinated\"\n    text: \"{{scorecard.vaccinated}} claimed; the itemised rows total {{scorecard.vaccinated.itemised}} animals.\"\n"
    "  - label: \"Q2. Infant mortality\"\n    text: \"Claimed to fall from {{scorecard.imr.from}} to {{scorecard.imr.to}} per thousand births; KDHS 2022 puts Kitui at {{health.imr}}. Is the scorecard's figure a facility rate or a county rate?\"\n"
    "  - label: \"Q3. Roads graded\"\n    text: \"{{scorecard.roads.graded}} km claimed; the itemised row of {{scorecard.roads.row.km}} km comes to KSh {{scorecard.roads.row.per-km}} a km.\"\n"
    "  - label: \"Q4. Boreholes\"\n    text: \"{{scorecard.boreholes.drilled}} drilled and {{scorecard.boreholes.equipped}} equipped: are the rest not yet equipped?\"\n"
    "  - label: \"Q5. Health beneficiaries\"\n    text: \"Two health projects list {{scorecard.health.beneficiaries}} beneficiaries, more than the county's 2019 population of {{census.population}}: a catchment, not people served?\"\n"
    "  - label: \"Q6. The unitemised projects\"\n    text: \"{{scorecard.claimed}} claimed, {{scorecard.itemised}} itemised: where is the list of the other {{scorecard.unitemised}}?\"\n"
    "  - label: \"Q7. Kangu Kangu\"\n    text: \"KSh {{scorecard.kangu.ksh|m1}} million for {{scorecard.kangu.households}}+ households, commissioned after the period the scorecard covers: what has been delivered since?\"\n"
    "  - label: \"Q8. Boda boda sheds\"\n    text: \"{{scorecard.boda.sheds}} claimed; {{scorecard.boda.sheds.itemised}} itemised.\"\n"
    "  - label: \"Q9. Ward attributions\"\n    text: \"Some rows place wards in the wrong constituency (Voo/Kyamatu under Kitui South; it is in Kitui East): a data-quality point for any ward-level use.\"\n"
    "```\n\n",
    "The scorecard as the tracker's opening register, and Q1–Q9 (source pack 4.1, 4.3).", before=True)

# ================================================================ 4.5.4 accessibility: tiered figures
for old, new, note in [
    ("In a county where 13.0% of the population never attended school, accessibility is reach, not compliance theatre.",
     "In a county where {{edu.none.women}}% of women and {{edu.none.men}}% of men aged six and over have no education, accessibility is reach, not compliance theatre.",
     "The lead follows the tiered figures (p. 8)."),
]:
    swap_text(P, "4.5.4", old, new, note)
swap_text(P, "4.5.4", "*In a county where 13.0% of the population never attended school,\naccessibility is reach, not compliance theatre.*",
          "*In a county where {{edu.none.women}}% of women and {{edu.none.men}}% of men aged six and over have no education,\naccessibility is reach, not compliance theatre.*",
          "The untiered 13.0% gives way to KDHS 2022's no-education rates by sex (p. 8).")
swap_text(P, "4.5.4", "  - value: \"13.0%\"\n    label: \"never attended school\"\n    tier: \"not yet tiered\"\n    body: \"**13.0% of Kitui residents have never attended school**; only 17.4% completed secondary education\"",
          "  - value: \"{{edu.none.women}}%\"\n    label: \"of women aged 6+ have no education\"\n    tier: 1\n    body: \"KDHS 2022 via the County Gender Data Sheet (October 2025): {{edu.none.women}}% of females and {{edu.none.men}}% of males aged six and over have no education. This replaces an untiered 13.0% (\\\"never attended school\\\", a different measure). 17.4% completed secondary is still not yet tiered.\"",
          "As above, in the case's stat tile.")
swap_text(P, "4.5.4", "body: \"Kenyans with disabilities are a substantial constituency systematically under-served by campaign communication in every cycle Low bandwidth is itself an accessibility constraint\"",
          "body: \"Kenyans with disabilities are a substantial constituency systematically under-served by campaign communication in every cycle. In Kitui, {{disability.men}}% of men and {{disability.women}}% of women aged 15 and over have a disability (2022, Tier 1). Low bandwidth is itself an accessibility constraint\"",
          "The disability rate for Kitui (p. 6).")
G = "workstreams-ground"
swap_text(G, "4.5.9", "literacy (13.0% of the population never attended school) and low bandwidth.",
          "literacy ({{edu.none.women}}% of women and {{edu.none.men}}% of men aged six and over have no education) and low bandwidth.",
          "The untiered 13.0% gives way to KDHS 2022's no-education rates by sex (p. 8).")
add(G, "4.5.9", "where Dr. Mulu's recognition deficit is largest.**\n",
    "\nThe phone side of this layer is larger than the resident rate suggests. Adults own phones at {{ict.phone.adult}}% "
    "(KDHS 2022), so about {{reach.phone.adult}} voters can receive an SMS or dial a USSD menu, against about "
    "{{reach.phone.resident}} on the resident rate (both modelled, Section 2.9.3). On its own logic that makes this layer the "
    "decisive one: it reaches roughly three voters in four.\n",
    "The adult-based reach for the offline layer (source pack 3.1).")

# ================================================================ 6.2.1 expect the scorecard's numbers
R = "risks"
add(R, "6.2.1", "```figure\nid: rapid-response-flow\n```\n",
    "\n**Expect the scorecard's numbers.** The incumbent's *Delivering the Kitui Promise* scorecard is the main attack and defence "
    "document in this race. Its headline figures ({{scorecard.claimed}} projects, {{scorecard.boreholes.drilled}} boreholes, "
    "{{scorecard.roads.graded}} km of roads graded) will come up in debates and on air. The answers are prepared from its own "
    "itemised tables: {{scorecard.itemised}} projects worth KSh {{scorecard.itemised.ksh|bn}} billion, the itemised totals by constituency in "
    "Annex B.2, and the tracker's questions in Section 4.5.1. They are put as questions, never as accusations.\n",
    "The scorecard in rapid response (source pack 4.3).")

# ================================================================ Annex B.2 and B.3
B = "annex-county"
append(B, "B.2",
    "#### The incumbent's scorecard: where the itemised money went\n\n"
    "The county's *Delivering the Kitui Promise* scorecard (August 2022 – August 2025) itemises {{scorecard.itemised}} of the "
    "{{scorecard.claimed}} projects it claims, KSh {{scorecard.itemised.ksh|bn}} billion in all. Summed from its own tables:\n\n"
    "| Constituency | Projects | KSh, itemised | KSh per registered voter (2022) |\n|---|---:|---:|---:|\n"
    + "".join(
        f"| {name} | {{{{scorecard.{cid}.projects}}}} | {{{{scorecard.{cid}.ksh|m1}}}}m | {{{{scorecard.{cid}.per-voter}}}} |\n"
        for name, cid in [("Kitui Central", "kitui-central"), ("Mwingi North", "mwingi-north"), ("Kitui South", "kitui-south"),
                          ("Mwingi Central", "mwingi-central"), ("Kitui East", "kitui-east"), ("Kitui Rural", "kitui-rural"),
                          ("Kitui West", "kitui-west"), ("Mwingi West", "mwingi-west")]
    )
    + "| Countywide or headquarters | — | {{scorecard.countywide.ksh|m1}}m | — |\n\n"
    "**How to read it, and how not to.** It covers only the {{scorecard.itemised}} itemised projects, not the county budget and not "
    "all {{scorecard.claimed}} projects (Tier 1 as a record of what the county claims, not evidence that the claims are true). Kitui "
    "Central's figure includes the county referral hospital and town works that serve the whole county: its health spend alone is "
    "KSh {{scorecard.kitui-central.health.ksh|m1}}m of the KSh {{scorecard.health.attributed.ksh|m1}}m attributed to constituencies. "
    "The pool's four constituencies receive {{scorecard.pool.share}}% of constituency-attributed spend against {{pool.share}}% of the "
    "register, so the proposal does not claim the pool was neglected. The specific gap is Mwingi West, with less than a third of "
    "Kitui Central's spend per voter and KSh {{scorecard.mwingi-west.water.ksh|m1}}m for water. The full list is "
    "[kitui-scorecard-projects.csv](/data/kitui-scorecard-projects.csv), and the tracker's questions are in Section 4.5.1.\n\n",
    "The scorecard spend table and its caveats (source pack 4.2).")
append(B, "B.3",
    "**The long rains of 2025 (NDMA, July 2025, Tier 1).** The county stays at IPC 2 (\"Stressed\") with a worsening trend, and the "
    "marginal mixed-farming zone, {{livelihood.marginal}}% of residents, was projected to fall to IPC 3 (\"Crisis\") in "
    "October–December 2025. NDMA ranks the eight sub-counties by food-insecurity severity:\n\n"
    "| Rank | Sub-county | In the pool? | Hotspot wards NDMA names |\n|---|---|---|---|\n"
    "| 1 | Mwingi North | Yes | Ngomeni, Kyuso, Tseikuru, Tharaka |\n"
    "| 2 | Kitui South | Yes | Athi, Ikutha, Kanziko/Simisi, Mutha |\n"
    "| 3 | Kitui East | No (no party flow, Section 2.7.2) | Zombe/Mwitika, Voo/Kyamatu, Endau/Malalani |\n"
    "| 4 | Mwingi Central | Yes | Nguni, Nuu |\n"
    "| 5 | Kitui West | No | Mutonguni, Kauwi |\n"
    "| 6 | Kitui Rural | No | Kanyangi |\n"
    "| 7 | Mwingi West | Yes | Kyome/Thaana, Nguutani, Kiomo/Kyethani |\n"
    "| 8 | Kitui Central | No (home base) | Mulango, Kyangwithya West |\n\n"
    "NDMA names hotspot wards in every sub-county, the home base included, so the ranking is the evidence, not hotspot status. "
    "Goats suffered CCPP (morbidity {{goats.ccpp.morbidity}}%, mortality {{goats.ccpp.mortality}}%) and PPR (morbidity "
    "{{goats.ppr.morbidity}}%, mortality {{goats.ppr.mortality}}%); most households were buying food rather than storing it, and a "
    "medium goat sold at KSh {{price.goat}} against a five-year average of {{price.goat.average}}.\n\n",
    "The July 2025 phase, projection and sub-county ranking (pp. 90, 100, 102, 120–122).")

# ================================================================ Annex A the source pack, tiered
A = "annex-evidence"
append(A, "A.1.2",
    "#### The Kitui source pack (October 2026), and how each document is tiered\n\n"
    "| Document | Publisher, date | Basis | Tier |\n|---|---|---|---|\n"
    "| County Gender Data Sheet, Kitui | County Government of Kitui with KNBS and UN Women, October 2025 | KDHS 2022, the 2019 Census, KNBS projections | Tier 1: an official compilation of official statistics |\n"
    "| Kitui County Statistical Abstract 2015 | KNBS | Administrative data for 2013–14, KDHS 2014 | Tier 1, but over ten years old: a historical baseline only |\n"
    "| Kitui County 2025 Long Rains Food and Nutrition Security Assessment | Multi-agency team led by NDMA; fieldwork July 2025 | Field transects, sector checklists, IPC analysis | Tier 1 |\n"
    "| Delivering the Kitui Promise: Three-Year Scorecard (Aug 2022 – Aug 2025) | County Government of Kitui | The executive's own account | Tier 1 as a record of what the county claims; not evidence that the claims are true |\n\n",
    "The four source-pack documents and their tiers (source pack section 1).")
print("evidence pass: done")
