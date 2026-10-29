"use client";

import { MotionConfig, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import type { Variants } from "framer-motion";
import Button from "./buttonStyles";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const;

/** Respects the visitor's "reduce motion" system setting. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Thin gold progress bar fixed at the top; grows right → left (RTL). */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-right bg-gradient-to-l from-gold-300 to-gold-500"
    />
  );
}

/** Keeps the back-to-top control fixed and hides it while the page is at the top. */
export function ScrollToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => setVisible(latest > 16));

  return (
    <Button
      href="#top"
      variant="gold"
      size="md"
      className={`group fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full p-0 shadow-lg shadow-forest-950/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:bottom-7 sm:right-7 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-3 opacity-0"}`}
      aria-label="العودة إلى الأعلى"
      title="العودة إلى الأعلى"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <path d="m6 14 6-6 6 6" />
      </svg>
    </Button>
  );
}

/** Fade + rise when the block enters the viewport (plays once). */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

type Tag = "div" | "ul" | "dl" | "li";
const TAGS = { div: motion.div, ul: motion.ul, dl: motion.dl, li: motion.li } as const;

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Container that staggers its <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.1,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  as?: Exclude<Tag, "li">;
  stagger?: number;
  "aria-label"?: string;
}) {
  const reduce = useReducedMotion();
  const T = TAGS[as] as typeof motion.div;
  return (
    <T
      className={className}
      aria-label={ariaLabel}
      variants={{ hidden: {}, show: { transition: reduce ? {} : { staggerChildren: stagger } } }}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={VIEWPORT}
    >
      {children}
    </T>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const T = TAGS[as] as typeof motion.div;
  return (
    <T
      className={className}
      variants={reduce ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : item}
    >
      {children}
    </T>
  );
}

/** Decorative background that drifts slower than the page while scrolling. */
export function Parallax({ children, className, offset = 80 }: { children: ReactNode; className?: string; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : offset]);
  return (
    <div ref={ref} aria-hidden className={className}>
      <motion.div style={{ y }} className="absolute inset-x-0 bottom-0 -top-20">
        {children}
      </motion.div>
    </div>
  );
}