"""Stage 5: Part 2, the evidence (brief 2026-10 declutter, section 9)."""
import sys, os, re
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from edit import *
from edit import _log

F = "evidence"


def bullets_of(num, start, end=None):
    """The exact text of a bullet block inside a section, from `start` to `end` (exclusive)."""
    body = section(F, num)
    i = body.index(start)
    j = body.index(end, i) if end else len(body.rstrip("\n"))
    return body[i:j].rstrip("\n")


# ---------------------------------------------------------------- 2.1
cut(F, "2.1", "To achieve absolute mathematical certainty, the campaign's success metrics are anchored strictly to the official 2022 IEBC register (Tier 1), rather than volatile digital vanity metrics:\n\n",
    kind="register", note="X10: framing ('absolute mathematical certainty'); the list it introduced follows unchanged.")
cut(F, "2.1", "The number of votes it takes, the forty wards ranked by weight, four routes to the threshold with the working shown, and the three regions the county divides into.\n\n",
    kind="signpost")
cut(F, "2.1", "The path to the Kitui County governorship is governed by strict spatial and demographic mathematics. An effective campaign cannot treat the county as a uniform political landscape; it must allocate effort, digital attention, offline SMS broadcasts, and field organizers in direct proportion to registered voter density and structural electoral leverage.\n\n",
    kind="register", note="X10: framing paragraph; the allocation rule it asserts is 3.3.1's.")
cut(F, "2.1", "This section constructs the complete electoral arithmetic of the **~{{benchmark}} vote victory threshold** from the official **40-ward IEBC voter register** (Tier 1), identifies the decisive geographic concentrations and structural coalitions, and maps the critical intersection between the candidate's recognition deficit and the county's decisive voting blocs.\n\n",
    kind="signpost")
cut(F, "2.1", "To eliminate subjective projections, the campaign's target metrics are anchored directly to official IEBC outcomes:\n\n",
    kind="register", note="X10: framing line before the list.")
lst = bullets_of("2.1", "*   **Total Registered County Voters:**", "\n\n```figure")
items = bullet_items(lst)
tiles = [
    {"value": "{{register.2022}}", "label": "registered voters, 2022", "tier": 1, "body": items[0]},
    {"value": "40", "label": "wards across 8 constituencies", "tier": 1, "body": items[1]},
    {"value": "{{register.polling-stations}}", "label": "polling stations", "tier": 1, "body": items[2]},
    {"value": "{{register.2026}}", "label": "registered, July 2026", "tier": 3, "body": items[3]},
    {"value": "{{benchmark}}", "label": "the winning benchmark", "body": items[4]},
    {"value": "{{turnout.2022}}%", "label": "turnout, 2022", "tier": 1, "body": items[5]},
]
swap(F, "2.1", lst, visual("stats", [{k: (oneline(v) if isinstance(v, str) else v) for k, v in t.items()} for t in tiles]))
cut(F, "2.1", "*   **Total Registered Electorate (2022, Tier 1):** **{{register.2022}} voters** across **40 County Assembly\n    Wards** (plus **75 prison voters**, totalling **{{register.2022.with-prisons}} registered voters**).\n",
    kind="duplicate", home="evidence:2.1", note="The 2022 register, stated in the first list (now the register tile).")
lead(F, "2.1",
     "Governor Julius Malombe's certified 2022 winning total was {{result.2022.gov.malombe}} votes; this document rounds it to "
     "**{{benchmark}}**. [CALC, not a forecast] Held against the July 2026 register, the number to win is "
     "≈{{benchmark}}–{{benchmark.2026-equivalent.rounded}}.")

# ---------------------------------------------------------------- 2.2
lead(F, "2.2",
     "Julius Malombe won 2022 with **{{result.2022.gov.malombe}} votes** on a certified turnout of **{{turnout.2022}}%** "
     "(Tier 1, IEBC Form 37C); Charity Ngilu won 2017 with **{{result.2017.gov.ngilu}} votes** (Tier 1).")

