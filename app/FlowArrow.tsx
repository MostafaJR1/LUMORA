"use client";

import { useEffect, useId, useRef } from "react";

/* Designed arrow between two trust items: a hand-drawn style curve that starts with a dot,
   fades from a soft tail to a solid gold head, and draws itself ONE time when it scrolls into view.
   It flows left -> right. */
export default function FlowArrow({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  const gid = useId();
  const wrap = useRef<HTMLSpanElement>(null);
  const line = useRef<SVGPathElement>(null);
  const head = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const w = wrap.current, l = line.current, h = head.current, d = dot.current;
    if (!w || !l || !h || !d) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !l.animate) return; // static, fully visible

    const len = l.getTotalLength();
    l.style.strokeDasharray = String(len);
    l.style.strokeDashoffset = String(len);
    h.style.opacity = "0";
    d.style.opacity = "0";
    d.style.transformOrigin = "6px 22px";

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const opt = { fill: "forwards" as const, easing: "cubic-bezier(.4,0,.2,1)" };
        d.animate([{ opacity: 0, transform: "scale(0)" }, { opacity: 1, transform: "scale(1)" }], { ...opt, duration: 300, delay });
        l.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { ...opt, duration: 900, delay: delay + 200 });
        h.animate([{ opacity: 0 }, { opacity: 1 }], { ...opt, duration: 250, delay: delay + 900 });
        io.disconnect(); // one time only
      },
      { threshold: 1 }
    );
    io.observe(w);
    return () => io.disconnect();
  }, [delay]);

  return (
    <span ref={wrap} aria-hidden className={`pointer-events-none absolute -right-2 top-8 z-10 translate-x-1/2 -translate-y-1/2 text-gold-500 ${className}`}>
      <svg viewBox="0 0 64 32" className="h-8 w-16 overflow-visible" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="6" y1="0" x2="54" y2="0">
            <stop offset="0" stopColor="currentColor" stopOpacity=".25" />
            <stop offset="1" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle ref={dot} cx="6" cy="22" r="2.6" fill="currentColor" stroke="none" />
        <path ref={line} d="M6 22C18 4 38 4 54 18" stroke={`url(#${gid})`} />
        <path ref={head} d="M45 17 54 18l-2.2-8.7" />
      </svg>
    </span>
  );
}