#!/usr/bin/env node
/**
 * Release blocker: no personal data or secret in the repository, /public, or the client bundle.
 *
 * Scans every tracked file, every file under public/, and (when a build exists) every file under
 * .next/static, for:
 *   - Kenyan mobile numbers (+2547…, 2547…, 07…, and the 01… ranges)
 *   - secrets: JWTs (Supabase keys are JWTs), private keys, Meta (WhatsApp) access tokens, GitHub
 *     and AWS tokens, and assigned values for the platform's secret variables
 *   - committed env files other than .env.example
 *   - CSVs under public/ with a name, phone, email or contact column
 *
 * The one allowance: lib/network/network.test.ts may use numbers in the reserved fixture block
 * +25470000xxxx / 070000xxxx, which no person holds in these tests.
 *
 *     node scripts/network/scan-personal-data.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const TEST = "lib/network/network.test.ts";
const FIXTURE = /^(?:\+?254|0)70000\d{4}$/;

const PHONE = /(?<![\d.])(?:\+?254|0)(?:7\d|1[01])\d{7}(?!\d)/g;
const SECRETS = [
  [/eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, "a JWT (a Supabase key or session)"],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, "a private key"],
  [/\bEAA[A-Za-z0-9]{40,}/, "a Meta access token"],
  [/\bgh[pousr]_[A-Za-z0-9]{30,}/, "a GitHub token"],
  [/\bAKIA[0-9A-Z]{16}\b/, "an AWS key"],
  [/\b(?:SUPABASE_SERVICE_ROLE_KEY|WHATSAPP_ACCESS_TOKEN|USSD_PUSH_KEY|USSD_WEBHOOK_SECRET|GITHUB_EDIT_TOKEN|GITHUB_APP_PRIVATE_KEY|PLATFORM_LOCAL_SECRET|SITE_PASSCODE)[ \t]*=[ \t]*["']?[A-Za-z0-9_\-./+]{12,}/, "an assigned secret variable"],
];
const TEXT = /\.(?:[cm]?[jt]sx?|json|md|csv|txt|ya?ml|sql|html|css|svg|env|example|toml|py)$/i;

const tracked = execSync("git ls-files -z --cached --others --exclude-standard", { cwd: ROOT }).toString().split("\0").filter(Boolean);
const walk = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])) : []);
const extra = [...walk(path.join(ROOT, "public")), ...walk(path.join(ROOT, ".next", "static"))].map((f) => path.relative(ROOT, f));
const files = [...new Set([...tracked, ...extra])].filter((f) => fs.existsSync(path.join(ROOT, f)));

const problems = [];
for (const f of files) {
  const base = path.basename(f);
  if (/^\.env/.test(base) && base !== ".env.example") problems.push(`${f}: an env file is committed`);
  if (!TEXT.test(f) || f.includes("package-lock.json")) continue;
  const text = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const m of text.matchAll(PHONE)) {
    if (f === TEST && FIXTURE.test(m[0])) continue;
    problems.push(`${f}: a mobile number (${m[0].slice(0, 6)}…)`);
  }
  for (const [re, what] of SECRETS) if (re.test(text)) problems.push(`${f}: ${what}`);
  if (f.startsWith("public/") && f.endsWith(".csv")) {
    const header = text.split("\n", 1)[0].toLowerCase();
    if (/(^|,)"?(name|full_name|phone|mobile|msisdn|email|contact)"?(,|$)/.test(header)) problems.push(`${f}: a CSV in /public with a personal-data column`);
  }
}

if (problems.length) {
  console.error(`scan-personal-data: ${problems.length} finding(s)\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`scan-personal-data: ${files.length} files scanned (tracked, public/${fs.existsSync(path.join(ROOT, ".next", "static")) ? ", .next/static" : ""}); no personal data or secrets`);