# ---------------------------------------------------------------- 2.3
cut(F, "2.3", "exhibits extreme density clustering", kind="register", new="exhibits density clustering", note="X10: intensifier.")
insights = bullets_of("2.3", "#### Critical Concentration Insights:")
nums = bullet_items(insights.split("\n", 1)[1])
swap(F, "2.3", insights, visual("stats", [
    {"value": "{{pareto.top12.share}}%", "label": "of the register in the 12 largest wards", "tier": 1, "body": oneline(nums[0])},
    {"value": "{{pareto.top20.share}}%", "label": "in the largest 20", "tier": 1, "body": oneline(nums[1])},
    {"value": "{{pareto.bottom10.share}}%", "label": "in the smallest 10", "tier": 1, "body": oneline(nums[2])},
], title="Critical Concentration Insights"))

# ---------------------------------------------------------------- 2.3.1
lead(F, "2.3.1",
     "Mwingi North, Mwingi West and Mwingi Central together command {{bloc.mwingi}} registered voters (Tier 1), roughly "
     "{{path.a.ballots}} ballots at the certified turnout. Mwingi is therefore **necessary and not sufficient**: no path "
     "to {{benchmark}} runs around it, and none ends there.")

# ---------------------------------------------------------------- 2.4
lead(F, "2.4", "**No route clears {{benchmark}} on its own ballots.** A route is where the margin is built, not where the whole number lives.")

# ---------------------------------------------------------------- 2.5.1
lead(F, "2.5.1",
     "The Wiper decision is expected in the final quarter of 2026, late October to November on the reported timetable: "
     "**a Tier 3, single-source report, not a confirmed party decision.** The 2022 precedent was selected delegates and "
     "panels (Tier 1, Kenya Law).")

# ---------------------------------------------------------------- 2.5.2
conf = bullets_of("2.5.2", "To transition this selection mechanism")
title, rest = conf.split("\n", 1)
steps = bullet_items(rest)
second_head, second_rest = split_clause(re.sub(r"^\*\*(.+?)\*\* — ", r"**\1** — ", oneline(steps[1])), limit=14)
swap(F, "2.5.2", conf, visual("checklist", [
    {"label": oneline(steps[0])},
    {"label": "**The party's nomination rules and timetable for 2027**",
     "body": oneline(steps[1]).replace("**The party's nomination rules and timetable for 2027** — ", "")},
], title=title.rstrip(":").replace("**", "")))

# ---------------------------------------------------------------- 2.6.1
c6 = ("Her public criticism of the incumbent's equal-ward funding allocation is a live policy argument, and one where the campaign's own position needs settling first: Section 3.2.2 currently proposes an equal-ward guarantee of its own. "
      "The two positions cannot both be run. Either the equal-ward guarantee is the platform, and this line of argument is not available to the campaign, or the argument is made and the guarantee is restated as a needs-weighted formula. "
      "**Firefly's recommendation is the second, because a published allocation methodology is the stronger fit with the verification pillar in Section 3.2.1 — but it is the campaign's policy call.** [CONFLICT C6: see open items]")
cut(F, "2.6.1",
    "*   **The incumbent cannot stand.** Governor Julius Malombe won the 2022 race on the Wiper ticket (Tier 1, Section 2.2) after a first term from 2013 to 2017. Article 180(7) of the Constitution limits a governor to two terms (Tier 1), and he is serving his second, so the 2027 Wiper nomination is for an open seat (Section 2.6.3). ",
    kind="duplicate", home="evidence:2.6.3|evidence:2.6.2|evidence:2.2",
    new="*   ", note="The term limit, said once at 2.6.3 (section 6). Its last sentence, on the party's 2027 nomination list, stays.")
field = bullets_of("2.6.1", "*   **Dr. Irene Kasalu")
cards = []
for item in bullet_items(field):
    t = oneline(item)
    m = re.match(r"^\*\*(.+?) \((.+?)\):\*\*\s*([\s\S]*)$", t)
    if not m:
        cards.append({"title": "Stage One", "text": t})
        continue
    name, office, body = m.groups()
    card = {"title": name, "text": office}
    if c6 in body:
        body = body.replace(" " + c6, "")
    card["body"] = body
    cards.append(card)
