"""Stage 1d — empty CSV templates for data the team will supply, plus a schema README.

Each template is written with headers and no rows. Every downstream stage reads these
paths, finds them empty, logs [DATA NEEDED] and continues (CLAUDE.md §7).

Nothing here contains example rows. A worked example in a template is indistinguishable
from real data once someone opens it in a spreadsheet, and this pipeline must never let
invented numbers reach a result.
"""
from __future__ import annotations

import csv
from dataclasses import dataclass

from src import config


@dataclass(frozen=True)
class Column:
    name: str
    description: str


@dataclass(frozen=True)
class Template:
    name: str
    purpose: str
    stage: str
    columns: tuple[Column, ...]
    notes: tuple[str, ...] = ()


TEMPLATES: tuple[Template, ...] = (
    Template(
        name="posts",
        purpose="Every public post from the candidate's channels, for the Existing Presence Audit.",
        stage="Stage 6",
        columns=(
            Column("post_id", "Stable unique id. Platform id where one exists."),
            Column("platform", "facebook | x | tiktok | instagram | youtube | whatsapp"),
            Column("posted_at", "ISO 8601 with timezone, e.g. 2026-09-01T14:30:00+03:00. Local time matters for the day/hour heatmap."),
            Column("format", "photo | video | text | link | live | carousel"),
            Column("language", "en | sw | kam | mixed"),
            Column("pillar", "One of the pillar ids in config/assumptions.yaml. Leave blank to have Stage 6 label it."),
            Column("text", "Post copy. No personal data about anyone other than the candidate."),
            Column("impressions", "Integer, blank if unknown. Never zero for unknown."),
            Column("reach", "Integer, blank if unknown."),
            Column("reactions", "Integer."),
            Column("comments", "Integer."),
            Column("shares", "Integer."),
            Column("followers_at_post", "Follower count when posted. The Stage 6 regression offset."),
            Column("url", "Permalink."),
        ),
        notes=(
            "Blank means unknown. Zero means measured as zero. The difference changes every rate.",
            "followers_at_post drives log(followers) as the negative-binomial offset. Without it, "
            "engagement counts cannot be compared across a growing account.",
            "Under ~100 posts, Stage 6 reports regression effects as directional only.",
        ),
    ),
    Template(
        name="comments",
        purpose="Public comments for theme and sentiment coding.",
        stage="Stage 7",
        columns=(
            Column("post_id", "Foreign key to posts.post_id."),
            Column("date", "ISO date. Date only — no timestamp, which can re-identify."),
            Column("text", "Comment text with @handles removed."),
        ),
        notes=(
            "THREE COLUMNS ONLY, BY DESIGN. Do not add commenter name, handle, profile id, "
            "url, gender, location or follower count. Stage 7 strips these at load time even "
            "if present, but they must not be collected in the first place.",
            "Ward-level aggregates only. No comment is ever linked back to a person.",
            "Kikamba comments are always routed to human review: off-the-shelf sentiment "
            "models do not handle Kikamba and their output on it must not be trusted.",
        ),
    ),
    Template(
        name="competitors",
        purpose="Rival channel benchmarks for Kasalu, Wambua and Ngilu.",
        stage="Stage 8",
        columns=(
            Column("candidate", "Mulu | Kasalu | Wambua | Ngilu"),
            Column("platform", "facebook | x | tiktok | instagram | youtube"),
            Column("handle", "Public account handle."),
            Column("followers", "Integer, as at measured_on."),
            Column("posts_last_28d", "Integer. 28 days, not 'a month', so weeks divide evenly."),
            Column("total_engagements_last_28d", "Reactions + comments + shares over the same window."),
            Column("mentions_last_28d", "Public mentions, for share of voice."),
            Column("meta_ads_active", "yes | no | unknown — from the Meta Ad Library."),
            Column("meta_ads_count", "Active ads in the library. Blank if unknown."),
            Column("measured_on", "ISO date the row was collected. Every figure is a snapshot."),
            Column("source_note", "How it was collected, e.g. 'manual audit of public page'."),
        ),
        notes=(
            "Public, observable metrics only. No private or scraped personal data.",
            "Stage 8 output is internal: rival analysis is never copied to the public site.",
        ),
    ),
    Template(
        name="register_2026_by_ward",
        purpose="The post-ECVR 2026 register, by ward — the IEBC annex figure.",
        stage="Stages 1, 3, 4",
        columns=(
            Column("ward", "Ward name."),
            Column("constituency", "Constituency name."),
            Column("registered_voters_2026", "Integer, from the IEBC annex."),
            Column("source_id", "Source id, e.g. S3 for the IEBC ECVR release annex."),
            Column("tier", "1 for the IEBC annex. Only a T1 figure should replace the T3 605,703."),
            Column("as_of", "ISO date of the register snapshot."),
        ),
        notes=(
            "This is pack gap 6 and the single highest-value missing input. It gives the 2026 "
            "register an official source and unlocks registration growth as a Stage 4 feature.",
            "The 2026 drive was ward-based, so growth is uneven. Do not distribute a county "
            "total across wards pro rata — that would be invented data.",
        ),
    ),
    Template(
        name="register_2026_by_county",
        purpose="The post-ECVR 2026 register at COUNTY level — the IEBC annex row for Kitui.",
        stage="Stages 1, 3",
        columns=(
            Column("county", "County name, e.g. Kitui."),
            Column("registered_voters_2026", "Total registered voters, from the IEBC annex."),
            Column("new_registrations_2026", "New voters added in the ECVR drive. Blank if the annex gives only a total."),
            Column("source_id", "The S-number of the IEBC release you take it from. The April ECVR release [S3] gives the drive figure only, not a July total."),
            Column("tier", "1. Anything that is not the IEBC's own document does not belong in this file."),
            Column("as_of", "ISO date the register was counted, e.g. 2026-07."),
            Column("document_url", "Direct URL of the PDF the figure was read from, so the next person can check it."),
        ),
        notes=(
            "This is the file that moves the July 2026 total from Tier 3 to Tier 1. 605,703 is "
            "reported for July 2026 by Venas News [S4]; no IEBC document giving it is in hand. "
            "The two 2026 figures do not conflict: 61,839 is the drive alone and 605,703 the "
            "cumulative July total.",
            "County level is what the IEBC annex actually publishes. The ward-level file is "
            "better still and unlocks more, but it is harder to obtain — fill whichever you can "
            "get, and this one first.",
            "ONLY the IEBC's own document. A figure copied from a news site or an aggregator is "
            "the same tier as what it would be replacing, so it settles nothing.",
            "Once this file has a Tier 1 row, Stage 1 confirms the July total against it, or "
            "reports the difference if the two disagree.",
        ),
    ),
    Template(
        name="results_2022_by_ward",
        purpose="2022 governor and Woman Rep results by ward, from IEBC Forms 37A/37B.",
        stage="Stages 3, 4",
        columns=(
            Column("ward", "Ward name."),
            Column("constituency", "Constituency name."),
            Column("race", "governor | woman_rep | senator"),
            Column("candidate", "Candidate name as declared."),
            Column("party", "Party as declared in 2022 (WDM, not WPF — this is a 2022 record)."),
            Column("votes", "Integer."),
            Column("registered_voters", "Ward register at that election, for turnout."),
            Column("valid_votes_cast", "Ward total valid votes, for share of ballots."),
            Column("source_id", "S-number of the form or its transcription."),
        ),
        notes=(
            "Pack gap 7. Unlocks 2022 party strength as a Stage 4 feature and lets Stage 3 "
            "draw ward turnout from evidence instead of a placeholder range.",
            "Presidential Forms 34A are public on the IEBC portal and serve as a turnout proxy "
            "by polling station if 37A/37B are slow to obtain.",
        ),
    ),
    Template(
        name="issues",
        purpose="Issue salience and candidate credibility, for the Stage 10 matrix.",
        stage="Stage 10",
        columns=(
            Column("issue_id", "Pillar id from config/assumptions.yaml."),
            Column("issue_label", "Human-readable issue name."),
            Column("indicator_value", "The hard data indicator, e.g. 21 for basic water service."),
            Column("indicator_unit", "Unit of the indicator."),
            Column("indicator_source_id", "S-number."),
            Column("indicator_tier", "1, 2 or 3."),
            Column("comment_share_pct", "% of coded comments on this theme. From Stage 7."),
            Column("credibility_score", "0-10, Mulu's credibility on this issue."),
            Column("credibility_source", "team — a team score is a judgement, and is labelled as one."),
        ),
        notes=(
            "Stage 10 fills indicator columns from the pack automatically. The credibility axis "
            "has no public record behind it: it is a team score or nothing. Firefly commissions "
            "no survey to fill it.",
            "A team score is an opinion. Stage 10 labels it as such on the chart.",
        ),
    ),
)

