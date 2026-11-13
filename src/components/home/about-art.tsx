"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useT } from "@/lib/i18n/provider";

const colors = {
  teal: "#14B8A6",
  orange: "#F97316",
  blue: "#38BDF8",
  purple: "#8B5CF6",
  white: "#F5F3FF",
};

function MeasurementScene() {
  return (
    <svg aria-hidden="true" className="about-scene-svg" viewBox="0 0 480 360">
      <g fill="none" stroke={colors.white} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5">
        <path d="M75 250h330M112 250v-62h256v62" opacity=".55" />
        <path d="M145 188v-35h190v35" stroke={colors.teal} />
        <path d="M164 153v-45h152v45" stroke={colors.blue} />
        <path d="M184 108v-25h112v25" stroke={colors.white} />
        <path d="M95 128v101h26M385 128v101h-26" stroke={colors.orange} />
        <path className="scene-caliper-left" d="M95 128h92" stroke={colors.teal} />
        <path className="scene-caliper-right" d="M385 128h-92" stroke={colors.teal} />
        <path d="M240 72v-28m-12 14h24" stroke={colors.orange} />
      </g>
      <path d="M135 270h210" stroke={colors.white} strokeDasharray="5 12" strokeOpacity=".35" strokeWidth="3" />
    </svg>
  );
}

function SpcScene() {
  return (
    <svg aria-hidden="true" className="about-scene-svg" viewBox="0 0 480 360">
      <path d="M65 275h350M65 75v200" fill="none" stroke={colors.white} strokeOpacity=".55" strokeWidth="4" />
      <path d="M75 185h330" fill="none" stroke={colors.white} strokeDasharray="9 9" strokeOpacity=".45" strokeWidth="3" />
      <path className="scene-chart-line" d="m82 222 55-30 52 17 58-83 56 39 54-46 54 29" fill="none" stroke={colors.teal} strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
      {[["137", "192", colors.blue], ["189", "209", colors.teal], ["247", "126", colors.orange], ["303", "165", colors.teal], ["357", "119", colors.blue], ["411", "148", colors.teal]].map(([cx, cy, fill], index) => (
        <circle className={`scene-chart-point scene-chart-point-${index}`} cx={cx} cy={cy} fill={fill} key={index} r="8" />
      ))}
    </svg>
  );
}

function TraceabilityScene() {
  return (
    <svg aria-hidden="true" className="about-scene-svg" viewBox="0 0 480 360">
      <path d="M70 180h340" fill="none" stroke={colors.white} strokeOpacity=".35" strokeWidth="5" />
      <path className="scene-trace-pulse" d="M70 180h340" fill="none" stroke={colors.teal} strokeLinecap="round" strokeWidth="5" />
      {[["90", colors.teal], ["190", colors.blue], ["290", colors.purple], ["390", colors.orange]].map(([cx, color], index) => (
        <g className={`scene-trace-node scene-trace-node-${index}`} key={index}>
          <circle cx={cx} cy="180" fill="#0F081F" r="25" stroke={color} strokeWidth="5" />
          <circle cx={cx} cy="180" fill={color} r="8" />
          <path d={`M${cx} 213v35`} stroke={colors.white} strokeOpacity=".6" strokeWidth="3" />
        </g>
      ))}
      <circle className="scene-trace-dot" cx="70" cy="180" fill={colors.white} r="9" />
    </svg>
  );
}

