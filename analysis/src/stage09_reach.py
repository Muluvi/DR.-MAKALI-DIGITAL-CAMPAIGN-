"""Stage 9 — channel reach estimate by ward. Every figure here is MODELLED."""
from __future__ import annotations

import re

import numpy as np
import pandas as pd
from matplotlib.patches import Patch

from src import charts, config, report, stage15_census

SEGMENTS = [
    ("digital", "Smartphone or data", charts.CATEGORICAL[0]),
    ("sms_only", "SMS only (phone, no data)", charts.CATEGORICAL[1]),
    ("offline", "No phone — radio or in person", charts.CATEGORICAL[2]),
]


def rates() -> dict:
    """The rates in use, plus the 2019 pair they supersede."""
    return {
        "internet": config.assumption("reach.county_internet_use"),
        "phone": config.assumption("reach.county_phone_ownership"),
        "internet_2019": config.assumption("reach.county_internet_use_2019"),
        "phone_2019": config.assumption("reach.county_phone_ownership_2019"),
        "national_phone": config.assumption("reach.national_rural_phone_ownership"),
        "national_internet": config.assumption("reach.national_internet_use"),
        "smartphone_share": config.assumption("reach.smartphone_share_of_connections"),
        "register": config.assumption("reach.denominator_register"),
    }


def ward_denominators(wards: pd.DataFrame) -> pd.DataFrame:
    """Distribute the reported 2026 county register (T3, verify) across wards on 2022 shares.

    The 2026 register is known at county level only. Holding ward shares at their 2022
    values is the least-bad option: the alternative is either using a four-year-old county
    total, or inventing a per-ward growth pattern. It is labelled wherever it surfaces.
    """
    total_2026 = float(config.value("reach.denominator_register"))
    out = wards[["ward", "constituency", "registered_voters_2022"]].copy()
    share = out["registered_voters_2022"] / out["registered_voters_2022"].sum()
    out["voters"] = (share * total_2026).round().astype(int)
    # Push the rounding residue into the largest ward so the county total is exact.
    residue = int(round(total_2026)) - int(out["voters"].sum())
    out.loc[out["voters"].idxmax(), "voters"] += residue
    return out


def tokens(name: str) -> frozenset[str]:
    """A ward spelling as a set of words, so "Kwa Vonza/Yatta" and "Yatta/Kwa Vonza" agree."""
    return frozenset(re.sub(r"[^a-z]+", " ", name.lower()).split())


def ward_factors(denoms: pd.DataFrame) -> pd.DataFrame | None:
    """How far each ward's phone and internet use sits from the county's, or None to stay uniform.

    Each ward takes the 2019 census rates of the KNBS sub-county holding most of its area
    (Stage 15, data/geo/ward-keys.json), as a ratio to the county's 2019 rates. The ratios are
    then rescaled so that, weighted by ward electorates, they average exactly 1: applied to the
    county's 2023/24 rates, the county totals are unchanged and only their spread across wards
    moves. That the 2019 spread still holds is reach.ward_spread_from_2019, a placeholder.

    Returns None (uniform rates) when reach.ward_uniformity is true, the census tables are
    absent, or any ward fails to resolve to exactly one ward key: no ward is guessed.
    """
    if config.value("reach.ward_uniformity"):
        return None
    rel = stage15_census.ward_relative_ict()
    if rel is None:
        return None
    lookup: dict[frozenset[str], list[int]] = {}
    for i, r in rel.iterrows():
        for spelling in [r["name"], *r["aliases"]]:
            lookup.setdefault(tokens(spelling), []).append(i)
    rows = []
    for ward in denoms["ward"]:
        hits = set(lookup.get(tokens(str(ward)), []))
        if len(hits) != 1:
            return None
        rows.append(rel.loc[hits.pop()])
    f = pd.DataFrame(rows).reset_index(drop=True)[["subcounty", "split", "internet_rel", "phone_rel"]]
    weights = denoms["voters"].to_numpy(dtype=float)
    for col in ("internet_rel", "phone_rel"):
        f[col] = f[col] / np.average(f[col], weights=weights)
    return f


