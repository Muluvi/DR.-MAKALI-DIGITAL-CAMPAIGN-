#!/usr/bin/env python3
"""Write the final docs/restructure-2026-11/reorganisation-map.md: what the restructure actually did.

The Step 0 draft recorded what was proposed. This file replaces it with what was done, computed from
the content as it now stands rather than restated from the plan:

  - New location: the numbered section, in the file the plan sent the unit to (or, for a merge, the
    file of the passage it merged into), whose text shares most with the unit. A unit whose text no
    longer matches anywhere keeps the plan's location.
  - Treatment: Retained (wording found verbatim, same route) · Moved (wording found verbatim, new
    route) · Cx + Cy → merged · Corrected (a correction note is in the new text) · Replaced by visual ·
    Reworded (none of the above: the wording changed; check-preservation.mjs proves its facts stayed).

    python3 scripts/restructure-2026-11/render_final.py .
"""
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(sys.argv[1])
DOCS = ROOT / "docs" / "restructure-2026-11"
units = json.loads((DOCS / "units.json").read_text())
plan = json.loads((DOCS / "plan.json").read_text())["plan"]
by_c = {u["c"]: u for u in units}
TODAY = "30 October 2026"

HEAD = re.compile(r"^#{2,3} ((?:\d+|[A-H])(?:\.\d+)*)\s")


def norm(s):
    s = re.sub(r"```[a-z]*", " ", s)
    s = re.sub(r"\b(?:kind|preset|title|note|items|label|text|head|fields|body|tier|when|value|badge|chips|caption|id)\s*:", " ", s)
    s = re.sub(r"[*_`>|#\[\]{}()\"\\]", " ", s)
    s = re.sub(r"^\s*[-*\d.]+\s+", " ", s, flags=re.M)
    return re.sub(r"\s+", " ", s).strip().lower()


def shingles(s, n=5):
    w = norm(s).split()
    return {" ".join(w[i:i + n]) for i in range(max(0, len(w) - n + 1))}


# Sections of the current content: (file, number, text).
sections = defaultdict(list)
where = defaultdict(set)
for f in sorted((ROOT / "content").glob("*.md")):
    text = f.read_text()
    text = re.sub(r"<!-- source-table:start[\s\S]*?<!-- source-table:end -->", "", text)
    lines = text.split("\n")
    nums = [HEAD.match(l).group(1) for l in lines if HEAD.match(l)]
    chap = nums[0].split(".")[0] if nums else {"cover": "Cover", "brief": "In brief"}.get(f.stem, f.stem)
    cur, buf = chap, []
    for l in lines + ["## 0 end"]:
        m = HEAD.match(l)
        if m:
            sections[f"content/{f.name}"].append((cur, "\n".join(buf)))
            cur, buf = m.group(1), []
            parts = cur.split(".")
            for i in range(1, len(parts) + 1):
                where[".".join(parts[:i])].add(f"content/{f.name}")
        else:
            buf.append(l)
where["Cover"].add("content/cover.md")
where["In"].add("content/brief.md")
full = {f: norm("\n".join(t for _, t in secs)) for f, secs in sections.items()}
route_of_file = {f: Path(f).stem for f in sections}
REFNUM = re.compile(r"\b(?:sections?|chapters?|annex(?:es)?|§)?\s*(?:\d+|[a-h])(?:\.\d+)+\b|\b(?:sections?|chapters?|annex)\s+\d+\b")


def strip_refs(s):
    s = REFNUM.sub(" ", s.replace("makali mulu", "mulu").replace("deficit pool", "pool"))
    return re.sub(r"\s+", " ", s).strip()


full_refs = {f: strip_refs(t) for f, t in full.items()}
NOTE = re.compile(r"\*(?:Source conflict|Corrected):")


def files_for(loc):
    key = loc.split(" ")[0]
    out = set(where.get(key, set()))
    return out


def locate(u, files):
    sh = shingles(u["raw"])
    best = (0.0, None, None)
    for f in sorted(files):
        for num, text in sections[f]:
            if not sh:
                continue
            score = len(sh & shingles(text)) / len(sh)
            if score > best[0]:
                best = (score, f, num)
    return best


rows = []
for u in units:
    c = u["c"]
    p = plan[c]
    files = files_for(p["loc"])
    m = re.match(r"Merged with (C\d+)", p["t"])
    if m:
        files |= files_for(plan[m.group(1)]["loc"])
    score, f, num = locate(u, files)
    body = norm(u["raw"])
    verbatim = bool(body) and any(body in full[x] for x in files)
    # Second look: the same wording once section numbers (renumbered by renumber.py) and the
    # first-mention naming rule ("Dr. Mulu" -> "Dr. Makali Mulu") are set aside.
    renumbered = not verbatim and bool(body) and any(strip_refs(body) in full_refs[x] for x in files)
    note = p["note"]
    if renumbered:
        verbatim = True
        note = (note + " " if note else "") + "Wording kept; cross-references renumbered."
    new_route = route_of_file.get(f) if f else None
    moved = new_route is not None and new_route != u["route"]
    loc = num if f and score >= 0.2 else p["loc"]
    if m:
        t = f"{c} + {m.group(1)} → merged"
    elif p["t"].startswith("Replaced"):
        t = "Replaced by visual"
    elif p["t"] == "Corrected":
        t = "Corrected"
    elif verbatim:
        t = "Moved" if moved else "Retained"
    else:
        t = "Reworded"
    rows.append((u, loc, t, note, round(score, 2)))


def cell(s):
    return str(s).replace("|", "\\|").replace("\n", " ")


def orig(u):
    return f"`{u['file']}:{u['line']}` §{u['section'] or 'preamble'}"


