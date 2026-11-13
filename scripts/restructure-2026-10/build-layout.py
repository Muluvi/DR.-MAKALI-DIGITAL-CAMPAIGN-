#!/usr/bin/env python3
"""Build the decision-first content layout from the pre-restructure content.

Reads every content/*.md file as it stood at the baseline commit (9681948), cuts each file into
heading blocks that line up one-for-one with docs/restructure-2026-10/mapping.json, and writes the
new content/*.md files in the order preview section 5 sets out. Text is moved verbatim. The only
text this script writes itself is: new and renumbered heading lines, one-line purpose lines,
short bridging pointers, and the [CONFLICT Cn: see open items] markers. Every cut it makes is
recorded, word for word, in docs/restructure-2026-10/layout-log.json.

Re-runnable: it always starts from the baseline commit, so a second run writes the same files.

    python3 -I scripts/restructure-2026-10/build-layout.py
"""
import json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BASE = "9681948"
# --out DIR writes the layout somewhere other than content/ (scripts/renumber-citations.ts uses
# this to regenerate the pre-renumbering text), together with DIR/authored-lines.json: the lines
# this script wrote itself, which carry new numbers and must not be renumbered again.
OUT_DIR = next((a.split("=", 1)[1] for a in sys.argv[1:] if a.startswith("--out=")), os.path.join(ROOT, "content"))
AUTHORED = {}
MAPPING = json.load(open(os.path.join(ROOT, "docs", "restructure-2026-10", "mapping.json"), encoding="utf8"))
OLD_FILES = ["cover", "objectives", "data", "analysis", "strategy", "implementation", "workstreams-platforms",
             "workstreams-media", "workstreams-ground", "workstreams-data", "delivery", "nextsteps",
             "annex-evidence", "annex-county", "annex-messages", "annex-cadence", "annex-runbooks", "annex-terms"]
HEADING = re.compile(r"^(#{2,6})\s+(.+?)\s*$")
FENCE = re.compile(r"^\s*(```+|~~~+)\s*(\S*)")
LEADING = re.compile(r"^((?:\d+[A-Z]?(?:\.\d+)*|[A-G](?:\.\d+)+))\.?\s+")

LOG = {"cuts": [], "droppedHeadings": [], "markers": [], "pointers": [], "moves": [], "notes": [], "added": [], "headingDelta": 0}


def words(lines):
    return sum(len(l.split()) for l in lines)


# ---------------------------------------------------------------------------- read the baseline

def old_source(name):
    return subprocess.check_output(["git", "show", f"{BASE}:content/{name}.md"], cwd=ROOT).decode("utf8")


PREAMBLE = {}
ROWS = []  # one per mapping row: {"file", "level", "title", "body": [lines]}
for name in OLD_FILES:
    lines = old_source(name).split("\n")
    fence = None
    current = None
    pre = []
    for line in lines:
        f = FENCE.match(line)
        if f:
            fence = (f.group(2) or "plain") if fence is None else None
            (current["body"] if current else pre).append(line)
            continue
        h = HEADING.match(line) if fence in (None, "textversion") else None
        if h:
            current = {"file": name, "level": len(h.group(1)), "title": h.group(2).strip(), "body": []}
            ROWS.append(current)
            continue
        (current["body"] if current else pre).append(line)
    PREAMBLE[name] = pre

if len(ROWS) != len(MAPPING):
    sys.exit(f"build-layout: {len(ROWS)} heading blocks against {len(MAPPING)} mapping rows")
for i, (row, m) in enumerate(zip(ROWS, MAPPING)):
    if row["file"] != m["file"] or row["title"] != m["oldTitle"] or row["level"] != m["level"]:
        sys.exit(f"build-layout: row {i} does not line up: {row['file']} {row['title']!r} / {m['file']} {m['oldTitle']!r}")

USED = [0] * len(ROWS)


def strip_number(title):
    return LEADING.sub("", title, count=1) if LEADING.match(title) else title


def find(i, anchor, start=0):
    """Index of the first line in row i's body (from `start`) containing `anchor`."""
    for k in range(start, len(ROWS[i]["body"])):
        if anchor in ROWS[i]["body"][k]:
            return k
    sys.exit(f"build-layout: anchor {anchor!r} not found in row {i} ({ROWS[i]['title']})")


def trim(lines):
    """Drop leading and trailing blank lines."""
    a, b = 0, len(lines)
    while a < b and not lines[a].strip():
        a += 1
    while b > a and not lines[b - 1].strip():
        b -= 1
    return lines[a:b]


# ---------------------------------------------------------------------------- edits to old text

FRAGMENTS = {}