def estimate(denoms: pd.DataFrame, internet_rate, phone_rate) -> pd.DataFrame:
    """Split each ward's electorate into three mutually exclusive reach segments.

    The rates are county scalars, or per-ward arrays when ward_factors() varies them."""
    internet_rate = np.asarray(internet_rate, dtype=float)
    phone_rate = np.asarray(phone_rate, dtype=float)
    if np.any(phone_rate < internet_rate):
        raise ValueError("phone ownership cannot be below internet use — the split would go negative")
    if np.any(phone_rate > 1):
        raise ValueError("a ward's phone ownership rate exceeds 100%")
    out = denoms.copy()
    reg = out["voters"].astype(float)
    out["digital"] = (reg * internet_rate).round().astype(int)
    out["sms_only"] = (reg * (phone_rate - internet_rate)).round().astype(int)
    out["offline"] = (reg * (1.0 - phone_rate)).round().astype(int)
    diff = out["voters"] - out[["digital", "sms_only", "offline"]].sum(axis=1)
    out["offline"] = out["offline"] + diff
    return out


def chart_stack(est: pd.DataFrame, varied: bool = False) -> str:
    charts.apply()
    data = est.sort_values("voters", ascending=False)
    fig, ax = charts.figure(8.2, 7.4)
    ys = np.arange(len(data))
    left = np.zeros(len(data))
    for key, label, colour in SEGMENTS:
        vals = data[key].to_numpy(dtype=float)
        ax.barh(ys, vals, left=left, color=colour, label=label, height=0.74,
                edgecolor=charts.SURFACE, linewidth=0.8)
        left += vals
    ax.set_yticks(ys, data["ward"], fontsize=6.5)
    ax.invert_yaxis()
    ax.set_xlabel("Registered voters (July 2026 register, distributed on 2022 ward shares)")
    ax.set_title("Modelled reach by channel, all 40 wards")
    ax.legend(loc="lower right", fontsize=8)
    ax.grid(axis="y", visible=False)
    ax.xaxis.set_major_formatter(lambda x, _: f"{x/1000:.0f}k")
    charts.strip_spines(ax, keep=("bottom",))
    caption = (
        "MODELLED. County rates of 26.2% internet use and 44.1% phone ownership (CA/KNBS 2023/24), "
        "spread across wards in proportion to each ward's census sub-county in 2019 (KNBS) and "
        "rescaled so the county totals are unchanged. Ward differences are a 2019 sub-county "
        "pattern, not a ward measurement."
        if varied else
        "MODELLED. County rates applied uniformly to every ward: internet use 26.2% and phone "
        "ownership 44.1%, both CA/KNBS 2023/24. No ward-level connectivity data exists, so ward "
        "differences here come only from electorate size, not from any measured difference in "
        "connectivity."
    )
    return charts.save(fig, "09_reach_by_ward.svg", caption)


