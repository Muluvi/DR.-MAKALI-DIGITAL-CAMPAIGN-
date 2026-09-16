"""Paths, assumptions and the seed. Every module reads its numbers from here.

Rule (CLAUDE.md §8): no module hard-codes an assumption. If a number is not a published
figure parsed from the data pack, it lives in config/assumptions.yaml and arrives through
this module.
"""
from __future__ import annotations

import random
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np
import yaml

ANALYSIS_ROOT = Path(__file__).resolve().parent.parent
REPO_ROOT = ANALYSIS_ROOT.parent

CONFIG = ANALYSIS_ROOT / "config"
DATA_RAW = ANALYSIS_ROOT / "data" / "raw"
DATA_TEMPLATES = ANALYSIS_ROOT / "data" / "templates"
DATA_PROCESSED = ANALYSIS_ROOT / "data" / "processed"
OUT_CHARTS = ANALYSIS_ROOT / "outputs" / "charts"
OUT_SITE = ANALYSIS_ROOT / "outputs" / "site"
REPORTS = ANALYSIS_ROOT / "reports"

# Read-only inputs that live in the site, never written to by this pipeline.
SITE_CONTENT = REPO_ROOT / "public" / "content"
SITE_DATA = REPO_ROOT / "data"

PACK = DATA_RAW / "kitui-2027-public-data-pack.md"

# Tags the pack uses, preserved through parsing as a status column (CLAUDE.md §2).
TAG_VERIFY = "verify"
TAG_DATA_NEEDED = "data_needed"
TAG_CALC = "calc"
TAG_CONFLICT = "conflict"
TAG_OK = "ok"

SCENARIO_LABEL = "Scenario model, not a forecast."


def ensure_dirs() -> None:
    """Create every output directory. Safe to call repeatedly."""
    for d in (DATA_PROCESSED, DATA_TEMPLATES, OUT_CHARTS, OUT_SITE, REPORTS):
        d.mkdir(parents=True, exist_ok=True)


@lru_cache(maxsize=1)
def assumptions() -> dict[str, Any]:
    """The parsed assumptions file. Cached — it is read once per process."""
    with open(CONFIG / "assumptions.yaml", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


class AssumptionError(KeyError):
    """Raised when a module asks for an assumption that is not in the file."""


@dataclass(frozen=True)
class Assumption:
    """One assumption, with everything a report needs to caveat it properly."""

    key: str
    value: Any
    status: str
    rationale: str
    source_id: str | None = None
    tier: int | None = None
    as_of: str | None = None
    unit: str | None = None
    verify: bool = False

    @property
    def is_placeholder(self) -> bool:
        return self.status == "PLACEHOLDER"

    @property
    def caveat(self) -> str:
        """The sentence a report puts beside a number drawn from this assumption."""
        if self.verify:
            return f"T{self.tier} source, unverified — status: verify."
        if self.is_placeholder:
            return "Placeholder assumption, not a confirmed figure."
        bits = []
        if self.source_id:
            bits.append(f"{self.source_id} (T{self.tier})")
        if self.as_of:
            bits.append(f"as of {self.as_of}")
        return ", ".join(bits) if bits else "Confirmed."


def assumption(dotted: str) -> Assumption:
    """Fetch one assumption by dotted path, e.g. 'turnout.ward_low'.

    Raises rather than defaulting: a missing assumption is a bug in the config, and
    silently defaulting would put an unrecorded number into a result.
    """
    node: Any = assumptions()
    for part in dotted.split("."):
        if not isinstance(node, dict) or part not in node:
            raise AssumptionError(f"{dotted!r} is not in config/assumptions.yaml")
        node = node[part]
    if not isinstance(node, dict) or "value" not in node:
        raise AssumptionError(f"{dotted!r} is not an assumption entry (needs a 'value')")
    return Assumption(
        key=dotted,
        value=node["value"],
        status=node.get("status", "PLACEHOLDER"),
        rationale=" ".join(str(node.get("rationale", "")).split()),
        source_id=node.get("source_id"),
        tier=node.get("tier"),
        as_of=node.get("as_of"),
        unit=node.get("unit"),
        verify=bool(node.get("verify", False)),
    )


def value(dotted: str) -> Any:
    """Just the value, for arithmetic. Use assumption() when the report needs the caveat."""
    return assumption(dotted).value


def seed() -> int:
    return int(assumptions()["seed"])


def rng() -> np.random.Generator:
    """The pipeline's random generator. Always seeded from config, never from the clock."""
    return np.random.default_rng(seed())


def seed_everything() -> None:
    """Seed the stdlib and numpy legacy globals too, for any library that reaches for them."""
    random.seed(seed())
    np.random.seed(seed() % (2**32))


def placeholders() -> list[str]:
    """Every dotted key currently marked PLACEHOLDER — reports list these as open."""
    found: list[str] = []

    def walk(node: Any, trail: list[str]) -> None:
        if isinstance(node, dict):
            if "status" in node and not isinstance(node.get("status"), dict):
                if node["status"] == "PLACEHOLDER":
                    found.append(".".join(trail))
                    return
            for k, v in node.items():
                walk(v, trail + [k])

    walk(assumptions(), [])
    return sorted(found)