def split(i, anchor, name, offset=0, end_anchor=None):
    """Take the lines of row i from `anchor` (+offset) to `end_anchor` (exclusive) or the end out of
    the row, keeping them as a named fragment to be placed elsewhere."""
    body = ROWS[i]["body"]
    a = find(i, anchor) + offset
    b = find(i, end_anchor, a) if end_anchor else len(body)
    FRAGMENTS[name] = body[a:b]
    ROWS[i]["body"] = body[:a] + [f"@@FRAGMENT-OUT {name}@@"] + body[b:]
    LOG["moves"].append({"row": i, "from": MAPPING[i]["oldRef"] or MAPPING[i]["oldTitle"], "fragment": name,
                         "words": words(FRAGMENTS[name]), "firstLine": trim(FRAGMENTS[name])[0][:90]})


def cut(i, anchor, end_anchor, reason, pointer=None, include_end=True):
    """Remove lines from `anchor` to `end_anchor` (inclusive) in row i, logging the text verbatim."""
    body = ROWS[i]["body"]
    a = find(i, anchor)
    b = find(i, end_anchor, a) + (1 if include_end else 0)
    removed = body[a:b]
    ROWS[i]["body"] = body[:a] + ([pointer] if pointer else []) + body[b:]
    LOG["cuts"].append({"row": i, "oldRef": MAPPING[i]["oldRef"], "oldTitle": MAPPING[i]["oldTitle"], "reason": reason,
                        "words": words(removed), "pointer": pointer, "text": "\n".join(removed)})


def cut_all(i, reason, pointer=None):
    removed = ROWS[i]["body"]
    ROWS[i]["body"] = ["", pointer, ""] if pointer else [""]
    LOG["cuts"].append({"row": i, "oldRef": MAPPING[i]["oldRef"], "oldTitle": MAPPING[i]["oldTitle"], "reason": reason,
                        "words": words(removed), "pointer": pointer, "text": "\n".join(removed)})


POINTER_LINES = set()


def marker(n):
    return f"[CONFLICT C{n}: see open items]"


def mark(i, anchor, n, mode="eol", fragment=None):
    """Mark a conflict location. eol appends to the line (inside the last cell of a table row);
    after puts the marker on its own line after the anchor line; after-fence after the fence that
    holds the anchor."""
    body = FRAGMENTS[fragment] if fragment else ROWS[i]["body"]
    k = next((j for j, l in enumerate(body) if anchor in l), None)
    if k is None:
        sys.exit(f"build-layout: marker anchor {anchor!r} not found")
    m = marker(n)
    if mode == "eol":
        line = body[k].rstrip()
        body[k] = (line[:-1].rstrip() + f" {m} |") if line.endswith("|") else f"{line} {m}"
    elif mode == "after":
        body[k + 1:k + 1] = ["", m]
    elif mode == "after-fence":
        j = next(j for j in range(k + 1, len(body)) if FENCE.match(body[j]))
        if len(body) > j + 2 and body[j + 2].startswith("[CONFLICT"):
            # A second conflict at the same figure shares the marker line, in number order.
            found = re.findall(r"\[CONFLICT C\d+: see open items\]", body[j + 2]) + [m]
            body[j + 2] = " ".join(sorted(found, key=lambda x: int(re.search(r"C(\d+)", x).group(1))))
        else:
            body[j + 1:j + 1] = ["", m]
    LOG["markers"].append({"conflict": f"C{n}", "row": i, "oldRef": MAPPING[i]["oldRef"] or MAPPING[i]["oldTitle"], "anchor": anchor})


def banner_append(i, text):
    """Add a line to the end of the blockquote banner that opens row i's body."""
    body = ROWS[i]["body"]
    k = next(j for j, l in enumerate(body) if l.startswith(">"))
    while k + 1 < len(body) and body[k + 1].startswith(">"):
        k += 1
    body[k + 1:k + 1] = [">", f"> {text}"]
    LOG["added"].append({"where": f"banner of {ROWS[i]['title']}", "words": len(f"> {text}".split()) + 1})


def body_text(i):
    return " ".join(l.strip() for l in ROWS[i]["body"] if l.strip())


def pointer(text, where):
    LOG["pointers"].append({"where": where, "text": text})
    POINTER_LINES.add(f"*{text}*")
    return f"*{text}*"


# Group purposes for the workstream banners. The text is the old group intros (5.2.2 to 5.2.4),
# reused; the platforms group had no intro, so its label is the one the 5.2 overview gives it.
GROUP = {
    "platforms": "**Group: Platforms and content** (workstreams 1 to 4).",
    "media": "**Group: Publishing and earned media.** " + body_text(147),
    "ground": "**Group: Ground and offline reach.** " + body_text(165),
    "data": "**Group: Data and technology.** " + body_text(192),
}
LOG["relocated"] = []
for i in (117, 147, 165, 192):
    LOG["relocated"].append({"row": i, "words": words(ROWS[i]["body"]), "to": "the banner of each workstream in the group"})
    LOG["droppedHeadings"].append({"row": i, "title": MAPPING[i]["oldTitle"], "why": "group heading dissolves; its purpose line moves into each workstream banner"})
    USED[i] = 1  # the heading is dissolved and its one-line intro is reused in the banners
