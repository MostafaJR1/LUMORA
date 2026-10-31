// Place this file at: app/api/orders/route.ts
// Add to .env.local:  ORDERS_WEBHOOK_URL=<your Google Apps Script / Make / Zapier / n8n webhook URL>
import { NextResponse } from "next/server";

const PHONE_RE = /^(?:\+212|00212|0)[5-7]\d{8}$/;

const text = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const name = text(body.name, 120);
  const phone = text(body.phone, 20);
  const city = text(body.city, 80);

  if (name.length < 3 || !PHONE_RE.test(phone) || city.length < 2) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items = rawItems
    .map((it: Record<string, unknown>) => ({
      id: text(it?.id, 80),
      name: text(it?.name, 160),
      qty: Math.min(20, Math.max(1, Math.floor(Number(it?.qty) || 0))),
      price: Number(it?.price) || 0,
    }))
    .filter((it: { id: string; qty: number }) => it.id && it.qty > 0);

  if (items.length === 0) {
    return NextResponse.json({ error: "empty_order" }, { status: 400 });
  }

  const webhook = process.env.ORDERS_WEBHOOK_URL;
  if (!webhook) {
    // Not configured yet: the form shows its error message instead of pretending the order was saved
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const orderId = `LM-${Date.now().toString(36).toUpperCase()}`;
  const payload = {
    orderId,
    createdAt: new Date().toISOString(),
    name,
    phone,
    city,
    items,
    subtotal: Number(body.subtotal) || 0, // sent by the browser: re-check it when you confirm by phone
    payment: "COD",
  };

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "webhook_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, orderId });
}