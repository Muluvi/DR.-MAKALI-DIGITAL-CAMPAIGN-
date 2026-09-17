"""Stage 7 — comment themes and sentiment.

Personal data is stripped at load time, before anything else touches the frame. Only
post_id, date and text survive (CLAUDE.md §3). Kikamba is never scored by an
off-the-shelf sentiment model.
"""
from __future__ import annotations

import re

import pandas as pd

from src import config, report

KEEP_COLUMNS = ["post_id", "date", "text"]

# Anything that could identify a commenter. Dropped even if the template forbade it —
# the file may have been produced by a tool that added columns.
FORBIDDEN_PATTERNS = re.compile(
    r"name|handle|user|author|profile|account|url|link|phone|msisdn|email|gender|"
    r"age|location|ward|id$|uid|fb_|avatar|picture",
    re.I,
)

HANDLE = re.compile(r"@[\w.\-]+")
URL = re.compile(r"https?://\S+|www\.\S+")
PHONE = re.compile(r"(?:\+?254|0)[17]\d{8}")
EMAIL = re.compile(r"[\w.\-]+@[\w.\-]+\.\w+")


def scrub_text(text: str) -> str:
    """Remove handles, URLs, phone numbers and emails from comment text."""
    if not isinstance(text, str):
        return ""
    text = URL.sub("[link]", text)
    text = EMAIL.sub("[email]", text)
    text = PHONE.sub("[phone]", text)
    text = HANDLE.sub("[handle]", text)
    return " ".join(text.split())


def load_comments() -> tuple[pd.DataFrame | None, list[str]]:
    """Load comments, dropping every column that is not post_id, date or text.

    Returns the frame and the list of columns that were dropped, so the report can say
    what arrived that should not have been collected.
    """
    path = config.DATA_TEMPLATES / "comments.csv"
    if not path.exists():
        return None, []
    df = pd.read_csv(path)
    if df.empty:
        return None, []

    dropped = [c for c in df.columns if c not in KEEP_COLUMNS]
    df = df[[c for c in KEEP_COLUMNS if c in df.columns]].copy()
    if "text" in df:
        df["text"] = df["text"].map(scrub_text)
    if "date" in df:
        # Date only. A timestamp plus a post id can re-identify a commenter.
        df["date"] = pd.to_datetime(df["date"], errors="coerce").dt.date
    return df, dropped


def run() -> dict:
    config.ensure_dirs()
    comments, dropped = load_comments()

    rep = report.Report(
        "07_comments.md", "Stage 7 — Comment themes and sentiment",
        "What people say under his posts, coded by theme, sentiment and language.",
    )

    rep.h2("Data protection")
    rep.p(
        "Comments load through a filter that keeps only `post_id`, `date` and `text` and drops "
        "everything else before any analysis runs. Text is then scrubbed of handles, URLs, phone "
        "numbers and email addresses. Dates are reduced to a date, because a timestamp plus a "
        "post id can re-identify a commenter. No comment in any output is linked to a person, "
        "and no output leaves the ward-level aggregate."
    )
    if dropped:
        rep.p(
            f"**{len(dropped)} column(s) arrived that should not have been collected and were "
            f"dropped at load: {', '.join(dropped)}.** Tell the team to stop exporting these — "
            "the filter is a backstop, not a licence to collect them."
        )

    if comments is None:
        rep.h2("No data yet")
        rep.p(
            "`data/templates/comments.csv` is empty. The stage is built and will run on the first "
            "supplied export."
        )
        rep.h2("How labelling will work")
        rep.bullets([
            "Each comment gets a theme (from the pillar list in `config/assumptions.yaml`), a "
            "sentiment (positive, neutral, negative) and a language (English, Kiswahili, Kikamba "
            "or mixed).",
            f"Up to {int(config.value('labelling.in_session_limit'))} items are labelled in "
            "session, in batches. Above that, `src/label_api.py` reads ANTHROPIC_API_KEY from the "
            "environment; the item count is reported and confirmed before it runs, and the key is "
            "never printed or committed.",
            f"Labels below {config.value('labelling.low_confidence_threshold'):.0%} confidence are "
            "flagged for human review.",
            f"A random {config.value('labelling.human_review_sample'):.0%} of all labels goes to "
            "review regardless of confidence, so coverage does not depend on the model's own "
            "self-assessment.",
            "**Every Kikamba comment goes to human review without exception.** Off-the-shelf "
            "sentiment models do not handle Kikamba, and a confident-looking score on a language "
            "the model cannot read is worse than no score. The pack's own finding that bulk SMS "
            "cannot carry Kikamba makes the Kikamba comment stream more important, not less: it "
            "is where the campaign learns what the SMS layer will never hear.",
        ])
        rep.gaps([
            "`comments.csv` — public comments with names and handles already removed at source.",
            "A Kikamba-speaking reviewer. This is a staffing dependency, not a data one, and it "
            "blocks the sentiment read on the language that matters most locally.",
        ])
        rep.write()
        return {"state": "skipped", "summary": "comments.csv empty", "gaps": ["comments.csv"]}

    rep.h2("Volume")
    rep.p(f"{len(comments):,} comments across {comments['post_id'].nunique():,} posts.")
    rep.p(
        f"Labelling is pending: {len(comments):,} items against an in-session limit of "
        f"{int(config.value('labelling.in_session_limit'))}."
    )
    rep.write()
    return {"state": "ok", "summary": f"{len(comments)} comments loaded and scrubbed", "gaps": []}
