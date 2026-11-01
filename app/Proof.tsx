"use client";

import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "./Motion";
import { U, IMG } from "./MediaMock";
import { AddToCartButton } from "./cart";

const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

// How-to-use video (9:16). Put the file in /public/videos and its first frame in /public/images.
const HOW_VIDEO = {
  src: "/videos/how-to-use.mp4",
  label: "فيديو يشرح طريقة استعمال شامبو LUMORA",
};

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

/* Video starts paused and uses the browser's standard playback controls. */
function LoopVideo({ src, label }: { src: string; label: string }) {
  return (
    <div className="relative h-full w-full">
      <video
        className="h-full w-full cursor-pointer object-cover"
        src={src}
        aria-label={label}
        controls
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={(e) => e.currentTarget.pause()}
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
      />
    </div>
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
    <section id="comment-ca-marche" aria-labelledby="how-title" className="scroll-mt-32 bg-white py-10 sm:py-14">
      <div className="mx-auto grid max-w-5xl items-center justify-center gap-8 px-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-14">
        {/* Vertical looping video, 9:16, with play / pause and a timeline */}
        <Reveal>
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-lg bg-forest-900 shadow-xl ring-1 ring-forest-900/10 sm:max-w-[320px] lg:max-w-none">
            <LoopVideo src={HOW_VIDEO.src} label={HOW_VIDEO.label} />
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal>
          <p className="mb-2 text-xs font-semibold text-gold-500">طريقة الاستعمال</p>
          <h2 id="how-title" className="text-2xl font-semibold leading-tight text-forest-900 sm:text-3xl">
            ثلاث خطوات بسيطة،
            <span className="block font-light text-forest-900/60">مرة واحدة في الأسبوع.</span>
          </h2>
          <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-forest-900/75">
            شامبو LUMORA ضد التساقط بخمسة مكونات طبيعية وبدون سلفات. شاهد الفيديو وتعرّف على الطريقة الموصى بها، بلا تعقيد.
          </p>

          <ol className="mt-6 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-3.5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-forest-900 text-sm font-semibold text-gold-300" dir="ltr">{i + 1}</span>
                <div>
                  <h3 className="text-[0.9375rem] font-semibold text-forest-900">{s.t}</h3>
                  <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-forest-900/70">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-5 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-forest-900/60">
            <svg {...svg} className="mt-0.5 h-4 w-4 flex-none"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" /></svg>
            لا يُستعمل على الشعر الجاف، ولا على الشعر المعالج بالبروتين.
          </p>

          {/* adds to the cart; the cart drawer then opens by itself (see CartDrawer.tsx) */}
          <AddToCartButton productId="lumora-shampoo-150" variant="green" size="lg" className="group mt-6" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Reviews + community photos ---------- */
// MOCK reviews: replace with real, documented customer feedback (and real photos with consent).
// This component is NOT used on the page right now. Do not publish it with the made-up names, the 4.8 rating or the
// "verified buyer" label: show only real reviews.
const REVIEWS = [
  { name: "سلمى ب.", city: "الدار البيضاء", img: IMG.people[0], text: "رائحته خفيفة وفروة رأسي أصبحت مرتاحة أكثر. أستعمله مرة في الأسبوع كما هو موصى به." },
  { name: "يوسف ع.", city: "مراكش", img: IMG.people[1], text: "التركيبة بدون سلفات وهذا ما كنت أبحث عنه. التوصيل كان سريعاً والتغليف مرتب." },
  { name: "نادية ك.", city: "الرباط", img: IMG.people[2], text: "ملمس الشعر بعد الغسل ناعم وغير جاف. أنصح به لمن يريد روتيناً بسيطاً وطبيعياً." },
];

export function Testimonials() {
  return (
    <section aria-labelledby="rev-title" className="bg-cream py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mb-8 flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-start">
          <div>
            <p className="mb-2 text-xs font-semibold text-gold-500">آراء العملاء</p>
            <h2 id="rev-title" className="text-2xl font-semibold text-forest-900 sm:text-3xl">ماذا يقولون عن LUMORA</h2>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-white px-5 py-3 shadow-sm ring-1 ring-forest-900/10">
            <span className="text-3xl font-light text-forest-900" dir="ltr">4.8</span>
            <div><Stars /><p className="mt-1 text-xs text-forest-900/65">متوسط تقييمات العملاء</p></div>
          </div>
        </Reveal>

        <RevealGroup as="ul" className="grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <RevealItem key={r.name} as="li" className="flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10">
              <Stars />
              <blockquote className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-forest-900/85">“{r.text}”</blockquote>
              <div className="mt-5 flex items-center gap-3">
                <Image src={U(r.img, 160)} alt={r.name} width={40} height={40} unoptimized className="h-10 w-10 rounded-full bg-cream object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-forest-900">{r.name} <span className="font-normal text-forest-900/55">· {r.city}</span></p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-forest-700">
                    <svg {...svg} className="h-3.5 w-3.5"><path d="m5 12 4.5 4.5L19 7" /></svg>
                    مشتري موثّق
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Community photos */}
        <Reveal className="mt-8 sm:mt-10">
          <h3 className="mb-4 text-center text-lg font-semibold text-forest-900">من مجتمع LUMORA</h3>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {IMG.ugc.map((id, i) => (
              <li key={id + i} className="group relative aspect-square overflow-hidden rounded-lg bg-forest-900/10">
                <Image src={U(id, 600)} alt={`صورة عميلة رقم ${i + 1}`} fill unoptimized sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/70 to-transparent p-3 text-xs font-medium text-cream" dir="ltr">@lumora.ma</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}