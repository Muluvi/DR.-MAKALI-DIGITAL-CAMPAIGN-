import { NextResponse } from "next/server";
import { liveSnapshot } from "@/lib/live/snapshot";

export const dynamic = "force-dynamic";

/** The story's live layer: records, charts, changes and who is signed in. Never cached. */
export async function GET() {
  return NextResponse.json(await liveSnapshot(), { headers: { "Cache-Control": "no-store" } });
}
