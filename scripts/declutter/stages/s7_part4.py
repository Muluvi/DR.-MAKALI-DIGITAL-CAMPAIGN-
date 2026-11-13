"""Stage 7: Part 4, delivery, the four workstream tabs and staffing (brief 2026-10 declutter, section 9)."""
import sys, os, re
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from edit import *
from edit import _log


def block(f, num, start, end=None):
    body = section(f, num)
    i = body.index(start)
    j = body.index(end, i) if end else len(body.rstrip("\n"))
    return body[i:j].rstrip("\n")


def checklist_from(f, num, start, end=None, title=None, limit=14):
    b = block(f, num, start, end)
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
        head, rest = split_clause(txt, limit=limit)
        it = {"label": lab}
        if head:
            it["text"] = head
            if rest:
                it["body"] = rest
        elif txt:
            it["body"] = oneline(txt)
        items.append(it)
    swap(f, num, b, visual("checklist", items, title=title))


# ================================================================ delivery
D = "delivery"
wk = block(D, "4.1.1", "* **Thursday, 16:00 — the brief.**", "\n\n**Asset centralisation:**")
days = []
for x in bullet_items(wk):
    m = re.match(r"^\*\*(.+?) — (.+?)\.\*\*\s*([\s\S]*)$", oneline(x))
    days.append({"day": m.group(1), "items": [{"label": m.group(2), "body": m.group(3)}]})
spec = "kind: week\nitems:\n" + "\n".join(
    f"  - day: {q(d['day'])}\n    items:\n      - {{ label: {q(d['items'][0]['label'])}, body: {q(d['items'][0]['body'])} }}" for d in days)
swap(D, "4.1.1", wk, fence("visual", spec))
three = block(D, "4.1.1", "**Asset centralisation:**")
items = []
for p in three.split("\n\n"):
    m = re.match(r"^\*\*(.+?):\*\*\s*([\s\S]*)$", p.strip())
    items.append({"label": m.group(1), "body": oneline(m.group(2))})
swap(D, "4.1.1", three, visual("checklist", items))

replace(D, "4.1.2", "| Activity | Firefly |", "<!-- keep -->\n| Activity | Firefly |")
cut(D, "4.1.2", "**One row has Firefly publishing.** That asymmetry is the engagement, stated as a workflow: the\noffline layer is Firefly's to operate because Firefly holds the infrastructure, and everything on\nthe owned accounts stays with the people who run it now.\n\n",
    kind="duplicate", home="decision:1.4.1|decision:1.1", note="Firefly publishes only on the offline layer: said once at 1.4.1 (section 6).")

cut(D, "4.2.1", "The first four weeks, the phases to August 2027, what the campaign receives, how progress is measured and decided, what could go wrong, and how the work is staffed.\n\n",
    kind="signpost")
bands_src = block(D, "4.2.1", "**Week 1 — the presence audit (immediate):**", "\n\n**Phase −1 KPIs:**")
events = []
for part in bands_src.split("\n\n"):
    head, rest = part.split("\n", 1)
    m = re.match(r"^\*\*(Weeks? [\d–]+) — (.+?):\*\*$", head.strip())
    events.append({"when": m.group(1), "label": m.group(2), "body": rest.strip()})
swap(D, "4.2.1", bands_src, visual("timeline", events))

acts = block(D, "4.2.2", "**Activities:**\n", "\n\n**KPIs:**")
evs = []
for x in bullet_items(acts.split("\n", 1)[1]):
    m = re.match(r"^(Weeks [\d–]+): ([\s\S]*)$", oneline(x))
    evs.append({"when": m.group(1), "label": m.group(2)} if m else {"label": oneline(x)})
swap(D, "4.2.2", acts, visual("timeline", evs, title="Activities"))
kp = block(D, "4.2.2", "**KPIs:**\n")
swap(D, "4.2.2", kp, visual("checklist", [{"label": oneline(x)} for x in bullet_items(kp.split("\n", 1)[1])], title="KPIs"))

