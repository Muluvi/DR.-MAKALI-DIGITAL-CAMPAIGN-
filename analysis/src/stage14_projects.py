"""Stage 14 — the county's itemised projects, mapped to wards (open-data brief, WP6).

Input is the county scorecard's 401 itemised projects (data/scorecard/kitui-scorecard-
projects.csv). Each row prints its place as one run of text, laid out in columns that survived
PDF extraction as runs of spaces: constituency, ward, village, status, beneficiaries, outcome.
The ward is read from the second column and resolved against data/geo/ward-keys.json.

A project lands on a ward only when that text names exactly one ward inside the constituency
the row is filed under (assumptions.yaml: projects.ward_match). Everything else keeps the level
it can carry:

    ward          one ward, in the row's own constituency
    multi_ward    several wards named; listed against each, its cost split across none
    conflict      a ward named outside the row's constituency; attributed to neither
    constituency  no ward, an ambiguous ward ("Kyangwithya"), or the constituency's own name
    county        filed under All/HQ

Two exports, both Tier 1 as a record of what the county claims:

    projects-register   one value per project: the printed cost, with the ward match
    projects-by-ward    per ward, the count and the summed cost of single-ward projects
"""
from __future__ import annotations

import json
import re
from collections import Counter
from dataclasses import dataclass, field

import pandas as pd

from src import config, report, siteexport as sx

INPUT = config.SITE_DATA / "scorecard" / "kitui-scorecard-projects.csv"
KEYS = config.SITE_DATA / "geo" / "ward-keys.json"
PLACE_COLUMN = "ward_village_status_beneficiaries_outcome (as printed)"
COUNTY_ROW = "All/HQ"

# The statuses the scorecard prints, longest first so "Incomplete" is not read as "Complete".
STATUSES = (
    "Delivered and installed",
    "Awaiting site handover",
    "Done on quarterly basis",
    "Incomplete",
    "Complete",
    "Ongoing",
    "Awarded",
)
STATUS_NOT_STATED = "Not stated"

# Separators between several wards in one cell.
MULTI = re.compile(r",|;|&|\band\b", re.I)


@dataclass(frozen=True)
class Ward:
    slug: str
    name: str
    constituency: str
    constituency_id: str
    spellings: tuple[frozenset[str], ...]
    verify_spellings: tuple[frozenset[str], ...]


@dataclass
class Match:
    level: str
    wards: list[str] = field(default_factory=list)
    reason: str = ""
    verify: bool = False


def tokens(text: str) -> frozenset[str]:
    """A spelling as a set of words: case, spacing, slashes and apostrophes do not matter."""
    text = text.lower().replace("’", "").replace("'", "")
    return frozenset(re.sub(r"[^a-z]+", " ", text).split()) - {"ward", "wards"}


def load_wards() -> list[Ward]:
    keys = json.loads(KEYS.read_text(encoding="utf-8"))
    out = []
    for w in keys["wards"]:
        plain = [tokens(w["name"])] + [tokens(a["spelling"]) for a in w["aliases"] if not a.get("verify")]
        judged = [tokens(a["spelling"]) for a in w["aliases"] if a.get("verify")]
        out.append(Ward(w["slug"], w["name"], w["constituency"], w["constituency_id"],
                        tuple(plain + judged), tuple(judged)))
    return out


def clean(text: str) -> str:
    """Strip the quote marks and trailing punctuation that PDF extraction leaves behind."""
    return text.strip().strip('"').strip().rstrip("/,;&").strip()


def resolve(text: str, wards: list[Ward]) -> tuple[list[Ward], bool]:
    """Wards this text names. Exact spellings first; then, for text cut off at a line break
    ("Kiomo/", "Yatta/ Kwa"), wards whose spelling contains every word given. Returns the
    candidates and whether the match ran through an alias marked verify."""
    t = tokens(text)
    if not t:
        return [], False
    exact = [w for w in wards if t in w.spellings]
    if exact:
        return exact, any(t in w.verify_spellings for w in exact)
    partial = [w for w in wards if any(t <= s for s in w.spellings)]
    return partial, any(any(t <= s for s in w.verify_spellings) for w in partial)


