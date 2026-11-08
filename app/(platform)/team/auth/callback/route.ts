import { NextResponse, type NextRequest } from "next/server";
import { supabaseUserClient } from "@/lib/platform/auth";
import { platformMode, teamLoginEnabled } from "@/lib/platform/config";

/** Where a sign-in or invitation link lands: exchange the code for a session, then go to work. */
export async function GET(request: NextRequest) {
  if (!teamLoginEnabled()) return NextResponse.redirect(new URL("/workspace", request.url));
  const code = request.nextUrl.searchParams.get("code");
  if (code && platformMode() === "supabase") await (await supabaseUserClient()).auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL("/workspace", request.url));
}