function GatewayScene() {
  return (
    <svg aria-hidden="true" className="about-scene-svg" viewBox="0 0 480 360">
      <g fill="none" stroke={colors.white} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
        <path d="M240 180 112 93m128 87 128-87m-128 87-128 87m128-87 128 87" opacity=".5" />
        <rect fill="#0F081F" height="94" rx="18" stroke={colors.teal} width="130" x="175" y="133" />
        <path d="M213 164h54m-54 31h54" stroke={colors.white} />
        <circle cx="240" cy="180" r="80" stroke={colors.teal} strokeOpacity=".4" />
        <circle cx="240" cy="180" r="112" stroke={colors.purple} strokeDasharray="8 12" strokeOpacity=".55" />
        {[["112", "93", colors.blue], ["368", "93", colors.orange], ["112", "267", colors.purple], ["368", "267", colors.teal]].map(([cx, cy, color]) => (
          <g key={cx + cy}>
            <circle cx={cx} cy={cy} fill="#0F081F" r="25" stroke={color} />
            <circle cx={cx} cy={cy} fill={color} r="8" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function QualityScene() {
  return (
    <svg aria-hidden="true" className="about-scene-svg" viewBox="0 0 480 360">
      <rect fill="#0F081F" height="224" rx="22" stroke={colors.white} strokeOpacity=".55" strokeWidth="4" width="280" x="100" y="68" />
      {[110, 165, 220].map((y, index) => (
        <g className={`scene-check-row scene-check-row-${index}`} key={y}>
          <rect fill="none" height="27" rx="6" stroke={index === 1 ? colors.orange : colors.teal} strokeWidth="3" width="27" x="135" y={y} />
          <path className="scene-check-tick" d={`m141 ${y + 13} 7 7 12-15`} fill="none" stroke={index === 1 ? colors.orange : colors.teal} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d={`M185 ${y + 13}h150`} stroke={colors.white} strokeLinecap="round" strokeOpacity=".7" strokeWidth="5" />
        </g>
      ))}
      <path d="M135 265h200" stroke={colors.white} strokeLinecap="round" strokeOpacity=".3" strokeWidth="4" />
    </svg>
  );
}

const sceneContent = [MeasurementScene, SpcScene, TraceabilityScene, GatewayScene, QualityScene];
const captionKeys = [
  "aboutExperience.captionMeasurement",
  "aboutExperience.captionSpc",
  "aboutExperience.captionTraceability",
  "aboutExperience.captionGateway",
  "aboutExperience.captionEvents",
] as const;

export default function AboutArt() {
  const { t } = useT();
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [canTilt, setCanTilt] = useState(false);
  const rotateX = useSpring(0, { stiffness: 180, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 24 });
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [18, -18]);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanTilt(media.matches);
    update();
    media.addEventListener("change", update);
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused || !isInView || !pageVisible || reduceMotion) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % sceneContent.length), 5000);
    return () => window.clearInterval(timer);
  }, [isInView, pageVisible, paused, reduceMotion]);

  const move = (direction: number) => {
    setActive((index) => (index + direction + sceneContent.length) % sceneContent.length);
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canTilt || reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 5);
    rotateX.set((0.5 - (event.clientY - rect.top) / rect.height) * 5);
  };
  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className="about-art-wrap"
      style={{ y: reduceMotion ? 0 : y, perspective: 1000 }}
      initial={reduceMotion ? false : { opacity: 0, x: 24, rotate: 1.5 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.15 }}
    >
      <motion.div
        className={`about-art-card${paused || !isInView || !pageVisible || reduceMotion ? " is-paused" : ""}`}
        onFocus={() => setPaused(true)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { setPaused(false); resetTilt(); }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
        }}
        ref={cardRef}
        role="region"
        aria-roledescription={t("aboutExperience.carousel")}
        aria-label={t("aboutExperience.carouselLabel")}
        style={canTilt && !reduceMotion ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
      >
        <AnimatePresence initial={false} mode="wait">
          {sceneContent.map((Scene, index) => index === active && (
            <motion.div
              aria-hidden={false}
              aria-roledescription={t("aboutExperience.slide")}
              className="about-art-slide"
              key={index}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
            >
              <Scene />
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="about-art-controls">
          <button aria-label={t("aboutExperience.previous")} className="about-art-arrow" onClick={() => move(-1)} type="button">
            <IconChevronLeft aria-hidden="true" />
          </button>
          <div aria-label={t("aboutExperience.chooseSlide")} className="flex items-center gap-1" role="group">
            {sceneContent.map((_, index) => (
              <button
                aria-label={t("aboutExperience.goToSlide", { n: index + 1 })}
                aria-current={active === index ? "true" : undefined}
                className="about-art-dot-target"
                key={index}
                onClick={() => setActive(index)}
                type="button"
              >
                <span className={`about-art-dot${active === index ? " is-active" : ""}`} />
              </button>
            ))}
          </div>
          <button aria-label={t("aboutExperience.next")} className="about-art-arrow" onClick={() => move(1)} type="button">
            <IconChevronRight aria-hidden="true" />
          </button>
        </div>
      </motion.div>
      <p aria-live="polite" className="about-art-caption">{t(captionKeys[active])}</p>
    </motion.div>
  );
}
