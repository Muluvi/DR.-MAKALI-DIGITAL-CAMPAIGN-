"""Stage 8: Parts 5 and 6, measurement and risks (brief 2026-10 declutter, section 9)."""
import sys, os, re
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from edit import *
from edit import _log


def block(f, num, start, end=None):
    body = section(f, num)
    i = body.index(start)
    j = body.index(end, i) if end else len(body.rstrip("\n"))
    return body[i:j].rstrip("\n")


def split_sentence(text, limit=14):
    """(visible, rest): the first sentence of `text` when it is `limit` words or fewer; a short text with no
    sentence break is visible whole. Never splits at a semicolon or colon, so no face ends mid-sentence."""
    t = oneline(text)
    m = re.match(r"^(.+?(?<!\bDr)(?<!\bSen)(?<!\bHon)(?<!\bMr)(?<!\bMrs)(?<!\bSt)(?<!\bNo)(?<!\be\.g)(?<!\bi\.e)[.?!])(\s+|$)([\s\S]*)$", t)
    if m and words(m.group(1)) <= limit:
        return m.group(1), m.group(3).strip()
    if not m and words(t) <= limit:
        return t, ""
    return "", t


def list_items(b, limit=14):
    """Items of a bold-labelled list: label, a short visible clause, the rest behind the disclosure."""
    items = []
    for x in bullet_items(b):
        lab, txt = labelled(x)
        if lab is None:
            m = re.match(r"^\*\*(.+?)\*\*[.:]?\s*([\s\S]*)$", oneline(x))
            if m:
                lab, txt = m.group(1).rstrip(".:"), m.group(2)
            else:
                items.append({"label": oneline(x)})
                continue
        txt = txt.lstrip(", ")
        head, rest = split_sentence(txt, limit=limit) if limit else ("", oneline(txt))
        it = {"label": lab}
        if head:
            it["text"] = head
            if rest:
                it["body"] = rest
        elif txt:
            it["body"] = oneline(txt)
        items.append(it)
    return items


def keep(f, num, start):
    replace(f, num, start, "<!-- keep -->\n" + start)


# ================================================================ measurement
M = "measurement"

# ---------------------------------------------------------------- 5.1.1: the two one-line framings
cut(M, "5.1.1", "establishing unassailable party consensus and ", kind="register", note="X10: inflated register.")
cut(M, "5.1.1", "systematic voter mobilization", kind="register", new="voter mobilization", note="X10: intensifier.")

# ---------------------------------------------------------------- 5.1.2: indicator cards
tb = block(M, "5.1.2", "| Code | Indicator | Method | Baseline | Target |", "\n\n**R-02 is the indicator")
cards = []
for l in tb.split("\n")[2:]:
    c = table_cells(l)
    cards.append({"title": c[1], "chips": [c[0].strip("*")], "head": {"label": "Target", "text": c[4]},
                  "fields": [{"label": "Method", "text": c[2]}, {"label": "Baseline", "text": c[3]}]})
swap(M, "5.1.2", tb, visual("cards", cards, preset="indicator"))
lead(M, "5.1.2",
     "**R-02 is the indicator this engagement lives or dies on.** It is the only one fully inside the direction layer's "
     "control, it moves weekly, and it is the direct test of the recognition thesis in Section 2.12.")
keep(M, "5.1.2", "**Followers are not the target. Being known in Mwingi is.**")

# ---------------------------------------------------------------- 5.1.3: three tiles
cut(M, "5.1.3", "The campaign strictly excludes", kind="register", new="The campaign excludes", note="X10: intensifier (the rule is 'excludes').")
cut(M, "5.1.3", "the following empirical realities:", kind="register", new="the following realities:", note="X10: inflated register.")
vb = block(M, "5.1.3", "*   **Offline Reality:**")
tiles = []
for x in bullet_items(vb):
    lab, txt = labelled(x)
    head, rest = split_sentence(txt, limit=40)
    it = {"title": lab, "text": head or oneline(txt)}
    if head and rest:
        it["body"] = rest
    if lab == "Geographic Skew":
        # The share is withdrawn and not yet measured: the card says so on its face (D-34).
        it["tier"] = "not yet tiered"
    tiles.append(it)
