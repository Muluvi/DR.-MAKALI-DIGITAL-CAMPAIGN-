"""Stage 4 — ward priority index, weight sensitivity, and segments."""
from __future__ import annotations

import numpy as np
import pandas as pd
from scipy.cluster.hierarchy import fcluster, linkage
from sklearn.metrics import silhouette_score

from src import charts, config, features as featlib, report

_WORDS = "zero one two three four five six seven eight nine ten".split()


def score(normalised: pd.DataFrame, weights: dict[str, float]) -> pd.Series:
    total = pd.Series(0.0, index=normalised.index)
    for key, weight in weights.items():
        total += normalised[key] * weight
    return total


def rank_sensitivity(
    normalised: pd.DataFrame, weights: dict[str, float], n_draws: int, concentration: float
) -> pd.DataFrame:
    """Re-rank under Dirichlet-perturbed weight sets and record each ward's rank range."""
    keys = list(weights)
    rng = config.rng()
    base_alpha = np.array([weights[k] for k in keys]) * concentration
    ranks = np.zeros((n_draws, len(normalised)), dtype=int)
    matrix = normalised[keys].to_numpy()

    for i in range(n_draws):
        w = rng.dirichlet(base_alpha)
        s = matrix @ w
        # rank 1 = highest score
        ranks[i] = (-s).argsort().argsort() + 1

    return pd.DataFrame({
        "ward": normalised["ward"],
        "rank_best": ranks.min(axis=0),
        "rank_worst": ranks.max(axis=0),
        "rank_median": np.median(ranks, axis=0).astype(int),
        "rank_range": ranks.max(axis=0) - ranks.min(axis=0),
    })


