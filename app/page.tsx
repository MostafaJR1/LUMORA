import Button, { buttonStyles, type Variant } from "./buttonStyles";
import { Reveal, RevealGroup, RevealItem } from "./Motion";
import HeroSlider from "./HeroSlider";
import BeforeAfter from "./Beforeafter";
import FlowArrow from "./FlowArrow";
import ScrollToTop from "./ScrollToTop";
import { CartProvider, CartButton, AddToCartButton } from "./cart";
import CartDrawer from "./CartDrawer";
import ProductSection, { StickyProductCTA } from "./Product";
import { HowItWorks, Testimonials } from "./Proof";
import { SHOTS } from "./Productshots"; // ← photos produit LUMORA (voir /public/images)

const BUY_URL = "#product"; // les boutons "acheter" mènent à la section produit / panier

const icon = "h-5 w-5 stroke-current fill-none stroke-[1.6]";

const svgProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

/* Arrow pointing "forward" in RTL (left), nudges on hover when the button has `group` */
function ArrowIcon() {
  return (
    <svg {...svgProps} className="h-5 w-5 flex-none transition -scale-x-100 group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-forest-900/10 bg-white/95 backdrop-blur">
      {/* Announcement bar */}
      <div className="bg-forest-900 text-sm font-medium text-cream sm:text-xs">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-center gap-4 px-4 sm:justify-between">
          <span className="hidden sm:inline">صنع في المغرب</span>
          <span>
            <span className="ms-2 rounded bg-gold-400 px-1.5 py-0.5 font-bold text-forest-950">جديد</span>
            وصل شامبو LUMORA ضد تساقط الشعر
          </span>
          <span className="hidden sm:inline">بدون سلفات</span>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4">
        <div className="flex items-center gap-4">
          <button type="button" className="flex h-11 items-center gap-2 rounded-lg text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500" aria-label="فتح القائمة">
            <svg viewBox="0 0 24 24" className={icon} aria-hidden><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
            <span className="hidden sm:inline">القائمة</span>
          </button>
          <label className="relative hidden w-64 lg:block">
            <span className="sr-only">ابحث في الموقع</span>
            <input
              type="search"
              placeholder="ابحث في الموقع"
              className="h-11 w-full rounded-full border border-forest-900/10 bg-cream px-4 pe-10 text-sm outline-none placeholder:text-forest-900/50 focus:border-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
            />
            <svg viewBox="0 0 24 24" className={`${icon} pointer-events-none absolute end-3 top-2.5 text-forest-900/60`} aria-hidden>
              <circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" strokeLinecap="round" />
            </svg>
          </label>
        </div>

        <a href="#" className="flex h-11 items-center text-2xl font-semibold tracking-[0.32em] text-forest-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500" aria-label="LUMORA، الصفحة الرئيسية" dir="ltr">
          LUM<span className="text-gold-500">O</span>RA
        </a>

        <div className="flex items-center justify-end gap-5 text-sm font-medium">
          <nav className="hidden items-center gap-5 xl:flex" aria-label="التنقل الثانوي">
            <a href="#" className="py-3 hover:text-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">نصائح</a>
            <a href="#" className="py-3 hover:text-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">من نحن</a>
            <a href="#" className="py-3 hover:text-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">المساعدة والتواصل</a>
          </nav>
          <a href="#" aria-label="حسابي" className="hidden h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500 sm:flex">
            <svg viewBox="0 0 24 24" className={icon} aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" strokeLinecap="round" /></svg>
          </a>
          <CartButton />
        </div>
      </div>
    </header>
  );
}

