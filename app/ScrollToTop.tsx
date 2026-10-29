"use client";

import { useEffect, useRef, useState } from "react";

const R = 20;
const CIRC = 2 * Math.PI * R;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;

      // Show only after the user has scrolled slightly past the hero section
      const hero = document.getElementById("hero");
      const threshold = hero ? hero.offsetTop + hero.offsetHeight + 40 : 500;
      setVisible(y > threshold - window.innerHeight * 0.15);

      // Scroll progress ring
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(CIRC * (1 - progress));
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="العودة إلى الأعلى"
      title="العودة إلى الأعلى"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`group fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] start-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-forest-900 text-cream shadow-lg ring-1 ring-gold-400/30 transition duration-300 ease-out hover:-translate-y-1 hover:bg-forest-800 hover:shadow-xl active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:bottom-8 sm:end-8 sm:h-14 sm:w-14 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {/* Progress ring */}
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
        <circle cx="24" cy="24" r={R} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r={R}
          fill="none"
          className="stroke-gold-400"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC}
        />
      </svg>

      {/* Arrow */}
      <svg
        viewBox="0 0 24 24"
        className="relative h-5 w-5 transition group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}