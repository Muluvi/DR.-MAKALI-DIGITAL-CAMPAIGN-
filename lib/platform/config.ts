/**
 * Which backend the platform runs on.
 *
 *   supabase  production: Supabase Postgres, configured by Vercel environment variables
 *             (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY). Never committed.
 *   blob      production, simplest: a Vercel Blob store connected to the project
 *             (BLOB_READ_WRITE_TOKEN, set by Vercel). lib/platform/store/blob.ts.
 *   local     development and testing only (PLATFORM_STORE=local): a JSON file under
 *             .platform-local/. Refused on Vercel.
 *   off       nothing configured: every public page still renders the data pack in full; the
 *             team's working records show as not yet entered, and editing is unavailable.
 */
export type Mode = "supabase" | "blob" | "local" | "off";

export function platformMode(): Mode {
  // No sign-in: the server alone talks to the database, so the browser (anon) key is not needed.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  // A Vercel Blob store connected to the project: Vercel sets its token.
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.PLATFORM_STORE === "local") {
    if (process.env.VERCEL) throw new Error("PLATFORM_STORE=local is for development only and cannot run on Vercel.");
    return "local";
  }
  return "off";
}


/** How data-pack edits are committed. "github" in production; "local" writes the working tree. */
export function packMode(): "github" | "local" | "off" {
  if (process.env.GITHUB_REPOSITORY_SLUG && (process.env.GITHUB_APP_ID || process.env.GITHUB_EDIT_TOKEN)) return "github";
  if (platformMode() === "local") return "local";
  return "off";
}
