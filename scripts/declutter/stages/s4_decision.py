"""Stage 4: Part 1, the decision (brief 2026-10 declutter, section 9)."""
import sys, os, re
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from edit import *

F = "decision"

# ---------------------------------------------------------------- 1.1
cut(F, "1.1", "What this section adds is the clock behind the ask, and the ask itself (Section 1.1).\n",
    kind="signpost", note="Signpost; it also cited its own section.")
lead(F, "1.1",
     "**Firefly Management asks for one week and one export.** Firefly supplies that layer while the existing team "
     "keeps publishing, and publishes nothing on Dr. Mulu's accounts. This proposal commits to a method, a cadence "
     "and a standard; it does not commit to an electoral outcome.")
stats = visual("stats", [
    {"value": "{{pool}}", "label": "voters in the pool wards", "tier": 1},
    {"value": "{{pool.share}}%", "label": "of the register", "tier": 1},
    {"value": "{{ict.offline}}%", "label": "of residents offline", "tier": 1},
    {"value": "{{result.2022.womanrep.kasalu}}", "label": "Dr. Kasalu, 2022", "tier": 2},
    {"value": "{{result.2022.senate.wambua}}", "label": "Sen. Wambua, 2022", "tier": 2},
])
replace(F, "1.1", "```figure\nid: fig-6-3-decision\n```\n", "```figure\nid: fig-6-3-decision\n```\n\n" + stats + "\n")

# ---------------------------------------------------------------- 1.2
lead(F, "1.2",
     "The campaign operates against two deadlines: the Wiper nomination <window-chip></window-chip> and the "
     "10 August 2027 general election.")

# ---------------------------------------------------------------- 1.3.1 to 1.3.5: one objective card each
def objective(num):
    body = section(F, num)
    block = body.strip()
    fields = {}
    order = []
    for item in bullet_items(block):
        for part in re.split(r"(?=\*\*Measured by:\*\*)", oneline(item)):
            label, text = labelled(part)
            fields[label] = text
            order.append(label)
    target = fields.pop("Target")
    owner = fields.pop("Named Owner")
    measured = fields.get("Measured by", "")
    chips = re.findall(r"\b(?:NW|R|GE)-\d{2}\b", measured)
    card = {
        "head": {"label": "Target", "text": target},
        "chips": chips,
        "text": f"**Named Owner:** {owner}",
        "fields": [{"label": k, "text": fields[k]} for k in order if k in fields],
    }
    swap(F, num, block, visual("cards", [card], preset="objective"))

for n in ["1.3.1", "1.3.2", "1.3.3", "1.3.4", "1.3.5"]:
    objective(n)

# ---------------------------------------------------------------- 1.4
cut(F, "1.4", "All fourteen workstreams on one page, with the owner named against each — and what is deliberately outside the engagement.\n\n",
    kind="signpost")
cut(F, "1.4", "Section 4.5 sets each workstream out in full, with its own boundaries and KPIs. This page\nexists so the whole engagement can be seen at once before any of it is read in detail.\n\n",
    kind="signpost")

# ---------------------------------------------------------------- 1.4.1
cut(F, "1.4.1", "This proposal is built in the same order as the engagement: the data (Section 2), what it implies (Section 2), the strategy it leads to (Section 3) and how that strategy is directed (Section 5 [CHECK REF]). Section 1 is the decision.\n\n",
    kind="signpost", note="Describes the document's own order; carried one [CHECK REF].")
lead(F, "1.4.1",
     "**Firefly publishes nothing on Dr. Mulu's accounts and holds no credentials to them.** The only channel it "
     "operates directly is the offline layer it already holds: a WhatsApp Business API line and a USSD shortcode.")
steps_src = section(F, "1.4.1")
step_block = "\n".join(l for l in steps_src.split("\n") if l.startswith("*   **"))
steps = []
for item in bullet_items(step_block):
    m = re.match(r"^\*\*(.+?)\.\*\*\s*([\s\S]*)$", oneline(item))
    head, rest = split_clause(m.group(2))
    steps.append({"label": m.group(1), "text": head, "body": rest} if head else {"label": m.group(1), "body": rest})