lead(D, "4.2.3",
     "**The PhD is the one to fix first.** **Is the Facebook presence a Page, or a personal profile in professional "
     "mode?** One screenshot settles this in the first hour of Week 1, and it gates the rest of the audit.")

for n in ["4.3.2", "4.3.3", "4.3.4"]:
    cut(D, n, "\n\n**KPIs:** set out, phase by phase, in the target ladder at the head of Section 4.3.", kind="signpost",
        note="Pointer repeated in each phase; the target ladder is 4.3.1.")
    a = block(D, n, "**Activities:**\n")
    swap(D, n, a, visual("checklist", [{"label": oneline(x)} for x in bullet_items(a.split("\n", 1)[1])], title="Activities"))

cal = block(D, "4.4", "| Phase | Target constituencies | Engagement | Digital output |", "\n\n#### Managing endorsements")
evs = []
for line in cal.split("\n")[2:]:
    c = table_cells(line)
    evs.append({"when": c[0].strip("*").replace("** (", " (").replace("**", ""), "label": c[1], "text": c[2], "fields": [{"label": "Digital output", "text": c[3]}]})
swap(D, "4.4", cal, visual("timeline", evs))
checklist_from(D, "4.4", "* Every endorsement is **voluntary", "\n\n#### Coalition KPIs", limit=0)
kpis = block(D, "4.4", "| Metric | Target |")
tiles = []
for line in kpis.split("\n")[2:]:
    c = table_cells(line)
    tiles.append({"value": c[1], "label": c[0]})
swap(D, "4.4", kpis, visual("stats", tiles))
lead(D, "4.4",
     "Coalitions are built around **shared economic and civic interests** — water, credit, market access, employment, "
     "transparency. They are never built around ethnic, clan or religious bloc identity.")

# ================================================================ the four workstream groups, said once in 4.5
P = "workstreams-platforms"
G = {
    "Publishing and earned media": ("workstreams-media", ["4.5.5", "4.5.6"]),
    "Ground and offline reach": ("workstreams-ground", ["4.5.7", "4.5.8", "4.5.9", "4.5.10"]),
    "Data and technology": ("workstreams-data", ["4.5.11", "4.5.12", "4.5.13", "4.5.14"]),
}
sentences = {}
for name, (f, nums) in G.items():
    first = True
    for n in nums:
        body = section(f, n)
        m = re.search(r"> \*\*Group: " + re.escape(name) + r"\.\*\* (.+)\n", body)
        sent = m.group(1)
        if first:
            sentences[name] = sent
            replace(f, n, " " + sent + "\n", "\n")
            _log({"file": f, "section": n, "first12": first12(sent), "words": words(sent), "kind": "moved",
                  "home": f"{P}:4.5", "to": f"{P}:4.5", "note": "X5: the group's description, set out once in 4.5.", "text": sent})
            first = False
        else:
            cut(f, n, " " + sent, kind="duplicate", home=f"{P}:4.5", note="X5: the group description, said once in 4.5.")
four = ("The fourteen workstreams, in four groups: 4.5 Platforms and content (workstreams 1 to 4), 4.5 Publishing and earned "
        "media (5 and 6), 4.5 Ground and offline reach (7 to 10) and 4.5 Data and technology (11 to 14). Each sets out what "
        "it produces, who owns it and how often it reports.")
groups = visual("cards", [
    {"title": "Platforms and content", "badge": "workstreams 1 to 4"},
    {"title": "Publishing and earned media", "badge": "5 and 6", "text": sentences["Publishing and earned media"]},
    {"title": "Ground and offline reach", "badge": "7 to 10", "text": sentences["Ground and offline reach"]},
    {"title": "Data and technology", "badge": "11 to 14", "text": sentences["Data and technology"]},
], title="The fourteen workstreams, in four groups", note="Each sets out what it produces, who owns it and how often it reports.", preset="group")
replace(P, "4.5", four, groups)
_log({"file": P, "section": "4.5", "first12": first12(four), "words": 14, "kind": "signpost", "home": "",
      "note": "The four-group sentence became the group cards: its group names, counts and closing line moved into them; '4.5' ×4 and the joining words went.", "text": four})