def chart_shift(old: pd.DataFrame, new: pd.DataFrame) -> str:
    """Where five years of connectivity growth actually went."""
    charts.apply()
    fig, ax = charts.figure(7.6, 3.4)
    labels = [label for _, label, _ in SEGMENTS]
    ys = np.arange(len(labels))[::-1]
    h = 0.34
    for offset, frame, alpha in ((h / 2, old, 0.5), (-h / 2, new, 1.0)):
        vals = [frame[key].sum() for key, _, _ in SEGMENTS]
        ax.barh(ys + offset, vals, height=h,
                color=[c for _, _, c in SEGMENTS], alpha=alpha,
                edgecolor=charts.SURFACE, linewidth=0.8)
        for y, v in zip(ys + offset, vals):
            ax.text(v + 6000, y, f"{v:,.0f}", va="center", fontsize=8, color=charts.INK)
    ax.set_yticks(ys, labels)
    ax.set_xlim(0, max(new[k].sum() for k, _, _ in SEGMENTS) * 1.32)
    ax.set_xlabel("Voters (both on the July 2026 register)")
    ax.set_title("Where five years of connectivity growth went")
    ax.grid(axis="y", visible=False)
    ax.xaxis.set_major_formatter(lambda x, _: f"{x/1000:.0f}k")
    # Colour carries the segment; opacity carries the year. The legend must say so without
    # implying a colour of its own, so its swatches are neutral grey.
    handles = [
        Patch(facecolor=charts.INK_MUTED, alpha=0.5, label="2019 rates (pale)"),
        Patch(facecolor=charts.INK_MUTED, alpha=1.0, label="2023/24 rates (solid)"),
    ]
    ax.legend(handles=handles, loc="upper right", fontsize=8)
    charts.strip_spines(ax, keep=("bottom",))
    return charts.save(
        fig, "09_reach_shift.svg",
        "MODELLED. Both bars use the same July 2026 register, so the only thing changing is the "
        "rate pair: 13.6%/42.9% (KNBS 2019) against 26.2%/44.1% (CA/KNBS 2023/24). Phone "
        "ownership barely moved, so the digital layer grew almost entirely at the expense of "
        "the SMS-only layer.",
    )


