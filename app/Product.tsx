"use client";

import { useEffect, useState } from "react";
import { Reveal } from "./Motion";
import { AddToCartButton, MAX_QTY } from "./cart";
import { DELIVERY_ESTIMATE, PRODUCTS, money } from "./products";
import { SHOTS } from "./Productshots";

const P = PRODUCTS[0];
const GALLERY = [SHOTS.square, SHOTS.bottle, SHOTS.label, SHOTS.cap];
const POINTS = [
  "بدون سلفات، لطيف على فروة الرأس",
  "5 مكونات طبيعية: زيت أزير، جل الصبار، برو فيتامين B5، البصل والجنسينغ",
  "استعمال مرة واحدة في الأسبوع",
  "صنع في المغرب",
];
const ic = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export default function ProductSection() {
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const selectedImage = GALLERY[img];

  return (
    <section id="product" aria-labelledby="product-title" className="scroll-mt-28 bg-cream py-12 sm:py-16">
      <Reveal className="mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-forest-900/10">
            <img src={selectedImage.src} alt={selectedImage.alt} className="h-full w-full object-cover" />
          </div>
          <ul className="mt-4 grid grid-cols-4 gap-3">
            {GALLERY.map((shot, k) => (
              <li key={shot.src}>
                <button type="button" onClick={() => setImg(k)} aria-label={`عرض الصورة ${k + 1}`} aria-pressed={k === img} className={`block aspect-square w-full overflow-hidden rounded-xl bg-white ring-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${k === img ? "ring-forest-900" : "ring-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={shot.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-gold-500">شامبو ضد التساقط</p>
          <h2 id="product-title" className="text-3xl font-semibold text-forest-900 sm:text-4xl">{P.name}</h2>
          <p className="mt-2 text-forest-900/65">{P.size}</p>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="text-4xl font-light text-forest-900">{money(P.price)}</p>
            <p className="text-sm font-medium text-forest-900/75">الدفع عند الاستلام</p>
            <p className="text-sm text-forest-900/65">التوصيل خلال {DELIVERY_ESTIMATE}</p>
          </div>

          <ul className="mt-6 space-y-3">
            {POINTS.map((t) => (
              <li key={t} className="flex items-start gap-3 text-forest-900/85">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-forest-900 text-gold-300">
                  <svg {...ic} strokeWidth={3} className="h-3 w-3"><path d="m5 12 4.5 4.5L19 7" /></svg>
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex w-fit items-center rounded-full border border-forest-900/20 bg-white" dir="ltr">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="تقليل الكمية" className="flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-cream disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
                <svg {...ic} className="h-4 w-4"><path d="M5 12h14" /></svg>
              </button>
              <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} disabled={qty >= MAX_QTY} aria-label="زيادة الكمية" className="flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-cream disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
                <svg {...ic} className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>
              </button>
            </div>
            <AddToCartButton productId={P.id} qty={qty} variant="green" size="lg" className="w-full flex-1 justify-center sm:w-auto sm:flex-none" />
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-forest-900/65">
            <svg {...ic} className="h-4 w-4"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" /></svg>
            توصيل سريع إلى باب منزلك
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export function StickyProductCTA() {
  const [heroPassed, setHeroPassed] = useState(false);
  const [productInView, setProductInView] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const product = document.getElementById("product");
    if (!hero || !product) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) {
          setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
        } else if (entry.target === product) {
          setProductInView(entry.isIntersecting);
        }
      }
    });

    observer.observe(hero);
    observer.observe(product);
    return () => observer.disconnect();
  }, []);

  const visible = heroPassed && !productInView;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-forest-900/10 bg-cream/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(6,21,15,0.12)] backdrop-blur transition-transform sm:hidden ${visible ? "translate-y-0" : "pointer-events-none translate-y-full"}`}
    >
      <div className="mx-auto flex max-w-lg items-center gap-4">
        <p className="shrink-0 text-lg font-semibold text-forest-900" dir="ltr">{money(P.price)}</p>
        <a
          href="#product"
          tabIndex={visible ? 0 : -1}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-forest-900 px-4 text-base font-semibold text-cream transition hover:bg-forest-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        >
          اطلب الآن
        </a>
      </div>
    </div>
  );
}