cards[0]["value"] = "{{result.2022.womanrep.kasalu}}"
cards[0]["tier"] = 2
cards[1]["value"] = "{{result.2022.senate.wambua}}"
cards[1]["tier"] = 2
cards[2]["value"] = "{{result.2022.mp.mulu}}"
cards[2]["tier"] = 1
policy = visual("cards", [{"title": "The two positions cannot both be run.",
                           "text": "**Firefly's recommendation is the second, because a published allocation methodology is the stronger fit with the verification pillar in Section 3.2.1 — but it is the campaign's policy call.** [CONFLICT C6: see open items]",
                           "body": "Her public criticism of the incumbent's equal-ward funding allocation is a live policy argument, and one where the campaign's own position needs settling first: Section 3.2.2 currently proposes an equal-ward guarantee of its own. Either the equal-ward guarantee is the platform, and this line of argument is not available to the campaign, or the argument is made and the guarantee is restated as a needs-weighted formula."}],
                preset="policy")
stage_one = cards.pop()  # "The party's 2027 nomination list is the document that settles who contests Stage One."
swap(F, "2.6.1", field, visual("cards", cards, preset="candidate") + "\n\n" + policy + "\n\n" + stage_one["text"])

# ---------------------------------------------------------------- 2.6.2
move(F, "2.6.2",
     "The Auditor-General's and Controller of Budget's reports on the county executive are the documentary record of his administration (Annex B.2). ",
     F, "2.6.3", "He is serving his second, so he cannot stand in 2027, and this proposal plans for an open-seat election throughout.",
     note="A detail the term-limit home lacked moves there before the Malombe bullet is cut (section 6).")
cut(F, "2.6.2",
    "\n*   **Julius Malombe (Incumbent Governor, Kitui County):** Won the 2022 general election with {{result.2022.gov.malombe}} votes (Tier 1, IEBC Form 37C) after serving a first term from 2013–2017. He is not in the 2027 field: Article 180(7) of the Constitution limits a governor to two terms, and he has served two. The race is for an open seat (Section 2.6.3), and his record is the one every candidate in it will be measured against.",
    kind="duplicate", home="evidence:2.6.3|evidence:2.2|evidence:2.6.2",
    note="The term limit, said once at 2.6.3; his 2022 total is 2.2's.")
field = bullets_of("2.6.2", "*   **Charity Ngilu")
cards = []
for item in bullet_items(field):
    m = re.match(r"^\*\*(.+?) \((.+?)\):\*\*\s*([\s\S]*)$", oneline(item))
    name, office, body = m.groups()
    cards.append({"title": name, "text": office, "body": body})
cards[0].update({"value": "{{result.2017.gov.ngilu}}", "tier": 1})
cards[1].update({"value": "{{result.2022.gov.musila}}", "tier": 1})
swap(F, "2.6.2", field, visual("cards", cards, preset="candidate"))

# ---------------------------------------------------------------- 2.6.3
lead(F, "2.6.3",
     "Article 180(7) of the Constitution of Kenya limits a governor to two terms (Tier 1). Governor Malombe is serving his "
     "second, so he cannot stand in 2027.")
replace(F, "2.6.3", "*   **What would change it:**", "<!-- keep -->\n*   **What would change it:**")

# ---------------------------------------------------------------- 2.6.4
lead(F, "2.6.4",
     "The strategic implication is not to compete for the same countywide presence but to **compete on a dimension she is "
     "not occupying**: verifiable fiscal and delivery competence.")

# ---------------------------------------------------------------- 2.7
cut(F, "2.7", "To formulate a targeted intervention, the campaign maps Dr. Mulu's structural profile against the county's voter geography.\n",
    kind="signpost")

# ---------------------------------------------------------------- 2.7.1
pool = "*   `Deficit Pool (Mwingi + South) = {{bloc.mwingi}} (Mwingi) + {{con.kitui-south}} (Kitui South) = {{pool}} registered voters`"
swap(F, "2.7.1", pool, visual("stats", [
    {"value": "{{pool}}", "label": "registered voters in the pool", "tier": 1, "body": pool.replace("*   ", "")},
    {"value": "{{pareto.top12.in-pool.voters}}", "label": "in the five of the twelve largest wards that lie in it", "tier": 1},
], title="Total Decisive Deficit Pool"))
replace(F, "2.7.1", "#### Total Decisive Deficit Pool:\n", "")
_log({"file": F, "section": "2.7.1", "first12": "Total Decisive Deficit Pool:", "words": 0, "kind": "signpost",
      "home": "", "note": "The h4 label became the stat rail's title (moved, not cut).", "text": "#### Total Decisive Deficit Pool:"})
