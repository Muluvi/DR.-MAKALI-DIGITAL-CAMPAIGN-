"""Shared chart style. One system across every stage.

Palette is the validated categorical order: blue, orange, aqua, yellow, magenta, green,
violet, red — assigned in fixed order, never cycled, and colour follows the entity, not
its rank, so filtering a candidate out never repaints the others.

Validated (light surface #fcfcfb, 4 slots): lightness band, chroma floor, CVD separation
(worst adjacent dE 9.1) and normal-vision floor (22.9) all pass. Contrast for aqua and
yellow sits below 3:1, which obliges visible direct labels — every chart here carries them.
"""
from __future__ import annotations

import textwrap
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

from src import config  # noqa: E402

# Fixed categorical order. Index by entity, never by position in a filtered list.
CATEGORICAL = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"]

SURFACE = "#fcfcfb"
INK = "#0b0b0b"
INK_SECONDARY = "#52514e"
INK_MUTED = "#8a8985"
GRID = "#e4e3df"

# Sequential ramp for magnitude (one hue, light to dark). Never a rainbow.
SEQUENTIAL = "Blues"
# Diverging pair with a neutral midpoint, for polarity only.
DIVERGING = "RdBu_r"

# Entity -> colour. Fixed for the whole pipeline so Mulu is the same blue everywhere.
CANDIDATE_COLOUR = {
    "Mulu": CATEGORICAL[0],
    "Kasalu": CATEGORICAL[1],
    "Wambua": CATEGORICAL[2],
    "Ngilu": CATEGORICAL[3],
}

STYLE = {
    "figure.facecolor": SURFACE,
    "axes.facecolor": SURFACE,
    "savefig.facecolor": SURFACE,
    # Generic family so the exported SVG carries "sans-serif" and renders everywhere,
    # rather than naming a font the viewer may not have.
    "font.family": "sans-serif",
    "font.sans-serif": ["DejaVu Sans"],
    "font.size": 9,
    "axes.titlesize": 11,
    "axes.titleweight": "semibold",
    "axes.titlecolor": INK,
    "axes.labelsize": 9,
    "axes.labelcolor": INK_SECONDARY,
    "axes.edgecolor": GRID,
    "axes.linewidth": 0.8,
    "axes.grid": True,
    "axes.axisbelow": True,
    "grid.color": GRID,
    "grid.linewidth": 0.6,
    "xtick.color": INK_SECONDARY,
    "ytick.color": INK_SECONDARY,
    "xtick.labelsize": 8,
    "ytick.labelsize": 8,
    "legend.frameon": False,
    "legend.fontsize": 8,
    "svg.fonttype": "none",
    "figure.autolayout": False,
}


def apply() -> None:
    plt.rcParams.update(STYLE)


def figure(width: float = 7.2, height: float = 4.2):
    apply()
    fig, ax = plt.subplots(figsize=(width, height))
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    return fig, ax


def strip_spines(ax, keep: tuple[str, ...] = ("left", "bottom")) -> None:
    for side in ("top", "right", "left", "bottom"):
        ax.spines[side].set_visible(side in keep)


def caption(fig, text: str, width: int = 118) -> None:
    """A note under the plot — sample size, source, or the scenario label.

    Placed below the axes at a negative figure coordinate. With bbox_inches="tight" the
    canvas grows to include it, so it can never collide with tick labels however deep
    they are. Long notes are wrapped rather than run off the edge.
    """
    wrapped = "\n".join(textwrap.wrap(text, width=width)) if text else ""
    fig.text(0.0, -0.02, wrapped, fontsize=7.5, color=INK_MUTED, ha="left", va="top")


def save(fig, filename: str, note: str | None = None) -> str:
    """Write an SVG to outputs/charts. Lightweight and mobile-friendly: text stays text."""
    config.ensure_dirs()
    if note:
        caption(fig, note)
    path: Path = config.OUT_CHARTS / filename
    fig.savefig(path, format="svg", bbox_inches="tight", pad_inches=0.18)
    plt.close(fig)
    return filename
