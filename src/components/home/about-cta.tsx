"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconChevronDown } from "@tabler/icons-react";
import { useT } from "@/lib/i18n/provider";

const OPEN_EVENT = "gapit:open-about";
const CLOSE_EVENT = "gapit:close-about";
const FOCUS_EVENT = "gapit:focus-about-cta";

export function openAboutExperience() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export default function AboutCta() {
  const { t } = useT();
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      setRevealed(true);
      setAboutOpen(true);
    };
    const onClose = () => setAboutOpen(false);
    const onFocus = () => {
      setRevealed(true);
      setAboutOpen(false);
      requestAnimationFrame(() => document.getElementById("about-trigger")?.focus());
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener(CLOSE_EVENT, onClose);
    window.addEventListener(FOCUS_EVENT, onFocus);
    if (window.location.hash === "#about") onOpen();
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener(CLOSE_EVENT, onClose);
      window.removeEventListener(FOCUS_EVENT, onFocus);
    };
  }, []);

  return (
    <div
      aria-controls="about-cta-actions"
      aria-expanded={revealed}
      className="about-cta"
      style={{ bottom: "max(24px, env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-col items-center gap-2" id="about-cta-actions">
        <AnimatePresence>
        {revealed && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-11 items-center justify-center"
            exit={{ opacity: 0, y: 8 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <button
            aria-controls="about"
            aria-expanded={aboutOpen}
            className="min-h-11 max-w-[calc(100vw-2rem)] rounded-full border border-white/50 bg-[#0F081F]/90 px-6 py-2 text-center font-semibold text-white shadow-lg backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                id="about-trigger"
                onClick={openAboutExperience}
              type="button"
            >
              {t("aboutExperience.open")}
            </button>
          </motion.div>
        )}
        </AnimatePresence>
      <button
        aria-label={revealed ? t("aboutExperience.hideButton") : t("aboutExperience.showButton")}
        aria-expanded={revealed}
        aria-controls="about-cta-actions"
        className="grid size-12 place-items-center rounded-full border border-white/50 bg-[#0F081F]/90 text-white shadow-lg backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        onClick={() => setRevealed((value) => !value)}
        type="button"
      >
        <motion.span
          animate={{ rotate: revealed ? 180 : 0, y: revealed || reduceMotion ? 0 : [0, -4, 0] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.8, repeat: revealed ? 0 : Infinity, ease: "easeInOut" }}
        >
          <IconChevronDown aria-hidden="true" className="size-5" />
        </motion.span>
      </button>
      </div>
    </div>
  );
}
