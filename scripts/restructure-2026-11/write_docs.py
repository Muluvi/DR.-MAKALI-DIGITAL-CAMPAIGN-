#!/usr/bin/env python3
"""Turn units.json + mapping.py into docs/restructure-2026-11/inventory.md and the draft map.

    python3 scripts/restructure-2026-11/inventory.py . docs/restructure-2026-11/units.json
    python3 scripts/restructure-2026-11/write_docs.py .
"""
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
from mapping import NEW_TOC, SECTION_MAP, OVERRIDES, R, W, MV, CO, RV  # noqa: E402

ROOT = Path(sys.argv[1])
OUTDIR = ROOT / "docs" / "restructure-2026-11"
OUTDIR.mkdir(parents=True, exist_ok=True)
UNITS = OUTDIR / "units.json"
units = json.loads(UNITS.read_text())
by_c = {u["c"]: u for u in units}
errors = []


def match(route, sub):
    if sub.startswith("="):
        hits = [u for u in units if u["route"] == route and u["raw"].strip() == sub[1:]]
    else:
        hits = [u for u in units if u["route"] == route and sub in (u["raw"] + "\n")]
    if len(hits) != 1:
        errors.append(f"{route}: {sub[:70]!r} matched {len(hits)} units {[h['c'] for h in hits]}")
        return None
    return hits[0]


def cref(route, sub):
    u = match(route, sub)
    return u["c"] if u else "C?"


# ---------- 1. mapping ----------
plan = {}
for u in units:
    loc = SECTION_MAP.get((u["route"], u["section"]))
    if loc is None:
        loc = SECTION_MAP.get((u["route"], None))
    if loc is None:
        errors.append(f"no section map for {u['c']} {u['route']} {u['section']}")
        loc = "?"
    if u["kind"] in ("visual", "figure", "table", "textversion"):
        t = MV
    else:
        t = W
    if u["route"] == "annex-county" and u["section"] == "B.1":
        t = R
    if u["route"] == "annex-evidence" and u["section"] and u["kind"] in ("visual", "figure", "table"):
        t = R
    note = ""
    if u["keep"]:
        t, note = R, "Keep-marked text: wording retained verbatim."
    plan[u["c"]] = {"loc": loc, "t": t, "note": note}

# automatic: a lead that repeats a later unit in the same section merges into it
def norm(s):
    s = re.sub(r"\{\{[^}]*\}\}", "", s)
    s = re.sub(r"[^a-z ]", "", s.lower())
    return re.sub(r"\s+", " ", s).strip()

for i, u in enumerate(units):
    if u["kind"] != "lead":
        continue
    key = norm(u["body"])[:70]
    for v in units[i + 1:i + 12]:
        if v["route"] != u["route"] or v["section"] != u["section"]:
            break
        if v["kind"] in ("paragraph", "callout", "list") and key and key in norm(v["body"]):
            plan[u["c"]].update(t=("MERGE", v["c"]), note="Lead repeats the passage beneath it word for word; one survives.")
            break

for route, sub, loc, t, note in OVERRIDES:
    u = match(route, sub)
    if not u:
        continue
    if isinstance(t, tuple) and t[0] == "MERGE":
        targets = [cref(r, s) for r, s in t[1]]
        t = ("MERGE", ", ".join(targets))
    plan[u["c"]] = {"loc": loc, "t": t, "note": note}


def tlabel(t):
    if isinstance(t, tuple):
        return f"Merged with {t[1]}"
    return t


def loc_label(loc):
    title = NEW_TOC.get(loc)
    if loc in ("Cover", "In brief"):
        return loc
    return f"{loc} {title}" if title else loc


# ---------- 2. proposed routes and new heading ids ----------
CHAPTER_ROUTE = {
    "1": "kitui", "2": "votes", "3": "needs", "4": "news", "5": "race", "6": "record", "7": "diagnosis",
    "8": "goal", "9": "position", "10": "message", "11": "voters", "12": "channels", "13": "engagement",
    "14": "timeline", "16": "coalitions", "17": "team", "18": "success", "19": "lawful", "20": "response",
    "21": "receives", "22": "commitments", "23": "ask",
}
WS_ROUTE = {"15.1": "workstreams-platforms", "15.2": "workstreams-media", "15.3": "workstreams-ground", "15.4": "workstreams-data"}
ANNEX_ROUTE = {"A": "annex-evidence", "B": "annex-county", "C": "annex-playbooks", "D": "annex-volunteers",
               "E": "annex-technology", "F": "annex-runbooks", "G": "annex-terms", "H": "annex-glossary"}
WS_NUMBER = {f"4.5.{i}": n for i, n in zip(range(1, 15), [
    "15.1.1", "15.1.2", "15.1.3", "15.1.4", "15.2.1", "15.2.2", "15.3.1", "15.3.2", "15.3.3", "15.3.4",
    "15.4.1", "15.4.2", "15.4.3", "15.4.4"])}


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
    return CHAPTER_ROUTE.get(head, "?")


def new_id(u):
    """Where an old heading id should land after the restructure."""
    p = plan[u["c"]]
    if u["section"] in WS_NUMBER and u.get("hid") and u["hid"].endswith(u["section"].replace(".", "-")):
        n = WS_NUMBER[u["section"]]
        return f"{route_of(n)}-sec-{n.replace('.', '-')}"
    loc = p["loc"]
    if isinstance(p["t"], tuple):  # merged heading: lands where the surviving unit lands
        tgt = by_c[p["t"][1].split(",")[0].strip()]
        loc = plan[tgt["c"]]["loc"] if tgt["c"] in plan else loc
    r = route_of(loc)
    if r in ("cover", "brief"):
        return f"{r} (route top)"
    if loc in ANNEX_ROUTE:  # annex with no subsection: route top
        return f"{r}-sec-{loc.lower()}" if loc in ("B",) else f"{r} (route top)"
    return f"{r}-sec-{loc.replace('.', '-').lower()}"


