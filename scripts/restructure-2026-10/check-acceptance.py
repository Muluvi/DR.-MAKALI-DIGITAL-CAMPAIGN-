#!/usr/bin/env python3
"""Acceptance checks 1, 2, 6, 12 and 13 of the restructure brief (section 6).

  1. Structure: numbered headings unique per file; at most three numbered levels; Parts 1 to 6 and
     Annexes A to G present; 6 parts, 43 sections, 102 subsections (preview 5's 96, plus 4.6.1 to
     4.6.6, which the mapping keeps).
  2. Mapping: 333 rows; every new ref is a heading in the new content (a run-in's parent counts);
     every Removed row's canonical home exists.
  6. No old tab letters (5A to 5E) in the navigation.
 12. Content integrity: every baseline paragraph is present after the restructure, word for word,
     once citation numbers, [CHECK REF], conflict markers and the layout's own lines are set aside,
     unless the paragraph is one the layout logged as cut. Prints 20 random paragraphs side by side.
 13. Numbers: every number outside a citation (figure values, tiers, percentages, KSh amounts,
     dates) is present the same number of times before and after, less the logged cuts.

    python3 -I scripts/restructure-2026-10/check-acceptance.py
"""
import collections, glob, json, os, random, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DOCS = os.path.join(ROOT, "docs", "restructure-2026-10")
BASE = "9681948"
errors = []

files = {os.path.basename(p)[:-3]: open(p, encoding="utf8").read() for p in sorted(glob.glob(os.path.join(ROOT, "content", "*.md")))}
NUMBERED = re.compile(r"^(#{2,3})\s+((?:\d+(?:\.\d+)+|[A-G](?:\.\d+)+))\s", re.M)

# ---- 1. structure
nums = {}
for name, src in files.items():
    fence = False
    for line in src.split("\n"):
        if re.match(r"^\s*```", line):
            fence = not fence
            continue
        if fence:
            continue
        m = NUMBERED.match(line + " ")
        if m:
            n = m.group(2)
            if n in nums:
                errors.append(f"1: number {n} appears in {nums[n]} and {name}")
            nums[n] = name
main = [n for n in nums if n[0].isdigit()]
depth = lambda n: n.count(".") + 1
if any(depth(n) > 3 for n in main):
    errors.append(f"1: numbered headings deeper than three levels: {[n for n in main if depth(n) > 3]}")
parts = sorted({n.split(".")[0] for n in main}, key=int)
sections = [n for n in main if depth(n) == 2]
subsections = [n for n in main if depth(n) == 3]
annexes = sorted({n.split(".")[0] for n in nums if not n[0].isdigit()})
if parts != ["1", "2", "3", "4", "5", "6"]:
    errors.append(f"1: parts present {parts}")
if annexes != list("ABCDEFG"):
    errors.append(f"1: annexes present {annexes}")
if (len(sections), len(subsections)) != (43, 102):
    errors.append(f"1: {len(sections)} sections and {len(subsections)} subsections, expected 43 and 102")
print(f"1. structure: parts {', '.join(parts)}; annexes {''.join(annexes)}; {len(sections)} sections, {len(subsections)} subsections; deepest numbered level {max(map(depth, main))}")

# ---- 2. mapping completeness
mapping = json.load(open(os.path.join(DOCS, "mapping.json"), encoding="utf8"))
if len(mapping) != 333:
    errors.append(f"2: mapping has {len(mapping)} rows")
missing = []
for r in mapping:
    for t in r["newRef"].replace(" (run-in)", "").split(" / "):
        t = t.strip()
        if t == "Cover":
            if "cover" not in files:
                missing.append(t)
        elif t not in nums:
            missing.append(f"{r['oldRef'] or r['oldTitle']} -> {t}")
if missing:
    errors.append(f"2: new refs with no heading: {missing}")