def match_row(constituency: str, place: str, wards: list[Ward]) -> Match:
    if constituency == COUNTY_ROW:
        return Match("county", reason="Filed under All/HQ.")

    columns = re.split(r"\s{2,}", place.strip())
    printed_constituency = clean(columns[0]) if columns else ""
    text = clean(columns[1]) if len(columns) > 1 else ""
    own = [w for w in wards if w.constituency == constituency]

    if MULTI.search(printed_constituency) or MULTI.search(text):
        return match_several(MULTI.split(text), wards, "Several wards named")

    hits, verify = resolve(text, own)
    if len(hits) == 1:
        return Match("ward", [hits[0].slug], f'"{text}"', verify)
    if len(hits) > 1:
        return Match("constituency", reason=f'"{text}" could be {" or ".join(w.name for w in hits)}.')

    elsewhere, verify = resolve(text, wards)
    if len(elsewhere) == 1:
        w = elsewhere[0]
        return Match("conflict", [w.slug], f'"{text}" is in {w.constituency}, but the row is filed under {constituency}.', verify)

    if "/" in text:
        several = match_several(text.split("/"), own, "Two wards joined by a slash")
        if len(several.wards) >= 2:
            return several

    if not text:
        return Match("constituency", reason="No ward printed.")
    if tokens(text) == tokens(constituency):
        return Match("constituency", reason=f'"{text}" names the constituency, not one of its wards.')
    return Match("constituency", reason=f'"{text}" is not a ward name.')


def match_several(parts: list[str], wards: list[Ward], why: str) -> Match:
    found: list[str] = []
    unresolved: list[str] = []
    verify = False
    for part in (clean(p) for p in parts):
        if not part:
            continue
        hits, v = resolve(part, wards)
        if len(hits) == 1:
            verify |= v
            if hits[0].slug not in found:
                found.append(hits[0].slug)
        else:
            unresolved.append(part)
    names = {w.slug: w.name for w in wards}
    reason = why + (f': {", ".join(names[f] for f in found)}' if found else "")
    reason += (f'; not resolved: {", ".join(f"{u!r}" for u in unresolved)}' if unresolved else "") + "."
    if not found:
        return Match("constituency", reason=reason)
    return Match("multi_ward", found, reason, verify)


def status_of(place: str) -> str:
    hits = [(m.start(), s) for s in STATUSES for m in re.finditer(rf"\b{re.escape(s)}\b", place)]
    return min(hits)[1] if hits else STATUS_NOT_STATED


def build(df: pd.DataFrame, wards: list[Ward]) -> pd.DataFrame:
    rows = []
    for _, r in df.iterrows():
        m = match_row(r["constituency"], r[PLACE_COLUMN], wards)
        rows.append({
            "id": f'{r["sector"]}-{r["no"]}',
            "sector": r["sector"],
            "no": int(r["no"]),
            "title": " ".join(str(r["project"]).split()),
            "amount": float(r["cost_ksh"]),
            "constituency": r["constituency"],
            "level": m.level,
            "wards": m.wards,
            "reason": m.reason,
            "verify": m.verify,
            "status": status_of(r[PLACE_COLUMN]),
            "page": int(r["pdf_page_clean"]),
            "as_printed": " ".join(str(r[PLACE_COLUMN]).split()),
        })
    return pd.DataFrame(rows)


def ward_totals(projects: pd.DataFrame, wards: list[Ward]) -> pd.DataFrame:
    single = projects[projects["level"] == "ward"].assign(ward=lambda d: d["wards"].str[0])
    rows = []
    for w in wards:
        mine = single[single["ward"] == w.slug]
        listed = projects[(projects["level"] == "multi_ward") & projects["wards"].apply(lambda s: w.slug in s)]
        rows.append({
            "slug": w.slug, "ward": w.name, "constituency": w.constituency,
            "constituency_id": w.constituency_id,
            "projects": len(mine), "ksh": float(mine["amount"].sum()),
            "multi_ward_listed": len(listed),
            "verify": bool(mine["verify"].any()),
        })
    return pd.DataFrame(rows)


