"""Turn parsed pack tables into the seven tidy CSVs.

Every row carries source_id, tier and status. Where the pack gives two values for one
figure, both rows survive with status 'conflict' (CLAUDE.md §1).
"""
from __future__ import annotations

import pandas as pd

from src import config, pack as packmod
from src.pack import Pack, clean, source_ids, strip_annotations, tag_of, to_number


def _tier_for(sources: dict[str, int], ids: list[str]) -> int | None:
    """The weakest (highest-numbered) tier among the cited sources.

    Weakest, not strongest: a claim resting on a T1 and a T3 source is only as good as
    the T3 leg unless the T1 alone supports it.
    """
    tiers = [sources[i] for i in ids if i in sources]
    return max(tiers) if tiers else None


def _status(text: str, tier: int | None) -> str:
    """Pack tag if there is one; otherwise T3 always means 'verify' (CLAUDE.md §2)."""
    tag = tag_of(text)
    if tag != config.TAG_OK:
        return tag
    return config.TAG_VERIFY if tier == 3 else config.TAG_OK


def sources_df(p: Pack) -> pd.DataFrame:
    return pd.DataFrame(
        [{"id": s.id, "title": s.title, "url": s.url, "tier": s.tier} for s in p.sources]
    ).sort_values("id", key=lambda c: c.str[1:].astype(int)).reset_index(drop=True)


def wards_df(p: Pack, tiers: dict[str, int]) -> pd.DataFrame:
    table = p.table_under("All 40 wards")
    rows = []
    for row in table.as_dicts():
        voters = to_number(row["Voters"])
        rows.append(
            {
                "constituency": strip_annotations(row["Constituency"]),
                "ward": strip_annotations(row["Ward"]),
                "registered_voters_2022": int(voters) if voters is not None else None,
                "source_id": "S1",
                "tier": tiers.get("S1", 1),
                "as_of": "2022",
                "method": "official",
                "status": config.TAG_OK,
            }
        )
    return pd.DataFrame(rows)


def constituencies_df(p: Pack, tiers: dict[str, int]) -> pd.DataFrame:
    table = p.table_under("Registered voters by constituency")
    rows = []
    for row in table.as_dicts():
        name = strip_annotations(row.get("Constituency", ""))
        voters = to_number(row.get("Voters", ""))
        if not name or voters is None or name.lower() == "total":
            continue
        rows.append(
            {
                "region": strip_annotations(row.get("Region", "")),
                "constituency": name,
                "registered_voters_2022": int(voters),
                "mp_2022": strip_annotations(row.get("MP (2022)", "")),
                "source_id": "S1",
                "tier": tiers.get("S1", 1),
                "as_of": "2022",
                "method": "official",
                "status": config.TAG_OK,
            }
        )
    return pd.DataFrame(rows)


CANDIDATES = ["Mulu", "Kasalu", "Wambua", "Ngilu"]


def polls_df(p: Pack, tiers: dict[str, int]) -> pd.DataFrame:
    """Long format: one row per pollster-round-candidate. Sample size None when the pack
    says [DATA NEEDED] — never zero, which would read as a real sample of nobody."""
    table = p.table_under("Published 2026 polls")
    rows = []
    for row in table.as_dicts():
        pollster_cell = row["Pollster"]
        ids = source_ids(pollster_cell)
        tier = _tier_for(tiers, ids)
        pollster = strip_annotations(pollster_cell)
        release = strip_annotations(row["Release"])
        sample = to_number(row["Sample"]) if "DATA NEEDED" not in row["Sample"] else None
        undecided = to_number(row["Undecided"]) if "DATA NEEDED" not in row["Undecided"] else None
        for cand in CANDIDATES:
            cell = row.get(cand, "")
            share = None if "not polled" in cell.lower() else to_number(cell)
            rows.append(
                {
                    "pollster": pollster,
                    "release_date": release,
                    "candidate": cand,
                    "share_pct": share,
                    "sample_size": int(sample) if sample else None,
                    "undecided_pct": undecided,
                    "polled": share is not None,
                    "source_id": ids[0] if ids else "",
                    "tier": tier,
                    "as_of": release,
                    "method": "official",
                    "status": _status(pollster_cell + row["Sample"], tier),
                }
            )
    return pd.DataFrame(rows)


