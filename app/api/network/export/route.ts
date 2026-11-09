import { NextResponse, type NextRequest } from "next/server";
import { network } from "@/lib/network/server";
import { NotAllowed } from "@/lib/network/policy";

/**
 * Exports, Command only, every one logged (lib/network/service.ts exportCsv). Generated on request
 * and streamed: never written to disk, /public or a cache. 404 while NETWORK_PRIVATE is off.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { svc } = await network();
  const kind = request.nextUrl.searchParams.get("kind");
  if (kind !== "people" && kind !== "reports" && kind !== "coverage") return NextResponse.json({ error: "Unknown export." }, { status: 400 });
  try {
    const out = await svc.exportCsv(kind);
    return new NextResponse(out.body, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${out.filename}"`,
        "cache-control": "private, no-store",
      },
    });
  } catch (e) {
    if (e instanceof NotAllowed) return NextResponse.json({ error: "Only Campaign Command can export." }, { status: 403, headers: { "cache-control": "no-store" } });
    return NextResponse.json({ error: "The export failed." }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
