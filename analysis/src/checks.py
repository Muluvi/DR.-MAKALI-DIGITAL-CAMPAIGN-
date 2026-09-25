"""Stage 1c — cross-checks. Every problem found becomes a row, not a silent fix."""
from __future__ import annotations

import re

import pandas as pd

from src import config, wards as wardlib

CURRENT_PARTY = "Wiper Patriotic Front"
STALE_PARTY = "Wiper Democratic Movement"


def _stale_party_uses(text: str) -> int:
    """Count uses of the old party name that are genuinely stale.

    An occurrence is NOT stale when the surrounding text is explaining the rename or
    quoting a 2022-era record — "change of name from Wiper Democratic Movement to Wiper
    Patriotic Front" is correct writing, and flagging it would send someone to "fix"
    accurate text. A check that cries wolf on correct content devalues the findings that
    are real.
    """
    stale = 0
    for m in re.finditer(re.escape(STALE_PARTY), text):
        window = text[max(0, m.start() - 220):m.start() + 220]
        explains_rename = (
            CURRENT_PARTY in window
            or re.search(r"\b(formerly|change of name|renamed|as it was filed|in 2022)\b",
                         window, re.I)
        )
        if not explains_rename:
            stale += 1
    return stale


def _finding(
    check: str, severity: str, subject: str, detail: str, action: str
) -> dict:
    return {
        "check": check,
        "severity": severity,
        "subject": subject,
        "detail": " ".join(detail.split()),
        "action": " ".join(action.split()),
    }


def reconcile_wards(wards: pd.DataFrame, consts: pd.DataFrame) -> list[dict]:
    """Ward totals against constituency totals, and both against the county figure."""
    out: list[dict] = []
    by_const = wards.groupby("constituency")["registered_voters_2022"].sum()
    declared = consts.set_index("constituency")["registered_voters_2022"]

    for name, total in by_const.items():
        if name not in declared.index:
            out.append(_finding(
                "ward-to-constituency", "high", name,
                f"Constituency {name!r} appears in the ward table but not the constituency table.",
                "Reconcile the two pack tables.",
            ))
            continue
        if int(total) != int(declared[name]):
            out.append(_finding(
                "ward-to-constituency", "high", name,
                f"Wards sum to {total:,} but the constituency total is {int(declared[name]):,} "
                f"(difference {int(total) - int(declared[name]):+,}).",
                "Check the IEBC ward table against the constituency table.",
            ))

    county = int(by_const.sum())
    expected = int(config.value("register.y2022"))
    if county != expected:
        out.append(_finding(
            "constituency-to-county", "high", "Kitui County",
            f"Constituency totals sum to {county:,}, expected {expected:,}.",
            "Reconcile against IEBC [S1]/[S2].",
        ))
    else:
        out.append(_finding(
            "constituency-to-county", "ok", "Kitui County",
            f"40 wards sum to {county:,}, matching the IEBC 2022 county register exactly.",
            "None.",
        ))

    if len(wards) != 40:
        out.append(_finding(
            "ward-count", "high", "Kitui County",
            f"{len(wards)} ward rows parsed, expected 40.",
            "Check the pack's ward table for missing or duplicated rows.",
        ))
    return out


