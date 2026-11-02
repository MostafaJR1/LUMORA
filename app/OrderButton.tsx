"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type OrderButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
};

export function OrderButton({ children, onClick, ...props }: OrderButtonProps) {
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

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
