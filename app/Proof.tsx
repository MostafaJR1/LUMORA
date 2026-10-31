"use client";

import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "./Motion";
import { U, IMG } from "./MediaMock";
import { AddToCartButton } from "./cart";

const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="flex gap-0.5 text-gold-500" role="img" aria-label={`${n} من 5`} dir="ltr">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`h-4 w-4 ${i < n ? "fill-current" : "fill-forest-900/15"}`} aria-hidden>
          <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
        </svg>
      ))}
    </span>
  );
}

/* ---------- How it works + vertical video (TikTok / Reels ratio 9:16) ---------- */
// Copy follows the product label: used on wet hair, gentle scalp massage until it foams, rinse well, once a week.
const STEPS = [
  { t: "بلّل شعرك جيداً", d: "يُستعمل الشامبو على شعر مبلّل، بكمية صغيرة تكفي." },
  { t: "دلّك فروة الرأس بلطف", d: "حتى تتكوّن الرغوة، فتتوزّع التركيبة الطبيعية على فروة الرأس." },
  { t: "اشطفه جيداً", d: "مرة واحدة في الأسبوع للحصول على أفضل النتائج." },
];

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" aria-labelledby="how-title" className="scroll-mt-32 bg-white py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center justify-center gap-10 px-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-16">
        {/* Vertical video, 9:16 */}
        <Reveal>
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden  bg-forest-900 shadow-xl ring-1 ring-forest-900/10 sm:max-w-[340px] lg:max-w-none">
            <Image
              src={U(IMG.videoPoster, 900)}
              alt="طريقة استعمال شامبو LUMORA"
              fill
              sizes="(min-width: 1024px) 360px, 340px"
              className="object-cover"
            />
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal>
          <p className="mb-2 text-sm font-semibold text-gold-500">طريقة الاستعمال</p>
          <h2 id="how-title" className="text-3xl font-semibold leading-tight text-forest-900 sm:text-4xl">
            ثلاث خطوات بسيطة،
            <span className="block font-light text-forest-900/60">مرة واحدة في الأسبوع.</span>
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-forest-900/75">
            شامبو LUMORA ضد التساقط بخمسة مكونات طبيعية وبدون سلفات. شاهد الفيديو وتعرّف على الطريقة الموصى بها، بلا تعقيد.
          </p>

          <ol className="mt-7 space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="flex h-10 w-10 flex-none items-center justify-center  bg-forest-900 text-sm font-semibold text-gold-300" dir="ltr">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-forest-900">{s.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-forest-900/70">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-forest-900/60">
            <svg {...svg} className="mt-0.5 h-4 w-4 flex-none"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" /></svg>
            لا يُستعمل على الشعر الجاف، ولا على الشعر المعالج بالبروتين.
          </p>

          {/* adds to the cart; the cart drawer then opens by itself (see CartDrawer.tsx) */}
          <AddToCartButton productId="lumora-shampoo-150" variant="green" size="lg" className="group mt-7" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Reviews + community photos ---------- */
// MOCK reviews: replace with real, documented customer feedback (and real photos with consent).
const REVIEWS = [
  { name: "سلمى ب.", city: "الدار البيضاء", img: IMG.people[0], text: "رائحته خفيفة وفروة رأسي أصبحت مرتاحة أكثر. أستعمله مرة في الأسبوع كما هو موصى به." },
  { name: "يوسف ع.", city: "مراكش", img: IMG.people[1], text: "التركيبة بدون سلفات وهذا ما كنت أبحث عنه. التوصيل كان سريعاً والتغليف مرتب." },
  { name: "نادية ك.", city: "الرباط", img: IMG.people[2], text: "ملمس الشعر بعد الغسل ناعم وغير جاف. أنصح به لمن يريد روتيناً بسيطاً وطبيعياً." },
];

export function Testimonials() {
  return (
    <section aria-labelledby="rev-title" className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mb-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
          <div>
            <p className="mb-2 text-sm font-semibold text-gold-500">آراء العملاء</p>
            <h2 id="rev-title" className="text-3xl font-semibold text-forest-900 sm:text-4xl">ماذا يقولون عن LUMORA</h2>
          </div>
          <div className="flex items-center gap-4  bg-white px-5 py-3 shadow-sm ring-1 ring-forest-900/10">
            <span className="text-4xl font-light text-forest-900" dir="ltr">4.8</span>
            <div><Stars /><p className="mt-1 text-sm text-forest-900/65">متوسط تقييمات العملاء</p></div>
          </div>
        </Reveal>

        <RevealGroup as="ul" className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <RevealItem key={r.name} as="li" className="flex flex-col  bg-white p-6 shadow-sm ring-1 ring-forest-900/10">
              <Stars />
              <blockquote className="mt-4 flex-1 leading-relaxed text-forest-900/85">“{r.text}”</blockquote>
              <div className="mt-6 flex items-center gap-3">
                <Image src={U(r.img, 160)} alt={r.name} width={44} height={44} unoptimized className="h-11 w-11  bg-cream object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-forest-900">{r.name} <span className="font-normal text-forest-900/55">· {r.city}</span></p>
                  <p className="mt-0.5 flex items-center gap-1 text-sm font-medium text-forest-700">
                    <svg {...svg} className="h-3.5 w-3.5"><path d="m5 12 4.5 4.5L19 7" /></svg>
                    مشتري موثّق
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Community photos */}
        <Reveal className="mt-10 sm:mt-12">
          <h3 className="mb-5 text-center text-xl font-semibold text-forest-900">من مجتمع LUMORA</h3>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {IMG.ugc.map((id, i) => (
              <li key={id + i} className="group relative aspect-square overflow-hidden  bg-forest-900/10">
                <Image src={U(id, 600)} alt={`صورة عميلة رقم ${i + 1}`} fill unoptimized sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/70 to-transparent p-3 text-sm font-medium text-cream" dir="ltr">@lumora.ma</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
