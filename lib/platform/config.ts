/**
 * Which backend the platform runs on.
 *
 *   supabase  production: Supabase Postgres, read-only, configured by Vercel environment
 *             variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *             SUPABASE_SERVICE_ROLE_KEY). Never committed.
 *   local     development and testing only (PLATFORM_STORE=local): a JSON file under
 *             .platform-local/. Refused on Vercel.
 *   off       nothing configured: every public page still renders the data pack in full; the
 *             team's working records show as not yet entered.
 *
 * There is no sign-in and no editing in any mode.
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

/** Where past data-pack edits were committed: "github" lets the change history read their status. */
export function packMode(): "github" | "local" | "off" {
  if (process.env.GITHUB_REPOSITORY_SLUG && (process.env.GITHUB_APP_ID || process.env.GITHUB_EDIT_TOKEN)) return "github";
  if (platformMode() === "local") return "local";
  return "off";
}
