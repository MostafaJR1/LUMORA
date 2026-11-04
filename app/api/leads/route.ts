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
    return Response.json({ error: "honeypot" }, { status: 400 });
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
  // Consent is stored in browser localStorage, so the client boolean is not
  // server-verifiable. It is accepted only for request validation and is never
  // used to trigger Meta CAPI.

  if (
    typeof record.eventId !== "string"
    || record.eventId.length < 1
    || record.eventId.length > 64
    || !/^[A-Za-z0-9_-]+$/.test(record.eventId)
  ) {
    return Response.json({ error: "invalid_tracking" }, { status: 400 });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }

  try {
    const { error } = await getSupabaseAdmin()
      .from("leads")
      .insert({ customer_name: customerName, phone });
    if (!error) {
  if (record.marketing === true) {
    const cookie = request.headers.get("cookie") ?? "";
    const getCookie = (n: string) =>
      cookie.match(new RegExp(`(?:^|; )${n}=([^;]*)`))?.[1];

    after(() =>
      sendMetaLead({
        eventId: record.eventId as string,
        name: customerName,
        phone,
        eventSourceUrl:
          request.headers.get("referer") ?? `https://${request.headers.get("host")}`,
        clientIp: request.headers.get("x-forwarded-for")?.split(",")[0].trim(),
        clientUserAgent: request.headers.get("user-agent") ?? undefined,
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
      }),
    );
  }
  return Response.json({ ok: true });
}
    if (error.code === "23505") {
      return Response.json({ error: "duplicate_lead" }, { status: 409 });
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
