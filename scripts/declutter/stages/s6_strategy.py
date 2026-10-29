"""Stage 6: Part 3, the strategy (brief 2026-10 declutter, section 9)."""
import sys, os, re
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from edit import *
from edit import _log

F = "strategy"


def block(num, start, end=None):
    body = section(F, num)
    i = body.index(start)
    j = body.index(end, i) if end else len(body.rstrip("\n"))
    return body[i:j].rstrip("\n")


# ---------------------------------------------------------------- 3.1
cut(F, "3.1", " turns standard political promotion on its head:", kind="register", new=":",
    note="X10: rhetorical framing.")
cut(F, "3.1", "**The asset no rival holds.** Forensic analysis of Dr. Mulu's record identifies a highly powerful, under-utilized asset. ",
    kind="register", note="X10: inflated framing. The credentials that follow stay in the full text, because they name 'strategic planning', which his record's home (2.10.1) does not.")
lead(F, "3.1",
     "**Dr. Makali Mulu is the Economist Governor Kitui needs**: an expert economist who can show his working, and a "
     "specialist in **verifying whether public expenditure yields tangible developmental returns**.")

# ---------------------------------------------------------------- 3.1.1
lead(F, "3.1.1",
     "Dr. Mulu's technocratic and delivery credentials are backed by verified, empirical milestones (Tier 1); his record is "
     "set out once, in Section 2.10.1.")

# ---------------------------------------------------------------- 3.1.2
fin = block("3.1.2", "1.  **KSh {{audit.cash}}**", "\n\nFurthermore")
rows = bullet_items(fin)
bars = []
for r in rows:
    m = re.match(r"^\*\*KSh (\{\{[^}]+\}\})\*\* in (.+?) \(Tier 1\)\.$", oneline(r))
    bars.append({"label": m.group(2), "value": f"KSh {m.group(1)}", "tier": 1})
swap(F, "3.1.2", fin, visual("bars", bars,
     source="Office of the Auditor-General, Kitui County FY2023/24 audit report (Tier 1)"))
lead(F, "3.1.2",
     "**Kitui has ample developmental resources; what it lacks is disciplined, accountable deployment.** The county's "
     "primary developmental obstacle is not a lack of funding, but a lack of fiscal discipline, project oversight, and "
     "structural monitoring and evaluation.")

# ---------------------------------------------------------------- 3.1.3
qa = block("3.1.3", "*   **The Rival Attack:**")
items = bullet_items(qa)
attack = labelled(items[0])[1]
rebut = labelled(items[1])[1]
first, rest = rebut.split(" ", 1)[0], rebut
sents = re.split(r"(?<=[.;])\s+", oneline(rebut))
pivot = sents[0]
answer = " ".join(sents[1:3])
body = " ".join([pivot] + sents[3:])
swap(F, "3.1.3", qa, fence("visual", "kind: qa\nattack: " + q(oneline(attack)) + "\nanswer: " + q(answer) + "\nbody: " + q(body)))
_log({"file": F, "section": "3.1.3", "first12": "The Rival Attack: / The Clinical Rebuttal:", "words": 5, "kind": "signpost", "home": "",
      "note": "The two bold labels became the attack-and-answer card's panel titles.", "text": "**The Rival Attack:** **The Clinical Rebuttal:**"})
cut(F, "3.1.3", "The campaign will aggressively pivot this attack into a powerful, reinforcing asset.", kind="register",
    new="The campaign will pivot this attack into a reinforcing asset.", note="X10: intensifiers.")

# ---------------------------------------------------------------- 3.2
cross = ("kind: crosswalk\n"
         "title: " + q("Four campaign pillars, and the groupings that carry them") + "\n"
         "columns: [" + ", ".join(q(c) for c in ["Grouping", "How many", "What it is", "Set out in"]) + "]\n"
         "rows:\n" +
         "\n".join("  - cells: [" + ", ".join(q(c) for c in r) + "]" for r in [
             ["Campaign pillars", "4", "the campaign's pillars", "3.2.1"],
             ["Message pillars", "3", "how the claim is argued to a voter", "3.2.2"],
             ["Production pillars, P1 to P4", "4", "the ones the weekly brief actually commissions against", "3.2.3"],
             ["Content buckets, A to D", "4", "the thematic buckets the message grids in Annex C index against", "3.2.3"],
             ["Campaign themes", "6", "each evidenced", "3.2.4"],
         ]) + "\n"
         "note: " + q("Each maps back to the four campaign pillars. Which message pillar carries which campaign pillar is stated in 3.2.2; whether to reduce the groupings is a strategy decision for the campaign, and none is merged or renamed here."))