lead(F, "2.7.1",
     "**Five of the twelve largest wards lie where he has never held office.** The pool is {{pool.share}}% of the entire "
     "Kitui County voter register. The pool is structural: it is derived from where he has held office, not from any "
     "measure of opinion.")

# ---------------------------------------------------------------- 2.7.2
lead(F, "2.7.2",
     "**Kitui Central will be fighting its own contest.** **Two constituencies will not carry party flow:** Kitui East "
     "returned a UDA MP and Kitui South a Jubilee MP in 2022 (Tier 3, constituency records).")

# ---------------------------------------------------------------- 2.8.1
people = bullets_of("2.8.1", "*   **Demographic Base:**", "\n\n```figure")
p = [oneline(x) for x in bullet_items(people)]
swap(F, "2.8.1", people, visual("stats", [
    {"value": "{{census.population}}", "label": "people, 2019 census", "tier": 1, "body": p[0]},
    {"value": "{{census.households}}", "label": "households", "tier": 1, "body": p[1]},
    {"value": "{{census.area}} km²", "label": "Kenya's sixth-largest county", "tier": 1, "body": p[2]},
    {"value": "{{census.rural.share}}%", "label": "rural", "tier": 1, "body": p[3]},
    {"value": "{{poverty.2021}}%", "label": "in poverty, 2021", "tier": 1, "body": p[4]},
    {"value": "over 90%", "label": "of households keep poultry", "tier": 1, "body": p[5]},
]))
hazard = bullets_of("2.8.1", "#### Natural Hazards and NDMA Early-Warning Context:")
para = hazard.split("\n", 1)[1]
swap(F, "2.8.1", hazard, visual("timeline", [
    {"when": "September 2025", "label": "IPC Phase 2 (\"Stressed\")", "tier": 1},
    {"when": "January 2026", "label": "NDMA drought status: Alert Phase", "tier": 1},
    {"when": "March 2026", "label": "National flooding", "tier": 2},
], title="Natural Hazards and NDMA Early-Warning Context", extra="body: " + q(para.strip())))

# ---------------------------------------------------------------- 2.8.2
comp = bullets_of("2.8.2", "*   **Agriculture and Water Infrastructure:**", "\n\n#### Sourced Revenue")
swap(F, "2.8.2", comp, visual("checklist", [
    {"label": labelled(x)[0], "text": labelled(x)[1]} for x in bullet_items(comp)
]))
lead(F, "2.8.2",
     "According to the approved Kitui County Fiscal Strategy Paper for FY2026/27, the total projected resource envelope "
     "is **KSh 13.79 billion**; the total itself is cited through secondary reporting of the Paper (Tier 3) until the "
     "Paper is cited directly.")

# ---------------------------------------------------------------- 2.8.3
zones = section(F, "2.8.3")
z_start = zones.index("#### The urban and central anchor")
z_text = zones[z_start:].rstrip("\n")
parts = re.split(r"\n(?=#### )", z_text)
tabs = []
note_text = None
for part in parts:
    head, body = part.split("\n", 1)
    body = body.strip()
    m = re.search(r"\*\*A note on the names in this table\.\*\*[\s\S]*?demographic context only\.", body)
    if m:
        note_text = m.group(0)
        body = (body[: m.start()] + body[m.end():]).strip()
        body = re.sub(r"\n{3,}", "\n\n", body)
    tabs.append({"title": head.replace("#### ", ""), "body": body})
spec = visual("tabs", tabs, preset="zone", extra="body: " + q(note_text))
swap(F, "2.8.3", z_text, spec)

# ---------------------------------------------------------------- 2.9.1
cut(F, "2.9.1", "To maintain absolute data integrity, the campaign anchors on current Communications Authority and KNBS 2023/24 data as ground truth, while tracking the historical 2019 census:\n\n",
    kind="register", note="X10: framing; the sources it names are cited in the paragraph and table that follow.")
