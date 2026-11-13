#!/usr/bin/env python3
"""
Phase 1 of the Kitui 2027 rebuild: structure only.

Moves blocks and renumbers them to the brief's section C. It rewrites no prose. The exceptions are
heading titles, where the brief supplies final copy, and section numbers inside cross-references,
which are addresses. Every id this changes is written to lib/anchors/rebuild-moves.json so
scripts/build-anchors.ts can send the old link to the new heading.

    python3 scripts/rebuild/phase1.py
"""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONTENT = ROOT / "public" / "content"
MOVES: dict[str, str] = {}


def read(name: str) -> str:
    return (CONTENT / f"{name}.md").read_text()


def write(name: str, text: str) -> None:
    (CONTENT / f"{name}.md").write_text(text.rstrip("\n") + "\n")


def slug(number: str) -> str:
    return number.replace(".", "-").lower()


# ---------------------------------------------------------------- 5.2: fourteen workstreams, four groups
GROUPS = [
    ("workstreams-platforms", "5.2.1", "Platforms and content", range(1, 5)),
    ("workstreams-media", "5.2.2", "Publishing and earned media", range(5, 7)),
    ("workstreams-ground", "5.2.3", "Ground and offline reach", range(7, 11)),
    ("workstreams-data", "5.2.4", "Data and technology", range(11, 15)),
]
# Workstream n used to be 5.2.n. It is now 5.2.<group>.<position in group>.
WS_NEW = {}
for _, group, _, members in GROUPS:
    for i, n in enumerate(members, start=1):
        WS_NEW[n] = f"{group}.{i}"
WS_ROUTE = {n: route for route, _, _, members in GROUPS for n in members}

def renumber_workstream_refs(text: str) -> str:
    """'Section 5.2.9' and '5.2.9.3' both become the workstream's new address, 5.2.3.3."""
    def sub(m: re.Match) -> str:
        n = int(m.group(1))
        return WS_NEW.get(n, m.group(0)) if 1 <= n <= 14 else m.group(0)
    return re.sub(r"(?<![\d.])5\.2\.(\d{1,2})(?:\.\d+)?(?![\d])", sub, text)


# ---------------------------------------------------------------- cross-references everywhere
# First, against the text as it stands, so the headings written below are never re-addressed.
for path in sorted(CONTENT.glob("*.md")):
    text = path.read_text()
    new = "\n".join(l if l.startswith("#") else renumber_workstream_refs(l) for l in text.split("\n"))
    new = new.replace("Sections 5.1.5 to 8.15 set each workstream out in full", "Section 5.2 sets each workstream out in full")
    if new != text:
        path.write_text(new)


for route, group, title, members in GROUPS:
    lines = read(route).split("\n")
    out, fence = [], False
    for line in lines:
        if line.lstrip().startswith("```"):
            fence = not fence
            out.append(line)
            continue
        if fence:
            out.append(line)
            continue
        if line.strip() == f"## {title}":
            out.append(f"## {group} {title}")
            continue
        m = re.match(r"^## 5\.2\.(\d+) (.*)$", line)
        if m:
            n = int(m.group(1))
            new = WS_NEW[n]
            MOVES[f"{route}-sec-5-2-{n}"] = f"{route}-sec-{slug(new)}"
            out.append(f"### {new} {m.group(2)}")
            continue
        m = re.match(r"^### 5\.2\.(\d+)\.(\d+) (.*)$", line)
        if m:
            n = int(m.group(1))
            # A workstream's parts drop to h4: the document addresses workstreams, not their parts.
            MOVES[f"{route}-sec-5-2-{n}-{m.group(2)}"] = f"{route}-sec-{slug(WS_NEW[n])}"
            out.append(f"#### {m.group(3)}")
            continue
        m = re.match(r"^(#{4,5}) (.*)$", line)
        if m:
            out.append(f"#{m.group(1)} {m.group(2)}")
            continue
        out.append(line)
    write(route, "\n".join(out))


# ---------------------------------------------------------------- 5.3-5.4 move behind the workstreams
impl = read("implementation")
cut = impl.index("\n## 5.3 The first four weeks")
head, tail = impl[:cut], impl[cut + 1:]
for h in re.findall(r"^#{2,3} (5\.[34](?:\.\d+)*) ", tail, re.M):
    MOVES[f"implementation-sec-{slug(h)}"] = f"delivery-sec-{slug(h)}"
head = head.rstrip() + "\n\n## 5.2 The workstreams in detail\n\n" + (
    "The fourteen workstreams, in four groups: 5.2.1 Platforms and content (workstreams 1 to 4), "
    "5.2.2 Publishing and earned media (5 and 6), 5.2.3 Ground and offline reach (7 to 10) and "
    "5.2.4 Data and technology (11 to 14). Each sets out what it produces, who owns it and how "
    "often it reports.\n"
)
write("implementation", head)

delivery = read("delivery")
standfirst, rest = delivery.split("\n", 1)
delivery = (
    "The first four weeks, the phases to August 2027, what the campaign receives, how progress is "
    "measured and decided, what could go wrong, and how the work is staffed.\n\n"
    + tail.rstrip() + "\n\n" + rest.lstrip()
)
write("delivery", delivery)

# ---------------------------------------------------------------- 3.11 / 4.8
analysis = read("analysis")
start = analysis.index("## 3.11 The diagnosis")
block = analysis[start:]
rules_at = block.index("| If the audit finds")
rules = block[rules_at:].rstrip()
intro = block[len("## 3.11 The diagnosis, and the evidence that could overturn it"):rules_at].strip()
caveat = subprocess.run(
    ["git", "show", "6af5d18:public/content/objectives.md"], cwd=ROOT, capture_output=True, text=True, check=True
).stdout
caveat = caveat[caveat.index("**The honest caveat"):caveat.index("## 1.3 Five objectives")].strip()
analysis = analysis[:start] + "## 3.11 The diagnosis, and the evidence that could overturn it\n\n" + caveat + "\n"
write("analysis", analysis)

strategy = read("strategy").rstrip() + "\n\n## 4.8 When the plan changes\n\n" + intro + "\n\n" + rules + "\n"
write("strategy", strategy)

# ---------------------------------------------------------------- stale h4 numbers from a retired chapter
for route in ("data", "analysis"):
    text = read(route)
    text = re.sub(r"^(####) 3\.1\.[12]\.\d+ ", r"\1 ", text, flags=re.M)
    write(route, text)

# ---------------------------------------------------------------- cover
cover = read("cover")
cover = cover.replace(
    "# CAMPAIGN STRATEGY & DIGITAL ARCHITECTURE PROPOSAL",
    "# Kitui 2027: Analysis, Strategy and Direction for Dr. Mulu's Digital Operation",
)
cover = cover.replace(
    "the order of the sixteen sections that follow.",
    "the order of the six sections and seven annexes that follow.",
)
write("cover", cover)

# The decision rules left 3.11 for 4.8, so the old §1A.4 link follows them there.
MOVES["presence-sec-1a-4"] = "strategy-sec-4-8"
(ROOT / "lib" / "anchors" / "rebuild-moves.json").write_text(json.dumps(dict(sorted(MOVES.items())), indent=1) + "\n")
print(f"phase 1: {len(MOVES)} ids moved")
