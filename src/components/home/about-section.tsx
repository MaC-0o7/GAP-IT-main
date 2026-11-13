"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IconX } from "@tabler/icons-react";
import ScrambledText from "@/components/reactbits/ScrambledText/ScrambledText";
import AboutArt from "@/components/home/about-art";
import { useT } from "@/lib/i18n/provider";

const OPEN_EVENT = "gapit:open-about";
const CLOSE_EVENT = "gapit:close-about";
const FOCUS_EVENT = "gapit:focus-about-cta";

const featureKeys = [
  "aboutExperience.featureMeasurement",
  "aboutExperience.featureSpc",
  "aboutExperience.featureTraceability",
  "aboutExperience.featureDevices",
  "aboutExperience.featureEvents",
] as const;

export default function AboutSection() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const openAbout = () => setOpen(true);
    const closeAbout = () => setOpen(false);
    const handleHash = () => {
      if (window.location.hash === "#about") openAbout();
    };
    window.addEventListener(OPEN_EVENT, openAbout);
    window.addEventListener(CLOSE_EVENT, closeAbout);
    window.addEventListener("hashchange", handleHash);
    if (window.location.hash === "#about") openAbout();
    return () => {
      window.removeEventListener(OPEN_EVENT, openAbout);
      window.removeEventListener(CLOSE_EVENT, closeAbout);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const reduce = reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#about`);
    const focusTimer = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    }, 250);
    return () => window.clearTimeout(focusTimer);
  }, [open, reduceMotion]);

  const close = () => {
    setOpen(false);
    if (window.location.hash === "#about") {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
    }
    const reduce = reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("home-hero")?.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" });
    window.dispatchEvent(new Event(CLOSE_EVENT));
    window.setTimeout(() => window.dispatchEvent(new Event(FOCUS_EVENT)), reduce ? 0 : 350);
  };

  return (
    <motion.section
      aria-hidden={!open}
      className="home-about-experience"
      id="about"
      inert={!open}
      ref={sectionRef}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      initial={false}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeInOut" }}
    >
      {open && (
        <div className="about-experience-inner">
          <button
            aria-label={t("aboutExperience.close")}
            className="about-close-button"
            onClick={close}
            type="button"
          >
            <IconX aria-hidden="true" className="size-5" />
          </button>
          <div className="about-experience-grid">
            <motion.div
              className="about-experience-copy"
              initial={reduceMotion ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.45 }}
            >
              <h2 className="about-experience-heading" ref={headingRef} tabIndex={-1}>
                {t("aboutExperience.heading")}
              </h2>
              <p className="about-experience-intro">
                <ScrambledText as="span" className="home-scrambled-text" clickBurst duration={1.2} effect="scramble" intro radius={100} scrambleChars=".:" speed={0.6} strength={1} trail={0.6}>
                  {t("aboutExperience.intro")}
                </ScrambledText>
              </p>
              <ul className="about-feature-list">
                {featureKeys.map((key, index) => (
                  <motion.li
                    initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : 0.1 + index * 0.07 }}
                    key={key}
                  >
                    <span aria-hidden="true" className="about-feature-mark" />
                    {t(key)}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <AboutArt />
          </div>
        </div>
      )}
    </motion.section>
  );
}
