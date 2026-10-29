/*
  Orders: shared types + validation (used by the checkout form AND the API route).

  Flow:  CheckoutForm -> submitOrder() -> POST /api/orders -> Supabase (server-side, service role key)

  1) Run this once in the Supabase SQL editor:

     create table orders (
       id uuid primary key default gen_random_uuid(),
       created_at timestamptz not null default now(),
       status text not null default 'new',      -- new | confirmed | shipped | delivered | cancelled
       customer jsonb not null,                  -- { name, phone, city, address, notes }
       items jsonb not null,                     -- [{ id, qty, unit_price }]
       shipping numeric not null default 0,
       total numeric not null,
       payment text not null default 'cod'
     );
     alter table orders enable row level security;
     -- No policies on purpose: the browser can never read or write orders.
     -- Only the server (service role key) inserts them, and you read them in the dashboard.

  2) In .env.local (server only, never NEXT_PUBLIC_):
     SUPABASE_URL=https://xxxx.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=...
*/
export type Customer = { name: string; phone: string; city: string; address: string; notes?: string };
export type OrderInput = {
  customer: Customer;
  items: { id: string; qty: number }[];
  payment: "cod";
  website?: string; // honeypot: real people leave it empty
};
export type CustomerErrors = Partial<Record<keyof Customer, string>>;

/** Arabic-Indic digits -> 0-9, strip separators, +212 / 00212 -> 0 */
export const normalizePhone = (v: string) =>
  v
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[\s.\-()]/g, "")
    .replace(/^(\+212|00212)/, "0");

/** Errors are returned in field order, so the first key is the first field to fix. */
export function validateCustomer(c: Customer): CustomerErrors {
  const e: CustomerErrors = {};
  if (c.name.trim().length < 3) e.name = "أدخل اسمك الكامل";
  if (!/^0[5-7]\d{8}$/.test(normalizePhone(c.phone))) e.phone = "أدخل رقم هاتف مغربي صحيح، مثل 0612345678";
  if (c.city.trim().length < 2) e.city = "اختر مدينتك أو اكتبها";
  if (c.address.trim().length < 8) e.address = "أدخل عنوانك بالتفصيل: الحي والشارع ورقم المنزل";
  if ((c.notes ?? "").length > 300) e.notes = "الملاحظات طويلة جداً (300 حرف كحد أقصى)";
  return e;
}

export async function submitOrder(input: OrderInput): Promise<{ id: string }> {
  let res: Response;
  try {
    res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  } catch {
    throw new Error("تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "تعذّر إرسال طلبك. حاول مرة أخرى بعد قليل.");
  return { id: String(data.id) };
}