replace(F, "3.2", "four below.\n", "four below.\n\n" + fence("visual", cross) + "\n")
lead(F, "3.2",
     "**These four are the campaign's pillars.** Three other groupings appear elsewhere and are deliberately different "
     "things, not competing versions of this one.")

# ---------------------------------------------------------------- 3.2.1
pil = block("3.2.1", "* **Fiscal accountability and devolution:**", "\n\n---")
cards = []
for x in bullet_items(pil):
    lab, txt = labelled(x)
    head, rest = split_clause(txt, limit=30)
    cards.append({"title": lab, "text": head or txt, "body": rest} if head else {"title": lab, "body": txt})
swap(F, "3.2.1", pil, visual("cards", cards, preset="pillar"))
lead(F, "3.2.1",
     "**\"The mission is for Kitui to prosper. From Poverty to Wealth Creation.\"** That is Dr. Mulu's own cover line, and "
     "it is the frame these four pillars argue.")

# ---------------------------------------------------------------- 3.2.2
mp = section(F, "3.2.2")
mp_end = mp.index("> **What the two flagship commitments")
mp3_start = mp.index("#### Message Pillar 3")
mp3_end = mp.index("> **Message assignment by segment")
def pillar_card(text):
    head, rest = text.split("\n", 1)
    title = head.replace("#### ", "")
    fields = []
    statement = None
    for item in bullet_items(rest.strip()):
        first_line = item.split("\n")[0]
        lab_m = re.match(r"^\*\*(.+?)\*\*(.*?):\s*([\s\S]*)$", oneline(first_line))
        sub = item.split("\n")[1:]
        if lab_m and lab_m.group(1).startswith("Narrative Statement"):
            statement = {"label": ("Narrative Statement" + lab_m.group(2)).strip(), "text": lab_m.group(3)}
            continue
        if sub:
            label = labelled(first_line)[0] or oneline(first_line).rstrip(":")
            for s in bullet_items("\n".join(l[4:] if l.startswith("    ") else l for l in sub)):
                lab2, txt2 = labelled(s)
                fields.append({"label": lab2, "text": oneline(txt2)})
        else:
            lab2, txt2 = labelled(item)
            fields.append({"label": lab2, "text": oneline(txt2)})
    card = {"title": title, "head": statement, "fields": fields}
    if any("awaiting" in f["label"] for f in fields):
        card["badge"] = "sources pending"
    return card
p1 = mp[mp.index("#### Message Pillar 1"):mp.index("#### Message Pillar 2")].strip()
p2 = mp[mp.index("#### Message Pillar 2"):mp_end].strip()
p3 = mp[mp3_start:mp3_end].strip()
envelope = mp[mp_end:mp3_start].strip()
cards = [pillar_card(p1), pillar_card(p2), pillar_card(p3)]
env_body = "\n".join(l[2:] if l.startswith("> ") else l.lstrip(">") for l in envelope.split("\n"))
env_title, env_rest = env_body.split("\n", 1)
bars = visual("bars", [
    {"label": "A Ward Development Equalization Fund at KSh {{policy.ward-fund|m}} million across 40 wards", "value": "29%"},
    {"label": "Both flagship commitments together, on the bridge case", "value": "44%"},
], title=env_title.strip("*"), note="Share of the KSh 13.79 billion envelope in Section 2.8.2. Envelope arithmetic, not a full sizing.",
   extra="body: " + q(env_rest.strip()))
new = visual("cards", cards, preset="message") + "\n\n" + bars + "\n\n"
replace(F, "3.2.2", mp[mp.index("#### Message Pillar 1"):mp3_end], new)

# ---------------------------------------------------------------- 3.2.3
pp = section(F, "3.2.3")
pstart = pp.index("#### Pillar 1 — Where the money went")
pend = pp.index("**The engine is the loop")
prod = pp[pstart:pend].rstrip("\n")
rows = []
for part in re.split(r"\n\n(?=#### Pillar)", prod):
    head, rest = part.split("\n", 1)
    f = {labelled(x)[0]: oneline(labelled(x)[1]) for x in bullet_items(rest.strip())}
    rows.append({"cells": [head.replace("#### ", ""), f["Segment"], f["Language"], f["Channel"], f["Format"]], "body": "**Why it exists:** " + f["Why it exists"]})