def results_2022_df(p: Pack, tiers: dict[str, int]) -> pd.DataFrame:
    """2022 reference results. Musila's governor total is carried twice, both rows
    status 'conflict', because the pack gives 117,606 [S12,S13] and 114,606 [S11]."""
    rows = []
    table = p.table_under("2022 results")
    for row in table.as_dicts():
        ids = source_ids(row["Votes"])
        tier = _tier_for(tiers, ids)
        votes = to_number(row["Votes"])
        rows.append(
            {
                "race": strip_annotations(row["Race"]),
                "candidate": strip_annotations(row["Winner"]).split("(")[0].strip(),
                "party": "WDM (now WPF)",
                "votes": int(votes) if votes is not None else None,
                "outcome": "winner",
                "source_id": ",".join(ids),
                "tier": tier,
                "as_of": "2022-08",
                "method": "official",
                "status": _status(row["Votes"], tier),
            }
        )

    # The runner-up dispute, from §2.3. Both values kept, neither preferred.
    for votes, sids in ((117606, "S12,S13"), (114606, "S11")):
        first = sids.split(",")[0]
        rows.append(
            {
                "race": "Governor",
                "candidate": "David Musila",
                "party": "Jubilee",
                "votes": votes,
                "outcome": "runner-up",
                "source_id": sids,
                "tier": tiers.get(first, 2),
                "as_of": "2022-08",
                "method": "official",
                "status": config.TAG_CONFLICT,
            }
        )
    for cand, votes, sid in (("Mueke", 10639, "S11"), ("Charity Ngilu", 2026, "S11")):
        rows.append(
            {
                "race": "Governor",
                "candidate": cand,
                "party": "",
                "votes": votes,
                "outcome": "also-ran",
                "source_id": sid,
                "tier": tiers.get(sid, 2),
                "as_of": "2022-08",
                "method": "official",
                "status": config.TAG_OK,
            }
        )
    return pd.DataFrame(rows)


def channels_df(p: Pack, tiers: dict[str, int]) -> pd.DataFrame:
    """Long format across three pack sections: national digital metrics, the Kikamba radio
    landscape, and his own owned channels."""
    rows: list[dict] = []

    for row in p.table_under("National digital picture").as_dicts():
        ids = source_ids(row["Source"])
        tier = _tier_for(tiers, ids) or 2
        rows.append(
            {
                "channel": "national digital",
                "metric": strip_annotations(row["Metric"]),
                "value_text": strip_annotations(row["Figure"]),
                "value": to_number(row["Figure"]),
                "scope": "national",
                "source_id": ids[0] if ids else "",
                "tier": tier,
                "as_of": "2025-2026",
                "method": "official",
                "status": _status(row["Figure"], tier),
            }
        )

    for row in p.table_under("Kikamba radio landscape").as_dicts():
        cell = row["Reported ownership / affiliation"]
        ids = source_ids(cell)
        tier = _tier_for(tiers, ids) or 3
        rows.append(
            {
                "channel": "radio",
                "metric": strip_annotations(row["Station"]),
                "value_text": strip_annotations(cell),
                "value": None,
                "scope": "county",
                "source_id": ",".join(ids),
                "tier": tier,
                "as_of": "2026",
                "method": "official",
                # Ownership claims are T3 throughout this table and the heading says
                # [VERIFY] — so every row carries verify, per CLAUDE.md §2.
                "status": config.TAG_VERIFY,
                "frequency": strip_annotations(row.get("Kitui/Mwingi frequency", "")),
            }
        )

    for row in p.table_under("Other owned channels").as_dicts():
        cell = row["Handle / URL"]
        ids = source_ids(cell)
        tier = _tier_for(tiers, ids) or 3
        rows.append(
            {
                "channel": "owned",
                "metric": strip_annotations(row["Channel"]),
                "value_text": strip_annotations(cell),
                "value": None,
                "scope": "candidate",
                "source_id": ",".join(ids),
                "tier": tier,
                "as_of": "2026-09-16",
                "method": "official",
                "status": _status(row["Note"] + cell, tier),
            }
        )

    # His Facebook profile, from §1.1. Follower and post counts are the Stage 6 baseline.
    for metric, text, value in (
        ("Facebook followers", "~15K", 15000.0),
        ("Facebook following", "40", 40.0),
        ("Facebook posts", "745", 745.0),
    ):
        rows.append(
            {
                "channel": "owned",
                "metric": metric,
                "value_text": text,
                "value": value,
                "scope": "candidate",
                "source_id": "",
                "tier": 3,
                "as_of": "2026-09-16",
                "method": "official",
                # Read off a screenshot, not an analytics export. "~15K" is rounded at
                # source, so it cannot carry more precision than that.
                "status": config.TAG_VERIFY,
            }
        )
    return pd.DataFrame(rows)


