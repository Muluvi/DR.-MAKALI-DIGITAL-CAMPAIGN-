"""Stage 9: Annexes A to G (brief 2026-10 declutter, section 9)."""
import sys, os, re
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from edit import *
from edit import _log
from stage_helpers import block, list_items, split_sentence, keep


def table_rows(b, skip=2):
    return [table_cells(l) for l in b.split("\n")[skip:] if l.strip().startswith("|")]


def face(text, limit=14):
    """A visible face and the rest: {"text": …, "body": …} without empty keys."""
    head, rest = split_sentence(text, limit=limit)
    out = {}
    if head:
        out["text"] = head
    if rest:
        out["body"] = rest
    return out


def label_to_title(f, num, line, title):
    replace(f, num, line, "")
    _log({"file": f, "section": num, "first12": title, "words": 0, "kind": "signpost", "home": "",
          "note": "The label became the visual's title (moved).", "text": line.strip()})


# ================================================================ A
A = "annex-evidence"
cut(A, "A.1.2", "three immutable evidential tiers", kind="register", new="three evidential tiers", note="X10: intensifier.")
rb = block(A, "A.1.2", "*   *Tier 1 Data*")
cards = []
for x in bullet_items(rb):
    m = re.match(r"^\*(Tier \d Data)\*\s*([\s\S]*)$", oneline(x))
    cards.append({"title": m.group(1), "text": m.group(2)})
swap(A, "A.1.2", rb, visual("cards", cards, title="Standard Implementation Rules", preset="tier"))
label_to_title(A, "A.1.2", "#### Standard Implementation Rules:\n", "Standard Implementation Rules")

ml = block(A, "A.1.4", "*   **Provenance.**")
swap(A, "A.1.4", ml, visual("checklist", list_items(ml, limit=14)))
lead(A, "A.1.4", "The presence audit in Section 4.2.1 is held to the same rules as every figure in this document. "
     "Platform-reported metrics are **Tier 2**, and they are never presented as Tier 1 alongside IEBC or KNBS figures.")

# ================================================================ B
B = "annex-county"
lead(B, "B.2", "According to the Office of the Auditor-General's FY2023/24 audit report, four critical financial queries must "
     "be addressed by the county administration (Tier 1).")
lead(B, "B.3", "Kitui's food security remains classified under **IPC Phase 2 (\"Stressed\")** as of September 2025 (Tier 1).")
lead(B, "B.4", "The extensive coal deposits in the Mui Basin, straddling Kitui East and Kitui South, have remained undeveloped "
     "for over a decade due to unresolved legal challenges under **Petition 12 of 2014** (Tier 1).")
lead(B, "B.5", "Every adverse claim is explicitly attributed to its source, and no wrongdoing is asserted as settled fact unless "
     "confirmed by a court of law.")

# ================================================================ C
lead("annex-messages", "C.1", "**No segment in these grids carries a size.** The grids assign messages; they do not measure audiences.")

# ================================================================ D
D = "annex-cadence"
lead(D, "D.1", "This annex now carries only the rhythm the engagement itself creates.")
keep(D, "D.1", "| Cadence | Meeting | Participants | Output |")

# ================================================================ E
E = "annex-runbooks"
tb = block(E, "E.4", "| Tool class | Function |")
swap(E, "E.4", tb, visual("checklist", [{"label": c[0], **face(c[1], 22)} for c in table_rows(tb)]))
_log({"file": E, "section": "E.4", "first12": "Tool class Function", "words": 3, "kind": "signpost", "home": "",
      "note": "The column heads: each tool is a row's label, its function the row's text.", "text": "Tool class | Function"})

tb = block(E, "E.5", "| Severity | Definition | Response time | Approval |", "\n\nTo execute")
swap(E, "E.5", tb, visual("checklist", [{"label": c[0].strip("*"), "text": c[1], "head": {"label": "Response time", "text": c[2]},
                                         "fields": [{"label": "Approval", "text": c[3]}]} for c in table_rows(tb)]))
lb = block(E, "E.5", "* Standard rebuttals")
swap(E, "E.5", lb, visual("checklist", [{"label": oneline(x)} for x in bullet_items(lb)]))

lead(E, "E.6", "Quarterly at standard tier, monthly at premium, with a mandatory full-scale drill immediately before the "
     "nomination decision and again 60 days before the general election.")
sb = block(E, "E.6", "| # | Scenario | Tests |", "\n\n**Output:**")
swap(E, "E.6", sb, visual("checklist", [{"label": f"{c[0]}. {c[1]}", "fields": [{"label": "Tests", "text": c[2]}]} for c in table_rows(sb)],
                          title="Standing scenario library"))