matrix = ("kind: matrix\ncolumns: [" + ", ".join(q(c) for c in ["Production pillar", "Segment", "Language", "Channel", "Format"]) + "]\nrows:\n" +
          "\n".join("  - cells: [" + ", ".join(q(c) for c in r["cells"]) + "]\n    body: " + q(r["body"]) for r in rows))
replace(F, "3.2.3", prod, fence("visual", matrix))
_log({"file": F, "section": "3.2.3", "first12": "Segment: Language: Channel: Format: (x4)", "words": 16, "kind": "signpost", "home": "",
      "note": "The four repeated field labels became the matrix's column heads.", "text": "**Segment:** **Language:** **Channel:** **Format:** ×4"})
bk = section(F, "3.2.3")
bstart = bk.index("1.  **Pillar A:")
buckets = bk[bstart:].rstrip("\n")
cards = []
for item in bullet_items(buckets):
    lines = item.split("\n")
    title = lines[0].strip().strip("*")
    f = {}
    for s in bullet_items("\n".join(l.strip() for l in lines[1:])):
        m = re.match(r"^\*(.+?):\*\s*([\s\S]*)$", oneline(s))
        f[m.group(1)] = m.group(2)
    cards.append({"title": title, "head": {"label": "Core Theme", "text": f["Core Theme"]},
                  "text": "*Primary Formats:* " + f["Primary Formats"], "fields": [{"label": "Tone", "text": f["Tone"]}]})
replace(F, "3.2.3", buckets, visual("cards", cards, preset="bucket"))
lead(F, "3.2.3",
     "**The engine is the loop between pillar four and pillar one**: a commitment with no date is not logged, and twelve "
     "weeks later that commitment and that date become a Pillar 1 post.")

# ---------------------------------------------------------------- 3.2.4
th = section(F, "3.2.4")
tstart = th.index("1. **Water Security")
tend = th.index("\n\nUnderlying narrative throughout")
themes = th[tstart:tend]
cards = []
headlines = {
    1: ("**Kitui has the lowest share of any county in Kenya with at least a basic\ndrinking-water service — 21%** (KNBS, Kenya Demographic and Health Survey 2022, Tier 1).", None),
}
for item in bullet_items(themes):
    m = re.match(r"^\*\*(.+?)\*\* — ([\s\S]*?)\n\*\*Evidence:\*\* ([\s\S]*)$", item)
    title, desc, evidence = m.group(1), oneline(m.group(2)), m.group(3)
    card = {"title": title, "text": desc}
    ev = oneline(evidence)
    if title.startswith("Water"):
        w = ev.index("**Why this is the strongest theme in the document:**")
        head = ev[: ev.index("Nairobi,")].strip()
        card["head"] = {"label": "Evidence", "text": head}
        card["fields"] = [{"label": "Evidence, continued", "text": ev[ev.index("Nairobi,"):w].strip()},
                          {"label": "Why this is the strongest theme in the document", "text": ev[w + len("**Why this is the strongest theme in the document:**"):].strip()}]
    else:
        first_sentence = re.split(r"(?<=\))[.;]\s|(?<=[a-z%])\.\s", ev)[0]
        rest = ev[len(first_sentence):].lstrip(".; ").strip()
        card["head"] = {"label": "Evidence", "text": first_sentence.rstrip(".") + "."}
        if rest:
            card["fields"] = [{"label": "Evidence, continued", "text": rest}]
    if "not yet tiered" in ev:
        card["badge"] = "not yet tiered"
    cards.append(card)
replace(F, "3.2.4", themes, visual("cards", cards, preset="theme"))
lead(F, "3.2.4", "Six themes, each evidenced. **Every figure below carries the tier it was established at, and where it was established.**")

# ---------------------------------------------------------------- 3.3.1
w = block("3.3.1", "*   **{{effort.digital.pool}}%", "\n\nEffort and content allocation")
ws = bullet_items(w)
stats = visual("stats", [
    {"value": "{{effort.digital.pool}}%", "label": "of Phase −1 digital reach effort, in the pool", "body": oneline(ws[0])},
    {"value": "{{effort.sms.pool}}%", "label": "of SMS/USSD onboarding, in the pool's 21 wards", "body": oneline(ws[1])},
])
replace(F, "3.3.1", "\n".join(w.split("\n")[: w.split("\n").index(next(l for l in w.split("\n") if l.startswith("*   The \"Economist")))]),
        stats + "\n")
