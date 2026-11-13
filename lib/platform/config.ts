/**
 * Which backend the platform runs on.
 *
 *   supabase  production: Supabase Postgres + Supabase Auth, configured by Vercel environment
 *             variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *             SUPABASE_SERVICE_ROLE_KEY). Never committed.
 *   local     development and testing only (PLATFORM_STORE=local): a JSON file under
 *             .platform-local/ and accounts from PLATFORM_LOCAL_USERS. Refused on Vercel.
 *   off       nothing configured: every public page still renders the data pack in full; the
 *             team's working records show as not yet entered, and editing is unavailable.
 */
export type Mode = "supabase" | "local" | "off";

export function platformMode(): Mode {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  if (process.env.PLATFORM_STORE === "local") {
    if (process.env.VERCEL) throw new Error("PLATFORM_STORE=local is for development only and cannot run on Vercel.");
    return "local";
  }
  return "off";
}

/**
 * Whether team sign-in and editing are switched on. Off unless PLATFORM_TEAM_LOGIN=on: the owner
 * chose to run the site fully open (view only) for now. While off there is no sign-in anywhere on
 * the site, the team pages are not served, and every edit is refused on the server.
 */
export function teamLoginEnabled(): boolean {
  return process.env.PLATFORM_TEAM_LOGIN === "on";
}

/** Emails that hold Firefly's platform-owner rights (team management), comma separated. */
export function fireflyAdminEmails(): string[] {
  return (process.env.FIREFLY_ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

/** How data-pack edits are committed. "github" in production; "local" writes the working tree. */
export function packMode(): "github" | "local" | "off" {
  if (process.env.GITHUB_REPOSITORY_SLUG && (process.env.GITHUB_APP_ID || process.env.GITHUB_EDIT_TOKEN)) return "github";
  if (platformMode() === "local") return "local";
  return "off";
}
