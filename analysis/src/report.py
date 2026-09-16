"""Shared helpers for writing reports. British English, charts first, short sentences."""
from __future__ import annotations

from datetime import date

import pandas as pd

from src import config

SCENARIO_NOTE = f"> **{config.SCENARIO_LABEL}**"


class Report:
    def __init__(self, filename: str, title: str, strapline: str = "") -> None:
        self.path = config.REPORTS / filename
        self.lines: list[str] = [f"# {title}", ""]
        if strapline:
            self.lines += [strapline, ""]
        as_of = config.assumptions()["meta"]["as_of"]
        self.lines += [
            f"*Kitui 2027 analysis pipeline · data as of {as_of} · generated {date.today().isoformat()}*",
            "",
        ]

    def h2(self, text: str) -> "Report":
        self.lines += ["", f"## {text}", ""]
        return self

    def h3(self, text: str) -> "Report":
        self.lines += ["", f"### {text}", ""]
        return self

    def p(self, text: str) -> "Report":
        self.lines += [" ".join(text.split()), ""]
        return self

    def raw(self, text: str) -> "Report":
        self.lines += [text, ""]
        return self

    def bullets(self, items: list[str]) -> "Report":
        self.lines += [f"- {' '.join(i.split())}" for i in items] + [""]
        return self

    def chart(self, filename: str, caption: str) -> "Report":
        """Charts first. Path is relative to reports/, which sits beside outputs/."""
        self.lines += [f"![{caption}](../outputs/charts/{filename})", "", f"*{caption}*", ""]
        return self

    def table(self, df: pd.DataFrame, floatfmt: str = "{:,.1f}") -> "Report":
        if df.empty:
            return self.p("_No rows._")
        header = "| " + " | ".join(str(c) for c in df.columns) + " |"
        rule = "|" + "|".join("---" for _ in df.columns) + "|"
        body = []
        for _, row in df.iterrows():
            cells = []
            for v in row:
                if isinstance(v, float):
                    cells.append("—" if pd.isna(v) else floatfmt.format(v))
                elif v is None or (isinstance(v, float) and pd.isna(v)):
                    cells.append("—")
                else:
                    cells.append(str(v))
            body.append("| " + " | ".join(cells) + " |")
        self.lines += [header, rule, *body, ""]
        return self

    def gaps(self, items: list[str]) -> "Report":
        if not items:
            return self
        self.h2("Data gaps")
        self.lines += [f"- **[DATA NEEDED]** {' '.join(i.split())}" for i in items] + [""]
        return self

    def scenario_label(self) -> "Report":
        self.lines += [SCENARIO_NOTE, ""]
        return self

    def write(self) -> str:
        config.ensure_dirs()
        self.path.write_text("\n".join(self.lines).rstrip() + "\n", encoding="utf-8")
        return str(self.path.relative_to(config.ANALYSIS_ROOT))