lead(F, "3.3.1",
     "Because **{{pool.share}}% of the county register sits where he has never held office** (Section 2.7), output and "
     "targeting are weighted accordingly.")
replace(F, "3.3.1", "**Coverage note.**", "```lead\n**Until the six are assigned, the Phase −1 weighting governs only the three zones, and the six unassigned sub-counties receive the rotating share alone.** Assigning them is a Week 2 task for the strategy lead.\n```\n\n**Coverage note.**")

# ---------------------------------------------------------------- 3.3.2
cut(F, "3.3.2", "A common failure mode in modern Kenyan political campaigns is over-weighting flashy social\nmedia influencers while starving the unglamorous rural infrastructure that actually produces\nvotes.\n\n",
    kind="register", note="X10: framing paragraph.")
off = "| Communications weight, offline | **{{channel.offline.rebalanced}}%** — radio {{channel.radio.rebalanced}}%, SMS {{channel.sms.rebalanced}}%, caravans {{channel.markets.rebalanced}}%, church {{channel.church.rebalanced}}% |\n"
dig = "| Communications weight, digital | **{{channel.digital.rebalanced}}%** |\n"
replace(F, "3.3.2", off + dig, "")
donut = visual("donut", [
    {"label": "Communications weight, offline", "value": "{{channel.offline.rebalanced}}%",
     "body": "radio {{channel.radio.rebalanced}}%, SMS {{channel.sms.rebalanced}}%, caravans {{channel.markets.rebalanced}}%, church {{channel.church.rebalanced}}%"},
    {"label": "Communications weight, digital", "value": "{{channel.digital.rebalanced}}%"},
])
replace(F, "3.3.2", "```figure\nid: fig-4-6-channel-shift\n```\n", "```figure\nid: fig-4-6-channel-shift\n```\n\n" + donut + "\n")
lead(F, "3.3.2",
     "The rebalancing target is the share of communications effort each domain should carry: "
     "{{channel.offline.rebalanced}}% offline and {{channel.digital.rebalanced}}% digital, re-read at each monthly review.")

# ---------------------------------------------------------------- 3.3.3
hz = block("3.3.3", "1.  **Editorial Blackouts")
cards = []
for x in bullet_items(hz):
    lab, txt = labelled(x)
    cards.append({"title": lab, "text": oneline(txt)})
swap(F, "3.3.3", hz, visual("cards", cards, preset="hazard"))

# ---------------------------------------------------------------- 3.4
cut(F, "3.4", "Electoral conversion in Kitui County requires disaggregating the {{register.2022}} registered voters into distinct, behavioral, and demographic segments grounded in official data from the **2019 Kenya National Bureau of Statistics (KNBS) Census**, the **Independent Electoral and Boundaries Commission (IEBC)**, and the **Communications Authority of Kenya (CA)** (Tier 1).\n\n",
    kind="register", note="Framing paragraph (plan 3.4); each segment names its own source.")
cut(F, "3.4", "A generic countywide message fails because an offline smallholder farmer in Tseikuru evaluating drought mitigation has entirely different information channels, daily anxieties, and economic incentives than an urban bodaboda operator in Kitui Township or a diaspora professional remitting money from Nairobi.\n\n",
    kind="register", note="Framing paragraph (plan 3.4): 'one countywide message fails' stays as the section's opening line.")
cut(F, "3.4", "This section defines the structural architecture of the Kitui electorate across six empirical dimensions: **Rural/Urban Split**, **Youth Cohort**, **Connectivity Infrastructure**, **Language Hierarchy**, **Livelihood Clusters**, and the **Out-of-County Diaspora Matrix**.\n\n",
    kind="signpost")

# ---------------------------------------------------------------- 3.4.1
uni = block("3.4.1", "| Universe | Definition |", "\n\n**Two of these sizes")
nested = ("kind: nested\nnote: " + q("**Two of these sizes are deliberately not stated.**") + "\nitems:\n"
          "  - label: \"Voter universe\"\n    text: \"**{{register.2022}}**\"\n    items:\n"
          "      - label: \"Expected turnout universe\"\n        text: \"**~{{ballots.2022}}**\"\n        items:\n"
          "          - { label: \"Victory universe\", text: \"**~{{benchmark}}**\" }\n"
          "  - { label: \"Base-hold universe\", text: \"Not stated\" }\n"
          "  - { label: \"Persuasion universe\", text: \"Not stated\" }\n"
          "  - { label: \"Mobilisation universe\", text: \"Target **{{target.supporters}}** verified supporters\" }\n"
          "body: " + q(uni))