for nm, start, end in [("Digital infrastructure, brand and civic content", "* **Web management", "\n\n#### Growth"),
                       ("Growth, field advertising and reputation operations", "* **Data analytics:**", "\n\n---")]:
    checklist_from(P, "4.5", start, end, title=nm, limit=0)
    replace(P, "4.5", f"#### {nm}\n\n", "")
    _log({"file": P, "section": "4.5", "first12": nm, "words": 0, "kind": "signpost", "home": "", "note": "The h4 label became the checklist's title (moved).", "text": "#### " + nm})

# ---------------------------------------------------------------- 4.5.1
cut(P, "4.5.1", "Dr. Mulu is a monitoring and evaluation specialist — a member of the Evaluation\nSociety of Kenya and an M&amp;E Champion recognised by the Ministry of Finance,\nwhose constituency was certified best evaluated in the Eastern region.",
    kind="duplicate", home="evidence:2.10.1", new="(Section 2.10.1)", note="His record, said once at 2.10.1 (section 6).")
ch = block(P, "4.5.1", "| Channel | Access route |", "\n\n#### What happens")
swap(P, "4.5.1", ch, visual("checklist", [{"label": table_cells(l)[0].strip("*"), "text": table_cells(l)[1]} for l in ch.split("\n")[2:]]))
checklist_from(P, "4.5.1", "1. **Public by default.**", "\n\n#### What it is worth", limit=0)
checklist_from(P, "4.5.1", "* **Narrative:**", "\n\n#### Build", limit=30)
lead(P, "4.5.1",
     "**The service-delivery tracker is Firefly's to build and operate; the owned platforms stay with your team.** Every "
     "candidate will promise water points, roads and markets. Only one is professionally qualified in **verifying whether "
     "promises were kept**.")

# ---------------------------------------------------------------- 4.5.2
cut(P, "4.5.2", "\n> Firefly holds no credentials and publishes nothing here.", kind="duplicate", home="decision:1.4.1",
    note="Firefly publishes nothing on his accounts: said once at 1.4.1 (section 6).")
cut(P, "4.5.2", "a rigorous, industrial pipeline", kind="register", new="a pipeline", note="X10: inflated register.")
lead(P, "4.5.2", "**Owner: your team, to a Firefly brief.** Your producers write, film, edit and publish, as they do today. What this workstream adds is the brief and the approval gate.")

# ---------------------------------------------------------------- 4.5.3
ai = block(P, "4.5.3", "AI is used to test and optimise content", "\n\n#### Tools and platforms")
uses, commit = ai.split("\n\n", 1)
spec = ("kind: contrast\nleft:\n  title: \"What AI is used for\"\n  items:\n"
        "    - { label: " + q(oneline(uses)) + " }\n"
        "    - { label: \"AI assists production and optimisation.\" }\n"
        "right:\n  title: \"What it is never used for\"\n  items:\n"
        "    - { label: \"to fabricate imagery of real people\" }\n"
        "    - { label: \"to simulate events that did not occur\" }\n"
        "    - { label: \"to generate synthetic voices of the candidate or any other person\" }\n"
        "body: " + q(oneline(commit)))
swap(P, "4.5.3", ai, fence("visual", spec))
checklist_from(P, "4.5.3", "* Minimum 5 ad variations", "\n\n#### Performance benchmarks", limit=0)
lead(P, "4.5.3", "**Owner: Firefly.** Test design, variant selection and the read on the result are analysis. Your team produces the variants.")

