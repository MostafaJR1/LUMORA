"use client";

import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "./Motion";
import { AddToCartButton } from "./cart";
import { DELIVERY_ESTIMATE, RETURNS_PROMISE } from "./products";

/* =====================  INGREDIENTS (editorial, no icons, no stat band)  =====================
   Add a real photo per ingredient when you have one: photo: "/images/argan.jpg"
   (square, ~600px). Rows without a photo stay clean text. */
const INGREDIENTS: { name: string; photo?: string }[] = [
  { name: "زيت أزير" },
  { name: "جل الصبار" },
  { name: "برو فيتامين B5" },
  { name: "بودرة البصل" },
  { name: "جنسينغ" },
];

export function Ingredients() {
  return (
    <section aria-labelledby="results-title" className="overflow-hidden bg-forest-950 py-16 text-cream sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <h2 id="results-title" className="text-4xl font-light leading-[1.2] sm:text-5xl lg:text-6xl">
            خمسة مكونات.
            <span className="block font-semibold text-gold-300">لا أكثر.</span>
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-cream/75">
            كل ما في الزجاجة مكتوب على الملصق. بدون سلفات، وبلا قائمة طويلة من الأسماء الغريبة.
          </p>
          <p className="mt-6 text-sm text-cream/55">150 مل · مرة واحدة في الأسبوع · صنع في المغرب</p>
        </Reveal>

        <RevealGroup as="ol" className="border-t border-white/15" aria-label="المكونات">
          {INGREDIENTS.map((it, i) => (
            <RevealItem
              key={it.name}
              as="li"
              className="group flex items-center gap-5 border-b border-white/15 py-6 transition-colors hover:border-gold-400/60 sm:gap-8 sm:py-8"
            >
              <span className="w-8 flex-none text-sm font-medium tabular-nums text-gold-400" dir="ltr">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-3xl font-light transition-transform duration-300 group-hover:-translate-x-1 sm:text-4xl motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                {it.name}
              </span>
              {it.photo && (
                <Image
                  src={it.photo}
                  alt=""
                  width={80}
                  height={80}
                  className="h-16 w-16 flex-none  object-cover sm:h-20 sm:w-20"
                />
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* =====================  ORDER STEPS (3 plain steps, no cards, no icons)  ===================== */
const STEPS = [
  { t: "اطلب من الموقع", d: "اختر المنتج وأرسل طلبك في دقيقة." },
  { t: "نتصل بك للتأكيد", d: "نؤكد معك معلوماتك قبل تجهيز الطلب." },
  { t: "استلم وادفع", d: `التوصيل خلال ${DELIVERY_ESTIMATE}، والدفع عند الاستلام.` },
];

export function QuickSteps() {
  return (
    <section aria-labelledby="order-title" className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 id="order-title" className="text-2xl font-semibold text-forest-900 sm:text-3xl">كيف تطلب؟</h2>
        </Reveal>
        <RevealGroup as="ol" className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {STEPS.map((s, i) => (
            <RevealItem key={s.t} as="li" className="border-t-1 border-neutral-500/50 pt-4">
              <span className="text-sm font-semibold text-gold-500" dir="ltr">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold text-forest-900">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-forest-900/70">{s.d}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* =====================  CLOSING CTA (plain, text only, nothing overlapping)  ===================== */
export function ClosingCTA() {
  return (
    <section aria-label="اطلب الآن" className="bg-forest-900 py-16 text-center text-cream sm:py-20">
      <Reveal className="mx-auto max-w-2xl px-5">
        <h2 className="text-3xl font-light leading-tight sm:text-4xl">
          جرّبه لمدة أسبوع،
          <span className="block font-semibold">واحكم بنفسك.</span>
        </h2>
        <p className="mt-4 text-cream/75">شامبو LUMORA ضد التساقط · 150 مل · بدون سلفات</p>
        <div className="mt-7 flex justify-center">
          <AddToCartButton productId="lumora-shampoo-150" variant="gold" size="lg" className="flex-none" />
        </div>
        <p className="mt-5 text-sm text-cream/65">
          الدفع عند الاستلام · التوصيل خلال {DELIVERY_ESTIMATE} · {RETURNS_PROMISE}
        </p>
      </Reveal>
    </section>
  );
}