swap(F, "1.4.1", step_block, visual("stepper", steps))

# ---------------------------------------------------------------- 1.4.2
cut(F, "1.4.2",
    "Three engagement levels are defined in Section 1.5, and they differ in\nthe *depth of the intelligence*, not the volume of Firefly's output; **Firefly recommends Level 2\n(Standard)**, because it is the level at which all 40 wards carry both reach reporting and an active\nSMS and USSD layer — and reaching the arid belt is the whole argument. ",
    kind="duplicate", home="decision:1.5.2|decision:1.5.1",
    note="The Level 2 recommendation, said once at 1.5.2; 'levels of depth, not volume' is 1.5.1's.")
cut(F, "1.4.2",
    " **{{ict.offline}}%** of Kitui\nresidents are outside the internet-using population (CA/KNBS 2023/24, Tier 1), and Section 3.3.2 puts\nthe reach of a purely digital operation at about **{{reach.smartphone}} voters**, short of the {{benchmark}} benchmark\neven before reach is turned into votes.",
    kind="duplicate", home="evidence:2.9.1|evidence:2.9.3", new=" (Section 2.9.3)",
    note="Connectivity (home 2.9.1) and the digital ceiling (home 2.9.3), said once.")
ws = section(F, "1.4.2")
ws9 = re.search(r"\*\*Workstream 9 is the one Firefly operates and the one that decides the race\.\*\*[\s\S]*?works\.\n", ws).group(0)
ws14 = re.search(r"\*\*Workstream 14 is the one that makes the rest legible\.\*\*[\s\S]*?Section 4\.2\.1\.\n", ws).group(0)
def callout(p):
    m = re.match(r"^\*\*(.+?)\*\*\s*([\s\S]*)$", p.strip())
    return {"title": m.group(1), "text": oneline(m.group(2))}
swap(F, "1.4.2", ws9 + "\n" + ws14, visual("cards", [callout(ws9), callout(ws14)]) + "\n")
lead(F, "1.4.2",
     "Firefly is being proposed as the campaign's **intelligence and strategy layer**, not as a replacement for the "
     "team already publishing.")

# ---------------------------------------------------------------- 1.4.3
cut(F, "1.4.3", "\n*How the three engagement levels change what runs, and the Level 2 recommendation, are set out once, in 1.5.1.*\n",
    kind="signpost", note="Closing pointer.")
scope = section(F, "1.4.3")
out_block = "\n".join(l for l in scope.split("\n") if l.startswith("*   ") or l.startswith("    "))
outs = []
for item in bullet_items(out_block):
    t = oneline(item)
    m = re.match(r"^\*\*(.+?)\.?\*\*\s*([\s\S]*)$", t)
    label, rest = m.group(1).rstrip("."), m.group(2).strip()
    if rest.startswith("— "):
        rest = rest[2:]
    head, body = split_clause(rest)
    row = {"label": label}
    if head:
        row["text"] = head
        if body:
            row["body"] = body
    elif rest:
        row["body"] = rest
    outs.append(row)
swap(F, "1.4.3", out_block, visual("inout", outs, key="out"))

# ---------------------------------------------------------------- 1.5.1
lead(F, "1.5.1",
     "**These are levels of depth, not volume.** What none of them changes is who publishes: your team does, at every level.")
table = re.search(r"\| Term \| Means \| Where it is set \|\n\|---\|---\|---\|\n((?:\|.*\|\n)+)", section(F, "1.5.1"))
rows = {}
for line in table.group(1).strip().split("\n"):
    cells = [c.strip() for c in line.strip("|").split("|")]
    rows[cells[0].strip("*")] = (cells[1], cells[2])
def set_item(name, inner=None):
    means, where = rows[name]
    it = {"label": name, "text": means, "fields": [{"label": "Where it is set", "text": where}]}
    if inner:
        it["items"] = inner
    return it
