import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { isValidName, normalizeName, normalizePhone } from "../../../lib/phone";

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

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }

  try {
    const { error } = await getSupabaseAdmin()
      .from("leads")
      .insert({ customer_name: customerName, phone });
    if (!error) return Response.json({ ok: true });
    if (error.code === "23505") return Response.json({ ok: true });
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
