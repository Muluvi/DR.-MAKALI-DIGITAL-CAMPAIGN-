"""Stage 0 — the repo must never commit data, outputs or a root requirements.txt."""
from __future__ import annotations

import subprocess

from src import config


def _git(*args: str) -> str:
    return subprocess.run(
        ["git", *args], cwd=config.REPO_ROOT, capture_output=True, text=True, check=False
    ).stdout


def test_data_and_outputs_are_gitignored():
    """CLAUDE.md §3: nothing sensitive may sit in a folder git will commit."""
    for path in (
        "analysis/data/raw/anything.md",
        "analysis/data/processed/wards.csv",
        "analysis/outputs/site/any.json",
        "analysis/outputs/charts/any.svg",
    ):
        assert _git("check-ignore", path).strip(), f"{path} is NOT gitignored"


def test_reports_are_not_gitignored():
    """Reports are the committed deliverable, so they must stay visible to git."""
    assert not _git("check-ignore", "analysis/reports/01_data_audit.md").strip()


def test_requirements_is_inside_analysis_not_repo_root():
    """Addendum: requirements.txt must never sit at the repo root."""
    assert (config.ANALYSIS_ROOT / "requirements.txt").exists()
    assert not (config.REPO_ROOT / "requirements.txt").exists()


def test_analysis_is_vercelignored():
    """Addendum: the pipeline must never deploy with the site."""
    text = (config.REPO_ROOT / ".vercelignore").read_text(encoding="utf-8")
    assert any(line.strip() == "analysis/" for line in text.splitlines())


def test_no_tracked_files_under_analysis_data_or_outputs():
    tracked = _git("ls-files", "analysis/data", "analysis/outputs").split()
    assert not tracked, f"these must never be tracked: {tracked}"
