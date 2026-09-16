"""Stage 2 — poll uncertainty. Margins of error, gap margins, and change tests."""
from __future__ import annotations

import numpy as np
import pandas as pd

from src import charts, config, polls as pollmath, report

MIN_POLLS_FOR_BAYESIAN_AVERAGE = 5
CAND_ORDER = ["Kasalu", "Mulu", "Wambua", "Ngilu"]


def _load() -> pd.DataFrame | None:
    path = config.DATA_PROCESSED / "polls.csv"
    if not path.exists():
        return None
    return pd.read_csv(path)


def _rounds(df: pd.DataFrame) -> list[dict]:
    """One entry per published poll round, in chronological order."""
    out = []
    for (pollster, release), grp in df.groupby(["pollster", "release_date"], sort=False):
        shares = {r.candidate: r.share_pct for r in grp.itertuples() if not pd.isna(r.share_pct)}
        n = grp["sample_size"].dropna()
        out.append({
            "pollster": pollster,
            "release": release,
            "label": f"{pollster.replace(' Africa', '')}\n{release}",
            "shares": shares,
            "n": int(n.iloc[0]) if len(n) else None,
            "undecided": grp["undecided_pct"].dropna().iloc[0] if grp["undecided_pct"].notna().any() else None,
            "tier": int(grp["tier"].iloc[0]),
            "source_id": grp["source_id"].iloc[0],
        })
    order = {"12 Mar 2026": 0, "23 Jun 2026": 1, "7 Aug 2026": 2}
    return sorted(out, key=lambda r: order.get(r["release"], 99))


def _moe_band(share: float, n: int | None) -> tuple[float, float, float]:
    """(narrow, mid, wide) margins. With a real n all three are that n."""
    if n:
        m = pollmath.share_moe(share, n)
        return m, m, m
    lo = pollmath.share_moe(share, pollmath.ILLUSTRATIVE_N[2])
    mid = pollmath.share_moe(share, pollmath.ILLUSTRATIVE_N[1])
    hi = pollmath.share_moe(share, pollmath.ILLUSTRATIVE_N[0])
    return lo, mid, hi


def chart_shares(rounds: list[dict]) -> str:
    """Small multiples — one panel per poll. Never one trend line across pollsters."""
    charts.apply()
    import matplotlib.pyplot as plt

    fig, axes = plt.subplots(1, len(rounds), figsize=(9.6, 3.9), sharex=True, sharey=True)
    # Every panel keeps all four rows in the same place, so the eye can move across polls.
    # A candidate not polled gets a stated row, not a missing one.
    ys_by_cand = {c: len(CAND_ORDER) - 1 - i for i, c in enumerate(CAND_ORDER)}
    for ax, rnd in zip(np.atleast_1d(axes), rounds):
        for cand in CAND_ORDER:
            y = ys_by_cand[cand]
            if cand not in rnd["shares"]:
                ax.text(26, y, "not polled in this round", fontsize=8,
                        color=charts.INK_MUTED, style="italic", ha="center", va="center")
                continue
            share = rnd["shares"][cand]
            lo, mid, hi = _moe_band(share, rnd["n"])
            colour = charts.CANDIDATE_COLOUR[cand]
            if rnd["n"]:
                ax.errorbar(share, y, xerr=mid, fmt="o", color=colour, markersize=7,
                            elinewidth=2, capsize=4, capthick=2, zorder=3)
            else:
                # Illustrative band: widest = n 500, narrowest = n 2,000.
                ax.plot([share - hi, share + hi], [y, y], color=colour, alpha=0.28, lw=5,
                        solid_capstyle="round", zorder=2)
                ax.plot([share - lo, share + lo], [y, y], color=colour, alpha=0.65, lw=5,
                        solid_capstyle="round", zorder=3)
                ax.plot(share, y, "o", color=colour, markersize=7, zorder=4,
                        markeredgecolor=charts.SURFACE, markeredgewidth=1.5)
            # Direct labels — obliged by the contrast rule and clearer than a lookup.
            ax.text(share, y + 0.30, f"{share:.1f}", ha="center", va="bottom",
                    fontsize=8.5, color=charts.INK, fontweight="semibold")

        ax.set_yticks(list(ys_by_cand.values()))
        ax.set_yticklabels(list(ys_by_cand))
        ax.set_ylim(-0.75, len(CAND_ORDER) - 0.25)
        n_text = f"n = {rnd['n']:,}" if rnd["n"] else "n not published"
        ax.set_title(f"{rnd['pollster'].replace(' Africa','')} · {rnd['release']}\n{n_text}",
                     fontsize=9.5)
        ax.grid(axis="y", visible=False)
        charts.strip_spines(ax, keep=("bottom",))
    fig.supxlabel("Share (%)", fontsize=9, color=charts.INK_SECONDARY, y=0.04)
    fig.suptitle("Published shares with 95% margins of error — three separate polls",
                 fontsize=11.5, fontweight="semibold", y=1.06)
    fig.tight_layout()
    return charts.save(
        fig, "02_poll_shares.svg",
        "Solid bars = 95% MoE at the published n. Shaded bands = illustrative range for "
        "n = 500 (wide) to n = 2,000 (narrow) where n is not published. Politrack [S9] and "
        "Mizani [S7, S8] use different methods and are never joined into one trend line.",
    )


