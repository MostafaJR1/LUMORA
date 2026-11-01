"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Image from "next/image";
import ScrollToTop from "./ScrollToTop";
import { CartProvider, CartButton } from "./cart";
import CartDrawer from "./CartDrawer";
import ProductSection from "./Product";
import StickyCTA from "./StickyCTA";
import { OrderProvider, OrderButton } from "./OrderProvider";
import { HowItWorks } from "./Proof";
import { Ingredients, QuickSteps, ClosingCTA } from "./LumoraSections";
import { SHOTS } from "./Productshots"; // ← product photos (see /public/images)
import { DELIVERY_ESTIMATE } from "./products";

/* =====================  HEADER  ===================== */
const icon = "h-5 w-5 stroke-current fill-none stroke-[1.6]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400";
const shadow = "[text-shadow:0_1px_10px_rgba(0,0,0,0.45)]";

// Every href points to a section that exists on the page
const MENU = [
  { label: "المنتج", href: "#product" },
  { label: "المكونات", href: "#results-title" },
  { label: "طريقة الاستعمال", href: "#comment-ca-marche" },
  { label: "كيف تطلب؟", href: "#order-title" },
];
// Links whose href is still "#" are hidden automatically (a dead link only scrolls to the top).
// Put a real URL (page, WhatsApp link, social account) and the link appears by itself.
const NAV = [
  { label: "نصائح", href: "#" },
  { label: "من نحن", href: "#" },
  { label: "المساعدة والتواصل", href: "#" },
];
const LIVE_NAV = NAV.filter((l) => l.href !== "#");

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (document.body.style.position === "fixed") return; // cart drawer is open (page is frozen)
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu with Escape and give focus back to the menu button
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const scrollToMenuSection = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setOpen(false);

    const section = document.querySelector<HTMLElement>(href);
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
    window.history.replaceState(null, "", href);
  };

  const glass = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      {/* Tap anywhere outside the menu to close it */}
      {open && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="إغلاق القائمة"
          onClick={() => setOpen(false)}
          className="fixed inset-0 -z-10 cursor-default"
        />
      )}

      {/* Announcement bar: translucent, collapses on scroll */}
      <div
        className={`overflow-hidden bg-forest-950/70 text-sm font-medium text-cream backdrop-blur-[1px] transition-[max-height,opacity] duration-300 motion-reduce:transition-none sm:text-xs ${
          scrolled ? "max-h-0 opacity-0" : "max-h-8 opacity-100"
        }`}
      >
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-center gap-4 px-4 sm:justify-between">
          <span className="hidden sm:inline">صنع في المغرب</span>
          <span>
            <span className="me-2 rounded-sm bg-gold-400 px-1.5 py-0.5 font-bold text-forest-950">جديد</span>
            وصل شامبو LUMORA ضد تساقط الشعر
          </span>
          <span className="hidden sm:inline">بدون سلفات</span>
        </div>
      </div>

      {/* Floating bar: fully transparent at the top, frosted glass after scrolling */}
      <div className="relative mx-auto max-w-7xl px-2 pt-2 sm:px-4">
        <div
          className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-xl border px-3 transition-all duration-300 motion-reduce:transition-none sm:px-5 ${
            scrolled ? "h-14" : "h-16"
          } ${
            glass
              ? "border-white/15 bg-forest-950/55 shadow-lg shadow-black/20 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          {/* Start side: menu */}
          <div className="flex items-center gap-3">
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              className={`flex h-11 items-center gap-2 text-sm font-semibold ${shadow} ${focus}`}
            >
              <svg viewBox="0 0 24 24" className={icon} aria-hidden strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 7h18M3 12h18M3 17h12" />}
              </svg>
              <span className="hidden sm:inline">القائمة</span>
            </button>
          </div>

          {/* Logo */}
          <a
            href="#top"
            dir="ltr"
            className={`flex h-11 items-center text-xl font-semibold tracking-[0.32em] sm:text-2xl ${shadow} ${focus}`}
            aria-label="LUMORA، الصفحة الرئيسية"
          >
            LUM<span className="text-gold-400">O</span>RA
          </a>

          {/* End side: nav + order button + cart */}
          <div className={`flex items-center justify-end gap-4 text-sm font-medium ${shadow}`}>
            {LIVE_NAV.length > 0 && (
              <nav className="hidden items-center gap-5 xl:flex" aria-label="التنقل الثانوي">
                {LIVE_NAV.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className={`relative py-3 transition-colors hover:text-gold-300 after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-center after:scale-x-0 after:bg-gold-400 after:transition-transform hover:after:scale-x-100 motion-reduce:after:transition-none ${focus}`}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            )}
            <OrderButton
              className={`hidden min-h-10 cursor-pointer items-center rounded-lg bg-gold-400 px-5 font-bold text-forest-950 transition-colors hover:bg-gold-300 [text-shadow:none] sm:inline-flex ${focus}`}
            >
              اطلب الآن
            </OrderButton>
            <CartButton />
          </div>
        </div>

        {/* Dropdown menu (glass) */}
        <nav
          id="site-menu"
          aria-label="القائمة الرئيسية"
          className={`absolute inset-x-2 top-full mt-2 origin-top overflow-hidden rounded-xl border border-white/15 bg-forest-950/90 shadow-xl backdrop-blur-xl transition duration-200 motion-reduce:transition-none sm:inset-x-4 sm:end-auto sm:w-72 ${
            open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
          }`}
        >
          <ul className="p-2">
            {MENU.map((m) => (
              <li key={m.label}>
                <a
                  href={m.href}
                  onClick={(event) => scrollToMenuSection(event, m.href)}
                  tabIndex={open ? 0 : -1}
                  className={`flex min-h-11 items-center justify-between rounded-lg px-4 text-[0.9375rem] font-medium text-cream transition-colors hover:bg-white/10 hover:text-gold-300 ${focus}`}
                >
                  {m.label}
                </a>
              </li>
            ))}
          </ul>
          {LIVE_NAV.length > 0 && (
            <ul className="border-t border-white/10 p-2 xl:hidden">
              {LIVE_NAV.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className={`flex min-h-11 items-center rounded-lg px-4 text-sm text-cream/80 transition-colors hover:bg-white/10 hover:text-gold-300 ${focus}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}

/* =====================  HERO (looping video)  ===================== */
// Put the two videos in /public/videos and the first frame of each in /public/images (JPG, used as poster).
const HERO = {
  desktop: { src: "/videos/hero.mp4", poster: "/images/hero-desktop-poster.jpg" }, // 16:9
  mobile: { src: "/videos/hero-mobile.mp4", poster: "/images/hero-mobile-poster.jpg" }, // 9:16
};

function useMatch(query: string) {
  const [match, setMatch] = useState<boolean | null>(null); // null until the browser has answered
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

function Hero() {
  const isDesktop = useMatch("(min-width: 768px)");
  const reduceMotion = useMatch("(prefers-reduced-motion: reduce)");
  const media = isDesktop ? HERO.desktop : HERO.mobile;

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] overflow-hidden bg-forest-950 text-white">
      {/* Background video: loops forever, muted, no controls, so there is no timeline */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {isDesktop === null || reduceMotion ? (
          // Before the browser answers (or if the visitor prefers less motion): poster image only
          <Image src={(isDesktop ? HERO.desktop : HERO.mobile).poster} alt="" fill priority sizes="100vw" className="object-cover" />
        ) : (
          <video
            key={media.src}
            ref={(el) => {
              if (el) {
                el.muted = true; // some browsers ignore the attribute, and autoplay needs it
                el.play()?.catch(() => {});
              }
            }}
            className="h-full w-full object-cover"
            src={media.src}
            poster={media.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
            disablePictureInPicture
            controlsList="nodownload noremoteplayback nofullscreen"
          />
        )}
      </div>

      {/* Readability overlay: dark on the text side, lighter over the model */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-950/65 via-forest-950/10 to-forest-950/70 md:bg-gradient-to-l md:from-forest-950/80 md:via-forest-950/25 md:to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-between px-5 pb-8 pt-28 sm:px-8 md:justify-center md:gap-8 md:pb-0 md:pt-32">
        <div className="md:max-w-md">
          <h1 id="hero-title" className="text-3xl font-light leading-snug sm:text-4xl md:text-5xl md:leading-tight">
            شامبو <span className="font-semibold">LUMORA</span> ضد تساقط الشعر
          </h1>
          <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-cream/90 sm:text-base">
            تركيبة بدون سلفات بخمسة مكونات طبيعية، صُنعت في المغرب.
          </p>
        </div>

        <div className="md:max-w-md">
          <div className="flex flex-col gap-3 sm:flex-row">
            <OrderButton
              className={`inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg bg-gold-400 px-8 text-[0.9375rem] font-bold text-forest-950 transition-colors hover:bg-gold-300 ${focus}`}
            >
              اطلب الآن
            </OrderButton>
            <a
              href="#results-title"
              className={`inline-flex min-h-12 items-center justify-center rounded-lg border border-white/50 px-8 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-white/10 ${focus}`}
            >
              اكتشف المكونات
            </a>
          </div>
          <p className="mt-3 text-[0.8125rem] text-cream/85">
            الدفع عند الاستلام · التوصيل خلال {DELIVERY_ESTIMATE}
          </p>
        </div>
      </div>
    </section>
  );
}

/* =====================  REAL RESULTS (before / after)  ===================== */
// Use ONLY real photos of real customers (with their written consent), taken at the same angle and in the
// same light. Export every image in 4:5 portrait (1200 x 1500 px, JPG or WebP) and put them in /public/results.
// While this list is empty the whole section stays hidden.
type Result = { before: string; after: string; alt: string; caption: string };
const RESULTS: Result[] = [
  // {
  //   before: "/results/01-before.jpg",
  //   after: "/results/01-after.jpg",
  //   alt: "فروة رأس زبونة من LUMORA",
  //   caption: "بعد 8 أسابيع من الاستعمال المنتظم",
  // },
];

function Compare({ item }: { item: Result }) {
  const [pos, setPos] = useState(50);
  return (
    <figure>
      {/* dir="ltr": the slider is physical. "After" is on the left, "Before" on the right (reads right to left in Arabic) */}
      <div dir="ltr" className="relative aspect-[4/5] select-none overflow-hidden rounded-xl bg-forest-950/5 ring-1 ring-forest-950/10">
        <Image src={item.before} alt={`${item.alt}، قبل`} fill sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={item.after} alt={`${item.alt}، بعد`} fill sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw" className="object-cover" />
        </div>

        <span className="absolute start-3 top-3 rounded-md bg-forest-950/70 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">بعد</span>
        <span className="absolute end-3 top-3 rounded-md bg-forest-950/70 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">قبل</span>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-forest-950 shadow-md">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 7-5 5 5 5M15 7l5 5-5 5" /></svg>
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="حرّك للمقارنة بين قبل وبعد"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          style={{ touchAction: "pan-y" }}
        />
      </div>
      <figcaption className="mt-2 text-[0.8125rem] text-forest-800">{item.caption}</figcaption>
    </figure>
  );
}

function Results() {
  if (RESULTS.length === 0) return null;
  return (
    <section id="real-results" aria-labelledby="real-results-title" className="scroll-mt-28 bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 id="real-results-title" className="text-2xl font-semibold text-forest-950 sm:text-3xl">
          نتائج زبائننا
        </h2>
        <p className="mt-2 max-w-xl text-[0.9375rem] text-forest-800">
          صور حقيقية نُشرت بموافقة أصحابها. تختلف النتائج من شخص لآخر.
        </p>
        <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(16rem,22rem))] justify-center gap-5">
          {RESULTS.map((r) => (
            <Compare key={r.before} item={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================  TRUST BAR  ===================== */
// Reassurance row (inspired by the "guarantee / delivery / payment / support" strips on Cheveux Boost).
// Only list what you REALLY offer. Add extra promises (refund policy, WhatsApp support...) in EXTRA_TRUST.
const EXTRA_TRUST: { title: string; text: string }[] = [];

const TRUST_ITEMS = [
  {
    title: "الدفع عند الاستلام",
    text: "لا تدفع شيئًا قبل أن يصلك طلبك.",
    paths: ["M3 6h18v12H3z", "M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"],
  },
  {
    title: `التوصيل خلال ${DELIVERY_ESTIMATE}`,
    text: "نوصّل طلبك إلى عنوانك.",
    paths: ["M3 7h11v9H3z", "M14 10h4l3 3v3h-7z", "M7 16.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z", "M17 16.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"],
  },
  {
    title: "صنع في المغرب",
    text: "ملصق بالعربية والفرنسية على العبوة.",
    paths: ["M5 19c0-8 5-13 14-14 0 9-5 14-13 14z", "M5 19l8-8"],
  },
  {
    title: "بدون سلفات",
    text: "بزيت إكليل الجبل والصبار والجينسنغ.",
    paths: ["M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"],
  },
];

function TrustBar() {
  const items = [
    ...TRUST_ITEMS,
    ...EXTRA_TRUST.map((e) => ({ ...e, paths: ["m5 12.5 4.5 4.5L19 7.5"] })),
  ];
  return (
    <section aria-label="لماذا تطلب من LUMORA" className="border-b border-forest-950/10 bg-cream">
      <ul className="mx-auto grid max-w-7xl gap-x-6 gap-y-5 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {items.map((it) => (
          <li key={it.title} className="flex items-start gap-3">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-forest-950 text-gold-300">
              <svg viewBox="0 0 24 24" className={icon} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {it.paths.map((d) => (
                  <path key={d} d={d} />
                ))}
              </svg>
            </span>
            <div>
              <p className="text-[0.9375rem] font-bold leading-snug text-forest-950">{it.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-forest-800">{it.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* =====================  REVIEWS  ===================== */
// Customer reviews build trust (see "Nos clients en parlent mieux que nous" on Lashilé).
// Add ONLY real reviews from real customers. While the list is empty the section stays hidden.
type Review = { name: string; city: string; text: string };
const REVIEWS: Review[] = [
  // { name: "اسم الزبونة", city: "الدار البيضاء", text: "نص رأيها الحقيقي هنا." },
];

function Reviews() {
  if (REVIEWS.length === 0) return null;
  return (
    <section aria-labelledby="reviews-title" className="bg-cream py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 id="reviews-title" className="text-2xl font-semibold text-forest-950 sm:text-3xl">
          آراء زبائننا
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <li key={r.name + r.text} className="rounded-xl border border-forest-950/10 bg-white p-5">
              <blockquote className="text-[0.9375rem] leading-relaxed text-forest-950">{r.text}</blockquote>
              <p className="mt-4 text-sm font-semibold text-forest-800">
                {r.name} · {r.city}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* =====================  FOOTER  ===================== */
// ← Replace the "#" with your real pages and social accounts.
// Links still set to "#" are hidden automatically, and empty columns disappear.
const FOOTER_COLUMNS = [
  {
    title: "تسوق",
    links: [
      { label: "المنتج", href: "#product" },
      { label: "طريقة الاستعمال", href: "#comment-ca-marche" },
      { label: "المكونات", href: "#results-title" },
    ],
  },
  {
    title: "معلومات",
    links: [
      { label: "من نحن", href: "#" },
      { label: "نصائح", href: "#" },
      { label: "المساعدة والتواصل", href: "#" },
      { label: "الشروط العامة للبيع", href: "#" },
      { label: "سياسة الخصوصية", href: "#" },
    ],
  },
  {
    title: "تابعنا",
    links: [
      { label: "تيك توك", href: "#" },
      { label: "إنستغرام", href: "#" },
      { label: "فيسبوك", href: "#" },
    ],
  },
];

// Put your WhatsApp link here, e.g. "https://wa.me/212600000000". Empty = button hidden.
const WHATSAPP_URL: string = "";

function Footer() {
  const link =
    "inline-flex min-h-11 items-center text-sm text-cream/80 transition hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400";
  const columns = FOOTER_COLUMNS.map((c) => ({
    ...c,
    links: c.links.filter((l) => l.href !== "#"),
  })).filter((c) => c.links.length > 0);

  return (
    <footer className="bg-forest-950 text-cream">
      {/* photo strip: bottle base + reflection, fading into the footer */}
      <div aria-hidden className="relative h-16 overflow-hidden sm:h-24">
        <Image src={SHOTS.bottleFront.src} alt="" fill sizes="100vw" className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest-950/30 to-forest-950" />
      </div>

      <div
        className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:[grid-template-columns:var(--cols)]"
        style={{ "--cols": `1.4fr repeat(${columns.length}, 1fr)` } as CSSProperties}
      >
        <div>
          <a
            href="#top"
            dir="ltr"
            className="inline-flex min-h-11 items-center text-xl font-semibold tracking-[0.32em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
            aria-label="LUMORA، الصفحة الرئيسية"
          >
            LUM<span className="text-gold-400">O</span>RA
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
            شامبو ضد تساقط الشعر بمكونات طبيعية وبدون سلفات، صنع في المغرب.
          </p>
          <p className="mt-4 text-sm text-cream/70">
            الدفع عند الاستلام · التوصيل خلال {DELIVERY_ESTIMATE}
          </p>
          {WHATSAPP_URL && (
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-gold-400 px-4 text-sm font-semibold text-gold-300 transition hover:bg-gold-400 hover:text-forest-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
            >
              تواصل معنا عبر واتساب
            </a>
          )}
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-3 text-sm font-semibold text-gold-300">{col.title}</h2>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={link}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl space-y-2 px-5 py-6 text-center text-xs leading-relaxed text-cream/65 sm:px-8 md:text-start">
          <p>© 2026 LUMORA. جميع الحقوق محفوظة.</p>
          {/* The old text quoted the US FDA, which does not apply to a Moroccan store. Check the final wording with your own legal advice. */}
          <p>
            هذا المنتج مستحضر تجميل للاستعمال الخارجي، والمعلومات المعروضة لأغراض إعلامية فقط.
            تختلف النتائج من شخص لآخر. استشر طبيبك إذا كنت تعاني من مشكلة صحية في فروة الرأس.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* =====================  PAGE  ===================== */
export default function Page() {
  return (
    <div id="top" dir="rtl" lang="ar">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-gold-400 focus:px-4 focus:py-2 focus:font-bold focus:text-forest-950"
      >
        تخطَّ إلى المحتوى
      </a>
      <CartProvider>
        <OrderProvider>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <TrustBar />
          <HowItWorks />
          <Ingredients />
          <Results />
          <ProductSection />
          <QuickSteps />
          <Reviews />
          <ClosingCTA />
        </main>
        <Footer />
        <CartDrawer />
        <StickyCTA />
        <ScrollToTop />
        </OrderProvider>
      </CartProvider>
    </div>
  );
}