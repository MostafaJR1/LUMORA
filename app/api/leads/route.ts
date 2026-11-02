import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { isValidName, normalizeName, normalizePhone } from "../../../lib/phone";
import { after } from "next/server";
import { sendMetaLead } from "../../../lib/metaCapi";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ error: "invalid_name" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  if (typeof record.website === "string" && record.website.trim().length > 0) {
    return Response.json({ ok: true });
  }

  if (typeof record.name !== "string") {
    return Response.json({ error: "invalid_name" }, { status: 400 });
  }

  const customerName = normalizeName(record.name);
  if (!isValidName(customerName)) {
    return Response.json({ error: "invalid_name" }, { status: 400 });
  }

  if (typeof record.phone !== "string") {
    return Response.json({ error: "invalid_phone" }, { status: 400 });
  }

  const phone = normalizePhone(record.phone);
  if (!/^0[5-7][0-9]{8}$/.test(phone)) {
    return Response.json({ error: "invalid_phone" }, { status: 400 });
  }

  if (typeof record.marketing !== "boolean") {
    return Response.json({ error: "invalid_tracking" }, { status: 400 });
  }
  const marketingConsent = record.marketing;

  if (
    typeof record.eventId !== "string"
    || record.eventId.length < 1
    || record.eventId.length > 64
    || !/^[A-Za-z0-9_-]+$/.test(record.eventId)
  ) {
    return Response.json({ error: "invalid_tracking" }, { status: 400 });
  }
  const eventId = record.eventId;

  let sourceUrl: string | undefined;
  let fbp: string | undefined;
  let fbc: string | undefined;

  if (marketingConsent) {
    if (
      typeof record.sourceUrl !== "string"
      || record.sourceUrl.length > 2048
    ) {
      return Response.json({ error: "invalid_tracking" }, { status: 400 });
    }
    try {
      const parsedSourceUrl = new URL(record.sourceUrl);
      const requestOrigin = new URL(request.url).origin;
      if (
        !["http:", "https:"].includes(parsedSourceUrl.protocol)
        || parsedSourceUrl.origin !== requestOrigin
      ) {
        return Response.json({ error: "invalid_tracking" }, { status: 400 });
      }
      sourceUrl = record.sourceUrl;
    } catch {
      return Response.json({ error: "invalid_tracking" }, { status: 400 });
    }

    if (record.fbp !== undefined) {
      if (
        typeof record.fbp !== "string"
        || record.fbp.length > 256
        || !/^fb\.\d\.\d+\.\d+$/.test(record.fbp)
      ) {
        return Response.json({ error: "invalid_tracking" }, { status: 400 });
      }
      fbp = record.fbp;
    }

    if (record.fbc !== undefined) {
      if (
        typeof record.fbc !== "string"
        || record.fbc.length > 256
        || !/^fb\.\d\.\d+\..+$/.test(record.fbc)
      ) {
        return Response.json({ error: "invalid_tracking" }, { status: 400 });
      }
      fbc = record.fbc;
    }
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }

  try {
    const { error } = await getSupabaseAdmin()
      .from("leads")
      .insert({ customer_name: customerName, phone });
    if (!error || error.code === "23505") {
      if (marketingConsent && eventId) {
        const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
          || request.headers.get("x-real-ip")?.trim()
          || undefined;
        const clientUserAgent = request.headers.get("user-agent") || undefined;
        after(() => sendMetaLead({
          eventId,
          name: customerName,
          phone,
          eventSourceUrl: sourceUrl ?? "",
          clientIp,
          clientUserAgent,
          fbp,
          fbc,
        }));
      }
      return Response.json({ ok: true });
    }
    return Response.json(
      { error: "تعذّر إرسال طلبك. حاول مرة أخرى بعد قليل." },
      { status: 502 },
    );
  } catch {
    return Response.json(
      { error: "تعذّر إرسال طلبك. حاول مرة أخرى بعد قليل." },
      { status: 502 },
    );
  }
}
