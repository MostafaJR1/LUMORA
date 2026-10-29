"use client";

import { useEffect, useRef } from "react";
import { MAX_QTY, useCart } from "./cart";
import { money } from "./products";
import { buttonStyles } from "./buttonStyles";

export const CHECKOUT_URL = "/checkout"; // TODO: build the checkout page (then submitOrder() from orders.ts)

const ic = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export default function CartDrawer() {
  const { open, setOpen, items, count, subtotal, setQty, remove, flash } = useCart();
  const panel = useRef<HTMLElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  // scroll lock, Esc, focus trap, restore focus
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    const oldPad = document.body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth; // scrollbar width
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = oldOverflow;
      document.body.style.paddingRight = oldPad;
      prev?.focus({ preventScroll: true });
    };
  }, [open, setOpen]);

  return (
    <>
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-[60] bg-black/15 transition-[opacity,visibility] duration-500 ease-out motion-reduce:transition-none ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      />

      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="سلة التسوق"
        aria-hidden={!open}
        className={`fixed left-0 top-0 z-[70] flex h-[100dvh] w-full max-w-md flex-col bg-white shadow-2xl will-change-transform transition-[transform,visibility] duration-[600ms] ease-[cubic-bezier(.32,.72,0,1)] motion-reduce:transition-none ${open ? "visible translate-x-0" : "invisible -translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-forest-900">
            سلة التسوق {count > 0 && <span className="text-sm font-normal text-forest-900/55" dir="ltr">({count})</span>}
          </h2>
          <button ref={closeBtn} type="button" onClick={close} aria-label="إغلاق السلة" className="flex h-11 w-11 items-center justify-center rounded-full text-forest-900 transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
            <svg {...ic} className="h-5 w-5"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </header>

        {/* confirmation right after adding */}
        <div className={`overflow-hidden bg-forest-900 text-cream transition-all duration-300 motion-reduce:transition-none ${flash ? "max-h-14 opacity-100 delay-[600ms]" : "max-h-0 opacity-0"}`} role="status">
          <p className="flex items-center gap-2 px-5 py-3 text-sm font-medium">
            <svg {...ic} className="h-4 w-4 text-gold-300"><path d="m5 12 4.5 4.5L19 7" /></svg>
            تمت إضافة المنتج إلى سلتك
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-forest-800">
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
                  <img src={it.img} alt={it.name} width={80} height={80} className="h-20 w-20 flex-none rounded-xl bg-cream object-cover" />
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
                      <div className="flex items-center rounded-full border border-forest-900/15" dir="ltr">
                        <button type="button" onClick={() => setQty(it.id, it.qty - 1)} aria-label={it.qty === 1 ? "حذف المنتج من السلة" : "تقليل الكمية"} className="flex h-11 w-11 items-center justify-center rounded-full text-forest-900 transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
                          {it.qty === 1 ? (
                            <svg {...ic} className="h-4 w-4"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" /></svg>
                          ) : (
                            <svg {...ic} className="h-4 w-4"><path d="M5 12h14" /></svg>
                          )}
                        </button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">{it.qty}</span>
                        <button type="button" onClick={() => setQty(it.id, it.qty + 1)} disabled={it.qty >= MAX_QTY} aria-label="زيادة الكمية" className="flex h-11 w-11 items-center justify-center rounded-full text-forest-900 transition hover:bg-cream disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
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
                <span className="font-medium">المجموع الفرعي</span>
                <span className="text-xl font-semibold">{money(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-forest-900/60">الشحن والرسوم تُحتسب عند إتمام الطلب.</p>

              <a href={CHECKOUT_URL} className={buttonStyles({ variant: "green", size: "lg", className: "group mt-4 w-full justify-center" })}>
                إتمام الطلب
                <svg {...ic} className="h-5 w-5 flex-none -scale-x-100 transition group-hover:-translate-x-1 motion-reduce:transition-none"><path d="M4 12h16M13 5l7 7-7 7" /></svg>
              </a>
              <button type="button" onClick={close} className="mt-3 w-full text-center text-sm font-medium text-forest-900/70 underline-offset-4 transition hover:text-forest-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
                متابعة التسوق
              </button>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-forest-900/55">
                <svg {...ic} className="h-3.5 w-3.5"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                دفع آمن، ومعاملاتك محمية بالكامل
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}