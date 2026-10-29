import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type Variant = "green" | "dark" | "light" | "gold";
export type Size = "sm" | "md" | "lg";

const BASE =
  "relative inline-flex select-none items-center justify-center gap-2 rounded-xl border border-b-[2px] font-semibold " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-[transform,border-width,background-color,filter] duration-100 " +
  "active:translate-y-[3px] active:border-b-2 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  green: "border-[#1a9a5c] border-b-[#0a4d2b] bg-[#12814a] text-white hover:bg-[#16915a]",
  dark: "border-[#3a4046] border-b-[#0a0c0d] bg-[#1d2023] text-white hover:bg-[#262a2e]",
  light: "border-[#e4ddca] border-b-[#b5ac92] bg-white text-forest-900 hover:bg-cream",
  gold: "border-[#f3dc9c] border-b-[#8f6f25] bg-gold-400 text-forest-950 hover:bg-gold-300",
};

const SIZES: Record<Size, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-11 px-6 text-sm",
  lg: "min-h-12 px-8 text-base",
};

/** Class string only — use it on a <span> when the button sits inside another link. */
export function buttonStyles({
  variant = "green",
  size = "md",
  fullWidth = false,
  className = "",
}: { variant?: Variant; size?: Size; fullWidth?: boolean; className?: string } = {}) {
  return [BASE, VARIANTS[variant], SIZES[size], fullWidth ? "w-full" : "", className].filter(Boolean).join(" ");
}

type Common = { variant?: Variant; size?: Size; fullWidth?: boolean; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common | "href">;
type AsButton = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common>;

/** 3D button: renders an <a> when `href` is set, otherwise a <button>. */
export default function Button(props: AsLink | AsButton) {
  const { variant, size, fullWidth, className, children, ...rest } = props;
  const cls = buttonStyles({ variant, size, fullWidth, className });

  if ("href" in rest && rest.href !== undefined) {
    return <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls}>{children}</a>;
  }
  const { type = "button", ...btn } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button {...btn} type={type} className={cls}>{children}</button>;
}