for i in (118, 126, 136, 141):
    banner_append(i, GROUP["platforms"])
for i in (148, 156):
    banner_append(i, GROUP["media"])
for i in (166, 176, 179, 186):
    banner_append(i, GROUP["ground"])
for i in (193, 198, 206, 215):
    banner_append(i, GROUP["data"])

# Orphan and stranded passages (preview 3.3 rows 3, 11, 12, 13), and passages a split moves.
split(49, "What digital reach can and cannot deliver", "lead-in-3.8")                 # 3.7.3 end -> 2.9.3
split(68, "Four pillars, extended from the original three.", "pillar-cross-list")      # 4.1.4 -> 3.2 opening
split(73, "The six segments below describe", "universe-table")                         # 4.3 -> 3.4.1
split(98, "*\"The mission is for Kitui to prosper.", "production-pillar-intro")        # 4.5 -> 3.2.3
split(141, "Language is central to trust in Kitui.", "ws4-language-block", end_anchor="**Governance.**")  # 5.2.1.4 -> 3.6.1
split(206, "A data-driven political campaign requires", "ws13-reference-intro")        # 5.2.4.3 -> G.4
split(228, "id: fig-5-4-ladder", "target-ladder", offset=-1)                           # 5.4 tables -> 4.3.1
split(250, "Political strategy without empirical measurement", "audit-two-part-intro")  # 5.6.4 tail -> 5.2.6
split(259, "> **The meeting cadence (D.1)", "annex-d-pointer", offset=-2)              # stays at the end of 4.1.2
split(266, "What can go wrong and what happens when it does", "risks-intro")           # 5.7.9 tail -> Part 6
split(281, "Dr. Mulu already has a team that publishes every day.", "staffing-opening")  # 5.8.14 tail -> 4.6
split(291, "> [!WARNING]", "odpc-action-box")                                          # 6.2 -> 5.3.6

# Duplicates cut to a cross-reference (preview 7.2), where the canonical home already holds the text
# and the cut carries no {{token}}, no figure and no conflict location.
cut_all(112, "5.1.4 repeats 5.5.1 and 5.5.2: the Level 2 recommendation is stated near-verbatim in 5.5.2 (D2); canonical home 1.5.1")
cut(294, "**Prepared by:**", "0726 766 800", "The closing sign-off block repeats the cover's 'Prepared by' block word for word; canonical home the cover")
# The rule line above the sign-off block goes with it.
_b = ROWS[294]["body"]
_k = max(j for j, l in enumerate(_b) if l.strip() == "---")
LOG["cuts"].append({"row": 294, "oldRef": "6.3.1", "oldTitle": MAPPING[294]["oldTitle"], "reason": "rule line above the cut sign-off block", "words": 1, "pointer": None, "text": _b[_k]})
del _b[_k]
cut_all(332, "F.2 restates the cover: parties, status and confidentiality; canonical home the cover, full terms F.1")
cut(205, "Model deployment is gated.", "if the answer is no.",
    "Restates the fallback 5.7.9 (now 5.3.4) sets out: 'Until step 4 is complete, the campaign operates on first-party consented data and aggregate ward-level statistics only' (mapping: 'Last item reduces to a pointer to 5.3.4')",
    pointer=pointer("The compliance gate, and the fallback the model runs on until it clears, are set out in 5.3.4.", "4.5.12"))

