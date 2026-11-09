import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { networkDb, networkPrivateEnabled } from "@/lib/network/server";
import { networkService, resolveActor } from "@/lib/network/service";
import { channelsFromEnv } from "@/lib/network/channels";
import { ussdReply } from "@/lib/network/ussd";

/**
 * The USSD gateway's callback (Firefly's shortcode). The gateway posts sessionId, phoneNumber and
 * text; the caller is identified by the number the mobile network reports, matched to a registered
 * campaigner. The callback URL carries a shared secret (USSD_WEBHOOK_SECRET), so only the gateway can
 * reach it. 404 while NETWORK_PRIVATE is off or the secret is unset. Nothing about the caller is
 * logged.
 */
export const dynamic = "force-dynamic";

const plain = (body: string, status = 200) => new NextResponse(body, { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });

export async function POST(request: NextRequest) {
  const secret = process.env.USSD_WEBHOOK_SECRET;
  const db = networkDb();
  if (!networkPrivateEnabled() || !db || !secret) return plain("Not found", 404);
  const given = request.nextUrl.searchParams.get("key") ?? "";
  if (given.length !== secret.length || !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret))) return plain("Not found", 404);
  const form = await request.formData();
  const phone = String(form.get("phoneNumber") ?? "");
  const text = String(form.get("text") ?? "");
  const actor = await resolveActor(db, { phone });
  return plain(await ussdReply(networkService({ db, channels: channelsFromEnv() }, actor), text));
}