label_to_title(E, "E.6", "**Standing scenario library:**\n", "Standing scenario library")
_log({"file": E, "section": "E.6", "first12": "# Scenario", "words": 7, "kind": "signpost", "home": "",
      "note": "The 'Scenario' column head, and the six scenario numbers (as found: 1 to 5, then 7), which now open each label as list ordinals and so are not counted as words.", "text": "Scenario; 1 2 3 4 5 7"})

lead(E, "E.7", "Kenyan campaigns face account takeover, phishing of staff and volunteers, leaked internal material, and "
     "increasingly the fabrication of audio and video.")
tm = block(E, "E.7", "For this campaign specifically, the highest-consequence scenarios are:")
intro, rest = tm.split("\n", 1)
swap(E, "E.7", tm, visual("checklist", [{"label": oneline(x)} for x in bullet_items(rest)], note=intro))

tb = block(E, "E.8", "| Control | Standard | Applies to |", "\n\n**Hardware keys")
swap(E, "E.8", tb, visual("checklist", [{"label": c[0], **({"text": c[1]} if words(c[1]) <= 14 else {"body": c[1]}),
                                         "fields": [{"label": "Applies to", "text": c[2]}]} for c in table_rows(tb)]))
lead(E, "E.8", "**Hardware keys for the candidate and admins are non-negotiable and take very little.**")

pb = block(E, "E.9", "* Onboarding training")
swap(E, "E.9", pb, visual("checklist", [{"label": oneline(x)} for x in bullet_items(pb)]))

tb = block(E, "E.10", "| Phase | Action | Owner | Target |", "\n\n**Leaked material")
swap(E, "E.10", tb, visual("timeline", [{"when": c[3], "label": c[0].strip("*"), **({"text": c[1]} if words(c[1]) <= 14 else {"body": c[1]}),
                                         "fields": [{"label": "Owner", "text": c[2]}]} for c in table_rows(tb)]))
_log({"file": E, "section": "E.10", "first12": "Phase Action Target", "words": 3, "kind": "signpost", "home": "",
      "note": "The 'Phase', 'Action' and 'Target' column heads: the timeline's labels, texts and times.", "text": "Phase | Action | Target"})

lead(E, "E.12", "The competitive intelligence workflow produces two operational outputs: the monthly competitive brief and the "
     "rapid alert system.")

# ================================================================ F: terms of use, never summarised
F = "annex-terms"
keep(F, "F.1", "This proposal is for Dr. Mulu.")
keep(F, "F.1", "It should not be circulated beyond")
keep(F, "F.1", "Nothing in this document constitutes a binding commitment")

# ================================================================ G
G = "annex-spec"
body = section(G, "G.1")
pb = body[body.index("#### Facebook"):body.index("\n\n---")]
cards = []
for chunk in re.split(r"(?m)^#### ", pb)[1:]:
    name, rest = chunk.split("\n", 1)
    items = [oneline(x) for x in bullet_items(rest.strip())]
    card = {"title": name.strip()}
    if words(items[0]) <= 14:
        card["text"] = items[0]
        items = items[1:]
    if items:
        card["body"] = "\n".join("* " + x for x in items)
    cards.append(card)
    _log({"file": G, "section": "G.1", "first12": name.strip(), "words": 0, "kind": "signpost", "home": "",
          "note": "The platform's h4 became its card's title (moved).", "text": "#### " + name.strip()})
swap(G, "G.1", pb, visual("cards", cards, preset="platform"))

lead(G, "G.2", "The shortcode and sender ID are those the aggregator provisions at contracting. Nothing here should be printed, "
     "dialled or published as a working number.")
lead(G, "G.3", "**Data-handling training is a gate, not an option.** No volunteer collects personal data before completing it "
     "(Section 5.3.3).")
lead(G, "G.4", "The technology stack must bridge the gap between digital command centers and offline rural wards, while "
     "adhering to Kenya's **Data Protection Act (DPA) 2019** and cybersecurity best practices.")
ds = block(G, "G.5", "* **IEBC Voter Register:**", "\n\n**Explicitly excluded:**")
swap(G, "G.5", ds, visual("checklist", list_items(ds, limit=20), title="Data sources"))
label_to_title(G, "G.5", "#### Data sources\n\n", "Data sources")
lead(G, "G.5", "**No psychographic, personality, ethnic, clan or religious variable appears in this dictionary, and none may be added.**")
print("annexes: done")
