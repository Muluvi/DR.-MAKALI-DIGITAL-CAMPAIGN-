"""Stage 8 — competitor benchmark. Internal only: never copied to the public site."""
from __future__ import annotations

import pandas as pd

from src import config, report

CANDIDATES = ["Mulu", "Kasalu", "Wambua", "Ngilu"]


def load() -> pd.DataFrame | None:
    path = config.DATA_TEMPLATES / "competitors.csv"
    if not path.exists():
        return None
    df = pd.read_csv(path)
    return None if df.empty else df


def metrics(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    for col in ("followers", "posts_last_28d", "total_engagements_last_28d", "mentions_last_28d"):
        out[col] = pd.to_numeric(out.get(col), errors="coerce")
    out["posts_per_week"] = out["posts_last_28d"] / 4
    # Engagement rate per post per follower — the only form comparable across account sizes.
    out["engagement_rate"] = (
        out["total_engagements_last_28d"] / out["posts_last_28d"] / out["followers"]
    )
    total_mentions = out["mentions_last_28d"].sum()
    out["share_of_voice"] = out["mentions_last_28d"] / total_mentions if total_mentions else pd.NA
    return out


def run() -> dict:
    config.ensure_dirs()
    df = load()

    rep = report.Report(
        "08_competitors.md", "Stage 8 — Competitor benchmark",
        "Mulu against Kasalu, Wambua and Ngilu on followers, cadence, engagement, share of "
        "voice and paid activity.",
    )
    rep.p(
        "**Internal only.** This report is excluded from the site export by "
        "`site_export.never_publish`. Rival analysis on a public URL tells rivals what the "
        "campaign is watching."
    )

    if df is None:
        rep.h2("No data yet")
        rep.p("`data/templates/competitors.csv` is empty. The stage is built and runs on supply.")
        rep.h2("What the pack already establishes")
        rep.p(
            "The pack has no rival digital metrics at all — followers, posting frequency, top "
            "content and ad activity are all listed as data gaps (pack gaps 4 and 5). What it "
            "does establish is non-digital and still matters for the benchmark:"
        )
        rep.bullets([
            "**Kasalu leads every published poll** and won the 2022 Woman Rep race with 201,899 "
            "votes — more than the winning gubernatorial tally of 198,004. She has already "
            "demonstrated countywide vote-getting capacity above the benchmark.",
            "**Kasalu is visibly campaigning on the ground**: a #ZiaraMashinani grassroots tour "
            "and a visibility push in Kitui East [S28, S29].",
            "**Wambua's published share is contracting** across the Mizani rounds, 16.3% to "
            "14.3% — though as Stage 2 shows, that movement cannot be tested without sample sizes.",
            "**Ngilu has a reported media asset.** Mbaitu FM is reported as linked to her [S38], "
            "and Athiani FM as linked to the party leader. Both are T3 and carry verify. Media "
            "planning has to assume neither station is neutral.",
            "**Mulu's own baseline is ~15,000 Facebook followers and 745 posts**, read off a "
            "screenshot and carrying verify. Until rival counts exist, there is no benchmark to "
            "read it against.",
        ])
        rep.h2("What this stage will produce")
        rep.table(pd.DataFrame([
            {"Metric": "Followers", "Comparable across candidates?": "yes, per platform"},
            {"Metric": "Posts per week", "Comparable across candidates?": "yes"},
            {"Metric": "Engagement rate", "Comparable across candidates?":
             "yes — engagements per post per follower, the only form that is size-neutral"},
            {"Metric": "Share of voice", "Comparable across candidates?":
             "yes, as a share of the four-candidate total"},
            {"Metric": "Meta Ad Library activity", "Comparable across candidates?":
             "yes — public and observable"},
        ]))
        rep.gaps([
            "`competitors.csv` for Kasalu, Wambua and Ngilu (pack gap 5).",
            "Meta Ad Library snapshots for all four, including supporter pages (pack gap 4).",
            "Mulu's own channel metrics, without which he cannot be placed on the benchmark.",
        ])
        rep.write()
        return {"state": "skipped", "summary": "competitors.csv empty", "gaps": ["competitors.csv"]}

    m = metrics(df)
    m.to_csv(config.DATA_PROCESSED / "competitor_metrics.csv", index=False)
    rep.h2("Benchmark")
    rep.table(m[["candidate", "platform", "followers", "posts_per_week", "engagement_rate",
                 "share_of_voice", "meta_ads_active", "measured_on"]])
    rep.p(
        "Engagement rate is engagements per post per follower. Raw engagement counts favour "
        "the largest account and say nothing about whether content works."
    )
    rep.write()
    return {"state": "ok", "summary": f"{len(m)} competitor rows", "gaps": []}
