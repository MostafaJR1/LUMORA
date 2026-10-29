"use client";

import { useEffect, useRef } from "react";

/* Three down-pointing chevrons that cascade ONE time when scrolled into view,
   guiding the eye from the trust icons to the order panel. */
export default function ArrowsCue({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const arrows = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const play = () => {
      arrows.current.forEach((a, i) => {
        if (!a) return;
        if (reduce || !a.animate) { a.style.opacity = String(1 - i * 0.25); return; }
        a.animate(
          [
            { opacity: 0, transform: "translateY(-12px)" },
            { opacity: 1 - i * 0.25, transform: "translateY(0)" },
          ],
          { duration: 550, delay: i * 200, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
        );
      });
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          play();
          io.disconnect(); // one time only
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} aria-hidden className={`flex flex-col items-center -space-y-3 text-gold-500 ${className}`}>
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          ref={(n) => { arrows.current[i] = n; }}
          viewBox="0 0 24 24"
          style={{ opacity: 0 }}
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      ))}
    </div>
  );
}