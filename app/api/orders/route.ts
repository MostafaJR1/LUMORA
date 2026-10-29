import { NextResponse } from "next/server";
import { getProduct, SHIPPING_FEE } from "../../checkout/products";
import { normalizePhone, validateCustomer, type Customer } from "../../checkout/orders";

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });
const str = (v: unknown, max = 300) => String(v ?? "").trim().slice(0, max);
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad("طلب غير صالح");
  }
  if (!isRecord(body)) return bad("طلب غير صالح");

  if (body.website) return NextResponse.json({ id: "OK" });

  const rawCustomer = isRecord(body.customer) ? body.customer : {};
  const customer: Customer = {
    name: str(rawCustomer.name, 80),
    phone: normalizePhone(str(rawCustomer.phone, 30)),
    city: str(rawCustomer.city, 60),
    address: str(rawCustomer.address, 200),
    notes: str(rawCustomer.notes, 300),
  };
  if (Object.keys(validateCustomer(customer)).length) return bad("بيانات التوصيل غير صالحة", 422);

  const raw: unknown[] = Array.isArray(body.items) ? body.items : [];
  const items = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const p = getProduct(String(item.id));
      const qty = Number(item.qty);
      return p && Number.isInteger(qty) && qty >= 1 && qty <= 10 ? { id: p.id, qty, unit_price: p.price } : null;
    })
    .filter((x): x is { id: string; qty: number; unit_price: number } => x !== null);
  if (!items.length || items.length !== raw.length) return bad("السلة غير صالحة", 422);

  const subtotal = items.reduce((s, i) => s + i.qty * i.unit_price, 0);
  const order = { customer, items, shipping: SHIPPING_FEE, total: subtotal + SHIPPING_FEE, payment: "cod" };

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    if (process.env.NODE_ENV === "production") return bad("الخدمة غير متاحة مؤقتاً. حاول لاحقاً.", 503);
    console.log("[order:dev] Supabase not configured, order not saved:", order);
    return NextResponse.json({ id: "DEV-" + Date.now().toString(36).toUpperCase() });
  }

  const res = await fetch(`${url}/rest/v1/orders`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    console.error("[order] Supabase error:", await res.text());
    return bad("تعذّر حفظ طلبك. حاول مرة أخرى بعد قليل.", 502);
  }
  const [row] = await res.json();
  return NextResponse.json({ id: row.id });
}
