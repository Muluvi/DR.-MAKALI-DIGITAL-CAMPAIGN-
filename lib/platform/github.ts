/**
 * Reads, on GitHub, whether a past data-pack edit passed its checks, for the change history.
 * Server only, read-only: the site no longer makes edits (there is no sign-in), so nothing here
 * writes to the repository.
 *
 * Credentials come from Vercel environment variables, never the repository:
 *   GITHUB_REPOSITORY_SLUG   owner/name
 *   GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, GITHUB_APP_INSTALLATION_ID   (a GitHub App), or
 *   GITHUB_EDIT_TOKEN        (a fine-grained token with read access to this repository)
 */
import crypto from "node:crypto";

const API = "https://api.github.com";
const slug = () => process.env.GITHUB_REPOSITORY_SLUG!;
const BASE = () => process.env.GITHUB_EDIT_BASE || "main";

let cached: { token: string; until: number } | null = null;

async function token(): Promise<string> {
  if (process.env.GITHUB_EDIT_TOKEN) return process.env.GITHUB_EDIT_TOKEN;
  if (cached && cached.until > Date.now() + 60 * 1000) return cached.token;
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iat: now - 60, exp: now + 540, iss: process.env.GITHUB_APP_ID })}`;
  const key = (process.env.GITHUB_APP_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  const jwt = `${unsigned}.${crypto.createSign("RSA-SHA256").update(unsigned).sign(key).toString("base64url")}`;
  const res = await fetch(`${API}/app/installations/${process.env.GITHUB_APP_INSTALLATION_ID}/access_tokens`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub App token: ${res.status}`);
  const j = (await res.json()) as { token: string; expires_at: string };
  cached = { token: j.token, until: Date.parse(j.expires_at) };
  return j.token;
}

async function gh<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}/repos/${slug()}${url}`, {
    method,
    headers: { Authorization: `Bearer ${await token()}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub ${method} ${url}: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as T;
}

/** A file as it stands on main now (not as it stood when this deployment was built). */
export type EditStatus = { state: "checking" | "live" | "rejected" | "unknown"; detail?: string; url?: string };

/** Where an edit branch stands: still being checked, live on main, or refused by the checks. */
export async function editStatus(branch: string): Promise<EditStatus> {
  try {
    const cmp = await gh<{ ahead_by: number }>("GET", `/compare/${BASE()}...${encodeURIComponent(branch)}`);
    if (cmp.ahead_by === 0) return { state: "live" };
    const runs = await gh<{ check_runs: { status: string; conclusion: string | null; html_url: string }[] }>("GET", `/commits/${encodeURIComponent(branch)}/check-runs`);
    const r = runs.check_runs[0];
    if (!r || r.status !== "completed") return { state: "checking" };
    if (r.conclusion === "success") return { state: "checking", detail: "Checks passed; moving onto main." };
    return { state: "rejected", detail: "The data checks refused this edit. Nothing changed on the site.", url: r.html_url };
  } catch {
    return { state: "unknown" };
  }
}
