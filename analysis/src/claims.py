"""Build claims_register.csv — every number shown in the site content.

Scans the site content in reading order and records each numeric claim with the section it
sits in, the tier the site itself asserts, and whether the reader can see where the figure
comes from at all: a "Tier N" marker, a Tier column or header in a table, a visual item's own
tier, or a visible status ("modelled", "calculated", "target", "not used").

Two worklists come out of it. `never_stated` lists figures that carry no tier or status
anywhere in the document, so a reader can never trace them; that is the sourcing gap. The
`first_statement` column marks where each figure first appears in reading order, so an
unlabelled first statement can be found without wading through every restatement.

The hard part is not finding numbers, it is not finding section references. This
document cross-references itself constantly ("Section 8.10.3", "5.2 counts the KNBS
base"), and a register full of those is worse than useless — it buries the real claims.
Two filters do the work: a dotted-token test kills 8.10.3, and a claim must then either
carry a unit or be large enough that it cannot be a section number.
"""
from __future__ import annotations

import json
import re

import pandas as pd

from src import config

MONEY = r"(KSh\s?)?"
NUMBER = r"(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+\.\d+|\d{3,})"
SUFFIX = r"\s?(%|m\b|bn\b|million|billion|km\b|-point\b|\spoints?\b)?"
CLAIM = re.compile(rf"(?<![\w.]){MONEY}{NUMBER}{SUFFIX}")

TIER_NEAR = re.compile(r"\(?\bTier\s*([123])\b\)?", re.I)
SECTION_REF = re.compile(r"(?:Section|§|Annex)\s*$", re.I)
HEADING = re.compile(r"^(#{1,6})\s+(.*)$")

# A claim below this value must carry a unit to count. Section numbers never reach it.
UNITLESS_FLOOR = 100

UNIT_WORDS = (
    ("voter", "voters"),
    ("vote", "votes"),
    ("resident", "residents"),
    ("household", "households"),
    ("student", "students"),
    ("follower", "followers"),
    ("ward", "wards"),
    ("post", "posts"),
)


def _unit(money: str | None, suffix: str | None, context: str) -> str:
    if money:
        s = (suffix or "").strip()
        return {"m": "KSh m", "million": "KSh m", "bn": "KSh bn", "billion": "KSh bn"}.get(s, "KSh")
    if suffix:
        s = suffix.strip()
        return {
            "m": "KSh m",
            "bn": "KSh bn",
            "-point": "percentage points",
            "point": "percentage points",
            "points": "percentage points",
        }.get(s, s)
    low = context.lower()
    for needle, unit in UNIT_WORDS:
        if needle in low:
            return unit
    return ""


# The visible ways the site states a figure's provenance besides "Tier N". Each is a status
# the reader can see: Firefly's own arithmetic, a commitment rather than a claim, or a figure
# quoted only to say it is not used.
STATUS_NEAR = (
    ("modelled", re.compile(r"\bmodelled\b|\[CALC\b|\bcalculated\b", re.I)),
    ("target", re.compile(r"\btargets?\b|\bthresholds?\b", re.I)),
    ("excluded", re.compile(r"\bnot (?:used|confirmed|yet tiered)\b|\bno source\b", re.I)),
)
# A table cell or a visual item that states its tier on its own.
TIER_CELL = re.compile(r"\bTier\s*([123])\b|^\s*T([123])\s*$", re.I)
PHONE = re.compile(r"\b0\d{3}[ -]?\d{3}[ -]?\d{3}\b")
# "Sections 3.2 and 3.6", "§§ 4.1, 4.2" — every number in a list of section references.
SECTION_LIST = re.compile(r"(?:Sections?|§§?|Annex(?:es)?)\s*(?:[\d.]+\s*(?:,|and|&|–|-|to)\s*)*$", re.I)
# Columns whose cells are labels, not claims.
NON_CLAIM_COLUMN = re.compile(r"\bsection\b|\bfrequency\b|\bformat\b|\bref\b|§|where it is set", re.I)
CONTENT_ORDER = config.REPO_ROOT / "lib" / "content-files.ts"


def reading_order() -> list[str]:
    """Content files in the order the site presents them, read from the site's own list."""
    if CONTENT_ORDER.exists():
        names = re.findall(r'"([a-z0-9-]+\.md)"', CONTENT_ORDER.read_text(encoding="utf-8"))
        if names:
            return names
    return sorted(p.name for p in config.SITE_CONTENT.glob("*.md"))


