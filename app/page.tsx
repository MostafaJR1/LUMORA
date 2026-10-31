"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import HeroVideo from "./HeroVideo";
// import BeforeAfter from "./Beforeafter"; // ← hidden until you have REAL customer results
import ScrollToTop from "./ScrollToTop";
import { CartProvider, CartButton } from "./cart";
import CartDrawer from "./CartDrawer";
import ProductSection from "./Product";
import StickyCTA from "./StickyCTA";
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
            <a
              href="#product"
              className={`hidden min-h-10 items-center rounded-lg bg-gold-400 px-5 font-bold text-forest-950 transition-colors hover:bg-gold-300 [text-shadow:none] sm:inline-flex ${focus}`}
            >
              اطلب الآن
            </a>
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
                  onClick={() => setOpen(false)}
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
        <Image src={SHOTS.marbleLifestyle.src} alt="" fill sizes="100vw" className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest-950/30 to-forest-950" />
      </div>

      <div
        className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:[grid-template-columns:var(--cols)]"
        style={{ "--cols": `1.4fr repeat(${columns.length}, 1fr)` } as React.CSSProperties}
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
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          <HeroVideo />
          <HowItWorks />
          <Ingredients />
          <ProductSection />
          {/* <BeforeAfter buyUrl="#product" />  ← show only with REAL customer photos and results */}
          <QuickSteps />
          <ClosingCTA />
        </main>
        <Footer />
        <CartDrawer />
        <StickyCTA />
        <ScrollToTop />
      </CartProvider>
    </div>
  );
}