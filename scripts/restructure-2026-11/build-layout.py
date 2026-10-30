#!/usr/bin/env python3
"""Lay the content out in the November 2026 table of contents, mechanically, from the approved map.

Reads docs/restructure-2026-11/units.json (every unit at the pre-restructure commit) and plan.json
(where each goes), and writes content/<route>.md for the new routes. No unit's text is changed here:
old numbered headings give way to the new section headings, and an old heading whose title is not
the new section's survives as an unnumbered #### heading so its words are not lost. Rewording is done
afterwards, by hand, Part by Part.

A one-shot step: it overwrites content/. Run it from the pre-restructure content only.

    python3 scripts/restructure-2026-11/build-layout.py .
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(sys.argv[1])
DOCS = ROOT / "docs" / "restructure-2026-11"
sys.path.insert(0, str(Path(__file__).parent))
from mapping import NEW_TOC  # noqa: E402

units = json.loads((DOCS / "units.json").read_text())
plan = json.loads((DOCS / "plan.json").read_text())["plan"]

CHAPTER_ROUTE = {
    "1": "kitui", "2": "votes", "3": "needs", "4": "news", "5": "race", "6": "record", "7": "diagnosis",
    "8": "goal", "9": "position", "10": "message", "11": "voters", "12": "channels", "13": "engagement",
    "14": "timeline", "16": "coalitions", "17": "team", "18": "success", "19": "lawful", "20": "response",
    "21": "receives", "22": "commitments", "23": "ask",
}
WS_ROUTE = {"15.1": "workstreams-platforms", "15.2": "workstreams-media", "15.3": "workstreams-ground", "15.4": "workstreams-data"}
ANNEX_ROUTE = {"A": "annex-evidence", "B": "annex-county", "C": "annex-playbooks", "D": "annex-volunteers",
               "E": "annex-technology", "F": "annex-runbooks", "G": "annex-terms", "H": "annex-glossary"}
WS_NUMBER = dict(zip([f"4.5.{i}" for i in range(1, 15)], [
    "15.1.1", "15.1.2", "15.1.3", "15.1.4", "15.2.1", "15.2.2", "15.3.1", "15.3.2", "15.3.3", "15.3.4",
    "15.4.1", "15.4.2", "15.4.3", "15.4.4"]))

# Chapters the table of contents gives no sections: they get them, so each has a heading to link to.
EXTRA = {
    "16.1": "The principle behind the sequence", "16.2": "The sequenced calendar", "16.3": "Managing endorsements, and how coalitions are measured",
    "17.1": "Three teams, and how they fit", "17.2": "The Firefly core", "17.3": "Surge roles",
    "17.4": "Leadership, reporting lines and local roles", "17.5": "How the existing team is assessed and upskilled",
    "23.1": NEW_TOC["23.1"],
    "B.1": "The 40-ward register", "C.1": "Platform playbooks", "C.2": "Formats, copy samples and the USSD pointer",
    "D.1": "Volunteer programme reference", "E.1": "Technology reference architecture",
    "E.2": "Voter model: data sources and variable dictionary", "G.1": "Confidentiality and use",
    "H.1": "Terms used in this proposal",
}
OLD_E = {}  # F.n title from the old E.n heading
for u in units:
    if u["route"] == "annex-runbooks" and u.get("hid"):
        n = u["section"]
        k = 11 if n == "E.12" else int(n.split(".")[1])
        OLD_E[f"F.{k}"] = re.sub(r"^## E\.\d+\s+", "", u["raw"]).strip()


def title_of(key):
    if key in EXTRA:
        return EXTRA[key]
    if key in OLD_E:
        return OLD_E[key]
    t = NEW_TOC.get(key, "")
    return re.sub(r"^[A-H]\.\d+\s+", "", t)


def route_of(loc):
    if loc == "Cover":
        return "cover"
    if loc == "In brief":
        return "brief"
    head = loc.split(".")[0]
    if head == "15":
        return WS_ROUTE.get(".".join(loc.split(".")[:2]), "workstreams-platforms")
    if head in ANNEX_ROUTE:
        return ANNEX_ROUTE[head]
    return CHAPTER_ROUTE[head]


def section_of(u, loc):
    """The new section key a unit sits under (None = the route's preamble)."""
    if u["route"] == "delivery" and u["section"] == "4.4":
        h4 = u["h4"] or ""
        return "16.3" if ("endorsement" in h4.lower() or "kpi" in h4.lower()) else ("16.2" if "calendar" in h4.lower() else "16.1")
    if u["route"] in ("staffing",) or loc == "17":
        sec = u["section"] or ""
        return {"4.6": "17.1", "4.6.1": "17.1", "4.6.2": "17.2", "4.6.3": "17.3", "4.6.4": "17.4", "4.6.5": "17.4", "4.6.6": "17.5"}.get(sec, "17.4")
    if u["section"] in WS_NUMBER and loc.startswith("15."):
        return WS_NUMBER[u["section"]]
    if loc == "23":
        return None
    if loc == "B":
        return "B.1" if u["section"] == "B.1" else None
    if loc in ("D",):
        return "D.1"
    if loc == "G":
        return None
    if loc in ("A", "C", "F", "E") or re.fullmatch(r"\d+", loc) or loc == "Cover" or loc == "In brief":
        return None
    if loc == "A.1":
        return u["section"]  # A.1, A.1.1 … kept
    return loc


def heading_line(key):
    level = "###" if key.count(".") >= 2 or (key[0] in "A" and key.count(".") == 2) else "##"
    return f"{level} {key} {title_of(key)}"


files = defaultdict(lambda: defaultdict(list))  # route -> section -> [(order, text)]
for idx, u in enumerate(units):
    p = plan[u["c"]]
    loc = p["loc"]
    route = route_of(loc)
    sec = section_of(u, loc)
    raw = u["raw"]
    if u["kind"] == "heading":
        level = len(re.match(r"^#+", raw).group(0))
        text = re.sub(r"^#+\s+", "", raw).strip()
        num = re.match(r"^((?:\d+(?:\.\d+)*|[A-G](?:\.\d+)+))\.?\s+(.*)$", text)
        if u.get("hid") and u["section"] in WS_NUMBER:
            continue  # replaced by the 15.x.y heading
        if u.get("hid") and route == "annex-evidence" and u["section"].startswith("A.1"):
            continue  # A.1.x headings are regenerated as they were
        if u.get("hid") or (num and level <= 3):
            title = num.group(2) if num else text
            if title.strip().lower() == title_of(sec or "").strip().lower():
                continue
            raw = f"#### {title}"
        else:
            raw = "#### " + text
    if u["keep"]:
        raw = "<!-- keep -->\n" + raw
    files[route][sec].append((idx, raw))

ORDER = ["cover", "brief"] + [CHAPTER_ROUTE[str(i)] for i in range(1, 15)] + list(WS_ROUTE.values()) + \
        [CHAPTER_ROUTE[str(i)] for i in range(16, 24)] + list(ANNEX_ROUTE.values())


def sort_key(k):
    if k is None:
        return (0,)
    parts = k.split(".")
    head = parts[0]
    return (1, ord(head) if not head.isdigit() else int(head)) + tuple(int(x) for x in parts[1:])


written = []
for route in ORDER:
    secs = files.get(route, {})
    # every section the table of contents names gets its heading, filled or not
    wanted = set(secs)
    for key in list(NEW_TOC) + list(EXTRA):
        if key in ("Cover", "In brief") or not re.match(r"^(\d+|[A-H])\.", key):
            continue
        if route_of(key) == route:
            wanted.add(key)
    if route == "annex-evidence":
        wanted.discard("A.1.1"); wanted.discard("A.1.2"); wanted.discard("A.1.3"); wanted.discard("A.1.4")
        for k in ("A.1", "A.1.1", "A.1.2", "A.1.3", "A.1.4"):
            if k in secs:
                wanted.add(k)
    out = []
    for key in sorted(wanted, key=sort_key):
        if key is not None:
            if route == "annex-evidence" and key.startswith("A.1"):
                old = next(u for u in units if u["route"] == "annex-evidence" and u.get("hid") and u["section"] == key)
                out.append(old["raw"])
            elif key.count(".") == 2 and key.startswith("15."):
                old_n = next(k for k, v in WS_NUMBER.items() if v == key)
                old = next(u for u in units if u.get("hid") and u["section"] == old_n)
                out.append("### " + key + " " + re.sub(r"^#+\s+4\.5\.\d+\s+", "", old["raw"]).strip())
            else:
                out.append(heading_line(key))
            out.append("")
        for _, raw in sorted(secs.get(key, [])):
            out.append(raw)
            out.append("")
        if key is not None and not secs.get(key):
            out.append("<!-- restructure 2026-11: to be written from the verified data -->")
            out.append("")
    text = "\n".join(out).rstrip() + "\n"
    (ROOT / "content" / f"{route}.md").write_text(text)
    written.append(route)

old_routes = {u["route"] for u in units}
for r in old_routes - set(written):
    (ROOT / "content" / f"{r}.md").unlink(missing_ok=True)
    (ROOT / "public" / "content" / f"{r}.md").unlink(missing_ok=True)
print(len(written), "routes written:", ", ".join(written))