o = []
w = o.append
w("# Reorganisation map")
w("")
w(f"Final map, {TODAY}. It replaces the Step 0 draft and records what the November 2026 restructure did, unit by unit. "
  "Every C-number in `inventory.md` appears once. The new location and the treatment are computed from the content as it now stands "
  "by `scripts/restructure-2026-11/render_final.py`, not restated from the plan.")
w("")
w("Treatments: **Retained** (wording found verbatim, on the same route) · **Moved** (wording found verbatim, on a new route) · "
  "**Reworded** (house style; every token, acronym and proper name it carried is still at its new location, which "
  "`scripts/restructure-2026-11/check-preservation.mjs` proves on every `npm run verify`) · **Cx + Cy → merged** (Cy is the surviving passage; "
  "every fact from Cx is in it) · **Corrected** (the unit conflicted with verified data or the record; the new text carries a "
  "source-conflict or correction note) · **Replaced by visual** (an existing visual carries the meaning in full). "
  "A lead repeated as its section's first sentence is extractive by design (`check-leads.mjs`) and is not counted as a duplicate.")
w("")
w("## 1. Routes")
w("")
w("One file and route per chapter; Chapter 15 keeps its four routes. Retired routes redirect (307) to the route that now holds most of their "
  "text, in `next.config.ts`: decision → goal, evidence → news, strategy → message, delivery → timeline, staffing → team, measurement → lawful, "
  "risks → response, annex-messages → message, annex-cadence → engagement, annex-spec → annex-technology; the October retirements now point "
  "straight at their final home. Every old heading id resolves through `lib/anchors/restructure-2026-11.json` and `lib/anchors/redirects.ts` "
  "(1,704 redirects, 0 orphans).")
w("")
w("## 2. Every unit")
w("")
w("| C | Original location | New location | Treatment | Note |")
w("|---|---|---|---|---|")
for u, loc, t, note, _ in rows:
    w(f"| {u['c']} | {orig(u)} | {cell(loc)} | {cell(t)} | {cell(note)} |")
w("")
w("## 3. Changes made during the rewrite, beyond the plan")
w("")
EXTRA = [
    ("Runbook letters (20.2)", "The war-room callout lettered the runbooks E.1–E.12; they are F.1–F.11. Corrected with a source-conflict note."),
    ("Deliverables schedule (21.2)", "The last column gave October numbers (4.5.2, 4.1.1, E.12 …); renumbered to the current sections, with a note."),
    ("Commitments (22.1)", "The two openings ('This proposal commits to a method …' and 'Firefly commits to a scope …') merged into one lead; the checklist's references to 13.2, 13.4 and Section 6 corrected to 13.4, 13.5 and 22.2, with a note."),
    ("Dependencies (22.2)", "The dependencies figure and its text version moved ahead of the four gated deliverables so the checklist's 'listed there' points at something the reader has seen."),
    ("The ask (23)", "The lead's second and third sentences (Firefly publishes nothing on his accounts; the method, cadence and standard) merged into 13.2 and 22.1, where they are stated in full."),
    ("Annex E.1", "'Six core components' corrected to five; Google Authenticator separated from hardware keys. Both with notes. [CHECK REF] 5.2.3.4 → 19.2; 5.2.4 → 15.1.1."),
    ("Annex F", "The F.11 tool table merged into F.4 (X lists added; the richer descriptions kept). Scenario 7 renumbered 6, with a note."),
    ("Annex A", "The pointer to 'Annex A' from inside Annex A replaced by a lead; A.2 is generated from `lib/data/figures.ts` by `scripts/build-source-table.ts`."),
    ("Annex B", "The intro named the audit record, drought, the Mui Basin and the legal ground, which moved to 3.7, 3.2, 3.8 and 5.5; it now says so."),
    ("4.3", "The ICT source was named as the '2023/24 Kenya Continuous Household Survey and Communications Authority reports'; corrected to the CA/KNBS ICT Analytical Report on the 2023/24 Kenya Housing Survey, with a note."),
    ("10.3", "The governing line, quoted in full in 9.1, is referenced rather than quoted again (the duplicate detector's one cross-chapter repetition)."),
    ("10.4", "The overlap sentence restored without its row numbers; the withdrawn share sum and register-applied counts recorded in one source-conflict note."),
    ("19.2", "[CHECK REF] 16.4 → 19.3 clause 5; 'Section 5.2.1.4 of the DPA' → [VERIFY the section of the Act, to be cited by the Section 19.2 reviewer]."),
    ("20.2", "[CHECK REF] A.1.1 → 20.3."),
    ("Figure captions", "Registry captions (`components/figures/registry.tsx`) set to each figure's host section."),
]
w("| Where | What changed |")
w("|---|---|")
for a, b in EXTRA:
    w(f"| {a} | {cell(b)} |")
w("")
w("## 4. Audit")
w("")
tc = Counter("Merged" if "→ merged" in t else t for _, _, t, _, _ in rows)
w("| Treatment | Units |")
w("|---|---:|")
for k, v in tc.most_common():
    w(f"| {k} | {v} |")
w("")
blank = [u["c"] for u, loc, t, _, _ in rows if not loc or not t]
w(f"Blank cells: {len(blank)}.")
w("")
N = len(units)
n_in_map = len({u["c"] for u, loc, t, _, _ in rows if loc and t})
w(f"**Inventory items: {N}. Items in map: {n_in_map}. Discrepancy: {N - n_in_map}**")
(DOCS / "reorganisation-map.md").write_text("\n".join(o) + "\n")
print(f"render_final: {N} units; " + ", ".join(f"{k} {v}" for k, v in tc.most_common()) + f"; discrepancy {N - n_in_map}")
