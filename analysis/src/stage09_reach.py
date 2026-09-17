"""Stage 9 — channel reach estimate by ward. Every figure here is MODELLED."""
from __future__ import annotations

import numpy as np
import pandas as pd

from src import charts, config, report

SEGMENTS = [
    ("digital", "Smartphone or data", charts.CATEGORICAL[0]),
    ("sms_only", "SMS only (phone, no data)", charts.CATEGORICAL[1]),
    ("offline", "No phone — radio or in person", charts.CATEGORICAL[2]),
]


def rates() -> dict:
    """The rates used, each with its year and source. County first, national rural as fallback."""
    internet = config.assumption("reach.county_internet_use")
    phone = config.assumption("reach.county_phone_ownership")
    nat_phone = config.assumption("reach.national_rural_phone_ownership")
    nat_internet = config.assumption("reach.national_internet_use")
    smart = config.assumption("reach.smartphone_share_of_connections")
    return {
        "internet": internet, "phone": phone,
        "national_phone": nat_phone, "national_internet": nat_internet,
        "smartphone_share": smart,
    }


def estimate(wards: pd.DataFrame, internet_rate: float, phone_rate: float) -> pd.DataFrame:
    """Split each ward's register into three mutually exclusive reach segments.

    The three add to the ward register exactly, by construction:
      digital   = internet users
      sms_only  = phone owners who are not internet users
      offline   = everyone else
    """
    if phone_rate < internet_rate:
        raise ValueError("phone ownership cannot be below internet use — the split would go negative")
    out = wards[["ward", "constituency", "registered_voters_2022"]].copy()
    reg = out["registered_voters_2022"].astype(float)
    out["digital"] = reg * internet_rate
    out["sms_only"] = reg * (phone_rate - internet_rate)
    out["offline"] = reg * (1.0 - phone_rate)
    for col in ("digital", "sms_only", "offline"):
        out[col] = out[col].round().astype(int)
    # Rounding can shift the total by a voter or two; put the residue in the largest
    # segment rather than letting the columns fail to sum to the register.
    diff = out["registered_voters_2022"] - out[["digital", "sms_only", "offline"]].sum(axis=1)
    out["offline"] = out["offline"] + diff
    return out


def chart_stack(est: pd.DataFrame) -> str:
    charts.apply()
    data = est.sort_values("registered_voters_2022", ascending=False)
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
    ax.set_xlabel("Registered voters (2022)")
    ax.set_title("Modelled reach by channel, all 40 wards")
    ax.legend(loc="lower right", fontsize=8)
    ax.grid(axis="y", visible=False)
    ax.xaxis.set_major_formatter(lambda x, _: f"{x/1000:.0f}k")
    charts.strip_spines(ax, keep=("bottom",))
    return charts.save(
        fig, "09_reach_by_ward.svg",
        "MODELLED. County rates applied uniformly to every ward: internet use 13.6% and phone "
        "ownership 42.9%, both KNBS 2019 [S35] and seven years old. No ward-level connectivity "
        "data exists, so ward differences here come only from register size, not from any "
        "measured difference in connectivity.",
    )


