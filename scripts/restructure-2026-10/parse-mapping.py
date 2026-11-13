#!/usr/bin/env python3
"""Parse section 6 of docs/restructure-2026-10/preview.md into mapping.json.

Preview section 6 is the master: one row per old heading, in reading order. Rows for unnumbered
headings name their file as "[file]"; numbered rows are placed in a file by matching them, in order,
against the heading inventory (scripts/heading-inventory.ts). The parse fails unless every one of
the 333 inventory headings is matched by exactly one row.

    python3 -I scripts/restructure-2026-10/parse-mapping.py
"""
import json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PREVIEW = os.path.join(ROOT, "docs", "restructure-2026-10", "preview.md")
OUT = os.path.join(ROOT, "docs", "restructure-2026-10", "mapping.json")

lines = open(PREVIEW, encoding="utf8").read().split("\n")
start = lines.index("## 6. Old-to-new mapping table")
end = lines.index("## 7. Change log")
rows = []
for line in lines[start:end]:
    if not line.startswith("| ") or line.startswith("| Old ref") :
        continue
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    if len(cells) != 5:
        sys.exit(f"parse-mapping: row does not have five cells: {line}")
    rows.append(cells)

inv = json.loads(subprocess.check_output(
    ["node", "--no-warnings", "--experimental-strip-types", os.path.join(ROOT, "scripts", "heading-inventory.ts"), "--json"],
    cwd=ROOT))

# Reading order of the old document: the files in the order the site served them.
ORDER = ["cover", "objectives", "data", "analysis", "strategy", "implementation", "workstreams-platforms",
         "workstreams-media", "workstreams-ground", "workstreams-data", "delivery", "nextsteps",
         "annex-evidence", "annex-county", "annex-messages", "annex-cadence", "annex-runbooks", "annex-terms"]
headings = [h for f in ORDER for h in inv if h["file"] == f]
if len(headings) != 333 or len(rows) != 333:
    sys.exit(f"parse-mapping: expected 333 headings and 333 rows, found {len(headings)} and {len(rows)}")

out = []
warnings = []
for h, (old_ref, old_title, disp, new_ref, note) in zip(headings, rows):
    m = re.fullmatch(r"\[([a-z-]+)\]", old_ref)
    if m:
        ok = h["ref"] is None and m.group(1) == h["file"]
    else:
        ok = h["ref"] == old_ref
    clean = re.sub(r"[*`]", "", h["title"])
    if ok and old_title.replace("*", "")[:20].lower() not in clean.lower():
        # The preview took its titles from data/section-visuals.generated.json, where an old
        # LaTeX-stripping regex had cut "ge" out of three headings ("Langua register", "Sta:"). The
        # content is the record: the row keeps the content's title, and the difference is reported.
        warnings.append(f"{old_ref}: preview reads '{old_title}', content/{h['file']}.md:{h['line']} reads '{h['title']}'")
    elif not ok:
        sys.exit(f"parse-mapping: row {old_ref} '{old_title}' does not match content/{h['file']}.md:{h['line']} '{h['title']}'")
    out.append({
        "file": h["file"],
        "line": h["line"],
        "level": h["level"],
        "words": h["words"],
        "oldRef": None if m else old_ref,
        "oldTitle": h["title"],
        "disposition": disp,
        "newRef": new_ref,
        "note": note,
    })

with open(OUT, "w", encoding="utf8") as fh:
    json.dump(out, fh, indent=1, ensure_ascii=False)
    fh.write("\n")
counts = {}
for r in out:
    counts[r["disposition"]] = counts.get(r["disposition"], 0) + 1
for w in warnings:
    print(f"  title differs: {w}")
print(f"parse-mapping: {len(out)} rows written to docs/restructure-2026-10/mapping.json; {counts}")
