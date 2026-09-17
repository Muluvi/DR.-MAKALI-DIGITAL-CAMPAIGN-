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


def test_analysis_is_vercelignored_but_anchored_to_the_root():
    """The pipeline must never deploy — without taking the site's data with it.

    .vercelignore uses .gitignore syntax, so a bare "analysis/" matches a directory of that
    name at ANY depth. That silently excluded data/analysis/ and public/content/analysis/
    from the upload and broke the production build with a module-not-found on the very JSON
    the site imports, while the local build passed because the files were simply on disk.
    The leading slash is load-bearing.
    """
    lines = [
        line.strip()
        for line in (config.REPO_ROOT / ".vercelignore").read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]
    assert "/analysis/" in lines, "the pipeline must be excluded from deployment"
    assert "analysis/" not in lines, (
        "an unanchored 'analysis/' also excludes data/analysis/ and "
        "public/content/analysis/, which the site needs"
    )


def test_site_facing_analysis_data_is_not_excluded_from_deployment():
    """The published figures must survive the deploy, in both locations."""
    patterns = [
        line.strip()
        for line in (config.REPO_ROOT / ".vercelignore").read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]
    for needed in ("data/analysis", "public/content/analysis"):
        assert (config.REPO_ROOT / needed).is_dir(), f"{needed} is missing"
        for pattern in patterns:
            bare = pattern.strip("/")
            # An unanchored pattern matches at any depth; an anchored one only at the root.
            if not pattern.startswith("/") and bare in needed.split("/"):
                raise AssertionError(
                    f".vercelignore pattern {pattern!r} would exclude {needed}"
                )


def test_no_tracked_files_under_analysis_data_or_outputs():
    tracked = _git("ls-files", "analysis/data", "analysis/outputs").split()
    assert not tracked, f"these must never be tracked: {tracked}"