conn = bullets_of("2.9.1", "According to the **2023/24 Kenya Continuous Household Survey", "\n\n| Connectivity Metric")
agents = bullets_of("2.9.1", "The **{{ict.agents}} mobile-money agent network**", "\n\n#### Platform Sizing")
swap(F, "2.9.1", agents + "\n\n", "")
swap(F, "2.9.1", conn, visual("stats", [
    {"value": "{{ict.internet}}%", "label": "use the internet", "tier": 1},
    {"value": "{{ict.offline}}%", "label": "of residents offline", "tier": 1},
    {"value": "{{ict.phone}}%", "label": "own a mobile phone", "tier": 1},
    {"value": "{{ict.agents}}", "label": "mobile-money agents", "tier": 1, "body": agents},
], title="The Defining Digital and Telecommunications Constraints (CA/KNBS Sourced)", extra="body: " + q(conn)))
replace(F, "2.9.1", "#### The Defining Digital and Telecommunications Constraints (CA/KNBS Sourced):\n", "")
_log({"file": F, "section": "2.9.1", "first12": "The Defining Digital and Telecommunications Constraints (CA/KNBS Sourced):", "words": 0, "kind": "signpost",
      "home": "", "note": "The h4 label became the stat rail's title (moved, not cut).", "text": "#### The Defining Digital and Telecommunications Constraints (CA/KNBS Sourced):"})

# ---------------------------------------------------------------- 2.9.2
own = bullets_of("2.9.2", "*   **Two stations are associated with Charity Ngilu**")
swap(F, "2.9.2", own, visual("checklist", [
    {"label": m.group(1), "text": m.group(2)}
    for m in [re.match(r"^(\*\*.+?\*\*[^.:]*[.:]?)\s*([\s\S]*)$", oneline(x)) for x in bullet_items(own)]
], title="The three structural facts that drive the rest of this section"))
replace(F, "2.9.2", "The three structural facts that drive the rest of this section:\n\n", "")
lead(F, "2.9.2",
     "**The highest-reach commercial radio stations broadcasting in Kikamba are owned, financed, or editorially steered "
     "by active political rivals or entrenched party gatekeepers.** The ownership map and posture for every station are "
     "set out once, in **Section 4.5.6**.")

# ---------------------------------------------------------------- 2.9.3
cut(F, "2.9.3", "What digital reach can and cannot deliver against the winning number, the infrastructure that reaches the offline majority, and who controls the Kamba-language airwaves.\n\n",
    kind="signpost")
cut(F, "2.9.3", "Winning Kitui County requires building a communication strategy aligned with empirical reality rather than digital wishful thinking. \n\n",
    kind="register", note="X10: framing sentence.")
can = bullets_of("2.9.3", "#### What digital can do", "\n\n#### What digital cannot do")
cannot = bullets_of("2.9.3", "#### What digital cannot do")
def side(block):
    head, rest = block.split("\n", 1)
    items = []
    for x in bullet_items(rest):
        m = re.match(r"^\*\*(.+?):\*\*\s*([\s\S]*)$", oneline(x))
        items.append({"label": m.group(1), "body": m.group(2)})
    return head.replace("#### ", ""), items
lt, li = side(can)
rt, ri = side(cannot)
spec = "kind: contrast\nleft:\n  title: " + q(lt) + "\n  items:\n" + yaml_items(li, "    ") + "\nright:\n  title: " + q(rt) + "\n  items:\n" + yaml_items(ri, "    ")
swap(F, "2.9.3", can + "\n\n" + cannot, fence("visual", spec))
lead(F, "2.9.3",
     "If the campaign reached 100% of every internet-connected voter in Kitui County, it would reach about "
     "**{{reach.smartphone}} voters** (modelled), and even if every one of them voted for him he would be "
     "**{{reach.smartphone.short}} votes short** of the {{benchmark}} benchmark.")

# ---------------------------------------------------------------- 2.9.4
cut(F, "2.9.4", " Bulk political SMS is restricted to English or Kiswahili (Section 4.5.9); the Kikamba version travels by voice note and radio.",
    kind="duplicate", home="workstreams-ground:4.5.9", note="Kikamba is not permitted on the bulk SMS rail: said once at 4.5.9 (section 6).")
