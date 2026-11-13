"use client";

import { motion, useReducedMotion } from "motion/react";

export type MascotState = "idle" | "walking" | "thinking" | "happy" | "sad";
export type MascotSize = "sm" | "md" | "lg";

const sizes: Record<MascotSize, string> = { sm: "h-16 w-16", md: "h-28 w-28", lg: "h-40 w-40" };

export function MrGapIt({ state = "idle", size = "md", className = "" }: { state?: MascotState; size?: MascotSize; className?: string }) {
  const reduced = useReducedMotion();
  const motionProps = reduced ? {} : state === "walking"
    ? { animate: { x: [0, 7, 0], y: [0, -3, 0] }, transition: { duration: 0.8, repeat: Infinity } }
    : state === "happy" ? { animate: { y: [0, -7, 0] }, transition: { duration: 0.7, repeat: 2 } }
    : state === "sad" ? { animate: { rotate: [0, -7, 0] }, transition: { duration: 0.4, repeat: 1 } }
    : { animate: { y: [0, -2, 0] }, transition: { duration: 2.2, repeat: Infinity } };
  return (
    <motion.svg aria-hidden="true" className={`${sizes[size]} ${className}`} fill="none" viewBox="0 0 120 120" {...motionProps}>
      <path d="M32 88V28h15v48h28V28h15v60z" fill="var(--primary)" stroke="var(--secondary)" strokeWidth="4" strokeLinejoin="round" />
      <path d="M47 45h28M47 57h28M47 69h28" stroke="var(--mascot-orange)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="20" r="12" fill="var(--mascot-peach)" stroke="var(--mascot-outline)" strokeWidth="3" />
      <circle cx="56" cy="19" r="1.8" fill="#1F2937" /><circle cx="64" cy="19" r="1.8" fill="#1F2937" />
      <path d={state === "sad" ? "M56 26q4-5 8 0" : "M56 24q4 5 8 0"} stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
      <circle cx="25" cy="94" r="8" fill="var(--mascot-orange)" /><circle cx="95" cy="94" r="8" fill="var(--mascot-orange)" />
      {state === "thinking" && <path d="M84 14q8-12 16 0-8 12-16 0" fill="var(--mascot-peach)" stroke="var(--mascot-outline)" strokeWidth="2" />}
    </motion.svg>
  );
}

export function MrSpotIt({ state = "idle", size = "md", className = "" }: { state?: MascotState; size?: MascotSize; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.svg aria-hidden="true" className={`${sizes[size]} ${className}`} fill="none" viewBox="0 0 120 120" animate={reduced ? undefined : { rotate: state === "thinking" ? [0, -4, 4, 0] : 0 }} transition={{ duration: 2, repeat: state === "thinking" ? Infinity : 0 }}>
      <circle cx="48" cy="47" r="29" fill="var(--mascot-peach)" stroke="var(--mascot-outline)" strokeWidth="5" />
      <circle cx="48" cy="47" r="19" fill="var(--mascot-soft-teal)" stroke="var(--mascot-teal)" strokeWidth="4" />
      <circle cx="48" cy="47" r="7" fill="var(--primary)" />
      <path d="m68 68 25 25" stroke="var(--mascot-teal)" strokeWidth="10" strokeLinecap="round" />
      <circle cx="43" cy="42" r="2" fill="#1F2937" /><circle cx="54" cy="42" r="2" fill="#1F2937" />
      <path d={state === "sad" ? "M43 55q5-6 10 0" : "M43 52q5 6 10 0"} stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 83h29" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" />
    </motion.svg>
  );
}

export function MascotSpeech({ children }: { children: string }) {
  return <span aria-live="polite" className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text)] shadow-sm">{children}</span>;
}