def chart_gaps(rounds: list[dict]) -> str:
    charts.apply()
    fig, ax = charts.figure(7.4, 3.6)
    xs = np.arange(len(rounds))
    for x, rnd in zip(xs, rounds):
        leader = max(rnd["shares"], key=rnd["shares"].get)
        gap = rnd["shares"][leader] - rnd["shares"]["Mulu"]
        colour = charts.CATEGORICAL[0]
        if rnd["n"]:
            moe = pollmath.gap_moe(rnd["shares"][leader], rnd["shares"]["Mulu"], rnd["n"])
            ax.errorbar(x, gap, yerr=moe, fmt="o", color=colour, markersize=9,
                        elinewidth=2.2, capsize=5, capthick=2.2, zorder=3)
        else:
            wide = pollmath.gap_moe(rnd["shares"][leader], rnd["shares"]["Mulu"], 500)
            narrow = pollmath.gap_moe(rnd["shares"][leader], rnd["shares"]["Mulu"], 2000)
            ax.plot([x, x], [gap - wide, gap + wide], color=colour, alpha=0.28, lw=6,
                    solid_capstyle="round", zorder=2)
            ax.plot([x, x], [gap - narrow, gap + narrow], color=colour, alpha=0.65, lw=6,
                    solid_capstyle="round", zorder=3)
            ax.plot(x, gap, "o", color=colour, markersize=9, zorder=4,
                    markeredgecolor=charts.SURFACE, markeredgewidth=1.5)
        ax.text(x + 0.12, gap, f"{gap:.1f} pts\nbehind {leader}", fontsize=8.5,
                color=charts.INK, va="center")
    ax.set_xticks(xs)
    ax.set_xticklabels([r["label"] for r in rounds])
    ax.set_xlim(-0.5, len(rounds) - 0.15)
    ax.set_ylabel("Leader's share minus Mulu's (points)")
    ax.set_title("Gap to the leader, with 95% margins — not a trend line")
    ax.axhline(0, color=charts.INK_MUTED, lw=0.8)
    charts.strip_spines(ax)
    return charts.save(
        fig, "02_gap_to_leader.svg",
        "Gap margins use the multinomial variance of a difference within one poll. The three "
        "points are three separate measurements by two pollsters, deliberately not connected.",
    )


def chart_moe_sensitivity(rounds: list[dict]) -> str:
    """What the unknown Mizani n costs: MoE against sample size."""
    charts.apply()
    fig, ax = charts.figure(7.0, 3.6)
    ns = np.arange(300, 3001, 25)
    aug = next(r for r in rounds if r["release"] == "7 Aug 2026")
    share_curve = [pollmath.share_moe(aug["shares"]["Mulu"], n) for n in ns]
    gap_curve = [pollmath.gap_moe(aug["shares"]["Kasalu"], aug["shares"]["Mulu"], n) for n in ns]

    ax.plot(ns, share_curve, color=charts.CATEGORICAL[0], lw=2, label="Mulu's share (22.1%)")
    ax.plot(ns, gap_curve, color=charts.CATEGORICAL[1], lw=2, label="Gap to Kasalu (15.3 pts)")
    # Reference lines labelled along the bottom, clear of the legend and the curves.
    bottom = ax.get_ylim()[0]
    for n in pollmath.ILLUSTRATIVE_N:
        ax.axvline(n, color=charts.GRID, lw=1, zorder=0)
        ax.text(n, bottom, f" n={n:,}", fontsize=7.5, color=charts.INK_MUTED,
                ha="left", va="bottom", rotation=90)
    politrack_n = next(r["n"] for r in rounds if r["n"])
    ax.axvline(politrack_n, color=charts.CATEGORICAL[6], lw=1.6, ls="--", zorder=1)
    ax.text(politrack_n, bottom, f" Politrack n = {politrack_n:,}", fontsize=8,
            color=charts.CATEGORICAL[6], ha="left", va="bottom", rotation=90)
    ax.set_xlabel("Sample size")
    ax.set_ylabel("95% margin of error (points)")
    ax.set_title("What the missing sample size costs — Mizani, 7 Aug 2026")
    ax.legend(loc="upper right")
    charts.strip_spines(ax)
    return charts.save(
        fig, "02_moe_sensitivity.svg",
        "Mizani has not published n for either round. Until it does, the precision of both "
        "Mizani figures is unknown and the curve is the honest answer.",
    )


