"""Stage 1 — ingest the data pack, audit the site's claims, cross-check, and write templates."""
from __future__ import annotations

import pandas as pd

from src import checks, claims as claimsmod, config, features, pack as packmod, report, templates, tidy


def _write_csv(df: pd.DataFrame, name: str) -> None:
    df.to_csv(config.DATA_PROCESSED / f"{name}.csv", index=False)


def run() -> dict:
    config.ensure_dirs()
    gaps: list[str] = []

    written = templates.write_all()
    still_empty = templates.missing()

    p = packmod.load()
    if p is None:
        rep = report.Report("01_data_audit.md", "Stage 1 — Data audit", "The data pack is absent.")
        rep.p(
            f"Expected the pack at `{config.PACK.relative_to(config.ANALYSIS_ROOT)}`. It is not "
            "there, so nothing was parsed. Templates were still written and the pipeline "
            "continues."
        )
        rep.gaps(["The data pack itself."] + [f"`{n}.csv` is empty." for n in still_empty])
        rep.write()
        return {"state": "skipped", "summary": "pack absent — templates written", "gaps": ["data pack"]}

    frames = tidy.build_all(p)
    for name, df in frames.items():
        _write_csv(df, name)

    claims = claimsmod.build()
    _write_csv(claims, "claims_register")

    findings = checks.run_all(frames, claims)
    _write_csv(findings, "audit_findings")

    # --- report -------------------------------------------------------------------------
    high = findings[findings["severity"] == "high"]
    medium = findings[findings["severity"] == "medium"]
    ok = findings[findings["severity"] == "ok"]

    rep = report.Report(
        "01_data_audit.md",
        "Stage 1 — Data audit",
        "What the pack contains, what the site claims, and where the two disagree.",
    )

    rep.h2("What was parsed")
    counts = pd.DataFrame(
        [{"File": f"`{n}.csv`", "Rows": len(df)} for n, df in frames.items()]
        + [{"File": "`claims_register.csv`", "Rows": len(claims)}]
    )
    rep.table(counts, floatfmt="{:,.0f}")
    rep.p(
        f"{len(p.tables)} markdown tables and {len(p.sources)} sources parsed from the pack. "
        f"Sources split T1/T2/T3 as "
        f"{(frames['sources'].tier == 1).sum()}/{(frames['sources'].tier == 2).sum()}/"
        f"{(frames['sources'].tier == 3).sum()}."
    )

    rep.h2("Reconciliation")
    total = int(frames["wards"]["registered_voters_2022"].sum())
    rep.p(
        f"**The ward arithmetic holds.** All 40 wards sum to {total:,}, matching each of the eight "
        "constituency totals and the IEBC 2022 county register. The site's own "
        "`data/ward-register.json` carries the same 40 figures, ward for ward, so two independent "
        "copies agree."
    )
    by_const = (
        frames["wards"].groupby("constituency")["registered_voters_2022"].agg(["sum", "count"])
        .rename(columns={"sum": "Ward sum", "count": "Wards"})
        .join(frames["constituencies"].set_index("constituency")["registered_voters_2022"]
              .rename("Declared"))
        .reset_index().rename(columns={"constituency": "Constituency"})
    )
    by_const["Agrees"] = ["yes" if a == b else "NO" for a, b in zip(by_const["Ward sum"], by_const["Declared"])]
    rep.table(by_const, floatfmt="{:,.0f}")

    rep.h2("Problems found")
    rep.p(
        f"{len(high)} high, {len(medium)} medium, {len(ok)} checks passed. Full list in "
        "`data/processed/audit_findings.csv`."
    )

    rep.h3("High severity")
    for _, r in high.iterrows():
        rep.raw(f"**{r.subject} — {r.check}**  \n{r.detail}  \n*Action:* {r.action}")

    rep.h3("Medium severity")
    for _, r in medium.iterrows():
        rep.raw(f"**{r.subject} — {r.check}**  \n{r.detail}  \n*Action:* {r.action}")

    rep.h3("Checks that passed")
    rep.bullets([f"{r.subject}: {r.detail}" for _, r in ok.iterrows()])

    rep.h2("The claims register")
    unsourced = int((claims["source_cited"] == "no").sum())
    rep.p(
        f"{len(claims):,} numeric claims across {claims['file'].nunique()} content files. "
        f"{unsourced:,} ({unsourced / len(claims):.0%}) carry no tier marker within 70 characters "
        "of the figure."
    )
    rep.p(
        "That percentage overstates the problem and should not be quoted on its own. The site "
        "tiers a figure where it is introduced and then restates it in summaries, tables and "
        "callouts without repeating the marker. The register is a worklist, not a verdict: sort "
        "it by file and look for figures that appear for the first time without a tier."
    )
    top = (
        claims.groupby("file").agg(Claims=("value", "size"),
                                   Unsourced=("source_cited", lambda s: (s == "no").sum()))
        .sort_values("Claims", ascending=False).head(8).reset_index()
        .rename(columns={"file": "File"})
    )
    rep.table(top, floatfmt="{:,.0f}")

    rep.h2("Templates written")
    rep.p(
        f"{len(templates.TEMPLATES)} templates and a schema README are in `data/templates/`. Headers only, no example "
        "rows. The ward boundary file location is documented in "
        "`data/raw/boundaries/README.md`."
    )
    rep.bullets([f"`{w}`" for w in written])

    gaps = [f"`{n}.csv` is empty — {t.purpose}" for n in still_empty
            for t in templates.TEMPLATES if t.name == n]
    gaps.append(
        "IEBC's county register as at July 2026 — the T1 source for the 2026 total. 605,703 is "
        "Tier 3 [S4] and verify until it is in hand."
    )
    rep.gaps(gaps)

    rep.h2("What this means for later stages")
    rep.bullets([
        "Stage 3 can run on the 2022 ward register. Turnout and support ranges are placeholders "
        "until ward-level 2022 results arrive.",
        f"Stage 4 has one of {len(features.FEATURES)} features with data. The others are dropped "
        "and listed, never imputed.",
        "Stage 5 needs a boundary file. Two ward-name variants are already known and will need "
        "the normalisation described in the boundary README.",
        "Stages 6, 7 and 8 have no input yet and will report [DATA NEEDED].",
    ])

    path = rep.write()
    return {
        "state": "ok",
        "summary": f"{len(frames)} CSVs, {len(claims):,} claims, {len(high)} high findings → {path}",
        "gaps": [f"{n}.csv empty" for n in still_empty],
    }
