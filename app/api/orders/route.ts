import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { PRODUCTS } from "../../products";
import { normalizePhone, validateCustomer, type Customer } from "../../checkout/orders";

const text = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function clampQuantity(value: unknown) {
  const quantity = Number(value);
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(20, Math.max(1, Math.floor(quantity)));
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const bodyRecord = body as Record<string, unknown>;
  if (typeof bodyRecord.website === "string" && bodyRecord.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const customerRecord = bodyRecord.customer;
  const isCheckoutPayload = customerRecord !== null && typeof customerRecord === "object";
  const customer = isCheckoutPayload
    ? customerRecord as Record<string, unknown>
    : bodyRecord;

  const normalizedCustomer: Customer = {
    name: text(customer.name),
    phone: normalizePhone(text(customer.phone, 20)),
    city: text(customer.city),
    address: isCheckoutPayload ? text(customer.address, 500) : "",
    notes: typeof customer.notes === "string" ? customer.notes.trim().slice(0, 301) : "",
  };

  const notesText = normalizedCustomer.notes ?? "";

  if (isCheckoutPayload) {
    const errors = validateCustomer(normalizedCustomer);
    if (
      Object.keys(errors).length > 0 ||
      normalizedCustomer.name.length > 120 ||
      normalizedCustomer.city.length > 80 ||
      notesText.length > 300
    ) {
      return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
    }
  } else if (
    normalizedCustomer.name.length < 3 ||
    normalizedCustomer.name.length > 120 ||
    !/^0[5-7]\d{8}$/.test(normalizedCustomer.phone) ||
    normalizedCustomer.city.length < 2 ||
    normalizedCustomer.city.length > 80
  ) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const rawItems = Array.isArray(bodyRecord.items) ? bodyRecord.items : [];
  if (rawItems.length === 0) {
    return NextResponse.json({ error: "empty_order" }, { status: 400 });
  }

  const quantities = new Map<string, number>();
  for (const rawItem of rawItems) {
    if (!rawItem || typeof rawItem !== "object") continue;
    const itemRecord = rawItem as Record<string, unknown>;
    const id = text(itemRecord.id, 80);
    if (!id) continue;
    quantities.set(id, Math.min(20, (quantities.get(id) ?? 0) + clampQuantity(itemRecord.qty)));
  }

  if (quantities.size === 0) {
    return NextResponse.json({ error: "empty_order" }, { status: 400 });
  }

  const storedItems: { id: string; name: string; qty: number; unit_price: number }[] = [];
  let total = 0;

  for (const [id, qty] of quantities) {
    const product = PRODUCTS.find((candidate) => candidate.id === id);
    if (!product) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    storedItems.push({ id, name: product.name, qty, unit_price: product.price });
    total += product.price * qty;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: normalizedCustomer.name,
        phone: normalizedCustomer.phone,
        city: normalizedCustomer.city,
        items: storedItems,
        total,
      })
      .select("order_number")
      .single();

    if (error) {
      console.error("Supabase order insert failed");
      return NextResponse.json(
        { error: "تعذّر إرسال طلبك. حاول مرة أخرى بعد قليل." },
        { status: 502 },
      );
    }

    const orderNumber = String(data.order_number);
    return NextResponse.json({ ok: true, id: orderNumber, orderId: orderNumber });
  } catch {
    console.error("Supabase order insert failed");
    return NextResponse.json(
      { error: "تعذّر إرسال طلبك. حاول مرة أخرى بعد قليل." },
      { status: 502 },
    );
  }
}