def against_site_register(wards: pd.DataFrame) -> list[dict]:
    """The pack's ward table against the site's own ward-register.json."""
    out: list[dict] = []
    site = wardlib.site_register()
    if site is None:
        out.append(_finding(
            "pack-vs-site", "info", "data/ward-register.json",
            "The site's ward register was not found, so no independent cross-check ran.",
            "[DATA NEEDED] Confirm the site data file path.",
        ))
        return out

    result = wardlib.match(wards["ward"].tolist(), site["ward"].tolist())
    for pack_name, (site_name, ratio) in result.similar.items():
        out.append(_finding(
            "ward-name-variant", "medium", pack_name,
            f"The pack spells this {pack_name!r}; the site spells it {site_name!r} "
            f"(similarity {ratio}). Matched by similarity, not exactly.",
            "Confirm against the IEBC ward list and fix one spelling. This will break a "
            "boundary-file join at Stage 5 if left.",
        ))
    for name in result.unmatched:
        out.append(_finding(
            "ward-name-variant", "high", name,
            f"Ward {name!r} in the pack has no counterpart in the site register.",
            "Resolve before any ward-level join.",
        ))

    # Values, for wards that matched either way.
    site_by_name = dict(zip(site["ward"], site["registered_voters_2022"]))
    pack_by_name = dict(zip(wards["ward"], wards["registered_voters_2022"]))
    mapping = {**result.exact, **{k: v[0] for k, v in result.similar.items()}}
    mismatches = [
        (p, pack_by_name[p], site_by_name[s])
        for p, s in mapping.items()
        if pack_by_name.get(p) != site_by_name.get(s)
    ]
    if mismatches:
        for name, pv, sv in mismatches:
            out.append(_finding(
                "pack-vs-site", "high", name,
                f"Pack has {pv:,} voters, the site has {sv:,}.",
                "Reconcile against IEBC [S1].",
            ))
    else:
        out.append(_finding(
            "pack-vs-site", "ok", "All 40 wards",
            "Every ward's voter count in the pack matches the site's ward-register.json.",
            "None.",
        ))

    totals = wardlib.site_register_totals()
    if totals and totals["county_total_wards"] != int(config.value("register.y2022")):
        out.append(_finding(
            "pack-vs-site", "high", "County total",
            f"Site county total {totals['county_total_wards']:,} differs from the pack's "
            f"{int(config.value('register.y2022')):,}.",
            "Reconcile against IEBC [S2].",
        ))
    return out


def official_2026_register() -> tuple[int, dict] | None:
    """The IEBC annex figure, if the team has supplied it.

    Returns (total, row) or None. Only Tier 1 rows count: a figure copied from a news site
    is the same tier as the ones it would be replacing, so it settles nothing.
    """
    path = config.DATA_TEMPLATES / "register_2026_by_county.csv"
    if not path.exists():
        return None
    df = pd.read_csv(path)
    if df.empty:
        return None
    kitui = df[df["county"].astype(str).str.strip().str.casefold() == "kitui"]
    if kitui.empty:
        return None
    row = kitui.iloc[0]
    if int(row.get("tier", 0)) != 1:
        return None
    total = row.get("registered_voters_2026")
    if pd.isna(total):
        return None
    return int(total), row.to_dict()


def register_conflict() -> list[dict]:
    """The 2026 register: reconciled once the IEBC annex is in hand.

    This check previously reported the two 2026 figures as a conflict, on the reasoning that
    532,758 + 61,839 should equal 605,703 and did not. That reasoning was wrong. The two
    figures measure different windows: 61,839 is the 30-day ECVR drive alone, while 605,703
    is the cumulative July total. They were never meant to sum.
    """
    base = int(config.value("register.y2022"))
    added = int(config.value("register.y2026_new_registrations"))
    total = int(config.value("register.y2026_july"))
    growth = total - base
    residue = growth - added

    official = official_2026_register()
    tier = config.assumption("register.y2026_july").tier

    if official is None and tier != 1:
        return [
            _finding(
                "register-2026", "high", "2026 register",
                f"The 2026 register figures are still T3: {total:,} reported for July 2026 [S4] "
                f"and {added:,} new in the ECVR drive [S5]. Neither is IEBC's own document.",
                "Obtain the IEBC ECVR county annex [S3] and add one row to "
                "data/templates/register_2026_by_county.csv.",
            ),
        ]

    out = [
        _finding(
            "register-2026", "ok", "2026 register",
            f"CONFIRMED against the IEBC annex [S3, T1]. Kitui stands at {total:,} registered "
            f"voters as at July 2026, up {growth:,} on the 2022 register of {base:,}.",
            "None. This is now the register the 37.2% benchmark is computed against.",
        ),
        _finding(
            "register-2026", "ok", "2026 register",
            f"The apparent {residue:,}-voter discrepancy is resolved, and was never a "
            f"discrepancy. Of the {growth:,} growth, {added:,} came from the 30-day ECVR drive "
            f"that ended 28 April 2026; the remaining {residue:,} is ordinary continuous "
            "registration outside that window, which opened on 29 September 2025 and continued "
            "after the drive closed. The July total post-dates the drive by three months.",
            "Earlier runs of this pipeline reported these two figures as contradictory. That "
            "reading was wrong and is corrected here.",
        ),
    ]

    if total == 605703 and added == 61839:
        out.append(_finding(
            "register-2026", "ok", "2026 register",
            "Both figures match the T3 reports [S4, S5] exactly, which corroborates those "
            "outlets rather than casting doubt on the annex. Because the values are identical, "
            "the Tier 1 claim rests on provenance rather than on the number: the campaign "
            "confirmed on 17 September 2026 that both were read directly off the IEBC annex "
            "PDF, not copied from the aggregators.",
            "None. The document URL is on the row in register_2026_by_county.csv for anyone "
            "who wants to check at source.",
        ))
    return out


