"""
Exact, logged edits to content/*.md for the declutter (brief 2026-10 declutter).

Every change to the proposal's text in this work goes through one of these functions, so that:

  * an edit only applies where the old text is found exactly, once, inside the named section;
  * every deletion is logged to docs/declutter/cuts.json (and so to CUTS.md) with its section,
    its opening words, its word count, its kind and its canonical home;
  * text moved into a ```visual fence is copied from the source lines, not retyped.

Used from short scripts, one per tab stage:

    import sys; sys.path.insert(0, "scripts/declutter")
    from edit import *
    cut("decision", "1.1", "What this section adds is …", kind="signpost", home="")
"""
import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CONTENT = os.path.join(ROOT, "content")
CUTS = os.path.join(ROOT, "docs", "declutter", "cuts.json")

HEADING = re.compile(r"^(#{2,3})\s+((?:\d+(?:\.\d+)*|[A-G](?:\.\d+)+))\s+(.*)$")


def path(name):
    return os.path.join(CONTENT, f"{name}.md")


def read(name):
    with open(path(name), encoding="utf8") as f:
        return f.read()


def write(name, text):
    with open(path(name), "w", encoding="utf8") as f:
        f.write(text)


def words(s):
    """Whitespace-separated runs with a letter or digit in them (scripts/declutter/sections.mjs agrees)."""
    return len([t for t in s.split() if re.search(r"[A-Za-z0-9]", t) and not re.fullmatch(r"\d+\.", t)])


def span(text, number):
    """(start, end) of a section's body: after its heading line, up to the next h2/h3."""
    lines = text.split("\n")
    offs = []
    pos = 0
    for line in lines:
        offs.append(pos)
        pos += len(line) + 1
    fence = False
    start = 0 if number == "(intro)" else None
    for i, line in enumerate(lines):
        if line.lstrip().startswith("```"):
            fence = not fence
            continue
        if fence:
            continue
        m = HEADING.match(line)
        if not m:
            continue
        if start is not None:
            return start, offs[i]
        if m.group(2) == number:
            start = offs[i] + len(line) + 1
    if start is None:
        raise KeyError(f"no section {number}")
    return start, len(text)


def section(name, number):
    text = read(name)
    a, b = span(text, number)
    return text[a:b]


def replace(name, number, old, new, count=1):
    """Replace `old` with `new` inside one section; `old` must occur exactly `count` times there."""
    text = read(name)
    a, b = span(text, number)
    body = text[a:b]
    n = body.count(old)
    if n != count:
        raise ValueError(f"{name}:{number}: expected {count} occurrence(s), found {n}: {old[:70]!r}")
    write(name, text[:a] + body.replace(old, new) + text[b:])


def _log(entry):
    data = json.load(open(CUTS, encoding="utf8")) if os.path.exists(CUTS) else []
    data.append(entry)
    with open(CUTS, "w", encoding="utf8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")


def first12(s):
    plain = re.sub(r"[*_`>#|]", "", s)
    return " ".join(plain.split()[:12])


def cut(name, number, old, kind, home="", note="", new="", allow=None):
    """
    Delete `old` from a section (or replace it with `new`, a short reference) and log it.

    kind: "duplicate"  every fact is at `home` (checked by check-content.mjs, check 5)
          "blurb"      a tab intro the navigation blurb carries (home "nav-blurb:<tab>")
          "signpost"   meta-text about the document itself ("What this section adds is …")
          "register"   an intensifier or rhetorical framing (X10)
          "history"    editorial history of the drafts, not the plan
    """
    replace(name, number, old, new)
    entry = {
        "file": name,
        "section": number,
        "first12": first12(old),
        "words": words(old) - words(new),
        "kind": kind,
        "home": home,
        "note": note,
        "text": old,
    }
    if new:
        entry["replacement"] = new
    if allow:
        entry["allow"] = allow
    _log(entry)


def move(name, number, old, to_name, to_number, anchor, before=False, new="", note=""):
    """
    Move `old` out of one section and into another, verbatim: it is inserted after `anchor` in the
    destination (before it, if `before`). Logged as kind "moved", so the conservation check credits
    the source and debits the destination.
    """
    replace(name, number, old, new)
    if before:
        replace(to_name, to_number, anchor, old + anchor)
    else:
        replace(to_name, to_number, anchor, anchor + old)
    _log({
        "file": name, "section": number, "first12": first12(old), "words": words(old) - words(new),
        "kind": "moved", "home": f"{to_name}:{to_number}", "to": f"{to_name}:{to_number}", "note": note, "text": old,
    })