BOUNDARY_README = """# Ward boundary file — where it goes

Stage 5 (maps) looks for a ward boundary file at:

    analysis/data/raw/boundaries/kitui_wards.geojson

Any of .geojson, .json, .shp (with its sidecars) or .gpkg will be read. If none is
present, Stage 5 skips, logs the gap and the pipeline continues.

## What is needed

A polygon layer covering all 40 Kitui County Assembly wards, with at least:

  - a ward name property (any of: `ward`, `WARD`, `name`, `NAME`, `ADM3_EN`)
  - a constituency name property, if available
  - a valid CRS. EPSG:4326 is expected; anything else is reprojected on load.

## Where to get it

  - IEBC published boundary shapefiles for the 2022 delimitation.
  - The Kenya Open Data portal and humanitarian sources (OCHA/HDX) carry county
    assembly ward boundaries as ADM3.

## The join, and why it will need attention

Ward names do not agree across sources. The pack and the site still differ on
`Kwavonza/Yatta` vs `Kwa Vonza/Yatta`, and until September 2026 they differed on
`Mutito/Kaliku` vs `Mutitu/Kaliku` (the site now uses IEBC's `Mutito/Kaliku`). A boundary
file may carry either spelling. Stage 5 normalises spacing and punctuation, then falls back to
similarity matching, and it lists every ward that fails to match exactly rather than
quietly dropping it from the map. A ward missing from a choropleth is a lie of omission,
so unmatched wards are reported, not hidden.
"""