offline = section(F, "2.9.4")
o_start = offline.index("#### Kikamba Vernacular Radio")
o_text = offline[o_start:].rstrip("\n")
channels = re.split(r"\n\n(?=#### )", o_text)
cards = []
week = None
for ch in channels:
    head, rest = ch.split("\n", 1)
    fields = []
    reach = None
    for item in bullet_items(rest):
        lab, txt = labelled(item.split("\n")[0])
        sub = "\n".join(item.split("\n")[1:]).strip()
        full = (txt + ("\n" + sub if sub else "")).strip()
        if lab == "Reach":
            reach = oneline(full)
        elif lab == "Market Rotation Map":
            week = sub
        else:
            fields.append({"label": lab, "text": full})
    m = re.match(r"^\*\*What the campaign would run\*\* \((.+?)\)$", "")
    card = {"title": head.replace("#### ", "")}
    if reach:
        card["head"] = {"label": "Reach", "text": reach}
    card["fields"] = fields
    cards.append(card)
# "What Firefly operates" and "What the campaign would run" are bold labels with a trailing note, not "**Label:**".
for c in cards:
    for f in c["fields"]:
        pass
days = []
for line in week.split("\n"):
    m = re.match(r"^\s*\*\s+\*(\w+):\*\s*(.+)$", line)
    days.append({"day": m.group(1), "items": [{"label": x.strip().rstrip(".")} for x in re.split(r",\s(?![^()]*\))", m.group(2))]})
week_spec = "kind: week\ntitle: " + q("Market Rotation Map") + "\nitems:\n"
for d in days:
    week_spec += "  - day: " + q(d["day"]) + "\n    items:\n" + "\n".join("      - { label: " + q(x["label"]) + " }" for x in d["items"]) + "\n"
swap(F, "2.9.4", o_text, visual("cards", cards, preset="channel") + "\n\n" + fence("visual", week_spec))
lead(F, "2.9.4",
     "The election will be won or lost across the **{{reach.offline}} registered voters not reachable online** "
     "(modelled: the July 2026 register less the {{reach.smartphone}} reachable by smartphone or data).")

# ---------------------------------------------------------------- 2.10.1
cut(F, "2.10.1", "**Forensic Assets for Systematic Digital Projection:**\n\n", kind="register",
    note="X10: inflated label over the asset table; the table follows unchanged.")
replace(F, "2.10.1", "| Asset | Sourced Empirical Evidence |", "<!-- keep -->\n| Asset | Sourced Empirical Evidence |")
lead(F, "2.10.1",
     "Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS, has represented Kitui Central in the National Assembly since 2013 "
     "(Tier 1). He is a member of the Budget and Appropriations Committee (Tier 1), the committee that scrutinises the "
     "national estimates.")

# ---------------------------------------------------------------- 2.10.3
aud = bullets_of("2.10.3", "#### What the audit produces", "\n\nEach is drawn from the Week 1 export")
head, rest = aud.split("\n", 1)
intro, lst = rest.strip().split("\n\n", 1)
outs = []
for x in bullet_items(lst):
    m = re.match(r"^\*\*(.+?)\*\* — ([\s\S]*)$", oneline(x))
    outs.append({"title": m.group(1), "text": m.group(2), "badge": "set in Week 1"})
swap(F, "2.10.3", aud, visual("cards", outs, title=head.replace("#### ", ""), note=intro, preset="audit"))

# ---------------------------------------------------------------- 2.12
hyp = section(F, "2.12")
h_end = hyp.index("```figure")
paras = [p.strip() for p in hyp[:h_end].strip().split("\n\n")]
get = lambda label: oneline(next(p for p in paras if p.startswith(f"**{label}**"))[len(label) + 4:])
spec = ("kind: hypothesis\nhypothesis: " + q(get("The hypothesis.")) + "\nfor: " + q(get("What supports it.")) +
        "\nagainst: " + q(get("What counts against it.")) + "\ntest: " + q(get("The test.")))
swap(F, "2.12", hyp[:h_end].strip(), fence("visual", spec))
print("evidence: done")

# The four bold labels in 2.12 are the hypothesis card's panel titles now ("Hypothesis", "Evidence for",
# "Evidence against", "The test"): layout, logged so the word count balances.
_log({"file": F, "section": "2.12", "first12": "The hypothesis. What supports it. What counts against it. The test.",
      "words": 11, "kind": "signpost", "home": "",
      "note": "The four bold labels became the hypothesis card's four panel titles.",
      "text": "**The hypothesis.** **What supports it.** **What counts against it.** **The test.**"})