type Tone = "dark" | "gold" | "sage";
const CATEGORIES: { title: string; desc: string; href: string; tone: Tone; art: "drop" | "leaf" | "spark"; img: string }[] = [
  { title: "الشامبوهات", desc: "تنظيف لطيف، بدون سلفات.", href: "#shampoings", tone: "dark", art: "drop", img: SHOTS.card.src },
  { title: "العناية", desc: "تغذية وتقوية فروة الرأس.", href: "#soins", tone: "sage", art: "leaf", img: SHOTS.cap.src },
  { title: "الروتين", desc: "الثنائيات والأطقم لمزيد من العناية.", href: "#routines", tone: "gold", art: "spark", img: SHOTS.label.src },
]; // ← modifiez titres, descriptions, liens et images

// `photo` = rendu de la photo produit selon le fond de la carte
const TONES: Record<Tone, { card: string; text: string; sub: string; variant: Variant; art: string; photo: string }> = {
  dark: { card: "bg-gradient-to-br from-forest-800 to-forest-950", text: "text-cream", sub: "text-cream/70", variant: "light", art: "text-gold-400/50", photo: "opacity-90" },
  sage: { card: "bg-gradient-to-br from-[#dfe9dc] to-[#bfd2bd]", text: "text-forest-900", sub: "text-forest-900/70", variant: "green", art: "text-forest-700/35", photo: "opacity-80 mix-blend-multiply" },
  gold: { card: "bg-gradient-to-br from-gold-300 to-gold-500", text: "text-forest-950", sub: "text-forest-950/70", variant: "dark", art: "text-forest-950/25", photo: "opacity-80 mix-blend-multiply" },
};

function Art({ name, className }: { name: "drop" | "leaf" | "spark"; className: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {name === "drop" && (
        <g {...common}>
          <path d="M100 20c28 38 52 66 52 98a52 52 0 0 1-104 0c0-32 24-60 52-98Z" />
          <path d="M100 52c18 26 34 46 34 68" opacity=".6" />
          <path d="M100 84c9 13 16 22 16 36" opacity=".35" />
        </g>
      )}
      {name === "leaf" && (
        <g {...common}>
          <path d="M100 185V40" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <path d={`M100 ${150 - i * 26}c-22-2-36-16-40-34 22 0 38 12 40 34Z`} />
              <path d={`M100 ${150 - i * 26}c22-2 36-16 40-34-22 0-38 12-40 34Z`} />
            </g>
          ))}
          <path d="M100 40c-8-8-8-20 0-28 8 8 8 20 0 28Z" />
        </g>
      )}
      {name === "spark" && (
        <g {...common}>
          <path d="M100 18c4 44 18 58 62 62-44 4-58 18-62 62-4-44-18-58-62-62 44-4 58-18 62-62Z" />
          <path d="M155 128c2 18 8 24 26 26-18 2-24 8-26 26-2-18-8-24-26-26 18-2 24-8 26-26Z" opacity=".6" />
        </g>
      )}
    </svg>
  );
}

