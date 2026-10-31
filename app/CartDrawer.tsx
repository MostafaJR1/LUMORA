"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { MAX_QTY, useCart } from "./cart";
import { DELIVERY_ESTIMATE, money } from "./products";
import { buttonStyles } from "./buttonStyles";

export const CHECKOUT_URL = "/checkout"; // kept for compatibility; the drawer now has its own checkout form

const ORDER_ENDPOINT = "/api/orders";

const CITIES = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أكادير", "مكناس", "وجدة", "القنيطرة", "تطوان",
  "سلا", "تمارة", "المحمدية", "الجديدة", "بني ملال", "الناظور", "تازة", "خريبكة", "سطات", "العيون",
  "آسفي", "الصويرة", "الحسيمة", "برشيد", "الخميسات", "الراشيدية", "ورزازات", "إفران", "الداخلة",
];

const PHONE_RE = /^(?:\+212|00212|0)[5-7]\d{8}$/;

const ic = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

type Step = "cart" | "checkout" | "done";
type FieldKey = "name" | "phone" | "city";
type Errors = Partial<Record<FieldKey, string>>;

/* Cleans a phone number typed by the user: removes spaces/dashes and converts Arabic-Indic digits */
function normalizePhone(v: string) {
  return v
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\s\-.()]/g, "");
}

/* Optional ad tracking: only runs if the Meta Pixel is installed on the site */
function track(event: string, data?: Record<string, unknown>) {
  try {
    (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.("track", event, data);
  } catch {
    /* ignore */
  }
}

/* Freezes the page while the cart is open and restores the exact scroll position afterwards. */
function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const y = window.scrollY;
    const s = document.body.style;
    const prev = { position: s.position, top: s.top, width: s.width };
    s.position = "fixed";
    s.top = `-${y}px`;
    s.width = "100%";
    return () => {
      s.position = prev.position;
      s.top = prev.top;
      s.width = prev.width;
      window.scrollTo(0, y);
    };
  }, [locked]);
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-forest-900">{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}

const inputCls =
  "h-12 w-full border bg-white px-4 text-base text-forest-900 outline-none transition-colors placeholder:text-forest-900/40 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/40";