# Conflict markers at every location preview 10.1 lists (old refs in brackets).
mark(141, "| **Kikamba** | **50%** |", 1, fragment="ws4-language-block")    # C1 [5.2.1.4]
mark(93, "id: language-map", 1, "after-fence")                              # C1 [4.4.8]
mark(97, "id: language-deployment", 1, "after-fence")                       # C1 [4.4.11]
mark(103, "are checked in the Monday review.", 1)                                      # C1 [4.5.5]
mark(93, "id: language-map", 2, "after-fence")                              # C2 [4.4.8]
mark(181, "`[VERIFY whether in force]`", 2, "after")                        # C2 [5.2.3.3]
mark(109, "Dr. Mulu already holds.", 3)                                     # C3 [5.1.1]
mark(245, "and boundaries stated so that what is outside them", 3)          # C3 [5.5.4]
mark(111, "Firefly operates end to end.", 4)                                # C4 [5.1.3]
mark(114, "within **2 hours** during peak periods.", 4)                     # C4 [5.1.6]
mark(286, "campaign has.", 4)                                               # C4 [5.9.3]
mark(120, "road, a market without sanitation, a stalled project.", 5)       # C5 [5.2.1.1]
mark(212, "Displays verifiable records of 13 years", 5, "after-fence")      # C5 [5.2.4.3]
mark(252, "**Governor's Day-One Public Delivery Dashboard**.", 5)           # C5 [5.6.6]
mark(43, "but it is the campaign's policy call.**", 6)                      # C6 [3.5]
mark(86, "Million per ward annually", 6)                                    # C6 [4.4.1]
mark(127, "Ward Equalization Fund, solar water within 1 km", 6)             # C6 [5.2.1.2]
mark(131, "Reply STOP to opt out.", 6)                                      # C6 [5.2.1.2]
mark(161, "methodology-first allocation formula", 6)                        # C6 [5.2.2.2]
mark(24, "These are the placement targets.", 7)                             # C7 [2.7.1]
mark(54, "so it ranks the stations rather than sizing Kitui's audience.", 7)  # C7 [3.8.1]
mark(75, "**Primary:** Kamba Vernacular Radio", 7)                          # C7 [4.3.2]
mark(157, "| **KBC Mwatu FM** |", 7, "after")                               # C7 [5.2.2.2]
mark(269, "**Broadcast Vernacular Radio Triage", 7)                         # C7 [5.8.2]
mark(11, "**Turnout, 2022:**", 8)                                           # C8 [2.1]
mark(27, "total ballots cast equal approximately", 8)                       # C8 [3.1]
mark(73, "| Expected turnout universe |", 8, fragment="universe-table")     # C8 [4.3 universe table, new 3.4.1]

# The WS1 tracker KPIs end on a rule; the merged tracker from old 5.6.6 goes in before it.
_b = ROWS[125]["body"]
_k = max(j for j, l in enumerate(_b) if l.strip() == "---")
ROWS[125]["body"], TRACKER_RULE = _b[:_k], _b[_k:]

# ---------------------------------------------------------------------------- the emitter

OUT = {}
cur = None
cur_name = None
LAST = None


def file(name, purpose=None, preamble_of=None):
    global cur, cur_name
    cur = OUT.setdefault(name, [])
    cur_name = name
    if purpose:
        cur += [purpose, ""]
        AUTHORED.setdefault(name, []).append(purpose)
        LOG["pointers"].append({"where": f"{name}.md opening", "text": purpose})
    if preamble_of:
        cur += trim(PREAMBLE[preamble_of]) + [""]


def H(level, number, title):
    line = "#" * level + " " + (f"{number} " if number else "") + title
    cur.extend([line, ""])
    AUTHORED.setdefault(cur_name, []).append(line)
    LOG["added"].append({"where": f"new heading {number}", "words": len(line.split())})


def T(*lines):
    cur.extend(list(lines) + [""])
    AUTHORED.setdefault(cur_name, []).extend(lines)
    if not (len(lines) == 1 and lines[0].startswith("*") and lines[0].endswith("*")):
        LOG["added"].append({"where": "text", "words": sum(len(l.split()) for l in lines)})


def P(text, where):
    T(pointer(text, where))


def preamble(name):
    cur.extend(trim(PREAMBLE[name]) + [""])
    LOG["notes"].append(f"preamble of old {name}.md placed with the content of its first heading")


def frag(name):
    cur.extend(trim(FRAGMENTS[name]) + [""])


def R(i, mode="num", number=None, level=None, title=None):
    """Emit row i. mode: num (renumbered heading), runin (unnumbered at `level`), keep (heading as
    it was), drop (heading line removed, body kept)."""
    global LAST
    row = ROWS[i]
    USED[i] += 1
    old_title = strip_number(row["title"]) if row["level"] <= 3 else row["title"]
    body = [line for line in row["body"] if not line.startswith("@@FRAGMENT-OUT")]
    # Two rows that were adjacent in the old file and are emitted adjacently again keep exactly the
    # spacing they had: this is what keeps a ```textversion fence that spans several rows intact.
    if LAST and LAST[0] == i - 1 and LAST[1] is cur and LAST[2] == len(cur) and ROWS[i - 1]["file"] == row["file"]:
        cur.pop()
        cur.extend([""] * LAST[3])
    # Keep the spacing the author used between a heading and its first line.
    lead = 0
    while lead < len(body) and not body[lead].strip():
        lead += 1
    tail = 0
    while tail < len(body) - lead and not body[len(body) - 1 - tail].strip():
        tail += 1
    gap = [""] * lead
    old_line_words = len(row["title"].split()) + 1
    if mode == "num":
        lv = level or (2 if number.count(".") == 1 else 3)
        cur.extend(["#" * lv + f" {number} " + (title or old_title)] + gap)
    elif mode == "runin":
        cur.extend(["#" * level + " " + (title or old_title)] + gap)
    elif mode == "keep":
        cur.extend(["#" * (level or row["level"]) + " " + row["title"]] + gap)
    if mode != "drop":
        LOG["headingDelta"] += len(cur[-1 - len(gap)].split()) - old_line_words
    elif mode == "drop":
        LOG["droppedHeadings"].append({"row": i, "title": row["title"], "why": MAPPING[i]["disposition"] + ": " + MAPPING[i]["note"]})
    if trim(body):
        cur.extend(trim(body) + [""])
    LAST = (i, cur, len(cur), tail)