# ---------- 3. cross-reference check ----------
live_numbers = {}
for u in units:
    if u.get("hid"):
        live_numbers[u["section"]] = u["c"]
REF = re.compile(r"(?:Sections?|§|Annex)\s*((?:\d+(?:\.\d+)*)|(?:[A-G](?:\.\d+)*))(?:\s*(?:–|-|and|&|,)\s*((?:\d+(?:\.\d+)*)|(?:[A-G](?:\.\d+)+)))?")
bad_refs = []
for u in units:
    txt = u["raw"]
    for m in REF.finditer(txt):
        for g in (m.group(1), m.group(2)):
            if not g:
                continue
            if re.fullmatch(r"[A-G]", g):
                continue  # whole annex
            if re.fullmatch(r"\d", g):
                if int(g) <= 6:
                    continue  # whole part
            if g in live_numbers:
                continue
            if re.match(r"(19|20)\d\d", g):
                continue
            bad_refs.append((u["c"], u["file"], u["line"], g, txt[max(0, m.start() - 40):m.end() + 30].replace("\n", " ")))

# ---------- 4. naming variants ----------
NAME_PATTERNS = [
    ("Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS", r"Hon\. Dr\. Benson Makali Mulu, PhD \(Economics\), CBS"),
    ("Hon. Dr. Benson Makali Mulu (no honours)", r"Hon\. Dr\. Benson Makali Mulu(?!, PhD)"),
    ("Dr. Benson Makali Mulu", r"(?<!Hon\. )Dr\. Benson Makali Mulu"),
    ("Dr. Makali Mulu", r"Dr\. Makali Mulu"),
    ("Dr. Mulu", r"Dr\. Mulu\b"),
    ("Makali Mulu (bare, e.g. search terms)", r"(?<!Dr\. )(?<!Benson )Makali Mulu"),
    ("@MakaliMulu", r"@MakaliMulu"),
]
name_counts = []
for label, pat in NAME_PATTERNS:
    per_file = Counter()
    for u in units:
        per_file[u["route"]] += len(re.findall(pat, u["raw"]))
    total = sum(per_file.values())
    name_counts.append((label, total, ", ".join(f"{k} {v}" for k, v in per_file.items() if v)))

# ---------- 5. hard-coded data literals (numbers the figure guard does not catch) ----------
LIT = re.compile(r"(?:KSh|Ksh)\s?\d[\d.,]*\s?(?:bn|billion|million|m|M)?\b|\b\d{1,2}(?:\.\d+)?%|\b\d+(?:\.\d+)?\s?(?:persons|km²|km\b|people/km)")
literals = []
for u in units:
    if u["kind"] == "figure":
        continue
    raw = re.sub(r"\{\{[^}]*\}\}", "", u["raw"])
    found = sorted(set(LIT.findall(raw)))
    if found:
        literals.append((u["c"], u["file"], u["line"], found))

# ---------- 6. markers ----------
markers = defaultdict(list)
for u in units:
    for m in re.finditer(r"\[CHECK REF\]|\[CONFLICT C\d: see open items\]|\[VERIFY[^\]]*\]|`\[[^\]]+\]`|\[Insert[^\]]*\]|\[Confirm[^\]]*\]|\[shortcode\]", u["raw"]):
        markers[m.group(0) if "CONFLICT" in m.group(0) or "CHECK" in m.group(0) else "placeholder: " + m.group(0)].append((u["c"], u["file"], u["line"]))

# ---------- 7. near-duplicate paragraphs (automatic sweep) ----------
import difflib
prose = [u for u in units if u["kind"] in ("paragraph", "lead", "callout", "list") and len(norm(u["body"])) > 80]
near = []
for i, a in enumerate(prose):
    na = norm(a["body"])
    for b in prose[i + 1:]:
        nb = norm(b["body"])
        if abs(len(na) - len(nb)) > max(len(na), len(nb)) * 0.6:
            continue
        if na[:60] in nb or nb[:60] in na:
            near.append((a["c"], b["c"], "prefix"))
            continue
        r = difflib.SequenceMatcher(None, na, nb).quick_ratio()
        if r > 0.9 and difflib.SequenceMatcher(None, na, nb).ratio() > 0.8:
            near.append((a["c"], b["c"], f"{r:.2f}"))

json.dump({"plan": {k: {"loc": v["loc"], "t": tlabel(v["t"]), "note": v["note"]} for k, v in plan.items()}},
          open(OUTDIR / "plan.json", "w"), indent=1)

# expose for the markdown writer
STATE = dict(units=units, plan=plan, tlabel=tlabel, loc_label=loc_label, new_id=new_id, bad_refs=bad_refs,
             name_counts=name_counts, literals=literals, markers=markers, near=near, cref=cref, errors=errors,
             route_of=route_of, OUTDIR=OUTDIR, NEW_TOC=NEW_TOC)
exec(open(HERE / "render.py").read(), STATE)
if errors:
    print("\n".join(errors))
    sys.exit(1)
print("ok", len(units), "units;", len(bad_refs), "bad refs;", len(literals), "literal units;", len(near), "near dups")