# ---------------------------------------------------------------- 4.5.4
case = block(P, "4.5.4", "* **13.0% of Kitui residents have never attended school**", "\n\nA campaign built on transparency")
ci = bullet_items(case)
swap(P, "4.5.4", case, visual("stats", [
    {"value": "13.0%", "label": "never attended school", "tier": "not yet tiered", "body": oneline(ci[0])},
    {"value": "{{ict.offline}}%", "label": "outside the internet-using population", "tier": 1, "body": oneline(ci[1])},
], extra="body: " + q(oneline(ci[2]) + " " + oneline(ci[3]))))
com = block(P, "4.5.4", "| Area | Commitment |", "\n\n#### Why this is scope")
items = []
for l in com.split("\n")[2:]:
    c = table_cells(l)
    head, rest = split_clause(c[1], limit=20)
    items.append({"label": c[0].strip("*"), "text": head, "body": rest} if head and rest else {"label": c[0].strip("*"), "text": c[1]})
swap(P, "4.5.4", com, visual("checklist", items, title="The commitments"))
replace(P, "4.5.4", "#### The commitments\n\n", "")
lead(P, "4.5.4", "**Owner: Firefly sets the standard; your team applies it.** In a county where 13.0% of the population never attended school, accessibility is reach, not compliance theatre.")

# ================================================================ media
M = "workstreams-media"
lead(M, "4.5.5", "**Owner: your team, to a Firefly brief.** Firefly writes the targeting plan and reads the performance; your team places and publishes.")
replace(M, "4.5.6", "\n[CONFLICT C7: see open items]\n", "\n<!-- keep -->\n[CONFLICT C7: see open items]\n")
jt = block(M, "4.5.6", "| Tier | Who | Cadence | Offer |", "\n\n**Tier C is the underused")
cards = []
for l in jt.split("\n")[2:]:
    c = table_cells(l)
    cards.append({"title": c[0].strip("*"), "text": c[1], "head": {"label": "Offer", "text": c[3]}, "chips": [c[2]]})
swap(M, "4.5.6", jt, visual("cards", cards, preset="journalist"))
_log({"file": M, "section": "4.5.6", "first12": "Tier | Who | Cadence | Offer", "words": 3, "kind": "signpost", "home": "",
      "note": "Table column heads became the cards' layout.", "text": "| Tier | Who | Cadence | Offer |"})
kp = block(M, "4.5.6", "| Metric | Target |\n|---|---|\n| Earned media items per month", "\n\n#### Getting on air")
swap(M, "4.5.6", kp, visual("stats", [{"value": table_cells(l)[1], "label": table_cells(l)[0]} for l in kp.split("\n")[2:]]))
lead(M, "4.5.6",
     "**Owner: your team and the campaign, to a Firefly brief.** Kamba-language radio is the dominant information channel, "
     "**but the ownership map is politically compromised**: the campaign's radio strategy runs through Musyi, County FM and Wikwatyo.")

# ================================================================ ground
R = "workstreams-ground"
cut(R, "4.5.7", " Digital content created in an air-conditioned command center in Nairobi or Kitui Town is worthless if it does not address the live anxieties voiced at the morning livestock auction in Nguni or the wellhead in Mutha.",
    kind="register", note="X10: inflated framing ('air-conditioned command center').")
rep = block(R, "4.5.7", "##### What Ward Coordinators Report:", "\n\n#### From ground intel")
head, rest = rep.split("\n", 1)
cards = []
for x in bullet_items(rest):
    lab, txt = labelled(x)
    cards.append({"title": lab, "text": oneline(txt)})
swap(R, "4.5.7", rep, visual("cards", cards, title=head.replace("##### ", "").rstrip(":"), preset="report"))
nets = block(R, "4.5.7", "##### 1. The Boda Boda Stage Network", "\n\n#### The operating rhythm")
cards = []
for part in re.split(r"\n\n(?=##### )", nets):
    h, rest = part.split("\n", 1)
    fields = []
    for x in bullet_items(rest):
        lines = x.split("\n")
        lab, txt = labelled(lines[0])
        sub = [l[4:] if l.startswith("    ") else l for l in lines[1:]]
        if sub:
            txt = (txt + "\n" if txt else "") + "\n".join("- " + oneline(s) for s in bullet_items("\n".join(sub)))
        fields.append({"label": lab, "text": txt})
    role = next(f for f in fields if f["label"].startswith("Operational"))
    cards.append({"title": re.sub(r"^##### \d+\. ", "", h), "badge": "campaign-owned", "head": role,
                  "fields": [f for f in fields if f is not role]})
