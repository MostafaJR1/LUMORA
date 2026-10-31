"use client";

import { useState } from "react";
import Image from "next/image";
import { buttonStyles } from "./buttonStyles";
import { Reveal } from "./Motion";
import { U, IMG } from "./MediaMock";

/*
  MOCK DATA. The "before" image is the same photo with a dull filter, only to demo the slider.
  Replace `before` and `after` with REAL photos of the same person, same light and angle,
  published with their written consent. Results must be documented and not exaggerated.
*/
const CASES = [
  { name: "سلمى ب.", city: "الدار البيضاء", weeks: 4, before: IMG.hero, after: IMG.hero, note: "شامبو LUMORA مرة في الأسبوع" },
  { name: "نادية ك.", city: "الرباط", weeks: 8, before: IMG.ugc[0], after: IMG.ugc[0], note: "شامبو LUMORA مرة في الأسبوع" },
  { name: "ليلى م.", city: "مراكش", weeks: 12, before: IMG.ugc[1], after: IMG.ugc[1], note: "شامبو LUMORA مرة في الأسبوع" },
];

const BEFORE_FILTER = "grayscale(0.55) contrast(0.85) brightness(0.92) saturate(0.6)";
const AFTER_FILTER = "saturate(1.08) brightness(1.04)";

export default function BeforeAfter({ buyUrl }: { buyUrl: string }) {
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState(50);
  const c = CASES[idx];

  return (
    <section aria-labelledby="ba-title" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold text-gold-500">قبل وبعد</p>
          <h2 id="ba-title" className="text-3xl font-semibold text-forest-900 sm:text-4xl">شاهد الفرق بنفسك</h2>
          <p className="mt-3 text-forest-900/70">اسحب الخط للمقارنة بين الصورتين، واختر تجربة لتعرف مدة الاستعمال.</p>
        </Reveal>

        <Reveal className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Slider (LTR inside so "before" is always left) */}
          <div dir="ltr" className="relative mx-auto aspect-[4/5] w-full max-w-md select-none overflow-hidden rounded-3xl bg-forest-900/10 shadow-xl ring-1 ring-forest-900/10 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-gold-500">
            <Image src={U(c.after, 900)} alt={`${c.name} بعد ${c.weeks} أسابيع`} fill unoptimized sizes="(min-width: 640px) 448px, 100vw" draggable={false} style={{ filter: AFTER_FILTER }} className="object-cover" />
            <Image
              src={U(c.before, 900)}
              alt={`${c.name} قبل الاستعمال`}
              fill
              unoptimized
              sizes="(min-width: 640px) 448px, 100vw"
              draggable={false}
              style={{ filter: BEFORE_FILTER, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              className="object-cover"
            />

            <span className="absolute start-3 top-3 rounded-full bg-forest-950/75 px-3 py-1 text-sm font-semibold text-cream backdrop-blur">قبل</span>
            <span className="absolute end-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-sm font-semibold text-forest-950">بعد {c.weeks} أسابيع</span>

            {/* Divider + knob */}
            <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow" style={{ left: `${pos}%` }}>
              <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-forest-900 shadow-lg ring-1 ring-forest-900/10">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
                </svg>
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="اسحب للمقارنة بين قبل وبعد"
              aria-valuetext={`${pos}% من صورة قبل`}
              className="absolute inset-0 h-full w-full cursor-ew-resize touch-pan-y appearance-none opacity-0"
            />
          </div>

          {/* Details */}
          <div>
            <div role="tablist" aria-label="التجارب" className="flex flex-wrap gap-2">
              {CASES.map((x, k) => (
                <button
                  key={x.name}
                  role="tab"
                  type="button"
                  aria-selected={k === idx}
                  onClick={() => { setIdx(k); setPos(50); }}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${k === idx ? "border-forest-900 bg-forest-900 text-cream" : "border-forest-900/20 text-forest-900 hover:border-forest-900/50"}`}
                >
                  {x.weeks} أسابيع
                </button>
              ))}
            </div>

            <div role="tabpanel" className="mt-6">
              <h3 className="text-2xl font-semibold text-forest-900">{c.name} <span className="text-base font-normal text-forest-900/55">· {c.city}</span></h3>
              <dl className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-cream p-4">
                  <dt className="text-sm text-forest-900/60">مدة الاستعمال</dt>
                  <dd className="mt-1 text-lg font-semibold text-forest-900">{c.weeks} أسابيع</dd>
                </div>
                <div className="rounded-2xl bg-cream p-4">
                  <dt className="text-xs text-forest-900/60">الروتين</dt>
                  <dd className="mt-1 text-base font-semibold leading-snug text-forest-900">{c.note}</dd>
                </div>
              </dl>
              <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-forest-900/60">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 flex-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
                النتائج تختلف من شخص لآخر حسب نوع الشعر وانتظام الاستعمال.
              </p>
              <a href={buyUrl} className={buttonStyles({ variant: "green", size: "lg", className: "mt-7" })}>
                ابدأ روتينك الآن
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}