def run() -> dict:
    config.ensure_dirs()
    df = _load()
    if df is None or df.empty:
        rep = report.Report("02_polls.md", "Stage 2 — Poll uncertainty", "No poll data.")
        rep.p("`data/processed/polls.csv` is absent. Run Stage 1 first.")
        rep.gaps(["Published poll data."])
        rep.write()
        return {"state": "skipped", "summary": "no polls.csv", "gaps": ["polls"]}

    rounds = _rounds(df)
    n_polls = len(rounds)

    c_shares = chart_shares(rounds)
    c_gaps = chart_gaps(rounds)
    c_moe = chart_moe_sensitivity(rounds)

    # --- tables -------------------------------------------------------------------------
    share_rows = []
    for rnd in rounds:
        for cand, share in rnd["shares"].items():
            if rnd["n"]:
                share_rows.append({
                    "Poll": f"{rnd['pollster']} {rnd['release']}", "Candidate": cand,
                    "Share %": share, "n": f"{rnd['n']:,}",
                    "95% MoE": f"±{pollmath.share_moe(share, rnd['n']):.2f}",
                    "Basis": "published n",
                })
            else:
                for n in pollmath.ILLUSTRATIVE_N:
                    share_rows.append({
                        "Poll": f"{rnd['pollster']} {rnd['release']}", "Candidate": cand,
                        "Share %": share, "n": f"{n:,} (illustrative)",
                        "95% MoE": f"±{pollmath.share_moe(share, n):.2f}",
                        "Basis": "n NOT published",
                    })
    shares_df = pd.DataFrame(share_rows)

    gap_rows = []
    for rnd in rounds:
        leader = max(rnd["shares"], key=rnd["shares"].get)
        gap = rnd["shares"][leader] - rnd["shares"]["Mulu"]
        ns = [rnd["n"]] if rnd["n"] else list(pollmath.ILLUSTRATIVE_N)
        for n in ns:
            gap_rows.append({
                "Poll": f"{rnd['pollster']} {rnd['release']}", "Leader": leader,
                "Gap (pts)": round(gap, 1), "n": f"{n:,}" + ("" if rnd["n"] else " (illustrative)"),
                "95% MoE on gap": f"±{pollmath.gap_moe(rnd['shares'][leader], rnd['shares']['Mulu'], n):.2f}",
                "Gap clears zero?": "yes" if gap > pollmath.gap_moe(
                    rnd["shares"][leader], rnd["shares"]["Mulu"], n) else "no",
            })
    gaps_df = pd.DataFrame(gap_rows)

    jun = next(r for r in rounds if r["release"] == "23 Jun 2026")
    aug = next(r for r in rounds if r["release"] == "7 Aug 2026")
    mulu_test = pollmath.two_proportion_test(
        jun["shares"]["Mulu"], jun["n"], aug["shares"]["Mulu"], aug["n"])
    gap_test = pollmath.gap_change_test(
        jun["shares"]["Kasalu"], jun["shares"]["Mulu"], jun["n"],
        aug["shares"]["Kasalu"], aug["shares"]["Mulu"], aug["n"])

    # --- report -------------------------------------------------------------------------
    rep = report.Report(
        "02_polls.md", "Stage 2 — Poll uncertainty",
        "Three polls, two pollsters, one published sample size.",
    )

    rep.chart(c_shares, "Published shares with 95% margins of error, by poll")
    rep.chart(c_gaps, "Gap to the leader, with 95% margins")
    rep.chart(c_moe, "Margin of error against sample size, Mizani August round")

    rep.h2("The finding")
    rep.bullets([
        "**Mulu trails in all three polls, and in Politrack the gap is real.** At n = 2,927 the "
        "9.0-point March gap carries a margin of ±2.82 points, so it clears zero comfortably.",
        "**The Mizani movement cannot be tested.** Neither Mizani round published a sample size, "
        "so the June-to-August change in Mulu's share and in the gap both return "
        "**cannot determine**.",
        "**The two Mizani rounds are not like-for-like.** June excluded Ngilu; August included "
        "her at 17.0%. A candidate entering the field redistributes everyone's share, so part "
        "of any apparent movement is the changed field, not changed opinion.",
        "**The two pollsters measure differently.** Politrack reports 0.6% undecided, Mizani "
        "6.0%. A tenfold difference in undecideds points to different question wording, "
        "prompting or filtering. Their levels are not comparable.",
    ])

    rep.h2("Can the June-to-August change be called significant?")
    rep.p("No. Both tests return **cannot determine**, for the same reason: no published n.")
    tests = pd.DataFrame([
        {
            "Test": "Mulu's share, Jun → Aug",
            "Change": f"{jun['shares']['Mulu']:.1f} → {aug['shares']['Mulu']:.1f} "
                      f"({mulu_test.diff_pp:+.1f} pts)",
            "Verdict": mulu_test.verdict,
            "Would need": f"n ≥ {mulu_test.required_n:,} per round",
        },
        {
            "Test": "Gap to leader, Jun → Aug",
            "Change": f"{jun['shares']['Kasalu'] - jun['shares']['Mulu']:.1f} → "
                      f"{aug['shares']['Kasalu'] - aug['shares']['Mulu']:.1f} "
                      f"({gap_test.diff_pp:+.1f} pts)",
            "Verdict": gap_test.verdict,
            "Would need": f"n ≥ {gap_test.required_n:,} per round",
        },
    ])
    rep.table(tests)
    rep.p(
        f"The 'would need' column is the equal per-round sample at which a change of that size "
        f"would reach 95% significance. Both exceed any sample Mizani is likely to have run in a "
        f"single county, and the larger one, {mulu_test.required_n:,}, is above Politrack's "
        f"county-wide 2,927. This is context, not a result: the honest answer remains that "
        f"without n, nothing can be concluded."
    )
    rep.p(
        "**This matters for the proposal.** The site describes a 'widening' deficit and treats "
        "11.1 → 15.3 points as a trend. On the published evidence that reading is not supported: "
        "two points from one pollster, with no sample sizes and a changed candidate field between "
        "them, cannot establish a direction. The deficit is real in each round. Its movement is not "
        "measurable."
    )

    rep.h2("Margins on each share")
    rep.p(
        "Where n is published the margin is a fact. Where it is not, three illustrative panels "
        "show what the margin would be at n = 500, 1,000 and 2,000. These are not estimates of "
        "Mizani's precision — they are the range within which it is unknown."
    )
    rep.table(shares_df)

    rep.h2("Margins on the gap")
    rep.p(
        "The gap uses the multinomial variance of a difference within one poll: "
        "Var(p₁ − p₂) = [p₁ + p₂ − (p₁ − p₂)²] / n. Two candidates' shares are negatively "
        "correlated, because a respondent choosing one cannot also choose the other. That "
        "widens the gap's margin rather than narrowing it: subtracting a negative covariance "
        "adds to the variance. For Kasalu against Mulu at n = 1,000 the gap margin is ±4.69 "
        "points, against ±3.95 if the two shares were wrongly treated as independent. "
        "Independence is the optimistic assumption here, not the cautious one."
    )
    rep.table(gaps_df)

    rep.h2("Bayesian poll average")
    rep.p(
        f"**Skipped.** There are {n_polls} published polls and the threshold is "
        f"{MIN_POLLS_FOR_BAYESIAN_AVERAGE}. With three rounds from two pollsters, two of them "
        "missing sample sizes and one covering a different candidate field, a pooled average "
        "would produce a confident-looking single line out of material that cannot support one. "
        "PyMC is deliberately not installed. Revisit at five or more polls."
    )

    rep.h2("Data quality notes")
    resid = pd.DataFrame([{
        "Poll": f"{r['pollster']} {r['release']}",
        "Named shares sum": round(sum(r["shares"].values()), 1),
        "Undecided": "—" if r["undecided"] is None else f"{r['undecided']:.1f}",
        "Unaccounted": round(100 - sum(r["shares"].values()) - (r["undecided"] or 0), 1),
        "Tier": f"T{r['tier']}",
    } for r in rounds])
    rep.table(resid)
    rep.bullets([
        "June's 32.2-point unaccounted residual is mostly Ngilu's absent share plus an "
        "unpublished undecided figure. It is not a measurement of anything.",
        "All three polls reach this pipeline through T3 outlets [S7, S9] or a T2 social post "
        "[S8], not from the pollsters' own releases. Every poll figure carries status 'verify'.",
        "No pollster publishes a design effect, so every margin here is a floor on the true "
        "uncertainty, not the whole of it.",
    ])

    rep.gaps([
        "Mizani's sample sizes, method, fieldwork dates and sub-county splits (pack gap 8). "
        "This single item would make the June-to-August comparison testable.",
        "The original Politrack release, to confirm the figures and Ngilu's party label, which "
        "the write-up gives as NARC-Kenya against NARC elsewhere.",
        "Any poll of the WPF nomination electorate specifically. All three polls measure "
        "county-wide preference, which is not the same population as the nomination poll.",
    ])

    path = rep.write()
    return {
        "state": "ok",
        "summary": f"{n_polls} polls, 1 with published n; both change tests cannot determine → {path}",
        "gaps": ["Mizani sample sizes"],
    }