def lead(name, number, text):
    """Put a ```lead fence directly under a section's heading."""
    src = read(name)
    a, _ = span(src, number)
    write(name, src[:a] + "\n```lead\n" + text.strip() + "\n```\n" + src[a:])


def q(s):
    """A YAML double-quoted scalar: JSON's string syntax is valid YAML."""
    return json.dumps(s, ensure_ascii=False)


def bullet_items(block):
    """Top-level bullets of a markdown list, each joined to one line, continuation lines kept."""
    items = []
    blank = False
    for line in block.split("\n"):
        if re.match(r"^\s{0,1}[*\-+]\s+|^\d+\.\s+", line):
            items.append(re.sub(r"^\s{0,1}(?:[*\-+]|\d+\.)\s+", "", line))
        elif items and line.strip():
            # A list ends at a blank line followed by text that is not indented under it.
            if blank and not line.startswith((" ", "\t")):
                break
            items[-1] += "\n" + line
        blank = not line.strip()
    return items


def labelled(item):
    """'**Label:** text' -> (label, text). Returns (None, item) when it does not open with a bold label."""
    m = re.match(r"^\*\*([^*]+?):\*\*\s*([\s\S]*)$", item.strip())
    if not m:
        m = re.match(r"^\*\*([^*]+?)\*\*:\s*([\s\S]*)$", item.strip())
    return (m.group(1).strip(), m.group(2).strip()) if m else (None, item.strip())


def table_cells(line):
    """The cells of a markdown table row, without splitting on the '|' inside a {{token|mod}}."""
    masked = re.sub(r"\{\{[^}]*\}\}", lambda m: m.group(0).replace("|", "\x00"), line.strip().strip("|"))
    return [c.strip().replace("\x00", "|") for c in masked.split("|")]


def oneline(s):
    return re.sub(r"\s*\n\s*", " ", s).strip()


def fence(kind, body):
    """A fenced block, as text to insert."""
    return f"```{kind}\n{body.rstrip()}\n```"


def yaml_items(items, indent="  "):
    """
    A YAML list of mappings from Python dicts, every string double-quoted (JSON syntax). Nested
    lists of dicts (fields) and of strings (chips) are supported.
    """
    out = []
    for it in items:
        first = True
        for k, v in it.items():
            if v is None or v == [] or v == "":
                continue
            lead = f"{indent}- " if first else f"{indent}  "
            first = False
            if isinstance(v, list) and v and isinstance(v[0], dict):
                out.append(f"{lead}{k}:")
                for d in v:
                    out.append(f"{indent}    - {{ " + ", ".join(f"{dk}: {q(dv)}" for dk, dv in d.items()) + " }")
            elif isinstance(v, list):
                out.append(f"{lead}{k}: [" + ", ".join(q(x) for x in v) + "]")
            elif isinstance(v, dict):
                out.append(f"{lead}{k}: {{ " + ", ".join(f"{dk}: {q(dv)}" for dk, dv in v.items()) + " }")
            elif isinstance(v, (int, float)):
                out.append(f"{lead}{k}: {v}")
            else:
                out.append(f"{lead}{k}: {q(v)}")
    return "\n".join(out)


def visual(kind, items=None, title=None, note=None, source=None, preset=None, extra=None, key="items"):
    lines = [f"kind: {kind}"]
    if preset:
        lines.append(f"preset: {preset}")
    if title:
        lines.append(f"title: {q(title)}")
    if note:
        lines.append(f"note: {q(note)}")
    if source:
        lines.append(f"source: {q(source)}")
    if items is not None:
        lines.append(f"{key}:")
        lines.append(yaml_items(items))
    if extra:
        lines.append(extra.rstrip())
    return fence("visual", "\n".join(lines))


def swap(name, number, old, new):
    """Replace prose with a visual built from it (the words move into the fence): not a cut."""
    replace(name, number, old, new)


def split_clause(text, limit=12):
    """(visible, rest): the first clause of `text` when it is `limit` words or fewer, else ("", text)."""
    t = oneline(text)
    # Not at an abbreviation: "Dr. Mulu", "Sen. Wambua", "e.g. Tharaka".
    m = re.match(r"^(.+?(?<!\bDr)(?<!\bSen)(?<!\bHon)(?<!\bMr)(?<!\bMrs)(?<!\bSt)(?<!\bNo)(?<!\be\.g)(?<!\bi\.e)[.;:])(\s+|$)([\s\S]*)$", t)
    if m and words(m.group(1)) <= limit:
        head = m.group(1)
        rest = m.group(3).strip()
        return head, rest
    return "", t