def exports(projects: pd.DataFrame, totals: pd.DataFrame) -> list[str]:
    src = config.assumption("projects.scorecard")
    as_of = str(src.as_of)

    register_values = [
        sx.Value(
            label=p.title, value=p.amount, unit="KSh", source_id=str(src.source_id), tier=src.tier,
            as_of=as_of, method="official", status="verify" if p.verify else "confirmed",
            note=p.reason,
            dims={
                "id": p.id, "sector": p.sector, "constituency": p.constituency,
                "level": p.level, "wards": p.wards, "status": p.status, "page": p.page,
                "as_printed": p.as_printed,
            },
        )
        for p in projects.itertuples()
    ]
    register_chart = sx.Chart(
        id="projects-register",
        title="County projects, as the scorecard itemises them",
        description=("The 401 projects itemised in the county's Delivering the Kitui Promise "
                     "scorecard, each with its printed cost and the ward its printed place "
                     "resolves to. A record of what the county claims, not evidence that the "
                     "claims are true."),
        chart_type="table",
        values=register_values,
        notes=[
            "OCDS field names: value is tender.value.amount (KES); sector is items.classification. "
            "status is the scorecard's printed status, not the OCDS tenderStatus codelist.",
            "Ward match rule: assumptions.yaml projects.ward_match. A project with status "
            "'verify' was matched through an alias that needs confirming.",
        ],
    )

    by_ward = []
    for t in totals.itertuples():
        # A sum of printed costs is Firefly arithmetic on a published figure: calculated, and
        # placeholder until reconciled, as in the other exports. Verify where an alias carries it.
        status = "verify" if t.verify else "placeholder"
        dims = {"ward": t.slug, "constituency": t.constituency_id, "multi_ward_listed": t.multi_ward_listed}
        by_ward.append(sx.Value(f"{t.ward}: projects", t.projects, "count", str(src.source_id), src.tier,
                                as_of, "calculated", status, dims={**dims, "measure": "projects"}))
        by_ward.append(sx.Value(f"{t.ward}: KSh", t.ksh, "KSh", str(src.source_id), src.tier,
                                as_of, "calculated", status, dims={**dims, "measure": "ksh"}))
    for level, label in (("multi_ward", "Several wards"), ("conflict", "Ward outside its constituency"),
                         ("constituency", "Constituency level, no ward"), ("county", "County-wide or HQ")):
        rows = projects[projects["level"] == level]
        dims = {"level": level}
        by_ward.append(sx.Value(f"{label}: projects", len(rows), "count", str(src.source_id), src.tier,
                                as_of, "calculated", "placeholder", dims={**dims, "measure": "projects"}))
        by_ward.append(sx.Value(f"{label}: KSh", float(rows["amount"].sum()), "KSh", str(src.source_id),
                                src.tier, as_of, "calculated", "placeholder", dims={**dims, "measure": "ksh"}))
    ward_chart = sx.Chart(
        id="projects-by-ward",
        title="County projects by ward",
        description=("Itemised scorecard projects whose printed place resolves to one ward: count "
                     "and summed printed cost. Projects naming several wards, a ward outside "
                     "their constituency, no ward, or the whole county are totalled separately "
                     "and never spread across wards."),
        chart_type="bar",
        values=by_ward,
        notes=["Covers the 401 itemised projects only, not the county budget and not the 2,244 "
               "projects the scorecard claims."],
    )
    return [register_chart.write(), ward_chart.write()]