nested = visual("nested", [
    set_item("Contact universe", [set_item("Consented SMS contacts")]),
    set_item("Pledged voters", [set_item("Verified supporters")]),
])
replace(F, "1.5.1", table.group(0), nested + "\n")
replace(F, "1.5.1", "**Accessibility is not a service level.**", "<!-- keep -->\n**Accessibility is not a service level.**")

# ---------------------------------------------------------------- 1.5.3
lead(F, "1.5.3",
     "Every row below is set somewhere else in this proposal, in the workstream that produces it. Most of this "
     "schedule is your team's existing output, now directed.")
replace(F, "1.5.3", "| Deliverable | Cadence | Produced by | Form | Where it is set |", "<!-- keep -->\n| Deliverable | Cadence | Produced by | Form | Where it is set |")
gated = ("Four deliverables are gated on decisions the campaign has not yet made: **the presence audit cannot\n"
         "start until read-only analytics access is granted**, the USSD menu cannot be provisioned until the\n"
         "shortcode is, the compliance review cannot start until the reviewer is appointed, and sign-language\n"
         "interpretation on flagship content depends on the interpreter or service named in Section 1.7.\n"
         "Each is listed there.")
swap(F, "1.5.3", gated, visual("checklist", [
    {"label": "**the presence audit cannot start until read-only analytics access is granted**"},
    {"label": "the USSD menu cannot be provisioned until the shortcode is"},
    {"label": "the compliance review cannot start until the reviewer is appointed"},
    {"label": "sign-language interpretation on flagship content depends on the interpreter or service named in Section 1.7"},
], title="Four deliverables are gated on decisions the campaign has not yet made", note="Each is listed there."))

# ---------------------------------------------------------------- 1.6
commit = section(F, "1.6")
paras = [p for p in commit.strip().split("\n\n") if p.startswith("**The ")]
items = []
for p in paras:
    m = re.match(r"^\*\*(The \w+)\*\*\s*([\s\S]*)$", p.strip())
    head, rest = split_clause(m.group(2))
    items.append({"label": m.group(1), "text": head, "body": rest} if head else {"label": m.group(1), "body": oneline(m.group(2))})
swap(F, "1.6", "\n\n".join(paras), visual("checklist", items))

# ---------------------------------------------------------------- 1.8
cut(F, "1.8",
    "Earlier drafts of this proposal said \"before the final quarter\" in four places while every\n   operational deadline in it assumed Q4; the wording is now the same throughout, and it remains\n   a **Tier 3** expectation",
    kind="history", new="It remains\n   a **Tier 3** expectation",
    note="Editorial history of the drafts; the Tier 3 status it ended on stays.")
lead(F, "1.8",
     "Each assumption is stated so that if one fails, the campaign can see immediately what in the plan moves. "
     "None of them is a prediction, and none is presented as settled fact.")
body = section(F, "1.8")
start = body.index("1. **The Wiper ticket")
lst = body[start:].rstrip("\n")
entries = re.split(r"\n\n(?=\d+[a-d]?\. \*\*)", lst)
IF_FAILS = {
    "1": "If it becomes a delegate primary,",
    "3": None,
    "4a": "If it is a profile",
    "4b": "If the team will not,",
    "4d": "Where it does not,",
    "5": "Without it,",
}
cards = []
for e in entries:
    m = re.match(r"^(\d+[a-d]?)\. \*\*(.+?)\*\*\s*([\s\S]*)$", e.strip())
    num, claim, rest = m.group(1), m.group(2), oneline(m.group(3))
    card = {"title": f"{num}. {claim}"}
    start_if = IF_FAILS.get(num)
    if start_if and start_if in rest:
        i = rest.index(start_if)
        tail = rest[i:]
        j = tail.find(". ")
        fails = tail if j < 0 else tail[: j + 1]
        before, after = rest[:i].strip(), tail[len(fails):].strip()
        card["head"] = {"label": "If it fails", "text": fails}
        remaining = " ".join(x for x in [before, after] if x)
    else:
        remaining = rest
    if num == "4a":
        card["badge"] = "the largest single unknown in this document"
    if remaining:
        card["body"] = remaining
    cards.append(card)
swap(F, "1.8", lst, visual("cards", cards, preset="assumption"))
print("decision: done")