function Categories() {
  return (
    <section aria-labelledby="cat-title" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mb-8 text-center sm:mb-10">
          <p className="mb-2 text-sm font-semibold text-gold-500">تشكيلاتنا</p>
          <h2 id="cat-title" className="text-3xl font-semibold text-forest-900 sm:text-4xl">اعثر على روتينك</h2>
        </Reveal>

        <RevealGroup as="ul" className="grid gap-5 md:grid-cols-3">
          {CATEGORIES.map((c) => {
            const t = TONES[c.tone];
            return (
              <RevealItem key={c.title} as="li">
                <a
                  href={c.href}
                  className={`group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-3xl p-6 shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500 sm:p-7 md:aspect-[4/5] lg:aspect-[4/3] ${t.card}`}
                >
                  {/* photo produit : visible côté gauche, fondue vers le texte (côté droit en RTL) */}
                  <img
                    src={c.img}
                    alt=""
                    loading="lazy"
                    className={`absolute inset-y-0 end-0 h-full w-3/4 object-cover object-center transition duration-700 [mask-image:linear-gradient(to_right,#000_45%,transparent)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${t.photo}`}
                  />
                  <Art name={c.art} className={`absolute -start-6 -top-6 h-56 w-56 transition duration-500 group-hover:scale-105 group-hover:rotate-3 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 ${t.art}`} />
                  <div className={`relative ${t.text}`}>
                    <p className={`text-xs font-semibold ${t.sub}`}>تشكيلتنا</p>
                    <h3 className="mt-1 text-3xl font-light sm:text-4xl">{c.title}</h3>
                    <p className={`mt-2 max-w-[16rem] text-sm ${t.sub}`}>{c.desc}</p>
                    <span className={buttonStyles({ variant: t.variant, size: "md", className: "mt-5 group-hover:brightness-110 h-8 group-active:translate-y-[3px] group-active:border-b-2" })}>
                      عرض التشكيلة
                      <svg viewBox="0 0 20 20" className="h-4 w-4 transition -scale-x-100 group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 10h12M11 5l5 5-5 5" /></svg>
                    </span>
                  </div>
                </a>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}


type TrustIcon = "shield" | "truck" | "pin" | "drop" | "chat";
const TRUST: { icon: TrustIcon; title: string; desc: string }[] = [
  { icon: "chat", title: "1. اطلب منتجك", desc: "أرسل طلبك بسهولة عبر الموقع" },
  { icon: "shield", title: "2. تأكيد الطلب", desc: "نتواصل معك لتأكيد معلوماتك" },
  { icon: "pin", title: "3. تجهيز الطلب", desc: "نحضّر طلبك بعناية" },
  { icon: "truck", title: "4. الشحن والتوصيل", desc: "طلبك في الطريق إلى عنوانك" },
  { icon: "drop", title: "5. استلم طلبك", desc: "استمتع بمنتج LUMORA عند باب منزلك" },
];
// visibility of the arrow after item i for 2 / 3 / 5 columns (base / sm / lg)
const ARROW_VIS = ["block", "hidden sm:block", "block sm:hidden lg:block", "hidden sm:block"];

function TrustGlyph({ name }: { name: TrustIcon }) {
  return (
    <svg {...svgProps} strokeWidth={1.6} className="h-7 w-7">
      {name === "shield" && (<><path d="M12 3l7 3v5c0 5-3.2 8.2-7 10-3.8-1.8-7-5-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>)}
      {name === "truck" && (<><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></>)}
      {name === "pin" && (<><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>)}
      {name === "drop" && (<><path d="M12 3c3 4 6 7 6 10.5a6 6 0 0 1-12 0C6 10 9 7 12 3Z" /><path d="m9.5 13.5 2 2 3.5-3.5" /></>)}
      {name === "chat" && (<path d="M4 5h16v11H9l-5 4V5Z" />)}
    </svg>
  );
}

function Reassurance() {
  return (
    <section aria-label="ضمانات الشراء" className="bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4">
        {/* LTR on purpose: step 1 sits on the left and the arrows read left -> right */}
        <div dir="ltr">
        <RevealGroup as="ul" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST.map((t, i) => (
            <RevealItem key={t.title} as="li" className="relative flex flex-col items-center text-center last:col-span-2 sm:last:col-span-1">
              {/* arrow toward the next item, only when the next item is on the same row */}
              {i < TRUST.length - 1 && <FlowArrow delay={i * 200} className={ARROW_VIS[i]} />}
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-cream text-forest-800 shadow-sm ring-1 ring-forest-900/10">
                <span className="absolute -end-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-forest-900 text-xs font-semibold text-gold-300 ring-2 ring-white">{i + 1}</span>
                <TrustGlyph name={t.icon} />
              </span>
              <h3 dir="rtl" className="mt-3 text-base font-semibold text-forest-900">{t.title}</h3>
              <p dir="rtl" className="mt-1 max-w-[11rem] text-sm text-forest-900/65">{t.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        </div>

        {/* Action panel — bannière photo (produit à gauche, texte à droite en RTL) */}
        <Reveal className="relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-forest-800 to-forest-950 p-8 text-center text-cream shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-10 md:flex md:min-h-[28rem] md:items-center md:p-14 md:text-start">
          <img
            src={SHOTS.wideLeft.src}
            alt=""
            aria-hidden
            loading="lazy"
            width={SHOTS.wideLeft.w}
            height={SHOTS.wideLeft.h}
            className="absolute inset-0 hidden h-full w-full object-cover object-[left_58%] md:block"
          />
          <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-l from-forest-950/85 via-forest-950/35 to-transparent md:block" />
          {/* mobile : bouteille détourée au-dessus du texte */}
          <img
            src={SHOTS.bottle.src}
            alt={SHOTS.bottle.alt}
            loading="lazy"
            width={SHOTS.bottle.w}
            height={SHOTS.bottle.h}
            className="relative mx-auto mb-6 h-52 w-auto drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)] md:hidden"
          />
          <div className="relative flex flex-col items-center gap-6 md:me-auto md:w-1/2 md:items-start">
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">جذور أقوى تبدأ بخطوة واحدة</h2>
              <p className="mt-2 text-cream/75">شامبو LUMORA ضد التساقط · 150 مل · بدون سلفات</p>
            </div>
            <AddToCartButton productId="lumora-shampoo-150" variant="gold" size="lg" className="flex-none" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}


// Chiffres 100 % vérifiables d'après l'étiquette. Remplacez/ajoutez vos VRAIS résultats
// (ex. satisfaction client, test dermatologique, étude) seulement s'ils sont documentés.
const NUMBERS = [
  { value: "5", unit: "مكونات", desc: "طبيعية فعّالة في كل زجاجة" },
  { value: "0", unit: "سلفات", desc: "تركيبة لطيفة على فروة الرأس" },
  { value: "1×", unit: "أسبوعياً", desc: "الاستعمال الموصى به لأفضل النتائج" },
  { value: "150", unit: "مل", desc: "حجم عملي لروتينك" },
];
const ACTIVES = ["زيت أزير", "جل الصبار", "برو فيتامين B5", "بودرة البصل", "جنسينغ"];

function Results() {
  return (
    <section aria-labelledby="results-title" className="bg-gradient-to-b from-forest-800 to-forest-950 py-12 text-cream sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="mb-2 text-sm font-semibold text-gold-400">الشفافية أولاً</p>
          <h2 id="results-title" className="text-3xl font-semibold sm:text-4xl">تركيبة نثق بها، بالأرقام</h2>
          <p className="mt-3 text-cream/75">كل ما بداخل زجاجة LUMORA واضح ومكتوب على الملصق، بلا غموض.</p>
        </Reveal>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-12">
          {/* bouteille détourée sur le fond vert */}
          <Reveal className="relative mx-auto flex w-full max-w-[16rem] justify-center">
            <span aria-hidden className="absolute start-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/15 blur-3xl" />
            <img
              src={SHOTS.bottle.src}
              alt={SHOTS.bottle.alt}
              loading="lazy"
              width={SHOTS.bottle.w}
              height={SHOTS.bottle.h}
              className="relative h-[22rem] w-auto drop-shadow-[0_28px_36px_rgba(0,0,0,0.5)] sm:h-[26rem]"
            />
          </Reveal>

          <RevealGroup as="dl" className="grid grid-cols-2 gap-y-8">
            {NUMBERS.map((n, i) => (
              <RevealItem key={n.unit} className={`flex flex-col items-center px-4 text-center ${i % 2 === 1 ? "border-s border-gold-500/25" : ""}`}>
                <dt className="order-2 mt-1 text-lg font-semibold text-gold-300">{n.unit}</dt>
                <dd className="order-1 text-6xl font-light leading-none text-gold-400 sm:text-7xl" dir="ltr">{n.value}</dd>
                <p className="order-3 mt-2 max-w-[13rem] text-sm text-cream/75">{n.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* What's inside */}
        <RevealGroup as="ul" className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3" aria-label="المكونات الفعّالة">
          {ACTIVES.map((a) => (
            <RevealItem key={a} as="li" className="rounded-full border border-gold-500/40 bg-white/5 px-4 py-2 text-sm font-medium text-cream">
              {a}
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-8 flex justify-center">
          <Button href={BUY_URL} variant="green" size="lg" className="group">
            جرّب LUMORA الآن
            <ArrowIcon />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}


function Newsletter() {
  return (
    <section aria-labelledby="news-title" className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <Reveal className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-forest-900/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-12">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-900 text-gold-300">
            <svg {...svgProps} strokeWidth={1.6} className="h-6 w-6"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
          </span>
          <h2 id="news-title" className="mt-5 text-3xl font-semibold text-forest-900 sm:text-4xl">انضم إلى عائلة LUMORA</h2>
          <p className="mx-auto mt-3 max-w-lg text-forest-900/70">
            اشترك ليصلك كل جديد ونصائح العناية بالشعر والعروض الحصرية مباشرة إلى بريدك.
          </p>

          {/* Branchez l'action à votre service d'emailing (Mailchimp, Brevo…) */}
          <form action="#" method="post" className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row">
            <label className="flex-1">
              <span className="sr-only">البريد الإلكتروني</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="بريدك الإلكتروني"
                className="h-14 w-full rounded-xl border border-forest-900/15 bg-cream px-5 text-base outline-none placeholder:text-forest-900/45 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/40"
              />
            </label>
            <Button type="submit" variant="green" size="lg" className="group">
              اشترك
              <ArrowIcon />
            </Button>
          </form>
          <p className="mt-3 text-xs text-forest-900/55">لا رسائل مزعجة، ويمكنك إلغاء الاشتراك في أي وقت.</p>
        </Reveal>
      </div>
    </section>
  );
}

const FOOTER_LINKS = [
  { label: "من نحن", href: "#" },
  { label: "نصائح", href: "#" },
  { label: "المساعدة والتواصل", href: "#" },
  { label: "الشروط العامة للبيع", href: "#" },
  { label: "سياسة الخصوصية", href: "#" },
];

function Footer() {
  return (
    <footer className="bg-forest-950 text-cream">
      {/* bandeau photo : base de la bouteille + reflet, fondu vers le pied de page */}
      <div aria-hidden className="relative h-16 overflow-hidden sm:h-24">
        <img src={SHOTS.base.src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest-950/30 to-forest-950" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 text-center md:flex-row md:justify-between md:text-start">
        <div>
          <a href="#" dir="ltr" className="text-2xl font-semibold tracking-[0.32em]" aria-label="LUMORA، الصفحة الرئيسية">
            LUM<span className="text-gold-400">O</span>RA
          </a>
          <p className="mt-2 text-sm text-cream/60">شامبو ضد تساقط الشعر · صنع في المغرب</p>
        </div>

        <nav aria-label="روابط التذييل">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-medium text-cream/80 sm:gap-x-6">
            {FOOTER_LINKS.map((l) => (
              <li key={l.label}><a href={l.href} className="inline-flex min-h-11 items-center px-1 transition hover:text-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400">{l.label}</a></li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs leading-relaxed text-cream/50">
          © 2026 LUMORA. جميع الحقوق محفوظة. هذا المنتج مستحضر تجميل، والمعلومات المعروضة لأغراض إعلامية فقط.
        </p>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <div id="top" dir="rtl" lang="ar">
      <CartProvider>
      <Header />
      <main>
        <HeroSlider />
        <Categories />
        <HowItWorks />
        <Results />
        <ProductSection />
        <BeforeAfter buyUrl={BUY_URL} />
        <Testimonials />
        <Reassurance />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer />
      <StickyProductCTA />
      <ScrollToTop />
      </CartProvider>
    </div>
  );
}