def run() -> dict:
    rep = report.Report("14_projects.md", "Stage 14 — County projects by ward",
                        "Where the scorecard's itemised projects land, ward by ward.")
    if not INPUT.exists() or not KEYS.exists():
        rep.p(f"`{INPUT.name}` or `{KEYS.name}` is absent.")
        rep.gaps(["The scorecard's itemised projects and the ward key table (WP1)."])
        rep.write()
        return {"state": "skipped", "summary": "no input", "gaps": ["scorecard projects"]}

    wards = load_wards()
    projects = build(pd.read_csv(INPUT, dtype=str), wards)
    totals = ward_totals(projects, wards)
    written = exports(projects, totals)

    total_ksh = projects["amount"].sum()
    levels = Counter(projects["level"])
    order = ["ward", "multi_ward", "conflict", "constituency", "county"]
    level_table = pd.DataFrame([
        {"Level": lvl, "Projects": levels.get(lvl, 0),
         "Share of projects": f"{100 * levels.get(lvl, 0) / len(projects):.1f}%",
         "KSh m": projects.loc[projects["level"] == lvl, "amount"].sum() / 1e6}
        for lvl in order
    ])
    filed = projects[projects["level"] != "county"]
    match_rate = 100 * levels.get("ward", 0) / len(filed)

    rep.h2("Match rate")
    rep.p(f"{len(projects)} projects, KSh {total_ksh / 1e6:,.1f}m in printed costs. "
          f"{levels.get('ward', 0)} land on exactly one ward: {match_rate:.1f}% of the "
          f"{len(filed)} filed under a constituency, and "
          f"{100 * projects.loc[projects['level'] == 'ward', 'amount'].sum() / filed['amount'].sum():.1f}% "
          "of their cost.")
    rep.table(level_table)

    rep.h2("Projects by ward")
    shown = totals.assign(**{"KSh m": totals["ksh"] / 1e6})[
        ["ward", "constituency", "projects", "KSh m", "multi_ward_listed", "verify"]
    ].rename(columns={"ward": "Ward", "constituency": "Constituency", "projects": "Projects",
                      "multi_ward_listed": "Also listed in multi-ward rows", "verify": "Alias to confirm"})
    rep.table(shown.sort_values(["Constituency", "Ward"]))
    rep.p("n = 40 wards. Counts are small, and a ward with no single-ward project may still be "
          "served by multi-ward or constituency-level projects.")

    rep.h2("Rows that did not land on one ward")
    rest = projects[projects["level"].isin(["multi_ward", "conflict", "constituency"])]
    rep.table(rest[["id", "constituency", "level", "reason"]].rename(
        columns={"id": "Project", "constituency": "Filed under", "level": "Level", "reason": "Why"}))

    rep.h2("Aliases to confirm")
    flagged = projects[projects["verify"]]
    rep.p(f"{len(flagged)} projects matched through an alias marked verify in "
          "data/geo/ward-keys.json (Kanziku/Simisi for Kanziko, Mutomo/Kibwea for Mutomo). "
          "They carry status 'verify' in both exports until Firefly confirms the alias.")

    rep.h2("Site mapping")
    rep.p("Approved by Firefly on 30 October 2026 (open-data steps 1–3) and published with "
          "`python -m src.publish --approved`. Stage 12's site_mapping.md covers Stage 12's "
          "exports only.")
    rep.table(pd.DataFrame([
        {"JSON file": "`projects-register.json`", "Site surface": "Tools: Service-Delivery Tracker",
         "Why": "The tracker's opening register: every itemised project, filterable by ward."},
        {"JSON file": "`projects-by-ward.json`", "Site surface": "Not yet placed",
         "Why": "Feeds the projects bubble chart (visual brief V1.2) and the ward map layer (WP8)."},
    ]))

    rep.h2("Limits")
    rep.bullets([
        "The scorecard is Tier 1 as a record of what the county claims, not evidence that the "
        "claims are true.",
        "The place text was extracted from a PDF table. Where a cell wrapped, the ward is cut "
        "off; a cut-off ward is matched only when the words left name one ward in the "
        "constituency.",
        "Ward totals cover single-ward projects only. Multi-ward, conflict, constituency and "
        "county-wide projects are totalled separately and never spread across wards.",
        "Totals reconcile to the scorecard's 401 rows and KSh "
        f"{total_ksh:,.2f} (lib/data/figures.ts scorecard.itemised.ksh).",
    ])
    rep.gaps(["Ward-level placement of the 27 county-wide or HQ projects, which the scorecard "
              "does not give."])
    path_out = rep.write()
    return {
        "state": "ok",
        "summary": (f"{levels.get('ward', 0)}/{len(filed)} constituency-filed projects on one ward "
                    f"({match_rate:.1f}%) → {', '.join(written)}, {path_out}"),
        "gaps": [],
    }