swap(R, "4.5.7", nets, visual("cards", cards, preset="network"))
lead(R, "4.5.7", "**Owner: the campaign.** Field intelligence captured by the 40 Ward Coordinators directly dictates the daily digital and radio advertising content; Firefly supplies the reporting template and the analysis of what comes back.")

flow = block(R, "4.5.8", "* **Field to digital synchronization:**", "\n\n#### Governance")
lanes = []
for x in bullet_items(flow):
    lines = x.split("\n")
    title = re.match(r"^\*\*(.+?):\*\*", lines[0]).group(1)
    its = []
    for s in bullet_items("\n".join(l[2:] if l.startswith("  ") else l for l in lines[1:])):
        lab, txt = labelled(s)
        h2, r2 = split_clause(txt, limit=14)
        its.append({"label": lab, "text": h2, "body": r2} if h2 and r2 else {"label": lab, "text": oneline(txt)})
    lanes.append((title, its))
spec = ("kind: contrast\nleft:\n  title: " + q(lanes[0][0]) + "\n  items:\n" + yaml_items(lanes[0][1], "    ") +
        "\nright:\n  title: " + q(lanes[1][0]) + "\n  items:\n" + yaml_items(lanes[1][1], "    "))
swap(R, "4.5.8", flow, fence("visual", spec))
checklist_from(R, "4.5.8", "* Field data is campaign first-party data", limit=0)
lead(R, "4.5.8", "**Owner: the campaign.** Firefly supplies the instrument and its data governance. **Opt-in rate on routed doors** is the joint KPI holding both sides honest.")

cut(R, "4.5.9", " This is the one place in the engagement where\n> Firefly publishes. Everything on the owned social accounts stays with the team that runs them.",
    kind="duplicate", home="decision:1.4.1", note="Firefly publishes only on the offline layer: said once at 1.4.1 (section 6).")
replace(R, "4.5.9", "\n[CONFLICT C2: see open items]\n", "\n<!-- keep -->\n[CONFLICT C2: see open items]\n")
checklist_from(R, "4.5.9", "* **Every bulk send lodged with the operator 48 hours ahead**", "\n\n#### The USSD layer", title="Operational discipline", limit=0)
replace(R, "4.5.9", "**Operational discipline:**\n", "")
_log({"file": R, "section": "4.5.9", "first12": "Operational discipline:", "words": 0, "kind": "signpost", "home": "", "note": "Label became the checklist's title (moved).", "text": "**Operational discipline:**"})
ag = block(R, "4.5.9", "**Proposed use:** agent-sited printed materials", "\n\n#### KPIs for the offline layer")
use, rest = ag.split("\n", 1)
bl = bullet_items(rest + "\n")
card = {"title": "The mobile-money agent network: proposed use", "text": oneline(use.replace("**Proposed use:** ", "")),
        "fields": [{"label": "Conditions", "text": "\n".join("- " + oneline(b) for b in bl)}]}
swap(R, "4.5.9", ag, visual("cards", [card], preset="agent"))
lead(R, "4.5.9",
     "**Owner: Firefly, end to end.** **Bulk political SMS cannot be sent in Kikamba**: the CA/NCIC guidelines restrict "
     "political SMS to **English or Kiswahili** (Tier 1, Communications Authority), lodged with the mobile operator at least "
     "48 hours before sending.")
lead(R, "4.5.10", "**Outside this engagement.** Firefly's contribution is the metric definitions the leaderboard reports against, and nothing else.")

