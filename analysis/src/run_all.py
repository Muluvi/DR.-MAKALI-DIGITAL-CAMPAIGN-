"""One command runs the whole pipeline:  python -m src.run_all

Stages are independent and degrade cleanly. A stage with no input data still runs, writes
its report with [DATA NEEDED], and exits zero (CLAUDE.md §7). A stage that has not been
built yet is reported as pending rather than crashing the run.

    python -m src.run_all              # every stage
    python -m src.run_all --stage 2    # one stage
    python -m src.run_all --list       # what exists and what is pending
"""
from __future__ import annotations

import argparse
import importlib
import importlib.util
import sys
import time
import traceback
from dataclasses import dataclass, field

from src import config

# Stage number -> (module name, human title). Order is the execution order.
STAGES: dict[int, tuple[str, str]] = {
    1: ("stage01_ingest", "Ingest and audit"),
    2: ("stage02_polls", "Poll uncertainty"),
    3: ("stage03_simulation", "Scenario simulation"),
    4: ("stage04_wards", "Ward priority index and segments"),
    5: ("stage05_maps", "Maps"),
    6: ("stage06_content", "Content performance"),
    7: ("stage07_comments", "Comment themes and sentiment"),
    8: ("stage08_competitors", "Competitor benchmark"),
    9: ("stage09_reach", "Channel reach estimate"),
    10: ("stage10_issues", "Issue salience matrix"),
    11: ("stage11_measurement", "Measurement design"),
    12: ("stage12_synthesis", "Synthesis and site export"),
}


@dataclass
class StageResult:
    number: int
    title: str
    state: str  # ok | skipped | pending | failed
    seconds: float = 0.0
    summary: str = ""
    gaps: list[str] = field(default_factory=list)

    @property
    def mark(self) -> str:
        return {"ok": "ok  ", "skipped": "skip", "pending": "todo", "failed": "FAIL"}[self.state]


def run_stage(number: int) -> StageResult:
    module_name, title = STAGES[number]
    started = time.perf_counter()
    try:
        module = importlib.import_module(f"src.{module_name}")
    except ModuleNotFoundError as exc:
        # Distinguish "stage not built yet" from "stage imports something missing".
        if exc.name in (f"src.{module_name}", module_name):
            return StageResult(number, title, "pending", 0.0, "not built yet")
        return StageResult(number, title, "failed", 0.0, f"import error: {exc}")

    try:
        result = module.run() or {}
    except Exception as exc:  # noqa: BLE001 - a failing stage must not kill the run
        traceback.print_exc()
        return StageResult(number, title, "failed", time.perf_counter() - started, str(exc))

    return StageResult(
        number=number,
        title=title,
        state=result.get("state", "ok"),
        seconds=time.perf_counter() - started,
        summary=result.get("summary", ""),
        gaps=list(result.get("gaps", [])),
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="src.run_all", description=__doc__)
    parser.add_argument("--stage", type=int, action="append", help="run only this stage (repeatable)")
    parser.add_argument("--list", action="store_true", help="list stages and exit")
    args = parser.parse_args(argv)

    if args.list:
        for n, (mod, title) in STAGES.items():
            built = importlib.util.find_spec(f"src.{mod}") is not None
            print(f"  {n:>2}  {'built  ' if built else 'pending'}  {title}")
        return 0

    config.ensure_dirs()
    config.seed_everything()
    wanted = sorted(set(args.stage)) if args.stage else sorted(STAGES)

    as_of = config.assumptions()["meta"]["as_of"]
    print(f"Kitui 2027 analysis pipeline — seed {config.seed()}, as of {as_of}")
    print("-" * 78)

    results: list[StageResult] = []
    for n in wanted:
        if n not in STAGES:
            print(f"  no stage {n}")
            continue
        res = run_stage(n)
        results.append(res)
        print(f"  {res.mark}  {n:>2}. {res.title:<34} {res.summary}"[:120])
        for gap in res.gaps:
            print(f"        [DATA NEEDED] {gap}")

    print("-" * 78)
    counts = {s: sum(1 for r in results if r.state == s) for s in ("ok", "skipped", "pending", "failed")}
    print(f"  {counts['ok']} ok · {counts['skipped']} skipped · {counts['pending']} pending · {counts['failed']} failed")

    all_gaps = [g for r in results for g in r.gaps]
    if all_gaps:
        print(f"  {len(all_gaps)} data gaps logged — see reports/")

    return 1 if counts["failed"] else 0


if __name__ == "__main__":
    sys.exit(main())
