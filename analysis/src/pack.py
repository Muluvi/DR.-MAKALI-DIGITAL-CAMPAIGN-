"""Parser for the markdown data pack.

The pack is the raw input (CLAUDE.md §1: never invent data). This module turns its
markdown tables into rows, and preserves the pack's own [VERIFY], [DATA NEEDED] and
[CALC] tags as a status column rather than discarding them.

Nothing here interprets a figure. Interpretation belongs to the stage modules.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

from src import config

# Pack tags, in the order they are tested. [DATA NEEDED] wins over [VERIFY] because a
# missing figure is a harder stop than an unverified one.
TAG_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    (config.TAG_DATA_NEEDED, re.compile(r"\[DATA NEEDED\]", re.I)),
    (config.TAG_VERIFY, re.compile(r"\[VERIFY\]", re.I)),
    (config.TAG_CALC, re.compile(r"\[CALC\]", re.I)),
]

SOURCE_REF = re.compile(r"\[(S\d+(?:\s*,\s*S\d+)*)\]")
NUMBER = re.compile(r"-?\d[\d,]*\.?\d*")


def tag_of(text: str) -> str:
    """The pack tag carried by a cell or line, or 'ok' when it carries none."""
    for name, pattern in TAG_PATTERNS:
        if pattern.search(text):
            return name
    return config.TAG_OK


def source_ids(text: str) -> list[str]:
    """Every [S**n**] reference in a cell, flattened and de-duplicated in order."""
    found: list[str] = []
    for group in SOURCE_REF.findall(text):
        for sid in re.split(r"\s*,\s*", group):
            sid = sid.strip()
            if sid and sid not in found:
                found.append(sid)
    return found


def clean(cell: str) -> str:
    """Strip markdown emphasis and collapse whitespace. Tags and refs are left in place;
    callers extract them first with tag_of()/source_ids() when they want them gone."""
    text = re.sub(r"\*\*|\*|`", "", cell)
    return " ".join(text.split()).strip()


def strip_annotations(cell: str) -> str:
    """Cell text with source refs and pack tags removed — the human-readable residue."""
    text = SOURCE_REF.sub("", cell)
    for _, pattern in TAG_PATTERNS:
        text = pattern.sub("", text)
    return clean(text).strip(" —-–,;")


def to_number(text: str) -> float | None:
    """First number in the text, commas removed. None when there is no number.

    Returns None rather than 0 for '[DATA NEEDED]' — a missing figure must never become
    a zero, which would read as a real measurement of nothing.
    """
    stripped = SOURCE_REF.sub("", text)
    match = NUMBER.search(stripped.replace("~", "").replace("≈", ""))
    if not match:
        return None
    try:
        return float(match.group(0).replace(",", ""))
    except ValueError:
        return None


@dataclass
class Table:
    """One markdown table, with the heading trail it sits under."""

    section: str
    heading_path: list[str]
    header: list[str]
    rows: list[list[str]]
    line_no: int

    def as_dicts(self) -> list[dict[str, str]]:
        out: list[dict[str, str]] = []
        for row in self.rows:
            padded = row + [""] * (len(self.header) - len(row))
            out.append({h: padded[i] for i, h in enumerate(self.header)})
        return out


@dataclass
class Source:
    id: str
    title: str
    url: str
    tier: int


@dataclass
class Pack:
    path: Path
    text: str
    tables: list[Table] = field(default_factory=list)
    sources: list[Source] = field(default_factory=list)

    def tables_under(self, needle: str) -> list[Table]:
        """Tables whose heading trail contains `needle` (case-insensitive substring)."""
        needle = needle.lower()
        return [
            t for t in self.tables
            if any(needle in h.lower() for h in t.heading_path)
        ]

    def table_under(self, needle: str) -> Table:
        found = self.tables_under(needle)
        if not found:
            raise LookupError(f"no table under a heading matching {needle!r}")
        return found[0]

    def section_text(self, needle: str) -> str:
        """Raw text of the first section whose heading matches `needle`."""
        needle = needle.lower()
        lines = self.text.splitlines()
        start = None
        level = 0
        for i, line in enumerate(lines):
            m = re.match(r"^(#{2,4})\s+(.*)$", line)
            if m and needle in m.group(2).lower():
                start, level = i + 1, len(m.group(1))
                break
        if start is None:
            return ""
        out: list[str] = []
        for line in lines[start:]:
            m = re.match(r"^(#{2,4})\s+", line)
            if m and len(m.group(1)) <= level:
                break
            out.append(line)
        return "\n".join(out)


def _split_row(line: str) -> list[str]:
    cells = line.split("|")
    if cells and not cells[0].strip():
        cells = cells[1:]
    if cells and not cells[-1].strip():
        cells = cells[:-1]
    return [c.strip() for c in cells]


def _is_separator(line: str) -> bool:
    return bool(re.fullmatch(r"[\s|:\-]+", line)) and "-" in line and "|" in line


def parse_tables(text: str) -> list[Table]:
    lines = text.splitlines()
    tables: list[Table] = []
    trail: dict[int, str] = {}
    i = 0
    while i < len(lines):
        line = lines[i]
        heading = re.match(r"^(#{1,6})\s+(.*)$", line)
        if heading:
            depth = len(heading.group(1))
            trail[depth] = clean(heading.group(2))
            for d in list(trail):
                if d > depth:
                    del trail[d]
            i += 1
            continue

        if line.count("|") >= 2 and i + 1 < len(lines) and _is_separator(lines[i + 1]):
            header = [clean(c) for c in _split_row(line)]
            rows: list[list[str]] = []
            j = i + 2
            while j < len(lines) and lines[j].count("|") >= 2:
                rows.append(_split_row(lines[j]))
                j += 1
            path = [trail[d] for d in sorted(trail)]
            tables.append(
                Table(
                    section=path[-1] if path else "",
                    heading_path=path,
                    header=header,
                    rows=rows,
                    line_no=i + 1,
                )
            )
            i = j
            continue
        i += 1
    return tables


SOURCE_LINE = re.compile(r"^-\s*(S\d+)\s*[—–-]\s*(.*)$")
TIER_HEADING = re.compile(r"^\*\*(.+?)\((T[123])\)\*\*", re.I)


def parse_sources(text: str) -> list[Source]:
    """Section 9's source list, with the tier taken from the sub-heading above each block."""
    sources: list[Source] = []
    tier = 0
    for line in text.splitlines():
        heading = TIER_HEADING.match(line.strip())
        if heading:
            tier = int(heading.group(2)[1])
            continue
        m = SOURCE_LINE.match(line.strip())
        if not m:
            continue
        sid, rest = m.group(1), m.group(2)
        url = ""
        url_match = re.search(r"https?://\S+", rest)
        if url_match:
            url = url_match.group(0).rstrip(").,")
            # Title is everything before the final em-dash that introduces the URL.
            title = rest[: url_match.start()]
        else:
            title = rest
        title = clean(title).rstrip(" —–-")
        sources.append(Source(id=sid, title=title, url=url, tier=tier))
    return sources


def load(path: Path | None = None) -> Pack | None:
    """Load and parse the pack. Returns None when it is absent, so callers can log the
    gap and continue rather than crash (CLAUDE.md §1)."""
    path = path or config.PACK
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8")
    pack = Pack(path=path, text=text)
    pack.tables = parse_tables(text)
    pack.sources = parse_sources(text)
    return pack