replace(F, "3.4.1", uni, fence("visual", nested))
replace(F, "3.4.1", "**Two of these sizes are deliberately not stated.** ", "")
lead(F, "3.4.1", "Segments say where to speak and in what language; universes say what success looks like there.")

# ---------------------------------------------------------------- 3.4.2
seg = section(F, "3.4.2")
tbl = block("3.4.2", "| Segment | Primary pillar |", "\n\n**P4")
heads = {}
for line in tbl.split("\n")[2:]:
    c = table_cells(line)
    heads[c[0].replace("3.4.2 ", "")] = c[1:]
sstart = seg.index("#### The Rural Agrarian")
segtext = seg[sstart:].rstrip("\n")
parts = [p for p in re.split(r"\n\n---\n\n|\n---\n\n", segtext) if p.strip()]
order = list(heads.keys())
tabs = []
for i, part in enumerate(parts):
    head, rest = part.strip().split("\n", 1)
    pillar, lang, chan = heads[order[i]]
    fields = [{"label": "Primary pillar", "text": pillar}, {"label": "Language", "text": lang}, {"label": "Lead channel", "text": chan}]
    for item in bullet_items(rest.strip()):
        lines = item.split("\n")
        lab, txt = labelled(lines[0])
        sub = [l[4:] if l.startswith("    ") else l for l in lines[1:]]
        if sub:
            subs = []
            for s in bullet_items("\n".join(sub)):
                m = re.match(r"^\*(.+?):\*\s*([\s\S]*)$", oneline(s))
                if m:
                    subs.append(f"*{m.group(1)}:* {m.group(2)}")
                else:
                    subs.append(oneline(s))
            txt = (txt + "\n\n" if txt else "") + "\n".join("- " + s for s in subs)
        fields.append({"label": lab, "text": txt})
    tabs.append({"title": head.replace("#### ", ""), "fields": fields})
note = "**The \"core anxiety\" under each segment is a working hypothesis, not a measured opinion.**"
replace(F, "3.4.2", segtext, visual("tabs", tabs, preset="segment", note=note))
replace(F, "3.4.2", tbl + "\n\n", "")
_log({"file": F, "section": "3.4.2", "first12": "Segment | Primary pillar | Language | Lead channel (table)", "words": 0, "kind": "signpost", "home": "",
      "note": "The pillar table's cells moved into each segment tab as its first three fields; its six segment names duplicate the tab titles.", "text": tbl})
replace(F, "3.4.2", note + " Where", "Where")
lead(F, "3.4.2", "**Each segment carries the production pillar that commissions for it** (Section 3.7), so the segmentation has an output rather than only a description.")

# ---------------------------------------------------------------- 3.4.3
lead(F, "3.4.3", "**These six segments overlap, and the figures below are not additive.** **Check the base before quoting any percentage here.**")

# ---------------------------------------------------------------- 3.5
cut(F, "3.5", "Political messaging in Kitui County has historically relied on empty populist slogans that fail to withstand economic scrutiny. The campaign breaks decisively with this practice by constructing an **Evidence-Backed Message Hierarchy**.\n\n",
    kind="register", note="X10: framing paragraph.")
lead(F, "3.5", "Under the campaign's Provenance Discipline (Section A.1.1), **no claim is made without an attached primary empirical source**.")

# ---------------------------------------------------------------- 3.5.2
pt = block("3.5.2", "| Principle | Definition | Campaign application |", "\n\nThe final row")
cards = []
for line in pt.split("\n")[2:]:
    c = table_cells(line)
    cards.append({"title": c[0], "text": c[2], "fields": [{"label": "Definition", "text": c[1]}]})
replace(F, "3.5.2", pt, visual("cards", cards, preset="principle"))
replace(F, "3.5.2", "**Boundary.**", "<!-- keep -->\n**Boundary.**")

# ---------------------------------------------------------------- 3.5.3
ex = section(F, "3.5.3")
estart = ex.index("**Water scarcity**")
eend = ex.index("*All figures drawn")
exs = ex[estart:eend].rstrip()
tabs = []
for grp in exs.split("\n\n"):
    head, rest = grp.split("\n", 1)
    fields = []
    for item in re.split(r"\n(?=- )", rest):
        m = re.match(r"^- \*(.+?):\*\s*([\s\S]*)$", item.strip())
        fields.append({"label": m.group(1), "text": oneline(m.group(2))})
    tabs.append({"title": head.strip("*"), "fields": fields})