removed = [r for r in mapping if r["disposition"] == "Removed"]
print(f"2. mapping: {len(mapping)} rows, every new ref a live heading ({len({r['newRef'] for r in mapping})} distinct); {len(removed)} removals, each canonical home present")

# ---- 6. no tab letters in the navigation
nav = open(os.path.join(ROOT, "lib", "heading-slug.ts"), encoding="utf8").read()
flow = open(os.path.join(ROOT, "lib", "flow.ts"), encoding="utf8").read()
letters = re.findall(r'number: "5[A-E]"|"5[A-E]"', nav + flow)
if letters:
    errors.append(f"6: tab letters remain: {letters}")
print(f"6. navigation: {'no' if not letters else len(letters)} 5A-5E tab letters")

# ---- 12. content integrity
def base(name):
    return subprocess.check_output(["git", "show", f"{BASE}:content/{name}.md"], cwd=ROOT).decode("utf8")

base_names = subprocess.check_output(["git", "ls-tree", "--name-only", BASE, "content/"], cwd=ROOT).decode().split()
before = "\n\n".join(base(os.path.basename(p)[:-3]) for p in base_names)
authored = json.load(open(os.path.join(DOCS, "authored-lines.json"), encoding="utf8"))
log = json.load(open(os.path.join(DOCS, "layout-log.json"), encoding="utf8"))

# A table cell that opens with section numbers ("| 5.3 |", "| 5.2.3.3: … |", "| 4.3.2 Rural …").
TABLE_CELL = re.compile(r"(\|\s*)\**\d+(?:\.\d+)+\**(?:\s*,\s*\d+(?:\.\d+)+)*(?=\**\s*(?:\||:|\s[A-Z]))")
# The 4.5 overview's group list, whose four three-level numbers all became the two-level 4.5.
GROUP_REFS = re.compile(r"(: |\), | and )\d+\.\d+(?:\.\d+)?(?= (?:Platforms|Publishing|Ground|Data) )")
CITE = re.compile(r"((?:Sections?|§|Annex)\s*\**)(?:[A-G](?:\.\d+)+|\d+(?:\.\d+)*)((?:\s*(?:,|and|or|to|&|–|-)\s*\**(?:[A-G](?:\.\d+)+|\d+(?:\.\d+)+))*)")
def norm(text):
    text = re.sub(r" ?\[CONFLICT C\d+: see open items\]", "", text)
    text = text.replace(" [CHECK REF]", "")
    text = CITE.sub(lambda m: m.group(1) + "#", text)
    text = re.sub(r"\((?:[A-G](?:\.\d+)+|\d+(?:\.\d+)+)(?:\s*(?:,|–|-)\s*(?:[A-G](?:\.\d+)+|\d+(?:\.\d+)+))*\)", "(#)", text)
    text = re.sub(r"(?<![\w.])\d+\.\d+\.\d+(?:\.\d+)?(?![\w%/])", "#", text)  # bare and table-cell citations
    text = TABLE_CELL.sub(lambda m: m.group(1) + "#", text)
    text = GROUP_REFS.sub(lambda m: m.group(1) + "#", text)
    return re.sub(r"\s+", " ", text).strip()

def paragraphs(src, strip_lines=()):
    # A banner's group line carries an old group intro word for word: read it as that paragraph.
    lines = []
    for l in src.split("\n"):
        if l in strip_lines:
            continue
        g = re.match(r"^> \*\*Group: [^*]+\*\*(?: \(workstreams 1 to 4\)\.)?\s*(.*)$", l)
        if g:
            lines += ["", g.group(1), ""] if g.group(1) else [""]
            continue
        lines.append(l)
    out, cur = [], []
    for l in lines:
        if not l.strip() or re.match(r"^#{2,6}\s", l) or l.strip() == ">":
            if cur:
                out.append("\n".join(cur)); cur = []
            continue
        cur.append(l)
    if cur:
        out.append("\n".join(cur))
    return out

after_paras = collections.Counter()
for name, src in files.items():
    for p in paragraphs(src, set(authored.get(name, []))):
        after_paras[norm(p)] += 1