def runs(rows, level):
    for i in rows:
        R(i, "runin", level=level)


# ============================================================================ the new document

# ---- Cover
file("cover", preamble_of="cover")
R(0, "keep")

# ---- Part 1: The decision
file("decision", purpose="The decision first: what is being asked, what Dr. Mulu receives and at which level, who does what, and what the campaign must decide or provide.")
R(293, "num", "1.1", title="The ask: one week and one export")
R(294, "runin", level=4)
R(295, "runin", level=4)
H(2, "1.2", "The goal and the two deadlines")
preamble("objectives")
R(1, "runin", level=4)
R(2, "runin", level=4)
R(3, "num", "1.3")
for i, n in zip(range(4, 9), ["1.3.1", "1.3.2", "1.3.3", "1.3.4", "1.3.5"]):
    R(i, "num", n)
R(108, "num", "1.4", title="Who does what: ownership and boundaries")
# the implementation preamble belongs at the head of 1.4's body, ahead of the old 5.1 text
_pos = len(cur) - len(trim(ROWS[108]["body"])) - 1
cur[_pos:_pos] = trim(PREAMBLE["implementation"]) + [""]
LOG["notes"].append("preamble of old implementation.md placed at the head of 1.4, with the content of its first heading")
R(9, "num", "1.4.1")
H(3, "1.4.2", "The fourteen workstreams, by owner")
R(109, "runin", level=4)
R(110, "runin", level=4)
R(259, "runin", level=4)
R(111, "num", "1.4.3")
P("How the three engagement levels change what runs, and the Level 2 recommendation, are set out once, in 1.5.1.", "1.4.3 (pointer for removed 5.1.4)")
USED[112] += 1
LOG["droppedHeadings"].append({"row": 112, "title": ROWS[112]["title"], "why": "Removed: " + MAPPING[112]["note"]})
R(238, "num", "1.5")
R(239, "num", "1.5.1")
runs([240, 241, 242], 4)
R(243, "num", "1.5.2")
R(244, "num", "1.5.3")
R(245, "num", "1.6")
H(2, "1.7", strip_number(ROWS[290]["title"]))
preamble("nextsteps")
USED[290] += 1
LOG["headingDelta"] -= len(ROWS[290]["title"].split()) + 1  # the H() line above replaces this heading
cur.extend(trim(ROWS[290]["body"]) + [""])
R(292, "num", "1.8")
R(10, "num", "1.9")
P("The indicators themselves are set out in 5.1.", "1.9")

# ---- Part 2: The evidence
file("evidence", preamble_of="data")
LOG["notes"].append("preamble of old data.md is the opening line of evidence.md, ahead of its first heading as before")
H(2, "2.1", "The electorate and the number it takes")
R(11, "runin", level=4)
preamble("analysis")
R(27, "runin", level=4)
R(12, "num", "2.2")
R(28, "num", "2.3")
R(29, "keep")
R(30, "num", "2.3.1")
runs([31, 32], 4)
R(33, "num", "2.4")
for i in range(34, 38):
    R(i, "keep")
R(13, "num", "2.5")
R(14, "num", "2.5.1")
R(15, "num", "2.5.2")
H(2, "2.6", "The field: rivals and an open seat")
R(42, "runin", level=4)
R(43, "num", "2.6.1")
R(44, "num", "2.6.2")
R(282, "num", "2.6.3")
R(277, "num", "2.6.4")
R(38, "num", "2.7")
R(39, "num", "2.7.1")
runs([40, 41], 4)
R(45, "num", "2.7.2")
H(2, "2.8", "The county: people, budget and three regions")
R(16, "num", "2.8.1")
R(17, "keep")
R(18, "num", "2.8.2")
R(19, "keep")
R(46, "num", "2.8.3")
runs([47, 48, 49], 4)
H(2, "2.9", "How voters get information, and what each channel can reach")
R(20, "num", "2.9.1")
runs([21, 22], 4)
R(23, "num", "2.9.2")
R(24, "drop")
H(3, "2.9.3", strip_number(ROWS[50]["title"]))
frag("lead-in-3.8")
USED[50] += 1
LOG["headingDelta"] -= len(ROWS[50]["title"].split()) + 1  # the H() line above replaces this heading
cur.extend(trim(ROWS[50]["body"]) + [""])
runs([51, 52], 4)
R(53, "num", "2.9.4")
runs(range(54, 59), 4)
H(2, "2.10", "His record and his channels today")
R(25, "num", "2.10.1")
R(26, "num", "2.10.2")
R(59, "num", "2.10.3")
R(60, "runin", level=4)
R(61, "num", "2.11")
R(62, "drop")
R(63, "num", "2.12")

