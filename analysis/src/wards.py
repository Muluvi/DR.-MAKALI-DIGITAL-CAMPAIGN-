"""Ward identity: normalising names so the same ward matches across sources.

The pack, the site's JSON and any boundary file spell wards differently. Two real cases
in this data: "Kwavonza/Yatta" vs "Kwa Vonza/Yatta" (spacing) and "Mutito/Kaliku" vs
"Mutitu/Kaliku" (one letter). Spacing is safe to normalise away. A letter difference is
not, so it is matched by similarity and reported for confirmation, never silently fused.
The second case was confirmed that way: IEBC's 2022 register by polling station spells it
"Mutito/Kaliku", and the site's register was corrected to match in September 2026.
"""
from __future__ import annotations

import difflib
import json
import re
from dataclasses import dataclass

import pandas as pd

from src import config

SIMILARITY_CUTOFF = 0.85


def normalise(name: str) -> str:
    """Casefold, drop spacing and punctuation variants, unify separators."""
    text = name.strip().lower()
    text = text.replace("–", "/").replace("—", "/").replace("-", "/")
    text = re.sub(r"\s*/\s*", "/", text)
    text = re.sub(r"[^\w/]", "", text)
    return text


@dataclass
class MatchResult:
    exact: dict[str, str]
    similar: dict[str, tuple[str, float]]
    unmatched: list[str]


def match(left: list[str], right: list[str]) -> MatchResult:
    """Match `left` names onto `right`. Exact on the normalised form, then similarity."""
    right_index = {normalise(r): r for r in right}
    exact: dict[str, str] = {}
    similar: dict[str, tuple[str, float]] = {}
    unmatched: list[str] = []

    for name in left:
        key = normalise(name)
        if key in right_index:
            exact[name] = right_index[key]
            continue
        close = difflib.get_close_matches(key, list(right_index), n=1, cutoff=SIMILARITY_CUTOFF)
        if close:
            ratio = difflib.SequenceMatcher(None, key, close[0]).ratio()
            similar[name] = (right_index[close[0]], round(ratio, 3))
        else:
            unmatched.append(name)
    return MatchResult(exact=exact, similar=similar, unmatched=unmatched)


def site_register() -> pd.DataFrame | None:
    """The site's own ward register (data/ward-register.json), read only.

    This is an independent second copy of the same IEBC figures, which makes it a genuine
    cross-check on the pack rather than a restatement of it.
    """
    path = config.SITE_DATA / "ward-register.json"
    if not path.exists():
        return None
    raw = json.loads(path.read_text(encoding="utf-8"))
    rows = [
        {
            "constituency": c["name"],
            "ward": w["name"],
            "registered_voters_2022": w["voters"],
        }
        for c in raw["constituencies"]
        for w in c["wards"]
    ]
    return pd.DataFrame(rows)


def site_register_totals() -> dict:
    path = config.SITE_DATA / "ward-register.json"
    if not path.exists():
        return {}
    raw = json.loads(path.read_text(encoding="utf-8"))
    return {
        "county_total_wards": raw["countyTotalWards"],
        "prison_voters": raw["prisonVoters"],
        "county_total_with_prisons": raw["countyTotalWithPrisons"],
        "constituency_totals": {c["name"]: c["voters"] for c in raw["constituencies"]},
    }
