"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { buttonStyles, type Variant } from "./buttonStyles";
import { getProduct, type Product } from "./products";

const KEY = "lumora_cart_v1";
export const MAX_QTY = 10;

type Line = { id: string; qty: number };
export type CartLine = Product & { qty: number };

type Ctx = {
  items: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean; // false until localStorage has been read (avoids hydration mismatch)
  open: boolean;
  flash: boolean; // true for a moment right after adding
  setOpen: (v: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
};

function read(): Line[] {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((l) => l && typeof l.id === "string" && getProduct(l.id) && Number.isInteger(l.qty) && l.qty > 0)
      .map((l) => ({ id: l.id, qty: Math.min(MAX_QTY, l.qty) }));
  } catch {
    return [];
  }
}

type CartState = { lines: Line[]; ready: boolean };
type LinesUpdater = (previous: Line[]) => Line[];

const EMPTY_CART_STATE: CartState = { lines: [], ready: false };
let cartState = EMPTY_CART_STATE;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function save(lines: Line[]) {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
}

function onStorage(event: StorageEvent) {
  if (event.key !== KEY && event.key !== null) return;
  const lines = read();
  save(lines);
  cartState = { lines, ready: true };
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    if (!cartState.ready) {
      const lines = read();
      save(lines);
      cartState = { lines, ready: true };
      notify();
    }
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  return cartState;
}

function getServerSnapshot() {
  return EMPTY_CART_STATE;
}

function updateLines(updater: LinesUpdater) {
  const lines = updater(cartState.lines);
  save(lines);
  cartState = { lines, ready: true };
  notify();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { lines, ready } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 3600);
    return () => clearTimeout(t);
  }, [flash]);

  const add = useCallback((id: string, qty = 1) => {
    if (!getProduct(id)) return;
    updateLines((p) =>
      p.some((l) => l.id === id)
        ? p.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
        : [...p, { id, qty: Math.min(MAX_QTY, qty) }]
    );
    setFlash(true);
    setOpen(true);
  }, []);
  const setQty = useCallback((id: string, qty: number) =>
    updateLines((p) => (qty <= 0 ? p.filter((l) => l.id !== id) : p.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)))), []);
  const remove = useCallback((id: string) => updateLines((p) => p.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => updateLines(() => []), []);

  const items = lines.map((l) => ({ ...getProduct(l.id)!, qty: l.qty }));
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartCtx.Provider value={{ items, count, subtotal, ready, open, flash, setOpen, add, setQty, remove, clear }}>
      {children}
    </CartCtx.Provider>
  );
}

/* Header cart icon with item-count badge */
export function CartButton() {
  const { count, ready, setOpen } = useCart();
  const badge = useRef<HTMLSpanElement>(null);
  const prev = useRef<number | null>(null);

  // small "pop" on the badge each time an item is added (not on page load)
  useEffect(() => {
    if (!ready) return;
    if (prev.current !== null && count > prev.current && badge.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      badge.current.animate(
        [{ transform: "scale(.6)" }, { transform: "scale(1.35)", offset: 0.55 }, { transform: "scale(1)" }],
        { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
    }
    prev.current = count;
  }, [count, ready]);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-label={ready && count ? `السلة، ${count} منتجات` : "السلة"}
      className="relative -m-2 flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500 motion-reduce:transition-none"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current fill-none stroke-[1.6]" aria-hidden>
        <path d="M5 8h14l-1.2 11H6.2L5 8Z" strokeLinejoin="round" /><path d="M9 8a3 3 0 0 1 6 0" />
      </svg>
      {ready && count > 0 && (
        <span ref={badge} dir="ltr" aria-hidden className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold leading-none text-forest-950 ring-2 ring-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

/* "Add to cart" button: adds the product, then the drawer opens */
export function AddToCartButton({ productId, qty = 1, variant = "green", size = "lg", className = "", children }: {
  productId: string; qty?: number; variant?: Variant; size?: "md" | "lg"; className?: string; children?: ReactNode;
}) {
  const { add } = useCart();
  return (
    <button type="button" onClick={() => add(productId, qty)} className={buttonStyles({ variant, size, className: `group ${className}` })}>
      <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none transition group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 8h14l-1.2 11H6.2L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0M12 12v4M10 14h4" />
      </svg>
      {children ?? "أضف إلى السلة"}
    </button>
  );
}