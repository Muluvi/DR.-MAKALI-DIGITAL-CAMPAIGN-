"""Build claims_register.csv — every number shown in the site content.

Scans public/content/*.md and records each numeric claim with the section it sits in,
the tier the site itself asserts, and whether that tier is stated at all.

The hard part is not finding numbers, it is not finding section references. This
document cross-references itself constantly ("Section 8.10.3", "5.2 counts the KNBS
base"), and a register full of those is worse than useless — it buries the real claims.
Two filters do the work: a dotted-token test kills 8.10.3, and a claim must then either
carry a unit or be large enough that it cannot be a section number.
"""
from __future__ import annotations

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
        return "KSh"
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


def build() -> pd.DataFrame:
    rows: list[dict] = []
    for path in sorted(config.SITE_CONTENT.glob("*.md")):
        heading = ""
        for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            h = HEADING.match(line)
            if h:
                heading = h.group(2).strip()
                continue
            # ASCII-art panels restate prose figures; capturing them triples the register
            # with box-drawing noise for no new claims.
            if line.count("│") >= 2 or line.strip().startswith(("```", "┌", "└", "├", "═")):
                continue

            for m in CLAIM.finditer(line):
                money, number, suffix = m.group(1), m.group(2), m.group(3)
                start, end = m.span()

                # "8.10.3" — a dotted token with a third part is a section reference.
                if re.match(r"\.\d", line[end:end + 2] or ""):
                    continue
                if SECTION_REF.search(line[max(0, start - 10):start]):
                    continue

                value = float(number.replace(",", ""))
                context = line[max(0, start - 70):min(len(line), end + 70)]
                unit = _unit(money, suffix, context)

                # Unitless and small: a section number, a list marker, or prose. Not a claim.
                if not unit and value < UNITLESS_FLOOR:
                    continue

                tier_match = TIER_NEAR.search(context)
                rows.append(
                    {
                        "file": path.name,
                        "location": f"line {lineno} · {heading[:60]}",
                        "claim": " ".join(re.sub(r"\*\*|\*|`", "", context).split()),
                        "value": value,
                        "unit": unit,
                        "source_cited": "yes" if tier_match else "no",
                        "tier": int(tier_match.group(1)) if tier_match else None,
                        "status": config.TAG_OK if tier_match else "unsourced",
                    }
                )

    df = pd.DataFrame(rows)
    if df.empty:
        return df
    return df.drop_duplicates(subset=["file", "location", "value"]).reset_index(drop=True)
