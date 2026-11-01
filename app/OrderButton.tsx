"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { hasMarketingConsent } from "../lib/consent";
import { trackInitiateCheckout } from "../lib/fpixel";
import { PRODUCTS } from "./products";

type OrderButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
};

export function OrderButton({ children, onClick, ...props }: OrderButtonProps) {
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    if (hasMarketingConsent()) {
      const item = PRODUCTS[0];
      trackInitiateCheckout({
        content_name: item?.name ?? "LUMORA product",
        content_ids: item ? [item.id] : [],
        content_type: "product",
        value: item?.price ?? 149,
        currency: "MAD",
        num_items: 1,
      });
    }

    event.preventDefault();
    const form = document.getElementById("order-form");
    if (form) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      form.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
      window.history.replaceState(null, "", "#order-form");
    }

    window.setTimeout(() => {
      const input = document.getElementById("order-name");
      if (!input || !(input instanceof HTMLInputElement)) return;
      const rect = input.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        input.focus({ preventScroll: true });
      }
    }, 700);
  };

  return (
    <a href="#order-form" {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
