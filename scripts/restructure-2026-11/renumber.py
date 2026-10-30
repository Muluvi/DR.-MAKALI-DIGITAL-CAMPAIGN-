#!/usr/bin/env python3
"""Rewrite cross-references from the old section numbers to the November 2026 ones, in one pass.

The old -> new map is derived from the approved plan (docs/restructure-2026-11/plan.json): an old
heading goes where its heading unit went, or, if it was merged, where the passage it merged into
went. Each match is replaced once, from the text as it stands, so a number whose new value is also
an old number (old 3.1 -> 9.1, while old 9.x never existed) cannot move twice.

What counts as a citation: "Section 2.7", "Sections 2.8 and 4.1.1", "Sections 5.3.1–5.3.5", "§4.5.9",
"Annex B.2", "(E.4, E.12)", and a two- or three-level number after "in", "see", "at" or "to" when
that number names an old heading. Heading lines, {{tokens}}, and ```figure fences are never touched.
In TypeScript files only lines that are not comments are touched: comments keep the numbers of
their own time.

    python3 scripts/restructure-2026-11/renumber.py . content            # rewrite content/*.md
    python3 scripts/restructure-2026-11/renumber.py . code               # rewrite visible strings in lib/ and components/
    python3 scripts/restructure-2026-11/renumber.py . map                # print the map
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1])
MODE = sys.argv[2]
DOCS = ROOT / "docs" / "restructure-2026-11"
units = json.loads((DOCS / "units.json").read_text())
plan = json.loads((DOCS / "plan.json").read_text())["plan"]
by_c = {u["c"]: u for u in units}

WS = dict(zip([f"4.5.{i}" for i in range(1, 15)], [
    "15.1.1", "15.1.2", "15.1.3", "15.1.4", "15.2.1", "15.2.2", "15.3.1", "15.3.2", "15.3.3", "15.3.4",
    "15.4.1", "15.4.2", "15.4.3", "15.4.4"]))
FIXED = {
    "4.5": "15", "4.6": "17", "4.6.1": "17.1", "4.6.2": "17.2", "4.6.3": "17.3", "4.6.4": "17.4", "4.6.5": "17.4", "4.6.6": "17.5",
    "4.4": "16", "1.3.1": "8.2", "1.3.2": "8.2", "1.3.3": "8.2", "1.3.4": "8.2", "1.3.5": "8.2",
    "A.1": "A.1", "A.1.1": "A.1.1", "A.1.2": "A.1.2", "A.1.3": "A.1.3", "A.1.4": "A.1.4",
    "B.1": "B.1", "B.2": "3.7", "B.3": "3.2", "B.4": "3.8", "B.5": "5.5",
    "C.1": "10.4", "C.2": "10.4", "D.1": "13.5", "D.2": "13.5",
    **{f"E.{i}": f"F.{i}" for i in range(1, 11)}, "E.11": "F.11", "E.12": "F.11",
    "F.1": "G.1", "G.1": "C.1", "G.2": "C.2", "G.3": "D.1", "G.4": "E.1", "G.5": "E.2",
    "2.8": "1", "2.9": "4", "2.10": "6", "3.3": "12", "3.4": "11", "3.6": "12.4", "4.2": "14", "4.3": "14",
    "2.12": "7.1", "1.1": "23",
}
WHOLE_ANNEX = {"A": "Annex A", "B": "Annex B", "C": "Section 10.4", "D": "Section 13.5", "E": "Annex F", "F": "Annex G", "G": "Annexes C to E"}

NUM = {}
for u in units:
    if not u.get("hid"):
        continue
    old = u["section"]
    if old in FIXED:
        NUM[old] = FIXED[old]
        continue
    if old in WS:
        NUM[old] = WS[old]
        continue
    p = plan[u["c"]]
    loc = p["loc"]
    if p["t"].startswith("Merged with"):
        tgt = p["t"].split("Merged with ")[1].split(",")[0].strip()
        loc = plan[tgt]["loc"]
    NUM[old] = loc

if MODE == "map":
    for k in sorted(NUM, key=lambda x: [int(y) if y.isdigit() else ord(y) for y in x.split(".")]):
        print(f"{k:8} -> {NUM[k]}")
    sys.exit(0)

N = r"(?:\d+(?:\.\d+)+|[A-G]\.\d+(?:\.\d+)*)"
unknown = []


def new(num):
    if num in NUM:
        return NUM[num]
    # a number deeper than any heading: climb to its parent
    parts = num.split(".")
    while len(parts) > 1:
        parts.pop()
        if ".".join(parts) in NUM:
            return NUM[".".join(parts)]
    unknown.append(num)
    return num


def label(prefix, n):
    """Keep 'Section'/'§'; an annex number keeps 'Annex', a chapter number takes 'Section'."""
    if prefix.startswith("§"):
        return "§" + n
    is_annex = bool(re.match(r"^[A-H](\.|$)", n))
    if prefix.lower().startswith("annex") or prefix.lower().startswith("section"):
        word = "Annex" if is_annex else ("Chapter" if n.isdigit() else "Section")
        if prefix.lower().endswith("s "):
            word += "s" if not is_annex else "es"
        return f"{word} {n}"
    return prefix + n


LIST = re.compile(rf"(Sections?\s+|§\s?|Annex(?:es)?\s+)({N})((?:\s*(?:,|and|&|–|-|to)\s*{N})*)")
BARE = re.compile(rf"(?<![\w.{{|])(in|see|at|to|under|from)(\s+)({N})(?![\w}}])")
PAREN = re.compile(rf"\((({N})(?:,\s*{N})+)\)")
WHOLE = re.compile(r"\bAnnex ([A-G])\b(?![.\d])")


CHECK = re.compile(rf"((?:Sections?\s+|§\s?|Annex\s+|\()?{N}\)?\s*\[CHECK REF\])")


def rewrite(line):
    # A number already flagged [CHECK REF] cites a section that never existed in this numbering:
    # it is left exactly as it is, for the author, rather than mapped to a new wrong number.
    held = []
    def hold(m):
        held.append(m.group(1))
        return f"\x00{len(held) - 1}\x00"
    line = CHECK.sub(hold, line)
    line = _rewrite(line)
    return re.sub(r"\x00(\d+)\x00", lambda m: held[int(m.group(1))], line)


def _rewrite(line):
    def lst(m):
        prefix, first, rest = m.group(1), m.group(2), m.group(3)
        out = label(prefix, new(first))
        for sep, n in re.findall(rf"(\s*(?:,|and|&|–|-|to)\s*)({N})", rest):
            out += sep + new(n)
        return out
    line = LIST.sub(lst, line)
    line = PAREN.sub(lambda m: "(" + ", ".join(new(x.strip()) for x in m.group(1).split(",")) + ")", line)
    line = BARE.sub(lambda m: m.group(1) + m.group(2) + (new(m.group(3)) if m.group(3) in NUM else m.group(3)), line)
    line = WHOLE.sub(lambda m: WHOLE_ANNEX[m.group(1)], line)
    return line


def rewrite_md(text):
    out, fence = [], None
    for line in text.split("\n"):
        if line.strip().startswith("```"):
            fence = None if fence else line.strip()[3:]
            out.append(line)
            continue
        if fence == "figure" or re.match(r"^#{2,6}\s", line):
            out.append(line)
            continue
        parts = re.split(r"(\{\{[^}]*\}\})", line)
        out.append("".join(p if p.startswith("{{") else rewrite(p) for p in parts))
    return "\n".join(out)


changed = 0
if MODE == "content":
    for f in sorted((ROOT / "content").glob("*.md")):
        t = f.read_text()
        n = rewrite_md(t)
        if n != t:
            f.write_text(n)
            changed += 1
elif MODE == "code":
    # Only citations the October 2026 pass itself rewrote to the numbering of its day are current,
    # and so only those are mapped on (docs/restructure-2026-10/citations.csv, "after", not flagged).
    # Every other citation in code was already stale before this restructure (OPEN-ITEMS §2): it is
    # left as found rather than turned into a different wrong number.
    import csv
    CURRENT = {}
    with open(ROOT / "docs" / "restructure-2026-10" / "citations.csv") as fh:
        for row in csv.DictReader(fh):
            if row["file"].startswith("content/") or "CHECK" in row["after"]:
                continue
            for n in re.findall(N, row["after"]):
                CURRENT.setdefault(row["file"], set()).add(n)
    _new_any = new
    targets = list((ROOT / "lib" / "register" / "specs").glob("*.ts")) + list((ROOT / "lib" / "figures").glob("*.ts")) + \
        list((ROOT / "components").rglob("*.tsx")) + [ROOT / "lib" / "phone-showcase.ts", ROOT / "lib" / "table-charts.ts", ROOT / "lib" / "phases.ts"]
    for f in targets:
        if not f.exists() or f.name.endswith(".test.ts"):
            continue
        t = f.read_text()
        rel = str(f.relative_to(ROOT))
        allowed = CURRENT.get(rel, set())
        def new(num, allowed=allowed):
            return _new_any(num) if num in allowed else num
        globals()["new"] = new
        lines = []
        for line in t.split("\n"):
            s = line.strip()
            if s.startswith(("//", "*", "/*", "{/*", "import ")):
                lines.append(line)
            else:
                lines.append(rewrite(line))
        n = "\n".join(lines)
        if n != t:
            f.write_text(n)
            changed += 1
print(f"renumber {MODE}: {changed} files changed; numbers with no map: {sorted(set(unknown))}")