def chart_county(est: pd.DataFrame, alt: pd.DataFrame) -> str:
    charts.apply()
    fig, ax = charts.figure(7.2, 3.2)
    for i, (frame, label) in enumerate(((est, "County rates (KNBS 2019)"),
                                        (alt, "National rural rates (KNBS 2023/24)"))):
        left = 0.0
        for key, seg_label, colour in SEGMENTS:
            total = frame[key].sum()
            ax.barh(i, total, left=left, color=colour, height=0.55,
                    edgecolor=charts.SURFACE, linewidth=1.0,
                    label=seg_label if i == 0 else None)
            if total > 30000:
                ax.text(left + total / 2, i, f"{total:,.0f}", ha="center", va="center",
                        fontsize=8.5, color="white", fontweight="semibold")
            left += total
        ax.text(left + 8000, i, label, va="center", fontsize=8.5, color=charts.INK)
    ax.set_yticks([0, 1], ["2019\ncounty", "2023/24\nnational rural"])
    ax.set_xlim(0, est["registered_voters_2022"].sum() * 1.42)
    ax.set_xlabel("Registered voters (2022 register)")
    ax.set_title("What choosing a different rate does to the answer")
    ax.legend(loc="lower right", fontsize=8)
    ax.grid(axis="y", visible=False)
    ax.xaxis.set_major_formatter(lambda x, _: f"{x/1000:.0f}k")
    charts.strip_spines(ax, keep=("bottom",))
    return charts.save(
        fig, "09_reach_rate_sensitivity.svg",
        "MODELLED. The county rates are seven years old; the national rural rates are current "
        "but not Kitui. The gap between the two bars is the size of the uncertainty, and it is "
        "why the KNBS 2023/24 Kitui row is the single most useful missing input for this stage.",
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
    est = estimate(wards, r["internet"].value, r["phone"].value)
    alt = estimate(wards, r["national_internet"].value, r["national_phone"].value)
    est.to_csv(config.DATA_PROCESSED / "ward_reach.csv", index=False)

    c_stack = chart_stack(est)
    c_sens = chart_county(est, alt)

    total = est["registered_voters_2022"].sum()
    rep = report.Report(
        "09_reach.md", "Stage 9 — Channel reach estimate",
        "How many voters each channel can physically reach, by ward.",
    )
    rep.chart(c_stack, "Modelled reach by channel, all 40 wards")
    rep.chart(c_sens, "The same model on two different rate sets")

    rep.h2("Every figure here is modelled")
    rep.p(
        "Nothing in this stage is a measurement. It is a published rate multiplied by a ward "
        "register. The rates and their years are shown beside every figure because their age is "
        "the main source of error."
    )
    rate_table = pd.DataFrame([
        {"Rate": "Internet use, Kitui", "Value": f"{r['internet'].value:.1%}",
         "Year": r["internet"].as_of, "Source": f"{r['internet'].source_id} (T{r['internet'].tier})",
         "Used as": "county rate — preferred"},
        {"Rate": "Phone ownership, Kitui", "Value": f"{r['phone'].value:.1%}",
         "Year": r["phone"].as_of, "Source": f"{r['phone'].source_id} (T{r['phone'].tier})",
         "Used as": "county rate — preferred"},
        {"Rate": "Internet use, national", "Value": f"{r['national_internet'].value:.1%}",
         "Year": r["national_internet"].as_of,
         "Source": f"{r['national_internet'].source_id} (T{r['national_internet'].tier})",
         "Used as": "fallback and sensitivity only"},
        {"Rate": "Phone ownership, national rural", "Value": f"{r['national_phone'].value:.1%}",
         "Year": r["national_phone"].as_of,
         "Source": f"{r['national_phone'].source_id} (T{r['national_phone'].tier})",
         "Used as": "fallback and sensitivity only"},
        {"Rate": "Smartphone share of connections", "Value": f"{r['smartphone_share'].value:.1%}",
         "Year": r["smartphone_share"].as_of,
         "Source": f"{r['smartphone_share'].source_id} (T{r['smartphone_share'].tier})",
         "Used as": "context — national, not applied per ward"},
    ])
    rep.table(rate_table)

    rep.h2("County totals")
    summary = pd.DataFrame([{
        "Segment": label,
        "Voters (county rates)": f"{est[key].sum():,}",
        "Share": f"{est[key].sum() / total:.1%}",
        "Voters (national rural rates)": f"{alt[key].sum():,}",
        "Share ": f"{alt[key].sum() / total:.1%}",
    } for key, label, _ in SEGMENTS])
    rep.table(summary)

    rep.h3("What this says")
    rep.bullets([
        f"**On county rates, {est['digital'].sum() / total:.0%} of the register is reachable by "
        f"smartphone or data** — {est['digital'].sum():,} voters. That is the ceiling on a purely "
        "digital campaign, and it sits far below the ~198,000 votes the 2022 winner took.",
        f"**{est['sms_only'].sum():,} voters own a phone but do not use the internet.** This is "
        "the SMS and USSD layer, and it is larger than the digital layer by "
        f"{est['sms_only'].sum() / est['digital'].sum():.1f}×. It is also the layer the "
        "compliance rules bite hardest on.",
        f"**{est['offline'].sum():,} voters ({est['offline'].sum() / total:.0%}) own no phone at "
        "all.** They are reachable only by radio, print, or in person. No SMS, USSD or ad budget "
        "touches them.",
        "**Changing the rate set moves the answer by more than any ward-level detail would.** "
        f"On the 2023/24 national rural rates the digital layer grows from "
        f"{est['digital'].sum():,} to {alt['digital'].sum():,}. That gap is the uncertainty.",
    ])

    rep.h2("What the SMS layer can and cannot carry")
    rep.bullets([
        "**Bulk political SMS is English or Kiswahili only** under the CA/NCIC guidelines [S54]. "
        "Kikamba is not available on this layer at all, which matters because the SMS-only "
        "segment is disproportionately rural, older and lower-income — the population most likely "
        "to prefer Kikamba.",
        "**Messages must be lodged with the operator 48 hours in advance** [S53], with verbatim "
        "text and a signed authorisation. Rapid response by SMS is therefore not possible; "
        "anything time-critical belongs on radio or WhatsApp.",
        "**Operators may refuse non-compliant messages** [S54]. The 48-hour lodging window is "
        "also the rejection window.",
        "**NG-CDF and bursary beneficiary lists cannot become an SMS list** [S57]. Consented "
        "opt-in is the only lawful route to this segment, which makes list building a campaign "
        "objective in its own right rather than an assumption.",
    ])

    rep.h2("The base rate is stale, and probably by about half")
    newer = config.assumption("reach.county_internet_use_2023_24")
    digital_now = int(est["digital"].sum())
    digital_newer = int(round(total * newer.value))
    rep.p(
        f"**The 13.6% internet-use rate above is from the 2019 census. The 2023/24 Kenya "
        f"Housing Survey puts Kitui at {newer.value:.1%}** — nearly double. On that rate the "
        f"digital layer is about {digital_newer:,} voters rather than {digital_now:,}, a "
        f"difference of {digital_newer - digital_now:,}."
    )
    rep.p(
        "**It is not used above, and the figures in this report are unchanged by it.** The "
        f"{newer.value:.1%} has not been read from the report itself — it comes from two "
        "independent media accounts of it, which agree with each other and sit sensibly inside "
        "the same survey's range of 64.7% in Nairobi to 9.1% in West Pokot, against a rural "
        "mean of 25.0%. That is good enough to act on as a warning and not good enough to "
        "publish as a measurement."
    )
    rep.p(
        "**Kitui's phone-ownership cell from the same survey is still missing, and one rate "
        "without the other is worse than neither.** The SMS-only segment is phone ownership "
        "minus internet use. Raising internet use while holding phone ownership at the 2019 "
        "figure would shrink the SMS layer by arithmetic alone, producing a fall that no one "
        "measured. Both Kitui cells are needed before any of this moves."
    )
    rep.p(
        "**What it would change if confirmed.** A digital ceiling near "
        f"{digital_newer:,} rather than {digital_now:,} weakens the proposal's central claim "
        "that digital reaches roughly one voter in seven — it would be closer to one in four. "
        "The offline majority argument survives either way, because the SMS and no-phone "
        "segments still dominate, but the budget split between digital and offline is exactly "
        "the decision this rate governs."
    )
    rep.table(pd.DataFrame([
        {"Rate": "Internet use, Kitui", "Value": "13.6%", "Year": "2019",
         "Source": "KNBS census [S35], T2", "Used here": "yes — the headline rate"},
        {"Rate": "Internet use, Kitui", "Value": f"{newer.value:.1%}", "Year": "2023/24",
         "Source": "CA/KNBS ICT report, T2", "Used here": "no — unverified, shown as a warning"},
        {"Rate": "Phone ownership, Kitui", "Value": "42.9%", "Year": "2019",
         "Source": "KNBS census [S35], T2", "Used here": "yes — the headline rate"},
        {"Rate": "Phone ownership, Kitui", "Value": "[DATA NEEDED]", "Year": "2023/24",
         "Source": "CA/KNBS ICT report", "Used here": "not obtained"},
    ]))

    rep.h2("Limits")
    rep.bullets([
        "**The rates are seven years old.** KNBS 2019 is the only Kitui-specific source in the "
        "pack. The pack itself records that coverage has since improved under USO in Mwingi "
        "North, so 13.6% almost certainly understates today.",
        "**The rates are applied uniformly to all 40 wards.** No ward-level connectivity data "
        "exists, so ward variation here reflects register size only. Township and Tharaka get the "
        "same rate, which is certainly wrong.",
        "**The denominators do not match the rates.** KNBS measured residents aged 3 and above; "
        "this model applies those rates to registered voters, who are all adults. Adults are "
        "likely to own phones at a higher rate than a base that includes young children, so the "
        "digital and SMS layers are probably understated for that reason too.",
        "**The offline segment is not a radio audience estimate.** It counts voters without a "
        "phone. No Kitui radio listenership data exists in the pack (gap 16), so how many of them "
        "radio actually reaches is unknown.",
        "**Smartphone share is a national figure** and is reported as context only, not applied "
        "per ward. Applying a national device mix to a rural county would overstate it.",
    ])

    rep.h2("By constituency")
    by_const = est.groupby("constituency")[["registered_voters_2022", "digital", "sms_only",
                                            "offline"]].sum().reset_index()
    by_const["digital %"] = (by_const["digital"] / by_const["registered_voters_2022"]).map("{:.1%}".format)
    for col in ("registered_voters_2022", "digital", "sms_only", "offline"):
        by_const[col] = by_const[col].map("{:,}".format)
    by_const.columns = ["Constituency", "Voters", "Digital", "SMS only", "No phone", "Digital %"]
    rep.table(by_const)

    rep.gaps([
        "Kitui's row in the KNBS Kenya Housing Survey 2023/24 ICT tables (pack gap 10). This is "
        "the single highest-value input for this stage: it replaces a seven-year-old rate with a "
        "current one and would materially move every figure above.",
        "Ward-level 2G/3G/4G coverage (pack gap 20), which would replace the uniform rate with "
        "real ward variation.",
        "Kikamba radio audience by sub-county (pack gap 16), without which the offline segment "
        "cannot be converted into a reachable radio audience.",
        "Kitui's two ICT cells — internet use AND mobile-phone ownership — from the CA/KNBS "
        "ICT Analytical Report on the 2023/24 Kenya Housing Survey. The internet figure is "
        "provisionally 26.2% against the 13.6% used here; the phone figure is unknown. Both "
        "are needed together, and reading them from the report would move every figure in "
        "this stage.",
    ])
    path_out = rep.write()
    return {
        "state": "ok",
        "summary": (f"digital {est['digital'].sum():,} / SMS {est['sms_only'].sum():,} / "
                    f"no phone {est['offline'].sum():,} → {path_out}"),
        "gaps": ["KNBS 2023/24 Kitui ICT row"],
    }
