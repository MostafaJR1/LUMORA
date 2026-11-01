"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Reveal } from "./Motion";
import { AddToCartButton, MAX_QTY } from "./cart";
import { DELIVERY_ESTIMATE, PRODUCTS, money } from "./products";
import { SHOTS } from "./Productshots";
import { OrderButton } from "./OrderProvider";

const P = PRODUCTS[0];
const GALLERY = [SHOTS.bottleFront, SHOTS.marbleLifestyle, SHOTS.bottleBack, SHOTS.botanicalPortrait];
// Transparent product cut-outs: shown whole and centered (never cropped).
// Lifestyle photos not listed here fill the frame as before. Edit this list if your files differ.
const CUTOUTS = new Set<string>([SHOTS.bottleFront.src, SHOTS.bottleBack.src]);
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
  const n = GALLERY.length;
  const go = (k: number) => setImg(((k % n) + n) % n);

  const round =
    "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest-900 shadow-md backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500";

  return (
    <section id="product" aria-labelledby="product-title" className="scroll-mt-28 bg-cream py-8 sm:py-10">
      <Reveal className="mx-auto grid max-w-5xl items-center gap-5 px-5 sm:px-8 lg:grid-cols-2 lg:gap-8">
        {/* Gallery */}
        <div className="mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-b from-white to-cream shadow-sm ring-1 ring-forest-900/10 sm:aspect-[5/6]">
            {/* images are stacked and cross-fade */}
            {GALLERY.map((shot, k) => {
              const cutout = CUTOUTS.has(shot.src);
              return (
                <Image
                  key={shot.src}
                  src={shot.src}
                  alt={k === img ? shot.alt : ""}
                  aria-hidden={k !== img}
                  loading={k === 0 ? "eager" : "lazy"}
                  fill
                  sizes="(min-width: 1024px) 28rem, 90vw"
                  className={`transition-opacity duration-500 motion-reduce:transition-none ${
                    cutout ? "object-contain object-center p-8 [filter:drop-shadow(0_16px_20px_rgba(6,21,15,0.18))]" : "object-cover"
                  } ${k === img ? "opacity-100" : "opacity-0"}`}
                />
              );
            })}

            {n > 1 && (
              <>
                <button type="button" onClick={() => go(img - 1)} aria-label="الصورة السابقة" className={`${round} absolute end-3 top-1/2 -translate-y-1/2`}>
                  <svg {...ic} className="h-4 w-4"><path d="m9 5 7 7-7 7" /></svg>
                </button>
                <button type="button" onClick={() => go(img + 1)} aria-label="الصورة التالية" className={`${round} absolute start-3 top-1/2 -translate-y-1/2`}>
                  <svg {...ic} className="h-4 w-4"><path d="m15 5-7 7 7 7" /></svg>
                </button>
                <span className="absolute bottom-3 start-3 rounded-md bg-forest-950/50 px-1.5 py-0.5 text-[0.6875rem] font-medium tabular-nums text-white backdrop-blur" dir="ltr">
                  {img + 1} / {n}
                </span>
              </>
            )}
          </div>

          <ul className="mt-2.5 flex justify-center gap-2.5">
            {GALLERY.map((shot, k) => {
              const cutout = CUTOUTS.has(shot.src);
              return (
                <li key={shot.src}>
                  <button
                    type="button"
                    onClick={() => setImg(k)}
                    aria-label={`عرض الصورة ${k + 1}`}
                    aria-pressed={k === img}
                    className={`relative block h-14 w-14 overflow-hidden rounded-lg bg-white ring-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 sm:h-16 sm:w-16 ${k === img ? "ring-forest-900" : "opacity-70 ring-transparent hover:opacity-100"}`}
                  >
                    <Image src={shot.src} alt="" fill sizes="4rem" className={cutout ? "object-contain p-1.5" : "object-cover"} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Details card */}
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10 sm:p-6">
          <p className="text-xs font-semibold text-gold-500">شامبو ضد التساقط</p>
          <h2 id="product-title" className="mt-1 text-xl font-light leading-tight text-forest-900 sm:text-2xl">{P.name}</h2>
          <p className="mt-1 text-xs text-forest-900/65">{P.size} · بدون سلفات · صنع في المغرب</p>

          <p className="mt-3 text-2xl font-light text-forest-900 sm:text-3xl">{money(P.price)}</p>

          {/* Delivery facts */}
          <ul className="mt-3 grid gap-2 border-y border-forest-900/10 py-3 text-xs text-forest-900/80 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <svg {...ic} strokeWidth={1.8} className="h-4 w-4 flex-none text-gold-500"><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>
              الدفع عند الاستلام
            </li>
            <li className="flex items-center gap-2">
              <svg {...ic} strokeWidth={1.8} className="h-4 w-4 flex-none text-gold-500"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" /></svg>
              التوصيل خلال {DELIVERY_ESTIMATE}
            </li>
          </ul>

          {/* Benefits: plain gold ticks, same as the hero */}
          <ul className="mt-3 space-y-1.5">
            {POINTS.map((t) => (
              <li key={t} className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-forest-900/85">
                <svg {...ic} strokeWidth={2.5} className="mt-0.5 h-4 w-4 flex-none text-gold-500"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                {t}
              </li>
            ))}
          </ul>

          {/* Quantity + add to cart */}
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="flex w-fit items-center rounded-lg border border-forest-900/20 bg-cream" dir="ltr">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="تقليل الكمية" className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-white disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
                <svg {...ic} className="h-4 w-4"><path d="M5 12h14" /></svg>
              </button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} disabled={qty >= MAX_QTY} aria-label="زيادة الكمية" className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-white disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
                <svg {...ic} className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>
              </button>
            </div>
            <AddToCartButton productId={P.id} qty={qty} variant="green" size="lg" className="w-full flex-1 justify-center sm:w-auto" />
          </div>

          <p className="mt-3.5 flex items-start gap-2 text-[0.6875rem] leading-relaxed text-forest-900/65">
            <svg {...ic} className="mt-0.5 h-3.5 w-3.5 flex-none"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" /></svg>
            يُستعمل مرة واحدة في الأسبوع على شعر مبلّل. لا يُستعمل على الشعر الجاف، ولا على الشعر المعالج بالبروتين.
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
        <p className="shrink-0 text-base font-semibold text-forest-900" dir="ltr">{money(P.price)}</p>
        <OrderButton
          tabIndex={visible ? 0 : -1}
          className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-lg bg-forest-900 px-4 text-[0.9375rem] font-semibold text-cream transition hover:bg-forest-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        >
          اطلب الآن
        </OrderButton>
      </div>
    </div>
  );
}