foot = ex[eend:].strip()
replace(F, "3.5.3", ex[estart:].rstrip("\n"), visual("tabs", tabs, preset="message", note=foot.strip("*")))

# ---------------------------------------------------------------- 3.6.1
replace(F, "3.6.1", "\n[CONFLICT C1: see open items] [CONFLICT C2: see open items]\n", "\n<!-- keep -->\n[CONFLICT C1: see open items] [CONFLICT C2: see open items]\n")
replace(F, "3.6.1", "\n[CONFLICT C1: see open items]\n\n### ", "\n<!-- keep -->\n[CONFLICT C1: see open items]\n\n### ") if False else None
mix = block("3.6.1", "| Language | Share | Primary use |", "\n\n#### Channel-by-language")
items = []
for line in mix.split("\n")[2:]:
    c = table_cells(line)
    items.append({"label": c[0].strip("*"), "value": c[1].strip("*"), "body": c[2]})
replace(F, "3.6.1", mix, visual("donut", items, title="Content mix for locally facing platforms"))
replace(F, "3.6.1", "**Content mix for locally facing platforms:**\n\n", "")
prov = block("3.6.1", "  * *\"Kĩtui nĩ yethu", "\n* **Kiswahili**")
plines = [l for l in prov.split("\n")]
cards = []
cur = None
for l in plines:
    if l.startswith("  * "):
        cur = l[4:]
        cards.append(cur)
    else:
        cards[-1] = cards[-1] + " " + l.strip()
note_line = cards.pop()
pcards = []
for c in cards:
    m = re.match(r"^(\*\".+?\"\*) — ([\s\S]*)$", c)
    if m:
        pcards.append({"title": m.group(1), "text": m.group(2), "badge": "draft"})
    else:
        pcards.append({"title": c, "badge": "draft"})
replace(F, "3.6.1", prov, "")
replace(F, "3.6.1", "#### Channel-by-language deployment", visual("cards", pcards, preset="proverb", note=note_line) + "\n\n#### Channel-by-language deployment")
lead(F, "3.6.1",
     "While English functions as the language of statutory policy and constitutional governance, and Kiswahili serves as "
     "the commercial lingua franca of urban trading centers, **Kikamba is the primary language of emotional connection, "
     "rural trust, cultural authority, and grassroots electoral mobilization**.")

# ---------------------------------------------------------------- 3.6.2
rules = block("3.6.2", "#### Linguistic Rules of Engagement:")
head, rest = rules.split("\n", 1)
cards = []
for x in bullet_items(rest):
    lab, txt = labelled(x)
    first, more = split_clause(txt, limit=30)
    cards.append({"title": lab, "text": first or oneline(txt), "body": more} if first else {"title": lab, "body": oneline(txt)})
swap(F, "3.6.2", rules, visual("cards", cards, title=head.replace("#### ", "").rstrip(":"), preset="rule"))

# ---------------------------------------------------------------- 3.6.3
cut(F, "3.6.3", "Running a synchronized three-language communications operation introduces severe version-drift and contradiction risks. The campaign implements a rigid **Translation",
    kind="register", new="The campaign implements a **Translation", note="X10: intensifiers and framing.")

# ---------------------------------------------------------------- 3.7
pair = "**What changed:** two fields on a Thursday post, and a language rule.\n**What did not change:** who takes the photograph, who writes the caption, and who presses publish."
spec = ("kind: contrast\nleft:\n  title: \"What changed\"\n  items:\n    - { label: \"two fields on a Thursday post, and a language rule.\" }\n"
        "right:\n  title: \"What did not change\"\n  items:\n    - { label: \"who takes the photograph, who writes the caption, and who presses publish.\" }")
swap(F, "3.7", pair, fence("visual", spec))
replace(F, "3.7", "**Two rules on top.**", "<!-- keep -->\n**Two rules on top.**")
print("strategy: done")

# Applied after the run above (logged once, recorded here):
# _log({"file": "strategy", "section": "3.1.2", "words": 10, "kind": "signpost", ...}): the four "(Tier 1)"
# became bar tier badges and the four joining "in"s became layout.
# The Message Pillar 3 card's headline was split at the colon inside its C6 marker; it was rejoined by hand.