swap(M, "5.1.3", vb, visual("cards", tiles))

# ---------------------------------------------------------------- 5.1.4: the governance rhythm
cut(M, "5.1.4", "embedded in a rigid governance rhythm", kind="register", new="embedded in a governance rhythm", note="X10: intensifier.")
gb = block(M, "5.1.4", "1.  **Weekly Monday KPI Standup")
swap(M, "5.1.4", gb, visual("stepper", list_items(gb, limit=20)))

# ---------------------------------------------------------------- 5.2.1: the measurement set
mt = block(M, "5.2.1", "| Group | Measured | Why this one |")
rows = []
for l in mt.split("\n")[2:]:
    c = table_cells(l)
    head, rest = split_sentence(c[1], limit=14)
    it = {"label": c[0].strip("*")}
    if head:
        it["text"] = head
    if rest or not head:
        it["body"] = rest if head else oneline(c[1])
    it["fields"] = [{"label": "Why this one", "text": c[2]}]
    rows.append(it)
swap(M, "5.2.1", mt, visual("checklist", rows))
_log({"file": M, "section": "5.2.1", "first12": "Measured", "words": 1, "kind": "signpost", "home": "",
      "note": "The 'Measured' column head: each row's measures are the item's text.", "text": "Measured"})

# ---------------------------------------------------------------- 5.2.2
lead(M, "5.2.2", "**Ninety days: 18 June to 16 September 2026.** It is the longest window Meta exports at post level without gaps.")

# ---------------------------------------------------------------- 5.2.3: the question, the restatement folded (D-21)
lead(M, "5.2.3", "What it has never been asked is the only question that matters in a countywide name-recognition contest: "
     "**how much of this reach lands where he is not yet known?**")

# ---------------------------------------------------------------- 5.2.4: the method stepper
st = block(M, "5.2.4", "1.  **Confirm Page or profile.**")
swap(M, "5.2.4", st, visual("stepper", list_items(st, limit=14)))

# ---------------------------------------------------------------- 5.2.5
lead(M, "5.2.5", "It is not an appraisal of the people doing the work. This section reads the output, not the operators.")

# ---------------------------------------------------------------- 5.2.6
op = block(M, "5.2.6", "Political strategy without empirical measurement", "\n\n```figure")
cut(M, "5.2.6", op, kind="signpost", note="Opening paragraph is a signpost to 5.2.6 itself and 4.5.1 (plan); the hypothesis is 2.12's.")
lead(M, "5.2.6", "The campaign tests the **\"Recognition-Deficit Hypothesis\"** on records that already exist: his own channel "
     "analytics, the IEBC's ward-level results, and what arrives unprompted on the line Firefly operates. Nothing is "
     "commissioned to test it.")

# ---------------------------------------------------------------- 5.3.1
lead(M, "5.3.1", "Voter data is handled in a manner intended to comply with Kenya's Data Protection Act 2019, the Communications "
     "Authority framework governing political messaging, and IEBC regulations.")
keep(M, "5.3.1", "**Important framing: this section describes")
keep(M, "5.3.1", "| Channel | Operated by | Controller position to be confirmed |")
rb = block(M, "5.3.1", "**NG-CDF and bursary beneficiary lists are off-limits")
paras = rb.split("\n\n")
rules = []
for p in paras:
    m = re.match(r"^\*\*(.+?)\*\*\s*([\s\S]*)$", p.strip())
    if p.startswith("**It is not used.**"):
        # The second paragraph of the bursary rule: it joins that card's body.
        rules[-1]["body"] += "\n\n" + oneline(p)
        continue
    rules.append({"title": m.group(1), "body": oneline(m.group(2))})
swap(M, "5.3.1", rb, visual("cards", rules, preset="rule"))

# ---------------------------------------------------------------- 5.3.2
lead(M, "5.3.2", "Vendors openly market databases of millions of Kenyan mobile numbers. Rival campaigns may well buy them. "
     "The campaign will not.")