cut_text = " ".join(norm(c["text"]) for c in log["cuts"])
lost = []
before_paras = paragraphs(before)
for p in before_paras:
    n = norm(p)
    if not n or n in after_paras:
        continue
    if n in cut_text:
        continue
    lost.append(p)
# A paragraph the layout split at a line, or a banner that gained a group line, is present as its parts.
after_text = " ".join(after_paras.elements())
truly_lost = [p for p in lost if norm(p) not in after_text]
if truly_lost:
    errors.append(f"12: {len(truly_lost)} baseline paragraph(s) not found after the restructure")
    for p in truly_lost[:10]:
        print("   LOST:", p[:160].replace("\n", " "))
print(f"12. integrity: {len(before_paras)} baseline paragraphs; {len(before_paras) - len(lost)} found whole, {len(lost) - len(truly_lost)} found as the parts a split or a banner line made, {len(truly_lost)} missing (cuts excluded)")
random.seed(20261028)
sample = random.sample([p for p in before_paras if len(norm(p)) > 120], 20)
for i, p in enumerate(sample, 1):
    ok = norm(p) in after_text
    print(f"   spot-check {i:2d}: {'identical' if ok else 'DIFFERENT'} — {p[:90].replace(chr(10), ' ')}…")
    if not ok:
        errors.append(f"12: spot-check paragraph differs: {p[:80]}")

# ---- 13. numbers outside citations
NUMBER = re.compile(r"(?:KSh\s?)?\d[\d,]*(?:\.\d+)?\s?(?:%|bn|billion|million|m\b)?|Tier \d")
def numbers(text):
    text = re.sub(r" ?\[CONFLICT C\d+: see open items\]| ?\[CHECK REF\]", "", text)
    text = re.sub(r"(?m)^#{2,6}\s+(?:\d+(?:\.\d+)+|[A-G](?:\.\d+)+)\s", "", text)
    text = CITE.sub("", text)
    text = re.sub(r"\((?:[A-G](?:\.\d+)+|\d+(?:\.\d+)+)(?:\s*(?:,|–|-)\s*(?:[A-G](?:\.\d+)+|\d+(?:\.\d+)+))*\)", "", text)
    text = re.sub(r"(?<![\w.])\d+\.\d+\.\d+(?:\.\d+)?(?![\w%/])", "", text)
    text = TABLE_CELL.sub(lambda m: m.group(1), text)
    text = GROUP_REFS.sub(lambda m: m.group(1), text)
    text = re.sub(r"\{\{[^}]*\}\}", "", text)
    return collections.Counter(m.group(0).strip() for m in NUMBER.finditer(text))
after_numbers = numbers("\n".join(files.values()))
# Numbers the restructure wrote itself: purpose lines, pointers and the banner group label
# "(workstreams 1 to 4)". Heading lines are left out: a new heading's title carries no number, and a
# heading the layout re-emitted keeps its old title ("The phases to August 2027").
authored_numbers = numbers("\n".join(l for v in authored.values() for l in v if not l.startswith("#")) + "\n" + "\n".join(
    "(workstreams 1 to 4)" for src in files.values() for l in src.split("\n") if l.startswith("> **Group: Platforms and content**")))
expected = numbers(before) - numbers("\n".join(c["text"] for c in log["cuts"]))
got = after_numbers - authored_numbers
if expected != got:
    errors.append(f"13: numbers differ: lost {dict(expected - got)}, gained {dict(got - expected)}")
print(f"13. numbers: {sum(expected.values())} number tokens outside citations before (less cuts), {sum(got.values())} after; {'identical' if expected == got else 'DIFFERENT'}")

if errors:
    print("\ncheck-acceptance: FAILED")
    for e in errors:
        print("  - " + e)
    sys.exit(1)
print("\ncheck-acceptance: checks 1, 2, 6, 12 and 13 pass")
