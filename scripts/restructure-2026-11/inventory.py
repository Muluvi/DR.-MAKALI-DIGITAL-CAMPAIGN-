#!/usr/bin/env python3
"""Step 0 of the November 2026 restructure: parse content/*.md into numbered units.

Deterministic: the same content produces the same C-numbers. Writes a JSON dump that the
markdown writer (write_docs.py) turns into inventory.md and the draft reorganisation map.

Unit rules
  heading      every line starting ##..#####  (one unit each)
  lead         ```lead fence
  visual       ```visual fence (kind recorded)
  figure       ```figure fence (id recorded)
  textversion  ```textversion fence (prose a figure carries)
  table        consecutive lines starting with |
  list         consecutive list items (*, -, 1.) and their continuation lines
  callout      consecutive blockquote lines (>)
  paragraph    any other run of non-blank lines
  skipped      blank lines, '---' rules, '<!-- keep -->' markers (the marker is recorded on the
               unit that follows it, because it protects that unit's wording)
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1])
OUT = Path(sys.argv[2])

FLOW = [
    "cover", "decision", "evidence", "strategy", "delivery", "workstreams-platforms",
    "workstreams-media", "workstreams-ground", "workstreams-data", "staffing", "measurement",
    "risks", "annex-evidence", "annex-county", "annex-messages", "annex-cadence",
    "annex-runbooks", "annex-terms", "annex-spec",
]

LEADING = re.compile(r"^((?:\d+[A-Z]?(?:\.\d+)*|[A-G](?:\.\d+)+))\.?\s")
HEAD = re.compile(r"^(#{2,5})\s+(.+?)\s*$")
LIST = re.compile(r"^\s*(?:[*\-]|\d+\.)\s+")


def clean(s: str) -> str:
    s = re.sub(r"\*\((new|updated)\)\*", "", s, flags=re.I)
    return s.replace("**", "").replace("*", "").replace("`", "").strip()


def plain(text: str) -> str:
    t = re.sub(r"\{\{\s*([a-z0-9.\-]+)(?:\|[a-z0-9]+)?\s*\}\}", r"{\1}", text)
    t = re.sub(r"<[^>]+>", " ", t)
    t = re.sub(r"[*_`>#|\\]", " ", t)
    t = re.sub(r"\[CONFLICT (C\d): see open items\]", r"[conflict \1]", t)
    t = re.sub(r"\s+", " ", t)
    return t.strip()


def ten_words(text: str) -> str:
    words = plain(text).split(" ")
    out = " ".join(words[:10])
    return out + ("…" if len(words) > 10 else "")


def yaml_key(body: str, key: str):
    m = re.search(rf'^\s*-?\s*{key}:\s*"?(.*?)"?\s*$', body, re.M)
    return m.group(1) if m else None


def describe_fence(kind: str, body: str) -> str:
    if kind == "figure":
        return f"figure component `{yaml_key(body, 'id')}`"
    if kind == "lead":
        return "lead: " + ten_words(body)
    if kind == "textversion":
        return "text version: " + ten_words(body)
    vkind = yaml_key(body, "kind") or "?"
    title = yaml_key(body, "title")
    first = None
    for k in ("title", "label", "head", "hypothesis", "attack", "day", "when"):
        for m in re.finditer(rf'^\s*-?\s*{k}:\s*(.+)$', body, re.M):
            v = m.group(1)
            if k == "title" and title and title in v:
                continue
            first = v
            break
        if first:
            break
    lead = title or first or ""
    lead = re.sub(r'^\{\s*label:\s*"?', "", lead)
    return f"visual `{vkind}`: " + ten_words(lead.strip('"'))


def parse(route: str, text: str):
    lines = text.split("\n")
    units = []
    ctx = {2: None, 3: None, 4: None, 5: None}
    anchor = None  # nearest numbered ##/### id
    sec_num = None
    keep_next = False
    i = 0

    def add(kind, start, end, body, **extra):
        nonlocal keep_next
        u = {
            "route": route, "file": f"content/{route}.md", "line": start + 1, "end": end + 1,
            "kind": kind, "body": body, "raw": "\n".join(lines[start:end + 1]),
            "h2": ctx[2], "h3": ctx[3], "h4": ctx[4],
            "anchor": anchor, "section": sec_num, "keep": keep_next,
        }
        u.update(extra)
        units.append(u)
        keep_next = False

    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if not s or s == "---":
            i += 1
            continue
        if s == "<!-- keep -->":
            keep_next = True
            i += 1
            continue
        if s.startswith("```"):
            info = s[3:].strip()
            j = i + 1
            while j < len(lines) and not lines[j].strip().startswith("```"):
                j += 1
            body = "\n".join(lines[i + 1:j])
            kind = info if info in ("lead", "figure", "textversion", "visual") else "fence"
            extra = {}
            if kind == "visual":
                extra["vkind"] = yaml_key(body, "kind")
            if kind == "figure":
                extra["fig"] = yaml_key(body, "id")
            add(kind, i, j, body, desc=describe_fence(kind, body), **extra)
            i = j + 1
            continue
        m = HEAD.match(line)
        if m:
            level = len(m.group(1))
            title = m.group(2)
            ctx[level] = clean(title)
            for l in range(level + 1, 6):
                ctx[l] = None
            n = LEADING.match(clean(title))
            hid = None
            if n and level <= 3:
                hid = f"{route}-sec-" + n.group(1).replace(".", "-").lower()
                anchor = hid
                sec_num = n.group(1)
            add("heading", i, i, line, level=level, hid=hid, desc=f"h{level}: " + ten_words(clean(title)))
            i += 1
            continue

        def run(pred):
            j = i
            while j < len(lines) and lines[j].strip() and pred(lines[j]) and not lines[j].strip().startswith("```") and not HEAD.match(lines[j]) and lines[j].strip() != "<!-- keep -->":
                j += 1
            return j

        if s.startswith("|"):
            j = run(lambda l: l.strip().startswith("|"))
            add("table", i, j - 1, "\n".join(lines[i:j]), desc="table: " + ten_words(lines[i]))
            i = j
            continue
        if s.startswith(">"):
            j = run(lambda l: l.strip().startswith(">"))
            add("callout", i, j - 1, "\n".join(lines[i:j]), desc="callout: " + ten_words("\n".join(lines[i:j])))
            i = j
            continue
        if LIST.match(line):
            j = i + 1
            while j < len(lines):
                l = lines[j]
                if not l.strip():
                    # a blank line ends the list unless the next line is another item
                    if j + 1 < len(lines) and LIST.match(lines[j + 1]):
                        j += 1
                        continue
                    break
                if l.strip().startswith("```") or HEAD.match(l) or l.strip() == "<!-- keep -->" or l.strip() == "---":
                    break
                if l.strip().startswith("|") or l.strip().startswith(">"):
                    break
                j += 1
            add("list", i, j - 1, "\n".join(lines[i:j]), desc="list: " + ten_words("\n".join(lines[i:j])))
            i = j
            continue
        j = i + 1
        while j < len(lines):
            l = lines[j]
            if not l.strip() or l.strip().startswith("```") or HEAD.match(l) or l.strip() in ("---", "<!-- keep -->") or l.strip().startswith("|") or l.strip().startswith(">") or LIST.match(l):
                break
            j += 1
        add("paragraph", i, j - 1, "\n".join(lines[i:j]), desc=ten_words("\n".join(lines[i:j])))
        i = j
    return units


all_units = []
for route in FLOW:
    text = (ROOT / "content" / f"{route}.md").read_text()
    all_units.extend(parse(route, text))
for n, u in enumerate(all_units, 1):
    u["c"] = f"C{n}"
OUT.write_text(json.dumps(all_units, indent=1, ensure_ascii=False))
print(len(all_units), "units")
from collections import Counter
print(Counter(u["kind"] for u in all_units))
print(Counter(u["route"] for u in all_units))
print("headings with ids:", sum(1 for u in all_units if u.get("hid")))