def _cells(line: str) -> list[tuple[int, int, str]]:
    """A table row's cells as (start, end, text) spans within the line."""
    spans, pos = [], line.index("|") + 1
    for part in line[pos:].split("|"):
        spans.append((pos, pos + len(part), part.strip()))
        pos += len(part) + 1
    return spans[:-1] if spans and not spans[-1][2] else spans


def _column(rows: list[str], i: int, start: int) -> tuple[str, str, bool] | None:
    """For a claim at `start` in table row i: the column's header, the row's Tier cell, and
    whether the table lists targets (a column is headed exactly "Target")."""
    if not rows[i].lstrip().startswith("|"):
        return None
    top = i
    while top > 0 and rows[top - 1].lstrip().startswith("|"):
        top -= 1
    header = [c[2] for c in _cells(rows[top])]
    cells = _cells(rows[i])
    col = next((k for k, (a, b, _) in enumerate(cells) if a <= start < b), None)
    name = header[col] if col is not None and col < len(header) else ""
    tier_cell = ""
    for k, h in enumerate(header):
        if re.search(r"\btier\b", h, re.I) and k < len(cells):
            tier_cell = cells[k][2]
    lists_targets = any(h.strip().lower() == "target" for h in header)
    return name, tier_cell, lists_targets


def _claims_in(text_rows: list[str], file: str, lineno: int, heading: str,
               item_tier: int | None = None, scan_from: int = 0,
               item_status: str | None = None) -> list[dict]:
    """Claims in text_rows[scan_from:]. Earlier rows are context only: a table's header."""
    out: list[dict] = []
    for i, line in enumerate(text_rows):
        if i < scan_from:
            continue
        # ASCII-art panels restate prose figures; capturing them triples the register
        # with box-drawing noise for no new claims.
        if line.count("│") >= 2 or line.strip().startswith(("```", "┌", "└", "├", "═")):
            continue
        is_header = line.lstrip().startswith("|") and (i == 0 or not text_rows[i - 1].lstrip().startswith("|"))
        if is_header:
            continue
        for m in CLAIM.finditer(line):
            money, number, suffix = m.group(1), m.group(2), m.group(3)
            start, end = m.span()

            # "8.10.3" — a dotted token with a third part is a section reference.
            if re.match(r"\.\d", line[end:end + 2] or ""):
                continue
            if SECTION_REF.search(line[max(0, start - 10):start]):
                continue
            if SECTION_LIST.search(line[max(0, start - 40):start]):
                continue
            # "AES-256", "ISO-27001": part of an identifier.
            if start >= 2 and line[start - 1] == "-" and line[start - 2].isalpha():
                continue
            # "160-character", "48-hour", "160 characters": a specification, not a claim.
            if not money and not suffix and (re.match(r"-[a-z]", line[end:end + 2] or "")
                                             or re.match(r"\s*characters?\b", line[end:end + 12])):
                continue
            # A phone number is not a claim.
            if any(p.start() <= start < p.end() for p in PHONE.finditer(line)):
                continue

            value = float(number.replace(",", ""))
            # A bare year ("in 2021", "September 2026") dates a claim; it is not one.
            if (not money and not suffix and "," not in number and "." not in number
                    and 1900 <= value <= 2100):
                continue

            column = _column(text_rows, i, start)
            if column and NON_CLAIM_COLUMN.search(column[0]):
                continue

            context = line[max(0, start - 70):min(len(line), end + 70)]
            unit = _unit(money, suffix, context)

            # Unitless and small: a section number, a list marker, or prose. Not a claim.
            if not unit and value < UNITLESS_FLOOR:
                continue

            tier, status = None, None
            tier_match = TIER_NEAR.search(context)
            if tier_match:
                tier = int(tier_match.group(1))
            elif column:
                header_tier = TIER_CELL.search(column[0])
                cell_tier = TIER_CELL.search(column[1])
                if header_tier or cell_tier:
                    m2 = header_tier or cell_tier
                    tier = int(m2.group(1) or m2.group(2))
                elif re.search(r"\btarget\b", column[0], re.I) or column[2]:
                    status = "target"
                elif re.search(r"\bmodelled\b|\bcalculated\b", column[0], re.I):
                    status = "modelled"
            if tier is None and status is None:
                tier = item_tier
            if tier is None and status is None:
                status = item_status
            if tier is None and status is None:
                status = next((name for name, rx in STATUS_NEAR if rx.search(context)), None)

            out.append(
                {
                    "file": file,
                    "location": f"line {lineno} · {heading[:60]}",
                    "claim": " ".join(re.sub(r"\*\*|\*|`", "", context).split()),
                    "value": value,
                    "unit": unit,
                    "source_cited": "yes" if (tier or status) else "no",
                    "tier": tier,
                    "status": config.TAG_OK if tier else (status or "unsourced"),
                }
            )
    return out