def county_finance_df(p: Pack, tiers: dict[str, int]) -> pd.DataFrame:
    rows = []
    for row in p.table_under("County finances").as_dicts():
        ids = source_ids(row["Source"])
        tier = _tier_for(tiers, ids) or 1
        cell = row["FY2026/27"]
        rows.append(
            {
                "item": strip_annotations(row["Item"]),
                "fy": "2026/27",
                "value_text": strip_annotations(cell),
                "value_ksh": to_number(cell),
                "source_id": ",".join(ids),
                "tier": tier,
                "as_of": "2026",
                "method": "official",
                "status": _status(cell, tier),
            }
        )
    return pd.DataFrame(rows)


def drought_df(p: Pack, tiers: dict[str, int]) -> pd.DataFrame:
    """NDMA phases and the water indicators, read from §5.2's bullets."""
    import re

    text = p.section_text("Water and drought")
    rows: list[dict] = []
    bullet = re.compile(r"^\s*-\s*(\w{3} \d{4})(?: bulletin)?[^:]*:\s*(.*)$")
    for line in text.splitlines():
        m = bullet.match(line)
        if not m:
            continue
        period, body = m.group(1), m.group(2)
        ids = source_ids(body)
        tier = _tier_for(tiers, ids) or 1
        phase_match = re.search(r"\*\*(Alert|Normal|Alarm|Emergency|Recovery)\*\*", body)
        rows.append(
            {
                "indicator": "NDMA drought phase",
                "period": period,
                "value_text": strip_annotations(body)[:160],
                "value": None,
                "phase": phase_match.group(1) if phase_match else "",
                "unit": "phase",
                "scope": "county",
                "source_id": ",".join(ids),
                "tier": tier,
                "as_of": period,
                "method": "official",
                "status": _status(body, tier),
            }
        )

    rows.append(
        {
            "indicator": "Basic drinking-water service",
            "period": "2022",
            "value_text": "21% — lowest share of any county in Kenya",
            "value": 21.0,
            "phase": "",
            "unit": "% of households",
            "scope": "county",
            "source_id": "S41",
            "tier": tiers.get("S41", 1),
            "as_of": "2022",
            "method": "official",
            "status": config.TAG_OK,
        }
    )
    rows.append(
        {
            "indicator": "Water trekking distance",
            "period": "Feb 2026",
            "value_text": "7.2 km — longest among semi-arid counties, tied with Lamu",
            "value": 7.2,
            "phase": "",
            "unit": "km",
            "scope": "county",
            "source_id": "S43",
            "tier": tiers.get("S43", 1),
            "as_of": "2026-02",
            "method": "official",
            "status": config.TAG_OK,
        }
    )
    return pd.DataFrame(rows)


def build_all(p: Pack) -> dict[str, pd.DataFrame]:
    src = sources_df(p)
    tiers = dict(zip(src["id"], src["tier"]))
    return {
        "sources": src,
        "wards": wards_df(p, tiers),
        "constituencies": constituencies_df(p, tiers),
        "polls": polls_df(p, tiers),
        "results_2022": results_2022_df(p, tiers),
        "channels": channels_df(p, tiers),
        "county_finance": county_finance_df(p, tiers),
        "drought": drought_df(p, tiers),
    }