rt = block(M, "5.3.2", "| Area | Requirement | Source |", "\n\n**The commercial reality")
items = []
for l in rt.split("\n")[2:]:
    c = table_cells(l)
    head, rest = split_sentence(c[1], limit=14)
    it = {"label": c[0].strip("*")}
    if head:
        it["text"] = head
    if rest or not head:
        it["body"] = rest if head else oneline(c[1])
    it["fields"] = [{"label": "Source", "text": c[2]}]
    items.append(it)
swap(M, "5.3.2", rt, visual("checklist", items))
ct = block(M, "5.3.2", "| Area | Requirement | Implementation |", "\n\n#### The Data Protection Act")
items = []
for l in ct.split("\n")[2:]:
    c = table_cells(l)
    items.append({"label": c[0].strip("*"), "text": c[1], "fields": [{"label": "Implementation", "text": c[2]}]})
swap(M, "5.3.2", ct, visual("checklist", items))
cut(M, "5.3.2", "operate under strict statutory oversight", kind="register", new="operate under statutory oversight", note="X10: intensifier.")
cut(M, "5.3.2", "Non-compliance risks severe criminal penalties, regulatory injunctions, and catastrophic brand damage to Dr. Mulu's integrity-driven platform.",
    kind="register", new="Non-compliance risks criminal penalties, regulatory injunctions, and brand damage.", note="X10: inflated register.")
sg = block(M, "5.3.2", "1.  **Ban on Commercial Database Ingestion:**", "\n\n---")
swap(M, "5.3.2", sg, visual("checklist", list_items(sg, limit=0), title="Mandatory Compliance Safeguards"))
replace(M, "5.3.2", "##### Mandatory Compliance Safeguards:\n", "")
_log({"file": M, "section": "5.3.2", "first12": "Mandatory Compliance Safeguards", "words": 0, "kind": "signpost", "home": "",
      "note": "The h5 label became the checklist's title (moved).", "text": "##### Mandatory Compliance Safeguards:"})

# ---------------------------------------------------------------- 5.3.3: the charter stays visible in full
lead(M, "5.3.3", "Because a commitment nobody can read is a policy, and a commitment published with a verification route is a differentiator.")
keep(M, "5.3.3", "*Published on the campaign website in all three languages")
keep(M, "5.3.3", "> ### DIGITAL ETHICS & DATA CHARTER")

# ---------------------------------------------------------------- 5.3.4: the gate
cut(M, "5.3.4", "*The single most important governance control in this document.*\n\n", kind="signpost",
    note="Framing line above the gate rule, which is the section's lead.")
lead(M, "5.3.4", "**Before any voter-file-based targeting, list-building beyond first-party consented data, or bulk political "
     "messaging goes live, a named Kenyan data-protection or electoral-law specialist must review and sign off the "
     "specific proposed processing in writing.**")
keep(M, "5.3.4", "**This proposal does not assert that the micro-targeting")
qs = block(M, "5.3.4", "1. On what lawful basis", "\n\n**Process:**")
swap(M, "5.3.4", qs, visual("checklist", [{"label": oneline(x)} for x in bullet_items(qs)]))
pr = block(M, "5.3.4", "**Process:**\n| Step | Owner | Output |", "\n\n**Until step 4")
steps = []
for l in pr.split("\n")[3:]:
    c = table_cells(l)
    lab = re.sub(r"^\d+\.\s*", "", c[0])
    head, rest = (lab.split(": ", 1) + [""])[:2]
    it = {"label": head}
    if rest:
        it["text"] = rest
    it["fields"] = [{"label": "Owner", "text": c[1]}, {"label": "Output", "text": c[2]}]
    steps.append(it)
swap(M, "5.3.4", pr, visual("stepper", steps, title="Process"))
_log({"file": M, "section": "5.3.4", "first12": "Step", "words": 1, "kind": "signpost", "home": "",
      "note": "The 'Step' column head: each step is a stepper row.", "text": "Step"})
keep(M, "5.3.4", "**Until step 4 is complete")

# ---------------------------------------------------------------- 5.3.5
cut(M, "5.3.5", "This compliance pack consolidates all statutory, constitutional, and regulatory requirements governing Dr. Makali Mulu’s 2027 Kitui County gubernatorial campaign. ",
    kind="signpost", note="Plan: the 'compliance pack consolidates' sentence is a signpost to the figures below it.")

