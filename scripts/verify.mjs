#!/usr/bin/env node
/**
 * Every build guard, in one process.
 *
 * These were six scripts chained with `&&`. They derived the repo root three different ways,
 * five of them walked public/content separately, two parsed components/MarkdownViewer.tsx as
 * text to find the mount table, and three re-derived the heading index with their own copy of
 * the same regexes. The parsing now lives in scripts/lib/content.mjs and is memoised, so one run
 * reads each file once.
 *
 * The other thing the chain cost: `&&` stops at the first failure, so a tree with a broken mount
 * point and a bad figure reported one of them, you fixed it, and then found the other. Every
 * check runs here, and the exit code is set at the end.
 *
 * Each check is still its own file under scripts/checks/ and still runnable on its own:
 *
 *     node scripts/verify.mjs                       # all of them
 *     node scripts/checks/mounts.mjs                # just this one
 *     node scripts/checks/visual-coverage.mjs       # its ledger-table mode
 */
import * as contentIntegrity from "./checks/content-integrity.mjs";
import * as deepLinks from "./checks/deep-links.mjs";
import * as figures from "./checks/figures.mjs";
import * as mounts from "./checks/mounts.mjs";
import * as visualCoverage from "./checks/visual-coverage.mjs";
import * as wardRegister from "./checks/ward-register.mjs";
import { runAll } from "./lib/report.mjs";

// Order is the chain's original order: the data invariants first, so a figure failure is read
// against a register already known to be sound.
await runAll([wardRegister, figures, contentIntegrity, mounts, deepLinks, visualCoverage]);