def _visual_claims(spec: object, file: str, lineno: int, heading: str) -> list[dict]:
    """Claims inside a serialised visual block: items that carry their own tier, and any
    markdown (tables included) embedded in its text fields."""
    out: list[dict] = []
    if isinstance(spec, dict):
        value, tier = spec.get("value"), spec.get("tier")
        label = spec.get("label")
        status = "target" if isinstance(label, str) and re.search(r"\btarget\b", label, re.I) else None
        if isinstance(value, str) and isinstance(tier, int):
            label = str(spec.get("label", ""))
            out += _claims_in([f"{value} {label}"], file, lineno, heading, item_tier=tier)
        for key, v in spec.items():
            if key in ("value", "tier") and isinstance(tier, int):
                continue
            # "when" and "day" label a step in time; they are not claims.
            if key in ("when", "day"):
                continue
            if isinstance(v, str):
                out += _claims_in(v.split("\n"), file, lineno, heading, item_status=status)
            elif isinstance(v, dict) and isinstance(v.get("label"), str) \
                    and re.search(r"\btarget\b", v["label"], re.I):
                out += _claims_in([str(v.get("text", ""))], file, lineno, heading,
                                  item_status="target")
            else:
                out += _visual_claims(v, file, lineno, heading)
    elif isinstance(spec, list):
        for v in spec:
            out += _visual_claims(v, file, lineno, heading)
    return out


def build() -> pd.DataFrame:
    rows: list[dict] = []
    order = reading_order()
    files = sorted(config.SITE_CONTENT.glob("*.md"),
                   key=lambda p: order.index(p.name) if p.name in order else len(order))
    for path in files:
        heading = ""
        lines = path.read_text(encoding="utf-8").splitlines()
        fence: str | None = None
        for lineno, line in enumerate(lines, 1):
            stripped = line.strip()
            if stripped.startswith("```"):
                fence = None if fence is not None else (stripped[3:].strip() or "code")
                continue
            if fence == "visual":
                try:
                    spec = json.loads(line)
                except ValueError:
                    rows += _claims_in([line], path.name, lineno, heading)
                else:
                    rows += _visual_claims(spec, path.name, lineno, heading)
                continue
            if fence in ("figure", "lead", "code"):
                # Figure fences hold ids; a lead restates the opening prose verbatim.
                continue
            h = HEADING.match(line)
            if h:
                heading = h.group(2).strip()
                continue
            # Table rows need the rows around them to find the table's Tier column.
            if line.lstrip().startswith("|"):
                top = lineno - 1
                while top > 0 and lines[top - 1].lstrip().startswith("|"):
                    top -= 1
                block = lines[top:lineno]
                rows += _claims_in(block, path.name, lineno, heading, scan_from=len(block) - 1)
            else:
                rows += _claims_in([line], path.name, lineno, heading)

    df = pd.DataFrame(rows)
    if df.empty:
        return df
    df = df.drop_duplicates(subset=["file", "location", "value"]).reset_index(drop=True)
    # The same figure printed as "53.4 million" and as "53,400,000" is one figure.
    scale = df["unit"].map({"million": 1e6, "KSh m": 1e6, "billion": 1e9, "KSh bn": 1e9}).fillna(1)
    df["figure"] = [f"{v * k:.6g}{'%' if u == '%' else ''}"
                    for v, k, u in zip(df["value"], scale, df["unit"])]
    # A figure's first statement in the site's reading order; later restatements in
    # summaries, tables and callouts may leave the tier off.
    df["first_statement"] = ~df["figure"].duplicated()
    return df


def never_stated(df: pd.DataFrame) -> pd.DataFrame:
    """Figures that carry no tier or status anywhere in the document: a reader can never
    find where they come from. One row per figure, at its first statement."""
    if df.empty:
        return df
    stated = set(df.loc[df["source_cited"] == "yes", "figure"])
    return df[~df["figure"].isin(stated)].drop_duplicates("figure")
