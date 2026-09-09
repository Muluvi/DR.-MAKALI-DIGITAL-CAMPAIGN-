/**
 * One reporting shape for every build guard.
 *
 * A check returns `pass(summary)`, `fail(headline, errors, hint)` or `skip(reason)` instead of
 * writing to the console and calling process.exit itself. That is what lets all six run in one
 * process: a failure no longer takes the process down before the checks after it have run, so
 * one command reports everything wrong with the tree rather than the first thing.
 */

export const pass = (summary) => ({ status: "pass", summary });
export const fail = (summary, errors = [], hint = "") => ({ status: "fail", summary, errors, hint });
export const skip = (summary) => ({ status: "skip", summary });

const MARK = { pass: "✓", fail: "✗", skip: "–" };
const MAX_ERRORS = 25;

/** Run the checks in order, print each as it finishes, and exit non-zero if any failed. */
export async function runAll(checks) {
  const results = [];
  for (const check of checks) {
    let result;
    try {
      result = await check.run();
    } catch (err) {
      result = fail(`${check.name} could not run: ${err.message}`);
    }
    results.push({ check, result });
    report(check, result);
  }

  const failed = results.filter((r) => r.result.status === "fail");
  if (failed.length) {
    console.error(`\n${failed.length} of ${checks.length} checks failed: ${failed.map((f) => f.check.name).join(", ")}\n`);
    process.exitCode = 1;
    return;
  }
  console.log(`\nAll ${checks.length} checks passed.`);
}

function report(check, result) {
  const lines = result.summary.split("\n");
  console[result.status === "fail" ? "error" : "log"](`${MARK[result.status]} ${check.name}: ${lines[0]}`);
  for (const line of lines.slice(1)) console.log(`  ${line}`);
  if (result.status !== "fail") return;

  for (const e of (result.errors ?? []).slice(0, MAX_ERRORS)) console.error(`    - ${e}`);
  if ((result.errors ?? []).length > MAX_ERRORS) {
    console.error(`    ... and ${result.errors.length - MAX_ERRORS} more.`);
  }
  if (result.hint) for (const line of result.hint.split("\n")) console.error(`    ${line}`);
}

/** Let a check file stay runnable on its own: `node scripts/checks/mounts.mjs`. */
export async function runIfMain(url, check) {
  const invoked = process.argv[1] && url === new URL(`file://${process.argv[1]}`).href;
  if (invoked) await runAll([check]);
}
