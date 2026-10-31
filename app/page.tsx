"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { Reveal } from "./Motion";
import { buttonStyles } from "./buttonStyles";
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

const svgProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

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
const NAV = [
  { label: "نصائح", href: "#" },
  { label: "من نحن", href: "#" },
  { label: "المساعدة والتواصل", href: "#" },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (document.body.style.position === "fixed") return; // cart drawer is open (page is frozen)
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const glass = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      {/* Announcement bar: translucent, collapses on scroll */}
      <div
        className={`overflow-hidden bg-forest-950/40 text-sm font-medium text-cream backdrop-blur-[1px] transition-[max-height,opacity] duration-300 motion-reduce:transition-none sm:text-xs ${
          scrolled ? "max-h-0 opacity-0" : "max-h-8 opacity-100"
        }`}
      >
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-center gap-4 px-4 sm:justify-between">
          <span className="hidden sm:inline">صنع في المغرب</span>
          <span>
            <span className="ms-2  bg-gold-400 px-1.5 py-0.5 font-bold text-forest-950">جديد</span>
            وصل شامبو LUMORA ضد تساقط الشعر
          </span>
          <span className="hidden sm:inline">بدون سلفات</span>
        </div>
      </div>

      {/* Floating bar: fully transparent at the top, frosted glass after scrolling */}
      <div className="relative mx-auto max-w-7xl px-2 pt-2 sm:px-4">
        <div
          className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4  border px-3 transition-all duration-300 motion-reduce:transition-none sm:px-5 ${
            scrolled ? "h-14" : "h-16"
          } ${
            glass
              ? "border-white/15 bg-forest-950/55 shadow-lg shadow-black/20 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          {/* Start side: menu + search */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              className={`flex h-11 items-center gap-2  text-sm font-semibold ${shadow} ${focus}`}
            >
              <svg viewBox="0 0 24 24" className={icon} aria-hidden strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 7h18M3 12h18M3 17h12" />}
              </svg>
              <span className="hidden sm:inline">القائمة</span>
            </button>

            <label className="relative hidden w-56 lg:block">
              <span className="sr-only">ابحث في الموقع</span>
              <input
                type="search"
                placeholder="ابحث في الموقع"
                className={`h-10 w-full  border border-white/25 bg-white/10 px-4 pe-10 text-sm text-white outline-none backdrop-blur transition-colors placeholder:text-white/70 focus:border-gold-400 focus:bg-white/15 ${focus}`}
              />
              <svg viewBox="0 0 24 24" className={`${icon} pointer-events-none absolute end-3 top-2.5 text-white/80`} aria-hidden>
                <circle cx="11" cy="11" r="6.5" />
                <path d="m20 20-4.2-4.2" strokeLinecap="round" />
              </svg>
            </label>
          </div>

          {/* Logo */}
          <a
            href="#top"
            dir="ltr"
            className={`flex h-11 items-center text-2xl font-semibold tracking-[0.32em] ${shadow} ${focus}`}
            aria-label="LUMORA، الصفحة الرئيسية"
          >
            LUM<span className="text-gold-400">O</span>RA
          </a>

          {/* End side: nav + account + cart */}
          <div className={`flex items-center justify-end gap-5 text-sm font-medium ${shadow}`}>
            <nav className="hidden items-center gap-5 xl:flex" aria-label="التنقل الثانوي">
              {NAV.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className={`relative py-3 transition-colors hover:text-gold-300 after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-center after:scale-x-0 after:bg-gold-400 after:transition-transform hover:after:scale-x-100 motion-reduce:after:transition-none ${focus}`}
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <a href="#" aria-label="حسابي" className={`hidden h-11 w-11 items-center justify-center  transition-colors hover:bg-white/10 sm:flex ${focus}`}>
              <svg viewBox="0 0 24 24" className={icon} aria-hidden>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" strokeLinecap="round" />
              </svg>
            </a>
            <CartButton />
          </div>
        </div>

        {/* Dropdown menu (glass) */}
        <nav
          id="site-menu"
          aria-label="القائمة الرئيسية"
          className={`absolute inset-x-2 top-full mt-2 origin-top overflow-hidden  border border-white/15 bg-forest-950/80 shadow-xl backdrop-blur-xl transition duration-200 motion-reduce:transition-none sm:inset-x-4 sm:end-auto sm:w-72 ${
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
                  className={`flex min-h-11 items-center justify-between  px-4 text-base font-medium text-cream transition-colors hover:bg-white/10 hover:text-gold-300 ${focus}`}
                >
                  {m.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="border-t border-white/10 p-2 xl:hidden">
            {NAV.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className={`flex min-h-11 items-center  px-4 text-sm text-cream/80 transition-colors hover:bg-white/10 hover:text-gold-300 ${focus}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

/* =====================  NEWSLETTER  ===================== */
// The form posts to app/api/newsletter/route.ts (provided). It needs BREVO_API_KEY and BREVO_LIST_ID.
const NEWSLETTER_ENDPOINT = "/api/newsletter";
type Status = "idle" | "loading" | "success" | "error";

function Newsletter() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section aria-labelledby="news-title" className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="relative overflow-hidden  bg-gradient-to-br from-forest-800 to-forest-950 p-8 text-cream sm:p-12 lg:p-16">
          <span aria-hidden className="absolute -start-24 -top-24 h-72 w-72 rounded-full bg-gold-400/15 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="mb-2 text-sm font-semibold text-gold-300">النشرة البريدية</p>
              <h2 id="news-title" className="text-3xl font-light leading-tight sm:text-4xl">
                انضم إلى <span className="font-semibold">عائلة LUMORA</span>
              </h2>
              <p className="mt-3 max-w-md text-cream/75">
                اشترك ليصلك كل جديد ونصائح العناية بالشعر والعروض الحصرية مباشرة إلى بريدك.
              </p>
            </div>

            <div>
              {status === "success" ? (
                <div role="status" className="flex items-center gap-3  border border-gold-400/40 bg-white/5 px-5 py-5">
                  <svg {...svgProps} strokeWidth={2.5} className="h-6 w-6 flex-none text-gold-300"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                  <p className="font-medium">شكراً لك، تم تسجيل اشتراكك بنجاح.</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <label className="flex-1">
                    <span className="sr-only">البريد الإلكتروني</span>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="بريدك الإلكتروني"
                      className="h-14 w-full  border border-white/25 bg-white/10 px-6 text-base text-white outline-none backdrop-blur transition-colors placeholder:text-white/60 focus:border-gold-400 focus:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className={buttonStyles({ variant: "gold", size: "lg", className: "group justify-center disabled:opacity-60" })}
                  >
                    {status === "loading" ? "جارٍ الإرسال..." : "اشترك"}
                  </button>
                </form>
              )}

              {status === "error" && (
                <p role="alert" className="mt-3 text-sm text-red-200">تعذّر إتمام الاشتراك، يرجى المحاولة مرة أخرى.</p>
              )}
              <p className="mt-3 text-xs text-cream/65">لا رسائل مزعجة، ويمكنك إلغاء الاشتراك في أي وقت.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =====================  FOOTER  ===================== */
// ← Replace the "#" with your real pages and social accounts.
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
    "inline-flex min-h-11 items-center text-sm text-cream/75 transition hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400";
  return (
    <footer className="bg-forest-950 text-cream">
      {/* photo strip: bottle base + reflection, fading into the footer */}
      <div aria-hidden className="relative h-16 overflow-hidden sm:h-24">
        <Image src={SHOTS.base.src} alt="" fill sizes="100vw" className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest-950/30 to-forest-950" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <a
            href="#top"
            dir="ltr"
            className="inline-flex min-h-11 items-center text-2xl font-semibold tracking-[0.32em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
            aria-label="LUMORA، الصفحة الرئيسية"
          >
            LUM<span className="text-gold-400">O</span>RA
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/65">
            شامبو ضد تساقط الشعر بمكونات طبيعية وبدون سلفات، صنع في المغرب.
          </p>
          <p className="mt-4 text-sm text-cream/65">
            الدفع عند الاستلام · التوصيل خلال {DELIVERY_ESTIMATE}
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-3 text-sm font-semibold text-gold-300">{col.title}</h3>
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
        <div className="mx-auto max-w-7xl space-y-2 px-5 py-6 text-center text-xs leading-relaxed text-cream/50 sm:px-8 md:text-start">
          <p>© 2026 LUMORA. جميع الحقوق محفوظة.</p>
          <p>
            هذا المنتج مستحضر تجميل، والمعلومات المعروضة لأغراض إعلامية فقط. هذه التصريحات لم يتم تقييمها من قبل إدارة الغذاء والدواء.
            هذا المنتج ليس المقصود منه تشخيص أو علاج أو شفاء أو الوقاية من أي مرض.
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
      <CartProvider>
        <Header />
        <main>
          <HeroVideo />
          <HowItWorks />
          <Ingredients />
          <ProductSection />
          {/* <BeforeAfter buyUrl="#product" />  ← show only with REAL customer photos and results */}
          <QuickSteps />
          <ClosingCTA />
          <Newsletter />
        </main>
        <Footer />
        <CartDrawer />
        <StickyCTA />
        <ScrollToTop />
      </CartProvider>
    </div>
  );
}
