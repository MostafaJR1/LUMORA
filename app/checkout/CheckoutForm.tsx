"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import Link from "next/link";
import { useCart } from "../cart";
import { buttonStyles } from "../buttonStyles";
import { money, SHIPPING_FEE } from "./products";
import { normalizePhone, submitOrder, validateCustomer, type Customer, type CustomerErrors } from "./orders";

const CITIES = ["الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أكادير", "مكناس", "وجدة", "القنيطرة", "تطوان", "سلا", "تمارة", "المحمدية", "الجديدة", "بني ملال", "الناظور", "تازة", "سطات", "آسفي", "العيون"];
const ic = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

type FieldProps = { name: string; label: string; error?: string; hint?: string; optional?: boolean; area?: boolean } & Omit<InputHTMLAttributes<HTMLInputElement>, "name">;

function Field({ name, label, error, hint, optional, area, className = "", ...rest }: FieldProps) {
  const base = `w-full rounded-xl border bg-cream px-5 text-base outline-none placeholder:text-forest-900/40 focus:ring-2 focus:ring-gold-400/40 ${error ? "border-red-600 focus:border-red-600" : "border-forest-900/15 focus:border-gold-500"}`;
  const common = { id: name, name, "aria-invalid": !!error, "aria-describedby": error || hint ? `${name}-msg` : undefined };
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-forest-900">
        {label}
        {optional && <span className="ms-2 font-normal text-forest-900/50">(اختياري)</span>}
      </label>
      {area ? (
        <textarea {...common} rows={3} placeholder={rest.placeholder} autoComplete={rest.autoComplete} maxLength={rest.maxLength} className={`${base} resize-none py-4`} />
      ) : (
        <input {...common} {...rest} className={`${base} h-14 ${className}`} />
      )}
      {error ? (
        <p id={`${name}-msg`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
          <svg {...ic} className="h-4 w-4 flex-none"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-msg`} className="mt-1.5 text-xs text-forest-900/55">{hint}</p>
      ) : null}
    </div>
  );
}

export default function CheckoutForm() {
  const { items, subtotal, ready, clear } = useCart();
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState<{ id: string; total: number; name: string; phone: string } | null>(null);

  const total = subtotal + SHIPPING_FEE;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? "");
    const customer: Customer = { name: s("name"), phone: s("phone"), city: s("city"), address: s("address"), notes: s("notes") };

    const errs = validateCustomer(customer);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) { (form.elements.namedItem(first) as HTMLElement | null)?.focus(); return; }

    setBusy(true);
    setServerError("");
    try {
      const phone = normalizePhone(customer.phone);
      const { id } = await submitOrder({
        customer: { ...customer, name: customer.name.trim(), phone },
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
        payment: "cod",
        website: s("website"),
      });
      setDone({ id, total, name: customer.name.trim().split(/\s+/)[0], phone });
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "تعذّر إرسال طلبك. حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  };

  // clear a field's error as soon as the person edits it
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const n = (e.target as HTMLInputElement).name as keyof Customer;
    if (errors[n]) setErrors((p) => ({ ...p, [n]: undefined }));
  };

  /* ---- success ---- */
  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-forest-900/10 sm:p-12" role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-900 text-gold-300">
          <svg {...ic} strokeWidth={2.4} className="h-8 w-8"><path d="m5 12 4.5 4.5L19 7" /></svg>
        </span>
        <h2 className="mt-6 text-3xl font-semibold text-forest-900">تم استلام طلبك</h2>
        <p className="mt-3 leading-relaxed text-forest-900/75">
          شكراً {done.name}. سنتواصل معك على الرقم <span dir="ltr" className="font-semibold">{done.phone}</span> لتأكيد تفاصيل التوصيل.
        </p>
        <dl className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-cream p-4"><dt className="text-forest-900/60">رقم الطلب</dt><dd className="mt-1 font-semibold text-forest-900" dir="ltr">#{done.id.slice(0, 8).toUpperCase()}</dd></div>
          <div className="rounded-2xl bg-cream p-4"><dt className="text-forest-900/60">المبلغ عند الاستلام</dt><dd className="mt-1 font-semibold text-forest-900">{money(done.total)}</dd></div>
        </dl>
        <Link href="/" className={buttonStyles({ variant: "green", size: "lg", className: "mt-8" })}>العودة إلى المتجر</Link>
      </div>
    );
  }

  /* ---- loading cart from localStorage ---- */
  if (!ready) return <div className="h-96 animate-pulse rounded-3xl bg-white/70 motion-reduce:animate-none" aria-busy="true" />;

  /* ---- empty ---- */
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-forest-900/10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream text-forest-800">
          <svg {...ic} strokeWidth={1.6} className="h-7 w-7"><path d="M5 8h14l-1.2 11H6.2L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>
        </span>
        <h2 className="mt-5 text-xl font-semibold text-forest-900">سلتك فارغة</h2>
        <p className="mt-2 text-sm text-forest-900/65">أضف منتجاً إلى السلة ثم عد لإتمام طلبك.</p>
        <Link href="/#product" className={buttonStyles({ variant: "green", size: "md", className: "mt-6" })}>اكتشف المنتج</Link>
      </div>
    );
  }

  /* ---- form ---- */
  return (
    <form onSubmit={onSubmit} onInput={onInput} noValidate className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
      <div className="space-y-6">
        <section aria-labelledby="ship-title" className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-forest-900/10 sm:p-8">
          <h2 id="ship-title" className="text-xl font-semibold text-forest-900">بيانات التوصيل</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field name="name" label="الاسم الكامل" error={errors.name} autoComplete="name" placeholder="مثال: سلمى بنعلي" />
            <Field name="phone" label="رقم الهاتف" error={errors.phone} hint="سنتصل بك على هذا الرقم لتأكيد الطلب" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="06 12 34 56 78" className="text-right" />
            <div className="sm:col-span-2">
              <Field name="city" label="المدينة" error={errors.city} autoComplete="address-level2" list="cities" placeholder="اختر مدينتك أو اكتبها" />
              <datalist id="cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="sm:col-span-2">
              <Field name="address" label="العنوان" error={errors.address} area autoComplete="street-address" placeholder="الحي، الشارع، رقم المنزل أو الشقة" />
            </div>
            <div className="sm:col-span-2">
              <Field name="notes" label="ملاحظات للتوصيل" error={errors.notes} optional area maxLength={300} placeholder="مثال: الطابق الثالث، أو معلم قريب" />
            </div>
          </div>
          {/* honeypot: hidden from people, bots fill it */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="sr-only" />
        </section>

        <section aria-labelledby="pay-title" className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-forest-900/10 sm:p-8">
          <h2 id="pay-title" className="text-xl font-semibold text-forest-900">طريقة الدفع</h2>
          <div className="mt-5 flex items-center gap-4 rounded-2xl border-2 border-forest-900 bg-cream p-4">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-forest-900 text-gold-300">
              <svg {...ic} className="h-5 w-5"><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>
            </span>
            <div className="flex-1">
              <p className="font-semibold text-forest-900">الدفع عند الاستلام</p>
              <p className="mt-0.5 text-sm text-forest-900/65">ادفع نقداً عند وصول طلبك إلى باب منزلك.</p>
            </div>
            <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-forest-900"><span className="h-2.5 w-2.5 rounded-full bg-forest-900" /></span>
          </div>
        </section>
      </div>

      {/* summary */}
      <aside aria-labelledby="sum-title" className="order-first rounded-3xl bg-white p-6 shadow-sm ring-1 ring-forest-900/10 sm:p-8 lg:order-none lg:sticky lg:top-8">
        <h2 id="sum-title" className="text-xl font-semibold text-forest-900">ملخص الطلب</h2>
        <ul className="mt-5 divide-y divide-forest-900/10">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-4 py-4">
              <span className="relative flex-none">
                <img src={it.img} alt="" width={64} height={64} className="h-16 w-16 rounded-xl bg-cream object-cover" />
                <span dir="ltr" className="absolute -right-2 -top-2 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-forest-900 px-1 text-xs font-semibold text-cream ring-2 ring-white">{it.qty}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-forest-900">{it.name}</p>
                <p className="mt-0.5 text-xs text-forest-900/60">{it.size}</p>
              </div>
              <p className="flex-none text-sm font-semibold text-forest-900">{money(it.price * it.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-3 border-t border-forest-900/10 pt-5 text-sm text-forest-900/80">
          <div className="flex justify-between"><dt>المجموع الفرعي</dt><dd className="font-medium text-forest-900">{money(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>التوصيل</dt><dd className="font-medium text-forest-900">{SHIPPING_FEE === 0 ? "مجاني" : money(SHIPPING_FEE)}</dd></div>
          <div className="flex justify-between border-t border-forest-900/10 pt-4 text-base text-forest-900"><dt className="font-semibold">الإجمالي</dt><dd className="text-2xl font-semibold">{money(total)}</dd></div>
        </dl>

        {serverError && (
          <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">
            <svg {...ic} className="mt-0.5 h-4 w-4 flex-none"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
            {serverError}
          </p>
        )}

        <button type="submit" disabled={busy} className={buttonStyles({ variant: "green", size: "lg", className: "mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60" })}>
          {busy ? (
            <>
              <svg {...ic} className="h-5 w-5 animate-spin motion-reduce:animate-none"><path d="M21 12a9 9 0 1 1-6.2-8.55" /></svg>
              جارٍ إرسال الطلب...
            </>
          ) : (
            <>تأكيد الطلب<span className="opacity-80">({money(total)})</span></>
          )}
        </button>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-forest-900/55">
          <svg {...ic} className="h-3.5 w-3.5"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          بياناتك محمية ولا تُستعمل إلا لتوصيل طلبك
        </p>
      </aside>
    </form>
  );
}
