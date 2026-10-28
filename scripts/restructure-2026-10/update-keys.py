#!/usr/bin/env python3
"""Stage 3 of the October 2026 restructure: re-key the code that names sections.

Mechanical, and driven by lib/anchors/restructure-2026-10.json (old id -> new id) and the new
content. It touches only section references and ids:

  - components/MarkdownViewer.tsx  HEADING_INSERTS keys
  - scripts/section-visual-overrides.json keys
  - lib/register/specs/*.ts        each figure's `section` (the heading its fence now sits under),
                                   and the objectives' finding / serves / measure section numbers
Every change is printed, and logged in docs/restructure-2026-10/CHANGELOG.md.

    python3 -I scripts/restructure-2026-10/update-keys.py
"""
import glob, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MOVES = json.load(open(os.path.join(ROOT, "lib", "anchors", "restructure-2026-10.json")))["moves"]
MAPPING = json.load(open(os.path.join(ROOT, "docs", "restructure-2026-10", "mapping.json")))
changes = []

# Old section number -> new section number (numbered rows only; run-ins go to their parent).
NUM = {}
for r in MAPPING:
    if r["oldRef"]:
        NUM[r["oldRef"]] = r["newRef"].replace(" (run-in)", "").split(" / ")[0]

# ---- MarkdownViewer mount keys
p = os.path.join(ROOT, "components", "MarkdownViewer.tsx")
src = open(p, encoding="utf8").read()
a = src.index("const HEADING_INSERTS")
b = src.index("\n};", a)
block = src[a:b]
# The workstream 1 tracker visual was keyed to the old platforms group heading (5.2.1), the line
# directly above workstream 1. The group heading dissolves into the 4.5 overview; the visual
# stays beside the workstream it draws.
OVERRIDE = {"workstreams-platforms-sec-5-2-1": "workstreams-platforms-sec-4-5-1"}
def rekey(m):
    old = m.group(1)
    new = OVERRIDE.get(old, MOVES.get(old, old))
    if new != old:
        changes.append(f"HEADING_INSERTS {old} -> {new}")
    return m.group(0).replace(f'"{old}"', f'"{new}"')
block = re.sub(r'^\s*"([a-z][a-z-]*-sec-[\da-z-]+)":', rekey, block, flags=re.M)
src = src[:a] + block + src[b:]
open(p, "w", encoding="utf8").write(src)

# ---- section-visual overrides: only where the heading itself survives as a numbered heading
p = os.path.join(ROOT, "scripts", "section-visual-overrides.json")
ov = json.load(open(p, encoding="utf8"))
by_ref = {f"{r['file']}-sec-{r['oldRef'].replace('.', '-').lower()}": r for r in MAPPING if r["oldRef"]}
out = {}
for k, v in ov.items():
    r = by_ref.get(k)
    if r and "(run-in)" in r["newRef"]:
        changes.append(f"section-visual override {k} dropped: the heading is now a run-in inside {r['newRef']} and carries no visual of its own")
        continue
    new = MOVES.get(k, k)
    if new in out:
        sys.exit(f"update-keys: two overrides land on {new}")
    if new != k:
        changes.append(f"section-visual override {k} -> {new}")
    out[new] = v
with open(p, "w", encoding="utf8") as fh:
    json.dump(out, fh, indent=2, ensure_ascii=False)
    fh.write("\n")

# ---- register specs: where each figure now sits
HEADING = re.compile(r"^#{2,3}\s+((?:\d+(?:\.\d+)+|[A-G](?:\.\d+)+))\s")
sits = {}
for path in glob.glob(os.path.join(ROOT, "content", "*.md")):
    route = os.path.basename(path)[:-3]
    current = "Cover" if route == "cover" else None
    lines = open(path, encoding="utf8").read().split("\n")
    for k, line in enumerate(lines):
        h = HEADING.match(line)
        if h:
            current = h.group(1)
        if line.strip() == "```figure":
            fid = re.match(r"\s*id:\s*(\S+)", lines[k + 1]).group(1)
            sits[fid] = current
for p in sorted(glob.glob(os.path.join(ROOT, "lib", "register", "specs", "s*.ts"))):
    src = open(p, encoding="utf8").read()
    def resect(m):
        fid, old = m.group(1), m.group(2)
        if fid in sits and sits[fid]:
            new = sits[fid]
        elif old in NUM:
            new = NUM[old]
        else:
            new = old
        if new != old:
            changes.append(f"{os.path.basename(p)} {fid}: section {old} -> {new}")
        return m.group(0).replace(f'section: "{old}"', f'section: "{new}"')
    src = re.sub(r'id: "([a-z0-9-]+)",\n\s*section: "([^"]+)"', resect, src)
    # the objectives table's links: finding, serves and measure are section numbers
    def relink(m):
        key, old = m.group(1), m.group(2)
        new = NUM.get(old, old)
        if new != old:
            changes.append(f"{os.path.basename(p)} {key}: {old} -> {new}")
        return f'{key}: "{new}"'
    src = re.sub(r'\b(finding|serves|measure): "(\d+(?:\.\d+)+)"', relink, src)
    open(p, "w", encoding="utf8").write(src)

json.dump(changes, open(os.path.join(ROOT, "docs", "restructure-2026-10", "stage3-keys.json"), "w"), indent=1)
for c in changes:
    print(c)
print(f"update-keys: {len(changes)} changes")
