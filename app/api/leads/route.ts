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

  const marketingConsent = record.marketingConsent === true;
  const eventId = typeof record.eventId === "string" ? record.eventId.trim() : "";
  const eventSourceUrl = typeof record.eventSourceUrl === "string"
    ? record.eventSourceUrl
    : "";
  const fbp = typeof record.fbp === "string" ? record.fbp : undefined;
  const fbc = typeof record.fbc === "string" ? record.fbc : undefined;

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
          eventSourceUrl,
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
