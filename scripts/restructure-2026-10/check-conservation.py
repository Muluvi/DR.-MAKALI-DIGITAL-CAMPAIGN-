#!/usr/bin/env python3
"""Acceptance checks 3, 4 and 5 of the restructure brief: nothing lost in the move.

  3. Words: words after, plus words logged as cut, less words the restructure added (headings,
     purpose lines, pointers, markers), equals words before within 1%.
  4. Figures: every ```figure id present before is present after, exactly once; every
     ```textversion block is present after, byte for byte.
  5. Tokens: every {{token}} present before is present after, the same number of times.

Baseline is docs/restructure-2026-10/baseline-snapshot.json and the content at commit 9681948.

    python3 -I scripts/restructure-2026-10/check-conservation.py
"""
import collections, glob, json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DOCS = os.path.join(ROOT, "docs", "restructure-2026-10")
snap = json.load(open(os.path.join(DOCS, "baseline-snapshot.json"), encoding="utf8"))
log = json.load(open(os.path.join(DOCS, "layout-log.json"), encoding="utf8"))

files = {os.path.basename(p): open(p, encoding="utf8").read() for p in sorted(glob.glob(os.path.join(ROOT, "content", "*.md")))}
text = "\n".join(files.values())
errors = []


def textversions(src):
    out, lines, i = [], src.split("\n"), 0
    while i < len(lines):
        if lines[i].strip() == "```textversion":
            j = i + 1
            while lines[j].strip() != "```":
                j += 1
            out.append("\n".join(lines[i:j + 1]))
            i = j
        i += 1
    return out


# 4. figures and text versions
figs = []
for src in files.values():
    lines = src.split("\n")
    for k, l in enumerate(lines):
        if l.strip() == "```figure":
            figs.append(re.match(r"\s*id:\s*(\S+)", lines[k + 1]).group(1))
before_figs = collections.Counter(snap["figures"])
after_figs = collections.Counter(figs)
if before_figs != after_figs:
    errors.append(f"figures differ: lost {dict(before_figs - after_figs)}, gained {dict(after_figs - before_figs)}")
base_tv = []
for f in subprocess.check_output(["git", "ls-tree", "--name-only", "9681948", "content/"], cwd=ROOT).decode().split():
    base_tv += textversions(subprocess.check_output(["git", "show", f"9681948:{f}"], cwd=ROOT).decode())
after_tv = [t for src in files.values() for t in textversions(src)]
if sorted(base_tv) != sorted(after_tv):
    errors.append(f"textversion blocks differ ({len(base_tv)} before, {len(after_tv)} after)")

# 5. tokens
before_tok = collections.Counter(snap["tokens"])
after_tok = collections.Counter(re.findall(r"\{\{[^}]*\}\}", text))
if before_tok != after_tok:
    errors.append(f"tokens differ: lost {dict(before_tok - after_tok)}, gained {dict(after_tok - before_tok)}")

# 3. words
after_words = sum(len(src.split()) for src in files.values())
cut_words = sum(c["words"] for c in log["cuts"])
relocated = sum(r["words"] for r in log.get("relocated", []))
dropped_heading_words = sum(len(d["title"].split()) + 1 for d in log["droppedHeadings"])
added = 0
for src in files.values():
    added += len(re.findall(r"\[CONFLICT C\d+: see open items\]", src)) * 5
added += sum(len(p["text"].split()) for p in log["pointers"])
added += sum(a["words"] for a in log["added"]) + log["headingDelta"]
before_words = snap["totalWords"]
expected = before_words - cut_words - relocated - dropped_heading_words + added
diff = after_words - expected
report = {
    "wordsBefore": before_words, "wordsAfter": after_words, "wordsCut": cut_words, "groupIntroWordsReusedInBanners": relocated,
    "headingWordsDropped": dropped_heading_words, "wordsAdded(headings,banners,pointers,purpose,markers)": added,
    "unexplained": diff, "unexplainedPct": round(100 * diff / before_words, 3),
    "figures": len(figs), "textversions": len(after_tv), "tokens": sum(after_tok.values()),
}
if abs(diff) > before_words * 0.01:
    errors.append(f"word count off by {diff} ({report['unexplainedPct']}%), outside 1%")

print(json.dumps(report, indent=1))
if errors:
    for e in errors:
        print("  - " + e, file=sys.stderr)
    sys.exit(1)
print("check-conservation: figures, text versions and tokens conserved; words reconcile within 1%")
