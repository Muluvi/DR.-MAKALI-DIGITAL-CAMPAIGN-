"""Copy approved site JSON into the site's content folder.

Run only after reports/site_mapping.md is approved:

    python -m src.publish --approved

This is the one place the pipeline writes outside /analysis, and it is deliberately
separate from run_all so a pipeline run can never publish by accident.

Before copying, every file is screened (CLAUDE.md §9 / addendum):
  - it must not be on the never-publish list;
  - every value must carry the full provenance field set;
  - every T3 value must carry status "verify";
  - the text is swept for terms that signal internal material — vulnerabilities, rival
    analysis, holdout assignments, nomination leverage.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from datetime import date

from src import config, siteexport as sx

DESTINATION = config.REPO_ROOT / "public" / "content" / "analysis"

REQUIRED_FIELDS = {"value", "unit", "source_id", "tier", "as_of", "method", "status"}

# Terms that should never appear on a public URL. Matched case-insensitively against the
# whole file, including notes and labels.
FORBIDDEN_TERMS = re.compile(
    r"\bholdout\b|\bvulnerabilit|\bnomination[ _-]?leverage\b|\bopposition research\b|"
    r"\bweakness(?:es)? of\b|\bexit package\b|\bleverage[ _-]?per\b",
    re.I,
)


def screen(path) -> list[str]:
    """Return a list of reasons this file must not be published. Empty means safe."""
    problems: list[str] = []
    payload = json.loads(path.read_text(encoding="utf-8"))

    if payload["id"] in sx.NEVER_PUBLISH:
        problems.append(f"id {payload['id']!r} is on the never-publish list")

    raw = path.read_text(encoding="utf-8")
    for hit in set(FORBIDDEN_TERMS.findall(raw)):
        problems.append(f"contains internal-only term {hit!r}")

    if not payload.get("values"):
        problems.append("no values")

    for value in payload.get("values", []):
        missing = REQUIRED_FIELDS - set(value)
        if missing:
            problems.append(f"{value.get('label', '?')}: missing {sorted(missing)}")
        if value.get("tier") == 3 and value.get("status") != "verify":
            problems.append(f"{value.get('label', '?')}: T3 without verify")
        if value.get("method") not in sx.METHODS:
            problems.append(f"{value.get('label', '?')}: bad method {value.get('method')!r}")
        if value.get("status") not in sx.STATUSES:
            problems.append(f"{value.get('label', '?')}: bad status {value.get('status')!r}")
    return problems


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="src.publish", description=__doc__)
    parser.add_argument("--approved", action="store_true",
                        help="confirm reports/site_mapping.md has been approved")
    parser.add_argument("--dry-run", action="store_true", help="screen only, copy nothing")
    args = parser.parse_args(argv)

    if not args.approved and not args.dry_run:
        print("Refusing to publish. Pass --approved once reports/site_mapping.md is approved.")
        return 2

    files = sorted(config.OUT_SITE.glob("*.json"))
    if not files:
        print("No JSON in outputs/site. Run `python -m src.run_all` first.")
        return 1

    safe, blocked = [], []
    for path in files:
        problems = screen(path)
        (blocked if problems else safe).append((path, problems))

    for path, problems in blocked:
        print(f"  BLOCKED  {path.name}")
        for problem in problems:
            print(f"           - {problem}")

    if args.dry_run:
        print(f"\nDry run: {len(safe)} would publish, {len(blocked)} blocked.")
        return 1 if blocked else 0

    DESTINATION.mkdir(parents=True, exist_ok=True)
    published = []
    for path, _ in safe:
        shutil.copy2(path, DESTINATION / path.name)
        published.append(path.name)
        print(f"  published  {path.name}")

    manifest = {
        "generated": date.today().isoformat(),
        "data_as_of": config.assumptions()["meta"]["as_of"],
        "source": "analysis pipeline, python -m src.run_all",
        "approved_mapping": "analysis/reports/site_mapping.md",
        "files": published,
        "excluded": sorted(sx.NEVER_PUBLISH),
        "field_contract": sorted(REQUIRED_FIELDS),
        "rules": [
            "Every value renders its source_id, tier, as_of, method and status, not just the number.",
            "Any value with status 'verify' must show a visible unconfirmed marker.",
            "Any chart with a non-empty scenario_label must display it.",
            "A 'modelled' figure must never be styled with the authority of an 'official' one.",
        ],
    }
    (DESTINATION / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"\n{len(published)} published to {DESTINATION.relative_to(config.REPO_ROOT)}, "
          f"{len(blocked)} blocked.")
    return 1 if blocked else 0


if __name__ == "__main__":
    sys.exit(main())
