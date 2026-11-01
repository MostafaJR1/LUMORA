"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { AddToCartButton } from "./cart";
import { PRODUCTS } from "./products";

// Every "order now" button on the page calls this. It presses the store's own (hidden)
// AddToCartButton, so the product is added and the cart behaves exactly like the one in the product block.
// Must be rendered inside <CartProvider>.

const OrderContext = createContext<() => void>(() => {});

export function OrderProvider({ children }: { children: ReactNode }) {
  const holder = useRef<HTMLDivElement>(null);

  const order = useCallback(() => {
    holder.current?.querySelector("button")?.click();
  }, []);

  return (
    <OrderContext.Provider value={order}>
      {children}
      <div ref={holder} hidden aria-hidden="true">
        <AddToCartButton productId={PRODUCTS[0].id} qty={1} variant="green" size="lg" />
      </div>
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);

// Drop-in replacement for <a href="#product">اطلب الآن</a>
export function OrderButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const order = useOrder();
  return (
    <button type="button" onClick={order} {...props}>
      {children}
    </button>
  );
}