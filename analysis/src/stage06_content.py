"""Stage 6 — content performance from posts.csv (the Existing Presence Audit)."""
from __future__ import annotations

import numpy as np
import pandas as pd

from src import charts, config, report

MIN_POSTS_FOR_INFERENCE = 100
ENGAGEMENT_COLS = ["reactions", "comments", "shares"]


def load_posts() -> pd.DataFrame | None:
    path = config.DATA_TEMPLATES / "posts.csv"
    if not path.exists():
        return None
    df = pd.read_csv(path)
    return None if df.empty else df


def prepare(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    for col in ENGAGEMENT_COLS:
        out[col] = pd.to_numeric(out.get(col), errors="coerce")
    out["engagements"] = out[ENGAGEMENT_COLS].sum(axis=1, min_count=1)
    out["posted_at"] = pd.to_datetime(out["posted_at"], errors="coerce", utc=False)
    out["day"] = out["posted_at"].dt.day_name()
    out["hour"] = out["posted_at"].dt.hour
    out["followers_at_post"] = pd.to_numeric(out.get("followers_at_post"), errors="coerce")
    # Engagement rate needs a denominator. Where followers are unknown it stays NaN —
    # never filled with a global average, which would invent a rate per post.
    out["engagement_rate"] = out["engagements"] / out["followers_at_post"]
    return out


def by_dimension(df: pd.DataFrame, column: str) -> pd.DataFrame:
    if column not in df.columns:
        return pd.DataFrame()
    grp = df.groupby(df[column].fillna("(untagged)"), dropna=False)
    out = grp.agg(
        posts=("engagements", "size"),
        median_engagements=("engagements", "median"),
        mean_engagement_rate=("engagement_rate", "mean"),
        rate_n=("engagement_rate", "count"),
    ).reset_index()
    return out.sort_values("median_engagements", ascending=False)


def cadence(df: pd.DataFrame) -> dict:
    valid = df["posted_at"].dropna()
    if valid.empty:
        return {}
    span_days = max((valid.max() - valid.min()).days, 1)
    weekly = df.set_index("posted_at").resample("W").size()
    return {
        "first": valid.min().date().isoformat(),
        "last": valid.max().date().isoformat(),
        "span_days": span_days,
        "posts_per_week": len(valid) / (span_days / 7),
        "weekly": weekly,
        "longest_gap_days": int(valid.sort_values().diff().dt.days.max() or 0),
    }


def negative_binomial(df: pd.DataFrame) -> tuple[pd.DataFrame | None, str]:
    """Engagements on post features, with log(followers) as an offset.

    The offset is what makes counts comparable across a growing account: it models the
    rate per follower rather than the raw count.
    """
    import statsmodels.api as sm
    import statsmodels.formula.api as smf

    usable = df.dropna(subset=["engagements", "followers_at_post"])
    usable = usable[usable["followers_at_post"] > 0]
    if len(usable) < 20:
        return None, f"Only {len(usable)} posts have both engagements and a follower count."

    terms = [c for c in ("format", "language", "pillar") if c in usable.columns
             and usable[c].nunique() > 1]
    if not terms:
        return None, "No post feature varies enough to regress on."

    formula = "engagements ~ " + " + ".join(f"C({t})" for t in terms)
    usable = usable.assign(_offset=np.log(usable["followers_at_post"]))
    try:
        model = smf.glm(formula, data=usable, family=sm.families.NegativeBinomial(alpha=1.0),
                        offset=usable["_offset"]).fit()
    except Exception as exc:  # noqa: BLE001 - a failed fit is a reportable gap, not a crash
        return None, f"Model did not converge: {exc}"

    out = pd.DataFrame({
        "term": model.params.index,
        "rate_ratio": np.exp(model.params.to_numpy()),
        "p_value": model.pvalues.to_numpy(),
    })
    note = ("Directional only — fewer than ~100 posts."
            if len(usable) < MIN_POSTS_FOR_INFERENCE else
            f"n = {len(usable)} posts with a follower count.")
    return out, note


def chart_heatmap(df: pd.DataFrame) -> str | None:
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    pivot = df.pivot_table(index="day", columns="hour", values="engagements", aggfunc="median")
    if pivot.empty:
        return None
    pivot = pivot.reindex(days)
    charts.apply()
    fig, ax = charts.figure(8.4, 3.6)
    im = ax.imshow(pivot.to_numpy(dtype=float), aspect="auto", cmap=charts.SEQUENTIAL)
    ax.set_yticks(range(len(days)), days)
    ax.set_xticks(range(len(pivot.columns)), [f"{h:02d}" for h in pivot.columns])
    ax.set_xlabel("Hour of day (local)")
    ax.set_title("Median engagements by day and hour")
    ax.grid(visible=False)
    fig.colorbar(im, ax=ax, label="Median engagements", fraction=0.03)
    return charts.save(fig, "06_engagement_heatmap.svg",
                       "Cells with no posts are blank, not zero.")


def run() -> dict:
    config.ensure_dirs()
    posts = load_posts()

    rep = report.Report(
        "06_content.md", "Stage 6 — Content performance",
        "What his existing posting actually achieves, by pillar, format, language and timing.",
    )

    if posts is None:
        rep.h2("No data yet")
        rep.p(
            "`data/templates/posts.csv` is empty. This stage is built and will run on the first "
            "filled export; nothing is estimated in the meantime."
        )
        rep.h2("What the pack already establishes")
        rep.bullets([
            "The Facebook account shows **~15,000 followers and 745 posts** as at 16 Sep 2026. "
            "Both are read off a screenshot, so both carry status verify.",
            "It appears to be a **personal profile in professional mode**, not a Page, because a "
            "friends list is visible. This decides which analytics exist at all and must be "
            "confirmed first — a personal profile has no Professional Dashboard export.",
            "The posting pattern is described as **daily activity updates with no pillars, "
            "targeting or stated rationale**. That is the gap this stage measures.",
            "Six profile hygiene issues are already identified and need no analysis to fix: the "
            "MP start date given as Aug 2012 against a Parliament record of 2013, "
            "\"Programmer Officer\" for Programme Officer, a garbled \"Forms of government\" "
            "employer entry, Nairobi shown as current city for a county aspirant, "
            "\"Incoming Governor\" presuming a nomination that has not happened, and the PhD "
            "missing from a profile whose whole positioning is the Economist Governor.",
        ])
        rep.h2("What this stage will produce")
        rep.bullets([
            "Engagement rate by pillar, format and language.",
            "A median-engagement heatmap by day and hour.",
            "Posting cadence, weekly volume and the longest silent gap.",
            "Top 10 and bottom 10 posts.",
            "Pillar labels for untagged posts, each with a confidence score. Low-confidence "
            "labels plus a random 20% of all labels go to human review.",
            "A negative binomial regression of engagements on post features with log(followers) "
            "as an offset, reported as directional only below ~100 posts.",
        ])
        rep.gaps([
            "`posts.csv` — the last 90 days of public posts (pack gap 3).",
            "Confirmation of whether the account is a Page or a personal profile (pack gap 1). "
            "If it is a personal profile, there is no Professional Dashboard export and the audit "
            "must be a manual log instead.",
            "Follower count at time of posting, without which engagement rates cannot be "
            "compared across a growing account.",
            "Handles and follower counts for X, TikTok, Instagram and YouTube (pack gap 2).",
        ])
        rep.write()
        return {"state": "skipped", "summary": "posts.csv empty", "gaps": ["posts.csv"]}

    df = prepare(posts)
    charts_made = []
    heat = chart_heatmap(df)
    if heat:
        charts_made.append((heat, "Median engagements by day and hour"))

    cad = cadence(df)
    nb, nb_note = negative_binomial(df)

    for name, chart in charts_made:
        rep.chart(name, chart)

    rep.h2("Volume and cadence")
    if cad:
        rep.bullets([
            f"{len(df):,} posts from {cad['first']} to {cad['last']} ({cad['span_days']} days).",
            f"{cad['posts_per_week']:.1f} posts per week on average.",
            f"Longest gap between posts: {cad['longest_gap_days']} days.",
        ])

    for dim in ("pillar", "format", "language"):
        table = by_dimension(df, dim)
        if not table.empty:
            rep.h3(f"By {dim}")
            rep.table(table)

    rep.h2("Top and bottom posts")
    cols = [c for c in ("posted_at", "pillar", "format", "language", "engagements", "url")
            if c in df.columns]
    rep.h3("Top 10")
    rep.table(df.nlargest(10, "engagements")[cols])
    rep.h3("Bottom 10")
    rep.table(df.nsmallest(10, "engagements")[cols])

    rep.h2("What drives engagement")
    if nb is None:
        rep.p(f"Regression not run. {nb_note}")
    else:
        rep.p(
            "Negative binomial regression of engagements on post features, with log(followers) "
            "as an offset so counts are comparable across a growing account. Coefficients are "
            f"shown as rate ratios: 1.0 means no effect. {nb_note}"
        )
        if len(df) < MIN_POSTS_FOR_INFERENCE:
            rep.p(
                f"**Directional only.** With {len(df)} posts, these effects indicate a direction "
                "and nothing more. Do not quote the p-values as evidence."
            )
        rep.table(nb, floatfmt="{:.3f}")

    untagged = int(df["pillar"].isna().sum()) if "pillar" in df else 0
    if untagged:
        rep.h2("Labelling")
        rep.p(
            f"{untagged} posts have no pillar. Labelling runs in-session in batches up to "
            f"{int(config.value('labelling.in_session_limit'))} items; beyond that, "
            "`src/label_api.py` is used and the item count is reported before it runs."
        )
    rep.write()
    return {"state": "ok", "summary": f"{len(df)} posts analysed", "gaps": []}
