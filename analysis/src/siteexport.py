"""Site-export schema. Every value carries its provenance or it does not ship.

Required on every value (brief, Stage 12):
    value, unit, source_id, tier, as_of, method, status

    method: official | calculated | modelled
    status: confirmed | verify | placeholder

A T3 figure is always status "verify" (CLAUDE.md §2), enforced in Value.__post_init__
rather than left to the caller to remember.
"""
from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from datetime import date
from typing import Any

from src import config

METHODS = {"official", "calculated", "modelled"}
STATUSES = {"confirmed", "verify", "placeholder"}

# Things that must never reach a public URL (assumptions.yaml: site_export.never_publish).
NEVER_PUBLISH = set(config.value("site_export.never_publish"))


class ExportError(ValueError):
    pass


@dataclass
class Value:
    label: str
    value: Any
    unit: str
    source_id: str
    tier: int | None
    as_of: str
    method: str
    status: str
    note: str = ""

    def __post_init__(self) -> None:
        if self.method not in METHODS:
            raise ExportError(f"{self.label}: method {self.method!r} not in {sorted(METHODS)}")
        if self.status not in STATUSES:
            raise ExportError(f"{self.label}: status {self.status!r} not in {sorted(STATUSES)}")
        # The rule that must never be forgotten: T3 is always verify.
        if self.tier == 3 and self.status != "verify":
            raise ExportError(f"{self.label}: T3 figure must carry status 'verify'")
        if self.method == "modelled" and self.status == "confirmed":
            raise ExportError(f"{self.label}: a modelled figure cannot be 'confirmed'")


@dataclass
class Chart:
    id: str
    title: str
    description: str
    chart_type: str
    values: list[Value]
    notes: list[str] = field(default_factory=list)
    sensitivity: str = "public"     # public | internal
    scenario_label: str = ""

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "chart_type": self.chart_type,
            "generated": date.today().isoformat(),
            "data_as_of": config.assumptions()["meta"]["as_of"],
            "scenario_label": self.scenario_label,
            "notes": self.notes,
            "values": [asdict(v) for v in self.values],
        }

    def write(self) -> str:
        if self.sensitivity != "public":
            raise ExportError(f"{self.id}: internal charts are never written to outputs/site")
        if self.id in NEVER_PUBLISH:
            raise ExportError(f"{self.id}: on the never-publish list")
        config.ensure_dirs()
        path = config.OUT_SITE / f"{self.id}.json"
        path.write_text(json.dumps(self.to_dict(), indent=2, ensure_ascii=False) + "\n",
                        encoding="utf-8")
        return path.name
