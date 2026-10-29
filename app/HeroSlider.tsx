"use client";

import { useCallback, useEffect, useState } from "react";
import { buttonStyles } from "./buttonStyles";
import { U, IMG } from "./MediaMock";
import { DELIVERY_ESTIMATE, RETURNS_PROMISE } from "./products";

// MOCK slides: replace the images (media.ts) with real product banners (wide, product on the left side).
const SLIDES = [
  { tag: "ضد التساقط", l1: "خفّفي تساقط الشعر،", l2: "بلطف.", description: "تركيبة خالية من السلفات تنظّف فروة الرأس بلطف وتدعم روتين العناية بشعرك.", cta: "اطلب الآن", href: "#product", img: IMG.shampoo, alt: "شامبو LUMORA ضد تساقط الشعر" },
  { tag: "بدون سلفات", l1: "تنظيف لطيف،", l2: "فروة رأس مرتاحة.", cta: "اكتشف التركيبة", href: "#comment-ca-marche", img: IMG.hero, alt: "شعر لامع بعد استعمال الشامبو" },
  { tag: "صنع في المغرب", l1: "مكونات طبيعية،", l2: "روتين بسيط.", cta: "اعثر على روتينك", href: "#routines", img: IMG.routine, alt: "منتجات LUMORA للعناية بالشعر" },
];

const chevron = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, className: "h-5 w-5" };
const HERO_TRUST = `الدفع عند الاستلام · التوصيل خلال ${DELIVERY_ESTIMATE} · ${RETURNS_PROMISE}`;

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = SLIDES.length;
  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((p) => (p + 1) % n), 6000);
    return () => clearInterval(id);
  }, [paused, n]);

  const arrow = "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest-900 text-cream shadow-md transition hover:bg-forest-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500";

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="العروض الرئيسية"
      className="relative isolate overflow-hidden bg-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative h-[420px] sm:h-[440px] lg:h-[480px]">
        {SLIDES.map((s, k) => {
          const active = k === i;
          const Heading = k === 0 ? "h1" : "h2"; // one h1 per page
          return (
            <div
              key={s.tag}
              role="group"
              aria-roledescription="slide"
              aria-label={`${k + 1} / ${n}`}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              {/* Banner photo: product sits on the left, text on the right (RTL) */}
              <img
                src={U(s.img, 1800)}
                alt={s.alt}
                width={1800}
                height={900}
                loading={k === 0 ? "eager" : "lazy"}
                fetchPriority={k === 0 ? "high" : "auto"}
                className="absolute inset-0 h-full w-full object-cover object-left"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-l from-forest-950/95 via-forest-950/80 to-forest-900/60" />

              <div className="relative mx-auto flex h-full max-w-7xl items-center px-14 sm:px-20">
                <div className="max-w-md">
                  <span className="inline-flex items-center rounded-full border border-gold-300/50 bg-forest-950/70 px-4 py-1.5 text-sm font-semibold text-cream backdrop-blur">
                    {s.tag}
                  </span>
                  <Heading className="mt-4 text-3xl leading-[1.25] text-cream sm:text-4xl lg:text-5xl">
                    <span className="block font-light">{s.l1}</span>
                    <span className="block font-semibold">{s.l2}</span>
                  </Heading>
                  {"description" in s && (
                    <p className="mt-3 max-w-md text-base leading-relaxed text-cream/95">
                      {s.description}
                    </p>
                  )}
                  <a
                    href={s.href}
                    tabIndex={active ? 0 : -1}
                    className={buttonStyles({ variant: "green", size: "lg", className: "group mt-6" })}
                  >
                    {s.cta}
                  </a>
                  {k === 0 && (
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/95">
                      {HERO_TRUST}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Arrows: in RTL "next" is on the left */}
        <button type="button" onClick={() => go(i - 1)} aria-label="الشريحة السابقة" className={`${arrow} end-3 sm:end-5`}>
          <svg {...chevron}><path d="m9 5 7 7-7 7" /></svg>
        </button>
        <button type="button" onClick={() => go(i + 1)} aria-label="الشريحة التالية" className={`${arrow} start-3 sm:start-5`}>
          <svg {...chevron}><path d="m15 5-7 7 7 7" /></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {SLIDES.map((s, k) => (
            <button
              key={s.tag}
              type="button"
              onClick={() => go(k)}
              aria-label={`الانتقال إلى الشريحة ${k + 1}`}
              aria-current={k === i}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 before:block before:h-2 before:rounded-full before:transition-all ${k === i ? "before:w-6 before:bg-cream" : "before:w-2 before:bg-cream/50 hover:before:bg-cream"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