# ---------------------------------------------------------------- 5.3.6: status and the three actions
lead(M, "5.3.6", "Two ODPC documents are now identified by name and should be put in front of the reviewer directly. What "
     "remains unretrieved is any circular issued after these.")
ma = block(M, "5.3.6", "> **Mandatory Action:**", "\n\n\n---")
lines = ma.split("\n")
intro = lines[0][2:].strip()
acts = [{"label": re.sub(r"^\d+\.\s+", "", l[2:]).strip()} for l in lines[1:]]
# The callout now ends at the status paragraph; the actions follow it as a checklist, the intro as its note.
replace(M, "5.3.6", "> with the operator.\n>\n" + ma, "> with the operator.\n\n" + visual("checklist", acts, note=intro))

# ================================================================ risks
R = "risks"

# ---------------------------------------------------------------- 6.2.1
lead(R, "6.2.1", "In Kitui County, ground rumors and hostile talking points travel primarily through two high-velocity vectors: "
     "**morning vernacular radio talk shows (06:00–09:00 EAT)** and **hyper-local ward WhatsApp groups**.")

# ---------------------------------------------------------------- 6.2.2: four streams
ms = block(R, "6.2.2", "1.  **Broadcast Vernacular Radio Triage")
items = list_items(ms, limit=16)
swap(R, "6.2.2", ms, visual("cards", [{"title": it["label"], **{k: v for k, v in it.items() if k != "label"}} for it in items]))

# ---------------------------------------------------------------- 6.2.3: rule tiles
rs = block(R, "6.2.3", "1.  **Rule 1:", "\n\n\n---")
swap(R, "6.2.3", rs, visual("cards", [{"title": it["label"], "body": it["body"]} for it in list_items(rs, limit=0)], preset="rule"))

# ---------------------------------------------------------------- 6.3.1
lead(R, "6.3.1", "AI-generated video of serving Kenyan public figures has already circulated widely.")
keep(R, "6.3.1", "**The two-sided risk.**")
for lab, start, end in [("Prevention — provenance by default", "* All official video and audio", "\n\n**Detection:**"),
                        ("Detection", "* Monitoring for candidate-name mentions", "\n\n**Rapid rebuttal")]:
    b = block(R, "6.3.1", start, end)
    swap(R, "6.3.1", b, visual("checklist", [{"label": oneline(x)} for x in bullet_items(b)], title=lab))
    replace(R, "6.3.1", f"**{lab}:**\n", "")
    _log({"file": R, "section": "6.3.1", "first12": lab, "words": 0, "kind": "signpost", "home": "",
          "note": "The bold label became the checklist's title (moved).", "text": f"**{lab}:**"})
rb = block(R, "6.3.1", "**Rapid rebuttal — Level 3, 30-minute clock:**\n| Minute | Action |", "\n\n**The SMS component")
evs = []
for l in rb.split("\n")[3:]:
    c = table_cells(l)
    head, rest = split_sentence(c[1], limit=14)
    ev = {"when": c[0], "label": head or c[1]}
    if head and rest:
        ev["body"] = rest
    evs.append(ev)
swap(R, "6.3.1", rb, visual("timeline", evs, title="Rapid rebuttal — Level 3, 30-minute clock"))
_log({"file": R, "section": "6.3.1", "first12": "Minute Action", "words": 2, "kind": "signpost", "home": "",
      "note": "The 'Minute' and 'Action' column heads: the timeline's times and labels.", "text": "Minute | Action"})
keep(R, "6.3.1", "**Standing rule:**")

# ---------------------------------------------------------------- 6.5
lead(R, "6.5", "If Wiper party leadership departs from the reported countywide selection and reverts to a delegate-based "
     "nomination primary, the campaign will immediately trigger its **Delegate Whip Contingency Plan**.")
ds = block(R, "6.5", "1.  **Map the Delegate Registry:**", "\n\n---")
swap(R, "6.5", ds, visual("stepper", list_items(ds, limit=0)))
print("parts 5 and 6: done")
