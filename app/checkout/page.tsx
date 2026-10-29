// Place at: app/checkout/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { CartProvider } from "../cart";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = { title: "إتمام الطلب | LUMORA", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-cream">
      {/* focused header: no menu or search, so nothing distracts from finishing the order */}
      <header className="border-b border-forest-900/10 bg-white">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4">
          <Link href="/" className="flex w-fit items-center gap-2 text-sm font-semibold text-forest-900 transition hover:text-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 12H4M13 5l7 7-7 7" /></svg>
            <span className="hidden sm:inline">العودة إلى المتجر</span>
            <span className="sr-only sm:hidden">العودة إلى المتجر</span>
          </Link>
          <Link href="/" dir="ltr" aria-label="LUMORA، الصفحة الرئيسية" className="text-2xl font-semibold tracking-[0.32em] text-forest-900">
            LUM<span className="text-gold-500">O</span>RA
          </Link>
          <p className="flex items-center justify-end gap-1.5 text-xs font-medium text-forest-900/70 sm:text-sm">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            طلب آمن
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <h1 className="mb-8 text-3xl font-semibold text-forest-900 sm:text-4xl">إتمام الطلب</h1>
        <CartProvider>
          <CheckoutForm />
        </CartProvider>
      </main>
    </div>
  );
}