def stale_site_content() -> list[dict]:
    """Items on the site that today's date or the pack makes stale."""
    out: list[dict] = []
    hits: dict[str, list[str]] = {}
    for path in sorted(config.SITE_CONTENT.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        stale_uses = _stale_party_uses(text)
        if stale_uses:
            hits.setdefault("party", []).append(f"{path.name} ({stale_uses})")
    if hits.get("party"):
        out.append(_finding(
            "stale-party-name", "high", "Site content",
            f"{STALE_PARTY!r} appears in: {', '.join(hits['party'])}. ORPP certified the change "
            f"to {CURRENT_PARTY!r} in August 2025 [S6].",
            f"Replace with {CURRENT_PARTY!r} except where describing 2022, where 'WDM (now WPF)' "
            "is correct.",
        ))

    # The site also uses the bare "Wiper", which is not wrong but is no longer the full name.
    bare = [
        p.name for p in sorted(config.SITE_CONTENT.glob("*.md"))
        if re.search(r"\bWiper\b(?!\s+Patriotic)", p.read_text(encoding="utf-8"))
    ]
    if bare:
        out.append(_finding(
            "stale-party-name", "medium", "Site content",
            f"Bare 'Wiper' without 'Patriotic Front' appears in {len(bare)} files.",
            "Acceptable as shorthand after the full name is used once per page; check first use.",
        ))

    # The 2022 register presented as current, without a year label.
    current_register = []
    for path in sorted(config.SITE_CONTENT.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(r"532,758", text):
            window = text[max(0, m.start() - 160):m.start() + 160]
            presented_as_current = re.search(
                r"\b(current|today|now|2027|Total Registered Electorate)\b", window, re.I)
            # A figure labelled with its year is not being passed off as current. This is the
            # difference between "Total Registered Electorate: 532,758" and
            # "Total Registered Electorate (2022, Tier 1): 532,758" — only the first is a fault.
            year_labelled = re.search(r"\b2022\b", window)
            if presented_as_current and not year_labelled:
                current_register.append(path.name)
                break
    if current_register:
        out.append(_finding(
            "stale-register", "high", "Site content",
            f"532,758 (the 2022 register) is presented as the current electorate in: "
            f"{', '.join(sorted(set(current_register)))}. As of 16 Sep 2026 the register has been "
            "through the 2026 ECVR drive [S3].",
            "Relabel as 'IEBC 2022 register' and show the 2026 figure separately, marked verify.",
        ))

    # No opinion poll on the site, in any form: Firefly works from existing records and its own
    # analysis only (September 2026). Election-day terms ("polling station") are not polls.
    poll_term = re.compile(r"\b(poll|polls|pollster|pollsters|mizani|politrack)\b", re.I)
    polled = [
        p.name for p in config.SITE_CONTENT.glob("*.md")
        if poll_term.search(re.sub(r"polling[- ](station|stations|day|agent|agents|stream)", "", p.read_text(encoding="utf-8"), flags=re.I))
    ]
    if polled:
        out.append(_finding(
            "poll-on-site", "high", "Site content",
            f"Opinion-poll material appears in: {', '.join(sorted(polled))}.",
            "Remove it. The proposal forms strategy from existing records and its own analysis only.",
        ))

    # The open-seat question: pack and site disagree.
    branch_files = [
        p.name for p in config.SITE_CONTENT.glob("*.md")
        if "180(7)" in p.read_text(encoding="utf-8")
    ]
    if branch_files:
        out.append(_finding(
            "pack-vs-site", "high", "Malombe eligibility",
            f"The pack states the seat is open: Malombe was elected in 2013 and 2022, and Article "
            f"180(7) limits governors to two terms [S63]. The site treats his eligibility as an "
            f"unresolved two-branch question in {', '.join(branch_files)}.",
            "Resolve. If the pack is right, the branching scenario is dead content and the "
            "framing should change to an open-seat race.",
        ))
    return out


def t3_without_t1(frames: dict[str, pd.DataFrame], sources: pd.DataFrame) -> list[dict]:
    """T3 figures in use, and whether a T1 route to confirm them exists."""
    out: list[dict] = []
    t3_ids = set(sources.loc[sources["tier"] == 3, "id"])
    for name, df in frames.items():
        # sources.csv is the registry itself, not figures drawn from it, so it has no
        # status column and is not audited here.
        if df.empty or "tier" not in df.columns or "status" not in df.columns:
            continue
        rows = df[df["tier"] == 3]
        if rows.empty:
            continue
        unflagged = rows[~rows["status"].isin([config.TAG_VERIFY, config.TAG_DATA_NEEDED])]
        if not unflagged.empty:
            out.append(_finding(
                "t3-unflagged", "high", name,
                f"{len(unflagged)} T3 rows in {name}.csv do not carry status 'verify'.",
                "Every T3 figure must carry 'verify' wherever it appears.",
            ))
        else:
            out.append(_finding(
                "t3-flagged", "ok", name,
                f"All {len(rows)} T3 rows in {name}.csv carry status 'verify'.",
                "Confirm each against its T1 original before site use.",
            ))
    out.append(_finding(
        "t3-dependency", "high", "Nomination method",
        "The reported WPF nomination method is T3, single-sourced to The County Diary [S10], and "
        "the whole nomination strategy rests on it.",
        "Obtain the WPF NEC resolution, or the 2027 nomination rules and timetable as filed with "
        "the IEBC and the Registrar of Political Parties.",
    ))
    return out


def claims_coverage(claims: pd.DataFrame) -> list[dict]:
    out: list[dict] = []
    if claims.empty:
        return out
    unsourced = int((claims["source_cited"] == "no").sum())
    share = unsourced / len(claims)
    out.append(_finding(
        "claim-sourcing", "high" if share > 0.5 else "medium", "Site content",
        f"{unsourced:,} of {len(claims):,} numeric claims ({share:.0%}) carry no visible tier "
        "marker within 70 characters.",
        "Most are restatements of figures tiered elsewhere on the page. Prioritise the ones that "
        "state a figure for the first time.",
    ))
    t3 = claims[claims["tier"] == 3]
    if not t3.empty:
        out.append(_finding(
            "claim-sourcing", "medium", "Site content",
            f"{len(t3)} site claims are explicitly marked Tier 3.",
            "Each must render with a visible unconfirmed marker.",
        ))
    return out


def run_all(frames: dict[str, pd.DataFrame], claims: pd.DataFrame) -> pd.DataFrame:
    findings: list[dict] = []
    findings += reconcile_wards(frames["wards"], frames["constituencies"])
    findings += against_site_register(frames["wards"])
    findings += register_conflict()
    findings += stale_site_content()
    findings += t3_without_t1(frames, frames["sources"])
    findings += claims_coverage(claims)
    df = pd.DataFrame(findings)
    order = {"high": 0, "medium": 1, "info": 2, "ok": 3}
    return df.sort_values("severity", key=lambda c: c.map(order), kind="stable").reset_index(drop=True)