# ---- Part 3: The strategy
file("strategy", preamble_of="strategy")
R(64, "num", "3.1")
for i, n in zip((65, 66, 67), ("3.1.1", "3.1.2", "3.1.3")):
    R(i, "num", n)
H(2, "3.2", "The pillar architecture")
frag("pillar-cross-list")
H(3, "3.2.1", "Campaign pillars")
R(68, "runin", level=4)
R(69, "runin", level=4)
R(83, "num", "3.2.2")
runs([84, 85, 86], 4)
H(3, "3.2.3", "Production pillars and the visit-to-verification loop")
frag("production-pillar-intro")
runs([99, 100, 101, 102], 4)
R(127, "keep")
R(70, "num", "3.2.4")
H(2, "3.3", "Where the effort goes, and which channel does which job")
R(71, "num", "3.3.1")
R(72, "keep")
R(104, "num", "3.3.2")
R(105, "num", "3.3.3")
R(73, "num", "3.4")
H(3, "3.4.1", "The universes: voter, turnout, victory, base, persuasion, mobilisation")
frag("universe-table")
R(74, "num", "3.4.2")
runs(range(75, 81), 4)
R(81, "num", "3.4.3")
R(82, "num", "3.5")
R(87, "num", "3.5.1")
H(3, "3.5.2", strip_number(ROWS[88]["title"]))
R(88, "drop")
runs([89, 90], 4)
R(91, "num", "3.5.3")
H(2, "3.6", "Language, register and dialect")
H(3, "3.6.1", "Which language reaches which voters, on which channel")
R(92, "drop")
R(93, "drop")
frag("ws4-language-block")
R(97, "runin", level=4)
R(94, "num", "3.6.2")
R(95, "keep")
R(96, "num", "3.6.3")
H(2, "3.7", "A week of publishing, before and after")
R(98, "drop")
R(103, "runin", level=4)
R(107, "num", "3.8")

# ---- Part 4: Delivery
file("delivery", purpose="How the engagement is run, when and by whom: the weekly operating rhythm, the first weeks, the phases to August 2027 and the coalition calendar.")
R(256, "num", "4.1", title="How the engagement runs week to week")
R(257, "num", "4.1.1")
R(258, "num", "4.1.2")
frag("annex-d-pointer")
R(260, "num", "4.1.3")
H(2, "4.2", "The first weeks: audit, foundations, instrumentation")
H(3, "4.2.1", strip_number(ROWS[220]["title"]))
preamble("delivery")
USED[220] += 1
LOG["headingDelta"] -= len(ROWS[220]["title"].split()) + 1  # the H() line above replaces this heading
cur.extend(trim(ROWS[220]["body"]) + [""])
R(227, "num", "4.2.2")
R(106, "num", "4.2.3")
H(2, "4.3", strip_number(ROWS[228]["title"]))
T("Phase −1 and Phase 0 are set out in 4.2.")  # the pointer the brief asks for under 4.3
USED[228] += 1
LOG["headingDelta"] -= len(ROWS[228]["title"].split()) + 1  # the H() line above replaces this heading
cur.extend(trim([l for l in ROWS[228]["body"] if not l.startswith("@@")]) + [""])
H(3, "4.3.1", "The target ladder")
frag("target-ladder")
for i, n in zip(range(229, 233), ("4.3.2", "4.3.3", "4.3.4", "4.3.5")):
    R(i, "num", n)
H(2, "4.4", "Coalitions and endorsements")
R(233, "drop")
runs([234, 235, 236, 237], 4)

# ---- 4.5 The fourteen workstreams
file("workstreams-platforms")
R(116, "num", "4.5", title="The fourteen workstreams")
R(113, "drop")
P("The two scope lists below stay together, rather than being split across the workstreams that deliver them, until conflict C4 is settled.", "4.5 (old 5.1.6 and 5.1.7)")
R(114, "runin", level=4)
R(115, "runin", level=4)
R(118, "num", "4.5.1")
runs(range(119, 126), 4)
R(252, "runin", level=4)
R(253, "runin", level=5)
cur.extend(TRACKER_RULE + [""])
R(126, "num", "4.5.2")
# where the content pillars, formats and copy samples were, a pointer to their new homes
P("The four content pillars are now in 3.2.3, with the other production pillars. Formats by channel and the radio, SMS and USSD copy samples are in Annex G.2.", "4.5.2")
runs([133, 134, 135], 4)
R(136, "num", "4.5.3")
runs(range(137, 141), 4)
R(141, "num", "4.5.4")
# the language block now opens 3.6.1; a pointer stands where it was
_b = cur
_k = max(j for j, l in enumerate(_b) if l.startswith("**Governance.**"))
_b[_k:_k] = [pointer("The languages this standard works in, and the content mix for locally facing platforms, are set out in 3.6.1.", "4.5.4"), ""]
runs(range(142, 147), 4)

