"""Stage 14 — county projects mapped to wards. Parsing, the no-guess rule, and sums."""
from __future__ import annotations

import pandas as pd
import pytest

from src import stage14_projects as s14

WARDS = s14.load_wards()


def place(constituency: str, ward: str, rest: str = "Village   Complete   60") -> str:
    """A place cell laid out as the scorecard prints it: columns separated by runs of spaces."""
    return f"{constituency}      {ward}      {rest}"


@pytest.mark.parametrize("ward_text, slug", [
    ("Township", "township"),
    ("Kiomo/ Kyethani", "kiomo-kyethani"),
    ('"Kiomo/', "kiomo-kyethani"),          # cut off at a line break
    ('"Yatta/ Kwa', "kwa-vonza-yatta"),     # cut off, words in the other order
    ("Zombe Mwitika", "zombe-mwitika"),     # slash lost
    ("Muumoni", "mumoni"),                  # alias in ward-keys.json
])
def test_a_ward_resolves_inside_its_constituency(ward_text, slug):
    constituency = next(w.constituency for w in WARDS if w.slug == slug)
    m = s14.match_row(constituency, place(constituency, ward_text), WARDS)
    assert (m.level, m.wards) == ("ward", [slug])


def test_an_ambiguous_ward_is_never_guessed():
    m = s14.match_row("Kitui Central", place("Kitui Central", '"Kyangwithya'), WARDS)
    assert m.level == "constituency" and m.wards == []


def test_the_constituency_name_in_the_ward_column_stays_at_constituency_level():
    m = s14.match_row("Mwingi Central", place("Mwingi Central", "Mwingi Central"), WARDS)
    assert m.level == "constituency"


def test_a_ward_in_another_constituency_is_a_conflict():
    m = s14.match_row("Kitui South", place("Kitui South", "Voo/ Kyamatu"), WARDS)
    assert (m.level, m.wards) == ("conflict", ["voo-kyamatu"])


def test_several_wards_are_listed_not_split():
    m = s14.match_row("Mwingi North", place("Mwingi North", "Kyuso and Tseikuru"), WARDS)
    assert (m.level, m.wards) == ("multi_ward", ["kyuso", "tseikuru"])


def test_county_rows_stay_county():
    assert s14.match_row("All/HQ", place("All", "All"), WARDS).level == "county"


def test_a_confirmed_alias_places_the_project_without_a_verify_flag():
    """Mutomo/Kibwea and Kanziku/Simisi were confirmed on 30 October 2026."""
    m = s14.match_row("Kitui South", place("Kitui South", "Mutomo/ Kibwea"), WARDS)
    assert (m.level, m.wards, m.verify) == ("ward", ["mutomo"], False)
    m = s14.match_row("Kitui South", place("Kitui South", "Kanziku/ Simisi"), WARDS)
    assert (m.level, m.wards, m.verify) == ("ward", ["kanziko"], False)


def test_an_alias_marked_verify_marks_the_match():
    flagged = s14.Ward("mutomo", "Mutomo", "Kitui South", "kitui-south",
                       (s14.tokens("Mutomo"), s14.tokens("Mutomo/Kibwea")), (s14.tokens("Mutomo/Kibwea"),))
    m = s14.match_row("Kitui South", place("Kitui South", "Mutomo/ Kibwea"), [flagged])
    assert (m.level, m.wards, m.verify) == ("ward", ["mutomo"], True)


@pytest.mark.parametrize("text, status", [
    ("Kitui South   Mutha   Ngaani   Complete   33,413", "Complete"),
    ("Kitui South   Ikanga/Kyatune;   Ikanga   Incomplete   250", "Incomplete"),
    ("All   All   All   1,596.5 acres ploughed", s14.STATUS_NOT_STATED),
])
def test_status_is_read_as_printed(text, status):
    assert s14.status_of(text) == status


def test_every_row_is_kept_and_the_totals_reconcile():
    """Every project appears once, and ward and bucket totals add back to the scorecard."""
    df = pd.read_csv(s14.INPUT, dtype=str)
    projects = s14.build(df, WARDS)
    assert len(projects) == len(df) == 401
    assert projects["amount"].sum() == pytest.approx(df["cost_ksh"].astype(float).sum())

    totals = s14.ward_totals(projects, WARDS)
    assert len(totals) == 40
    on_wards = projects[projects["level"] == "ward"]
    assert totals["projects"].sum() == len(on_wards)
    assert totals["ksh"].sum() == pytest.approx(on_wards["amount"].sum())

    # Projects filed under a constituency keep that constituency, so the constituency totals
    # the site already publishes (lib/data/figures.ts SCORECARD_SPEND) still hold.
    by_constituency = projects.groupby("constituency")["amount"].sum().div(1e6).round(1)
    assert by_constituency["Kitui Central"] == 254.9
    assert by_constituency["Mwingi West"] == 50.5
    assert by_constituency[s14.COUNTY_ROW] == 160.9


def test_a_ward_match_never_crosses_its_constituency():
    projects = s14.build(pd.read_csv(s14.INPUT, dtype=str), WARDS)
    home = {w.slug: w.constituency for w in WARDS}
    for p in projects[projects["level"] == "ward"].itertuples():
        assert home[p.wards[0]] == p.constituency, p.id