def _display(path) -> str:
    """Path relative to the analysis root where possible, absolute otherwise.

    Tests point DATA_TEMPLATES at a temporary directory outside the tree, and a reporting
    helper should not be the thing that raises when they do.
    """
    try:
        return str(path.relative_to(config.ANALYSIS_ROOT))
    except ValueError:
        return str(path)


def write_all() -> list[str]:
    """Write any missing or empty template, plus the README. Returns the paths written.

    Templates that already contain data are left untouched — see the guard below.
    """
    config.ensure_dirs()
    written: list[str] = []
    preserved: list[str] = []

    for tpl in TEMPLATES:
        path = config.DATA_TEMPLATES / f"{tpl.name}.csv"

        # NEVER overwrite a template that has data in it.
        #
        # write_all() runs on every `python -m src.run_all`, and it used to open each file
        # with "w", which truncates. While every template was empty that was harmless; the
        # moment the team fills one in, the next pipeline run would silently delete their
        # work. A tool that destroys the data it was built to collect is worse than no tool.
        if path.exists():
            with open(path, encoding="utf-8") as fh:
                rows = sum(1 for line in fh if line.strip())
            if rows > 1:
                preserved.append(_display(path))
                continue

        with open(path, "w", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow([c.name for c in tpl.columns])
        written.append(_display(path))

    readme = ["# CSV templates — schemas\n"]
    readme.append(
        "Empty templates for data the campaign team will supply. Headers only: no example\n"
        "rows, because a worked example is indistinguishable from real data once it is in a\n"
        "spreadsheet.\n\n"
        "Fill a file, drop it back in this folder, and re-run `python -m src.run_all`. Every\n"
        "stage reads these paths, and a stage whose input is still empty logs [DATA NEEDED]\n"
        "and continues.\n\n"
        "**Blank means unknown. Zero means measured as zero.** Never use zero for unknown:\n"
        "it silently becomes a real measurement in every rate and every mean.\n"
    )
    for tpl in TEMPLATES:
        readme.append(f"\n---\n\n## `{tpl.name}.csv`\n")
        readme.append(f"**{tpl.purpose}**  \nUsed by: {tpl.stage}\n")
        readme.append("\n| Column | Meaning |\n|---|---|")
        for col in tpl.columns:
            readme.append(f"| `{col.name}` | {col.description} |")
        if tpl.notes:
            readme.append("\n**Notes**\n")
            for note in tpl.notes:
                readme.append(f"- {note}")
        readme.append("")

    (config.DATA_TEMPLATES / "README.md").write_text("\n".join(readme), encoding="utf-8")
    written.append(_display(config.DATA_TEMPLATES / "README.md"))

    boundary_dir = config.DATA_RAW / "boundaries"
    boundary_dir.mkdir(parents=True, exist_ok=True)
    (boundary_dir / "README.md").write_text(BOUNDARY_README, encoding="utf-8")
    written.append(_display(boundary_dir / "README.md"))
    return written


def missing() -> list[str]:
    """Template names that are still empty (headers only, no rows)."""
    out: list[str] = []
    for tpl in TEMPLATES:
        path = config.DATA_TEMPLATES / f"{tpl.name}.csv"
        if not path.exists():
            out.append(tpl.name)
            continue
        with open(path, encoding="utf-8") as fh:
            rows = sum(1 for _ in fh)
        if rows <= 1:
            out.append(tpl.name)
    return out