def cluster(normalised: pd.DataFrame, keys: list[str]) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Hierarchical clustering, Ward linkage, on standardised features."""
    raw = normalised[keys].to_numpy(dtype=float)
    standardised = (raw - raw.mean(axis=0)) / (raw.std(axis=0, ddof=0) + 1e-12)
    link = linkage(standardised, method="ward")

    lo = int(config.value("clustering.min_segments"))
    hi = int(config.value("clustering.max_segments"))
    scores = []
    labels_by_k = {}
    for k in range(lo, hi + 1):
        labels = fcluster(link, k, criterion="maxclust")
        labels_by_k[k] = labels
        sil = silhouette_score(standardised, labels) if len(set(labels)) > 1 else float("nan")
        scores.append({"k": k, "silhouette": sil, "sizes": np.bincount(labels)[1:].tolist()})

    score_df = pd.DataFrame(scores)
    best_k = int(score_df.loc[score_df["silhouette"].idxmax(), "k"])
    out = normalised[["ward", "constituency"]].copy()
    out["segment"] = labels_by_k[best_k]
    return out, score_df


def name_segments(assigned: pd.DataFrame, raw: pd.DataFrame, keys: list[str]) -> dict[int, str]:
    """Name each segment by the feature that most distinguishes it."""
    names: dict[int, str] = {}
    merged = assigned.merge(raw, on=["ward", "constituency"])
    overall = merged[keys].mean()
    for seg, grp in merged.groupby("segment"):
        means = grp[keys].mean()
        # Which feature is furthest from the county mean, in units of its own spread?
        spread = merged[keys].std(ddof=0).replace(0, np.nan)
        z = ((means - overall) / spread).abs()
        driver = z.idxmax() if z.notna().any() else keys[0]
        direction = "high" if means[driver] > overall[driver] else "low"
        label = next(f.label for f in featlib.FEATURES if f.key == driver)
        names[seg] = f"{direction.capitalize()} {label.lower()} (n={len(grp)})"
    return names


def chart_priority(ranked: pd.DataFrame) -> str:
    charts.apply()
    head = ranked.head(20).iloc[::-1]
    fig, ax = charts.figure(7.4, 6.4)
    ys = np.arange(len(head))
    ax.barh(ys, head["priority_score"], color=charts.CATEGORICAL[0], height=0.68)
    for y, (val, voters) in enumerate(zip(head["priority_score"], head["registered_voters_2022"])):
        ax.text(val + 0.012, y, f"{val:.3f}   {voters:,} voters", va="center", fontsize=8,
                color=charts.INK)
    ax.set_yticks(ys)
    ax.set_yticklabels(head["ward"])
    ax.set_xlim(0, 1.38)
    ax.set_xlabel("Priority score (0–1)")
    ax.set_title("Ward priority index — top 20")
    ax.grid(axis="y", visible=False)
    charts.strip_spines(ax, keep=("bottom",))
    return charts.save(
        fig, "04_ward_priority.svg",
        "Modelled. While registered voters is the only feature with data, this ranking "
        "reproduces the register ranking. It is not yet a priority index in any meaningful "
        "sense — see the report's list of dropped features.",
    )


def chart_segments(assigned: pd.DataFrame, raw: pd.DataFrame, names: dict[int, str]) -> str:
    charts.apply()
    merged = assigned.merge(raw, on=["ward", "constituency"]).sort_values(
        "registered_voters_2022", ascending=False)
    fig, ax = charts.figure(8.0, 4.6)
    segs = sorted(merged["segment"].unique())
    for i, seg in enumerate(segs):
        grp = merged[merged["segment"] == seg]
        ax.barh(grp["ward"], grp["registered_voters_2022"],
                color=charts.CATEGORICAL[i % len(charts.CATEGORICAL)],
                label=f"Segment {seg}: {names[seg]}", height=0.72)
    ax.invert_yaxis()
    ax.set_xlabel("Registered voters (2022)")
    ax.set_title("Ward segments")
    ax.tick_params(axis="y", labelsize=6.5)
    ax.grid(axis="y", visible=False)
    ax.legend(loc="lower right", fontsize=8)
    ax.xaxis.set_major_formatter(lambda x, _: f"{x/1000:.0f}k")
    charts.strip_spines(ax, keep=("bottom",))
    return charts.save(
        fig, "04_ward_segments.svg",
        "Modelled. Clustering on a single available feature produces size bands, not a "
        "multi-dimensional segmentation. n = 40 wards limits confidence in any segmentation.",
    )


def run() -> dict:
    config.ensure_dirs()
    path = config.DATA_PROCESSED / "wards.csv"
    if not path.exists():
        rep = report.Report("04_wards.md", "Stage 4 — Ward priority index", "No ward data.")
        rep.p("`data/processed/wards.csv` is absent. Run Stage 1 first.")
        rep.write()
        return {"state": "skipped", "summary": "no wards.csv", "gaps": ["wards"]}

    wards = pd.read_csv(path)
    fs = featlib.assemble(wards)
    keys = [f.key for f in fs.available]

    if not keys:
        rep = report.Report("04_wards.md", "Stage 4 — Ward priority index",
                            "No feature has data.")
        rep.p("Every one of the six features is missing. No index can be built.")
        rep.gaps([f"{f.label}: {why}" for f, why in fs.dropped])
        rep.write()
        return {"state": "skipped", "summary": "no features available", "gaps": ["all features"]}

    normalised = featlib.normalise(fs.frame, fs.available)
    normalised["priority_score"] = score(normalised, fs.weights)
    ranked = (
        normalised.merge(wards[["ward", "registered_voters_2022"]], on="ward")
        .sort_values("priority_score", ascending=False).reset_index(drop=True)
    )
    ranked["rank"] = ranked.index + 1

    sens = rank_sensitivity(
        normalised, fs.weights,
        int(config.value("sensitivity.n_weight_draws")),
        float(config.value("sensitivity.dirichlet_concentration")),
    )
    unstable_threshold = int(config.value("sensitivity.unstable_rank_range"))
    sens["unstable"] = sens["rank_range"] > unstable_threshold

    assigned, sil = cluster(normalised, keys)
    names = name_segments(assigned, fs.frame, keys)
    assigned["segment_name"] = assigned["segment"].map(names)

    out = (
        ranked[["rank", "ward", "constituency", "registered_voters_2022", "priority_score"]]
        .merge(sens, on="ward")
        .merge(assigned[["ward", "segment", "segment_name"]], on="ward")
    )
    out.to_csv(config.DATA_PROCESSED / "ward_priority.csv", index=False)
    out.to_csv(config.ANALYSIS_ROOT / "outputs" / "ward_priority.csv", index=False)

    c_pri = chart_priority(ranked)
    c_seg = chart_segments(assigned, wards, names)

    # --- report -------------------------------------------------------------------------
    rep = report.Report(
        "04_wards.md", "Stage 4 — Ward priority index and segments",
        f"{_WORDS[len(fs.available)].capitalize()} of {_WORDS[len(featlib.FEATURES)]} features "
        f"{'has' if len(fs.available) == 1 else 'have'} data. This is the honest state of the index.",
    )
    rep.chart(c_pri, "Ward priority index, top 20")
    rep.chart(c_seg, "Ward segments")

    rep.h2("The headline")
    rep.p(
        f"**{len(fs.available)} of {len(featlib.FEATURES)} features have data.** With only "
        "registered voters available, the priority index reproduces the register ranking "
        "exactly. That is a faithful result, not a useful one: an index of one variable is that "
        "variable. The machinery below is built and tested so it produces a real index the day "
        "the missing inputs arrive, and the report is explicit about what is currently missing "
        "rather than presenting a register sort as a strategic ranking."
    )

    rep.h2("Features used and dropped")
    rows = [{
        "Feature": f.label, "Status": "used", "Weight (stated)": f"{fs.original_weights[f.key]:.2f}",
        "Weight (applied)": f"{fs.weights[f.key]:.2f}", "Why": f.source,
    } for f in fs.available]
    rows += [{
        "Feature": f.label, "Status": "DROPPED",
        "Weight (stated)": f"{fs.original_weights[f.key]:.2f}", "Weight (applied)": "—",
        "Why": why,
    } for f, why in fs.dropped]
    rep.table(pd.DataFrame(rows))
    rep.p(
        f"**Nothing was imputed.** The {_WORDS[len(fs.dropped)]} dropped features carry "
        f"{sum(fs.original_weights[f.key] for f, _ in fs.dropped):.0%} of the stated weight "
        "between them. That weight was not redistributed by judgement — the surviving weights "
        "were renormalised arithmetically, which with one feature means it takes the whole 1.0."
    )

    rep.h2("Weight sensitivity")
    rep.p(
        f"{int(config.value('sensitivity.n_weight_draws')):,} Dirichlet-perturbed weight sets "
        f"(concentration {config.value('sensitivity.dirichlet_concentration')}), re-ranking the "
        "wards each time."
    )
    if len(keys) == 1:
        rep.p(
            "**The test cannot run meaningfully and must not be reported as a pass.** With one "
            "feature, every weight vector is [1.0], so every draw produces an identical ranking "
            "and every ward's rank range is zero. That is degeneracy, not stability. A reader "
            "shown 'all 40 wards stable under 1,000 perturbations' would draw exactly the wrong "
            "conclusion. The test becomes informative at two or more features."
        )
    else:
        unstable = sens[sens["unstable"]]
        rep.p(
            f"{len(unstable)} of 40 wards move more than {unstable_threshold} places across the "
            "draws and are flagged unstable."
        )
        if not unstable.empty:
            rep.table(unstable[["ward", "rank_best", "rank_worst", "rank_range"]]
                      .rename(columns={"ward": "Ward", "rank_best": "Best",
                                       "rank_worst": "Worst", "rank_range": "Range"}),
                      floatfmt="{:.0f}")

    rep.h2("Segments")
    sil_display = sil.copy()
    sil_display["silhouette"] = sil_display["silhouette"].map("{:.3f}".format)
    sil_display.columns = ["k", "Silhouette", "Segment sizes"]
    rep.table(sil_display)
    best = sil.loc[sil["silhouette"].idxmax()]
    rep.p(
        f"Ward linkage on standardised features. k = {int(best['k'])} scores highest at "
        f"{best['silhouette']:.3f}."
    )
    rep.bullets([f"**Segment {seg}** — {label}" for seg, label in sorted(names.items())])
    rep.p(
        "**n = 40 limits confidence in any of this.** Forty objects is a small sample for "
        "clustering: silhouette scores are unstable at this size, boundary wards move between "
        "segments under small changes, and no segmentation here should be treated as a settled "
        "structure."
    )
    if len(keys) == 1:
        rep.p(
            "**More specifically, these are size bands.** Clustering one standardised variable "
            "cuts it into contiguous ranges, so the high silhouette reflects that a single "
            "variable separates cleanly, not that the wards fall into strategic types. Segment "
            "names describe the only feature present. Real segmentation needs the 2022 ward "
            "results and ward-level coverage data."
        )

    rep.h2("Output")
    rep.p("`ward_priority.csv` — all 40 wards with score, rank, rank range, stability flag and segment.")
    top = out.head(10)[["rank", "ward", "constituency", "registered_voters_2022",
                        "priority_score", "segment_name"]].copy()
    top["registered_voters_2022"] = top["registered_voters_2022"].map("{:,}".format)
    top.columns = ["Rank", "Ward", "Constituency", "Voters", "Score", "Segment"]
    rep.table(top, floatfmt="{:.3f}")

    rep.gaps([f"{f.label} — {why}" for f, why in fs.dropped])
    path_out = rep.write()
    return {
        "state": "ok",
        "summary": f"{len(fs.available)}/{len(featlib.FEATURES)} features; index = register ranking → {path_out}",
        "gaps": [f.label for f, _ in fs.dropped],
    }
