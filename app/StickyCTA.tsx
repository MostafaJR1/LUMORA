"use client";

import { useEffect, useState } from "react";
import { AddToCartButton } from "./cart";
import { money } from "./products";

// Sticky bottom bar. One tap adds the product; the cart drawer then opens by itself (see CartDrawer.tsx).
const PRODUCT_ID = "lumora-shampoo-150";
const PRODUCT_NAME = "شامبو LUMORA ضد التساقط";
const PRODUCT_SUB = "150 مل · بدون سلفات · الدفع عند الاستلام";

export default function StickyCTA({ price }: { price?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [productInView, setProductInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide the bar while the real product section is on screen (it already has its own button)
  useEffect(() => {
    const el = document.getElementById("product");
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setProductInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const visible = scrolled && !productInView;

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition duration-300 motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto rounded-md flex max-w-xl items-center justify-between gap-3  border border-white/15 bg-forest-950/85 p-3 pe-3 ps-4 text-white shadow-xl shadow-black/25 backdrop-blur-xl">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{PRODUCT_NAME}</p>
          <p className="truncate text-xs text-white/65">
            {price !== undefined && <span className="font-semibold text-gold-300">{money(price)} · </span>}
            {PRODUCT_SUB}
          </p>
        </div>
        <AddToCartButton productId={PRODUCT_ID} variant="gold" size="md" className="flex-none" />
      </div>
    </div>
  );
}