file("workstreams-media")
R(148, "num", "4.5.5")
P("The platform-by-platform playbooks (Facebook, X, WhatsApp, TikTok, Instagram, YouTube and Google Ads) are in Annex G.1.", "4.5.5")
R(156, "num", "4.5.6")
runs(range(157, 165), 4)

file("workstreams-ground")
R(166, "num", "4.5.7")
R(167, "keep"); R(168, "keep"); R(169, "keep"); R(170, "keep")
for i in range(171, 176):
    R(i, "keep")
R(176, "num", "4.5.8")
runs([177, 178], 4)
R(179, "num", "4.5.9")
runs(range(180, 186), 4)
R(186, "num", "4.5.10")
P("The volunteer programme reference (tiers, gamification, tooling and KPIs) is in Annex G.3.", "4.5.10")

file("workstreams-data")
R(193, "num", "4.5.11")
R(194, "keep"); R(195, "keep")
P("The Data Protection Act obligations this layer works under, and its mandatory compliance safeguards, are set out with the rest of compliance in 5.3.2.", "4.5.11")
R(198, "num", "4.5.12")
R(199, "keep")
P("The data sources the model draws on are listed in Annex G.5.", "4.5.12")
R(201, "keep")
P("The model's variable dictionary is in Annex G.5.", "4.5.12")
R(203, "keep"); R(204, "keep"); R(205, "keep")
R(206, "num", "4.5.13")
P("The reference architecture the campaign owns (component by component, the procurement matrix and the technical security protocols) is in Annex G.4.", "4.5.13")
R(215, "num", "4.5.14")
runs(range(216, 220), 4)

# ---- 4.6 Staffing
file("staffing", purpose="Who does the work: the Firefly core, the surge roles activated by phase and level, and how the existing team is assessed and upskilled.")
R(283, "num", "4.6")
# the 5.9 opening paragraphs and org chart, stranded under old 5.8.14, open 4.6 again
_pos = len(cur) - len(trim(ROWS[283]["body"])) - 1
cur[_pos:_pos] = trim(FRAGMENTS["staffing-opening"]) + [""]
for i, n in zip(range(284, 290), ("4.6.1", "4.6.2", "4.6.3", "4.6.4", "4.6.5", "4.6.6")):
    R(i, "num", n)

# ---- Part 5: Measurement and governance
file("measurement", purpose="How progress is measured, how the Week 1 presence audit is run, and how the work is kept lawful.")
R(246, "num", "5.1", title="The indicators")
H(3, "5.1.1", "Stage scorecards: nomination window and general election")
runs([247, 248], 4)
R(249, "drop")
R(250, "num", "5.1.2")
R(254, "num", "5.1.3")
R(255, "num", "5.1.4")
H(2, "5.2", "The presence audit: method")
R(223, "drop")
for i, n in zip((221, 222, 224, 225, 226), ("5.2.1", "5.2.2", "5.2.3", "5.2.4", "5.2.5")):
    R(i, "num", n)
H(3, "5.2.6", strip_number(ROWS[251]["title"]))
frag("audit-two-part-intro")
USED[251] += 1
LOG["headingDelta"] -= len(ROWS[251]["title"].split()) + 1  # the H() line above replaces this heading
cur.extend(trim(ROWS[251]["body"]) + [""])
H(2, "5.3", "Data protection, ethics and compliance")
R(261, "drop")
R(262, "num", "5.3.1")
H(3, "5.3.2", "The regulatory environment and compliance measures")
runs([263, 264], 4)
R(196, "keep")
R(197, "keep")
R(265, "num", "5.3.3")
R(266, "num", "5.3.4")
H(3, "5.3.5", "Statutory compliance, IEBC clearance and liability")
runs([278, 279, 280], 4)
H(3, "5.3.6", "Open regulatory action items")
R(291, "drop")
frag("odpc-action-box")