def run() -> dict:
    config.ensure_dirs()
    path = config.DATA_PROCESSED / "wards.csv"
    if not path.exists():
        rep = report.Report("09_reach.md", "Stage 9 — Channel reach", "No ward data.")
        rep.p("`data/processed/wards.csv` is absent. Run Stage 1 first.")
        rep.write()
        return {"state": "skipped", "summary": "no wards.csv", "gaps": ["wards"]}

    wards = pd.read_csv(path)
    r = rates()
    denoms = ward_denominators(wards)
    factors = ward_factors(denoms)
    f_net = 1.0 if factors is None else factors["internet_rel"].to_numpy()
    f_phone = 1.0 if factors is None else factors["phone_rel"].to_numpy()
    est = estimate(denoms, r["internet"].value * f_net, r["phone"].value * f_phone)
    old = estimate(denoms, r["internet_2019"].value * f_net, r["phone_2019"].value * f_phone)
    if factors is not None:
        est = est.assign(subcounty=factors["subcounty"].to_numpy(), split=factors["split"].to_numpy(),
                         internet_rate=r["internet"].value * f_net, phone_rate=r["phone"].value * f_phone)
    est.to_csv(config.DATA_PROCESSED / "ward_reach.csv", index=False)

    c_stack = chart_stack(est, varied=factors is not None)
    c_shift = chart_shift(old, est)

    total = int(est["voters"].sum())
    rep = report.Report(
        "09_reach.md", "Stage 9 — Channel reach estimate",
        "How many voters each channel can physically reach, by ward.",
    )
    rep.chart(c_shift, "Where five years of connectivity growth went")
    rep.chart(c_stack, "Modelled reach by channel, all 40 wards")

    rep.h2("The finding")
    rep.bullets([
        f"**The digital layer has roughly doubled.** {est['digital'].sum():,} voters are "
        f"reachable by smartphone or data on the 2023/24 rates, against "
        f"{old['digital'].sum():,} on the 2019 rates. The proposal's claim that digital "
        "reaches about one voter in seven is out of date: it is now closer to one in four.",
        f"**The SMS-only layer has nearly halved,** from {old['sms_only'].sum():,} to "
        f"{est['sms_only'].sum():,}. This is the finding that should change a budget.",
        "**Phone ownership barely moved — and that is the explanation.** It went from 42.9% "
        "to 44.1% in five years, up 1.2 points, while internet use went from 13.6% to 26.2%, "
        "up 12.6 points. Almost all the growth came from people who already had a phone "
        "getting online, not from new phone owners. The SMS-only group did not go offline; it "
        "moved to the digital layer.",
        f"**The offline majority is intact.** {est['offline'].sum():,} voters "
        f"({est['offline'].sum() / total:.0%}) own no phone at all and are reachable only by "
        "radio, print or in person. That is the largest single segment by a wide margin, and "
        "the proposal's central strategic argument survives this update unharmed.",
    ])

    rep.h2("What this means for the channel mix")
    rep.p(
        "The proposal weights communications 82% offline and 18% digital, and caps digital "
        "explicitly because it reaches only 13.6% of the county. That cap rests on a rate that "
        "is now superseded. On current figures the digital layer is the second-largest segment, "
        "not a rounding error, and the SMS layer it was being weighted against is the smallest "
        "of the three."
    )
    rep.p(
        "This is not an argument for a digital-first campaign. The no-phone segment is still "
        "larger than the other two combined, and radio still reaches what nothing else can. It "
        "is an argument that the **split between SMS and digital** was set against the wrong "
        "numbers, and that SMS in particular is carrying a weight its addressable audience no "
        "longer supports."
    )

    rep.h2("County totals")
    summary = pd.DataFrame([{
        "Segment": label,
        "2019 rates": f"{old[key].sum():,}",
        "2023/24 rates": f"{est[key].sum():,}",
        "Change": f"{est[key].sum() - old[key].sum():+,}",
        "Share now": f"{est[key].sum() / total:.1%}",
    } for key, label, _ in SEGMENTS])
    rep.table(summary)
    rep.p(
        f"Both columns use the same denominator — the July 2026 register (Tier 3, verify) of "
        f"{total:,} voters — so the only thing changing between them is the rate pair."
    )

    rep.h2("The rates, and where they come from")
    rate_table = pd.DataFrame([
        {"Rate": "Internet use, Kitui", "Value": f"{r['internet'].value:.1%}",
         "Year": r["internet"].as_of, "Tier": f"T{r['internet'].tier}",
         "Status": "in use — supersedes 2019"},
        {"Rate": "Phone ownership, Kitui", "Value": f"{r['phone'].value:.1%}",
         "Year": r["phone"].as_of, "Tier": f"T{r['phone'].tier}",
         "Status": "in use — supersedes 2019"},
        {"Rate": "Internet use, Kitui", "Value": f"{r['internet_2019'].value:.1%}",
         "Year": "2019", "Tier": f"T{r['internet_2019'].tier}",
         "Status": "superseded — shown for comparison"},
        {"Rate": "Phone ownership, Kitui", "Value": f"{r['phone_2019'].value:.1%}",
         "Year": "2019", "Tier": f"T{r['phone_2019'].tier}",
         "Status": "superseded — shown for comparison"},
        {"Rate": "Internet use, national", "Value": f"{r['national_internet'].value:.1%}",
         "Year": "2023/24", "Tier": f"T{r['national_internet'].tier}", "Status": "context"},
        {"Rate": "Phone ownership, national rural", "Value": f"{r['national_phone'].value:.1%}",
         "Year": "2023/24", "Tier": f"T{r['national_phone'].tier}", "Status": "context"},
        {"Rate": "Smartphone share of connections", "Value": f"{r['smartphone_share'].value:.1%}",
         "Year": "2025-26", "Tier": f"T{r['smartphone_share'].tier}",
         "Status": "context — national, not applied per ward"},
    ])
    rep.table(rate_table)
    rep.p(
        "Kitui's 26.2% sits just above the 25.0% rural mean and well below the 35.0% national "
        "rate. Its 44.1% phone ownership sits 4.5 points below the 48.6% rural mean. Neither is "
        "an outlier, which is a reason to trust them."
    )

    rep.h2("What the SMS layer can and cannot carry")
    rep.bullets([
        "**Bulk political SMS is English or Kiswahili only** under the CA/NCIC guidelines "
        "[S54]. Kikamba is not available on this layer at all.",
        "**Messages must be lodged with the operator 48 hours in advance** [S53], with verbatim "
        "text and a signed authorisation. Rapid response by SMS is therefore not possible.",
        "**Operators may refuse non-compliant messages** [S54]. The lodging window is also the "
        "rejection window.",
        "**NG-CDF and bursary beneficiary lists cannot become an SMS list** [S57]. Consented "
        "opt-in is the only lawful route, which makes list building an objective in its own "
        "right — and a harder one now that the addressable SMS-only group is "
        f"{est['sms_only'].sum():,} rather than {old['sms_only'].sum():,}.",
    ])

    rep.h2("Limits")
    if factors is None:
        rate_basis = (
            "**The rates are applied uniformly to all 40 wards.** No ward-level connectivity data "
            "exists, so ward variation here reflects electorate size only. Township and Tharaka get "
            "the same rate, which is certainly wrong — and more wrong now than before, because the "
            "urban-rural gap in the same survey is 56.6% against 25.0%."
        )
    else:
        n_split = int(factors["split"].sum())
        rate_basis = (
            "**Ward rates follow each ward's census sub-county in 2019.** Each ward takes the KNBS "
            "2019 phone and internet rates of the sub-county holding most of its area (Stage 15), "
            "relative to the county's, rescaled so county totals match the uniform model exactly. "
            f"Internet use now runs from {est['internet_rate'].min():.1%} to "
            f"{est['internet_rate'].max():.1%} by ward. That the 2019 spread still holds in "
            "2023/24 is a placeholder (reach.ward_spread_from_2019). There are 18 sub-counties for "
            f"40 wards, so wards in one sub-county share a rate, and {n_split} wards are split "
            "between sub-counties and take the larger one's."
        )
    rep.bullets([
        rate_basis,
        "**Ward electorates are the 2026 county total distributed on 2022 ward shares.** The "
        "2026 register is published at county level only. Growth was uneven, so ward figures "
        "are indicative; county figures are not affected by this.",
        "**The denominators do not match the rates.** KNBS measured persons aged 3 and above; "
        "these rates are applied to registered voters, who are all adults. Adults own phones at "
        "a higher rate than a base including young children, so the digital and SMS layers are "
        "probably understated.",
        "**The offline segment is not a radio audience estimate.** It counts voters without a "
        "phone. No Kitui radio listenership data exists, so how many of them radio actually "
        "reaches is unknown.",
    ])

    rep.h2("A contradiction on the site")
    rep.p(
        "The proposal's prose states 13.6% internet use and an 86.4% offline majority in "
        "several sections, and sizes the channel mix against them. Those figures are now "
        "superseded. This pipeline does not edit the site's prose, so the contradiction stands "
        "until someone resolves it: the data blocks show 26.2% while the surrounding text says "
        "13.6%."
    )
    rep.p(
        "The fix is not simply a find-and-replace. The 86.4% offline figure is used as the "
        "rhetorical spine of Section 3.6 and the justification for the 82/18 weighting. "
        "Updating the rate without revisiting that argument would leave the conclusion standing "
        "on a number that no longer supports it."
    )

    rep.gaps([
        "Ward-level 2G/3G/4G coverage (pack gap 20). This is now the binding gap for this "
        "stage: the county rate is confirmed, but the urban-rural spread within Kitui is not, "
        "and the same survey shows a 31-point gap nationally between urban and rural.",
        "Kikamba radio audience by sub-county (pack gap 16), without which the offline segment "
        "cannot be converted into a reachable radio audience.",
        "The 2026 register by ward, which would remove the 2022-shares distribution.",
    ])
    path_out = rep.write()
    return {
        "state": "ok",
        "summary": (f"digital {est['digital'].sum():,} / SMS {est['sms_only'].sum():,} / "
                    f"no phone {est['offline'].sum():,} on 2023/24 rates → {path_out}"),
        "gaps": ["ward-level coverage data"],
    }