# ================================================================ data
T = "workstreams-data"
checklist_from(T, "4.5.11", "##### Key Architecture Principles:\n1.", "\n\n*The Data Protection Act", limit=0) if False else None
kp = block(T, "4.5.11", "##### Key Architecture Principles:", "\n\n*The Data Protection Act")
head, rest = kp.split("\n", 1)
items = []
for x in bullet_items(rest):
    lab, txt = labelled(x)
    items.append({"label": lab, "body": oneline(txt)})
swap(T, "4.5.11", kp, visual("checklist", items, title=head.replace("##### ", "").rstrip(":")))
lead(T, "4.5.11", "**Owner: Firefly**, as processor on the campaign's behalf, under a written processing agreement (Section 5.3.1).")

body = section(T, "4.5.12")
s_start = body.index("#### What the model scores, and why")
s_end = body.index("#### The compliance gate this depends on")
runins = body[s_start:s_end].rstrip("\n")
steps = []
for part in re.split(r"\n\n(?=#### )", runins):
    h, rest = part.split("\n", 1)
    rest = rest.strip()
    first_para = rest.split("\n\n")[0]
    if first_para.startswith("|") or first_para.startswith("*"):
        steps.append({"label": h.replace("#### ", ""), "body": rest})
    else:
        sent, more = split_clause(first_para, limit=40)
        remaining = (more + "\n\n" if more else "") + rest[len(first_para):].strip()
        steps.append({"label": h.replace("#### ", ""), "text": sent or oneline(first_para), "body": remaining.strip()} if sent else {"label": h.replace("#### ", ""), "body": rest})
swap(T, "4.5.12", runins, visual("stepper", [{k: v for k, v in s.items() if v} for s in steps]))
lead(T, "4.5.12", "**Owner: Firefly — gated on Section 5.3.4.** Until written sign-off, this runs as **ward-level aggregate scoring only**. Individual-level scoring waits for the opinion.")
lead(T, "4.5.13", "**Mostly outside this engagement.** Firefly builds and operates three components only: the **service-delivery tracker**, the **supporter CRM**, and the **SMS/USSD/WhatsApp layer**.")

road = block(T, "4.5.14", "| Stage | Window | Capability | Prerequisite | Owner |", "\n\n**No stage is skipped.**")
evs = []
for l in road.split("\n")[2:]:
    c = table_cells(l)
    evs.append({"when": c[1], "label": c[0].strip("*"), "text": c[2], "fields": [{"label": "Prerequisite", "text": c[3]}, {"label": "Owner", "text": c[4]}]})
swap(T, "4.5.14", road, visual("timeline", evs))
lead(T, "4.5.14", "**Owner: Firefly. This is the engine room of the engagement.** Measurement moves beyond vanity metrics to what drives votes, anchored to the ~{{benchmark}}-vote threshold. **No stage is skipped.**")

# ================================================================ staffing
S = "staffing"
ct = block(S, "4.6.2", "| Role | Function | Decision rights |", "\n\n---")
cards = []
for l in ct.split("\n")[2:]:
    c = table_cells(l)
    cards.append({"title": c[0], "text": c[1], "fields": [{"label": "Decision rights", "text": c[2]}]})
swap(S, "4.6.2", ct, visual("cards", cards, preset="role"))
replace(S, "4.6.3", "| Role | Activated | Function |", "<!-- keep -->\n| Role | Activated | Function |")
replace(S, "4.6.3", "**Community management and video editing are not on this list", "<!-- keep -->\n**Community management and video editing are not on this list")
lead(S, "4.6.5", "Two teams, one interface. The brief is the interface. **Firefly adds three people. It removes none.**")
up = block(S, "4.6.6", "**Week 1 — the capability map, not an appraisal.**", "\n\n**Where a gap cannot be closed")
evs = []
for p in up.split("\n\n"):
    m = re.match(r"^\*\*(.+?) — (.+?)\.\*\*\s*([\s\S]*)$", p.strip())
    evs.append({"when": m.group(1), "label": m.group(2), "body": oneline(m.group(3))})
swap(S, "4.6.6", up, visual("timeline", evs))
print("part 4: done")
