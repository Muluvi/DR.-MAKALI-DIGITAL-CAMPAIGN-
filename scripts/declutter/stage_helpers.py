"""Helpers shared by the stage scripts from Stage 8 on: blocks, bold-labelled lists, sentence faces, keeps."""
import re
from edit import *


def block(f, num, start, end=None):
    body = section(f, num)
    i = body.index(start)
    j = body.index(end, i) if end else len(body.rstrip("\n"))
    return body[i:j].rstrip("\n")


def split_sentence(text, limit=14):
    """(visible, rest): the first sentence of `text` when it is `limit` words or fewer; a short text with no
    sentence break is visible whole. Never splits at a semicolon or colon, so no face ends mid-sentence."""
    t = oneline(text)
    m = re.match(r"^(.+?(?<!\bDr)(?<!\bSen)(?<!\bHon)(?<!\bMr)(?<!\bMrs)(?<!\bSt)(?<!\bNo)(?<!\be\.g)(?<!\bi\.e)[.?!])(\s+|$)([\s\S]*)$", t)
    if m and words(m.group(1)) <= limit:
        return m.group(1), m.group(3).strip()
    if not m and words(t) <= limit:
        return t, ""
    return "", t


def list_items(b, limit=14):
    """Items of a bold-labelled list: label, a short visible clause, the rest behind the disclosure."""
    items = []
    for x in bullet_items(b):
        lab, txt = labelled(x)
        if lab is None:
            m = re.match(r"^\*\*(.+?)\*\*[.:]?\s*([\s\S]*)$", oneline(x))
            if m:
                lab, txt = m.group(1).rstrip(".:"), m.group(2)
            else:
                items.append({"label": oneline(x)})
                continue
        txt = txt.lstrip(", ")
        head, rest = split_sentence(txt, limit=limit) if limit else ("", oneline(txt))
        it = {"label": lab}
        if head:
            it["text"] = head
            if rest:
                it["body"] = rest
        elif txt:
            it["body"] = oneline(txt)
        items.append(it)
    return items


def keep(f, num, start):
    replace(f, num, start, "<!-- keep -->\n" + start)