# ---- Part 6: Risks and response
file("risks")
frag("risks-intro")
LOG["notes"].append("the 5.8 intro stranded at the end of old 5.7.9 opens risks.md, immediately ahead of 6.1")
R(267, "num", "6.1")
H(2, "6.2", "Rapid response and the war room")
R(268, "num", "6.2.1")
R(269, "num", "6.2.2")
R(270, "num", "6.2.3")
R(271, "drop")
R(272, "num", "6.2.4")
H(2, "6.3", "Manipulated media and cybersecurity")
R(273, "drop")
R(274, "num", "6.3.1")
H(2, "6.4", "Competitor monitoring")
R(275, "drop")
P("Analysis of the rivals themselves is in 2.6.4; the tools and outputs are in Annex E.4 and E.12.", "6.4")
R(276, "num", "6.4.1")
R(281, "num", "6.5", level=2)

# ---- Annexes A to F
file("annex-evidence", preamble_of="annex-evidence")
for i in range(296, 302):
    R(i, "keep")
file("annex-county", preamble_of="annex-county")
for i in range(302, 314):
    R(i, "keep")
R(314, "keep")
_k = max(j for j, l in enumerate(cur) if l.startswith("*   **Dr. Irene Kasalu"))
cur[_k:_k] = [pointer("The field itself is analysed in 2.6; each line below records the documents a rival's attributes rest on.", "B.5"), ""]
file("annex-messages", preamble_of="annex-messages")
R(315, "keep"); R(316, "keep")
file("annex-cadence", preamble_of="annex-cadence")
R(317, "keep"); R(318, "keep")
file("annex-runbooks", preamble_of="annex-runbooks")
for i in range(319, 329):
    R(i, "keep")
R(330, "keep")
R(329, "runin", level=4)
file("annex-terms", preamble_of="annex-terms")
R(331, "keep")
P("Who this proposal is for, who prepared it, and its status are stated once, on the cover.", "Annex F (pointer for F.2)")
R(332, "drop")

# ---- Annex G (new)
file("annex-spec", purpose="ANNEX G. Channel and technical specifications: the platform playbooks, formats and copy samples, the volunteer programme reference, the technology reference architecture, and the voter model's data sources and variables. Reference the main text points to, not argues from.")
H(2, "G.1", "Platform playbooks")
runs(range(149, 156), 4)
H(2, "G.2", "Formats, copy samples and USSD pointer")
R(128, "keep"); R(129, "keep")
for i in (130, 131, 132):
    R(i, "keep")
H(2, "G.3", "Volunteer programme reference")
runs(range(187, 192), 4)
H(2, "G.4", "Technology reference architecture")
frag("ws13-reference-intro")
R(207, "keep")
for i in range(208, 213):
    R(i, "keep")
R(213, "keep"); R(214, "keep")
H(2, "G.5", "Voter model: data sources and variable dictionary")
R(200, "keep"); R(202, "keep")

# ---------------------------------------------------------------------------- checks and write

bad = [(i, MAPPING[i]["oldRef"] or MAPPING[i]["oldTitle"], n) for i, n in enumerate(USED) if n != 1]
if bad:
    sys.exit(f"build-layout: rows not placed exactly once: {bad[:20]}")
for name, lines in OUT.items():
    # Blocks are joined with one blank line; a block's own internal spacing is left as written.
    while lines and not lines[-1].strip():
        lines.pop()
    text = "\n".join(lines) + "\n"
    if "@@" in text:
        sys.exit(f"build-layout: unplaced marker in {name}.md")
    with open(os.path.join(OUT_DIR, f"{name}.md"), "w", encoding="utf8") as fh:
        fh.write(text)
    # Pointer lines can be placed into a file by index (the 4.5.4 and B.5 pointers), so they are
    # collected here from the finished text rather than at the call.
    AUTHORED.setdefault(name, []).extend(l for l in lines if l in POINTER_LINES and l not in AUTHORED[name])

for gone in ("objectives", "data", "analysis", "implementation", "nextsteps"):
    p = os.path.join(OUT_DIR, f"{gone}.md")
    if os.path.exists(p):
        os.remove(p)

json.dump(AUTHORED, open(os.path.join(OUT_DIR if OUT_DIR != os.path.join(ROOT, "content") else os.path.join(ROOT, "docs", "restructure-2026-10"),
                                      "authored-lines.json"), "w", encoding="utf8"), indent=1, ensure_ascii=False)
if OUT_DIR == os.path.join(ROOT, "content"):
    json.dump(LOG, open(os.path.join(ROOT, "docs", "restructure-2026-10", "layout-log.json"), "w", encoding="utf8"), indent=1, ensure_ascii=False)
print(f"build-layout: {len(OUT)} files written; {len(LOG['cuts'])} cuts ({sum(c['words'] for c in LOG['cuts'])} words), "
      f"{len(LOG['markers'])} conflict markers, {len(LOG['pointers'])} pointers and purpose lines, "
      f"{len(LOG['droppedHeadings'])} heading lines dropped")