export default function CartDrawer() {
  const { open, setOpen, items, count, subtotal, setQty, remove, flash } = useCart();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const close = () => setOpen(false);

  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState({ name: "", phone: "", city: "", website: "" }); // `website` = honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [placed, setPlaced] = useState<{ id: string; total: number; count: number; city: string } | null>(null);

  useLockBodyScroll(open);

  /* 1) Open the cart automatically whenever the number of items goes UP (add to cart, sticky CTA...).
        The first 1.5 s are ignored so a saved cart loading on page start doesn't pop open. */
  const prevCount = useRef(count);
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (count > prevCount.current && Date.now() - mountedAt.current > 1500) {
      setStep("cart");
      setOpen(true);
    }
    prevCount.current = count;
  }, [count, setOpen]);

  /* 2) Escape to close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  /* 3) Focus: into the drawer when it opens, back to the previous element when it closes */
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => closeBtn.current?.focus({ preventScroll: true }), 60);
    return () => {
      clearTimeout(t);
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  /* 4) After the drawer finished closing, go back to the cart step */
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStep("cart");
      setStatus("idle");
      setErrors({});
    }, 400);
    return () => clearTimeout(t);
  }, [open]);

  /* 5) Focus the first field when the form appears */
  useEffect(() => {
    if (step === "checkout") {
      const t = setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 80);
      return () => clearTimeout(t);
    }
  }, [step]);

  if (step === "checkout" && items.length === 0) setStep("cart");
  const activeStep = step === "checkout" && items.length === 0 ? "cart" : step;

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k as FieldKey]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  function validate(): Errors {
    const er: Errors = {};
    if (form.name.trim().length < 3) er.name = "المرجو إدخال الاسم الكامل";
    if (!PHONE_RE.test(normalizePhone(form.phone))) er.phone = "رقم الهاتف غير صحيح، مثال: 0612345678";
    if (form.city.trim().length < 2) er.city = "المرجو إدخال المدينة";
    return er;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    // Honeypot: real people never fill this hidden field
    if (form.website) {
      setPlaced({ id: "", total: subtotal, count, city: form.city.trim() });
      setStep("done");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(ORDER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: normalizePhone(form.phone),
          city: form.city.trim(),
          items: items.map((it) => ({ id: it.id, name: it.name, qty: it.qty, price: it.price })),
          subtotal,
        }),
      });
      if (!res.ok) throw new Error("order failed");
      const data = (await res.json().catch(() => ({}))) as { orderId?: string };

      setPlaced({ id: data.orderId ?? "", total: subtotal, count, city: form.city.trim() });
      track("Purchase", { value: subtotal, currency: "MAD", num_items: count });
      items.forEach((it) => remove(it.id)); // empty the cart
      setForm((f) => ({ ...f, website: "" }));
      setStatus("idle");
      setStep("done");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      alert("Order submit failed:" + " " + message + " " + err);
      setStatus("error");
    }
  }

  const title = activeStep === "cart" ? "سلة التسوق" : activeStep === "checkout" ? "معلومات التوصيل" : "تم إرسال طلبك";

  return (
    <div className={`fixed inset-0 z-[100] ${open ? "" : "pointer-events-none"}`}>
      {/* Backdrop: covers everything, including the header */}
      <div
        onClick={close}
        aria-hidden
        className={`absolute inset-0 bg-black/55 backdrop-blur-[1px] transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        inert={!open}
        className={`absolute left-0 top-0 flex h-dvh w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <header className="flex items-center justify-between gap-2 border-b border-forest-900/10 px-5 py-4">
          <div className="flex items-center gap-2">
            {step === "checkout" && (
              <button type="button" onClick={() => setStep("cart")} aria-label="الرجوع إلى السلة" className="-ms-2 flex h-11 w-11 items-center justify-center text-forest-900 transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
                <svg {...ic} className="h-5 w-5"><path d="M4 12h16M13 5l7 7-7 7" /></svg>
              </button>
            )}
            <h2 className="text-lg font-semibold text-forest-900">
              {title} {step === "cart" && count > 0 && <span className="text-sm font-normal text-forest-900/55" dir="ltr">({count})</span>}
            </h2>
          </div>
          <button ref={closeBtn} type="button" onClick={close} aria-label="إغلاق" className="flex h-11 w-11 items-center justify-center text-forest-900 transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
            <svg {...ic} className="h-5 w-5"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </header>

        {/* ===================== STEP 1: CART ===================== */}
        {activeStep === "cart" && (
          <>
            {/* confirmation right after adding */}
            <div className={`overflow-hidden bg-forest-900 text-cream transition-all duration-300 motion-reduce:transition-none ${flash ? "max-h-14 opacity-100 delay-[600ms]" : "max-h-0 opacity-0"}`} role="status">
              <p className="flex items-center gap-2 px-5 py-3 text-sm font-medium">
                <svg {...ic} className="h-4 w-4 text-gold-300"><path d="m5 12 4.5 4.5L19 7" /></svg>
                تمت إضافة المنتج إلى سلتك
              </p>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center bg-cream text-forest-800">
                  <svg {...ic} strokeWidth={1.6} className="h-7 w-7"><path d="M5 8h14l-1.2 11H6.2L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-forest-900">سلتك فارغة</h3>
                <p className="mt-1 text-sm text-forest-900/65">أضف شامبو LUMORA وابدأ رحلة جذور أقوى.</p>
                <a href="#product" onClick={close} className={buttonStyles({ variant: "green", size: "md", className: "mt-6" })}>اكتشف المنتج</a>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-forest-900/10 overflow-y-auto overscroll-contain px-5">
                  {items.map((it) => (
                    <li key={it.id} className="flex gap-4 py-5">
                      <Image src={it.img} alt={it.name} width={80} height={80} className="h-20 w-20 flex-none bg-cream object-cover" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold leading-snug text-forest-900">{it.name}</h3>
                            <p className="mt-0.5 text-xs text-forest-900/60">{it.size}</p>
                            {it.qty > 1 && <p className="mt-0.5 text-xs text-forest-900/50">{money(it.price)} للوحدة</p>}
                          </div>
                          <p className="flex-none text-sm font-semibold text-forest-900">{money(it.price * it.qty)}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-forest-900/15" dir="ltr">
                            <button type="button" onClick={() => setQty(it.id, it.qty - 1)} aria-label={it.qty === 1 ? "حذف المنتج من السلة" : "تقليل الكمية"} className="flex h-11 w-11 items-center justify-center text-forest-900 transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
                              {it.qty === 1 ? (
                                <svg {...ic} className="h-4 w-4"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" /></svg>
                              ) : (
                                <svg {...ic} className="h-4 w-4"><path d="M5 12h14" /></svg>
                              )}
                            </button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">{it.qty}</span>
                            <button type="button" onClick={() => setQty(it.id, it.qty + 1)} disabled={it.qty >= MAX_QTY} aria-label="زيادة الكمية" className="flex h-11 w-11 items-center justify-center text-forest-900 transition hover:bg-cream disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
                              <svg {...ic} className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>
                            </button>
                          </div>
                          <button type="button" onClick={() => remove(it.id)} className="min-h-11 px-2 text-sm font-medium text-forest-900/60 underline-offset-4 transition hover:text-forest-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">حذف</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-forest-900/10 bg-cream px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-12px_24px_-16px_rgba(0,0,0,.18)]">
                  <div className="flex items-center justify-between text-forest-900">
                    <span className="font-medium">المجموع</span>
                    <span className="text-xl font-semibold">{money(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-forest-900/60">الدفع عند الاستلام · التوصيل خلال {DELIVERY_ESTIMATE}</p>

                  <button
                    type="button"
                    onClick={() => {
                      track("InitiateCheckout", { value: subtotal, currency: "MAD", num_items: count });
                      setStep("checkout");
                    }}
                    className={buttonStyles({ variant: "green", size: "lg", className: "group mt-4 w-full justify-center" })}
                  >
                    إتمام الطلب
                    <svg {...ic} className="h-5 w-5 flex-none -scale-x-100 transition group-hover:-translate-x-1 motion-reduce:transition-none"><path d="M4 12h16M13 5l7 7-7 7" /></svg>
                  </button>
                  <button type="button" onClick={close} className="mt-3 w-full text-center text-sm font-medium text-forest-900/70 underline-offset-4 transition hover:text-forest-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
                    متابعة التسوق
                  </button>
                </footer>
              </>
            )}
          </>
        )}

        {/* ===================== STEP 2: CHECKOUT FORM ===================== */}
        {activeStep === "checkout" && (
          <form ref={formRef} onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5">
              {/* compact order summary */}
              <div className=" bg-cream p-4 text-sm text-forest-900">
                <ul className="space-y-1.5">
                  {items.map((it) => (
                    <li key={it.id} className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate">{it.name} <span className="text-forest-900/55" dir="ltr">× {it.qty}</span></span>
                      <span className="flex-none font-medium">{money(it.price * it.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between border-t border-forest-900/10 pt-3 font-semibold">
                  <span>المجموع</span>
                  <span>{money(subtotal)}</span>
                </div>
              </div>

              <Field id="co-name" label="الاسم الكامل" error={errors.name}>
                <input
                  ref={nameRef}
                  id="co-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={set("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "co-name-error" : undefined}
                  placeholder="مثال: سلمى بنعلي"
                  className={`${inputCls} ${errors.name ? "border-red-600" : "border-forest-900/20"}`}
                />
              </Field>

              <Field id="co-phone" label="رقم الهاتف" error={errors.phone}>
                <input
                  id="co-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={set("phone")}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "co-phone-error" : undefined}
                  placeholder="06 12 34 56 78"
                  className={`${inputCls} text-start ${errors.phone ? "border-red-600" : "border-forest-900/20"}`}
                />
              </Field>

              <Field id="co-city" label="المدينة" error={errors.city}>
                <input
                  id="co-city"
                  name="city"
                  type="text"
                  list="ma-cities"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={set("city")}
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? "co-city-error" : undefined}
                  placeholder="اختر أو اكتب مدينتك"
                  className={`${inputCls} ${errors.city ? "border-red-600" : "border-forest-900/20"}`}
                />
                <datalist id="ma-cities">
                  {CITIES.map((c) => <option key={c} value={c} />)}
                </datalist>
              </Field>

              {/* honeypot (hidden from people) */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  لا تملأ هذا الحقل
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
                </label>
              </div>

              {status === "error" && (
                <p role="alert" className=" bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                  تعذّر إرسال الطلب، يرجى التحقق من الاتصال والمحاولة مرة أخرى.
                </p>
              )}
            </div>

            <div className="border-t border-forest-900/10 bg-cream px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-12px_24px_-16px_rgba(0,0,0,.18)]">
              <button
                type="submit"
                disabled={status === "loading"}
                className={buttonStyles({ variant: "green", size: "lg", className: "w-full justify-center disabled:opacity-60" })}
              >
                {status === "loading" ? "جارٍ الإرسال..." : "إرسال الطلب"}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-forest-900/60">
                <svg {...ic} className="h-3.5 w-3.5"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                الدفع عند الاستلام، لا حاجة لبطاقة بنكية
              </p>
            </div>
          </form>
        )}

        {/* ===================== STEP 3: SUCCESS ===================== */}
        {activeStep === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center" role="status">
            <span className="flex h-16 w-16 items-center justify-center bg-forest-900 text-gold-300">
              <svg {...ic} strokeWidth={2.5} className="h-7 w-7"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
            </span>
            <h3 className="mt-5 text-xl font-semibold text-forest-900">شكراً لك، تم استلام طلبك</h3>
            {placed?.id && (
              <p className="mt-2 text-sm text-forest-900/70">
                رقم الطلب: <span className="font-semibold" dir="ltr">{placed.id}</span>
              </p>
            )}
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-forest-900/70">
              سنتصل بك قريباً لتأكيد الطلب، ثم نوصله إلى {placed?.city || "عنوانك"} خلال {DELIVERY_ESTIMATE}. الدفع عند الاستلام.
            </p>
            {placed && (
              <p className="mt-4 text-sm font-medium text-forest-900">المجموع: {money(placed.total)}</p>
            )}
            <button type="button" onClick={close} className={buttonStyles({ variant: "green", size: "md", className: "mt-7" })}>
              متابعة التسوق
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}