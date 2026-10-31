"use client";

import { useEffect, useRef } from "react";
import { buttonStyles } from "./buttonStyles";
import { DELIVERY_ESTIMATE, RETURNS_PROMISE } from "./products";

// Put the files in /public:
//   /public/videos/hero.mp4          (the Pixabay video, ideally < 4 MB, 1280x720 or 1920x1080)
//   /public/images/hero-poster.jpg   (a screenshot of the first frame, shown while loading)
const VIDEO_SRC = "/videos/hero.mp4";
const POSTER_SRC = "/images/hero-poster.jpg";

const HERO_TRUST = `الدفع عند الاستلام · التوصيل خلال ${DELIVERY_ESTIMATE} · ${RETURNS_PROMISE}`;
const BENEFITS = ["يقوّي بصيلات الشعر", "يقلّل التساقط", "يحفّز نمو الشعر الجديد"];

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Respect "reduce motion": show the poster only, no autoplay
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      v.removeAttribute("autoplay");
    }
  }, []);

  return (
    <section
      id="hero"
      aria-label="شامبو LUMORA ضد تساقط الشعر"
      className="relative isolate overflow-hidden bg-black"
    >
      {/* 75svh = three quarters of the screen height (svh handles mobile browser bars) */}
      <div className="relative h-[75svh] min-h-[540px]">
        {/* Background video.
            -scale-x-100 mirrors the clip so the model sits on the LEFT and the Arabic text on the RIGHT (RTL).
            The video has no text in it, so mirroring is safe. Remove the class if you prefer the original side. */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full -scale-x-100 object-cover object-center"
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />

        {/* Black overlay: overall dimming + stronger on the text side so the white background never glares */}
        <div aria-hidden className="absolute inset-0 bg-black/45" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent" />
        {/* soft fade into the next section */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Content (right side in RTL) */}
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-12 pt-40 sm:px-12 sm:pb-16 lg:px-20">
          <div className="max-w-lg">
            <h1 className="text-3xl leading-[1.3] text-white sm:text-4xl lg:text-5xl">
              <span className="block font-light">جذور أقوى،</span>
              <span className="block font-semibold">شعر أكثر كثافة.</span>
            </h1>

            <ul className="mt-4 space-y-1.5" aria-label="فوائد المنتج">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm font-medium text-white sm:text-base">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none text-gold-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#product"
                className={buttonStyles({ variant: "gold", size: "lg", className: "group" })}
              >
                اطلب شامبو LUMORA الآن
              </a>
              <a
                href="#comment-ca-marche"
                className="inline-flex h-12 items-center  px-4 text-base font-semibold text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
              >
                اكتشف التركيبة
              </a>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-white/80 sm:text-sm">{HERO_TRUST}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
