import fs from "node:fs";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { network } from "@/lib/network/server";
import { platformMode } from "@/lib/platform/config";
import { serviceClient } from "@/lib/platform/store/supabase";

/**
 * A field-report photo, for someone who may read that report: its author, their ward coordinator
 * up the chain, or Command. The service decides (reports() returns only readable reports); the photo
 * is then served through a signed link that lasts one minute. 404 while NETWORK_PRIVATE is off.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { svc } = await network();
  const id = request.nextUrl.searchParams.get("report");
  const report = id ? (await svc.reports().catch(() => [])).find((r) => r.id === id) : undefined;
  if (!report?.photo_path) return NextResponse.json({ error: "Not found." }, { status: 404, headers: { "cache-control": "no-store" } });
  if (platformMode() === "supabase") {
    const { data } = await serviceClient().storage.from("network-field-photos").createSignedUrl(report.photo_path, 60);
    if (!data?.signedUrl) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.redirect(data.signedUrl, { headers: { "cache-control": "no-store" } });
  }
  const file = path.join(process.cwd(), ".platform-local", "network-photos", report.photo_path);
  if (!file.startsWith(path.join(process.cwd(), ".platform-local", "network-photos")) || !fs.existsSync(file)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const type = file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg";
  return new NextResponse(fs.readFileSync(file), { headers: { "content-type": type, "cache-control": "private, no-store" } });
}
